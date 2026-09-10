import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { ArrowRight, ShieldCheck } from 'lucide-react';
import { sound } from '../utils/sound';

export const SplashScreen: React.FC = () => {
  const { showSplash, dismissSplash, soundEnabled } = useApp();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!showSplash) return;

    if (soundEnabled) {
      sound.playSplash();
    }

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(dismissSplash, 250);
          return 100;
        }
        return prev + 4;
      });
    }, 60);

    return () => clearInterval(timer);
  }, [showSplash, dismissSplash, soundEnabled]);

  if (!showSplash) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#050507] text-white select-none overflow-hidden transition-opacity duration-500">
      {/* Ambient background studio lighting */}
      <div className="absolute w-[500px] h-[500px] rounded-full bg-[#FFD000]/[0.06] blur-[140px] pointer-events-none animate-pulse-subtle" />

      {/* Main Architectural Monogram & Brand Typography */}
      <div className="relative z-10 flex flex-col items-center animate-scale-in text-center px-6 max-w-sm">
        {/* Monogram Badge */}
        <div className="relative mb-6">
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-gradient-to-b from-[#1C1C28] to-[#0D0D14] border border-[#FFD000]/40 flex items-center justify-center shadow-gold-glow">
            <svg
              viewBox="0 0 100 100"
              className="w-14 h-14 sm:w-16 sm:h-16 text-[#FFD000] drop-shadow-[0_0_12px_rgba(255,208,0,0.5)]"
              fill="currentColor"
            >
              <path d="M24 20 H48 C62 20 70 27 70 38 C70 47 63 54 52 56 L74 80 H60 L42 58 H34 V80 H24 Z M34 47 H46 C52 47 58 43 58 38 C58 33 52 29 46 29 H34 Z" />
              <circle cx="76" cy="22" r="5" fill="#FFFFFF" />
            </svg>
          </div>

          <div className="absolute -inset-2 rounded-[32px] border border-[#FFD000]/20 animate-ping opacity-25 pointer-events-none" />
        </div>

        {/* Brand Name Typography */}
        <div className="mb-2">
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white flex items-center justify-center gap-2">
            <span>RYD</span>
            <span className="text-[#FFD000] drop-shadow-[0_0_15px_rgba(255,208,0,0.4)]">STUDIO</span>
          </h1>
          <p className="text-[10px] sm:text-[11px] font-bold tracking-[0.25em] text-gray-400 uppercase mt-1">
            Faculty & Operations Platform
          </p>
        </div>

        {/* Glossy Gold Progress Indicator */}
        <div className="w-48 h-1 bg-[#1A1A24] rounded-full overflow-hidden my-6 border border-white/10">
          <div
            className="h-full bg-gradient-to-r from-[#FFE54C] via-[#FFD000] to-[#E6B800] rounded-full transition-all duration-75 shadow-[0_0_8px_#FFD000]"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Glossy Enter Action */}
        <button
          onClick={dismissSplash}
          className="flex items-center gap-2 px-6 py-2.5 rounded-full glossy-pill-dark hover:border-[#FFD000]/50 text-gray-200 hover:text-white text-xs font-bold tracking-wider uppercase transition-all duration-200 cursor-pointer group"
        >
          <span>Enter Platform</span>
          <ArrowRight className="w-3.5 h-3.5 text-[#FFD000] transform group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* Subtle Bottom Status */}
      <div className="absolute bottom-6 flex items-center gap-2 text-[10px] text-gray-500 tracking-wider uppercase font-semibold">
        <ShieldCheck className="w-3.5 h-3.5 text-[#FFD000]" />
        <span>Executive Operations System</span>
      </div>
    </div>
  );
};
