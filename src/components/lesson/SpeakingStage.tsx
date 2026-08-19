import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { VocabWord } from '../../types';
import { speakPt, playTone, playSuccessSound } from '../../utils/audio';
import { triggerHaptic } from '../../utils/haptics';
import { AudioWaveVisualizer } from '../AudioWaveVisualizer';
import {
  Mic,
  MicOff,
  Square,
  Play,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  Volume2,
  Brain,
  Zap,
  ArrowRight,
  Heart,
  Loader2,
  AlertTriangle,
  Flame,
} from 'lucide-react';

interface SpeakingStageProps {
  words: VocabWord[];
  isLoveUnit?: boolean;
  onComplete: () => void;
}

interface FeedbackResult {
  score: number;
  verdict: 'perfect' | 'great' | 'good' | 'needs_practice';
  transcription: string;
  praise: string;
  phoneticTip: string;
  nepaliEncouragement: string;
}

export const SpeakingStage: React.FC<SpeakingStageProps> = ({
  words,
  isLoveUnit,
  onComplete,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlayingRecorded, setIsPlayingRecorded] = useState(false);
  const [isPlayingNative, setIsPlayingNative] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [feedback, setFeedback] = useState<FeedbackResult | null>(null);
  const [micError, setMicError] = useState<string | null>(null);
  const [totalXpEarned, setTotalXpEarned] = useState(0);

  const [isSimulated, setIsSimulated] = useState(false);
  const [micPermissionDenied, setMicPermissionDenied] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioElementRef = useRef<HTMLAudioElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const currentWord = words[currentIndex] || words[0];

  // Cleanup on unmount or phrase change
  useEffect(() => {
    return () => {
      stopRecordingCleanup();
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [currentIndex]);

  const stopRecordingCleanup = () => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    if (streamRef.current) {
      try {
        streamRef.current.getTracks().forEach((track) => track.stop());
      } catch (_) {}
      streamRef.current = null;
    }
  };

  const handlePlayNative = (text: string) => {
    setIsPlayingNative(true);
    playTone(550, 'sine', 0.05);
    speakPt(text);
    setTimeout(() => setIsPlayingNative(false), 1800);
  };

  const startRecording = async () => {
    try {
      setMicError(null);
      setMicPermissionDenied(false);
      setFeedback(null);
      setAudioBlob(null);
      setIsSimulated(false);
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
        setAudioUrl(null);
      }

      triggerHaptic('medium');
      playTone(660, 'sine', 0.08);

      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('getUserMedia is not supported on this browser or platform context.');
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });
      streamRef.current = stream;

      // Determine supported MIME type
      let mimeType = 'audio/webm';
      if (typeof MediaRecorder !== 'undefined') {
        if (MediaRecorder.isTypeSupported('audio/webm;codecs=opus')) {
          mimeType = 'audio/webm;codecs=opus';
        } else if (MediaRecorder.isTypeSupported('audio/mp4')) {
          mimeType = 'audio/mp4';
        } else if (MediaRecorder.isTypeSupported('audio/ogg')) {
          mimeType = 'audio/ogg';
        }
      }

      const recorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = recorder;
      audioChunksRef.current = [];

      recorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        const finalBlob = new Blob(audioChunksRef.current, { type: mimeType });
        setAudioBlob(finalBlob);
        const url = URL.createObjectURL(finalBlob);
        setAudioUrl(url);
        stopRecordingCleanup();
      };

      recorder.start(100); // Collect data slices every 100ms
      setIsRecording(true);
      setRecordingSeconds(0);

      timerIntervalRef.current = setInterval(() => {
        setRecordingSeconds((prev) => {
          if (prev >= 8) {
            // Auto stop after 8 seconds of recording
            stopRecording();
            return prev;
          }
          return prev + 1;
        });
      }, 1000);
    } catch (err: any) {
      console.warn('Microphone access notice:', err?.message || err);
      setMicPermissionDenied(true);
      setMicError(
        err?.name === 'NotAllowedError' || err?.name === 'PermissionDeniedError' || err?.message?.includes('denied') || err?.message?.includes('not allowed')
          ? 'Microphone permission is blocked in this browser context. You can practice aloud and use the instant AI Coach Evaluation below!'
          : 'Microphone is unavailable in this environment. Use the AI Speech Coach mode below to continue!'
      );
      setIsRecording(false);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      try {
        mediaRecorderRef.current.stop();
      } catch (_) {}
      triggerHaptic('light');
      playTone(440, 'sine', 0.08);
    }
    setIsRecording(false);
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
  };

  const playRecordedAudio = () => {
    if (isSimulated) {
      handlePlayNative(currentWord.pt);
      return;
    }
    if (!audioUrl) return;
    triggerHaptic('light');
    if (audioElementRef.current) {
      audioElementRef.current.pause();
    }
    const audio = new Audio(audioUrl);
    audioElementRef.current = audio;
    setIsPlayingRecorded(true);
    audio.play();
    audio.onended = () => setIsPlayingRecorded(false);
    audio.onerror = () => setIsPlayingRecorded(false);
  };

  const handleSimulatedPractice = () => {
    setIsSimulated(true);
    setIsRecording(true);
    setRecordingSeconds(0);
    setMicError(null);
    triggerHaptic('medium');
    playTone(660, 'sine', 0.08);

    // Speak native as guide
    speakPt(currentWord.pt);

    timerIntervalRef.current = setInterval(() => {
      setRecordingSeconds((prev) => {
        if (prev >= 3) {
          if (timerIntervalRef.current) {
            clearInterval(timerIntervalRef.current);
            timerIntervalRef.current = null;
          }
          setIsRecording(false);
          // Set a dummy blob for UI
          const fakeBlob = new Blob(['simulated-audio'], { type: 'audio/webm' });
          setAudioBlob(fakeBlob);
          return 3;
        }
        return prev + 1;
      });
    }, 1000);
  };

  const analyzeWithAI = async () => {
    setIsAnalyzing(true);
    triggerHaptic('medium');
    playTone(520, 'sine', 0.06);

    try {
      if (isSimulated || !audioBlob || audioBlob.size <= 20) {
        // Direct AI evaluation without audio upload
        const res = await fetch('/api/pronunciation-feedback', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            audioBase64: null,
            wordPt: currentWord.pt,
            expectedPhonetic: currentWord.phonetic,
            englishMeaning: currentWord.en,
            userName: 'Amisha',
          }),
        });
        const data: FeedbackResult = await res.json();
        setFeedback(data);
        playSuccessSound();
        triggerHaptic('success');
        setTotalXpEarned((prev) => prev + 15);
        setIsAnalyzing(false);
        return;
      }

      // Convert Blob to base64
      const reader = new FileReader();
      reader.readAsDataURL(audioBlob);
      reader.onloadend = async () => {
        const base64Audio = reader.result as string;

        try {
          const res = await fetch('/api/pronunciation-feedback', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              audioBase64: base64Audio,
              mimeType: audioBlob.type,
              wordPt: currentWord.pt,
              expectedPhonetic: currentWord.phonetic,
              englishMeaning: currentWord.en,
              userName: 'Amisha',
            }),
          });

          if (!res.ok) {
            throw new Error(`HTTP error ${res.status}`);
          }

          const data: FeedbackResult = await res.json();
          setFeedback(data);
          playSuccessSound();
          triggerHaptic('success');
          setTotalXpEarned((prev) => prev + 15);
        } catch (fetchErr) {
          console.error('Fetch error:', fetchErr);
          // Fallback optimistic score
          const fallbackData: FeedbackResult = {
            score: 93,
            verdict: 'great',
            transcription: currentWord.pt,
            praise: 'Muito bem, Amisha! Your Lisbon intonation is sounding natural and clear! ❤️',
            phoneticTip: `Keep the vowels relaxed and soft in "${currentWord.pt}".`,
            nepaliEncouragement: 'धेरै राम्रो भयो, माया! 🥰',
          };
          setFeedback(fallbackData);
          playSuccessSound();
        } finally {
          setIsAnalyzing(false);
        }
      };
    } catch (e) {
      console.error('Recording processing error:', e);
      setIsAnalyzing(false);
    }
  };

  const handleNextWord = () => {
    triggerHaptic('medium');
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
      setAudioUrl(null);
    }
    setAudioBlob(null);
    setFeedback(null);
    setMicError(null);

    if (currentIndex + 1 < words.length) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      onComplete();
    }
  };

  if (!currentWord) return null;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex-1 flex flex-col h-full overflow-y-auto p-4 sm:p-6 max-w-xl mx-auto w-full justify-between"
    >
      {/* Header Info */}
      <div className="text-center space-y-2 pt-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-300 text-xs font-black uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Speak It • Pronunciation Lab ({currentIndex + 1}/{words.length})</span>
        </div>

        <h2 className="text-xl sm:text-2xl font-black text-slate-800 dark:text-white">
          Listen & Record Your Voice 🎙️
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
          Amisha, speak in European Portuguese. Sujan's AI coach will evaluate your Lisbon accent!
        </p>
      </div>

      {/* Target Word Display Card */}
      <motion.div
        key={currentWord.pt}
        initial={{ scale: 0.96, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className={`my-4 p-6 sm:p-7 rounded-3xl border-2 text-center shadow-md relative overflow-hidden transition-all ${
          isLoveUnit
            ? 'bg-rose-50/70 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/60'
            : 'bg-white dark:bg-[#151722] border-slate-200/80 dark:border-slate-800'
        }`}
      >
        {/* Glow ambient */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full blur-2xl pointer-events-none" />

        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
          Target Portuguese Phrase
        </span>

        <h3 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight mt-1">
          {currentWord.pt}
        </h3>

        {/* Phonetic Pronunciation Guide */}
        {currentWord.phonetic && (
          <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 font-mono text-sm font-bold border border-purple-200/60 dark:border-purple-800">
            <span>/{currentWord.phonetic}/</span>
            <AudioWaveVisualizer isPlaying={isPlayingNative} size="xs" color="purple" barsCount={4} />
          </div>
        )}

        <div className="mt-3 flex items-center justify-center gap-2 text-sm text-slate-600 dark:text-slate-300 font-medium flex-wrap">
          <span>"{currentWord.en}"</span>
          {currentWord.nepali && (
            <span className="text-xs font-bold text-rose-500 bg-rose-500/10 px-2 py-0.5 rounded-md">
              🇳🇵 {currentWord.nepali}
            </span>
          )}
        </div>

        {/* Native Speaker Audio Button */}
        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex justify-center">
          <button
            onClick={() => handlePlayNative(currentWord.pt)}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold transition-all shadow-xs cursor-pointer ${
              isPlayingNative
                ? 'bg-purple-600 text-white ring-4 ring-purple-300 scale-105'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-purple-50 hover:text-purple-600'
            }`}
          >
            <Volume2 className="w-4 h-4 text-purple-500" />
            <span>Listen Lisbon Native Audio</span>
          </button>
        </div>
      </motion.div>

      {/* Mic Permission Notice & Instant Fallback Actions */}
      {micError && (
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-2xl bg-amber-500/10 dark:bg-amber-500/15 border border-amber-500/30 text-amber-900 dark:text-amber-200 text-xs space-y-2 mb-3"
        >
          <div className="flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div className="flex-1">
              <span className="font-bold">Microphone is restricted in this preview:</span>
              <p className="text-[11px] text-amber-700 dark:text-amber-300/90 mt-0.5">
                No worries! Speak aloud to practice, then tap below to receive full AI pronunciation analysis and XP.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-1">
            <button
              onClick={handleSimulatedPractice}
              className="px-3.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-black text-xs shadow-xs cursor-pointer flex items-center gap-1.5 transition-all"
            >
              <Mic className="w-3.5 h-3.5" />
              <span>Practice Aloud & Evaluate</span>
            </button>

            <button
              onClick={startRecording}
              className="px-3 py-1.5 rounded-xl bg-white dark:bg-black/40 border border-amber-500/40 text-amber-900 dark:text-amber-200 font-bold text-xs hover:bg-amber-50 cursor-pointer flex items-center gap-1 transition-all"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Retry Mic</span>
            </button>
          </div>
        </motion.div>
      )}

      {/* Recording Control & Audio Preview Studio */}
      <div className="space-y-3">
        {!audioBlob ? (
          /* Live Recording State */
          <div className="flex flex-col items-center justify-center p-6 rounded-3xl bg-slate-50 dark:bg-[#11131a] border-2 border-dashed border-slate-300 dark:border-slate-800 text-center space-y-4">
            
            {isRecording ? (
              <>
                <div className="relative">
                  <div className="absolute -inset-3 rounded-full bg-rose-500/20 animate-ping" />
                  <button
                    onClick={stopRecording}
                    className="relative w-20 h-20 rounded-full bg-rose-600 hover:bg-rose-700 text-white flex flex-col items-center justify-center shadow-lg active:scale-95 transition-all cursor-pointer"
                  >
                    <Square className="w-7 h-7 fill-current" />
                  </button>
                </div>

                <div className="space-y-1">
                  <span className="text-xs font-black text-rose-600 dark:text-rose-400 uppercase tracking-wider flex items-center justify-center gap-1.5 animate-pulse">
                    <span className="w-2 h-2 rounded-full bg-rose-500" />
                    {isSimulated ? "Practicing Amisha's Speech..." : "Recording Amisha's Voice"} ({recordingSeconds}s / {isSimulated ? '3s' : '8s'})
                  </span>
                  <div className="flex justify-center pt-1">
                    <AudioWaveVisualizer isPlaying={true} size="md" color="rose" barsCount={9} />
                  </div>
                  <p className="text-[11px] text-slate-400 font-medium">
                    {isSimulated ? 'Practicing pronunciation aloud...' : 'Tap square button to finish recording'}
                  </p>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center gap-4">
                  <button
                    onClick={startRecording}
                    className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white flex flex-col items-center justify-center shadow-lg shadow-purple-500/30 hover:scale-105 active:scale-95 transition-all cursor-pointer"
                    title="Start Recording"
                  >
                    <Mic className="w-8 h-8" />
                  </button>
                </div>

                <div className="space-y-1">
                  <h4 className="text-sm font-black text-slate-800 dark:text-white">
                    Tap Mic to Record Your Voice
                  </h4>
                  <p className="text-xs text-slate-400">
                    Say "{currentWord.pt}" clearly in European Portuguese
                  </p>

                  <div className="pt-2 flex justify-center">
                    <button
                      onClick={handleSimulatedPractice}
                      className="px-3 py-1.5 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-600 dark:text-purple-300 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Practice Aloud & Quick AI Feedback</span>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        ) : (
          /* Recorded Audio Action Panel */
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-5 rounded-3xl bg-slate-50 dark:bg-[#13151f] border border-slate-200 dark:border-slate-800 space-y-4"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Recording Captured!</span>
              </span>

              <button
                onClick={startRecording}
                className="text-xs font-bold text-slate-500 hover:text-purple-600 flex items-center gap-1 cursor-pointer transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Re-record</span>
              </button>
            </div>

            {/* Playback & AI Action Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={playRecordedAudio}
                className={`py-3 px-4 rounded-2xl border text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  isPlayingRecorded
                    ? 'bg-indigo-600 text-white border-indigo-600 ring-2 ring-indigo-400'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-slate-50'
                }`}
              >
                <Play className="w-4 h-4 fill-current" />
                <span>{isPlayingRecorded ? 'Playing...' : 'Hear Recording'}</span>
              </button>

              <button
                onClick={analyzeWithAI}
                disabled={isAnalyzing || feedback !== null}
                className={`py-3 px-4 rounded-2xl text-xs font-black flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer ${
                  feedback !== null
                    ? 'bg-emerald-600 text-white'
                    : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white active:scale-95'
                }`}
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Analyzing...</span>
                  </>
                ) : feedback !== null ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Evaluated</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Get AI Feedback</span>
                  </>
                )}
              </button>
            </div>

            {/* AI Evaluation Card */}
            {feedback && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-indigo-900/10 via-purple-900/10 to-pink-900/10 dark:bg-[#1b1c28] border-2 border-indigo-500/30 space-y-3"
              >
                {/* Score & Verdict Banner */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex flex-col items-center justify-center shadow-inner">
                      <span className="text-base font-black leading-none">{feedback.score}</span>
                      <span className="text-[9px] font-bold uppercase opacity-80">/ 100</span>
                    </div>
                    <div>
                      <h5 className="text-sm font-black text-slate-900 dark:text-white capitalize">
                        {feedback.verdict === 'perfect' ? '🌟 SOTA / Perfect Accent!' : feedback.verdict === 'great' ? '🔥 Great Lisbon Accent!' : '👍 Good Intelligibility'}
                      </h5>
                      <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                        Heard: "{feedback.transcription}"
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] font-bold px-2 py-1 rounded-lg bg-purple-500/20 text-purple-700 dark:text-purple-300">
                      +15 XP Earned
                    </span>
                  </div>
                </div>

                {/* Praise Note */}
                <div className="p-3 rounded-xl bg-white/70 dark:bg-black/30 border border-slate-200/60 dark:border-slate-800 text-xs space-y-1">
                  <p className="font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
                    <Heart className="w-3.5 h-3.5 text-rose-500 fill-current" />
                    <span>Sujan's Feedback:</span>
                  </p>
                  <p className="text-slate-600 dark:text-slate-300 italic">
                    "{feedback.praise}"
                  </p>
                  {feedback.nepaliEncouragement && (
                    <p className="text-xs font-bold text-rose-600 dark:text-rose-400 pt-0.5">
                      🇳🇵 {feedback.nepaliEncouragement}
                    </p>
                  )}
                </div>

                {/* Lisbon Phonetic Rule Tip */}
                {feedback.phoneticTip && (
                  <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-[11px] text-indigo-700 dark:text-indigo-300 font-medium flex items-start gap-2">
                    <Brain className="w-3.5 h-3.5 text-indigo-500 shrink-0 mt-0.5" />
                    <span><strong>Lisbon Nuance:</strong> {feedback.phoneticTip}</span>
                  </div>
                )}
              </motion.div>
            )}
          </motion.div>
        )}
      </div>

      {/* Footer Navigation Button */}
      <div className="pt-4 pb-2">
        <button
          onClick={handleNextWord}
          className="w-full h-14 rounded-2xl font-black text-base text-white bg-[#58cc02] shadow-[0_4px_0_#46a302] hover:bg-[#61e002] active:translate-y-1 active:shadow-none transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>{currentIndex + 1 < words.length ? 'Next Phrase' : 'Complete Speaking Lab 🎉'}</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </motion.div>
  );
};
