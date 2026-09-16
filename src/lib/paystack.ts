import crypto from 'crypto';

const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET_KEY || 'sk_test_paystack_secret_key_placeholder';

export interface InitializePaymentParams {
  email: string;
  amount: number; // in NGN (will be converted to kobo * 100)
  reference?: string;
  callbackUrl?: string;
  metadata?: Record<string, any>;
}

export async function initializePaystackTransaction(params: InitializePaymentParams) {
  const reference = params.reference || `TAPBIZ_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
  const amountInKobo = Math.round(params.amount * 100);

  // If testing with mock keys, return mock checkout authorization URL
  if (PAYSTACK_SECRET.includes('placeholder') || PAYSTACK_SECRET.includes('test_mock')) {
    return {
      status: true,
      message: 'Mock Authorization URL created',
      data: {
        authorization_url: `/dashboard/subscription?status=success&reference=${reference}`,
        access_code: `mock_access_${reference}`,
        reference,
      },
    };
  }

  const response = await fetch('https://api.paystack.co/transaction/initialize', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${PAYSTACK_SECRET}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: params.email,
      amount: amountInKobo,
      reference,
      callback_url: params.callbackUrl || `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/subscription`,
      metadata: params.metadata,
    }),
  });

  return await response.json();
}

export async function verifyPaystackTransaction(reference: string) {
  // If testing with mock keys, return mock success verification
  if (PAYSTACK_SECRET.includes('placeholder') || PAYSTACK_SECRET.includes('test_mock')) {
    return {
      status: true,
      message: 'Verification successful (Mock Mode)',
      data: {
        status: 'success',
        reference,
        amount: 250000,
        currency: 'NGN',
        customer: { email: 'user@tapbiz.ng' },
      },
    };
  }

  const response = await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${PAYSTACK_SECRET}`,
    },
  });

  return await response.json();
}

export function verifyPaystackSignature(rawBody: string, signature: string): boolean {
  const webhookSecret = process.env.PAYSTACK_WEBHOOK_SECRET || PAYSTACK_SECRET;
  const hash = crypto.createHmac('sha512', webhookSecret).update(rawBody).digest('hex');
  return hash === signature;
}
