import React, { useState, useEffect } from 'react';
import {
  Clock,
  Compass,
  AlertTriangle,
  CheckCircle,
  RotateCcw,
  Sparkles,
  Zap,
  Radio,
  Shield,
  Layers,
  ArrowRight,
  Flame,
  Award,
  ChevronRight
} from 'lucide-react';
import { sound } from '../../utils/audio';

interface TimeEra {
  id: string;
  year: number;
  title: string;
  codename: string;
  location: string;
  threat: string;
  briefing: string;
  enochQuote: string;
  color: string;
  accentBorder: string;
  badge: string;
  question: string;
  options: {
    text: string;
    isCorrect: boolean;
    explanation: string;
  }[];
}

const TIME_ERAS: TimeEra[] = [
  {
    id: 'era-1931',
    year: 1931,
    title: '1931: Manhattan Speakeasy',
    codename: 'OPERATION SWORD OF CHRONOS',
    location: 'New York City, New York',
    threat: 'Chronicom Hunters attempting to prevent FDR’s election',
    briefing: 'The Chronicoms have traveled to 1931 Manhattan targeting future President Franklin D. Roosevelt. We must protect Ernest Koenig’s speakeasy and preserve the genesis of S.H.I.E.L.D.',
    enochQuote: 'I have observed 4,000 Earth years of bar fights. This one is of paramount historic consequence.',
    color: 'from-amber-950 via-slate-900 to-slate-950',
    accentBorder: 'border-amber-500/50',
    badge: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    question: 'Who was the unexpected patron brewing illegal hooch at the speakeasy whom Coulson recognized?',
    options: [
      { text: 'Ernest "Hazard" Koenig', isCorrect: true, explanation: 'Ernest Koenig ran the underground liquor establishment that hiddenly sheltered Wilfred Malick.' },
      { text: 'Howard Stark', isCorrect: false, explanation: 'Howard Stark was still a young boy in 1931; Ernest Koenig was running the speakeasy.' },
      { text: 'Peggy Carter', isCorrect: false, explanation: 'Peggy Carter was operating in the 1940s and 1950s.' },
      { text: 'Chester Phillips', isCorrect: false, explanation: 'General Phillips had not yet formed the SSR.' }
    ]
  },
  {
    id: 'era-1955',
    year: 1955,
    title: '1955: Area 51 & The Ion Engine',
    codename: 'PROJECT HELIUS PROTOCOL',
    location: 'Groom Lake, Nevada',
    threat: 'Chronicom infiltration of the Department of Defense Ion Project',
    briefing: 'S.H.I.E.L.D. predecessor SSR is testing Project Helius. Agent Daniel Sousa is being framed, and history recorded this as the day Sousa died. Can we alter his fate without fracturing the timeline?',
    enochQuote: 'Sousa’s temporal footprint is distinct. Faking his demise requires a clean synthetic switch.',
    color: 'from-teal-950 via-slate-900 to-slate-950',
    accentBorder: 'border-teal-500/50',
    badge: 'bg-teal-500/20 text-teal-300 border-teal-500/40',
    question: 'How did Coulson save Agent Daniel Sousa from his recorded assassination in the history books?',
    options: [
      { text: 'They recruited him onto the Zephyr after faking his death with a staged body', isCorrect: true, explanation: 'Sousa was extracted secretly onto Zephyr One while the world believed he had fallen in the line of duty.' },
      { text: 'They assassinated the Soviet double agent before the rendezvous', isCorrect: false, explanation: 'Sousa still took the bullet, but S.H.I.E.L.D. recovered and revived him aboard the Zephyr.' },
      { text: 'They sent an LMD of Daniel Sousa to replace him permanently in 1955', isCorrect: false, explanation: 'Sousa joined the team directly on Zephyr One instead of an LMD replacement.' },
      { text: 'Daisy quaked the entire Area 51 test chamber to divert attention', isCorrect: false, explanation: 'Daisy had to maintain tactical discretion to avoid a major timeline rupture.' }
    ]
  },
  {
    id: 'era-1973',
    year: 1973,
    title: '1973: The Lighthouse Infiltration',
    codename: 'CHRONICOM INSIGHT INITIATIVE',
    location: 'Lake Ontario, New York',
    threat: 'Wilfred Malick accelerating Project Insight 40 years early',
    briefing: 'Using advanced Chronicom predictive algorithms, Wilfred Malick is launching satellite Insight in 1973 instead of 2014. If Insight goes live, a young Bruce Banner and Nick Fury will be eliminated.',
    enochQuote: 'Calculations reveal 1,842 premature casualties if the orbital laser activates before the Nixon resignation.',
    color: 'from-sky-950 via-slate-900 to-slate-950',
    accentBorder: 'border-sky-500/50',
    badge: 'bg-sky-500/20 text-sky-300 border-sky-500/40',
    question: 'What did Deke Shaw do when confronted with Wilfred Malick at the Lighthouse?',
    options: [
      { text: 'He shot Wilfred Malick, defying Coulson’s strict timeline-preservation order', isCorrect: true, explanation: 'Deke recognized that evil left unchecked in the past poisons the future, taking out Wilfred.' },
      { text: 'He imprisoned Wilfred in the Cryo chamber', isCorrect: false, explanation: 'Deke eliminated Wilfred to halt the early Insight strike.' },
      { text: 'He converted Wilfred to work with the Resistance', isCorrect: false, explanation: 'Wilfred remained a fanatical HYDRA disciple.' },
      { text: 'He stole the Insight launch keys and leaped into the Atlantic', isCorrect: false, explanation: 'Deke engaged directly with a firearm.' }
    ]
  },
  {
    id: 'era-1976',
    year: 1976,
    title: '1976: Project Insight Countdown',
    codename: 'BICENTENNIAL LAUNCH LOCKDOWN',
    location: 'SSR Missile Facility',
    threat: 'Nathaniel Malick stealing Daisy’s seismic Inhuman DNA',
    briefing: 'The Insight rocket is poised to launch on the eve of the US Bicentennial. Meanwhile, Nathaniel Malick has captured Daisy and Daniel Whitehall’s sadistic surgery notes.',
    enochQuote: 'Biochemical transfer of terrigen factors has a 94.7% fatality rate without Jiaying’s healing enzymes.',
    color: 'from-indigo-950 via-slate-900 to-slate-950',
    accentBorder: 'border-indigo-500/50',
    badge: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40',
    question: 'How was the Insight rocket finally destroyed before its satellite could orbit?',
    options: [
      { text: 'Mack and Deke launched a missile strike directly destroying the launch pad', isCorrect: true, explanation: 'Mack and Deke calibrated the Zephyr payload and vaporized the launch structure.' },
      { text: 'Coulson detonated his own mechanical arm inside the warhead', isCorrect: false, explanation: 'Coulson sacrificed himself later at the Lighthouse to purge Chronicom hunters.' },
      { text: 'Elena dashed into the fuel chamber and ignited it with spark matches', isCorrect: false, explanation: 'Elena had not yet fully recovered her confidence and speed limits at that exact time.' },
      { text: 'Enoch overloaded the Zephyr temporal drive into the exhaust plume', isCorrect: false, explanation: 'The Zephyr’s conventional targeting ordnance was fired by Mack.' }
    ]
  },
  {
    id: 'era-1982',
    year: 1982,
    title: '1982: Stranded in the 80s',
    codename: 'OPERATION SYNTH-WAVE SURVIVAL',
    location: 'River’s End, New York',
    threat: 'Sibyl’s omniscient Time Stream predicting S.H.I.E.L.D. team moves',
    briefing: 'Zephyr One jumped unexpectedly, abandoning Mack and Deke in 1982. Deke established a rock-and-roll covert agent squad while Mack dealt with the tragic loss of his parents.',
    enochQuote: 'Rock and roll music appears to elevate human morale by 42%, despite excessive hairspray.',
    color: 'from-fuchsia-950 via-slate-900 to-slate-950',
    accentBorder: 'border-fuchsia-500/50',
    badge: 'bg-fuchsia-500/20 text-fuchsia-300 border-fuchsia-500/40',
    question: 'What cover persona did Deke Shaw adopt during his year stranded in 1982?',
    options: [
      { text: 'Frontman of "The Deke Squad" rock band, playing "Don’t You (Forget About Me)"', isCorrect: true, explanation: 'Deke plagiarized 80s hit songs before their release and fronted The Deke Squad at the Roxy!' },
      { text: 'A Wall Street hedge fund manager betting on Apple computer stocks', isCorrect: false, explanation: 'Deke chose rock stardom and secret agent recruitment instead.' },
      { text: 'A laser tag arcade owner operating a secret weapons bunker', isCorrect: false, explanation: 'The rock band was his official public face and recruitment front.' },
      { text: 'A video game programmer designing Tron knockoffs', isCorrect: false, explanation: 'Deke Squad concerts were his main hustle.' }
    ]
  },
  {
    id: 'era-1983',
    year: 1983,
    title: '1983: Afterlife Sanctuary Siege',
    codename: 'TERRIGEN MATRIX DEFENSE',
    location: 'Afterlife Mountain Compound',
    threat: 'Nathaniel Malick & Kora recruiting rogue Inhumans',
    briefing: 'Nathaniel Malick and Sibyl invade Afterlife to forcibly extract Inhuman gifts and distribute them among mercenaries. Daisy must confront her sister Kora and mother Jiaying.',
    enochQuote: 'Family dynamics in your species defy mathematical logic, yet often dictate catastrophic outcomes.',
    color: 'from-rose-950 via-slate-900 to-slate-950',
    accentBorder: 'border-rose-500/50',
    badge: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
    question: 'What ability did Kora possess, which Nathaniel manipulated to kill Jiaying?',
    options: [
      { text: 'Superheated energy projection and thermal manipulation', isCorrect: true, explanation: 'Kora generated explosive plasma energy that she struggled to control before bonding with Daisy.' },
      { text: 'Gravity distortion pulses', isCorrect: false, explanation: 'Gravitonium powers belonged to Glenn Talbot / Ruby.' },
      { text: 'Cellular regeneration theft', isCorrect: false, explanation: 'Jiaying possessed cellular healing, not Kora.' },
      { text: 'Electromagnetic EMP surges', isCorrect: false, explanation: 'Lincoln Campbell wielded electrical energy.' }
    ]
  },
  {
    id: 'era-final',
    year: 2019,
    title: 'Final Jump: The Quantum Realm Return',
    codename: 'FITZ PROTOCOL // THE TIMELINE KEY',
    location: 'Temple of the Forgotten / Original Timeline',
    threat: 'Chronicom Fleet orbital bombardment of Earth',
    briefing: 'The Zephyr has looped through time. Enoch has given his life to fix the Time Drive. Now we must use the Quantum Realm to bring the team back to our original timeline with Fitz and Simmons’ daughter Alya.',
    enochQuote: 'As I have always said... the team is family. And family is worth any temporal sacrifice.',
    color: 'from-emerald-950 via-slate-900 to-slate-950',
    accentBorder: 'border-emerald-500/50',
    badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    question: 'Who volunteered to stay behind in the 1983 alternate timeline as Director of S.H.I.E.L.D. so the rest of the team could jump home?',
    options: [
      { text: 'Deke Shaw', isCorrect: true, explanation: 'Deke stayed behind to be the rockstar Director of S.H.I.E.L.D. in the new 1980s branch timeline!' },
      { text: 'Phil Coulson', isCorrect: false, explanation: 'Coulson traveled forward and received his new custom electric LOLA.' },
      { text: 'Alphonso "Mack" Mackenzie', isCorrect: false, explanation: 'Mack returned as Director of the restored prime timeline.' },
      { text: 'Daniel Sousa', isCorrect: false, explanation: 'Sousa came forward into the modern era with Daisy.' }
    ]
  }
];

