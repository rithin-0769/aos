import React, { useState } from 'react';
import { sound } from '../../utils/audio';
import { Wrench, Shield, Zap, Sparkles, Volume2 } from 'lucide-react';

export const ShotgunAxeSimulator: React.FC = () => {
  const [bladeAttached, setBladeAttached] = useState<boolean>(true);
  const [ammoType, setAmmoType] = useState<'standard' | 'dendro' | 'dragon'>('standard');
  const [actionEffect, setActionEffect] = useState<'idle' | 'fire' | 'slash'>('idle');
  const [targetsDestroyed, setTargetsDestroyed] = useState<number>(0);

  const handleFire = () => {
    setActionEffect('fire');
    sound.playShotgunAxe();
    setTargetsDestroyed(prev => prev + 1);
    setTimeout(() => setActionEffect('idle'), 400);
  };

  const handleSlash = () => {
    setActionEffect('slash');
    sound.playBeep(1400, 0.08, 'sawtooth');
    sound.playShotgunAxe();
    setTargetsDestroyed(prev => prev + 1);
    setTimeout(() => setActionEffect('idle'), 400);
  };

  const toggleBlade = () => {
    setBladeAttached(prev => {
      const next = !prev;
      sound.playBeep(next ? 750 : 350, 0.08);
      return next;
    });
  };

  return (
    <div className="p-4 rounded-xl border border-sky-900/60 bg-slate-950/80">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-4 border-b border-sky-800/40">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/40">
            <Wrench className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-heading font-bold text-lg text-amber-300 tracking-wide uppercase">
              Alphonso Mack // Custom Shotgun-Axe Forge
            </h3>
            <p className="text-xs text-slate-400 font-mono-tech">
              DESIGNER: ALPHONSO MACKENZIE // ZEPHYR ARMORY
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono-tech bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800">
          <span className="text-slate-400">ENEMIES DISPATCHED:</span>
          <span className="text-amber-400 font-bold">{targetsDestroyed}</span>
        </div>
      </div>

      {/* Interactive Weapon Stage */}
      <div className="relative min-h-[220px] rounded-xl overflow-hidden border border-slate-800 bg-slate-950 flex flex-col items-center justify-center p-6 mb-4">
        {/* Visualizer Background */}
        <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-40" />

        {/* Action Flash */}
        {actionEffect === 'fire' && (
          <div className="absolute inset-0 bg-amber-500/20 backdrop-blur-[1px] animate-ping pointer-events-none" />
        )}
        {actionEffect === 'slash' && (
          <div className="absolute inset-0 bg-red-500/20 backdrop-blur-[1px] animate-pulse pointer-events-none" />
        )}

        {/* Shotgun-Axe Vector Illustration */}
        <div className={`relative transition-transform duration-300 ${actionEffect === 'fire' ? '-translate-x-2' : actionEffect === 'slash' ? 'rotate-6' : ''}`}>
          <svg viewBox="0 0 460 140" className="w-80 sm:w-96 h-auto drop-shadow-[0_0_12px_rgba(245,158,11,0.3)]">
            {/* Wooden/Composite Stock */}
            <path d="M 20 60 L 90 50 L 100 80 L 30 90 Z" fill="#451a03" stroke="#78350f" strokeWidth="2" />
            {/* Grip & Trigger Guard */}
            <path d="M 100 70 Q 115 95 130 90 L 125 70 Z" fill="#1e293b" stroke="#334155" strokeWidth="1.5" />
            <circle cx="118" cy="78" r="4" fill="#64748b" />

            {/* Receiver Chassis */}
            <rect x="100" y="45" width="110" height="30" rx="3" fill="#334155" stroke="#475569" strokeWidth="2" />
            {/* Ejection Port */}
            <rect x="130" y="50" width="35" height="12" fill="#0f172a" />

            {/* Pump Fore-end */}
            <rect x="220" y="55" width="60" height="20" rx="4" fill="#1e293b" stroke="#475569" strokeWidth="1.5" />

            {/* Twin Barrel & Magazine Tube */}
            <rect x="210" y="45" width="160" height="12" fill="#64748b" stroke="#94a3b8" strokeWidth="1" />
            <rect x="210" y="60" width="140" height="10" fill="#475569" stroke="#64748b" strokeWidth="1" />

            {/* Mack's Custom Axe Blade Bayonet Attachment */}
            {bladeAttached && (
              <g className="transition-all duration-300">
                {/* Mount Collar */}
                <rect x="340" y="40" width="15" height="35" fill="#1e293b" stroke="#f59e0b" strokeWidth="1.5" />
                {/* Heavy Curved Cleaver Blade */}
                <path
                  d="M 355 70 Q 370 125 420 115 Q 400 65 375 40 L 355 45 Z"
                  fill="url(#axeSteel)"
                  stroke="#fbbf24"
                  strokeWidth="2"
                />
                <defs>
                  <linearGradient id="axeSteel" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#cbd5e1" />
                    <stop offset="60%" stopColor="#94a3b8" />
                    <stop offset="100%" stopColor="#475569" />
                  </linearGradient>
                </defs>
                <text x="360" y="85" fill="#f59e0b" fontSize="8" fontFamily="monospace" transform="rotate(45 360 85)">
                  MACK-SPEC
                </text>
              </g>
            )}
          </svg>
        </div>

        {/* Quote watermark */}
        <div className="text-[11px] font-mono-tech text-amber-400/80 mt-2">
          "I've been saying it for three years: A shotgun that's also an axe." — Alphonso Mackenzie
        </div>
      </div>

      {/* Control Panel */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
        <button
          onClick={handleFire}
          className="py-3 px-4 bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold rounded-lg font-mono-tech text-xs tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-amber-600/30 transition-all"
        >
          <Zap className="w-4 h-4" />
          <span>FIRE 12-GAUGE BUCKSHOT</span>
        </button>

        <button
          onClick={handleSlash}
          disabled={!bladeAttached}
          className={`py-3 px-4 rounded-lg font-mono-tech text-xs tracking-wider font-bold flex items-center justify-center gap-2 transition-all ${
            bladeAttached
              ? 'bg-red-700 hover:bg-red-600 text-white shadow-lg shadow-red-700/30'
              : 'bg-slate-900 text-slate-600 border border-slate-800 cursor-not-allowed'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>AXE CLEAVE ATTACK</span>
        </button>

        <button
          onClick={toggleBlade}
          className={`py-3 px-4 rounded-lg font-mono-tech text-xs tracking-wider border transition-all ${
            bladeAttached
              ? 'bg-slate-900 border-amber-500/60 text-amber-300'
              : 'bg-slate-900 border-slate-700 text-slate-400'
          }`}
        >
          {bladeAttached ? 'DETACH AXE BLADE' : 'MOUNT VIBRANIUM AXE'}
        </button>
      </div>

      {/* Ammo Selector */}
      <div className="p-3 bg-slate-900/60 rounded-lg border border-slate-800">
        <div className="text-xs font-mono-tech text-slate-400 mb-2">CUSTOM AMMUNITION TYPE:</div>
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => { setAmmoType('standard'); sound.playBeep(440, 0.05); }}
            className={`py-1.5 px-2 rounded text-xs font-mono-tech border ${
              ammoType === 'standard' ? 'bg-amber-950 border-amber-400 text-amber-200' : 'bg-slate-950 border-slate-800 text-slate-400'
            }`}
          >
            00 Heavy Buckshot
          </button>
          <button
            onClick={() => { setAmmoType('dendro'); sound.playBeep(540, 0.05); }}
            className={`py-1.5 px-2 rounded text-xs font-mono-tech border ${
              ammoType === 'dendro' ? 'bg-emerald-950 border-emerald-400 text-emerald-200' : 'bg-slate-950 border-slate-800 text-slate-400'
            }`}
          >
            Dendrotoxin Slugs
          </button>
          <button
            onClick={() => { setAmmoType('dragon'); sound.playBeep(640, 0.05); }}
            className={`py-1.5 px-2 rounded text-xs font-mono-tech border ${
              ammoType === 'dragon' ? 'bg-red-950 border-red-400 text-red-200' : 'bg-slate-950 border-slate-800 text-slate-400'
            }`}
          >
            Dragon's Breath Incendiary
          </button>
        </div>
      </div>
    </div>
  );
};
