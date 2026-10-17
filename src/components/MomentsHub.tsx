import React, { useState } from 'react';
import { FanMoment, SeasonNumber } from '../types';
import { sound } from '../utils/audio';
import { Play, Volume2, Sparkles, Filter, Search, Heart, Share2, Compass, MessageSquareQuote } from 'lucide-react';

interface MomentsHubProps {
  moments: FanMoment[];
  currentSeason: SeasonNumber;
  spoilerSafeMode: boolean;
  onFindEasterEgg?: (id: string) => void;
  foundEasterEggs?: string[];
}

export const MomentsHub: React.FC<MomentsHubProps> = ({
  moments,
  currentSeason,
  spoilerSafeMode,
  onFindEasterEgg,
  foundEasterEggs = []
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeMoment, setActiveMoment] = useState<FanMoment>(moments[0]);
  const [dailyQuote, setDailyQuote] = useState<FanMoment>(moments[0]);
  const [tahitiTaps, setTahitiTaps] = useState<number>(0);

  const categories = ['ALL', 'SPEECH', 'SACRIFICE', 'TRANSFORMATION', 'FAREWELL', 'BATTLE'];

  // Filter moments
  const filteredMoments = moments.filter((m) => {
    // Spoiler filter
    if (spoilerSafeMode && m.season > currentSeason) return false;
    // Category filter
    if (selectedCategory !== 'ALL' && m.category !== selectedCategory) return false;
    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        m.title.toLowerCase().includes(q) ||
        m.speaker.toLowerCase().includes(q) ||
        m.quote.toLowerCase().includes(q) ||
        m.tags.some(t => t.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const handlePlayQuote = (quote: string) => {
    sound.speakQuote(quote);
    sound.playBeep(640, 0.08);
  };

  const getRandomQuote = () => {
    const pool = spoilerSafeMode ? moments.filter(m => m.season <= currentSeason) : moments;
    const random = pool[Math.floor(Math.random() * pool.length)];
    setDailyQuote(random);
    sound.playBeep(720, 0.06);
    sound.speakQuote(random.quote);
  };

  const handleTahitiTap = () => {
    const next = tahitiTaps + 1;
    setTahitiTaps(next);
    sound.playBeep(300 + next * 100, 0.06);
    if (next >= 3 && onFindEasterEgg) {
      onFindEasterEgg('egg-tahiti-postcard');
    }
  };

  const hasFoundTahiti = foundEasterEggs.includes('egg-tahiti-postcard');

  return (
    <div className="space-y-6">
      {/* Daily Quote Generator Widget */}
      <div className="p-5 rounded-2xl border border-sky-800/40 bg-gradient-to-r from-sky-950/60 via-slate-950/90 to-indigo-950/60 backdrop-blur-md relative overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2 text-xs font-mono-tech text-sky-400">
            <MessageSquareQuote className="w-4 h-4" />
            <span className="uppercase tracking-wider">DAILY S.H.I.E.L.D. TRANSMISSION // WISDOM ARCHIVE</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={getRandomQuote}
              className="flex items-center gap-1.5 px-3 py-1 bg-sky-600/30 hover:bg-sky-600/50 border border-sky-400/50 text-sky-200 rounded-lg text-xs font-mono-tech transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>NEW TRANSMISSION</span>
            </button>
            <button
              onClick={() => handlePlayQuote(dailyQuote.quote)}
              className="p-1.5 bg-slate-900 border border-slate-700 text-sky-400 hover:text-white rounded-lg transition-colors"
              title="Play quote audio"
            >
              <Volume2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        <blockquote className="text-base sm:text-lg font-heading italic text-white mb-2">
          "{dailyQuote.quote}"
        </blockquote>
        <div className="flex items-center justify-between text-xs font-mono-tech text-slate-400">
          <span className="text-sky-300 font-bold">— {dailyQuote.speaker}</span>
          <span>{dailyQuote.episode} (S0{dailyQuote.season})</span>
        </div>
      </div>

      {/* Main Hub: Filter Bar & Search */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        {/* Category Pills */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => { setSelectedCategory(cat); sound.playBeep(520, 0.04); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono-tech whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-sky-600 text-white font-bold shadow'
                  : 'bg-slate-900/60 border border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Input & Secret Tahiti Button */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1 sm:w-60">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search quote or speaker..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-sky-500"
            />
          </div>

          {/* Secret Tahiti Postcard Button */}
          <button
            onClick={handleTahitiTap}
            title={hasFoundTahiti ? "Tahiti Postcard Discovered!" : "A postcard of a tropical island. Tap repeatedly..."}
            className={`p-2 rounded-lg border text-xs font-mono-tech transition-all ${
              hasFoundTahiti
                ? 'bg-emerald-950 border-emerald-500 text-emerald-300'
                : 'bg-slate-900 border-slate-800 text-slate-500 hover:text-sky-400'
            }`}
          >
            🌴
          </button>
        </div>
      </div>

      {/* Grid of Fan Moments */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredMoments.map((moment) => {
          const isSelected = activeMoment.id === moment.id;
          return (
            <div
              key={moment.id}
              onClick={() => { setActiveMoment(moment); sound.playBeep(480, 0.05); }}
              className={`p-4 rounded-xl border text-left cursor-pointer transition-all duration-300 relative overflow-hidden ${
                isSelected
                  ? 'bg-slate-900/90 border-sky-400 shadow-lg shadow-sky-950/60'
                  : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/40'
              }`}
            >
              {/* Category & Season Badge */}
              <div className="flex items-center justify-between text-xs font-mono-tech mb-2">
                <span className="px-2 py-0.5 rounded text-[10px] bg-sky-950 border border-sky-800 text-sky-300">
                  {moment.category} // S0{moment.season}
                </span>
                <span className="text-slate-500 text-[11px]">{moment.episode}</span>
              </div>

              <h4 className="font-heading font-bold text-base text-white mb-2">
                {moment.title}
              </h4>

              <p className="text-xs text-sky-200/90 italic mb-3 line-clamp-3">
                "{moment.quote}"
              </p>

              <div className="flex items-center justify-between text-xs font-mono-tech pt-2 border-t border-slate-800/80">
                <span className="text-slate-400 font-bold">{moment.speaker}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePlayQuote(moment.quote);
                  }}
                  className="flex items-center gap-1 text-sky-400 hover:text-white transition-colors"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>PLAY CLIP</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Moment Deep Dive Viewer */}
      <div className="p-5 rounded-2xl border border-sky-800/50 bg-slate-950/80">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
          <div className="text-xs font-mono-tech text-sky-400 uppercase">
            SELECTED ARCHIVAL SCENE // {activeMoment.episode}
          </div>
          <button
            onClick={() => handlePlayQuote(activeMoment.quote)}
            className="flex items-center gap-1.5 px-3 py-1 bg-sky-600 hover:bg-sky-500 text-white rounded text-xs font-mono-tech font-bold shadow"
          >
            <Play className="w-3.5 h-3.5" />
            <span>PLAY DIALOGUE</span>
          </button>
        </div>

        <h3 className="text-xl font-heading font-bold text-white mb-2">
          {activeMoment.title}
        </h3>

        <div className="p-3 bg-slate-900/80 border-l-4 border-sky-500 rounded-r-lg mb-3">
          <div className="text-xs font-mono-tech text-slate-400 mb-1">TRANSCRIPT:</div>
          <p className="text-sm font-heading italic text-sky-100">
            "{activeMoment.quote}"
          </p>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed mb-3">
          <strong className="text-sky-300 font-mono-tech">CANON CONTEXT: </strong>
          {activeMoment.context}
        </p>

        <div className="flex flex-wrap gap-1.5">
          {activeMoment.tags.map((t, idx) => (
            <span key={idx} className="text-[10px] font-mono-tech px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400">
              #{t}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
