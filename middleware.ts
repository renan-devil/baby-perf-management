// Vercel Routing Middleware: runs on Vercel's servers before any page, file or API is
// served. Without the password cookie, visitors only get the password page.

import { isAuthed } from './api/_lib.js';

// Files the browser fetches without cookies (home-screen icon and manifest) or that
// must stay reachable to retire the old offline cache (sw.js). None contain data.
const PUBLIC = new Set(['/api/login', '/icon.svg', '/manifest.webmanifest', '/sw.js', '/registerSW.js']);

export default async function middleware(request: Request) {
  const url = new URL(request.url);
  if (PUBLIC.has(url.pathname) || (await isAuthed(request))) return; // continue as normal
  if (url.pathname.startsWith('/api/')) return new Response('Unauthorized', { status: 401 });
  return new Response(passwordPage(url.searchParams.has('error')), {
    status: 401,
    headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' },
  });
}

function passwordPage(error: boolean): string {
  return `<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
<title>Constance</title>
<link rel="icon" href="/icon.svg" type="image/svg+xml">
<style>
  :root { color-scheme: light dark; --page:#f9f9f7; --surface:#fcfcfb; --border:#e4e3df; --ink:#0b0b0b; --ink-2:#52514e; --accent:#2a78d6; --critical:#d03b3b; }
  @media (prefers-color-scheme: dark) { :root { --page:#0d0d0d; --surface:#1a1a19; --border:#3a3a37; --ink:#fff; --ink-2:#c3c2b7; --accent:#3987e5; --critical:#ff7a7a; } }
  * { box-sizing: border-box; }
  body { margin:0; min-height:100vh; display:grid; place-items:center; padding:16px; background:var(--page); color:var(--ink); font-family:system-ui,-apple-system,'Segoe UI',Roboto,sans-serif; }
  form { width:100%; max-width:340px; display:flex; flex-direction:column; gap:12px; background:var(--surface); border:1px solid var(--border); border-radius:12px; padding:20px; }
  h1 { margin:0; font-size:1.3rem; display:flex; align-items:center; gap:8px; }
  p { margin:0; color:var(--ink-2); font-size:.9rem; }
  input, button { min-height:44px; border-radius:10px; font:inherit; padding:8px 12px; }
  input { border:1px solid var(--border); background:var(--page); color:var(--ink); }
  button { border:none; background:var(--accent); color:#fff; font-weight:600; cursor:pointer; }
  .error { color:var(--critical); }
</style>
</head>
<body>
<form method="post" action="/api/login">
  <h1><img src="/icon.svg" alt="" width="28" height="28"> Constance</h1>
  <p>Mot de passe · Password · Palavra-passe</p>
  <input type="password" name="password" autocomplete="current-password" autofocus required aria-label="Password">
  ${error ? '<p class="error">Mot de passe incorrect · Wrong password</p>' : ''}
  <button type="submit">OK</button>
</form>
</body>
</html>`;
}
