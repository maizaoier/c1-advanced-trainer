import { useEffect, useRef, useState, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { IconBack, IconX } from './icons';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
const VARIANT: Record<Variant, string> = {
  primary: 'bg-emerald-600 text-white hover:bg-emerald-500 active:bg-emerald-700 shadow-sm shadow-emerald-900/10',
  secondary: 'bg-slate-100 text-slate-900 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700',
  ghost: 'text-emerald-700 hover:bg-emerald-50 dark:text-emerald-400 dark:hover:bg-emerald-950',
  danger: 'text-coral-600 hover:bg-coral-50 dark:hover:bg-coral-900/30',
};

export function Button({ variant = 'primary', className = '', ...rest }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  return (
    <button
      className={`flex w-full items-center justify-center gap-2 rounded-2xl px-5 py-3.5 text-[15.5px] font-semibold transition-all duration-150 active:scale-[.98] disabled:pointer-events-none disabled:opacity-40 ${VARIANT[variant]} ${className}`}
      {...rest}
    />
  );
}

export function Card({ children, className = '', onClick }: { children: ReactNode; className?: string; onClick?: () => void }) {
  const Tag = onClick ? 'button' : 'div';
  return (
    <Tag onClick={onClick} className={`block w-full rounded-3xl border border-slate-200/80 bg-white p-5 text-left shadow-sm transition dark:border-slate-800 dark:bg-slate-900 ${onClick ? 'hover:border-emerald-300 active:scale-[.99] dark:hover:border-emerald-800' : ''} ${className}`}>
      {children}
    </Tag>
  );
}

export function ProgressBar({ value, className = '', color = 'bg-emerald-500' }: { value: number; className?: string; color?: string }) {
  return (
    <div className={`h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800 ${className}`}>
      <div className={`h-full rounded-full ${color} transition-all duration-500`} style={{ width: `${Math.max(0, Math.min(100, value * 100))}%` }} />
    </div>
  );
}

export function Pill({ children, tone = 'slate' }: { children: ReactNode; tone?: 'slate' | 'emerald' | 'coral' | 'amber' | 'indigo' }) {
  const t = {
    slate: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300',
    emerald: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-200',
    coral: 'bg-coral-100 text-coral-600 dark:bg-coral-900/50 dark:text-coral-100',
    amber: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200',
    indigo: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-200',
  }[tone];
  return <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${t}`}>{children}</span>;
}

export function TopBar({ title, onBack, onClose, right }: { title?: ReactNode; onBack?: () => void; onClose?: () => void; right?: ReactNode }) {
  return (
    <div className="sticky top-0 z-20 -mx-4 mb-2 flex items-center gap-3 bg-slate-50/90 px-4 py-3 backdrop-blur dark:bg-[#0b0f17]/90" style={{ paddingTop: 'max(12px, env(safe-area-inset-top))' }}>
      {(onBack || onClose) && (
        <button onClick={onBack ?? onClose} className="grid h-10 w-10 place-items-center rounded-xl bg-white shadow-sm dark:bg-slate-900" aria-label="Volver">
          {onBack ? <IconBack /> : <IconX />}
        </button>
      )}
      <div className="min-w-0 flex-1 truncate text-[17px] font-bold">{title}</div>
      {right}
    </div>
  );
}

export function SectionTitle({ children }: { children: ReactNode }) {
  return <h2 className="mb-2 mt-6 px-1 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">{children}</h2>;
}

export function Sheet({ open, onClose, children }: { open: boolean; onClose: () => void; children: ReactNode }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40" onClick={onClose}>
      <div className="max-h-[90vh] w-full max-w-xl animate-rise overflow-auto rounded-t-3xl bg-slate-50 p-5 dark:bg-[#0b0f17]" style={{ paddingBottom: 'max(24px, env(safe-area-inset-bottom))' }} onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}

/** Countdown that calls onExpire exactly once when it reaches 00:00. */
export function useCountdown(seconds: number, running: boolean, onExpire: () => void): number {
  const [left, setLeft] = useState(seconds);
  const fired = useRef(false);
  const cb = useRef(onExpire);
  useEffect(() => { cb.current = onExpire; }, [onExpire]);
  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setLeft((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(id);
  }, [running]);
  useEffect(() => {
    if (left === 0 && running && !fired.current) { fired.current = true; cb.current(); }
  }, [left, running]);
  return left;
}

/** Elapsed seconds since mount. */
export function useElapsed(): () => number {
  const [start] = useState(() => Date.now());
  return () => Math.round((Date.now() - start) / 1000);
}

let toastTimer: ReturnType<typeof setTimeout> | undefined;
export function toast(msg: string): void {
  let el = document.getElementById('toast');
  if (!el) {
    el = document.createElement('div');
    el.id = 'toast';
    el.className = 'fixed left-1/2 bottom-24 z-[60] -translate-x-1/2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white shadow-lg dark:bg-white dark:text-slate-900';
    document.body.appendChild(el);
  }
  el.textContent = msg;
  el.style.display = 'block';
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { if (el) el.style.display = 'none'; }, 2200);
}
