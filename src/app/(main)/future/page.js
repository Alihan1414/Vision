'use client';

import { useState } from 'react';
import { useStore } from '@/store/useStore';
import { GlassCard } from '@/components/ui/GlassCard';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, Trash2, Calendar, Target, Sparkles, 
  Smile, Trash, CheckCircle2, ChevronDown, ChevronUp
} from 'lucide-react';

const GRADIENTS = [
  { name: 'Mor Alev', class: 'from-indigo-600/30 to-purple-600/30 border-purple-500/40 text-purple-300' },
  { name: 'Kozmik Mavi', class: 'from-blue-600/30 to-cyan-500/30 border-cyan-500/40 text-cyan-300' },
  { name: 'Neon Gün Batımı', class: 'from-rose-600/30 to-orange-500/30 border-orange-500/40 text-orange-300' },
  { name: 'Zümrüt Işıltısı', class: 'from-emerald-600/30 to-teal-500/30 border-teal-500/40 text-teal-300' }
];

export default function FutureMe() {
  const { 
    goals, addGoal, toggleSubGoal, deleteGoal,
    visionBoard, addVisionItem, deleteVisionItem
  } = useStore();

  // Goal Form State
  const [goalTitle, setGoalTitle] = useState('');
  const [goalDeadline, setGoalDeadline] = useState('');
  const [subGoalInput, setSubGoalInput] = useState('');
  const [subGoalsList, setSubGoalsList] = useState([]);
  const [showGoalModal, setShowGoalModal] = useState(false);

  // Vision Board Form State
  const [visionText, setVisionText] = useState('');
  const [visionEmoji, setVisionEmoji] = useState('✨');
  const [visionGradient, setVisionGradient] = useState(GRADIENTS[0].class);
  const [showVisionModal, setShowVisionModal] = useState(false);

  const handleAddSubGoal = (e) => {
    e.preventDefault();
    if (!subGoalInput.trim()) return;
    setSubGoalsList([...subGoalsList, subGoalInput.trim()]);
    setSubGoalInput('');
  };

  const handleRemoveSubGoalList = (idx) => {
    setSubGoalsList(subGoalsList.filter((_, i) => i !== idx));
  };

  const handleCreateGoal = (e) => {
    e.preventDefault();
    if (!goalTitle.trim()) return;
    addGoal({
      title: goalTitle,
      deadline: goalDeadline,
      subGoals: subGoalsList
    });
    setGoalTitle('');
    setGoalDeadline('');
    setSubGoalsList([]);
    setShowGoalModal(false);
  };

  const handleCreateVision = (e) => {
    e.preventDefault();
    if (!visionText.trim()) return;
    addVisionItem({
      text: visionText,
      emoji: visionEmoji,
      color: visionGradient
    });
    setVisionText('');
    setVisionEmoji('✨');
    setVisionGradient(GRADIENTS[0].class);
    setShowVisionModal(false);
  };

  const getDaysRemaining = (deadlineDate) => {
    if (!deadlineDate) return 'Süresiz';
    const today = new Date();
    const target = new Date(deadlineDate);
    const diffTime = target - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays < 0) return 'Süresi doldu';
    return `${diffDays} gün kaldı`;
  };

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
            Gelecek Vizyonu
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="text-zinc-400 font-medium"
          >
            Uygulanmayan vizyon, sadece bir halüsinasyondur.
          </motion.p>
        </div>
      </header>

      {/* Grid: OKRs & Vision Board */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        
        {/* SOL: OKR Hedefleri */}
        <div className="flex flex-col gap-6">
          <GlassCard delay={0.2} className="flex flex-col min-h-[550px]">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-xl font-bold flex items-center gap-2 text-neon-blue">
                <Target className="w-5 h-5" /> OKR Hedeflerim (Key Results)
              </h2>
              <button 
                onClick={() => setShowGoalModal(true)}
                className="bg-neon-blue/20 hover:bg-neon-blue hover:text-black border border-neon-blue/30 text-neon-blue text-xs font-semibold px-4 py-2 rounded-xl transition-all flex items-center gap-1"
              >
                <Plus size={16} /> Yeni Hedef
              </button>
            </div>

            <div className="flex-1 space-y-6 overflow-y-auto pr-2 max-h-[550px] scrollbar-thin">
              {goals.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-zinc-500 italic text-sm py-20">
                  <Target size={40} className="text-zinc-600 mb-3" />
                  Henüz hedeflerin eklenmemiş. Hayal et, planla ve ekle!
                </div>
              ) : (
                goals.map((goal, gIndex) => (
                  <motion.div
                    key={goal.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: gIndex * 0.05 }}
                    className="bg-black/30 border border-white/5 rounded-2xl p-5 relative overflow-hidden group hover:border-white/10 transition-colors"
                  >
                    {/* Header */}
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-bold text-white mb-1">{goal.title}</h3>
                        <div className="flex items-center gap-2 text-xs text-zinc-500">
                          <Calendar size={12} />
                          <span>{goal.deadline || 'Hedef Tarih Yok'}</span>
                          <span>•</span>
                          <span className="font-semibold text-neon-blue">{getDaysRemaining(goal.deadline)}</span>
                        </div>
                      </div>
                      <button 
                        onClick={() => deleteGoal(goal.id)}
                        className="text-zinc-500 hover:text-red-500 transition-colors p-2 rounded-lg bg-white/5 hover:bg-white/10 shrink-0"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="flex justify-between text-xs font-semibold mb-1">
                        <span className="text-zinc-400">İlerleme</span>
                        <span className="text-neon-blue">{goal.progress}%</span>
                      </div>
                      <div className="w-full bg-white/5 h-2.5 rounded-full overflow-hidden border border-white/5">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${goal.progress}%` }}
                          transition={{ duration: 0.8, ease: "easeOut" }}
                          className="bg-gradient-to-r from-blue-500 to-cyan-400 h-full rounded-full shadow-[0_0_8px_rgba(6,182,212,0.5)]" 
                        />
                      </div>
                    </div>

                    {/* Subgoals (Key Results) */}
                    <div className="space-y-2 mt-4 bg-black/20 p-3 rounded-xl border border-white/5">
                      <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">Alt Görevler</span>
                      {goal.subGoals?.length === 0 ? (
                        <div className="text-xs text-zinc-600 italic">Alt görev eklenmemiş.</div>
                      ) : (
                        goal.subGoals.map((subGoal) => (
                          <div 
                            key={subGoal.id}
                            onClick={() => toggleSubGoal(goal.id, subGoal.id)}
                            className="flex items-center gap-3 py-1 cursor-pointer select-none group/item"
                          >
                            <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${
                              subGoal.completed 
                                ? 'bg-neon-blue border-neon-blue text-black' 
                                : 'border-zinc-500 group-hover/item:border-neon-blue'
                            }`}>
                              {subGoal.completed && <CheckCircle2 size={10} strokeWidth={4} />}
                            </div>
                            <span className={`text-xs ${subGoal.completed ? 'line-through text-zinc-500' : 'text-zinc-300 font-medium'}`}>
                              {subGoal.title}
                            </span>
                          </div>
                        ))
                      )}
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </GlassCard>
        </div>

        {/* SAĞ: Vision Board */}
        <div className="flex flex-col gap-6">
          <GlassCard delay={0.3} className="flex flex-col min-h-[550px]">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-xl font-bold flex items-center gap-2 text-amber-400">
                <Sparkles className="w-5 h-5 text-amber-400" /> Hayal Panosu (Vision Board)
              </h2>
              <button 
                onClick={() => setShowVisionModal(true)}
                className="bg-amber-400/20 hover:bg-amber-400 hover:text-black border border-amber-400/30 text-amber-400 text-xs font-semibold px-4 py-2 rounded-xl transition-all flex items-center gap-1"
              >
                <Plus size={16} /> Kart Ekle
              </button>
            </div>

            {/* Vision Board Grid */}
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4 overflow-y-auto pr-2 max-h-[550px] scrollbar-thin">
              {(visionBoard?.items || []).length === 0 ? (
                <div className="h-full sm:col-span-2 flex flex-col items-center justify-center text-zinc-500 italic text-sm py-20">
                  <Sparkles size={40} className="text-zinc-600 mb-3" />
                  Vizyon panon henüz boş. Seni motive eden hayallerini buraya sabitle!
                </div>
              ) : (
                (visionBoard?.items || []).map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className={`relative overflow-hidden group rounded-2xl border p-6 min-h-[160px] flex flex-col justify-between bg-gradient-to-br transition-all duration-300 hover:scale-[1.02] ${
                      item.color || 'from-indigo-600/20 to-purple-600/20 border-purple-500/20'
                    }`}
                  >
                    {/* Background Glow */}
                    <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-0" />

                    <div className="relative z-10">
                      <span className="text-3xl block mb-3">{item.emoji || '✨'}</span>
                      <p className="text-sm font-semibold text-white leading-relaxed">{item.text}</p>
                    </div>

                    <div className="relative z-10 flex justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <button 
                        onClick={() => deleteVisionItem(item.id)}
                        className="bg-black/40 hover:bg-red-500/20 text-zinc-400 hover:text-red-400 border border-white/5 hover:border-red-500/30 px-3 py-1.5 rounded-xl text-xs flex items-center gap-1 transition-colors"
                      >
                        <Trash size={12} /> Sil
                      </button>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </GlassCard>
        </div>

      </div>

      {/* YENİ HEDEF MODALI */}
      <AnimatePresence>
        {showGoalModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-zinc-950 border border-white/10 rounded-2xl p-6 w-full max-w-md shadow-2xl"
            >
              <h3 className="text-lg font-bold text-white mb-4">Yeni OKR Hedefi Oluştur</h3>
              <form onSubmit={handleCreateGoal} className="flex flex-col gap-4">
                <div>
                  <label className="block text-xs text-zinc-400 mb-1.5 font-medium">Hedef Başlığı</label>
                  <input 
                    type="text"
                    value={goalTitle}
                    onChange={(e) => setGoalTitle(e.target.value)}
                    placeholder="Örn: İngilizce Konuşma Becerisi"
                    required
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neon-blue/50 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-zinc-400 mb-1.5 font-medium">Hedef Tarih (Deadline)</label>
                  <input 
                    type="date"
                    value={goalDeadline}
                    onChange={(e) => setGoalDeadline(e.target.value)}
                    required
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neon-blue/50 text-sm"
                  />
                </div>
                
                {/* Alt Görevler (Key Results) Ekleme */}
                <div>
                  <label className="block text-xs text-zinc-400 mb-1.5 font-medium">Anahtar Sonuçlar (Key Results)</label>
                  <div className="flex gap-2 mb-2">
                    <input 
                      type="text"
                      value={subGoalInput}
                      onChange={(e) => setSubGoalInput(e.target.value)}
                      placeholder="Örn: 10 saat pratik yap"
                      className="flex-1 bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-neon-blue/50 text-xs"
                    />
                    <button 
                      type="button"
                      onClick={handleAddSubGoal}
                      className="bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl px-3 py-2 text-xs flex items-center justify-center font-bold"
                    >
                      Ekle
                    </button>
                  </div>
                  {/* Eklenen Alt Görevlerin Listesi */}
                  <div className="flex flex-wrap gap-2 max-h-[100px] overflow-y-auto p-1">
                    {subGoalsList.map((sg, idx) => (
                      <span 
                        key={idx} 
                        className="bg-neon-blue/10 border border-neon-blue/20 text-neon-blue text-[11px] px-2.5 py-1 rounded-lg flex items-center gap-1.5"
                      >
                        {sg}
                        <button 
                          type="button" 
                          onClick={() => handleRemoveSubGoalList(idx)} 
                          className="hover:text-red-400 font-bold"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end gap-2 mt-2">
                  <button 
                    type="button" 
                    onClick={() => {
                      setShowGoalModal(false);
                      setSubGoalsList([]);
                    }}
                    className="text-xs text-zinc-400 hover:text-white px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
                  >
                    Vazgeç
                  </button>
                  <button 
                    type="submit" 
                    className="text-xs font-semibold text-black bg-neon-blue hover:bg-cyan-400 px-4 py-2.5 rounded-xl transition-colors"
                  >
                    Hedef Oluştur
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* VİZYON KART EKLEME MODALI */}
      <AnimatePresence>
        {showVisionModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-zinc-950 border border-white/10 rounded-2xl p-6 w-full max-w-md shadow-2xl"
            >
              <h3 className="text-lg font-bold text-white mb-4">Hayal Panosuna Kart Ekle</h3>
              <form onSubmit={handleCreateVision} className="flex flex-col gap-4">
                <div>
                  <label className="block text-xs text-zinc-400 mb-1.5 font-medium font-semibold">Senin için anlamı ne? (Açıklama)</label>
                  <textarea 
                    value={visionText}
                    onChange={(e) => setVisionText(e.target.value)}
                    placeholder="Örn: 2027 yazında Paris sokaklarında kahve içmek ve Fransızca konuşmak."
                    required
                    className="w-full h-24 bg-black/50 border border-white/10 rounded-xl p-4 text-white placeholder-zinc-600 focus:outline-none focus:border-amber-400/50 transition-colors resize-none text-sm"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-zinc-400 mb-1.5 font-semibold">Temsili Emoji</label>
                    <input 
                      type="text"
                      value={visionEmoji}
                      onChange={(e) => setVisionEmoji(e.target.value)}
                      placeholder="✨, ✈️, 💻..."
                      maxLength={4}
                      className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-center text-lg focus:outline-none focus:border-amber-400/50"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-zinc-400 mb-1.5 font-semibold">Renk Teması</label>
                    <select
                      value={visionGradient}
                      onChange={(e) => setVisionGradient(e.target.value)}
                      className="w-full bg-black/50 border border-white/10 rounded-xl px-2 py-3 text-xs text-zinc-300 focus:outline-none focus:border-amber-400/50"
                    >
                      {GRADIENTS.map((g) => (
                        <option key={g.class} value={g.class}>{g.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex justify-end gap-2 mt-2">
                  <button 
                    type="button" 
                    onClick={() => setShowVisionModal(false)}
                    className="text-xs text-zinc-400 hover:text-white px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
                  >
                    Vazgeç
                  </button>
                  <button 
                    type="submit" 
                    className="text-xs font-semibold text-black bg-amber-400 hover:bg-amber-300 px-4 py-2.5 rounded-xl transition-colors"
                  >
                    Panoya Ekle
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
