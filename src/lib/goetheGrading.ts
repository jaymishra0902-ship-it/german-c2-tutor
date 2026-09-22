import type { GoetheScore, EssayType } from '@/data/examPrompts';
import { evaluateText } from '@/lib/germanEngine';

const COHERENCE_MARKERS = [
  'zudem', 'darüber hinaus', 'ferner', 'schließlich', 'folglich', 'mithin',
  'einerseits', 'andererseits', 'zum einen', 'zum anderen',
  'nicht zuletzt', 'darüber hinaus', 'im Gegensatz dazu',
  'infolgedessen', 'in diesem Zusammenhang', 'hinsichtlich',
  'in Anbetracht', 'ungeachtet', 'vorausgesetzt',
  'zwar ... aber', 'einerseits ... andererseits',
];

const TASK_KEYWORDS: Record<EssayType, string[]> = {
  academic_opinion: ['these', 'argument', 'beispiel', 'kritik', 'stellung', 'position', 'widerlegen', 'belegen'],
  formal_petition: ['antrag', 'forderung', 'begründung', 'senat', 'universität', 'präsenz', 'geisteswissenschaft'],
  literary_analysis: ['erzähler', 'analyse', 'ironie', 'kontext', 'stil', 'mann', 'zauberberg', 'funktion'],
};

export function gradeExamEssay(
  text: string,
  essayType: EssayType,
  timeUsedSec: number,
  minWords: number,
  maxWords: number,
): GoetheScore {
  const evalResult = evaluateText(text);
  const words = text.trim().split(/\s+/).filter(w => w.length > 0);
  const wordCount = words.length;
  const lower = text.toLowerCase();

  // Vocabulary Richness — mapped to Goethe C2 criterion
  const vocabRichness = evalResult.vocabulary;

  // Coherence — based on connector density and sentence flow
  const coherenceHits = COHERENCE_MARKERS.filter(m => lower.includes(m.toLowerCase()));
  let coherence = 30;
  coherence += Math.min(30, coherenceHits.length * 4);
  coherence += Math.min(20, evalResult.style * 0.2);
  coherence += Math.min(20, evalResult.sentenceCount > 3 ? 20 : evalResult.sentenceCount * 5);
  coherence = Math.max(0, Math.min(100, Math.round(coherence)));

  // Grammar Precision — mapped to Goethe C2 criterion
  const grammarPrecision = evalResult.grammar;

  // Task fulfillment — does the essay address the prompt keywords?
  const keywords = TASK_KEYWORDS[essayType] || [];
  const keywordHits = keywords.filter(k => lower.includes(k.toLowerCase()));
  let taskFulfillment = 20;
  taskFulfillment += Math.min(40, keywordHits.length * 8);
  // Word count within range
  if (wordCount >= minWords && wordCount <= maxWords) {
    taskFulfillment += 25;
  } else if (wordCount >= minWords * 0.7) {
    taskFulfillment += 15;
  } else if (wordCount < minWords * 0.5) {
    taskFulfillment += 0;
  }
  // Time management
  taskFulfillment += 15;
  taskFulfillment = Math.max(0, Math.min(100, Math.round(taskFulfillment)));

  const overall = Math.round(
    vocabRichness * 0.25 + coherence * 0.25 + grammarPrecision * 0.25 + taskFulfillment * 0.25,
  );

  // Goethe C2 bands: 5 (max), 4, 3 (pass), 2, 1 (fail)
  let band: string;
  if (overall >= 90) band = '5 — Sehr gut (C2+)';
  else if (overall >= 78) band = '4 — Gut (C2)';
  else if (overall >= 65) band = '3 — Bestanden (C1/C2)';
  else if (overall >= 50) band = '2 — Nicht bestanden (B2)';
  else band = '1 — Nicht bestanden (<B2)';

  const feedback: string[] = [];

  if (vocabRichness < 70) feedback.push('Wortschatzreichtum: Verwenden Sie mehr C2-spezifische Ausdrücke und akademische Fachbegriffe (z.B. dennoch, mithin, Diskrepanz).');
  else feedback.push('Wortschatzreichtum: Gute Verwendung akademischen Vokabulars auf C2-Niveau.');

  if (coherence < 70) feedback.push('Kohärenz: Fügen Sie mehr verbindende Textglieder ein (darüber hinaus, mithin, einerseits/andererseits), um den Textfluss zu stärken.');
  else feedback.push('Kohärenz: Der Text ist logisch strukturiert und gut verknüpft.');

  if (grammarPrecision < 70) feedback.push('Grammatikalische Präzision: Achten Sie auf die Wortstellung in Nebensätzen und die korrekte Groß-/Kleinschreibung.');
  else feedback.push('Grammatikalische Präzision: Sehr saubere Grammatik mit wenigen Fehlern.');

  if (wordCount < minWords) feedback.push(`Aufgabenerfüllung: Der Text ist mit ${wordCount} Wörtern zu kurz (Mindestzahl: ${minWords}). Führen Sie Ihre Argumente weiter aus.`);
  else if (wordCount > maxWords) feedback.push(`Aufgabenerfüllung: Der Text überschreitet mit ${wordCount} Wörtern die Höchstzahl (${maxWords}). Straffen Sie Ihre Argumentation.`);
  else feedback.push(`Aufgabenerfüllung: Die Wortzahl (${wordCount}) liegt im geforderten Bereich.`);

  if (keywordHits.length < 3) feedback.push('Aufgabenerfüllung: Der Text thematisiert die zentralen Aspekte der Aufgabe nur unzureichend. Beziehen Sie sich deutlicher auf die Fragestellung.');

  const timeMin = Math.round(timeUsedSec / 60);
  feedback.push(`Zeitmanagement: ${timeMin} Minuten verwendet.`);

  return {
    vocabularyRichness: vocabRichness,
    coherence,
    grammarPrecision,
    taskFulfillment,
    overall,
    band,
    feedback,
    wordCount,
    timeUsed: timeUsedSec,
  };
}
