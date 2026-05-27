/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { motion, AnimatePresence } from 'motion/react';
import { X, SlidersHorizontal, Trash2, ArrowRight, Star } from 'lucide-react';

export default function ComparisonDrawer() {
  const { comparisonList, removeFromComparison, clearComparison, addToCart } = useApp();
  const [isExpanded, setIsExpanded] = useState(false);

  if (comparisonList.length === 0) return null;

  // Extract all spec keys from current list dynamically
  const allSpecKeys = Array.from(
    new Set(comparisonList.flatMap(p => p.specifications.map(s => s.key)))
  );

  return (
    <div id="comparison-dock" className="fixed bottom-0 left-0 w-full z-40 bg-slate-950/90 backdrop-blur-xl border-t border-slate-800 shadow-3xl text-slate-200">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-3 flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* COMPARED HEADINGS */}
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-blue-600/10 text-blue-400 border border-blue-500/20 rounded-xl">
            <SlidersHorizontal size={18} />
          </div>
          <div>
            <h4 id="comparison-drawer-title" className="text-xs md:text-sm font-semibold text-white tracking-wider font-display uppercase">
              Specs Comparison Board
            </h4>
            <p className="text-[10px] text-slate-400">
              Comparing {comparisonList.length}/3 selected gadgets side-by-side.
            </p>
          </div>
        </div>

        {/* COMPARED THUMBNAILS GRID */}
        <div id="comparison-items-list" className="flex items-center gap-2 flex-wrap">
          {comparisonList.map((product) => (
            <div 
              key={product.id}
              className="px-2.5 py-1.5 bg-slate-800 rounded-lg border border-slate-700 flex items-center gap-2 relative group"
            >
              <img 
                src={product.image} 
                alt={product.name} 
                className="w-8 h-8 object-contain"
                referrerPolicy="no-referrer"
              />
              <div className="text-[10px] max-w-[100px]">
                <p className="font-semibold text-white truncate">{product.name}</p>
                <p className="text-blue-400 font-bold">${product.price}</p>
              </div>
              <button
                onClick={() => removeFromComparison(product.id)}
                className="p-1 text-slate-500 hover:text-red-400 hover:bg-slate-700/50 rounded cursor-pointer"
                aria-label={`Remove ${product.name} from comparison`}
              >
                <X size={12} />
              </button>
            </div>
          ))}

          {comparisonList.length < 3 && (
            <div className="px-3 py-1.5 border border-dashed border-slate-700 rounded-lg text-[10px] text-slate-500 flex items-center justify-center min-w-[140px]">
              + Add up to {3 - comparisonList.length} more
            </div>
          )}
        </div>

        {/* COMPARISON WORKFLOWS */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsExpanded(prev => !prev)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-slate-900 hover:text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-all cursor-pointer font-display"
          >
            {isExpanded ? 'Minimize Spec Table' : 'Compare Side-by-Side'}
          </button>
          
          <button
            onClick={clearComparison}
            className="p-2 border border-slate-800 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-lg cursor-pointer"
            title="Clean All Comparison List"
            aria-label="Clean all items from comparison board"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {/* FULL EXPANDABLE TABLE GRID LAYER */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-slate-800 bg-slate-950 overflow-x-auto"
          >
            <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
              <table className="w-full text-left text-xs min-w-[600px] border-collapse">
                <thead>
                  <tr className="border-b border-slate-850">
                    <th className="py-4 font-bold text-slate-400 font-mono w-1/4">Specs Attribute</th>
                    {comparisonList.map(p => (
                      <th key={p.id} className="py-4 px-4 font-display font-black text-sm text-white w-1/4">
                        {p.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-850">
                  {/* BRAND ROW */}
                  <tr>
                    <td className="py-3.5 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">Manufacturer</td>
                    {comparisonList.map(p => (
                      <td key={p.id} className="py-3.5 px-4 font-mono font-bold text-slate-300">
                        {p.brand}
                      </td>
                    ))}
                  </tr>

                  {/* PRICE ROW */}
                  <tr>
                    <td className="py-3.5 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">Price point</td>
                    {comparisonList.map(p => (
                      <td key={p.id} className="py-3.5 px-4 font-bold text-cyan-400 text-sm">
                        ${p.price}
                        {p.originalPrice && (
                          <span className="text-[10px] line-through text-slate-600 block">
                            was ${p.originalPrice}
                          </span>
                        )}
                      </td>
                    ))}
                  </tr>

                  {/* STATUS ROW */}
                  <tr>
                    <td className="py-3.5 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">Inventory</td>
                    {comparisonList.map(p => (
                      <td key={p.id} className="py-3.5 px-4">
                        {p.inStock ? (
                          <span className="bg-green-500/10 text-green-400 px-2.5 py-0.5 border border-green-500/20 rounded text-[10px] font-bold">
                            In Stock
                          </span>
                        ) : (
                          <span className="bg-red-500/10 text-red-400 px-2.5 py-0.5 border border-red-500/20 rounded text-[10px] font-bold">
                            Out of Stock
                          </span>
                        )}
                      </td>
                    ))}
                  </tr>

                  {/* RATING ROW */}
                  <tr>
                    <td className="py-3.5 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">Averages Score</td>
                    {comparisonList.map(p => (
                      <td key={p.id} className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5 text-slate-300">
                          <Star fill="currentColor" size={12} className="text-amber-500" />
                          <span className="font-bold">{p.rating}</span>
                          <span className="text-slate-600">({p.reviewCount} scores)</span>
                        </div>
                      </td>
                    ))}
                  </tr>

                  {/* CUSTOM SPEC KEY ROWS */}
                  {allSpecKeys.map(key => (
                    <tr key={key}>
                      <td className="py-3.5 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">{key}</td>
                      {comparisonList.map(p => {
                        const cell = p.specifications.find(s => s.key === key);
                        return (
                          <td key={p.id} className="py-3.5 px-4 text-slate-300">
                            {cell ? cell.value : <span className="text-slate-700">—</span>}
                          </td>
                        );
                      })}
                    </tr>
                  ))}

                  {/* ADD TO CART ACTION ROW */}
                  <tr className="border-t border-slate-800">
                    <td className="py-6 text-slate-400 font-mono italic">Instant Add</td>
                    {comparisonList.map(p => (
                      <td key={p.id} className="py-6 px-4">
                        <button
                          onClick={() => addToCart(p, 1)}
                          disabled={!p.inStock}
                          className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 hover:shadow-[0_0_16px_rgba(59,130,246,0.4)] disabled:opacity-40 text-white text-xs font-bold rounded-lg transition-all uppercase tracking-wide cursor-pointer"
                        >
                          Quick Cart
                        </button>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
