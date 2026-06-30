/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { useApp } from "../context/AppContext";
import { Menu, X, User as UserIcon, LogOut, Shield, Compass, Heart, Moon, Sun, DollarSign, Globe } from "lucide-react";

export default function Header() {
  const { 
    user, logout, quickLogin, currentRoute, setRoute, 
    settings, currency, setCurrency, language, setLanguage,
    darkMode, setDarkMode, wishlist
  } = useApp();
  
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", id: "home" },
    { name: "Luxury Properties", id: "hotels" },
    { name: "Exclusive Services", id: "services" },
    { name: "Travel Journal", id: "blog" },
    { name: "About Us", id: "about" },
    { name: "Contact", id: "contact" }
  ];

  return (
    <>
      {/* Simulation Helper Ribbon */}
      <div className="bg-white/5 border-b border-white/10 text-[11px] text-slate-300 py-1.5 px-4 flex justify-between items-center z-50 relative font-mono backdrop-blur-sm">
        <div className="hidden sm:flex items-center space-x-2">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>SYSTEM ONLINE • SECURE SSL CONNECTED</span>
        </div>
        <div className="flex items-center space-x-4 mx-auto sm:mx-0">
          <span>Explore system as:</span>
          <button 
            onClick={() => quickLogin("user")} 
            className="text-amber-500 hover:underline font-bold transition-all"
            id="quick-guest-login"
          >
            [ Guest Demo ]
          </button>
          <button 
            onClick={() => quickLogin("admin")} 
            className="text-cyan-400 hover:underline font-bold transition-all"
            id="quick-admin-login"
          >
            [ Admin CMS ]
          </button>
        </div>
      </div>

      <header 
        className={`sticky top-0 z-40 transition-all duration-300 backdrop-blur-md border-b border-white/10 ${
          scrolled 
            ? "bg-slate-950/70 shadow-lg py-3" 
            : "bg-white/5 py-4"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div 
              onClick={() => setRoute("home")} 
              className="flex items-center space-x-2 cursor-pointer group"
              id="header-brand-logo"
            >
              <div className="w-10 h-10 rounded-lg bg-gradient-to-tr from-amber-600 to-amber-400 flex items-center justify-center font-serif text-white font-bold text-lg shadow-md group-hover:scale-105 transition-transform duration-300">
                L
              </div>
              <div>
                <span className="font-serif text-lg tracking-widest text-white block font-semibold leading-tight uppercase group-hover:text-amber-400 transition-colors">
                  {settings.logoText}
                </span>
                <span className="text-[9px] tracking-widest text-amber-500 block uppercase">
                  HAUTE HOSPITALITY
                </span>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-7">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => setRoute(link.id)}
                  className={`text-xs uppercase tracking-widest font-medium transition-colors hover:text-amber-400 cursor-pointer ${
                    currentRoute === link.id ? "text-amber-500" : "text-slate-300"
                  }`}
                  id={`nav-link-${link.id}`}
                >
                  {link.name}
                </button>
              ))}
            </nav>

            {/* Actions Panel */}
            <div className="hidden lg:flex items-center space-x-4">
              {/* Theme Toggle */}
              <button 
                onClick={() => setDarkMode(!darkMode)}
                className="p-1.5 rounded-full text-slate-300 hover:text-amber-400 hover:bg-slate-900/50 transition-colors"
                title="Toggle Dark Mode"
                id="theme-toggle-btn"
              >
                {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>

              {/* Currency Selector */}
              <div className="relative group">
                <button className="flex items-center space-x-1 text-xs text-slate-300 hover:text-amber-400 py-1 uppercase tracking-wider font-semibold">
                  <DollarSign className="w-3.5 h-3.5 text-amber-500" />
                  <span>{currency}</span>
                </button>
                <div className="absolute right-0 top-full mt-2 w-28 bg-slate-900 border border-slate-800 rounded-lg shadow-xl py-1 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-200">
                  {(['USD', 'EUR', 'GBP', 'AED'] as const).map((curr) => (
                    <button
                      key={curr}
                      onClick={() => setCurrency(curr)}
                      className="w-full text-left px-4 py-1.5 text-xs text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
                    >
                      {curr === 'USD' && "$ USD"}
                      {curr === 'EUR' && "€ EUR"}
                      {curr === 'GBP' && "£ GBP"}
                      {curr === 'AED' && "د.إ AED"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Language Selector */}
              <div className="relative group">
                <button className="flex items-center space-x-1 text-xs text-slate-300 hover:text-amber-400 py-1 uppercase tracking-wider font-semibold">
                  <Globe className="w-3.5 h-3.5 text-amber-500" />
                  <span>{language}</span>
                </button>
                <div className="absolute right-0 top-full mt-2 w-28 bg-slate-900 border border-slate-800 rounded-lg shadow-xl py-1 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-200">
                  {(['EN', 'FR', 'DE', 'AR'] as const).map((lang) => (
                    <button
                      key={lang}
                      onClick={() => setLanguage(lang)}
                      className="w-full text-left px-4 py-1.5 text-xs text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
                    >
                      {lang === 'EN' && "English"}
                      {lang === 'FR' && "Français"}
                      {lang === 'DE' && "Deutsch"}
                      {lang === 'AR' && "العربية"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Saved Wishlist Badge */}
              {user && (
                <button 
                  onClick={() => setRoute("dashboard")}
                  className="relative p-1.5 text-slate-300 hover:text-amber-400 transition-colors"
                  title="My Saved Hotels"
                >
                  <Heart className="w-4 h-4" />
                  {wishlist.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-amber-600 text-[9px] text-white rounded-full w-4 h-4 flex items-center justify-center font-bold">
                      {wishlist.length}
                    </span>
                  )}
                </button>
              )}

              {/* Auth Button */}
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                    className="flex items-center space-x-2 bg-slate-900/80 border border-slate-800 px-3 py-1.5 rounded-full hover:bg-slate-800 transition-colors cursor-pointer"
                    id="profile-dropdown-trigger"
                  >
                    <div className="w-6 h-6 rounded-full bg-amber-500 flex items-center justify-center text-[10px] text-white font-bold font-mono uppercase overflow-hidden">
                      {user.avatar ? (
                        <img src={user.avatar} alt={user.name} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                      ) : (
                        user.name.charAt(0)
                      )}
                    </div>
                    <span className="text-xs font-semibold text-slate-200 max-w-[100px] truncate">{user.name}</span>
                  </button>

                  {showProfileDropdown && (
                    <div className="absolute right-0 mt-2 w-48 bg-slate-950 border border-slate-800 rounded-lg shadow-2xl py-1 z-50">
                      <div className="px-4 py-2 border-b border-slate-900">
                        <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Logged in as</p>
                        <p className="text-xs text-slate-200 font-semibold truncate">{user.email}</p>
                      </div>

                      <button
                        onClick={() => { setRoute("dashboard"); setShowProfileDropdown(false); }}
                        className="w-full text-left px-4 py-2 text-xs text-slate-300 hover:bg-slate-900 hover:text-white flex items-center space-x-2"
                      >
                        <Compass className="w-3.5 h-3.5" />
                        <span>Guest Dashboard</span>
                      </button>

                      {user.role === "admin" && (
                        <button
                          onClick={() => { setRoute("admin"); setShowProfileDropdown(false); }}
                          className="w-full text-left px-4 py-2 text-xs text-cyan-400 hover:bg-slate-900 hover:text-cyan-300 flex items-center space-x-2 font-semibold"
                        >
                          <Shield className="w-3.5 h-3.5" />
                          <span>Admin Control</span>
                        </button>
                      )}

                      <button
                        onClick={() => { logout(); setShowProfileDropdown(false); }}
                        className="w-full text-left px-4 py-2 text-xs text-rose-400 hover:bg-slate-900 hover:text-rose-300 flex items-center space-x-2 border-t border-slate-900"
                        id="logout-btn"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Logout</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => quickLogin("user")}
                  className="bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold px-4 py-2 rounded-lg transition-all shadow-md uppercase tracking-wider"
                  id="header-login-btn"
                >
                  Guest Access
                </button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="flex items-center space-x-3 lg:hidden">
              <button 
                onClick={() => setDarkMode(!darkMode)}
                className="p-1.5 rounded-full text-slate-300 hover:text-amber-400"
              >
                {darkMode ? <Sun className="w-4.5 h-4.5" /> : <Moon className="w-4.5 h-4.5" />}
              </button>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-slate-300 hover:text-white p-1"
                id="mobile-menu-toggle"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-slate-950 border-t border-slate-900 py-3 px-4 space-y-3 shadow-xl">
            <nav className="flex flex-col space-y-2">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => { setRoute(link.id); setMobileMenuOpen(false); }}
                  className={`text-left px-3 py-2 text-sm font-medium rounded-md uppercase tracking-widest text-xs ${
                    currentRoute === link.id ? "bg-slate-900 text-amber-400" : "text-slate-300"
                  }`}
                >
                  {link.name}
                </button>
              ))}
            </nav>

            <div className="border-t border-slate-900 pt-3 flex flex-col space-y-2">
              <div className="flex justify-between items-center px-3 py-1">
                <span className="text-xs text-slate-400 uppercase tracking-wider">Currency</span>
                <div className="flex space-x-2">
                  {['USD', 'EUR', 'AED'].map((curr) => (
                    <button
                      key={curr}
                      onClick={() => setCurrency(curr as any)}
                      className={`px-2 py-0.5 text-xs rounded font-bold ${currency === curr ? "bg-amber-600 text-white" : "text-slate-400 bg-slate-900"}`}
                    >
                      {curr}
                    </button>
                  ))}
                </div>
              </div>

              {user ? (
                <>
                  <div className="px-3 py-2 bg-slate-900 rounded-lg flex items-center space-x-2">
                    <div className="w-7 h-7 rounded-full bg-amber-500 flex items-center justify-center font-mono font-bold text-white text-xs">
                      {user.name.charAt(0)}
                    </div>
                    <div className="truncate">
                      <p className="text-xs font-semibold text-slate-200">{user.name}</p>
                      <p className="text-[10px] text-slate-400 truncate">{user.email}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => { setRoute("dashboard"); setMobileMenuOpen(false); }}
                    className="w-full text-left px-3 py-2 text-xs text-slate-300 hover:text-white flex items-center space-x-2"
                  >
                    <Compass className="w-4 h-4 text-amber-500" />
                    <span>My Dashboard</span>
                  </button>

                  {user.role === "admin" && (
                    <button
                      onClick={() => { setRoute("admin"); setMobileMenuOpen(false); }}
                      className="w-full text-left px-3 py-2 text-xs text-cyan-400 hover:text-cyan-300 flex items-center space-x-2 font-semibold"
                    >
                      <Shield className="w-4 h-4" />
                      <span>Admin Control Panel</span>
                    </button>
                  )}

                  <button
                    onClick={() => { logout(); setMobileMenuOpen(false); }}
                    className="w-full text-left px-3 py-2 text-xs text-rose-400 flex items-center space-x-2 border-t border-slate-900/50 pt-2"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <button
                  onClick={() => { quickLogin("user"); setMobileMenuOpen(false); }}
                  className="w-full bg-amber-600 hover:bg-amber-500 text-white font-bold py-2 px-4 rounded-md text-xs uppercase tracking-widest text-center"
                >
                  Guest Access
                </button>
              )}
            </div>
          </div>
        )}
      </header>
    </>
  );
}
