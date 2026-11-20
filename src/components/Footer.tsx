import React from 'react';
import { useApp } from '../context/AppContext';

export const Footer: React.FC = () => {
  const { navigate } = useApp();

  return (
    <footer className="bg-[#17231C] text-[#E8E4DA] mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-10 border-b border-white/10">
          <div className="md:col-span-5 space-y-3">
            <button
              type="button"
              onClick={() => navigate('home')}
              className="font-display text-2xl font-bold text-white tracking-tight"
            >
              HostelBite
            </button>
            <p className="text-sm text-[#D6D2C7] leading-relaxed max-w-md">
              Good Food. Homely Feel. Student-Friendly Prices. Connecting hostel and PG students in
              Dehradun, Uttarakhand with nearby home chefs and local food providers.
            </p>
            <p className="text-xs text-[#A9B3AC] pt-1">
              Student entrepreneurship venture prototype developed for DBS Global University ·
              Initial launch geography: Dehradun, Uttarakhand, India.
            </p>
          </div>

          <div className="md:col-span-2 space-y-2.5">
            <h3 className="text-xs font-semibold text-white tracking-wide">Student App</h3>
            <ul className="space-y-2 text-sm text-[#C7CFC9]">
              <li>
                <button
                  type="button"
                  onClick={() => navigate('home')}
                  className="hover:text-white transition-colors"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigate('explore', { category: 'All' })}
                  className="hover:text-white transition-colors"
                >
                  Explore Meals
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigate('plans')}
                  className="hover:text-white transition-colors"
                >
                  Meal Subscriptions
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigate('orders')}
                  className="hover:text-white transition-colors"
                >
                  My Orders
                </button>
              </li>
            </ul>
          </div>

          <div className="md:col-span-2 space-y-2.5">
            <h3 className="text-xs font-semibold text-white tracking-wide">Company</h3>
            <ul className="space-y-2 text-sm text-[#C7CFC9]">
              <li>
                <button
                  type="button"
                  onClick={() => navigate('about')}
                  className="hover:text-white transition-colors"
                >
                  About Us
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigate('contact')}
                  className="hover:text-white transition-colors"
                >
                  Contact &amp; FAQ
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigate('auth')}
                  className="hover:text-white transition-colors"
                >
                  Student Login
                </button>
              </li>
            </ul>
          </div>

          <div className="md:col-span-3 space-y-2.5">
            <h3 className="text-xs font-semibold text-white tracking-wide">
              Partner &amp; Management Portals
            </h3>
            <p className="text-xs text-[#A9B3AC] leading-relaxed">
              Separate operational workspaces for Dehradun home chefs and platform administrators.
            </p>
            <div className="flex flex-col items-start gap-2 pt-1 text-sm">
              <button
                type="button"
                onClick={() => navigate('provider')}
                className="text-[#F3B082] hover:text-white transition-colors font-medium"
              >
                Open Food Provider Dashboard →
              </button>
              <button
                type="button"
                onClick={() => navigate('admin')}
                className="text-[#8AD1A8] hover:text-white transition-colors font-medium"
              >
                Open Admin Dashboard →
              </button>
            </div>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-[#9AA69E]">
          <p>
            © {new Date().getFullYear()} HostelBite · Dehradun Student Meal Prototype (Demo listings
            and simulated checkout).
          </p>
          <p>All menu prices and provider listings shown are demonstration data.</p>
        </div>
      </div>
    </footer>
  );
};
