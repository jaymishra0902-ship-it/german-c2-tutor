import { useState, useRef, useEffect, useCallback } from 'react';
import { Clock, FileText, Play, Square, CheckCircle2, AlertCircle, Timer } from 'lucide-react';
import type { ExamPrompt, GoetheScore, EssayType } from '@/data/examPrompts';
import { EXAM_PROMPTS, ESSAY_TYPE_LABELS } from '@/data/examPrompts';
import { gradeExamEssay } from '@/lib/goetheGrading';
import { ScoreRing } from '@/components/ScoreRing';

type ExamPhase = 'select' | 'writing' | 'results';

export function ExamSimulator() {
  const [phase, setPhase] = useState<ExamPhase>('select');
  const [selectedPrompt, setSelectedPrompt] = useState<ExamPrompt | null>(null);
  const [text, setText] = useState('');
  const [score, setScore] = useState<GoetheScore | null>(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [timeUsed, setTimeUsed] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startExam = (prompt: ExamPrompt) => {
    setSelectedPrompt(prompt);
    setText('');
    setScore(null);
    setTimeLeft(prompt.timeLimitMin * 60);
    setTimeUsed(0);
    setPhase('writing');
  };

  useEffect(() => {
    if (phase !== 'writing') return;
    intervalRef.current = setInterval(() => {
      setTimeLeft(prev => {
        setTimeUsed(used => used + 1);
        if (prev <= 1) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          handleFinish();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  const handleFinish = useCallback(() => {
    if (!selectedPrompt) return;
    if (intervalRef.current) clearInterval(intervalRef.current);
    const result = gradeExamEssay(
      text,
      selectedPrompt.type,
      timeUsed,
      selectedPrompt.minWords,
      selectedPrompt.maxWords,
    );
    setScore(result);
    setPhase('results');
  }, [text, selectedPrompt, timeUsed]);

  const handleBack = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setPhase('select');
    setSelectedPrompt(null);
  };

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const wordCount = text.trim().split(/\s+/).filter(w => w.length > 0).length;
  const timeWarning = timeLeft <= 300 && timeLeft > 0;

  // --- Select phase ---
  if (phase === 'select') {
    return (
      <div className="animate-fade-in max-w-5xl mx-auto">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
            <FileText className="w-6 h-6 text-white" />
            Goethe C2 Exam Simulator
          </h2>
          <p className="text-zinc-500">Timed formal essay writing prompts with instant evaluation mapped to official Goethe-Zertifikat C2 scoring criteria.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {EXAM_PROMPTS.map((prompt, i) => (
            <button
              key={prompt.id}
              onClick={() => startExam(prompt)}
              className="card card-hover p-5 text-left relative overflow-hidden group"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-white" />
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold px-2 py-1 rounded-lg bg-white text-black">
                  {ESSAY_TYPE_LABELS[prompt.type]}
                </span>
                <span className="text-xs text-zinc-600 flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {prompt.timeLimitMin}min
                </span>
              </div>
              <h3 className="text-base font-bold text-white mb-2">{prompt.title}</h3>
              <p className="text-sm text-zinc-500 leading-relaxed line-clamp-3">{prompt.prompt}</p>
              <div className="mt-4 flex items-center gap-3 text-xs text-zinc-600">
                <span>{prompt.minWords}–{prompt.maxWords} words</span>
                <span className="flex items-center gap-1 group-hover:text-white transition-colors">
                  <Play className="w-3 h-3" /> Start exam
                </span>
              </div>
            </button>
          ))}
        </div>

        {/* Scoring criteria info */}
        <div className="card p-5 mt-6">
          <h3 className="text-sm font-semibold text-zinc-300 mb-3 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-white" /> Goethe C2 Scoring Criteria
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <CriterionBox label="Wortschatzreichtum" desc="Vocabulary richness — range and precision of academic register" />
            <CriterionBox label="Kohärenz" desc="Coherence — logical flow, connectors, and text structure" />
            <CriterionBox label="Grammatikalische Präzision" desc="Grammar precision — accuracy of syntax, morphology, and orthography" />
            <CriterionBox label="Aufgabenerfüllung" desc="Task fulfillment — addressing all aspects of the prompt within word/time limits" />
          </div>
        </div>
      </div>
    );
  }

  // --- Writing phase ---
  if (phase === 'writing' && selectedPrompt) {
    return (
      <div className="animate-fade-in max-w-5xl mx-auto">
        {/* Timer bar */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold px-2 py-1 rounded-lg bg-white text-black">
              {ESSAY_TYPE_LABELS[selectedPrompt.type]}
            </span>
            <span className="text-sm text-zinc-500">{selectedPrompt.title}</span>
          </div>
          <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border ${
            timeWarning ? 'border-white bg-white text-black animate-pulse-glow' : 'border-zinc-800 bg-zinc-900 text-white'
          }`}>
            <Timer className="w-4 h-4" />
            <span className="text-lg font-bold font-mono">{formatTime(timeLeft)}</span>
          </div>
        </div>

        {/* Prompt */}
        <div className="card p-5 mb-4">
          <p className="text-white leading-relaxed mb-3">{selectedPrompt.prompt}</p>
          <div className="space-y-1.5">
            {selectedPrompt.instructions.map((inst, i) => (
              <p key={i} className="text-sm text-zinc-500 flex items-start gap-2">
                <span className="text-white mt-0.5 shrink-0">{i + 1}.</span>
                <span>{inst}</span>
              </p>
            ))}
          </div>
        </div>

        {/* Word count */}
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-zinc-600">
            {wordCount} / {selectedPrompt.minWords}–{selectedPrompt.maxWords} words
          </span>
          <span className={`text-xs font-medium ${
            wordCount >= selectedPrompt.minWords && wordCount <= selectedPrompt.maxWords ? 'text-white' : 'text-zinc-600'
          }`}>
            {wordCount >= selectedPrompt.minWords && wordCount <= selectedPrompt.maxWords
              ? 'Within range'
              : wordCount < selectedPrompt.minWords
                ? `${selectedPrompt.minWords - wordCount} more needed`
                : `${wordCount - selectedPrompt.maxWords} over limit`}
          </span>
        </div>

        {/* Textarea */}
        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Beginnen Sie hier Ihren Aufsatz..."
          className="input-field w-full min-h-[300px] resize-y leading-relaxed text-base"
          rows={14}
        />

        {/* Actions */}
        <div className="flex items-center justify-between mt-4">
          <button onClick={handleBack} className="btn-ghost text-sm">
            Cancel
          </button>
          <button
            onClick={handleFinish}
            disabled={text.trim().length === 0}
            className="btn-primary disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <Square className="w-4 h-4" />
            Submit & Evaluate
          </button>
        </div>
      </div>
    );
  }

  // --- Results phase ---
  if (phase === 'results' && score && selectedPrompt) {
    return (
      <div className="animate-fade-in max-w-5xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white mb-1">Exam Results</h2>
            <p className="text-zinc-500">{selectedPrompt.title} — {ESSAY_TYPE_LABELS[selectedPrompt.type]}</p>
          </div>
          <button onClick={handleBack} className="btn-ghost text-sm">
            Back to exams
          </button>
        </div>

        {/* Overall score + band */}
        <div className="card p-6 mb-5 flex flex-col md:flex-row items-center gap-6">
          <ScoreRing value={score.overall} label="Overall" color="#ffffff" size={140} />
          <div className="flex-1 text-center md:text-left">
            <p className="text-xs uppercase tracking-wider text-zinc-600 mb-1">Goethe C2 Band</p>
            <p className="text-2xl font-bold text-white mb-2">{score.band}</p>
            <div className="flex items-center gap-4 justify-center md:justify-start text-sm text-zinc-500">
              <span>{score.wordCount} words</span>
              <span>{Math.round(score.timeUsed / 60)} min used</span>
              <span>Limit: {selectedPrompt.timeLimitMin} min</span>
            </div>
          </div>
        </div>

        {/* Criteria scores */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5">
          <div className="card p-5 flex flex-col items-center">
            <ScoreRing value={score.vocabularyRichness} label="Wortschatz" color="#ffffff" size={100} />
          </div>
          <div className="card p-5 flex flex-col items-center">
            <ScoreRing value={score.coherence} label="Kohärenz" color="#e4e4e7" size={100} />
          </div>
          <div className="card p-5 flex flex-col items-center">
            <ScoreRing value={score.grammarPrecision} label="Grammatik" color="#a1a1aa" size={100} />
          </div>
          <div className="card p-5 flex flex-col items-center">
            <ScoreRing value={score.taskFulfillment} label="Aufgabe" color="#71717a" size={100} />
          </div>
        </div>

        {/* Feedback */}
        <div className="card p-5 mb-5">
          <h3 className="text-sm font-semibold text-zinc-300 mb-3 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-white" /> Examiner Feedback
          </h3>
          <div className="space-y-2">
            {score.feedback.map((f, i) => (
              <p key={i} className="text-sm text-zinc-400 leading-relaxed flex items-start gap-2">
                <span className="text-white mt-0.5">→</span>
                <span>{f}</span>
              </p>
            ))}
          </div>
        </div>

        {/* Submitted text */}
        <div className="card p-5">
          <h3 className="text-sm font-semibold text-zinc-300 mb-3">Your Essay</h3>
          <p className="text-sm text-zinc-400 leading-relaxed whitespace-pre-wrap">{text}</p>
        </div>
      </div>
    );
  }

  return null;
}

function CriterionBox({ label, desc }: { label: string; desc: string }) {
  return (
    <div className="p-3 rounded-xl bg-black border border-zinc-800">
      <p className="text-sm font-bold text-white mb-1">{label}</p>
      <p className="text-xs text-zinc-500 leading-relaxed">{desc}</p>
    </div>
  );
}
