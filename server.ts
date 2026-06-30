/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

import { createClient, SupabaseClient } from "@supabase/supabase-js";

function cleanSupabaseUrl(url: string): string {
  let cleaned = url.trim();
  if (cleaned.endsWith("/rest/v1/")) {
    cleaned = cleaned.substring(0, cleaned.length - 9);
  } else if (cleaned.endsWith("/rest/v1")) {
    cleaned = cleaned.substring(0, cleaned.length - 8);
  }
  return cleaned;
}

let supabase: SupabaseClient | null = null;
function getSupabaseClient(): SupabaseClient | null {
  if (!supabase) {
    const rawUrl = process.env.SUPABASE_URL || "https://thjjockqleeygzsfjvdi.supabase.co";
    const supabaseKey = process.env.SUPABASE_ANON_KEY || "sb_publishable_Kv2UOfzWACELz6h8xOpxeg_PnulkkTK";
    
    if (rawUrl && supabaseKey) {
      try {
        const supabaseUrl = cleanSupabaseUrl(rawUrl);
        supabase = createClient(supabaseUrl, supabaseKey);
        console.log("Supabase Client initialized with URL:", supabaseUrl);
      } catch (err) {
        console.error("Error initializing Supabase client:", err);
      }
    }
  }
  return supabase;
}

function mapSupabaseToBooking(row: any): Booking {
  return {
    id: row.id,
    userId: row.user_id || row.userId || "",
    hotelId: row.hotel_id || row.hotelId || "",
    roomId: row.room_id || row.roomId || "",
    checkIn: row.check_in || row.checkIn || "",
    checkOut: row.check_out || row.checkOut || "",
    guests: typeof row.guests === "string" ? JSON.parse(row.guests) : (row.guests || { adults: 2, children: 0 }),
    guestName: row.guest_name || row.guestName || "",
    guestEmail: row.guest_email || row.guestEmail || "",
    guestPhone: row.guest_phone || row.guestPhone || "",
    totalAmount: Number(row.total_amount || row.totalAmount || 0),
    couponUsed: row.coupon_used || row.couponUsed || undefined,
    status: row.status || "confirmed",
    specialRequests: row.special_requests || row.specialRequests || undefined,
    createdAt: row.created_at || row.createdAt || new Date().toISOString()
  };
}

async function fetchBookingsFromSupabase(): Promise<Booking[] | null> {
  const client = getSupabaseClient();
  if (!client) return null;
  try {
    const { data, error } = await client.from("bookings").select("*");
    if (error) {
      console.warn("Supabase bookings fetch failed (expected if table not created yet):", error.message);
      return null;
    }
    if (data) {
      console.log(`Fetched ${data.length} bookings from Supabase.`);
      return data.map(mapSupabaseToBooking);
    }
  } catch (err: any) {
    console.error("Failed to query Supabase bookings table:", err);
  }
  return null;
}

async function saveBookingToSupabase(booking: Booking): Promise<boolean> {
  const client = getSupabaseClient();
  if (!client) return false;
  
  // Standard snake_case payload mapping
  const snakePayload: any = {
    id: booking.id,
    user_id: booking.userId,
    hotel_id: booking.hotelId,
    room_id: booking.roomId,
    check_in: booking.checkIn,
    check_out: booking.checkOut,
    guests: booking.guests,
    guest_name: booking.guestName,
    guest_email: booking.guestEmail,
    guest_phone: booking.guestPhone,
    total_amount: booking.totalAmount,
    coupon_used: booking.couponUsed || null,
    status: booking.status,
    special_requests: booking.specialRequests || null,
    created_at: booking.createdAt
  };

  try {
    const { error } = await client.from("bookings").upsert(snakePayload, { onConflict: "id" });
    if (error) {
      console.warn("Supabase snake_case upsert failed, retrying with camelCase structure...", error.message);
      
      // Retry with pure camelCase in case the user's table is defined that way
      const camelPayload = {
        id: booking.id,
        userId: booking.userId,
        hotelId: booking.hotelId,
        roomId: booking.roomId,
        checkIn: booking.checkIn,
        checkOut: booking.checkOut,
        guests: booking.guests,
        guestName: booking.guestName,
        guestEmail: booking.guestEmail,
        guestPhone: booking.guestPhone,
        totalAmount: booking.totalAmount,
        couponUsed: booking.couponUsed || null,
        status: booking.status,
        specialRequests: booking.specialRequests || null,
        createdAt: booking.createdAt
      };
      const { error: camelError } = await client.from("bookings").upsert(camelPayload, { onConflict: "id" });
      if (camelError) {
        console.error("Supabase camelCase upsert also failed:", camelError.message);
        return false;
      }
    }
    console.log(`Booking ${booking.id} successfully synced to Supabase.`);
    return true;
  } catch (err: any) {
    console.error("Exception occurred when saving booking to Supabase:", err);
    return false;
  }
}

const PORT = 3000;
const STORE_PATH = path.join(process.cwd(), "data_store.json");

// Helper to lazily initialize GoogleGenAI
let ai: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!ai) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey && apiKey !== "MY_GEMINI_API_KEY" && apiKey !== "") {
      ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });
    }
  }
  return ai;
}

