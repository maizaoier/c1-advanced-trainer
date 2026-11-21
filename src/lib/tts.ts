import { Capacitor } from '@capacitor/core';
import { TextToSpeech } from '@capacitor-community/text-to-speech';
import type { TranscriptLine } from '../types';
import { getProgress } from './store';

/**
 * Speech output. Android WebView has no Web Speech API, so inside the APK we use the native
 * Capacitor plugin; in the browser/PWA we use speechSynthesis.
 * Voices are ranked so the most natural ones (neural / "Natural" / network voices) are used first.
 */
const native = Capacitor.isNativePlatform();
let token = 0;

export interface VoiceInfo { name: string; lang: string; quality: number; index: number }

const NATURAL = /natural|neural|online|enhanced|premium|network|wavenet|studio|siri/i;
const LOW = /compact|espeak|legacy|local/i;

function score(name: string, lang: string): number {
  let s = 0;
  if (/en[-_]GB/i.test(lang)) s += 30;
  else if (/en[-_](IE|AU|NZ)/i.test(lang)) s += 15;
  else if (/^en/i.test(lang)) s += 10;
  if (NATURAL.test(name)) s += 50;
  if (/google/i.test(name)) s += 15;
  if (/microsoft/i.test(name) && !NATURAL.test(name)) s -= 5;
  if (LOW.test(name)) s -= 30;
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
  cache = raw
    .map((v, index) => ({ ...v, index, quality: score(v.name, v.lang) }))
    .filter((v) => /^en/i.test(v.lang))
    .sort((a, b) => b.quality - a.quality);
  return cache;
}

/** Picks the voice for speaker slot A (first speaker) or B (second speaker): user choice, else best two distinct voices. */
async function voiceFor(slot: 'A' | 'B'): Promise<VoiceInfo | undefined> {
  const vs = await listVoices();
  if (!vs.length) return undefined;
  const { voiceA, voiceB } = getProgress().settings;
  const chosen = vs.find((v) => v.name === (slot === 'A' ? voiceA : voiceB));
  if (chosen) return chosen;
  const a = vs.find((v) => v.name === voiceA) ?? vs[0];
  if (slot === 'A') return a;
  // second speaker: best voice that is different from A, preferably same accent
  return vs.find((v) => v.name !== a.name && v.lang === a.lang) ?? vs.find((v) => v.name !== a.name) ?? a;
}

export function ttsAvailable(): boolean {
  return native || typeof speechSynthesis !== 'undefined';
}

async function speakWith(text: string, voice: VoiceInfo | undefined, rate: number, pitch: number, my: number): Promise<void> {
  if (my !== token) return;
  if (native) {
    await TextToSpeech.speak({ text, lang: voice?.lang ?? 'en-GB', rate, pitch, volume: 1, category: 'playback', voice: voice?.index });
    return;
  }
  await new Promise<void>((resolve) => {
    const u = new SpeechSynthesisUtterance(text);
    const v = voice ? speechSynthesis.getVoices().find((x) => x.name === voice.name) : undefined;
    if (v) { u.voice = v; u.lang = v.lang; } else u.lang = 'en-GB';
    u.rate = rate;
    u.pitch = pitch;
    u.onend = () => resolve();
    u.onerror = () => resolve();
    speechSynthesis.speak(u);
  });
}

/** Plays a script line by line, alternating voices per speaker. Resolves true if it finished. */
export async function speakScript(lines: TranscriptLine[], rate: number, onLine?: (i: number) => void): Promise<boolean> {
  stopSpeech();
  const my = ++token;
  const [a, b] = await Promise.all([voiceFor('A'), voiceFor('B')]);
  // map each speaker name to a slot, keeping narrators/extract labels on A
  const slots = new Map<string, VoiceInfo | undefined>();
  let next = 0;
  for (let i = 0; i < lines.length; i++) {
    if (my !== token) return false;
    const l = lines[i];
    if (!slots.has(l.speaker)) { slots.set(l.speaker, /^extract/i.test(l.speaker) ? a : next++ % 2 === 0 ? a : b); }
    onLine?.(i);
    // a natural voice sounds best at its own pitch; only nudge it slightly for contrast
    await speakWith(l.text, slots.get(l.speaker), rate, 1, my);
    if (my !== token) return false;
    await new Promise((r) => setTimeout(r, 350));
  }
  return my === token;
}

export function speak(text: string, rate = 1, slot: 'A' | 'B' = 'A'): void {
  stopSpeech();
  const my = ++token;
  void voiceFor(slot).then((v) => speakWith(text, v, rate, 1, my));
}

export function speakWithVoice(text: string, voice: VoiceInfo, rate = 1): void {
  stopSpeech();
  const my = ++token;
  void speakWith(text, voice, rate, 1, my);
}

export function stopSpeech(): void {
  token++;
  if (native) void TextToSpeech.stop().catch(() => undefined);
  else if (typeof speechSynthesis !== 'undefined') speechSynthesis.cancel();
}
