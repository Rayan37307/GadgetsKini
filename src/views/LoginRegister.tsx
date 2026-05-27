/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Mail, Lock, User, Sparkles, LogIn, UserPlus } from 'lucide-react';

export default function LoginRegister() {
  const { loginUser, navigateTo, triggerToast } = useApp();
  const [activeTab, setActiveTab] = useState<'signin' | 'register'>('signin');

  // Sign In inputs
  const [signInEmail, setSignInEmail] = useState('r11137307@gmail.com');
  const [signInPass, setSignInPass] = useState('*********');
  const [rememberMe, setRememberMe] = useState(true);

  // Register inputs
  const [regName, setRegName] = useState('Jane Doe');
  const [regEmail, setRegEmail] = useState('');
  const [regPass, setRegPass] = useState('');
  const [regConfirm, setRegConfirm] = useState('');

  const handleSignInSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!signInEmail) {
      triggerToast('Please provide email credentials', 'error');
      return;
    }

    // Extract first name from email as mock name
    const mockName = signInEmail.split('@')[0];
    const uppercaseName = mockName.charAt(0).toUpperCase() + mockName.slice(1);
    
    loginUser(uppercaseName || 'Jane', signInEmail);
    navigateTo('account');
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName || !regEmail || !regPass || !regConfirm) {
      triggerToast('Please populate all register matrices', 'error');
      return;
    }
    if (regPass !== regConfirm) {
      triggerToast('✗ Password confirmations do not match', 'error');
      return;
    }

    loginUser(regName, regEmail);
    navigateTo('account');
  };

  const handleSocialMockLogin = (platform: string) => {
    loginUser(`User via ${platform}`, 'social.member@gadgetskini.com');
    navigateTo('account');
  };

  return (
    <div id="auth-view-container" className="pt-[110px] pb-24 max-w-md mx-auto px-4 md:px-8 w-full flex flex-col gap-8 justify-center min-h-[70vh]">
      
      {/* BRAND CARD HEADER LOGU */}
      <div className="text-center flex flex-col gap-2">
        <a href="#home" onClick={() => navigateTo('home')} className="text-3xl font-display font-extrabold tracking-widest text-white">
          GADGETS<span className="text-amber-500 font-black">KINI</span>
        </a>
        <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider font-mono">Operations Authentication Gateway</p>
      </div>

      {/* CORE ACTIVE FRAME CONTAINER */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl relative">
        <div className="absolute inset-0 bg-radial-[at_50%_0%] from-blue-600/5 via-transparent to-transparent opacity-60 pointer-events-none" />

        {/* DOUBLE VIEW TAB ROW */}
        <div className="flex border-b border-slate-800/80 bg-slate-950/60 font-display">
          <button
            onClick={() => setActiveTab('signin')}
            className={`flex-1 py-4 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer flex items-center justify-center gap-2 ${
              activeTab === 'signin' ? 'text-[#06B6D4] bg-slate-900 border-b-2 border-b-[#06B6D4]' : 'text-slate-400 hover:text-white'
            }`}
          >
            <LogIn size={14} /> SIGN IN TO ACCOUNT
          </button>
          
          <button
            onClick={() => setActiveTab('register')}
            className={`flex-1 py-4 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer flex items-center justify-center gap-2 ${
              activeTab === 'register' ? 'text-[#06B6D4] bg-slate-900 border-b-2 border-b-[#06B6D4]' : 'text-slate-400 hover:text-white'
            }`}
          >
            <UserPlus size={14} /> CREATE ACCOUNT
          </button>
        </div>

        {/* ACTIVE FORMS SWITCH */}
        <div className="p-6 sm:p-8">
          
          {/* SIGN IN VIEW */}
          {activeTab === 'signin' && (
            <form onSubmit={handleSignInSubmit} className="flex flex-col gap-5">
              
              {/* Email */}
              <div className="flex flex-col gap-1.5 text-left">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">System Email address</label>
                <div className="relative">
                  <input
                    type="email"
                    value={signInEmail}
                    onChange={(e) => setSignInEmail(e.target.value)}
                    placeholder="janedoe@gmail.com"
                    className="w-full bg-slate-955 border border-slate-700 rounded-xl py-3 pl-10 pr-4 text-xs text-white focus:outline-none focus:border-blue-500"
                    required
                  />
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
                </div>
              </div>

              {/* Password */}
              <div className="flex flex-col gap-1.5 text-left">
                <div className="flex justify-between items-center text-[10px] font-mono">
                  <span className="font-bold text-slate-400 uppercase tracking-widest">Secret Keyword</span>
                  <a href="#login" onClick={(e) => { e.preventDefault(); triggerToast('Password retrieval logs forwarded to sandbox email', 'warning'); }} className="text-blue-400 hover:underline">Forgot password?</a>
                </div>
                <div className="relative">
                  <input
                    type="password"
                    value={signInPass}
                    onChange={(e) => setSignInPass(e.target.value)}
                    className="w-full bg-slate-955 border border-slate-700 rounded-xl py-3 pl-10 pr-4 text-xs text-white focus:outline-none focus:border-blue-500"
                    required
                  />
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
                </div>
              </div>

              {/* Remember checkbox */}
              <label className="flex items-center gap-2 text-xs text-slate-400 mt-1 cursor-pointer select-none text-left">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="accent-blue-500 rounded"
                />
                <span>Remember this terminal footprint signature on local cache</span>
              </label>

              {/* Action */}
              <button
                type="submit"
                className="w-full mt-2 py-4 bg-blue-600 hover:bg-blue-500 text-slate-950 font-black text-xs uppercase tracking-widest rounded-xl transition-colors cursor-pointer glow-blue"
              >
                Let me in 🎉
              </button>
            </form>
          )}

          {/* REGISTER VIEW */}
          {activeTab === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="flex flex-col gap-5">
              
              {/* Full name */}
              <div className="flex flex-col gap-1.5 text-left">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">Given Core Name</label>
                <div className="relative">
                  <input
                    type="text"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="e.g. Jane Doe"
                    className="w-full bg-slate-955 border border-slate-700 rounded-xl py-3 pl-10 pr-4 text-xs text-white focus:outline-none focus:border-blue-500"
                    required
                  />
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
                </div>
              </div>

              {/* Email */}
              <div className="flex flex-col gap-1.5 text-left">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">System Email</label>
                <div className="relative">
                  <input
                    type="email"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="e.g. hello.friend@corp.com"
                    className="w-full bg-slate-955 border border-slate-700 rounded-xl py-3 pl-10 pr-4 text-xs text-white focus:outline-none focus:border-blue-500"
                    required
                  />
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
                </div>
              </div>

              {/* Password */}
              <div className="flex flex-col gap-1.5 text-left">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">Configure Secret code</label>
                <div className="relative">
                  <input
                    type="password"
                    value={regPass}
                    onChange={(e) => setRegPass(e.target.value)}
                    placeholder="At least 8 parameters"
                    className="w-full bg-slate-955 border border-slate-700 rounded-xl py-3 pl-10 pr-4 text-xs text-white focus:outline-none focus:border-blue-500"
                    required
                  />
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
                </div>
              </div>

              {/* Confirm */}
              <div className="flex flex-col gap-1.5 text-left">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">Retype Code</label>
                <div className="relative">
                  <input
                    type="password"
                    value={regConfirm}
                    onChange={(e) => setRegConfirm(e.target.value)}
                    className="w-full bg-slate-955 border border-slate-700 rounded-xl py-3 pl-10 pr-4 text-xs text-white focus:outline-none focus:border-blue-500"
                    required
                  />
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-2 py-4 bg-[#06B6D4] hover:bg-cyan-500 text-slate-950 font-black text-xs uppercase tracking-widest rounded-xl transition-colors cursor-pointer"
              >
                Register & Verify Endpoint 🚀
              </button>
            </form>
          )}

          {/* SOCIALS DIVIDERS */}
          <div className="relative my-6 text-center">
            <hr className="border-slate-800" />
            <span className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 px-3 text-[10px] bg-slate-900 text-slate-500 font-mono tracking-wider">
              OR COMPILATION INTEGRATION
            </span>
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => handleSocialMockLogin('Google')}
              className="flex-1 py-3 border border-slate-700 rounded-xl hover:bg-slate-800 text-xs font-bold text-slate-200 transition-colors cursor-pointer"
            >
              Google Hub
            </button>
            <button
              onClick={() => handleSocialMockLogin('Apple')}
              className="flex-1 py-3 border border-slate-700 rounded-xl hover:bg-slate-800 text-xs font-bold text-slate-200 transition-colors cursor-pointer"
            >
              Apple Grid
            </button>
          </div>

        </div>
      </div>

    </div>
  );
}
