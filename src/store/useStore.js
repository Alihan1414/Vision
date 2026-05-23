import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { saveToCloud, loadFromCloud, getBinId } from '@/lib/cloudSync';

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
      
      // Namaz Tracking
      namaz: {
        sabah: false,
        ogle: false,
        ikindi: false,
        aksam: false,
        yatsi: false,
      },
      
      // Progress Stats (0 to 100)
      progress: {
        french: 0,
        english: 0,
        software: 0,
        discipline: 0,
        spor: 0,
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

      // Water Intake (glasses)
      waterIntake: 0,

      // Sleep Data
      sleep: {
        bedtime: '',
        wakeTime: '',
        quality: 'medium',
      },

      // Finance Data
      finance: {
        transactions: [],
        budget: 0,
        currency: 'TRY',
      },

      // Reading Books
      books: {
        current: {
          title: '',
          page: 0,
          totalPages: 0,
        },
        completed: [],
      },

      // Vision Board
      visionBoard: {
        items: [],
      },

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
          },
          // Reset daily namaz
          namaz: { sabah: false, ogle: false, ikindi: false, aksam: false, yatsi: false },
          // Reset daily water intake
          waterIntake: 0
        };
      }),

      completeSporSession: () => set((state) => {
        const currentProgress = state.progress.spor || 0;
        const newProgress = currentProgress + 10;

        if (newProgress >= 100) {
          return {
            progress: { ...state.progress, spor: 0 },
            user: { ...state.user, xp: state.user.xp + 200 }
          };
        }
        return {
          progress: { ...state.progress, spor: newProgress },
          user: { ...state.user, xp: state.user.xp + 50 }
        };
      }),

      toggleNamaz: (vakit) => set((state) => {
        const isCompleted = !state.namaz[vakit];
        return {
          namaz: { ...state.namaz, [vakit]: isCompleted },
          user: { ...state.user, xp: state.user.xp + (isCompleted ? 20 : -20) }
        };
      }),

      addWaterIntake: (amount) => set((state) => ({
        waterIntake: Math.max(0, state.waterIntake + amount)
      })),

      updateSleep: (sleepData) => set((state) => ({
        sleep: { ...state.sleep, ...sleepData }
      })),

      addTransaction: (transaction) => set((state) => ({
        finance: {
          ...state.finance,
          transactions: [
            ...state.finance.transactions,
            { id: Date.now(), date: new Date().toISOString().split('T')[0], ...transaction }
          ]
        }
      })),

      deleteTransaction: (id) => set((state) => ({
        finance: {
          ...state.finance,
          transactions: state.finance.transactions.filter((t) => t.id !== id)
        }
      })),

      setBudget: (budget) => set((state) => ({
        finance: { ...state.finance, budget }
      })),

      updateCurrentBook: (bookData) => set((state) => ({
        books: {
          ...state.books,
          current: { ...state.books.current, ...bookData }
        }
      })),

      completeBook: () => set((state) => {
        if (!state.books.current.title) return state;
        const completedBook = {
          ...state.books.current,
          completedDate: new Date().toISOString().split('T')[0]
        };
        return {
          books: {
            current: { title: '', page: 0, totalPages: 0 },
            completed: [...state.books.completed, completedBook]
          },
          user: { ...state.user, xp: state.user.xp + 300 }
        };
      }),

      addGoal: (goal) => set((state) => ({
        goals: [
          ...state.goals,
          {
            id: Date.now(),
            title: goal.title,
            deadline: goal.deadline,
            subGoals: (goal.subGoals || []).map((sg, idx) => ({ id: `${Date.now()}-${idx}`, title: sg.title || sg, completed: false })),
            progress: 0
          }
        ]
      })),

      toggleSubGoal: (goalId, subGoalId) => set((state) => {
        const updatedGoals = state.goals.map((g) => {
          if (g.id !== goalId) return g;
          const updatedSubGoals = g.subGoals.map((sg) =>
            sg.id === subGoalId ? { ...sg, completed: !sg.completed } : sg
          );
          const completedCount = updatedSubGoals.filter((sg) => sg.completed).length;
          const progress = updatedSubGoals.length > 0 ? Math.round((completedCount / updatedSubGoals.length) * 100) : 0;
          return { ...g, subGoals: updatedSubGoals, progress };
        });
        return { goals: updatedGoals };
      }),

      deleteGoal: (id) => set((state) => ({
        goals: state.goals.filter((g) => g.id !== id)
      })),

      addVisionItem: (item) => set((state) => ({
        visionBoard: {
          ...state.visionBoard,
          items: [
            ...(state.visionBoard?.items || []),
            { id: Date.now(), text: item.text, emoji: item.emoji || '✨', color: item.color || 'from-indigo-500/20 to-purple-600/20' }
          ]
        }
      })),

      deleteVisionItem: (id) => set((state) => ({
        visionBoard: {
          ...state.visionBoard,
          items: (state.visionBoard?.items || []).filter((item) => item.id !== id)
        }
      })),

      // --- CLOUD SYNC ACTIONS ---
      syncToCloud: async () => {
        try {
          const currentState = useStore.getState();
          const result = await saveToCloud(currentState);
          return result;
        } catch (error) {
          console.error('Failed to sync to cloud:', error);
          return { success: false, error: error.message };
        }
      },

      loadFromCloud: async (customBinId) => {
        try {
          const result = await loadFromCloud(customBinId);
          if (result.success && result.data) {
            // Only restore plain data fields, not functions
            const { 
              user, tasks, progress, stats, langLevels, vocabularyHistory, projects, goals, namaz,
              waterIntake, sleep, finance, books, visionBoard
            } = result.data;
            useStore.setState({ 
              user, 
              tasks, 
              progress, 
              stats, 
              langLevels, 
              vocabularyHistory, 
              projects, 
              goals, 
              namaz: namaz || { sabah: false, ogle: false, ikindi: false, aksam: false, yatsi: false },
              waterIntake: waterIntake || 0,
              sleep: sleep || { bedtime: '', wakeTime: '', quality: 'medium' },
              finance: finance || { transactions: [], budget: 0, currency: 'TRY' },
              books: books || { current: { title: '', page: 0, totalPages: 0 }, completed: [] },
              visionBoard: visionBoard || { items: [] }
            });
          }
          return result;
        } catch (error) {
          console.error('Failed to load from cloud:', error);
          return { success: false, error: error.message };
        }
      },

      getBinId: () => getBinId(),
    }),
    {
      name: 'vision-os-v3', // Reset all user data to fresh start
    }
  )
);
