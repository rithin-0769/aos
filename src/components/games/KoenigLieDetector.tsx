import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Zap, Shield, CheckCircle, XCircle, RotateCcw, Timer, ChevronRight, AlertTriangle } from 'lucide-react';

interface Question {
  statement: string;
  isTrue: boolean;
  category: string;
  explanation: string;
}

const QUESTIONS: Question[] = [
  {
    statement: "Phil Coulson was killed by Loki with a Chitauri scepter before being revived through Project T.A.H.I.T.I.",
    isTrue: true,
    category: "S.H.I.E.L.D. Files",
    explanation: "Coulson was indeed killed by Loki and revived using GH-325 from the T.A.H.I.T.I. project.",
  },
  {
    statement: "Grant Ward was a loyal S.H.I.E.L.D. agent throughout the entire series.",
    isTrue: false,
    category: "HYDRA Intel",
    explanation: "Ward was revealed to be a HYDRA sleeper agent in Season 1.",
  },
  {
    statement: "Skye's real name is Daisy Johnson, also known as Quake.",
    isTrue: true,
    category: "Inhuman Registry",
    explanation: "Skye discovered her birth name was Daisy Johnson, and she gained earthquake powers as an Inhuman.",
  },
  {
    statement: "The Darkhold was written by the Ancient One from Doctor Strange.",
    isTrue: false,
    category: "Artifact Database",
    explanation: "The Darkhold was written by the dark elder god Chthon, not the Ancient One.",
  },
  {
    statement: "Leo Fitz and Jemma Simmons got married during the series.",
    isTrue: true,
    category: "Personnel Records",
    explanation: "FitzSimmons married in Season 5 in a ceremony officiated by Coulson.",
  },
  {
    statement: "The Framework was a virtual reality created by Holden Radcliffe and AIDA.",
    isTrue: true,
    category: "Tech Division",
    explanation: "Radcliffe and AIDA created the Framework, a virtual world where regrets were removed.",
  },
  {
    statement: "Melinda May earned the nickname 'The Cavalry' for saving a team using a horse in combat.",
    isTrue: false,
    category: "Personnel Records",
    explanation: "May earned 'The Cavalry' for single-handedly taking down an Inhuman threat in Bahrain — no horses involved.",
  },
  {
    statement: "There are exactly three Koenig brothers: Eric, Billy, and Sam.",
    isTrue: false,
    category: "Koenig Files",
    explanation: "There are more Koenigs, including Thurston and LT (their sister). The family is larger than three.",
  },
  {
    statement: "AIDA became a real human using knowledge from the Darkhold.",
    isTrue: true,
    category: "Tech Division",
    explanation: "AIDA used the Darkhold's knowledge to build a machine that gave her a real human body.",
  },
  {
    statement: "The Monolith that transported Simmons to Maveth was of Kree origin.",
    isTrue: true,
    category: "Artifact Database",
    explanation: "The Kree Monolith was a portal to the planet Maveth, where Hive was banished.",
  },
  {
    statement: "Hive was an ancient HYDRA leader who could possess living humans.",
    isTrue: false,
    category: "HYDRA Intel",
    explanation: "Hive could only inhabit dead bodies, not living humans. He took over Grant Ward's corpse.",
  },
  {
    statement: "Yo-Yo Rodriguez has the power to run at superhuman speed indefinitely.",
    isTrue: false,
    category: "Inhuman Registry",
    explanation: "Yo-Yo snaps back to her starting point after each burst — she can't run indefinitely.",
  },
  {
    statement: "Coulson used a prosthetic hand after his real hand was cut off by Mack.",
    isTrue: true,
    category: "S.H.I.E.L.D. Files",
    explanation: "Mack cut off Coulson's hand in Season 2 to stop a Terrigen crystal from killing him.",
  },
  {
    statement: "Ghost Rider in Agents of S.H.I.E.L.D. was Johnny Blaze.",
    isTrue: false,
    category: "Enhanced Index",
    explanation: "The Ghost Rider in the show was Robbie Reyes, not Johnny Blaze.",
  },
  {
    statement: "Deke Shaw is FitzSimmons' grandson from the future.",
    isTrue: true,
    category: "Temporal Records",
    explanation: "Deke was revealed to be the grandson of Fitz and Simmons from a dystopian future timeline.",
  },
  {
    statement: "The Chronicoms were a race of synthetic beings who wanted to make Earth their new home planet called Chronyca-2.",
    isTrue: true,
    category: "Alien Database",
    explanation: "After Chronyca-2 was destroyed, the Chronicom Hunters sought to take over Earth.",
  },
  {
    statement: "Agent Triplett was an Inhuman who gained powers after exposure to Terrigen mist.",
    isTrue: false,
    category: "Personnel Records",
    explanation: "Triplett was human — he was killed when a Terrigen crystal turned him to stone in the Kree temple.",
  },
  {
    statement: "The Zephyr One was originally designed by Leo Fitz.",
    isTrue: true,
    category: "Tech Division",
    explanation: "Fitz designed the Zephyr One, S.H.I.E.L.D.'s advanced mobile command aircraft.",
  },
];

