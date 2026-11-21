import { useCallback, useMemo, useRef, useState, type ReactNode } from 'react';
import type { ExamExercise, ExamQuestion } from '../../types';
import { isCorrect, marksFor, type Answers, type AnswerValue } from '../../lib/exam';
import { recordAttempt, markTask } from '../../lib/store';
import { stopSpeech } from '../../lib/tts';
import { fmtClock, dayKey } from '../../lib/date';
import { pctToScale, cefrFor } from '../../lib/scoring';
import { PART_LABEL, PART_HINT } from '../../lib/content';
import type { Mark } from '../../lib/text';
import { Button, TopBar, useCountdown, useElapsed } from '../ui';
import TrapReview from './TrapReview';

export interface ShellContext {
  answers: Answers;
  setAnswer: (qid: string, v: AnswerValue) => void;
  submitted: boolean;
  /** marks for the text in review mode (focused question or all) */
  reviewMarks?: Mark[];
}

interface Props {
  ex: ExamExercise;
  onExit: () => void;
  /** the reading text or the audio player */
  renderText: (ctx: ShellContext) => ReactNode;
  /** one question (used in both list and pager layouts) */
  renderQuestion: (q: ExamQuestion, index: number, ctx: ShellContext) => ReactNode;
  /** short strategy tips, shown folded */
  tips: string[];
  /** 'pager': text and questions on separate tabs, one question at a time (Reading). 'list': all questions below (Listening). */
  layout: 'pager' | 'list';
  /** shown after correction (e.g. the listening transcript) */
  renderAfter?: (ctx: ShellContext) => ReactNode;
}

function Segmented<T extends string>({ value, options, onChange }: { value: T; options: { id: T; label: ReactNode }[]; onChange: (v: T) => void }) {
  return (
    <div className="sticky top-[68px] z-10 -mx-1 mb-4 grid grid-flow-col gap-1 rounded-2xl bg-slate-200/90 p-1 backdrop-blur dark:bg-slate-800/90">
      {options.map((o) => (
        <button key={o.id} onClick={() => onChange(o.id)} className={`rounded-xl py-2.5 text-sm font-semibold transition ${value === o.id ? 'bg-white shadow-sm dark:bg-slate-950' : 'text-slate-500'}`}>{o.label}</button>
      ))}
    </div>
  );
}

/**
 * Common wrapper for every exam part: start screen, timer (auto-submit at 00:00 for Reading), single submission,
 * scoring, attempt + mistake persistence and the trap-detector review.
 */
