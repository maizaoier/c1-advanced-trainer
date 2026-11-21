import { useState } from 'react';
import type { HomeTask } from '../types';
import type { Route } from '../lib/router';
import {
  currentGrammarUnit, daysLeft, dueCardIds, dueMistakes, markTask, newCardIds, newLeftToday,
  streak, todayLog, useProgress,
} from '../lib/store';
import { fmtDate, parseDayKey } from '../lib/date';
import { nextExercise, podcastOfDay } from '../lib/plan';
import { PART_LABEL } from '../lib/content';
import ScoreDashboard from '../components/ScoreDashboard';
import OverallProgress from '../components/OverallProgress';
import PodcastCard from '../components/PodcastCard';
import Settings from './Settings';
import { Sheet } from '../components/ui';
import { IconGear } from '../components/ui/icons';

interface TaskProps { icon: string; title: string; sub: string; minutes: number; done?: boolean; onClick: () => void; accent?: boolean }
function Task({ icon, title, sub, minutes, done, onClick, accent }: TaskProps) {
  return (
    <button onClick={onClick} className={`flex w-full items-center gap-3.5 rounded-3xl p-4 text-left shadow-sm transition active:scale-[.99] ${done ? 'bg-emerald-50 dark:bg-emerald-950/40' : accent ? 'bg-coral-50 dark:bg-coral-900/30' : 'bg-white dark:bg-slate-900'}`}>
      <span className="grid h-12 w-12 flex-none place-items-center rounded-2xl bg-slate-100 text-2xl dark:bg-slate-800">{icon}</span>
      <span className="min-w-0 flex-1">
        <span className="block font-bold">{title}</span>
        <span className="block truncate text-[13px] text-slate-500">{sub}</span>
      </span>
      {done
        ? <span className="grid h-8 w-8 flex-none place-items-center rounded-full bg-emerald-500 text-white">✓</span>
        : <span className="flex-none rounded-xl bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">{minutes} min</span>}
    </button>
  );
}

