/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Coffee, Map, Activity, ShieldAlert, CheckCircle, FlameKindling, Compass } from "lucide-react";

export default function ServicesView() {
  const [inquirySent, setInquirySent] = useState(false);
  const [selectedService, setSelectedService] = useState("Spa Treatment Sessions");

  const list = [
    { title: "Subterranean Spa Paths", desc: "Ayurvedic thermal chambers, basalt rock saunas, mineral float baths, and custom dosha mapping therapies.", icon: <FlameKindling className="w-5 h-5 text-amber-500" /> },
    { title: "Fine Michelin Dining", desc: "Bespoke tables curated by Master Chefs, wine vaults housing vintage reserves, and private sunset terraces.", icon: <Coffee className="w-5 h-5 text-amber-500" /> },
    { title: "Helicopter Transfer", desc: "Private runway helipad coordinates direct to resort wings, bypassing all metropolitan transit lanes.", icon: <Activity className="w-5 h-5 text-amber-500" /> },
    { title: "Yacht Sightseeing", desc: "Fully crewed private charters for coastal caldera exploration, marine fishing, or twilight wine tasting.", icon: <Compass className="w-5 h-5 text-amber-500" /> }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setInquirySent(true);
    setTimeout(() => setInquirySent(false), 5000);
  };

  return (
    <div className="bg-transparent text-slate-100 font-sans py-12 min-h-screen relative z-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Page Title */}
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <p className="text-[10px] uppercase tracking-widest text-amber-500 font-mono font-bold">Resort Catalog</p>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-white tracking-tight">Privileged Excursions</h1>
          <p className="text-xs text-slate-400">
            Every booking unlocks access to our dedicated, private experience curators. Discover how we elevate simple travel to pure historical art.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6">
          {list.map((srv, i) => (
            <div key={i} className="backdrop-blur-md bg-white/5 border border-white/10 p-8 rounded-2xl flex items-start space-x-5 shadow-lg hover:border-white/20 hover:bg-white/10 transition-all duration-300">
              <div className="w-12 h-12 bg-amber-500/10 border border-amber-500/20 text-amber-500 rounded-xl flex items-center justify-center shrink-0">
                {srv.icon}
              </div>
              <div className="space-y-2">
                <h3 className="text-md font-serif font-bold text-white">{srv.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed font-sans">{srv.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Private Concierge Form */}
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 sm:p-10 max-w-2xl mx-auto shadow-2xl space-y-6">
          <div className="text-center space-y-1">
            <span className="text-[9px] uppercase tracking-widest text-amber-500 font-bold font-mono">bespoke arrangements</span>
            <h3 className="text-xl font-serif font-bold text-white">Privately Inquire</h3>
            <p className="text-xs text-slate-400">Our Chief Curators are ready to draft custom itineraries for your group.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[9px] uppercase tracking-widest text-slate-500 font-bold">Select Service</label>
                <select
                  value={selectedService}
                  onChange={(e) => setSelectedService(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 focus:border-amber-500 rounded-xl py-2.5 px-4 text-xs text-white focus:outline-none backdrop-blur-sm transition-colors [&>option]:bg-slate-900"
                >
                  <option>Spa Treatment Sessions</option>
                  <option>Private Helicopters</option>
                  <option>Michelin Room Reservations</option>
                  <option>Yacht Caldera Charters</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-[9px] uppercase tracking-widest text-slate-500 font-bold">Group Density</label>
                <select className="w-full bg-white/5 border border-white/10 focus:border-amber-500 rounded-xl py-2.5 px-4 text-xs text-white focus:outline-none backdrop-blur-sm transition-colors [&>option]:bg-slate-900">
                  <option>1 to 2 Guests</option>
                  <option>3 to 5 Guests</option>
                  <option>6 to 10 Guests</option>
                  <option>Complete Resort Buyout</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[9px] uppercase tracking-widest text-slate-500 font-bold">Desired Itinerary Frame</label>
              <textarea
                rows={3}
                placeholder="List dates, champagne vintages, helicopter coordinates, or massage preferences..."
                className="w-full bg-white/5 border border-white/10 focus:border-amber-500 rounded-xl py-2 px-3 text-xs text-white placeholder-slate-500 focus:outline-none backdrop-blur-sm transition-colors"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-amber-600 hover:bg-amber-500 text-white font-bold py-3 px-4 rounded-xl text-xs uppercase tracking-widest transition-all cursor-pointer shadow-lg shadow-amber-600/15"
            >
              Dispatch Inquiry Packet
            </button>
          </form>

          {inquirySent && (
            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 flex items-center space-x-3 text-emerald-400 text-xs font-sans">
              <CheckCircle className="w-5 h-5" />
              <span>✓ Privileged inquiry successfully routed. An elite curator will contact you in under 15 minutes.</span>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
