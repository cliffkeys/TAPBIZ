import { NextResponse } from 'next/server';
import { logAnalyticsEvent } from '@/lib/analytics';
import { EventType } from '@prisma/client';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { profileId, eventType, nfcTagId, deviceCategory, browser, os } = body;

    if (!profileId || !eventType) {
      return NextResponse.json({ error: 'Profile ID and Event Type are required' }, { status: 400 });
    }

    if (!Object.values(EventType).includes(eventType as EventType)) {
      return NextResponse.json({ error: 'Invalid Event Type' }, { status: 400 });
    }

    await logAnalyticsEvent({
      profileId,
      eventType: eventType as EventType,
      nfcTagId,
      deviceCategory,
      browser,
      os,
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
  }
}
