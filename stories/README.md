# Stories

The stories shown in the **Stories** application. One folder per story; the folder name is the story's id
(lowercase letters, digits and dashes). Do not rename a folder once reactions were recorded for it:
Constance's reactions are filed under that name.

**The easy way to add a story is to ask Claude**: in a Claude Code session on this repository, type for
example `/add-story The Fox and the Grapes` or "add three Grimm tales of 5 minutes". Claude follows
[`.claude/skills/add-story/SKILL.md`](../.claude/skills/add-story/SKILL.md), which applies everything below.

```
stories/
  tortoise-and-hare/
    story.json       length, style, theme and author
    en.md            the text in English
    fr.md            the text in French
    pt.md            the text in Portuguese
    picture-1.svg    the cover
    picture-2.svg …  one picture for each minute (a 5-minute story has picture-1 … picture-5)
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

![The cover: what it shows, in this file's language.](picture-1.svg)

A paragraph. *Words between stars* are shown in italics (sound effects, notes for the reader).

Another paragraph.

![What picture 2 shows.](picture-2.svg)

More paragraphs…

> The moral, on a line starting with ">".
```

The three languages tell the same story paragraph by paragraph, with the pictures at the same places.
These are ordinary Markdown pictures, so GitHub shows them too when you open a file.

## The rule: one picture for each minute

A story of N minutes has exactly N pictures. Picture 1 is the cover, right under the title (the list
shows it too). Pictures 2 to N are spread through the text, about one each minute of reading: the test
requires each picture to cover between half and one and a half of the story's average minute. Each
picture line carries a short description of the picture, read aloud by screen readers.

For a book you read from the shelf, a file can hold only the `# Title` line: the app then lists it
(so you can still note whether Constance liked it) without a text, and no pictures are required.

## Pictures

The pictures are drawn by code, so they all share one look (cream paper, scratchy doubled ink line,
loose watercolour washes, in the spirit of Roald Dahl's books, without copying any illustration).
`scripts/story-pictures/lib.mjs` holds that look, and picture N of a story is drawn by
`scripts/story-pictures/<story>/<N>.mjs`. Then:

- `npm run build:pictures` redraws every picture;
- `npm run build:pictures -- tortoise-and-hare` redraws one story;
- `npm run build:pictures -- tortoise-and-hare/3` redraws one picture.

The drawings are deterministic: an unchanged picture comes out identical, and a test checks that every
`picture-N.svg` matches its drawing.

After a change, run `npm test`: it checks every story (three languages, known style and theme, length,
one picture per minute, pictures up to date).
