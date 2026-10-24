import React, { useState } from 'react';
import { CharacterDossier } from '../types';
import { sound } from '../utils/audio';
import {
  AlertTriangle,
  Terminal,
  ShieldAlert,
  Power,
  Eye,
  Radio,
  Lock,
  Zap,
  Activity,
  Cpu
} from 'lucide-react';

interface FrameworkOverlayProps {
  characters: CharacterDossier[];
  isActive: boolean;
  onToggle: () => void;
}

export const FrameworkOverlay: React.FC<FrameworkOverlayProps> = ({
  characters,
  isActive,
  onToggle
}) => {
  const [selectedAgentId, setSelectedAgentId] = useState<string>('leo-fitz');

  if (!isActive) return null;

  const charactersWithFramework = characters.filter(c => Boolean(c.frameworkProfile));
  const activeChar = charactersWithFramework.find(c => c.id === selectedAgentId) || charactersWithFramework[0];
  const fw = activeChar?.frameworkProfile;

  const handleSelectChar = (id: string) => {
    setSelectedAgentId(id);
    sound.playGlitch();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/95 text-emerald-400 font-mono-tech select-none">
      {/* CRT Scanline Overlay */}
      <div className="fixed inset-0 pointer-events-none bg-[linear-gradient(rgba(16,185,129,0.08)_1px,transparent_1px)] [background-size:100%_3px] opacity-90 z-50" />

      {/* Screen Glitch Vignette */}
      <div className="fixed inset-0 pointer-events-none shadow-[inset_0_0_100px_rgba(6,78,59,0.8)] z-50" />

      <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6 relative z-10">
        {/* Top Hydra Compliance Header */}
        <div className="p-4 sm:p-5 rounded-2xl bg-zinc-950 border-2 border-emerald-500/80 shadow-[0_0_30px_rgba(16,185,129,0.3)] flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-950 border-2 border-emerald-400 flex items-center justify-center text-emerald-300 text-2xl shadow-lg">
              🐙
            </div>
            <div>
              <div className="text-xs text-emerald-500 tracking-widest flex items-center gap-2">
                <span>HYDRA CITIZEN COMPLIANCE MONITOR</span>
                <span className="text-red-400 font-bold animate-pulse">[SIMULATION OVERRIDE]</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-heading font-black text-emerald-300 tracking-wider">
                THE FRAMEWORK // AIDA'S UTOPIA
              </h1>
              <p className="text-[11px] text-emerald-600">
                DEPARTMENT OF SOCIAL COHESION • HAIL HYDRA • S.H.I.E.L.D. IS OUTLAWED
              </p>
            </div>
          </div>

          {/* Exit Simulation / Wake Up Button */}
          <button
            onClick={() => {
              sound.playGlitch();
              onToggle();
            }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-950/80 hover:bg-red-900 border-2 border-red-500 text-red-200 font-bold text-xs tracking-wider transition-all transform active:scale-95 shadow-[0_0_20px_#ef4444]"
          >
            <Power className="w-4 h-4 animate-spin" style={{ animationDuration: '4s' }} />
            <span>AWAKEN / EXIT FRAMEWORK</span>
          </button>
        </div>

        {/* Character Selection Tabs in the Framework */}
        <div className="flex bg-zinc-950 p-1.5 rounded-xl border border-emerald-800/80 overflow-x-auto gap-2">
          {charactersWithFramework.map(char => {
            const isSelected = char.id === selectedAgentId;
            const profile = char.frameworkProfile!;
            return (
              <button
                key={char.id}
                onClick={() => handleSelectChar(char.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs whitespace-nowrap transition-all border ${
                  isSelected
                    ? 'bg-emerald-950 border-emerald-400 text-emerald-200 font-bold shadow-md shadow-emerald-500/40'
                    : 'bg-zinc-900/60 border-zinc-800 text-emerald-600 hover:text-emerald-300'
                }`}
              >
                <span>{profile.alias.toUpperCase()}</span>
                <span className={`text-[9px] px-1.5 py-0.2 rounded ${
                  profile.allegiance === 'Hydra'
                    ? 'bg-red-950 text-red-400'
                    : 'bg-blue-950 text-blue-300'
                }`}>
                  {profile.allegiance}
                </span>
              </button>
            );
          })}
        </div>

        {/* Framework Identity Dossier Card */}
        {fw && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Identity Badge */}
            <div className="lg:col-span-5 p-6 rounded-3xl bg-zinc-950 border-2 border-emerald-500/80 shadow-[0_0_35px_rgba(16,185,129,0.25)] space-y-4">
              <div className="flex items-center justify-between border-b border-emerald-900 pb-3">
                <div className="text-xs uppercase text-emerald-500">
                  CITIZEN IDENTIFICATION CARD
                </div>
                <div className="px-2 py-0.5 bg-emerald-950 border border-emerald-500 text-[10px] text-emerald-300 font-bold">
                  CLEARANCE: LEVEL 0{fw.clearanceLevel}
                </div>
              </div>

              <div className="flex gap-4 items-center">
                <div className="w-28 h-32 rounded-xl bg-zinc-900 border-2 border-emerald-400 overflow-hidden shrink-0 shadow-lg relative">
                  {activeChar.imageUrl ? (
                    <img
                      src={activeChar.imageUrl}
                      alt={activeChar.name}
                      className="w-full h-full object-cover filter sepia(1) saturate(6) hue-rotate(85deg) contrast(1.3)"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-emerald-600 text-2xl font-bold">
                      🐙
                    </div>
                  )}
                  <div className="absolute inset-x-0 bottom-0 bg-black/80 text-[8px] text-center text-emerald-300 py-0.5">
                    CITIZEN AUTH
                  </div>
                </div>

                <div className="space-y-1 overflow-hidden">
                  <div className="text-xs text-emerald-500">NAME IN REALITY:</div>
                  <div className="font-heading font-bold text-white text-base truncate">
                    {activeChar.name}
                  </div>
                  <div className="text-xs text-emerald-300 font-bold">
                    FRAMEWORK ALIAS: "{fw.alias}"
                  </div>
                  <div className="text-[11px] text-zinc-400">
                    STATUS: <span className="text-amber-400">{fw.status}</span>
                  </div>
                  <div className="text-[11px] text-zinc-400">
                    ALLEGIANCE: <strong className={fw.allegiance === 'Hydra' ? 'text-red-400' : 'text-blue-400'}>{fw.allegiance}</strong>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-zinc-900 rounded-xl border border-emerald-900 text-xs text-emerald-200">
                <div className="text-[10px] text-emerald-500 font-bold mb-1">OCCUPATION / ROLE:</div>
                <div className="font-bold text-emerald-300">{fw.role}</div>
              </div>
            </div>

            {/* Framework Lore & Background */}
            <div className="lg:col-span-7 p-6 rounded-3xl bg-zinc-950 border-2 border-emerald-500/80 shadow-[0_0_35px_rgba(16,185,129,0.25)] space-y-4">
              <div className="flex items-center gap-2 text-sm font-heading font-bold text-emerald-300 uppercase pb-2 border-b border-emerald-900">
                <Terminal className="w-4 h-4 text-emerald-400" />
                <span>CLASSIFIED FRAMEWORK SIMULATION TELEMETRY</span>
              </div>

              <p className="text-sm text-emerald-200 leading-relaxed font-mono">
                {fw.bio}
              </p>

              <div className="p-4 rounded-xl bg-zinc-900/90 border border-emerald-900 text-xs space-y-2">
                <div className="font-bold text-emerald-400 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  <span>DEEPEST REGRET SUBVERTED:</span>
                </div>
                <p className="text-zinc-300 leading-relaxed text-[11px]">
                  {activeChar.id === 'leo-fitz' && "Radcliffe gave Fitz his father Alistair instead of his mother, turning him into a cold, ruthless killer."}
                  {activeChar.id === 'phil-coulson' && "Coulson never joined S.H.I.E.L.D., choosing the peaceful, uneventful life of a school teacher."}
                  {activeChar.id === 'melinda-may' && "May saved the child Katya in Bahrain, leading to the Cambridge Inhuman disaster and her allegiance to Hydra."}
                  {activeChar.id === 'alphonso-mack' && "Mack's infant daughter Hope lived, giving him the family he lost, but trapping him in the simulation."}
                  {activeChar.id === 'grant-ward' && "Ward was rescued by Victoria Hand instead of John Garrett, making him a true hero of the Resistance."}
                  {activeChar.id === 'daisy-johnson' && "Skye lived a comfortable life with Ward, oblivious to her Inhuman heritage until Jemma woke her."}
                  {activeChar.id === 'jemma-simmons' && "Simmons was killed by Hydra early on, forcing her to dig out of her own grave upon entering."}
                </p>
              </div>

              {/* Secret Resistance Comms Prompt */}
              <div className="p-3 bg-blue-950/40 rounded-xl border border-blue-600/50 flex items-center justify-between text-xs text-blue-200">
                <span>LOOKING FOR THE PATRIOT & S.H.I.E.L.D. UNDERGROUND?</span>
                <span className="text-blue-400 font-bold">FREQUENCY 104.5 MHz</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
