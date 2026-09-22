import { useState } from 'react';
import { FileText, Sparkles, AlertCircle, BookOpen, PenTool, CheckCircle2 } from 'lucide-react';
import type { EvaluationResult, Level } from '@/types';
import { LEVEL_META } from '@/types';
import { evaluateText } from '@/lib/germanEngine';
import { ScoreRing } from '@/components/ScoreRing';

const SAMPLE_TEXT = `Trotz der unbestreitbaren Fortschritte, die in den letzten Jahrzehnten erzielt wurden, bleibt die Diskrepanz zwischen theoretischem Anspruch und empirischer Wirklichkeit beachtlich. Mithin lässt sich konstatieren, dass die vorliegenden Befunde zwar einerseits das Paradigma bestätigen, andererseits jedoch neue Fragen aufwerfen, die einer tiefergehenden Hermeneutik bedürfen. Nichtsdestotrotz sollte man die erreichten Resultate nicht relativieren, denn sie bilden eine solide Grundlage für künftige Forschungen.`;

interface EssayEvaluatorProps {
  level: Level;
}

export function EssayEvaluator({ level }: EssayEvaluatorProps) {
  const [text, setText] = useState('');
  const [result, setResult] = useState<EvaluationResult | null>(null);
  const [loading, setLoading] = useState(false);

  const handleEvaluate = () => {
    if (text.trim().length === 0) return;
    setLoading(true);
    setTimeout(() => {
      const res = evaluateText(text);
      setResult(res);
      setLoading(false);
      window.dispatchEvent(new CustomEvent('evaluation-complete', {
        detail: { overall: res.overall, level: res.level, date: Date.now() },
      }));
    }, 600);
  };

  const handleSample = () => {
    setText(SAMPLE_TEXT);
  };

  return (
    <div className="animate-fade-in max-w-5xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
          <FileText className="w-6 h-6 text-white" />
          AI Essay & Sentence Evaluator
        </h2>
        <p className="text-zinc-500">Paste your German writing for instant analysis across grammar, vocabulary, and style.</p>
      </div>

      <div className="card p-5 mb-6">
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-medium text-zinc-400">Your German text</label>
          <div className="flex items-center gap-2">
            <span className="text-xs text-zinc-600">{text.split(/\s+/).filter(w => w).length} words</span>
            <button onClick={handleSample} className="text-xs text-white hover:text-zinc-300 underline underline-offset-2 transition-colors">
              Load sample
            </button>
          </div>
        </div>
        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Schreiben Sie hier Ihren deutschen Text..."
          className="input-field w-full min-h-[180px] resize-y leading-relaxed"
          rows={8}
        />
        <div className="flex items-center justify-between mt-4">
          <span className="text-xs text-zinc-600">
            Evaluating at <span className="font-bold text-white">{level} — {LEVEL_META[level].name}</span>
          </span>
          <button
            onClick={handleEvaluate}
            disabled={text.trim().length === 0 || loading}
            className="btn-primary disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            {loading ? 'Analyzing...' : 'Evaluate'}
          </button>
        </div>
      </div>

      {loading && (
        <div className="card p-8 flex items-center justify-center">
          <div className="flex items-center gap-3 text-zinc-500">
            <div className="w-5 h-5 border-2 border-zinc-700 border-t-white rounded-full animate-spin" />
            <span>Analyzing grammar, vocabulary, and stylistic features...</span>
          </div>
        </div>
      )}

      {result && !loading && (
        <div className="space-y-5 animate-fade-in">
          {/* Score cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="card p-5 flex flex-col items-center">
              <ScoreRing value={result.overall} label="Overall" color="#ffffff" />
              <span className="mt-2 text-xs font-bold px-3 py-1 rounded-full bg-white text-black">
                Estimated: {result.level}
              </span>
            </div>
            <div className="card p-5 flex flex-col items-center">
              <ScoreRing value={result.grammar} label="Grammar" color="#e4e4e7" size={100} />
            </div>
            <div className="card p-5 flex flex-col items-center">
              <ScoreRing value={result.vocabulary} label="Vocab" color="#a1a1aa" size={100} />
            </div>
            <div className="card p-5 flex flex-col items-center">
              <ScoreRing value={result.style} label="Style" color="#71717a" size={100} />
            </div>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <StatCard label="Words" value={result.wordCount} />
            <StatCard label="Sentences" value={result.sentenceCount} />
            <StatCard label="Avg words/sentence" value={result.sentenceCount ? Math.round(result.wordCount / result.sentenceCount) : 0} />
            <StatCard label="Readability" value={result.readabilityIndex} suffix="/100" />
          </div>

          {/* C2 Advanced feedback */}
          {level === 'C2' && (
            <div className="card p-5 border-white/20">
              <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                <Sparkles className="w-4 h-4" /> C2 Advanced Feedback
              </h3>
              <div className="space-y-2">
                {result.suggestions.map((s, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm text-zinc-300">
                    <CheckCircle2 className="w-4 h-4 text-white mt-0.5 shrink-0" />
                    <span>{s}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Two column: errors + vocab */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Errors */}
            <div className="card p-5">
              <h3 className="text-sm font-semibold text-zinc-300 mb-3 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-white" /> Detected Issues ({result.errors.length})
              </h3>
              {result.errors.length === 0 ? (
                <p className="text-sm text-zinc-500">No issues detected. Your grammar looks clean.</p>
              ) : (
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {result.errors.map((err, i) => (
                    <div key={i} className="flex items-start gap-2 p-2 rounded-lg bg-black border border-zinc-800">
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold shrink-0 ${
                        err.severity === 'high' ? 'bg-white text-black' :
                        err.severity === 'medium' ? 'bg-zinc-600 text-white' :
                        'bg-zinc-800 text-zinc-400'
                      }`}>
                        {err.severity}
                      </span>
                      <div>
                        <p className="text-sm text-zinc-300">{err.message}</p>
                        <p className="text-xs text-zinc-600 mt-0.5 font-mono">"{err.excerpt}"</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Vocabulary hits */}
            <div className="card p-5">
              <h3 className="text-sm font-semibold text-zinc-300 mb-3 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-white" /> Advanced Vocabulary Detected ({result.vocabularyHits.length})
              </h3>
              {result.vocabularyHits.length === 0 ? (
                <p className="text-sm text-zinc-500">No advanced vocabulary detected. Try incorporating C1/C2-level terms.</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {result.vocabularyHits.map((v, i) => (
                    <span key={i} className="text-sm px-3 py-1 rounded-lg bg-zinc-900 text-white border border-zinc-700">
                      {v}
                    </span>
                  ))}
                </div>
              )}
              <h3 className="text-sm font-semibold text-zinc-300 mt-4 mb-2 flex items-center gap-2">
                <PenTool className="w-4 h-4 text-white" /> Style Notes
              </h3>
              <div className="space-y-1.5">
                {result.styleNotes.length === 0 ? (
                  <p className="text-sm text-zinc-500">No specific style notes.</p>
                ) : (
                  result.styleNotes.map((n, i) => (
                    <p key={i} className="text-sm text-zinc-400 leading-relaxed">• {n}</p>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value, suffix }: { label: string; value: number; suffix?: string }) {
  return (
    <div className="card p-3 text-center">
      <p className="text-xl font-bold text-white">{value}{suffix}</p>
      <p className="text-[10px] uppercase tracking-wider text-zinc-600 mt-1">{label}</p>
    </div>
  );
}
