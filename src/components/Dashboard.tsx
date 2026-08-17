import React from 'react';
import { motion } from 'motion/react';
import { 
  Flame, 
  Sparkles,
  Layers,
  ChevronRight,
  Target,
  Trophy,
  Volume2,
  ArrowRight,
  BookOpen,
  GraduationCap,
  Play,
  RotateCcw,
  CheckCircle,
  Zap,
  TrendingUp
} from 'lucide-react';
import { UserProgress } from '../types';
import { SCENARIOS } from '../data/topics';
import NiranCoach from './NiranCoach';
import { getLanguageFlag } from './Library';
import AdBanner from './AdBanner';
import { t } from '../lib/i18n';

export function getLanguageColors(lang?: string): string[] {
  return ["#0EA5E9", "#14B8A6", "#10B981"];
}

export function getLocaleForLanguage(lang?: string): string {
  if (!lang) return 'ro-RO';
  const l = lang.toLowerCase();
  if (l.includes('romanian')) return 'ro-RO';
  if (l.includes('english')) return 'en-US';
  if (l.includes('dutch') || l.includes('nederlands')) return 'nl-NL';
  if (l.includes('spanish') || l.includes('español')) return 'es-ES';
  if (l.includes('german') || l.includes('deutsch')) return 'de-DE';
  if (l.includes('french') || l.includes('français')) return 'fr-FR';
  if (l.includes('italian') || l.includes('italiano')) return 'it-IT';
  if (l.includes('japanese') || l.includes('日本語')) return 'ja-JP';
  if (l.includes('portuguese') || l.includes('português')) return 'pt-PT';
  return 'en-US';
}

export function getGreetingByLanguage(lang?: string): string {
  if (!lang) return "Salut, Prietene! 👋";
  const l = lang.toLowerCase();
  if (l.includes('romanian')) return "Salut, Prietene! 👋";
  if (l.includes('dutch') || l.includes('nederlands')) return "Hallo, Vriend! 👋";
  if (l.includes('spanish') || l.includes('español')) return "¡Hola, Amigo! 👋";
  if (l.includes('german') || l.includes('deutsch')) return "Hallo, Freund! 👋";
  if (l.includes('french') || l.includes('français')) return "Salut, Mon Ami! 👋";
  if (l.includes('italian') || l.includes('italiano')) return "Ciao, Amico! 👋";
  if (l.includes('japanese') || l.includes('日本語')) return "こんにちは、友よ！ 👋";
  if (l.includes('portuguese') || l.includes('português')) return "Olá, Amigo! 👋";
  return "Hello, Friend! 👋";
}

export function getFoodItemByLanguage(lang?: string): string {
  if (!lang) return "Ordering Traditional Sarmale";
  const l = lang.toLowerCase();
  if (l.includes('romanian')) return "Ordering Traditional Sarmale";
  if (l.includes('dutch') || l.includes('nederlands')) return "Ordering Delicious Stroopwafels";
  if (l.includes('spanish') || l.includes('español')) return "Ordering Traditional Tapas";
  if (l.includes('german') || l.includes('deutsch')) return "Ordering Delicious Brezeln";
  if (l.includes('french') || l.includes('français')) return "Ordering Delicious Macarons";
  if (l.includes('italian') || l.includes('italiano')) return "Ordering Traditional Pasta Carbonara";
  if (l.includes('japanese') || l.includes('日本語')) return "Ordering Authentic Sushi Match";
  if (l.includes('portuguese') || l.includes('português')) return "Ordering Sweet Pastéis de Nata";
  return "Exploring Conversational Dialogues";
}

export function getLeagueTitle(lang?: string): string {
  if (!lang) return "LIGA DE SAFIR";
  const l = lang.toLowerCase();
  if (l.includes('romanian')) return "LIGA DE SAFIR";
  if (l.includes('dutch') || l.includes('nederlands')) return "SAFIEREN LIGA";
  if (l.includes('spanish') || l.includes('español')) return "LIGA DE ZAFIRO";
  if (l.includes('german') || l.includes('deutsch')) return "SAPHIR LIGA";
  if (l.includes('french') || l.includes('français')) return "LIGUE DE SAPHIR";
  if (l.includes('italian') || l.includes('italiano')) return "LEGA DI ZAFFIRO";
  if (l.includes('japanese') || l.includes('日本語')) return "サファイア・リーグ";
  if (l.includes('portuguese') || l.includes('português')) return "LIGA DE SAFIRA";
  return "SAPPHIRE LEAGUE";
}

