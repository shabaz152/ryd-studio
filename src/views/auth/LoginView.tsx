import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { DEMO_AUTH_USERS } from '../../data/mockData';
import {
  Shield,
  GraduationCap,
  Users,
  Lock,
  Mail,
  Eye,
  EyeOff,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  MapPin,
  Clock,
} from 'lucide-react';
import { sound } from '../../utils/sound';

export const LoginView: React.FC = () => {
  const { loginWithCredentials } = useApp();
  const [email, setEmail] = useState<string>('admin@ryd.studio');
  const [password, setPassword] = useState<string>('admin123');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [selectedPersona, setSelectedPersona] = useState<'admin' | 'tutor' | 'parent'>('admin');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSelectDemoUser = (role: 'admin' | 'tutor' | 'parent') => {
    sound.playClick();
    setSelectedPersona(role);
    const demoUser = DEMO_AUTH_USERS.find((u) => u.role === role);
    if (demoUser) {
      setEmail(demoUser.email);
      setPassword(demoUser.password);
      setErrorMessage(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    setTimeout(() => {
      const result = loginWithCredentials(email, password);
      setIsLoading(false);
      if (!result.success) {
        setErrorMessage(result.error || 'Authentication failed');
      }
    }, 200);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-[#0a0a12] to-slate-950 text-white flex flex-col justify-center items-center px-4 py-8 sm:py-12 relative overflow-hidden">
      {/* Ambient background glow */}
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

        {/* Persona Credential Quick-Selector Cards */}
        <div className="bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-2xl p-3 shadow-xl space-y-2">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-1">
            Choose Persona Demo Account
          </p>
          <div className="grid grid-cols-3 gap-2">
            {/* Admin Persona */}
            <button
              type="button"
              onClick={() => handleSelectDemoUser('admin')}
              className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                selectedPersona === 'admin'
                  ? 'bg-amber-500/15 border-amber-500 ring-1 ring-amber-500 text-amber-300'
                  : 'bg-white/5 border-white/5 text-slate-400 hover:text-white hover:bg-white/10'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-base">👑</span>
                {selectedPersona === 'admin' && <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />}
              </div>
              <div className="mt-2">
                <p className="text-xs font-bold text-white leading-tight">Admin</p>
                <p className="text-[10px] text-amber-400 font-medium">Head of App</p>
              </div>
            </button>

            {/* Tutor Persona */}
            <button
              type="button"
              onClick={() => handleSelectDemoUser('tutor')}
              className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                selectedPersona === 'tutor'
                  ? 'bg-blue-500/15 border-blue-500 ring-1 ring-blue-500 text-blue-300'
                  : 'bg-white/5 border-white/5 text-slate-400 hover:text-white hover:bg-white/10'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-base">🧑‍🏫</span>
                {selectedPersona === 'tutor' && <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />}
              </div>
              <div className="mt-2">
                <p className="text-xs font-bold text-white leading-tight">Tutor</p>
                <p className="text-[10px] text-blue-400 font-medium">Faculty View</p>
              </div>
            </button>

            {/* Parent Persona */}
            <button
              type="button"
              onClick={() => handleSelectDemoUser('parent')}
              className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                selectedPersona === 'parent'
                  ? 'bg-emerald-500/15 border-emerald-500 ring-1 ring-emerald-500 text-emerald-300'
                  : 'bg-white/5 border-white/5 text-slate-400 hover:text-white hover:bg-white/10'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-base">👨‍👩‍👧</span>
                {selectedPersona === 'parent' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
              </div>
              <div className="mt-2">
                <p className="text-xs font-bold text-white leading-tight">Parent</p>
                <p className="text-[10px] text-emerald-400 font-medium">Family Hub</p>
              </div>
            </button>
          </div>
        </div>

        {/* Credentials Form Box */}
        <div className="bg-slate-900/90 backdrop-blur-2xl border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-2xl space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div>
              <h2 className="text-base font-black text-white">Sign In With Credentials</h2>
              <p className="text-xs text-slate-400">
                {selectedPersona === 'admin' && '👑 Head of Platform: Full access to all portals & Live Tutor GPS Map'}
                {selectedPersona === 'tutor' && '🧑‍🏫 Faculty Tutor: Access to Tutor Workbench & classes only'}
                {selectedPersona === 'parent' && '👨‍👩‍👧 Family Portal: Access to child progress & live tutor tracking'}
              </p>
            </div>
          </div>

          {errorMessage && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Account Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="name@ryd.studio"
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
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
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
              className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-black font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:brightness-110 active:scale-[0.99] transition-all shadow-lg shadow-amber-500/20 cursor-pointer disabled:opacity-50"
            >
              <span>{isLoading ? 'Authenticating...' : `Sign In as ${selectedPersona.toUpperCase()}`}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Credential Hint */}
          <div className="pt-3 border-t border-white/10 text-[11px] text-slate-400 space-y-1">
            <p className="font-semibold text-slate-300">Preset Credentials (1-Tap Auto-filled):</p>
            <div className="grid grid-cols-1 gap-1 text-[10px]">
              <div className="flex items-center justify-between bg-white/5 px-2 py-1 rounded-lg">
                <span className="text-amber-400 font-bold">Admin (Head):</span>
                <span>admin@ryd.studio / admin123</span>
              </div>
              <div className="flex items-center justify-between bg-white/5 px-2 py-1 rounded-lg">
                <span className="text-blue-400 font-bold">Tutor (Faculty):</span>
                <span>tutor@ryd.studio / tutor123</span>
              </div>
              <div className="flex items-center justify-between bg-white/5 px-2 py-1 rounded-lg">
                <span className="text-emerald-400 font-bold">Parent (Family):</span>
                <span>parent@ryd.studio / parent123</span>
              </div>
            </div>
          </div>
        </div>

        {/* System Capabilities Footer */}
        <div className="flex items-center justify-center gap-4 text-[11px] text-slate-500 font-semibold">
          <span className="flex items-center gap-1">
            <Shield className="w-3.5 h-3.5 text-amber-500" />
            <span>Role-Gated Security</span>
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-blue-400" />
            <span>Live GPS Radar</span>
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-emerald-400" />
            <span>Real-Time Invariants</span>
          </span>
        </div>
      </div>
    </div>
  );
};
