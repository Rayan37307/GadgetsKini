/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { MOCK_PRODUCTS } from '../data';
import { Product } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Building2, 
  Cpu, 
  Smartphone, 
  Volume2, 
  Tv, 
  Zap, 
  Star, 
  Heart, 
  Eye, 
  ShoppingBag, 
  ArrowRight, 
  Search, 
  Gauge, 
  Calendar, 
  Award,
  BookmarkCheck,
  Sparkles
} from 'lucide-react';

interface BrandMeta {
  name: string;
  tagline: string;
  established: string;
  specialty: string;
  bio: string;
  accent: string;
  borderColor: string;
  glowColor: string;
  icon: React.ReactNode;
}

export default function Brands() {
  const { navigateTo, addToCart, toggleWishlist, wishlist, setQuickViewProduct } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBrandName, setSelectedBrandName] = useState<string>('Sony');

  // Hardcoded premium brand metadata reflecting GadgetsKini's lines
  const brandList: BrandMeta[] = [
    {
      name: 'Sony',
      tagline: 'Sensory Mastery. Uncompromising cinematic and high-fidelity acoustics.',
      established: '1946',
      specialty: 'High-Resolution Noise Isolation & Direct-Drive Optics',
      bio: 'Pioneers of high-resolution audio. Sony’s active noise-canceling hardware provide absolute auditory shielding for focused developer and creative environments.',
      accent: 'from-cyan-500 to-blue-600',
      borderColor: 'border-cyan-500/30 hover:border-cyan-500/80',
      glowColor: 'shadow-cyan-950/40',
      icon: <Volume2 className="text-cyan-400 group-hover:scale-110 transition-transform duration-300" size={24} />
    },
    {
      name: 'Apple',
      tagline: 'Refined Silicon engineering meets seamless ecosystem perfection.',
      established: '1976',
      specialty: 'Premium ARM processors, High-Density displays, and Wearables',
      bio: 'Synonymous with luxurious detail and cutting-edge system-on-chip efficiency. Apple products represent the modern gold standard of computing fidelity.',
      accent: 'from-slate-400 to-slate-200',
      borderColor: 'border-slate-500/30 hover:border-slate-300/80',
      glowColor: 'shadow-slate-900/40',
      icon: <Cpu className="text-slate-300 group-hover:scale-110 transition-transform duration-300" size={24} />
    },
    {
      name: 'Samsung',
      tagline: 'Visual masters of high refresh OLED displays and raw camera optics.',
      established: '1938',
      specialty: 'AMOLED Multi-displays, High-density camera sensors & Ultra-Charging',
      bio: 'Pushing the bleeding edge of camera zoom arrays and foldable screen matrices. Samsung products are tuned for high-octane multi-taskers and power users.',
      accent: 'from-blue-600 to-indigo-500',
      borderColor: 'border-blue-500/30 hover:border-blue-500/80',
      glowColor: 'shadow-blue-950/40',
      icon: <Smartphone className="text-blue-400 group-hover:scale-110 transition-transform duration-300" size={24} />
    },
    {
      name: 'Bose',
      tagline: 'Unmatched active silence and therapeutic low-end acoustic response.',
      established: '1964',
      specialty: 'Active Noise Cancellation (ANC) & Ergonomic Audio cushions',
      bio: 'Legendary pioneers of acoustic isolating research. Bose constructs sonic sanctuaries that filter busy metropolitan noise into perfect acoustic peace.',
      accent: 'from-purple-500 to-pink-500',
      borderColor: 'border-purple-500/30 hover:border-purple-500/80',
      glowColor: 'shadow-purple-950/40',
      icon: <Building2 className="text-purple-400 group-hover:scale-110 transition-transform duration-300" size={24} />
    },
    {
      name: 'Xiaomi',
      tagline: 'Intelligent IoT interconnectivity bridging high-performance smart gear.',
      established: '2010',
      specialty: 'Google TV streamers, Connected IoT modules & Mobile accessories',
      bio: 'Pioneers of accessible smart ecosystems. Xiaomi seamlessly integrates individual smart peripherals under quick remote and voice-guided hubs.',
      accent: 'from-orange-500 to-amber-500',
      borderColor: 'border-orange-500/30 hover:border-orange-500/80',
      glowColor: 'shadow-orange-950/45',
      icon: <Tv className="text-orange-400 group-hover:scale-110 transition-transform duration-300" size={24} />
    },
    {
      name: 'Anker',
      tagline: 'Next-generation Gallium Nitride semiconductor power matrices.',
      established: '2011',
      specialty: 'GaN Heavy-duty multi-ports, Extreme battery banks & power shielding',
      bio: 'The unquestioned leaders of cellular energy efficiency. Anker micro-chargers deliver cooling, secure power delivery at triple the speeds of legacy hardware.',
      accent: 'from-emerald-500 to-teal-500',
      borderColor: 'border-emerald-500/30 hover:border-emerald-500/80',
      glowColor: 'shadow-emerald-950/40',
      icon: <Zap className="text-emerald-400 group-hover:scale-110 transition-transform duration-300" size={24} />
    }
  ];

  // Listener code for deep-links
  React.useEffect(() => {
    const parseHashParams = () => {
      const hash = window.location.hash;
      if (!hash.includes('?')) return;
      
      const part = hash.split('?')[1];
      if (part) {
        const urlParams = new URLSearchParams(part);
        const urlBrand = urlParams.get('brand');
        if (urlBrand) {
          const match = brandList.find(b => b.name.toLowerCase() === urlBrand.toLowerCase());
          if (match) {
            setSelectedBrandName(match.name);
          }
        }
      }
    };
    
    parseHashParams();
    window.addEventListener('hashchange', parseHashParams);
    return () => window.removeEventListener('hashchange', parseHashParams);
  }, []);

  // Filter brand list based on simple user typed searchQuery
  const filteredBrands = useMemo(() => {
    return brandList.filter(b => 
      b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.tagline.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  // Aggregate stats from MOCK_PRODUCTS dynamically for each brand
  const brandStats = useMemo(() => {
    const stats: Record<string, { count: number; minPrice: number; avgRating: number }> = {};
    
    brandList.forEach(b => {
      const matchProds = MOCK_PRODUCTS.filter(p => p.brand.toLowerCase() === b.name.toLowerCase());
      const count = matchProds.length;
      const minPrice = count > 0 ? Math.min(...matchProds.map(p => p.price)) : 0;
      const avgRating = count > 0 
        ? Math.round((matchProds.reduce((sum, p) => sum + p.rating, 0) / count) * 10) / 10 
        : 0;

      stats[b.name] = { count, minPrice, avgRating };
    });

    return stats;
  }, []);

  // Compute products associated with the active, selected brand view
  const activeBrandProducts = useMemo(() => {
    return MOCK_PRODUCTS.filter(p => p.brand.toLowerCase() === selectedBrandName.toLowerCase());
  }, [selectedBrandName]);

  const activeBrandMeta = useMemo(() => {
    return brandList.find(b => b.name.toLowerCase() === selectedBrandName.toLowerCase()) || brandList[0];
  }, [selectedBrandName]);

  const handleGoToBrandShop = (brand: string) => {
    navigateTo('shop', { brand });
  };

  return (
    <div id="brands-view-container" className="pt-[110px] pb-24 max-w-7xl mx-auto px-4 md:px-8 w-full flex flex-col gap-12 text-left">
      
      {/* 1. TYPOGRAPHY TITLE */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-slate-800 pb-10">
        <div className="flex flex-col gap-3 max-w-2xl">
          <span className="text-xs font-mono font-bold tracking-widest text-cyan-400 uppercase flex items-center gap-1.5">
            <Sparkles size={12} className="text-cyan-400 animate-pulse" />
            Verified Technology Hub
          </span>
          <h1 className="text-4xl md:text-6xl font-black font-display text-white uppercase tracking-tight leading-none">
            Our Partner Brands
          </h1>
          <p className="text-sm text-slate-400 leading-relaxed font-sans">
            Explore premium direct alliances spanning aerospace wearable silicon, high-resolution audio processors, and GaN extreme quick-chargers. Click any partner to inspect stats and inventory.
          </p>
        </div>

        {/* Brand Search Controller */}
        <div className="relative w-full lg:w-80 border-slate-800">
          <input
            id="brand-search"
            type="text"
            placeholder="Search manufacturers (e.g., Sony)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900/90 text-xs border border-slate-750 text-white rounded-xl pl-10 pr-4 py-3 outline-none focus:border-cyan-500 focus:bg-slate-900 transition-colors"
          />
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        </div>
      </div>

      {/* 2. MAIN LAYOUT GRID: LEFTSIDE BRANDS CARDS, RIGHTSIDE ACTIVE INVENTORY */}
      <div id="brands-grid" className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* LEFTSIDE MANUFACTURERS GRID (7cols) */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-mono font-bold uppercase tracking-widest text-[#F8FAFC]">
              Authorized Curations ({filteredBrands.length})
            </h2>
            <span className="text-xs font-mono text-slate-500">
              Select key to display catalogue
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredBrands.map((brand) => {
              const isSelected = selectedBrandName === brand.name;
              const stats = brandStats[brand.name] || { count: 0, minPrice: 0, avgRating: 0 };
              
              return (
                <button
                  key={brand.name}
                  id={`brand-btn-${brand.name.toLowerCase()}`}
                  onClick={() => setSelectedBrandName(brand.name)}
                  className={`group text-left p-5 rounded-2xl border transition-all duration-300 relative overflow-hidden flex flex-col justify-between min-h-[170px] cursor-pointer ${
                    isSelected 
                      ? `bg-slate-905 border-cyan-500 shadow-lg ${brand.glowColor} ring-1 ring-cyan-500/30` 
                      : 'bg-slate-900/50 hover:bg-slate-900 border-slate-800'
                  }`}
                >
                  {/* Backdrop Gradient for Chosen */}
                  {isSelected && (
                    <div className={`absolute top-0 right-0 h-24 w-24 bg-gradient-to-br ${brand.accent} opacity-[0.06] rounded-full blur-xl pointer-events-none`} />
                  )}

                  {/* Card head layout */}
                  <div className="flex items-start justify-between gap-4 w-full">
                    <div className="flex items-center gap-3">
                      <div className={`p-2.5 rounded-lg border transition-colors ${
                        isSelected ? 'bg-cyan-500/10 border-cyan-500/30' : 'bg-slate-950 border-slate-800'
                      }`}>
                        {brand.icon}
                      </div>
                      <div>
                        <h3 className="text-lg font-bold font-display tracking-tight text-white uppercase">
                          {brand.name}
                        </h3>
                        <span className="text-[10px] font-mono text-slate-500 tracking-wider">
                          Est. {brand.established}
                        </span>
                      </div>
                    </div>

                    <ArrowRight 
                      size={15} 
                      className={`text-slate-500 group-hover:text-cyan-400 transition-all ${
                        isSelected ? 'translate-x-1.5 text-cyan-400' : ''
                      }`} 
                    />
                  </div>

                  {/* Subtitle Tagline */}
                  <p className="text-xs text-slate-400 leading-snug font-sans mt-3 line-clamp-2">
                    {brand.tagline}
                  </p>

                  {/* Micro stats strip */}
                  <div className="flex items-center justify-between border-t border-slate-800/80 pt-3 mt-4 w-full text-[10px] font-mono text-slate-500">
                    <span className="flex items-center gap-1">
                      <BookmarkCheck size={11} className="text-[#06B6D4]" />
                      <strong>{stats.count}</strong> Items
                    </span>
                    <span>•</span>
                    <span>
                      Min <strong>${stats.minPrice}</strong>
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-0.5 text-amber-500 font-semibold">
                      <Star size={10} className="fill-amber-500" />
                      {stats.avgRating}
                    </span>
                  </div>
                </button>
              );
            })}

            {filteredBrands.length === 0 && (
              <div className="col-span-2 p-12 text-center border border-dashed border-slate-800 rounded-2xl text-slate-500 text-xs py-16">
                No manufacturers match your query. Clear query or try searching another value.
              </div>
            )}
          </div>
        </div>

        {/* RIGHTSIDE EXPANDED SELECTED BRAND STATS & DROPS (5cols) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedBrandName}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
              id="active-brand-panel"
              className="bg-slate-900 border border-slate-800/90 rounded-2xl p-6 md:p-8 flex flex-col gap-6"
            >
              {/* Brand Header & Brand Bio */}
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold tracking-widest text-[#06B6D4] uppercase">
                    ACTIVE BRAND EVALUATOR
                  </span>
                  <div className={`px-2 py-0.5 rounded text-[9px] font-mono font-extrabold uppercase border ${
                    selectedBrandName === 'Anker' ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' :
                    selectedBrandName === 'Apple' ? 'text-white bg-slate-500/10 border-slate-500/20' :
                    selectedBrandName === 'Samsung' ? 'text-blue-400 bg-blue-500/10 border-blue-500/20' :
                    selectedBrandName === 'Sony' ? 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20' :
                    selectedBrandName === 'Xiaomi' ? 'text-orange-400 bg-orange-500/10 border-orange-500/20' : 'text-purple-400 bg-purple-500/10 border-purple-500/20'
                  }`}>
                    ALLIED VENDOR
                  </div>
                </div>

                <h2 className="text-3xl font-black font-display tracking-tight text-white uppercase mt-1">
                  {activeBrandMeta.name}
                </h2>

                <p className="text-xs text-slate-400 font-sans leading-relaxed">
                  {activeBrandMeta.bio}
                </p>
              </div>

              {/* Brand stats parameters metrics */}
              <div className="grid grid-cols-2 gap-3 bg-slate-950/80 p-4 rounded-xl border border-slate-850">
                <div className="flex flex-col gap-1 text-left">
                  <span className="text-[9px] font-mono text-slate-550 uppercase">Primary Specialty</span>
                  <span className="text-xs font-semibold text-slate-200 line-clamp-1">
                    {activeBrandMeta.specialty}
                  </span>
                </div>
                <div className="flex flex-col gap-1 text-left">
                  <span className="text-[9px] font-mono text-slate-555 uppercase">Authorized Drops</span>
                  <span className="text-xs font-semibold text-slate-200">
                    {activeBrandProducts.length} Premium models
                  </span>
                </div>
              </div>

              {/* Curated Products section */}
              <div className="flex flex-col gap-4 mt-2">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-[#F8FAFC]">
                    Listed Drops
                  </h3>
                  <button
                    onClick={() => handleGoToBrandShop(activeBrandMeta.name)}
                    className="text-[10px] font-mono hover:text-[#06B6D4] text-slate-450 flex items-center gap-1 shrink-0 transition-colors"
                  >
                    View entire stock <ArrowRight size={12} />
                  </button>
                </div>

                {/* Sub-list of matched products */}
                <div className="flex flex-col gap-3.5 max-h-[340px] overflow-y-auto pr-1">
                  {activeBrandProducts.map((prod) => {
                    const isFav = wishlist.includes(prod.id);
                    return (
                      <div
                        key={prod.id}
                        className="p-3 bg-slate-950/45 rounded-xl border border-slate-850 hover:border-slate-800 transition-colors flex items-center justify-between gap-4"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={prod.image}
                            alt={prod.name}
                            referrerPolicy="no-referrer"
                            className="w-12 h-12 object-cover rounded-lg bg-slate-900 border border-slate-800 flex-shrink-0"
                          />
                          <div className="text-left w-36 sm:w-48 lg:w-40 xl:w-44">
                            <h4 className="text-xs font-bold font-display text-white truncate hover:text-[#06B6D4] leading-snug">
                              <button onClick={() => navigateTo('product-detail', { id: prod.id })} className="text-left font-semibold">
                                {prod.name}
                              </button>
                            </h4>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-[10px] font-mono font-bold text-cyan-400">
                                ${prod.price}
                              </span>
                              {prod.originalPrice && (
                                <span className="text-[9px] font-mono text-slate-500 line-through">
                                  ${prod.originalPrice}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Direct Mini Actions */}
                        <div className="flex items-center gap-1.5">
                          <button
                            title="Add to wishlist"
                            id={`brand-fav-${prod.id}`}
                            onClick={() => toggleWishlist(prod.id)}
                            className={`p-1.5 rounded-lg border cursor-pointer hover:bg-slate-900 transition-all ${
                              isFav ? 'bg-red-500/10 border-red-500/20 text-red-500' : 'bg-slate-900/50 border-slate-800 text-slate-400 hover:text-white'
                            }`}
                          >
                            <Heart size={12} className={isFav ? 'fill-red-500' : ''} />
                          </button>
                          
                          <button
                            title="Quick View specs"
                            id={`brand-qv-${prod.id}`}
                            onClick={() => setQuickViewProduct(prod)}
                            className="p-1.5 bg-slate-900/50 hover:bg-slate-900 cursor-pointer text-slate-400 hover:text-[#06B6D4] rounded-lg border border-slate-800 transition-all"
                          >
                            <Eye size={12} />
                          </button>

                          <button
                            title="Purchase drop"
                            id={`brand-add-${prod.id}`}
                            onClick={() => addToCart(prod, 1)}
                            className="p-1.5 bg-blue-600 hover:bg-blue-500 text-slate-950 hover:text-white rounded-lg border border-blue-650 transition-all cursor-pointer scale-100 active:scale-95"
                          >
                            <ShoppingBag size={12} />
                          </button>
                        </div>
                      </div>
                    );
                  })}

                  {activeBrandProducts.length === 0 && (
                    <div className="py-8 text-center text-slate-500 font-mono text-xs">
                      No matching products indexed in current inventory wave.
                    </div>
                  )}
                </div>
              </div>

              {/* Redirect Action Button */}
              <button
                onClick={() => handleGoToBrandShop(activeBrandMeta.name)}
                id="brand-action-browse"
                className={`w-full py-3 px-4 bg-gradient-to-r ${activeBrandMeta.accent} text-slate-950 font-display font-black tracking-widest uppercase hover:text-white text-xs rounded-xl transition-all duration-300 transform hover:-translate-y-0.5 flex items-center justify-center gap-2 cursor-pointer border border-[#F8FAFC22] pr-4`}
              >
                Browse complete {activeBrandMeta.name} collection <ArrowRight size={14} />
              </button>
            </motion.div>
          </AnimatePresence>
        </div>

      </div>

      {/* 3. COMPLIANCE ASSURANCE BANNER */}
      <section className="bg-slate-900 border border-slate-800 p-8 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left mt-8">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-cyan-600/10 text-cyan-400 border border-cyan-500/20 rounded-xl shrink-0 hidden sm:block">
            <Award size={22} />
          </div>
          <div>
            <h4 className="text-sm font-bold font-display uppercase tracking-wider text-white">Genuine Certification Tags</h4>
            <p className="text-xs text-slate-400 mt-1">Every partner product comes backed by official brand seals and direct-to-customer factory warranties.</p>
          </div>
        </div>

        <button
          onClick={() => navigateTo('shop')}
          className="px-5 py-3 bg-blue-600 hover:bg-blue-500 text-slate-950 hover:text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all flex items-center gap-1.5 cursor-pointer font-display font-black scale-100 hover:scale-103 duration-200"
        >
          Explore All Inventory <ArrowRight size={14} />
        </button>
      </section>

    </div>
  );
}
