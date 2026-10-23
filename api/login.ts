// POST /api/login (form field "password"): sets the session cookie for one year.

import { COOKIE, sessionToken } from './_lib.js';

const YEAR = 365 * 24 * 3600;

const redirect = (to: string, cookie?: string) =>
  new Response(null, { status: 303, headers: { Location: to, ...(cookie ? { 'Set-Cookie': cookie } : {}) } });

export async function POST(request: Request) {
  const form = await request.formData();
  const password = String(form.get('password') ?? '');
  const expected = process.env.SITE_PASSWORD;
  if (!expected || password !== expected) {
    await new Promise((r) => setTimeout(r, 800)); // slows down guessing
    return redirect('/?error=1');
  }
  return redirect('/', `${COOKIE}=${await sessionToken()}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${YEAR}`);
}
