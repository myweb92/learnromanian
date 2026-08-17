import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  Award, 
  CheckCircle, 
  XCircle, 
  ChevronRight, 
  BookOpen, 
  Crown,
  HelpCircle
} from 'lucide-react';
import { CEFRLevel } from '../types';
import confetti from 'canvas-confetti';

interface LevelAssessmentModalProps {
  isOpen: boolean;
  onSelectLevel: (level: CEFRLevel) => void;
  onSkip: () => void;
}

interface Question {
  id: number;
  level: CEFRLevel;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

const ASSESSMENT_QUESTIONS: Question[] = [
  {
    id: 1,
    level: 'A1',
    question: "Which of these is the correct Romanian greeting for 'Good morning'?",
    options: [
      "Noapte bună",
      "Bună dimineața",
      "La revedere",
      "Mulțumesc"
    ],
    correctIndex: 1,
    explanation: "Correct! 'Bună dimineața' is the standard way to say 'Good morning' from sunrise until around 11 AM."
  },
  {
    id: 2,
    level: 'A2',
    question: "How would you say 'I want to go to the train station, please' in Romanian?",
    options: [
      "Vreau să merg la restaurant, vă rog.",
      "Unde este spitalul cel mai apropiat?",
      "Vreau să merg la gară, vă rog.",
      "Cât costă această pâine caldă?"
    ],
    correctIndex: 2,
    explanation: "Excellent! 'Gară' is the Romanian word for train station, and 'vă rog' adds a polite touch."
  },
  {
    id: 3,
    level: 'B1',
    question: "Complete the conditional statement: 'Dacă aș fi știut că vii, ___ un cozonac delicios.'",
    options: [
      "am făcut",
      "voi face",
      "aș fi făcut",
      "făceam"
    ],
    correctIndex: 2,
    explanation: "Spot on! This uses the past conditional-optative tense 'aș fi făcut' (I would have made) to describe a hypothetical past."
  },
  {
    id: 4,
    level: 'B2',
    question: "What does the Romanian colloquial idiom 'A bate șaua ca să priceapă iapa' mean?",
    options: [
      "To ride a horse at high speeds.",
      "To beat the saddle so the mare understands (meaning: to drop a subtle hint).",
      "To build farm fences in the spring.",
      "To complain loudly about something minor."
    ],
    correctIndex: 1,
    explanation: "Brilliant! This colorful Romanian idiom means to drop a hint or make an indirect suggestion so the listener understands without direct confrontation."
  }
];

export default function LevelAssessmentModal({ isOpen, onSelectLevel, onSkip }: LevelAssessmentModalProps) {
  const [step, setStep] = useState<'intro' | 'quiz' | 'result'>('intro');
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAns, setSelectedAns] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [answersLog, setAnswersLog] = useState<{ qId: number; correct: boolean }[]>([]);

  if (!isOpen) return null;

  const currentQuestion = ASSESSMENT_QUESTIONS[currentIdx];

  const handleOptionClick = (optIdx: number) => {
    if (selectedAns !== null) return;
    setSelectedAns(optIdx);
    const isCorrect = optIdx === currentQuestion.correctIndex;
    if (isCorrect) {
      setScore((s) => s + 1);
    }
    setAnswersLog((log) => [...log, { qId: currentQuestion.id, correct: isCorrect }]);
  };

  const handleNext = () => {
    setSelectedAns(null);
    if (currentIdx < ASSESSMENT_QUESTIONS.length - 1) {
      setCurrentIdx((idx) => idx + 1);
    } else {
      // Finished all questions, calculate recommended level
      setStep('result');
      triggerConfetti();
    }
  };

  const getRecommendedLevel = (): CEFRLevel => {
    if (score <= 1) return 'A1';
    if (score === 2) return 'A2';
    if (score === 3) return 'B1';
    return 'B2';
  };