// Interfaces for our database
import { 
  Hotel, Room, Booking, Review, Blog, 
  Coupon, Message, Subscriber, CMSSettings, User 
} from "./src/types";

interface DBStore {
  users: User[];
  hotels: Hotel[];
  rooms: Room[];
  bookings: Booking[];
  reviews: Review[];
  blogs: Blog[];
  coupons: Coupon[];
  messages: Message[];
  subscribers: Subscriber[];
  settings: CMSSettings;
}

// Default initial state
const defaultSettings: CMSSettings = {
  logoText: "WORLDORA STAY",
  brandName: "Worldora Stay",
  tagline: "Luxury Hotels • Best Prices • Easy Booking Worldwide",
  primaryColor: "#0F172A", // Slate 900
  secondaryColor: "#D97706", // Amber 600
  footerText: "Experience ultimate comfort and prestige. Our curated selection of handpicked world-class properties guarantees an unparalleled escape.",
  heroTitle: "Find Your Next Haven of Ultimate Luxury",
  heroSubtitle: "Discover prestigious destinations, bespoke services, and handpicked luxury resorts tailored to your sophisticated taste.",
  contactPhone: "+1 (800) 555-7000",
  contactEmail: "reservations@worldorastay.com",
  contactAddress: "777 Prestige Way, Manhattan, New York, NY 10001",
  socialLinks: {
    facebook: "https://facebook.com",
    instagram: "https://instagram.com",
    twitter: "https://twitter.com",
    linkedin: "https://linkedin.com"
  }
};

const defaultHotels: Hotel[] = [
  {
    id: "h1",
    name: "The Grand Zenith Palace",
    description: "Nestled in the heart of historic Paris, this legendary landmark combines classical 19th-century architecture with contemporary Parisian elegance. Featuring Michelin-starred dining, a subterranean spa, and breathtaking balconies looking directly onto the Eiffel Tower.",
    country: "France",
    city: "Paris",
    price: 480,
    rating: 4.9,
    reviewsCount: 142,
    image: "https://picsum.photos/seed/paris/1200/800",
    images: [
      "https://picsum.photos/seed/paris1/1200/800",
      "https://picsum.photos/seed/paris2/1200/800",
      "https://picsum.photos/seed/paris3/1200/800"
    ],
    amenities: ["Free WiFi", "Michelin Restaurant", "Luxury Spa", "Indoor Pool", "24/7 Room Service", "Eiffel Tower View", "Valet Parking"],
    propertyType: "Hotel",
    guestCapacity: 4,
    address: "22 Avenue des Champs-Élysées, 75008 Paris",
    featured: true,
    category: "Luxury"
  },
  {
    id: "h2",
    name: "Aura Wellness Resort & Spa",
    description: "Suspended amidst the lush, emerald treetops of Ubud's jungle, Aura is a sanctuary of profound peace. Built around sacred volcanic springs, the resort features individual glass-walled villas, personal infinity pools, private yoga shalas, and Ayurvedic healing paths.",
    country: "Indonesia",
    city: "Bali",
    price: 360,
    rating: 4.8,
    reviewsCount: 98,
    image: "https://picsum.photos/seed/bali/1200/800",
    images: [
      "https://picsum.photos/seed/bali1/1200/800",
      "https://picsum.photos/seed/bali2/1200/800",
      "https://picsum.photos/seed/bali3/1200/800"
    ],
    amenities: ["Free WiFi", "Infinity Pool", "Ayurvedic Spa", "Jungle Views", "Organic Restaurant", "Yoga Deck", "Airport Transfer"],
    propertyType: "Resort",
    guestCapacity: 2,
    address: "Jalan Raya Sanggingan, Ubud, Gianyar, Bali 80571",
    featured: true,
    category: "Wellness"
  },
  {
    id: "h3",
    name: "The Royal Worldora Stay Plaza",
    description: "Rising high above the Manhattan skyline, this architectural marvel offers unrivaled penthouse living. Designed by world-famous architects, it blends metropolitan boldness with high-society comforts, premium automation, and an exclusive sky bar.",
    country: "United States",
    city: "New York",
    price: 550,
    rating: 4.7,
    reviewsCount: 215,
    image: "https://picsum.photos/seed/newyork/1200/800",
    images: [
      "https://picsum.photos/seed/ny1/1200/800",
      "https://picsum.photos/seed/ny2/1200/800",
      "https://picsum.photos/seed/ny3/1200/800"
    ],
    amenities: ["Free WiFi", "Rooftop Sky Bar", "State-of-the-art Gym", "Executive Lounge", "Business Center", "Central Park Views", "Valet Parking"],
    propertyType: "Hotel",
    guestCapacity: 6,
    address: "730 Fifth Avenue, New York, NY 10019",
    featured: true,
    category: "Boutique"
  },
  {
    id: "h4",
    name: "Sands of Oasis Reserve",
    description: "An absolute oasis of gilded luxury, situated on a secluded private peninsula in Dubai. Surrounded by temperature-controlled turquoise waters, guests enjoy custom-tailored Butler services, a private marine harbor, golden-sand beaches, and luxury helipad access.",
    country: "United Arab Emirates",
    city: "Dubai",
    price: 720,
    rating: 4.9,
    reviewsCount: 86,
    image: "https://picsum.photos/seed/dubai/1200/800",
    images: [
      "https://picsum.photos/seed/dubai1/1200/800",
      "https://picsum.photos/seed/dubai2/1200/800",
      "https://picsum.photos/seed/dubai3/1200/800"
    ],
    amenities: ["Free WiFi", "Private Beach", "Butler Service", "Marine Harbor", "Helipad Access", "Underwater Lounge", "Infinity Pools"],
    propertyType: "Resort",
    guestCapacity: 4,
    address: "Palm Jumeirah Crescent, West Wing, Dubai",
    featured: true,
    category: "Luxury"
  },
  {
    id: "h5",
    name: "Sapphire Bay Marina Villa",
    description: "Perched majestically on the steep, sun-drenched volcanic cliffs of Santorini. This white-washed boutique villa cluster faces the mesmerizing caldera sunset, offering cave pools, dynamic private sun decks, and exquisite local gastronomic culinary journeys.",
    country: "Greece",
    city: "Santorini",
    price: 420,
    rating: 4.8,
    reviewsCount: 64,
    image: "https://picsum.photos/seed/greece/1200/800",
    images: [
      "https://picsum.photos/seed/greece1/1200/800",
      "https://picsum.photos/seed/greece2/1200/800",
      "https://picsum.photos/seed/greece3/1200/800"
    ],
    amenities: ["Free WiFi", "Cave Pools", "Caldera Sunset Deck", "Wine Cellar", "Private Chef", "Luxury Yacht Rental", "Helipad"],
    propertyType: "Villa",
    guestCapacity: 2,
    address: "Oia Cliffside Walk, Santorini 84702",
    featured: false,
    category: "Boutique"
  },
  {
    id: "h6",
    name: "The Alpine Crest Chalet",
    description: "A masterclass in alpine luxury, crafted from ancient mountain stone and Swiss pine. Located in the high-elevation slopes of Zermatt, this ski-in, ski-out chalet offers absolute isolation under the majestic presence of the Matterhorn, along with luxury saunas.",
    country: "Switzerland",
    city: "Zermatt",
    price: 510,
    rating: 4.9,
    reviewsCount: 78,
    image: "https://picsum.photos/seed/swiss/1200/800",
    images: [
      "https://picsum.photos/seed/swiss1/1200/800",
      "https://picsum.photos/seed/swiss2/1200/800",
      "https://picsum.photos/seed/swiss3/1200/800"
    ],
    amenities: ["Free WiFi", "Ski-in/Ski-out Access", "Heated Outdoor Jacuzzi", "Matterhorn View", "Finnish Sauna", "Open Hearth Fireplace", "Wine Vault"],
    propertyType: "Resort",
    guestCapacity: 8,
    address: "Riedweg 156, 3920 Zermatt",
    featured: false,
    category: "Luxury"
  }
];

