import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { RESERVED_USERNAMES } from '@/lib/constants';

export async function POST(req: Request) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { profileType, businessName, personalTitle, username, category, description, avatarUrl, aboutStory, highlights, galleryImages, phone, whatsapp, address, city, state, theme, logoUrl, coverUrl } = body;

    if (!businessName || !username || !category || !phone || !whatsapp) {
      return NextResponse.json({ error: 'Name, handle, category, phone and WhatsApp are required' }, { status: 400 });
    }

    const cleanUsername = username.toLowerCase().trim();

    if (RESERVED_USERNAMES.has(cleanUsername)) {
      return NextResponse.json({ error: 'This handle is reserved by TapBiz' }, { status: 400 });
    }

    const existing = await prisma.profile.findUnique({
      where: { username: cleanUsername },
    });

    if (existing) {
      return NextResponse.json({ error: 'Handle is already taken' }, { status: 400 });
    }

    const profile = await prisma.profile.create({
      data: {
        userId: user.id,
        username: cleanUsername,
        profileType: profileType === 'PERSONAL' ? 'PERSONAL' : 'BUSINESS',
        businessName: businessName.trim(),
        personalTitle: personalTitle ? personalTitle.trim() : null,
        category: category.trim(),
        description: description ? description.trim() : null,
        avatarUrl: avatarUrl ? avatarUrl.trim() : null,
        aboutStory: aboutStory ? aboutStory.trim() : null,
        highlights: highlights ? highlights.trim() : null,
        galleryImages: galleryImages ? galleryImages.trim() : null,
        phone: phone.trim(),
        whatsapp: whatsapp.trim(),
        address: address ? address.trim() : null,
        city: city ? city.trim() : null,
        state: state ? state.trim() : null,
        theme: theme || 'MODERN',
        logoUrl: logoUrl || null,
        coverUrl: coverUrl || null,
      },
    });

    // Automatically create a default NFC Tag for this new business profile
    const token = `nfc_${cleanUsername.replace(/[^a-z0-9]/g, '')}_${Math.random().toString(36).substring(2, 7)}`;
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    await prisma.nfcTag.create({
      data: {
        userId: user.id,
        profileId: profile.id,
        tagName: `${businessName} NFC Card 001`,
        tagToken: token,
        destinationUrl: `${appUrl}/t/${token}`,
        status: 'ACTIVE',
      },
    });

    return NextResponse.json({ success: true, profile });
  } catch (err: any) {
    console.error('Create Profile Error:', err);
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
    const { id, profileType, businessName, personalTitle, username, category, description, avatarUrl, aboutStory, highlights, galleryImages, phone, whatsapp, email, website, address, city, state, theme, brandingDisabled, logoUrl, coverUrl } = body;

    if (!id) {
      return NextResponse.json({ error: 'Profile ID required' }, { status: 400 });
    }

    // Verify ownership
    const profile = await prisma.profile.findUnique({
      where: { id },
    });

    if (!profile || (profile.userId !== user.id && user.role !== 'ADMIN')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    let updatedUsername = profile.username;
    if (username && username.toLowerCase().trim() !== profile.username) {
      const clean = username.toLowerCase().trim();
      if (RESERVED_USERNAMES.has(clean)) {
        return NextResponse.json({ error: 'Handle is reserved' }, { status: 400 });
      }
      const existing = await prisma.profile.findUnique({ where: { username: clean } });
      if (existing) {
        return NextResponse.json({ error: 'Handle is already taken' }, { status: 400 });
      }
      updatedUsername = clean;
    }

    const updated = await prisma.profile.update({
      where: { id },
      data: {
        profileType: profileType !== undefined ? (profileType === 'PERSONAL' ? 'PERSONAL' : 'BUSINESS') : profile.profileType,
        businessName: businessName !== undefined ? businessName.trim() : profile.businessName,
        personalTitle: personalTitle !== undefined ? personalTitle : profile.personalTitle,
        username: updatedUsername,
        category: category !== undefined ? category.trim() : profile.category,
        description: description !== undefined ? description : profile.description,
        avatarUrl: avatarUrl !== undefined ? avatarUrl : profile.avatarUrl,
        aboutStory: aboutStory !== undefined ? aboutStory : profile.aboutStory,
        highlights: highlights !== undefined ? highlights : profile.highlights,
        galleryImages: galleryImages !== undefined ? galleryImages : profile.galleryImages,
        phone: phone !== undefined ? phone.trim() : profile.phone,
        whatsapp: whatsapp !== undefined ? whatsapp.trim() : profile.whatsapp,
        email: email !== undefined ? email : profile.email,
        website: website !== undefined ? website : profile.website,
        address: address !== undefined ? address : profile.address,
        city: city !== undefined ? city : profile.city,
        state: state !== undefined ? state : profile.state,
        theme: theme !== undefined ? theme : profile.theme,
        brandingDisabled: brandingDisabled !== undefined ? brandingDisabled : profile.brandingDisabled,
        logoUrl: logoUrl !== undefined ? logoUrl : profile.logoUrl,
        coverUrl: coverUrl !== undefined ? coverUrl : profile.coverUrl,
      },
    });

    return NextResponse.json({ success: true, profile: updated });
  } catch (err: any) {
    console.error('Update Profile Error:', err);
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
  }
}
