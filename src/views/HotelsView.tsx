/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from "react";
import { useApp } from "../context/AppContext";
import { Search, MapPin, SlidersHorizontal, ArrowUpDown, Star, Heart, CheckCircle2, RefreshCw } from "lucide-react";

export default function HotelsView() {
  const { hotels, selectHotel, searchParams, setSearchParams, toggleWishlist, wishlist } = useApp();

  // Search filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCity, setSelectedCity] = useState(searchParams.city || "");
  const [selectedType, setSelectedType] = useState("");
  const [priceMax, setPriceMax] = useState<number>(1000);
  const [selectedRating, setSelectedRating] = useState<number>(0);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<string>("popular");

  // Reset all filters
  const resetFilters = () => {
    setSearchTerm("");
    setSelectedCity("");
    setSelectedType("");
    setPriceMax(1000);
    setSelectedRating(0);
    setSelectedAmenities([]);
    setSearchParams({ city: "" });
  };

  const amenityOptions = [
    "Free WiFi", "Private Beach", "Butler Service", "Infinity Pool", 
    "Michelin Restaurant", "Luxury Spa", "Rooftop Sky Bar"
  ];

  const toggleAmenity = (name: string) => {
    if (selectedAmenities.includes(name)) {
      setSelectedAmenities(prev => prev.filter(x => x !== name));
    } else {
      setSelectedAmenities(prev => [...prev, name]);
    }
  };

  // Filtered Hotels
  const filteredHotels = useMemo(() => {
    return hotels
      .filter((hotel) => {
        // Search term match
        const matchesSearch = 
          hotel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          hotel.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          hotel.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
          hotel.country.toLowerCase().includes(searchTerm.toLowerCase());
          
        // City match
        const matchesCity = selectedCity ? hotel.city === selectedCity : true;
        
        // Property Type match
        const matchesType = selectedType ? hotel.propertyType === selectedType : true;
        
        // Price match
        const matchesPrice = hotel.price <= priceMax;
        
        // Rating match
        const matchesRating = hotel.rating >= selectedRating;
        
        // Amenities match (all selected must be present)
        const matchesAmenities = selectedAmenities.every(a => hotel.amenities.includes(a));

        return matchesSearch && matchesCity && matchesType && matchesPrice && matchesRating && matchesAmenities;
      })
      .sort((a, b) => {
        if (sortBy === "price-low") return a.price - b.price;
        if (sortBy === "price-high") return b.price - a.price;
        if (sortBy === "rating") return b.rating - a.rating;
        // Default popular
        return b.reviewsCount - a.reviewsCount;
      });
  }, [hotels, searchTerm, selectedCity, selectedType, priceMax, selectedRating, selectedAmenities, sortBy]);

  return (
    <div className="bg-transparent text-slate-100 font-sans min-h-screen py-12 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Page Title */}
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <p className="text-[10px] uppercase tracking-widest text-amber-500 font-mono font-bold">Privileged Portfolios</p>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-white tracking-tight">Our Curated World Map</h1>
          <p className="text-xs text-slate-400">
            Apply your preferred spatial parameters and amenity standards to find the perfect luxury sanctuary tailored to your exact tastes.
          </p>
        </div>

        {/* Global Filter Bar */}
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 p-6 rounded-2xl shadow-2xl space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            
            {/* Search Input */}
            <div className="md:col-span-4 relative">
              <Search className="absolute left-3.5 top-3.5 w-4.5 h-4.5 text-slate-500" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by hotel name or country..."
                className="w-full bg-white/5 border border-white/10 focus:border-amber-500 rounded-xl py-2.5 pl-10 pr-4 text-xs text-white placeholder-slate-500 focus:outline-none backdrop-blur-md transition-colors"
                id="hotels-search-input"
              />
            </div>

            {/* City Selection */}
            <div className="md:col-span-3">
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full bg-white/5 border border-white/10 focus:border-amber-500 rounded-xl py-2.5 px-4 text-xs text-white font-semibold focus:outline-none backdrop-blur-md transition-all"
              >
                <option value="">Any Premium Location</option>
                <option value="Paris">Paris, France</option>
                <option value="Bali">Ubud, Bali</option>
                <option value="New York">New York, USA</option>
                <option value="Dubai">Dubai, UAE</option>
                <option value="Santorini">Santorini, Greece</option>
                <option value="Zermatt">Zermatt, Switzerland</option>
              </select>
            </div>

            {/* Property Type Selection */}
            <div className="md:col-span-2">
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full bg-white/5 border border-white/10 focus:border-amber-500 rounded-xl py-2.5 px-4 text-xs text-white font-semibold focus:outline-none backdrop-blur-md transition-all"
              >
                <option value="">Any Architecture</option>
                <option value="Hotel">Hotel</option>
                <option value="Resort">Resort</option>
                <option value="Villa">Villa</option>
              </select>
            </div>

            {/* Sorter */}
            <div className="md:col-span-3 flex items-center space-x-2">
              <ArrowUpDown className="w-4 h-4 text-amber-500 shrink-0" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full bg-white/5 border border-white/10 focus:border-amber-500 rounded-xl py-2.5 px-4 text-xs text-white font-semibold focus:outline-none backdrop-blur-md transition-all"
              >
                <option value="popular">Popularity Index</option>
                <option value="price-low">Privileged Rates: Low to High</option>
                <option value="price-high">Privileged Rates: High to Low</option>
                <option value="rating">Guest Rating</option>
              </select>
            </div>

          </div>

          {/* Advanced Collapsible Filters */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-6 border-t border-slate-850/60">
            
            {/* Price Max Slider */}
            <div className="lg:col-span-4 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400 font-bold uppercase tracking-widest text-[9px]">Privileged Rates Upper Limit</span>
                <span className="text-amber-500 font-serif font-black">${priceMax} / night</span>
              </div>
              <input
                type="range"
                min="300"
                max="1000"
                step="50"
                value={priceMax}
                onChange={(e) => setPriceMax(Number(e.target.value))}
                className="w-full accent-amber-600 cursor-pointer h-1.5 rounded bg-white/5 border border-white/10"
              />
            </div>

            {/* Rating Stars Filter */}
            <div className="lg:col-span-3 space-y-2">
              <span className="block text-[9px] text-slate-400 font-bold uppercase tracking-widest">Minimum Guest Rating</span>
              <div className="flex space-x-2">
                {[0, 4.7, 4.8, 4.9].map((rating) => (
                  <button
                    key={rating}
                    onClick={() => setSelectedRating(rating)}
                    className={`flex-grow border rounded-lg py-1 px-2.5 text-xs font-semibold cursor-pointer transition-colors flex items-center justify-center space-x-1 ${
                      selectedRating === rating
                        ? "bg-amber-600/10 border-amber-500 text-amber-400 font-bold"
                        : "bg-white/5 border-white/10 hover:border-white/20 text-slate-300"
                    }`}
                  >
                    <span>{rating === 0 ? "Any" : rating + "★"}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Amenities Grid checklist */}
            <div className="lg:col-span-5 space-y-2">
              <span className="block text-[9px] text-slate-400 font-bold uppercase tracking-widest">In-Suite Standard Amenities</span>
              <div className="flex flex-wrap gap-1.5">
                {amenityOptions.map((am) => {
                  const selected = selectedAmenities.includes(am);
                  return (
                    <button
                      key={am}
                      onClick={() => toggleAmenity(am)}
                      className={`text-[10px] px-2.5 py-1 rounded-lg border font-semibold transition-all cursor-pointer flex items-center space-x-1 ${
                        selected
                          ? "bg-amber-600 border-amber-500 text-white"
                          : "bg-white/5 border-white/10 hover:border-white/20 text-slate-300"
                      }`}
                    >
                      {selected && <CheckCircle2 className="w-3 h-3 text-white fill-amber-600" />}
                      <span>{am}</span>
                    </button>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Result Summary & Reset Option */}
          <div className="flex justify-between items-center text-xs pt-4 border-t border-slate-850/30">
            <p className="text-slate-400 font-mono">
              Displaying <span className="text-white font-bold">{filteredHotels.length}</span> luxury matches
            </p>
            <button
              onClick={resetFilters}
              className="text-amber-500 hover:text-amber-400 flex items-center space-x-1 uppercase text-[9px] tracking-widest font-bold font-mono transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5 animate-spin-slow" />
              <span>Reset Filters</span>
            </button>
          </div>
        </div>

        {/* Property Grid */}
        {filteredHotels.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredHotels.map((hotel) => (
              <div 
                key={hotel.id} 
                className="backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl overflow-hidden group hover:border-white/20 hover:bg-white/10 hover:-translate-y-1 transition-all duration-300 flex flex-col shadow-2xl"
                id={`hotel-card-${hotel.id}`}
              >
                
                {/* Visual Frame */}
                <div className="relative h-60 overflow-hidden">
                  <img 
                    src={hotel.image} 
                    alt={hotel.name} 
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  />
                  <button
                    onClick={() => toggleWishlist(hotel.id)}
                    className={`absolute top-4 right-4 p-2 rounded-full border shadow-md backdrop-blur-md transition-all z-20 ${
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
                  <div className="absolute top-4 left-4 bg-white/10 backdrop-blur-md border border-white/20 text-amber-400 text-[9px] font-bold tracking-widest uppercase px-3 py-1 rounded-full shadow-md">
                    ★ {hotel.rating.toFixed(1)} / {hotel.propertyType}
                  </div>
                </div>

                {/* Info Deck */}
                <div className="p-6 flex-grow flex flex-col justify-between space-y-4">
                  <div className="space-y-1.5">
                    <div className="flex items-center space-x-1 text-[10px] text-slate-400 font-mono">
                      <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                      <span>{hotel.city}, {hotel.country}</span>
                    </div>
                    <h3 className="text-md font-serif font-bold text-white group-hover:text-amber-400 transition-colors">
                      {hotel.name}
                    </h3>
                    <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                      {hotel.description}
                    </p>
                  </div>

                  {/* Pricing and Action */}
                  <div className="flex items-center justify-between pt-4 border-t border-white/10">
                    <div>
                      <span className="block text-[8px] text-slate-500 uppercase tracking-widest">privileged rates</span>
                      <span className="text-md font-serif font-black text-amber-500">${hotel.price}</span>
                      <span className="text-[10px] text-slate-400"> / night</span>
                    </div>
                    <button
                      onClick={() => selectHotel(hotel.id)}
                      className="bg-white/5 hover:bg-white/15 border border-white/10 text-slate-200 hover:text-white text-[9px] font-bold px-4 py-2.5 rounded-xl uppercase tracking-widest backdrop-blur-sm transition-all cursor-pointer"
                    >
                      Inspect Suite Options
                    </button>
                  </div>

                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-12 text-center max-w-lg mx-auto space-y-4 shadow-2xl">
            <SlidersHorizontal className="w-12 h-12 text-amber-500/30 mx-auto animate-pulse" />
            <h3 className="text-lg font-serif font-bold text-white">No Properties Matched Your Specs</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              We do not currently harbor any suites matching your specific combined search. Perhaps broaden your price range bounds or relax selected amenity checkmarks to uncover options.
            </p>
            <button
              onClick={resetFilters}
              className="bg-amber-600 hover:bg-amber-500 text-white text-[10px] font-bold px-5 py-2.5 rounded-xl uppercase tracking-widest transition-all"
            >
              Reset Search Parameters
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
