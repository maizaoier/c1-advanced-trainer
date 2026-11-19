"""Reading exercises (CAE Parts 5-8)."""

def D(i, reason, quote=None):
    d = {"optionIndex": i, "reason": reason}
    if quote:
        d["trapQuote"] = quote
    return d

READING = []

# ─────────────────────────── PART 5 ───────────────────────────
R5_TEXT = """The Myth of the Lone Genius

We like our breakthroughs to come with a face attached. Newton under his apple tree, Edison in his laboratory at three in the morning, a young programmer in a garage: these images are so familiar that they have hardened into a kind of folk theory of creativity. According to this theory, transformative ideas spring from the minds of exceptional individuals working, ideally, against the scepticism of everyone around them. It is a flattering story, both for the geniuses and for the rest of us, who can enjoy their achievements without wondering why we never produce anything similar.

The trouble is that the historical record stubbornly refuses to cooperate. When historians of science look closely at almost any celebrated discovery, they find not a solitary flash of insight but a crowded room. Calculus was developed independently by Newton and Leibniz within a few years of each other; the telephone patent was filed by Alexander Graham Bell on the very day that Elisha Gray submitted a similar design. Such cases are not curiosities. Sociologists have catalogued hundreds of them, and some have gone so far as to argue that 'multiple discovery' is the norm rather than the exception: once the necessary knowledge and tools are in place, an idea is, in a sense, waiting to be found.

This does not mean that individuals are irrelevant. It would be absurd to claim that anyone could have written Hamlet, given the state of English drama in 1600. But it does suggest that we have been asking the wrong question. Instead of 'What made this person a genius?', we might more usefully ask 'What made this environment so fertile?' The answer, more often than not, involves dense networks of people exchanging ideas, competing, borrowing and occasionally stealing from one another.

Consider Renaissance Florence, a city of perhaps 60,000 people that produced, within a couple of generations, a disproportionate share of the most admired art in European history. It is tempting to attribute this to an unusual concentration of talent, as if Florentine mothers had simply given birth to more gifted children. A more plausible explanation lies in the city's peculiar combination of wealthy patrons, fierce rivalry between workshops, and an apprenticeship system that allowed techniques to circulate rapidly. Talent, in other words, was not so much born as manufactured.

None of this has stopped the lone-genius narrative from flourishing, and it is worth asking why. Part of the explanation is simply that stories need protagonists; a biography of a network is a hard book to sell. But there is also something more troubling at work. Organisations that subscribe to the myth tend to reward individual stars at the expense of the collaborative structures that actually generate innovation. Companies poach celebrated researchers at enormous cost, only to discover that their brilliance does not travel well once they are separated from the colleagues and resources that sustained it.

If there is a lesson here, it is not that we should stop admiring remarkable people. It is that admiration, on its own, is a poor guide to policy. Those who want more creativity—in a school, a company or a country—would do better to invest in the unglamorous conditions that make it possible: places where people can meet, time to experiment, and tolerance of the failures that inevitably precede success. The garage, after all, was rarely as empty as the legend suggests."""

