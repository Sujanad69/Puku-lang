import React, { useState } from 'react';
import { SURVIVAL_SCENARIOS, SurvivalScenario } from '../data/survivalScenariosData';
import { speakPt, playTone, playSuccessSound, playErrorSound } from '../utils/audio';
import { triggerHaptic } from '../utils/haptics';
import {
  X,
  Volume2,
  Sparkles,
  Compass,
  Plane,
  Coffee,
  ShoppingBag,
  Train,
  HeartPulse,
  MapPin,
  ChevronRight,
  Lightbulb,
  CheckCircle2,
  XCircle,
  RotateCcw,
  BookOpen,
  Play
} from 'lucide-react';

interface SurvivalSimulatorModalProps {
  onClose: () => void;
  onCompleteScenario: (scenarioId: string, xpEarned: number, coinsEarned: number) => void;
  onOpenLoveUnit?: () => void;
}

export const SurvivalSimulatorModal: React.FC<SurvivalSimulatorModalProps> = ({
  onClose,
  onCompleteScenario,
}) => {
  const [selectedScenario, setSelectedScenario] = useState<SurvivalScenario | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number | null>(null);
  const [isAnswerChecked, setIsAnswerChecked] = useState<boolean>(false);
  const [slowAudio, setSlowAudio] = useState<boolean>(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'simulator' | 'cheatsheet'>('simulator');
  const [completedScenarios, setCompletedScenarios] = useState<string[]>([]);
  const [showCelebration, setShowCelebration] = useState<boolean>(false);

  const getScenarioIcon = (id: string) => {
    switch (id) {
      case 'airport':
        return <Plane className="w-5 h-5" />;
      case 'cafe':
        return <Coffee className="w-5 h-5" />;
      case 'supermarket':
        return <ShoppingBag className="w-5 h-5" />;
      case 'metro':
        return <Train className="w-5 h-5" />;
      case 'pharmacy':
        return <HeartPulse className="w-5 h-5" />;
      default:
        return <Compass className="w-5 h-5" />;
    }
  };

  const handleSelectScenario = (scenario: SurvivalScenario) => {
    playTone(550, 'sine', 0.05);
    triggerHaptic('light');
    setSelectedScenario(scenario);
    setCurrentStepIndex(0);
    setSelectedOptionIndex(null);
    setIsAnswerChecked(false);
    setActiveTab('simulator');
    setShowCelebration(false);

    const firstStep = scenario.dialogue[0];
    if (firstStep) {
      setIsPlayingAudio(true);
      setTimeout(() => {
        speakPt(firstStep.pt, slowAudio);
        setTimeout(() => setIsPlayingAudio(false), 2000);
      }, 300);
    }
  };

  const handleSpeak = (text: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    playTone(520, 'sine', 0.05);
    triggerHaptic('light');
    setIsPlayingAudio(true);
    speakPt(text, slowAudio);
    setTimeout(() => setIsPlayingAudio(false), 2000);
  };

  const currentStep = selectedScenario ? selectedScenario.dialogue[currentStepIndex] : null;
  const isLastStep = selectedScenario ? currentStepIndex === selectedScenario.dialogue.length - 1 : false;

  const handleOptionSelect = (index: number) => {
    if (isAnswerChecked) return;
    playTone(600, 'sine', 0.04);
    triggerHaptic('light');
    setSelectedOptionIndex(index);
  };

  const handleCheckAnswer = () => {
    if (selectedOptionIndex === null || !currentStep?.options) return;
    const option = currentStep.options[selectedOptionIndex];
    setIsAnswerChecked(true);

    if (option.isCorrect) {
      playSuccessSound();
      triggerHaptic('success');
    } else {
      playErrorSound();
      triggerHaptic('error');
    }
  };

  const handleNextStep = () => {
    if (!selectedScenario) return;

    if (isLastStep) {
      playSuccessSound();
      triggerHaptic('success');
      setShowCelebration(true);
      if (!completedScenarios.includes(selectedScenario.id)) {
        setCompletedScenarios(prev => [...prev, selectedScenario.id]);
      }
      onCompleteScenario(selectedScenario.id, 30, 8);
    } else {
      playTone(580, 'sine', 0.05);
      triggerHaptic('light');
      const nextIndex = currentStepIndex + 1;
      setCurrentStepIndex(nextIndex);
      setSelectedOptionIndex(null);
      setIsAnswerChecked(false);

      const nextStep = selectedScenario.dialogue[nextIndex];
      if (nextStep) {
        setIsPlayingAudio(true);
        setTimeout(() => {
          speakPt(nextStep.pt, slowAudio);
          setTimeout(() => setIsPlayingAudio(false), 2000);
        }, 200);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-xl ios-fade-in">
      
      <div className="relative w-full max-w-2xl overflow-hidden rounded-[36px] bg-white dark:bg-[#12141a] border border-slate-200/60 dark:border-slate-800/80 shadow-2xl flex flex-col max-h-[92vh] ios-modal-scale-in">
        
        {/* ================= HEADER BANNER ================= */}
        <div className="relative bg-gradient-to-br from-[#c2410c] via-[#ea580c] to-[#f97316] p-6 text-white text-center overflow-hidden shrink-0">
          
          {/* Subtle Ambient Glows */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden select-none opacity-20">
            <div className="absolute -top-12 -right-12 w-48 h-48 bg-amber-200 rounded-full blur-2xl"></div>
            <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-orange-300 rounded-full blur-2xl"></div>
          </div>

          {/* Top Actions Bar (No overlap on mobile) */}
          <div className="relative z-10 flex items-center justify-between gap-2 mb-3">
            {/* Speed Toggle */}
            <div className="flex-1 flex justify-start">
              <button
                onClick={() => {
                  triggerHaptic('light');
                  setSlowAudio(!slowAudio);
                }}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all backdrop-blur-md border cursor-pointer ${
                  slowAudio
                    ? 'bg-amber-300 text-amber-950 border-amber-200 shadow-xs'
                    : 'bg-black/20 text-white/90 border-white/15 hover:bg-black/30'
                }`}
                title="Toggle audio speed"
              >
                <span>🐢</span>
                <span>{slowAudio ? '0.75x' : '1.0x'}</span>
              </button>
            </div>

            {/* Pill Badge */}
            <div className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider backdrop-blur-md border border-white/20 shadow-xs max-w-[180px] sm:max-w-none truncate">
              <Compass className="w-3.5 h-3.5 text-amber-200 shrink-0" />
              <span className="truncate">Lisbon Survival Simulator</span>
            </div>

            {/* Close / Back Button */}
            <div className="flex-1 flex justify-end">
              <button
                onClick={selectedScenario ? () => setSelectedScenario(null) : onClose}
                className="h-8 w-8 rounded-full bg-black/20 hover:bg-black/30 flex items-center justify-center text-white transition-colors cursor-pointer backdrop-blur-md shrink-0"
                title={selectedScenario ? "Back to Missions" : "Close"}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white leading-tight">
            {selectedScenario ? selectedScenario.title : 'Survival in Portugal 🇵🇹'}
          </h2>

          <p className="text-xs sm:text-sm text-orange-100 font-medium mt-1 max-w-md mx-auto leading-relaxed">
            {selectedScenario
              ? selectedScenario.location
              : 'Interactive dialogues, taxi rides, pastelaria orders, and emergency phrases.'}
          </p>

          {/* Tabs when a scenario is open */}
          {selectedScenario && !showCelebration && (
            <div className="flex items-center justify-center gap-1.5 mt-4 p-1 rounded-2xl bg-black/20 backdrop-blur-md max-w-xs mx-auto">
              <button
                onClick={() => {
                  playTone(600, 'sine', 0.03);
                  setActiveTab('simulator');
                }}
                className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  activeTab === 'simulator'
                    ? 'bg-white text-orange-600 shadow-md scale-[1.02]'
                    : 'text-white/80 hover:text-white'
                }`}
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Dialogue</span>
              </button>

              <button
                onClick={() => {
                  playTone(600, 'sine', 0.03);
                  setActiveTab('cheatsheet');
                }}
                className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  activeTab === 'cheatsheet'
                    ? 'bg-white text-orange-600 shadow-md scale-[1.02]'
                    : 'text-white/80 hover:text-white'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Cheat Sheet</span>
              </button>
            </div>
          )}

        </div>

        {/* ================= BODY CONTENT ================= */}
        {!selectedScenario ? (
          /* LIST OF ALL MISSIONS */
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3">
            
            <div className="flex items-center justify-between px-1 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider text-orange-600 dark:text-orange-400">
                Available Missions ({completedScenarios.length}/{SURVIVAL_SCENARIOS.length})
              </span>
              <span className="text-xs font-bold text-slate-400">
                +30 XP Each
              </span>
            </div>

            {SURVIVAL_SCENARIOS.map(sc => {
              const isDone = completedScenarios.includes(sc.id);

              return (
                <div
                  key={sc.id}
                  onClick={() => handleSelectScenario(sc)}
                  className="group rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-slate-50 dark:bg-[#181a22] p-4.5 space-y-3 transition-all hover:border-orange-400 hover:bg-orange-50/40 dark:hover:bg-orange-950/20 active:scale-[0.99] cursor-pointer shadow-xs"
                >
                  <div className="flex items-start gap-3.5">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-orange-100 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400 group-hover:bg-orange-500 group-hover:text-white transition-colors">
                      {getScenarioIcon(sc.id)}
                    </div>

                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center justify-between gap-2">
                        <h4 className="text-base font-black text-slate-900 dark:text-white tracking-tight group-hover:text-orange-600 transition-colors truncate">
                          {sc.title}
                        </h4>

                        {isDone ? (
                          <span className="flex items-center gap-1 rounded-full bg-emerald-100 dark:bg-emerald-950/50 px-2.5 py-0.5 text-[11px] font-bold text-emerald-700 dark:text-emerald-400 shrink-0">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Done
                          </span>
                        ) : (
                          <span className="rounded-full bg-slate-200/70 dark:bg-slate-800 px-2.5 py-0.5 text-[11px] font-bold text-slate-600 dark:text-slate-400 shrink-0">
                            {sc.difficulty}
                          </span>
                        )}
                      </div>

                      <p className="text-xs font-bold text-amber-600 dark:text-amber-400 truncate">
                        🇳🇵 {sc.titleNepali}
                      </p>

                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                        {sc.description}
                      </p>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1 font-medium truncate">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span className="truncate">{sc.location}</span>
                    </span>
                    <span className="font-bold text-orange-600 dark:text-orange-400 flex items-center gap-1 shrink-0">
                      Start Mission <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              );
            })}

          </div>
        ) : showCelebration ? (
          /* CELEBRATION */
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-4 overflow-y-auto">
            <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 flex items-center justify-center text-emerald-600 shadow-sm animate-bounce">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-1 max-w-sm">
              <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                Parabéns, Amisha! 🎉
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
                You successfully mastered the <span className="font-bold text-slate-900 dark:text-white">{selectedScenario.title}</span> mission!
              </p>

              <div className="pt-3 flex justify-center gap-2 text-xs font-bold">
                <span className="rounded-xl bg-orange-100 dark:bg-orange-950/50 border border-orange-200 dark:border-orange-800 px-3.5 py-1.5 text-orange-700 dark:text-orange-300">
                  +30 XP ⭐
                </span>
                <span className="rounded-xl bg-amber-100 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 px-3.5 py-1.5 text-amber-700 dark:text-amber-300">
                  +8 Coins 🪙
                </span>
              </div>
            </div>

            <div className="w-full max-w-xs space-y-2 pt-2">
              <button
                onClick={() => {
                  triggerHaptic('light');
                  setSelectedScenario(null);
                }}
                className="w-full rounded-2xl bg-orange-600 hover:bg-orange-700 py-3.5 font-bold text-xs text-white shadow-md active:scale-98 transition-all cursor-pointer"
              >
                Choose Next Mission
              </button>

              <button
                onClick={() => {
                  triggerHaptic('light');
                  setShowCelebration(false);
                  setCurrentStepIndex(0);
                  setSelectedOptionIndex(null);
                  setIsAnswerChecked(false);
                }}
                className="w-full rounded-2xl bg-slate-100 dark:bg-slate-800 py-3 font-bold text-xs text-slate-600 dark:text-slate-300 hover:bg-slate-200 cursor-pointer"
              >
                Practice Again
              </button>
            </div>
          </div>
        ) : activeTab === 'cheatsheet' ? (
          /* CHEAT SHEET */
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3">
            
            <div className="rounded-2xl bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-900/40 p-4 space-y-1">
              <h4 className="text-xs font-bold text-orange-900 dark:text-orange-200 flex items-center gap-1.5">
                <Lightbulb className="w-4 h-4 text-orange-500" />
                <span>{selectedScenario.title} — Key Essential Phrases</span>
              </h4>
              <p className="text-xs text-orange-700/80 dark:text-orange-300/80">
                Tap any phrase below to hear European Portuguese pronunciation:
              </p>
            </div>

            {selectedScenario.cheatSheet.map((item, idx) => (
              <div
                key={idx}
                onClick={() => handleSpeak(item.pt)}
                className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-slate-50 dark:bg-[#181a22] p-4 transition-all hover:border-orange-400 active:scale-[0.99] cursor-pointer space-y-2 shadow-xs"
              >
                <div className="flex items-start justify-between gap-3">
                  <p className="text-base font-black text-slate-900 dark:text-white tracking-tight">
                    {item.pt}
                  </p>
                  <button className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-900/50 text-orange-600 dark:text-orange-400">
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-1 text-xs pt-1 border-t border-slate-200/60 dark:border-slate-800">
                  <div className="inline-block rounded-md bg-indigo-100 dark:bg-indigo-950/50 px-2 py-0.5 text-xs font-bold text-indigo-700 dark:text-indigo-300">
                    🇳🇵 {item.nepaliPhonetic}
                  </div>
                  <p className="font-bold text-amber-600 dark:text-amber-400">
                    {item.nepali}
                  </p>
                  <p className="text-slate-500 dark:text-slate-400 font-medium">
                    "{item.en}"
                  </p>
                </div>
              </div>
            ))}

          </div>
        ) : (
          /* ACTIVE DIALOGUE SIMULATOR */
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 flex flex-col justify-between space-y-4">
            
            {/* Step Progress Bar */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-bold text-slate-400">
                <span>Step {currentStepIndex + 1} of {selectedScenario.dialogue.length}</span>
                <span className="text-orange-600 dark:text-orange-400">{selectedScenario.title}</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-orange-500 h-full rounded-full transition-all duration-300 shadow-xs"
                  style={{
                    width: `${((currentStepIndex + 1) / selectedScenario.dialogue.length) * 100}%`
                  }}
                />
              </div>
            </div>

            {currentStep && (
              <div className="space-y-4 my-auto">
                
                {/* Speaker Dialogue Card */}
                <div className="rounded-3xl border border-orange-100 dark:border-orange-950 bg-slate-50 dark:bg-[#181a22] p-5 sm:p-6 space-y-3 shadow-sm">
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-9 h-9 rounded-2xl flex items-center justify-center text-xs font-bold ${
                        currentStep.speaker === 'sujan'
                          ? 'bg-rose-100 dark:bg-rose-950/60 text-rose-600'
                          : currentStep.speaker === 'amisha'
                          ? 'bg-purple-100 dark:bg-purple-950/60 text-purple-600'
                          : 'bg-orange-100 dark:bg-orange-950/60 text-orange-600'
                      }`}>
                        {currentStep.speaker === 'sujan' ? 'Sujan' : currentStep.speaker === 'amisha' ? 'Amisha' : 'Local'}
                      </div>
                      <div>
                        <h4 className="text-sm font-black text-slate-900 dark:text-white">
                          {currentStep.speakerName}
                        </h4>
                        <p className="text-[10px] font-semibold text-slate-400">
                          {currentStep.speakerRole}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={(e) => handleSpeak(currentStep.pt, e)}
                      className={`h-9 w-9 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                        isPlayingAudio
                          ? 'bg-orange-500 text-white ring-4 ring-orange-200'
                          : 'bg-orange-100 dark:bg-orange-900/50 text-orange-600 dark:text-orange-300'
                      }`}
                      title="Listen in Portuguese"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="space-y-1">
                    <p className="text-lg sm:text-xl font-black text-slate-900 dark:text-white leading-snug">
                      "{currentStep.pt}"
                    </p>
                    <p className="text-xs font-semibold text-amber-600 dark:text-amber-400">
                      🇳🇵 {currentStep.nepali}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      "{currentStep.en}"
                    </p>
                  </div>

                  {currentStep.tip && (
                    <div className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 p-3 text-xs text-slate-500 dark:text-slate-400">
                      💡 {currentStep.tip}
                    </div>
                  )}

                </div>

                {/* Response Options */}
                {currentStep.options && currentStep.options.length > 0 && (
                  <div className="space-y-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 px-1">
                      Choose Amisha's Best Response:
                    </span>

                    <div className="space-y-2">
                      {currentStep.options.map((opt, idx) => {
                        const isSelected = selectedOptionIndex === idx;
                        let optionStyle = 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 hover:border-orange-300';

                        if (isSelected && !isAnswerChecked) {
                          optionStyle = 'bg-orange-50 dark:bg-orange-950/40 border-orange-500 ring-2 ring-orange-500/20';
                        } else if (isAnswerChecked) {
                          if (opt.isCorrect) {
                            optionStyle = 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-900 dark:text-emerald-100';
                          } else if (isSelected && !opt.isCorrect) {
                            optionStyle = 'bg-rose-50 dark:bg-rose-950/40 border-rose-500 text-rose-900 dark:text-rose-100';
                          }
                        }

                        return (
                          <div
                            key={idx}
                            onClick={() => handleOptionSelect(idx)}
                            className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-1 shadow-xs ${optionStyle}`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-black text-slate-900 dark:text-white">
                                {opt.pt}
                              </span>
                              {isAnswerChecked && opt.isCorrect && (
                                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                              )}
                              {isAnswerChecked && isSelected && !opt.isCorrect && (
                                <XCircle className="w-4 h-4 text-rose-500" />
                              )}
                            </div>

                            <p className="text-xs font-semibold text-amber-600 dark:text-amber-400">
                              🇳🇵 {opt.nepali}
                            </p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                              "{opt.en}"
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

              </div>
            )}

            {/* Step Action Button */}
            <div className="pt-2">
              {!isAnswerChecked ? (
                <button
                  onClick={handleCheckAnswer}
                  disabled={selectedOptionIndex === null}
                  className={`w-full py-3.5 rounded-2xl font-bold text-xs text-white transition-all shadow-md cursor-pointer ${
                    selectedOptionIndex === null
                      ? 'bg-slate-300 dark:bg-slate-800 text-slate-500 cursor-not-allowed'
                      : 'bg-orange-600 hover:bg-orange-700 active:scale-98'
                  }`}
                >
                  Check Answer
                </button>
              ) : (
                <button
                  onClick={handleNextStep}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 font-bold text-xs text-white transition-all shadow-md active:scale-98 cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>{isLastStep ? 'Complete Mission' : 'Continue Next Step'}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>

          </div>
        )}

        {/* ================= FOOTER ================= */}
        <div className="p-4 sm:p-5 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-[#0e1015] shrink-0 flex items-center justify-between gap-3">
          <span className="text-xs text-orange-600 dark:text-orange-400 font-bold flex items-center gap-1.5">
            <Compass className="w-4 h-4" />
            <span>Lisbon Survival Simulator</span>
          </span>

          <button
            onClick={onClose}
            className="py-2.5 px-5 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs transition-all cursor-pointer"
          >
            Exit
          </button>
        </div>

      </div>

    </div>
  );
};
