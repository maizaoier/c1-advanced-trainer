import type { SrsState } from '../types';
import { addDays, startOfDay } from './date';

const MIN = 60_000;
export type Grade = 0 | 1 | 2 | 3; // again, hard, good, easy

export const newState = (): SrsState => ({ stage: 0, due: 0, interval: 0, ease: 2.4, reps: 0, lapses: 0 });

/**
 * SM-2 variant. Intervals are capped so that nothing is scheduled after the day before the exam:
 * cards that would fall later are pulled back into the last days for a final review.
 */
export function nextState(prev: SrsState | undefined, g: Grade, examEve: number, preview = false): SrsState {
  const now = Date.now();
  const s: SrsState = prev ? { ...prev } : newState();
  if (g === 0) {
    if (s.stage === 2) s.lapses++;
    s.ease = Math.max(1.3, s.ease - 0.2);
    s.interval = 0;
    s.stage = 1;
    s.due = now + (s.reps ? 5 : 1) * MIN;
    return s;
  }
  let ivl = s.interval;
  if (g === 1) { ivl = s.stage === 2 ? Math.max(1, ivl * 1.2) : 1; s.ease = Math.max(1.3, s.ease - 0.15); }
  else if (g === 2) ivl = s.reps === 0 || ivl < 1 ? 1 : ivl < 2 ? 3 : ivl * s.ease;
  else { ivl = s.reps === 0 || ivl < 1 ? 4 : Math.max(ivl + 1, ivl * s.ease * 1.35); s.ease += 0.15; }
  s.interval = Math.max(1, Math.round(ivl));
  s.stage = 2;
  s.reps++;
  let due = addDays(startOfDay(now), s.interval);
  if (due > examEve) {
    const back = preview ? 0 : Math.floor(Math.random() * 4);
    due = Math.max(addDays(startOfDay(now), 1), addDays(examEve, -back));
  }
  s.due = due;
  return s;
}

export function intervalLabel(prev: SrsState | undefined, g: Grade, examEve: number): string {
  const n = nextState(prev, g, examEve, true);
  if (n.stage === 1) return `${Math.round((n.due - Date.now()) / MIN)} min`;
  const days = Math.round((n.due - startOfDay()) / 86_400_000);
  return `${Math.max(1, days)} d`;
}
