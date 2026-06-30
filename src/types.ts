/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
  avatar?: string;
  wishlist: string[]; // hotelIds
  createdAt: string;
  phone?: string;
}

export interface Hotel {
  id: string;
  name: string;
  description: string;
  country: string;
  city: string;
  price: number; // base price
  rating: number;
  reviewsCount: number;
  image: string;
  images: string[];
  amenities: string[];
  propertyType: string; // Hotel, Resort, Villa, Apartment
  guestCapacity: number;
  address: string;
  featured: boolean;
  category: string; // Luxury, Boutique, Budget, Wellness
}

export interface Room {
  id: string;
  hotelId: string;
  name: string;
  description: string;
  price: number;
  bedType: string;
  capacity: number;
  size: string; // e.g. "45 m²"
  images: string[];
  amenities: string[];
  availableCount: number;
}

export interface Booking {
  id: string;
  userId: string;
  hotelId: string;
  roomId: string;
  checkIn: string;
  checkOut: string;
  guests: {
    adults: number;
    children: number;
  };
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  totalAmount: number;
  couponUsed?: string;
  status: 'confirmed' | 'pending' | 'cancelled';
  specialRequests?: string;
  createdAt: string;
}

export interface Review {
  id: string;
  hotelId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  comment: string;
  date: string;
  reply?: string;
  helpfulCount: number;
}

export interface Blog {
  id: string;
  title: string;
  content: string;
  author: string;
  date: string;
  image: string;
  category: string;
  tags: string[];
  readTime: string;
  views: number;
}

export interface Coupon {
  code: string;
  discountType: 'percent' | 'fixed';
  value: number;
  active: boolean;
}

export interface Message {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: 'unread' | 'read';
  createdAt: string;
}

export interface Subscriber {
  email: string;
  subscribedAt: string;
}

export interface CMSSettings {
  logoText: string;
  brandName: string;
  tagline: string;
  primaryColor: string; // hex
  secondaryColor: string; // hex
  footerText: string;
  heroTitle: string;
  heroSubtitle: string;
  contactPhone: string;
  contactEmail: string;
  contactAddress: string;
  socialLinks: {
    facebook: string;
    instagram: string;
    twitter: string;
    linkedin: string;
  };
}
