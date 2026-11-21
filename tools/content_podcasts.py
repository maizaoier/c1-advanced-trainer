"""Real listening sources. Web links verified; Spotify/YouTube use search URLs (they open the apps)."""
from urllib.parse import quote

def sp(q): return f"https://open.spotify.com/search/{quote(q)}/podcasts"
def yt(q): return f"https://www.youtube.com/results?search_query={quote(q)}"

PODCASTS = [
 {"id": "cambridge", "name": "Cambridge C1 Advanced · examen de muestra oficial", "kind": "Examen real",
  "minutes": 10, "level": "C1 exacto", "parts": "Parts 1-4",
  "why": "Audio REAL del examen, con respuestas y tapescript oficiales. Haz una parte cada día y corrige con el answer key.",
  "links": [{"label": "Web oficial", "url": "https://www.cambridgeenglish.org/exams-and-tests/qualifications/advanced/preparation/"},
            {"label": "YouTube", "url": yt("C1 Advanced listening sample test Cambridge")}]},
 {"id": "todayinfocus", "name": "Today in Focus (The Guardian)", "kind": "Noticias / debate",
  "minutes": 25, "level": "C1", "parts": "Part 3",
  "why": "Entrevistas a periodistas con opiniones matizadas y cambios de postura: como la entrevista de Part 3.",
  "links": [{"label": "Web", "url": "https://www.theguardian.com/news/series/todayinfocus"},
            {"label": "Spotify", "url": sp("Today in Focus Guardian")},
            {"label": "YouTube", "url": yt("Today in Focus Guardian podcast")}]},
 {"id": "desertisland", "name": "Desert Island Discs (BBC Radio 4)", "kind": "Entrevista",
  "minutes": 40, "level": "C1-C2", "parts": "Part 3 · Part 4",
  "why": "Personas famosas cuentan su vida: actitudes, sentimientos y razones — justo lo que preguntan Part 3 y Part 4.",
  "links": [{"label": "Apple Podcasts", "url": "https://podcasts.apple.com/podcast/id342735925"},
            {"label": "Spotify", "url": sp("Desert Island Discs")},
            {"label": "YouTube", "url": yt("Desert Island Discs")}]},
 {"id": "inourtime", "name": "In Our Time (BBC Radio 4)", "kind": "Divulgación",
  "minutes": 45, "level": "C2", "parts": "Part 2 · Part 3",
  "why": "Expertos debatiendo historia y ciencia. Muy exigente: perfecto para entrenar datos concretos (Part 2).",
  "links": [{"label": "BBC", "url": "https://www.bbc.co.uk/programmes/b006qykl"},
            {"label": "Spotify", "url": sp("In Our Time BBC Radio 4")},
            {"label": "YouTube", "url": yt("In Our Time BBC Radio 4")}]},
 {"id": "luke", "name": "Luke's English Podcast", "kind": "Para estudiantes",
  "minutes": 30, "level": "B2-C1", "parts": "Part 1",
  "why": "Inglés británico natural y coloquial, con humor e ironía: como las conversaciones informales de Part 1.",
  "links": [{"label": "Web", "url": "https://teacherluke.co.uk/"},
            {"label": "Spotify", "url": sp("Luke's English Podcast")},
            {"label": "YouTube", "url": yt("Luke's English Podcast")}]},
 {"id": "ted", "name": "TED Talks", "kind": "Monólogo",
  "minutes": 15, "level": "C1", "parts": "Part 2",
  "why": "Una sola persona explicando un tema con datos y cifras: como el monólogo de Part 2. Sin subtítulos.",
  "links": [{"label": "YouTube", "url": yt("TED talk")},
            {"label": "Spotify", "url": sp("TED Talks Daily")}]},
 {"id": "6min", "name": "6 Minute English (BBC Learning English)", "kind": "Corto + vocabulario",
  "minutes": 7, "level": "B2", "parts": "Calentamiento",
  "why": "Para los días con poco tiempo: 6 minutos, con transcripción y vocabulario en la web.",
  "links": [{"label": "BBC", "url": "https://www.bbc.co.uk/programmes/p02pc9tn"},
            {"label": "Spotify", "url": sp("6 Minute English BBC")},
            {"label": "YouTube", "url": yt("BBC Learning English 6 Minute English")}]},
]

QUESTIONS = [
 "¿Cuál es la opinión principal del hablante? Escríbela con TUS palabras (paráfrasis).",
 "¿Cambió de opinión o matizó algo? ¿Con qué palabras? (however, mind you, having said that, to be fair…)",
 "Anota 3 datos concretos: nombres, cifras o lugares.",
 "Apunta 3 expresiones nuevas y escribe una frase con cada una.",
]
