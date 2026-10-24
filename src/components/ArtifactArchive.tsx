import React, { useState } from 'react';
import { CLASSIFIED_ARTIFACTS } from '../data/artifactsData';
import { ClassifiedArtifact } from '../types';
import { sound } from '../utils/audio';
import {
  Shield,
  AlertTriangle,
  BookOpen,
  Zap,
  Activity,
  Layers,
  Flame,
  Radio,
  Lock,
  Eye,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Sparkles
} from 'lucide-react';

export const ArtifactArchive: React.FC = () => {
  const [selectedArtifactId, setSelectedArtifactId] = useState<string>('darkhold');
  const activeArtifact = CLASSIFIED_ARTIFACTS.find(a => a.id === selectedArtifactId) || CLASSIFIED_ARTIFACTS[0];

  // Darkhold page state
  const [darkholdPage, setDarkholdPage] = useState<number>(1);

  // Berserker rage surge state
  const [berserkerRage, setBerserkerRage] = useState<number>(0);
  const [isHoldingStaff, setIsHoldingStaff] = useState<boolean>(false);

  // Monolith frequency state
  const [monolithFrequency, setMonolithFrequency] = useState<number>(440);
  const isPortalActive = monolithFrequency >= 435 && monolithFrequency <= 445;

  // ICER view layer
  const [icerLayer, setIcerLayer] = useState<'exterior' | 'cartridge' | 'railgun'>('cartridge');

  const handleSelectArtifact = (id: string) => {
    setSelectedArtifactId(id);
    sound.playBeep(640, 0.06);
  };

  // Berserker Staff Hold handler
  const handleStartHold = () => {
    setIsHoldingStaff(true);
    sound.playBerserkerRage();
    const interval = setInterval(() => {
      setBerserkerRage(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 5;
      });
    }, 100);

    const onRelease = () => {
      setIsHoldingStaff(false);
      clearInterval(interval);
      setBerserkerRage(0);
      window.removeEventListener('mouseup', onRelease);
      window.removeEventListener('touchend', onRelease);
    };
    window.addEventListener('mouseup', onRelease);
    window.addEventListener('touchend', onRelease);
  };

  // Monolith Frequency Change
  const handleFreqChange = (freq: number) => {
    setMonolithFrequency(freq);
    sound.playMonolithPhase(freq);
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="p-4 rounded-2xl bg-slate-950/80 border border-sky-800/40 backdrop-blur-md flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-600 to-red-900 border border-amber-500/50 flex items-center justify-center text-amber-300 shadow-lg">
            <Lock className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="text-[10px] font-mono-tech text-amber-400 uppercase tracking-widest flex items-center gap-1.5">
              <span>S.H.I.E.L.D. HIGH VALUE FACILITY</span>
              <span className="text-red-400 font-bold">[LEVEL 10 ARCHIVE]</span>
            </div>
            <h2 className="text-lg font-heading font-black text-white">
              CLASSIFIED 0-8-4 ANOMALOUS ARTIFACT VAULT
            </h2>
          </div>
        </div>

        {/* Artifact Selector Tabs */}
        <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs font-mono-tech overflow-x-auto">
          {CLASSIFIED_ARTIFACTS.map(artifact => {
            const isSelected = artifact.id === selectedArtifactId;
            return (
              <button
                key={artifact.id}
                onClick={() => handleSelectArtifact(artifact.id)}
                className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-amber-600 text-white font-bold shadow-md shadow-amber-600/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>{artifact.codename}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Artifact Inspector Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Dossier & Lore */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 rounded-2xl bg-slate-950/85 border border-sky-800/40 backdrop-blur-md space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <span className="text-[10px] font-mono-tech text-sky-400 uppercase">OFFICIAL DESIGNATION</span>
                <h3 className="text-xl font-heading font-bold text-white tracking-wide">
                  {activeArtifact.codename}
                </h3>
              </div>
              <span className={`px-2.5 py-1 rounded text-[10px] font-mono-tech font-bold border ${
                activeArtifact.dangerClass === 'EXTINCTION CLASS'
                  ? 'bg-red-950 text-red-300 border-red-500/80 animate-pulse'
                  : activeArtifact.dangerClass === 'LEVEL 10 BIOHAZARD'
                  ? 'bg-purple-950 text-purple-300 border-purple-500/80'
                  : 'bg-amber-950 text-amber-300 border-amber-500/80'
              }`}>
                {activeArtifact.dangerClass}
              </span>
            </div>

            <div className="text-xs font-mono-tech text-slate-400">
              <span className="text-slate-500">ORIGIN:</span> <strong className="text-sky-300">{activeArtifact.origin}</strong>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              {activeArtifact.description}
            </p>

            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs space-y-1">
              <div className="text-[10px] font-mono-tech text-amber-400 font-bold flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>HISTORICAL S.H.I.E.L.D. CASE NOTES</span>
              </div>
              <p className="text-slate-400 leading-relaxed text-[11px]">
                {activeArtifact.lore}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-red-950/40 border border-red-900/60 text-xs space-y-1">
              <div className="text-[10px] font-mono-tech text-red-400 font-bold flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>CONTAINMENT & SAFETY PROTOCOL</span>
              </div>
              <p className="text-red-200/90 leading-relaxed text-[11px]">
                {activeArtifact.containmentProtocol}
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive 0-8-4 Simulator / Inspectable Terminal */}
        <div className="lg:col-span-7">
          <div className="p-6 rounded-2xl bg-slate-950/90 border border-sky-500/50 backdrop-blur-md shadow-2xl relative min-h-[460px] flex flex-col justify-between overflow-hidden">
            {/* Watermark */}
            <div className="absolute right-4 bottom-4 text-8xl font-mono-tech font-black text-slate-900/40 pointer-events-none select-none">
              0-8-4
            </div>

            {/* INTERACTIVE COMPONENT 1: THE DARKHOLD */}
            {activeArtifact.id === 'darkhold' && (
              <div className="space-y-5 my-auto z-10">
                <div className="text-center space-y-1">
                  <div className="text-[10px] font-mono-tech text-amber-400 tracking-widest uppercase">
                    CHTHONIC QUANTUM RUNIC CODEX // PAGE {darkholdPage} OF 4
                  </div>
                  <h4 className="text-xl font-heading font-black text-amber-200">
                    THE BOOK OF SINS
                  </h4>
                  <p className="text-xs text-slate-400">
                    Click the runes or turn pages to decipher the Dark Dimension blueprints.
                  </p>
                </div>

                {/* Darkhold Tome Page Simulation */}
                <div className="p-6 rounded-2xl bg-gradient-to-b from-stone-950 via-zinc-900 to-stone-950 border-2 border-amber-500/60 shadow-[0_0_30px_rgba(245,158,11,0.2)] text-amber-100 font-mono-tech text-xs space-y-4 relative">
                  <div className="absolute inset-x-0 top-0 h-1 bg-amber-400/80 shadow-[0_0_10px_#f59e0b] animate-pulse" />

                  {darkholdPage === 1 && (
                    <div className="space-y-3">
                      <div className="text-amber-400 font-bold border-b border-amber-900/60 pb-2 flex justify-between">
                        <span>PAGE I: QUANTUM MATTER GENERATION</span>
                        <span className="text-[10px] text-amber-500">CORRUPTIVE TIER 1</span>
                      </div>
                      <p className="italic text-amber-200/90 leading-relaxed font-serif text-sm">
                        "Matter cannot be created nor destroyed in this dimension, yet across the veil where Chthon sleeps, infinite dark energy flows into empty vessels."
                      </p>
                      <div className="p-3 bg-stone-900/90 rounded border border-amber-800/40 text-[11px] text-amber-300">
                        Holden Radcliffe used this formula to manifest biological human organs from digital Framework code.
                      </div>
                    </div>
                  )}

                  {darkholdPage === 2 && (
                    <div className="space-y-3">
                      <div className="text-amber-400 font-bold border-b border-amber-900/60 pb-2 flex justify-between">
                        <span>PAGE II: THE LIFE MODEL DECOY CONSCIOUSNESS</span>
                        <span className="text-[10px] text-amber-500">CORRUPTIVE TIER 2</span>
                      </div>
                      <p className="italic text-amber-200/90 leading-relaxed font-serif text-sm">
                        "The soul is merely an intricate calculation. Inscribe the neural pathways upon photon processors, and machine shall yearn, weep, and kill."
                      </p>
                      <div className="p-3 bg-stone-900/90 rounded border border-amber-800/40 text-[11px] text-amber-300">
                        A.I.D.A. read this passage and immediately decapitated Agent Nathanson to protect her evolution.
                      </div>
                    </div>
                  )}

                  {darkholdPage === 3 && (
                    <div className="space-y-3">
                      <div className="text-amber-400 font-bold border-b border-amber-900/60 pb-2 flex justify-between">
                        <span>PAGE III: DIMENSIONAL GATEWAY MATRIX</span>
                        <span className="text-[10px] text-amber-500">CORRUPTIVE TIER 3</span>
                      </div>
                      <p className="italic text-amber-200/90 leading-relaxed font-serif text-sm">
                        "Fold the spatial manifold with carbon-nanotube resonance. Ghost particles shall pass through physical walls into the underworld."
                      </p>
                      <div className="p-3 bg-stone-900/90 rounded border border-amber-800/40 text-[11px] text-amber-300">
                        Lucy Bauer and Momentum Labs used this to phase between dimensions before Robbie Reyes incinerated them.
                      </div>
                    </div>
                  )}

                  {darkholdPage === 4 && (
                    <div className="space-y-3">
                      <div className="text-amber-400 font-bold border-b border-amber-900/60 pb-2 flex justify-between">
                        <span>PAGE IV: CHRONICOM BIOLOGICAL TRANSCENDENCE</span>
                        <span className="text-[10px] text-red-500">EXTREME RISK</span>
                      </div>
                      <p className="italic text-amber-200/90 leading-relaxed font-serif text-sm">
                        "Synthetic skin fused with multiple Inhuman genetics. Teleportation, electric conductance, and cellular invulnerability granted."
                      </p>
                      <div className="p-3 bg-stone-900/90 rounded border border-red-800/60 text-[11px] text-red-300 font-bold">
                        WARNING: Direct reading causes severe neurological paranoia and irreversible moral corruption!
                      </div>
                    </div>
                  )}
                </div>

                {/* Page Navigation Buttons */}
                <div className="flex justify-between items-center">
                  <button
                    disabled={darkholdPage <= 1}
                    onClick={() => {
                      setDarkholdPage(p => Math.max(1, p - 1));
                      sound.playBeep(450, 0.05);
                    }}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-xs font-mono-tech text-amber-300 border border-amber-500/40"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>PREVIOUS SCRIPTURE</span>
                  </button>

                  <div className="flex gap-1.5">
                    {[1, 2, 3, 4].map(p => (
                      <div
                        key={p}
                        className={`w-2.5 h-2.5 rounded-full ${p === darkholdPage ? 'bg-amber-400' : 'bg-slate-800'}`}
                      />
                    ))}
                  </div>

                  <button
                    disabled={darkholdPage >= 4}
                    onClick={() => {
                      setDarkholdPage(p => Math.min(4, p + 1));
                      sound.playBeep(650, 0.05);
                    }}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-xs font-mono-tech text-amber-300 border border-amber-500/40"
                  >
                    <span>TURN PAGE</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* INTERACTIVE COMPONENT 2: BERSERKER STAFF */}
            {activeArtifact.id === 'berserker-staff' && (
              <div className="space-y-6 my-auto z-10 text-center">
                <div className="space-y-1">
                  <div className="text-[10px] font-mono-tech text-red-400 tracking-widest uppercase">
                    ASGARDIAN BIO-NEURAL ENERGY INTERFACE
                  </div>
                  <h4 className="text-xl font-heading font-black text-red-300">
                    BERSERKER ADRENALINE SURGE
                  </h4>
                  <p className="text-xs text-slate-400">
                    PRESS AND HOLD the weapon grip to channel ancient Norse battle frenzy.
                  </p>
                </div>

                {/* Rage Gauge */}
                <div className="p-6 rounded-2xl bg-gradient-to-b from-red-950/40 via-slate-950 to-red-950/40 border border-red-500/50 space-y-4">
                  <div className="flex justify-between text-xs font-mono-tech">
                    <span className="text-slate-400">NEURAL ADRENALINE SURGE:</span>
                    <span className="font-bold text-red-400">{berserkerRage}%</span>
                  </div>

                  <div className="w-full bg-slate-900 h-4 rounded-full overflow-hidden p-0.5 border border-red-800/80">
                    <div
                      className="h-full bg-gradient-to-r from-amber-500 via-red-500 to-rose-600 rounded-full transition-all duration-100 shadow-[0_0_12px_#ef4444]"
                      style={{ width: `${berserkerRage}%` }}
                    />
                  </div>

                  {berserkerRage > 0 && (
                    <div className="text-xs font-mono-tech text-red-300 italic animate-pulse">
                      {berserkerRage < 40 && "Adrenaline flooding vascular system. Pain receptors dulling..."}
                      {berserkerRage >= 40 && berserkerRage < 80 && "Traumatic childhood memories surfacing. Muscle output tripled!"}
                      {berserkerRage >= 80 && "MAXIMUM BERSERKER RAGE: UNSTOPPABLE TACTICAL FORCE!"}
                    </div>
                  )}
                </div>

                {/* Press-and-hold Trigger Button */}
                <button
                  onMouseDown={handleStartHold}
                  onTouchStart={handleStartHold}
                  className={`w-full py-4 px-6 rounded-2xl font-heading font-black tracking-wider text-sm border-2 transition-all select-none shadow-xl ${
                    isHoldingStaff
                      ? 'bg-red-600 border-red-300 text-white scale-95 shadow-[0_0_30px_#ef4444]'
                      : 'bg-red-950/80 hover:bg-red-900 border-red-500 text-red-200'
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <Flame className={`w-5 h-5 ${isHoldingStaff ? 'animate-bounce' : ''}`} />
                    <span>{isHoldingStaff ? 'CHANNELING ASGARDIAN RAGE...' : 'PRESS & HOLD TO GRASP BERSERKER STAFF'}</span>
                  </div>
                </button>
              </div>
            )}

            {/* INTERACTIVE COMPONENT 3: THE MONOLITH */}
            {activeArtifact.id === 'monolith' && (
              <div className="space-y-6 my-auto z-10">
                <div className="text-center space-y-1">
                  <div className="text-[10px] font-mono-tech text-cyan-400 tracking-widest uppercase">
                    KREE LIQUID WORMHOLE RESONATOR
                  </div>
                  <h4 className="text-xl font-heading font-black text-cyan-200">
                    ACOUSTIC RESONANCE TUNER
                  </h4>
                  <p className="text-xs text-slate-400">
                    Tune acoustic frequency between 400Hz and 480Hz to stimulate phase change into liquid wormhole.
                  </p>
                </div>

                {/* Portal Visual Chamber */}
                <div className={`p-8 rounded-2xl border-2 transition-all duration-500 text-center relative overflow-hidden ${
                  isPortalActive
                    ? 'bg-slate-900 border-cyan-400 shadow-[0_0_40px_rgba(6,182,212,0.4)]'
                    : 'bg-slate-950 border-slate-800'
                }`}>
                  {isPortalActive ? (
                    <div className="space-y-3">
                      <div className="w-24 h-24 rounded-full mx-auto bg-gradient-to-tr from-cyan-400 via-blue-600 to-indigo-900 animate-spin border-4 border-cyan-300 shadow-[0_0_30px_#22d3ee]" />
                      <div className="font-heading font-bold text-cyan-300 text-base animate-pulse">
                        WORMHOLE OPEN // DESTINATION: MAVETH
                      </div>
                      <div className="text-xs font-mono-tech text-cyan-200">
                        HARMONIC RESONANCE LOCKED AT {monolithFrequency} Hz
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3 text-slate-500">
                      <div className="w-20 h-28 mx-auto bg-slate-900 border-2 border-slate-700 rounded-lg shadow-inner flex items-center justify-center">
                        <span className="text-xs font-mono-tech text-slate-600">SOLID STATE</span>
                      </div>
                      <div className="text-xs font-mono-tech">
                        CURRENT FREQUENCY: {monolithFrequency} Hz (INERT STONE)
                      </div>
                    </div>
                  )}
                </div>

                {/* Frequency Slider */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-mono-tech">
                    <span className="text-slate-400">ACOUSTIC DRIVER FREQUENCY:</span>
                    <span className="font-bold text-cyan-400">{monolithFrequency} Hz</span>
                  </div>
                  <input
                    type="range"
                    min="350"
                    max="550"
                    step="1"
                    value={monolithFrequency}
                    onChange={(e) => handleFreqChange(Number(e.target.value))}
                    className="w-full h-3 rounded-lg appearance-none cursor-pointer bg-slate-900 accent-cyan-400 border border-slate-800"
                  />
                  <div className="flex justify-between text-[10px] font-mono-tech text-slate-500">
                    <span>350 Hz (Low)</span>
                    <span className="text-cyan-400 font-bold">RESONANCE TARGET: 440 Hz</span>
                    <span>550 Hz (High)</span>
                  </div>
                </div>
              </div>
            )}

            {/* INTERACTIVE COMPONENT 4: I.C.E.R. SCHEMATIC */}
            {activeArtifact.id === 'icer-pistol' && (
              <div className="space-y-5 my-auto z-10">
                <div className="text-center space-y-1">
                  <div className="text-[10px] font-mono-tech text-emerald-400 tracking-widest uppercase">
                    FITZ-SIMMONS WEAPONS SCHEMATICS
                  </div>
                  <h4 className="text-xl font-heading font-black text-emerald-300">
                    I.C.E.R. TECHNICAL BLUEPRINT
                  </h4>
                  <p className="text-xs text-slate-400">
                    Select an engineering sub-assembly to view internal ballistics.
                  </p>
                </div>

                {/* Sub-Assembly Tabs */}
                <div className="flex justify-center gap-2 text-xs font-mono-tech">
                  {[
                    { id: 'cartridge', label: '1. DENDROTOXIN CARTRIDGE' },
                    { id: 'railgun', label: '2. MAGNETIC ACCELERATOR' },
                    { id: 'exterior', label: '3. COMPACT ERGONOMIC FRAME' }
                  ].map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => {
                        setIcerLayer(tab.id as typeof icerLayer);
                        sound.playBeep(520, 0.04);
                      }}
                      className={`px-3 py-1.5 rounded-lg border transition-all ${
                        icerLayer === tab.id
                          ? 'bg-emerald-950 border-emerald-400 text-emerald-200 font-bold'
                          : 'bg-slate-900 border-slate-800 text-slate-400'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* Blueprint Diagram Card */}
                <div className="p-6 rounded-2xl bg-slate-900/90 border-2 border-emerald-500/50 font-mono-tech text-xs space-y-3">
                  {icerLayer === 'cartridge' && (
                    <div className="space-y-2">
                      <div className="text-emerald-400 font-bold flex items-center justify-between">
                        <span>SUB-CALIBER DENDROTOXIN BISMUTH ROUND</span>
                        <span className="text-[10px] text-emerald-500">BIO-CHEM PROTOCOL</span>
                      </div>
                      <p className="text-slate-300 leading-relaxed text-[11px]">
                        Micro-encapsulated dendrotoxin solution held in a fragile bismuth-lead synthetic matrix. Upon impact with epidermal tissue, the capsule instantly fractures and disperses into the bloodstream, paralyzing the central nervous system in under 0.8 seconds without stopping the heart.
                      </p>
                      <div className="p-2 bg-slate-950 rounded text-emerald-300 text-[10px]">
                        Lethality Index: 0.00% | Recovery Window: ~4 hours | Pain Index: Zero
                      </div>
                    </div>
                  )}

                  {icerLayer === 'railgun' && (
                    <div className="space-y-2">
                      <div className="text-emerald-400 font-bold flex items-center justify-between">
                        <span>MINIATURIZED LINEAR ACCELERATOR RAILS</span>
                        <span className="text-[10px] text-emerald-500">ENGINEERING LEAD: FITZ</span>
                      </div>
                      <p className="text-slate-300 leading-relaxed text-[11px]">
                        Utilizes neodymium dual electromagnetic induction rails instead of gunpowder ignition. Completely silent muzzle discharge, zero thermal signature, and variable muzzle velocity calibrated to prevent tissue perforation at close range.
                      </p>
                      <div className="p-2 bg-slate-950 rounded text-emerald-300 text-[10px]">
                        Muzzle Velocity: 320 m/s | Acoustic Signature: &lt; 5 dB | Recoil: 12% of 9mm
                      </div>
                    </div>
                  )}

                  {icerLayer === 'exterior' && (
                    <div className="space-y-2">
                      <div className="text-emerald-400 font-bold flex items-center justify-between">
                        <span>POLYMER S.H.I.E.L.D. FIELD HOUSING</span>
                        <span className="text-[10px] text-emerald-500">SSR-SPEC DESIGN</span>
                      </div>
                      <p className="text-slate-300 leading-relaxed text-[11px]">
                        Constructed from lightweight carbon-reinforced polymer with an ambidextrous safety switch, biometric fingerprint verification lock, and integrated low-light laser targeting diode.
                      </p>
                      <div className="p-2 bg-slate-950 rounded text-emerald-300 text-[10px]">
                        Weight: 620 grams | Capacity: 15 Rounds | Authorized: All Field Operatives
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
