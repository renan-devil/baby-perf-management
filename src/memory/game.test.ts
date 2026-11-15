import { describe, expect, it } from 'vitest';
import { STORIES } from '../stories/catalog';
import { deal, flip, hide, isWon, LEVELS, openCards, shuffle, type Game } from './game';

/** A repeatable "random" generator, so the tests always deal the same cards. */
function seeded(seed: number) {
  return () => {
    seed = (seed * 1103515245 + 12345) % 2147483648;
    return seed / 2147483648;
  };
}

const IDS = ['a', 'b', 'c', 'd', 'e', 'f', 'g'];

/** Index of the other card showing the same story as card i. */
const twin = (game: Game, i: number) => game.cards.findIndex((c, k) => k !== i && c.storyId === game.cards[i].storyId);

describe('memory game', () => {
  it('shuffles without losing or adding items', () => {
    expect(shuffle(IDS, seeded(1)).sort()).toEqual(IDS);
  });

  it('deals each picked story exactly twice, face down', () => {
    for (const pairs of LEVELS) {
      const game = deal(IDS, pairs, seeded(pairs));
      expect(game.cards).toHaveLength(pairs * 2);
      const counts = new Map<string, number>();
      for (const c of game.cards) counts.set(c.storyId, (counts.get(c.storyId) ?? 0) + 1);
      expect(counts.size).toBe(pairs);
      expect([...counts.values()].every((n) => n === 2)).toBe(true);
      expect(game.cards.every((c) => !c.up && !c.found)).toBe(true);
    }
  });

  it('has enough stories with a cover for the biggest game', () => {
    const withCover = STORIES.filter((s) => s.pictures[1]);
    expect(withCover.length).toBeGreaterThanOrEqual(Math.max(...LEVELS));
  });

  it('keeps a matching pair face up', () => {
    let game = deal(IDS, 3, seeded(7));
    const first = flip(game, 0);
    expect(first.result).toBe('first');
    const second = flip(first.game, twin(first.game, 0));
    expect(second.result).toBe('match');
    game = second.game;
    expect(game.cards.filter((c) => c.found)).toHaveLength(2);
    expect(openCards(game)).toEqual([]);
  });

  it('turns a wrong pair back over, and ignores taps meanwhile', () => {
    let game = deal(IDS, 3, seeded(3));
    const other = game.cards.findIndex((c) => c.storyId !== game.cards[0].storyId);
    game = flip(game, 0).game;
    const miss = flip(game, other);
    expect(miss.result).toBe('miss');
    const third = miss.game.cards.findIndex((c) => !c.up);
    expect(flip(miss.game, third).result).toBe('ignored');
    game = hide(miss.game);
    expect(game.cards.every((c) => !c.up)).toBe(true);
  });

  it('ignores a tap on a card already face up', () => {
    const game = flip(deal(IDS, 3, seeded(5)), 0).game;
    expect(flip(game, 0).result).toBe('ignored');
  });

  it('is won when every pair is found', () => {
    let game = deal(IDS, 4, seeded(11));
    expect(isWon(game)).toBe(false);
    for (let i = 0; i < game.cards.length; i++) {
      if (game.cards[i].found) continue;
      game = flip(game, i).game;
      game = flip(game, twin(game, i)).game;
    }
    expect(isWon(game)).toBe(true);
  });
});
