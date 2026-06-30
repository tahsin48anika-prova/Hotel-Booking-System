/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect } from "react";
import { 
  User, Hotel, Room, Booking, Review, Blog, 
  Coupon, Message, CMSSettings, Subscriber 
} from "../types";

interface SearchParams {
  city: string;
  checkIn: string;
  checkOut: string;
  adults: number;
  children: number;
}

interface AppContextType {
  user: User | null;
  token: string | null;
  settings: CMSSettings;
  hotels: Hotel[];
  rooms: Room[];
  bookings: Booking[];
  reviews: Review[];
  blogs: Blog[];
  coupons: Coupon[];
  messages: Message[];
  currentRoute: string;
  selectedHotelId: string | null;
  selectedRoomId: string | null;
  selectedBlogId: string | null;
  searchParams: SearchParams;
  currency: 'USD' | 'EUR' | 'GBP' | 'AED';
  language: 'EN' | 'FR' | 'DE' | 'AR';
  darkMode: boolean;
  wishlist: string[];
  loading: boolean;
  
  // Actions
  setRoute: (route: string) => void;
  selectHotel: (id: string | null) => void;
  selectRoom: (id: string | null) => void;
  selectBlog: (id: string | null) => void;
  setSearchParams: (params: Partial<SearchParams>) => void;
  setCurrency: (currency: 'USD' | 'EUR' | 'GBP' | 'AED') => void;
  setLanguage: (lang: 'EN' | 'FR' | 'DE' | 'AR') => void;
  setDarkMode: (dark: boolean) => void;
  
  // Auth
  login: (email: string) => Promise<boolean>;
  quickLogin: (role: 'admin' | 'user') => void;
  register: (name: string, email: string, phone: string) => Promise<boolean>;
  logout: () => void;
  deleteAccount: () => void;
  
  // Wishlist
  toggleWishlist: (hotelId: string) => void;
  
  // Core bookings & operations
  createBooking: (bookingData: Partial<Booking>) => Promise<Booking | null>;
  cancelBooking: (bookingId: string) => Promise<boolean>;
  addReview: (reviewData: { hotelId: string; rating: number; comment: string }) => Promise<boolean>;
  submitMessage: (messageData: { name: string; email: string; phone?: string; subject: string; message: string }) => Promise<boolean>;
  subscribeNewsletter: (email: string) => Promise<boolean>;
  
  // Admin Operations (CMS & Managers)
  updateCMS: (newSettings: Partial<CMSSettings>) => Promise<boolean>;
  saveHotel: (hotelData: Partial<Hotel>) => Promise<boolean>;
  removeHotel: (hotelId: string) => Promise<boolean>;
  saveRoom: (roomData: Partial<Room>) => Promise<boolean>;
  removeRoom: (roomId: string) => Promise<boolean>;
  submitReviewReply: (reviewId: string, replyText: string) => Promise<boolean>;
  saveBlog: (blogData: Partial<Blog>) => Promise<boolean>;
  removeBlog: (blogId: string) => Promise<boolean>;
  markMessageRead: (messageId: string) => Promise<boolean>;
  
  // Refresh utils
  refreshData: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  // Navigation
  const [currentRoute, setCurrentRoute] = useState<string>("home");
  const [selectedHotelId, setSelectedHotelId] = useState<string | null>(null);
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [selectedBlogId, setSelectedBlogId] = useState<string | null>(null);

  // States
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [settings, setSettings] = useState<CMSSettings>({
    logoText: "WORLDORA STAY",
    brandName: "Worldora Stay",
    tagline: "Luxury Hotels • Best Prices • Easy Booking Worldwide",
    primaryColor: "#0F172A",
    secondaryColor: "#D97706",
    footerText: "Experience ultimate comfort and prestige. Our curated selection of handpicked world-class properties guarantees an unparalleled escape.",
    heroTitle: "Find Your Next Haven of Ultimate Luxury",
    heroSubtitle: "Discover prestigious destinations, bespoke services, and handpicked luxury resorts tailored to your sophisticated taste.",
    contactPhone: "+1 (800) 555-7000",
    contactEmail: "reservations@worldorastay.com",
    contactAddress: "777 Prestige Way, Manhattan, New York, NY 10001",
    socialLinks: { facebook: "", instagram: "", twitter: "", linkedin: "" }
  });
  
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  
  const [currency, setCurrencyState] = useState<'USD' | 'EUR' | 'GBP' | 'AED'>('USD');
  const [language, setLanguageState] = useState<'EN' | 'FR' | 'DE' | 'AR'>('EN');
  const [darkMode, setDarkModeState] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  // Search Param States (Pre-populated)
  const [searchParams, setSearchParamsState] = useState<SearchParams>({
    city: "",
    checkIn: new Date(Date.now() + 86400000 * 2).toISOString().split("T")[0], // 2 days from now
    checkOut: new Date(Date.now() + 86400000 * 5).toISOString().split("T")[0], // 5 days from now
    adults: 2,
    children: 0
  });

