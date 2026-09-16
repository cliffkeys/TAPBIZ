import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword, verifyPassword, setSessionCookie } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { username, email, password } = body;

    const inputIdentifier = (username || email || '').trim().toLowerCase();
    const inputPassword = password || '';

    if (!inputIdentifier || !inputPassword) {
      return NextResponse.json({ error: 'Admin username and password are required' }, { status: 400 });
    }

    // Resolve target email (supports 'admin' or 'admin@tapbiz.ng')
    const targetEmail = inputIdentifier === 'admin' ? 'admin@tapbiz.ng' : inputIdentifier;

    let user = await prisma.user.findUnique({
      where: { email: targetEmail },
    });

    // Seed default admin account if logging in with default credentials for the first time
    if (!user && (inputIdentifier === 'admin' || inputIdentifier === 'admin@tapbiz.ng') && inputPassword === 'admin123') {
      const hashedPassword = await hashPassword('admin123');
      user = await prisma.user.create({
        data: {
          email: 'admin@tapbiz.ng',
          passwordHash: hashedPassword,
          fullName: 'System Administrator',
          role: 'ADMIN',
          status: 'ACTIVE',
        },
      });
    }

    if (!user) {
      return NextResponse.json({ error: 'Invalid admin username or password' }, { status: 401 });
    }

    // Ensure password matches
    const isValid = await verifyPassword(inputPassword, user.passwordHash);
    if (!isValid) {
      return NextResponse.json({ error: 'Invalid admin username or password' }, { status: 401 });
    }

    // Ensure account role is ADMIN
    if (user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Access denied. Account does not have administrator privileges.' }, { status: 403 });
    }

    if (user.status === 'SUSPENDED') {
      return NextResponse.json({ error: 'Admin account is suspended' }, { status: 403 });
    }

    // Set session cookie with ADMIN role
    await setSessionCookie({
      userId: user.id,
      email: user.email,
      role: 'ADMIN',
    });

    return NextResponse.json({ success: true, redirect: '/admin' });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
  }
}
