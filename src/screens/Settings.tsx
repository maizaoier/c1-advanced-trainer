import { useEffect, useState } from 'react';
import type { Progress } from '../types';
import { freshProgress, getProgress, recommendedNew, replaceProgress, updateProgress, useProgress } from '../lib/store';
import { CARD_ORDER, CARDS } from '../lib/content';

const CORE_COUNT = CARD_ORDER.filter((id) => CARDS[id].core).length;
import { listVoices, speakWithVoice, type VoiceInfo } from '../lib/tts';
import { Button, toast } from '../components/ui';
import { IconX } from '../components/ui/icons';

export default function Settings({ onClose }: { onClose: () => void }) {
  const p = useProgress();
  const s = p.settings;
  const [imp, setImp] = useState('');
  const [sure, setSure] = useState(false);
  const [voices, setVoices] = useState<VoiceInfo[]>([]);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => { void listVoices().then((v) => { setVoices(v); setLoaded(true); }); }, []);
  const set = <K extends keyof Progress['settings']>(k: K, v: Progress['settings'][K]) => updateProgress((d) => { d.settings[k] = v; });
  const row = 'flex items-center justify-between gap-3 py-3 border-b border-slate-200 dark:border-slate-800';
  const input = 'rounded-xl border border-slate-300 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-900';
  const current = voices.find((v) => v.name === s.voice) ?? voices[0];

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
      <div className="mb-2 flex items-center justify-between"><h2 className="text-xl font-bold">Ajustes</h2><button onClick={onClose} aria-label="Cerrar"><IconX /></button></div>
      <div className="border-b border-slate-200 py-3 dark:border-slate-800">
        <div className="mb-2">Qué vocabulario estudiar</div>
        <div className="grid grid-cols-2 gap-2">
          {([['essential', 'Esencial', `${CORE_COUNT} tarjetas`], ['all', 'Completo', `${CARD_ORDER.length} tarjetas`]] as const).map(([v, l, n]) => (
            <button key={v} onClick={() => set('selection', v)} className={`rounded-xl border-2 px-3 py-2.5 text-left transition ${s.selection === v ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950' : 'border-transparent bg-white dark:bg-slate-900'}`}>
              <div className="font-semibold">{l}</div><div className="text-xs text-slate-500">{n}</div>
            </button>
          ))}
        </div>
        <div className="mt-1.5 text-xs text-slate-500">Esencial: sin las palabras más básicas ni las listas de colocaciones y familias de palabras. Mantiene todos los phrasal verbs, idioms y ejercicios de word formation. Lo que ya hayas marcado como «ya me la sé» ({Object.keys(p.known).length}) no aparece en ninguna.</div>
      </div>
      <div className={row}><span>Fecha del examen</span><input type="date" className={input} value={s.examDate} onChange={(e) => e.target.value && set('examDate', e.target.value)} /></div>
      <div className="border-b border-slate-200 py-3 dark:border-slate-800">
        <div className="flex justify-between"><span>Tarjetas nuevas al día</span><b>{s.newPerDay || `Auto (${recommendedNew(p)})`}</b></div>
        <input type="range" min={0} max={100} step={5} value={s.newPerDay} onChange={(e) => set('newPerDay', Number(e.target.value))} className="mt-2 w-full accent-emerald-600" />
        <div className="text-xs text-slate-500">0 = automático: reparte lo que queda para terminar antes del examen (máx. 40 al día).</div>
      </div>
      <div className="border-b border-slate-200 py-3 dark:border-slate-800">
        <div className="mb-1">Voz de la pronunciación</div>
        {voices.length ? (
          <div className="flex gap-2">
            <select value={s.voice} onChange={(e) => set('voice', e.target.value)} className={`${input} min-w-0 flex-1 text-sm`}>
              <option value="">Automática ({voices[0]?.name})</option>
              {voices.map((v) => <option key={v.name + v.index} value={v.name}>{v.quality >= 70 ? '★ ' : ''}{v.name} · {v.lang}</option>)}
            </select>
            <button disabled={!current} onClick={() => current && speakWithVoice('Having said that, I\'m not entirely convinced.', current, s.speechRate)} className="flex-none rounded-xl bg-emerald-600 px-3 text-sm font-semibold text-white">▶</button>
          </div>
        ) : <div className="text-sm text-slate-500">{loaded ? 'No hay voces en inglés en este dispositivo.' : 'Cargando voces…'}</div>}
        <div className="mt-1 text-xs text-slate-500">★ = voces naturales. En Android: Ajustes → Sistema → Texto a voz → Servicios de voz de Google → descarga «Inglés (Reino Unido)».</div>
        <div className="mt-3 flex justify-between text-sm"><span>Velocidad</span><b>{s.speechRate.toFixed(2)}</b></div>
        <input type="range" min={0.7} max={1.2} step={0.05} value={s.speechRate} onChange={(e) => set('speechRate', Number(e.target.value))} className="w-full accent-emerald-600" />
      </div>
      <div className={row}>
        <span>Tema</span>
        <select className={input} value={s.darkMode} onChange={(e) => set('darkMode', e.target.value as Progress['settings']['darkMode'])}>
          <option value="system">Sistema</option><option value="light">Claro</option><option value="dark">Oscuro</option>
        </select>
      </div>
      <div className="py-4">
        <b>Copia de seguridad</b>
        <p className="mb-2 text-sm text-slate-500">Todo se guarda automáticamente en este dispositivo. Haz una copia antes de cambiar de móvil.</p>
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