READING.append({
    "id": "R5-A", "part": "R5", "skill": "reading",
    "title": "Part 5 · The Myth of the Lone Genius",
    "instructions": "You are going to read an article about creativity. For questions 1-6, choose the answer (A, B, C or D) which you think fits best according to the text.",
    "timeLimitSeconds": 720,
    "textOrTranscript": R5_TEXT,
    "questions": [
        {"id": "q1", "prompt": "In the first paragraph, the writer suggests that the 'folk theory of creativity' is popular partly because",
         "options": ["it is supported by well-documented historical examples.", "it excuses ordinary people from comparing themselves to great achievers.", "it encourages people to challenge accepted opinions.", "it gives credit to those who work extremely long hours."],
         "correctIndex": 1,
         "paraphraseEvidence": "who can enjoy their achievements without wondering why we never produce anything similar",
         "paraphraseNote": "'Flattering… for the rest of us' + 'without wondering why we never produce anything similar' = it excuses us from comparing ourselves.",
         "distractorAnalysis": [
             D(0, "The writer says the opposite in paragraph 2: the record 'refuses to cooperate'. The examples are images, not evidence.", "these images are so familiar"),
             D(2, "'Against the scepticism of everyone around them' describes the genius in the myth, not a reason for the theory's popularity.", "against the scepticism of everyone around them"),
             D(3, "'Three in the morning' is a decorative detail of the Edison image, not a reason. Literal-detail trap.", "Edison in his laboratory at three in the morning")]},
        {"id": "q2", "prompt": "What point does the writer make with the examples of calculus and the telephone?",
         "options": ["Important inventions are often the subject of legal disputes.", "Some discoveries are made purely by chance.", "Significant ideas tend to emerge when circumstances make them possible.", "Historians have exaggerated the importance of individual inventors."],
         "correctIndex": 2,
         "paraphraseEvidence": "once the necessary knowledge and tools are in place, an idea is, in a sense, waiting to be found",
         "paraphraseNote": "Multiple simultaneous discoveries show ideas appear when conditions ('knowledge and tools') allow.",
         "distractorAnalysis": [
             D(0, "The patent is mentioned only to show simultaneity; no dispute is discussed. Uses a word (patent) to invite an inference.", "the telephone patent was filed"),
             D(1, "Chance is not the point — the point is the opposite: the discovery was almost inevitable."),
             D(3, "It's popular imagination, not historians, that exaggerates; historians are the ones who find 'a crowded room'.", "they find not a solitary flash of insight but a crowded room")]},
        {"id": "q3", "prompt": "Why does the writer mention Hamlet?",
         "options": ["to acknowledge a limitation of the argument being presented", "to illustrate how literary history supports the theory of multiple discovery", "to show that great works depend on their historical context", "to criticise those who undervalue individual talent"],
         "correctIndex": 0,
         "paraphraseEvidence": "This does not mean that individuals are irrelevant",
         "paraphraseNote": "Hamlet is a concession: the writer admits individuals DO matter — a limit to the 'network' argument.",
         "distractorAnalysis": [
             D(1, "Hamlet is an example AGAINST multiple discovery: nobody else could have written it."),
             D(2, "'Given the state of English drama in 1600' mentions context, but the point is that context alone isn't enough. Half-true trap.", "given the state of English drama in 1600"),
             D(3, "No one is criticised; the writer is qualifying his own argument.")]},
        {"id": "q4", "prompt": "According to the writer, Florence's artistic achievements are best explained by",
         "options": ["the exceptional natural ability of its inhabitants.", "its large and wealthy population.", "social and economic structures that developed skills.", "the influence of a small number of rival artists."],
         "correctIndex": 2,
         "paraphraseEvidence": "Talent, in other words, was not so much born as manufactured",
         "paraphraseNote": "Patrons, rivalry between workshops, apprenticeships = structures that developed ('manufactured') skill.",
         "distractorAnalysis": [
             D(0, "Presented as 'tempting' but rejected (Florentine mothers joke).", "It is tempting to attribute this to an unusual concentration of talent"),
             D(1, "60,000 is presented as SMALL ('perhaps 60,000'), and 'wealthy' refers to patrons, not the population.", "a city of perhaps 60,000 people"),
             D(3, "Rivalry was between workshops (systems), not a handful of individuals — and this would reintroduce the lone-genius idea.", "fierce rivalry between workshops")]},
        {"id": "q5", "prompt": "What does the writer find 'troubling' about the lone-genius narrative?",
         "options": ["It makes biographies difficult to market.", "It can lead organisations to neglect the conditions that produce innovation.", "It causes talented researchers to demand excessive salaries.", "It discourages people from working in teams."],
         "correctIndex": 1,
         "paraphraseEvidence": "reward individual stars at the expense of the collaborative structures that actually generate innovation",
         "paraphraseNote": "'At the expense of the collaborative structures' = neglecting the conditions that produce innovation.",
         "distractorAnalysis": [
             D(0, "This is the first, NON-troubling reason ('Part of the explanation is simply…'). 'But there is also something more troubling' introduces the answer.", "a biography of a network is a hard book to sell"),
             D(2, "Companies pay 'at enormous cost' by choice; researchers' demands aren't mentioned. Subject shift.", "Companies poach celebrated researchers at enormous cost"),
             D(3, "Too general: the problem is organisational reward, not individuals' willingness to collaborate.")]},
        {"id": "q6", "prompt": "In the final paragraph, the writer's main recommendation is that",
         "options": ["remarkable individuals should receive less public attention.", "policy-makers should prioritise creating favourable conditions for creativity.", "failure should be avoided wherever possible.", "creative people should work in small, informal spaces."],
         "correctIndex": 1,
         "paraphraseEvidence": "would do better to invest in the unglamorous conditions that make it possible",
         "paraphraseNote": "'Invest in the unglamorous conditions' = prioritise favourable conditions.",
         "distractorAnalysis": [
             D(0, "Explicitly rejected: 'not that we should stop admiring remarkable people'.", "it is not that we should stop admiring remarkable people"),
             D(2, "Opposite: 'tolerance of the failures that inevitably precede success'.", "tolerance of the failures"),
             D(3, "The garage is a metaphor ('rarely as empty as the legend suggests'), not a recommendation about workspace size.", "The garage, after all, was rarely as empty")]},
    ]
})

