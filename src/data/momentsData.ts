import { FanMoment, EasterEggItem } from '../types';

export const MOMENTS_DATA: FanMoment[] = [
  {
    id: "not-agents-of-nothing",
    title: "We Are Not Agents of Nothing!",
    season: 1,
    episode: "S1E22 - Beginning of the End",
    category: "SPEECH",
    quote: "We are not agents of nothing! We are agents of S.H.I.E.L.D., and that still carries weight! It has to carry weight. After everything we've been through, that carries weight!",
    speaker: "Phil Coulson",
    context: "Following the fall of the Triskelion and Hydra's exposure, Coulson rallies his battered team in the snowy Canadian wilderness, proving their purpose transcends the organization.",
    impactScore: 100,
    tags: ["Inspirational", "Coulson", "Hydra Fall", "Classic"]
  },
  {
    id: "a-spys-goodbye",
    title: "A Spy's Goodbye",
    season: 3,
    episode: "S3E13 - Parting Shots",
    category: "FAREWELL",
    quote: "A toast... to friends we cannot name, in places we cannot visit.",
    speaker: "Phil Coulson & S.H.I.E.L.D. Team",
    context: "To protect S.H.I.E.L.D. from an international incident in Russia, Bobbi Morse and Lance Hunter take the fall and disavow the agency. Across a crowded bar, each teammate quietly sends them a drink and shares a silent farewell salute.",
    impactScore: 98,
    tags: ["Emotional", "Bobbi Morse", "Lance Hunter", "Tearjerker"]
  },
  {
    id: "ghost-rider-arrival",
    title: "The Spirit of Vengeance Ignites",
    season: 4,
    episode: "S4E1 - The Ghost",
    category: "TRANSFORMATION",
    quote: "I'm not the one who decides. The Rider decides.",
    speaker: "Robbie Reyes (Ghost Rider)",
    context: "Robbie Reyes unleashes the hellfire skull from the 1969 Dodge Charger 'Lucy', introducing supernatural marvels into the grounded tactical world of S.H.I.E.L.D.",
    impactScore: 96,
    tags: ["Supernatural", "Ghost Rider", "Robbie Reyes", "Darkhold"]
  },
  {
    id: "enoch-farewell",
    title: "As I Have Always Been",
    season: 7,
    episode: "S7E9 - As I Have Always Been",
    category: "SACRIFICE",
    quote: "This is the nature of people. They arrive, and then they leave... But I have been fortunate to walk beside you. As I have always been.",
    speaker: "Enoch Coltrane",
    context: "Trapped in an accelerating time storm vortex, Enoch peacefully hands over his vital Electrochron regulator knowing he will deactivate, comforting Daisy and Coulson in his final moments.",
    impactScore: 99,
    tags: ["Enoch", "Chronicom", "Time Loop", "Masterpiece"]
  },
  {
    id: "kills-gordon",
    title: "I'm the Guy Who Kills Gordon",
    season: 2,
    episode: "S2E22 - S.O.S. Part 2",
    category: "BATTLE",
    quote: "I'm the guy who kills Gordon.",
    speaker: "Alphonso 'Mack' Mackenzie",
    context: "Teleporting Inhuman Gordon boasts that Coulson cannot stop him inside the aircraft carrier hold. Mack steps into frame with a lead pipe, beats him down, and seals his fate.",
    impactScore: 94,
    tags: ["Action", "Mack", "Inhumans", "Badass"]
  },
  {
    id: "tahiti-magical-place",
    title: "Tahiti: It's a Magical Place",
    season: 1,
    episode: "S1E11 - The Magical Place",
    category: "SPEECH",
    quote: "It's a magical place... Please, just let me die. Don't do this to me! Just let me die...",
    speaker: "Phil Coulson",
    context: "Raina straps Coulson into the memory brain machine at the Guest House, peeling back the false neural implant to reveal the horrific trauma of his GH-325 resurrection.",
    impactScore: 95,
    tags: ["Mystery", "Tahiti", "GH-325", "Origins"]
  },
  {
    id: "fitz-universe-cross",
    title: "I Will Cross the Universe for You",
    season: 3,
    episode: "S3E2 - Purpose in the Machine",
    category: "SACRIFICE",
    quote: "I gave you a promise, Jemma. There is no planet, no galaxy, no distance where I won't come for you.",
    speaker: "Leo Fitz",
    context: "Fitz dives headfirst into the liquefied Kree Monolith portal straight into an alien sandstorm on Maveth, desperately pulling Jemma Simmons out as the portal implodes.",
    impactScore: 97,
    tags: ["Romance", "FitzSimmons", "Maveth", "Monolith"]
  },
  {
    id: "framework-doctor-reveal",
    title: "The Doctor's Cold Scalpel",
    season: 4,
    episode: "S4E17 - Identity and Change",
    category: "TRANSFORMATION",
    quote: "You speak of humanity as if it were a virtue. In my laboratory, it is merely raw material.",
    speaker: "Leopold Fitz (The Doctor)",
    context: "In Madame Hydra's Framework, the warm, gentle Fitz has become a chilling, sociopathic head of science who executes Agnes without flinching, devastating Daisy and Simmons.",
    impactScore: 93,
    tags: ["Framework", "Hydra", "The Doctor", "Tragedy"]
  },
  {
    id: "lincoln-sacrifice",
    title: "Paying for My Sins",
    season: 3,
    episode: "S3E22 - Ascension",
    category: "SACRIFICE",
    quote: "I'm saving the girl I love. And I'm finally paying for all the mistakes I made.",
    speaker: "Lincoln Campbell",
    context: "Lincoln traps Hive in the manual Quinjet with a warhead, floating peacefully above Earth's orbit beside Hive as they watch the sunrise before the explosion.",
    impactScore: 94,
    tags: ["Secret Warriors", "Lincoln", "Ascension", "Heroism"]
  },
  {
    id: "daisy-terrigenesis",
    title: "The Cocoon Shatters: Daisy Awakens",
    season: 2,
    episode: "S2E10 - What They Become",
    category: "TRANSFORMATION",
    quote: "Skye, you're not broken. You're magnificent.",
    speaker: "Calvin Zabo & Skye",
    context: "Inside the submerged Kree temple, the Diviner triggers. Trip is petrified into dust trying to save her, while Skye's petrified shell fractures under pulsing seismic waves.",
    impactScore: 98,
    tags: ["Origin", "Terrigenesis", "Quake", "Trip"]
  }
];

