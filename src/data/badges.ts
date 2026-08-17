import { Badge } from '../types';

export const BADGES: Badge[] = [
  {
    id: "welcome",
    name: "Bine ai venit!",
    description: "Started your Romanian immersion journey with Niran.",
    icon: "Compass",
    criteria: "Log into the app for the first time.",
    color: "from-blue-500 to-indigo-600"
  },
  {
    id: "food_master",
    name: "Food Master",
    description: "Mastered traditional food ordering and culinary topics.",
    icon: "UtensilsCrossed",
    criteria: "Complete 3 Food & Dining scenarios.",
    color: "from-amber-400 to-orange-500"
  },
  {
    id: "mountain_explorer",
    name: "Mountain Explorer",
    description: "Sailed through Transylvanian and Carpathian tourism units.",
    icon: "Mountain",
    criteria: "Complete 3 Travel & Tourism scenarios.",
    color: "from-emerald-400 to-teal-600"
  },
  {
    id: "social_butterfly",
    name: "Social Butterfly",
    description: "Learned how to make friends and joke at Romanian terraces.",
    icon: "MessageSquareHeart",
    criteria: "Have a chatty social scenario completed.",
    color: "from-pink-400 to-rose-500"
  },
  {
    id: "vocab_champion",
    name: "Vocab Champion",
    description: "Acquired high-frequency words stored in Leitner SRS memory.",
    icon: "BrainCircuit",
    criteria: "Have 10 active cards in your Spaced Repetition deck.",
    color: "from-purple-500 to-violet-600"
  },
  {
    id: "roleplay_hero",
    name: "Roleplay Hero",
    description: "Exchanged real-time messages with Niran, the AI Tutor.",
    icon: "Sparkles",
    criteria: "Engage in an AI tutor roleplay session.",
    color: "from-yellow-400 to-amber-500"
  },
  {
    id: "streak_fanatic",
    name: "Streak Fanatic",
    description: "Exercised your brain cells daily without break.",
    icon: "Flame",
    criteria: "Keep a daily study streak.",
    color: "from-red-500 to-orange-600"
  },
  {
    id: "cefr_level_up",
    name: "CEFR A2 Graduate",
    description: "Moving from basic expressions to independent understanding.",
    icon: "GraduationCap",
    criteria: "Complete 5 distinct A2 scenarios.",
    color: "from-cyan-400 to-blue-600"
  }
];
