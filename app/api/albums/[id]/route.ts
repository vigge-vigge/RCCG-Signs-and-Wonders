import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET /api/albums/[id] - Get single album with photos
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const albumId = parseInt(params.id);

    const album = await prisma.album.findUnique({
      where: { id: albumId },
      include: { photos: { orderBy: { createdAt: 'desc' } } }
    });

    if (!album) {
      return NextResponse.json(
        { error: 'Album not found' },
        { status: 404 }
      );
    }

    // Add photoCount for compatibility
    const albumWithCount = {
      ...album,
      photoCount: album.photos.length
    };

    return NextResponse.json(albumWithCount);
  } catch (error) {
    console.error('Error fetching album:', error);
    return NextResponse.json(
      { error: 'Failed to fetch album' },
      { status: 500 }
    );
  }
}

// DELETE /api/albums/[id] - Delete album (admin only)
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const albumId = parseInt(params.id);

    // Photos will be automatically deleted due to cascade delete
    await prisma.album.delete({
      where: { id: albumId }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting album:', error);
    return NextResponse.json(
      { error: 'Failed to delete album' },
      { status: 500 }
    );
  }
}

// PATCH /api/albums/[id] - Update album (admin only)
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const albumId = parseInt(params.id);
    const body = await request.json();
    const { title, date, eventType, coverImage } = body;

    const album = await prisma.album.update({
      where: { id: albumId },
      data: {
        ...(title && { title }),
        ...(date && { date: new Date(date) }),
        ...(eventType && { eventType }),
        ...(coverImage !== undefined && { coverImage }),
      },
      include: { photos: true }
    });

    // Add photoCount for compatibility
    const albumWithCount = {
      ...album,
      photoCount: album.photos.length
    };

    return NextResponse.json(albumWithCount);
  } catch (error) {
    console.error('Error updating album:', error);
    return NextResponse.json(
      { error: 'Failed to update album' },
      { status: 500 }
    );
  }
}
