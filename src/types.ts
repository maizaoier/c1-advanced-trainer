// ───────────── Destination C1 vocabulary ─────────────
/** w word · pv phrasal verb · id idiom · co collocations · wf word formation list · wx word formation exercise */
export type CardType = 'w' | 'pv' | 'id' | 'co' | 'wf' | 'wx';

export interface StudyCard {
  id: string;
  unit: string;
  type: CardType;
  term?: string;
  pos?: string;
  definition?: string;
  example?: string;
  es?: string;
  items?: string[];
  question?: string;
  base?: string;
  answers?: string[];
  moreSenses?: { pos: string; definition: string }[];
  fromBook?: boolean;
}

export interface StudyUnit {
  id: string;
  num: number;
  name: string;
  nameEs: string;
  cards: string[];
}

export interface DestinationData {
  units: StudyUnit[];
  cards: StudyCard[];
}

// ───────────── User progress ─────────────
/** SM-2 style state. due is epoch ms. */
export interface SrsState {
  stage: 0 | 1 | 2; // 0 new, 1 learning, 2 review
  due: number;
  interval: number; // days
  ease: number;
  reps: number;
  lapses: number;
}

export interface DayLog {
  cards: number;
  correct: number;
  wrong: number;
  newCards: number;
}

export interface Settings {
  examDate: string;
  /** new cards per day (0 = automatic) */
  newPerDay: number;
  speechRate: number;
  darkMode: 'system' | 'light' | 'dark';
  /** first day of the study plan (units unlock one per day from here) */
  planStart: string;
  /** preferred pronunciation voice (by name); empty = automatic */
  voice: string;
}

export interface Progress {
  version: 2;
  updatedAt: number;
  settings: Settings;
  cards: Record<string, SrsState>;
  days: Record<string, DayLog>;
  /** vocabulary progress (0-1) recorded once per day, to show daily gains */
  progressLog: Record<string, number>;
}
