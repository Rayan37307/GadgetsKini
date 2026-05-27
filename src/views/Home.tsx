/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { MOCK_PRODUCTS } from '../data';
import { Product } from '../types';
import {
  Star, Heart, ShoppingCart, ChevronRight,
  Smartphone, Laptop, Package, Headphones,
  ShieldCheck, Truck, RotateCcw, Mail, Zap,
} from 'lucide-react';

// ── WoodMart-style product card ──────────────────────────────────────────────
function WMCard({
  product,
  isLiked,
  onNavigate,
  onCart,
  onWishlist,
}: {
  product: Product;
  isLiked: boolean;
  onNavigate: () => void;
  onCart: () => void;
  onWishlist: () => void;
}) {
  const disc = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className="group bg-white border border-slate-200 rounded-xl flex flex-col overflow-hidden hover:shadow-lg transition-shadow duration-200">
      {/* Image area */}
      <div
        className="relative bg-slate-50 flex items-center justify-center h-44 p-4 cursor-pointer overflow-hidden"
        onClick={onNavigate}
      >
        <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
          {product.isNewArrival && (
            <span className="bg-green-500 text-white text-[8px] font-black px-1.5 py-0.5 rounded-sm uppercase tracking-wider">New</span>
          )}
          {product.isHotDeal && (
            <span className="bg-red-500 text-white text-[8px] font-black px-1.5 py-0.5 rounded-sm uppercase tracking-wider">Hot</span>
          )}
          {disc > 0 && (
            <span className="bg-red-500 text-white text-[8px] font-black px-1.5 py-0.5 rounded-sm uppercase">-{disc}%</span>
          )}
        </div>
        <button
          onClick={e => { e.stopPropagation(); onWishlist(); }}
          className={`absolute top-2 right-2 p-1.5 rounded-full bg-white shadow border transition-colors z-10 ${
            isLiked ? 'text-rose-500 border-rose-200' : 'text-slate-300 border-slate-200 hover:text-rose-400'
          }`}
        >
          <Heart size={13} fill={isLiked ? 'currentColor' : 'none'} />
        </button>
        <img
          src={product.image}
          alt={product.name}
          className="max-h-32 object-contain group-hover:scale-105 transition-transform duration-300"
          referrerPolicy="no-referrer"
        />
      </div>

      {/* Info area */}
      <div className="p-3 flex flex-col gap-1.5 flex-1">
        <span className="text-[9px] text-slate-400 font-mono uppercase tracking-widest">{product.brand}</span>
        <h3
          onClick={onNavigate}
          className="text-xs font-semibold text-slate-800 hover:text-blue-600 cursor-pointer line-clamp-2 leading-snug"
        >
          {product.name}
        </h3>

        {/* Stars */}
        <div className="flex items-center gap-0.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              size={10}
              className={i < Math.round(product.rating) ? 'text-amber-400 fill-amber-400' : 'text-slate-200 fill-slate-200'}
            />
          ))}
          <span className="text-[9px] text-slate-400 ml-1">({product.reviewCount})</span>
        </div>

        <p className={`text-[9px] font-semibold ${product.inStock ? 'text-green-600' : 'text-red-500'}`}>
          {product.inStock ? '✓ In stock' : '✗ Out of stock'}
        </p>

        <div className="flex items-baseline gap-1.5 mt-auto pt-1">
          <span className="text-sm font-black text-slate-900">${product.price}</span>
          {product.originalPrice && (
            <span className="text-[10px] line-through text-slate-400">${product.originalPrice}</span>
          )}
        </div>

        <button
          onClick={onCart}
          disabled={!product.inStock}
          className="w-full mt-1 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white text-[10px] font-bold uppercase tracking-wider rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <ShoppingCart size={11} />
          Add to Cart
        </button>
      </div>
    </div>
  );
}

