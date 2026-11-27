import { useSyncExternalStore } from 'react';
import type { DayLog, Progress } from '../types';
import { addDays, dayKey, daysBetween, parseDayKey, startOfDay } from './date';
import { CARD_ORDER, CARDS, UNITS } from './content';
import { nextState, type Grade } from './srs';

const KEY = 'c1trainer.progress.v2'; // same key as earlier versions: progress is kept after updating

export function freshProgress(): Progress {
  return {
    version: 2,
    updatedAt: 0,
    settings: { examDate: '2026-12-22', newPerDay: 0, speechRate: 0.95, darkMode: 'system', planStart: dayKey(), voice: '' },
    cards: {},
    days: {},
    progressLog: {},
  };
}

/** Accepts data saved by older versions (which also had grammar, reading…) and keeps only vocabulary. */
function merge(parsed: Partial<Progress> & { settings?: Partial<Progress['settings']> & { voiceA?: string } }): Progress {
  const base = freshProgress();
  const cards = Object.fromEntries(Object.entries(parsed.cards ?? {}).filter(([id]) => CARDS[id]));
  const days: Record<string, DayLog> = {};
  for (const [k, d] of Object.entries(parsed.days ?? {})) {
    days[k] = { cards: d.cards ?? 0, correct: d.correct ?? 0, wrong: d.wrong ?? 0, newCards: d.newCards ?? 0 };
  }
  const s: Partial<Progress['settings']> & { voiceA?: string } = parsed.settings ?? {};
  return {
    ...base,
    updatedAt: parsed.updatedAt ?? 0,
    settings: {
      ...base.settings,
      examDate: s.examDate ?? base.settings.examDate,
      newPerDay: s.newPerDay ?? 0,
      speechRate: s.speechRate ?? base.settings.speechRate,
      darkMode: s.darkMode ?? 'system',
      planStart: s.planStart ?? base.settings.planStart,
      voice: s.voice ?? s.voiceA ?? '',
    },
    cards,
    days,
    progressLog: parsed.progressLog ?? {},
  };
}

function load(): Progress {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? merge(JSON.parse(raw)) : freshProgress();
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

const emptyDay = (): DayLog => ({ cards: 0, correct: 0, wrong: 0, newCards: 0 });
export function todayLog(p: Progress): DayLog { return p.days[dayKey()] ?? emptyDay(); }

export function unseenCount(p: Progress): number {
  return CARD_ORDER.reduce((n, id) => n + (p.cards[id] ? 0 : 1), 0);
}
/** Spread what is left over the days before the exam, capped at 40/day so a session stays ~15 min. */
export function recommendedNew(p: Progress): number {
  const days = Math.max(1, daysLeft(p) - 3);
  return Math.min(40, Math.max(10, Math.ceil(unseenCount(p) / days)));
}
export const newPerDay = (p: Progress) => p.settings.newPerDay || recommendedNew(p);
export const newLeftToday = (p: Progress) => Math.max(0, newPerDay(p) - todayLog(p).newCards);

/** Units unlock one per day from the plan start. */
export function unlockedUnits(p: Progress): number {
  return Math.min(UNITS.length, 1 + planDay(p));
}
export function dueCardIds(p: Progress, unit?: string): string[] {
  const now = Date.now();
  const ids = unit ? CARD_ORDER.filter((id) => CARDS[id].unit === unit) : CARD_ORDER;
  return ids.filter((id) => { const c = p.cards[id]; return c && c.due <= now; }).sort((a, b) => p.cards[a].due - p.cards[b].due);
}
export function newCardIds(p: Progress, limit: number, onlyUnit?: string): string[] {
  const out: string[] = [];
  const units = onlyUnit ? UNITS.filter((u) => u.id === onlyUnit) : UNITS.slice(0, unlockedUnits(p));
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
    const k = dayKey();
    const t = (d.days[k] ??= emptyDay());
    t.cards++;
    if (wasNew) t.newCards++;
    if (g >= 2) t.correct++; else if (g === 0) t.wrong++;
  });
}

export function streak(p: Progress): number {
  const active = (k: string) => (p.days[k]?.cards ?? 0) > 0;
  let n = 0;
  let t = Date.now();
  if (!active(dayKey(new Date(t)))) t = addDays(t, -1);
  while (active(dayKey(new Date(t)))) { n++; t = addDays(t, -1); }
  return n;
}

/** 0-1 per card: grows with the review interval (10+ days = consolidated). */
const cardStrength = (p: Progress, id: string) => { const c = p.cards[id]; return c ? Math.min(1, c.interval / 10) : 0; };

/** Overall progress: half for studying each card once, half for consolidating it. */
export function progressValue(p: Progress, ids: string[] = CARD_ORDER): number {
  if (!ids.length) return 0;
  let seen = 0, strength = 0;
  for (const id of ids) { if (p.cards[id]) seen++; strength += cardStrength(p, id); }
  return 0.5 * (seen / ids.length) + 0.5 * (strength / ids.length);
}
export const seenCount = (p: Progress, ids: string[] = CARD_ORDER) => ids.filter((id) => p.cards[id]).length;
export const learnedCount = (p: Progress, ids: string[] = CARD_ORDER) => ids.filter((id) => (p.cards[id]?.interval ?? 0) >= 10).length;
