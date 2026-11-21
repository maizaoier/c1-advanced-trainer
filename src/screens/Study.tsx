import { useMemo, useRef, useState } from 'react';
import type { StudyCard } from '../types';
import { CARDS, UNIT_BY_ID, type Track } from '../lib/content';
import { dueCardIds, examEve, gradeCard, newCardIds, newLeftToday, useProgress, getProgress } from '../lib/store';
import { intervalLabel, type Grade } from '../lib/srs';
import { answerMatches, norm, shuffle } from '../lib/text';
import { speak } from '../lib/tts';
import { Button, Card, ProgressBar, TopBar } from '../components/ui';
import { IconSpeaker } from '../components/ui/icons';

const TYPE_LABEL: Record<string, string> = { w: 'Vocabulary', pv: 'Phrasal verb', id: 'Idiom', co: 'Collocations', wf: 'Word formation', wx: 'Word formation · Part 3', g: 'Grammar', kt: 'Key word transformation · Part 4' };

type Mode = 'flash' | 'mcq' | 'type' | 'cloze';
function modeOf(c: StudyCard, seen: boolean): Mode {
  if (c.type === 'g') return 'mcq';
  if (c.type === 'wx' || c.type === 'kt') return 'type';
  if (c.type === 'pv' && seen && /\[/.test(c.example ?? '')) return 'cloze';
  return 'flash';
}
const fmtEx = (s: string) => s.split(/(\[.*?\])/).map((t, i) => (t.startsWith('[') ? <b key={i}>{t.slice(1, -1)}</b> : <span key={i}>{t}</span>));

function buildQueue(track: Track, unit?: string): string[] {
  const p = getProgress();
  if (unit) {
    // a single unit: what is new or due; if everything is up to date, a full review of the unit
    const due = dueCardIds(p, track, unit);
    const fresh = newCardIds(p, track, 20, unit);
    const q = [...due, ...fresh];
    return q.length ? q : shuffle(UNIT_BY_ID[unit]?.cards ?? []).slice(0, 20);
  }
  const due = dueCardIds(p, track).slice(0, track === 'vocab' ? 60 : 30);
  const fresh = newCardIds(p, track, newLeftToday(p, track));
  const out: string[] = [];
  while (due.length || fresh.length) { if (due.length) out.push(due.shift()!); if (due.length) out.push(due.shift()!); if (fresh.length) out.push(fresh.shift()!); }
  return out;
}

export default function Study({ track, unit, onExit }: { track: Track; unit?: string; onExit: () => void }) {
  const p = useProgress();
  const [queue, setQueue] = useState<string[]>(() => buildQueue(track, unit));
  const [total] = useState(queue.length);
  const [done, setDone] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [mcq, setMcq] = useState<number | undefined>();
  const [typed, setTyped] = useState<string[]>([]);
  const [result, setResult] = useState<boolean | undefined>();
  const lock = useRef(false);

  const id = queue[0];
  const c = id ? CARDS[id] : undefined;
  const order = useMemo(() => (c?.options ? shuffle(c.options.map((_, i) => i)) : []), [c]);
  if (!c) {
    return (
      <div>
        <TopBar title={track === 'vocab' ? 'Vocabulario' : 'Gramática'} onBack={onExit} />
        <div className="mt-16 text-center">
          <div className="text-6xl">🎉</div>
          <h2 className="mt-3 text-xl font-bold">{total ? 'Sesión completada' : 'No hay tarjetas pendientes'}</h2>
          <p className="mt-2 text-slate-500">{total ? `${total} tarjetas repasadas.` : 'Vuelve mañana o practica una unidad concreta.'}</p>
          <Button className="mt-6" variant="secondary" onClick={onExit}>Volver</Button>
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
    setQueue((q) => { const rest = q.slice(1); if (g === 0) rest.splice(Math.min(rest.length, 3 + Math.floor(Math.random() * 3)), 0, c.id); return rest; });
    if (g !== 0) setDone((n) => n + 1);
    setRevealed(false); setMcq(undefined); setTyped([]); setResult(undefined);
    setTimeout(() => { lock.current = false; }, 150);
  };

  const clozeParts = (c.example ?? '').match(/\[(.*?)\]/g)?.map((x) => x.slice(1, -1)) ?? [];
  const check = () => {
    if (mode === 'type') setResult(answerMatches(typed[0] ?? '', c.answers ?? []));
    else setResult(clozeParts.every((p0, i) => norm(p0) === norm(typed[i] ?? '')));
  };

  const grades = (
    <div className="grid grid-cols-4 gap-2">
      {([['Otra vez', 0, 'text-coral-500'], ['Difícil', 1, 'text-amber-600'], ['Bien', 2, 'text-emerald-600'], ['Fácil', 3, 'text-indigo-500']] as const).map(([l, g, cls]) => (
        <button key={g} onClick={() => finish(g)} className="rounded-2xl bg-white py-3 font-semibold shadow-sm transition active:scale-95 dark:bg-slate-900">
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
          <Card className="min-h-[300px] animate-pop text-center" onClick={revealed ? undefined : () => { setRevealed(true); if (c.type === 'w' && c.term) speak(c.term, p.settings.speechRate); }}>
            <div className="text-xs font-bold uppercase tracking-widest text-emerald-600">{TYPE_LABEL[c.type]}</div>
            <div className="mt-4 text-3xl font-extrabold tracking-tight">{c.type === 'co' || c.type === 'wf' ? c.term?.toUpperCase() : c.term}</div>
            {c.pos && <div className="mt-1 text-sm text-slate-500">{c.pos}</div>}
            {(c.type === 'co' || c.type === 'wf') && !revealed && <div className="mt-3 text-sm text-slate-500">{c.type === 'co' ? '¿Qué combinaciones recuerdas? Dilas en voz alta.' : '¿Qué palabras derivadas conoces?'}</div>}
            {revealed && (
              <div className="mt-5 border-t border-dashed border-slate-200 pt-4 text-left dark:border-slate-700">
                {c.definition && <div className="text-[17px]">{c.definition}</div>}
                {c.example && <div className="mt-2 italic text-slate-500">“{fmtEx(c.example)}”</div>}
                {c.moreSenses?.map((m) => <div key={m.definition} className="mt-2 text-sm text-slate-500"><b>{m.pos}</b> {m.definition}</div>)}
                {c.items && <div className="flex flex-wrap gap-1.5">{c.items.map((x) => <span key={x} className="rounded-lg bg-slate-100 px-2 py-1 text-sm dark:bg-slate-800">{x}</span>)}</div>}
                {c.es && <div className="mt-3 inline-block rounded-lg bg-slate-100 px-2 py-1 text-sm dark:bg-slate-800">🇪🇸 {c.es}</div>}
                {c.term && <button onClick={(e) => { e.stopPropagation(); speak(c.example?.replace(/[[\]]/g, '') || c.term!, p.settings.speechRate); }} className="ml-2 inline-grid h-9 w-9 place-items-center rounded-full bg-slate-100 align-middle dark:bg-slate-800"><IconSpeaker width={18} /></button>}
              </div>
            )}
          </Card>
          <div className="mt-4">{revealed ? grades : <Button onClick={() => setRevealed(true)}>Mostrar respuesta</Button>}</div>
        </>
      )}

      {mode === 'mcq' && c.options && (
        <>
          <Card className="text-lg leading-relaxed">{c.question?.split('___').map((t, i, arr) => <span key={i}>{t}{i < arr.length - 1 && <span className="mx-1 inline-block min-w-16 border-b-2 border-emerald-500 text-center font-semibold text-emerald-600">{mcq !== undefined ? c.options![c.correctIndex!] : '?'}</span>}</span>)}</Card>
          <div className="mt-3 space-y-2">
            {order.map((i) => {
              const s = mcq === undefined ? '' : i === c.correctIndex ? 'border-emerald-500 bg-emerald-100 dark:bg-emerald-900/50' : i === mcq ? 'border-coral-500 bg-coral-100 dark:bg-coral-900/50' : '';
              return <button key={i} disabled={mcq !== undefined} onClick={() => setMcq(i)} className={`w-full rounded-2xl border-2 border-transparent bg-slate-100 px-4 py-3 text-left dark:bg-slate-800 ${s}`}>{c.options![i]}</button>;
            })}
          </div>
          {mcq !== undefined && (
            <>
              <div className={`mt-3 rounded-2xl p-3 text-sm ${mcq === c.correctIndex ? 'bg-emerald-50 dark:bg-emerald-950' : 'bg-coral-50 dark:bg-coral-900/30'}`}><b>{mcq === c.correctIndex ? '¡Correcto! ' : 'No exactamente. '}</b>{c.explanation}</div>
              <Button className="mt-3" onClick={() => finish(mcq === c.correctIndex ? 2 : 0)}>Continuar</Button>
            </>
          )}
        </>
      )}

      {(mode === 'type' || mode === 'cloze') && (
        <>
          <Card>
            <div className="text-xs font-bold uppercase tracking-widest text-emerald-600">{mode === 'cloze' ? 'Phrasal verb · completa' : TYPE_LABEL[c.type]}</div>
            {c.type === 'kt' && <div className="mt-3 text-lg">{c.sentence1}</div>}
            {c.type === 'kt' && <div className="mt-3"><span className="rounded-lg bg-slate-900 px-2.5 py-1 text-sm font-extrabold tracking-wider text-white dark:bg-white dark:text-slate-900">{c.keyword}</span></div>}
            <div className="mt-3 text-lg leading-relaxed">
              {mode === 'cloze' ? (c.example ?? '').replace(/\[(.*?)\]/g, '____') : (c.question ?? '').replace(/_{3,}/, '____')}
            </div>
            {c.type === 'wx' && <div className="mt-3"><span className="rounded-lg bg-slate-900 px-2.5 py-1 text-sm font-extrabold tracking-wider text-white dark:bg-white dark:text-slate-900">{c.base}</span></div>}
            {mode === 'cloze' && <div className="mt-3 text-sm text-slate-500">💡 {c.definition}</div>}
          </Card>
          {(mode === 'cloze' ? clozeParts : ['']).map((_, i) => (
            <input key={i} value={typed[i] ?? ''} disabled={result !== undefined} autoCapitalize="off" autoCorrect="off" spellCheck={false}
              onChange={(e) => setTyped((t) => { const n = t.slice(); n[i] = e.target.value; return n; })}
              onKeyDown={(e) => { if (e.key === 'Enter' && result === undefined) check(); }}
              placeholder={mode === 'cloze' && clozeParts.length > 1 ? `Hueco ${i + 1}` : 'Tu respuesta'}
              className="mt-3 w-full rounded-2xl border-2 border-slate-200 bg-white px-4 py-3 text-lg outline-none focus:border-emerald-500 dark:border-slate-700 dark:bg-slate-900" />
          ))}
          {result === undefined ? (
            <>
              <Button className="mt-3" onClick={check}>Comprobar</Button>
              <Button variant="ghost" onClick={() => setResult(false)}>No lo sé</Button>
            </>
          ) : (
            <>
              <div className={`mt-3 rounded-2xl p-3 text-sm ${result ? 'bg-emerald-50 dark:bg-emerald-950' : 'bg-coral-50 dark:bg-coral-900/30'}`}>
                <b>{result ? '¡Correcto! ' : 'Respuesta: '}</b>{mode === 'cloze' ? fmtEx(c.example ?? '') : (c.answers ?? []).join(' / ')}
                {c.explanation && <div className="mt-1 text-slate-600 dark:text-slate-300">{c.explanation}</div>}
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
