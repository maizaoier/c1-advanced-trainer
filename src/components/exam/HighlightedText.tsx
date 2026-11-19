import { useState } from 'react';
import { segment, splitSentences, type Mark } from '../../lib/text';

interface Props {
  text: string;
  /** evidence/trap marks shown in review mode */
  marks?: Mark[];
  /** allow tapping sentences to highlight them while solving */
  markable?: boolean;
  /** render [GAP n] placeholders with this function */
  renderGap?: (n: number) => React.ReactNode;
  className?: string;
}

/**
 * Exam text renderer. While solving, the user can tap sentences to highlight them (like underlining
 * on paper). In review mode, the exact paraphrase evidence is green and trap quotes are coral.
 */
export default function HighlightedText({ text, marks, markable, renderGap, className = '' }: Props) {
  const [userMarks, setUserMarks] = useState<Set<string>>(new Set());
  const paragraphs = text.split(/\n\s*\n/);
  const toggle = (k: string) =>
    setUserMarks((s) => { const n = new Set(s); if (n.has(k)) n.delete(k); else n.add(k); return n; });

  const renderInline = (p: string, pi: number) => {
    // split out gaps first
    const parts = renderGap ? p.split(/(\[GAP \d+\])/) : [p];
    return parts.map((part, gi) => {
      const g = part.match(/^\[GAP (\d+)\]$/);
      if (g && renderGap) return <span key={gi}>{renderGap(Number(g[1]))}</span>;
      if (marks && marks.length) {
        return segment(part, marks).map((s, si) => (
          <span key={`${gi}-${si}`} className={s.kind === 'evidence' ? 'ev' : s.kind === 'trap' ? 'trap' : undefined}>{s.text}</span>
        ));
      }
      if (markable) {
        return splitSentences(part).map((s, si) => {
          const k = `${pi}-${gi}-${si}`;
          return (
            <span key={k} onClick={() => toggle(k)} className={`cursor-pointer transition-colors ${userMarks.has(k) ? 'user-mark' : ''}`}>{s}</span>
          );
        });
      }
      return <span key={gi}>{part}</span>;
    });
  };

  return (
    <div className={`reading space-y-4 ${className}`}>
      {paragraphs.map((p, pi) => {
        const heading = pi === 0 && !p.includes('.') && p.length < 90;
        const speaker = p.match(/^([A-Z][\w ]{0,20}):\s/);
        if (heading) return <h3 key={pi} className="text-xl font-bold text-slate-900 dark:text-white">{p}</h3>;
        if (/^[A-D]\s{2}/.test(p)) {
          const [first, ...rest] = p.split('\n');
          return (
            <div key={pi}>
              <div className="mb-1 font-bold text-slate-900 dark:text-white">{first}</div>
              <p>{renderInline(rest.join(' '), pi)}</p>
            </div>
          );
        }
        if (speaker) {
          return (
            <p key={pi}>
              <span className="mr-1 font-semibold text-emerald-700 dark:text-emerald-400">{speaker[1]}:</span>
              {renderInline(p.slice(speaker[0].length), pi)}
            </p>
          );
        }
        return <p key={pi}>{renderInline(p, pi)}</p>;
      })}
    </div>
  );
}
