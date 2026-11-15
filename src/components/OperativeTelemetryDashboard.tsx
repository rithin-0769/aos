import React, { useState, useEffect } from 'react';
import { UserProfile, SeasonNumber } from '../types';
import { sound } from '../utils/audio';
import {
  Shield,
  Radio,
  Award,
  Zap,
  Target,
  Clock,
  Compass,
  Sparkles,
  Gamepad2,
  ChevronRight,
  Activity,
  Layers,
  Terminal,
  AlertTriangle
} from 'lucide-react';

interface OperativeTelemetryDashboardProps {
  userProfile: UserProfile;
  currentSeason: SeasonNumber;
  onNavigateTab: (tab: string) => void;
  foundEasterEggsCount: number;
  totalEasterEggs: number;
}

export const OperativeTelemetryDashboard: React.FC<OperativeTelemetryDashboardProps> = ({
  userProfile,
  currentSeason,
  onNavigateTab,
  foundEasterEggsCount,
  totalEasterEggs
}) => {
  const [wireIndex, setWireIndex] = useState(0);
  const [isRadarPulsing, setIsRadarPulsing] = useState(false);

  // Daily Directives Wire
  const directives = [
    {
      code: "DIR-S01-084",
      title: "RECON 0-8-4 ARTIFACT VAULT",
      desc: "Analyze the Darkhold, Berserker Staff, and Monolith in the underground armory.",
      tab: "artifacts",
      reward: "+100 XP",
      tag: "ANOMALY CONTAINMENT"
    },
    {
      code: "DIR-CYBER-99",
      title: "RISING TIDE CYBER INFILTRATION",
      desc: "Crack encrypted firewall nodes and extract Centipede test subject logs.",
      tab: "hack",
      reward: "+150 XP",
      tag: "CYBER WARFARE"
    },
    {
      code: "DIR-POLY-04",
      title: "KOENIG LIE DETECTOR ASSESSMENT",
      desc: "Undergo biometric interrogation to earn the Agent Koenig Gold Lanyard.",
      tab: "koenig",
      reward: "+120 XP",
      tag: "SECURITY EXAM"
    },
    {
      code: "DIR-WARP-77",
      title: "ZEPHYR-ONE TIME JUMP CALIBRATION",
      desc: "Stabilize temporal drive to navigate through 1931, 1955, and 1973 timeline shifts.",
      tab: "zephyr",
      reward: "+250 XP",
      tag: "TEMPORAL FLIGHT"
    }
  ];

  // Rotate wire every 8 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setWireIndex((prev) => (prev + 1) % directives.length);
    }, 8000);
    return () => clearInterval(timer);
  }, [directives.length]);

  const activeDirective = directives[wireIndex];
  const isDirector = userProfile.clearanceLevel >= 7 || userProfile.xp >= 300;
  const xpForNextLevel = userProfile.clearanceLevel * 60;
  const currentLevelBaseXp = (userProfile.clearanceLevel - 1) * 60;
  const levelProgress = Math.min(
    100,
    Math.max(5, ((userProfile.xp - currentLevelBaseXp) / 60) * 100)
  );

  const handleRadarClick = () => {
    setIsRadarPulsing(true);
    sound.playBeep(880, 0.08);
    setTimeout(() => setIsRadarPulsing(false), 800);
    onNavigateTab('worldmap');
  };

  return (
    <section className="relative rounded-2xl tactical-glass-hud p-4 sm:p-5 mb-6 overflow-hidden">
      {/* Tactical HUD Corner Brackets */}
      <div className="hud-bracket-tl" />
      <div className="hud-bracket-tr" />
      <div className="hud-bracket-bl" />
      <div className="hud-bracket-br" />

      {/* Subtle Scanline Overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-20 bg-[linear-gradient(rgba(34,211,238,0.04)_1px,transparent_1px)] [background-size:100%_4px]" />

      {/* Header Stamp Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 mb-4 border-b border-cyan-500/30 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-950/60 border border-cyan-400 flex items-center justify-center text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.4)]">
            <Radio className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono-tech text-xs font-bold tracking-widest text-cyan-400 uppercase">
                SSR // VAULT 084 TELEMETRY INTERFACE
              </span>
              <span className="rubber-stamp-cyan text-[9px] py-0.5 px-2">
                CLASSIFIED S0{currentSeason}
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-heading font-black text-white tracking-wider flex items-center gap-2">
              <span>OPERATIVE TELEMETRY COMMAND BRIDGE</span>
              <span className="text-xs font-mono-tech text-cyan-300 font-normal">
                [TRISKELION MAIN-FRAME ACTIVE]
              </span>
            </h2>
          </div>
        </div>

        {/* Live System Indicators */}
        <div className="flex items-center gap-2 text-xs font-courier">
          <div className="px-3 py-1 bg-black/80 rounded border border-emerald-500/50 text-emerald-300 flex items-center gap-2 shadow-[0_0_10px_rgba(16,185,129,0.2)]">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="font-mono-tech font-bold tracking-wider">SAT-UPLINK: ENCRYPTED</span>
          </div>
          <div className="px-3 py-1 bg-black/80 rounded border border-cyan-500/40 text-cyan-300 font-mono-tech">
            FREQ: <span className="text-cyan-400 font-bold">440.18 MHz [ZULU]</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Biometrics, XP Tier, Threat Radar, Daily Directive */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 relative z-10">
        {/* Module 1: Operative Credential Badge Card (cols 4) */}
        <div
          onClick={() => {
            onNavigateTab('clearance');
            sound.playBeep(640, 0.05);
          }}
          className="lg:col-span-4 p-4 rounded-xl tactical-glass-hud border-cyan-500/40 hover:border-cyan-400/80 cursor-pointer transition-all shadow-xl relative group overflow-hidden"
        >
          <div className="hud-bracket-tl" />
          <div className="hud-bracket-br" />

          {/* Top ear fold */}
          <div className="flex items-center justify-between text-[10px] font-mono-tech text-cyan-400/80 mb-2">
            <span>OPERATIVE FILE ID: #SSR-{userProfile.clearanceLevel}84</span>
            <span className="text-cyan-300 font-bold group-hover:underline flex items-center gap-1">
              INSPECT HUD DOSSIER →
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Biometric Portrait Frame */}
            <div className="relative w-16 h-20 rounded-xl bg-slate-950 border-2 border-cyan-400/70 overflow-hidden flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
              {userProfile.avatarUrl ? (
                <img
                  src={userProfile.avatarUrl}
                  alt="Agent Avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-2xl font-heading font-bold text-cyan-300">
                  {userProfile.agentName.charAt(0)}
                </div>
              )}
              {/* Scanline line */}
              <div className="absolute inset-x-0 top-0 h-0.5 bg-cyan-400 animate-pulse pointer-events-none" />
              <div className="absolute bottom-1 right-1 text-[8px] font-mono-tech px-1 bg-black/90 rounded text-cyan-300 font-bold">
                BIO-SCAN
              </div>
            </div>

            {/* Agent Metadata */}
            <div className="overflow-hidden flex-1">
              <div className="text-xs text-slate-300 font-mono-tech truncate">
                AGENT <strong className="text-white text-sm font-heading">{userProfile.agentName}</strong>
              </div>
              <div className="text-xs font-mono-tech text-cyan-300 font-bold truncate">
                CALL-SIGN: "{userProfile.callSign}"
              </div>
              <div className="text-[11px] font-mono-tech text-slate-400 truncate mt-0.5">
                DIVISION: <span className="text-cyan-200">{userProfile.division}</span>
              </div>
              <div className="mt-1 flex items-center gap-1.5">
                <span className={`px-2 py-0.5 rounded text-[10px] font-mono-tech font-bold ${
                  isDirector
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/60 shadow-[0_0_8px_rgba(245,158,11,0.3)]'
                    : 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/50'
                }`}>
                  {isDirector ? '★ DIRECTOR LEVEL' : `CLEARANCE LVL 0${userProfile.clearanceLevel}`}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Module 2: Clearance XP Gauge & Easter Egg Count (cols 4) */}
        <div className="lg:col-span-4 p-4 rounded-xl tactical-glass-hud border-cyan-500/40 space-y-3 relative flex flex-col justify-between shadow-xl">
          <div className="hud-bracket-tr" />
          <div className="hud-bracket-bl" />

          <div>
            <div className="flex items-center justify-between text-xs font-mono-tech mb-1.5">
              <span className="text-cyan-400/80 font-bold uppercase tracking-wider">CLEARANCE ACCREDITATION</span>
              <span className="text-cyan-200 font-mono-tech font-bold">{userProfile.xp} XP LOGGED</span>
            </div>

            {/* Level Progress Bar */}
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] font-mono-tech text-slate-400 font-bold">
                <span>TIER LVL 0{userProfile.clearanceLevel}</span>
                <span>{xpForNextLevel} XP TARGET</span>
              </div>
              <div className="w-full bg-slate-950 h-3 rounded-full border border-cyan-500/40 overflow-hidden p-0.5 shadow-inner">
                <div
                  className="h-full bg-gradient-to-r from-sky-500 via-cyan-400 to-indigo-400 rounded-full transition-all duration-500 shadow-[0_0_12px_rgba(34,211,238,0.7)]"
                  style={{ width: `${levelProgress}%` }}
                />
              </div>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-cyan-900/40 text-xs font-mono-tech">
            <div
              onClick={() => onNavigateTab('clearance')}
              className="p-2 rounded-lg bg-black/40 border border-cyan-500/30 hover:border-cyan-400 cursor-pointer transition-colors"
            >
              <div className="text-[10px] text-slate-400 font-bold">0-8-4 ARTIFACTS</div>
              <div className="text-cyan-300 font-heading font-bold flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>{foundEasterEggsCount} / {totalEasterEggs}</span>
              </div>
            </div>

            <div
              onClick={() => onNavigateTab('clearance')}
              className="p-2 rounded-lg bg-black/40 border border-cyan-500/30 hover:border-cyan-400 cursor-pointer transition-colors"
            >
              <div className="text-[10px] text-slate-400 font-bold">ACADEMY EXAMS</div>
              <div className="text-cyan-300 font-heading font-bold flex items-center gap-1">
                <Award className="w-3.5 h-3.5 text-cyan-400" />
                <span>{userProfile.completedTrivia.length} ACCREDITED</span>
              </div>
            </div>
          </div>
        </div>

        {/* Module 3: Daily Tactical Directive Intelligence Wire (cols 4) */}
        <div className="lg:col-span-4 p-4 rounded-xl tactical-glass-hud border-cyan-500/40 shadow-xl relative flex flex-col justify-between">
          <div className="hud-bracket-tl" />
          <div className="hud-bracket-br" />

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="rubber-stamp-cyan text-[9px] py-0.5 px-2">
                TELETYPE DIRECTIVE
              </span>
              <span className="text-[10px] font-mono-tech text-cyan-300 font-bold">
                {activeDirective.code}
              </span>
            </div>

            <h4 className="font-heading font-bold text-sm text-white pt-1">
              {activeDirective.title}
            </h4>

            <p className="text-xs text-slate-300 font-mono-tech leading-relaxed line-clamp-2">
              {activeDirective.desc}
            </p>
          </div>

          <div className="pt-3 flex items-center justify-between border-t border-cyan-900/40">
            <span className="text-xs font-mono-tech text-cyan-300 font-bold">
              BOUNTY: {activeDirective.reward}
            </span>
            <button
              onClick={() => {
                onNavigateTab(activeDirective.tab);
                sound.playBeep(700, 0.06);
              }}
              className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-sky-600 hover:from-cyan-400 hover:to-sky-500 text-slate-950 font-bold font-mono-tech text-xs tracking-wider flex items-center gap-1 shadow-lg shadow-cyan-500/25 transition-all active:scale-95"
            >
              <span>ACCEPT DIRECTIVE</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
