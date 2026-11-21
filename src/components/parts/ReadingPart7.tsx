import type { ExamExercise } from '../../types';
import ExamShell from '../exam/ExamShell';
import QuestionMCQ from '../exam/QuestionMCQ';
import { optionLetter, isCorrect } from '../../lib/exam';
import { TextCard } from './shared';

/** Text around a gap: end of the paragraph before and start of the paragraph after. */
function gapContext(text: string, n: number): { before: string; after: string } {
  const paras = text.split(/\n\s*\n/);
  const i = paras.findIndex((p) => p.includes(`[GAP ${n}]`));
  if (i < 0) return { before: '', after: '' };
  const [b, a] = paras[i].split(`[GAP ${n}]`);
  const prev = b.trim() || paras[i - 1] || '';
  const next = a.trim() || paras[i + 1] || '';
  const tail = (s: string) => s.replace(/\[GAP \d+\]/g, '…').split(/(?<=[.!?])\s+/).slice(-2).join(' ');
  const head = (s: string) => s.replace(/\[GAP \d+\]/g, '…').split(/(?<=[.!?])\s+/).slice(0, 2).join(' ');
  return { before: tail(prev), after: head(next) };
}

/** Part 7: gapped text — choose the paragraph that fits each gap (one extra). */
export default function ReadingPart7({ ex, onExit }: { ex: ExamExercise; onExit: () => void }) {
  return (
    <ExamShell ex={ex} onExit={onExit} layout="pager"
      tips={['Mira las referencias: pronombres (this, it, they), conectores (however, even so) e ideas repetidas.', 'Cada párrafo se usa una vez y sobra uno.', 'Comprueba la frase de antes Y la de después del hueco.']}
      renderText={(ctx) => (
        <TextCard ex={ex} ctx={ctx} renderGap={(n) => {
          const q = ex.questions[n - 1];
          const v = ctx.answers[q.id];
          const tone = ctx.submitted ? (isCorrect(q, v) ? 'bg-emerald-500' : 'bg-coral-500') : v !== undefined ? 'bg-emerald-600' : 'bg-slate-400';
          return <span className={`mx-1 inline-block rounded-lg px-2 py-0.5 text-sm font-bold text-white ${tone}`}>{n}{v !== undefined ? ` · ${optionLetter(ex, q, v as number)}` : ''}</span>;
        }} />
      )}
      renderQuestion={(q, i, ctx) => {
        const used = new Set(Object.values(ctx.answers).filter((v): v is number => typeof v === 'number'));
        const c = gapContext(ex.textOrTranscript, i + 1);
        return (
          <>
            <div className="mb-4 rounded-2xl border-l-4 border-emerald-500 bg-white p-4 text-[15px] leading-relaxed dark:bg-slate-900">
              <span className="text-slate-500">…{c.before}</span>
              <span className="mx-1 rounded-md bg-emerald-600 px-2 py-0.5 text-sm font-bold text-white">{i + 1}</span>
              <span className="text-slate-500">{c.after}…</span>
            </div>
            <QuestionMCQ ex={ex} q={q} number={i + 1} value={ctx.answers[q.id]} onChange={(v) => ctx.setAnswer(q.id, v)} submitted={ctx.submitted} used={used} />
          </>
        );
      }}
    />
  );
}
