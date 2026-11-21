import type { ExamExercise, Podcast, Progress } from '../types';
import { EXERCISES, PODCASTS } from './content';
import { planDay } from './store';

/** Accuracy per exam part from saved attempts (null = never done). */
export function partAccuracy(p: Progress, part: string): number | null {
  const a = p.attempts.filter((x) => x.part === part);
  if (!a.length) return null;
  const c = a.reduce((s, x) => s + x.correct, 0);
  const t = a.reduce((s, x) => s + x.total, 0);
  return t ? c / t : null;
}

const tries = (p: Progress, e: ExamExercise) => p.attempts.filter((a) => a.exerciseId === e.id).length;

/** Next exercise: never-done first (rotating parts), then weakest part, then least practised. */
export function nextExercise(p: Progress, skill: 'listening' | 'reading', part?: string): ExamExercise {
  const list = EXERCISES.filter((e) => e.skill === skill && (!part || e.part === part));
  const fresh = list.filter((e) => tries(p, e) === 0);
  if (fresh.length) {
    if (part) return fresh[0];
    // rotate parts day by day so every part comes up
    const parts = [...new Set(fresh.map((e) => e.part))];
    const wanted = parts[planDay(p) % parts.length];
    return fresh.find((e) => e.part === wanted) ?? fresh[0];
  }
  return list.slice().sort((a, b) => ((partAccuracy(p, a.part) ?? 0) - (partAccuracy(p, b.part) ?? 0)) || tries(p, a) - tries(p, b))[0];
}

export const podcastOfDay = (p: Progress): Podcast => PODCASTS[planDay(p) % PODCASTS.length];
export const exercisesOf = (skill: 'listening' | 'reading', part: string) => EXERCISES.filter((e) => e.skill === skill && e.part === part);
