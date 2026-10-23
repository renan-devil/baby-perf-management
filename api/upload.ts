// POST /api/upload: gives the browser a short-lived presigned URL to upload one file
// straight to the private Blob store (so large scans are not limited by function size).
// The store is connected with Vercel OIDC (BLOB_STORE_ID, no static token), hence presigned.

import { issueSignedToken } from '@vercel/blob';
import { handleUploadPresigned, type HandleUploadPresignedBody } from '@vercel/blob/client';
import { denyUnlessAuthed, isDocPath } from './_lib.js';

const MAX_BYTES = 100 * 1024 * 1024; // 100 MB per document

export async function POST(request: Request) {
  const denied = await denyUnlessAuthed(request);
  if (denied) return denied;
  const body = (await request.json()) as HandleUploadPresignedBody;
  try {
    const result = await handleUploadPresigned({
      body,
      request,
      getSignedToken: async (pathname) => {
        if (!isDocPath(pathname)) throw new Error('Invalid path');
        const token = await issueSignedToken({ pathname, operations: ['put'], maximumSizeInBytes: MAX_BYTES, validUntil: Date.now() + 15 * 60 * 1000 });
        return { token, urlOptions: { maximumSizeInBytes: MAX_BYTES, addRandomSuffix: false } };
      },
    });
    return Response.json(result);
  } catch (e) {
    return Response.json({ error: (e as Error).message }, { status: 400 });
  }
}
