// GET /api/file?pathname=<space>/<file>[&download=1]: streams a private document.

import { get } from '@vercel/blob';
import { denyUnlessAuthed, isDocPath } from './_lib.js';

export async function GET(request: Request) {
  const denied = await denyUnlessAuthed(request);
  if (denied) return denied;
  const params = new URL(request.url).searchParams;
  const pathname = params.get('pathname') ?? '';
  if (!isDocPath(pathname)) return new Response('Invalid path', { status: 400 });

  const result = await get(pathname, { access: 'private' });
  if (result?.statusCode !== 200) return new Response('Not found', { status: 404 });

  const name = pathname.split('/')[1].replace(/^\d+-/, '');
  const ascii = name.replace(/[^\x20-\x7e]|"/g, '_');
  const mode = params.has('download') ? 'attachment' : 'inline';
  return new Response(result.stream, {
    headers: {
      'Content-Type': result.blob.contentType || 'application/octet-stream',
      'Content-Disposition': `${mode}; filename="${ascii}"; filename*=UTF-8''${encodeURIComponent(name)}`,
      'Cache-Control': 'private, no-store',
      'X-Content-Type-Options': 'nosniff',
    },
  });
}