# ─────────────────────────── PART 6 ───────────────────────────
R6_TEXT = """Should homework be abolished in secondary schools?

A  Dr Helen Marsh, educational psychologist
The evidence on homework at secondary level is more encouraging than its critics admit. Large-scale studies consistently show a modest but real link between time spent on homework and exam results, particularly for older students. The problem is not homework itself but bad homework: pointless worksheets set out of habit. Abolishing it would penalise precisely those students who lack other opportunities to consolidate what they learn in class. What schools need is not less homework but better-designed tasks, with clear feedback.

B  Mark Adeyemi, head teacher
In my school we scrapped compulsory homework for the first three years of secondary five years ago, and I have no regrets. Exam results did not fall; if anything, they rose slightly, although I would not claim that this was caused by the change. What did change dramatically was the atmosphere: fewer arguments at home, fewer detentions, more students reading for pleasure. I accept that research shows some academic benefit, but I suspect it is too small to justify the stress and family conflict homework creates.

C  Sofia Lindqvist, parent and journalist
Much of the debate ignores the elephant in the room: homework widens inequality. A child with a quiet bedroom, a laptop and educated parents can complete an assignment in an hour. A child sharing a room with two siblings, with no internet access, cannot. Supporters claim homework helps disadvantaged students catch up, but in practice it rewards those who are already advantaged. I am not opposed to independent study, but it should take place in school, where every student has the same resources.

D  Prof. Daniel Cho, education researcher
Both sides tend to overstate their case. The research shows a positive association between homework and achievement in secondary school, but correlation is not causation: motivated students may simply do more homework. What we can say with some confidence is that quality matters far more than quantity. Short, purposeful tasks that students can do without help are the most effective, and they also reduce the inequality problem, since they do not depend on resources at home."""
R6_OPTS = ["A  Helen Marsh", "B  Mark Adeyemi", "C  Sofia Lindqvist", "D  Daniel Cho"]
READING.append({
    "id": "R6-A", "part": "R6", "skill": "reading",
    "title": "Part 6 · Should homework be abolished?",
    "instructions": "You are going to read four extracts in which experts give their views on homework. For questions 1-4, choose from the experts A-D. The experts may be chosen more than once.",
    "timeLimitSeconds": 600,
    "textOrTranscript": R6_TEXT,
    "sharedOptions": R6_OPTS,
    "questions": [
        {"id": "q1", "prompt": "Which expert shares Marsh's view that the design of homework tasks is the key issue?",
         "options": R6_OPTS, "correctIndex": 3,
         "paraphraseEvidence": "quality matters far more than quantity",
         "paraphraseNote": "Marsh: 'not less homework but better-designed tasks'. Cho: 'quality matters far more than quantity… short, purposeful tasks'.",
         "distractorAnalysis": [
             D(1, "Adeyemi abolished homework; he doesn't discuss task design.", "we scrapped compulsory homework"),
             D(2, "Lindqvist talks about independent study in school — about WHERE, not about task design.", "it should take place in school")]},
        {"id": "q2", "prompt": "Which expert has a different view from the others regarding the academic benefit of homework?",
         "options": R6_OPTS, "correctIndex": 2,
         "paraphraseEvidence": "in practice it rewards those who are already advantaged",
         "paraphraseNote": "Marsh, Adeyemi ('I accept that research shows some academic benefit') and Cho all accept SOME benefit. Lindqvist denies it helps those it claims to help.",
         "distractorAnalysis": [
             D(1, "Tempting because he abolished homework — but he ACCEPTS the research shows some benefit; he just thinks it's too small.", "I accept that research shows some academic benefit"),
             D(3, "Cho questions causation but still acknowledges a positive association. Cautious ≠ different view.", "correlation is not causation")]},
        {"id": "q3", "prompt": "Which expert expresses a similar opinion to Lindqvist about the effect of home circumstances?",
         "options": R6_OPTS, "correctIndex": 3,
         "paraphraseEvidence": "they do not depend on resources at home",
         "paraphraseNote": "Cho: well-designed tasks 'reduce the inequality problem, since they do not depend on resources at home' — shares Lindqvist's concern about inequality.",
         "distractorAnalysis": [
             D(0, "Marsh argues the OPPOSITE: abolishing homework would penalise students lacking opportunities.", "penalise precisely those students who lack other opportunities"),
             D(1, "Adeyemi mentions 'family conflict', not unequal resources. Same topic (home), different idea.", "family conflict")]},
        {"id": "q4", "prompt": "Which expert is careful not to claim that a change in policy led to improved results?",
         "options": R6_OPTS, "correctIndex": 1,
         "paraphraseEvidence": "although I would not claim that this was caused by the change",
         "paraphraseNote": "Adeyemi hedges: results rose, but he won't claim causation.",
         "distractorAnalysis": [
             D(3, "Cho discusses causation too ('correlation is not causation'), but about research in general, not a policy change.", "correlation is not causation")]},
    ]
})

