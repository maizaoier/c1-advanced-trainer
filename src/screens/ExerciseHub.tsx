import type { Route } from '../lib/router';
import { EXERCISES, PART_HINT, PART_LABEL } from '../lib/content';
import { useProgress } from '../lib/store';
import { partAccuracy } from '../lib/plan';
import { estimate } from '../lib/scoring';
import { Card, Pill, SectionTitle, TopBar } from '../components/ui';

/** Hub for Listening (Parts 1-4) or Reading (Parts 5-8). */
export default function ExerciseHub({ skill, go }: { skill: 'listening' | 'reading'; go: (r: Route) => void }) {
  const p = useProgress();
  const list = EXERCISES.filter((e) => e.skill === skill);
  const parts = [...new Set(list.map((e) => e.part))];
  const est = estimate(skill, p.attempts);
  return (
    <div>
      <TopBar title={skill === 'listening' ? 'Listening' : 'Reading'} />
      <Card className={skill === 'listening' ? 'border-coral-200 dark:border-coral-900' : ''}>
        <div className="flex items-end justify-between">
          <div>
            <div className="text-xs font-bold uppercase tracking-wide text-slate-500">{skill === 'listening' ? 'Prioridad crítica · 50% del tiempo' : 'Prioridad alta · 35% del tiempo'}</div>
            <div className="text-3xl font-extrabold">{est.baseline} → <span className={est.estimate >= 180 ? 'text-emerald-600' : 'text-coral-500'}>{est.estimate}</span></div>
          </div>
          <Pill tone={est.estimate >= 180 ? 'emerald' : 'coral'}>{est.samples} respuestas</Pill>
        </div>
        <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
          {skill === 'listening'
            ? 'Tu trampa típica: entender el sentido general y elegir la opción que repite palabras del audio. Espera siempre al final de la idea: los hablantes rectifican («Actually…», «Mind you…»).'
            : 'Antes de mirar la solución, localiza la frase exacta que la justifica. Si una opción usa las mismas palabras que el texto, sospecha.'}
        </p>
      </Card>
      {parts.map((part) => {
        const acc = partAccuracy(p, part);
        return (
          <div key={part}>
            <SectionTitle>{PART_LABEL[part]} · {PART_HINT[part]}{acc !== null && ` · ${Math.round(acc * 100)}%`}</SectionTitle>
            <div className="space-y-3">
              {list.filter((e) => e.part === part).map((e) => {
                const tries = p.attempts.filter((a) => a.exerciseId === e.id);
                const last = tries[tries.length - 1];
                return (
                  <Card key={e.id} onClick={() => go({ name: 'exercise', id: e.id })}>
                    <div className="flex items-center gap-3">
                      <div className="min-w-0 flex-1">
                        <div className="font-semibold leading-snug">{e.title.replace(/^Part \d · /, '')}</div>
                        <div className="mt-0.5 text-[13px] text-slate-500">{e.questions.length} preguntas · {Math.round(e.timeLimitSeconds / 60)} min</div>
                      </div>
                      {last ? <Pill tone={last.correct / last.total >= 0.6 ? 'emerald' : 'coral'}>{last.correct}/{last.total}</Pill> : <Pill tone="indigo">Nuevo</Pill>}
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
