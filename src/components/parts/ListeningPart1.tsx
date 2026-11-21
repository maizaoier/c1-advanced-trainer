import type { ExamExercise } from '../../types';
import ExamShell from '../exam/ExamShell';
import AudioPlayer from '../exam/AudioPlayer';
import { Mcq, TranscriptCard } from './shared';

/** Part 1: three short extracts, two questions each (A-C). */
export default function ListeningPart1({ ex, onExit }: { ex: ExamExercise; onExit: () => void }) {
  return (
    <ExamShell ex={ex} onExit={onExit} layout="list"
      tips={['Lee las 6 preguntas antes de escuchar y subraya: ¿opinión, acuerdo, propósito?', 'Espera al final de cada intervención: los hablantes rectifican («Actually…», «Mind you…»).', 'Si la opción menciona algo que se dice, comprueba QUIÉN lo dice y si lo descarta.']}
      renderText={(ctx) => <AudioPlayer script={ex.script ?? []} locked={ctx.submitted} />}
      renderAfter={(ctx) => <TranscriptCard ex={ex} ctx={ctx} />}
      renderQuestion={(q, i, ctx) => (
        <>
          {(i === 0 || ex.questions[i - 1].group !== q.group) && <div className="mb-3 text-xs font-bold uppercase tracking-wide text-emerald-700 dark:text-emerald-400">{q.group}</div>}
          <Mcq ex={ex} q={q} i={i} ctx={ctx} />
        </>
      )}
    />
  );
}
