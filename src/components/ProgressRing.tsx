export default function ProgressRing({ value, size = 112 }: { value: number; size?: number }) {
  const r = 42, c = 2 * Math.PI * r;
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} className="-rotate-90">
      <circle cx="50" cy="50" r={r} fill="none" strokeWidth="10" className="stroke-slate-100 dark:stroke-slate-800" />
      <circle cx="50" cy="50" r={r} fill="none" strokeWidth="10" strokeLinecap="round" className="stroke-emerald-500 transition-all duration-700"
        strokeDasharray={c} strokeDashoffset={c * (1 - Math.max(0, Math.min(1, value)))} />
    </svg>
  );
}
