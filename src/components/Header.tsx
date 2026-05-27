/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CartItem } from '../types';
import {
  ShoppingBag,
  Heart,
  User,
  Search,
  Menu,
  X,
  Phone,
  Globe,
  SlidersHorizontal,
  ChevronDown,
} from 'lucide-react';

export default function Header() {
  const {
    currentView,
    cart,
    wishlist,
    searchQuery,
    setSearchQuery,
    navigateTo,
    userProfile,
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const cartCount = cart.reduce((t: number, i: CartItem) => t + i.quantity, 0);
  const cartTotal = cart
    .reduce((t: number, i: CartItem) => t + i.product.price * i.quantity, 0)
    .toFixed(2);
  const wishlistCount = wishlist.length;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigateTo('shop');
    }
  };

  const navLinks = [
    { label: 'Home', view: 'home' },
    { label: 'Shop', view: 'shop' },
    { label: 'Brands', view: 'brands' },
    { label: 'Our Contacts', view: 'contact' },
    { label: 'Delivery & Return', view: 'faq' },
  ];

  const handleNav = (link: typeof navLinks[0]) => {
    setMobileMenuOpen(false);
    if (link.scrollTarget) {
      if (currentView !== 'home') {
        navigateTo('home');
        setTimeout(() => {
          const el = document.getElementById(link.scrollTarget!);
          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 120);
      } else {
        const el = document.getElementById(link.scrollTarget);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    } else {
      navigateTo(link.view);
    }
  };

  return (
    <header id="main-header" className="fixed top-0 left-0 w-full z-50 bg-white shadow-sm">

      {/* ── ROW 1: Logo · Search · Support ───────────────────────────── */}
      <div className="border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 flex items-center gap-4 md:gap-6">

          {/* Logo */}
          <a
            id="header-logo"
            href="#home"
            onClick={e => { e.preventDefault(); navigateTo('home'); }}
            className="flex items-center gap-2 shrink-0 group"
          >
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center group-hover:bg-blue-700 transition-colors">
              <span className="text-white font-black text-sm leading-none">G</span>
            </div>
            <span className="text-lg md:text-xl font-black text-slate-900 tracking-tight">
              GadgetsKini<span className="text-blue-600">.</span>
            </span>
          </a>

          {/* Search bar */}
          <form
            id="search-form"
            onSubmit={handleSearchSubmit}
            className="flex-1 max-w-2xl"
          >
            <div className="flex items-center border border-slate-300 rounded-full bg-white hover:border-blue-400 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 transition-all overflow-hidden">
              <input
                type="text"
                placeholder="Search for products"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="flex-1 px-5 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 outline-none bg-transparent min-w-0"
              />
              <button
                type="submit"
                className="m-1 w-9 h-9 bg-blue-600 hover:bg-blue-700 rounded-full flex items-center justify-center text-white shrink-0 transition-colors cursor-pointer"
              >
                <Search size={15} />
              </button>
            </div>
          </form>

          {/* Support info – desktop only */}
          <div className="hidden xl:flex items-center gap-5 shrink-0">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-slate-50">
                <Phone size={18} className="text-slate-500" />
              </div>
              <div className="leading-tight">
                <p className="text-[11px] font-bold text-slate-800">24 Support</p>
                <p className="text-[11px] text-blue-600 font-semibold">+1 212-334-0212</p>
              </div>
            </div>
            <div className="w-px h-8 bg-slate-200" />
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-slate-50">
                <Globe size={18} className="text-slate-500" />
              </div>
              <div className="leading-tight">
                <p className="text-[11px] font-bold text-slate-800">Worldwide</p>
                <p className="text-[11px] text-blue-600 font-semibold">Free Shipping</p>
              </div>
            </div>
          </div>

          {/* Mobile hamburger */}
          <button
            id="btn-toggle-mobile-menu"
            aria-label="Toggle menu"
            onClick={() => setMobileMenuOpen(p => !p)}
            className="lg:hidden p-2 text-slate-500 hover:text-blue-600 transition-colors cursor-pointer"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* ── ROW 2: Categories · Nav · Actions ────────────────────────── */}
      <div className="hidden lg:block bg-slate-50/60 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 md:px-6 flex items-center h-[50px] gap-4">

          {/* All Categories pill */}
          <button
            onClick={() => navigateTo('shop')}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2 rounded-full transition-colors cursor-pointer shrink-0"
          >
            <Menu size={15} />
            All Categories
            <ChevronDown size={13} className="opacity-70" />
          </button>

          {/* Nav links */}
          <nav id="header-nav-desktop" className="flex items-center gap-1">
            {navLinks.map(link => {
              const active = currentView === link.view;
              return (
                <button
                  key={link.label}
                  id={`nav-${link.label.toLowerCase().replace(/\s/g, '-')}`}
                  onClick={() => handleNav(link)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-full transition-colors cursor-pointer whitespace-nowrap ${
                    active
                      ? 'text-blue-600 bg-blue-50 font-semibold'
                      : 'text-slate-600 hover:text-blue-600 hover:bg-slate-100'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Currency tag */}
          <div className="flex items-center gap-3 text-xs text-slate-500 font-semibold shrink-0">
            <button className="flex items-center gap-1 hover:text-slate-700 transition-colors cursor-pointer">
              USA <ChevronDown size={11} />
            </button>
            <button className="flex items-center gap-1 hover:text-slate-700 transition-colors cursor-pointer">
              USD <ChevronDown size={11} />
            </button>
          </div>

          {/* Action icons */}
          <div id="header-actions" className="flex items-center gap-1 shrink-0">

            {/* Account */}
            <button
              id="btn-account"
              aria-label="Account"
              onClick={() => navigateTo(userProfile ? 'account' : 'login')}
              className="p-2 text-slate-500 hover:text-blue-600 transition-colors cursor-pointer relative"
              title={userProfile ? userProfile.name : 'Sign In'}
            >
              <User size={20} />
            </button>

            {/* Compare (links to shop) */}
            <button
              id="btn-compare"
              aria-label="Compare"
              onClick={() => navigateTo('shop')}
              className="p-2 text-slate-500 hover:text-blue-600 transition-colors cursor-pointer relative"
            >
              <SlidersHorizontal size={20} />
              <span className="absolute -top-0.5 -right-0.5 bg-blue-600 text-white text-[8px] font-black h-4 w-4 rounded-full flex items-center justify-center leading-none">
                0
              </span>
            </button>

            {/* Wishlist */}
            <button
              id="btn-wishlist"
              aria-label="Wishlist"
              onClick={() => navigateTo('account')}
              className="p-2 text-slate-500 hover:text-blue-600 transition-colors cursor-pointer relative"
            >
              <Heart size={20} />
              <span className={`absolute -top-0.5 -right-0.5 bg-blue-600 text-white text-[8px] font-black h-4 w-4 rounded-full flex items-center justify-center leading-none ${wishlistCount === 0 ? 'opacity-60' : ''}`}>
                {wishlistCount}
              </span>
            </button>

            {/* Cart pill */}
            <button
              id="btn-cart"
              aria-label="Cart"
              onClick={() => navigateTo('cart')}
              className="ml-1 flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full pl-2.5 pr-4 py-1.5 transition-colors cursor-pointer"
            >
              <div className="relative">
                <ShoppingBag size={16} />
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-white text-blue-600 text-[8px] font-black h-3.5 w-3.5 rounded-full flex items-center justify-center leading-none">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="text-xs font-bold">${cartTotal}</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── MOBILE DRAWER ─────────────────────────────────────────────── */}
      {mobileMenuOpen && (
        <div id="mobile-drawer" className="lg:hidden bg-white border-t border-slate-200 py-4 px-4 flex flex-col gap-1 shadow-lg">
          {navLinks.map(link => (
            <button
              key={link.label}
              onClick={() => handleNav(link)}
              className={`text-left text-sm py-2.5 px-3 rounded-lg transition-colors ${
                currentView === link.view
                  ? 'text-blue-600 bg-blue-50 font-semibold'
                  : 'text-slate-700 hover:bg-slate-50 hover:text-blue-600'
              }`}
            >
              {link.label}
            </button>
          ))}

          <div className="border-t border-slate-100 mt-2 pt-3 grid grid-cols-3 gap-2">
            <button
              onClick={() => { setMobileMenuOpen(false); navigateTo(userProfile ? 'account' : 'login'); }}
              className="flex flex-col items-center gap-1.5 py-3 bg-slate-50 hover:bg-blue-50 rounded-xl text-slate-500 hover:text-blue-600 transition-colors cursor-pointer"
            >
              <User size={18} />
              <span className="text-[10px] font-semibold">Account</span>
            </button>
            <button
              onClick={() => { setMobileMenuOpen(false); navigateTo('account'); }}
              className="flex flex-col items-center gap-1.5 py-3 bg-slate-50 hover:bg-blue-50 rounded-xl text-slate-500 hover:text-blue-600 transition-colors cursor-pointer relative"
            >
              <Heart size={18} />
              <span className="text-[10px] font-semibold">Wishlist</span>
              {wishlistCount > 0 && (
                <span className="absolute top-1.5 right-3 bg-blue-600 text-white text-[8px] font-black h-4 w-4 rounded-full flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </button>
            <button
              onClick={() => { setMobileMenuOpen(false); navigateTo('cart'); }}
              className="flex flex-col items-center gap-1.5 py-3 bg-blue-600 hover:bg-blue-700 rounded-xl text-white transition-colors cursor-pointer relative"
            >
              <ShoppingBag size={18} />
              <span className="text-[10px] font-bold">${cartTotal}</span>
              {cartCount > 0 && (
                <span className="absolute top-1.5 right-3 bg-white text-blue-600 text-[8px] font-black h-4 w-4 rounded-full flex items-center justify-center">
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
