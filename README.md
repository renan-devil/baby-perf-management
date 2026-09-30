# Constance – development tracker

A private family web app to follow Constance's skills from birth to school age. It compares her progress with scientifically sourced reference ages, suggests what to work on next, and shows how skills depend on each other on a skill map.

- **Specification:** [`APP_SPEC.md`](APP_SPEC.md) · **Build log:** [`BUILD_PROGRESS.md`](BUILD_PROGRESS.md)
- Interface in **French, English and European Portuguese**. It installs on phones as an app (PWA).
- **1,820 skills in one graph:** 230 early-development skills (birth to 6 years, our catalogue) plus the 1,590 school-age skills of the [Marble Skill Taxonomy](https://github.com/withmarbleapp/os-taxonomy) (ages 4–13). They are linked by 3,486 prerequisite links.

> Not a medical or diagnostic tool. The wording stays "typical ages" and "worth discussing with your pediatrician".

## Screens
| Screen | What it does |
|---|---|
| **Today** | Age, "up next" suggestions with activities, alerts, recent entries, quick check-in |
| **Skills** | Browse by subject, age and status; each skill shows what counts, activities, reference ages and source, prerequisites, what it unlocks, and history |
| **Map** | Focus view (one skill, what comes before and after), subject view, and the whole map |
| **Progress** | Milestones over time against the normal band, developmental age by subject, learning goals by subject |
| **Journal** | Dated notes and photos linked to skills |
| **Settings** | Child profile, languages, family and share link (online mode), export, restore, import of the Excel history, delete all |

## Run it on your computer
Requires [Node.js 22](https://nodejs.org).
```bash
npm install
npm run dev          # http://localhost:5173
```
Without any configuration, the app stores data **only in the browser** (IndexedDB). That's handy for trying it out. On first launch, click **"Import Constance's history"** to load the 95 milestones from `BabyPerfMGT.xlsx`.

Checks: `npm test` (maths, graph and catalogue checks) · `npm run lint` · `npm run typecheck` · `npm run build`.

## Put it online for the family (free)
Two free services: **Supabase** (database, login, photos) and **Vercel** (hosting). About 20 minutes, one time.

1. **Supabase**: create a project at [supabase.com](https://supabase.com) and pick an **EU region**.
   - *SQL Editor* → paste all of [`supabase/schema.sql`](supabase/schema.sql) → **Run**.
   - *Authentication → Sign In / Providers → Email*: turn off **"Allow new users to sign up"** (invitation only).
   - *Authentication → Email Templates → Magic Link*: add `{{ .Token }}` to the message, so the email also contains a 6-digit code. The code is needed inside the installed phone app, where links open in the browser instead.
   - *Authentication → Users → Invite user*: invite yourself. The first person to sign in becomes the family **owner**.
   - *Project Settings → API*: copy the **Project URL** and the **anon public key**.
2. **Vercel**: at [vercel.com](https://vercel.com), click *Add New → Project* and import this GitHub repository. Vercel detects Vite. Add two environment variables:
   `VITE_SUPABASE_URL` = the project URL, `VITE_SUPABASE_ANON_KEY` = the anon key. Then deploy.
3. **Family members**: invite each person in Supabase (*Authentication → Users → Invite user*), then in the app go to *Settings → Family* and add their email with the role *editor* or *viewer*.
4. **Weekly backup** (recommended; the free plan has no backups): in GitHub go to *Settings → Secrets and variables → Actions* and add `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`. The *Weekly export* workflow then saves all tables every Monday (kept 90 days). It also stops the free project from pausing. You can also export everything from *Settings → Export* in the app.
5. **On the phones**: open the site. On iPhone use Safari → Share → *Add to Home Screen*; on Android use Chrome → *Install app*.

## Edit the catalogue
The catalogue is plain data. Open the files in Excel, Numbers or Google Sheets (tab-separated), save, then run `npm run build:catalog`. Tests check for loops and age consistency.

| File | Content |
|---|---|
| `catalog/subjects.tsv` | Subjects and domains, in 3 languages |
| `catalog/early/skills.tsv` | Our 230 skills. The `age` column is `cdc22:N` (CDC 2022: 75 % by N months), `cdc:N` (CDC 2004–2021: typical age N), `who:p1/p50/p99` (WHO windows), `est:N` (estimated typical age), `goal:A-B` (learning goal, ages A–B years) or `none` (behaviour, not scored) |
| `catalog/early/links.tsv` | Links: `prerequisite`, `skill`, `hard` (required) or `soft` (usually first), and a reason. Links to `mt_…` ids are bridges into Marble |
| `catalog/translations/` | FR / PT names of Marble skills (ages ≤ 6; machine drafts marked `draft`) and domains |
| `catalog/marble/` | Pinned copy of Marble v1. Do not edit; replace it with a new release to update |
| `catalog/seed/excel-mapping.tsv` | How each Excel row was mapped (re-run `npm run import:excel` after changes) |

## How the numbers work (short)
- Each milestone has an age distribution (p25/p50/p75/p90). **Status** follows where Constance's age, or her age when she achieved it, falls in that window.
- The **expected curve** is Σ F<sub>i</sub>(t), the sum of the probabilities that a typical child has each milestone by age *t*. The band is ±1.28 √Σ F<sub>i</sub>(1−F<sub>i</sub>) (approximate).
- **Developmental age** is the age at which a typical child has as many milestones as she has (found by bisection).
- **"Probably achieved"**: when a skill is achieved, its prerequisites count as achieved too, unless you recorded otherwise.
- **"Up next"** lists skills whose required prerequisites are done and that fit her age, ranked by timeliness and by how many skills they unlock.

Details are in `APP_SPEC.md` §5, and the code is in `src/domain/` (unit tested).

## Credits and licence
- **Thank you, [Marble](https://withmarble.com)**, for the open skill taxonomy used for ages 4–13: *Marble Skill Taxonomy (v1) · © Generative Spark, Inc. (Marble) · licensed under ODbL 1.0 (database) and CC BY-SA 4.0 (content).*
- Reference ages: CDC/AAP *Learn the Signs. Act Early.* (2022 and 2004–2021 checklists); WHO Motor Development Study (2006); French *école maternelle* and CP programmes; Clements & Sarama learning trajectories; AAP HealthyChildren.
- Code and our own catalogue: **MIT** (see [`LICENSE`](LICENSE)). Marble's data in `catalog/marble/`, and its translations, keep their own licences.
