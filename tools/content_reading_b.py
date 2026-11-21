"""Reading exercises, set B (CAE Parts 5-8)."""
from content_reading import D

READING_B = []

# ─────────────────────────── PART 5 · B ───────────────────────────
R5B = """In Praise of Boredom

For most of human history, boredom was simply part of the furniture of life. Long winter evenings, slow journeys and repetitive work left people with hours in which nothing in particular happened. Today, that emptiness has all but vanished. The moment a queue forms or a train is delayed, a phone appears, and the gap is filled before we have even noticed it was there. It is tempting to see this as an unqualified gain. Why, after all, should anyone want to feel bored?

Psychologists have begun to offer a surprising answer. In a frequently cited experiment, participants were asked to perform a deliberately tedious task, copying numbers from a telephone directory, before being set a test of creative thinking. Compared with a control group who had gone straight to the test, they came up with noticeably more original ideas. The researchers' interpretation was cautious: boredom, they suggested, may not cause creativity so much as clear the ground for it, pushing the mind to wander in search of the stimulation the task has failed to provide.

This idea is not entirely new. Writers and scientists have long reported that their best ideas arrived not at the desk but in the bath, on a walk or while staring out of a window. What is new is the near-total disappearance of such moments. A mind that is never allowed to drift, the argument goes, is a mind that rarely makes the unexpected connections on which original thought depends.

It would be naïve, however, to romanticise boredom. Chronic boredom, the kind experienced by people trapped in monotonous jobs or isolated by circumstance, is associated not with creativity but with depression, risk-taking and poor health. The boredom that seems to be productive is of a particular kind: brief, chosen, and experienced by people who have the freedom to act on whatever ideas it produces. Prescribing more boredom to a factory worker on a twelve-hour shift would be not only useless but insulting.

So what, if anything, should the rest of us do? Some commentators recommend rigid 'digital detox' regimes, but these tend to treat the phone as a kind of addictive substance, to be renounced entirely. A more realistic approach might be to stop treating every empty moment as a problem to be solved. Leaving the phone in a pocket during a ten-minute wait is hardly a heroic act of self-denial. Yet it may be enough to let the mind do something it has been increasingly denied the chance to do: nothing in particular.

Whether this will make anyone more creative is uncertain. The research is still at an early stage, and the effects found in laboratories are often smaller and less reliable in everyday life. But even if the benefits turn out to be modest, there is something to be said for rediscovering a state that our ancestors took for granted, and that we seem to have abolished almost without noticing."""

