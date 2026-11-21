import type { ExamExercise } from '../../types';
import ExamShell from '../exam/ExamShell';
import { Mcq, TextCard } from './shared';

/** Part 6: cross-text multiple matching (compare four writers' opinions). */
export default function ReadingPart6({ ex, onExit }: { ex: ExamExercise; onExit: () => void }) {
  return (
    <ExamShell ex={ex} onExit={onExit} layout="pager"
      tips={['Resume en 3 palabras la postura de cada autor sobre el tema de la pregunta.', '«Shares X\'s view» = misma opinión. «Different view from the others» = el único que discrepa.', 'Mismo tema ≠ misma opinión.']}
      renderText={(ctx) => <TextCard ex={ex} ctx={ctx} />}
      renderQuestion={(q, i, ctx) => <Mcq ex={ex} q={q} i={i} ctx={ctx} />}
    />
  );
}
