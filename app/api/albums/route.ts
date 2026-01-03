import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET /api/albums - Get all photo albums
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const filterType = searchParams.get('type') || 'all';
    const sortOrder = searchParams.get('sort') || 'newest';

    const albums = await prisma.album.findMany({
      where: filterType !== 'all' ? { eventType: filterType } : {},
      orderBy: { date: sortOrder === 'newest' ? 'desc' : 'asc' },
      include: { photos: true }
    });

    // Add photoCount for compatibility
    const albumsWithCount = albums.map(album => ({
      ...album,
      photoCount: album.photos.length
    }));

    return NextResponse.json(albumsWithCount);
  } catch (error) {
    console.error('Error fetching albums:', error);
    return NextResponse.json(
      { error: 'Failed to fetch albums' },
      { status: 500 }
    );
  }
}

// POST /api/albums - Create new album (admin only)
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { title, date, eventType } = body;

    if (!title || !date || !eventType) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const album = await prisma.album.create({
      data: {
        title,
        date: new Date(date),
        eventType,
        coverImage: null,
      },
      include: { photos: true }
    });

    // Add photoCount for compatibility
    const albumWithCount = {
      ...album,
      photoCount: album.photos.length
    };

    return NextResponse.json(albumWithCount, { status: 201 });
  } catch (error) {
    console.error('Error creating album:', error);
    return NextResponse.json(
      { error: 'Failed to create album' },
      { status: 500 }
    );
  }
}
