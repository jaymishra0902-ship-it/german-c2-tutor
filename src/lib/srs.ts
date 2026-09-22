import type { Flashcard, ReviewResult } from '@/types';
import { DEFAULT_FLASHCARDS } from '@/data/flashcards';

const STORAGE_KEY = 'german-tutor-flashcards-v1';

function uid(): string {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export function loadCards(): Flashcard[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Flashcard[];
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {
    // ignore
  }
  const now = Date.now();
  return DEFAULT_FLASHCARDS.map(c => ({
    ...c,
    id: uid(),
    interval: 0,
    repetitions: 0,
    easeFactor: 2.5,
    dueDate: now,
    lastReviewed: null,
    createdAt: now,
  }));
}

export function saveCards(cards: Flashcard[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cards));
  } catch {
    // ignore
  }
}

export function sm2Review(card: Flashcard, quality: number): ReviewResult {
  const q = Math.max(0, Math.min(5, quality));
  let { repetitions, easeFactor, interval } = card;

  if (q < 3) {
    repetitions = 0;
    interval = 1;
  } else {
    if (repetitions === 0) {
      interval = 1;
    } else if (repetitions === 1) {
      interval = 3;
    } else {
      interval = Math.round(interval * easeFactor);
    }
    repetitions += 1;
  }

  easeFactor = Math.max(1.3, easeFactor + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02)));

  return {
    quality: q,
    nextInterval: interval,
    nextEase: Math.round(easeFactor * 100) / 100,
    nextReps: repetitions,
  };
}

export function applyReview(card: Flashcard, quality: number): Flashcard {
  const result = sm2Review(card, quality);
  return {
    ...card,
    interval: result.nextInterval,
    repetitions: result.nextReps,
    easeFactor: result.nextEase,
    lastReviewed: Date.now(),
    dueDate: Date.now() + result.nextInterval * 86400000,
  };
}

export function getDueCards(cards: Flashcard[]): Flashcard[] {
  const now = Date.now();
  return cards.filter(c => c.dueDate <= now).sort((a, b) => a.dueDate - b.dueDate);
}

export function getMasteryStats(cards: Flashcard[]) {
  const total = cards.length;
  const mature = cards.filter(c => c.repetitions >= 3 && c.easeFactor >= 2.5).length;
  const young = cards.filter(c => c.repetitions >= 1 && c.repetitions < 3).length;
  const newCards = cards.filter(c => c.repetitions === 0).length;
  const dueNow = getDueCards(cards).length;
  return { total, mature, young, newCards, dueNow };
}
