import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, 
  BookOpen, 
  Volume2, 
  Play, 
  Pause, 
  RotateCcw, 
  BrainCircuit, 
  CheckCircle, 
  Sparkles, 
  Mic, 
  Square, 
  Volume1, 
  ThumbsUp, 
  HelpCircle, 
  Heart, 
  Send,
  Languages,
  AlertCircle,
  TrendingUp,
  Award,
  Trophy,
  CheckCircle2,
  Crown
} from 'lucide-react';
import { Scenario, ScenarioContent, UserProgress, ChatMessage, VocabularyItem } from '../types';
import { BADGES } from '../data/badges';
import confetti from 'canvas-confetti';
import AdBanner from './AdBanner';
import { getLanguageFlag } from './Library';

interface ScenarioLearnerProps {
  scenario: Scenario;
  progress: UserProgress;
  onBack: () => void;
  onUpdateProgress: (updated: Partial<UserProgress>) => void;
}

type ActiveTab = 'reading' | 'listening' | 'translation' | 'vocabulary' | 'quiz' | 'speaking' | 'chat';

const LANGUAGE_FACTS: Record<string, string[]> = {
  English: [
    "Fact: English is the most spoken language in the world when counting both native and non-native speakers.",
    "Fact: English has adopted words from hundreds of other languages, giving it an incredibly diverse vocabulary.",
    "Fact: There is no official language at the federal level in the United States, although English is the most common.",
    "Fact: The longest word in the English dictionary without a vowel is 'rhythms'.",
    "Fact: English is the language of the sky – all international pilots must speak English to communicate with air traffic control."
  ],
  Romanian: [
    "Fact: Romanian is a Romance language, closely related to Italian, French, Spanish, and Portuguese, sharing over 70% lexical similarity with Italian!",
    "Fact: Bucharest was nicknamed 'Little Paris' (Micul Paris) due to its gorgeous French-inspired neoclassical architecture and active café culture.",
    "Fact: 'Dor' is a unique Romanian word that doesn't translate directly; it describes a deep, bitter-sweet mixture of longing, missing, and nostalgia.",
    "Fact: The Romanian pretzels ('covrigi') date back centuries, and hot bakeries (patiserii) are found on almost every street corner.",
    "Fact: Sarmale (stuffed cabbage rolls) are the pride of Romanian custom dinners and are usually slow-cooked for hours in clay pots.",
    "Fact: Romanian is phonetic—words are pronounced exactly as they are written once you know the core vowels and diphthongs."
  ],
  Dutch: [
    "Fact: Dutch is a Germanic language, sitting linguistically right between English and German, making written Dutch remarkably easy for English speakers!",
    "Fact: The Netherlands has more bicycles than residents, with over 35,000 km of dedicated cycling paths across the country.",
    "Fact: 'Gezellig' is an incredibly popular Dutch word signifying cozy, warm, social, or friendly vibes, with no literal English translation.",
    "Fact: Standard Dutch has 15 distinct vowel sounds, which is why correct mouth positioning is highly praised by native speakers.",
    "Fact: Dutch directness ('poldermodel' culture) means speaking clearly and straight to the point is highly valued and expected!"
  ],
  Spanish: [
    "Fact: Spanish is the second most spoken native language in the entire world, spanning 21 countries across multiple continents!",
    "Fact: Spanish is highly phonetic. Once you master the five pure, single-sound vowels (A, E, I, O, U), your speech will immediately sound native.",
    "Fact: In Spanish, upside-down punctuation marks like '¿' and '¡' are used to indicate the tone of a sentence before you even start reading it.",
    "Fact: 'Sobremesa' is a famous Spanish cultural word referring to the golden custom of staying at the dinner table to chat long after eating.",
    "Fact: Spanish is a Romance language derived from spoken Latin, inheriting rich conjugations and deep structural similarities with Italian and French."
  ],
  German: [
    "Fact: German is famous for its 'compound words'—creating long, specific terms like 'Schadenfreude' or 'Kummerspeck' to describe highly precise feelings.",
    "Fact: German is the official language of six European nations and has three grammatical genders (masculine, feminine, and neuter).",
    "Fact: Many English words like 'kindergarten', 'delicatessen', and 'angst' are borrowed straight from standard German vocabulary.",
    "Fact: German dialects vary widely—while 'Hochdeutsch' is the standard style taught in colleges, regional speech styles add beautiful flavor!"
  ],
  French: [
    "Fact: French was the official code of international diplomacy for centuries and remains a primary working language of global institutions like the UN.",
    "Fact: French has silent letters at the ends of many words (like 'silent -e' or plural '-s'), which makes linking spoken words ('liaison') flow beautifully.",
    "Fact: Around 30% of all English words trace their origin back to French or Norman roots, from culinary terms to legal structures.",
    "Fact: The French Academy (Académie Française) has regulated and preserved the purity of the French language since 1635!"
  ],
  Italian: [
    "Fact: Standard Italian is based on the Tuscan dialect, popularized by legendary poets like Dante Alighieri in his epic 'Divine Comedy'.",
    "Fact: Italian has one of the highest lexical similarities with Latin, preserving pure vowels and musical cadence patterns.",
    "Fact: Gestures are an essential dialect of Italian communication; researchers estimate there are over 250 distinct daily hand signs!",
    "Fact: 'Allora' is the ultimate Italian conversational bridge word, translating to 'so', 'then', or 'well' depending on how you stress it."
  ],
  Japanese: [
    "Fact: Japanese uses three distinct writing systems: Hiragana for native words, Katakana for foreign imports, and Kanji for deep Chinese characters.",
    "Fact: Japanese levels of politeness ('Keigo') are baked directly into grammar, changing verb conjugations depending on who you speak with.",
    "Fact: Japanese is a mora-timed language, meaning every syllable gets exactly the same length of beat, creating a beautiful musical flow.",
    "Fact: The word 'Tsundoku' describes the charming habit of buying books, leaving them piled up, and letting them accumulate unread."
  ],
  Portuguese: [
    "Fact: Portuguese is spoken by over 250 million people, making it the most spoken language in the Southern Hemisphere!",
    "Fact: Portuguese nasal diphthongs (such as 'ão' or 'ões') are produced by releasing air through both the nose and mouth simultaneously.",
    "Fact: Portuguese is closely related to Spanish, but its pronunciation contains much richer sibilant sounds, resembling Slavic phonology.",
    "Fact: 'Saudade' is a beautiful, melancholic Portuguese concept describing a deep emotional state of nostalgic longing for a beloved person or place."
  ]
};

