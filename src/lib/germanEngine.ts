import type { EvaluationResult, GrammarError, Level } from '@/types';

const ADVANCED_VOCAB = [
  'dennoch', 'zudem', 'dahingehend', 'insoweit', 'gleichwohl', 'nichtsdestotrotz',
  'obgleich', 'wenngleich', 'mithin', 'dementsprechend', 'hinsichtlich', 'bezüglich',
  'trotzdem', 'deshalb', 'infolgedessen', 'folglich', 'somit', 'darüber hinaus',
  'nicht zuletzt', 'nach wie vor', 'je nachdem', 'im Hinblick auf', 'in Anbetracht',
  'ungeachtet', 'vorausgesetzt', 'sofern', 'insofern', 'alsdann', 'hiernach',
  'ermöglichen', 'berücksichtigen', 'verdeutlichen', 'veranschaulichen', 'konstatieren',
  'postulieren', 'rekapitulieren', 'relativieren', 'legitimieren', 'revidieren',
  'Diskrepanz', 'Konvergenz', 'Divergenz', 'Paradigma', 'Implikation', 'Hermeneutik',
  'Synthese', 'Permutation', 'Prävalenz', 'Aporie', 'Diskurs', 'Korollar',
  'Prämisse', 'Postulat', 'Axiom', 'Hypothese', 'These', 'Antithese',
];

const STYLE_MARKERS = [
  'jedoch', 'allerdings', 'zwar', 'dagegen', 'hingegen', 'während', 'wobei',
  'sodass', 'damit', 'um', 'ohne', 'statt', 'trotz', 'trotzdem', 'aufgrund',
  'wegen', 'infolge', 'dank', 'mithilfe', 'angesichts', 'in Anbetracht',
  'einerseits', 'andererseits', 'zum einen', 'zum anderen',
  'nicht nur', 'sondern auch', 'sowohl', 'als auch', 'entweder', 'oder',
  'weder', 'noch', 'je', 'desto', 'umso',
];

const WEAK_FILLERS = [
  'sehr', 'ganz', 'echt', 'total', 'voll', 'irgendwie', 'irgendwas', 'so',
  'halt', 'eben', 'mal', 'irgendwo', 'irgendwann',
];

const COMMON_MISSPELLINGS: Record<string, string> = {
  'weil': 'weil',
  'dass': 'dass',
  'das': 'das',
  'seid': 'seit',
  'viel': 'viel',
  'wenig': 'wenig',
  'wieder': 'wieder',
  'wider': 'wider',
  'standart': 'Standard',
  'apro': 'apropos',
  'wiso': 'wieso',
  'entgültig': 'endgültig',
  'aufjedenfall': 'auf jeden Fall',
  'am anfang': 'am Anfang',
  'größer': 'größer',
};

