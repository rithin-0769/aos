import React, { useState } from 'react';
import { CharacterDossier, SeasonNumber, UserProfile } from '../types';
import { sound } from '../utils/audio';
import { QuakeSimulator } from './simulators/QuakeSimulator';
import { CoulsonSimulator } from './simulators/CoulsonSimulator';
import { MayCombatSimulator } from './simulators/MayCombatSimulator';
import { FitzSimmonsLab } from './simulators/FitzSimmonsLab';
import { ShotgunAxeSimulator } from './simulators/ShotgunAxeSimulator';
import {
  Shield,
  Volume2,
  Sparkles,
  Activity,
  Cpu,
  Award,
  Zap,
  Target,
  Clock,
  Layers,
  ArrowRight,
  UserCheck,
  Radio,
  Swords,
  Bot,
  Wrench,
  Flame,
  AlertTriangle
} from 'lucide-react';

interface CharacterShowcaseProps {
  characters: CharacterDossier[];
  currentSeason: SeasonNumber;
  userProfile: UserProfile;
  onUpdateProfile: (updated: Partial<UserProfile>) => void;
  onNavigateTab: (tab: 'timeline' | 'simulators' | 'moments' | 'clearance') => void;
}

export const CharacterShowcase: React.FC<CharacterShowcaseProps> = ({
  characters,
  currentSeason,
  userProfile,
  onUpdateProfile,
  onNavigateTab
}) => {
  // Select all characters that have uploaded portraits
  const featuredCharacters = characters.filter((c) => Boolean(c.imageUrl));

  const [activeHeroId, setActiveHeroId] = useState<string>('daisy-johnson');
  const [selectedSeasonArc, setSelectedSeasonArc] = useState<SeasonNumber>(currentSeason);

  const activeHero =
    featuredCharacters.find((c) => c.id === activeHeroId) || featuredCharacters[0] || characters[0];

  const currentEvo =
    activeHero.evolutions.find((e) => e.season === selectedSeasonArc) ||
    activeHero.evolutions[activeHero.evolutions.length - 1];

  const handleSelectHero = (id: string) => {
    setActiveHeroId(id);
    sound.playBeep(620, 0.08);
  };

  const handleSelectArc = (s: SeasonNumber) => {
    setSelectedSeasonArc(s);
    sound.playBeep(450 + s * 50, 0.05);
  };

  const handlePlayVoice = (text: string) => {
    sound.speakQuote(text);
    sound.playBeep(780, 0.06);
  };

  const handleSetBadgePhoto = () => {
    if (activeHero.imageUrl) {
      onUpdateProfile({ avatarUrl: activeHero.imageUrl });
      sound.playClearancePromotion();
    }
  };

  const isCurrentBadgePhoto = userProfile.avatarUrl === activeHero.imageUrl;

  // Watermark text helper
  const getWatermark = (id: string) => {
    switch (id) {
      case 'daisy-johnson': return 'QUAKE';
      case 'phil-coulson': return 'COULSON';
      case 'melinda-may': return 'CAVALRY';
      case 'leo-fitz': return 'FITZ';
      case 'jemma-simmons': return 'SIMMONS';
      case 'alphonso-mack': return 'MACK';
      case 'grant-ward': return 'HYDRA';
      default: return 'AGENT';
    }
  };

  // Border theme colors
  const getHeroThemeBorder = (id: string) => {
    switch (id) {
      case 'daisy-johnson': return 'from-cyan-500 to-sky-600';
      case 'phil-coulson': return 'from-sky-500 to-indigo-600';
      case 'melinda-may': return 'from-amber-500 to-red-600';
      case 'leo-fitz': return 'from-blue-500 to-purple-600';
      case 'jemma-simmons': return 'from-teal-400 to-emerald-600';
      case 'alphonso-mack': return 'from-amber-600 to-yellow-500';
      case 'grant-ward': return 'from-red-600 to-rose-900';
      default: return 'from-sky-500 to-cyan-500';
    }
  };

  return (
    <div className="space-y-6">
      {/* Hero Switcher Bar with All Uploaded Characters */}
      <div className="p-3 bg-slate-950/80 rounded-2xl border border-sky-800/40 backdrop-blur-md flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-sky-400" />
          <span className="font-heading font-bold text-sm tracking-wide text-white uppercase">
            S.H.I.E.L.D. HERO SPOTLIGHT // ACTIVE OPERATIVE ROSTER ({featuredCharacters.length})
          </span>
        </div>

        {/* Hero Selector Tabs */}
        <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800 overflow-x-auto max-w-full">
          {featuredCharacters.map((hero) => {
            const isSelected = hero.id === activeHeroId;
            return (
              <button
                key={hero.id}
                onClick={() => handleSelectHero(hero.id)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-mono-tech whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-sky-600 text-white font-bold shadow-md shadow-sky-600/40'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {hero.imageUrl && (
                  <img
                    src={hero.imageUrl}
                    alt={hero.name}
                    className="w-5 h-5 rounded-full object-cover border border-white/40 shrink-0"
                  />
                )}
                <span>{hero.name.split(' ')[0].toUpperCase()}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Cinematic Hero Spotlight Banner */}
      <div className="p-6 sm:p-8 rounded-3xl border border-sky-500/40 bg-gradient-to-br from-slate-950 via-slate-900 to-sky-950/40 backdrop-blur-lg relative overflow-hidden shadow-2xl">
        {/* Futuristic Background Watermark */}
        <div className="absolute top-0 right-0 p-8 text-9xl font-mono-tech font-black text-slate-800/20 select-none pointer-events-none">
          {getWatermark(activeHero.id)}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          {/* Left Column: Authentic Uploaded Portrait with Tactical HUD Frame */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <div className="relative group">
              {/* Outer Glow Halo */}
              <div
                className={`absolute -inset-1 rounded-3xl blur-xl opacity-60 transition-all duration-500 bg-gradient-to-r ${getHeroThemeBorder(activeHero.id)}`}
              />

              {/* Portrait Frame */}
              <div className="relative w-64 h-80 sm:w-72 sm:h-96 rounded-2xl overflow-hidden border-2 border-sky-400/80 bg-slate-950 shadow-2xl">
                {activeHero.imageUrl ? (
                  <img
                    src={activeHero.imageUrl}
                    alt={activeHero.name}
                    className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-600">
                    No image
                  </div>
                )}

                {/* Biometric HUD Corner Brackets */}
                <div className="absolute inset-2 pointer-events-none">
                  <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-cyan-400" />
                  <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-cyan-400" />
                  <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-cyan-400" />
                  <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-cyan-400" />
                </div>

                {/* Top Biometric Scanline Laser */}
                <div className="absolute inset-x-0 top-0 h-1.5 bg-cyan-400 shadow-[0_0_12px_#38bdf8] animate-pulse pointer-events-none" />

                {/* Floating Security Badge */}
                <div className="absolute bottom-3 inset-x-3 bg-slate-950/85 backdrop-blur-md p-2 rounded-xl border border-sky-500/40 text-center">
                  <div className="text-[10px] font-mono-tech text-sky-400 font-bold flex items-center justify-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    <span>AUTHENTICATED BIOMETRIC RECORD</span>
                  </div>
                  <div className="text-[9px] font-mono-tech text-slate-400">
                    S.H.I.E.L.D. TRISKELION DOSSIER ARCHIVE
                  </div>
                </div>
              </div>
            </div>

            {/* Set as ID Badge Action Button */}
            <div className="mt-4 flex gap-2">
              <button
                onClick={handleSetBadgePhoto}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono-tech transition-all ${
                  isCurrentBadgePhoto
                    ? 'bg-emerald-950/80 border border-emerald-500 text-emerald-300 font-bold shadow'
                    : 'bg-sky-600 hover:bg-sky-500 text-white font-bold shadow-lg shadow-sky-600/30'
                }`}
              >
                <UserCheck className="w-4 h-4" />
                <span>
                  {isCurrentBadgePhoto
                    ? 'CURRENT ID BADGE PHOTO'
                    : 'SET AS MY ID BADGE PHOTO'}
                </span>
              </button>
            </div>
          </div>

          {/* Right Column: Hero Details, Origin & Voice Player */}
          <div className="lg:col-span-7 space-y-4">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-mono-tech bg-sky-950 border border-sky-500/60 text-sky-300 font-bold">
                  {currentEvo.alias.toUpperCase()}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-mono-tech bg-amber-950 border border-amber-500/60 text-amber-300 font-bold">
                  CLEARANCE LEVEL 0{currentEvo.clearanceLevel}
                </span>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-mono-tech border ${
                  activeHero.id === 'grant-ward'
                    ? 'bg-red-950 border-red-500/60 text-red-300'
                    : 'bg-emerald-950 border-emerald-500/60 text-emerald-300'
                }`}>
                  {currentEvo.status}
                </span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-heading font-black text-white tracking-wide">
                {activeHero.name}
              </h2>
              <div className="text-sm font-mono-tech text-sky-400 mt-1">
                Portrayed by <strong className="text-white">{activeHero.actor}</strong> | {activeHero.origin}
              </div>
            </div>

            {/* Voice Quote Transmission Player */}
            <div className="p-4 bg-slate-900/80 rounded-2xl border border-sky-800/60 shadow-lg">
              <div className="flex items-center justify-between text-xs font-mono-tech text-slate-400 mb-1.5">
                <span className="flex items-center gap-1.5 text-sky-400 font-bold">
                  <Radio className="w-3.5 h-3.5" />
                  <span>AUTHENTIC TRANSMISSION LOG</span>
                </span>
                <button
                  onClick={() => handlePlayVoice(activeHero.audioClipText)}
                  className="flex items-center gap-1 px-2.5 py-1 bg-sky-600 hover:bg-sky-500 text-white rounded text-[11px] font-mono-tech font-bold transition-colors"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>PLAY VOICE AUDIO</span>
                </button>
              </div>
              <blockquote className="text-sm sm:text-base font-heading italic text-sky-100">
                "{activeHero.audioClipText}"
              </blockquote>
            </div>

            {/* Tactical Ratings Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800">
                <div className="text-[10px] font-mono-tech text-slate-400">COMBAT EFFICIENCY</div>
                <div className="text-xl font-heading font-bold text-sky-400">{currentEvo.combatRating}%</div>
                <div className="w-full bg-slate-950 h-1.5 rounded-full mt-1 overflow-hidden">
                  <div className="h-full bg-sky-400" style={{ width: `${currentEvo.combatRating}%` }} />
                </div>
              </div>

              <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800">
                <div className="text-[10px] font-mono-tech text-slate-400">TACTICAL INTEL</div>
                <div className="text-xl font-heading font-bold text-emerald-400">{currentEvo.intelRating}%</div>
                <div className="w-full bg-slate-950 h-1.5 rounded-full mt-1 overflow-hidden">
                  <div className="h-full bg-emerald-400" style={{ width: `${currentEvo.intelRating}%` }} />
                </div>
              </div>

              <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800">
                <div className="text-[10px] font-mono-tech text-slate-400">SCI-TECH PROFICIENCY</div>
                <div className="text-xl font-heading font-bold text-purple-400">{currentEvo.techRating}%</div>
                <div className="w-full bg-slate-950 h-1.5 rounded-full mt-1 overflow-hidden">
                  <div className="h-full bg-purple-400" style={{ width: `${currentEvo.techRating}%` }} />
                </div>
              </div>

              <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800">
                <div className="text-[10px] font-mono-tech text-slate-400 truncate">{currentEvo.specialLabel}</div>
                <div className="text-xl font-heading font-bold text-amber-400">{currentEvo.specialRating}%</div>
                <div className="w-full bg-slate-950 h-1.5 rounded-full mt-1 overflow-hidden">
                  <div className="h-full bg-amber-400" style={{ width: `${currentEvo.specialRating}%` }} />
                </div>
              </div>
            </div>

            {/* Primary Weapon & Operational Duty */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800">
                <div className="text-[10px] font-mono-tech text-slate-500 uppercase">WEAPON LOADOUT</div>
                <div className="font-bold text-sky-200 mt-0.5">{currentEvo.primaryWeapon}</div>
              </div>
              <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800">
                <div className="text-[10px] font-mono-tech text-slate-500 uppercase">CURRENT S0{currentEvo.season} ROLE</div>
                <div className="font-bold text-sky-200 mt-0.5">{currentEvo.title}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Season Transformation Arc */}
      <div className="p-6 rounded-3xl border border-sky-800/40 bg-slate-950/80 backdrop-blur-md">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
          <div>
            <h3 className="text-lg font-heading font-bold text-white uppercase flex items-center gap-2">
              <Clock className="w-5 h-5 text-sky-400" />
              <span>TIMELINE TRANSFORMATION ARC (SEASONS 1 - 7)</span>
            </h3>
            <p className="text-xs text-slate-400 font-mono-tech">
              Click any season to examine their tactical growth, trauma, and equipment upgrades.
            </p>
          </div>
        </div>

        {/* Season Transformation Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {activeHero.evolutions.map((evo) => {
            const isSelected = selectedSeasonArc === evo.season;
            return (
              <div
                key={evo.season}
                onClick={() => handleSelectArc(evo.season)}
                className={`p-4 rounded-2xl border cursor-pointer transition-all duration-300 relative ${
                  isSelected
                    ? 'bg-sky-950/80 border-sky-400 shadow-lg shadow-sky-950/80 scale-[1.02]'
                    : 'bg-slate-900/40 border-slate-800 hover:border-slate-700 hover:bg-slate-900/60'
                }`}
              >
                <div className="flex items-center justify-between text-xs font-mono-tech mb-1.5">
                  <span className="font-bold text-sky-400">SEASON 0{evo.season}</span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] bg-slate-950 border border-slate-800 text-slate-400">
                    LVL {evo.clearanceLevel}
                  </span>
                </div>

                <div className="font-heading font-bold text-sm text-white mb-1">
                  {evo.alias}
                </div>

                <div className="text-[11px] font-mono-tech text-amber-300/90 mb-2 truncate">
                  {evo.title}
                </div>

                <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                  {evo.summary}
                </p>

                {isSelected && (
                  <div className="mt-3 pt-2 border-t border-sky-500/40 flex items-center justify-between text-[10px] font-mono-tech text-sky-300">
                    <span>ACTIVE INSPECTION</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Embedded Hero Power / Hardware Simulator Matching Each Character */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm font-heading font-bold text-white uppercase px-1">
          <Zap className="w-4 h-4 text-sky-400" />
          <span>IN-FIELD TACTICAL HARDWARE & POWER SUITE</span>
        </div>

        {activeHero.id === 'daisy-johnson' && <QuakeSimulator />}
        {activeHero.id === 'phil-coulson' && <CoulsonSimulator />}
        {activeHero.id === 'melinda-may' && <MayCombatSimulator />}
        {(activeHero.id === 'leo-fitz' || activeHero.id === 'jemma-simmons') && (
          <FitzSimmonsLab foundEasterEggs={userProfile.foundEasterEggs} />
        )}
        {activeHero.id === 'alphonso-mack' && <ShotgunAxeSimulator />}
        {activeHero.id === 'grant-ward' && (
          <div className="p-6 bg-slate-950 rounded-2xl border border-red-900/50 text-xs font-mono-tech space-y-3">
            <div className="flex items-center gap-2 text-red-400 font-bold text-sm">
              <AlertTriangle className="w-5 h-5" />
              <span>HYDRA DEEP-COVER SLEEPER PROTOCOL // RESTRICTED ACCESS</span>
            </div>
            <p className="text-slate-300 leading-relaxed">
              Agent Grant Ward was trained as an elite Level 7 Black Ops Specialist by John Garrett. Scored the highest combat scores at S.H.I.E.L.D. Academy since Natasha Romanoff. After Garrett's fall, he reformed Hydra and was ultimately killed by Coulson on Maveth, where his corpse was inhabited by the ancient Inhuman god Hive.
            </p>
            <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 text-slate-400">
              <strong className="text-red-400">SPECIALIST ABILITIES:</strong> Sniper marksmanship, close quarters lethality, counter-interrogation resistance, and cellular Hive spores.
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
