// ───────────── Exam content (Listening / Reading) ─────────────
export type Skill = 'listening' | 'reading' | 'useOfEnglish' | 'writing' | 'speaking';

export interface DistractorNote {
  /** index of the wrong option this note explains */
  optionIndex: number;
  /** why it is a typical Cambridge trap */
  reason: string;
  /** literal fragment of the text/transcript that tempts you (highlighted in coral) */
  trapQuote?: string;
}

export interface ExamQuestion {
  id: string;
  prompt: string;
  /** empty for open (sentence completion) questions */
  options: string[];
  /** index into `options` (or into the exercise's shared `sharedOptions`) */
  correctIndex: number;
  /** accepted answers for open questions (sentence completion) */
  acceptedAnswers?: string[];
  /** literal substring of textOrTranscript that justifies the answer (highlighted in green) */
  paraphraseEvidence: string;
  /** short explanation of the paraphrase */
  paraphraseNote: string;
  distractorAnalysis: DistractorNote[];
  /** for Listening Part 1 extracts / Part 4 tasks */
  group?: string;
}

export interface TranscriptLine {
  speaker: string;
  voice: 'male' | 'female';
  text: string;
}

export type ExercisePart =
  | 'L1' | 'L2' | 'L3' | 'L4'
  | 'R5' | 'R6' | 'R7' | 'R8';

export interface ExamExercise {
  id: string;
  part: ExercisePart;
  skill: 'listening' | 'reading';
  title: string;
  instructions: string;
  timeLimitSeconds: number;
  /** full text (reading) or flattened transcript (listening). Paragraphs separated by blank lines. */
  textOrTranscript: string;
  /** listening only: lines for multi-voice audio */
  script?: TranscriptLine[];
  /** shared options for matching tasks (R6, R7, R8, L4) */
  sharedOptions?: string[];
  questions: ExamQuestion[];
}

// ───────────── Destination vocabulary / grammar ─────────────
export type CardType = 'w' | 'pv' | 'id' | 'co' | 'wf' | 'wx' | 'g' | 'kt';

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
  options?: string[];
  correctIndex?: number;
  explanation?: string;
  sentence1?: string;
  keyword?: string;
  moreSenses?: { pos: string; definition: string }[];
  fromBook?: boolean;
}

export interface StudyUnit {
  id: string;
  num: number;
  kind: 'V' | 'G';
  name: string;
  nameEs: string;
  rules: string[];
  cards: string[];
}

export interface DestinationData {
  units: StudyUnit[];
  cards: StudyCard[];
}

export interface WritingTask { type: string; prompt: string }
export interface PromptsData {
  speaking: Record<string, string[]>;
  writing: Record<string, WritingTask>;
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

export interface Attempt {
  exerciseId: string;
  skill: Skill;
  part: string;
  correct: number;
  total: number;
  date: string; // YYYY-MM-DD
  seconds: number;
}

export interface MistakeEntry {
  exerciseId: string;
  questionId: string;
  srs: SrsState;
}

export interface DayLog {
  cards: number;
  correct: number;
  wrong: number;
  minutes: number;
  newCards: number;
  /** daily plan tasks completed, e.g. { listening: true } */
  done: Record<string, boolean | number>;
}

export interface Settings {
  examDate: string;
  newPerDay: number; // 0 = auto
  speechRate: number;
  darkMode: 'system' | 'light' | 'dark';
  /** first day of the study plan (units unlock one per day from here) */
  planStart: string;
  /** optional self/examiner estimate on the Cambridge scale (0 = use baseline) */
  manualWriting: number;
  manualSpeaking: number;
  /** which tasks appear on the Today screen */
  homeTasks: Record<HomeTask, boolean>;
  /** preferred voices for listening (by name); empty = automatic */
  voiceA: string;
  voiceB: string;
}

export type HomeTask = 'vocab' | 'grammar' | 'reading' | 'podcast' | 'listening' | 'writing' | 'speaking';

export interface Progress {
  version: 2;
  updatedAt: number;
  settings: Settings;
  cards: Record<string, SrsState>;
  mistakes: Record<string, MistakeEntry>; // key: exerciseId::questionId
  attempts: Attempt[];
  days: Record<string, DayLog>;
  drafts: Record<string, string>;
}

export const BASELINE: Record<Skill, number> = {
  listening: 161,
  reading: 170,
  useOfEnglish: 196,
  writing: 180,
  speaking: 184,
};

// ───────────── Grammar theory & real listening sources ─────────────
export interface GrammarSection { title: string; explain: string; examples: string[]; tip?: string }
export interface GrammarTheory { intro: string; sections: GrammarSection[] }

export interface PodcastLink { label: string; url: string }
export interface Podcast {
  id: string; name: string; kind: string; minutes: number; level: string; parts: string; why: string; links: PodcastLink[];
}