function splitSentences(text: string): string[] {
  return text
    .split(/(?<=[.!?])\s+(?=[A-ZÄÖÜ])/)
    .map(s => s.trim())
    .filter(s => s.length > 0);
}

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[.,!?;:"'()«»„"''`]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length > 0);
}

function uniqueRatio(words: string[]): number {
  if (words.length === 0) return 0;
  return new Set(words).size / words.length;
}

function avgWordLength(words: string[]): number {
  if (words.length === 0) return 0;
  return words.reduce((s, w) => s + w.length, 0) / words.length;
}

function avgSentenceLength(sentences: string[], words: string[]): number {
  if (sentences.length === 0) return 0;
  return words.length / sentences.length;
}

function checkGrammar(text: string, sentences: string[], words: string[]): GrammarError[] {
  const errors: GrammarError[] = [];

  for (const [wrong, correct] of Object.entries(COMMON_MISSPELLINGS)) {
    if (wrong !== correct) {
      const re = new RegExp(`\\b${wrong}\\b`, 'gi');
      if (re.test(text)) {
        errors.push({
          type: 'spelling',
          message: `Possible misspelling: "${wrong}" should be "${correct}".`,
          excerpt: wrong,
          severity: 'medium',
        });
      }
    }
  }

  if (sentences.length > 1) {
    for (const s of sentences) {
      const first = s.trim()[0];
      if (first && first !== first.toUpperCase() && first !== first.toUpperCase()) {
        errors.push({
          type: 'grammar',
          message: 'Sentence should start with a capital letter.',
          excerpt: s.slice(0, 20) + '...',
          severity: 'low',
        });
      }
    }
  }

  for (const s of sentences) {
    if (!/[.!?]$/.test(s.trim())) {
      errors.push({
        type: 'punctuation',
        message: 'Sentence is missing terminal punctuation (. ! ?).',
        excerpt: s.slice(-20),
        severity: 'low',
      });
    }
  }

  const lower = text.toLowerCase();
  const weilCount = (lower.match(/\bweil\b/g) || []).length;
  const verbAtEnd = sentences.filter(s => {
    const lastWord = tokenize(s).slice(-1)[0] || '';
    return /\b(weil|dass|ob|wenn|als|damit|sodass|obwohl|während|wobei)\b/.test(s.toLowerCase()) &&
      !/^[,;]$/.test(lastWord);
  });

  if (verbAtEnd.length > 0 && weilCount > 0) {
    // Heuristic: check if subordinate clause verb is likely at the end
    for (const s of verbAtEnd.slice(0, 3)) {
      const tokens = tokenize(s);
      const last = tokens[tokens.length - 1] || '';
      if (last && !last.endsWith('t') && !last.endsWith('en') && !last.endsWith('e') && !last.endsWith('st')) {
        errors.push({
          type: 'syntax',
          message: 'Subordinate clause (weil/dass/wenn) verb may not be in the correct final position.',
          excerpt: s.slice(0, 30) + '...',
          severity: 'medium',
        });
      }
    }
  }

  const longRunOn = sentences.filter(s => tokenize(s).length > 35);
  for (const s of longRunOn) {
    errors.push({
      type: 'syntax',
      message: 'Sentence is very long (>35 words). Consider splitting for readability.',
      excerpt: s.slice(0, 30) + '...',
      severity: 'low',
    });
  }

  const doubleSpace = text.includes('  ');
  if (doubleSpace) {
    errors.push({
      type: 'punctuation',
      message: 'Double spaces detected. Use single spaces.',
      excerpt: '  ',
      severity: 'low',
    });
  }

  return errors;
}

function scoreGrammar(errors: GrammarError[], words: string[]): number {
  if (words.length === 0) return 0;
  const penalty = errors.reduce((sum, e) => sum + (e.severity === 'high' ? 12 : e.severity === 'medium' ? 7 : 3), 0);
  const errorRate = penalty / Math.max(words.length, 1) * 100;
  return Math.max(0, Math.min(100, Math.round(100 - errorRate * 3)));
}

function scoreVocabulary(words: string[], text: string): { score: number; hits: string[] } {
  if (words.length === 0) return { score: 0, hits: [] };
  const lower = text.toLowerCase();
  const hits = ADVANCED_VOCAB.filter(v => lower.includes(v.toLowerCase()));
  const uniqueness = uniqueRatio(words);
  const avgLen = avgWordLength(words);
  const longWords = words.filter(w => w.length >= 10).length;
  const longWordRatio = longWords / words.length;

  let score = 30;
  score += Math.min(25, uniqueness * 50);
  score += Math.min(20, (avgLen - 4) * 6);
  score += Math.min(15, longWordRatio * 80);
  score += Math.min(20, hits.length * 3);

  return { score: Math.max(0, Math.min(100, Math.round(score))), hits };
}

function scoreStyle(sentences: string[], words: string[], text: string): { score: number; notes: string[] } {
  if (words.length === 0) return { score: 0, notes: [] };
  const lower = text.toLowerCase();
  const notes: string[] = [];

  const styleHits = STYLE_MARKERS.filter(m => lower.includes(m.toLowerCase()));
  const fillerHits = WEAK_FILLERS.filter(f => {
    const re = new RegExp(`\\b${f}\\b`, 'gi');
    return re.test(text);
  });

  const avgSentLen = avgSentenceLength(sentences, words);
  const variance = (() => {
    if (sentences.length < 2) return 0;
    const lens = sentences.map(s => tokenize(s).length);
    const mean = lens.reduce((a, b) => a + b, 0) / lens.length;
    return Math.sqrt(lens.reduce((s, l) => s + (l - mean) ** 2, 0) / lens.length);
  })();

  let score = 35;
  score += Math.min(20, styleHits.length * 2.5);
  score -= Math.min(15, fillerHits.length * 4);
  score += Math.min(15, Math.min(variance, 8) * 1.5);
  score += Math.min(10, avgSentLen > 8 && avgSentLen < 22 ? 10 : 0);
  score -= Math.max(0, avgSentLen - 25) * 0.5;

  if (fillerHits.length > 0) {
    notes.push(`Reduce filler words: ${fillerHits.join(', ')}. They weaken academic register.`);
  }
  if (styleHits.length >= 3) {
    notes.push(`Good use of connectors and concessive structures (${styleHits.length} detected).`);
  }
  if (variance > 5) {
    notes.push('Varied sentence lengths create a natural, engaging rhythm.');
  } else if (sentences.length > 2) {
    notes.push('Sentence lengths are uniform — vary short and long sentences for stylistic effect.');
  }
  if (avgSentLen > 25) {
    notes.push('Sentences are quite long. Break some up for clarity.');
  }
  if (styleHits.length < 2 && words.length > 30) {
    notes.push('Add more transitional phrases (jedoch, darüber hinaus, mithin) to improve cohesion.');
  }

  return { score: Math.max(0, Math.min(100, Math.round(score))), notes };
}

function computeReadability(words: string[], sentences: string[]): number {
  if (words.length === 0 || sentences.length === 0) return 0;
  const asl = words.length / sentences.length;
  const awl = avgWordLength(words);
  // Amstel-adjusted: higher = more complex
  return Math.round(Math.min(100, (asl * 1.2 + awl * 8) / 2));
}

function estimateLevel(overall: number, vocabHits: number): Level {
  if (overall >= 88 && vocabHits >= 5) return 'C2';
  if (overall >= 78) return 'C1';
  if (overall >= 65) return 'B2';
  if (overall >= 50) return 'B1';
  if (overall >= 35) return 'A2';
  return 'A1';
}

export function evaluateText(text: string): EvaluationResult {
  const trimmed = text.trim();
  if (trimmed.length === 0) {
    return {
      overall: 0, grammar: 0, vocabulary: 0, style: 0,
      level: 'A1', wordCount: 0, sentenceCount: 0,
      errors: [], suggestions: [], vocabularyHits: [], styleNotes: [],
      readabilityIndex: 0,
    };
  }

  const sentences = splitSentences(trimmed);
  const words = tokenize(trimmed);
  const errors = checkGrammar(trimmed, sentences, words);
  const grammarScore = scoreGrammar(errors, words);
  const { score: vocabScore, hits } = scoreVocabulary(words, trimmed);
  const { score: styleScore, notes } = scoreStyle(sentences, words, trimmed);
  const readability = computeReadability(words, sentences);

  const overall = Math.round(grammarScore * 0.35 + vocabScore * 0.35 + styleScore * 0.30);
  const level = estimateLevel(overall, hits.length);

  const suggestions: string[] = [];
  if (grammarScore < 70) suggestions.push('Review subordinate clause word order (verb-final position) and capitalization rules.');
  if (vocabScore < 70) suggestions.push('Incorporate more academic vocabulary and C2-level expressions (e.g., dennoch, mithin, Diskrepanz).');
  if (styleScore < 70) suggestions.push('Diversify sentence structure: use concessive, conditional, and relative clauses.');
  if (suggestions.length === 0) suggestions.push('Excellent work — your writing shows strong command of German at an advanced level.');

  return {
    overall,
    grammar: grammarScore,
    vocabulary: vocabScore,
    style: styleScore,
    level,
    wordCount: words.length,
    sentenceCount: sentences.length,
    errors,
    suggestions,
    vocabularyHits: hits,
    styleNotes: notes,
    readabilityIndex: readability,
  };
}
