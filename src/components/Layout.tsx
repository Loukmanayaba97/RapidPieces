import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { Home, Search, ShoppingCart, Mail, User, Plus } from 'lucide-react';
import { cn } from '../lib/utils';
import { useAuthStore } from '../store/auth';
import { useCartStore } from '../store/cart';
import { AnimatePresence, motion } from 'motion/react';
import InstallPrompt from './InstallPrompt';

export default function AppLayout() {
  const { user } = useAuthStore();
  const { items } = useCartStore();
  const location = useLocation();

  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);

  const isVendor = user?.role === 'VENDOR';

  const navItems = [
    { icon: Home, path: '/', label: 'Accueil' },
    { icon: Search, path: '/search', label: 'Recherche' },
    isVendor 
      ? { icon: Plus, path: '/add-product', label: 'Ajouter' }
      : { icon: ShoppingCart, path: '/cart', label: 'Panier', badge: totalItems },
    { icon: Mail, path: '/contact', label: 'Contact' },
    { icon: User, path: user ? '/profile' : '/login', label: 'Profil' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-[#0B1C2E]">
      <main className="flex-1 overflow-y-auto pb-24 relative overflow-x-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.2 }}
            className="w-full min-h-full"
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>

      {/* PWA Install Prompt (conditionally shown via its own state) */}
      <InstallPrompt />

      {/* Floating Bottom Navigation */}
      <div className="fixed bottom-5 left-1/2 -translate-x-1/2 w-[88%] max-w-[420px] z-50">
        <nav className="bg-[#181a20] rounded-[3rem] px-4 py-2.5 flex items-center justify-between shadow-2xl" style={{ boxShadow: '0 8px 40px 0 rgba(0,0,0,0.45)' }}>
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || 
                             (item.path === '/login' && location.pathname === '/profile');
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className="relative w-14 h-14 flex items-center justify-center rounded-full"
              >
                {isActive && (
                  <motion.div
                    layoutId="nav-pill"
                    className="absolute inset-0 bg-white rounded-full"
                    style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.18)' }}
                    transition={{ type: "spring", stiffness: 380, damping: 28 }}
                  />
                )}
                <span className={cn("relative z-10", isActive ? "text-[#0B1C2E]" : "text-gray-500 hover:text-white transition-colors")}>
                  <item.icon className="w-[26px] h-[26px] stroke-[1.8]" />
                </span>
                
                {item.badge !== undefined && item.badge > 0 && !isActive && (
                  <span className="absolute top-2.5 right-2.5 bg-[#B91C1C] text-white text-[9px] font-bold min-w-[16px] h-4 flex items-center justify-center rounded-full px-1 ring-2 ring-[#181a20]">
                    {item.badge > 9 ? '9+' : item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
