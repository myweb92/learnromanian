import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Layers, 
  CheckCircle,
  BookmarkCheck,
  RotateCcw,
  Sparkles,
  Award,
  Crown
} from 'lucide-react';
import { UserProgress, Flashcard } from '../types';
import AdBanner from './AdBanner';

interface AnkiSrsProps {
  progress: UserProgress;
  
  onUpdateProgress: (updated: Partial<UserProgress>) => void;
}

export default function AnkiSrs({ progress, onUpdateProgress }: AnkiSrsProps) {
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [forcePracticeAll, setForcePracticeAll] = useState(false);
  const [showCompletedNotice, setShowCompletedNotice] = useState(false);

  // Compute card due statistics based on ISO comparison with current date
  const nowStr = new Date().toISOString();
  
  const dueCards = useMemo(() => {
    return progress.flashcards.filter((card) => {
      if (forcePracticeAll) return true;
      return card.nextReviewDate <= nowStr;
    });
  }, [progress.flashcards, nowStr, forcePracticeAll]);

  // Safely grab the current active flashcard, handling race conditions on array shrink
  const currentCard = useMemo(() => {
    if (dueCards.length === 0) return null;
    if (activeCardIndex >= dueCards.length) {
      return dueCards[0];
    }
    return dueCards[activeCardIndex];
  }, [dueCards, activeCardIndex]);

  // General box distribution statistics
  const boxCounts = useMemo(() => {
    const counts = [0, 0, 0, 0, 0];
    progress.flashcards.forEach((card) => {
      const bIdx = Math.min(4, Math.max(0, card.box - 1));
      counts[bIdx]++;
    });
    return counts;
  }, [progress.flashcards]);

  const handleSrsReviewFeedback = (card: Flashcard, level: 'hard' | 'good' | 'easy') => {
    setIsFlipped(false);
    
    let currentBox = card.box;
    let newBox = currentBox;
    
    if (level === 'hard') newBox = 1;
    else if (level === 'good') newBox = Math.min(5, currentBox + 1);
    else if (level === 'easy') newBox = Math.min(5, currentBox + 2);

    // Re-schedule next review date (days based on box: box 1: 1 day, box 2: 3 days, box 3: 7 days, box 4: 14 days, box 5: 30 days)
    const intervals = [1, 3, 7, 14, 30];
    const reviewInDays = intervals[newBox - 1];
    const reviewDate = new Date();
    reviewDate.setDate(reviewDate.getDate() + reviewInDays);

    const updatedCatalog = progress.flashcards.map((f) => {
      if (f.romanian === card.romanian) {
        return {
          ...f,
          box: newBox,
          nextReviewDate: reviewDate.toISOString()
        };
      }
      return f;
    });

    const newXP = progress.xp + 3; // +3 XP per Leitner flashcard card completed on schedule!
    const dailyXp = progress.dailyXpGained + 3;

    // Adjust activeCardIndex locally BEFORE progress trigger is called so rendering stays boundary-safe
    if (dueCards.length <= 1) {
      setActiveCardIndex(0);
      setForcePracticeAll(false);
      setShowCompletedNotice(true);
    } else {
      if (activeCardIndex >= dueCards.length - 1) {
        setActiveCardIndex(0);
      }
      // If we are in the middle, keeping activeCardIndex identical naturally references 
      // the next list item shifting left as the current one is removed from dueCards list.
    }

    onUpdateProgress({
      xp: newXP,
      dailyXpGained: dailyXp,
      flashcards: updatedCatalog
    });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="border-b border-slate-200/80 pb-4">
        <h2 className="text-2xl font-bold text-slate-800 tracking-tight font-display">Spaced Repetition (Anki Deck)</h2>
        <p className="text-sm text-slate-500">Train with Niran's Leitner System to store acquired Romanian verbs permanently in long-term memory.</p>
      </div>

      {/* Box progress allocation metrics - sleek bento row */}
      <div className="grid grid-cols-5 gap-1.5 md:gap-4 text-center">
        {boxCounts.map((count, index) => {
          return (
            <div 
              key={index} 
              className={`p-3 rounded-2xl flex flex-col items-center justify-between shadow-xs transition-all duration-200 relative bg-white hover:bg-slate-50 border border-slate-200/95`}
            >
              <span className={`text-[9px] md:text-[10px] font-bold uppercase tracking-widest font-mono text-slate-400`}>Box {index + 1}</span>
              <span className={`text-xl md:text-2xl font-extrabold mt-1 font-display text-indigo-600`}>{count}</span>
              <span className="text-[9px] md:text-[10px] text-slate-400 font-medium font-mono hidden sm:block mt-1">
                {index === 0 ? 'Review: 1 Day' : index === 1 ? '3 Days' : index === 2 ? '7 Days' : index === 3 ? '14 Days' : '30 Days'}
              </span>
            </div>
          );
        })}
      </div>

      {showCompletedNotice && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-6 bg-gradient-to-br from-indigo-950 to-slate-900 border border-slate-850 rounded-3xl text-white text-center max-w-md mx-auto space-y-4 shadow-xl"
        >
          <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mx-auto text-yellow-350">
            <Award className="w-6 h-6 animate-bounce" />
          </div>
          <h3 className="text-xl font-bold font-display">Sesiune Finalizată! 🎉</h3>
          <p className="text-xs text-indigo-200 leading-relaxed max-w-xs mx-auto">
            All due cards have been successfully rescheduled based on Leitner retention curves. You gained <span className="font-bold text-yellow-400">+3 XP</span> per item!
          </p>
          <button
            onClick={() => setShowCompletedNotice(false)}
            className="px-5 py-2 bg-yellow-450 hover:bg-yellow-400 text-slate-950 font-bold text-xs rounded-xl cursor-pointer transition-all"
          >
            Practice Again
          </button>
        </motion.div>
      )}

      {/* Due card card deck area */}
      {!showCompletedNotice && (
        progress.flashcards.length === 0 ? (
          <div className="text-center p-12 bg-white rounded-3xl border border-slate-200 max-w-sm mx-auto space-y-4 shadow-sm">
            <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto">
              <Layers className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-805 font-display">SRS Deck is Empty</h3>
            <p className="text-xs text-slate-500 leading-relaxed text-center">
              Flashcards are auto-extracted from studying scenarios. Open Scenarios in your Library, select the <span className="font-semibold text-indigo-600">Flashcards</span> tab, and add words!
            </p>
          </div>
        ) : dueCards.length === 0 ? (
          <div className="text-center p-12 bg-white rounded-3xl border border-indigo-100 bg-indigo-50/5 shadow-xs max-w-md mx-auto space-y-4">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-808 font-display">Zero Cards Due Today!</h3>
            <p className="text-xs text-slate-500 leading-relaxed text-center">
              Felicitări! Your memory indexes are in tip-top shape. There are no vocabulary reviews scheduled at this time.
            </p>
            <div className="flex gap-2 justify-center pt-2">
              <button
                onClick={() => setForcePracticeAll(true)}
                className="px-4 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition cursor-pointer shadow-sm flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Practice All {progress.flashcards.length} Cards Anyway
              </button>
            </div>
          </div>
        ) : (
          <div className="max-w-md mx-auto space-y-6">
            
            {/* Deck remaining tags counter */}
            <div className="flex justify-between items-center text-xs text-slate-400 font-mono">
              <span className="flex items-center gap-1.5 font-bold text-orange-600">
                <span className="w-2.5 h-2.5 rounded-full bg-orange-500 animate-pulse"></span>
                {dueCards.length} Reviews Pending Study
              </span>
              <span className="font-bold">Card {activeCardIndex + 1} of {dueCards.length}</span>
            </div>

            {/* Interactive Study Flashcard with 3D animation */}
            {currentCard && (
              <div className="w-full max-w-md mx-auto perspective-1000 min-h-[270px]">
                <div 
                  id="srs-core-card"
                  onClick={() => setIsFlipped(!isFlipped)}
                  className={`relative w-full min-h-[275px] transition-transform duration-500 preserve-3d ${
                    isFlipped ? 'rotate-y-180' : ''
                  }`}
                >
                  {/* FRONT SIDE */}
                  <div className="absolute inset-0 w-full h-full rounded-3xl bg-linear-to-br from-indigo-50/30 to-purple-50/40 border-2 border-indigo-100 p-6 flex flex-col justify-between shadow-md hover:border-indigo-300 transition-colors backface-hidden">
                    <div className="absolute top-4 right-4 text-indigo-400/80">
                      <BookmarkCheck className="w-5 h-5 fill-indigo-50/40" />
                    </div>
                    <div className="flex-1 flex flex-col justify-center items-center text-center space-y-3.5 select-none pt-4">
                      <span className="text-[10px] text-indigo-600 font-black uppercase tracking-widest font-mono bg-indigo-50/80 border border-indigo-100 px-2.5 py-0.5 rounded-full">Romanian</span>
                      <h4 className="text-4xl font-extrabold text-slate-800 tracking-tight font-display">
                        {currentCard.romanian}
                      </h4>
                      <span className="text-slate-400 text-[11px] font-bold animate-pulse mt-1">(Tap to reveal English meaning)</span>
                    </div>
                    <div className="text-center text-[10px] text-slate-450 font-mono pt-4 border-t border-indigo-100/50 flex items-center justify-center gap-1.5">
                      <Sparkles className="w-3 h-3 text-indigo-400" /> Tap Card to Flip
                    </div>
                  </div>

                  {/* BACK SIDE */}
                  <div className="absolute inset-0 w-full h-full rounded-3xl bg-white border-2 border-purple-200 p-6 flex flex-col justify-between shadow-md hover:border-purple-300 transition-colors backface-hidden rotate-y-180">
                    <div className="absolute top-4 right-4 text-purple-400">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <div className="flex-1 flex flex-col justify-between space-y-3 pt-1">
                      <div className="text-center space-y-1.5 select-none">
                        <span className="text-[10px] text-purple-650 font-black uppercase tracking-widest font-mono bg-purple-50 border border-purple-102 px-2.5 py-0.5 rounded-full inline-block">English Definition</span>
                        <h4 className="text-2xl font-extrabold text-slate-850 leading-tight">
                          {currentCard.english}
                        </h4>
                      </div>

                      <div className="p-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-[11px] space-y-1 leading-relaxed text-left grow flex flex-col justify-center">
                        <span className="font-extrabold text-slate-500 text-[9px] uppercase tracking-wider font-mono">Ref Context Example:</span>
                        <p className="text-slate-800 italic font-semibold">"{currentCard.context}"</p>
                        <p className="text-slate-450 font-bold">Translation: {currentCard.contextTranslation}</p>
                      </div>
                    </div>

                    <div className="text-center text-[10px] text-purple-550 font-mono pt-3 border-t border-purple-100/50 flex items-center justify-center gap-1 select-none">
                      <Sparkles className="w-3 h-3 text-purple-400 animate-pulse" /> Tap again to check word
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Scheduling answers */}
            {currentCard && (
              <div className="space-y-3 text-center">
                <div className="text-xs text-slate-500 font-medium">Preserve vocabulary retention difficulty index:</div>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => handleSrsReviewFeedback(currentCard, 'hard')}
                    className="py-2.5 rounded-xl border border-red-200 text-red-650 hover:bg-red-55 text-xs font-bold cursor-pointer transition-all uppercase tracking-wider font-mono"
                  >
                    🔴 Hard
                  </button>
                  <button
                    onClick={() => handleSrsReviewFeedback(currentCard, 'good')}
                    className="py-2.5 rounded-xl border border-indigo-200 text-indigo-600 hover:bg-indigo-50 text-xs font-bold cursor-pointer transition-all uppercase tracking-wider font-mono"
                  >
                    🔵 Good
                  </button>
                  <button
                    onClick={() => handleSrsReviewFeedback(currentCard, 'easy')}
                    className="py-2.5 rounded-xl border border-emerald-200 text-emerald-650 hover:bg-emerald-55 text-xs font-bold cursor-pointer transition-all uppercase tracking-wider font-mono"
                  >
                    🟢 Easy
                  </button>
                </div>
              </div>
            )}
          </div>
        )
      )}

      {/* AdSense Unit */}
      <div className="pt-4">
        <AdBanner dataAdSlot="6667778889" />
      </div>
    </motion.div>
  );
}

