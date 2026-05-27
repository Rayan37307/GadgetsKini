/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import React from 'react';
import { useApp } from '../context/AppContext';
import { TEAM_MEMBERS } from '../data';
import { Sparkles, ShieldCheck, HelpCircle, Users, Trophy } from 'lucide-react';

export default function AboutUs() {
  const { navigateTo } = useApp();

  const stats = [
    { title: '50,000+', text: 'Satisfied Cyber Customers' },
    { title: '1,200+', text: 'Tested Gadget Assets' },
    { title: '15+', text: 'Official Brand Partner Alliances' },
    { title: '4.8★', text: 'Average Customer Score' },
  ];

  const valuesCard = [
    {
      title: 'Curated Tech Selection',
      icon: <Sparkles size={22} className="text-[#06B6D4]" />,
      desc: 'We do not sell wholesale commodities. Our curators vet every processor, driver, and battery benchmark so you receive future-ready equipment.'
    },
    {
      title: 'Genuine Authenticity',
      icon: <ShieldCheck size={22} className="text-blue-400" />,
      desc: 'GadgetsKini has verified wholesale supply alignments directly with Apple, Samsung, Sony, Bose, and Xiaomi. Every package has official seal tags.'
    },
    {
      title: 'Expert Expert Service',
      icon: <HelpCircle size={22} className="text-amber-400" />,
      desc: 'Connect with true hardware enthusiasts. Our live support leads are active developers and testers ready to audit your multi-node smart configurations.'
    },
  ];

  return (
    <div id="about-view-scene" className="pb-24 max-w-7xl mx-auto px-4 md:px-8 w-full flex flex-col gap-16 md:gap-24">
      
      {/* 1. HERO STORY BANNER */}
      <section className="bg-slate-50 border border-slate-200 rounded-3xl p-8 md:p-16 lg:p-20 relative overflow-hidden text-center md:text-left flex flex-col md:flex-row items-center gap-10">
        <div className="absolute inset-0 bg-radial-[at_50%_40%] from-blue-600/10 via-transparent to-transparent opacity-60 pointer-events-none" />
        
        <div className="flex-1 flex flex-col gap-5">
          <span className="text-xs font-mono font-bold tracking-widest text-cyan-400 uppercase">THE GADGETSKINI EPIC</span>
          <h1 className="text-4xl md:text-5xl font-black font-display text-slate-900 tracking-tight leading-none uppercase">
            We live and<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3B82F6] to-cyan-400">breathe tech.</span>
          </h1>
          <p className="text-sm text-slate-500 leading-relaxed max-w-xl">
            Established in 2023, GadgetsKini was conceived by a small circle of hardware developers tired of low-tier commodity electronics flooding the market space. We set out to create a dedicated depot where developers, sound enthusiasts, and technology geeks can retrieve pristine hardware benchmarks securely.
          </p>
          <p className="text-xs text-slate-500 leading-relaxed">
            Headquartered in Boston, MA, with micro-transit nodes placed across key regions, we guarantee that tomorrow’s equipment lands safely on your workbench, today.
          </p>
        </div>

        <div className="flex-1 w-full flex items-center justify-center">
          <img 
            src="https://picsum.photos/seed/tech_story/500/350" 
            alt="Corporate Tech Work Bench" 
            className="rounded-2xl border border-slate-200 shadow-2xl w-full max-w-md object-cover transform rotate-1 hover:rotate-0 duration-300 pointer-events-none"
            referrerPolicy="no-referrer"
          />
        </div>
      </section>

      {/* 2. SCALE STATISTICS COUNTER ROW */}
      <section id="about-stats-strip" className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {stats.map((st, id) => (
          <div key={id} className="bg-white/40 border border-slate-200 p-6 rounded-2xl text-center flex flex-col gap-1.5 relative group">
            <span className="text-3xl md:text-4xl font-black font-display text-blue-400 glow-text-blue">{st.title}</span>
            <hr className="w-10 border-slate-200 mx-auto" />
            <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500 font-bold">{st.text}</span>
          </div>
        ))}
      </section>

      {/* 3. VALUE PROPOSITION BLOB CARDS */}
      <section className="flex flex-col gap-12">
        <div className="text-center flex flex-col gap-2">
          <h2 className="text-xs font-mono tracking-widest text-[#06B6D4] uppercase font-bold">Standard Matrices</h2>
          <p className="text-2xl md:text-3xl font-bold font-display text-slate-900">Why GadgetsKini Leads</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {valuesCard.map((card, i) => (
            <div key={i} className="bg-slate-50 border border-slate-200 p-6 md:p-8 rounded-2xl text-left flex flex-col gap-4 relative">
              <div className="p-3.5 bg-white border border-slate-200 rounded-xl w-fit">
                {card.icon}
              </div>
              <h3 className="text-sm font-bold font-display text-slate-900 uppercase tracking-wider">{card.title}</h3>
              <p className="text-xs text-slate-500 leading-relaxed">{card.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 4. TEAM SECTION COMPOSITOR */}
      <section className="flex flex-col gap-12 pb-10">
        <div className="text-center flex flex-col gap-2">
          <span className="text-xs font-mono tracking-widest text-blue-400 uppercase font-bold text-center">Gadget Curators Command</span>
          <h2 className="text-2xl md:text-3xl font-bold font-display text-slate-900">Meet Our Curators</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {TEAM_MEMBERS.map((member) => (
            <div 
              key={member.id}
              className="bg-white/60 border border-slate-200 p-6 rounded-2xl flex flex-col items-center text-center gap-4 group hover:border-slate-750 duration-200"
            >
              <div className="h-28 w-28 rounded-full border border-slate-200 overflow-hidden relative">
                <img 
                  src={member.avatar} 
                  alt={member.name} 
                  className="h-full w-full object-cover transform group-hover:scale-105 duration-300"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div>
                <h4 className="font-display font-black text-sm text-slate-900">{member.name}</h4>
                <p className="font-mono text-[9px] uppercase tracking-widest text-[#06B6D4] font-bold mt-1">{member.role}</p>
              </div>

              <p className="text-xs text-slate-500 leading-relaxed max-w-xs">
                {member.bio}
              </p>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
