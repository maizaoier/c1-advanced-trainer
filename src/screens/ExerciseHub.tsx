import type { Route } from '../lib/router';
import { PART_HINT, PART_LABEL, PODCASTS } from '../lib/content';
import { markTask, todayLog, useProgress } from '../lib/store';
import { exercisesOf, nextExercise, partAccuracy, podcastOfDay } from '../lib/plan';
import { estimate } from '../lib/scoring';
import PodcastCard, { PodcastLinks } from '../components/PodcastCard';
import { Button, SectionTitle, TopBar } from '../components/ui';

const PARTS = { listening: ['L1', 'L2', 'L3', 'L4'], reading: ['R5', 'R6', 'R7', 'R8'] } as const;

function PartRow({ skill, part, go }: { skill: 'listening' | 'reading'; part: string; go: (r: Route) => void }) {
  const p = useProgress();
  const list = exercisesOf(skill, part);
  const acc = partAccuracy(p, part);
  const next = nextExercise(p, skill, part);
  return (
    <button onClick={() => go({ name: 'exercise', id: next.id })} className="flex w-full items-center gap-4 rounded-3xl bg-white p-4 text-left shadow-sm transition active:scale-[.99] dark:bg-slate-900">
      <span className="grid h-12 w-12 flex-none place-items-center rounded-2xl bg-slate-900 text-lg font-extrabold text-white dark:bg-white dark:text-slate-900">{part.slice(1)}</span>
      <span className="min-w-0 flex-1">
        <span className="block font-bold">{PART_LABEL[part].replace(/^(Listening|Reading) /, '')}</span>
        <span className="block truncate text-[13px] text-slate-500">{PART_HINT[part]}</span>
        <span className="mt-1.5 flex gap-1">
          {list.map((e) => {
            const last = p.attempts.filter((a) => a.exerciseId === e.id).at(-1);
            const c = !last ? 'bg-slate-200 dark:bg-slate-700' : last.correct / last.total >= 0.6 ? 'bg-emerald-500' : 'bg-coral-400';
            return <span key={e.id} className={`h-1.5 w-6 rounded-full ${c}`} />;
          })}
        </span>
      </span>
      <span className={`flex-none text-sm font-bold ${acc === null ? 'text-slate-400' : acc >= 0.6 ? 'text-emerald-600' : 'text-coral-500'}`}>{acc === null ? 'Nuevo' : `${Math.round(acc * 100)}%`}</span>
    </button>
  );
}

function Header({ skill }: { skill: 'listening' | 'reading' }) {
  const p = useProgress();
  const est = estimate(skill, p.attempts);
  return (
    <div className="mb-2 flex items-end justify-between px-1">
      <div className="text-sm text-slate-500">{skill === 'listening' ? 'Tu punto más débil' : 'Prioridad alta'}</div>
      <div className="text-right">
        <span className="text-sm text-slate-500">{est.baseline} → </span>
        <span className={`text-2xl font-extrabold ${est.estimate >= 180 ? 'text-emerald-600' : 'text-coral-500'}`}>{est.estimate}</span>
      </div>
    </div>
  );
}

export function ListeningHub({ go }: { go: (r: Route) => void }) {
  const p = useProgress();
  const today = podcastOfDay(p);
  return (
    <div>
      <TopBar title="Listening" />
      <Header skill="listening" />
      <SectionTitle>Escucha real de hoy</SectionTitle>
      <PodcastCard p={today} done={!!todayLog(p).done.external} onDone={() => markTask('external')} />

      <SectionTitle>Más audio real</SectionTitle>
      <div className="space-y-2.5">
        {PODCASTS.filter((x) => x.id !== today.id).map((x) => (
          <div key={x.id} className="rounded-3xl bg-white p-4 shadow-sm dark:bg-slate-900">
            <div className="flex items-center justify-between gap-2">
              <div className="min-w-0"><div className="truncate font-bold">{x.name}</div><div className="text-xs text-slate-500">{x.kind} · {x.parts} · ~{x.minutes} min</div></div>
            </div>
            <div className="mt-3"><PodcastLinks p={x} small /></div>
          </div>
        ))}
      </div>

      <SectionTitle>Práctica tipo examen</SectionTitle>
      <p className="mb-3 px-1 text-[13px] text-slate-500">Con corrección y detector de trampas. La voz es sintética: en Ajustes puedes elegir la más natural de tu móvil.</p>
      <div className="space-y-2.5">{PARTS.listening.map((part) => <PartRow key={part} skill="listening" part={part} go={go} />)}</div>
    </div>
  );
}

export function ReadingHub({ go }: { go: (r: Route) => void }) {
  const p = useProgress();
  const next = nextExercise(p, 'reading');
  return (
    <div>
      <TopBar title="Reading" />
      <Header skill="reading" />
      <div className="rounded-3xl bg-slate-900 p-5 text-white dark:bg-white dark:text-slate-900">
        <div className="text-xs font-bold uppercase tracking-wide opacity-70">Siguiente recomendado</div>
        <div className="mt-1 text-xl font-bold leading-snug">{next.title.replace(/^Part \d · /, '')}</div>
        <div className="mt-1 text-sm opacity-70">{PART_LABEL[next.part]} · {Math.round(next.timeLimitSeconds / 60)} min</div>
        <Button className="mt-4" onClick={() => go({ name: 'exercise', id: next.id })}>Empezar</Button>
      </div>
      <SectionTitle>Partes del examen</SectionTitle>
      <div className="space-y-2.5">{PARTS.reading.map((part) => <PartRow key={part} skill="reading" part={part} go={go} />)}</div>
    </div>
  );
}
