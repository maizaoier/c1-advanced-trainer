import { useRef, useState } from 'react';
import type { StudyCard } from '../types';
import { CARDS, TYPE_LABEL, UNIT_BY_ID } from '../lib/content';
import { dueCardIds, examEve, getProgress, gradeCard, markKnown, newCardIds, newLeftToday, useProgress } from '../lib/store';
import { intervalLabel, type Grade } from '../lib/srs';
import { answerMatches, norm, shuffle } from '../lib/text';
import { speak, ttsAvailable } from '../lib/tts';
import { Button, Card, ProgressBar, TopBar, toast } from '../components/ui';
import { IconSpeaker } from '../components/ui/icons';

type Mode = 'flash' | 'type' | 'cloze';
/** Phrasal verbs become fill-in-the-gap once seen; Part 3 word formation is always typed. */
function modeOf(c: StudyCard, seen: boolean): Mode {
  if (c.type === 'wx') return 'type';
  if (c.type === 'pv' && seen && /\[/.test(c.example ?? '')) return 'cloze';
  return 'flash';
}
const fmtEx = (s: string) => s.split(/(\[.*?\])/).map((t, i) => (t.startsWith('[') ? <b key={i}>{t.slice(1, -1)}</b> : <span key={i}>{t}</span>));

function buildQueue(unit?: string): string[] {
  const p = getProgress();
  if (unit) {
    // a single unit: what is new or due; if everything is up to date, a review of the unit
    const q = [...dueCardIds(p, unit), ...newCardIds(p, 20, unit)];
    return q.length ? q : shuffle(UNIT_BY_ID[unit]?.cards ?? []).slice(0, 20);
  }
  const due = dueCardIds(p).slice(0, 80);
  const fresh = newCardIds(p, newLeftToday(p));
  // two reviews, then one new card
  const out: string[] = [];
  while (due.length || fresh.length) { if (due.length) out.push(due.shift()!); if (due.length) out.push(due.shift()!); if (fresh.length) out.push(fresh.shift()!); }
  return out;
}

function SpeakButton({ text }: { text: string }) {
  if (!ttsAvailable()) return null;
  return (
    <button onClick={(e) => { e.stopPropagation(); speak(text); }} className="inline-grid h-9 w-9 place-items-center rounded-full bg-slate-100 align-middle transition active:scale-90 dark:bg-slate-800" aria-label="Escuchar">
      <IconSpeaker width={18} />
    </button>
  );
}

export default function Study({ unit, onExit }: { unit?: string; onExit: () => void }) {
  const p = useProgress();
  const [queue, setQueue] = useState<string[]>(() => buildQueue(unit));
  const [total] = useState(queue.length);
  const [done, setDone] = useState(0);
  const [stats, setStats] = useState({ ok: 0, again: 0 });
  const [revealed, setRevealed] = useState(false);
  const [typed, setTyped] = useState<string[]>([]);
  const [result, setResult] = useState<boolean | undefined>();
  const lock = useRef(false);

  const id = queue[0];
  const c = id ? CARDS[id] : undefined;
  if (!c) {
    return (
      <div>
        <TopBar title="Vocabulario" onBack={onExit} />
        <div className="mt-16 animate-pop text-center">
          <div className="text-6xl">🎉</div>
          <h2 className="mt-3 text-2xl font-extrabold">{total ? '¡Sesión completada!' : 'No hay tarjetas pendientes'}</h2>
          {total > 0 && (
            <div className="mx-auto mt-6 grid max-w-xs grid-cols-3 gap-2 text-center">
              <div className="rounded-2xl bg-white p-3 shadow-sm dark:bg-slate-900"><b className="text-xl">{total}</b><div className="text-[11px] text-slate-500">tarjetas</div></div>
              <div className="rounded-2xl bg-white p-3 shadow-sm dark:bg-slate-900"><b className="text-xl text-emerald-600">{stats.ok}</b><div className="text-[11px] text-slate-500">bien</div></div>
              <div className="rounded-2xl bg-white p-3 shadow-sm dark:bg-slate-900"><b className="text-xl text-coral-500">{stats.again}</b><div className="text-[11px] text-slate-500">a repasar</div></div>
            </div>
          )}
          <p className="mt-4 text-slate-500">{total ? 'Las que te han costado volverán antes. ¡Hasta mañana!' : 'Vuelve mañana o estudia una unidad concreta.'}</p>
          <Button className="mx-auto mt-6 max-w-xs" variant="secondary" onClick={onExit}>Volver</Button>
        </div>
      </div>
    );
  }
  const st = p.cards[c.id];
  const mode = modeOf(c, !!st && st.reps > 0);
  const eve = examEve(p);
  const unitInfo = UNIT_BY_ID[c.unit];

  const finish = (g: Grade) => {
    if (lock.current) return; // double-tap guard
    lock.current = true;
    gradeCard(c.id, g);
    setStats((s) => ({ ok: s.ok + (g >= 2 ? 1 : 0), again: s.again + (g === 0 ? 1 : 0) }));
    setQueue((q) => { const rest = q.slice(1); if (g === 0) rest.splice(Math.min(rest.length, 3 + Math.floor(Math.random() * 3)), 0, c.id); return rest; });
    if (g !== 0) setDone((n) => n + 1);
    setRevealed(false); setTyped([]); setResult(undefined);
    window.scrollTo({ top: 0 });
    setTimeout(() => { lock.current = false; }, 150);
  };

  /** New card the user already knows: removed for good (can be restored from the unit page). */
  const skipKnown = () => {
    if (lock.current) return;
    lock.current = true;
    markKnown(c.id);
    setQueue((q) => q.slice(1));
    setDone((n) => n + 1);
    setRevealed(false); setTyped([]); setResult(undefined);
    toast('Quitada. Puedes recuperarla desde su unidad.');
    setTimeout(() => { lock.current = false; }, 150);
  };
  const knownButton = !st && (
    <button onClick={skipKnown} className="mt-2 w-full py-2 text-sm font-semibold text-slate-500">Ya me la sé · quitar</button>
  );

  const clozeParts = (c.example ?? '').match(/\[(.*?)\]/g)?.map((x) => x.slice(1, -1)) ?? [];
  const check = () => {
    if (mode === 'type') setResult(answerMatches(typed[0] ?? '', c.answers ?? []));
    else setResult(clozeParts.every((p0, i) => norm(p0) === norm(typed[i] ?? '')));
  };
  const reveal = () => { setRevealed(true); if ((c.type === 'w' || c.type === 'id' || c.type === 'pv') && c.term) speak(c.term); };

  const grades = (
    <div className="grid grid-cols-4 gap-2">
      {([['Otra vez', 0, 'text-coral-500'], ['Difícil', 1, 'text-amber-600'], ['Bien', 2, 'text-emerald-600'], ['Fácil', 3, 'text-indigo-500']] as const).map(([l, g, cls]) => (
        <button key={g} onClick={() => finish(g)} className="rounded-2xl bg-white py-3.5 font-semibold shadow-sm transition active:scale-95 dark:bg-slate-900">
          <span className={cls}>{l}</span><span className="block text-[11px] font-normal text-slate-500">{intervalLabel(st, g, eve)}</span>
        </button>
      ))}
    </div>
  );

  return (
    <div>
      <TopBar onClose={onExit} title={<ProgressBar value={total ? done / total : 0} />} right={<span className="text-sm tabular-nums text-slate-500">{done}/{total}</span>} />
      <div className="mb-2 text-center text-xs text-slate-500">Unit {unitInfo?.num} · {unitInfo?.name}{!st && <b className="ml-1 text-emerald-600">· NUEVA</b>}</div>

      {mode === 'flash' && (
        <>
          <Card key={c.id} className="min-h-[320px] animate-pop text-center" onClick={revealed ? undefined : reveal}>
            <div className="text-xs font-bold uppercase tracking-widest text-emerald-600">{TYPE_LABEL[c.type]}</div>
            <div className="mt-6 text-3xl font-extrabold tracking-tight">{c.type === 'co' || c.type === 'wf' ? c.term?.toUpperCase() : c.term}</div>
            {c.pos && <div className="mt-1 text-sm text-slate-500">{c.pos}</div>}
            {(c.type === 'w' || c.type === 'id' || c.type === 'pv') && c.term && <div className="mt-3"><SpeakButton text={c.term} /></div>}
            {(c.type === 'co' || c.type === 'wf') && !revealed && <div className="mt-3 text-sm text-slate-500">{c.type === 'co' ? '¿Qué combinaciones recuerdas? Dilas en voz alta.' : '¿Qué palabras derivadas conoces?'}</div>}
            {!revealed && <div className="mt-8 text-xs text-slate-400">Toca para ver la respuesta</div>}
            {revealed && (
              <div className="mt-5 animate-rise border-t border-dashed border-slate-200 pt-4 text-left dark:border-slate-700">
                {c.definition && <div className="text-[17px] leading-snug">{c.definition}</div>}
                {c.example && <div className="mt-2.5 flex items-start gap-2 italic text-slate-500"><span className="flex-1">“{fmtEx(c.example)}”</span><SpeakButton text={c.example} /></div>}
                {c.moreSenses?.map((m) => <div key={m.definition} className="mt-2 text-sm text-slate-500"><b>{m.pos}</b> {m.definition}</div>)}
                {c.items && <div className="flex flex-wrap gap-1.5">{c.items.map((x) => <span key={x} className="rounded-lg bg-slate-100 px-2 py-1 text-sm dark:bg-slate-800">{x}</span>)}</div>}
                {c.es && <div className="mt-3 inline-block rounded-lg bg-slate-100 px-2 py-1 text-sm dark:bg-slate-800">🇪🇸 {c.es}</div>}
              </div>
            )}
          </Card>
          <div className="mt-4">{revealed ? grades : <Button onClick={reveal}>Mostrar respuesta</Button>}</div>
          {knownButton}
        </>
      )}

      {(mode === 'type' || mode === 'cloze') && (
        <>
          <Card key={c.id} className="animate-pop">
            <div className="text-xs font-bold uppercase tracking-widest text-emerald-600">{mode === 'cloze' ? 'Phrasal verb · completa' : TYPE_LABEL[c.type]}</div>
            <div className="mt-3 text-lg leading-relaxed">{mode === 'cloze' ? (c.example ?? '').replace(/\[(.*?)\]/g, '____') : (c.question ?? '').replace(/_{3,}/, '____')}</div>
            {c.type === 'wx' && <div className="mt-3"><span className="rounded-lg bg-slate-900 px-2.5 py-1 text-sm font-extrabold tracking-wider text-white dark:bg-white dark:text-slate-900">{c.base}</span></div>}
            {mode === 'cloze' && <div className="mt-3 text-sm text-slate-500">💡 {c.definition}</div>}
          </Card>
          {(mode === 'cloze' ? clozeParts : ['']).map((_, i) => (
            <input key={c.id + i} value={typed[i] ?? ''} disabled={result !== undefined} autoCapitalize="off" autoCorrect="off" spellCheck={false} autoFocus={i === 0}
              onChange={(e) => setTyped((t) => { const n = t.slice(); n[i] = e.target.value; return n; })}
              onKeyDown={(e) => { if (e.key === 'Enter' && result === undefined) check(); }}
              placeholder={mode === 'cloze' && clozeParts.length > 1 ? `Hueco ${i + 1}` : 'Tu respuesta'}
              className="mt-3 w-full rounded-2xl border-2 border-slate-200 bg-white px-4 py-3 text-lg outline-none focus:border-emerald-500 dark:border-slate-700 dark:bg-slate-900" />
          ))}
          {result === undefined ? (
            <>
              <Button className="mt-3" onClick={check}>Comprobar</Button>
              <Button variant="ghost" onClick={() => setResult(false)}>No lo sé</Button>
              {knownButton}
            </>
          ) : (
            <>
              <div className={`mt-3 animate-pop rounded-2xl p-3 text-[15px] ${result ? 'bg-emerald-50 dark:bg-emerald-950' : 'bg-coral-50 dark:bg-coral-900/30'}`}>
                <b>{result ? '¡Correcto! ' : 'Respuesta: '}</b>{mode === 'cloze' ? fmtEx(c.example ?? '') : (c.answers ?? []).join(' / ')}
              </div>
              {!result && <Button variant="ghost" onClick={() => finish(2)}>Mi respuesta también vale ✓</Button>}
              <Button className="mt-2" onClick={() => finish(result ? 2 : 0)}>Continuar</Button>
            </>
          )}
        </>
      )}
    </div>
  );
}
