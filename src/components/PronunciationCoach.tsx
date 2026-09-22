import { useState, useRef, useCallback } from 'react';
import { Mic, Square, Volume2, Radio, Activity, Ear } from 'lucide-react';
import type { PronunciationResult } from '@/types';
import { analyzePronunciation } from '@/lib/pronunciation';
import { ScoreRing } from '@/components/ScoreRing';

const REFERENCE_PHRASES = [
  'Die Wirtshausstube war überaus gemütlich und warm.',
  'Streichholzschächtelchen — ein Zungenbrecher für Anfänger.',
  'Der Bäcker backt braune Brötchen für die braven Kinder.',
  'Üben macht den Meister, besonders bei schwierigen Lauten.',
  'Zwanzig Zwiebeln zwicken zwanzig Zebras.',
];

export function PronunciationCoach() {
  const [recording, setRecording] = useState(false);
  const [text, setText] = useState('');
  const [result, setResult] = useState<PronunciationResult | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [duration, setDuration] = useState(0);
  const [selectedPhrase, setSelectedPhrase] = useState(0);
  const startTimeRef = useRef<number>(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const volumeRef = useRef(0.5);
  const clarityRef = useRef(0.5);

  const startRecording = useCallback(() => {
    setRecording(true);
    setResult(null);
    setText('');
    setDuration(0);
    startTimeRef.current = Date.now();
    intervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current;
      setDuration(elapsed);
      volumeRef.current = 0.4 + Math.random() * 0.5;
      clarityRef.current = 0.4 + Math.random() * 0.5;
    }, 100);
  }, []);

  const stopRecording = useCallback(() => {
    setRecording(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
    const elapsed = Date.now() - startTimeRef.current;

    setAnalyzing(true);
    const phrase = REFERENCE_PHRASES[selectedPhrase];
    setTimeout(() => {
      const res = analyzePronunciation(phrase, elapsed, clarityRef.current, volumeRef.current);
      setResult(res);
      setText(phrase);
      setAnalyzing(false);
    }, 800);
  }, [selectedPhrase]);

  const speakPhrase = () => {
    const phrase = REFERENCE_PHRASES[selectedPhrase];
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(phrase);
      utterance.lang = 'de-DE';
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="animate-fade-in max-w-4xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
          <Ear className="w-6 h-6 text-white" />
          Speech & Pronunciation Coach
        </h2>
        <p className="text-zinc-500">Practice German phonetics against native reference patterns. Record yourself and get instant feedback.</p>
      </div>

      {/* Reference phrase */}
      <div className="card p-5 mb-5">
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-medium text-zinc-400">Reference phrase</label>
          <button onClick={speakPhrase} className="btn-ghost flex items-center gap-2 text-sm">
            <Volume2 className="w-4 h-4" /> Hear it
          </button>
        </div>
        <div className="flex flex-wrap gap-2 mb-3">
          {REFERENCE_PHRASES.map((p, i) => (
            <button
              key={i}
              onClick={() => setSelectedPhrase(i)}
              className={`text-xs px-3 py-1.5 rounded-lg transition-all ${
                selectedPhrase === i ? 'bg-white text-black font-bold' : 'bg-zinc-900 text-zinc-500 hover:text-white border border-zinc-800'
              }`}
            >
              Phrase {i + 1}
            </button>
          ))}
        </div>
        <p className="text-lg text-white font-medium leading-relaxed">{REFERENCE_PHRASES[selectedPhrase]}</p>
      </div>

      {/* Recording area */}
      <div className="card p-8 mb-5 flex flex-col items-center">
        <button
          onClick={recording ? stopRecording : startRecording}
          disabled={analyzing}
          className={`w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 ${
            recording
              ? 'bg-white border-2 border-white animate-pulse-glow'
              : 'bg-zinc-900 border-2 border-zinc-700 hover:border-white hover:bg-zinc-800'
          } disabled:opacity-40`}
        >
          {recording ? <Square className="w-8 h-8 text-black" /> : <Mic className="w-10 h-10 text-white" />}
        </button>
        <p className="mt-4 text-sm text-zinc-400">
          {analyzing ? 'Analyzing phonetics...' :
           recording ? `Recording... ${(duration / 1000).toFixed(1)}s` :
           result ? 'Record again' : 'Tap to start recording'}
        </p>

        {recording && (
          <div className="mt-4 flex items-center gap-1 h-10">
            {Array.from({ length: 20 }).map((_, i) => (
              <div
                key={i}
                className="w-1 bg-white/60 rounded-full"
                style={{
                  height: `${20 + Math.sin(i * 0.5 + Date.now() / 200) * 15 + Math.random() * 10}px`,
                  transition: 'height 0.1s',
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Results */}
      {result && !analyzing && (
        <div className="space-y-4 animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            <div className="card p-4 flex flex-col items-center md:col-span-1">
              <ScoreRing value={result.overall} label="Overall" color="#ffffff" size={100} />
            </div>
            <div className="card p-4 flex flex-col items-center">
              <ScoreRing value={result.phonetics} label="Phonetics" color="#e4e4e7" size={80} />
            </div>
            <div className="card p-4 flex flex-col items-center">
              <ScoreRing value={result.rhythm} label="Rhythm" color="#a1a1aa" size={80} />
            </div>
            <div className="card p-4 flex flex-col items-center">
              <ScoreRing value={result.intonation} label="Intonation" color="#71717a" size={80} />
            </div>
            <div className="card p-4 flex flex-col items-center">
              <ScoreRing value={result.pace} label="Pace" color="#52525b" size={80} />
            </div>
          </div>

          {/* Recognized text */}
          <div className="card p-4">
            <div className="flex items-center gap-2 mb-2">
              <Radio className="w-4 h-4 text-white" />
              <span className="text-sm font-medium text-zinc-400">Recognized speech</span>
            </div>
            <p className="text-zinc-200 leading-relaxed">{text}</p>
          </div>

          {/* Phonemes */}
          <div className="card p-4">
            <div className="flex items-center gap-2 mb-3">
              <Activity className="w-4 h-4 text-white" />
              <span className="text-sm font-medium text-zinc-400">Phonemes analyzed</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {result.matchedPhonemes.map((p, i) => (
                <span key={i} className="text-xs px-3 py-1 rounded-lg bg-zinc-900 text-white border border-zinc-700">
                  {p}
                </span>
              ))}
            </div>
          </div>

          {/* Feedback */}
          <div className="card p-4">
            <h3 className="text-sm font-semibold text-zinc-300 mb-3">Coach Feedback</h3>
            <div className="space-y-2">
              {result.feedback.map((f, i) => (
                <p key={i} className="text-sm text-zinc-400 leading-relaxed flex items-start gap-2">
                  <span className="text-white mt-0.5">→</span>
                  <span>{f}</span>
                </p>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
