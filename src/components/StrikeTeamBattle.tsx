import React, { useState } from 'react';
import { CharacterDossier, BattleEnemy } from '../types';
import { BATTLE_ENEMIES } from '../data/strikeTeamData';
import { sound } from '../utils/audio';
import confetti from 'canvas-confetti';
import {
  Swords,
  Shield,
  Zap,
  Activity,
  Cpu,
  Flame,
  Award,
  AlertTriangle,
  RotateCcw,
  CheckCircle2,
  Users,
  Target
} from 'lucide-react';

interface StrikeTeamBattleProps {
  characters: CharacterDossier[];
  onAwardXp: (amount: number, reason: string) => void;
}

export const StrikeTeamBattle: React.FC<StrikeTeamBattleProps> = ({ characters, onAwardXp }) => {
  // Selected 3 operative IDs
  const [selectedAgentIds, setSelectedAgentIds] = useState<string[]>([
    'daisy-johnson',
    'phil-coulson',
    'melinda-may'
  ]);

  // Selected enemy
  const [selectedEnemyId, setSelectedEnemyId] = useState<string>('centipede-squad');
  const enemyTemplate = BATTLE_ENEMIES.find(e => e.id === selectedEnemyId) || BATTLE_ENEMIES[0];

  // Battle session state
  const [inBattle, setInBattle] = useState<boolean>(false);
  const [enemyHp, setEnemyHp] = useState<number>(enemyTemplate.hp);
  const [squadHp, setSquadHp] = useState<number>(300);
  const [combatLog, setCombatLog] = useState<string[]>([]);
  const [battleResult, setBattleResult] = useState<'victory' | 'defeat' | null>(null);

  // Selected agents list
  const selectedAgents = characters.filter(c => selectedAgentIds.includes(c.id));

  // Compute Squad Stats based on their latest evolutions
  const totalCombat = Math.round(selectedAgents.reduce((acc, c) => acc + (c.evolutions[c.evolutions.length - 1]?.combatRating || 50), 0) / 3);
  const totalIntel = Math.round(selectedAgents.reduce((acc, c) => acc + (c.evolutions[c.evolutions.length - 1]?.intelRating || 50), 0) / 3);
  const totalTech = Math.round(selectedAgents.reduce((acc, c) => acc + (c.evolutions[c.evolutions.length - 1]?.techRating || 50), 0) / 3);
  const totalSpecial = Math.round(selectedAgents.reduce((acc, c) => acc + (c.evolutions[c.evolutions.length - 1]?.specialRating || 0), 0) / 3);

  // Synergy detection
  const hasFitzSimmons = selectedAgentIds.includes('leo-fitz') && selectedAgentIds.includes('jemma-simmons');
  const hasSecretWarriors = selectedAgentIds.includes('daisy-johnson') && selectedAgentIds.includes('elena-rodriguez');
  const hasCoulsonMay = selectedAgentIds.includes('phil-coulson') && selectedAgentIds.includes('melinda-may');

  const handleToggleAgent = (id: string) => {
    if (inBattle) return;
    if (selectedAgentIds.includes(id)) {
      if (selectedAgentIds.length > 1) {
        setSelectedAgentIds(selectedAgentIds.filter(a => a !== id));
        sound.playBeep(400, 0.04);
      }
    } else {
      if (selectedAgentIds.length < 3) {
        setSelectedAgentIds([...selectedAgentIds, id]);
        sound.playBeep(700, 0.05);
      }
    }
  };

  const handleStartBattle = () => {
    setInBattle(true);
    setEnemyHp(enemyTemplate.hp);
    setSquadHp(300);
    setBattleResult(null);
    setCombatLog([
      `TACTICAL DEPLOYMENT: Squad engaged ${enemyTemplate.name}.`,
      `Enemy HP: ${enemyTemplate.hp} | Special: ${enemyTemplate.specialAbility}`
    ]);
    sound.playClearancePromotion();
  };

  const handleAction = (type: 'strike' | 'tech' | 'special' | 'defend') => {
    if (battleResult || !inBattle) return;

    let damageDealt = 0;
    let logMsg = '';

    if (type === 'strike') {
      sound.playShotgunAxe();
      damageDealt = Math.round(totalCombat * 0.9 + Math.random() * 20);
      logMsg = `COMBAT STRIKE: Squad coordinated physical assault dealing ${damageDealt} damage!`;
    } else if (type === 'tech') {
      sound.playLaser();
      damageDealt = Math.round(totalTech * 0.95 + Math.random() * 25);
      logMsg = `TECH OVERLOAD: EMP trap and I.C.E.R. barrage triggered dealing ${damageDealt} damage!`;
    } else if (type === 'special') {
      sound.playSeismic(1.2);
      damageDealt = Math.round(totalSpecial * 1.2 + Math.random() * 30);
      logMsg = `INHUMAN / SPECIAL BURST: Cataclysmic energy blast unleashed dealing ${damageDealt} damage!`;
    } else if (type === 'defend') {
      sound.playEnergyShield(true);
      damageDealt = 15;
      logMsg = `DEFENSIVE PROTOCOL: Energy shields activated. Squad fortified armor!`;
    }

    const nextEnemyHp = Math.max(0, enemyHp - damageDealt);
    setEnemyHp(nextEnemyHp);

    if (nextEnemyHp <= 0) {
      setBattleResult('victory');
      setCombatLog(prev => [logMsg, `TARGET ELIMINATED: ${enemyTemplate.name} neutralized! VICTORY!`, ...prev]);
      sound.playClearancePromotion();
      try {
        confetti({ particleCount: 70, spread: 80, origin: { y: 0.6 } });
      } catch {}
      onAwardXp(100, `TACTICAL SQUAD VICTORY OVER ${enemyTemplate.name}`);
      return;
    }

    // Enemy Turn Retaliation
    setTimeout(() => {
      let enemyDmg = Math.round(enemyTemplate.attackPower * (type === 'defend' ? 0.35 : 0.8) + Math.random() * 15);
      const nextSquadHp = Math.max(0, squadHp - enemyDmg);
      setSquadHp(nextSquadHp);

      const enemyLog = `HOSTILE RETALIATION: ${enemyTemplate.name} counter-attacks dealing ${enemyDmg} damage to the squad!`;
      setCombatLog(prev => [enemyLog, logMsg, ...prev]);

      if (nextSquadHp <= 0) {
        setBattleResult('defeat');
        sound.playGlitch();
        setCombatLog(prev => [`SQUAD CRITICALLY COMPROMISED: Emergency extraction ordered!`, ...prev]);
      }
    }, 400);
  };

  const handleReset = () => {
    setInBattle(false);
    setBattleResult(null);
    setCombatLog([]);
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="p-4 rounded-2xl bg-slate-950/80 border border-sky-800/40 backdrop-blur-md flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-600 to-amber-900 border border-red-500/50 flex items-center justify-center text-white shadow-lg">
            <Swords className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="text-[10px] font-mono-tech text-red-400 uppercase tracking-widest flex items-center gap-1.5">
              <span>SQUAD TACTICAL SIMULATOR</span>
              <span className="text-amber-400 font-bold">[COMBAT READY]</span>
            </div>
            <h2 className="text-lg font-heading font-black text-white">
              S.H.I.E.L.D. STRIKE TEAM SQUAD BUILDER & BATTLE ARENA
            </h2>
          </div>
        </div>

        {/* Squad Size Counter */}
        <div className="px-3 py-1.5 bg-slate-900 rounded-lg border border-slate-800 text-xs font-mono-tech text-slate-300">
          OPERATIVES SELECTED: <span className="text-cyan-400 font-bold">{selectedAgentIds.length} / 3</span>
        </div>
      </div>

      {/* Team Selection Section */}
      {!inBattle && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs font-mono-tech text-slate-400">
            <span>SELECT 3 AGENTS TO FORM YOUR STRIKE SQUAD:</span>
            {selectedAgentIds.length === 3 && (
              <span className="text-emerald-400 font-bold">READY FOR DEPLOYMENT</span>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
            {characters.map(agent => {
              const isSelected = selectedAgentIds.includes(agent.id);
              const latestEvo = agent.evolutions[agent.evolutions.length - 1];
              return (
                <button
                  key={agent.id}
                  onClick={() => handleToggleAgent(agent.id)}
                  className={`p-3 rounded-2xl border text-left transition-all relative ${
                    isSelected
                      ? 'bg-sky-950/80 border-sky-400 shadow-lg shadow-sky-600/30 scale-105'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 opacity-70 hover:opacity-100'
                  }`}
                >
                  <div className="w-full h-20 rounded-xl overflow-hidden mb-2 bg-slate-900 border border-slate-800">
                    {agent.imageUrl ? (
                      <img src={agent.imageUrl} alt={agent.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center font-heading font-bold text-sky-400">
                        {agent.name.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div className="font-heading font-bold text-xs text-white truncate">{agent.name}</div>
                  <div className="text-[10px] font-mono-tech text-sky-400 truncate">{latestEvo.alias}</div>

                  {isSelected && (
                    <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-sky-500 text-slate-950 flex items-center justify-center font-bold text-xs">
                      ✓
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Squad Combined Synergy & Ratings */}
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div>
              <div className="text-[10px] font-mono-tech text-slate-400">COMBAT POWER</div>
              <div className="text-xl font-heading font-bold text-sky-400">{totalCombat}%</div>
            </div>
            <div>
              <div className="text-[10px] font-mono-tech text-slate-400">TACTICAL INTEL</div>
              <div className="text-xl font-heading font-bold text-emerald-400">{totalIntel}%</div>
            </div>
            <div>
              <div className="text-[10px] font-mono-tech text-slate-400">SCI-TECH PROFICIENCY</div>
              <div className="text-xl font-heading font-bold text-purple-400">{totalTech}%</div>
            </div>
            <div>
              <div className="text-[10px] font-mono-tech text-slate-400">SPECIAL / INHUMAN</div>
              <div className="text-xl font-heading font-bold text-amber-400">{totalSpecial}%</div>
            </div>
          </div>

          {/* Active Synergies */}
          {(hasFitzSimmons || hasSecretWarriors || hasCoulsonMay) && (
            <div className="flex flex-wrap gap-2 items-center p-3 rounded-xl bg-slate-900/60 border border-sky-500/40 text-xs font-mono-tech">
              <span className="text-sky-400 font-bold flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span>ACTIVE SQUAD SYNERGIES:</span>
              </span>
              {hasFitzSimmons && (
                <span className="px-2 py-0.5 rounded bg-cyan-950 border border-cyan-400 text-cyan-300">
                  ✨ FitzSimmons Telepathic Lab Link (+15% Tech Dmg)
                </span>
              )}
              {hasSecretWarriors && (
                <span className="px-2 py-0.5 rounded bg-amber-950 border border-amber-400 text-amber-300">
                  ⚡ Secret Warriors Inhuman Vanguard (+20% Special Dmg)
                </span>
              )}
              {hasCoulsonMay && (
                <span className="px-2 py-0.5 rounded bg-red-950 border border-red-400 text-red-300">
                  🛡️ Bus Founding Commanders (+15% Defense)
                </span>
              )}
            </div>
          )}

          {/* Target Adversary Picker */}
          <div className="space-y-2 pt-2">
            <div className="text-xs font-mono-tech text-slate-400">SELECT THREAT OBJECTIVE:</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {BATTLE_ENEMIES.map(enemy => (
                <button
                  key={enemy.id}
                  onClick={() => {
                    setSelectedEnemyId(enemy.id);
                    sound.playBeep(520, 0.05);
                  }}
                  className={`p-3.5 rounded-xl border text-left text-xs font-mono-tech transition-all flex items-center gap-3 ${
                    selectedEnemyId === enemy.id
                      ? 'bg-red-950/80 border-red-500 text-red-100 shadow-md shadow-red-600/30'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <span className="text-2xl">{enemy.avatarIcon}</span>
                  <div>
                    <div className="font-heading font-bold text-white">{enemy.name}</div>
                    <div className="text-[10px] text-slate-400">HP: {enemy.hp} | Atk: {enemy.attackPower}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Launch Battle Button */}
          <button
            disabled={selectedAgentIds.length !== 3}
            onClick={handleStartBattle}
            className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 hover:from-red-500 hover:to-amber-500 disabled:opacity-50 text-white font-heading font-black text-sm tracking-widest shadow-2xl shadow-red-600/40 flex items-center justify-center gap-2 transition-all transform active:scale-95"
          >
            <Swords className="w-5 h-5" />
            <span>DEPLOY STRIKE TEAM INTO BATTLE</span>
          </button>
        </div>
      )}

      {/* Active Battle Arena */}
      {inBattle && (
        <div className="p-6 rounded-3xl bg-slate-950/90 border-2 border-red-500/60 shadow-2xl space-y-6">
          {/* Health Bar Arena */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            {/* Squad Status */}
            <div className="p-4 rounded-2xl bg-slate-900 border border-sky-500/50 space-y-2">
              <div className="flex justify-between items-center text-xs font-mono-tech">
                <span className="font-bold text-sky-400 flex items-center gap-1.5">
                  <Shield className="w-4 h-4" />
                  <span>S.H.I.E.L.D. STRIKE TEAM</span>
                </span>
                <span className="font-bold text-white">{squadHp} / 300 HP</span>
              </div>
              <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden p-0.5 border border-slate-800">
                <div
                  className="h-full bg-gradient-to-r from-sky-500 to-emerald-400 rounded-full transition-all duration-300"
                  style={{ width: `${(squadHp / 300) * 100}%` }}
                />
              </div>
              <div className="text-[10px] font-mono-tech text-slate-400 truncate">
                Operatives: {selectedAgents.map(a => a.name.split(' ')[0]).join(' • ')}
              </div>
            </div>

            {/* Enemy Status */}
            <div className="p-4 rounded-2xl bg-slate-900 border border-red-500/50 space-y-2">
              <div className="flex justify-between items-center text-xs font-mono-tech">
                <span className="font-bold text-red-400 flex items-center gap-1.5">
                  <span className="text-base">{enemyTemplate.avatarIcon}</span>
                  <span>{enemyTemplate.name}</span>
                </span>
                <span className="font-bold text-white">{enemyHp} / {enemyTemplate.hp} HP</span>
              </div>
              <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden p-0.5 border border-slate-800">
                <div
                  className="h-full bg-gradient-to-r from-red-500 to-rose-600 rounded-full transition-all duration-300"
                  style={{ width: `${(enemyHp / enemyTemplate.hp) * 100}%` }}
                />
              </div>
              <div className="text-[10px] font-mono-tech text-red-300/80 truncate">
                Special: {enemyTemplate.specialAbility}
              </div>
            </div>
          </div>

          {/* Tactical Action Commands */}
          {!battleResult ? (
            <div className="space-y-2">
              <div className="text-xs font-mono-tech text-slate-400 text-center">ISSUE SQUAD COMMAND:</div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <button
                  onClick={() => handleAction('strike')}
                  className="p-3.5 rounded-xl bg-sky-950 hover:bg-sky-900 border border-sky-400 text-sky-200 text-xs font-mono-tech font-bold transition-all shadow"
                >
                  ⚔️ COMBAT ASSAULT
                </button>
                <button
                  onClick={() => handleAction('tech')}
                  className="p-3.5 rounded-xl bg-purple-950 hover:bg-purple-900 border border-purple-400 text-purple-200 text-xs font-mono-tech font-bold transition-all shadow"
                >
                  ⚡ TECH TRAP / ICER
                </button>
                <button
                  onClick={() => handleAction('special')}
                  className="p-3.5 rounded-xl bg-amber-950 hover:bg-amber-900 border border-amber-400 text-amber-200 text-xs font-mono-tech font-bold transition-all shadow"
                >
                  💥 SPECIAL BURST
                </button>
                <button
                  onClick={() => handleAction('defend')}
                  className="p-3.5 rounded-xl bg-emerald-950 hover:bg-emerald-900 border border-emerald-400 text-emerald-200 text-xs font-mono-tech font-bold transition-all shadow"
                >
                  🛡️ ENERGY SHIELD
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center space-y-3 p-4 rounded-2xl bg-slate-900 border border-slate-800">
              <h3 className={`text-2xl font-heading font-black ${
                battleResult === 'victory' ? 'text-emerald-400' : 'text-red-400'
              }`}>
                {battleResult === 'victory' ? 'MISSION ACCOMPLISHED // THREAT ELIMINATED (+100 XP)' : 'TACTICAL DEFEAT // REGROUP AT THE PLAYGROUND'}
              </h3>
              <button
                onClick={handleReset}
                className="px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-mono-tech text-xs font-bold transition-colors"
              >
                RETURN TO SQUAD SELECTION
              </button>
            </div>
          )}

          {/* Combat Log Feed */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono-tech text-xs max-h-48 overflow-y-auto space-y-1 scrollbar-thin">
            <div className="text-[10px] text-slate-500 uppercase pb-1 border-b border-slate-800">
              TACTICAL BATTLE TRANSMISSION LOG:
            </div>
            {combatLog.map((log, idx) => (
              <div key={idx} className="text-slate-300 leading-relaxed text-[11px]">
                {log}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
