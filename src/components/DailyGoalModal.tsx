import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Target, 
  Sparkles, 
  Trophy, 
  Flame, 
  Compass, 
  ArrowRight,
  ThumbsUp,
  CheckCircle2
} from 'lucide-react';
import { UserProgress } from '../types';

interface DailyGoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  progress: UserProgress;
  onUpdateGoal: (newGoal: number) => void;
}

export default function DailyGoalModal({ 
  isOpen, 
  onClose, 
  progress, 
  onUpdateGoal 
}: DailyGoalModalProps) {
  const [customGoal, setCustomGoal] = useState<number>(progress.dailyGoalXp);
  const [isSaved, setIsSaved] = useState(false);

  // Sync state if progress dailyGoalXp changes externally
  useEffect(() => {
    if (isOpen) {
      setCustomGoal(progress.dailyGoalXp);
      setIsSaved(false);
    }
  }, [isOpen, progress.dailyGoalXp]);

  if (!isOpen) return null;

  const presets = [
    { value: 15, label: 'Casual', desc: '3-5 min / day', color: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
    { value: 30, label: 'Regular', desc: '5-10 min / day', color: 'text-indigo-600 bg-indigo-50 border-indigo-200' },
    { value: 50, label: 'Serious', desc: '10-15 min / day', color: 'text-orange-600 bg-orange-50 border-orange-200' },
    { value: 100, label: 'Intense', desc: '30+ min / day', color: 'text-rose-600 bg-rose-50 border-rose-200' }
  ];

  const dailyXpGained = progress.dailyXpGained;
  const isGoalReached = dailyXpGained >= customGoal;
  const progressPercent = Math.min(100, Math.round((dailyXpGained / customGoal) * 100));
  const remainingXp = Math.max(0, customGoal - dailyXpGained);

  const handleSave = () => {
    onUpdateGoal(customGoal);
    setIsSaved(true);
    setTimeout(() => {
      onClose();
    }, 1000); // Auto-dismiss after confirmation animation
  };

  return (
    <AnimatePresence>
      <div 
        id="daily-goal-modal-overlay"
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        {/* Backdrop visual glass */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs"
        />

        {/* Modal Sheet Container */}
        <motion.div 
          initial={{ scale: 0.95, y: 15, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.95, y: 15, opacity: 0 }}
          transition={{ type: 'spring', duration: 0.4, bounce: 0.15 }}
          className="bg-white rounded-3xl border border-slate-200 w-full max-w-lg p-6 md:p-8 relative z-10 shadow-2xl overflow-hidden flex flex-col justify-between"
        >
          {/* Confetti or Gold Background Ambience if goal is reached */}
          {isGoalReached && (
            <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-300 animate-pulse" />
          )}

          {/* Close Trigger Button */}
          <button 
            onClick={onClose}
            className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-xl transition duration-200 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="space-y-6">
            {/* Title / Brand Header */}
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-2xl ${isGoalReached ? 'bg-amber-50 text-amber-600' : 'bg-indigo-50 text-indigo-600'}`}>
                <Target className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <h3 className="text-xl font-extrabold text-slate-850 tracking-tight font-display">
                  Set Your Daily Goal
                </h3>
                <p className="text-xs text-slate-400 font-medium">
                  Adjusting your goal ensures you stay active and motivated!
                </p>
              </div>
            </div>

            <hr className="border-slate-100" />

            {/* Presets Selection */}
            <div className="space-y-3">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest font-mono">
                Select XP Difficulty tier:
              </label>
              <div className="grid grid-cols-2 gap-3">
                {presets.map((preset) => {
                  const isSelected = customGoal === preset.value;
                  return (
                    <button
                      key={preset.value}
                      onClick={() => {
                        setCustomGoal(preset.value);
                        setIsSaved(false);
                      }}
                      className={`p-3.5 rounded-2xl border text-left transition-all duration-200 cursor-pointer relative overflow-hidden ${
                        isSelected 
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-100 scale-[1.02]' 
                          : 'bg-slate-50/60 hover:bg-slate-50 border-slate-200/90 text-slate-700'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-extrabold font-display leading-none">
                          {preset.label}
                        </span>
                        <span className={`text-[10px] font-bold font-mono px-2 py-0.5 rounded-md ${
                          isSelected ? 'bg-indigo-700 text-indigo-100' : 'bg-white border border-slate-150'
                        }`}>
                          {preset.value} XP
                        </span>
                      </div>
                      <p className={`text-[11px] mt-1.5 ${isSelected ? 'text-indigo-200' : 'text-slate-400 font-medium'}`}>
                        {preset.desc}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Range Slider for granular control */}
            <div className="space-y-2.5 bg-slate-50/60 border border-slate-100 p-4 rounded-2xl">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-slate-550 font-mono text-[10px] uppercase tracking-wider">Custom Target:</span>
                <span className="font-mono font-bold bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-md border border-indigo-100 text-xs">
                  {customGoal} XP / day
                </span>
              </div>
              <input 
                type="range"
                min="10"
                max="200"
                step="5"
                value={customGoal}
                onChange={(e) => {
                  setCustomGoal(parseInt(e.target.value));
                  setIsSaved(false);
                }}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600 py-1"
              />
              <div className="flex justify-between font-mono text-[10px] text-slate-400 font-bold px-1 select-none">
                <span>10 XP</span>
                <span>100 XP</span>
                <span>200 XP</span>
              </div>
            </div>

            {/* Dynamic Motivational Progress Bar */}
            <div className="space-y-3 bg-slate-50/40 p-4 rounded-2xl border border-dashed border-slate-200">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-slate-600 font-sans">
                  Goal Progress Today:
                </span>
                <span className={`text-xs font-mono font-bold ${
                  isGoalReached ? 'text-amber-500 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200' : 'text-indigo-600'
                }`}>
                  {dailyXpGained} / {customGoal} XP ({progressPercent}%)
                </span>
              </div>

              {/* Progress Bar Track */}
              <div className="h-4 bg-slate-100 rounded-full overflow-hidden p-[1px] relative">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercent}%` }}
                  transition={{ duration: 0.6 }}
                  className={`h-full rounded-full relative transition-all duration-500 ${
                    isGoalReached 
                      ? 'bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 shadow-[0_0_12px_rgba(245,158,11,0.4)]' 
                      : 'bg-indigo-600'
                  }`}
                />
                
                {/* Glowing stripes overlay to show active progress */}
                <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(255,255,255,0.15)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.15)_50%,rgba(255,255,255,0.15)_75%,transparent_75%,transparent)] bg-[size:1rem_1rem] pointer-events-none opacity-40 animate-[pulse_2s_infinite]"></div>
              </div>

              {/* Motivational message tailored dynamically */}
              <AnimatePresence mode="wait">
                {isGoalReached ? (
                  <motion.div 
                    key="goal-reached"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="flex gap-2.5 items-start bg-amber-50/80 border border-amber-100 rounded-xl p-3 text-xs"
                  >
                    <Trophy className="w-4 h-4 text-amber-500 fill-amber-200 shrink-0 mt-0.5 animate-bounce" />
                    <div>
                      <p className="font-bold text-amber-900 flex items-center gap-1">
                        Incredibil! Goal Accomplished! <Sparkles className="w-3.5 h-3.5 text-yellow-500 fill-yellow-200" />
                      </p>
                      <p className="text-amber-700/90 leading-normal mt-0.5">
                        Amazing job! You've crushed today's target. Romanian mastery grows closer everyday. Keep up the clean streak! 🇷🇴🔥
                      </p>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div 
                    key="goal-pending"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="flex gap-2.5 items-start bg-indigo-50/80 border border-indigo-100 rounded-xl p-3 text-xs"
                  >
                    <Flame className="w-4 h-4 text-indigo-500 fill-indigo-100 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-indigo-900">
                        Almost there! Just {remainingXp} XP to go
                      </p>
                      <p className="text-indigo-700/90 leading-normal mt-0.5">
                        Practice flashcards (+3 XP each) or complete conversational scenarios (+15 XP each) to unlock today's badge progress!
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Action Footer */}
          <div className="flex gap-3 mt-6 pt-5 border-t border-slate-100">
            <button
              onClick={onClose}
              className="flex-1 py-3 text-xs font-bold text-slate-500 hover:text-slate-800 bg-slate-50 hover:bg-slate-100 rounded-xl uppercase tracking-wider font-mono transition cursor-pointer text-center"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isSaved}
              className={`flex-1 py-3 text-xs font-bold rounded-xl uppercase tracking-wider font-mono transition flex items-center justify-center gap-2 cursor-pointer shadow-md ${
                isSaved 
                  ? 'bg-emerald-600 text-white shadow-emerald-100' 
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-100'
              }`}
            >
              {isSaved ? (
                <>
                  <CheckCircle2 className="w-4 h-4" /> Goal Saved!
                </>
              ) : (
                <>
                  Save Target Goal <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
}
