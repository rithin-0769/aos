import React, { useState } from 'react';
import { sound } from '../../utils/audio';
import { Bot, Crosshair, Cpu, CheckCircle2, AlertTriangle, Sparkles, Sliders } from 'lucide-react';

interface FitzSimmonsLabProps {
  onFindEasterEgg?: (id: string) => void;
  foundEasterEggs?: string[];
}

export const FitzSimmonsLab: React.FC<FitzSimmonsLabProps> = ({ onFindEasterEgg, foundEasterEggs = [] }) => {
  const [activeStation, setActiveStation] = useState<'dwarfs' | 'icer' | 'lmd'>('dwarfs');

  // D.W.A.R.F.s state
  const [activeDwarf, setActiveDwarf] = useState<string>('Doc');
  const [droneDeployed, setDroneDeployed] = useState<boolean>(false);

  // I.C.E.R. state
  const [dendroDosage, setDendroDosage] = useState<number>(0.4); // mg
  const [icerFired, setIcerFired] = useState<boolean>(false);
  const [targetSedated, setTargetSedated] = useState<boolean>(false);

  // L.M.D. state
  const [lmdLayer, setLmdLayer] = useState<'skin' | 'skeleton' | 'brain' | 'darkhold'>('skin');
  const [scanningLmd, setScanningLmd] = useState<boolean>(false);
  const [scanResult, setScanResult] = useState<string | null>(null);

  const dwarfs = [
    { name: 'Doc', specialty: 'Central Sensor Relay & Spectral Analyzer' },
    { name: 'Happy', specialty: 'Thermal & Infrared Optical Recon' },
    { name: 'Sleepy', specialty: 'Acoustic Eavesdropping & Microphones' },
    { name: 'Dopey', specialty: 'Atmospheric Gas & Toxin Sampler' },
    { name: 'Grumpy', specialty: 'Electromagnetic & Radiation Meter' },
    { name: 'Bashful', specialty: 'Stealth Cloaking & Laser Rangefinder' },
    { name: 'Sneezy', specialty: 'Particulate Filter & Biological Collector' },
  ];

  const deployDrone = (name: string) => {
    setActiveDwarf(name);
    setDroneDeployed(true);
    sound.playLmdBoot();
    setTimeout(() => setDroneDeployed(false), 2000);
  };

  const fireIcer = () => {
    setIcerFired(true);
    sound.playBeep(950, 0.05, 'triangle');
    sound.playBeep(240, 0.12, 'sine');

    setTimeout(() => {
      setIcerFired(false);
      setTargetSedated(true);
    }, 300);
  };

  const runLmdScan = () => {
    setScanningLmd(true);
    setScanResult(null);
    sound.playGlitch();

    setTimeout(() => {
      setScanningLmd(false);
      setScanResult("ANOMALY CONFIRMED: POSITRONIC LOGIC CIRCUIT DETECTED IN HYPOTHALAMUS");
      sound.playBeep(880, 0.15);
    }, 1500);
  };

  const handleLemonClick = () => {
    if (onFindEasterEgg) {
      onFindEasterEgg('egg-fitz-lemon');
    }
  };

  const hasFoundLemon = foundEasterEggs.includes('egg-fitz-lemon');

  return (
    <div className="p-4 rounded-xl border border-sky-900/60 bg-slate-950/80">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-4 border-b border-sky-800/40">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/40">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-heading font-bold text-lg text-cyan-300 tracking-wide uppercase">
              FitzSimmons // Sci-Tech Research Laboratory
            </h3>
            <p className="text-xs text-slate-400 font-mono-tech">
              STATION: ZEPHYR-ONE & BUS LAB PROTOCOLS
            </p>
          </div>
        </div>

        {/* Secret Lemon Easter Egg hidden in Lab */}
        <button
          onClick={handleLemonClick}
          title={hasFoundLemon ? "Lemon Found: Fitz's Romantic Sign" : "Suspicious yellow fruit on the lab bench"}
          className={`p-1.5 rounded-lg border transition-all ${
            hasFoundLemon
              ? 'bg-amber-950/60 border-amber-500/80 text-amber-300'
              : 'bg-slate-900/50 border-slate-800 text-slate-600 hover:text-amber-400 hover:border-amber-500/50'
          }`}
        >
          <span className="text-sm">🍋</span>
        </button>
      </div>

      {/* Lab Station Tabs */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        <button
          onClick={() => { setActiveStation('dwarfs'); sound.playBeep(480, 0.05); }}
          className={`p-2.5 rounded-lg border text-left transition-all ${
            activeStation === 'dwarfs'
              ? 'bg-sky-950/80 border-sky-400 text-sky-200'
              : 'bg-slate-900/40 border-slate-800 text-slate-400 hover:border-slate-700'
          }`}
        >
          <div className="text-xs font-mono-tech text-sky-400 flex items-center gap-1.5 mb-1">
            <Bot className="w-3.5 h-3.5" />
            <span>DRONE SWARM</span>
          </div>
          <div className="font-bold text-sm">D.W.A.R.F.s</div>
        </button>

        <button
          onClick={() => { setActiveStation('icer'); sound.playBeep(480, 0.05); }}
          className={`p-2.5 rounded-lg border text-left transition-all ${
            activeStation === 'icer'
              ? 'bg-sky-950/80 border-sky-400 text-sky-200'
              : 'bg-slate-900/40 border-slate-800 text-slate-400 hover:border-slate-700'
          }`}
        >
          <div className="text-xs font-mono-tech text-emerald-400 flex items-center gap-1.5 mb-1">
            <Crosshair className="w-3.5 h-3.5" />
            <span>NON-LETHAL</span>
          </div>
          <div className="font-bold text-sm">I.C.E.R. System</div>
        </button>

        <button
          onClick={() => { setActiveStation('lmd'); sound.playBeep(480, 0.05); }}
          className={`p-2.5 rounded-lg border text-left transition-all ${
            activeStation === 'lmd'
              ? 'bg-sky-950/80 border-sky-400 text-sky-200'
              : 'bg-slate-900/40 border-slate-800 text-slate-400 hover:border-slate-700'
          }`}
        >
          <div className="text-xs font-mono-tech text-purple-400 flex items-center gap-1.5 mb-1">
            <Cpu className="w-3.5 h-3.5" />
            <span>SYNTHETIC</span>
          </div>
          <div className="font-bold text-sm">L.M.D. Diagnostics</div>
        </button>
      </div>

      {/* Station 1: D.W.A.R.F.s */}
      {activeStation === 'dwarfs' && (
        <div className="space-y-4">
          <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800">
            <div className="flex justify-between items-center text-xs font-mono-tech mb-2">
              <span className="text-sky-300 font-bold">D.W.A.R.F. QUADCOPTER FLEET SPECIFICATION</span>
              <span className="text-slate-400">7 UNITS OPERATIONAL</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed mb-3">
              Deployable Wireless Automated Remote Fixed-sensors. Designed by Leopold Fitz to collect atmospheric, forensic, and biometric data in hazardous environments.
            </p>

            {/* Drone Selection Chips */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
              {dwarfs.map((dw) => (
                <button
                  key={dw.name}
                  onClick={() => deployDrone(dw.name)}
                  className={`p-2 rounded-lg border text-left transition-all ${
                    activeDwarf === dw.name
                      ? 'bg-sky-900/60 border-sky-400 text-sky-100 shadow'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="font-bold text-xs">{dw.name}</div>
                  <div className="text-[10px] text-slate-400 truncate">{dw.specialty}</div>
                </button>
              ))}
            </div>

            {/* Drone Holographic Telemetry Screen */}
            <div className="p-4 bg-slate-950 rounded-xl border border-sky-500/30 relative overflow-hidden">
              <div className="flex items-center justify-between text-xs font-mono-tech text-sky-400 mb-2">
                <span>ACTIVE TELEMETRY: {activeDwarf.toUpperCase()}</span>
                <span className="animate-pulse flex items-center gap-1 text-emerald-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  ONLINE
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono-tech text-slate-300">
                <div className="bg-slate-900/80 p-2.5 rounded border border-slate-800">
                  <div className="text-[10px] text-slate-500">MISSION FOCUS</div>
                  <div className="text-sky-300">{dwarfs.find(d => d.name === activeDwarf)?.specialty}</div>
                </div>
                <div className="bg-slate-900/80 p-2.5 rounded border border-slate-800">
                  <div className="text-[10px] text-slate-500">PROPULSION</div>
                  <div className="text-sky-300">Micro-Turbine Quad-Rotor</div>
                </div>
                <div className="bg-slate-900/80 p-2.5 rounded border border-slate-800">
                  <div className="text-[10px] text-slate-500">SIGNAL RANGE</div>
                  <div className="text-sky-300">14.8 km Encrypted Mesh</div>
                </div>
              </div>

              {droneDeployed && (
                <div className="absolute inset-0 bg-sky-950/80 flex items-center justify-center backdrop-blur-sm animate-pulse">
                  <div className="text-center font-mono-tech text-sky-300 text-sm font-bold">
                    🚀 DEPLOYING {activeDwarf.toUpperCase()} TO FIELD SECTOR...
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Station 2: I.C.E.R. System */}
      {activeStation === 'icer' && (
        <div className="space-y-4">
          <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-800">
            <div className="flex justify-between items-center text-xs font-mono-tech mb-2">
              <span className="text-emerald-400 font-bold">I.C.E.R. // INCAPACITATING CARTRIDGE EMITTING RAILGUN</span>
              <span className="text-slate-400">NON-LETHAL STANDARD</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              Invented by FitzSimmons to replace traditional firearms. Fires a high-velocity micro-slug containing dendrotoxin that instantly neutralizes targets by disrupting nerve transmission without permanent tissue damage.
            </p>

            {/* Dendrotoxin Calibration */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 mb-4">
              <div className="flex justify-between items-center text-xs font-mono-tech mb-2">
                <span className="text-slate-300 flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-emerald-400" />
                  DENDROTOXIN DOSAGE:
                </span>
                <span className="text-emerald-400 font-bold">{dendroDosage.toFixed(2)} mg</span>
              </div>
              <input
                type="range"
                min="0.1"
                max="2.0"
                step="0.05"
                value={dendroDosage}
                onChange={(e) => setDendroDosage(Number(e.target.value))}
                className="w-full accent-emerald-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer mb-2"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono-tech">
                <span>0.1 mg: Light Sedative</span>
                <span>0.4 mg: Human Standard</span>
                <span>1.2 mg: Centipede / Inhuman</span>
                <span>2.0 mg: Kree Physiology</span>
              </div>
            </div>

            {/* Target Test Bed */}
            <div className="p-4 bg-slate-950 rounded-xl border border-emerald-900/40 text-center">
              <div className="text-xs font-mono-tech text-slate-400 mb-2">
                TARGET PHYSIOLOGY: {dendroDosage > 1.0 ? 'ENHANCED / INHUMAN' : 'STANDARD HUMAN FIELD HOSTILE'}
              </div>

              <div className="my-3">
                <span className={`inline-block px-4 py-1.5 rounded-full text-xs font-mono-tech font-bold ${
                  targetSedated
                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/60'
                    : 'bg-red-950 text-red-300 border border-red-500/60'
                }`}>
                  {targetSedated ? 'STATUS: INCAPACITATED // RAPID SLEEP CYCLE' : 'STATUS: ACTIVE HOSTILE // IN CROSSHAIRS'}
                </span>
              </div>

              <div className="flex justify-center gap-3">
                <button
                  onClick={fireIcer}
                  disabled={icerFired}
                  className="px-6 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-mono-tech text-xs tracking-wider font-bold rounded-lg shadow-lg shadow-emerald-900/50 flex items-center gap-2"
                >
                  <Crosshair className="w-4 h-4" />
                  <span>{icerFired ? 'FIRING DENDRO-SLUG...' : 'DISCHARGE I.C.E.R. ROUND'}</span>
                </button>
                {targetSedated && (
                  <button
                    onClick={() => setTargetSedated(false)}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono-tech text-xs rounded-lg"
                  >
                    RESET TARGET
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Station 3: L.M.D. Diagnostics */}
      {activeStation === 'lmd' && (
        <div className="space-y-4">
          <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-800">
            <div className="flex justify-between items-center text-xs font-mono-tech mb-2">
              <span className="text-purple-400 font-bold">LIFE MODEL DECOY (L.M.D.) DIAGNOSTIC TERMINAL</span>
              <span className="text-amber-400 flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" />
                RADCLIFFE / AIDA PROTOCOLS
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed mb-3">
              Synthetic biomechanical constructs designed with synthetic skin and quantum positronic brains capable of replicating human emotions, memories, and speech patterns.
            </p>

            {/* Anatomical Layer Selector */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
              {[
                { id: 'skin', label: '1. EPIDERMIS', desc: 'Synthetic Tissue Layer' },
                { id: 'skeleton', label: '2. CHASSIS', desc: 'Carbon Fiber Frame' },
                { id: 'brain', label: '3. POSITRONIC', desc: 'Quantum Neural Matrix' },
                { id: 'darkhold', label: '4. DARKHOLD', desc: 'Forbidden Corruption' },
              ].map((layer) => (
                <button
                  key={layer.id}
                  onClick={() => { setLmdLayer(layer.id as typeof lmdLayer); sound.playBeep(600, 0.05); }}
                  className={`p-2 rounded-lg border text-left transition-all ${
                    lmdLayer === layer.id
                      ? 'bg-purple-950/80 border-purple-400 text-purple-200'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="font-bold text-xs">{layer.label}</div>
                  <div className="text-[10px] text-slate-400">{layer.desc}</div>
                </button>
              ))}
            </div>

            {/* Scanner Area */}
            <div className="p-4 bg-slate-950 rounded-xl border border-purple-500/30">
              <div className="flex items-center justify-between text-xs font-mono-tech mb-3">
                <span className="text-purple-300">ACTIVE LAYER INSPECTION: {lmdLayer.toUpperCase()}</span>
                <button
                  onClick={runLmdScan}
                  disabled={scanningLmd}
                  className="px-3 py-1 bg-purple-600 hover:bg-purple-500 text-white rounded font-bold text-xs tracking-wider"
                >
                  {scanningLmd ? 'ANALYZING...' : 'RUN INFILTRATION SCAN'}
                </button>
              </div>

              {scanningLmd ? (
                <div className="py-8 text-center text-xs font-mono-tech text-purple-300 animate-pulse">
                  <Cpu className="w-8 h-8 mx-auto mb-2 text-purple-400 animate-spin" />
                  CROSS-REFERENCING NEURAL BIOMETRICS WITH S.H.I.E.L.D. DATABASE...
                </div>
              ) : scanResult ? (
                <div className="p-3 bg-red-950/60 border border-red-500/60 rounded-lg text-xs font-mono-tech text-red-200">
                  <div className="font-bold mb-1 flex items-center gap-1.5 text-red-400">
                    <AlertTriangle className="w-4 h-4" />
                    L.M.D. INFILTRATOR IDENTIFIED
                  </div>
                  <div>{scanResult}</div>
                </div>
              ) : (
                <div className="p-3 bg-slate-900 rounded-lg text-xs font-mono-tech text-slate-400">
                  {lmdLayer === 'skin' && "Epidermal layer synthesized with micro-pores capable of natural perspiration and heat distribution to fool thermal cameras."}
                  {lmdLayer === 'skeleton' && "Endoskeleton fabricated with high-tensile carbon composites, providing 4x baseline human lifting capability."}
                  {lmdLayer === 'brain' && "Self-learning positronic matrix capable of holding 100% of human memory archives and simulated emotional response."}
                  {lmdLayer === 'darkhold' && "Radcliffe's classified notes derived from the Darkhold. Enabled AIDA to bypass Asimov's laws of robotics."}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
