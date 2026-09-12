import React, { useState } from 'react';
import {
  Shield,
  Activity,
  Users,
  GraduationCap,
  Calendar,
  Clock,
  CheckCircle2,
  AlertTriangle,
  FileText,
  DollarSign,
  Phone,
  Mail,
  Filter,
  Check,
  Radio,
  MapPin,
  KeyRound,
  UserPlus,
  Lock,
  UserCheck,
  UserX,
  Search,
  X,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ActivityEvent, UserRole } from '../../types';
import { TutorLocationMap } from '../../components/admin/TutorLocationMap';
import { sound } from '../../utils/sound';

export const AdminPortal: React.FC = () => {
  const {
    tutors,
    parents,
    batches,
    sessions,
    activityEvents,
    unreadAdminActivityCount,
    markActivityReadByAdmin,
    tutorOnlineStatus,
    teacher,
    loginTutor,
    logoutTutor,
    rewardsINR,
    authorizedUsers,
    authorizeNewUser,
    toggleUserAuthorization,
    setAccountSecurityModalOpen,
    currentUser,
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'activity' | 'map' | 'access' | 'tutors' | 'students' | 'schedules'>('activity');
  const [filterType, setFilterType] = useState<string>('all');
  const [accessFilterRole, setAccessFilterRole] = useState<string>('all');
  const [accessSearch, setAccessSearch] = useState<string>('');
  const [isAuthorizeModalOpen, setIsAuthorizeModalOpen] = useState<boolean>(false);
  const [newUserName, setNewUserName] = useState<string>('');
  const [newUserEmail, setNewUserEmail] = useState<string>('');
  const [newUserRole, setNewUserRole] = useState<UserRole>('tutor');
  const [newUserPassword, setNewUserPassword] = useState<string>('ryd2026');
  const [authorizeError, setAuthorizeError] = useState<string | null>(null);

  // Filtered activity events
  const filteredEvents = activityEvents.filter((ev) => {
    if (filterType === 'all') return true;
    if (filterType === 'auth') return ev.type === 'login' || ev.type === 'logout';
    if (filterType === 'sessions') return ev.type === 'check_in' || ev.type === 'check_out';
    if (filterType === 'delays') return ev.type === 'running_late';
    if (filterType === 'reschedule') return ev.type === 'reschedule';
    return true;
  });

  const getEventIcon = (type: ActivityEvent['type']) => {
    switch (type) {
      case 'login':
        return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
      case 'logout':
        return <Clock className="w-4 h-4 text-slate-400" />;
      case 'check_in':
        return <Activity className="w-4 h-4 text-blue-500 animate-pulse" />;
      case 'check_out':
        return <Check className="w-4 h-4 text-emerald-500" />;
      case 'running_late':
        return <AlertTriangle className="w-4 h-4 text-amber-500 animate-bounce" />;
      case 'reschedule':
        return <Calendar className="w-4 h-4 text-purple-500" />;
      default:
        return <FileText className="w-4 h-4 text-amber-500" />;
    }
  };

  const getEventBadge = (type: ActivityEvent['type']) => {
    switch (type) {
      case 'login':
        return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20';
      case 'logout':
        return 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20';
      case 'check_in':
        return 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20';
      case 'check_out':
        return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20';
      case 'running_late':
        return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20';
      case 'reschedule':
        return 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20';
      default:
        return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20';
    }
  };

  const activeTutorsCount = tutors.filter((t) => t.status !== 'offline').length;
  const totalStudentsCount = batches.reduce((sum, b) => sum + b.students.length, 0);

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Top Banner: Admin Cockpit Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 border border-slate-800 p-5 sm:p-6 text-white shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-md bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[11px] font-black uppercase tracking-wider flex items-center gap-1">
                <Shield className="w-3.5 h-3.5" />
                <span>Executive Command Center</span>
              </span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                ● Live Real-Time Audit
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white mt-2">
              App Owner & Center Management
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
              Real-time triangular oversight connecting the Admin, Tutors, and Parents. Monitor live faculty activities, session check-ins, student attendance, and schedule updates.
            </p>
          </div>

          {/* Quick Shift Simulator controls */}
          <div className="flex items-center gap-2 bg-slate-950/80 p-2 rounded-xl border border-white/10 shrink-0">
            <span className="text-[11px] text-slate-400">Tutor {teacher.name.split(' ')[0]}:</span>
            {tutorOnlineStatus === 'offline' ? (
              <button
                onClick={loginTutor}
                className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
                title="Simulate Tutor logging in (dispatches alert to Admin & Parents)"
              >
                <Activity className="w-3.5 h-3.5" />
                <span>Simulate Login</span>
              </button>
            ) : (
              <button
                onClick={logoutTutor}
                className="px-3 py-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/30 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
                title="Simulate Tutor logging out (dispatches alert to Admin & Parents)"
              >
                <Clock className="w-3.5 h-3.5" />
                <span>Simulate Logout</span>
              </button>
            )}

            {/* Admin Self-Service Credentials Button */}
            <button
              onClick={() => setAccountSecurityModalOpen(true)}
              className="px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
              title="Update Admin Login Email & Password"
            >
              <KeyRound className="w-3.5 h-3.5 text-amber-400" />
              <span>My Credentials</span>
            </button>
          </div>
        </div>

        {/* Executive KPI Stats Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-6 pt-5 border-t border-white/10">
          <div className="bg-white/5 rounded-xl p-3 border border-white/5">
            <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
              <span>Active Tutors</span>
              <GraduationCap className="w-4 h-4 text-blue-400" />
            </div>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-xl sm:text-2xl font-black text-white">{activeTutorsCount}</span>
              <span className="text-[11px] text-slate-400">/ {tutors.length} Total</span>
            </div>
          </div>

          <div className="bg-white/5 rounded-xl p-3 border border-white/5">
            <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
              <span>Enrolled Students</span>
              <Users className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-xl sm:text-2xl font-black text-white">{totalStudentsCount}</span>
              <span className="text-[11px] text-slate-400">Across 4 Cohorts</span>
            </div>
          </div>

          <div className="bg-white/5 rounded-xl p-3 border border-white/5">
            <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
              <span>Active Cohorts</span>
              <Calendar className="w-4 h-4 text-purple-400" />
            </div>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-xl sm:text-2xl font-black text-white">{batches.length}</span>
              <span className="text-[11px] text-slate-400">STEM & Calculus</span>
            </div>
          </div>

          <div className="bg-white/5 rounded-xl p-3 border border-white/5">
            <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
              <span>Faculty Payouts</span>
              <DollarSign className="w-4 h-4 text-amber-400" />
            </div>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-xl sm:text-2xl font-black text-amber-400">₹{rewardsINR.toLocaleString()}</span>
              <span className="text-[11px] text-slate-400">INR</span>
            </div>
          </div>
        </div>
      </div>

      {/* Admin Executive Profile Card with Direct Change Password */}
      <div className="rounded-2xl p-4 sm:p-5 bg-white dark:bg-[#10101A] border border-slate-200 dark:border-white/10 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5 min-w-0">
          <div className="w-12 h-12 rounded-2xl bg-amber-500 text-black font-black flex items-center justify-center text-xl shadow-md shrink-0">
            👑
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white truncate">
                Center Director (App Owner)
              </h3>
              <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-amber-500/15 text-amber-500 border border-amber-500/30 uppercase tracking-wider">
                Administrator Profile
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-gray-400 truncate mt-0.5">
              Login Email: <strong className="text-slate-800 dark:text-slate-200">{currentUser?.email || 'admin@ryd.studio'}</strong> • Head of Platform & Center Director
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            sound.playClick();
            setAccountSecurityModalOpen(true);
          }}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:brightness-110 text-black text-xs font-black shadow-md shadow-amber-500/20 transition-all cursor-pointer flex items-center justify-center gap-2 shrink-0"
          title="Click to change your personal login email and password"
        >
          <KeyRound className="w-4 h-4" />
          <span>Change Password</span>
        </button>
      </div>

      {/* Portal Subtabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 dark:border-white/10 pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveSubTab('activity')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeSubTab === 'activity'
                ? 'bg-amber-500 text-black shadow-md shadow-amber-500/20'
                : 'bg-white dark:bg-[#151522] text-slate-600 dark:text-gray-300 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-white/5'
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>Live Activity Audit Stream</span>
            {unreadAdminActivityCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-red-500 text-white text-[10px] font-black">
                {unreadAdminActivityCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveSubTab('map')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeSubTab === 'map'
                ? 'bg-amber-500 text-black shadow-md shadow-amber-500/20'
                : 'bg-white dark:bg-[#151522] text-slate-600 dark:text-gray-300 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-white/5'
            }`}
          >
            <Radio className="w-4 h-4 text-amber-500" />
            <span>🗺️ Live Tutor GPS Map</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping shrink-0" />
          </button>

          <button
            onClick={() => setActiveSubTab('access')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeSubTab === 'access'
                ? 'bg-amber-500 text-black shadow-md shadow-amber-500/20'
                : 'bg-white dark:bg-[#151522] text-slate-600 dark:text-gray-300 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-white/5'
            }`}
          >
            <Shield className="w-4 h-4 text-amber-500" />
            <span>🔐 Access Control ({authorizedUsers.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('tutors')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeSubTab === 'tutors'
                ? 'bg-amber-500 text-black shadow-md shadow-amber-500/20'
                : 'bg-white dark:bg-[#151522] text-slate-600 dark:text-gray-300 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-white/5'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>Faculty Tutors ({tutors.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('students')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeSubTab === 'students'
                ? 'bg-amber-500 text-black shadow-md shadow-amber-500/20'
                : 'bg-white dark:bg-[#151522] text-slate-600 dark:text-gray-300 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-white/5'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Students & Parents ({parents.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('schedules')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeSubTab === 'schedules'
                ? 'bg-amber-500 text-black shadow-md shadow-amber-500/20'
                : 'bg-white dark:bg-[#151522] text-slate-600 dark:text-gray-300 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-white/5'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Master Cohort Schedules ({batches.length})</span>
          </button>
        </div>

        {activeSubTab === 'activity' && unreadAdminActivityCount > 0 && (
          <button
            onClick={markActivityReadByAdmin}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-500 hover:text-slate-900 dark:text-gray-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-colors cursor-pointer"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Mark all read</span>
          </button>
        )}
      </div>

      {/* Subtab 0: Live Tutor GPS Radar Map */}
      {activeSubTab === 'map' && <TutorLocationMap />}

      {/* Subtab 0.5: Access Control & Authorized Accounts */}
      {activeSubTab === 'access' && (
        <div className="space-y-5 animate-fadeIn">
          {/* Header Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white dark:bg-[#10101A] border border-slate-200 dark:border-white/10 shadow-xs">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-md bg-amber-500/20 text-amber-600 dark:text-amber-400 text-[11px] font-black uppercase tracking-wider">
                  Admin Authorization Gate
                </span>
                <span className="text-xs text-slate-400 font-semibold">Strict Role Isolation</span>
              </div>
              <h2 className="text-lg font-black text-slate-900 dark:text-white mt-1">
                Authorized Accounts & Security Access Control
              </h2>
              <p className="text-xs text-slate-500 dark:text-gray-400 max-w-xl mt-0.5">
                Only email addresses authorized by the Admin can log into the platform. Users can only update their own personal email/password from within their respective accounts.
              </p>
            </div>

            <button
              onClick={() => {
                setNewUserName('');
                setNewUserEmail('');
                setNewUserRole('tutor');
                setNewUserPassword('ryd2026');
                setAuthorizeError(null);
                setIsAuthorizeModalOpen(true);
              }}
              className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-black shadow-md shadow-amber-500/20 transition-all cursor-pointer flex items-center justify-center gap-2 shrink-0"
            >
              <UserPlus className="w-4 h-4" />
              <span>Authorize New User</span>
            </button>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-4 rounded-2xl bg-white dark:bg-[#10101A] border border-slate-200 dark:border-white/10">
              <p className="text-xs font-semibold text-slate-500 dark:text-gray-400">Total Authorized</p>
              <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">{authorizedUsers.length}</p>
            </div>
            <div className="p-4 rounded-2xl bg-white dark:bg-[#10101A] border border-slate-200 dark:border-white/10">
              <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">Active Granted</p>
              <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
                {authorizedUsers.filter((u) => u.isAuthorized).length}
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-white dark:bg-[#10101A] border border-slate-200 dark:border-white/10">
              <p className="text-xs font-semibold text-blue-600 dark:text-blue-400">Faculty Tutors</p>
              <p className="text-2xl font-black text-blue-600 dark:text-blue-400 mt-1">
                {authorizedUsers.filter((u) => u.role === 'tutor').length}
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-white dark:bg-[#10101A] border border-slate-200 dark:border-white/10">
              <p className="text-xs font-semibold text-purple-600 dark:text-purple-400">Parents & Students</p>
              <p className="text-2xl font-black text-purple-600 dark:text-purple-400 mt-1">
                {authorizedUsers.filter((u) => u.role === 'parent').length}
              </p>
            </div>
          </div>

          {/* Filters and Search Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-white dark:bg-[#10101A] border border-slate-200 dark:border-white/10">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
              <input
                type="text"
                value={accessSearch}
                onChange={(e) => setAccessSearch(e.target.value)}
                placeholder="Search authorized user by name or email..."
                className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-amber-400"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto">
              {['all', 'admin', 'tutor', 'parent'].map((roleKey) => (
                <button
                  key={roleKey}
                  onClick={() => setAccessFilterRole(roleKey)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all cursor-pointer ${
                    accessFilterRole === roleKey
                      ? 'bg-amber-500 text-black shadow-xs'
                      : 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-gray-300 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {roleKey === 'all' ? 'All Roles' : roleKey}
                </button>
              ))}
            </div>
          </div>

          {/* User Cards / Table */}
          <div className="space-y-2.5">
            {authorizedUsers
              .filter((u) => {
                if (accessFilterRole !== 'all' && u.role !== accessFilterRole) return false;
                if (accessSearch) {
                  const q = accessSearch.toLowerCase();
                  return u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
                }
                return true;
              })
              .map((user) => {
                const isRoot = user.id === 'user-admin' || user.email.toLowerCase() === 'admin@ryd.studio';

                return (
                  <div
                    key={user.id}
                    className="p-4 rounded-2xl bg-white dark:bg-[#10101A] border border-slate-200 dark:border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs hover:border-amber-400/40 transition-colors"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <img
                        src={user.avatarUrl}
                        alt={user.name}
                        className="w-10 h-10 rounded-xl object-cover border border-slate-200 dark:border-white/10 shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs font-black text-slate-900 dark:text-white truncate">
                            {user.name}
                          </h4>
                          <span
                            className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider border ${
                              user.role === 'admin'
                                ? 'bg-amber-500/15 text-amber-500 border-amber-500/30'
                                : user.role === 'tutor'
                                ? 'bg-blue-500/15 text-blue-500 border-blue-500/30'
                                : 'bg-emerald-500/15 text-emerald-500 border-emerald-500/30'
                            }`}
                          >
                            {user.role}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-gray-400 truncate mt-0.5">
                          {user.email} • {user.title}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[11px] font-bold flex items-center gap-1.5 ${
                          user.isAuthorized
                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                            : 'bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20'
                        }`}
                      >
                        {user.isAuthorized ? (
                          <>
                            <UserCheck className="w-3.5 h-3.5" />
                            <span>Authorized</span>
                          </>
                        ) : (
                          <>
                            <UserX className="w-3.5 h-3.5" />
                            <span>Revoked</span>
                          </>
                        )}
                      </span>

                      {isRoot ? (
                        <span className="text-[11px] text-amber-500 font-semibold italic px-2">
                          👑 Root Director
                        </span>
                      ) : (
                        <button
                          onClick={() => toggleUserAuthorization(user.id)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                            user.isAuthorized
                              ? 'bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 border border-red-500/20'
                              : 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                          }`}
                        >
                          {user.isAuthorized ? 'Revoke Access' : 'Re-Authorize'}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
          </div>

          {/* Authorize New User Modal */}
          {isAuthorizeModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
              <div className="relative w-full max-w-md bg-white dark:bg-[#0E0E18] border border-slate-200 dark:border-white/10 rounded-2xl p-6 shadow-2xl space-y-4 text-slate-900 dark:text-white">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-white/10">
                  <div className="flex items-center gap-2">
                    <UserPlus className="w-5 h-5 text-amber-500" />
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white">Authorize New Platform User</h3>
                      <p className="text-[11px] text-slate-500 dark:text-gray-400">Grant login access to faculty or parent</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsAuthorizeModalOpen(false)}
                    className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {authorizeError && (
                  <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-300 text-xs flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 shrink-0 text-red-500" />
                    <span>{authorizeError}</span>
                  </div>
                )}

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setAuthorizeError(null);
                    const res = authorizeNewUser({
                      name: newUserName,
                      email: newUserEmail,
                      role: newUserRole,
                      password: newUserPassword,
                    });
                    if (!res.success) {
                      setAuthorizeError(res.error || 'Failed to authorize user.');
                    } else {
                      setIsAuthorizeModalOpen(false);
                    }
                  }}
                  className="space-y-3.5"
                >
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={newUserName}
                      onChange={(e) => setNewUserName(e.target.value)}
                      placeholder="e.g. Dr. Sarah Jenkins"
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950/80 border border-slate-300 dark:border-white/10 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Authorized Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={newUserEmail}
                      onChange={(e) => setNewUserEmail(e.target.value)}
                      placeholder="e.g. s.jenkins@ryd.edu"
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950/80 border border-slate-300 dark:border-white/10 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Portal Access Role
                    </label>
                    <div className="grid grid-cols-3 gap-1.5">
                      {(['tutor', 'parent', 'admin'] as UserRole[]).map((r) => (
                        <button
                          key={r}
                          type="button"
                          onClick={() => setNewUserRole(r)}
                          className={`py-1.5 px-2 rounded-xl border text-xs font-bold capitalize transition-all cursor-pointer ${
                            newUserRole === r
                              ? 'bg-amber-500 text-black border-amber-500'
                              : 'border-slate-200 dark:border-white/10 text-slate-500'
                          }`}
                        >
                          {r}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Initial Temporary Password
                    </label>
                    <input
                      type="text"
                      required
                      value={newUserPassword}
                      onChange={(e) => setNewUserPassword(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950/80 border border-slate-300 dark:border-white/10 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-amber-400"
                    />
                    <p className="text-[10px] text-slate-400 mt-1">
                      User can change this password at any time via Account Security.
                    </p>
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsAuthorizeModalOpen(false)}
                      className="flex-1 py-2 rounded-xl border border-slate-300 dark:border-white/10 text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold shadow-md cursor-pointer"
                    >
                      Grant Access
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Subtab 1: Live Activity Stream */}
      {activeSubTab === 'activity' && (
        <div className="space-y-4">
          {/* Filters Bar */}
          <div className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-xl bg-white dark:bg-[#10101A] border border-slate-200 dark:border-white/10 shadow-xs">
            <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-gray-400 font-semibold">
              <Filter className="w-3.5 h-3.5" />
              <span>Filter Events:</span>
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
              {[
                { key: 'all', label: 'All Events' },
                { key: 'auth', label: 'Logins & Logouts' },
                { key: 'sessions', label: 'Check-Ins & Outs' },
                { key: 'delays', label: 'Delays / Running Late' },
                { key: 'reschedule', label: 'Reschedule Requests' },
              ].map((f) => (
                <button
                  key={f.key}
                  onClick={() => setFilterType(f.key)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                    filterType === f.key
                      ? 'bg-amber-500 text-black'
                      : 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-gray-300 hover:bg-slate-200 dark:hover:bg-white/10'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Activity Event Feed List */}
          <div className="space-y-2.5">
            {filteredEvents.length === 0 ? (
              <div className="p-8 text-center bg-white dark:bg-[#10101A] border border-slate-200 dark:border-white/10 rounded-2xl text-slate-500 dark:text-gray-400">
                <Activity className="w-8 h-8 mx-auto mb-2 opacity-40 text-amber-500" />
                <p className="text-sm font-semibold">No activity events found in this category.</p>
                <p className="text-xs mt-1">Activities from tutors (logging in, checking in, late notices) will appear here live.</p>
              </div>
            ) : (
              filteredEvents.map((event) => (
                <div
                  key={event.id}
                  className={`p-4 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                    !event.readByAdmin
                      ? 'bg-amber-500/[0.04] border-amber-500/30 dark:border-amber-500/30'
                      : 'bg-white dark:bg-[#10101A] border-slate-200 dark:border-white/5 hover:border-slate-300 dark:hover:border-white/10'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-xl bg-slate-100 dark:bg-white/5 shrink-0 mt-0.5">
                      {getEventIcon(event.type)}
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider border ${getEventBadge(event.type)}`}>
                          {event.type.replace('_', ' ')}
                        </span>
                        <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                          {event.title}
                        </h4>
                        {!event.readByAdmin && (
                          <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                        )}
                      </div>
                      <p className="text-xs text-slate-600 dark:text-gray-300 mt-1">
                        {event.description}
                      </p>
                      <div className="flex items-center gap-3 text-[11px] text-slate-400 dark:text-gray-500 mt-2">
                        <span>Actor: <strong className="text-slate-700 dark:text-gray-300">{event.actorName}</strong></span>
                        {event.targetBatchName && (
                          <>
                            <span>•</span>
                            <span>Cohort: <strong className="text-amber-600 dark:text-amber-400">{event.targetBatchName}</strong></span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-slate-400 shrink-0 self-end sm:self-center">
                    <Clock className="w-3.5 h-3.5" />
                    <span className="font-mono font-semibold">{event.timestamp}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Subtab 2: Faculty Tutors Oversight */}
      {activeSubTab === 'tutors' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {tutors.map((tutor) => {
            const isSelf = tutor.id === 'tutor-shazz';
            const status = isSelf ? tutorOnlineStatus : tutor.status;

            return (
              <div
                key={tutor.id}
                className="bg-white dark:bg-[#10101A] border border-slate-200 dark:border-white/10 rounded-2xl p-5 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={tutor.avatarUrl}
                        alt={tutor.name}
                        className="w-12 h-12 rounded-xl object-cover border-2 border-amber-400 shadow-xs shrink-0"
                      />
                      <div>
                        <h3 className="text-sm font-black text-slate-900 dark:text-white">{tutor.name}</h3>
                        <p className="text-[11px] text-slate-500 dark:text-gray-400">{tutor.email}</p>
                      </div>
                    </div>

                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider shrink-0 ${
                        status === 'online'
                          ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                          : status === 'in_session'
                          ? 'bg-blue-500/20 text-blue-600 dark:text-blue-400 border border-blue-500/30'
                          : status === 'running_late'
                          ? 'bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30 animate-pulse'
                          : 'bg-slate-500/20 text-slate-600 dark:text-slate-400 border border-slate-500/30'
                      }`}
                    >
                      ● {status.replace('_', ' ')}
                    </span>
                  </div>

                  <div className="mt-4 space-y-1.5 text-xs text-slate-600 dark:text-gray-300">
                    <p className="font-semibold text-slate-900 dark:text-white">Subjects:</p>
                    <div className="flex flex-wrap gap-1">
                      {tutor.subjects.map((sub, idx) => (
                        <span key={idx} className="px-2 py-0.5 rounded bg-slate-100 dark:bg-white/5 text-[10px] font-semibold text-slate-700 dark:text-gray-300">
                          {sub}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-slate-100 dark:border-white/5 text-center">
                    <div>
                      <p className="text-[10px] text-slate-400 uppercase font-bold">Rate</p>
                      <p className="text-xs font-black text-slate-900 dark:text-white mt-0.5">₹{tutor.hourlyRate}/h</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 uppercase font-bold">Hours</p>
                      <p className="text-xs font-black text-slate-900 dark:text-white mt-0.5">{isSelf ? teacher.totalHoursMonth : tutor.totalHoursMonth}h</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 uppercase font-bold">Earnings</p>
                      <p className="text-xs font-black text-amber-500 mt-0.5">₹{(isSelf ? rewardsINR : tutor.totalEarningsMonth).toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-white/5 flex items-center justify-between text-[11px] text-slate-500">
                  <span>Last shift log: {tutor.lastLoginTime ? `${tutor.lastLoginTime} (Logged In)` : 'Offline'}</span>
                  {isSelf && (
                    <button
                      onClick={status === 'online' ? logoutTutor : loginTutor}
                      className="text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline cursor-pointer"
                    >
                      {status === 'online' ? 'Force Logout' : 'Force Login'}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Subtab 3: Students & Parents Directory */}
      {activeSubTab === 'students' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {parents.map((parent) => (
            <div
              key={parent.id}
              className="bg-white dark:bg-[#10101A] border border-slate-200 dark:border-white/10 rounded-2xl p-5 shadow-xs"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-black text-slate-900 dark:text-white">{parent.parentName}</h3>
                  <p className="text-xs text-slate-500 dark:text-gray-400">Parent / Primary Contact</p>
                </div>
                <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  <Users className="w-4 h-4" />
                </div>
              </div>

              <div className="mt-3 space-y-1.5 text-xs text-slate-600 dark:text-gray-300">
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>{parent.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span>{parent.email}</span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-white/5">
                <p className="text-[11px] font-bold text-slate-400 uppercase">Enrolled Children:</p>
                <div className="mt-2 space-y-2">
                  {parent.children.map((child) => (
                    <div key={child.studentId} className="p-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200/60 dark:border-white/5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-900 dark:text-white">{child.studentName}</span>
                        <span className="text-[10px] font-semibold text-amber-600 dark:text-amber-400">{child.grade}</span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1">
                        Batches: {child.enrolledBatches.join(', ')}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Subtab 4: Master Cohort Schedules */}
      {activeSubTab === 'schedules' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {batches.map((batch) => (
            <div
              key={batch.id}
              className="bg-white dark:bg-[#10101A] border border-slate-200 dark:border-white/10 rounded-2xl p-5 shadow-xs"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-600 dark:text-amber-400 font-mono text-xs font-bold">
                      {batch.code}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">{batch.level}</span>
                  </div>
                  <h3 className="text-sm font-black text-slate-900 dark:text-white mt-1.5">{batch.name}</h3>
                  <p className="text-xs text-slate-500">{batch.style}</p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">{batch.scheduleTime}</span>
                  <p className="text-[10px] text-slate-400">{batch.days.join(', ')}</p>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-white/5 flex items-center justify-between text-xs text-slate-600 dark:text-gray-300">
                <span>Room: <strong className="text-slate-900 dark:text-white">{batch.studioRoom}</strong></span>
                <span>Enrolled: <strong className="text-amber-600 dark:text-amber-400">{batch.students.length} Students</strong></span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