READING_B.append({
    "id": "R5-B", "part": "R5", "skill": "reading",
    "title": "Part 5 · In Praise of Boredom",
    "instructions": "You are going to read an article about boredom. For questions 1-6, choose the answer (A, B, C or D) which you think fits best according to the text.",
    "timeLimitSeconds": 720,
    "textOrTranscript": R5B,
    "questions": [
        {"id": "q1", "prompt": "In the first paragraph, the writer suggests that modern technology has",
         "options": ["made people less patient than they used to be.", "removed periods of inactivity almost without people realising.", "made daily life more repetitive than in the past.", "created new reasons for people to feel bored."],
         "correctIndex": 1,
         "paraphraseEvidence": "the gap is filled before we have even noticed it was there",
         "paraphraseNote": "'Emptiness has all but vanished… filled before we have even noticed' = inactivity removed almost without realising.",
         "distractorAnalysis": [
             D(0, "Impatience is never mentioned; the queue example is about filling time, not about patience."),
             D(2, "'Repetitive work' describes the PAST, not modern life. Time-shift trap.", "repetitive work"),
             D(3, "Opposite: technology removes boredom; it doesn't create it.")]},
        {"id": "q2", "prompt": "What does the writer say about the researchers' conclusions?",
         "options": ["They were more tentative than the results might suggest.", "They proved that boredom directly increases creativity.", "They were criticised by other psychologists.", "They were based on too small a group of participants."],
         "correctIndex": 0,
         "paraphraseEvidence": "The researchers' interpretation was cautious",
         "paraphraseNote": "'Cautious… may not cause creativity so much as clear the ground for it' = tentative conclusions.",
         "distractorAnalysis": [
             D(1, "Exactly what the researchers AVOID claiming: 'may not cause creativity'.", "boredom, they suggested, may not cause creativity"),
             D(2, "'Frequently cited' ≠ criticised. Invented detail.", "In a frequently cited experiment"),
             D(3, "Sample size is never discussed.")]},
        {"id": "q3", "prompt": "The writer mentions writers and scientists in the third paragraph in order to",
         "options": ["contrast their working habits with those of ordinary people.", "show that an established observation is supported by recent research.", "suggest that creative people are more easily bored.", "argue that creative work should not be done at a desk."],
         "correctIndex": 1,
         "paraphraseEvidence": "This idea is not entirely new",
         "paraphraseNote": "The anecdotes show the idea (wandering mind → ideas) was observed long before the experiment; the research backs it up.",
         "distractorAnalysis": [
             D(0, "No contrast with ordinary people is drawn."),
             D(2, "Reverses cause and effect; nothing says creative people get bored more easily."),
             D(3, "'Not at the desk' describes where ideas arrived — it's not a recommendation.", "not at the desk but in the bath")]},
        {"id": "q4", "prompt": "In the fourth paragraph, the writer stresses that",
         "options": ["boredom is a serious problem for most workers.", "the benefits of boredom depend on the circumstances in which it occurs.", "factory workers are less creative than other people.", "research into boredom has ignored its negative effects."],
         "correctIndex": 1,
         "paraphraseEvidence": "The boredom that seems to be productive is of a particular kind: brief, chosen",
         "paraphraseNote": "Productive boredom must be brief, chosen and with freedom to act = it depends on circumstances.",
         "distractorAnalysis": [
             D(0, "'Most workers' is an over-generalisation; he refers to those 'trapped in monotonous jobs'.", "people trapped in monotonous jobs"),
             D(2, "He says prescribing boredom to them is useless, not that they are less creative.", "Prescribing more boredom to a factory worker"),
             D(3, "No criticism of research is made here.")]},
        {"id": "q5", "prompt": "What is the writer's attitude to 'digital detox' regimes?",
         "options": ["He considers them unnecessarily extreme.", "He believes they are the only effective solution.", "He thinks they are only suitable for heavy phone users.", "He is unsure whether they have been properly tested."],
         "correctIndex": 0,
         "paraphraseEvidence": "these tend to treat the phone as a kind of addictive substance, to be renounced entirely",
         "paraphraseNote": "'Rigid… renounced entirely' vs 'a more realistic approach' = unnecessarily extreme.",
         "distractorAnalysis": [
             D(1, "Opposite: he proposes 'a more realistic approach'.", "A more realistic approach"),
             D(2, "Heavy users are not mentioned."),
             D(3, "Testing applies to boredom research in the last paragraph, not to detox regimes. Wrong paragraph.", "The research is still at an early stage")]},
        {"id": "q6", "prompt": "In the final paragraph, the writer concludes that",
         "options": ["the creative benefits of boredom have been exaggerated.", "laboratory research on boredom is unreliable.", "allowing ourselves some boredom may be worthwhile regardless of the outcome.", "people today are less creative than their ancestors."],
         "correctIndex": 2,
         "paraphraseEvidence": "even if the benefits turn out to be modest, there is something to be said for rediscovering a state",
         "paraphraseNote": "'Even if the benefits are modest… something to be said for' = worthwhile regardless.",
         "distractorAnalysis": [
             D(0, "He says the benefits are 'uncertain', not that they have been exaggerated. Too strong.", "Whether this will make anyone more creative is uncertain"),
             D(1, "Effects are 'often smaller and less reliable' in everyday life — a qualification, not a verdict that research is unreliable.", "the effects found in laboratories are often smaller and less reliable"),
             D(3, "Ancestors are mentioned only for their experience of boredom, not their creativity.", "our ancestors took for granted")]},
    ]
})

