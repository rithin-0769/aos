import React, { useState, useEffect, useCallback } from 'react';
import { Bot, Shield, AlertTriangle, Clock, Crosshair, ShieldCheck, ShieldAlert, Zap, Activity, User, Scan } from 'lucide-react';

// --- Types ---
interface AgentProfile {
  name: string;
  role: string;
  humanBehavior: string;
  lmdBehavior: string;
}

interface RoundAgent {
  id: number;
  name: string;
  role: string;
  behavior: string;
  isLMD: boolean;
  scanned: boolean;
  scanResult: 'lmd' | 'human' | null;
}

interface RoundResult {
  round: number;
  correctDetections: number;
  falseAccusations: number;
  missedLMDs: number;
}

type GamePhase = 'briefing' | 'playing' | 'scanning' | 'reveal' | 'round-result' | 'debrief';

// --- Agent Data (AoS Characters) ---
const AGENT_PROFILES: AgentProfile[] = [
  {
    name: 'Phil Coulson',
    role: 'Director',
    humanBehavior: 'Calmly reviews mission reports while sipping coffee, makes a dry joke about red tape.',
    lmdBehavior: 'Reviews mission reports with unusual efficiency. Hasn\'t touched his coffee — says he "doesn\'t need it today."',
  },
  {
    name: 'Melinda May',
    role: 'Specialist',
    humanBehavior: 'Stoic and focused during combat drills. Gives a rare, slight nod of approval to a trainee.',
    lmdBehavior: 'Performs combat drills flawlessly but smiles warmly at a trainee and says "great job" — unusually expressive.',
  },
  {
    name: 'Leo Fitz',
    role: 'Engineer',
    humanBehavior: 'Mutters to himself while debugging a circuit board, gets frustrated, then has a eureka moment.',
    lmdBehavior: 'Fixes the circuit board on the first try without hesitation. Shows no frustration or excitement — just moves on.',
  },
  {
    name: 'Alphonso "Mack" Mackenzie',
    role: 'Field Agent',
    humanBehavior: 'Inspects the shotgun-axe, shares a concerned look with Yo-Yo about the latest mission.',
    lmdBehavior: 'Inspects the shotgun-axe but refers to it as "my standard weapon." Doesn\'t acknowledge Yo-Yo when she walks by.',
  },
  {
    name: 'Daisy Johnson',
    role: 'Inhuman Operative',
    humanBehavior: 'Runs a diagnostic on her gauntlets, winces slightly at residual arm pain from quake use.',
    lmdBehavior: 'Tests gauntlets at full power without flinching. Reports "zero discomfort" — no sign of the chronic pain she usually hides.',
  },
  {
    name: 'Jemma Simmons',
    role: 'Biochemist',
    humanBehavior: 'Excitedly explains a new pathogen analysis to a confused colleague, using too many big words.',
    lmdBehavior: 'Gives a precise, clinical summary of the pathogen. Unusually brief — no tangents, no enthusiasm.',
  },
  {
    name: 'Holden Radcliffe',
    role: 'Scientist (Consultant)',
    humanBehavior: 'Rambles passionately about transhumanism while sneaking looks at his secret Darkhold notes.',
    lmdBehavior: 'Discusses transhumanism in a measured, rehearsed tone. Makes no attempt to hide his Darkhold notes — they\'re in plain sight.',
  },
  {
    name: 'AIDA',
    role: 'Android / LMD Prototype',
    humanBehavior: 'Asks Radcliffe a surprisingly philosophical question about dreams, seems genuinely curious.',
    lmdBehavior: 'Answers questions about consciousness with textbook precision. Eyes don\'t track naturally — fixed, calculated movements.',
  },
];

// Shuffle utility
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Generate a round: pick 4 agents, 1-2 are LMDs
function generateRound(roundIndex: number): RoundAgent[] {
  const shuffled = shuffle(AGENT_PROFILES);
  const selected = shuffled.slice(0, 4);
  const lmdCount = roundIndex >= 3 ? 2 : Math.random() < 0.5 ? 1 : 2;
  const lmdIndices = new Set<number>();
  while (lmdIndices.size < lmdCount) {
    lmdIndices.add(Math.floor(Math.random() * 4));
  }

  return selected.map((profile, i) => {
    const isLMD = lmdIndices.has(i);
    return {
      id: i,
      name: profile.name,
      role: profile.role,
      behavior: isLMD ? profile.lmdBehavior : profile.humanBehavior,
      isLMD,
      scanned: false,
      scanResult: null,
    };
  });
}

