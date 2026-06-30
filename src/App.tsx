/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { AppProvider, useApp } from "./context/AppContext";
import Header from "./components/Header";
import Footer from "./components/Footer";
import AIAssistant from "./components/AIAssistant";

import HomeView from "./views/HomeView";
import AboutView from "./views/AboutView";
import HotelsView from "./views/HotelsView";
import HotelDetailsView from "./views/HotelDetailsView";
import BookingView from "./views/BookingView";
import ServicesView from "./views/ServicesView";
import BlogView from "./views/BlogView";
import DashboardView from "./views/DashboardView";
import AdminView from "./views/AdminView";
import ContactView from "./views/ContactView";
import PrivacyView from "./views/PrivacyView";

function MainLayout() {
  const { currentRoute, darkMode } = useApp();

  // Route Switch
  const renderView = () => {
    switch (currentRoute) {
      case "home":
        return <HomeView />;
      case "about":
        return <AboutView />;
      case "hotels":
        return <HotelsView />;
      case "hotel-details":
        return <HotelDetailsView />;
      case "booking":
        return <BookingView />;
      case "services":
        return <ServicesView />;
      case "blog":
        return <BlogView />;
      case "dashboard":
        return <DashboardView />;
      case "admin":
        return <AdminView />;
      case "contact":
        return <ContactView />;
      case "privacy":
      case "terms":
      case "refund":
        return <PrivacyView />;
      default:
        return <HomeView />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between relative overflow-hidden bg-slate-950 text-slate-100 font-sans">
      {/* Background Ambient Mesh for Frosted Glass Theme */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-blue-950/50 rounded-full blur-[130px] opacity-90"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-950/50 rounded-full blur-[110px] opacity-90"></div>
        <div className="absolute top-[25%] right-[15%] w-[35%] h-[45%] bg-amber-950/20 rounded-full blur-[90px] opacity-70"></div>
      </div>

      <div className="relative z-10 flex flex-col justify-between min-h-screen w-full">
        <Header />
        
        {/* Route Transition Wrap */}
        <main className="flex-grow relative z-10">
          {renderView()}
        </main>

        <AIAssistant />
        <Footer />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
