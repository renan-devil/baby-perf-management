# Stories

The stories shown in the **Stories** application. One folder per story; the folder name is the story's id
(lowercase letters, digits and dashes). Do not rename a folder once reactions were recorded for it:
Constance's reactions are filed under that name.

```
stories/
  tortoise-and-hare/
    story.json     length, style, theme and author
    en.md          the text in English
    fr.md          the text in French
    pt.md          the text in Portuguese
    picture.svg    the illustration (400 × 300, ink and watercolour)
```

## `story.json`

```json
{
  "minutes": 5,
  "style": "funny",
  "theme": "perseverance",
  "author": { "en": "Aesop", "fr": "Ésope", "pt": "Esopo" }
}
```

- **minutes**: `2`, `5` or `10`. Count about 120 words per minute (read calmly, with the voices).
  A test checks that every text is between 90 and 170 words per minute.
- **style** (how the story feels): `funny`, `adventure`, `calm` or `puzzle`.
- **theme** (what it is about): `perseverance`, `kindness`, `cleverness`, `gentleness` or `home`.
  To add a new style or theme, add its id to `STYLES` or `THEMES` in `src/stories/catalog.ts`
  and its name in `locales/en.json`, `fr.json` and `pt.json` (under `stories.styles` or `stories.themes`).
- **author**: one name (`"Roald Dahl"`) or one per language, as above.

## Text files (`en.md`, `fr.md`, `pt.md`)

```
# Title

A paragraph. *Words between stars* are shown in italics (sound effects, notes for the reader).

Another paragraph.

> The moral, on a line starting with ">".
```

For a book you read from the shelf, a file can hold only the `# Title` line: the app then lists it
(so you can still note whether Constance liked it) without a text. `picture.svg` is optional too.

## Pictures

The pictures are drawn by code, so they all share one look (cream paper, scratchy doubled ink line,
loose watercolour washes): `scripts/story-pictures/lib.mjs` holds that look and each picture has its
own file there (`crow.mjs`, `lion.mjs`…). `npm run build:pictures` redraws every `picture.svg`
(the drawings are deterministic: an unchanged picture comes out identical). For a new story, add a
picture file next to the others and list it in `scripts/story-pictures/build.mjs`.

After a change, run `npm test`: it checks every story (three languages, known style and theme, length).
