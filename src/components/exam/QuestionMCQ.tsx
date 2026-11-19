import type { ExamExercise, ExamQuestion } from '../../types';
import { optionLetter, optionRange, optionText, type AnswerValue } from '../../lib/exam';

interface Props {
  ex: ExamExercise;
  q: ExamQuestion;
  number: number;
  value: AnswerValue;
  onChange: (v: number) => void;
  submitted: boolean;
  /** compact letter-only buttons for matching tasks where the options are listed once above */
  compact?: boolean;
  /** option indices already used elsewhere (gapped text) */
  used?: Set<number>;
}

export default function QuestionMCQ({ ex, q, number, value, onChange, submitted, compact, used }: Props) {
  const range = optionRange(ex, q);
  const state = (i: number) => {
    if (!submitted) return value === i ? 'selected' : 'idle';
    if (i === q.correctIndex) return 'correct';
    if (value === i) return 'wrong';
    return 'idle';
  };
  const cls: Record<string, string> = {
    idle: 'border-transparent bg-slate-100 dark:bg-slate-800',
    selected: 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950',
    correct: 'border-emerald-500 bg-emerald-100 dark:bg-emerald-900/60',
    wrong: 'border-coral-500 bg-coral-100 dark:bg-coral-900/60',
  };
  return (
    <div className="animate-rise">
      <div className="mb-2 flex gap-2 text-[15.5px] font-medium leading-snug">
        <span className="flex h-6 min-w-6 items-center justify-center rounded-md bg-slate-900 px-1.5 text-xs font-bold text-white dark:bg-white dark:text-slate-900">{number}</span>
        <span>{q.prompt}</span>
      </div>
      {compact ? (
        <div className="flex flex-wrap gap-2">
          {range.map((i) => (
            <button key={i} disabled={submitted} onClick={() => onChange(i)}
              className={`h-11 min-w-11 rounded-xl border-2 px-3 font-bold transition ${cls[state(i)]} ${used?.has(i) && value !== i && !submitted ? 'opacity-40' : ''}`}>
              {optionLetter(ex, q, i)}
            </button>
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {range.map((i) => (
            <button key={i} disabled={submitted} onClick={() => onChange(i)}
              className={`flex w-full gap-3 rounded-2xl border-2 px-4 py-3 text-left text-[15px] leading-snug transition ${cls[state(i)]} ${used?.has(i) && value !== i && !submitted ? 'opacity-40' : ''}`}>
              <b className="flex-none">{optionLetter(ex, q, i)}</b>
              <span>{optionText(q, i)}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
