'use client';

import { useState, useEffect } from 'react';
import { useStore } from '@/store/useStore';
import { GlassCard } from '@/components/ui/GlassCard';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Dumbbell, Flame, Activity, Timer, Plus, CheckCircle2,
  TrendingUp, Trophy, Zap, X, Heart, BarChart3, ChevronUp
} from 'lucide-react';

const WORKOUT_TEMPLATES = [
  {
    id: 'push',
    name: 'Üst Vücut – İtiş',
    emoji: '💪',
    color: 'from-red-500/20 to-orange-500/20',
    border: 'border-red-500/30',
    glow: 'text-red-400',
    exercises: ['Bench Press (Göğüs Bası)', 'Shoulder Press (Omuz Bası)', 'Triceps Dips', 'Push-Up'],
  },
  {
    id: 'pull',
    name: 'Üst Vücut – Çekiş',
    emoji: '🏋️',
    color: 'from-blue-500/20 to-cyan-500/20',
    border: 'border-blue-500/30',
    glow: 'text-blue-400',
    exercises: ['Pull-Up (Barfiks)', 'Bent Over Row', 'Biceps Curl', 'Face Pull'],
  },
  {
    id: 'legs',
    name: 'Alt Vücut',
    emoji: '🦵',
    color: 'from-neon-purple/20 to-indigo-500/20',
    border: 'border-neon-purple/30',
    glow: 'text-neon-purple',
    exercises: ['Squat (Çömelme)', 'Deadlift (Yerden Kaldırma)', 'Lunges (Öne Hamle)', 'Leg Press'],
  },
  {
    id: 'cardio',
    name: 'Kardiyo',
    emoji: '🏃',
    color: 'from-neon-green/20 to-teal-500/20',
    border: 'border-neon-green/30',
    glow: 'text-neon-green',
    exercises: ['Koşu (30 dk)', 'HIIT Antrenmanı', 'Bisiklet (20 dk)', 'Jump Rope (10 dk)'],
  },
  {
    id: 'core',
    name: 'Core & Karın',
    emoji: '⚡',
    color: 'from-yellow-500/20 to-orange-400/20',
    border: 'border-yellow-500/30',
    glow: 'text-yellow-400',
    exercises: ['Plank (60 sn)', 'Crunch', 'Russian Twist', 'Leg Raise'],
  },
];

