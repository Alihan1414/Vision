'use client';

import { useState } from 'react';
import { useStore } from '@/store/useStore';
import { GlassCard } from '@/components/ui/GlassCard';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, Book, Award, Calendar, Check, 
  Plus, Trash2, Library, Sparkles, AlertCircle 
} from 'lucide-react';

export default function BookTracker() {
  const { 
    books, updateCurrentBook, completeBook 
  } = useStore();

  // Book Form State
  const [newTitle, setNewTitle] = useState('');
  const [newTotalPages, setNewTotalPages] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  // Quick page log state
  const [progressPageInput, setProgressPageInput] = useState('');

  const handleStartBook = (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newTotalPages || isNaN(newTotalPages)) return;
    updateCurrentBook({
      title: newTitle.trim(),
      totalPages: parseInt(newTotalPages),
      page: 0
    });
    setNewTitle('');
    setNewTotalPages('');
    setShowAddModal(false);
  };

  const handleUpdatePageProgress = (e) => {
    e.preventDefault();
    const pageVal = parseInt(progressPageInput);
    if (isNaN(pageVal) || pageVal < 0) return;
    
    const total = books?.current?.totalPages || 0;
    const finalPage = Math.min(pageVal, total);

    updateCurrentBook({ page: finalPage });
    setProgressPageInput('');

    // If progress reaches total, auto-complete
    if (finalPage === total && total > 0) {
      setTimeout(() => {
        completeBook();
        alert("Tebrikler! Kitabı başarıyla tamamladın ve 300 XP kazandın! 📚🎉");
      }, 600);
    }
  };

  const currentBook = books?.current || { title: '', page: 0, totalPages: 0 };
  const completedList = books?.completed || [];
  
  const readingProgress = currentBook.totalPages > 0 
    ? Math.round((currentBook.page / currentBook.totalPages) * 100) 
    : 0;

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
            Kitap Okuma Takibi
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="text-zinc-400 font-medium"
          >
            Okumak, zihni geliştirmenin tek yoludur.
          </motion.p>
        </div>
      </header>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* SOL: Aktif Kitap (2/3 Genişlik) */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <GlassCard delay={0.2} className="flex flex-col flex-1 min-h-[400px] justify-between relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-emerald-500/10 rounded-full blur-[100px] -z-10" />

            <div>
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-xl font-bold flex items-center gap-2 text-emerald-400">
                  <BookOpen className="w-5 h-5" /> Şu An Okuduğum Kitap
                </h2>
                {!currentBook.title && (
                  <button 
                    onClick={() => setShowAddModal(true)}
                    className="bg-emerald-500/20 hover:bg-emerald-500 hover:text-black border border-emerald-500/30 text-emerald-400 text-xs font-semibold px-4 py-2.5 rounded-xl transition-all flex items-center gap-1.5"
                  >
                    <Plus size={16} /> Kitap Ekle
                  </button>
                )}
              </div>

              {currentBook.title ? (
                <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start my-4">
                  {/* Visual 3D Book Graphic */}
                  <div className="w-32 h-44 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-800 flex flex-col justify-between p-4 shadow-[0_15px_30px_rgba(16,185,129,0.2)] border border-emerald-400/30 relative shrink-0">
                    <div className="w-2 h-full absolute top-0 left-0 bg-black/20 rounded-l-xl" />
                    <BookOpen className="w-8 h-8 text-emerald-300 self-end opacity-80" />
                    <span className="text-xs font-bold text-white tracking-wide truncate max-w-full">
                      {currentBook.title}
                    </span>
                  </div>

                  <div className="flex-1 w-full">
                    <h3 className="text-2xl font-bold text-white mb-2">{currentBook.title}</h3>
                    <p className="text-sm text-zinc-400 mb-6">
                      İlerleme: <span className="font-semibold text-emerald-400">{currentBook.page}</span> / {currentBook.totalPages} sayfa
                    </p>

                    {/* Progress Bar */}
                    <div className="mb-6">
                      <div className="flex justify-between text-xs font-semibold mb-1">
                        <span className="text-zinc-400">Okuma Oranı</span>
                        <span className="text-emerald-400">{readingProgress}%</span>
                      </div>
                      <div className="w-full bg-white/5 h-3 rounded-full overflow-hidden border border-white/5">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${readingProgress}%` }}
                          transition={{ duration: 0.8, ease: "easeOut" }}
                          className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full shadow-[0_0_10px_rgba(16,185,129,0.4)]" 
                        />
                      </div>
                    </div>

                    {/* Progress Update Form */}
                    <form onSubmit={handleUpdatePageProgress} className="flex gap-2 max-w-xs">
                      <input 
                        type="number"
                        value={progressPageInput}
                        onChange={(e) => setProgressPageInput(e.target.value)}
                        placeholder="Kalındığın sayfa..."
                        min="0"
                        max={currentBook.totalPages}
                        required
                        className="bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-400/50 transition-colors text-sm w-full"
                      />
                      <button 
                        type="submit"
                        className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500 hover:text-black transition-all px-4 rounded-xl flex items-center justify-center shrink-0 font-semibold text-xs"
                      >
                        Güncelle
                      </button>
                    </form>
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-zinc-500 italic text-sm py-16">
                  <BookOpen size={44} className="text-zinc-700 mb-3" />
                  Şu an okuduğun aktif bir kitap bulunmuyor. Hemen bir tane ekle!
                </div>
              )}
            </div>

            {/* Quick Actions / Tips */}
            {currentBook.title && (
              <div className="mt-8 pt-4 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-zinc-500 font-medium">
                <span className="flex items-center gap-1.5"><Sparkles size={14} className="text-amber-400 animate-pulse" /> Kitap tamamlandığında 300 XP kazanırsın!</span>
                <button 
                  onClick={() => {
                    if (confirm("Bu kitabı sıfırlamak veya silmek istediğine emin misin?")) {
                      updateCurrentBook({ title: '', page: 0, totalPages: 0 });
                    }
                  }}
                  className="text-zinc-500 hover:text-red-400 transition-colors"
                >
                  Kitabı Değiştir/Sıfırla
                </button>
              </div>
            )}
          </GlassCard>
        </div>

        {/* SAĞ: Biten Kitaplar (1/3 Genişlik) */}
        <div className="flex flex-col gap-6">
          <GlassCard delay={0.3} className="flex flex-col min-h-[400px]">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-indigo-400">
              <Library className="w-5 h-5" /> Kitaplığım (Bitirilenler)
            </h2>

            <div className="flex-1 space-y-4 overflow-y-auto pr-2 max-h-[400px] scrollbar-thin">
              {completedList.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-zinc-600 italic text-xs py-16">
                  <Library size={36} className="text-zinc-800 mb-2" />
                  Kütüphanen henüz boş. İlk kitabını bitirmek için okumaya devam et!
                </div>
              ) : (
                completedList.map((book, index) => (
                  <div 
                    key={index}
                    className="bg-black/30 border border-white/5 rounded-xl p-4 flex gap-3 items-center"
                  >
                    <Award className="w-8 h-8 text-amber-400 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-white text-sm truncate">{book.title}</h4>
                      <p className="text-[10px] text-zinc-500 mt-1 flex items-center gap-1">
                        <Calendar size={10} />
                        <span>{book.completedDate || 'Tarih Yok'}</span>
                        <span>•</span>
                        <span>{book.totalPages} Sayfa</span>
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </GlassCard>
        </div>

      </div>

      {/* YENİ KİTAP EKLEME MODALI */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-zinc-950 border border-white/10 rounded-2xl p-6 w-full max-w-sm shadow-2xl"
            >
              <h3 className="text-lg font-bold text-white mb-4">Yeni Kitaba Başla</h3>
              <form onSubmit={handleStartBook} className="flex flex-col gap-4">
                <div>
                  <label className="block text-xs text-zinc-400 mb-1.5 font-medium">Kitap Adı</label>
                  <input 
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="Kitabın ismini gir..."
                    required
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-400/50 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-zinc-400 mb-1.5 font-medium">Toplam Sayfa Sayısı</label>
                  <input 
                    type="number"
                    value={newTotalPages}
                    onChange={(e) => setNewTotalPages(e.target.value)}
                    placeholder="Toplam sayfa sayısı..."
                    required
                    min="1"
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-400/50 text-sm"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <button 
                    type="button" 
                    onClick={() => setShowAddModal(false)}
                    className="text-xs text-zinc-400 hover:text-white px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
                  >
                    Vazgeç
                  </button>
                  <button 
                    type="submit" 
                    className="text-xs font-semibold text-black bg-emerald-400 hover:bg-emerald-300 px-4 py-2.5 rounded-xl transition-colors"
                  >
                    Okumaya Başla
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
