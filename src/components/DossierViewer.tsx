import React, { useState } from 'react';
import { CharacterDossier, CharacterEvolution, SeasonNumber } from '../types';
import { sound } from '../utils/audio';
import { Shield, Volume2, Sparkles, Award, User, Lock, Crosshair, Cpu, Swords, Bot, Wrench, Activity } from 'lucide-react';

interface DossierViewerProps {
  characters: CharacterDossier[];
  currentSeason: SeasonNumber;
  spoilerSafeMode: boolean;
  onLaunchSimulator: (simId: string) => void;
  onOpenHeroPage?: (heroId: string) => void;
}

export const DossierViewer: React.FC<DossierViewerProps> = ({
  characters,
  currentSeason,
  spoilerSafeMode,
  onLaunchSimulator,
  onOpenHeroPage
}) => {
  const [selectedCharId, setSelectedCharId] = useState<string>(characters[0].id);
  const selectedChar = characters.find(c => c.id === selectedCharId) || characters[0];

  // Find the closest evolution for the current season
  const getActiveEvolution = (char: CharacterDossier): CharacterEvolution => {
    // If spoiler-safe mode is ON, only consider evolutions <= currentSeason
    const available = char.evolutions.filter(e => !spoilerSafeMode || e.season <= currentSeason);
    if (available.length === 0) {
      // Fallback to season 1 evolution if all are in the future
      return char.evolutions[0];
    }
    // Find highest season available up to currentSeason
    const sorted = [...available].sort((a, b) => b.season - a.season);
    return sorted[0];
  };

  const activeEvo = getActiveEvolution(selectedChar);

  const handleSelectCharacter = (id: string) => {
    setSelectedCharId(id);
    sound.playBeep(580, 0.05);
  };

  const handlePlayVoice = (text: string) => {
    sound.speakQuote(text);
  };

  return (
    <div className="space-y-4">
      {/* Character Selection Scrollbar / Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
        {characters.map((char) => {
          const isSelected = char.id === selectedCharId;
          const evo = getActiveEvolution(char);
          return (
            <button
              key={char.id}
              onClick={() => handleSelectCharacter(char.id)}
              className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl border text-left min-w-[190px] transition-all duration-300 ${
                isSelected
                  ? 'bg-sky-950/80 border-sky-400 text-sky-100 shadow-lg shadow-sky-950/80'
                  : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <div
                className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold text-xs uppercase border overflow-hidden shrink-0 ${
                  isSelected ? 'bg-sky-500/20 text-sky-300 border-sky-400' : 'bg-slate-900 text-slate-500 border-slate-800'
                }`}
              >
                {char.imageUrl ? (
                  <img src={char.imageUrl} alt={char.name} className="w-full h-full object-cover" />
                ) : (
                  char.name.charAt(0)
                )}
              </div>
              <div className="overflow-hidden">
                <div className="font-heading font-bold text-xs truncate text-white">{char.name}</div>
                <div className="text-[10px] font-mono-tech text-sky-400 truncate">{evo.alias}</div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Dossier Card */}
      <div className="p-4 sm:p-6 rounded-2xl border border-sky-900/60 bg-slate-950/85 backdrop-blur-md relative overflow-hidden">
        {/* Background tactical watermark */}
        <div className="absolute top-2 right-4 text-7xl font-mono-tech font-extrabold text-slate-900/40 select-none pointer-events-none">
          LEVEL 0{activeEvo.clearanceLevel}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 relative z-10">
          {/* Left Column: Profile Card & Simulator Trigger */}
          <div className="lg:col-span-4 flex flex-col justify-between space-y-4">
            <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-800">
              <div className="flex items-center gap-3 mb-3">
                <div className="relative w-16 h-20 rounded-xl bg-gradient-to-br from-sky-600/30 to-indigo-900/50 border border-sky-400/50 flex items-center justify-center text-sky-200 text-2xl font-heading font-bold shadow-inner overflow-hidden shrink-0">
                  {selectedChar.imageUrl ? (
                    <>
                      <img src={selectedChar.imageUrl} alt={selectedChar.name} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 border border-cyan-400/50 rounded-xl pointer-events-none" />
                      <div className="absolute inset-x-0 top-0 h-0.5 bg-cyan-400 animate-pulse pointer-events-none" />
                    </>
                  ) : (
                    selectedChar.name.charAt(0)
                  )}
                </div>
                <div>
                  <div className="text-[10px] font-mono-tech text-sky-400 uppercase tracking-widest flex items-center gap-1">
                    {selectedChar.imageUrl && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />}
                    <span>DOSSIER: {selectedChar.id.toUpperCase()}</span>
                  </div>
                  <h3 className="text-lg font-heading font-bold text-white leading-tight">
                    {selectedChar.name}
                  </h3>
                  <div className="text-xs text-slate-400 font-mono-tech mt-0.5">
                    Portrayed by {selectedChar.actor}
                  </div>
                </div>
              </div>

              {/* Open Dedicated Hero Page Button if featured */}
              {Boolean(selectedChar.imageUrl) && onOpenHeroPage && (
                <button
                  onClick={() => onOpenHeroPage(selectedChar.id)}
                  className="w-full mb-3 py-1.5 px-3 bg-sky-950 hover:bg-sky-900 border border-sky-500/60 rounded-lg text-xs font-mono-tech text-sky-200 flex items-center justify-center gap-1.5 transition-colors shadow"
                >
                  <Sparkles className="w-3.5 h-3.5 text-sky-400" />
                  <span>VIEW FULL HERO SHOWCASE PAGE →</span>
                </button>
              )}

              {/* Status Badges */}
              <div className="space-y-1.5 text-xs font-mono-tech">
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-500">TIMELINE ALIAS:</span>
                  <span className="text-sky-300 font-bold">{activeEvo.alias}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-500">CLEARANCE:</span>
                  <span className="text-amber-400 font-bold">LEVEL {activeEvo.clearanceLevel}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-500">STATUS:</span>
                  <span className="text-emerald-400 font-bold">{activeEvo.status}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">ALLEGIANCE:</span>
                  <span className="text-slate-300 truncate max-w-[170px]">{activeEvo.allegiance}</span>
                </div>
              </div>
            </div>

            {/* Hero Simulator Launch Button */}
            {selectedChar.heroSimulatorId && (
              <button
                onClick={() => {
                  onLaunchSimulator(selectedChar.heroSimulatorId!);
                  sound.playBeep(750, 0.08);
                }}
                className="w-full py-3 px-4 bg-gradient-to-r from-sky-600 to-cyan-600 hover:from-sky-500 hover:to-cyan-500 text-white font-mono-tech text-xs tracking-wider font-bold rounded-xl shadow-lg shadow-sky-600/30 flex items-center justify-center gap-2 transition-all transform active:scale-95"
              >
                {selectedChar.heroSimulatorId === 'quake' && <Activity className="w-4 h-4" />}
                {selectedChar.heroSimulatorId === 'coulson' && <Cpu className="w-4 h-4" />}
                {selectedChar.heroSimulatorId === 'may' && <Swords className="w-4 h-4" />}
                {selectedChar.heroSimulatorId === 'fitzsimmons' && <Bot className="w-4 h-4" />}
                {selectedChar.heroSimulatorId === 'mack' && <Wrench className="w-4 h-4" />}
                <span>LAUNCH HERO SIMULATOR</span>
              </button>
            )}

            {/* Voice Quote Player */}
            <div className="p-3 bg-slate-900/40 rounded-xl border border-slate-800">
              <div className="flex justify-between items-center text-xs font-mono-tech text-slate-400 mb-1.5">
                <span>CLASSIFIED AUDIO LOG:</span>
                <button
                  onClick={() => handlePlayVoice(selectedChar.audioClipText)}
                  className="p-1.5 hover:bg-sky-500/20 text-sky-400 rounded-lg transition-colors"
                  title="Play audio playback"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>
              <p className="text-xs text-sky-200/90 italic">
                "{selectedChar.audioClipText}"
              </p>
            </div>
          </div>

          {/* Right Column: Evolving Bio, Weaponry & Tactical Stats */}
          <div className="lg:col-span-8 space-y-4">
            {/* Current Timeline Title & Summary */}
            <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-800">
              <div className="flex justify-between items-center text-xs font-mono-tech mb-1.5">
                <span className="text-slate-400">ASSIGNMENT IN S0{activeEvo.season}:</span>
                <span className="text-sky-400 font-bold">{activeEvo.title}</span>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed">
                {activeEvo.summary}
              </p>
            </div>

            {/* Tactical Ratings Radar Bars */}
            <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-800">
              <div className="text-xs font-mono-tech text-slate-400 mb-3 flex items-center justify-between">
                <span>TACTICAL EVALUATION (S0{activeEvo.season} COMBAT LOG)</span>
                <span className="text-sky-400 font-bold">RADAR METRICS</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Combat */}
                <div>
                  <div className="flex justify-between text-xs font-mono-tech mb-1">
                    <span className="text-slate-400">COMBAT PROFICIENCY</span>
                    <span className="text-sky-300 font-bold">{activeEvo.combatRating}%</span>
                  </div>
                  <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                    <div className="h-full bg-gradient-to-r from-sky-500 to-cyan-400 transition-all duration-500" style={{ width: `${activeEvo.combatRating}%` }} />
                  </div>
                </div>

                {/* Intel */}
                <div>
                  <div className="flex justify-between text-xs font-mono-tech mb-1">
                    <span className="text-slate-400">TACTICAL INTEL & ESPIONAGE</span>
                    <span className="text-emerald-300 font-bold">{activeEvo.intelRating}%</span>
                  </div>
                  <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                    <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500" style={{ width: `${activeEvo.intelRating}%` }} />
                  </div>
                </div>

                {/* Tech */}
                <div>
                  <div className="flex justify-between text-xs font-mono-tech mb-1">
                    <span className="text-slate-400">SCI-TECH & ENGINEERING</span>
                    <span className="text-purple-300 font-bold">{activeEvo.techRating}%</span>
                  </div>
                  <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                    <div className="h-full bg-gradient-to-r from-purple-500 to-pink-400 transition-all duration-500" style={{ width: `${activeEvo.techRating}%` }} />
                  </div>
                </div>

                {/* Special Rating */}
                <div>
                  <div className="flex justify-between text-xs font-mono-tech mb-1">
                    <span className="text-slate-400 truncate max-w-[180px]">{activeEvo.specialLabel}</span>
                    <span className="text-amber-300 font-bold">{activeEvo.specialRating}%</span>
                  </div>
                  <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                    <div className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 transition-all duration-500" style={{ width: `${activeEvo.specialRating}%` }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Weapon & Field Notes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-3.5 bg-slate-900/60 rounded-xl border border-slate-800">
                <div className="text-[10px] font-mono-tech text-slate-500 uppercase mb-1">PRIMARY LOADOUT</div>
                <div className="text-xs font-bold text-sky-200">{activeEvo.primaryWeapon}</div>
              </div>

              <div className="p-3.5 bg-slate-900/60 rounded-xl border border-slate-800">
                <div className="text-[10px] font-mono-tech text-slate-500 uppercase mb-1">FIELD SUPERVISOR NOTES</div>
                <div className="text-xs text-slate-300">{activeEvo.tacticalNotes}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Activity Icon helper
const ActivityIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
  </svg>
);
