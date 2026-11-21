import type { ExamExercise } from '../../types';
import ExamShell from '../exam/ExamShell';
import AudioPlayer from '../exam/AudioPlayer';
import { Mcq, OptionList, TranscriptCard } from './shared';

/** Part 4: five speakers, two simultaneous matching tasks (A-H each). */
export default function ListeningPart4({ ex, onExit }: { ex: ExamExercise; onExit: () => void }) {
  const opts = ex.sharedOptions ?? [];
  return (
    <ExamShell ex={ex} onExit={onExit} layout="list"
      tips={['1.ª escucha: céntrate en la Task 1. 2.ª escucha: en la Task 2.', 'Cada hablante menciona ideas de varias opciones; solo una responde exactamente a la pregunta.']}
      renderText={(ctx) => <AudioPlayer script={ex.script ?? []} locked={ctx.submitted} />}
      renderAfter={(ctx) => <TranscriptCard ex={ex} ctx={ctx} />}
      renderQuestion={(q, i, ctx) => (
        <>
          {i === 0 && <div className="mb-4"><OptionList title="Task 1 · ¿Por qué decidió correr?" options={opts.slice(0, 8)} /></div>}
          {i === 5 && <div className="mb-4"><OptionList title="Task 2 · ¿Qué le sorprendió más?" options={opts.slice(8, 16)} /></div>}
          <Mcq ex={ex} q={q} i={i} ctx={ctx} compact />
        </>
      )}
    />
  );
}
