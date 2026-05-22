import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ref, set, get, child } from 'firebase/database';
import { db } from '@/lib/firebase';

export const useStore = create(
  persist(
    (set) => ({
      // User Data
      user: {
        xp: 0,
        level: 1,
        streak: 0,
        lastActiveDate: new Date().toISOString().split('T')[0],
      },
      
      // Daily Tasks
      tasks: [],
      
      // Progress Stats (0 to 100)
      progress: {
        french: 0,
        english: 0,
        software: 0,
        discipline: 0,
      },

      // Analytics & Stats
      stats: {
        productivity: 0,
        focusTimeMinutes: 0,
        frenchWords: 0,
        frenchListeningHours: 0,
        englishSpeakingLevel: 1,
        englishGrammar: 0,
      },
      
      // Language & Skill Levels (each can go up independently)
      langLevels: {
        french: 1,
        english: 1,
        software: 1,
      },

      // Spaced Repetition Memory (keeps last 50 words/concepts)
      vocabularyHistory: {
        french: [],
        english: [],
        software: [],
      },

      // Software Projects
      projects: [],
      
      // Long-term Goals
      goals: [],

      // Actions
      addVocabulary: (type, words) => set((state) => {
        if (!words || words.length === 0) return state;
        const currentList = state.vocabularyHistory[type] || [];
        // Extract just the word/concept strings
        const newWords = words.map(w => typeof w === 'string' ? w : w.word);
        
        // Combine, filter duplicates, and keep only the last 50
        const combined = [...new Set([...currentList, ...newWords])];
        if (combined.length > 50) {
          combined.splice(0, combined.length - 50); // keep last 50
        }
        
        return {
          vocabularyHistory: {
            ...state.vocabularyHistory,
            [type]: combined
          }
        };
      }),

      addXP: (amount) => set((state) => {
        const newXP = state.user.xp + amount;
        const newLevel = Math.floor(newXP / 1000) + 1; // 1000 XP per level
        return {
          user: {
            ...state.user,
            xp: newXP,
            level: newLevel,
          }
        };
      }),

      addTask: (task) => set((state) => ({
        tasks: [...state.tasks, { id: Date.now(), ...task, completed: false }]
      })),

      toggleTask: (id) => set((state) => ({
        tasks: state.tasks.map(t => 
          t.id === id ? { ...t, completed: !t.completed } : t
        )
      })),

      deleteTask: (id) => set((state) => ({
        tasks: state.tasks.filter(t => t.id !== id)
      })),

      updateProgress: (category, value) => set((state) => ({
        progress: {
          ...state.progress,
          [category]: Math.min(100, Math.max(0, value))
        }
      })),

      completeLanguageSession: (lang) => set((state) => {
        const currentProgress = state.progress[lang] || 0;
        const currentLangLevel = state.langLevels[lang] || 1;
        const newProgress = currentProgress + 5;

        // Level up if progress hits 100%
        if (newProgress >= 100) {
          return {
            progress: { ...state.progress, [lang]: 0 },
            langLevels: { ...state.langLevels, [lang]: currentLangLevel + 1 },
            stats: {
              ...state.stats,
              ...(lang === 'french' ? { frenchWords: state.stats.frenchWords + 15, frenchListeningHours: state.stats.frenchListeningHours + 0.5 } : {}),
              ...(lang === 'english' ? { englishGrammar: Math.min(100, state.stats.englishGrammar + 5) } : {}),
            },
            user: { ...state.user, xp: state.user.xp + 200 } // bonus XP for leveling up
          };
        }

        return {
          progress: { ...state.progress, [lang]: newProgress },
          stats: {
            ...state.stats,
            ...(lang === 'french' ? { frenchWords: state.stats.frenchWords + 15, frenchListeningHours: state.stats.frenchListeningHours + 0.5 } : {}),
            ...(lang === 'english' ? { englishGrammar: Math.min(100, state.stats.englishGrammar + 5) } : {}),
          },
          user: { ...state.user, xp: state.user.xp + 50 }
        };
      }),

      completeSoftwareSession: () => set((state) => {
        const currentProgress = state.progress.software || 0;
        const currentLangLevel = state.langLevels.software || 1;
        const newProgress = currentProgress + 5;

        if (newProgress >= 100) {
          return {
            progress: { ...state.progress, software: 0 },
            langLevels: { ...state.langLevels, software: currentLangLevel + 1 },
            user: { ...state.user, xp: state.user.xp + 200 }
          };
        }
        return {
          progress: { ...state.progress, software: newProgress },
          user: { ...state.user, xp: state.user.xp + 100 }
        };
      }),

      completeFocusSession: (minutes) => set((state) => ({
        stats: {
          ...state.stats,
          focusTimeMinutes: state.stats.focusTimeMinutes + minutes
        },
        progress: {
          ...state.progress,
          discipline: Math.min(100, state.progress.discipline + 1)
        },
        user: { ...state.user, xp: state.user.xp + (minutes * 2) }
      })),

      updateStreak: () => set((state) => {
        const today = new Date().toISOString().split('T')[0];
        const lastActive = state.user.lastActiveDate;
        
        if (today === lastActive) return state; // Already updated today

        // Simple streak logic (needs real Date diff for robust checking)
        const lastDate = new Date(lastActive);
        const currentDate = new Date(today);
        const diffTime = Math.abs(currentDate - lastDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 

        return {
          user: {
            ...state.user,
            streak: diffDays === 1 ? state.user.streak + 1 : 0,
            lastActiveDate: today
          }
        };
      }),

      // --- CLOUD SYNC ACTIONS ---
      syncToCloud: async () => {
        if (!db) {
          console.warn('Firebase is not initialized. Check your environment variables.');
          return { success: false, error: 'Firebase config missing' };
        }
        try {
          const currentState = useStore.getState();
          await set(ref(db, 'users/vision_os_user'), currentState);
          return { success: true };
        } catch (error) {
          console.error('Failed to sync to cloud:', error);
          return { success: false, error: error.message };
        }
      },

      loadFromCloud: async () => {
        if (!db) {
          console.warn('Firebase is not initialized.');
          return { success: false, error: 'Firebase config missing' };
        }
        try {
          const dbRef = ref(db);
          const snap = await get(child(dbRef, 'users/vision_os_user'));
          if (snap.exists()) {
            useStore.setState(snap.val());
            return { success: true };
          }
          return { success: false, error: 'No cloud data found' };
        } catch (error) {
          console.error('Failed to load from cloud:', error);
          return { success: false, error: error.message };
        }
      }
    }),
    {
      name: 'vision-os-v3', // Reset all user data to fresh start
    }
  )
);
