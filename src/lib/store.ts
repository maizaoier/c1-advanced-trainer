import { useSyncExternalStore } from 'react';
import type { Attempt, DayLog, MistakeEntry, Progress, SrsState } from '../types';
import { addDays, dayKey, daysBetween, parseDayKey, startOfDay } from './date';
import { CARD_ORDER, CARDS, UNITS } from './content';
import { nextState, type Grade } from './srs';

const KEY = 'c1trainer.progress.v2';

export function freshProgress(): Progress {
  return {
    version: 2,
    updatedAt: 0,
    settings: { examDate: '2026-12-22', newPerDay: 0, speechRate: 0.95, darkMode: 'system', planStart: dayKey(), manualWriting: 0, manualSpeaking: 0 },
    cards: {},
    mistakes: {},
    attempts: [],
    days: {},
    drafts: {},
  };
}

function load(): Progress {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return freshProgress();
    const parsed = JSON.parse(raw) as Partial<Progress>;
    const base = freshProgress();
    return { ...base, ...parsed, settings: { ...base.settings, ...(parsed.settings ?? {}) } } as Progress;
  } catch {
    return freshProgress();
  }
}

let state: Progress = load();
const listeners = new Set<() => void>();

function persist(): void {
  try { localStorage.setItem(KEY, JSON.stringify(state)); } catch { /* storage full or blocked */ }
}

export function getProgress(): Progress { return state; }

/** Immutable update: fn mutates a deep copy, which then replaces the state. */
export function updateProgress(fn: (draft: Progress) => void): void {
  const next = structuredClone(state);
  fn(next);
  next.updatedAt = Date.now();
  state = next;
  persist();
  listeners.forEach((l) => l());
}

export function replaceProgress(p: Progress): void {
  state = { ...freshProgress(), ...p, settings: { ...freshProgress().settings, ...p.settings } };
  persist();
  listeners.forEach((l) => l());
}

export function useProgress(): Progress {
  return useSyncExternalStore((cb) => { listeners.add(cb); return () => listeners.delete(cb); }, () => state);
}

// ───────── derived helpers ─────────
export const examTime = (p: Progress) => parseDayKey(p.settings.examDate).getTime();
export const examEve = (p: Progress) => addDays(startOfDay(examTime(p)), -1);
export const daysLeft = (p: Progress) => Math.max(0, daysBetween(Date.now(), examTime(p)));

export function todayLog(p: Progress): DayLog {
  return p.days[dayKey()] ?? { cards: 0, correct: 0, wrong: 0, minutes: 0, newCards: 0, done: {} };
}
function ensureToday(d: Progress): DayLog {
  const k = dayKey();
  d.days[k] ??= { cards: 0, correct: 0, wrong: 0, minutes: 0, newCards: 0, done: {} };
  return d.days[k];
}

export function markTask(task: string): void {
  updateProgress((d) => { ensureToday(d).done[task] = true; });
}

export function unseenCount(p: Progress): number {
  return CARD_ORDER.reduce((n, id) => n + (p.cards[id] ? 0 : 1), 0);
}
export function recommendedNew(p: Progress): number {
  const days = Math.max(1, daysLeft(p) - 7);
  return Math.min(120, Math.max(10, Math.ceil(unseenCount(p) / days)));
}
export const newPerDay = (p: Progress) => p.settings.newPerDay || recommendedNew(p);
export const newLeftToday = (p: Progress) => Math.max(0, newPerDay(p) - todayLog(p).newCards);

/** Units unlock one per day from the plan start, in book order. */
export function unlockedUnitCount(p: Progress): number {
  return Math.min(UNITS.length, 1 + Math.max(0, daysBetween(parseDayKey(p.settings.planStart).getTime(), Date.now())));
}
export function dueCardIds(p: Progress): string[] {
  const now = Date.now();
  return CARD_ORDER.filter((id) => { const c = p.cards[id]; return c && c.due <= now; }).sort((a, b) => p.cards[a].due - p.cards[b].due);
}
export function newCardIds(p: Progress, limit: number, onlyUnit?: string): string[] {
  const out: string[] = [];
  const units = onlyUnit ? UNITS.filter((u) => u.id === onlyUnit) : UNITS.slice(0, unlockedUnitCount(p));
  for (const u of units) {
    for (const id of u.cards) {
      if (!p.cards[id]) { out.push(id); if (out.length >= limit) return out; }
    }
  }
  return out;
}

export function gradeCard(id: string, g: Grade): void {
  updateProgress((d) => {
    const wasNew = !d.cards[id];
    d.cards[id] = nextState(d.cards[id], g, examEve(d));
    const t = ensureToday(d);
    t.cards++;
    if (wasNew) t.newCards++;
    if (g >= 2) t.correct++; else if (g === 0) t.wrong++;
  });
}

// ───────── mistakes (Reading / Listening questions) ─────────
export const mistakeKey = (exerciseId: string, questionId: string) => `${exerciseId}::${questionId}`;

export function dueMistakes(p: Progress): MistakeEntry[] {
  const now = Date.now();
  return Object.values(p.mistakes).filter((m) => m.srs.due <= now).sort((a, b) => a.srs.due - b.srs.due);
}

export function gradeMistake(key: string, correct: boolean): void {
  updateProgress((d) => {
    const m = d.mistakes[key];
    if (!m) return;
    const next: SrsState = nextState(m.srs, correct ? 2 : 0, examEve(d));
    // two consecutive successful reviews spread out over time = mastered → removed
    if (correct && next.reps >= 3) delete d.mistakes[key];
    else d.mistakes[key] = { ...m, srs: next };
    const t = ensureToday(d);
    t.cards++;
    if (correct) t.correct++; else t.wrong++;
  });
}

export function recordAttempt(a: Attempt, wrongQuestionIds: string[], rightQuestionIds: string[] = []): void {
  updateProgress((d) => {
    d.attempts.push(a);
    if (d.attempts.length > 400) d.attempts = d.attempts.slice(-400);
    for (const q of wrongQuestionIds) {
      const k = mistakeKey(a.exerciseId, q);
      d.mistakes[k] = { exerciseId: a.exerciseId, questionId: q, srs: { stage: 1, due: Date.now() + 10 * 60_000, interval: 0, ease: 2.3, reps: 0, lapses: 1 } };
    }
    for (const q of rightQuestionIds) {
      const k = mistakeKey(a.exerciseId, q);
      if (d.mistakes[k]) d.mistakes[k].srs.reps++;
    }
    const t = ensureToday(d);
    t.minutes += Math.round(a.seconds / 60);
  });
}

export function streak(p: Progress): number {
  const active = (k: string) => { const d = p.days[k]; return !!d && (d.cards > 0 || Object.keys(d.done).length > 0); };
  let n = 0;
  let t = Date.now();
  if (!active(dayKey(new Date(t)))) t = addDays(t, -1);
  while (active(dayKey(new Date(t)))) { n++; t = addDays(t, -1); }
  return n;
}

export function vocabMastery(p: Progress): number {
  let s = 0;
  for (const id of CARD_ORDER) { const c = p.cards[id]; if (c) s += Math.min(1, c.interval / 10); }
  return s / CARD_ORDER.length;
}

export const cardExists = (id: string) => !!CARDS[id];
