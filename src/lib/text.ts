export const norm = (s: string): string =>
  s.toLowerCase().replace(/[’‘`]/g, "'").replace(/[.,!?;:"()]/g, ' ').replace(/\s+/g, ' ').trim();

const CONTRACTIONS: [RegExp, string][] = [
  [/n't/g, ' not'], [/'d/g, ' had'], [/'ll/g, ' will'], [/'re/g, ' are'], [/'s/g, ' is'], [/'ve/g, ' have'], [/\bcan not\b/g, 'cannot'],
];
export const expand = (s: string): string => CONTRACTIONS.reduce((acc, [r, v]) => acc.replace(r, v), s).replace(/\s+/g, ' ').trim();

export function answerMatches(given: string, accepted: string[]): boolean {
  const g = norm(given);
  if (!g) return false;
  return accepted.some((a) => {
    const n = norm(a);
    return n === g || expand(n) === expand(g) || n.replace(/'/g, '') === g.replace(/'/g, '');
  });
}

export function shuffle<T>(arr: readonly T[]): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
