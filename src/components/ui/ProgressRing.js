'use client';

import { motion } from 'framer-motion';

export function ProgressRing({ progress, size = 120, strokeWidth = 8, color = 'neon-blue', label }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  const colorMap = {
    'neon-blue': '#00f0ff',
    'neon-purple': '#b026ff',
    'neon-green': '#00ff66',
    'white': '#ffffff',
  };

  const strokeColor = colorMap[color] || colorMap['neon-blue'];

  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <div className="relative" style={{ width: size, height: size }}>
        {/* Background Ring */}
        <svg
          className="transform -rotate-90 absolute inset-0"
          width={size}
          height={size}
        >
          <circle
            className="text-white/10"
            strokeWidth={strokeWidth}
            stroke="currentColor"
            fill="transparent"
            r={radius}
            cx={size / 2}
            cy={size / 2}
          />
          {/* Foreground Ring */}
          <motion.circle
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeLinecap="round"
            stroke={strokeColor}
            fill="transparent"
            r={radius}
            cx={size / 2}
            cy={size / 2}
            style={{
              filter: `drop-shadow(0 0 6px ${strokeColor}80)`
            }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center flex-col">
          <span className="text-2xl font-bold text-white">{Math.round(progress)}%</span>
        </div>
      </div>
      {label && <span className="text-sm text-zinc-400 font-medium">{label}</span>}
    </div>
  );
}
