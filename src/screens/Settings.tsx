import { useEffect, useState } from 'react';
import { freshProgress, getProgress, recommendedNew, replaceProgress, updateProgress, useProgress } from '../lib/store';
import { Button, toast } from '../components/ui';
import { IconX } from '../components/ui/icons';
import type { HomeTask, Progress } from '../types';
import { listVoices, speakWithVoice, type VoiceInfo } from '../lib/tts';

const TASK_LABEL: [HomeTask, string][] = [
  ['vocab', '🧠 Vocabulario'], ['grammar', '📐 Gramática'], ['reading', '📖 Reading'], ['podcast', '🎧 Escucha real (podcast)'],
  ['listening', '🎙️ Listening tipo examen'], ['writing', '✍️ Writing'], ['speaking', '🗣️ Speaking'],
];

function VoicePicker({ slot, value, voices, onChange }: { slot: string; value: string; voices: VoiceInfo[]; onChange: (v: string) => void }) {
  const v = voices.find((x) => x.name === value) ?? (slot === 'A' ? voices[0] : voices.find((x) => x.name !== voices[0]?.name));
  return (
    <div className="flex items-center gap-2 py-1.5">
      <span className="w-24 flex-none text-sm">{slot === 'A' ? 'Voz 1' : 'Voz 2'}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)} className="min-w-0 flex-1 rounded-xl border border-slate-300 bg-white px-2 py-2 text-sm dark:border-slate-700 dark:bg-slate-900">
        <option value="">Automática ({v?.name ?? '—'})</option>
        {voices.map((x) => <option key={x.name + x.index} value={x.name}>{x.quality >= 70 ? '★ ' : ''}{x.name} · {x.lang}</option>)}
      </select>
      <button disabled={!v} onClick={() => v && speakWithVoice('Having said that, I\'m not entirely convinced it was worth it.', v)} className="flex-none rounded-xl bg-emerald-600 px-3 py-2 text-sm font-semibold text-white">▶</button>
    </div>
  );
}

