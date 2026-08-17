/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Flame, 
  BookOpen, 
  Award, 
  TrendingUp, 
  Sparkles, 
  Languages, 
  Compass,
  LayoutDashboard,
  Heart,
  Mail,
  Lock,
  User,
  LogOut,
  ShieldAlert,
  LogIn,
  ArrowRight,
  Globe,
  Crown,
  GraduationCap
} from 'lucide-react';

import Dashboard from './components/Dashboard';
import Library from './components/Library';
import ScenarioLearner from './components/ScenarioLearner';
import AnkiSrs from './components/AnkiSrs';
import StatsBadges from './components/StatsBadges';
import Essentials from './components/Essentials';
import PrivacyPolicy from './components/PrivacyPolicy';
import TermsOfService from './components/TermsOfService';
import AdBanner from './components/AdBanner';
import DailyGoalModal from './components/DailyGoalModal';
import LanguageSettingsModal from './components/LanguageSettingsModal';
import LevelAssessmentModal from './components/LevelAssessmentModal';
import AnimatedProgressBar from './components/AnimatedProgressBar';
import { UserProgress, Scenario, Flashcard } from './types';
import { SCENARIOS } from './data/topics';
import { getLocalDateString, calculateXpGain } from './lib/xp';
import { t } from './lib/i18n';
import { db, auth, googleProvider, OperationType, handleFirestoreError } from './lib/firebase';
import { 
  onAuthStateChanged, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signInWithPopup, 
  signOut,
  updateProfile,
  User as FirebaseUser
} from 'firebase/auth';
import { 
  doc, 
  getDoc, 
  setDoc, 
  collection, 
  getDocs 
} from 'firebase/firestore';

const STORAGE_KEY = 'LEARN_WITH_NIRAN_STATE';