  const triggerConfetti = () => {
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.6 }
    });
  };

  const handleCompleteAssessment = (finalLevel: CEFRLevel) => {
    onSelectLevel(finalLevel);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4">
      <div className="relative w-full max-w-xl bg-white rounded-3xl border-2 border-slate-200 border-b-8 shadow-2xl overflow-hidden select-none">
        
        {/* PROGRESS INDICATOR */}
        {step === 'quiz' && (
          <div className="w-full bg-slate-100 h-2.5 relative">
            <div 
              className="bg-gradient-to-r from-sky-400 via-teal-400 to-emerald-400 h-full transition-all duration-300"
              style={{ width: `${((currentIdx + 1) / ASSESSMENT_QUESTIONS.length) * 100}%` }}
            />
          </div>
        )}

        <div className="p-6 md:p-8 space-y-6">
          <AnimatePresence mode="wait">
            
            {/* INTRO SCREEN */}
            {step === 'intro' && (
              <motion.div
                key="intro"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="text-center space-y-6"
              >
                <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-sky-100 to-teal-100 flex items-center justify-center text-4xl mx-auto shadow-inner animate-float">
                  🐻
                </div>
                
                <div className="space-y-2">
                  <span className="bg-indigo-50 border border-indigo-150 text-indigo-700 font-black text-[10px] uppercase tracking-widest px-3 py-1 rounded-full font-mono">
                    Niran's Path Assistant
                  </span>
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight font-display">
                    Find Your Starting Level!
                  </h3>
                  <p className="text-xs text-slate-500 font-semibold leading-relaxed max-w-sm mx-auto">
                    Take a quick 4-question assessment to identify your current Romanian level. Niran will place you on the path accordingly.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <button
                    onClick={onSkip}
                    className="py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-600 font-black rounded-2xl text-xs uppercase tracking-wider font-mono transition"
                  >
                    Start from A1 🎓
                  </button>
                  <button
                    onClick={() => setStep('quiz')}
                    className="py-3 px-4 bg-teal-500 hover:bg-teal-600 text-white font-black rounded-2xl text-xs uppercase tracking-wider font-mono border-b-4 border-teal-700 hover:border-teal-800 transition active:translate-y-[2px] active:border-b-2"
                  >
                    Take Assessment ⚡
                  </button>
                </div>
              </motion.div>
            )}

            {/* QUIZ STEP */}
            {step === 'quiz' && (
              <motion.div
                key="quiz"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-mono font-black text-slate-400 uppercase tracking-widest">
                    Question {currentIdx + 1} of {ASSESSMENT_QUESTIONS.length}
                  </span>
                  <span className="bg-slate-100 text-slate-700 border border-slate-200 text-[10px] font-black uppercase px-2 py-0.5 rounded-lg font-mono">
                    CEFR {currentQuestion.level}
                  </span>
                </div>

                <h4 className="text-base font-extrabold text-slate-800 leading-snug font-display">
                  {currentQuestion.question}
                </h4>

                <div className="space-y-2.5">
                  {currentQuestion.options.map((option, idx) => {
                    const isSelected = selectedAns === idx;
                    const isCorrectOption = idx === currentQuestion.correctIndex;
                    const showSuccess = selectedAns !== null && isCorrectOption;
                    const showDanger = selectedAns !== null && isSelected && !isCorrectOption;

                    return (
                      <button
                        key={idx}
                        disabled={selectedAns !== null}
                        onClick={() => handleOptionClick(idx)}
                        className={`w-full p-4 text-left text-xs font-bold rounded-2xl border-2 transition-all flex items-center justify-between ${
                          selectedAns === null
                            ? 'bg-white border-slate-200 hover:border-teal-350 hover:bg-slate-50/50 cursor-pointer'
                            : showSuccess
                            ? 'bg-emerald-50 border-emerald-450 text-emerald-800'
                            : showDanger
                            ? 'bg-rose-50 border-rose-450 text-rose-800'
                            : 'bg-white border-slate-150 text-slate-400 opacity-70'
                        }`}
                      >
                        <span>{option}</span>
                        {selectedAns !== null && isCorrectOption && (
                          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                        )}
                        {selectedAns !== null && isSelected && !isCorrectOption && (
                          <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* COACH COMMENT & EXPLANATION ROW */}
                <AnimatePresence>
                  {selectedAns !== null && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-indigo-50/70 border border-indigo-100 rounded-2xl p-4 flex gap-3.5"
                    >
                      <div className="text-2xl select-none shrink-0">🐻</div>
                      <div className="space-y-1">
                        <p className="text-[10px] font-black text-indigo-700 uppercase tracking-widest font-mono">
                          {selectedAns === currentQuestion.correctIndex ? "Bine lucrat! ✨" : "Aproape corect! 💡"}
                        </p>
                        <p className="text-xs text-slate-650 leading-relaxed font-semibold">
                          {currentQuestion.explanation}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* FOOTER ACTION BUTTON */}
                {selectedAns !== null && (
                  <button
                    onClick={handleNext}
                    className="w-full bg-slate-900 hover:bg-slate-800 text-white font-black py-3 rounded-2xl text-xs uppercase tracking-widest font-mono border-b-4 border-slate-950 active:translate-y-[2px] active:border-b-2 flex items-center justify-center gap-1 cursor-pointer transition-all"
                  >
                    {currentIdx < ASSESSMENT_QUESTIONS.length - 1 ? "Next Question" : "View Placement results"}
                    <ChevronRight className="w-4 h-4" />
                  </button>
                )}
              </motion.div>
            )}

            {/* RESULTS SCREEN */}
            {step === 'result' && (
              <motion.div
                key="result"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="text-center space-y-6"
              >
                <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-yellow-100 to-amber-100 flex items-center justify-center text-4xl mx-auto shadow-md">
                  🏆
                </div>

                <div className="space-y-2">
                  <span className="bg-emerald-50 border border-emerald-150 text-emerald-700 font-black text-[10px] uppercase tracking-widest px-3 py-1 rounded-full font-mono">
                    Evaluation Complete
                  </span>
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight font-display">
                    Your Placement: <span className="text-teal-600 font-black uppercase">CEFR {getRecommendedLevel()}</span>
                  </h3>
                  <p className="text-xs text-slate-500 font-bold max-w-sm mx-auto leading-relaxed">
                    You answered <span className="text-slate-800 font-black">{score} of {ASSESSMENT_QUESTIONS.length}</span> questions correctly. Niran has calibrated your adventure track.
                  </p>
                </div>

                {/* Level selection row if they want to override */}
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/60 text-left space-y-3">
                  <div className="flex items-center gap-2">
                    <Crown className="w-4 h-4 text-amber-500" />
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-mono">
                      Adjust Assigned Level manually
                    </span>
                  </div>
                  <div className="grid grid-cols-4 gap-1.5">
                    {(['A1', 'A2', 'B1', 'B2'] as const).map((lvl) => {
                      const isRecommended = getRecommendedLevel() === lvl;
                      return (
                        <button
                          key={lvl}
                          onClick={() => handleCompleteAssessment(lvl)}
                          className="py-2 text-xs font-black rounded-xl border-2 transition hover:bg-slate-100 cursor-pointer text-center flex flex-col items-center justify-center"
                        >
                          <span className="text-slate-800 font-black">{lvl}</span>
                          {isRecommended && (
                            <span className="text-[6px] font-black text-teal-600 uppercase tracking-widest mt-0.5">
                              Rec
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <button
                  onClick={() => handleCompleteAssessment(getRecommendedLevel())}
                  className="w-full bg-teal-500 hover:bg-teal-600 text-white font-black py-4 rounded-2xl text-xs uppercase tracking-widest font-mono border-b-4 border-teal-700 hover:border-teal-800 transition active:translate-y-[2px] active:border-b-2 flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-teal-100"
                >
                  Confirm Level & Enter learning path
                  <ChevronRight className="w-4 h-4" />
                </button>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