// ── Section header ───────────────────────────────────────────────────────────
function SectionHeader({ title, onMore }: { title: string; onMore?: () => void }) {
  return (
    <div className="flex items-center justify-between mb-5">
      <h2 className="text-xl font-bold font-display text-slate-900">{title}</h2>
      {onMore && (
        <button
          onClick={onMore}
          className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 font-semibold border border-slate-200 rounded-full px-3 py-1.5 hover:border-blue-300 transition-colors"
        >
          More Products <ChevronRight size={13} />
        </button>
      )}
    </div>
  );
}

// ── Countdown box ────────────────────────────────────────────────────────────
function CountdownBox({ label, val, dark }: { label: string; val: string; dark?: boolean }) {
  return (
    <div className={`flex flex-col items-center rounded-lg px-2.5 py-1.5 min-w-[36px] ${dark ? 'bg-white/10 border border-white/20' : 'bg-white shadow-sm'}`}>
      <span className={`text-sm font-black leading-none ${dark ? 'text-white' : 'text-slate-900'}`}>{val}</span>
      <span className={`text-[7px] uppercase tracking-wider mt-0.5 ${dark ? 'text-blue-200' : 'text-slate-400'}`}>{label}</span>
    </div>
  );
}

// ── Main component ───────────────────────────────────────────────────────────
export default function Home() {
  const {
    navigateTo,
    addToCart,
    toggleWishlist,
    wishlist,
    triggerToast,
    setSelectedCategory,
  } = useApp();

  const [dealTime, setDealTime] = useState({ hrs: 4, mins: 12, secs: 34 });
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [heroSlide, setHeroSlide] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setDealTime(prev => {
        if (prev.secs > 0) return { ...prev, secs: prev.secs - 1 };
        if (prev.mins > 0) return { ...prev, mins: prev.mins - 1, secs: 59 };
        if (prev.hrs > 0) return { hrs: prev.hrs - 1, mins: 59, secs: 59 };
        return { hrs: 12, mins: 0, secs: 0 };
      });
    }, 1000);
    return () => clearInterval(id);
  }, []);

  const pad = (n: number) => String(n).padStart(2, '0');

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      triggerToast('✓ Subscribed! Weekly tech drops incoming 🚀', 'success');
      setNewsletterEmail('');
    }
  };

  // Data slices
  const deduped = (arr: Product[]) =>
    arr.filter((p, i, a) => a.findIndex(x => x.id === p.id) === i);

  const hotDeals = deduped([
    ...MOCK_PRODUCTS.filter(p => p.isHotDeal),
    ...MOCK_PRODUCTS,
  ]).slice(0, 5);

  const newArrivals = deduped([
    ...MOCK_PRODUCTS.filter(p => p.isNewArrival),
    ...MOCK_PRODUCTS,
  ]).slice(0, 4);

  const smartphones = MOCK_PRODUCTS.filter(p => p.category === 'Smartphones').slice(0, 5);
  const laptops = MOCK_PRODUCTS.filter(p => p.category === 'Laptops').slice(0, 5);
  const accessories = MOCK_PRODUCTS.filter(p => p.category === 'Accessories').slice(0, 5);

  const catCounts: Record<string, number> = {};
  for (const p of MOCK_PRODUCTS) catCounts[p.category] = (catCounts[p.category] || 0) + 1;
  const catIconMap: Record<string, React.ReactNode> = {
    Smartphones: <Smartphone size={26} />,
    Laptops: <Laptop size={26} />,
    Accessories: <Package size={26} />,
  };
  const categories = Object.entries(catCounts).map(([name, count]) => ({
    name,
    icon: catIconMap[name] ?? <Package size={26} />,
    count,
    img: MOCK_PRODUCTS.find(p => p.category === name)?.image,
  }));

  const brandLogos = [...new Set(MOCK_PRODUCTS.map(p => p.brand))]
    .filter(b => b !== 'Generic')
    .slice(0, 6);

  const promoStrip = MOCK_PRODUCTS.slice(0, 5);
  const heroP = MOCK_PRODUCTS.slice(0, 4);

  const card = (p: Product) => (
    <WMCard
      key={p.id}
      product={p}
      isLiked={wishlist.includes(p.id)}
      onNavigate={() => navigateTo('product', { id: p.id })}
      onCart={() => addToCart(p, 1)}
      onWishlist={() => toggleWishlist(p.id)}
    />
  );

  return (
    <div id="home-view" className="pb-16">

      {/* ═══════════════════════════════════════════════════════════════
          1. HERO BANNER GRID
      ═══════════════════════════════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 mb-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-3 lg:h-[390px]">

          {/* Big left banner */}
          <div className="lg:col-span-3 relative rounded-2xl overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 p-8 flex flex-col justify-between min-h-[240px]">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(99,102,241,0.3),transparent_60%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(6,182,212,0.15),transparent_50%)]" />
            <img
              src={heroP[0]?.image}
              alt="Hero product"
              className="absolute right-6 bottom-0 h-[82%] max-w-[42%] object-contain pointer-events-none"
              referrerPolicy="no-referrer"
            />
            <div className="relative z-10">
              <span className="text-[10px] font-mono tracking-[0.25em] uppercase text-cyan-400 font-semibold">
                Special Offer 2026
              </span>
              <h1 className="text-2xl md:text-4xl font-black text-white mt-2 leading-tight max-w-[260px]">
                {heroP[0]?.name?.split(' ').slice(0, 5).join(' ') || 'Premium Tech Deals'}
              </h1>
              <p className="text-slate-400 text-xs mt-2 max-w-[200px] leading-relaxed">
                Shop great deals on the latest smartphones, laptops and more.
              </p>
              <button
                onClick={() => navigateTo('shop')}
                className="mt-5 px-7 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all hover:shadow-lg"
              >
                Shop Now
              </button>
            </div>
            {/* Slide dots */}
            <div className="relative z-10 flex gap-1.5 mt-4">
              {[0, 1, 2].map(i => (
                <button
                  key={i}
                  onClick={() => setHeroSlide(i)}
                  className={`h-1.5 rounded-full transition-all ${heroSlide === i ? 'w-6 bg-white' : 'w-1.5 bg-white/30'}`}
                />
              ))}
            </div>
          </div>

          {/* Right column */}
          <div className="lg:col-span-2 grid grid-rows-[1.55fr_1fr] gap-3">

            {/* Top-right: countdown banner */}
            <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-rose-50 to-pink-100 p-5 flex flex-col justify-between min-h-[140px]">
              <img
                src={heroP[1]?.image}
                alt="Promo"
                className="absolute right-3 bottom-0 h-[78%] object-contain pointer-events-none"
                referrerPolicy="no-referrer"
              />
              <div className="relative z-10">
                <span className="text-[9px] font-mono tracking-widest uppercase text-pink-500 font-bold">New Arrival</span>
                <h3 className="text-base font-black text-slate-900 mt-0.5 max-w-[55%] leading-tight">
                  {heroP[1]?.name?.split(' ').slice(0, 4).join(' ') || 'Aurora Headset'}
                </h3>
                <p className="text-sm font-black text-slate-900 mt-1">${heroP[1]?.price}</p>
              </div>
              <div className="relative z-10 flex items-center gap-1.5 mt-2 flex-wrap">
                <CountdownBox label="HRS" val={pad(dealTime.hrs)} />
                <span className="text-slate-500 font-bold text-sm">:</span>
                <CountdownBox label="MIN" val={pad(dealTime.mins)} />
                <span className="text-slate-500 font-bold text-sm">:</span>
                <CountdownBox label="SEC" val={pad(dealTime.secs)} />
                <button
                  onClick={() => navigateTo('product', { id: heroP[1]?.id || '1' })}
                  className="ml-1 px-3 py-1.5 bg-blue-600 text-white text-[9px] font-bold uppercase tracking-wider rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Buy Now
                </button>
              </div>
            </div>

            {/* Bottom-right: two mini banners */}
            <div className="grid grid-cols-2 gap-3">
              <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-sky-50 to-blue-100 p-4 flex flex-col justify-between min-h-[100px]">
                <img
                  src={heroP[2]?.image}
                  alt="Promo"
                  className="absolute right-1 bottom-0 h-[72%] object-contain pointer-events-none opacity-90"
                  referrerPolicy="no-referrer"
                />
                <div className="relative z-10">
                  <p className="text-[8px] font-mono text-sky-600 font-bold uppercase tracking-wider">New Drop</p>
                  <h4 className="text-[11px] font-black text-slate-900 mt-0.5 max-w-[60%] leading-tight">
                    {heroP[2]?.name?.split(' ').slice(0, 3).join(' ')}
                  </h4>
                </div>
                <button
                  onClick={() => navigateTo('shop')}
                  className="relative z-10 text-[9px] font-bold text-blue-600 hover:underline"
                >
                  View Details →
                </button>
              </div>

              <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-amber-50 to-yellow-100 p-4 flex flex-col justify-between min-h-[100px]">
                <img
                  src={heroP[3]?.image}
                  alt="Promo"
                  className="absolute right-1 bottom-0 h-[72%] object-contain pointer-events-none opacity-90"
                  referrerPolicy="no-referrer"
                />
                <div className="relative z-10">
                  <p className="text-[8px] font-mono text-amber-600 font-bold uppercase tracking-wider">Flash Sale</p>
                  <h4 className="text-[11px] font-black text-slate-900 mt-0.5 max-w-[60%] leading-tight">
                    {heroP[3]?.name?.split(' ').slice(0, 3).join(' ')}
                  </h4>
                </div>
                <button
                  onClick={() => navigateTo('shop')}
                  className="relative z-10 text-[9px] font-bold text-amber-600 hover:underline"
                >
                  View Details →
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          2. POPULAR CATEGORIES
      ═══════════════════════════════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 mb-8">
        <SectionHeader title="Popular Categories" />
        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {/* All Products */}
          <button
            onClick={() => navigateTo('shop')}
            className="flex flex-col items-center gap-2 p-4 bg-white border border-slate-200 rounded-xl hover:border-blue-400 hover:shadow-sm transition-all group"
          >
            <div className="w-14 h-14 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 group-hover:bg-blue-100 transition-colors">
              <Zap size={24} />
            </div>
            <div className="text-center">
              <p className="text-[11px] font-semibold text-slate-800">All Products</p>
              <p className="text-[9px] text-slate-400 mt-0.5">{MOCK_PRODUCTS.length} items</p>
            </div>
          </button>

          {categories.map(cat => (
            <button
              key={cat.name}
              onClick={() => { setSelectedCategory(cat.name); navigateTo('shop'); }}
              className="flex flex-col items-center gap-2 p-4 bg-white border border-slate-200 rounded-xl hover:border-blue-400 hover:shadow-sm transition-all group"
            >
              <div className="w-14 h-14 bg-slate-50 rounded-full flex items-center justify-center overflow-hidden group-hover:bg-blue-50 transition-colors">
                {cat.img
                  ? <img src={cat.img} alt={cat.name} className="w-10 h-10 object-contain" referrerPolicy="no-referrer" />
                  : <span className="text-slate-500 group-hover:text-blue-600">{cat.icon}</span>
                }
              </div>
              <div className="text-center">
                <p className="text-[11px] font-semibold text-slate-800">{cat.name}</p>
                <p className="text-[9px] text-slate-400 mt-0.5">{cat.count} items</p>
              </div>
            </button>
          ))}

          {/* Brands */}
          <button
            onClick={() => navigateTo('brands')}
            className="flex flex-col items-center gap-2 p-4 bg-white border border-slate-200 rounded-xl hover:border-blue-400 hover:shadow-sm transition-all group"
          >
            <div className="w-14 h-14 bg-slate-50 rounded-full flex items-center justify-center text-slate-500 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
              <Package size={24} />
            </div>
            <div className="text-center">
              <p className="text-[11px] font-semibold text-slate-800">Brands</p>
              <p className="text-[9px] text-slate-400 mt-0.5">{brandLogos.length} brands</p>
            </div>
          </button>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          3. BEST OFFERS
      ═══════════════════════════════════════════════════════════════ */}
      <section id="hot-deals" className="max-w-7xl mx-auto px-4 md:px-6 mb-8">
        <SectionHeader title="The Best Offers" onMore={() => navigateTo('shop')} />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {hotDeals.map(p => card(p))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          4. NEW GOODS — promo banner + 4 cards
      ═══════════════════════════════════════════════════════════════ */}
      <section id="new-arrivals" className="max-w-7xl mx-auto px-4 md:px-6 mb-8">
        <SectionHeader title="New Goods" onMore={() => navigateTo('shop')} />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">

          {/* Left promo card */}
          <div className="relative rounded-xl overflow-hidden bg-gradient-to-br from-slate-900 to-indigo-950 p-5 flex flex-col justify-between min-h-[300px]">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(59,130,246,0.25),transparent_60%)]" />
            <img
              src={newArrivals[0]?.image}
              alt="New arrival"
              className="absolute bottom-16 left-1/2 -translate-x-1/2 h-[48%] object-contain pointer-events-none"
              referrerPolicy="no-referrer"
            />
            <div className="relative z-10">
              <span className="text-[9px] font-mono tracking-widest uppercase text-blue-400 font-bold">New Drop</span>
              <h3 className="text-sm font-black text-white mt-1 leading-tight max-w-[160px]">
                {newArrivals[0]?.name || 'Latest Tech'}
              </h3>
              <p className="text-lg font-black text-cyan-400 mt-1">${newArrivals[0]?.price}</p>
            </div>
            <button
              onClick={() => navigateTo('product', { id: newArrivals[0]?.id || '1' })}
              className="relative z-10 w-full py-2.5 bg-white text-slate-900 text-[10px] font-black uppercase tracking-wider rounded-lg hover:bg-blue-600 hover:text-white transition-all"
            >
              Buy Now
            </button>
          </div>

          {newArrivals.map(p => card(p))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          5. FULL-WIDTH PROMO BANNER
      ═══════════════════════════════════════════════════════════════ */}
      <section className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 py-10 mb-6">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">

            {/* Product images left */}
            <div className="hidden md:flex items-end gap-4 shrink-0">
              {promoStrip.slice(0, 3).map((p, i) => (
                <img
                  key={p.id}
                  src={p.image}
                  alt={p.name}
                  className={`object-contain pointer-events-none ${i === 1 ? 'h-32' : 'h-24'}`}
                  style={{ filter: 'drop-shadow(0 8px 20px rgba(0,0,0,0.35))' }}
                  referrerPolicy="no-referrer"
                />
              ))}
            </div>

            {/* Center */}
            <div className="text-center flex flex-col items-center gap-3">
              <span className="text-[10px] tracking-[0.3em] uppercase text-blue-200 font-semibold">
                Limited Time Deal
              </span>
              <h2 className="text-2xl md:text-4xl font-black text-white leading-tight">
                Flash Sale Event
              </h2>
              <p className="text-blue-200 text-xs max-w-xs">
                Hurry and get discounts on all products up to 20%
              </p>

              <div className="flex items-center gap-2 mt-1">
                <CountdownBox label="HRS" val={pad(dealTime.hrs)} dark />
                <span className="text-white/50 font-bold">:</span>
                <CountdownBox label="MIN" val={pad(dealTime.mins)} dark />
                <span className="text-white/50 font-bold">:</span>
                <CountdownBox label="SEC" val={pad(dealTime.secs)} dark />
              </div>

              <button
                onClick={() => navigateTo('shop')}
                className="mt-2 px-8 py-3 bg-white text-blue-700 text-xs font-black uppercase tracking-widest rounded-xl hover:bg-blue-50 transition-all hover:shadow-lg"
              >
                Go Shopping
              </button>
            </div>

            {/* Product images right */}
            <div className="hidden md:flex items-end gap-4 shrink-0">
              {promoStrip.slice(3, 5).map((p, i) => (
                <img
                  key={p.id}
                  src={p.image}
                  alt={p.name}
                  className={`object-contain pointer-events-none ${i === 0 ? 'h-32' : 'h-24'}`}
                  style={{ filter: 'drop-shadow(0 8px 20px rgba(0,0,0,0.35))' }}
                  referrerPolicy="no-referrer"
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Product strip below promo */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 mb-8">
        <div className="bg-white border border-slate-200 rounded-xl p-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
          {promoStrip.map(p => (
            <button
              key={p.id}
              onClick={() => navigateTo('product', { id: p.id })}
              className="flex flex-col items-center gap-2 p-3 hover:bg-slate-50 rounded-lg transition-colors group"
            >
              <img
                src={p.image}
                alt={p.name}
                className="h-16 object-contain group-hover:scale-105 transition-transform"
                referrerPolicy="no-referrer"
              />
              <p className="text-[10px] font-semibold text-slate-700 text-center line-clamp-1">{p.name}</p>
              <p className="text-xs font-black text-blue-600">${p.price}</p>
            </button>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          6. SMARTPHONES
      ═══════════════════════════════════════════════════════════════ */}
      {smartphones.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 md:px-6 mb-8">
          <SectionHeader
            title="Smartphones"
            onMore={() => { setSelectedCategory('Smartphones'); navigateTo('shop'); }}
          />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {smartphones.map(p => card(p))}
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════════════════════
          7. FEATURE BANNER + COLORED PROMO CARDS
      ═══════════════════════════════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 mb-8">

        {/* Feature row: large banner + single product card */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
          <div className="lg:col-span-2 relative rounded-2xl overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200 p-8 flex items-center gap-6 min-h-[180px]">
            <img
              src={MOCK_PRODUCTS[1]?.image}
              alt="Feature"
              className="h-36 object-contain shrink-0"
              referrerPolicy="no-referrer"
            />
            <div>
              <p className="text-[9px] font-mono text-slate-400 uppercase tracking-widest">Featured Collection</p>
              <h3 className="text-2xl font-black text-slate-900 mt-1">
                {MOCK_PRODUCTS[1]?.brand || 'Premium'} Accessories
              </h3>
              <p className="text-xs text-slate-500 mt-1 max-w-xs leading-relaxed">
                Personalize your setup with premium accessories crafted for performance and style.
              </p>
              <div className="flex gap-2 mt-3 flex-wrap">
                {['Cables', 'Cases', 'Chargers', 'Audio'].map(tag => (
                  <button
                    key={tag}
                    onClick={() => navigateTo('shop')}
                    className="text-[9px] font-bold text-slate-600 border border-slate-300 px-2 py-1 rounded-full hover:border-blue-400 hover:text-blue-600 transition-colors"
                  >
                    {tag}
                  </button>
                ))}
              </div>
              <button
                onClick={() => navigateTo('shop')}
                className="mt-4 px-5 py-2 bg-blue-600 text-white text-[10px] font-bold uppercase tracking-wider rounded-lg hover:bg-blue-700 transition-colors"
              >
                Shop Now
              </button>
            </div>
          </div>
          {MOCK_PRODUCTS[2] && card(MOCK_PRODUCTS[2])}
        </div>

        {/* 3 colored promo banners */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { gradient: 'from-violet-500 to-purple-700', product: MOCK_PRODUCTS[4], label: 'Top Pick' },
            { gradient: 'from-rose-500 to-pink-600', product: MOCK_PRODUCTS[5], label: 'Flash Deal' },
            { gradient: 'from-teal-500 to-cyan-600', product: MOCK_PRODUCTS[6], label: "Editor's Choice" },
          ].map(({ gradient, product, label }) =>
            product ? (
              <div
                key={product.id}
                className={`relative rounded-xl overflow-hidden bg-gradient-to-br ${gradient} p-5 flex items-center gap-4 min-h-[120px]`}
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-20 w-20 object-contain shrink-0"
                  referrerPolicy="no-referrer"
                  style={{ filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.25))' }}
                />
                <div>
                  <span className="text-[8px] font-mono text-white/70 uppercase tracking-widest">{label}</span>
                  <p className="text-sm font-black text-white mt-0.5 line-clamp-2 leading-tight">{product.name}</p>
                  <p className="text-white/80 text-xs font-bold mt-1">${product.price}</p>
                  <button
                    onClick={() => navigateTo('product', { id: product.id })}
                    className="mt-2 text-[9px] font-bold text-white border border-white/40 rounded-lg px-3 py-1 hover:bg-white/20 transition-colors"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ) : null
          )}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          8. LAPTOPS
      ═══════════════════════════════════════════════════════════════ */}
      {laptops.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 md:px-6 mb-8">
          <SectionHeader
            title="Laptops & Computers"
            onMore={() => { setSelectedCategory('Laptops'); navigateTo('shop'); }}
          />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {laptops.map(p => card(p))}
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════════════════════
          9. TRUST BADGES
      ═══════════════════════════════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 mb-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: <Truck size={22} className="text-blue-600" />, title: 'Free Delivery', text: 'On orders over $75' },
            { icon: <ShieldCheck size={22} className="text-blue-600" />, title: '2-Year Warranty', text: 'Priority hardware support' },
            { icon: <RotateCcw size={22} className="text-blue-600" />, title: 'Easy Returns', text: '30-day return policy' },
            { icon: <Headphones size={22} className="text-blue-600" />, title: '24/7 Support', text: 'Live technical experts' },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-4 p-4 bg-white border border-slate-200 rounded-xl">
              <div className="p-3 bg-blue-50 rounded-xl shrink-0">{item.icon}</div>
              <div>
                <p className="text-xs font-bold text-slate-900">{item.title}</p>
                <p className="text-[10px] text-slate-400 mt-0.5">{item.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          10. BRAND LOGOS STRIP
      ═══════════════════════════════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 mb-8 border-y border-slate-200 py-8">
        <div className="flex items-center justify-between gap-8 flex-wrap">
          <p className="text-[10px] text-slate-400 font-mono uppercase tracking-widest shrink-0">
            Verified Partners:
          </p>
          <div className="flex flex-wrap items-center gap-8 md:gap-12">
            {brandLogos.map(b => (
              <span
                key={b}
                onClick={() => navigateTo('brands')}
                className="text-slate-400 hover:text-slate-700 text-sm font-bold font-display uppercase tracking-widest transition-colors cursor-pointer select-none"
              >
                {b}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          11. NEWSLETTER
      ═══════════════════════════════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 pb-4">
        <div className="bg-blue-600 rounded-2xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col gap-2 text-center md:text-left">
            <h2 className="text-xl md:text-2xl font-black text-white">Stay Ahead of Tech Drops</h2>
            <p className="text-blue-200 text-sm max-w-sm">
              Subscribe for weekly updates, exclusive deals, and early access to new products.
            </p>
          </div>
          <form onSubmit={handleNewsletter} className="flex gap-2 w-full max-w-sm">
            <input
              type="email"
              placeholder="Enter your email"
              value={newsletterEmail}
              onChange={e => setNewsletterEmail(e.target.value)}
              className="flex-1 bg-white text-slate-900 text-sm px-4 py-3 rounded-xl focus:outline-none placeholder:text-slate-400"
              required
            />
            <button
              type="submit"
              className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-colors cursor-pointer"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>

    </div>
  );
}
