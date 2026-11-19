import type { Progress, Skill } from '../types';
import { estimate, SKILL_LABEL, cefrFor } from '../lib/scoring';
import { Card } from './ui';

const SKILLS: Skill[] = ['listening', 'reading', 'useOfEnglish', 'writing', 'speaking'];
const MIN = 160, MAX = 210;
const x = (v: number) => ((Math.max(MIN, Math.min(MAX, v)) - MIN) / (MAX - MIN)) * 100;

/** Cambridge English Scale 160–210 with the pass line at 180, starting point vs current estimate. */
export default function ScoreDashboard({ p }: { p: Progress }) {
  const est = SKILLS.map((s) =>
    estimate(s, p.attempts, s === 'writing' ? p.settings.manualWriting : s === 'speaking' ? p.settings.manualSpeaking : undefined));
  const overall = Math.round(est.reduce((a, e) => a + e.estimate, 0) / est.length);
  const baseOverall = 178;
  return (
    <Card>
      <div className="flex items-end justify-between">
        <div>
          <div className="text-xs font-bold uppercase tracking-wide text-slate-500">Puntuación estimada</div>
          <div className="flex items-baseline gap-2">
            <span className={`text-4xl font-extrabold ${overall >= 180 ? 'text-emerald-600 dark:text-emerald-400' : 'text-coral-500'}`}>{overall}</span>
            <span className="text-sm text-slate-500">{cefrFor(overall)}</span>
          </div>
        </div>
        <div className="text-right text-xs text-slate-500">
          Convocatoria anterior: <b>{baseOverall}</b> (B2)<br />Objetivo: <b className="text-emerald-600">193–199</b> (Grade B)
        </div>
      </div>
      <div className="mt-5 space-y-3.5">
        {est.map((e) => (
          <div key={e.skill}>
            <div className="mb-1 flex justify-between text-sm">
              <span className="font-semibold">{SKILL_LABEL[e.skill]}</span>
              <span className="tabular-nums text-slate-500">
                {e.baseline}{e.estimate !== e.baseline && <> → <b className={e.estimate >= 180 ? 'text-emerald-600 dark:text-emerald-400' : 'text-coral-500'}>{e.estimate}</b></>}
              </span>
            </div>
            <div className="relative h-3 rounded-full bg-slate-100 dark:bg-slate-800">
              <div className={`absolute inset-y-0 left-0 rounded-full ${e.estimate >= 180 ? 'bg-emerald-500' : 'bg-coral-400'}`} style={{ width: `${x(e.estimate)}%` }} />
              <div className="absolute -top-1 h-5 w-0.5 bg-slate-900 dark:bg-white" style={{ left: `${x(180)}%` }} />
              <div className="absolute top-0.5 h-2 w-2 -translate-x-1 rounded-full border-2 border-white bg-slate-500" style={{ left: `${x(e.baseline)}%` }} title="Punto de partida" />
            </div>
          </div>
        ))}
      </div>
      <div className="mt-3 flex justify-between text-[11px] text-slate-400">
        <span>160</span><span style={{ marginLeft: `${x(180) - 12}%` }}>180 aprobado</span><span>210</span>
      </div>
      <p className="mt-2 text-[11.5px] leading-snug text-slate-500">● punto de partida (tu examen anterior). La barra es una estimación orientativa calculada con tus últimas 40 respuestas de cada destreza.</p>
    </Card>
  );
}