export function getWordOfTheDay(lang?: string) {
  if (!lang) {
    return {
      word: "Dor",
      english: "Longing / Nostalgia / Yearning",
      pronunciation: "dohr",
      sentence: "Mi-e dor de tine și de sarmalele calde ale bunicii.",
      translation: "I miss you and grandma's warm cabbage rolls."
    };
  }
  const l = lang.toLowerCase();
  if (l.includes('romanian')) {
    return {
      word: "Dor",
      english: "Longing / Nostalgia / Yearning",
      pronunciation: "dohr",
      sentence: "Mi-e dor de tine și de sarmalele calde ale bunicii.",
      translation: "I miss you and grandma's warm cabbage rolls."
    };
  }
  if (l.includes('dutch') || l.includes('nederlands')) {
    return {
      word: "Gezellig",
      english: "Cozy / Friendly / Warm atmosphere",
      pronunciation: "he-zel-lik",
      sentence: "Het is heel gezellig aan de eettafel.",
      translation: "It is very cozy at the dinner table."
    };
  }
  if (l.includes('spanish') || l.includes('español')) {
    return {
      word: "Sobremesa",
      english: "After-lunch/dinner table talk",
      pronunciation: "so-bre-me-sa",
      sentence: "Nos quedamos en la sobremesa durante dos horas.",
      translation: "We stayed talking at the table for two hours."
    };
  }
  if (l.includes('german') || l.includes('deutsch')) {
    return {
      word: "Gemütlichkeit",
      english: "Cozy friendliness / Warm comfort",
      pronunciation: "guh-meet-lik-kite",
      sentence: "Die Hütte im Wald strahlt viel Gemütlichkeit aus.",
      translation: "The cabin in the forest radiates a lot of warmth and coziness."
    };
  }
  if (l.includes('french') || l.includes('français')) {
    return {
      word: "Flâner",
      english: "To stroll leisurely without objective",
      pronunciation: "flah-ney",
      sentence: "J'aime flâner le long de la Seine à Paris.",
      translation: "I love to wander along the Seine in Paris."
    };
  }
  if (l.includes('italian') || l.includes('italiano')) {
    return {
      word: "Allora",
      english: "So / Well / Then",
      pronunciation: "al-lo-ra",
      sentence: "Allora, andiamo al ristorante stasera?",
      translation: "So, are we going to the restaurant tonight?"
    };
  }
  if (l.includes('japanese') || l.includes('日本語')) {
    return {
      word: "木漏れ日 (Komorebi)",
      english: "Sunlight filtering through the trees",
      pronunciation: "ko-mo-re-bi",
      sentence: "森の中を歩くと、美しい木漏れ日が見えます。",
      translation: "Walking in the forest, you see beautiful filtered sunlight."
    };
  }
  if (l.includes('portuguese') || l.includes('português')) {
    return {
      word: "Saudade",
      english: "Nostalgic longing / Bitter-sweet yearning",
      pronunciation: "saw-dah-deh",
      sentence: "Sinto muita saudade do meu querido país.",
      translation: "Sinto saudades do meu querido país."
    };
  }
  return {
    word: "Amity",
    english: "Friendly relationship",
    pronunciation: "a-mi-tee",
    sentence: "They established a bond of amity and common goals.",
    translation: "Făuriră o legătură de prietenie și scopuri comune."
  };
}

export function getCompetitors(lang?: string) {
  return [
    { name: "Andrei Popescu 🇦🇹", xp: 1250, avatar: "🦁", isUser: false, description: "Obsidian League" },
    { name: "Elena Vasilescu 🇷🇴", xp: 920, avatar: "🦄", isUser: false, description: "Sapphire League" },
    { name: "Stefan Jones 🇬🇧", xp: 580, avatar: "🐼", isUser: false, description: "Sapphire League" },
    { name: "Mirela Sandu 🇷🇴", xp: 240, avatar: "🦊", isUser: false, description: "Gold League" },
  ];
}

interface DashboardProps {
  progress: UserProgress;
  authUser: any;
  onNavigate: (tab: string) => void;
  onSelectScenario: (id: string) => void;
  onOpenGoalModal: () => void;
}

