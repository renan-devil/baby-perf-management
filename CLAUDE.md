# Constance: family app

A private family web app for Constance (born 4 February 2022; home languages French, English and
European Portuguese). [`README.md`](README.md) describes the applications and how they are deployed
(Vercel, behind a site password); [`APP_SPEC.md`](APP_SPEC.md) specifies the development tracker.
Explain choices in plain words, and prefer simple, sound designs.

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

## Code notes

- `api/` holds Vercel Functions. Local imports there end in `.js` (Node ESM on Vercel), and files whose
  name starts with `_` are shared code, not functions. Never put test files in `api/`.
- Constance's reactions to stories live in the private Vercel Blob store, one never-modified file per
  telling (`api/_stories.ts` explains the file names).
