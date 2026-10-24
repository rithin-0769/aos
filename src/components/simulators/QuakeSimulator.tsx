import React, { useState, useRef, useEffect } from 'react';
import { sound } from '../../utils/audio';
import { Activity, Zap, Shield, Sparkles, Volume2, ShieldAlert } from 'lucide-react';

interface Shockwave {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  alpha: number;
  color: string;
}

export const QuakeSimulator: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [frequency, setFrequency] = useState<number>(32); // Hz
  const [amplitude, setAmplitude] = useState<number>(65); // %
  const [isCharging, setIsCharging] = useState<boolean>(false);
  const [chargePower, setChargePower] = useState<number>(0);
  const [targetType, setTargetType] = useState<'drone' | 'door' | 'gravitonium'>('drone');
  const [targetHealth, setTargetHealth] = useState<number>(100);
  const [shaking, setShaking] = useState<boolean>(false);
  const shockwavesRef = useRef<Shockwave[]>([]);
  const chargeIntervalRef = useRef<number | null>(null);
  const chargePowerRef = useRef<number>(0);

  // Canvas loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const render = () => {
      ctx.fillStyle = 'rgba(7, 11, 25, 0.25)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw grid
      ctx.strokeStyle = 'rgba(14, 165, 233, 0.08)';
      ctx.lineWidth = 1;
      const step = 25;
      for (let x = 0; x < canvas.width; x += step) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += step) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // Update and draw shockwaves
      const remaining: Shockwave[] = [];
      shockwavesRef.current.forEach((sw) => {
        sw.radius += 4 + (frequency / 15);
        sw.alpha = Math.max(0, 1 - sw.radius / sw.maxRadius);

        if (sw.alpha > 0.01) {
          ctx.beginPath();
          ctx.arc(sw.x, sw.y, sw.radius, 0, Math.PI * 2);
          ctx.strokeStyle = sw.color;
          ctx.lineWidth = 3 * sw.alpha;
          ctx.stroke();

          // Inner echo ring
          if (sw.radius > 20) {
            ctx.beginPath();
            ctx.arc(sw.x, sw.y, sw.radius * 0.7, 0, Math.PI * 2);
            ctx.strokeStyle = 'rgba(255, 255, 255, ' + (sw.alpha * 0.5) + ')';
            ctx.lineWidth = 1.5;
            ctx.stroke();
          }

          remaining.push(sw);
        }
      });
      shockwavesRef.current = remaining;

      animId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animId);
  }, [frequency]);

  const triggerShockwave = (x: number, y: number, powerMultiplier = 1) => {
    const effectivePower = (amplitude / 100) * powerMultiplier;
    
    // Play sound & screen shake
    sound.playSeismic(effectivePower);
    if ('vibrate' in navigator) {
      try {
        navigator.vibrate([30 + effectivePower * 50, 20, 20 + effectivePower * 30]);
      } catch {
        // Vibrate not supported
      }
    }

    setShaking(true);
    setTimeout(() => setShaking(false), 200 + effectivePower * 200);

    // Add visual ripples
    const canvas = canvasRef.current;
    if (canvas) {
      const rect = canvas.getBoundingClientRect();
      const canvasX = (x - rect.left) * (canvas.width / rect.width);
      const canvasY = (y - rect.top) * (canvas.height / rect.height);

      for (let i = 0; i < 3; i++) {
        setTimeout(() => {
          shockwavesRef.current.push({
            x: canvasX,
            y: canvasY,
            radius: 5 + i * 10,
            maxRadius: 180 * effectivePower,
            alpha: 1,
            color: i === 0 ? '#38bdf8' : i === 1 ? '#0284c7' : '#bae6fd'
          });
        }, i * 60);
      }
    }

    // Damage current target
    const damage = Math.round(15 * effectivePower + (frequency / 10));
    setTargetHealth((prev) => Math.max(0, prev - damage));
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    setIsCharging(true);
    chargePowerRef.current = 10;
    setChargePower(10);
    const clientX = e.clientX;
    const clientY = e.clientY;

    sound.playBeep(220, 0.1, 'sine');

    chargeIntervalRef.current = window.setInterval(() => {
      chargePowerRef.current = Math.min(100, chargePowerRef.current + 8);
      setChargePower(chargePowerRef.current);
      sound.playBeep(200 + chargePowerRef.current * 6, 0.05, 'triangle');
    }, 100);

    const onPointerUp = () => {
      if (chargeIntervalRef.current) {
        clearInterval(chargeIntervalRef.current);
        chargeIntervalRef.current = null;
      }
      setIsCharging(false);
      const finalPower = chargePowerRef.current;
      triggerShockwave(clientX, clientY, Math.max(1, finalPower / 30));
      chargePowerRef.current = 0;
      setChargePower(0);
      window.removeEventListener('pointerup', onPointerUp);
    };

    window.addEventListener('pointerup', onPointerUp, { once: true });
  };

  const resetTarget = () => {
    setTargetHealth(100);
    sound.playBeep(600, 0.1);
  };

  return (
    <div className={`p-4 rounded-xl border border-sky-900/60 bg-slate-950/80 transition-transform ${shaking ? 'translate-x-1 -translate-y-1' : ''}`}>
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-3 border-b border-sky-800/40">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-sky-500/20 text-sky-400 border border-sky-500/40 animate-pulse">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-heading font-bold text-lg text-sky-300 tracking-wide uppercase">
              Daisy Johnson // Quake Gauntlet Simulator
            </h3>
            <p className="text-xs text-slate-400 font-mono-tech">
              RESONANCE: S.H.I.E.L.D. GAUNTLET HARMONICS V4.2
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono-tech bg-sky-950/60 px-3 py-1.5 rounded-md border border-sky-800">
          <span className="text-sky-400">OUTPUT:</span>
          <span className="text-emerald-400 font-bold">{Math.round((frequency * amplitude) / 10)} kW/m²</span>
        </div>
      </div>

      {/* Target Selector & Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
        <button
          onClick={() => { setTargetType('drone'); setTargetHealth(100); }}
          className={`p-2.5 rounded-lg border text-left transition-all ${
            targetType === 'drone'
              ? 'bg-sky-900/40 border-sky-400 text-sky-200'
              : 'bg-slate-900/40 border-slate-800 text-slate-400 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between text-xs font-mono-tech mb-1">
            <span>TARGET 01</span>
            <ShieldAlert className="w-3.5 h-3.5" />
          </div>
          <div className="font-semibold text-sm">Hydra Recon Drone</div>
          <div className="text-[11px] text-slate-400">Armor: Light Titanium</div>
        </button>

        <button
          onClick={() => { setTargetType('door'); setTargetHealth(100); }}
          className={`p-2.5 rounded-lg border text-left transition-all ${
            targetType === 'door'
              ? 'bg-sky-900/40 border-sky-400 text-sky-200'
              : 'bg-slate-900/40 border-slate-800 text-slate-400 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between text-xs font-mono-tech mb-1">
            <span>TARGET 02</span>
            <Shield className="w-3.5 h-3.5" />
          </div>
          <div className="font-semibold text-sm">Reinforced Blast Door</div>
          <div className="text-[11px] text-slate-400">Armor: Carbon Concrete</div>
        </button>

        <button
          onClick={() => { setTargetType('gravitonium'); setTargetHealth(100); }}
          className={`p-2.5 rounded-lg border text-left transition-all ${
            targetType === 'gravitonium'
              ? 'bg-sky-900/40 border-sky-400 text-sky-200'
              : 'bg-slate-900/40 border-slate-800 text-slate-400 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between text-xs font-mono-tech mb-1">
            <span>TARGET 03</span>
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <div className="font-semibold text-sm">Gravitonium Casing</div>
          <div className="text-[11px] text-slate-400">Armor: Gravitational Field</div>
        </button>
      </div>

      {/* Target Health Bar */}
      <div className="mb-3 bg-slate-900/90 p-3 rounded-lg border border-slate-800">
        <div className="flex justify-between items-center text-xs font-mono-tech mb-1.5">
          <span className="text-slate-300">STRUCTURAL INTEGRITY:</span>
          <span className={targetHealth === 0 ? 'text-red-400 font-bold animate-pulse' : 'text-sky-300'}>
            {targetHealth === 0 ? 'STATUS: SHATTERED // DESTROYED' : `${targetHealth}% INTEGRITY`}
          </span>
        </div>
        <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden border border-slate-800">
          <div
            className={`h-full transition-all duration-300 ${
              targetHealth > 50
                ? 'bg-gradient-to-r from-sky-500 to-cyan-400'
                : targetHealth > 20
                ? 'bg-gradient-to-r from-amber-500 to-yellow-400'
                : 'bg-gradient-to-r from-red-600 to-red-400'
            }`}
            style={{ width: `${targetHealth}%` }}
          />
        </div>
        {targetHealth === 0 && (
          <div className="mt-2 text-center">
            <button
              onClick={resetTarget}
              className="px-3 py-1 bg-sky-600 hover:bg-sky-500 text-xs font-mono-tech rounded text-white tracking-wider"
            >
              DEPLOY NEW TARGET
            </button>
          </div>
        )}
      </div>

      {/* Interactive Seismic Wave Pad */}
      <div className="relative rounded-xl overflow-hidden border border-sky-500/40 bg-slate-950 shadow-inner">
        <canvas
          ref={canvasRef}
          width={640}
          height={280}
          onPointerDown={handlePointerDown}
          className="w-full h-56 sm:h-64 cursor-crosshair touch-none block"
        />

        {/* Overlay instructions */}
        <div className="absolute top-3 left-3 pointer-events-none text-xs font-mono-tech text-sky-300/80 bg-slate-950/70 px-2.5 py-1 rounded border border-sky-900/50 backdrop-blur-sm">
          <span>TAP OR HOLD TO CHANNEL SEISMIC BLAST</span>
        </div>

        {/* Charging Gauge */}
        {isCharging && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none bg-sky-950/20 backdrop-blur-[1px]">
            <div className="bg-slate-950/90 border border-sky-400 p-4 rounded-xl text-center shadow-2xl">
              <div className="text-xs font-mono-tech text-sky-400 mb-1">ACCUMULATING RESONANCE</div>
              <div className="text-3xl font-heading font-bold text-white mb-2">{chargePower}%</div>
              <div className="w-40 bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-cyan-400 h-full transition-all duration-75"
                  style={{ width: `${chargePower}%` }}
                />
              </div>
            </div>
          </div>
        )}

        <div className="absolute bottom-3 right-3 pointer-events-none flex items-center gap-1.5 text-[11px] font-mono-tech text-slate-400 bg-slate-950/80 px-2.5 py-1 rounded border border-slate-800">
          <Volume2 className="w-3.5 h-3.5 text-sky-400" />
          <span>HAPTIC & ACOUSTIC SYNC ACTIVE</span>
        </div>
      </div>

      {/* Frequency & Amplitude Sliders */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 pt-3 border-t border-slate-800/80">
        <div>
          <div className="flex justify-between items-center text-xs font-mono-tech mb-1">
            <span className="text-slate-400">HARMONIC FREQUENCY</span>
            <span className="text-sky-400 font-bold">{frequency} Hz</span>
          </div>
          <input
            type="range"
            min="10"
            max="120"
            value={frequency}
            onChange={(e) => {
              setFrequency(Number(e.target.value));
              sound.playBeep(100 + Number(e.target.value) * 3, 0.05);
            }}
            className="w-full accent-sky-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
          />
          <div className="flex justify-between text-[10px] text-slate-500 font-mono-tech mt-1">
            <span>10 Hz (Sub-bass)</span>
            <span>60 Hz (Resonant)</span>
            <span>120 Hz (Shatter)</span>
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center text-xs font-mono-tech mb-1">
            <span className="text-slate-400">SEISMIC AMPLITUDE</span>
            <span className="text-sky-400 font-bold">{amplitude}%</span>
          </div>
          <input
            type="range"
            min="20"
            max="100"
            value={amplitude}
            onChange={(e) => {
              setAmplitude(Number(e.target.value));
              sound.playBeep(250 + Number(e.target.value) * 2, 0.05);
            }}
            className="w-full accent-sky-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
          />
          <div className="flex justify-between text-[10px] text-slate-500 font-mono-tech mt-1">
            <span>Gentle Pulse</span>
            <span>Standard Shock</span>
            <span>Quake Overload</span>
          </div>
        </div>
      </div>

      {/* Quick Action Buttons */}
      <div className="flex flex-wrap gap-2 mt-4 pt-3 border-t border-slate-800">
        <button
          onClick={() => triggerShockwave(320, 140, 0.8)}
          className="flex-1 min-w-[140px] py-2 px-3 bg-sky-950 hover:bg-sky-900 border border-sky-700/60 rounded-lg text-xs font-mono-tech text-sky-200 flex items-center justify-center gap-1.5 transition-colors"
        >
          <Zap className="w-3.5 h-3.5 text-sky-400" />
          <span>FOCUSED DISARM PULSE</span>
        </button>
        <button
          onClick={() => triggerShockwave(320, 140, 1.8)}
          className="flex-1 min-w-[140px] py-2 px-3 bg-cyan-900/60 hover:bg-cyan-800/80 border border-cyan-500/80 rounded-lg text-xs font-mono-tech text-cyan-100 flex items-center justify-center gap-1.5 transition-colors shadow-lg shadow-cyan-950/50"
        >
          <Activity className="w-3.5 h-3.5 text-cyan-300" />
          <span>MAX HARMONIC SHATTER</span>
        </button>
      </div>
    </div>
  );
};
