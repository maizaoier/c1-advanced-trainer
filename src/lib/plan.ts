import type { ExamExercise, Progress } from '../types';
import { EXERCISES } from './content';

/** Accuracy per exam part from saved attempts (null = never done). */
export function partAccuracy(p: Progress, part: string): number | null {
  const a = p.attempts.filter((x) => x.part === part);
  if (!a.length) return null;
  const c = a.reduce((s, x) => s + x.correct, 0);
  const t = a.reduce((s, x) => s + x.total, 0);
  return t ? c / t : null;
}

/** Next exercise for a skill: never-done first, then weakest part, then least recently done. */
export function nextExercise(p: Progress, skill: 'listening' | 'reading', dayIndex: number): ExamExercise {
  const list = EXERCISES.filter((e) => e.skill === skill);
  const count = (e: ExamExercise) => p.attempts.filter((a) => a.exerciseId === e.id).length;
  const fresh = list.filter((e) => count(e) === 0);
  if (fresh.length) return fresh[dayIndex % fresh.length];
  return list.slice().sort((a, b) => {
    const pa = partAccuracy(p, a.part) ?? 0, pb = partAccuracy(p, b.part) ?? 0;
    return pa - pb || count(a) - count(b);
  })[0];
}

export const EXTERNAL_LISTENING = [
  { name: 'BBC Radio 4 · The Food Programme / Desert Island Discs', why: 'Entrevistas largas como la Part 3: opiniones matizadas.' },
  { name: 'BBC 6 Minute English → Learning English “The English We Speak”', why: 'Expresiones idiomáticas y paráfrasis rápidas.' },
  { name: 'TED Talks (sin subtítulos)', why: 'Monólogos tipo Part 2: datos concretos y números.' },
  { name: 'The Guardian · Today in Focus', why: 'Debates con cambios de opinión (hedging) como en Part 1.' },
];
export const EXTERNAL_QUESTIONS = [
  '¿Cuál era la opinión principal del hablante? Escríbela con tus propias palabras (paráfrasis).',
  '¿En algún momento cambió de opinión o matizó algo? ¿Con qué palabras (however, mind you, having said that…)?',
  'Anota 3 datos concretos (nombres, cifras, lugares) que se mencionaran.',
  'Anota 3 palabras o expresiones nuevas y escribe una frase con cada una.',
];
