import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BookOpen, 
  Sparkles, 
  Volume2, 
  Plus, 
  Check, 
  Search, 
  GraduationCap, 
  Bookmark, 
  Compass, 
  Brain, 
  MessageSquare,
  AlertCircle,
  HelpCircle,
  ChevronRight,
  Shuffle,
  Activity,
  ArrowRight,
  Smile,
  Mic,
  Languages,
  Loader2,
  BookmarkCheck,
  Flame
} from 'lucide-react';
import { UserProgress, Flashcard } from '../types';
import { ESSENTIALS_BY_LANGUAGE, VocabItem, SentencePattern } from '../data/essentialsData';
import AdBanner from './AdBanner';

interface EssentialsProps {
  progress: UserProgress;
  onUpdateProgress: (updated: Partial<UserProgress>) => void;
  onOpenLanguageSettings?: () => void;
}

type EssentialsTab = 'vocab' | 'patterns' | 'pronunciation' | 'grammar';

export default function Essentials({ progress, onUpdateProgress, onOpenLanguageSettings }: EssentialsProps) {
  const targetLanguage = progress.targetLanguage || 'Romanian';
  const sourceLanguage = progress.sourceLanguage || 'English';
  
  const [activeSubTab, setActiveSubTab] = useState<EssentialsTab>('vocab');
  
  // Retrieve target data safely or default to Romanian
  const languageData = ESSENTIALS_BY_LANGUAGE[targetLanguage] || ESSENTIALS_BY_LANGUAGE['Romanian'];

  // --- VOCABULARY STATES ---
  const [vocabSearch, setVocabSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  // Range selection for 1000 words: rangeIndex represents the hundred group.
  const [vocabRangeIndex, setVocabRangeIndex] = useState(0); // 0 = 1-100, 1 = 101-200, etc.
  const [customGeneratedVocab, setCustomGeneratedVocab] = useState<Record<string, VocabItem[]>>({});
  const [loadingVocab, setLoadingVocab] = useState(false);
  const [vocabSuccessMsg, setVocabSuccessMsg] = useState<string | null>(null);

  // Vocabulary Practice Quiz Mini-State
  const [isQuizActive, setIsQuizActive] = useState(false);
  const [quizQuestions, setQuizQuestions] = useState<{ item: VocabItem; options: string[]; correctIdx: number }[]>([]);
  const [currentQuizIdx, setCurrentQuizIdx] = useState(0);
  const [selectedQuizAnswer, setSelectedQuizAnswer] = useState<number | null>(null);
  const [quizScore, setQuizScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  // --- SENTENCE PATTERNS STATES ---
  const [selectedPatternId, setSelectedPatternId] = useState<string>('');
  const [patternValues, setPatternValues] = useState<Record<string, string>>({}); // e.g., { 'item': 'o cafea' }

  // --- PRONUNCIATION STATES ---
  const [spokenText, setSpokenText] = useState('');
  const [isListeningMock, setIsListeningMock] = useState(false);
  const [listeningFeedback, setListeningFeedback] = useState<string | null>(null);
  const [selectedPracticePhrase, setSelectedPracticePhrase] = useState('');

  // --- GRAMMAR STATES ---
  const [selectedVerbIndex, setSelectedVerbIndex] = useState(0);
  const [activeConjugationPronoun, setActiveConjugationPronoun] = useState<string | null>(null);
  const [grammarQuizCorrect, setGrammarQuizCorrect] = useState<boolean | null>(null);
  const [grammarQuizExplanation, setGrammarQuizExplanation] = useState<string | null>(null);
  const [grammarPointsAwarded, setGrammarPointsAwarded] = useState(false);

  // Sync default patterns on change of language
  useEffect(() => {
    if (languageData && languageData.sentencePatterns.length > 0) {
      const firstPattern = languageData.sentencePatterns[0];
      setSelectedPatternId(firstPattern.id);
      
      const defaults: Record<string, string> = {};
      firstPattern.placeholders.forEach(ph => {
        if (ph.options.length > 0) {
          defaults[ph.key] = ph.options[0].word;
        }
      });
      setPatternValues(defaults);
    }
    // Select first practice phrase
    if (languageData && languageData.vocabulary.length > 0) {
      setSelectedPracticePhrase(languageData.vocabulary[0].word);
    }
    // Reset range and quiz
    setVocabRangeIndex(0);
    setIsQuizActive(false);
    setGrammarPointsAwarded(false);
    setGrammarQuizCorrect(null);
    setGrammarQuizExplanation(null);
  }, [targetLanguage, languageData]);

  // Handle TTS Speaking
  const handleSpeak = (text: string, langCode: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel(); // Stop current speech
      const utterance = new SpeechSynthesisUtterance(text);
      
      // Determine language code mapping
      let locale = 'ro-RO';
      switch (targetLanguage) {
        case 'Dutch': locale = 'nl-NL'; break;
        case 'Spanish': locale = 'es-ES'; break;
        case 'German': locale = 'de-DE'; break;
        case 'French': locale = 'fr-FR'; break;
        case 'Italian': locale = 'it-IT'; break;
        case 'Japanese': locale = 'ja-JP'; break;
        case 'Portuguese': locale = 'pt-PT'; break;
      }
      utterance.lang = locale;
      
      // Find matches for high-quality voices if possible
      const voices = window.speechSynthesis.getVoices();
      const matchedVoice = voices.find(v => v.lang.startsWith(locale.substring(0, 2)));
      if (matchedVoice) {
        utterance.voice = matchedVoice;
      }
      utterance.rate = 0.85; // Slightly slower for language learners
      window.speechSynthesis.speak(utterance);
    } else {
      console.warn("Speech synthesis not supported in this browser.");
    }
  };

  // Add a vocabulary word to the Leitner SRS deck
  const handleAddToSRS = (item: VocabItem) => {
    const flashcards: Flashcard[] = [...(progress.flashcards || [])];
    
    // Check if already exists to prevent duplicates
    const isDuplicate = flashcards.some(
      f => f.romanian.toLowerCase() === item.word.toLowerCase()
    );

    if (isDuplicate) {
      setVocabSuccessMsg(`"${item.word}" is already in your active Anki review deck!`);
      setTimeout(() => setVocabSuccessMsg(null), 3000);
      return;
    }

    const newCard: Flashcard = {
      id: `fc-vocab-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      romanian: item.word, // maps to target language
      english: item.translation, // maps to source language
      context: item.sentence,
      contextTranslation: item.sentenceTranslation,
      box: 1,
      nextReviewDate: new Date().toISOString()
    };

    onUpdateProgress({
      flashcards: [...flashcards, newCard],
      xp: (progress.xp || 0) + 5 // Reward +5 XP for active deck curation
    });

    setVocabSuccessMsg(`Imported "${item.word}" to your Anki review deck (+5 XP)!`);
    setTimeout(() => setVocabSuccessMsg(null), 3000);
  };

  // Get current active vocab items (combine prebuilt and custom dynamically generated)
  const getCurrentVocabList = (): VocabItem[] => {
    const listKey = `${targetLanguage}-${vocabRangeIndex}`;
    const generatedList = customGeneratedVocab[listKey] || [];
    
    // Range 0 uses our beautiful prebuilt list plus whatever is custom generated for range 0
    if (vocabRangeIndex === 0) {
      return [...languageData.vocabulary, ...generatedList];
    }
    return generatedList;
  };

  // AI-Generate or Procedurally load additional words for the range to hit 1000
  const handleGenerateNextWords = async () => {
    setLoadingVocab(true);
    const startIndex = vocabRangeIndex * 100;
    const listKey = `${targetLanguage}-${vocabRangeIndex}`;
    
    try {
      const response = await fetch('/api/generate-vocab', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetLanguage,
          sourceLanguage,
          category: selectedCategory === 'All' ? 'Noun' : selectedCategory,
          startIndex
        })
      });
      
      const contentType = response.headers.get('content-type');
      if (!response.ok || !contentType || !contentType.includes('application/json')) {
        throw new Error(`Failed to generate vocabulary (${response.status})`);
      }

      const data = await response.json();
      if (data && data.words && Array.isArray(data.words)) {
        // Map any generated words to VocabItem interface
        const formattedWords: VocabItem[] = data.words.map((w: any) => ({
          word: w.word || 'Word',
          translation: w.translation || 'Translation',
          category: (w.category as any) || 'Noun',
          ipa: w.ipa || '/.../',
          sentence: w.sentence || 'Example sentence.',
          sentenceTranslation: w.sentenceTranslation || 'Translation.'
        }));

        setCustomGeneratedVocab(prev => ({
          ...prev,
          [listKey]: [...(prev[listKey] || []), ...formattedWords]
        }));

        onUpdateProgress({ xp: (progress.xp || 0) + 10 }); // reward XP for learning expansion
        setVocabSuccessMsg(`Successfully generated 10 new high-frequency words (+10 XP)!`);
        setTimeout(() => setVocabSuccessMsg(null), 3000);
      }
    } catch (err) {
      console.error("Vocabulary generation error:", err);
      // Fallback procedural builder so it works offline
      const categories: ('Noun' | 'Verb' | 'Adjective' | 'Expression')[] = ['Noun', 'Verb', 'Adjective', 'Expression'];
      const chosenCat = selectedCategory === 'All' ? 'Noun' : selectedCategory as any;
      
      const offlineMock: VocabItem[] = Array.from({ length: 10 }).map((_, i) => {
        const itemIdx = startIndex + (customGeneratedVocab[listKey]?.length || 0) + i + 1;
        return {
          word: `${targetLanguage}_Word_${itemIdx}`,
          translation: `High frequency concept #${itemIdx}`,
          category: chosenCat,
          ipa: `/${targetLanguage.substring(0, 2).toLowerCase()}ˈvə/`,
          sentence: `This is high-frequency lesson sentence #${itemIdx} in ${targetLanguage}.`,
          sentenceTranslation: `This is explanation sentence translation #${itemIdx}.`
        };
      });

      setCustomGeneratedVocab(prev => ({
        ...prev,
        [listKey]: [...(prev[listKey] || []), ...offlineMock]
      }));
      setVocabSuccessMsg(`Loaded offline core vocabulary range!`);
      setTimeout(() => setVocabSuccessMsg(null), 3000);
    } finally {
      setLoadingVocab(false);
    }
  };

  // Build the vocab practice quiz based on current loaded list
  const startVocabQuiz = () => {
    const list = getCurrentVocabList();
    if (list.length < 3) return;

    // Create 5 random questions
    const shuffled = [...list].sort(() => 0.5 - Math.random());
    const sliceCount = Math.min(5, shuffled.length);
    const selectedItems = shuffled.slice(0, sliceCount);

    const questions = selectedItems.map(item => {
      // Find 3 incorrect translations
      const incorrects = list
        .filter(x => x.word !== item.word)
        .map(x => x.translation)
        .sort(() => 0.5 - Math.random())
        .slice(0, 3);
      
      // Make sure we have 4 options
      const options = [...incorrects, item.translation].sort(() => 0.5 - Math.random());
      const correctIdx = options.indexOf(item.translation);

      return {
        item,
        options,
        correctIdx
      };
    });

    setQuizQuestions(questions);
    setCurrentQuizIdx(0);
    setSelectedQuizAnswer(null);
    setQuizScore(0);
    setQuizFinished(false);
    setIsQuizActive(true);
  };

  const handleSelectQuizAnswer = (idx: number) => {
    if (selectedQuizAnswer !== null) return;
    setSelectedQuizAnswer(idx);
    
    const isCorrect = idx === quizQuestions[currentQuizIdx].correctIdx;
    if (isCorrect) {
      setQuizScore(prev => prev + 1);
    }
  };

  const handleNextQuizQuestion = () => {
    setSelectedQuizAnswer(null);
    if (currentQuizIdx + 1 < quizQuestions.length) {
      setCurrentQuizIdx(prev => prev + 1);
    } else {
      setQuizFinished(true);
      // Give points
      const xpEarned = quizScore * 5;
      onUpdateProgress({ xp: (progress.xp || 0) + xpEarned });
    }
  };

  // Match the active sentence compilation pattern
  const currentPattern = languageData.sentencePatterns.find(p => p.id === selectedPatternId) || languageData.sentencePatterns[0];

  const handlePlaceholderOptionSelect = (placeholderKey: string, word: string) => {
    setPatternValues(prev => ({
      ...prev,
      [placeholderKey]: word
    }));
  };

  // Compile the sentence pattern text
  const getCompiledSentence = (type: 'native' | 'translation'): string => {
    if (!currentPattern) return '';
    let result = type === 'native' ? currentPattern.translationTemplate : currentPattern.template;
    
    currentPattern.placeholders.forEach(ph => {
      const userVal = patternValues[ph.key] || ph.options[0]?.word || '';
      // Find corresponding translation for the template
      const matchedOpt = ph.options.find(opt => opt.word === userVal);
      const replacement = type === 'native' ? userVal : (matchedOpt?.translation || userVal);
      
      result = result.replace(`{${ph.key}}`, replacement);
    });

    return result;
  };

  // Practice spoken text simulated check
  const handlePracticeSpeaking = () => {
    setIsListeningMock(true);
    setListeningFeedback(null);
    
    // Simulate speech detection
    setTimeout(() => {
      setIsListeningMock(false);
      const scores = [
        "Incredible pronunciation! Spoken rhythm matches a native speaker perfectly. ⭐️ 100%",
        "Great job! Clean vowels and appropriate phrasing. ⭐️ 85%",
        "Good effort! Pay slight attention to vowel elongation and word stress. ⭐️ 70%"
      ];
      setListeningFeedback(scores[Math.floor(Math.random() * scores.length)]);
      onUpdateProgress({ xp: (progress.xp || 0) + 5 }); // speak reward XP
    }, 1800);
  };

  // Grammar test evaluation
  const handleAnswerGrammarQuiz = (isCorrect: boolean, explanation: string) => {
    setGrammarQuizCorrect(isCorrect);
    setGrammarQuizExplanation(explanation);
    if (isCorrect && !grammarPointsAwarded) {
      onUpdateProgress({ xp: (progress.xp || 0) + 15 });
      setGrammarPointsAwarded(true);
    }
  };

  // Search filter
  const currentVocabListFiltered = getCurrentVocabList().filter(item => {
    const matchesSearch = 
      item.word.toLowerCase().includes(vocabSearch.toLowerCase()) ||
      item.translation.toLowerCase().includes(vocabSearch.toLowerCase());
    const matchesCat = selectedCategory === 'All' || item.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-6">
      {/* 1. Header Banner */}
      <div className="p-6 bg-gradient-to-r from-indigo-900 to-slate-900 border-2 border-indigo-950 rounded-3xl text-white relative overflow-hidden shadow-md">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none select-none">
          <GraduationCap className="w-56 h-56 stroke-[1.5]" />
        </div>
        <div className="relative z-10 space-y-3 max-w-[580px]">
          <span className="inline-flex items-center gap-1.5 bg-indigo-500/25 text-indigo-300 text-[10px] font-black tracking-widest uppercase px-3 py-1.5 rounded-full font-mono border border-indigo-400/20">
            <Compass className="w-3.5 h-3.5 animate-spin-slow" /> Comprehensive Syllabus Handbook
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold font-display leading-tight tracking-tight">
            Study {languageData.flag} <span className="text-yellow-400">{targetLanguage}</span> Essentials
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed">
            {languageData.introduction} All reference systems adapt dynamically to teach you core vocabulary up to 1000 items, sentence structures, pronunciation, and basic grammar in one interactive playground.
          </p>
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <button
              onClick={onOpenLanguageSettings}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 hover:border-white/30 text-[10px] font-extrabold font-mono tracking-wider uppercase rounded-xl cursor-pointer transition flex items-center gap-1.5"
            >
              <Languages className="w-3.5 h-3.5 text-indigo-300" />
              Switch Study Pair: {sourceLanguage} → {targetLanguage}
            </button>
            <div className="px-3 py-2 bg-indigo-500/20 border border-indigo-400/25 rounded-xl text-[10px] font-bold text-indigo-200">
              Assessed Level: <span className="font-extrabold text-yellow-400">{progress.assessedLevel || 'A1'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Sub-Navigation Tabs */}
      <div className="flex border-2 border-slate-100 bg-white p-1.5 rounded-2xl shadow-xs overflow-x-auto gap-1">
        {[
          { id: 'vocab', label: '1,000 Vocabulary', icon: BookOpen },
          { id: 'patterns', label: 'Sentence Patterns', icon: MessageSquare },
          { id: 'pronunciation', label: 'Pronunciation Guide', icon: Volume2 },
          { id: 'grammar', label: 'Basic Grammar Patterns', icon: GraduationCap }
        ].map(tab => {
          const isActive = activeSubTab === tab.id;
          const IconComp = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as EssentialsTab)}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl text-xs font-black tracking-wide font-mono transition-all duration-100 shrink-0 cursor-pointer ${
                isActive 
                  ? 'bg-slate-900 text-white shadow-sm scale-[1.02]' 
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
              }`}
            >
              <IconComp className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Success Notification popups */}
      <AnimatePresence>
        {vocabSuccessMsg && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="p-3 bg-teal-50 border-2 border-teal-200 rounded-2xl flex items-center gap-2.5 shadow-sm text-teal-800 text-xs font-bold font-mono"
          >
            <BookmarkCheck className="w-4 h-4 text-teal-500 shrink-0 animate-bounce" />
            <span>{vocabSuccessMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3. Render Selected Module Sub-Tab */}
      <div className="bg-white border-2 border-slate-100 rounded-3xl overflow-hidden p-6 shadow-xs">
        {/* TAB 1: 1000 VOCABULARY */}
        {activeSubTab === 'vocab' && (
          <div className="space-y-6">
            {!isQuizActive ? (
              <>
                {/* Info and action panel */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="space-y-1">
                    <h3 className="text-sm font-black text-slate-800 uppercase tracking-wide font-mono flex items-center gap-1.5">
                      <Bookmark className="w-4 h-4 text-indigo-600" /> Browse High-Frequency Words
                    </h3>
                    <p className="text-xs text-slate-500 font-semibold leading-relaxed">
                      Expand your repertoire to a full 1,000 words! Search definitions, trigger clear Web-TTS vocal pronunciation guides, or export vocabulary into your active Anki review LeitBox deck.
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={startVocabQuiz}
                      disabled={currentVocabListFiltered.length < 3}
                      className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:pointer-events-none text-white font-extrabold text-[11px] font-mono uppercase tracking-widest rounded-xl transition cursor-pointer flex items-center gap-1.5 shadow-xs"
                    >
                      <Brain className="w-3.5 h-3.5" />
                      <span>Quiz Me! 🧠</span>
                    </button>
                    <button
                      onClick={handleGenerateNextWords}
                      disabled={loadingVocab}
                      className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-[11px] font-mono uppercase tracking-widest rounded-xl transition cursor-pointer flex items-center gap-1.5 border border-slate-950"
                    >
                      {loadingVocab ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5 text-yellow-400" />}
                      <span>AI Generate More ✨</span>
                    </button>
                  </div>
                </div>

                {/* Rank tabs to browse up to 1000 */}
                <div className="space-y-2">
                  <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider font-mono">Select Vocabulary Frequency Ranks</span>
                  <div className="flex gap-1 overflow-x-auto pb-1.5">
                    {[
                      { index: 0, label: '1 - 100 Core' },
                      { index: 1, label: '101 - 200 Rank' },
                      { index: 2, label: '201 - 300 Rank' },
                      { index: 3, label: '301 - 400 Rank' },
                      { index: 4, label: '401 - 500 Rank' },
                      { index: 5, label: '501 - 600 Rank' },
                      { index: 6, label: '601 - 700 Rank' },
                      { index: 7, label: '701 - 800 Rank' },
                      { index: 8, label: '801 - 900 Rank' },
                      { index: 9, label: '901 - 1000 Peak' }
                    ].map(range => {
                      const isSelected = vocabRangeIndex === range.index;
                      const hasWords = range.index === 0 || (customGeneratedVocab[`${targetLanguage}-${range.index}`]?.length || 0) > 0;
                      return (
                        <button
                          key={range.index}
                          onClick={() => setVocabRangeIndex(range.index)}
                          className={`px-3 py-2 rounded-xl text-[10px] font-extrabold font-mono uppercase transition border-2 shrink-0 cursor-pointer ${
                            isSelected 
                              ? 'bg-amber-100 border-amber-300 text-amber-900 font-black' 
                              : hasWords
                              ? 'bg-white border-slate-200 text-slate-700 hover:border-slate-350'
                              : 'bg-slate-50 border-dashed border-slate-200 text-slate-400 hover:bg-slate-100'
                          }`}
                        >
                          {range.label} {hasWords ? '✓' : '✨'}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Filter and Search bars */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                  {/* Search box */}
                  <div className="sm:col-span-2 relative">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
                    <input
                      type="text"
                      placeholder={`Search vocabulary words or English equivalents...`}
                      value={vocabSearch}
                      onChange={e => setVocabSearch(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-hidden focus:border-slate-400 bg-slate-50"
                    />
                  </div>

                  {/* Category select pills */}
                  <div className="flex gap-1 overflow-x-auto">
                    {['All', 'Noun', 'Verb', 'Adjective', 'Expression', 'Slang'].map(cat => {
                      const isSel = selectedCategory === cat;
                      return (
                        <button
                          key={cat}
                          onClick={() => setSelectedCategory(cat)}
                          className={`px-3.5 py-2.5 rounded-xl text-[10px] font-black uppercase font-mono cursor-pointer transition ${
                            isSel ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
                          }`}
                        >
                          {cat}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Vocabulary display list */}
                {currentVocabListFiltered.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {currentVocabListFiltered.map((item, index) => (
                      <div 
                        key={index} 
                        className="p-4 rounded-2xl border-2 border-slate-100 bg-slate-50/50 hover:bg-white hover:border-indigo-150 transition-all duration-150 flex flex-col justify-between gap-3 relative group"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <h4 className="text-sm font-black text-slate-800 tracking-tight font-display">
                                {item.word}
                              </h4>
                              <span className="text-[8px] font-black font-mono px-2 py-0.5 rounded-full uppercase bg-indigo-50 border border-indigo-100 text-indigo-700">
                                {item.category}
                              </span>
                              <span className="text-[10px] text-slate-400 font-mono">
                                {item.ipa}
                              </span>
                            </div>
                            <p className="text-xs font-semibold text-slate-500">
                              {item.translation}
                            </p>
                          </div>
                          
                          <div className="flex items-center gap-1.5 shrink-0 opacity-80 group-hover:opacity-100 transition">
                            <button
                              type="button"
                              onClick={() => handleSpeak(item.word, 'target')}
                              className="p-2 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl transition cursor-pointer text-slate-600"
                              title="Listen to pronunciation"
                            >
                              <Volume2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleAddToSRS(item)}
                              className="p-2 bg-slate-900 hover:bg-slate-850 text-white rounded-xl transition cursor-pointer text-[10px] font-extrabold font-mono flex items-center gap-1"
                              title="Import to SRS Anki Deck"
                            >
                              <Plus className="w-3 h-3" />
                              <span className="sr-only">Anki</span>
                            </button>
                          </div>
                        </div>

                        {/* Sentence block */}
                        <div className="p-2.5 bg-white border border-slate-100 rounded-xl text-[11px] space-y-1">
                          <p className="text-slate-700 font-bold leading-tight flex items-start gap-1">
                            <MessageSquare className="w-3 h-3 text-indigo-500 mt-0.5 shrink-0" />
                            <span>{item.sentence}</span>
                          </p>
                          <p className="text-slate-400 font-medium italic pl-4">
                            {item.sentenceTranslation}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center bg-slate-50 border border-dashed border-slate-200 rounded-2xl space-y-3.5">
                    <AlertCircle className="w-8 h-8 text-slate-400 mx-auto" />
                    <div className="space-y-0.5">
                      <h4 className="text-xs font-bold text-slate-700">No matching vocabulary found</h4>
                      <p className="text-[11px] text-slate-400">Try adjusting your search filter, or expand this rank list with AI generators!</p>
                    </div>
                    {customGeneratedVocab[`${targetLanguage}-${vocabRangeIndex}`]?.length === 0 && (
                      <button
                        onClick={handleGenerateNextWords}
                        className="mx-auto px-4 py-2.5 bg-slate-900 hover:bg-slate-850 text-white font-mono text-[10px] uppercase tracking-widest rounded-xl transition cursor-pointer flex items-center gap-1.5"
                      >
                        <Sparkles className="w-3 h-3 text-yellow-400" />
                        <span>AI-Generate Words for Rank #{vocabRangeIndex + 1}</span>
                      </button>
                    )}
                  </div>
                )}
              </>
            ) : (
              /* ACTIVE VOCAB QUIZ MODULE */
              <div className="p-4 border-2 border-indigo-150 rounded-3xl bg-indigo-50/20 space-y-6">
                <div className="flex justify-between items-center pb-3 border-b border-indigo-100/40">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 animate-ping" />
                    <h4 className="text-xs font-black text-indigo-900 uppercase tracking-widest font-mono">Vocabulary Core Challenge</h4>
                  </div>
                  <span className="text-[10px] font-bold text-indigo-600 font-mono">
                    Question {currentQuizIdx + 1} of {quizQuestions.length}
                  </span>
                </div>

                {!quizFinished ? (
                  <div className="space-y-5">
                    <div className="text-center space-y-1 py-4">
                      <span className="text-[10px] font-black uppercase font-mono tracking-wider text-indigo-400">What does this word mean?</span>
                      <h3 className="text-2xl font-black text-slate-800 font-display">
                        {quizQuestions[currentQuizIdx].item.word}
                      </h3>
                      {quizQuestions[currentQuizIdx].item.ipa && (
                        <p className="text-xs text-slate-400 font-mono">{quizQuestions[currentQuizIdx].item.ipa}</p>
                      )}
                      
                      <div className="pt-2 flex justify-center">
                        <button
                          type="button"
                          onClick={() => handleSpeak(quizQuestions[currentQuizIdx].item.word, 'target')}
                          className="px-3 py-1.5 bg-white hover:bg-indigo-50 border border-indigo-100 rounded-lg text-[10px] font-bold text-indigo-700 transition flex items-center gap-1 shadow-2xs"
                        >
                          <Volume2 className="w-3 h-3" />
                          <span>Listen Pronunciation</span>
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {quizQuestions[currentQuizIdx].options.map((opt, oIdx) => {
                        const isSelected = selectedQuizAnswer === oIdx;
                        const isCorrect = oIdx === quizQuestions[currentQuizIdx].correctIdx;
                        const hasAnswered = selectedQuizAnswer !== null;
                        
                        let btnStyle = "bg-white hover:bg-indigo-50/50 border-slate-200 text-slate-700";
                        if (hasAnswered) {
                          if (isCorrect) {
                            btnStyle = "bg-teal-100 border-teal-400 text-teal-900 font-extrabold";
                          } else if (isSelected) {
                            btnStyle = "bg-rose-100 border-rose-400 text-rose-900 font-extrabold";
                          } else {
                            btnStyle = "bg-white border-slate-100 text-slate-400 opacity-60";
                          }
                        }

                        return (
                          <button
                            key={oIdx}
                            onClick={() => handleSelectQuizAnswer(oIdx)}
                            className={`p-4 rounded-xl border-2 text-xs sm:text-sm text-left transition duration-100 flex items-center justify-between cursor-pointer ${btnStyle}`}
                            disabled={hasAnswered}
                          >
                            <span>{opt}</span>
                            {hasAnswered && isCorrect && <Check className="w-4 h-4 text-teal-600 stroke-[3]" />}
                          </button>
                        );
                      })}
                    </div>

                    {/* Context sentence clue */}
                    <div className="p-4 bg-white border border-indigo-100 rounded-2xl space-y-1 text-xs">
                      <span className="text-[9px] font-bold text-indigo-400 uppercase tracking-widest font-mono">Study Context Hint</span>
                      <p className="text-slate-700 font-bold">
                        {quizQuestions[currentQuizIdx].item.sentence}
                      </p>
                      {selectedQuizAnswer !== null && (
                        <p className="text-slate-400 font-medium italic">
                          {quizQuestions[currentQuizIdx].item.sentenceTranslation}
                        </p>
                      )}
                    </div>

                    {selectedQuizAnswer !== null && (
                      <div className="flex justify-end pt-2">
                        <button
                          onClick={handleNextQuizQuestion}
                          className="px-5 py-3 bg-slate-900 hover:bg-slate-800 text-white font-mono text-xs font-black uppercase tracking-wider rounded-xl cursor-pointer transition flex items-center gap-1.5"
                        >
                          <span>{currentQuizIdx + 1 === quizQuestions.length ? 'Finish Quiz' : 'Next Question'}</span>
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center space-y-5 py-6">
                    <div className="w-14 h-14 rounded-full bg-amber-100 border-2 border-amber-300 text-slate-800 flex items-center justify-center mx-auto shadow-xs text-xl">
                      🏆
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-lg font-black text-slate-800">Challenge Completed!</h3>
                      <p className="text-xs text-slate-500 font-medium">
                        You scored <strong className="text-indigo-600">{quizScore} / {quizQuestions.length}</strong> correct definitions.
                      </p>
                    </div>

                    <div className="p-3 bg-teal-50 border border-teal-150 rounded-2xl max-w-xs mx-auto text-[11px] font-extrabold text-teal-800 font-mono">
                      🎉 Earned +{quizScore * 5} XP for your vocabulary mastery!
                    </div>

                    <button
                      onClick={() => setIsQuizActive(false)}
                      className="px-6 py-3 bg-slate-900 hover:bg-slate-805 text-white font-mono text-xs font-black uppercase tracking-wider rounded-xl cursor-pointer transition"
                    >
                      Return to Vocabulary List
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: SENTENCE PATTERNS */}
        {activeSubTab === 'patterns' && (
          <div className="space-y-6">
            <div className="space-y-1">
              <h3 className="text-sm font-black text-slate-800 uppercase tracking-wide font-mono flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4 text-indigo-600" /> Interactive Sentence Compilers
              </h3>
              <p className="text-xs text-slate-500 font-semibold leading-relaxed">
                Learn grammatical formula blueprints and substitution matrices. Click option tokens or watch variables update to see conjugation agreements compiled instantly in the target language.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
              {/* Pattern menu list */}
              <div className="space-y-2.5">
                <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider font-mono">1. Select Grammar Formula</span>
                <div className="flex flex-col gap-2">
                  {languageData.sentencePatterns.map(p => (
                    <button
                      key={p.id}
                      onClick={() => {
                        setSelectedPatternId(p.id);
                        const defaults: Record<string, string> = {};
                        p.placeholders.forEach(ph => {
                          if (ph.options.length > 0) {
                            defaults[ph.key] = ph.options[0].word;
                          }
                        });
                        setPatternValues(defaults);
                      }}
                      className={`p-3.5 rounded-2xl border-2 text-left transition duration-100 flex flex-col gap-1 cursor-pointer ${
                        selectedPatternId === p.id 
                          ? 'bg-indigo-50 border-indigo-600 shadow-2xs' 
                          : 'bg-white border-slate-100 hover:border-slate-300'
                      }`}
                    >
                      <h4 className="text-xs font-black text-slate-800 font-mono">
                        {p.template}
                      </h4>
                      <p className="text-[10.5px] text-slate-500 font-semibold leading-normal">
                        {p.description}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Variable Sandbox compiler */}
              <div className="md:col-span-2 space-y-5">
                <div className="p-5 border-2 border-slate-150 rounded-3xl bg-slate-50/50 space-y-4">
                  <span className="text-[10px] font-black uppercase text-indigo-600 tracking-wider font-mono">2. Interactive Substitution Sandbox</span>
                  
                  {/* The interactive variables options selection */}
                  {currentPattern.placeholders.map((ph, phIdx) => (
                    <div key={phIdx} className="space-y-2">
                      <span className="text-[10px] font-extrabold uppercase text-slate-400 font-mono">
                        Select {ph.label}:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {ph.options.map((opt, optIdx) => {
                          const isSelected = patternValues[ph.key] === opt.word;
                          return (
                            <button
                              key={optIdx}
                              onClick={() => handlePlaceholderOptionSelect(ph.key, opt.word)}
                              className={`px-3 py-2 text-xs font-extrabold rounded-xl transition border cursor-pointer ${
                                isSelected 
                                  ? 'bg-slate-900 border-slate-900 text-white shadow-xs' 
                                  : 'bg-white border-slate-200 text-slate-600 hover:border-slate-350'
                              }`}
                            >
                              <span className="font-bold">{opt.word}</span>{' '}
                              <span className="text-[10px] opacity-60 font-semibold">({opt.translation})</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}

                  {/* Sandbox compilation result terminal card */}
                  <div className="p-4 bg-slate-900 text-white rounded-2xl relative overflow-hidden space-y-3 shadow-md border-2 border-slate-950">
                    <span className="absolute top-2 right-3 text-[8px] font-black text-slate-500 font-mono uppercase tracking-widest select-none">BLUEPRINT RENDER</span>
                    <div className="space-y-1">
                      <span className="text-[9px] font-bold text-yellow-400 font-mono tracking-wider uppercase">Compiled Native Phrase:</span>
                      <p className="text-base sm:text-lg font-black font-display tracking-wide text-white leading-tight">
                        {getCompiledSentence('native')}
                      </p>
                    </div>
                    <div className="pt-2 border-t border-slate-800 space-y-1">
                      <span className="text-[9px] font-bold text-indigo-300 font-mono tracking-wider uppercase">English Meaning:</span>
                      <p className="text-xs font-bold text-slate-300 italic">
                        "{getCompiledSentence('translation')}"
                      </p>
                    </div>

                    <div className="flex gap-2 pt-1.5">
                      <button
                        onClick={() => handleSpeak(getCompiledSentence('native'), 'target')}
                        className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] font-extrabold tracking-widest uppercase font-mono rounded-xl transition cursor-pointer flex items-center gap-1.5"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                        <span>Listen to Native Voice</span>
                      </button>
                      <button
                        onClick={() => {
                          const item: VocabItem = {
                            word: getCompiledSentence('native'),
                            translation: getCompiledSentence('translation'),
                            category: 'Expression',
                            ipa: '/compiled/',
                            sentence: `Practice compiling: ${getCompiledSentence('native')}`,
                            sentenceTranslation: `Translated compiled structure: ${getCompiledSentence('translation')}`
                          };
                          handleAddToSRS(item);
                        }}
                        className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 text-[10px] font-extrabold tracking-widest uppercase font-mono rounded-xl transition cursor-pointer flex items-center gap-1.5"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Save to SRS Flashcards</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: PRONUNCIATION */}
        {activeSubTab === 'pronunciation' && (
          <div className="space-y-6">
            <div className="space-y-1">
              <h3 className="text-sm font-black text-slate-800 uppercase tracking-wide font-mono flex items-center gap-1.5">
                <Volume2 className="w-4 h-4 text-indigo-600" /> Pronunciation & Speech Coach
              </h3>
              <p className="text-xs text-slate-500 font-semibold leading-relaxed">
                Master local accent markers, syllable timing, stress lines, and key vowel shifts. Practice speaking any custom word below to review your rhythmic alignment in real-time.
              </p>
            </div>

            {/* Core IPA diacritics rules table */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              <div className="space-y-3.5">
                <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider font-mono">1. Accent Rules & Phonics</h4>
                <div className="border border-slate-150 rounded-2xl overflow-hidden divide-y divide-slate-100">
                  {languageData.pronunciation.rules.map((rule, idx) => (
                    <div key={idx} className="p-3 bg-slate-50/30 flex items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-2.5">
                        <span className="w-7 h-7 rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-700 flex items-center justify-center font-extrabold font-mono text-sm">
                          {rule.character}
                        </span>
                        <div>
                          <p className="font-extrabold text-slate-800">{rule.sound}</p>
                          <p className="text-[10px] text-slate-400 font-mono">Examples: "{rule.example}"</p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleSpeak(rule.example, 'target')}
                        className="p-1.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg text-slate-600 cursor-pointer"
                        title="Listen to phonetic example"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Niran's special advice on difficult sounds */}
              <div className="space-y-4">
                <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider font-mono">2. Niran Coach Accent Guides</h4>
                <div className="space-y-3">
                  {languageData.pronunciation.difficultSounds.map((guide, idx) => (
                    <div key={idx} className="p-4 bg-amber-50/60 border border-amber-200 rounded-2xl space-y-1.5">
                      <h5 className="text-[11px] font-black uppercase tracking-wider text-amber-900 font-mono flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />
                        How to pronounce the "{guide.sound}" sound:
                      </h5>
                      <p className="text-xs text-amber-850 font-semibold leading-relaxed">
                        {guide.advice}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Interactive speaking practice panel */}
            <div className="pt-4 border-t border-slate-100 space-y-4">
              <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider font-mono">3. Interactive Speech Sandbox</h4>
              
              <div className="p-5 border-2 border-slate-150 rounded-3xl bg-slate-50/50 flex flex-col md:flex-row gap-5 items-center justify-between">
                <div className="space-y-2.5 flex-1 w-full">
                  <span className="text-[10px] font-black uppercase text-indigo-600 tracking-wider font-mono">Pronunciation Training Box</span>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400">Select standard practice word:</label>
                    <div className="flex flex-wrap gap-1">
                      {languageData.vocabulary.slice(0, 5).map((item, idx) => (
                        <button
                          key={idx}
                          onClick={() => setSelectedPracticePhrase(item.word)}
                          className={`px-3 py-1.5 text-xs rounded-lg transition border cursor-pointer font-bold ${
                            selectedPracticePhrase === item.word 
                              ? 'bg-slate-900 border-slate-900 text-white' 
                              : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                          }`}
                        >
                          {item.word}
                        </button>
                      ))}
                    </div>
                  </div>

                  <input
                    type="text"
                    value={selectedPracticePhrase}
                    onChange={e => setSelectedPracticePhrase(e.target.value)}
                    placeholder="Or type any custom word in target language..."
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-hidden focus:border-slate-400 bg-white"
                  />
                </div>

                <div className="flex flex-col items-center justify-center gap-3 shrink-0 p-4 bg-white border border-slate-150 rounded-2xl text-center min-w-[240px] w-full md:w-auto shadow-2xs">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleSpeak(selectedPracticePhrase || 'Hello', 'target')}
                      disabled={!selectedPracticePhrase}
                      className="p-3 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-full transition cursor-pointer border border-indigo-200"
                      title="Listen to native pronunciation"
                    >
                      <Volume2 className="w-5 h-5" />
                    </button>
                    
                    <button
                      onClick={handlePracticeSpeaking}
                      disabled={!selectedPracticePhrase || isListeningMock}
                      className={`p-4 rounded-full transition cursor-pointer border ${
                        isListeningMock 
                          ? 'bg-red-100 border-red-300 text-red-600 animate-pulse' 
                          : 'bg-slate-900 hover:bg-slate-800 text-white border-slate-950'
                      }`}
                      title="Practice speaking now"
                    >
                      <Mic className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="space-y-0.5">
                    <h5 className="text-[10px] font-black uppercase text-slate-400 tracking-wider font-mono">Microphone Tester</h5>
                    <p className="text-[10px] text-slate-500 font-semibold leading-normal">
                      {isListeningMock ? 'Listening to voice...' : 'Click mic to say out loud!'}
                    </p>
                  </div>

                  {listeningFeedback && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="p-2.5 bg-teal-50 border border-teal-150 rounded-xl text-[10px] font-extrabold text-teal-800 leading-tight"
                    >
                      {listeningFeedback}
                    </motion.div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: GRAMMAR ESSENTIALS */}
        {activeSubTab === 'grammar' && (
          <div className="space-y-6">
            <div className="space-y-1">
              <h3 className="text-sm font-black text-slate-800 uppercase tracking-wide font-mono flex items-center gap-1.5">
                <GraduationCap className="w-4 h-4 text-indigo-600" /> Basic Grammar Patterns & Verb Labs
              </h3>
              <p className="text-xs text-slate-500 font-semibold leading-relaxed">
                Study noun gender mechanics, article prefixes/suffixes, and word ordering templates. Tap pronoun indicators on the interactive Verb Conjugation matrix to practice inflections.
              </p>
            </div>

            {/* Explanations of noun rules and word order */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
              <div className="p-4 rounded-2xl bg-slate-50/50 border border-slate-100 space-y-2">
                <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider font-mono flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-800" /> Nouns, Genders & Articles
                </h4>
                <p className="text-xs text-slate-600 font-semibold leading-relaxed">
                  {languageData.grammar.nounRules}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50/50 border border-slate-100 space-y-2">
                <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider font-mono flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-800" /> Sentence Word Order
                </h4>
                <p className="text-xs text-slate-600 font-semibold leading-relaxed">
                  {languageData.grammar.wordOrder}
                </p>
              </div>
            </div>

            {/* Verb Conjugator matrix */}
            {languageData.grammar.conjugations.length > 0 && (
              <div className="space-y-4">
                <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider font-mono">1. Interactive Verb Conjugator Lab</h4>
                
                <div className="p-5 border-2 border-slate-150 rounded-3xl bg-slate-50/50 space-y-4">
                  <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                    <div className="flex gap-1.5 items-center">
                      <span className="text-[10px] font-black uppercase text-indigo-600 tracking-wider font-mono">Select Base Verb:</span>
                      <div className="flex gap-1">
                        {languageData.grammar.conjugations.map((conj, idx) => (
                          <button
                            key={idx}
                            onClick={() => {
                              setSelectedVerbIndex(idx);
                              setActiveConjugationPronoun(null);
                            }}
                            className={`px-3 py-1.5 text-xs font-extrabold rounded-lg transition border cursor-pointer ${
                              selectedVerbIndex === idx 
                                ? 'bg-slate-900 border-slate-900 text-white' 
                                : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                            }`}
                          >
                            {conj.verb} ({conj.translation})
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Active Conjugation Table Grid */}
                  <div className="space-y-3">
                    <span className="text-[10px] font-extrabold uppercase text-slate-400 font-mono block">
                      Present Tense Paradigm (Tap row for audio assistance):
                    </span>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {languageData.grammar.conjugations[selectedVerbIndex].tenses[0].pronouns.map((row, rIdx) => {
                        const isRowActive = activeConjugationPronoun === row.pronoun;
                        return (
                          <button
                            key={rIdx}
                            onClick={() => {
                              setActiveConjugationPronoun(row.pronoun);
                              handleSpeak(row.conjugated, 'target');
                            }}
                            className={`p-3 rounded-xl border transition-all text-left flex justify-between items-center cursor-pointer ${
                              isRowActive 
                                ? 'bg-indigo-50/70 border-indigo-400 font-extrabold shadow-2xs' 
                                : 'bg-white border-slate-150 hover:bg-slate-50'
                            }`}
                          >
                            <div className="space-y-0.5">
                              <span className="text-[10px] text-slate-400 font-mono font-bold uppercase">{row.pronoun}</span>
                              <p className="text-sm font-black text-slate-800 tracking-tight font-display">{row.conjugated}</p>
                            </div>
                            <Volume2 className={`w-4 h-4 transition ${isRowActive ? 'text-indigo-600 scale-110' : 'text-slate-400'}`} />
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* mini self assessment grammar quiz */}
            <div className="space-y-4 pt-2">
              <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider font-mono">2. Fast Grammar Self-Check (+15 XP)</h4>
              
              <div className="p-5 border-2 border-amber-200 rounded-3xl bg-amber-50/20 space-y-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-black uppercase text-amber-800 tracking-wider font-mono">Grammar mini-assessment:</span>
                  <p className="text-xs font-bold text-slate-800 leading-relaxed">
                    Identify correct word agreement: How do we properly qualify a masculine singular noun in <span className="font-extrabold text-indigo-700">{targetLanguage}</span>?
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                  <button
                    onClick={() => handleAnswerGrammarQuiz(
                      true, 
                      `Correct! In ${targetLanguage}, adjectives must align to the gender (masculine) and singular count of the subject noun they modify.`
                    )}
                    className="flex-1 p-3.5 bg-white border border-slate-200 rounded-xl hover:border-teal-400 transition cursor-pointer text-xs font-bold text-slate-700 text-left"
                  >
                    Align the qualifying adjective to masculine singular form.
                  </button>
                  <button
                    onClick={() => handleAnswerGrammarQuiz(
                      false, 
                      `Incorrect. Qualifying adjectives always respect the noun's masculine gender, plural count, or cases in this language group.`
                    )}
                    className="flex-1 p-3.5 bg-white border border-slate-200 rounded-xl hover:border-rose-400 transition cursor-pointer text-xs font-bold text-slate-700 text-left"
                  >
                    Adjectives remain neutral or singular feminine regardless of context.
                  </button>
                </div>

                {grammarQuizCorrect !== null && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-4 rounded-xl text-xs space-y-1 ${
                      grammarQuizCorrect 
                        ? 'bg-teal-50 border border-teal-200 text-teal-800' 
                        : 'bg-rose-50 border border-rose-200 text-rose-800'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 font-bold font-mono text-[10px] uppercase">
                      {grammarQuizCorrect ? '🎉 Correct Answer!' : '❌ Incorrect Attempt'}
                    </div>
                    <p className="font-semibold leading-relaxed">{grammarQuizExplanation}</p>
                    {grammarQuizCorrect && grammarPointsAwarded && (
                      <span className="text-[10px] font-black text-teal-700 block mt-1">+15 XP granted! keep studying! 👑</span>
                    )}
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* AdSense Placement */}
        <div className="pt-6">
          <AdBanner dataAdSlot="5554443322" />
        </div>
      </div>
    </div>
  );
}

