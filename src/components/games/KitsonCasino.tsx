import React, { useState, useEffect, useCallback } from 'react';
import { Sparkles } from 'lucide-react';

type BetType = 'over' | 'under' | 'exact' | 'odd' | 'even';

interface BetRecord {
  betType: BetType;
  amount: number;
  dice: [number, number];
  total: number;
  won: boolean;
  payout: number;
}

const BET_LABELS: Record<BetType, string> = {
  over: 'Over 7',
  under: 'Under 7',
  exact: 'Exact 7',
  odd: 'Odd',
  even: 'Even',
};

const BET_MULTIPLIERS: Record<BetType, number> = {
  over: 2,
  under: 2,
  exact: 6,
  odd: 1.5,
  even: 1.5,
};

const ALIEN_SYMBOLS = ['✦', '◆', '★', '⬡', '⬢'];
const CHIP_AMOUNTS = [10, 25, 50];

const DICE_FACES: Record<number, string[][]> = {
  1: [['  ', '  ', '  '], ['  ', '●', '  '], ['  ', '  ', '  ']],
  2: [['  ', '  ', '●'], ['  ', '  ', '  '], ['●', '  ', '  ']],
  3: [['  ', '  ', '●'], ['  ', '●', '  '], ['●', '  ', '  ']],
  4: [['●', '  ', '●'], ['  ', '  ', '  '], ['●', '  ', '●']],
  5: [['●', '  ', '●'], ['  ', '●', '  '], ['●', '  ', '●']],
  6: [['●', '  ', '●'], ['●', '  ', '●'], ['●', '  ', '●']],
};

