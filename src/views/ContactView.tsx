/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { Mail, Phone, MapPin, Send, CheckCircle2, Sparkles } from "lucide-react";

export default function ContactView() {
  const { settings, sendMessage } = useApp();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [subject, setSubject] = useState("Private Suite inquiry");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;

    const ok = await sendMessage({ name, email, phone, subject, message });
    if (ok) {
      setSent(true);
      setName("");
      setEmail("");
      setPhone("");
      setMessage("");
      setTimeout(() => setSent(false), 5000);
    }
  };

  return (
    <div className="bg-slate-950 text-slate-100 font-sans min-h-screen py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Page Title */}
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <p className="text-[10px] uppercase tracking-widest text-amber-500 font-mono font-bold">Inquiries & Correspondence</p>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-white tracking-tight">The Registry Concierge</h1>
          <p className="text-xs text-slate-400">
            For bespoke wedding bookings, whole resort takeovers, helicopter coordination, or vintage requests, please route an electronic message below.
          </p>
        </div>

        {/* Info Cards Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          
          <div className="bg-slate-900 border border-slate-850 p-6 rounded-2xl flex items-center space-x-4 shadow">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-500 flex items-center justify-center shrink-0">
              <Phone className="w-4.5 h-4.5" />
            </div>
            <div>
              <span className="block text-[8px] text-slate-500 uppercase tracking-widest font-mono">On-Call Telephone</span>
              <p className="text-xs text-slate-200 font-semibold">{settings.contactPhone}</p>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-850 p-6 rounded-2xl flex items-center space-x-4 shadow">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-500 flex items-center justify-center shrink-0">
              <Mail className="w-4.5 h-4.5" />
            </div>
            <div className="truncate">
              <span className="block text-[8px] text-slate-500 uppercase tracking-widest font-mono">Secure Email</span>
              <p className="text-xs text-slate-200 font-semibold truncate">{settings.contactEmail}</p>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-850 p-6 rounded-2xl flex items-center space-x-4 shadow">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-500 flex items-center justify-center shrink-0">
              <MapPin className="w-4.5 h-4.5" />
            </div>
            <div>
              <span className="block text-[8px] text-slate-500 uppercase tracking-widest font-mono">Headquarters Location</span>
              <p className="text-xs text-slate-200 font-semibold leading-normal truncate">{settings.contactAddress}</p>
            </div>
          </div>

        </div>

        {/* Form and Map Frame */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 pt-6 items-start">
          
          {/* Dispatch Message Form */}
          <form onSubmit={handleSubmit} className="lg:col-span-7 bg-slate-900 border border-slate-850 rounded-2xl p-6 sm:p-8 space-y-4 shadow-xl">
            <h3 className="text-xs uppercase tracking-widest text-white font-bold pb-2 border-b border-slate-850/60">Dispatch Private Message</h3>
            
            <div className="space-y-1.5">
              <label className="text-[9px] uppercase text-slate-500 font-bold">Your Esteemed Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Evelyn Sterling"
                className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl py-2.5 px-4 text-xs text-white placeholder-slate-600 focus:outline-none"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[9px] uppercase text-slate-500 font-bold">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. evelyn@sterling.co"
                  className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl py-2.5 px-4 text-xs text-white placeholder-slate-600 focus:outline-none"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[9px] uppercase text-slate-500 font-bold">Contact Phone (Optional)</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. +1 555 123 4567"
                  className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl py-2.5 px-4 text-xs text-white placeholder-slate-600 focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[9px] uppercase text-slate-500 font-bold">Subject of Correspondence</label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl py-2.5 px-4 text-xs text-white focus:outline-none"
              >
                <option>Private Suite Inquiry</option>
                <option>Bespoke Helicopter Transit</option>
                <option>Exclusive Resort Buyout Proposal</option>
                <option>Corporate Partnership Inquiries</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[9px] uppercase text-slate-500 font-bold">Message Details</label>
              <textarea
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Detail your request or desired custom itinerary preferences..."
                className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl py-2 px-3 text-xs text-white placeholder-slate-600 focus:outline-none transition-colors"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-amber-600 hover:bg-amber-500 text-white font-bold py-3 px-4 rounded-xl text-xs uppercase tracking-widest transition-all cursor-pointer flex items-center justify-center space-x-1.5"
            >
              <Send className="w-4 h-4" />
              <span>Dispatch Message Packet</span>
            </button>

            {sent && (
              <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 flex items-center space-x-2.5 text-emerald-400 text-xs animate-fade-in font-sans">
                <CheckCircle2 className="w-5 h-5 shrink-0" />
                <span>✓ Correspondence packet has been safely routed. A registry officer will follow up shortly.</span>
              </div>
            )}
          </form>

          {/* Editorial Map / Static image */}
          <div className="lg:col-span-5 space-y-6">
            <div className="relative rounded-2xl overflow-hidden h-[300px] border border-slate-900 shadow-xl">
              <img src="https://picsum.photos/seed/editorial_map/800/600" alt="Concierge Office" className="w-full h-full object-cover filter brightness-90" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>
              <div className="absolute bottom-5 left-5 space-y-1">
                <span className="text-[8px] uppercase tracking-widest text-amber-500 font-bold font-mono">paris headquarters</span>
                <p className="text-white font-serif font-bold text-sm">Place de la Concorde, Paris</p>
              </div>
            </div>

            {/* Support message */}
            <div className="bg-slate-900/40 border border-slate-850 rounded-2xl p-6 space-y-3">
              <h4 className="text-xs uppercase text-amber-500 font-bold tracking-widest flex items-center space-x-1">
                <Sparkles className="w-4.5 h-4.5" />
                <span>Clefs d'Or Standard</span>
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed font-sans">
                Our hospitality curators undergo intensive security clearance and training, adhering strictly to traditional Clefs d'Or standards of total visual privacy and discretion.
              </p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