const defaultRooms: Room[] = [
  // Grand Zenith Rooms
  {
    id: "r1",
    hotelId: "h1",
    name: "Champs-Élysées Deluxe Room",
    description: "An elegant, classically designed masterroom featuring a custom hand-carved king bed, luxury Italian marble bathroom, and expansive floor-to-ceiling windows overlooking the Avenue.",
    price: 480,
    bedType: "1 King Bed",
    capacity: 2,
    size: "42 m²",
    images: ["https://picsum.photos/seed/room_paris_deluxe/800/600"],
    amenities: ["WiFi", "TV", "Mini Bar", "Bathrobe", "Espresso Machine", "Marble Bath"],
    availableCount: 4
  },
  {
    id: "r2",
    hotelId: "h1",
    name: "Eiffel View Executive Suite",
    description: "A breathtaking corner suite designed for executive relaxation. Features a private plush parlor, antique writing desk, and an outdoor balcony facing the Eiffel Tower.",
    price: 750,
    bedType: "1 Premium King Bed",
    capacity: 3,
    size: "75 m²",
    images: ["https://picsum.photos/seed/room_paris_suite/800/600"],
    amenities: ["WiFi", "Rooftop Access", "Private Balcony", "Butler Service", "Champagne on Arrival", "Walk-in Wardrobe"],
    availableCount: 2
  },
  // Aura Wellness Rooms
  {
    id: "r3",
    hotelId: "h2",
    name: "Tropical Sanctuary Pavilion",
    description: "A glass-walled bamboo pavilion facing the dramatic sacred river gorge. Immersed in forest sounds, it comes with a private outdoor stone bathtub and daily wellness juices.",
    price: 360,
    bedType: "1 King Canopy Bed",
    capacity: 2,
    size: "60 m²",
    images: ["https://picsum.photos/seed/room_bali_pavilion/800/600"],
    amenities: ["WiFi", "Outdoor Bath", "Forest View", "Daily Yoga Kit", "Organic Fruit Basket", "Premium Teas"],
    availableCount: 3
  },
  {
    id: "r4",
    hotelId: "h2",
    name: "Sacred Stream Infinity Villa",
    description: "The ultimate wellness haven. Features a sprawling timber deck, a private emerald plunge pool floating over the canyon, and an private outdoor massage pavilion.",
    price: 600,
    bedType: "1 Grand King Bed",
    capacity: 2,
    size: "110 m²",
    images: ["https://picsum.photos/seed/room_bali_villa/800/600"],
    amenities: ["WiFi", "Private Pool", "Massage Pavillion", "24/7 Wellness Butler", "Ayurvedic In-room Meals"],
    availableCount: 2
  },
  // Royal Worldora New York Rooms
  {
    id: "r5",
    hotelId: "h3",
    name: "Metropolitan Premium Room",
    description: "A sleek, contemporary room styled in urban charcoal and premium walnut. Features high-fidelity sound, dynamic lighting controls, and dynamic park vistas.",
    price: 550,
    bedType: "1 King Bed",
    capacity: 2,
    size: "40 m²",
    images: ["https://picsum.photos/seed/room_ny_prem/800/600"],
    amenities: ["WiFi", "Smart Room Control", "Bose Audio", "Rain Shower", "Premium Concierge Access"],
    availableCount: 5
  },
  {
    id: "r6",
    hotelId: "h3",
    name: "Fifth Avenue Skyline Penthouse",
    description: "The crown jewel of Fifth Avenue. Spans two levels with glass loft ceilings, double marble fireplaces, a private cocktail bar, and panoramic 360-degree city views.",
    price: 1200,
    bedType: "2 California King Beds",
    capacity: 4,
    size: "180 m²",
    images: ["https://picsum.photos/seed/room_ny_penthouse/800/600"],
    amenities: ["WiFi", "Private Elevator", "Wet Bar", "Dual Marble Bathrooms", "Helipad Pickup", "Premium Security"],
    availableCount: 1
  },
  // Sands of Oasis Dubai Rooms
  {
    id: "r7",
    hotelId: "h4",
    name: "Oceanic Vista Room",
    description: "Wake up to endless vistas of the Arabian Gulf. Built with custom Persian carpets and gilded gold leaf frames, including a private beach-level sun terrace.",
    price: 720,
    bedType: "1 Grand King Bed",
    capacity: 3,
    size: "65 m²",
    images: ["https://picsum.photos/seed/room_dubai_ocean/800/600"],
    amenities: ["WiFi", "Beach Terrace", "Pillow Menu", "Gilded Bathroom", "L'Occitane Amenities"],
    availableCount: 4
  },
  {
    id: "r8",
    hotelId: "h4",
    name: "Royal Sea Castle Suite",
    description: "The peak of regal Arabian hospitality. This sprawling suite offers a formal majlis dining room, master bedroom with rotating bed, and a private mosaic swimming pool.",
    price: 1500,
    bedType: "1 Presidential King Bed",
    capacity: 4,
    size: "240 m²",
    images: ["https://picsum.photos/seed/room_dubai_royal/800/600"],
    amenities: ["WiFi", "Private Pool", "Majlis Lounge", "Private Chef", "Bentley Airport Transfer"],
    availableCount: 1
  }
];

