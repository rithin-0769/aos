import React, { useState, useEffect, useRef } from 'react';
import { sound } from '../../utils/audio';
import { Swords, Shield, Target, Award, Clock, Flame, Zap } from 'lucide-react';

export const MayCombatSimulator: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'drills' | 'styles' | 'bahrain'>('drills');
  
  // Reflex drill state
  const [drillActive, setDrillActive] = useState<boolean>(false);
  const [drillScore, setDrillScore] = useState<number>(0);
  const [activeSector, setActiveSector] = useState<number | null>(null); // 0, 1, 2, 3
  const [reactionTime, setReactionTime] = useState<number | null>(null);
  const [drillStatus, setDrillStatus] = useState<string>("READY TO COMMENCE DRILL");
  const targetStartTimeRef = useRef<number>(0);
  const drillTimeoutRef = useRef<number | null>(null);

  const startDrill = () => {
    setDrillActive(true);
    setDrillScore(0);
    setDrillStatus("ENGAGING HYDRA THREAT MATRIX...");
    sound.playBeep(440, 0.1);
    spawnTarget();
  };

  const spawnTarget = () => {
    const nextSector = Math.floor(Math.random() * 4);
    const delay = Math.random() * 1200 + 600;

    drillTimeoutRef.current = window.setTimeout(() => {
      setActiveSector(nextSector);
      targetStartTimeRef.current = performance.now();
      sound.playBeep(880, 0.08, 'sawtooth');
    }, delay);
  };

  const handleStrike = (sectorIndex: number) => {
    if (!drillActive || activeSector === null) return;

    if (sectorIndex === activeSector) {
      const delta = Math.round(performance.now() - targetStartTimeRef.current);
      setReactionTime(delta);
      setDrillScore((prev) => prev + 1);
      sound.playBeep(1200, 0.06);
      setActiveSector(null);

      if (drillScore + 1 >= 5) {
        setDrillActive(false);
        setDrillStatus(`TACTICAL MASTERY VERIFIED: AVG REACTION ${delta}ms`);
        sound.playClearancePromotion();
      } else {
        spawnTarget();
      }
    } else {
      // Missed parry
      sound.playGlitch();
      setDrillStatus("PARRY FAILED - DEFENSIVE BREACH");
      setActiveSector(null);
      spawnTarget();
    }
  };

  useEffect(() => {
    return () => {
      if (drillTimeoutRef.current) clearTimeout(drillTimeoutRef.current);
    };
  }, []);

  return (
    <div className="p-4 rounded-xl border border-sky-900/60 bg-slate-950/80">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-4 border-b border-sky-800/40">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-sky-500/20 text-sky-400 border border-sky-500/40">
            <Swords className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-heading font-bold text-lg text-sky-300 tracking-wide uppercase">
              Melinda May // "The Cavalry" Combat Suite
            </h3>
            <p className="text-xs text-slate-400 font-mono-tech">
              OPS DIVISION COMBAT EFFICIENCY: 99.8% // S.H.I.E.L.D. RECORD
            </p>
          </div>
        </div>

        {/* Tab navigation */}
        <div className="flex bg-slate-900 p-1 rounded-lg border border-slate-800 text-xs font-mono-tech">
          <button
            onClick={() => { setActiveTab('drills'); sound.playBeep(500, 0.05); }}
            className={`px-3 py-1 rounded transition-colors ${
              activeTab === 'drills' ? 'bg-sky-600 text-white font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            REFLEX DRILLS
          </button>
          <button
            onClick={() => { setActiveTab('styles'); sound.playBeep(500, 0.05); }}
            className={`px-3 py-1 rounded transition-colors ${
              activeTab === 'styles' ? 'bg-sky-600 text-white font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            MARTIAL ARTS
          </button>
          <button
            onClick={() => { setActiveTab('bahrain'); sound.playBeep(500, 0.05); }}
            className={`px-3 py-1 rounded transition-colors ${
              activeTab === 'bahrain' ? 'bg-sky-600 text-white font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            BAHRAIN LOG
          </button>
        </div>
      </div>

      {/* Main Tab Views */}
      {activeTab === 'drills' && (
        <div className="space-y-4">
          {/* Reaction mini-game grid */}
          <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 text-center">
            <div className="flex justify-between items-center text-xs font-mono-tech mb-3">
              <span className="text-slate-400">STATUS: {drillStatus}</span>
              {reactionTime && (
                <span className="text-cyan-400 font-bold">LAST PARRY: {reactionTime} ms</span>
              )}
            </div>

            {/* 4 Quadrants Reaction Arena */}
            <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto mb-4">
              {[
                { label: 'HIGH LEFT // HEAD STRIKE', idx: 0 },
                { label: 'HIGH RIGHT // BLADE PARRY', idx: 1 },
                { label: 'LOW LEFT // SWEEP COUNTER', idx: 2 },
                { label: 'LOW RIGHT // DISARM LOCK', idx: 3 },
              ].map((sector) => {
                const isTarget = activeSector === sector.idx;
                return (
                  <button
                    key={sector.idx}
                    onClick={() => handleStrike(sector.idx)}
                    className={`h-24 sm:h-28 rounded-xl border flex flex-col items-center justify-center p-2 transition-all select-none ${
                      isTarget
                        ? 'bg-red-600 border-red-300 text-white animate-pulse shadow-lg shadow-red-500/80 scale-105'
                        : 'bg-slate-950/70 border-slate-800 text-slate-400 hover:border-sky-500/40'
                    }`}
                  >
                    <Target className={`w-6 h-6 mb-1 ${isTarget ? 'text-white' : 'text-slate-600'}`} />
                    <span className="text-[10px] font-mono-tech leading-tight">{sector.label}</span>
                    {isTarget && (
                      <span className="text-[11px] font-bold text-yellow-300 font-mono-tech animate-bounce">
                        STRIKE NOW!
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="flex justify-center gap-3">
              {!drillActive ? (
                <button
                  onClick={startDrill}
                  className="px-6 py-2.5 bg-sky-600 hover:bg-sky-500 text-white font-mono-tech text-xs tracking-wider font-bold rounded-lg shadow-lg shadow-sky-600/40 flex items-center gap-2"
                >
                  <Flame className="w-4 h-4" />
                  <span>START TACTICAL REACTION DRILL</span>
                </button>
              ) : (
                <div className="text-xs font-mono-tech text-sky-300 flex items-center gap-2 bg-slate-950 px-4 py-2 rounded-lg border border-sky-800">
                  <Clock className="w-4 h-4 animate-spin" />
                  <span>DRILL IN PROGRESS // DEFLECT TARGETS ({drillScore}/5)</span>
                </div>
              )}
            </div>
          </div>

          {/* Combat Stats Bars */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 bg-slate-900/40 rounded-lg border border-slate-800">
              <div className="text-[11px] text-slate-400 font-mono-tech">UNARMED LETHALITY</div>
              <div className="text-xl font-heading font-bold text-sky-400">99 / 100</div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full mt-1.5 overflow-hidden">
                <div className="bg-sky-400 h-full w-[99%]" />
              </div>
            </div>
            <div className="p-3 bg-slate-900/40 rounded-lg border border-slate-800">
              <div className="text-[11px] text-slate-400 font-mono-tech">REACTION TIME</div>
              <div className="text-xl font-heading font-bold text-emerald-400">110 ms</div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full mt-1.5 overflow-hidden">
                <div className="bg-emerald-400 h-full w-[95%]" />
              </div>
            </div>
            <div className="p-3 bg-slate-900/40 rounded-lg border border-slate-800">
              <div className="text-[11px] text-slate-400 font-mono-tech">WEAPONRY MASTERY</div>
              <div className="text-xl font-heading font-bold text-amber-400">Expert</div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full mt-1.5 overflow-hidden">
                <div className="bg-amber-400 h-full w-[96%]" />
              </div>
            </div>
            <div className="p-3 bg-slate-900/40 rounded-lg border border-slate-800">
              <div className="text-[11px] text-slate-400 font-mono-tech">FLIGHT / PILOTING</div>
              <div className="text-xl font-heading font-bold text-purple-400">ACE Tier</div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full mt-1.5 overflow-hidden">
                <div className="bg-purple-400 h-full w-[100%]" />
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'styles' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="p-3 bg-slate-900/60 rounded-lg border border-slate-800">
            <h4 className="font-heading font-bold text-sky-300 text-sm mb-1">Wing Chun & Close Quarters</h4>
            <p className="text-xs text-slate-400">
              Rapid centerline punches, redirection of enemy kinetic force, and fluid trap-and-strike maneuvers ideal for tight corridors of the Bus or Zephyr.
            </p>
          </div>
          <div className="p-3 bg-slate-900/60 rounded-lg border border-slate-800">
            <h4 className="font-heading font-bold text-sky-300 text-sm mb-1">Krav Maga & Disarmament</h4>
            <p className="text-xs text-slate-400">
              Aggressive defense against armed assailants. Specializes in instant disarmament of semi-automatic handguns and assault rifles in under 0.4 seconds.
            </p>
          </div>
          <div className="p-3 bg-slate-900/60 rounded-lg border border-slate-800">
            <h4 className="font-heading font-bold text-sky-300 text-sm mb-1">Escrima / Kali Stick Combat</h4>
            <p className="text-xs text-slate-400">
              Weaponized baton flow. Uses dual collapsible batons or improvised lead pipes to disable multiple armored opponents simultaneously.
            </p>
          </div>
          <div className="p-3 bg-slate-900/60 rounded-lg border border-slate-800">
            <h4 className="font-heading font-bold text-sky-300 text-sm mb-1">Empathic Sensing (Post-S6)</h4>
            <p className="text-xs text-slate-400">
              Reads opponent muscular tension, adrenaline surge, and emotional deception through subtle tactile contact, predicting attacks before they initiate.
            </p>
          </div>
        </div>
      )}

      {activeTab === 'bahrain' && (
        <div className="p-4 bg-slate-950 rounded-lg border border-red-900/40 text-xs font-mono-tech space-y-2">
          <div className="text-red-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
            <Award className="w-4 h-4" />
            <span>CLASSIFIED S.H.I.E.L.D. FILE // INCIDENT: BAHRAIN 2008</span>
          </div>
          <p className="text-slate-300 leading-relaxed">
            In 2008, Agent Melinda May was part of a welcome team dispatched to Bahrain to assess an enhanced individual named Eva Belyakov. When a civilian hostage crisis ensued and a full S.H.I.E.L.D. tactical squad was mentally enslaved, May entered the facility unarmed.
          </p>
          <p className="text-slate-300 leading-relaxed">
            She neutralized a heavily armed mob single-handedly. Upon discovering the puppet master was Eva's young daughter Katya, May was forced to eliminate the child to save dozens of agents, including Coulson.
          </p>
          <div className="p-2.5 bg-slate-900 border border-slate-800 rounded text-slate-400">
            <span className="text-sky-400 font-bold">COULSON'S NOTE:</span> "The legend called her 'The Cavalry'. But it broke her heart. She didn't ride in like a hero; she carried the weight so none of us would have to."
          </div>
        </div>
      )}
    </div>
  );
};
