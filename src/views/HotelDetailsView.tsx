/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { MapPin, Star, Sparkles, ShowerHead, HelpCircle, BedDouble, ArrowLeft, ArrowRight, UserPlus, CheckCircle, MessageSquare, Heart } from "lucide-react";

export default function HotelDetailsView() {
  const { 
    selectedHotelId, hotels, rooms, reviews, addReview, 
    selectRoom, setRoute, selectHotel, user, wishlist, toggleWishlist 
  } = useApp();

  const hotel = hotels.find(h => h.id === selectedHotelId);
  const hotelRooms = rooms.filter(r => r.hotelId === selectedHotelId);
  const hotelReviews = reviews.filter(r => r.hotelId === selectedHotelId);

  // Review states
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);

  if (!hotel) {
    return (
    <div className="bg-transparent text-slate-100 font-sans min-h-[60vh] flex flex-col items-center justify-center space-y-4 px-4 font-sans relative z-10">
        <HelpCircle className="w-12 h-12 text-amber-500 animate-bounce" />
        <h3 className="text-xl font-serif font-bold text-white">No Property Selected</h3>
        <p className="text-xs text-slate-400">Please return to our curated map to inspect options.</p>
        <button onClick={() => setRoute("hotels")} className="bg-amber-600 hover:bg-amber-500 text-white text-[10px] uppercase tracking-widest font-bold px-5 py-2.5 rounded-xl">
          Return to map
        </button>
      </div>
    );
  }

  // Combined photo array
  const allPhotos = [hotel.image, ...hotel.images];

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;
    const ok = await addReview({
      hotelId: hotel.id,
      rating,
      comment
    });
    if (ok) {
      setReviewSubmitted(true);
      setComment("");
      setTimeout(() => setReviewSubmitted(false), 5000);
    }
  };

  return (
    <div className="bg-transparent text-slate-100 font-sans py-12 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Breadcrumb / Return */}
        <button
          onClick={() => setRoute("hotels")}
          className="text-slate-400 hover:text-amber-400 flex items-center space-x-1 uppercase text-[9px] tracking-widest font-mono font-bold transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to curated map</span>
        </button>

        {/* Header Title Grid */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-white/10 pb-6">
          <div className="space-y-1.5">
            <span className="text-[10px] text-amber-500 font-mono font-bold uppercase tracking-widest flex items-center space-x-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>curated {hotel.category} oasis</span>
            </span>
            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-white tracking-tight">{hotel.name}</h1>
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
              <div className="flex items-center space-x-1 font-mono">
                <MapPin className="w-4 h-4 text-amber-500 shrink-0" />
                <span>{hotel.address}</span>
              </div>
              <span>•</span>
              <div className="flex items-center space-x-1 text-amber-400 font-bold">
                <span>★ {hotel.rating.toFixed(1)}</span>
                <span className="text-slate-500">({hotel.reviewsCount} reviews)</span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3 w-full md:w-auto">
            <button
              onClick={() => toggleWishlist(hotel.id)}
              className={`flex-grow md:flex-none border rounded-xl py-3 px-5 text-xs font-bold uppercase tracking-widest transition-all cursor-pointer flex items-center justify-center space-x-2 ${
                wishlist.includes(hotel.id)
                  ? "bg-amber-600 border-amber-500 text-white"
                  : "bg-white/5 border-white/10 text-slate-300 hover:text-white hover:bg-white/10"
              }`}
            >
              <Heart className="w-4 h-4 fill-current" />
              <span>{wishlist.includes(hotel.id) ? "Saved in Wishlist" : "Save to Wishlist"}</span>
            </button>
          </div>
        </div>

        {/* Media Frame Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Large Main Frame */}
          <div className="lg:col-span-8 relative rounded-2xl overflow-hidden h-[300px] sm:h-[450px] border border-white/10 group">
            <img 
              src={allPhotos[activePhotoIdx]} 
              alt={hotel.name} 
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500" 
            />
            
            {/* Arrows */}
            <button 
              onClick={() => setActivePhotoIdx(prev => (prev === 0 ? allPhotos.length - 1 : prev - 1))}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-slate-300 hover:text-white hover:scale-105 transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setActivePhotoIdx(prev => (prev === allPhotos.length - 1 ? 0 : prev + 1))}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-slate-300 hover:text-white hover:scale-105 transition-all"
            >
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Indicator */}
            <div className="absolute bottom-4 right-4 bg-white/10 backdrop-blur-md border border-white/20 text-white text-[10px] font-mono px-3 py-1 rounded-lg">
              {activePhotoIdx + 1} / {allPhotos.length}
            </div>
          </div>

          {/* Small Thumbnails Vertical */}
          <div className="lg:col-span-4 grid grid-cols-4 lg:grid-cols-1 gap-4 h-auto lg:h-[450px]">
            {allPhotos.map((img, index) => (
              <div 
                key={index}
                onClick={() => setActivePhotoIdx(index)}
                className={`relative rounded-xl overflow-hidden cursor-pointer border-2 transition-all h-20 sm:h-24 lg:h-[100px] ${
                  activePhotoIdx === index ? "border-amber-500" : "border-white/10 opacity-60 hover:opacity-100"
                }`}
              >
                <img src={img} alt={`Thumb ${index}`} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>

        </div>

        {/* Double-Column Details & Room Catalogue */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* LEFT: About Property, Amenities, Reviews, Policies */}
          <div className="lg:col-span-7 space-y-10">
            
            {/* Story */}
            <div className="space-y-4">
              <h2 className="text-xl font-serif text-white tracking-tight border-b border-white/10 pb-3">The Sanctuary Narrative</h2>
              <p className="text-xs text-slate-400 leading-relaxed font-sans whitespace-pre-line">{hotel.description}</p>
            </div>

            {/* In-Suite Amenities */}
            <div className="space-y-4">
              <h2 className="text-xl font-serif text-white tracking-tight border-b border-white/10 pb-3">Resort Conveniences</h2>
              <div className="grid grid-cols-2 gap-3">
                {hotel.amenities.map((am, idx) => (
                  <div key={idx} className="flex items-center space-x-2.5 text-xs text-slate-300">
                    <div className="w-1.5 h-1.5 bg-amber-500 rounded-full"></div>
                    <span>{am}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* House Policies */}
            <div className="space-y-4">
              <h2 className="text-xl font-serif text-white tracking-tight border-b border-white/10 pb-3">Property Policies</h2>
              <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-6 grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs font-sans shadow-lg">
                <div className="space-y-1">
                  <span className="block text-slate-500 uppercase tracking-widest text-[9px] font-bold">Standard Check-In</span>
                  <p className="text-slate-300 font-semibold">From 3:00 PM — Secure keycards provided at concierge.</p>
                </div>
                <div className="space-y-1">
                  <span className="block text-slate-500 uppercase tracking-widest text-[9px] font-bold">Standard Check-Out</span>
                  <p className="text-slate-300 font-semibold">Until 12:00 PM (Noon) — Express box drop-off.</p>
                </div>
                <div className="space-y-1 sm:col-span-2 border-t border-white/10 pt-4">
                  <span className="block text-slate-500 uppercase tracking-widest text-[9px] font-bold">Bespoke Cancellation Terms</span>
                  <p className="text-slate-300 leading-relaxed pt-1">
                    Free cancellation up to 48 hours prior to arrival. Cancellations made inside this luxury threshold incur a 1-night standard suite charge.
                  </p>
                </div>
              </div>
            </div>

            {/* Reviews Folder */}
            <div className="space-y-6">
              <h2 className="text-xl font-serif text-white tracking-tight border-b border-white/10 pb-3">Guest Chronicles</h2>

              {/* Submission Form if Logged In */}
              {user ? (
                <form onSubmit={handleReviewSubmit} className="backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-5 space-y-4 shadow-lg">
                  <h4 className="text-xs font-bold uppercase text-white tracking-widest">Share Your Experience</h4>
                  
                  {/* Rating Selector */}
                  <div className="flex items-center space-x-3">
                    <span className="text-[10px] uppercase text-slate-400 font-bold">Your Score:</span>
                    <div className="flex space-x-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          type="button"
                          key={star}
                          onClick={() => setRating(star)}
                          className="text-amber-500 focus:outline-none p-0.5"
                        >
                          <Star className={`w-4 h-4 ${rating >= star ? "fill-amber-500" : "text-slate-600"}`} />
                        </button>
                      ))}
                    </div>
                  </div>

                  <textarea
                    rows={3}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Enter your refined testimonial..."
                    className="w-full bg-white/5 border border-white/10 focus:border-amber-500 rounded-xl py-2 px-3 text-xs text-white placeholder-slate-500 focus:outline-none backdrop-blur-sm transition-colors"
                    required
                  />

                  <button
                    type="submit"
                    className="bg-amber-600 hover:bg-amber-500 text-white text-[10px] uppercase tracking-widest font-bold py-2 px-4 rounded-lg transition-colors cursor-pointer"
                  >
                    Submit Testimonial
                  </button>

                  {reviewSubmitted && (
                    <p className="text-[10px] text-amber-400 font-mono">
                      ✓ Thank you. Your testimonial has been saved and will guide future travelers.
                    </p>
                  )}
                </form>
              ) : (
                <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center backdrop-blur-sm">
                  <p className="text-xs text-slate-400">
                    Please login to submit a verified guest testimonial.
                  </p>
                </div>
              )}

              {/* Review Feed */}
              <div className="space-y-4">
                {hotelReviews.length > 0 ? (
                  hotelReviews.map((rev) => (
                    <div key={rev.id} className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-3 shadow-md">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-full bg-white/10 border border-white/10 font-mono text-[10px] text-white flex items-center justify-center overflow-hidden">
                            {rev.userAvatar ? (
                              <img src={rev.userAvatar} alt={rev.userName} className="w-full h-full object-cover" />
                            ) : (
                              rev.userName.charAt(0)
                            )}
                          </div>
                          <div>
                            <h5 className="text-xs font-bold text-white">{rev.userName}</h5>
                            <span className="text-[9px] text-slate-500 font-mono">{rev.date}</span>
                          </div>
                        </div>
                        <div className="flex text-amber-500 space-x-0.5">
                          {Array.from({ length: rev.rating }).map((_, i) => (
                            <Star key={i} className="w-3 h-3 fill-amber-500" />
                          ))}
                        </div>
                      </div>
                      
                      <p className="text-xs text-slate-300 leading-relaxed font-sans">{rev.comment}</p>

                      {/* Admin Response Block */}
                      {rev.reply && (
                        <div className="bg-white/10 backdrop-blur-sm border-l-2 border-amber-500 p-3 rounded-r-xl space-y-1 ml-4 mt-2">
                          <span className="block text-[8px] text-amber-500 uppercase tracking-widest font-bold">Resort General Manager response</span>
                          <p className="text-xs text-slate-400 font-serif leading-relaxed italic">"{rev.reply}"</p>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-500 italic">No chronicles logged for this sanctuary yet.</p>
                )}
              </div>

            </div>

          </div>

          {/* RIGHT: Rooms Collection Catalog */}
          <div className="lg:col-span-5 space-y-6">
            <h2 className="text-xl font-serif text-white tracking-tight border-b border-white/10 pb-3">Available Suite Catalog</h2>
            
            {hotelRooms.length > 0 ? (
              <div className="space-y-4">
                {hotelRooms.map((room) => (
                  <div 
                    key={room.id} 
                    className="backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl overflow-hidden shadow-xl flex flex-col hover:border-white/20 hover:bg-white/10 transition-colors"
                    id={`room-selection-${room.id}`}
                  >
                    {/* Thumbnail */}
                    <div className="h-44 relative overflow-hidden">
                      <img src={room.images[0] || "https://picsum.photos/seed/room_generic/600/400"} alt={room.name} className="w-full h-full object-cover" />
                      <div className="absolute bottom-4 left-4 bg-white/10 backdrop-blur-md border border-white/20 px-2 py-0.5 rounded text-[10px] text-slate-200 font-mono">
                        {room.size} • {room.bedType}
                      </div>
                    </div>

                    {/* Room Details */}
                    <div className="p-5 space-y-4">
                      <div className="space-y-1.5">
                        <h4 className="text-xs font-serif font-bold text-white text-md tracking-tight">{room.name}</h4>
                        <p className="text-xs text-slate-400 leading-relaxed">{room.description}</p>
                      </div>

                      {/* Amenities checklist */}
                      <div className="flex flex-wrap gap-1.5">
                        {room.amenities.map((am, i) => (
                          <span key={i} className="text-[9px] text-slate-300 bg-white/5 border border-white/10 px-2 py-0.5 rounded-md font-mono">
                            {am}
                          </span>
                        ))}
                      </div>

                      {/* Pricing Trigger */}
                      <div className="flex items-center justify-between pt-4 border-t border-white/10">
                        <div>
                          <span className="block text-[8px] text-slate-500 uppercase tracking-widest">nightly rate</span>
                          <span className="text-md font-serif font-black text-amber-500">${room.price}</span>
                          <span className="text-[9px] text-slate-400"> / night</span>
                        </div>
                        <button
                          onClick={() => selectRoom(room.id)}
                          className="bg-amber-600 hover:bg-amber-500 text-white text-[9px] font-bold px-4 py-2 rounded-lg uppercase tracking-widest transition-all cursor-pointer shadow-md shadow-amber-600/10"
                        >
                          Request Booking
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-6 text-center space-y-2">
                <ShowerHead className="w-10 h-10 text-amber-500/30 mx-auto" />
                <p className="text-xs text-slate-400">No specific suites listed in this sanctuary portfolio.</p>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