# ─────────────────────────── PART 6 · B ───────────────────────────
R6B = """Is remote working good for young professionals?

A  Priya Shah, careers consultant
For graduates starting out, working entirely from home carries a hidden cost. So much of what you learn in your first jobs is absorbed rather than taught: overhearing how a senior colleague handles a difficult client, being pulled into a meeting at the last minute. None of that happens on a video call. I understand why young people value the flexibility, but I would urge them to spend at least part of the week in the office while they are building their reputation.

B  Tom Erikson, technology entrepreneur
The idea that young people can only learn by sitting near their managers strikes me as nostalgic. In my company, junior staff are fully remote and they progress at least as quickly as office-based employees did, largely because we have made mentoring deliberate rather than accidental. The real problem is not distance but lazy management. That said, I accept that some new recruits feel isolated, and we now organise regular in-person gatherings to address this.

C  Hannah Ofori, organisational psychologist
The research paints a mixed picture. Remote workers report higher productivity and lower stress, but they are also less likely to be promoted, particularly early in their careers. Whether that reflects a genuine gap in skills or simply that managers favour the people they see is unclear. What is clear is that the benefits of informal learning in the office, which many commentators take for granted, have rarely been measured properly.

D  James Liu, recent graduate
Everyone talks about what we're missing in the office, but nobody mentions what we gain at home. I save two hours a day on commuting, which I spend on online courses. My manager is careful to give me regular feedback, and I don't feel left behind. I do miss chatting to colleagues, and I'd happily go in occasionally. But being told I need to be in the office five days a week to 'absorb' things feels patronising."""
R6B_OPTS = ["A  Priya Shah", "B  Tom Erikson", "C  Hannah Ofori", "D  James Liu"]
READING_B.append({
    "id": "R6-B", "part": "R6", "skill": "reading",
    "title": "Part 6 · Remote work and young professionals",
    "instructions": "You are going to read four extracts in which people give their views on remote working for young professionals. For questions 1-4, choose from the people A-D. The people may be chosen more than once.",
    "timeLimitSeconds": 600,
    "textOrTranscript": R6B,
    "sharedOptions": R6B_OPTS,
    "questions": [
        {"id": "q1", "prompt": "Which person shares Erikson's view that remote employees can learn effectively if managers make an effort?",
         "options": R6B_OPTS, "correctIndex": 3,
         "paraphraseEvidence": "My manager is careful to give me regular feedback, and I don't feel left behind",
         "paraphraseNote": "Erikson: 'mentoring deliberate rather than accidental'. Liu: his manager's deliberate feedback means he doesn't fall behind.",
         "distractorAnalysis": [
             D(0, "Shah thinks learning is 'absorbed', not taught — the opposite.", "So much of what you learn in your first jobs is absorbed rather than taught"),
             D(2, "Ofori discusses promotion data, not managers' effort.")]},
        {"id": "q2", "prompt": "Which person points out that a widely held belief about learning in the office lacks evidence?",
         "options": R6B_OPTS, "correctIndex": 2,
         "paraphraseEvidence": "which many commentators take for granted, have rarely been measured properly",
         "paraphraseNote": "'Take for granted… rarely been measured' = a widely held belief without evidence.",
         "distractorAnalysis": [
             D(1, "Erikson disagrees with the belief ('nostalgic'), but his support is his own company's experience; he never says it lacks evidence. Same topic, different point.", "strikes me as nostalgic"),
             D(3, "Liu objects to the tone ('patronising'), not to the evidence.")]},
        {"id": "q3", "prompt": "Which person describes a measure taken to reduce a disadvantage of remote working?",
         "options": R6B_OPTS, "correctIndex": 1,
         "paraphraseEvidence": "we now organise regular in-person gatherings to address this",
         "paraphraseNote": "Isolation = disadvantage; regular in-person gatherings = measure to address it.",
         "distractorAnalysis": [
             D(0, "Shah recommends office days, but this is advice, not a measure that was taken.", "I would urge them to spend at least part of the week in the office"),
             D(3, "Liu's manager gives feedback, but Liu doesn't present it as a response to a problem.", "My manager is careful to give me regular feedback")]},
        {"id": "q4", "prompt": "Which person expresses a similar view to Liu about the attitude of those who insist on office attendance?",
         "options": R6B_OPTS, "correctIndex": 1,
         "paraphraseEvidence": "The idea that young people can only learn by sitting near their managers strikes me as nostalgic",
         "paraphraseNote": "Liu: 'feels patronising'. Erikson: 'nostalgic'. Both criticise the attitude behind compulsory office attendance.",
         "distractorAnalysis": [
             D(0, "Shah IS one of those insisting; she doesn't criticise the attitude.", "I would urge them to spend at least part of the week in the office"),
             D(2, "Ofori is neutral and research-based; no criticism of attitudes.")]},
    ]
})

