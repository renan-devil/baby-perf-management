# Story sources and the daily queue

This file tells Claude, or a daily automation, **which story to make next** and **where stories may come
from**. Each run makes one story with the [add-story skill](../.claude/skills/add-story/SKILL.md)
(three languages, one picture per minute), then marks its row as done below. The file is also the log of
every story in the app; `npm test` checks that it stays in line with `stories/`.

## Daily automation

A scheduled task can run this every day:

> Make today's story for Constance. Follow `.claude/skills/add-story/SKILL.md`, taking the next story
> from `stories/sources.md`, and mark it done there. If every check passes, publish it on the live site
> (move `main` forward) and confirm the Vercel production deployment is READY. If something fails,
> don't publish: say what went wrong.

## How to choose the day's story

1. Take the first row of the queue whose status is `to do`.
   - If the family notes below say Constance especially likes a style or a theme, you may instead take
     the first `to do` row with that style or theme, as long as it is among the next 7 rows.
2. Check that `stories/` doesn't already have it.
3. Make it with the add-story skill, using the row's length, style and theme.
4. Mark the row: replace `to do` with ``done <today's date> `<folder name>` ``, for example
   ``done 2026-11-08 `fox-and-crow` ``.
   - If you had to change its length, style or theme, change the row too, so it matches `story.json`.
5. When fewer than 7 rows are `to do`, add a week of new rows at the end, numbered in order. Take them
   from "More ideas" or from other tales in the sources below, and follow the rhythm:
   - lengths 2, 5, 2, 5, 2, 5 and 10 minutes;
   - never the same style or the same theme two days in a row;
   - a mix of French, Portuguese, English and other traditions.
   A 10-minute story needs 10 pictures and is by far the longest to make, which is why there is only
   one a week.
6. Make one story per run. If the checks fail and you can't fix them, don't publish: leave the row
   `to do` and explain why.

Style and theme ids are the ones in `src/stories/catalog.ts`:

- **Styles** (how the story feels): `funny`, `adventure`, `calm`, `puzzle` (she can guess what
  happens), `magic` and `repeat` (a repeating chain to say together).
- **Themes** (what it is about): `perseverance`, `kindness`, `cleverness`, `gentleness`, `home`,
  `friendship`, `sharing`, `honesty`, `courage`, `teamwork`, `being-yourself` and `curiosity`.

## Family notes

Constance's reactions in the app are private, and automations can't read them. Write down here what
she likes or doesn't like (a style, a theme, a character, a fear), one dated line each, and take these
notes into account when choosing and writing.

- 7 Nov 2026: Constance loved her first story in the app.

## Rules for every story

**For a child of four to six.**
- Nobody dies or gets eaten. Villains run away, learn their lesson or say sorry.
- Scary moments are short and quickly resolved, and no picture is frightening.
- Soften harsh endings, as the notes in the queue suggest.
- Skip tales that are sad at heart (*The Little Match Girl*, *The Steadfast Tin Soldier*,
  *La Chèvre de Monsieur Seguin*) unless the family asks for them.

**Public domain only.**
- Use traditional tales, or authors who died more than 70 years ago and whose works were published
  before 1931 (both conditions, so the story is free in Europe and in the United States), or original
  stories.
- Write our own retelling in each language.
- Quoting an original that is itself public domain is fine, for example La Fontaine's verses in French
  or Lear's poem in English.
- Never copy a modern translation, a modern retelling or a film version.
- Never imitate existing illustrations: draw our own pictures.

**Respect.** Tell tales from other cultures faithfully and kindly, and never caricature people in
the pictures.

## Sources

| Collection | Why it is free to use | Good for |
|---|---|---|
| Aesop's fables | Ancient Greece | Short fables with a moral: 2-minute stories |
| Jean de La Fontaine, *Fables* (1668–1694) | Died 1695 | French versions of the fables, known by every French child. His verses may be quoted in the French text. |
| Charles Perrault, *Contes* (1697) | Died 1703 | Cinderella, Puss in Boots, Little Red Riding Hood, Diamonds and Toads. Avoid Bluebeard. |
| Brothers Grimm, *Children's and Household Tales* (1812–1857) | Died 1859 and 1863 | Many tales: choose the gentle ones and soften the rest. |
| Hans Christian Andersen (1835–1872) | Died 1875 | The Ugly Duckling, Thumbelina, The Princess and the Pea, The Emperor's New Clothes. |
| Joseph Jacobs, *English Fairy Tales* (1890–1894); Robert Southey, *The Story of the Three Bears* (1837) | Died 1916 and 1843 | The Three Little Pigs, Jack and the Beanstalk, Henny Penny. |
| Portuguese tradition: Teófilo Braga, *Contos Tradicionais do Povo Português* (1883); Adolfo Coelho, *Contos Populares Portugueses* (1879); legends | Traditional; collectors died 1924 and 1919 | Sopa de Pedra, O Coelhinho Branco, A Formiga e a Neve, A Lenda das Amendoeiras em Flor, O Príncipe com Orelhas de Burro. Avoid modern authored versions (António Torrado, Sophia de Mello Breyner, Alice Vieira). |
| French tradition | Traditional | Roule galette, La Petite Poule rousse, Boucle d'or. Tell the folk tale, not the Père Castor texts. |
| Other traditions: Russian (Afanasyev, 1855–1863), Norwegian (Asbjørnsen and Moe, 1841), Japanese (Momotarō), Indian (Panchatantra, Jataka), West African (Anansi) | Traditional | The Enormous Turnip, The Three Billy Goats Gruff, The Monkey and the Crocodile. |
| Rudyard Kipling, *Just So Stories* (1902) | Died 1936 | How the Elephant Got His Trunk, The Cat That Walked by Himself. |
| Beatrix Potter's tales (1902–1930) | Died 1943 | The Tale of Peter Rabbit and others. Draw our own pictures, never imitating hers. |
| Edward Lear's poems (1871) | Died 1888 | The Owl and the Pussy-cat (a 2-minute calm story). |
| Original stories | Our own | Author: "Original story" in each language. |

