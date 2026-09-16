import { PrismaClient, Role, PlanCode, Theme, NfcTagStatus, EventType, BookingStatus, ReviewStatus, PaymentStatus, PaymentType, SubscriptionStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting TapBiz Database Seeding...');

  // 1. Clean existing data
  await prisma.auditLog.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.analyticsEvent.deleteMany();
  await prisma.reviewReply.deleteMany();
  await prisma.review.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.nfcTag.deleteMany();
  await prisma.businessHours.deleteMany();
  await prisma.socialLink.deleteMany();
  await prisma.product.deleteMany();
  await prisma.service.deleteMany();
  await prisma.profile.deleteMany();
  await prisma.subscription.deleteMany();
  await prisma.subscriptionPlan.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  // 2. Create Categories
  const categories = [
    { name: 'Tailor & Fashion', slug: 'tailor-fashion', icon: 'Scissors' },
    { name: 'Barber & Grooming', slug: 'barber-grooming', icon: 'UserCheck' },
    { name: 'Restaurant & Food', slug: 'restaurant-food', icon: 'Utensils' },
    { name: 'Beauty & Salon', slug: 'beauty-salon', icon: 'Sparkles' },
    { name: 'Photography & Media', slug: 'photography-media', icon: 'Camera' },
    { name: 'Real Estate', slug: 'real-estate', icon: 'Building' },
    { name: 'Retail & Shops', slug: 'retail-shops', icon: 'ShoppingBag' },
    { name: 'Professional Services', slug: 'professional-services', icon: 'Briefcase' },
    { name: 'Other Services', slug: 'other-services', icon: 'Grid' },
  ];

  for (const cat of categories) {
    await prisma.category.create({ data: cat });
  }
  console.log('✅ Categories created');

  // 3. Create Subscription Plans
  const freePlan = await prisma.subscriptionPlan.create({
    data: {
      code: PlanCode.FREE,
      name: 'Free Starter',
      priceMonthly: 0,
      priceYearly: 0,
      profileLimit: 1,
      serviceLimit: 5,
      productLimit: 5,
      nfcLimit: 1,
      brandingRemovable: false,
      analyticsLevel: 'BASIC',
    },
  });

  const proPlan = await prisma.subscriptionPlan.create({
    data: {
      code: PlanCode.PRO,
      name: 'Pro Growth',
      priceMonthly: 2500,
      priceYearly: 25000,
      profileLimit: 1,
      serviceLimit: 100,
      productLimit: 100,
      nfcLimit: 5,
      brandingRemovable: true,
      analyticsLevel: 'ADVANCED',
    },
  });

  const businessPlan = await prisma.subscriptionPlan.create({
    data: {
      code: PlanCode.BUSINESS,
      name: 'Business Enterprise',
      priceMonthly: 7500,
      priceYearly: 75000,
      profileLimit: 5,
      serviceLimit: 500,
      productLimit: 500,
      nfcLimit: 20,
      brandingRemovable: true,
      analyticsLevel: 'ENTERPRISE',
    },
  });
  console.log('✅ Subscription Plans created');

  // 4. Create Admin User
  const adminPassword = await bcrypt.hash('AdminPass123!', 10);
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@tapbiz.ng',
      passwordHash: adminPassword,
      fullName: 'TapBiz Administrator',
      phone: '+2348012345678',
      role: Role.ADMIN,
      emailVerified: true,
    },
  });

  await prisma.subscription.create({
    data: {
      userId: adminUser.id,
      planId: businessPlan.id,
      status: SubscriptionStatus.ACTIVE,
    },
  });
  console.log('✅ Admin user created (admin@tapbiz.ng / AdminPass123!)');

  // Helper for password hash
  const defaultPassword = await bcrypt.hash('Password123!', 10);

  // 5. Nigerian Demo Business 1: Cliff Tailoring (Aba)
  const cliffUser = await prisma.user.create({
    data: {
      email: 'cliff@clifftailoring.ng',
      passwordHash: defaultPassword,
      fullName: 'Cliff Nwachukwu',
      phone: '+2348031234567',
      role: Role.USER,
      emailVerified: true,
    },
  });

  await prisma.subscription.create({
    data: {
      userId: cliffUser.id,
      planId: proPlan.id,
      status: SubscriptionStatus.ACTIVE,
    },
  });

  const cliffProfile = await prisma.profile.create({
    data: {
      userId: cliffUser.id,
      username: 'cliff-tailoring',
      businessName: 'Cliff Tailoring Studio',
      category: 'Tailor & Fashion',
      description: 'Master bespoke tailoring in Aba. We craft luxury Agbada, Senator suits, traditional wedding wear, and executive corporate outfits.',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
      aboutStory: 'Welcome to Cliff Tailoring Studio! Founded in 2012 by Master Tailor Cliff Nwachukwu, we specialize in high-end bespoke Nigerian fashion. From handcrafted luxury 3-piece Agbada to sharp Senator suits and fitted corporate blazers, our workshop in Aba blends traditional African heritage with contemporary Italian cuts. Every stitch is completed with attention to precision, premium cashmere materials, and a perfect fit guarantee.',
      galleryImages: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&auto=format&fit=crop&q=80,https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?w=600&auto=format&fit=crop&q=80,https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&auto=format&fit=crop&q=80,https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=600&auto=format&fit=crop&q=80',
      logoUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=300&auto=format&fit=crop&q=80',
      coverUrl: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=1000&auto=format&fit=crop&q=80',
      phone: '+2348031234567',
      whatsapp: '2348031234567',
      email: 'info@clifftailoring.ng',
      website: 'https://clifftailoring.ng',
      address: '42 Ariaria International Market Road',
      city: 'Aba',
      state: 'Abia State',
      isVerified: true,
      theme: Theme.BUSINESS,
      brandingDisabled: true,
    },
  });

  const cliffPersonalProfile = await prisma.profile.create({
    data: {
      userId: cliffUser.id,
      username: 'cliff-nwachukwu',
      profileType: 'PERSONAL',
      businessName: 'Cliff Nwachukwu',
      personalTitle: 'CEO @ Cliff Group & Aba Textile Guild Leader',
      category: 'Professional Services',
      description: 'Fashion Industry Entrepreneur, Community Leader, and Investor in Eastern Nigeria.',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
      aboutStory: 'I am Cliff Nwachukwu — a serial entrepreneur, fashion designer, and community leader based in Aba, Abia State.\n\nOver the past 14 years, I have built Cliff Tailoring Studio into a premier Nigerian fashion house while advocating for local manufacturing infrastructure across Eastern Nigeria. I mentor over 200 young artisans annually and lead initiatives connecting African fashion craft with global export markets.',
      highlights: 'Founder @ Cliff Tailoring Studio, Chairman Aba Garment Guild, African Industrial Leader',
      galleryImages: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=80,https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=600&auto=format&fit=crop&q=80,https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&auto=format&fit=crop&q=80',
      phone: '+2348031234567',
      whatsapp: '2348031234567',
      email: 'cliff@nwachukwu.ng',
      website: 'https://clifftailoring.ng',
      city: 'Aba',
      state: 'Abia State',
      isVerified: true,
      theme: Theme.DARK,
    },
  });

  // Cliff Services
  const serviceAgbada = await prisma.service.create({
    data: {
      profileId: cliffProfile.id,
      name: 'Bespoke Luxury Agbada (3-Piece)',
      description: 'Hand-embroidered premium cashmere or wool Agbada set with matching cap.',
      price: 85000,
      duration: '7 Days',
      imageUrl: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400&auto=format&fit=crop&q=80',
    },
  });

  const serviceSenator = await prisma.service.create({
    data: {
      profileId: cliffProfile.id,
      name: 'Custom Senator Outfit',
      description: 'Sleek fitted Senator suit available in 15 distinct colors with custom buttons.',
      price: 45000,
      duration: '4 Days',
      imageUrl: 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?w=400&auto=format&fit=crop&q=80',
    },
  });

  await prisma.service.create({
    data: {
      profileId: cliffProfile.id,
      name: 'Corporate 2-Piece Suit',
      description: 'Italian cut blazer & trousers tailored to your exact measurements.',
      price: 70000,
      duration: '5 Days',
    },
  });

  // Cliff Products
  await prisma.product.create({
    data: {
      profileId: cliffProfile.id,
      name: 'Ready-to-Wear Senator (Black)',
      description: 'Pre-tailored Senator wear available in sizes M, L, XL, XXL.',
      price: 35000,
      sku: 'CLIFF-SEN-BLK-01',
    },
  });

  // Cliff Social & Hours
  await prisma.socialLink.createMany({
    data: [
      { profileId: cliffProfile.id, platform: 'Instagram', url: 'https://instagram.com/clifftailoring', handle: '@clifftailoring' },
      { profileId: cliffProfile.id, platform: 'WhatsApp', url: 'https://wa.me/2348031234567', handle: '+234 803 123 4567' },
      { profileId: cliffProfile.id, platform: 'Facebook', url: 'https://facebook.com/clifftailoring', handle: 'Cliff Tailoring' },
    ],
  });

  for (let i = 1; i <= 6; i++) {
    await prisma.businessHours.create({
      data: { profileId: cliffProfile.id, dayOfWeek: i, openTime: '08:00', closeTime: '18:00', isClosed: false },
    });
  }
  await prisma.businessHours.create({
    data: { profileId: cliffProfile.id, dayOfWeek: 0, isClosed: true },
  });

  // Cliff NFC Tag
  const nfcCliff = await prisma.nfcTag.create({
    data: {
      userId: cliffUser.id,
      profileId: cliffProfile.id,
      tagName: 'Cliff Main Card 001',
      tagToken: 'nfc_cliff_8F72K9',
      destinationUrl: 'http://localhost:3000/t/nfc_cliff_8F72K9',
      status: NfcTagStatus.ACTIVE,
      tapCount: 173,
      lastTappedAt: new Date(),
    },
  });

  // Cliff Analytics Events
  const eventTypes: EventType[] = [EventType.PROFILE_VIEW, EventType.NFC_TAP, EventType.QR_SCAN, EventType.WHATSAPP_CLICK, EventType.BOOKING_CREATED];
  for (let i = 0; i < 40; i++) {
    await prisma.analyticsEvent.create({
      data: {
        profileId: cliffProfile.id,
        nfcTagId: i % 2 === 0 ? nfcCliff.id : null,
        eventType: eventTypes[i % eventTypes.length],
        deviceCategory: i % 3 === 0 ? 'Mobile' : 'Desktop',
        browser: 'Chrome Mobile',
        os: 'Android',
        createdAt: new Date(Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000)),
      },
    });
  }

  // Cliff Reviews
  const cliffReview1 = await prisma.review.create({
    data: {
      profileId: cliffProfile.id,
      rating: 5,
      customerName: 'Chief Emeka Okonkwo',
      comment: 'Cliff made my wedding Agbada in Aba and delivered to Lagos on time! Pure perfection.',
      status: ReviewStatus.PUBLISHED,
    },
  });

  await prisma.reviewReply.create({
    data: {
      reviewId: cliffReview1.id,
      replyText: 'Thank you Chief! It was an absolute honor styling you for your big day.',
    },
  });

  await prisma.review.create({
    data: {
      profileId: cliffProfile.id,
      rating: 5,
      customerName: 'Obinna Eze',
      comment: 'Quality material and perfect fit on my Senator suit. Tapped his NFC business card at a conference and ordered instantly.',
      status: ReviewStatus.PUBLISHED,
    },
  });

  // Cliff Bookings
  await prisma.booking.create({
    data: {
      profileId: cliffProfile.id,
      serviceId: serviceAgbada.id,
      customerName: 'Kalu Uche',
      customerPhone: '+2348029876543',
      customerEmail: 'kalu.uche@gmail.com',
      bookingDate: '2026-09-20',
      bookingTime: '10:00',
      notes: 'Fitting measurement session for upcoming traditional wedding.',
      status: BookingStatus.CONFIRMED,
      totalPrice: 85000,
    },
  });

  // 6. Demo Business 2: Aba Fresh Kitchen
  const kitchenUser = await prisma.user.create({
    data: {
      email: 'orders@abafreshkitchen.ng',
      passwordHash: defaultPassword,
      fullName: 'Amaka Johnson',
      phone: '+2348052223344',
      role: Role.USER,
      emailVerified: true,
    },
  });

  const kitchenProfile = await prisma.profile.create({
    data: {
      userId: kitchenUser.id,
      username: 'aba-fresh-kitchen',
      businessName: 'Aba Fresh Kitchen & Grill',
      category: 'Restaurant & Food',
      description: 'Authentic Eastern Nigerian dishes, Ofe Akwu, Nkwobi, Pepper Soup, Fishermans Soup, and outdoor event catering.',
      logoUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=300&auto=format&fit=crop&q=80',
      coverUrl: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1000&auto=format&fit=crop&q=80',
      phone: '+2348052223344',
      whatsapp: '2348052223344',
      email: 'orders@abafreshkitchen.ng',
      address: '15 Factory Road',
      city: 'Aba',
      state: 'Abia State',
      isVerified: true,
      theme: Theme.MODERN,
    },
  });

  await prisma.service.create({
    data: {
      profileId: kitchenProfile.id,
      name: 'Full Event Catering (Per 100 Guests)',
      description: 'Comprehensive buffet service including Jollof, Fried Rice, Ofe Owerri, Nkwobi, and drinks.',
      price: 350000,
      duration: 'Full Day',
    },
  });

  await prisma.product.create({
    data: {
      profileId: kitchenProfile.id,
      name: 'Special Nkwobi Goat Head Bowl',
      description: 'Spicy seasoned goat head cooked with utazi leaves & palm oil potash.',
      price: 8500,
    },
  });

  await prisma.nfcTag.create({
    data: {
      userId: kitchenUser.id,
      profileId: kitchenProfile.id,
      tagName: 'Table 01 NFC Menu',
      tagToken: 'nfc_kitchen_99X1A',
      destinationUrl: 'http://localhost:3000/t/nfc_kitchen_99X1A',
      status: NfcTagStatus.ACTIVE,
      tapCount: 312,
    },
  });

  // 7. Demo Business 3: Kings Barber Studio (Lagos)
  const barberUser = await prisma.user.create({
    data: {
      email: 'king@kingsbarber.ng',
      passwordHash: defaultPassword,
      fullName: 'Kingston Adebayo',
      phone: '+2348123456789',
      role: Role.USER,
      emailVerified: true,
    },
  });

  const barberProfile = await prisma.profile.create({
    data: {
      userId: barberUser.id,
      username: 'kings-barber',
      businessName: 'Kings Barber Studio',
      category: 'Barber & Grooming',
      description: 'Executive celebrity cuts, beard hot towel treatment, hair dye, facial therapy, and home service in Victoria Island.',
      logoUrl: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=300&auto=format&fit=crop&q=80',
      coverUrl: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=1000&auto=format&fit=crop&q=80',
      phone: '+2348123456789',
      whatsapp: '2348123456789',
      address: '88 Ahmadu Bello Way, Victoria Island',
      city: 'Lagos',
      state: 'Lagos State',
      isVerified: true,
      theme: Theme.DARK,
    },
  });

  await prisma.service.create({
    data: {
      profileId: barberProfile.id,
      name: 'Executive Cut + Beard Hot Towel Treatment',
      description: 'Precision fade cut, sharp line-up, organic beard oil treatment, and hot towel steam facial.',
      price: 15000,
      duration: '45 Mins',
    },
  });

  await prisma.nfcTag.create({
    data: {
      userId: barberUser.id,
      profileId: barberProfile.id,
      tagName: 'VIP Barber Mirror Tag',
      tagToken: 'nfc_kings_77A8B',
      destinationUrl: 'http://localhost:3000/t/nfc_kings_77A8B',
      status: NfcTagStatus.ACTIVE,
      tapCount: 205,
    },
  });

  // 8. Demo Business 4: Glow Beauty Lounge (Abuja)
  const beautyUser = await prisma.user.create({
    data: {
      email: 'glow@glowbeauty.ng',
      passwordHash: defaultPassword,
      fullName: 'Fatima Bello',
      phone: '+2348099887766',
      role: Role.USER,
      emailVerified: true,
    },
  });

  const beautyProfile = await prisma.profile.create({
    data: {
      userId: beautyUser.id,
      username: 'glow-beauty',
      businessName: 'Glow Beauty Lounge & Spa',
      category: 'Beauty & Salon',
      description: 'Luxury bridal hair styling, acrylic nails, lash extensions, deep tissue massage, and spa facial in Maitama.',
      logoUrl: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=300&auto=format&fit=crop&q=80',
      coverUrl: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=1000&auto=format&fit=crop&q=80',
      phone: '+2348099887766',
      whatsapp: '2348099887766',
      address: '14 Gana Street, Maitama',
      city: 'Abuja',
      state: 'FCT',
      isVerified: true,
      theme: Theme.ELEGANT,
    },
  });

  await prisma.service.create({
    data: {
      profileId: beautyProfile.id,
      name: 'Bridal Glam Makeup & Hair Styling',
      description: 'HD Airbrush makeup, lash install, wig installation, and touch-ups.',
      price: 120000,
      duration: '3 Hours',
    },
  });

  // 9. Demo Business 5: Aba Creative Photography
  const photoUser = await prisma.user.create({
    data: {
      email: 'studio@abaphotography.ng',
      passwordHash: defaultPassword,
      fullName: 'Chidi Mark',
      phone: '+2348077665544',
      role: Role.USER,
      emailVerified: true,
    },
  });

  const photoProfile = await prisma.profile.create({
    data: {
      userId: photoUser.id,
      username: 'aba-photography',
      businessName: 'Aba Creative Studio & Films',
      category: 'Photography & Media',
      description: 'High-end portraiture, cinematic wedding videography, corporate events, and 4K aerial drone coverage.',
      logoUrl: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=300&auto=format&fit=crop&q=80',
      coverUrl: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=1000&auto=format&fit=crop&q=80',
      phone: '+2348077665544',
      whatsapp: '2348077665544',
      address: '5 Aba-Owerri Road',
      city: 'Aba',
      state: 'Abia State',
      isVerified: true,
      theme: Theme.MINIMAL,
    },
  });

  await prisma.service.create({
    data: {
      profileId: photoProfile.id,
      name: 'Full Day Wedding Cinema + Photo Package',
      description: '2 Senior Photographers, 1 Drone Operator, 4K Highlight Reel, photobook album & digital gallery.',
      price: 450000,
      duration: 'Full Day',
    },
  });

  console.log('✅ 5 Realistic Nigerian Business Profiles created with NFC Tags & Analytics');
  console.log('🎉 Seeding finished successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
