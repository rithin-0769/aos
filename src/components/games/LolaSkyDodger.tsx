import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Activity } from 'lucide-react';

// --- Types ---
interface Obstacle {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
  type: 'building' | 'bird' | 'drone';
  color: string;
}

interface TrailParticle {
  id: number;
  x: number;
  y: number;
  opacity: number;
}

interface Star {
  x: number;
  y: number;
  size: number;
  speed: number;
  opacity: number;
}

type GameState = 'start' | 'playing' | 'gameover';

// --- Constants ---
const GAME_WIDTH = 600;
const GAME_HEIGHT = 400;
const LOLA_WIDTH = 52;
const LOLA_HEIGHT = 24;
const LOLA_SPEED = 5;
const INITIAL_OBSTACLE_SPEED = 3;
const SPEED_INCREMENT = 0.0005;
const OBSTACLE_SPAWN_INTERVAL = 70; // frames
const MAX_TRAIL_LENGTH = 12;

const OBSTACLE_CONFIGS = {
  building: { minW: 40, maxW: 60, minH: 80, maxH: 180, colors: ['#1e293b', '#0f172a', '#1a1a2e'] },
  bird: { minW: 18, maxW: 26, minH: 12, maxH: 18, colors: ['#475569', '#64748b'] },
  drone: { minW: 28, maxW: 38, minH: 20, maxH: 28, colors: ['#991b1b', '#7f1d1d', '#450a0a'] },
};

// --- Helpers ---
const rand = (min: number, max: number) => Math.random() * (max - min) + min;

const checkCollision = (
  lx: number, ly: number, lw: number, lh: number,
  ox: number, oy: number, ow: number, oh: number,
  shrink = 4
): boolean => {
  return (
    lx + shrink < ox + ow &&
    lx + lw - shrink > ox &&
    ly + shrink < oy + oh &&
    ly + lh - shrink > oy
  );
};

