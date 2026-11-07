// Constance's reactions to the stories, shared by the family (how they are filed: api/_stories.ts).
// GET    /api/stories           → every telling recorded, most recent first
// POST   /api/stories           → records one telling; JSON body {storyId, date, reaction, lang}
// DELETE /api/stories?id=<id>   → deletes one telling (to correct a mistake)

import { del, list, put } from '@vercel/blob';
import { denyUnlessAuthed } from './_lib.js';
import { isNewTelling, newestFirst, parseTellingPath, PREFIX, tellingPath, type Telling } from './_stories.js';

export async function GET(request: Request) {
  const denied = await denyUnlessAuthed(request);
  if (denied) return denied;
  const tellings: Telling[] = [];
  let cursor: string | undefined;
  do {
    const page = await list({ prefix: PREFIX, cursor });
    for (const blob of page.blobs) {
      const telling = parseTellingPath(blob.pathname);
      if (telling) tellings.push(telling);
    }
    cursor = page.hasMore ? page.cursor : undefined;
  } while (cursor);
  return Response.json(tellings.sort(newestFirst), { headers: { 'Cache-Control': 'no-store' } });
}

export async function POST(request: Request) {
  const denied = await denyUnlessAuthed(request);
  if (denied) return denied;
  const body: unknown = await request.json().catch(() => null);
  if (!isNewTelling(body)) return new Response('Invalid telling', { status: 400 });
  const telling = { storyId: body.storyId, date: body.date, reaction: body.reaction, lang: body.lang };
  const savedAt = Date.now();
  const id = tellingPath(telling, savedAt);
  // The content repeats the name, so the file also reads well on its own (for example in a backup).
  await put(id, JSON.stringify({ ...telling, savedAt }), { access: 'private', contentType: 'application/json', addRandomSuffix: false });
  const saved: Telling = { ...telling, id, savedAt };
  return Response.json(saved, { status: 201 });
}

export async function DELETE(request: Request) {
  const denied = await denyUnlessAuthed(request);
  if (denied) return denied;
  const id = new URL(request.url).searchParams.get('id') ?? '';
  if (!parseTellingPath(id)) return new Response('Invalid id', { status: 400 });
  await del(id);
  return new Response(null, { status: 204 });
}
