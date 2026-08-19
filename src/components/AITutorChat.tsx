import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types';
import { speakPt, playTone } from '../utils/audio';
import { triggerHaptic } from '../utils/haptics';
import { X, Volume2, Sparkles, Send, Bot, Heart, MessageSquare } from 'lucide-react';
import { FlagPortugal } from './icons/PremiumIcons';

interface AITutorChatProps {
  onClose?: () => void;
}

export const AITutorChat: React.FC<AITutorChatProps> = ({ onClose }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'sujan',
      text: 'Olá amor! Como estás hoje? Estou tão orgulhoso de ti por estares a aprender português!',
      translation: 'Hello love! How are you today? I am so proud of you for learning Portuguese!',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (customText?: string) => {
    const textToSend = customText || inputText;
    if (!textToSend.trim() || isLoading) return;

    triggerHaptic('light');
    playTone(600, 'sine', 0.04);

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);
    if (!customText) setInputText('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMsg.text,
          history: messages.slice(-6).map(m => ({ sender: m.sender, text: m.text })),
        }),
      });

      const data = await response.json();
      const replyText = data.reply || 'Muito bem, amor! Continua assim!';

      // Parse optional English translation in brackets if present
      let mainText = replyText;
      let transText = '';
      const match = replyText.match(/(.*)\((.*)\)/s);
      if (match) {
        mainText = match[1].trim();
        transText = match[2].trim();
      }

      const sujanMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'sujan',
        text: mainText,
        translation: transText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages(prev => [...prev, sujanMsg]);
      speakPt(sujanMsg.text);
    } catch (err) {
      console.error('Chat error:', err);
      setMessages(prev => [
        ...prev,
        {
          id: Date.now().toString(),
          sender: 'sujan',
          text: 'Muito bem! Estou muito orgulhoso de ti!',
          translation: 'Very good! I am so proud of you!',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const starterPrompts = [
    'Olá Sujan!',
    'Estou com saudades tuas',
    'Como foi o teu dia, amor?',
    'És o meu príncipe',
    'Já comeste?',
  ];

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-xl ios-fade-in">
      
      <div className="relative w-full max-w-2xl overflow-hidden rounded-[36px] bg-white dark:bg-[#12141a] border border-slate-200/60 dark:border-slate-800/80 shadow-2xl flex flex-col max-h-[92vh] ios-modal-scale-in">
        
        {/* ================= HEADER BANNER ================= */}
        <div className="relative bg-gradient-to-br from-[#1e40af] via-[#2563eb] to-[#4f46e5] p-6 text-white text-center overflow-hidden shrink-0">
          
          {/* Ambient Glows */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden select-none opacity-20">
            <div className="absolute -top-10 -right-10 w-44 h-44 bg-blue-200 rounded-full blur-2xl"></div>
            <div className="absolute -bottom-10 -left-10 w-44 h-44 bg-indigo-300 rounded-full blur-2xl"></div>
          </div>

          {/* Close Button */}
          {onClose && (
            <button
              onClick={onClose}
              className="absolute top-4 right-4 h-9 w-9 rounded-full bg-black/20 hover:bg-black/30 flex items-center justify-center text-white transition-colors cursor-pointer backdrop-blur-md"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
          )}

          {/* Pill Badge */}
          <div className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3.5 py-1 text-[11px] font-extrabold uppercase tracking-wider backdrop-blur-md border border-white/20 mb-2 shadow-xs">
            <Bot className="w-3.5 h-3.5 text-blue-200" />
            <span>AI European Portuguese Practice Partner</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white leading-tight flex items-center justify-center gap-2">
            <span>Conversa com Sujan</span>
            <FlagPortugal size={24} />
          </h2>

          <p className="text-xs sm:text-sm text-blue-100 font-medium mt-1 max-w-md mx-auto leading-relaxed">
            Real-time European Portuguese chat with natural audio feedback and instant translations.
          </p>

        </div>

        {/* ================= CHAT MESSAGES FEED ================= */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3.5 bg-slate-50/50 dark:bg-[#0e1015]">
          {messages.map(msg => {
            const isSujan = msg.sender === 'sujan';

            return (
              <div
                key={msg.id}
                className={`flex items-end gap-2 ${isSujan ? 'justify-start' : 'justify-end'}`}
              >
                {isSujan && (
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white font-black text-xs shadow-xs">
                    S
                  </div>
                )}

                <div
                  className={`max-w-[82%] sm:max-w-[75%] rounded-3xl p-4 shadow-xs space-y-1.5 ${
                    isSujan
                      ? 'bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-slate-900 dark:text-white rounded-bl-xs'
                      : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-br-xs font-semibold'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-sm font-bold leading-relaxed">{msg.text}</p>
                    {isSujan && (
                      <button
                        onClick={() => speakPt(msg.text)}
                        className="text-blue-600 dark:text-blue-400 hover:scale-110 active:scale-95 transition-transform shrink-0 pt-0.5 cursor-pointer"
                        title="Listen to pronunciation"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  {msg.translation && (
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400 italic border-t border-slate-100 dark:border-slate-800 pt-1.5">
                      "{msg.translation}"
                    </p>
                  )}

                  <span className={`block text-[10px] font-mono text-right ${
                    isSujan ? 'text-slate-400' : 'text-blue-200'
                  }`}>
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            );
          })}

          {isLoading && (
            <div className="flex items-center gap-2 text-slate-400 text-xs font-bold pl-2 py-2">
              <div className="h-2 w-2 rounded-full bg-blue-600 animate-bounce" />
              <div className="h-2 w-2 rounded-full bg-blue-600 animate-bounce [animation-delay:0.2s]" />
              <div className="h-2 w-2 rounded-full bg-blue-600 animate-bounce [animation-delay:0.4s]" />
              <span>Sujan is typing in Portuguese...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Starter Prompts */}
        <div className="p-2.5 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-x-auto flex gap-1.5 no-scrollbar shrink-0">
          {starterPrompts.map((prompt, i) => (
            <button
              key={i}
              onClick={() => handleSendMessage(prompt)}
              className="shrink-0 rounded-full border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 px-3 py-1 text-xs font-bold text-slate-700 dark:text-slate-200 shadow-xs active:scale-95 hover:border-blue-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* ================= INPUT FOOTER ================= */}
        <form
          onSubmit={e => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="p-3 sm:p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-[#0e1015] flex items-center gap-2 shrink-0"
        >
          <input
            type="text"
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            placeholder="Write to Sujan in Portuguese..."
            className="flex-1 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-3 text-sm font-semibold text-slate-900 dark:text-white outline-none focus:border-blue-500 transition-colors"
          />

          <button
            type="submit"
            disabled={!inputText.trim() || isLoading}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-blue-600 hover:bg-blue-700 text-white shadow-sm active:scale-95 disabled:opacity-40 transition-all cursor-pointer"
            title="Send Message"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

      </div>

    </div>
  );
};
