import type { Attempt, Skill } from '../types';
import { BASELINE } from '../types';

/**
 * Approximate conversion from % correct to the Cambridge English Scale for C1 Advanced.
 * Anchors: 60% ≈ 180 (pass), 80% ≈ 200 (Grade A). Only an orientation, not an official score.
 */
export function pctToScale(pct: number): number {
  const p = Math.max(0, Math.min(1, pct)) * 100;
  if (p <= 30) return 150 + (p / 30) * 10;
  if (p <= 60) return 160 + ((p - 30) / 30) * 20;
  if (p <= 80) return 180 + ((p - 60) / 20) * 20;
  return 200 + ((p - 80) / 20) * 10;
}

export interface SkillEstimate { skill: Skill; baseline: number; estimate: number; samples: number }

/** Uses the most recent questions (up to 40) per skill; blends with the baseline while data is scarce. */
export function estimate(skill: Skill, attempts: Attempt[], manual?: number): SkillEstimate {
  const base = BASELINE[skill];
  if (manual) return { skill, baseline: base, estimate: manual, samples: 1 };
  const mine = attempts.filter((a) => a.skill === skill).slice().reverse();
  let correct = 0, total = 0;
  for (const a of mine) {
    if (total >= 40) break;
    correct += a.correct;
    total += a.total;
  }
  if (!total) return { skill, baseline: base, estimate: base, samples: 0 };
  const measured = pctToScale(correct / total);
  const w = Math.min(1, total / 20); // full weight after ~20 questions
  return { skill, baseline: base, estimate: Math.round(base * (1 - w) + measured * w), samples: total };
}

export const SKILL_LABEL: Record<Skill, string> = {
  listening: 'Listening', reading: 'Reading', useOfEnglish: 'Use of English', writing: 'Writing', speaking: 'Speaking',
};

export function cefrFor(score: number): string {
  if (score >= 200) return 'C1 · Grade A';
  if (score >= 193) return 'C1 · Grade B';
  if (score >= 180) return 'C1 · Grade C';
  if (score >= 160) return 'B2';
  return 'B1';
}
