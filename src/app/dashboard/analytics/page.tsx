import { getSessionUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { BarChart3, Zap, QrCode, Eye, MessageCircle, Phone, Calendar, Star, TrendingUp } from 'lucide-react';

export default async function AnalyticsDashboardPage() {
  const user = await getSessionUser();
  if (!user || user.profiles.length === 0) {
    return <div className="p-8 text-center text-slate-400">No business profile found.</div>;
  }

  const profile = user.profiles[0];

  // Fetch event counts
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

  const bookingEvents = await prisma.analyticsEvent.count({
    where: { profileId: profile.id, eventType: 'BOOKING_CREATED' },
  });

  const reviewEvents = await prisma.analyticsEvent.count({
    where: { profileId: profile.id, eventType: 'REVIEW_SUBMITTED' },
  });

  const recentEvents = await prisma.analyticsEvent.findMany({
    where: { profileId: profile.id },
    orderBy: { createdAt: 'desc' },
    take: 10,
    include: { nfcTag: true },
  });

  const totalTraffic = (totalViews || 0) + (nfcTaps || 0) + (qrScans || 0);

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <BarChart3 className="w-6 h-6 text-emerald-400" />
            <h1 className="text-2xl font-bold text-white">Platform Analytics & Traffic Insights</h1>
          </div>
          <p className="text-xs text-slate-400">
            Real-time telemetry on NFC taps, QR scans, WhatsApp enquiries, and appointment conversions.
          </p>
        </div>
      </div>

      {/* Traffic Sources Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Card Tap Traffic</span>
            <Zap className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-black text-white">{(nfcTaps || 0).toLocaleString()}</div>
          <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden">
            <div
              className="bg-emerald-500 h-full"
              style={{ width: `${totalTraffic > 0 ? Math.round(((nfcTaps || 0) / totalTraffic) * 100) : 0}%` }}
            />
          </div>
          <span className="text-[11px] text-slate-500 block">
            {totalTraffic > 0 ? Math.round(((nfcTaps || 0) / totalTraffic) * 100) : 0}% of total visits
          </span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">QR Code Scan Traffic</span>
            <QrCode className="w-4 h-4 text-teal-400" />
          </div>
          <div className="text-3xl font-black text-white">{(qrScans || 0).toLocaleString()}</div>
          <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden">
            <div
              className="bg-teal-500 h-full"
              style={{ width: `${totalTraffic > 0 ? Math.round(((qrScans || 0) / totalTraffic) * 100) : 0}%` }}
            />
          </div>
          <span className="text-[11px] text-slate-500 block">
            {totalTraffic > 0 ? Math.round(((qrScans || 0) / totalTraffic) * 100) : 0}% of total visits
          </span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Direct Web Visits</span>
            <Eye className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-3xl font-black text-white">{(totalViews || 0).toLocaleString()}</div>
          <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden">
            <div
              className="bg-blue-500 h-full"
              style={{ width: `${totalTraffic > 0 ? Math.round(((totalViews || 0) / totalTraffic) * 100) : 0}%` }}
            />
          </div>
          <span className="text-[11px] text-slate-500 block">
            {totalTraffic > 0 ? Math.round(((totalViews || 0) / totalTraffic) * 100) : 0}% of total visits
          </span>
        </div>
      </div>

      {/* Conversion Actions Breakdown */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-emerald-400" />
          <span>Customer Action Conversions</span>
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4">
            <span className="text-xs text-slate-400 block mb-1">WhatsApp Clicks</span>
            <strong className="text-2xl font-black text-green-400">{(whatsappClicks || 0).toLocaleString()}</strong>
          </div>
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4">
            <span className="text-xs text-slate-400 block mb-1">Phone Calls</span>
            <strong className="text-2xl font-black text-purple-400">{(phoneClicks || 0).toLocaleString()}</strong>
          </div>
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4">
            <span className="text-xs text-slate-400 block mb-1">Bookings Created</span>
            <strong className="text-2xl font-black text-amber-400">{(bookingEvents || 0).toLocaleString()}</strong>
          </div>
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4">
            <span className="text-xs text-slate-400 block mb-1">Reviews Left</span>
            <strong className="text-2xl font-black text-yellow-400">{(reviewEvents || 0).toLocaleString()}</strong>
          </div>
        </div>
      </div>

      {/* Real-Time Event Stream */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
        <h2 className="text-lg font-bold text-white">Recent Telemetry Activity Stream</h2>

        {recentEvents.length > 0 ? (
          <div className="space-y-2">
            {recentEvents.map((ev) => (
              <div key={ev.id} className="bg-slate-950 border border-slate-800/80 rounded-xl p-3 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <span className="font-bold text-emerald-400 uppercase tracking-wider text-[10px] bg-emerald-500/10 px-2 py-1 rounded-md border border-emerald-500/20">
                    {ev.eventType}
                  </span>
                  <span className="text-slate-300 font-medium">
                    {ev.nfcTag ? `Tag: ${ev.nfcTag.tagName}` : 'Public Web Profile'}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-slate-500 text-[11px]">
                  <span>{ev.deviceCategory || 'Mobile'}</span>
                  <span>{new Date(ev.createdAt).toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-500 py-4 text-center">No telemetry events logged yet.</p>
        )}
      </div>
    </div>
  );
}
