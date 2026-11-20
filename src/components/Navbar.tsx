import React, { useEffect, useRef, useState } from 'react';
import {
  ShoppingBag,
  User,
  Menu,
  X,
  ChevronDown,
  Store,
  LayoutDashboard,
  MessageSquare,
  LogOut,
  UserCircle,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PageRoute } from '../types';

export const Navbar: React.FC = () => {
  const {
    route,
    navigate,
    cartItemCount,
    setIsCartOpen,
    currentUser,
    logoutUser,
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setAccountMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  const navItems: { label: string; route: PageRoute }[] = [
    { label: 'Home', route: 'home' },
    { label: 'Explore Meals', route: 'explore' },
    { label: 'Meal Plans', route: 'plans' },
    { label: 'My Orders', route: 'orders' },
    { label: 'About Us', route: 'about' },
  ];

  const handleNavClick = (target: PageRoute) => {
    setMobileMenuOpen(false);
    setAccountMenuOpen(false);
    navigate(target, target === 'explore' ? { category: 'All' } : undefined);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FAFAF6]/95 backdrop-blur-sm border-b border-[#E5E1D6]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark */}
        <button
          type="button"
          onClick={() => handleNavClick('home')}
          className="font-display text-2xl font-bold tracking-tight text-[#1B6B44] whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-[#1B6B44] rounded"
        >
          HostelBite
        </button>

        {/* Zone 2: Primary Nav Links */}
        <nav
          className="hidden lg:flex items-center gap-7"
          aria-label="Primary navigation"
        >
          {navItems.map((item) => {
            const active = route === item.route;
            return (
              <button
                key={item.route}
                type="button"
                onClick={() => handleNavClick(item.route)}
                className={`text-sm font-medium whitespace-nowrap shrink-0 py-1 border-b-2 transition-colors ${
                  active
                    ? 'text-[#1B6B44] border-[#1B6B44]'
                    : 'text-[#56635B] border-transparent hover:text-[#17231C] hover:border-[#E5E1D6]'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Cart & Account/Portal Actions */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => setIsCartOpen(true)}
            className="relative inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-[#17231C] border border-[#E5E1D6] bg-white rounded-lg hover:bg-[#F3F0E6] transition-colors whitespace-nowrap shrink-0 min-h-[40px]"
            aria-label={`Open shopping cart with ${cartItemCount} items`}
          >
            <ShoppingBag className="w-4 h-4 text-[#1B6B44]" />
            <span className="hidden sm:inline">Cart</span>
            <span className="font-mono tabular-nums text-xs font-semibold text-[#1B6B44]">
              ({cartItemCount})
            </span>
          </button>

          <div className="relative hidden sm:block" ref={menuRef}>
            <button
              type="button"
              onClick={() => setAccountMenuOpen((v) => !v)}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-[#1B6B44] hover:bg-[#135233] rounded-lg transition-colors whitespace-nowrap shrink-0 min-h-[40px]"
              aria-expanded={accountMenuOpen}
            >
              <User className="w-4 h-4" />
              <span className="max-w-[120px] truncate">
                {currentUser ? currentUser.name.split(' ')[0] : 'Login / Portals'}
              </span>
              <ChevronDown className="w-3.5 h-3.5 opacity-80" />
            </button>

            {accountMenuOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white border border-[#E5E1D6] rounded-xl shadow-lg py-2 z-50">
                <div className="px-4 py-2.5 border-b border-[#E5E1D6]">
                  <p className="text-xs text-[#56635B]">
                    {currentUser ? 'Signed in student' : 'Browsing as guest'}
                  </p>
                  <p className="text-sm font-semibold text-[#17231C] truncate">
                    {currentUser ? currentUser.name : 'Dehradun Student Guest'}
                  </p>
                </div>

                <div className="py-1">
                  {currentUser ? (
                    <button
                      type="button"
                      onClick={() => handleNavClick('profile')}
                      className="w-full px-4 py-2 text-left text-sm text-[#17231C] hover:bg-[#F3F0E6] flex items-center gap-2.5 transition-colors"
                    >
                      <UserCircle className="w-4 h-4 text-[#1B6B44]" />
                      <span>My Student Profile</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleNavClick('auth')}
                      className="w-full px-4 py-2 text-left text-sm font-medium text-[#1B6B44] hover:bg-[#F3F0E6] flex items-center gap-2.5 transition-colors"
                    >
                      <User className="w-4 h-4" />
                      <span>Student Login / Sign Up</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => handleNavClick('contact')}
                    className="w-full px-4 py-2 text-left text-sm text-[#17231C] hover:bg-[#F3F0E6] flex items-center gap-2.5 transition-colors"
                  >
                    <MessageSquare className="w-4 h-4 text-[#56635B]" />
                    <span>Contact &amp; Support</span>
                  </button>
                </div>

                <div className="border-t border-[#E5E1D6] pt-1.5 mt-1">
                  <p className="px-4 py-1 text-[11px] font-medium text-[#56635B]">
                    Separate Platform Dashboards
                  </p>
                  <button
                    type="button"
                    onClick={() => handleNavClick('provider')}
                    className="w-full px-4 py-2 text-left text-sm text-[#17231C] hover:bg-[#F3F0E6] flex items-center gap-2.5 transition-colors"
                  >
                    <Store className="w-4 h-4 text-[#D96B27]" />
                    <span>Food Provider Dashboard</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleNavClick('admin')}
                    className="w-full px-4 py-2 text-left text-sm text-[#17231C] hover:bg-[#F3F0E6] flex items-center gap-2.5 transition-colors"
                  >
                    <LayoutDashboard className="w-4 h-4 text-[#1B6B44]" />
                    <span>Admin Dashboard</span>
                  </button>
                </div>

                {currentUser && (
                  <div className="border-t border-[#E5E1D6] pt-1 mt-1">
                    <button
                      type="button"
                      onClick={() => {
                        logoutUser();
                        setAccountMenuOpen(false);
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-[#B83B24] hover:bg-[#FDF1E8] flex items-center gap-2.5 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((v) => !v)}
            className="lg:hidden p-2.5 text-[#17231C] border border-[#E5E1D6] bg-white rounded-lg hover:bg-[#F3F0E6] transition-colors min-h-[40px] min-w-[40px] flex items-center justify-center"
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-[#E5E1D6] px-4 py-4 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.route}
              type="button"
              onClick={() => handleNavClick(item.route)}
              className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                route === item.route
                  ? 'bg-[#EAF3EE] text-[#1B6B44]'
                  : 'text-[#17231C] hover:bg-[#F3F0E6]'
              }`}
            >
              {item.label}
            </button>
          ))}
          <button
            type="button"
            onClick={() => handleNavClick('contact')}
            className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              route === 'contact'
                ? 'bg-[#EAF3EE] text-[#1B6B44]'
                : 'text-[#17231C] hover:bg-[#F3F0E6]'
            }`}
          >
            Contact &amp; Support
          </button>

          <div className="pt-3 mt-3 border-t border-[#E5E1D6] space-y-1.5">
            {currentUser ? (
              <>
                <button
                  type="button"
                  onClick={() => handleNavClick('profile')}
                  className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-semibold text-[#1B6B44] bg-[#EAF3EE]"
                >
                  My Profile ({currentUser.name})
                </button>
                <button
                  type="button"
                  onClick={() => {
                    logoutUser();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium text-[#B83B24] hover:bg-[#FDF1E8]"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => handleNavClick('auth')}
                className="w-full text-center px-4 py-2.5 rounded-lg text-sm font-semibold text-white bg-[#1B6B44]"
              >
                Student Login / Sign Up
              </button>
            )}

            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                type="button"
                onClick={() => handleNavClick('provider')}
                className="px-3 py-2.5 rounded-lg text-xs font-medium text-[#17231C] border border-[#E5E1D6] hover:bg-[#F3F0E6] text-center"
              >
                Provider Dashboard
              </button>
              <button
                type="button"
                onClick={() => handleNavClick('admin')}
                className="px-3 py-2.5 rounded-lg text-xs font-medium text-[#17231C] border border-[#E5E1D6] hover:bg-[#F3F0E6] text-center"
              >
                Admin Dashboard
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
