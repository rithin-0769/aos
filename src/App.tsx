import React, { useState, useEffect, useRef } from 'react';
import { SEASONS_DATA } from './data/timelineData';
import { CHARACTERS_DATA } from './data/characters';
import { MOMENTS_DATA, EASTER_EGGS_DATA } from './data/momentsData';
import { TRIVIA_QUESTIONS } from './data/triviaData';
import { SeasonNumber, UserProfile, EasterEggItem } from './types';
import { sound } from './utils/audio';
import { safeSaveToLocalStorage } from './utils/imageUtils';

// Components
import { TimelineSlider } from './components/TimelineSlider';
import { DossierViewer } from './components/DossierViewer';
import { MomentsHub } from './components/MomentsHub';
import { ClearanceSystem } from './components/ClearanceSystem';
import { QuakeSimulator } from './components/simulators/QuakeSimulator';
import { CoulsonSimulator } from './components/simulators/CoulsonSimulator';
import { MayCombatSimulator } from './components/simulators/MayCombatSimulator';
import { FitzSimmonsLab } from './components/simulators/FitzSimmonsLab';
import { ShotgunAxeSimulator } from './components/simulators/ShotgunAxeSimulator';
import { YoYoSimulator } from './components/simulators/YoYoSimulator';
import { GhostRiderSimulator } from './components/simulators/GhostRiderSimulator';
import { BobbiCombatSimulator } from './components/simulators/BobbiCombatSimulator';
import { DekeSynthSimulator } from './components/simulators/DekeSynthSimulator';
import { EnochTimeLoopSimulator } from './components/simulators/EnochTimeLoopSimulator';

import { CharacterShowcase } from './components/CharacterShowcase';
import { ZephyrWorldMap } from './components/ZephyrWorldMap';
import { StrikeTeamBattle } from './components/StrikeTeamBattle';
import { ArtifactArchive } from './components/ArtifactArchive';
import { FrameworkOverlay } from './components/FrameworkOverlay';
// Game components
import { KoenigLieDetector } from './components/games/KoenigLieDetector';
import { LolaSkyDodger } from './components/games/LolaSkyDodger';
import { TerrigenAwakening } from './components/games/TerrigenAwakening';
import { RisingTideHack } from './components/games/RisingTideHack';
import { LMDDetection } from './components/games/LMDDetection';
import { KitsonCasino } from './components/games/KitsonCasino';
import { ZephyrTimeJump } from './components/games/ZephyrTimeJump';

