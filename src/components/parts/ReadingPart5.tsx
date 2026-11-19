import type { ExamExercise } from '../../types';
import ExamShell from '../exam/ExamShell';
import HighlightedText from '../exam/HighlightedText';
import QuestionMCQ from '../exam/QuestionMCQ';
import { Card } from '../ui';

/** Part 5: long text, detailed comprehension, four options. */
export default function ReadingPart5({ ex, onExit }: { ex: ExamExercise; onExit: () => void }) {
  return (
    <ExamShell ex={ex} onExit={onExit}>
      {(ctx) => (
        <div className="space-y-6">
          <Card><HighlightedText text={ex.textOrTranscript} markable={!ctx.submitted} marks={ctx.reviewMarks} /></Card>
          <p className="text-xs text-slate-500">Consejo: toca frases para subrayarlas. Las preguntas siguen el orden del texto.</p>
          {ex.questions.map((q, i) => (
            <QuestionMCQ key={q.id} ex={ex} q={q} number={i + 1} value={ctx.answers[q.id]} onChange={(v) => ctx.setAnswer(q.id, v)} submitted={ctx.submitted} />
          ))}
        </div>
      )}
    </ExamShell>
  );
}
