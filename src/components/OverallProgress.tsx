import { useEffect, useState } from 'react';
import type { Progress } from '../types';
import { overallProgress } from '../lib/overall';
import { dayKey } from '../lib/date';
import { updateProgress } from '../lib/store';

function Ring({ value }: { value: number }) {
  const r = 42, c = 2 * Math.PI * r;
  return (
    <svg viewBox="0 0 100 100" className="h-28 w-28 -rotate-90">
      <circle cx="50" cy="50" r={r} fill="none" strokeWidth="10" className="stroke-slate-100 dark:stroke-slate-800" />
      <circle cx="50" cy="50" r={r} fill="none" strokeWidth="10" strokeLinecap="round" className="stroke-emerald-500 transition-all duration-700"
        strokeDasharray={c} strokeDashoffset={c * (1 - value)} />
    </svg>
  );
}

/** Single percentage that combines every skill; also stores one value per day to show today's gain. */
export default function OverallProgress({ p }: { p: Progress }) {
  const { total, parts } = overallProgress(p);
  const [open, setOpen] = useState(false);
  const pct = Math.round(total * 1000) / 10;
  const today = dayKey();
  const prevKeys = Object.keys(p.progressLog ?? {}).filter((k) => k < today).sort();
  const yesterday = prevKeys.length ? p.progressLog[prevKeys[prevKeys.length - 1]] : 0;
  const gain = Math.round((total - yesterday) * 1000) / 10;

  useEffect(() => {
    if ((p.progressLog ?? {})[today] !== total) updateProgress((d) => { d.progressLog = { ...(d.progressLog ?? {}), [today]: total }; });
  }, [total, today, p.progressLog]);

  return (
    <div className="mt-3 rounded-3xl bg-white p-5 shadow-sm dark:bg-slate-900">
      <button onClick={() => setOpen((o) => !o)} className="flex w-full items-center gap-4 text-left">
        <div className="relative flex-none">
          <Ring value={total} />
          <div className="absolute inset-0 grid place-items-center text-2xl font-extrabold">{pct}%</div>
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-xs font-bold uppercase tracking-wide text-slate-500">Tu preparación</div>
          <div className="mt-1 text-[15px] leading-snug text-slate-700 dark:text-slate-300">Sube con todo lo que haces: vocabulario, gramática, Reading, Listening, Writing y Speaking.</div>
          <div className={`mt-2 inline-block rounded-lg px-2 py-0.5 text-sm font-bold ${gain > 0 ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300' : 'bg-slate-100 text-slate-500 dark:bg-slate-800'}`}>
            {gain > 0 ? `+${gain}% hoy` : 'Hoy aún +0%'}
          </div>
        </div>
      </button>
      {open ? (
        <div className="mt-4 animate-rise space-y-3">
          {parts.map((c) => (
            <div key={c.id}>
              <div className="flex justify-between text-sm"><span className="font-semibold">{c.icon} {c.label} <span className="font-normal text-slate-400">· {c.weight}%</span></span><span className="tabular-nums text-slate-500">{c.value > 0 && c.value < 0.1 ? (c.value * 100).toFixed(1) : Math.round(c.value * 100)}%</span></div>
              <div className="mt-1 h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800"><div className="h-full rounded-full bg-emerald-500 transition-all duration-700" style={{ width: `${c.value * 100}%` }} /></div>
              <div className="mt-0.5 text-xs text-slate-500">{c.detail}</div>
            </div>
          ))}
          <p className="text-xs text-slate-400">El peso de cada parte sigue tu prioridad: Listening y Reading cuentan más.</p>
        </div>
      ) : (
        <button onClick={() => setOpen(true)} className="mt-3 text-sm font-semibold text-emerald-700 dark:text-emerald-400">Ver desglose ▾</button>
      )}
    </div>
  );
}
