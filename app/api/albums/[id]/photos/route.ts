import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// POST /api/albums/[id]/photos - Add photos to album (admin only)
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const albumId = parseInt(params.id);
    const body = await request.json();

    // Support bulk create: { photos: [{ url, caption }, ...] }
    if (Array.isArray(body.photos) && body.photos.length > 0) {
      const created: any[] = [];
      for (const p of body.photos) {
        if (!p.url) continue;
        const photo = await prisma.photo.create({
          data: {
            url: p.url,
            caption: p.caption || null,
            albumId,
          }
        });
        created.push(photo);
      }

      // Set coverImage on the album if it doesn't have one yet
      if (created.length > 0) {
        await prisma.album.updateMany({
          where: { id: albumId, coverImage: null },
          data: { coverImage: created[0].url },
        });
      }

      return NextResponse.json({ created }, { status: 201 });
    }

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
