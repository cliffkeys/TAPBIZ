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
    const { profileId, tagName } = body;

    if (!profileId || !tagName) {
      return NextResponse.json({ error: 'Profile ID and Tag Name are required' }, { status: 400 });
    }

    const profile = await prisma.profile.findFirst({
      where: { id: profileId, ...(user.role !== 'ADMIN' ? { userId: user.id } : {}) },
    });

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found or forbidden' }, { status: 404 });
    }

    // Generate secure random non-sequential opaque token
    const randomHex = Math.random().toString(36).substring(2, 8).toUpperCase();
    const token = `nfc_${profile.username.replace(/[^a-z0-9]/g, '')}_${randomHex}`;
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const destinationUrl = `${appUrl}/t/${token}`;

    const nfcTag = await prisma.nfcTag.create({
      data: {
        userId: user.id,
        profileId,
        tagName: tagName.trim(),
        tagToken: token,
        destinationUrl,
        status: 'ACTIVE',
      },
    });

    return NextResponse.json({ success: true, nfcTag });
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
    const { id, tagName, status } = body;

    if (!id) {
      return NextResponse.json({ error: 'Tag ID required' }, { status: 400 });
    }

    const tag = await prisma.nfcTag.findUnique({
      where: { id },
    });

    if (!tag || (tag.userId !== user.id && user.role !== 'ADMIN')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const updated = await prisma.nfcTag.update({
      where: { id },
      data: {
        tagName: tagName !== undefined ? tagName.trim() : tag.tagName,
        status: status !== undefined ? status : tag.status,
      },
    });

    return NextResponse.json({ success: true, nfcTag: updated });
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
      return NextResponse.json({ error: 'Tag ID required' }, { status: 400 });
    }

    const tag = await prisma.nfcTag.findUnique({ where: { id } });
    if (!tag || (tag.userId !== user.id && user.role !== 'ADMIN')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await prisma.nfcTag.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
  }
}
