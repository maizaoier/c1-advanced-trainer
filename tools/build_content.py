import json,sys,re
sys.path.insert(0,'tools')
from content_listening import LISTENING
from content_reading import READING
from content_reading_b import READING_B
READING=READING+READING_B
errs=[]
for ex in LISTENING:
    ex['textOrTranscript']='\n\n'.join(f"{l['speaker']}: {l['text']}" for l in ex['script'])
for ex in LISTENING+READING:
    t=ex['textOrTranscript']
    for q in ex['questions']:
        if q['paraphraseEvidence'] not in t: errs.append((ex['id'],q['id'],'EVID',q['paraphraseEvidence']))
        for d in q['distractorAnalysis']:
            if d.get('trapQuote') and d['trapQuote'] not in t: errs.append((ex['id'],q['id'],'TRAP',d['trapQuote']))
            if q['options'] and not (0<=d['optionIndex']<len(q['options'])) : errs.append((ex['id'],q['id'],'IDX'))
            if q['options'] and d['optionIndex']==q['correctIndex']: errs.append((ex['id'],q['id'],'DISTRACTOR=CORRECT'))
for e in errs: print(e)
json.dump(LISTENING+READING,open('src/data/exam.json','w'),ensure_ascii=False,indent=1)
P=json.load(open('tools/prompts_source.json'))
P['writing']={k:{'type':v['t'],'prompt':v['p']} for k,v in P['writing'].items()}
P['speakingCAE']={
 'part1':["What do you enjoy most about the place where you live?","How do you usually spend your free time during the week?","Is there a skill you'd like to learn in the next few years? Why?","How important is technology in your daily routine?","What kind of music do you listen to when you need to concentrate?"],
 'part2':[{"task":"Compare two of these situations: people studying alone in a library / in a group at a café / online at home. Why might they have chosen this way of studying? How effective might it be?"},
          {"task":"Compare two of these situations: a family cooking together / a chef in a busy restaurant / someone eating alone at their desk. What might the people be feeling? How important is food to them in this moment?"},
          {"task":"Compare two of these situations: a runner finishing a race / a musician performing on stage / a student receiving exam results. Why might these moments be important to them? How might they feel afterwards?"}],
 'part3':[{"question":"How can cities be made better places to live?","prompts":["public transport","green spaces","housing costs","noise","community activities"]},
          {"question":"What are the benefits of learning a foreign language as an adult?","prompts":["career","travel","memory","culture","making friends"]}],
 'part4':["Do you think people today have too many choices? Why?","Should governments limit the amount of time children spend online?","Is it better to be good at many things or excellent at one?","How has the way people work changed in recent years?"]}
json.dump(P,open('src/data/prompts.json','w'),ensure_ascii=False)
import content_grammar, content_podcasts
json.dump(content_grammar.GRAMMAR,open('src/data/grammar.json','w'),ensure_ascii=False)
json.dump({'podcasts':content_podcasts.PODCASTS,'questions':content_podcasts.QUESTIONS},open('src/data/podcasts.json','w'),ensure_ascii=False)
print('exercises',len(LISTENING+READING),'questions',sum(len(e['questions']) for e in LISTENING+READING),'errors',len(errs))
