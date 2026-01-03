import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET /api/posts - Get all testimonies and news
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type'); // 'testimony', 'news', or 'all'
    const limit = searchParams.get('limit');

    const posts = await prisma.post.findMany({
      where: type && type !== 'all' ? { type } : {},
      orderBy: { date: 'desc' },
      ...(limit && { take: parseInt(limit) })
    });

    return NextResponse.json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 }
    );
  }
}

// POST /api/posts - Create new testimony or news (admin only)
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
    const { title, content, type, author, imageUrl } = body;

    if (!title || !content || !type) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (!['testimony', 'news'].includes(type)) {
      return NextResponse.json(
        { error: 'Invalid type. Must be "testimony" or "news"' },
        { status: 400 }
      );
    }

    const post = await prisma.post.create({
      data: {
        title,
        content,
        type,
        author,
        imageUrl,
        date: new Date(),
      }
    });

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json(
      { error: 'Failed to create post' },
      { status: 500 }
    );
  }
}