type GamePhase = 'intro' | 'playing' | 'feedback' | 'results';

const TIMER_SECONDS = 10;

const getRating = (score: number, total: number): { title: string; description: string; color: string } => {
  const pct = score / total;
  if (pct >= 0.95) return { title: "Director-Class Analyst", description: "Fury himself would be impressed. You see through every deception.", color: "text-amber-300" };
  if (pct >= 0.8) return { title: "Level 10 Operative", description: "Outstanding interrogation instincts. Koenig approves.", color: "text-amber-400" };
  if (pct >= 0.65) return { title: "Senior Field Agent", description: "Solid lie detection skills. You'd survive a HYDRA infiltration.", color: "text-sky-400" };
  if (pct >= 0.5) return { title: "Junior Agent", description: "You've got potential, but Ward would've fooled you.", color: "text-slate-300" };
  if (pct >= 0.3) return { title: "Clearance Level: Confused", description: "You might need to re-read your S.H.I.E.L.D. briefings.", color: "text-orange-400" };
  return { title: "HYDRA Sympathizer?", description: "Your answers are suspicious. Report to Agent May immediately.", color: "text-red-400" };
};

// Heartbeat pulse line SVG component
const PulseLine: React.FC<{ active: boolean; result?: 'correct' | 'wrong' | null }> = ({ active, result }) => {
  const color = result === 'correct' ? '#22c55e' : result === 'wrong' ? '#ef4444' : '#f59e0b';
  const glowColor = result === 'correct' ? '0 0 12px #22c55e' : result === 'wrong' ? '0 0 12px #ef4444' : '0 0 12px #f59e0b';

  return (
    <div className="w-full overflow-hidden h-16 relative">
      <svg
        viewBox="0 0 800 80"
        className="w-full h-full"
        preserveAspectRatio="none"
        style={{ filter: `drop-shadow(${glowColor})` }}
      >
        {/* Background grid lines */}
        {[20, 40, 60].map((y) => (
          <line key={y} x1="0" y1={y} x2="800" y2={y} stroke="#334155" strokeWidth="0.5" />
        ))}
        {Array.from({ length: 20 }, (_, i) => i * 40).map((x) => (
          <line key={x} x1={x} y1="0" x2={x} y2="80" stroke="#334155" strokeWidth="0.5" />
        ))}

        {/* Pulse line */}
        <polyline
          points="0,40 80,40 120,40 140,15 160,65 180,25 200,55 220,40 300,40 340,40 360,15 380,65 400,25 420,55 440,40 520,40 560,40 580,15 600,65 620,25 640,55 660,40 740,40 800,40"
          fill="none"
          stroke={color}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            animation: active ? 'pulseScroll 2s linear infinite' : 'none',
            opacity: active ? 1 : 0.4,
          }}
        />

        {/* Scanning line */}
        {active && (
          <line
            x1="0" y1="0" x2="0" y2="80"
            stroke={color}
            strokeWidth="2"
            opacity="0.6"
            style={{
              animation: 'scanLine 2s linear infinite',
            }}
          />
        )}
      </svg>
    </div>
  );
};

