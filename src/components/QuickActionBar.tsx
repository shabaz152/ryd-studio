import React from 'react';
import { useApp } from '../context/AppContext';
import { LogIn, LogOut, Clock, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { sound } from '../utils/sound';

export const QuickActionBar: React.FC = () => {
  const {
    isCheckedIn,
    checkedInSession,
    sessions,
    showToast,
    isRunningLate,
    runningLateMinutes,
    clearRunningLate,
    setCheckInModalOpen,
    setCheckOutModalOpen,
    openCheckOutForSession,
    setRunningLateModalOpen,
  } = useApp();

  const totalCheckIns = sessions.filter((s) => s.status === 'checked_in' || s.status === 'completed').length;
  const totalCheckOuts = sessions.filter((s) => s.status === 'completed').length;

  return (
    <div className="space-y-3">
      {/* 1:1 Check-In & Check-Out Verified Pair Status Bar */}
      <div className="p-3.5 rounded-2xl bg-white/70 dark:bg-[#14141E] border border-slate-200 dark:border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs shadow-xs">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-[#FACC15]/20 text-[#D97706] dark:text-[#FACC15] flex items-center justify-center font-black text-xs">
            1:1
          </div>
          <div>
            <span className="font-bold text-slate-800 dark:text-white">Check-In & Check-Out Verification:</span>
            <span className="text-slate-500 dark:text-gray-400 ml-1.5">For every check-in there is one checked-out</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-600 dark:text-gray-300">
            <span>Check-Ins: <strong className="text-slate-900 dark:text-white font-mono text-xs">{totalCheckIns}</strong></span>
            <span className="text-slate-300 dark:text-gray-600">•</span>
            <span>Check-Outs: <strong className="text-slate-900 dark:text-white font-mono text-xs">{totalCheckOuts}</strong></span>
          </div>

          {isCheckedIn ? (
            <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-300 font-bold text-[10px] border border-amber-300 dark:border-amber-500/30">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping" />
              <span>1 Active (Check-Out Next)</span>
            </span>
          ) : (
            <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-400 font-bold text-[10px] border border-emerald-300 dark:border-emerald-500/20">
              <CheckCircle2 className="w-3 h-3" />
              <span>100% Paired (Ready for Next Class)</span>
            </span>
          )}
        </div>
      </div>

      {/* Running Late Active Banner */}
      {isRunningLate && (
        <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between text-xs text-amber-200 animate-fade-in shadow-md">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-full bg-amber-500/20 flex items-center justify-center shrink-0">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
            </div>
            <span>
              <strong>Running Late Active:</strong> +{runningLateMinutes} mins alert broadcasted to batch parents and reception.
            </span>
          </div>
          <button
            onClick={clearRunningLate}
            className="text-[11px] font-bold text-amber-400 hover:text-white underline px-2 py-0.5 rounded cursor-pointer"
          >
            Clear Alert
          </button>
        </div>
      )}

      {/* 3 Executive Glossy Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        {/* Action 1: CHECK IN */}
        <div
          onClick={() => {
            sound.playClick();
            setCheckInModalOpen(true);
          }}
          className={`relative p-5 rounded-3xl transition-all cursor-pointer top-sheen group ${
            isCheckedIn
              ? 'glossy-card border-[#FFD000]/60 shadow-gold-glow-sm'
              : 'glossy-card glossy-card-hover'
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <div
              className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-105 ${
                isCheckedIn
                  ? 'glossy-button-yellow shadow-gold-glow-sm'
                  : 'bg-[#181824] text-[#FFD000] border border-white/10'
              }`}
            >
              <LogIn className="w-5 h-5" />
            </div>

            <span
              className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${
                isCheckedIn
                  ? 'glossy-pill-yellow text-[#FFD000]'
                  : 'glossy-pill-dark text-gray-400'
              }`}
            >
              {isCheckedIn ? 'Checked In (Step 1 ✓)' : 'Step 1 • Arrival'}
            </span>
          </div>

          <h3 className="text-base font-bold text-white group-hover:text-[#FFD000] transition-colors">
            {isCheckedIn ? 'Check In Details' : 'Check In to Studio'}
          </h3>
          <p className="text-xs text-gray-400 mt-1">
            {isCheckedIn && checkedInSession
              ? `Active: ${checkedInSession.batchName}. Check out required after class.`
              : 'Review class timings, roster planner & venue map'}
          </p>

          <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs">
            <span className="text-[11px] text-gray-400">
              {isCheckedIn ? 'Session in Progress' : 'Downtown Central'}
            </span>
            <span className="text-[#FFD000] font-bold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
              <span>{isCheckedIn ? 'View Active' : 'Open Planner'}</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>

        {/* Action 2: CHECK OUT */}
        <div
          onClick={() => {
            sound.playClick();
            if (isCheckedIn && checkedInSession) {
              openCheckOutForSession(checkedInSession);
            } else {
              showToast({
                type: 'alert',
                title: 'Check In Required First',
                description: 'For every check-in there has to be one check-out. Please check into your class first.',
              });
              setCheckInModalOpen(true);
            }
          }}
          className={`relative p-5 rounded-3xl transition-all cursor-pointer top-sheen group ${
            isCheckedIn
              ? 'glossy-card border-[#FFD000] shadow-gold-glow'
              : 'glossy-card glossy-card-hover opacity-90'
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <div
              className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-105 ${
                isCheckedIn
                  ? 'glossy-button-yellow'
                  : 'bg-[#181824] text-gray-400 border border-white/10'
              }`}
            >
              <LogOut className="w-5 h-5" />
            </div>

            <span
              className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${
                isCheckedIn
                  ? 'bg-[#FFD000] text-black font-black'
                  : 'glossy-pill-dark text-gray-400'
              }`}
            >
              {isCheckedIn ? 'Ready to Check Out (Step 2)' : 'Step 2 • Requires Check In'}
            </span>
          </div>

          <h3 className="text-base font-bold text-white group-hover:text-[#FFD000] transition-colors">
            {isCheckedIn ? 'Complete Check Out' : 'Check Out & Attendance'}
          </h3>
          <p className="text-xs text-gray-400 mt-1">
            {isCheckedIn && checkedInSession
              ? `Active: ${checkedInSession.batchName}. Tap to complete 1:1 check-out & log hours.`
              : 'For every check-in there is one check-out. Check into class first to activate.'}
          </p>

          <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs">
            <span className="text-[11px] text-gray-400">
              {isCheckedIn && checkedInSession
                ? `Active Session: ${checkedInSession.durationMinutes / 60} hrs`
                : 'Status: Locked (Check In First)'}
            </span>
            <span className="text-[#FFD000] font-bold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
              <span>{isCheckedIn ? 'Check Out Now' : 'Check In First'}</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>

        {/* Action 3: RUNNING LATE */}
        <div
          onClick={() => {
            sound.playClick();
            setRunningLateModalOpen(true);
          }}
          className="relative p-5 rounded-3xl glossy-card hover:border-amber-400/50 transition-all cursor-pointer top-sheen group shadow-card-dark"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-11 h-11 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center transition-transform group-hover:scale-105">
              <Clock className="w-5 h-5" />
            </div>

            <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30">
              Quick Transit Alert
            </span>
          </div>

          <h3 className="text-base font-bold text-white group-hover:text-amber-300 transition-colors">
            Running Late?
          </h3>
          <p className="text-xs text-gray-400 mt-1">
            Select 5 or 10 mins late with voice speech recognition
          </p>

          <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs">
            <span className="text-[11px] text-amber-400/90 font-medium">
              5m / 10m + Voice
            </span>
            <span className="text-amber-400 font-bold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
              <span>Notify Parents</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
