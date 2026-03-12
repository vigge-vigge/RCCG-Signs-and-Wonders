import { NextRequest, NextResponse } from 'next/server';
import { isAuthenticatedRequest } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // If DATABASE_URL is not set or not a Postgres URL, avoid calling Prisma.
    // This prevents Prisma datasource validation errors during local/CI builds
    // when a developer intentionally uses a different dev DB (e.g., SQLite)
    // or when the production DATABASE_URL is not yet provisioned.
    const dbUrl = process.env.DATABASE_URL || '';
    if (!/^postgres(?:ql)?:\/\//i.test(dbUrl)) {
      console.warn('Skipping DB fetch: DATABASE_URL is not a postgres URL; using fallback settings.');
      const fallback = {
        churchName: 'RCCG Signs & Wonders',
        address: 'Västra storgatan 12',
        city: 'Jönköping, Sweden',
        phone: '+46 72 767 7358, +46 73 978 1777',
        email: 'rccgsignsandwondersjonkoping@yahoo.com',
        aboutUs:
          'The Redeemed Christian Church of God (RCCG) Signs and Wonders Parish is a vibrant Christian community located in Jönköping, Sweden. We are part of the global RCCG family, a Pentecostal denomination with millions of members worldwide.',
        vision:
          'Our vision is to make heaven and take as many people with us. To have a member of RCCG in every family of all nations.',
        mission:
          'To make heaven. To take as many people with us. To have a member of RCCG in every family of all nations. To accomplish No. 1 above, holiness will be our lifestyle.',
        facebookUrl: 'https://www.facebook.com/rccgsignsandwonders.jonkoping',
        instagramUrl: 'https://instagram.com/rccgsaw',
        youtubeUrl: 'https://youtube.com',
      };

      return NextResponse.json(fallback);
    }
    // Get the first (and only) settings record
    let settings = await prisma.settings.findFirst();

    // If no settings exist, create default settings
    if (!settings) {
      settings = await prisma.settings.create({
        data: {
          churchName: 'RCCG Signs & Wonders',
          address: 'Västra storgatan 12',
          city: 'Jönköping, Sweden',
          phone: '+46 72 767 7358, +46 73 978 1777',
          email: 'rccgsignsandwondersjonkoping@yahoo.com',
          aboutUs: 'The Redeemed Christian Church of God (RCCG) Signs and Wonders Parish is a vibrant Christian community located in Jönköping, Sweden. We are part of the global RCCG family, a Pentecostal denomination with millions of members worldwide.',
          vision: 'Our vision is to make heaven and take as many people with us. To have a member of RCCG in every family of all nations.',
          mission: 'To make heaven. To take as many people with us. To have a member of RCCG in every family of all nations. To accomplish No. 1 above, holiness will be our lifestyle.',
          facebookUrl: 'https://www.facebook.com/rccgsignsandwonders.jonkoping',
          instagramUrl: 'https://instagram.com/rccgsaw',
          youtubeUrl: 'https://youtube.com',
        },
      });
    }

    return NextResponse.json(settings);
  } catch (error) {
    console.error('Error fetching settings:', error);
    // If the database is unreachable during build or deploy, return safe defaults
    // so the build can proceed. This avoids failing the entire build for transient
    // DB connectivity issues (e.g. during CI or initial provisioning).
    const fallback = {
      churchName: 'RCCG Signs & Wonders',
      address: 'Västra storgatan 12',
      city: 'Jönköping, Sweden',
      phone: '+46 72 767 7358, +46 73 978 1777',
      email: 'rccgsignsandwondersjonkoping@yahoo.com',
      aboutUs:
        'The Redeemed Christian Church of God (RCCG) Signs and Wonders Parish is a vibrant Christian community located in Jönköping, Sweden. We are part of the global RCCG family, a Pentecostal denomination with millions of members worldwide.',
      vision:
        'Our vision is to make heaven and take as many people with us. To have a member of RCCG in every family of all nations.',
      mission:
        'To make heaven. To take as many people with us. To have a member of RCCG in every family of all nations. To accomplish No. 1 above, holiness will be our lifestyle.',
      facebookUrl: 'https://www.facebook.com/rccgsignsandwonders.jonkoping',
      instagramUrl: 'https://instagram.com/rccgsaw',
      youtubeUrl: 'https://youtube.com',
    };

    return NextResponse.json(fallback);
  }
}

export async function PUT(request: NextRequest) {
  if (!(await isAuthenticatedRequest(request))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const body = await request.json();
    const { 
      churchName, 
      address, 
      city, 
      phone, 
      email, 
      aboutUs, 
      vision, 
      mission,
      facebookUrl,
      instagramUrl,
      youtubeUrl,
    } = body;

    // Get existing settings or create if not exists
    let settings = await prisma.settings.findFirst();

    if (!settings) {
      // Create new settings
      settings = await prisma.settings.create({
        data: {
          churchName,
          address,
          city,
          phone,
          email,
          aboutUs,
          vision,
          mission,
          facebookUrl: facebookUrl || null,
          instagramUrl: instagramUrl || null,
          youtubeUrl: youtubeUrl || null,
        },
      });
    } else {
      // Update existing settings
      settings = await prisma.settings.update({
        where: { id: settings.id },
        data: {
          churchName,
          address,
          city,
          phone,
          email,
          aboutUs,
          vision,
          mission,
          facebookUrl: facebookUrl || null,
          instagramUrl: instagramUrl || null,
          youtubeUrl: youtubeUrl || null,
        },
      });
    }

    return NextResponse.json(settings);
  } catch (error) {
    console.error('Error updating settings:', error);
    return NextResponse.json(
      { error: 'Failed to update settings' },
      { status: 500 }
    );
  }
}
