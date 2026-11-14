import React, { useState, useEffect, useCallback } from 'react';
import { Shield } from 'lucide-react';

/* ─────────── Types ─────────── */
interface InhumanPower {
  name: string;
  alias: string;
  description: string;
  ability: string;
  colorFrom: string;
  colorTo: string;
  glowColor: string;
  textColor: string;
  icon: string;
  weights: number[]; // 6 values, one per question
}

type Stage = 'entry' | 'questions' | 'exposure' | 'cocoon' | 'reveal';

/* ─────────── Data ─────────── */
const POWERS: InhumanPower[] = [
  {
    name: 'Daisy Johnson',
    alias: 'Quake',
    description: 'You can generate and manipulate vibrations at a molecular level — shattering objects, creating seismic waves, and redirecting force.',
    ability: 'Vibration Manipulation',
    colorFrom: 'from-violet-600',
    colorTo: 'to-purple-900',
    glowColor: 'shadow-violet-500/60',
    textColor: 'text-violet-300',
    icon: '〰️',
    weights: [2, 0, 2, 1, 2, 0],
  },
  {
    name: 'Lincoln Campbell',
    alias: 'Sparkplug',
    description: 'You can absorb, generate, and project electrical energy — channeling lightning through your body and supercharging anything you touch.',
    ability: 'Electrokinesis',
    colorFrom: 'from-sky-400',
    colorTo: 'to-blue-900',
    glowColor: 'shadow-sky-400/60',
    textColor: 'text-sky-300',
    icon: '⚡',
    weights: [1, 2, 0, 2, 1, 1],
  },
  {
    name: 'Lash',
    alias: 'Lash',
    description: 'You can discharge devastating energy blasts and judge who is worthy of Terrigenesis. Raw, primal power courses through you.',
    ability: 'Energy Projection',
    colorFrom: 'from-emerald-500',
    colorTo: 'to-teal-900',
    glowColor: 'shadow-emerald-500/60',
    textColor: 'text-emerald-300',
    icon: '💥',
    weights: [2, 1, 1, 0, 0, 2],
  },
  {
    name: 'Raina',
    alias: 'The Clairvoyant',
    description: 'You possess the gift of precognition — vivid visions of the future arrive unbidden, guiding you through dangers yet to come.',
    ability: 'Precognition',
    colorFrom: 'from-amber-500',
    colorTo: 'to-orange-900',
    glowColor: 'shadow-amber-400/60',
    textColor: 'text-amber-300',
    icon: '👁️',
    weights: [0, 2, 2, 0, 1, 2],
  },
  {
    name: 'Gordon',
    alias: 'The Reader',
    description: 'You can fold space and teleport instantly across vast distances, slipping through dimensions in a flash of blue light.',
    ability: 'Teleportation',
    colorFrom: 'from-indigo-500',
    colorTo: 'to-blue-950',
    glowColor: 'shadow-indigo-400/60',
    textColor: 'text-indigo-300',
    icon: '🌀',
    weights: [0, 1, 1, 2, 2, 1],
  },
  {
    name: 'Joey Gutierrez',
    alias: 'Meltdown',
    description: 'You can liquefy and reshape any metal with a thought — bending steel like water and forging weapons from thin air.',
    ability: 'Metal Transmutation',
    colorFrom: 'from-red-500',
    colorTo: 'to-rose-900',
    glowColor: 'shadow-red-500/60',
    textColor: 'text-red-300',
    icon: '🔥',
    weights: [1, 0, 0, 1, 2, 2],
  },
  {
    name: 'Elena Rodriguez',
    alias: 'Yo-Yo',
    description: 'You possess inhuman super-speed — you snap forward in a heartbeat and rubber-band back to your starting point.',
    ability: 'Super Speed (Slingshot)',
    colorFrom: 'from-yellow-400',
    colorTo: 'to-amber-900',
    glowColor: 'shadow-yellow-400/60',
    textColor: 'text-yellow-300',
    icon: '💨',
    weights: [2, 1, 2, 2, 0, 0],
  },
  {
    name: 'Hive',
    alias: 'Hive',
    description: 'You can extend parasitic tendrils that sway minds to your will — connecting an entire network of followers to your consciousness.',
    ability: 'Parasitic Mind Control',
    colorFrom: 'from-slate-500',
    colorTo: 'to-gray-950',
    glowColor: 'shadow-slate-400/60',
    textColor: 'text-slate-300',
    icon: '🕸️',
    weights: [1, 2, 1, 1, 1, 2],
  },
];

