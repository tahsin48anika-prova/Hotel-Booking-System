/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { Calendar, User, Heart, Settings, Trash2, Printer, ShieldAlert, CheckCircle, Compass, MapPin } from "lucide-react";

export default function DashboardView() {
  const { 
    user, bookings, hotels, rooms, wishlist, toggleWishlist, 
    selectHotel, setRoute, deleteAccount, updateProfile 
  } = useApp();

  const [activeTab, setActiveTab] = useState<"bookings" | "wishlist" | "settings">("bookings");

  // Profile Form States
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [avatar, setAvatar] = useState(user?.avatar || "");
  const [profileUpdated, setProfileUpdated] = useState(false);

  // Selected Booking Invoice Modal state
  const [invoiceBookingId, setInvoiceBookingId] = useState<string | null>(null);

  if (!user) {
    return (
    <div className="bg-transparent text-slate-100 font-sans min-h-[60vh] flex flex-col items-center justify-center space-y-4 px-4 font-sans relative z-10">
        <User className="w-12 h-12 text-amber-500 animate-pulse" />
        <h3 className="text-xl font-serif font-bold text-white">Guest Access Locked</h3>
        <p className="text-xs text-slate-400">Please unlock guest access or login to review your transactions.</p>
        <button onClick={() => setRoute("home")} className="bg-amber-600 hover:bg-amber-500 text-white text-[10px] uppercase tracking-widest font-bold px-5 py-2.5 rounded-xl">
          Guest Portal Access
        </button>
      </div>
    );
  }

  // Filter bookings for current logged-in guest
  const guestBookings = bookings.filter(b => b.guestEmail.toLowerCase() === user.email.toLowerCase());

  // Filter wishlisted hotels
  const wishlistedHotels = hotels.filter(h => wishlist.includes(h.id));

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    const ok = await updateProfile({ name, email, phone, avatar });
    if (ok) {
      setProfileUpdated(true);
      setTimeout(() => setProfileUpdated(false), 4000);
    }
  };

  const handleDeleteProfile = () => {
    const doubleConfirm = window.confirm(
      "GDPR PRIVACY COMPLIANCE: Are you absolutely sure you wish to permanently delete your guest profile from our server databases? This action cannot be reversed."
    );
    if (doubleConfirm) {
      deleteAccount();
    }
  };

  const activeInvoice = bookings.find(b => b.id === invoiceBookingId);
  const invoiceHotel = activeInvoice ? hotels.find(h => h.id === activeInvoice.hotelId) : null;
  const invoiceRoom = activeInvoice ? rooms.find(r => r.id === activeInvoice.roomId) : null;

  return (
    <div className="bg-transparent text-slate-100 font-sans min-h-screen py-12 relative z-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Guest Banner */}
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xl">
          <div className="flex items-center space-x-4 text-center sm:text-left">
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-600 to-amber-400 font-mono text-xl text-white flex items-center justify-center font-black uppercase border-2 border-white/20 overflow-hidden">
              {user.avatar ? (
                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                user.name.charAt(0)
              )}
            </div>
            <div>
              <span className="text-[9px] uppercase tracking-widest text-amber-500 font-bold font-mono">privileged registry member</span>
              <h1 className="text-2xl font-serif font-bold text-white">{user.name}</h1>
              <p className="text-xs text-slate-400">{user.email} • Verified Guest</p>
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-3 gap-6 text-center sm:text-right border-t sm:border-t-0 sm:border-l border-white/10 pt-4 sm:pt-0 sm:pl-8">
            <div>
              <span className="block text-xl font-serif font-black text-amber-500">{guestBookings.length}</span>
              <span className="block text-[8px] text-slate-500 uppercase tracking-widest font-mono">Bookings</span>
            </div>
            <div>
              <span className="block text-xl font-serif font-black text-amber-500">{wishlist.length}</span>
              <span className="block text-[8px] text-slate-500 uppercase tracking-widest font-mono">Bookmarks</span>
            </div>
            <div>
              <span className="block text-xs text-emerald-400 font-bold font-mono uppercase mt-1">ACTIVE</span>
              <span className="block text-[8px] text-slate-500 uppercase tracking-widest font-mono">Profile</span>
            </div>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex border-b border-white/10 text-xs text-slate-400 font-mono">
          <button
            onClick={() => setActiveTab("bookings")}
            className={`pb-3 px-6 border-b-2 font-semibold flex items-center space-x-2 cursor-pointer transition-colors ${
              activeTab === "bookings" ? "border-amber-500 text-amber-400" : "border-transparent hover:text-white"
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>My Bookings History</span>
          </button>
          
          <button
            onClick={() => setActiveTab("wishlist")}
            className={`pb-3 px-6 border-b-2 font-semibold flex items-center space-x-2 cursor-pointer transition-colors ${
              activeTab === "wishlist" ? "border-amber-500 text-amber-400" : "border-transparent hover:text-white"
            }`}
          >
            <Heart className="w-4 h-4" />
            <span>Saved Sanctuaries</span>
          </button>

          <button
            onClick={() => setActiveTab("settings")}
            className={`pb-3 px-6 border-b-2 font-semibold flex items-center space-x-2 cursor-pointer transition-colors ${
              activeTab === "settings" ? "border-amber-500 text-amber-400" : "border-transparent hover:text-white"
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Profile Settings</span>
          </button>
        </div>

        {/* Tab Contents */}
        <div className="space-y-6">
          
          {/* TAB 1: MY BOOKINGS LIST */}
          {activeTab === "bookings" && (
            <div className="space-y-4">
              {guestBookings.length > 0 ? (
                guestBookings.map((b) => {
                  const hotelObj = hotels.find(h => h.id === b.hotelId);
                  const roomObj = rooms.find(r => r.id === b.roomId);
                  if (!hotelObj) return null;
                  
                  return (
                    <div 
                      key={b.id} 
                      className="backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-6 grid grid-cols-1 md:grid-cols-12 gap-4 items-center shadow-lg hover:border-white/20 transition-all duration-300"
                      id={`guest-booking-${b.id}`}
                    >
                      {/* Property Summary */}
                      <div className="md:col-span-4 space-y-2">
                        <span className="text-[9px] uppercase font-mono tracking-widest text-amber-500 font-extrabold bg-amber-500/10 px-2 py-0.5 rounded">
                          CONFIRMED RECEIPT
                        </span>
                        <h3 className="text-md font-serif font-bold text-white leading-tight">{hotelObj.name}</h3>
                        <p className="text-xs text-slate-400 font-mono">{b.checkIn} to {b.checkOut}</p>
                      </div>

                      {/* Suite Details */}
                      <div className="md:col-span-3 text-xs space-y-1">
                        <span className="block text-slate-500 uppercase tracking-widest text-[8px] font-bold">Suite Details</span>
                        <p className="text-slate-300 font-semibold">{roomObj?.name || "Premium Room"}</p>
                        <p className="text-slate-400 text-[10px]">{b.guests.adults} Adults • {b.guests.children} Kids</p>
                      </div>

                      {/* Pricing */}
                      <div className="md:col-span-2 text-xs space-y-1">
                        <span className="block text-slate-500 uppercase tracking-widest text-[8px] font-bold">Billing Total</span>
                        <p className="text-md font-serif font-extrabold text-amber-500">${b.totalAmount}</p>
                      </div>

                      {/* Actions */}
                      <div className="md:col-span-3 flex justify-end space-x-2">
                        <button
                          onClick={() => setInvoiceBookingId(b.id)}
                          className="bg-white/5 hover:bg-white/15 border border-white/10 text-slate-200 text-[10px] font-bold uppercase tracking-widest py-2.5 px-4 rounded-xl cursor-pointer flex items-center space-x-1 backdrop-blur-sm transition-all"
                        >
                          <Printer className="w-3.5 h-3.5 text-amber-500" />
                          <span>Receipt</span>
                        </button>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-12 bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl max-w-md mx-auto space-y-4 shadow-xl">
                  <Compass className="w-10 h-10 text-amber-500/20 mx-auto" />
                  <h4 className="text-white font-serif font-bold text-md">No Reservations Found</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    You have not yet registered any active reservations inside our registry.
                  </p>
                  <button onClick={() => setRoute("hotels")} className="bg-amber-600 hover:bg-amber-500 text-white text-[10px] uppercase tracking-widest font-bold px-4 py-2 rounded-lg">
                    Browse Hotels
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: SAVED WISHLIST GRID */}
          {activeTab === "wishlist" && (
            <div className="space-y-4">
              {wishlistedHotels.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {wishlistedHotels.map((hotel) => (
                    <div 
                      key={hotel.id} 
                      className="backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl overflow-hidden group hover:border-white/20 hover:bg-white/10 transition-all flex flex-col shadow-lg"
                    >
                      <div className="h-48 relative overflow-hidden">
                        <img src={hotel.image} alt={hotel.name} className="w-full h-full object-cover" />
                        <button
                          onClick={() => toggleWishlist(hotel.id)}
                          className="absolute top-4 right-4 p-2 rounded-full bg-amber-600 border border-amber-500 text-white shadow-md cursor-pointer"
                        >
                          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                          </svg>
                        </button>
                        <div className="absolute top-4 left-4 bg-white/10 backdrop-blur-md border border-white/20 text-amber-400 text-[9px] font-bold tracking-widest uppercase px-2.5 py-0.5 rounded">
                          ★ {hotel.rating.toFixed(1)}
                        </div>
                      </div>

                      <div className="p-5 flex-grow flex flex-col justify-between space-y-4">
                        <div className="space-y-1.5">
                          <p className="text-[10px] text-slate-500 font-mono flex items-center space-x-1">
                            <MapPin className="w-3 h-3 text-amber-500" />
                            <span>{hotel.city}, {hotel.country}</span>
                          </p>
                          <h4 className="text-xs font-serif font-bold text-white tracking-tight leading-tight uppercase group-hover:text-amber-400 transition-colors">
                            {hotel.name}
                          </h4>
                        </div>

                        <button
                          onClick={() => selectHotel(hotel.id)}
                          className="w-full bg-white/5 hover:bg-white/15 border border-white/10 text-slate-300 hover:text-white text-[10px] font-bold uppercase py-2.5 rounded-xl cursor-pointer backdrop-blur-sm transition-all"
                        >
                          Inspect Suite Catalog
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl max-w-md mx-auto space-y-2 shadow-xl">
                  <Heart className="w-10 h-10 text-amber-500/20 mx-auto" />
                  <h4 className="text-white font-serif font-bold text-md">No Saved Sanctuaries</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Bookmark your favorite hotels from the curated portfolio map to retrieve them here immediately.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: ACCOUNT & SECURITY COMPLIANCE */}
          {activeTab === "settings" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Profile Details form */}
              <form onSubmit={handleUpdateProfile} className="lg:col-span-7 backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 space-y-4 shadow-2xl">
                <h3 className="text-xs uppercase tracking-widest text-white font-bold pb-2 border-b border-white/10">Profile Settings</h3>
                
                <div className="space-y-1.5">
                  <label className="text-[9px] uppercase text-slate-400 font-bold">Your Public Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 focus:border-amber-500 rounded-xl py-2.5 px-4 text-xs text-white focus:outline-none backdrop-blur-sm transition-colors"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[9px] uppercase text-slate-400 font-bold">Your Profile Email</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 focus:border-amber-500 rounded-xl py-2.5 px-4 text-xs text-white focus:outline-none backdrop-blur-sm transition-colors"
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[9px] uppercase text-slate-400 font-bold">Your Contact Phone</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 focus:border-amber-500 rounded-xl py-2.5 px-4 text-xs text-white focus:outline-none backdrop-blur-sm transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[9px] uppercase text-slate-400 font-bold">Profile Photo Image URL</label>
                  <input
                    type="text"
                    value={avatar}
                    onChange={(e) => setAvatar(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full bg-white/5 border border-white/10 focus:border-amber-500 rounded-xl py-2.5 px-4 text-xs text-white focus:outline-none backdrop-blur-sm transition-colors"
                  />
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    className="bg-amber-600 hover:bg-amber-500 text-white text-[10px] uppercase tracking-widest font-bold py-2.5 px-5 rounded-lg transition-colors cursor-pointer"
                  >
                    Save Profiles
                  </button>
                </div>

                {profileUpdated && (
                  <p className="text-[10px] text-amber-400 font-mono text-right mt-2 animate-fade-in">
                    ✓ Profile credentials updated on our secure server.
                  </p>
                )}
              </form>

              {/* Security Privacy GDPR Box */}
              <div className="lg:col-span-5 backdrop-blur-xl bg-white/10 border border-rose-900/40 rounded-2xl p-6 space-y-4 shadow-2xl">
                <h3 className="text-xs uppercase tracking-widest text-rose-400 font-bold flex items-center space-x-1">
                  <ShieldAlert className="w-4 h-4" />
                  <span>Privacy Control</span>
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed font-sans">
                  Under global GDPR regulations, you maintain full authority to scrub all personal identifiers, check-in histories, billing addresses, and wishlists from our systems.
                </p>
                <div className="bg-white/5 border border-white/10 p-4 rounded-xl text-[10px] text-slate-400 font-mono backdrop-blur-sm">
                  • ALL BOOKINGS ERASED<br />
                  • EMAIL SCRUBBED COMPLETELY<br />
                  • GDPR SYSTEM COMPLIANT
                </div>
                <button
                  onClick={handleDeleteProfile}
                  className="w-full bg-rose-950/40 hover:bg-rose-900 text-rose-300 border border-rose-900/60 font-bold py-2.5 px-4 rounded-xl text-[10px] uppercase tracking-widest transition-all cursor-pointer flex items-center justify-center space-x-1.5"
                  id="gdpr-delete-btn"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Erase My Guest Profile</span>
                </button>
              </div>

            </div>
          )}

        </div>

      </div>

      {/* INVOICE MODAL POPUP IF SELECTED */}
      {invoiceBookingId && activeInvoice && invoiceHotel && invoiceRoom && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="backdrop-blur-xl bg-slate-900/90 border border-white/10 rounded-2xl max-w-xl w-full p-6 space-y-6 shadow-2xl relative">
            
            {/* Header */}
            <div className="flex justify-between items-center border-b border-white/10 pb-3">
              <div>
                <span className="text-[9px] uppercase tracking-widest text-amber-500 font-bold font-mono">invoice registry receipt</span>
                <p className="text-[10px] text-slate-500">ID: {activeInvoice.id}</p>
              </div>
              <button 
                onClick={() => setInvoiceBookingId(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 font-bold text-xs"
              >
                ✕ Close
              </button>
            </div>

            {/* Printable Frame */}
            <div className="space-y-4 text-xs" id="receipt-print-modal">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="block text-slate-500 text-[8px] uppercase font-bold">Property Location</span>
                  <p className="text-white font-serif font-bold">{invoiceHotel.name}</p>
                  <p className="text-slate-400 text-[10px]">{invoiceHotel.city}, {invoiceHotel.country}</p>
                </div>
                <div>
                  <span className="block text-slate-500 text-[8px] uppercase font-bold">Suite Selection</span>
                  <p className="text-white font-bold">{invoiceRoom.name}</p>
                </div>
                <div>
                  <span className="block text-slate-500 text-[8px] uppercase font-bold">Span Dates</span>
                  <p className="text-white font-mono">{activeInvoice.checkIn} to {activeInvoice.checkOut}</p>
                </div>
                <div>
                  <span className="block text-slate-500 text-[8px] uppercase font-bold">Guests</span>
                  <p className="text-white">{activeInvoice.guests.adults} Adults • {activeInvoice.guests.children} Children</p>
                </div>
              </div>

              {/* Surcharges */}
              <div className="border-t border-white/10 pt-4 space-y-2 font-mono">
                <div className="flex justify-between">
                  <span className="text-slate-500">Base Nights Total</span>
                  <span className="text-slate-300">${invoiceRoom.price * 3}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Luxury Taxes (10%)</span>
                  <span className="text-slate-300">${(invoiceRoom.price * 3 * 0.1).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Subterranean Wellness Fee</span>
                  <span className="text-slate-300">$50.00</span>
                </div>
                <div className="flex justify-between border-t border-white/10 pt-3 text-sm">
                  <span className="font-bold text-white uppercase font-serif">Grand Surcharges Total</span>
                  <span className="font-serif font-black text-amber-500">${activeInvoice.totalAmount}</span>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex justify-end space-x-2 pt-4 border-t border-white/10">
              <button
                onClick={() => window.print()}
                className="bg-white/5 hover:bg-white/15 border border-white/10 text-slate-200 text-[10px] font-bold uppercase tracking-widest py-2 px-4 rounded-xl flex items-center space-x-1.5 cursor-pointer backdrop-blur-sm transition-all"
              >
                <Printer className="w-3.5 h-3.5 text-amber-500" />
                <span>Print Invoice</span>
              </button>
              <button
                onClick={() => setInvoiceBookingId(null)}
                className="bg-amber-600 hover:bg-amber-500 text-white text-[10px] font-bold uppercase tracking-widest py-2 px-4 rounded-xl cursor-pointer"
              >
                Close Receipt
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
