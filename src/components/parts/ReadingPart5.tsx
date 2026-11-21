import type { ExamExercise } from '../../types';
import ExamShell from '../exam/ExamShell';
import { Mcq, TextCard } from './shared';

/** Part 5: long text, detailed comprehension, four options. */
export default function ReadingPart5({ ex, onExit }: { ex: ExamExercise; onExit: () => void }) {
  return (
    <ExamShell ex={ex} onExit={onExit} layout="pager"
      tips={['Las preguntas siguen el orden del texto.', 'Primero localiza la frase del texto; después elige la opción que la parafrasea.', 'Desconfía de opciones demasiado absolutas (always, only, never) o que mezclan dos ideas.']}
      renderText={(ctx) => <TextCard ex={ex} ctx={ctx} />}
      renderQuestion={(q, i, ctx) => <Mcq ex={ex} q={q} i={i} ctx={ctx} />}
    />
  );
}
