import React, { useState } from 'react';
import { SOUNDBOARD_QUOTES } from '../data/soundboardData';
import { sound } from '../utils/audio';
import {
  Volume2,
  VolumeX,
  Radio,
  Sparkles,
  Headphones,
  Sliders,
  Play,
  Square,
  Shield,
  Layers
} from 'lucide-react';

export const SoundboardTerminal: React.FC = () => {
  const [activeQuoteId, setActiveQuoteId] = useState<string | null>(null);
  const [ambientTrack, setAmbientTrack] = useState<'off' | 'zephyr' | 'mainframe' | 'radio'>(sound.getCurrentAmbientTrack());
  const [ambientVolume, setAmbientVolume] = useState<number>(0.15);

  const handlePlayQuote = (quoteItem: typeof SOUNDBOARD_QUOTES[0]) => {
    setActiveQuoteId(quoteItem.id);
    sound.speakQuote(quoteItem.quote);
    sound.playBeep(780, 0.05);
    setTimeout(() => {
      setActiveQuoteId(null);
    }, 3000);
  };

  const handleSelectAmbient = (track: 'off' | 'zephyr' | 'mainframe' | 'radio') => {
    setAmbientTrack(track);
    sound.setAmbientTrack(track, ambientVolume);
    sound.playBeep(track === 'off' ? 300 : 800, 0.05);
  };

  const handleVolumeChange = (vol: number) => {
    setAmbientVolume(vol);
    if (ambientTrack !== 'off') {
      sound.setAmbientTrack(ambientTrack, vol);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="p-4 rounded-2xl bg-slate-950/80 border border-sky-800/40 backdrop-blur-md flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-900 border border-indigo-400 flex items-center justify-center text-white shadow-lg shadow-indigo-600/30">
            <Radio className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="text-[10px] font-mono-tech text-indigo-400 uppercase tracking-widest flex items-center gap-1.5">
              <span>AUDIO COMM-ARRAY</span>
              <span className="text-cyan-400 font-bold">[SYNTHESIS ONLINE]</span>
            </div>
            <h2 className="text-lg font-heading font-black text-white">
              TACTICAL AUDIO AMBIENCE & ICONIC QUOTE SOUNDBOARD
            </h2>
          </div>
        </div>
      </div>

      {/* AMBIENT AUDIO COCKPIT SECTION */}
      <div className="p-5 rounded-2xl bg-slate-950/85 border border-sky-500/40 backdrop-blur-md space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Headphones className="w-4 h-4 text-cyan-400" />
            <span className="font-heading font-bold text-sm text-white">
              S.H.I.E.L.D. TACTICAL BACKGROUND AMBIENCE
            </span>
          </div>
          <span className="text-[11px] font-mono-tech text-slate-400">
            Synthesized continuous Web Audio loops (zero external bandwidth)
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <button
            onClick={() => handleSelectAmbient('off')}
            className={`p-3.5 rounded-xl border text-left text-xs font-mono-tech transition-all flex items-center gap-3 ${
              ambientTrack === 'off'
                ? 'bg-slate-800 border-slate-500 text-white font-bold'
                : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
            }`}
          >
            <Square className="w-4 h-4 text-red-400" />
            <div>
              <div className="font-bold text-white">MUTED / OFF</div>
              <div className="text-[10px] text-slate-500">Silence background drone</div>
            </div>
          </button>

          <button
            onClick={() => handleSelectAmbient('zephyr')}
            className={`p-3.5 rounded-xl border text-left text-xs font-mono-tech transition-all flex items-center gap-3 ${
              ambientTrack === 'zephyr'
                ? 'bg-sky-950 border-sky-400 text-sky-200 font-bold shadow-lg shadow-sky-600/30'
                : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
            }`}
          >
            <Radio className="w-4 h-4 text-sky-400 animate-pulse" />
            <div>
              <div className="font-bold text-white">ZEPHYR ENGINE DRONE</div>
              <div className="text-[10px] text-sky-300/80">Twin-turbine flight cruise</div>
            </div>
          </button>

          <button
            onClick={() => handleSelectAmbient('mainframe')}
            className={`p-3.5 rounded-xl border text-left text-xs font-mono-tech transition-all flex items-center gap-3 ${
              ambientTrack === 'mainframe'
                ? 'bg-indigo-950 border-indigo-400 text-indigo-200 font-bold shadow-lg shadow-indigo-600/30'
                : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
            }`}
          >
            <Sliders className="w-4 h-4 text-indigo-400 animate-pulse" />
            <div>
              <div className="font-bold text-white">TRISKELION MAINFRAME</div>
              <div className="text-[10px] text-indigo-300/80">Server room cooling & pulse</div>
            </div>
          </button>

          <button
            onClick={() => handleSelectAmbient('radio')}
            className={`p-3.5 rounded-xl border text-left text-xs font-mono-tech transition-all flex items-center gap-3 ${
              ambientTrack === 'radio'
                ? 'bg-amber-950 border-amber-400 text-amber-200 font-bold shadow-lg shadow-amber-600/30'
                : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
            }`}
          >
            <Volume2 className="w-4 h-4 text-amber-400 animate-pulse" />
            <div>
              <div className="font-bold text-white">SHORTWAVE COMMS HISS</div>
              <div className="text-[10px] text-amber-300/80">Tactical radio frequency</div>
            </div>
          </button>
        </div>

        {/* Ambient Volume Slider */}
        {ambientTrack !== 'off' && (
          <div className="pt-2 flex items-center gap-3 text-xs font-mono-tech text-slate-400">
            <span>VOLUME:</span>
            <input
              type="range"
              min="0.02"
              max="0.4"
              step="0.01"
              value={ambientVolume}
              onChange={(e) => handleVolumeChange(Number(e.target.value))}
              className="w-48 h-2 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-cyan-400"
            />
            <span className="text-cyan-400 font-bold">{Math.round(ambientVolume * 250)}%</span>
          </div>
        )}
      </div>

      {/* ICONIC QUOTES SOUNDBOARD GRID */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs font-mono-tech text-slate-400">
          <span className="font-heading font-bold text-sm text-white">
            ICONIC AGENTS OF S.H.I.E.L.D. SOUNDBOARD ({SOUNDBOARD_QUOTES.length})
          </span>
          <span>CLICK ANY TRANSMISSION TO BROADCAST</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {SOUNDBOARD_QUOTES.map(quoteItem => {
            const isPlaying = activeQuoteId === quoteItem.id;
            return (
              <button
                key={quoteItem.id}
                onClick={() => handlePlayQuote(quoteItem)}
                className={`p-4 rounded-2xl border text-left transition-all duration-300 flex flex-col justify-between gap-3 ${
                  isPlaying
                    ? 'bg-sky-950/90 border-sky-400 shadow-xl shadow-sky-600/40 scale-[1.02]'
                    : 'bg-slate-950/70 border-slate-800 hover:border-slate-700 hover:bg-slate-900/60'
                }`}
              >
                <div className="flex items-center justify-between text-xs font-mono-tech">
                  <span className="font-bold text-sky-400">{quoteItem.speaker}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] bg-slate-900 border border-slate-850 text-amber-400">
                    S0{quoteItem.season} // {quoteItem.tag}
                  </span>
                </div>

                <blockquote className="text-sm font-heading italic text-white leading-relaxed">
                  "{quoteItem.quote}"
                </blockquote>

                <div className="pt-2 border-t border-slate-900 flex items-center justify-between text-[11px] font-mono-tech text-slate-500">
                  <span className="truncate max-w-[200px]">{quoteItem.context}</span>
                  <span className="text-sky-400 flex items-center gap-1">
                    <Play className="w-3 h-3 fill-current" />
                    <span>PLAY</span>
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
