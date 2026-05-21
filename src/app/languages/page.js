'use client';

import { GlassCard } from '@/components/ui/GlassCard';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { SessionModal } from '@/components/ui/SessionModal';
import { RoleplayModal } from '@/components/ui/RoleplayModal';
import { motion } from 'framer-motion';
import { Languages, BookText, Mic, Headphones, PenTool } from 'lucide-react';
import { useState } from 'react';
import { useStore } from '@/store/useStore';

export default function LanguagePanel() {
  const { progress, stats, completeLanguageSession, langLevels } = useStore();
  const [activeSession, setActiveSession] = useState(null); // 'french' | 'english' | null
  const [roleplaySession, setRoleplaySession] = useState(null); // 'french' | 'english' | null

  return (
    <div className="flex flex-col gap-8 pb-10">
      <header>
        <motion.h1 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-4xl font-bold tracking-tight mb-2 text-gradient"
        >
          Linguistic Core
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="text-zinc-400"
        >
          Mastering languages to connect with the world.
        </motion.p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* French Dashboard */}
        <GlassCard delay={0.2} className="relative overflow-hidden border-neon-blue/20">
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <Languages size={120} className="text-neon-blue" />
          </div>
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-xs font-bold shadow-[0_0_10px_#2563eb]">FR</div>
                French
              </h2>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold px-3 py-1 bg-neon-blue/20 text-neon-blue rounded-full border border-neon-blue/30">Level {langLevels?.french || 1}</span>
                <span className="text-xs font-medium px-2 py-1 bg-white/10 rounded border border-white/5">Target: B2</span>
              </div>
            </div>

            <div className="mb-8">
              <ProgressBar progress={progress.french} label="Overall Mastery" color="neon-blue" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-black/40 border border-white/5 rounded-xl p-4">
                <BookText className="text-neon-blue mb-2" size={20} />
                <h4 className="text-sm font-medium text-zinc-400 mb-1">Vocabulary</h4>
                <p className="text-xl font-bold text-white">{stats?.frenchWords || 0} <span className="text-xs font-normal text-zinc-500">words</span></p>
              </div>
              <div className="bg-black/40 border border-white/5 rounded-xl p-4">
                <Headphones className="text-neon-blue mb-2" size={20} />
                <h4 className="text-sm font-medium text-zinc-400 mb-1">Listening</h4>
                <p className="text-xl font-bold text-white">{stats?.frenchListeningHours || 0} <span className="text-xs font-normal text-zinc-500">hours</span></p>
              </div>
            </div>
            
            <div className="flex gap-4 mt-6">
              <button 
                onClick={() => setActiveSession('french')}
                className="flex-1 py-3 rounded-xl bg-neon-blue/10 text-neon-blue border border-neon-blue/30 font-medium hover:bg-neon-blue hover:text-black transition-colors"
              >
                Start Practice Session
              </button>
              <button 
                onClick={() => setRoleplaySession('french')}
                className="w-12 rounded-xl bg-white/5 text-white border border-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                title="Voice Roleplay"
              >
                <Mic size={20} />
              </button>
            </div>
          </div>
        </GlassCard>

        {/* English Dashboard */}
        <GlassCard delay={0.3} className="relative overflow-hidden border-neon-purple/20">
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <Languages size={120} className="text-neon-purple" />
          </div>
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center text-xs font-bold shadow-[0_0_10px_#dc2626]">EN</div>
                English
              </h2>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold px-3 py-1 bg-neon-purple/20 text-neon-purple rounded-full border border-neon-purple/30">Level {langLevels?.english || 1}</span>
                <span className="text-xs font-medium px-2 py-1 bg-white/10 rounded border border-white/5">Target: C1</span>
              </div>
            </div>

            <div className="mb-8">
              <ProgressBar progress={progress.english} label="Overall Mastery" color="neon-purple" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-black/40 border border-white/5 rounded-xl p-4">
                <Mic className="text-neon-purple mb-2" size={20} />
                <h4 className="text-sm font-medium text-zinc-400 mb-1">Speaking</h4>
                <p className="text-xl font-bold text-white">Level {stats?.englishSpeakingLevel || 1}</p>
              </div>
              <div className="bg-black/40 border border-white/5 rounded-xl p-4">
                <PenTool className="text-neon-purple mb-2" size={20} />
                <h4 className="text-sm font-medium text-zinc-400 mb-1">Grammar</h4>
                <p className="text-xl font-bold text-white">{stats?.englishGrammar || 0}%</p>
              </div>
            </div>

            <div className="flex gap-4 mt-6">
              <button 
                onClick={() => setActiveSession('english')}
                className="flex-1 py-3 rounded-xl bg-neon-purple/10 text-neon-purple border border-neon-purple/30 font-medium hover:bg-neon-purple hover:text-white transition-colors"
              >
                Start Practice Session
              </button>
              <button 
                onClick={() => setRoleplaySession('english')}
                className="w-12 rounded-xl bg-white/5 text-white border border-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                title="Voice Roleplay"
              >
                <Mic size={20} />
              </button>
            </div>
          </div>
        </GlassCard>
      </div>

      <SessionModal 
        isOpen={!!activeSession} 
        onClose={() => setActiveSession(null)} 
        type={activeSession}
        level={langLevels?.[activeSession] || 1}
        onComplete={(words) => {
          completeLanguageSession(activeSession);
          if (words) useStore.getState().addVocabulary(activeSession, words);
          setActiveSession(null);
        }}
      />

      <RoleplayModal 
        isOpen={!!roleplaySession}
        onClose={() => setRoleplaySession(null)}
        language={roleplaySession}
        level={langLevels?.[roleplaySession] || 1}
      />
    </div>
  );
}
