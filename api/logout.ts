// GET /api/logout: forgets the password on this device.

import { COOKIE } from './_lib';

export function GET() {
  return new Response(null, {
    status: 303,
    headers: { Location: '/', 'Set-Cookie': `${COOKIE}=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0` },
  });
}
