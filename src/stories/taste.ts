// Constance's taste: her latest reaction to each story, summed up by style and by theme.

import { newestFirst, type Reaction, type Telling } from '../../api/_stories';
import type { Story } from './catalog';

/** Loved = 1, OK = ½, not for her = 0. */
export const SCORE: Record<Reaction, number> = { loved: 1, ok: 0.5, disliked: 0 };

/** For each story, its most recent telling (latest day told; on the same day, the last one saved). */
export function latestByStory(tellings: Telling[]): Map<string, Telling> {
  const latest = new Map<string, Telling>();
  for (const t of [...tellings].sort(newestFirst)) if (!latest.has(t.storyId)) latest.set(t.storyId, t);
  return latest;
}

export interface TasteRow {
  key: string; // a style or theme id
  reactions: Reaction[]; // latest reaction of each story told, best first
  score: number; // average of their scores: 0 = not for her … 1 = loved
}

/**
 * Groups the stories by style or by theme. Each story told counts once, with its latest
 * reaction, so a favourite told twenty times does not outweigh the others, and her taste can
 * change over time. Rows go from the best liked to the least liked; `untried` lists the styles
 * or themes of the catalogue that have no story told yet.
 */
export function tasteBy(stories: Story[], latest: Map<string, Telling>, key: 'style' | 'theme'): { rows: TasteRow[]; untried: string[] } {
  const groups = new Map<string, Reaction[]>();
  const all = new Set<string>();
  for (const story of stories) {
    all.add(story[key]);
    const told = latest.get(story.id);
    if (told) groups.set(story[key], [...(groups.get(story[key]) ?? []), told.reaction]);
  }
  const rows = [...groups].map(([k, reactions]) => ({
    key: k,
    reactions: reactions.sort((a, b) => SCORE[b] - SCORE[a]),
    score: reactions.reduce((sum, r) => sum + SCORE[r], 0) / reactions.length,
  }));
  rows.sort((a, b) => b.score - a.score || b.reactions.length - a.reactions.length || a.key.localeCompare(b.key));
  return { rows, untried: [...all].filter((k) => !groups.has(k)).sort() };
}
