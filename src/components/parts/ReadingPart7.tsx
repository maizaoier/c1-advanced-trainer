import type { ExamExercise } from '../../types';
import ExamShell from '../exam/ExamShell';
import HighlightedText from '../exam/HighlightedText';
import QuestionMCQ from '../exam/QuestionMCQ';
import { optionLetter, isCorrect } from '../../lib/exam';
import { Card } from '../ui';

/** Part 7: gapped text — choose the paragraph that fits each gap (one extra). */
export default function ReadingPart7({ ex, onExit }: { ex: ExamExercise; onExit: () => void }) {
  return (
    <ExamShell ex={ex} onExit={onExit}>
      {(ctx) => {
        const used = new Set(Object.values(ctx.answers).filter((v): v is number => typeof v === 'number'));
        const gap = (n: number) => {
          const q = ex.questions[n - 1];
          const v = ctx.answers[q.id];
          const tone = ctx.submitted ? (isCorrect(q, v) ? 'bg-emerald-500' : 'bg-coral-500') : v !== undefined ? 'bg-emerald-600' : 'bg-slate-400';
          return <span className={`mx-1 inline-block rounded-lg px-2 py-0.5 text-sm font-bold text-white ${tone}`}>{n}{v !== undefined ? ` · ${optionLetter(ex, q, v as number)}` : ''}</span>;
        };
        return (
          <div className="space-y-6">
            <div className="rounded-2xl bg-slate-100 p-3 text-sm text-slate-600 dark:bg-slate-800 dark:text-slate-300">
              Busca referencias: pronombres (this, it, they), conectores (however, even so) y repeticiones de ideas antes y después del hueco. Cada párrafo se usa una vez; sobra uno.
            </div>
            <Card><HighlightedText text={ex.textOrTranscript} markable={!ctx.submitted} marks={ctx.reviewMarks} renderGap={gap} /></Card>
            {ex.questions.map((q, i) => (
              <QuestionMCQ key={q.id} ex={ex} q={q} number={i + 1} value={ctx.answers[q.id]} onChange={(v) => ctx.setAnswer(q.id, v)} submitted={ctx.submitted} used={used} />
            ))}
          </div>
        );
      }}
    </ExamShell>
  );
}
