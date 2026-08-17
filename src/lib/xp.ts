import { UserProgress } from '../types';

/**
 * Gets the current timezone-safe local date formatted as YYYY-MM-DD.
 */
export function getLocalDateString(): string {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Gets timezone-safe yesterday's date formatted as YYYY-MM-DD.
 */
export function getYesterdayDateString(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

interface XpUpdateResult {
  updatedFields: Partial<UserProgress>;
  newDateLogged: string | null; // If a new day was logged, returns the YYYY-MM-DD string
}

/**
 * Evaluates game metrics (XP, Streaks, and Practice History) for any earned XP.
 */
export function calculateXpGain(
  currentProgress: UserProgress,
  xpAmount: number
): XpUpdateResult {
  const todayStr = getLocalDateString();
  const yesterdayStr = getYesterdayDateString();

  const currentXp = currentProgress.xp;
  const currentStreak = currentProgress.streak;
  const lastActive = currentProgress.lastActiveDate;
  
  let nextXp = currentXp + xpAmount;
  let nextStreak = currentStreak;
  let nextDailyXpGained = currentProgress.dailyXpGained;
  let newDateLogged: string | null = null;

  // Initialize practiceDays array safely
  const existingPracticeDays = currentProgress.practiceDays || [];
  let nextPracticeDays = [...existingPracticeDays];

  if (!nextPracticeDays.includes(todayStr)) {
    nextPracticeDays.push(todayStr);
    newDateLogged = todayStr;
  }

  if (lastActive === null) {
    // Brand new user practicing for the first time
    nextStreak = 1;
    nextDailyXpGained = xpAmount;
  } else if (lastActive === todayStr) {
    // User already practiced today - streak is locked (remains active), but we add XP
    nextDailyXpGained += xpAmount;
  } else if (lastActive === yesterdayStr) {
    // User completed their consecutive streak on a brand new day!
    nextStreak += 1;
    nextDailyXpGained = xpAmount; // resets daily progress to start fresh for today
  } else {
    // Break detected (elapsed more than 1 day) - reset streak to 1, start fresh today
    nextStreak = 1;
    nextDailyXpGained = xpAmount;
  }

  // Auto unlocked streaks milestones check
  const nextBadges = [...currentProgress.badges];
  if (nextStreak >= 7 && !nextBadges.includes('streak_fanatic')) {
    nextBadges.push('streak_fanatic');
  }

  const updatedFields: Partial<UserProgress> = {
    xp: nextXp,
    streak: nextStreak,
    lastActiveDate: todayStr,
    dailyXpGained: nextDailyXpGained,
    practiceDays: nextPracticeDays,
    badges: nextBadges,
  };

  return {
    updatedFields,
    newDateLogged,
  };
}
