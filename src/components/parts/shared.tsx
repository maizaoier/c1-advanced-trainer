import type { ExamExercise, ExamQuestion } from '../../types';
import HighlightedText from '../exam/HighlightedText';
import QuestionMCQ from '../exam/QuestionMCQ';
import type { ShellContext } from '../exam/ExamShell';
import { Card } from '../ui';

export function TextCard({ ex, ctx, renderGap }: { ex: ExamExercise; ctx: ShellContext; renderGap?: (n: number) => React.ReactNode }) {
  return <Card><HighlightedText text={ex.textOrTranscript} markable={!ctx.submitted} marks={ctx.reviewMarks} renderGap={renderGap} /></Card>;
}

export function Mcq({ ex, q, i, ctx, compact }: { ex: ExamExercise; q: ExamQuestion; i: number; ctx: ShellContext; compact?: boolean }) {
  return <QuestionMCQ ex={ex} q={q} number={i + 1} value={ctx.answers[q.id]} onChange={(v) => ctx.setAnswer(q.id, v)} submitted={ctx.submitted} compact={compact} />;
}

export function OptionList({ options, title }: { options: string[]; title?: string }) {
  return (
    <Card className="!p-4">
      {title && <div className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-500">{title}</div>}
      <ul className="space-y-1.5 text-[14.5px]">
        {options.map((o) => (
          <li key={o} className="flex gap-2"><b className="w-4 flex-none">{o.slice(0, 1)}</b><span>{o.slice(3)}</span></li>
        ))}
      </ul>
    </Card>
  );
}

export const TranscriptCard = ({ ex, ctx }: { ex: ExamExercise; ctx: ShellContext }) => (
  <Card><HighlightedText text={ex.textOrTranscript} marks={ctx.reviewMarks} /></Card>
);
