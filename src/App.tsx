import { useState, useEffect, useCallback } from 'react';
import { LayoutDashboard, FileText, Ear, Layers, GraduationCap, ChevronRight, ClipboardCheck, BookOpen, PenTool } from 'lucide-react';
import type { Level, Flashcard } from '@/types';
import { LEVEL_META } from '@/types';
import { Dashboard } from '@/components/Dashboard';
import { LevelSelector } from '@/components/LevelSelector';
import { EssayEvaluator } from '@/components/EssayEvaluator';
import { PronunciationCoach } from '@/components/PronunciationCoach';
import { FlashcardEngine } from '@/components/FlashcardEngine';
import { ExamSimulator } from '@/components/ExamSimulator';
import { IdiomsShowcase } from '@/components/IdiomsShowcase';
import { GrammarDrills } from '@/components/GrammarDrills';
import { loadCards, saveCards } from '@/lib/srs';

type Page = 'dashboard' | 'level' | 'evaluator' | 'pronunciation' | 'flashcards' | 'exam' | 'idioms' | 'drills';

const NAV_ITEMS: { id: Page; label: string; icon: React.ReactNode }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
  { id: 'level', label: 'Level Selector', icon: <GraduationCap className="w-5 h-5" /> },
  { id: 'evaluator', label: 'Essay Evaluator', icon: <FileText className="w-5 h-5" /> },
  { id: 'pronunciation', label: 'Pronunciation', icon: <Ear className="w-5 h-5" /> },
  { id: 'flashcards', label: 'Flashcards', icon: <Layers className="w-5 h-5" /> },
  { id: 'exam', label: 'C2 Exam Prep', icon: <ClipboardCheck className="w-5 h-5" /> },
  { id: 'idioms', label: 'Idioms', icon: <BookOpen className="w-5 h-5" /> },
  { id: 'drills', label: 'Grammar Drills', icon: <PenTool className="w-5 h-5" /> },
];

interface EvaluationRecord {
  overall: number;
  level: Level;
  date: number;
}

function App() {
  const [page, setPage] = useState<Page>('dashboard');
  const [level, setLevel] = useState<Level>('C2');
  const [cards, setCards] = useState<Flashcard[]>(() => loadCards());
  const [evaluations, setEvaluations] = useState<EvaluationRecord[]>(() => {
    try {
      const raw = localStorage.getItem('german-tutor-evals-v1');
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const persistCards = useCallback((updated: Flashcard[]) => {
    setCards(updated);
    saveCards(updated);
  }, []);

  const persistEvals = (evals: EvaluationRecord[]) => {
    setEvaluations(evals);
    try {
      localStorage.setItem('german-tutor-evals-v1', JSON.stringify(evals));
    } catch {
      // ignore
    }
  };

  // Listen for evaluation completion from the evaluator
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail as EvaluationRecord;
      if (detail) {
        const updated = [...evaluations, detail].slice(-50);
        persistEvals(updated);
      }
    };
    window.addEventListener('evaluation-complete', handler);
    return () => window.removeEventListener('evaluation-complete', handler);
  }, [evaluations]);

  const navigate = (p: string) => {
    setPage(p as Page);
    setMobileNavOpen(false);
  };

  return (
    <div className="min-h-screen bg-black flex">
      {/* Sidebar */}
      <aside className={`fixed lg:sticky top-0 left-0 h-screen w-64 bg-black border-r border-zinc-800 flex flex-col z-40 transition-transform duration-300 ${
        mobileNavOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        {/* Logo */}
        <div className="px-6 py-6 border-b border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-black" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-white leading-tight">German Tutor</h1>
              <p className="text-[10px] text-zinc-600 uppercase tracking-wider">C2 AI Engine</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {NAV_ITEMS.map(item => (
            <button
              key={item.id}
              onClick={() => navigate(item.id)}
              className={`nav-item w-full ${page === item.id ? 'nav-item-active' : ''}`}
            >
              {item.icon}
              <span className="text-sm font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Level badge */}
        <div className="px-3 pb-4">
          <div className="card p-3 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center text-sm font-bold bg-white text-black">
              {level}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-zinc-600">Current level</p>
              <p className="text-sm text-white font-medium truncate">{LEVEL_META[level].name}</p>
            </div>
            <button onClick={() => navigate('level')} className="text-zinc-600 hover:text-white">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile overlay */}
      {mobileNavOpen && (
        <div className="fixed inset-0 bg-black/80 z-30 lg:hidden" onClick={() => setMobileNavOpen(false)} />
      )}

      {/* Main content */}
      <main className="flex-1 min-w-0">
        {/* Mobile header */}
        <div className="lg:hidden sticky top-0 z-20 bg-black/90 backdrop-blur border-b border-zinc-800 px-4 py-3 flex items-center justify-between">
          <button onClick={() => setMobileNavOpen(true)} className="btn-ghost p-2">
            <LayoutDashboard className="w-5 h-5" />
          </button>
          <span className="text-sm font-bold text-white">German Tutor</span>
          <div className="w-9" />
        </div>

        <div className="p-6 lg:p-8 max-w-7xl mx-auto">
          {page === 'dashboard' && (
            <Dashboard
              level={level}
              cards={cards}
              evaluations={evaluations}
              onNavigate={navigate}
            />
          )}
          {page === 'level' && (
            <LevelSelector selected={level} onSelect={setLevel} />
          )}
          {page === 'evaluator' && (
            <EssayEvaluator level={level} />
          )}
          {page === 'pronunciation' && <PronunciationCoach />}
          {page === 'flashcards' && (
            <FlashcardEngine level={level} />
          )}
          {page === 'exam' && (
            <ExamSimulator />
          )}
          {page === 'idioms' && (
            <IdiomsShowcase />
          )}
          {page === 'drills' && (
            <GrammarDrills />
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