const DEFAULT_PROGRESS: UserProgress = {
  xp: 145,
  streak: 3,
  lastActiveDate: null,
  completedScenarios: ['sc-1'], // Pre-complete scenario 1 so they see statistics of progress immediately
  inProgressScenarios: [],
  favorites: [],
  badges: ['welcome'],
  dailyGoalXp: 50,
  dailyXpGained: 25,
  targetLanguage: 'Romanian',
  sourceLanguage: 'English',
  completedScenariosByLanguage: {
    Romanian: ['sc-1']
  },
  inProgressScenariosByLanguage: {
    Romanian: []
  },
  flashcards: [
    {
      id: 'sc-1-castel',
      romanian: 'Castel',
      english: 'Castle',
      context: 'Castelul Peleș este situat în Sinaia.',
      contextTranslation: 'Peleș Castle is located in Sinaia.',
      box: 2,
      nextReviewDate: new Date().toISOString() // Ready for review today!
    },
    {
      id: 'sc-1-covrig',
      romanian: 'Covrig',
      english: 'Pretzel',
      context: 'Am cumpărat un covrig cald de la patiserie.',
      contextTranslation: 'I bought a warm pretzel from the bakery.',
      box: 1,
      nextReviewDate: new Date().toISOString() // Ready for review today!
    }
  ],
  practiceDays: []
};

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('home');
  const [selectedScenario, setSelectedScenario] = useState<Scenario | null>(null);
  const [progress, setProgress] = useState<UserProgress>(DEFAULT_PROGRESS);
  const [isLoaded, setIsLoaded] = useState(false);

  // Auth and Firestore states
  const [authUser, setAuthUser] = useState<FirebaseUser | null>(null);
  const [isLoadingDb, setIsLoadingDb] = useState(true);
  const [isGuestMode, setIsGuestMode] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [isDailyGoalModalOpen, setIsDailyGoalModalOpen] = useState(false);
  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState(false);
  const [hasRestoredPosition, setHasRestoredPosition] = useState(false);

  // Determine if this is a brand new user who has never started using the path
  const isFirstTimeUser = useMemo(() => {
    if (progress.assessedLevel) return false;
    
    const hasMoreThanOneCompleted = progress.completedScenarios.filter(id => id !== 'sc-1').length > 0;
    const hasInProgress = progress.inProgressScenarios.length > 0;
    const hasChangedXp = progress.xp > 145; // Default starts at 145
    const hasLastSelected = !!progress.lastSelectedScenarioId;
    const hasPracticeDays = progress.practiceDays.length > 1;

    if (hasMoreThanOneCompleted || hasInProgress || hasChangedXp || hasLastSelected || hasPracticeDays) {
      return false;
    }
    return true;
  }, [
    progress.assessedLevel,
    progress.completedScenarios,
    progress.inProgressScenarios,
    progress.xp,
    progress.lastSelectedScenarioId,
    progress.practiceDays
  ]);

  // Restore existing user's position upon loading
  useEffect(() => {
    if (isLoaded && !hasRestoredPosition) {
      if (progress.lastSelectedScenarioId) {
        const found = SCENARIOS.find(s => s.id === progress.lastSelectedScenarioId);
        if (found) {
          setSelectedScenario(found);
        } else if (progress.assessedLevel) {
          setActiveTab('library');
        }
      } else if (progress.assessedLevel) {
        // Direct the user to the path page if they already have an assessed level
        setActiveTab('library');
      }
      setHasRestoredPosition(true);
    }
  }, [isLoaded, progress.assessedLevel, progress.lastSelectedScenarioId, hasRestoredPosition]);
  
  // Auth Form details
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [authError, setAuthError] = useState('');
  const [authSubmitting, setAuthSubmitting] = useState(false);

  // Authenticate user changes and sync Firestore metadata
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setAuthUser(user);
        setIsLoadingDb(true);
        setAuthError('');
        try {
          const userDocRef = doc(db, 'users', user.uid);
          const userDocSnap = await getDoc(userDocRef);
          
          if (userDocSnap.exists()) {
            const dataBase = userDocSnap.data();
            
            // Fetch individual Leitner Flashcards subcollection limit
            const flashRef = collection(db, 'users', user.uid, 'flashcards');
            const flashSnap = await getDocs(flashRef);
            const loadedFlashcards: Flashcard[] = [];
            flashSnap.forEach((d) => {
              loadedFlashcards.push(d.data() as Flashcard);
            });

            // Fetch practice logs subcollection
            const daysRef = collection(db, 'users', user.uid, 'practice_days');
            const daysSnap = await getDocs(daysRef);
            const loadedDays: string[] = [];
            daysSnap.forEach((d) => {
              loadedDays.push(d.id); // Doc ID is the formatted date string YYYY-MM-DD
            });

            const loadedCompletedScenarios = dataBase.completedScenarios ?? ['sc-1'];
            const loadedInProgressScenarios = dataBase.inProgressScenarios ?? [];
            const loadedTargetLanguage = dataBase.targetLanguage ?? 'Romanian';
            const loadedCompletedByLang = dataBase.completedScenariosByLanguage ?? { Romanian: loadedCompletedScenarios };
            const loadedInProgressByLang = dataBase.inProgressScenariosByLanguage ?? { Romanian: loadedInProgressScenarios };

            const activeCompleted = loadedCompletedByLang[loadedTargetLanguage] ?? (loadedTargetLanguage === 'Romanian' ? ['sc-1'] : []);
            const activeInProgress = loadedInProgressByLang[loadedTargetLanguage] ?? [];

            setProgress({
              xp: dataBase.xp ?? 145,
              streak: dataBase.streak ?? 3,
              lastActiveDate: dataBase.lastActiveDate ?? null,
              completedScenarios: activeCompleted,
              inProgressScenarios: activeInProgress,
              favorites: dataBase.favorites ?? [],
              badges: dataBase.badges ?? ['welcome'],
              dailyGoalXp: dataBase.dailyGoalXp ?? 50,
              dailyXpGained: dataBase.dailyXpGained ?? 25,
              flashcards: loadedFlashcards,
              practiceDays: loadedDays,
              targetLanguage: loadedTargetLanguage,
              sourceLanguage: dataBase.sourceLanguage ?? 'English',
              completedScenariosByLanguage: loadedCompletedByLang,
              inProgressScenariosByLanguage: loadedInProgressByLang,
              assessedLevel: dataBase.assessedLevel,
              lastSelectedScenarioId: dataBase.lastSelectedScenarioId
            });
          } else {
            // Seed a brand new profile inside firestore db
            const todayStr = getLocalDateString();
            const initialProfile: any = {
              xp: progress.xp ?? 145,
              streak: progress.streak ?? 3,
              lastActiveDate: progress.lastActiveDate ?? todayStr,
              completedScenarios: progress.completedScenarios.length > 0 ? progress.completedScenarios : ['sc-1'],
              inProgressScenarios: progress.inProgressScenarios ?? [],
              favorites: progress.favorites ?? [],
              badges: progress.badges ?? ['welcome'],
              dailyGoalXp: progress.dailyGoalXp ?? 50,
              dailyXpGained: progress.dailyXpGained ?? 25,
              targetLanguage: progress.targetLanguage ?? 'Romanian',
              sourceLanguage: progress.sourceLanguage ?? 'English',
              completedScenariosByLanguage: progress.completedScenariosByLanguage ?? {
                Romanian: ['sc-1']
              },
              inProgressScenariosByLanguage: progress.inProgressScenariosByLanguage ?? {
                Romanian: []
              }
            };
            if (progress.assessedLevel) {
              initialProfile.assessedLevel = progress.assessedLevel;
            }
            if (progress.lastSelectedScenarioId) {
              initialProfile.lastSelectedScenarioId = progress.lastSelectedScenarioId;
            }

            await setDoc(userDocRef, initialProfile);

            // Seed initial vocabulary cards in custom sub-collection documents
            const flashRef = collection(db, 'users', user.uid, 'flashcards');
            for (const f of DEFAULT_PROGRESS.flashcards) {
              await setDoc(doc(flashRef, f.id), f);
            }

            // Seed initial activity history day
            const dayDocRef = doc(db, 'users', user.uid, 'practice_days', todayStr);
            await setDoc(dayDocRef, {
              date: todayStr,
              xpGained: 25,
              timestamp: new Date().toISOString()
            });

            setProgress({
              ...DEFAULT_PROGRESS,
              ...initialProfile,
              practiceDays: [todayStr]
            });
          }
        } catch (e) {
          console.error('Error fetching database details for profile:', e);
        } finally {
          setIsLoadingDb(false);
          setIsLoaded(true);
        }
      } else {
        setAuthUser(null);
        setIsLoadingDb(false);
        // Fallback load local state if log out occurs
        try {
          const stored = localStorage.getItem(STORAGE_KEY);
          if (stored) {
            const parsed = JSON.parse(stored);
            const activeLang = parsed.targetLanguage || 'Romanian';
            const completedByLang = parsed.completedScenariosByLanguage || { Romanian: parsed.completedScenarios || ['sc-1'] };
            const inProgressByLang = parsed.inProgressScenariosByLanguage || { Romanian: parsed.inProgressScenarios || [] };
            
            parsed.completedScenarios = completedByLang[activeLang] ?? (activeLang === 'Romanian' ? ['sc-1'] : []);
            parsed.inProgressScenarios = inProgressByLang[activeLang] ?? [];
            parsed.completedScenariosByLanguage = completedByLang;
            parsed.inProgressScenariosByLanguage = inProgressByLang;
            setProgress(parsed);
          } else {
            setProgress(DEFAULT_PROGRESS);
          }
        } catch (e) {
          console.error('Load details failed:', e);
        }
        setIsLoaded(true);
      }
    });

    return () => unsubscribe();
  }, []);

  // Update profile attributes securely with real-time firestore writes.
  const updateProgress = async (updatedFields: Partial<UserProgress>) => {
    setProgress((prev) => {
      let finalFields = { ...updatedFields };
      let dateToLog: string | null = null;

      // Intercept XP bumps to evaluate dynamic central streak triggers
      if (updatedFields.xp !== undefined && updatedFields.xp > prev.xp) {
        const xpDiff = updatedFields.xp - prev.xp;
        const { updatedFields: gamifiedFields, newDateLogged } = calculateXpGain(prev, xpDiff);
        finalFields = { ...finalFields, ...gamifiedFields };
        dateToLog = newDateLogged;
      }

      const currentLanguage = prev.targetLanguage || 'Romanian';
      const targetLanguageWillBe = finalFields.targetLanguage !== undefined ? finalFields.targetLanguage : currentLanguage;

      let completedByLang = prev.completedScenariosByLanguage || { [currentLanguage]: prev.completedScenarios || ['sc-1'] };
      let inProgressByLang = prev.inProgressScenariosByLanguage || { [currentLanguage]: prev.inProgressScenarios || [] };

      // Update current active lists tracking
      if (finalFields.completedScenarios !== undefined) {
        completedByLang = {
          ...completedByLang,
          [currentLanguage]: finalFields.completedScenarios
        };
      }
      if (finalFields.inProgressScenarios !== undefined) {
        inProgressByLang = {
          ...inProgressByLang,
          [currentLanguage]: finalFields.inProgressScenarios
        };
      }

      // Swapping target language
      if (finalFields.targetLanguage !== undefined && finalFields.targetLanguage !== currentLanguage) {
        completedByLang = {
          ...completedByLang,
          [currentLanguage]: finalFields.completedScenarios !== undefined ? finalFields.completedScenarios : prev.completedScenarios
        };
        inProgressByLang = {
          ...inProgressByLang,
          [currentLanguage]: finalFields.inProgressScenarios !== undefined ? finalFields.inProgressScenarios : prev.inProgressScenarios
        };

        const loadedCompleted = completedByLang[finalFields.targetLanguage] ?? (finalFields.targetLanguage === 'Romanian' ? ['sc-1'] : []);
        const loadedInProgress = inProgressByLang[finalFields.targetLanguage] ?? [];

        finalFields.completedScenarios = loadedCompleted;
        finalFields.inProgressScenarios = loadedInProgress;
      }

      finalFields.completedScenariosByLanguage = completedByLang;
      finalFields.inProgressScenariosByLanguage = inProgressByLang;

      const next = { ...prev, ...finalFields };

      // Persistent fallback save to localStorage
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch (e) {
        console.error('Failed to write storage details:', e);
      }

      // Sync to cloud Firestore securely if signed-in 
      if (auth.currentUser) {
        const uid = auth.currentUser.uid;
        
        // 1. Root updates (excluding flashcards / logs)
        const rootUpdateData: any = {};
        const rootKeys: (keyof UserProgress)[] = [
          'xp', 'streak', 'lastActiveDate', 'completedScenarios', 
          'inProgressScenarios', 'favorites', 'badges', 'dailyGoalXp', 'dailyXpGained',
          'targetLanguage', 'sourceLanguage',
          'completedScenariosByLanguage', 'inProgressScenariosByLanguage',
          'assessedLevel', 'lastSelectedScenarioId'
        ];
        
        rootKeys.forEach((k) => {
          if (finalFields[k] !== undefined) {
            rootUpdateData[k] = finalFields[k];
          }
        });

        if (Object.keys(rootUpdateData).length > 0) {
          const docRef = doc(db, 'users', uid);
          setDoc(docRef, rootUpdateData, { merge: true })
            .catch(err => handleFirestoreError(err, OperationType.UPDATE, `users/${uid}`));
        }

        // 2. Sub-collection granular Leitner flashcard updates
        if (finalFields.flashcards !== undefined) {
          const previousCards = prev.flashcards;
          const incomingCards = finalFields.flashcards;

          incomingCards.forEach((card) => {
            const matchedPrev = previousCards.find(c => c.id === card.id);
            if (!matchedPrev || matchedPrev.box !== card.box || matchedPrev.nextReviewDate !== card.nextReviewDate) {
              const cardDocRef = doc(db, 'users', uid, 'flashcards', card.id);
              setDoc(cardDocRef, card)
                .catch(err => handleFirestoreError(err, OperationType.UPDATE, `users/${uid}/flashcards/${card.id}`));
            }
          });
        }

        // 3. Sub-collection historical Days of Practice log updates
        if (dateToLog) {
          const dayDocRef = doc(db, 'users', uid, 'practice_days', dateToLog);
          setDoc(dayDocRef, {
            date: dateToLog,
            xpGained: next.dailyXpGained,
            timestamp: new Date().toISOString()
          }).catch(err => handleFirestoreError(err, OperationType.CREATE, `users/${uid}/practice_days/${dateToLog}`));
        } else if (finalFields.dailyXpGained !== undefined) {
          const todayStr = getLocalDateString();
          const dayDocRef = doc(db, 'users', uid, 'practice_days', todayStr);
          setDoc(dayDocRef, {
            date: todayStr,
            xpGained: next.dailyXpGained,
            timestamp: new Date().toISOString()
          }, { merge: true }).catch(err => handleFirestoreError(err, OperationType.UPDATE, `users/${uid}/practice_days/${todayStr}`));
        }
      }

      return next;
    });
  };

  // Toggle favorite scenario
  const handleToggleFavorite = (scenarioId: string) => {
    const isFav = progress.favorites.includes(scenarioId);
    const updatedFavs = isFav 
      ? progress.favorites.filter((id) => id !== scenarioId)
      : [...progress.favorites, scenarioId];
    
    updateProgress({ favorites: updatedFavs });
  };

  // Click handler to sign out safely
  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setIsGuestMode(false);
    } catch (e) {
      console.error('Signout failed:', e);
    }
  };

  // Handle custom Email/Password login signup forms
  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    if (!email || !password) {
      setAuthError('Te rugăm să completezi câmpurile obligatorii.');
      return;
    }
    setAuthSubmitting(true);
    try {
      if (authMode === 'signin') {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        if (!displayName) {
          setAuthError('Te rugăm să îți scrii numele.');
          setAuthSubmitting(false);
          return;
        }
        const credential = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(credential.user, { displayName });
      }
    } catch (err: any) {
      const code = err.code ?? '';
      if (code === 'auth/invalid-credential') {
        setAuthError('Datele introduse sunt incorecte.');
      } else if (code === 'auth/email-already-in-use') {
        setAuthError('Căsuța de email este deja înregistrată.');
      } else if (code === 'auth/weak-password') {
        setAuthError('Parola trebuie să conțină cel puțin 6 caractere.');
      } else {
        setAuthError(err.message || 'A apărut o problemă în timpul autentificării.');
      }
    } finally {
      setAuthSubmitting(false);
    }
  };

  // Handle simple Google Login popup trigger
  const handleGoogleLogin = async () => {
    setAuthError('');
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err: any) {
      if (err.code !== 'auth/popup-closed-by-user') {
        setAuthError(err.message || 'Autentificarea Google a eșuat.');
      }
    }
  };

  // Loading Screen Wrapper
  if (!isLoaded || (authUser && isLoadingDb)) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 rounded-full border-4 border-indigo-200 border-t-indigo-600 animate-spin"></div>
        <p className="font-mono text-xs text-slate-400 uppercase tracking-widest animate-pulse font-bold">
          Se încarcă profilul Niran...
        </p>
      </div>
    );
  }

  // Render login and signup form as a premium responsive experience
  if (!authUser && !isGuestMode) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col justify-center items-center py-10 px-4 md:px-12 lg:px-20 relative overflow-hidden font-sans">
        
        {/* Ambient top decoration grids */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,#000_70%,transparent_100%)] opacity-35 pointer-events-none"></div>

        <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-10">
          
          {/* LEFT/TOP COLUMN: Stunning product showcase and quick guest access */}
          <div className="lg:col-span-7 space-y-8 text-left">
            
            {/* Branding badge */}
            <div className="inline-flex items-center gap-2.5 bg-indigo-50 border border-indigo-100 rounded-full px-4 py-1.5 shadow-2xs select-none">
              <span className="flex h-2.5 w-4 shrink-0 rounded-xs overflow-hidden">
                <span className="bg-[#002B7F] w-1/3"></span>
                <span className="bg-[#FCD116] w-1/3"></span>
                <span className="bg-[#CE1126] w-1/3"></span>
              </span>
              <span className="text-xs font-black text-indigo-750 uppercase tracking-widest font-mono">
                Română Imersivă • Learn with Niran
              </span>
            </div>

            {/* Impressive friendly hero title */}
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-none font-display">
                Master Romanian <span className="text-indigo-600">Naturally</span> through Dialogues.
              </h1>
              <p className="text-sm md:text-base text-slate-600 leading-relaxed font-medium max-w-xl">
                Skip the boring grammar tables. Learn real-world vocabulary in actual conversational scenarios, review with smart Anki cards, and converse with Niran, your friendly AI language coach.
              </p>
            </div>

            {/* Glowing Primary CTA for 1-click Instant Free Access */}
            <div className="bg-white rounded-3xl p-6 border-2 border-dashed border-indigo-200/90 shadow-md max-w-lg space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-2xl shrink-0 animate-float shadow-inner">
                  🐻
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-black text-slate-900 uppercase tracking-wide">Ready to start? Zero friction!</h3>
                  <p className="text-xs text-slate-500 font-bold">Try the complete app instantly as a guest. No credit card or registration needed.</p>
                </div>
              </div>
              <button
                onClick={() => setIsGuestMode(true)}
                className="w-full bg-indigo-600 hover:bg-indigo-700 active:scale-98 text-white font-black py-4 px-6 rounded-2xl text-xs uppercase tracking-widest font-mono transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-indigo-150"
              >
                Start Learning Instantly (Free Guest Mode)
                <ArrowRight className="w-4.5 h-4.5" />
              </button>
              <div className="text-center">
                <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest font-mono">
                  ✨ Instant Sandbox Mode active • Save progress later anytime
                </span>
              </div>
            </div>

            {/* Elegant visual features grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl select-none">
              
              <div className="p-5 bg-white border border-slate-200/80 rounded-2xl space-y-2 hover:border-indigo-200 transition-colors">
                <div className="w-9 h-9 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center text-lg font-bold">
                  📖
                </div>
                <h4 className="text-xs font-black text-slate-900 uppercase tracking-wide">Interactive Dialogues</h4>
                <p className="text-[11px] text-slate-500 font-bold leading-normal">
                  Read, hear, and translate real-life Romanian scenarios: bakery shops, taxi rides, museum checks, and airport gates.
                </p>
              </div>

              <div className="p-5 bg-white border border-slate-200/80 rounded-2xl space-y-2 hover:border-indigo-200 transition-colors">
                <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center text-lg font-bold">
                  🧠
                </div>
                <h4 className="text-xs font-black text-slate-900 uppercase tracking-wide">Smart Anki Leitner Cards</h4>
                <p className="text-[11px] text-slate-500 font-bold leading-normal">
                  Retain vocab forever using automated Spaced Repetition (SRS) box intervals. Track learning progress step-by-step.
                </p>
              </div>

            </div>

          </div>

          {/* RIGHT/BOTTOM COLUMN: Secure Authentication Gate Card */}
          <div className="lg:col-span-5 w-full">
            <div className="w-full bg-white rounded-3xl border border-slate-200 p-8 shadow-xl space-y-6">
              
              {/* Box Header */}
              <div className="text-center space-y-1">
                <h2 className="text-lg font-black text-slate-900 font-display">
                  Already a Learner?
                </h2>
                <p className="text-xs text-slate-500 font-bold">
                  Sign in or create a secure account to save progress.
                </p>
              </div>

              {/* Form Toggle Tabs */}
              <div className="grid grid-cols-2 bg-slate-100 p-1 rounded-xl border border-slate-200/40 select-none">
                <button
                  onClick={() => { setAuthMode('signin'); setAuthError(''); }}
                  className={`py-2 px-3 rounded-lg text-xs font-black transition-all duration-200 cursor-pointer uppercase font-mono tracking-wider ${
                    authMode === 'signin' 
                      ? 'bg-white text-indigo-700 shadow-2xs' 
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Intră în cont
                </button>
                <button
                  onClick={() => { setAuthMode('signup'); setAuthError(''); }}
                  className={`py-2 px-3 rounded-lg text-xs font-black transition-all duration-200 cursor-pointer uppercase font-mono tracking-wider ${
                    authMode === 'signup' 
                      ? 'bg-white text-indigo-700 shadow-2xs' 
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Cont Nou
                </button>
              </div>

              {/* Error Banner */}
              {authError && (
                <div className="flex items-start gap-2.5 bg-red-50 border border-red-200 text-red-800 rounded-2xl p-4 text-xs animate-head-shake">
                  <ShieldAlert className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  <div className="font-medium">{authError}</div>
                </div>
              )}

              {/* Dynamic Sign up / Sign in Form */}
              <form onSubmit={handleAuthSubmit} className="space-y-4">
                
                {authMode === 'signup' && (
                  <div className="space-y-1.5">
                    <label className="block text-xs font-black text-slate-500 uppercase tracking-wider font-mono">
                      Cum te cheamă?
                    </label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        required
                        placeholder="Ion Popescu"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200/90 rounded-xl pl-10 pr-4 py-2.5 text-sm font-semibold focus:outline-hidden focus:border-indigo-500 focus:ring-3 focus:ring-indigo-150 transition"
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-1.5">
                  <label className="block text-xs font-black text-slate-500 uppercase tracking-wider font-mono">
                    Căsuță de email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="email"
                      required
                      placeholder="ion@exemplu.ro"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200/90 rounded-xl pl-10 pr-4 py-2.5 text-sm font-semibold focus:outline-hidden focus:border-indigo-500 focus:ring-3 focus:ring-indigo-150 transition"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-black text-slate-500 uppercase tracking-wider font-mono">
                    Parolă securizată
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200/90 rounded-xl pl-10 pr-4 py-2.5 text-sm font-semibold focus:outline-hidden focus:border-indigo-500 focus:ring-3 focus:ring-indigo-150 transition"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={authSubmitting}
                  className="w-full bg-slate-900 hover:bg-slate-850 disabled:bg-slate-300 text-white font-black py-3.5 px-4 rounded-xl text-xs uppercase tracking-widest font-mono transition flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                >
                  {authSubmitting ? (
                    <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <>
                      {authMode === 'signin' ? 'Intră în cont' : 'Creează cont curat'}
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              {/* SSO Divider */}
              <div className="relative flex items-center justify-center py-1 select-none">
                <div className="absolute w-full border-t border-slate-100"></div>
                <span className="relative bg-white px-3.5 text-[9px] font-black text-slate-400 uppercase tracking-widest font-mono">
                  Sau
                </span>
              </div>

              {/* SSO Google Trigger */}
              <button
                onClick={handleGoogleLogin}
                className="w-full border border-slate-205 hover:bg-slate-50 text-slate-700 font-bold py-3 px-4 rounded-xl text-xs uppercase tracking-wider font-mono transition flex items-center justify-center gap-2.5 cursor-pointer shadow-2xs"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#EA4335"
                    d="M12.24 10.285V14.4h6.81c-.29 1.54-1.74 4.54-6.81 4.54-4.39 0-7.97-3.63-7.97-8.1s3.58-8.1 7.97-8.1c2.5 0 4.17 1.04 5.13 1.95l3.25-3.13C18.25 1.51 15.34 0 12.24 0 5.6 0 .23 5.37.23 12s5.37 12 12.01 12c6.92 0 11.53-4.87 11.53-11.75 0-.79-.08-1.4-.19-1.97H12.24z"
                  />
                </svg>
                Continuă cu Google
              </button>

            </div>
          </div>

        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col md:flex-row font-sans">
      
      {/* Sandbox mode warning alert banner */}
      {!authUser && isGuestMode && (
        <div className="bg-amber-50 border-b border-amber-200 text-amber-800 text-xs px-4 py-2.5 flex flex-col sm:flex-row gap-2 justify-between items-start sm:items-center font-semibold select-none anim-fade-in relative z-50 shadow-xs w-full md:hidden">
          <span className="flex items-center gap-2 text-left">
            <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              <strong>Mod Sandbox Activ:</strong> Progresul este local.
            </span>
          </span>
          <button 
            onClick={() => { setIsGuestMode(false); setAuthMode('signup'); }}
            className="bg-amber-600 hover:bg-amber-700 text-white rounded-lg px-2.5 py-0.5 font-bold text-[9px] uppercase font-mono transition cursor-pointer shrink-0"
          >
            Înregistrează-te
          </button>
        </div>
      )}

      {/* 1. Desktop Lefthand Navigation Sidebar (rendered exclusively on md viewports and up) */}
      <aside className="hidden md:flex flex-col w-64 shrink-0 bg-white border-r-2 border-slate-200 sticky top-0 h-screen p-6 justify-between select-none z-30">
        <div className="space-y-6">
          {/* Brand logo header */}
          <div 
            onClick={() => {
              setSelectedScenario(null);
              setActiveTab('home');
            }}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-md shadow-indigo-150 group-hover:scale-105 transition duration-200 text-xl font-bold font-sans">
              🐻
            </div>
            <div>
              <h1 className="text-sm font-extrabold text-slate-900 tracking-tight leading-none font-display">
                Learn with Niran
              </h1>
              <div className="flex items-center gap-1 mt-1.5">
                <span className="flex h-1.5 w-2.5 shrink-0">
                  <span className="bg-[#002B7F] w-1/3"></span>
                  <span className="bg-[#FCD116] w-1/3"></span>
                  <span className="bg-[#CE1126] w-1/3"></span>
                </span>
                <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest font-mono">
                  Română Imersivă
                </span>
              </div>
            </div>
          </div>

          {!authUser && isGuestMode && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl text-[10px] text-amber-800 leading-relaxed font-bold">
              <ShieldAlert className="w-3.5 h-3.5 text-amber-600 mb-1" />
              Sandbox mode. Click register below to save stats permanently!
            </div>
          )}

          {/* Vertical tactile menu triggers */}
          <nav className="flex flex-col gap-1.5 pt-4">
            {[
              { id: 'home', labelKey: 'dashboard', icon: LayoutDashboard },
              { id: 'library', labelKey: 'learn_path', icon: BookOpen },
              { id: 'srs', labelKey: 'anki_decks', icon: Flame },
              { id: 'essentials', labelKey: 'essentials', icon: GraduationCap },
              { id: 'stats', labelKey: 'trophies', icon: TrendingUp },
            ].map((tab) => {
              const IconComp = tab.icon;
              const isActive = activeTab === tab.id && !selectedScenario;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                     setSelectedScenario(null);
                     setActiveTab(tab.id);
                  }}
                  className={`flex items-center gap-3.5 py-3.5 px-4 rounded-2xl text-[11.5px] font-extrabold tracking-widest font-mono uppercase transition-all duration-150 cursor-pointer border-2 ${
                    isActive
                      ? 'bg-indigo-50/70 text-indigo-600 border-indigo-200 border-b-4 shadow-xs'
                      : 'text-slate-550 border-transparent hover:bg-slate-50 hover:text-slate-800'
                  }`}
                >
                  <IconComp className="w-5 h-5 shrink-0" />
                  {t(tab.labelKey, progress.sourceLanguage).toUpperCase()}
                </button>
              );
            })}
          </nav>
        </div>

        {/* User Account container in Sidebar footer */}
        <div className="pt-4 border-t-2 border-slate-100 space-y-4">
          <div className="flex flex-col gap-2 mb-2 px-2">
            <button
              onClick={() => {
                setSelectedScenario(null);
                setActiveTab('privacy');
              }}
              className="text-left text-[10px] font-bold text-slate-400 hover:text-indigo-600 uppercase tracking-widest font-mono transition-colors"
            >
              Privacy Policy
            </button>
            <button
              onClick={() => {
                setSelectedScenario(null);
                setActiveTab('terms');
              }}
              className="text-left text-[10px] font-bold text-slate-400 hover:text-indigo-600 uppercase tracking-widest font-mono transition-colors"
            >
              Terms of Service
            </button>
          </div>
          {authUser ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-indigo-100 border border-indigo-200 flex items-center justify-center text-indigo-700 text-xs font-black uppercase shadow-inner">
                  {authUser.displayName ? authUser.displayName[0] : (authUser.email ? authUser.email[0] : 'U')}
                </div>
                <div className="truncate max-w-[110px]">
                  <p className="text-xs font-black text-slate-800 truncate leading-none">{authUser.displayName || 'Prietene'}</p>
                  <p className="text-[9px] font-bold text-slate-400 font-mono tracking-widest mt-1">LVL {Math.floor(progress.xp / 100) + 1}</p>
                </div>
              </div>
              <button
                onClick={handleSignOut}
                className="p-2 text-slate-400 hover:text-red-500 rounded-xl hover:bg-slate-50 transition cursor-pointer"
                title="Deconectează-te"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => { setIsGuestMode(false); setAuthMode('signup'); }}
              className="w-full btn-tactile-blue py-3 font-mono text-[10px] uppercase tracking-wider"
            >
              Creează Cont
            </button>
          )}
        </div>
      </aside>

      {/* 2. Mobile Header block (visible exclusively on smaller devices) */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200 md:hidden flex justify-between items-center px-4 py-2.5">
        <div 
          onClick={() => {
            setSelectedScenario(null);
            setActiveTab('home');
          }}
          className="flex items-center gap-2 cursor-pointer"
        >
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white text-base font-bold">
            🐻
          </div>
          <span className="text-xs font-black text-slate-900 font-display">Learn with Niran</span>
        </div>

        {/* Quick mobile badges indicators */}
        <div className="flex items-center gap-1.5 font-mono text-[10px] select-none">
          <button
            type="button"
            onClick={() => setIsLanguageModalOpen(true)}
            className="p-1 bg-slate-50 border border-slate-200 rounded-lg text-indigo-850 cursor-pointer hover:bg-indigo-50 transition flex items-center gap-1 px-1.5 text-[9px] font-black"
            title="Configure Language settings"
          >
            <Languages className="w-3 h-3 text-indigo-600" />
            <span>{progress.targetLanguage ? progress.targetLanguage.substring(0, 3).toUpperCase() : "ROM"}</span>
          </button>
          <div className="flex items-center gap-1 bg-yellow-50 text-yellow-700 border border-yellow-101 rounded-full px-2 py-0.5 font-bold">
            <Sparkles className="w-3 h-3 fill-yellow-400 text-yellow-500" />
            <span>{progress.xp} XP</span>
          </div>
          <div className="flex items-center gap-1 bg-red-50 text-red-650 border border-red-100 rounded-full px-2 py-0.5 font-bold">
            <Flame className="w-3 h-3 fill-red-500" />
            <span>{progress.streak}d</span>
          </div>
        </div>
      </header>

      {/* 3. Main Stage Content Viewport */}
      <div className="flex-1 flex flex-col min-h-screen bg-slate-50 overflow-x-hidden md:max-h-screen md:overflow-y-auto">
        
        {/* Desktop floating topbar panel display */}
        <header className="sticky top-0 z-20 bg-white/95 border-b border-slate-200/80 backdrop-blur-md hidden md:block select-none">
          <div className="w-full max-w-5xl mx-auto px-8 py-3.5 flex items-center justify-between gap-4">
            {selectedScenario ? (
              <button
                onClick={() => {
                  setSelectedScenario(null);
                  setActiveTab('library');
                }}
                className="flex items-center gap-2 text-slate-500 hover:text-slate-800 font-black text-[10px] font-mono uppercase tracking-widest cursor-pointer"
              >
                &larr; Back to learn path
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0"></span>
                <span className="text-[10px] font-black text-slate-400 font-mono uppercase tracking-widest leading-none">
                  Syllabus: Learning {progress.targetLanguage || "Romanian"} in {progress.sourceLanguage || "English"}
                </span>
                <button
                  type="button"
                  onClick={() => setIsLanguageModalOpen(true)}
                  className="inline-flex items-center gap-1 text-[9px] bg-slate-100 hover:bg-indigo-50 text-indigo-700 font-black px-2 py-1 rounded-lg border border-slate-200 cursor-pointer ml-1 tracking-widest font-mono uppercase transition"
                >
                  <Languages className="w-3 h-3 text-indigo-500" /> CHANGE 🌍
                </button>
              </div>
            )}

            {/* Float values display */}
            <div className="flex items-center gap-3 animate-fade-in">
              <div className="flex items-center gap-1.5 bg-yellow-50 text-yellow-700 border border-yellow-250/50 rounded-full px-3 py-1 font-black text-xs font-mono">
                <Sparkles className="w-3.5 h-3.5 fill-yellow-400 text-yellow-500" />
                <span>{progress.xp} XP</span>
              </div>
              <div className="flex items-center gap-1.5 bg-orange-50 text-orange-605 border border-orange-250/50 rounded-full px-3 py-1 font-black text-xs font-mono">
                <Flame className="w-3.5 h-3.5 fill-orange-500 text-orange-550 animate-[bounce_1.5s_infinite]" />
                <span>{progress.streak} DAYS</span>
              </div>
            </div>
          </div>
        </header>

        {/* Global Floating XP bubbles & Level Up overall tracking bar */}
        <div className="w-full max-w-5xl mx-auto px-4 md:px-8 pt-4 pb-0 pointer-events-none select-none z-30">
          <AnimatedProgressBar xp={progress.xp} showLevelTitle={false} showDetails={false} size="sm" />
        </div>

        {/* Central screen view body */}
        <main className="flex-1 max-w-5xl w-full mx-auto px-4 md:px-8 py-6 md:py-8">
          <AnimatePresence mode="wait">
            {selectedScenario ? (
              <motion.div
                key="learner-wrapper"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.2 }}
              >
                <ScenarioLearner 
                  scenario={selectedScenario}
                  progress={progress}
                  onBack={() => {
                    setSelectedScenario(null);
                    setActiveTab('library');
                  }}
                  onUpdateProgress={updateProgress}
                />
              </motion.div>
            ) : (
              <div className="space-y-6">
                {activeTab === 'home' && (
                  <Dashboard 
                    progress={progress}
                    authUser={authUser}
                    onNavigate={(tab) => {
                      setSelectedScenario(null);
                      setActiveTab(tab);
                    }}
                    onSelectScenario={(sId) => {
                      const found = SCENARIOS.find(s => s.id === sId);
                      if (found) {
                        setSelectedScenario(found);
                        updateProgress({ lastSelectedScenarioId: sId });
                      } else {
                        setActiveTab('library');
                      }
                    }}
                    onOpenGoalModal={() => setIsDailyGoalModalOpen(true)}
                  />
                )}

                {activeTab === 'library' && (
                  <Library 
                    progress={progress}
                    onSelectScenario={(scenario) => {
                      setSelectedScenario(scenario);
                      updateProgress({ lastSelectedScenarioId: scenario.id });
                    }}
                    onToggleFavorite={handleToggleFavorite}
                  />
                )}

                {activeTab === 'srs' && (
                  <AnkiSrs 
                    progress={progress}
                    onUpdateProgress={updateProgress}
                  />
                )}

                {activeTab === 'essentials' && (
                  <Essentials 
                    progress={progress}
                    onUpdateProgress={updateProgress}
                    onOpenLanguageSettings={() => setIsLanguageModalOpen(true)}
                  />
                )}

                {activeTab === 'stats' && (
                  <StatsBadges 
                    progress={progress}
                  />
                )}

                {activeTab === 'privacy' && (
                  <PrivacyPolicy />
                )}

                {activeTab === 'terms' && (
                  <TermsOfService />
                )}
              </div>
            )}
          </AnimatePresence>
        </main>
      </div>

      {/* Persistent Bottom Tab Bar navigation (displayed exclusively on mobile viewports) */}
      <footer className="block md:hidden sticky bottom-0 z-45 bg-white border-t border-slate-200/90 shadow-xl px-2 py-2">
        <div className="flex justify-around items-center max-w-sm mx-auto">
          {[
            { id: 'home', labelKey: 'home', icon: LayoutDashboard },
            { id: 'library', labelKey: 'path', icon: BookOpen },
            { id: 'essentials', labelKey: 'syllabus', icon: GraduationCap },
            { id: 'srs', labelKey: 'anki', icon: Flame },
            { id: 'stats', labelKey: 'badges', icon: TrendingUp },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id && !selectedScenario;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setSelectedScenario(null);
                  setActiveTab(tab.id);
                }}
                className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-xl cursor-pointer transition ${
                  isActive ? 'text-teal-500 font-bold' : 'text-slate-400'
                }`}
              >
                <Icon className="w-5 h-5 shrink-0" />
                <span className="text-[9px] font-black uppercase tracking-widest font-mono mt-1">{t(tab.labelKey, progress.sourceLanguage)}</span>
              </button>
            );
          })}
        </div>
      </footer>

      <DailyGoalModal 
        isOpen={isDailyGoalModalOpen} 
        onClose={() => setIsDailyGoalModalOpen(false)} 
        progress={progress} 
        onUpdateGoal={(newGoal) => updateProgress({ dailyGoalXp: newGoal })} 
      />

      <LanguageSettingsModal
        isOpen={isLanguageModalOpen}
        onClose={() => setIsLanguageModalOpen(false)}
        progress={progress}
        onUpdateProgress={updateProgress}
      />

      <LevelAssessmentModal
        isOpen={isLoaded && !progress.assessedLevel && isFirstTimeUser && (authUser !== null || isGuestMode)}
        onSelectLevel={(level) => updateProgress({ assessedLevel: level })}
        onSkip={() => updateProgress({ assessedLevel: 'A1' })}
      />
    </div>
  );
}

// Simple BrainCircuit fallback icon definition if importing directly needs backup
function BrainCircuit(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={props.className}
      viewBox="0 0 24 24"
    >
      <path d="M12 2v8" />
      <path d="M12 2c-3.3 0-6 2.7-6 6v2c0 2 1.8 3.5 3.5 4.5l.5.5V17c0 .6.4 1 1 1h2c.6 0 1-.4 1-1v-2l.5-.5c1.7-1 3.5-2.5 3.5-4.5V8c0-3.3-2.7-6-6-6Z" />
      <path d="M11 22h2" />
      <path d="M9 18h6" />
      <circle cx="12" cy="10" r="1" />
    </svg>
  );
}


