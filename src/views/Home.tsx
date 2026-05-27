/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { MOCK_PRODUCTS } from '../data';
import { Product } from '../types';
import {
  Smartphone,
  Laptop,
  Package,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  Truck,
  Heart,
  ChevronRight,
  HelpCircle,
  Mail,
} from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { motion } from 'motion/react';

export default function Home() {
  const { 
    navigateTo, 
    addToCart, 
    toggleWishlist, 
    wishlist, 
    setQuickViewProduct, 
    addToComparison, 
    comparisonList,
    triggerToast,
    setSelectedCategory
  } = useApp();

  const [dealTime, setDealTime] = useState({ hrs: 4, mins: 12, secs: 34 });
  const [newsletterEmail, setNewsletterEmail] = useState('');

  // Ticking Countdown timer for visual high-spec hot deals
  useEffect(() => {
    const interval = setInterval(() => {
      setDealTime(prev => {
        if (prev.secs > 0) {
          return { ...prev, secs: prev.secs - 1 };
        } else if (prev.mins > 0) {
          return { ...prev, mins: prev.mins - 1, secs: 59 };
        } else if (prev.hrs > 0) {
          return { hrs: prev.hrs - 1, mins: 59, secs: 59 };
        } else {
          return { hrs: 12, mins: 0, secs: 0 }; // Restart countdown loop
        }
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      triggerToast('✓ Subscribed! Prepare for weekly tech drops 🚀', 'success');
      setNewsletterEmail('');
    }
  };

  // Setup Hot Deals Grid (8 products configured with some marked isHotDeal)
  const hotDeals = MOCK_PRODUCTS.slice(0, 8);

  // Setup New Arrivals (6 products)
  const newArrivals = MOCK_PRODUCTS.filter(p => p.isNewArrival).slice(0, 6);

  // Fallback to grab more products if new arrivals are sparse
  const scrollArrivals = newArrivals.length >= 5 ? newArrivals : MOCK_PRODUCTS.slice(4, 10);

  const catCounts: Record<string, number> = {};
  for (const p of MOCK_PRODUCTS) {
    catCounts[p.category] = (catCounts[p.category] || 0) + 1;
  }
  const catIconMap: Record<string, React.ReactNode> = {
    Smartphones: <Smartphone size={24} />,
    Laptops: <Laptop size={24} />,
    Accessories: <Package size={24} />,
  };
  const categories = Object.entries(catCounts).map(([name, count]) => ({
    name,
    icon: catIconMap[name] ?? <Package size={24} />,
    count: `${count} Item${count !== 1 ? 's' : ''}`,
  }));

  const brandLogos = [...new Set(MOCK_PRODUCTS.map(p => p.brand))]
    .filter(b => b !== 'Generic')
    .slice(0, 6);

  const trustNotes = [
    { title: 'Fast Delivery', text: 'Free standard shipping on all entries over $75', icon: <Truck className="text-blue-400" size={28} /> },
    { title: '2-Year Warranty', text: 'Hardware failures resolved with priority swaps', icon: <ShieldCheck className="text-cyan-400" size={28} /> },
    { title: 'Genuine Products', text: 'Direct certificates with official production partners', icon: <TrendingUp className="text-emerald-400" size={28} /> },
    { title: '24/7 Support', text: 'Speak to live technical experts at any moment', icon: <HelpCircle className="text-amber-400" size={28} /> },
  ];

  const handleCategoryClick = (catName: string) => {
    setSelectedCategory(catName);
    navigateTo('shop');
  };

  return (
    <div id="home-view-container" className="pt-[110px] pb-16 flex flex-col gap-16 md:gap-24">
      

      {/* 2. HERO SECTION */}
      <section
  id="home-hero"
  className="relative overflow-hidden px-4 md:px-8"
>
  {/* Background wrapper */}
  <div className="max-w-7xl mx-auto relative rounded-[2rem] border border-slate-800 bg-slate-950 overflow-hidden">

    {/* Ambient gradients */}
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.18),transparent_35%)]" />
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(34,211,238,0.12),transparent_30%)]" />

    {/* Grid overlay */}
    <div className="absolute inset-0 opacity-[0.06] bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:80px_80px]" />

    {/* Glow orbs */}
    <div className="absolute top-24 left-20 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl" />
    <div className="absolute bottom-10 right-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />

    <div className="relative z-10 py-28 md:py-36 px-6 md:px-16 flex flex-col items-center text-center">

      {/* Announcement pill */}
      <div className="mb-8 inline-flex items-center gap-3 rounded-full border border-blue-500/20 bg-blue-500/10 px-5 py-2 backdrop-blur-xl">
        <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
        <span className="text-[11px] tracking-[0.25em] uppercase font-semibold text-blue-300">
          Future Tech Collection 2026
        </span>
      </div>

      {/* Main heading */}
      <h1 className="max-w-5xl text-5xl md:text-7xl lg:text-8xl font-black uppercase tracking-tight leading-[0.95] text-white">
        Redefining
        <br />
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-cyan-300 to-blue-600">
          Digital Luxury
        </span>
      </h1>

      {/* Description */}
      <p className="mt-8 max-w-2xl text-sm md:text-lg leading-relaxed text-slate-400">
        Precision-crafted ecosystems engineered for modern creators,
        gamers, and innovators. Performance, aesthetics, and intelligence —
        fused into one seamless experience.
      </p>

      {/* CTA buttons */}
      <div className="mt-12 flex flex-col sm:flex-row items-center gap-5">
        <button
          onClick={() => navigateTo('shop')}
          className="group relative overflow-hidden rounded-2xl bg-blue-600 px-10 py-4 text-xs font-bold uppercase tracking-[0.2em] text-white transition-all duration-300 hover:scale-105 hover:bg-blue-500 hover:shadow-[0_0_40px_rgba(59,130,246,0.45)]"
        >
          <span className="relative z-10">Explore Collection</span>

          <div className="absolute inset-0 translate-y-full bg-gradient-to-r from-cyan-400 to-blue-500 transition-transform duration-300 group-hover:translate-y-0" />
        </button>

        <button
          onClick={() => {
            const el = document.getElementById('hot-deals');
            if (el) {
              el.scrollIntoView({
                behavior: 'smooth',
                block: 'center',
              });
            }
          }}
          className="rounded-2xl border border-slate-700 bg-white/[0.02] px-10 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-slate-300 backdrop-blur-xl transition-all duration-300 hover:border-slate-500 hover:bg-slate-800/70 hover:text-white"
        >
          Trending Deals
        </button>
      </div>

      {/* Bottom stats */}
      <div className="mt-20 grid w-full max-w-4xl grid-cols-1 gap-6 sm:grid-cols-3">
        {[
          ['50K+', 'Elite Customers'],
          ['120+', 'Premium Products'],
          ['24/7', 'Global Support'],
        ].map(([value, label]) => (
          <div
            key={label}
            className="rounded-2xl border border-slate-800 bg-white/[0.03] px-6 py-7 backdrop-blur-md"
          >
            <div className="text-3xl font-black text-white">
              {value}
            </div>
            <div className="mt-2 text-xs uppercase tracking-[0.2em] text-slate-500">
              {label}
            </div>
          </div>
        ))}
      </div>

    </div>
  </div>
</section>

      {/* 3. FEATURED CATEGORIES ROW */}
      <section id="categories-strip" className="max-w-7xl mx-auto px-4 md:px-8 w-full">
        <div className="flex flex-col items-center gap-10">
          <div className="text-center flex flex-col gap-2">
            <h2 className="text-xs font-mono tracking-widest text-[#06B6D4] uppercase">Hardware Matrices</h2>
            <p className="text-2xl md:text-3xl font-bold font-display text-white">Featured Ecosystems</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 w-full">
            {categories.map((catSpec) => (
              <button
                key={catSpec.name}
                onClick={() => handleCategoryClick(catSpec.name)}
                className="bg-slate-800/50 hover:bg-slate-850 border border-slate-800 hover:border-blue-500/50 p-6 rounded-2xl flex flex-col items-center justify-center text-center gap-3 transition-all-custom cursor-pointer group hover:scale-[1.03]"
              >
                <div className="p-4 bg-slate-900 border border-slate-850/80 rounded-xl text-blue-400 group-hover:text-cyan-400 group-hover:bg-slate-900/40 transition-colors">
                  {catSpec.icon}
                </div>
                <div>
                  <h3 className="text-xs font-bold text-white font-display uppercase tracking-wider">{catSpec.name}</h3>
                  <p className="text-[10px] text-slate-500 mt-0.5">{catSpec.count}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 4. HOT DEALS PRODUCT GRID (With real counting timer clock) */}
      <section id="hot-deals" className="max-w-7xl mx-auto px-4 md:px-8 w-full flex flex-col gap-10 scroll-mt-24">
        
        {/* Deal Title and dynamic tick timer */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-800 pb-6">
          <div className="flex flex-col gap-2 text-center md:text-left">
            <span className="text-xs font-mono tracking-widest text-red-500 uppercase font-bold">Limited Supply Runs</span>
            <h2 className="text-2xl md:text-3xl font-bold font-display text-white">Hot Cyber Deals</h2>
          </div>

          {/* TIMER */}
          <div className="flex items-center justify-center gap-3">
            <span className="text-xs text-slate-400 font-mono">CYCLE RESETS IN:</span>
            <div className="flex items-center gap-1.5 font-mono">
              <div className="px-2.5 py-1.5 bg-red-500/10 text-red-400 border border-red-500/25 rounded-md text-xs font-extrabold">
                {String(dealTime.hrs).padStart(2, '0')}h
              </div>
              <span className="text-slate-600">:</span>
              <div className="px-2.5 py-1.5 bg-red-500/10 text-red-400 border border-red-500/25 rounded-md text-xs font-extrabold">
                {String(dealTime.mins).padStart(2, '0')}m
              </div>
              <span className="text-slate-600">:</span>
              <div className="px-2.5 py-1.5 bg-red-500/10 text-red-400 border border-red-500/25 rounded-md text-xs font-extrabold animate-pulse">
                {String(dealTime.secs).padStart(2, '0')}s
              </div>
            </div>
          </div>
        </div>

        {/* PRODUCT GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {hotDeals.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              isLiked={wishlist.includes(product.id)}
              isInCompare={comparisonList.some(p => p.id === product.id)}
              onNavigate={() => navigateTo('product', { id: product.id })}
              onWishlist={() => toggleWishlist(product.id)}
              onCompare={() => addToComparison(product)}
              onQuickView={() => setQuickViewProduct(product)}
              onAddToCart={() => addToCart(product, 1)}
            />
          ))}
        </div>
      </section>

      {/* 5. "WHY GADGETSKINI" TRUST BOCKS */}
      <section id="trust-banner" className="max-w-7xl mx-auto px-4 md:px-8 w-full">
        <div className="bg-slate-900 border border-slate-800 p-8 md:p-12 rounded-3xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {trustNotes.map((note, i) => (
            <div key={i} className="flex gap-4 items-start">
              <div className="p-3 bg-slate-850 rounded-2xl border border-slate-800">
                {note.icon}
              </div>
              <div className="flex flex-col gap-1 shrink md:shrink-0 max-w-[200px]">
                <h3 className="text-sm font-bold text-white font-display tracking-wide uppercase">{note.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{note.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. "NEW ARRIVALS" HORIZONTAL SCROLL DECK */}
      <section id="new-arrivals" className="max-w-7xl mx-auto px-4 md:px-8 w-full flex flex-col gap-10">
        <div className="flex items-end justify-between border-b border-slate-800 pb-6 shrink-0">
          <div className="flex flex-col gap-2">
            <span className="text-xs font-mono tracking-widest text-[#06B6D4] uppercase">Brand New Drop Logs</span>
            <h2 className="text-2xl md:text-3xl font-bold font-display text-white">Fresh Tech Drops</h2>
          </div>
          <button 
            onClick={() => navigateTo('shop')}
            className="text-xs font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1"
          >
            See Shop Catalog <ArrowRight size={14} />
          </button>
        </div>

        {/* SWIPING SCROLL DECK */}
        <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-thin scrollbar-track-slate-950 scrollbar-thumb-slate-850">
          {scrollArrivals.map((product) => {
            const isLiked = wishlist.includes(product.id);
            return (
              <div 
                key={product.id}
                className="bg-slate-800/20 border border-slate-850/60 rounded-xl p-4 flex flex-col justify-between shrink-0 w-64 group hover:border-slate-800 transition-colors"
              >
                <div 
                  className="bg-slate-950 rounded-lg p-6 flex items-center justify-center h-40 relative group cursor-pointer"
                  onClick={() => navigateTo('product', { id: product.id })}
                >
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="max-h-28 object-contain transform group-hover:scale-105 transition-transform"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-2 left-2 px-2 py-0.5 bg-cyan-400 text-slate-950 text-[8px] font-black uppercase rounded tracking-wider">
                    NEW
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); toggleWishlist(product.id); }}
                    className={`absolute top-2 right-2 p-1.5 rounded-full bg-slate-900/60 border ${
                      isLiked ? 'border-rose-500 text-rose-500' : 'border-slate-800 text-slate-500 hover:text-white'
                    }`}
                  >
                    <Heart size={12} fill={isLiked ? 'currentColor' : 'none'} />
                  </button>
                </div>

                <div className="mt-3 flex flex-col gap-1">
                  <span className="text-[9px] font-mono tracking-widest text-slate-500">{product.brand}</span>
                  <p 
                    onClick={() => navigateTo('product', { id: product.id })}
                    className="font-display font-medium text-xs text-white hover:text-cyan-400 cursor-pointer truncate"
                  >
                    {product.name}
                  </p>
                  <p className="text-sm font-bold text-cyan-400 mt-1">${product.price}</p>
                  
                  <button
                    onClick={() => addToCart(product, 1)}
                    className="w-full mt-2 py-1.5 bg-slate-850 hover:bg-slate-800 text-[10px] font-bold uppercase rounded text-slate-300 transition-colors"
                  >
                    Add +
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 7. BRAND LOGOS STRIP */}
      <section id="brands-strip" className="max-w-7xl mx-auto px-4 md:px-8 w-full border-y border-slate-800/80 py-10 scroll-mt-24">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="text-center md:text-left">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest font-mono">Verified Curation:</h3>
            <p className="text-slate-400 text-[10px] uppercase font-semibold leading-relaxed">Direct partner ecosystems</p>
          </div>
          
          <div className="flex flex-wrap items-center justify-center gap-10 md:gap-14">
            {brandLogos.map((bName) => (
              <span 
                key={bName}
                onClick={() => {
                  navigateTo('brands', { brand: bName });
                  triggerToast(`Transitioning to ${bName} authorized portfolio`, 'success');
                }}
                className="text-slate-500 hover:text-white text-lg font-bold font-display uppercase tracking-widest transition-colors duration-200 cursor-pointer select-none"
              >
                {bName}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* 8. NEWSLETTER CAPTURE */}
      <section id="newsletter-segment" className="max-w-7xl mx-auto px-4 md:px-8 w-full pb-10">
        <div className="bg-gradient-to-tr from-blue-900/30 via-slate-900 to-indigo-950/20 border border-slate-800/80 p-8 md:p-16 rounded-3xl flex flex-col items-center text-center gap-6 relative">
          <div className="absolute inset-0 bg-grid-white/[0.015] rounded-3xl pointer-events-none" />
          <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400">
            <Mail size={28} />
          </div>

          <div className="flex flex-col gap-2 max-w-xl">
            <h2 className="text-2xl md:text-4xl font-extrabold font-display text-white uppercase tracking-tight">Stay Ahead of Tech Drops</h2>
            <p className="text-sm text-slate-400 leading-relaxed">
              Subscribe to the weekly newsletter drop. We curate upcoming hardware designs, performance benchmarks, and push direct developer reward coupons.
            </p>
          </div>

          <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-3 w-full max-w-md mt-2">
            <input
              type="email"
              placeholder="Enter your system email e.g. janedoe@gmail.com"
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              className="flex-1 bg-slate-900/90 text-sm text-slate-100 placeholder:text-slate-500 border border-slate-700 rounded-xl px-4 py-3.5 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              required
            />
            <button
              type="submit"
              className="px-6 py-3.5 bg-[#3B82F6] hover:bg-blue-500 hover:text-slate-950 text-slate-950 font-display font-black text-xs uppercase tracking-widest rounded-xl transition-all duration-200 scale-100 hover:scale-103 cursor-pointer glow-blue"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>

    </div>
  );
}