export default function Settings({ onClose }: { onClose: () => void }) {
  const p = useProgress();
  const s = p.settings;
  const [imp, setImp] = useState('');
  const [sure, setSure] = useState(false);
  const [voices, setVoices] = useState<VoiceInfo[]>([]);
  const [voicesLoaded, setVoicesLoaded] = useState(false);
  useEffect(() => { void listVoices().then((v) => { setVoices(v); setVoicesLoaded(true); }); }, []);
  const toggleTask = (k: HomeTask) => updateProgress((d) => { d.settings.homeTasks[k] = !d.settings.homeTasks[k]; });
  const set = <K extends keyof Progress['settings']>(k: K, v: Progress['settings'][K]) => updateProgress((d) => { d.settings[k] = v; });
  const row = 'flex items-center justify-between gap-3 py-3 border-b border-slate-200 dark:border-slate-800';
  const input = 'rounded-xl border border-slate-300 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-900';

  const exportData = async () => {
    const txt = JSON.stringify(getProgress());
    try { await navigator.clipboard.writeText(txt); toast('Copia guardada en el portapapeles'); }
    catch { setImp(txt); toast('Copia mostrada abajo: cópiala a mano'); }
  };
  const importData = () => {
    try {
      const x = JSON.parse(imp) as Progress;
      if (!x.settings || !x.cards) throw new Error('bad');
      replaceProgress(x);
      toast('Progreso restaurado');
      onClose();
    } catch { toast('Esa copia no es válida'); }
  };

  return (
    <div>
      <div className="mb-2 flex items-center justify-between"><h2 className="text-xl font-bold">Ajustes</h2><button onClick={onClose}><IconX /></button></div>
      <div className="border-b border-slate-200 py-3 dark:border-slate-800">
        <b>Tareas de la pantalla «Hoy»</b>
        <div className="mt-2 grid grid-cols-2 gap-2">
          {TASK_LABEL.map(([k, label]) => (
            <button key={k} onClick={() => toggleTask(k)} className={`rounded-xl border-2 px-3 py-2 text-left text-sm font-medium transition ${s.homeTasks[k] ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950' : 'border-transparent bg-white text-slate-500 dark:bg-slate-900'}`}>{label}</button>
          ))}
        </div>
        <div className="mt-1.5 text-xs text-slate-500">«Repasar fallos» aparece solo cuando tienes preguntas pendientes.</div>
      </div>
      <div className="border-b border-slate-200 py-3 dark:border-slate-800">
        <b>Voces del Listening</b>
        <div className="mb-1 text-xs text-slate-500">★ = voces naturales (neuronales). Si no ves ninguna, instala «Voces de Google» en Ajustes de Android → Texto a voz y descarga el inglés (Reino Unido).</div>
        {voices.length ? <>
          <VoicePicker slot="A" value={s.voiceA} voices={voices} onChange={(v) => set('voiceA', v)} />
          <VoicePicker slot="B" value={s.voiceB} voices={voices} onChange={(v) => set('voiceB', v)} />
        </> : <div className="text-sm text-slate-500">{voicesLoaded ? 'No hay voces en inglés en este dispositivo.' : 'Cargando voces…'}</div>}
      </div>
      <div className={row}><span>Fecha del examen</span><input type="date" className={input} value={s.examDate} onChange={(e) => e.target.value && set('examDate', e.target.value)} /></div>
      <div className={row}><span>Inicio del plan</span><input type="date" className={input} value={s.planStart} onChange={(e) => e.target.value && set('planStart', e.target.value)} /></div>
      <div className="border-b border-slate-200 py-3 dark:border-slate-800">
        <div className="flex justify-between"><span>Palabras nuevas al día</span><b>{s.newPerDay || `Auto (${recommendedNew(p)})`}</b></div>
        <input type="range" min={0} max={120} step={5} value={s.newPerDay} onChange={(e) => set('newPerDay', Number(e.target.value))} className="mt-2 w-full accent-emerald-600" />
        <div className="text-xs text-slate-500">0 = automático (máx. 40 al día ≈ 15 min). Gramática: 8 preguntas nuevas al día.</div>
      </div>
      <div className="border-b border-slate-200 py-3 dark:border-slate-800">
        <div className="flex justify-between"><span>Velocidad de voz (Listening)</span><b>{s.speechRate.toFixed(2)}</b></div>
        <input type="range" min={0.7} max={1.2} step={0.05} value={s.speechRate} onChange={(e) => set('speechRate', Number(e.target.value))} className="mt-2 w-full accent-emerald-600" />
        <div className="text-xs text-slate-500">El examen real va a velocidad natural (≈1.0). Baja solo para practicar al principio.</div>
      </div>
      <div className={row}>
        <span>Tema</span>
        <select className={input} value={s.darkMode} onChange={(e) => set('darkMode', e.target.value as Progress['settings']['darkMode'])}>
          <option value="system">Sistema</option><option value="light">Claro</option><option value="dark">Oscuro</option>
        </select>
      </div>
      <div className="py-4">
        <b>Copia de seguridad</b>
        <p className="mb-2 text-sm text-slate-500">Todo se guarda automáticamente en este dispositivo (localStorage). Haz una copia de vez en cuando.</p>
        <Button variant="secondary" onClick={exportData}>Copiar mi progreso</Button>
        <textarea value={imp} onChange={(e) => setImp(e.target.value)} placeholder="Pega aquí una copia para restaurarla" className={`${input} mt-2 h-20 w-full text-xs`} />
        <Button variant="secondary" className="mt-2" disabled={!imp} onClick={importData}>Restaurar copia</Button>
        <Button variant="danger" className="mt-2" onClick={() => { if (sure) { replaceProgress(freshProgress()); toast('Progreso borrado'); onClose(); } else setSure(true); }}>
          {sure ? 'Pulsa otra vez para borrar TODO' : 'Borrar todo el progreso'}
        </Button>
      </div>
    </div>
  );
}
