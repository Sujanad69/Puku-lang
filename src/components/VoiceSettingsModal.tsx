import React, { useState, useEffect } from 'react';
import { 
  loadVoiceSettings, 
  saveVoiceSettings, 
  getAvailableVoices, 
  findBestPtVoice,
  speakPt, 
  stopSpeech,
  subscribeAudioState,
  AudioPlaybackState,
  DEFAULT_VOICE_SETTINGS 
} from '../utils/audio';
import { playTone } from '../utils/audio';
import { triggerHaptic } from '../utils/haptics';
import { VoiceSettings } from '../types';
import { 
  X, 
  Volume2, 
  Sparkles, 
  Check, 
  RotateCcw, 
  Sliders, 
  Mic, 
  User, 
  Gauge, 
  Music,
  Square
} from 'lucide-react';
import { FlagPortugal, PukuMonkeyIcon } from './icons/PremiumIcons';

interface VoiceSettingsModalProps {
  onClose: () => void;
  lang?: 'en' | 'pt';
}

export const VoiceSettingsModal: React.FC<VoiceSettingsModalProps> = ({ onClose, lang = 'en' }) => {
  const [settings, setSettings] = useState<VoiceSettings>(() => loadVoiceSettings());
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [playback, setPlayback] = useState<AudioPlaybackState>({
    isPlaying: false,
    text: '',
    lang: 'pt-PT',
    rate: 0.85
  });

  useEffect(() => {
    const updateVoices = () => {
      const voices = getAvailableVoices();
      setAvailableVoices(voices);
    };

    updateVoices();
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.onvoiceschanged = updateVoices;
    }

    const unsub = subscribeAudioState((state) => {
      setPlayback(state);
    });

    return () => {
      unsub();
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.onvoiceschanged = null;
      }
    };
  }, []);

  const handleUpdate = (updates: Partial<VoiceSettings>) => {
    const next = { ...settings, ...updates };
    setSettings(next);
    saveVoiceSettings(next);
  };

  const handleSelectPreset = (preset: VoiceSettings['preset']) => {
    playTone(550, 'sine', 0.04);
    triggerHaptic('light');

    let rate = 0.85;
    let pitch = 1.0;
    let targetURI: string | undefined = undefined;

    if (preset === 'joana') {
      rate = 0.85;
      pitch = 1.05;
      const matched = findBestPtVoice(availableVoices, undefined, 'female');
      if (matched) targetURI = matched.voiceURI;
    } else if (preset === 'cristiano') {
      rate = 0.86;
      pitch = 0.72; // Deep, genuine masculine resonance
      const matched = findBestPtVoice(availableVoices, undefined, 'male');
      if (matched) targetURI = matched.voiceURI;
    } else if (preset === 'lisbon_natural') {
      rate = 0.75;
      pitch = 1.0;
    } else if (preset === 'porto_express') {
      rate = 1.0;
      pitch = 1.0;
    }

    const next: VoiceSettings = {
      ...settings,
      preset,
      voiceURI: targetURI || settings.voiceURI,
      rate,
      pitch
    };
    setSettings(next);
    saveVoiceSettings(next);

    // Speak immediate signature sample
    const sampleText = preset === 'joana' 
      ? "Olá Amisha! Sou a Joana de Lisboa. O Sujan ama-te muito!" 
      : preset === 'cristiano' 
      ? "Olá Amisha! Sou o Cristiano. Força, vamos aprender português!" 
      : preset === 'lisbon_natural'
      ? "Uma bica e um pastel de nata, por favor."
      : "Vamos aprender português juntos!";
    
    speakPt(sampleText);
  };

  const handleTestVoice = (customPhrase?: string) => {
    playTone(600, 'sine', 0.04);
    triggerHaptic('medium');
    const phrase = customPhrase || "Olá Amisha! Bem-vinda a Portugal! Como estás hoje?";
    speakPt(phrase);
  };

  const handleReset = () => {
    playTone(450, 'sine', 0.04);
    triggerHaptic('light');
    setSettings(DEFAULT_VOICE_SETTINGS);
    saveVoiceSettings(DEFAULT_VOICE_SETTINGS);
  };

  const presets = [
    {
      id: 'joana' as const,
      name: 'Joana (Lisboa)',
      tag: 'Gentle Female',
      desc: 'Soft, melodious European Portuguese accent, perfect for daily lessons.',
      color: 'from-pink-500/20 to-rose-500/20 border-rose-500/30 text-rose-500 dark:text-rose-400',
      activeColor: 'border-rose-500 bg-rose-50 dark:bg-rose-950/40',
      icon: '👩🏻'
    },
    {
      id: 'cristiano' as const,
      name: 'Cristiano (Lisboa)',
      tag: 'Deep Male',
      desc: 'Warm, clear Continental Portuguese voice with authentic Lisbon cadence.',
      color: 'from-blue-500/20 to-indigo-500/20 border-blue-500/30 text-blue-500 dark:text-blue-400',
      activeColor: 'border-blue-500 bg-blue-50 dark:bg-blue-950/40',
      icon: '👨🏻'
    },
    {
      id: 'lisbon_natural' as const,
      name: 'Lisboa Natural (0.75x)',
      tag: 'Clear & Calm',
      desc: 'Gentle paced speech with crystal clear vowel reduction and silent endings.',
      color: 'from-emerald-500/20 to-teal-500/20 border-emerald-500/30 text-emerald-500 dark:text-emerald-400',
      activeColor: 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40',
      icon: '🌿'
    },
    {
      id: 'porto_express' as const,
      name: 'Porto Express (1.0x)',
      tag: 'Native Speed',
      desc: 'Natural street-level conversation speed for advanced listening drills.',
      color: 'from-amber-500/20 to-orange-500/20 border-amber-500/30 text-amber-500 dark:text-amber-400',
      activeColor: 'border-amber-500 bg-amber-50 dark:bg-amber-950/40',
      icon: '⚡'
    }
  ];

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-2xl ios-fade-in font-['Courier_New',Courier,monospace]">
      <div className="relative w-full max-w-lg overflow-hidden rounded-[32px] bg-white dark:bg-[#1c1c1e] border border-slate-200 dark:border-white/10 shadow-2xl flex flex-col max-h-[90vh] ios-modal-scale-in">
        
        {/* Header */}
        <div className="relative p-5 sm:p-6 pb-4 border-b border-black/[0.06] dark:border-white/[0.08] flex items-center justify-between bg-slate-50/50 dark:bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <Mic className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black text-slate-900 dark:text-white">
                  {lang === 'pt' ? 'Configuração de Voz AI' : 'AI Voice & Audio Studio'}
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[10px] font-black border border-blue-500/20">
                  pt-PT
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-zinc-400 font-medium">
                {lang === 'pt' ? 'Personalize o sotaque e velocidade de Lisboa' : 'Customize your European Portuguese accent & cadence'}
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              playTone(450, 'sine', 0.03);
              onClose();
            }}
            className="w-8 h-8 rounded-full bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 flex items-center justify-center text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1">
          
          {/* Live Waveform Audio Player Banner */}
          <div className={`p-4 rounded-2xl border transition-all duration-300 ${
            playback.isPlaying 
              ? 'bg-blue-600 text-white border-blue-400 shadow-lg shadow-blue-500/20' 
              : 'bg-black/[0.03] dark:bg-white/[0.04] border-black/[0.06] dark:border-white/[0.08] text-slate-900 dark:text-white'
          }`}>
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                  playback.isPlaying ? 'bg-white/20 text-white' : 'bg-blue-500/10 text-blue-500'
                }`}>
                  <Volume2 className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] uppercase font-bold tracking-wider opacity-70">
                    {playback.isPlaying ? '🔊 Tocando agora...' : 'Prévia de Voz'}
                  </p>
                  <p className="text-xs font-bold truncate">
                    {playback.isPlaying ? `"${playback.text}"` : 'Toque para testar a pronúncia'}
                  </p>
                </div>
              </div>

              {/* Animated Waveform Equalizer Bars */}
              <div className="flex items-center gap-1 shrink-0 h-6">
                {[1, 2, 3, 4, 5].map((bar) => (
                  <span
                    key={bar}
                    className={`w-1 rounded-full transition-all duration-150 ${
                      playback.isPlaying 
                        ? 'bg-white animate-pulse' 
                        : 'bg-slate-300 dark:bg-zinc-700 h-2'
                    }`}
                    style={{
                      height: playback.isPlaying ? `${Math.max(6, (bar * 5) % 24 + 4)}px` : '4px',
                      animationDelay: `${bar * 120}ms`
                    }}
                  />
                ))}
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-current/10 flex items-center gap-2">
              <button
                onClick={() => handleTestVoice()}
                className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 ${
                  playback.isPlaying 
                    ? 'bg-white text-blue-600 hover:bg-white/90 shadow' 
                    : 'bg-blue-600 text-white hover:bg-blue-500 shadow-md'
                }`}
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>Test Voice Sample</span>
              </button>

              {playback.isPlaying && (
                <button
                  onClick={() => stopSpeech()}
                  className="py-2 px-3 rounded-xl bg-black/20 text-white hover:bg-black/30 text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer"
                >
                  <Square className="w-3.5 h-3.5" />
                  <span>Stop</span>
                </button>
              )}
            </div>
          </div>

          {/* Preset AI Voice Profiles */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400">
                Voice Personalities
              </label>
              <span className="text-[10px] text-blue-500 font-bold">Lisbon Native</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {presets.map((preset) => {
                const isSelected = settings.preset === preset.id;
                return (
                  <button
                    key={preset.id}
                    onClick={() => handleSelectPreset(preset.id)}
                    className={`p-3.5 rounded-2xl border text-left transition-all relative cursor-pointer active:scale-[0.98] ${
                      isSelected
                        ? `${preset.activeColor} border-2 shadow-sm`
                        : 'border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-white/[0.02] hover:border-slate-300 dark:hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{preset.icon}</span>
                        <div>
                          <p className="text-xs font-black text-slate-900 dark:text-white">
                            {preset.name}
                          </p>
                          <span className="text-[10px] font-bold text-slate-400 dark:text-zinc-500">
                            {preset.tag}
                          </span>
                        </div>
                      </div>

                      {isSelected && (
                        <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                      )}
                    </div>
                    
                    <p className="text-[11px] text-slate-500 dark:text-zinc-400 mt-2 line-clamp-2 leading-relaxed">
                      {preset.desc}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Fine Tuning Sliders */}
          <div className="space-y-4 pt-2 border-t border-black/[0.06] dark:border-white/[0.08]">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400 flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-blue-500" />
                <span>Fine-Tuning Controls</span>
              </label>
              <button
                onClick={handleReset}
                className="text-[10px] font-bold text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200 flex items-center gap-1 cursor-pointer transition-colors"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            </div>

            {/* Speech Rate Slider */}
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="flex items-center gap-1.5 text-slate-700 dark:text-zinc-300">
                  <Gauge className="w-3.5 h-3.5 text-amber-500" />
                  <span>Speaking Speed</span>
                </span>
                <span className="text-blue-600 dark:text-blue-400 font-mono">
                  {settings.rate.toFixed(2)}x {settings.rate <= 0.65 ? '(Slow)' : settings.rate >= 1.05 ? '(Fast)' : '(Natural)'}
                </span>
              </div>
              <input
                type="range"
                min="0.5"
                max="1.3"
                step="0.05"
                value={settings.rate}
                onChange={(e) => handleUpdate({ rate: parseFloat(e.target.value), preset: 'custom' })}
                className="w-full h-1.5 bg-slate-200 dark:bg-white/20 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-bold">
                <span>0.5x (Learner)</span>
                <span>0.85x (Lisbon Standard)</span>
                <span>1.3x (Fast)</span>
              </div>
            </div>

            {/* Pitch Tuning Slider */}
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="flex items-center gap-1.5 text-slate-700 dark:text-zinc-300">
                  <Music className="w-3.5 h-3.5 text-purple-500" />
                  <span>Voice Pitch / Tone</span>
                </span>
                <span className="text-purple-600 dark:text-purple-400 font-mono">
                  {settings.pitch.toFixed(2)}x {settings.pitch < 0.95 ? '(Deep)' : settings.pitch > 1.05 ? '(Higher)' : '(Natural)'}
                </span>
              </div>
              <input
                type="range"
                min="0.5"
                max="1.4"
                step="0.02"
                value={settings.pitch}
                onChange={(e) => handleUpdate({ pitch: parseFloat(e.target.value), preset: 'custom' })}
                className="w-full h-1.5 bg-slate-200 dark:bg-white/20 rounded-lg appearance-none cursor-pointer accent-purple-600"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-bold">
                <span>0.5x (Deep Baritone)</span>
                <span>1.0x (Standard)</span>
                <span>1.4x (High Tone)</span>
              </div>
            </div>

            {/* System Installed Voices Dropdown */}
            {availableVoices.length > 0 && (
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 space-y-2">
                <label className="text-xs font-bold text-slate-700 dark:text-zinc-300 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Installed System Voice</span>
                </label>
                <select
                  value={settings.voiceURI || ''}
                  onChange={(e) => handleUpdate({ voiceURI: e.target.value, preset: 'custom' })}
                  className="w-full p-2.5 rounded-xl bg-white dark:bg-[#2c2c2e] border border-slate-200 dark:border-white/10 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 cursor-pointer"
                >
                  <option value="">✨ Auto-Detect Best European Portuguese (pt-PT)</option>
                  {availableVoices
                    .filter(v => v.lang.toLowerCase().startsWith('pt') || v.lang.toLowerCase().includes('pt'))
                    .map((v) => (
                      <option key={v.voiceURI} value={v.voiceURI}>
                        {v.name} ({v.lang})
                      </option>
                    ))}
                  <option disabled>────────── Other Voices ──────────</option>
                  {availableVoices
                    .filter(v => !v.lang.toLowerCase().startsWith('pt'))
                    .map((v) => (
                      <option key={v.voiceURI} value={v.voiceURI}>
                        {v.name} ({v.lang})
                      </option>
                    ))}
                </select>
              </div>
            )}
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 border-t border-black/[0.06] dark:border-white/[0.08] bg-slate-50 dark:bg-[#1c1c1e] flex items-center justify-between gap-3 shrink-0">
          <button
            onClick={() => handleTestVoice("O Sujan ama a Amisha com todo o coração!")}
            className="flex items-center gap-1.5 text-xs font-bold text-slate-600 dark:text-zinc-300 hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Love Phrase Sample</span>
          </button>

          <button
            onClick={() => {
              playTone(600, 'sine', 0.04);
              triggerHaptic('success');
              onClose();
            }}
            className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-md active:scale-95 cursor-pointer"
          >
            Save & Done
          </button>
        </div>

      </div>
    </div>
  );
};