interface Question {
  text: string;
  options: { label: string; value: number }[];
}

const QUESTIONS: Question[] = [
  {
    text: 'When danger strikes, what is your first instinct?',
    options: [
      { label: 'Charge in and face it head-on', value: 0 },
      { label: 'Analyze the situation and form a plan', value: 1 },
      { label: 'Protect the people around me first', value: 2 },
    ],
  },
  {
    text: 'Which environment feels most like home?',
    options: [
      { label: 'A bustling city full of energy', value: 0 },
      { label: 'A quiet library filled with secrets', value: 1 },
      { label: 'The open sky — freedom above all', value: 2 },
    ],
  },
  {
    text: 'Your greatest strength is…',
    options: [
      { label: 'Raw determination and willpower', value: 0 },
      { label: 'Adaptability — I thrive in chaos', value: 1 },
      { label: 'Empathy — I understand people deeply', value: 2 },
    ],
  },
  {
    text: 'A teammate is compromised by the enemy. You…',
    options: [
      { label: 'Go rogue to rescue them, no matter the cost', value: 0 },
      { label: 'Trust the team to execute a calculated extraction', value: 1 },
      { label: 'Find a way to reach them emotionally first', value: 2 },
    ],
  },
  {
    text: 'What draws you to power?',
    options: [
      { label: 'The desire to change the world', value: 0 },
      { label: 'The need to protect those I love', value: 1 },
      { label: 'Curiosity — I want to understand everything', value: 2 },
    ],
  },
  {
    text: 'If S.H.I.E.L.D. offered you a role, you\'d choose…',
    options: [
      { label: 'Field operative — action on the front lines', value: 0 },
      { label: 'Science division — unlocking new possibilities', value: 1 },
      { label: 'Command — leading and uniting the team', value: 2 },
    ],
  },
];

/* ─────────── Particle helpers ─────────── */
interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  color: string;
}

const PARTICLE_COLORS = [
  'bg-indigo-400', 'bg-violet-400', 'bg-purple-400',
  'bg-fuchsia-400', 'bg-blue-400', 'bg-indigo-300',
  'bg-violet-300', 'bg-purple-500',
];

function makeParticles(count: number): Particle[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: 2 + Math.random() * 6,
    duration: 2 + Math.random() * 4,
    delay: Math.random() * 3,
    color: PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)],
  }));
}

