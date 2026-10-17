import React from 'react';
import { SeasonInfo, SeasonNumber } from '../types';
import { sound } from '../utils/audio';
import { Shield, AlertTriangle, EyeOff, Eye, Clock, Key } from 'lucide-react';

interface TimelineSliderProps {
  seasons: SeasonInfo[];
  currentSeason: SeasonNumber;
  onSeasonChange: (season: SeasonNumber) => void;
  spoilerSafeMode: boolean;
  onToggleSpoilerSafe: () => void;
  onFindEasterEgg?: (id: string) => void;
  foundEasterEggs?: string[];
}

export const TimelineSlider: React.FC<TimelineSliderProps> = ({
  seasons,
  currentSeason,
  onSeasonChange,
  spoilerSafeMode,
  onToggleSpoilerSafe,
  onFindEasterEgg,
  foundEasterEggs = []
}) => {
  const activeSeasonData = seasons.find((s) => s.number === currentSeason) || seasons[0];

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value) as SeasonNumber;
    onSeasonChange(val);
    if (val === 4) {
      sound.playGlitch();
    } else {
      sound.playBeep(300 + val * 80, 0.08);
    }
  };

  const hasFoundKey = foundEasterEggs.includes('egg-zephyr-key');

  const handleKeyClick = () => {
    if (onFindEasterEgg) {
      onFindEasterEgg('egg-zephyr-key');
    }
  };

  return (
    <div className="p-4 sm:p-5 rounded-2xl border border-sky-800/40 bg-slate-950/80 backdrop-blur-md shadow-2xl relative overflow-hidden">
      {/* Decorative Scanline for Framework Season */}
      {currentSeason === 4 && (
        <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(34,197,94,0.06)_1px,transparent_1px)] [background-size:100%_4px] opacity-80" />
      )}

      {/* Top Bar: Title, Spoiler Toggle, and Secret Key */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shadow-md transition-colors duration-500"
            style={{
              backgroundColor: activeSeasonData.themeColors.badgeBg,
              color: activeSeasonData.themeColors.primary,
              borderColor: activeSeasonData.themeColors.primary,
              borderWidth: '1px'
            }}
          >
            S0{currentSeason}
          </div>
          <div>
            <div className="text-[11px] font-mono-tech tracking-widest text-slate-400 uppercase flex items-center gap-1.5">
              <span>TIMELINE ERA // S.H.I.E.L.D. ARCHIVES</span>
              {currentSeason === 4 && <span className="text-emerald-400 font-bold animate-pulse">[FRAMEWORK OVERRIDE]</span>}
              {currentSeason === 2 && <span className="text-red-400 font-bold animate-pulse">[HYDRA INFILTRATION]</span>}
              {currentSeason === 7 && <span className="text-amber-400 font-bold">[VINTAGE SSR ERA]</span>}
            </div>
            <h2 className="text-lg sm:text-xl font-heading font-bold text-white tracking-wide">
              {activeSeasonData.title}
            </h2>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Secret Zephyr Key Easter Egg */}
          <button
            onClick={handleKeyClick}
            title={hasFoundKey ? "Zephyr-One Key Acquired" : "Unmarked titanium key tucked under timeline housing"}
            className={`p-2 rounded-lg border transition-all ${
              hasFoundKey
                ? 'bg-amber-950/60 border-amber-500 text-amber-300'
                : 'bg-slate-900/60 border-slate-800 text-slate-600 hover:text-amber-400 hover:border-amber-500/50'
            }`}
          >
            <Key className="w-4 h-4" />
          </button>

          {/* Spoiler Safe Mode Toggle */}
          <button
            onClick={() => {
              onToggleSpoilerSafe();
              sound.playBeep(spoilerSafeMode ? 400 : 700, 0.08);
            }}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono-tech border transition-all ${
              spoilerSafeMode
                ? 'bg-emerald-950/80 border-emerald-500/80 text-emerald-300'
                : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-600'
            }`}
          >
            {spoilerSafeMode ? (
              <>
                <EyeOff className="w-3.5 h-3.5 text-emerald-400" />
                <span>SPOILER-SAFE: ON (S0{currentSeason})</span>
              </>
            ) : (
              <>
                <Eye className="w-3.5 h-3.5 text-slate-400" />
                <span>SPOILER-SAFE: OFF</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Interactive Season Slider Track */}
      <div className="my-4">
        <div className="relative flex items-center">
          <input
            type="range"
            min="1"
            max="7"
            step="1"
            value={currentSeason}
            onChange={handleSliderChange}
            className="w-full h-3 rounded-lg appearance-none cursor-pointer bg-slate-900 border border-slate-800 accent-sky-400 z-10"
            style={{
              accentColor: activeSeasonData.themeColors.primary
            }}
          />
        </div>

        {/* Season Marks */}
        <div className="flex justify-between mt-2 px-1">
          {seasons.map((s) => (
            <button
              key={s.number}
              onClick={() => {
                onSeasonChange(s.number);
                sound.playBeep(300 + s.number * 80, 0.08);
              }}
              className={`text-center transition-all ${
                s.number === currentSeason
                  ? 'text-white font-bold scale-110'
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              <div className="text-xs font-heading">S0{s.number}</div>
              <div className="text-[10px] font-mono-tech hidden sm:block">
                {s.number === 1 ? 'Bus' : s.number === 2 ? 'Hydra' : s.number === 3 ? 'Warriors' : s.number === 4 ? 'Framework' : s.number === 5 ? '2091' : s.number === 6 ? 'Shrike' : 'Time'}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Season Intel Card */}
      <div
        className="p-3.5 rounded-xl border mt-3 transition-colors duration-500 text-xs"
        style={{
          borderColor: activeSeasonData.themeColors.border,
          backgroundColor: 'rgba(15, 23, 42, 0.5)'
        }}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <div className="text-[10px] font-mono-tech text-slate-500 uppercase">CODENAME & TIMEFRAME</div>
            <div className="font-bold text-slate-200 mt-0.5">{activeSeasonData.codename}</div>
            <div className="text-[11px] text-slate-400 font-mono-tech">{activeSeasonData.yearRange}</div>
          </div>

          <div>
            <div className="text-[10px] font-mono-tech text-slate-500 uppercase">HEADQUARTERS & BASE</div>
            <div className="font-bold text-slate-200 mt-0.5">{activeSeasonData.headquarters}</div>
            <div className="text-[11px] text-slate-400">Threat Index: <span className="font-mono-tech font-bold text-amber-400">{activeSeasonData.threatLevel}</span></div>
          </div>

          <div>
            <div className="text-[10px] font-mono-tech text-slate-500 uppercase">KEY FACTIONS INVOLVED</div>
            <div className="flex flex-wrap gap-1 mt-1">
              {activeSeasonData.majorFactions.map((f, i) => (
                <span
                  key={i}
                  className="px-2 py-0.5 rounded text-[10px] font-mono-tech bg-slate-900 border border-slate-800 text-slate-300"
                >
                  {f}
                </span>
              ))}
            </div>
          </div>
        </div>

        <p className="mt-2.5 pt-2 border-t border-slate-800/80 text-slate-300 leading-relaxed">
          {activeSeasonData.description}
        </p>
      </div>
    </div>
  );
};
