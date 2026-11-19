import { useEffect, useState } from 'react';

/** Hash routes so the Android back button and browser history work: #listening, #exercise/L1-A … */
export type Route =
  | { name: 'home' } | { name: 'listening' } | { name: 'reading' } | { name: 'study'; unit?: string }
  | { name: 'exercise'; id: string } | { name: 'mistakes' } | { name: 'productive' } | { name: 'library' } | { name: 'unit'; id: string };

export function parseHash(h: string): Route {
  const [name, arg] = h.replace(/^#\/?/, '').split('/');
  switch (name) {
    case 'listening': case 'reading': case 'mistakes': case 'productive': case 'library': return { name };
    case 'study': return { name: 'study', unit: arg || undefined };
    case 'exercise': return arg ? { name: 'exercise', id: arg } : { name: 'home' };
    case 'unit': return arg ? { name: 'unit', id: arg } : { name: 'library' };
    default: return { name: 'home' };
  }
}
export function toHash(r: Route): string {
  if (r.name === 'home') return '#';
  if (r.name === 'exercise' || r.name === 'unit') return `#${r.name}/${r.id}`;
  if (r.name === 'study') return r.unit ? `#study/${r.unit}` : '#study';
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
