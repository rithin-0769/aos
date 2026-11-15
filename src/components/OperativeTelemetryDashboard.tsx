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
    <section className="relative rounded-3xl border border-amber-900/40 bg-gradient-to-b from-[#131722] via-[#0d1017] to-[#07090f] shadow-2xl overflow-hidden p-4 sm:p-6 mb-6">
      {/* Brass Corner Rivets for Cold War Dossier feel */}
      <div className="absolute top-3 left-3 brass-rivet" />
      <div className="absolute top-3 right-3 brass-rivet" />
      <div className="absolute bottom-3 left-3 brass-rivet" />
      <div className="absolute bottom-3 right-3 brass-rivet" />

      {/* Subtle Scanline Overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-20 bg-[linear-gradient(rgba(245,158,11,0.03)_1px,transparent_1px)] [background-size:100%_4px]" />

      {/* Header Stamp Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-4 border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-md">
            <Radio className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-courier text-xs font-bold tracking-widest text-slate-400 uppercase">
                SSR // STRATEGIC SCIENTIFIC RESERVE TELEMETRY
              </span>
              <span className="rubber-stamp text-[10px] py-0.5 px-2">
                CLASSIFIED S0{currentSeason}
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-heading font-black text-white tracking-wider flex items-center gap-2">
              <span>OPERATIVE TELEMETRY COMMAND BRIDGE</span>
              <span className="text-xs font-courier text-emerald-400 font-normal">
                [LIVE UPLINK: TRISKELION MAIN-FRAME]
              </span>
            </h2>
          </div>
        </div>

        {/* Live System Indicators */}
        <div className="flex items-center gap-2 text-xs font-courier">
          <div className="px-3 py-1 bg-slate-950/80 rounded-lg border border-slate-800 text-slate-400 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>SAT-LINK: ENCRYPTED</span>
          </div>
          <div className="px-3 py-1 bg-slate-950/80 rounded-lg border border-slate-800 text-slate-400">
            FREQ: <span className="text-amber-400 font-bold">440.18 MHz</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Biometrics, XP Tier, Threat Radar, Daily Directive */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4">
        {/* Module 1: Operative Credential Badge Card (cols 4) */}
        <div
          onClick={() => {
            onNavigateTab('clearance');
            sound.playBeep(640, 0.05);
          }}
          className="lg:col-span-4 p-4 rounded-2xl bg-slate-900/80 hover:bg-slate-850/90 border border-sky-500/30 hover:border-sky-400/60 cursor-pointer transition-all shadow-lg relative group overflow-hidden"
        >
          {/* Top ear fold */}
          <div className="flex items-center justify-between text-[10px] font-courier text-slate-400 mb-2">
            <span>OPERATIVE FILE ID: #SSR-{userProfile.clearanceLevel}84</span>
            <span className="text-sky-400 font-bold group-hover:underline">INSPECT BADGE →</span>
          </div>

          <div className="flex items-center gap-3">
            {/* Biometric Portrait Frame */}
            <div className="relative w-16 h-20 rounded-xl bg-slate-950 border border-sky-400/50 overflow-hidden flex items-center justify-center shrink-0 shadow-inner">
              {userProfile.avatarUrl ? (
                <img
                  src={userProfile.avatarUrl}
                  alt="Agent Avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-2xl font-heading font-bold text-sky-400">
                  {userProfile.agentName.charAt(0)}
                </div>
              )}
              {/* Scanline line */}
              <div className="absolute inset-x-0 top-0 h-0.5 bg-cyan-400/80 animate-pulse pointer-events-none" />
              <div className="absolute bottom-1 right-1 text-[8px] font-mono-tech px-1 bg-black/80 rounded text-cyan-300">
                BIO-ID
              </div>
            </div>

            {/* Agent Metadata */}
            <div className="overflow-hidden flex-1">
              <div className="text-xs text-slate-400 font-courier truncate">
                AGENT <strong className="text-white text-sm font-heading">{userProfile.agentName}</strong>
              </div>
              <div className="text-xs font-courier text-amber-400 font-bold truncate">
                CALL-SIGN: "{userProfile.callSign}"
              </div>
              <div className="text-[11px] font-courier text-slate-400 truncate mt-0.5">
                DIVISION: <span className="text-sky-300">{userProfile.division}</span>
              </div>
              <div className="mt-1 flex items-center gap-1.5">
                <span className={`px-2 py-0.5 rounded text-[10px] font-courier font-bold ${
                  isDirector
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    : 'bg-sky-500/20 text-sky-300 border border-sky-500/40'
                }`}>
                  {isDirector ? '★ DIRECTOR' : `CLEARANCE LVL 0${userProfile.clearanceLevel}`}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Module 2: Clearance XP Gauge & Easter Egg Count (cols 4) */}
        <div className="lg:col-span-4 p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3 relative flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs font-courier mb-1.5">
              <span className="text-slate-400">CLEARANCE ACCREDITATION</span>
              <span className="text-emerald-400 font-bold">{userProfile.xp} TOTAL XP</span>
            </div>

            {/* Level Progress Bar */}
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] font-courier text-slate-500">
                <span>LVL 0{userProfile.clearanceLevel}</span>
                <span>{xpForNextLevel} XP NEEDED</span>
              </div>
              <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden p-0.5 border border-slate-800">
                <div
                  className="h-full bg-gradient-to-r from-sky-500 via-cyan-400 to-amber-400 rounded-full transition-all duration-500 shadow-[0_0_12px_rgba(56,189,248,0.5)]"
                  style={{ width: `${levelProgress}%` }}
                />
              </div>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800/80 text-xs font-courier">
            <div
              onClick={() => onNavigateTab('clearance')}
              className="p-2 rounded-lg bg-slate-950/70 border border-slate-800 hover:border-amber-500/40 cursor-pointer transition-colors"
            >
              <div className="text-[10px] text-slate-500">EASTER EGGS</div>
              <div className="text-amber-300 font-bold flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>{foundEasterEggsCount} / {totalEasterEggs}</span>
              </div>
            </div>

            <div
              onClick={() => onNavigateTab('clearance')}
              className="p-2 rounded-lg bg-slate-950/70 border border-slate-800 hover:border-sky-500/40 cursor-pointer transition-colors"
            >
              <div className="text-[10px] text-slate-500">EXAM CREDITS</div>
              <div className="text-sky-300 font-bold flex items-center gap-1">
                <Award className="w-3.5 h-3.5 text-sky-400" />
                <span>{userProfile.completedTrivia.length} PASSED</span>
              </div>
            </div>
          </div>
        </div>

        {/* Module 3: Daily Tactical Directive Intelligence Wire (cols 4) */}
        <div className="lg:col-span-4 p-4 rounded-2xl bg-gradient-to-br from-amber-950/30 to-slate-900 border border-amber-500/30 relative flex flex-col justify-between">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="rubber-stamp-amber text-[9px] py-0.5 px-1.5">
                DAILY MISSION WIRE
              </span>
              <span className="text-[10px] font-courier text-amber-400/80 font-bold">
                {activeDirective.code}
              </span>
            </div>

            <h4 className="font-heading font-bold text-sm text-white pt-1">
              {activeDirective.title}
            </h4>

            <p className="text-xs text-slate-300 font-courier leading-relaxed line-clamp-2">
              {activeDirective.desc}
            </p>
          </div>

          <div className="pt-3 flex items-center justify-between border-t border-amber-900/40">
            <span className="text-xs font-courier text-amber-300 font-bold">
              BOUNTY: {activeDirective.reward}
            </span>
            <button
              onClick={() => {
                onNavigateTab(activeDirective.tab);
                sound.playBeep(700, 0.06);
              }}
              className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-500 hover:to-yellow-500 text-slate-950 font-bold font-courier text-xs tracking-wider flex items-center gap-1 shadow-md transition-all active:scale-95"
            >
              <span>ACCEPT MISSION</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
