import React, { useState, useEffect } from 'react';
import { SEASONS_DATA } from './data/timelineData';
import { CHARACTERS_DATA } from './data/characters';
import { MOMENTS_DATA, EASTER_EGGS_DATA } from './data/momentsData';
import { TRIVIA_QUESTIONS } from './data/triviaData';
import { SeasonNumber, UserProfile, EasterEggItem } from './types';
import { sound } from './utils/audio';

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

import { CharacterShowcase } from './components/CharacterShowcase';

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
  Sparkles,
  Info,
  UserCheck
} from 'lucide-react';

export const App: React.FC = () => {
  // Navigation & Timeline State
  const [activeTab, setActiveTab] = useState<'timeline' | 'showcase' | 'simulators' | 'moments' | 'clearance'>('showcase');
  const [currentSeason, setCurrentSeason] = useState<SeasonNumber>(1);
  const [activeSim, setActiveSim] = useState<'quake' | 'coulson' | 'may' | 'fitzsimmons' | 'mack'>('quake');
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

  // Save profile to localStorage
  useEffect(() => {
    localStorage.setItem('shield_user_profile', JSON.stringify(userProfile));
  }, [userProfile]);

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
    if (simId === 'quake' || simId === 'coulson' || simId === 'may' || simId === 'fitzsimmons' || simId === 'mack') {
      setActiveSim(simId as typeof activeSim);
      setActiveTab('simulators');
    }
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
          <div className="flex items-center gap-3 text-xs font-mono-tech">
            {/* Clearance Pill */}
            <div
              onClick={() => setActiveTab('clearance')}
              className="cursor-pointer bg-slate-900 hover:bg-slate-850 px-3 py-1.5 rounded-lg border border-slate-700 flex items-center gap-2 transition-colors"
            >
              <span className="text-slate-400">CLEARANCE:</span>
              <span className="font-bold text-sky-400">
                {userProfile.clearanceLevel >= 7 ? 'DIRECTOR' : `LEVEL 0${userProfile.clearanceLevel}`}
              </span>
            </div>

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
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg transition-all ${
              activeTab === 'showcase'
                ? 'bg-sky-600 text-white font-bold shadow-md shadow-sky-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>HERO SPOTLIGHT</span>
          </button>

          <button
            onClick={() => { setActiveTab('timeline'); sound.playBeep(480, 0.04); }}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg transition-all ${
              activeTab === 'timeline'
                ? 'bg-sky-600 text-white font-bold shadow-md shadow-sky-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Radio className="w-4 h-4" />
            <span>TIMELINE & DOSSIERS</span>
          </button>

          <button
            onClick={() => { setActiveTab('simulators'); sound.playBeep(480, 0.04); }}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg transition-all ${
              activeTab === 'simulators'
                ? 'bg-sky-600 text-white font-bold shadow-md shadow-sky-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>HERO SIMULATORS</span>
          </button>

          <button
            onClick={() => { setActiveTab('moments'); sound.playBeep(480, 0.04); }}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg transition-all ${
              activeTab === 'moments'
                ? 'bg-sky-600 text-white font-bold shadow-md shadow-sky-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <MessageSquareQuote className="w-4 h-4" />
            <span>FAN MOMENTS & QUOTES</span>
          </button>

          <button
            onClick={() => { setActiveTab('clearance'); sound.playBeep(480, 0.04); }}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg transition-all ${
              activeTab === 'clearance'
                ? 'bg-sky-600 text-white font-bold shadow-md shadow-sky-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>CLEARANCE & BADGE</span>
          </button>
        </nav>
      </header>

      {/* Easter Egg Notification Toast */}
      {recentEggNotice && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-xl bg-gradient-to-r from-amber-600 to-yellow-600 text-slate-950 font-bold font-mono-tech text-xs shadow-2xl flex items-center gap-3 animate-bounce">
          <Sparkles className="w-5 h-5 text-slate-950" />
          <span>{recentEggNotice}</span>
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
              onOpenHeroPage={() => {
                setActiveTab('showcase');
                sound.playBeep(700, 0.06);
              }}
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
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg border transition-all ${
                  activeSim === 'quake'
                    ? 'bg-sky-950 border-sky-400 text-sky-200 font-bold shadow'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <Activity className="w-4 h-4 text-sky-400" />
                <span>QUAKE // SEISMIC WAVES</span>
              </button>

              <button
                onClick={() => { setActiveSim('coulson'); sound.playBeep(500, 0.05); }}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg border transition-all ${
                  activeSim === 'coulson'
                    ? 'bg-sky-950 border-sky-400 text-sky-200 font-bold shadow'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <Cpu className="w-4 h-4 text-sky-400" />
                <span>COULSON // SHIELD & ROBOTIC HAND</span>
              </button>

              <button
                onClick={() => { setActiveSim('may'); sound.playBeep(500, 0.05); }}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg border transition-all ${
                  activeSim === 'may'
                    ? 'bg-sky-950 border-sky-400 text-sky-200 font-bold shadow'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <Swords className="w-4 h-4 text-sky-400" />
                <span>MAY // "THE CAVALRY" COMBAT</span>
              </button>

              <button
                onClick={() => { setActiveSim('fitzsimmons'); sound.playBeep(500, 0.05); }}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg border transition-all ${
                  activeSim === 'fitzsimmons'
                    ? 'bg-sky-950 border-sky-400 text-sky-200 font-bold shadow'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <Bot className="w-4 h-4 text-cyan-400" />
                <span>FITZSIMMONS // LAB & D.W.A.R.F.S</span>
              </button>

              <button
                onClick={() => { setActiveSim('mack'); sound.playBeep(500, 0.05); }}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg border transition-all ${
                  activeSim === 'mack'
                    ? 'bg-amber-950 border-amber-400 text-amber-200 font-bold shadow'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <Wrench className="w-4 h-4 text-amber-400" />
                <span>MACK // SHOTGUN-AXE FORGE</span>
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
          </div>
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
      </main>

      {/* S.H.I.E.L.D. Protocol Tactical Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950/90 py-4 mt-auto text-xs font-mono-tech text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-wrap items-center justify-between gap-2">
          <div>
            S.H.I.E.L.D. PROTOCOL // AUTHORIZED RECON FOR SEASONS 1 THROUGH 7
          </div>
          <div className="flex items-center gap-3">
            <span>TAHITI: IT'S A MAGICAL PLACE</span>
            <span>•</span>
            <span>WE ARE AGENTS OF S.H.I.E.L.D.</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
