import type { Route } from '../lib/router';
import { IconBook, IconCards, IconHeadphones, IconHome, IconPen, IconTarget } from './ui/icons';

const TABS: { route: Route; label: string; Icon: typeof IconHome; match: Route['name'][] }[] = [
  { route: { name: 'home' }, label: 'Hoy', Icon: IconHome, match: ['home'] },
  { route: { name: 'listening' }, label: 'Listening', Icon: IconHeadphones, match: ['listening'] },
  { route: { name: 'reading' }, label: 'Reading', Icon: IconBook, match: ['reading'] },
  { route: { name: 'vocab' }, label: 'Vocab', Icon: IconCards, match: ['vocab'] },
  { route: { name: 'grammar' }, label: 'Grammar', Icon: IconTarget, match: ['grammar'] },
  { route: { name: 'productive' }, label: 'Writing', Icon: IconPen, match: ['productive'] },
];

export default function TabBar({ route, go, unitKind }: { route: Route; go: (r: Route) => void; unitKind?: 'V' | 'G' }) {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-slate-200 bg-white/95 backdrop-blur dark:border-slate-800 dark:bg-slate-950/95" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
      <div className="mx-auto flex max-w-xl">
        {TABS.map(({ route: r, label, Icon, match }) => {
          const on = match.includes(route.name) || (route.name === 'unit' && ((unitKind === 'V' && r.name === 'vocab') || (unitKind === 'G' && r.name === 'grammar')));
          return (
            <button key={label} onClick={() => go(r)} className={`flex flex-1 flex-col items-center gap-0.5 py-2.5 text-[10.5px] font-medium transition ${on ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-500'}`}>
              <Icon className={on ? 'scale-110 transition' : 'transition'} />
              {label}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