export default function SporPage() {
  const { user, completeSporSession, progress, addXP } = useStore();
  const [activeWorkout, setActiveWorkout] = useState(null);
  const [completedExercises, setCompletedExercises] = useState([]);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const [showFinish, setShowFinish] = useState(false);

  // Workout timer
  useEffect(() => {
    if (!timerRunning) return;
    const interval = setInterval(() => setElapsedSeconds(s => s + 1), 1000);
    return () => clearInterval(interval);
  }, [timerRunning]);

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const startWorkout = (template) => {
    setActiveWorkout(template);
    setCompletedExercises([]);
    setElapsedSeconds(0);
    setTimerRunning(true);
    setShowFinish(false);
  };

  const toggleExercise = (ex) => {
    setCompletedExercises(prev =>
      prev.includes(ex) ? prev.filter(e => e !== ex) : [...prev, ex]
    );
  };

  const finishWorkout = () => {
    setTimerRunning(false);
    completeSporSession();
    addXP(Math.floor(elapsedSeconds / 60) * 3);
    setShowFinish(true);
  };

  const resetWorkout = () => {
    setActiveWorkout(null);
    setCompletedExercises([]);
    setElapsedSeconds(0);
    setTimerRunning(false);
    setShowFinish(false);
  };

  const sporProgress = progress?.spor || 0;
  const completionPercent = activeWorkout
    ? Math.round((completedExercises.length / activeWorkout.exercises.length) * 100)
    : 0;

  return (
    <div className="flex flex-col gap-8 pb-10">
      {/* Header */}
      <header>
        <motion.h1
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-4xl font-bold tracking-tight mb-2 text-gradient"
        >
          Spor & Fitness
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="text-zinc-400"
        >
          Vücudunu inşa et. Limitlerini zorla.
        </motion.p>
      </header>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'XP', value: user.xp, icon: Zap, color: 'text-yellow-400', bg: 'from-yellow-500/10 to-orange-500/10' },
          { label: 'Seviye', value: user.level, icon: Trophy, color: 'text-neon-purple', bg: 'from-purple-500/10 to-indigo-500/10' },
          { label: 'Spor %', value: `${sporProgress}%`, icon: TrendingUp, color: 'text-neon-green', bg: 'from-green-500/10 to-teal-500/10' },
          { label: 'Seri', value: `${user.streak} gün`, icon: Flame, color: 'text-orange-400', bg: 'from-orange-500/10 to-red-500/10' },
        ].map((stat, i) => (
          <GlassCard key={i} delay={0.1 * i} className={`bg-gradient-to-br ${stat.bg} flex items-center gap-3 py-4`}>
            <stat.icon size={24} className={stat.color} />
            <div>
              <p className="text-xl font-extrabold text-white">{stat.value}</p>
              <p className="text-[11px] text-zinc-400">{stat.label}</p>
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Active Workout or Template Picker */}
      <AnimatePresence mode="wait">
        {showFinish ? (
          <motion.div
            key="finish"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="col-span-full"
          >
            <GlassCard className="text-center py-14 border-neon-green/30 shadow-[0_0_60px_rgba(0,255,102,0.1)]">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', bounce: 0.5 }}
                className="w-24 h-24 bg-neon-green/20 rounded-full flex items-center justify-center mx-auto mb-6"
              >
                <Trophy size={48} className="text-neon-green" />
              </motion.div>
              <h2 className="text-3xl font-black text-white mb-2">Antrenman Tamamlandı! 🎉</h2>
              <p className="text-zinc-400 mb-2">
                <span className="text-neon-green font-bold">{activeWorkout?.name}</span> antrenmanını bitirdin.
              </p>
              <p className="text-zinc-500 mb-8">
                Süre: <span className="text-white font-bold">{formatTime(elapsedSeconds)}</span>
                &nbsp;·&nbsp;
                Egzersiz: <span className="text-white font-bold">{completedExercises.length}/{activeWorkout?.exercises.length}</span>
                &nbsp;·&nbsp;
                XP: <span className="text-yellow-400 font-bold">+{Math.floor(elapsedSeconds / 60) * 3 + 50}</span>
              </p>
              <button
                onClick={resetWorkout}
                className="bg-neon-green text-black font-bold px-10 py-3 rounded-xl hover:bg-white transition-colors"
              >
                Yeni Antrenman Seç
              </button>
            </GlassCard>
          </motion.div>
        ) : activeWorkout ? (
          <motion.div
            key="active"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <GlassCard className={`border ${activeWorkout.border} relative`}>
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{activeWorkout.emoji}</span>
                  <div>
                    <h2 className="text-xl font-bold text-white">{activeWorkout.name}</h2>
                    <p className="text-xs text-zinc-400">Antrenman devam ediyor...</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  {/* Timer */}
                  <div className={`flex items-center gap-2 font-mono font-bold text-2xl ${activeWorkout.glow}`}>
                    <Timer size={20} />
                    {formatTime(elapsedSeconds)}
                  </div>
                  <button onClick={resetWorkout} className="text-zinc-500 hover:text-white transition-colors">
                    <X size={20} />
                  </button>
                </div>
              </div>

              {/* Progress bar */}
              <div className="mb-6">
                <div className="flex justify-between text-xs text-zinc-400 mb-2">
                  <span>İlerleme</span>
                  <span>{completedExercises.length}/{activeWorkout.exercises.length} egzersiz</span>
                </div>
                <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-neon-green shadow-[0_0_8px_#00ff66]"
                    animate={{ width: `${completionPercent}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </div>

              {/* Exercise list */}
              <div className="space-y-3 mb-8">
                {activeWorkout.exercises.map((ex, i) => {
                  const done = completedExercises.includes(ex);
                  return (
                    <motion.button
                      key={i}
                      onClick={() => toggleExercise(ex)}
                      whileTap={{ scale: 0.97 }}
                      className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all ${
                        done
                          ? 'bg-neon-green/10 border-neon-green/40 text-neon-green'
                          : 'bg-black/30 border-white/10 text-zinc-300 hover:border-white/30'
                      }`}
                    >
                      {done ? (
                        <CheckCircle2 size={22} className="shrink-0" />
                      ) : (
                        <div className="w-5 h-5 rounded-full border-2 border-zinc-600 shrink-0" />
                      )}
                      <span className={`font-medium ${done ? 'line-through opacity-70' : ''}`}>{ex}</span>
                    </motion.button>
                  );
                })}
              </div>

              {/* Finish button */}
              <button
                onClick={finishWorkout}
                disabled={completedExercises.length === 0}
                className="w-full py-4 rounded-xl bg-neon-green/10 text-neon-green border border-neon-green/30 font-bold hover:bg-neon-green hover:text-black transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Trophy size={18} />
                Antrenmanı Tamamla
              </button>
            </GlassCard>
          </motion.div>
        ) : (
          <motion.div key="pick" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <h2 className="text-lg font-bold text-zinc-300 mb-4 flex items-center gap-2">
              <Dumbbell size={20} className="text-neon-blue" /> Antrenman Seç
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {WORKOUT_TEMPLATES.map((t, i) => (
                <GlassCard
                  key={t.id}
                  delay={0.1 * i}
                  className={`cursor-pointer bg-gradient-to-br ${t.color} border ${t.border} hover:scale-[1.02] transition-transform`}
                  onClick={() => startWorkout(t)}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-3xl">{t.emoji}</span>
                    <div>
                      <h3 className="font-bold text-white text-lg">{t.name}</h3>
                      <p className={`text-xs ${t.glow}`}>{t.exercises.length} egzersiz</p>
                    </div>
                  </div>
                  <ul className="space-y-1">
                    {t.exercises.map((ex, j) => (
                      <li key={j} className="text-xs text-zinc-400 flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-white/30" />
                        {ex}
                      </li>
                    ))}
                  </ul>
                  <button
                    className={`w-full mt-4 py-2.5 rounded-xl border ${t.border} ${t.glow} font-bold text-sm flex items-center justify-center gap-2 hover:bg-white/10 transition-colors`}
                    onClick={() => startWorkout(t)}
                  >
                    <Play size={14} />
                    Başlat
                  </button>
                </GlassCard>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Spor Progress Bar */}
      <GlassCard delay={0.5}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-white flex items-center gap-2">
            <BarChart3 size={20} className="text-neon-green" /> Spor Gelişimi
          </h2>
          <span className="text-neon-green font-bold text-sm">{sporProgress}%</span>
        </div>
        <div className="w-full bg-white/5 h-3 rounded-full overflow-hidden border border-white/5">
          <motion.div
            className="h-full bg-gradient-to-r from-neon-green to-teal-400 shadow-[0_0_10px_#00ff66]"
            animate={{ width: `${sporProgress}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />
        </div>
        <p className="text-xs text-zinc-500 mt-2">Her antrenman +10% – 100%'e ulaşınca seviye atlar ve sıfırlanır!</p>
      </GlassCard>
    </div>
  );
}

function Play({ size }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <polygon points="5,3 19,12 5,21" />
    </svg>
  );
}
