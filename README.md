# C1 Trainer · Cambridge C1 Advanced

App para preparar el **C1 Advanced (CAE)** con el objetivo de pasar de **178 (B2)** a **193–199 (Grade B)**.
Reparto del entrenamiento según la regla **50 / 35 / 15**: Listening (161), Reading (170) y Writing/Speaking (180/184).

## Instalar en el móvil

- **APK (Android):** pestaña [Releases](../../releases/latest) → descarga `C1-Trainer.apk` desde el móvil e instálalo
  (si Android lo pide, permite «Instalar apps desconocidas» para el navegador).
- **Web instalable:** abre la página de GitHub Pages del repositorio en Chrome → menú ⋮ → «Añadir a pantalla de inicio».

## Qué incluye

| Módulo | Contenido |
|---|---|
| **Hoy** | Plan corto y configurable (≈45 min): vocabulario, gramática, un Reading y escucha real; «Repasar fallos» solo cuando hay pendientes |
| **Listening (50%)** | Escucha real diaria (Cambridge oficial, BBC, Guardian, TED…) con enlaces a YouTube/Spotify + Parts 1–4 con la voz más natural del dispositivo |
| **Gramática** | Las 12 unidades de Destination con teoría (explicación + ejemplos + trucos de examen) y práctica con repetición espaciada |
| **Reading (35%)** | Parts 5–8 (8 textos) en pestañas Texto / Preguntas, una pregunta cada vez, tiempo límite estricto y subrayado |
| **Detector de trampas** | Tras corregir: la paráfrasis exacta en **verde**, las frases trampa en **coral** y por qué cada distractor es falso |
| **Repasar fallos** | Cada pregunta fallada vuelve con repetición espaciada hasta dominarla |
| **Vocabulario Destination C1** | 1.763 tarjetas (palabras, phrasal verbs, idioms, colocaciones, word formation, gramática) con definiciones del libro |
| **Writing & Speaking (15%)** | Tareas por tipo de texto, checklist de examinador, cronómetro por partes del Speaking |
| **Panel** | Escala Cambridge 160–210, línea de aprobado en 180, punto de partida y estimación actual |

Todo el progreso se guarda automáticamente en el dispositivo (`localStorage`), con copia de seguridad en Ajustes.

## Desarrollo

```bash
npm install
npm run dev          # servidor local
npm run build        # build de producción (dist/)
npm run content      # regenera src/data/exam.json desde tools/content_*.py (valida paráfrasis y trampas)
```

Estructura:

```
src/
  types.ts                  interfaces de preguntas, ejercicios, progreso
  data/                     contenido en JSON (exam.json, destination.json, prompts.json)
  lib/                      store (localStorage), srs, scoring, tts, router…
  components/exam/          ExamShell, AudioPlayer, HighlightedText, TrapReview, QuestionMCQ
  components/parts/         ListeningPart1-4, ReadingPart5-8 (un componente por parte)
  screens/                  Home, ExerciseHub, Mistakes, Study, Library, Productive, Settings
tools/                      generadores y validadores de contenido
```

Los workflows de `.github/workflows` generan el APK (Capacitor) y publican la web en GitHub Pages en cada push a `main`.
