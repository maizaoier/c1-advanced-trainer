import destJson from '../data/destination.json';
import type { DestinationData, StudyCard, StudyUnit } from '../types';

const dest = destJson as unknown as DestinationData;
export const UNITS: StudyUnit[] = dest.units;
export const UNIT_BY_ID: Record<string, StudyUnit> = Object.fromEntries(UNITS.map((u) => [u.id, u]));
export const CARDS: Record<string, StudyCard> = Object.fromEntries(dest.cards.map((c) => [c.id, c]));
export const CARD_ORDER: string[] = UNITS.flatMap((u) => u.cards);

export const TYPE_LABEL: Record<string, string> = {
  w: 'Vocabulary', pv: 'Phrasal verb', id: 'Idiom', co: 'Collocations', wf: 'Word formation', wx: 'Word formation · Part 3',
};
export const TYPE_ES: Record<string, string> = {
  w: 'Palabras', pv: 'Phrasal verbs', id: 'Idioms', co: 'Colocaciones', wf: 'Familias de palabras', wx: 'Word formation (Part 3)',
};
