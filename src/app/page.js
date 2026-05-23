'use client';

import { useState, useEffect } from 'react';
import { useStore } from '@/store/useStore';
import { GlassCard } from '@/components/ui/GlassCard';
import { ProgressRing } from '@/components/ui/ProgressRing';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Target, Flame, Brain, BookOpen, Clock, Activity, 
  TrendingUp, History, CheckCircle2, Circle, AlertCircle,
  Sparkles, ShieldAlert, Lightbulb, Compass, Award
} from 'lucide-react';

export default function Home() {
  const { 
    user, progress, tasks, stats, namaz, toggleNamaz,
    waterIntake, sleep, finance, books, goals 
  } = useStore();

  const [dailyFacts, setDailyFacts] = useState({ finance: '', history: '' });
  const [isLoadingFacts, setIsLoadingFacts] = useState(true);

  // AI Weekly Report State
  const [weeklyReport, setWeeklyReport] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Smart Context-Aware Alert state
  const [smartAlert, setSmartAlert] = useState(null);

  useEffect(() => {
    // Fetch daily facts from API
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

  // Compute today's values
  const todayTasks = tasks.filter(t => t.type === 'daily' || !t.type);
  const completedTasks = todayTasks.filter(t => t.completed).length;
  const taskProgress = todayTasks.length > 0 ? Math.round((completedTasks / todayTasks.length) * 100) : 0;
  const currentProductivity = stats?.productivity > 0 ? stats.productivity : taskProgress;

  const completedNamazCount = Object.values(namaz || {}).filter(Boolean).length;
  const namazPercent = Math.round((completedNamazCount / 5) * 100);

  const todayStr = new Date().toISOString().split('T')[0];
  const todayTransactions = finance?.transactions?.filter(t => t.date === todayStr) || [];
  const todayTotalExpense = todayTransactions.reduce((acc, t) => acc + Number(t.amount), 0);

  // Generate Smart Alerts client-side
  useEffect(() => {
    const alerts = [];
    if (waterIntake < 4) {
      alerts.push({
        type: 'warning',
        text: `Bugün sadece ${waterIntake} bardak su içtin. Dehidrasyonu önlemek için şimdi büyük bir bardak su al! 💧`
      });
    }
    if (!sleep?.bedtime || !sleep?.wakeTime) {
      alerts.push({
        type: 'info',
        text: "Uyku saatlerini girmeyi unuttun. Düzenli takip için uyku verilerini güncellemeyi dene! 🌙"
      });
    }
    if (completedNamazCount < 3) {
      alerts.push({
        type: 'namaz',
        text: `Bugün ${completedNamazCount}/5 namaz kılındı. Diğer vakitleri kaçırmamak için hazır ol! 🕋`
      });
    }
    if (finance?.budget > 0 && todayTotalExpense > finance.budget) {
      alerts.push({
        type: 'danger',
        text: "Dikkat! Bugün belirlediğin bütçe limitini aştın. Harcamalarını gözden geçir! ⚠️"
      });
    }
    if (user.streak > 0 && user.streak % 3 === 0) {
      alerts.push({
        type: 'success',
        text: `Harika gidiyorsun! ${user.streak} günlük serinle disiplin seviyen tavan yaptı! 🔥`
      });
    }

    if (alerts.length > 0) {
      // Pick one randomly or systematically
      const randomAlert = alerts[Math.floor(Math.random() * alerts.length)];
      setSmartAlert(randomAlert);
    } else {
      setSmartAlert({
        type: 'success',
        text: "Bugün tüm standartların mükemmel gidiyor. Disiplini koru! 🚀"
      });
    }
  }, [waterIntake, sleep, namaz, finance, todayTotalExpense, user.streak]);

  // Request Weekly AI Coach report
  const handleGetAIReport = async () => {
    setIsAnalyzing(true);
    setWeeklyReport(null);
    try {
      const res = await fetch('/api/weekly-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user,
          progress,
          namaz,
          waterIntake,
          sleep,
          finance: {
            transactionsCount: finance?.transactions?.length || 0,
            budget: finance?.budget || 0,
            todayExpense: todayTotalExpense
          },
          books: {
            current: books?.current?.title || 'Yok',
            completedCount: books?.completed?.length || 0
          },
          goalsCount: goals?.length || 0
        })
      });
      const data = await res.json();
      if (data.error) {
        alert("Gemini Hatası: " + data.error);
      } else {
        setWeeklyReport(data);
      }
    } catch (err) {
      console.error(err);
      alert("Hata: AI Raporu alınamadı. Lütfen API anahtarını kontrol edin.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="flex flex-col gap-8 pb-10">
      
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-4xl font-bold tracking-tight mb-2"
          >
            Tekrar Hoş Geldin, <span className="text-gradient">Alihan</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="text-zinc-400 font-medium"
          >
            Kişisel gelişim kontrol panelin hazır.
          </motion.p>
        </div>
        <div className="flex gap-3">
          <div className="glass-panel px-4 py-2.5 flex items-center gap-2 border-orange-500/20 shadow-[0_0_12px_rgba(249,115,22,0.15)]">
            <Flame className="text-orange-500" size={18} />
            <span className="font-bold text-sm text-zinc-100">{user.streak} Günlük Seri</span>
          </div>
          <div className="glass-panel px-4 py-2.5 flex items-center gap-2 border-neon-blue/20 shadow-[0_0_12px_rgba(6,182,212,0.15)]">
            <Target className="text-neon-blue" size={18} />
            <span className="font-bold text-sm text-zinc-100">Seviye {user.level}</span>
          </div>
        </div>
      </header>

      {/* Smart Alert Banner */}
      {smartAlert && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`glass-panel border p-4 rounded-2xl flex items-center gap-3 relative overflow-hidden ${
            smartAlert.type === 'danger' ? 'bg-red-500/10 border-red-500/20 text-red-300' :
            smartAlert.type === 'warning' ? 'bg-cyan-500/10 border-cyan-500/20 text-cyan-300' :
            smartAlert.type === 'namaz' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300' :
            smartAlert.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300' :
            'bg-indigo-500/10 border-indigo-500/20 text-indigo-300'
          }`}
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-white/2 opacity-5 rounded-full blur-xl" />
          <AlertCircle size={20} className="shrink-0" />
          <span className="text-xs font-semibold leading-relaxed">{smartAlert.text}</span>
        </motion.div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left/Middle Column (2/3) */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          
          {/* Quick Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            <GlassCard delay={0.2} className="flex flex-col items-center justify-center py-8">
              <Activity className="text-neon-green mb-4 animate-pulse" size={32} />
              <h3 className="text-zinc-400 font-medium mb-1 text-sm">Üretkenlik</h3>
              <p className="text-3xl font-extrabold text-white">{currentProductivity}%</p>
            </GlassCard>

            <GlassCard delay={0.25} className="flex flex-col items-center justify-center py-8">
              <Clock className="text-neon-blue mb-4" size={32} />
              <h3 className="text-zinc-400 font-medium mb-1 text-sm">Odaklanma</h3>
              <p className="text-3xl font-extrabold text-white">
                {Math.floor((stats?.focusTimeMinutes || 0) / 60)}s {(stats?.focusTimeMinutes || 0) % 60}dk
              </p>
            </GlassCard>

            <GlassCard delay={0.3} className="flex flex-col items-center justify-center py-8">
              <BookOpen className="text-neon-purple mb-4" size={32} />
              <h3 className="text-zinc-400 font-medium mb-1 text-sm">Görevler</h3>
              <p className="text-3xl font-extrabold text-white">{completedTasks}/{todayTasks.length || 0}</p>
            </GlassCard>
          </div>

          {/* Development Rings */}
          <GlassCard delay={0.35} className="w-full">
            <div className="flex items-center gap-2 mb-6">
              <Brain className="text-white w-5 h-5" />
              <h2 className="text-xl font-bold">Gelişim Çekirdeği (Development Core)</h2>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-6 py-4 justify-items-center">
              <ProgressRing progress={progress.french} color="neon-blue" label="Fransızca" />
              <ProgressRing progress={progress.english} color="neon-purple" label="İngilizce" />
              <ProgressRing progress={progress.software} color="neon-green" label="Yazılım" />
              <ProgressRing progress={progress.spor} color="orange" label="Spor" />
              <ProgressRing progress={progress.discipline} color="white" label="Disiplin" />
            </div>
          </GlassCard>

          {/* AI Weekly Coach Widget */}
          <GlassCard delay={0.4} className="relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-purple-500/5 rounded-full blur-[120px] -z-10" />
            
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold flex items-center gap-2 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-300">
                <Sparkles className="w-5 h-5 text-purple-400" /> Yapay Zeka Gelişim Koçu
              </h2>
              {!weeklyReport && !isAnalyzing && (
                <button
                  onClick={handleGetAIReport}
                  className="bg-purple-500/20 hover:bg-purple-600 border border-purple-500/30 text-purple-300 text-xs font-semibold px-4 py-2 rounded-xl transition-all"
                >
                  Analiz Raporu Oluştur
                </button>
              )}
            </div>

            {isAnalyzing && (
              <div className="flex flex-col items-center justify-center py-12 gap-3">
                <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
                <span className="text-sm text-zinc-400 font-medium">Haftalık verilerin analiz ediliyor, koç raporu hazırlanıyor...</span>
              </div>
            )}

            {weeklyReport && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4 text-sm"
              >
                <div className="flex gap-3 bg-emerald-500/5 border border-emerald-500/10 p-4 rounded-xl">
                  <Award className="text-emerald-400 shrink-0 w-5 h-5 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-emerald-400 text-xs uppercase tracking-wider mb-1">En Güçlü Yönün</h4>
                    <p className="text-zinc-300 text-xs leading-relaxed">{weeklyReport.strength}</p>
                  </div>
                </div>

                <div className="flex gap-3 bg-red-500/5 border border-red-500/10 p-4 rounded-xl">
                  <ShieldAlert className="text-red-400 shrink-0 w-5 h-5 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-red-400 text-xs uppercase tracking-wider mb-1">Dikkat Etmen Gereken</h4>
                    <p className="text-zinc-300 text-xs leading-relaxed">{weeklyReport.warning}</p>
                  </div>
                </div>

                <div className="flex gap-3 bg-indigo-500/5 border border-indigo-500/10 p-4 rounded-xl">
                  <Lightbulb className="text-indigo-400 shrink-0 w-5 h-5 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-indigo-400 text-xs uppercase tracking-wider mb-1">Koçun Gelecek Hafta Önerisi</h4>
                    <p className="text-zinc-300 text-xs leading-relaxed">{weeklyReport.suggestion}</p>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button 
                    onClick={handleGetAIReport}
                    className="text-[11px] text-zinc-500 hover:text-white transition-colors"
                  >
                    Yeniden Analiz Et
                  </button>
                </div>
              </motion.div>
            )}

            {!weeklyReport && !isAnalyzing && (
              <div className="text-center py-8 text-zinc-500 italic text-sm">
                Namaz, spor, uyku düzenin ve diğer hedeflerinin analizine dayalı haftalık koçluk raporunu almak için butona tıkla.
              </div>
            )}
          </GlassCard>

        </div>

        {/* Right Column (1/3) */}
        <div className="flex flex-col gap-6">
          
          {/* Today's Objectives */}
          <GlassCard delay={0.45} className="flex-1">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Target size={20} className="text-neon-blue"/> Bugünkü Hedeflerim
            </h2>
            
            <div className="space-y-4">
              {todayTasks.length === 0 ? (
                <p className="text-zinc-500 text-sm text-center py-8">Bugün için görev yok. Günlük Takip sayfasından ekleyebilirsin!</p>
              ) : (
                todayTasks.slice(0, 5).map(task => (
                  <div key={task.id} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5">
                    <div className={`w-4 h-4 rounded-full border flex-shrink-0 ${task.completed ? 'bg-neon-blue border-neon-blue shadow-[0_0_8px_#00f0ff]' : 'border-zinc-500'}`} />
                    <span className={`text-sm ${task.completed ? 'text-zinc-500 line-through' : 'text-zinc-200'}`}>
                      {task.title}
                    </span>
                  </div>
                ))
              )}
            </div>
            
            {todayTasks.length > 5 && (
              <p className="text-xs text-center text-zinc-500 mt-4">+ {todayTasks.length - 5} daha fazla görev</p>
            )}
          </GlassCard>

          {/* Namaz Tracker */}
          <GlassCard delay={0.5} className="flex-1">
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
                  <span className="text-[10px] uppercase text-zinc-400 group-hover:text-white transition-colors">{vakit.label}</span>
                  {namaz && namaz[vakit.id] ? (
                    <CheckCircle2 className="text-neon-green shadow-[0_0_10px_rgba(0,255,102,0.3)] rounded-full" size={26} />
                  ) : (
                    <Circle className="text-zinc-600 group-hover:text-white transition-colors" size={26} />
                  )}
                </div>
              ))}
            </div>
            {completedNamazCount > 0 && (
              <div className="mt-4">
                <div className="flex justify-between text-[10px] font-bold text-zinc-500 mb-1">
                  <span>Namaz Tamamlama</span>
                  <span>{namazPercent}%</span>
                </div>
                <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden border border-white/5">
                  <div className="bg-neon-green h-full" style={{ width: `${namazPercent}%` }} />
                </div>
              </div>
            )}
          </GlassCard>

          {/* Daily Facts */}
          <GlassCard delay={0.55} className="bg-gradient-to-br from-neon-green/10 to-neon-blue/10 border-neon-blue/20">
            <h3 className="font-bold mb-2 flex items-center gap-2 text-sm"><TrendingUp size={16} className="text-neon-green"/> Günün Finans Tüyosu</h3>
            {isLoadingFacts ? (
              <div className="animate-pulse h-12 bg-white/10 rounded-md"></div>
            ) : (
              <p className="text-xs italic text-zinc-300 leading-relaxed">{dailyFacts?.finance || "Bugün için bir tüyo bulunamadı."}</p>
            )}
          </GlassCard>

          <GlassCard delay={0.6} className="bg-gradient-to-br from-orange-500/10 to-red-500/10 border-orange-500/20">
            <h3 className="font-bold mb-2 flex items-center gap-2 text-sm"><History size={16} className="text-orange-500"/> Tarihte Bugün / Bilgi</h3>
            {isLoadingFacts ? (
              <div className="animate-pulse h-12 bg-white/10 rounded-md"></div>
            ) : (
              <p className="text-xs italic text-zinc-300 leading-relaxed">{dailyFacts?.history || "Bilgi alınamadı."}</p>
            )}
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
