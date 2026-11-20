/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { ToastContainer } from './components/ToastContainer';
import { HomePage } from './pages/HomePage';
import { ExploreMealsPage } from './pages/ExploreMealsPage';
import { MealDetailPage } from './pages/MealDetailPage';
import { MealPlansPage } from './pages/MealPlansPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { MyOrdersPage } from './pages/MyOrdersPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { AuthAndProfilePage } from './pages/AuthAndProfilePage';
import { ProviderDashboardPage } from './pages/ProviderDashboardPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';

const AppShell: React.FC = () => {
  const { route } = useApp();

  // Keep Food Provider and Admin dashboards clearly separated from customer storefront
  if (route === 'provider') {
    return (
      <>
        <ProviderDashboardPage />
        <ToastContainer />
      </>
    );
  }

  if (route === 'admin') {
    return (
      <>
        <AdminDashboardPage />
        <ToastContainer />
      </>
    );
  }

  const renderPage = () => {
    switch (route) {
      case 'home':
        return <HomePage />;
      case 'explore':
        return <ExploreMealsPage />;
      case 'meal-detail':
        return <MealDetailPage />;
      case 'plans':
        return <MealPlansPage />;
      case 'checkout':
        return <CheckoutPage />;
      case 'orders':
        return <MyOrdersPage />;
      case 'about':
        return <AboutPage />;
      case 'contact':
        return <ContactPage />;
      case 'auth':
      case 'profile':
        return <AuthAndProfilePage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAF6] text-[#17231C]">
      <Navbar />
      <main className="flex-1">{renderPage()}</main>
      <Footer />
      <CartDrawer />
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppShell />
    </AppProvider>
  );
}
