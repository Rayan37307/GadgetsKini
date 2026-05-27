/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';

// Reusable Global Layout Components
import Header from './components/Header';
import Footer from './components/Footer';
import ToastContainer from './components/ToastContainer';
import QuickViewModal from './components/QuickViewModal';
import ComparisonDrawer from './components/ComparisonDrawer';

// Individual Page Views
import Home from './views/Home';
import Shop from './views/Shop';
import ProductDetail from './views/ProductDetail';
import Cart from './views/Cart';
import Checkout from './views/Checkout';
import OrderConfirmation from './views/OrderConfirmation';
import LoginRegister from './views/LoginRegister';
import MyAccount from './views/MyAccount';
import AboutUs from './views/AboutUs';
import Contact from './views/Contact';
import FAQ from './views/FAQ';
import Brands from './views/Brands';
import NotFound from './views/NotFound';

function AppContent() {
  const { currentView } = useApp();

  // Render match view based on router state
  const renderActiveView = () => {
    switch (currentView) {
      case 'home':
        return <Home />;
      case 'shop':
        return <Shop />;
      case 'product-detail':
        return <ProductDetail />;
      case 'cart':
        return <Cart />;
      case 'checkout':
        return <Checkout />;
      case 'order-confirmation':
        return <OrderConfirmation />;
      case 'login-register':
        return <LoginRegister />;
      case 'my-account':
        return <MyAccount />;
      case 'about-us':
        return <AboutUs />;
      case 'contact':
        return <Contact />;
      case 'faq':
        return <FAQ />;
      case 'brands':
        return <Brands />;
      case '404':
      default:
        return <NotFound />;
    }
  };

  return (
    <div className="min-h-screen bg-[#0F172A] text-[#F8FAFC] flex flex-col font-sans transition-colors selection:bg-[#06B6D4] selection:text-slate-950">
      {/* Sticky header controls */}
      <Header />

      {/* Primary views window */}
      <div id="content-views-frame" className="flex-1 w-full flex flex-col">
        {renderActiveView()}
      </div>

      {/* Global layouts overlays */}
      <ToastContainer />
      <QuickViewModal />
      <ComparisonDrawer />

      {/* Universal branding footer */}
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
