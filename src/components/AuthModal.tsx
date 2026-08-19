import React, { useState } from 'react';
import { playSuccessSound, playTone } from '../utils/audio';
import { triggerHaptic } from '../utils/haptics';
import { 
  Mail, 
  Lock, 
  User as UserIcon, 
  Eye, 
  EyeOff, 
  X, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight,
  ShieldCheck,
  Heart
} from 'lucide-react';
import { 
  FlagPortugal, 
  PukuMonkeyIcon, 
  CrownPrincessIcon, 
  CherryFlowerIcon, 
  CoffeeCupIcon 
} from './icons/PremiumIcons';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  loginWithGoogle: () => Promise<{ success: boolean; error?: string }>;
  loginWithEmail: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  signupWithEmail: (email: string, pass: string, displayName?: string) => Promise<{ success: boolean; error?: string }>;
  sendPasswordReset: (email: string) => Promise<{ success: boolean; error?: string }>;
  onSuccess: (message: string) => void;
}

const AVATAR_OPTIONS = [
  { id: 'puku', icon: PukuMonkeyIcon, label: 'Puku' },
  { id: 'lisbon', icon: FlagPortugal, label: 'Lisbon' },
  { id: 'princess', icon: CrownPrincessIcon, label: 'Princess' },
  { id: 'flower', icon: CherryFlowerIcon, label: 'Maya' },
  { id: 'coffee', icon: CoffeeCupIcon, label: 'Bica' }
];

