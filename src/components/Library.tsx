import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  BookOpen, 
  CheckCircle, 
  CheckCircle2,
  Bookmark, 
  Clock, 
  Heart, 
  Layers,
  Sparkles,
  Crown,
  MapPin,
  Lock,
  Unlock,
  Gift,
  ArrowLeft,
  Share2,
  Zap,
  ChevronRight,
  Sparkle
} from 'lucide-react';
import { Scenario, UserProgress, CEFRLevel, ScenarioCategory } from '../types';
import { SCENARIOS } from '../data/topics';
import NiranCoach from './NiranCoach';
import AdBanner from './AdBanner';
import { t } from '../lib/i18n';

const LEVEL_RANKS: Record<CEFRLevel, number> = {
  'A1': 1,
  'A2': 2,
  'B1': 3,
  'B2': 4
};

interface LibraryProps {
  progress: UserProgress;
  
  onSelectScenario: (scenario: Scenario) => void;
  onToggleFavorite: (id: string) => void;
}

export function getLanguageFlag(lang?: string): string {
  if (!lang) return '🇷🇴';
  const l = lang.toLowerCase();
  if (l.includes('romanian')) return '🇷🇴';
  if (l.includes('english')) return '🇺🇸';
  if (l.includes('dutch') || l.includes('nederlands')) return '🇳🇱';
  if (l.includes('spanish') || l.includes('español')) return '🇪🇸';
  if (l.includes('german') || l.includes('deutsch')) return '🇩🇪';
  if (l.includes('french') || l.includes('français')) return '🇫🇷';
  if (l.includes('italian') || l.includes('italiano')) return '🇮🇹';
  if (l.includes('japanese') || l.includes('日本語')) return '🇯🇵';
  if (l.includes('portuguese') || l.includes('português')) return '🇵🇹';
  return '🌍';
}

