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

/** Split a paragraph into sentences (kept with trailing spaces) for tap-to-highlight. */
export function splitSentences(p: string): string[] {
  return p.match(/[^.!?]+[.!?]+["')\]]*\s*|[^.!?]+$/g) ?? [p];
}

export interface Mark { text: string; kind: 'evidence' | 'trap' }
export interface Segment { text: string; kind?: Mark['kind'] }

/** Splits text into segments, flagging every occurrence of each mark (evidence wins over trap). */
export function segment(text: string, marks: Mark[]): Segment[] {
  const flags: (Mark['kind'] | undefined)[] = new Array(text.length).fill(undefined);
  const ordered = [...marks].sort((a) => (a.kind === 'trap' ? -1 : 1)); // traps first, evidence overrides
  for (const m of ordered) {
    if (!m.text) continue;
    let i = text.indexOf(m.text);
    while (i >= 0) {
      for (let k = i; k < i + m.text.length; k++) flags[k] = m.kind;
      i = text.indexOf(m.text, i + m.text.length);
    }
  }
  const out: Segment[] = [];
  for (let i = 0; i < text.length; i++) {
    const last = out[out.length - 1];
    if (last && last.kind === flags[i]) last.text += text[i];
    else out.push({ text: text[i], kind: flags[i] });
  }
  return out;
}
