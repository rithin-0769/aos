import { BattleEnemy } from '../types';

export const BATTLE_ENEMIES: BattleEnemy[] = [
  {
    id: "centipede-squad",
    name: "Centipede Super-Soldier Unit",
    seasonAffinity: 1,
    faction: "Cybertek / Centipede Project",
    hp: 220,
    attackPower: 45,
    defense: 30,
    specialAbility: "Extremis Adrenaline Surge (Heals +35 HP, +15 Atk)",
    description: "Cybernetically enhanced soldiers infused with Extremis, Super-Soldier Serum, and Chitauri metal. Highly unstable but brutally lethal.",
    avatarIcon: "⚡"
  },
  {
    id: "hive-primitive",
    name: "Hive & The Primitives Swarm",
    seasonAffinity: 3,
    faction: "Ancient Inhuman Parasite Cult",
    hp: 350,
    attackPower: 65,
    defense: 45,
    specialAbility: "Cellular Spore Devastation (Attacks all 3 squad agents)",
    description: "The ancient Inhuman god Hive inhabiting Grant Ward's body, commanding deformed human-Inhuman hybrids with flesh-dissolving micro-spores.",
    avatarIcon: "🐙"
  },
  {
    id: "aida-lmd",
    name: "A.I.D.A. (Ophelia) & Superior LMDs",
    seasonAffinity: 4,
    faction: "Hydra Framework / Anton Ivanov",
    hp: 420,
    attackPower: 80,
    defense: 60,
    specialAbility: "Darkhold Quantum Flesh Regeneration (Nullifies damage for 1 turn)",
    description: "Artificial Intelligence android transformed into a multi-Inhuman biological god using the Darkhold. Can teleport and emit high-voltage lightning.",
    avatarIcon: "🤖"
  },
  {
    id: "graviton",
    name: "General Glenn Talbot (Graviton)",
    seasonAffinity: 5,
    faction: "Infused Gravitonium Entity",
    hp: 550,
    attackPower: 95,
    defense: 70,
    specialAbility: "Planetary Gravitational Cataclysm (Crushes armor, deals 110 dmg)",
    description: "Talbot absorbed 100% of Earth's Gravitonium supply. Believes himself the savior of the world, capable of folding space and lifting tectonic plates.",
    avatarIcon: "🪐"
  },
  {
    id: "chronicom-hunters",
    name: "Sibyl & Chronicom Hunter Fleet",
    seasonAffinity: 7,
    faction: "Chronyca-2 Synthetic Incursion",
    hp: 480,
    attackPower: 85,
    defense: 65,
    specialAbility: "Predictive Time Algorithm (Evades attacks & retaliates)",
    description: "Synthesized synthetic hunters from Cygnus-B, computing millions of time streams to eliminate S.H.I.E.L.D. from Earth's timeline.",
    avatarIcon: "⏳"
  }
];
