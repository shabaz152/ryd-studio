import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Shield,
  KeyRound,
  Mail,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  X,
} from 'lucide-react';
import { sound } from '../../utils/sound';

export const AccountSecurityModal: React.FC = () => {
  const {
    currentUser,
    accountSecurityModalOpen,
    setAccountSecurityModalOpen,
    updateMyCredentials,
  } = useApp();

  const [newEmail, setNewEmail] = useState<string>('');
  const [currentPassword, setCurrentPassword] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [showCurrentPassword, setShowCurrentPassword] = useState<boolean>(false);
  const [showNewPassword, setShowNewPassword] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    if (accountSecurityModalOpen && currentUser) {
      setNewEmail(currentUser.email);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setErrorMsg(null);
    }
  }, [accountSecurityModalOpen, currentUser]);

  if (!accountSecurityModalOpen || !currentUser) {
    return null;
  }

  const handleClose = () => {
    sound.playClick();
    setAccountSecurityModalOpen(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const trimmedEmail = newEmail.trim().toLowerCase();
    if (!trimmedEmail || !trimmedEmail.includes('@')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    if (!currentPassword) {
      setErrorMsg('Please enter your current password to verify authorization.');
      return;
    }

    if (newPassword) {
      if (newPassword.length < 4) {
        setErrorMsg('New password must be at least 4 characters long.');
        return;
      }
      if (newPassword !== confirmPassword) {
        setErrorMsg('New password and confirmation password do not match.');
        return;
      }
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const result = updateMyCredentials(trimmedEmail, newPassword || undefined, currentPassword);
      setIsSubmitting(false);

      if (!result.success) {
        setErrorMsg(result.error || 'Failed to update credentials. Please check your current password.');
      } else {
        setAccountSecurityModalOpen(false);
      }
    }, 250);
  };

  const roleColor =
    currentUser.role === 'admin'
      ? 'border-amber-500/30 text-amber-400 bg-amber-500/10'
      : currentUser.role === 'tutor'
      ? 'border-blue-500/30 text-blue-400 bg-blue-500/10'
      : 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg bg-white dark:bg-[#0E0E18] border border-slate-200 dark:border-white/10 rounded-3xl p-6 sm:p-7 shadow-2xl space-y-5 text-slate-900 dark:text-white">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 dark:bg-amber-400/15 border border-amber-500/30 flex items-center justify-center text-amber-500 shrink-0">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black tracking-tight text-slate-900 dark:text-white">
                Account Security & Credentials
              </h3>
              <p className="text-xs text-slate-500 dark:text-gray-400">
                Update your private personal login email and password
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Account Card */}
        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            {currentUser.avatarUrl ? (
              <img
                src={currentUser.avatarUrl}
                alt={currentUser.name}
                className="w-10 h-10 rounded-xl object-cover border border-amber-400/40 shrink-0"
              />
            ) : (
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center shrink-0">
                {currentUser.name.charAt(0)}
              </div>
            )}
            <div className="min-w-0">
              <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                {currentUser.name}
              </p>
              <p className="text-[11px] text-slate-500 dark:text-gray-400 truncate">
                Current: {currentUser.email}
              </p>
            </div>
          </div>

          <span className={`px-2.5 py-1 rounded-xl text-[10px] font-black border uppercase tracking-wider shrink-0 ${roleColor}`}>
            {currentUser.role === 'admin' ? '👑 Admin' : currentUser.role === 'tutor' ? '🧑‍🏫 Tutor' : '👨‍👩‍👧 Parent'}
          </span>
        </div>

        {/* Security Isolation Notice */}
        <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-300 text-[11px] flex items-start gap-2">
          <Shield className="w-4 h-4 shrink-0 mt-0.5 text-amber-500" />
          <span>
            <strong>Isolated & Private:</strong> Credentials can only be changed directly by you on your own account. Current password verification is strictly required.
          </span>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-300 text-xs flex items-center gap-2 animate-fadeIn">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {/* Email field */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-gray-300 mb-1">
              Personal Login Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
              <input
                type="email"
                required
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 dark:bg-black/40 border border-slate-300 dark:border-white/10 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          {/* Current Password Field */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-gray-300 mb-1">
              Current Password <span className="text-red-500">* (Required to authorize changes)</span>
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
              <input
                type={showCurrentPassword ? 'text' : 'password'}
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter current password to verify identity"
                className="w-full pl-9 pr-10 py-2 rounded-xl bg-slate-50 dark:bg-black/40 border border-slate-300 dark:border-white/10 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:border-amber-400"
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer"
              >
                {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* New Password Field */}
          <div className="pt-1 border-t border-slate-100 dark:border-white/5 space-y-3">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-slate-700 dark:text-gray-300">
                  New Password <span className="text-slate-400 text-[10px] font-normal">(Leave blank to keep existing password)</span>
                </label>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password (min. 4 characters)"
                  className="w-full pl-9 pr-10 py-2 rounded-xl bg-slate-50 dark:bg-black/40 border border-slate-300 dark:border-white/10 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:border-amber-400"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer"
                >
                  {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {newPassword && (
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-gray-300 mb-1">
                  Confirm New Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat new password"
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 dark:bg-black/40 border border-slate-300 dark:border-white/10 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 pt-3">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 py-2.5 rounded-xl border border-slate-300 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 text-xs font-bold transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-black text-xs font-black shadow-lg shadow-amber-500/20 transition-all cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-50"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isSubmitting ? 'Verifying & Saving...' : 'Save Updated Credentials'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
