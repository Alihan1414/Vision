'use client';

import { motion } from 'framer-motion';

export function ProgressBar({ progress, label, color = 'neon-blue', className = '' }) {
  const colorMap = {
    'neon-blue': 'bg-[#00f0ff] shadow-[0_0_10px_rgba(0,240,255,0.5)]',
    'neon-purple': 'bg-[#b026ff] shadow-[0_0_10px_rgba(176,38,255,0.5)]',
    'neon-green': 'bg-[#00ff66] shadow-[0_0_10px_rgba(0,255,102,0.5)]',
  };

  const bgClass = colorMap[color] || colorMap['neon-blue'];

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-zinc-300">{label}</span>
          <span className="text-xs font-bold text-white">{Math.round(progress)}%</span>
        </div>
      )}
      <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden relative">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className={`h-full rounded-full ${bgClass}`}
        />
      </div>
    </div>
  );
}
