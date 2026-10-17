import React, { useState } from 'react';
import { sound } from '../../utils/audio';
import { Shield, Zap, Eye, Cpu, Radio, Sparkles, AlertCircle } from 'lucide-react';

export const CoulsonSimulator: React.FC = () => {
  const [shieldActive, setShieldActive] = useState<boolean>(false);
  const [activeModule, setActiveModule] = useState<'hand' | 'laser' | 'grip' | 'holo'>('hand');
  const [xrayMode, setXrayMode] = useState<boolean>(false);
  const [gripPressure, setGripPressure] = useState<number>(350); // PSI
  const [laserFiring, setLaserFiring] = useState<boolean>(false);
  const [projectorHolo, setProjectorHolo] = useState<'shield' | 'lola' | 'fury'>('shield');

  const toggleShield = () => {
    const next = !shieldActive;
    setShieldActive(next);
    sound.playEnergyShield(next);
  };

  const fireLaser = () => {
    setLaserFiring(true);
    sound.playLaser();
    setTimeout(() => setLaserFiring(false), 500);
  };

  const pulseEmp = () => {
    sound.playGlitch();
    sound.playBeep(120, 0.2, 'square');
  };

  return (
    <div className="p-4 rounded-xl border border-sky-900/60 bg-slate-950/80">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-4 border-b border-sky-800/40">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-sky-500/20 text-sky-400 border border-sky-500/40">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-heading font-bold text-lg text-sky-300 tracking-wide uppercase">
              Phil Coulson // Cybernetic Hand & Energy Shield
            </h3>
            <p className="text-xs text-slate-400 font-mono-tech">
              FITZ-SIMMONS LAB SPEC: MK-IV HARD-LIGHT PROSTHETIC
            </p>
          </div>
        </div>

        {/* Shield Quick Toggle */}
        <button
          onClick={toggleShield}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-mono-tech text-xs tracking-wider transition-all duration-300 ${
            shieldActive
              ? 'bg-sky-500 text-slate-950 font-bold shadow-lg shadow-sky-500/50 border border-sky-300 animate-pulse'
              : 'bg-slate-900 text-slate-300 hover:border-sky-500 border border-slate-700'
          }`}
        >
          <Shield className="w-4 h-4" />
          <span>{shieldActive ? 'SHIELD ONLINE' : 'DEPLOY ENERGY SHIELD'}</span>
        </button>
      </div>

      {/* Main Interactive Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Visualizer Frame */}
        <div className="lg:col-span-7 relative min-h-[320px] rounded-xl overflow-hidden border border-slate-800 bg-slate-950 flex items-center justify-center p-6">
          {/* Grid Background */}
          <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-40" />

          {/* Holographic Shield Projection Layer */}
          {shieldActive && (
            <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
              <div className="relative w-64 h-64 sm:w-72 sm:h-72 rounded-full border-4 border-sky-400/80 bg-sky-500/10 backdrop-blur-[2px] shadow-[0_0_50px_rgba(56,189,248,0.5)] flex items-center justify-center animate-pulse">
                {/* Shield Geometric Rings */}
                <div className="absolute inset-4 rounded-full border border-sky-300/40 border-dashed animate-spin [animation-duration:20s]" />
                <div className="absolute inset-10 rounded-full border-2 border-sky-400/60" />
                <div className="absolute inset-16 rounded-full border border-cyan-200/50" />
                {/* S.H.I.E.L.D. Falcon Insignia Center */}
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-1 flex items-center justify-center">
                    <svg viewBox="0 0 100 100" className="w-full h-full text-sky-300 filter drop-shadow-[0_0_8px_rgba(56,189,248,0.8)]" fill="currentColor">
                      <circle cx="50" cy="50" r="46" fill="none" stroke="currentColor" strokeWidth="4" />
                      <polygon points="50,15 85,80 50,65 15,80" />
                    </svg>
                  </div>
                  <div className="text-[10px] font-mono-tech text-sky-200 tracking-widest font-bold">
                    HARD-LIGHT BARRIER
                  </div>
                  <div className="text-[9px] font-mono-tech text-sky-400">
                    DISPERSION: 100% // BALLISTIC DEFLECT
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Hand Schematic Rendering (Stylized SVG Blueprint) */}
          <div className={`relative transition-all duration-500 z-10 ${xrayMode ? 'scale-105 filter drop-shadow-[0_0_15px_rgba(56,189,248,0.4)]' : ''}`}>
            <svg viewBox="0 0 280 340" className="w-64 h-72">
              {/* Hand Base Outline */}
              <defs>
                <linearGradient id="cyberMetal" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#1e293b" />
                  <stop offset="50%" stopColor="#334155" />
                  <stop offset="100%" stopColor="#0f172a" />
                </linearGradient>
                <linearGradient id="cyberGlow" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#38bdf8" />
                  <stop offset="100%" stopColor="#0284c7" />
                </linearGradient>
              </defs>

              {/* Wrist / Forearm Connector */}
              <rect x="80" y="240" width="120" height="80" rx="10" fill={xrayMode ? 'none' : 'url(#cyberMetal)'} stroke="#38bdf8" strokeWidth={xrayMode ? 1.5 : 2} />
              
              {/* Wrist Micro-servos */}
              <circle cx="100" cy="270" r="6" fill="#0ea5e9" className="animate-pulse" />
              <circle cx="180" cy="270" r="6" fill="#0ea5e9" className="animate-pulse" />
              <line x1="100" y1="270" x2="180" y2="270" stroke="#38bdf8" strokeDasharray="3,3" />

              {/* Palm Chassis */}
              <path
                d="M 60 140 Q 60 110 90 100 L 190 100 Q 220 110 220 140 L 210 240 L 70 240 Z"
                fill={xrayMode ? 'rgba(14, 165, 233, 0.05)' : '#1e293b'}
                stroke="#38bdf8"
                strokeWidth={xrayMode ? 1.5 : 2}
              />

              {/* Palm Center Emitter (Energy Shield Hub) */}
              <circle
                cx="140"
                cy="170"
                r={shieldActive ? "26" : "20"}
                fill={shieldActive ? "#38bdf8" : "#0f172a"}
                stroke="#38bdf8"
                strokeWidth="3"
                className="transition-all duration-300"
              />
              <circle cx="140" cy="170" r="10" fill={shieldActive ? "#ffffff" : "#0284c7"} />

              {/* Fingers (Thumb, Index, Middle, Ring, Pinky) */}
              {/* Thumb */}
              <rect x="35" y="150" width="22" height="50" rx="8" transform="rotate(-30 46 175)" fill={xrayMode ? 'none' : '#334155'} stroke="#38bdf8" strokeWidth="1.5" />
              {/* Index Finger (with Laser Emitter Tip) */}
              <rect x="75" y="25" width="22" height="75" rx="8" fill={xrayMode ? 'none' : '#334155'} stroke={laserFiring ? "#ef4444" : "#38bdf8"} strokeWidth="1.5" />
              {/* Middle Finger */}
              <rect x="105" y="10" width="22" height="90" rx="8" fill={xrayMode ? 'none' : '#334155'} stroke="#38bdf8" strokeWidth="1.5" />
              {/* Ring Finger */}
              <rect x="135" y="20" width="22" height="80" rx="8" fill={xrayMode ? 'none' : '#334155'} stroke="#38bdf8" strokeWidth="1.5" />
              {/* Pinky Finger */}
              <rect x="165" y="45" width="20" height="60" rx="8" fill={xrayMode ? 'none' : '#334155'} stroke="#38bdf8" strokeWidth="1.5" />

              {/* Internal Circuit Lines in X-Ray mode */}
              {xrayMode && (
                <g stroke="#38bdf8" strokeWidth="1" opacity="0.8">
                  <path d="M 140 170 L 86 50" strokeDasharray="2,2" />
                  <path d="M 140 170 L 116 35" strokeDasharray="2,2" />
                  <path d="M 140 170 L 146 45" strokeDasharray="2,2" />
                  <path d="M 140 170 L 175 70" strokeDasharray="2,2" />
                  <path d="M 140 170 L 46 160" strokeDasharray="2,2" />
                  <text x="140" y="215" textAnchor="middle" fill="#38bdf8" fontSize="10" fontFamily="monospace">
                    NEURAL LINK V7
                  </text>
                </g>
              )}

              {/* Laser Beam when fired */}
              {laserFiring && (
                <g>
                  <line x1="86" y1="25" x2="86" y2="0" stroke="#ef4444" strokeWidth="4" />
                  <line x1="86" y1="25" x2="86" y2="0" stroke="#ffffff" strokeWidth="1.5" />
                  <circle cx="86" cy="2" r="6" fill="#f87171" className="animate-ping" />
                </g>
              )}
            </svg>
          </div>

          {/* X-Ray Toggle Watermark */}
          <div className="absolute bottom-3 left-3 text-[10px] font-mono-tech text-slate-400 bg-slate-900/80 px-2.5 py-1 rounded border border-slate-800">
            {xrayMode ? 'DISPLAY MODE: INTERNAL ACTUATORS' : 'DISPLAY MODE: EXTERNAL COMPOSITE'}
          </div>
        </div>

        {/* Controls & Module Inspector */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-3">
          {/* Mode Switcher Tabs */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => { setActiveModule('hand'); setXrayMode(false); sound.playBeep(440, 0.05); }}
              className={`p-2 rounded text-xs font-mono-tech border transition-all ${
                activeModule === 'hand' && !xrayMode
                  ? 'bg-sky-950 border-sky-400 text-sky-200'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              CHASSIS OVERVIEW
            </button>
            <button
              onClick={() => { setXrayMode(!xrayMode); sound.playBeep(700, 0.08); }}
              className={`p-2 rounded text-xs font-mono-tech border flex items-center justify-center gap-1.5 transition-all ${
                xrayMode
                  ? 'bg-cyan-950 border-cyan-400 text-cyan-200'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>{xrayMode ? 'X-RAY: ACTIVE' : 'TOGGLE X-RAY'}</span>
            </button>
          </div>

          {/* Module 1: Laser Finger Tool */}
          <div className="p-3 bg-slate-900/80 rounded-lg border border-slate-800">
            <div className="flex items-center justify-between text-xs font-mono-tech mb-2">
              <span className="text-slate-300 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-red-400" />
                INDEX CUTTING LASER
              </span>
              <span className="text-red-400 font-bold">12,000 LUMENS</span>
            </div>
            <p className="text-[11px] text-slate-400 mb-2">
              High-intensity thermal cutting beam concealed in the index fingertip. Capable of cutting 3-inch reinforced steel or lock mechanisms.
            </p>
            <button
              onClick={fireLaser}
              disabled={laserFiring}
              className="w-full py-1.5 bg-red-950/80 hover:bg-red-900 border border-red-600/60 rounded text-xs font-mono-tech text-red-200 flex items-center justify-center gap-1.5 transition-colors"
            >
              <Zap className="w-3.5 h-3.5 text-red-400" />
              <span>{laserFiring ? 'EMITTING THERMAL BEAM...' : 'TEST FIRE LASER BEAM'}</span>
            </button>
          </div>

          {/* Module 2: Hydraulic Crushing Grip */}
          <div className="p-3 bg-slate-900/80 rounded-lg border border-slate-800">
            <div className="flex items-center justify-between text-xs font-mono-tech mb-1.5">
              <span className="text-slate-300">HYDRAULIC CRUSH FORCE</span>
              <span className="text-sky-400 font-bold">{gripPressure} PSI</span>
            </div>
            <input
              type="range"
              min="100"
              max="1500"
              step="50"
              value={gripPressure}
              onChange={(e) => {
                setGripPressure(Number(e.target.value));
                sound.playBeep(200 + Number(e.target.value) / 3, 0.03);
              }}
              className="w-full accent-sky-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer mb-2"
            />
            <div className="text-[11px] text-slate-400 flex items-center justify-between font-mono-tech">
              <span>Human Hand: ~100 PSI</span>
              <span className="text-sky-300 font-bold">Crushes Hydra Titanium</span>
            </div>
          </div>

          {/* Module 3: EMP & Holo Communications */}
          <div className="p-3 bg-slate-900/80 rounded-lg border border-slate-800">
            <div className="text-xs font-mono-tech text-slate-300 mb-2 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5 text-cyan-400" />
                TACTICAL HOLO-PROJECTOR
              </span>
              <button
                onClick={pulseEmp}
                className="px-2 py-0.5 bg-yellow-950 border border-yellow-600/60 text-yellow-300 rounded text-[10px] hover:bg-yellow-900"
              >
                EMP BURST
              </button>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => { setProjectorHolo('shield'); sound.playBeep(520, 0.05); }}
                className={`flex-1 py-1 text-[11px] font-mono-tech rounded border ${
                  projectorHolo === 'shield' ? 'bg-sky-900/60 border-sky-400 text-sky-200' : 'bg-slate-950 border-slate-800 text-slate-400'
                }`}
              >
                S.H.I.E.L.D.
              </button>
              <button
                onClick={() => { setProjectorHolo('lola'); sound.playBeep(620, 0.05); }}
                className={`flex-1 py-1 text-[11px] font-mono-tech rounded border ${
                  projectorHolo === 'lola' ? 'bg-sky-900/60 border-sky-400 text-sky-200' : 'bg-slate-950 border-slate-800 text-slate-400'
                }`}
              >
                LOLA '62
              </button>
              <button
                onClick={() => { setProjectorHolo('fury'); sound.playBeep(720, 0.05); }}
                className={`flex-1 py-1 text-[11px] font-mono-tech rounded border ${
                  projectorHolo === 'fury' ? 'bg-sky-900/60 border-sky-400 text-sky-200' : 'bg-slate-950 border-slate-800 text-slate-400'
                }`}
              >
                TOOLBOX
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
