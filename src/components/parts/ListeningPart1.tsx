import type { ExamExercise } from '../../types';
import ExamShell from '../exam/ExamShell';
import AudioPlayer from '../exam/AudioPlayer';
import QuestionMCQ from '../exam/QuestionMCQ';
import { Transcript } from './shared';

/** Part 1: three short extracts, two questions each (A-C). */
export default function ListeningPart1({ ex, onExit }: { ex: ExamExercise; onExit: () => void }) {
  const groups = [...new Set(ex.questions.map((q) => q.group ?? ''))];
  return (
    <ExamShell ex={ex} onExit={onExit}>
      {(ctx) => (
        <div className="space-y-6">
          <AudioPlayer script={ex.script ?? []} locked={ctx.submitted} />
          {groups.map((g) => (
            <div key={g} className="space-y-5">
              <div className="text-xs font-bold uppercase tracking-wide text-emerald-700 dark:text-emerald-400">{g}</div>
              {ex.questions.filter((q) => q.group === g).map((q) => (
                <QuestionMCQ key={q.id} ex={ex} q={q} number={ex.questions.indexOf(q) + 1} value={ctx.answers[q.id]} onChange={(v) => ctx.setAnswer(q.id, v)} submitted={ctx.submitted} />
              ))}
            </div>
          ))}
          <Transcript ex={ex} ctx={ctx} />
        </div>
      )}
    </ExamShell>
  );
}
