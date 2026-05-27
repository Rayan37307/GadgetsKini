/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  ShoppingBag, 
  Heart, 
  User, 
  Search, 
  Menu, 
  X, 
  SlidersHorizontal,
  Layers
} from 'lucide-react';

export default function Header() {
  const { 
    currentView, 
    cart, 
    wishlist, 
    searchQuery, 
    setSearchQuery, 
    navigateTo,
    userProfile
  } = useApp();

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  
  // Track window scroll to switch backdrop blur intensities
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const wishlistCount = wishlist.length;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigateTo('shop');
      setSearchOpen(false);
    }
  };

  const navLinks = [
    { label: 'Home', href: '#home', view: 'home' },
    { label: 'Shop', href: '#shop', view: 'shop' },
    { label: 'Deals', href: '#home', scrollTarget: 'hot-deals' },
    { label: 'Brands', href: '#brands', view: 'brands' },
    { label: 'About', href: '#about', view: 'about-us' },
    { label: 'Contact', href: '#contact', view: 'contact' },
    { label: 'FAQ', href: '#faq', view: 'faq' },
  ];

  const handleLinkClick = (link: typeof navLinks[0]) => {
    setMobileMenuOpen(false);
    
    if (link.scrollTarget) {
      if (currentView !== 'home') {
        navigateTo('home');
        // Wait for render, then scroll
        setTimeout(() => {
          const el = document.getElementById(link.scrollTarget!);
          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 100);
      } else {
        const el = document.getElementById(link.scrollTarget);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    } else if (link.view) {
      navigateTo(link.view);
    }
  };

  return (
    <header 
      id="main-header"
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-[#0F172AD8] backdrop-blur-md border-b border-slate-800 py-3 shadow-lg' 
          : 'bg-transparent border-b border-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between">
        {/* LOGO */}
        <a 
          id="header-logo"
          href="#home" 
          onClick={(e) => { e.preventDefault(); navigateTo('home'); }} 
          className="flex items-center gap-2 group text-2xl font-display uppercase tracking-wider"
        >
          <span className="font-extrabold text-white group-hover:text-cyan-400 transition-colors">Gadgets</span>
          <span className="font-black text-cyan-400 group-hover:text-blue-400 transition-colors">Kini</span>
        </a>

        {/* NAVIGATION DESKTOP */}
        <nav id="header-nav-desktop" className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => {
            const isActive = currentView === link.view;
            return (
              <button
                key={link.label}
                id={`nav-${link.label.toLowerCase()}`}
                onClick={() => handleLinkClick(link)}
                className={`text-sm font-medium tracking-wide hover:text-blue-400 transition-colors cursor-pointer relative py-1 ${
                  isActive ? 'text-blue-400' : 'text-slate-300'
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 w-full h-[2px] bg-blue-500 rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* RIGHT ACTION BUTTONS */}
        <div id="header-actions" className="flex items-center gap-4">
          
          {/* SEARCH BAR (EXPANDABLE) */}
          <div className="relative flex items-center">
            {searchOpen && (
              <form 
                id="search-form"
                onSubmit={handleSearchSubmit}
                className="absolute right-8 top-1/2 -translate-y-1/2 w-48 md:w-64 animate-fade-in"
              >
                <input
                  type="text"
                  placeholder="Search tech drops..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-800/95 text-xs text-white border border-slate-700 rounded-full py-1.5 pl-3 pr-8 focus:outline-none focus:border-blue-500"
                  autoFocus
                />
                <button 
                  type="submit" 
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  <Search size={14} />
                </button>
              </form>
            )}
            <button
              id="btn-toggle-search"
              aria-label="Toggle search input"
              onClick={() => setSearchOpen(prev => !prev)}
              className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-full transition-all cursor-pointer"
            >
              {searchOpen ? <X size={20} /> : <Search size={20} />}
            </button>
          </div>

          {/* WISHLIST ICON WITH BADGE */}
          <button
            id="btn-wishlist"
            aria-label="View wishlist"
            onClick={() => navigateTo('account')}
            className="hidden lg:relative lg:inline-flex p-2 text-slate-300 hover:text-rose-400 hover:bg-slate-800 rounded-full transition-all cursor-pointer"
          >
            <Heart size={20} />
            {wishlistCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center animate-ping-once">
                {wishlistCount}
              </span>
            )}
          </button>

          {/* CART ICON WITH BADGE */}
          <button
            id="btn-cart"
            aria-label="View cart"
            onClick={() => navigateTo('cart')}
            className="hidden lg:relative lg:inline-flex p-2 text-slate-300 hover:text-cyan-400 hover:bg-slate-800 rounded-full transition-all cursor-pointer"
          >
            <ShoppingBag size={20} />
            {cartCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-cyan-500 text-slate-950 text-[10px] font-extrabold h-4 w-4 rounded-full flex items-center justify-center animate-bounce-short">
                {cartCount}
              </span>
            )}
          </button>

          {/* ACCOUNT BUTTON */}
          <button
            id="btn-account"
            aria-label="View account panel"
            onClick={() => navigateTo(userProfile ? 'account' : 'login')}
            className="hidden lg:flex p-2 text-slate-300 hover:text-blue-400 hover:bg-slate-800 rounded-full transition-all items-center gap-1.5 cursor-pointer max-w-[120px]"
          >
            <User size={20} />
            {userProfile && (
              <span className="hidden md:inline text-xs font-semibold truncate text-slate-300 max-w-[70px]">
                {userProfile.name.split(' ')[0]}
              </span>
            )}
          </button>

          {/* MOBILE HAMBURGER BUTTON */}
          <button
            id="btn-toggle-mobile-menu"
            aria-label="Toggle mobile navigation menu"
            onClick={() => setMobileMenuOpen(prev => !prev)}
            className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-full lg:hidden block cursor-pointer"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* MOBILE DRAWER (FULL SCREEN SLIDE DOWN) */}
      {mobileMenuOpen && (
        <div id="mobile-drawer" className="lg:hidden absolute top-full left-0 w-full bg-slate-900/98 backdrop-blur-xl border-b border-slate-800 py-6 px-4 flex flex-col gap-5 animate-slide-down">
          <div className="flex flex-col gap-1.5">
            {navLinks.map((link) => {
              const isActive = currentView === link.view;
              return (
                <button
                  key={link.label}
                  onClick={() => handleLinkClick(link)}
                  className={`py-2 text-left font-display text-base tracking-wide border-b border-slate-800/40 hover:pl-2 transition-all hover:text-[#06B6D4] ${
                    isActive ? 'text-[#06B6D4] font-bold' : 'text-slate-300'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </div>

          <div className="grid grid-cols-3 gap-3 border-t border-slate-800 pt-5">
            {/* 1. Account Action button */}
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                navigateTo(userProfile ? 'account' : 'login');
              }}
              className="flex flex-col items-center justify-center py-3 bg-slate-950/50 hover:bg-slate-800 border border-slate-800/80 rounded-xl transition-all cursor-pointer group text-slate-300"
            >
              <User size={18} className="group-hover:text-blue-400 transition-colors" />
              <span className="text-[10px] font-medium tracking-wide mt-1 text-slate-400 group-hover:text-white truncate max-w-full px-1">
                {userProfile ? userProfile.name.split(' ')[0] : 'Profile / Login'}
              </span>
            </button>

            {/* 2. Wishlist Action button */}
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                navigateTo('account');
              }}
              className="flex flex-col items-center justify-center py-3 bg-slate-950/50 hover:bg-slate-800 border border-slate-800/80 rounded-xl transition-all cursor-pointer group text-slate-300 relative"
            >
              <Heart size={18} className="group-hover:text-rose-400 transition-colors" />
              <span className="text-[10px] font-medium tracking-wide mt-1 text-slate-400 group-hover:text-white">
                Wishlist
              </span>
              {wishlistCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[9px] font-bold h-4 w-4 rounded-full flex items-center justify-center z-10">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* 3. Cart Action button with total checkout label */}
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                navigateTo('cart');
              }}
              className="flex flex-col items-center justify-center py-3 bg-[#06B6D4]/10 hover:bg-[#06B6D4]/20 border border-[#06B6D4]/20 rounded-xl transition-all cursor-pointer group text-cyan-400 relative"
            >
              <ShoppingBag size={18} />
              <span className="text-[10px] font-bold tracking-wide mt-1">
                Cart
              </span>
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-cyan-500 text-slate-950 text-[9px] font-extrabold h-4 w-4 rounded-full flex items-center justify-center z-10">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
