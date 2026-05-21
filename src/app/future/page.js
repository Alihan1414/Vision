'use client';

import { GlassCard } from '@/components/ui/GlassCard';
import { motion } from 'framer-motion';
import { Telescope, Globe, GraduationCap, Map, Star } from 'lucide-react';

export default function FutureMe() {
  const milestones = [
    { year: 2026, title: 'Master Core Programming', desc: 'Build solid foundations in Fullstack and AI tools.', status: 'current' },
    { year: 2027, title: 'Fluent in French', desc: 'Achieve B2/C1 level and comfortable speaking.', status: 'upcoming' },
    { year: 2028, title: 'University Entrance', desc: 'Secure admission to top tier university.', status: 'upcoming' },
    { year: 2030, title: 'International Business', desc: 'Launch first international micro-saas or trade venture.', status: 'future' },
  ];

  return (
    <div className="flex flex-col gap-8 pb-10">
      <header>
        <motion.h1 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-4xl font-bold tracking-tight mb-2 text-gradient"
        >
          Future Me
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="text-zinc-400"
        >
          Vision without execution is just a hallucination.
        </motion.p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Vision Board */}
        <div className="flex flex-col gap-6">
          <GlassCard delay={0.2} className="relative overflow-hidden group min-h-[250px]">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-purple-600/20 z-0 opacity-50 group-hover:opacity-100 transition-opacity duration-700" />
            <div className="relative z-10">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <GraduationCap className="text-purple-400" /> University Goal
              </h2>
              <p className="text-lg text-zinc-300 font-medium leading-relaxed">
                Aiming for a top-tier international university that blends technology, business, and innovation.
              </p>
            </div>
            <Star className="absolute -bottom-4 -right-4 text-purple-500/20 w-32 h-32" />
          </GlassCard>

          <GlassCard delay={0.3} className="relative overflow-hidden group min-h-[250px]">
            <div className="absolute inset-0 bg-gradient-to-br from-neon-blue/20 to-teal-500/20 z-0 opacity-50 group-hover:opacity-100 transition-opacity duration-700" />
            <div className="relative z-10">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Globe className="text-neon-blue" /> Career Vision
              </h2>
              <p className="text-lg text-zinc-300 font-medium leading-relaxed">
                Building a career in International Trade and Software Development. Creating systems that connect the world.
              </p>
            </div>
            <Globe className="absolute -bottom-4 -right-4 text-neon-blue/20 w-32 h-32" />
          </GlassCard>
        </div>

        {/* Timeline */}
        <GlassCard delay={0.4} className="flex flex-col">
          <h2 className="text-2xl font-bold mb-8 flex items-center gap-2">
            <Map className="text-neon-green" /> The Roadmap
          </h2>
          
          <div className="relative pl-6 border-l-2 border-white/10 space-y-10 py-4">
            {milestones.map((ms, index) => (
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + (index * 0.1) }}
                key={ms.year} 
                className="relative"
              >
                {/* Timeline dot */}
                <div className={`absolute -left-[35px] top-1 w-4 h-4 rounded-full border-4 border-black ${
                  ms.status === 'current' ? 'bg-neon-blue shadow-[0_0_10px_#00f0ff]' : 
                  ms.status === 'upcoming' ? 'bg-zinc-400' : 'bg-zinc-700'
                }`} />
                
                <h3 className="text-xl font-bold text-white mb-1 flex items-center gap-3">
                  {ms.year}
                  {ms.status === 'current' && (
                    <span className="text-[10px] uppercase tracking-wider bg-neon-blue/20 text-neon-blue px-2 py-1 rounded-full">Current Phase</span>
                  )}
                </h3>
                <h4 className="text-lg font-medium text-zinc-300 mb-2">{ms.title}</h4>
                <p className="text-sm text-zinc-500">{ms.desc}</p>
              </motion.div>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