// Icons
import {
  Shield,
  Activity,
  Award,
  MessageSquareQuote,
  Cpu,
  Volume2,
  VolumeX,
  Swords,
  Bot,
  Wrench,
  Radio,
  Clock,
  Sparkles,
  Info,
  UserCheck,
  Globe,
  Flame,
  Music,
  BookOpen,
  Terminal,
  Zap,
  Gamepad2,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

export const App: React.FC = () => {
  // Navigation & Timeline State
  const [activeTab, setActiveTab] = useState<
    'showcase' | 'timeline' | 'simulators' | 'moments' | 'clearance' | 'worldmap' | 'battles' | 'artifacts' |
    'koenig' | 'lola' | 'terrigen' | 'hack' | 'lmd' | 'kitson' | 'zephyr'
  >('showcase');
  const [lastGameTab, setLastGameTab] = useState<
    'koenig' | 'lola' | 'terrigen' | 'hack' | 'lmd' | 'kitson' | 'zephyr'
  >('koenig');
  const [showGameMenu, setShowGameMenu] = useState<boolean>(false);

  const isGameTab = ['koenig', 'lola', 'terrigen', 'hack', 'lmd', 'kitson', 'zephyr'].includes(activeTab);
  const gameMenuRef = useRef<HTMLDivElement>(null);

  // Close classified game popover on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent | TouchEvent) => {
      if (showGameMenu && gameMenuRef.current && !gameMenuRef.current.contains(e.target as Node)) {
        setShowGameMenu(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('touchstart', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('touchstart', handleOutsideClick);
    };
  }, [showGameMenu]);

  const handleSelectGame = (game: typeof lastGameTab) => {
    setLastGameTab(game);
    setActiveTab(game);
    setShowGameMenu(false);
    sound.playBeep(480, 0.04);
  };
  const [isFrameworkMode, setIsFrameworkMode] = useState<boolean>(false);
  const [currentSeason, setCurrentSeason] = useState<SeasonNumber>(1);
  const [selectedHeroForShowcase, setSelectedHeroForShowcase] = useState<string>('daisy-johnson');
  const [activeSim, setActiveSim] = useState<
    'quake' | 'coulson' | 'may' | 'fitzsimmons' | 'mack' | 'yoyo' | 'ghostrider' | 'bobbi' | 'deke' | 'enoch'
  >('quake');
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [easterEggs, setEasterEggs] = useState<EasterEggItem[]>(EASTER_EGGS_DATA);
  const [recentEggNotice, setRecentEggNotice] = useState<string | null>(null);

  // User Profile & Gamification
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('shield_user_profile');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return {
      agentName: 'Rithin Ravoori',
      callSign: 'VANGUARD',
      division: 'Ops',
      clearanceLevel: 1,
      xp: 0,
      foundEasterEggs: [],
      completedTrivia: [],
      spoilerSafeMode: true
    };
  });

  // Save profile to localStorage safely (guards against QuotaExceededError from large photos)
  useEffect(() => {
    safeSaveToLocalStorage('shield_user_profile', userProfile);
  }, [userProfile]);

  // Ensure any ambient loops are shut down
  useEffect(() => {
    sound.stopAmbient();
  }, []);

  const activeSeasonData = SEASONS_DATA.find((s) => s.number === currentSeason) || SEASONS_DATA[0];

  const handleToggleMute = () => {
    const next = sound.toggleMute();
    setIsMuted(next);
  };

  const handleFindEasterEgg = (eggId: string) => {
    if (userProfile.foundEasterEggs.includes(eggId)) return;

    const egg = easterEggs.find((e) => e.id === eggId);
    if (!egg) return;

    sound.playClearancePromotion();
    const updatedFound = [...userProfile.foundEasterEggs, eggId];
    const newXp = userProfile.xp + egg.clearanceBonus;
    const newLevel = Math.min(10, Math.floor(newXp / 60) + 1);

    setUserProfile((prev) => ({
      ...prev,
      foundEasterEggs: updatedFound,
      xp: newXp,
      clearanceLevel: newLevel
    }));

    setRecentEggNotice(`EASTER EGG FOUND: ${egg.name} (+${egg.clearanceBonus} XP)`);
    setTimeout(() => setRecentEggNotice(null), 4000);
  };

  const handleUpdateProfile = (updated: Partial<UserProfile>) => {
    setUserProfile((prev) => ({ ...prev, ...updated }));
  };

  const handleLaunchSimulator = (simId: string) => {
    setActiveSim(simId as typeof activeSim);
    setActiveTab('simulators');
    sound.playBeep(700, 0.06);
  };

  const handleAwardXp = (amount: number, reason: string) => {
    setUserProfile((prev) => {
      const nextXp = prev.xp + amount;
      const nextLevel = Math.min(10, Math.floor(nextXp / 60) + 1);
      return {
        ...prev,
        xp: nextXp,
        clearanceLevel: nextLevel
      };
    });
    setRecentEggNotice(`${reason} (+${amount} XP)`);
    setTimeout(() => setRecentEggNotice(null), 4000);
  };

  // Determine dynamic body styles based on season
  const getThemeClass = () => {
    if (currentSeason === 2) return 'theme-hydra';
    if (currentSeason === 4) return 'theme-framework';
    if (currentSeason === 5) return 'theme-kree';
    if (currentSeason === 7) return 'theme-retro';
    return 'theme-shield';
  };

  return (
    <div
      className={`min-h-screen text-slate-100 flex flex-col transition-colors duration-700 ${getThemeClass()}`}
      style={{
        backgroundColor: activeSeasonData.themeColors.background
      }}
    >
      {/* Top Tactical Command Header */}
      <header className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-3">
          {/* Logo & Operational Status */}
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg border transition-all duration-500"
              style={{
                backgroundColor: activeSeasonData.themeColors.badgeBg,
                borderColor: activeSeasonData.themeColors.primary,
                color: activeSeasonData.themeColors.primary
              }}
            >
              <Shield className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-heading font-black text-lg tracking-wider text-white">
                  S.H.I.E.L.D. PROTOCOL
                </h1>
                <span
                  className="px-2 py-0.5 rounded text-[10px] font-mono-tech font-bold uppercase transition-colors"
                  style={{
                    backgroundColor: activeSeasonData.themeColors.badgeBg,
                    color: activeSeasonData.themeColors.accent,
                    border: `1px solid ${activeSeasonData.themeColors.primary}40`
                  }}
                >
                  S0{currentSeason} // {activeSeasonData.codename}
                </span>
              </div>
              <p className="text-[11px] font-mono-tech text-slate-400">
                STRATEGIC HOMELAND INTERVENTION ENFORCEMENT & LOGISTICS DIVISION
              </p>
            </div>
          </div>

          {/* Quick Metrics & Sound Toggle */}
          <div className="flex items-center gap-2 sm:gap-3 text-xs font-mono-tech">
            {/* Quick Era Switcher Bar accessible across all tabs */}
            <div className="flex items-center gap-0.5 bg-slate-900/90 p-1 rounded-lg border border-slate-700/80">
              <span className="text-slate-400 text-[10px] px-1 hidden md:inline font-bold">ERA:</span>
              {([1, 2, 3, 4, 5, 6, 7] as SeasonNumber[]).map((s) => (
                <button
                  key={s}
                  onClick={() => {
                    setCurrentSeason(s);
                    if (s === 4) sound.playGlitch();
                    else sound.playBeep(320 + s * 70, 0.05);
                  }}
                  className={`px-2 py-1 rounded text-[11px] font-bold transition-all ${
                    currentSeason === s
                      ? 'bg-sky-600 text-white shadow-md shadow-sky-600/40 scale-105'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                  title={`Jump timeline to Season 0${s}`}
                >
                  S0{s}
                </button>
              ))}
            </div>

            {/* Framework Override Switcher */}
            <button
              onClick={() => {
                sound.playGlitch();
                setIsFrameworkMode(true);
              }}
              className="px-2.5 py-1.5 rounded-lg text-xs font-mono-tech font-bold bg-emerald-950/90 hover:bg-emerald-900 border border-emerald-500 text-emerald-300 transition-all flex items-center gap-1.5 shadow-[0_0_12px_rgba(16,185,129,0.3)] animate-pulse"
              title="Enter Madame Hydra's Framework Simulation"
            >
              <span className="text-sm">🐙</span>
              <span className="hidden sm:inline">FRAMEWORK</span>
            </button>

            {/* Clearance Pill */}
            <button
              onClick={() => {
                setActiveTab('clearance');
                sound.playBeep(620, 0.05);
              }}
              className="cursor-pointer bg-slate-900 hover:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700 hover:border-sky-400 flex items-center gap-2 transition-all shadow-sm select-none"
              title="Inspect Clearance Profile, Custom ID Badge & Academy Exams"
            >
              <span className="text-slate-400 hidden sm:inline">CLEARANCE:</span>
              <span className={`font-bold ${userProfile.clearanceLevel >= 7 ? 'text-amber-400' : 'text-sky-400'}`}>
                {userProfile.clearanceLevel >= 7 ? 'DIRECTOR' : `L0${userProfile.clearanceLevel}`}
              </span>
            </button>

            {/* Audio Mute/Unmute */}
            <button
              onClick={handleToggleMute}
              className="p-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 hover:text-white transition-colors"
              title={isMuted ? 'Unmute tactical audio' : 'Mute tactical audio'}
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-sky-400" />}
            </button>
          </div>
        </div>

        {/* Global Navigation Bar */}
        <nav className="max-w-7xl mx-auto px-4 flex gap-1 sm:gap-2 overflow-x-auto pb-2 scrollbar-none text-xs font-mono-tech">
          <button
            onClick={() => { setActiveTab('showcase'); sound.playBeep(480, 0.04); }}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg whitespace-nowrap transition-all ${
              activeTab === 'showcase'
                ? 'bg-gradient-to-r from-sky-600 to-indigo-600 text-white font-bold shadow-lg shadow-sky-600/30 ring-1 ring-sky-300'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>HERO SPOTLIGHT</span>
          </button>

          <button
            onClick={() => { setActiveTab('worldmap'); sound.playBeep(480, 0.04); }}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg whitespace-nowrap transition-all ${
              activeTab === 'worldmap'
                ? 'bg-gradient-to-r from-cyan-600 to-teal-600 text-white font-bold shadow-lg shadow-cyan-600/30 ring-1 ring-cyan-300'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Globe className="w-4 h-4 text-cyan-300" />
            <span>WORLD RADAR</span>
          </button>

          <button
            onClick={() => { setActiveTab('battles'); sound.playBeep(480, 0.04); }}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg whitespace-nowrap transition-all ${
              activeTab === 'battles'
                ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white font-bold shadow-lg shadow-red-600/30 ring-1 ring-rose-300'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Swords className="w-4 h-4 text-rose-300" />
            <span>STRIKE ARENA</span>
          </button>

          <button
            onClick={() => { setActiveTab('artifacts'); sound.playBeep(480, 0.04); }}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg whitespace-nowrap transition-all ${
              activeTab === 'artifacts'
                ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white font-bold shadow-lg shadow-amber-600/30 ring-1 ring-amber-300'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <BookOpen className="w-4 h-4 text-amber-300" />
            <span>0-8-4 ARTIFACTS</span>
          </button>

          <button
            onClick={() => { setActiveTab('timeline'); sound.playBeep(480, 0.04); }}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg whitespace-nowrap transition-all ${
              activeTab === 'timeline'
                ? 'bg-gradient-to-r from-blue-600 to-sky-600 text-white font-bold shadow-lg shadow-blue-600/30 ring-1 ring-sky-300'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Radio className="w-4 h-4" />
            <span>TIMELINE</span>
          </button>

          <button
            onClick={() => { setActiveTab('simulators'); sound.playBeep(480, 0.04); }}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg whitespace-nowrap transition-all ${
              activeTab === 'simulators'
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold shadow-lg shadow-indigo-600/30 ring-1 ring-indigo-300'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>SIMULATORS</span>
          </button>

          <button
            onClick={() => { setActiveTab('moments'); sound.playBeep(480, 0.04); }}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg whitespace-nowrap transition-all ${
              activeTab === 'moments'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold shadow-lg shadow-emerald-600/30 ring-1 ring-emerald-300'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <MessageSquareQuote className="w-4 h-4" />
            <span>FAN MOMENTS</span>
          </button>

          <button
            onClick={() => { setActiveTab('clearance'); sound.playBeep(480, 0.04); }}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg whitespace-nowrap transition-all ${
              activeTab === 'clearance'
                ? 'bg-gradient-to-r from-sky-600 to-cyan-600 text-white font-bold shadow-lg shadow-sky-600/30 ring-1 ring-sky-300'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>ID BADGE & EXAM</span>
          </button>
          {/* Visual Divider */}
          <div className="h-6 w-px bg-slate-800 mx-1 self-center shrink-0 hidden sm:block" />

          {/* Classified Games Hub Tab with Quick Mission Dropdown */}
          <div ref={gameMenuRef} className="relative flex items-center">
            <button
              onClick={() => handleSelectGame(lastGameTab)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg whitespace-nowrap transition-all ${
                isGameTab
                  ? 'bg-gradient-to-r from-amber-600 to-yellow-600 text-slate-950 font-bold shadow-md shadow-amber-600/30 ring-1 ring-amber-300'
                  : 'text-amber-400 hover:text-amber-300 hover:bg-slate-900'
              }`}
            >
              <Gamepad2 className="w-4 h-4" />
              <span>CLASSIFIED GAMES</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[9px] font-bold ${
                isGameTab ? 'bg-slate-950 text-amber-300' : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
              }`}>
                7
              </span>
            </button>

            <button
              onClick={() => setShowGameMenu(prev => !prev)}
              className={`p-1.5 ml-1 rounded-lg border transition-all ${
                showGameMenu
                  ? 'bg-amber-500 text-slate-950 border-amber-400'
                  : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-white'
              }`}
              title="Quick select mission"
            >
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${showGameMenu ? 'rotate-180' : ''}`} />
            </button>

            {/* Quick Game Selector Popover */}
            {showGameMenu && (
              <div className="absolute top-full right-0 mt-2 w-64 bg-slate-950/95 border border-amber-500/40 rounded-2xl p-2 shadow-2xl backdrop-blur-xl z-50 space-y-1 animate-scale-up">
                <div className="px-2 py-1 text-[10px] text-amber-400 font-bold uppercase tracking-wider border-b border-slate-800 mb-1 flex items-center justify-between">
                  <span>SEASON MISSIONS</span>
                  <span className="text-[9px] text-slate-500">7 GAMES</span>
                </div>
                {[
                  { id: 'koenig' as const, name: 'Koenig Lie Detector', season: 'S01', icon: Zap, color: 'text-yellow-400' },
                  { id: 'lola' as const, name: 'LOLA Sky Dodger', season: 'S01', icon: Activity, color: 'text-pink-400' },
                  { id: 'hack' as const, name: 'Rising Tide Hack', season: 'S01', icon: Terminal, color: 'text-emerald-400' },
                  { id: 'terrigen' as const, name: 'Terrigen Awakening', season: 'S02', icon: Shield, color: 'text-indigo-400' },
                  { id: 'lmd' as const, name: 'LMD Lockdown', season: 'S04', icon: Bot, color: 'text-cyan-400' },
                  { id: 'kitson' as const, name: 'Kitson Alien Casino', season: 'S06', icon: Sparkles, color: 'text-red-400' },
                  { id: 'zephyr' as const, name: 'Zephyr Time Jump', season: 'S07', icon: Clock, color: 'text-teal-400' },
                ].map(g => {
                  const Icon = g.icon;
                  const isCur = activeTab === g.id;
                  return (
                    <button
                      key={g.id}
                      onClick={() => handleSelectGame(g.id)}
                      className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-left text-xs transition-all ${
                        isCur
                          ? 'bg-amber-500/20 text-white font-bold border border-amber-400/50'
                          : 'text-slate-300 hover:bg-slate-900 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Icon className={`w-3.5 h-3.5 ${g.color}`} />
                        <span>{g.name}</span>
                      </div>
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-900 text-slate-400 font-bold">
                        {g.season}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </nav>
      </header>

      {/* Easter Egg Notification Toast */}
      {recentEggNotice && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-slate-950 font-bold font-mono-tech text-xs shadow-2xl flex items-center gap-3 border-2 border-amber-200 shadow-amber-500/30">
          <Sparkles className="w-5 h-5 text-slate-950 shrink-0 animate-spin" style={{ animationDuration: '6s' }} />
          <span>{recentEggNotice}</span>
          <button
            onClick={() => setRecentEggNotice(null)}
            className="ml-2 text-slate-900 hover:text-black font-black text-xs px-1.5 py-0.5 rounded hover:bg-amber-600/20"
            title="Dismiss notification"
          >
            ✕
          </button>
        </div>
      )}

      {/* Main App Workspace */}
      <main className="max-w-7xl mx-auto px-4 py-6 flex-1 w-full space-y-6">
        {/* Tab: Hero Spotlight (Dedicated Character Showcase built around uploaded images) */}
        {activeTab === 'showcase' && (
          <CharacterShowcase
            characters={CHARACTERS_DATA}
            currentSeason={currentSeason}
            userProfile={userProfile}
            onUpdateProfile={handleUpdateProfile}
            onNavigateTab={(tab) => setActiveTab(tab)}
            onSeasonChange={(s) => setCurrentSeason(s)}
            initialHeroId={selectedHeroForShowcase}
          />
        )}

        {/* Tab 1: Timeline & Character Dossiers */}
        {activeTab === 'timeline' && (
          <div className="space-y-6">
            <TimelineSlider
              seasons={SEASONS_DATA}
              currentSeason={currentSeason}
              onSeasonChange={(s) => setCurrentSeason(s)}
              spoilerSafeMode={userProfile.spoilerSafeMode}
              onToggleSpoilerSafe={() =>
                handleUpdateProfile({ spoilerSafeMode: !userProfile.spoilerSafeMode })
              }
              onFindEasterEgg={handleFindEasterEgg}
              foundEasterEggs={userProfile.foundEasterEggs}
            />

            <DossierViewer
              characters={CHARACTERS_DATA}
              currentSeason={currentSeason}
              spoilerSafeMode={userProfile.spoilerSafeMode}
              onLaunchSimulator={handleLaunchSimulator}
              onOpenHeroPage={(heroId) => {
                setSelectedHeroForShowcase(heroId);
                setActiveTab('showcase');
                sound.playBeep(700, 0.06);
              }}
              onToggleSpoilerSafe={() =>
                handleUpdateProfile({ spoilerSafeMode: !userProfile.spoilerSafeMode })
              }
              onSeasonChange={(s) => setCurrentSeason(s)}
            />
          </div>
        )}

        {/* Tab 2: Interactive Hero Simulators */}
        {activeTab === 'simulators' && (
          <div className="space-y-4">
            {/* Simulator Sub-Nav */}
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none text-xs font-mono-tech">
              <button
                onClick={() => { setActiveSim('quake'); sound.playBeep(500, 0.05); }}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg border whitespace-nowrap transition-all ${
                  activeSim === 'quake'
                    ? 'bg-sky-950 border-sky-400 text-sky-200 font-bold shadow'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <Activity className="w-4 h-4 text-sky-400" />
                <span>QUAKE</span>
              </button>

              <button
                onClick={() => { setActiveSim('coulson'); sound.playBeep(500, 0.05); }}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg border whitespace-nowrap transition-all ${
                  activeSim === 'coulson'
                    ? 'bg-sky-950 border-sky-400 text-sky-200 font-bold shadow'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <Cpu className="w-4 h-4 text-sky-400" />
                <span>COULSON</span>
              </button>

              <button
                onClick={() => { setActiveSim('may'); sound.playBeep(500, 0.05); }}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg border whitespace-nowrap transition-all ${
                  activeSim === 'may'
                    ? 'bg-sky-950 border-sky-400 text-sky-200 font-bold shadow'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <Swords className="w-4 h-4 text-sky-400" />
                <span>MAY</span>
              </button>

              <button
                onClick={() => { setActiveSim('fitzsimmons'); sound.playBeep(500, 0.05); }}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg border whitespace-nowrap transition-all ${
                  activeSim === 'fitzsimmons'
                    ? 'bg-sky-950 border-sky-400 text-sky-200 font-bold shadow'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <Bot className="w-4 h-4 text-cyan-400" />
                <span>FITZSIMMONS</span>
              </button>

              <button
                onClick={() => { setActiveSim('mack'); sound.playBeep(500, 0.05); }}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg border whitespace-nowrap transition-all ${
                  activeSim === 'mack'
                    ? 'bg-amber-950 border-amber-400 text-amber-200 font-bold shadow'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <Wrench className="w-4 h-4 text-amber-400" />
                <span>MACK</span>
              </button>

              <button
                onClick={() => { setActiveSim('yoyo'); sound.playBeep(500, 0.05); }}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg border whitespace-nowrap transition-all ${
                  activeSim === 'yoyo'
                    ? 'bg-amber-950 border-amber-400 text-amber-200 font-bold shadow'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <Zap className="w-4 h-4 text-amber-400" />
                <span>YO-YO</span>
              </button>

              <button
                onClick={() => { setActiveSim('ghostrider'); sound.playBeep(500, 0.05); }}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg border whitespace-nowrap transition-all ${
                  activeSim === 'ghostrider'
                    ? 'bg-red-950 border-red-400 text-red-200 font-bold shadow'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <Flame className="w-4 h-4 text-red-400" />
                <span>GHOST RIDER</span>
              </button>

              <button
                onClick={() => { setActiveSim('bobbi'); sound.playBeep(500, 0.05); }}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg border whitespace-nowrap transition-all ${
                  activeSim === 'bobbi'
                    ? 'bg-sky-950 border-sky-400 text-sky-200 font-bold shadow'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <Swords className="w-4 h-4 text-cyan-400" />
                <span>BOBBI</span>
              </button>

              <button
                onClick={() => { setActiveSim('deke'); sound.playBeep(500, 0.05); }}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg border whitespace-nowrap transition-all ${
                  activeSim === 'deke'
                    ? 'bg-purple-950 border-purple-400 text-purple-200 font-bold shadow'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <Music className="w-4 h-4 text-purple-400" />
                <span>DEKE SHAW</span>
              </button>

              <button
                onClick={() => { setActiveSim('enoch'); sound.playBeep(500, 0.05); }}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg border whitespace-nowrap transition-all ${
                  activeSim === 'enoch'
                    ? 'bg-amber-950 border-amber-400 text-amber-200 font-bold shadow'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <Sparkles className="w-4 h-4 text-yellow-400" />
                <span>ENOCH</span>
              </button>
            </div>

            {/* Active Simulator Component */}
            {activeSim === 'quake' && <QuakeSimulator />}
            {activeSim === 'coulson' && <CoulsonSimulator />}
            {activeSim === 'may' && <MayCombatSimulator />}
            {activeSim === 'fitzsimmons' && (
              <FitzSimmonsLab
                onFindEasterEgg={handleFindEasterEgg}
                foundEasterEggs={userProfile.foundEasterEggs}
              />
            )}
            {activeSim === 'mack' && <ShotgunAxeSimulator />}
            {activeSim === 'yoyo' && <YoYoSimulator />}
            {activeSim === 'ghostrider' && <GhostRiderSimulator />}
            {activeSim === 'bobbi' && <BobbiCombatSimulator />}
            {activeSim === 'deke' && <DekeSynthSimulator />}
            {activeSim === 'enoch' && <EnochTimeLoopSimulator />}
          </div>
        )}

        {/* Tab: World Map & 0-8-4 Threat Radar */}
        {activeTab === 'worldmap' && (
          <ZephyrWorldMap onAwardXp={handleAwardXp} />
        )}

        {/* Tab: Strike Team Squad Builder & Battle Arena */}
        {activeTab === 'battles' && (
          <StrikeTeamBattle
            characters={CHARACTERS_DATA}
            onAwardXp={handleAwardXp}
          />
        )}

        {/* Tab: Classified 0-8-4 Artifact Vault */}
        {activeTab === 'artifacts' && (
          <ArtifactArchive />
        )}

        {/* Tab 3: Iconic Fan Moments Hub */}
        {activeTab === 'moments' && (
          <MomentsHub
            moments={MOMENTS_DATA}
            currentSeason={currentSeason}
            spoilerSafeMode={userProfile.spoilerSafeMode}
            onFindEasterEgg={handleFindEasterEgg}
            foundEasterEggs={userProfile.foundEasterEggs}
          />
        )}

        {/* Tab 4: Clearance Levels & S.H.I.E.L.D. Academy */}
        {activeTab === 'clearance' && (
          <ClearanceSystem
            userProfile={userProfile}
            onUpdateProfile={handleUpdateProfile}
            triviaQuestions={TRIVIA_QUESTIONS}
            easterEggs={easterEggs}
            onFindEasterEgg={handleFindEasterEgg}
          />
        )}

        {/* Classified Season Mini-Games (S01 - S07) */}
        {['koenig', 'lola', 'terrigen', 'hack', 'lmd', 'kitson', 'zephyr'].includes(activeTab) && (
          <div className="space-y-4">
            {/* Season-ordered Games Quick Switcher Subnav */}
            <div className="bg-slate-900/80 border border-slate-800 p-2.5 rounded-2xl backdrop-blur-md">
              <div className="flex items-center justify-between mb-2 px-1">
                <span className="text-[11px] font-mono-tech text-amber-400 font-bold flex items-center gap-1.5 uppercase tracking-wider">
                  <Gamepad2 className="w-3.5 h-3.5" />
                  CLASSIFIED RECON MISSIONS // SEASON-ORDERED GAMES
                </span>
                <span className="text-[10px] font-mono-tech text-slate-500 hidden sm:inline">
                  COMPLETE FOR CLEARANCE XP
                </span>
              </div>
              <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none text-xs font-mono-tech">
                <button
                  onClick={() => handleSelectGame('koenig')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border whitespace-nowrap transition-all ${
                    activeTab === 'koenig'
                      ? 'bg-yellow-500/20 border-yellow-400 text-yellow-200 font-bold shadow-md shadow-yellow-500/20'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <span className="text-[9px] px-1 py-0.5 rounded bg-yellow-400/20 text-yellow-300 font-bold">S01</span>
                  <Zap className="w-3.5 h-3.5 text-yellow-400" />
                  <span>KOENIG LIE DETECTOR</span>
                </button>

                <button
                  onClick={() => handleSelectGame('lola')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border whitespace-nowrap transition-all ${
                    activeTab === 'lola'
                      ? 'bg-pink-500/20 border-pink-400 text-pink-200 font-bold shadow-md shadow-pink-500/20'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <span className="text-[9px] px-1 py-0.5 rounded bg-pink-400/20 text-pink-300 font-bold">S01</span>
                  <Activity className="w-3.5 h-3.5 text-pink-400" />
                  <span>LOLA SKY DODGER</span>
                </button>

                <button
                  onClick={() => handleSelectGame('hack')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border whitespace-nowrap transition-all ${
                    activeTab === 'hack'
                      ? 'bg-emerald-500/20 border-emerald-400 text-emerald-200 font-bold shadow-md shadow-emerald-500/20'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <span className="text-[9px] px-1 py-0.5 rounded bg-emerald-400/20 text-emerald-300 font-bold">S01</span>
                  <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                  <span>RISING TIDE HACK</span>
                </button>

                <button
                  onClick={() => handleSelectGame('terrigen')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border whitespace-nowrap transition-all ${
                    activeTab === 'terrigen'
                      ? 'bg-indigo-500/20 border-indigo-400 text-indigo-200 font-bold shadow-md shadow-indigo-500/20'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <span className="text-[9px] px-1 py-0.5 rounded bg-indigo-400/20 text-indigo-300 font-bold">S02</span>
                  <Shield className="w-3.5 h-3.5 text-indigo-400" />
                  <span>TERRIGEN AWAKENING</span>
                </button>

                <button
                  onClick={() => handleSelectGame('lmd')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border whitespace-nowrap transition-all ${
                    activeTab === 'lmd'
                      ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200 font-bold shadow-md shadow-cyan-500/20'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <span className="text-[9px] px-1 py-0.5 rounded bg-cyan-400/20 text-cyan-300 font-bold">S04</span>
                  <Bot className="w-3.5 h-3.5 text-cyan-400" />
                  <span>LMD LOCKDOWN</span>
                </button>

                <button
                  onClick={() => handleSelectGame('kitson')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border whitespace-nowrap transition-all ${
                    activeTab === 'kitson'
                      ? 'bg-red-500/20 border-red-400 text-red-200 font-bold shadow-md shadow-red-500/20'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <span className="text-[9px] px-1 py-0.5 rounded bg-red-400/20 text-red-300 font-bold">S06</span>
                  <Sparkles className="w-3.5 h-3.5 text-red-400" />
                  <span>KITSON CASINO</span>
                </button>

                <button
                  onClick={() => handleSelectGame('zephyr')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border whitespace-nowrap transition-all ${
                    activeTab === 'zephyr'
                      ? 'bg-teal-500/20 border-teal-400 text-teal-200 font-bold shadow-md shadow-teal-500/20'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <span className="text-[9px] px-1 py-0.5 rounded bg-teal-400/20 text-teal-300 font-bold">S07</span>
                  <Clock className="w-3.5 h-3.5 text-teal-400" />
                  <span>ZEPHYR TIME JUMP</span>
                </button>
              </div>
            </div>

            {/* Individual Game Renders */}
            {activeTab === 'koenig' && <KoenigLieDetector />}
            {activeTab === 'lola' && <LolaSkyDodger />}
            {activeTab === 'terrigen' && <TerrigenAwakening />}
            {activeTab === 'hack' && <RisingTideHack />}
            {activeTab === 'lmd' && <LMDDetection />}
            {activeTab === 'kitson' && <KitsonCasino />}
            {activeTab === 'zephyr' && <ZephyrTimeJump />}
          </div>
        )}

        {/* Framework Alternate Reality Fullscreen Simulation Overlay */}
        <FrameworkOverlay
          characters={CHARACTERS_DATA}
          isActive={isFrameworkMode}
          onToggle={() => setIsFrameworkMode(false)}
        />
      </main>

      {/* S.H.I.E.L.D. Protocol Tactical Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950/90 py-4 mt-auto text-xs font-mono-tech text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span>S.H.I.E.L.D. PROTOCOL // AUTHORIZED RECON ARCHIVES (S01 - S07)</span>
            <span className="text-slate-700 hidden sm:inline">|</span>
            <button
              onClick={() => { setActiveTab('clearance'); sound.playBeep(520, 0.05); }}
              className="text-sky-400 hover:text-white underline hidden sm:inline"
            >
              OPERATIVE: {userProfile.agentName} ({userProfile.xp} XP • LVL {userProfile.clearanceLevel})
            </button>
          </div>
          <div className="flex items-center gap-3 text-slate-400">
            <span>TAHITI: IT'S A MAGICAL PLACE</span>
            <span>•</span>
            <span className="text-sky-400 font-bold">WE ARE AGENTS OF S.H.I.E.L.D.</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
