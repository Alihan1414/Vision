'use client';

import { motion } from 'framer-motion';
import { Check, Lock, Star, Code, Terminal, Database, Cloud, Cpu } from 'lucide-react';

export function SkillTree({ currentLevel }) {
  // Define the RPG Skill Tree Nodes
  const nodes = [
    { level: 1, title: 'Web Fundamentals', desc: 'HTML, CSS, JS Basics', icon: Code },
    { level: 2, title: 'Advanced Logic', desc: 'ES6+, Async, Algorithms', icon: Terminal },
    { level: 3, title: 'Frontend Mastery', desc: 'React, Next.js, UI/UX', icon: Star },
    { level: 4, title: 'Data Architecture', desc: 'Node, APIs, Databases', icon: Database },
    { level: 5, title: 'Cloud & DevOps', desc: 'Docker, AWS, CI/CD', icon: Cloud },
    { level: 6, title: 'AI Engineering', desc: 'LLMs, Vectors, Agents', icon: Cpu },
  ];

  return (
    <div className="relative py-8 px-4 flex flex-col items-center">
      {/* Central SVG Line */}
      <div className="absolute top-0 bottom-0 left-1/2 w-1 bg-zinc-800 -translate-x-1/2 rounded-full overflow-hidden">
        {/* Animated fill line based on level */}
        <motion.div 
          initial={{ height: 0 }}
          animate={{ height: `${Math.min((currentLevel / nodes.length) * 100, 100)}%` }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="w-full bg-neon-green shadow-[0_0_10px_#00ff66]"
        />
      </div>

      <div className="space-y-16 w-full max-w-sm relative z-10">
        {nodes.map((node, index) => {
          const isCompleted = currentLevel > node.level;
          const isCurrent = currentLevel === node.level;
          const isLocked = currentLevel < node.level;
          
          const Icon = node.icon;

          // Determine position (zigzag left/right)
          const isLeft = index % 2 === 0;

          return (
            <div key={node.level} className={`relative flex items-center w-full ${isLeft ? 'justify-end pr-[50%] md:pr-0 md:justify-start' : 'justify-start pl-[50%] md:pl-0 md:justify-end'}`}>
              
              {/* Content Box */}
              <motion.div 
                initial={{ opacity: 0, x: isLeft ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className={`w-[140px] md:w-[180px] p-4 rounded-xl border-2 backdrop-blur-md transition-all
                  ${isCompleted ? 'bg-neon-green/10 border-neon-green text-white shadow-[0_0_15px_rgba(0,255,102,0.2)]' : ''}
                  ${isCurrent ? 'bg-neon-blue/10 border-neon-blue text-white shadow-[0_0_15px_rgba(0,213,255,0.4)] animate-pulse-slow' : ''}
                  ${isLocked ? 'bg-black/50 border-white/10 text-zinc-500 opacity-60 grayscale' : ''}
                  ${isLeft ? 'md:mr-24 mr-8' : 'md:ml-24 ml-8'}
                `}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                    isCompleted ? 'bg-neon-green/20 text-neon-green' : 
                    isCurrent ? 'bg-neon-blue/20 text-neon-blue' : 
                    'bg-white/5 text-zinc-500'
                  }`}>
                    Lvl {node.level}
                  </span>
                </div>
                <h4 className="font-bold text-sm leading-tight mb-1">{node.title}</h4>
                <p className="text-[10px] opacity-80">{node.desc}</p>
              </motion.div>

              {/* Center Node Icon */}
              <motion.div 
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ type: "spring", delay: index * 0.2 }}
                className={`absolute left-1/2 -translate-x-1/2 w-12 h-12 rounded-full border-4 flex items-center justify-center bg-black z-20
                  ${isCompleted ? 'border-neon-green text-neon-green shadow-[0_0_20px_rgba(0,255,102,0.5)]' : ''}
                  ${isCurrent ? 'border-neon-blue text-neon-blue shadow-[0_0_20px_rgba(0,213,255,0.5)]' : ''}
                  ${isLocked ? 'border-zinc-800 text-zinc-600' : ''}
                `}
              >
                {isCompleted ? <Check size={20} strokeWidth={3} /> : 
                 isLocked ? <Lock size={18} /> : 
                 <Icon size={20} />}
              </motion.div>
              
            </div>
          );
        })}
      </div>
    </div>
  );
}
