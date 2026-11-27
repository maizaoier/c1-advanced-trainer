import { useEffect, useState } from 'react';

/** Hash routes so the Android back button and browser history work: #units, #unit/u4, #study/u4 */
export type Route = { name: 'home' } | { name: 'units' } | { name: 'unit'; id: string } | { name: 'study'; unit?: string };

export function parseHash(h: string): Route {
  const [name, a] = h.replace(/^#\/?/, '').split('/');
  if (name === 'units') return { name: 'units' };
  if (name === 'unit' && a) return { name: 'unit', id: a };
  if (name === 'study') return { name: 'study', unit: a || undefined };
  return { name: 'home' };
}
export function toHash(r: Route): string {
  if (r.name === 'unit') return `#unit/${r.id}`;
  if (r.name === 'study') return r.unit ? `#study/${r.unit}` : '#study';
  return r.name === 'home' ? '#' : `#${r.name}`;
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
