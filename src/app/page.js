'use client';

import { useState, useEffect } from 'react';
import { useStore } from '@/store/useStore';
import { GlassCard } from '@/components/ui/GlassCard';
import { ProgressRing } from '@/components/ui/ProgressRing';
import { motion } from 'framer-motion';
import { Target, Flame, Brain, BookOpen, Clock, Activity, TrendingUp, History, CheckCircle2, Circle } from 'lucide-react';

export default function Home() {
  const { user, progress, tasks, stats, namaz, toggleNamaz } = useStore();
  const [dailyFacts, setDailyFacts] = useState({ finance: '', history: '' });
  const [isLoadingFacts, setIsLoadingFacts] = useState(true);

  useEffect(() => {
    fetch('/api/daily-facts')
      .then(res => res.json())
      .then(data => {
        setDailyFacts(data);
        setIsLoadingFacts(false);
      })
      .catch(err => {
        console.error(err);
        setIsLoadingFacts(false);
      });
  }, []);

  const todayTasks = tasks.filter(t => t.type === 'daily' || !t.type);
  const completedTasks = todayTasks.filter(t => t.completed).length;
  // Calculate productivity based on completed tasks if stats.productivity is 0
  const taskProgress = todayTasks.length > 0 ? Math.round((completedTasks / todayTasks.length) * 100) : 0;
  const currentProductivity = stats?.productivity > 0 ? stats.productivity : taskProgress;

  return (
    <div className="flex flex-col gap-8 pb-10">
      {/* Header */}
      <header className="flex justify-between items-end">
        <div>
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-4xl font-bold tracking-tight mb-2"
          >
            Welcome back, <span className="text-gradient">Alihan</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="text-zinc-400"
          >
            Your personal development environment is ready.
          </motion.p>
        </div>
        <div className="flex gap-4">
          <div className="glass-panel px-4 py-2 flex items-center gap-2">
            <Flame className="text-orange-500" size={20} />
            <span className="font-bold">{user.streak} Day Streak</span>
          </div>
          <div className="glass-panel px-4 py-2 flex items-center gap-2">
            <Target className="text-neon-blue" size={20} />
            <span className="font-bold">Level {user.level}</span>
          </div>
        </div>
      </header>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Daily Summary */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            <GlassCard delay={0.2} className="flex flex-col items-center justify-center py-8">
              <Activity className="text-neon-green mb-4" size={32} />
              <h3 className="text-zinc-400 font-medium mb-1">Productivity</h3>
              <p className="text-3xl font-bold text-white">{currentProductivity}%</p>
            </GlassCard>

            <GlassCard delay={0.3} className="flex flex-col items-center justify-center py-8">
              <Clock className="text-neon-blue mb-4" size={32} />
              <h3 className="text-zinc-400 font-medium mb-1">Focus Time</h3>
              <p className="text-3xl font-bold text-white">
                {Math.floor((stats?.focusTimeMinutes || 0) / 60)}h {(stats?.focusTimeMinutes || 0) % 60}m
              </p>
            </GlassCard>

            <GlassCard delay={0.4} className="flex flex-col items-center justify-center py-8">
              <BookOpen className="text-neon-purple mb-4" size={32} />
              <h3 className="text-zinc-400 font-medium mb-1">Tasks Done</h3>
              <p className="text-3xl font-bold text-white">{completedTasks}/{todayTasks.length || 0}</p>
            </GlassCard>
          </div>

          {/* Development Rings */}
          <GlassCard delay={0.5} className="w-full">
            <div className="flex items-center gap-2 mb-6">
              <Brain className="text-white" size={24} />
              <h2 className="text-xl font-bold">Development Core</h2>
            </div>
            
            <div className="flex flex-wrap justify-around items-center gap-8 py-4">
              <ProgressRing progress={progress.french} color="neon-blue" label="French" />
              <ProgressRing progress={progress.english} color="neon-purple" label="English" />
              <ProgressRing progress={progress.software} color="neon-green" label="Software" />
              <ProgressRing progress={progress.spor} color="orange-500" label="Spor" />
              <ProgressRing progress={progress.discipline} color="white" label="Discipline" />
            </div>
          </GlassCard>
        </div>

        {/* Sidebar / Tasks summary */}
        <div className="flex flex-col gap-6">
          <GlassCard delay={0.6} className="flex-1">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Target size={20} className="text-neon-blue"/> Today's Objectives
            </h2>
            
            <div className="space-y-4">
              {todayTasks.length === 0 ? (
                <p className="text-zinc-500 text-sm text-center py-8">No tasks for today. Go to Daily Life to add some!</p>
              ) : (
                todayTasks.slice(0, 5).map(task => (
                  <div key={task.id} className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/5">
                    <div className={`w-4 h-4 rounded-full border flex-shrink-0 ${task.completed ? 'bg-neon-blue border-neon-blue shadow-[0_0_8px_#00f0ff]' : 'border-zinc-500'}`} />
                    <span className={`text-sm ${task.completed ? 'text-zinc-500 line-through' : 'text-zinc-200'}`}>
                      {task.title}
                    </span>
                  </div>
                ))
              )}
            </div>
            
            {todayTasks.length > 5 && (
              <p className="text-xs text-center text-zinc-500 mt-4">+ {todayTasks.length - 5} more tasks</p>
            )}
          </GlassCard>

          {/* Namaz Tracker */}
          <GlassCard delay={0.65} className="flex-1">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Activity size={20} className="text-neon-green"/> Günlük Namaz Takibi
            </h2>
            <div className="flex justify-between items-center bg-black/30 p-4 rounded-xl border border-white/5">
              {[
                { id: 'sabah', label: 'Sabah' },
                { id: 'ogle', label: 'Öğle' },
                { id: 'ikindi', label: 'İkindi' },
                { id: 'aksam', label: 'Akşam' },
                { id: 'yatsi', label: 'Yatsı' }
              ].map((vakit) => (
                <div key={vakit.id} className="flex flex-col items-center gap-2 cursor-pointer group" onClick={() => toggleNamaz && toggleNamaz(vakit.id)}>
                  <span className="text-xs uppercase text-zinc-400 group-hover:text-white transition-colors">{vakit.label}</span>
                  {namaz && namaz[vakit.id] ? (
                    <CheckCircle2 className="text-neon-green shadow-[0_0_10px_rgba(0,255,102,0.3)] rounded-full" size={28} />
                  ) : (
                    <Circle className="text-zinc-600 group-hover:text-white transition-colors" size={28} />
                  )}
                </div>
              ))}
            </div>
          </GlassCard>

          {/* Daily Facts */}
          <GlassCard delay={0.7} className="bg-gradient-to-br from-neon-green/10 to-neon-blue/10 border-neon-blue/20">
            <h3 className="font-bold mb-2 flex items-center gap-2"><TrendingUp size={16} className="text-neon-green"/> Günün Finans Tüyosu</h3>
            {isLoadingFacts ? (
              <div className="animate-pulse h-12 bg-white/10 rounded-md"></div>
            ) : (
              <p className="text-sm italic text-zinc-300">{dailyFacts?.finance || "Bugün için bir tüyo bulunamadı."}</p>
            )}
          </GlassCard>

          <GlassCard delay={0.8} className="bg-gradient-to-br from-orange-500/10 to-red-500/10 border-orange-500/20">
            <h3 className="font-bold mb-2 flex items-center gap-2"><History size={16} className="text-orange-500"/> Tarihte Bugün / Bilgi</h3>
            {isLoadingFacts ? (
              <div className="animate-pulse h-12 bg-white/10 rounded-md"></div>
            ) : (
              <p className="text-sm italic text-zinc-300">{dailyFacts?.history || "Bilgi alınamadı."}</p>
            )}
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
