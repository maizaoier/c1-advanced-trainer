import type { ExamExercise } from '../../types';
import ExamShell from '../exam/ExamShell';
import AudioPlayer from '../exam/AudioPlayer';
import { isCorrect } from '../../lib/exam';
import { TranscriptCard } from './shared';

/** Part 2: sentence completion — exact words, spelling counts. */
export default function ListeningPart2({ ex, onExit }: { ex: ExamExercise; onExit: () => void }) {
  return (
    <ExamShell ex={ex} onExit={onExit} layout="list"
      tips={['Escribe la palabra EXACTA que oyes (1-3 palabras). La ortografía cuenta.', 'Antes de escuchar, predice el tipo de palabra: ¿nombre, lugar, número?', 'Cuidado: suelen mencionar primero una respuesta falsa («We expected… In fact…»).']}
      renderText={(ctx) => <AudioPlayer script={ex.script ?? []} locked={ctx.submitted} />}
      renderAfter={(ctx) => <TranscriptCard ex={ex} ctx={ctx} />}
      renderQuestion={(q, i, ctx) => {
        const [before, after] = q.prompt.split('______');
        const v = (ctx.answers[q.id] as string) ?? '';
        const ok = ctx.submitted && isCorrect(q, v);
        return (
          <div className="text-[16px] leading-9">
            <b className="mr-2 rounded-md bg-slate-900 px-1.5 py-0.5 text-xs text-white dark:bg-white dark:text-slate-900">{i + 1}</b>
            {before}
            <input value={v} disabled={ctx.submitted} onChange={(e) => ctx.setAnswer(q.id, e.target.value)}
              autoCapitalize="off" autoCorrect="off" spellCheck={false}
              className={`mx-1 w-40 rounded-lg border-b-2 bg-transparent px-2 py-0.5 text-center font-semibold outline-none ${ctx.submitted ? (ok ? 'border-emerald-500 bg-emerald-100 dark:bg-emerald-900/50' : 'border-coral-500 bg-coral-100 dark:bg-coral-900/50') : 'border-emerald-500 focus:bg-emerald-50 dark:focus:bg-emerald-950'}`} />
            {after}
          </div>
        );
      }}
    />
  );
}
