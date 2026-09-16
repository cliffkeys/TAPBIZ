import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { logAnalyticsEvent } from '@/lib/analytics';
import { EventType } from '@prisma/client';
import Link from 'next/link';
import { ShieldAlert, ArrowRight } from 'lucide-react';

interface PageProps {
  params: Promise<{ token: string }>;
}

export default async function NfcRedirectPage({ params }: PageProps) {
  const { token } = await params;

  if (!token) {
    return <NfcErrorState message="Invalid TapBiz NFC URL." />;
  }

  const nfcTag = await prisma.nfcTag.findUnique({
    where: { tagToken: token },
    include: { profile: true },
  });

  if (!nfcTag) {
    return <NfcErrorState message="This TapBiz NFC link does not exist or has been removed." />;
  }

  if (nfcTag.status !== 'ACTIVE') {
    const statusMessages: Record<string, string> = {
      INACTIVE: 'This NFC card is currently inactive.',
      DISABLED: 'This NFC card has been disabled by the business owner.',
      LOST: 'This NFC card was reported lost or stolen.',
    };
    return <NfcErrorState message={statusMessages[nfcTag.status] || 'This NFC card is unavailable.'} />;
  }

  if (!nfcTag.profile) {
    return <NfcErrorState message="The business profile connected to this NFC card is no longer available." />;
  }

  // Record analytics asynchronously
  await logAnalyticsEvent({
    profileId: nfcTag.profile.id,
    nfcTagId: nfcTag.id,
    eventType: EventType.NFC_TAP,
    deviceCategory: 'Mobile',
  });

  // Redirect 302 to public profile URL with source parameters
  redirect(`/p/${nfcTag.profile.username}?source=nfc&tag=${encodeURIComponent(token)}`);
}

function NfcErrorState({ message }: { message: string }) {
  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6 text-center">
      <div className="w-16 h-16 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center justify-center mb-6 text-red-400">
        <ShieldAlert className="w-8 h-8" />
      </div>
      <h1 className="text-2xl font-bold mb-3">NFC Card Notice</h1>
      <p className="text-slate-400 max-w-md mb-8 leading-relaxed">{message}</p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-semibold px-6 py-3 rounded-xl transition"
      >
        <span>Go to TapBiz Homepage</span>
        <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  );
}