const NICKNAME_PRESETS = ["Amisha", "Puntey", "Maya", "Sujan"];

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  loginWithGoogle,
  loginWithEmail,
  signupWithEmail,
  sendPasswordReset,
  onSuccess
}) => {
  const [mode, setMode] = useState<'signin' | 'signup' | 'forgot'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('Amisha');
  const [selectedAvatar, setSelectedAvatar] = useState('puku');
  const [showPassword, setShowPassword] = useState(false);
  
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [resetSent, setResetSent] = useState(false);

  if (!isOpen) return null;

  const handleGoogleAuth = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    playTone(550, 'sine', 0.05);
    triggerHaptic('light');

    const res = await loginWithGoogle();
    setIsLoading(false);
    if (res.success) {
      playSuccessSound();
      triggerHaptic('success');
      onSuccess("Bem-vinda! Successfully signed in with Google! 🇵🇹✨");
      onClose();
    } else {
      setErrorMessage(res.error || "Google sign in was cancelled or failed.");
      triggerHaptic('error');
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMessage("Please enter both email and password.");
      triggerHaptic('error');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    if (mode === 'signin') {
      const res = await loginWithEmail(email, password);
      setIsLoading(false);
      if (res.success) {
        playSuccessSound();
        triggerHaptic('success');
        onSuccess("Welcome back! Ready to continue your Portuguese journey! 🚀");
        onClose();
      } else {
        setErrorMessage(res.error || "Failed to sign in. Please verify your details.");
        triggerHaptic('error');
      }
    } else {
      // Sign Up
      if (password.length < 6) {
        setIsLoading(false);
        setErrorMessage("Password must be at least 6 characters.");
        triggerHaptic('error');
        return;
      }

      const res = await signupWithEmail(email, password, name || 'Amisha');
      setIsLoading(false);
      if (res.success) {
        playSuccessSound();
        triggerHaptic('success');
        onSuccess(`Parabéns, ${name || 'Amisha'}! Account created successfully! 🎉`);
        onClose();
      } else {
        setErrorMessage(res.error || "Failed to create account.");
        triggerHaptic('error');
      }
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setErrorMessage("Please enter your registered email address.");
      triggerHaptic('error');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);
    const res = await sendPasswordReset(email);
    setIsLoading(false);

    if (res.success) {
      setResetSent(true);
      playSuccessSound();
      triggerHaptic('success');
    } else {
      setErrorMessage(res.error || "Could not send reset email.");
      triggerHaptic('error');
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md ios-fade-in">
      
      <div className="relative w-full max-w-md overflow-hidden rounded-[32px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl ios-modal-scale-in">
        
        {/* Banner Header */}
        <div className="relative bg-gradient-to-br from-[#1d4ed8] via-[#2563eb] to-[#3b82f6] p-6 text-white text-center overflow-hidden">
          
          {/* Subtle Background Elements */}
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-xl pointer-events-none"></div>
          <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-rose-500/20 rounded-full blur-xl pointer-events-none"></div>

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 h-8 w-8 rounded-full bg-black/20 hover:bg-black/30 flex items-center justify-center text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Portuguese Mascot Icon */}
          <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 shadow-lg backdrop-blur-md border border-white/30">
            {mode === 'signup' ? <FlagPortugal size={32} /> : <PukuMonkeyIcon size={36} />}
          </div>

          <h3 className="text-xl font-bold tracking-tight text-white">
            {mode === 'signin' && "Welcome Back, Puntey!"}
            {mode === 'signup' && "Create Your Account"}
            {mode === 'forgot' && "Reset Password"}
          </h3>
          <p className="text-xs text-blue-100 mt-1 font-medium">
            {mode === 'signin' && "Sign in to save your streaks, XP & unlock love notes"}
            {mode === 'signup' && "Join Sujan's Portuguese learning adventure"}
            {mode === 'forgot' && "We will send you a password recovery link"}
          </p>
        </div>

        {/* Mode Switcher Tabs */}
        {mode !== 'forgot' && (
          <div className="grid grid-cols-2 p-1.5 bg-slate-100 dark:bg-slate-800/80 m-4 mb-0 rounded-2xl">
            <button
              onClick={() => {
                playTone(600, 'sine', 0.03);
                setMode('signin');
                setErrorMessage(null);
              }}
              className={`py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                mode === 'signin'
                  ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => {
                playTone(600, 'sine', 0.03);
                setMode('signup');
                setErrorMessage(null);
              }}
              className={`py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                mode === 'signup'
                  ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              Create Account
            </button>
          </div>
        )}

        {/* Content Body */}
        <div className="p-6 pt-4 space-y-4">

          {/* Error Message Box */}
          {errorMessage && (
            <div className="rounded-xl bg-rose-50 dark:bg-rose-950/40 p-3 text-xs font-medium text-rose-600 dark:text-rose-300 border border-rose-200 dark:border-rose-900/50 flex items-start gap-2 fade-in">
              <span className="text-sm">⚠️</span>
              <p className="flex-1">{errorMessage}</p>
            </div>
          )}

          {/* FORGOT PASSWORD VIEW */}
          {mode === 'forgot' ? (
            <div className="space-y-4">
              {resetSent ? (
                <div className="text-center py-4 space-y-2">
                  <div className="mx-auto w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center text-emerald-600 dark:text-emerald-400 text-2xl">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">Email Sent!</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    We sent a password reset link to <strong className="text-slate-800 dark:text-slate-200">{email}</strong>. Check your inbox!
                  </p>
                  <button
                    onClick={() => {
                      setMode('signin');
                      setResetSent(false);
                    }}
                    className="mt-4 w-full py-2.5 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition-colors cursor-pointer"
                  >
                    Back to Sign In
                  </button>
                </div>
              ) : (
                <form onSubmit={handleResetPassword} className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                      Account Email
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                      <input
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="amisha@example.com"
                        required
                        className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 pl-10 pr-4 py-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-bold transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
                  >
                    {isLoading ? "Sending..." : "Send Reset Link"}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setMode('signin');
                      setErrorMessage(null);
                    }}
                    className="w-full text-center text-xs font-bold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 pt-1 cursor-pointer"
                  >
                    Cancel and Sign In
                  </button>
                </form>
              )}
            </div>
          ) : (
            <>
              {/* One-Click Google Login Button */}
              <button
                onClick={handleGoogleAuth}
                disabled={isLoading}
                className="w-full py-2.5 px-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-700/60 active:scale-[0.98] transition-all flex items-center justify-center gap-2.5 shadow-xs cursor-pointer"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span>Continue with Google</span>
              </button>

              {/* Divider */}
              <div className="flex items-center gap-2 text-[10px] uppercase font-bold text-slate-400 my-1">
                <div className="h-px bg-slate-200 dark:bg-slate-800 flex-1"></div>
                <span>or with email</span>
                <div className="h-px bg-slate-200 dark:bg-slate-800 flex-1"></div>
              </div>

              {/* Email Form */}
              <form onSubmit={handleEmailAuth} className="space-y-3">
                
                {/* SIGN UP ONLY: Name & Avatar selection */}
                {mode === 'signup' && (
                  <div className="space-y-2">
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                        Your Name / Nickname
                      </label>
                      <div className="relative">
                        <UserIcon className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                        <input
                          type="text"
                          value={name}
                          onChange={e => setName(e.target.value)}
                          placeholder="Amisha"
                          required
                          className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 pl-10 pr-4 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none"
                        />
                      </div>
                    </div>

                    {/* Quick Nickname Chips */}
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] text-slate-400 font-medium">Quick:</span>
                      {NICKNAME_PRESETS.map(preset => (
                        <button
                          key={preset}
                          type="button"
                          onClick={() => setName(preset)}
                          className={`text-[10px] px-2 py-0.5 rounded-full font-bold transition-all cursor-pointer ${
                            name === preset
                              ? 'bg-rose-500 text-white'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                          }`}
                        >
                          {preset}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Email Field */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="amisha@example.com"
                      required
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 pl-10 pr-4 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Password
                    </label>
                    {mode === 'signin' && (
                      <button
                        type="button"
                        onClick={() => {
                          setMode('forgot');
                          setErrorMessage(null);
                        }}
                        className="text-[10px] font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                      >
                        Forgot?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 pl-10 pr-10 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Submit Action Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 text-white text-xs font-bold transition-all shadow-md hover:shadow-lg active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2 mt-2"
                >
                  {isLoading ? (
                    <span>Please wait...</span>
                  ) : mode === 'signin' ? (
                    <>
                      <span>Sign In & Sync Progress</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  ) : (
                    <>
                      <span>Create Account & Start</span>
                      <Sparkles className="w-4 h-4" />
                    </>
                  )}
                </button>

              </form>

              {/* Guest / Continue Without Login */}
              <div className="pt-2 text-center">
                <button
                  type="button"
                  onClick={onClose}
                  className="text-[11px] font-semibold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
                >
                  Continue as Guest (Local Offline Mode)
                </button>
              </div>
            </>
          )}

        </div>

        {/* Footer info badge */}
        <div className="p-3 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/50 flex items-center justify-center gap-1.5 text-[10px] text-slate-400">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          <span>Secure Firebase Cloud Sync • Made with ❤️ for Amisha</span>
        </div>

      </div>

    </div>
  );
};
