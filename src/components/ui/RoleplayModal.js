'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mic, Square, Loader2, Volume2 } from 'lucide-react';

export function RoleplayModal({ isOpen, onClose, language, level }) {
  const [history, setHistory] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcript, setTranscript] = useState('');
  
  const recognitionRef = useRef(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true;
        // set language
        if (language === 'french') recognition.lang = 'fr-FR';
        if (language === 'english') recognition.lang = 'en-US';

        recognition.onresult = (event) => {
          let currentTranscript = '';
          for (let i = event.resultIndex; i < event.results.length; i++) {
            currentTranscript += event.results[i][0].transcript;
          }
          setTranscript(currentTranscript);
        };

        recognition.onspeechend = () => {
          setIsRecording(false);
          recognition.stop();
        };

        recognition.onend = () => {
          setIsRecording(false);
          if (transcriptRef.current) {
            handleSendMessage(transcriptRef.current);
            setTranscript('');
            transcriptRef.current = '';
          }
        };

        recognitionRef.current = recognition;
      }
    }
  }, [language]);

  // Hack to use transcript in onend without stale closure
  const transcriptRef = useRef('');
  useEffect(() => {
    transcriptRef.current = transcript;
  }, [transcript]);

  const toggleRecording = () => {
    if (!recognitionRef.current) {
      alert("Your browser does not support Speech Recognition. Try Chrome.");
      return;
    }
    
    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      setTranscript('');
      recognitionRef.current.start();
      setIsRecording(true);
    }
  };

  const handleSendMessage = async (text) => {
    if (!text.trim()) return;

    const newHistory = [...history, { role: 'user', text }];
    setHistory(newHistory);
    setIsProcessing(true);

    try {
      const res = await fetch('/api/roleplay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          language,
          level,
          message: text,
          history: history
        })
      });

      const data = await res.json();
      if (data.error) throw new Error(data.error);

      setHistory([...newHistory, { role: 'model', text: data.reply }]);
      
      // Speak the reply
      speak(data.reply, language);

    } catch (err) {
      console.error(err);
      setHistory([...newHistory, { role: 'model', text: "Sorry, I had trouble connecting." }]);
    } finally {
      setIsProcessing(false);
    }
  };

  const speak = (text, lang) => {
    if ('speechSynthesis' in window) {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      if (lang === 'french') utterance.lang = 'fr-FR';
      if (lang === 'english') utterance.lang = 'en-US';
      window.speechSynthesis.speak(utterance);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex flex-col items-center justify-center p-4">
      <button 
        onClick={() => {
          if ('speechSynthesis' in window) window.speechSynthesis.cancel();
          onClose();
        }} 
        className="absolute top-8 right-8 text-zinc-500 hover:text-white bg-white/5 p-4 rounded-full transition-colors"
      >
        <X size={24} />
      </button>

      <div className="w-full max-w-2xl flex flex-col h-[80vh]">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white mb-2 capitalize">{language} Tutor</h2>
          <p className="text-zinc-400">Level {level} Conversational Practice</p>
        </div>

        {/* Chat History */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-2 mb-8 scrollbar-hide">
          {history.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-zinc-500 space-y-4">
              <Volume2 size={48} className="opacity-20" />
              <p>Tap the microphone and say something in {language}!</p>
            </div>
          )}
          
          <AnimatePresence>
            {history.map((msg, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-[80%] p-4 rounded-2xl ${
                    msg.role === 'user' 
                      ? 'bg-neon-blue/20 text-neon-blue rounded-tr-sm' 
                      : 'bg-white/10 text-white rounded-tl-sm'
                  }`}
                >
                  {msg.text}
                </div>
              </motion.div>
            ))}

            {isProcessing && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex w-full justify-start"
              >
                <div className="bg-white/5 text-zinc-400 p-4 rounded-2xl rounded-tl-sm flex items-center gap-2">
                  <Loader2 size={16} className="animate-spin" /> Thinking...
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Recording Controls */}
        <div className="flex flex-col items-center justify-end">
          <div className="h-16 flex items-center justify-center mb-4 text-center px-4 w-full">
            <AnimatePresence mode="wait">
              {isRecording ? (
                <motion.p 
                  key="recording"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-xl text-white font-medium"
                >
                  {transcript || "Listening..."}
                </motion.p>
              ) : (
                <motion.p 
                  key="idle"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-zinc-500"
                >
                  Tap to speak
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          <button 
            onClick={toggleRecording}
            disabled={isProcessing}
            className={`relative w-24 h-24 rounded-full flex items-center justify-center transition-all ${
              isProcessing ? 'opacity-50 cursor-not-allowed' : ''
            } ${
              isRecording 
                ? 'bg-red-500 text-white' 
                : 'bg-white text-black hover:scale-105 shadow-[0_0_40px_rgba(255,255,255,0.2)]'
            }`}
          >
            {isRecording ? (
              <>
                <div className="absolute inset-0 bg-red-500 rounded-full animate-ping opacity-75"></div>
                <Square size={32} fill="currentColor" className="relative z-10" />
              </>
            ) : (
              <Mic size={36} fill="currentColor" />
            )}
          </button>
        </div>

      </div>
    </div>
  );
}
