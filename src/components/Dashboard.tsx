import { Brain, FileText, Ear, Layers, TrendingUp, Trophy, Clock, Target } from 'lucide-react';
import type { Flashcard, Level } from '@/types';
import { LEVEL_META } from '@/types';
import { getMasteryStats, getDueCards } from '@/lib/srs';

interface DashboardProps {
  level: Level;
  cards: Flashcard[];
  evaluations: { overall: number; level: Level; date: number }[];
  onNavigate: (page: string) => void;
}

export function Dashboard({ level, cards, evaluations, onNavigate }: DashboardProps) {
  const stats = getMasteryStats(cards);
  const dueCount = getDueCards(cards).length;
  const avgScore = evaluations.length > 0
    ? Math.round(evaluations.reduce((s, e) => s + e.overall, 0) / evaluations.length)
    : 0;
  const bestScore = evaluations.length > 0 ? Math.max(...evaluations.map(e => e.overall)) : 0;
  const recentEvals = evaluations.slice(-5).reverse();

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-1">Willkommen zurück</h2>
        <p className="text-zinc-500">
          Currently at <span className="font-medium text-white">{level} — {LEVEL_META[level].name}</span>. {dueCount > 0 ? `${dueCount} cards due for review.` : 'All caught up!'}
        </p>
      </div>

      {/* Score cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <ScoreCard
          label="Average Score"
          value={avgScore}
          suffix="/100"
          icon={<TrendingUp className="w-5 h-5" />}
          onClick={() => onNavigate('evaluator')}
        />
        <ScoreCard
          label="Best Score"
          value={bestScore}
          suffix="/100"
          icon={<Trophy className="w-5 h-5" />}
          onClick={() => onNavigate('evaluator')}
        />
        <ScoreCard
          label="Cards Mastered"
          value={stats.mature}
          suffix={`/${stats.total}`}
          icon={<Brain className="w-5 h-5" />}
          onClick={() => onNavigate('flashcards')}
        />
        <ScoreCard
          label="Due Today"
          value={dueCount}
          icon={<Clock className="w-5 h-5" />}
          onClick={() => onNavigate('flashcards')}
        />
      </div>

      {/* Mastery progress */}
      <div className="card p-5 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-zinc-300 flex items-center gap-2">
            <Target className="w-4 h-4 text-white" /> Flashcard Mastery Progress
          </h3>
          <span className="text-xs text-zinc-600">{Math.round((stats.mature / Math.max(stats.total, 1)) * 100)}% mastered</span>
        </div>
        <div className="flex gap-1 h-3 rounded-full overflow-hidden bg-black border border-zinc-800">
          <div style={{ width: `${(stats.mature / Math.max(stats.total, 1)) * 100}%` }} className="bg-white transition-all duration-700" />
          <div style={{ width: `${(stats.young / Math.max(stats.total, 1)) * 100}%` }} className="bg-zinc-500 transition-all duration-700" />
          <div style={{ width: `${(stats.newCards / Math.max(stats.total, 1)) * 100}%` }} className="bg-zinc-800 transition-all duration-700" />
        </div>
        <div className="flex items-center gap-4 mt-3 text-xs text-zinc-400">
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-white" /> Mature ({stats.mature})</span>
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-zinc-500" /> Young ({stats.young})</span>
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-zinc-800 border border-zinc-700" /> New ({stats.newCards})</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Quick actions */}
        <div className="card p-5">
          <h3 className="text-sm font-semibold text-zinc-300 mb-4">Quick Actions</h3>
          <div className="space-y-2">
            <QuickAction icon={<FileText className="w-5 h-5" />} label="Evaluate an essay" desc="Get instant grammar & style feedback" onClick={() => onNavigate('evaluator')} />
            <QuickAction icon={<Ear className="w-5 h-5" />} label="Practice pronunciation" desc="Record and analyze your speech" onClick={() => onNavigate('pronunciation')} />
            <QuickAction icon={<Layers className="w-5 h-5" />} label="Review flashcards" desc={`${dueCount} cards due`} onClick={() => onNavigate('flashcards')} />
          </div>
        </div>

        {/* Recent evaluations */}
        <div className="card p-5">
          <h3 className="text-sm font-semibold text-zinc-300 mb-4">Recent Evaluations</h3>
          {recentEvals.length === 0 ? (
            <p className="text-sm text-zinc-500">No evaluations yet. Try the essay evaluator to get started.</p>
          ) : (
            <div className="space-y-2">
              {recentEvals.map((e, i) => (
                <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-black border border-zinc-800">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold bg-white text-black">
                      {e.level}
                    </div>
                    <div>
                      <p className="text-sm text-white font-medium">{e.overall}/100</p>
                      <p className="text-xs text-zinc-600">{new Date(e.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="w-20 h-1.5 rounded-full bg-zinc-800 overflow-hidden">
                    <div className="h-full rounded-full bg-white" style={{ width: `${e.overall}%` }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ScoreCard({ label, value, suffix, icon, onClick }: {
  label: string; value: number; suffix?: string; icon: React.ReactNode; onClick: () => void;
}) {
  return (
    <button onClick={onClick} className="card card-hover p-4 text-left">
      <div className="flex items-center justify-between mb-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-white text-black">
          {icon}
        </div>
      </div>
      <p className="text-2xl font-bold text-white">{value}{suffix}</p>
      <p className="text-xs uppercase tracking-wider text-zinc-600 mt-1">{label}</p>
    </button>
  );
}

function QuickAction({ icon, label, desc, onClick }: {
  icon: React.ReactNode; label: string; desc: string; onClick: () => void;
}) {
  return (
    <button onClick={onClick} className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-zinc-900 transition-all text-left group">
      <div className="w-10 h-10 rounded-xl bg-zinc-900 flex items-center justify-center text-white group-hover:bg-white group-hover:text-black transition-colors">
        {icon}
      </div>
      <div>
        <p className="text-sm text-white font-medium">{label}</p>
        <p className="text-xs text-zinc-600">{desc}</p>
      </div>
    </button>
  );
}
