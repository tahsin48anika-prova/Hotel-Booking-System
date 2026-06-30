/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { ShieldCheck, HelpCircle } from "lucide-react";

export default function PrivacyView() {
  return (
    <div className="bg-slate-950 text-slate-100 font-sans min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 animate-fade-in">
        
        {/* Title */}
        <div className="text-center space-y-2 border-b border-slate-900 pb-8">
          <ShieldCheck className="w-12 h-12 text-amber-500 mx-auto" />
          <h1 className="text-3xl font-serif font-bold text-white tracking-tight">Privileged Privacy & Terms Statement</h1>
          <p className="text-xs text-slate-400">Published June 2026 • Secure SSL & GDPR compliant framework.</p>
        </div>

        {/* Policies Content */}
        <div className="space-y-8 text-xs text-slate-400 leading-relaxed font-sans">
          
          <div className="space-y-2">
            <h3 className="text-sm uppercase tracking-wider text-white font-bold font-serif">1. Discretion & Profile Sanitization</h3>
            <p>
              We prioritize the visual isolation of our guests above all else. Any registration, check-in history, credit receipt, or special request is encrypted and stored in our secure JSON databases. Under GDPR rules, guests maintain total authority to permanently delete their profiles and associated booking histories at any time using the dashboard command.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm uppercase tracking-wider text-white font-bold font-serif">2. Privileged Booking & Cancellation Policies</h3>
            <p>
              Our rates are negotiated directly with resort owners to ensure absolute parity. Cancellations must be made at least 48 hours prior to the standard check-in hour (3:00 PM) to bypass transaction penalties. Late cancellations or missed check-ins incur a single nightly suite charge.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm uppercase tracking-wider text-white font-bold font-serif">3. Subterranean Wellness Code of Conduct</h3>
            <p>
              Access to resort thermal baths, Ayurvedic treatment chambers, and volcanic springs is reserved exclusively for registered premium guests. Complete visual isolation must be respected: cameras, video logs, and recording instruments are strictly forbidden within the gated spa perimeter to safeguard mutual luxury.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm uppercase tracking-wider text-white font-bold font-serif">4. Third-Party Integrations</h3>
            <p>
              Our on-demand Travel Assistant is backed by advanced large language modeling capabilities (Gemini API) processed server-side. Rest assured that no guest-identifiable metrics, billing records, or addresses are ever transmitted to external nodes; prompts are anonymized to maintain clean compliance.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}
