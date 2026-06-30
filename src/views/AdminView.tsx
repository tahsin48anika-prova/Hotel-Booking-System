/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from "react";
import { useApp } from "../context/AppContext";
import { Shield, Settings, Home, Plus, Trash2, Mail, MessageSquare, DollarSign, Users, Sparkles, Star, AlertCircle, Edit3, ClipboardList } from "lucide-react";

export default function AdminView() {
  const { 
    user, hotels, rooms, reviews, bookings, settings, updateCMS, 
    addHotel, removeHotel, addRoom, updateReviewReply, setRoute 
  } = useApp();

  const [activeTab, setActiveTab] = useState<"metrics" | "cms" | "hotels" | "rooms" | "reviews">("metrics");

  // CMS Edit States
  const [cmsForm, setCmsForm] = useState({ ...settings });
  const [cmsUpdated, setCmsUpdated] = useState(false);

  // Hotel Creation Form States
  const [hotelForm, setHotelForm] = useState({
    name: "",
    city: "",
    country: "",
    address: "",
    description: "",
    image: "",
    price: 350,
    rating: 4.8,
    category: "Resort",
    propertyType: "Resort"
  });
  const [hotelSuccess, setHotelSuccess] = useState(false);

  // Room Creation Form States
  const [roomForm, setRoomForm] = useState({
    hotelId: "",
    name: "",
    price: 450,
    bedType: "King Bed",
    size: "45 m²",
    description: "",
    amenitiesStr: "Free WiFi, Mini Bar, Ocean View"
  });
  const [roomSuccess, setRoomSuccess] = useState(false);

  // Review Reply State
  const [activeReplyReviewId, setActiveReplyReviewId] = useState<string | null>(null);
  const [managerReplyText, setManagerReplyText] = useState("");

  if (!user || user.role !== "admin") {
    return (
      <div className="bg-slate-950 text-slate-100 min-h-[60vh] flex flex-col items-center justify-center space-y-4 px-4 font-sans">
        <Shield className="w-12 h-12 text-rose-500 animate-pulse" />
        <h3 className="text-xl font-serif font-bold text-white">Access Denied</h3>
        <p className="text-xs text-slate-400">Admin Control Panel access requires elevated executive privileges.</p>
        <button onClick={() => setRoute("home")} className="bg-amber-600 hover:bg-amber-500 text-white text-[10px] uppercase tracking-widest font-bold px-5 py-2.5 rounded-xl">
          Return to map
        </button>
      </div>
    );
  }

  // Calculated Stats
  const revenueSum = useMemo(() => {
    return bookings.reduce((sum, b) => sum + b.totalAmount, 0);
  }, [bookings]);

  const handleSaveCms = async (e: React.FormEvent) => {
    e.preventDefault();
    const ok = await updateCMS(cmsForm);
    if (ok) {
      setCmsUpdated(true);
      setTimeout(() => setCmsUpdated(false), 4000);
    }
  };

  const handleCreateHotel = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hotelForm.name || !hotelForm.city) return;
    
    const payload = {
      ...hotelForm,
      images: [
        "https://picsum.photos/seed/h_sub1/1200/800",
        "https://picsum.photos/seed/h_sub2/1200/800",
        "https://picsum.photos/seed/h_sub3/1200/800"
      ],
      amenities: ["Free WiFi", "Infinity Pool", "Michelin Restaurant", "Luxury Spa", "Butler Service"],
      featured: true,
      reviewsCount: 0
    };

    const ok = await addHotel(payload);
    if (ok) {
      setHotelSuccess(true);
      setHotelForm({
        name: "",
        city: "",
        country: "",
        address: "",
        description: "",
        image: "",
        price: 350,
        rating: 4.8,
        category: "Resort",
        propertyType: "Resort"
      });
      setTimeout(() => setHotelSuccess(false), 4000);
    }
  };

  const handleCreateRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomForm.hotelId || !roomForm.name) return;

    const payload = {
      hotelId: roomForm.hotelId,
      name: roomForm.name,
      price: roomForm.price,
      bedType: roomForm.bedType,
      size: roomForm.size,
      description: roomForm.description,
      amenities: roomForm.amenitiesStr.split(",").map(s => s.trim()),
      images: ["https://picsum.photos/seed/r_sub1/800/600"]
    };

    const ok = await addRoom(payload);
    if (ok) {
      setRoomSuccess(true);
      setRoomForm({
        hotelId: "",
        name: "",
        price: 450,
        bedType: "King Bed",
        size: "45 m²",
        description: "",
        amenitiesStr: "Free WiFi, Mini Bar, Ocean View"
      });
      setTimeout(() => setRoomSuccess(false), 4000);
    }
  };

  const handleReplySubmit = async (reviewId: string) => {
    if (!managerReplyText.trim()) return;
    const ok = await updateReviewReply(reviewId, managerReplyText);
    if (ok) {
      setActiveReplyReviewId(null);
      setManagerReplyText("");
    }
  };

  return (
    <div className="bg-slate-950 text-slate-100 font-sans min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Admin Header Title */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-900 pb-6">
          <div className="space-y-1">
            <span className="text-[9px] uppercase tracking-widest text-cyan-400 font-bold font-mono flex items-center space-x-1">
              <Shield className="w-3.5 h-3.5" />
              <span>Executive Command Deck</span>
            </span>
            <h1 className="text-3xl font-serif font-bold text-white tracking-tight">System Control Panel</h1>
          </div>
          
          {/* Quick CMS Note */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl px-4 py-2 text-[10px] text-slate-400 font-mono">
            • LIVE CMS SYNCHRONIZATION RUNNING
          </div>
        </div>

        {/* Admin Tabs */}
        <div className="flex flex-wrap border-b border-slate-900 text-xs text-slate-400 font-mono">
          <button
            onClick={() => setActiveTab("metrics")}
            className={`pb-3 px-5 border-b-2 font-semibold flex items-center space-x-1.5 cursor-pointer ${
              activeTab === "metrics" ? "border-cyan-500 text-cyan-400" : "border-transparent hover:text-white"
            }`}
          >
            <span>Metrics</span>
          </button>
          
          <button
            onClick={() => setActiveTab("cms")}
            className={`pb-3 px-5 border-b-2 font-semibold flex items-center space-x-1.5 cursor-pointer ${
              activeTab === "cms" ? "border-cyan-500 text-cyan-400" : "border-transparent hover:text-white"
            }`}
          >
            <span>CMS Customizer</span>
          </button>

          <button
            onClick={() => setActiveTab("hotels")}
            className={`pb-3 px-5 border-b-2 font-semibold flex items-center space-x-1.5 cursor-pointer ${
              activeTab === "hotels" ? "border-cyan-500 text-cyan-400" : "border-transparent hover:text-white"
            }`}
          >
            <span>Hotels CRUD</span>
          </button>

          <button
            onClick={() => setActiveTab("rooms")}
            className={`pb-3 px-5 border-b-2 font-semibold flex items-center space-x-1.5 cursor-pointer ${
              activeTab === "rooms" ? "border-cyan-500 text-cyan-400" : "border-transparent hover:text-white"
            }`}
          >
            <span>Rooms Inventory</span>
          </button>

          <button
            onClick={() => setActiveTab("reviews")}
            className={`pb-3 px-5 border-b-2 font-semibold flex items-center space-x-1.5 cursor-pointer ${
              activeTab === "reviews" ? "border-cyan-500 text-cyan-400" : "border-transparent hover:text-white"
            }`}
          >
            <span>Testimonial Desk</span>
          </button>
        </div>

        {/* Tab Contents */}
        <div className="space-y-6">
          
          {/* TAB 1: METRICS GRID */}
          {activeTab === "metrics" && (
            <div className="space-y-8 animate-fade-in">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                
                {/* Total Bookings */}
                <div className="bg-slate-900 border border-slate-850 p-6 rounded-2xl space-y-2 shadow">
                  <div className="flex justify-between items-center text-slate-500 text-[10px] uppercase font-bold">
                    <span>Vetted Bookings</span>
                    <ClipboardList className="w-4 h-4 text-cyan-400" />
                  </div>
                  <p className="text-3xl font-serif font-black text-white">{bookings.length}</p>
                  <p className="text-[9px] text-emerald-400 font-mono">100% CONFIRMED SEATS</p>
                </div>

                {/* Simulated revenue */}
                <div className="bg-slate-900 border border-slate-850 p-6 rounded-2xl space-y-2 shadow">
                  <div className="flex justify-between items-center text-slate-500 text-[10px] uppercase font-bold">
                    <span>Platform Revenue</span>
                    <DollarSign className="w-4 h-4 text-emerald-400" />
                  </div>
                  <p className="text-3xl font-serif font-black text-amber-500">${revenueSum.toFixed(2)}</p>
                  <p className="text-[9px] text-slate-500 font-mono">ACCRUED INVOICE VALUE</p>
                </div>

                {/* Total Hotels count */}
                <div className="bg-slate-900 border border-slate-850 p-6 rounded-2xl space-y-2 shadow">
                  <div className="flex justify-between items-center text-slate-500 text-[10px] uppercase font-bold">
                    <span>Curated Resorts</span>
                    <Home className="w-4 h-4 text-cyan-400" />
                  </div>
                  <p className="text-3xl font-serif font-black text-white">{hotels.length}</p>
                  <p className="text-[9px] text-slate-500 font-mono">ACTIVE PROPERTIES</p>
                </div>

                {/* Total rooms */}
                <div className="bg-slate-900 border border-slate-850 p-6 rounded-2xl space-y-2 shadow">
                  <div className="flex justify-between items-center text-slate-500 text-[10px] uppercase font-bold">
                    <span>Available Suites</span>
                    <Sparkles className="w-4 h-4 text-amber-400" />
                  </div>
                  <p className="text-3xl font-serif font-black text-white">{rooms.length}</p>
                  <p className="text-[9px] text-slate-500 font-mono">ROOM TIERS CATALOGUED</p>
                </div>

              </div>

              {/* Transactions Log table */}
              <div className="bg-slate-900 border border-slate-850 rounded-2xl p-6 space-y-4 shadow">
                <h3 className="text-xs uppercase tracking-widest text-white font-bold pb-2 border-b border-slate-850/60">Live Transaction Logs</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-sans">
                    <thead>
                      <tr className="text-slate-500 uppercase tracking-wider text-[9px] border-b border-slate-850">
                        <th className="py-2.5 font-bold">Res. ID</th>
                        <th className="py-2.5 font-bold">Guest</th>
                        <th className="py-2.5 font-bold">Hotel Location</th>
                        <th className="py-2.5 font-bold">Stay Dates</th>
                        <th className="py-2.5 font-bold">Total Bill</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-850/40 text-slate-300">
                      {bookings.map((b) => {
                        const h = hotels.find(x => x.id === b.hotelId);
                        return (
                          <tr key={b.id}>
                            <td className="py-3 font-mono font-bold text-white uppercase">{b.id}</td>
                            <td className="py-3">{b.guestName}</td>
                            <td className="py-3 font-serif font-medium">{h?.name || b.hotelId}</td>
                            <td className="py-3 font-mono text-[10px]">{b.checkIn} to {b.checkOut}</td>
                            <td className="py-3 font-mono font-bold text-amber-500">${b.totalAmount}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: GLOBAL CMS CUSTOMIZER FORM */}
          {activeTab === "cms" && (
            <form onSubmit={handleSaveCms} className="bg-slate-900 border border-slate-850 rounded-2xl p-6 sm:p-8 space-y-6 shadow animate-fade-in">
              <div className="border-b border-slate-850 pb-3 space-y-1">
                <h3 className="text-xs uppercase tracking-widest text-cyan-400 font-bold">Custom CMS Settings</h3>
                <p className="text-[10px] text-slate-400">Directly edit logo texts, headers, subtitles, addresses, and contacts across all pages immediately.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                
                {/* Brand Text & Logo Text */}
                <div className="space-y-1.5">
                  <label className="text-[9px] uppercase text-slate-400 font-bold">Brand Corporate Name</label>
                  <input
                    type="text"
                    value={cmsForm.brandName}
                    onChange={(e) => setCmsForm(prev => ({ ...prev, brandName: e.target.value }))}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl py-2.5 px-4 text-xs text-white focus:outline-none"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[9px] uppercase text-slate-400 font-bold">Logo Heading Text</label>
                  <input
                    type="text"
                    value={cmsForm.logoText}
                    onChange={(e) => setCmsForm(prev => ({ ...prev, logoText: e.target.value }))}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl py-2.5 px-4 text-xs text-white focus:outline-none"
                    required
                  />
                </div>

                {/* Tagline */}
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-[9px] uppercase text-slate-400 font-bold">Luxury Tagline Pill</label>
                  <input
                    type="text"
                    value={cmsForm.tagline}
                    onChange={(e) => setCmsForm(prev => ({ ...prev, tagline: e.target.value }))}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl py-2.5 px-4 text-xs text-white focus:outline-none"
                  />
                </div>

                {/* Hero Title & Subtitle */}
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-[9px] uppercase text-slate-400 font-bold">Hero Display Title</label>
                  <textarea
                    rows={2}
                    value={cmsForm.heroTitle}
                    onChange={(e) => setCmsForm(prev => ({ ...prev, heroTitle: e.target.value }))}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl py-2.5 px-4 text-xs text-white focus:outline-none"
                    required
                  />
                </div>
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-[9px] uppercase text-slate-400 font-bold">Hero Subtitle Paragraph</label>
                  <textarea
                    rows={2}
                    value={cmsForm.heroSubtitle}
                    onChange={(e) => setCmsForm(prev => ({ ...prev, heroSubtitle: e.target.value }))}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl py-2.5 px-4 text-xs text-white focus:outline-none"
                    required
                  />
                </div>

                {/* Footers */}
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-[9px] uppercase text-slate-400 font-bold">Footer Description Block</label>
                  <textarea
                    rows={2}
                    value={cmsForm.footerText}
                    onChange={(e) => setCmsForm(prev => ({ ...prev, footerText: e.target.value }))}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl py-2.5 px-4 text-xs text-white focus:outline-none"
                    required
                  />
                </div>

                {/* Phone & Email contacts */}
                <div className="space-y-1.5">
                  <label className="text-[9px] uppercase text-slate-400 font-bold">Concierge Phone Contact</label>
                  <input
                    type="text"
                    value={cmsForm.contactPhone}
                    onChange={(e) => setCmsForm(prev => ({ ...prev, contactPhone: e.target.value }))}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl py-2.5 px-4 text-xs text-white focus:outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[9px] uppercase text-slate-400 font-bold">Concierge Email Contact</label>
                  <input
                    type="email"
                    value={cmsForm.contactEmail}
                    onChange={(e) => setCmsForm(prev => ({ ...prev, contactEmail: e.target.value }))}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl py-2.5 px-4 text-xs text-white focus:outline-none"
                  />
                </div>

                {/* Address */}
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-[9px] uppercase text-slate-400 font-bold">Headquarters Address</label>
                  <input
                    type="text"
                    value={cmsForm.contactAddress}
                    onChange={(e) => setCmsForm(prev => ({ ...prev, contactAddress: e.target.value }))}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl py-2.5 px-4 text-xs text-white focus:outline-none"
                  />
                </div>

              </div>

              <div className="pt-4 border-t border-slate-850 flex justify-end">
                <button
                  type="submit"
                  className="bg-cyan-600 hover:bg-cyan-500 text-slate-950 text-xs font-bold uppercase tracking-widest py-3 px-6 rounded-xl cursor-pointer"
                  id="save-cms-btn"
                >
                  Save CMS Configurations
                </button>
              </div>

              {cmsUpdated && (
                <p className="text-[10px] text-cyan-400 font-mono text-right mt-2 animate-fade-in">
                  ✓ CMS configurations saved globally and synchronized with JSON server database!
                </p>
              )}
            </form>
          )}

          {/* TAB 3: HOTELS CRUD MANAGER */}
          {activeTab === "hotels" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-fade-in">
              
              {/* Hotel Creation Form */}
              <form onSubmit={handleCreateHotel} className="lg:col-span-5 bg-slate-900 border border-slate-850 rounded-2xl p-6 space-y-4 shadow">
                <h3 className="text-xs uppercase tracking-widest text-cyan-400 font-bold border-b border-slate-850/60 pb-2">Add New Luxury Resort</h3>
                
                <div className="space-y-1.5">
                  <label className="text-[9px] uppercase text-slate-400 font-bold">Property Name</label>
                  <input
                    type="text"
                    value={hotelForm.name}
                    onChange={(e) => setHotelForm(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Grand Mirage Reserve"
                    className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl py-2 px-3.5 text-xs text-white focus:outline-none"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[9px] uppercase text-slate-400 font-bold">City / Territory</label>
                    <input
                      type="text"
                      value={hotelForm.city}
                      onChange={(e) => setHotelForm(prev => ({ ...prev, city: e.target.value }))}
                      placeholder="Ubud"
                      className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl py-2 px-3.5 text-xs text-white focus:outline-none"
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[9px] uppercase text-slate-400 font-bold">Country</label>
                    <input
                      type="text"
                      value={hotelForm.country}
                      onChange={(e) => setHotelForm(prev => ({ ...prev, country: e.target.value }))}
                      placeholder="Bali"
                      className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl py-2 px-3.5 text-xs text-white focus:outline-none"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[9px] uppercase text-slate-400 font-bold">Detailed Physical Address</label>
                  <input
                    type="text"
                    value={hotelForm.address}
                    onChange={(e) => setHotelForm(prev => ({ ...prev, address: e.target.value }))}
                    placeholder="Jalan Raya Ubud, 80571"
                    className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl py-2 px-3.5 text-xs text-white focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[9px] uppercase text-slate-400 font-bold">Base Nightly Rate ($)</label>
                    <input
                      type="number"
                      value={hotelForm.price}
                      onChange={(e) => setHotelForm(prev => ({ ...prev, price: Number(e.target.value) }))}
                      className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl py-2 px-3.5 text-xs text-white focus:outline-none"
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[9px] uppercase text-slate-400 font-bold">Thumbnail Cover URL</label>
                    <input
                      type="text"
                      value={hotelForm.image}
                      onChange={(e) => setHotelForm(prev => ({ ...prev, image: e.target.value }))}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl py-2 px-3.5 text-xs text-white focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[9px] uppercase text-slate-400 font-bold">Sanctuary Description Narrative</label>
                  <textarea
                    rows={3}
                    value={hotelForm.description}
                    onChange={(e) => setHotelForm(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Provide bespoke stories and details regarding pool parameters or cave features..."
                    className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl py-2 px-3 text-xs text-white placeholder-slate-600 focus:outline-none"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold py-2.5 px-4 rounded-xl text-[10px] uppercase tracking-widest transition-all cursor-pointer flex items-center justify-center space-x-1"
                >
                  <Plus className="w-4 h-4" />
                  <span>Catalogue Property</span>
                </button>

                {hotelSuccess && (
                  <p className="text-[10px] text-cyan-400 font-mono text-center mt-2 animate-fade-in">
                    ✓ New property catalogued and instantly pushed live to search listings!
                  </p>
                )}
              </form>

              {/* Hotels Catalog List with Delete triggers */}
              <div className="lg:col-span-7 bg-slate-900 border border-slate-850 rounded-2xl p-6 space-y-4 shadow">
                <h3 className="text-xs uppercase tracking-widest text-white font-bold border-b border-slate-850/60 pb-2">Active Hotels Portfolio ({hotels.length})</h3>
                <div className="divide-y divide-slate-850/60 max-h-[500px] overflow-y-auto space-y-4">
                  {hotels.map((hotel) => (
                    <div key={hotel.id} className="flex justify-between items-center py-3">
                      <div className="flex items-center space-x-3.5">
                        <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-slate-800">
                          <img src={hotel.image} alt={hotel.name} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-white uppercase tracking-wider">{hotel.name}</h4>
                          <p className="text-[10px] text-slate-500">{hotel.city}, {hotel.country} • ${hotel.price} nightly</p>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          const conf = window.confirm(`Permanently decommission ${hotel.name} from the active database?`);
                          if (conf) removeHotel(hotel.id);
                        }}
                        className="text-rose-400 hover:text-rose-300 p-2 rounded-lg bg-slate-950 border border-slate-850 hover:border-rose-900/40 transition-all cursor-pointer"
                        title="Remove Hotel"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* TAB 4: ROOMS INVENTORY MANAGER */}
          {activeTab === "rooms" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-fade-in">
              
              {/* Room Creation Form */}
              <form onSubmit={handleCreateRoom} className="lg:col-span-5 bg-slate-900 border border-slate-850 rounded-2xl p-6 space-y-4 shadow">
                <h3 className="text-xs uppercase tracking-widest text-cyan-400 font-bold border-b border-slate-850/60 pb-2">Add New Suite Tier</h3>
                
                <div className="space-y-1.5">
                  <label className="text-[9px] uppercase text-slate-400 font-bold">Link to Parent Property</label>
                  <select
                    value={roomForm.hotelId}
                    onChange={(e) => setRoomForm(prev => ({ ...prev, hotelId: e.target.value }))}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl py-2.5 px-3 text-xs text-white focus:outline-none"
                    required
                  >
                    <option value="">Choose Parent Hotel</option>
                    {hotels.map(h => <option key={h.id} value={h.id}>{h.name}</option>)}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[9px] uppercase text-slate-400 font-bold">Suite Tier Name</label>
                  <input
                    type="text"
                    value={roomForm.name}
                    onChange={(e) => setRoomForm(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Presidential Overwater Penthouse"
                    className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl py-2 px-3.5 text-xs text-white focus:outline-none"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[9px] uppercase text-slate-400 font-bold">Nightly Rate ($)</label>
                    <input
                      type="number"
                      value={roomForm.price}
                      onChange={(e) => setRoomForm(prev => ({ ...prev, price: Number(e.target.value) }))}
                      className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl py-2 px-3.5 text-xs text-white focus:outline-none"
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[9px] uppercase text-slate-400 font-bold">Bed Configurations</label>
                    <input
                      type="text"
                      value={roomForm.bedType}
                      onChange={(e) => setRoomForm(prev => ({ ...prev, bedType: e.target.value }))}
                      placeholder="Double King Bed"
                      className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl py-2 px-3.5 text-xs text-white focus:outline-none"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[9px] uppercase text-slate-400 font-bold">Room Size (m²)</label>
                    <input
                      type="text"
                      value={roomForm.size}
                      onChange={(e) => setRoomForm(prev => ({ ...prev, size: e.target.value }))}
                      placeholder="95 m²"
                      className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl py-2 px-3.5 text-xs text-white focus:outline-none"
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[9px] uppercase text-slate-400 font-bold">Amenities Checklist (Comma Sep)</label>
                    <input
                      type="text"
                      value={roomForm.amenitiesStr}
                      onChange={(e) => setRoomForm(prev => ({ ...prev, amenitiesStr: e.target.value }))}
                      placeholder="WiFi, Pool, Butler, Ocean View"
                      className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl py-2 px-3.5 text-xs text-white focus:outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold py-2.5 px-4 rounded-xl text-[10px] uppercase tracking-widest transition-all cursor-pointer flex items-center justify-center space-x-1"
                >
                  <Plus className="w-4 h-4" />
                  <span>Catalogue Suite Tier</span>
                </button>

                {roomSuccess && (
                  <p className="text-[10px] text-cyan-400 font-mono text-center mt-2 animate-fade-in">
                    ✓ New suite tier catalogued under selected hotel!
                  </p>
                )}
              </form>

              {/* Rooms Inventory List */}
              <div className="lg:col-span-7 bg-slate-900 border border-slate-850 rounded-2xl p-6 space-y-4 shadow">
                <h3 className="text-xs uppercase tracking-widest text-white font-bold border-b border-slate-850/60 pb-2">Active Suite Catalog ({rooms.length})</h3>
                <div className="divide-y divide-slate-850/60 max-h-[500px] overflow-y-auto space-y-4">
                  {rooms.map((room) => {
                    const parentH = hotels.find(x => x.id === room.hotelId);
                    return (
                      <div key={room.id} className="py-3 flex justify-between items-start">
                        <div>
                          <span className="block text-[8px] text-cyan-400 font-mono uppercase tracking-widest font-bold">
                            {parentH?.name || "Parent Hotel"}
                          </span>
                          <h4 className="text-xs font-bold text-white uppercase tracking-wider">{room.name}</h4>
                          <p className="text-[10px] text-slate-500">{room.bedType} • {room.size} • ${room.price} nightly</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          )}

          {/* TAB 5: TESTIMONIALS DESK - WRITE REPLIES */}
          {activeTab === "reviews" && (
            <div className="bg-slate-900 border border-slate-850 rounded-2xl p-6 space-y-6 shadow animate-fade-in">
              <div className="border-b border-slate-850 pb-3 space-y-1">
                <h3 className="text-xs uppercase tracking-widest text-cyan-400 font-bold">Manager Testimonial Desk</h3>
                <p className="text-[10px] text-slate-400">Review real-time testimonials logged by verified guests. You may reply directly as the Resort General Manager.</p>
              </div>

              <div className="space-y-6">
                {reviews.map((rev) => {
                  const hotelObj = hotels.find(x => x.id === rev.hotelId);
                  return (
                    <div key={rev.id} className="bg-slate-950 border border-slate-850 rounded-2xl p-5 space-y-4">
                      
                      {/* Meta */}
                      <div className="flex justify-between items-start">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-full bg-slate-850 font-mono text-[10px] text-white flex items-center justify-center">
                            {rev.userName.charAt(0)}
                          </div>
                          <div>
                            <h4 className="text-xs font-bold text-white">{rev.userName}</h4>
                            <p className="text-[10px] text-slate-500 font-mono">
                              Logged on <span className="text-amber-500">{hotelObj?.name || rev.hotelId}</span> • {rev.date}
                            </p>
                          </div>
                        </div>
                        <div className="flex text-amber-500 space-x-0.5">
                          {Array.from({ length: rev.rating }).map((_, i) => (
                            <Star key={i} className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                          ))}
                        </div>
                      </div>

                      {/* Text */}
                      <p className="text-xs text-slate-300 leading-relaxed italic">"{rev.comment}"</p>

                      {/* Manager Response display if present */}
                      {rev.reply ? (
                        <div className="bg-slate-900 border-l-2 border-cyan-400 p-3 rounded-r-xl space-y-1">
                          <span className="block text-[8px] text-cyan-400 uppercase tracking-widest font-bold">Resort General Manager reply</span>
                          <p className="text-xs text-slate-400 leading-relaxed italic">"{rev.reply}"</p>
                        </div>
                      ) : (
                        /* Toggle Reply form */
                        <div>
                          {activeReplyReviewId === rev.id ? (
                            <div className="space-y-3 pt-2">
                              <textarea
                                rows={2}
                                value={managerReplyText}
                                onChange={(e) => setManagerReplyText(e.target.value)}
                                placeholder="Dear guest, we are truly delighted..."
                                className="w-full bg-slate-900 border border-slate-800 focus:border-cyan-500 rounded-xl py-2 px-3 text-xs text-white focus:outline-none"
                              />
                              <div className="flex justify-end space-x-2">
                                <button
                                  onClick={() => setActiveReplyReviewId(null)}
                                  className="text-[10px] text-slate-400 font-bold uppercase px-3 py-1.5 hover:text-white"
                                >
                                  Cancel
                                </button>
                                <button
                                  onClick={() => handleReplySubmit(rev.id)}
                                  className="bg-cyan-600 text-slate-950 font-bold text-[10px] uppercase tracking-widest py-1.5 px-4 rounded-lg cursor-pointer"
                                >
                                  Submit Reply
                                </button>
                              </div>
                            </div>
                          ) : (
                            <button
                              onClick={() => {
                                setActiveReplyReviewId(rev.id);
                                setManagerReplyText("");
                              }}
                              className="text-xs text-cyan-400 hover:text-cyan-300 font-mono font-bold hover:underline flex items-center space-x-1"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                              <span>[ Write General Manager Reply ]</span>
                            </button>
                          )}
                        </div>
                      )}

                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
