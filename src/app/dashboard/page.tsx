import Link from 'next/link';
import { getSessionUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import {
  Eye,
  Zap,
  QrCode,
  MessageCircle,
  Phone,
  Calendar,
  Star,
  ExternalLink,
  ArrowUpRight,
  TrendingUp,
  Clock,
  CheckCircle,
} from 'lucide-react';

export default async function DashboardHomePage() {
  const user = await getSessionUser();
  if (!user || user.profiles.length === 0) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold mb-4">No Business Profile Found</h2>
        <p className="text-slate-400 mb-6">Please complete onboarding to launch your business profile.</p>
        <Link href="/onboarding" className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-6 py-3 rounded-xl">
          Create Profile Now
        </Link>
      </div>
    );
  }

  const profile = user.profiles[0];

  // Fetch real metrics from Prisma DB
  const totalViews = await prisma.analyticsEvent.count({
    where: { profileId: profile.id, eventType: 'PROFILE_VIEW' },
  });

  const nfcTaps = await prisma.analyticsEvent.count({
    where: { profileId: profile.id, eventType: 'NFC_TAP' },
  });

  const qrScans = await prisma.analyticsEvent.count({
    where: { profileId: profile.id, eventType: 'QR_SCAN' },
  });

  const whatsappClicks = await prisma.analyticsEvent.count({
    where: { profileId: profile.id, eventType: 'WHATSAPP_CLICK' },
  });

  const phoneClicks = await prisma.analyticsEvent.count({
    where: { profileId: profile.id, eventType: 'PHONE_CLICK' },
  });

  const totalBookings = await prisma.booking.count({
    where: { profileId: profile.id },
  });

  const totalReviews = await prisma.review.count({
    where: { profileId: profile.id, status: 'PUBLISHED' },
  });

  const activeNfcTags = await prisma.nfcTag.count({
    where: { profileId: profile.id, status: 'ACTIVE' },
  });

  const recentBookings = await prisma.booking.findMany({
    where: { profileId: profile.id },
    orderBy: { createdAt: 'desc' },
    take: 5,
  });

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl sm:text-3xl font-bold text-white">{profile.businessName}</h1>
            {profile.isVerified && (
              <span className="text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5" /> Verified
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400">
            Handle: <strong className="text-emerald-400 font-mono">tapbiz.ng/p/{profile.username}</strong>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href={`/p/${profile.username}`}
            target="_blank"
            className="bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl border border-slate-700 transition flex items-center gap-1.5"
          >
            <span>Live Profile</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
          <Link
            href="/dashboard/nfc"
            className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold px-4 py-2.5 rounded-xl transition flex items-center gap-1.5 shadow-lg shadow-emerald-500/20"
          >
            <Zap className="w-4 h-4" />
            <span>Manage NFC Tag</span>
          </Link>
        </div>
      </div>

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: 'Profile Views', count: totalViews || 0, icon: Eye, color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20' },
          { title: 'Card Taps', count: nfcTaps || 0, icon: Zap, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
          { title: 'QR Scans', count: qrScans || 0, icon: QrCode, color: 'text-teal-400', bg: 'bg-teal-500/10 border-teal-500/20' },
          { title: 'WhatsApp Clicks', count: whatsappClicks || 0, icon: MessageCircle, color: 'text-green-400', bg: 'bg-green-500/10 border-green-500/20' },
          { title: 'Phone Calls', count: phoneClicks || 0, icon: Phone, color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/20' },
          { title: 'Total Bookings', count: totalBookings || 0, icon: Calendar, color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' },
          { title: 'Reviews', count: totalReviews || 0, icon: Star, color: 'text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/20' },
          { title: 'Active Cards & Stickers', count: activeNfcTags || 0, icon: TrendingUp, color: 'text-cyan-400', bg: 'bg-cyan-500/10 border-cyan-500/20' },
        ].map((m, idx) => (
          <div key={idx} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400">{m.title}</span>
              <div className={`p-2 rounded-xl border ${m.bg} ${m.color}`}>
                <m.icon className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white">{m.count.toLocaleString()}</div>
          </div>
        ))}
      </div>

      {/* Recent Bookings & NFC Shortcut Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Bookings List */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-3xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-white text-base flex items-center gap-2">
              <Calendar className="w-5 h-5 text-emerald-400" />
              <span>Recent Appointment Bookings</span>
            </h3>
            <Link href="/dashboard/bookings" className="text-xs text-emerald-400 font-bold hover:underline">
              View All →
            </Link>
          </div>

          {recentBookings.length > 0 ? (
            <div className="space-y-3">
              {recentBookings.map((b) => (
                <div key={b.id} className="bg-slate-950 border border-slate-800 rounded-2xl p-4 flex items-center justify-between text-xs">
                  <div>
                    <h4 className="font-bold text-white text-sm">{b.customerName}</h4>
                    <p className="text-slate-400">{b.customerPhone} • {b.bookingDate} at {b.bookingTime}</p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full font-bold uppercase text-[10px] ${
                      b.status === 'CONFIRMED'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : b.status === 'PENDING'
                        ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {b.status}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-500 py-8 text-center">No bookings recorded yet.</p>
          )}
        </div>

        {/* Quick NFC Tag Link Box */}
        <div className="bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-6 flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-2xl flex items-center justify-center mb-4">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-white text-base mb-2">Program Your NFC Card</h3>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              Your physical NFC card should point to your secure TapBiz shortcut URL. Copy your URL below to program your card with NFC Tools app.
            </p>
          </div>

          <Link
            href="/dashboard/nfc"
            className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-3.5 rounded-xl transition text-center text-xs flex items-center justify-center gap-2"
          >
            <span>Open NFC Tag Studio</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
