import type { ExamExercise } from '../../types';
import ExamShell from '../exam/ExamShell';
import { Mcq, TextCard } from './shared';

/** Part 8: multiple matching under time pressure — scan for paraphrases. */
export default function ReadingPart8({ ex, onExit }: { ex: ExamExercise; onExit: () => void }) {
  return (
    <ExamShell ex={ex} onExit={onExit} layout="pager"
      tips={['Lee primero las 10 preguntas y quédate con la idea clave de cada una.', 'Escanea buscando sinónimos, nunca la misma palabra.', 'Si una sección menciona el tema pero dice lo contrario, no es la respuesta.']}
      renderText={(ctx) => <TextCard ex={ex} ctx={ctx} />}
      renderQuestion={(q, i, ctx) => <Mcq ex={ex} q={q} i={i} ctx={ctx} />}
    />
  );
}
