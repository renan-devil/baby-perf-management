# Bucket list

The things to do in Constance's childhood, shown in the **Bucket list** application (`#/bucket-list`).
Whether she has done each one is not stored here: the family marks it in the app (see "What she has
done" below).

**The easy way to add an item is to ask Claude**: in a Claude Code session on this repository, type for
example `/add-bucket-item See the northern lights`. Claude follows
[`.claude/skills/add-bucket-item/SKILL.md`](../.claude/skills/add-bucket-item/SKILL.md), which applies
everything below.

```
bucket-list/
  items.json        the list: id, title and short note in English, French and Portuguese
  see-the-sea.svg   one picture for each item, named after its id
  …
```

## `items.json`

```json
[
  {
    "id": "see-the-sea",
    "title": { "en": "See the sea", "fr": "Voir la mer", "pt": "Ver o mar" },
    "note": {
      "en": "Feel the waves on her toes, and taste how salty the water is.",
      "fr": "Sentir les vagues sur ses pieds et goûter l'eau salée.",
      "pt": "Sentir as ondas nos pés e provar como a água é salgada."
    }
  }
]
```

- **id**: the English title in lowercase with dashes (letters, digits and dashes, up to 60). Never change
  the id of an item once it has been marked done: the marks are filed under it.
- **title**: short, starting with a verb ("See the sea", "Ride a pony").
- **note**: one sentence that makes it concrete and fun. The search looks in titles and notes, in the
  three languages.
- The app shows the items in the order of this file.
- Portuguese is **European** Portuguese (comboio, pónei, papagaio de papel).

## Pictures

One picture per item, `bucket-list/<id>.svg`, drawn by code in the same ink-and-watercolour style as the
stories (`scripts/story-pictures/lib.mjs`). The drawing of item `<id>` is
`scripts/bucket-pictures/<id>.mjs`. Then:

- `npm run build:bucket-pictures` redraws every picture;
- `npm run build:bucket-pictures -- see-the-sea` redraws one.

## What she has done

When someone taps **She did it!** in the app, a tiny file is saved in the family's private Blob store
(next to the story reactions), and never changed afterwards. Its name holds everything:
`bucket-list/<id>/<day done>_<time saved>.json`. "Not yet" simply means there is no file; **Undo** deletes
it. Code: [`api/bucket.ts`](../api/bucket.ts) and [`api/_bucket.ts`](../api/_bucket.ts).

After a change, run `npm test`: it checks that every item has its three languages and its picture, and
that every picture matches its drawing.
