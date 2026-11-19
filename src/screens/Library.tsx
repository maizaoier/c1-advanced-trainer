import type { Route } from '../lib/router';
import { CARDS, UNITS, UNIT_BY_ID } from '../lib/content';
import { dueCardIds, newCardIds, newLeftToday, unlockedUnitCount, useProgress, vocabMastery } from '../lib/store';
import { Button, Card, Pill, ProgressBar, SectionTitle, TopBar } from '../components/ui';

const TYPE_ES: Record<string, string> = { w: 'Palabras', pv: 'Phrasal verbs', id: 'Idioms', co: 'Colocaciones', wf: 'Word formation', wx: 'Word formation (Part 3)', g: 'Gramática', kt: 'Transformaciones (Part 4)' };

export function Library({ go }: { go: (r: Route) => void }) {
  const p = useProgress();
  const unlocked = unlockedUnitCount(p);
  const due = dueCardIds(p).length;
  const nw = Math.min(newLeftToday(p), newCardIds(p, 999).length);
  return (
    <div>
      <TopBar title="Vocabulario y gramática" />
      <Card>
        <div className="text-xs font-bold uppercase tracking-wide text-slate-500">Destination C1 · repetición espaciada</div>
        <div className="mt-1 text-3xl font-extrabold">{Math.round(vocabMastery(p) * 100)}% <span className="text-base font-medium text-slate-500">dominado</span></div>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Mantiene tu Use of English (196) y alimenta el vocabulario que aparece en Reading y Listening. Definiciones y ejemplos del libro.</p>
        <Button className="mt-4" onClick={() => go({ name: 'study' })} disabled={!due && !nw}>{due || nw ? `Estudiar · ${due} repasos + ${nw} nuevas` : '✓ Al día'}</Button>
      </Card>
      <SectionTitle>Unidades · se desbloquea una al día</SectionTitle>
      <Card className="!py-1">
        {UNITS.map((u, i) => {
          const seen = u.cards.filter((id) => p.cards[id]).length;
          const locked = i >= unlocked;
          return (
            <button key={u.id} onClick={() => go({ name: 'unit', id: u.id })} className="flex w-full items-center gap-3 border-b border-slate-100 py-3 text-left last:border-0 dark:border-slate-800">
              <Pill tone={u.kind === 'V' ? 'indigo' : 'emerald'}>{u.kind === 'V' ? 'VOC' : 'GRAM'} {u.num}</Pill>
              <span className="min-w-0 flex-1">
                <span className="block truncate font-semibold">{u.name} {locked && '🔒'}</span>
                <ProgressBar value={seen / u.cards.length} className="mt-1.5 !h-1.5" />
              </span>
              <span className="text-xs tabular-nums text-slate-500">{seen}/{u.cards.length}</span>
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
        <Button className="mt-4" onClick={() => go({ name: 'study', unit: u.id })} disabled={!pending}>{pending ? `Estudiar nuevas de esta unidad (${Math.min(20, pending)})` : '✓ Todas vistas'}</Button>
      </Card>
      {u.rules.length > 0 && (<><SectionTitle>Teoría</SectionTitle><Card><ul className="list-disc space-y-2 pl-5 text-[15px]">{u.rules.map((r) => <li key={r}>{r}</li>)}</ul></Card></>)}
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
                  {c.question && <div>{c.sentence1 && <>{c.sentence1} <b>{c.keyword}</b><br /></>}{c.question}{c.base && <b> ({c.base})</b>}</div>}
                  {(c.answers || c.options) && <div className="text-xs text-emerald-700 dark:text-emerald-400">→ {c.answers?.join(' / ') ?? c.options?.[c.correctIndex ?? 0]}</div>}
                </div>
              );
            })}
          </Card>
        </div>
      ))}
    </div>
  );
}