export const ZephyrTimeJump: React.FC = () => {
  const [currentEraIndex, setCurrentEraIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [isJumping, setIsJumping] = useState<boolean>(false);
  const [timeDriveFuel, setTimeDriveFuel] = useState<number>(100);
  const [temporalStability, setTemporalStability] = useState<number>(98);
  const [jumpsCompleted, setJumpsCompleted] = useState<string[]>([]);
  const [missionComplete, setMissionComplete] = useState<boolean>(false);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);

  const era = TIME_ERAS[currentEraIndex];

  useEffect(() => {
    sound.playBeep(440, 0.08);
  }, []);

  const handleSelectOption = (idx: number) => {
    if (isAnswered || isJumping) return;
    setSelectedOption(idx);
    setIsAnswered(true);

    const isCorrect = era.options[idx].isCorrect;

    if (isCorrect) {
      sound.playClearancePromotion();
      setScore((prev) => prev + 250);
      setTemporalStability((prev) => Math.min(100, prev + 2));
    } else {
      sound.playGlitch();
      setTimeDriveFuel((prev) => Math.max(0, prev - 30));
      setTemporalStability((prev) => Math.max(10, prev - 25));

      if (timeDriveFuel <= 35) {
        setGameOver(true);
      }
    }
  };

  const handleExecuteJump = () => {
    if (isJumping) return;
    setIsJumping(true);
    sound.playLaser();

    setTimeout(() => {
      sound.playClearancePromotion();
      setJumpsCompleted((prev) => [...prev, era.id]);

      if (currentEraIndex + 1 < TIME_ERAS.length) {
        setCurrentEraIndex((prev) => prev + 1);
        setSelectedOption(null);
        setIsAnswered(false);
        setIsJumping(false);
      } else {
        setMissionComplete(true);
        setIsJumping(false);
      }
    }, 1800);
  };

  const handleRestart = () => {
    setCurrentEraIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setIsJumping(false);
    setTimeDriveFuel(100);
    setTemporalStability(98);
    setJumpsCompleted([]);
    setMissionComplete(false);
    setGameOver(false);
    setScore(0);
    sound.playBeep(520, 0.06);
  };

  return (
    <div className="relative w-full max-w-6xl mx-auto space-y-6 font-mono-tech select-none">
      {/* Warp Jumping Effect Overlay */}
      {isJumping && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-950/90 backdrop-blur-xl animate-fade-in">
          <div className="relative w-48 h-48 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border-4 border-teal-400 border-t-transparent animate-spin" />
            <div className="absolute inset-3 rounded-full border-4 border-sky-400 border-b-transparent animate-spin" style={{ animationDirection: 'reverse', animationDuration: '0.8s' }} />
            <Clock className="w-16 h-16 text-teal-300 animate-pulse" />
          </div>
          <h2 className="mt-6 text-2xl font-heading font-black text-teal-300 tracking-widest animate-pulse">
            TEMPORAL JUMP IN PROGRESS...
          </h2>
          <p className="text-sm text-teal-400/80 font-mono-tech mt-2">
            CALIBRATING CHRONO-DRIVE // DILATING SPACETIME
          </p>
        </div>
      )}

      {/* Header & HUD */}
      <div className="bg-slate-900/90 border border-teal-500/30 rounded-2xl p-4 sm:p-6 backdrop-blur-md shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-48 h-48 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-teal-500/20 border border-teal-400/50 flex items-center justify-center text-teal-400 shadow-[0_0_20px_rgba(20,184,166,0.3)]">
              <Clock className="w-7 h-7 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-heading font-black text-xl sm:text-2xl tracking-wider text-white">
                  ZEPHYR TIME-JUMP NAV
                </h1>
                <span className="px-2 py-0.5 rounded text-[10px] bg-teal-500/20 text-teal-300 border border-teal-500/40 uppercase font-bold">
                  S07 PROTOCOL
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono-tech">
                CHRONO-DRIVE TRAJECTORY CALCULATOR // ENOCH ENCRYPTED LOG
              </p>
            </div>
          </div>

          {/* Core Metrics */}
          <div className="flex flex-wrap items-center gap-4 text-xs">
            {/* Fuel Bar */}
            <div className="bg-slate-950/80 px-3 py-2 rounded-xl border border-slate-800 flex items-center gap-3">
              <Zap className="w-4 h-4 text-amber-400" />
              <div>
                <div className="flex justify-between gap-2 text-[10px] text-slate-400 font-bold">
                  <span>TIME DRIVE FUEL</span>
                  <span className={timeDriveFuel < 40 ? 'text-rose-400 animate-pulse' : 'text-amber-400'}>
                    {timeDriveFuel}%
                  </span>
                </div>
                <div className="w-24 h-1.5 bg-slate-800 rounded-full overflow-hidden mt-1">
                  <div
                    className={`h-full transition-all duration-500 ${
                      timeDriveFuel < 40 ? 'bg-rose-500' : 'bg-gradient-to-r from-amber-500 to-yellow-400'
                    }`}
                    style={{ width: `${timeDriveFuel}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Stability */}
            <div className="bg-slate-950/80 px-3 py-2 rounded-xl border border-slate-800 flex items-center gap-3">
              <Compass className="w-4 h-4 text-teal-400" />
              <div>
                <div className="flex justify-between gap-2 text-[10px] text-slate-400 font-bold">
                  <span>TIMELINE STABILITY</span>
                  <span className={temporalStability < 50 ? 'text-rose-400' : 'text-teal-400'}>
                    {temporalStability}%
                  </span>
                </div>
                <div className="w-24 h-1.5 bg-slate-800 rounded-full overflow-hidden mt-1">
                  <div
                    className="h-full bg-gradient-to-r from-teal-500 to-cyan-400 transition-all duration-500"
                    style={{ width: `${temporalStability}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Score */}
            <div className="bg-slate-950/80 px-3.5 py-2 rounded-xl border border-teal-500/40 text-right">
              <span className="block text-[10px] text-slate-400 font-bold">TEMPORAL XP</span>
              <span className="text-sm font-heading font-black text-teal-300">+{score}</span>
            </div>
          </div>
        </div>

        {/* Timeline Path Ribbon */}
        <div className="mt-6 pt-4 border-t border-slate-800/80 overflow-x-auto scrollbar-none">
          <div className="flex items-center gap-2 min-w-[700px]">
            {TIME_ERAS.map((e, idx) => {
              const isPast = jumpsCompleted.includes(e.id);
              const isCurrent = idx === currentEraIndex;
              return (
                <div key={e.id} className="flex items-center flex-1">
                  <button
                    disabled
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl border w-full text-left transition-all ${
                      isCurrent
                        ? 'bg-teal-500/20 border-teal-400 text-teal-200 shadow-[0_0_15px_rgba(20,184,166,0.25)]'
                        : isPast
                        ? 'bg-slate-950/90 border-slate-700 text-emerald-400 opacity-90'
                        : 'bg-slate-950/40 border-slate-800/60 text-slate-600'
                    }`}
                  >
                    <div
                      className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold ${
                        isPast
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : isCurrent
                          ? 'bg-teal-400 text-slate-950 animate-pulse'
                          : 'bg-slate-800 text-slate-500'
                      }`}
                    >
                      {isPast ? '✓' : idx + 1}
                    </div>
                    <div>
                      <div className="text-[10px] font-bold tracking-wider">{e.year}</div>
                      <div className="text-[9px] truncate max-w-[80px] text-slate-400">
                        {e.location.split(',')[0]}
                      </div>
                    </div>
                  </button>
                  {idx < TIME_ERAS.length - 1 && (
                    <ChevronRight className="w-4 h-4 text-slate-700 mx-1 flex-shrink-0" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Mission Screen */}
      {!missionComplete && !gameOver && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Tactical Left Panel: Mission Dossier */}
          <div className="lg:col-span-5 space-y-4">
            <div className={`p-5 rounded-2xl bg-gradient-to-b ${era.color} border ${era.accentBorder} shadow-xl relative overflow-hidden backdrop-blur-md`}>
              <div className="flex items-center justify-between mb-3">
                <span className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider border ${era.badge}`}>
                  ERA JUMP #{currentEraIndex + 1} // {era.year}
                </span>
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <Radio className="w-3.5 h-3.5 text-teal-400 animate-pulse" />
                  COORDINATES LOCKED
                </span>
              </div>

              <h2 className="text-xl font-heading font-black text-white tracking-wide">
                {era.title}
              </h2>

              <div className="mt-4 space-y-2.5 text-xs text-slate-300 leading-relaxed">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">LOCATION:</span>
                  <span className="text-teal-300 font-semibold">{era.location}</span>
                </div>

                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">PRIMARY THREAT:</span>
                  <span className="text-rose-300 font-semibold">{era.threat}</span>
                </div>

                <div className="pt-2 border-t border-slate-700/50">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">TACTICAL BRIEF:</span>
                  <p className="bg-slate-950/60 p-3 rounded-xl border border-slate-800 text-[11px] text-slate-300">
                    {era.briefing}
                  </p>
                </div>
              </div>

              {/* Enoch Quote Card */}
              <div className="mt-4 p-3 rounded-xl bg-slate-950/80 border border-teal-500/30 flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-teal-400 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="text-[10px] text-teal-300 font-bold block uppercase tracking-wider">
                    ENOCH CHRONICOM MEMORY RECORD:
                  </span>
                  <p className="text-[11px] text-slate-300 italic mt-0.5">
                    "{era.enochQuote}"
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Tactical Right Panel: Chrono-Calibration Question */}
          <div className="lg:col-span-7 space-y-4">
            <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl backdrop-blur-md">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
                <div className="flex items-center gap-2 text-xs text-teal-400 font-bold">
                  <Layers className="w-4 h-4" />
                  <span>CHRONAL ENCRYPTION PUZZLE</span>
                </div>
                <span className="text-[10px] text-slate-500 font-bold">
                  SOLVE TO INITIATE ZEPHYR WARP
                </span>
              </div>

              <h3 className="text-sm sm:text-base font-bold text-slate-100 mb-5 leading-snug">
                {era.question}
              </h3>

              <div className="space-y-3">
                {era.options.map((opt, idx) => {
                  const isChosen = selectedOption === idx;
                  const showSuccess = isAnswered && opt.isCorrect;
                  const showFailure = isAnswered && isChosen && !opt.isCorrect;

                  let btnStyle = 'bg-slate-950/80 border-slate-800 hover:border-teal-500/50 text-slate-300';
                  if (showSuccess) {
                    btnStyle = 'bg-emerald-950/80 border-emerald-400 text-emerald-200 shadow-[0_0_20px_rgba(16,185,129,0.3)]';
                  } else if (showFailure) {
                    btnStyle = 'bg-rose-950/80 border-rose-500 text-rose-200 shadow-[0_0_20px_rgba(244,63,94,0.3)] animate-shake';
                  } else if (isAnswered && !opt.isCorrect) {
                    btnStyle = 'bg-slate-950/40 border-slate-900 text-slate-600 opacity-50';
                  }

                  return (
                    <button
                      key={idx}
                      disabled={isAnswered}
                      onClick={() => handleSelectOption(idx)}
                      className={`w-full p-4 rounded-xl border text-left text-xs font-mono-tech transition-all flex items-start gap-3.5 ${btnStyle}`}
                    >
                      <span className="w-6 h-6 rounded-lg bg-slate-900 border border-slate-700 flex items-center justify-center font-bold text-slate-400 flex-shrink-0 mt-0.5">
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <div className="flex-1">
                        <span className="font-medium leading-relaxed block">{opt.text}</span>
                        {isAnswered && (showSuccess || showFailure) && (
                          <span className="block mt-2 pt-2 border-t border-slate-800/80 text-[11px] text-slate-400 italic">
                            {opt.explanation}
                          </span>
                        )}
                      </div>
                      {showSuccess && <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />}
                      {showFailure && <AlertTriangle className="w-5 h-5 text-rose-400 flex-shrink-0" />}
                    </button>
                  );
                })}
              </div>

              {/* Action Bar */}
              {isAnswered && (
                <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between gap-4 animate-fade-in">
                  <div className="text-xs">
                    {era.options[selectedOption!].isCorrect ? (
                      <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                        <CheckCircle className="w-4 h-4" />
                        CHRONO-COORDINATES VERIFIED (+250 XP)
                      </span>
                    ) : (
                      <span className="text-rose-400 font-bold flex items-center gap-1.5">
                        <AlertTriangle className="w-4 h-4" />
                        TEMPORAL ANOMALY DETECTED (-30% FUEL)
                      </span>
                    )}
                  </div>

                  {era.options[selectedOption!].isCorrect ? (
                    <button
                      onClick={handleExecuteJump}
                      className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-slate-950 font-heading font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-teal-500/20 transition-all hover:scale-105 active:scale-95"
                    >
                      <span>INITIATE TIME JUMP</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setSelectedOption(null);
                        setIsAnswered(false);
                      }}
                      className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs flex items-center gap-2"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      RE-CALIBRATE
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Mission Complete Screen */}
      {missionComplete && (
        <div className="p-8 rounded-2xl bg-gradient-to-b from-teal-950 via-slate-900 to-slate-950 border border-teal-400 shadow-2xl text-center space-y-6 animate-scale-up">
          <div className="w-20 h-20 mx-auto rounded-2xl bg-teal-500/20 border-2 border-teal-400 flex items-center justify-center text-teal-300 shadow-[0_0_30px_rgba(20,184,166,0.4)]">
            <Award className="w-10 h-10 animate-bounce" />
          </div>

          <div>
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase bg-teal-500/20 text-teal-300 border border-teal-500/40">
              TIMELINE RESTORED // ALL 7 ERAS COMPLETED
            </span>
            <h2 className="mt-3 text-3xl font-heading font-black text-white tracking-wider">
              QUANTUM REALM VOYAGE SUCCESSFUL
            </h2>
            <p className="mt-2 text-sm text-slate-300 max-w-xl mx-auto font-mono-tech">
              The Zephyr One has safely navigated through 1931, 1955, 1973, 1976, 1982, 1983, and returned to our prime timeline. The Chronicom threat is defeated.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-xl mx-auto text-left text-xs">
            <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800">
              <span className="text-slate-400 text-[10px] block font-bold">TOTAL SCORE</span>
              <span className="text-xl font-heading font-black text-teal-400">{score} XP</span>
            </div>
            <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800">
              <span className="text-slate-400 text-[10px] block font-bold">TIME-DRIVE INTEGRITY</span>
              <span className="text-xl font-heading font-black text-emerald-400">{timeDriveFuel}%</span>
            </div>
            <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800">
              <span className="text-slate-400 text-[10px] block font-bold">STATUS</span>
              <span className="text-xl font-heading font-black text-amber-400">HERO OF TIME</span>
            </div>
          </div>

          <button
            onClick={handleRestart}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-slate-950 font-heading font-black text-sm uppercase tracking-wider flex items-center gap-2 mx-auto shadow-lg shadow-teal-500/30 transition-all hover:scale-105"
          >
            <RotateCcw className="w-4 h-4" />
            <span>RE-ENTER TIME STREAM</span>
          </button>
        </div>
      )}

      {/* Game Over Screen */}
      {gameOver && (
        <div className="p-8 rounded-2xl bg-gradient-to-b from-rose-950 via-slate-900 to-slate-950 border border-rose-500 shadow-2xl text-center space-y-6 animate-scale-up">
          <div className="w-20 h-20 mx-auto rounded-2xl bg-rose-500/20 border-2 border-rose-500 flex items-center justify-center text-rose-400 shadow-[0_0_30px_rgba(244,63,94,0.4)]">
            <AlertTriangle className="w-10 h-10 animate-pulse" />
          </div>

          <div>
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase bg-rose-500/20 text-rose-300 border border-rose-500/40">
              TIMELINE FRACTURE // TIME DRIVE DEPLETED
            </span>
            <h2 className="mt-3 text-3xl font-heading font-black text-rose-200 tracking-wider">
              ZEPHYR LOST IN CHRONO-VORTEX
            </h2>
            <p className="mt-2 text-sm text-slate-300 max-w-xl mx-auto font-mono-tech">
              The time drive ran out of fuel amidst repeated chronal calculation paradoxes. Enoch’s protocols were unable to stabilize the Zephyr One warp core.
            </p>
          </div>

          <button
            onClick={handleRestart}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-rose-600 to-red-500 hover:from-rose-500 hover:to-red-400 text-white font-heading font-black text-sm uppercase tracking-wider flex items-center gap-2 mx-auto shadow-lg shadow-rose-600/30 transition-all hover:scale-105"
          >
            <RotateCcw className="w-4 h-4" />
            <span>RESTART TEMPORAL MATRIX</span>
          </button>
        </div>
      )}
    </div>
  );
};
