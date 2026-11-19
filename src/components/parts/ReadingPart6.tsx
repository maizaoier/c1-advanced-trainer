import type { ExamExercise } from '../../types';
import ExamShell from '../exam/ExamShell';
import HighlightedText from '../exam/HighlightedText';
import QuestionMCQ from '../exam/QuestionMCQ';
import { Card } from '../ui';

/** Part 6: cross-text multiple matching (compare four writers' opinions). */
export default function ReadingPart6({ ex, onExit }: { ex: ExamExercise; onExit: () => void }) {
  return (
    <ExamShell ex={ex} onExit={onExit}>
      {(ctx) => (
        <div className="space-y-6">
          <div className="rounded-2xl bg-slate-100 p-3 text-sm text-slate-600 dark:bg-slate-800 dark:text-slate-300">
            Método: para cada pregunta, resume primero en 3 palabras la postura de cada experto sobre ESE tema. Atención a «shares… view» (misma opinión) vs. «different view» (el único que discrepa).
          </div>
          <Card><HighlightedText text={ex.textOrTranscript} markable={!ctx.submitted} marks={ctx.reviewMarks} /></Card>
          {ex.questions.map((q, i) => (
            <QuestionMCQ key={q.id} compact ex={ex} q={q} number={i + 1} value={ctx.answers[q.id]} onChange={(v) => ctx.setAnswer(q.id, v)} submitted={ctx.submitted} />
          ))}
        </div>
      )}
    </ExamShell>
  );
}