const defaultReviews: Review[] = [
  {
    id: "rev1",
    hotelId: "h1",
    userId: "u2",
    userName: "Charlotte Dupont",
    userAvatar: "https://picsum.photos/seed/user_charlotte/100/100",
    rating: 5,
    comment: "An absolute dream come true. The views of the Eiffel Tower from our room terrace were unforgettable, and the service was flawlessly elegant. The spa is a hidden sanctuary of bliss.",
    date: "2026-06-15",
    reply: "Dear Charlotte, we are thrilled to hear that your stay with us was so magical! We look forward to welcoming you back to your Parisian home.",
    helpfulCount: 12
  },
  {
    id: "rev2",
    hotelId: "h2",
    userId: "u3",
    userName: "Alexander Vance",
    userAvatar: "https://picsum.photos/seed/user_alex/100/100",
    rating: 5,
    comment: "Aura is not just a resort, it is a spiritual reset. Being suspended in the Ubud jungle while having a personal butler bring Ayurvedic dishes was heavenly. Highly recommend the massage.",
    date: "2026-06-20",
    helpfulCount: 8
  },
  {
    id: "rev3",
    hotelId: "h3",
    userId: "u4",
    userName: "Liam Henderson",
    userAvatar: "https://picsum.photos/seed/user_liam/100/100",
    rating: 4,
    comment: "Stunning penthouse and flawless automation system. The city views are legendary. The only minor setback was a slight delay in valet parking during rush hour, but the concierge handled it perfectly.",
    date: "2026-06-12",
    reply: "Hello Liam, thank you for your kind feedback. We've optimized our peak hour valet staffing to ensure instant response going forward.",
    helpfulCount: 5
  }
];

