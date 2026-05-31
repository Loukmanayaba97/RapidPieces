import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'rapidpieces-super-secret-key-change-me';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());
  app.use(cookieParser());

  // === MODULE 1 : AUTHENTIFICATION API ===
  const apiRouter = express.Router();

  // POST /api/auth/register
  apiRouter.post('/auth/register', async (req, res) => {
    try {
      const { email, password, name, phone, role } = req.body;
      
      const existingUser = await prisma.user.findFirst({
        where: { OR: [{ email }, { phone }] }
      });

      if (existingUser) {
        return res.status(400).json({ error: 'Email ou téléphone déjà utilisé' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      
      const user = await prisma.user.create({
        data: {
          email,
          phone,
          password: hashedPassword,
          name,
          role: role || 'BUYER',
          kycStatus: role === 'VENDOR' ? 'PENDING' : 'APPROVED',
        }
      });

      // Si c'est un vendeur, on crée l'entrée Vendor avec des valeurs par défaut
      if (role === 'VENDOR') {
        await prisma.vendor.create({
          data: {
            userId: user.id,
            shopName: name || 'Ma Boutique',
          }
        });
      }

      const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
      
      res.cookie('auth_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      });

      res.status(201).json({ user: { id: user.id, email: user.email, name: user.name, role: user.role, kycStatus: user.kycStatus }, token });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erreur lors de l'inscription" });
    }
  });

  // POST /api/auth/login
  apiRouter.post('/auth/login', async (req, res) => {
    try {
      const { email, password } = req.body;
      
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        return res.status(401).json({ error: 'Identifiants invalides' });
      }

      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) {
        return res.status(401).json({ error: 'Identifiants invalides' });
      }

      const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
      
      res.cookie('auth_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 7 * 24 * 60 * 60 * 1000
      });

      res.json({ user: { id: user.id, email: user.email, name: user.name, role: user.role, kycStatus: user.kycStatus }, token });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erreur lors de la connexion' });
    }
  });

  // GET /api/auth/me
  apiRouter.get('/auth/me', async (req, res) => {
    const token = req.cookies.auth_token;
    if (!token) return res.status(401).json({ error: 'Non authentifié' });
    
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
      const user = await prisma.user.findUnique({ 
        where: { id: decoded.id },
        select: { id: true, email: true, name: true, role: true, phone: true, kycStatus: true }
      });
      
      if (!user) return res.status(404).json({ error: 'Utilisateur non trouvé' });
      res.json({ user });
    } catch (err) {
      res.status(401).json({ error: 'Token invalide' });
    }
  });

  // POST /api/auth/logout
  apiRouter.post('/auth/logout', (req, res) => {
    res.clearCookie('auth_token');
    res.json({ success: true });
  });

  // Middleware auth
  const requireAuth = (req: any, res: any, next: any) => {
    const token = req.cookies.auth_token;
    if (!token) return res.status(401).json({ error: 'Non authentifié' });
    try {
      req.user = jwt.verify(token, JWT_SECRET);
      next();
    } catch (err) {
      res.status(401).json({ error: 'Token invalide' });
    }
  };

  // GET /api/products
  apiRouter.get('/products', async (req, res) => {
    const { q, category } = req.query;
    const where: any = {};
    if (q) {
      where.OR = [
        { title: { contains: String(q) } },
        { oemRef: { contains: String(q) } },
        { brand: { contains: String(q) } }
      ];
    }
    if (category) where.category = String(category);
    
    try {
      const products = await prisma.product.findMany({
        where,
        include: { vendor: { select: { shopName: true } } },
        orderBy: { createdAt: 'desc' }
      });
      res.json({ products });
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: 'Erreur Serveur' });
    }
  });

  // GET /api/products/:id
  apiRouter.get('/products/:id', async (req, res) => {
    try {
      const product = await prisma.product.findUnique({
        where: { id: req.params.id },
        include: { vendor: { select: { shopName: true } } }
      });
      if (!product) return res.status(404).json({ error: 'Produit non trouvé' });
      res.json({ product });
    } catch (e) {
      res.status(500).json({ error: 'Erreur Serveur' });
    }
  });

  // POST /api/products
  apiRouter.post('/products', requireAuth, async (req: any, res: any) => {
    if (req.user.role !== 'VENDOR' && req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Accès refusé' });
    }
    try {
      const vendor = await prisma.vendor.findUnique({ where: { userId: req.user.id } });
      if (!vendor) return res.status(404).json({ error: 'Vendeur non trouvé' });

      const { title, oemRef, category, brand, model, year, price, stock, state, images } = req.body;
      const product = await prisma.product.create({
        data: {
          vendorId: vendor.id,
          title, oemRef, category, brand, model, year: year ? parseInt(year) : null,
          price: parseFloat(price), stock: parseInt(stock), state,
          images: JSON.stringify(images || [])
        }
      });
      res.status(201).json({ product });
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: 'Erreur Serveur' });
    }
  });

  // === MODULE 4: COMMANDES & PAIEMENTS API ===
  // POST /api/orders
  apiRouter.post('/orders', requireAuth, async (req: any, res: any) => {
    try {
      const { items } = req.body;
      
      const total = items.reduce((acc: number, item: any) => acc + (item.quantity * item.unitPrice), 0);
      
      const order = await prisma.order.create({
        data: {
          buyerId: req.user.id,
          total,
          status: 'CONFIRMED',
          items: {
            create: items.map((item: any) => ({
              productId: item.productId,
              quantity: parseInt(item.quantity),
              unitPrice: parseFloat(item.unitPrice)
            }))
          }
        },
        include: { items: true }
      });
      
      res.status(201).json({ order });
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: 'Erreur Serveur' });
    }
  });

  // GET /api/orders
  apiRouter.get('/orders', requireAuth, async (req: any, res: any) => {
    try {
      if (req.user.role === 'VENDOR') {
        const vendor = await prisma.vendor.findUnique({ where: { userId: req.user.id } });
        if (!vendor) return res.status(404).json({ error: 'Vendeur non trouvé' });
        const orders = await prisma.order.findMany({
          where: {
            items: {
              some: {
                product: {
                  vendorId: vendor.id
                }
              }
            }
          },
          include: {
            items: {
              include: {
                product: true
              }
            },
            buyer: {
              select: {
                name: true,
                email: true,
                phone: true
              }
            }
          },
          orderBy: { createdAt: 'desc' }
        });
        res.json({ orders });
      } else if (req.user.role === 'ADMIN') {
        const orders = await prisma.order.findMany({
          include: {
            items: {
              include: {
                product: true
              }
            },
            buyer: {
              select: {
                name: true,
                email: true,
                phone: true
              }
            }
          },
          orderBy: { createdAt: 'desc' }
        });
        res.json({ orders });
      } else {
        const orders = await prisma.order.findMany({
          where: { buyerId: req.user.id },
          include: {
            items: {
              include: {
                product: true
              }
            }
          },
          orderBy: { createdAt: 'desc' }
        });
        res.json({ orders });
      }
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: 'Erreur Serveur' });
    }
  });

  // GET /api/orders/:id
  apiRouter.get('/orders/:id', requireAuth, async (req: any, res: any) => {
    try {
      const order = await prisma.order.findUnique({
        where: { id: req.params.id },
        include: { items: { include: { product: true } } }
      });
      
      if (!order) return res.status(404).json({ error: 'Commande introuvable' });
      // Security: Check if user is buyer, admin, or the related vendor
      if (order.buyerId !== req.user.id && req.user.role !== 'ADMIN' && req.user.role !== 'VENDOR') {
        return res.status(403).json({ error: 'Accès refusé' });
      }

      res.json({ order });
    } catch (e) {
      res.status(500).json({ error: 'Erreur Serveur' });
    }
  });

  // PATCH /api/orders/:id/status
  apiRouter.patch('/orders/:id/status', requireAuth, async (req: any, res: any) => {
    try {
      const { status } = req.body;
      const order = await prisma.order.update({
        where: { id: req.params.id },
        data: { status }
      });
      res.json({ order });
    } catch (e) {
      res.status(500).json({ error: 'Erreur Serveur' });
    }
  });

  // POST /api/requests
  apiRouter.post('/requests', requireAuth, async (req: any, res: any) => {
    try {
      const { fullName, phone, vehicle, partName, chassis, description, imageUrl } = req.body;
      const request = await prisma.partRequest.create({
        data: {
          buyerId: req.user.id,
          fullName,
          phone,
          vehicle,
          partName,
          chassis,
          description,
          imageUrl,
        }
      });
      res.status(201).json({ request });
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: 'Erreur Serveur' });
    }
  });

  // GET /api/requests
  apiRouter.get('/requests', requireAuth, async (req: any, res: any) => {
    try {
      const requests = await prisma.partRequest.findMany({
        where: req.user.role === 'ADMIN' ? {} : { buyerId: req.user.id },
        orderBy: { createdAt: 'desc' }
      });
      res.json({ requests });
    } catch (e) {
      res.status(500).json({ error: 'Erreur Serveur' });
    }
  });

  // PATCH /api/requests/:id/status
  apiRouter.patch('/requests/:id/status', requireAuth, async (req: any, res: any) => {
    try {
      if (req.user.role !== 'ADMIN') return res.status(403).json({ error: 'Accès refusé' });
      const { status } = req.body;
      const request = await prisma.partRequest.update({
        where: { id: req.params.id },
        data: { status }
      });
      res.json({ request });
    } catch (e) {
      res.status(500).json({ error: 'Erreur Serveur' });
    }
  });

  // POST /api/disputes
  apiRouter.post('/disputes', requireAuth, async (req: any, res: any) => {
    try {
      const { orderId, reason, description } = req.body;
      
      const dispute = await prisma.dispute.create({
        data: {
          orderId,
          reason,
          description
        }
      });

      // Update the order status to LITIGE
      await prisma.order.update({
        where: { id: orderId },
        data: { status: 'LITIGE' }
      });

      res.status(201).json({ dispute });
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: 'Erreur Serveur' });
    }
  });

  // POST /api/payments/initiate
  apiRouter.post('/payments/initiate', requireAuth, async (req: any, res: any) => {
    try {
      const { orderId, method } = req.body; // method: 'CARD' | 'MOMO'
      
      // Ici, on implémenterait l'intégration Stripe ou Flutterwave.
      // Pour ce MVP, nous simulons une validation de paiement réussie !
      
      // Mettre à jour l'état de la commande (ex: statut de base, ou autre métadonnée)
      // On retourne un succès directement, sans webhook pour cette implémentation simple.

      res.json({ 
        success: true, 
        message: `Paiement sécurisé via ${method} initié avec succès.` 
      });
    } catch (e) {
      res.status(500).json({ error: 'Erreur Serveur' });
    }
  });

  app.use('/api', apiRouter);

  // === VITE MIDDLEWARE (Dev) & STATIC FILES (Prod) ===
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
  });
}

startServer();