# ─────────────────────────── PART 7 · Gapped text ───────────────────────────
R7_TEXT = """Learning to Read the Sea

When I signed up for a week-long sailing course off the west coast of Scotland, I assumed the hardest part would be the knots. I had practised them for weeks at my kitchen table, tying and untying a length of rope while the kettle boiled. [GAP 1]

Our instructor, a weather-beaten woman called Fiona, spent the first morning not on the boat at all but on the harbour wall, making us stare at the water. 'Tell me what you see,' she kept saying. We saw water. She saw a shift in the wind coming from the north-west, a current running against the tide near the headland, and a patch of darker water that meant a sudden gust was on its way.

[GAP 2] By the third day, I could pick out the ruffled patches that signal a gust, and I had started, without being told, to glance up at the clouds every few minutes.

The real test came on the fourth afternoon, when Fiona announced that she would not be giving any instructions. We were to sail to a small island and back, and she would sit in the stern with her arms folded. [GAP 3]

For the first half hour, things went well. We tacked neatly out of the harbour, and I was even beginning to feel slightly smug. Then the wind dropped almost to nothing, and the four of us began to argue about what to do. One wanted to start the engine; another insisted we wait.

[GAP 4] I noticed a dark line moving across the water towards us from the west. Without thinking, I shouted to the others to let the sails out, and a moment later the gust hit us. Because we were ready, the boat leaned over and surged forward rather than tipping dangerously.

Fiona said nothing until we were back in the harbour. Then she simply nodded at me and said, 'You were looking.' It is the most satisfying compliment I have ever received. [GAP 5]

Since coming home, I have found myself doing the same thing in all sorts of situations: paying attention before acting, noticing small signals rather than charging ahead. [GAP 6] What the course taught me, more than any technical skill, was that most mistakes come not from lack of knowledge but from lack of attention."""
R7_PARAS = [
    "A  It was during this argument, as so often happens, that the answer presented itself.",
    "B  It turned out to be the least useful preparation imaginable. Nobody on the boat cared whether my bowline was elegant; what mattered was something I had never thought to practise.",
    "C  I would like to say that this new awareness has transformed my life, but that would be an exaggeration. It has, however, made me a slightly better listener.",
    "D  At first this seemed like a slightly theatrical exercise. But gradually, over the following days, the water began to reveal itself to me.",
    "E  The engine, in the end, was never needed, and nobody mentioned it again.",
    "F  None of us said so, but we were all terrified.",
    "G  It was not, I realised later, a compliment about my sailing at all.",
]
READING.append({
    "id": "R7-A", "part": "R7", "skill": "reading",
    "title": "Part 7 · Learning to Read the Sea",
    "instructions": "You are going to read an article about a sailing course. Six paragraphs have been removed. Choose from paragraphs A-G the one which fits each gap (1-6). There is one extra paragraph which you do not need to use.",
    "timeLimitSeconds": 720,
    "textOrTranscript": R7_TEXT,
    "sharedOptions": R7_PARAS,
    "questions": [
        {"id": "q1", "prompt": "Gap 1", "options": R7_PARAS, "correctIndex": 1,
         "paraphraseEvidence": "I had practised them for weeks at my kitchen table",
         "paraphraseNote": "B's 'preparation' refers back to practising knots; 'something I had never thought to practise' leads to the next paragraph (watching the water).",
         "distractorAnalysis": [D(3, "D also contrasts expectations, but 'this… exercise' needs a previous exercise (staring at water), which appears only after gap 1.")]},
        {"id": "q2", "prompt": "Gap 2", "options": R7_PARAS, "correctIndex": 3,
         "paraphraseEvidence": "making us stare at the water",
         "paraphraseNote": "'This… exercise' = staring at the water. 'Gradually… the water began to reveal itself' links to 'By the third day, I could pick out the ruffled patches'.",
         "distractorAnalysis": [D(2, "C talks about awareness, but its reflective tone belongs at the end of the story, not day three.")]},
        {"id": "q3", "prompt": "Gap 3", "options": R7_PARAS, "correctIndex": 5,
         "paraphraseEvidence": "she would sit in the stern with her arms folded",
         "paraphraseNote": "Being left without instructions → 'None of us said so, but we were all terrified.' Next paragraph contrasts: 'For the first half hour, things went well.'",
         "distractorAnalysis": [D(4, "E mentions the engine, which hasn't appeared yet in the text. Reference before introduction.")]},
        {"id": "q4", "prompt": "Gap 4", "options": R7_PARAS, "correctIndex": 0,
         "paraphraseEvidence": "the four of us began to argue about what to do",
         "paraphraseNote": "'This argument' in A refers back to the dispute; 'the answer presented itself' = the dark line on the water.",
         "distractorAnalysis": [D(4, "E is tempting after the engine discussion, but 'in the end' doesn't fit before the gust; it has no clear place — it's the extra paragraph.", "One wanted to start the engine")]},
        {"id": "q5", "prompt": "Gap 5", "options": R7_PARAS, "correctIndex": 6,
         "paraphraseEvidence": "It is the most satisfying compliment I have ever received",
         "paraphraseNote": "G picks up 'compliment' and reinterprets it: it was about attention, not sailing — leading to the final lesson.",
         "distractorAnalysis": [D(2, "C also reflects, but its 'new awareness' needs the generalisation of the next paragraph first.")]},
        {"id": "q6", "prompt": "Gap 6", "options": R7_PARAS, "correctIndex": 2,
         "paraphraseEvidence": "paying attention before acting, noticing small signals rather than charging ahead",
         "paraphraseNote": "'This new awareness' = paying attention in everyday situations; the modest hedge ('would be an exaggeration') fits the reflective ending.",
         "distractorAnalysis": [D(4, "E is the extra paragraph: the engine is never resolved in a way that requires it.")]},
    ]
})

