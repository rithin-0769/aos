import React, { useState, useRef } from 'react';
import { UserProfile, TriviaQuestion, EasterEggItem } from '../types';
import { sound } from '../utils/audio';
import confetti from 'canvas-confetti';
import {
  Shield,
  Award,
  CheckCircle2,
  XCircle,
  Lock,
  Unlock,
  User,
  Star,
  HelpCircle,
  FileText,
  Sparkles,
  Tag,
  Camera,
  Upload,
  Image as ImageIcon,
  Trash2,
  Filter,
  Check,
  Scan
} from 'lucide-react';

interface ClearanceSystemProps {
  userProfile: UserProfile;
  onUpdateProfile: (updated: Partial<UserProfile>) => void;
  triviaQuestions: TriviaQuestion[];
  easterEggs: EasterEggItem[];
  onFindEasterEgg?: (id: string) => void;
}

interface PresetAvatar {
  id: string;
  name: string;
  role: string;
  url: string;
}

const PRESET_AVATARS: PresetAvatar[] = [
  {
    id: 'coulson',
    name: 'Phil Coulson',
    role: 'Director / Level 7',
    url: '/images/phil-coulson.webp'
  },
  {
    id: 'quake',
    name: 'Daisy Johnson',
    role: 'Quake / Inhuman',
    url: '/images/daisy-johnson.webp'
  },
  {
    id: 'may',
    name: 'Melinda May',
    role: 'The Cavalry / Ops',
    url: '/images/may.webp'
  },
  {
    id: 'fitz',
    name: 'Leo Fitz',
    role: 'Engineering Lead',
    url: '/images/fitz.webp'
  },
  {
    id: 'simmons',
    name: 'Jemma Simmons',
    role: 'Bio-Chem Specialist',
    url: '/images/simmons.webp'
  },
  {
    id: 'mack',
    name: 'Alphonso Mack',
    role: 'Shotgun-Axe Director',
    url: '/images/mack.webp'
  },
  {
    id: 'ward',
    name: 'Grant Ward',
    role: 'Hydra / Specialist',
    url: '/images/ward.webp'
  },
  {
    id: 'specops',
    name: 'Tactical Operative',
    role: 'STRIKE Black Ops',
    url: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=300&auto=format&fit=crop&q=80'
  }
];

