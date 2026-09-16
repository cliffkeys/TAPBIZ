import { EventType } from '@prisma/client';
import { prisma } from './prisma';

export interface LogAnalyticsEventParams {
  profileId: string;
  eventType: EventType;
  nfcTagId?: string;
  deviceCategory?: string;
  browser?: string;
  os?: string;
  referrer?: string;
  ipHash?: string;
}

export async function logAnalyticsEvent(params: LogAnalyticsEventParams) {
  try {
    const event = await prisma.analyticsEvent.create({
      data: {
        profileId: params.profileId,
        eventType: params.eventType,
        nfcTagId: params.nfcTagId || null,
        deviceCategory: params.deviceCategory || 'Mobile',
        browser: params.browser || 'Unknown',
        os: params.os || 'Unknown',
        referrer: params.referrer || null,
        ipHash: params.ipHash || null,
      },
    });

    // If it's an NFC tap, increment counter on the NfcTag record as well
    if (params.eventType === EventType.NFC_TAP && params.nfcTagId) {
      await prisma.nfcTag.update({
        where: { id: params.nfcTagId },
        data: {
          tapCount: { increment: 1 },
          lastTappedAt: new Date(),
        },
      });
    }

    return event;
  } catch (err) {
    console.error('Failed to log analytics event:', err);
    return null;
  }
}
