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
    const { planId, priceMonthly, priceYearly, profileLimit, serviceLimit, productLimit, nfcLimit } = body;

    if (!planId) {
      return NextResponse.json({ error: 'Plan ID required' }, { status: 400 });
    }

    const updated = await prisma.subscriptionPlan.update({
      where: { id: planId },
      data: {
        priceMonthly: priceMonthly !== undefined ? parseFloat(priceMonthly) : undefined,
        priceYearly: priceYearly !== undefined ? parseFloat(priceYearly) : undefined,
        profileLimit: profileLimit !== undefined ? parseInt(profileLimit) : undefined,
        serviceLimit: serviceLimit !== undefined ? parseInt(serviceLimit) : undefined,
        productLimit: productLimit !== undefined ? parseInt(productLimit) : undefined,
        nfcLimit: nfcLimit !== undefined ? parseInt(nfcLimit) : undefined,
      },
    });

    return NextResponse.json({ success: true, plan: updated });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
  }
}
