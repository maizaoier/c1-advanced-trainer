import { useEffect } from 'react';
import { useRoute } from './lib/router';
import { useProgress } from './lib/store';
import TabBar from './components/TabBar';
import Home from './screens/Home';
import Study from './screens/Study';
import { Units, UnitView } from './screens/Units';

function useTheme(mode: 'system' | 'light' | 'dark') {
  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const apply = () => document.documentElement.classList.toggle('dark', mode === 'dark' || (mode === 'system' && mq.matches));
    apply();
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, [mode]);
}

export default function App() {
  const [route, go, back] = useRoute();
  const p = useProgress();
  useTheme(p.settings.darkMode);

  let screen: React.ReactNode;
  switch (route.name) {
    case 'home': screen = <Home go={go} />; break;
    case 'units': screen = <Units go={go} />; break;
    case 'unit': screen = <UnitView id={route.id} go={go} onBack={back} />; break;
    case 'study': screen = <Study key={route.unit ?? 'daily'} unit={route.unit} onExit={back} />; break;
  }
  const showTabs = route.name !== 'study';
  return (
    <div className={`mx-auto min-h-screen max-w-xl px-4 ${showTabs ? 'pb-28' : 'pb-10'}`}>
      {screen}
      {showTabs && <TabBar route={route} go={go} />}
    </div>
  );
}
