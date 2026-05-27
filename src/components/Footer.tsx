/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Twitter, 
  Instagram, 
  Youtube, 
  Linkedin, 
  Github,
  Mail, 
  ArrowRight,
  ShieldCheck,
  CreditCard
} from 'lucide-react';

export default function Footer() {
  const { navigateTo, triggerToast } = useApp();
  const [email, setEmail] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      triggerToast('✓ Subscribed! Prepare for weekly tech drops 🚀', 'success');
      setEmail('');
    }
  };

  const handleNav = (view: string, scrollTarget?: string) => {
    navigateTo(view);
    if (scrollTarget) {
      setTimeout(() => {
        const el = document.getElementById(scrollTarget);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
    }
  };

  return (
    <footer id="main-footer" className="bg-slate-50 border-t border-slate-200 text-slate-500">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* COLUMN 1: CORPORATE */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            <a 
              href="#home" 
              onClick={(e) => { e.preventDefault(); handleNav('home'); }}
              className="text-2xl font-display font-extrabold tracking-wider text-slate-900"
            >
              GADGETS<span className="text-cyan-400 font-black">KINI</span>
            </a>
            <p className="text-slate-500 text-sm leading-relaxed">
              We live and breathe tech. Our curators handpick future-proof gadgets and genuine products for those who dare to step into tomorrow, today. Warranty secured and fast delivered.
            </p>
            {/* SOCIALS */}
            <div className="flex items-center gap-3 mt-2">
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noreferrer" 
                aria-label="X Twitter"
                className="p-2.5 bg-slate-100 hover:bg-blue-500 hover:text-white rounded-lg transition-all text-slate-600"
              >
                <Twitter size={16} />
              </a>
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noreferrer" 
                aria-label="Instagram"
                className="p-2.5 bg-slate-100 hover:bg-pink-500 hover:text-slate-700 rounded-lg transition-all text-slate-600"
              >
                <Instagram size={16} />
              </a>
              <a 
                href="https://youtube.com" 
                target="_blank" 
                rel="noreferrer" 
                aria-label="YouTube"
                className="p-2.5 bg-slate-100 hover:bg-red-500 hover:text-white rounded-lg transition-all text-slate-600"
              >
                <Youtube size={16} />
              </a>
              <a 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noreferrer" 
                aria-label="LinkedIn"
                className="p-2.5 bg-slate-100 hover:bg-blue-700 hover:text-white rounded-lg transition-all text-slate-600"
              >
                <Linkedin size={16} />
              </a>
            </div>
          </div>

          {/* COLUMN 2: SHOP CATEGORIES */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <h4 id="footer-shop-title" className="text-slate-900 font-display text-sm font-bold tracking-wider uppercase">Shop Widgets</h4>
            <ul aria-labelledby="footer-shop-title" className="flex flex-col gap-2 text-sm">
              <li>
                <button 
                  onClick={() => handleNav('shop')} 
                  className="hover:text-cyan-400 transition-colors text-left"
                >
                  All Products
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNav('home', 'hot-deals')} 
                  className="hover:text-cyan-400 transition-colors text-left"
                >
                  Deals & Discounts
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNav('home', 'new-arrivals')} 
                  className="hover:text-cyan-400 transition-colors text-left"
                >
                  New Arrivals
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNav('shop')} 
                  className="hover:text-cyan-400 transition-colors text-left"
                >
                  Bestsellers
                </button>
              </li>
            </ul>
          </div>

          {/* COLUMN 3: SUPPORT & LEGAL */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <h4 id="footer-support-title" className="text-slate-900 font-display text-sm font-bold tracking-wider uppercase">Support Direct</h4>
            <ul aria-labelledby="footer-support-title" className="flex flex-col gap-2 text-sm">
              <li>
                <button 
                  onClick={() => handleNav('faq')} 
                  className="hover:text-cyan-400 transition-colors text-left"
                >
                  FAQs
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNav('contact')} 
                  className="hover:text-cyan-400 transition-colors text-left"
                >
                  Contact HQ
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNav('faq')} 
                  className="hover:text-cyan-400 transition-colors text-left"
                >
                  Returns Info
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNav('faq')} 
                  className="hover:text-cyan-400 transition-colors text-left"
                >
                  Warranty Terms
                </button>
              </li>
            </ul>
          </div>

          {/* COLUMN 4: NEWSLETTER */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            <h4 id="footer-newsletter-title" className="text-slate-900 font-display text-sm font-bold tracking-wider uppercase">Newsletter Drop</h4>
            <p className="text-slate-500 text-xs leading-relaxed">
              Get weekly tech drops, high-spec insights, and priority access to active discount tokens before anyone else.
            </p>
            <form onSubmit={handleSubscribe} className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type="email"
                  placeholder="Enter email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-100 text-xs text-slate-900 border border-slate-300 hover:border-slate-400 rounded-lg py-2.5 pl-3 pr-8 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  required
                />
                <Mail size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500" />
              </div>
              <button
                type="submit"
                className="px-4 bg-blue-600 hover:bg-blue-500 active:scale-95 text-xs font-bold text-white uppercase tracking-wider rounded-lg transition-all flex items-center justify-center cursor-pointer glow-blue"
              >
                JOIN
              </button>
            </form>
            <div className="flex items-center gap-1.5 text-[10px] text-slate-500 mt-1">
              <ShieldCheck size={12} className="text-blue-500" />
              <span>No spam sequence. Opt-out at any instant.</span>
            </div>
          </div>

        </div>

        {/* BOTTOM SECTION */}
        <hr className="border-slate-200 my-10" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="text-xs text-slate-500 flex flex-wrap items-center gap-x-4 gap-y-2">
            <span>© 2026 GadgetsKini. All rights reserved.</span>
            <span>|</span>
            <button onClick={() => handleNav('about')} className="hover:text-slate-600">Privacy Policy</button>
            <span>•</span>
            <button onClick={() => handleNav('about')} className="hover:text-slate-600">Terms of Use</button>
          </div>

          {/* ACCEPTED CARD ICON CHIPS */}
          <div className="flex items-center gap-2">
            <div id="payment-badge-visa" className="px-2 py-1 bg-slate-100 text-[10px] font-bold text-slate-600 rounded border border-slate-300 uppercase tracking-widest">
              Visa
            </div>
            <div id="payment-badge-mastercard" className="px-2 py-1 bg-slate-100 text-[10px] font-bold text-slate-600 rounded border border-slate-300 uppercase tracking-widest">
              MCard
            </div>
            <div id="payment-badge-paypal" className="px-2 py-1 bg-slate-100 text-[10px] font-bold text-slate-600 rounded border border-slate-300 uppercase tracking-widest">
              Paypal
            </div>
            <div id="payment-badge-applepay" className="px-2 py-1 bg-slate-100 text-[10px] font-bold text-slate-600 rounded border border-slate-300 uppercase tracking-widest">
              ApplePay
            </div>
            <div id="payment-badge-gpay" className="px-2 py-1 bg-slate-100 text-[10px] font-bold text-slate-600 rounded border border-slate-300 uppercase tracking-widest">
              GPay
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
}
