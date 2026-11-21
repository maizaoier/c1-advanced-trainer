import { useEffect, useState } from 'react';
import type { Track } from './content';

/** Hash routes so the Android back button and browser history work: #listening, #exercise/L1-A … */
export type Route =
  | { name: 'home' } | { name: 'listening' } | { name: 'reading' } | { name: 'vocab' } | { name: 'grammar' }
  | { name: 'study'; track: Track; unit?: string }
  | { name: 'exercise'; id: string } | { name: 'mistakes' } | { name: 'productive' } | { name: 'unit'; id: string };

export function parseHash(h: string): Route {
  const [name, a, b] = h.replace(/^#\/?/, '').split('/');
  switch (name) {
    case 'listening': case 'reading': case 'mistakes': case 'productive': case 'vocab': case 'grammar': return { name };
    case 'study': return { name: 'study', track: a === 'grammar' ? 'grammar' : 'vocab', unit: b || undefined };
    case 'exercise': return a ? { name: 'exercise', id: a } : { name: 'home' };
    case 'unit': return a ? { name: 'unit', id: a } : { name: 'vocab' };
    default: return { name: 'home' };
  }
}
export function toHash(r: Route): string {
  if (r.name === 'home') return '#';
  if (r.name === 'exercise' || r.name === 'unit') return `#${r.name}/${r.id}`;
  if (r.name === 'study') return `#study/${r.track}${r.unit ? `/${r.unit}` : ''}`;
  return `#${r.name}`;
}

export function useRoute(): [Route, (r: Route) => void, () => void] {
  const [route, setRoute] = useState<Route>(() => parseHash(location.hash));
  useEffect(() => {
    const on = () => { setRoute(parseHash(location.hash)); window.scrollTo(0, 0); };
    window.addEventListener('hashchange', on);
    return () => window.removeEventListener('hashchange', on);
  }, []);
  const go = (r: Route) => { location.hash = toHash(r); };
  const back = () => { if (history.length > 1) history.back(); else go({ name: 'home' }); };
  return [route, go, back];
}
