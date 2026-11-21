# Constance: family app

A private family web app for Constance (born 4 February 2022; home languages French, English and
European Portuguese). [`README.md`](README.md) describes the applications and how they are deployed
(Vercel, behind a site password); [`APP_SPEC.md`](APP_SPEC.md) specifies the development tracker.
Explain choices in plain words, and prefer simple, sound designs.

## Publishing

The live site, constance.devillieres.com, is built by Vercel from `main`. Other branches only get
private preview builds, so work is not visible on the site until it reaches `main`. **Policy: publish
directly.** Once the checks below pass, push finished work straight to `main` as well as to the
session's branch (`git push origin HEAD:main` when it is a fast-forward; otherwise merge `main` first),
without asking and without a pull request. Then confirm that the production deployment is READY.

## Before committing

Run `npm test`, `npm run lint`, `npm run typecheck` and `npm run build`. Interface text exists in three
languages: `locales/en.json`, `fr.json` and `pt.json` (European Portuguese).

## Stories (`#/stories`)

To add or change a story, follow the **add-story** skill ([`.claude/skills/add-story/SKILL.md`](.claude/skills/add-story/SKILL.md);
the user can also type `/add-story …`). In short:

- one folder per story in `stories/`: `story.json`, `en.md`, `fr.md`, `pt.md` and `picture-1.svg` …
  `picture-N.svg` (format: [`stories/README.md`](stories/README.md));
- 2, 5 or 10 minutes, about 120 words a minute, the same story paragraph by paragraph in the three languages;
- **one picture for each minute**: picture 1 is the cover, the others sit in the text about a minute
  apart, and all are drawn by code in `scripts/story-pictures/<story>/<n>.mjs`
  (`npm run build:pictures`), in the shared ink-and-watercolour style;
- `src/stories/stories.test.ts` and `scripts/story-pictures/pictures.test.mjs` enforce these rules.

## Bucket list (`#/bucket-list`)

To add or change items, follow the **add-bucket-item** skill ([`.claude/skills/add-bucket-item/SKILL.md`](.claude/skills/add-bucket-item/SKILL.md);
the user can also type `/add-bucket-item …`). The list is `bucket-list/items.json` (title and note in the three
languages), with one picture per item, `bucket-list/<id>.svg`, drawn by `scripts/bucket-pictures/<id>.mjs`
(`npm run build:bucket-pictures`) in the stories' style. What Constance has done lives in the Blob store
(`api/_bucket.ts`), so never rename an item's id.

## Code notes

- `api/` holds Vercel Functions. Local imports there end in `.js` (Node ESM on Vercel), and files whose
  name starts with `_` are shared code, not functions. Never put test files in `api/`.
- Constance's reactions to stories and her bucket-list marks live in the private Vercel Blob store, one
  never-modified file each (`api/_stories.ts` and `api/_bucket.ts` explain the file names).
