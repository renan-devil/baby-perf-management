// POST /api/upload: gives the browser a short-lived permission to upload one file
// straight to the private Blob store (so large scans are not limited by function size).

import { handleUpload, type HandleUploadBody } from '@vercel/blob/client';
import { denyUnlessAuthed, isDocPath } from './_lib.js';

const MAX_BYTES = 100 * 1024 * 1024; // 100 MB per document

export async function POST(request: Request) {
  const denied = await denyUnlessAuthed(request);
  if (denied) return denied;
  const body = (await request.json()) as HandleUploadBody;
  try {
    const result = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname) => {
        if (!isDocPath(pathname)) throw new Error('Invalid path');
        return { maximumSizeInBytes: MAX_BYTES, addRandomSuffix: false };
      },
    });
    return Response.json(result);
  } catch (e) {
    return Response.json({ error: (e as Error).message }, { status: 400 });
  }
}