export default function Library({ progress, onSelectScenario, onToggleFavorite }: LibraryProps) {
  // Navigation inside Library
  const [searchTerm, setSearchTerm] = useState('');

  // Scroll to active node
  React.useEffect(() => {
    // Scroll logic removed since path view is gone
  }, [progress.lastSelectedScenarioId]);
  const [selectedLevel, setSelectedLevel] = useState<CEFRLevel | 'All'>('All');
  const [selectedCategory, setSelectedCategory] = useState<ScenarioCategory | 'All'>('All');
  const [selectedStatus, setSelectedStatus] = useState<'All' | 'Completed' | 'Favorite' | 'Not Started'>('All');
  
  // Lesson Detail drawer/overlay state (Matches mockup Screen 2)
  const [activeDrawerScenario, setActiveDrawerScenario] = useState<Scenario | null>(null);

  // Bonus Chest state
  const [chestMessage, setChestMessage] = useState<string | null>(null);

  // Categories list
  const categories: (ScenarioCategory | 'All')[] = [
    'All',
    'Daily Life',
    'Travel & Tourism',
    'Food & Dining',
    'Culture & Customs',
    'Work & Professional',
    'Shopping & Services',
    'Socializing',
    'Emergency & Health'
  ];

  const levels: (CEFRLevel | 'All')[] = ['All', 'A1', 'A2', 'B1', 'B2'];

  const targetLng = progress.targetLanguage || "Romanian";

  // Filtered list for Catalog
  const filteredScenarios = useMemo(() => {
    return SCENARIOS.filter((scenario) => {
      const matchesSearch = 
        scenario.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        scenario.description.toLowerCase().includes(searchTerm.toLowerCase());
        
      const matchesLevel = selectedLevel === 'All' || scenario.level === selectedLevel;
      const matchesCategory = selectedCategory === 'All' || scenario.category === selectedCategory;
      
      let matchesStatus = true;
      if (selectedStatus === 'Completed') {
        matchesStatus = progress.completedScenarios.includes(scenario.id);
      } else if (selectedStatus === 'Favorite') {
        matchesStatus = progress.favorites.includes(scenario.id);
      } else if (selectedStatus === 'Not Started') {
        matchesStatus = !progress.completedScenarios.includes(scenario.id) && !progress.inProgressScenarios.includes(scenario.id);
      }
      
      return matchesSearch && matchesLevel && matchesCategory && matchesStatus;
    });
  }, [searchTerm, selectedLevel, selectedCategory, selectedStatus, progress]);

  // Level color styling helper
  const getLevelBadgeStyles = (level: CEFRLevel) => {
    switch (level) {
      case 'A1': return 'bg-teal-50 text-teal-700 border-teal-100/50';
      case 'A2': return 'bg-emerald-50 text-emerald-700 border-emerald-100/50';
      case 'B1': return 'bg-amber-50 text-amber-700 border-amber-100/50';
      case 'B2': return 'bg-rose-50 text-rose-700 border-rose-100/50';
    }
  };

  const getCategoryEmoji = (category: ScenarioCategory) => {
    switch (category) {
      case 'Daily Life': return '💼';
      case 'Travel & Tourism': return '✈️';
      case 'Food & Dining': return '🍲';
      case 'Culture & Customs': return '🎨';
      case 'Work & Professional': return '💻';
      case 'Shopping & Services': return '🛒';
      case 'Socializing': return '🍷';
      case 'Emergency & Health': return '🚑';
    }
  };

  const getThematicEmoji = (scenario: Scenario) => {
    const title = scenario.title.toLowerCase();
    if (title.includes('morning') || title.includes('dimineață')) return '🌅';
    if (title.includes('covrigi') || title.includes('pretzel')) return '🥨';
    if (title.includes('coffee') || title.includes('cafea') || title.includes('meron')) return '☕️';
    if (title.includes('metro') || title.includes('train')) return '🚇';
    if (title.includes('market') || title.includes('supermarket')) return '🛒';
    if (title.includes('park') || title.includes('walk')) return '🌳';
    if (title.includes('sarmale') || title.includes('food')) return '🍲';
    if (title.includes('taxi')) return '🚕';
    if (title.includes('pharmacy') || title.includes('health')) return '⚕️';
    if (title.includes('airport') || title.includes('flight')) return '✈️';
    if (title.includes('mountain') || title.includes('hiking') || title.includes('bran')) return '⛰️';
    if (title.includes('car') || title.includes('mechanic')) return '🚗';
    if (title.includes('museum') || title.includes('art')) return '🏛️';
    
    return getCategoryEmoji(scenario.category);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-6 select-none font-sans max-w-5xl mx-auto"
    >
      {/* PAGE HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 p-8 md:p-10 bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100/60 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-72 h-72 bg-teal-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-56 h-56 bg-amber-50 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-3">
            <div className="w-14 h-14 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center text-3xl relative overflow-hidden shrink-0">
              <div className="absolute inset-0 bg-gradient-to-br from-teal-500/5 to-transparent" />
              {getLanguageFlag(targetLng)}
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-slate-800 tracking-tight font-display">{t('lesson_catalog', progress.sourceLanguage)}</h2>
          </div>
          <p className="text-sm md:text-base font-medium text-slate-500 max-w-2xl leading-relaxed">
            Browse and pick specific dialogues to master {targetLng}. Expand your vocabulary and practice speaking in real-life scenarios.
          </p>
        </div>
      </div>

      {/* CHEST ALERT POPUP */}
      <AnimatePresence>
        {chestMessage && (
          <motion.div 
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="bg-amber-500 text-slate-950 p-4 rounded-2xl border-b-4 border-amber-700 font-bold text-xs shadow-md flex items-center justify-between gap-3 relative z-50"
          >
            <div className="flex items-center gap-2">
              <span className="text-lg">🎁</span>
              <p>{chestMessage}</p>
            </div>
            <button 
              onClick={() => setChestMessage(null)}
              className="text-[10px] font-black uppercase tracking-wider bg-amber-600/30 hover:bg-amber-600/50 px-2 py-1 rounded"
            >
              Okay
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CATALOG FILTERS */}
      <div className="space-y-6">
          
          {/* Filter segment */}
          <div className="space-y-6 bg-white/70 backdrop-blur-xl p-8 rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white">
            {/* Search Input Bar */}
            <div className="relative group">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-teal-600 transition-colors" />
              <input 
                type="text"
                placeholder={`Search keywords, locations, or food...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-13 pr-6 py-4 rounded-2xl bg-white border border-slate-100 shadow-[inset_0_2px_6px_rgba(0,0,0,0.02)] text-base focus:outline-hidden focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 font-semibold text-slate-700 placeholder-slate-400 transition-all"
              />
            </div>

            {/* Filters Row */}
            <div className="flex flex-wrap gap-6 items-center justify-between">
              <div className="flex flex-wrap gap-6 items-center">
                <div className="flex items-center gap-3">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Level</span>
                  <div className="flex gap-1.5 p-1 bg-slate-100/50 rounded-xl border border-slate-100">
                    {levels.map((lvl) => (
                      <button
                        key={lvl}
                        onClick={() => setSelectedLevel(lvl)}
                        className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all duration-200 cursor-pointer ${
                          selectedLevel === lvl 
                            ? 'bg-white text-teal-700 shadow-sm border border-slate-200/50' 
                            : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
                        }`}
                      >
                        {lvl}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="hidden md:block w-px h-8 bg-slate-200"></div>

                <div className="flex items-center gap-3">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Status</span>
                  <div className="flex gap-1.5 p-1 bg-slate-100/50 rounded-xl border border-slate-100">
                    {(['All', 'Completed', 'Favorite', 'Not Started'] as const).map((status) => (
                      <button
                        key={status}
                        onClick={() => setSelectedStatus(status)}
                        className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all duration-200 cursor-pointer ${
                          selectedStatus === status 
                            ? 'bg-white text-teal-700 shadow-sm border border-slate-200/50' 
                            : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
                        }`}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="text-xs font-bold text-slate-400 bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-100">
                MATCHED: <span className="text-teal-600 ml-1">{filteredScenarios.length}</span>
              </div>
            </div>

            {/* Scrollable Categories Track */}
            <div className="pt-6 mt-2 border-t border-slate-100">
              <div className="text-[11px] font-bold text-slate-400 mb-3 uppercase tracking-widest">Theme Tracks</div>
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`py-2.5 px-5 rounded-2xl text-xs font-bold whitespace-nowrap cursor-pointer transition-all shrink-0 flex items-center gap-2 ${
                      selectedCategory === cat 
                        ? 'bg-teal-600 text-white shadow-md shadow-teal-600/20 ring-2 ring-teal-600/20 ring-offset-1' 
                        : 'bg-white text-slate-600 shadow-sm border border-slate-100 hover:border-slate-200 hover:shadow-md hover:-translate-y-0.5'
                    }`}
                  >
                    <span className="text-sm">{cat === 'All' ? '🌐' : getCategoryEmoji(cat as ScenarioCategory)}</span>
                    {cat === 'All' ? 'All Themes' : cat}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Grid listing scenarios */}
          {filteredScenarios.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredScenarios.map((scenario, index) => {
                const isCompleted = progress.completedScenarios.includes(scenario.id);
                const isInProgress = progress.inProgressScenarios.includes(scenario.id);
                const isFavorite = progress.favorites.includes(scenario.id);
                
                return (
                  <motion.div
                    key={scenario.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.2, delay: Math.min(index * 0.015, 0.15) }}
                    className={`group relative overflow-hidden rounded-[24px] bg-white p-6 shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-slate-100 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between ${
                      isCompleted ? 'border-teal-100 bg-gradient-to-b from-white to-teal-50/30' : ''
                    }`}
                  >
                    {/* Add subtle thematic illustration space */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-teal-50/50 to-transparent rounded-bl-[4rem] opacity-70 pointer-events-none" />
                    
                    <div className="flex justify-between items-start mb-6 relative z-10">
                      <div className="flex flex-col gap-2">
                        <div className="flex gap-2 items-center">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-bold border border-current shadow-sm select-none ${getLevelBadgeStyles(scenario.level)}`}>
                            {scenario.level}
                          </span>
                        </div>
                        <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-slate-400" /> {scenario.estimatedMinutes} mins
                        </span>
                      </div>
                      
                      {/* Favorite Toggle */}
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleFavorite(scenario.id);
                        }}
                        className={`p-2.5 rounded-full backdrop-blur-md transition-all duration-200 cursor-pointer ${
                          isFavorite 
                            ? 'bg-rose-50 border border-rose-100 text-rose-500 shadow-sm' 
                            : 'bg-slate-50 hover:bg-slate-100 border border-slate-100 text-slate-400 hover:text-slate-600'
                        }`}
                      >
                        <Heart className={`w-4 h-4 ${isFavorite ? 'fill-rose-500' : ''}`} />
                      </button>
                    </div>

                    <div className="space-y-2 mb-6 flex-1 relative z-10">
                      <div className="text-4xl mb-4 opacity-90 drop-shadow-sm group-hover:scale-110 transition-transform origin-left">
                        {getThematicEmoji(scenario)}
                      </div>
                      <h4 className="font-extrabold text-slate-800 text-lg leading-tight font-display group-hover:text-teal-700 transition-colors">
                        {scenario.title}
                      </h4>
                      <h5 className="text-[11px] text-teal-600/80 font-bold uppercase tracking-wider">
                        {scenario.category}
                      </h5>
                      <p className="text-slate-500 text-sm font-medium leading-relaxed pt-2 line-clamp-2">
                        {scenario.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-5 border-t border-slate-100 mt-auto relative z-10">
                      <div className="flex items-center text-[11px] font-bold uppercase tracking-wider">
                        {isCompleted ? (
                          <span className="text-teal-600 flex items-center gap-1.5">
                            <CheckCircle2 className="w-4 h-4 text-teal-500" /> Completed
                          </span>
                        ) : isInProgress ? (
                          <span className="text-amber-600 flex items-center gap-1.5">
                            <Bookmark className="w-4 h-4 text-amber-500" /> Studying
                          </span>
                        ) : (
                          <span className="text-slate-400">Not Started</span>
                        )}
                      </div>
                      
                      <button
                        onClick={() => {
                          onSelectScenario(scenario);
                        }}
                        className={`py-2.5 px-5 text-sm font-bold transition-all duration-300 rounded-xl shadow-sm cursor-pointer ${
                          isCompleted 
                            ? 'bg-teal-50 text-teal-700 hover:bg-teal-100 border border-teal-200' 
                            : 'bg-gradient-to-b from-teal-500 to-teal-600 hover:from-teal-400 hover:to-teal-500 text-white shadow-teal-500/20 border border-teal-600/50 hover:shadow-lg hover:shadow-teal-500/30'
                        }`}
                      >
                        {targetLng.toLowerCase() === 'romanian' ? "Exersează →" : "Practice →"}
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <div className="text-center p-16 bg-white rounded-[32px] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] max-w-md mx-auto space-y-6">
              <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto shadow-inner border border-slate-100">
                <Layers className="w-10 h-10 text-slate-300" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-extrabold text-slate-800 font-display tracking-tight">No lessons found</h3>
                <p className="text-sm text-slate-500 font-medium leading-relaxed">
                  Try adjusting your filters or search keywords to find what you're looking for.
                </p>
              </div>
              <button 
                onClick={() => {
                  setSearchTerm('');
                  setSelectedLevel('All');
                  setSelectedCategory('All');
                  setSelectedStatus('All');
                }}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm py-3.5 rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer"
              >
                Reset Filters
              </button>
            </div>
          )}

          <div className="mt-8">
            <AdBanner dataAdSlot="9876543210" />
          </div>
      </div>

      {/* VIEWMODE OVERLAY DRAWER: LESSON DETAILS (Matches mockup Screen 2 exactly) */}
      <AnimatePresence>
        {activeDrawerScenario && (
          <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex items-end justify-center z-50 p-0 sm:p-4">
            {/* Backdrop click closer */}
            <div className="absolute inset-0" onClick={() => setActiveDrawerScenario(null)} />

            <motion.div 
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="relative w-full max-w-lg bg-white rounded-t-3xl sm:rounded-3xl border-t border-slate-200 shadow-2xl overflow-hidden flex flex-col justify-between max-h-[92vh] sm:max-h-[85vh] z-10"
            >
              {/* TOP HEADER CONTROLS BAR */}
              <div className="bg-gradient-to-b from-sky-50 to-white px-5 py-4.5 border-b border-slate-100 flex items-center justify-between select-none">
                <button 
                  onClick={() => setActiveDrawerScenario(null)}
                  className="w-9 h-9 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <span className="font-extrabold text-slate-700 text-xs uppercase tracking-wider font-mono">
                  Lesson Details
                </span>
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    alert("📋 Link copied to share!");
                  }}
                  className="w-9 h-9 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>

              {/* DRAWER SCROLLABLE BODY */}
              <div className="p-6 overflow-y-auto space-y-6 flex-1 scrollbar-thin">
                
                {/* 1. Circle illustration emblem exactly like mockup */}
                <div className="flex flex-col items-center text-center space-y-3">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-sky-400 via-teal-350 to-emerald-350 p-1 shadow-md relative flex items-center justify-center select-none">
                    <div className="w-full h-full rounded-full bg-white flex items-center justify-center text-3xl">
                      {getCategoryEmoji(activeDrawerScenario.category)}
                    </div>
                  </div>
                  <div>
                    <span className="bg-teal-50 text-teal-800 font-black text-[9px] uppercase tracking-widest px-3 py-1 rounded-full font-mono border border-teal-200/50">
                      {activeDrawerScenario.level} &bull; {activeDrawerScenario.category}
                    </span>
                    <h3 className="text-xl font-extrabold text-slate-900 tracking-tight leading-snug font-display mt-2">
                      {activeDrawerScenario.title}
                    </h3>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-wider font-mono">
                      {activeDrawerScenario.category}
                    </p>
                  </div>
                </div>

                {/* 2. Three colored mockup stats blocks: Lessons, Quizzes, Hours */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-sky-50 rounded-2xl p-3 border border-sky-100 text-center flex flex-col items-center justify-center">
                    <span className="text-lg mb-1">📘</span>
                    <span className="text-xs font-black text-slate-800 block">Dialogue</span>
                    <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest font-mono">1 Unit</span>
                  </div>
                  <div className="bg-amber-50 rounded-2xl p-3 border border-amber-100 text-center flex flex-col items-center justify-center">
                    <span className="text-lg mb-1">📝</span>
                    <span className="text-xs font-black text-slate-800 block">Quiz Match</span>
                    <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest font-mono">1 Drills</span>
                  </div>
                  <div className="bg-purple-50 rounded-2xl p-3 border border-purple-100 text-center flex flex-col items-center justify-center">
                    <span className="text-lg mb-1">⏱️</span>
                    <span className="text-xs font-black text-slate-800 block">{activeDrawerScenario.estimatedMinutes} Mins</span>
                    <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest font-mono">Est Time</span>
                  </div>
                </div>

                {/* 3. Description Narrative */}
                <div className="space-y-1">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-mono">
                    Overview & Objectives
                  </h4>
                  <p className="text-xs text-slate-650 leading-relaxed font-medium">
                    {activeDrawerScenario.description}
                  </p>
                </div>

                {/* 4. Lesson Items List like mockup (Greeting & Introducing unit) */}
                <div className="space-y-2">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-mono mb-2">
                    Lessons Content
                  </h4>

                  <div className="space-y-2">
                    <div className="bg-slate-50 border border-slate-150 p-3.5 rounded-2xl flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-lg select-none">🗣️</span>
                        <div>
                          <p className="text-xs font-extrabold text-slate-800">1. Audio Roleplay Dialogue</p>
                          <p className="text-[9px] text-slate-450 font-semibold font-mono uppercase">Interactive conversation practice &bull; {activeDrawerScenario.estimatedMinutes} mins</p>
                        </div>
                      </div>
                      <span className="w-5 h-5 rounded-full bg-teal-50 border border-teal-200 text-teal-600 flex items-center justify-center text-[10px] font-black">
                        ✓
                      </span>
                    </div>

                    <div className="bg-slate-50 border border-slate-150 p-3.5 rounded-2xl flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-lg select-none">🗂️</span>
                        <div>
                          <p className="text-xs font-extrabold text-slate-800">2. Leitner Vocabulary Drill</p>
                          <p className="text-[9px] text-slate-450 font-semibold font-mono uppercase">Key phrases back-testing deck</p>
                        </div>
                      </div>
                      <span className="w-5 h-5 rounded-full bg-teal-50 border border-teal-200 text-teal-600 flex items-center justify-center text-[10px] font-black">
                        ✓
                      </span>
                    </div>

                    <div className="bg-slate-50 border border-slate-150 p-3.5 rounded-2xl flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-lg select-none">🎓</span>
                        <div>
                          <p className="text-xs font-extrabold text-slate-800">3. Comprehension Quiz Match</p>
                          <p className="text-[9px] text-slate-450 font-semibold font-mono uppercase">Multiple-choice evaluation challenge</p>
                        </div>
                      </div>
                      <span className="w-5 h-5 rounded-full bg-teal-50 border border-teal-200 text-teal-600 flex items-center justify-center text-[10px] font-black">
                        ✓
                      </span>
                    </div>
                  </div>
                </div>

              </div>

              {/* HUGE BOTTOM ACTION BUTTON */}
              <div className="p-5 border-t border-slate-100 bg-slate-50/70">
                <button
                  onClick={() => {
                    const sc = activeDrawerScenario;
                    setActiveDrawerScenario(null);
                    onSelectScenario(sc);
                  }}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white font-black uppercase text-xs tracking-widest font-mono py-4 rounded-2xl border-b-4 border-slate-950 active:translate-y-[4px] active:border-b-0 cursor-pointer text-center"
                >
                  Start Lessons 🚀
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </motion.div>
  );
}
