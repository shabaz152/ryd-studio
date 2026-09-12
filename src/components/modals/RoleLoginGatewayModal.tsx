import React from 'react';
import { X, Shield, GraduationCap, Users, CheckCircle2, ArrowRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const RoleLoginGatewayModal: React.FC = () => {
  const {
    roleGatewayModalOpen,
    setRoleGatewayModalOpen,
    activeRole,
    setActiveRole,
    teacher,
    setSelectedParentStudentId,
    loginTutor,
    tutorOnlineStatus,
  } = useApp();

  if (!roleGatewayModalOpen) return null;

  const handleSelectRole = (role: 'admin' | 'tutor' | 'parent', studentId?: string) => {
    setActiveRole(role);
    if (studentId) {
      setSelectedParentStudentId(studentId);
    }
    if (role === 'tutor' && tutorOnlineStatus === 'offline') {
      loginTutor();
    }
    setRoleGatewayModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-white dark:bg-[#0E0E17] border border-slate-200 dark:border-white/10 rounded-2xl p-6 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-white/10">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30">
                Triangular Platform Gateway
              </span>
              <h2 className="text-lg font-black text-slate-900 dark:text-white">Select User Persona</h2>
            </div>
            <p className="text-xs text-slate-500 dark:text-gray-400 mt-1">
              Choose an identity to experience the application from that perspective:
            </p>
          </div>
          <button
            onClick={() => setRoleGatewayModalOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Persona Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5">
          {/* Card 1: Admin / Owner */}
          <div
            onClick={() => handleSelectRole('admin')}
            className={`group p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
              activeRole === 'admin'
                ? 'bg-amber-500/10 border-amber-500 ring-2 ring-amber-500/30'
                : 'bg-slate-50 dark:bg-[#151522] border-slate-200 dark:border-white/5 hover:border-amber-400 dark:hover:border-amber-500/50'
            }`}
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-600 flex items-center justify-center text-white shadow-md shadow-amber-500/20 mb-3">
                <Shield className="w-5 h-5" />
              </div>
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Admin / Owner</h3>
                {activeRole === 'admin' && (
                  <CheckCircle2 className="w-4 h-4 text-amber-500" />
                )}
              </div>
              <p className="text-[11px] text-slate-500 dark:text-gray-400 mt-1.5 leading-relaxed">
                App requirement owner. Oversees all tutors, student rosters, schedules, and live activity audit logs.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-200/60 dark:border-white/5 flex items-center justify-between text-xs font-semibold text-amber-600 dark:text-amber-400">
              <span>Sign In as Admin</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 2: Faculty Tutor */}
          <div
            onClick={() => handleSelectRole('tutor')}
            className={`group p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
              activeRole === 'tutor'
                ? 'bg-blue-500/10 border-blue-500 ring-2 ring-blue-500/30'
                : 'bg-slate-50 dark:bg-[#151522] border-slate-200 dark:border-white/5 hover:border-blue-400 dark:hover:border-blue-500/50'
            }`}
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 mb-3">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Tutor ({teacher.name.split(' ')[0]})</h3>
                {activeRole === 'tutor' && (
                  <CheckCircle2 className="w-4 h-4 text-blue-500" />
                )}
              </div>
              <p className="text-[11px] text-slate-500 dark:text-gray-400 mt-1.5 leading-relaxed">
                Conducts classes, logs in/out, check-in, check-out with attendance, marks late arrival, and reschedules.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-200/60 dark:border-white/5 flex items-center justify-between text-xs font-semibold text-blue-600 dark:text-blue-400">
              <span>Sign In as Tutor</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 3: Parent & Student */}
          <div
            onClick={() => handleSelectRole('parent', 'stud-3')}
            className={`group p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
              activeRole === 'parent'
                ? 'bg-emerald-500/10 border-emerald-500 ring-2 ring-emerald-500/30'
                : 'bg-slate-50 dark:bg-[#151522] border-slate-200 dark:border-white/5 hover:border-emerald-400 dark:hover:border-emerald-500/50'
            }`}
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 mb-3">
                <Users className="w-5 h-5" />
              </div>
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Parent / Student</h3>
                {activeRole === 'parent' && (
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                )}
              </div>
              <p className="text-[11px] text-slate-500 dark:text-gray-400 mt-1.5 leading-relaxed">
                Marcus Vance (Parent of Aria). Receives tutor login/logout alerts, live in-session timers, and approves reschedules.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-200/60 dark:border-white/5 flex items-center justify-between text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              <span>Sign In as Parent</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>

        {/* Footer info strip */}
        <div className="mt-5 p-3 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-between text-xs text-slate-600 dark:text-gray-300">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Real-time cross-persona sync is actively running across all 3 portals.</span>
          </div>
          <button
            onClick={() => setRoleGatewayModalOpen(false)}
            className="text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline cursor-pointer"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};
