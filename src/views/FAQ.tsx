/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { FAQS } from '../data';
import { HelpCircle, ChevronDown, MessageSquare, Search, ArrowRight } from 'lucide-react';

export default function FAQ() {
  const { navigateTo } = useApp();

  // Search input and category filter keys
  const [searchQuery, setSearchQuery] = useState('');
  const [activeGroup, setActiveGroup] = useState<string>('All');

  // Expanded FAQ ID mapper keys (e.g., "groupName-index")
  const [expandedKeys, setExpandedKeys] = useState<string[]>([]);

  const toggleExpand = (key: string) => {
    if (expandedKeys.includes(key)) {
      setExpandedKeys(prev => prev.filter(k => k !== key));
    } else {
      setExpandedKeys(prev => [...prev, key]);
    }
  };

  const groups = useMemo(() => {
    return ['All', ...FAQS.map(f => f.group)];
  }, []);

  // Filter FAQs dynamically based on inputs
  const filteredFAQs = useMemo(() => {
    return FAQS.map(g => {
      // Filter out entire group if categorization active and mismatch
      if (activeGroup !== 'All' && g.group !== activeGroup) {
        return null;
      }

      // Filter individual questions by query
      const matchingQS = g.questions.filter(item => {
        const query = searchQuery.toLowerCase();
        return item.q.toLowerCase().includes(query) || item.a.toLowerCase().includes(query);
      });

      if (matchingQS.length === 0) return null;

      return {
        ...g,
        questions: matchingQS
      };
    }).filter(Boolean) as typeof FAQS;
  }, [activeGroup, searchQuery]);

  return (
    <div id="faq-view-container" className="pb-24 max-w-4xl mx-auto px-4 md:px-8 w-full flex flex-col gap-10">
      
      {/* 1. TEXT HEADER */}
      <div className="text-center flex flex-col gap-3">
        <span className="text-xs font-mono font-bold tracking-widest text-blue-400 uppercase">GADGETSKINI CUSTOMER PORTAL</span>
        <h1 className="text-3xl md:text-5xl font-black font-display text-slate-900 uppercase tracking-tight">
          Help Desk Center
        </h1>
        <p className="text-xs text-slate-500 max-w-lg mx-auto leading-relaxed">
          Search answers related to wholesale secure delivery, custom returns policies, and credit card gateway compliance systems.
        </p>
      </div>

      {/* 2. SEARCH & GROUP CONTROLS BAR */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between border-b border-slate-200 pb-6">
        
        {/* Search Input bar */}
        <div className="relative w-full md:w-80 text-left">
          <input
            type="text"
            placeholder="Search FAQs e.g. TECH10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 text-xs border border-slate-750 text-slate-900 rounded-lg pl-9 pr-4 py-2.5 outline-none focus:border-blue-500"
          />
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-505" />
        </div>

        {/* Categories togglers */}
        <div className="flex gap-2 overflow-x-auto max-w-full pb-1 pr-1">
          {groups.map((grp) => {
            const isSel = activeGroup === grp;
            return (
              <button
                key={grp}
                onClick={() => { setActiveGroup(grp); setExpandedKeys([]); }}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider whitespace-nowrap cursor-pointer border ${
                  isSel ? 'bg-cyan-500/10 border-cyan-500 text-cyan-400' : 'bg-slate-50 border-slate-200 text-slate-500 hover:text-slate-700'
                }`}
              >
                {grp}
              </button>
            );
          })}
        </div>

      </div>

      {/* 3. ACCORDION PANELS FOR EACH MATCHED FAQS */}
      <div className="flex flex-col gap-8 text-left">
        {filteredFAQs.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-xs">
            No matching questions found inside this FAQ database. Try adjusting search criteria parameters.
          </div>
        ) : (
          filteredFAQs.map((groupBlob) => (
            <div key={groupBlob.group} className="flex flex-col gap-4">
              <h3 className="text-xs font-mono font-bold tracking-widest text-[#06B6D4] uppercase border-b border-slate-200 pb-2">
                {groupBlob.group}
              </h3>

              <div className="flex flex-col gap-3">
                {groupBlob.questions.map((item, idx) => {
                  const itemKey = `${groupBlob.group}-${idx}`;
                  const isExpanded = expandedKeys.includes(itemKey);
                  return (
                    <div 
                      key={idx}
                      className="border border-slate-200 bg-white/20 rounded-xl overflow-hidden transition-all duration-300"
                    >
                      {/* Accordion header button */}
                      <button
                        onClick={() => toggleExpand(itemKey)}
                        className="w-full p-4 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-white/40 text-xs text-slate-900"
                        aria-expanded={isExpanded}
                      >
                        <span className="font-semibold font-display tracking-tight text-slate-900">{item.q}</span>
                        <ChevronDown 
                          size={14} 
                          className={`text-[#06B6D4] transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} 
                        />
                      </button>

                      {/* Accordion expand block */}
                      <div 
                        className={`transition-all duration-300 overflow-hidden ${
                          isExpanded ? 'max-h-56 border-t border-slate-200' : 'max-h-0'
                        }`}
                      >
                        <p className="p-4 bg-white/40 text-slate-500 text-xs leading-relaxed font-sans select-text">
                          {item.a}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>

      {/* 4. RED FOOTER CALL TO ACTION STILL HAVE QUESTIONS BAR */}
      <section className="bg-slate-50 border border-slate-200 p-8 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-blue-600/10 text-blue-400 border border-blue-500/20 rounded-xl shrink-0 hidden sm:block">
            <MessageSquare size={20} />
          </div>
          <div>
            <h4 className="text-sm font-bold font-display uppercase tracking-wider text-slate-900">Still have questions?</h4>
            <p className="text-xs text-slate-500 mt-1">Our live product curators are accessible 24/7 for tailored hardware evaluations.</p>
          </div>
        </div>

        <button
          onClick={() => navigateTo('contact')}
          className="px-5 py-3 bg-blue-600 hover:bg-blue-500 text-white hover:text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all flex items-center gap-1 cursor-pointer font-display scale-100 hover:scale-103 duration-200"
        >
          Dispatch Wire help <ArrowRight size={14} />
        </button>
      </section>

    </div>
  );
}
