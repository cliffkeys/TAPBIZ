import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { put } from '@vercel/blob';
import path from 'path';

export async function POST(req: Request) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only PNG, JPG, WEBP, GIF, and SVG images are allowed.' },
        { status: 400 }
      );
    }

    // Validate file size (5 MB limit)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File size exceeds maximum limit of 5MB.' },
        { status: 400 }
      );
    }

    // Try Vercel Blob first (public store required)
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      try {
        const ext = path.extname(file.name) || '.jpg';
        const cleanExt = ext.toLowerCase().replace(/[^a-z0-9.]/g, '');
        const filename = `uploads/upload_${Date.now()}_${Math.random().toString(36).substring(2, 8)}${cleanExt}`;

        const blob = await put(filename, file, {
          access: 'public',
          contentType: file.type,
        });

        return NextResponse.json({ success: true, url: blob.url, filename: blob.pathname });
      } catch (blobErr: unknown) {
        const blobMsg = blobErr instanceof Error ? blobErr.message : '';
        // If the store is private, fall through to base64 fallback
        if (!blobMsg.includes('private store')) {
          throw blobErr; // re-throw unexpected errors
        }
        console.warn('Blob store is private — falling back to base64 data URL');
      }
    }

    // Fallback: convert to base64 data URL (stored directly in the database)
    // Works with any storage configuration, no external services needed
    const bytes = await file.arrayBuffer();
    const base64 = Buffer.from(bytes).toString('base64');
    const dataUrl = `data:${file.type};base64,${base64}`;

    return NextResponse.json({ success: true, url: dataUrl, filename: file.name });
  } catch (err: unknown) {
    console.error('File Upload Error:', err);
    const message = err instanceof Error ? err.message : 'Error processing file upload';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
