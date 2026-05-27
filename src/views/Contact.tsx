/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { MapPin, Phone, Mail, Clock, Send, ShieldCheck, Sparkles } from 'lucide-react';

export default function Contact() {
  const { triggerToast } = useApp();

  const [contactName, setContactName] = useState('Jane Doe');
  const [contactEmail, setContactEmail] = useState('r11137307@gmail.com');
  const [subject, setSubject] = useState('Technical Support');
  const [message, setMessage] = useState('');

  const [activePin, setActivePin] = useState<'boston' | 'austin' | 'sf'>('boston');

  const locInfo = {
    boston: { title: 'Headquarters Depot', address: '495 Tech Plaza, Boston, MA 02110', delay: '24 hr transit' },
    austin: { title: 'Texas Warehouse Grid', address: '120 San Jacinto Blvd, Austin, TX 78701', delay: 'Same Day Air' },
    sf: { title: 'San Francisco Hub Node', address: '85 Second St, San Francisco, CA 94105', delay: '2 Day Ground' }
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName || !contactEmail || !message) {
      triggerToast('✗ Please populate required form parameters', 'error');
      return;
    }

    triggerToast('✓ Transmission dispatched successfully! Curators will reply in 12h', 'success');
    setMessage('');
  };

  return (
    <div id="contact-view-grid" className="pb-24 max-w-7xl mx-auto px-4 md:px-8 w-full flex flex-col gap-16">
      
      {/* 1. COORDINATOR TITLE */}
      <div className="text-center max-w-2xl mx-auto flex flex-col gap-3">
        <span className="text-xs font-mono font-bold tracking-widest text-[#06B6D4] uppercase">Live Communications HQ</span>
        <h1 className="text-3xl md:text-5xl font-black font-display text-slate-900 uppercase tracking-tight leading-none">
          Get in Touch with Staff
        </h1>
        <p className="text-xs text-slate-500 leading-relaxed">
          Need configuration advice, transit status tracking, or customized bulk orders? Initiate a direct encrypted wire with our tech curators.
        </p>
      </div>

      {/* 2. FORM AND PHYSICAL ADDRESSES BLOCKS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        
        {/* LEFT ADDR DIRECTORY */}
        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* HQ */}
            <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl text-left flex flex-col gap-2 relative">
              <div className="p-2.5 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-lg w-fit">
                <MapPin size={16} />
              </div>
              <h4 className="text-xs font-bold font-display uppercase tracking-wider text-slate-900">Central HQ address</h4>
              <p className="text-xs text-slate-450 leading-relaxed font-sans">{locInfo.boston.address}</p>
            </div>

            {/* Direct Phone */}
            <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl text-left flex flex-col gap-2 relative">
              <div className="p-2.5 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-lg w-fit">
                <Phone size={16} />
              </div>
              <h4 className="text-xs font-bold font-display uppercase tracking-wider text-slate-900">Direct secure voice</h4>
              <p className="text-xs text-slate-450 leading-relaxed font-mono font-bold">+1 (800) 555-0199</p>
              <span className="text-[9px] text-[#06B6D4] font-mono">Toll Free 24/7 support</span>
            </div>

            {/* Email dispatch */}
            <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl text-left flex flex-col gap-2 relative">
              <div className="p-2.5 bg-[#06B6D4]/10 text-[#06B6D4] border border-cyan-500/20 rounded-lg w-fit">
                <Mail size={16} />
              </div>
              <h4 className="text-xs font-bold font-display uppercase tracking-wider text-slate-900">Secure mail exchange</h4>
              <p className="text-xs text-slate-450 leading-relaxed font-mono font-bold">curators@gadgetskini.com</p>
              <span className="text-[9px] text-slate-500">Corporate PGP encrypted keys available</span>
            </div>

            {/* Business hours */}
            <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl text-left flex flex-col gap-2 relative">
              <div className="p-2.5 bg-[#06B6D4]/10 text-[#06B6D4] border border-cyan-500/20 rounded-lg w-fit">
                <Clock size={16} />
              </div>
              <h4 className="text-xs font-bold font-display uppercase tracking-wider text-slate-900">Terminal Operations Hour</h4>
              <p className="text-xs text-slate-450 leading-relaxed font-sans font-bold">Mon - Fri: 09:00 - 20:00 EST</p>
              <span className="text-[9px] text-zinc-500">Auto dispatch runs 24/7</span>
            </div>

          </div>

          {/* SECURE COMPLIANCE CHIP */}
          <div className="bg-[#0f1b2d]/60 border border-slate-200 p-4 rounded-xl flex items-center gap-3">
            <ShieldCheck size={20} className="text-emerald-400 shrink-0" />
            <div className="text-[10px] text-slate-500 text-left shrink leading-relaxed">
              <strong className="text-slate-900 uppercase tracking-wider block mb-0.5">Compliant encryption</strong>
              Every transmission is signed with a mock multi-signature node verification key to prevent intercept logs.
            </div>
          </div>
        </div>

        {/* RIGHT CONTACT FORM */}
        <div className="bg-slate-50 border border-slate-200 p-6 sm:p-8 rounded-3xl relative">
          <div className="absolute inset-0 bg-radial-[at_50%_0%] from-blue-600/5 via-transparent opacity-50 pointer-events-none" />

          <form onSubmit={handleContactSubmit} className="flex flex-col gap-5 text-left relative">
            <h3 className="font-display font-black text-sm uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-3">
              Encrypted Wire Dispatch
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#06B6D4]">Core Name</label>
                <input
                  type="text"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  className="bg-slate-955 border border-slate-300 rounded-lg px-3.5 py-2.5 text-xs text-slate-900"
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#06B6D4]">Contact Email</label>
                <input
                  type="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  className="bg-slate-955 border border-slate-300 rounded-lg px-3.5 py-2.5 text-xs text-slate-900"
                  required
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-505">Subject Classification</label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="bg-slate-955 border border-slate-300 rounded-lg px-3.5 py-2.5 text-xs text-slate-900 outline-none cursor-pointer"
              >
                <option value="Technical Support">Hardware / Technical Configurations Support</option>
                <option value="Bulk Sales">Bulk Developers Alliance / Corporate Orders</option>
                <option value="General Query">General Query & Partnerships</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-505">Transmission Message Content</label>
              <textarea
                rows={5}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Log your message parameters inside this wire container..."
                className="bg-slate-955 border border-slate-300 rounded-lg px-3.5 py-2.5 text-xs text-slate-900 outline-none"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full mt-2 py-4 bg-blue-600 hover:bg-blue-500 text-white hover:text-white font-black text-xs uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer font-display scale-100 hover:scale-[1.01] active:scale-[0.98] glow-blue"
            >
              <Send size={14} /> DISPATCH ENCRYPTED WIRE MESSAGE
            </button>
          </form>
        </div>

      </div>

      {/* 3. STORE LOCATOR INTERACTIVE MAP */}
      <section id="store-locator-map-panel" className="flex flex-col gap-8 pb-10">
        <div className="text-left">
          <h2 className="text-xl md:text-2xl font-bold font-display text-slate-900 uppercase tracking-wider">Multi-Warehouse Store Locator</h2>
          <p className="text-xs text-slate-500 mt-1">Select an active node on our map to inspect inventory transit speeds</p>
        </div>

        {/* MAP SCHEMATIC BOARD CONTAINER */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row gap-8 items-stretch relative min-h-[350px]">
          
          {/* Futuristic grid background vector */}
          <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-40 pointer-events-none" />

          {/* Left Pins Selector */}
          <div className="w-full md:w-80 shrink-0 flex flex-col gap-2.5 z-10 text-left">
            {(Object.keys(locInfo) as Array<keyof typeof locInfo>).map((key) => {
              const info = locInfo[key];
              const isActive = activePin === key;
              return (
                <button
                  key={key}
                  onClick={() => setActivePin(key)}
                  className={`p-4 border rounded-xl flex flex-col gap-1 transition-all text-left cursor-pointer ${
                    isActive ? 'border-cyan-500 bg-cyan-500/5 shadow-md' : 'border-slate-200 hover:border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 uppercase tracking-wider font-display">{info.title}</span>
                    <span className="h-2 w-2 rounded-full bg-cyan-400" />
                  </div>
                  <p className="text-[10px] text-slate-500 leading-normal">{info.address}</p>
                  <p className="text-[9px] font-mono text-cyan-400 mt-1 uppercase font-bold tracking-widest">{info.delay}</p>
                </button>
              );
            })}
          </div>

          {/* Map display workspace panel */}
          <div className="flex-1 min-h-[220px] bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-center relative overflow-hidden">
            
            {/* Visual network nodes path representation */}
            <svg className="absolute inset-x-0 inset-y-0 h-full w-full opacity-15" fill="none">
              <path d="M 50 150 Q 150 50 250 150 T 450 150" stroke="#06B6D4" strokeWidth="2" strokeDasharray="5,5" />
              <path d="M 50 150 L 450 150" stroke="#3B82F6" strokeWidth="1" />
            </svg>

            {/* PINS WITH FLICKER ELEMENT ON CANVAS MAP AREA */}
            <div className="absolute top-1/4 left-1/4 select-none">
              <div 
                onClick={() => setActivePin('boston')}
                className={`flex flex-col items-center cursor-pointer transition-all ${activePin === 'boston' ? 'scale-125' : 'opacity-40 hover:opacity-100'}`}
              >
                <div className="h-3 w-3 bg-cyan-400 rounded-full animate-ping absolute" />
                <MapPin className="text-cyan-400 z-10" size={16} />
                <span className="text-[8px] font-mono uppercase tracking-widest text-slate-500 mt-1 font-bold">Boston HQ</span>
              </div>
            </div>

            <div className="absolute top-2/3 left-1/2 select-none">
              <div 
                onClick={() => setActivePin('austin')}
                className={`flex flex-col items-center cursor-pointer transition-all ${activePin === 'austin' ? 'scale-125' : 'opacity-40 hover:opacity-100'}`}
              >
                <div className="h-3 w-3 bg-blue-500 rounded-full animate-ping absolute" />
                <MapPin className="text-blue-500 z-10" size={16} />
                <span className="text-[8px] font-mono uppercase tracking-widest text-slate-500 mt-1 font-bold">Austin</span>
              </div>
            </div>

            <div className="absolute top-1/2 left-3/4 select-none">
              <div 
                onClick={() => setActivePin('sf')}
                className={`flex flex-col items-center cursor-pointer transition-all ${activePin === 'sf' ? 'scale-125' : 'opacity-40 hover:opacity-100'}`}
              >
                <div className="h-3 w-3 bg-emerald-400 rounded-full animate-ping absolute" />
                <MapPin className="text-emerald-400 z-10" size={16} />
                <span className="text-[8px] font-mono uppercase tracking-widest text-slate-500 mt-1 font-bold">SF Node</span>
              </div>
            </div>

            {/* Displaying selected info panel card on absolute frame */}
            <div className="absolute bottom-4 left-4 right-4 bg-white/90 border border-slate-200 p-4 rounded-xl text-left backdrop-blur flex justify-between items-center">
              <div className="flex items-center gap-3">
                <Sparkles size={16} className="text-amber-500 shrink-0" />
                <div>
                  <p className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold">Active Segment Focus</p>
                  <p className="text-xs font-bold text-slate-900 uppercase font-display">{locInfo[activePin].title}</p>
                </div>
              </div>
              <span className="text-[9px] font-mono text-cyan-400 font-extrabold uppercase tracking-widest border border-cyan-500/25 px-2.5 py-0.5 rounded bg-cyan-900/10">
                {locInfo[activePin].delay}
              </span>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
}
