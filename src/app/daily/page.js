'use client';

import { useState, useEffect, useRef } from 'react';
import { useStore } from '@/store/useStore';
import { GlassCard } from '@/components/ui/GlassCard';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Check, Trash2, Clock, Play, Square, Headphones, Maximize2, Minimize2 } from 'lucide-react';

export default function DailyLife() {
  const { tasks, addTask, toggleTask, deleteTask } = useStore();
  const [newTask, setNewTask] = useState('');
  
  // Focus Timer State
  const [timer, setTimer] = useState(25 * 60); // 25 mins
  const [isActive, setIsActive] = useState(false);
  const [isZenMode, setIsZenMode] = useState(false);

  useEffect(() => {
    let interval = null;
    if (isActive && timer > 0) {
      interval = setInterval(() => setTimer(t => t - 1), 1000);
    } else if (timer === 0) {
      setIsActive(false);
      // Auto-award XP logic could go here via store
    }
    return () => clearInterval(interval);
  }, [isActive, timer]);

  const todayTasks = tasks.filter(t => t.type === 'daily' || !t.type);

  const handleAddTask = (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;
    addTask({ title: newTask, type: 'daily' });
    setNewTask('');
  };

  const toggleTimer = () => setIsActive(!isActive);
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col gap-8 pb-10">
      <header>
        <motion.h1 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-4xl font-bold tracking-tight mb-2 text-gradient"
        >
          Daily Life
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="text-zinc-400"
        >
          Win the day to win the year.
        </motion.p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Task Management */}
        <GlassCard delay={0.2} className="flex flex-col h-[600px]">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Check className="text-neon-green" /> Tasks & Habits
          </h2>
          
          <form onSubmit={handleAddTask} className="flex gap-2 mb-6">
            <input 
              type="text"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              placeholder="What needs to be done?"
              className="flex-1 bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-neon-blue transition-colors"
            />
            <button 
              type="submit"
              className="bg-neon-blue/20 text-neon-blue border border-neon-blue/50 hover:bg-neon-blue hover:text-black transition-colors px-4 py-2 rounded-lg flex items-center justify-center"
            >
              <Plus size={24} />
            </button>
          </form>

          <div className="flex-1 overflow-y-auto space-y-3 pr-2">
            {todayTasks.length === 0 && (
              <div className="h-full flex items-center justify-center text-zinc-500 italic">
                No tasks added yet. Set your daily goals!
              </div>
            )}
            {todayTasks.map(task => (
              <motion.div 
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                key={task.id} 
                className={`flex items-center gap-3 p-4 rounded-xl border transition-all ${
                  task.completed 
                    ? 'bg-white/5 border-white/5 opacity-50' 
                    : 'bg-black/40 border-white/10 hover:border-neon-blue/50'
                }`}
              >
                <button 
                  onClick={() => toggleTask(task.id)}
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                    task.completed 
                      ? 'bg-neon-green border-neon-green text-black' 
                      : 'border-zinc-500 hover:border-neon-green'
                  }`}
                >
                  {task.completed && <Check size={14} strokeWidth={3} />}
                </button>
                <span className={`flex-1 font-medium ${task.completed ? 'line-through text-zinc-500' : 'text-zinc-200'}`}>
                  {task.title}
                </span>
                <button 
                  onClick={() => deleteTask(task.id)}
                  className="text-zinc-500 hover:text-red-500 transition-colors p-2"
                >
                  <Trash2 size={18} />
                </button>
              </motion.div>
            ))}
          </div>
        </GlassCard>

        {/* Focus Timer */}
        <div className="flex flex-col gap-8">
          <GlassCard delay={0.3} className="flex flex-col items-center justify-center py-16">
            <h2 className="text-xl font-bold mb-8 flex items-center gap-2 text-zinc-300">
              <Clock className="text-neon-purple" /> Focus Protocol
            </h2>
            
            <div className="text-7xl md:text-8xl font-mono font-bold tracking-tight text-white mb-10 drop-shadow-[0_0_15px_rgba(176,38,255,0.4)]">
              {formatTime(timer)}
            </div>
            
            <div className="flex gap-4">
              <button 
                onClick={toggleTimer}
                className="w-16 h-16 rounded-full bg-neon-purple/20 border border-neon-purple text-neon-purple flex items-center justify-center hover:bg-neon-purple hover:text-white transition-all shadow-[0_0_15px_rgba(176,38,255,0.3)]"
              >
                {isActive ? <Square size={24} fill="currentColor" /> : <Play size={28} className="ml-1" fill="currentColor" />}
              </button>
              <button 
                onClick={() => setIsZenMode(true)}
                className="w-16 h-16 rounded-full bg-white/5 border border-white/10 text-white flex items-center justify-center hover:bg-white/10 transition-all"
                title="Enter Zen Mode"
              >
                <Maximize2 size={24} />
              </button>
            </div>
          </GlassCard>

          <GlassCard delay={0.4} className="flex-1">
            <h3 className="font-bold mb-4 text-zinc-300">Daily Notes & Reflections</h3>
            <textarea 
              className="w-full h-32 bg-black/50 border border-white/10 rounded-lg p-4 text-white placeholder-zinc-500 focus:outline-none focus:border-neon-purple transition-colors resize-none"
              placeholder="What did you learn today? What could be better?"
            ></textarea>
          </GlassCard>
        </div>
      </div>

      {/* ZEN MODE FULLSCREEN OVERLAY */}
      <AnimatePresence>
        {isZenMode && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black overflow-hidden flex flex-col items-center justify-center"
          >
            {/* Ambient Background Animation */}
            <div className="absolute inset-0 z-0 opacity-40">
              <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-neon-purple/30 rounded-full blur-[120px] animate-pulse" style={{ animationDuration: '8s' }} />
              <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-neon-blue/20 rounded-full blur-[150px] animate-pulse" style={{ animationDuration: '12s', animationDelay: '2s' }} />
            </div>

            <button 
              onClick={() => setIsZenMode(false)}
              className="absolute top-8 right-8 z-20 text-zinc-500 hover:text-white p-4 rounded-full hover:bg-white/10 transition-colors"
            >
              <Minimize2 size={28} />
            </button>

            <div className="relative z-10 flex flex-col items-center gap-12">
              <motion.div 
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                className="text-[150px] md:text-[250px] leading-none font-mono font-bold tracking-tighter text-white drop-shadow-[0_0_40px_rgba(176,38,255,0.6)]"
              >
                {formatTime(timer)}
              </motion.div>

              <div className="flex gap-8">
                <button 
                  onClick={toggleTimer}
                  className="w-24 h-24 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 transition-transform shadow-[0_0_30px_rgba(255,255,255,0.3)]"
                >
                  {isActive ? <Square size={40} fill="currentColor" /> : <Play size={44} className="ml-2" fill="currentColor" />}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
