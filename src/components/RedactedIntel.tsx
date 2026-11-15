import React, { useState, useEffect } from 'react';
import { sound } from '../utils/audio';

interface RedactedIntelProps {
  text: string;
  classification?: string;
  className?: string;
  revealByDefault?: boolean;
}

export const RedactedIntel: React.FC<RedactedIntelProps> = ({
  text,
  classification = "TOP SECRET",
  className = "",
  revealByDefault = false
}) => {
  const [isRevealed, setIsRevealed] = useState<boolean>(revealByDefault);
  const [scrambleText, setScrambleText] = useState<string>("");

  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";

  const handleMouseEnter = () => {
    if (!isRevealed) {
      sound.playTypewriterClick();
      // Scramble effect
      let iterations = 0;
      const interval = setInterval(() => {
        setScrambleText(
          text
            .split("")
            .map((char, index) => {
              if (char === " ") return " ";
              if (index < iterations) return text[index];
              return characters[Math.floor(Math.random() * characters.length)];
            })
            .join("")
        );

        if (iterations >= text.length) {
          clearInterval(interval);
          sound.playDecryptionChirp();
          setIsRevealed(true);
        }
        iterations += 1;
      }, 30);
    }
  };

  const handleMouseLeave = () => {
    if (!revealByDefault) {
      setIsRevealed(false);
      setScrambleText("");
      sound.playTypewriterClick();
    }
  };

  const placeholderMask = "█".repeat(Math.max(6, Math.min(text.length, 16)));

  return (
    <span
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={() => {
        setIsRevealed(prev => !prev);
        sound.playDecryptionChirp();
      }}
      title={`[${classification} // HOVER OR CLICK TO DECRYPT]`}
      className={`inline-flex items-center px-1.5 py-0.5 rounded cursor-pointer transition-all duration-200 select-none ${
        isRevealed
          ? "bg-cyan-950/90 text-cyan-300 border border-cyan-400/80 shadow-[0_0_12px_rgba(6,182,212,0.4)] font-mono-tech"
          : "bg-black/90 text-red-500/90 hover:text-amber-400 border-b-2 border-red-500 font-courier hover:border-amber-400"
      } ${className}`}
    >
      {isRevealed ? (
        scrambleText || text
      ) : (
        <span className="tracking-widest flex items-center gap-1">
          <span className="opacity-90">{placeholderMask}</span>
          <span className="text-[9px] uppercase px-1 py-0.2 rounded bg-red-950/80 text-red-400 border border-red-600/60 font-typewriter">
            LOCKED
          </span>
        </span>
      )}
    </span>
  );
};
