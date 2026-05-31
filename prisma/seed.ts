import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.vendor.deleteMany();
  await prisma.user.deleteMany();

  const hashedPassword = await bcrypt.hash('password123', 10);

  const vendorUser = await prisma.user.create({
    data: {
      email: 'vendeur@rapidpieces.com',
      password: hashedPassword,
      name: 'Garage Auto Pro',
      role: 'VENDOR',
      kycStatus: 'APPROVED'
    }
  });

  const vendor = await prisma.vendor.create({
    data: {
      userId: vendorUser.id,
      shopName: 'Garage Auto Pro'
    }
  });

  console.log('Création de produits...');
  await prisma.product.createMany({
    data: [
      {
        vendorId: vendor.id,
        title: 'Plaquettes de frein Bosch avant',
        oemRef: 'BP-1234',
        category: 'Freins',
        brand: 'Bosch',
        model: 'Toyota Corolla',
        year: 2018,
        price: 45000,
        stock: 12,
        state: 'NEW',
        images: JSON.stringify(['/src/assets/images/brake_pads_1780235558702.png'])
      },
      {
        vendorId: vendor.id,
        title: 'Filtre à huile Purflux',
        oemRef: 'LS-900',
        category: 'Filtres',
        brand: 'Purflux',
        model: 'Peugeot 3008',
        year: 2020,
        price: 12000,
        stock: 50,
        state: 'NEW',
        images: JSON.stringify(['/src/assets/images/oil_filter_1780235628194.png'])
      },
      {
        vendorId: vendor.id,
        title: 'Amortisseur Monroe Avant Gauche',
        oemRef: 'M-7742',
        category: 'Suspension',
        brand: 'Monroe',
        model: 'Renault Duster',
        year: 2017,
        price: 85000,
        stock: 5,
        state: 'NEW',
        images: JSON.stringify(['/src/assets/images/shock_absorber_1780235541576.png'])
      },
      {
        vendorId: vendor.id,
        title: 'Phare LED Peugeot 3008',
        oemRef: 'LED-3008',
        category: 'Éclairage',
        brand: 'Peugeot',
        model: '3008',
        year: 2021,
        price: 125000,
        stock: 2,
        state: 'NEW',
        images: JSON.stringify(['/src/assets/images/led_headlight_1780235575069.png'])
      }
    ]
  });

  console.log('Seed terminé !');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
