import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Star } from 'lucide-react';
import confetti from 'canvas-confetti';

interface AnimatedProgressBarProps {
  xp: number;
  size?: 'sm' | 'md' | 'lg';
  dark?: boolean;
  showDetails?: boolean;
  showLevelTitle?: boolean;
  onLevelUp?: (newLevel: number) => void;
}

interface FloatingXp {
  id: string;
  amount: number;
  x: number; // random offset for horizontal scattered effect
}

export default function AnimatedProgressBar({
  xp,
  size = 'md',
  dark = false,
  showDetails = true,
  showLevelTitle = true,
  onLevelUp
}: AnimatedProgressBarProps) {
  const xpForNextLevel = 100;
  const currentLevelNum = Math.floor(xp / xpForNextLevel) + 1;
  const levelXpRemainder = xp % xpForNextLevel;
  const levelProgressPercent = (levelXpRemainder / xpForNextLevel) * 100;

  const prevXpRef = useRef<number>(xp);
  const [floatingXps, setFloatingXps] = useState<FloatingXp[]>([]);
  const [showLevelUpAlert, setShowLevelUpAlert] = useState(false);
  const [prevLevel, setPrevLevel] = useState<number>(currentLevelNum);

  // Monitor XP updates to trigger micro-interactions
  useEffect(() => {
    const prevXp = prevXpRef.current;
    if (xp > prevXp) {
      const diff = xp - prevXp;
      
      // 1. Spawning dynamic floating XP bubbles
      const newFloating: FloatingXp = {
        id: Math.random().toString(36).substring(2, 9),
        amount: diff,
        x: (Math.random() - 0.5) * 40, // offset
      };
      setFloatingXps((prev) => [...prev, newFloating]);

      // 2. Check for level up
      const prevLvl = Math.floor(prevXp / xpForNextLevel) + 1;
      const nextLvl = Math.floor(xp / xpForNextLevel) + 1;
      
      if (nextLvl > prevLvl) {
        // Trigger high-fidelity confetti effect
        triggerLevelUpConfetti();
        setShowLevelUpAlert(true);
        if (onLevelUp) {
          onLevelUp(nextLvl);
        }
      }
    }
    prevXpRef.current = xp;
  }, [xp, currentLevelNum]);

  const triggerLevelUpConfetti = () => {
    // 3 rounds of celebratory explosions
    const duration = 2.5 * 1050;
    const end = Date.now() + duration;

    (function frame() {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.8 },
        colors: ['#3b82f6', '#facc15', '#ef4444', '#10b981']
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.8 },
        colors: ['#3b82f6', '#facc15', '#ef4444', '#10b981']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    }());
  };

  const getBarHeight = () => {
    switch (size) {
      case 'sm': return 'h-2.5';
      case 'lg': return 'h-6';
      case 'md':
      default: return 'h-4';
    }
  };

  return (
    <div className="relative w-full space-y-3">
      {/* Floating XP Gain Animations */}
      <div className="absolute right-4 -top-8 pointer-events-none z-50">
        <AnimatePresence>
          {floatingXps.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.4, y: 15, x: item.x }}
              animate={{ opacity: 1, scale: 1.1, y: -45, x: item.x }}
              exit={{ opacity: 0, scale: 0.8, y: -75 }}
              transition={{ duration: 0.95, ease: 'easeOut' }}
              onAnimationComplete={() => {
                setFloatingXps((prev) => prev.filter((x) => x.id !== item.id));
              }}
              className="absolute font-black tracking-wider text-sm flex items-center gap-0.5"
            >
              <span className="bg-yellow-400 text-slate-950 px-2 py-0.5 rounded-full border border-yellow-300 shadow-md flex items-center gap-1 font-mono">
                +{item.amount} XP <Star className="w-3 h-3 fill-slate-950 animate-spin" />
              </span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Level Up Flash Indicator Overlay */}
      <AnimatePresence>
        {showLevelUpAlert && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 pointer-events-auto"
            onClick={() => setShowLevelUpAlert(false)}
          >
            <motion.div 
              initial={{ y: 25 }}
              animate={{ y: 0, transition: { type: 'spring', damping: 20 } }}
              exit={{ y: -25 }}
              className="bg-linear-to-br from-indigo-950 via-slate-900 to-slate-950 text-white p-8 rounded-3xl max-w-sm w-full text-center border-2 border-yellow-400/80 shadow-[0_0_24px_rgba(250,204,21,0.35)] relative overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Decorative sparkles */}
              <div className="absolute -top-12 -left-12 w-28 h-28 bg-yellow-405/10 rounded-full blur-2xl animate-pulse"></div>
              <div className="absolute -bottom-12 -right-12 w-28 h-28 bg-blue-500/10 rounded-full blur-2xl animate-pulse"></div>

              <motion.div
                animate={{ rotate: [0, 15, -15, 0], scale: [1, 1.2, 1.1, 1] }}
                transition={{ duration: 0.6, repeat: 1, repeatType: "reverse" }}
                className="w-20 h-20 bg-linear-to-tr from-yellow-400 to-amber-500 rounded-full flex items-center justify-center text-5xl mx-auto shadow-lg"
              >
                👑
              </motion.div>
              <h3 className="text-2xl font-black font-display text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-amber-400 mt-5">
                LEVEL UP!
              </h3>
              <p className="text-slate-200 font-bold mt-1">Sărbătorim succesul!</p>
              
              <div className="bg-slate-800/60 border border-slate-700/60 py-3.5 px-5 rounded-2xl my-4 space-y-1">
                <p className="text-xs text-slate-400 uppercase tracking-widest font-bold font-mono">You Reached</p>
                <p className="text-3xl font-extrabold text-white">Level {currentLevelNum}</p>
                <p className="text-[11px] text-yellow-300 font-bold font-mono">+100 Max Energy / Refreshed!</p>
              </div>

              <p className="text-xs text-slate-400 font-sans leading-relaxed">
                Niran is thrilled with your Romanian vocabulary fluency! Let's conquer more conversational modules.
              </p>

              <button
                type="button"
                className="mt-6 w-full bg-linear-to-r from-yellow-400 to-amber-450 text-slate-950 font-black py-3 rounded-xl tracking-wider hover:brightness-105 active:scale-95 transition cursor-pointer font-mono text-xs uppercase"
                onClick={() => setShowLevelUpAlert(false)}
              >
                Continuă Învățarea &rarr;
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main progress metrics title */}
      {showLevelTitle && (
        <div className="flex justify-between items-end">
          <div>
            <span className={`text-[10px] font-bold ${dark ? 'text-yellow-405' : 'text-indigo-600'} uppercase tracking-widest font-mono flex items-center gap-1`}>
              <Sparkles className="w-3.5 h-3.5" /> LEVEL PROGRESS
            </span>
            <p className={`text-sm font-bold ${dark ? 'text-slate-300' : 'text-slate-500'} mt-0.5`}>
              You are <span className={`font-black ${dark ? 'text-yellow-405' : 'text-indigo-600'}`}>{xpForNextLevel - levelXpRemainder} XP</span> away from Level {currentLevelNum + 1}.
            </p>
          </div>
          <div className="text-right">
            <span className={`text-2xl font-black ${dark ? 'text-white' : 'text-slate-900'} font-display`}>
              Lvl {currentLevelNum}
            </span>
          </div>
        </div>
      )}

      {/* Progress track */}
      <div className="space-y-1.5">
        <div className={`w-full ${dark ? 'bg-slate-800/80 border-slate-700/50' : 'bg-slate-100 border-slate-200'} ${getBarHeight()} rounded-full overflow-hidden border p-[2px] relative`}>
          {/* Framer motion animated fill wrapper */}
          <motion.div 
            className={`h-full rounded-full bg-gradient-to-r ${
              dark ? 'from-yellow-400 via-amber-400 to-orange-400' : 'from-indigo-500 via-indigo-600 to-indigo-700'
            } shadow-[0_0_8px_rgba(250,204,21,0.2)]`}
            initial={{ width: 0 }}
            animate={{ width: `${levelProgressPercent}%` }}
            transition={{ type: 'spring', stiffness: 60, damping: 15 }}
          />
        </div>

        {/* Supporting stats labels */}
        {showDetails && (
          <div className={`flex justify-between text-[10px] font-bold font-mono uppercase tracking-wider ${dark ? 'text-slate-400' : 'text-slate-400'}`}>
            <span>{xp} Total XP earned</span>
            <span>{Math.round(levelProgressPercent)}% Complete</span>
          </div>
        )}
      </div>
    </div>
  );
}
