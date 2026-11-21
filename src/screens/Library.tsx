import type { Route } from '../lib/router';
import { CARDS, UNIT_BY_ID, VOCAB_UNITS } from '../lib/content';
import { dueCardIds, mastery, newCardIds, newLeftToday, unlockedVocabUnits, useProgress } from '../lib/store';
import { Button, Card, Pill, ProgressBar, SectionTitle, TopBar } from '../components/ui';

const TYPE_ES: Record<string, string> = { w: 'Palabras', pv: 'Phrasal verbs', id: 'Idioms', co: 'Colocaciones', wf: 'Word formation', wx: 'Word formation (Part 3)', g: 'Gramática', kt: 'Transformaciones (Part 4)' };

/** Vocabulary tab: Destination topic units with progress. */
export function Library({ go }: { go: (r: Route) => void }) {
  const p = useProgress();
  const unlocked = unlockedVocabUnits(p);
  const due = dueCardIds(p, 'vocab').length;
  const nw = Math.min(newLeftToday(p, 'vocab'), newCardIds(p, 'vocab', 999).length);
  return (
    <div>
      <TopBar title="Vocabulario" />
      <Card>
        <div className="text-xs font-bold uppercase tracking-wide text-slate-500">Destination C1 · repetición espaciada</div>
        <div className="mt-1 text-3xl font-extrabold">{Math.round(mastery(p, 'vocab') * 100)}% <span className="text-base font-medium text-slate-500">dominado</span></div>
        <ProgressBar value={mastery(p, 'vocab')} className="mt-3" />
        <Button className="mt-4" onClick={() => go({ name: 'study', track: 'vocab' })} disabled={!due && !nw}>{due || nw ? `Estudiar · ${due} repasos + ${nw} nuevas` : '✓ Al día'}</Button>
      </Card>
      <SectionTitle>Unidades · se desbloquea una al día</SectionTitle>
      <Card className="!py-1">
        {VOCAB_UNITS.map((u, i) => {
          const seen = u.cards.filter((id) => p.cards[id]).length;
          const locked = i >= unlocked;
          return (
            <button key={u.id} onClick={() => go({ name: 'unit', id: u.id })} className="flex w-full items-center gap-3 border-b border-slate-100 py-3 text-left last:border-0 dark:border-slate-800">
              <Pill tone="indigo">{u.num}</Pill>
              <span className="min-w-0 flex-1">
                <span className="block truncate font-semibold">{u.name} {locked && '🔒'}</span>
                <ProgressBar value={seen / u.cards.length} className="mt-1.5 !h-1.5" />
              </span>
              <span className="text-xs tabular-nums text-slate-500">{Math.round((seen / u.cards.length) * 100)}%</span>
            </button>
          );
        })}
      </Card>
    </div>
  );
}

export function UnitView({ id, go, onBack }: { id: string; go: (r: Route) => void; onBack: () => void }) {
  const p = useProgress();
  const u = UNIT_BY_ID[id];
  if (!u) return null;
  const pending = u.cards.filter((c) => !p.cards[c]).length;
  const byType = u.cards.reduce<Record<string, string[]>>((acc, c) => { (acc[CARDS[c].type] ??= []).push(c); return acc; }, {});
  return (
    <div>
      <TopBar title={`Unit ${u.num}`} onBack={onBack} />
      <Card>
        <div className="text-2xl font-extrabold">{u.name}</div>
        <div className="text-slate-500">{u.nameEs}</div>
        <Button className="mt-4" onClick={() => go({ name: 'study', track: 'vocab', unit: u.id })}>{pending ? `Estudiar esta unidad (${Math.min(20, pending)} nuevas)` : 'Repasar esta unidad'}</Button>
      </Card>
      {Object.entries(byType).map(([t, ids]) => (
        <div key={t}>
          <SectionTitle>{TYPE_ES[t]} · {ids.length}</SectionTitle>
          <Card className="!py-1">
            {ids.map((cid) => {
              const c = CARDS[cid];
              return (
                <div key={cid} className="border-b border-slate-100 py-2.5 text-[14.5px] last:border-0 dark:border-slate-800">
                  {c.term && <b>{c.term} </b>}{c.pos && <span className="text-xs text-slate-500">{c.pos} </span>}
                  {c.definition && <div className="text-slate-600 dark:text-slate-300">{c.definition}</div>}
                  {c.items && <div className="text-slate-600 dark:text-slate-300">{c.items.join(', ')}</div>}
                  {c.question && <div>{c.question}{c.base && <b> ({c.base})</b>}</div>}
                  {c.answers && <div className="text-xs text-emerald-700 dark:text-emerald-400">→ {c.answers.join(' / ')}</div>}
                </div>
              );
            })}
          </Card>
        </div>
      ))}
    </div>
  );
}
