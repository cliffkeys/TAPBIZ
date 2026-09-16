import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { initializePaystackTransaction } from '@/lib/paystack';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { planCode } = body; // 'PRO' or 'BUSINESS'

    if (!planCode || !['PRO', 'BUSINESS'].includes(planCode)) {
      return NextResponse.json({ error: 'Valid plan code is required (PRO or BUSINESS)' }, { status: 400 });
    }

    const plan = await prisma.subscriptionPlan.findUnique({
      where: { code: planCode },
    });

    if (!plan) {
      return NextResponse.json({ error: 'Plan not found' }, { status: 404 });
    }

    const reference = `TAPBIZ_${planCode}_${user.id.substring(0, 8)}_${Date.now()}`;

    // Record pending payment in database
    await prisma.payment.create({
      data: {
        userId: user.id,
        reference,
        amount: plan.priceMonthly,
        currency: 'NGN',
        status: 'PENDING',
        paymentType: 'SUBSCRIPTION',
        customerEmail: user.email,
        metadata: JSON.stringify({ planCode, planId: plan.id }),
      },
    });

    const paystackRes = await initializePaystackTransaction({
      email: user.email,
      amount: plan.priceMonthly,
      reference,
      metadata: { planCode, userId: user.id },
    });

    if (!paystackRes.status) {
      return NextResponse.json({ error: paystackRes.message || 'Failed to initialize payment' }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      authorizationUrl: paystackRes.data.authorization_url,
      reference,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
  }
}
