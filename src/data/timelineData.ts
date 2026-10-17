import { SeasonInfo } from '../types';

export const SEASONS_DATA: SeasonInfo[] = [
  {
    number: 1,
    title: "Season 1: Rising Tide & Centipede",
    codename: "OPERATION: THE BUS",
    yearRange: "2013 - 2014",
    themeId: "shield-classic",
    description: "Agent Phil Coulson recruits a specialized mobile task force aboard the Bus (CXD 23215). Tracking Project Centipede, the Clairvoyant, and uncovering the terrifying truth buried inside S.H.I.E.L.D.",
    majorFactions: ["S.H.I.E.L.D.", "Rising Tide", "Project Centipede", "Hydra (Sleeper)"],
    headquarters: "CXD 23215 'The Bus' / The Hub / Providence Base",
    themeColors: {
      primary: "#0ea5e9", // Sky/Shield blue
      secondary: "#0b132b",
      accent: "#38bdf8",
      background: "#050b14",
      border: "#1e293b",
      badgeBg: "rgba(14, 165, 233, 0.15)",
      text: "#e2e8f0"
    },
    threatLevel: "ALPHA"
  },
  {
    number: 2,
    title: "Season 2: Hydra Uprising & The Inhumans",
    codename: "OPERATION: REBIRTH & TERRIGEN",
    yearRange: "2014 - 2015",
    themeId: "hydra-takeover",
    description: "S.H.I.E.L.D. is shattered following the Triskelion collapse. Coulson is appointed Director by Nick Fury. Skye unlocks the secret of the Obelisk and Terrigenesis, discovering her biological family and true name: Daisy Johnson.",
    majorFactions: ["Underground S.H.I.E.L.D.", "Hydra (Daniel Whitehall)", "Afterlife Inhumans", "'Real' S.H.I.E.L.D."],
    headquarters: "The Playground (SSR Bunker SSR-1940s)",
    themeColors: {
      primary: "#ef4444", // Crimson Hydra alert
      secondary: "#1a0505",
      accent: "#f87171",
      background: "#0d0202",
      border: "#450a0a",
      badgeBg: "rgba(239, 68, 68, 0.2)",
      text: "#fecaca"
    },
    threatLevel: "CRITICAL"
  },
  {
    number: 3,
    title: "Season 3: Secret Warriors & Hive",
    codename: "OPERATION: MONOLITH / MAVETH",
    yearRange: "2015 - 2016",
    themeId: "secret-warriors",
    description: "Terrigen leaks into the global fish oil supply. Daisy assembles the Secret Warriors to handle emerging Inhumans while Hydra opens a portal to the desolate alien world Maveth to resurrect the ancient parasite Hive.",
    majorFactions: ["Secret Warriors", "ATCU (Rosalind Price)", "Hive / Neo-Hydra", "Watchdogs"],
    headquarters: "The Playground / Zephyr-One (CXD 23216)",
    themeColors: {
      primary: "#8b5cf6", // Deep Alien Violet
      secondary: "#1e1035",
      accent: "#c084fc",
      background: "#080314",
      border: "#3b0764",
      badgeBg: "rgba(139, 92, 246, 0.2)",
      text: "#f3e8ff"
    },
    threatLevel: "EXTINCTION"
  },
  {
    number: 4,
    title: "Season 4: Ghost Rider, LMDs & The Framework",
    codename: "OPERATION: DARKHOLD REALITY",
    yearRange: "2016 - 2017",
    themeId: "framework",
    description: "Robbie Reyes unleashes the Spirit of Vengeance. Radcliffe builds AIDA, leading to the Life Model Decoy coup and trapping the team in the dystopian simulated reality known as The Framework, ruled by Madame Hydra.",
    majorFactions: ["Ghost Rider", "Life Model Decoys (LMD)", "The Framework Hydra", "S.H.I.E.L.D. Resistance"],
    headquarters: "The Framework Triskelion / The Bus (Virtual)",
    themeColors: {
      primary: "#22c55e", // CRT Matrix Neon Green
      secondary: "#052e16",
      accent: "#4ade80",
      background: "#021006",
      border: "#14532d",
      badgeBg: "rgba(34, 197, 94, 0.25)",
      text: "#dcfce7"
    },
    threatLevel: "OMEGA"
  },
  {
    number: 5,
    title: "Season 5: Earth's Destruction & The Lighthouse",
    codename: "OPERATION: TIME PARADOX 2091",
    yearRange: "2017 - 2018",
    themeId: "dystopia-2091",
    description: "Hurled into the year 2091, the team discovers Earth shattered into fragments and surviving humanity enslaved by the Kree. Returning to the present, they fight to break a seemingly inescapable time loop and stop Talbot as Graviton.",
    majorFactions: ["The True Believers", "Kree Empire (Kasius)", "Hydra (General Hale)", "Graviton"],
    headquarters: "The Lighthouse (Lake Ontario Dystopian Bunker)",
    themeColors: {
      primary: "#06b6d4", // Electric Kree Cyan & Deep Space
      secondary: "#082f49",
      accent: "#38bdf8",
      background: "#030c14",
      border: "#0e7490",
      badgeBg: "rgba(6, 182, 212, 0.2)",
      text: "#cffafe"
    },
    threatLevel: "EXTINCTION"
  },
  {
    number: 6,
    title: "Season 6: Sarge & The Shrike Parasites",
    codename: "OPERATION: TWIN ECLIPSE",
    yearRange: "2019",
    themeId: "sarge-shrike",
    description: "Following Coulson's passing, Mack steps up as Director. Deep space teams search for the cryogenic Fitz, while Earth is invaded by Sarge—a ruthless hunter bearing Phil Coulson's exact face and DNA—hunting the crystalline Shrike.",
    majorFactions: ["S.H.I.E.L.D. Command", "Sarge's Mercenaries", "Izel & The Shrike", "Chronicom Hunters (Malachi)"],
    headquarters: "The Lighthouse & Zephyr-One Orbital",
    themeColors: {
      primary: "#d946ef", // Shrike crystal magenta / neon
      secondary: "#3b0764",
      accent: "#f472b6",
      background: "#0e0214",
      border: "#701a75",
      badgeBg: "rgba(217, 70, 239, 0.2)",
      text: "#fae8ff"
    },
    threatLevel: "CRITICAL"
  },
  {
    number: 7,
    title: "Season 7: The Final Mission & The Chronicom War",
    codename: "OPERATION: TIMELINE CHRONICLES",
    yearRange: "1931 - 1983 - 2020",
    themeId: "time-loop-retro",
    description: "Using the modified Zephyr-One with a Time Drive, an LMD Phil Coulson guides the agents through 1930s New York, the 1950s SSR Area 51, and the neon 1980s to stop the Chronicoms from erasing S.H.I.E.L.D. from history.",
    majorFactions: ["S.H.I.E.L.D. Time Squad", "Chronicoms (Sibyl & Luke)", "Hydra (Wilfred & Nathaniel Malick)"],
    headquarters: "Zephyr-One Time Jumper / SSR Area 51",
    themeColors: {
      primary: "#f59e0b", // 1930s-1950s Vintage Amber & CRT Sepia
      secondary: "#451a03",
      accent: "#fbbf24",
      background: "#120902",
      border: "#78350f",
      badgeBg: "rgba(245, 158, 11, 0.25)",
      text: "#fef3c7"
    },
    threatLevel: "CHRONICOM"
  }
];
