export type Level = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';

export const LEVELS: Level[] = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

export const LEVEL_META: Record<Level, { name: string; color: string; description: string }> = {
  A1: { name: 'Beginner', color: '#a1a1aa', description: 'Basic phrases and everyday expressions.' },
  A2: { name: 'Elementary', color: '#8a8a93', description: 'Simple sentences, routine tasks.' },
  B1: { name: 'Intermediate', color: '#6b6b73', description: 'Clear standard input, travel situations.' },
  B2: { name: 'Upper Intermediate', color: '#52525b', description: 'Complex text, technical discussion.' },
  C1: { name: 'Advanced', color: '#3f3f46', description: 'Implicit meaning, fluent expression.' },
  C2: { name: 'Mastery', color: '#ffffff', description: 'Academic German, nuanced stylistic control.' },
};

export interface EvaluationResult {
  overall: number;
  grammar: number;
  vocabulary: number;
  style: number;
  level: Level;
  wordCount: number;
  sentenceCount: number;
  errors: GrammarError[];
  suggestions: string[];
  vocabularyHits: string[];
  styleNotes: string[];
  readabilityIndex: number;
}

export interface GrammarError {
  type: 'grammar' | 'spelling' | 'punctuation' | 'syntax';
  message: string;
  excerpt: string;
  severity: 'low' | 'medium' | 'high';
}

export interface Flashcard {
  id: string;
  front: string;
  back: string;
  example: string;
  category: string;
  difficulty: Level;
  interval: number;
  repetitions: number;
  easeFactor: number;
  dueDate: number;
  lastReviewed: number | null;
  createdAt: number;
}

export interface ReviewResult {
  quality: number;
  nextInterval: number;
  nextEase: number;
  nextReps: number;
}

export interface PronunciationResult {
  overall: number;
  phonetics: number;
  rhythm: number;
  intonation: number;
  pace: number;
  feedback: string[];
  matchedPhonemes: string[];
}
