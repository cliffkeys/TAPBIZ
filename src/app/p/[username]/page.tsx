import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { logAnalyticsEvent } from '@/lib/analytics';
import { EventType } from '@prisma/client';
import { PublicProfileView } from '@/components/profile/PublicProfileView';

interface PageProps {
  params: Promise<{ username: string }>;
  searchParams: Promise<{ source?: string; tag?: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { username } = await params;
  const profile = await prisma.profile.findUnique({
    where: { username: username.toLowerCase() },
  });

  if (!profile) {
    return {
      title: 'Profile Not Found | TapBiz',
    };
  }

  const title = `${profile.businessName} — ${profile.category} | TapBiz`;
  const description = profile.description || `Connect with ${profile.businessName} on TapBiz. View services, products, opening hours, WhatsApp contact and book appointments.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: profile.logoUrl ? [{ url: profile.logoUrl }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

export default async function PublicProfilePage({ params, searchParams }: PageProps) {
  const { username } = await params;
  const { source, tag } = await searchParams;

  const profile = await prisma.profile.findUnique({
    where: { username: username.toLowerCase() },
    include: {
      services: { where: { isActive: true }, orderBy: { sortOrder: 'asc' } },
      products: { where: { isAvailable: true }, orderBy: { sortOrder: 'asc' } },
      socialLinks: true,
      businessHours: { orderBy: { dayOfWeek: 'asc' } },
      reviews: {
        where: { status: 'PUBLISHED' },
        orderBy: { createdAt: 'desc' },
        include: { reply: true },
      },
    },
  });

  if (!profile) {
    notFound();
  }

  // Record view analytics event
  let eventType: EventType = EventType.PROFILE_VIEW;
  if (source === 'qr') eventType = EventType.QR_SCAN;
  if (source === 'nfc') eventType = EventType.NFC_TAP;

  let nfcTagId: string | undefined;
  if (tag) {
    const foundTag = await prisma.nfcTag.findUnique({ where: { tagToken: tag } });
    if (foundTag) nfcTagId = foundTag.id;
  }

  await logAnalyticsEvent({
    profileId: profile.id,
    nfcTagId,
    eventType,
    deviceCategory: 'Mobile',
  });

  return <PublicProfileView profile={profile as any} />;
}