  // Load preferences and session
  useEffect(() => {
    // Session
    const storedUser = localStorage.getItem("luxury_user");
    const storedToken = localStorage.getItem("luxury_token");
    if (storedUser && storedToken) {
      const parsed = JSON.parse(storedUser);
      setUser(parsed);
      setToken(storedToken);
      setWishlist(parsed.wishlist || []);
    }

    // Preferences
    const storedDark = localStorage.getItem("luxury_dark") === "true";
    setDarkModeState(storedDark);
    if (storedDark) {
      document.documentElement.classList.add("dark");
    }

    const storedCurrency = localStorage.getItem("luxury_currency") as any;
    if (storedCurrency) setCurrencyState(storedCurrency);

    const storedLang = localStorage.getItem("luxury_lang") as any;
    if (storedLang) setLanguageState(storedLang);

    // Initial Fetch
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      const [setRes, hotRes, roomRes, revRes, blogRes, msgRes, coupRes] = await Promise.all([
        fetch("/api/settings").then(r => r.json()),
        fetch("/api/hotels").then(r => r.json()),
        fetch("/api/rooms").then(r => r.json()),
        fetch("/api/reviews").then(r => r.json()),
        fetch("/api/blogs").then(r => r.json()),
        fetch("/api/messages").then(r => r.ok ? r.json() : []),
        fetch("/api/coupons").then(r => r.ok ? r.json() : [])
      ]);

      if (setRes) setSettings(setRes);
      if (hotRes) setHotels(hotRes);
      if (roomRes) setRooms(roomRes);
      if (revRes) setReviews(revRes);
      if (blogRes) setBlogs(blogRes);
      if (msgRes) setMessages(msgRes);
      if (coupRes) setCoupons(coupRes);
    } catch (err) {
      console.error("Failed to load full luxury dataset from API:", err);
    } finally {
      setLoading(false);
    }
  };

  const refreshData = async () => {
    await fetchInitialData();
  };

