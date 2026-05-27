import React from 'react';
import { Heart, Eye, SlidersHorizontal, Star } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  variant?: 'default' | 'compact';
  listView?: boolean;
  isLiked: boolean;
  isInCompare?: boolean;
  onNavigate: () => void;
  onWishlist: () => void;
  onCompare?: () => void;
  onQuickView?: () => void;
  onAddToCart: () => void;
}

export default function ProductCard({
  product,
  variant = 'default',
  listView = false,
  isLiked,
  isInCompare = false,
  onNavigate,
  onWishlist,
  onCompare,
  onQuickView,
  onAddToCart,
}: ProductCardProps) {
  const discountPct = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  if (variant === 'compact') {
    return (
      <div className="bg-slate-50 backdrop-blur-sm border border-slate-200 rounded-xl p-4 flex flex-col justify-between shrink-0 w-64 group hover:border-blue-500/30 transition-colors">
        <div
          className="bg-white rounded-lg p-6 flex items-center justify-center h-40 relative cursor-pointer"
          onClick={onNavigate}
        >
          <img
            src={product.image}
            alt={product.name}
            className="max-h-28 object-contain group-hover:scale-105 transition-transform"
            referrerPolicy="no-referrer"
          />
          <div className="absolute top-2 left-2 px-2 py-0.5 bg-cyan-400 text-slate-950 text-[8px] font-black uppercase rounded tracking-wider">
            NEW
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); onWishlist(); }}
            className={`absolute top-2 right-2 p-1.5 rounded-full bg-white/60 border cursor-pointer transition-colors ${
              isLiked ? 'border-rose-500 text-rose-500' : 'border-slate-200 text-slate-500 hover:text-slate-700'
            }`}
          >
            <Heart size={12} fill={isLiked ? 'currentColor' : 'none'} />
          </button>
        </div>
        <div className="mt-3 flex flex-col gap-1">
          <span className="text-[9px] font-mono tracking-widest text-slate-500">{product.brand}</span>
          <p
            onClick={onNavigate}
            className="font-display font-medium text-xs text-slate-900 hover:text-cyan-400 cursor-pointer truncate"
          >
            {product.name}
          </p>
          <p className="text-sm font-bold text-cyan-400 mt-1">${product.price}</p>
          <button
            onClick={onAddToCart}
            className="w-full mt-2 py-1.5 bg-slate-100 hover:bg-blue-600 text-[10px] font-bold uppercase rounded text-slate-600 hover:text-white transition-colors cursor-pointer"
          >
            Add +
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`bg-slate-50 backdrop-blur-sm border border-slate-200 hover:border-blue-500/30 p-4 rounded-2xl flex transition-all duration-300 relative hover:shadow-[0_0_30px_rgba(59,130,246,0.08)] ${
        listView ? 'flex-col sm:flex-row gap-6' : 'flex-col justify-between'
      }`}
    >
      {discountPct > 0 && (
        <div className="absolute top-4 left-4 z-10 bg-red-500 text-slate-950 font-black text-[9px] px-2 py-0.5 rounded-full uppercase tracking-wider">
          -{discountPct}%
        </div>
      )}

      <div className="absolute top-4 right-4 z-10 flex gap-1.5">
        <button
          onClick={onWishlist}
          className={`p-2 bg-white/80 rounded-full border border-slate-200 transition-colors cursor-pointer ${
            isLiked ? 'text-rose-500 border-rose-500/20' : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          <Heart size={14} fill={isLiked ? 'currentColor' : 'none'} />
        </button>
        {onCompare && (
          <button
            onClick={onCompare}
            className={`p-2 bg-white/80 rounded-full border border-slate-200 transition-colors cursor-pointer ${
              isInCompare ? 'text-cyan-400 border-cyan-500/20' : 'text-slate-500 hover:text-blue-400'
            }`}
          >
            <SlidersHorizontal size={14} />
          </button>
        )}
      </div>

      <div
        className={`bg-white rounded-xl flex items-center justify-center cursor-pointer relative group/img overflow-hidden ${
          listView ? 'w-full sm:w-48 aspect-square p-6 shrink-0' : 'aspect-square mb-4 p-8'
        }`}
        onClick={onNavigate}
      >
        <img
          src={product.image}
          alt={product.name}
          className="max-h-36 object-contain group-hover/img:scale-105 transition-transform duration-300"
          referrerPolicy="no-referrer"
        />
        {onQuickView && (
          <div className="absolute inset-0 bg-white/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
            <button
              onClick={(e) => { e.stopPropagation(); onQuickView(); }}
              className="px-3 py-1.5 bg-slate-50 border border-slate-300 rounded text-[10px] text-slate-900 font-bold tracking-wider flex items-center gap-1 cursor-pointer"
            >
              <Eye size={12} /> Spec View
            </button>
          </div>
        )}
      </div>

      <div className={`flex flex-col gap-2 flex-1 ${listView ? 'justify-center' : ''}`}>
        <div className="flex items-center justify-between">
          <span className="text-[9px] font-mono tracking-widest text-cyan-400 uppercase">{product.brand}</span>
          {!product.inStock && (
            <span className="text-[8px] bg-red-500/10 text-red-400 px-2 border border-red-500/10 rounded uppercase font-bold">
              Sold Out
            </span>
          )}
        </div>

        <h3
          onClick={onNavigate}
          className="font-display font-semibold text-sm text-slate-800 hover:text-blue-400 cursor-pointer transition-colors line-clamp-1"
        >
          {product.name}
        </h3>

        <div className="flex items-center gap-1.5 text-[10px]">
          <Star fill="currentColor" size={12} className="text-amber-500" />
          <span className="font-bold text-slate-600">{product.rating}</span>
          <span className="text-slate-600">•</span>
          <span className="text-slate-500">({product.reviewCount})</span>
        </div>

        <div className="flex items-baseline gap-2 mt-1">
          <span className="text-sm font-black text-cyan-400">${product.price}</span>
          {product.originalPrice && (
            <span className="text-[10px] line-through text-slate-500">${product.originalPrice}</span>
          )}
        </div>

        {listView && product.shortFeatures.length > 0 && (
          <ul className="hidden md:flex flex-col gap-1 text-[10px] text-slate-500 mt-2 list-inside list-disc">
            {product.shortFeatures.slice(0, 3).map((f, i) => <li key={i}>{f}</li>)}
          </ul>
        )}
        {listView && product.shortFeatures.length === 0 && product.description[0] && (
          <p className="hidden md:block text-[10px] text-slate-500 mt-2 line-clamp-2">{product.description[0]}</p>
        )}

        <button
          onClick={onAddToCart}
          disabled={!product.inStock}
          className="w-full mt-4 py-2 bg-blue-600 disabled:opacity-45 hover:bg-blue-500 hover:shadow-[0_0_24px_rgba(59,130,246,0.4)] text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}
