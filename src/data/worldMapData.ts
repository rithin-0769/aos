import { ThreatLocation } from '../types';

export const THREAT_LOCATIONS: ThreatLocation[] = [
  {
    id: "san-juan",
    name: "San Juan Kree Temple",
    coordinates: { x: 31, y: 44 },
    country: "Puerto Rico",
    category: "0-8-4 ANOMALY",
    threatLevel: "CRITICAL",
    status: "CONTAINED",
    briefing: "Subterranean ancient Kree city located beneath San Juan. Houses the sacred Diviner Terrigenesis pedestal where Skye transformed into Quake and Antoine Triplett gave his life.",
    tacticalOptions: [
      {
        label: "Deploy Inhuman Acoustic Sweep",
        description: "Send Quake with vibration-damping gear to stabilize structural tremors.",
        recommendedStat: "special",
        successMessage: "Quake tuned seismic resonances to prevent cavern collapse. Ancient Terrigen crystals stabilized.",
        xpReward: 45
      },
      {
        label: "Bio-Hazard Lockdown Containment",
        description: "Seal chamber perimeters with automated FitzSimmons barricades.",
        recommendedStat: "tech",
        successMessage: "Containment barricades successfully locked down all toxic Kree vapor conduits.",
        xpReward: 35
      }
    ]
  },
  {
    id: "gloucestershire",
    name: "Maveth Portal Castle",
    coordinates: { x: 48, y: 26 },
    country: "Gloucestershire, England",
    category: "0-8-4 ANOMALY",
    threatLevel: "OMEGA",
    status: "ACTIVE",
    briefing: "Ancient English castle compound utilized by Hydra's inner circle for centuries to send sacrificial human offerings through the Monolith to Maveth.",
    tacticalOptions: [
      {
        label: "Acoustic Resonator Breach",
        description: "Deploy sonic resonance drivers to hold the wormhole open long enough for retrieval.",
        recommendedStat: "tech",
        successMessage: "Harmonic frequencies matched. Wormhole held stable; operative extracted safely.",
        xpReward: 60
      },
      {
        label: "Strike Team Alpha Assault",
        description: "May and Mack breach the outer Hydra barricades with heavy ordnance.",
        recommendedStat: "combat",
        successMessage: "Hydra guards neutralized. The Monolith control apparatus seized intact.",
        xpReward: 40
      }
    ]
  },
  {
    id: "lighthouse",
    name: "The Lighthouse Subterranean Bunker",
    coordinates: { x: 26, y: 32 },
    country: "Lake Ontario, Canada",
    category: "SECRET BASE",
    threatLevel: "MODERATE",
    status: "ACTIVE",
    briefing: "Colossal multi-tier underground military fortress constructed during the Cold War. Serves as S.H.I.E.L.D.'s primary continuity-of-government haven against Graviton and the Chronicoms.",
    tacticalOptions: [
      {
        label: "Fortify Perimeter Defense Grid",
        description: "Reboot automated turbo-lift rail turrets and defense blast doors.",
        recommendedStat: "tech",
        successMessage: "Automated defense grid online. Perimeter reinforced against atmospheric bombardment.",
        xpReward: 30
      },
      {
        label: "Intelligence Recon on Chronicom Hunter Cells",
        description: "Intercept encrypted interstellar telemetry broadcast across deep-space relays.",
        recommendedStat: "intel",
        successMessage: "Hunter signals triangulated. Chrono-coordinates decoded for Zephyr navigation.",
        xpReward: 50
      }
    ]
  },
  {
    id: "afterlife",
    name: "Afterlife Sanctuary",
    coordinates: { x: 73, y: 38 },
    country: "Himalayas / China",
    category: "INHUMAN OUTBREAK",
    threatLevel: "CRITICAL",
    status: "MONITORED",
    briefing: "Hidden mountain refuge established by Jiaying to shelter and nurture newly transformed Inhumans away from human scrutiny and military experimentation.",
    tacticalOptions: [
      {
        label: "Diplomatic Inhuman Envoy",
        description: "Dispatch Daisy Johnson and Lincoln Campbell to establish peaceful mutual trust.",
        recommendedStat: "special",
        successMessage: "Diplomatic protocol achieved. Peaceful communication channel established with Jiaying.",
        xpReward: 40
      },
      {
        label: "Tactical Counter-Terror Interception",
        description: "May conducts low-altitude stealth flyby on Quinjet cloaking mode.",
        recommendedStat: "combat",
        successMessage: "Rogue splinter factions prevented from seizing Terrigen crystal reserves.",
        xpReward: 35
      }
    ]
  },
  {
    id: "triskelion",
    name: "The Triskelion & Potomac Basin",
    coordinates: { x: 28, y: 35 },
    country: "Washington D.C., USA",
    category: "HYDRA CELL",
    threatLevel: "CRITICAL",
    status: "CONTAINED",
    briefing: "Former central headquarters of S.H.I.E.L.D. where Project Insight and Alexander Pierce's Hydra infiltration attempted global subjugation before Captain America and S.H.I.E.L.D. collapsed the helicarriers.",
    tacticalOptions: [
      {
        label: "Data Core Forensic Recovery",
        description: "Scrape encrypted SSR and Hydra micro-servers from submerged helicarrier wreckage.",
        recommendedStat: "intel",
        successMessage: "Classified Hydra sleeper agent rosters extracted and decrypted.",
        xpReward: 50
      },
      {
        label: "Bio-Chem Decontamination Unit",
        description: "Neutralize lingering nerve gas and bio-chemical caches left in the sub-basement vaults.",
        recommendedStat: "tech",
        successMessage: "All toxic chemical canisters rendered inert with Simmons neutralize solution.",
        xpReward: 35
      }
    ]
  },
  {
    id: "zephyr-temporal",
    name: "Zephyr-One Temporal Jump Zone",
    coordinates: { x: 18, y: 36 },
    country: "Pacific Ocean / Chrono-Stream",
    category: "TEMPORAL RIFT",
    threatLevel: "TEMPORAL INVASION",
    status: "ACTIVE",
    briefing: "Zephyr-One airborne mobile command station equipped with the Time Drive engine. Battling Sibyl and Chronicom fleets across Earth's historical eras (1931, 1955, 1976, 1983).",
    tacticalOptions: [
      {
        label: "Electrochron Calibration Jump",
        description: "Enoch coordinates quantum stream tethering to synchronize temporal landing coordinates.",
        recommendedStat: "intel",
        successMessage: "Jump calculated to within 0.002 seconds of accuracy. Time drive successfully cooled.",
        xpReward: 65
      },
      {
        label: "Full Broadside Pulse Defenses",
        description: "Mack fires Zephyr heavy particle cannons into approaching Chronicom strike craft.",
        recommendedStat: "combat",
        successMessage: "Enemy Chronicom pursuit vessels repelled! Zephyr enters slipstream undetected.",
        xpReward: 55
      }
    ]
  }
];