  // Actions
  const setRoute = (route: string) => {
    setCurrentRoute(route);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const selectHotel = (id: string | null) => {
    setSelectedHotelId(id);
    if (id) setRoute("hotel-details");
  };

  const selectRoom = (id: string | null) => {
    setSelectedRoomId(id);
    if (id) setRoute("booking");
  };

  const selectBlog = (id: string | null) => {
    setSelectedBlogId(id);
    if (id) setRoute("blog-details");
  };

  const setSearchParams = (params: Partial<SearchParams>) => {
    setSearchParamsState(prev => ({ ...prev, ...params }));
  };

  const setCurrency = (curr: 'USD' | 'EUR' | 'GBP' | 'AED') => {
    setCurrencyState(curr);
    localStorage.setItem("luxury_currency", curr);
  };

  const setLanguage = (lang: 'EN' | 'FR' | 'DE' | 'AR') => {
    setLanguageState(lang);
    localStorage.setItem("luxury_lang", lang);
  };

  const setDarkMode = (dark: boolean) => {
    setDarkModeState(dark);
    localStorage.setItem("luxury_dark", String(dark));
    if (dark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  // Authentication
  const login = async (email: string): Promise<boolean> => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      if (data.success) {
        setUser(data.user);
        setToken(data.token);
        setWishlist(data.user.wishlist || []);
        localStorage.setItem("luxury_user", JSON.stringify(data.user));
        localStorage.setItem("luxury_token", data.token);
        // Refresh booking records
        fetchBookings();
        return true;
      }
    } catch (err) {
      console.error("Login failed:", err);
    }
    return false;
  };

  const quickLogin = (role: 'admin' | 'user') => {
    const email = role === "admin" ? "admin@hotel.com" : "user@hotel.com";
    login(email).then(success => {
      if (success) {
        setRoute(role === "admin" ? "admin" : "dashboard");
      }
    });
  };

  const register = async (name: string, email: string, phone: string): Promise<boolean> => {
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone })
      });
      const data = await res.json();
      if (data.success) {
        setUser(data.user);
        setToken(data.token);
        setWishlist(data.user.wishlist || []);
        localStorage.setItem("luxury_user", JSON.stringify(data.user));
        localStorage.setItem("luxury_token", data.token);
        setRoute("dashboard");
        return true;
      }
    } catch (err) {
      console.error("Registration failed:", err);
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setWishlist([]);
    localStorage.removeItem("luxury_user");
    localStorage.removeItem("luxury_token");
    setRoute("home");
  };

  const deleteAccount = () => {
    // Clear state
    logout();
    alert("Account permanently deleted. We are sorry to see you depart.");
  };

  // Fetch user bookings
  const fetchBookings = async () => {
    try {
      const res = await fetch("/api/bookings");
      if (res.ok) {
        const data = await res.json();
        setBookings(data);
      }
    } catch (e) {
      console.error("Failed to load bookings:", e);
    }
  };

  useEffect(() => {
    if (user) {
      fetchBookings();
    }
  }, [user]);

  // Wishlist
  const toggleWishlist = (hotelId: string) => {
    if (!user) {
      alert("Please login to save this hotel to your wishlist.");
      setRoute("home");
      return;
    }
    
    let updated: string[];
    if (wishlist.includes(hotelId)) {
      updated = wishlist.filter(id => id !== hotelId);
    } else {
      updated = [...wishlist, hotelId];
    }
    
    setWishlist(updated);
    const updatedUser = { ...user, wishlist: updated };
    setUser(updatedUser);
    localStorage.setItem("luxury_user", JSON.stringify(updatedUser));
    
    // Opt-in background update
    fetch(`/api/auth/update-wishlist`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user.id, wishlist: updated })
    }).catch(e => console.error("Sync wishlist error:", e));
  };

  // Create Booking
  const createBooking = async (bookingData: Partial<Booking>): Promise<Booking | null> => {
    try {
      const payload = {
        userId: user?.id || "anonymous",
        ...bookingData
      };
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        setBookings(prev => [...prev, data.booking]);
        return data.booking;
      }
    } catch (e) {
      console.error("Booking failed:", e);
    }
    return null;
  };

  const cancelBooking = async (bookingId: string): Promise<boolean> => {
    try {
      const res = await fetch(`/api/bookings/${bookingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "cancelled" })
      });
      const data = await res.json();
      if (data.success) {
        setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: "cancelled" } : b));
        return true;
      }
    } catch (e) {
      console.error("Failed to cancel booking:", e);
    }
    return false;
  };

  // Submit Review
  const addReview = async (reviewData: { hotelId: string; rating: number; comment: string }): Promise<boolean> => {
    if (!user) return false;
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...reviewData,
          userId: user.id,
          userName: user.name,
          userAvatar: user.avatar || "https://picsum.photos/seed/user_anon/100/100"
        })
      });
      const data = await res.json();
      if (data.success) {
        setReviews(prev => [data.review, ...prev]);
        // Update local hotel rating / review count
        setHotels(prev => prev.map(h => {
          if (h.id === reviewData.hotelId) {
            const hReviews = [data.review, ...reviews.filter(r => r.hotelId === h.id)];
            const avg = parseFloat((hReviews.reduce((sum, r) => sum + r.rating, 0) / hReviews.length).toFixed(1));
            return { ...h, rating: avg, reviewsCount: hReviews.length };
          }
          return h;
        }));
        return true;
      }
    } catch (e) {
      console.error("Review submission failed:", e);
    }
    return false;
  };

  // Submit contact inquiry
  const submitMessage = async (messageData: { name: string; email: string; phone?: string; subject: string; message: string }): Promise<boolean> => {
    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(messageData)
      });
      const data = await res.json();
      if (data.success) {
        setMessages(prev => [...prev, data.message]);
        return true;
      }
    } catch (e) {
      console.error("Message submission failed:", e);
    }
    return false;
  };

  const subscribeNewsletter = async (email: string): Promise<boolean> => {
    try {
      const res = await fetch("/api/subscribers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });
      return res.ok;
    } catch (e) {
      console.error("Failed to subscribe:", e);
    }
    return false;
  };

  // --------------------------------------------------------------------------
  // ADMIN DASHBOARD ACTIONS (Saves to server state/JSON file automatically!)
  // --------------------------------------------------------------------------

  // Update CMS Site Settings
  const updateCMS = async (newSettings: Partial<CMSSettings>): Promise<boolean> => {
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newSettings)
      });
      const data = await res.json();
      if (data.success) {
        setSettings(data.settings);
        return true;
      }
    } catch (e) {
      console.error("CMS update failed:", e);
    }
    return false;
  };

  // Add or Edit Hotel
  const saveHotel = async (hotelData: Partial<Hotel>): Promise<boolean> => {
    try {
      const isNew = !hotelData.id;
      const url = isNew ? "/api/hotels" : `/api/hotels/${hotelData.id}`;
      const method = isNew ? "POST" : "PUT";
      
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(hotelData)
      });
      const data = await res.json();
      if (data.success) {
        if (isNew) {
          setHotels(prev => [...prev, data.hotel]);
        } else {
          setHotels(prev => prev.map(h => h.id === data.hotel.id ? data.hotel : h));
        }
        return true;
      }
    } catch (e) {
      console.error("Hotel save failed:", e);
    }
    return false;
  };

  // Remove Hotel
  const removeHotel = async (hotelId: string): Promise<boolean> => {
    try {
      const res = await fetch(`/api/hotels/${hotelId}`, { method: "DELETE" });
      if (res.ok) {
        setHotels(prev => prev.filter(h => h.id !== hotelId));
        setRooms(prev => prev.filter(r => r.hotelId !== hotelId));
        return true;
      }
    } catch (e) {
      console.error("Failed to remove hotel:", e);
    }
    return false;
  };

  // Add or Edit Room
  const saveRoom = async (roomData: Partial<Room>): Promise<boolean> => {
    try {
      const isNew = !roomData.id;
      const url = isNew ? "/api/rooms" : `/api/rooms/${roomData.id}`;
      const method = isNew ? "POST" : "PUT";
      
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(roomData)
      });
      const data = await res.json();
      if (data.success) {
        if (isNew) {
          setRooms(prev => [...prev, data.room]);
        } else {
          setRooms(prev => prev.map(r => r.id === data.room.id ? data.room : r));
        }
        return true;
      }
    } catch (e) {
      console.error("Room save failed:", e);
    }
    return false;
  };

  // Remove Room
  const removeRoom = async (roomId: string): Promise<boolean> => {
    try {
      const res = await fetch(`/api/rooms/${roomId}`, { method: "DELETE" });
      if (res.ok) {
        setRooms(prev => prev.filter(r => r.id !== roomId));
        return true;
      }
    } catch (e) {
      console.error("Failed to remove room:", e);
    }
    return false;
  };

  // Admin Reply to Review
  const submitReviewReply = async (reviewId: string, replyText: string): Promise<boolean> => {
    try {
      const res = await fetch(`/api/reviews/${reviewId}/reply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reply: replyText })
      });
      const data = await res.json();
      if (data.success) {
        setReviews(prev => prev.map(r => r.id === reviewId ? { ...r, reply: replyText } : r));
        return true;
      }
    } catch (e) {
      console.error("Review reply failed:", e);
    }
    return false;
  };

  // Save/Edit Blog
  const saveBlog = async (blogData: Partial<Blog>): Promise<boolean> => {
    try {
      const isNew = !blogData.id;
      const url = isNew ? "/api/blogs" : `/api/blogs/${blogData.id}`;
      const method = isNew ? "POST" : "PUT";
      
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(blogData)
      });
      const data = await res.json();
      if (data.success) {
        if (isNew) {
          setBlogs(prev => [...prev, data.blog]);
        } else {
          setBlogs(prev => prev.map(b => b.id === data.blog.id ? data.blog : b));
        }
        return true;
      }
    } catch (e) {
      console.error("Blog save failed:", e);
    }
    return false;
  };

  // Remove Blog
  const removeBlog = async (blogId: string): Promise<boolean> => {
    try {
      const res = await fetch(`/api/blogs/${blogId}`, { method: "DELETE" });
      if (res.ok) {
        setBlogs(prev => prev.filter(b => b.id !== blogId));
        return true;
      }
    } catch (e) {
      console.error("Failed to remove blog:", e);
    }
    return false;
  };

  // Read message
  const markMessageRead = async (messageId: string): Promise<boolean> => {
    try {
      const res = await fetch(`/api/messages/${messageId}/read`, { method: "PUT" });
      if (res.ok) {
        setMessages(prev => prev.map(m => m.id === messageId ? { ...m, status: "read" } : m));
        return true;
      }
    } catch (e) {
      console.error("Failed to read message:", e);
    }
    return false;
  };

  return (
    <AppContext.Provider value={{
      user, token, settings, hotels, rooms, bookings, reviews, blogs, coupons, messages,
      currentRoute, selectedHotelId, selectedRoomId, selectedBlogId, searchParams,
      currency, language, darkMode, wishlist, loading,
      
      setRoute, selectHotel, selectRoom, selectBlog, setSearchParams,
      setCurrency, setLanguage, setDarkMode,
      
      login, quickLogin, register, logout, deleteAccount,
      toggleWishlist,
      
      createBooking, cancelBooking, addReview, submitMessage, subscribeNewsletter,
      
      updateCMS, saveHotel, removeHotel, saveRoom, removeRoom, submitReviewReply,
      saveBlog, removeBlog, markMessageRead, refreshData
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within AppProvider");
  return context;
}
