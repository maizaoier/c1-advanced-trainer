import { useEffect } from 'react';
import { useRoute, type Route } from './lib/router';
import { useProgress } from './lib/store';
import { EXERCISE_BY_ID } from './lib/content';
import type { ExamExercise } from './types';
import TabBar from './components/TabBar';
import Home from './screens/Home';
import ExerciseHub from './screens/ExerciseHub';
import Mistakes from './screens/Mistakes';
import Study from './screens/Study';
import Productive from './screens/Productive';
import { Library, UnitView } from './screens/Library';
import ListeningPart1 from './components/parts/ListeningPart1';
import ListeningPart2 from './components/parts/ListeningPart2';
import ListeningPart3 from './components/parts/ListeningPart3';
import ListeningPart4 from './components/parts/ListeningPart4';
import ReadingPart5 from './components/parts/ReadingPart5';
import ReadingPart6 from './components/parts/ReadingPart6';
import ReadingPart7 from './components/parts/ReadingPart7';
import ReadingPart8 from './components/parts/ReadingPart8';

const PART_COMPONENT: Record<ExamExercise['part'], (p: { ex: ExamExercise; onExit: () => void }) => React.ReactNode> = {
  L1: ListeningPart1, L2: ListeningPart2, L3: ListeningPart3, L4: ListeningPart4,
  R5: ReadingPart5, R6: ReadingPart6, R7: ReadingPart7, R8: ReadingPart8,
};

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
  const home = () => go({ name: 'home' });
  const tabs: Route['name'][] = ['home', 'listening', 'reading', 'library', 'unit', 'productive'];

  let screen: React.ReactNode;
  switch (route.name) {
    case 'home': screen = <Home go={go} />; break;
    case 'listening': screen = <ExerciseHub skill="listening" go={go} />; break;
    case 'reading': screen = <ExerciseHub skill="reading" go={go} />; break;
    case 'exercise': {
      const ex = EXERCISE_BY_ID[route.id];
      const Part = ex ? PART_COMPONENT[ex.part] : undefined;
      // key forces a fresh state when opening another exercise
      screen = ex && Part ? <Part key={ex.id} ex={ex} onExit={back} /> : <Home go={go} />;
      break;
    }
    case 'mistakes': screen = <Mistakes onExit={home} />; break;
    case 'study': screen = <Study key={route.unit ?? 'all'} unit={route.unit} onExit={back} />; break;
    case 'library': screen = <Library go={go} />; break;
    case 'unit': screen = <UnitView id={route.id} go={go} onBack={back} />; break;
    case 'productive': screen = <Productive />; break;
  }
  const showTabs = tabs.includes(route.name);
  return (
    <div className={`mx-auto min-h-screen max-w-xl px-4 ${showTabs ? 'pb-28' : 'pb-10'}`}>
      {screen}
      {showTabs && <TabBar route={route} go={go} />}
    </div>
  );
}