export const ClearanceSystem: React.FC<ClearanceSystemProps> = ({
  userProfile,
  onUpdateProfile,
  triviaQuestions,
  easterEggs,
  onFindEasterEgg
}) => {
  const [activeTab, setActiveTab] = useState<'badge' | 'trivia' | 'vault' | 'eggs'>('badge');
  const [currentTriviaIdx, setCurrentTriviaIdx] = useState<number>(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [triviaFeedback, setTriviaFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [answeredMap, setAnsweredMap] = useState<Record<string, boolean>>({});

  // Badge editing state
  const [isEditingBadge, setIsEditingBadge] = useState<boolean>(false);
  const [tempName, setTempName] = useState<string>(userProfile.agentName);
  const [tempCallSign, setTempCallSign] = useState<string>(userProfile.callSign);
  const [tempDivision, setTempDivision] = useState<UserProfile['division']>(userProfile.division);
  const [tempAvatarUrl, setTempAvatarUrl] = useState<string | undefined>(userProfile.avatarUrl);
  const [tempFilter, setTempFilter] = useState<UserProfile['photoFilter']>(userProfile.photoFilter || 'biometric-cyan');

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const currentQ = triviaQuestions[currentTriviaIdx];

  const handleAnswerSubmit = (optionIdx: number) => {
    if (triviaFeedback !== null) return;
    setSelectedAnswer(optionIdx);

    const isCorrect = optionIdx === currentQ.correctIndex;
    if (isCorrect) {
      setTriviaFeedback('correct');
      sound.playClearancePromotion();
      try {
        confetti({
          particleCount: 60,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch {
        // Confetti fallback
      }

      const nextXp = userProfile.xp + currentQ.points;
      const newLevel = Math.min(10, Math.floor(nextXp / 60) + 1);

      onUpdateProfile({
        xp: nextXp,
        clearanceLevel: newLevel,
        completedTrivia: [...userProfile.completedTrivia, currentQ.id]
      });
      setAnsweredMap(prev => ({ ...prev, [currentQ.id]: true }));
    } else {
      setTriviaFeedback('wrong');
      sound.playGlitch();
      setAnsweredMap(prev => ({ ...prev, [currentQ.id]: false }));
    }
  };

  const handleNextQuestion = () => {
    setSelectedAnswer(null);
    setTriviaFeedback(null);
    setCurrentTriviaIdx((prev) => (prev + 1) % triviaQuestions.length);
    sound.playBeep(520, 0.05);
  };

  // Handle local photo upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        const dataUrl = reader.result;
        setTempAvatarUrl(dataUrl);
        onUpdateProfile({ avatarUrl: dataUrl });
        sound.playBeep(880, 0.08);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSelectPreset = (url: string) => {
    setTempAvatarUrl(url);
    onUpdateProfile({ avatarUrl: url });
    sound.playBeep(720, 0.06);
  };

  const handleRemovePhoto = () => {
    setTempAvatarUrl(undefined);
    onUpdateProfile({ avatarUrl: undefined });
    sound.playBeep(320, 0.08);
  };

  const handleSelectFilter = (filter: UserProfile['photoFilter']) => {
    setTempFilter(filter);
    onUpdateProfile({ photoFilter: filter });
    sound.playBeep(640, 0.05);
  };

  const saveBadge = () => {
    onUpdateProfile({
      agentName: tempName,
      callSign: tempCallSign,
      division: tempDivision,
      avatarUrl: tempAvatarUrl,
      photoFilter: tempFilter
    });
    setIsEditingBadge(false);
    sound.playBeep(880, 0.08);
  };

  const isDirector = userProfile.clearanceLevel >= 7 || userProfile.xp >= 300;

  const handleLanyardClick = () => {
    if (onFindEasterEgg) {
      onFindEasterEgg('egg-koenig-lanyard');
    }
  };

  const hasFoundLanyard = userProfile.foundEasterEggs.includes('egg-koenig-lanyard');

  // Photo Filter Styling Helper
  const getFilterClass = (filterType?: UserProfile['photoFilter']) => {
    switch (filterType) {
      case 'biometric-cyan':
        return 'filter contrast-125 brightness-105 hue-rotate-15 saturate-150';
      case 'hydra-red':
        return 'filter sepia(1) saturate(5) hue-rotate(-50deg) contrast(1.2)';
      case 'framework-green':
        return 'filter sepia(1) saturate(6) hue-rotate(85deg) contrast(1.3)';
      case 'vintage-sepia':
        return 'filter sepia(0.8) contrast(1.1) brightness(0.9)';
      default:
        return '';
    }
  };

  const currentPhoto = userProfile.avatarUrl || tempAvatarUrl;
  const currentFilter = userProfile.photoFilter || tempFilter || 'biometric-cyan';

  return (
    <div className="space-y-6">
      {/* Hidden file input for photo upload */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileUpload}
        className="hidden"
      />

      {/* Top Level Summary Bar */}
      <div className="p-4 sm:p-5 rounded-2xl border border-sky-800/40 bg-slate-950/80 backdrop-blur-md flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-sky-600 to-indigo-900 border border-sky-400 flex items-center justify-center text-white text-lg font-heading font-bold shadow-lg shadow-sky-600/30 overflow-hidden">
            {currentPhoto ? (
              <img src={currentPhoto} alt="Agent" className={`w-full h-full object-cover ${getFilterClass(currentFilter)}`} />
            ) : (
              isDirector ? '★' : `L0${userProfile.clearanceLevel}`
            )}
          </div>
          <div>
            <div className="text-[11px] font-mono-tech text-sky-400 uppercase tracking-widest flex items-center gap-1.5">
              <span>SECURITY CREDENTIALS</span>
              {isDirector && <span className="text-amber-400 font-bold">[DIRECTOR PRIVILEGES]</span>}
            </div>
            <h3 className="text-lg font-heading font-bold text-white">
              Agent {userProfile.agentName} // "{userProfile.callSign}"
            </h3>
            <div className="text-xs text-slate-400 font-mono-tech">
              Division: {userProfile.division} | Total XP: <span className="text-emerald-400 font-bold">{userProfile.xp}</span>
            </div>
          </div>
        </div>

        {/* Tab switchers */}
        <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs font-mono-tech">
          <button
            onClick={() => { setActiveTab('badge'); sound.playBeep(500, 0.04); }}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'badge' ? 'bg-sky-600 text-white font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            ID BADGE
          </button>
          <button
            onClick={() => { setActiveTab('trivia'); sound.playBeep(500, 0.04); }}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'trivia' ? 'bg-sky-600 text-white font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            ACADEMY EXAM
          </button>
          <button
            onClick={() => { setActiveTab('vault'); sound.playBeep(500, 0.04); }}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1 ${
              activeTab === 'vault' ? 'bg-amber-600 text-white font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            {isDirector ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
            <span>DIRECTOR'S VAULT</span>
          </button>
          <button
            onClick={() => { setActiveTab('eggs'); sound.playBeep(500, 0.04); }}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'eggs' ? 'bg-sky-600 text-white font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            EASTER EGGS ({userProfile.foundEasterEggs.length}/{easterEggs.length})
          </button>
        </div>
      </div>

      {/* Tab 1: Interactive S.H.I.E.L.D. ID Badge */}
      {activeTab === 'badge' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* High-Tech Badge Card */}
          <div className="lg:col-span-6 flex flex-col items-center">
            <div className="w-full max-w-md p-6 rounded-2xl bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 border-2 border-sky-500/70 shadow-[0_0_35px_rgba(14,165,233,0.35)] relative overflow-hidden">
              {/* Lanyard Clip Hole */}
              <div className="w-16 h-3 bg-slate-950 border border-slate-700 rounded-full mx-auto mb-4 flex items-center justify-center">
                <div className="w-8 h-1 bg-slate-800 rounded-full" />
              </div>

              {/* Watermark Logo */}
              <div className="absolute right-4 bottom-4 w-32 h-32 opacity-10 pointer-events-none">
                <Shield className="w-full h-full text-sky-400" />
              </div>

              {/* Badge Header */}
              <div className="flex items-center justify-between border-b border-sky-800/60 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <Shield className="w-6 h-6 text-sky-400" />
                  <div>
                    <div className="font-heading font-black text-sm text-sky-200 tracking-wider">
                      S.H.I.E.L.D.
                    </div>
                    <div className="text-[9px] font-mono-tech text-slate-400">
                      STRATEGIC HOMELAND INTERVENTION
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="px-2 py-0.5 bg-sky-950 border border-sky-500/50 rounded text-[10px] font-mono-tech text-sky-300 font-bold">
                    CLEARANCE: {isDirector ? 'DIRECTOR' : `LEVEL 0${userProfile.clearanceLevel}`}
                  </div>
                </div>
              </div>

              {/* Badge Body with Photo Slot */}
              <div className="flex gap-4 items-center mb-4">
                {/* PHOTO CONTAINER */}
                <div className="relative group">
                  <div className="w-28 h-32 rounded-xl bg-slate-900 border-2 border-sky-400/80 flex flex-col items-center justify-center overflow-hidden shadow-lg relative">
                    {currentPhoto ? (
                      <>
                        <img
                          src={currentPhoto}
                          alt="Agent Identification"
                          className={`w-full h-full object-cover transition-all ${getFilterClass(currentFilter)}`}
                        />

                        {/* Biometric Corner Brackets HUD */}
                        <div className="absolute inset-1 pointer-events-none">
                          <div className="absolute top-0 left-0 w-2.5 h-2.5 border-t-2 border-l-2 border-cyan-400" />
                          <div className="absolute top-0 right-0 w-2.5 h-2.5 border-t-2 border-r-2 border-cyan-400" />
                          <div className="absolute bottom-0 left-0 w-2.5 h-2.5 border-b-2 border-l-2 border-cyan-400" />
                          <div className="absolute bottom-0 right-0 w-2.5 h-2.5 border-b-2 border-r-2 border-cyan-400" />
                        </div>

                        {/* Biometric Scanline Bar */}
                        <div className="absolute inset-x-0 top-0 h-1 bg-cyan-400/70 shadow-[0_0_8px_#22d3ee] animate-pulse pointer-events-none" />

                        {/* Bottom Tag */}
                        <div className="absolute bottom-0 inset-x-0 bg-slate-950/80 backdrop-blur-[2px] py-0.5 text-center text-[8px] font-mono-tech text-cyan-300 border-t border-cyan-500/30">
                          BIOMETRIC VERIFIED
                        </div>
                      </>
                    ) : (
                      <div className="flex flex-col items-center justify-center p-2 text-center text-slate-500">
                        <User className="w-10 h-10 text-sky-400/70 mb-1" />
                        <span className="text-[9px] font-mono-tech text-slate-400">NO PHOTO LOADED</span>
                        <span className="text-[8px] font-mono-tech text-sky-400">CLICK TO ADD</span>
                      </div>
                    )}
                  </div>

                  {/* Quick Photo Overlay Action Button */}
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    title="Upload or change ID photo"
                    className="absolute -bottom-2 -right-2 p-1.5 rounded-full bg-sky-600 hover:bg-sky-500 text-white shadow-lg border border-sky-300 transition-transform active:scale-90"
                  >
                    <Camera className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Identity Info */}
                <div className="flex-1 space-y-1">
                  <div className="text-[10px] font-mono-tech text-slate-500 uppercase">OPERATIVE IDENTITY</div>
                  <div className="text-xl font-heading font-bold text-white tracking-wide">
                    {userProfile.agentName}
                  </div>
                  <div className="text-xs font-mono-tech text-sky-400 font-semibold">
                    CALL-SIGN: "{userProfile.callSign}"
                  </div>
                  <div className="text-[11px] font-mono-tech text-slate-300 pt-1">
                    DIVISION: <span className="text-amber-400 font-bold">{userProfile.division}</span>
                  </div>
                  <div className="text-[9px] font-mono-tech text-emerald-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                    <span>AUTH: S.H.I.E.L.D. TRISKELION ARCHIVES</span>
                  </div>
                </div>
              </div>

              {/* Barcode & Holographic Stripe */}
              <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                <div className="h-6 flex items-center gap-0.5">
                  {[4, 2, 6, 1, 3, 5, 2, 7, 3, 1, 4, 6, 2, 5, 3, 4, 1, 3].map((w, i) => (
                    <div key={i} className="bg-slate-300 h-full" style={{ width: `${w * 1.5}px` }} />
                  ))}
                </div>
                <div className="text-[9px] font-mono-tech text-slate-500 tracking-widest">
                  SSR-TRISKELION-AUTH
                </div>
              </div>
            </div>

            {/* Quick Photo Action Pills */}
            <div className="flex flex-wrap gap-2 mt-4 justify-center">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-sky-950 hover:bg-sky-900 border border-sky-500/50 rounded-lg text-xs font-mono-tech text-sky-300 transition-colors shadow"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>UPLOAD CUSTOM PHOTO</span>
              </button>

              {currentPhoto && (
                <button
                  onClick={handleRemovePhoto}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-red-950/60 hover:bg-red-900 border border-red-700/50 rounded-lg text-xs font-mono-tech text-red-300 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>REMOVE PHOTO</span>
                </button>
              )}
            </div>
          </div>

          {/* Photo Presets & Credential Customizer */}
          <div className="lg:col-span-6 space-y-4">
            {/* PHOTO PICKER & SECURITY FILTERS */}
            <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-heading font-bold text-sky-300 text-sm flex items-center gap-1.5">
                  <ImageIcon className="w-4 h-4 text-sky-400" />
                  <span>SELECT AGENT OPERATIVE AVATAR</span>
                </h4>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="text-[11px] font-mono-tech text-sky-400 hover:text-white underline flex items-center gap-1"
                >
                  <Upload className="w-3 h-3" />
                  <span>Upload File</span>
                </button>
              </div>

              {/* Preset Avatars Grid */}
              <div className="grid grid-cols-4 gap-2">
                {PRESET_AVATARS.map((avatar) => {
                  const isSelected = currentPhoto === avatar.url;
                  return (
                    <button
                      key={avatar.id}
                      onClick={() => handleSelectPreset(avatar.url)}
                      className={`group relative rounded-lg overflow-hidden border p-1 text-center transition-all ${
                        isSelected
                          ? 'border-sky-400 bg-sky-950/80 shadow-md shadow-sky-500/40'
                          : 'border-slate-800 bg-slate-950 hover:border-slate-700'
                      }`}
                    >
                      <div className="w-full h-14 rounded overflow-hidden mb-1 bg-slate-900">
                        <img
                          src={avatar.url}
                          alt={avatar.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      </div>
                      <div className="text-[10px] font-mono-tech font-bold text-slate-200 truncate">
                        {avatar.name.split(' ')[0]}
                      </div>
                      {isSelected && (
                        <div className="absolute top-1 right-1 w-3.5 h-3.5 rounded-full bg-sky-500 text-slate-950 flex items-center justify-center">
                          <Check className="w-2.5 h-2.5 stroke-[3]" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Photo Holographic Security Filters */}
              <div className="pt-2 border-t border-slate-800">
                <div className="flex items-center gap-1 text-[11px] font-mono-tech text-slate-400 mb-2">
                  <Filter className="w-3 h-3 text-sky-400" />
                  <span>HOLOGRAPHIC SECURITY FILTER:</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 text-[10px] font-mono-tech">
                  {[
                    { id: 'biometric-cyan', label: 'Biometric Cyan' },
                    { id: 'none', label: 'Natural Color' },
                    { id: 'hydra-red', label: 'Hydra Crimson' },
                    { id: 'framework-green', label: 'Framework CRT' },
                    { id: 'vintage-sepia', label: '1940s SSR Sepia' },
                  ].map((filterOption) => (
                    <button
                      key={filterOption.id}
                      onClick={() => handleSelectFilter(filterOption.id as UserProfile['photoFilter'])}
                      className={`px-2 py-1.5 rounded border text-center transition-all ${
                        currentFilter === filterOption.id
                          ? 'bg-sky-950 border-sky-400 text-sky-200 font-bold'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      {filterOption.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Credential Details Editor */}
            <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-800">
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-heading font-bold text-sky-300 text-sm">
                  CUSTOMIZE CREDENTIALS
                </h4>
                <button
                  onClick={() => setIsEditingBadge(!isEditingBadge)}
                  className="text-xs font-mono-tech text-sky-400 hover:text-white"
                >
                  {isEditingBadge ? 'CANCEL' : 'EDIT CREDENTIALS'}
                </button>
              </div>

              {isEditingBadge ? (
                <div className="space-y-3">
                  <div>
                    <label className="text-[10px] font-mono-tech text-slate-400 block mb-1">AGENT FULL NAME</label>
                    <input
                      type="text"
                      value={tempName}
                      onChange={(e) => setTempName(e.target.value)}
                      className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-mono-tech text-slate-400 block mb-1">COVERT CALL-SIGN</label>
                    <input
                      type="text"
                      value={tempCallSign}
                      onChange={(e) => setTempCallSign(e.target.value)}
                      className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-mono-tech text-slate-400 block mb-1">SPECIALIST DIVISION</label>
                    <select
                      value={tempDivision}
                      onChange={(e) => setTempDivision(e.target.value as UserProfile['division'])}
                      className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded text-xs text-white"
                    >
                      <option value="Ops">Operations (Field Strike)</option>
                      <option value="Sci-Tech">Science & Technology (FitzSimmons)</option>
                      <option value="Communications">Communications & Cyber Infiltration</option>
                      <option value="Tactical Medical">Tactical Bio-Medical</option>
                    </select>
                  </div>
                  <button
                    onClick={saveBadge}
                    className="w-full py-2 bg-sky-600 hover:bg-sky-500 text-white font-mono-tech text-xs font-bold rounded shadow-lg shadow-sky-600/30"
                  >
                    SAVE & ENCODE ID BADGE
                  </button>
                </div>
              ) : (
                <p className="text-xs text-slate-400 leading-relaxed">
                  Every S.H.I.E.L.D. agent is issued an official biometric badge encoded with their designated clearance rank. Advance clearance by scoring in S.H.I.E.L.D. Academy exams and finding classified field Easter eggs.
                </p>
              )}
            </div>

            {/* Secret Koenig Lanyard Easter Egg Button */}
            <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-800 flex items-center justify-between">
              <div>
                <div className="text-xs font-heading font-bold text-slate-200">
                  Agent Koenig's Lanyard Station
                </div>
                <div className="text-[11px] text-slate-400">
                  "I'd like to issue you your S.H.I.E.L.D. lanyard."
                </div>
              </div>
              <button
                onClick={handleLanyardClick}
                title={hasFoundLanyard ? "Koenig Lanyard Acquired!" : "Tap to receive lanyard from Agent Koenig"}
                className={`p-2.5 rounded-lg border font-mono-tech text-xs transition-all ${
                  hasFoundLanyard
                    ? 'bg-amber-950 border-amber-500 text-amber-300'
                    : 'bg-slate-950 border-slate-700 text-slate-400 hover:border-amber-400'
                }`}
              >
                🏷️ LANYARD
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: S.H.I.E.L.D. Academy Trivia Challenge */}
      {activeTab === 'trivia' && (
        <div className="p-6 rounded-2xl border border-sky-800/40 bg-slate-950/80">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-sky-400" />
              <div>
                <h3 className="font-heading font-bold text-lg text-white">
                  S.H.I.E.L.D. Academy Examination // Question {currentTriviaIdx + 1} of {triviaQuestions.length}
                </h3>
                <div className="text-xs text-slate-400 font-mono-tech">
                  SEASON 0{currentQ.season} PROTOCOL EXAM // WORTH {currentQ.points} XP
                </div>
              </div>
            </div>

            <div className="text-xs font-mono-tech text-slate-400">
              Score: <span className="text-sky-400 font-bold">{userProfile.xp} XP</span>
            </div>
          </div>

          {/* Question Text */}
          <div className="p-4 bg-slate-900/80 rounded-xl border border-slate-800 mb-4">
            <p className="text-base text-slate-100 font-heading font-semibold leading-relaxed">
              {currentQ.question}
            </p>
          </div>

          {/* Options Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
            {currentQ.options.map((opt, idx) => {
              const isSelected = selectedAnswer === idx;
              let btnClass = "bg-slate-900/60 border-slate-800 text-slate-300 hover:border-sky-500/50 hover:bg-slate-900";

              if (triviaFeedback !== null) {
                if (idx === currentQ.correctIndex) {
                  btnClass = "bg-emerald-950/80 border-emerald-500 text-emerald-200 font-bold shadow-lg shadow-emerald-950/50";
                } else if (isSelected) {
                  btnClass = "bg-red-950/80 border-red-500 text-red-200";
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleAnswerSubmit(idx)}
                  disabled={triviaFeedback !== null}
                  className={`p-3.5 rounded-xl border text-left text-xs font-mono-tech transition-all flex items-start gap-2.5 ${btnClass}`}
                >
                  <span className="w-5 h-5 rounded-full bg-slate-950 border border-slate-700 flex items-center justify-center text-[10px] shrink-0 font-bold">
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span className="pt-0.5 leading-snug">{opt}</span>
                </button>
              );
            })}
          </div>

          {/* Feedback & Explanation */}
          {triviaFeedback && (
            <div className={`p-4 rounded-xl border mb-4 text-xs font-mono-tech ${
              triviaFeedback === 'correct'
                ? 'bg-emerald-950/60 border-emerald-500/60 text-emerald-200'
                : 'bg-red-950/60 border-red-500/60 text-red-200'
            }`}>
              <div className="font-bold flex items-center gap-2 mb-1 text-sm">
                {triviaFeedback === 'correct' ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>CORRECT! +{currentQ.points} XP AWARDED</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-4 h-4 text-red-400" />
                    <span>INCORRECT ANSWER // STUDY S.H.I.E.L.D. LOGS</span>
                  </>
                )}
              </div>
              <p className="text-slate-300 leading-relaxed">
                {currentQ.explanation}
              </p>
            </div>
          )}

          {/* Next Button */}
          {triviaFeedback && (
            <div className="flex justify-end">
              <button
                onClick={handleNextQuestion}
                className="px-6 py-2.5 bg-sky-600 hover:bg-sky-500 text-white font-mono-tech text-xs tracking-wider font-bold rounded-xl shadow-lg shadow-sky-600/40"
              >
                PROCEED TO NEXT EXAM MODULE →
              </button>
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Director's Confidential Vault */}
      {activeTab === 'vault' && (
        <div className="p-6 rounded-2xl border border-amber-800/40 bg-slate-950/80">
          {!isDirector ? (
            <div className="py-12 text-center max-w-md mx-auto space-y-3">
              <Lock className="w-12 h-12 text-amber-500/60 mx-auto" />
              <h3 className="text-lg font-heading font-bold text-white uppercase">
                DIRECTOR CLEARANCE REQUIRED
              </h3>
              <p className="text-xs text-slate-400 font-mono-tech leading-relaxed">
                This vault contains confidential S.H.I.E.L.D. directives, behind-the-scenes production secrets, and Omega-level protocols. You currently hold Level {userProfile.clearanceLevel}. Reach 300 XP to unlock.
              </p>
              <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800">
                <div
                  className="bg-amber-400 h-full transition-all duration-300"
                  style={{ width: `${Math.min(100, (userProfile.xp / 300) * 100)}%` }}
                />
              </div>
              <div className="text-[11px] font-mono-tech text-amber-400">
                Current Progress: {userProfile.xp} / 300 XP
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-xs font-mono-tech text-amber-400 pb-2 border-b border-amber-900/50">
                <Unlock className="w-4 h-4" />
                <span>CONFIDENTIAL DIRECTOR'S LOGBOOK // TOP SECRET ACCESS GRANTED</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono-tech">
                <div className="p-4 bg-slate-900/80 rounded-xl border border-amber-900/40">
                  <div className="text-amber-300 font-bold mb-1">DIRECTOR'S NOTE #01: THE TAHITI RESURRECTION</div>
                  <p className="text-slate-300 leading-relaxed">
                    Clark Gregg was originally meant to remain deceased after The Avengers (2012). Joss and Jed Whedon devised Project T.A.H.I.T.I. using ancient extraterrestrial biology so Phil Coulson could lead his own family of misfits.
                  </p>
                </div>

                <div className="p-4 bg-slate-900/80 rounded-xl border border-amber-900/40">
                  <div className="text-amber-300 font-bold mb-1">DIRECTOR'S NOTE #02: GHOST RIDER'S VFX FLAME</div>
                  <p className="text-slate-300 leading-relaxed">
                    Gabriel Luna wore a tracking hood with animated LED light strips to cast practical flickering orange illumination across his face, car, and fellow actors during filming, creating photorealistic hellfire.
                  </p>
                </div>

                <div className="p-4 bg-slate-900/80 rounded-xl border border-amber-900/40">
                  <div className="text-amber-300 font-bold mb-1">DIRECTOR'S NOTE #03: THE SHOTGUN-AXE BIRTH</div>
                  <p className="text-slate-300 leading-relaxed">
                    Mack's repeated suggestion of a shotgun with an axe attached was written as a playful running gag by Maurissa Tancharoen. Due to overwhelming fan clamor, the props master built the functional prop for the Season 3 finale.
                  </p>
                </div>

                <div className="p-4 bg-slate-900/80 rounded-xl border border-amber-900/40">
                  <div className="text-amber-300 font-bold mb-1">DIRECTOR'S NOTE #04: THE KOENIG LANYARDS</div>
                  <p className="text-slate-300 leading-relaxed">
                    Patton Oswalt played multiple identical brothers (Eric, Billy, Sam, Thurston) and their sister L.T. The lanyards became the ultimate emblem of S.H.I.E.L.D.'s endearing blend of military bureaucracy and heartfelt humanity.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 4: Easter Egg Hunt Tracker */}
      {activeTab === 'eggs' && (
        <div className="p-6 rounded-2xl border border-sky-800/40 bg-slate-950/80">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <h3 className="font-heading font-bold text-lg text-white">
              Lemons & Lanyards Easter Egg Hunt
            </h3>
          </div>
          <p className="text-xs text-slate-400 font-mono-tech mb-4">
            Hidden objects and secret touch gestures are scattered across the app interfaces. Discover them all to unlock maximum clearance bonuses!
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {easterEggs.map((egg) => {
              const isFound = userProfile.foundEasterEggs.includes(egg.id);
              return (
                <div
                  key={egg.id}
                  className={`p-3.5 rounded-xl border text-xs font-mono-tech transition-all ${
                    isFound
                      ? 'bg-amber-950/40 border-amber-500/60 text-amber-200'
                      : 'bg-slate-900/40 border-slate-800 text-slate-500'
                  }`}
                >
                  <div className="flex items-center justify-between font-bold mb-1">
                    <span className="flex items-center gap-1.5">
                      <span>{isFound ? '✅' : '🔒'}</span>
                      <span className={isFound ? 'text-amber-300' : 'text-slate-400'}>{egg.name}</span>
                    </span>
                    <span className="text-[10px]">{isFound ? `+${egg.clearanceBonus} XP` : 'LOCKED'}</span>
                  </div>
                  <p className="text-[11px] text-slate-300 mb-1.5">{egg.description}</p>
                  <div className="text-[10px] text-slate-500">
                    <strong className="text-slate-400">CLUE: </strong>{egg.locationHint}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
