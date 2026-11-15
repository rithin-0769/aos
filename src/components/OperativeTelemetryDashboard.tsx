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
    <section className="relative rounded-2xl border-2 border-amber-700/80 bg-[#0e131d] shadow-[0_15px_45px_rgba(0,0,0,0.9)] p-4 sm:p-5 mb-6 overflow-hidden">
      {/* Heavy Industrial Brass Rivets */}
      <div className="brass-rivet top-2.5 left-2.5" />
      <div className="brass-rivet top-2.5 right-2.5" />
      <div className="brass-rivet bottom-2.5 left-2.5" />
      <div className="brass-rivet bottom-2.5 right-2.5" />

      {/* Top Secret Watermark & Grid */}
      <div className="absolute top-2 right-16 text-6xl font-typewriter font-black text-amber-500/5 select-none pointer-events-none">
        TOP SECRET // SSR
      </div>

      {/* Header Stamp Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 mb-4 border-b-2 border-amber-900/60 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-amber-500/15 border border-amber-500/50 flex items-center justify-center text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.25)]">
            <Radio className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-typewriter text-xs font-bold tracking-widest text-amber-300 uppercase">
                SSR // STRATEGIC SCIENTIFIC RESERVE TELEMETRY
              </span>
              <span className="rubber-stamp text-[9px] py-0.5 px-2">
                CLASSIFIED S0{currentSeason}
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-typewriter font-bold text-amber-50 tracking-wider flex items-center gap-2">
              <span>OPERATIVE TELEMETRY COMMAND BRIDGE</span>
              <span className="text-xs font-courier text-emerald-400 font-normal">
                [TRISKELION MAIN-FRAME ACTIVE]
              </span>
            </h2>
          </div>
        </div>

        {/* Live System Indicators */}
        <div className="flex items-center gap-2 text-xs font-courier">
          <div className="px-3 py-1 bg-black/80 rounded border border-emerald-500/40 text-emerald-400 flex items-center gap-2 shadow-inner">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="font-bold tracking-wider">SAT-UPLINK: ENCRYPTED</span>
          </div>
          <div className="px-3 py-1 bg-black/80 rounded border border-amber-700/60 text-amber-300 font-mono-tech">
            FREQ: <span className="text-amber-400 font-bold">440.18 MHz [ZULU]</span>
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
          className="lg:col-span-4 p-4 rounded-xl bg-gradient-to-b from-[#181d28] to-[#10141e] hover:to-[#141926] border-2 border-amber-600/40 hover:border-amber-400/80 cursor-pointer transition-all shadow-xl relative group overflow-hidden"
        >
          {/* Top ear fold */}
          <div className="flex items-center justify-between text-[10px] font-courier text-amber-400/80 mb-2">
            <span>OPERATIVE FILE ID: #SSR-{userProfile.clearanceLevel}84</span>
            <span className="text-amber-300 font-bold group-hover:underline flex items-center gap-1">
              INSPECT DOSSIER →
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Biometric Portrait Frame */}
            <div className="relative w-16 h-20 rounded-lg bg-black border-2 border-amber-500/60 overflow-hidden flex items-center justify-center shrink-0 shadow-lg">
              {userProfile.avatarUrl ? (
                <img
                  src={userProfile.avatarUrl}
                  alt="Agent Avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-2xl font-typewriter font-bold text-amber-400">
                  {userProfile.agentName.charAt(0)}
                </div>
              )}
              {/* Scanline line */}
              <div className="absolute inset-x-0 top-0 h-0.5 bg-amber-400/90 animate-pulse pointer-events-none" />
              <div className="absolute bottom-1 right-1 text-[8px] font-courier px-1 bg-black/90 rounded text-amber-300 font-bold">
                BIO-SCAN
              </div>
            </div>

            {/* Agent Metadata */}
            <div className="overflow-hidden flex-1">
              <div className="text-xs text-slate-300 font-courier truncate">
                AGENT <strong className="text-amber-100 text-sm font-typewriter">{userProfile.agentName}</strong>
              </div>
              <div className="text-xs font-typewriter text-amber-400 font-bold truncate">
                CALL-SIGN: "{userProfile.callSign}"
              </div>
              <div className="text-[11px] font-courier text-slate-400 truncate mt-0.5">
                DIVISION: <span className="text-amber-200">{userProfile.division}</span>
              </div>
              <div className="mt-1 flex items-center gap-1.5">
                <span className={`px-2 py-0.5 rounded text-[10px] font-typewriter font-bold ${
                  isDirector
                    ? 'bg-amber-500/25 text-amber-200 border border-amber-500/60 shadow-[0_0_8px_rgba(245,158,11,0.3)]'
                    : 'bg-amber-950/60 text-amber-300 border border-amber-600/50'
                }`}>
                  {isDirector ? '★ DIRECTOR LEVEL' : `CLEARANCE LVL 0${userProfile.clearanceLevel}`}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Module 2: Clearance XP Gauge & Easter Egg Count (cols 4) */}
        <div className="lg:col-span-4 p-4 rounded-xl crt-amber space-y-3 relative flex flex-col justify-between shadow-xl">
          <div>
            <div className="flex items-center justify-between text-xs font-courier mb-1.5">
              <span className="text-amber-300/80 font-bold uppercase tracking-wider">CLEARANCE ACCREDITATION</span>
              <span className="text-amber-200 font-typewriter font-bold">{userProfile.xp} XP LOGGED</span>
            </div>

            {/* Level Progress Bar */}
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] font-courier text-amber-400/90 font-bold">
                <span>TIER LVL 0{userProfile.clearanceLevel}</span>
                <span>{xpForNextLevel} XP TARGET</span>
              </div>
              <div className="w-full bg-black/80 h-3.5 rounded border border-amber-700/80 overflow-hidden p-0.5 shadow-inner">
                <div
                  className="h-full bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-300 rounded transition-all duration-500 shadow-[0_0_10px_rgba(245,158,11,0.6)]"
                  style={{ width: `${levelProgress}%` }}
                />
              </div>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-amber-800/60 text-xs font-courier">
            <div
              onClick={() => onNavigateTab('clearance')}
              className="p-2 rounded bg-black/60 border border-amber-700/60 hover:border-amber-400 cursor-pointer transition-colors"
            >
              <div className="text-[10px] text-amber-400/70 font-bold">0-8-4 ARTIFACTS FOUND</div>
              <div className="text-amber-200 font-typewriter font-bold flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>{foundEasterEggsCount} / {totalEasterEggs}</span>
              </div>
            </div>

            <div
              onClick={() => onNavigateTab('clearance')}
              className="p-2 rounded bg-black/60 border border-amber-700/60 hover:border-amber-400 cursor-pointer transition-colors"
            >
              <div className="text-[10px] text-amber-400/70 font-bold">ACADEMY EXAMS</div>
              <div className="text-amber-200 font-typewriter font-bold flex items-center gap-1">
                <Award className="w-3.5 h-3.5 text-amber-400" />
                <span>{userProfile.completedTrivia.length} ACCREDITED</span>
              </div>
            </div>
          </div>
        </div>

        {/* Module 3: Daily Tactical Directive Intelligence Wire (cols 4) */}
        <div className="lg:col-span-4 p-4 rounded-xl bg-[#17120a] border-2 border-amber-600/70 shadow-xl relative flex flex-col justify-between">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="rubber-stamp-amber text-[9px] py-0.5 px-2">
                TELETYPE DIRECTIVE
              </span>
              <span className="text-[10px] font-typewriter text-amber-300 font-bold">
                {activeDirective.code}
              </span>
            </div>

            <h4 className="font-typewriter font-bold text-sm text-amber-100 pt-1">
              {activeDirective.title}
            </h4>

            <p className="text-xs text-amber-200/80 font-courier leading-relaxed line-clamp-2">
              {activeDirective.desc}
            </p>
          </div>

          <div className="pt-3 flex items-center justify-between border-t border-amber-900/60">
            <span className="text-xs font-typewriter text-amber-400 font-bold">
              BOUNTY: {activeDirective.reward}
            </span>
            <button
              onClick={() => {
                onNavigateTab(activeDirective.tab);
                sound.playBeep(700, 0.06);
              }}
              className="px-3.5 py-1.5 rounded bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-500 hover:to-yellow-500 text-slate-950 font-bold font-typewriter text-xs tracking-wider flex items-center gap-1 shadow-lg transition-all active:scale-95"
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
