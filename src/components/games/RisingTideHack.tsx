import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Terminal } from 'lucide-react';

// ─── Types ───────────────────────────────────────────────────────────────────

interface HackLevel {
  id: number;
  name: string;
  accessLevel: string;
  codeLength: number;
  timeLimit: number; // seconds
  charPool: string;
}

interface UnlockedFile {
  level: string;
  filename: string;
  contents: string;
}

type GamePhase = 'boot' | 'menu' | 'briefing' | 'hacking' | 'success' | 'failure' | 'complete';

// ─── Constants ───────────────────────────────────────────────────────────────

const LEVELS: HackLevel[] = [
  { id: 1, name: 'PERIMETER FIREWALL', accessLevel: 'CLASSIFIED', codeLength: 8, timeLimit: 20, charPool: '0123456789ABCDEF' },
  { id: 2, name: 'ENCRYPTION LAYER', accessLevel: 'SECRET', codeLength: 12, timeLimit: 18, charPool: '0123456789ABCDEF' },
  { id: 3, name: 'BIOMETRIC BYPASS', accessLevel: 'TOP SECRET', codeLength: 14, timeLimit: 16, charPool: '0123456789ABCDEFabcdef' },
  { id: 4, name: 'NEURAL FIREWALL', accessLevel: 'DIRECTOR EYES ONLY', codeLength: 18, timeLimit: 15, charPool: '0123456789ABCDEFabcdefGHIJKLMNOP' },
  { id: 5, name: 'THETA PROTOCOL VAULT', accessLevel: 'THETA PROTOCOL', codeLength: 22, timeLimit: 14, charPool: '0123456789ABCDEFabcdefGHIJKLMNOPQRSTUVWXYZ!@#$' },
];

const UNLOCKED_FILES: UnlockedFile[][] = [
  [
    { level: 'CLASSIFIED', filename: 'field_agents.dat', contents: 'Agent roster — 347 active operatives' },
    { level: 'CLASSIFIED', filename: 'safe_houses.enc', contents: 'Global safehouse network coordinates' },
  ],
  [
    { level: 'SECRET', filename: 'project_centipede.log', contents: 'Centipede serum test subjects & dosage records' },
    { level: 'SECRET', filename: 'clairvoyant_leads.dat', contents: 'Investigation notes — The Clairvoyant' },
  ],
  [
    { level: 'TOP SECRET', filename: 'tahiti_protocol.enc', contents: 'Project T.A.H.I.T.I. — GH-325 recovery data' },
    { level: 'TOP SECRET', filename: 'inhuman_index.db', contents: 'Known Inhuman registry & Terrigen exposure logs' },
  ],
  [
    { level: 'DIRECTOR EYES ONLY', filename: 'toolbox_alpha.sys', contents: "Fury's Toolbox — encrypted strategic directives" },
    { level: 'DIRECTOR EYES ONLY', filename: 'hydra_moles.enc', contents: 'Suspected HYDRA infiltrators within S.H.I.E.L.D.' },
  ],
  [
    { level: 'THETA PROTOCOL', filename: 'theta_protocol.ult', contents: 'Helicarrier reactivation — Avengers contingency' },
    { level: 'THETA PROTOCOL', filename: 'coulson_directive.fin', contents: "Coulson's final directive — S.H.I.E.L.D. succession" },
  ],
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

const generateCode = (level: HackLevel): string => {
  let code = '';
  for (let i = 0; i < level.codeLength; i++) {
    code += level.charPool[Math.floor(Math.random() * level.charPool.length)];
  }
  return code;
};

const randomHex = () => Math.floor(Math.random() * 256).toString(16).padStart(2, '0').toUpperCase();

// ─── Matrix Rain Column ──────────────────────────────────────────────────────

const MatrixColumn: React.FC<{ index: number }> = React.memo(({ index }) => {
  const chars = useRef<string[]>([]);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (chars.current.length === 0) {
      const len = 8 + Math.floor(Math.random() * 14);
      const pool = '0123456789ABCDEFアイウエオカキクケコサシスセソタチツテト';
      chars.current = Array.from({ length: len }, () => pool[Math.floor(Math.random() * pool.length)]);
    }
    const speed = 60 + Math.random() * 140;
    const iv = setInterval(() => setTick(t => t + 1), speed);
    return () => clearInterval(iv);
  }, []);

  const colChars = chars.current;
  const offset = tick % (colChars.length + 10);

  return (
    <div
      className="absolute top-0 text-[10px] leading-[14px] font-mono select-none pointer-events-none"
      style={{ left: `${index * 18}px`, opacity: 0.12 + Math.random() * 0.08 }}
    >
      {colChars.map((ch, i) => {
        const dist = offset - i;
        const isBright = dist >= 0 && dist < 2;
        const isVisible = dist >= 0 && dist < colChars.length;
        return (
          <div
            key={i}
            className={`${isBright ? 'text-green-300' : 'text-green-600'}`}
            style={{ opacity: isVisible ? Math.max(0.15, 1 - dist * 0.07) : 0 }}
          >
            {ch}
          </div>
        );
      })}
    </div>
  );
});

