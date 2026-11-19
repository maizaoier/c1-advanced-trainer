import type { ExamExercise } from '../../types';
import ExamShell from '../exam/ExamShell';
import AudioPlayer from '../exam/AudioPlayer';
import QuestionMCQ from '../exam/QuestionMCQ';
import { OptionList, Transcript } from './shared';

/** Part 4: five speakers, two simultaneous matching tasks (A-H each). */
export default function ListeningPart4({ ex, onExit }: { ex: ExamExercise; onExit: () => void }) {
  const opts = ex.sharedOptions ?? [];
  const tasks = [
    { name: 'Task 1', title: 'Task 1 · ¿Por qué decidió correr?', options: opts.slice(0, 8) },
    { name: 'Task 2', title: 'Task 2 · ¿Qué le sorprendió más?', options: opts.slice(8, 16) },
  ];
  return (
    <ExamShell ex={ex} onExit={onExit}>
      {(ctx) => (
        <div className="space-y-6">
          <AudioPlayer script={ex.script ?? []} locked={ctx.submitted} />
          <div className="rounded-2xl bg-slate-100 p-3 text-sm text-slate-600 dark:bg-slate-800 dark:text-slate-300">
            Estrategia: en la 1.ª escucha céntrate en la Task 1, en la 2.ª en la Task 2. Cuidado: cada hablante menciona ideas de varias opciones; solo una es la respuesta.
          </div>
          {tasks.map((t) => (
            <div key={t.name} className="space-y-4">
              <OptionList title={t.title} options={t.options} />
              {ex.questions.filter((q) => q.group === t.name).map((q) => (
                <QuestionMCQ key={q.id} compact ex={ex} q={q} number={ex.questions.indexOf(q) + 1} value={ctx.answers[q.id]} onChange={(v) => ctx.setAnswer(q.id, v)} submitted={ctx.submitted} />
              ))}
            </div>
          ))}
          <Transcript ex={ex} ctx={ctx} />
        </div>
      )}
    </ExamShell>
  );
}
