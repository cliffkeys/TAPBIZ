import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { EventType } from '@prisma/client';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { profileId, serviceId, customerName, customerPhone, customerEmail, bookingDate, bookingTime, notes } = body;

    if (!profileId || !customerName || !customerPhone || !bookingDate || !bookingTime) {
      return NextResponse.json({ error: 'Profile, name, phone, date and time are required' }, { status: 400 });
    }

    let totalPrice = 0;
    if (serviceId) {
      const service = await prisma.service.findUnique({ where: { id: serviceId } });
      if (service) totalPrice = service.price;
    }

    const booking = await prisma.booking.create({
      data: {
        profileId,
        serviceId: serviceId || null,
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        customerEmail: customerEmail ? customerEmail.trim() : null,
        bookingDate: bookingDate.trim(),
        bookingTime: bookingTime.trim(),
        notes: notes ? notes.trim() : null,
        status: 'PENDING',
        totalPrice,
      },
    });

    // Log analytics event for BOOKING_CREATED
    await prisma.analyticsEvent.create({
      data: {
        profileId,
        eventType: EventType.BOOKING_CREATED,
        deviceCategory: 'Mobile',
      },
    });

    return NextResponse.json({ success: true, booking });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json({ error: 'Booking ID and status required' }, { status: 400 });
    }

    const booking = await prisma.booking.findUnique({
      where: { id },
      include: { profile: true },
    });

    if (!booking || (booking.profile.userId !== user.id && user.role !== 'ADMIN')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const updated = await prisma.booking.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json({ success: true, booking: updated });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
  }
}
