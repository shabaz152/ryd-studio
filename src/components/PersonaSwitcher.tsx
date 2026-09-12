import React from 'react';
import { Shield, GraduationCap, Users, LogIn } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const PersonaSwitcher: React.FC = () => {
  const {
    activeRole,
    setActiveRole,
    setRoleGatewayModalOpen,
    tutorOnlineStatus,
    teacher,
    unreadAdminActivityCount,
    unreadParentActivityCount,
  } = useApp();

  const getTutorStatusBadge = () => {
    switch (tutorOnlineStatus) {
      case 'in_session':
        return { text: 'In Session', dot: 'bg-amber-400 animate-pulse' };
      case 'running_late':
        return { text: 'Late Alert', dot: 'bg-amber-400 animate-ping' };
      case 'online':
        return { text: 'Online', dot: 'bg-emerald-500' };
      default:
        return { text: 'Offline', dot: 'bg-slate-400' };
    }
  };

  const statusBadge = getTutorStatusBadge();

  return (
    <div className="w-full bg-slate-900 border-b border-slate-800 text-white px-3 sm:px-6 py-2 shadow-xs transition-colors select-none">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2 text-xs">
        {/* Left: Role switcher explanation badge */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 font-semibold text-[11px] border border-amber-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            <span>TRIANGULAR ECOSYSTEM</span>
          </div>
          <span className="hidden md:inline text-slate-400 text-[11px]">
            Switch live perspective to test multi-user workflows:
          </span>
        </div>

        {/* Center: The 3 Persona Pills */}
        <div className="flex items-center gap-1.5 bg-slate-950/80 p-1 rounded-xl border border-white/10 shadow-inner">
          {/* Admin / Owner Button */}
          <button
            onClick={() => setActiveRole('admin')}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-lg font-bold text-xs transition-all cursor-pointer ${
              activeRole === 'admin'
                ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-black shadow-md shadow-amber-500/20'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
            title="Switch to App Owner & Center Admin View"
          >
            <Shield className="w-3.5 h-3.5 shrink-0" />
            <span>👑 Admin (Owner)</span>
            {unreadAdminActivityCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-red-500 text-white text-[10px] font-black animate-pulse">
                {unreadAdminActivityCount}
              </span>
            )}
          </button>

          {/* Tutor Button */}
          <button
            onClick={() => setActiveRole('tutor')}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-lg font-bold text-xs transition-all cursor-pointer ${
              activeRole === 'tutor'
                ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md shadow-blue-500/20'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
            title="Switch to Faculty Tutor Workbench"
          >
            <GraduationCap className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate max-w-[110px] sm:max-w-none">🧑‍🏫 Tutor ({teacher.name.split(' ')[0]})</span>
            <span className="flex items-center gap-1 text-[10px] opacity-90">
              <span className={`w-1.5 h-1.5 rounded-full ${statusBadge.dot}`} />
              <span className="hidden sm:inline font-normal">{statusBadge.text}</span>
            </span>
          </button>

          {/* Parent / Student Button */}
          <button
            onClick={() => setActiveRole('parent')}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-lg font-bold text-xs transition-all cursor-pointer ${
              activeRole === 'parent'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md shadow-emerald-500/20'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
            title="Switch to Family & Learner Portal"
          >
            <Users className="w-3.5 h-3.5 shrink-0" />
            <span>👨‍👩‍👧 Parent / Student</span>
            {unreadParentActivityCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-emerald-400 text-slate-950 text-[10px] font-black">
                {unreadParentActivityCount}
              </span>
            )}
          </button>
        </div>

        {/* Right: Role login gateway trigger */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setRoleGatewayModalOpen(true)}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white text-[11px] font-semibold border border-white/10 transition-colors cursor-pointer"
            title="Open Role Gateway Login Modal"
          >
            <LogIn className="w-3 h-3 text-amber-400" />
            <span className="hidden sm:inline">Role Gateway</span>
          </button>
        </div>
      </div>
    </div>
  );
};
