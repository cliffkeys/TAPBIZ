import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { profileId, name, description, price, duration, imageUrl } = body;

    if (!profileId || !name || price === undefined) {
      return NextResponse.json({ error: 'Profile ID, service name and price are required' }, { status: 400 });
    }

    // Verify ownership
    const profile = await prisma.profile.findFirst({
      where: { id: profileId, userId: user.id },
    });

    if (!profile && user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const service = await prisma.service.create({
      data: {
        profileId,
        name: name.trim(),
        description: description ? description.trim() : null,
        price: parseFloat(price),
        duration: duration ? duration.trim() : null,
        imageUrl: imageUrl || null,
      },
    });

    return NextResponse.json({ success: true, service });
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
    const { id, name, description, price, duration, imageUrl, isActive } = body;

    if (!id) {
      return NextResponse.json({ error: 'Service ID required' }, { status: 400 });
    }

    const service = await prisma.service.findUnique({
      where: { id },
      include: { profile: true },
    });

    if (!service || (service.profile.userId !== user.id && user.role !== 'ADMIN')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const updated = await prisma.service.update({
      where: { id },
      data: {
        name: name !== undefined ? name.trim() : service.name,
        description: description !== undefined ? description : service.description,
        price: price !== undefined ? parseFloat(price) : service.price,
        duration: duration !== undefined ? duration : service.duration,
        imageUrl: imageUrl !== undefined ? imageUrl : service.imageUrl,
        isActive: isActive !== undefined ? isActive : service.isActive,
      },
    });

    return NextResponse.json({ success: true, service: updated });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Service ID required' }, { status: 400 });
    }

    const service = await prisma.service.findUnique({
      where: { id },
      include: { profile: true },
    });

    if (!service || (service.profile.userId !== user.id && user.role !== 'ADMIN')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await prisma.service.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
  }
}