export default function ScenarioLearner({ 
  scenario, 
  progress, 
  onBack, 
  onUpdateProgress 
}: ScenarioLearnerProps) {
  const [activeTab, setActiveTab] = useState<ActiveTab>('reading');
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState<ScenarioContent | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [factIndex, setFactIndex] = useState(0);

  // --- Parallel Options states ---
  const [showParallel, setShowParallel] = useState(true);

  // --- Voice / Synthesis States ---
  const [isPlayingText, setIsPlayingText] = useState(false);
  const [ttsRate, setTtsRate] = useState<number>(1.0);

  // --- Flashcard States ---
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [vocabStudied, setVocabStudied] = useState<Record<string, number>>({}); // vocab key relative box count

  // --- Quiz States ---
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState<number | null>(null);
  const [quizQuestionIdx, setQuizQuestionIdx] = useState(0);
  const [currentQuestionChecked, setCurrentQuestionChecked] = useState(false);

  // --- Speaking / Micro States ---
  const [selectedSpeakingIdx, setSelectedSpeakingIdx] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedBlobUrl, setRecordedBlobUrl] = useState<string | null>(null);
  const [speakingFeedback, setSpeakingFeedback] = useState<any | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // --- Speech Recognition Refs/States ---
  const [speechTranscript, setSpeechTranscript] = useState<string>('');
  const [isListeningSpeech, setIsListeningSpeech] = useState(false);
  const recognitionRef = useRef<any>(null);
  const transcriptRef = useRef<string>('');

  // --- Translation Challenge States ---
  const [activeTranslationIdx, setActiveTranslationIdx] = useState(0);
  const [userTranslationText, setUserTranslationText] = useState('');
  const [isTranslationSubmitted, setIsTranslationSubmitted] = useState(false);
  const [translationScore, setTranslationScore] = useState<number>(0);
  const [translationFeedback, setTranslationFeedback] = useState<string>('');

  // --- Chat States ---
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [userInputChat, setUserInputChat] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement | null>(null);

  // --- Celebration success states ---
  const [showCelebrationModal, setShowCelebrationModal] = useState(false);
  const [earnedXp, setEarnedXp] = useState(0);
  const [newlyUnlockedBadge, setNewlyUnlockedBadge] = useState<any | null>(null);

  // Rotate interesting facts while downloading AI assets
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (loading) {
      const activeFacts = LANGUAGE_FACTS[progress.targetLanguage || "Romanian"] || LANGUAGE_FACTS["Romanian"];
      interval = setInterval(() => {
        setFactIndex((prev) => (prev + 1) % activeFacts.length);
      }, 3500);
    }
    return () => clearInterval(interval);
  }, [loading, progress.targetLanguage]);

  // Fetch full details of scenarios from our server
  useEffect(() => {
    const fetchContent = async () => {
      setLoading(true);
      setErrorMessage(null);
      const targetLng = progress.targetLanguage || "Romanian";
      const sourceLng = progress.sourceLanguage || "English";
      try {
        const response = await fetch(`/api/scenario/${scenario.id}?targetLanguage=${encodeURIComponent(targetLng)}&sourceLanguage=${encodeURIComponent(sourceLng)}`);
        if (!response.ok) {
          throw new Error(`Server returned status ${response.status}`);
        }
        const data = await response.json();
        if (data.error) {
          throw new Error(data.error);
        }
        setContent(data.content);
        
        // Initializing chat with warm introduction in chosen language combo
        const welcomeText = `Hello! I'm Niran, your virtual language tutor. 🎓\nLet's practice a real conversation about: **"${scenario.title}"**. Try chatting with me in **${targetLng}** – I will formulate helpful replies and provide gentle spelling or grammar corrections in **${sourceLng}**! How would you like to start?`;
        setChatMessages([
          { sender: 'ai', text: welcomeText, timestamp: new Date().toLocaleTimeString(), englishTranslation: `Welcome! Let's practice ${targetLng} together.` }
        ]);

        // Add this to User's "In Progress" scenarios if not completed
        if (!progress.completedScenarios.includes(scenario.id) && !progress.inProgressScenarios.includes(scenario.id)) {
          const currentInProgress = [...progress.inProgressScenarios, scenario.id];
          onUpdateProgress({ inProgressScenarios: currentInProgress });
        }

      } catch (err: any) {
        setErrorMessage(err.message || "Failed to load scenario details. Please confirm API configuration.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchContent();
  }, [scenario.id]);

  // Scroll chat screen down on responses
  useEffect(() => {
    if (chatBottomRef.current) {
      chatBottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, chatLoading]);

  // --- Local SpeechSynthesis logic ---
  const handleTtsSpeak = (textToSpeak: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      const voices = window.speechSynthesis.getVoices();
      
      const targetLng = progress.targetLanguage || "Romanian";
      let langCode = 'ro-RO';
      let searchPrefix = 'ro';
      
      const lowerLng = targetLng.toLowerCase();
      if (lowerLng.includes('dutch') || lowerLng.includes('nederlands')) {
        langCode = 'nl-NL';
        searchPrefix = 'nl';
      } else if (lowerLng.includes('spanish') || lowerLng.includes('español')) {
        langCode = 'es-ES';
        searchPrefix = 'es';
      } else if (lowerLng.includes('german') || lowerLng.includes('deutsch')) {
        langCode = 'de-DE';
        searchPrefix = 'de';
      } else if (lowerLng.includes('french') || lowerLng.includes('français')) {
        langCode = 'fr-FR';
        searchPrefix = 'fr';
      } else if (lowerLng.includes('italian') || lowerLng.includes('italiano')) {
        langCode = 'it-IT';
        searchPrefix = 'it';
      } else if (lowerLng.includes('japanese') || lowerLng.includes('日本語')) {
        langCode = 'ja-JP';
        searchPrefix = 'ja';
      } else if (lowerLng.includes('portuguese') || lowerLng.includes('português')) {
        langCode = 'pt-PT';
        searchPrefix = 'pt';
      }
      
      const targetVoice = voices.find(v => v.lang.toLowerCase().startsWith(searchPrefix));
      if (targetVoice) {
        utterance.voice = targetVoice;
      } else {
        utterance.lang = langCode;
      }
      utterance.rate = ttsRate;
      utterance.onend = () => setIsPlayingText(false);
      utterance.onerror = () => setIsPlayingText(false);
      
      setIsPlayingText(true);
      window.speechSynthesis.speak(utterance);
    } else {
      alert("Text-to-speech option not active in this browser.");
    }
  };

  const handleTtsStop = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsPlayingText(false);
  };

  // Ensure speech synthesis ceases when tab changes
  useEffect(() => {
    handleTtsStop();
  }, [activeTab]);

  // --- Flashcard SRS feedback logic (Leitner implementation) ---
  const handleBoxReview = (vocab: VocabularyItem, difficulty: 'hard' | 'good' | 'easy') => {
    setIsFlipped(false);
    
    // Leitner system: Easy moves up a box (1 to 5), Hard drops back to box 1, Good stays same or increments gently
    let currentBox = vocabStudied[vocab.romanian] || 1;
    let newBox = currentBox;
    
    if (difficulty === 'hard') newBox = 1;
    else if (difficulty === 'good') newBox = Math.min(5, currentBox + 1);
    else if (difficulty === 'easy') newBox = Math.min(5, currentBox + 2);

    setVocabStudied(prev => ({ ...prev, [vocab.romanian]: newBox }));

    // Prepare Flashcard structure for SRS tracking list
    const existingFlashIndex = progress.flashcards.findIndex(f => f.romanian === vocab.romanian);
    let updatedFlashcards = [...progress.flashcards];
    
    // Schedule next review date (days based on box: box 1: 1 day, box 2: 3 days, box 3: 7 days, box 4: 14 days, box 5: 30 days)
    const multiplyDays = [1, 3, 7, 14, 30];
    const reviewInDays = multiplyDays[newBox - 1];
    const reviewDate = new Date();
    reviewDate.setDate(reviewDate.getDate() + reviewInDays);

    const newSrsCard = {
      id: `${scenario.id}-${vocab.romanian}`,
      romanian: vocab.romanian,
      english: vocab.english,
      context: vocab.context,
      contextTranslation: vocab.contextTranslation,
      box: newBox,
      nextReviewDate: reviewDate.toISOString()
    };

    if (existingFlashIndex >= 0) {
      updatedFlashcards[existingFlashIndex] = newSrsCard;
    } else {
      updatedFlashcards.push(newSrsCard);
    }

    // Award +2 XP for review study
    const newXP = progress.xp + 2;
    const dailyXp = progress.dailyXpGained + 2;
    
    // Check Vocab Champion Badge
    let updatedBadges = [...progress.badges];
    if (updatedFlashcards.length >= 10 && !updatedBadges.includes('vocab_champion')) {
      updatedBadges.push('vocab_champion');
    }

    onUpdateProgress({
      xp: newXP,
      dailyXpGained: dailyXp,
      flashcards: updatedFlashcards,
      badges: updatedBadges
    });

    // Move to next card
    if (content && activeCardIndex < content.vocabulary.length - 1) {
      setTimeout(() => {
        setActiveCardIndex(prev => prev + 1);
      }, 200);
    } else {
      alert("Felicitări! You completed reviewing the flashcards for this scenario. They have been added to your SRS space!");
      setActiveCardIndex(0);
    }
  };

  // --- Quiz Grading logic ---
  const handleOptionSelect = (qId: string, optIndex: number) => {
    if (quizSubmitted) return;
    setQuizAnswers(prev => ({ ...prev, [qId]: optIndex }));
  };

  const handleQuizSubmit = () => {
    if (!content) return;
    
    let correctCount = 0;
    content.quiz.forEach((q) => {
      if (quizAnswers[q.id] === q.correctAnswerIndex) {
        correctCount++;
      }
    });

    setQuizScore(correctCount);
    setQuizSubmitted(true);

    // Reward XP (+15 XP for completing quiz, plus additional +15 XP for flawless score)
    const baseReward = 15;
    const flawlessBonus = correctCount === content.quiz.length ? 15 : 0;
    const totalXpEarned = baseReward + flawlessBonus;

    let updatedCompleted = [...progress.completedScenarios];
    if (!updatedCompleted.includes(scenario.id)) {
      updatedCompleted.push(scenario.id);
    }
    
    // Calculate category milestones for badges
    let updatedBadges = [...progress.badges];
    
    // 1. Check Food Master badge
    const foodAndDiningScenariosIds = ["sc-2", "sc-3", "sc-11", "sc-23", "sc-45", "sc-56"];
    const finishedFoodScenarios = updatedCompleted.filter(id => foodAndDiningScenariosIds.includes(id));
    if (finishedFoodScenarios.length >= 3 && !updatedBadges.includes('food_master')) {
      updatedBadges.push('food_master');
    }

    // 2. Check Mountain Explorer badge
    const travelScenariosIds = ["sc-6", "sc-8", "sc-13", "sc-35", "sc-42", "sc-54", "sc-75"];
    const finishedTravelScenarios = updatedCompleted.filter(id => travelScenariosIds.includes(id));
    if (finishedTravelScenarios.length >= 3 && !updatedBadges.includes('mountain_explorer')) {
      updatedBadges.push('mountain_explorer');
    }

    // 3. CEFR Level up badge
    const a2ScenariosCompleted = updatedCompleted.filter(id => {
      const parent = id.split("-")[1];
      const sNum = parseInt(parent);
      return sNum > 25 && sNum <= 50;
    });
    if (a2ScenariosCompleted.length >= 5 && !updatedBadges.includes('cefr_level_up')) {
      updatedBadges.push('cefr_level_up');
    }

    // Identify newly unlocked badges
    const newlyEarnedId = updatedBadges.find(bId => !progress.badges.includes(bId));
    const badgeObj = newlyEarnedId ? BADGES.find(b => b.id === newlyEarnedId) : null;

    setEarnedXp(totalXpEarned);
    setNewlyUnlockedBadge(badgeObj || null);
    setShowCelebrationModal(true);

    // Blast high-fidelity confetti waves!
    try {
      confetti({
        particleCount: 140,
        spread: 80,
        origin: { y: 0.6 }
      });
      setTimeout(() => {
        confetti({
          particleCount: 90,
          spread: 110,
          origin: { y: 0.65 }
        });
      }, 250);
    } catch (e) {
      console.warn("Confetti asset loading bypassed", e);
    }

    onUpdateProgress({
      xp: progress.xp + totalXpEarned,
      dailyXpGained: progress.dailyXpGained + totalXpEarned,
      completedScenarios: updatedCompleted,
      badges: updatedBadges,
      // Remove from inProgress as it is complete
      inProgressScenarios: progress.inProgressScenarios.filter(id => id !== scenario.id)
    });
  };

  const handleResetQuiz = () => {
    setQuizAnswers({});
    setQuizSubmitted(false);
    setQuizScore(null);
    setQuizQuestionIdx(0);
    setCurrentQuestionChecked(false);
  };

  // --- Translation Challenge Handlers ---
  const handleVerifyTranslation = () => {
    if (!content) return;
    const currentParagraph = content.paragraphs[activeTranslationIdx];
    const targetText = currentParagraph.romanian;
    
    // Evaluate correctness using a simple word-based similarity score
    const cleanWord = (w: string) => w.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?]/g, "").trim();
    const correctWords = targetText.split(/\s+/).map(cleanWord).filter(Boolean);
    const userWords = userTranslationText.split(/\s+/).map(cleanWord).filter(Boolean);
    
    let matchesCount = 0;
    correctWords.forEach(word => {
      if (userWords.includes(word)) {
        matchesCount++;
      }
    });
    
    const calculatedScore = correctWords.length > 0 
      ? Math.round((matchesCount / correctWords.length) * 100) 
      : 105;
      
    const scoreToSet = Math.min(100, calculatedScore);
    setTranslationScore(scoreToSet);
    setIsTranslationSubmitted(true);
    
    let critiqueText = "";
    if (scoreToSet === 100) {
      critiqueText = "Spectacular! Flawless translation matching the source paragraph exactly. Excellent grammatical casing and vocabulary selection!";
      
      // Trigger canvas-confetti on perfect translation for extra joy!
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.8 }
        });
      } catch (e) {}
    } else if (scoreToSet >= 80) {
      critiqueText = "Fantastic translation! Minor vocabulary or word ordering variations, but you fully captured the meaning and structure perfectly.";
    } else if (scoreToSet >= 50) {
      critiqueText = "Good effort! You got several words correct. Pay attention to the definite/indefinite noun endings and overall verb conjugations.";
    } else {
      critiqueText = "A courageous try! Review the parallel reading module to see how verbs are structured in the target language.";
    }
    
    setTranslationFeedback(critiqueText);
    
    // Update progress with XP
    const earnedTranslationXp = Math.max(3, Math.round((scoreToSet / 100) * 12));
    onUpdateProgress({
      xp: progress.xp + earnedTranslationXp,
      dailyXpGained: progress.dailyXpGained + earnedTranslationXp
    });
  };

  const handleNextTranslation = () => {
    if (!content) return;
    if (activeTranslationIdx < content.paragraphs.length - 1) {
      setActiveTranslationIdx(prev => prev + 1);
      setUserTranslationText('');
      setIsTranslationSubmitted(false);
      setTranslationScore(0);
      setTranslationFeedback('');
    } else {
      alert("Felicitări! You completed the translation challenge for all paragraphs in this scenario!");
      setActiveTranslationIdx(0);
      setUserTranslationText('');
      setIsTranslationSubmitted(false);
      setTranslationScore(0);
      setTranslationFeedback('');
      setActiveTab('quiz'); // Direct them nicely to the quiz
    }
  };

  // --- Speaking / Micro Recording utilities ---
  const handleStartRecording = async () => {
    setRecordedBlobUrl(null);
    setSpeakingFeedback(null);
    setSpeechTranscript("");
    transcriptRef.current = "";
    audioChunksRef.current = [];

    // Initialize Web Speech Recognition if available
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;

        const targetLng = progress.targetLanguage || "Romanian";
        let langCode = 'ro-RO';
        const lowerLng = targetLng.toLowerCase();
        if (lowerLng.includes('dutch') || lowerLng.includes('nederlands')) langCode = 'nl-NL';
        else if (lowerLng.includes('spanish') || lowerLng.includes('español')) langCode = 'es-ES';
        else if (lowerLng.includes('german') || lowerLng.includes('deutsch')) langCode = 'de-DE';
        else if (lowerLng.includes('french') || lowerLng.includes('français')) langCode = 'fr-FR';
        else if (lowerLng.includes('italian') || lowerLng.includes('italiano')) langCode = 'it-IT';
        else if (lowerLng.includes('japanese') || lowerLng.includes('日本語')) langCode = 'ja-JP';
        else if (lowerLng.includes('portuguese') || lowerLng.includes('português')) langCode = 'pt-PT';
        recognition.lang = langCode;

        recognition.onresult = (event: any) => {
          let interimTranscript = '';
          let finalTranscript = '';
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
              finalTranscript += event.results[i][0].transcript;
            } else {
              interimTranscript += event.results[i][0].transcript;
            }
          }
          const fullTranscript = (finalTranscript || interimTranscript).trim();
          setSpeechTranscript(fullTranscript);
          transcriptRef.current = fullTranscript;
        };

        recognition.onerror = (event: any) => {
          console.warn("Speech recognition error:", event.error);
        };

        recognition.onend = () => {
          setIsListeningSpeech(false);
        };

        recognitionRef.current = recognition;
        recognition.start();
        setIsListeningSpeech(true);
      } catch (e) {
        console.warn("SpeechRecognition start error:", e);
      }
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const url = URL.createObjectURL(audioBlob);
        setRecordedBlobUrl(url);
        
        // Use the recorded or transcribed values to calculate the feedback
        const currentSentence = content?.paragraphs[selectedSpeakingIdx]?.romanian || "";
        calculateSpeakingFeedback(currentSentence);
        
        // Stop all track indicators
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Microphone access declined or unavailable:", err);
      // Simulate fallback recording if standard hardware unavailable (for client-safe testing)
      setIsRecording(true);
      setTimeout(() => {
        setIsRecording(false);
        const currentSentence = content?.paragraphs[selectedSpeakingIdx]?.romanian || "";
        calculateSpeakingFeedback(currentSentence, "unsupported_simulate");
      }, 3000);
    }
  };

  const handleStopRecording = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
    }
    setIsListeningSpeech(false);

    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
  };

  const calculateSpeakingFeedback = (romanianSentence: string, forceMode?: string) => {
    const targetLng = progress.targetLanguage || "Romanian";
    
    // Check if we are simulating because of hardware constraints
    let transcriptToUse = transcriptRef.current.trim();
    let isMockFallback = false;

    if (forceMode === "unsupported_simulate" || (!transcriptToUse && !((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition))) {
      // Create a simulated real-time transcript matching the user sentence for previewing
      transcriptToUse = romanianSentence;
      isMockFallback = true;
    }

    if (!transcriptToUse && !isMockFallback) {
      setSpeakingFeedback({
        score: 0,
        fluency: "0%",
        accuracy: "0%",
        transcript: "",
        critique: "No speech recognized. Please make sure your microphone is working and speak clearly into it!"
      });
      return;
    }

    // Dynamic word-by-word comparison score
    const cleanStr = (s: string) => s.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?]/g, "").trim();
    const expectedClean = cleanStr(romanianSentence);
    const actualClean = cleanStr(transcriptToUse);

    const expectedWords = expectedClean.split(/\s+/).filter(Boolean);
    const actualWords = actualClean.split(/\s+/).filter(Boolean);

    let matchesCount = 0;
    expectedWords.forEach(word => {
      if (actualWords.includes(word)) {
        matchesCount++;
      }
    });

    const score = expectedWords.length > 0 
      ? Math.round((matchesCount / expectedWords.length) * 100) 
      : 100;

    let advice = "";
    const lowerLng = targetLng.toLowerCase();
    
    if (isMockFallback) {
      advice = `[Simulated Microphone Demo Mode] Rhythm and pronunciation are graded at 95%! `;
    } else {
      if (score >= 85) {
        advice = `Brilliant pronunciation! We transcribed exactly what you said with ${score}% match. Your pitch and phonemic stress are extremely accurate. Keep it up!`;
      } else if (score >= 60) {
        advice = `Splendid effort! We transcribed "${transcriptToUse}". You matched ${score}% of the target sentence. Try slowing down slightly on vowels for better phonetic calibration.`;
      } else {
        advice = `Good attempt! We transcribed "${transcriptToUse}". You matched ${score}% of the target words. Romanian vowels are short and clear—ensure you are speaking clearly close to the microphone.`;
      }
    }

    if (lowerLng.includes('romanian')) {
      const hasSpecialI = romanianSentence.toLowerCase().includes('bucin') || romanianSentence.toLowerCase().includes('ști') || romanianSentence.toLowerCase().includes('veci');
      const hasAHigh = romanianSentence.toLowerCase().includes('mă') || romanianSentence.toLowerCase().includes('pâine') || romanianSentence.toLowerCase().includes('sarmale');
      
      if (hasSpecialI && score < 90) {
        advice += " Watch the final soft 'i' in Romanian (e.g. 'București'). It is a quiet whisper of air (palatalized), not a full vowel 'ee'.";
      } else if (hasAHigh && score < 90) {
        advice += " Pay close attention to 'ă' (similar to 'a' in 'about') and 'â/î' (a deep guttural vowel similar to the 'u' in 'roses').";
      }
    } else if (lowerLng.includes('spanish') || lowerLng.includes('español')) {
      advice += " Ensure your vowels are crisp and try to lightly trill double 'rr' sounds.";
    }

    setSpeakingFeedback({
      score: score,
      fluency: `${Math.min(100, Math.round(score * 1.05))}%`,
      accuracy: `${score}%`,
      transcript: transcriptToUse,
      isMock: isMockFallback,
      critique: advice
    });

    // Provide XP speaking reward based on accuracy
    const earnedSpeechXp = Math.max(3, Math.round((score / 100) * 10));
    onUpdateProgress({
      xp: progress.xp + earnedSpeechXp,
      dailyXpGained: progress.dailyXpGained + earnedSpeechXp
    });
  };

  // --- Real-time Tutor Chat Action ---
  const handleSendChatMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!userInputChat.trim() || chatLoading) return;

    const userText = userInputChat.trim();
    setUserInputChat('');
    
    // Add user message to state
    const userMsg: ChatMessage = {
      sender: 'user',
      text: userText,
      timestamp: new Date().toLocaleTimeString()
    };
    
    const updatedMessages = [...chatMessages, userMsg];
    setChatMessages(updatedMessages);
    setChatLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          scenarioTitle: scenario.title,
          userLevel: scenario.level,
          messages: updatedMessages,
          targetLanguage: progress.targetLanguage || "Romanian",
          sourceLanguage: progress.sourceLanguage || "English"
        })
      });

      if (!response.ok) {
        throw new Error("Tutor AI server busy.");
      }

      const data = await response.json();
      
      const aiReply: ChatMessage = {
        sender: 'ai',
        text: data.text,
        correction: data.correction || undefined,
        englishTranslation: data.englishTranslation || undefined,
        timestamp: new Date().toLocaleTimeString()
      };

      setChatMessages(prev => [...prev, aiReply]);

      // Trigger gamified "Roleplay Hero" badge
      let updatedBadges = [...progress.badges];
      if (!updatedBadges.includes('roleplay_hero')) {
        updatedBadges.push('roleplay_hero');
      }

      // Add extra +5 XP for tutor communication
      onUpdateProgress({
        xp: progress.xp + 5,
        dailyXpGained: progress.dailyXpGained + 5,
        badges: updatedBadges
      });

    } catch (err: any) {
      const errorMsg: ChatMessage = {
        sender: 'ai',
        text: "Scuze, am întâmpinat o mică eroare tehnică la conexiunea cu serverul. Te rog să reîncerci! Let's continue.",
        timestamp: new Date().toLocaleTimeString(),
        englishTranslation: "Apologies, I encountered a minor server speed issue. Please send your message again!"
      };
      setChatMessages(prev => [...prev, errorMsg]);
    } finally {
      setChatLoading(false);
    }
  };

  if (loading) {
    const activeFactsList = LANGUAGE_FACTS[progress.targetLanguage || "Romanian"] || LANGUAGE_FACTS["Romanian"];
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center p-8 text-center space-y-6">
        <div className="relative">
          {/* Pulsing Loading concentric rings */}
          <div className="w-16 h-16 rounded-full border-4 border-teal-100 border-t-sky-500 animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center font-bold text-xs text-teal-600">AI</div>
        </div>
        
        <div className="space-y-2 max-w-sm">
          <h4 className="font-bold text-slate-800 text-lg">Assembling {progress.targetLanguage || "Romanian"} Unit...</h4>
          <p className="text-xs text-slate-400 font-mono">Querying Niran's database & model arrays</p>
        </div>

        {/* Fact box carousel */}
        <AnimatePresence mode="wait">
          <motion.div 
            key={factIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="p-4 bg-slate-50 rounded-2xl border border-slate-100 max-w-lg text-sm text-slate-600 leading-relaxed italic"
          >
            {activeFactsList[factIndex]}
          </motion.div>
        </AnimatePresence>
      </div>
    );
  }

  if (errorMessage || !content) {
    return (
      <div className="text-center p-8 bg-red-50/50 rounded-3xl border border-red-100 max-w-md mx-auto space-y-4 my-10">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
        <h3 className="text-lg font-bold text-red-800">Unit Import Interrupted</h3>
        <p className="text-sm text-slate-600 leading-relaxed">
          {errorMessage || "We had difficulty communicating with Gemini API services. Please verify your GEMINI_API_KEY inside Settings > Secrets."}
        </p>
        <button 
          onClick={onBack}
          className="px-5 py-2.5 bg-slate-805 text-white rounded-xl text-xs font-semibold hover:bg-slate-700 transition cursor-pointer"
        >
          &larr; Back to Library
        </button>
      </div>
    );
  }

  // Helper to highlight and render interactive vocabulary popovers in reading texts
  const renderInteractiveText = (text: string) => {
    if (!content || !content.vocabulary || content.vocabulary.length === 0) {
      return text;
    }

    // Sort terms by length descending to match larger composite terms first
    const sortedVocab = [...content.vocabulary].sort((a, b) => b.romanian.length - a.romanian.length);
    const escapedTerms = sortedVocab.map(v => v.romanian.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'));
    
    // Exact word transitions pattern mapping target vocab
    const pattern = new RegExp(`\\b(${escapedTerms.join('|')})\\b`, 'gi');
    const parts = text.split(pattern);

    if (parts.length <= 1) {
      return text;
    }

    return parts.map((part, idx) => {
      const matchedVocab = content.vocabulary.find(
        v => v.romanian.toLowerCase() === part.toLowerCase()
      );

      if (matchedVocab) {
        return (
          <span 
            key={idx}
            className="relative inline-block group"
          >
            <span className="cursor-help border-b-2 border-dashed border-indigo-400 font-bold text-indigo-750 bg-indigo-50/50 px-1 py-0.5 rounded-sm hover:bg-indigo-100/70 transition-colors">
              {part}
            </span>
            {/* Elegant tooltips */}
            <span className="pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200 absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-slate-900 border border-slate-800 text-white text-[11px] rounded-xl p-3 shadow-xl z-50 w-56 leading-relaxed whitespace-normal font-sans text-center">
              <span className="font-extrabold text-amber-400 block pb-0.5 uppercase tracking-wider text-[9px] font-mono">Glossary Word</span>
              <span className="font-bold text-[13px]">{matchedVocab.romanian}</span> &rarr; <span className="font-bold text-slate-100">{matchedVocab.english}</span>
              <span className="block text-[10px] text-slate-400 italic mt-1.5 border-t border-slate-800 pt-1 leading-normal">
                "{matchedVocab.contextTranslation}"
              </span>
              <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900"></span>
            </span>
          </span>
        );
      }

      return part;
    });
  };

  return (
    <div className="space-y-6">
      {/* Workspace Menu Bar / Back trigger */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4.5 rounded-3xl border border-slate-200/90 shadow-xs">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-indigo-600 hover:bg-slate-55 cursor-pointer uppercase tracking-wider font-mono bg-slate-50 hover:bg-slate-100 px-3.5 py-2 rounded-xl border border-slate-200/80 transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Exit Workspace
        </button>
        
        {/* Active Scenario Banner Info */}
        <div className="flex items-center gap-3">
          <div className="hidden xs:flex w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 items-center justify-center text-lg shadow-inner select-none">
            {getLanguageFlag(progress.targetLanguage)}
          </div>
          <div>
            <h3 className="font-bold text-slate-800 text-sm md:text-base leading-none font-display">
              {progress.targetLanguage && progress.targetLanguage !== 'Romanian' ? scenario.title : scenario.romanianTitle}
            </h3>
            <span className="text-xs text-slate-405 font-bold font-mono">
              {progress.targetLanguage && progress.targetLanguage !== 'Romanian' 
                ? `Learning ${progress.targetLanguage}` 
                : `${scenario.title}`} &bull; Difficulty <span className="text-indigo-600">{scenario.level}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Tabs list selector */}
      <div className="bg-slate-100/80 p-1.5 rounded-2xl border border-slate-200 flex overflow-x-auto gap-1 scrollbar-none select-none">
        {[
          { id: 'reading', label: '📖 Reading' },
          { id: 'listening', label: '🎧 Listening' },
          { id: 'translation', label: '✍️ Translation' },
          { id: 'vocabulary', label: '🧠 Flashcards (SRS)' },
          { id: 'quiz', label: '📝 Quiz' },
          { id: 'speaking', label: '🗣️ Speaking Practice' },
          { id: 'chat', label: '💬 AI Tutor Chat' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as ActiveTab)}
            className={`py-2 px-4 rounded-xl text-xs font-black whitespace-nowrap transition-all duration-150 shrink-0 cursor-pointer ${
              activeTab === tab.id 
                ? 'bg-white text-teal-600 shadow-sm border-b-2 border-teal-500 font-display' 
                : 'text-slate-550 hover:text-slate-800 hover:bg-white/40'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Workspace Area */}
      <div id="learning-workspace" className="bg-white rounded-3xl border border-slate-250 p-6 shadow-xs">
        <AnimatePresence mode="wait">
          
          {/* TAB: READING */}
          {activeTab === 'reading' && (
            <motion.div
              key="reading-tab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div className="flex justify-between items-center border-b border-slate-50 pb-3">
                <div className="space-y-1">
                  <h4 className="font-bold text-slate-800 text-lg">Dual-Language Reading Mode</h4>
                  <p className="text-xs text-slate-400">Read the scenario in traditional Romanian. Translate sentence structures side-by-side.</p>
                </div>
                <button
                  onClick={() => setShowParallel(!showParallel)}
                  className="flex items-center gap-1.5 text-xs font-semibold py-1.5 px-3 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 cursor-pointer"
                >
                  <Languages className="w-3.5 h-3.5" /> 
                  {showParallel ? "Hide English Parallel" : "Show English Parallel"}
                </button>
              </div>

              {/* Parallel Layout rendering */}
              <div className="space-y-6 max-w-4xl mx-auto">
                {content.paragraphs.map((par, i) => (
                  <div 
                    key={i} 
                    className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 hover:bg-slate-50/50 p-4 rounded-2xl transition border border-transparent hover:border-slate-100"
                  >
                    {/* Romanian text column */}
                    <div className="space-y-2">
                      <div className="flex items-start gap-2.5">
                        <button
                          onClick={() => handleTtsSpeak(par.romanian)}
                          className="mt-0.5 p-1.5 rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition cursor-pointer shrink-0"
                          title="Speak paragraph"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                        </button>
                        <p className="text-slate-800 font-medium leading-relaxed font-sans text-[15px] md:text-base">
                          {renderInteractiveText(par.romanian)}
                        </p>
                      </div>
                    </div>
                    
                    {/* English translation column */}
                    {showParallel && (
                      <div className="border-t border-slate-100 md:border-t-0 pt-3 md:pt-0 pl-0 md:pl-6 md:border-l border-slate-150 flex items-center justify-start text-[14px] text-slate-500 leading-relaxed">
                        {par.english}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* End of tab feedback */}
              <div className="flex justify-center pt-4 border-t border-slate-50">
                <button 
                  onClick={() => setActiveTab('listening')}
                  className="px-6 py-2.5 bg-indigo-600 text-white font-semibold rounded-xl text-xs hover:bg-indigo-700 transition flex items-center gap-1 cursor-pointer"
                >
                  Move to Listening Practice →
                </button>
              </div>
            </motion.div>
          )}

          {/* TAB: LISTENING */}
          {activeTab === 'listening' && (
            <motion.div
              key="listening-tab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6 max-w-xl mx-auto text-center"
            >
              <div className="space-y-2">
                <h4 className="font-bold text-slate-800 text-lg">Narrative Audio Coach</h4>
                <p className="text-xs text-slate-400">Play the full scenario to calibrate your auditory comprehension and speech pitch.</p>
              </div>

              {/* Animated visual tape recorder wheel element */}
              <div className="p-8 bg-slate-900 rounded-3xl text-white shadow-xl flex flex-col items-center justify-center space-y-6 min-h-[220px] relative overflow-hidden">
                <div className="absolute top-3 left-4 flex gap-1">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse"></div>
                  <span className="text-[9px] font-mono text-slate-400">HQ_STREAM</span>
                </div>

                <div className="flex items-center gap-8 py-4">
                  {/* CSS Rotating tapes */}
                  <div className={`w-14 h-14 rounded-full border-4 border-dashed border-slate-400 flex items-center justify-center ${isPlayingText ? 'animate-spin' : ''}`} style={{ animationDuration: '6s' }}>
                    <div className="w-4 h-4 rounded-full bg-slate-800"></div>
                  </div>
                  <div className="text-sm font-mono truncate max-w-[120px] tracking-widest text-slate-300">
                    {(progress.targetLanguage && progress.targetLanguage !== 'Romanian' ? scenario.title : scenario.romanianTitle).toUpperCase()}
                  </div>
                  <div className={`w-14 h-14 rounded-full border-4 border-dashed border-slate-400 flex items-center justify-center ${isPlayingText ? 'animate-spin' : ''}`} style={{ animationDuration: '6s' }}>
                    <div className="w-4 h-4 rounded-full bg-slate-800"></div>
                  </div>
                </div>

                {/* Simulated visual EQ bars */}
                <div className="flex justify-center items-end gap-1 h-8 w-28">
                  {Array.from({ length: 12 }).map((_, i) => (
                    <div 
                      key={i} 
                      className={`w-1.5 bg-yellow-400 rounded-full transition-all`} 
                      style={{ 
                        height: isPlayingText ? `${Math.floor(Math.random() * 24) + 6}px` : '4px',
                        transitionDuration: '150ms'
                      }}
                    ></div>
                  ))}
                </div>
              </div>

              {/* Speed controls & playbar triggers */}
              <div className="space-y-4">
                <div className="flex justify-center items-center gap-3">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Pronunciation Pace:</span>
                  <div className="flex gap-1.5 bg-slate-100 p-1 rounded-xl">
                    {([0.7, 1.0, 1.2] as const).map((rate) => (
                      <button
                        key={rate}
                        onClick={() => {
                          setTtsRate(rate);
                          if (isPlayingText) {
                            handleTtsSpeak(content.romanianText);
                          }
                        }}
                        className={`py-1 px-2.5 rounded-lg text-xs font-bold font-mono transition cursor-pointer ${
                          ttsRate === rate 
                            ? 'bg-white text-slate-800 shadow-xs' 
                            : 'text-slate-500 hover:text-slate-700'
                        }`}
                      >
                        {rate}x
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex justify-center gap-3">
                  {isPlayingText ? (
                    <button
                      onClick={handleTtsStop}
                      className="px-6 py-3 rounded-2xl bg-slate-800 text-white font-bold text-sm tracking-wide hover:bg-slate-700 flex items-center gap-2 cursor-pointer shadow-md"
                    >
                      <Pause className="w-4 h-4 fill-white" /> Pause Audio
                    </button>
                  ) : (
                    <button
                      onClick={() => handleTtsSpeak(content.romanianText)}
                      className="px-6 py-3 rounded-2xl bg-indigo-600 text-white font-bold text-sm tracking-wide hover:bg-indigo-700 flex items-center gap-2 cursor-pointer shadow-md shadow-indigo-200"
                    >
                      <Play className="w-4 h-4 fill-white animate-pulse" /> Play Narrative Study
                    </button>
                  )}
                  
                  <button
                    onClick={() => {
                      handleTtsStop();
                      setTimeout(() => handleTtsSpeak(content.romanianText), 150);
                    }}
                    className="p-3 bg-slate-100 rounded-2xl text-slate-600 hover:bg-slate-200 hover:text-slate-800 transition cursor-pointer"
                    title="Restart Speech"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* End of tab feedback */}
              <div className="flex justify-center pt-4 border-t border-slate-50">
                <button 
                  onClick={() => setActiveTab('translation')}
                  className="px-6 py-2.5 bg-indigo-600 text-white font-semibold rounded-xl text-xs hover:bg-indigo-700 transition flex items-center gap-1 cursor-pointer"
                >
                  Move to Translation Challenge →
                </button>
              </div>
            </motion.div>
          )}

          {/* TAB: TRANSLATION CHALLENGE */}
          {activeTab === 'translation' && (
            <motion.div
              key="translation-tab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6 max-w-2xl mx-auto"
            >
              <div className="text-center space-y-1">
                <h4 className="font-bold text-slate-800 text-lg">✍️ Composition Translation Challenge</h4>
                <p className="text-xs text-slate-400">Translate the English paragraph below into {progress.targetLanguage || "Romanian"} and submit to verify accuracy alignment!</p>
              </div>

              {/* Progress Tracker dots */}
              <div className="flex justify-center items-center gap-1.5 pb-2">
                {content.paragraphs.map((_, pIdx) => (
                  <button
                    key={pIdx}
                    onClick={() => {
                      setActiveTranslationIdx(pIdx);
                      setUserTranslationText('');
                      setIsTranslationSubmitted(false);
                      setTranslationScore(0);
                      setTranslationFeedback('');
                    }}
                    className={`h-2.5 rounded-full transition-all duration-200 ${
                      activeTranslationIdx === pIdx 
                        ? 'w-8 bg-teal-600' 
                        : pIdx < activeTranslationIdx 
                          ? 'w-2.5 bg-emerald-500' 
                          : 'w-2.5 bg-slate-200'
                    }`}
                    title={`Paragraph ${pIdx + 1}`}
                  />
                ))}
              </div>

              {/* English stimulus card */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2 text-left">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Source Text (English)</span>
                  <span className="text-[9px] bg-slate-200/80 text-slate-600 font-bold px-1.5 py-0.5 rounded-md font-mono">Paragraph {activeTranslationIdx + 1} of {content.paragraphs.length}</span>
                </div>
                <p className="text-slate-800 font-semibold text-sm sm:text-base leading-relaxed">
                  &ldquo;{content.paragraphs[activeTranslationIdx].english}&rdquo;
                </p>
              </div>

              {/* Typing inputs */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Your Translation ({progress.targetLanguage || "Romanian"}):</label>
                  {!isTranslationSubmitted && (
                    <button
                      type="button"
                      onClick={() => setUserTranslationText(content.paragraphs[activeTranslationIdx].romanian)}
                      className="text-[10px] text-teal-600 font-bold hover:underline cursor-pointer font-semibold"
                    >
                      💡 Peek answer
                    </button>
                  )}
                </div>
                
                <textarea
                  disabled={isTranslationSubmitted}
                  rows={4}
                  value={userTranslationText}
                  onChange={(e) => setUserTranslationText(e.target.value)}
                  placeholder={`Scrie în limba țintă... (e.g. translate the paragraph above)`}
                  className="w-full p-4 border-2 border-slate-200 rounded-2xl text-sm sm:text-base bg-slate-50/50 focus:outline-hidden focus:border-teal-500 focus:bg-white transition-all disabled:opacity-85 disabled:bg-slate-50 font-sans"
                />
              </div>

              {/* Evaluation Comparison Display */}
              {isTranslationSubmitted && (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-5 rounded-3xl border border-slate-200 bg-white shadow-xs space-y-4"
                >
                  <div className="flex items-center gap-2 text-xs font-bold text-teal-650 uppercase">
                    <Award className="w-4 h-4 text-teal-600" /> Composition Checkup
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">Lexical Match Score</span>
                      <h4 className="text-3xl font-black text-slate-800">{translationScore}%</h4>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">Accuracy Status</span>
                      <h4 className={`text-xl font-black uppercase font-mono ${translationScore >= 90 ? 'text-emerald-600' : translationScore >= 70 ? 'text-amber-600' : 'text-slate-600'}`}>
                        {translationScore === 100 ? 'Perfect ✨' : translationScore >= 80 ? 'Splendid 👍' : translationScore >= 50 ? 'Fair 📝' : 'Review 📖'}
                      </h4>
                    </div>
                  </div>

                  {/* Side by side comparison container */}
                  <div className="space-y-3.5 pt-1 text-left">
                    {/* User translation text */}
                    <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-150">
                      <span className="text-[9px] text-slate-400 font-mono block uppercase tracking-wider mb-1">Your Inputted Text:</span>
                      <p className="text-slate-700 text-xs sm:text-sm font-semibold italic leading-relaxed">&ldquo;{userTranslationText || "(Empty response)"}&rdquo;</p>
                    </div>

                    {/* Original target language */}
                    <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-150 space-y-1.5">
                      <span className="text-[9px] text-slate-400 font-mono block uppercase tracking-wider">Correct Original Text:</span>
                      <p className="text-slate-800 text-xs sm:text-sm font-semibold italic leading-relaxed">&ldquo;{content.paragraphs[activeTranslationIdx].romanian}&rdquo;</p>
                    </div>

                    {/* Highlights diff visual comparison */}
                    <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-150 space-y-1.5">
                      <span className="text-[9px] text-slate-400 font-mono block uppercase tracking-wider">Lexical Alignment Highlight:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {content.paragraphs[activeTranslationIdx].romanian.split(/\s+/).map((word, idx) => {
                          const cleanTargetWord = word.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?]/g, "").trim();
                          const userWordsClean = userTranslationText.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?]/g, "").split(/\s+/);
                          const isMatched = userWordsClean.includes(cleanTargetWord);
                          return (
                            <span 
                              key={idx} 
                              className={`px-1.5 py-0.5 rounded-lg text-xs font-bold transition ${
                                isMatched 
                                  ? 'text-emerald-700 bg-emerald-50 border border-emerald-150' 
                                  : 'text-rose-700 bg-rose-50 border border-rose-150 line-through'
                              }`}
                            >
                              {word}
                            </span>
                          );
                        })}
                      </div>
                      <span className="text-[9px] text-slate-400 font-mono block leading-normal pt-1">
                        * Words in <span className="text-emerald-600 font-extrabold font-mono">green</span> are correct matches. Words in <span className="text-rose-600 font-extrabold font-mono line-through">red</span> are missing/misspelled compared to standard.
                      </span>
                    </div>
                  </div>

                  <div className="p-4 bg-teal-50/40 rounded-2xl border border-teal-100 text-left">
                    <p className="text-slate-600 font-semibold text-xs leading-relaxed">
                      <span className="font-bold text-slate-800">Tutor Feedback:</span> {translationFeedback}
                    </p>
                  </div>
                </motion.div>
              )}

              {/* Action trigger buttons */}
              <div className="flex justify-end gap-3 pt-2">
                {!isTranslationSubmitted ? (
                  <button
                    disabled={!userTranslationText.trim()}
                    onClick={handleVerifyTranslation}
                    className={`px-8 py-3.5 rounded-2xl text-xs uppercase font-black tracking-widest font-mono transition shadow-xs cursor-pointer ${
                      userTranslationText.trim()
                        ? 'bg-teal-600 hover:bg-teal-700 text-white'
                        : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    Check Translation
                  </button>
                ) : (
                  <button
                    onClick={handleNextTranslation}
                    className="px-8 py-3.5 bg-teal-600 hover:bg-teal-700 text-white rounded-2xl text-xs uppercase font-black tracking-widest font-mono transition shadow-md shadow-teal-100 cursor-pointer"
                  >
                    {activeTranslationIdx < content.paragraphs.length - 1 ? 'Continue Paragraph' : 'Complete Challenge'}
                  </button>
                )}
              </div>
            </motion.div>
          )}

          {/* TAB: VOCABULARY */}
          {activeTab === 'vocabulary' && (
            <motion.div
              key="vocabulary-tab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div className="space-y-1 text-center">
                <h4 className="font-bold text-slate-800 text-lg">Smart Vocabulary Flashcards</h4>
                <p className="text-xs text-slate-400">Memorize keywords directly extracted from the text, integrated with Leitner box schedules.</p>
              </div>

              {/* Carousel card flipper frame */}
              <div className="max-w-md mx-auto space-y-6">
                
                {/* Active Card Index bar */}
                <div className="flex justify-between items-center text-xs text-slate-400 font-mono px-1">
                  <span>Vocabulary Item {activeCardIndex + 1} of {content.vocabulary.length}</span>
                  <span className="font-semibold text-purple-600 uppercase">
                    Box {vocabStudied[content.vocabulary[activeCardIndex].romanian] || 1} Memory
                  </span>
                </div>

                {/* Real interactive flipping canvas card with 3D animation */}
                <div className="perspective-1000 min-h-[250px] w-full">
                  <div 
                    id="srs-flipping-card"
                    onClick={() => setIsFlipped(!isFlipped)}
                    className={`relative w-full min-h-[260px] transition-transform duration-500 preserve-3d cursor-pointer ${
                      isFlipped ? 'rotate-y-180' : ''
                    }`}
                  >
                    {/* CARD FRONT: Romanian */}
                    <div className="absolute inset-0 w-full h-full rounded-3xl bg-linear-to-br from-indigo-50/20 to-purple-50/20 border-2 border-purple-100/70 p-6 flex flex-col justify-between shadow-xs hover:border-purple-300 transition-colors backface-hidden">
                      <div className="absolute top-4 right-4 text-purple-400">
                        <BrainCircuit className="w-5 h-5" />
                      </div>
                      <div className="flex-1 flex flex-col justify-center items-center text-center space-y-3 pt-4">
                        <span className="text-[10px] text-indigo-600 font-black uppercase tracking-widest font-mono bg-indigo-50/80 px-2.5 py-0.5 rounded-full">Romanian</span>
                        <h4 className="text-3xl font-extrabold text-slate-800 tracking-tight font-display">
                          {content.vocabulary[activeCardIndex].romanian}
                        </h4>
                        <span className="text-slate-400 text-xs font-bold animate-pulse mt-1">(Click to reveal meaning)</span>
                      </div>
                      {/* Visual trigger reminder */}
                      <div className="text-center text-[10px] text-slate-400 font-mono pt-4 border-t border-purple-100/40 select-none">
                        Tap To Flip Card
                      </div>
                    </div>

                    {/* CARD BACK: Translation & Context usage */}
                    <div className="absolute inset-0 w-full h-full rounded-3xl bg-white border-2 border-purple-200 p-6 flex flex-col justify-between shadow-xs hover:border-purple-300 transition-colors backface-hidden rotate-y-180">
                      <div className="absolute top-4 right-4 text-purple-450">
                        <Sparkles className="w-5 h-5" />
                      </div>
                      <div className="flex-1 flex flex-col justify-between space-y-3 pt-1">
                        <div className="text-center space-y-1 select-none">
                          <span className="text-[10px] text-purple-650 font-black uppercase tracking-widest font-mono bg-purple-50 px-2.5 py-0.5 rounded-full inline-block">English Translation</span>
                          <h4 className="text-xl font-extrabold text-slate-800 leading-tight">
                            {content.vocabulary[activeCardIndex].english}
                          </h4>
                        </div>

                        <div className="p-3 bg-slate-50 border border-slate-100 rounded-2xl text-[11px] space-y-1 leading-snug text-left grow flex flex-col justify-center">
                          <span className="font-extrabold text-slate-500 text-[9px] uppercase tracking-wider font-mono">Ref Context usage:</span>
                          <p className="text-slate-800 italic font-semibold">"{content.vocabulary[activeCardIndex].context}"</p>
                          <p className="text-slate-450 font-bold">Translation: {content.vocabulary[activeCardIndex].contextTranslation}</p>
                        </div>
                      </div>
                      <div className="text-center text-[10px] text-purple-500 font-mono pt-3 border-t border-purple-100/40 select-none">
                        Click again to flip back
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card memory grading controls */}
                <div className="space-y-3 text-center">
                  <div className="text-xs text-slate-500 font-medium">How well did you preserve recollection of this item?</div>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => handleBoxReview(content.vocabulary[activeCardIndex], 'hard')}
                      className="py-2 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 text-xs font-bold cursor-pointer transition uppercase tracking-wider"
                    >
                      🔴 Hard
                    </button>
                    <button
                      onClick={() => handleBoxReview(content.vocabulary[activeCardIndex], 'good')}
                      className="py-2 rounded-xl border border-blue-200 text-blue-600 hover:bg-blue-50 text-xs font-bold cursor-pointer transition uppercase tracking-wider"
                    >
                      🔵 Good
                    </button>
                    <button
                      onClick={() => handleBoxReview(content.vocabulary[activeCardIndex], 'easy')}
                      className="py-2 rounded-xl border border-emerald-200 text-emerald-600 hover:bg-emerald-50 text-xs font-bold cursor-pointer transition uppercase tracking-wider"
                    >
                      🟢 Easy
                    </button>
                  </div>
                </div>

              </div>
            </motion.div>
          )}

          {/* TAB: COMPREHENSION QUIZ */}
          {activeTab === 'quiz' && content && (
            <motion.div
              key="quiz-tab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6 max-w-2xl mx-auto"
            >
              {!quizSubmitted ? (
                // ACTIVE STEP-BY-STEP FLOW (ONE TASK PER SCREEN)
                <div className="space-y-6">
                  {/* Top Bar with progress indicator */}
                  <div className="flex items-center justify-between gap-4 select-none bg-slate-50/50 p-3 rounded-2xl border border-slate-100">
                    <div className="flex-1 h-3 bg-slate-200/60 rounded-full overflow-hidden p-[1px] relative">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(quizQuestionIdx / content.quiz.length) * 100}%` }}
                        className="h-full bg-indigo-600 rounded-full transition-all duration-300"
                      />
                    </div>

                    <span className="text-[10px] font-mono font-black text-slate-555 bg-white border border-slate-200/80 px-2.5 py-1 rounded-lg shrink-0">
                      TASK {quizQuestionIdx + 1} OF {content.quiz.length}
                    </span>
                  </div>

                  {/* Focused Question Card */}
                  {(() => {
                    const q = content.quiz[quizQuestionIdx];
                    if (!q) return null;
                    const userAnswer = quizAnswers[q.id];
                    const hasSelected = userAnswer !== undefined;
                    const isCorrect = userAnswer === q.correctAnswerIndex;

                    return (
                      <div className="space-y-6">
                        {/* Question Frame */}
                        <div className="bg-white rounded-3xl border-2 border-slate-200/90 p-6 md:p-8 shadow-xs relative overflow-hidden">
                          {/* Ambient background decoration */}
                          <div className="absolute inset-0 bg-[linear-gradient(to_right,#f8fafc_1px,transparent_1px),linear-gradient(to_bottom,#f8fafc_1px,transparent_1px)] bg-[size:1.5rem_1.5rem] opacity-50 pointer-events-none" />

                          <div className="relative z-10 space-y-4">
                            <span className="text-[10px] text-indigo-700 font-black uppercase tracking-widest font-mono bg-indigo-50 border border-indigo-100/50 px-2.5 py-1 rounded-full">
                              Grammar & Comprehension
                            </span>
                            
                            <h3 className="text-lg md:text-xl font-extrabold text-slate-850 tracking-tight leading-snug font-display">
                              {q.question}
                            </h3>
                          </div>
                        </div>

                        {/* Touch Option Cards */}
                        <div className="grid grid-cols-1 gap-3">
                          {q.options.map((opt, optIdx) => {
                            const isSelected = userAnswer === optIdx;
                            
                            // Define state styling
                            let btnStyle = "bg-white border-slate-200 hover:border-slate-350 text-slate-700 hover:bg-slate-50";
                            let iconEl = null;

                            if (isSelected) {
                              if (currentQuestionChecked) {
                                if (isCorrect) {
                                  btnStyle = "bg-emerald-50/60 border-emerald-500 text-emerald-800 font-extrabold shadow-xs";
                                  iconEl = <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />;
                                } else {
                                  btnStyle = "bg-rose-50/60 border-rose-500 text-rose-800 font-extrabold shadow-xs animate-head-shake";
                                  iconEl = <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />;
                                }
                              } else {
                                btnStyle = "bg-indigo-50/40 border-indigo-500 text-indigo-800 font-extrabold shadow-xs";
                              }
                            } else if (currentQuestionChecked && optIdx === q.correctAnswerIndex) {
                              // Highlight correct answer if they picked wrong
                              btnStyle = "bg-emerald-50/30 border-dashed border-emerald-400 text-emerald-800 font-bold";
                              iconEl = <CheckCircle2 className="w-5 h-5 text-emerald-500/70 shrink-0" />;
                            }

                            return (
                              <button
                                key={optIdx}
                                disabled={currentQuestionChecked}
                                onClick={() => handleOptionSelect(q.id, optIdx)}
                                className={`w-full p-4.5 rounded-2xl border-2 text-left text-xs md:text-sm font-semibold transition-all duration-150 flex items-center justify-between gap-4 cursor-pointer select-none ${btnStyle}`}
                              >
                                <span>{opt}</span>
                                {iconEl}
                              </button>
                            );
                          })}
                        </div>

                        {/* Feedback Panel */}
                        <AnimatePresence mode="wait">
                          {currentQuestionChecked ? (
                            <motion.div
                              initial={{ opacity: 0, y: 15 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -15 }}
                              className={`p-5 rounded-2xl border ${
                                isCorrect 
                                  ? 'bg-emerald-50 border-emerald-200 text-emerald-900' 
                                  : 'bg-rose-50 border-rose-200 text-rose-900'
                              } space-y-2 select-none`}
                            >
                              <div className="flex items-center gap-2 font-black uppercase text-xs font-mono tracking-widest">
                                {isCorrect ? (
                                  <>🎉 Perfect! Correct Answer</>
                                ) : (
                                  <>⚠️ incorrect • Let's Review</>
                                )}
                              </div>
                              {q.explanation && (
                                <p className="text-xs md:text-sm font-medium leading-relaxed opacity-95">
                                  {q.explanation}
                                </p>
                              )}
                            </motion.div>
                          ) : null}
                        </AnimatePresence>

                        {/* Bottom Action Tray */}
                        <div className="pt-4 flex justify-end">
                          {!currentQuestionChecked ? (
                            <button
                              disabled={!hasSelected}
                              onClick={() => setCurrentQuestionChecked(true)}
                              className={`w-full sm:w-auto px-8 py-3.5 rounded-2xl text-xs uppercase font-black tracking-widest font-mono transition-all duration-150 shadow-xs cursor-pointer ${
                                hasSelected
                                  ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-200'
                                  : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                              }`}
                            >
                              Check Answer
                            </button>
                          ) : (
                            <button
                              onClick={() => {
                                if (quizQuestionIdx < content.quiz.length - 1) {
                                  setQuizQuestionIdx(prev => prev + 1);
                                  setCurrentQuestionChecked(false);
                                } else {
                                  handleQuizSubmit();
                                }
                              }}
                              className="w-full sm:w-auto px-8 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl text-xs uppercase font-black tracking-widest font-mono transition shadow-md shadow-indigo-100 cursor-pointer"
                            >
                              {quizQuestionIdx < content.quiz.length - 1 ? 'Continue' : 'Finish Quiz'}
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })()}
                </div>
              ) : (
                // COMPLETED SUMMARY VIEW
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="space-y-6 text-center select-none"
                >
                  <div className="w-full max-w-md mx-auto bg-white rounded-3xl border border-slate-200 p-8 shadow-xl space-y-6">
                    
                    {/* Trophy icon */}
                    <div className="w-20 h-20 mx-auto rounded-3xl bg-amber-50 border border-amber-200 flex items-center justify-center text-4xl animate-bounce shadow-inner">
                      🏆
                    </div>

                    <div className="space-y-1.5">
                      <span className="text-[10px] uppercase tracking-widest font-black text-indigo-600 font-mono bg-indigo-50 px-2.5 py-0.5 rounded-full inline-block">
                        Lesson Completed
                      </span>
                      <h3 className="text-2xl font-black text-slate-900 font-display">
                        Quiz Finished!
                      </h3>
                      <p className="text-xs text-slate-400 font-semibold">
                        Your situational comprehension is growing stronger.
                      </p>
                    </div>

                    {/* Progress Score Bar Card */}
                    <div className="bg-slate-50 border border-slate-100 p-5 rounded-2xl space-y-3">
                      <div className="flex justify-between items-center text-xs font-bold text-slate-500">
                        <span>ACCURACY RATE:</span>
                        <span className="font-mono text-indigo-600">{Math.round((quizScore || 0) / content.quiz.length * 100)}%</span>
                      </div>
                      
                      <div className="h-4 bg-slate-100 rounded-full overflow-hidden p-[1px] relative">
                        <div 
                          className="h-full bg-indigo-600 rounded-full transition-all duration-500"
                          style={{ width: `${((quizScore || 0) / content.quiz.length) * 100}%` }}
                        />
                      </div>

                      <div className="flex justify-between items-center pt-2 text-xs font-black text-slate-800 font-mono">
                        <span>Score:</span>
                        <span>{quizScore} / {content.quiz.length} Correct</span>
                      </div>
                    </div>

                    {/* XP reward block */}
                    <div className="bg-amber-55 border border-amber-200 rounded-2xl p-4 flex items-center gap-3 text-left">
                      <div className="w-10 h-10 rounded-xl bg-amber-500 text-white font-black flex items-center justify-center text-base shadow-sm font-mono shrink-0">
                        +{earnedXp}
                      </div>
                      <div className="space-y-0.5">
                        <h4 className="text-xs font-black text-amber-900 uppercase font-mono">XP Reward Added</h4>
                        <p className="text-[11px] text-amber-700 font-medium">
                          {quizScore === content.quiz.length 
                            ? "Perfect flawless score! Double XP bonus applied." 
                            : "Splendid effort! Practice makes permanent."}
                        </p>
                      </div>
                    </div>

                    {/* Retake or Continue Buttons */}
                    <div className="grid grid-cols-2 gap-3 pt-2">
                      <button
                        onClick={handleResetQuiz}
                        className="py-3 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-black uppercase tracking-wider font-mono text-slate-600 transition cursor-pointer"
                      >
                        Retake Quiz
                      </button>
                      <button
                        onClick={() => setActiveTab('reading')}
                        className="py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-855 text-white text-xs font-black uppercase tracking-wider font-mono transition cursor-pointer shadow-sm"
                      >
                        Back to Text
                      </button>
                    </div>

                  </div>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* TAB: SPEAKING PRACTICE */}
          {activeTab === 'speaking' && (
            <motion.div
              key="speaking-tab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6 max-w-2xl mx-auto"
            >
              <div className="text-center space-y-1">
                <h4 className="font-bold text-slate-800 text-lg">Phonetic Shadowing Sandbox</h4>
                <p className="text-xs text-slate-400">Select any paragraph from the narrative, listen to native pacing, and record your voice.</p>
              </div>

              {/* Sentence SELECTOR scrollable list */}
              <div className="space-y-3">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Choose Sentence to practice:</span>
                <div className="flex gap-2 overflow-x-auto pb-1.5 scrollbar-thin scrollbar-thumb-slate-200">
                  {content.paragraphs.map((_, pIdx) => (
                    <button
                      key={pIdx}
                      onClick={() => {
                        setSelectedSpeakingIdx(pIdx);
                        setSpeakingFeedback(null);
                        setRecordedBlobUrl(null);
                      }}
                      className={`py-1.5 px-3.5 rounded-xl text-xs font-bold transition shrink-0 cursor-pointer ${
                        selectedSpeakingIdx === pIdx 
                          ? 'bg-slate-900 text-white' 
                          : 'bg-slate-50 text-slate-600 border border-slate-200'
                      }`}
                    >
                      Sentence {pIdx + 1}
                    </button>
                  ))}
                </div>
              </div>

              {/* Focused paragraph visualization */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Romanian Sentence</span>
                  <button
                    onClick={() => handleTtsSpeak(content.paragraphs[selectedSpeakingIdx].romanian)}
                    className="p-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-lg text-xs font-semibold flex items-center gap-1 transition cursor-pointer"
                  >
                    <Volume2 className="w-3.5 h-3.5" /> Listen Guide
                  </button>
                </div>
                <p className="text-slate-800 font-bold text-base md:text-lg leading-relaxed font-sans">
                  "{content.paragraphs[selectedSpeakingIdx].romanian}"
                </p>
                <div className="text-xs text-slate-400 pt-2 border-t border-slate-150">
                  <span className="font-semibold text-slate-600">Translation:</span> "{content.paragraphs[selectedSpeakingIdx].english}"
                </div>
              </div>

              {/* Micro Recording Action area */}
              <div className="bg-slate-900 rounded-3xl p-6 text-white text-center space-y-4">
                <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block">Recording Deck</span>

                <div className="flex justify-center items-center gap-6">
                  {isRecording ? (
                    <button
                      onClick={handleStopRecording}
                      className="w-16 h-16 rounded-full bg-red-600 text-white flex items-center justify-center hover:bg-red-500 transition cursor-pointer animate-pulse ring-4 ring-red-600/35"
                      title="Stop Recording"
                    >
                      <Square className="w-6 h-6 fill-white" />
                    </button>
                  ) : (
                    <button
                      onClick={handleStartRecording}
                      className="w-16 h-16 rounded-full bg-indigo-600 text-white flex items-center justify-center hover:bg-indigo-500 transition cursor-pointer"
                      title="Start Recording"
                    >
                      <Mic className="w-6 h-6" />
                    </button>
                  )}
                </div>

                <div className="text-sm font-medium">
                  {isRecording ? (
                    <div className="space-y-3">
                      <span className="text-red-400 flex items-center justify-center gap-1.5 animate-pulse font-mono text-xs">
                        ⬤ RECORDING AUDIO NOW... SAY IT LOUD
                      </span>
                      {speechTranscript && (
                        <div className="p-3.5 bg-slate-850/80 rounded-2xl border border-slate-800 text-center max-w-lg mx-auto">
                          <span className="text-[9px] text-indigo-400 font-mono block uppercase tracking-wider mb-1">Live Speech Transcribing...</span>
                          <p className="text-indigo-100 text-sm font-medium italic leading-relaxed">&ldquo;{speechTranscript}&rdquo;</p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <span className="text-slate-400 text-xs">Tap mic down, record yourself speaking, get calibration report</span>
                  )}
                </div>

                {/* Local playback area if audio caught */}
                {recordedBlobUrl && (
                  <div className="pt-4 border-t border-slate-800 flex flex-col items-center space-y-2">
                    <span className="text-[10px] text-slate-500 font-bold uppercase">Your audio record clip:</span>
                    <audio src={recordedBlobUrl} controls className="h-9 w-full max-w-xs" />
                  </div>
                )}
              </div>

              {/* Report feedback card details */}
              {speakingFeedback && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-5 rounded-3xl border border-slate-200 bg-white shadow-xs space-y-4"
                >
                  <div className="flex items-center gap-2 text-xs font-bold text-teal-650 uppercase">
                    <Award className="w-4 h-4 text-teal-600" /> Real-Time Phonemic Analysis
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">Pronunciation Match</span>
                      <h4 className="text-3xl font-black text-slate-800">{speakingFeedback.score}%</h4>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">Fluency Estimate</span>
                      <h4 className="text-3xl font-black text-teal-600">{speakingFeedback.fluency}</h4>
                    </div>
                  </div>

                  {speakingFeedback.transcript && (
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-150 space-y-3 text-left">
                      <div>
                        <span className="text-[9px] text-slate-400 font-mono block uppercase tracking-wider mb-1">We Transcribed:</span>
                        <p className="text-slate-700 text-xs sm:text-sm font-semibold italic leading-relaxed">&ldquo;{speakingFeedback.transcript}&rdquo;</p>
                      </div>
                      
                      <div className="pt-2.5 border-t border-slate-200/80">
                        <span className="text-[9px] text-slate-400 font-mono block uppercase tracking-wider mb-2">Word Accuracy Alignment:</span>
                        <div className="flex flex-wrap gap-1.5">
                          {content.paragraphs[selectedSpeakingIdx].romanian.split(/\s+/).map((word, idx) => {
                            const cleanW = word.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?]/g, "").trim();
                            const isMatched = speakingFeedback.transcript.toLowerCase().includes(cleanW);
                            return (
                              <span 
                                key={idx} 
                                className={`px-2 py-0.5 rounded-lg text-xs font-bold transition ${
                                  isMatched 
                                    ? 'text-emerald-700 bg-emerald-50 border border-emerald-150' 
                                    : 'text-rose-700 bg-rose-50 border border-rose-150'
                                }`}
                              >
                                {word}
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="p-4 bg-teal-50/40 rounded-2xl border border-teal-100 text-left">
                    <p className="text-slate-600 font-semibold text-xs leading-relaxed">
                      <span className="font-bold text-slate-800">Calibrator Feedback:</span> {speakingFeedback.critique}
                    </p>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* TAB: AI ROLE-PLAY CHAT CHANNELS */}
          {activeTab === 'chat' && (
            <motion.div
              key="chat-tab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              <div className="border-b border-slate-50 pb-3">
                <h4 className="font-bold text-slate-800 text-lg">Romance AI Tutor Simulator</h4>
                <p className="text-xs text-slate-400">Discuss this scenario with Niran. Type in Romanian, get grammatical pointers, click translate to peek standard prompts.</p>
              </div>

              {/* Conversational container bubble layout */}
              <div className="h-[300px] overflow-y-auto border border-slate-150 rounded-2xl bg-slate-50 p-4 space-y-4 text-sm scrollbar-thin">
                {chatMessages.map((msg, idx) => {
                  const isUser = msg.sender === 'user';
                  return (
                    <div 
                      key={idx}
                      className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} space-y-1`}
                    >
                      <div className="text-[10px] text-slate-400 font-mono tracking-wide px-1">
                        {isUser ? 'You' : 'Niran (AI Tutor)'} &bull; {msg.timestamp}
                      </div>
                      
                      <div className={`max-w-[85%] p-3.5 rounded-2xl leading-relaxed text-xs sm:text-sm ${
                        isUser 
                          ? 'bg-slate-900 text-white rounded-br-none shadow-xs' 
                          : 'bg-white text-slate-800 border border-slate-150 rounded-bl-none shadow-xs'
                      }`}>
                        {/* Text formatting with tags */}
                        <div className="whitespace-pre-line font-sans font-medium">{msg.text}</div>
                        
                        {/* Translation option button */}
                        {msg.englishTranslation && !isUser && (
                          <div className="mt-2.5 pt-2 border-t border-slate-100 flex flex-col gap-1 text-[11px] text-slate-400 leading-normal">
                            <span className="font-semibold text-slate-500">English Helper:</span>
                            "{msg.englishTranslation}"
                          </div>
                        )}

                        {/* Correction warnings popup */}
                        {msg.correction && (
                          <div className="mt-2.5 p-2 bg-yellow-50 text-yellow-800 border border-yellow-100 rounded-xl text-[11px] font-medium leading-relaxed">
                            <span className="font-bold">💡 Grammatical Checkup:</span>
                            <p className="italic">"{msg.correction}"</p>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
                {chatLoading && (
                  <div className="flex flex-col items-start space-y-1">
                    <span className="text-[10px] text-slate-400 font-mono">Niran is formulating a reply</span>
                    <div className="bg-white p-3.5 rounded-2xl border border-slate-150 rounded-bl-none text-xs flex items-center gap-2 text-slate-500">
                      <div className="w-2 h-2 rounded-full bg-slate-400 animate-bounce"></div>
                      <div className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                  </div>
                )}
                <div ref={chatBottomRef} />
              </div>

              {/* Chat typing console bar */}
                <form onSubmit={handleSendChatMessage} className="flex gap-2">
                  <input 
                    type="text"
                    placeholder="Scrie în română... (e.g., 'Aș dori sarmale, vă rog')"
                    value={userInputChat}
                    onChange={(e) => setUserInputChat(e.target.value)}
                    className="flex-1 px-4 py-3 border border-slate-200 rounded-2xl text-xs sm:text-sm bg-slate-50 focus:outline-hidden focus:border-indigo-500"
                    disabled={chatLoading}
                  />
                  <button
                    type="submit"
                    className="p-3 bg-indigo-600 text-white rounded-2xl hover:bg-indigo-700 transition cursor-pointer"
                    disabled={!userInputChat.trim() || chatLoading}
                  >
                    <Send className="w-4 h-4 fill-white" />
                  </button>
                </form>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* Celebratory success modal */}
      <AnimatePresence>
        {showCelebrationModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Modal Backdrop with elegant fade-in */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCelebrationModal(false)}
              className="absolute inset-0 bg-slate-950/75 backdrop-blur-xs cursor-pointer"
            />

            {/* Modal content with spring scale animated-up */}
            <motion.div 
              initial={{ scale: 0.9, y: 15, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1, transition: { type: 'spring', damping: 25, stiffness: 350 } }}
              exit={{ scale: 0.9, y: 15, opacity: 0 }}
              className="relative bg-white rounded-3xl border-2 border-slate-205 border-b-8 p-6 md:p-8 max-w-lg w-full shadow-2xl space-y-6 text-center select-none z-10"
            >
              {/* Header icons: spinning gears or laurels */}
              <div className="flex justify-center items-center gap-2">
                <span className="text-4xl animate-bounce">🎉</span>
                <div className="w-16 h-16 rounded-full bg-indigo-50 flex items-center justify-center border-2 border-indigo-200">
                  <Trophy className="w-8 h-8 text-indigo-600 animate-[pulse_2s_infinite]" />
                </div>
                <span className="text-4xl animate-bounce" style={{ animationDelay: '150ms' }}>🌟</span>
              </div>

              {/* Title heading */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-black tracking-widest text-indigo-500 uppercase font-mono">SCENARIO MASTERED</span>
                <h3 className="text-2xl font-black text-slate-900 tracking-tight font-display">
                  {progress.targetLanguage && progress.targetLanguage !== 'Romanian' ? 'Amazing! Complete!' : 'Senzațional! Complete!'}
                </h3>
                <p className="text-sm font-semibold text-slate-500 leading-relaxed">
                  You successfully cleared all modules of <strong className="text-slate-800 font-bold">&ldquo;{progress.targetLanguage && progress.targetLanguage !== 'Romanian' ? scenario.title : scenario.romanianTitle}&rdquo;</strong> ({scenario.title}).
                </p>
              </div>

              {/* XP and accuracy badges strip */}
              <div className="grid grid-cols-2 gap-4">
                {/* Got XP card */}
                <div className="p-4 bg-orange-55 rounded-2xl border-2 border-orange-100 flex flex-col items-center justify-center space-y-1">
                  <span className="text-3xl">🔥</span>
                  <p className="text-lg font-black text-orange-655 font-display">+{earnedXp} XP</p>
                  <span className="text-[9px] font-bold text-orange-400 font-mono uppercase tracking-wider">Experience Gained</span>
                </div>

                {/* Score Accuracy card */}
                <div className="p-4 bg-emerald-55 rounded-2xl border-2 border-emerald-100 flex flex-col items-center justify-center space-y-1">
                  <span className="text-3xl">🎯</span>
                  <p className="text-lg font-black text-emerald-655 font-display">{quizScore} / {content?.quiz.length || 8}</p>
                  <span className="text-[9px] font-bold text-emerald-400 font-mono uppercase tracking-wider">Quiz Accuracy</span>
                </div>
              </div>

              {/* Dynamic badge unlocks or motivational line */}
              {newlyUnlockedBadge ? (
                <div className="p-4 bg-linear-to-r from-yellow-50 to-amber-50 rounded-2xl border-2 border-yellow-200/80 space-y-3">
                  <span className="text-[10px] font-black tracking-widest text-amber-600 uppercase font-mono flex items-center justify-center gap-1">
                    <Award className="w-4 h-4 text-amber-500" /> Trophy Cabinet Unlocked!
                  </span>
                  
                  <div className="flex items-center gap-3.5 text-left">
                    <div className={`w-13 h-13 rounded-full bg-gradient-to-br ${newlyUnlockedBadge.color} flex items-center justify-center text-white text-xl shadow-md shrink-0`}>
                      {newlyUnlockedBadge.id === 'welcome' ? '🏆' : newlyUnlockedBadge.id === 'food_master' ? '🍲' : newlyUnlockedBadge.id === 'mountain_explorer' ? '🏔️' : newlyUnlockedBadge.id === 'social_butterfly' ? '🍷' : newlyUnlockedBadge.id === 'vocab_champion' ? '🧬' : newlyUnlockedBadge.id === 'roleplay_hero' ? '☄️' : newlyUnlockedBadge.id === 'streak_fanatic' ? '🔥' : '🎓'}
                    </div>
                    <div>
                      <h4 className="font-extrabold text-slate-805 text-sm">{newlyUnlockedBadge.name}</h4>
                      <p className="text-[11px] text-slate-550 leading-relaxed font-semibold">
                        {newlyUnlockedBadge.description}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-150 text-xs font-semibold text-slate-500 flex items-center justify-center gap-2">
                  <span>💡</span>
                  <span>
                    You are now <strong className="text-slate-800">{100 - (progress.xp % 100)} XP</strong> away from Level {Math.floor(progress.xp / 100) + 2}! Keep studying!
                  </span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  onClick={() => setShowCelebrationModal(false)}
                  className="flex-1 py-3 px-5 border-2 border-slate-200 border-b-4 text-slate-600 hover:bg-slate-50 hover:text-slate-800 active:border-b-0 active:translate-y-[4px] rounded-xl text-xs font-black tracking-wider uppercase font-mono transition cursor-pointer"
                >
                  Review Quiz
                </button>
                <button
                  onClick={onBack}
                  className="flex-1 py-3 px-5 bg-indigo-600 text-white border-b-4 border-indigo-800 active:border-b-0 active:translate-y-[4px] rounded-xl text-xs font-black tracking-wider uppercase font-mono hover:bg-indigo-700 transition cursor-pointer"
                >
                  Continue Path
                </button>
              </div>

              {/* Completion Ad Unit */}
              <div className="pt-2">
                <AdBanner dataAdSlot="3332221110" label="Sponsored Content" />
              </div>
            </motion.div>
          </div>
        )}

      </AnimatePresence>

    </div>
  );
}
