import React, { useState, useEffect } from 'react';
import { sound } from '../../utils/audio';
import { Clock, RotateCcw, Shield, CheckCircle2, AlertTriangle, Sparkles } from 'lucide-react';

export const EnochTimeLoopSimulator: React.FC = () => {
  const [loopCount, setLoopCount] = useState<number>(1);
  const [distanceToVortex, setDistanceToVortex] = useState<number>(100);
  const [coreCalibrated, setCoreCalibrated] = useState<boolean>(false);
  const [loopLogs, setLoopLogs] = useState<string[]>([
    "Loop 01: Zephyr-One entered temporal vortex. Time Drive overheated.",
    "Daisy and Coulson awakened with loop retention."
  ]);

  const handleNextLoop = () => {
    sound.playGlitch();
    setLoopCount(c => c + 1);
    setDistanceToVortex(d => Math.max(10, d - 18));
    setLoopLogs(prev => [
      `Loop 0${loopCount + 1}: Coulson and Daisy consulted Enoch. Time Drive regulator required.`,
      ...prev
    ]);
  };

  const handleCalibrateElectrochron = () => {
    sound.playClearancePromotion();
    setCoreCalibrated(true);
    setLoopLogs(prev => [
      "ENOCH'S SACRIFICE: 'As I have always been.' Electrochron core donated.",
      "TEMPORAL STABILIZATION ACHIEVED: Zephyr exited the time storm safely!",
      ...prev
    ]);
  };

  const handleResetLoop = () => {
    setLoopCount(1);
    setDistanceToVortex(100);
    setCoreCalibrated(false);
    setLoopLogs([
      "Loop 01: Zephyr-One entered temporal vortex. Time Drive overheated.",
      "Daisy and Coulson awakened with loop retention."
    ]);
  };

  return (
    <div className="p-6 rounded-2xl bg-slate-950 border border-amber-500/50 space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-amber-400 animate-spin" style={{ animationDuration: '8s' }} />
          <h3 className="font-heading font-bold text-white text-base">
            ENOCH // ZEPHYR-ONE TIME LOOP RECOVERY PROTOCOL
          </h3>
        </div>
        <span className="text-xs font-mono-tech text-amber-300">
          LOOP ATTEMPT: <strong className="text-white">#0{loopCount}</strong>
        </span>
      </div>

      <p className="text-xs text-slate-300 leading-relaxed font-mono-tech">
        Trapped in an accelerating time storm collapsing towards absolute zero. Each reset shortens the survival window until Enoch removes his vital energy mechanism to save the team.
      </p>

      {/* Time Vortex Proximity Gauge */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
        <div className="flex justify-between text-xs font-mono-tech">
          <span className="text-slate-400">DISTANCE TO TEMPORAL EVENT HORIZON:</span>
          <span className={`font-bold ${distanceToVortex <= 30 ? 'text-red-400 animate-pulse' : 'text-amber-400'}`}>
            {distanceToVortex} KM
          </span>
        </div>
        <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden p-0.5 border border-slate-800">
          <div
            className={`h-full rounded-full transition-all duration-300 ${
              coreCalibrated ? 'bg-emerald-400' : 'bg-gradient-to-r from-amber-400 to-rose-500'
            }`}
            style={{ width: `${coreCalibrated ? 100 : distanceToVortex}%` }}
          />
        </div>
      </div>

      {/* Action Controls */}
      {!coreCalibrated ? (
        <div className="flex gap-3">
          <button
            onClick={handleNextLoop}
            className="flex-1 py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-850 border border-amber-500/50 text-amber-300 font-heading font-bold text-xs tracking-wider flex items-center justify-center gap-2 transition-transform active:scale-95"
          >
            <RotateCcw className="w-4 h-4" />
            <span>TRIGGER TIME RESET (LOOP AGAIN)</span>
          </button>

          {loopCount >= 3 && (
            <button
              onClick={handleCalibrateElectrochron}
              className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-400 hover:to-yellow-500 text-slate-950 font-heading font-black text-xs tracking-wider shadow-lg shadow-amber-500/30 flex items-center justify-center gap-2 transition-transform active:scale-95 animate-pulse"
            >
              <Sparkles className="w-4 h-4" />
              <span>DONATE ENOCH'S ELECTROCHRON CORE</span>
            </button>
          )}
        </div>
      ) : (
        <div className="p-4 bg-emerald-950/80 border border-emerald-500 rounded-xl text-center space-y-2">
          <div className="text-emerald-300 font-heading font-bold text-sm">
            TIME DRIVE REPAIRED // S.H.I.E.L.D. FREED FROM TIME STORM
          </div>
          <button
            onClick={handleResetLoop}
            className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded text-xs font-mono-tech"
          >
            REPLAY TIME LOOP
          </button>
        </div>
      )}

      {/* Loop Diagnostic Log */}
      <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-[11px] font-mono-tech text-slate-400 max-h-32 overflow-y-auto space-y-1">
        {loopLogs.map((log, i) => (
          <div key={i} className="text-slate-300">{log}</div>
        ))}
      </div>
    </div>
  );
};
