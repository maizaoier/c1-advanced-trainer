import { useEffect, useState } from 'react';
import type { Route } from '../lib/router';
import {
  daysLeft, dueCardIds, examEve, learnedCount, newCardIds, newLeftToday, progressValue, seenCount, streak, todayLog,
  unseenCount, updateProgress, useProgress, newPerDay,
} from '../lib/store';
import { CARD_ORDER } from '../lib/content';
import { addDays, dayKey, fmtDate, parseDayKey, startOfDay } from '../lib/date';
import ProgressRing from '../components/ProgressRing';
import Settings from './Settings';
import { Button, Sheet } from '../components/ui';
import { IconGear } from '../components/ui/icons';

const WEEKDAY = ['D', 'L', 'M', 'X', 'J', 'V', 'S'];

export default function Home({ go }: { go: (r: Route) => void }) {
  const p = useProgress();
  const [settings, setSettings] = useState(false);
  const due = dueCardIds(p).length;
  const nw = Math.min(newLeftToday(p), newCardIds(p, 999).length);
  const t = todayLog(p);
  const value = progressValue(p);
  const today = dayKey();
  const prev = Object.keys(p.progressLog).filter((k) => k < today).sort().at(-1);
  const gain = Math.round((value - (prev ? p.progressLog[prev] : 0)) * 1000) / 10;
  const minutes = Math.max(1, Math.round(due * 0.12 + nw * 0.3));
  const total = CARD_ORDER.length;

  // store today's value once it changes, to show tomorrow how much was gained
  useEffect(() => {
    if (p.progressLog[today] !== value) updateProgress((d) => { d.progressLog[today] = value; });
  }, [value, today, p.progressLog]);

  // reviews due over the next 7 days
  const forecast = Array.from({ length: 7 }, (_, i) => {
    const end = addDays(startOfDay(), i + 1);
    const start = i === 0 ? 0 : addDays(startOfDay(), i);
    return Object.values(p.cards).filter((c) => c.due < end && c.due >= start).length;
  });
  const max = Math.max(1, ...forecast);
  const unseen = unseenCount(p);
  const finish = unseen ? addDays(startOfDay(), Math.ceil(unseen / newPerDay(p))) : null;

  return (
    <div>
      <div className="flex items-center justify-between pb-2" style={{ paddingTop: 'max(16px, env(safe-area-inset-top))' }}>
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">Hola, Oier 👋</h1>
          <div className="text-sm text-slate-500">{fmtDate(new Date())} · 🔥 {streak(p)} {streak(p) === 1 ? 'día' : 'días'} seguidos</div>
        </div>
        <button onClick={() => setSettings(true)} className="grid h-11 w-11 place-items-center rounded-2xl bg-white shadow-sm dark:bg-slate-900" aria-label="Ajustes"><IconGear /></button>
      </div>

      <div className="my-3 rounded-3xl bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-700 p-5 text-white shadow-lg shadow-emerald-900/20">
        <div className="text-sm opacity-90">Cambridge C1 Advanced</div>
        <div className="text-5xl font-extrabold tracking-tight">{daysLeft(p)} días</div>
        <div className="text-sm opacity-90">hasta el {fmtDate(parseDayKey(p.settings.examDate))}</div>
      </div>

      <div className="rounded-3xl bg-white p-5 shadow-sm dark:bg-slate-900">
        <div className="flex items-center gap-4">
          <div className="relative flex-none">
            <ProgressRing value={value} />
            <div className="absolute inset-0 grid place-items-center text-2xl font-extrabold">{Math.round(value * 1000) / 10}%</div>
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-xs font-bold uppercase tracking-wide text-slate-500">Tu vocabulario</div>
            <div className="mt-1 text-[15px] leading-snug text-slate-700 dark:text-slate-300"><b>{seenCount(p)}</b> de {total} estudiadas · <b>{learnedCount(p)}</b> consolidadas</div>
            <div className={`mt-2 inline-block rounded-lg px-2 py-0.5 text-sm font-bold ${gain > 0 ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300' : 'bg-slate-100 text-slate-500 dark:bg-slate-800'}`}>{gain > 0 ? `+${gain}% hoy` : 'Hoy aún +0%'}</div>
          </div>
        </div>
        <Button className="mt-5 !py-4 text-lg" onClick={() => go({ name: 'study' })} disabled={!due && !nw}>
          {due || nw ? <>Estudiar · ≈{minutes} min</> : '✓ Al día. ¡Vuelve mañana!'}
        </Button>
        {(due > 0 || nw > 0) && (
          <div className="mt-3 grid grid-cols-2 gap-2 text-center text-sm">
            <div className="rounded-2xl bg-slate-50 py-2 dark:bg-slate-800"><b className="text-lg">{due}</b><div className="text-xs text-slate-500">repasos</div></div>
            <div className="rounded-2xl bg-slate-50 py-2 dark:bg-slate-800"><b className="text-lg">{nw}</b><div className="text-xs text-slate-500">nuevas</div></div>
          </div>
        )}
      </div>

      <div className="mt-3 grid grid-cols-3 gap-2.5">
        {[{ v: t.cards, l: 'tarjetas hoy' }, { v: t.cards ? `${Math.round((t.correct / Math.max(1, t.correct + t.wrong)) * 100)}%` : '—', l: 'aciertos hoy' }, { v: streak(p), l: 'racha' }].map((x) => (
          <div key={x.l} className="rounded-2xl bg-white p-3 text-center shadow-sm dark:bg-slate-900"><div className="text-xl font-extrabold">{x.v}</div><div className="text-[11px] text-slate-500">{x.l}</div></div>
        ))}
      </div>

      <div className="mt-3 rounded-3xl bg-white p-5 shadow-sm dark:bg-slate-900">
        <div className="text-xs font-bold uppercase tracking-wide text-slate-500">Repasos próximos 7 días</div>
        <div className="mt-3 flex h-24 items-end gap-2">
          {forecast.map((n, i) => (
            <div key={i} className="flex flex-1 flex-col items-center justify-end gap-1 text-[11px] text-slate-500">
              <span>{n}</span>
              <div className="w-full rounded-t-md bg-emerald-500" style={{ height: `${(n / max) * 56}px`, minHeight: 2, opacity: n ? 1 : 0.25 }} />
              <span>{i === 0 ? 'Hoy' : WEEKDAY[new Date(addDays(Date.now(), i)).getDay()]}</span>
            </div>
          ))}
        </div>
        <p className="mt-3 text-[13px] text-slate-500">
          {!finish ? '🎉 Has visto todo el vocabulario: ahora toca consolidarlo con los repasos.'
            : finish <= examEve(p) ? <>Al ritmo de <b>{newPerDay(p)}</b> nuevas al día terminarás todo el vocabulario el <b>{fmtDate(new Date(finish))}</b>.</>
            : <span className="text-amber-700 dark:text-amber-400">⚠️ A <b>{newPerDay(p)}</b> nuevas al día terminarías el <b>{fmtDate(new Date(finish))}</b>, después del examen. Para llegar a tiempo necesitas unas <b>{Math.ceil(unseen / Math.max(1, daysLeft(p) - 1))}</b> al día (Ajustes ⚙️), o céntrate en las palabras y phrasal verbs.</span>}
        </p>
      </div>

      <Sheet open={settings} onClose={() => setSettings(false)}><Settings onClose={() => setSettings(false)} /></Sheet>
    </div>
  );
}
