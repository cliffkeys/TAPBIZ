import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { EventType } from '@prisma/client';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { profileId, rating, customerName, comment } = body;

    if (!profileId || !rating || !customerName || !comment) {
      return NextResponse.json({ error: 'Profile ID, rating, customer name, and comment are required' }, { status: 400 });
    }

    const numericRating = parseInt(rating, 10);
    if (isNaN(numericRating) || numericRating < 1 || numericRating > 5) {
      return NextResponse.json({ error: 'Rating must be a number between 1 and 5' }, { status: 400 });
    }

    const review = await prisma.review.create({
      data: {
        profileId,
        rating: numericRating,
        customerName: customerName.trim(),
        comment: comment.trim(),
        status: 'PUBLISHED',
      },
    });

    // Log analytics event REVIEW_SUBMITTED
    await prisma.analyticsEvent.create({
      data: {
        profileId,
        eventType: EventType.REVIEW_SUBMITTED,
        deviceCategory: 'Mobile',
      },
    });

    return NextResponse.json({ success: true, review });
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
    const { reviewId, replyText, status } = body;

    if (!reviewId) {
      return NextResponse.json({ error: 'Review ID is required' }, { status: 400 });
    }

    const review = await prisma.review.findUnique({
      where: { id: reviewId },
      include: { profile: true, reply: true },
    });

    if (!review || (review.profile.userId !== user.id && user.role !== 'ADMIN')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    if (status !== undefined) {
      await prisma.review.update({
        where: { id: reviewId },
        data: { status },
      });
    }

    if (replyText !== undefined) {
      if (review.reply) {
        await prisma.reviewReply.update({
          where: { reviewId },
          data: { replyText: replyText.trim() },
        });
      } else {
        await prisma.reviewReply.create({
          data: {
            reviewId,
            replyText: replyText.trim(),
          },
        });
      }
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
  }
}
