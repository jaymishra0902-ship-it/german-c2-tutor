import { useState } from 'react';
import { BookOpen, Quote, Layers3, Lightbulb, ChevronDown } from 'lucide-react';
import type { IdiomEntry } from '@/data/idioms';
import { IDIOMS } from '@/data/idioms';

const REGISTERS = ['all', 'umgangssprachlich', 'gehoben', 'literarisch', 'fachsprachlich'] as const;
type RegisterFilter = typeof REGISTERS[number];

const REGISTER_LABELS: Record<string, string> = {
  umgangssprachlich: 'Umgangssprachlich',
  gehoben: 'Gehoben',
  literarisch: 'Literarisch',
  fachsprachlich: 'Fachsprachlich',
};

export function IdiomsShowcase() {
  const [filter, setFilter] = useState<RegisterFilter>('all');
  const [expanded, setExpanded] = useState<string | null>(null);

  const filtered = filter === 'all'
    ? IDIOMS
    : IDIOMS.filter(i => i.register === filter);

  return (
    <div className="animate-fade-in max-w-5xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-white" />
          C2 Idioms & Redewendungen
        </h2>
        <p className="text-zinc-500">Native German idioms with literal meaning, figurative C2 usage, and real-world sentence examples.</p>
      </div>

      {/* Filter */}
      <div className="flex flex-wrap gap-2 mb-5">
        {REGISTERS.map(r => (
          <button
            key={r}
            onClick={() => setFilter(r)}
            className={`text-xs px-3 py-1.5 rounded-lg transition-all ${
              filter === r
                ? 'bg-white text-black font-bold'
                : 'bg-zinc-900 text-zinc-500 hover:text-white border border-zinc-800'
            }`}
          >
            {r === 'all' ? 'All' : REGISTER_LABELS[r]}
          </button>
        ))}
      </div>

      {/* Idiom cards */}
      <div className="space-y-3">
        {filtered.map((idiom) => (
          <IdiomCard
            key={idiom.id}
            idiom={idiom}
            isExpanded={expanded === idiom.id}
            onToggle={() => setExpanded(expanded === idiom.id ? null : idiom.id)}
          />
        ))}
      </div>
    </div>
  );
}

function IdiomCard({ idiom, isExpanded, onToggle }: {
  idiom: IdiomEntry;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="card card-hover overflow-hidden">
      {/* Header — always visible */}
      <button
        onClick={onToggle}
        className="w-full p-4 flex items-center justify-between text-left"
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold px-2 py-0.5 rounded bg-zinc-900 text-zinc-500 border border-zinc-800">
              {REGISTER_LABELS[idiom.register]}
            </span>
          </div>
          <h3 className="text-base font-bold text-white">{idiom.idiom}</h3>
        </div>
        <ChevronDown className={`w-5 h-5 text-zinc-600 transition-transform duration-200 shrink-0 ${
          isExpanded ? 'rotate-180' : ''
        }`} />
      </button>

      {/* Expanded content */}
      {isExpanded && (
        <div className="px-4 pb-4 space-y-3 animate-fade-in">
          {/* Literal meaning */}
          <div className="p-3 rounded-xl bg-black border border-zinc-800">
            <div className="flex items-center gap-2 mb-1">
              <Layers3 className="w-4 h-4 text-zinc-500" />
              <span className="text-xs uppercase tracking-wider text-zinc-600">Literal Meaning</span>
            </div>
            <p className="text-sm text-zinc-400 italic">{idiom.literal}</p>
          </div>

          {/* Figurative meaning */}
          <div className="p-3 rounded-xl bg-white">
            <div className="flex items-center gap-2 mb-1">
              <Lightbulb className="w-4 h-4 text-black" />
              <span className="text-xs uppercase tracking-wider text-black font-bold">Figurative C2 Usage</span>
            </div>
            <p className="text-sm text-black leading-relaxed">{idiom.figurative}</p>
          </div>

          {/* Example sentence */}
          <div className="p-3 rounded-xl bg-black border border-zinc-800">
            <div className="flex items-center gap-2 mb-1">
              <Quote className="w-4 h-4 text-zinc-500" />
              <span className="text-xs uppercase tracking-wider text-zinc-600">Real-World Example</span>
            </div>
            <p className="text-sm text-zinc-300 leading-relaxed">"{idiom.example}"</p>
          </div>

          {/* Context */}
          <div className="flex items-start gap-2 text-xs text-zinc-600 leading-relaxed">
            <span className="text-white mt-0.5">◆</span>
            <span><span className="text-zinc-400 font-medium">Usage context:</span> {idiom.context}</span>
          </div>
        </div>
      )}
    </div>
  );
}