export const EASTER_EGGS_DATA: EasterEggItem[] = [
  {
    id: "egg-fitz-lemon",
    name: "Fitz's Romantic Lemon",
    type: "LEMON",
    description: "In Scottish romantic custom according to Fitz (or Chronicom space lore), leaving a lemon on a bunk is the ultimate sign of unspoken affection for Simmons.",
    locationHint: "Found in FitzSimmons Lab schematic viewer",
    found: false,
    clearanceBonus: 50
  },
  {
    id: "egg-koenig-lanyard",
    name: "Koenig Level 6 Lanyard",
    type: "LANYARD",
    description: "Issued by Eric, Billy, or Sam Koenig at Providence Base. It is magnetic and color-coded. Do not lose your lanyard, agent.",
    locationHint: "Found near Clearance Level badge terminal",
    found: false,
    clearanceBonus: 50
  },
  {
    id: "egg-tahiti-postcard",
    name: "Tahiti 'Magical Place' Postcard",
    type: "TAHITI_POSTCARD",
    description: "A vintage travel postcard showing blue waters and palm trees, with secret GH-325 molecular formula written on the back.",
    locationHint: "Found inside Moments Hub under Coulson's memory archives",
    found: false,
    clearanceBonus: 75
  },
  {
    id: "egg-darkhold-glyph",
    name: "Darkhold Hexadecimal Inscription",
    type: "DARKHOLD_GLYPH",
    description: "Forbidden text that drives mortals mad but allowed AIDA to build biological bodies.",
    locationHint: "Found during Framework CRT scan in Season 4 mode",
    found: false,
    clearanceBonus: 80
  },
  {
    id: "egg-zephyr-key",
    name: "Zephyr-One Jump Ignition Key",
    type: "ZEPHYR_KEY",
    description: "Manual override key for the Time Drive installed in the Zephyr's cargo bay.",
    locationHint: "Found inside the Timeline slider control hub",
    found: false,
    clearanceBonus: 100
  }
];
