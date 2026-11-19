import type { ExamExercise, ExamQuestion } from '../types';
import { answerMatches, type Mark } from './text';

export type AnswerValue = number | string | undefined;
export type Answers = Record<string, AnswerValue>;

export const isOpen = (q: ExamQuestion) => q.options.length === 0;

export function isCorrect(q: ExamQuestion, a: AnswerValue): boolean {
  if (a === undefined || a === '') return false;
  if (isOpen(q)) return answerMatches(String(a), q.acceptedAnswers ?? []);
  return a === q.correctIndex;
}

/** Option indices to show for a question (Listening Part 4 has two lists of 8 in one array). */
export function optionRange(ex: ExamExercise, q: ExamQuestion): number[] {
  const all = q.options.map((_, i) => i);
  if (ex.part === 'L4') return q.group === 'Task 2' ? all.slice(8, 16) : all.slice(0, 8);
  return all;
}

const LETTERS = 'ABCDEFGH';
/** Letter shown for an option: matching lists carry their own letter ("A  Helen Marsh"). */
export function optionLetter(ex: ExamExercise, q: ExamQuestion, i: number): string {
  const label = q.options[i] ?? '';
  const m = label.match(/^([A-H])\s{2}/);
  if (m) return m[1];
  return LETTERS[optionRange(ex, q).indexOf(i)] ?? '?';
}
export function optionText(q: ExamQuestion, i: number): string {
  return (q.options[i] ?? '').replace(/^[A-H]\s{2}/, '');
}

export function answerLabel(ex: ExamExercise, q: ExamQuestion, a: AnswerValue): string {
  if (a === undefined || a === '') return '—';
  if (isOpen(q)) return String(a);
  return `${optionLetter(ex, q, a as number)} · ${optionText(q, a as number)}`;
}

export function correctLabel(ex: ExamExercise, q: ExamQuestion): string {
  if (isOpen(q)) return (q.acceptedAnswers ?? []).join(' / ');
  return `${optionLetter(ex, q, q.correctIndex)} · ${optionText(q, q.correctIndex)}`;
}

export function marksFor(qs: ExamQuestion[]): Mark[] {
  const marks: Mark[] = [];
  for (const q of qs) {
    marks.push({ text: q.paraphraseEvidence, kind: 'evidence' });
    for (const d of q.distractorAnalysis) if (d.trapQuote) marks.push({ text: d.trapQuote, kind: 'trap' });
  }
  return marks;
}

/** The paragraph of the text that contains a quote (used to re-ask a failed question). */
export function paragraphWith(text: string, quote: string): string {
  return text.split(/\n\s*\n/).find((p) => p.includes(quote)) ?? quote;
}
