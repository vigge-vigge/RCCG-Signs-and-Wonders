import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const files = formData.getAll('files') as File[];
    const albumId = formData.get('albumId') as string;

    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: 'No files provided' },
        { status: 400 }
      );
    }

    const uploadedFiles = [];
    
    // Create album directory if it doesn't exist
    const albumDir = path.join(process.cwd(), 'public', 'images', 'albums', albumId);
    await mkdir(albumDir, { recursive: true });

    for (const file of files) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Generate unique filename
      const timestamp = Date.now();
      const filename = `${timestamp}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
      const filepath = path.join(albumDir, filename);

      // Write file to disk
      await writeFile(filepath, buffer);

      // Return the public URL
      const publicUrl = `/images/albums/${albumId}/${filename}`;
      uploadedFiles.push({
        filename,
        url: publicUrl,
        size: file.size,
      });
    }

    return NextResponse.json({ 
      success: true, 
      files: uploadedFiles 
    });
  } catch (error) {
    console.error('Error uploading files:', error);
    return NextResponse.json(
      { error: 'Failed to upload files' },
      { status: 500 }
    );
  }
}