// ─── Matrix Rain Background ──────────────────────────────────────────────────

const MatrixRain: React.FC = React.memo(() => {
  const cols = Math.floor(typeof window !== 'undefined' ? Math.min(window.innerWidth, 900) / 18 : 50);
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {Array.from({ length: cols }, (_, i) => (
        <MatrixColumn key={i} index={i} />
      ))}
    </div>
  );
});

// ─── Boot Sequence ───────────────────────────────────────────────────────────

const BootSequence: React.FC<{ onDone: () => void }> = ({ onDone }) => {
  const [lines, setLines] = useState<string[]>([]);
  const bootLines = useRef([
    '> INITIALIZING RISING TIDE TOOLKIT v3.7.1...',
    '> Spoofing MAC address...       [OK]',
    '> Routing through TOR nodes...  [OK]',
    '> Bypassing DNS filters...      [OK]',
    '> Loading exploit payloads...   [OK]',
    '> Connecting to S.H.I.E.L.D. mainframe...',
    `> Target IP: 10.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}`,
    '> Connection established.',
    '> ACCESS POINT FOUND. Ready to breach.',
    '',
  ]);

  useEffect(() => {
    let i = 0;
    const iv = setInterval(() => {
      if (i < bootLines.current.length) {
        setLines(prev => [...prev, bootLines.current[i]]);
        i++;
      } else {
        clearInterval(iv);
        setTimeout(onDone, 600);
      }
    }, 320);
    return () => clearInterval(iv);
  }, [onDone]);

  return (
    <div className="font-mono text-sm text-green-400 space-y-1 p-2">
      {lines.map((l, i) => (
        <div key={i} className={`${l.includes('[OK]') ? 'text-green-300' : ''} ${l.includes('Ready') ? 'text-cyan-400 font-bold' : ''}`}>
          {l}
          {i === lines.length - 1 && <span className="animate-pulse ml-1">█</span>}
        </div>
      ))}
    </div>
  );
};

// ─── Scanline overlay ────────────────────────────────────────────────────────

const Scanlines: React.FC = () => (
  <div
    className="absolute inset-0 pointer-events-none z-30"
    style={{
      background: 'repeating-linear-gradient(0deg, rgba(0,255,100,0.03) 0px, rgba(0,255,100,0.03) 1px, transparent 1px, transparent 3px)',
    }}
  />
);

// ═══════════════════════════════════════════════════════════════════════════════
// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════════

