import { NextResponse } from 'next/server';
import { verifyPaystackSignature } from '@/lib/paystack';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get('x-paystack-signature');

    if (signature && !verifyPaystackSignature(rawBody, signature)) {
      return NextResponse.json({ error: 'Invalid Paystack signature' }, { status: 400 });
    }

    const payload = JSON.parse(rawBody);
    const event = payload.event;
    const data = payload.data;

    if (event === 'charge.success') {
      const reference = data.reference;
      const amount = data.amount / 100; // kobo to NGN

      const payment = await prisma.payment.findUnique({
        where: { reference },
      });

      if (payment && payment.status !== 'SUCCESS') {
        await prisma.payment.update({
          where: { reference },
          data: { status: 'SUCCESS' },
        });

        // Parse metadata to update user subscription
        if (payment.metadata) {
          const meta = JSON.parse(payment.metadata);
          if (meta.planCode && payment.userId) {
            const plan = await prisma.subscriptionPlan.findUnique({
              where: { code: meta.planCode },
            });

            if (plan) {
              await prisma.subscription.upsert({
                where: { userId: payment.userId },
                update: {
                  planId: plan.id,
                  status: 'ACTIVE',
                  currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // +30 days
                },
                create: {
                  userId: payment.userId,
                  planId: plan.id,
                  status: 'ACTIVE',
                  currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
                },
              });
            }
          }
        }
      }
    }

    return NextResponse.json({ status: 'success' });
  } catch (err: any) {
    console.error('Paystack Webhook Error:', err);
    return NextResponse.json({ error: 'Webhook handler error' }, { status: 500 });
  }
}
