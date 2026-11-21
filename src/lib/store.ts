import { useSyncExternalStore } from 'react';
import type { Attempt, DayLog, HomeTask, MistakeEntry, Progress, SrsState } from '../types';
import { addDays, dayKey, daysBetween, parseDayKey, startOfDay } from './date';
import { CARDS, TRACK_ORDER, GRAMMAR_UNITS, VOCAB_UNITS, type Track } from './content';
import { nextState, type Grade } from './srs';

const KEY = 'c1trainer.progress.v2';

export const DEFAULT_TASKS: Record<HomeTask, boolean> = {
  vocab: true, grammar: true, reading: true, podcast: true, listening: false, writing: false, speaking: false,
};

export function freshProgress(): Progress {
  return {
    version: 2,
    updatedAt: 0,
    settings: {
      examDate: '2026-12-22', newPerDay: 0, speechRate: 0.95, darkMode: 'system', planStart: dayKey(),
      manualWriting: 0, manualSpeaking: 0, homeTasks: { ...DEFAULT_TASKS }, voiceA: '', voiceB: '',
    },
    cards: {},
    mistakes: {},
    attempts: [],
    days: {},
    drafts: {},
    progressLog: {},
  };
}

function merge(parsed: Partial<Progress>): Progress {
  const base = freshProgress();
  const settings = { ...base.settings, ...(parsed.settings ?? {}) };
  settings.homeTasks = { ...DEFAULT_TASKS, ...(parsed.settings?.homeTasks ?? {}) };
  return { ...base, ...parsed, settings } as Progress;
}

function load(): Progress {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? merge(JSON.parse(raw) as Partial<Progress>) : freshProgress();
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
  state = merge(p);
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
export const planDay = (p: Progress) => Math.max(0, daysBetween(parseDayKey(p.settings.planStart).getTime(), Date.now()));

const emptyDay = (): DayLog => ({ cards: 0, correct: 0, wrong: 0, minutes: 0, newCards: 0, done: {} });
export function todayLog(p: Progress): DayLog { return p.days[dayKey()] ?? emptyDay(); }
function ensureToday(d: Progress): DayLog {
  const k = dayKey();
  d.days[k] ??= emptyDay();
  return d.days[k];
}

export function markTask(task: string): void {
  updateProgress((d) => { ensureToday(d).done[task] = true; });
}

/** New cards introduced today per track (stored as done['new:vocab'] counters to keep DayLog simple). */
export function newToday(p: Progress, track: Track): number {
  return Number(todayLog(p).done[`new:${track}` as string] ?? 0) || 0;
}

export function unseenCount(p: Progress, track: Track): number {
  return TRACK_ORDER[track].reduce((n, id) => n + (p.cards[id] ? 0 : 1), 0);
}

/** Vocabulary: spread what is left over the days before the exam, capped at 40/day so a session stays ~15 min. */
export function recommendedNew(p: Progress): number {
  const days = Math.max(1, daysLeft(p) - 5);
  return Math.min(40, Math.max(10, Math.ceil(unseenCount(p, 'vocab') / days)));
}
export const GRAMMAR_NEW_PER_DAY = 8;
export function newPerDay(p: Progress, track: Track): number {
  return track === 'grammar' ? GRAMMAR_NEW_PER_DAY : p.settings.newPerDay || recommendedNew(p);
}
export const newLeftToday = (p: Progress, track: Track) => Math.max(0, newPerDay(p, track) - newToday(p, track));

/** Vocabulary units unlock one per day from the plan start; grammar units are all open. */
export function unlockedVocabUnits(p: Progress): number {
  return Math.min(VOCAB_UNITS.length, 1 + planDay(p));
}
export function dueCardIds(p: Progress, track: Track, unit?: string): string[] {
  const now = Date.now();
  const ids = unit ? TRACK_ORDER[track].filter((id) => CARDS[id].unit === unit) : TRACK_ORDER[track];
  return ids.filter((id) => { const c = p.cards[id]; return c && c.due <= now; }).sort((a, b) => p.cards[a].due - p.cards[b].due);
}
export function newCardIds(p: Progress, track: Track, limit: number, onlyUnit?: string): string[] {
  const out: string[] = [];
  const units = track === 'vocab' ? VOCAB_UNITS.slice(0, unlockedVocabUnits(p)) : GRAMMAR_UNITS;
  for (const u of onlyUnit ? [...VOCAB_UNITS, ...GRAMMAR_UNITS].filter((x) => x.id === onlyUnit) : units) {
    for (const id of u.cards) {
      if (!p.cards[id]) { out.push(id); if (out.length >= limit) return out; }
    }
  }
  return out;
}
/** The grammar unit to work on today: the first one not fully seen. */
export function currentGrammarUnit(p: Progress) {
  return GRAMMAR_UNITS.find((u) => u.cards.some((id) => !p.cards[id])) ?? GRAMMAR_UNITS[planDay(p) % GRAMMAR_UNITS.length];
}

export function gradeCard(id: string, g: Grade): void {
  updateProgress((d) => {
    const wasNew = !d.cards[id];
    d.cards[id] = nextState(d.cards[id], g, examEve(d));
    const t = ensureToday(d);
    t.cards++;
    if (wasNew) {
      t.newCards++;
      const k = `new:${CARDS[id]?.type === 'g' || CARDS[id]?.type === 'kt' ? 'grammar' : 'vocab'}`;
      (t.done as Record<string, unknown>)[k] = (Number((t.done as Record<string, unknown>)[k]) || 0) + 1;
    }
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
  const active = (k: string) => { const d = p.days[k]; return !!d && (d.cards > 0 || Object.keys(d.done).some((x) => !x.startsWith('new:'))); };
  let n = 0;
  let t = Date.now();
  if (!active(dayKey(new Date(t)))) t = addDays(t, -1);
  while (active(dayKey(new Date(t)))) { n++; t = addDays(t, -1); }
  return n;
}

export function mastery(p: Progress, track: Track, unitCards?: string[]): number {
  const ids = unitCards ?? TRACK_ORDER[track];
  let s = 0;
  for (const id of ids) { const c = p.cards[id]; if (c) s += Math.min(1, c.interval / 10); }
  return ids.length ? s / ids.length : 0;
}
