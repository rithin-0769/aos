import React, { useState } from 'react';
import { sound } from '../../utils/audio';
import { Flame, Key, Shield, Zap, Sparkles } from 'lucide-react';

export const GhostRiderSimulator: React.FC = () => {
  const [engineRevved, setEngineRevved] = useState<boolean>(false);
  const [penanceStareTarget, setPenanceStareTarget] = useState<string | null>(null);
  const [hellfireCharge, setHellfireCharge] = useState<number>(30);

  const handleRevLucy = () => {
    setEngineRevved(true);
    sound.playGhostRiderIgnition();
    setHellfireCharge(100);
    setTimeout(() => {
      setEngineRevved(false);
    }, 2000);
  };

  const handleChainStrike = () => {
    sound.playShotgunAxe();
    setPenanceStareTarget("Sinful Darkhold Corrupted Hostile");
    setTimeout(() => {
      setPenanceStareTarget(null);
    }, 3000);
  };

  return (
    <div className="p-6 rounded-2xl bg-slate-950 border border-red-500/50 space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Flame className="w-5 h-5 text-red-500 animate-pulse" />
          <h3 className="font-heading font-bold text-white text-base">
            SPIRIT OF VENGEANCE // 1969 DODGE CHARGER 'LUCY'
          </h3>
        </div>
        <span className="text-xs font-mono-tech text-red-400 font-bold">
          RIDER STATUS: VENGEANCE BOUND
        </span>
      </div>

      <p className="text-xs text-slate-300 leading-relaxed font-mono-tech">
        Robbie Reyes hosts the demonic Spirit of Vengeance, wielding supernatural Hellfire iron chains and piloting the modified black 1969 Dodge Charger that burns with hellfire exhausts.
      </p>

      {/* Hell Charger Visual Interface */}
      <div className={`p-6 rounded-2xl border-2 transition-all duration-500 text-center relative overflow-hidden ${
        engineRevved
          ? 'bg-red-950/70 border-red-500 shadow-[0_0_40px_rgba(239,68,68,0.5)]'
          : 'bg-slate-900 border-slate-800'
      }`}>
        <div className="text-4xl mb-2">🚗🔥</div>
        <div className="text-xl font-heading font-black text-white">
          {engineRevved ? 'HELL CHARGER IGNITED // HELLFIRE BURST' : '1969 DODGE CHARGER "LUCY" IDLE'}
        </div>
        <div className="text-xs font-mono-tech text-red-300 mt-1">
          {engineRevved ? 'SUPERNATURAL V8 HEMI ROARING • TIRES ENGULFED IN FLAMES' : 'TURN KEY TO AWAKEN THE DEMONIC ENGINE'}
        </div>

        {penanceStareTarget && (
          <div className="mt-4 p-3 bg-red-950/90 border border-red-400 rounded-xl text-xs font-mono-tech text-red-200 animate-bounce">
            🔥 PENANCE STARE INFLICTED: Soul incinerated with the weight of all innocent blood spilled!
          </div>
        )}
      </div>

      {/* Interactive Weapon Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <button
          onClick={handleRevLucy}
          className="py-3.5 px-4 rounded-xl bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white font-heading font-bold text-xs tracking-wider shadow-lg shadow-red-600/30 flex items-center justify-center gap-2 transition-all transform active:scale-95"
        >
          <Key className="w-4 h-4" />
          <span>REV HELL CHARGER V8 ENGINE</span>
        </button>

        <button
          onClick={handleChainStrike}
          className="py-3.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 border border-red-500/60 text-red-300 font-heading font-bold text-xs tracking-wider flex items-center justify-center gap-2 transition-all transform active:scale-95"
        >
          <Flame className="w-4 h-4" />
          <span>WHIP HELLFIRE IRON CHAINS</span>
        </button>
      </div>
    </div>
  );
};
