'use client';

import { useState } from 'react';
import Image from 'next/image';
import {
  MessageCircle,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Star,
  Share2,
  CheckCircle,
  Clock,
  Globe,
  ExternalLink,
  ChevronRight,
  Sparkles,
  ShoppingBag,
  User,
  Image as ImageIcon,
  X,
  Maximize2,
  BookOpen,
  Award,
  Briefcase,
  Layers,
} from 'lucide-react';
import { BookingModal } from './BookingModal';
import { ReviewModal } from './ReviewModal';

interface Service {
  id: string;
  name: string;
  description?: string | null;
  price: number;
  duration?: string | null;
  imageUrl?: string | null;
}

interface Product {
  id: string;
  name: string;
  description?: string | null;
  price: number;
  imageUrl?: string | null;
  sku?: string | null;
}

interface SocialLink {
  id: string;
  platform: string;
  url: string;
  handle?: string | null;
}

interface BusinessHours {
  id: string;
  dayOfWeek: number;
  openTime?: string | null;
  closeTime?: string | null;
  isClosed: boolean;
}

interface Review {
  id: string;
  rating: number;
  customerName: string;
  comment: string;
  createdAt: string | Date;
  reply?: { replyText: string } | null;
}

interface ProfileData {
  id: string;
  username: string;
  profileType?: 'BUSINESS' | 'PERSONAL';
  businessName: string;
  personalTitle?: string | null;
  category: string;
  description?: string | null;
  avatarUrl?: string | null;
  aboutStory?: string | null;
  highlights?: string | null;
  galleryImages?: string | null;
  logoUrl?: string | null;
  coverUrl?: string | null;
  phone: string;
  whatsapp: string;
  email?: string | null;
  website?: string | null;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  isVerified: boolean;
  theme: string;
  brandingDisabled: boolean;
  services: Service[];
  products: Product[];
  socialLinks: SocialLink[];
  businessHours: BusinessHours[];
  reviews: Review[];
}

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export function PublicProfileView({ profile }: { profile: ProfileData }) {
  const isPersonal = profile.profileType === 'PERSONAL';
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'ABOUT' | 'GALLERY' | 'REVIEWS'>(isPersonal ? 'ABOUT' : 'OVERVIEW');
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [selectedServiceId, setSelectedServiceId] = useState<string | undefined>();
  const [activeLightboxImage, setActiveLightboxImage] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Helper for theme styling mapping
  const themeStyles: Record<string, { bg: string; card: string; text: string; accent: string; badge: string }> = {
    CLASSIC: {
      bg: 'bg-slate-900 text-slate-100',
      card: 'bg-slate-800/80 border-slate-700/60',
      text: 'text-white',
      accent: 'bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold',
      badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    },
    MODERN: {
      bg: 'bg-slate-950 text-slate-100',
      card: 'bg-slate-900/90 border-slate-800 backdrop-blur-md',
      text: 'text-white',
      accent: 'bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-600 hover:to-teal-500 text-slate-950 font-bold',
      badge: 'bg-teal-500/10 text-teal-400 border-teal-500/20',
    },
    ELEGANT: {
      bg: 'bg-stone-950 text-amber-50',
      card: 'bg-stone-900/90 border-stone-800/80',
      text: 'text-amber-100 font-serif',
      accent: 'bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold',
      badge: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    },
    DARK: {
      bg: 'bg-black text-white',
      card: 'bg-zinc-900/90 border-zinc-800',
      text: 'text-white',
      accent: 'bg-cyan-500 hover:bg-cyan-600 text-black font-bold',
      badge: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
    },
    MINIMAL: {
      bg: 'bg-zinc-900 text-zinc-100',
      card: 'bg-zinc-800/60 border-zinc-700/50',
      text: 'text-zinc-100',
      accent: 'bg-white hover:bg-zinc-200 text-black font-bold',
      badge: 'bg-zinc-800 text-zinc-300 border-zinc-700',
    },
    BUSINESS: {
      bg: 'bg-slate-950 text-slate-100',
      card: 'bg-blue-950/40 border-blue-900/40 backdrop-blur-sm',
      text: 'text-white',
      accent: 'bg-blue-500 hover:bg-blue-600 text-white font-bold',
      badge: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    },
  };

  const currentTheme = themeStyles[profile.theme] || themeStyles.MODERN;

  // Track event click utility
  const trackClick = (eventType: string) => {
    try {
      fetch('/api/analytics/event', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profileId: profile.id, eventType }),
      });
    } catch (e) {
      // Ignore
    }
  };

  // Parse gallery images string
  const galleryList = profile.galleryImages
    ? profile.galleryImages
        .split(',')
        .map((s) => s.trim())
        .filter((s) => s.length > 0)
    : [];

  // Parse accomplishment highlights
  const highlightList = profile.highlights
    ? profile.highlights
        .split(',')
        .map((s) => s.trim())
        .filter((s) => s.length > 0)
    : [];

  // WhatsApp formatted link — wa.me requires international format (no +, no leading 0)
  // Handles: 09164310578 → 2349164310578 | +2349164310578 → 2349164310578 | 2349164310578 → 2349164310578
  const formatWhatsappNumber = (num: string): string => {
    // Strip everything except digits
    let digits = num.replace(/[^0-9]/g, '');
    // Nigerian local format: starts with 0 and is 11 digits → replace 0 with 234
    if (digits.startsWith('0') && digits.length === 11) {
      digits = '234' + digits.slice(1);
    }
    // If it somehow doesn't have a country code yet (10 digits), assume Nigeria
    if (digits.length === 10) {
      digits = '234' + digits;
    }
    return digits;
  };
  const formattedWhatsapp = formatWhatsappNumber(profile.whatsapp);
  const whatsappUrl = `https://wa.me/${formattedWhatsapp}?text=${encodeURIComponent(
    `Hello ${profile.businessName}, I found your digital profile and would like to connect.`
  )}`;


  const handleShare = async () => {
    const shareUrl = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: profile.businessName,
          text: profile.description || `Connect with ${profile.businessName}`,
          url: shareUrl,
        });
        return;
      } catch (e) {
        // Fallback to copy
      }
    }
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  // Compute average rating
  const totalReviews = profile.reviews.length;
  const avgRating = totalReviews > 0 ? (profile.reviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews).toFixed(1) : '5.0';

  // Check today's business hours
  const todayDay = new Date().getDay();
  const todayHours = profile.businessHours.find((h) => h.dayOfWeek === todayDay);
  const isOpenToday = todayHours && !todayHours.isClosed;

  return (
    <div className={`min-h-screen ${currentTheme.bg} pb-20 font-sans selection:bg-emerald-500 selection:text-black`}>
      {/* Cover Image Header with Blend Mode Effect */}
      <div className="relative h-52 sm:h-72 w-full bg-slate-900 overflow-hidden group">
        {profile.coverUrl ? (
          <Image
            src={profile.coverUrl}
            alt="Cover"
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            priority
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-emerald-950 via-teal-900 to-slate-950 opacity-90" />
        )}
        {/* Hover Gradient Blend Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent mix-blend-multiply transition-opacity duration-500 group-hover:opacity-90" />
        <div className="absolute inset-0 bg-emerald-500/10 opacity-0 group-hover:opacity-100 mix-blend-overlay transition-opacity duration-700" />

        {/* Share Button top right */}
        <button
          onClick={handleShare}
          className="absolute top-4 right-4 z-10 bg-black/60 hover:bg-black/90 border border-white/20 text-white rounded-full p-2.5 backdrop-blur-md transition-all duration-300 shadow-lg flex items-center gap-2 text-xs font-semibold px-4 hover:scale-105 active:scale-95"
        >
          <Share2 className="w-4 h-4 text-emerald-400 animate-pulse" />
          <span>{copied ? 'Link Copied!' : 'Share Profile'}</span>
        </button>
      </div>

      {/* Main Profile Container */}
      <div className="max-w-2xl mx-auto px-4 -mt-20 sm:-mt-24 relative z-20 space-y-6">
        {/* Profile Header Card (Glassmorphism & Glow Blend Mode) */}
        <div
          className={`${currentTheme.card} border rounded-3xl p-6 sm:p-8 shadow-2xl text-center relative overflow-visible backdrop-blur-2xl transition-all duration-500 hover:shadow-[0_0_40px_rgba(16,185,129,0.15)] hover:border-emerald-500/30`}
        >
          {/* Main Photo / Avatar Display (Interactive Glow & Micro-zoom) */}
          <div className="flex items-center justify-center -mt-24 sm:-mt-28 mb-4 relative z-10">
            <div
              onClick={() => {
                const img = profile.avatarUrl || profile.logoUrl;
                if (img) setActiveLightboxImage(img);
              }}
              className="relative w-48 h-60 sm:w-60 sm:h-76 rounded-3xl border-4 border-slate-950 overflow-hidden bg-slate-950 shadow-2xl shrink-0 ring-4 ring-emerald-500/30 group cursor-pointer hover:ring-emerald-400/70 hover:shadow-[0_0_50px_rgba(16,185,129,0.35)] transition-all duration-500 hover:scale-[1.03]"
              title="Click to view full picture"
            >
              {profile.avatarUrl ? (
                <Image
                  src={profile.avatarUrl}
                  alt={profile.businessName}
                  fill
                  className="object-cover object-top group-hover:scale-105 group-hover:brightness-110 transition-all duration-500"
                  priority
                />
              ) : profile.logoUrl ? (
                <Image
                  src={profile.logoUrl}
                  alt={profile.businessName}
                  fill
                  className="object-cover group-hover:scale-105 group-hover:brightness-110 transition-all duration-500"
                  priority
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center text-5xl font-black text-emerald-400">
                  {profile.businessName.charAt(0).toUpperCase()}
                </div>
              )}

              {/* Sub-badge if both Avatar and Logo exist */}
              {profile.avatarUrl && profile.logoUrl && (
                <div
                  className="absolute bottom-2 right-2 w-10 h-10 rounded-2xl border-2 border-slate-950 overflow-hidden bg-slate-900 shadow-xl group-hover:scale-110 transition-transform duration-300"
                  title="Company Logo"
                >
                  <Image src={profile.logoUrl} alt="Logo" fill className="object-contain p-0.5" />
                </div>
              )}
            </div>
          </div>

          {/* Name & Verification Badge */}
          <div className="flex items-center justify-center gap-2 mb-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">{profile.businessName}</h1>
            {profile.isVerified && (
              <span className="inline-flex items-center text-emerald-400" title="Verified Profile">
                <CheckCircle className="w-5 h-5 fill-emerald-400/20" />
              </span>
            )}
          </div>

          {/* Personal Headline or Category (ALWAYS Open Status) */}
          {isPersonal ? (
            profile.personalTitle && <p className="text-emerald-400 text-sm font-semibold mb-3">{profile.personalTitle}</p>
          ) : (
            <div className="flex items-center justify-center gap-2 text-xs mb-3 flex-wrap">
              <span className={`px-3 py-1 rounded-full border font-semibold ${currentTheme.badge}`}>{profile.category}</span>
              <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold flex items-center gap-1.5 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Open Now</span>
                {todayHours && !todayHours.isClosed && (
                  <span className="text-emerald-400/80">({todayHours.openTime} - {todayHours.closeTime})</span>
                )}
              </span>
            </div>
          )}

          {/* Roles / Accomplishments Pill Badges */}
          {highlightList.length > 0 && (
            <div className="flex flex-wrap items-center justify-center gap-1.5 mb-4">
              {highlightList.map((hl, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 rounded-full bg-slate-800/90 text-slate-300 text-xs font-medium border border-slate-700/80 hover:border-emerald-500/40 hover:text-white transition-all duration-300 flex items-center gap-1 hover:scale-105 shadow-sm"
                >
                  <Award className="w-3 h-3 text-amber-400" />
                  <span>{hl}</span>
                </span>
              ))}
            </div>
          )}

          {/* Bio / Description */}
          {profile.description && <p className="text-slate-300 text-sm leading-relaxed mb-4 max-w-md mx-auto">{profile.description}</p>}

          {/* Location */}
          {(profile.address || profile.city || profile.state) && (
            <div className="flex items-center justify-center gap-1.5 text-xs text-slate-400 mb-5">
              <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{[profile.address, profile.city, profile.state].filter(Boolean).join(', ')}</span>
            </div>
          )}

          {/* Primary Quick Action Buttons (Shimmer & Hover Microinteractions) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackClick('WHATSAPP_CLICK')}
              className="flex flex-col items-center justify-center p-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 via-emerald-400 to-teal-400 bg-[length:200%_100%] hover:bg-right text-slate-950 font-bold transition-all duration-500 shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:scale-[1.04] active:scale-95 group"
            >
              <MessageCircle className="w-6 h-6 mb-1 text-slate-950 group-hover:scale-110 group-hover:-rotate-6 transition-transform duration-300" />
              <span className="text-xs">WhatsApp</span>
            </a>

            <a
              href={`tel:${profile.phone}`}
              onClick={() => trackClick('PHONE_CLICK')}
              className="flex flex-col items-center justify-center p-3.5 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-white font-semibold transition-all duration-300 border border-slate-700/80 hover:border-teal-500/40 hover:scale-[1.04] active:scale-95 shadow-md hover:shadow-teal-500/10 group"
            >
              <Phone className="w-5 h-5 mb-1 text-teal-400 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300" />
              <span className="text-xs">Call</span>
            </a>

            {profile.services.length > 0 ? (
              <button
                onClick={() => {
                  setSelectedServiceId(undefined);
                  setBookingModalOpen(true);
                }}
                className="flex flex-col items-center justify-center p-3.5 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-white font-semibold transition-all duration-300 border border-slate-700/80 hover:border-amber-500/40 hover:scale-[1.04] active:scale-95 shadow-md hover:shadow-amber-500/10 group"
              >
                <Calendar className="w-5 h-5 mb-1 text-amber-400 group-hover:scale-110 group-hover:-translate-y-0.5 transition-transform duration-300" />
                <span className="text-xs">{isPersonal ? 'Book Session' : 'Book'}</span>
              </button>
            ) : profile.website ? (
              <a
                href={profile.website}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackClick('WEBSITE_CLICK')}
                className="flex flex-col items-center justify-center p-3.5 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-white font-semibold transition-all duration-300 border border-slate-700/80 hover:border-cyan-500/40 hover:scale-[1.04] active:scale-95 shadow-md hover:shadow-cyan-500/10 group"
              >
                <Globe className="w-5 h-5 mb-1 text-cyan-400 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300" />
                <span className="text-xs">Website</span>
              </a>
            ) : profile.address ? (
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                  `${profile.businessName} ${profile.address} ${profile.city}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackClick('WEBSITE_CLICK')}
                className="flex flex-col items-center justify-center p-3.5 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-white font-semibold transition-all duration-300 border border-slate-700/80 hover:border-purple-500/40 hover:scale-[1.04] active:scale-95 shadow-md hover:shadow-purple-500/10 group"
              >
                <MapPin className="w-5 h-5 mb-1 text-purple-400 group-hover:scale-110 group-hover:-translate-y-0.5 transition-transform duration-300" />
                <span className="text-xs">Directions</span>
              </a>
            ) : (
              <button
                onClick={handleShare}
                className="flex flex-col items-center justify-center p-3.5 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-white font-semibold transition-all duration-300 border border-slate-700/80 hover:border-emerald-500/40 hover:scale-[1.04] active:scale-95 shadow-md hover:shadow-emerald-500/10 group"
              >
                <Share2 className="w-5 h-5 mb-1 text-emerald-400 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300" />
                <span className="text-xs">Share</span>
              </button>
            )}

            {profile.website && profile.services.length > 0 ? (
              <a
                href={profile.website}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackClick('WEBSITE_CLICK')}
                className="flex flex-col items-center justify-center p-3.5 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-white font-semibold transition-all duration-300 border border-slate-700/80 hover:border-cyan-500/40 hover:scale-[1.04] active:scale-95 shadow-md hover:shadow-cyan-500/10 group"
              >
                <Globe className="w-5 h-5 mb-1 text-cyan-400 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300" />
                <span className="text-xs">Website</span>
              </a>
            ) : profile.address && (profile.services.length > 0 || profile.website) ? (
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                  `${profile.businessName} ${profile.address} ${profile.city}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackClick('WEBSITE_CLICK')}
                className="flex flex-col items-center justify-center p-3.5 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-white font-semibold transition-all duration-300 border border-slate-700/80 hover:border-purple-500/40 hover:scale-[1.04] active:scale-95 shadow-md hover:shadow-purple-500/10 group"
              >
                <MapPin className="w-5 h-5 mb-1 text-purple-400 group-hover:scale-110 group-hover:-translate-y-0.5 transition-transform duration-300" />
                <span className="text-xs">Directions</span>
              </a>
            ) : (
              <button
                onClick={() => setReviewModalOpen(true)}
                className="flex flex-col items-center justify-center p-3.5 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-white font-semibold transition-all duration-300 border border-slate-700/80 hover:border-amber-500/40 hover:scale-[1.04] active:scale-95 shadow-md hover:shadow-amber-500/10 group"
              >
                <Star className="w-5 h-5 mb-1 text-amber-400 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300" />
                <span className="text-xs">Endorse</span>
              </button>
            )}
          </div>
        </div>

        {/* Smooth Scroll Navigation Bar with Pill Hover Animations */}
        <div className="sticky top-4 z-30 flex items-center justify-center gap-1.5 p-1.5 bg-slate-950/85 border border-slate-800/90 rounded-2xl backdrop-blur-2xl shadow-xl overflow-x-auto no-scrollbar">
          <a
            href="#about"
            className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-300 hover:text-white hover:bg-slate-800/90 hover:scale-[1.04] active:scale-95 transition-all duration-300 flex items-center gap-1.5 shrink-0 group"
          >
            <BookOpen className="w-3.5 h-3.5 text-emerald-400 group-hover:rotate-12 transition-transform" />
            <span>{isPersonal ? 'Bio & Journey' : 'About'}</span>
          </a>

          {profile.services.length > 0 && (
            <a
              href="#services"
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-300 hover:text-white hover:bg-slate-800/90 hover:scale-[1.04] active:scale-95 transition-all duration-300 flex items-center gap-1.5 shrink-0 group"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400 group-hover:rotate-12 transition-transform" />
              <span>Services</span>
            </a>
          )}

          {profile.products.length > 0 && (
            <a
              href="#products"
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-300 hover:text-white hover:bg-slate-800/90 hover:scale-[1.04] active:scale-95 transition-all duration-300 flex items-center gap-1.5 shrink-0 group"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-teal-400 group-hover:rotate-12 transition-transform" />
              <span>Catalog</span>
            </a>
          )}

          {galleryList.length > 0 && (
            <a
              href="#gallery"
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-300 hover:text-white hover:bg-slate-800/90 hover:scale-[1.04] active:scale-95 transition-all duration-300 flex items-center gap-1.5 shrink-0 group"
            >
              <ImageIcon className="w-3.5 h-3.5 text-purple-400 group-hover:rotate-12 transition-transform" />
              <span>Gallery ({galleryList.length})</span>
            </a>
          )}

          <a
            href="#reviews"
            className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-300 hover:text-white hover:bg-slate-800/90 hover:scale-[1.04] active:scale-95 transition-all duration-300 flex items-center gap-1.5 shrink-0 group"
          >
            <Star className="w-3.5 h-3.5 text-yellow-400 group-hover:rotate-12 transition-transform" />
            <span>{isPersonal ? 'Endorsements' : 'Reviews'} ({totalReviews})</span>
          </a>
        </div>

        {/* SECTION 1: STORY & BIO */}
        <section id="about" className={`${currentTheme.card} border rounded-3xl p-6 shadow-xl space-y-6 scroll-mt-20`}>
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-emerald-400" />
              <span>{isPersonal ? `About ${profile.businessName}` : `About ${profile.businessName}`}</span>
            </h2>
          </div>

          <div className="flex flex-col sm:flex-row items-start gap-6">
            {profile.avatarUrl && (
              <div
                onClick={() => {
                  if (profile.avatarUrl) setActiveLightboxImage(profile.avatarUrl);
                }}
                className="relative w-36 h-36 sm:w-48 sm:h-48 rounded-2xl border-2 border-emerald-500/40 overflow-hidden bg-slate-950 shrink-0 mx-auto sm:mx-0 shadow-xl cursor-pointer hover:scale-[1.02] transition"
                title="Click to view full image"
              >
                <Image src={profile.avatarUrl} alt={profile.businessName} fill className="object-cover object-top" />
              </div>
            )}

            <div className="space-y-4 text-slate-300 text-sm leading-relaxed flex-1">
              {profile.aboutStory ? (
                profile.aboutStory.split('\n\n').map((paragraph, idx) => (
                  <p key={idx} className="text-slate-300 leading-relaxed">
                    {paragraph}
                  </p>
                ))
              ) : (
                <p className="text-slate-400 text-xs italic">
                  Welcome to the official profile of {profile.businessName}. Connect via social media or send a direct WhatsApp message to get in touch.
                </p>
              )}
            </div>
          </div>

          {/* Social Connect Links with Branded Icons & Handles */}
          {profile.socialLinks.length > 0 && (
            <div className="pt-4 border-t border-slate-800 space-y-3">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Connect Across Platforms</h3>
              <div className="flex flex-wrap gap-2.5">
                {profile.socialLinks.map((social) => {
                  const p = (social.platform || '').toLowerCase();
                  let brandColorClass = 'hover:border-emerald-500/60 hover:shadow-emerald-500/10';

                  if (p.includes('instagram')) brandColorClass = 'hover:border-pink-500/60 hover:shadow-pink-500/20';
                  else if (p.includes('facebook')) brandColorClass = 'hover:border-blue-500/60 hover:shadow-blue-500/20';
                  else if (p.includes('twitter') || p.includes('x')) brandColorClass = 'hover:border-sky-400/60 hover:shadow-sky-400/20';
                  else if (p.includes('linkedin')) brandColorClass = 'hover:border-blue-600/60 hover:shadow-blue-600/20';
                  else if (p.includes('youtube')) brandColorClass = 'hover:border-red-500/60 hover:shadow-red-500/20';
                  else if (p.includes('whatsapp')) brandColorClass = 'hover:border-emerald-400/60 hover:shadow-emerald-400/20';

                  return (
                    <a
                      key={social.id}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => trackClick('WEBSITE_CLICK')}
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-slate-900/90 hover:bg-slate-900 text-slate-200 hover:text-white text-xs font-bold border border-slate-800 ${brandColorClass} hover:scale-105 active:scale-95 transition-all duration-300 shadow-md group`}
                    >
                      {p.includes('instagram') ? (
                        <svg className="w-4 h-4 fill-pink-400 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300" viewBox="0 0 24 24">
                          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                        </svg>
                      ) : p.includes('facebook') ? (
                        <svg className="w-4 h-4 fill-blue-400 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300" viewBox="0 0 24 24">
                          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                        </svg>
                      ) : p.includes('twitter') || p.includes('x') ? (
                        <svg className="w-4 h-4 fill-sky-400 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300" viewBox="0 0 24 24">
                          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                        </svg>
                      ) : p.includes('linkedin') ? (
                        <svg className="w-4 h-4 fill-blue-500 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300" viewBox="0 0 24 24">
                          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                        </svg>
                      ) : p.includes('youtube') ? (
                        <svg className="w-4 h-4 fill-red-500 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300" viewBox="0 0 24 24">
                          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                        </svg>
                      ) : p.includes('whatsapp') ? (
                        <MessageCircle className="w-4 h-4 text-emerald-400 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300" />
                      ) : (
                        <Globe className="w-4 h-4 text-teal-400 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300" />
                      )}
                      <span>{social.handle || social.platform}</span>
                      <ExternalLink className="w-3 h-3 text-slate-500 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
                    </a>
                  );
                })}
              </div>
            </div>
          )}
        </section>

        {/* SECTION 2: SERVICES & INITIATIVES */}
        {profile.services.length > 0 && (
          <section id="services" className={`${currentTheme.card} border rounded-3xl p-6 shadow-xl scroll-mt-20 space-y-4`}>
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-emerald-400 animate-pulse" />
                <span>{isPersonal ? 'Speaking & Advisory Services' : 'Our Services'}</span>
              </h2>
              <span className="text-xs text-slate-400">{profile.services.length} Available</span>
            </div>

            <div className="space-y-3">
              {profile.services.map((service) => (
                <div
                  key={service.id}
                  className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-4 flex items-center justify-between gap-4 hover:border-emerald-500/50 hover:shadow-[0_0_25px_rgba(16,185,129,0.15)] hover:scale-[1.01] transition-all duration-300 group"
                >
                  <div className="space-y-1">
                    <h3 className="font-bold text-white text-sm group-hover:text-emerald-400 transition-colors">{service.name}</h3>
                    {service.description && <p className="text-xs text-slate-400 line-clamp-2">{service.description}</p>}
                    <div className="flex items-center gap-3 text-xs pt-1">
                      <span className="font-bold text-emerald-400">₦{service.price.toLocaleString()}</span>
                      {service.duration && <span className="text-slate-500">• {service.duration}</span>}
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedServiceId(service.id);
                      setBookingModalOpen(true);
                    }}
                    className="shrink-0 bg-slate-800 group-hover:bg-emerald-500 group-hover:text-slate-950 text-emerald-400 text-xs font-bold px-3.5 py-2 rounded-xl border border-slate-700 group-hover:border-emerald-400 transition-all duration-300 flex items-center gap-1 active:scale-95 shadow-sm"
                  >
                    <span>Book</span>
                    <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-300" />
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* SECTION 3: PRODUCT CATALOG */}
        {profile.products.length > 0 && (
          <section id="products" className={`${currentTheme.card} border rounded-3xl p-6 shadow-xl scroll-mt-20 space-y-4`}>
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-teal-400 animate-bounce" />
                <span>{isPersonal ? 'Books & Digital Resources' : 'Product Catalog'}</span>
              </h2>
              <span className="text-xs text-slate-400">{profile.products.length} Items</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {profile.products.map((product) => (
                <div
                  key={product.id}
                  className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-4 flex flex-col justify-between space-y-3 hover:border-teal-500/50 hover:shadow-[0_0_25px_rgba(20,184,166,0.15)] hover:scale-[1.02] transition-all duration-300 group"
                >
                  <div>
                    <h3 className="font-bold text-white text-sm group-hover:text-teal-400 transition-colors">{product.name}</h3>
                    {product.description && <p className="text-xs text-slate-400 mt-1 line-clamp-2">{product.description}</p>}
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-slate-800/50">
                    <span className="font-bold text-teal-400 text-sm">₦{product.price.toLocaleString()}</span>
                    <a
                      href={`https://wa.me/${formattedWhatsapp}?text=${encodeURIComponent(
                        `Hello, I would like to inquire about "${product.name}"`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => trackClick('WHATSAPP_CLICK')}
                      className="text-xs bg-teal-500/10 text-teal-400 group-hover:bg-teal-500 group-hover:text-slate-950 font-bold px-3.5 py-1.5 rounded-xl border border-teal-500/20 group-hover:scale-105 active:scale-95 transition-all duration-300"
                    >
                      Enquire
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* SECTION 4: MEDIA GALLERY WITH HOVER BLEND MODES */}
        {galleryList.length > 0 && (
          <section id="gallery" className={`${currentTheme.card} border rounded-3xl p-6 shadow-xl scroll-mt-20 space-y-4`}>
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-purple-400" />
                <span>{isPersonal ? 'Events & Media Gallery' : 'Product & Work Showcase'}</span>
              </h2>
              <span className="text-xs text-slate-400">{galleryList.length} Photos</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {galleryList.map((imgUrl, idx) => (
                <div
                  key={idx}
                  onClick={() => setActiveLightboxImage(imgUrl)}
                  className="relative aspect-square rounded-2xl overflow-hidden bg-slate-950 border border-slate-800/80 hover:border-emerald-500/60 cursor-pointer group transition-all duration-500 shadow-md hover:shadow-[0_0_30px_rgba(16,185,129,0.25)]"
                >
                  <Image
                    src={imgUrl}
                    alt={`Gallery item ${idx + 1}`}
                    fill
                    className="object-cover group-hover:scale-110 group-hover:brightness-110 transition-all duration-700 ease-out"
                  />
                  {/* Microinteraction Overlay & Blend Mode */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-emerald-950/30 to-transparent mix-blend-multiply opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute inset-0 bg-emerald-500/10 opacity-0 group-hover:opacity-100 mix-blend-overlay transition-opacity duration-500" />
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center text-white z-10">
                    <div className="w-10 h-10 rounded-full bg-slate-950/80 border border-emerald-400/50 flex items-center justify-center backdrop-blur-md transform group-hover:scale-110 transition-transform duration-300 shadow-lg">
                      <Maximize2 className="w-5 h-5 text-emerald-400 animate-pulse" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* SECTION 5: REVIEWS & ENDORSEMENTS */}
        <section id="reviews" className={`${currentTheme.card} border rounded-3xl p-6 shadow-xl scroll-mt-20 space-y-4`}>
          <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Star className="w-5 h-5 text-amber-400 fill-amber-400 animate-spin-slow" />
                <span>{isPersonal ? 'Testimonials & Endorsements' : 'Customer Reviews'}</span>
              </h2>
              <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                <span className="font-bold text-white">{avgRating} / 5.0</span>
                <span>({totalReviews} Reviews)</span>
              </div>
            </div>

            <button
              onClick={() => setReviewModalOpen(true)}
              className="bg-amber-500/10 hover:bg-amber-500 text-amber-400 hover:text-slate-950 text-xs font-bold px-4 py-2.5 rounded-xl border border-amber-500/30 hover:scale-105 active:scale-95 transition-all duration-300 shadow-sm"
            >
              {isPersonal ? 'Leave Endorsement' : 'Write Review'}
            </button>
          </div>

          {profile.reviews.length > 0 ? (
            <div className="space-y-3">
              {profile.reviews.map((rev) => (
                <div
                  key={rev.id}
                  className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-4 space-y-2 hover:border-amber-500/40 hover:shadow-[0_0_20px_rgba(245,158,11,0.1)] hover:scale-[1.01] transition-all duration-300"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-sm">{rev.customerName}</span>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          className={`w-3.5 h-3.5 ${s <= rev.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-700'}`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">&ldquo;{rev.comment}&rdquo;</p>
                  {rev.reply && (
                    <div className="mt-2 p-3 bg-slate-900/90 border-l-2 border-emerald-500 rounded-r-xl text-xs space-y-1">
                      <span className="font-semibold text-emerald-400 block">Response from {profile.businessName}:</span>
                      <p className="text-slate-300">{rev.reply.replyText}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-500 text-center py-4">No endorsements yet. Be the first to leave one!</p>
          )}
        </section>

        {/* Powered by TapBiz Branding */}
        {!profile.brandingDisabled && (
          <div className="text-center pt-4 pb-8">
            <a
              href="/"
              className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-emerald-400 transition"
            >
              <span>Powered by</span>
              <strong className="text-emerald-400 font-bold">TapBiz.ng</strong>
            </a>
          </div>
        )}
      </div>

      {/* Lightbox Modal for Gallery Images */}
      {activeLightboxImage && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4" onClick={() => setActiveLightboxImage(null)}>
          <button
            onClick={() => setActiveLightboxImage(null)}
            className="absolute top-4 right-4 text-white bg-slate-800/80 p-3 rounded-full hover:bg-slate-700 transition"
          >
            <X className="w-6 h-6" />
          </button>
          <div className="relative max-w-4xl max-h-[85vh] w-full h-full flex items-center justify-center">
            <Image src={activeLightboxImage} alt="Gallery Preview" fill className="object-contain" />
          </div>
        </div>
      )}

      {/* Booking & Review Modals */}
      <BookingModal
        isOpen={bookingModalOpen}
        onClose={() => setBookingModalOpen(false)}
        profileId={profile.id}
        businessName={profile.businessName}
        services={profile.services}
        initialServiceId={selectedServiceId}
      />

      <ReviewModal
        isOpen={reviewModalOpen}
        onClose={() => setReviewModalOpen(false)}
        profileId={profile.id}
        businessName={profile.businessName}
      />

      {/* Floating Sticky Mobile Quick Action Dock (iOS & Android Responsive UI) */}
      <div className="sm:hidden fixed bottom-3 left-3 right-3 z-40 bg-slate-900/95 border border-slate-700/80 backdrop-blur-xl rounded-2xl p-2 shadow-2xl flex items-center justify-around gap-1.5 ring-1 ring-white/10">
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackClick('WHATSAPP_CLICK')}
          className="flex-1 py-2.5 px-3 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition"
        >
          <MessageCircle className="w-4 h-4 fill-slate-950" />
          <span>WhatsApp</span>
        </a>

        <a
          href={`tel:${profile.phone}`}
          onClick={() => trackClick('PHONE_CLICK')}
          className="py-2.5 px-3 rounded-xl bg-slate-800 text-teal-400 border border-slate-700 font-semibold text-xs flex items-center justify-center gap-1 active:scale-95 transition"
        >
          <Phone className="w-4 h-4" />
          <span>Call</span>
        </a>

        <button
          onClick={() => {
            setSelectedServiceId(undefined);
            setBookingModalOpen(true);
          }}
          className="py-2.5 px-3 rounded-xl bg-slate-800 text-amber-400 border border-slate-700 font-semibold text-xs flex items-center justify-center gap-1 active:scale-95 transition"
        >
          <Calendar className="w-4 h-4" />
          <span>Book</span>
        </button>

        <button
          onClick={handleShare}
          className="p-2.5 rounded-xl bg-slate-800 text-slate-300 border border-slate-700 text-xs flex items-center justify-center active:scale-95 transition"
          title="Share Profile"
        >
          <Share2 className="w-4 h-4 text-emerald-400" />
        </button>
      </div>
    </div>
  );
}
