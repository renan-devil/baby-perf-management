// GET    /api/docs?space=administrative|school  → the documents of a space
// DELETE /api/docs?pathname=<space>/<file>        → deletes one document

import { del, list } from '@vercel/blob';
import { denyUnlessAuthed, isDocPath, SPACES } from './_lib.js';

export async function GET(request: Request) {
  const denied = await denyUnlessAuthed(request);
  if (denied) return denied;
  const space = new URL(request.url).searchParams.get('space') ?? '';
  if (!(SPACES as readonly string[]).includes(space)) return new Response('Unknown space', { status: 400 });

  const docs = [];
  let cursor: string | undefined;
  do {
    const page = await list({ prefix: `${space}/`, cursor });
    docs.push(...page.blobs.map((b) => ({ pathname: b.pathname, size: b.size, uploadedAt: b.uploadedAt })));
    cursor = page.hasMore ? page.cursor : undefined;
  } while (cursor);
  return Response.json(docs, { headers: { 'Cache-Control': 'no-store' } });
}

export async function DELETE(request: Request) {
  const denied = await denyUnlessAuthed(request);
  if (denied) return denied;
  const pathname = new URL(request.url).searchParams.get('pathname') ?? '';
  if (!isDocPath(pathname)) return new Response('Invalid path', { status: 400 });
  await del(pathname);
  return new Response(null, { status: 204 });
}
