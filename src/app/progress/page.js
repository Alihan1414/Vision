'use client';

import { useStore } from '@/store/useStore';
import { GlassCard } from '@/components/ui/GlassCard';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { motion } from 'framer-motion';
import { Trophy, TrendingUp, Target, Flame, Check } from 'lucide-react';

export default function Progress() {
  const { user, progress } = useStore();

  const achievements = [
    { id: 1, title: 'First Steps', desc: 'Created your VisionOS account.', completed: true },
    { id: 2, title: '7 Day Discipline', desc: 'Maintain a 7-day streak.', completed: user.streak >= 7 },
    { id: 3, title: 'Polyglot Junior', desc: 'Reach 30% in French or English.', completed: progress.french >= 30 || progress.english >= 30 },
    { id: 4, title: 'Code Builder', desc: 'Complete 3 software projects.', completed: false },
  ];

  return (
    <div className="flex flex-col gap-8 pb-10">
      <header>
        <motion.h1 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-4xl font-bold tracking-tight mb-2 text-gradient"
        >
          Progress & Analytics
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="text-zinc-400"
        >
          Track your evolution across all disciplines.
        </motion.p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Stats */}
        <div className="lg:col-span-2 flex flex-col gap-8">
          <GlassCard delay={0.2}>
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <TrendingUp className="text-neon-blue" /> Skill Trees
            </h2>
            <div className="space-y-6">
              <ProgressBar progress={progress.french} label="French Mastery" color="neon-blue" />
              <ProgressBar progress={progress.english} label="English Mastery" color="neon-purple" />
              <ProgressBar progress={progress.software} label="Software Engineering" color="neon-green" />
              <ProgressBar progress={progress.discipline} label="Discipline & Habits" color="white" />
            </div>
          </GlassCard>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <GlassCard delay={0.3} className="bg-gradient-to-br from-white/5 to-white/0">
              <h3 className="font-bold text-zinc-300 mb-4 flex items-center gap-2">
                <Target className="text-neon-green" size={20} /> Current Level
              </h3>
              <div className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-neon-green to-white mb-2">
                Lv. {user.level}
              </div>
              <p className="text-sm text-zinc-400">XP: {user.xp} / {user.level * 1000}</p>
            </GlassCard>

            <GlassCard delay={0.4} className="bg-gradient-to-br from-orange-500/10 to-red-500/10 border-orange-500/20">
              <h3 className="font-bold text-zinc-300 mb-4 flex items-center gap-2">
                <Flame className="text-orange-500" size={20} /> Active Streak
              </h3>
              <div className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-orange-500 to-yellow-300 mb-2">
                {user.streak} Days
              </div>
              <p className="text-sm text-zinc-400">Keep the momentum going.</p>
            </GlassCard>
          </div>
        </div>

        {/* Achievements */}
        <div className="flex flex-col gap-6">
          <GlassCard delay={0.5} className="flex-1 overflow-hidden flex flex-col">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Trophy className="text-yellow-400" /> Achievements
            </h2>
            
            <div className="flex-1 overflow-y-auto space-y-4 pr-2">
              {achievements.map((ach) => (
                <div 
                  key={ach.id} 
                  className={`p-4 rounded-xl border relative overflow-hidden ${
                    ach.completed 
                      ? 'bg-yellow-400/10 border-yellow-400/30' 
                      : 'bg-black/40 border-white/10 opacity-60 grayscale'
                  }`}
                >
                  {ach.completed && (
                    <div className="absolute top-0 right-0 p-2">
                      <Check className="text-yellow-400" size={16} />
                    </div>
                  )}
                  <h4 className={`font-bold ${ach.completed ? 'text-yellow-400' : 'text-zinc-300'} mb-1`}>
                    {ach.title}
                  </h4>
                  <p className="text-xs text-zinc-400">{ach.desc}</p>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>

      </div>
    </div>
  );
}