// --- Component ---
export const LolaSkyDodger: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>('start');
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);

  // Refs for game loop values (avoids stale closures)
  const lolaY = useRef(GAME_HEIGHT / 2 - LOLA_HEIGHT / 2);
  const obstacles = useRef<Obstacle[]>([]);
  const trail = useRef<TrailParticle[]>([]);
  const stars = useRef<Star[]>([]);
  const frameCount = useRef(0);
  const obstacleSpeed = useRef(INITIAL_OBSTACLE_SPEED);
  const scoreRef = useRef(0);
  const highScoreRef = useRef(0);
  const keysDown = useRef<Set<string>>(new Set());
  const nextObstacleId = useRef(0);
  const nextTrailId = useRef(0);
  const animFrameId = useRef<number>(0);
  const gameAreaRef = useRef<HTMLDivElement>(null);

  // Render trigger
  const [, forceRender] = useState(0);
  const triggerRender = useCallback(() => forceRender((v) => v + 1), []);

  // --- Initialize stars ---
  const initStars = useCallback(() => {
    const s: Star[] = [];
    for (let i = 0; i < 40; i++) {
      s.push({
        x: rand(0, GAME_WIDTH),
        y: rand(0, GAME_HEIGHT),
        size: rand(1, 3),
        speed: rand(0.3, 1.2),
        opacity: rand(0.3, 0.9),
      });
    }
    stars.current = s;
  }, []);

  // --- Spawn obstacle ---
  const spawnObstacle = useCallback(() => {
    const types: Array<'building' | 'bird' | 'drone'> = ['building', 'bird', 'drone'];
    const weights = [0.35, 0.35, 0.3];
    const r = Math.random();
    let type: 'building' | 'bird' | 'drone' = 'bird';
    let cumulative = 0;
    for (let i = 0; i < types.length; i++) {
      cumulative += weights[i];
      if (r < cumulative) { type = types[i]; break; }
    }

    const cfg = OBSTACLE_CONFIGS[type];
    const w = rand(cfg.minW, cfg.maxW);
    const h = rand(cfg.minH, cfg.maxH);
    const color = cfg.colors[Math.floor(Math.random() * cfg.colors.length)];

    let y: number;
    if (type === 'building') {
      // Buildings rise from the bottom
      y = GAME_HEIGHT - h;
    } else {
      y = rand(10, GAME_HEIGHT - h - 10);
    }

    obstacles.current.push({
      id: nextObstacleId.current++,
      x: GAME_WIDTH + 10,
      y, width: w, height: h, type, color,
    });
  }, []);

  // --- Game loop ---
  const gameLoop = useCallback(() => {
    // Input handling
    const keys = keysDown.current;
    if (keys.has('ArrowUp') || keys.has('w') || keys.has('W')) {
      lolaY.current = Math.max(0, lolaY.current - LOLA_SPEED);
    }
    if (keys.has('ArrowDown') || keys.has('s') || keys.has('S')) {
      lolaY.current = Math.min(GAME_HEIGHT - LOLA_HEIGHT, lolaY.current + LOLA_SPEED);
    }

    // Update speed
    obstacleSpeed.current += SPEED_INCREMENT;
    frameCount.current++;

    // Spawn obstacles
    const spawnRate = Math.max(30, OBSTACLE_SPAWN_INTERVAL - Math.floor(frameCount.current / 200));
    if (frameCount.current % spawnRate === 0) {
      spawnObstacle();
    }

    // Move obstacles
    const speed = obstacleSpeed.current;
    obstacles.current = obstacles.current
      .map((o) => ({ ...o, x: o.x - speed }))
      .filter((o) => o.x + o.width > -20);

    // Move stars
    stars.current = stars.current.map((s) => ({
      ...s,
      x: s.x - s.speed,
      ...(s.x < -5 ? { x: GAME_WIDTH + 5, y: rand(0, GAME_HEIGHT) } : {}),
    }));

    // Trail
    trail.current.push({
      id: nextTrailId.current++,
      x: 60,
      y: lolaY.current + LOLA_HEIGHT / 2,
      opacity: 0.9,
    });
    trail.current = trail.current
      .map((t) => ({ ...t, x: t.x - 1.5, opacity: t.opacity - 0.07 }))
      .filter((t) => t.opacity > 0)
      .slice(-MAX_TRAIL_LENGTH);

    // Score
    scoreRef.current += 1;
    if (frameCount.current % 4 === 0) {
      setScore(scoreRef.current);
    }

    // Collision detection
    const lolaX = 60;
    const ly = lolaY.current;
    for (const obs of obstacles.current) {
      if (checkCollision(lolaX, ly, LOLA_WIDTH, LOLA_HEIGHT, obs.x, obs.y, obs.width, obs.height)) {
        // Game over!
        if (scoreRef.current > highScoreRef.current) {
          highScoreRef.current = scoreRef.current;
          setHighScore(scoreRef.current);
        }
        setGameState('gameover');
        return; // Stop the loop
      }
    }

    triggerRender();
    animFrameId.current = requestAnimationFrame(gameLoop);
  }, [spawnObstacle, triggerRender]);

  // --- Start / Restart ---
  const startGame = useCallback(() => {
    lolaY.current = GAME_HEIGHT / 2 - LOLA_HEIGHT / 2;
    obstacles.current = [];
    trail.current = [];
    frameCount.current = 0;
    obstacleSpeed.current = INITIAL_OBSTACLE_SPEED;
    scoreRef.current = 0;
    nextObstacleId.current = 0;
    nextTrailId.current = 0;
    setScore(0);
    initStars();
    setGameState('playing');
  }, [initStars]);

  // --- Run game loop when playing ---
  useEffect(() => {
    if (gameState === 'playing') {
      animFrameId.current = requestAnimationFrame(gameLoop);
    }
    return () => {
      if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
    };
  }, [gameState, gameLoop]);

  // --- Keyboard handlers ---
  useEffect(() => {
    const handleDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', ' ', 'w', 's', 'W', 'S'].includes(e.key)) {
        // Prevent page scrolling while controlling LOLA
        e.preventDefault();
      }
      keysDown.current.add(e.key);
      if (e.key === ' ' || e.key === 'Enter') {
        if (gameState === 'start' || gameState === 'gameover') {
          startGame();
        }
      }
    };
    const handleUp = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', ' ', 'w', 's', 'W', 'S'].includes(e.key)) {
        e.preventDefault();
      }
      keysDown.current.delete(e.key);
    };
    window.addEventListener('keydown', handleDown, { passive: false });
    window.addEventListener('keyup', handleUp, { passive: false });
    return () => {
      window.removeEventListener('keydown', handleDown);
      window.removeEventListener('keyup', handleUp);
    };
  }, [gameState, startGame]);

  // --- Touch handlers ---
  const handleTouch = useCallback((e: React.TouchEvent) => {
    if (gameState !== 'playing') return;
    const rect = gameAreaRef.current?.getBoundingClientRect();
    if (!rect) return;
    const touchY = e.touches[0].clientY - rect.top;
    const mid = rect.height / 2;
    if (touchY < mid) {
      keysDown.current.add('ArrowUp');
      keysDown.current.delete('ArrowDown');
    } else {
      keysDown.current.add('ArrowDown');
      keysDown.current.delete('ArrowUp');
    }
  }, [gameState]);

  const handleTouchEnd = useCallback(() => {
    keysDown.current.delete('ArrowUp');
    keysDown.current.delete('ArrowDown');
  }, []);

  // Init stars on mount for start screen
  useEffect(() => { initStars(); }, [initStars]);

  // --- Render obstacle shape ---
  const renderObstacle = (obs: Obstacle) => {
    if (obs.type === 'building') {
      // Building with windows
      const windowRows = Math.floor(obs.height / 24);
      const windowCols = Math.floor(obs.width / 16);
      return (
        <div
          key={obs.id}
          className="absolute"
          style={{
            left: obs.x, top: obs.y,
            width: obs.width, height: obs.height,
            background: obs.color,
            borderTop: '3px solid #334155',
            borderLeft: '1px solid #334155',
            borderRight: '1px solid #334155',
          }}
        >
          {Array.from({ length: windowRows }).map((_, r) =>
            Array.from({ length: windowCols }).map((_, c) => (
              <div
                key={`${r}-${c}`}
                className="absolute"
                style={{
                  left: 4 + c * 14,
                  top: 6 + r * 22,
                  width: 6, height: 10,
                  background: Math.random() > 0.4 ? '#fbbf24' : '#1e293b',
                  opacity: 0.8,
                }}
              />
            ))
          )}
        </div>
      );
    }

    if (obs.type === 'drone') {
      // HYDRA drone — diamond shape with glow
      return (
        <div
          key={obs.id}
          className="absolute"
          style={{ left: obs.x, top: obs.y, width: obs.width, height: obs.height }}
        >
          {/* Body */}
          <div
            className="absolute"
            style={{
              left: '20%', top: '20%',
              width: '60%', height: '60%',
              background: obs.color,
              transform: 'rotate(45deg)',
              boxShadow: '0 0 10px 2px rgba(220,38,38,0.5)',
            }}
          />
          {/* Eye */}
          <div
            className="absolute rounded-full"
            style={{
              left: '40%', top: '35%',
              width: '20%', height: '20%',
              background: '#ef4444',
              boxShadow: '0 0 6px 2px rgba(239,68,68,0.8)',
            }}
          />
        </div>
      );
    }

    // Bird
    return (
      <div
        key={obs.id}
        className="absolute"
        style={{ left: obs.x, top: obs.y, width: obs.width, height: obs.height }}
      >
        <div
          className="absolute"
          style={{
            left: 0, top: '40%',
            width: '100%', height: '20%',
            background: obs.color,
            borderRadius: '50%',
          }}
        />
        {/* Wings */}
        <div
          className="absolute"
          style={{
            left: '10%', top: 0,
            width: '35%', height: '50%',
            background: obs.color,
            borderRadius: '50% 50% 0 0',
            transform: `rotate(${Math.sin(frameCount.current * 0.3) * 25}deg)`,
            transformOrigin: 'bottom center',
          }}
        />
        <div
          className="absolute"
          style={{
            right: '10%', top: 0,
            width: '35%', height: '50%',
            background: obs.color,
            borderRadius: '50% 50% 0 0',
            transform: `rotate(${-Math.sin(frameCount.current * 0.3) * 25}deg)`,
            transformOrigin: 'bottom center',
          }}
        />
      </div>
    );
  };

  // --- LOLA car shape ---
  const renderLola = () => {
    const y = lolaY.current;
    return (
      <div
        className="absolute z-20"
        style={{ left: 60, top: y, width: LOLA_WIDTH, height: LOLA_HEIGHT }}
      >
        {/* Car body */}
        <div
          className="absolute rounded-md"
          style={{
            left: 0, top: 4,
            width: LOLA_WIDTH, height: 16,
            background: 'linear-gradient(135deg, #e11d48, #be185d)',
            boxShadow: '0 0 12px 3px rgba(236,72,153,0.5)',
            borderRadius: '4px 10px 10px 4px',
          }}
        />
        {/* Windshield */}
        <div
          className="absolute"
          style={{
            right: 2, top: 6,
            width: 10, height: 12,
            background: 'rgba(125,211,252,0.6)',
            borderRadius: '2px 6px 6px 2px',
          }}
        />
        {/* Roof/cabin */}
        <div
          className="absolute rounded-sm"
          style={{
            left: 16, top: 1,
            width: 22, height: 8,
            background: '#be185d',
            borderRadius: '4px 4px 0 0',
          }}
        />
        {/* Headlight */}
        <div
          className="absolute rounded-full"
          style={{
            right: -2, top: 10,
            width: 5, height: 5,
            background: '#fbbf24',
            boxShadow: '0 0 8px 2px rgba(251,191,36,0.7)',
          }}
        />
        {/* Wheels / hover glow */}
        <div
          className="absolute rounded-full"
          style={{
            left: 6, bottom: -2,
            width: 8, height: 4,
            background: '#38bdf8',
            boxShadow: '0 2px 8px 2px rgba(56,189,248,0.6)',
          }}
        />
        <div
          className="absolute rounded-full"
          style={{
            right: 8, bottom: -2,
            width: 8, height: 4,
            background: '#38bdf8',
            boxShadow: '0 2px 8px 2px rgba(56,189,248,0.6)',
          }}
        />
        {/* Exhaust flame */}
        <div
          className="absolute"
          style={{
            left: -12, top: 8,
            width: 14, height: 8,
            background: 'linear-gradient(to left, #f97316, #eab308, transparent)',
            borderRadius: '0 2px 2px 50%',
            opacity: 0.7 + Math.sin(frameCount.current * 0.5) * 0.3,
          }}
        />
      </div>
    );
  };

  // --- Trail ---
  const renderTrail = () =>
    trail.current.map((t) => (
      <div
        key={t.id}
        className="absolute rounded-full"
        style={{
          left: t.x,
          top: t.y - 2,
          width: 4,
          height: 4,
          background: `rgba(236,72,153,${t.opacity})`,
          boxShadow: `0 0 6px 1px rgba(236,72,153,${t.opacity * 0.5})`,
        }}
      />
    ));

  // --- Stars ---
  const renderStars = () =>
    stars.current.map((s, i) => (
      <div
        key={i}
        className="absolute rounded-full"
        style={{
          left: s.x, top: s.y,
          width: s.size, height: s.size,
          background: '#e2e8f0',
          opacity: s.opacity,
        }}
      />
    ));

  // --- Mobile & On-screen Flight Controls ---
  const renderMobileControls = () => (
    <div className="flex gap-4 mt-3 justify-center items-center">
      <button
        className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-pink-500/50 text-pink-300 font-mono-tech text-xs active:bg-pink-900/60 select-none shadow-md flex items-center gap-1.5 transition-all active:scale-95"
        onTouchStart={() => keysDown.current.add('ArrowUp')}
        onTouchEnd={() => keysDown.current.delete('ArrowUp')}
        onMouseDown={() => keysDown.current.add('ArrowUp')}
        onMouseUp={() => keysDown.current.delete('ArrowUp')}
      >
        ▲ THRUST ASCEND (UP)
      </button>
      <button
        className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-pink-500/50 text-pink-300 font-mono-tech text-xs active:bg-pink-900/60 select-none shadow-md flex items-center gap-1.5 transition-all active:scale-95"
        onTouchStart={() => keysDown.current.add('ArrowDown')}
        onTouchEnd={() => keysDown.current.delete('ArrowDown')}
        onMouseDown={() => keysDown.current.add('ArrowDown')}
        onMouseUp={() => keysDown.current.delete('ArrowDown')}
      >
        ▼ DIVE DESCEND (DOWN)
      </button>
    </div>
  );

  // --- Screens ---
  const StartScreen = () => (
    <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-slate-950/80 backdrop-blur-sm rounded-2xl">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-heading font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-rose-400 to-amber-400">
          LOLA SKY DODGER
        </h2>
        <p className="text-slate-400 font-mono-tech text-xs max-w-xs mx-auto leading-relaxed">
          Coulson's flying car LOLA soars through the night sky.
          <br />Dodge buildings, birds, and HYDRA drones!
        </p>
        <div className="space-y-1 text-slate-500 font-mono-tech text-xs">
          <p>↑ / ↓ or W / S — Move</p>
          <p>Tap top / bottom half on mobile</p>
        </div>
        <button
          onClick={startGame}
          className="mt-4 px-8 py-3 rounded-xl bg-gradient-to-r from-pink-600 to-rose-600 text-white font-heading font-bold text-lg hover:from-pink-500 hover:to-rose-500 transition-all shadow-lg shadow-pink-900/40 active:scale-95"
        >
          FLY LOLA ✈
        </button>
        <p className="text-slate-600 font-mono-tech text-[10px]">or press SPACE / ENTER</p>
        {highScore > 0 && (
          <p className="text-amber-400 font-mono-tech text-xs mt-2">
            HIGH SCORE: {highScore}
          </p>
        )}
      </div>
    </div>
  );

  const GameOverScreen = () => (
    <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-slate-950/85 backdrop-blur-sm rounded-2xl">
      <div className="text-center space-y-4">
        <h2 className="text-2xl font-heading font-bold text-red-400">
          MISSION FAILED
        </h2>
        <div className="space-y-1">
          <p className="text-slate-300 font-mono-tech text-lg">
            Distance: <span className="text-pink-400 font-bold">{score}</span>
          </p>
          {score >= highScore && score > 0 && (
            <p className="text-amber-400 font-mono-tech text-sm animate-pulse">
              ★ NEW HIGH SCORE ★
            </p>
          )}
          <p className="text-slate-500 font-mono-tech text-xs">
            Best: {highScore}
          </p>
        </div>
        <button
          onClick={startGame}
          className="mt-4 px-8 py-3 rounded-xl bg-gradient-to-r from-pink-600 to-rose-600 text-white font-heading font-bold text-lg hover:from-pink-500 hover:to-rose-500 transition-all shadow-lg shadow-pink-900/40 active:scale-95"
        >
          TRY AGAIN
        </button>
        <p className="text-slate-600 font-mono-tech text-[10px]">or press SPACE / ENTER</p>
      </div>
    </div>
  );

  // --- Render ---
  return (
    <div className="flex flex-col items-center gap-4 p-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Activity className="w-6 h-6 text-pink-400" />
        <h1 className="text-xl font-heading font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-rose-400">
          LOLA Sky Dodger
        </h1>
        <Activity className="w-6 h-6 text-pink-400" />
      </div>

      {/* Score HUD */}
      {gameState === 'playing' && (
        <div className="flex gap-6 font-mono-tech text-xs">
          <span className="text-slate-400">
            DIST: <span className="text-pink-400 font-bold">{score}</span>
          </span>
          <span className="text-slate-500">
            SPEED: <span className="text-sky-400">{obstacleSpeed.current.toFixed(1)}</span>
          </span>
          <span className="text-slate-500">
            BEST: <span className="text-amber-400">{highScore}</span>
          </span>
        </div>
      )}

      {/* Game Area */}
      <div
        ref={gameAreaRef}
        className="relative overflow-hidden rounded-2xl border border-slate-700/60 select-none"
        style={{
          width: GAME_WIDTH,
          height: GAME_HEIGHT,
          maxWidth: '100%',
          background: 'linear-gradient(to bottom, #020617, #0c1445, #1e1b4b, #1e293b)',
          touchAction: 'none',
        }}
        onTouchStart={handleTouch}
        onTouchMove={handleTouch}
        onTouchEnd={handleTouchEnd}
      >
        {/* Stars layer */}
        {renderStars()}

        {/* City skyline silhouette (static background) */}
        <div className="absolute bottom-0 left-0 right-0 h-12 opacity-20"
          style={{
            background: 'linear-gradient(to top, #0f172a, transparent)',
          }}
        />

        {gameState === 'playing' && (
          <>
            {/* Trail particles */}
            {renderTrail()}

            {/* Obstacles */}
            {obstacles.current.map(renderObstacle)}

            {/* LOLA */}
            {renderLola()}
          </>
        )}

        {/* Overlays */}
        {gameState === 'start' && <StartScreen />}
        {gameState === 'gameover' && (
          <>
            {/* Show frozen game state behind overlay */}
            {renderTrail()}
            {obstacles.current.map(renderObstacle)}
            {renderLola()}
            <GameOverScreen />
          </>
        )}

        {/* Scanline effect */}
        <div
          className="absolute inset-0 pointer-events-none z-40"
          style={{
            backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.04) 2px, rgba(0,0,0,0.04) 4px)',
          }}
        />
      </div>

      {/* Mobile controls */}
      {gameState === 'playing' && renderMobileControls()}

      {/* Legend */}
      <div className="flex gap-4 font-mono-tech text-[10px] text-slate-600">
        <span className="flex items-center gap-1">
          <span className="inline-block w-3 h-3 rounded-sm" style={{ background: '#1e293b' }} /> Building
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block w-3 h-3 rounded-full" style={{ background: '#64748b' }} /> Bird
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block w-3 h-3 rotate-45" style={{ background: '#991b1b' }} /> HYDRA Drone
        </span>
      </div>
    </div>
  );
};
