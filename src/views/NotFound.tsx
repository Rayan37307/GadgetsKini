/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import React from 'react';
import { useApp } from '../context/AppContext';
import { ShieldAlert, ArrowLeft, Search } from 'lucide-react';

export default function NotFound() {
  const { navigateTo } = useApp();

  return (
    <div id="not-found-view" className="pt-[140px] pb-24 text-center max-w-md mx-auto px-4 flex flex-col items-center justify-center gap-6 min-h-[60vh]">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 h-80 w-80 bg-blue-600/5 rounded-full blur-3xl pointer-events-none" />

      <div className="p-4 bg-red-500/10 text-red-400 border border-red-500/15 rounded-full z-10">
        <ShieldAlert size={40} />
      </div>

      <div className="flex flex-col gap-2.5 z-10">
        <h1 className="text-5xl font-black font-display tracking-tight text-white font-mono">404</h1>
        <h2 className="text-md font-bold uppercase tracking-widest text-[#06B6D4] font-display">Endpoint not mapped</h2>
        <p className="text-xs text-slate-400 leading-relaxed max-w-sm mx-auto">
          The requested hash coordinate is unpopulated or has been transitioned off GadgetsKini servers. Let's redirect your browser back to secure pipelines.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 w-full justify-center z-10 pt-2">
        <button
          onClick={() => navigateTo('home')}
          className="px-5 py-3 border border-slate-700 hover:border-slate-500 text-slate-300 text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5"
        >
          <ArrowLeft size={14} /> Back Home
        </button>

        <button
          onClick={() => navigateTo('shop')}
          className="px-5 py-3 bg-blue-600 hover:bg-blue-500 text-slate-950 hover:text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 glow-blue"
        >
          <Search size={14} /> Browse Catalog
        </button>
      </div>

    </div>
  );
}
