import type { ExamExercise } from '../../types';
import HighlightedText from '../exam/HighlightedText';
import type { ShellContext } from '../exam/ExamShell';
import { Card, SectionTitle } from '../ui';

/** Transcript is hidden while answering (as in the exam) and revealed with marks after correction. */
export function Transcript({ ex, ctx }: { ex: ExamExercise; ctx: ShellContext }) {
  if (!ctx.submitted) return null;
  return (
    <>
      <SectionTitle>Transcripción</SectionTitle>
      <Card><HighlightedText text={ex.textOrTranscript} marks={ctx.reviewMarks} /></Card>
    </>
  );
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
