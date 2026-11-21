// Constance's bucket list: which things she has done, shared by the family (how they are filed:
// api/_bucket.ts). The list of things itself is in bucket-list/items.json, in the app.
// GET    /api/bucket           → every mark recorded, first time first
// POST   /api/bucket           → records that she did one thing; JSON body {itemId, date}
// DELETE /api/bucket?id=<id>   → deletes one mark (to undo a mistake)

import { del, list, put } from '@vercel/blob';
import { denyUnlessAuthed } from './_lib.js';
import { firstFirst, isNewMark, markPath, parseMarkPath, PREFIX, type Mark } from './_bucket.js';

export async function GET(request: Request) {
  const denied = await denyUnlessAuthed(request);
  if (denied) return denied;
  const marks: Mark[] = [];
  let cursor: string | undefined;
  do {
    const page = await list({ prefix: PREFIX, cursor });
    for (const blob of page.blobs) {
      const mark = parseMarkPath(blob.pathname);
      if (mark) marks.push(mark);
    }
    cursor = page.hasMore ? page.cursor : undefined;
  } while (cursor);
  return Response.json(marks.sort(firstFirst), { headers: { 'Cache-Control': 'no-store' } });
}

export async function POST(request: Request) {
  const denied = await denyUnlessAuthed(request);
  if (denied) return denied;
  const body: unknown = await request.json().catch(() => null);
  if (!isNewMark(body)) return new Response('Invalid mark', { status: 400 });
  const mark = { itemId: body.itemId, date: body.date };
  const savedAt = Date.now();
  const id = markPath(mark, savedAt);
  // The content repeats the name, so the file also reads well on its own (for example in a backup).
  await put(id, JSON.stringify({ ...mark, savedAt }), { access: 'private', contentType: 'application/json', addRandomSuffix: false });
  const saved: Mark = { ...mark, id, savedAt };
  return Response.json(saved, { status: 201 });
}

export async function DELETE(request: Request) {
  const denied = await denyUnlessAuthed(request);
  if (denied) return denied;
  const id = new URL(request.url).searchParams.get('id') ?? '';
  if (!parseMarkPath(id)) return new Response('Invalid id', { status: 400 });
  await del(id);
  return new Response(null, { status: 204 });
}
