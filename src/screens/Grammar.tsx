import { useState } from 'react';
import type { Route } from '../lib/router';
import { GRAMMAR, GRAMMAR_UNITS, UNIT_BY_ID } from '../lib/content';
import { currentGrammarUnit, dueCardIds, mastery, newCardIds, newLeftToday, useProgress } from '../lib/store';
import { Button, Card, ProgressBar, SectionTitle, TopBar } from '../components/ui';

/** Grammar tab: the 12 grammar units of Destination with theory and spaced-repetition practice. */
export function GrammarHub({ go }: { go: (r: Route) => void }) {
  const p = useProgress();
  const due = dueCardIds(p, 'grammar').length;
  const nw = Math.min(newLeftToday(p, 'grammar'), newCardIds(p, 'grammar', 999).length);
  const today = currentGrammarUnit(p);
  return (
    <div>
      <TopBar title="Gramática" />
      <Card>
        <div className="text-xs font-bold uppercase tracking-wide text-slate-500">Destination C1 · 12 unidades</div>
        <div className="mt-1 text-3xl font-extrabold">{Math.round(mastery(p, 'grammar') * 100)}% <span className="text-base font-medium text-slate-500">dominado</span></div>
        <ProgressBar value={mastery(p, 'grammar')} className="mt-3" />
        <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">Cada pregunta que falles vuelve más tarde (repetición espaciada), igual que el vocabulario.</p>
        <Button className="mt-4" onClick={() => go({ name: 'study', track: 'grammar' })} disabled={!due && !nw}>{due || nw ? `Practicar · ${due} repasos + ${nw} nuevas` : '✓ Al día'}</Button>
      </Card>
      <SectionTitle>Unidades</SectionTitle>
      <div className="space-y-2.5">
        {GRAMMAR_UNITS.map((u) => {
          const seen = u.cards.filter((id) => p.cards[id]).length;
          const isToday = u.id === today.id;
          return (
            <button key={u.id} onClick={() => go({ name: 'unit', id: u.id })}
              className={`flex w-full items-center gap-4 rounded-3xl p-4 text-left shadow-sm transition active:scale-[.99] ${isToday ? 'bg-emerald-50 ring-2 ring-emerald-400 dark:bg-emerald-950/50' : 'bg-white dark:bg-slate-900'}`}>
              <span className="grid h-11 w-11 flex-none place-items-center rounded-2xl bg-slate-100 font-extrabold dark:bg-slate-800">{u.num}</span>
              <span className="min-w-0 flex-1">
                <span className="block font-bold">{u.name}{isToday && <span className="ml-2 text-xs font-semibold text-emerald-600">· hoy</span>}</span>
                <span className="block truncate text-[13px] text-slate-500">{u.nameEs}</span>
                <ProgressBar value={mastery(p, 'grammar', u.cards)} className="mt-2 !h-1.5" />
              </span>
              <span className="text-xs tabular-nums text-slate-500">{seen}/{u.cards.length}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function GrammarUnit({ id, go, onBack }: { id: string; go: (r: Route) => void; onBack: () => void }) {
  const p = useProgress();
  const u = UNIT_BY_ID[id];
  const th = GRAMMAR[id];
  const [open, setOpen] = useState<number | null>(0);
  if (!u || !th) return null;
  const seen = u.cards.filter((c) => p.cards[c]).length;
  return (
    <div>
      <TopBar title={`Unit ${u.num} · Grammar`} onBack={onBack} />
      <div className="mb-4 px-1">
        <h1 className="text-2xl font-extrabold">{u.name}</h1>
        <p className="mt-1 text-slate-600 dark:text-slate-300">{th.intro}</p>
      </div>
      <div className="space-y-2.5">
        {th.sections.map((s, i) => (
          <div key={s.title} className="overflow-hidden rounded-3xl bg-white shadow-sm dark:bg-slate-900">
            <button onClick={() => setOpen(open === i ? null : i)} className="flex w-full items-center gap-3 p-4 text-left">
              <span className="grid h-7 w-7 flex-none place-items-center rounded-lg bg-emerald-100 text-xs font-bold text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-200">{i + 1}</span>
              <span className="flex-1 font-bold">{s.title}</span>
              <span className="text-slate-400">{open === i ? '▴' : '▾'}</span>
            </button>
            {open === i && (
              <div className="animate-rise px-4 pb-4">
                <p className="text-[15px] leading-relaxed text-slate-700 dark:text-slate-300">{s.explain}</p>
                <ul className="mt-3 space-y-1.5">
                  {s.examples.map((e) => <li key={e} className="rounded-xl bg-slate-50 px-3 py-2 text-[14.5px] italic dark:bg-slate-800">{e}</li>)}
                </ul>
                {s.tip && <div className="mt-3 rounded-xl bg-amber-50 px-3 py-2 text-sm text-amber-900 dark:bg-amber-900/30 dark:text-amber-100">🎯 {s.tip}</div>}
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="sticky bottom-3 mt-6">
        <Button onClick={() => go({ name: 'study', track: 'grammar', unit: u.id })}>{seen < u.cards.length ? `Practicar esta unidad (${u.cards.length - seen} nuevas)` : 'Repasar esta unidad'}</Button>
      </div>
    </div>
  );
}
