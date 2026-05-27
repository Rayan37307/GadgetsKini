/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Trash2, ShoppingCart, ArrowLeft, ArrowRight, Check, TicketPercent, Sparkles } from 'lucide-react';
import { MOCK_PRODUCTS } from '../data';

export default function Cart() {
  const { 
    cart, 
    updateCartQuantity, 
    removeFromCart, 
    couponCode, 
    couponDiscount, 
    applyCoupon, 
    removeCoupon, 
    navigateTo,
    addToCart,
    triggerToast 
  } = useApp();

  const [promoInput, setPromoInput] = useState('');

  const cartItemsCount = cart.reduce((tot, item) => tot + item.quantity, 0);

  // Math totals calculation
  const subtotal = useMemo(() => {
    return cart.reduce((tot, item) => tot + (item.product.price * item.quantity), 0);
  }, [cart]);

  const discountVal = useMemo(() => {
    return subtotal * couponDiscount;
  }, [subtotal, couponDiscount]);

  const netSubtotal = subtotal - discountVal;

  const shippingCost = useMemo(() => {
    if (subtotal === 0) return 0;
    return netSubtotal >= 75 ? 0 : 9.99;
  }, [subtotal, netSubtotal]);

  const taxVal = useMemo(() => {
    return netSubtotal * 0.08; // 8% sales tax as requested
  }, [netSubtotal]);

  const finalTotal = useMemo(() => {
    return netSubtotal + shippingCost + taxVal;
  }, [netSubtotal, shippingCost, taxVal]);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoInput.trim()) return;
    const ok = applyCoupon(promoInput);
    if (ok) setPromoInput('');
  };

  // You might also like recommendations: Select 4 products NOT currently in cart
  const crossSellRecommendations = useMemo(() => {
    const cartProductIds = cart.map(item => item.product.id);
    return MOCK_PRODUCTS
      .filter(p => !cartProductIds.includes(p.id))
      .slice(0, 4);
  }, [cart]);

  const handleGoToCheckout = () => {
    if (cart.length === 0) {
      triggerToast('Your cart is empty. Add gadgets first!', 'warning');
      return;
    }
    navigateTo('checkout');
  };

  return (
    <div id="cart-view-container" className="pb-24 max-w-7xl mx-auto px-4 md:px-8 w-full flex flex-col gap-12">
      
      {/* BREADCRUMB LEVEL */}
      <div className="flex items-center gap-1.5 text-xs text-slate-500 font-mono">
        <a href="#home" onClick={() => navigateTo('home')} className="hover:text-blue-400">Home</a>
        <span className="text-slate-700">/</span>
        <span className="text-slate-600 font-semibold">Shopping Cart</span>
      </div>

      <div className="flex flex-col gap-3">
        <h1 className="text-2xl md:text-3xl font-bold font-display text-slate-900 uppercase tracking-wider">
          Shopping Cart Box
        </h1>
        <p className="text-xs text-slate-500">
          You have <span className="font-bold text-[#06B6D4]">{cartItemsCount} hardware pieces</span> ready in queue
        </p>
      </div>

      {cart.length === 0 ? (
        <div className="border border-slate-200 bg-white/10 p-16 rounded-3xl text-center max-w-xl mx-auto flex flex-col items-center gap-6">
          <div className="p-5 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-full">
            <ShoppingCart size={40} />
          </div>
          <div>
            <h3 className="text-lg font-bold font-display text-slate-900 uppercase tracking-wider mb-2">Cart is empty</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Looks like your hardware stack is unpopulated. Seek core smartphones, laptops, gamepad joysticks or earbuds inside the listing catalog.
            </p>
          </div>
          <button
            onClick={() => navigateTo('shop')}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white hover:text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all font-display duration-200 cursor-pointer"
          >
            Retrieve Gadgets <ArrowRight size={14} className="inline ml-1" />
          </button>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* LEFT CART ITEMS PANEL */}
          <div className="w-full lg:w-2/3 flex flex-col gap-4">
            
            <div className="bg-white/40 border border-slate-200 rounded-2xl overflow-hidden">
              <div className="divide-y divide-slate-805">
                {cart.map((item, idx) => {
                  const lineTotal = item.product.price * item.quantity;
                  return (
                    <div 
                      key={`${item.product.id}-${item.selectedColor}-${item.selectedStorage}-${idx}`}
                      className="p-4 sm:p-6 flex flex-col sm:flex-row items-center gap-5 justify-between hover:bg-white/20 transition-all"
                    >
                      {/* Product image */}
                      <div className="flex items-center gap-4 w-full sm:w-auto">
                        <div 
                          className="w-20 h-20 bg-white border border-slate-200 rounded-xl p-3 flex items-center justify-center shrink-0 cursor-pointer"
                          onClick={() => navigateTo('product', { id: item.product.id })}
                        >
                          <img 
                            src={item.product.image} 
                            alt={item.product.name} 
                            className="max-h-full object-contain"
                            referrerPolicy="no-referrer"
                          />
                        </div>

                        {/* Text and attributes spec indicators */}
                        <div className="text-left">
                          <span className="text-[9px] font-mono tracking-widest text-[#06B6D4] uppercase">{item.product.brand}</span>
                          <h3 
                            onClick={() => navigateTo('product', { id: item.product.id })}
                            className="font-display font-bold text-sm text-slate-900 hover:text-blue-400 cursor-pointer transition-colors max-w-[200px] sm:max-w-xs truncate"
                          >
                            {item.product.name}
                          </h3>
                          
                          {/* Selected options parameters display */}
                          <div className="flex flex-wrap gap-2.5 mt-1.5">
                            {item.selectedColor && (
                              <span className="text-[9px] font-bold uppercase tracking-wide bg-slate-100 px-2.5 py-0.5 rounded border border-slate-200 text-slate-350">
                                Hue: {item.selectedColor}
                              </span>
                            )}
                            {item.selectedStorage && item.selectedStorage !== 'Default' && (
                              <span className="text-[9px] font-bold uppercase tracking-wide bg-slate-100 px-2.5 py-0.5 rounded border border-slate-200 text-slate-350">
                                Cap: {item.selectedStorage}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Stepper + prices breakdown */}
                      <div className="flex items-center justify-between sm:justify-end gap-6 sm:gap-10 w-full sm:w-auto border-t border-slate-200 sm:border-0 pt-4 sm:pt-0">
                        {/* Stepper */}
                        <div className="flex items-center border border-slate-705 bg-slate-955 rounded-lg overflow-hidden">
                          <button
                            onClick={() => updateCartQuantity(item.product.id, item.quantity - 1, item.selectedColor, item.selectedStorage)}
                            className="px-2.5 py-1 text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                          >
                            -
                          </button>
                          <span className="px-3.5 text-xs font-bold text-slate-900 select-none">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateCartQuantity(item.product.id, item.quantity + 1, item.selectedColor, item.selectedStorage)}
                            className="px-2.5 py-1 text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                          >
                            +
                          </button>
                        </div>

                        {/* Price Subtotal Display */}
                        <div className="text-right flex flex-col gap-0.5">
                          <p className="text-xs text-slate-500 font-mono font-semibold uppercase tracking-wider">Line Cost</p>
                          <p className="text-sm font-black text-[#3B82F6]">${lineTotal}</p>
                          {item.quantity > 1 && (
                            <span className="text-[10px] text-slate-500 font-mono">${item.product.price} each</span>
                          )}
                        </div>

                        {/* Trash trigger */}
                        <button
                          onClick={() => removeFromCart(item.product.id, item.selectedColor, item.selectedStorage)}
                          className="p-2 border border-slate-200 hover:border-red-500/20 text-slate-500 hover:text-red-500 rounded bg-slate-100 hover:bg-red-500/5 duration-200 cursor-pointer"
                          title="Remove Cart Row"
                          aria-label={`Remove ${item.product.name} from shopping cart`}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>

                    </div>
                  );
                })}
              </div>
            </div>

            {/* LOWER CART DIRECT NAVIGATION CONTROLS */}
            <div className="flex justify-between items-center mt-2">
              <button
                onClick={() => navigateTo('shop')}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-400 hover:text-blue-300 transition-colors cursor-pointer"
              >
                <ArrowLeft size={14} /> Continue Tech Shopping
              </button>
            </div>
          </div>

          {/* RIGHT ORDER SUMMARY CARD */}
          <div className="w-full lg:w-1/3 flex flex-col gap-6 sticky top-[95px]">
            
            {/* Promo application panel */}
            <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <TicketPercent size={18} className="text-[#06B6D4]" />
                <h3 className="font-display font-extrabold text-xs uppercase tracking-wider text-slate-900">
                  Unlock Discount Token
                </h3>
              </div>
              
              {!couponCode ? (
                <form onSubmit={handleApplyPromo} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter Token e.g. TECH10"
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value)}
                    className="flex-1 bg-white text-xs text-slate-900 border border-slate-300/80 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 hover:text-slate-700 text-slate-600 text-xs font-bold uppercase tracking-wider rounded-lg transition-colors cursor-pointer"
                  >
                    Apply code
                  </button>
                </form>
              ) : (
                <div className="bg-green-500/10 border border-green-500/25 p-3.5 rounded-lg flex items-center justify-between text-xs text-green-400">
                  <div className="flex items-center gap-2">
                    <Sparkles size={14} />
                    <span>Applied: <strong className="font-mono text-slate-900 font-black">{couponCode}</strong> (-10%)</span>
                  </div>
                  <button 
                    onClick={removeCoupon}
                    className="text-[10px] font-bold text-red-400 hover:underline cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>

            {/* Cost matrix overlay summary */}
            <div className="bg-slate-50 border border-slate-200 p-6 rounded-2xl flex flex-col gap-5">
              <h3 className="font-display font-extrabold text-sm uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-3">
                Order Billing Brief
              </h3>

              <div className="flex flex-col gap-3 text-xs text-slate-500 font-mono">
                <div className="flex justify-between">
                  <span>Cart Items Subtotal</span>
                  <span className="font-bold text-slate-900">${subtotal.toFixed(2)}</span>
                </div>

                {couponDiscount > 0 && (
                  <div className="flex justify-between text-green-400 font-bold font-sans">
                    <span>Coupon Token Discount (10%)</span>
                    <span>-${discountVal.toFixed(2)}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Transport Delivery Fee</span>
                  <span className="font-bold text-slate-900">
                    {shippingCost === 0 ? (
                      <span className="text-green-400 font-bold uppercase font-sans">FREE ABOVE $75</span>
                    ) : (
                      `$${shippingCost.toFixed(2)}`
                    )}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>Sales Tax Surcharge (8%)</span>
                  <span className="font-bold text-slate-900">${taxVal.toFixed(2)}</span>
                </div>
                
                {/* Visual Free shipping progress bar pointer */}
                {shippingCost > 0 && (
                  <div className="bg-white p-3 rounded-lg border border-slate-200/80 mt-1 font-sans flex flex-col gap-1.5">
                    <div className="flex justify-between text-[10px] text-slate-500">
                      <span>Free shipping status:</span>
                      <span className="font-bold text-cyan-400">${(75 - netSubtotal).toFixed(2)} remaining</span>
                    </div>
                    <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-cyan-400 rounded-full" 
                        style={{ width: `${(netSubtotal / 75) * 100}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>

              <hr className="border-slate-200" />

              {/* FINAL GRAND TOTAL PRICE DISPLAY */}
              <div className="flex justify-between items-baseline">
                <span className="text-sm font-bold text-slate-900 font-display uppercase tracking-wider">Calculated Total</span>
                <span className="text-2xl font-black text-blue-400 glow-text-blue">${finalTotal.toFixed(2)}</span>
              </div>

              {/* Proceed direct action */}
              <button
                onClick={handleGoToCheckout}
                className="w-full mt-2 py-4 bg-blue-600 hover:bg-blue-500 hover:shadow-cyan-500/5 text-slate-950 hover:text-white font-black text-xs uppercase tracking-widest rounded-xl transition-all font-display duration-200 scale-100 hover:scale-[1.01] cursor-pointer glow-blue"
              >
                PROCEED TO SECURE CHECKOUT
              </button>

              {/* CARD ACCREDIT STATS CHIPS Row */}
              <div className="flex flex-col gap-2.5 items-center justify-center mt-2.5 border-t border-slate-200 pt-4 text-[10px] text-slate-500">
                <span className="uppercase font-mono tracking-widest text-[9px] text-slate-505">COMPLIANT CHANNELS:</span>
                <div className="flex items-center gap-2">
                  <span className="px-1.5 py-0.5 border border-slate-200 bg-white/40 rounded">Visa</span>
                  <span className="px-1.5 py-0.5 border border-slate-200 bg-white/40 rounded">MCard</span>
                  <span className="px-1.5 py-0.5 border border-slate-200 bg-white/40 rounded">Amex</span>
                  <span className="px-1.5 py-0.5 border border-slate-200 bg-white/40 rounded">Paypal</span>
                  <span className="px-1.5 py-0.5 border border-slate-200 bg-white/40 rounded">Apple</span>
                </div>
              </div>

            </div>
          </div>

        </div>
      )}

      {/* LOWER RELATED RECOMMENDATIONS LISTS */}
      <section id="cart-cross-sell" className="flex flex-col gap-8 pt-6 border-t border-slate-200">
        <h2 className="text-lg md:text-xl font-bold font-display text-slate-900 uppercase tracking-wider">
          You Might Also Like
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {crossSellRecommendations.map((product) => (
            <div 
              key={product.id}
              className="bg-slate-905 border border-slate-200 p-4 rounded-xl flex flex-col justify-between group hover:border-slate-200 duration-200"
            >
              <div 
                className="bg-white p-4 rounded-lg flex items-center justify-center cursor-pointer mb-3 aspect-square relative"
                onClick={() => navigateTo('product', { id: product.id })}
              >
                <img src={product.image} alt={product.name} className="max-h-20 object-contain group-hover:scale-105 transition-transform" referrerPolicy="no-referrer" />
              </div>

              <div className="text-left flex flex-col gap-1">
                <span className="text-[8px] font-mono tracking-widest text-slate-500 uppercase">{product.brand}</span>
                <p 
                  onClick={() => navigateTo('product', { id: product.id })}
                  className="font-semibold text-xs text-slate-700 hover:text-blue-400 cursor-pointer max-w-[150px] truncate"
                >
                  {product.name}
                </p>
                <p className="text-xs font-bold text-blue-400 mt-1">${product.price}</p>
                <button
                  onClick={() => addToCart(product, 1)}
                  className="w-full mt-2 py-1.5 bg-slate-100 hover:bg-blue-600 hover:text-slate-950 text-[10px] font-bold uppercase rounded text-slate-350 transition-colors cursor-pointer"
                >
                  Quick Add
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
