import type { Progress } from '../types';
import { EXERCISES, TRACK_ORDER, type Track } from './content';
import { mastery } from './store';

/**
 * Overall preparation: one percentage that grows with EVERY activity.
 * Weights follow the study priorities (Listening and Reading weigh most).
 */
export interface Component { id: string; label: string; icon: string; weight: number; value: number; detail: string }

const TARGET = { podcasts: 20, writing: 8, speaking: 12 };

function bestScores(p: Progress, skill: 'listening' | 'reading'): { avg: number; done: number; total: number } {
  const list = EXERCISES.filter((e) => e.skill === skill);
  let sum = 0, done = 0;
  for (const e of list) {
    const tries = p.attempts.filter((a) => a.exerciseId === e.id);
    if (!tries.length) continue;
    done++;
    sum += Math.max(...tries.map((a) => a.correct / a.total));
  }
  return { avg: list.length ? sum / list.length : 0, done, total: list.length };
}

/** Half for having studied each card once, half for consolidating it (long interval). */
function trackValue(p: Progress, t: Track): { value: number; seen: number; total: number } {
  const ids = TRACK_ORDER[t];
  const seen = ids.filter((id) => p.cards[id]).length;
  return { value: 0.5 * (seen / ids.length) + 0.5 * mastery(p, t), seen, total: ids.length };
}

const daysWith = (p: Progress, task: string) => Object.values(p.days).filter((d) => d.done[task] === true).length;

export function overallProgress(p: Progress): { total: number; parts: Component[] } {
  const ls = bestScores(p, 'listening');
  const rs = bestScores(p, 'reading');
  const pods = daysWith(p, 'external');
  const wr = daysWith(p, 'writing');
  const sp = daysWith(p, 'speaking');
  const vocab = trackValue(p, 'vocab');
  const gram = trackValue(p, 'grammar');
  const parts: Component[] = [
    { id: 'listening', label: 'Listening', icon: '🎧', weight: 25, value: 0.5 * ls.avg + 0.5 * Math.min(1, pods / TARGET.podcasts), detail: `${ls.done}/${ls.total} ejercicios · ${pods}/${TARGET.podcasts} escuchas reales` },
    { id: 'reading', label: 'Reading', icon: '📖', weight: 20, value: rs.avg, detail: `${rs.done}/${rs.total} textos (cuenta tu mejor nota)` },
    { id: 'vocab', label: 'Vocabulario', icon: '🧠', weight: 20, value: vocab.value, detail: `${vocab.seen}/${vocab.total} tarjetas estudiadas` },
    { id: 'grammar', label: 'Gramática', icon: '📐', weight: 15, value: gram.value, detail: `${gram.seen}/${gram.total} preguntas estudiadas` },
    { id: 'writing', label: 'Writing', icon: '✍️', weight: 10, value: Math.min(1, wr / TARGET.writing), detail: `${wr}/${TARGET.writing} redacciones` },
    { id: 'speaking', label: 'Speaking', icon: '🗣️', weight: 10, value: Math.min(1, sp / TARGET.speaking), detail: `${sp}/${TARGET.speaking} simulacros` },
  ];
  const total = parts.reduce((s, c) => s + c.weight * c.value, 0) / 100;
  return { total, parts };
}
