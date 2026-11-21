---
name: add-bucket-item
description: Add, change or remove items on Constance's bucket list (#/bucket-list) — title and short note in French, English and European Portuguese, with one ink-and-watercolour picture per item. Use whenever someone asks to add something to Constance's bucket list ("/add-bucket-item See the northern lights", "add five summer things to her bucket list"), to reword an item, or to redraw an item's picture.
---

# Add to Constance's bucket list

The Bucket list app shows things to do once in Constance's childhood, one picture each, and lets the
family mark the ones she has done (with the day). Constance was born on 4 February 2022 (work out her
age from today's date) and hears French, English and European Portuguese at home. The format is in
`bucket-list/README.md`; everything below is checked by `npm test`.

## 1. Decide what to add

- The request may name items or just a theme ("summer things"). Choose sensible items yourself and say
  what you chose. Ask only if the request is genuinely unclear.
- **Experiences**, not skills: skills (counting, writing her name…) belong to the Development app.
  Iconic childhood "firsts" (first tooth, riding a bike) are welcome.
- Read `bucket-list/items.json` first: don't add something already there, and keep the same tone.
- Never change the `id` of an existing item: the marks she has done are filed under it. To remove an
  item, delete its entry, its `bucket-list/<id>.svg` and its `scripts/bucket-pictures/<id>.mjs`.

## 2. Write it in three languages

Add an entry to `bucket-list/items.json` (place it near similar items; the app keeps the file order):

- **id**: the English title in lowercase with dashes (`see-the-sea`).
- **title**: short, starting with a verb, in `en`, `fr` and `pt`.
- **note**: one concrete, playful sentence in each language.
- English: British spelling. French: correct French with « guillemets ». Portuguese: **European**
  (pt-PT: comboio, pónei, autocarro), quotes with «».

## 3. Draw its picture

One picture per item: `scripts/bucket-pictures/<id>.mjs` draws `bucket-list/<id>.svg`.

- It default-exports a drawing for `svg()` in `scripts/story-pictures/lib.mjs`: read the comment above
  `svg()` (washes, lines, fine, whites, fills, glints; helpers paths, hatch, tufts, rays, zed; palette
  `PAL`). Import with `from '../story-pictures/lib.mjs'`. `whites` takes bare path data, but `fills`
  and `glints` take SVG elements (`<circle cx="…" cy="…" r="…"/>`, `<path d="…"/>`): bare path data
  there silently draws nothing.
- Use an existing bucket-list picture as your model (for example `scripts/bucket-pictures/see-the-sea.mjs`).
- **Style**: loose, scratchy ink line, watercolour washes, plenty of cream paper; only `PAL` colours;
  original drawings, never copying an existing illustration. One clear subject (usually an object or a
  scene, without people), big simple shapes, little background; no `<text>`, no `vector-effect`.
- It must read clearly as a 96×72 thumbnail, since the list is a grid of small pictures.
- Build it: `npm run build:bucket-pictures -- <id>`.
- **Look at it** before moving on: render it with Playwright (`require('playwright')`, then
  `chromium.launch()` with no options) in an `<img>` at 400×300 and at 96×72, look at the PNG, and
  iterate until the subject is clear and nothing is clipped or stray.

## 4. Check and publish

- `npm test`, `npm run lint`, `npm run typecheck`, `npm run build`.
- Look at `#/bucket-list` at phone size (390×844): `npm run build`, then `npx vite preview`, and mock
  `/api/bucket` with Playwright's `page.route` (reply `[]`), since the API only runs on Vercel.
- Show the user the new pictures.
- Commit (for example `Bucket list: add See the northern lights`) and push to the session's branch.
- **Publish directly** (see `CLAUDE.md`): once the checks pass, push to `main` as well
  (`git push origin HEAD:main` when it is a fast-forward; otherwise merge `main` first), then check that
  the Vercel production deployment is READY before saying it is live.
