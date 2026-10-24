import React, { useState } from 'react';
import { sound } from '../../utils/audio';
import { Radio, Sparkles, Volume2, Music, Zap } from 'lucide-react';

export const DekeSynthSimulator: React.FC = () => {
  const [activeRiff, setActiveRiff] = useState<string | null>(null);

  const notes = [
    { label: 'C4', freq: 261.63 },
    { label: 'D4', freq: 293.66 },
    { label: 'E4', freq: 329.63 },
    { label: 'G4', freq: 392.00 },
    { label: 'A4', freq: 440.00 },
    { label: 'C5', freq: 523.25 }
  ];

  const handlePlayKey = (freq: number, label: string) => {
    setActiveRiff(label);
    sound.playBeep(freq, 0.25, 'sawtooth');
    setTimeout(() => {
      setActiveRiff(null);
    }, 250);
  };

  const handlePlay80sLick = () => {
    const lick = [392.00, 440.00, 523.25, 440.00, 329.63, 293.66];
    lick.forEach((f, idx) => {
      setTimeout(() => {
        sound.playBeep(f, 0.18, 'sawtooth');
      }, idx * 160);
    });
  };

  return (
    <div className="p-6 rounded-2xl bg-slate-950 border border-purple-500/50 space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Music className="w-5 h-5 text-purple-400" />
          <h3 className="font-heading font-bold text-white text-base">
            THE DEKE SQUAD // 1983 SYNTHESIZER & ROCK FORGE
          </h3>
        </div>
        <span className="text-xs font-mono-tech text-purple-300">
          "MORE THAN A METRIC"
        </span>
      </div>

      <p className="text-xs text-slate-300 leading-relaxed font-mono-tech">
        In the alternate 1983 timeline, Deke Shaw became the rock-star Director of S.H.I.E.L.D., composing 80s synth-pop and stealing songs before they were written to fund defense operations!
      </p>

      {/* Synthesizer Key Keyboard */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
        <div className="text-[10px] font-mono-tech text-purple-400">ANALOG SYNTH KEYBOARD (SAWTOOTH WAVE):</div>
        <div className="grid grid-cols-6 gap-2">
          {notes.map(n => (
            <button
              key={n.label}
              onClick={() => handlePlayKey(n.freq, n.label)}
              className={`py-6 rounded-xl border text-center font-heading font-bold text-xs transition-all ${
                activeRiff === n.label
                  ? 'bg-purple-600 border-white text-white shadow-lg shadow-purple-500/50 scale-95'
                  : 'bg-slate-950 border-slate-700 text-slate-300 hover:border-purple-400'
              }`}
            >
              {n.label}
            </button>
          ))}
        </div>
      </div>

      {/* Preset 80s Rock Solo */}
      <button
        onClick={handlePlay80sLick}
        className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-heading font-bold text-xs tracking-wider shadow-lg shadow-purple-600/30 flex items-center justify-center gap-2 transition-all transform active:scale-95"
      >
        <Zap className="w-4 h-4" />
        <span>PLAY DEKE SQUAD 80s SYNTH-POP RIFF</span>
      </button>
    </div>
  );
};