const defaultBlogs: Blog[] = [
  {
    id: "b1",
    title: "10 Secret Culinary Spots in Paris Selected by Our Head Concierge",
    content: "Paris is a city of layers, where the finest gastronomic adventures are often tucked away in hidden alleyways, behind simple unmarked wooden doors, or within secluded inner courtyards. In this guide, our Chief Concierge reveals 10 highly exclusive culinary venues favored by true Parisian gourmands. From a clandestine speakeasy serving 1920s vintage champagne paired with black truffles, to a centuries-old bakery that still fires its ovens with oak wood, discover the elite secrets that make Paris the absolute capital of world gastronomy.",
    author: "Jean-Luc Moreau",
    date: "2026-06-01",
    image: "https://picsum.photos/seed/blog1/800/600",
    category: "Gastronomy",
    tags: ["Paris", "Food", "Luxury Travel", "Concierge Secrets"],
    readTime: "6 min read",
    views: 452
  },
  {
    id: "b2",
    title: "The Ultimate Guide to Ayurvedic Healing Journeys in Sacred Ubud",
    content: "The jungle sanctuaries of Bali have long been magnetic portals for renewal, healing, and spiritual recalibration. True luxury is no longer defined merely by materials, but by inner tranquility and physical harmony. Ubud is the epicenter of this modern renaissance. Our comprehensive guide takes you deep into the ancient philosophy of Ayurveda, exploring custom dosha mapping, volcanic spring purification ceremonies, breathwork patterns in bamboo forest structures, and targeted botanical therapies that restore complete systemic balance.",
    author: "Ananda Devi",
    date: "2026-06-10",
    image: "https://picsum.photos/seed/blog2/800/600",
    category: "Wellness",
    tags: ["Bali", "Ayurveda", "Mindfulness", "Spa Resorts"],
    readTime: "8 min read",
    views: 310
  },
  {
    id: "b3",
    title: "Architectural Marvels: Reinventing the Classic Metropolitan Penthouse",
    content: "Metropolitan skylines are changing at a blinding pace, driven by a new class of design visionaries who reject conventional horizontal boxes. Today's elite penthouses are masterpiece-level monuments of structural art. We explore the design principles of the world's most dramatic sky mansions—examining the integration of double-height structural glass sails, automated indoor botanic gardens, suspended cantilever pools that hang directly over bustling city streets, and robust custom security environments.",
    author: "Marcus Sterling",
    date: "2026-06-18",
    image: "https://picsum.photos/seed/blog3/800/600",
    category: "Design",
    tags: ["New York", "Architecture", "Luxury Living", "Penthouses"],
    readTime: "5 min read",
    views: 289
  }
];

const defaultCoupons: Coupon[] = [
  { code: "WELCOME10", discountType: "percent", value: 10, active: true },
  { code: "LUXURY100", discountType: "fixed", value: 100, active: true },
  { code: "SUMMER25", discountType: "percent", value: 25, active: true }
];

const defaultBookings: Booking[] = [
  {
    id: "bk1",
    userId: "u2",
    hotelId: "h1",
    roomId: "r2",
    checkIn: "2026-07-05",
    checkOut: "2026-07-10",
    guests: { adults: 2, children: 0 },
    guestName: "Charlotte Dupont",
    guestEmail: "charlotte@example.com",
    guestPhone: "+33 6 1234 5678",
    totalAmount: 3750,
    couponUsed: "WELCOME10",
    status: "confirmed",
    specialRequests: "Please prepare room temperature bottle of vintage champagne upon arrival.",
    createdAt: "2026-06-25T14:30:00.000Z"
  }
];

const defaultMessages: Message[] = [
  {
    id: "msg1",
    name: "Isabella Rossi",
    email: "isabella@example.com",
    phone: "+39 333 444 5555",
    subject: "Exclusive Wedding Venue Booking Inquiry",
    message: "We are planning a highly exclusive private wedding ceremony for 80 guests next spring. We would love to enquire about reserving the complete villa cluster at Sapphire Bay in Santorini, Greece. Could you please send your corporate luxury wedding brochure and chef menus?",
    status: "unread",
    createdAt: "2026-06-28T09:15:00.000Z"
  }
];

// Load Database
let db: DBStore = {
  users: [
    { id: "u1", email: "admin@hotel.com", name: "Executive Admin", role: "admin", createdAt: "2026-01-01", wishlist: [] },
    { id: "u2", email: "user@hotel.com", name: "Charlotte Dupont", role: "user", createdAt: "2026-01-05", phone: "+33 6 1234 5678", wishlist: ["h2"] },
  ],
  hotels: defaultHotels,
  rooms: defaultRooms,
  bookings: defaultBookings,
  reviews: defaultReviews,
  blogs: defaultBlogs,
  coupons: defaultCoupons,
  messages: defaultMessages,
  subscribers: [],
  settings: defaultSettings
};

function loadDatabase() {
  try {
    if (fs.existsSync(STORE_PATH)) {
      const content = fs.readFileSync(STORE_PATH, "utf-8");
      db = JSON.parse(content);
      console.log("Database successfully loaded from file store.");
    } else {
      saveDatabase();
      console.log("Database initialized with premium mockup data.");
    }
  } catch (err) {
    console.error("Error loading database, resetting to default mockup:", err);
  }
}

