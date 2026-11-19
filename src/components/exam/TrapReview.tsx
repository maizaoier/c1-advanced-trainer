import type { ExamExercise } from '../../types';
import { answerLabel, correctLabel, isCorrect, isOpen, optionLetter, type Answers } from '../../lib/exam';
import { Pill } from '../ui';

/**
 * "Detector de trampas": for every question, shows why the right answer is right (exact paraphrase)
 * and why each distractor is a typical Cambridge trap. Tapping a question focuses its marks in the text.
 */
export default function TrapReview({ ex, answers, focus, onFocus }: { ex: ExamExercise; answers: Answers; focus?: string; onFocus: (id?: string) => void }) {
  return (
    <div className="space-y-3">
      {ex.questions.map((q, n) => {
        const ok = isCorrect(q, answers[q.id]);
        const active = focus === q.id;
        return (
          <div key={q.id} className={`rounded-3xl border-2 bg-white p-4 transition dark:bg-slate-900 ${active ? 'border-emerald-400' : 'border-transparent'}`}>
            <button className="flex w-full items-start gap-2 text-left" onClick={() => onFocus(active ? undefined : q.id)}>
              <span className={`mt-0.5 grid h-6 w-6 flex-none place-items-center rounded-full text-xs font-bold text-white ${ok ? 'bg-emerald-500' : 'bg-coral-500'}`}>{ok ? '✓' : '✗'}</span>
              <span className="flex-1 font-medium leading-snug">{n + 1}. {q.prompt}</span>
              <span className="text-xs text-emerald-700 dark:text-emerald-400">{active ? 'ver todo' : 'ver en texto'}</span>
            </button>
            <div className="mt-3 space-y-1.5 text-sm">
              {!ok && <div><Pill tone="coral">Tu respuesta</Pill> <span className="ml-1">{answerLabel(ex, q, answers[q.id])}</span></div>}
              <div><Pill tone="emerald">Correcta</Pill> <span className="ml-1 font-medium">{correctLabel(ex, q)}</span></div>
            </div>
            <div className="mt-3 rounded-2xl bg-emerald-50 p-3 text-sm dark:bg-emerald-950/60">
              <div className="mb-1 text-xs font-bold uppercase tracking-wide text-emerald-700 dark:text-emerald-400">Paráfrasis exacta</div>
              <div className="italic">“{q.paraphraseEvidence}”</div>
              <div className="mt-1.5 text-slate-700 dark:text-slate-300">{q.paraphraseNote}</div>
            </div>
            {q.distractorAnalysis.length > 0 && (
              <div className="mt-2 rounded-2xl bg-coral-50 p-3 text-sm dark:bg-coral-900/30">
                <div className="mb-1 text-xs font-bold uppercase tracking-wide text-coral-600 dark:text-coral-400">Trampas</div>
                <ul className="space-y-2">
                  {q.distractorAnalysis.map((d, i) => (
                    <li key={i} className={!isOpen(q) && answers[q.id] === d.optionIndex ? 'font-semibold' : ''}>
                      {!isOpen(q) && <b className="mr-1">{optionLetter(ex, q, d.optionIndex)}:</b>}
                      {d.reason}
                      {!isOpen(q) && answers[q.id] === d.optionIndex && <span className="ml-1 text-coral-600"> ← caíste aquí</span>}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