export const RisingTideHack: React.FC = () => {
  // ── State ──────────────────────────────────────────────────────────────────
  const [phase, setPhase] = useState<GamePhase>('boot');
  const [currentLevel, setCurrentLevel] = useState(0);
  const [targetCode, setTargetCode] = useState('');
  const [typedText, setTypedText] = useState('');
  const [timeLeft, setTimeLeft] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [totalKeystrokes, setTotalKeystrokes] = useState(0);
  const [correctKeystrokes, setCorrectKeystrokes] = useState(0);
  const [levelsUnlocked, setLevelsUnlocked] = useState<number[]>([]);
  const [flashColor, setFlashColor] = useState<string | null>(null);
  const [terminalLog, setTerminalLog] = useState<string[]>([]);
  const [flickering, setFlickering] = useState(false);
  const [hexStream, setHexStream] = useState<string[]>([]);

  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const hexRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // ── Hex decoration stream ──────────────────────────────────────────────────
  useEffect(() => {
    if (phase === 'hacking') {
      hexRef.current = setInterval(() => {
        setHexStream(prev => {
          const next = [...prev, `0x${randomHex()}${randomHex()} ${randomHex()}${randomHex()} ${randomHex()}${randomHex()}`];
          return next.slice(-6);
        });
      }, 400);
    } else {
      setHexStream([]);
    }
    return () => { if (hexRef.current) clearInterval(hexRef.current); };
  }, [phase]);

  // ── Timer ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (phase === 'hacking' && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(t => {
          if (t <= 1) {
            clearInterval(timerRef.current!);
            setPhase('failure');
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [phase, timeLeft > 0]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Flash effect ───────────────────────────────────────────────────────────
  const triggerFlash = useCallback((color: string) => {
    setFlashColor(color);
    setTimeout(() => setFlashColor(null), 300);
  }, []);

  // ── Flicker effect for success ─────────────────────────────────────────────
  const triggerFlicker = useCallback(() => {
    setFlickering(true);
    let count = 0;
    const iv = setInterval(() => {
      count++;
      if (count >= 6) {
        clearInterval(iv);
        setFlickering(false);
      }
    }, 80);
  }, []);

  // ── Start a level ──────────────────────────────────────────────────────────
  const startLevel = useCallback((levelIdx: number) => {
    const level = LEVELS[levelIdx];
    const code = generateCode(level);
    setTargetCode(code);
    setTypedText('');
    setTimeLeft(level.timeLimit);
    setTotalKeystrokes(0);
    setCorrectKeystrokes(0);
    setAccuracy(100);
    setTerminalLog([
      `> Initiating breach: ${level.name}`,
      `> Security clearance required: ${level.accessLevel}`,
      `> Encryption: AES-${128 + levelIdx * 64} / RSA-${2048 + levelIdx * 1024}`,
      `> Time window: ${level.timeLimit}s before lockout`,
      '> TYPE THE CODE SEQUENCE EXACTLY.',
    ]);
    setPhase('briefing');
    setTimeout(() => {
      setPhase('hacking');
      setTimeout(() => inputRef.current?.focus(), 50);
    }, 2000);
  }, []);

  // ── Handle typing ──────────────────────────────────────────────────────────
  const handleInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (phase !== 'hacking') return;
    const val = e.target.value;
    const newChar = val.slice(-1);
    const pos = val.length - 1;
    const expected = targetCode[pos];

    setTotalKeystrokes(prev => prev + 1);

    if (newChar === expected) {
      setCorrectKeystrokes(prev => prev + 1);
      setTypedText(val);

      // Check completion
      if (val === targetCode) {
        if (timerRef.current) clearInterval(timerRef.current);
        triggerFlicker();
        triggerFlash('rgba(0,255,200,0.25)');
        setLevelsUnlocked(prev => [...prev, currentLevel]);
        setPhase('success');
      }
    } else {
      // Wrong key — flash red, don't advance
      triggerFlash('rgba(255,0,0,0.2)');
    }

    // Update accuracy
    setTotalKeystrokes(prev => {
      const tot = prev;
      const cor = newChar === expected ? correctKeystrokes + 1 : correctKeystrokes;
      setAccuracy(tot > 0 ? Math.round((cor / tot) * 100) : 100);
      return prev;
    });
  }, [phase, targetCode, currentLevel, correctKeystrokes, triggerFlash, triggerFlicker]);

  // ── Handle virtual on-screen keypad click ──────────────────────────────────
  const handleVirtualKey = useCallback((char: string) => {
    if (phase !== 'hacking') return;
    const pos = typedText.length;
    const expected = targetCode[pos];
    setTotalKeystrokes(prev => prev + 1);

    if (char === expected) {
      setCorrectKeystrokes(prev => prev + 1);
      const nextVal = typedText + char;
      setTypedText(nextVal);

      if (nextVal === targetCode) {
        if (timerRef.current) clearInterval(timerRef.current);
        triggerFlicker();
        triggerFlash('rgba(0,255,200,0.25)');
        setLevelsUnlocked(prev => [...prev, currentLevel]);
        setPhase('success');
      }
    } else {
      triggerFlash('rgba(255,0,0,0.2)');
    }
  }, [phase, typedText, targetCode, currentLevel, triggerFlash, triggerFlicker]);

  // ── Recalculate accuracy ───────────────────────────────────────────────────
  useEffect(() => {
    if (totalKeystrokes > 0) {
      setAccuracy(Math.round((correctKeystrokes / totalKeystrokes) * 100));
    }
  }, [totalKeystrokes, correctKeystrokes]);

  // ── Next level / complete ──────────────────────────────────────────────────
  const advanceLevel = useCallback(() => {
    if (currentLevel + 1 >= LEVELS.length) {
      setPhase('complete');
    } else {
      setCurrentLevel(prev => prev + 1);
      startLevel(currentLevel + 1);
    }
  }, [currentLevel, startLevel]);

  const retryLevel = useCallback(() => {
    startLevel(currentLevel);
  }, [currentLevel, startLevel]);

  const resetGame = useCallback(() => {
    setPhase('boot');
    setCurrentLevel(0);
    setLevelsUnlocked([]);
    setTerminalLog([]);
    setTypedText('');
    setTargetCode('');
  }, []);

  // ── Progress ───────────────────────────────────────────────────────────────
  const progress = targetCode.length > 0 ? (typedText.length / targetCode.length) * 100 : 0;
  const level = LEVELS[currentLevel];
  const timePercent = level ? (timeLeft / level.timeLimit) * 100 : 100;

  // ═══════════════════════════════════════════════════════════════════════════
  // ─── RENDER ────────────────────────────────────────────────────────────────
  // ═══════════════════════════════════════════════════════════════════════════

  return (
    <div className="relative w-full max-w-3xl mx-auto select-none" style={{ fontFamily: "'Courier New', Courier, monospace" }}>
      {/* ── Outer bezel ─────────────────────────────────────────────────── */}
      <div
        className="rounded-2xl border-2 border-green-900/60 overflow-hidden shadow-[0_0_40px_rgba(0,255,100,0.12)]"
        style={{
          background: 'linear-gradient(180deg, #0a0f0a 0%, #050a05 100%)',
          opacity: flickering ? (Math.random() > 0.5 ? 0.4 : 1) : 1,
          transition: 'opacity 0.05s',
        }}
      >
        {/* Flash overlay */}
        {flashColor && (
          <div className="absolute inset-0 z-40 pointer-events-none rounded-2xl" style={{ background: flashColor }} />
        )}

        <Scanlines />
        <MatrixRain />

        {/* ── Header bar ──────────────────────────────────────────────── */}
        <div className="relative z-10 flex items-center gap-3 px-4 py-3 border-b border-green-900/40 bg-black/60 backdrop-blur-sm">
          <Terminal className="w-5 h-5 text-green-400" />
          <span className="text-green-400 text-sm font-bold tracking-widest">RISING TIDE // TERMINAL</span>
          <div className="ml-auto flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-green-500 shadow-[0_0_6px_rgba(0,255,100,0.6)] animate-pulse" />
            <div className="w-2.5 h-2.5 rounded-full bg-green-800" />
            <div className="w-2.5 h-2.5 rounded-full bg-green-800" />
          </div>
        </div>

        {/* ── Main viewport ───────────────────────────────────────────── */}
        <div className="relative z-10 min-h-[420px] p-4 md:p-6">

          {/* ── BOOT ────────────────────────────────────────────────── */}
          {phase === 'boot' && (
            <BootSequence onDone={() => setPhase('menu')} />
          )}

          {/* ── MENU ────────────────────────────────────────────────── */}
          {phase === 'menu' && (
            <div className="space-y-5 animate-[fadeIn_0.5s_ease]">
              <div className="text-center space-y-2">
                <h2 className="text-2xl md:text-3xl font-bold text-green-400 tracking-wider">
                  ████ RISING TIDE ████
                </h2>
                <p className="text-green-600 text-xs tracking-[0.3em]">INFORMATION WANTS TO BE FREE</p>
                <div className="w-48 mx-auto h-px bg-gradient-to-r from-transparent via-green-500 to-transparent mt-2" />
              </div>

              <div className="text-cyan-400 text-sm text-center mb-4">
                S.H.I.E.L.D. MAINFRAME BREACH — {LEVELS.length} SECURITY LAYERS DETECTED
              </div>

              <div className="space-y-2 max-w-md mx-auto">
                {LEVELS.map((l, i) => {
                  const unlocked = levelsUnlocked.includes(i);
                  const available = i === 0 || levelsUnlocked.includes(i - 1);
                  return (
                    <button
                      key={l.id}
                      disabled={!available}
                      onClick={() => { setCurrentLevel(i); startLevel(i); }}
                      className={`w-full text-left px-4 py-2.5 rounded-lg border transition-all duration-200 flex items-center justify-between group
                        ${unlocked
                          ? 'border-green-500/40 bg-green-950/30 text-green-400'
                          : available
                            ? 'border-green-800/50 bg-black/40 text-green-400 hover:border-green-500/60 hover:bg-green-950/20 cursor-pointer'
                            : 'border-gray-800/30 bg-black/20 text-gray-700 cursor-not-allowed'
                        }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className={`text-xs px-1.5 py-0.5 rounded font-bold ${unlocked ? 'bg-green-500/20 text-green-300' : available ? 'bg-green-900/30 text-green-500' : 'bg-gray-900/30 text-gray-700'}`}>
                          L{l.id}
                        </span>
                        <span className="text-sm">{l.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {unlocked && <span className="text-[10px] text-green-500 tracking-wider">BREACHED</span>}
                        {!unlocked && available && <span className="text-[10px] text-green-700 group-hover:text-green-400 tracking-wider">LOCKED</span>}
                        {!unlocked && !available && <span className="text-[10px] text-gray-700 tracking-wider">████</span>}
                      </div>
                    </button>
                  );
                })}
              </div>

              {levelsUnlocked.length === LEVELS.length && (
                <div className="text-center mt-4">
                  <button
                    onClick={() => setPhase('complete')}
                    className="px-6 py-2 rounded-lg border border-cyan-500/50 bg-cyan-950/30 text-cyan-400 hover:bg-cyan-900/30 transition-all text-sm tracking-wider"
                  >
                    VIEW ALL EXTRACTED FILES
                  </button>
                </div>
              )}

              {levelsUnlocked.length > 0 && (
                <div className="text-center">
                  <button
                    onClick={resetGame}
                    className="text-xs text-green-800 hover:text-green-500 transition-colors mt-2"
                  >
                    [ RESET TERMINAL ]
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ── BRIEFING ────────────────────────────────────────────── */}
          {phase === 'briefing' && (
            <div className="space-y-2 animate-[fadeIn_0.3s_ease]">
              {terminalLog.map((line, i) => (
                <div key={i} className={`text-sm ${line.includes('TYPE') ? 'text-cyan-400 font-bold' : 'text-green-500'}`}>
                  {line}
                </div>
              ))}
              <div className="text-green-400 animate-pulse mt-4 text-sm">Preparing exploit...</div>
            </div>
          )}

          {/* ── HACKING ─────────────────────────────────────────────── */}
          {phase === 'hacking' && level && (
            <div className="space-y-4 animate-[fadeIn_0.3s_ease]">
              {/* Status bar */}
              <div className="flex items-center justify-between text-xs text-green-600">
                <span>LEVEL {level.id} — {level.name}</span>
                <span className="text-cyan-500">{level.accessLevel}</span>
              </div>

              {/* Time bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className={`${timeLeft <= 5 ? 'text-red-400 animate-pulse' : 'text-green-600'}`}>
                    TIME: {timeLeft}s
                  </span>
                  <span className="text-green-600">ACCURACY: {accuracy}%</span>
                </div>
                <div className="w-full h-2 bg-gray-900 rounded-full overflow-hidden border border-green-900/40">
                  <div
                    className={`h-full transition-all duration-1000 ease-linear rounded-full ${
                      timePercent > 40 ? 'bg-green-500 shadow-[0_0_8px_rgba(0,255,100,0.5)]'
                        : timePercent > 20 ? 'bg-yellow-500 shadow-[0_0_8px_rgba(255,200,0,0.5)]'
                        : 'bg-red-500 shadow-[0_0_8px_rgba(255,0,0,0.5)] animate-pulse'
                    }`}
                    style={{ width: `${timePercent}%` }}
                  />
                </div>
              </div>

              {/* Target code display */}
              <div className="space-y-2">
                <div className="text-xs text-green-700">TARGET SEQUENCE:</div>
                <div className="bg-black/60 border border-green-900/40 rounded-lg p-3 overflow-x-auto">
                  <div className="flex flex-wrap gap-0">
                    {targetCode.split('').map((char, i) => {
                      const isTyped = i < typedText.length;
                      const isCurrent = i === typedText.length;
                      return (
                        <span
                          key={i}
                          className={`inline-block w-[1.4em] text-center text-lg md:text-xl py-1 border-b-2 transition-all duration-100
                            ${isTyped
                              ? 'text-cyan-300 border-cyan-500 bg-cyan-950/20'
                              : isCurrent
                                ? 'text-green-300 border-green-400 animate-pulse bg-green-950/20'
                                : 'text-green-700/60 border-green-900/30'
                            }`}
                        >
                          {char}
                        </span>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Hack progress */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-green-600">
                  <span>BREACH PROGRESS</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <div className="w-full h-3 bg-gray-900 rounded-full overflow-hidden border border-green-900/40">
                  <div
                    className="h-full bg-gradient-to-r from-green-600 to-cyan-400 rounded-full transition-all duration-150 shadow-[0_0_12px_rgba(0,255,200,0.4)]"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              {/* Hidden input for typing */}
              <input
                ref={inputRef}
                type="text"
                value={typedText}
                onChange={handleInput}
                className="absolute opacity-0 w-0 h-0"
                autoFocus
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck={false}
              />

              {/* Click to focus prompt */}
              <button
                onClick={() => inputRef.current?.focus()}
                className="w-full text-center text-xs text-green-500/60 hover:text-green-400 transition-colors py-1"
              >
                [ CLICK HERE OR START TYPING ]
              </button>

              {/* Virtual On-Screen Keypad for click/tap */}
              <div className="pt-2 border-t border-green-900/30">
                <div className="text-[10px] text-green-600 uppercase tracking-widest mb-1.5 flex justify-between items-center font-mono">
                  <span>CYBER KEYPAD // TAP OR CLICK TO INJECT KEY:</span>
                  <span className="text-cyan-400 font-bold">NEXT: [{targetCode[typedText.length] || 'DONE'}]</span>
                </div>
                <div className="grid grid-cols-8 gap-1.5">
                  {Array.from(new Set([...targetCode.slice(typedText.length, typedText.length + 4).split(''), ...'0123456789ABCDEF'.split('')])).slice(0, 16).map(char => (
                    <button
                      key={char}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleVirtualKey(char);
                        inputRef.current?.focus();
                      }}
                      className={`py-2 rounded-lg font-mono text-xs font-bold border transition-all ${
                        char === targetCode[typedText.length]
                          ? 'bg-green-600/30 border-green-400 text-green-300 shadow-[0_0_8px_rgba(34,197,94,0.4)] scale-105 animate-pulse'
                          : 'bg-black/40 border-green-900/50 text-green-600 hover:border-green-600 hover:text-green-300'
                      }`}
                    >
                      {char}
                    </button>
                  ))}
                </div>
              </div>

              {/* Hex stream decoration */}
              <div className="space-y-0.5 mt-2">
                {hexStream.map((h, i) => (
                  <div key={i} className="text-[10px] text-green-800/50">{h}</div>
                ))}
              </div>
            </div>
          )}

          {/* ── SUCCESS ─────────────────────────────────────────────── */}
          {phase === 'success' && level && (
            <div className="space-y-5 text-center animate-[fadeIn_0.5s_ease]">
              <div className="space-y-2">
                <div className="text-3xl text-cyan-400 font-bold tracking-wider">ACCESS GRANTED</div>
                <div className="text-green-500 text-sm">Security layer breached: {level.name}</div>
                <div className="text-green-600 text-xs">Clearance acquired: {level.accessLevel}</div>
              </div>

              <div className="w-64 mx-auto h-px bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />

              <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto text-left">
                <div className="bg-black/40 border border-green-900/30 rounded-lg p-3">
                  <div className="text-[10px] text-green-700">TIME REMAINING</div>
                  <div className="text-lg text-green-400">{timeLeft}s</div>
                </div>
                <div className="bg-black/40 border border-green-900/30 rounded-lg p-3">
                  <div className="text-[10px] text-green-700">ACCURACY</div>
                  <div className="text-lg text-cyan-400">{accuracy}%</div>
                </div>
              </div>

              {/* Files unlocked */}
              <div className="text-left max-w-sm mx-auto space-y-1.5">
                <div className="text-xs text-green-700 mb-2">FILES EXTRACTED:</div>
                {UNLOCKED_FILES[currentLevel].map((f, i) => (
                  <div key={i} className="flex items-start gap-2 bg-black/30 border border-green-900/20 rounded px-3 py-2">
                    <span className="text-cyan-500 text-xs mt-0.5">▸</span>
                    <div>
                      <div className="text-green-400 text-sm">{f.filename}</div>
                      <div className="text-green-700 text-[10px]">{f.contents}</div>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={advanceLevel}
                className="px-6 py-2.5 rounded-lg border border-cyan-500/50 bg-cyan-950/30 text-cyan-400 hover:bg-cyan-900/30 hover:border-cyan-400/60 transition-all text-sm tracking-wider"
              >
                {currentLevel + 1 >= LEVELS.length ? '[ VIEW ALL FILES ]' : '[ NEXT LAYER → ]'}
              </button>
            </div>
          )}

          {/* ── FAILURE ─────────────────────────────────────────────── */}
          {phase === 'failure' && level && (
            <div className="space-y-5 text-center animate-[fadeIn_0.4s_ease]">
              <div className="space-y-2">
                <div className="text-3xl text-red-500 font-bold tracking-wider animate-pulse">LOCKOUT DETECTED</div>
                <div className="text-red-400/70 text-sm">Intrusion countermeasures activated</div>
                <div className="text-red-900 text-xs">Layer: {level.name} — BREACH FAILED</div>
              </div>

              <div className="w-48 mx-auto h-px bg-gradient-to-r from-transparent via-red-600 to-transparent" />

              <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto text-left">
                <div className="bg-black/40 border border-red-900/30 rounded-lg p-3">
                  <div className="text-[10px] text-red-800">PROGRESS</div>
                  <div className="text-lg text-red-400">{Math.round(progress)}%</div>
                </div>
                <div className="bg-black/40 border border-red-900/30 rounded-lg p-3">
                  <div className="text-[10px] text-red-800">ACCURACY</div>
                  <div className="text-lg text-red-400">{accuracy}%</div>
                </div>
              </div>

              <div className="text-red-700 text-xs">
                &gt; WARNING: S.H.I.E.L.D. trace initiated. Re-routing connection...
              </div>

              <div className="flex gap-3 justify-center">
                <button
                  onClick={retryLevel}
                  className="px-6 py-2.5 rounded-lg border border-green-600/50 bg-green-950/30 text-green-400 hover:bg-green-900/30 transition-all text-sm tracking-wider"
                >
                  [ RETRY BREACH ]
                </button>
                <button
                  onClick={() => setPhase('menu')}
                  className="px-6 py-2.5 rounded-lg border border-green-900/40 bg-black/30 text-green-700 hover:text-green-400 hover:border-green-700/50 transition-all text-sm tracking-wider"
                >
                  [ ABORT ]
                </button>
              </div>
            </div>
          )}

          {/* ── COMPLETE ────────────────────────────────────────────── */}
          {phase === 'complete' && (
            <div className="space-y-5 animate-[fadeIn_0.6s_ease]">
              <div className="text-center space-y-2">
                <div className="text-2xl md:text-3xl text-cyan-400 font-bold tracking-wider">
                  FULL ACCESS ACHIEVED
                </div>
                <div className="text-green-500 text-sm">All {levelsUnlocked.length} security layers breached</div>
                <div className="text-green-700 text-[10px] tracking-[0.3em]">S.H.I.E.L.D. MAINFRAME COMPROMISED</div>
                <div className="w-64 mx-auto h-px bg-gradient-to-r from-transparent via-cyan-500 to-transparent mt-1" />
              </div>

              <div className="space-y-3 max-w-lg mx-auto">
                {UNLOCKED_FILES.map((files, levelIdx) => {
                  const isUnlocked = levelsUnlocked.includes(levelIdx);
                  return (
                    <div key={levelIdx} className={`border rounded-lg overflow-hidden ${isUnlocked ? 'border-green-800/40' : 'border-gray-800/30'}`}>
                      <div className={`px-3 py-1.5 text-xs flex items-center justify-between ${isUnlocked ? 'bg-green-950/30 text-green-500' : 'bg-gray-950/30 text-gray-700'}`}>
                        <span>{LEVELS[levelIdx].accessLevel}</span>
                        <span className={`text-[10px] ${isUnlocked ? 'text-cyan-500' : 'text-gray-700'}`}>
                          {isUnlocked ? 'DECRYPTED' : 'ENCRYPTED'}
                        </span>
                      </div>
                      {isUnlocked ? (
                        <div className="divide-y divide-green-900/20">
                          {files.map((f, fi) => (
                            <div key={fi} className="px-3 py-2 bg-black/20 flex items-start gap-2">
                              <span className="text-cyan-600 text-xs mt-0.5">▸</span>
                              <div>
                                <div className="text-green-400 text-sm">{f.filename}</div>
                                <div className="text-green-700 text-[10px]">{f.contents}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="px-3 py-3 bg-black/20 text-gray-700 text-xs">
                          ██████████ ENCRYPTED ██████████
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="text-center">
                <button
                  onClick={() => setPhase('menu')}
                  className="px-6 py-2.5 rounded-lg border border-green-700/50 bg-green-950/30 text-green-400 hover:bg-green-900/30 transition-all text-sm tracking-wider mr-3"
                >
                  [ RETURN TO TERMINAL ]
                </button>
                <button
                  onClick={resetGame}
                  className="px-6 py-2.5 rounded-lg border border-green-900/40 bg-black/30 text-green-700 hover:text-green-400 hover:border-green-700/50 transition-all text-sm tracking-wider"
                >
                  [ NEW SESSION ]
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ── Footer ──────────────────────────────────────────────────── */}
        <div className="relative z-10 px-4 py-2 border-t border-green-900/30 bg-black/40 flex items-center justify-between text-[10px] text-green-800">
          <span>RISING TIDE v3.7.1 // SKYE</span>
          <span>
            {levelsUnlocked.length}/{LEVELS.length} LAYERS BREACHED
          </span>
        </div>
      </div>

      {/* ── fadeIn keyframe (injected once) ──────────────────────────── */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};
