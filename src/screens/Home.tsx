import { useState } from 'react';
import type { Route } from '../lib/router';
import { daysLeft, dueCardIds, dueMistakes, newCardIds, newLeftToday, streak, todayLog, useProgress, markTask, vocabMastery } from '../lib/store';
import { daysBetween, fmtDate, parseDayKey } from '../lib/date';
import { nextExercise, EXTERNAL_LISTENING, EXTERNAL_QUESTIONS } from '../lib/plan';
import { PART_LABEL } from '../lib/content';
import ScoreDashboard from '../components/ScoreDashboard';
import Settings from './Settings';
import { Card, SectionTitle, Sheet, Button } from '../components/ui';
import { IconGear } from '../components/ui/icons';

function Task({ icon, title, sub, share, done, onClick }: { icon: string; title: string; sub: string; share?: string; done?: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} className="flex w-full items-center gap-3.5 border-b border-slate-100 py-3.5 text-left last:border-0 dark:border-slate-800">
      <span className="grid h-11 w-11 flex-none place-items-center rounded-2xl bg-slate-100 text-xl dark:bg-slate-800">{icon}</span>
      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-2 font-semibold">{title}{share && <span className="rounded-md bg-slate-100 px-1.5 text-[10.5px] font-bold text-slate-500 dark:bg-slate-800">{share}</span>}</span>
        <span className="block truncate text-[13px] text-slate-500">{sub}</span>
      </span>
      <span className={`grid h-7 w-7 flex-none place-items-center rounded-full border-2 text-sm ${done ? 'border-emerald-500 bg-emerald-500 text-white' : 'border-slate-300 dark:border-slate-600'}`}>{done ? '✓' : ''}</span>
    </button>
  );
}

export default function Home({ go }: { go: (r: Route) => void }) {
  const p = useProgress();
  const [settings, setSettings] = useState(false);
  const [external, setExternal] = useState(false);
  const t = todayLog(p);
  const dayIdx = Math.max(0, daysBetween(parseDayKey(p.settings.planStart).getTime(), Date.now()));
  const lEx = nextExercise(p, 'listening', dayIdx);
  const rEx = nextExercise(p, 'reading', dayIdx);
  const due = dueCardIds(p).length;
  const nw = Math.min(newLeftToday(p), newCardIds(p, 999).length);
  const mist = dueMistakes(p).length;
  const productiveToday = dayIdx % 2 === 0 ? 'writing' : 'speaking';

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
        <div className="mt-3 text-sm opacity-95">Prioridad: <b>Listening</b> (161) y <b>Reading</b> (170). Tu Use of English (196) ya es tu colchón.</div>
      </div>

      <ScoreDashboard p={p} />

      <SectionTitle>Plan de hoy · regla 50 / 35 / 15</SectionTitle>
      <Card className="!py-1">
        <Task icon="🎧" share="50%" title={`${PART_LABEL[lEx.part]}`} sub={lEx.title.replace(/^Part \d · /, '')} done={t.done.listening} onClick={() => go({ name: 'exercise', id: lEx.id })} />
        <Task icon="📖" share="35%" title={`${PART_LABEL[rEx.part]}`} sub={`${rEx.title.replace(/^Part \d · /, '')} · ${Math.round(rEx.timeLimitSeconds / 60)} min`} done={t.done.reading} onClick={() => go({ name: 'exercise', id: rEx.id })} />
        <Task icon="🎯" title="Repasar fallos" sub={mist ? `${mist} preguntas en las que caíste en la trampa` : 'Nada pendiente ahora'} done={mist === 0 && Object.keys(p.mistakes).length > 0} onClick={() => go({ name: 'mistakes' })} />
        <Task icon="🧠" title="Vocabulario Destination" sub={`${due} repasos · ${nw} nuevas · dominio ${Math.round(vocabMastery(p) * 100)}%`} done={due === 0 && nw === 0} onClick={() => go({ name: 'study' })} />
        <Task icon={productiveToday === 'writing' ? '✍️' : '🗣️'} share="15%" title={productiveToday === 'writing' ? 'Writing' : 'Speaking'} sub={productiveToday === 'writing' ? 'Una tarea · objetivo subir 180 → 190+' : 'Simulacro breve para no perder fluidez'} done={t.done.writing || t.done.speaking} onClick={() => go({ name: 'productive' })} />
        <Task icon="📻" title="Escucha activa externa" sub="20 min de podcast + 4 preguntas de control" done={t.done.external} onClick={() => setExternal(true)} />
      </Card>

      <Sheet open={settings} onClose={() => setSettings(false)}><Settings onClose={() => setSettings(false)} /></Sheet>
      <Sheet open={external} onClose={() => setExternal(false)}>
        <h2 className="text-xl font-bold">Escucha activa (20 min)</h2>
        <p className="mt-1 text-sm text-slate-500">Escucha sin subtítulos y responde en un papel. Esto entrena la atención al detalle que te falló en el examen.</p>
        <SectionTitle>Elige uno</SectionTitle>
        <Card className="space-y-3">{EXTERNAL_LISTENING.map((x) => <div key={x.name}><b>{x.name}</b><div className="text-sm text-slate-500">{x.why}</div></div>)}</Card>
        <SectionTitle>Preguntas de control</SectionTitle>
        <Card><ol className="list-decimal space-y-2 pl-5 text-[15px]">{EXTERNAL_QUESTIONS.map((q) => <li key={q}>{q}</li>)}</ol></Card>
        <Button className="mt-4" onClick={() => { markTask('external'); setExternal(false); }}>Hecho ✓</Button>
      </Sheet>
    </div>
  );
}
