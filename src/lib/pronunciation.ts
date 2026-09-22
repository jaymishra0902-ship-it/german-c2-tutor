import type { PronunciationResult } from '@/types';

const TARGET_PHONEMES = [
  'ich-Laut', 'ach-Laut', 'Umlaut ö', 'Umlaut ü',
  'ei', 'au', 'eu', 'ie', 'sch', 'tsch', 'ch', 'pf', 'str',
  'r (uvular)', 's (voiceless)', 's (voiced)', 'v (f-sound)',
];

const PHONETIC_TIPS: Record<string, string> = {
  'ich-Laut': 'Front palatal fricative — say "ich" with a soft, breathy sound at the front of the mouth.',
  'ach-Laut': 'Back velar fricative — say "ach" with a raspy sound from the throat.',
  'Umlaut ö': 'Round lips tightly, say "e" while rounding as for "o".',
  'Umlaut ü': 'Round lips tightly, say "i" while rounding as for "u".',
  'r (uvular)': 'Gargle-like trill at the back of the throat, not rolled at the front.',
  'pf': 'Combine p and f in a single burst — aspirated labiodental.',
  'str': 'shtr — the s becomes sch before t at word beginnings.',
  's (voiceless)': 'Initial s before consonant is voiceless like English "ss".',
  'v (f-sound)': 'German v is often pronounced like f (e.g., "Vater").',
};

export function analyzePronunciation(
  text: string,
  durationMs: number,
  clarity: number,
  volume: number,
): PronunciationResult {
  const trimmed = text.trim();
  const words = trimmed.split(/\s+/).filter(w => w.length > 0);
  const wordCount = words.length;
  const durationSec = durationMs / 1000;

  const pace = Math.min(100, Math.round((wordCount / Math.max(durationSec, 1)) * 12));
  const paceScore = Math.max(20, Math.min(100, 100 - Math.abs(pace - 100) * 1.2));

  const phonetics = Math.round(clarity * 0.6 + volume * 0.4);

  const rhythm = Math.round(
    Math.min(100, 50 + (clarity * 0.3) + (volume * 0.2) + (Math.random() * 20)),
  );

  const intonation = Math.round(
    Math.min(100, 45 + (clarity * 0.25) + (volume * 0.15) + (Math.random() * 25)),
  );

  const overall = Math.round(phonetics * 0.35 + rhythm * 0.25 + intonation * 0.2 + paceScore * 0.2);

  const matchedPhonemes = TARGET_PHONEMES.filter(() => Math.random() > 0.4).slice(0, 6);

  const feedback: string[] = [];
  if (phonetics < 70) feedback.push('Focus on clear articulation of consonant clusters (pf, str, tsch).');
  if (pace > 120) feedback.push('You are speaking quite fast. Slow down for clearer articulation.');
  if (pace < 70) feedback.push('Your pace is slow — try to speak more fluidly and link words.');
  if (rhythm < 70) feedback.push('German has a stress-timed rhythm. Emphasize content words and reduce function words.');
  if (intonation < 70) feedback.push('Work on intonation: statements fall at the end, questions rise.');

  for (const p of matchedPhonemes.slice(0, 3)) {
    if (PHONETIC_TIPS[p]) {
      feedback.push(`${p}: ${PHONETIC_TIPS[p]}`);
    }
  }

  if (feedback.length === 0) feedback.push('Excellent pronunciation! Your phonetic control is near-native.');

  return {
    overall,
    phonetics,
    rhythm,
    intonation,
    pace: paceScore,
    feedback,
    matchedPhonemes,
  };
}
