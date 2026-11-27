import { Capacitor } from '@capacitor/core';
import { TextToSpeech } from '@capacitor-community/text-to-speech';
import { getProgress } from './store';

/**
 * Pronunciation. Android WebView has no Web Speech API, so inside the APK we use the native
 * Capacitor plugin; in the browser we use speechSynthesis. The most natural voices are ranked first.
 */
const native = Capacitor.isNativePlatform();
let token = 0;

export interface VoiceInfo { name: string; lang: string; quality: number; index: number }

const NATURAL = /natural|neural|online|enhanced|premium|network|wavenet|studio|siri/i;
function score(name: string, lang: string): number {
  let s = 0;
  if (/en[-_]GB/i.test(lang)) s += 30; else if (/^en/i.test(lang)) s += 10;
  if (NATURAL.test(name)) s += 50;
  if (/google/i.test(name)) s += 15;
  if (/compact|espeak|legacy|local/i.test(name)) s -= 30;
  return s;
}

let cache: VoiceInfo[] | null = null;
export async function listVoices(): Promise<VoiceInfo[]> {
  if (cache && cache.length) return cache;
  let raw: { name: string; lang: string }[] = [];
  if (native) {
    try { raw = (await TextToSpeech.getSupportedVoices()).voices.map((v) => ({ name: v.name || v.voiceURI, lang: v.lang })); } catch { raw = []; }
  } else if (typeof speechSynthesis !== 'undefined') {
    raw = speechSynthesis.getVoices().map((v) => ({ name: v.name, lang: v.lang }));
    if (!raw.length) {
      await new Promise((r) => { speechSynthesis.onvoiceschanged = () => r(null); setTimeout(r, 1200); });
      raw = speechSynthesis.getVoices().map((v) => ({ name: v.name, lang: v.lang }));
    }
  }
  cache = raw.map((v, index) => ({ ...v, index, quality: score(v.name, v.lang) })).filter((v) => /^en/i.test(v.lang)).sort((a, b) => b.quality - a.quality);
  return cache;
}

async function chosenVoice(): Promise<VoiceInfo | undefined> {
  const vs = await listVoices();
  return vs.find((v) => v.name === getProgress().settings.voice) ?? vs[0];
}

export const ttsAvailable = () => native || typeof speechSynthesis !== 'undefined';

async function speakWith(text: string, voice: VoiceInfo | undefined, rate: number, my: number): Promise<void> {
  if (my !== token) return;
  if (native) {
    await TextToSpeech.speak({ text, lang: voice?.lang ?? 'en-GB', rate, pitch: 1, volume: 1, category: 'playback', voice: voice?.index });
    return;
  }
  const u = new SpeechSynthesisUtterance(text);
  const v = voice ? speechSynthesis.getVoices().find((x) => x.name === voice.name) : undefined;
  if (v) { u.voice = v; u.lang = v.lang; } else u.lang = 'en-GB';
  u.rate = rate;
  speechSynthesis.speak(u);
}

export function stopSpeech(): void {
  token++;
  if (native) void TextToSpeech.stop().catch(() => undefined);
  else if (typeof speechSynthesis !== 'undefined') speechSynthesis.cancel();
}

/** Speaks a word or sentence with the chosen (or best) voice. */
export function speak(text: string, rate = getProgress().settings.speechRate): void {
  if (!ttsAvailable()) return;
  stopSpeech();
  const my = ++token;
  void chosenVoice().then((v) => speakWith(text.replace(/[[\]]/g, ''), v, rate, my));
}

export function speakWithVoice(text: string, voice: VoiceInfo, rate = 1): void {
  stopSpeech();
  const my = ++token;
  void speakWith(text, voice, rate, my);
}
