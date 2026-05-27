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
  Headphones, 
  Watch, 
  Home as HomeIcon, 
  Laptop, 
  Gamepad2, 
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  Truck,
  Heart,
  ChevronRight,
  HelpCircle,
  Eye,
  SlidersHorizontal,
  Mail,
  Star
} from 'lucide-react';
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

  const categories = [
    { name: 'Smartphones', icon: <Smartphone size={24} />, count: '4 Items' },
    { name: 'Audio', icon: <Headphones size={24} />, count: '3 Items' },
    { name: 'Wearables', icon: <Watch size={24} />, count: '3 Items' },
    { name: 'Smart Home', icon: <HomeIcon size={24} />, count: '2 Items' },
    { name: 'Laptops', icon: <Laptop size={24} />, count: '1 Item' },
    { name: 'Gaming', icon: <Gamepad2 size={24} />, count: '2 Items' },
  ];

  const brandLogos = ['Apple', 'Samsung', 'Sony', 'Bose', 'Xiaomi', 'JBL'];

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
        className="max-w-7xl mx-auto px-4 md:px-8 w-full relative overflow-hidden rounded-3xl"
      >
        <div className="absolute inset-0 bg-radial-[at_50%_40%] from-blue-600/10 via-transparent to-transparent opacity-60 pointer-events-none" />
        
        {/* Glow ambient lines in backing layout */}
        <div className="absolute -left-1/4 top-1/4 w-96 h-[1px] bg-gradient-to-r from-transparent via-blue-500 to-transparent rotate-45 blur-xs" />
        <div className="absolute -right-1/4 bottom-1/3 w-96 h-[1px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent -rotate-45 blur-xs" />

        <div className="bg-slate-900/60 rounded-3xl border border-slate-800/80 p-8 md:p-16 lg:p-24 flex flex-col lg:flex-row items-center gap-12 relative z-10">
          
          {/* Hero left text block */}
          <div className="flex-1 flex flex-col gap-6 text-center lg:text-left">
            <div className="inline-flex self-center lg:self-start items-center gap-2 bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-bold uppercase tracking-widest px-3.5 py-1.5 rounded-full">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              Next-Gen Release Dropping Now
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[1.08] font-display uppercase">
              The Future,<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-600 font-extrabold">Delivered.</span>
            </h1>
            <p className="text-slate-400 text-sm md:text-base leading-relaxed max-w-xl mx-auto lg:mx-0">
              Uncompromising craftsmanship meets bleeding-edge capability. Discover the ultimate collection of authentic multi-node smart ecosystems, audio arrays, and next-gen wearables.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mt-2">
              <button
                onClick={() => navigateTo('shop')}
                className="w-full sm:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-500 text-slate-950 font-bold hover:text-white uppercase tracking-wider text-xs rounded-xl transition-all font-display duration-300 scale-100 hover:scale-105 hover:shadow-lg active:scale-97 cursor-pointer glow-blue"
              >
                Shop All Drops
              </button>
              <button
                onClick={() => {
                  const el = document.getElementById('hot-deals');
                  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }}
                className="w-full sm:w-auto px-8 py-4 border border-slate-700 hover:border-slate-500 hover:bg-slate-800 text-slate-300 hover:text-white uppercase tracking-wider text-xs rounded-xl transition-all duration-300 cursor-pointer"
              >
                View Hot Deals
              </button>
            </div>
          </div>

          {/* Hero right visually polished image */}
          <div className="flex-1 w-full flex items-center justify-center relative">
            <div className="absolute w-72 h-72 bg-gradient-to-tr from-blue-500/20 to-cyan-500/20 rounded-full blur-3xl -z-10 animate-pulse" />
            <img 
              src="https://picsum.photos/seed/gadget_hero/600/400" 
              alt="Premium Gadget Hardware Concept" 
              className="w-full max-w-md md:max-w-lg object-contain rounded-2xl border border-slate-800 shadow-3xl transform -rotate-2 hover:rotate-0 transition-all duration-500"
              referrerPolicy="no-referrer"
            />
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
          {hotDeals.map((product) => {
            const isLiked = wishlist.includes(product.id);
            const discountPercentage = product.originalPrice 
              ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) 
              : 0;

            const isInCompare = comparisonList.some(p => p.id === product.id);

            return (
              <div 
                key={product.id}
                className="bg-slate-800/40 border border-slate-850 hover:border-slate-700 rounded-2xl p-4 flex flex-col justify-between group transition-all duration-300 relative hover:scale-[1.01]"
              >
                {/* Sale and Discount badge */}
                {product.originalPrice && (
                  <div className="absolute top-4 left-4 z-10 flex flex-col gap-1.5">
                    <span className="bg-red-500 text-slate-950 font-bold px-2.5 py-1 rounded-full text-[10px] uppercase tracking-wider shadow-md">
                      -{discountPercentage}%
                    </span>
                    <span className="bg-slate-900 border border-slate-850 text-slate-100 text-[9px] font-semibold px-2 py-0.5 rounded-full">
                      SALE
                    </span>
                  </div>
                )}

                {/* Heart wishlist toggle & comparison switcher controls */}
                <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
                  <button
                    onClick={() => toggleWishlist(product.id)}
                    className={`p-2 bg-slate-900/80 hover:bg-slate-900 rounded-full border transition-all cursor-pointer ${
                      isLiked ? 'border-rose-500 text-rose-500' : 'border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <Heart size={14} fill={isLiked ? 'currentColor' : 'none'} />
                  </button>

                  <button
                    onClick={() => addToComparison(product)}
                    className={`p-2 bg-slate-900/80 hover:bg-slate-900 rounded-full border transition-all cursor-pointer tooltip-top ${
                      isInCompare ? 'border-cyan-500 text-cyan-400' : 'border-slate-800 text-slate-400 hover:text-blue-400'
                    }`}
                    title={isInCompare ? 'Remove comparator' : 'Compare Specifications'}
                  >
                    <SlidersHorizontal size={14} />
                  </button>
                </div>

                {/* IMAGE FLUSH TO CARD */}
                <div 
                  className="bg-slate-950 rounded-xl p-8 mb-4 flex items-center justify-center min-h-[180px] grow relative overflow-hidden cursor-pointer"
                  onClick={() => navigateTo('product', { id: product.id })}
                >
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="max-h-36 object-contain transform group-hover:scale-105 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                  />
                  {/* Subtle details tooltip overlay on card hover */}
                  <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button 
                      onClick={(e) => { e.stopPropagation(); setQuickViewProduct(product); }}
                      className="px-4 py-2 bg-slate-900 border border-slate-700 text-xs text-white font-bold rounded-lg uppercase tracking-wider flex items-center gap-1.5 hover:bg-slate-800 scale-95 group-hover:scale-100 transition-all cursor-pointer"
                    >
                      <Eye size={12} /> Spec Quick-View
                    </button>
                  </div>
                </div>

                {/* TITLE & PRICE METADATA */}
                <div className="flex flex-col gap-1.5 mt-2">
                  <span className="text-[10px] font-mono tracking-widest text-slate-500 uppercase">{product.brand}</span>
                  <p 
                    onClick={() => navigateTo('product', { id: product.id })} 
                    className="font-display font-medium text-sm text-white hover:text-blue-400 cursor-pointer transition-colors line-clamp-1"
                  >
                    {product.name}
                  </p>

                  <div className="flex justify-between items-center mt-1">
                    <div className="flex items-center gap-1.5 text-xs text-amber-500">
                      <Star fill="currentColor" size={12} />
                      <span className="font-bold text-slate-200">{product.rating}</span>
                      <span className="text-[10px] text-slate-500">({product.reviewCount})</span>
                    </div>

                    <div className="flex items-baseline gap-1.5">
                      {product.originalPrice && (
                        <span className="text-[10px] line-through text-slate-500">${product.originalPrice}</span>
                      )}
                      <span className="text-sm font-black text-blue-400">${product.price}</span>
                    </div>
                  </div>

                  {/* Add direct addition button */}
                  <button
                    onClick={() => addToCart(product, 1)}
                    className="w-full mt-3 py-2 bg-slate-800 hover:bg-blue-600 hover:text-slate-950 text-xs font-bold uppercase tracking-wider rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer text-slate-300"
                  >
                    Quick Buy +
                  </button>
                </div>

              </div>
            );
          })}
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