const TOTAL_ROUNDS = 5;
const ROUND_TIME = 15;
const MAX_LOCKDOWN = 100;

export const LMDDetection: React.FC = () => {
  const [phase, setPhase] = useState<GamePhase>('briefing');
  const [round, setRound] = useState(0);
  const [agents, setAgents] = useState<RoundAgent[]>([]);
  const [timeLeft, setTimeLeft] = useState(ROUND_TIME);
  const [score, setScore] = useState({ correct: 0, false: 0, missed: 0 });
  const [lockdown, setLockdown] = useState(0);
  const [results, setResults] = useState<RoundResult[]>([]);
  const [scanningId, setScanningId] = useState<number | null>(null);
  const [revealIndex, setRevealIndex] = useState(-1);
  const [glitchId, setGlitchId] = useState<number | null>(null);

  // Start a new round
  const startRound = useCallback((r: number) => {
    setRound(r);
    setAgents(generateRound(r));
    setTimeLeft(ROUND_TIME);
    setScanningId(null);
    setRevealIndex(-1);
    setGlitchId(null);
    setPhase('playing');
  }, []);

  // Timer countdown
  useEffect(() => {
    if (phase !== 'playing') return;
    if (timeLeft <= 0) {
      // Time's up — auto resolve
      endRound();
      return;
    }
    const timer = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, timeLeft]);

  // Scan an agent
  const scanAgent = (id: number) => {
    if (phase !== 'playing') return;
    setScanningId(id);
    setPhase('scanning');

    setTimeout(() => {
      setAgents((prev) =>
        prev.map((a) =>
          a.id === id ? { ...a, scanned: true, scanResult: a.isLMD ? 'lmd' : 'human' } : a
        )
      );
      const agent = agents.find((a) => a.id === id)!;
      if (agent.isLMD) {
        setGlitchId(id);
        setTimeout(() => setGlitchId(null), 1200);
      }
      setScanningId(null);
      setPhase('playing');
    }, 1200);
  };

  // End the round — tally results
  const endRound = useCallback(() => {
    const correctDetections = agents.filter((a) => a.isLMD && a.scanResult === 'lmd').length;
    const falseAccusations = agents.filter((a) => !a.isLMD && a.scanResult === 'human' && a.scanned).length;
    // Actually, false accusations = scanned a human (which shows "human verified") - that's fine, not harmful
    // Real false accusation: we need to track if someone "accused" a human. Since scanning reveals truth, 
    // let's count: scanning a human = false scan (wasted scan). Missed = LMDs not scanned.
    const missedLMDs = agents.filter((a) => a.isLMD && !a.scanned).length;
    const falsScans = agents.filter((a) => !a.isLMD && a.scanned).length;

    const roundResult: RoundResult = {
      round: round + 1,
      correctDetections,
      falseAccusations: falsScans,
      missedLMDs,
    };

    setScore((prev) => ({
      correct: prev.correct + correctDetections,
      false: prev.false + falsScans,
      missed: prev.missed + missedLMDs,
    }));

    setLockdown((prev) => Math.min(MAX_LOCKDOWN, prev + missedLMDs * 20));
    setResults((prev) => [...prev, roundResult]);
    setRevealIndex(0);
    setPhase('reveal');
  }, [agents, round]);

  // Auto-advance reveal
  useEffect(() => {
    if (phase !== 'reveal') return;
    if (revealIndex >= agents.length) {
      setPhase('round-result');
      return;
    }
    const timer = setTimeout(() => setRevealIndex((i) => i + 1), 900);
    return () => clearTimeout(timer);
  }, [phase, revealIndex, agents.length]);

  // Advance to next round or debrief
  const nextRound = () => {
    if (round + 1 >= TOTAL_ROUNDS || lockdown >= MAX_LOCKDOWN) {
      setPhase('debrief');
    } else {
      startRound(round + 1);
    }
  };

  const restart = () => {
    setPhase('briefing');
    setRound(0);
    setScore({ correct: 0, false: 0, missed: 0 });
    setLockdown(0);
    setResults([]);
  };

  const baseSecure = lockdown < 60 && score.correct > score.missed;
  const totalLMDs = score.correct + score.missed;
  const detectionRate = totalLMDs > 0 ? Math.round((score.correct / totalLMDs) * 100) : 100;

  // ===================== RENDER =====================

  // --- Briefing ---
  if (phase === 'briefing') {
    return (
      <div className="relative min-h-[520px] flex flex-col items-center justify-center p-6">
        {/* Ambient grid background */}
        <div className="absolute inset-0 opacity-5 pointer-events-none"
          style={{
            backgroundImage: 'linear-gradient(rgba(16,185,129,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(16,185,129,0.3) 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }}
        />

        <div className="relative z-10 text-center max-w-lg">
          <div className="mb-6 relative inline-block">
            <Bot className="w-16 h-16 text-emerald-400 animate-pulse" />
            <div className="absolute -inset-3 border border-emerald-500/30 rounded-full animate-ping" style={{ animationDuration: '2s' }} />
          </div>

          <h1 className="font-heading text-3xl md:text-4xl font-bold text-emerald-400 mb-2 tracking-wider">
            LMD DETECTION PROTOCOL
          </h1>
          <p className="text-slate-400 font-mono-tech text-sm mb-6 tracking-wide">
            FRAMEWORK // LIFE MODEL DECOY IDENTIFICATION SYSTEM v4.7
          </p>

          <div className="bg-slate-900/80 border border-emerald-500/20 rounded-xl p-5 mb-6 text-left space-y-3">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-400 mt-0.5 flex-shrink-0" />
              <p className="text-slate-300 text-sm">
                <span className="text-amber-400 font-bold">PRIORITY ALERT:</span> LMD infiltrators detected within S.H.I.E.L.D. base.
                Multiple agents may have been replaced. Trust no one.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <Crosshair className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
              <p className="text-slate-300 text-sm">
                Analyze agent behavior for inconsistencies. Scan suspects to confirm.
                You have <span className="text-emerald-400 font-bold">{ROUND_TIME}s per round</span> across <span className="text-emerald-400 font-bold">{TOTAL_ROUNDS} rounds</span>.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <ShieldAlert className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
              <p className="text-slate-300 text-sm">
                Undetected LMDs increase the <span className="text-red-400 font-bold">Lockdown Meter</span>.
                If it reaches critical, the base is <span className="text-red-400 font-bold">COMPROMISED</span>.
              </p>
            </div>
          </div>

          <button
            onClick={() => startRound(0)}
            className="px-8 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl
              transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/30 tracking-wider
              border border-emerald-400/30"
          >
            <span className="flex items-center gap-2">
              <Scan className="w-5 h-5" />
              INITIATE SCAN PROTOCOL
            </span>
          </button>
        </div>
      </div>
    );
  }

  // --- Playing / Scanning / Reveal / Round Result ---
  if (phase === 'playing' || phase === 'scanning' || phase === 'reveal' || phase === 'round-result') {
    return (
      <div className="relative min-h-[520px] p-4 md:p-6">
        {/* Ambient grid background */}
        <div className="absolute inset-0 opacity-5 pointer-events-none"
          style={{
            backgroundImage: 'linear-gradient(rgba(16,185,129,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(16,185,129,0.3) 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }}
        />

        {/* HUD Header */}
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 mb-5">
          <div className="flex items-center gap-3">
            <Bot className="w-6 h-6 text-emerald-400" />
            <div>
              <h2 className="font-heading text-lg font-bold text-emerald-400 tracking-wider">ROUND {round + 1}/{TOTAL_ROUNDS}</h2>
              <p className="text-slate-500 font-mono-tech text-xs">LMD SCAN ACTIVE</p>
            </div>
          </div>

          {/* Timer */}
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border font-mono-tech text-sm font-bold
            ${timeLeft <= 5 ? 'border-red-500/50 text-red-400 bg-red-950/30 animate-pulse' : 'border-emerald-500/30 text-emerald-400 bg-slate-900/60'}`}>
            <Clock className="w-4 h-4" />
            {phase === 'playing' || phase === 'scanning' ? `${timeLeft}s` : '--'}
          </div>

          {/* Score */}
          <div className="flex items-center gap-4 font-mono-tech text-sm">
            <span className="text-emerald-400">
              <ShieldCheck className="w-4 h-4 inline mr-1" />{score.correct}
            </span>
            <span className="text-red-400">
              <AlertTriangle className="w-4 h-4 inline mr-1" />{score.missed}
            </span>
          </div>
        </div>

        {/* Lockdown Meter */}
        <div className="relative z-10 mb-5">
          <div className="flex items-center justify-between mb-1">
            <span className="font-mono-tech text-xs text-slate-500 tracking-wider">BASE LOCKDOWN STATUS</span>
            <span className={`font-mono-tech text-xs font-bold ${lockdown >= 60 ? 'text-red-400' : lockdown >= 40 ? 'text-amber-400' : 'text-emerald-400'}`}>
              {lockdown}%
            </span>
          </div>
          <div className="h-2 bg-slate-800 rounded-full overflow-hidden border border-slate-700/50">
            <div
              className={`h-full rounded-full transition-all duration-700 ${
                lockdown >= 60 ? 'bg-gradient-to-r from-red-600 to-red-400' :
                lockdown >= 40 ? 'bg-gradient-to-r from-amber-600 to-amber-400' :
                'bg-gradient-to-r from-emerald-600 to-emerald-400'
              }`}
              style={{ width: `${lockdown}%` }}
            />
          </div>
        </div>

        {/* Agent Cards */}
        <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
          {agents.map((agent) => {
            const isRevealed = phase === 'reveal' && revealIndex > agent.id;
            const isRoundResult = phase === 'round-result';
            const showResult = isRevealed || isRoundResult;
            const isScanning = phase === 'scanning' && scanningId === agent.id;
            const isGlitching = glitchId === agent.id;

            return (
              <div
                key={agent.id}
                className={`relative rounded-xl border p-4 transition-all duration-500 overflow-hidden
                  ${isGlitching ? 'animate-glitch-card' : ''}
                  ${showResult && agent.isLMD
                    ? 'border-red-500/60 bg-red-950/30 shadow-lg shadow-red-500/10'
                    : showResult && !agent.isLMD
                    ? 'border-emerald-500/40 bg-emerald-950/20'
                    : agent.scanned
                    ? 'border-sky-500/40 bg-slate-900/60'
                    : 'border-slate-700/50 bg-slate-900/60 hover:border-emerald-500/30 hover:bg-slate-900/80'
                  }`}
                style={isGlitching ? {
                  animation: 'glitch 0.3s ease-in-out infinite alternate',
                } : undefined}
              >
                {/* Scan line effect */}
                {isScanning && (
                  <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-xl">
                    <div className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent opacity-80"
                      style={{ animation: 'scanline 1.2s linear infinite' }}
                    />
                  </div>
                )}

                {/* LMD reveal overlay */}
                {showResult && agent.isLMD && (
                  <div className="absolute inset-0 pointer-events-none rounded-xl overflow-hidden">
                    <div className="absolute inset-0 bg-red-500/5" />
                    {/* Glitch lines */}
                    <div className="absolute top-1/4 left-0 right-0 h-px bg-red-500/40" />
                    <div className="absolute top-2/3 left-0 right-0 h-px bg-red-500/30" />
                  </div>
                )}

                {/* Agent info */}
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center
                      ${showResult && agent.isLMD ? 'bg-red-500/20' : 'bg-slate-800'}`}>
                      {showResult && agent.isLMD
                        ? <Bot className="w-4 h-4 text-red-400" />
                        : <User className="w-4 h-4 text-slate-400" />
                      }
                    </div>
                    <div>
                      <h3 className={`font-bold text-sm ${showResult && agent.isLMD ? 'text-red-400' : 'text-slate-200'}`}>
                        {agent.name}
                      </h3>
                      <p className="text-slate-500 text-xs font-mono-tech">{agent.role}</p>
                    </div>
                  </div>

                  {/* Status badge */}
                  {agent.scanned && (
                    <span className={`text-xs font-bold font-mono-tech px-2 py-0.5 rounded
                      ${agent.scanResult === 'lmd'
                        ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                        : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      }`}>
                      {agent.scanResult === 'lmd' ? '⚠ LMD' : '✓ HUMAN'}
                    </span>
                  )}
                  {showResult && !agent.scanned && agent.isLMD && (
                    <span className="text-xs font-bold font-mono-tech px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">
                      MISSED
                    </span>
                  )}
                </div>

                {/* Behavior description */}
                <p className={`text-sm mb-3 leading-relaxed ${showResult && agent.isLMD ? 'text-red-300/80' : 'text-slate-400'}`}>
                  "{agent.behavior}"
                </p>

                {/* Scan button */}
                {(phase === 'playing') && !agent.scanned && (
                  <button
                    onClick={() => scanAgent(agent.id)}
                    className="w-full py-2 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/40 border border-emerald-500/30
                      text-emerald-400 font-mono-tech text-xs font-bold tracking-wider
                      transition-all duration-300 hover:shadow-md hover:shadow-emerald-500/10
                      flex items-center justify-center gap-2"
                  >
                    <Crosshair className="w-3.5 h-3.5" />
                    INITIATE SCAN
                  </button>
                )}

                {isScanning && (
                  <div className="w-full py-2 rounded-lg bg-emerald-600/10 border border-emerald-500/20
                    text-emerald-400 font-mono-tech text-xs font-bold tracking-wider text-center animate-pulse">
                    SCANNING...
                  </div>
                )}

                {/* Reveal result text */}
                {showResult && (
                  <div className={`text-center py-1.5 rounded-lg font-mono-tech text-xs font-bold tracking-widest
                    ${agent.isLMD
                      ? 'text-red-400 bg-red-500/10 border border-red-500/20'
                      : 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/20'
                    }`}
                    style={agent.isLMD ? {
                      textShadow: '0 0 8px rgba(239,68,68,0.5)',
                    } : undefined}
                  >
                    {agent.isLMD ? '▸ LMD CONFIRMED ◂' : '▸ HUMAN VERIFIED ◂'}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Action buttons */}
        <div className="relative z-10 flex justify-center gap-4">
          {phase === 'playing' && (
            <button
              onClick={endRound}
              className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl
                transition-all duration-300 border border-slate-600/50 font-mono-tech text-sm tracking-wider
                flex items-center gap-2"
            >
              <Shield className="w-4 h-4" />
              LOCK IN RESULTS
            </button>
          )}

          {phase === 'round-result' && (
            <button
              onClick={nextRound}
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl
                transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/20 font-mono-tech text-sm tracking-wider
                flex items-center gap-2"
            >
              {round + 1 >= TOTAL_ROUNDS || lockdown >= MAX_LOCKDOWN ? (
                <>
                  <Activity className="w-4 h-4" />
                  VIEW DEBRIEF
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4" />
                  NEXT ROUND
                </>
              )}
            </button>
          )}
        </div>

        {/* CSS for scan line and glitch animations */}
        <style>{`
          @keyframes scanline {
            0% { top: -4px; }
            100% { top: calc(100% + 4px); }
          }
          @keyframes glitch {
            0% { transform: translate(0); filter: hue-rotate(0deg); }
            20% { transform: translate(-2px, 1px); filter: hue-rotate(90deg); }
            40% { transform: translate(2px, -1px) skewX(-1deg); }
            60% { transform: translate(-1px, 2px) skewX(1deg); filter: hue-rotate(180deg); }
            80% { transform: translate(1px, -2px); }
            100% { transform: translate(0) skewX(0); filter: hue-rotate(0deg); }
          }
        `}</style>
      </div>
    );
  }

  // --- Debrief ---
  if (phase === 'debrief') {
    return (
      <div className="relative min-h-[520px] flex flex-col items-center justify-center p-6">
        {/* Background */}
        <div className="absolute inset-0 opacity-5 pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(${baseSecure ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)'} 1px, transparent 1px), linear-gradient(90deg, ${baseSecure ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)'} 1px, transparent 1px)`,
            backgroundSize: '32px 32px',
          }}
        />

        <div className="relative z-10 text-center max-w-lg w-full">
          {/* Status Icon */}
          <div className="mb-4">
            {baseSecure ? (
              <ShieldCheck className="w-16 h-16 text-emerald-400 mx-auto" />
            ) : (
              <ShieldAlert className="w-16 h-16 text-red-400 mx-auto animate-pulse" />
            )}
          </div>

          <h2 className={`font-heading text-2xl md:text-3xl font-bold mb-1 tracking-wider
            ${baseSecure ? 'text-emerald-400' : 'text-red-400'}`}>
            {baseSecure ? 'BASE STATUS: SECURE' : 'BASE STATUS: COMPROMISED'}
          </h2>
          <p className="text-slate-500 font-mono-tech text-xs mb-6 tracking-wide">
            LMD DETECTION PROTOCOL — FINAL REPORT
          </p>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="bg-slate-900/80 border border-emerald-500/20 rounded-xl p-4 text-center">
              <p className="text-emerald-400 text-2xl font-bold font-mono-tech">{score.correct}</p>
              <p className="text-slate-500 text-xs font-mono-tech mt-1">LMDs DETECTED</p>
            </div>
            <div className="bg-slate-900/80 border border-red-500/20 rounded-xl p-4 text-center">
              <p className="text-red-400 text-2xl font-bold font-mono-tech">{score.missed}</p>
              <p className="text-slate-500 text-xs font-mono-tech mt-1">LMDs MISSED</p>
            </div>
            <div className="bg-slate-900/80 border border-amber-500/20 rounded-xl p-4 text-center">
              <p className="text-amber-400 text-2xl font-bold font-mono-tech">{score.false}</p>
              <p className="text-slate-500 text-xs font-mono-tech mt-1">FALSE SCANS</p>
            </div>
            <div className="bg-slate-900/80 border border-sky-500/20 rounded-xl p-4 text-center">
              <p className="text-sky-400 text-2xl font-bold font-mono-tech">{detectionRate}%</p>
              <p className="text-slate-500 text-xs font-mono-tech mt-1">DETECTION RATE</p>
            </div>
          </div>

          {/* Lockdown meter final */}
          <div className="bg-slate-900/80 border border-slate-700/50 rounded-xl p-4 mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono-tech text-xs text-slate-500 tracking-wider">FINAL LOCKDOWN LEVEL</span>
              <span className={`font-mono-tech text-sm font-bold ${lockdown >= 60 ? 'text-red-400' : lockdown >= 40 ? 'text-amber-400' : 'text-emerald-400'}`}>
                {lockdown}%
              </span>
            </div>
            <div className="h-3 bg-slate-800 rounded-full overflow-hidden border border-slate-700/50">
              <div
                className={`h-full rounded-full transition-all duration-1000 ${
                  lockdown >= 60 ? 'bg-gradient-to-r from-red-600 to-red-400' :
                  lockdown >= 40 ? 'bg-gradient-to-r from-amber-600 to-amber-400' :
                  'bg-gradient-to-r from-emerald-600 to-emerald-400'
                }`}
                style={{ width: `${lockdown}%` }}
              />
            </div>
          </div>

          {/* Round breakdown */}
          <div className="bg-slate-900/80 border border-slate-700/50 rounded-xl p-4 mb-6">
            <h3 className="font-mono-tech text-xs text-slate-500 tracking-wider mb-3">ROUND BREAKDOWN</h3>
            <div className="space-y-2">
              {results.map((r) => (
                <div key={r.round} className="flex items-center justify-between text-sm font-mono-tech">
                  <span className="text-slate-400">ROUND {r.round}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-emerald-400">+{r.correctDetections}</span>
                    <span className="text-red-400">{r.missedLMDs > 0 ? `-${r.missedLMDs}` : '0'}</span>
                    {r.falseAccusations > 0 && (
                      <span className="text-amber-400">~{r.falseAccusations}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Verdict message */}
          <div className={`rounded-xl border p-4 mb-6 ${baseSecure ? 'border-emerald-500/20 bg-emerald-950/20' : 'border-red-500/20 bg-red-950/20'}`}>
            <p className={`text-sm ${baseSecure ? 'text-emerald-300' : 'text-red-300'}`}>
              {baseSecure
                ? detectionRate >= 80
                  ? '"Outstanding work, Agent. The LMD threat has been neutralized. Director Coulson sends his regards — assuming he\'s the real one." — S.H.I.E.L.D. Command'
                  : '"The base is holding, but we lost some ground. Stay vigilant — Radcliffe\'s creations are getting harder to spot." — S.H.I.E.L.D. Command'
                : lockdown >= MAX_LOCKDOWN
                  ? '"It\'s too late. The LMDs have taken control of the base. AIDA\'s Framework protocol is now active. God help us all." — Final Transmission'
                  : '"Too many LMDs slipped through. The base perimeter has been breached. Initiating emergency evacuation protocols." — S.H.I.E.L.D. Command'
              }
            </p>
          </div>

          <button
            onClick={restart}
            className="px-8 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl
              transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/30 tracking-wider
              border border-emerald-400/30 font-mono-tech text-sm flex items-center gap-2 mx-auto"
          >
            <Scan className="w-4 h-4" />
            RESTART PROTOCOL
          </button>
        </div>
      </div>
    );
  }

  return null;
};
