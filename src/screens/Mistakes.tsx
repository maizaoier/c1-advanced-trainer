import { useMemo, useRef, useState } from 'react';
import { EXERCISE_BY_ID } from '../lib/content';
import { dueMistakes, gradeMistake, mistakeKey, useProgress } from '../lib/store';
import { correctLabel, isCorrect, isOpen, marksFor, paragraphWith, type AnswerValue } from '../lib/exam';
import { speak } from '../lib/tts';
import HighlightedText from '../components/exam/HighlightedText';
import QuestionMCQ from '../components/exam/QuestionMCQ';
import TrapReview from '../components/exam/TrapReview';
import { Button, Card, TopBar } from '../components/ui';
import { IconSpeaker } from '../components/ui/icons';

/** Spaced repetition of every Reading/Listening question the user got wrong. */
export default function Mistakes({ onExit }: { onExit: () => void }) {
  const p = useProgress();
  const [queue] = useState(() => dueMistakes(p).map((m) => mistakeKey(m.exerciseId, m.questionId)));
  const [i, setI] = useState(0);
  const [answer, setAnswer] = useState<AnswerValue>();
  const [checked, setChecked] = useState(false);
  const lock = useRef(false);
  const total = Object.keys(p.mistakes).length;

  const key = queue[i];
  const item = useMemo(() => {
    if (!key) return null;
    const [exId, qId] = key.split('::');
    const ex = EXERCISE_BY_ID[exId];
    const q = ex?.questions.find((x) => x.id === qId);
    return ex && q ? { ex, q } : null;
  }, [key]);

  if (!item) {
    return (
      <div>
        <TopBar title="Repasar fallos" onBack={onExit} />
        <div className="mt-16 text-center">
          <div className="text-6xl">🎯</div>
          <h2 className="mt-3 text-xl font-bold">{i > 0 ? '¡Repaso completado!' : 'Nada que repasar ahora'}</h2>
          <p className="mx-auto mt-2 max-w-sm text-slate-500">
            {total ? `Tienes ${total} fallos en seguimiento; volverán cuando toque según la repetición espaciada.` : 'Cada pregunta de Reading o Listening que falles aparecerá aquí para que no vuelvas a caer en la misma trampa.'}
          </p>
          <Button className="mt-6" variant="secondary" onClick={onExit}>Volver</Button>
        </div>
      </div>
    );
  }
  const { ex, q } = item;
  const context = paragraphWith(ex.textOrTranscript, q.paraphraseEvidence);
  const check = () => {
    if (lock.current) return;
    lock.current = true;
    setChecked(true);
    gradeMistake(key, isCorrect(q, answer));
  };
  const next = () => { lock.current = false; setChecked(false); setAnswer(undefined); setI((n) => n + 1); };

  return (
    <div>
      <TopBar title={`Fallo ${i + 1} de ${queue.length}`} onClose={onExit} />
      <div className="mb-3 text-xs font-bold uppercase tracking-wide text-emerald-700 dark:text-emerald-400">{ex.title}</div>
      {ex.skill === 'listening' ? (
        <Card className="mb-4">
          <Button variant="secondary" onClick={() => { const line = ex.script?.find((l) => context.includes(l.text.slice(0, 40))); speak(line?.text ?? context, p.settings.speechRate, line?.voice); }}>
            <IconSpeaker /> Escuchar el fragmento
          </Button>
          {checked && <div className="mt-4"><HighlightedText text={context} marks={marksFor([q])} /></div>}
        </Card>
      ) : (
        <Card className="mb-4"><HighlightedText text={context} marks={checked ? marksFor([q]) : undefined} markable={!checked} /></Card>
      )}
      {isOpen(q) ? (
        <div>
          <div className="mb-2 font-medium">{q.prompt}</div>
          <input value={(answer as string) ?? ''} disabled={checked} onChange={(e) => setAnswer(e.target.value)} autoCapitalize="off" className="w-full rounded-2xl border-2 border-slate-200 bg-white px-4 py-3 outline-none focus:border-emerald-500 dark:border-slate-700 dark:bg-slate-900" placeholder="Tu respuesta" />
          {checked && <div className="mt-2 text-sm">Respuesta: <b>{correctLabel(ex, q)}</b></div>}
        </div>
      ) : (
        <QuestionMCQ ex={ex} q={q} number={ex.questions.indexOf(q) + 1} value={answer} onChange={setAnswer} submitted={checked} />
      )}
      {!checked ? (
        <Button className="mt-5" onClick={check} disabled={answer === undefined || answer === ''}>Comprobar</Button>
      ) : (
        <>
          <div className="mt-4"><TrapReview ex={{ ...ex, questions: [q] }} answers={{ [q.id]: answer }} onFocus={() => undefined} /></div>
          <Button className="mt-4" onClick={next}>Siguiente</Button>
        </>
      )}
    </div>
  );
}