const DiceFace: React.FC<{ value: number; rolling: boolean; index: number }> = ({ value, rolling, index }) => {
  const dots = DICE_FACES[value] || DICE_FACES[1];
  return (
    <div
      className={`relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl border-2 border-amber-400/60 bg-gradient-to-br from-slate-800 via-purple-950/40 to-slate-900 flex flex-col items-center justify-center gap-0.5 sm:gap-1 ${rolling ? 'animate-dice-roll' : 'animate-dice-land'}`}
      style={{
        boxShadow: rolling
          ? '0 0 20px rgba(251, 191, 36, 0.6), 0 0 40px rgba(168, 85, 247, 0.3)'
          : '0 0 12px rgba(251, 191, 36, 0.3)',
        animationDelay: `${index * 80}ms`,
      }}
    >
      {dots.map((row, ri) => (
        <div key={ri} className="flex gap-1 sm:gap-2">
          {row.map((dot, ci) => (
            <div
              key={ci}
              className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full ${dot === '●' ? 'bg-amber-400 shadow-[0_0_6px_rgba(251,191,36,0.8)]' : 'bg-transparent'}`}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export const KitsonCasino: React.FC = () => {
  const [credits, setCredits] = useState(100);
  const [betAmount, setBetAmount] = useState(10);
  const [betType, setBetType] = useState<BetType | null>(null);
  const [dice, setDice] = useState<[number, number]>([1, 1]);
  const [rolling, setRolling] = useState(false);
  const [history, setHistory] = useState<BetRecord[]>([]);
  const [totalWinnings, setTotalWinnings] = useState(0);
  const [showResult, setShowResult] = useState<'win' | 'lose' | null>(null);
  const [lastPayout, setLastPayout] = useState(0);
  const [highRoller, setHighRoller] = useState(false);
  const [floatingSymbols, setFloatingSymbols] = useState<{ id: number; symbol: string; x: number; delay: number }[]>([]);

  // Generate floating background symbols
  useEffect(() => {
    const symbols = Array.from({ length: 18 }, (_, i) => ({
      id: i,
      symbol: ALIEN_SYMBOLS[i % ALIEN_SYMBOLS.length],
      x: Math.random() * 100,
      delay: Math.random() * 8,
    }));
    setFloatingSymbols(symbols);
  }, []);

  useEffect(() => {
    if (credits >= 500 && !highRoller) {
      setHighRoller(true);
    }
  }, [credits, highRoller]);

  const rollDice = useCallback(() => {
    if (!betType || rolling || credits <= 0) return;
    if (betAmount > credits) return;

    setRolling(true);
    setShowResult(null);
    setCredits((c) => c - betAmount);

    // Animate dice rolling with random faces
    let rollCount = 0;
    const rollInterval = setInterval(() => {
      setDice([Math.ceil(Math.random() * 6), Math.ceil(Math.random() * 6)]);
      rollCount++;
      if (rollCount > 12) {
        clearInterval(rollInterval);

        const d1 = Math.ceil(Math.random() * 6);
        const d2 = Math.ceil(Math.random() * 6);
        const total = d1 + d2;
        setDice([d1, d2]);

        let won = false;
        switch (betType) {
          case 'over':
            won = total > 7;
            break;
          case 'under':
            won = total < 7;
            break;
          case 'exact':
            won = total === 7;
            break;
          case 'odd':
            won = total % 2 !== 0;
            break;
          case 'even':
            won = total % 2 === 0;
            break;
        }

        const multiplier = BET_MULTIPLIERS[betType];
        const payout = won ? Math.floor(betAmount * multiplier) : 0;

        if (won) {
          setCredits((c) => c + payout);
          setTotalWinnings((w) => w + (payout - betAmount));
        } else {
          setTotalWinnings((w) => w - betAmount);
        }

        setLastPayout(payout);
        setShowResult(won ? 'win' : 'lose');

        const record: BetRecord = {
          betType,
          amount: betAmount,
          dice: [d1, d2],
          total,
          won,
          payout,
        };
        setHistory((h) => [record, ...h].slice(0, 5));

        setRolling(false);
        setTimeout(() => setShowResult(null), 2500);
      }
    }, 100);
  }, [betType, betAmount, rolling, credits]);

  const handleAllIn = () => {
    if (credits > 0) setBetAmount(credits);
  };

  const resetGame = () => {
    setCredits(100);
    setBetAmount(10);
    setBetType(null);
    setDice([1, 1]);
    setHistory([]);
    setTotalWinnings(0);
    setShowResult(null);
    setHighRoller(false);
  };

  const isBankrupt = credits < 10 && !rolling;

  return (
    <div className="relative min-h-screen bg-slate-950 overflow-hidden">
      {/* Injected keyframes */}
      <style>{`
        @keyframes dice-roll {
          0% { transform: rotate(0deg) scale(1); }
          25% { transform: rotate(90deg) scale(1.15); }
          50% { transform: rotate(180deg) scale(0.9); }
          75% { transform: rotate(270deg) scale(1.1); }
          100% { transform: rotate(360deg) scale(1); }
        }
        @keyframes dice-land {
          0% { transform: scale(1.1); }
          50% { transform: scale(0.95); }
          100% { transform: scale(1); }
        }
        .animate-dice-roll {
          animation: dice-roll 0.15s linear infinite;
        }
        .animate-dice-land {
          animation: dice-land 0.3s ease-out;
        }
        @keyframes float-up {
          0% { transform: translateY(100vh) rotate(0deg); opacity: 0; }
          10% { opacity: 0.15; }
          90% { opacity: 0.15; }
          100% { transform: translateY(-10vh) rotate(360deg); opacity: 0; }
        }
        @keyframes gold-shower {
          0% { transform: translateY(-20px); opacity: 1; }
          100% { transform: translateY(60px); opacity: 0; }
        }
        @keyframes neon-pulse {
          0%, 100% { text-shadow: 0 0 10px rgba(251,191,36,0.8), 0 0 20px rgba(251,191,36,0.4), 0 0 40px rgba(168,85,247,0.3); }
          50% { text-shadow: 0 0 20px rgba(251,191,36,1), 0 0 40px rgba(251,191,36,0.6), 0 0 60px rgba(168,85,247,0.5); }
        }
        @keyframes flash-red {
          0%, 100% { background-color: transparent; }
          50% { background-color: rgba(239, 68, 68, 0.15); }
        }
        @keyframes flash-gold {
          0%, 100% { background-color: transparent; }
          50% { background-color: rgba(251, 191, 36, 0.1); }
        }
        .animate-neon-pulse {
          animation: neon-pulse 2s ease-in-out infinite;
        }
        .flash-win {
          animation: flash-gold 0.5s ease-in-out 3;
        }
        .flash-lose {
          animation: flash-red 0.4s ease-in-out 3;
        }
      `}</style>

      {/* Floating background symbols */}
      {floatingSymbols.map((s) => (
        <div
          key={s.id}
          className="absolute text-purple-500/15 text-2xl pointer-events-none select-none"
          style={{
            left: `${s.x}%`,
            animation: `float-up ${12 + s.delay}s linear infinite`,
            animationDelay: `${s.delay}s`,
          }}
        >
          {s.symbol}
        </div>
      ))}

      {/* Win animation — gold shower */}
      {showResult === 'win' && (
        <div className="absolute inset-0 pointer-events-none z-30 overflow-hidden">
          {Array.from({ length: 30 }).map((_, i) => (
            <div
              key={i}
              className="absolute text-amber-400 text-lg"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 40}%`,
                animation: `gold-shower ${1 + Math.random() * 1.5}s ease-in forwards`,
                animationDelay: `${Math.random() * 0.8}s`,
              }}
            >
              {['✦', '◆', '★', '⬡', '$'][i % 5]}
            </div>
          ))}
        </div>
      )}

      {/* Main result flash overlay */}
      <div className={`absolute inset-0 pointer-events-none z-20 ${showResult === 'win' ? 'flash-win' : showResult === 'lose' ? 'flash-lose' : ''}`} />

      <div className="relative z-10 max-w-2xl mx-auto px-4 py-6 space-y-5">
        {/* Header */}
        <div className="text-center space-y-1">
          <div className="flex items-center justify-center gap-2">
            <span className="text-purple-400 text-xl">⬢</span>
            <h1 className="text-3xl sm:text-4xl font-heading font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-red-400 to-purple-400 animate-neon-pulse tracking-wider">
              KITSON CASINO
            </h1>
            <span className="text-purple-400 text-xl">⬢</span>
          </div>
          <p className="text-purple-300/60 text-xs font-mono-tech tracking-widest uppercase">
            ✦ The Galaxy's Most Notorious Casino ✦
          </p>
        </div>

        {/* Credits & Stats Bar */}
        <div className="grid grid-cols-3 gap-3">
          <div
            className="bg-slate-900/80 border border-amber-500/30 rounded-xl p-3 text-center"
            style={{ boxShadow: '0 0 15px rgba(251, 191, 36, 0.15)' }}
          >
            <div className="text-amber-400/60 text-[10px] font-mono-tech uppercase tracking-wider">Tokens</div>
            <div className="text-amber-400 text-xl sm:text-2xl font-bold font-mono-tech">{credits}</div>
          </div>
          <div className="bg-slate-900/80 border border-purple-500/30 rounded-xl p-3 text-center">
            <div className="text-purple-400/60 text-[10px] font-mono-tech uppercase tracking-wider">Net P/L</div>
            <div className={`text-xl sm:text-2xl font-bold font-mono-tech ${totalWinnings >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              {totalWinnings >= 0 ? '+' : ''}{totalWinnings}
            </div>
          </div>
          <div className="bg-slate-900/80 border border-red-500/30 rounded-xl p-3 text-center">
            <div className="text-red-400/60 text-[10px] font-mono-tech uppercase tracking-wider">Bets</div>
            <div className="text-red-400 text-xl sm:text-2xl font-bold font-mono-tech">{history.length}</div>
          </div>
        </div>

        {/* High Roller Achievement */}
        {highRoller && (
          <div
            className="flex items-center justify-center gap-2 py-2 px-4 rounded-xl border border-amber-400/50 bg-gradient-to-r from-amber-500/10 via-purple-500/10 to-amber-500/10"
            style={{ boxShadow: '0 0 20px rgba(251, 191, 36, 0.25)' }}
          >
            <Sparkles className="w-5 h-5 text-amber-400 animate-pulse" />
            <span className="text-amber-300 font-heading text-sm tracking-wide">★ HIGH ROLLER STATUS ACHIEVED ★</span>
            <Sparkles className="w-5 h-5 text-amber-400 animate-pulse" />
          </div>
        )}

        {/* Bankrupt Screen */}
        {isBankrupt ? (
          <div className="space-y-6 py-10">
            <div
              className="bg-slate-900/90 border border-red-500/40 rounded-2xl p-8 text-center space-y-4"
              style={{ boxShadow: '0 0 30px rgba(239, 68, 68, 0.2)' }}
            >
              <div className="text-5xl">💀</div>
              <h2 className="text-2xl font-heading text-red-400 tracking-wider">BANKRUPT</h2>
              <div className="border-t border-red-500/20 pt-4">
                <p className="text-slate-400 italic text-sm leading-relaxed">
                  <span className="text-purple-300 font-semibold">ENOCH:</span>{' '}
                  "As I have always said, gambling is unwise. The house always wins — especially on Kitson."
                </p>
              </div>
              <button
                onClick={resetGame}
                className="mt-4 px-8 py-3 rounded-xl font-heading text-sm tracking-wider bg-gradient-to-r from-amber-600 to-red-600 text-white hover:from-amber-500 hover:to-red-500 transition-all active:scale-95"
                style={{ boxShadow: '0 0 15px rgba(251, 191, 36, 0.3)' }}
              >
                ✦ TRY YOUR LUCK AGAIN ✦
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Cosmic Dice Game Area */}
            <div
              className="bg-gradient-to-b from-slate-900/90 to-purple-950/30 border border-purple-500/20 rounded-2xl p-5 space-y-5"
              style={{ boxShadow: '0 0 25px rgba(168, 85, 247, 0.1)' }}
            >
              <div className="text-center">
                <h2 className="font-heading text-lg text-purple-300 tracking-widest flex items-center justify-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  COSMIC DICE
                  <Sparkles className="w-4 h-4 text-amber-400" />
                </h2>
              </div>

              {/* Dice Display */}
              <div className="flex items-center justify-center gap-5 py-3">
                <DiceFace value={dice[0]} rolling={rolling} index={0} />
                <DiceFace value={dice[1]} rolling={rolling} index={1} />
              </div>

              {/* Total */}
              <div className="text-center">
                <span className="text-slate-500 text-xs font-mono-tech uppercase tracking-wider">Total: </span>
                <span
                  className={`text-2xl font-bold font-mono-tech ${
                    !rolling ? (dice[0] + dice[1] === 7 ? 'text-amber-400' : 'text-slate-200') : 'text-purple-400'
                  }`}
                >
                  {rolling ? '?' : dice[0] + dice[1]}
                </span>
              </div>

              {/* Result Message */}
              {showResult && !rolling && (
                <div
                  className={`text-center py-2 px-4 rounded-xl ${
                    showResult === 'win'
                      ? 'bg-emerald-500/10 border border-emerald-500/30'
                      : 'bg-red-500/10 border border-red-500/30'
                  }`}
                >
                  {showResult === 'win' ? (
                    <span className="text-emerald-400 font-heading text-sm tracking-wider">
                      ★ YOU WIN +{lastPayout} TOKENS! ★
                    </span>
                  ) : (
                    <span className="text-red-400 font-heading text-sm tracking-wider">
                      ◆ HOUSE WINS ◆
                    </span>
                  )}
                </div>
              )}

              {/* Bet Type Selection */}
              <div className="space-y-2">
                <div className="text-purple-400/60 text-[10px] font-mono-tech uppercase tracking-widest text-center">
                  Choose Your Fate
                </div>
                <div className="grid grid-cols-5 gap-2">
                  {(Object.keys(BET_LABELS) as BetType[]).map((type) => (
                    <button
                      key={type}
                      onClick={() => !rolling && setBetType(type)}
                      disabled={rolling}
                      className={`py-2 px-1 rounded-xl text-xs font-mono-tech transition-all border ${
                        betType === type
                          ? 'bg-purple-600/30 border-purple-400/60 text-purple-200 scale-105'
                          : 'bg-slate-800/50 border-slate-700/40 text-slate-400 hover:border-purple-500/40 hover:text-purple-300'
                      } disabled:opacity-40`}
                      style={
                        betType === type
                          ? { boxShadow: '0 0 12px rgba(168, 85, 247, 0.3)' }
                          : undefined
                      }
                    >
                      <div className="font-semibold">{BET_LABELS[type]}</div>
                      <div className={`text-[10px] mt-0.5 ${betType === type ? 'text-amber-400' : 'text-slate-500'}`}>
                        {BET_MULTIPLIERS[type]}x
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Chip / Bet Amount Selection */}
              <div className="space-y-2">
                <div className="text-purple-400/60 text-[10px] font-mono-tech uppercase tracking-widest text-center">
                  Wager — Current: <span className="text-amber-400">{betAmount}</span>
                </div>
                <div className="flex items-center justify-center gap-2 flex-wrap">
                  {CHIP_AMOUNTS.map((amount) => (
                    <button
                      key={amount}
                      onClick={() => !rolling && amount <= credits && setBetAmount(amount)}
                      disabled={rolling || amount > credits}
                      className={`w-14 h-14 rounded-full font-mono-tech font-bold text-sm transition-all border-2 ${
                        betAmount === amount
                          ? 'bg-gradient-to-br from-amber-500 to-red-600 border-amber-300 text-white scale-110'
                          : 'bg-slate-800 border-slate-600 text-slate-300 hover:border-amber-500/50'
                      } disabled:opacity-30 disabled:cursor-not-allowed`}
                      style={
                        betAmount === amount
                          ? { boxShadow: '0 0 15px rgba(251, 191, 36, 0.5)' }
                          : undefined
                      }
                    >
                      {amount}
                    </button>
                  ))}
                  <button
                    onClick={() => !rolling && handleAllIn()}
                    disabled={rolling}
                    className={`h-14 px-4 rounded-full font-mono-tech font-bold text-xs tracking-wider transition-all border-2 ${
                      betAmount === credits && !CHIP_AMOUNTS.includes(credits)
                        ? 'bg-gradient-to-br from-red-600 to-purple-700 border-red-400 text-white scale-110'
                        : 'bg-slate-800 border-red-800/50 text-red-400 hover:border-red-500'
                    } disabled:opacity-30`}
                    style={
                      betAmount === credits && !CHIP_AMOUNTS.includes(credits)
                        ? { boxShadow: '0 0 15px rgba(239, 68, 68, 0.5)' }
                        : undefined
                    }
                  >
                    ALL IN
                  </button>
                </div>
              </div>

              {/* Roll Button */}
              <button
                onClick={rollDice}
                disabled={!betType || rolling || betAmount > credits}
                className="w-full py-4 rounded-xl font-heading text-lg tracking-widest transition-all disabled:opacity-30 disabled:cursor-not-allowed active:scale-[0.98] bg-gradient-to-r from-amber-600 via-red-600 to-purple-700 text-white hover:from-amber-500 hover:via-red-500 hover:to-purple-600 border border-amber-500/20"
                style={{ boxShadow: '0 0 20px rgba(251, 191, 36, 0.2), 0 0 40px rgba(168, 85, 247, 0.1)' }}
              >
                {rolling ? (
                  <span className="animate-pulse">⬡ ROLLING... ⬡</span>
                ) : (
                  <span>✦ ROLL THE COSMIC DICE ✦</span>
                )}
              </button>
            </div>

            {/* Bet History */}
            {history.length > 0 && (
              <div className="bg-slate-900/60 border border-slate-700/30 rounded-2xl p-4 space-y-3">
                <h3 className="text-slate-500 text-[10px] font-mono-tech uppercase tracking-widest text-center">
                  ◆ Recent Transmissions ◆
                </h3>
                <div className="space-y-2">
                  {history.map((record, i) => (
                    <div
                      key={i}
                      className={`flex items-center justify-between px-3 py-2 rounded-lg border text-xs font-mono-tech ${
                        record.won
                          ? 'border-emerald-500/20 bg-emerald-500/5'
                          : 'border-red-500/20 bg-red-500/5'
                      } ${i === 0 ? 'opacity-100' : 'opacity-60'}`}
                    >
                      <div className="flex items-center gap-3">
                        <span className={record.won ? 'text-emerald-400' : 'text-red-400'}>
                          {record.won ? '★' : '✕'}
                        </span>
                        <span className="text-slate-400">{BET_LABELS[record.betType]}</span>
                        <span className="text-slate-600">
                          [{record.dice[0]}+{record.dice[1]}={record.total}]
                        </span>
                      </div>
                      <span className={record.won ? 'text-emerald-400' : 'text-red-400'}>
                        {record.won ? `+${record.payout}` : `-${record.amount}`}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* Footer */}
        <div className="text-center text-slate-700 text-[10px] font-mono-tech tracking-widest pt-2">
          ⬢ HOUSE OF GAMES — KITSON SECTOR ⬢
        </div>
      </div>
    </div>
  );
};
