import { TriviaQuestion } from '../types';

export const TRIVIA_QUESTIONS: TriviaQuestion[] = [
  {
    id: "q1",
    season: 1,
    question: "What is the model and call sign of the mobile aircraft command center used by Coulson's team in Season 1?",
    options: ["CXD 23215 'The Bus'", "Zephyr-One", "Quinjet Alpha-3", "Helicarrier No. 64"],
    correctIndex: 0,
    explanation: "Coulson's modified Boeing C-17 Globemaster III was designated CXD 23215 and affectionately nicknamed 'The Bus'.",
    points: 25,
    clearanceReward: "Field Access Pass"
  },
  {
    id: "q2",
    season: 1,
    question: "What alien substance was used in Project T.A.H.I.T.I. to resurrect Agent Phil Coulson?",
    options: ["Super Soldier Serum", "GH-325 (Kree Host Fluid)", "Terrigen Mist", "Centipede Serum"],
    correctIndex: 1,
    explanation: "GH-325 was derived from an ancient preserved Kree corpse stored at the classified Guest House bunker.",
    points: 30,
    clearanceReward: "Level 2 Clearance"
  },
  {
    id: "q3",
    season: 1,
    question: "Which high-ranking S.H.I.E.L.D. agent was revealed to be 'The Clairvoyant' and a high-ranking Hydra infiltrator?",
    options: ["Victoria Hand", "Jasper Sitwell", "John Garrett", "Felix Blake"],
    correctIndex: 2,
    explanation: "Agent John Garrett was the true Clairvoyant, secretly orchestrating Project Centipede using S.H.I.E.L.D. surveillance files.",
    points: 30,
    clearanceReward: "Hydra Intel Badge"
  },
  {
    id: "q4",
    season: 2,
    question: "What is Daisy Johnson's birth mother's name, who ruled Afterlife?",
    options: ["Jiaying", "Raina", "Agnes Kitsworth", "Anya"],
    correctIndex: 0,
    explanation: "Jiaying was an immortal Inhuman healer whose biological tissues regenerated through longevity extraction.",
    points: 35,
    clearanceReward: "Afterlife Access"
  },
  {
    id: "q5",
    season: 2,
    question: "Why did Alphonso 'Mack' Mackenzie cut off Director Phil Coulson's left hand?",
    options: ["Hydra laser severed it", "To prevent Terrigen crystal petrification from spreading", "It was infected with Chitauri virus", "Mack was under mind control"],
    correctIndex: 1,
    explanation: "Coulson caught a falling Terrigen crystal, which immediately began turning his arm to stone. Mack swung an axe to save Coulson's life.",
    points: 35,
    clearanceReward: "Field Medic Commendation"
  },
  {
    id: "q6",
    season: 3,
    question: "What was the name of the desolate blue alien planet where Jemma Simmons was trapped for six months?",
    options: ["Chronyca-2", "Maveth", "Kitson", "Sakaar"],
    correctIndex: 1,
    explanation: "Maveth (Hebrew for 'Death') was the barren world where Hydra's ancient exiled god, Hive, was trapped.",
    points: 40,
    clearanceReward: "Astronavigation Medal"
  },
  {
    id: "q7",
    season: 3,
    question: "What weapon did Mack famously invent by modifying a Remington shotgun?",
    options: ["The Shockwave Rifle", "The Shotgun-Axe", "The Dendrotoxin Cannon", "The Plasma Bayonet"],
    correctIndex: 1,
    explanation: "Mack combined a heavy shotgun with a battle-axe blade, creating S.H.I.E.L.D.'s most iconic improvised weapon.",
    points: 35,
    clearanceReward: "Armory Master Pin"
  },
  {
    id: "q8",
    season: 4,
    question: "What vehicle does Robbie Reyes drive as the Ghost Rider?",
    options: ["1962 Corvette Lola", "1969 Dodge Charger 'Lucy'", "Harley-Davidson Fat Boy", "1970 Plymouth Barracuda"],
    correctIndex: 1,
    explanation: "Robbie Reyes channels the Spirit of Vengeance into his black 1969 Dodge Charger, which can emit hellfire from its tires and engine.",
    points: 40,
    clearanceReward: "Hellfire Insignia"
  },
  {
    id: "q9",
    season: 4,
    question: "In the virtual reality of the Framework, what was Fitz's dreaded alter-ego title?",
    options: ["The Clairvoyant", "The Doctor", "The Grand Inquisitor", "Madame Hydra's Consort"],
    correctIndex: 1,
    explanation: "Without his mother's warmth and guided by his harsh father Alistair, Fitz became 'The Doctor', head of Hydra Science.",
    points: 45,
    clearanceReward: "Framework Decryption Key"
  },
  {
    id: "q10",
    season: 5,
    question: "Who was the Kree governor of the Lighthouse bunker in the dystopian year 2091?",
    options: ["Ronan the Accuser", "Kasius", "Sinara", "Faulnak"],
    correctIndex: 1,
    explanation: "Kasius was the disgraced Kree nobleman exiled by his father to rule the remnants of human survivors in the shattered Earth.",
    points: 45,
    clearanceReward: "Level 7 Clearance"
  },
  {
    id: "q11",
    season: 6,
    question: "What was the name of the parasite creatures that invaded bodies and turned them into crystalline spires?",
    options: ["The Chitauri", "The Shrike", "The Kree Centipedes", "The Brood"],
    correctIndex: 1,
    explanation: "The Shrike were bat-like crystalline parasites unleashed by Izel to consume worlds for her non-corporeal dimension.",
    points: 45,
    clearanceReward: "Level 8 Clearance"
  },
  {
    id: "q12",
    season: 7,
    question: "In the time loop episode 'As I Have Always Been', what vital component does Enoch sacrifice to fix the Time Drive?",
    options: ["His cerebral positron core", "His Electrochron energy regulator", "His optical chronometer", "His synthetic heart pump"],
    correctIndex: 1,
    explanation: "Enoch willingly removed his own Electrochron regulator from his chest to power the Time Drive, ending his 30,000-year existence.",
    points: 50,
    clearanceReward: "DIRECTOR Clearance Access"
  }
];
