import React, { useState } from 'react';
import { ShoppingBag, Menu, X } from 'lucide-react';
import { useAppContext } from '../context/useAppContext';

export const Navbar: React.FC = () => {
  const { cart, currentRoute, setRoute, adminLoggedIn, logout } = useAppContext();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const cartItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const navItems = [
    { label: 'Home', route: 'home' },
    { label: 'Showroom', route: 'showroom' },
    { label: 'Track Order', route: 'track' }
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          {/* Logo Brand Section */}
          <div className="flex items-center">
            <button
              onClick={() => {
                setRoute('home');
                setMobileMenuOpen(false);
              }}
              className="flex items-center space-x-3 cursor-pointer group text-left"
            >
              <img
                src="/SP-Home-Furniture-icon.png"
                alt="SP Home Furniture"
                className="w-10 h-10 rounded object-contain bg-white shadow-sm ring-1 ring-stone-200 group-hover:ring-stone-300 transition-colors"
              />
              <div>
                <span className="block font-serif text-lg font-bold tracking-tight text-stone-900">
                  SP Home Furniture
                </span>
              </div>
            </button>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex ml-8 space-x-8 items-center">
            {navItems.map((item) => (
              <button
                key={item.route}
                onClick={() => setRoute(item.route)}
                className={`text-sm font-medium tracking-wide transition-colors cursor-pointer ${
                  currentRoute === item.route
                    ? 'text-amber-800 border-b-2 border-amber-800 py-1'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Right Action Widgets */}
          <div className="hidden md:flex items-center space-x-4">
            {adminLoggedIn ? (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => {
                    logout();
                    setRoute('home');
                  }}
                  className="text-stone-500 hover:text-stone-800 text-xs font-semibold cursor-pointer"
                >
                  Sign Out
                </button>
              </div>
            ) : null}

            {/* Shopping Cart Indicator */}
            <button
              onClick={() => setRoute('cart')}
              className="relative p-2.5 rounded-full hover:bg-stone-50 text-stone-700 hover:text-amber-800 transition-all cursor-pointer border border-transparent hover:border-stone-200"
              aria-label="View Cart"
            >
              <ShoppingBag size={21} />
              {cartItemsCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-amber-800 text-white font-mono text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center animate-pulse shadow-md">
                  {cartItemsCount}
                </span>
              )}
            </button>
          </div>

          {/* Mobile hamburger menu */}
          <div className="flex items-center space-x-3 md:hidden">
            {/* Mobile Shopping Bag */}
            <button
              onClick={() => setRoute('cart')}
              className="relative p-2 text-stone-700 hover:text-amber-800 cursor-pointer"
            >
              <ShoppingBag size={22} />
              {cartItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-amber-800 text-white font-mono text-[9px] w-5 h-5 rounded-full flex items-center justify-center shadow-sm">
                  {cartItemsCount}
                </span>
              )}
            </button>

            {/* Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-stone-700 hover:text-amber-800 rounded focus:outline-none cursor-pointer"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-stone-200 px-4 pt-2 pb-6 space-y-3 shadow-inner">
          {navItems.map((item) => (
            <button
              key={item.route}
              onClick={() => {
                setRoute(item.route);
                setMobileMenuOpen(false);
              }}
              className={`block w-full text-left py-2 font-medium text-sm border-l-2 pl-3 ${
                currentRoute === item.route
                  ? 'text-amber-800 border-amber-800 bg-amber-50/20'
                  : 'text-stone-600 border-transparent hover:bg-stone-50'
              }`}
            >
              {item.label}
            </button>
          ))}
          <div className="h-px bg-stone-200 my-2" />
          <div className="flex items-center justify-between">
            {adminLoggedIn ? (
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => {
                    setRoute('admin-dashboard');
                    setMobileMenuOpen(false);
                  }}
                  className="bg-amber-800 text-white px-3 py-1.5 rounded text-xs font-semibold uppercase tracking-wider"
                >
                  Admin Dash
                </button>
                <button
                  onClick={() => {
                    logout();
                    setRoute('home');
                    setMobileMenuOpen(false);
                  }}
                  className="text-stone-500 text-xs font-medium"
                >
                  Sign Out
                </button>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </nav>
  );
};
