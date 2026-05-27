/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { MOCK_PRODUCTS } from '../data';
import { Product } from '../types';
import { AnimatePresence, motion } from 'motion/react';
import { 
  Grid, 
  List, 
  Star, 
  Heart, 
  Eye, 
  SlidersHorizontal, 
  X, 
  Search,
  Check,
  ChevronDown
} from 'lucide-react';

export default function Shop() {
  const { 
    searchQuery, 
    setSearchQuery, 
    navigateTo, 
    addToCart, 
    toggleWishlist, 
    wishlist, 
    setQuickViewProduct,
    addToComparison,
    comparisonList,
    selectedCategory,
    setSelectedCategory
  } = useApp();

  // Internal Filter States
  const [activeCategories, setActiveCategories] = useState<string[]>(
    selectedCategory ? [selectedCategory] : []
  );
  
  const [activeBrands, setActiveBrands] = useState<string[]>([]);
  const maxProductPrice = Math.ceil(Math.max(...MOCK_PRODUCTS.map(p => p.price)) / 100) * 100;
  const [priceMax, setPriceMax] = useState<number>(maxProductPrice);
  const [fourStarPlus, setFourStarPlus] = useState<boolean>(false);
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [activeSort, setActiveSort] = useState<string>('featured');
  const [visibleCount, setVisibleCount] = useState<number>(8);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState<boolean>(false);

  // Sync selection category triggers from outside index mapping (e.g. category clicks on Home)
  useEffect(() => {
    if (selectedCategory) {
      setActiveCategories([selectedCategory]);
    }
  }, [selectedCategory]);

  // Sync brand selection filters dynamically from route hash parameters
  useEffect(() => {
    const parseHashParams = () => {
      const hash = window.location.hash;
      if (!hash.includes('?')) return;
      
      const part = hash.split('?')[1];
      if (part) {
        const urlParams = new URLSearchParams(part);
        const urlBrand = urlParams.get('brand');
        if (urlBrand) {
          // Find standard brand matching case-insensitively
          const matchingBrand = brands.find(b => b.toLowerCase() === urlBrand.toLowerCase());
          if (matchingBrand) {
            setActiveBrands([matchingBrand]);
          }
        }
      }
    };
    
    parseHashParams();
    window.addEventListener('hashchange', parseHashParams);
    return () => window.removeEventListener('hashchange', parseHashParams);
  }, []);

  const categories = [...new Set(MOCK_PRODUCTS.map(p => p.category))].sort();
  const brands = [...new Set(MOCK_PRODUCTS.map(p => p.brand))].sort();

  const handleCategoryToggle = (cat: string) => {
    setActiveCategories(prev => 
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
    // Reset external category mapping overrides of AppContext since user edited checkboxes manually
    setSelectedCategory(null);
  };

  const handleBrandToggle = (brand: string) => {
    setActiveBrands(prev => 
      prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
    );
  };

  const clearAllFilters = () => {
    setActiveCategories([]);
    setActiveBrands([]);
    setPriceMax(2000);
    setFourStarPlus(false);
    setInStockOnly(false);
    setSearchQuery('');
    setSelectedCategory(null);
  };

  // 1. FILTER SEQUENCING
  const filteredProducts = useMemo(() => {
    return MOCK_PRODUCTS.filter((product) => {
      // Category check
      if (activeCategories.length > 0 && !activeCategories.includes(product.category)) {
        return false;
      }

      // Brand check
      if (activeBrands.length > 0 && !activeBrands.includes(product.brand)) {
        return false;
      }

      // Price limit check
      if (product.price > priceMax) {
        return false;
      }

      // Rating limit check
      if (fourStarPlus && product.rating < 4.0) {
        return false;
      }

      // Stock limit check
      if (inStockOnly && !product.inStock) {
        return false;
      }

      // Live Name Search sync
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = product.name.toLowerCase().includes(query);
        const matchesBrand = product.brand.toLowerCase().includes(query);
        const matchesCategory = product.category.toLowerCase().includes(query);
        if (!matchesName && !matchesBrand && !matchesCategory) {
          return false;
        }
      }

      return true;
    });
  }, [activeCategories, activeBrands, priceMax, fourStarPlus, inStockOnly, searchQuery]);

  // 2. SORT SEQUENCING
  const sortedProducts = useMemo(() => {
    const list = [...filteredProducts];
    switch (activeSort) {
      case 'price-asc':
        return list.sort((a, b) => a.price - b.price);
      case 'price-desc':
        return list.sort((a, b) => b.price - a.price);
      case 'rating-desc':
        return list.sort((a, b) => b.rating - a.rating);
      case 'newest':
        return list.sort((a, b) => {
          if (a.isNewArrival && !b.isNewArrival) return -1;
          if (!a.isNewArrival && b.isNewArrival) return 1;
          return parseInt(b.id) - parseInt(a.id);
        });
      case 'featured':
      default:
        return list.sort((a, b) => {
          if (a.isHotDeal && !b.isHotDeal) return -1;
          if (!a.isHotDeal && b.isHotDeal) return 1;
          return 0;
        });
    }
  }, [filteredProducts, activeSort]);

  // Handle pagination limits
  const visibleProducts = sortedProducts.slice(0, visibleCount);
  const hasMore = sortedProducts.length > visibleCount;

  // Grid / List toggles from context
  const { gridLayout, setGridLayout } = useApp();

  return (
    <div id="shop-view-grid" className="pt-[110px] pb-24 max-w-7xl mx-auto px-4 md:px-8 w-full flex flex-col gap-8">
      
      {/* SHOP BREADCRUMB */}
      <div className="flex items-center gap-1.5 text-xs text-slate-500 font-mono">
        <a href="#home" onClick={() => navigateTo('home')} className="hover:text-blue-400">Home</a>
        <span className="text-slate-700">/</span>
        <span className="text-slate-300 font-semibold">Shop Drops</span>
      </div>

      {/* FILTER TOP HEADER BAR */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex flex-col gap-1.5 md:text-left text-center">
          <h1 className="text-xl md:text-2xl font-bold font-display text-white">
            {activeCategories.length === 1 ? `Ecosystem: ${activeCategories[0]}` : 'Tech Shop Matrix'}
          </h1>
          <p className="text-xs text-slate-400">
            Showing <span className="font-bold text-blue-400">{sortedProducts.length}</span> of {MOCK_PRODUCTS.length} authentic models
          </p>
        </div>

        {/* RIGHT DISPLAY CONTROLS */}
        <div className="flex items-center justify-center md:justify-end gap-4">
          
          {/* SORT SWITCHER */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono text-slate-400">SORT BY:</span>
            <div className="relative">
              <select
                id="shop-sort-picker"
                value={activeSort}
                onChange={(e) => setActiveSort(e.target.value)}
                className="bg-slate-800 border border-slate-700 focus:border-blue-500 outline-none text-xs text-white rounded-lg px-3.5 py-2 pr-8 cursor-pointer select-none appearance-none"
              >
                <option value="featured">Featured Deals</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating-desc">Best Rated</option>
                <option value="newest">Newest First</option>
              </select>
              <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
          </div>

          {/* GRID LAYOUT SPLITTER */}
          <div className="flex items-center border border-slate-700 rounded-lg overflow-hidden">
            <button
              onClick={() => setGridLayout(true)}
              className={`p-2 cursor-pointer transition-colors ${gridLayout ? 'bg-blue-600 text-slate-900' : 'bg-slate-800 text-slate-400 hover:text-white'}`}
              title="Grid View"
              aria-label="Toggle grid layout display"
            >
              <Grid size={16} />
            </button>
            <button
              onClick={() => setGridLayout(false)}
              className={`p-2 cursor-pointer transition-colors ${!gridLayout ? 'bg-blue-600 text-slate-900' : 'bg-slate-800 text-slate-400 hover:text-white'}`}
              title="List View"
              aria-label="Toggle list layout display"
            >
              <List size={16} />
            </button>
          </div>

          {/* MOBILE TOGGLE BUTTON */}
          <button
            onClick={() => setMobileFiltersOpen(true)}
            className="md:hidden flex items-center gap-1.5 px-4 py-2 bg-slate-800 border border-slate-700 hover:border-slate-500 rounded-lg text-xs font-bold text-slate-200"
          >
            <SlidersHorizontal size={14} /> Filters
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8 items-start">
        
        {/* ================= SIDEBAR FILTERS (DESKTOP) ================= */}
        <aside id="shop-sidebar-filters" className="hidden md:flex flex-col gap-6 w-64 shrink-0 bg-slate-900/40 border border-slate-800 p-6 rounded-2xl sticky top-[95px]">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold font-display uppercase tracking-wider text-white">Refine Criteria</h3>
            <button 
              onClick={clearAllFilters}
              className="text-[10px] font-mono font-bold text-[#EF4444] hover:underline"
            >
              Clear All
            </button>
          </div>

          {/* CHECKBOX: CATEGORY */}
          <div className="flex flex-col gap-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 font-mono">Category Layer</h4>
            <div className="flex flex-col gap-2">
              {categories.map((cat) => {
                const checked = activeCategories.includes(cat);
                return (
                  <label key={cat} className="flex items-center gap-2 text-xs text-slate-300 hover:text-white cursor-pointer">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => handleCategoryToggle(cat)}
                      className="accent-blue-500 cursor-pointer h-3.5 w-3.5 rounded border-slate-700 bg-slate-900"
                    />
                    <span>{cat}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* CHECKBOX: BRAND */}
          <hr className="border-slate-800" />
          <div className="flex flex-col gap-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 font-mono">Brands Ecosystem</h4>
            <div className="flex flex-col gap-2">
              {brands.map((brand) => {
                const checked = activeBrands.includes(brand);
                return (
                  <label key={brand} className="flex items-center gap-2 text-xs text-slate-300 hover:text-white cursor-pointer">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => handleBrandToggle(brand)}
                      className="accent-blue-500 cursor-pointer h-3.5 w-3.5 rounded border-slate-700 bg-slate-900"
                    />
                    <span>{brand}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* SLIDER: PRICE */}
          <hr className="border-slate-800" />
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 font-mono">Budget limit</h4>
              <span className="text-xs font-bold font-mono text-cyan-400">${priceMax}</span>
            </div>
            <input
              type="range"
              min="0"
              max={maxProductPrice}
              step="50"
              value={priceMax}
              onChange={(e) => setPriceMax(Number(e.target.value))}
              className="accent-cyan-500 cursor-pointer w-full bg-slate-900 h-1.5 rounded-lg border-transparent"
            />
            <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono">
              <span>$0</span>
              <span>${maxProductPrice.toLocaleString()}</span>
            </div>
          </div>

          {/* TOGGLES: EXTRA FILTERS */}
          <hr className="border-slate-800" />
          <div className="flex flex-col gap-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 font-mono">Operations</h4>
            <div className="flex flex-col gap-2.5">
              <label className="flex items-center justify-between text-xs text-slate-300 hover:text-white cursor-pointer">
                <span>4★ & Above rating</span>
                <input
                  type="checkbox"
                  checked={fourStarPlus}
                  onChange={(e) => setFourStarPlus(e.target.checked)}
                  className="accent-blue-500 cursor-pointer h-4 w-4 rounded-full"
                />
              </label>

              <label className="flex items-center justify-between text-xs text-slate-300 hover:text-white cursor-pointer">
                <span>In Stock only</span>
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="accent-blue-500 cursor-pointer h-4 w-4 rounded-full"
                />
              </label>
            </div>
          </div>
        </aside>

        {/* ================= PRODUCT DISPLAY SCENE (GRID vs LIST) ================= */}
        <div id="product-listing-content" className="flex-1 w-full flex flex-col gap-8">
          
          {sortedProducts.length === 0 ? (
            <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-16 text-center max-w-xl mx-auto flex flex-col items-center gap-4">
              <SlidersHorizontal className="text-slate-600 animate-pulse" size={44} />
              <h3 className="text-lg font-bold font-display text-white">No Matched Hardware</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                No gadgets matched your active criteria filters. Try loosening your price threshold limits, turning off checkboxes, or looking up distinct terms.
              </p>
              <button
                onClick={clearAllFilters}
                className="px-5 py-2.5 bg-blue-600 text-slate-950 hover:bg-blue-500 hover:text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-all font-display duration-200 cursor-pointer"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <>
              {/* LAYOUT CONTAINER COMPACTOR */}
              <div className={gridLayout ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6' : 'flex flex-col gap-4'}>
                {visibleProducts.map((product) => {
                  const isLiked = wishlist.includes(product.id);
                  const isCompareChecked = comparisonList.some(p => p.id === product.id);
                  const discountPercentage = product.originalPrice 
                    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) 
                    : 0;

                  return (
                    <div 
                      key={product.id}
                      className={`bg-slate-900/60 border border-slate-850 hover:border-slate-750 p-4 rounded-2xl flex transition-all duration-300 relative ${
                        gridLayout ? 'flex-col justify-between' : 'flex-col sm:flex-row gap-6'
                      }`}
                    >
                      {/* DISCOUNT CHIP */}
                      {product.originalPrice && (
                        <div className="absolute top-4 left-4 z-10 bg-red-500 text-slate-950 font-black text-[9px] px-2 py-0.5 rounded-full uppercase tracking-wider">
                          -{discountPercentage}%
                        </div>
                      )}

                      {/* ACTIONS ROW */}
                      <div className="absolute top-4 right-4 z-10 flex gap-1.5">
                        <button
                          onClick={() => toggleWishlist(product.id)}
                          className={`p-2 bg-slate-900/80 rounded-full border border-slate-800 transition-colors cursor-pointer ${isLiked ? 'text-rose-500 border-rose-500/20' : 'text-slate-400 hover:text-white'}`}
                        >
                          <Heart size={14} fill={isLiked ? 'currentColor' : 'none'} />
                        </button>
                        <button
                          onClick={() => addToComparison(product)}
                          className={`p-2 bg-slate-900/80 rounded-full border border-slate-800 transition-colors cursor-pointer ${isCompareChecked ? 'text-cyan-400 border-cyan-500/20' : 'text-slate-400 hover:text-blue-400'}`}
                        >
                          <SlidersHorizontal size={14} />
                        </button>
                      </div>

                      {/* IMAGE SEGMENT */}
                      <div 
                        className={`bg-slate-950 rounded-xl flex items-center justify-center cursor-pointer relative group/img overflow-hidden ${
                          gridLayout ? 'aspect-square mb-4 p-8' : 'w-full sm:w-48 aspect-square p-6 shrink-0'
                        }`}
                        onClick={() => navigateTo('product', { id: product.id })}
                      >
                        <img 
                          src={product.image} 
                          alt={product.name} 
                          className="max-h-36 object-contain hover:scale-105 transition-transform duration-300"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
                          <button
                            onClick={(e) => { e.stopPropagation(); setQuickViewProduct(product); }}
                            className="px-3 py-1.5 bg-slate-900 border border-slate-700 rounded text-[10px] text-white font-bold tracking-wider flex items-center gap-1 cursor-pointer"
                          >
                            <Eye size={12} /> Spec View
                          </button>
                        </div>
                      </div>

                      {/* METADATA CONTENT SEGMENT */}
                      <div className={`flex flex-col gap-2 flex-1 ${gridLayout ? '' : 'justify-center'}`}>
                        <div className="flex items-center justify-between">
                          <span className="text-[9px] font-mono tracking-widest text-[#06B6D4] uppercase">
                            {product.brand}
                          </span>
                          {!product.inStock && (
                            <span className="text-[8px] bg-red-500/10 text-red-400 px-2 border border-red-500/10 rounded uppercase font-bold">
                              Sold Out
                            </span>
                          )}
                        </div>

                        <h3 
                          onClick={() => navigateTo('product', { id: product.id })}
                          className="font-display font-semibold text-sm text-slate-100 hover:text-blue-400 cursor-pointer transition-colors line-clamp-1"
                        >
                          {product.name}
                        </h3>

                        {/* STARS */}
                        <div className="flex items-center gap-1.5 text-[10px]">
                          <div className="flex text-amber-500">
                            <Star fill="currentColor" size={12} />
                          </div>
                          <span className="font-bold text-slate-300">{product.rating}</span>
                          <span className="text-slate-600">•</span>
                          <span className="text-slate-500">({product.reviewCount} scores)</span>
                        </div>

                        {/* PRICING METADATA */}
                        <div className="flex items-baseline gap-2 mt-1">
                          <span className="text-sm font-black text-cyan-400">${product.price}</span>
                          {product.originalPrice && (
                            <span className="text-[10px] line-through text-slate-500">${product.originalPrice}</span>
                          )}
                        </div>

                        {/* SHORT FEATURES EXPOSED ON LIST VIEWS */}
                        {!gridLayout && product.shortFeatures.length > 0 && (
                          <ul className="hidden md:flex flex-col gap-1 text-[10px] text-slate-400 mt-2 list-inside list-disc">
                            {product.shortFeatures.slice(0, 3).map((f, i) => (
                              <li key={i}>{f}</li>
                            ))}
                          </ul>
                        )}
                        {!gridLayout && product.shortFeatures.length === 0 && product.description[0] && (
                          <p className="hidden md:block text-[10px] text-slate-400 mt-2 line-clamp-2">
                            {product.description[0]}
                          </p>
                        )}

                        {/* ADD CART CTA */}
                        <button
                          onClick={() => addToCart(product, 1)}
                          disabled={!product.inStock}
                          className="w-full mt-4 py-2 bg-slate-800 disabled:opacity-45 hover:bg-blue-600 hover:text-slate-950 text-slate-200 text-xs font-bold uppercase tracking-wider rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                        >
                          Add to Cart
                        </button>
                      </div>

                    </div>
                  );
                })}
              </div>

              {/* PAGINATION PROGRESS BAR & LOAD MORE BUTTON */}
              {hasMore && (
                <div className="flex flex-col items-center gap-3 pt-6 border-t border-slate-850">
                  <p className="text-[10px] text-slate-500 font-mono text-center">
                    COMPILING ITEMS PROPORTION: {visibleProducts.length} of {sortedProducts.length} WIDGETS
                  </p>
                  <div className="w-48 h-1 bg-slate-850 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-500 rounded-full" 
                      style={{ width: `${(visibleProducts.length / sortedProducts.length) * 100}%` }}
                    />
                  </div>
                  <button
                    onClick={() => setVisibleCount(prev => prev + 4)}
                    className="mt-2 px-6 py-2.5 border border-slate-705 hover:border-slate-500 hover:bg-slate-800 text-xs text-white font-bold uppercase tracking-widest rounded-lg transition-all cursor-pointer"
                  >
                    Load More Gadgets
                  </button>
                </div>
              )}
            </>
          )}

        </div>
      </div>

      {/* ================= MOBILE EXPANDED FILTER SHEET ================= */}
      <AnimatePresence>
        {mobileFiltersOpen && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-[99]" onClick={() => setMobileFiltersOpen(false)}>
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute right-0 top-0 h-full w-full max-w-xs bg-slate-900 border-l border-slate-800 p-6 shadow-2xl flex flex-col justify-between overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex flex-col gap-6">
                <div className="flex items-center justify-between border-b border-slate-805 pb-3">
                  <h3 className="font-display font-extrabold text-sm text-white uppercase tracking-wider">Refine Filter</h3>
                  <button onClick={() => setMobileFiltersOpen(false)} className="text-slate-400 hover:text-white cursor-pointer">
                    <X size={18} />
                  </button>
                </div>

                {/* CATEGORIES CHECKBOXES (MOBILE) */}
                <div className="flex flex-col gap-3">
                  <h4 className="text-xs font-bold font-mono text-slate-400">Category Layer</h4>
                  <div className="flex flex-col gap-2">
                    {categories.map((cat) => (
                      <label key={cat} className="flex items-center gap-2 text-xs text-slate-300">
                        <input
                          type="checkbox"
                          checked={activeCategories.includes(cat)}
                          onChange={() => handleCategoryToggle(cat)}
                          className="accent-blue-500"
                        />
                        <span>{cat}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* BRAND SELECTS (MOBILE) */}
                <hr className="border-slate-805" />
                <div className="flex flex-col gap-3">
                  <h4 className="text-xs font-bold font-mono text-slate-400">Brands Ecosystem</h4>
                  <div className="flex flex-col gap-2">
                    {brands.map((brand) => (
                      <label key={brand} className="flex items-center gap-2 text-xs text-slate-300">
                        <input
                          type="checkbox"
                          checked={activeBrands.includes(brand)}
                          onChange={() => handleBrandToggle(brand)}
                          className="accent-blue-500"
                        />
                        <span>{brand}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* BUDGET SELECTS (MOBILE) */}
                <hr className="border-slate-855" />
                <div className="flex flex-col gap-3">
                  <div className="flex justify-between text-xs font-mono text-slate-400">
                    <span>Budget limit</span>
                    <span className="text-cyan-400 font-bold">${priceMax}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max={maxProductPrice}
                    step="100"
                    value={priceMax}
                    onChange={(e) => setPriceMax(Number(e.target.value))}
                    className="accent-cyan-500 w-full"
                  />
                </div>
              </div>

              <div className="pt-6 border-t border-slate-800/80 flex gap-3">
                <button
                  onClick={clearAllFilters}
                  className="flex-1 py-3 border border-slate-800 hover:border-slate-650 text-xs font-bold text-slate-400 uppercase tracking-widest rounded-lg cursor-pointer"
                >
                  Reset
                </button>
                <button
                  onClick={() => setMobileFiltersOpen(false)}
                  className="flex-1 py-3 bg-blue-600 text-slate-950 hover:text-white text-xs font-black uppercase tracking-widest rounded-lg cursor-pointer"
                >
                  Apply
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
