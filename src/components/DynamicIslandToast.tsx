
import React, { useState, useEffect } from 'react';
import { triggerHaptic } from '../utils/haptics';

export const DynamicIslandToast: React.FC = () => {
  const [toast, setToast] = useState<any>(null);
  useEffect(() => {
    const listener = (e: any) => {
      setToast(e.detail);
      triggerHaptic('success');
      setTimeout(() => setToast(null), 3500);
    };
    window.addEventListener('show-toast', listener);
    return () => window.removeEventListener('show-toast', listener);
  }, []);
  if (!toast) return null;
  return (
    <div className="fixed top-4 left-0 right-0 z-[9999] flex justify-center pointer-events-none px-4">
      <div className="bg-black/90 backdrop-blur-xl text-white px-6 py-3 rounded-[32px] shadow-2xl flex items-center gap-4 slide-in-from-top-10 fade-in duration-300 border border-white/10">
        <span className="text-2xl drop-shadow-md">{toast.icon}</span>
        <div className="flex flex-col">
          <span className="text-[10px] uppercase tracking-widest font-black text-white/50">{toast.title}</span>
          <span className="text-sm font-bold">{toast.message}</span>
        </div>
      </div>
    </div>
  );
};
