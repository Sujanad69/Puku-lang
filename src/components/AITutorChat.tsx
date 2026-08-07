import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types';
import { speakPt, playTone } from '../utils/audio';

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

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);
    if (!customText) setInputText('');
    setIsLoading(true);
    playTone(600, 'sine', 0.05);

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
      const replyText = data.reply || 'Muito bem, amor! Continua assim! ❤️';

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
          text: 'Muito bem! Estou muito orgulhoso de ti! ❤️',
          translation: 'Very good! I am so proud of you!',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const starterPrompts = [
    'Olá Sujan! ❤️',
    'Estou com saudades tuas',
    'Como foi o teu dia, amor?',
    'És o meu príncipe',
    'Já comeste?',
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] max-w-md mx-auto bg-white rounded-3xl border border-black/5 shadow-xl overflow-hidden">
      {/* Top Bar */}
      <div className="flex items-center justify-between border-b border-black/5 bg-slate-900 p-4 text-white">
        <div className="flex items-center gap-3">
          <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#58cc02] font-black text-white shadow-md">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
            <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-400 ring-2 ring-slate-900" />
          </div>

          <div>
            <h3 className="text-base font-extrabold flex items-center gap-1.5">
              <span>Chat with Sujan 🇵🇹</span>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.36-7.36l-.71.71M6.34 17.66l-.71.71m12.02 0l.71.71M6.34 6.34l.71.71M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z"/></svg>
            </h3>
            <p className="text-xs font-semibold text-slate-300">
              European Portuguese AI Practice Partner
            </p>
          </div>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 active:scale-95 transition-all"
            title="Close Chat"
          >
            ✕
          </button>
        )}
      </div>

      {/* Messages Feed */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
        {messages.map(msg => {
          const isSujan = msg.sender === 'sujan';

          return (
            <div
              key={msg.id}
              className={`flex items-end gap-2 ${isSujan ? 'justify-start' : 'justify-end'}`}
            >
              {isSujan && (
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#58cc02] text-white font-black text-xs shadow-sm">
                  S
                </div>
              )}

              <div
                className={`max-w-[80%] rounded-2xl p-3.5 shadow-sm space-y-1 ${
                  isSujan
                    ? 'bg-white border border-black/5 text-slate-900 rounded-bl-none'
                    : 'bg-[#58cc02] text-white rounded-br-none font-medium'
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-bold leading-relaxed">{msg.text}</p>
                  {isSujan && (
                    <button
                      onClick={() => speakPt(msg.text)}
                      className="text-[#58cc02] hover:scale-110 active:scale-95 transition-transform"
                      title="Listen to Sujan speak European Portuguese"
                    >
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg>
                    </button>
                  )}
                </div>

                {msg.translation && (
                  <p className="text-xs font-semibold text-slate-500 italic border-t border-slate-100 pt-1">
                    "{msg.translation}"
                  </p>
                )}

                <span className="block text-[9px] font-bold text-slate-400 text-right">
                  {msg.timestamp}
                </span>
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-center gap-2 text-slate-400 text-xs font-bold pl-2">
            <div className="h-2 w-2 rounded-full bg-[#58cc02] animate-bounce" />
            <div className="h-2 w-2 rounded-full bg-[#58cc02] animate-bounce [animation-delay:0.2s]" />
            <div className="h-2 w-2 rounded-full bg-[#58cc02] animate-bounce [animation-delay:0.4s]" />
            <span>Sujan is typing in Portuguese...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Starter Prompts */}
      <div className="p-2 border-t border-black/5 bg-slate-100 overflow-x-auto flex gap-1.5 no-scrollbar">
        {starterPrompts.map((prompt, i) => (
          <button
            key={i}
            onClick={() => handleSendMessage(prompt)}
            className="shrink-0 rounded-full border border-black/5 bg-white px-3 py-1 text-xs font-extrabold text-slate-700 shadow-sm active:scale-95 hover:bg-green-50 hover:text-[#58cc02]"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Input Box */}
      <form
        onSubmit={e => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="p-3 border-t border-black/5 bg-white flex items-center gap-2"
      >
        <input
          type="text"
          value={inputText}
          onChange={e => setInputText(e.target.value)}
          placeholder="Write to Sujan in Portuguese..."
          className="flex-1 rounded-full border border-black/10 bg-slate-100 px-4 py-3 text-sm font-bold text-slate-900 outline-none focus:border-[#58cc02] focus:bg-white"
        />

        <button
          type="submit"
          disabled={!inputText.trim() || isLoading}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#58cc02] text-white shadow-md active:scale-90 disabled:opacity-40 transition-transform"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
        </button>
      </form>
    </div>
  );
};
