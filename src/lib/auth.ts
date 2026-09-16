import bcrypt from 'bcryptjs';
import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { prisma } from './prisma';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'tapbiz_super_secret_jwt_key_change_in_production_2026'
);

const COOKIE_NAME = 'tapbiz_session';

export interface UserSessionPayload {
  userId: string;
  email: string;
  role: 'USER' | 'ADMIN' | 'SUPPORT';
}

export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return await bcrypt.compare(password, hash);
}

export async function signSessionToken(payload: UserSessionPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(JWT_SECRET);
}

export async function verifySessionToken(token: string): Promise<UserSessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return {
      userId: payload.userId as string,
      email: payload.email as string,
      role: payload.role as 'USER' | 'ADMIN' | 'SUPPORT',
    };
  } catch (err) {
    return null;
  }
}

export async function setSessionCookie(payload: UserSessionPayload) {
  const token = await signSessionToken(payload);
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 7 * 24 * 60 * 60, // 7 days
  });
}

export async function clearSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export async function getSessionUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;

  const payload = await verifySessionToken(token);
  if (!payload) return null;

  const user = await prisma.user.findUnique({
    where: { id: payload.userId },
    include: {
      profiles: {
        include: {
          services: true,
          products: true,
          socialLinks: true,
          businessHours: true,
          nfcTags: true,
          reviews: {
            include: { reply: true },
            orderBy: { createdAt: 'desc' },
          },
          bookings: {
            include: { service: true },
            orderBy: { createdAt: 'desc' },
          },
        },
      },
      subscription: {
        include: { plan: true },
      },
    },
  });

  if (!user || user.status === 'SUSPENDED') return null;
  return user;
}
