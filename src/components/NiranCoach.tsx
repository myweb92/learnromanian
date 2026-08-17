import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, MessageCircle } from 'lucide-react';

export type NiranMood = 'happy' | 'studious' | 'encouraging' | 'scared' | 'excited' | 'celebrate' | 'idea';

interface NiranCoachProps {
  mood?: NiranMood;
  message: string;
  messageRo?: string;
  className?: string;
}

export default function NiranCoach({ 
  mood = 'encouraging', 
  message, 
  messageRo, 
  className = '' 
}: NiranCoachProps) {
  
  // Custom cute dynamic expressions & avatar bodies
  const getAvatarContent = () => {
    switch (mood) {
      case 'happy':
        return {
          emoji: '🐻',
          bgColor: 'bg-emerald-100 border-emerald-300',
          textColor: 'text-emerald-700',
          accessory: '✨',
          animation: { y: [0, -6, 0], rotate: [0, 2, -2, 0] }
        };
      case 'studious':
        return {
          emoji: '🤓',
          bgColor: 'bg-indigo-100 border-indigo-300',
          textColor: 'text-indigo-700',
          accessory: '📚',
          animation: { rotate: [0, 3, -3, 0] }
        };
      case 'excited':
        return {
          emoji: '🐻⚡️',
          bgColor: 'bg-amber-100 border-amber-300',
          textColor: 'text-amber-750',
          accessory: '🔥',
          animation: { scale: [1, 1.1, 0.95, 1], y: [0, -10, 0] }
        };
      case 'celebrate':
        return {
          emoji: '🥳',
          bgColor: 'bg-yellow-100 border-yellow-300',
          textColor: 'text-yellow-800',
          accessory: '🎉',
          animation: { y: [0, -12, 0], scale: [1, 1.15, 1], rotate: [0, 8, -8, 0] }
        };
      case 'idea':
        return {
          emoji: '💡🐻',
          bgColor: 'bg-cyan-100 border-cyan-300',
          textColor: 'text-cyan-800',
          accessory: '💥',
          animation: { scale: [1, 1.05, 1] }
        };
      case 'scared':
        return {
          emoji: '😰',
          bgColor: 'bg-rose-100 border-rose-300',
          textColor: 'text-rose-700',
          accessory: '💦',
          animation: { x: [0, -3, 3, -3, 3, 0] }
        };
      case 'encouraging':
      default:
        return {
          emoji: '🐻❤️',
          bgColor: 'bg-sky-100 border-sky-300',
          textColor: 'text-sky-700',
          accessory: '🇷🇴',
          animation: { y: [0, -4, 0] }
        };
    }
  };

  const currentMood = getAvatarContent();

  return (
    <div className={`flex items-start gap-4 p-4 bg-white rounded-3xl border-2 border-slate-200/90 shadow-sm relative overflow-hidden group select-none ${className}`}>
      {/* Decorative clean grid background representing a learning playground */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-[size:1.5rem_1.5rem] opacity-30 pointer-events-none" />

      {/* Dynamic Animated Avatar of Niran the Bear */}
      <motion.div
        animate={currentMood.animation}
        transition={{ duration: 1.8, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
        className={`w-16 h-16 rounded-2xl ${currentMood.bgColor} border-2 flex flex-col items-center justify-center relative shrink-0 shadow-md select-none`}
      >
        <span className="text-3.5xl filter drop-shadow-sm select-none">{currentMood.emoji.replace(/[a-zA-Z0-9_*#⚡️❤️]+/g, '')}</span>
        
        {/* Sub-badge indicating state/accessory */}
        <span className="absolute -bottom-1 -right-1 bg-white border border-slate-150 rounded-full w-6 h-6 flex items-center justify-center text-xs shadow-xs animate-bounce">
          {currentMood.accessory}
        </span>
        
        {/* Teddy details */}
        <span className="absolute top-1 text-[8px] font-black tracking-widest text-slate-400 font-mono scale-90">
          NIRAN
        </span>
      </motion.div>

      {/* Speech Bubble Details */}
      <div className="flex-1 space-y-1 relative z-10">
        <div className="flex items-center gap-1.5 text-[10px] font-extrabold uppercase font-mono text-slate-400 tracking-wider">
          <MessageCircle className="w-3.5 h-3.5 text-indigo-505 shrink-0" />
          <span>Tutor Tips</span>
        </div>

        {/* Translation Speech Bubble */}
        <div className="space-y-1">
          {messageRo && (
            <p className="text-sm font-extrabold text-slate-850 tracking-tight leading-snug">
              „{messageRo}”
            </p>
          )}
          <p className="text-xs text-slate-500 font-semibold leading-relaxed">
            {message}
          </p>
        </div>
      </div>

      {/* Decorative Sparkle Accent */}
      <Sparkles className="w-5 h-5 text-amber-400 shrink-0 select-none animate-pulse opacity-60 group-hover:scale-125 transition-transform" />
    </div>
  );
}
