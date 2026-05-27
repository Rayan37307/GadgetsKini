/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import React, { useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { motion } from 'motion/react';
import { CheckCircle2, Package, Truck, ArrowRight, Sparkles } from 'lucide-react';

export default function OrderConfirmation() {
  const { orders, navigateTo, triggerToast } = useApp();

  // Find latest order from context logs OR fallback to cache keys
  const latestOrder = useMemo(() => {
    if (orders.length > 0) return orders[0];
    return null;
  }, [orders]);

  const deliveryString = useMemo(() => {
    const today = new Date('2026-05-27');
    const future = new Date(today);
    future.setDate(today.getDate() + 3);
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric'
    }).format(future);
  }, []);

  const handleTrackMockOrder = () => {
    triggerToast('✓ System Tracker initialized. Package package compiles at Austin warehouse', 'success');
  };

  if (!latestOrder) {
    return (
      <div className="pt-[150px] pb-24 text-center max-w-md mx-auto flex flex-col items-center gap-6">
        <div className="p-4 bg-amber-500/10 text-amber-500 rounded-full">
          <Package size={36} />
        </div>
        <h2 className="text-xl font-bold text-white font-display uppercase tracking-widest">No order found</h2>
        <p className="text-xs text-slate-400">Navigate to listing catalog to check out gadgets first.</p>
        <button
          onClick={() => navigateTo('shop')}
          className="px-6 py-2.5 bg-blue-600 text-slate-950 font-bold uppercase tracking-wider rounded-lg text-xs"
        >
          View Store
        </button>
      </div>
    );
  }

  return (
    <div id="confirmation-view-container" className="pt-[110px] pb-24 max-w-3xl mx-auto px-4 md:px-8 w-full flex flex-col items-center justify-center text-center gap-8">
      
      {/* 1. ANIMATED CHECKMARK SCENE */}
      <div className="relative">
        <motion.div
          initial={{ scale: 0, rotate: -45 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', damping: 14, stiffness: 180, delay: 0.15 }}
          className="h-20 w-20 bg-emerald-500 text-slate-950 rounded-full flex items-center justify-center shadow-xl glow-blue"
        >
          {/* Animated drawing SVG checkmark path */}
          <svg className="h-10 w-10 text-slate-950" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <motion.path 
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.4, ease: 'easeOut', delay: 0.45 }}
              strokeLinecap="round" 
              strokeLinejoin="round" 
              d="M5 13l4 4L19 7" 
            />
          </svg>
        </motion.div>
        
        {/* Subtle decorative feedback particles */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1.1 }}
          transition={{ repeat: Infinity, repeatType: 'reverse', duration: 1.5 }}
          className="absolute -top-1.5 -right-1.5 text-amber-400"
        >
          <Sparkles size={16} />
        </motion.div>
      </div>

      {/* CONFIRMED HEADER OVERLAYS */}
      <div className="flex flex-col gap-2.5">
        <h1 id="confirmation-header-title" className="text-3xl md:text-4xl font-black font-display text-white tracking-tight uppercase">
          Order Confirmed! 🎉
        </h1>
        <p className="text-sm text-slate-400 leading-relaxed max-w-md mx-auto">
          Hardware compiled successfully! We sent a duplicate digital invoice and transit updates directly to your register email.
        </p>
      </div>

      {/* ORDER CREDENTIALS CARD */}
      <div className="w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 text-left flex flex-col gap-6 shadow-xl relative overflow-hidden">
        
        {/* Top order metadata columns */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-800 pb-4">
          <div>
            <p className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">Purchase Order Number</p>
            <p className="text-base font-bold font-mono text-blue-400 hover:underline cursor-pointer">
              {latestOrder.id}
            </p>
          </div>

          <div>
            <p className="text-[10px] font-mono text-slate-505 uppercase tracking-wider text-right sm:text-left">Transit Estimate Date</p>
            <div className="flex items-center gap-1.5 font-sans font-bold text-xs text-green-400">
              <Truck size={14} /> Expected by {deliveryString}
            </div>
          </div>
        </div>

        {/* Item listing summary */}
        <div className="flex flex-col gap-4">
          <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Transition item list:</p>
          <div className="flex flex-col gap-3.5 max-h-40 overflow-y-auto pr-1">
            {latestOrder.items.map((line, idx) => (
              <div key={idx} className="flex justify-between items-center text-xs">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 bg-slate-950 border border-slate-800 rounded p-1 flex items-center justify-center shrink-0">
                    <img src={line.image} alt={line.name} className="max-h-full object-contain" referrerPolicy="no-referrer" />
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-white line-clamp-1 max-w-[200px] sm:max-w-md">{line.name}</p>
                    <p className="text-[10px] text-slate-500 font-mono font-semibold">Qty: {line.quantity} × ${line.price}</p>
                  </div>
                </div>
                <span className="font-semibold text-blue-400 font-mono">
                  ${(line.price * line.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </div>

        <hr className="border-slate-800" />

        {/* Totals compilation */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-400 leading-relaxed font-mono">
          
          {/* Shipping Address Column */}
          <div className="flex flex-col gap-1.5">
            <span className="text-[9px] uppercase tracking-wider text-slate-500">Shipping destination</span>
            <div className="text-slate-300 not-italic leading-relaxed font-sans">
              <p className="font-bold text-white mb-0.5">
                {latestOrder.shippingAddress.firstName} {latestOrder.shippingAddress.lastName}
              </p>
              <p className="text-xs">{latestOrder.shippingAddress.addressLine1}</p>
              {latestOrder.shippingAddress.addressLine2 && <p className="text-xs">{latestOrder.shippingAddress.addressLine2}</p>}
              <p className="text-xs text-slate-400">
                {latestOrder.shippingAddress.city}, {latestOrder.shippingAddress.state} {latestOrder.shippingAddress.zip}
              </p>
              <p className="text-[10px] text-slate-500 font-mono mt-0.5">Ph: {latestOrder.shippingAddress.phone}</p>
            </div>
          </div>

          {/* Subtotal breakout card */}
          <div className="bg-slate-950/40 border border-slate-850 p-4 rounded-xl flex flex-col justify-between font-mono gap-1.5">
            <div className="flex justify-between">
              <span>Cart Subtotal</span>
              <span className="font-bold text-slate-200">${latestOrder.subtotal.toFixed(2)}</span>
            </div>
            {latestOrder.discount > 0 && (
              <div className="flex justify-between text-green-400">
                <span>Coupon deduction</span>
                <span>-${latestOrder.discount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Transport Delivery</span>
              <span className="font-bold text-slate-250">
                {latestOrder.shippingCharge === 0 ? 'FREE GROUND' : `$${latestOrder.shippingCharge.toFixed(2)}`}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Tax Surcharges (8%)</span>
              <span className="font-bold text-slate-200">${latestOrder.tax.toFixed(2)}</span>
            </div>
            <hr className="border-slate-850 my-1" />
            <div className="flex justify-between items-baseline text-sm text-white font-sans font-black">
              <span>Grand Total</span>
              <span className="text-[#3B82F6] text-base">${latestOrder.total.toFixed(2)}</span>
            </div>
          </div>
        </div>

      </div>

      {/* CONFIRMATION WORKFLOW ACTION CONTROL BUTTONS */}
      <div className="flex flex-col sm:flex-row items-center gap-4 w-full max-w-md justify-center">
        <button
          onClick={handleTrackMockOrder}
          className="w-full sm:w-auto px-6 py-3.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer font-display"
        >
          Track Transition Progress
        </button>

        <button
          onClick={() => navigateTo('home')}
          className="w-full sm:w-auto px-6 py-3.5 bg-blue-600 hover:bg-blue-500 text-slate-950 hover:text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1 font-display hover:shadow-lg scale-100 hover:scale-103 glow-blue"
        >
          Check out More Tech <ArrowRight size={14} />
        </button>
      </div>

    </div>
  );
}
