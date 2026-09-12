import React from 'react';
import { Shield, GraduationCap, Users, LogIn, Lock, ArrowLeftRight, LogOut } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const PersonaSwitcher: React.FC = () => {
  const {
    currentAuthRole,
    activeRole,
    setActiveRole,
    setRoleGatewayModalOpen,
    tutorOnlineStatus,
    teacher,
    unreadAdminActivityCount,
    unreadParentActivityCount,
    logout,
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

  // If logged in as Tutor: Restricted to Tutor Workbench only
  if (currentAuthRole === 'tutor') {
    return (
      <div className="w-full bg-slate-900 border-b border-slate-800 text-white px-3 sm:px-6 py-2 shadow-xs transition-colors select-none">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-blue-500/20 text-blue-300 font-bold text-[11px] border border-blue-500/30">
              <GraduationCap className="w-3.5 h-3.5 text-blue-400" />
              <span>FACULTY WORKBENCH</span>
            </div>
            <span className="hidden sm:inline text-slate-400 text-[11px]">
              Tutor: <strong className="text-white">{teacher.name}</strong> • Restricted Faculty Access
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-slate-300 text-[11px]">
              <span className={`w-1.5 h-1.5 rounded-full ${statusBadge.dot}`} />
              <span>Status: <strong className="text-white">{statusBadge.text}</strong></span>
            </span>

            <button
              onClick={() => setRoleGatewayModalOpen(true)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white text-[11px] font-semibold border border-white/10 transition-colors cursor-pointer"
              title="Switch to Admin or Parent account"
            >
              <ArrowLeftRight className="w-3 h-3 text-amber-400" />
              <span>Switch</span>
            </button>

            <button
              onClick={logout}
              className="flex items-center gap-1 px-2 py-1 rounded-lg bg-red-500/15 hover:bg-red-500/25 text-red-300 hover:text-red-200 text-[11px] font-bold border border-red-500/30 transition-colors cursor-pointer"
              title="Log Out of Tutor Account"
            >
              <LogOut className="w-3 h-3" />
              <span>Log Out</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // If logged in as Parent: Restricted to Family Hub only
  if (currentAuthRole === 'parent') {
    return (
      <div className="w-full bg-slate-900 border-b border-slate-800 text-white px-3 sm:px-6 py-2 shadow-xs transition-colors select-none">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 font-bold text-[11px] border border-emerald-500/30">
              <Users className="w-3.5 h-3.5 text-emerald-400" />
              <span>FAMILY PORTAL</span>
            </div>
            <span className="hidden sm:inline text-slate-400 text-[11px]">
              Parent Account: <strong className="text-white">Marcus Vance</strong> • Dedicated Family Access
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setRoleGatewayModalOpen(true)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white text-[11px] font-semibold border border-white/10 transition-colors cursor-pointer"
              title="Switch to Admin or Tutor account"
            >
              <ArrowLeftRight className="w-3 h-3 text-amber-400" />
              <span>Switch</span>
            </button>

            <button
              onClick={logout}
              className="flex items-center gap-1 px-2 py-1 rounded-lg bg-red-500/15 hover:bg-red-500/25 text-red-300 hover:text-red-200 text-[11px] font-bold border border-red-500/30 transition-colors cursor-pointer"
              title="Log Out of Parent Account"
            >
              <LogOut className="w-3 h-3" />
              <span>Log Out</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Admin is the Head: Unrestricted permission to access, audit, and toggle between all 3 UIs
  return (
    <div className="w-full bg-slate-900 border-b border-slate-800 text-white px-3 sm:px-6 py-2 shadow-xs transition-colors select-none">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2 text-xs">
        {/* Left: Head Access Indicator */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-amber-500/20 text-amber-300 font-black text-[11px] border border-amber-500/30">
            <Shield className="w-3.5 h-3.5 text-amber-400" />
            <span>👑 ADMIN (HEAD OF PLATFORM)</span>
          </div>
          <span className="hidden lg:inline text-slate-400 text-[11px]">
            You have full head access to inspect and control all 3 portals:
          </span>
        </div>

        {/* Center: The 3 Persona Switcher Pills (Admin Exclusive) */}
        <div className="flex items-center gap-1.5 bg-slate-950/90 p-1 rounded-xl border border-white/10 shadow-inner">
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
            <span>👑 Admin Portal</span>
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
            title="Preview Tutor Faculty Workbench"
          >
            <GraduationCap className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate max-w-[110px] sm:max-w-none">🧑‍🏫 Tutor View</span>
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
            title="Preview Parent & Learner Portal"
          >
            <Users className="w-3.5 h-3.5 shrink-0" />
            <span>👨‍👩‍👧 Parent View</span>
            {unreadParentActivityCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-emerald-400 text-slate-950 text-[10px] font-black">
                {unreadParentActivityCount}
              </span>
            )}
          </button>
        </div>

        {/* Right: Role login gateway trigger & Log Out */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setRoleGatewayModalOpen(true)}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white text-[11px] font-semibold border border-white/10 transition-colors cursor-pointer"
            title="Open Role Gateway to Sign In with another account"
          >
            <LogIn className="w-3 h-3 text-amber-400" />
            <span className="hidden sm:inline">Role Gateway</span>
          </button>

          <button
            onClick={logout}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-red-500/15 hover:bg-red-500/25 text-red-300 hover:text-red-200 text-[11px] font-bold border border-red-500/30 transition-colors cursor-pointer"
            title="Log Out of Admin Account"
          >
            <LogOut className="w-3 h-3" />
            <span>Log Out</span>
          </button>
        </div>
      </div>
    </div>
  );
};
