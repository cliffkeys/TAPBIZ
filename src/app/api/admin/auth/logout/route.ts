import { NextResponse } from 'next/server';
import { clearSessionCookie } from '@/lib/auth';

export async function POST() {
  try {
    await clearSessionCookie();
    return NextResponse.json({ success: true, redirect: '/admin/login' });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to logout' }, { status: 500 });
  }
}
