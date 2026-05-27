/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import React, { useState, useMemo } from 'react';
import { useApp, DEMO_ADDRESS } from '../context/AppContext';
import { MOCK_PRODUCTS } from '../data';
import { 
  User, 
  Trash2, 
  ShoppingCart, 
  Settings, 
  LogOut, 
  LayoutDashboard, 
  Package, 
  Heart, 
  MapPin, 
  Edit, 
  BookHeart,
  ChevronRight,
  ShieldAlert
} from 'lucide-react';

export default function MyAccount() {
  const { 
    userProfile, 
    logoutUser, 
    orders, 
    wishlist, 
    toggleWishlist, 
    addToCart, 
    navigateTo,
    triggerToast 
  } = useApp();

  const [activeMenu, setActiveMenu] = useState<'dashboard' | 'orders' | 'wishlist' | 'addresses' | 'profile'>('dashboard');

  // Address variables
  const [addresses, setAddresses] = useState([DEMO_ADDRESS]);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [addrFormLine, setAddrFormLine] = useState('');

  // Profile Form fields
  const [profileName, setProfileName] = useState(userProfile?.name || 'Jane Doe');
  const [profileEmail, setProfileEmail] = useState(userProfile?.email || 'r11137307@gmail.com');
  const [profilePhone, setProfilePhone] = useState(userProfile?.phone || '+1 800-GADGETS');
  const [newPass, setNewPass] = useState('');

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    triggerToast('✓ System Profile updated successfully!', 'success');
  };

  const handleCreateAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addrFormLine.trim()) return;
    const newAddr = {
      ...DEMO_ADDRESS,
      id: Math.random().toString(),
      addressLine1: addrFormLine,
      isDefault: false
    };
    setAddresses(prev => [...prev, newAddr]);
    setAddrFormLine('');
    setShowAddressForm(false);
    triggerToast('✓ Address entry appended to account registry', 'success');
  };

  const handleDeleteAddress = (id: string) => {
    setAddresses(prev => prev.filter(x => x.id !== id));
    triggerToast('Address entry purged', 'warning');
  };

  // Logged in check
  if (!userProfile) {
    return (
      <div className="pt-[150px] pb-24 text-center max-w-sm mx-auto flex flex-col items-center gap-6">
        <div className="p-4 bg-red-500/10 text-red-400 border border-red-500/15 rounded-full animate-bounce">
          <ShieldAlert size={36} />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-900 font-display uppercase tracking-widest mb-2">Unauthenticated Terminal</h2>
          <p className="text-xs text-slate-500 leading-relaxed">
            Please authorize your profile credentials to inspect order records, stats metrics, address coordinates and wishlists.
          </p>
        </div>
        <button
          onClick={() => navigateTo('login')}
          className="w-full py-3 bg-blue-600 text-white font-bold uppercase text-xs rounded-xl hover:text-white"
        >
          Authorize Credentials now
        </button>
      </div>
    );
  }

  // Statistics summaries
  const totalSpend = useMemo(() => {
    return orders.reduce((sum, ord) => sum + ord.total, 0);
  }, [orders]);

  const wishlistProducts = useMemo(() => {
    return MOCK_PRODUCTS.filter(p => wishlist.includes(p.id));
  }, [wishlist]);

  const sidebarItems = [
    { key: 'dashboard', label: 'Overview Panel', icon: <LayoutDashboard size={16} /> },
    { key: 'orders', label: 'Order Archives', icon: <Package size={16} /> },
    { key: 'wishlist', label: 'Wishlist Grid', icon: <Heart size={16} /> },
    { key: 'addresses', label: 'Addresses list', icon: <MapPin size={16} /> },
    { key: 'profile', label: 'Edit Profile', icon: <Settings size={16} /> },
  ];

  const handleLogoutFlow = () => {
    logoutUser();
    navigateTo('home');
  };

  return (
    <div id="account-view-container" className="pb-24 max-w-7xl mx-auto px-4 md:px-8 w-full flex flex-col md:flex-row gap-10">
      
      {/* LEFT ACCREDIT CONTROL COLUMN */}
      <aside className="w-full md:w-64 shrink-0 flex flex-col gap-4">
        
        {/* User Mini card layout */}
        <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl text-left flex items-center gap-4 relative">
          <div className="h-12 w-12 rounded-xl bg-blue-600/10 text-blue-400 border border-blue-500/20 flex items-center justify-center font-bold text-lg font-display">
            {profileName.substring(0, 2).toUpperCase()}
          </div>
          <div className="max-w-[140px] truncate">
            <h3 className="font-display font-extrabold text-sm text-slate-900 truncate">{profileName}</h3>
            <span className="text-[9px] font-mono font-bold text-emerald-400 uppercase tracking-widest">LOYAL MEMBER</span>
          </div>
        </div>

        {/* Navigation list */}
        <nav className="bg-slate-50 border border-slate-200 rounded-2xl p-3 flex flex-col gap-1.5 text-left">
          {sidebarItems.map((item) => {
            const isSel = activeMenu === item.key;
            return (
              <button
                key={item.key}
                onClick={() => setActiveMenu(item.key as any)}
                className={`w-full px-4 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider flex items-center justify-between cursor-pointer transition-colors ${
                  isSel ? 'bg-blue-600 text-white font-black' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  {item.icon}
                  <span>{item.label}</span>
                </div>
                {isSel && <ChevronRight size={12} />}
              </button>
            );
          })}

          <hr className="border-slate-200" />
          <button
            onClick={handleLogoutFlow}
            className="w-full px-4 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider text-red-400 hover:text-slate-700 hover:bg-slate-100/40 flex items-center gap-3 cursor-pointer text-left"
          >
            <LogOut size={16} />
            <span>Terminate Session</span>
          </button>
        </nav>
      </aside>

      {/* RIGHT FLEX SUB-VIEW CANVAS */}
      <main className="flex-1 bg-white/40 border border-slate-200 p-6 md:p-8 rounded-3xl min-h-[500px]">
        
        {/* ================= 1. DASHBOARD OVERVIEW ================= */}
        {activeMenu === 'dashboard' && (
          <div className="flex flex-col gap-8 text-left">
            <div className="border-b border-slate-200 pb-4">
              <h2 className="text-xl md:text-2xl font-bold font-display text-slate-900 uppercase tracking-wider">Welcome back, {profileName}!</h2>
              <p className="text-xs text-slate-500 mt-1">Ecosystem dashboard overview coordinates. Registered: <strong className="text-slate-900 font-mono">{profileEmail}</strong></p>
            </div>

            {/* THREE NUMERICAL STAT CARDS */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              
              {/* Total Orders */}
              <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl flex flex-col gap-2 relative overflow-hidden">
                <span className="text-[10px] font-mono text-slate-500 font-bold uppercase tracking-widest">Purchase Orders Count</span>
                <span className="text-3xl font-black text-[#06B6D4]">{orders.length}</span>
                <span className="text-[11px] text-slate-500 font-sans mt-1">Sum: <strong className="text-slate-900 font-mono">${totalSpend.toFixed(2)}</strong> total</span>
              </div>

              {/* Wishlist Items */}
              <div className="bg-slate-50 border border-slate-200 p-5 rounded-xl flex flex-col gap-2 relative overflow-hidden">
                <span className="text-[10px] font-mono text-slate-500 font-bold uppercase tracking-widest">Active Wishlist Items</span>
                <span className="text-3xl font-black text-rose-500">{wishlist.length}</span>
                <span className="text-[11px] text-slate-500 font-sans mt-1">Pinned drops waiting</span>
              </div>

              {/* Rewards Points */}
              <div className="bg-slate-50 border border-slate-200 p-5 rounded-xl flex flex-col gap-2 relative overflow-hidden">
                <span className="text-[10px] font-mono text-slate-505 font-bold uppercase tracking-widest">Bonus reward reserves</span>
                <span className="text-3xl font-black text-emerald-400">{userProfile.rewardPoints}</span>
                <span className="text-[11px] text-slate-500 font-sans mt-0.5">Approx. <strong className="text-slate-900 font-sans">${(userProfile.rewardPoints / 10).toFixed(2)}</strong> savings</span>
              </div>
            </div>

            {/* QUICK HISTOGRAM BRIEF */}
            <div className="bg-white/60 border border-slate-200 p-5 rounded-2xl flex flex-col gap-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 font-display">Active operational notice</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Your complimentary <strong className="text-slate-900 font-semibold">2-Year Mechanical Warranty</strong> is activated on checkouts. To claim support or report hardware faults, coordinate with staff coordinates inside our Contact HQ panel.
              </p>
            </div>
          </div>
        )}

        {/* ================= 2. ORDER RECORDS ================= */}
        {activeMenu === 'orders' && (
          <div className="flex flex-col gap-6 text-left">
            <h2 className="text-xl font-bold font-display text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-3">Purchase Order Archives</h2>

            {orders.length === 0 ? (
              <div className="p-10 text-center text-slate-500 text-xs">
                No purchases recorded so far inside this terminal cache.
              </div>
            ) : (
              <div className="overflow-x-auto border border-slate-200 rounded-xl bg-white/30">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="bg-slate-50 text-slate-500 border-b border-slate-200 uppercase tracking-wider font-mono">
                      <th className="p-3.5 text-left font-bold text-[10px]">Order No</th>
                      <th className="p-3.5 text-left font-bold text-[10px]">Date Logged</th>
                      <th className="p-3.5 text-left font-bold text-[10px]">Line Elements</th>
                      <th className="p-3.5 text-right font-bold text-[10px]">Grand Total Charged</th>
                      <th className="p-3.5 text-center font-bold text-[10px]">State Badge</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-855 text-slate-600">
                    {orders.map((ord) => (
                      <tr key={ord.id} className="hover:bg-slate-905/40">
                        <td className="p-3.5 font-bold font-mono text-blue-400">{ord.id}</td>
                        <td className="p-3.5">{ord.date}</td>
                        <td className="p-3.5 text-[10px] break-all leading-normal max-w-[140px] truncate">
                          {ord.items.map(i => `${i.name} (×${i.quantity})`).join(', ')}
                        </td>
                        <td className="p-3.5 text-right font-bold font-mono text-slate-800">${ord.total.toFixed(2)}</td>
                        <td className="p-3.5 text-center">
                          <span className={`px-2 py-0.5 border text-[9px] font-bold rounded ${
                            ord.status === 'Delivered' 
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                              : ord.status === 'Shipped' 
                                ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' 
                                : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                          }`}>
                            {ord.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ================= 3. WISHLIST GRAPH ================= */}
        {activeMenu === 'wishlist' && (
          <div className="flex flex-col gap-6 text-left">
            <h2 className="text-xl font-bold font-display text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-3">My Saved Wishlist</h2>

            {wishlistProducts.length === 0 ? (
              <div className="p-12 text-center text-slate-500 text-xs flex flex-col items-center gap-3">
                <BookHeart size={36} className="text-slate-700 font-light" />
                <span>Your wishlist sequence is currently barren. Pin product elements to track price.</span>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {wishlistProducts.map((p) => (
                  <div key={p.id} className="bg-slate-50 border border-slate-200 p-4 rounded-xl flex flex-col justify-between group h-64">
                    <div className="bg-white p-3 rounded-lg flex items-center justify-center h-28 relative">
                      <img src={p.image} alt={p.name} className="max-h-full object-contain" referrerPolicy="no-referrer" />
                      <button
                        onClick={() => toggleWishlist(p.id)}
                        className="absolute top-2 right-2 p-1 bg-slate-50 hover:bg-slate-100 rounded-full text-slate-500 hover:text-red-400"
                        title="Remove"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>

                    <div className="mt-2 text-left flex flex-col gap-1">
                      <h4 className="font-semibold text-xs text-slate-900 max-w-[150px] truncate">{p.name}</h4>
                      <p className="text-xs font-bold text-blue-400">${p.price}</p>
                      
                      <button
                        onClick={() => addToCart(p, 1)}
                        className="w-full mt-2 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-black text-[10px] uppercase tracking-wider rounded"
                      >
                        Quick Cart
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ================= 4. ADDRESS DIRECTORY ================= */}
        {activeMenu === 'addresses' && (
          <div className="flex flex-col gap-6 text-left">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h2 className="text-xl font-bold font-display text-slate-900 uppercase tracking-wider">Address Logs Registry</h2>
              <button
                onClick={() => setShowAddressForm(prev => !prev)}
                className="px-3 py-1.5 border border-slate-720 text-[10px] text-slate-900 font-bold rounded uppercase tracking-wider cursor-pointer"
              >
                {showAddressForm ? 'Cancel Form x' : 'Append New Address +'}
              </button>
            </div>

            {showAddressForm && (
              <form onSubmit={handleCreateAddress} className="p-4 border border-slate-750 bg-white/40 rounded-xl flex gap-3">
                <input
                  type="text"
                  placeholder="Street Coordinate e.g. 520 Tech Ave Suite A"
                  value={addrFormLine}
                  onChange={(e) => setAddrFormLine(e.target.value)}
                  className="flex-1 bg-slate-50 border border-slate-300 text-xs text-slate-900 rounded-lg px-3 py-2"
                  required
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#06B6D4] text-slate-950 font-bold text-xs uppercase tracking-wider rounded-lg cursor-pointer"
                >
                  Save Entry
                </button>
              </form>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {addresses.map((addr) => (
                <div key={addr.id} className="p-5 bg-slate-50 border border-slate-200 rounded-2xl relative flex flex-col gap-3">
                  
                  {addr.isDefault && (
                    <span className="self-start text-[8px] bg-green-500/15 text-green-400 border border-green-500/10 px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                      PRIMARY SHIPPING BASE
                    </span>
                  )}

                  <div className="text-xs leading-normal font-sans">
                    <p className="font-bold text-slate-900 text-sm mb-0.5">{addr.firstName} {addr.lastName}</p>
                    <p className="text-slate-450">{addr.addressLine1}</p>
                    {addr.addressLine2 && <p className="text-slate-450">{addr.addressLine2}</p>}
                    <p className="text-slate-450">{addr.city}, {addr.state} {addr.zip}</p>
                    <p className="text-[10px] text-slate-500 mt-1 font-mono">Direct Connection: {addr.phone}</p>
                  </div>

                  {!addr.isDefault && (
                    <button
                      onClick={() => handleDeleteAddress(addr.id)}
                      className="absolute bottom-4 right-4 p-2 text-slate-500 hover:text-red-400 rounded-lg hover:bg-red-500/5 transition-colors cursor-pointer"
                      title="Purge address"
                      aria-label="Delete this stored address entry option"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= 5. PROFILE CONTROL FORM ================= */}
        {activeMenu === 'profile' && (
          <div className="flex flex-col gap-6 text-left max-w-xl">
            <h2 className="text-xl font-bold font-display text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-3">Update Member Biography</h2>

            <form onSubmit={handleProfileSubmit} className="flex flex-col gap-4 text-xs">
              
              <div className="flex flex-col gap-1">
                <label className="font-mono text-[9px] uppercase tracking-wider text-slate-500 font-bold">Display Name Mapping</label>
                <input
                  type="text"
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  className="bg-white border border-slate-300 rounded-lg px-3.5 py-2.5 text-xs text-slate-900"
                  required
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-mono text-[9px] uppercase tracking-wider text-slate-500 font-bold font-bold">Billing Email credentials</label>
                <input
                  type="email"
                  value={profileEmail}
                  onChange={(e) => setProfileEmail(e.target.value)}
                  className="bg-white border border-slate-300 rounded-lg px-3.5 py-2.5 text-xs text-slate-900"
                  required
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-mono text-[9px] uppercase tracking-wider text-slate-500 font-bold">Phone Number Coordinates</label>
                <input
                  type="tel"
                  value={profilePhone}
                  onChange={(e) => setProfilePhone(e.target.value)}
                  className="bg-white border border-slate-300 rounded-lg px-3.5 py-2.5 text-xs text-slate-900"
                />
              </div>

              <div className="flex flex-col gap-1 mt-2">
                <label className="font-mono text-[9px] uppercase tracking-wider text-slate-505 font-bold">Configure password update</label>
                <input
                  type="password"
                  placeholder="Optionally, reconfigure active code sequence"
                  value={newPass}
                  onChange={(e) => setNewPass(e.target.value)}
                  className="bg-slate-955 border border-slate-704 rounded-lg px-3.5 py-2.5 text-xs text-slate-900"
                />
              </div>

              <button
                type="submit"
                className="mt-4 px-6 py-3 bg-[#3B82F6] hover:bg-blue-500 hover:text-slate-950 text-slate-950 text-xs font-black uppercase tracking-wider font-display rounded-lg transition-colors cursor-pointer"
              >
                Approve Bio Updates
              </button>
            </form>
          </div>
        )}

      </main>

    </div>
  );
}
