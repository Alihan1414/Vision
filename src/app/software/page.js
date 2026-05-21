'use client';

import { GlassCard } from '@/components/ui/GlassCard';
import { SessionModal } from '@/components/ui/SessionModal';
import { SkillTree } from '@/components/ui/SkillTree';
import { motion } from 'framer-motion';
import { Code2, GitBranch, Terminal, Cpu, Database, Blocks, Play, Activity } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useStore } from '@/store/useStore';

export default function Software() {
  const { user, completeSoftwareSession, langLevels } = useStore();
  const [sessionActive, setSessionActive] = useState(false);
  const [githubActivity, setGithubActivity] = useState([]);
  const [loadingGithub, setLoadingGithub] = useState(true);

  useEffect(() => {
    // Fetch GitHub Activity for Alihan1414
    fetch('https://api.github.com/users/Alihan1414/events/public')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          // Filter for PushEvents (commits) and take top 4
          const pushes = data
            .filter(event => event.type === 'PushEvent')
            .slice(0, 4)
            .map(event => ({
              id: event.id,
              repo: event.repo.name.split('/')[1],
              message: event.payload.commits[0]?.message || 'No commit message',
              date: new Date(event.created_at).toLocaleDateString()
            }));
          setGithubActivity(pushes);
        }
        setLoadingGithub(false);
      })
      .catch(err => {
        console.error('Failed to fetch GitHub activity', err);
        setLoadingGithub(false);
      });
  }, []);

  const projects = [
    { id: 1, name: 'VisionOS Dashboard', desc: 'Personal development tracking system built with Next.js and Tailwind.', status: 'Active', tech: ['Next.js', 'Tailwind', 'Zustand'] },
    { id: 2, type: 'Learning', name: 'Python Data Science', desc: 'Learning data structures, Pandas, and basic ML algorithms.', status: 'Learning', tech: ['Python', 'Pandas'] },
    { id: 3, name: 'Portfolio Website', desc: 'Minimalist developer portfolio.', status: 'Planned', tech: ['React', 'Framer Motion'] },
  ];

  return (
    <div className="flex flex-col gap-8 pb-10">
      <header>
        <motion.h1 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-4xl font-bold tracking-tight mb-2 text-gradient"
        >
          Software Engineering
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="text-zinc-400"
        >
          Building the digital future.
        </motion.p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Active Projects */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <GlassCard delay={0.2} className="flex-1">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Terminal className="text-neon-green" /> Projects & Learning
            </h2>
            
            <div className="space-y-4">
              {projects.map(project => (
                <div key={project.id} className="p-5 rounded-xl bg-black/40 border border-white/10 hover:border-neon-green/30 transition-colors group">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-lg text-white flex items-center gap-2">
                      {project.name}
                    </h3>
                    <span className={`text-xs px-2 py-1 rounded-full border ${
                      project.status === 'Active' ? 'bg-neon-green/10 text-neon-green border-neon-green/30' :
                      project.status === 'Learning' ? 'bg-neon-blue/10 text-neon-blue border-neon-blue/30' :
                      'bg-zinc-800 text-zinc-400 border-zinc-700'
                    }`}>
                      {project.status}
                    </span>
                  </div>
                  <p className="text-sm text-zinc-400 mb-4">{project.desc}</p>
                  <div className="flex flex-wrap gap-2">
                    {project.tech.map(tech => (
                      <span key={tech} className="text-xs text-zinc-300 bg-white/5 px-2 py-1 rounded border border-white/5">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <button 
              onClick={() => setSessionActive(true)}
              className="w-full mt-6 py-4 rounded-xl bg-neon-green/10 text-neon-green border border-neon-green/30 font-bold hover:bg-neon-green hover:text-black transition-colors flex items-center justify-center gap-2"
            >
              <Play fill="currentColor" size={18} /> Start Coding Challenge
            </button>
          </GlassCard>
        </div>

        {/* Roadmap / Skill Tree */}
        <div className="flex flex-col gap-6">
          <GlassCard delay={0.3} className="flex-1 overflow-hidden">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Code2 className="text-neon-blue" /> Tech Skill Tree
            </h2>
            
            <div className="flex justify-center -mx-4">
              <SkillTree currentLevel={langLevels?.software || 1} />
            </div>
          </GlassCard>
          
          {/* GitHub Integration */}
          <GlassCard delay={0.4} className="flex-1 border-neon-purple/20">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <GitBranch className="text-neon-purple" /> Live GitHub
              </h2>
              <a href="https://github.com/Alihan1414" target="_blank" rel="noreferrer" className="text-xs bg-white/10 px-2 py-1 rounded hover:bg-white/20 transition-colors">
                @Alihan1414
              </a>
            </div>

            {loadingGithub ? (
              <div className="text-sm text-zinc-500 animate-pulse flex items-center gap-2">
                <Activity size={14} className="animate-spin" /> Fetching latest commits...
              </div>
            ) : githubActivity.length > 0 ? (
              <div className="space-y-4">
                {githubActivity.map(activity => (
                  <div key={activity.id} className="text-sm">
                    <div className="flex justify-between text-zinc-400 mb-1">
                      <span className="font-medium text-neon-purple/80">{activity.repo}</span>
                      <span className="text-xs">{activity.date}</span>
                    </div>
                    <p className="text-zinc-300 truncate">{activity.message}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-zinc-500">No recent public commits found.</p>
            )}
          </GlassCard>
        </div>

      </div>

      <SessionModal 
        isOpen={sessionActive} 
        onClose={() => setSessionActive(false)} 
        type="software"
        level={langLevels?.software || 1}
        onComplete={(words) => {
          completeSoftwareSession();
          if (words) useStore.getState().addVocabulary('software', words);
          setSessionActive(false);
        }}
      />
    </div>
  );
}
