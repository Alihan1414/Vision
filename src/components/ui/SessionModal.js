'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Volume2, CheckCircle2, XCircle, Trophy, Loader2 } from 'lucide-react';
import { useStore } from '@/store/useStore';

export function SessionModal({ isOpen, onClose, type, level, onComplete }) {
  const { vocabularyHistory } = useStore();
  const [step, setStep] = useState('learn'); // 'loading' | 'learn' | 'quiz' | 'reward' | 'error'
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [content, setContent] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (isOpen) {
      setStep('loading');
      setContent(null);
      setErrorMsg('');
      
      // Get 3 random words from history for Spaced Repetition
      const history = vocabularyHistory[type] || [];
      let reviewWords = [];
      if (history.length > 0) {
        const shuffled = [...history].sort(() => 0.5 - Math.random());
        reviewWords = shuffled.slice(0, 3);
      }
      
      fetch('/api/generate-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, level, reviewWords })
      })
      .then(res => res.json().then(data => ({ status: res.status, data })))
      .then(({ status, data }) => {
        if (status !== 200) {
          setErrorMsg(data.error || 'Failed to generate session.');
          setStep('error');
          return;
        }
        setContent(data);
        setStep('learn');
      })
      .catch(err => {
        setErrorMsg(err.message);
        setStep('error');
      });
    } else {
      // Reset when closed
      setStep('learn');
      setContent(null);
      setSelectedAnswer(null);
      setIsCorrect(null);
    }
  }, [isOpen, type, level]);

  if (!isOpen) return null;

  const handleSpeak = (text, lang) => {
    const utterance = new SpeechSynthesisUtterance(text);
    if (lang === 'french') utterance.lang = 'fr-FR';
    if (lang === 'english') utterance.lang = 'en-US';
    window.speechSynthesis.speak(utterance);
  };

  const handleAnswer = (index) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(index);
    const correct = index === content.quiz.correctIndex;
    setIsCorrect(correct);

    if (correct) {
      setTimeout(() => setStep('reward'), 1500);
    } else {
      setTimeout(() => {
        setSelectedAnswer(null);
        setIsCorrect(null);
      }, 2000);
    }
  };

  const finishSession = () => {
    onComplete(content?.words);
    setStep('learn');
    setSelectedAnswer(null);
    setIsCorrect(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <AnimatePresence mode="wait">
        
        {/* LOADING STEP */}
        {step === 'loading' && (
          <motion.div 
            key="loading"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-zinc-900 border border-white/10 p-10 rounded-3xl flex flex-col items-center shadow-2xl relative"
          >
            <button onClick={onClose} className="absolute top-4 right-4 text-zinc-500 hover:text-white">
              <X size={20} />
            </button>
            <Loader2 size={48} className="text-neon-blue animate-spin mb-4" />
            <h2 className="text-xl font-bold text-white mb-2">AI is generating your session...</h2>
            <p className="text-zinc-400">Crafting personalized content for Level {level}</p>
          </motion.div>
        )}

        {/* ERROR STEP */}
        {step === 'error' && (
          <motion.div 
            key="error"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-zinc-900 border border-red-500/50 p-10 rounded-3xl flex flex-col items-center max-w-md shadow-[0_0_30px_rgba(239,68,68,0.2)] relative text-center"
          >
            <button onClick={onClose} className="absolute top-4 right-4 text-zinc-500 hover:text-white">
              <X size={20} />
            </button>
            <XCircle size={48} className="text-red-500 mb-4" />
            <h2 className="text-xl font-bold text-white mb-2">Connection Error</h2>
            <p className="text-zinc-400 mb-6">{errorMsg}</p>
            <p className="text-sm text-zinc-500 mb-6">
              Make sure you have added your GEMINI_API_KEY to the .env.local file.
            </p>
            <button 
              onClick={onClose}
              className="bg-red-500/20 text-red-500 hover:bg-red-500 hover:text-white px-6 py-2 rounded-lg font-bold transition-colors"
            >
              Close
            </button>
          </motion.div>
        )}

        {/* LEARN STEP */}
        {step === 'learn' && content && (
          <motion.div 
            key="learn"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="bg-zinc-900 border border-white/10 p-8 rounded-3xl w-full max-w-2xl relative shadow-2xl"
          >
            <button onClick={onClose} className="absolute top-6 right-6 text-zinc-500 hover:text-white">
              <X size={24} />
            </button>
            
            <h2 className="text-2xl font-bold mb-6 text-neon-blue capitalize">{type} Session - Level {level}</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-4 text-zinc-300 border-b border-white/10 pb-2">Vocabulary</h3>
                <ul className="space-y-3">
                  {content.words.map((w, i) => (
                    <li key={i} className="flex flex-col bg-black/50 p-3 rounded-lg border border-white/5">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-white">{w.word}</span>
                        {type !== 'software' && (
                          <button onClick={() => handleSpeak(w.word, type)} className="text-zinc-500 hover:text-neon-blue">
                            <Volume2 size={16} />
                          </button>
                        )}
                      </div>
                      <span className="text-sm text-zinc-400">{w.meaning}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex flex-col">
                <h3 className="text-lg font-semibold mb-4 text-zinc-300 border-b border-white/10 pb-2">Context / Reading</h3>
                <div className="flex-1 bg-black/50 p-5 rounded-lg border border-white/5 text-zinc-300 leading-relaxed relative">
                  <p>{content.text}</p>
                  {type !== 'software' && (
                    <button 
                      onClick={() => handleSpeak(content.text, type)} 
                      className="absolute bottom-4 right-4 bg-neon-blue/20 text-neon-blue p-2 rounded-full hover:bg-neon-blue hover:text-black transition-colors"
                    >
                      <Volume2 size={20} />
                    </button>
                  )}
                </div>
              </div>
            </div>

            <button 
              onClick={() => setStep('quiz')}
              className="w-full mt-8 bg-neon-blue text-black font-bold text-lg py-4 rounded-xl hover:bg-white transition-colors"
            >
              I'm Ready for the Quiz
            </button>
          </motion.div>
        )}

        {/* QUIZ STEP */}
        {step === 'quiz' && content && (
          <motion.div 
            key="quiz"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-zinc-900 border border-white/10 p-8 rounded-3xl w-full max-w-xl relative shadow-2xl"
          >
            <h2 className="text-xl font-bold mb-8 text-center text-zinc-200">Knowledge Check</h2>
            <p className="text-2xl font-bold text-white mb-8 text-center">{content.quiz.question}</p>
            
            <div className="space-y-4">
              {content.quiz.options.map((opt, i) => {
                let btnClass = "bg-black border-white/10 text-white hover:border-neon-blue";
                let Icon = null;

                if (selectedAnswer === i) {
                  if (isCorrect) {
                    btnClass = "bg-neon-green/20 border-neon-green text-neon-green";
                    Icon = CheckCircle2;
                  } else {
                    btnClass = "bg-red-500/20 border-red-500 text-red-500";
                    Icon = XCircle;
                  }
                } else if (selectedAnswer !== null && i === content.quiz.correctIndex) {
                  btnClass = "bg-neon-green/10 border-neon-green/50 text-neon-green";
                  Icon = CheckCircle2;
                }

                return (
                  <button 
                    key={i}
                    disabled={selectedAnswer !== null}
                    onClick={() => handleAnswer(i)}
                    className={`w-full p-5 rounded-xl border-2 text-left font-medium transition-all flex justify-between items-center ${btnClass}`}
                  >
                    <span>{opt}</span>
                    {Icon && <Icon size={24} />}
                  </button>
                )
              })}
            </div>
          </motion.div>
        )}

        {/* REWARD STEP */}
        {step === 'reward' && (
          <motion.div 
            key="reward"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-zinc-900 border border-neon-green p-10 rounded-3xl w-full max-w-sm relative shadow-[0_0_50px_rgba(0,255,102,0.2)] text-center flex flex-col items-center"
          >
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1, rotate: 360 }}
              transition={{ type: "spring", bounce: 0.5, delay: 0.2 }}
              className="w-24 h-24 bg-neon-green/20 rounded-full flex items-center justify-center text-neon-green mb-6"
            >
              <Trophy size={48} />
            </motion.div>
            
            <h2 className="text-3xl font-black text-white mb-2">Session Complete!</h2>
            <p className="text-zinc-400 mb-8">+50 XP & Progress Increased</p>
            
            <button 
              onClick={finishSession}
              className="w-full bg-neon-green text-black font-bold text-lg py-4 rounded-xl hover:bg-white transition-colors"
            >
              Claim Reward
            </button>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
