import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET /api/sermons - Get all sermons
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get('limit');

    const sermons = await prisma.sermon.findMany({
      orderBy: { date: 'desc' },
      ...(limit && { take: parseInt(limit) })
    });

    return NextResponse.json(sermons);
  } catch (error) {
    console.error('Error fetching sermons:', error);
    return NextResponse.json(
      { error: 'Failed to fetch sermons' },
      { status: 500 }
    );
  }
}

// POST /api/sermons - Create new sermon (admin only)
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
    const { title, description, date, speaker, scripture, videoUrl, audioUrl, thumbnailUrl } = body;

    if (!title || !date || !speaker) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const sermon = await prisma.sermon.create({
      data: {
        title,
        description,
        date: new Date(date),
        speaker,
        scripture,
        videoUrl,
        audioUrl,
        thumbnailUrl,
      }
    });

    return NextResponse.json(sermon, { status: 201 });
  } catch (error) {
    console.error('Error creating sermon:', error);
    return NextResponse.json(
      { error: 'Failed to create sermon' },
      { status: 500 }
    );
  }
}
