import React from 'react';
import { AppContextProvider } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { LandingPage } from './components/LandingPage';
import { Showroom } from './components/Showroom';
import { ProductDetail } from './components/ProductDetail';
import { Cart } from './components/Cart';
import { Checkout } from './components/Checkout';
import { TrackOrder } from './components/TrackOrder';
import { AdminLogin } from './components/AdminLogin';
import { AdminDashboard } from './components/AdminDashboard';
import { motion, AnimatePresence } from 'motion/react';
import { useAppContext } from './context/useAppContext';

const MainAppLayout: React.FC = () => {
  const { currentRoute, adminLoggedIn } = useAppContext();

  // Route router controller switch board.
  // Secure Admin check: if trying to reach dashboard without being signed in, redirect them to sign-in.
  const renderActiveRoute = () => {
    switch (currentRoute) {
      case 'home':
        return <LandingPage />;
      case 'showroom':
        return <Showroom />;
      case 'detail':
        return <ProductDetail />;
      case 'cart':
        return <Cart />;
      case 'checkout':
        return <Checkout />;
      case 'track':
        return <TrackOrder />;
      case 'admin-login':
        return <AdminLogin />;
      case 'admin-dashboard':
        return adminLoggedIn ? <AdminDashboard /> : <AdminLogin />;
      default:
        return <LandingPage />;
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 select-none pb-12 flex flex-col justify-between">
      <div>
        {/* Core Store Navbar/Toolbar */}
        <Navbar />

        {/* Dynamic transition view stage wrapped in AnimatePresence */}
        <main className="py-2">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentRoute}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.28, ease: 'easeInOut' }}
            >
              {renderActiveRoute()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Styled Footer */}
      <footer className="mt-20 border-t border-stone-200 py-10 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <span className="font-serif font-black text-stone-900 tracking-tight text-md">
              SP Home Furniture Enterprise
            </span>
            <p className="text-xs text-stone-400 mt-2 max-w-sm leading-relaxed">
              Crafting premium wood creations and architectural designs for modern spaces across the globe since 1998. Guaranteed legacy quality.
            </p>
          </div>
          
          <div>
            <span className="block font-serif font-bold text-stone-800 text-xs uppercase tracking-wider mb-3">
              Office Contacts
            </span>
            <p className="text-xs text-stone-500 leading-normal">
              74 Luxury Showroom Avenue, Suite 100 <br />
              Kuala Lumpur, Malaysia <br />
              <span className="inline-block mt-2 font-mono font-bold text-stone-700">support@sphomefurniture.com</span>
            </p>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 pt-8 border-t border-stone-200 text-center text-[10px] text-stone-400 font-mono">
          © {new Date().getFullYear()} SP HOME FURNITURE ENTERPRISE. ALL RIGHTS RESERVED.
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <AppContextProvider>
      <MainAppLayout />
    </AppContextProvider>
  );
}
