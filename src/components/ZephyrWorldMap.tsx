import React, { useState } from 'react';
import { THREAT_LOCATIONS } from '../data/worldMapData';
import { ThreatLocation } from '../types';
import { sound } from '../utils/audio';
import {
  Globe,
  Radio,
  Crosshair,
  AlertTriangle,
  Shield,
  Zap,
  CheckCircle2,
  Clock,
  Compass,
  Radar,
  ArrowRight
} from 'lucide-react';

interface ZephyrWorldMapProps {
  onAwardXp: (amount: number, reason: string) => void;
}

export const ZephyrWorldMap: React.FC<ZephyrWorldMapProps> = ({ onAwardXp }) => {
  const [selectedHotspotId, setSelectedHotspotId] = useState<string>(THREAT_LOCATIONS[0].id);
  const [activeMissionResult, setActiveMissionResult] = useState<{ message: string; xp: number } | null>(null);
  const [dispatchedHotspots, setDispatchedHotspots] = useState<Record<string, boolean>>({});

  const activeHotspot = THREAT_LOCATIONS.find(h => h.id === selectedHotspotId) || THREAT_LOCATIONS[0];

  const handleSelectHotspot = (id: string) => {
    setSelectedHotspotId(id);
    setActiveMissionResult(null);
    sound.playBeep(680, 0.05);
  };

  const handleExecuteOption = (opt: ThreatLocation['tacticalOptions'][0]) => {
    if (dispatchedHotspots[activeHotspot.id]) return;

    sound.playClearancePromotion();
    setActiveMissionResult({
      message: opt.successMessage,
      xp: opt.xpReward
    });
    setDispatchedHotspots(prev => ({ ...prev, [activeHotspot.id]: true }));
    onAwardXp(opt.xpReward, `TACTICAL MISSION SUCCESS: ${activeHotspot.name}`);
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="p-4 rounded-2xl bg-slate-950/80 border border-sky-800/40 backdrop-blur-md flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-600 to-sky-900 border border-cyan-400 flex items-center justify-center text-white shadow-lg shadow-cyan-600/30">
            <Globe className="w-5 h-5 animate-spin" style={{ animationDuration: '20s' }} />
          </div>
          <div>
            <div className="text-[10px] font-mono-tech text-cyan-400 uppercase tracking-widest flex items-center gap-1.5">
              <span>ZEPHYR-ONE COMMAND BRIDGE</span>
              <span className="text-emerald-400 font-bold">[GLOBAL RADAR ACTIVE]</span>
            </div>
            <h2 className="text-lg font-heading font-black text-white">
              HOLOGRAPHIC WORLD MAP & 0-8-4 THREAT RADAR
            </h2>
          </div>
        </div>

        {/* Global Coordinates Metric */}
        <div className="flex items-center gap-3 text-xs font-mono-tech">
          <div className="px-3 py-1.5 bg-slate-900 rounded-lg border border-slate-800 text-slate-400">
            RADAR COVERAGE: <span className="text-emerald-400 font-bold">100% PLANETARY</span>
          </div>
          <div className="px-3 py-1.5 bg-slate-900 rounded-lg border border-slate-800 text-slate-400">
            HOTSPOTS: <span className="text-cyan-400 font-bold">{THREAT_LOCATIONS.length} MONITORED</span>
          </div>
        </div>
      </div>

      {/* Main Map & Recon Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Holographic Tactical Radar Map (SVG Graphic) */}
        <div className="lg:col-span-8 p-6 rounded-3xl bg-slate-950/90 border-2 border-cyan-500/50 backdrop-blur-md shadow-2xl relative overflow-hidden flex flex-col justify-between min-h-[480px]">
          {/* Radar Background Grid & Rings */}
          <div className="absolute inset-0 pointer-events-none opacity-20">
            <div className="w-full h-full bg-[radial-gradient(#06b6d4_1px,transparent_1px)] [background-size:24px_24px]" />
          </div>

          {/* Sweeping Radar Line */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="w-full h-1 bg-gradient-to-r from-transparent via-cyan-400/80 to-transparent shadow-[0_0_15px_#22d3ee] animate-pulse" />
          </div>

          {/* World Vector Outline Background Placeholder */}
          <div className="relative w-full h-96 flex items-center justify-center my-auto">
            {/* Minimalist World Map Coastlines SVG */}
            <svg
              viewBox="0 0 1000 500"
              className="w-full h-full opacity-30 text-sky-400 stroke-current fill-none stroke-[1.2]"
            >
              {/* North America */}
              <path d="M 150 100 Q 200 80, 250 110 T 320 180 T 260 250 T 180 200 Z" />
              {/* South America */}
              <path d="M 280 260 Q 320 300, 310 380 T 260 460 T 250 340 Z" />
              {/* Europe */}
              <path d="M 450 100 Q 520 80, 560 140 T 480 200 T 440 140 Z" />
              {/* Africa */}
              <path d="M 470 200 Q 550 220, 560 320 T 500 420 T 460 300 Z" />
              {/* Asia */}
              <path d="M 580 90 Q 750 80, 840 180 T 750 300 T 600 220 Z" />
              {/* Australia */}
              <path d="M 760 340 Q 840 330, 850 400 T 780 430 Z" />
            </svg>

            {/* Hotspot Markers placed at percentage coordinates */}
            {THREAT_LOCATIONS.map((loc) => {
              const isSelected = loc.id === selectedHotspotId;
              const isCleared = dispatchedHotspots[loc.id];
              return (
                <div
                  key={loc.id}
                  style={{
                    left: `${loc.coordinates.x}%`,
                    top: `${loc.coordinates.y}%`
                  }}
                  onClick={() => handleSelectHotspot(loc.id)}
                  className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-20"
                >
                  {/* Ping Rings */}
                  <span
                    className={`absolute -inset-2 rounded-full animate-ping opacity-60 ${
                      isCleared
                        ? 'bg-emerald-400'
                        : loc.threatLevel === 'OMEGA' || loc.threatLevel === 'TEMPORAL INVASION'
                        ? 'bg-red-500'
                        : 'bg-cyan-400'
                    }`}
                  />

                  {/* Marker Pin */}
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs shadow-lg transition-transform duration-300 group-hover:scale-125 border ${
                      isSelected
                        ? 'bg-cyan-400 text-slate-950 border-white scale-110 shadow-[0_0_15px_#22d3ee]'
                        : isCleared
                        ? 'bg-emerald-950 text-emerald-300 border-emerald-400'
                        : 'bg-slate-950 text-cyan-300 border-cyan-500/60'
                    }`}
                  >
                    {isCleared ? <CheckCircle2 className="w-4 h-4" /> : <Crosshair className="w-3.5 h-3.5" />}
                  </div>

                  {/* Tooltip Label */}
                  <div
                    className={`absolute top-8 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded text-[9px] font-mono-tech whitespace-nowrap border pointer-events-none transition-all ${
                      isSelected
                        ? 'bg-cyan-950 border-cyan-400 text-cyan-200 font-bold block'
                        : 'bg-slate-950/80 border-slate-800 text-slate-400 hidden group-hover:block'
                    }`}
                  >
                    {loc.name}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom Coordinates HUD Bar */}
          <div className="pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between text-xs font-mono-tech text-slate-400">
            <div className="flex items-center gap-2">
              <Compass className="w-4 h-4 text-cyan-400 animate-spin" style={{ animationDuration: '10s' }} />
              <span>ACTIVE TARGET: {activeHotspot.name.toUpperCase()} ({activeHotspot.country})</span>
            </div>
            <div className="text-[10px] text-cyan-300">
              COORDINATES: LAT {activeHotspot.coordinates.y * 2.2}°N / LON {activeHotspot.coordinates.x * 3.6}°W
            </div>
          </div>
        </div>

        {/* Right Column: Tactical Briefing & Squad Dispatch Console */}
        <div className="lg:col-span-4 space-y-4">
          <div className="p-5 rounded-2xl bg-slate-950/85 border border-sky-800/40 backdrop-blur-md space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <span className="text-[10px] font-mono-tech text-slate-400 uppercase">LOCATION INTEL</span>
                <h3 className="text-lg font-heading font-bold text-white leading-tight">
                  {activeHotspot.name}
                </h3>
              </div>
              <span
                className={`px-2 py-1 rounded text-[10px] font-mono-tech font-bold border ${
                  activeHotspot.threatLevel === 'OMEGA' || activeHotspot.threatLevel === 'TEMPORAL INVASION'
                    ? 'bg-red-950 text-red-300 border-red-500/80 animate-pulse'
                    : 'bg-cyan-950 text-cyan-300 border-cyan-500/80'
                }`}
              >
                {activeHotspot.threatLevel}
              </span>
            </div>

            <div className="text-xs font-mono-tech text-slate-400 space-y-1">
              <div>CATEGORY: <strong className="text-amber-400">{activeHotspot.category}</strong></div>
              <div>REGION: <strong className="text-sky-300">{activeHotspot.country}</strong></div>
              <div>STATUS: <strong className={dispatchedHotspots[activeHotspot.id] ? "text-emerald-400 font-bold" : "text-amber-300"}>
                {dispatchedHotspots[activeHotspot.id] ? "MISSION COMPLETED" : activeHotspot.status}
              </strong></div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              {activeHotspot.briefing}
            </p>

            {/* Mission Outcome Toast if dispatched */}
            {activeMissionResult && (
              <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-500 text-xs font-mono-tech text-emerald-200 space-y-1">
                <div className="flex items-center gap-1 font-bold text-emerald-300">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>MISSION OUTCOME: SUCCESS (+{activeMissionResult.xp} XP)</span>
                </div>
                <p className="text-[11px] text-slate-300">
                  {activeMissionResult.message}
                </p>
              </div>
            )}

            {/* Tactical Recon Action Options */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <div className="text-[10px] font-mono-tech text-slate-400 uppercase">
                AUTHORIZE S.H.I.E.L.D. TACTICAL RECON:
              </div>

              {activeHotspot.tacticalOptions.map((opt, i) => (
                <button
                  key={i}
                  disabled={dispatchedHotspots[activeHotspot.id]}
                  onClick={() => handleExecuteOption(opt)}
                  className={`w-full p-3 rounded-xl border text-left text-xs font-mono-tech transition-all flex flex-col gap-1 ${
                    dispatchedHotspots[activeHotspot.id]
                      ? 'bg-slate-900/40 border-slate-800 text-slate-500 opacity-60 cursor-not-allowed'
                      : 'bg-slate-900/80 hover:bg-slate-850 hover:border-cyan-400 border-slate-700 text-slate-200'
                  }`}
                >
                  <div className="flex justify-between items-center font-bold text-cyan-300">
                    <span>{opt.label}</span>
                    <span className="text-[10px] text-amber-400">+{opt.xpReward} XP</span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    {opt.description}
                  </p>
                  <div className="text-[9px] text-slate-500">
                    RECOMMENDED: {opt.recommendedStat.toUpperCase()} SPECIALIST
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
