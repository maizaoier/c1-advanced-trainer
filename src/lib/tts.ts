import { Capacitor } from '@capacitor/core';
import { TextToSpeech } from '@capacitor-community/text-to-speech';
import type { TranscriptLine } from '../types';

/**
 * Speech output. Android WebView has no Web Speech API, so inside the APK we use the native
 * Capacitor plugin; in the browser/PWA we use speechSynthesis.
 */
const native = Capacitor.isNativePlatform();
let token = 0;

function webVoices(): SpeechSynthesisVoice[] {
  if (typeof speechSynthesis === 'undefined') return [];
  return speechSynthesis.getVoices().filter((v) => /^en/i.test(v.lang));
}
function pickWebVoice(kind: 'male' | 'female'): SpeechSynthesisVoice | undefined {
  const vs = webVoices();
  const gb = vs.filter((v) => /GB|UK/i.test(v.lang + v.name));
  const pool = gb.length ? gb : vs;
  const femaleRx = /female|woman|libby|sonia|hazel|susan|serena|kate|amy|emma|google uk english female/i;
  const maleRx = /male|man|ryan|george|daniel|arthur|oliver|brian|google uk english male/i;
  const m = pool.find((v) => (kind === 'female' ? femaleRx : maleRx).test(v.name) && !(kind === 'male' && /female/i.test(v.name)));
  return m ?? pool[kind === 'female' ? 0 : Math.min(1, pool.length - 1)];
}

export function ttsAvailable(): boolean {
  return native || typeof speechSynthesis !== 'undefined';
}

async function speakOne(text: string, kind: 'male' | 'female', rate: number, my: number): Promise<void> {
  if (my !== token) return;
  if (native) {
    await TextToSpeech.speak({ text, lang: 'en-GB', rate, pitch: kind === 'male' ? 0.85 : 1.1, volume: 1, category: 'playback' });
    return;
  }
  await new Promise<void>((resolve) => {
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'en-GB';
    u.rate = rate;
    const v = pickWebVoice(kind);
    if (v) u.voice = v;
    u.pitch = kind === 'male' ? 0.85 : 1.1;
    u.onend = () => resolve();
    u.onerror = () => resolve();
    speechSynthesis.speak(u);
  });
}

/** Plays a script line by line. Resolves when finished or stopped. */
export async function speakScript(lines: TranscriptLine[], rate: number, onLine?: (i: number) => void): Promise<boolean> {
  stopSpeech();
  const my = ++token;
  for (let i = 0; i < lines.length; i++) {
    if (my !== token) return false;
    onLine?.(i);
    await speakOne(lines[i].text, lines[i].voice, rate, my);
    if (my !== token) return false;
    await new Promise((r) => setTimeout(r, 450));
  }
  return my === token;
}

export function speak(text: string, rate = 1, kind: 'male' | 'female' = 'female'): void {
  stopSpeech();
  const my = ++token;
  void speakOne(text, kind, rate, my);
}

export function stopSpeech(): void {
  token++;
  if (native) void TextToSpeech.stop().catch(() => undefined);
  else if (typeof speechSynthesis !== 'undefined') speechSynthesis.cancel();
}

// Some browsers load voices asynchronously.
if (!native && typeof speechSynthesis !== 'undefined') speechSynthesis.onvoiceschanged = () => undefined;
