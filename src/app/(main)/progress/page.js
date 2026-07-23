'use client';

import { useStore } from '@/store/useStore';
import { GlassCard } from '@/components/ui/GlassCard';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { motion } from 'framer-motion';
import { 
  Trophy, TrendingUp, Target, Flame, Check, 
  BookOpen, Sparkles, Award, Zap, Activity,
  PieChart as PieIcon, LineChart as LineIcon
} from 'lucide-react';
import { 
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, 
  Tooltip, CartesianGrid, PieChart, Pie, Cell 
} from 'recharts';

const PIE_COLORS = ['#3b82f6', '#b026ff', '#10b981', '#f59e0b', '#f43f5e', '#6b7280'];

export default function Progress() {
  const { user, progress, tasks, namaz, stats, books, goals, finance } = useStore();

  // Calculate Today's Activity Score dynamically
  const completedTasksCount = tasks.filter(t => t.completed).length;
  const completedNamazCount = Object.values(namaz || {}).filter(Boolean).length;
  const focusMinutes = stats?.focusTimeMinutes || 0;
  
  // XP contribution + tasks + prayers
  const todayScore = completedTasksCount * 2 + completedNamazCount * 3 + Math.floor(focusMinutes / 10);

  // Generate 30 days of activity data (yesterdays are pseudo-random for visualization, today is real)
  const generateHeatmapData = () => {
    const data = [];
    const today = new Date();
    for (let i = 29; i >= 0; i--) {
      const d = new Date();
      d.setDate(today.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      
      let score = 0;
      if (i === 0) {
        score = todayScore;
      } else {
        // Deterministic mock score based on date seed
        const seed = d.getDate() + (d.getMonth() + 1) * 31;
        score = (seed * 19 + 7) % 9;
      }
      data.push({ date: dateStr, score, label: d.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' }) });
    }
    return data;
  };

  const heatmapData = generateHeatmapData();

  // Get color scale class for heatmap cell
  const getCellColor = (score) => {
    if (score === 0) return 'bg-white/5 border-white/5 text-zinc-600';
    if (score <= 2) return 'bg-emerald-950/40 border-emerald-900/30 text-emerald-400';
    if (score <= 5) return 'bg-emerald-800/40 border-emerald-700/30 text-emerald-300';
    if (score <= 7) return 'bg-emerald-600/50 border-emerald-500/30 text-emerald-200';
    return 'bg-emerald-400/70 border-emerald-300/40 text-black shadow-[0_0_10px_rgba(52,211,153,0.3)]';
  };

  // Recharts: Weekly XP Progress Chart Data
  const xpChartData = [
    { name: 'Pzt', XP: Math.max(0, user.xp - 500) },
    { name: 'Sal', XP: Math.max(0, user.xp - 420) },
    { name: 'Çar', XP: Math.max(0, user.xp - 300) },
    { name: 'Per', XP: Math.max(0, user.xp - 180) },
    { name: 'Cum', XP: Math.max(0, user.xp - 100) },
    { name: 'Cmt', XP: user.xp }
  ];

  // Recharts: Expense Category Breakdown Chart Data
  const categoryTotals = finance?.transactions?.reduce((acc, t) => {
    acc[t.category] = (acc[t.category] || 0) + Number(t.amount);
    return acc;
  }, {}) || {};

  const financeChartData = Object.keys(categoryTotals).map((cat) => ({
    name: cat,
    value: categoryTotals[cat]
  }));

  const achievements = [
    { id: 1, title: 'İlk Adım', desc: 'Sistemi kurdun ve hesabını başlattın.', completed: true },
    { id: 2, title: 'Disiplin Yıldızı', desc: 'En az 3 günlük aktif seriye ulaş.', completed: user.streak >= 3 },
    { id: 3, title: 'Dil Avcısı', desc: 'Fransızca veya İngilizce seviyeni %20 üzerine çıkar.', completed: progress.french >= 20 || progress.english >= 20 },
    { id: 4, title: 'Kütüphaneci', desc: 'İlk kitabını başarıyla tamamla.', completed: books?.completed?.length > 0 },
    { id: 5, title: 'Hedefe Odaklı', desc: 'İlk OKR hedefini tamamla (%100 ilerleme).', completed: goals?.some(g => g.progress === 100) },
  ];

  // Progress to next level
  const xpInCurrentLevel = user.xp % 1000;
  const levelProgress = Math.round((xpInCurrentLevel / 1000) * 100);

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
            Gelişim & Analizler
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="text-zinc-400 font-medium"
          >
            Tüm branşlardaki gelişim seviyelerini ve istatistiklerini gör.
          </motion.p>
        </div>
      </header>

      {/* Heatmap Section */}
      <GlassCard delay={0.15}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold flex items-center gap-2 text-emerald-400">
            <Activity className="w-5 h-5" /> Aktivite Haritası (Son 30 Gün)
          </h2>
          <div className="flex gap-2 text-[10px] text-zinc-500 font-medium items-center">
            <span>Az</span>
            <div className="w-3.5 h-3.5 rounded bg-white/5 border border-white/5" />
            <div className="w-3.5 h-3.5 rounded bg-emerald-950/40 border border-emerald-900/30" />
            <div className="w-3.5 h-3.5 rounded bg-emerald-800/40 border border-emerald-700/30" />
            <div className="w-3.5 h-3.5 rounded bg-emerald-600/50 border border-emerald-500/30" />
            <div className="w-3.5 h-3.5 rounded bg-emerald-400/70 border border-emerald-300/40" />
            <span>Çok</span>
          </div>
        </div>

        {/* Heatmap Grid */}
        <div className="grid grid-cols-5 sm:grid-cols-10 md:grid-cols-15 lg:grid-cols-30 gap-2.5">
          {heatmapData.map((cell, idx) => {
            const isToday = idx === 29;
            return (
              <div 
                key={idx}
                title={`${cell.label}: Skor ${cell.score}`}
                className={`aspect-square rounded-lg border flex flex-col items-center justify-center text-[10px] font-bold transition-all relative group cursor-help ${getCellColor(cell.score)} ${
                  isToday ? 'ring-2 ring-neon-blue ring-offset-2 ring-offset-black' : ''
                }`}
              >
                <span>{cell.dayLabel}</span>
                {isToday && (
                  <span className="absolute -top-6 bg-neon-blue text-black font-bold text-[9px] px-1.5 py-0.5 rounded shadow whitespace-nowrap hidden group-hover:block z-20">
                    Bugün
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </GlassCard>

      {/* Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* SOL: Skill Trees & Charts (2/3) */}
        <div className="lg:col-span-2 flex flex-col gap-8">
          
          {/* Skill Trees */}
          <GlassCard delay={0.2}>
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-neon-blue">
              <TrendingUp className="w-5 h-5" /> Yetenek Ağaçları (Skill Trees)
            </h2>
            <div className="space-y-6">
              <ProgressBar progress={progress.french} label="Fransızca Seviyesi" color="neon-blue" />
              <ProgressBar progress={progress.english} label="İngilizce Seviyesi" color="neon-purple" />
              <ProgressBar progress={progress.software} label="Yazılım Mühendisliği" color="neon-green" />
              <ProgressBar progress={progress.discipline} label="Disiplin & Rutinler" color="white" />
              <ProgressBar progress={progress.spor} label="Spor & Kondisyon" color="orange" />
            </div>
          </GlassCard>

          {/* Charts Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Chart 1: XP Progress */}
            <GlassCard delay={0.25} className="flex flex-col h-[280px]">
              <h3 className="text-sm font-bold text-zinc-300 mb-4 flex items-center gap-1.5">
                <LineIcon className="text-neon-purple w-4 h-4" /> Haftalık XP Artışı
              </h3>
              <div className="flex-1 w-full text-xs">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={xpChartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="name" stroke="#71717a" />
                    <YAxis stroke="#71717a" />
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'rgba(10, 10, 10, 0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff' }}
                    />
                    <Line type="monotone" dataKey="XP" stroke="#b026ff" strokeWidth={2.5} activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </GlassCard>

            {/* Chart 2: Expense Breakdown */}
            <GlassCard delay={0.3} className="flex flex-col h-[280px]">
              <h3 className="text-sm font-bold text-zinc-300 mb-4 flex items-center gap-1.5">
                <PieIcon className="text-rose-400 w-4 h-4" /> Harcama Dağılımı (Kategori)
              </h3>
              <div className="flex-1 w-full relative flex items-center justify-center">
                {financeChartData.length === 0 ? (
                  <span className="text-xs text-zinc-500 italic">Analiz için harcama girilmelidir.</span>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={financeChartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {financeChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{ backgroundColor: 'rgba(10, 10, 10, 0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                )}
                {/* Custom Legend overlay inside GlassCard */}
                {financeChartData.length > 0 && (
                  <div className="absolute bottom-2 left-2 flex flex-wrap gap-x-2 gap-y-0.5 max-w-full overflow-hidden text-[9px] text-zinc-400">
                    {financeChartData.slice(0, 3).map((item, idx) => (
                      <span key={idx} className="flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: PIE_COLORS[idx % PIE_COLORS.length] }} />
                        {item.name}: {item.value}₺
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </GlassCard>

          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Level Metric */}
            <GlassCard delay={0.35} className="flex flex-col justify-between">
              <div>
                <span className="text-xs text-zinc-500 font-medium block">Aktif Seviye</span>
                <span className="text-4xl font-extrabold text-white mt-1 block">Lv. {user.level}</span>
              </div>
              <div className="mt-4">
                <div className="flex justify-between text-[10px] text-zinc-400 font-semibold mb-1">
                  <span>Level Progress</span>
                  <span>{levelProgress}%</span>
                </div>
                <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden border border-white/5">
                  <div className="bg-neon-purple h-full shadow-[0_0_8px_#b026ff]" style={{ width: `${levelProgress}%` }} />
                </div>
                <span className="text-[10px] text-zinc-500 mt-2 block">Toplam XP: {user.xp}</span>
              </div>
            </GlassCard>

            {/* Streak Metric */}
            <GlassCard delay={0.4} className="bg-gradient-to-br from-orange-500/10 to-red-500/10 border-orange-500/20 flex flex-col justify-between">
              <div>
                <span className="text-xs text-zinc-500 font-medium block">Aktif Seri (Streak)</span>
                <span className="text-4xl font-extrabold text-orange-400 mt-1 block">{user.streak} Gün</span>
              </div>
              <div className="mt-4">
                <span className="text-xs text-zinc-400 flex items-center gap-1">
                  <Flame size={14} className="text-orange-500 animate-pulse" /> Momentumunu koru!
                </span>
                <p className="text-[10px] text-zinc-500 mt-2">Her gün giriş yaparak serini arttır.</p>
              </div>
            </GlassCard>

            {/* General Highlights */}
            <GlassCard delay={0.45} className="flex flex-col justify-between">
              <div>
                <span className="text-xs text-zinc-500 font-medium block">Tamamlananlar</span>
                <div className="space-y-2 mt-3">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-zinc-400 flex items-center gap-1.5"><BookOpen size={12} /> Kitap Okuma:</span>
                    <span className="font-bold text-emerald-400">{books?.completed?.length || 0} adet</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-zinc-400 flex items-center gap-1.5"><Target size={12} /> OKR Hedefleri:</span>
                    <span className="font-bold text-neon-blue">{goals?.filter(g => g.progress === 100).length || 0} adet</span>
                  </div>
                </div>
              </div>
              <div className="mt-4 pt-2 border-t border-white/5 text-[10px] text-zinc-500">
                Gelişimlerin buluta yedeklenmektedir.
              </div>
            </GlassCard>

          </div>

        </div>

        {/* SAĞ: Achievements (1/3) */}
        <div className="flex flex-col gap-6">
          <GlassCard delay={0.5} className="flex-1 flex flex-col">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-yellow-400">
              <Trophy className="w-5 h-5 text-yellow-400" /> Başarımlar (Achievements)
            </h2>
            
            <div className="flex-1 space-y-4 overflow-y-auto pr-2 max-h-[580px] scrollbar-thin">
              {achievements.map((ach) => (
                <div 
                  key={ach.id} 
                  className={`p-4 rounded-xl border relative overflow-hidden transition-all duration-300 ${
                    ach.completed 
                      ? 'bg-yellow-400/10 border-yellow-400/30 shadow-[0_0_12px_rgba(250,204,21,0.15)]' 
                      : 'bg-black/40 border-white/10 opacity-60 grayscale'
                  }`}
                >
                  {ach.completed && (
                    <div className="absolute top-3 right-3 text-yellow-400">
                      <Check className="w-4 h-4" strokeWidth={3} />
                    </div>
                  )}
                  <h4 className={`font-bold text-sm ${ach.completed ? 'text-yellow-400' : 'text-zinc-300'} mb-1`}>
                    {ach.title}
                  </h4>
                  <p className="text-xs text-zinc-500 font-medium leading-relaxed">{ach.desc}</p>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>

      </div>
    </div>
  );
}
