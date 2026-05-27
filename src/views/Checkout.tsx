/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import React, { useState, useMemo } from 'react';
import { useApp, DEMO_ADDRESS } from '../context/AppContext';
import { CreditCard, Truck, ShieldCheck, Mail, ArrowLeft, ArrowRight, User, MapPin } from 'lucide-react';
import { SavedAddress, Order, OrderItem } from '../types';

export default function Checkout() {
  const { 
    cart, 
    couponDiscount, 
    couponCode, 
    addOrder, 
    navigateTo,
    triggerToast,
    userProfile
  } = useApp();

  const [activeStep, setActiveStep] = useState<1 | 2 | 3>(1);

  // STEP 1 FIELDS: ADDRESS
  const [email, setEmail] = useState(userProfile?.email || 'r11137307@gmail.com');
  const [firstName, setFirstName] = useState(DEMO_ADDRESS.firstName);
  const [lastName, setLastName] = useState(DEMO_ADDRESS.lastName);
  const [phone, setPhone] = useState(DEMO_ADDRESS.phone);
  const [addressLine1, setAddressLine1] = useState(DEMO_ADDRESS.addressLine1);
  const [addressLine2, setAddressLine2] = useState(DEMO_ADDRESS.addressLine2 || '');
  const [city, setCity] = useState(DEMO_ADDRESS.city);
  const [state, setState] = useState(DEMO_ADDRESS.state);
  const [zip, setZip] = useState(DEMO_ADDRESS.zip);
  const [country, setCountry] = useState(DEMO_ADDRESS.country);
  const [saveToAccount, setSaveToAccount] = useState(true);

  // STEP 2 FIELDS: SHIPPING METHOD
  const [shippingMethod, setShippingMethod] = useState<'standard' | 'express' | 'nextday'>('standard');

  // STEP 3 FIELDS: PAYMENT CARD
  const [cardNumber, setCardNumber] = useState('4111 2222 3333 4444');
  const [cardExpiry, setCardExpiry] = useState('11/29');
  const [cardCvv, setCardCvv] = useState('382');
  const [cardName, setCardName] = useState('JANE DOE');

  // Math Calculations
  const subtotal = useMemo(() => {
    return cart.reduce((tot, item) => tot + (item.product.price * item.quantity), 0);
  }, [cart]);

  const discountVal = subtotal * couponDiscount;
  const netSubtotal = subtotal - discountVal;

  const shippingCharge = useMemo(() => {
    if (shippingMethod === 'express') return 9.99;
    if (shippingMethod === 'nextday') return 19.99;
    
    // Standard Shipping: Free on netSubtotal >= 75, else 9.99
    return netSubtotal >= 75 ? 0 : 9.99;
  }, [shippingMethod, netSubtotal]);

  const taxVal = netSubtotal * 0.08;
  const finalTotal = netSubtotal + shippingCharge + taxVal;

  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !firstName || !lastName || !phone || !addressLine1 || !city || !_validateZip(zip) || !country) {
      triggerToast('✗ Please enter all required shipping coordinates accurately', 'error');
      return;
    }
    setActiveStep(2);
    triggerToast('✓ Demographics recorded. Choose shipping speed', 'success');
  };

  const handleStep2Submit = () => {
    setActiveStep(3);
    triggerToast('✓ Shipping rate locked and compiled', 'success');
  };

  const handleStep3Submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cardNumber || !cardExpiry || !cardCvv || !cardName) {
      triggerToast('✗ Card information incomplete', 'error');
      return;
    }

    // Place historical mock order
    const randId = Math.floor(100000 + Math.random() * 900000);
    const orderNo = `GK-${randId}`;

    const shippingAddress: SavedAddress = {
      id: Math.random().toString(),
      firstName,
      lastName,
      phone,
      email,
      addressLine1,
      addressLine2,
      city,
      state,
      zip,
      country,
    };

    const orderedItemsList: OrderItem[] = cart.map(item => ({
      productId: item.product.id,
      name: item.product.name,
      price: item.product.price,
      quantity: item.quantity,
      image: item.product.image,
      variant: item.selectedColor || 'Cosmic Slate',
    }));

    const methodLabel = shippingMethod === 'standard' 
      ? `Standard (${shippingCharge === 0 ? 'Free' : '$9.99'}, 5-7 days)` 
      : shippingMethod === 'express'
        ? 'Express ($9.99, 2-3 days)'
        : 'Next Day ($19.99, 1 day)';

    const newOrder: Order = {
      id: orderNo,
      date: new Date().toISOString().split('T')[0],
      items: orderedItemsList,
      subtotal,
      discount: discountVal,
      shippingCharge,
      tax: taxVal,
      total: finalTotal,
      shippingAddress,
      shippingMethod: methodLabel,
      status: 'Processing',
    };

    addOrder(newOrder);
    
    // Store transient order id for the confirmation viewport
    localStorage.setItem('gk_latest_order_id', orderNo);
    
    navigateTo('order-confirmation');
  };

  const _validateZip = (val: string) => {
    return val.trim().length >= 4;
  };

  const stepLabels = [
    { nr: 1, label: 'Coordinates' },
    { nr: 2, label: 'Transition Speed' },
    { nr: 3, label: 'Card Settlement' }
  ];

  return (
    <div id="checkout-view-grid" className="pt-[110px] pb-24 max-w-7xl mx-auto px-4 md:px-8 w-full flex flex-col gap-10">
      
      {/* CHECKOUT BREADCRUMB */}
      <div className="flex items-center gap-1.5 text-xs text-slate-500 font-mono">
        <a href="#home" onClick={() => navigateTo('home')} className="hover:text-blue-400">Home</a>
        <span className="text-slate-700">/</span>
        <a href="#cart" onClick={() => navigateTo('cart')} className="hover:text-blue-400">Shopping Cart</a>
        <span className="text-slate-700">/</span>
        <span className="text-slate-300 font-semibold">Checkout Pipeline</span>
      </div>

      {/* STEPPERS GRAPH HEADER OVERLAY */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-slate-900 border border-slate-800 p-6 rounded-2xl">
        <div className="text-center md:text-left flex flex-col gap-1">
          <h1 className="text-lg md:text-xl font-bold font-display text-white uppercase tracking-wider">Secure Billing Hub</h1>
          <p className="text-xs text-slate-400">Secure end-to-end sandbox. Zero physical charges processed.</p>
        </div>

        {/* PROGRESS STEPPER BAR */}
        <div className="flex items-center gap-2 font-mono text-[10px]">
          {stepLabels.map((st, i) => {
            const isCompleted = activeStep > st.nr;
            const isCurrent = activeStep === st.nr;
            return (
              <React.Fragment key={st.nr}>
                {i > 0 && <div className={`w-6 h-[1.5px] ${isCompleted ? 'bg-blue-500' : 'bg-slate-850'}`} />}
                <div className="flex items-center gap-1.5">
                  <div className={`h-6 w-6 rounded-full flex items-center justify-center font-bold text-[10px] border transition-all ${
                    isCompleted 
                      ? 'bg-blue-600 border-blue-500 text-slate-950' 
                      : isCurrent 
                        ? 'bg-slate-950 border-cyan-500 text-cyan-400 glow-cyan font-black' 
                        : 'border-slate-800 text-slate-400'
                  }`}>
                    {st.nr}
                  </div>
                  <span className={isCurrent ? 'text-cyan-400 font-bold' : isCompleted ? 'text-blue-400' : 'text-slate-500'}>
                    {st.label}
                  </span>
                </div>
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* CORE BODY GRID */}
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        
        {/* LEFT ACTIVE FORMS STEP BLOCK */}
        <div className="w-full lg:w-2/3 flex flex-col gap-6">
          
          {/* STEP 1: DEMOGRAPHICS */}
          {activeStep === 1 && (
            <div className="bg-slate-900/45 border border-slate-800 p-6 sm:p-8 rounded-2xl">
              <form onSubmit={handleStep1Submit} className="flex flex-col gap-5">
                <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
                  <User size={18} className="text-blue-400" />
                  <h2 className="font-display font-black text-sm uppercase tracking-wider text-white">
                    Step 1: Contact & Shipping Demographics
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">System Email Address</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. janedoe@gmail.com"
                      className="bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2.5 text-xs text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-blue-500"
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Active Mobile Number</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="e.g. +1 800-555-0199"
                      className="bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2.5 text-xs text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-blue-500"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Given First Name</label>
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="e.g. Jane"
                      className="bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-blue-500"
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Family Last Name</label>
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="e.g. Doe"
                      className="bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-blue-500"
                      required
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Physical Address Line 1</label>
                  <input
                    type="text"
                    value={addressLine1}
                    onChange={(e) => setAddressLine1(e.target.value)}
                    placeholder="e.g. 1600 Amphitheatre Parkway"
                    className="bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Address Line 2 (Apartment, room, suite etc.)</label>
                  <input
                    type="text"
                    value={addressLine2}
                    onChange={(e) => setAddressLine2(e.target.value)}
                    placeholder="e.g. Suite 402"
                    className="bg-slate-950 border border-slate-704 rounded-lg px-3.5 py-2.5 text-xs text-slate-100 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="col-span-2 md:col-span-1 flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Town/City</label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="Mountain View"
                      className="bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2.5 text-xs text-slate-100 focus:outline-none"
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">State / Region</label>
                    <input
                      type="text"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      placeholder="CA"
                      className="bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2.5 text-xs text-slate-100 focus:outline-none"
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Zip/Postal Code</label>
                    <input
                      type="text"
                      value={zip}
                      onChange={(e) => setZip(e.target.value)}
                      placeholder="94043"
                      className="bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2.5 text-xs text-slate-100 focus:outline-none"
                      required
                    />
                  </div>
                  <div className="col-span-2 md:col-span-1 flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Country Domain</label>
                    <input
                      type="text"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      placeholder="United States"
                      className="bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2.5 text-xs text-slate-100 focus:outline-none"
                      required
                    />
                  </div>
                </div>

                <label className="flex items-center gap-2 text-xs text-slate-400 mt-2 select-none cursor-pointer">
                  <input
                    type="checkbox"
                    checked={saveToAccount}
                    onChange={(e) => setSaveToAccount(e.target.checked)}
                    className="accent-blue-500 rounded cursor-pointer"
                  />
                  <span>Save this shipping configuration address into my secure Account Dashboard</span>
                </label>

                <button
                  type="submit"
                  className="w-full mt-4 py-3.5 bg-blue-600 hover:bg-blue-500 text-slate-950 hover:text-white text-xs font-black uppercase tracking-wider font-display rounded-xl transition-colors duration-250 cursor-pointer flex items-center justify-center gap-1.5"
                >
                  Save & Continue to Delivery Rates <ArrowRight size={14} />
                </button>
              </form>
            </div>
          )}

          {/* STEP 2: SHIPPING SPEED MIGRATION */}
          {activeStep === 2 && (
            <div className="bg-slate-900/45 border border-slate-800 p-6 sm:p-8 rounded-2xl flex flex-col gap-6">
              <div className="flex items-center gap-2 border-b border-slate-805 pb-3">
                <Truck size={18} className="text-[#06B6D4]" />
                <h2 className="font-display font-black text-sm uppercase tracking-wider text-white">
                  Step 2: Choose Transition Speed
                </h2>
              </div>

              <div className="flex flex-col gap-4">
                {/* Standard option */}
                <label className={`p-4 border rounded-xl flex items-center justify-between cursor-pointer transition-all ${
                  shippingMethod === 'standard' 
                    ? 'border-blue-500 bg-blue-500/5 text-white' 
                    : 'border-slate-800 hover:border-slate-700 text-slate-400'
                }`}>
                  <div className="flex items-center gap-4">
                    <input
                      type="radio"
                      name="shipping-rate"
                      checked={shippingMethod === 'standard'}
                      onChange={() => setShippingMethod('standard')}
                      className="accent-blue-500 cursor-pointer w-4 h-4"
                    />
                    <div className="text-left flex flex-col gap-0.5">
                      <p className="text-xs font-bold uppercase tracking-wider text-white font-display">Standard Postal ground</p>
                      <p className="text-[10px] text-slate-500 font-mono">Expected duration: 5–7 general workdays</p>
                    </div>
                  </div>
                  <span className="text-xs font-extrabold text-[#06B6D4]">
                    {netSubtotal >= 75 ? (
                      <span className="text-emerald-400 uppercase font-sans">FREE ORDER ACCREDIT</span>
                    ) : (
                      '$9.99'
                    )}
                  </span>
                </label>

                {/* Express option */}
                <label className={`p-4 border rounded-xl flex items-center justify-between cursor-pointer transition-all ${
                  shippingMethod === 'express' 
                    ? 'border-blue-500 bg-blue-500/5 text-white' 
                    : 'border-slate-800 hover:border-slate-700 text-slate-400'
                }`}>
                  <div className="flex items-center gap-4">
                    <input
                      type="radio"
                      name="shipping-rate"
                      checked={shippingMethod === 'express'}
                      onChange={() => setShippingMethod('express')}
                      className="accent-blue-500 cursor-pointer w-4 h-4"
                    />
                    <div className="text-left flex flex-col gap-0.5">
                      <p className="text-xs font-bold uppercase tracking-wider text-white font-display">Express Air transition courier</p>
                      <p className="text-[10px] text-slate-500 font-mono">Expected duration: 2–3 active workdays</p>
                    </div>
                  </div>
                  <span className="text-xs font-extrabold text-blue-400">$9.99</span>
                </label>

                {/* Next Day option */}
                <label className={`p-4 border rounded-xl flex items-center justify-between cursor-pointer transition-all ${
                  shippingMethod === 'nextday' 
                    ? 'border-blue-500 bg-blue-500/5 text-white' 
                    : 'border-slate-800 hover:border-slate-700 text-slate-400'
                }`}>
                  <div className="flex items-center gap-4">
                    <input
                      type="radio"
                      name="shipping-rate"
                      checked={shippingMethod === 'nextday'}
                      onChange={() => setShippingMethod('nextday')}
                      className="accent-blue-500 cursor-pointer w-4 h-4"
                    />
                    <div className="text-left flex flex-col gap-0.5">
                      <p className="text-xs font-bold uppercase tracking-wider text-white font-display">Next Day Air delivery tier</p>
                      <p className="text-[10px] text-slate-500 font-mono">Expected duration: 24h absolute dispatch</p>
                    </div>
                  </div>
                  <span className="text-xs font-extrabold text-blue-400">$19.99</span>
                </label>
              </div>

              {/* NAV BUTTONS */}
              <div className="flex gap-4 pt-4 border-t border-slate-850">
                <button
                  onClick={() => setActiveStep(1)}
                  className="flex-1 py-3 border border-slate-700 text-slate-300 text-xs font-bold uppercase tracking-wider rounded-xl cursor-pointer hover:bg-slate-800 duration-200"
                >
                  Back to Coordinates
                </button>
                <button
                  onClick={handleStep2Submit}
                  className="flex-1 py-3 bg-blue-600 hover:bg-blue-500 text-slate-950 hover:text-white text-xs font-black uppercase tracking-wider rounded-xl transition-colors cursor-pointer"
                >
                  Proceed to Settling Payment
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: PAYMENT DETAILS */}
          {activeStep === 3 && (
            <div className="bg-slate-900/45 border border-slate-800 p-6 sm:p-8 rounded-2xl">
              <form onSubmit={handleStep3Submit} className="flex flex-col gap-5">
                <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
                  <CreditCard size={18} className="text-green-400" />
                  <h2 className="font-display font-black text-sm uppercase tracking-wider text-white">
                    Step 3: Secure Credit Settlement
                  </h2>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Card Holder Full Name</label>
                  <input
                    type="text"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value.toUpperCase())}
                    className="bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2.5 text-xs text-white placeholder:text-slate-600 focus:outline-none"
                    required
                  />
                </div>

                <div className="flex flex-col gap-1.5 relative">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Credit Card Number</label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    placeholder="4111 2222 3333 4444"
                    maxLength={19}
                    className="bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2.5 text-xs text-white placeholder:text-slate-600 pr-10 focus:outline-none focus:border-blue-500"
                    required
                  />
                  <CreditCard size={16} className="absolute right-3.5 top-[32px] text-slate-500" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Expiry Metric</label>
                    <input
                      type="text"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      placeholder="MM/YY"
                      maxLength={5}
                      className="bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none"
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">CVV Secure Pin</label>
                    <input
                      type="password"
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value)}
                      placeholder="e.g. 123"
                      maxLength={3}
                      className="bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none"
                      required
                    />
                  </div>
                </div>

                <div className="p-4 border border-slate-805 bg-[#0e1625] rounded-xl flex gap-3 text-[10px] text-slate-400">
                  <ShieldCheck size={16} className="text-emerald-400 shrink-0" />
                  <span>Your credit logs are fully secured via encrypted token pipelines in compliant environments. Absolutely no financial properties are compromised inside our tech store sandbox.</span>
                </div>

                {/* NAV ACTIONS */}
                <div className="flex gap-4 pt-4 border-t border-slate-850">
                  <button
                    type="button"
                    onClick={() => setActiveStep(2)}
                    className="flex-1 py-3 border border-slate-700 text-slate-300 text-xs font-bold uppercase tracking-wider rounded-xl cursor-pointer hover:bg-slate-800 duration-200"
                  >
                    Rates Selection
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-[#10B981] hover:bg-emerald-500 text-slate-950 hover:text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all inline-flex items-center justify-center gap-1.5 cursor-pointer glow-blue"
                  >
                    Place Mock Order 🎉
                  </button>
                </div>
              </form>
            </div>
          )}

        </div>

        {/* ================= RIGHT SUMMARY PANELS ================= */}
        <aside id="checkout-sidebar-summary" className="w-full lg:w-1/3 flex flex-col gap-6 sticky top-[95px]">
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex flex-col gap-4">
            <h3 className="font-display font-extrabold text-xs uppercase tracking-wider text-white border-b border-slate-850 pb-2">
              Queue Review
            </h3>

            {/* MINI ITEM LINES */}
            <div className="flex flex-col gap-3 max-h-60 overflow-y-auto pr-1">
              {cart.map((item, idX) => (
                <div key={idX} className="flex gap-3 justify-between items-center text-xs">
                  <div className="flex gap-2.5 items-center">
                    <div className="w-10 h-10 bg-slate-950 border border-slate-800 rounded p-1.5 flex items-center justify-center relative shrink-0">
                      <img src={item.product.image} alt={item.product.name} className="max-h-full object-contain" referrerPolicy="no-referrer" />
                      <span className="absolute -top-1 -right-1 h-4 w-4 bg-blue-600 text-[9px] font-bold text-white rounded-full flex items-center justify-center">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="text-left shrink max-w-[140px] md:max-w-[120px]">
                      <p className="font-semibold text-white truncate">{item.product.name}</p>
                      <p className="text-[10px] text-slate-500 truncate">{item.selectedColor || 'Cosmic Slate'}</p>
                    </div>
                  </div>
                  <span className="font-bold text-blue-400 font-mono shrink-0">
                    ${(item.product.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <hr className="border-slate-850" />

            {/* METRICS COST SUMS */}
            <div className="flex flex-col gap-2.5 text-xs text-slate-400 font-mono">
              <div className="flex justify-between">
                <span>Subtotal Sum</span>
                <span className="font-bold text-white">${subtotal.toFixed(2)}</span>
              </div>
              {couponDiscount > 0 && (
                <div className="flex justify-between text-green-400 font-bold font-sans">
                  <span>Coupon Deduction (-10%)</span>
                  <span>-${discountVal.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Delivery Courier Fee</span>
                <span className="font-bold text-cyan-400 uppercase font-sans">
                  {shippingCharge === 0 ? 'FREE GROUND' : `$${shippingCharge.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between">
                <span>State Sales Tax (8%)</span>
                <span className="font-bold text-white">${taxVal.toFixed(2)}</span>
              </div>
            </div>

            <hr className="border-slate-850" />

            {/* GRAND TOTAL */}
            <div className="flex justify-between items-baseline">
              <span className="text-xs font-bold text-white uppercase tracking-wider font-display">Calculated Invoice</span>
              <span className="text-xl font-black text-blue-400 font-display">${finalTotal.toFixed(2)}</span>
            </div>
          </div>
        </aside>

      </div>

    </div>
  );
}
