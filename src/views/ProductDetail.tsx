/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { MOCK_PRODUCTS, MOCK_REVIEWS, COLORS } from '../data';
import { Star, Heart, ShoppingCart, ShieldCheck, HelpCircle, Truck, ArrowLeft, Check, SlidersHorizontal, Eye } from 'lucide-react';

export default function ProductDetail() {
  const { 
    selectedProductId, 
    navigateTo, 
    addToCart, 
    toggleWishlist, 
    wishlist, 
    setQuickViewProduct,
    addToComparison,
    comparisonList,
    triggerToast 
  } = useApp();

  // Find target product from data
  const product = useMemo(() => {
    return MOCK_PRODUCTS.find(p => p.id === selectedProductId) || MOCK_PRODUCTS[0];
  }, [selectedProductId]);

  const isLiked = wishlist.includes(product.id);
  const isInCompare = comparisonList.some(p => p.id === product.id);

  // Gallery Active Image
  const [activeImage, setActiveImage] = useState(product.image);
  
  // Custom Zoom on Hover
  const [zoomStyle, setZoomStyle] = useState({ transform: 'scale(1)', transformOrigin: 'center' });

  // Update active image when loaded product shifts
  useEffect(() => {
    setActiveImage(product.image);
  }, [product]);

  // Swatches & Specs Selection
  const [selectedColor, setSelectedColor] = useState(COLORS[0].name);
  
  const initialStorage = product.category === 'Smartphones' 
    ? '256GB' 
    : product.category === 'Laptops' 
      ? '512GB SSD' 
      : 'Default';
  const [selectedStorage, setSelectedStorage] = useState(initialStorage);

  const [quantity, setQuantity] = useState(1);

  // Detail Tab index
  const [activeTab, setActiveTab] = useState<'desc' | 'specs' | 'box' | 'reviews'>('desc');

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomStyle({
      transform: 'scale(1.8)',
      transformOrigin: `${x}% ${y}%`,
    });
  };

  const handleMouseLeave = () => {
    setZoomStyle({ transform: 'scale(1)', transformOrigin: 'center' });
  };

  // Variant variables based on product
  const hasCapacityVariants = product.category === 'Smartphones' || product.category === 'Laptops';
  const capacities = product.category === 'Smartphones' 
    ? ['128GB', '256GB', '512GB'] 
    : ['512GB SSD', '1TB SSD'];

  const discountAmount = product.originalPrice ? product.originalPrice - product.price : 0;

  // Expected Delivery Calculation: [date + 3 days]
  const deliveryString = useMemo(() => {
    const today = new Date('2026-05-27');
    const future = new Date(today);
    future.setDate(today.getDate() + 3);
    
    // Format: "Saturday, May 30"
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric'
    }).format(future);
  }, []);

  // Quick direct buying action
  const handleBuyNow = () => {
    addToCart(product, quantity, selectedColor, selectedStorage);
    navigateTo('cart');
  };

  // Customers also bought: filter remaining 4 of same category or others
  const recommendations = useMemo(() => {
    return MOCK_PRODUCTS
      .filter(p => p.id !== product.id)
      .sort((a, b) => {
        if (a.category === product.category && b.category !== product.category) return -1;
        if (a.category !== product.category && b.category === product.category) return 1;
        return b.rating - a.rating;
      })
      .slice(0, 4);
  }, [product]);

  return (
    <div id="detail-page-container" className="pt-[110px] pb-24 max-w-7xl mx-auto px-4 md:px-8 w-full flex flex-col gap-16">
      
      {/* BREADCRUMB + BACK NAVIGATION LINKS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 text-xs text-slate-500 font-mono">
          <a href="#home" onClick={() => navigateTo('home')} className="hover:text-blue-400">Home</a>
          <span className="text-slate-700">/</span>
          <a href="#shop" onClick={() => navigateTo('shop')} className="hover:text-blue-400">Shop Catalog</a>
          <span className="text-slate-700">/</span>
          <span className="text-slate-300 font-semibold truncate max-w-[200px] sm:max-w-xs">{product.name}</span>
        </div>

        <button
          onClick={() => navigateTo('shop')}
          className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-slate-400 hover:text-white transition-colors self-start cursor-pointer"
        >
          <ArrowLeft size={14} /> Back to Catalog
        </button>
      </div>

      {/* CORE INFO SHOWCASE PANEL */}
      <section className="flex flex-col lg:flex-row gap-12 items-start">
        
        {/* LEFT GALLERY PANEL */}
        <div className="w-full lg:w-1/2 flex flex-col gap-4">
          
          {/* Main Visual box with hover magnifier */}
          <div 
            className="bg-slate-950 rounded-2xl p-8 aspect-square flex items-center justify-center border border-slate-800 relative overflow-hidden group/zoom cursor-crosshair h-[350px] sm:h-[450px]"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            <div className="absolute top-4 left-4 z-10">
              {product.originalPrice && (
                <span className="bg-red-500 text-slate-950 font-black px-3 py-1 rounded-full text-[10px] uppercase tracking-wider animate-pulse">
                  SALE DROPS
                </span>
              )}
            </div>

            <img
              src={activeImage}
              alt={product.name}
              className="max-h-full object-contain pointer-events-none transition-transform duration-100 ease-out"
              style={zoomStyle}
              referrerPolicy="no-referrer"
            />
          </div>

          {/* Miniature Swappers */}
          {(() => {
            const uniqueImages = [...new Set(product.images)];
            if (uniqueImages.length <= 1) return null;
            const colsMap: Record<number, string> = { 2: 'grid-cols-2', 3: 'grid-cols-3', 4: 'grid-cols-4', 5: 'grid-cols-5' };
            const cols = colsMap[Math.min(uniqueImages.length, 5)] ?? 'grid-cols-5';
            return (
              <div className={`grid gap-2.5 ${cols}`}>
                {uniqueImages.map((imgUrl, idx) => {
                  const isSelected = activeImage === imgUrl;
                  return (
                    <button
                      key={idx}
                      onClick={() => setActiveImage(imgUrl)}
                      className={`aspect-square p-2 bg-slate-950 rounded-xl cursor-pointer border flex items-center justify-center transition-all ${
                        isSelected ? 'border-blue-500 bg-slate-900/60 ring-2 ring-blue-500/20' : 'border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <img
                        src={imgUrl}
                        alt={`${product.name} View ${idx + 1}`}
                        className="max-h-full object-contain"
                        referrerPolicy="no-referrer"
                      />
                    </button>
                  );
                })}
              </div>
            );
          })()}
        </div>

        {/* RIGHT TECHNICAL PANEL */}
        <div className="w-full lg:w-1/2 flex flex-col gap-6">
          <div className="border-b border-slate-850 pb-6 flex flex-col gap-3">
            
            {/* Category / SKU indicators */}
            <div className="flex items-center justify-between">
              <span 
                onClick={() => navigateTo('shop')}
                className="text-xs font-mono font-bold tracking-widest text-cyan-400 uppercase cursor-pointer hover:underline"
              >
                {product.brand}
              </span>
              <span className="text-[10px] font-mono text-slate-500">
                SKU: <span className="text-slate-300">{product.sku}</span>
              </span>
            </div>

            <h1 className="text-2xl md:text-4xl font-extrabold font-display text-white tracking-tight">
              {product.name}
            </h1>

            {/* Ratings row */}
            <div className="flex items-center gap-2.5 mt-1.5">
              <div className="flex items-center text-amber-500">
                <Star fill="currentColor" size={14} />
              </div>
              <span className="text-sm font-bold text-slate-200">{product.rating}</span>
              <span className="text-slate-600">•</span>
              <button
                onClick={() => {
                  const el = document.getElementById('specs-tabs');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                  setActiveTab('reviews');
                }}
                className="text-xs text-blue-400 hover:underline cursor-pointer"
              >
                {product.reviewCount} customer reviews & ratings
              </button>
            </div>
          </div>

          {/* Pricing breakdown */}
          <div className="flex items-baseline gap-4">
            <span className="text-3xl font-black text-blue-400">${product.price}</span>
            {product.originalPrice && (
              <>
                <span className="text-base line-through text-slate-500">${product.originalPrice}</span>
                <span className="bg-green-500/10 text-green-400 border border-green-500/20 px-3 py-1 rounded-full text-xs font-bold font-mono">
                  Save ${discountAmount}
                </span>
              </>
            )}
          </div>

          {/* Bulleted short description (5 features) */}
          {product.shortFeatures.length > 0 && (
            <ul className="flex flex-col gap-1.5 text-xs text-slate-400 leading-relaxed list-inside list-disc">
              {product.shortFeatures.map((feat, i) => (
                <li key={i}>{feat}</li>
              ))}
            </ul>
          )}

          <hr className="border-slate-850" />

          {/* SWATCHES & VARIANTS SELECTORS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            
            {/* Hue selection */}
            <div className="flex flex-col gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono">
                Select Hue: {selectedColor}
              </span>
              <div className="flex items-center gap-2.5">
                {COLORS.map((col) => {
                  const isSelected = selectedColor === col.name;
                  return (
                    <button
                      key={col.name}
                      onClick={() => setSelectedColor(col.name)}
                      className={`w-7 h-7 rounded-full cursor-pointer border flex items-center justify-center transition-all ${
                        isSelected ? 'border-cyan-500 scale-110 ring-2 ring-cyan-500/25' : 'border-slate-800 hover:border-slate-600'
                      }`}
                      style={{ backgroundColor: col.hex }}
                      title={col.name}
                    >
                      {isSelected && <Check size={14} className="text-white mix-blend-difference" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Storage selection if relevant */}
            {hasCapacityVariants && (
              <div className="flex flex-col gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono">
                  Technical Capacity
                </span>
                <div className="flex gap-2">
                  {capacities.map((cap) => {
                    const isSelected = selectedStorage === cap;
                    return (
                      <button
                        key={cap}
                        onClick={() => setSelectedStorage(cap)}
                        className={`px-3 py-1.5 bg-slate-800 border rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                          isSelected ? 'border-cyan-500 text-cyan-400' : 'border-slate-700 text-slate-400 hover:text-white'
                        }`}
                      >
                        {cap}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <hr className="border-slate-850" />

          {/* QUANTITY AND CART CTAs */}
          <div className="flex flex-col sm:flex-row items-center gap-4">
            
            {/* Stepper column */}
            <div className="flex items-center border border-slate-700 bg-slate-950 rounded-xl overflow-hidden self-stretch sm:self-auto">
              <button
                onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                className="px-4 py-3 text-slate-400 hover:text-white hover:bg-slate-800/40 text-lg font-bold cursor-pointer transition-colors"
              >
                -
              </button>
              <span className="px-6 text-sm font-extrabold text-white select-none">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(prev => prev + 1)}
                className="px-4 py-3 text-slate-400 hover:text-white hover:bg-slate-800/40 text-lg font-bold cursor-pointer transition-colors"
              >
                +
              </button>
            </div>

            {/* Cart primary buttons */}
            <div className="flex-1 flex gap-3 w-full">
              <button
                onClick={() => addToCart(product, quantity, selectedColor, selectedStorage)}
                disabled={!product.inStock}
                className="flex-1 py-3.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-slate-950 hover:text-white font-black text-xs uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer font-display scale-100 hover:scale-[1.01] active:scale-[0.98] glow-blue"
              >
                <ShoppingCart size={16} /> ADD TO CART
              </button>

              <button
                onClick={handleBuyNow}
                disabled={!product.inStock}
                className="flex-1 py-3.5 border border-[#06B6D4] hover:bg-cyan-500/10 disabled:opacity-40 text-cyan-400 font-extrabold text-xs uppercase tracking-widest rounded-xl transition-all flex items-center justify-center cursor-pointer font-display"
              >
                BUY NOW DIRECT
              </button>
            </div>
          </div>

          {/* WISHLIST + SPEC COMPARE TOGGLE LINKS */}
          <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
            <button
              onClick={() => toggleWishlist(product.id)}
              className={`flex items-center gap-1.5 cursor-pointer hover:text-rose-400 transition-colors ${isLiked ? 'text-rose-400 font-bold' : ''}`}
            >
              <Heart size={14} fill={isLiked ? 'currentColor' : 'none'} />
              {isLiked ? 'In Wishlist Sequence' : 'Add to Wishlist Grid'}
            </button>

            <button
              onClick={() => addToComparison(product)}
              className={`flex items-center gap-1.5 cursor-pointer hover:text-blue-400 transition-colors ${isInCompare ? 'text-[#06B6D4] font-bold' : ''}`}
            >
              <SlidersHorizontal size={14} />
              {isInCompare ? 'Remove comparator' : 'Add to specs comparisons'}
            </button>
          </div>

          <hr className="border-slate-850" />

          {/* INSTOCK STATUS + DELIVERY FORECAST */}
          <div className="flex flex-col gap-2.5">
            <div className="flex items-center gap-2">
              <span className={`h-2.5 w-2.5 rounded-full ${product.inStock ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
              <span className={`text-[11px] font-bold uppercase tracking-wider ${product.inStock ? 'text-green-400' : 'text-red-400'}`}>
                {product.inStock ? 'In Stock — Ships within 24 hours' : 'Out of stock — Register alert'}
              </span>
            </div>

            <div className="flex items-center gap-2 text-slate-400 text-xs">
              <Truck size={14} className="text-slate-500" />
              <span>Transit Delivery Expected:</span>
              <span className="text-slate-200 font-bold font-mono text-xs">{deliveryString}</span>
            </div>
          </div>

          {/* SECURE CHECKOUT SHIELD ICON */}
          <div className="border border-slate-800 bg-slate-900/40 p-4 rounded-xl flex items-center gap-3">
            <ShieldCheck size={20} className="text-emerald-400 shrink-0" />
            <div className="text-[10px] text-slate-400 leading-relaxed shrink">
              <p className="font-bold text-white uppercase tracking-wider mb-0.5">2-Year Comprehensive Mechanical Warranty</p>
              <span>Authentic drops checked and secured via verified multi-node gateways. Secure billing.</span>
            </div>
          </div>

        </div>
      </section>

      {/* TABS OVERLAY SCREEN BELOW DETAILED */}
      <section id="specs-tabs" className="scroll-mt-24">
        <div className="border-b border-slate-800 flex gap-4 overflow-x-auto">
          {/* TABS CONTROLLERS */}
          {[
            { tag: 'desc', label: 'Detailed Description' },
            { tag: 'specs', label: 'Technical Specifications' },
            { tag: 'box', label: 'Inside the Package' },
            { tag: 'reviews', label: `Reviews (${product.reviewCount})` },
          ].map((tabSpec) => {
            const isSel = activeTab === tabSpec.tag;
            return (
              <button
                key={tabSpec.tag}
                onClick={() => setActiveTab(tabSpec.tag as any)}
                className={`py-3.5 px-1 text-xs font-bold uppercase tracking-widest relative cursor-pointer focus:outline-none transition-colors whitespace-nowrap ${
                  isSel ? 'text-[#06B6D4]' : 'text-slate-400 hover:text-white'
                }`}
              >
                {tabSpec.label}
                {isSel && (
                  <span className="absolute bottom-0 left-0 w-full h-[2.5px] bg-[#06B6D4] rounded-full" />
                )}
              </button>
            );
          })}
        </div>

        {/* TABS VALUE BLOCK CONTAINER */}
        <div className="py-8 min-h-[200px]">
          {activeTab === 'desc' && (
            <div className="flex flex-col gap-4 text-sm text-slate-400 leading-relaxed max-w-4xl">
              {product.description.map((pText, i) => (
                <p key={i}>{pText}</p>
              ))}
            </div>
          )}

          {activeTab === 'specs' && (
            product.specifications.length > 0 ? (
              <div className="border border-slate-800 rounded-xl overflow-hidden max-w-2xl bg-slate-950/40">
                <table className="w-full text-left text-xs border-collapse">
                  <tbody>
                    {product.specifications.map((spec, i) => (
                      <tr key={i} className="border-b border-slate-850/80 last:border-0 hover:bg-slate-900/30">
                        <td className="p-3.5 font-bold text-slate-400 border-r border-slate-850/80 w-1/3 uppercase tracking-wider text-[10px] font-mono">
                          {spec.key}
                        </td>
                        <td className="p-3.5 text-slate-200">
                          {spec.value}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-xs text-slate-500 italic">Detailed specifications not available for this product.</p>
            )
          )}

          {activeTab === 'box' && (
            product.inTheBox.length > 0 ? (
              <ul className="flex flex-col gap-2.5 text-xs text-slate-350 list-inside list-disc max-w-xl">
                {product.inTheBox.map((item, i) => (
                  <li key={i} className="leading-relaxed">{item}</li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-slate-500 italic">Package contents not listed.</p>
            )
          )}

          {activeTab === 'reviews' && (
            <div className="flex flex-col gap-6 max-w-3xl">
              {MOCK_REVIEWS.map((rev) => (
                <div key={rev.id} className="p-5 border border-slate-800 bg-slate-900/20 rounded-xl flex flex-col gap-2 relative">
                  <div className="flex items-center justify-between border-b border-slate-850/50 pb-2">
                    <span className="text-sm font-semibold text-white">{rev.name}</span>
                    <span className="text-[10px] text-slate-500 font-mono">{rev.date}</span>
                  </div>
                  
                  {/* Rating display */}
                  <div className="flex items-center gap-1 text-amber-500">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star 
                        key={i} 
                        fill={i < rev.rating ? 'currentColor' : 'none'} 
                        size={12} 
                        className={i < rev.rating ? 'text-amber-500' : 'text-slate-700'}
                      />
                    ))}
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed pt-1">{rev.comment}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CUSTOMERS ALSO BOUGHT - REAL DYNAMIC REC LIST */}
      <section id="recommended-accessories-scene" className="flex flex-col gap-8">
        <h2 className="text-xl md:text-2xl font-bold font-display text-white uppercase tracking-wider border-b border-slate-800 pb-4">
          Customers Also Bought
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {recommendations.map((rec) => {
            const hasSavings = !!rec.originalPrice;
            return (
              <div
                key={rec.id}
                className="p-4 bg-white/[0.02] backdrop-blur-sm border border-slate-800 hover:border-blue-500/30 rounded-xl flex flex-col justify-between group transition-all"
              >
                <div 
                  className="bg-slate-950 p-6 rounded-lg flex items-center justify-center cursor-pointer mb-3 aspect-square relative"
                  onClick={() => navigateTo('product', { id: rec.id })}
                >
                  <img src={rec.image} alt={rec.name} className="max-h-24 object-contain group-hover:scale-105 transition-transform" referrerPolicy="no-referrer" />
                  <div className="absolute inset-0 bg-slate-900/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <button 
                      onClick={(e) => { e.stopPropagation(); setQuickViewProduct(rec); }}
                      className="px-2.5 py-1 bg-slate-900 border border-slate-700 text-[10px] font-bold text-white rounded cursor-pointer"
                    >
                      Spec View
                    </button>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <span className="text-[8px] font-mono tracking-widest text-[#06B6D4] uppercase">{rec.brand}</span>
                  <h3 
                    onClick={() => navigateTo('product', { id: rec.id })}
                    className="font-display font-semibold text-xs text-slate-200 hover:text-blue-400 cursor-pointer line-clamp-1 transition-colors"
                  >
                    {rec.name}
                  </h3>
                  
                  <div className="flex justify-between items-center mt-1">
                    <div className="flex items-center gap-1 text-[10px] text-amber-500">
                      <Star fill="currentColor" size={10} />
                      <span className="text-slate-300 font-bold">{rec.rating}</span>
                    </div>

                    <p className="text-xs font-black text-blue-400">${rec.price}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

    </div>
  );
}
