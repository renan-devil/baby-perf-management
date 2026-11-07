---
name: add-story
description: Add a new story to Constance's Stories app (#/stories) — texts in French, English and European Portuguese, 2, 5 or 10 minutes long, with one ink-and-watercolour picture for each minute. Use whenever someone asks to add, write or create a story, fable or tale for Constance (for example "/add-story The Fox and the Grapes", "add three Grimm tales of 5 minutes"), to add a book she was read, or to change or redraw an existing story or its pictures.
---

# Add a story for Constance

The Stories app lists stories a parent tells Constance at bedtime, reading from a phone, and records how
she liked each telling. Constance was born on 4 February 2022 (work out her age from today's date) and
hears French, English and European Portuguese at home. Everything below is checked by `npm test`.

## 1. Decide what to add

The request may name a tale, a collection ("three Grimm tales"), an idea for an original story, a length,
a style or a theme, or nothing at all. Choose sensible defaults yourself, and say what you chose. Ask
only if the request is genuinely unclear.

- **Source.**
  - Write full texts only for tales in the public domain (traditional tales; authors who died more than
    70 years ago: Aesop, La Fontaine, Perrault, Grimm, Andersen, Kipling's *Just So Stories*…) or for
    original stories.
  - For a copyrighted book (Roald Dahl, Julia Donaldson…), add a **shelf entry** instead: `story.json`
    plus `en.md`, `fr.md` and `pt.md` holding only the `# Title` line, with no text and no pictures. The
    family reads the book, and can still record whether she liked it.
- **Length**: 2, 5 or 10 minutes. If none is given, pick one that balances the list (look at `stories/`).
- **Style** (how it feels) and **theme** (what it is about).
  - Reuse the ids in `STYLES` and `THEMES` (`src/stories/catalog.ts`), so "What Constance likes" keeps
    comparing like with like.
  - Add a new one only if nothing fits. Add its id there, and its name in `locales/en.json`, `fr.json`
    and `pt.json` under `stories.styles` or `stories.themes`.
- **Folder name** (the story id): the English title in lowercase with dashes, such as `fox-and-grapes`.
  Never rename an existing folder: Constance's reactions are filed under it.
- **Author** in `story.json`:
  - the original author, written per language (`{"en": "Aesop", "fr": "Ésope", "pt": "Esopo"}`,
    `{"en": "Brothers Grimm", "fr": "Frères Grimm", "pt": "Irmãos Grimm"}`);
  - for an original story, `{"en": "Original story", "fr": "Histoire originale", "pt": "História original"}`
    unless the user gives a name.

## 2. Write the text in three languages

Files are `stories/<id>/story.json`, `en.md`, `fr.md` and `pt.md`; the format is in `stories/README.md`.
Read one existing story first (for example `stories/lion-and-mouse/`) and match its tone and layout.

- **Same story, paragraph by paragraph.** The three languages have the same number of paragraphs, in
  the same order, because the pictures sit at the same places in each.
- **Length.** Aim for about 120 words a minute read aloud: roughly 240 words for 2 minutes, 600 for 5
  and 1,200 for 10 (in English). The test accepts 90 to 170 words a minute in every language.
- **For a child of 4 to 6.**
  - Short sentences, concrete words, dialogue to do in voices, and repetition.
  - Sound effects in `*italics*` (`*Plop!*`); notes for the reader in italics and brackets
    (`*(Pause, and let Constance guess.)*`).
  - A gentle moral on the last line (`> …`).
  - Kind and safe: soften harsh endings (nobody gets eaten, the hungry are helped) and avoid real scares.
- **Language quality.**
  - French: correct French with « guillemets ». Classic public-domain morals are welcome (La Fontaine's).
  - Portuguese: **European** Portuguese (pt-PT), not Brazilian. Dialogue uses the dash (—), and quotes
    use «».
  - English: British spelling.

## 3. One picture for each minute (the rule)

A story of N minutes has exactly N pictures, `stories/<id>/picture-1.svg` to `picture-N.svg`.

- **Picture 1 is the cover**: the list shows it, and its line goes right under the title.
- **Pictures 2 to N** sit between paragraphs at about each minute of reading, each on its own line:
  `![What the picture shows, in this file's language.](picture-3.svg)`
- The description is read aloud by screen readers, so translate it in each language.
- Use the same paragraph positions in the three files.
- The test requires each picture to cover between half and one and a half of the story's average minute.
- **Choose the moments first.** Find the paragraph break nearest each minute (equal word counts), then
  list what each picture shows, so the pictures tell the story on their own. Avoid showing the same
  moment twice, and don't let the cover give away the answer to a puzzle story.

## 4. Draw the pictures

Every picture is drawn by code, so all stories share one look.

- **Where.** Picture k of story `<id>` is `scripts/story-pictures/<id>/<k>.mjs`. It default-exports a
  drawing that `scripts/story-pictures/lib.mjs` (`svg()`) turns into the SVG. Read `lib.mjs`: the
  comment above `svg()` explains the fields (washes, lines, fine, whites, fills, glints) and the helpers
  (paths with transforms, hatch, tufts, rays, zed, palette `PAL`).
- **Start from an example.** Use an existing picture as your model, for example
  `scripts/story-pictures/tortoise-and-hare/1.mjs` and `3.mjs`.
- **Style.**
  - A loose, scratchy ink line with watercolour washes and plenty of cream paper, in the spirit of
    Roald Dahl's books. Always original drawings: never copy or imitate a specific existing
    illustration or illustrator.
  - Use only the colours in `PAL`.
  - Make each picture a vignette: one clear moment, 1 to 3 characters, big simple shapes, little
    background.
  - No `<text>`: draw marks such as "z z z" as paths.
  - It must read clearly as a 96×72 thumbnail.
- **Same characters throughout.** Draw each character once, usually in picture 1, then reuse its path
  constants in the other pictures with transforms (translate, scale, rotate, flip) or faithful redraws.
  - `paths(list, 'translate(…) rotate(…) scale(…)')` places ink shapes.
  - `transformPath(d, sameTransform)` places any other path data: wash shapes, `whites`, `fills`.
  - Both apply the transform to the coordinates, so the line width stays the same at every display
    size. Never use `vector-effect`.
- **Build.** `npm run build:pictures -- <id>` writes every picture of the story; `-- <id>/<k>` writes
  just one.
- **Look at every picture before moving on.**
  - Render it with Playwright: `require('playwright')`, then `chromium.launch()` with no options.
  - Show it in an `<img>` at 400×300 and at 96×72, and look at the PNG.
  - Iterate until the moment is clear, the characters match, and nothing is clipped or stray.
- **Several pictures at once.** For many pictures (a 10-minute story, several stories), you may hand
  them to parallel helper agents, one story or one range of pictures each. Give them this section and
  the story's picture 1 as the model. Each must build only its own pictures (`-- <id>/<k>`), never
  edit shared files, and run no git commands. Then review all their pictures side by side.

## 5. Check

- `npm test`. It checks: the three languages, lengths, one picture per minute and their spacing, the
  wording in the three locales, and that every picture matches its drawing.
- `npm run lint`, `npm run typecheck`, `npm run build`.
- Look at the story at phone size:
  - Run `npm run build`, then `npx vite preview`, and open `#/stories/<id>` with Playwright at 390×844.
  - The reactions API only runs on Vercel, so mock `/api/stories` with `page.route` (reply `[]`) or
    expect a message saying reactions could not be loaded.
  - Check that the cover, the text and every picture appear in each language (FR · EN · PT switch).
- Show the user the cover and a contact sheet of all the new pictures.

## 6. Finish

- Commit with a clear message, for example `Add story: The Fox and the Grapes (2 min)`, and push to the
  session's branch. Don't open a pull request unless asked.
- Report:
  - what you added (title, length, style, theme, source)
  - the moments the pictures show
  - anything worth a human look (for example, the Portuguese by a native speaker)

## Changing an existing story

- **Text.** Edit the three `.md` files the same way. Keep the picture lines and the length rules, then
  run `npm test`.
- **A picture.** Edit `scripts/story-pictures/<id>/<k>.mjs`, run `npm run build:pictures -- <id>/<k>`,
  look at it, then run `npm test`.
- **Length.** If you change it, add or remove pictures to match the new number of minutes.
