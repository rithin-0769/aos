import React, { useState } from 'react';
import { sound } from '../../utils/audio';
import { Swords, Zap, Shield, Target } from 'lucide-react';

export const BobbiCombatSimulator: React.FC = () => {
  const [voltageLevel, setVoltageLevel] = useState<number>(50);
  const [sparringStrikes, setSparringStrikes] = useState<number>(0);
  const [isShockActive, setIsShockActive] = useState<boolean>(false);

  const handleStrike = () => {
    setIsShockActive(true);
    sound.playShockBaton();
    setSparringStrikes(prev => prev + 1);
    setTimeout(() => {
      setIsShockActive(false);
    }, 400);
  };

  return (
    <div className="p-6 rounded-2xl bg-slate-950 border border-sky-500/50 space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Swords className="w-5 h-5 text-sky-400" />
          <h3 className="font-heading font-bold text-white text-base">
            MOCKINGBIRD // DUAL ELECTROSHOCK BATTLE STAVES
          </h3>
        </div>
        <span className="text-xs font-mono-tech text-sky-300">
          STRIKE COMBOS: <strong className="text-white">{sparringStrikes}</strong>
        </span>
      </div>

      <p className="text-xs text-slate-300 leading-relaxed font-mono-tech">
        Agent 19 Bobbi Morse combines Olympic-tier gymnastics with custom collapsible titanium battle staves equipped with high-voltage stun capacitors.
      </p>

      {/* Shock Baton Visual Canvas */}
      <div className={`p-6 rounded-2xl border-2 transition-all duration-300 text-center relative overflow-hidden ${
        isShockActive
          ? 'bg-sky-950/80 border-sky-400 shadow-[0_0_30px_rgba(56,189,248,0.4)]'
          : 'bg-slate-900 border-slate-800'
      }`}>
        <div className="text-3xl mb-1">⚡ 🥢 ⚡</div>
        <div className="text-lg font-heading font-bold text-white">
          {isShockActive ? 'DISCHARGE: 10,000 VOLT STUN PULSE' : 'TWIN BATTLE STAVES LOCKED'}
        </div>
        <div className="text-xs font-mono-tech text-sky-300 mt-1">
          CAPACITOR OUTPUT: {voltageLevel * 200}V
        </div>
      </div>

      {/* Voltage Slider */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs font-mono-tech">
          <span className="text-slate-400">STUN VOLTAGE SETTING:</span>
          <span className="font-bold text-sky-400">{voltageLevel}% POWER</span>
        </div>
        <input
          type="range"
          min="10"
          max="100"
          value={voltageLevel}
          onChange={(e) => setVoltageLevel(Number(e.target.value))}
          className="w-full h-2.5 rounded-lg appearance-none cursor-pointer bg-slate-900 accent-sky-400 border border-slate-800"
        />
      </div>

      {/* Sparring Action Button */}
      <button
        onClick={handleStrike}
        className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white font-heading font-bold text-xs tracking-wider shadow-lg shadow-sky-600/30 flex items-center justify-center gap-2 transition-all transform active:scale-95"
      >
        <Zap className="w-4 h-4" />
        <span>SPAR // DISCHARGE DUAL SHOCK STAVES</span>
      </button>
    </div>
  );
};
