import type { ExamExercise } from '../../types';
import ExamShell from '../exam/ExamShell';
import AudioPlayer from '../exam/AudioPlayer';
import { Mcq, TranscriptCard } from './shared';

/** Part 3: long interview, four-option multiple choice. */
export default function ListeningPart3({ ex, onExit }: { ex: ExamExercise; onExit: () => void }) {
  return (
    <ExamShell ex={ex} onExit={onExit} layout="list"
      tips={['Las preguntas siguen el orden de la entrevista: una por cada respuesta del invitado.', 'Las opciones falsas suelen ser ideas que el entrevistado menciona para rechazarlas.', 'Atención a la entrevistadora: lo que ELLA sugiere no es la opinión del invitado.']}
      renderText={(ctx) => <AudioPlayer script={ex.script ?? []} locked={ctx.submitted} />}
      renderAfter={(ctx) => <TranscriptCard ex={ex} ctx={ctx} />}
      renderQuestion={(q, i, ctx) => <Mcq ex={ex} q={q} i={i} ctx={ctx} />}
    />
  );
}
