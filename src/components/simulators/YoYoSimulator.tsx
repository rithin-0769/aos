import React, { useState, useEffect } from 'react';
import { sound } from '../../utils/audio';
import { Zap, Heart, Activity, Award, Shield, Timer } from 'lucide-react';

export const YoYoSimulator: React.FC = () => {
  const [heartbeatActive, setHeartbeatActive] = useState<boolean>(false);
  const [disarmedTargets, setDisarmedTargets] = useState<number>(0);
  const [speedMs, setSpeedMs] = useState<number>(0);
  const [highScore, setHighScore] = useState<number>(0);

  const handleSlingshotDash = () => {
    if (heartbeatActive) return;

    setHeartbeatActive(true);
    sound.playSlingshotSpeed();

    const startTime = Date.now();
    const duration = 1200; // 1.2 second heartbeat pulse

    const interval = setInterval(() => {
      setSpeedMs(Date.now() - startTime);
    }, 20);

    setTimeout(() => {
      clearInterval(interval);
      setHeartbeatActive(false);
      setDisarmedTargets(prev => {
        const next = prev + Math.floor(Math.random() * 3 + 2);
        setHighScore(h => Math.max(h, next));
        return next;
      });
      sound.playBeep(920, 0.05);
    }, duration);
  };

  const handleReset = () => {
    setDisarmedTargets(0);
    setSpeedMs(0);
  };

  return (
    <div className="p-6 rounded-2xl bg-slate-950 border border-amber-500/50 space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-amber-400" />
          <h3 className="font-heading font-bold text-white text-base">
            SLINGSHOT KINETICS // HEARTBEAT VELOCITY PULSE
          </h3>
        </div>
        <span className="text-xs font-mono-tech text-amber-300">
          MAX DISARM SCORE: <strong className="text-white">{highScore} WEAPONS</strong>
        </span>
      </div>

      <p className="text-xs text-slate-300 leading-relaxed font-mono-tech">
        Elena Rodriguez can sprint at hyper-velocity within the span of a single human cardiac cycle (approx. 1.2 seconds) before kinetic momentum snaps her back to origin.
      </p>

      {/* Heartbeat Monitor Graphic */}
      <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col items-center justify-center space-y-3 relative overflow-hidden">
        {heartbeatActive && (
          <div className="absolute inset-0 bg-amber-500/10 animate-pulse pointer-events-none" />
        )}

        <div className="flex items-center gap-3">
          <Heart className={`w-8 h-8 text-rose-500 ${heartbeatActive ? 'animate-ping' : ''}`} />
          <span className="text-3xl font-heading font-black text-white">
            {heartbeatActive ? '160 BPM' : '72 BPM'}
          </span>
        </div>

        <div className="text-xs font-mono-tech text-slate-400">
          {heartbeatActive ? `KINETIC ACCELERATION ACTIVE: ${speedMs}ms` : 'CARDIOVASCULAR BASELINE STEADY'}
        </div>

        {/* Velocity Gauge */}
        <div className="w-full max-w-md bg-slate-950 h-2.5 rounded-full overflow-hidden p-0.5 border border-slate-800">
          <div
            className="h-full bg-gradient-to-r from-amber-400 to-rose-500 rounded-full transition-all duration-75"
            style={{ width: heartbeatActive ? `${Math.min(100, (speedMs / 1200) * 100)}%` : '0%' }}
          />
        </div>
      </div>

      {/* Disarm Counter Stats */}
      <div className="grid grid-cols-2 gap-3 text-center text-xs font-mono-tech">
        <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
          <div className="text-slate-400 text-[10px]">HOSTILE FIREARMS SEIZED</div>
          <div className="text-xl font-heading font-bold text-amber-400">{disarmedTargets}</div>
        </div>
        <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
          <div className="text-slate-400 text-[10px]">SNAPBACK STATUS</div>
          <div className={`text-sm font-bold ${heartbeatActive ? 'text-rose-400 animate-pulse' : 'text-emerald-400'}`}>
            {heartbeatActive ? 'RUNNING IN PULSE' : 'ANCHORED AT ORIGIN'}
          </div>
        </div>
      </div>

      {/* Trigger Buttons */}
      <div className="flex gap-3">
        <button
          disabled={heartbeatActive}
          onClick={handleSlingshotDash}
          className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-rose-600 hover:from-amber-400 hover:to-rose-500 disabled:opacity-50 text-slate-950 font-heading font-black text-xs tracking-wider shadow-lg shadow-amber-500/30 transition-transform active:scale-95"
        >
          {heartbeatActive ? 'SLINGSHOT PULSE RUNNING...' : '⚡ TRIGGER HEARTBEAT SLINGSHOT DASH'}
        </button>

        {disarmedTargets > 0 && (
          <button
            onClick={handleReset}
            className="px-4 py-3 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-xl text-xs font-mono-tech text-slate-400"
          >
            RESET
          </button>
        )}
      </div>
    </div>
  );
};
