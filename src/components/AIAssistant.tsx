/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from "react";
import { MessageSquare, X, Send, Sparkles, Compass, HelpCircle } from "lucide-react";
import { useApp } from "../context/AppContext";

interface ChatMessage {
  sender: 'user' | 'concierge';
  text: string;
  time: string;
}

export default function AIAssistant() {
  const { selectHotel, setRoute } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      sender: 'concierge',
      text: "Good day, esteemed traveler. I am your personal Worldora Concierge. I am delighted to assist you with bespoke property recommendations, curated regional excursions, private flight scheduling placeholders, or custom-tailored gastronomic itineraries. What refined experience may I help craft for you today?",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isTyping]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim()) return;
    
    const userMsg: ChatMessage = {
      sender: 'user',
      text: textToSend,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setMessages(prev => [...prev, userMsg]);
    setInputValue("");
    setIsTyping(true);

    try {
      // Build history payload for context
      const history = messages.map(m => ({
        role: m.sender === 'user' ? 'user' : 'model',
        text: m.text
      }));

      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: textToSend, history })
      });
      const data = await response.json();
      
      const conciergeMsg: ChatMessage = {
        sender: 'concierge',
        text: data.text || "I apologize, but my connection to the grand directory has fluctuated. How else may I serve you?",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      
      setMessages(prev => [...prev, conciergeMsg]);
    } catch (err) {
      console.error("AI assistant error:", err);
      // Fallback
      setMessages(prev => [...prev, {
        sender: 'concierge',
        text: "My apologies, esteemed guest. A digital interruption has occurred, but please rest assured that our human team is ready to serve you. You may check our 'Luxury Properties' tab to explore our world-class accommodations immediately.",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const samplePrompts = [
    { text: "Paris luxury experience", label: "Paris Guide" },
    { text: "Best wellness villa in Bali", label: "Bali Wellness" },
    { text: "Any active promo codes?", label: "Offers" },
    { text: "Activities in Dubai Reserve", label: "Dubai Excursions" }
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      {/* Floating Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="backdrop-blur-md bg-white/10 hover:bg-white/20 text-white rounded-full p-4 shadow-2xl border border-white/20 hover:border-amber-400 group flex items-center space-x-2 transition-all duration-300 transform hover:scale-105 cursor-pointer shadow-amber-500/10"
          id="ai-assistant-toggle"
        >
          <div className="relative">
            <MessageSquare className="w-6 h-6 text-amber-500 group-hover:rotate-12 transition-transform duration-300" />
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
            </span>
          </div>
          <span className="text-xs font-serif font-bold tracking-wider uppercase text-amber-100 hidden sm:inline-block pr-1">
            Worldora Concierge
          </span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div 
          className="backdrop-blur-xl bg-slate-950/70 border border-white/10 rounded-2xl w-[90vw] sm:w-[400px] h-[550px] shadow-2xl flex flex-col overflow-hidden animate-slide-in relative"
          id="ai-assistant-panel"
        >
          {/* Header */}
          <div className="bg-white/5 border-b border-white/10 px-4 py-3.5 flex justify-between items-center backdrop-blur-md">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-amber-500" />
              </div>
              <div>
                <h4 className="text-xs font-serif font-bold text-white uppercase tracking-wider">Worldora Concierge</h4>
                <div className="flex items-center space-x-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span className="text-[9px] text-slate-500 uppercase tracking-widest font-mono">Generative Intelligence</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-slate-900"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages Container */}
          <div className="flex-grow p-4 overflow-y-auto space-y-4 bg-transparent">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-xs leading-relaxed shadow-sm ${
                    msg.sender === 'user'
                      ? 'bg-amber-600 text-white rounded-br-none'
                      : 'bg-white/10 border border-white/10 text-slate-200 rounded-bl-none font-sans'
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.text}</p>
                  <span className="block text-[8px] mt-1 opacity-50 text-right font-mono">
                    {msg.time}
                  </span>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white/10 border border-white/10 rounded-2xl rounded-bl-none px-4 py-3 flex items-center space-x-1">
                  <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                  <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                  <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Preset Prompts Row */}
          {messages.length === 1 && (
            <div className="px-4 pb-2 pt-1 border-t border-white/10 bg-white/5 backdrop-blur-sm">
              <p className="text-[9px] text-slate-500 uppercase tracking-widest font-semibold mb-1.5 flex items-center space-x-1">
                <HelpCircle className="w-3 h-3 text-amber-500" />
                <span>Suggested Dialogues</span>
              </p>
              <div className="flex flex-wrap gap-1.5">
                {samplePrompts.map((p, i) => (
                  <button
                    key={i}
                    onClick={() => handleSendMessage(p.text)}
                    className="bg-white/5 hover:bg-white/10 border border-white/10 hover:border-amber-500/40 text-[10px] text-slate-300 hover:text-white rounded-lg px-2 py-1 transition-all cursor-pointer flex items-center space-x-1"
                  >
                    <Compass className="w-2.5 h-2.5 text-amber-500" />
                    <span>{p.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Form Input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage(inputValue);
            }}
            className="p-3 border-t border-white/10 bg-white/5 backdrop-blur-sm flex items-center space-x-2"
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask for custom luxury itineraries..."
              className="flex-grow bg-white/5 border border-white/10 focus:border-amber-500 rounded-xl px-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none backdrop-blur-sm transition-colors"
              id="ai-assistant-input"
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || isTyping}
              className="bg-amber-600 hover:bg-amber-500 disabled:opacity-40 text-white p-2 rounded-xl transition-all shadow cursor-pointer shrink-0"
              id="ai-assistant-send"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