export default function Home({ go }: { go: (r: Route) => void }) {
  const p = useProgress();
  const [settings, setSettings] = useState(false);
  const [podcast, setPodcast] = useState(false);
  const t = todayLog(p);
  const on = (k: HomeTask) => p.settings.homeTasks[k];

  const vDue = dueCardIds(p, 'vocab').length;
  const vNew = Math.min(newLeftToday(p, 'vocab'), newCardIds(p, 'vocab', 999).length);
  const gUnit = currentGrammarUnit(p);
  const gDue = dueCardIds(p, 'grammar').length;
  const gNew = Math.min(newLeftToday(p, 'grammar'), newCardIds(p, 'grammar', 999).length);
  const rEx = nextExercise(p, 'reading');
  const lEx = nextExercise(p, 'listening');
  const pod = podcastOfDay(p);
  const mist = dueMistakes(p).length;

  const tasks: (TaskProps & { key: string })[] = [];
  if (on('vocab')) tasks.push({ key: 'vocab', icon: '🧠', title: 'Vocabulario', sub: vDue + vNew ? `${vDue} repasos · ${vNew} nuevas` : 'Al día ✓', minutes: Math.max(1, Math.round(vDue * 0.12 + vNew * 0.3)), done: vDue + vNew === 0 && t.cards > 0, onClick: () => go({ name: 'study', track: 'vocab' }) });
  if (on('grammar')) tasks.push({ key: 'grammar', icon: '📐', title: `Gramática · ${gUnit.name}`, sub: gDue + gNew ? `${gDue} repasos · ${gNew} preguntas nuevas` : 'Al día ✓', minutes: Math.max(1, Math.round((gDue + gNew) * 0.4)), done: gDue + gNew === 0, onClick: () => go({ name: 'study', track: 'grammar' }) });
  if (on('reading')) tasks.push({ key: 'reading', icon: '📖', title: PART_LABEL[rEx.part], sub: rEx.title.replace(/^Part \d · /, ''), minutes: Math.round(rEx.timeLimitSeconds / 60), done: !!t.done.reading, onClick: () => go({ name: 'exercise', id: rEx.id }) });
  if (on('podcast')) tasks.push({ key: 'podcast', icon: '🎧', title: 'Escucha real', sub: pod.name, minutes: Math.min(15, pod.minutes), done: !!t.done.external, onClick: () => setPodcast(true) });
  if (on('listening')) tasks.push({ key: 'listening', icon: '🎙️', title: PART_LABEL[lEx.part], sub: lEx.title.replace(/^Part \d · /, ''), minutes: Math.round(lEx.timeLimitSeconds / 60), done: !!t.done.listening, onClick: () => go({ name: 'exercise', id: lEx.id }) });
  if (on('writing')) tasks.push({ key: 'writing', icon: '✍️', title: 'Writing', sub: 'Una tarea de examen', minutes: 40, done: !!t.done.writing, onClick: () => go({ name: 'productive' }) });
  if (on('speaking')) tasks.push({ key: 'speaking', icon: '🗣️', title: 'Speaking', sub: 'Simulacro breve', minutes: 10, done: !!t.done.speaking, onClick: () => go({ name: 'productive' }) });
  if (mist) tasks.push({ key: 'mistakes', icon: '🎯', title: 'Repasar fallos', sub: `${mist} preguntas en las que caíste en la trampa`, minutes: Math.max(2, Math.round(mist * 0.7)), accent: true, onClick: () => go({ name: 'mistakes' }) });

  const left = tasks.filter((x) => !x.done);
  const total = left.reduce((s, x) => s + x.minutes, 0);

  return (
    <div>
      <div className="flex items-center justify-between pb-2" style={{ paddingTop: 'max(16px, env(safe-area-inset-top))' }}>
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">Hola, Oier 👋</h1>
          <div className="text-sm text-slate-500">{fmtDate(new Date())} · 🔥 {streak(p)} días seguidos</div>
        </div>
        <button onClick={() => setSettings(true)} className="grid h-11 w-11 place-items-center rounded-2xl bg-white shadow-sm dark:bg-slate-900" aria-label="Ajustes"><IconGear /></button>
      </div>

      <div className="my-3 rounded-3xl bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-700 p-5 text-white shadow-lg shadow-emerald-900/20">
        <div className="text-sm opacity-90">Cambridge C1 Advanced</div>
        <div className="text-5xl font-extrabold tracking-tight">{daysLeft(p)} días</div>
        <div className="text-sm opacity-90">hasta el {fmtDate(parseDayKey(p.settings.examDate))}</div>
      </div>

      <OverallProgress p={p} />

      <ScoreDashboard p={p} />

      <div className="mb-2 mt-6 flex items-end justify-between px-1">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Hoy</h2>
        <span className="text-sm font-semibold text-slate-600 dark:text-slate-300">{left.length ? `≈ ${total} min` : '🎉 Todo hecho'}</span>
      </div>
      <div className="space-y-2.5">{tasks.map(({ key, ...x }) => <Task key={key} {...x} />)}</div>
      <button onClick={() => setSettings(true)} className="mt-3 w-full py-2 text-center text-sm font-semibold text-emerald-700 dark:text-emerald-400">Elegir qué tareas aparecen</button>

      <Sheet open={settings} onClose={() => setSettings(false)}><Settings onClose={() => setSettings(false)} /></Sheet>
      <Sheet open={podcast} onClose={() => setPodcast(false)}>
        <h2 className="mb-1 text-xl font-bold">Escucha real de hoy</h2>
        <p className="mb-4 text-sm text-slate-500">Audio de verdad, sin subtítulos. Responde las preguntas de control en un papel o mentalmente.</p>
        <PodcastCard p={pod} done={!!t.done.external} onDone={() => { markTask('external'); setPodcast(false); }} />
        <button onClick={() => { setPodcast(false); go({ name: 'listening' }); }} className="mt-4 w-full py-2 text-sm font-semibold text-emerald-700 dark:text-emerald-400">Ver todas las fuentes de audio →</button>
      </Sheet>
    </div>
  );
}
