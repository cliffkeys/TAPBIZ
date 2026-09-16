import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function PATCH(req: Request) {
  try {
    const admin = await getSessionUser();
    if (!admin || admin.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const body = await req.json();
    const { profileId, isVerified, businessName, category, theme, profileType } = body;

    if (!profileId) {
      return NextResponse.json({ error: 'Profile ID required' }, { status: 400 });
    }

    const updated = await prisma.profile.update({
      where: { id: profileId },
      data: {
        isVerified: isVerified !== undefined ? Boolean(isVerified) : undefined,
        businessName: businessName !== undefined ? businessName.trim() : undefined,
        category: category !== undefined ? category.trim() : undefined,
        theme: theme !== undefined ? theme : undefined,
        profileType: profileType !== undefined ? profileType : undefined,
      },
    });

    return NextResponse.json({ success: true, profile: updated });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const admin = await getSessionUser();
    if (!admin || admin.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const profileId = searchParams.get('id');

    if (!profileId) {
      return NextResponse.json({ error: 'Profile ID required' }, { status: 400 });
    }

    await prisma.profile.delete({ where: { id: profileId } });
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
  }
}
