import { useState, useMemo } from 'react';
import { PenTool, Check, X, ArrowRight, RotateCcw, Trophy, BookMarked } from 'lucide-react';
import type { DrillCategory, GrammarQuestion } from '@/data/grammarDrills';
import { DRILL_CATEGORIES, CATEGORY_LABELS, GRAMMAR_QUESTIONS } from '@/data/grammarDrills';

type Phase = 'select' | 'drill' | 'results';

interface CategoryScore {
  correct: number;
  total: number;
}

export function GrammarDrills() {
  const [phase, setPhase] = useState<Phase>('select');
  const [selectedCategory, setSelectedCategory] = useState<DrillCategory | 'all'>('all');
  const [questions, setQuestions] = useState<GrammarQuestion[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [scores, setScores] = useState<Record<string, CategoryScore>>({});
  const [answeredCorrect, setAnsweredCorrect] = useState(0);

  const startDrill = (category: DrillCategory | 'all') => {
    setSelectedCategory(category);
    const pool = category === 'all'
      ? GRAMMAR_QUESTIONS
      : GRAMMAR_QUESTIONS.filter(q => q.category === category);
    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    setQuestions(shuffled);
    setCurrentIdx(0);
    setSelectedAnswer(null);
    setShowFeedback(false);
    setAnsweredCorrect(0);
    setScores({});
    setPhase('drill');
  };

  const handleAnswer = (index: number) => {
    if (showFeedback) return;
    setSelectedAnswer(index);
    setShowFeedback(true);

    const question = questions[currentIdx];
    const isCorrect = index === question.correctIndex;
    if (isCorrect) setAnsweredCorrect(prev => prev + 1);

    setScores(prev => {
      const cat = question.category;
      const existing = prev[cat] || { correct: 0, total: 0 };
      return {
        ...prev,
        [cat]: {
          correct: existing.correct + (isCorrect ? 1 : 0),
          total: existing.total + 1,
        },
      };
    });
  };

  const handleNext = () => {
    if (currentIdx + 1 < questions.length) {
      setCurrentIdx(currentIdx + 1);
      setSelectedAnswer(null);
      setShowFeedback(false);
    } else {
      setPhase('results');
    }
  };

  const handleRestart = () => {
    setPhase('select');
    setSelectedCategory('all');
  };

  // --- Select phase ---
  if (phase === 'select') {
    return (
      <div className="animate-fade-in max-w-5xl mx-auto">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
            <PenTool className="w-6 h-6 text-white" />
            C2 Grammar Drills
          </h2>
          <p className="text-zinc-500">Interactive quiz engine targeting C2 edge cases with instant correction and detailed grammatical rules.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <DrillCategoryCard
            label="All Categories"
            description="Mixed drills across all four C2 grammar topics"
            count={GRAMMAR_QUESTIONS.length}
            onClick={() => startDrill('all')}
          />
          {DRILL_CATEGORIES.map((cat) => {
            const count = GRAMMAR_QUESTIONS.filter(q => q.category === cat.id).length;
            return (
              <DrillCategoryCard
                key={cat.id}
                label={cat.label}
                description={cat.description}
                count={count}
                onClick={() => startDrill(cat.id)}
              />
            );
          })}
        </div>
      </div>
    );
  }

  // --- Drill phase ---
  if (phase === 'drill' && questions.length > 0) {
    const question = questions[currentIdx];
    const progress = (currentIdx / questions.length) * 100;
    const isCorrect = selectedAnswer === question.correctIndex;

    return (
      <div className="animate-fade-in max-w-3xl mx-auto">
        <div className="mb-4 flex items-center justify-between">
          <span className="text-sm text-zinc-500">
            Question {currentIdx + 1} of {questions.length}
          </span>
          <span className="text-xs font-bold px-2 py-1 rounded-lg bg-white text-black">
            {CATEGORY_LABELS[question.category]}
          </span>
        </div>
        <div className="w-full bg-zinc-900 rounded-full h-1.5 mb-6">
          <div className="bg-white h-1.5 rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
        </div>

        {/* Question */}
        <div className="card p-6 mb-4">
          <p className="text-lg text-white leading-relaxed">{question.question}</p>
        </div>

        {/* Options */}
        <div className="space-y-2 mb-4">
          {question.options.map((option, i) => {
            const isSelected = selectedAnswer === i;
            const isAnswerCorrect = i === question.correctIndex;
            let className = 'card p-4 cursor-pointer transition-all ';

            if (showFeedback) {
              if (isAnswerCorrect) {
                className += 'border-white bg-white';
              } else if (isSelected) {
                className += 'border-zinc-600 bg-zinc-900';
              } else {
                className += 'opacity-50';
              }
            } else {
              className += 'hover:border-white cursor-pointer';
            }

            return (
              <button
                key={i}
                onClick={() => handleAnswer(i)}
                disabled={showFeedback}
                className={className}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-sm ${showFeedback && isAnswerCorrect ? 'text-black font-bold' : 'text-white'}`}>
                    {option}
                  </span>
                  {showFeedback && isAnswerCorrect && (
                    <Check className="w-5 h-5 text-black" />
                  )}
                  {showFeedback && isSelected && !isAnswerCorrect && (
                    <X className="w-5 h-5 text-white" />
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Feedback */}
        {showFeedback && (
          <div className="animate-fade-in space-y-3">
            <div className={`card p-4 ${isCorrect ? 'border-white' : 'border-zinc-700'}`}>
              <p className={`text-sm font-bold mb-2 ${isCorrect ? 'text-white' : 'text-zinc-400'}`}>
                {isCorrect ? 'Correct!' : 'Not quite.'}
              </p>
              <div className="space-y-2">
                <div>
                  <p className="text-xs uppercase tracking-wider text-zinc-600 mb-1">Rule</p>
                  <p className="text-sm text-zinc-300 leading-relaxed">{question.rule}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-zinc-600 mb-1">Explanation</p>
                  <p className="text-sm text-zinc-400 leading-relaxed">{question.explanation}</p>
                </div>
              </div>
            </div>

            <button
              onClick={handleNext}
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              {currentIdx + 1 < questions.length ? (
                <>Next Question <ArrowRight className="w-4 h-4" /></>
              ) : (
                <>See Results <Trophy className="w-4 h-4" /></>
              )}
            </button>
          </div>
        )}
      </div>
    );
  }

  // --- Results phase ---
  if (phase === 'results') {
    const totalAnswered = questions.length;
    const percentage = Math.round((answeredCorrect / totalAnswered) * 100);

    return (
      <div className="animate-fade-in max-w-3xl mx-auto">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white mb-1">Drill Results</h2>
          <p className="text-zinc-500">
            {answeredCorrect} of {totalAnswered} correct — {percentage}%
          </p>
        </div>

        {/* Overall score */}
        <div className="card p-6 mb-5 flex items-center gap-6">
          <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center shrink-0">
            <span className="text-2xl font-bold text-black">{percentage}</span>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wider text-zinc-600 mb-1">Overall Score</p>
            <p className="text-lg font-bold text-white">
              {percentage >= 80 ? 'Excellent C2 command' :
               percentage >= 60 ? 'Solid — keep drilling' :
               'Needs more practice'}
            </p>
          </div>
        </div>

        {/* Per-category breakdown */}
        <div className="card p-5 mb-5">
          <h3 className="text-sm font-semibold text-zinc-300 mb-3 flex items-center gap-2">
            <BookMarked className="w-4 h-4 text-white" /> Per-Category Breakdown
          </h3>
          <div className="space-y-3">
            {Object.entries(scores).map(([cat, score]) => {
              const pct = Math.round((score.correct / score.total) * 100);
              return (
                <div key={cat}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-white font-medium">{CATEGORY_LABELS[cat as DrillCategory]}</span>
                    <span className="text-xs text-zinc-500">{score.correct}/{score.total}</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-zinc-900 overflow-hidden">
                    <div className="h-full rounded-full bg-white transition-all duration-500" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <button onClick={handleRestart} className="btn-primary w-full flex items-center justify-center gap-2">
          <RotateCcw className="w-4 h-4" /> Back to Drills
        </button>
      </div>
    );
  }

  return null;
}

function DrillCategoryCard({ label, description, count, onClick }: {
  label: string;
  description: string;
  count: number;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="card card-hover p-5 text-left relative overflow-hidden group"
    >
      <div className="absolute top-0 left-0 w-full h-1 bg-white" />
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-base font-bold text-white">{label}</h3>
        <span className="text-xs text-zinc-600">{count} questions</span>
      </div>
      <p className="text-sm text-zinc-500 leading-relaxed mb-3">{description}</p>
      <div className="flex items-center gap-1 text-xs text-zinc-600 group-hover:text-white transition-colors">
        <PenTool className="w-3 h-3" /> Start drilling
      </div>
    </button>
  );
}
