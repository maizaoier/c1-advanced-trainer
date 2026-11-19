import { useEffect, useRef, useState } from 'react';
import { PROMPTS, UNITS } from '../lib/content';
import { markTask, updateProgress, useProgress } from '../lib/store';
import { fmtClock } from '../lib/date';
import { Button, Card, SectionTitle, TopBar, toast } from '../components/ui';

const WRITING_CHECK = [
  'Registro adecuado al tipo de texto (formal en report/proposal/letter)',
  'Introducción que responde directamente a la tarea',
  'Párrafos con una idea principal cada uno',
  'Al menos una inversión o cleft sentence (Not only…, What I find…)',
  'Un condicional mixto o invertido (Had I known…, Were we to…)',
  'Conectores variados (Nevertheless, Having said that, On balance)',
  '5+ palabras del vocabulario Destination',
  '220–260 palabras y he revisado tiempos y concordancias',
];
const SPEAK_CHECK = ['Respondo y lo amplío con un ejemplo', 'Especulo (I\'d imagine…, It might well be…)', 'Comparo (whereas, while, unlike)', 'No me quedo callado: parafraseo', 'Uso 3 palabras de la unidad'];

/** 15% of study time: Writing and Speaking upkeep (current 180 / 184). */
export default function Productive() {
  const p = useProgress();
  const [tab, setTab] = useState<'writing' | 'speaking'>('writing');
  const wUnits = UNITS.filter((u) => PROMPTS.writing[u.id]);
  const [wu, setWu] = useState(wUnits[0]?.id ?? 'u2');
  const draft = p.drafts[wu] ?? '';
  const words = (draft.trim().match(/\S+/g) ?? []).length;
  const [checks, setChecks] = useState<Set<number>>(new Set());
  const W = PROMPTS.writing[wu];

  // speaking
  const S = PROMPTS.speakingCAE;
  const [sp, setSp] = useState<{ part: 1 | 2 | 3 | 4; i: number }>({ part: 2, i: 0 });
  const [left, setLeft] = useState(60);
  const [running, setRunning] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval>>(undefined);
  const durations = { 1: 30, 2: 60, 3: 120, 4: 60 } as const;
  useEffect(() => () => clearInterval(timer.current), []);
  useEffect(() => {
    if (running && left === 0) { clearInterval(timer.current); setRunning(false); try { navigator.vibrate?.(300); } catch { /* not supported */ } toast('⏱ ¡Tiempo!'); }
  }, [left, running]);
  const startTimer = () => {
    if (running) { clearInterval(timer.current); setRunning(false); return; }
    setLeft(durations[sp.part]); setRunning(true);
    clearInterval(timer.current);
    timer.current = setInterval(() => setLeft((s) => Math.max(0, s - 1)), 1000);
  };
  const spText = sp.part === 1 ? S.part1[sp.i % S.part1.length] : sp.part === 2 ? S.part2[sp.i % S.part2.length].task : sp.part === 3 ? S.part3[sp.i % S.part3.length].question : S.part4[sp.i % S.part4.length];

  const claudePrompt = `Actúa como examinador de Cambridge C1 Advanced. Corrige mi ${W?.type} con la escala oficial (Content, Communicative Achievement, Organisation, Language, 0-5 cada uno), dame una nota estimada en la escala Cambridge, lista mis errores con la corrección y propón 5 mejoras de nivel C1. Sé estricto.\n\nTarea: ${W?.prompt}\n\nMi texto:\n${draft}`;

  return (
    <div>
      <TopBar title="Writing & Speaking" />
      <div className="mb-4 grid grid-cols-2 gap-1 rounded-2xl bg-slate-200 p-1 dark:bg-slate-800">
        {(['writing', 'speaking'] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)} className={`rounded-xl py-2 text-sm font-semibold transition ${tab === t ? 'bg-white shadow dark:bg-slate-950' : 'text-slate-500'}`}>{t === 'writing' ? '✍️ Writing (180)' : '🗣️ Speaking (184)'}</button>
        ))}
      </div>

      {tab === 'writing' && W && (
        <>
          <div className="mb-3 flex gap-2 overflow-x-auto pb-1">
            {wUnits.map((u) => (
              <button key={u.id} onClick={() => setWu(u.id)} className={`whitespace-nowrap rounded-full px-3 py-1.5 text-sm ${u.id === wu ? 'bg-emerald-600 text-white' : 'bg-white dark:bg-slate-900'}`}>{PROMPTS.writing[u.id].type} · U{u.num}</button>
            ))}
          </div>
          <Card><div className="text-xs font-bold uppercase tracking-wide text-emerald-600">{W.type}</div><p className="mt-1 text-[15.5px]">{W.prompt}</p></Card>
          <textarea value={draft} onChange={(e) => updateProgress((d) => { d.drafts[wu] = e.target.value; })} placeholder="Escribe aquí (se guarda solo)…"
            className="mt-3 h-72 w-full rounded-2xl border-2 border-slate-200 bg-white p-4 leading-relaxed outline-none focus:border-emerald-500 dark:border-slate-700 dark:bg-slate-900" />
          <div className="mt-1 flex justify-between text-sm"><span className={words >= 220 && words <= 260 ? 'text-emerald-600' : 'text-slate-500'}>{words} palabras</span><span className="text-slate-500">objetivo 220–260</span></div>
          <SectionTitle>Checklist de examinador</SectionTitle>
          <Card className="!py-2">
            {WRITING_CHECK.map((c, i) => (
              <label key={c} className="flex items-start gap-3 py-2 text-[14.5px]">
                <input type="checkbox" className="mt-1 h-4 w-4 accent-emerald-600" checked={checks.has(i)} onChange={() => setChecks((s) => { const n = new Set(s); if (n.has(i)) n.delete(i); else n.add(i); return n; })} />{c}
              </label>
            ))}
          </Card>
          <Button className="mt-4" variant="secondary" disabled={words < 50} onClick={async () => { try { await navigator.clipboard.writeText(claudePrompt); toast('Copiado: pégalo en Claude para la corrección'); } catch { toast('No se pudo copiar'); } }}>
            Copiar texto + instrucciones para corregir con Claude
          </Button>
          <div className="mt-3 flex items-center gap-3 rounded-2xl bg-white p-4 text-sm dark:bg-slate-900">
            <span className="flex-1">Nota que te dio el examinador (escala Cambridge)</span>
            <input type="number" min={140} max={210} value={p.settings.manualWriting || ''} placeholder="180" onChange={(e) => updateProgress((d) => { d.settings.manualWriting = Number(e.target.value) || 0; })} className="w-20 rounded-xl border border-slate-300 bg-transparent px-2 py-1.5 text-center dark:border-slate-700" />
          </div>
          <Button className="mt-4" onClick={() => { markTask('writing'); toast('Writing hecho ✓'); }}>Marcar como hecho</Button>
        </>
      )}

      {tab === 'speaking' && (
        <>
          <div className="mb-3 grid grid-cols-4 gap-2">
            {([1, 2, 3, 4] as const).map((n) => (
              <button key={n} onClick={() => { setSp({ part: n, i: 0 }); setRunning(false); clearInterval(timer.current); setLeft(durations[n]); }} className={`rounded-xl py-2 text-sm font-semibold ${sp.part === n ? 'bg-emerald-600 text-white' : 'bg-white dark:bg-slate-900'}`}>Part {n}</button>
            ))}
          </div>
          <Card>
            <div className="text-xs font-bold uppercase tracking-wide text-emerald-600">Speaking Part {sp.part} · {durations[sp.part]} s</div>
            <p className="mt-2 text-lg">{spText}</p>
            {sp.part === 3 && <div className="mt-3 flex flex-wrap gap-1.5">{S.part3[sp.i % S.part3.length].prompts.map((x) => <span key={x} className="rounded-lg bg-slate-100 px-2 py-1 text-sm dark:bg-slate-800">{x}</span>)}</div>}
            <Button variant="ghost" className="mt-2" onClick={() => setSp((s) => ({ ...s, i: s.i + 1 }))}>↻ Otra pregunta</Button>
          </Card>
          <Card className="mt-3 text-center">
            <div className={`font-mono text-5xl font-extrabold tabular-nums ${left <= 10 && running ? 'text-coral-500' : ''}`}>{fmtClock(left)}</div>
            <Button className="mt-3" onClick={startTimer}>{running ? 'Parar' : 'Empezar a hablar'}</Button>
            <p className="mt-2 text-xs text-slate-500">Consejo: grábate con la grabadora del móvil y escúchate después buscando muletillas y errores.</p>
          </Card>
          <SectionTitle>Checklist</SectionTitle>
          <Card className="!py-2">{SPEAK_CHECK.map((c) => <div key={c} className="py-1.5 text-[14.5px]">• {c}</div>)}</Card>
          <Button className="mt-4" onClick={() => { markTask('speaking'); toast('Speaking hecho ✓'); }}>Marcar como hecho</Button>
        </>
      )}
    </div>
  );
}
