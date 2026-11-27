"""Marks the 'essential' vocabulary (core: true) for a shorter study plan.

Criteria:
- Words: drop very common English words (wordfreq zipf >= 4.5) that a B2+/C1 learner already knows,
  EXCEPT those whose Destination meaning is a less usual sense (fire = dismiss, sound = healthy…),
  plus a hand-checked list of easy words below that threshold.
- Collocation lists and word-family lists are dropped (they are lists, poor as flashcards, and
  Use of English is already the strongest skill). The 54 Part 3 word-formation exercises stay.
- All phrasal verbs and idioms stay.
"""
import json
from wordfreq import zipf_frequency as z

KEEP_COMMON = {  # common words, but the C1 meaning is the less usual one
    'fire', 'sound', 'bear', 'firm', 'content', 'cross', 'novel', 'minute', 'lines', 'appeal', 'prime', 'subject',
    'handle', 'strike', 'joint', 'faith', 'long-standing', 'first-rate', 'built-up', 'high-rise', 'down payment',
    'industrial action', 'master', 'command', 'block', 'spoil', 'leave', 'stuff', 'last',
}
EASY = {  # below the threshold but clearly known at this level
    'decade', 'client', 'citizen', 'airline', 'hurricane', 'vaccine', 'behaviour', 'lifestyle', 'destination', 'intelligent',
    'technique', 'divorce', 'academic', 'permanent', 'temporary', 'promotion', 'charity', 'passion', 'ideal', 'liquid',
    'lifetime', 'natural disaster', 'global warming', 'agriculture', '(games) console', 'consumer electronics', 'lyrics',
    'trailer', 'punch', 'auction', 'terror', 'chaos', 'diagnosis', 'installation', 'lecture', 'curriculum', 'mineral',
    'equation', 'transparent', 'immigrant', 'immigration', 'consequence', 'uncertainty', 'efficient', 'innovation',
    'innovative', 'random', 'external', 'contemporary', 'institution', 'inspiration', 'comfort', 'confirm', 'frequency',
    'flood', 'manual', 'praise', 'intellectual', 'pension', 'cargo', 'duration', 'consultant', 'addiction', 'transform',
    'evaluate', 'magnitude', 'dimension', 'dynamic', 'optimistic', 'pessimistic', 'programmer', 'upload', 'offline',
    'broadband', 'colleague', 'tutorial', 'seminar', 'graduate', 'intelligent', 'jet lag', 'pedestrian', 'commute',
}

def freq(term: str) -> float:
    parts = [x for x in term.lower().replace('(games) ', '').split('/')[0].split() if x]
    return min(z(x, 'en') for x in parts)

def essential(c: dict) -> bool:
    t = c['type']
    if t in ('pv', 'id', 'wx'):
        return True
    if t in ('co', 'wf'):
        return False
    term = c['term'].lower()
    if term in KEEP_COMMON:
        return True
    if term in EASY:
        return False
    return freq(term) < 4.5

if __name__ == '__main__':
    path = 'src/data/destination.json'
    d = json.load(open(path))
    for c in d['cards']:
        c['core'] = essential(c)
    json.dump(d, open(path, 'w'), ensure_ascii=False)
    from collections import Counter
    print('essential:', sum(c['core'] for c in d['cards']), 'of', len(d['cards']),
          Counter(c['type'] for c in d['cards'] if c['core']))
