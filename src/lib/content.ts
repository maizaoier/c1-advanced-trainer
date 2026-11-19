import examJson from '../data/exam.json';
import destJson from '../data/destination.json';
import promptsJson from '../data/prompts.json';
import type { DestinationData, ExamExercise, StudyCard, StudyUnit, PromptsData } from '../types';

export const EXERCISES = examJson as unknown as ExamExercise[];
export const EXERCISE_BY_ID: Record<string, ExamExercise> = Object.fromEntries(EXERCISES.map((e) => [e.id, e]));

const dest = destJson as unknown as DestinationData;
export const UNITS: StudyUnit[] = dest.units;
export const UNIT_BY_ID: Record<string, StudyUnit> = Object.fromEntries(UNITS.map((u) => [u.id, u]));
export const CARDS: Record<string, StudyCard> = Object.fromEntries(dest.cards.map((c) => [c.id, c]));
export const CARD_ORDER: string[] = UNITS.flatMap((u) => u.cards);

export interface SpeakingCAE {
  part1: string[];
  part2: { task: string }[];
  part3: { question: string; prompts: string[] }[];
  part4: string[];
}
const prompts = promptsJson as unknown as PromptsData & { speakingCAE: SpeakingCAE };
export const PROMPTS = prompts;

export const PART_LABEL: Record<string, string> = {
  L1: 'Listening Part 1', L2: 'Listening Part 2', L3: 'Listening Part 3', L4: 'Listening Part 4',
  R5: 'Reading Part 5', R6: 'Reading Part 6', R7: 'Reading Part 7', R8: 'Reading Part 8',
};
export const PART_HINT: Record<string, string> = {
  L1: 'Extractos cortos · actitud y opinión',
  L2: 'Sentence completion · palabra exacta',
  L3: 'Entrevista larga · 4 opciones',
  L4: 'Multiple matching · 2 tareas a la vez',
  R5: 'Comprensión detallada · tono del autor',
  R6: 'Cross-text · comparar 4 opiniones',
  R7: 'Gapped text · cohesión',
  R8: 'Multiple matching · velocidad',
};
