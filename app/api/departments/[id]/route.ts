import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { prisma } from '@/lib/prisma';

// DELETE /api/departments/[id] - Delete department (admin only)
export async function DELETE(
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

    const departmentId = params.id;

    await prisma.department.delete({
      where: { id: departmentId }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting department:', error);
    return NextResponse.json(
      { error: 'Failed to delete department' },
      { status: 500 }
    );
  }
}

// PATCH /api/departments/[id] - Update department (admin only)
export async function PATCH(
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

    const departmentId = params.id;
    const body = await request.json();
    const { name, description, leader, imageUrl } = body;

    const department = await prisma.department.update({
      where: { id: departmentId },
      data: {
        ...(name && { name }),
        ...(description && { description }),
        ...(leader !== undefined && { leader: leader || null }),
        ...(imageUrl !== undefined && { imageUrl: imageUrl || null }),
      }
    });

    return NextResponse.json(department);
  } catch (error) {
    console.error('Error updating department:', error);
    return NextResponse.json(
      { error: 'Failed to update department' },
      { status: 500 }
    );
  }
}