/* ─────────── Component ─────────── */
export const TerrigenAwakening: React.FC = () => {
  const [stage, setStage] = useState<Stage>('entry');
  const [questionIdx, setQuestionIdx] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [power, setPower] = useState<InhumanPower | null>(null);
  const [particles] = useState(() => makeParticles(50));
  const [cocoonProgress, setCocoonProgress] = useState(0);
  const [fadeIn, setFadeIn] = useState(false);
  const [exposurePulse, setExposurePulse] = useState(0);
  const [revealStep, setRevealStep] = useState(0); // 0=hidden, 1=glow, 2=full
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);

  // Fade-in trigger on mount and stage change
  useEffect(() => {
    setFadeIn(false);
    const t = setTimeout(() => setFadeIn(true), 50);
    return () => clearTimeout(t);
  }, [stage, questionIdx]);

  // Exposure animation
  useEffect(() => {
    if (stage !== 'exposure') return;
    setExposurePulse(0);
    const interval = setInterval(() => {
      setExposurePulse((p) => {
        if (p >= 100) {
          clearInterval(interval);
          setTimeout(() => setStage('cocoon'), 400);
          return 100;
        }
        return p + 2;
      });
    }, 60);
    return () => clearInterval(interval);
  }, [stage]);

  // Cocoon phase
  useEffect(() => {
    if (stage !== 'cocoon') return;
    setCocoonProgress(0);
    const interval = setInterval(() => {
      setCocoonProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          setTimeout(() => setStage('reveal'), 600);
          return 100;
        }
        return p + 1;
      });
    }, 50);
    return () => clearInterval(interval);
  }, [stage]);

  // Reveal steps
  useEffect(() => {
    if (stage !== 'reveal') return;
    setRevealStep(0);
    const t1 = setTimeout(() => setRevealStep(1), 400);
    const t2 = setTimeout(() => setRevealStep(2), 1200);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [stage]);

  /* ── Score & assign power ── */
  const computePower = useCallback((ans: number[]) => {
    const scores = POWERS.map((pw) => {
      let score = 0;
      ans.forEach((a, qi) => {
        score += pw.weights[qi] * (a + 1);
      });
      // Add a small random factor so ties break interestingly
      score += Math.random() * 2;
      return score;
    });
    const maxIdx = scores.indexOf(Math.max(...scores));
    return POWERS[maxIdx];
  }, []);

  /* ── Handlers ── */
  const handleEnter = () => {
    setStage('questions');
    setQuestionIdx(0);
    setAnswers([]);
    setPower(null);
    setSelectedOption(null);
  };

  const handleAnswer = (value: number) => {
    setSelectedOption(value);
    setTimeout(() => {
      const newAnswers = [...answers, value];
      setAnswers(newAnswers);
      setSelectedOption(null);
      if (questionIdx < QUESTIONS.length - 1) {
        setQuestionIdx(questionIdx + 1);
      } else {
        const assignedPower = computePower(newAnswers);
        setPower(assignedPower);
        setStage('exposure');
      }
    }, 350);
  };

  const handleRestart = () => {
    setStage('entry');
    setQuestionIdx(0);
    setAnswers([]);
    setPower(null);
    setRevealStep(0);
    setCocoonProgress(0);
    setExposurePulse(0);
    setSelectedOption(null);
    setCopied(false);
  };

  const handleShare = () => {
    if (!power) return;
    const text = `🧬 Terrigen Awakening Result:\nI am ${power.alias}!\nPower: ${power.ability}\n${power.description}\n\n#AgentsOfSHIELD #Inhuman #TerrigenAwakening`;
    
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(text).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }).catch(() => {
        fallbackCopy(text);
      });
    } else {
      fallbackCopy(text);
    }
  };

  const fallbackCopy = (text: string) => {
    try {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  /* ─────────── Render helpers ─────────── */
  const wrapperClasses = `relative w-full max-w-2xl mx-auto overflow-hidden rounded-2xl border border-indigo-800/40 bg-gradient-to-b from-slate-950 via-indigo-950/40 to-slate-950 transition-all duration-700 ${fadeIn ? 'opacity-100' : 'opacity-0'}`;

  /* ── Stage: Entry ── */
  const renderEntry = () => (
    <div className={wrapperClasses}>
      {/* Ambient particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.slice(0, 20).map((p) => (
          <div
            key={p.id}
            className={`absolute rounded-full ${p.color} opacity-20`}
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: p.size,
              height: p.size,
              animation: `float ${p.duration}s ease-in-out ${p.delay}s infinite alternate`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 flex flex-col items-center py-14 px-6 text-center">
        {/* Terrigen crystal icon */}
        <div className="relative mb-6">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-600 to-purple-800 flex items-center justify-center shadow-lg shadow-indigo-500/40 animate-pulse">
            <Shield className="w-12 h-12 text-indigo-200" />
          </div>
          <div className="absolute inset-0 rounded-full border-2 border-indigo-400/30 animate-ping" />
        </div>

        <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-purple-300 to-violet-300 mb-3 font-tech">
          Terrigen Awakening
        </h2>
        <p className="text-indigo-300/80 text-sm max-w-md mb-2 leading-relaxed">
          The Terrigen Mist has been released. Step into the chamber and discover
          the Inhuman power hidden within your DNA.
        </p>
        <p className="text-indigo-500/60 text-xs mb-8 italic">
          "Everyone has the potential… not everyone survives."
        </p>

        <button
          onClick={handleEnter}
          className="group relative px-8 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold tracking-wide transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-indigo-500/40 active:scale-95"
        >
          <span className="relative z-10">Enter the Chamber</span>
          <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-indigo-400 to-purple-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
        </button>
      </div>
    </div>
  );

  /* ── Stage: Questions ── */
  const renderQuestions = () => {
    const q = QUESTIONS[questionIdx];
    const progress = ((questionIdx) / QUESTIONS.length) * 100;

    return (
      <div className={wrapperClasses}>
        <div className="relative z-10 py-8 px-6">
          {/* Progress bar */}
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-indigo-400 font-mono">DNA SCAN {questionIdx + 1}/{QUESTIONS.length}</span>
            <span className="text-xs text-indigo-500/60 font-mono">{Math.round(progress)}%</span>
          </div>
          <div className="w-full h-1.5 bg-slate-800 rounded-full mb-8 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Question */}
          <div className="text-center mb-8">
            <p className="text-lg text-indigo-100 font-medium leading-relaxed">
              {q.text}
            </p>
          </div>

          {/* Options */}
          <div className="space-y-3 max-w-lg mx-auto">
            {q.options.map((opt, i) => (
              <button
                key={i}
                onClick={() => handleAnswer(opt.value)}
                disabled={selectedOption !== null}
                className={`w-full text-left px-5 py-3.5 rounded-xl border transition-all duration-300 ${
                  selectedOption === opt.value
                    ? 'border-indigo-400 bg-indigo-600/30 text-indigo-100 scale-[1.02] shadow-md shadow-indigo-500/20'
                    : 'border-indigo-800/40 bg-slate-900/60 text-indigo-200/80 hover:border-indigo-600/60 hover:bg-indigo-950/50 hover:text-indigo-100'
                } ${selectedOption !== null && selectedOption !== opt.value ? 'opacity-40' : ''}`}
              >
                <span className="text-indigo-500 font-mono text-xs mr-3">
                  {String.fromCharCode(65 + i)}.
                </span>
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  };

  /* ── Stage: Exposure ── */
  const renderExposure = () => (
    <div className={wrapperClasses}>
      {/* Mist particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map((p) => (
          <div
            key={p.id}
            className={`absolute rounded-full ${p.color}`}
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: p.size * (1 + exposurePulse / 60),
              height: p.size * (1 + exposurePulse / 60),
              opacity: 0.1 + (exposurePulse / 200),
              animation: `float ${p.duration * 0.5}s ease-in-out ${p.delay * 0.3}s infinite alternate`,
              transition: 'all 0.3s ease',
            }}
          />
        ))}
      </div>

      {/* Expanding mist rings */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        {[0, 1, 2, 3].map((ring) => {
          const baseSize = 20 + exposurePulse * 3;
          const ringSize = baseSize + ring * 40;
          return (
            <div
              key={ring}
              className="absolute rounded-full border border-indigo-400/20"
              style={{
                width: ringSize,
                height: ringSize,
                opacity: Math.max(0, 0.5 - ring * 0.12) * (exposurePulse / 100),
                boxShadow: `0 0 ${20 + ring * 10}px rgba(99,102,241,${0.15 * (exposurePulse / 100)})`,
                transition: 'all 0.2s ease',
              }}
            />
          );
        })}
      </div>

      {/* Center orb */}
      <div className="relative z-10 flex flex-col items-center justify-center py-20 px-6">
        <div
          className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-400 to-purple-600 flex items-center justify-center mb-6"
          style={{
            boxShadow: `0 0 ${20 + exposurePulse}px rgba(129,140,248,${0.4 + exposurePulse / 200})`,
            transform: `scale(${1 + exposurePulse / 250})`,
            transition: 'all 0.15s ease',
          }}
        >
          <Shield className="w-10 h-10 text-white" style={{ opacity: 1 - exposurePulse / 150 }} />
        </div>

        <p className="text-indigo-300 text-sm font-mono animate-pulse tracking-wider uppercase">
          {exposurePulse < 30
            ? 'Terrigen Mist Deploying…'
            : exposurePulse < 70
            ? 'Exposure in progress…'
            : 'Transformation Initiated…'}
        </p>

        {/* Exposure bar */}
        <div className="w-48 h-1 bg-slate-800 rounded-full mt-4 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-indigo-400 to-violet-400 rounded-full transition-all duration-100"
            style={{ width: `${exposurePulse}%` }}
          />
        </div>
      </div>
    </div>
  );

  /* ── Stage: Cocoon ── */
  const renderCocoon = () => {
    const crackOpacity = cocoonProgress > 70 ? (cocoonProgress - 70) / 30 : 0;
    const shellScale = 1 + cocoonProgress / 500;
    const shellColor = cocoonProgress > 80 ? 'from-indigo-600 to-purple-500' : 'from-stone-600 to-stone-800';

    return (
      <div className={wrapperClasses}>
        {/* Inner glow particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {particles.slice(0, 30).map((p) => (
            <div
              key={p.id}
              className={`absolute rounded-full ${cocoonProgress > 60 ? p.color : 'bg-stone-500'}`}
              style={{
                left: `${50 + (p.x - 50) * (cocoonProgress / 100)}%`,
                top: `${50 + (p.y - 50) * (cocoonProgress / 100)}%`,
                width: p.size * (cocoonProgress > 70 ? 1.5 : 0.5),
                height: p.size * (cocoonProgress > 70 ? 1.5 : 0.5),
                opacity: cocoonProgress > 60 ? 0.3 + (cocoonProgress - 60) / 130 : 0.1,
                transition: 'all 0.4s ease',
              }}
            />
          ))}
        </div>

        <div className="relative z-10 flex flex-col items-center justify-center py-20 px-6">
          {/* Cocoon shell */}
          <div className="relative mb-6">
            <div
              className={`w-28 h-36 rounded-[50%] bg-gradient-to-b ${shellColor} transition-all duration-500`}
              style={{
                transform: `scale(${shellScale})`,
                boxShadow: cocoonProgress > 70
                  ? `0 0 ${(cocoonProgress - 70) * 2}px rgba(129,140,248,${crackOpacity * 0.6})`
                  : '0 0 10px rgba(0,0,0,0.5)',
              }}
            >
              {/* Crack lines */}
              {cocoonProgress > 60 && (
                <div className="absolute inset-0 flex items-center justify-center overflow-hidden rounded-[50%]">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute bg-indigo-300"
                      style={{
                        width: 1 + crackOpacity * 2,
                        height: 10 + crackOpacity * 30,
                        opacity: crackOpacity * 0.8,
                        transform: `rotate(${i * 72 + cocoonProgress}deg) translateY(-${10 + crackOpacity * 15}px)`,
                        transition: 'all 0.3s ease',
                        boxShadow: `0 0 6px rgba(199,210,254,${crackOpacity})`,
                      }}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Outer pulse when cracking */}
            {cocoonProgress > 75 && (
              <div
                className="absolute inset-[-8px] rounded-[50%] border border-indigo-400/30"
                style={{
                  animation: 'ping 1s cubic-bezier(0,0,0.2,1) infinite',
                  opacity: crackOpacity * 0.5,
                }}
              />
            )}
          </div>

          <p className="text-stone-400 text-sm font-mono tracking-wider uppercase animate-pulse">
            {cocoonProgress < 30
              ? 'Terrigenesis in progress…'
              : cocoonProgress < 60
              ? 'DNA rewriting…'
              : cocoonProgress < 85
              ? 'Cocoon fracturing…'
              : 'Emerging…'}
          </p>

          {/* Progress */}
          <div className="w-48 h-1 bg-slate-800 rounded-full mt-4 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-stone-500 to-indigo-400 rounded-full transition-all duration-100"
              style={{ width: `${cocoonProgress}%` }}
            />
          </div>
        </div>
      </div>
    );
  };

  /* ── Stage: Reveal ── */
  const renderReveal = () => {
    if (!power) return null;

    return (
      <div className={wrapperClasses}>
        {/* Burst particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {particles.map((p) => (
            <div
              key={p.id}
              className={`absolute rounded-full ${p.color}`}
              style={{
                left: `${50 + (p.x - 50) * (revealStep >= 1 ? 1.8 : 0.2)}%`,
                top: `${50 + (p.y - 50) * (revealStep >= 1 ? 1.8 : 0.2)}%`,
                width: p.size * (revealStep >= 2 ? 1.2 : 0.3),
                height: p.size * (revealStep >= 2 ? 1.2 : 0.3),
                opacity: revealStep >= 1 ? 0.25 : 0,
                transition: `all ${0.8 + p.delay * 0.2}s cubic-bezier(0.16,1,0.3,1)`,
              }}
            />
          ))}
        </div>

        <div className="relative z-10 flex flex-col items-center py-10 px-6 text-center">
          {/* Power icon orb */}
          <div
            className={`relative mb-5 transition-all duration-1000 ${
              revealStep >= 1 ? 'scale-100 opacity-100' : 'scale-50 opacity-0'
            }`}
          >
            <div
              className={`w-24 h-24 rounded-full bg-gradient-to-br ${power.colorFrom} ${power.colorTo} flex items-center justify-center transition-shadow duration-700 ${
                revealStep >= 2 ? `shadow-2xl ${power.glowColor}` : ''
              }`}
            >
              <span className="text-4xl">{power.icon}</span>
            </div>
            {revealStep >= 2 && (
              <>
                <div className="absolute inset-[-4px] rounded-full border border-white/10 animate-ping" />
                <div className="absolute inset-[-12px] rounded-full border border-white/5 animate-pulse" />
              </>
            )}
          </div>

          {/* Power details */}
          <div
            className={`transition-all duration-700 delay-300 ${
              revealStep >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
          >
            <p className="text-xs text-indigo-400 font-mono uppercase tracking-[0.3em] mb-1">
              Your Inhuman Power
            </p>
            <h3 className={`text-3xl font-bold ${power.textColor} mb-1 font-tech`}>
              {power.ability}
            </h3>
            <p className="text-sm text-indigo-300/60 mb-4 italic">
              Identity: <span className="text-indigo-200">{power.alias}</span>
              <span className="mx-2">•</span>
              <span className="text-indigo-200">{power.name}</span>
            </p>

            <div className="max-w-md mx-auto rounded-xl border border-indigo-800/40 bg-indigo-950/30 p-4 mb-6">
              <p className="text-indigo-200/80 text-sm leading-relaxed">
                {power.description}
              </p>
            </div>

            {/* Stats bars */}
            <div className="max-w-xs mx-auto space-y-2 mb-6">
              {[
                { label: 'Power Level', val: 60 + Math.random() * 35 },
                { label: 'Control', val: 40 + Math.random() * 50 },
                { label: 'Potential', val: 70 + Math.random() * 30 },
              ].map((stat) => (
                <div key={stat.label} className="flex items-center gap-2">
                  <span className="text-[10px] text-indigo-400/60 font-mono w-20 text-right">{stat.label}</span>
                  <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full bg-gradient-to-r ${power.colorFrom} ${power.colorTo} rounded-full transition-all duration-1000 delay-700`}
                      style={{ width: revealStep >= 2 ? `${stat.val}%` : '0%' }}
                    />
                  </div>
                  <span className="text-[10px] text-indigo-500/60 font-mono w-8">
                    {revealStep >= 2 ? Math.round(stat.val) : 0}%
                  </span>
                </div>
              ))}
            </div>

            {/* Action buttons */}
            <div className="flex items-center justify-center gap-3 flex-wrap">
              <button
                onClick={handleShare}
                className="px-5 py-2.5 rounded-xl border border-indigo-700/50 bg-indigo-900/30 text-indigo-300 text-sm font-medium hover:bg-indigo-800/30 hover:border-indigo-600/50 transition-all duration-200 active:scale-95"
              >
                {copied ? '✓ Copied!' : '📋 Share Your Power'}
              </button>
              <button
                onClick={handleRestart}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-semibold hover:scale-105 hover:shadow-lg hover:shadow-indigo-500/30 transition-all duration-200 active:scale-95"
              >
                🔄 Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  /* ─────────── Main render ─────────── */
  return (
    <div className="w-full py-4 px-2">
      {/* Inline keyframes for floating animation */}
      <style>{`
        @keyframes float {
          0% { transform: translateY(0px) translateX(0px); }
          50% { transform: translateY(-12px) translateX(6px); }
          100% { transform: translateY(0px) translateX(0px); }
        }
      `}</style>

      {stage === 'entry' && renderEntry()}
      {stage === 'questions' && renderQuestions()}
      {stage === 'exposure' && renderExposure()}
      {stage === 'cocoon' && renderCocoon()}
      {stage === 'reveal' && renderReveal()}
    </div>
  );
};