# ─────────────────────────── PART 8 · Multiple matching ───────────────────────────
R8_TEXT = """Four young entrepreneurs describe how they started their businesses

A  Leah – vintage clothing
I started selling second-hand clothes online while I was still at university, mostly to pay my rent. I had no business plan at all; I simply photographed things I found at car-boot sales and listed them in the evenings. The turning point came when a fashion blogger bought a jacket and mentioned my shop to her followers. Overnight I had more orders than I could handle, and I had to persuade two flatmates to help me pack parcels. Looking back, I'm glad I grew slowly at first. Had that blog post come in my first month, I would have been completely overwhelmed.

B  Kofi – mobile app for farmers
My parents are farmers in Ghana, and I grew up watching them lose money because they couldn't get reliable information about market prices. The app began as a university project, and I honestly never expected it to go further. What changed my mind was a lecturer who refused to give me a high mark unless I tested it with real users. Once I saw farmers using it, I couldn't let it go. Raising money was the hardest part: investors kept telling me the market was too small. I now take a certain satisfaction in proving them wrong, although I try not to let it show.

C  Mia – plant-based bakery
Before I opened the bakery I spent two years working in a large commercial kitchen, which taught me more than any course could have. I knew exactly how much a mistake in ordering could cost. Even so, I underestimated how lonely running a business would be. In the kitchen there was always someone to complain to; now every decision is mine. I've joined a network of local business owners who meet once a month, and that has made a huge difference. I'd advise anyone starting out to find people in the same situation as early as possible.

D  Raj – language-learning games
I'd worked in finance for six years and was earning well, so leaving was a big risk. My family thought I'd lost my mind. What gave me the confidence was that I'd built the first version of the game in my spare time and already had a few thousand users before I resigned. Even so, the first year was tougher than I'd imagined. I made the classic mistake of trying to do everything myself, from coding to customer service. I only started to grow once I accepted that I needed to hire people who were better than me at certain things."""
R8_OPTS = ["A  Leah", "B  Kofi", "C  Mia", "D  Raj"]
R8_Q = [
    ("Which person mentions being reluctant to show a feeling of satisfaction?", 1, "although I try not to let it show", "Kofi enjoys proving investors wrong but hides it.", [D(0, "Leah says 'I'm glad I grew slowly' — satisfaction, but nothing about hiding it.", "I'm glad I grew slowly at first")]),
    ("Which person says that previous work experience prepared them well?", 2, "taught me more than any course could have", "Mia's two years in a commercial kitchen.", [D(3, "Raj worked in finance, but he doesn't say it prepared him; his preparation was building the game.", "I'd worked in finance for six years")]),
    ("Which person was initially pushed into developing their idea further by someone else?", 1, "a lecturer who refused to give me a high mark unless I tested it with real users", "The lecturer forced him to test the app with real users.", [D(0, "The blogger boosted Leah's sales but didn't push her to develop the idea.", "a fashion blogger bought a jacket")]),
    ("Which person mentions a sudden increase in demand?", 0, "Overnight I had more orders than I could handle", "'Overnight' = sudden.", []),
    ("Which person had already shown there was interest in their product before committing fully?", 3, "already had a few thousand users before I resigned", "Users before resigning = proven interest before committing.", [D(1, "Kofi tested with users, but he was a student, not giving up a job; the focus is the lecturer.")]),
    ("Which person found it difficult to persuade others that the business had potential?", 1, "investors kept telling me the market was too small", "Investors doubted the market = difficulty persuading others.", [D(3, "Raj's family thought he'd lost his mind, but about leaving his job, not the business's potential.", "My family thought I'd lost my mind")]),
    ("Which person recommends seeking support from people facing similar challenges?", 2, "find people in the same situation as early as possible", "Explicit advice.", [D(3, "Raj hired better people — that's delegation, not peer support.", "hire people who were better than me")]),
    ("Which person admits they struggled because they did not delegate?", 3, "I made the classic mistake of trying to do everything myself", "Doing everything himself = not delegating.", [D(0, "Leah got flatmates to help — she DID get help.", "persuade two flatmates to help me pack parcels")]),
    ("Which person suggests that early success could have been harmful?", 0, "Had that blog post come in my first month, I would have been completely overwhelmed", "Inverted third conditional = hypothetical harm of early success.", []),
    ("Which person was affected by a lack of company in their working life?", 2, "I underestimated how lonely running a business would be", "Lonely = lack of company.", [D(1, "Kofi mentions difficulty, but about investors, not loneliness.")]),
]
READING.append({
    "id": "R8-A", "part": "R8", "skill": "reading",
    "title": "Part 8 · Young entrepreneurs",
    "instructions": "You are going to read four young entrepreneurs describing how they started their businesses. For questions 1-10, choose from the people (A-D). The people may be chosen more than once.",
    "timeLimitSeconds": 720,
    "textOrTranscript": R8_TEXT,
    "sharedOptions": R8_OPTS,
    "questions": [
        {"id": f"q{i+1}", "prompt": p, "options": R8_OPTS, "correctIndex": c, "paraphraseEvidence": e, "paraphraseNote": n, "distractorAnalysis": d}
        for i, (p, c, e, n, d) in enumerate(R8_Q)
    ]
})