export default function ExamShell({ ex, onExit, renderText, renderQuestion, tips, layout, renderAfter }: Props) {
  const [answers, setAnswers] = useState<Answers>({});
  const [submitted, setSubmitted] = useState(false);
  const [focus, setFocus] = useState<string | undefined>();
  const [started, setStarted] = useState(false);
  const [tab, setTab] = useState<'text' | 'questions' | 'review'>('text');
  const [qi, setQi] = useState(0);
  const [showTips, setShowTips] = useState(false);
  const lock = useRef(false);
  const elapsed = useElapsed();
  const isReading = ex.skill === 'reading';

  const submit = useCallback(() => {
    if (lock.current) return; // prevents double submission (fast taps / timer + tap)
    lock.current = true;
    stopSpeech();
    const wrong: string[] = [];
    const right: string[] = [];
    ex.questions.forEach((q) => (isCorrect(q, answers[q.id]) ? right : wrong).push(q.id));
    recordAttempt(
      { exerciseId: ex.id, skill: ex.skill, part: ex.part, correct: right.length, total: ex.questions.length, date: dayKey(), seconds: elapsed() },
      wrong, right,
    );
    markTask(ex.skill);
    setSubmitted(true);
    setTab('review');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [answers, elapsed, ex]);

  const left = useCountdown(ex.timeLimitSeconds, isReading && started && !submitted, submit);
  const setAnswer = useCallback((qid: string, v: AnswerValue) => { if (!lock.current) setAnswers((a) => ({ ...a, [qid]: v })); }, []);
  const answeredQ = (q: ExamQuestion) => answers[q.id] !== undefined && answers[q.id] !== '';
  const answered = ex.questions.filter(answeredQ).length;
  const score = ex.questions.filter((q) => isCorrect(q, answers[q.id])).length;
  const reviewMarks = useMemo(
    () => (submitted ? marksFor(focus ? ex.questions.filter((q) => q.id === focus) : ex.questions) : undefined),
    [submitted, focus, ex.questions],
  );
  const ctx: ShellContext = { answers, setAnswer, submitted, reviewMarks };

  const timer = isReading && !submitted && started ? (
    <span className={`rounded-xl px-3 py-1.5 font-mono text-sm font-bold ${left <= 60 ? 'bg-coral-100 text-coral-600 dark:bg-coral-900/50' : 'bg-white dark:bg-slate-900'}`}>{fmtClock(left)}</span>
  ) : null;
  const exit = () => { stopSpeech(); onExit(); };

  if (!started) {
    return (
      <div>
        <TopBar title={PART_LABEL[ex.part]} onBack={exit} />
        <div className="mt-4 animate-pop rounded-3xl bg-white p-6 shadow-sm dark:bg-slate-900">
          <div className="text-xs font-bold uppercase tracking-wide text-emerald-700 dark:text-emerald-400">{PART_LABEL[ex.part]} · {PART_HINT[ex.part]}</div>
          <h1 className="mt-1 text-2xl font-extrabold leading-tight">{ex.title.replace(/^Part \d · /, '')}</h1>
          <div className="mt-4 flex gap-2 text-sm">
            <span className="rounded-xl bg-slate-100 px-3 py-1.5 dark:bg-slate-800">❓ {ex.questions.length} preguntas</span>
            <span className="rounded-xl bg-slate-100 px-3 py-1.5 dark:bg-slate-800">⏱ {Math.round(ex.timeLimitSeconds / 60)} min</span>
          </div>
          <p className="mt-4 text-[15px] text-slate-600 dark:text-slate-300">{ex.instructions}</p>
          <div className="mt-4 rounded-2xl bg-emerald-50 p-4 text-sm text-emerald-900 dark:bg-emerald-950/60 dark:text-emerald-100">
            🎯 <b>Regla de oro:</b> busca la paráfrasis. Si una opción repite palabras literales del {isReading ? 'texto' : 'audio'}, sospecha.
          </div>
          <Button className="mt-5" onClick={() => setStarted(true)}>Empezar</Button>
        </div>
      </div>
    );
  }

  const pct = score / ex.questions.length;
  const scale = Math.round(pctToScale(pct));
  const tipsBox = (
    <div className="mb-4">
      <button onClick={() => setShowTips((s) => !s)} className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">💡 Estrategia {showTips ? '▴' : '▾'}</button>
      {showTips && <ul className="mt-2 animate-rise space-y-1.5 rounded-2xl bg-slate-100 p-4 text-sm text-slate-700 dark:bg-slate-800 dark:text-slate-300">{tips.map((t) => <li key={t}>• {t}</li>)}</ul>}
    </div>
  );

  // ───────── after correction ─────────
  if (submitted) {
    return (
      <div>
        <TopBar title={PART_LABEL[ex.part]} onBack={exit} />
        <div className="mb-4 animate-pop rounded-3xl bg-white p-5 shadow-sm dark:bg-slate-900">
          <div className="flex items-end justify-between">
            <div><div className="text-sm text-slate-500">Resultado</div><div className="text-4xl font-extrabold">{score}/{ex.questions.length}</div></div>
            <div className="text-right">
              <div className={`text-3xl font-extrabold ${scale >= 180 ? 'text-emerald-600' : 'text-coral-500'}`}>{scale}</div>
              <div className="text-xs text-slate-500">{cefrFor(scale)} · aprox.</div>
            </div>
          </div>
          <p className="mt-2 text-sm text-slate-500">{score === ex.questions.length ? '¡Perfecto! Revisa igualmente las trampas.' : 'Tus fallos volverán en «Repasar fallos».'}</p>
        </div>
        <Segmented value={tab === 'questions' ? 'review' : tab} onChange={setTab}
          options={[{ id: 'review', label: '🔍 Detector de trampas' }, { id: 'text', label: isReading ? '📄 Texto' : '📝 Transcripción' }]} />
        {tab === 'text' ? (
          <div className="animate-rise">
            {focus && <button onClick={() => setFocus(undefined)} className="mb-3 text-sm font-semibold text-emerald-700 dark:text-emerald-400">Mostrando la pregunta {ex.questions.findIndex((q) => q.id === focus) + 1} · ver todas</button>}
            <div className="mb-3 flex gap-2 text-xs"><span className="ev">verde = justifica la respuesta</span><span className="trap">coral = trampa</span></div>
            {isReading ? renderText(ctx) : renderAfter?.(ctx)}
          </div>
        ) : (
          <div className="animate-rise">
            <TrapReview ex={ex} answers={answers} focus={focus} onFocus={(id) => { setFocus(id); if (id) { setTab('text'); window.scrollTo({ top: 0 }); } }} />
          </div>
        )}
        <Button className="mt-6" variant="secondary" onClick={exit}>Terminar</Button>
      </div>
    );
  }

  // ───────── solving: list layout (Listening) ─────────
  if (layout === 'list') {
    return (
      <div>
        <TopBar title={PART_LABEL[ex.part]} onBack={exit} />
        <div className="sticky top-[68px] z-10 mb-4">{renderText(ctx)}</div>
        {tipsBox}
        <div className="space-y-7">{ex.questions.map((q, i) => <div key={q.id}>{renderQuestion(q, i, ctx)}</div>)}</div>
        <div className="sticky bottom-3 mt-8"><Button onClick={submit} disabled={answered === 0}>Corregir ({answered}/{ex.questions.length})</Button></div>
      </div>
    );
  }

  // ───────── solving: pager layout (Reading) ─────────
  const q = ex.questions[qi];
  return (
    <div>
      <TopBar title={PART_LABEL[ex.part]} onBack={exit} right={timer} />
      <Segmented value={tab} onChange={setTab}
        options={[{ id: 'text', label: '📄 Texto' }, { id: 'questions', label: <>❓ Preguntas <span className="text-xs opacity-70">{answered}/{ex.questions.length}</span></> }]} />
      {tab === 'text' ? (
        <div className="animate-rise">
          <p className="mb-3 text-xs text-slate-500">Toca una frase para subrayarla.</p>
          {renderText(ctx)}
          <Button className="mt-5" onClick={() => setTab('questions')}>Ir a las preguntas →</Button>
        </div>
      ) : (
        <div className="animate-rise">
          {tipsBox}
          <div className="mb-4 flex flex-wrap gap-1.5">
            {ex.questions.map((x, i) => (
              <button key={x.id} onClick={() => setQi(i)}
                className={`h-9 w-9 rounded-xl text-sm font-bold transition ${i === qi ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900' : answeredQ(x) ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-200' : 'bg-white text-slate-500 dark:bg-slate-900'}`}>{i + 1}</button>
            ))}
          </div>
          <div key={q.id} className="min-h-[300px] animate-rise">{renderQuestion(q, qi, ctx)}</div>
          <div className="mt-6 grid grid-cols-2 gap-2">
            <Button variant="secondary" disabled={qi === 0} onClick={() => setQi((i) => i - 1)}>← Anterior</Button>
            {qi < ex.questions.length - 1
              ? <Button variant="secondary" onClick={() => setQi((i) => i + 1)}>Siguiente →</Button>
              : <Button onClick={submit} disabled={answered === 0}>Corregir</Button>}
          </div>
          {qi < ex.questions.length - 1 && answered === ex.questions.length && <Button className="mt-2" onClick={submit}>Corregir ({answered}/{ex.questions.length})</Button>}
        </div>
      )}
    </div>
  );
}
