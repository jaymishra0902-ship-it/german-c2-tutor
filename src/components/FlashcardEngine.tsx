import { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { Layers, RotateCcw, Check, X, Clock, Brain, TrendingUp, Plus, Trash2, Download, ChevronDown, FileText, FileSpreadsheet } from 'lucide-react';
import type { Flashcard, Level } from '@/types';
import { LEVEL_META } from '@/types';
import { loadCards, saveCards, applyReview, getDueCards, getMasteryStats } from '@/lib/srs';
import { DEFAULT_FLASHCARDS, FLASHCARD_CATEGORIES } from '@/data/flashcards';
import { exportToCsv, exportToAnki } from '@/lib/export';

interface FlashcardEngineProps {
  level: Level;
}

export function FlashcardEngine({ level }: FlashcardEngineProps) {
  const [cards, setCards] = useState<Flashcard[]>(() => loadCards());
  const [reviewing, setReviewing] = useState(false);
  const [flipped, setFlipped] = useState(false);
  const [reviewQueue, setReviewQueue] = useState<Flashcard[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newFront, setNewFront] = useState('');
  const [newBack, setNewBack] = useState('');
  const [newCategory, setNewCategory] = useState(FLASHCARD_CATEGORIES[0]);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const exportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (exportRef.current && !exportRef.current.contains(e.target as Node)) {
        setShowExportMenu(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const stats = useMemo(() => getMasteryStats(cards), [cards]);
  const dueCards = useMemo(() => getDueCards(cards), [cards]);

  const persist = useCallback((updated: Flashcard[]) => {
    setCards(updated);
    saveCards(updated);
  }, []);

  const startReview = () => {
    const queue = dueCards.length > 0 ? dueCards : cards.slice(0, 10);
    setReviewQueue(queue);
    setCurrentIdx(0);
    setFlipped(false);
    setReviewing(true);
  };

  const handleReview = (quality: number) => {
    const card = reviewQueue[currentIdx];
    const updated = applyReview(card, quality);
    const newCards = cards.map(c => c.id === card.id ? updated : c);
    persist(newCards);

    if (currentIdx + 1 < reviewQueue.length) {
      setCurrentIdx(currentIdx + 1);
      setFlipped(false);
    } else {
      setReviewing(false);
      setFlipped(false);
    }
  };

  const handleAddCard = () => {
    if (newFront.trim().length === 0 || newBack.trim().length === 0) return;
    const now = Date.now();
    const card: Flashcard = {
      id: Math.random().toString(36).slice(2) + now.toString(36),
      front: newFront.trim(),
      back: newBack.trim(),
      example: '',
      category: newCategory,
      difficulty: level,
      interval: 0,
      repetitions: 0,
      easeFactor: 2.5,
      dueDate: now,
      lastReviewed: null,
      createdAt: now,
    };
    persist([card, ...cards]);
    setNewFront('');
    setNewBack('');
    setShowAddForm(false);
  };

  const handleDeleteCard = (id: string) => {
    persist(cards.filter(c => c.id !== id));
  };

  const handleReset = () => {
    const now = Date.now();
    const reset = DEFAULT_FLASHCARDS.map(c => ({
      ...c,
      id: Math.random().toString(36).slice(2) + now.toString(36),
      interval: 0,
      repetitions: 0,
      easeFactor: 2.5,
      dueDate: now,
      lastReviewed: null,
      createdAt: now,
    }));
    persist(reset);
  };

  // Review mode
  if (reviewing && reviewQueue.length > 0) {
    const card = reviewQueue[currentIdx];
    const progress = ((currentIdx) / reviewQueue.length) * 100;

    return (
      <div className="animate-fade-in max-w-3xl mx-auto">
        <div className="mb-4 flex items-center justify-between">
          <span className="text-sm text-zinc-500">Card {currentIdx + 1} of {reviewQueue.length}</span>
          <button onClick={() => setReviewing(false)} className="text-sm text-zinc-500 hover:text-white transition-colors">
            Exit review
          </button>
        </div>
        <div className="w-full bg-zinc-900 rounded-full h-1.5 mb-6">
          <div className="bg-white h-1.5 rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
        </div>

        <div
          onClick={() => setFlipped(!flipped)}
          className="card card-hover p-8 min-h-[280px] flex flex-col items-center justify-center cursor-pointer relative"
        >
          <span className="absolute top-4 left-4 text-xs px-2 py-1 rounded-lg bg-zinc-900 text-zinc-500 border border-zinc-800">
            {card.category}
          </span>
          <span className="absolute top-4 right-4 text-xs font-bold px-2 py-1 rounded-lg bg-white text-black">
            {card.difficulty}
          </span>
          {!flipped ? (
            <div className="text-center animate-flip-in">
              <p className="text-xs uppercase tracking-wider text-zinc-600 mb-4">Front</p>
              <p className="text-xl text-white font-medium leading-relaxed">{card.front}</p>
              <p className="text-xs text-zinc-600 mt-6">Click to reveal answer</p>
            </div>
          ) : (
            <div className="text-center animate-flip-in">
              <p className="text-xs uppercase tracking-wider text-white mb-4">Back</p>
              <p className="text-lg text-zinc-200 leading-relaxed">{card.back}</p>
              {card.example && (
                <p className="text-sm text-zinc-500 italic mt-4 px-4">"{card.example}"</p>
              )}
            </div>
          )}
        </div>

        {flipped && (
          <div className="mt-6 animate-fade-in">
            <p className="text-center text-sm text-zinc-500 mb-4">How well did you know this?</p>
            <div className="grid grid-cols-4 gap-3">
              <button onClick={() => handleReview(1)} className="card p-3 hover:border-white transition-all group">
                <X className="w-5 h-5 text-white mx-auto mb-1" />
                <p className="text-xs text-zinc-500 group-hover:text-white">Again</p>
              </button>
              <button onClick={() => handleReview(2)} className="card p-3 hover:border-white transition-all group">
                <Clock className="w-5 h-5 text-white mx-auto mb-1" />
                <p className="text-xs text-zinc-500 group-hover:text-white">Hard</p>
              </button>
              <button onClick={() => handleReview(4)} className="card p-3 hover:border-white transition-all group">
                <Check className="w-5 h-5 text-white mx-auto mb-1" />
                <p className="text-xs text-zinc-500 group-hover:text-white">Good</p>
              </button>
              <button onClick={() => handleReview(5)} className="card p-3 hover:border-white transition-all group">
                <Brain className="w-5 h-5 text-white mx-auto mb-1" />
                <p className="text-xs text-zinc-500 group-hover:text-white">Easy</p>
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Browse mode
  return (
    <div className="animate-fade-in max-w-5xl mx-auto">
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
            <Layers className="w-6 h-6 text-white" />
            SRS Flashcard Engine
          </h2>
          <p className="text-zinc-500">Spaced repetition for C2 idioms, Redewendungen, and academic vocabulary.</p>
        </div>
        <div className="flex gap-2">
          <div ref={exportRef} className="relative">
            <button
              onClick={() => setShowExportMenu(!showExportMenu)}
              disabled={cards.length === 0}
              className="btn-ghost flex items-center gap-2 text-sm disabled:opacity-40"
            >
              <Download className="w-4 h-4" /> Export
              <ChevronDown className="w-3 h-3" />
            </button>
            {showExportMenu && (
              <div className="absolute right-0 top-full mt-2 w-52 card p-2 z-20 animate-fade-in">
                <button
                  onClick={() => { exportToAnki(cards); setShowExportMenu(false); }}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-zinc-900 transition-colors text-left"
                >
                  <FileText className="w-4 h-4 text-white" />
                  <div>
                    <p className="text-sm text-white">Anki Deck (.txt)</p>
                    <p className="text-xs text-zinc-600">Tab-separated, importable</p>
                  </div>
                </button>
                <button
                  onClick={() => { exportToCsv(cards); setShowExportMenu(false); }}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-zinc-900 transition-colors text-left"
                >
                  <FileSpreadsheet className="w-4 h-4 text-white" />
                  <div>
                    <p className="text-sm text-white">CSV (.csv)</p>
                    <p className="text-xs text-zinc-600">Spreadsheet-compatible</p>
                  </div>
                </button>
              </div>
            )}
          </div>
          <button onClick={() => setShowAddForm(!showAddForm)} className="btn-ghost flex items-center gap-2 text-sm">
            <Plus className="w-4 h-4" /> Add
          </button>
          <button onClick={handleReset} className="btn-ghost flex items-center gap-2 text-sm">
            <RotateCcw className="w-4 h-4" /> Reset
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-5">
        <StatBox label="Total" value={stats.total} icon={<Layers className="w-4 h-4" />} />
        <StatBox label="Due now" value={stats.dueNow} icon={<Clock className="w-4 h-4" />} />
        <StatBox label="New" value={stats.newCards} icon={<Plus className="w-4 h-4" />} />
        <StatBox label="Young" value={stats.young} icon={<TrendingUp className="w-4 h-4" />} />
        <StatBox label="Mature" value={stats.mature} icon={<Brain className="w-4 h-4" />} />
      </div>

      {/* Start review button */}
      <button
        onClick={startReview}
        disabled={cards.length === 0}
        className="btn-primary w-full mb-5 disabled:opacity-40 flex items-center justify-center gap-2"
      >
        <Brain className="w-5 h-5" />
        {stats.dueNow > 0 ? `Start Review (${stats.dueNow} due)` : 'Start Practice Session'}
      </button>

      {/* Add form */}
      {showAddForm && (
        <div className="card p-5 mb-5 animate-fade-in">
          <h3 className="text-sm font-semibold text-zinc-300 mb-3">Create New Flashcard</h3>
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Front (German term or idiom)"
              value={newFront}
              onChange={e => setNewFront(e.target.value)}
              className="input-field w-full"
            />
            <textarea
              placeholder="Back (definition / translation)"
              value={newBack}
              onChange={e => setNewBack(e.target.value)}
              className="input-field w-full min-h-[80px] resize-y"
            />
            <select
              value={newCategory}
              onChange={e => setNewCategory(e.target.value)}
              className="input-field w-full"
            >
              {FLASHCARD_CATEGORIES.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <button onClick={handleAddCard} className="btn-primary text-sm">
              Save Card
            </button>
          </div>
        </div>
      )}

      {/* Card list */}
      <div className="space-y-2">
        {cards.map(card => (
          <div key={card.id} className="card p-4 flex items-center gap-4 group">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs px-2 py-0.5 rounded bg-zinc-900 text-zinc-500 border border-zinc-800">{card.category}</span>
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-white text-black">
                  {card.difficulty}
                </span>
                {card.repetitions > 0 && (
                  <span className="text-xs text-zinc-600">×{card.repetitions} reviewed</span>
                )}
              </div>
              <p className="text-sm text-white font-medium truncate">{card.front}</p>
              <p className="text-xs text-zinc-500 truncate">{card.back}</p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {card.repetitions >= 3 ? (
                <span className="text-xs text-white flex items-center gap-1 font-medium">
                  <Brain className="w-3 h-3" /> Mature
                </span>
              ) : card.dueDate <= Date.now() ? (
                <span className="text-xs text-zinc-400 flex items-center gap-1">
                  <Clock className="w-3 h-3" /> Due
                </span>
              ) : (
                <span className="text-xs text-zinc-600">
                  {Math.ceil((card.dueDate - Date.now()) / 86400000)}d
                </span>
              )}
              <button
                onClick={() => handleDeleteCard(card.id)}
                className="opacity-0 group-hover:opacity-100 text-zinc-600 hover:text-white transition-all"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function StatBox({ label, value, icon }: { label: string; value: number; icon: React.ReactNode }) {
  return (
    <div className="card p-3">
      <div className="flex items-center gap-2 mb-1 text-white">
        {icon}
        <span className="text-[10px] uppercase tracking-wider">{label}</span>
      </div>
      <p className="text-xl font-bold text-white">{value}</p>
    </div>
  );
}
