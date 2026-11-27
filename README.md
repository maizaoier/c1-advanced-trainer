# C1 Vocab · Destination C1

App sencilla para aprender el **vocabulario de Destination C1** de cara al Cambridge C1 Advanced,
con **flashcards** y **repetición espaciada** (algoritmo tipo SM-2 que no programa repasos después del examen).

## Instalar en el móvil (Android)

Pestaña [Releases](../../releases/latest) → descarga `C1-Trainer.apk` desde el móvil e instálalo.
Todas las versiones van firmadas con la misma clave, así que las nuevas se instalan encima sin perder el progreso.

## Qué incluye

- **1.584 tarjetas** de las 13 unidades de vocabulario: palabras (con definición y ejemplo del libro y traducción),
  phrasal verbs, idioms, colocaciones, familias de palabras y word formation (Part 3).
- **Selección esencial (946 tarjetas, por defecto)**: sin las palabras más básicas (frecuencia de uso muy alta, salvo las que en C1 tienen otro significado)
  ni las listas de colocaciones/familias de palabras; mantiene todos los phrasal verbs, idioms y ejercicios de word formation.
  Se puede cambiar a la selección completa (1.584) en Ajustes. Criterios en `tools/select_essential.py`.
- **«Ya me la sé»**: quita una tarjeta nueva para siempre (se recupera desde su unidad).
- **Sesión diaria**: repasos pendientes + tarjetas nuevas (automático según los días que faltan para el examen).
- Botones *Otra vez / Difícil / Bien / Fácil*; las tarjetas difíciles vuelven antes.
- Los phrasal verbs ya vistos se preguntan completando la frase.
- **Pronunciación** con la voz más natural del dispositivo.
- **Progreso**: porcentaje total, ganancia del día, racha y previsión de repasos de los próximos 7 días.
- Todo se guarda en el dispositivo (`localStorage`), con copia de seguridad en Ajustes.

## Desarrollo

```bash
npm install
npm run dev      # servidor local
npm run build    # build de producción (dist/)
```

```
src/
  data/destination.json   vocabulario (unidades y tarjetas)
  lib/                    store (progreso), srs (repetición espaciada), tts, router…
  screens/                Home, Study (flashcards), Units, Settings
```

El workflow `.github/workflows/android-apk.yml` genera y firma el APK en cada push a `main`.