Books still under copyright (Roald Dahl, Julia Donaldson…) can only be added as a shelf entry, with
the title and no text, and only when the family asks.

## Queue

| # | Story | Source | Min | Style | Theme | Notes | Status |
|---|---|---|---|---|---|---|---|
| 1 | The Crow and the Pitcher | Aesop | 2 | puzzle | cleverness | Asks Constance to guess the trick. | done 2026-11-07 `crow-and-pitcher` |
| 2 | The North Wind and the Sun | Aesop | 2 | calm | gentleness | | done 2026-11-07 `north-wind-and-sun` |
| 3 | The Tortoise and the Hare | Aesop | 5 | funny | perseverance | | done 2026-11-07 `tortoise-and-hare` |
| 4 | The Lion and the Mouse | Aesop | 5 | adventure | kindness | French moral from La Fontaine. | done 2026-11-07 `lion-and-mouse` |
| 5 | The Town Mouse and the Country Mouse | Aesop | 10 | adventure | home | | done 2026-11-07 `town-mouse-and-country-mouse` |
| 6 | The Fox and the Crow | Aesop; La Fontaine, *Le Corbeau et le Renard* | 2 | puzzle | cleverness | Let her guess why the fox flatters the crow. In French, quote La Fontaine's first lines. | to do |
| 7 | Stone Soup | Portuguese tradition, *Sopa de Pedra* (Almeirim) | 5 | funny | sharing | The Portuguese version: a hungry friar, a stone, and the whole village adding carrots, cabbage and chouriço. | to do |
| 8 | The Enormous Turnip | Russian tradition (Afanasyev) | 2 | repeat | teamwork | Grandpa, Grandma, the girl, the dog, the cat… and the little mouse: a chain to say together. | to do |
| 9 | The Emperor's New Clothes | Andersen | 5 | funny | honesty | The emperor walks out in his underwear and laughs at himself in the end. | to do |
| 10 | The Dove and the Ant | Aesop; La Fontaine, *La Colombe et la Fourmi* | 2 | calm | friendship | The ant tickles the hunter's heel; he misses and walks off. | to do |
| 11 | The Elves and the Shoemaker | Grimm | 5 | magic | kindness | | to do |
| 12 | The Ugly Duckling | Andersen | 10 | calm | being-yourself | Soften the hard winter: a kind farmer's family shelters him. | to do |
| 13 | The Three Billy Goats Gruff | Norwegian tradition (Asbjørnsen and Moe) | 2 | puzzle | cleverness | Let her guess what the biggest goat will do. The troll splashes into the river and swims off grumbling. | to do |
| 14 | The Little White Rabbit | Portuguese tradition, *O Coelhinho Branco* | 5 | repeat | courage | A goat takes over the rabbit's house; the big animals give up, and the tiny ant succeeds. | to do |
| 15 | The Frog Who Wanted to Be as Big as the Ox | La Fontaine, *La Grenouille qui se veut faire aussi grosse que le Bœuf* | 2 | funny | being-yourself | She doesn't burst: she goes pfffft like a balloon and is happy to be a frog. | to do |
| 16 | The Three Little Pigs | English tradition (Jacobs) | 5 | adventure | perseverance | The wolf slides down the chimney into a pot of cold water and runs away for good. Nobody is eaten. | to do |
| 17 | The Oak and the Reed | La Fontaine, *Le Chêne et le Roseau* | 2 | calm | gentleness | The storm gently lays the proud oak down on the soft grass; the birds find a new tree. | to do |
| 18 | The Little Red Hen | English tradition; *La Petite Poule rousse*; *A Galinha Ruiva* | 5 | repeat | teamwork | She shares the bread once the others promise to help next time. | to do |
| 19 | Puss in Boots | Perrault, *Le Chat botté* | 10 | adventure | cleverness | The ogre turns into a mouse and scampers away: the cat doesn't eat him. | to do |
| 20 | The Owl and the Pussy-cat | Edward Lear (poem) | 2 | calm | friendship | The English poem may be used as written; write rhyming French and Portuguese versions of our own. | to do |
| 21 | The Ant and the Snow | Portuguese tradition, *A Formiga e a Neve* | 5 | repeat | perseverance | A chain: snow, sun, cloud, wind, wall, mouse, cat, dog… Use the folk tale, not António Torrado's book. | to do |
| 22 | The Fox and the Grapes | Aesop; La Fontaine, *Le Renard et les Raisins* | 2 | funny | honesty | | to do |
| 23 | Diamonds and Toads | Perrault, *Les Fées* | 5 | magic | kindness | The rude sister is not punished harshly: she learns to say please and thank you. | to do |
| 24 | Belling the Cat | Aesop | 2 | puzzle | courage | Ask Constance how she would put the bell on the cat. | to do |
| 25 | The Almond Blossoms of the Algarve | Portuguese legend, *A Lenda das Amendoeiras em Flor* | 5 | calm | home | A princess from the north misses the snow; the king plants almond trees whose blossoms look like snow. | to do |
| 26 | The Bremen Town Musicians | Grimm | 10 | funny | friendship | The robbers simply run away from the "monster": no fighting. | to do |
| 27 | The Ant and the Grasshopper | Aesop; La Fontaine, *La Cigale et la Fourmi* | 2 | calm | sharing | Kind ending: the ants share their food, and the grasshopper plays music for them all winter. | to do |
| 28 | Goldilocks and the Three Bears | Robert Southey (1837) and tradition; *Boucle d'or* | 5 | repeat | honesty | Goldilocks says sorry, and the bears invite her back for porridge. | to do |
| 29 | The Princess and the Pea | Andersen | 2 | funny | being-yourself | | to do |
| 30 | The Monkey and the Crocodile | Indian tradition (Panchatantra, Jataka) | 5 | puzzle | cleverness | Let her guess the monkey's trick ("I left my heart up in the tree"). | to do |
| 31 | The Labourer and His Children | La Fontaine, *Le Laboureur et ses Enfants* | 2 | calm | perseverance | The father is old and wise, and stays alive in our version. | to do |
| 32 | The Tale of Peter Rabbit | Beatrix Potter (1902) | 5 | adventure | curiosity | Mr McGregor only chases him, and nobody is put in a pie. Our own words and our own pictures. | to do |
| 33 | Thumbelina | Andersen | 10 | magic | courage | | to do |
| 34 | The Peacock and the Crane | Aesop | 2 | funny | being-yourself | | to do |
| 35 | The Gingerbread Man | American tradition; French tradition, *Roule galette* | 5 | repeat | cleverness | The gingerbread man rolls home just in time and the fox goes without. In French, tell *Roule galette*. | to do |
| 36 | The Star Money | Grimm, *Die Sterntaler* | 2 | calm | sharing | She gives away her bread, her hat and her coat; the stars fall as silver coins. | to do |
| 37 | The Boy Who Cried Wolf | Aesop | 5 | adventure | honesty | The wolf only scatters the sheep, and everyone helps find them all. | to do |
| 38 | The Magic Porridge Pot | Grimm, *Sweet Porridge* | 2 | magic | sharing | The porridge fills the town, and everyone eats porridge for a week. | to do |
| 39 | Little Red Riding Hood | Perrault; Grimm | 5 | adventure | courage | Grandma hides in the wardrobe, and the woodcutter chases the wolf away. Nobody is eaten. | to do |
| 40 | How the Elephant Got His Trunk | Kipling, *Just So Stories* (1902) | 10 | funny | curiosity | No spanking: in our version the relatives are just very surprised by the new trunk. | to do |

## More ideas

For new rows, once the queue runs low:

- **10 minutes:** The Golden Goose (Grimm), Jack and the Beanstalk (Jacobs: the giant just grumbles off
  back to the clouds), Cinderella (Perrault, who ends with forgiveness), Momotarō the Peach Boy (Japan:
  the ogres promise to be kind) and The Twelve Dancing Princesses (Grimm).
- **5 minutes:** The Frog Prince (Grimm: keeping promises, with no frog thrown at the wall), The Mitten
  (Ukraine), Henny Penny (Jacobs: the fox runs off), The Prince with Donkey's Ears (*O Príncipe com
  Orelhas de Burro*) and Anansi and the Pot of Wisdom (West Africa).
- **2 minutes:** The Milkmaid and Her Pail (La Fontaine, *La Laitière et le Pot au lait*), The Dog and
  His Reflection (Aesop), The Bundle of Sticks (Aesop: together we are strong) and The Bear and the Two
  Travellers (Aesop: a true friend helps).
