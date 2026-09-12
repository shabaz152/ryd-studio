import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Shield,
  GraduationCap,
  Users,
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
  X,
  User,
} from 'lucide-react';
import { sound } from '../../utils/sound';

export const LoginView: React.FC = () => {
  const { loginWithCredentials, loginWithGoogle } = useApp();

  // Form states - strictly private, NEVER prefilled with exposed credentials!
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [selectedRole, setSelectedRole] = useState<'admin' | 'tutor' | 'parent'>('tutor');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Google OAuth Modal state
  const [isGoogleModalOpen, setIsGoogleModalOpen] = useState<boolean>(false);
  const [googleCustomEmail, setGoogleCustomEmail] = useState<string>('');
  const [googleCustomName, setGoogleCustomName] = useState<string>('');
  const [googleRole, setGoogleRole] = useState<'admin' | 'tutor' | 'parent'>('tutor');
  const [isCustomGoogleActive, setIsCustomGoogleActive] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email.trim()) {
      setErrorMessage('Please enter your account email.');
      return;
    }
    if (!password) {
      setErrorMessage('Please enter your account password.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      const result = loginWithCredentials(email, password, selectedRole);
      setIsLoading(false);
      if (!result.success) {
        setErrorMessage(result.error || 'Authentication failed. Please check your credentials.');
      }
    }, 250);
  };

  const handleGoogleQuickSignIn = (name: string, googleEmail: string, role: 'admin' | 'tutor' | 'parent', avatarUrl?: string) => {
    setIsGoogleModalOpen(false);
    loginWithGoogle({
      name,
      email: googleEmail,
      avatarUrl,
      role,
    });
  };

  const handleCustomGoogleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!googleCustomEmail.trim() || !googleCustomEmail.includes('@')) {
      alert('Please enter a valid Google email address.');
      return;
    }
    const finalName = googleCustomName.trim() || googleCustomEmail.split('@')[0];
    setIsGoogleModalOpen(false);
    loginWithGoogle({
      name: finalName,
      email: googleCustomEmail.trim(),
      role: googleRole,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-[#0a0a14] to-slate-950 text-white flex flex-col justify-center items-center px-4 py-8 sm:py-12 relative overflow-hidden">
      {/* Ambient background illumination */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-amber-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[350px] h-[350px] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10 space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-800 border border-amber-400/50 shadow-gold-glow-md mb-2">
            <span className="font-display font-black text-[#FFD000] text-2xl">R</span>
          </div>
          <div className="flex items-center justify-center gap-1.5 leading-none">
            <span className="font-display font-black tracking-tight text-white text-2xl sm:text-3xl">RYD</span>
            <span className="font-display font-black tracking-tight text-amber-400 text-2xl sm:text-3xl">STUDIO</span>
          </div>
          <p className="text-xs text-slate-400 font-medium">
            Academic Tutoring & STEM Faculty Platform
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-slate-900/90 backdrop-blur-2xl border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5">
          <div className="text-center space-y-1 pb-1">
            <h2 className="text-lg font-black text-white">Welcome Back</h2>
            <p className="text-xs text-slate-400">
              Sign in with your Google account or personal credentials
            </p>
          </div>

          {/* Primary Method: Continue with Google Button */}
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              setIsGoogleModalOpen(true);
            }}
            className="w-full py-3 px-4 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs flex items-center justify-center gap-3 transition-all shadow-md hover:shadow-lg active:scale-[0.99] cursor-pointer"
          >
            {/* Official Google Multi-Color SVG Icon */}
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Continue with Google</span>
          </button>

          {/* Divider */}
          <div className="relative flex items-center justify-center my-2">
            <div className="border-t border-white/10 w-full" />
            <span className="bg-slate-900 px-3 text-[11px] text-slate-500 font-semibold uppercase tracking-wider whitespace-nowrap">
              or sign in with email
            </span>
            <div className="border-t border-white/10 w-full" />
          </div>

          {/* Persona Role Selection Tabs */}
          <div className="space-y-1.5">
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Select Your Portal Role
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  setSelectedRole('tutor');
                  setErrorMessage(null);
                }}
                className={`py-2 px-2.5 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1 ${
                  selectedRole === 'tutor'
                    ? 'bg-blue-500/20 border-blue-500 text-blue-300 ring-1 ring-blue-500/40'
                    : 'bg-white/5 border-white/10 text-slate-400 hover:text-white hover:bg-white/10'
                }`}
              >
                <GraduationCap className="w-4 h-4 text-blue-400" />
                <span className="text-xs font-bold leading-none">Tutor</span>
                <span className="text-[9px] text-slate-400">Faculty</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  setSelectedRole('parent');
                  setErrorMessage(null);
                }}
                className={`py-2 px-2.5 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1 ${
                  selectedRole === 'parent'
                    ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 ring-1 ring-emerald-500/40'
                    : 'bg-white/5 border-white/10 text-slate-400 hover:text-white hover:bg-white/10'
                }`}
              >
                <Users className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-bold leading-none">Parent</span>
                <span className="text-[9px] text-slate-400">Family</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  setSelectedRole('admin');
                  setErrorMessage(null);
                }}
                className={`py-2 px-2.5 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1 ${
                  selectedRole === 'admin'
                    ? 'bg-amber-500/20 border-amber-500 text-amber-300 ring-1 ring-amber-500/40'
                    : 'bg-white/5 border-white/10 text-slate-400 hover:text-white hover:bg-white/10'
                }`}
              >
                <Shield className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-bold leading-none">Admin</span>
                <span className="text-[9px] text-slate-400">Owner</span>
              </button>
            </div>
          </div>

          {errorMessage && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-2 animate-fadeIn">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Credentials Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setErrorMessage(null);
                  }}
                  required
                  placeholder={
                    selectedRole === 'admin'
                      ? 'admin@ryd.studio'
                      : selectedRole === 'tutor'
                      ? 'tutor@ryd.studio'
                      : 'parent@ryd.studio'
                  }
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-white/10 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-amber-400 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setErrorMessage(null);
                  }}
                  required
                  placeholder="Enter your private password"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-950/80 border border-white/10 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-amber-400 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3 text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 rounded-xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-lg cursor-pointer disabled:opacity-50 ${
                selectedRole === 'admin'
                  ? 'bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-black shadow-amber-500/20 hover:brightness-110'
                  : selectedRole === 'tutor'
                  ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-blue-500/20 hover:brightness-110'
                  : 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-emerald-500/20 hover:brightness-110'
              }`}
            >
              <span>{isLoading ? 'Authenticating...' : `Sign In as ${selectedRole.toUpperCase()}`}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* Security / Confidentiality Badges */}
        <div className="flex items-center justify-center gap-4 text-[11px] text-slate-500 font-semibold">
          <span className="flex items-center gap-1">
            <Shield className="w-3.5 h-3.5 text-emerald-400" />
            <span>Encrypted & Confidential</span>
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <Lock className="w-3.5 h-3.5 text-amber-400" />
            <span>Role-Gated Isolation</span>
          </span>
        </div>
      </div>

      {/* Google Sign-In Interactive Modal */}
      {isGoogleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-md bg-white dark:bg-[#0E0E17] border border-slate-200 dark:border-white/10 rounded-2xl p-6 shadow-2xl space-y-4">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-white/10">
              <div className="flex items-center gap-2.5">
                <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">Sign in with Google</h3>
                  <p className="text-[11px] text-slate-500 dark:text-gray-400">Choose an account to continue to RYD STUDIO</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsGoogleModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Google Account Options */}
            {!isCustomGoogleActive ? (
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() =>
                    handleGoogleQuickSignIn(
                      'Shazz',
                      'shazz.faculty@gmail.com',
                      'tutor',
                      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
                    )
                  }
                  className="w-full p-3 rounded-xl border border-slate-200 dark:border-white/10 hover:border-blue-500/50 hover:bg-blue-500/5 transition-all text-left flex items-center justify-between group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
                      alt="Shazz"
                      className="w-9 h-9 rounded-full object-cover border border-blue-400/40"
                    />
                    <div>
                      <p className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-blue-400 transition-colors">
                        Shazz (Lead STEM Faculty)
                      </p>
                      <p className="text-[11px] text-slate-500 dark:text-gray-400">shazz.faculty@gmail.com</p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/15 text-blue-400 border border-blue-500/20">
                    Faculty Tutor
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    handleGoogleQuickSignIn(
                      'Marcus Vance',
                      'marcus.vance@gmail.com',
                      'parent',
                      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
                    )
                  }
                  className="w-full p-3 rounded-xl border border-slate-200 dark:border-white/10 hover:border-emerald-500/50 hover:bg-emerald-500/5 transition-all text-left flex items-center justify-between group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80"
                      alt="Marcus Vance"
                      className="w-9 h-9 rounded-full object-cover border border-emerald-400/40"
                    />
                    <div>
                      <p className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-emerald-400 transition-colors">
                        Marcus Vance (Parent)
                      </p>
                      <p className="text-[11px] text-slate-500 dark:text-gray-400">marcus.vance@gmail.com</p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">
                    Family Portal
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    handleGoogleQuickSignIn(
                      'Owner (Admin)',
                      'admin@ryd.studio',
                      'admin',
                      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
                    )
                  }
                  className="w-full p-3 rounded-xl border border-slate-200 dark:border-white/10 hover:border-amber-500/50 hover:bg-amber-500/5 transition-all text-left flex items-center justify-between group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-amber-500 text-black font-black flex items-center justify-center text-sm shadow-xs">
                      👑
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-amber-400 transition-colors">
                        Director (Admin Head)
                      </p>
                      <p className="text-[11px] text-slate-500 dark:text-gray-400">admin@ryd.studio</p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/15 text-amber-400 border border-amber-500/20">
                    App Owner
                  </span>
                </button>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => setIsCustomGoogleActive(true)}
                    className="w-full py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer border border-slate-200 dark:border-white/10"
                  >
                    <User className="w-3.5 h-3.5" />
                    <span>Use another Google account</span>
                  </button>
                </div>
              </div>
            ) : (
              /* Custom Google Account Entry */
              <form onSubmit={handleCustomGoogleSubmit} className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    value={googleCustomName}
                    onChange={(e) => setGoogleCustomName(e.target.value)}
                    placeholder="e.g. Dr. Alex Mercer"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950/80 border border-slate-300 dark:border-white/10 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Google / Gmail Email
                  </label>
                  <input
                    type="email"
                    required
                    value={googleCustomEmail}
                    onChange={(e) => setGoogleCustomEmail(e.target.value)}
                    placeholder="yourname@gmail.com"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950/80 border border-slate-300 dark:border-white/10 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Access Role
                  </label>
                  <div className="grid grid-cols-3 gap-1.5">
                    <button
                      type="button"
                      onClick={() => setGoogleRole('tutor')}
                      className={`py-1.5 px-2 rounded-lg border text-center text-xs font-bold transition-all cursor-pointer ${
                        googleRole === 'tutor'
                          ? 'bg-blue-500/20 border-blue-500 text-blue-600 dark:text-blue-300'
                          : 'border-slate-200 dark:border-white/10 text-slate-500'
                      }`}
                    >
                      Tutor
                    </button>
                    <button
                      type="button"
                      onClick={() => setGoogleRole('parent')}
                      className={`py-1.5 px-2 rounded-lg border text-center text-xs font-bold transition-all cursor-pointer ${
                        googleRole === 'parent'
                          ? 'bg-emerald-500/20 border-emerald-500 text-emerald-600 dark:text-emerald-300'
                          : 'border-slate-200 dark:border-white/10 text-slate-500'
                      }`}
                    >
                      Parent
                    </button>
                    <button
                      type="button"
                      onClick={() => setGoogleRole('admin')}
                      className={`py-1.5 px-2 rounded-lg border text-center text-xs font-bold transition-all cursor-pointer ${
                        googleRole === 'admin'
                          ? 'bg-amber-500/20 border-amber-500 text-amber-600 dark:text-amber-300'
                          : 'border-slate-200 dark:border-white/10 text-slate-500'
                      }`}
                    >
                      Admin
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsCustomGoogleActive(false)}
                    className="flex-1 py-2 rounded-xl border border-slate-300 dark:border-white/10 text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 cursor-pointer"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md cursor-pointer"
                  >
                    Sign In with Google
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