# ─────────────────────────── PART 7 · B ───────────────────────────
R7B = """The Accidental Beekeeper

I never intended to keep bees. Three summers ago, a swarm arrived uninvited in the hollow of an old apple tree at the bottom of my garden, and I assumed the sensible thing would be to call someone to take it away. [GAP 1]

Instead, he stood watching the entrance for a long time, then told me that if I left them alone they would probably do perfectly well. He offered to lend me a hive and some basic equipment, 'just in case you change your mind'. I thanked him politely and fully intended to return everything unused.

[GAP 2] By the end of that first summer I was spending my evenings sitting a few metres from the tree, watching the bees come and go and trying to work out what they were carrying on their legs.

The following spring, a neighbour's beekeeper friend helped me transfer the colony into the borrowed hive. It was not a smooth operation. [GAP 3] For a week I was convinced I had killed the whole colony through my own clumsiness.

They survived, of course, and in doing so taught me the first of many lessons in humility. Bees, it turns out, are considerably more resilient than the people who keep them. [GAP 4]

That is not to say that beekeeping is easy. Colonies are vulnerable to disease, to parasites, and to the kind of wet summer that leaves them unable to forage for weeks. [GAP 5] Each loss felt personal, even though experienced beekeepers assured me that it happens to everyone.

What surprises me most, looking back, is how much the bees have changed the way I see the garden. [GAP 6] Now I find myself noticing which flowers are buzzing and which are silent, and choosing plants not for how they look but for what they offer."""
R7B_PARAS = [
    "A  Half the bees ended up on my sleeves rather than in the hive, and the queen, the one bee that really mattered, was nowhere to be seen.",
    "B  The man who eventually came was a retired beekeeper from the next village, and I expected him to bring a box and remove them within minutes.",
    "C  I lost two colonies in my second year, one to a parasite I had failed to spot and one to a summer of almost constant rain.",
    "D  Most of the mistakes I made in those early months were ones the colony quietly corrected without any help from me.",
    "E  That intention lasted about a fortnight. The bees, it turned out, were far more interesting than anything else in the garden.",
    "F  I used to think of it as a collection of things to be kept tidy: a lawn to be mown, hedges to be trimmed, borders to be weeded.",
    "G  The honey that year was disappointing, both in quantity and in taste.",
]
READING_B.append({
    "id": "R7-B", "part": "R7", "skill": "reading",
    "title": "Part 7 · The Accidental Beekeeper",
    "instructions": "You are going to read an article about beekeeping. Six paragraphs have been removed. Choose from paragraphs A-G the one which fits each gap (1-6). There is one extra paragraph which you do not need to use.",
    "timeLimitSeconds": 720,
    "textOrTranscript": R7B,
    "sharedOptions": R7B_PARAS,
    "questions": [
        {"id": "q1", "prompt": "Gap 1", "options": R7B_PARAS, "correctIndex": 1,
         "paraphraseEvidence": "Instead, he stood watching the entrance for a long time",
         "paraphraseNote": "B introduces 'the man' and the expectation he would 'remove them within minutes'; the next paragraph begins 'Instead, he…'.",
         "distractorAnalysis": [D(4, "E's 'That intention' needs a previous intention — that is returning the equipment, which comes later.")]},
        {"id": "q2", "prompt": "Gap 2", "options": R7B_PARAS, "correctIndex": 4,
         "paraphraseEvidence": "fully intended to return everything unused",
         "paraphraseNote": "'That intention lasted about a fortnight' refers back to intending to return the equipment; 'far more interesting' leads to watching the bees all summer.",
         "distractorAnalysis": [D(3, "D's 'early months' and 'mistakes' need the transfer story first.")]},
        {"id": "q3", "prompt": "Gap 3", "options": R7B_PARAS, "correctIndex": 0,
         "paraphraseEvidence": "It was not a smooth operation",
         "paraphraseNote": "A gives the details of the clumsy transfer; the missing queen explains 'convinced I had killed the whole colony'.",
         "distractorAnalysis": [D(2, "C talks about losing colonies, but in the 'second year' — wrong time.", "For a week I was convinced I had killed the whole colony")]},
        {"id": "q4", "prompt": "Gap 4", "options": R7B_PARAS, "correctIndex": 3,
         "paraphraseEvidence": "Bees, it turns out, are considerably more resilient than the people who keep them",
         "paraphraseNote": "D develops 'resilient': the colony corrected his mistakes without help.",
         "distractorAnalysis": [D(6, "G (honey) is the extra paragraph; nothing in the text refers to honey.")]},
        {"id": "q5", "prompt": "Gap 5", "options": R7B_PARAS, "correctIndex": 2,
         "paraphraseEvidence": "Colonies are vulnerable to disease, to parasites, and to the kind of wet summer",
         "paraphraseNote": "C gives personal examples of exactly these dangers (parasite, constant rain); 'Each loss' refers back to them.",
         "distractorAnalysis": [D(6, "G mentions a bad year but not losses; 'Each loss felt personal' needs C.")]},
        {"id": "q6", "prompt": "Gap 6", "options": R7B_PARAS, "correctIndex": 5,
         "paraphraseEvidence": "how much the bees have changed the way I see the garden",
         "paraphraseNote": "F gives the 'before' view (tidy lawn, hedges); 'Now I find myself…' gives the 'after'.",
         "distractorAnalysis": [D(6, "G is the extra paragraph.")]},
    ]
})

