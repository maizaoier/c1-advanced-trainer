import { useCallback, useMemo, useRef, useState, type ReactNode } from 'react';
import type { ExamExercise } from '../../types';
import { isCorrect, marksFor, type Answers, type AnswerValue } from '../../lib/exam';
import { recordAttempt, markTask } from '../../lib/store';
import { stopSpeech } from '../../lib/tts';
import { fmtClock, dayKey } from '../../lib/date';
import { pctToScale, cefrFor } from '../../lib/scoring';
import { PART_LABEL } from '../../lib/content';
import type { Mark } from '../../lib/text';
import { Button, TopBar, useCountdown, useElapsed, SectionTitle } from '../ui';
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
  children: (ctx: ShellContext) => ReactNode;
}

/**
 * Common wrapper for every exam part: timer (auto-submit at 00:00 for Reading), single submission,
 * scoring, attempt + mistake persistence, and the trap-detector review.
 */
export default function ExamShell({ ex, onExit, children }: Props) {
  const [answers, setAnswers] = useState<Answers>({});
  const [submitted, setSubmitted] = useState(false);
  const [focus, setFocus] = useState<string | undefined>();
  const [started, setStarted] = useState(ex.skill === 'listening');
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
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [answers, elapsed, ex]);

  const left = useCountdown(ex.timeLimitSeconds, isReading && started && !submitted, submit);
  const setAnswer = useCallback((qid: string, v: AnswerValue) => { if (!lock.current) setAnswers((a) => ({ ...a, [qid]: v })); }, []);

  const answered = ex.questions.filter((q) => answers[q.id] !== undefined && answers[q.id] !== '').length;
  const score = ex.questions.filter((q) => isCorrect(q, answers[q.id])).length;
  const reviewMarks = useMemo(
    () => (submitted ? marksFor(focus ? ex.questions.filter((q) => q.id === focus) : ex.questions) : undefined),
    [submitted, focus, ex.questions],
  );

  const timer = isReading && !submitted && started ? (
    <span className={`rounded-xl px-3 py-1.5 font-mono text-sm font-bold ${left <= 60 ? 'bg-coral-100 text-coral-600 dark:bg-coral-900/50' : 'bg-white dark:bg-slate-900'}`}>{fmtClock(left)}</span>
  ) : null;

  if (!started) {
    return (
      <div>
        <TopBar title={PART_LABEL[ex.part]} onBack={onExit} />
        <div className="mt-6 rounded-3xl bg-white p-6 shadow-sm dark:bg-slate-900">
          <div className="text-xs font-bold uppercase tracking-wide text-emerald-700 dark:text-emerald-400">{PART_LABEL[ex.part]}</div>
          <h1 className="mt-1 text-2xl font-extrabold">{ex.title}</h1>
          <p className="mt-3 text-slate-600 dark:text-slate-300">{ex.instructions}</p>
          <div className="mt-5 rounded-2xl bg-amber-50 p-4 text-sm text-amber-900 dark:bg-amber-900/30 dark:text-amber-100">
            ⏱ Tiempo límite: <b>{Math.round(ex.timeLimitSeconds / 60)} minutos</b>. Al llegar a 00:00 se corrige automáticamente.<br />
            🎯 Antes de elegir, localiza la <b>paráfrasis exacta</b>. Desconfía de las opciones que repiten palabras literales del texto.
          </div>
          <Button className="mt-5" onClick={() => setStarted(true)}>Empezar</Button>
        </div>
      </div>
    );
  }

  const pct = score / ex.questions.length;
  return (
    <div>
      <TopBar title={PART_LABEL[ex.part]} onBack={() => { stopSpeech(); onExit(); }} right={timer} />
      {submitted && (
        <div className="mb-4 animate-pop rounded-3xl bg-white p-5 shadow-sm dark:bg-slate-900">
          <div className="flex items-end justify-between">
            <div>
              <div className="text-sm text-slate-500">Resultado</div>
              <div className="text-4xl font-extrabold">{score}/{ex.questions.length}</div>
            </div>
            <div className="text-right">
              <div className="text-sm text-slate-500">Escala Cambridge (aprox.)</div>
              <div className={`text-3xl font-extrabold ${pctToScale(pct) >= 180 ? 'text-emerald-600' : 'text-coral-500'}`}>{Math.round(pctToScale(pct))}</div>
              <div className="text-xs text-slate-500">{cefrFor(pctToScale(pct))}</div>
            </div>
          </div>
          <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
            {score === ex.questions.length ? 'Perfecto. Repasa igualmente las trampas: así las reconocerás el día del examen.' : 'Los fallos se guardan y volverán en «Repasar fallos». Revisa abajo dónde estaba la paráfrasis y en qué trampa caíste.'}
          </p>
        </div>
      )}
      <div className="mb-4 text-sm text-slate-600 dark:text-slate-400">{!submitted && ex.instructions}</div>
      {children({ answers, setAnswer, submitted, reviewMarks })}
      {!submitted ? (
        <div className="sticky bottom-3 mt-6">
          <Button onClick={submit} disabled={answered === 0}>Corregir ({answered}/{ex.questions.length})</Button>
        </div>
      ) : (
        <>
          <SectionTitle>Detector de trampas</SectionTitle>
          <p className="mb-3 px-1 text-sm text-slate-500">Verde = la frase que justifica la respuesta. Coral = la frase que intenta engañarte. Toca una pregunta para verla sola en el texto.</p>
          <TrapReview ex={ex} answers={answers} focus={focus} onFocus={setFocus} />
          <Button className="mt-6" variant="secondary" onClick={onExit}>Volver</Button>
        </>
      )}
    </div>
  );
}
