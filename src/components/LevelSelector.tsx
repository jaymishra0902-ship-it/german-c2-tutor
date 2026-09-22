import type { Level } from '@/types';
import { LEVELS, LEVEL_META } from '@/types';

interface LevelSelectorProps {
  selected: Level;
  onSelect: (level: Level) => void;
}

export function LevelSelector({ selected, onSelect }: LevelSelectorProps) {
  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">Choose Your Proficiency Level</h2>
        <p className="text-zinc-500">The tutor adapts its evaluation criteria, vocabulary, and feedback depth to your level.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {LEVELS.map((level, i) => {
          const meta = LEVEL_META[level];
          const isActive = selected === level;
          return (
            <button
              key={level}
              onClick={() => onSelect(level)}
              className={`card card-hover p-5 text-left relative overflow-hidden group ${
                isActive ? 'border-white ring-1 ring-white' : ''
              }`}
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <div
                className="absolute top-0 left-0 w-full h-1"
                style={{ background: meta.color }}
              />
              <div className="flex items-start justify-between mb-3">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold border border-zinc-700"
                  style={{ background: isActive ? '#fff' : '#18181b', color: isActive ? '#000' : '#fff' }}
                >
                  {level}
                </div>
                {isActive && (
                  <span className="text-xs font-bold px-2 py-1 rounded-full bg-white text-black">
                    Active
                  </span>
                )}
              </div>
              <h3 className="text-lg font-semibold text-white mb-1">{meta.name}</h3>
              <p className="text-sm text-zinc-500 leading-relaxed">{meta.description}</p>
              <div className="mt-4 flex items-center gap-1">
                {LEVELS.map((l, idx) => (
                  <div
                    key={l}
                    className="h-1 flex-1 rounded-full"
                    style={{
                      background: idx <= LEVELS.indexOf(level) ? meta.color : '#27272a',
                    }}
                  />
                ))}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
