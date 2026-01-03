import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// GET /api/sermons/[id] - Get single sermon
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const sermonId = params.id;

    // TODO: Replace with actual database query
    // const sermon = await prisma.sermon.findUnique({
    //   where: { id: sermonId }
    // });

    // if (!sermon) {
    //   return NextResponse.json(
    //     { error: 'Sermon not found' },
    //     { status: 404 }
    //   );
    // }

    // Return null until database is connected
    return NextResponse.json(
      { error: 'Sermon not found' },
      { status: 404 }
    );
  } catch (error) {
    console.error('Error fetching sermon:', error);
    return NextResponse.json(
      { error: 'Failed to fetch sermon' },
      { status: 500 }
    );
  }
}

// DELETE /api/sermons/[id] - Delete sermon (admin only)
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

    const sermonId = params.id;

    // TODO: Replace with actual database delete
    // await prisma.sermon.delete({
    //   where: { id: sermonId }
    // });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting sermon:', error);
    return NextResponse.json(
      { error: 'Failed to delete sermon' },
      { status: 500 }
    );
  }
}

// PATCH /api/sermons/[id] - Update sermon (admin only)
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

    const sermonId = params.id;
    const body = await request.json();
    const { title, description, date, speaker, scripture, videoUrl, audioUrl, thumbnailUrl } = body;

    // TODO: Replace with actual database update
    // const sermon = await prisma.sermon.update({
    //   where: { id: sermonId },
    //   data: {
    //     ...(title && { title }),
    //     ...(description !== undefined && { description }),
    //     ...(date && { date: new Date(date) }),
    //     ...(speaker && { speaker }),
    //     ...(scripture !== undefined && { scripture }),
    //     ...(videoUrl !== undefined && { videoUrl }),
    //     ...(audioUrl !== undefined && { audioUrl }),
    //     ...(thumbnailUrl !== undefined && { thumbnailUrl }),
    //   }
    // });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating sermon:', error);
    return NextResponse.json(
      { error: 'Failed to update sermon' },
      { status: 500 }
    );
  }
}