function saveDatabase() {
  try {
    fs.writeFileSync(STORE_PATH, JSON.stringify(db, null, 2), "utf-8");
  } catch (err) {
    console.error("Failed to write database to disk:", err);
  }
}

// Initial load
loadDatabase();

async function startServer() {
  const app = express();
  app.use(express.json());

  // --------------------------------------------------------------------------
  // REST API Endpoints
  // --------------------------------------------------------------------------

  // Auth API
  app.post("/api/auth/login", (req, res) => {
    const { email, password } = req.body;
    const user = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (user) {
      // Simulate login success
      res.json({
        success: true,
        user,
        token: user.role === "admin" ? "admin-token-123456" : "user-token-123456"
      });
    } else {
      res.status(401).json({ success: false, message: "Invalid luxury credentials" });
    }
  });

  app.post("/api/auth/register", (req, res) => {
    const { name, email, phone } = req.body;
    if (!name || !email) {
      return res.status(400).json({ success: false, message: "Name and email required" });
    }
    const exists = db.users.some(u => u.email.toLowerCase() === email.toLowerCase());
    if (exists) {
      return res.status(400).json({ success: false, message: "Email already registered" });
    }
    const newUser: User = {
      id: "u" + (db.users.length + 1),
      email,
      name,
      phone,
      role: "user",
      wishlist: [],
      createdAt: new Date().toISOString()
    };
    db.users.push(newUser);
    saveDatabase();
    res.json({ success: true, user: newUser, token: "user-token-123456" });
  });

  // Settings API (CMS)
  app.get("/api/settings", (req, res) => {
    res.json(db.settings);
  });

  app.put("/api/settings", (req, res) => {
    db.settings = { ...db.settings, ...req.body };
    saveDatabase();
    res.json({ success: true, settings: db.settings });
  });

  // Hotels API
  app.get("/api/hotels", (req, res) => {
    res.json(db.hotels);
  });

  app.post("/api/hotels", (req, res) => {
    const hotel: Hotel = {
      id: "h" + (db.hotels.length + 1),
      rating: 5.0,
      reviewsCount: 0,
      images: req.body.images || [],
      ...req.body
    };
    db.hotels.push(hotel);
    saveDatabase();
    res.json({ success: true, hotel });
  });

  app.put("/api/hotels/:id", (req, res) => {
    const idx = db.hotels.findIndex(h => h.id === req.params.id);
    if (idx !== -1) {
      db.hotels[idx] = { ...db.hotels[idx], ...req.body };
      saveDatabase();
      res.json({ success: true, hotel: db.hotels[idx] });
    } else {
      res.status(404).json({ success: false, message: "Hotel not found" });
    }
  });

  app.delete("/api/hotels/:id", (req, res) => {
    db.hotels = db.hotels.filter(h => h.id !== req.params.id);
    db.rooms = db.rooms.filter(r => r.hotelId !== req.params.id);
    saveDatabase();
    res.json({ success: true });
  });

  // Rooms API
  app.get("/api/rooms", (req, res) => {
    const { hotelId } = req.query;
    if (hotelId) {
      res.json(db.rooms.filter(r => r.hotelId === hotelId));
    } else {
      res.json(db.rooms);
    }
  });

  app.post("/api/rooms", (req, res) => {
    const room: Room = {
      id: "r" + (db.rooms.length + 1),
      ...req.body
    };
    db.rooms.push(room);
    saveDatabase();
    res.json({ success: true, room });
  });

  app.put("/api/rooms/:id", (req, res) => {
    const idx = db.rooms.findIndex(r => r.id === req.params.id);
    if (idx !== -1) {
      db.rooms[idx] = { ...db.rooms[idx], ...req.body };
      saveDatabase();
      res.json({ success: true, room: db.rooms[idx] });
    } else {
      res.status(404).json({ success: false, message: "Room not found" });
    }
  });

  app.delete("/api/rooms/:id", (req, res) => {
    db.rooms = db.rooms.filter(r => r.id !== req.params.id);
    saveDatabase();
    res.json({ success: true });
  });

  // Bookings API
  app.get("/api/bookings", async (req, res) => {
    const supabaseBookings = await fetchBookingsFromSupabase();
    if (supabaseBookings !== null) {
      db.bookings = supabaseBookings;
      saveDatabase();
      res.json(supabaseBookings);
    } else {
      res.json(db.bookings);
    }
  });

  app.post("/api/bookings", async (req, res) => {
    const booking: Booking = {
      id: "bk" + (db.bookings.length + 1),
      status: "confirmed",
      createdAt: new Date().toISOString(),
      ...req.body
    };
    db.bookings.push(booking);
    saveDatabase();
    
    const success = await saveBookingToSupabase(booking);
    res.json({ success: true, booking, supabaseSynced: success });
  });

  app.put("/api/bookings/:id", async (req, res) => {
    const idx = db.bookings.findIndex(b => b.id === req.params.id);
    if (idx !== -1) {
      db.bookings[idx] = { ...db.bookings[idx], ...req.body };
      saveDatabase();
      
      const success = await saveBookingToSupabase(db.bookings[idx]);
      res.json({ success: true, booking: db.bookings[idx], supabaseSynced: success });
    } else {
      res.status(404).json({ success: false, message: "Booking not found" });
    }
  });

  // Reviews API
  app.get("/api/reviews", (req, res) => {
    res.json(db.reviews);
  });

  app.post("/api/reviews", (req, res) => {
    const review: Review = {
      id: "rev" + (db.reviews.length + 1),
      helpfulCount: 0,
      date: new Date().toISOString().split("T")[0],
      ...req.body
    };
    db.reviews.push(review);
    
    // Recalculate average rating of hotel
    const hotelReviews = db.reviews.filter(r => r.hotelId === review.hotelId);
    const avgRating = parseFloat((hotelReviews.reduce((sum, r) => sum + r.rating, 0) / hotelReviews.length).toFixed(1));
    const hIdx = db.hotels.findIndex(h => h.id === review.hotelId);
    if (hIdx !== -1) {
      db.hotels[hIdx].rating = avgRating;
      db.hotels[hIdx].reviewsCount = hotelReviews.length;
    }

    saveDatabase();
    res.json({ success: true, review });
  });

  app.post("/api/reviews/:id/reply", (req, res) => {
    const review = db.reviews.find(r => r.id === req.params.id);
    if (review) {
      review.reply = req.body.reply;
      saveDatabase();
      res.json({ success: true, review });
    } else {
      res.status(404).json({ success: false, message: "Review not found" });
    }
  });

  // Blogs API
  app.get("/api/blogs", (req, res) => {
    res.json(db.blogs);
  });

  app.post("/api/blogs", (req, res) => {
    const blog: Blog = {
      id: "b" + (db.blogs.length + 1),
      views: 0,
      date: new Date().toISOString().split("T")[0],
      ...req.body
    };
    db.blogs.push(blog);
    saveDatabase();
    res.json({ success: true, blog });
  });

  app.put("/api/blogs/:id", (req, res) => {
    const idx = db.blogs.findIndex(b => b.id === req.params.id);
    if (idx !== -1) {
      db.blogs[idx] = { ...db.blogs[idx], ...req.body };
      saveDatabase();
      res.json({ success: true, blog: db.blogs[idx] });
    } else {
      res.status(404).json({ success: false, message: "Blog not found" });
    }
  });

  app.delete("/api/blogs/:id", (req, res) => {
    db.blogs = db.blogs.filter(b => b.id !== req.params.id);
    saveDatabase();
    res.json({ success: true });
  });

  // Contacts / Messages API
  app.get("/api/messages", (req, res) => {
    res.json(db.messages);
  });

  app.post("/api/messages", (req, res) => {
    const msg: Message = {
      id: "msg" + (db.messages.length + 1),
      status: "unread",
      createdAt: new Date().toISOString(),
      ...req.body
    };
    db.messages.push(msg);
    saveDatabase();
    res.json({ success: true, message: msg });
  });

  app.put("/api/messages/:id/read", (req, res) => {
    const msg = db.messages.find(m => m.id === req.params.id);
    if (msg) {
      msg.status = "read";
      saveDatabase();
      res.json({ success: true, message: msg });
    } else {
      res.status(404).json({ success: false, message: "Message not found" });
    }
  });

  // Coupons API
  app.get("/api/coupons", (req, res) => {
    res.json(db.coupons);
  });

  app.post("/api/coupons", (req, res) => {
    const coupon: Coupon = {
      ...req.body,
      active: true
    };
    db.coupons.push(coupon);
    saveDatabase();
    res.json({ success: true, coupon });
  });

  // Newsletter API
  app.post("/api/subscribers", (req, res) => {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: "Email required" });
    const exists = db.subscribers.some(s => s.email.toLowerCase() === email.toLowerCase());
    if (!exists) {
      db.subscribers.push({ email, subscribedAt: new Date().toISOString() });
      saveDatabase();
    }
    res.json({ success: true });
  });

  // Admin Dashboard Statistics API
  app.get("/api/dashboard/stats", (req, res) => {
    const totalBookings = db.bookings.length;
    const confirmedBookings = db.bookings.filter(b => b.status === "confirmed").length;
    const cancelledBookings = db.bookings.filter(b => b.status === "cancelled").length;
    
    const revenue = db.bookings
      .filter(b => b.status === "confirmed")
      .reduce((sum, b) => sum + b.totalAmount, 0);

    const recentActivity = db.bookings.slice(-5).map(b => {
      const hotel = db.hotels.find(h => h.id === b.hotelId);
      return {
        id: b.id,
        type: "booking",
        title: `New booking at ${hotel ? hotel.name : "Luxury Hotel"}`,
        subtitle: `Amount: $${b.totalAmount} by ${b.guestName}`,
        time: new Date(b.createdAt).toLocaleDateString()
      };
    }).concat(db.messages.slice(-3).map(m => ({
      id: m.id,
      type: "message",
      title: `Inquiry: ${m.subject}`,
      subtitle: `From: ${m.name}`,
      time: new Date(m.createdAt).toLocaleDateString()
    })));

    res.json({
      revenue,
      bookingsCount: totalBookings,
      confirmedBookings,
      cancelledBookings,
      usersCount: db.users.length,
      hotelsCount: db.hotels.length,
      reviewsCount: db.reviews.length,
      messagesCount: db.messages.length,
      subscribersCount: db.subscribers.length,
      recentActivity: recentActivity.sort((a,b) => b.id.localeCompare(a.id)).slice(0, 8)
    });
  });

  // Gemini Travel Assistant Concierge API
  app.post("/api/ai/chat", async (req, res) => {
    const { prompt, history } = req.body;
    
    const client = getGeminiClient();
    
    const systemInstruction = `You are "Worldora Concierge", an elite, sophisticated, and highly knowledgeable AI Travel Concierge and Personal Assistant for Worldora Stay. 
Your tone is incredibly elegant, helpful, and premium—similar to a Clefs d'Or concierge at a five-star luxury hotel in Paris, Monaco, or London.
Our hotel database currently includes:
${JSON.stringify(db.hotels.map(h => ({ id: h.id, name: h.name, city: h.city, country: h.country, price: h.price, rating: h.rating, amenities: h.amenities, category: h.category })), null, 2)}

Provide luxurious advice about where to travel, which of our suites to choose, local gastronomic spots, and tailored leisure itineraries. Keep your formatting gorgeous with clean paragraphs and occasional bullet points. Always stay in character as a luxury hospitality professional.`;

    if (client) {
      try {
        // Prepare chat history in GoogleGenAI format
        // client.chats.create wants simple messages.
        const chat = client.chats.create({
          model: "gemini-3.5-flash",
          config: {
            systemInstruction,
            temperature: 0.8
          }
        });
        
        // Feed history if present
        if (history && history.length > 0) {
          // Re-create conversation context
          for (const turn of history.slice(-6)) {
            // Send each message in sequence or populate history
            // For simplicity, we can also compile a single rich prompt with history
          }
        }
        
        const response = await chat.sendMessage({ message: prompt });
        res.json({ text: response.text });
      } catch (err) {
        console.error("Gemini API call failed, using luxury assistant simulation:", err);
        res.json({ text: simulateConciergeResponse(prompt) });
      }
    } else {
      // Simulate reply
      res.json({ text: simulateConciergeResponse(prompt) });
    }
  });

  function simulateConciergeResponse(userPrompt: string): string {
    const p = userPrompt.toLowerCase();
    let reply = `Good day, esteemed guest. It is my absolute honor to assist you today.\n\n`;
    
    if (p.includes("paris") || p.includes("zenith")) {
      reply += `Ah, Paris! The city of light and eternal romance. Our **The Grand Zenith Palace** stands as a beacon of high Parisian art. Located directly on the Avenue des Champs-Élysées, I would highly recommend reserving our **Eiffel View Executive Suite**. Imagine sipping rare vintage champagne on your private terrace while the Eiffel Tower sparkles on the hour. For dining, our Michelin-starred kitchen will tailor a dynamic tasting menu to your exact preferences. Shall I proceed with checking availability for your dates?`;
    } else if (p.includes("bali") || p.includes("aura") || p.includes("wellness")) {
      reply += `An extraordinary choice. Our **Aura Wellness Resort & Spa** in Ubud, Bali, is designed around physical and spiritual renewal. Nested deep within the jungle canopy, it offers our spectacular **Sacred Stream Infinity Villa**, which features an infinity plunge pool cantilevered over the volcanic valley. You will be assigned a Clefs d'Or Butler to arrange Ayurvedic mapping, sunrise forest yoga, and holistic stone massage therapies. Truly, a paradise for the soul.`;
    } else if (p.includes("dubai") || p.includes("reserve") || p.includes("beach")) {
      reply += `Indeed, magnificent. **Sands of Oasis Reserve** in Dubai represents the pinnacle of Arabian grandeur. Situated on a private peninsula, it offers direct access to golden sands and our **Royal Sea Castle Suite**, which features a private indoor swimming pool and dedicated butler. We can arrange luxury yacht charters from our marina or helicopter sightseeing from the private pad. How may we craft this majestic stay for you?`;
    } else if (p.includes("cheap") || p.includes("price") || p.includes("discount")) {
      reply += `We always ensure that our distinguished guests receive the most exquisite value. We currently offer several exclusive promo codes, such as **WELCOME10** for an immediate 10% privilege discount on all suites, and **LUXURY100** for a $100 luxury voucher on stays longer than 3 nights. Our curated collection offers boutique comforts starting from $360 per night in Bali. May I guide you to our best deals?`;
    } else {
      reply += `Allow me to introduce our curated havens of pure tranquility. We offer world-class, five-star residences in Paris, Ubud, Santorini, Dubai, New York, and Zermatt. Each property offers handpicked suite collections, subterranean spa pathways, and bespoke hospitality tailored entirely around you. \n\nTell me, what style of escape are you seeking? A romantic city terrace, an organic jungle retreat, or a pristine private marine beach? It would be my utmost pleasure to recommend the perfect destination.`;
    }
    return reply;
  }

  // Vite integration
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Luxury Hotel Booking System full-stack server running on port ${PORT}`);
  });
}

startServer();
