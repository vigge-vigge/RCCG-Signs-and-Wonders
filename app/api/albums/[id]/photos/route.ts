import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { prisma } from '@/lib/prisma';

// POST /api/albums/[id]/photos - Add photos to album (admin only)
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const token = await getToken({ req: request as any });
    
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const albumId = parseInt(params.id);
    const body = await request.json();
    const { url, caption } = body;

    if (!url) {
      return NextResponse.json(
        { error: 'Photo URL is required' },
        { status: 400 }
      );
    }

    const photo = await prisma.photo.create({
      data: {
        url,
        caption: caption || null,
        albumId,
      }
    });

    // Set coverImage on the album if it doesn't have one yet
    await prisma.album.updateMany({
      where: { id: albumId, coverImage: null },
      data: { coverImage: url },
    });

    return NextResponse.json(photo, { status: 201 });
  } catch (error) {
    console.error('Error adding photo:', error);
    return NextResponse.json(
      { error: 'Failed to add photo' },
      { status: 500 }
    );
  }
}
