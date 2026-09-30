# Build progress (APP_SPEC.md §8)

- [x] 0. Project setup: Vite + React + TypeScript, ESLint, Vitest, MIT licence, CI workflow
- [x] 1. Catalogue A (230 skills, 0–6 y, EN/FR/PT) + 265 links incl. 48 bridges to Marble + Excel mapping (`catalog/seed/excel-mapping.tsv`)
- [x] 2. Catalogue build script (`scripts/build-catalog.mjs`) + graph checks (`src/data/catalog.test.ts`)
- [x] 3. Pure logic (`src/domain/`) + unit tests
- [x] 4. App v1: storage (IndexedDB locally, Supabase online), Today, Skills, skill detail, logging, FR/EN/PT interface
- [x] 5. Skill map (focus, subject and whole views), Progress charts, Constance's Excel history import, check-in
- [x] 6. Journal + photos, alerts, share link, invitations, export / restore / delete, weekly export workflow, PWA
- [~] 7. FR / PT content: Marble names (ages ≤ 6) and domains machine-drafted, **to be reviewed by a native speaker**; Marble descriptions still in English

## Verified
- `npm test`: 22 tests pass (maths, graph, catalogue: no cycles, age-consistent hard links, no orphan skills)
- `npm run lint`, `npm run typecheck`, `npm run build`: clean
- Browser walkthrough (Chromium, phone and desktop sizes): all screens load with no console errors after importing Constance's history
- `supabase/schema.sql`: applied twice on PostgreSQL with Supabase stubs; access rules tested (owner, editor, viewer, stranger, share link)

## Not verified here
- A real Supabase project and Vercel deployment (needs your accounts: see README "Put it online")
- Installing the PWA on a real phone
