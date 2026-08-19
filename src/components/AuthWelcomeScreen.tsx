import React, { useState } from 'react';
import { playSuccessSound, playTone } from '../utils/audio';
import { triggerHaptic } from '../utils/haptics';
import { 
  Mail, 
  Lock, 
  User as UserIcon, 
  Eye, 
  EyeOff, 
  Sparkles, 
  ArrowRight,
  ShieldCheck,
  Heart,
  Globe2,
  CheckCircle2
} from 'lucide-react';
import { FlagPortugal, FlagNepal, GoldCoin, PukuMonkeyIcon } from './icons/PremiumIcons';

interface AuthWelcomeScreenProps {
  loginWithGoogle: () => Promise<{ success: boolean; error?: string }>;
  loginWithEmail: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  signupWithEmail: (email: string, pass: string, displayName?: string) => Promise<{ success: boolean; error?: string }>;
  sendPasswordReset: (email: string) => Promise<{ success: boolean; error?: string }>;
  onContinueAsGuest: () => void;
  onSuccess: (message: string) => void;
}

export const AuthWelcomeScreen: React.FC<AuthWelcomeScreenProps> = ({
  loginWithGoogle,
  loginWithEmail,
  signupWithEmail,
  sendPasswordReset,
  onContinueAsGuest,
  onSuccess,
}) => {
  const [authMode, setAuthMode] = useState<'welcome' | 'email_signin' | 'email_signup' | 'forgot'>('welcome');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('Amisha');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [resetSent, setResetSent] = useState(false);

  const handleGoogleSignIn = async () => {
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
    } else {
      setErrorMessage(res.error || "Google sign in was cancelled or unavailable.");
      triggerHaptic('error');
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMessage("Please enter both email and password.");
      triggerHaptic('error');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    if (authMode === 'email_signin') {
      const res = await loginWithEmail(email, password);
      setIsLoading(false);
      if (res.success) {
        playSuccessSound();
        triggerHaptic('success');
        onSuccess("Welcome back, Amisha! 🚀");
      } else {
        setErrorMessage(res.error || "Invalid email or password.");
        triggerHaptic('error');
      }
    } else if (authMode === 'email_signup') {
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
      } else {
        setErrorMessage(res.error || "Could not create account.");
        triggerHaptic('error');
      }
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setErrorMessage("Please enter your email address.");
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
      setErrorMessage(res.error || "Could not send password reset email.");
      triggerHaptic('error');
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-[#060e1d] via-[#09152b] to-[#040810] text-white p-4 sm:p-6 select-none relative overflow-hidden">
      
      {/* Background Ambience & Lisbon Glow */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-[#0055ff]/25 rounded-full blur-[90px] pointer-events-none" />
      <div className="absolute bottom-[-15%] right-[-10%] w-[55%] h-[55%] bg-[#00b4d8]/20 rounded-full blur-[80px] pointer-events-none" />
      <div className="absolute top-[40%] right-[10%] w-[35%] h-[35%] bg-[#bf5af2]/15 rounded-full blur-[80px] pointer-events-none" />

      {/* Main Glass Portal Card */}
      <div className="w-full max-w-md rounded-[36px] bg-[#1c1c1e]/85 backdrop-blur-2xl border border-white/12 shadow-[0_20px_60px_rgba(0,0,0,0.8)] overflow-hidden z-10 ios-modal-scale-in">
        
        {/* Top Lisbon Hero Banner */}
        <div className="relative p-7 pb-6 text-center bg-gradient-to-b from-blue-600/30 via-transparent to-transparent border-b border-white/8">
          
          {/* Avatar Icon */}
          <div className="relative inline-block mb-3.5">
            <div className="w-20 h-20 rounded-[26px] bg-gradient-to-tr from-[#0a84ff] to-[#0066ff] flex items-center justify-center shadow-[0_8px_24px_rgba(10,132,255,0.45)] border border-white/25 mx-auto">
              <PukuMonkeyIcon size={46} />
            </div>
            <div className="absolute -bottom-1 -right-1 bg-[#2c2c2e] p-1 rounded-full border border-white/20 shadow-md">
              <FlagPortugal size={18} />
            </div>
          </div>

          <div className="flex items-center justify-center gap-1.5 mb-1 text-xs font-bold uppercase tracking-widest text-[#0a84ff]">
            <Heart className="w-3.5 h-3.5 fill-[#ff375f] text-[#ff375f]" />
            <span>Sujan & Amisha</span>
            <Heart className="w-3.5 h-3.5 fill-[#ff375f] text-[#ff375f]" />
          </div>

          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white mb-1.5">
            Portuguese with Sujan
          </h1>
          <p className="text-xs text-slate-300 font-medium max-w-xs mx-auto leading-relaxed">
            European Portuguese made simple, romantic, and fun for Amisha.
          </p>
        </div>

        {/* Form Body */}
        <div className="p-6 sm:p-7 space-y-4">

          {/* Error Banner */}
          {errorMessage && (
            <div className="p-3.5 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-semibold flex items-center gap-2.5 animate-shake">
              <span className="text-base shrink-0">⚠️</span>
              <span>{errorMessage}</span>
            </div>
          )}

          {/* WELCOME VIEW (GOOGLE 1-TAP + EMAIL CHOICES) */}
          {authMode === 'welcome' && (
            <div className="space-y-3.5">
              
              {/* Primary 1-Tap Google Sign In */}
              <button
                onClick={handleGoogleSignIn}
                disabled={isLoading}
                className="w-full h-14 rounded-2xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-sm flex items-center justify-center gap-3 shadow-[0_4px_16px_rgba(255,255,255,0.25)] active:scale-[0.98] transition-all cursor-pointer border border-white/30"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                    </svg>
                    <span>Continue with Google</span>
                  </>
                )}
              </button>

              {/* Divider */}
              <div className="flex items-center gap-3 py-1">
                <div className="h-[1px] flex-1 bg-white/10" />
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">or email</span>
                <div className="h-[1px] flex-1 bg-white/10" />
              </div>

              {/* Email Sign In */}
              <button
                onClick={() => {
                  setErrorMessage(null);
                  setAuthMode('email_signin');
                }}
                className="w-full h-12 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-semibold text-xs flex items-center justify-center gap-2 border border-white/10 active:scale-[0.98] transition-all cursor-pointer"
              >
                <Mail className="w-4 h-4 text-[#0a84ff]" />
                <span>Sign in with Email</span>
              </button>

              {/* Create Account */}
              <button
                onClick={() => {
                  setErrorMessage(null);
                  setAuthMode('email_signup');
                }}
                className="w-full h-12 rounded-2xl bg-white/5 hover:bg-white/10 text-slate-300 font-semibold text-xs flex items-center justify-center gap-2 border border-white/8 active:scale-[0.98] transition-all cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-[#ffd60a]" />
                <span>Create New Account</span>
              </button>

              {/* Continue As Guest */}
              <div className="pt-2 text-center">
                <button
                  onClick={() => {
                    playTone(600, 'sine', 0.04);
                    triggerHaptic('light');
                    onContinueAsGuest();
                  }}
                  className="text-xs font-semibold text-slate-400 hover:text-white transition-colors underline cursor-pointer"
                >
                  Explore as Guest (Offline Mode)
                </button>
              </div>
            </div>
          )}

          {/* EMAIL SIGN IN FORM */}
          {authMode === 'email_signin' && (
            <form onSubmit={handleEmailSubmit} className="space-y-3.5">
              <div>
                <label className="text-xs font-bold text-slate-300 mb-1.5 block">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="amisha@example.com"
                    required
                    className="w-full h-12 pl-10 pr-4 rounded-xl bg-white/10 border border-white/15 text-white text-xs font-medium focus:outline-none focus:border-[#0a84ff] transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 mb-1.5 block">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full h-12 pl-10 pr-10 rounded-xl bg-white/10 border border-white/15 text-white text-xs font-medium focus:outline-none focus:border-[#0a84ff] transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setAuthMode('forgot')}
                  className="text-[11px] font-bold text-[#0a84ff] hover:underline"
                >
                  Forgot Password?
                </button>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-13 rounded-2xl bg-gradient-to-r from-[#0a84ff] to-[#0066ff] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-[0_6px_20px_rgba(10,132,255,0.4)] active:scale-[0.98] transition-all cursor-pointer border border-white/20 mt-2"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <span>Sign In</span>
                )}
              </button>

              <button
                type="button"
                onClick={() => setAuthMode('welcome')}
                className="w-full py-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors text-center"
              >
                ← Back to Options
              </button>
            </form>
          )}

          {/* EMAIL SIGN UP FORM */}
          {authMode === 'email_signup' && (
            <form onSubmit={handleEmailSubmit} className="space-y-3.5">
              <div>
                <label className="text-xs font-bold text-slate-300 mb-1.5 block">Your Name / Nickname</label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Amisha"
                    required
                    className="w-full h-12 pl-10 pr-4 rounded-xl bg-white/10 border border-white/15 text-white text-xs font-medium focus:outline-none focus:border-[#0a84ff] transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 mb-1.5 block">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="amisha@example.com"
                    required
                    className="w-full h-12 pl-10 pr-4 rounded-xl bg-white/10 border border-white/15 text-white text-xs font-medium focus:outline-none focus:border-[#0a84ff] transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 mb-1.5 block">Create Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    required
                    className="w-full h-12 pl-10 pr-10 rounded-xl bg-white/10 border border-white/15 text-white text-xs font-medium focus:outline-none focus:border-[#0a84ff] transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-13 rounded-2xl bg-gradient-to-r from-[#0a84ff] to-[#0066ff] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-[0_6px_20px_rgba(10,132,255,0.4)] active:scale-[0.98] transition-all cursor-pointer border border-white/20 mt-2"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <span>Create Account</span>
                )}
              </button>

              <button
                type="button"
                onClick={() => setAuthMode('welcome')}
                className="w-full py-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors text-center"
              >
                ← Back to Options
              </button>
            </form>
          )}

          {/* FORGOT PASSWORD FORM */}
          {authMode === 'forgot' && (
            <form onSubmit={handleForgotPassword} className="space-y-3.5">
              {resetSent ? (
                <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs text-center space-y-2">
                  <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                  <p className="font-bold">Password Reset Email Sent!</p>
                  <p className="text-[11px] text-slate-300">Check your inbox for a reset link.</p>
                </div>
              ) : (
                <>
                  <p className="text-xs text-slate-300">Enter your registered email to receive a password reset link:</p>
                  <div>
                    <div className="relative">
                      <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="amisha@example.com"
                        required
                        className="w-full h-12 pl-10 pr-4 rounded-xl bg-white/10 border border-white/15 text-white text-xs font-medium focus:outline-none focus:border-[#0a84ff] transition-colors"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-12 rounded-2xl bg-gradient-to-r from-[#0a84ff] to-[#0066ff] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md active:scale-[0.98] transition-all cursor-pointer border border-white/20"
                  >
                    {isLoading ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <span>Send Reset Link</span>
                    )}
                  </button>
                </>
              )}

              <button
                type="button"
                onClick={() => {
                  setResetSent(false);
                  setAuthMode('email_signin');
                }}
                className="w-full py-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors text-center"
              >
                ← Back to Sign In
              </button>
            </form>
          )}

        </div>

        {/* Footer Features */}
        <div className="p-4 bg-black/40 border-t border-white/6 flex items-center justify-around text-[11px] font-bold text-slate-400">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> 100% Free Forever
          </span>
          <span>•</span>
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#ffd60a]" /> Real-time Cloud Sync
          </span>
        </div>

      </div>
    </div>
  );
};
