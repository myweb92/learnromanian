import React, { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { 
  Award, 
  CheckCircle2, 
  Compass, 
  Trophy, 
  Sparkles,
  ClipboardList,
  Rocket,
  Zap,
  ChevronRight,
  Flame,
  ChevronDown
} from 'lucide-react';
import { UserProgress } from '../types';
import { BADGES } from '../data/badges';
import { SCENARIOS } from '../data/topics';
import AnimatedProgressBar from './AnimatedProgressBar';

interface StatsBadgesProps {
  progress: UserProgress;
}

export default function StatsBadges({ progress }: StatsBadgesProps) {
  const completedScenarios = progress.completedScenarios;
  const [selectedTimeframe, setSelectedTimeframe] = useState<string>("Weekly");
  const [activeDayIdx, setActiveDayIdx] = useState<number>(4); // Default highlighted day is Friday (idx 4) to match mockup

  // XP Calculations
  const xpForNextLevel = 100;
  const currentLevelNum = Math.floor(progress.xp / xpForNextLevel) + 1;
  const levelXpRemainder = progress.xp % xpForNextLevel;
  const levelProgressPercent = Math.round((levelXpRemainder / xpForNextLevel) * 100);

  // Category completion ratios
  const categoryStats = useMemo(() => {
    const stats: Record<string, { total: number; completed: number }> = {};
    
    // Initialize
    SCENARIOS.forEach((sc) => {
      if (!stats[sc.category]) {
        stats[sc.category] = { total: 0, completed: 0 };
      }
      stats[sc.category].total++;
      if (completedScenarios.includes(sc.id)) {
        stats[sc.category].completed++;
      }
    });

    return Object.entries(stats).map(([name, val]) => ({
      name,
      total: val.total,
      completed: val.completed,
      percent: Math.round((val.completed / val.total) * 100)
    }));
  }, [completedScenarios]);

  // CEFR Levels stats
  const cefrStats = useMemo(() => {
    const caps = { 'A1': 0, 'A2': 0, 'B1': 0, 'B2': 0 };
    SCENARIOS.forEach(sc => caps[sc.level]++);
    
    const comps = { 'A1': 0, 'A2': 0, 'B1': 0, 'B2': 0 };
    completedScenarios.forEach(id => {
      const parent = SCENARIOS.find(sc => sc.id === id);
      if (parent) comps[parent.level]++;
    });

    return Object.keys(caps).map(lvl => ({
      level: lvl as 'A1' | 'A2' | 'B1' | 'B2',
      total: caps[lvl as 'A1' | 'A2' | 'B1' | 'B2'],
      completed: comps[lvl as 'A1' | 'A2' | 'B1' | 'B2'],
      percent: Math.round((comps[lvl as 'A1' | 'A2' | 'B1' | 'B2'] / caps[lvl as 'A1' | 'A2' | 'B1' | 'B2']) * 100)
    }));
  }, [completedScenarios]);

  // Weekly study chart metrics
  const daysOfChart = [
    { day: "Mon", duration: "1.2h", height: "35%" },
    { day: "Tue", duration: "2.0h", height: "55%" },
    { day: "Wed", duration: "1.8h", height: "48%" },
    { day: "Thu", duration: "2.4h", height: "65%" },
    { day: "Fri", duration: "4.0h", height: "95%", isHighlighted: true }, // Highlighted as Friday in mockup
    { day: "Sat", duration: "1.5h", height: "42%" },
    { day: "Sun", duration: "3.2h", height: "82%" },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-8 select-none font-sans max-w-5xl mx-auto pb-10"
    >
      {/* SECTION HEADER: "Learning Overview" */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight font-display">Learning Overview</h2>
          <p className="text-xs text-slate-450 font-semibold mt-1">Track your consistency and real-time study stats</p>
        </div>
        
        {/* Weekly Dropdown matching mockup */}
        <div className="relative">
          <select 
            value={selectedTimeframe}
            onChange={(e) => setSelectedTimeframe(e.target.value)}
            className="appearance-none bg-white border border-slate-200 rounded-xl px-4 py-2 pr-9 text-xs font-black uppercase tracking-wider font-mono text-slate-700 shadow-xs cursor-pointer focus:outline-none focus:border-teal-500 transition-all"
          >
            <option>Weekly</option>
            <option>Monthly</option>
            <option>All Time</option>
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
            <ChevronDown className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>

      {/* MOCKUP CHART COMPARTMENT: Screen 3 Bar Chart with tooltip */}
      <div className="bg-slate-50/50 p-6 md:p-8 rounded-3xl border border-slate-100 shadow-inner">
        {/* Rounded columns list */}
        <div className="flex justify-between items-end gap-3 h-48 px-1 xs:px-4 md:px-8 relative select-none">
          {daysOfChart.map((col, idx) => {
            const isHighlighted = idx === activeDayIdx;
            return (
              <div 
                key={col.day} 
                onClick={() => setActiveDayIdx(idx)}
                className="flex-1 flex flex-col items-center justify-end h-full group cursor-pointer"
              >
                {/* Tooltip on active */}
                <div className={`transition-all duration-200 mb-2 relative ${
                  isHighlighted ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-2 scale-90 pointer-events-none"
                }`}>
                  <div className="bg-slate-900 text-white font-mono font-black text-[10px] tracking-wider uppercase px-2.5 py-1.5 rounded-lg shadow-md whitespace-nowrap">
                    {col.duration}
                  </div>
                  <div className="w-2.5 h-2.5 bg-slate-900 rotate-45 mx-auto -mt-1.5 rounded-xs" />
                </div>

                {/* Column shape */}
                <div className="w-full max-w-[40px] bg-slate-100 hover:bg-slate-200 rounded-2xl transition-all duration-300 relative overflow-hidden" style={{ height: col.height }}>
                  <div className={`absolute inset-0 rounded-2xl transition-all duration-300 ${
                    isHighlighted 
                      ? "bg-gradient-to-t from-sky-500 to-teal-400" 
                      : "bg-teal-500/10 group-hover:bg-teal-500/25"
                  }`} />
                </div>

                {/* Day Label */}
                <span className={`text-[10px] font-black uppercase tracking-wider font-mono mt-3 transition-colors ${
                  isHighlighted ? "text-slate-900 font-extrabold" : "text-slate-400"
                }`}>
                  {col.day}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* CARD GRID: Weekly learning time & Skill Master Chart */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Left card: Weekly learning time (Light violet/teal background style) */}
        <div className="bg-teal-50/40 rounded-3xl p-6 border border-teal-100/75 flex items-start gap-4 shadow-xs">
          <div className="w-12 h-12 rounded-2xl bg-teal-500 text-white flex items-center justify-center shrink-0 shadow-sm shadow-teal-100">
            <ClipboardList className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest font-mono">Weekly learning time</h4>
            <p className="text-xl font-black text-slate-800 leading-none">3h 45m</p>
            <p className="text-[11px] text-teal-600 font-bold leading-relaxed pt-1">
              Active vocabulary units finished &bull; +45 XP
            </p>
          </div>
        </div>

        {/* Right card: Skill Master Chart */}
        <div className="bg-sky-50/40 rounded-3xl p-6 border border-sky-100/75 flex items-start gap-4 shadow-xs">
          <div className="w-12 h-12 rounded-2xl bg-sky-500 text-white flex items-center justify-center shrink-0 shadow-sm shadow-sky-100">
            <Rocket className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest font-mono">Skill Master Chart</h4>
            <p className="text-xl font-black text-slate-800 leading-none">Voca {Math.min(100, 70 + completedScenarios.length)}%</p>
            <p className="text-[11px] text-sky-600 font-bold leading-relaxed pt-1">
              CEFR fluency benchmarks growing stronger.
            </p>
          </div>
        </div>
      </div>

      {/* STREAK TRACKER BAR: Mockup styled long white pill */}
      <div className="bg-white border-2 border-slate-200 border-b-6 rounded-3xl p-4.5 flex items-center justify-between hover:border-slate-300 transition-colors shadow-xs select-none">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-500">
            <Zap className="w-5 h-5 fill-amber-500 animate-pulse" />
          </div>
          <div>
            <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest font-mono">Streak Tracker</span>
            <p className="text-sm font-extrabold text-slate-800 leading-tight">
              {progress.streak}-day learning streak!
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-1">
          <span className="text-[10px] font-black text-slate-400 font-mono tracking-wider">MORE INFO</span>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </div>
      </div>

      {/* BENTO STATS EXTRA PANELS */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pt-2">
        
        {/* CEFR Milestones Academic Pool (col-span-6) */}
        <div className="col-span-12 md:col-span-6 bg-white p-6 rounded-3xl border-2 border-slate-200 border-b-6 shadow-sm space-y-4">
          <div>
            <h3 className="font-extrabold text-slate-800 text-sm flex items-center gap-2 font-display uppercase tracking-widest font-mono">
              <Trophy className="w-4.5 h-4.5 text-amber-500" /> Academic CEFR Milestones
            </h3>
            <p className="text-xs text-slate-450 mt-1">Difficulty tiers linked to common European framework standards.</p>
          </div>

          <div className="space-y-4 pt-1">
            {cefrStats.map((item) => (
              <div key={item.level} className="space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-700 font-sans">CEFR {item.level} ({item.level === 'A1' ? 'Beginner' : item.level === 'A2' ? 'Elementary' : item.level === 'B1' ? 'Intermediate' : 'Upper'})</span>
                  <span className="text-slate-500 font-bold font-mono">
                    {item.completed} / {item.total} Units ({item.percent}%)
                  </span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden p-[1px] border border-slate-200">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${
                      item.level === 'A1' ? 'bg-sky-500' : item.level === 'A2' ? 'bg-teal-500' : item.level === 'B1' ? 'bg-amber-500' : 'bg-rose-500'
                    }`}
                    style={{ width: `${item.percent}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Situational Categories (col-span-6) */}
        <div className="col-span-12 md:col-span-6 bg-white p-6 rounded-3xl border-2 border-slate-200 border-b-6 shadow-sm space-y-4">
          <div>
            <h3 className="font-extrabold text-slate-800 text-sm flex items-center gap-2 font-display uppercase tracking-widest font-mono">
              <Compass className="w-4.5 h-4.5 text-sky-550 scroll-spin shrink-0" /> Situational Categories
            </h3>
            <p className="text-xs text-slate-450 mt-1">Ratios for specific environments studied in Romanian culture.</p>
          </div>

          <div className="space-y-3 max-h-[250px] overflow-y-auto pr-1 scrollbar-thin">
            {categoryStats.map((cat) => (
              <div key={cat.name} className="flex justify-between items-center text-xs border-b border-slate-50 pb-2">
                <span className="font-semibold text-slate-700">{cat.name}</span>
                <div className="flex items-center gap-3">
                  <div className="w-24 bg-slate-100 h-1.5 rounded-full overflow-hidden border border-slate-200">
                    <div className="bg-teal-500 h-full rounded-full" style={{ width: `${cat.percent}%` }}></div>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-slate-400 w-8 text-right">
                    {cat.completed}/{cat.total}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Trophies cabinet display (col-span-12) */}
        <div className="col-span-12 bg-white p-6 rounded-3xl border-2 border-slate-200 border-b-6 shadow-sm space-y-6">
          <div>
            <h3 className="font-extrabold text-slate-800 text-sm flex items-center gap-2 font-display uppercase tracking-widest font-mono">
              <Award className="w-5.5 h-5.5 text-sky-600" /> Medals Cabinet
            </h3>
            <p className="text-xs text-slate-450 mt-1">Physical accomplishments earned. Gain badges by scoring perfectly on dialogue unit quizzes!</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {BADGES.map((badge) => {
              const hasBadge = progress.badges.includes(badge.id);
              return (
                <div 
                  key={badge.id}
                  className={`relative overflow-hidden rounded-2xl border p-4 text-center space-y-3 flex flex-col justify-between transition-all duration-300 ${
                    hasBadge 
                      ? 'border-slate-200 bg-slate-50 opacity-100 shadow-xs hover:scale-[1.02]' 
                      : 'border-slate-150 bg-slate-50/20 opacity-35 shadow-none'
                  }`}
                >
                  <div className="flex flex-col items-center pt-2">
                    <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${
                      hasBadge ? badge.color : 'from-slate-200 to-slate-250'
                    } flex items-center justify-center text-white text-lg shadow-inner`}>
                      {badge.id === 'welcome' ? '🏆' : badge.id === 'food_master' ? '🍲' : badge.id === 'mountain_explorer' ? '🏔️' : badge.id === 'social_butterfly' ? '🍷' : badge.id === 'vocab_champion' ? '🧬' : badge.id === 'roleplay_hero' ? '☄️' : badge.id === 'streak_fanatic' ? '🔥' : '🎓'}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <h4 className="font-extrabold text-slate-800 text-xs">{badge.name}</h4>
                    <p className="text-slate-400 text-[10px] leading-relaxed line-clamp-2 font-medium">
                      {badge.description}
                    </p>
                  </div>

                  <div className="border-t border-slate-100 pt-2.5 text-[9px] text-slate-400 font-mono">
                    {hasBadge ? (
                      <span className="text-teal-600 font-black uppercase tracking-wider flex items-center justify-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-teal-500 fill-teal-50" /> Acquired
                      </span>
                    ) : (
                      <span>Req: {badge.criteria}</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </motion.div>
  );
}
