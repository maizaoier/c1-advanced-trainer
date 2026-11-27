import type { Route } from '../lib/router';
import { IconCards, IconHome } from './ui/icons';

export default function TabBar({ route, go }: { route: Route; go: (r: Route) => void }) {
  const tabs = [
    { r: { name: 'home' } as Route, label: 'Hoy', Icon: IconHome, on: route.name === 'home' },
    { r: { name: 'units' } as Route, label: 'Unidades', Icon: IconCards, on: route.name === 'units' || route.name === 'unit' },
  ];
  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-slate-200 bg-white/95 backdrop-blur dark:border-slate-800 dark:bg-slate-950/95" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
      <div className="mx-auto flex max-w-xl">
        {tabs.map(({ r, label, Icon, on }) => (
          <button key={label} onClick={() => go(r)} className={`flex flex-1 flex-col items-center gap-0.5 py-2.5 text-xs font-medium transition ${on ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-500'}`}>
            <Icon className={on ? 'scale-110 transition' : 'transition'} />
            {label}
          </button>
        ))}
      </div>
    </nav>
  );
}
