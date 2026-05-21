'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export function GlassCard({ children, className, hoverEffect = true, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.25, 0.4, 0.25, 1] }}
      className={cn(
        'glass-card p-6 relative overflow-hidden group',
        hoverEffect && 'hover:-translate-y-1',
        className
      )}
    >
      {/* Subtle top highlight */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-50" />
      
      {/* Glow effect on hover */}
      {hoverEffect && (
        <div className="absolute inset-0 bg-gradient-to-br from-neon-blue/0 via-neon-purple/0 to-neon-blue/0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none" />
      )}
      
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
}
