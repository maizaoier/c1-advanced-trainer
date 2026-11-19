import type { ExamExercise } from '../../types';
import ExamShell from '../exam/ExamShell';
import AudioPlayer from '../exam/AudioPlayer';
import { isCorrect } from '../../lib/exam';
import { Transcript } from './shared';

/** Part 2: sentence completion — exact words, spelling counts. */
export default function ListeningPart2({ ex, onExit }: { ex: ExamExercise; onExit: () => void }) {
  return (
    <ExamShell ex={ex} onExit={onExit}>
      {(ctx) => (
        <div className="space-y-5">
          <AudioPlayer script={ex.script ?? []} locked={ctx.submitted} />
          <div className="rounded-2xl bg-slate-100 p-3 text-sm text-slate-600 dark:bg-slate-800 dark:text-slate-300">
            Escribe la palabra o frase EXACTA que oyes (1-3 palabras). La ortografía cuenta. Lee las frases antes de escuchar y predice qué tipo de palabra falta.
          </div>
          {ex.questions.map((q, i) => {
            const [before, after] = q.prompt.split('______');
            const v = (ctx.answers[q.id] as string) ?? '';
            const ok = ctx.submitted && isCorrect(q, v);
            return (
              <div key={q.id} className="text-[15.5px] leading-9">
                <b className="mr-2 rounded-md bg-slate-900 px-1.5 py-0.5 text-xs text-white dark:bg-white dark:text-slate-900">{i + 1}</b>
                {before}
                <input
                  value={v}
                  disabled={ctx.submitted}
                  onChange={(e) => ctx.setAnswer(q.id, e.target.value)}
                  autoCapitalize="off" autoCorrect="off" spellCheck={false}
                  className={`mx-1 w-40 rounded-lg border-b-2 bg-transparent px-2 py-0.5 text-center font-semibold outline-none ${ctx.submitted ? (ok ? 'border-emerald-500 bg-emerald-100 dark:bg-emerald-900/50' : 'border-coral-500 bg-coral-100 dark:bg-coral-900/50') : 'border-emerald-500 focus:bg-emerald-50 dark:focus:bg-emerald-950'}`}
                />
                {after}
              </div>
            );
          })}
          <Transcript ex={ex} ctx={ctx} />
        </div>
      )}
    </ExamShell>
  );
}
