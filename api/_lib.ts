// Shared by the middleware and the API functions (files starting with "_" are not
// deployed as functions). The site password lives in the SITE_PASSWORD environment
// variable on Vercel; the browser only ever holds a cookie derived from it.

export const COOKIE = 'site_auth';
export const SPACES = ['administrative', 'school'] as const;
export type Space = (typeof SPACES)[number];

async function sha256hex(text: string): Promise<string> {
  const bytes = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
  return [...new Uint8Array(bytes)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

/** Cookie value that proves the password was entered. Changes when the password changes. */
export async function sessionToken(): Promise<string | null> {
  const password = process.env.SITE_PASSWORD;
  return password ? sha256hex(`constance-site:${password}`) : null;
}

export function readCookie(request: Request, name: string): string | null {
  for (const part of (request.headers.get('cookie') ?? '').split(';')) {
    const [k, ...v] = part.trim().split('=');
    if (k === name) return v.join('=');
  }
  return null;
}

export async function isAuthed(request: Request): Promise<boolean> {
  const expected = await sessionToken();
  return expected !== null && readCookie(request, COOKIE) === expected;
}

/** 401 response when the visitor has not entered the password, otherwise null. */
export async function denyUnlessAuthed(request: Request): Promise<Response | null> {
  return (await isAuthed(request)) ? null : new Response('Unauthorized', { status: 401 });
}

/** Document paths look like "<space>/<timestamp>-<file name>". */
export function isDocPath(pathname: string): boolean {
  const [space, ...rest] = pathname.split('/');
  return (SPACES as readonly string[]).includes(space) && rest.length === 1 && rest[0].length > 0 && !rest[0].startsWith('.');
}
