import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Globe, X, Check, Languages, Sparkles } from 'lucide-react';
import { UserProgress } from '../types';

interface LanguageSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  progress: UserProgress;
  onUpdateProgress: (updatedFields: Partial<UserProgress>) => void;
}

export const TARGET_LANGUAGES = [
  { id: 'English', label: 'English', flag: '🇺🇸', native: 'English' },
  { id: 'Romanian', label: 'Romanian', flag: '🇷🇴', native: 'Română' },
  { id: 'Dutch', label: 'Dutch', flag: '🇳🇱', native: 'Nederlands' },
  { id: 'Spanish', label: 'Spanish', flag: '🇪🇸', native: 'Español' },
  { id: 'German', label: 'German', flag: '🇩🇪', native: 'Deutsch' },
  { id: 'French', label: 'French', flag: '🇫🇷', native: 'Français' },
  { id: 'Italian', label: 'Italian', flag: '🇮🇹', native: 'Italiano' },
  { id: 'Japanese', label: 'Japanese', flag: '🇯🇵', native: '日本語' },
  { id: 'Portuguese', label: 'Portuguese', flag: '🇵🇹', native: 'Português' },
];

export const SOURCE_LANGUAGES = [
  { id: 'English', label: 'English', flag: '🇺🇸' },
  { id: 'Spanish', label: 'Spanish', flag: '🇪🇸' },
  { id: 'French', label: 'French', flag: '🇫🇷' },
  { id: 'German', label: 'German', flag: '🇩🇪' },
  { id: 'Romanian', label: 'Romanian', flag: '🇷🇴' },
];

export default function LanguageSettingsModal({ isOpen, onClose, progress, onUpdateProgress }: LanguageSettingsModalProps) {
  const currentTarget = progress.targetLanguage || 'Romanian';
  const currentSource = progress.sourceLanguage || 'English';

  const selectTarget = (target: string) => {
    onUpdateProgress({ targetLanguage: target });
  };

  const selectSource = (source: string) => {
    onUpdateProgress({ sourceLanguage: source });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop screen */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/65 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            className="bg-white w-full max-w-xl rounded-3xl border-2 border-slate-200 overflow-hidden shadow-2xl relative z-10 flex flex-col max-h-[90vh] md:max-h-[85vh]"
          >
            {/* Header branding */}
            <div className="p-6 bg-gradient-to-r from-indigo-900 to-indigo-950 text-white flex justify-between items-start">
              <div>
                <span className="inline-flex items-center gap-1.5 bg-indigo-800 text-indigo-200 text-[9px] font-black tracking-widest uppercase px-2.5 py-1 rounded-full font-mono mb-2">
                  <Languages className="w-3 h-3" /> Universal Tutor System
                </span>
                <h3 className="text-xl font-extrabold font-display leading-none">Dynamic Language Coach</h3>
                <p className="text-[11px] text-indigo-205 mt-2 font-medium leading-relaxed max-w-[420px]">
                  Powered by <span className="text-yellow-400 font-extrabold">Gemini 2.5 Flash</span>. Switch study pairings instantly — the AI dynamically adapts grammar lessons, narrative structures, and virtual speech partner feedback!
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 hover:bg-white/10 rounded-xl transition text-indigo-250 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable contents */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1">
              {/* Target Language Selection (What to learn) */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider font-mono">1. I Want to Study</h4>
                  <span className="text-[10px] text-indigo-600 font-bold font-mono">Learning Target</span>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {TARGET_LANGUAGES.map((lang) => {
                    const isSelected = currentTarget === lang.id;
                    return (
                      <button
                        key={lang.id}
                        type="button"
                        onClick={() => selectTarget(lang.id)}
                        className={`p-3.5 rounded-2xl border-2 cursor-pointer flex flex-col items-center justify-center text-center transition-all duration-100 relative group ${
                          isSelected
                            ? 'bg-indigo-50 border-indigo-600 text-indigo-950 font-extrabold shadow-sm'
                            : 'bg-white border-slate-100 hover:border-slate-300 text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        {isSelected && (
                          <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-indigo-600 rounded-full flex items-center justify-center text-white">
                            <Check className="w-2.5 h-2.5 stroke-[3.5]" />
                          </span>
                        )}
                        <span className="text-3xl mb-1.5 group-hover:scale-110 transition duration-150 select-none">
                          {lang.flag}
                        </span>
                        <span className="text-xs font-extrabold leading-none">{lang.label}</span>
                        <span className="text-[9px] font-bold text-slate-400 mt-1">{lang.native}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Source/Explanation Language (Interface / explanations) */}
              <div className="space-y-3 pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider font-mono">2. Explain Lessons In</h4>
                  <span className="text-[10px] text-indigo-600 font-bold font-mono">Support Language</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                  {SOURCE_LANGUAGES.map((lang) => {
                    const isSelected = currentSource === lang.id;
                    return (
                      <button
                        key={lang.id}
                        type="button"
                        onClick={() => selectSource(lang.id)}
                        className={`p-3 rounded-2xl border-2 cursor-pointer flex flex-col items-center justify-center text-center transition-all duration-100 relative group ${
                          isSelected
                            ? 'bg-sky-50 border-sky-500 text-sky-950 font-extrabold shadow-sm'
                            : 'bg-white border-slate-100 hover:border-slate-300 text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        {isSelected && (
                          <span className="absolute top-1.5 right-1.5 w-3.5 h-3.5 bg-sky-500 rounded-full flex items-center justify-center text-white">
                            <Check className="w-2 h-2 stroke-[3.5]" />
                          </span>
                        )}
                        <span className="text-2xl mb-1 select-none group-hover:scale-110 transition duration-150">
                          {lang.flag}
                        </span>
                        <span className="text-[11px] font-extrabold leading-none">{lang.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Educational info container */}
              <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 flex items-start gap-3">
                <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="text-[11px] text-amber-900 font-extrabold font-display leading-tight">Infinite Micro-Curriculum</p>
                  <p className="text-[10px] text-amber-705 font-medium leading-relaxed">
                    By choosing <strong className="text-amber-800">{currentTarget}</strong> explained in <strong className="text-amber-800">{currentSource}</strong>, our sandbox automatically adapts the Leitner LeitBox Decks, dynamically translates the syllabus, and teaches you core conversation routines in real-time.
                  </p>
                </div>
              </div>
            </div>

            {/* Sticky footer action banner */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 bg-slate-900 hover:bg-slate-805 text-white font-extrabold text-xs tracking-wider uppercase rounded-2xl cursor-pointer transition shadow-sm border border-slate-950"
              >
                Apply Framework Settings
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
