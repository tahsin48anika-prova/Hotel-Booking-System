/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Award, ShieldCheck, Heart, Sparkles } from "lucide-react";

export default function AboutView() {
  const pillars = [
    {
      icon: <Award className="w-6 h-6 text-amber-500" />,
      title: "Haute Craftsmanship",
      desc: "Every hotel in our portfolio is audited on a 120-point index covering mattress elasticity, ambient acoustics, and organic gastronomic ingredients."
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-amber-500" />,
      title: "Absolute Discretion",
      desc: "We understand the demands of public lives. All guest registrations are protected by enterprise-grade cryptographic logs and secure access pathways."
    },
    {
      icon: <Heart className="w-6 h-6 text-amber-500" />,
      title: "Generational Hospitality",
      desc: "We believe in deep connection over quick stays. Our private registry members receive life-long privileges, vintage anniversary bottles, and custom butler settings."
    }
  ];

  const leaders = [
    { name: "Sir Alistair Sinclair", role: "Chief Executive & Chairman", image: "https://picsum.photos/seed/sir_ali/400/400" },
    { name: "Lady Genevieve Moreau", role: "Director of Haute Curation", image: "https://picsum.photos/seed/lady_gen/400/400" },
    { name: "Master Sommelier Henri Laurent", role: "Head of Wine & Gastronomy", image: "https://picsum.photos/seed/henri_somm/400/400" }
  ];

  return (
    <div className="bg-slate-950 text-slate-100 font-sans">
      {/* Editorial Header */}
      <section className="relative py-24 px-4 sm:px-6 lg:px-8 border-b border-slate-900 overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-15">
          <img src="https://picsum.photos/seed/about_bg/1920/1080" alt="Resort Lounge" className="w-full h-full object-cover filter blur-sm" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-4">
          <span className="text-[10px] uppercase tracking-widest text-amber-500 font-mono font-bold flex items-center justify-center space-x-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>The Heritage Trilogy</span>
          </span>
          <h1 className="text-4xl sm:text-5xl font-serif font-bold tracking-tight text-white">Curators of Pure Solace</h1>
          <p className="text-xs text-slate-400 max-w-2xl mx-auto leading-relaxed pt-2">
            Since our inception in Paris in 1994, our focus has been unyielding: to establish a secret registry of five-star sanctuaries that shield you from the acceleration of the modern world.
          </p>
        </div>
      </section>

      {/* Narrative Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
        <div className="md:col-span-7 space-y-6">
          <h2 className="text-2xl font-serif text-white tracking-tight">Our Sacred Promise</h2>
          <p className="text-xs text-slate-400 leading-relaxed font-sans">
            We began not as a booking engine, but as an intimate network of private estate owners who sought to share their sanctuaries with selected friends. Over decades, this catalog blossomed into an international standard of luxury.
          </p>
          <p className="text-xs text-slate-400 leading-relaxed font-sans">
            We reject the clinical mass-market approach. When you book a suite through the Hotel Booking System, you do not simply reserve a bedroom. You secure a masterfully choreographed experience—from the custom lighting parameters calibrated to your Circadian rhythms to the bespoke mineral density of your personal cave pool.
          </p>
        </div>
        <div className="md:col-span-5 relative group overflow-hidden rounded-2xl border border-slate-900">
          <img src="https://picsum.photos/seed/narrative/600/800" alt="Vintage Wine Cellar" className="w-full h-72 md:h-[400px] object-cover group-hover:scale-105 transition-transform duration-500" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 to-transparent"></div>
        </div>
      </section>

      {/* Pillars Grid */}
      <section className="bg-slate-900/40 border-y border-slate-900 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto space-y-16">
          <div className="text-center space-y-2">
            <span className="text-[10px] text-amber-500 font-mono font-bold uppercase tracking-widest">Our Ideology</span>
            <h3 className="text-2xl font-serif text-white">Three Inviolable Pillars</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pillars.map((p, idx) => (
              <div key={idx} className="bg-slate-950 border border-slate-900 p-8 rounded-2xl space-y-4 hover:border-amber-500/20 transition-all duration-300">
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                  {p.icon}
                </div>
                <h4 className="text-sm font-serif font-bold text-white uppercase tracking-wider">{p.title}</h4>
                <p className="text-xs text-slate-400 leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership Team */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-16">
        <div className="text-center space-y-2">
          <span className="text-[10px] text-amber-500 font-mono font-bold uppercase tracking-widest">The Council</span>
          <h3 className="text-2xl font-serif text-white">Elite Curation Council</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Our properties are continuously vetted under the rigorous direction of our experienced, hospitality-trained executive leadership.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {leaders.map((leader, i) => (
            <div key={i} className="text-center space-y-3 group">
              <div className="relative w-48 h-48 rounded-full overflow-hidden mx-auto border border-slate-800 group-hover:border-amber-500/40 transition-colors duration-300">
                <img src={leader.image} alt={leader.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              </div>
              <div>
                <h4 className="text-sm font-serif font-bold text-white tracking-wide">{leader.name}</h4>
                <p className="text-[10px] text-amber-500 uppercase tracking-widest font-mono font-medium">{leader.role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
