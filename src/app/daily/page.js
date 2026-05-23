'use client';

import { useState, useEffect } from 'react';
import { useStore } from '@/store/useStore';
import { GlassCard } from '@/components/ui/GlassCard';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, Check, Trash2, Clock, Play, Square, 
  Maximize2, Minimize2, Droplet, Moon, Sun, 
  DollarSign, TrendingDown, Trash
} from 'lucide-react';

export default function DailyLife() {
  const { 
    tasks, addTask, toggleTask, deleteTask,
    waterIntake, addWaterIntake,
    sleep, updateSleep,
    finance, addTransaction, deleteTransaction, setBudget,
    completeFocusSession
  } = useStore();

  const [newTask, setNewTask] = useState('');
  
  // Focus Timer State
  const [timer, setTimer] = useState(25 * 60); // 25 mins
  const [isActive, setIsActive] = useState(false);
  const [isZenMode, setIsZenMode] = useState(false);

  // Finance Form State
  const [expenseTitle, setExpenseTitle] = useState('');
  const [expenseAmount, setExpenseAmount] = useState('');
  const [expenseCategory, setExpenseCategory] = useState('Yemek');
  const [budgetInput, setBudgetInput] = useState('');
  const [showBudgetModal, setShowBudgetModal] = useState(false);

  useEffect(() => {
    let interval = null;
    if (isActive && timer > 0) {
      interval = setInterval(() => setTimer(t => t - 1), 1000);
    } else if (timer === 0) {
      setIsActive(false);
      completeFocusSession(25); // Award XP
      setTimer(25 * 60); // Reset
      alert("Harika! Odaklanma seansını başarıyla tamamladın ve 50 XP kazandın.");
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

  const handleAddExpense = (e) => {
    e.preventDefault();
    if (!expenseTitle.trim() || !expenseAmount || isNaN(expenseAmount)) return;
    addTransaction({
      description: expenseTitle,
      amount: parseFloat(expenseAmount),
      category: expenseCategory,
      type: 'expense'
    });
    setExpenseTitle('');
    setExpenseAmount('');
  };

  const handleSetBudget = (e) => {
    e.preventDefault();
    if (!budgetInput || isNaN(budgetInput)) return;
    setBudget(parseFloat(budgetInput));
    setBudgetInput('');
    setShowBudgetModal(false);
  };

  const toggleTimer = () => setIsActive(!isActive);
  
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Sleep Calculations
  const calculateSleepDuration = (bed, wake) => {
    if (!bed || !wake) return 'Girilmedi';
    const [bedH, bedM] = bed.split(':').map(Number);
    const [wakeH, wakeM] = wake.split(':').map(Number);
    let diffMins = (wakeH * 60 + wakeM) - (bedH * 60 + bedM);
    if (diffMins < 0) {
      diffMins += 24 * 60; // slept overnight
    }
    const hrs = Math.floor(diffMins / 60);
    const mins = diffMins % 60;
    return `${hrs} saat ${mins > 0 ? `${mins} dk` : ''}`;
  };

  // Finance Calculations
  const todayStr = new Date().toISOString().split('T')[0];
  const todayTransactions = finance?.transactions?.filter(t => t.date === todayStr) || [];
  const todayTotalExpense = todayTransactions.reduce((acc, t) => acc + Number(t.amount), 0);
  const remainingBudget = (finance?.budget || 0) - todayTotalExpense;

  return (
    <div className="flex flex-col gap-8 pb-10">
      {/* Header */}
      <header className="flex justify-between items-center">
        <div>
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-4xl font-bold tracking-tight mb-2 text-gradient"
          >
            Günlük Takip
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="text-zinc-400 font-medium"
          >
            Günü kazanmak, geleceği inşa etmektir.
          </motion.p>
        </div>
      </header>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        
        {/* SOL KOLON */}
        <div className="flex flex-col gap-8">
          
          {/* GÖREVLER (Tasks) */}
          <GlassCard delay={0.2} className="flex flex-col h-[520px]">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-neon-green">
              <Check className="w-5 h-5" /> Günlük Görevler & Alışkanlıklar
            </h2>
            
            <form onSubmit={handleAddTask} className="flex gap-2 mb-6">
              <input 
                type="text"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                placeholder="Bugün ne yapacaksın?"
                className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-neon-green/50 transition-colors text-sm"
              />
              <button 
                type="submit"
                className="bg-neon-green/20 text-neon-green border border-neon-green/30 hover:bg-neon-green hover:text-black transition-all px-4 rounded-xl flex items-center justify-center"
              >
                <Plus size={20} />
              </button>
            </form>

            <div className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-thin">
              {todayTasks.length === 0 && (
                <div className="h-full flex items-center justify-center text-zinc-500 italic text-sm">
                  Bugün için henüz görev eklenmemiş.
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
                      : 'bg-black/30 border-white/10 hover:border-neon-green/40'
                  }`}
                >
                  <button 
                    onClick={() => toggleTask(task.id)}
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                      task.completed 
                        ? 'bg-neon-green border-neon-green text-black' 
                        : 'border-zinc-500 hover:border-neon-green'
                    }`}
                  >
                    {task.completed && <Check size={14} strokeWidth={3} />}
                  </button>
                  <span className={`flex-1 text-sm font-medium ${task.completed ? 'line-through text-zinc-500' : 'text-zinc-200'}`}>
                    {task.title}
                  </span>
                  <button 
                    onClick={() => deleteTask(task.id)}
                    className="text-zinc-500 hover:text-red-500 transition-colors p-2"
                  >
                    <Trash2 size={16} />
                  </button>
                </motion.div>
              ))}
            </div>
          </GlassCard>

          {/* FİNANS YÖNETİMİ (Finance) */}
          <GlassCard delay={0.3} className="flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold flex items-center gap-2 text-rose-400">
                <DollarSign className="w-5 h-5" /> Günlük Bütçe & Harcamalar
              </h2>
              <button 
                onClick={() => {
                  setBudgetInput(finance?.budget?.toString() || '');
                  setShowBudgetModal(true);
                }}
                className="text-xs bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg px-3 py-1.5 text-zinc-300 transition-all"
              >
                Bütçe Ayarla ({finance?.budget || 0} {finance?.currency || 'TRY'})
              </button>
            </div>

            {/* Bütçe Bilgileri */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-black/40 border border-white/5 rounded-xl p-4 flex flex-col justify-center">
                <span className="text-xs text-zinc-500 font-medium">Bugünkü Harcama</span>
                <span className="text-2xl font-bold text-rose-400 mt-1">{todayTotalExpense.toLocaleString()} ₺</span>
              </div>
              <div className={`border rounded-xl p-4 flex flex-col justify-center ${
                remainingBudget < 0 ? 'bg-red-500/10 border-red-500/20' : 'bg-black/40 border-white/5'
              }`}>
                <span className="text-xs text-zinc-500 font-medium">Kalan Bütçe</span>
                <span className={`text-2xl font-bold mt-1 ${remainingBudget < 0 ? 'text-red-500' : 'text-emerald-400'}`}>
                  {remainingBudget.toLocaleString()} ₺
                </span>
              </div>
            </div>

            {/* Yeni Harcama Girişi */}
            <form onSubmit={handleAddExpense} className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-6">
              <input 
                type="text"
                value={expenseTitle}
                onChange={(e) => setExpenseTitle(e.target.value)}
                placeholder="Harcama açıklaması..."
                required
                className="bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-zinc-500 focus:outline-none focus:border-rose-400/50 transition-colors text-sm sm:col-span-1"
              />
              <div className="flex gap-2 sm:col-span-2">
                <input 
                  type="number"
                  value={expenseAmount}
                  onChange={(e) => setExpenseAmount(e.target.value)}
                  placeholder="Tutar (₺)..."
                  required
                  min="0"
                  step="0.01"
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-zinc-500 focus:outline-none focus:border-rose-400/50 transition-colors text-sm"
                />
                <select
                  value={expenseCategory}
                  onChange={(e) => setExpenseCategory(e.target.value)}
                  className="bg-black/40 border border-white/10 rounded-xl px-2 py-2.5 text-white focus:outline-none focus:border-rose-400/50 transition-colors text-sm"
                >
                  <option value="Yemek">Yemek</option>
                  <option value="Ulaşım">Ulaşım</option>
                  <option value="Alışveriş">Alışveriş</option>
                  <option value="Eğitim">Eğitim</option>
                  <option value="Spor">Spor</option>
                  <option value="Diğer">Diğer</option>
                </select>
                <button 
                  type="submit"
                  className="bg-rose-400/20 text-rose-400 border border-rose-400/30 hover:bg-rose-400 hover:text-black transition-all px-4 rounded-xl flex items-center justify-center shrink-0"
                >
                  Ekle
                </button>
              </div>
            </form>

            {/* Bugünkü Harcamalar Listesi */}
            <div className="max-h-[200px] overflow-y-auto space-y-2 pr-2 scrollbar-thin">
              {todayTransactions.length === 0 ? (
                <div className="text-center text-zinc-500 text-xs py-4 italic">
                  Bugün henüz harcama girilmemiş.
                </div>
              ) : (
                todayTransactions.map(t => (
                  <div key={t.id} className="flex justify-between items-center bg-black/20 border border-white/5 rounded-xl p-3 text-sm">
                    <div className="flex flex-col">
                      <span className="font-medium text-zinc-200">{t.description}</span>
                      <span className="text-[10px] text-zinc-500 mt-0.5">{t.category}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-semibold text-rose-400">-{t.amount} ₺</span>
                      <button 
                        onClick={() => deleteTransaction(t.id)}
                        className="text-zinc-500 hover:text-red-500 transition-colors p-1"
                      >
                        <Trash size={14} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </GlassCard>

        </div>

        {/* SAĞ KOLON */}
        <div className="flex flex-col gap-8">
          
          {/* SAĞLIK VE VİTALİTE: SU & UYKU (Water & Sleep) */}
          <GlassCard delay={0.25} className="flex flex-col gap-6">
            <h2 className="text-xl font-bold flex items-center gap-2 text-cyan-400">
              <Droplet className="w-5 h-5" /> Sağlık & Vitalite
            </h2>

            {/* SU BÖLÜMÜ */}
            <div className="border-b border-white/5 pb-6">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="text-md font-semibold text-zinc-200">Su Tüketimi</h3>
                  <p className="text-xs text-zinc-500 mt-0.5">Günlük Hedef: 8 Bardak</p>
                </div>
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => addWaterIntake(-1)}
                    className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-300 flex items-center justify-center font-bold text-lg transition-all"
                  >
                    -
                  </button>
                  <span className="text-lg font-bold text-cyan-400">{waterIntake} / 8</span>
                  <button 
                    onClick={() => addWaterIntake(1)}
                    className="w-8 h-8 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/30 text-cyan-400 flex items-center justify-center font-bold text-lg transition-all"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Su Bardakları Görsel İzleme */}
              <div className="flex justify-between gap-1 mt-2">
                {[...Array(8)].map((_, i) => {
                  const active = waterIntake > i;
                  return (
                    <button
                      key={i}
                      onClick={() => {
                        const diff = (i + 1) - waterIntake;
                        addWaterIntake(diff);
                      }}
                      className={`flex-1 h-12 rounded-xl border flex flex-col items-center justify-center transition-all ${
                        active 
                          ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-[0_0_12px_rgba(34,211,238,0.3)]' 
                          : 'bg-black/30 border-white/5 text-zinc-600 hover:border-cyan-500/20'
                      }`}
                    >
                      <Droplet size={18} className={active ? "animate-pulse" : ""} />
                      <span className="text-[9px] mt-1 font-semibold">{i + 1}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* UYKU BÖLÜMÜ */}
            <div>
              <h3 className="text-md font-semibold text-zinc-200 mb-4 flex items-center gap-2">
                <Moon className="w-4 h-4 text-indigo-400" /> Uyku Düzeni
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-xs text-zinc-500 mb-1.5 font-medium">Yatış Saati</label>
                  <div className="relative">
                    <input 
                      type="time" 
                      value={sleep?.bedtime || ''}
                      onChange={(e) => updateSleep({ bedtime: e.target.value })}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-zinc-200 focus:outline-none focus:border-indigo-400/50"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-zinc-500 mb-1.5 font-medium">Uyanış Saati</label>
                  <div className="relative">
                    <input 
                      type="time" 
                      value={sleep?.wakeTime || ''}
                      onChange={(e) => updateSleep({ wakeTime: e.target.value })}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-zinc-200 focus:outline-none focus:border-indigo-400/50"
                    />
                  </div>
                </div>
              </div>

              {/* Uyku Kalitesi & Hesaplanan Süre */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-black/40 border border-white/5 rounded-xl p-4">
                <div>
                  <span className="text-xs text-zinc-500 font-medium">Toplam Uyku Süresi</span>
                  <div className="text-lg font-bold text-indigo-300 mt-0.5">
                    {calculateSleepDuration(sleep?.bedtime, sleep?.wakeTime)}
                  </div>
                </div>
                <div className="w-full sm:w-auto">
                  <span className="text-xs text-zinc-500 font-medium block mb-1.5">Uyku Kalitesi</span>
                  <div className="flex gap-2">
                    {['poor', 'medium', 'good'].map((q) => {
                      const active = (sleep?.quality || 'medium') === q;
                      const label = q === 'poor' ? 'Kötü' : q === 'medium' ? 'Orta' : 'İyi';
                      return (
                        <button
                          key={q}
                          onClick={() => updateSleep({ quality: q })}
                          className={`text-xs px-3 py-1.5 rounded-lg border transition-all ${
                            active 
                              ? 'bg-indigo-500/20 border-indigo-400 text-indigo-300 font-semibold' 
                              : 'bg-black/20 border-white/5 text-zinc-500 hover:text-zinc-300'
                          }`}
                        >
                          {label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </GlassCard>

          {/* ODAKLANMA PROTOKOLÜ (Focus Protocol) */}
          <GlassCard delay={0.35} className="flex flex-col items-center justify-center py-12 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 z-10">
              <button 
                onClick={() => setIsZenMode(true)}
                className="text-zinc-500 hover:text-white transition-all p-2 rounded-lg hover:bg-white/5"
                title="Zen Moduna Gir"
              >
                <Maximize2 size={18} />
              </button>
            </div>

            <h2 className="text-md font-bold mb-4 flex items-center gap-2 text-zinc-300">
              <Clock className="text-purple-400 w-4 h-4" /> Odaklanma Protokolü
            </h2>
            
            <div className="text-6xl font-mono font-bold tracking-tight text-white mb-6 drop-shadow-[0_0_15px_rgba(176,38,255,0.3)]">
              {formatTime(timer)}
            </div>
            
            <div className="flex gap-4">
              <button 
                onClick={toggleTimer}
                className="w-12 h-12 rounded-full bg-purple-500/20 border border-purple-500/40 text-purple-300 flex items-center justify-center hover:bg-purple-500 hover:text-white transition-all shadow-[0_0_12px_rgba(176,38,255,0.2)]"
              >
                {isActive ? <Square size={16} fill="currentColor" /> : <Play size={18} className="ml-0.5" fill="currentColor" />}
              </button>
              <button 
                onClick={() => {
                  setIsActive(false);
                  setTimer(25 * 60);
                }}
                className="text-xs text-zinc-500 hover:text-zinc-300 bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-2 rounded-xl transition-all"
              >
                Sıfırla
              </button>
            </div>
          </GlassCard>

          {/* GÜNLÜK NOTLAR & REFLEKSİYONLAR */}
          <GlassCard delay={0.4} className="flex-1">
            <h3 className="font-bold mb-4 text-zinc-300">Günlük Notlar & Refleksiyonlar</h3>
            <textarea 
              className="w-full h-32 bg-black/40 border border-white/10 rounded-xl p-4 text-white placeholder-zinc-600 focus:outline-none focus:border-purple-400/50 transition-colors resize-none text-sm"
              placeholder="Bugün ne öğrendin? Neyi daha iyi yapabilirdin?"
            ></textarea>
          </GlassCard>

        </div>
      </div>

      {/* BÜTÇE AYARLAMA MODALI */}
      <AnimatePresence>
        {showBudgetModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-zinc-950 border border-white/10 rounded-2xl p-6 w-full max-w-sm shadow-2xl"
            >
              <h3 className="text-lg font-bold text-white mb-4">Günlük Limit Bütçesi</h3>
              <form onSubmit={handleSetBudget} className="flex flex-col gap-4">
                <input 
                  type="number"
                  value={budgetInput}
                  onChange={(e) => setBudgetInput(e.target.value)}
                  placeholder="Bütçe limitini gir (₺)..."
                  required
                  min="1"
                  className="bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-rose-400/50"
                />
                <div className="flex justify-end gap-2">
                  <button 
                    type="button" 
                    onClick={() => setShowBudgetModal(false)}
                    className="text-xs text-zinc-400 hover:text-white px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
                  >
                    Vazgeç
                  </button>
                  <button 
                    type="submit" 
                    className="text-xs font-semibold text-black bg-rose-400 hover:bg-rose-300 px-4 py-2.5 rounded-xl transition-colors"
                  >
                    Bütçeyi Kaydet
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

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
              <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-[120px] animate-pulse" style={{ animationDuration: '8s' }} />
              <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[150px] animate-pulse" style={{ animationDuration: '12s', animationDelay: '2s' }} />
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
