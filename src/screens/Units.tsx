import type { Route } from '../lib/router';
import { CARDS, TYPE_ES, UNITS, UNIT_BY_ID } from '../lib/content';
import { activeIds, isActive, learnedCount, markKnown, newCardIds, progressValue, seenCount, unlockedUnits, useProgress } from '../lib/store';
import { speak } from '../lib/tts';
import { Button, Card, ProgressBar, SectionTitle, TopBar } from '../components/ui';
import { IconSpeaker } from '../components/ui/icons';

/** All Destination vocabulary units with their progress. */
export function Units({ go }: { go: (r: Route) => void }) {
  const p = useProgress();
  const unlocked = unlockedUnits(p);
  return (
    <div>
      <TopBar title="Unidades" />
      <p className="mb-3 px-1 text-sm text-slate-500">Cada día se desbloquea una unidad nueva en tu sesión diaria. Puedes abrir cualquiera para estudiarla cuando quieras.</p>
      <div className="space-y-2.5">
        {UNITS.map((u, i) => {
          const v = progressValue(p, u.cards);
          return (
            <button key={u.id} onClick={() => go({ name: 'unit', id: u.id })} className="flex w-full items-center gap-4 rounded-3xl bg-white p-4 text-left shadow-sm transition active:scale-[.99] dark:bg-slate-900">
              <span className="grid h-11 w-11 flex-none place-items-center rounded-2xl bg-slate-100 font-extrabold dark:bg-slate-800">{u.num}</span>
              <span className="min-w-0 flex-1">
                <span className="block truncate font-bold">{u.name} {i >= unlocked && <span className="text-sm">🔒</span>}</span>
                <span className="block truncate text-[13px] text-slate-500">{u.nameEs} · {seenCount(p, u.cards)}/{activeIds(p, u.cards).length}</span>
                <ProgressBar value={v} className="mt-2 !h-1.5" />
              </span>
              <span className="text-sm font-bold tabular-nums text-slate-500">{Math.round(v * 100)}%</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function UnitView({ id, go, onBack }: { id: string; go: (r: Route) => void; onBack: () => void }) {
  const p = useProgress();
  const u = UNIT_BY_ID[id];
  if (!u) return null;
  const pending = newCardIds(p, 999, id).length;
  const byType = u.cards.reduce<Record<string, string[]>>((acc, c) => { (acc[CARDS[c].type] ??= []).push(c); return acc; }, {});
  return (
    <div>
      <TopBar title={`Unit ${u.num}`} onBack={onBack} />
      <Card>
        <div className="text-2xl font-extrabold">{u.name}</div>
        <div className="text-slate-500">{u.nameEs}</div>
        <div className="mt-3 text-sm text-slate-600 dark:text-slate-300">{seenCount(p, u.cards)}/{activeIds(p, u.cards).length} estudiadas · {learnedCount(p, u.cards)} consolidadas</div>
        <ProgressBar value={progressValue(p, u.cards)} className="mt-2" />
        <div className="mt-2 text-[11px] text-slate-400">● gris = nueva · ● ámbar = aprendiendo · ● verde = consolidada · atenuadas = no se estudian</div>
        <Button className="mt-4" onClick={() => go({ name: 'study', unit: u.id })}>{pending ? `Estudiar esta unidad (${Math.min(20, pending)} nuevas)` : 'Repasar esta unidad'}</Button>
      </Card>
      {Object.entries(byType).map(([t, ids]) => (
        <div key={t}>
          <SectionTitle>{TYPE_ES[t]} · {ids.length}</SectionTitle>
          <Card className="!py-1">
            {ids.map((cid) => {
              const c = CARDS[cid];
              const st = p.cards[cid];
              const active = isActive(p, cid);
              return (
                <div key={cid} className={`flex items-start gap-2 border-b border-slate-100 py-2.5 text-[14.5px] last:border-0 dark:border-slate-800 ${active ? '' : 'opacity-45'}`}>
                  <span className={`mt-1.5 h-2 w-2 flex-none rounded-full ${!st ? 'bg-slate-200 dark:bg-slate-700' : st.interval >= 10 ? 'bg-emerald-500' : 'bg-amber-400'}`} title={!st ? 'nueva' : st.interval >= 10 ? 'consolidada' : 'aprendiendo'} />
                  <div className="min-w-0 flex-1">
                    {c.term && <b>{c.term} </b>}{c.pos && <span className="text-xs text-slate-500">{c.pos} </span>}
                    {c.definition && <div className="text-slate-600 dark:text-slate-300">{c.definition}</div>}
                    {c.es && <div className="text-xs text-slate-500">🇪🇸 {c.es}</div>}
                    {c.items && <div className="text-slate-600 dark:text-slate-300">{c.items.join(', ')}</div>}
                    {c.question && <div>{c.question}{c.base && <b> ({c.base})</b>}</div>}
                    {c.answers && <div className="text-xs text-emerald-700 dark:text-emerald-400">→ {c.answers.join(' / ')}</div>}
                    {p.known[cid] && <button onClick={() => markKnown(cid, false)} className="mt-1 text-xs font-semibold text-emerald-700 dark:text-emerald-400">✓ Ya la sé · recuperar</button>}
                    {!p.known[cid] && !active && <div className="mt-0.5 text-[11px] text-slate-400">fuera de la selección esencial</div>}
                  </div>
                  {c.term && (t === 'w' || t === 'pv' || t === 'id') && <button onClick={() => speak(c.term!)} className="grid h-8 w-8 flex-none place-items-center rounded-full bg-slate-100 dark:bg-slate-800" aria-label="Escuchar"><IconSpeaker width={16} /></button>}
                </div>
              );
            })}
          </Card>
        </div>
      ))}
    </div>
  );
}
