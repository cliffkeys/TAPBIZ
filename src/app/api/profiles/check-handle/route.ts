import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { RESERVED_USERNAMES } from '@/lib/constants';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const handle = searchParams.get('handle')?.toLowerCase().trim();

  if (!handle) {
    return NextResponse.json({ available: false, error: 'Handle parameter is required' }, { status: 400 });
  }

  // Handle sanitization test: only lowercase alphanumeric and hyphens
  const isValidFormat = /^[a-z0-9-]+$/.test(handle);
  if (!isValidFormat || handle.length < 3 || handle.length > 30) {
    return NextResponse.json({
      available: false,
      error: 'Handle must be 3-30 characters long and contain only letters, numbers, and hyphens.',
    });
  }

  if (RESERVED_USERNAMES.has(handle)) {
    return NextResponse.json({ available: false, error: 'This handle is reserved by TapBiz.' });
  }

  const existingProfile = await prisma.profile.findUnique({
    where: { username: handle },
  });

  return NextResponse.json({ available: !existingProfile });
}