export const KoenigLieDetector: React.FC = () => {
  const [phase, setPhase] = useState<GamePhase>('intro');
  const [questionIndex, setQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(TIMER_SECONDS);
  const [lastResult, setLastResult] = useState<'correct' | 'wrong' | null>(null);
  const [feedbackText, setFeedbackText] = useState('');
  const [answers, setAnswers] = useState<('correct' | 'wrong' | 'timeout')[]>([]);
  const [shuffledQuestions, setShuffledQuestions] = useState<Question[]>([]);
  const [feedbackVisible, setFeedbackVisible] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Shuffle questions on game start
  const startGame = useCallback(() => {
    const shuffled = [...QUESTIONS].sort(() => Math.random() - 0.5);
    setShuffledQuestions(shuffled);
    setQuestionIndex(0);
    setScore(0);
    setTimer(TIMER_SECONDS);
    setLastResult(null);
    setFeedbackText('');
    setAnswers([]);
    setPhase('playing');
    setFeedbackVisible(false);
  }, []);

  const handleAnswer = useCallback((answer: boolean | null) => {
    if (timerRef.current) clearInterval(timerRef.current);

    const currentQ = shuffledQuestions[questionIndex];
    if (!currentQ) return;

    let result: 'correct' | 'wrong' | 'timeout';

    if (answer === null) {
      result = 'timeout';
      setLastResult('wrong');
      setFeedbackText('⏱ TIME EXPIRED — NO RESPONSE DETECTED');
    } else if (answer === currentQ.isTrue) {
      result = 'correct';
      setScore((s) => s + 1);
      setLastResult('correct');
      setFeedbackText('✓ TRUTH CONFIRMED');
    } else {
      result = 'wrong';
      setLastResult('wrong');
      setFeedbackText('✗ DECEPTION DETECTED');
    }

    setAnswers((prev) => [...prev, result]);
    setPhase('feedback');
    setFeedbackVisible(true);

    // Auto-advance after feedback
    setTimeout(() => {
      setFeedbackVisible(false);
      setTimeout(() => {
        if (questionIndex + 1 >= shuffledQuestions.length) {
          setPhase('results');
        } else {
          setQuestionIndex((i) => i + 1);
          setTimer(TIMER_SECONDS);
          setLastResult(null);
          setFeedbackText('');
          setPhase('playing');
        }
      }, 300);
    }, 2500);
  }, [questionIndex, shuffledQuestions]);

  // Timer countdown
  useEffect(() => {
    if (phase !== 'playing') return;

    timerRef.current = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [phase, questionIndex]);

  // Handle timeout when timer reaches 0
  useEffect(() => {
    if (phase === 'playing' && timer === 0) {
      handleAnswer(null);
    }
  }, [timer, phase, handleAnswer]);

  const currentQuestion = shuffledQuestions[questionIndex];
  const rating = getRating(score, shuffledQuestions.length);
  const timerPct = (timer / TIMER_SECONDS) * 100;
  const timerColor = timer <= 3 ? 'bg-red-500' : timer <= 6 ? 'bg-amber-500' : 'bg-emerald-500';

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center relative overflow-hidden">
      {/* Inject keyframe animations */}
      <style>{`
        @keyframes pulseScroll {
          0% { stroke-dashoffset: 0; }
          100% { stroke-dashoffset: -240; }
        }
        @keyframes scanLine {
          0% { transform: translateX(0); }
          100% { transform: translateX(800px); }
        }
        @keyframes fadeInUp {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes flashGreen {
          0%, 100% { box-shadow: 0 0 0px transparent; }
          50% { box-shadow: 0 0 40px rgba(34,197,94,0.5), inset 0 0 30px rgba(34,197,94,0.1); }
        }
        @keyframes flashRed {
          0%, 100% { box-shadow: 0 0 0px transparent; }
          50% { box-shadow: 0 0 40px rgba(239,68,68,0.5), inset 0 0 30px rgba(239,68,68,0.1); }
        }
        @keyframes stampIn {
          0% { opacity: 0; transform: scale(3) rotate(-10deg); }
          60% { opacity: 1; transform: scale(0.95) rotate(1deg); }
          100% { opacity: 1; transform: scale(1) rotate(0deg); }
        }
        @keyframes glowPulse {
          0%, 100% { text-shadow: 0 0 10px currentColor; }
          50% { text-shadow: 0 0 25px currentColor, 0 0 50px currentColor; }
        }
        @keyframes barSlide {
          0% { width: 0; }
          100% { width: var(--target-width); }
        }
        @keyframes borderPulse {
          0%, 100% { border-color: rgba(245,158,11,0.3); }
          50% { border-color: rgba(245,158,11,0.7); }
        }
      `}</style>

      {/* Background scan lines */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.1) 2px, rgba(255,255,255,0.1) 4px)',
        }}
      />

      {/* === INTRO PHASE === */}
      {phase === 'intro' && (
        <div className="flex flex-col items-center justify-center flex-1 p-6 gap-8 max-w-lg text-center"
          style={{ animation: 'fadeInUp 0.6s ease-out' }}
        >
          {/* Koenig emblem */}
          <div className="relative">
            <div className="w-28 h-28 rounded-full border-2 border-amber-500/50 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm"
              style={{ animation: 'borderPulse 2s ease-in-out infinite' }}
            >
              <Zap className="w-14 h-14 text-amber-400" />
            </div>
            <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-amber-500 animate-ping opacity-75" />
          </div>

          <div>
            <h1 className="text-3xl font-heading font-bold text-amber-400 tracking-wider mb-2">
              KOENIG LIE DETECTOR
            </h1>
            <div className="text-xs font-mono-tech text-slate-500 tracking-[0.3em] uppercase mb-4">
              S.H.I.E.L.D. Interrogation Protocol v2.1
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">
              Welcome, Agent. Before granting you base access, you must complete the
              <span className="text-amber-400 font-semibold"> Lie Detector Assessment</span>.
              Determine whether each statement about S.H.I.E.L.D. operations is <span className="text-emerald-400">TRUE</span> or <span className="text-red-400">FALSE</span>.
            </p>
          </div>

          <div className="w-full">
            <PulseLine active={true} result={null} />
          </div>

          <div className="space-y-3 text-left text-xs font-mono-tech text-slate-500 w-full bg-slate-900/50 p-4 rounded-xl border border-slate-800">
            <div className="flex items-center gap-2">
              <Timer className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
              <span>{TIMER_SECONDS} seconds per question — respond quickly</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
              <span>{QUESTIONS.length} classified statements to evaluate</span>
            </div>
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
              <span>Failure may result in reassignment to Barrow, Alaska</span>
            </div>
          </div>

          <button
            onClick={startGame}
            className="px-8 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-sm tracking-wider uppercase transition-all duration-300 hover:scale-105 hover:shadow-[0_0_25px_rgba(245,158,11,0.4)] flex items-center gap-2"
          >
            Begin Assessment <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* === PLAYING / FEEDBACK PHASE === */}
      {(phase === 'playing' || phase === 'feedback') && currentQuestion && (
        <div className="flex flex-col items-center flex-1 p-4 w-full max-w-2xl gap-4"
          style={{ animation: 'fadeInUp 0.4s ease-out' }}
        >
          {/* Top bar: score + question counter */}
          <div className="w-full flex items-center justify-between text-xs font-mono-tech text-slate-500">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-500" />
              <span className="text-amber-400 font-bold">KOENIG LIE DETECTOR</span>
            </div>
            <div className="flex items-center gap-4">
              <span>SCORE: <span className="text-amber-300 font-bold">{score}</span>/{answers.length || questionIndex}</span>
              <span>Q: <span className="text-amber-300 font-bold">{questionIndex + 1}</span>/{shuffledQuestions.length}</span>
            </div>
          </div>

          {/* Timer bar */}
          <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden relative">
            <div
              className={`h-full rounded-full transition-all duration-1000 ease-linear ${timerColor}`}
              style={{ width: `${timerPct}%` }}
            />
            {timer <= 3 && phase === 'playing' && (
              <div className="absolute inset-0 bg-red-500/20 animate-pulse rounded-full" />
            )}
          </div>
          <div className="w-full flex justify-between text-xs font-mono-tech">
            <span className={`${timer <= 3 ? 'text-red-400 animate-pulse' : 'text-slate-500'}`}>
              <Timer className="w-3 h-3 inline mr-1" />{timer}s
            </span>
            <span className="text-slate-600">{currentQuestion.category}</span>
          </div>

          {/* Pulse line */}
          <div className={`w-full rounded-xl border p-2 ${
            lastResult === 'correct' ? 'border-emerald-500/50' :
            lastResult === 'wrong' ? 'border-red-500/50' :
            'border-slate-700/50'
          } bg-slate-900/50 backdrop-blur-sm`}
            style={{
              animation: lastResult === 'correct' ? 'flashGreen 0.8s ease-in-out 2' :
                         lastResult === 'wrong' ? 'flashRed 0.8s ease-in-out 2' : 'none',
            }}
          >
            <PulseLine active={phase === 'playing'} result={lastResult} />
          </div>

          {/* Statement card */}
          <div className={`w-full bg-slate-900 border rounded-2xl p-6 relative overflow-hidden ${
            lastResult === 'correct' ? 'border-emerald-500/40' :
            lastResult === 'wrong' ? 'border-red-500/40' :
            'border-slate-700'
          }`}
            style={{ animation: 'borderPulse 2s ease-in-out infinite' }}
          >
            <div className="text-[10px] font-mono-tech text-slate-600 uppercase tracking-[0.2em] mb-3">
              ▸ Subject Statement Analysis
            </div>
            <p className="text-slate-200 text-base leading-relaxed font-medium">
              "{currentQuestion.statement}"
            </p>

            {/* Feedback overlay */}
            {phase === 'feedback' && (
              <div className={`absolute inset-0 flex flex-col items-center justify-center bg-slate-950/85 backdrop-blur-sm rounded-2xl p-4 ${
                feedbackVisible ? 'opacity-100' : 'opacity-0'
              } transition-opacity duration-300`}>
                <div
                  className={`text-2xl font-bold font-heading tracking-wider ${
                    lastResult === 'correct' ? 'text-emerald-400' : 'text-red-400'
                  }`}
                  style={{
                    animation: 'stampIn 0.5s ease-out, glowPulse 1.5s ease-in-out infinite',
                  }}
                >
                  {feedbackText}
                </div>
                <p className="text-xs text-slate-400 mt-3 text-center max-w-md leading-relaxed">
                  {currentQuestion.explanation}
                </p>
                <div className="flex items-center gap-1 mt-3">
                  {lastResult === 'correct'
                    ? <CheckCircle className="w-4 h-4 text-emerald-500" />
                    : <XCircle className="w-4 h-4 text-red-500" />
                  }
                  <span className="text-[10px] font-mono-tech text-slate-500">
                    Answer: {currentQuestion.isTrue ? 'TRUE' : 'FALSE'}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Answer buttons */}
          <div className="w-full flex gap-4">
            <button
              onClick={() => phase === 'playing' && handleAnswer(true)}
              disabled={phase !== 'playing'}
              className={`flex-1 py-4 rounded-xl font-bold text-sm uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 border ${
                phase === 'playing'
                  ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/20 hover:border-emerald-400 hover:shadow-[0_0_20px_rgba(34,197,94,0.3)] hover:scale-[1.02] active:scale-95'
                  : 'bg-slate-800/50 border-slate-700/30 text-slate-600 cursor-not-allowed'
              }`}
            >
              <CheckCircle className="w-5 h-5" /> True
            </button>
            <button
              onClick={() => phase === 'playing' && handleAnswer(false)}
              disabled={phase !== 'playing'}
              className={`flex-1 py-4 rounded-xl font-bold text-sm uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 border ${
                phase === 'playing'
                  ? 'bg-red-500/10 border-red-500/40 text-red-400 hover:bg-red-500/20 hover:border-red-400 hover:shadow-[0_0_20px_rgba(239,68,68,0.3)] hover:scale-[1.02] active:scale-95'
                  : 'bg-slate-800/50 border-slate-700/30 text-slate-600 cursor-not-allowed'
              }`}
            >
              <XCircle className="w-5 h-5" /> False
            </button>
          </div>

          {/* Progress dots */}
          <div className="flex flex-wrap justify-center gap-1.5 mt-1">
            {shuffledQuestions.map((_, i) => (
              <div
                key={i}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                  i < answers.length
                    ? answers[i] === 'correct'
                      ? 'bg-emerald-500 shadow-[0_0_6px_rgba(34,197,94,0.6)]'
                      : 'bg-red-500 shadow-[0_0_6px_rgba(239,68,68,0.6)]'
                    : i === questionIndex
                    ? 'bg-amber-400 animate-pulse shadow-[0_0_8px_rgba(245,158,11,0.6)]'
                    : 'bg-slate-700'
                }`}
              />
            ))}
          </div>
        </div>
      )}

      {/* === RESULTS PHASE === */}
      {phase === 'results' && (
        <div className="flex flex-col items-center justify-center flex-1 p-6 gap-6 max-w-lg w-full"
          style={{ animation: 'fadeInUp 0.6s ease-out' }}
        >
          {/* Top emblem */}
          <div className="relative">
            <div className="w-24 h-24 rounded-full border-2 border-amber-500/50 flex items-center justify-center bg-slate-900/80"
              style={{ animation: 'borderPulse 2s ease-in-out infinite' }}
            >
              <Shield className="w-12 h-12 text-amber-400" />
            </div>
          </div>

          <div className="text-center">
            <div className="text-[10px] font-mono-tech text-slate-600 tracking-[0.3em] uppercase mb-1">
              Assessment Complete
            </div>
            <h2 className={`text-2xl font-heading font-bold ${rating.color} tracking-wider`}
              style={{ animation: 'glowPulse 2s ease-in-out infinite' }}
            >
              {rating.title}
            </h2>
            <p className="text-slate-400 text-sm mt-2 leading-relaxed">{rating.description}</p>
          </div>

          {/* Score display */}
          <div className="w-full bg-slate-900 border border-slate-700 rounded-2xl p-5">
            <div className="text-center mb-4">
              <span className="text-5xl font-bold font-heading text-amber-400">{score}</span>
              <span className="text-2xl text-slate-500 font-heading"> / {shuffledQuestions.length}</span>
              <div className="text-xs font-mono-tech text-slate-500 mt-1">
                {Math.round((score / shuffledQuestions.length) * 100)}% ACCURACY
              </div>
            </div>

            {/* Score bar */}
            <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden mb-4">
              <div
                className="h-full rounded-full bg-gradient-to-r from-amber-500 to-amber-400"
                style={{
                  '--target-width': `${(score / shuffledQuestions.length) * 100}%`,
                  animation: 'barSlide 1s ease-out forwards',
                } as React.CSSProperties}
              />
            </div>

            {/* Breakdown */}
            <div className="grid grid-cols-3 gap-3 text-center text-xs font-mono-tech">
              <div className="bg-slate-800/50 rounded-lg p-2">
                <div className="text-emerald-400 text-lg font-bold">{answers.filter((a) => a === 'correct').length}</div>
                <div className="text-slate-500">Correct</div>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-2">
                <div className="text-red-400 text-lg font-bold">{answers.filter((a) => a === 'wrong').length}</div>
                <div className="text-slate-500">Wrong</div>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-2">
                <div className="text-slate-400 text-lg font-bold">{answers.filter((a) => a === 'timeout').length}</div>
                <div className="text-slate-500">Timeout</div>
              </div>
            </div>
          </div>

          {/* Answer review */}
          <div className="w-full bg-slate-900/50 border border-slate-800 rounded-xl p-4 max-h-48 overflow-y-auto">
            <div className="text-[10px] font-mono-tech text-slate-600 uppercase tracking-[0.2em] mb-2">
              ▸ Question Log
            </div>
            <div className="space-y-1.5">
              {shuffledQuestions.map((q, i) => (
                <div key={i} className="flex items-start gap-2 text-xs">
                  <span className={`mt-0.5 flex-shrink-0 ${
                    answers[i] === 'correct' ? 'text-emerald-500' : 'text-red-500'
                  }`}>
                    {answers[i] === 'correct' ? <CheckCircle className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                  </span>
                  <span className="text-slate-400 leading-relaxed line-clamp-1">
                    {q.statement.slice(0, 80)}{q.statement.length > 80 ? '...' : ''}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Pulse line */}
          <div className="w-full">
            <PulseLine active={false} result={null} />
          </div>

          {/* Restart */}
          <button
            onClick={startGame}
            className="px-8 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-sm tracking-wider uppercase transition-all duration-300 hover:scale-105 hover:shadow-[0_0_25px_rgba(245,158,11,0.4)] flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" /> Re-assess Agent
          </button>

          <div className="text-[10px] font-mono-tech text-slate-600 text-center">
            S.H.I.E.L.D. Interrogation Division — Koenig Protocol
          </div>
        </div>
      )}
    </div>
  );
};
