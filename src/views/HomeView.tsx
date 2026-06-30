/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { Search, Calendar, Users, Star, ArrowRight, ShieldCheck, MapPin, Award, Coffee, Activity } from "lucide-react";

export default function HomeView() {
  const { 
    settings, hotels, selectHotel, setRoute, 
    searchParams, setSearchParams, toggleWishlist, wishlist 
  } = useApp();

  const [localSearch, setLocalSearch] = useState({
    city: searchParams.city,
    checkIn: searchParams.checkIn,
    checkOut: searchParams.checkOut,
    adults: searchParams.adults
  });

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchParams(localSearch);
    setRoute("hotels");
  };

  const featuredHotels = hotels.filter(h => h.featured).slice(0, 3);
  const regularHotels = hotels.slice(0, 6);

  const destinations = [
    { name: "Paris", country: "France", count: 2, image: "https://picsum.photos/seed/dest_paris/600/400" },
    { name: "Bali", country: "Indonesia", count: 2, image: "https://picsum.photos/seed/dest_bali/600/400" },
    { name: "Dubai", country: "United Arab Emirates", count: 2, image: "https://picsum.photos/seed/dest_dubai/600/400" },
    { name: "New York", country: "United States", count: 1, image: "https://picsum.photos/seed/dest_ny/600/400" }
  ];

  const statistics = [
    { count: "50+", label: "Elite Resorts" },
    { count: "25k+", label: "Satisfied Guests" },
    { count: "18+", label: "International Awards" },
    { count: "100%", label: "Bespoke Service" }
  ];

  return (
    <div className="bg-transparent text-slate-100 font-sans relative z-10">
      {/* Luxury Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Background Image Overlay with parallax/fade */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://picsum.photos/seed/luxury_hero/1920/1080" 
            alt="Luxury Resort" 
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover opacity-35 scale-105 filter brightness-90 animate-pulse-slow"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-slate-950/20"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-transparent to-slate-950/20"></div>
        </div>

        <div className="relative z-10 max-w-5xl mx-auto text-center space-y-8 animate-fade-in">
          {/* Tagline Pill */}
          <div className="inline-flex items-center space-x-2 bg-amber-500/10 border border-amber-500/30 px-4 py-1.5 rounded-full text-[10px] uppercase tracking-widest text-amber-400 font-semibold shadow-inner">
            <Award className="w-3.5 h-3.5 text-amber-500 animate-spin-slow" />
            <span>{settings.tagline}</span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold text-white tracking-tight leading-tight max-w-4xl mx-auto">
            {settings.heroTitle}
          </h1>

          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mx-auto leading-relaxed">
            {settings.heroSubtitle}
          </p>

          {/* Hotel Search Widget with Frosted Glass Styling */}
          <div className="max-w-4xl mx-auto bg-white/10 backdrop-blur-xl border border-white/20 p-4 sm:p-5 rounded-2xl shadow-2xl mt-10">
            <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end text-left">
              
              {/* Destination Search */}
              <div className="md:col-span-4 space-y-1.5">
                <label className="text-[10px] uppercase tracking-widest text-slate-400 font-bold block">Destination</label>
                <div className="relative">
                  <MapPin className="absolute left-3.5 top-3 w-4 h-4 text-amber-500" />
                  <select
                    value={localSearch.city}
                    onChange={(e) => setLocalSearch(prev => ({ ...prev, city: e.target.value }))}
                    className="w-full bg-white/5 border border-white/10 focus:border-amber-500 text-xs py-3.5 pl-10 pr-4 rounded-xl text-white font-semibold focus:outline-none focus:ring-1 focus:ring-amber-500 backdrop-blur-md transition-all appearance-none"
                  >
                    <option value="">Any Premium Location</option>
                    <option value="Paris">Paris, France</option>
                    <option value="Bali">Ubud, Bali</option>
                    <option value="New York">New York, USA</option>
                    <option value="Dubai">Dubai, UAE</option>
                    <option value="Santorini">Santorini, Greece</option>
                  </select>
                </div>
              </div>

              {/* Check In Date */}
              <div className="md:col-span-3 space-y-1.5">
                <label className="text-[10px] uppercase tracking-widest text-slate-400 font-bold block">Check-In</label>
                <div className="relative">
                  <Calendar className="absolute left-3.5 top-3 w-4 h-4 text-amber-500" />
                  <input
                    type="date"
                    value={localSearch.checkIn}
                    onChange={(e) => setLocalSearch(prev => ({ ...prev, checkIn: e.target.value }))}
                    className="w-full bg-white/5 border border-white/10 focus:border-amber-500 text-xs py-2.5 pl-10 pr-3 rounded-xl text-white font-semibold focus:outline-none backdrop-blur-md transition-all"
                  />
                </div>
              </div>

              {/* Check Out Date */}
              <div className="md:col-span-3 space-y-1.5">
                <label className="text-[10px] uppercase tracking-widest text-slate-400 font-bold block">Check-Out</label>
                <div className="relative">
                  <Calendar className="absolute left-3.5 top-3 w-4 h-4 text-amber-500" />
                  <input
                    type="date"
                    value={localSearch.checkOut}
                    onChange={(e) => setLocalSearch(prev => ({ ...prev, checkOut: e.target.value }))}
                    className="w-full bg-white/5 border border-white/10 focus:border-amber-500 text-xs py-2.5 pl-10 pr-3 rounded-xl text-white font-semibold focus:outline-none backdrop-blur-md transition-all"
                  />
                </div>
              </div>

              {/* Guests Selector */}
              <div className="md:col-span-2">
                <button
                  type="submit"
                  className="w-full bg-amber-600 hover:bg-amber-500 hover:scale-[1.02] text-white py-3 px-4 rounded-xl flex items-center justify-center space-x-2 font-bold uppercase text-[11px] tracking-wider transition-all cursor-pointer shadow-lg shadow-amber-600/20 hover:shadow-amber-600/30"
                  id="hero-search-btn"
                >
                  <Search className="w-4 h-4" />
                  <span>Explore</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      </section>

      {/* Statistics Section with Frosted Glass Aesthetics */}
      <section className="bg-white/5 backdrop-blur-md border-y border-white/10 py-10 px-4 relative z-20">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {statistics.map((stat, i) => (
            <div key={i} className="space-y-1 animate-fade-in">
              <span className="block text-3xl sm:text-4xl font-serif font-black text-amber-500">{stat.count}</span>
              <span className="block text-[10px] text-slate-400 uppercase tracking-widest font-semibold">{stat.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Properties Grid */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
        <div className="text-center space-y-2">
          <p className="text-[10px] tracking-widest uppercase text-amber-500 font-extrabold font-mono">Curated Collections</p>
          <h2 className="text-3xl font-serif font-bold text-white tracking-tight">Our Legendary Masterpieces</h2>
          <p className="text-xs text-slate-400 max-w-xl mx-auto">
            Discover a meticulously detailed portfolio of handpicked luxury sanctuaries, architectural wonders, and private island reserves across the globe.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredHotels.map((hotel) => (
            <div 
              key={hotel.id} 
              className="backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl overflow-hidden group hover:border-white/20 hover:bg-white/10 transition-all duration-300 flex flex-col shadow-2xl"
              id={`featured-hotel-${hotel.id}`}
            >
              {/* Image Frame */}
              <div className="relative h-64 overflow-hidden">
                <img 
                  src={hotel.image} 
                  alt={hotel.name} 
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                />
                <div className="absolute top-4 left-4 bg-white/10 backdrop-blur-md border border-white/20 text-amber-400 text-[9px] font-bold tracking-widest uppercase px-3 py-1 rounded-full shadow-md">
                  ★ {hotel.rating.toFixed(1)} / {hotel.category}
                </div>
                <button
                  onClick={() => toggleWishlist(hotel.id)}
                  className={`absolute top-4 right-4 p-2 rounded-full border shadow-md backdrop-blur-md transition-all ${
                    wishlist.includes(hotel.id)
                      ? "bg-amber-600 border-amber-500 text-white"
                      : "bg-white/10 border-white/20 text-slate-300 hover:text-white hover:bg-white/20"
                  }`}
                  title="Add to Wishlist"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                  </svg>
                </button>
              </div>

              {/* Body */}
              <div className="p-6 flex-grow flex flex-col justify-between space-y-4">
                <div className="space-y-1.5">
                  <div className="flex items-center space-x-1 text-[10px] text-slate-400 font-mono">
                    <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    <span>{hotel.city}, {hotel.country}</span>
                  </div>
                  <h3 className="text-lg font-serif font-bold text-white leading-tight group-hover:text-amber-400 transition-colors">
                    {hotel.name}
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed font-sans pt-1">
                    {hotel.description}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-white/10">
                  <div>
                    <span className="block text-[8px] text-slate-500 uppercase tracking-widest">privileged rates</span>
                    <span className="text-lg font-serif font-extrabold text-amber-500">${hotel.price}</span>
                    <span className="text-[10px] text-slate-400"> / night</span>
                  </div>
                  <button
                    onClick={() => selectHotel(hotel.id)}
                    className="bg-white/5 hover:bg-white/15 border border-white/10 text-slate-200 hover:text-white text-[10px] font-bold px-4 py-2.5 rounded-xl uppercase tracking-widest backdrop-blur-sm transition-all cursor-pointer flex items-center space-x-1.5"
                  >
                    <span>Inspect</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Spa & Fine Dining Showcase with Frosted Glass Aesthetics */}
      <section className="bg-white/5 backdrop-blur-md border-y border-white/10 overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2">
          
          {/* Gastronomy Showcase */}
          <div className="p-10 sm:p-16 flex flex-col justify-center space-y-6 lg:border-r lg:border-white/10">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
              <Coffee className="w-5 h-5 text-amber-500" />
            </div>
            <p className="text-[10px] tracking-widest uppercase text-amber-500 font-mono">Gastronomic Masters</p>
            <h3 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-tight">Michelin Starred Masterpieces</h3>
            <p className="text-xs text-slate-400 leading-relaxed font-sans">
              Our curated resorts house the world's most elite culinary rooms, led by celebrated Master Chefs. Indulge in tailored sensory menus, private wine vaults housing centuries-old vintage reserves, and dramatic sunset terraces.
            </p>
            <div>
              <button 
                onClick={() => setRoute("services")} 
                className="text-xs font-serif font-bold text-amber-500 hover:text-amber-400 flex items-center space-x-2 group cursor-pointer"
              >
                <span>Discover Fine Dining Venues</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
          
          {/* Spa Showcase */}
          <div className="relative min-h-[350px] lg:min-h-full">
            <img 
              src="https://picsum.photos/seed/spa_showcase/1200/800" 
              alt="Luxury Spa Wellness" 
              referrerPolicy="no-referrer"
              className="absolute inset-0 w-full h-full object-cover opacity-50"
            />
            <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-slate-900 via-transparent to-transparent"></div>
          </div>

        </div>
      </section>

      {/* Spa Subterranean Showcase Split (Reversed) with Frosted Glass Aesthetics */}
      <section className="bg-white/5 overflow-hidden border-b border-white/10 backdrop-blur-md">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2">
          
          <div className="relative min-h-[350px] lg:min-h-full order-2 lg:order-1">
            <img 
              src="https://picsum.photos/seed/spa_sub/1200/800" 
              alt="Subterranean Thermal Baths" 
              referrerPolicy="no-referrer"
              className="absolute inset-0 w-full h-full object-cover opacity-50"
            />
            <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-l from-slate-900 via-transparent to-transparent"></div>
          </div>

          <div className="p-10 sm:p-16 flex flex-col justify-center space-y-6 order-1 lg:order-2">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
              <Activity className="w-5 h-5 text-amber-500" />
            </div>
            <p className="text-[10px] tracking-widest uppercase text-amber-500 font-mono">Bespoke Rituals</p>
            <h3 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-tight">Subterranean Water Spa Journeys</h3>
            <p className="text-xs text-slate-400 leading-relaxed font-sans">
              Enter our profound water temples and thermal cave pathways. Features mineral pools fed by direct volcanic spring water, private Hammams, Finnish rock saunas, and comprehensive Ayurvedic mapping therapies.
            </p>
            <div>
              <button 
                onClick={() => setRoute("services")} 
                className="text-xs font-serif font-bold text-amber-500 hover:text-amber-400 flex items-center space-x-2 group cursor-pointer"
              >
                <span>Reserve Spa Treatment Sessions</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-16">
        <div className="text-center space-y-2">
          <p className="text-[10px] tracking-widest uppercase text-amber-500 font-extrabold font-mono">The Privilege Experience</p>
          <h2 className="text-3xl font-serif font-bold text-white tracking-tight">An Unparalleled Standard of Hospitality</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="backdrop-blur-md bg-white/5 border border-white/10 p-8 rounded-2xl space-y-4 shadow-xl hover:bg-white/10 hover:border-white/20 transition-all">
            <div className="w-10 h-10 bg-amber-500/10 border border-amber-500/20 text-amber-500 rounded-xl flex items-center justify-center font-bold text-lg">
              ★
            </div>
            <h4 className="text-md font-serif font-bold text-white">Elite Clefs d'Or Butlers</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Every room booking unlocks a private, on-call concierge assistant who manages private charters, regional security details, or in-suite tailoring needs.
            </p>
          </div>

          <div className="backdrop-blur-md bg-white/5 border border-white/10 p-8 rounded-2xl space-y-4 shadow-xl hover:bg-white/10 hover:border-white/20 transition-all">
            <div className="w-10 h-10 bg-amber-500/10 border border-amber-500/20 text-amber-500 rounded-xl flex items-center justify-center font-bold text-lg">
              ❖
            </div>
            <h4 className="text-md font-serif font-bold text-white">Guaranteed Ultimate Privacy</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Our villas and penthouse suites are strategically sequestered within secure, gated peninsula parameters, ensuring complete visual isolation and secure entrances.
            </p>
          </div>

          <div className="backdrop-blur-md bg-white/5 border border-white/10 p-8 rounded-2xl space-y-4 shadow-xl hover:bg-white/10 hover:border-white/20 transition-all">
            <div className="w-10 h-10 bg-amber-500/10 border border-amber-500/20 text-amber-500 rounded-xl flex items-center justify-center font-bold text-lg">
              ✓
            </div>
            <h4 className="text-md font-serif font-bold text-white">Best Rate Guarantee</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              By booking through our private registry, you obtain immediate access to absolute best prices, complimentary upgrades, and flexible cancellation rules.
            </p>
          </div>
        </div>
      </section>

      {/* Customer Review Block with Frosted Glass Aesthetics */}
      <section className="bg-white/5 backdrop-blur-md border-t border-white/10 py-20 px-4">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <div className="flex justify-center space-x-1">
            {[1, 2, 3, 4, 5].map((s) => <Star key={s} className="w-4 h-4 fill-amber-500 text-amber-500" />)}
          </div>
          <p className="text-lg font-serif italic text-white leading-relaxed">
            "Staying at the Grand Zenith in Paris was the absolute peak of my travel history. Savoring vintage champagne on the suite balcony while overlooking the sparkling Eiffel Tower felt like being in a curated classic film. Absolutely flawless attention to detail!"
          </p>
          <div className="space-y-0.5">
            <h5 className="text-xs font-bold text-amber-500 uppercase tracking-widest">Charlotte Dupont</h5>
            <span className="text-[10px] text-slate-500">Verified Elite Guest • June 2026</span>
          </div>
        </div>
      </section>

      {/* Live CTA Section with Frosted Glass Aesthetics */}
      <section className="bg-gradient-to-r from-amber-500/10 to-indigo-500/10 border-t border-white/10 backdrop-blur-md py-16 px-4 text-center space-y-6 relative">
        <div className="max-w-2xl mx-auto space-y-3">
          <h3 className="text-2xl font-serif font-bold text-white">Are You Ready to Embark?</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Register for a complimentary Guest Account today to activate your premium wishlists, track luxury booking invoices, and receive on-demand concierge advice powered by advanced AI.
          </p>
        </div>
        <div className="flex justify-center space-x-4">
          <button 
            onClick={() => setRoute("hotels")} 
            className="bg-amber-600 hover:bg-amber-500 text-white text-[11px] font-bold px-6 py-3 rounded-xl uppercase tracking-widest transition-all cursor-pointer shadow shadow-amber-600/10"
          >
            Explore Portfolio
          </button>
          <button 
            onClick={() => setRoute("contact")} 
            className="bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-200 text-[11px] font-bold px-6 py-3 rounded-xl uppercase tracking-widest transition-all cursor-pointer"
          >
            Inquire Privately
          </button>
        </div>
      </section>
    </div>
  );
}
