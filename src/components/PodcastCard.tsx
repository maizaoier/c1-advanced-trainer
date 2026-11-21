import { useState } from 'react';
import type { Podcast } from '../types';
import { PODCAST_QUESTIONS } from '../lib/content';

const ICON: Record<string, string> = { YouTube: '▶', Spotify: '♫', 'Apple Podcasts': '', BBC: '◉', Web: '↗', 'Web oficial': '↗' };
const TONE: Record<string, string> = {
  YouTube: 'bg-red-600 text-white', Spotify: 'bg-[#1DB954] text-white', 'Apple Podcasts': 'bg-purple-600 text-white',
};

export function PodcastLinks({ p, small }: { p: Podcast; small?: boolean }) {
  return (
    <div className="flex flex-wrap gap-2">
      {p.links.map((l) => (
        <a key={l.url} href={l.url} target="_blank" rel="noopener noreferrer"
          className={`inline-flex items-center gap-1.5 rounded-xl font-semibold transition active:scale-95 ${small ? 'px-2.5 py-1.5 text-xs' : 'px-3.5 py-2.5 text-sm'} ${TONE[l.label] ?? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'}`}>
          <span>{ICON[l.label] ?? '↗'}</span>{l.label}
        </a>
      ))}
    </div>
  );
}

/** Today's real-audio listening: source, why it helps, direct links and control questions. */
export default function PodcastCard({ p, done, onDone }: { p: Podcast; done?: boolean; onDone?: () => void }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-3xl bg-white p-5 shadow-sm dark:bg-slate-900">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-xs font-bold uppercase tracking-wide text-emerald-700 dark:text-emerald-400">{p.kind} · {p.parts}</div>
          <div className="mt-0.5 text-lg font-bold leading-snug">{p.name}</div>
        </div>
        <span className="flex-none rounded-xl bg-slate-100 px-2.5 py-1 text-xs font-semibold dark:bg-slate-800">{Math.min(15, p.minutes)} min</span>
      </div>
      <p className="mt-2 text-[14.5px] text-slate-600 dark:text-slate-300">{p.why}</p>
      {p.minutes > 15 && <p className="mt-1 text-xs text-slate-500">No hace falta el episodio entero: con 15 minutos de escucha activa basta.</p>}
      <div className="mt-4"><PodcastLinks p={p} /></div>
      <button onClick={() => setOpen((o) => !o)} className="mt-4 text-sm font-semibold text-emerald-700 dark:text-emerald-400">Preguntas de control {open ? '▴' : '▾'}</button>
      {open && (
        <ol className="mt-2 animate-rise list-decimal space-y-1.5 pl-5 text-[14.5px] text-slate-700 dark:text-slate-300">
          {PODCAST_QUESTIONS.map((q) => <li key={q}>{q}</li>)}
        </ol>
      )}
      {onDone && (
        <button onClick={onDone} disabled={done} className={`mt-4 w-full rounded-2xl py-3 font-semibold transition ${done ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-200' : 'bg-slate-100 dark:bg-slate-800'}`}>
          {done ? '✓ Escucha de hoy hecha' : 'Marcar como escuchado'}
        </button>
      )}
    </div>
  );
}
