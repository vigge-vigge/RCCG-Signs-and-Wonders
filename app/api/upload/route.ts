import { NextRequest, NextResponse } from 'next/server';
import { getAuthToken } from '@/lib/auth';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: Request) {
  try {
    const token = await getAuthToken();

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const files = formData.getAll('files') as File[];
    const albumId = formData.get('albumId') as string;

    if (!files || files.length === 0) {
      return NextResponse.json({ error: 'No files provided' }, { status: 400 });
    }

    const uploadedFiles = [];

    for (const file of files) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const result = await new Promise<{ secure_url: string; public_id: string }>((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          { folder: `rccg/albums/${albumId}` },
          (error, result) => {
            if (error || !result) reject(error);
            else resolve(result as { secure_url: string; public_id: string });
          }
        ).end(buffer);
      });

      uploadedFiles.push({
        filename: result.public_id,
        url: result.secure_url,
        size: file.size,
      });
    }

    return NextResponse.json({ success: true, files: uploadedFiles });
  } catch (error) {
    console.error('Error uploading files:', error);
    return NextResponse.json({ error: 'Failed to upload files' }, { status: 500 });
  }
}
