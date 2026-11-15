// The memory game (#/memory): the rules, kept apart from the screen so they can be tested.
// Cards come in pairs; each pair shows the cover of one story. Turn two cards over: if they
// match they stay face up, otherwise they are turned back after a moment (the screen does that
// by calling hide). There is no score and no way to lose.

export interface Card {
  storyId: string;
  up: boolean; // face up
  found: boolean; // its pair was found; stays face up
}

export interface Game {
  cards: Card[];
}

/** Game sizes offered, in pairs of cards. */
export const LEVELS = [3, 4, 6] as const;
export type Level = (typeof LEVELS)[number];

/** Fisher–Yates shuffle (every order equally likely). random() returns a number in [0, 1). */
export function shuffle<T>(items: readonly T[], random: () => number = Math.random): T[] {
  const a = [...items];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** A new game: `pairs` stories picked at random, each twice, shuffled, all face down. */
export function deal(storyIds: readonly string[], pairs: number, random: () => number = Math.random): Game {
  const picked = shuffle([...new Set(storyIds)], random).slice(0, pairs);
  const cards = shuffle([...picked, ...picked], random).map((storyId) => ({ storyId, up: false, found: false }));
  return { cards };
}

/** Indices of the cards that are face up but not yet found (0, 1 or 2 of them). */
export const openCards = (game: Game) => game.cards.flatMap((c, i) => (c.up && !c.found ? [i] : []));

/**
 * What happens when card i is tapped:
 * - 'ignored': it is already face up, or two unmatched cards are still showing;
 * - 'first':   it was turned over and waits for a second card;
 * - 'match':   it matches the card already showing, and both stay face up;
 * - 'miss':    it does not match; call hide() after a moment to turn both back.
 */
export type FlipResult = 'ignored' | 'first' | 'match' | 'miss';

export function flip(game: Game, i: number): { game: Game; result: FlipResult } {
  const card = game.cards[i];
  const open = openCards(game);
  if (!card || card.up || open.length >= 2) return { game, result: 'ignored' };

  const cards = game.cards.map((c, k) => (k === i ? { ...c, up: true } : c));
  if (open.length === 0) return { game: { cards }, result: 'first' };

  const other = open[0];
  if (cards[other].storyId !== card.storyId) return { game: { cards }, result: 'miss' };
  for (const k of [i, other]) cards[k] = { ...cards[k], found: true };
  return { game: { cards }, result: 'match' };
}

/** Turns the face-up cards that were not matched back over. */
export function hide(game: Game): Game {
  return { cards: game.cards.map((c) => (c.up && !c.found ? { ...c, up: false } : c)) };
}

/** True when every pair has been found. */
export const isWon = (game: Game) => game.cards.length > 0 && game.cards.every((c) => c.found);
