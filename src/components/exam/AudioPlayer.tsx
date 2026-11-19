import { useEffect, useRef, useState } from 'react';
import type { TranscriptLine } from '../../types';
import { speakScript, stopSpeech, ttsAvailable } from '../../lib/tts';
import { useProgress } from '../../lib/store';
import { IconPlay, IconStop } from '../ui/icons';

/**
 * Exam-style audio: the recording can be played twice (as in the real CAE) unless practice mode is on.
 * The transcript stays hidden; only the current speaker label is shown.
 */
export default function AudioPlayer({ script, locked }: { script: TranscriptLine[]; locked?: boolean }) {
  const p = useProgress();
  const [plays, setPlays] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [line, setLine] = useState(-1);
  const [practice, setPractice] = useState(false);
  const busy = useRef(false);
  const max = practice ? Infinity : 2;

  useEffect(() => () => stopSpeech(), []);

  const play = async () => {
    if (busy.current || plays >= max) return; // guard against double taps
    busy.current = true;
    setPlaying(true);
    setPlays((n) => n + 1);
    await speakScript(script, p.settings.speechRate, setLine);
    setPlaying(false);
    setLine(-1);
    busy.current = false;
  };
  const stop = () => { stopSpeech(); setPlaying(false); setLine(-1); busy.current = false; };

  if (!ttsAvailable()) {
    return <div className="rounded-2xl bg-amber-50 p-4 text-sm text-amber-900 dark:bg-amber-900/30 dark:text-amber-100">Este navegador no tiene voz. Abre la app en Chrome o instala el APK.</div>;
  }

  const pct = line >= 0 ? (line + 1) / script.length : 0;
  return (
    <div className="rounded-3xl bg-gradient-to-br from-emerald-600 to-teal-700 p-5 text-white shadow-lg shadow-emerald-900/20">
      <div className="flex items-center gap-4">
        <button
          onClick={playing ? stop : play}
          disabled={locked || (!playing && plays >= max)}
          className="grid h-16 w-16 flex-none place-items-center rounded-full bg-white text-emerald-700 shadow-md transition active:scale-95 disabled:opacity-40"
          aria-label={playing ? 'Parar' : 'Reproducir'}
        >
          {playing ? <IconStop /> : <IconPlay />}
        </button>
        <div className="min-w-0 flex-1">
          <div className="text-sm font-medium opacity-90">{playing ? `▶ ${script[line]?.speaker ?? ''}` : plays >= max ? 'Ya has escuchado la grabación dos veces' : `Escucha ${Math.min(plays + 1, 2)} de 2`}</div>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/25"><div className="h-full rounded-full bg-white transition-all" style={{ width: `${pct * 100}%` }} /></div>
        </div>
      </div>
      <label className="mt-4 flex items-center gap-2 text-xs opacity-90">
        <input type="checkbox" checked={practice} onChange={(e) => setPractice(e.target.checked)} className="h-4 w-4 accent-white" />
        Modo práctica (escuchas ilimitadas — no es como el examen)
      </label>
    </div>
  );
}
