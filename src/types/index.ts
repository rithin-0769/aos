// Type definitions for S.H.I.E.L.D. Protocol

export type SeasonNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export interface SeasonInfo {
  number: SeasonNumber;
  title: string;
  codename: string;
  yearRange: string;
  themeId: 'shield-classic' | 'hydra-takeover' | 'secret-warriors' | 'framework' | 'dystopia-2091' | 'sarge-shrike' | 'time-loop-retro';
  description: string;
  majorFactions: string[];
  headquarters: string;
  themeColors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    border: string;
    badgeBg: string;
    text: string;
  };
  threatLevel: 'ALPHA' | 'OMEGA' | 'CRITICAL' | 'EXTINCTION' | 'CHRONICOM';
}

export interface CharacterEvolution {
  season: SeasonNumber;
  alias: string;
  title: string;
  clearanceLevel: number;
  status: string;
  allegiance: string;
  summary: string;
  combatRating: number; // 0-100
  intelRating: number;
  techRating: number;
  specialRating: number; // Inhuman, Cybernetic, etc.
  specialLabel: string;
  tacticalNotes: string;
  primaryWeapon: string;
}

export interface CharacterDossier {
  id: string;
  name: string;
  actor: string;
  origin: string;
  heroSimulatorId?: 'quake' | 'coulson' | 'may' | 'fitzsimmons' | 'mack' | 'yoyo' | 'ghostrider';
  avatarSeed: string; // Used for stylized tactical avatars
  imageUrl?: string; // High-res uploaded portrait
  quote: string;
  audioClipText: string;
  evolutions: CharacterEvolution[];
}

export interface FanMoment {
  id: string;
  title: string;
  season: SeasonNumber;
  episode: string;
  category: 'SPEECH' | 'SACRIFICE' | 'TRANSFORMATION' | 'FAREWELL' | 'HUMOR' | 'BATTLE';
  quote: string;
  speaker: string;
  context: string;
  impactScore: number; // 1-100
  easterEggHint?: string;
  tags: string[];
}

export interface TriviaQuestion {
  id: string;
  season: SeasonNumber;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  points: number;
  clearanceReward: string;
}

export interface EasterEggItem {
  id: string;
  name: string;
  type: 'LEMON' | 'LANYARD' | 'TAHITI_POSTCARD' | 'DARKHOLD_GLYPH' | 'ZEPHYR_KEY';
  description: string;
  locationHint: string;
  found: boolean;
  clearanceBonus: number;
}

export interface UserProfile {
  agentName: string;
  callSign: string;
  division: 'Ops' | 'Sci-Tech' | 'Communications' | 'Tactical Medical';
  clearanceLevel: number; // 1 to 10 + Director
  xp: number;
  foundEasterEggs: string[];
  completedTrivia: string[];
  spoilerSafeMode: boolean;
  avatarUrl?: string;
  photoFilter?: 'none' | 'biometric-cyan' | 'hydra-red' | 'framework-green' | 'vintage-sepia';
}
