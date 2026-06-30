/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from "react";
import { useApp } from "../context/AppContext";
import { HelpCircle, Calendar, Users, ShoppingBag, CreditCard, Gift, Printer, CheckCircle2, Award, ClipboardList } from "lucide-react";

export default function BookingView() {
  const { 
    selectedHotelId, selectedRoomId, hotels, rooms, coupons, createBooking, setRoute, user 
  } = useApp();

  const hotel = hotels.find(h => h.id === selectedHotelId);
  const room = rooms.find(r => r.id === selectedRoomId);

  // Form States
  const [step, setStep] = useState(1);
  const [checkIn, setCheckIn] = useState(new Date(Date.now() + 86400000 * 2).toISOString().split("T")[0]);
  const [checkOut, setCheckOut] = useState(new Date(Date.now() + 86400000 * 5).toISOString().split("T")[0]);
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);

  const [guestName, setGuestName] = useState(user?.name || "");
  const [guestEmail, setGuestEmail] = useState(user?.email || "");
  const [guestPhone, setGuestPhone] = useState(user?.phone || "");
  const [specialRequests, setSpecialRequests] = useState("");

  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discountType: string; value: number } | null>(null);
  const [couponError, setCouponError] = useState("");

  const [paymentMethod, setPaymentMethod] = useState("card");
  const [cardNo, setCardNo] = useState("");
  const [cardExp, setCardExp] = useState("");
  const [cardCvv, setCardCvv] = useState("");

  const [confirmedBooking, setConfirmedBooking] = useState<any>(null);

  // Dynamic calculations
  const totalNights = useMemo(() => {
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diff = end.getTime() - start.getTime();
    const nights = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return nights > 0 ? nights : 1;
  }, [checkIn, checkOut]);

  const basePriceSum = useMemo(() => {
    if (!room) return 0;
    return room.price * totalNights;
  }, [room, totalNights]);

  const discountAmount = useMemo(() => {
    if (!appliedCoupon) return 0;
    if (appliedCoupon.discountType === "percent") {
      return parseFloat(((basePriceSum * appliedCoupon.value) / 100).toFixed(2));
    } else {
      return appliedCoupon.value;
    }
  }, [appliedCoupon, basePriceSum]);

  const luxuryTax = useMemo(() => {
    return parseFloat(((basePriceSum - discountAmount) * 0.1).toFixed(2)); // 10% tax
  }, [basePriceSum, discountAmount]);

  const wellnessServiceCharge = 50; // flat fee

  const grandTotal = useMemo(() => {
    return parseFloat((basePriceSum - discountAmount + luxuryTax + wellnessServiceCharge).toFixed(2));
  }, [basePriceSum, discountAmount, luxuryTax]);

  // Apply Privilege Code
  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError("");
    const matched = coupons.find(c => c.code.toUpperCase() === couponCode.trim().toUpperCase() && c.active);
    if (matched) {
      setAppliedCoupon(matched);
    } else {
      setCouponError("Invalid or expired privilege coupon code.");
    }
  };

  // Submit Booking Trigger
  const handleCompleteBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hotel || !room) return;

    const bookingPayload = {
      hotelId: hotel.id,
      roomId: room.id,
      checkIn,
      checkOut,
      guests: { adults, children },
      guestName,
      guestEmail,
      guestPhone,
      totalAmount: grandTotal,
      couponUsed: appliedCoupon?.code || undefined,
      specialRequests
    };

    const result = await createBooking(bookingPayload);
    if (result) {
      setConfirmedBooking(result);
      setStep(4);
    } else {
      alert("Reservation failed. Please verify your credentials or contact concierge.");
    }
  };

  // Print Invoice Action
  const handlePrint = () => {
    window.print();
  };

  if (!hotel || !room) {
    return (
    <div className="bg-transparent text-slate-100 font-sans min-h-[60vh] flex flex-col items-center justify-center space-y-4 px-4 font-sans relative z-10">
        <HelpCircle className="w-12 h-12 text-amber-500 animate-bounce" />
        <h3 className="text-xl font-serif font-bold text-white">No Selection to Book</h3>
        <p className="text-xs text-slate-400">Please choose a hotel and specific room tier from our map explorer first.</p>
        <button onClick={() => setRoute("hotels")} className="bg-amber-600 hover:bg-amber-500 text-white text-[10px] uppercase tracking-widest font-bold px-5 py-2.5 rounded-xl">
          curated map
        </button>
      </div>
    );
  }

  return (
    <div className="bg-transparent text-slate-100 font-sans min-h-screen py-12 relative z-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Progress Stepper bar */}
        <div className="flex justify-between items-center max-w-xl mx-auto border-b border-white/10 pb-6 text-xs text-slate-500 font-mono">
          <button onClick={() => step > 1 && step < 4 && setStep(1)} className={`pb-2 border-b-2 font-semibold ${step === 1 ? "border-amber-500 text-amber-400" : "border-transparent"}`}>
            1. Review Selection
          </button>
          <button onClick={() => step > 2 && step < 4 && setStep(2)} className={`pb-2 border-b-2 font-semibold ${step === 2 ? "border-amber-500 text-amber-400" : "border-transparent"}`}>
            2. Guest Information
          </button>
          <button onClick={() => step > 3 && step < 4 && setStep(3)} className={`pb-2 border-b-2 font-semibold ${step === 3 ? "border-amber-500 text-amber-400" : "border-transparent"}`}>
            3. Payment
          </button>
          <div className={`pb-2 border-b-2 font-semibold ${step === 4 ? "border-emerald-500 text-emerald-400" : "border-transparent text-slate-700"}`}>
            4. Confirmation
          </div>
        </div>

        {/* Double-Column Funnel layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* LEFT: Step-Specific Forms */}
          <div className="lg:col-span-7 backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl">
            
            {/* STEP 1: REVIEW SELECTION & CALENDAR DATES */}
            {step === 1 && (
              <div className="space-y-6">
                <div className="space-y-1">
                  <span className="text-[10px] uppercase tracking-widest text-amber-500 font-bold font-mono">step one</span>
                  <h2 className="text-xl font-serif font-bold text-white tracking-tight">Review Suite Calendar Dates</h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase text-slate-400 tracking-wider font-bold">Check-In Arrival</label>
                    <input
                      type="date"
                      value={checkIn}
                      onChange={(e) => setCheckIn(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 focus:border-amber-500 rounded-xl py-3 px-4 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-500 backdrop-blur-md transition-all font-semibold"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase text-slate-400 tracking-wider font-bold">Check-Out Departure</label>
                    <input
                      type="date"
                      value={checkOut}
                      onChange={(e) => setCheckOut(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 focus:border-amber-500 rounded-xl py-3 px-4 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-500 backdrop-blur-md transition-all font-semibold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 border-t border-white/10 pt-6">
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase text-slate-400 tracking-wider font-bold">Adults (Age 18+)</label>
                    <select
                      value={adults}
                      onChange={(e) => setAdults(Number(e.target.value))}
                      className="w-full bg-white/5 border border-white/10 focus:border-amber-500 rounded-xl py-3 px-4 text-xs text-white focus:outline-none backdrop-blur-md transition-all"
                    >
                      {[1, 2, 3, 4, 5, 6].map(n => <option key={n} value={n}>{n} Guests</option>)}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase text-slate-400 tracking-wider font-bold">Children</label>
                    <select
                      value={children}
                      onChange={(e) => setChildren(Number(e.target.value))}
                      className="w-full bg-white/5 border border-white/10 focus:border-amber-500 rounded-xl py-3 px-4 text-xs text-white focus:outline-none backdrop-blur-md transition-all"
                    >
                      {[0, 1, 2, 3].map(n => <option key={n} value={n}>{n} Children</option>)}
                    </select>
                  </div>
                </div>

                <div className="pt-6 border-t border-white/10 flex justify-end">
                  <button
                    onClick={() => setStep(2)}
                    className="bg-amber-600 hover:bg-amber-500 text-white text-[10px] uppercase tracking-widest font-bold px-6 py-3 rounded-xl transition-all cursor-pointer flex items-center space-x-1.5"
                  >
                    <span>Proceed to Guest Details</span>
                    <span>→</span>
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: GUEST INFORMATION */}
            {step === 2 && (
              <div className="space-y-6">
                <div className="space-y-1">
                  <span className="text-[10px] uppercase tracking-widest text-amber-500 font-bold font-mono">step two</span>
                  <h2 className="text-xl font-serif font-bold text-white tracking-tight">Privileged Guest Details</h2>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase text-slate-400 tracking-wider font-bold">Full Guest Name</label>
                    <input
                      type="text"
                      value={guestName}
                      onChange={(e) => setGuestName(e.target.value)}
                      placeholder="e.g. Charlotte Dupont"
                      className="w-full bg-white/5 border border-white/10 focus:border-amber-500 rounded-xl py-3 px-4 text-xs text-white focus:outline-none backdrop-blur-md font-semibold"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase text-slate-400 tracking-wider font-bold">Email Address</label>
                      <input
                        type="email"
                        value={guestEmail}
                        onChange={(e) => setGuestEmail(e.target.value)}
                        placeholder="e.g. user@hotel.com"
                        className="w-full bg-white/5 border border-white/10 focus:border-amber-500 rounded-xl py-3 px-4 text-xs text-white focus:outline-none backdrop-blur-md font-semibold"
                        required
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase text-slate-400 tracking-wider font-bold">Contact Phone Number</label>
                      <input
                        type="tel"
                        value={guestPhone}
                        onChange={(e) => setGuestPhone(e.target.value)}
                        placeholder="e.g. +33 6 1234 5678"
                        className="w-full bg-white/5 border border-white/10 focus:border-amber-500 rounded-xl py-3 px-4 text-xs text-white focus:outline-none backdrop-blur-md font-semibold"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5 pt-2">
                    <label className="text-[10px] uppercase text-slate-400 tracking-wider font-bold">Special Requests (Optional)</label>
                    <textarea
                      rows={3}
                      value={specialRequests}
                      onChange={(e) => setSpecialRequests(e.target.value)}
                      placeholder="Pillow options, vintage champagne preferences, dietary warnings..."
                      className="w-full bg-white/5 border border-white/10 focus:border-amber-500 rounded-xl py-2 px-3 text-xs text-white placeholder-slate-500 focus:outline-none backdrop-blur-sm transition-colors"
                    />
                  </div>
                </div>

                <div className="pt-6 border-t border-white/10 flex justify-between">
                  <button onClick={() => setStep(1)} className="text-slate-400 hover:text-white text-[10px] font-bold uppercase tracking-widest">
                    Back
                  </button>
                  <button
                    onClick={() => {
                      if (!guestName || !guestEmail) {
                        alert("Please provide name and email for guest records.");
                        return;
                      }
                      setStep(3);
                    }}
                    className="bg-amber-600 hover:bg-amber-500 text-white text-[10px] uppercase tracking-widest font-bold px-6 py-3 rounded-xl transition-all cursor-pointer flex items-center space-x-1.5"
                  >
                    <span>Proceed to Billing</span>
                    <span>→</span>
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: BILLING & PAYMENT GATEWAYS */}
            {step === 3 && (
              <form onSubmit={handleCompleteBooking} className="space-y-6">
                <div className="space-y-1">
                  <span className="text-[10px] uppercase tracking-widest text-amber-500 font-bold font-mono">step three</span>
                  <h2 className="text-xl font-serif font-bold text-white tracking-tight">Privileged Billing Gateway</h2>
                </div>

                {/* Privilege Code Input */}
                <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-3 backdrop-blur-md">
                  <p className="text-[9px] uppercase tracking-widest text-amber-500 font-bold flex items-center space-x-1">
                    <Gift className="w-3.5 h-3.5 text-amber-500" />
                    <span>Apply Privilege Code</span>
                  </p>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      placeholder="WELCOME10, SUMMER25"
                      className="flex-grow bg-white/5 border border-white/10 focus:border-amber-500 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none font-mono uppercase backdrop-blur-sm"
                    />
                    <button
                      type="button"
                      onClick={handleApplyCoupon}
                      className="bg-white/5 hover:bg-white/15 border border-white/10 text-slate-300 hover:text-white text-[10px] uppercase tracking-widest font-bold px-4 py-2 rounded-lg cursor-pointer backdrop-blur-sm transition-all"
                    >
                      Verify
                    </button>
                  </div>
                  {appliedCoupon && (
                    <p className="text-[10px] text-emerald-400 font-mono">
                      ✓ Coupon Applied: {appliedCoupon.code} ({appliedCoupon.discountType === 'percent' ? `${appliedCoupon.value}%` : `$${appliedCoupon.value}`} privilege discount).
                    </p>
                  )}
                  {couponError && (
                    <p className="text-[10px] text-rose-400 font-mono">✗ {couponError}</p>
                  )}
                </div>

                {/* Payment Methods */}
                <div className="space-y-3">
                  <label className="text-[10px] uppercase text-slate-400 tracking-wider font-bold">Billing Gateway Method</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod("card")}
                      className={`py-3.5 px-4 rounded-xl border text-xs font-bold transition-all flex items-center justify-center space-x-2 cursor-pointer ${
                        paymentMethod === "card"
                          ? "bg-amber-600/10 border-amber-500 text-amber-400"
                          : "bg-white/5 border-white/10 text-slate-400 hover:text-white hover:bg-white/10"
                      }`}
                    >
                      <CreditCard className="w-4 h-4" />
                      <span>Credit / Debit Card</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod("arrival")}
                      className={`py-3.5 px-4 rounded-xl border text-xs font-bold transition-all flex items-center justify-center space-x-2 cursor-pointer ${
                        paymentMethod === "arrival"
                          ? "bg-amber-600/10 border-amber-500 text-amber-400"
                          : "bg-white/5 border-white/10 text-slate-400 hover:text-white hover:bg-white/10"
                      }`}
                    >
                      <span>Cash on Arrival</span>
                    </button>
                  </div>
                </div>

                {/* Card input details if Card selected */}
                {paymentMethod === "card" && (
                  <div className="space-y-4 bg-white/5 border border-white/10 p-4 rounded-xl animate-fade-in backdrop-blur-md">
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase text-slate-500 font-bold">16-Digit Card Number</label>
                      <input
                        type="text"
                        value={cardNo}
                        onChange={(e) => setCardNo(e.target.value.replace(/\D/g, "").slice(0,16))}
                        placeholder="4111 2222 3333 4444"
                        className="w-full bg-white/5 border border-white/10 focus:border-amber-500 rounded-lg py-2 px-3.5 text-xs text-white focus:outline-none font-mono backdrop-blur-sm"
                        required={paymentMethod === "card"}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] uppercase text-slate-500 font-bold">Expiration Date</label>
                        <input
                          type="text"
                          value={cardExp}
                          onChange={(e) => setCardExp(e.target.value.slice(0,5))}
                          placeholder="MM/YY"
                          className="w-full bg-white/5 border border-white/10 focus:border-amber-500 rounded-lg py-2 px-3.5 text-xs text-white focus:outline-none font-mono backdrop-blur-sm"
                          required={paymentMethod === "card"}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] uppercase text-slate-500 font-bold">CVV Security Code</label>
                        <input
                          type="password"
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, "").slice(0,3))}
                          placeholder="•••"
                          className="w-full bg-white/5 border border-white/10 focus:border-amber-500 rounded-lg py-2 px-3.5 text-xs text-white focus:outline-none font-mono backdrop-blur-sm"
                          required={paymentMethod === "card"}
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div className="pt-6 border-t border-white/10 flex justify-between">
                  <button type="button" onClick={() => setStep(2)} className="text-slate-400 hover:text-white text-[10px] font-bold uppercase tracking-widest">
                    Back
                  </button>
                  <button
                    type="submit"
                    className="bg-amber-600 hover:bg-amber-500 text-white text-[10px] uppercase tracking-widest font-bold px-6 py-3 rounded-xl transition-all cursor-pointer flex items-center space-x-1.5"
                    id="complete-booking-btn"
                  >
                    <span>Complete Reservation</span>
                    <span>✓</span>
                  </button>
                </div>
              </form>
            )}

            {/* STEP 4: SUCCESS CONFIRMATION & PRINTABLE INVOICE */}
            {step === 4 && confirmedBooking && (
              <div className="space-y-8 animate-fade-in text-center py-6">
                
                {/* Success Banner */}
                <div className="space-y-3">
                  <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto text-2xl">
                    ✓
                  </div>
                  <h2 className="text-2xl font-serif font-bold text-white tracking-tight">Suite Successfully Reserved</h2>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
                    A luxurious greeting packet and itinerary outline have been logged to your guest profile. We look forward to your arrival.
                  </p>
                </div>

                {/* Visual Invoice Frame */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-left space-y-4 font-sans text-xs backdrop-blur-md shadow-2xl" id="invoice-printable">
                  <div className="flex justify-between items-center border-b border-white/10 pb-3">
                    <div>
                      <span className="text-[10px] uppercase tracking-widest text-amber-500 font-bold font-mono">WORLDORA STAY</span>
                      <p className="text-[9px] text-slate-500">RESORT REGISTRY RECEIPT</p>
                    </div>
                    <div className="text-right font-mono">
                      <span className="block font-bold text-white uppercase">ID: {confirmedBooking.id}</span>
                      <span className="text-[9px] text-slate-500">{new Date(confirmedBooking.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-xs font-sans">
                    <div>
                      <span className="block text-slate-500 text-[8px] uppercase font-bold tracking-widest">Reserved For</span>
                      <p className="text-slate-300 font-semibold">{confirmedBooking.guestName}</p>
                      <p className="text-slate-400 text-[10px]">{confirmedBooking.guestEmail}</p>
                    </div>
                    <div>
                      <span className="block text-slate-500 text-[8px] uppercase font-bold tracking-widest">Resort Location</span>
                      <p className="text-slate-300 font-semibold">{hotel.name}</p>
                      <p className="text-slate-400 text-[10px]">{hotel.city}, {hotel.country}</p>
                    </div>
                    <div>
                      <span className="block text-slate-500 text-[8px] uppercase font-bold tracking-widest">Suite Tier</span>
                      <p className="text-slate-300 font-semibold">{room.name}</p>
                    </div>
                    <div>
                      <span className="block text-slate-500 text-[8px] uppercase font-bold tracking-widest">Date Span</span>
                      <p className="text-slate-300 font-mono font-semibold">{checkIn} to {checkOut}</p>
                      <p className="text-slate-400 text-[10px]">({totalNights} standard nights)</p>
                    </div>
                  </div>

                  <div className="border-t border-white/10 pt-4 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Base Room Total</span>
                      <span className="font-semibold text-slate-300">${basePriceSum}</span>
                    </div>
                    {discountAmount > 0 && (
                      <div className="flex justify-between text-emerald-400 font-mono">
                        <span>Privilege Discount ({appliedCoupon?.code})</span>
                        <span>-${discountAmount}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-slate-500">Luxury Surcharge (10%)</span>
                      <span className="font-semibold text-slate-300">${luxuryTax}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Subterranean Wellness Fee</span>
                      <span className="font-semibold text-slate-300">${wellnessServiceCharge}</span>
                    </div>
                    <div className="flex justify-between border-t border-white/10 pt-3 text-sm">
                      <span className="font-bold text-white uppercase font-serif">Grand Billing Total</span>
                      <span className="font-serif font-black text-amber-500">${grandTotal}</span>
                    </div>
                  </div>
                </div>

                {/* Invoice Actions */}
                <div className="flex justify-center space-x-3 pt-4 border-t border-white/10">
                  <button
                    onClick={handlePrint}
                    className="bg-white/5 hover:bg-white/15 border border-white/10 text-slate-200 text-[10px] uppercase tracking-widest font-bold px-5 py-3 rounded-xl flex items-center space-x-2 cursor-pointer backdrop-blur-sm transition-all"
                  >
                    <Printer className="w-4 h-4 text-amber-500" />
                    <span>Print Receipt</span>
                  </button>
                  <button
                    onClick={() => setRoute("dashboard")}
                    className="bg-amber-600 hover:bg-amber-500 text-white text-[10px] uppercase tracking-widest font-bold px-5 py-3 rounded-xl cursor-pointer"
                  >
                    Manage My Bookings
                  </button>
                </div>

              </div>
            )}

          </div>

          {/* RIGHT: Dynamic Invoice Breakdown Panel */}
          <div className="lg:col-span-5 space-y-6">
            <h2 className="text-xl font-serif text-white tracking-tight border-b border-white/10 pb-3">Selection Statement</h2>
            
            <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 space-y-5 shadow-2xl">
              {/* Hotel Box */}
              <div className="flex items-center space-x-3.5 border-b border-white/10 pb-4">
                <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-white/10">
                  <img src={hotel.image} alt={hotel.name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h4 className="text-xs font-serif font-bold text-white uppercase tracking-wider">{hotel.name}</h4>
                  <p className="text-[10px] text-slate-500">{hotel.city}, {hotel.country}</p>
                </div>
              </div>

              {/* Room Box */}
              <div className="flex items-center space-x-3.5 border-b border-white/10 pb-4">
                <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-white/10">
                  <img src={room.images[0] || hotel.image} alt={room.name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-300">{room.name}</h4>
                  <p className="text-[10px] text-slate-500">{room.bedType} • {room.size}</p>
                </div>
              </div>

              {/* Dynamic Bill Items */}
              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Suite Rate (${room.price} x {totalNights} nights)</span>
                  <span className="font-semibold text-slate-200">${basePriceSum}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Privilege Discount ({appliedCoupon?.code})</span>
                    <span>-${discountAmount}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-slate-400">Luxury Taxes (10%)</span>
                  <span className="font-semibold text-slate-200">${luxuryTax}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Wellness Sanctuary Charge</span>
                  <span className="font-semibold text-slate-200">${wellnessServiceCharge}</span>
                </div>
                <div className="flex justify-between border-t border-white/10 pt-3 text-sm">
                  <span className="font-bold text-white uppercase font-serif">Estimated Total</span>
                  <span className="font-serif font-black text-amber-500">${grandTotal}</span>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
