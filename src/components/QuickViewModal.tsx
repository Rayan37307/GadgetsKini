/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { motion, AnimatePresence } from 'motion/react';
import { X, Star, ShoppingCart, Heart, ArrowUpRight, Check } from 'lucide-react';
import { COLORS } from '../data';

export default function QuickViewModal() {
  const { 
    quickViewProduct, 
    setQuickViewProduct, 
    addToCart, 
    toggleWishlist, 
    wishlist,
    navigateTo 
  } = useApp();

  const [selectedColor, setSelectedColor] = useState(COLORS[0].name);
  const [selectedSize, setSelectedSize] = useState('Default');

  if (!quickViewProduct) return null;

  const isLiked = wishlist.includes(quickViewProduct.id);
  const discountAmount = quickViewProduct.originalPrice 
    ? quickViewProduct.originalPrice - quickViewProduct.price 
    : 0;

  const handleAddToCart = () => {
    addToCart(quickViewProduct, 1, selectedColor, selectedSize);
    setQuickViewProduct(null);
  };

  const hasVariants = quickViewProduct.category === 'Smartphones' || quickViewProduct.category === 'Laptops';

  // Available capacities based on product category
  const getCapacityOptions = () => {
    if (quickViewProduct.category === 'Smartphones') return ['128GB', '256GB', '512GB'];
    if (quickViewProduct.category === 'Laptops') return ['512GB SSD', '1TB SSD'];
    return [];
  };

  const capacityOptions = getCapacityOptions();

  return (
    <AnimatePresence>
      <div 
        id="quick-view-overlay" 
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-[999] flex items-center justify-center p-4 overflow-y-auto"
        onClick={() => setQuickViewProduct(null)}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2 }}
          className="bg-slate-900 border border-slate-800 w-full max-w-4xl rounded-2xl overflow-hidden relative shadow-2xl flex flex-col md:flex-row"
          onClick={(e) => e.stopPropagation()}
        >
          {/* CLOSE BUTTON */}
          <button
            id="close-quickview-btn"
            onClick={() => setQuickViewProduct(null)}
            className="absolute top-4 right-4 text-slate-400 hover:text-white bg-slate-850 p-2 rounded-full cursor-pointer transition-colors z-10"
            aria-label="Close details dialog"
          >
            <X size={18} />
          </button>

          {/* IMAGE PORTION */}
          <div className="w-full md:w-1/2 bg-slate-950 p-8 flex items-center justify-center relative min-h-[300px]">
            <img
              src={quickViewProduct.image}
              alt={quickViewProduct.name}
              className="max-h-80 object-contain hover:scale-105 transition-transform duration-300"
              referrerPolicy="no-referrer"
            />
            {quickViewProduct.originalPrice && (
              <span className="absolute top-4 left-4 bg-red-500 text-slate-950 font-bold px-3 py-1 rounded-full text-xs animate-pulse">
                SALE
              </span>
            )}
          </div>

          {/* METADATA PORTION */}
          <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col justify-between">
            <div className="flex flex-col gap-3">
              <span id="quickview-brand-tag" className="text-xs font-mono tracking-widest text-blue-400 uppercase">
                {quickViewProduct.brand}
              </span>
              <h2 id="quickview-title" className="text-xl md:text-2xl font-bold font-display text-white tracking-tight leading-snug">
                {quickViewProduct.name}
              </h2>

              {/* STARS */}
              <div className="flex items-center gap-1.5 mt-1">
                <div role="img" aria-label={`Rating: ${quickViewProduct.rating} starts`} className="flex text-amber-400">
                  <Star fill="currentColor" size={14} />
                </div>
                <span className="text-xs font-bold text-slate-100">{quickViewProduct.rating}</span>
                <span className="text-slate-500">•</span>
                <span className="text-xs text-slate-400">{quickViewProduct.reviewCount} customer reviews</span>
              </div>

              {/* PRICING */}
              <div className="flex items-baseline gap-3 mt-2">
                <span className="text-2xl font-extrabold text-[#3B82F6]">${quickViewProduct.price}</span>
                {quickViewProduct.originalPrice && (
                  <>
                    <span className="text-sm line-through text-slate-500">${quickViewProduct.originalPrice}</span>
                    <span className="text-[10px] font-bold bg-green-500/10 text-green-400 border border-green-500/20 px-2 py-0.5 rounded">
                      Save ${discountAmount}
                    </span>
                  </>
                )}
              </div>

              {/* SHORT BULLETS */}
              <ul className="flex flex-col gap-1 text-slate-400 text-xs mt-3 leading-relaxed list-inside list-disc">
                {quickViewProduct.shortFeatures.slice(0, 3).map((f, i) => (
                  <li key={i}>{f}</li>
                ))}
              </ul>

              {/* COLOR SWATCH SELECTOR */}
              <div className="grid gap-2 mt-4">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Choose Hue: {selectedColor}</span>
                <div className="flex items-center gap-2">
                  {COLORS.map((color) => {
                    const isSelected = selectedColor === color.name;
                    return (
                      <button
                        key={color.name}
                        onClick={() => setSelectedColor(color.name)}
                        className={`w-6 h-6 rounded-full cursor-pointer flex items-center justify-center border transition-all ${
                          isSelected ? 'border-blue-500 scale-110 ring-2 ring-blue-500/20' : 'border-slate-800 hover:border-slate-600'
                        }`}
                        style={{ backgroundColor: color.hex }}
                        title={color.name}
                      >
                        {isSelected && <Check size={12} className="text-white mix-blend-difference" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* STORAGE SWITCHERS IF RELEVANT */}
              {hasVariants && capacityOptions.length > 0 && (
                <div className="grid gap-2 mt-4">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Storage Size</span>
                  <div className="flex gap-2">
                    {capacityOptions.map((opt) => {
                      const isSelected = selectedSize === opt;
                      return (
                        <button
                          key={opt}
                          onClick={() => setSelectedSize(opt)}
                          className={`px-3 py-1 bg-slate-800 text-xs font-semibold rounded cursor-pointer border transition-all ${
                            isSelected ? 'border-cyan-500 text-cyan-400 glow-cyan' : 'border-slate-700 hover:border-slate-600'
                          }`}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* ACTION FOOTER */}
            <div className="flex gap-4 border-t border-slate-800 pt-6 mt-6">
              <button
                onClick={handleAddToCart}
                className="flex-1 py-3 bg-blue-600 text-slate-950 hover:bg-blue-500 hover:text-white rounded-lg flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider cursor-pointer font-display scale-100 hover:scale-[1.02] active:scale-97 transition-all duration-200"
              >
                <ShoppingCart size={16} /> ADD TO CART
              </button>

              <button
                onClick={() => toggleWishlist(quickViewProduct.id)}
                className={`p-3 border rounded-lg hover:bg-slate-800 transition-colors flex items-center justify-center cursor-pointer ${
                  isLiked ? 'border-rose-500 text-rose-500 bg-rose-500/5' : 'border-slate-700 text-slate-300'
                }`}
                title={isLiked ? 'Remove from Wishlist' : 'Add to Wishlist'}
                aria-label={isLiked ? 'Remove from Wishlist' : 'Add to Wishlist'}
              >
                <Heart size={16} fill={isLiked ? 'currentColor' : 'none'} />
              </button>

              <button
                onClick={() => {
                  setQuickViewProduct(null);
                  navigateTo('product', { id: quickViewProduct.id });
                }}
                className="p-3 border border-slate-700 hover:border-slate-500 rounded-lg hover:bg-slate-800 text-slate-300 transition-all flex items-center justify-center cursor-pointer gap-1 text-xs font-bold"
                title="View Full Detail Page"
              >
                Full Tech Specs <ArrowUpRight size={14} />
              </button>
            </div>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
}
