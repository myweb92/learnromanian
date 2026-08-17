export type CEFRLevel = 'A1' | 'A2' | 'B1' | 'B2';

export type ScenarioCategory = 
  | 'Daily Life'
  | 'Travel & Tourism'
  | 'Food & Dining'
  | 'Culture & Customs'
  | 'Work & Professional'
  | 'Shopping & Services'
  | 'Socializing'
  | 'Emergency & Health';

export interface Scenario {
  id: string; // "sc-1", "sc-2", ..., "sc-100"
  title: string;
  romanianTitle: string;
  level: CEFRLevel;
  category: ScenarioCategory;
  description: string;
  estimatedMinutes: number;
}

export interface VocabularyItem {
  romanian: string;
  english: string;
  context: string; // example sentence in Romanian containing the word
  contextTranslation: string; // translation of the example sentence
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation?: string;
  type: 'multiple-choice' | 'fill-in-the-blank';
}

export interface ScenarioContent {
  id: string;
  romanianText: string;
  englishText: string;
  paragraphs: {
    romanian: string;
    english: string;
  }[];
  vocabulary: VocabularyItem[];
  quiz: QuizQuestion[];
}

export interface Flashcard {
  id: string;
  romanian: string;
  english: string;
  context: string;
  contextTranslation: string;
  box: number; // 1, 2, 3, 4, 5 (for Leitner box SRS)
  nextReviewDate: string; // ISO String
}

export interface UserProgress {
  xp: number;
  streak: number;
  lastActiveDate: string | null;
  completedScenarios: string[]; // List of scenario IDs
  inProgressScenarios: string[]; // List of scenario IDs
  favorites: string[]; // List of scenario IDs
  flashcards: Flashcard[];
  badges: string[]; // List of badge IDs
  dailyGoalXp: number; // e.g. 50
  dailyXpGained: number;
  practiceDays?: string[]; // Logged dates of practice YYYY-MM-DD
  targetLanguage?: string; // What language is currently being learned (e.g., 'Romanian', 'Dutch', 'Spanish', etc.)
  sourceLanguage?: string; // In what interface/explanation language (e.g., 'English', 'Spanish', 'French', etc.)
  completedScenariosByLanguage?: Record<string, string[]>;
  inProgressScenariosByLanguage?: Record<string, string[]>;
  assessedLevel?: CEFRLevel;
  lastSelectedScenarioId?: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string; // Lucide icon name
  criteria: string;
  color: string; // tailwind class color
}

export interface ChatMessage {
  sender: 'user' | 'ai';
  text: string;
  correction?: string; // Optional correction offered by AI
  englishTranslation?: string; // Optional English explanation
  timestamp: string;
}
