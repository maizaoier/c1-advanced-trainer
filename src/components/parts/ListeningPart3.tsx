import type { ExamExercise } from '../../types';
import ExamShell from '../exam/ExamShell';
import AudioPlayer from '../exam/AudioPlayer';
import QuestionMCQ from '../exam/QuestionMCQ';
import { Transcript } from './shared';

/** Part 3: long interview, four-option multiple choice. */
export default function ListeningPart3({ ex, onExit }: { ex: ExamExercise; onExit: () => void }) {
  return (
    <ExamShell ex={ex} onExit={onExit}>
      {(ctx) => (
        <div className="space-y-6">
          <AudioPlayer script={ex.script ?? []} locked={ctx.submitted} />
          {ex.questions.map((q, i) => (
            <QuestionMCQ key={q.id} ex={ex} q={q} number={i + 1} value={ctx.answers[q.id]} onChange={(v) => ctx.setAnswer(q.id, v)} submitted={ctx.submitted} />
          ))}
          <Transcript ex={ex} ctx={ctx} />
        </div>
      )}
    </ExamShell>
  );
}
