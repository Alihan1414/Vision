'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  CalendarDays, 
  TrendingUp, 
  Telescope, 
  Code2, 
  Languages,
  ChevronLeft,
  ChevronRight,
  CloudUpload,
  CloudDownload,
  BookOpen,
  Dumbbell
} from 'lucide-react';
import { useStore } from '@/store/useStore';
import { cn } from '@/lib/utils';

const menuItems = [
  { path: '/', name: 'Dashboard', icon: LayoutDashboard },
  { path: '/daily', name: 'Daily Life', icon: CalendarDays },
  { path: '/progress', name: 'Progress', icon: TrendingUp },
  { path: '/future', name: 'Future Me', icon: Telescope },
  { path: '/books', name: 'Books', icon: BookOpen },
  { path: '/software', name: 'Software', icon: Code2 },
  { path: '/languages', name: 'Languages', icon: Languages },
  { path: '/spor', name: 'Spor', icon: Dumbbell },
];

export function Sidebar() {
  const pathname = usePathname();
  const { syncToCloud, loadFromCloud } = useStore();
  const [syncStatus, setSyncStatus] = useState('');

  const handleSync = async (type) => {
    setSyncStatus(type === 'up' ? 'Syncing...' : 'Loading...');
    const result = type === 'up' ? await syncToCloud() : await loadFromCloud();
    if (result.success) {
      setSyncStatus(type === 'up' ? 'Synced!' : 'Loaded!');
    } else {
      setSyncStatus('Error: Check config');
    }
    setTimeout(() => setSyncStatus(''), 3000);
  };
  const [collapsed, setCollapsed] = useState(false);
  const { user } = useStore();

  return (
    <motion.div 
      initial={false}
      animate={{ width: collapsed ? 80 : 260 }}
      className="h-screen bg-black/60 backdrop-blur-2xl border-r border-white/10 flex flex-col relative z-50 shrink-0"
    >
      {/* Toggle Button */}
      <button 
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-4 top-8 bg-black border border-white/20 p-1 rounded-full text-white hover:text-neon-blue hover:border-neon-blue transition-colors z-50"
      >
        {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
      </button>

      {/* Logo Area */}
      <div className="h-24 flex items-center justify-center border-b border-white/5">
        {collapsed ? (
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-neon-blue to-neon-purple flex items-center justify-center font-bold text-white shadow-[0_0_15px_rgba(0,240,255,0.4)]">
            V
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-neon-blue to-neon-purple flex items-center justify-center font-bold text-white shadow-[0_0_15px_rgba(0,240,255,0.4)]">
              V
            </div>
            <span className="text-xl font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-400">
              ALIHAN<span className="text-neon-blue">VS</span>
            </span>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-8 px-4 flex flex-col gap-2 overflow-y-auto overflow-x-hidden">
        {menuItems.map((item) => {
          const isActive = pathname === item.path;
          const Icon = item.icon;

          return (
            <Link key={item.path} href={item.path}>
              <div className={cn(
                "flex items-center gap-4 px-3 py-3 rounded-xl transition-all duration-300 relative group",
                isActive ? "bg-white/10 text-white" : "text-zinc-400 hover:bg-white/5 hover:text-zinc-200"
              )}>
                {isActive && (
                  <motion.div 
                    layoutId="active-nav"
                    className="absolute inset-0 rounded-xl border border-white/20 bg-gradient-to-r from-white/5 to-transparent z-0"
                  />
                )}
                
                {/* Neon Glow indicator on active */}
                {isActive && (
                  <div className="absolute left-0 top-1/4 bottom-1/4 w-[2px] bg-neon-blue shadow-[0_0_10px_#00f0ff] rounded-r-md z-10" />
                )}

                <Icon size={22} className={cn("relative z-10", isActive && "text-neon-blue")} />
                
                {!collapsed && (
                  <span className="relative z-10 font-medium whitespace-nowrap">
                    {item.name}
                  </span>
                )}
                
                {/* Tooltip for collapsed mode */}
                {collapsed && (
                  <div className="absolute left-full ml-4 px-2 py-1 bg-zinc-800 text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 whitespace-nowrap border border-white/10">
                    {item.name}
                  </div>
                )}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Cloud Sync Buttons */}
      <div className="px-4 pb-4 flex flex-col gap-2">
        <button 
          onClick={() => handleSync('up')}
          className="flex items-center justify-center gap-2 w-full py-2 rounded-xl bg-neon-purple/10 text-neon-purple border border-neon-purple/30 hover:bg-neon-purple hover:text-white transition-colors"
        >
          <CloudUpload size={16} />
          {!collapsed && <span className="text-xs font-bold">Save to Cloud</span>}
        </button>
        <button 
          onClick={() => handleSync('down')}
          className="flex items-center justify-center gap-2 w-full py-2 rounded-xl bg-neon-blue/10 text-neon-blue border border-neon-blue/30 hover:bg-neon-blue hover:text-black transition-colors"
        >
          <CloudDownload size={16} />
          {!collapsed && <span className="text-xs font-bold">Load from Cloud</span>}
        </button>
        {syncStatus && (
          <div className="text-xs text-center text-white mt-1">
            {syncStatus}
          </div>
        )}
      </div>

      {/* User Profile Summary */}
      <div className="p-4 border-t border-white/5">
        <div className={cn("glass-panel p-3 flex items-center gap-3", collapsed ? "justify-center" : "")}>
          <div className="w-10 h-10 rounded-full bg-zinc-800 border border-white/20 flex items-center justify-center shrink-0 overflow-hidden relative">
            {/* Avatar */}
            <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500 to-purple-500 opacity-50" />
            <span className="font-bold text-sm relative z-10 text-white">A</span>
          </div>
          
          {!collapsed && (
            <div className="flex-1 overflow-hidden">
              <div className="text-sm font-semibold text-white truncate">Alihan</div>
              <div className="text-xs text-neon-blue font-medium mt-0.5">Lv. {user.level}</div>
              
              {/* Mini XP Bar */}
              <div className="h-1.5 w-full bg-white/10 rounded-full mt-2 overflow-hidden">
                <div 
                  className="h-full bg-neon-purple shadow-[0_0_8px_#b026ff]" 
                  style={{ width: `${(user.xp % 1000) / 10}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