# ─────────────────────────── PART 8 · B ───────────────────────────
R8B = """Four people describe learning a language as an adult

A  Marta – Japanese
I started Japanese at forty, mainly because my daughter was studying it and I wanted to understand what she was talking about. I assumed the writing system would be the hardest part, but I actually found it rather soothing, almost like a puzzle. What I really struggled with was speaking: in Japanese, the level of politeness changes depending on who you are talking to, and I was terrified of offending people. A teacher eventually told me that native speakers forgive almost any mistake from a foreigner who is obviously trying, and that freed me to make the mistakes I needed to make.

B  Daniel – Portuguese
I moved to Lisbon for work and expected to pick the language up naturally. I didn't. Everyone at the office spoke English, and after a year I could barely order a coffee. What changed things was joining an amateur football team where nobody spoke English at all. It was humiliating at first; I spent whole matches not understanding instructions. But within six months I was following conversations, and I picked up a lot of slang that no textbook would ever teach you.

C  Fatima – German
I studied German at school decades ago and remembered almost nothing, so I decided to approach it completely differently this time. Instead of grammar exercises, I watched German television series with German subtitles, pausing constantly to look things up. My progress was slow but steady, and I found I remembered words much better when I had heard them in a dramatic scene. My one regret is that I neglected writing; I can follow a complicated conversation, but I still struggle to write a simple email without errors.

D  Kenji – Spanish
I'd always told myself I had no talent for languages, which turned out to be a convenient excuse. When I finally started Spanish, I set myself a strict routine: twenty minutes every morning before work, no exceptions. Some days it felt pointless; I couldn't see any progress at all. But after about eight months something seemed to click, and I suddenly understood far more than I expected. What kept me going through the dull periods was a friend in Mexico whom I spoke to every Sunday."""
R8B_OPTS = ["A  Marta", "B  Daniel", "C  Fatima", "D  Kenji"]
R8B_Q = [
    ("Which person was surprised to find that an aspect of the language they expected to be difficult was enjoyable?", 0, "I assumed the writing system would be the hardest part, but I actually found it rather soothing", "Expected hard → 'rather soothing, almost like a puzzle'.", [D(3, "Kenji's surprise is sudden understanding, not enjoying something he expected to be hard.", "something seemed to click")]),
    ("Which person mentions a lack of balance between different language skills?", 2, "I can follow a complicated conversation, but I still struggle to write a simple email", "Listening strong, writing weak = imbalance.", [D(0, "Marta contrasts writing and speaking difficulty, but this is about what was hard, not an imbalance in her current skills.")]),
    ("Which person was initially prevented from learning by the environment they were in?", 1, "Everyone at the office spoke English, and after a year I could barely order a coffee", "An English-speaking office stopped him learning.", []),
    ("Which person admits they had been using a belief to avoid learning?", 3, "I'd always told myself I had no talent for languages, which turned out to be a convenient excuse", "'Convenient excuse' = belief used to avoid learning.", []),
    ("Which person was helped by advice that reduced their anxiety?", 0, "that freed me to make the mistakes I needed to make", "The teacher's comment removed her fear of offending people.", [D(3, "Kenji's friend motivated him, but there's no anxiety or advice involved.")]),
    ("Which person learnt informal language they would not have found in books?", 1, "I picked up a lot of slang that no textbook would ever teach you", "Slang = informal language not in books.", []),
    ("Which person chose a different method from the one they had used before?", 2, "I decided to approach it completely differently this time", "School grammar → TV series.", [D(3, "Kenji had never really started before, so there's no previous method.")]),
    ("Which person kept going thanks to regular contact with someone abroad?", 3, "What kept me going through the dull periods was a friend in Mexico whom I spoke to every Sunday", "Weekly calls with a friend in Mexico.", [D(0, "Marta's daughter was her reason to START, not what kept her going; and she isn't abroad.", "my daughter was studying it")]),
    ("Which person found that emotional context helped them remember vocabulary?", 2, "I remembered words much better when I had heard them in a dramatic scene", "'Dramatic scene' = emotional context.", []),
    ("Which person experienced a period when progress seemed impossible to see?", 3, "Some days it felt pointless; I couldn't see any progress at all", "Explicit.", [D(2, "Fatima's progress was 'slow but steady' — always visible.", "My progress was slow but steady")]),
]
READING_B.append({
    "id": "R8-B", "part": "R8", "skill": "reading",
    "title": "Part 8 · Learning a language as an adult",
    "instructions": "You are going to read four people describing learning a language as an adult. For questions 1-10, choose from the people (A-D). The people may be chosen more than once.",
    "timeLimitSeconds": 720,
    "textOrTranscript": R8B,
    "sharedOptions": R8B_OPTS,
    "questions": [
        {"id": f"q{i+1}", "prompt": p, "options": R8B_OPTS, "correctIndex": c, "paraphraseEvidence": e, "paraphraseNote": n, "distractorAnalysis": d}
        for i, (p, c, e, n, d) in enumerate(R8B_Q)
    ]
})
