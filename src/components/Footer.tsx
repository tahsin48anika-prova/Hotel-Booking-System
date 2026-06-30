/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { Mail, Phone, MapPin, Send, Facebook, Instagram, Twitter, Linkedin, Sparkles } from "lucide-react";

export default function Footer() {
  const { settings, setRoute, subscribeNewsletter } = useApp();
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    const ok = await subscribeNewsletter(email);
    if (ok) {
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 5000);
    }
  };

  return (
    <footer className="backdrop-blur-md bg-white/5 border-t border-white/10 text-slate-300 font-sans relative">
      {/* Decorative Golden Line */}
      <div className="h-0.5 bg-gradient-to-r from-amber-600 via-yellow-400 to-amber-600"></div>
      
      {/* Upper Newsletter Section */}
      <div className="border-b border-white/10 py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-2">
            <h3 className="text-xl font-serif text-white flex items-center space-x-2 font-semibold">
              <Sparkles className="w-5 h-5 text-amber-500" />
              <span>Join the Private Luxury Registry</span>
            </h3>
            <p className="text-xs text-slate-400 max-w-xl">
              Subscribe to unlock privileged rates, seasonal invitations to private island takeovers, and elite travel intelligence curated directly by our global Clefs d'Or concierges.
            </p>
          </div>
          <div className="lg:col-span-5">
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-grow">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your esteemed email address"
                  className="w-full bg-white/5 border border-white/10 focus:border-amber-500 rounded-lg py-2.5 pl-4 pr-10 text-xs text-white placeholder-slate-500 focus:outline-none backdrop-blur-sm transition-colors"
                  required
                />
                <Mail className="absolute right-3 top-3 w-4 h-4 text-slate-500" />
              </div>
              <button
                type="submit"
                className="bg-amber-600 hover:bg-amber-500 hover:scale-[1.02] text-white text-xs font-bold px-6 py-2.5 rounded-lg flex items-center justify-center space-x-2 uppercase tracking-widest transition-all cursor-pointer shadow-lg shadow-amber-600/10"
              >
                <span>{subscribed ? "Subscribed" : "Subscribe"}</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
            {subscribed && (
              <p className="text-[10px] text-amber-400 font-mono mt-2 animate-fade-in text-right">
                ✓ Your email has been registered into our private elite list.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
        {/* Brand Summary */}
        <div className="lg:col-span-4 space-y-4">
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => setRoute("home")}>
            <div className="w-9 h-9 rounded bg-gradient-to-tr from-amber-600 to-amber-400 flex items-center justify-center font-serif text-white font-bold text-md shadow">
              L
            </div>
            <div>
              <span className="font-serif text-md tracking-widest text-white block uppercase font-bold">
                {settings.logoText}
              </span>
              <span className="text-[8px] tracking-widest text-amber-500 block">
                HAUTE HOSPITALITY
              </span>
            </div>
          </div>
          <p className="text-xs leading-relaxed text-slate-400 max-w-sm">
            {settings.footerText}
          </p>
          <div className="flex items-center space-x-3 pt-2">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:border-amber-500 hover:bg-amber-600/10 transition-all">
              <Facebook className="w-3.5 h-3.5" />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:border-amber-500 hover:bg-amber-600/10 transition-all">
              <Instagram className="w-3.5 h-3.5" />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:border-amber-500 hover:bg-amber-600/10 transition-all">
              <Twitter className="w-3.5 h-3.5" />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:border-amber-500 hover:bg-amber-600/10 transition-all">
              <Linkedin className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Quick Nav */}
        <div className="lg:col-span-2 space-y-3">
          <h4 className="text-xs uppercase tracking-widest font-bold text-white">Explore</h4>
          <ul className="space-y-2 text-xs">
            {["Home", "hotels", "services", "blog", "about"].map((tab) => (
              <li key={tab}>
                <button
                  onClick={() => setRoute(tab)}
                  className="hover:text-amber-400 hover:underline capitalize text-left transition-colors cursor-pointer"
                >
                  {tab === "hotels" ? "Luxury Hotels" : tab === "services" ? "Resort Services" : tab === "blog" ? "Travel Journal" : tab}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Categories */}
        <div className="lg:col-span-3 space-y-3">
          <h4 className="text-xs uppercase tracking-widest font-bold text-white">Elite Destinations</h4>
          <ul className="space-y-2 text-xs text-slate-400">
            <li><button onClick={() => setRoute("hotels")} className="hover:text-amber-400">Parisian Landmarks — Paris</button></li>
            <li><button onClick={() => setRoute("hotels")} className="hover:text-amber-400">Jungle Sanctuaries — Bali</button></li>
            <li><button onClick={() => setRoute("hotels")} className="hover:text-amber-400">Metropolitan Penthouse — New York</button></li>
            <li><button onClick={() => setRoute("hotels")} className="hover:text-amber-400">Secluded Peninsula Reserves — Dubai</button></li>
            <li><button onClick={() => setRoute("hotels")} className="hover:text-amber-400">Sunset Volcanic Cliffs — Santorini</button></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className="lg:col-span-3 space-y-3">
          <h4 className="text-xs uppercase tracking-widest font-bold text-white">Guest Concierge</h4>
          <ul className="space-y-3 text-xs">
            <li className="flex items-start space-x-2">
              <MapPin className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <span className="leading-relaxed">{settings.contactAddress}</span>
            </li>
            <li className="flex items-center space-x-2">
              <Phone className="w-4 h-4 text-amber-500 shrink-0" />
              <span>{settings.contactPhone}</span>
            </li>
            <li className="flex items-center space-x-2">
              <Mail className="w-4 h-4 text-amber-500 shrink-0" />
              <span className="truncate">{settings.contactEmail}</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Sub Footer with Copyright & Download Placeholders */}
      <div className="border-t border-white/10 bg-white/[0.02] backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-center md:text-left space-y-1">
            <p className="text-[10px] tracking-wide">
              © 2026 {settings.brandName}. All rights and privileges reserved. Made in harmony with global luxury standards.
            </p>
            <div className="flex justify-center md:justify-start space-x-4 text-[9px] text-slate-500">
              <button onClick={() => setRoute("privacy")} className="hover:underline hover:text-amber-500">Privacy Policy</button>
              <span>•</span>
              <button onClick={() => setRoute("terms")} className="hover:underline hover:text-amber-500">Terms & Conditions</button>
              <span>•</span>
              <button onClick={() => setRoute("refund")} className="hover:underline hover:text-amber-500">Refund Policy</button>
            </div>
          </div>
          
          {/* App Download Mock Badges */}
          <div className="flex items-center space-x-2.5">
            <div className="bg-white/5 border border-white/10 rounded px-2.5 py-1 flex items-center space-x-1.5 cursor-not-allowed">
              <div className="font-serif font-black text-amber-500 text-xs">A</div>
              <div>
                <span className="block text-[7px] text-slate-500 uppercase leading-none">Download on the</span>
                <span className="block text-[9px] text-slate-200 font-semibold leading-none">App Store</span>
              </div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded px-2.5 py-1 flex items-center space-x-1.5 cursor-not-allowed">
              <div className="font-sans font-black text-amber-500 text-xs">G</div>
              <div>
                <span className="block text-[7px] text-slate-500 uppercase leading-none">Get it on</span>
                <span className="block text-[9px] text-slate-200 font-semibold leading-none">Google Play</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