export default function Dashboard({ progress, authUser, onNavigate, onSelectScenario, onOpenGoalModal }: DashboardProps) {
  const targetLng = progress.targetLanguage || "Romanian";
  const sourceLng = progress.sourceLanguage || "English";

  const totalScenarios = SCENARIOS.length || 100;
  const completedCount = progress.completedScenarios.length;
  const completedPercent = Math.min(100, Math.round((completedCount / totalScenarios) * 100));
  const wordsLearned = progress.flashcards.length;

  // Next recommended scenario
  const nextRecommendedScenario = React.useMemo(() => {
    return SCENARIOS.find((sc) => !progress.completedScenarios.includes(sc.id)) || SCENARIOS[0];
  }, [progress.completedScenarios]);

  // Word of the day
  const wordOfProps = getWordOfTheDay(targetLng);

  // Daily XP progress percent
  const dailyXpPercent = Math.min(100, Math.round((progress.dailyXpGained / progress.dailyGoalXp) * 100));

  // Audio Speech synthesis for Word of the Day
  const handleSpeakWord = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(wordOfProps.word);
      utterance.lang = getLocaleForLanguage(targetLng);
      utterance.rate = 0.85;
      window.speechSynthesis.speak(utterance);
    }
  };

  // Niran Coach message
  const getCoachMessage = () => {
    if (progress.streak >= 5) {
      return { 
        mood: 'excited' as const, 
        en: `Awesome! You have an active ${progress.streak}-day streak! Keep learning ${targetLng} every day.`, 
        ro: `Senzațional! Un streak de ${progress.streak} zile este de elită! Continuă pe acest drum.` 
      };
    }
    if (progress.dailyXpGained >= progress.dailyGoalXp) {
      return { 
        mood: 'celebrate' as const, 
        en: "Great job! Your daily learning goal is achieved. Review flashcards or try another dialogue!", 
        ro: "Super! Obiectivul zilnic a fost atins. Ești fantastic!" 
      };
    }
    return { 
      mood: 'encouraging' as const, 
      en: `Welcome! Complete a quick 5-minute ${targetLng} dialogue today to keep your streak alive!`, 
      ro: `Salut! Hai să facem o scurtă lecție de română astăzi pentru a-ți păstra streak-ul.` 
    };
  };

  const coachTip = getCoachMessage();

  return (
    <motion.div 
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="space-y-6 max-w-4xl mx-auto pb-12 font-sans select-none"
    >
      {/* 1. TOP HEADER & QUICK STATS BAR */}
      <div className="bg-white rounded-3xl p-5 md:p-6 border border-slate-200/90 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* User Info */}
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-sky-500 to-teal-400 p-[2px] shrink-0 shadow-sm">
            <div className="w-full h-full rounded-[14px] bg-white flex items-center justify-center text-xl overflow-hidden">
              {authUser?.photoURL ? (
                <img src={authUser.photoURL} referrerPolicy="no-referrer" alt="Avatar" className="w-full h-full object-cover" />
              ) : "🐻"}
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-extrabold text-slate-800 tracking-tight leading-tight font-display">
                {getGreetingByLanguage(targetLng).split(' ')[0]}, {authUser?.displayName || authUser?.email?.split('@')[0] || "Learner"}!
              </h2>
            </div>
            <p className="text-xs font-semibold text-slate-400 flex items-center gap-1.5 mt-0.5">
              <span>Studying</span>
              <span className="inline-flex items-center gap-1 font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md text-[11px]">
                {getLanguageFlag(targetLng)} {targetLng}
              </span>
            </p>
          </div>
        </div>

        {/* Quick Stats Pills */}
        <div className="flex items-center justify-between sm:justify-end gap-2 bg-slate-50 p-2 sm:p-1.5 rounded-2xl border border-slate-100 sm:border-none">
          {/* Streak Stat */}
          <div className="flex items-center gap-1.5 bg-white border border-slate-200/90 px-3 py-1.5 rounded-xl shadow-2xs">
            <Flame className="w-4 h-4 fill-orange-500 text-orange-500" />
            <span className="text-xs font-black text-slate-800 font-mono">{progress.streak}</span>
            <span className="text-[10px] text-slate-400 font-bold uppercase font-mono">Days</span>
          </div>

          {/* XP Stat */}
          <div className="flex items-center gap-1.5 bg-white border border-slate-200/90 px-3 py-1.5 rounded-xl shadow-2xs">
            <Zap className="w-4 h-4 text-sky-500 fill-sky-500" />
            <span className="text-xs font-black text-slate-800 font-mono">{progress.xp}</span>
            <span className="text-[10px] text-slate-400 font-bold uppercase font-mono">XP</span>
          </div>

          {/* Daily Goal Quick Action */}
          <button 
            onClick={onOpenGoalModal}
            className="flex items-center gap-1.5 bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200/80 px-3 py-1.5 rounded-xl transition cursor-pointer"
            title="Adjust Daily Goal"
          >
            <Target className="w-4 h-4 text-sky-600" />
            <span className="text-xs font-black font-mono">{dailyXpPercent}%</span>
          </button>
        </div>
      </div>

      {/* 2. MAIN HERO ACTION CARD: CONTINUE NEXT LESSON */}
      <motion.div 
        whileHover={{ y: -2 }}
        transition={{ duration: 0.2 }}
        className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-sky-950 text-white rounded-3xl p-6 md:p-8 border-b-6 border-slate-950 shadow-md overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-48 h-48 bg-teal-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-xl">
            <div className="flex items-center gap-2">
              <span className="bg-sky-500/20 text-sky-300 border border-sky-400/30 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest font-mono flex items-center gap-1">
                <Play className="w-3 h-3 fill-sky-300" /> {t('next_up', sourceLng)}
              </span>
              <span className="text-xs font-bold text-slate-400 font-mono uppercase bg-white/10 px-2.5 py-0.5 rounded-full">
                {nextRecommendedScenario?.level || 'A1'}
              </span>
            </div>

            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight leading-snug font-display">
              {targetLng === "Romanian" ? nextRecommendedScenario?.romanianTitle : nextRecommendedScenario?.title}
            </h1>

            <p className="text-xs md:text-sm text-slate-300 leading-relaxed line-clamp-2">
              {nextRecommendedScenario?.description}
            </p>

            <div className="flex items-center gap-4 text-xs font-mono font-semibold text-slate-400 pt-1">
              <span>⏱️ ~5 min</span>
              <span>⚡ +30 XP</span>
              <span>💬 Interactive Audio</span>
            </div>
          </div>

          <button
            onClick={() => onSelectScenario(nextRecommendedScenario?.id || "at_bakery")}
            className="w-full md:w-auto shrink-0 bg-sky-500 hover:bg-sky-400 text-slate-950 font-black uppercase tracking-wider text-xs font-mono px-7 py-4 rounded-2xl transition-all border-b-4 border-sky-700 active:border-b-0 active:translate-y-[4px] cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-sky-950/40"
          >
            <span>{t('start_learning', sourceLng)}</span>
            <ArrowRight className="w-4 h-4 text-slate-950" />
          </button>
        </div>
      </motion.div>

      {/* 3. QUICK NAVIGATION TILES (3 CLEAN CARDS) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Tile 1: Scenarios Path */}
        <button
          onClick={() => onNavigate('library')}
          className="bg-white hover:bg-slate-50/80 border-2 border-slate-200 border-b-5 p-5 rounded-3xl transition-all cursor-pointer text-left flex items-start gap-4 group"
        >
          <div className="w-12 h-12 rounded-2xl bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-600 shrink-0 group-hover:scale-105 transition">
            <BookOpen className="w-6 h-6" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-extrabold text-slate-800 group-hover:text-sky-600 transition font-display">
              {t('explore_scenarios', sourceLng)}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">
              {completedCount} of {totalScenarios} Dialogues Finished
            </p>
            <div className="flex items-center gap-1 text-[11px] font-bold text-sky-600 font-mono mt-2">
              <span>Browse Catalog</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </button>

        {/* Tile 2: Anki Flashcards */}
        <button
          onClick={() => onNavigate('srs')}
          className="bg-white hover:bg-slate-50/80 border-2 border-slate-200 border-b-5 p-5 rounded-3xl transition-all cursor-pointer text-left flex items-start gap-4 group"
        >
          <div className="w-12 h-12 rounded-2xl bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-600 shrink-0 group-hover:scale-105 transition">
            <Layers className="w-6 h-6" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-extrabold text-slate-800 group-hover:text-teal-600 transition font-display">
              {t('anki_decks', sourceLng)}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">
              {wordsLearned} Saved Vocabulary Cards
            </p>
            <div className="flex items-center gap-1 text-[11px] font-bold text-teal-600 font-mono mt-2">
              <span>Review Deck</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </button>

        {/* Tile 3: Grammar & Essentials */}
        <button
          onClick={() => onNavigate('essentials')}
          className="bg-white hover:bg-slate-50/80 border-2 border-slate-200 border-b-5 p-5 rounded-3xl transition-all cursor-pointer text-left flex items-start gap-4 group"
        >
          <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 shrink-0 group-hover:scale-105 transition">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-extrabold text-slate-800 group-hover:text-amber-600 transition font-display">
              {t('syllabus', sourceLng)}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">
              Verbs, Grammar & Daily Phrases
            </p>
            <div className="flex items-center gap-1 text-[11px] font-bold text-amber-600 font-mono mt-2">
              <span>Open Syllabus</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </button>
      </div>

      {/* 4. NIRAN AI COACH & SPOTLIGHT WORD GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Niran Coach Speech Card */}
        <NiranCoach 
          mood={coachTip.mood}
          message={coachTip.en}
          messageRo={coachTip.ro}
        />

        {/* Spotlight Word of the Day Card */}
        <div className="bg-white rounded-3xl p-5 md:p-6 border-2 border-slate-200 border-b-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-black uppercase tracking-widest font-mono text-sky-600 bg-sky-50 px-2.5 py-0.5 rounded-full border border-sky-100">
                ✨ {t('word_of_day', sourceLng)}
              </span>

              <button
                onClick={handleSpeakWord}
                className="p-2 rounded-xl bg-slate-100 hover:bg-sky-100 text-slate-600 hover:text-sky-600 transition cursor-pointer"
                title="Listen to Pronunciation"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-2">
              <h3 className="text-2xl font-extrabold text-slate-900 font-display tracking-tight">
                {wordOfProps.word}
              </h3>
              <p className="text-xs font-mono font-bold text-slate-400">/{wordOfProps.pronunciation}/</p>
            </div>

            <p className="text-xs font-extrabold text-slate-700 mt-2 border-l-2 border-sky-500 pl-2.5">
              &ldquo;{wordOfProps.english}&rdquo;
            </p>

            <div className="mt-3 bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-[11px] font-medium text-slate-600">
              <span className="font-bold text-slate-800">{wordOfProps.sentence}</span>
              <span className="block text-slate-400 mt-0.5 italic">{wordOfProps.translation}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 5. WEEKLY ACTIVITY STREAK ROW */}
      <div className="bg-white rounded-3xl p-5 border-2 border-slate-200 border-b-5 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-orange-50 border border-orange-200 flex items-center justify-center text-orange-500 shrink-0">
            <Flame className="w-5 h-5 fill-orange-500" />
          </div>
          <div>
            <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider font-mono">
              {t('weekly_activity', sourceLng)}
            </h4>
            <p className="text-xs text-slate-400 font-medium">Keep practicing daily to protect your streak!</p>
          </div>
        </div>

        {/* 7 Day Indicator Dots */}
        <div className="flex items-center gap-2">
          {Array.from({ length: 7 }).map((_, i) => {
            const d = new Date();
            d.setDate(d.getDate() - (6 - i));
            const year = d.getFullYear();
            const monthVal = String(d.getMonth() + 1).padStart(2, '0');
            const dayVal = String(d.getDate()).padStart(2, '0');
            const dateStr = `${year}-${monthVal}-${dayVal}`;
            const isPracticed = (progress.practiceDays || []).includes(dateStr) || progress.lastActiveDate === dateStr;
            const dayLetter = d.toLocaleDateString('en-US', { weekday: 'narrow' });

            return (
              <div key={dateStr} className="flex flex-col items-center gap-1">
                <span className="text-[9px] font-black text-slate-400 font-mono uppercase">{dayLetter}</span>
                <div className={`w-7 h-7 rounded-full flex items-center justify-center transition ${
                  isPracticed 
                    ? 'bg-orange-500 text-white shadow-2xs font-bold text-xs' 
                    : 'bg-slate-100 text-slate-350 border border-slate-200 text-[10px] font-bold'
                }`}>
                  {isPracticed ? "✓" : d.getDate()}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* AD BANNER */}
      <div className="mt-2">
        <AdBanner dataAdSlot="1234567890" />
      </div>

    </motion.div>
  );
}
