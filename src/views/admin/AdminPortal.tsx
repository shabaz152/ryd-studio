import React, { useState, useEffect } from 'react';
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
  Trash2,
  Gift,
  Edit2,
  ArrowRight,
  Coins,
  Sparkles,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ActivityEvent, UserRole, AuthorizedUser, ReferralProgressStage, ReferredCandidate, TeacherDayPayout } from '../../types';
import { TutorLocationMap } from '../../components/admin/TutorLocationMap';
import { sound } from '../../utils/sound';

const getEventDate = (event: ActivityEvent): string => {
  if (event.date) return event.date;
  if (event.createdAt) return event.createdAt.split('T')[0];
  if (event.id && event.id.startsWith('act-')) {
    const parts = event.id.split('-');
    if (parts.length >= 2) {
      const ts = parseInt(parts[1], 10);
      if (!isNaN(ts) && ts > 1000000000000) {
        return new Date(ts).toISOString().split('T')[0];
      }
    }
  }
  return new Date().toISOString().split('T')[0];
};

const todayStr = new Date().toISOString().split('T')[0];
const yesterdayStr = new Date(Date.now() - 86400000).toISOString().split('T')[0];

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
    deleteUser,
    setAccountSecurityModalOpen,
    currentUser,
    referralStats,
    updateCandidateStage,
    addCandidateReferral,
    disburseDayPayout,
    updateAdminProfileName,
    accessRequests,
    pendingAccessRequestsCount,
    grantAccessRequest,
    declineAccessRequest,
    deleteAccessRequest,
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'activity' | 'map' | 'access' | 'tutors' | 'students' | 'schedules' | 'referrals'>('activity');
  const [filterType, setFilterType] = useState<string>('all');
  const [accessFilterRole, setAccessFilterRole] = useState<string>('all');
  const [accessSearch, setAccessSearch] = useState<string>('');
  const [isAuthorizeModalOpen, setIsAuthorizeModalOpen] = useState<boolean>(false);
  const [confirmDeleteUser, setConfirmDeleteUser] = useState<AuthorizedUser | null>(null);
  const [newUserName, setNewUserName] = useState<string>('');
  const [newUserEmail, setNewUserEmail] = useState<string>('');
  const [newUserRole, setNewUserRole] = useState<UserRole>('tutor');
  const [newUserPassword, setNewUserPassword] = useState<string>('ryd2026');
  const [authorizeError, setAuthorizeError] = useState<string | null>(null);

  // Access Requests Inbound Gate State
  const [accessReqStatusFilter, setAccessReqStatusFilter] = useState<'pending' | 'approved' | 'declined' | 'all'>('pending');
  const [grantSuccessNotice, setGrantSuccessNotice] = useState<string | null>(null);

  // Admin Profile Name Inline Editing State
  const [isEditingAdminName, setIsEditingAdminName] = useState<boolean>(false);
  const [adminNameInput, setAdminNameInput] = useState<string>(currentUser?.name || 'Center Director');
  const [adminNameError, setAdminNameError] = useState<string | null>(null);

  // Teacher Referrals & Day Payouts Subtab State
  const [referralSubView, setReferralSubView] = useState<'pipeline' | 'payouts'>('pipeline');
  const [referralStageFilter, setReferralStageFilter] = useState<string>('all');
  const [referralSearch, setReferralSearch] = useState<string>('');
  const [isAddReferralModalOpen, setIsAddReferralModalOpen] = useState<boolean>(false);
  const [refCandidateName, setRefCandidateName] = useState<string>('');
  const [refCandidateEmail, setRefCandidateEmail] = useState<string>('');
  const [refCandidatePhone, setRefCandidatePhone] = useState<string>('');
  const [refCandidateSpecialty, setRefCandidateSpecialty] = useState<string>('Pure Mathematics & AP Calculus');
  const [refReferringTeacherId, setRefReferringTeacherId] = useState<string>(tutors[0]?.id || 'tutor-shazz');
  const [refNotes, setRefNotes] = useState<string>('');
  const [refModalError, setRefModalError] = useState<string | null>(null);

  // Date Filter State (defaults to current day)
  const [auditDate, setAuditDate] = useState<string>(todayStr);
  const [isDateFilterActive, setIsDateFilterActive] = useState<boolean>(true);

  // Filtered activity events (filtered by category and selected date)
  const filteredEvents = activityEvents.filter((ev) => {
    if (filterType === 'all') {
      // no category filter
    } else if (filterType === 'auth') {
      if (!(ev.type === 'login' || ev.type === 'logout')) return false;
    } else if (filterType === 'sessions') {
      if (!(ev.type === 'check_in' || ev.type === 'check_out')) return false;
    } else if (filterType === 'delays') {
      if (ev.type !== 'running_late') return false;
    } else if (filterType === 'reschedule') {
      if (ev.type !== 'reschedule') return false;
    }

    // Filter to current day or searched date
    if (isDateFilterActive && auditDate) {
      const evDate = getEventDate(ev);
      if (evDate !== auditDate) return false;
    }

    return true;
  });

  // Activity Event Visible Limit / Show More State (for expanding check-ins & checkouts)
  const [visibleEventCount, setVisibleEventCount] = useState<number>(5);

  useEffect(() => {
    setVisibleEventCount(5);
  }, [filterType, auditDate, isDateFilterActive]);

  const displayedEvents = filteredEvents.slice(0, visibleEventCount);

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

  const handleSaveAdminName = (e: React.FormEvent) => {
    e.preventDefault();
    setAdminNameError(null);
    const trimmed = adminNameInput.trim();
    if (!trimmed || trimmed.length < 2) {
      setAdminNameError('Profile name must be at least 2 characters long.');
      sound.playAlert();
      return;
    }
    const res = updateAdminProfileName(trimmed);
    if (res.success) {
      setIsEditingAdminName(false);
      sound.playSuccess();
    } else {
      setAdminNameError(res.error || 'Failed to update admin profile name.');
      sound.playAlert();
    }
  };

  const handleAddReferralSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRefModalError(null);
    if (!refCandidateName.trim()) {
      setRefModalError('Candidate name is required.');
      return;
    }

    const referringTutor = tutors.find((t) => t.id === refReferringTeacherId) || tutors[0];

    addCandidateReferral({
      candidateName: refCandidateName.trim(),
      email: refCandidateEmail.trim() || 'candidate@faculty.ryd.studio',
      phone: refCandidatePhone.trim() || '+91 98000 12345',
      specialty: refCandidateSpecialty,
      referringTeacherId: referringTutor?.id,
      referringTeacherName: referringTutor?.name,
      notes: refNotes.trim() || undefined,
    });

    setRefCandidateName('');
    setRefCandidateEmail('');
    setRefCandidatePhone('');
    setRefNotes('');
    setIsAddReferralModalOpen(false);
  };

  const allCandidates: ReferredCandidate[] = referralStats.candidates || [];
  const allDayPayouts: TeacherDayPayout[] = referralStats.dayPayouts || [];

  const getStageMeta = (stage: ReferralProgressStage) => {
    switch (stage) {
      case 'referred':
      case 'starting_referral':
        return {
          key: 'referred',
          label: 'Referred',
          step: 1,
          color: 'bg-blue-500/10 text-blue-500 border-blue-500/30',
          badgeText: '1. Referred',
          nextLabel: 'Advance to Interviewed',
          nextStage: 'interviewed' as ReferralProgressStage,
        };
      case 'interviewed':
      case 'interview':
        return {
          key: 'interviewed',
          label: 'Interviewed',
          step: 2,
          color: 'bg-amber-500/10 text-amber-500 border-amber-500/30',
          badgeText: '2. Interviewed',
          nextLabel: 'Advance to Selected Successfully',
          nextStage: 'selected_successfully' as ReferralProgressStage,
        };
      case 'selected_successfully':
      case 'selected':
      case 'successfully_joined':
      default:
        return {
          key: 'selected_successfully',
          label: 'Selected Successfully',
          step: 3,
          color: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30',
          badgeText: '3. Selected Successfully',
          nextLabel: null,
          nextStage: null,
        };
    }
  };

  const filteredReferrals = allCandidates.filter((c) => {
    const matchesStage =
      referralStageFilter === 'all' ||
      c.stage === referralStageFilter ||
      (referralStageFilter === 'referred' && c.stage === 'starting_referral') ||
      (referralStageFilter === 'interviewed' && c.stage === 'interview') ||
      (referralStageFilter === 'selected_successfully' && (c.stage === 'selected' || c.stage === 'successfully_joined'));
    const matchesSearch =
      referralSearch === '' ||
      c.candidateName.toLowerCase().includes(referralSearch.toLowerCase()) ||
      (c.specialty && c.specialty.toLowerCase().includes(referralSearch.toLowerCase())) ||
      (c.referringTeacherName && c.referringTeacherName.toLowerCase().includes(referralSearch.toLowerCase()));
    return matchesStage && matchesSearch;
  });

  const totalPayoutsAmount = allDayPayouts.reduce((sum, p) => sum + (p.amountINR || 2500), 0);
  const disbursedPayoutsAmount = allDayPayouts
    .filter((p) => p.status === 'paid')
    .reduce((sum, p) => sum + (p.amountINR || 2500), 0);
  const pendingPayoutsAmount = allDayPayouts
    .filter((p) => p.status === 'pending')
    .reduce((sum, p) => sum + (p.amountINR || 2500), 0);

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

      {/* Admin Executive Profile Card with Direct Profile Name Editing & Change Password */}
      <div className="rounded-2xl p-4 sm:p-5 bg-white dark:bg-[#10101A] border border-slate-200 dark:border-white/10 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5 min-w-0 flex-1">
          <div className="w-12 h-12 rounded-2xl bg-amber-500 text-black font-black flex items-center justify-center text-xl shadow-md shrink-0">
            👑
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              {isEditingAdminName ? (
                <form onSubmit={handleSaveAdminName} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={adminNameInput}
                    onChange={(e) => setAdminNameInput(e.target.value)}
                    placeholder="Enter Director Profile Name"
                    autoFocus
                    className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-black/60 border border-amber-500 text-xs font-bold text-slate-900 dark:text-white focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="px-3 py-1.5 rounded-xl bg-amber-500 text-black text-xs font-black hover:bg-amber-400 cursor-pointer shadow-sm"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditingAdminName(false);
                      setAdminNameInput(currentUser?.name || 'Center Director');
                      setAdminNameError(null);
                    }}
                    className="px-2.5 py-1.5 rounded-xl bg-slate-200 dark:bg-white/10 text-xs font-semibold text-slate-600 dark:text-gray-300 hover:bg-slate-300 cursor-pointer"
                  >
                    Cancel
                  </button>
                </form>
              ) : (
                <div className="flex items-center gap-2">
                  <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white truncate">
                    {currentUser?.name || 'Center Director (App Owner)'}
                  </h3>
                  <button
                    onClick={() => {
                      sound.playClick();
                      setAdminNameInput(currentUser?.name || 'Center Director');
                      setIsEditingAdminName(true);
                    }}
                    className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-white/10 text-slate-400 hover:text-amber-500 transition-colors cursor-pointer"
                    title="Edit Admin Profile Name"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
              <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-amber-500/15 text-amber-500 border border-amber-500/30 uppercase tracking-wider">
                Administrator Profile
              </span>
            </div>
            {adminNameError && (
              <p className="text-[11px] text-red-500 font-medium mt-1">{adminNameError}</p>
            )}
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
          title="Click to change your personal login email, password and profile credentials"
        >
          <KeyRound className="w-4 h-4" />
          <span>Change Password & Credentials</span>
        </button>
      </div>

      {/* Pending Access Requests Attention Banner (when not on access tab) */}
      {pendingAccessRequestsCount > 0 && activeSubTab !== 'access' && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md animate-fadeIn">
          <div className="flex items-start sm:items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-500 flex items-center justify-center shrink-0">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-600 dark:text-amber-400">
                  Action Required
                </span>
                <p className="text-xs font-black text-slate-900 dark:text-white">
                  {pendingAccessRequestsCount} Inbound Access Request{pendingAccessRequestsCount > 1 ? 's' : ''} Awaiting Admin Agreement
                </p>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-gray-400 mt-0.5">
                New Tutors or Parents have submitted credentials to log in. Per platform policy, users cannot log in until you explicitly agree and grant access.
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              sound.playClick();
              setActiveSubTab('access');
              setAccessReqStatusFilter('pending');
            }}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-black shrink-0 transition-all cursor-pointer shadow-md flex items-center gap-1.5 self-end sm:self-center"
          >
            <span>Review & Grant Access</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Portal Subtabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 dark:border-white/10 pb-3">
        <div className="flex items-center gap-2 flex-wrap">
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
            onClick={() => setActiveSubTab('referrals')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeSubTab === 'referrals'
                ? 'bg-amber-500 text-black shadow-md shadow-amber-500/20'
                : 'bg-white dark:bg-[#151522] text-slate-600 dark:text-gray-300 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-white/5'
            }`}
          >
            <Gift className="w-4 h-4 text-amber-500" />
            <span>🤝 Teacher Referrals & Day Payouts ({referralStats.candidates.length})</span>
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
            <span>🗺️ Live GPS Radar & Google Map</span>
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
            {pendingAccessRequestsCount > 0 && (
              <span className="px-1.5 py-0.5 rounded-full bg-red-500 text-white text-[10px] font-black animate-pulse">
                {pendingAccessRequestsCount} pending
              </span>
            )}
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
              <p className="text-xs font-semibold text-slate-500 dark:text-gray-400">Total Users</p>
              <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">{authorizedUsers.length}</p>
            </div>
            <div className="p-4 rounded-2xl bg-white dark:bg-[#10101A] border border-slate-200 dark:border-white/10">
              <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">Active Granted</p>
              <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
                {authorizedUsers.filter((u) => u.isAuthorized).length}
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-white dark:bg-[#10101A] border border-slate-200 dark:border-white/10">
              <p className="text-xs font-semibold text-red-600 dark:text-red-400">Revoked / Inactive</p>
              <p className="text-2xl font-black text-red-600 dark:text-red-400 mt-1">
                {authorizedUsers.filter((u) => !u.isAuthorized).length}
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-white dark:bg-[#10101A] border border-slate-200 dark:border-white/10">
              <p className="text-xs font-semibold text-blue-600 dark:text-blue-400">Faculty & Parents</p>
              <p className="text-2xl font-black text-blue-600 dark:text-blue-400 mt-1">
                {authorizedUsers.filter((u) => u.role !== 'admin').length}
              </p>
            </div>
          </div>

          {/* Section: Inbound Access Requests & Approvals Gate */}
          <div className="p-5 rounded-3xl bg-gradient-to-b from-white to-slate-50/50 dark:from-[#131320] dark:to-[#0E0E18] border border-amber-500/30 shadow-lg space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-500 flex items-center justify-center shrink-0 border border-amber-500/30">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-black text-slate-900 dark:text-white">
                      Inbound Access Requests & Approvals
                    </h3>
                    {pendingAccessRequestsCount > 0 && (
                      <span className="px-2 py-0.5 rounded-full bg-amber-500 text-black text-[10px] font-black animate-pulse">
                        {pendingAccessRequestsCount} Pending Action
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-gray-400 mt-0.5">
                    When new Tutors or Parents submit login credentials, they cannot log in until you explicitly agree and grant access.
                  </p>
                </div>
              </div>

              {/* Status Filter Chips */}
              <div className="flex items-center gap-1.5 overflow-x-auto">
                {[
                  { key: 'pending', label: `Pending (${accessRequests.filter(r => r.status === 'pending').length})` },
                  { key: 'approved', label: `Approved (${accessRequests.filter(r => r.status === 'approved').length})` },
                  { key: 'declined', label: `Declined (${accessRequests.filter(r => r.status === 'declined').length})` },
                  { key: 'all', label: `All (${accessRequests.length})` },
                ].map((item) => (
                  <button
                    key={item.key}
                    onClick={() => {
                      sound.playClick();
                      setAccessReqStatusFilter(item.key as any);
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                      accessReqStatusFilter === item.key
                        ? 'bg-amber-500 text-black shadow-xs font-black'
                        : 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-gray-300 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Grant Success Notice Banner */}
            {grantSuccessNotice && (
              <div className="p-3.5 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-700 dark:text-emerald-300 text-xs flex items-center justify-between gap-3 animate-fadeIn">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-500" />
                  <span className="font-semibold">{grantSuccessNotice}</span>
                </div>
                <button
                  onClick={() => setGrantSuccessNotice(null)}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Request Cards List */}
            {accessRequests.filter(r => accessReqStatusFilter === 'all' ? true : r.status === accessReqStatusFilter).length === 0 ? (
              <div className="p-8 text-center rounded-2xl bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/5">
                <Shield className="w-8 h-8 text-slate-400 mx-auto mb-2 opacity-50" />
                <p className="text-xs font-bold text-slate-600 dark:text-slate-400">
                  No {accessReqStatusFilter === 'all' ? '' : accessReqStatusFilter} access requests found.
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  When new Tutors or Parents attempt to log in or submit a request, their credentials will appear here for your agreement.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {accessRequests
                  .filter(r => accessReqStatusFilter === 'all' ? true : r.status === accessReqStatusFilter)
                  .map((req) => (
                    <div
                      key={req.id}
                      className={`p-4 rounded-2xl border transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-4 ${
                        req.status === 'pending'
                          ? 'bg-amber-500/5 dark:bg-amber-500/10 border-amber-500/30 ring-1 ring-amber-500/20'
                          : req.status === 'approved'
                          ? 'bg-white dark:bg-[#10101A] border-slate-200 dark:border-white/10'
                          : 'bg-red-500/5 dark:bg-red-500/10 border-red-500/20 opacity-80'
                      }`}
                    >
                      {/* Left: Applicant Details */}
                      <div className="flex items-start sm:items-center gap-3.5 min-w-0">
                        <div
                          className={`w-11 h-11 rounded-2xl flex items-center justify-center font-black text-sm shrink-0 border ${
                            req.role === 'tutor'
                              ? 'bg-blue-500/20 text-blue-500 border-blue-500/30'
                              : 'bg-emerald-500/20 text-emerald-500 border-emerald-500/30'
                          }`}
                        >
                          {req.role === 'tutor' ? <GraduationCap className="w-5 h-5" /> : <Users className="w-5 h-5" />}
                        </div>
                        <div className="min-w-0 space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="text-xs font-black text-slate-900 dark:text-white truncate">
                              {req.name}
                            </h4>
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider border ${
                                req.role === 'tutor'
                                  ? 'bg-blue-500/15 text-blue-500 border-blue-500/30'
                                  : 'bg-emerald-500/15 text-emerald-500 border-emerald-500/30'
                              }`}
                            >
                              {req.role === 'tutor' ? 'Faculty Tutor' : 'Parent & Family'}
                            </span>
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                                req.status === 'pending'
                                  ? 'bg-amber-500/20 text-amber-600 dark:text-amber-400 border-amber-500/30 animate-pulse'
                                  : req.status === 'approved'
                                  ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
                                  : 'bg-red-500/20 text-red-600 dark:text-red-400 border-red-500/30'
                              }`}
                            >
                              {req.status === 'pending'
                                ? '⏳ Pending Admin Agreement'
                                : req.status === 'approved'
                                ? '✅ Access Granted & Active'
                                : '❌ Declined'}
                            </span>
                          </div>

                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-slate-500 dark:text-gray-400">
                            <span className="flex items-center gap-1 font-medium text-slate-700 dark:text-slate-300">
                              <Mail className="w-3.5 h-3.5 text-slate-400" />
                              <span>{req.email}</span>
                            </span>
                            {req.phone && (
                              <span className="flex items-center gap-1">
                                <Phone className="w-3.5 h-3.5 text-slate-400" />
                                <span>{req.phone}</span>
                              </span>
                            )}
                            <span className="flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5 text-slate-400" />
                              <span>Requested: {req.requestedAt}</span>
                            </span>
                            <span className="flex items-center gap-1 text-slate-400 italic">
                              <Lock className="w-3.5 h-3.5 text-amber-500" />
                              <span>Password set by user</span>
                            </span>
                          </div>

                          {req.notes && (
                            <p className="text-[11px] text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-black/30 px-2.5 py-1 rounded-lg border border-slate-200/50 dark:border-white/5 inline-block mt-0.5">
                              💬 <span className="font-semibold">Note:</span> {req.notes}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Right: Explicit Agreement Actions */}
                      <div className="flex items-center gap-2 shrink-0 self-end lg:self-center">
                        {req.status === 'pending' && (
                          <>
                            <button
                              onClick={() => {
                                sound.playSuccess();
                                const res = grantAccessRequest(req.id);
                                if (res.success) {
                                  setGrantSuccessNotice(
                                    `✅ Agreed & Granted: ${req.name} (${req.email}) has been authorized as ${req.role.toUpperCase()}! They can now log in with their credentials.`
                                  );
                                }
                              }}
                              className="px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white text-xs font-black transition-all cursor-pointer shadow-md shadow-emerald-500/20 flex items-center gap-1.5"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>Agree & Grant Access</span>
                            </button>

                            <button
                              onClick={() => {
                                sound.playClick();
                                declineAccessRequest(req.id);
                              }}
                              className="px-3 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 border border-red-500/30 text-xs font-bold transition-all cursor-pointer"
                            >
                              <X className="w-3.5 h-3.5" />
                              <span>Decline</span>
                            </button>
                          </>
                        )}

                        {req.status === 'declined' && (
                          <>
                            <button
                              onClick={() => {
                                sound.playSuccess();
                                const res = grantAccessRequest(req.id);
                                if (res.success) {
                                  setGrantSuccessNotice(
                                    `✅ Reconsidered & Granted: ${req.name} (${req.email}) has been authorized!`
                                  );
                                }
                              }}
                              className="px-3 py-1.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/30 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>Re-Authorize</span>
                            </button>

                            <button
                              onClick={() => {
                                sound.playClick();
                                deleteAccessRequest(req.id);
                              }}
                              className="p-1.5 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-500/10 transition-colors cursor-pointer"
                              title="Delete request record"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </>
                        )}

                        {req.status === 'approved' && (
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Granted by {req.reviewedBy || 'Admin'}</span>
                            </span>
                            <button
                              onClick={() => {
                                sound.playClick();
                                deleteAccessRequest(req.id);
                              }}
                              className="p-1.5 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-500/10 transition-colors cursor-pointer"
                              title="Clear record"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            )}
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
              {['all', 'admin', 'tutor', 'parent', 'revoked'].map((roleKey) => (
                <button
                  key={roleKey}
                  onClick={() => setAccessFilterRole(roleKey)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all cursor-pointer ${
                    accessFilterRole === roleKey
                      ? 'bg-amber-500 text-black shadow-xs'
                      : 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-gray-300 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {roleKey === 'all'
                    ? 'All Roles'
                    : roleKey === 'revoked'
                    ? `Revoked (${authorizedUsers.filter((u) => !u.isAuthorized).length})`
                    : roleKey}
                </button>
              ))}
            </div>
          </div>

          {/* User Cards / Table */}
          <div className="space-y-2.5">
            {authorizedUsers
              .filter((u) => {
                if (accessFilterRole === 'revoked') {
                  if (u.isAuthorized) return false;
                } else if (accessFilterRole !== 'all' && u.role !== accessFilterRole) {
                  return false;
                }
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
                        <div className="flex items-center gap-2">
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

                          {!user.isAuthorized && (
                            <button
                              onClick={() => setConfirmDeleteUser(user)}
                              className="px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer bg-red-600/10 hover:bg-red-600 text-red-600 dark:text-red-400 hover:text-white dark:hover:text-white border border-red-500/30 flex items-center gap-1.5 shadow-xs"
                              title={`Permanently delete ${user.name}`}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Delete</span>
                            </button>
                          )}
                        </div>
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

          {/* Delete Revoked User Confirmation Modal */}
          {confirmDeleteUser && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
              <div className="relative w-full max-w-md bg-white dark:bg-[#0E0E18] border border-red-500/30 rounded-2xl p-6 shadow-2xl space-y-4 text-slate-900 dark:text-white">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-white/10">
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-xl bg-red-500/15 border border-red-500/30 flex items-center justify-center text-red-500">
                      <Trash2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white">Delete Revoked User</h3>
                      <p className="text-[11px] text-slate-500 dark:text-gray-400">Permanently purge this account</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setConfirmDeleteUser(null)}
                    className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-3">
                  <img
                    src={confirmDeleteUser.avatarUrl}
                    alt={confirmDeleteUser.name}
                    className="w-11 h-11 rounded-xl object-cover border border-red-500/30 shrink-0"
                  />
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-slate-900 dark:text-white truncate">
                        {confirmDeleteUser.name}
                      </span>
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-red-500/20 text-red-500 border border-red-500/30">
                        {confirmDeleteUser.role}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-gray-300 truncate mt-0.5">
                      {confirmDeleteUser.email} • {confirmDeleteUser.title}
                    </p>
                  </div>
                </div>

                <p className="text-xs text-slate-600 dark:text-gray-300 leading-relaxed">
                  Are you sure you want to permanently delete this revoked user? Their login credentials and profile will be completely erased from the platform. This action cannot be undone.
                </p>

                <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100 dark:border-white/10">
                  <button
                    type="button"
                    onClick={() => setConfirmDeleteUser(null)}
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-gray-300 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      deleteUser(confirmDeleteUser.id);
                      setConfirmDeleteUser(null);
                    }}
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-red-600 hover:bg-red-500 text-white transition-colors cursor-pointer flex items-center gap-1.5 shadow-md shadow-red-600/20"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Delete User Permanently</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Subtab 1: Live Activity Stream */}
      {activeSubTab === 'activity' && (
        <div className="space-y-4">
          {/* Audit Date Search & Range Bar */}
          <div className="p-3.5 rounded-2xl bg-white dark:bg-[#10101A] border border-slate-200 dark:border-white/10 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1.5 text-xs font-black text-slate-800 dark:text-white uppercase tracking-wider">
                <Calendar className="w-4 h-4 text-amber-500" />
                <span>Audit Date:</span>
              </div>
              <div className="relative">
                <input
                  type="date"
                  value={isDateFilterActive ? auditDate : ''}
                  onChange={(e) => {
                    if (e.target.value) {
                      sound.playClick();
                      setAuditDate(e.target.value);
                      setIsDateFilterActive(true);
                    }
                  }}
                  className="px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-950/80 border border-slate-300 dark:border-white/15 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-amber-400 cursor-pointer"
                />
              </div>
              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  setAuditDate(todayStr);
                  setIsDateFilterActive(true);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isDateFilterActive && auditDate === todayStr
                    ? 'bg-amber-500 text-black shadow-xs font-black'
                    : 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-gray-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Today
              </button>
              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  setAuditDate(yesterdayStr);
                  setIsDateFilterActive(true);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isDateFilterActive && auditDate === yesterdayStr
                    ? 'bg-amber-500 text-black shadow-xs font-black'
                    : 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-gray-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Yesterday
              </button>
              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  setIsDateFilterActive(false);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  !isDateFilterActive
                    ? 'bg-amber-500 text-black shadow-xs font-black'
                    : 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-gray-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                All Dates History
              </button>
            </div>

            <div className="flex items-center gap-2 self-start md:self-center">
              <span className="px-3 py-1 rounded-full text-[11px] font-black bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                {isDateFilterActive
                  ? auditDate === todayStr
                    ? `📅 Today (${filteredEvents.length} records)`
                    : `📅 Date: ${auditDate} (${filteredEvents.length} records)`
                  : `📅 All Dates History (${filteredEvents.length} records)`}
              </span>
            </div>
          </div>

          {/* Filters Bar */}
          <div className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-xl bg-white dark:bg-[#10101A] border border-slate-200 dark:border-white/10 shadow-xs">
            <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-gray-400 font-semibold">
              <Filter className="w-3.5 h-3.5" />
              <span>Event Type:</span>
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
              <div className="p-8 text-center bg-white dark:bg-[#10101A] border border-slate-200 dark:border-white/10 rounded-2xl text-slate-500 dark:text-gray-400 space-y-3">
                <Calendar className="w-8 h-8 mx-auto opacity-40 text-amber-500" />
                <div>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">
                    {isDateFilterActive
                      ? `No activity or login/logout records found for ${auditDate === todayStr ? 'Today' : auditDate}.`
                      : 'No activity events found in this category.'}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-gray-400 mt-1">
                    {isDateFilterActive
                      ? 'You can pick or type another date to search past logins and logouts, or return to Today.'
                      : 'Activities from tutors (logging in, checking in, late notices) will appear here live.'}
                  </p>
                </div>
                {isDateFilterActive && auditDate !== todayStr && (
                  <div className="flex items-center justify-center gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        sound.playClick();
                        setAuditDate(todayStr);
                        setIsDateFilterActive(true);
                      }}
                      className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold transition-colors cursor-pointer shadow-sm"
                    >
                      View Today's Logins & Logouts
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        sound.playClick();
                        setIsDateFilterActive(false);
                      }}
                      className="px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/15 text-xs font-bold transition-colors cursor-pointer text-slate-700 dark:text-white"
                    >
                      View All Dates
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                {displayedEvents.map((event) => {
                  const eventDate = getEventDate(event);
                  const isToday = eventDate === todayStr;

                  return (
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

                      <div className="flex flex-col sm:items-end gap-1 text-xs text-slate-400 shrink-0 self-end sm:self-center">
                        <div className="flex items-center gap-1.5 font-mono font-bold text-slate-700 dark:text-slate-300">
                          <Clock className="w-3.5 h-3.5 text-amber-500" />
                          <span>{event.timestamp}</span>
                        </div>
                        <span className="text-[10px] font-semibold text-slate-500">
                          {isToday ? 'Today' : eventDate}
                        </span>
                      </div>
                    </div>
                  );
                })}

                {/* Show More & Expand Bar for Check-ins, Check-outs & Logins */}
                {filteredEvents.length > 5 && (
                  <div className="pt-3 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-200 dark:border-white/10">
                    <div className="text-xs text-slate-500 dark:text-gray-400 font-medium">
                      Showing <strong className="text-slate-900 dark:text-white font-bold">{displayedEvents.length}</strong> of{' '}
                      <strong className="text-slate-900 dark:text-white font-bold">{filteredEvents.length}</strong> live check-in, check-out & shift events
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      {displayedEvents.length < filteredEvents.length && (
                        <button
                          type="button"
                          onClick={() => {
                            sound.playClick();
                            setVisibleEventCount((prev) => Math.min(prev + 5, filteredEvents.length));
                          }}
                          className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-black transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
                        >
                          <span>⬇️ Show More Check-Ins & Checkouts (+5)</span>
                        </button>
                      )}

                      {displayedEvents.length < filteredEvents.length && (
                        <button
                          type="button"
                          onClick={() => {
                            sound.playClick();
                            setVisibleEventCount(filteredEvents.length);
                          }}
                          className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/15 text-xs font-bold text-slate-700 dark:text-white transition-all cursor-pointer"
                        >
                          <span>Show All ({filteredEvents.length})</span>
                        </button>
                      )}

                      {visibleEventCount > 5 && (
                        <button
                          type="button"
                          onClick={() => {
                            sound.playClick();
                            setVisibleEventCount(5);
                          }}
                          className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/15 text-xs font-bold text-slate-700 dark:text-white transition-all cursor-pointer"
                        >
                          <span>⬆️ Show Less (Collapse)</span>
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </>
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

      {/* Subtab: Teacher Referrals & Day Payouts */}
      {activeSubTab === 'referrals' && (
        <div className="space-y-6">
          {/* Header & Sub-View Switcher */}
          <div className="rounded-2xl p-5 sm:p-6 bg-white dark:bg-[#10101A] border border-slate-200 dark:border-white/10 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="p-2 rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/20">
                    <Gift className="w-5 h-5" />
                  </span>
                  <div>
                    <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                      Teacher Referrals & Particular Teacher Day Payouts
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-gray-400">
                      Manage teacher-referred applicants through <strong>Referred ➔ Interviewed ➔ Selected Successfully</strong>, and disburse referral day payouts.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                {/* Sub-view switcher */}
                <div className="inline-flex p-1 rounded-2xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10">
                  <button
                    onClick={() => {
                      sound.playClick();
                      setReferralSubView('pipeline');
                    }}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      referralSubView === 'pipeline'
                        ? 'bg-amber-500 text-black shadow-md'
                        : 'text-slate-600 dark:text-gray-300 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    📋 Referral Pipeline
                  </button>
                  <button
                    onClick={() => {
                      sound.playClick();
                      setReferralSubView('payouts');
                    }}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      referralSubView === 'payouts'
                        ? 'bg-amber-500 text-black shadow-md'
                        : 'text-slate-600 dark:text-gray-300 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    💸 Teacher Day Payouts
                    {allDayPayouts.filter((p) => p.status === 'pending').length > 0 && (
                      <span className="ml-1.5 px-1.5 py-0.2 rounded-full bg-amber-600 text-white text-[10px] font-black">
                        {allDayPayouts.filter((p) => p.status === 'pending').length}
                      </span>
                    )}
                  </button>
                </div>

                <button
                  onClick={() => {
                    sound.playClick();
                    setIsAddReferralModalOpen(true);
                  }}
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-black shadow-md shadow-amber-500/20 transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>+ Refer Candidate</span>
                </button>
              </div>
            </div>

            {/* Quick KPI Overview */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-slate-100 dark:border-white/5">
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200/60 dark:border-white/5">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Candidates</span>
                <p className="text-xl font-black text-slate-900 dark:text-white mt-0.5">{allCandidates.length}</p>
                <span className="text-[10px] text-slate-500">Across 3 Stages</span>
              </div>
              <div className="p-3.5 rounded-xl bg-blue-500/5 border border-blue-500/20">
                <span className="text-[10px] font-bold text-blue-500 uppercase tracking-wider">1. Referred</span>
                <p className="text-xl font-black text-blue-500 mt-0.5">
                  {allCandidates.filter((c) => c.stage === 'referred' || c.stage === 'starting_referral').length}
                </p>
                <span className="text-[10px] text-blue-400/80">Application Stage</span>
              </div>
              <div className="p-3.5 rounded-xl bg-amber-500/5 border border-amber-500/20">
                <span className="text-[10px] font-bold text-amber-500 uppercase tracking-wider">2. Interviewed</span>
                <p className="text-xl font-black text-amber-500 mt-0.5">
                  {allCandidates.filter((c) => c.stage === 'interviewed' || c.stage === 'interview').length}
                </p>
                <span className="text-[10px] text-amber-500/80">Demonstration Stage</span>
              </div>
              <div className="p-3.5 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
                <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider">3. Selected Successfully</span>
                <p className="text-xl font-black text-emerald-500 mt-0.5">
                  {allCandidates.filter((c) => c.stage === 'selected_successfully' || c.stage === 'selected' || c.stage === 'successfully_joined').length}
                </p>
                <span className="text-[10px] text-emerald-400/80">₹2,500 Bonus Triggered</span>
              </div>
            </div>
          </div>

          {/* VIEW 1: Referral Pipeline */}
          {referralSubView === 'pipeline' && (
            <div className="space-y-4">
              {/* Filter & Search Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-[#10101A] p-4 rounded-2xl border border-slate-200 dark:border-white/10">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <button
                    onClick={() => {
                      sound.playClick();
                      setReferralStageFilter('all');
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      referralStageFilter === 'all'
                        ? 'bg-amber-500 text-black shadow-xs'
                        : 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-gray-300 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    All Candidates ({allCandidates.length})
                  </button>
                  <button
                    onClick={() => {
                      sound.playClick();
                      setReferralStageFilter('referred');
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      referralStageFilter === 'referred'
                        ? 'bg-blue-500 text-white shadow-xs'
                        : 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-gray-300 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    1. Referred ({allCandidates.filter((c) => c.stage === 'referred' || c.stage === 'starting_referral').length})
                  </button>
                  <button
                    onClick={() => {
                      sound.playClick();
                      setReferralStageFilter('interviewed');
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      referralStageFilter === 'interviewed'
                        ? 'bg-amber-500 text-black shadow-xs'
                        : 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-gray-300 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    2. Interviewed ({allCandidates.filter((c) => c.stage === 'interviewed' || c.stage === 'interview').length})
                  </button>
                  <button
                    onClick={() => {
                      sound.playClick();
                      setReferralStageFilter('selected_successfully');
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      referralStageFilter === 'selected_successfully'
                        ? 'bg-emerald-500 text-white shadow-xs'
                        : 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-gray-300 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    3. Selected Successfully ({allCandidates.filter((c) => c.stage === 'selected_successfully' || c.stage === 'selected' || c.stage === 'successfully_joined').length})
                  </button>
                </div>

                <div className="relative min-w-[220px]">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
                  <input
                    type="text"
                    value={referralSearch}
                    onChange={(e) => setReferralSearch(e.target.value)}
                    placeholder="Search candidate or teacher..."
                    className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Candidates Grid */}
              <div className="space-y-4">
                {filteredReferrals.length === 0 ? (
                  <div className="p-8 text-center rounded-2xl bg-white dark:bg-[#10101A] border border-slate-200 dark:border-white/10">
                    <Gift className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                    <p className="text-sm font-bold text-slate-700 dark:text-gray-300">No candidates found.</p>
                    <p className="text-xs text-slate-400 mt-1">Try changing filters or add a new candidate referral.</p>
                  </div>
                ) : (
                  filteredReferrals.map((cand) => {
                    const meta = getStageMeta(cand.stage);
                    const matchingPayout = allDayPayouts.find((p) => p.candidateId === cand.id);
                    const isPayoutPaid = cand.payoutStatus === 'paid' || matchingPayout?.status === 'paid';

                    return (
                      <div
                        key={cand.id}
                        className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#10101A] border border-slate-200 dark:border-white/10 shadow-xs space-y-4"
                      >
                        {/* Candidate Card Header */}
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                          <div>
                            <div className="flex items-center gap-2.5 flex-wrap">
                              <h3 className="text-base font-black text-slate-900 dark:text-white">
                                {cand.candidateName}
                              </h3>
                              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black border uppercase tracking-wider ${meta.color}`}>
                                {meta.badgeText}
                              </span>
                              <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-gray-300">
                                {cand.specialty}
                              </span>
                            </div>

                            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-gray-400 mt-1.5">
                              <span className="flex items-center gap-1 font-semibold text-amber-600 dark:text-amber-400">
                                🤝 Referring Teacher: <strong>{cand.referringTeacherName || 'Shazz (Lead Faculty)'}</strong>
                              </span>
                              <span>•</span>
                              <span className="flex items-center gap-1">
                                <Mail className="w-3.5 h-3.5 text-slate-400" />
                                {cand.email}
                              </span>
                              <span>•</span>
                              <span className="flex items-center gap-1">
                                <Phone className="w-3.5 h-3.5 text-slate-400" />
                                {cand.phone}
                              </span>
                              <span>•</span>
                              <span>Referred on {cand.dateReferred}</span>
                            </div>
                          </div>

                          {/* Top Advance Button */}
                          {meta.nextStage && (
                            <button
                              onClick={() => {
                                sound.playClick();
                                updateCandidateStage(cand.id, meta.nextStage!);
                              }}
                              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-black shadow-md shadow-amber-500/20 transition-all cursor-pointer flex items-center gap-1.5 shrink-0"
                            >
                              <span>{meta.nextLabel}</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>

                        {/* 3-Stage Interactive Stepper */}
                        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-black/30 border border-slate-200/80 dark:border-white/5 space-y-2">
                          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                            Hiring Pipeline Stepper (Click to update candidate stage):
                          </p>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                            {/* Step 1: Referred */}
                            <button
                              type="button"
                              onClick={() => {
                                sound.playClick();
                                updateCandidateStage(cand.id, 'referred');
                              }}
                              className={`p-3 rounded-xl text-left border transition-all cursor-pointer ${
                                meta.step === 1
                                  ? 'bg-blue-500/10 border-blue-500 text-blue-600 dark:text-blue-400 shadow-xs'
                                  : meta.step > 1
                                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400'
                                  : 'bg-white dark:bg-white/[0.02] border-slate-200 dark:border-white/5 text-slate-500'
                              }`}
                            >
                              <div className="flex items-center justify-between text-[11px] font-black mb-1">
                                <span>Step 1: Referred</span>
                                <span>{meta.step > 1 ? '✓ Complete' : meta.step === 1 ? '● In Progress' : 'Pending'}</span>
                              </div>
                              <p className="text-[11px] text-slate-500 dark:text-gray-400 line-clamp-1">
                                Candidate submitted via faculty referral link
                              </p>
                            </button>

                            {/* Step 2: Interviewed */}
                            <button
                              type="button"
                              onClick={() => {
                                sound.playClick();
                                updateCandidateStage(cand.id, 'interviewed');
                              }}
                              className={`p-3 rounded-xl text-left border transition-all cursor-pointer ${
                                meta.step === 2
                                  ? 'bg-amber-500/10 border-amber-500 text-amber-600 dark:text-amber-400 shadow-xs'
                                  : meta.step > 2
                                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400'
                                  : 'bg-white dark:bg-white/[0.02] border-slate-200 dark:border-white/5 text-slate-500'
                              }`}
                            >
                              <div className="flex items-center justify-between text-[11px] font-black mb-1">
                                <span>Step 2: Interviewed</span>
                                <span>{meta.step > 2 ? '✓ Complete' : meta.step === 2 ? '● In Progress' : 'Pending'}</span>
                              </div>
                              <p className="text-[11px] text-slate-500 dark:text-gray-400 line-clamp-1">
                                Teaching demonstration & Director interview
                              </p>
                            </button>

                            {/* Step 3: Selected Successfully */}
                            <button
                              type="button"
                              onClick={() => {
                                sound.playClick();
                                updateCandidateStage(cand.id, 'selected_successfully');
                              }}
                              className={`p-3 rounded-xl text-left border transition-all cursor-pointer ${
                                meta.step === 3
                                  ? 'bg-emerald-500/15 border-emerald-500 text-emerald-600 dark:text-emerald-400 shadow-xs'
                                  : 'bg-white dark:bg-white/[0.02] border-slate-200 dark:border-white/5 text-slate-500'
                              }`}
                            >
                              <div className="flex items-center justify-between text-[11px] font-black mb-1">
                                <span>Step 3: Selected Successfully</span>
                                <span>{meta.step === 3 ? '✓ Complete' : 'Pending'}</span>
                              </div>
                              <p className="text-[11px] text-slate-500 dark:text-gray-400 line-clamp-1">
                                Onboarded • ₹2,500 Day Payout awarded
                              </p>
                            </button>
                          </div>
                        </div>

                        {/* Particular Teacher Day Payout Banner (for selected candidate) */}
                        {meta.step === 3 && (
                          <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div className="flex items-center gap-2.5">
                              <span className="p-1.5 rounded-lg bg-amber-500 text-black font-black text-xs">
                                ₹
                              </span>
                              <div>
                                <p className="text-xs font-bold text-slate-900 dark:text-white">
                                  Referral Day Payout: <strong>₹2,500 INR</strong> to {cand.referringTeacherName || 'Referring Teacher'}
                                </p>
                                <p className="text-[11px] text-slate-500 dark:text-gray-400">
                                  {isPayoutPaid
                                    ? `Payout Disbursed on ${cand.payoutDate || '2026-09-13'}`
                                    : 'Awaiting admin day payout disbursal to teacher'}
                                </p>
                              </div>
                            </div>

                            {isPayoutPaid ? (
                              <span className="px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 text-xs font-black flex items-center gap-1.5 shrink-0">
                                <CheckCircle2 className="w-4 h-4" />
                                <span>Day Payout Disbursed</span>
                              </span>
                            ) : (
                              <button
                                onClick={() => {
                                  sound.playClick();
                                  disburseDayPayout(matchingPayout?.id || cand.id);
                                }}
                                className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-black shadow-md shadow-emerald-500/20 transition-all cursor-pointer flex items-center gap-1.5 shrink-0"
                              >
                                <Coins className="w-4 h-4" />
                                <span>💸 Disburse ₹2,500 Day Payout</span>
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {/* VIEW 2: Particular Teacher Day Payouts Ledger */}
          {referralSubView === 'payouts' && (
            <div className="space-y-6">
              {/* Financial Metrics Summary */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-5 rounded-2xl bg-white dark:bg-[#10101A] border border-slate-200 dark:border-white/10 shadow-xs">
                  <div className="flex items-center justify-between text-xs text-slate-400 font-bold">
                    <span>Total Referral Bonuses</span>
                    <Coins className="w-4 h-4 text-amber-500" />
                  </div>
                  <p className="text-2xl font-black text-amber-500 mt-2">
                    ₹{totalPayoutsAmount.toLocaleString()}
                  </p>
                  <span className="text-[11px] text-slate-500">Earned across all teacher referrals</span>
                </div>

                <div className="p-5 rounded-2xl bg-white dark:bg-[#10101A] border border-slate-200 dark:border-white/10 shadow-xs">
                  <div className="flex items-center justify-between text-xs text-slate-400 font-bold">
                    <span>Disbursed Day Payouts</span>
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  </div>
                  <p className="text-2xl font-black text-emerald-500 mt-2">
                    ₹{disbursedPayoutsAmount.toLocaleString()}
                  </p>
                  <span className="text-[11px] text-slate-500">Paid out to referring teachers</span>
                </div>

                <div className="p-5 rounded-2xl bg-white dark:bg-[#10101A] border border-slate-200 dark:border-white/10 shadow-xs">
                  <div className="flex items-center justify-between text-xs text-slate-400 font-bold">
                    <span>Pending Day Payouts</span>
                    <Clock className="w-4 h-4 text-amber-500" />
                  </div>
                  <p className="text-2xl font-black text-amber-500 mt-2">
                    ₹{pendingPayoutsAmount.toLocaleString()}
                  </p>
                  <span className="text-[11px] text-slate-500">Pending approval / disbursal</span>
                </div>
              </div>

              {/* Particular Teacher Breakdown Cards */}
              <div className="space-y-4">
                <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <Users className="w-4 h-4 text-amber-500" />
                  <span>Teacher-by-Teacher Referral & Day Payout Breakdown</span>
                </h3>

                {tutors.map((tutor) => {
                  // All referrals for this particular teacher
                  const teacherCandidates = allCandidates.filter(
                    (c) =>
                      c.referringTeacherId === tutor.id ||
                      (c.referringTeacherName && c.referringTeacherName.toLowerCase().includes(tutor.name.toLowerCase().split(' ')[0]))
                  );
                  const teacherPayouts = allDayPayouts.filter(
                    (p) =>
                      p.teacherId === tutor.id ||
                      (p.teacherName && p.teacherName.toLowerCase().includes(tutor.name.toLowerCase().split(' ')[0]))
                  );

                  const teacherTotalEarned = teacherPayouts.reduce((sum, p) => sum + (p.amountINR || 2500), 0);
                  const teacherDisbursed = teacherPayouts
                    .filter((p) => p.status === 'paid')
                    .reduce((sum, p) => sum + (p.amountINR || 2500), 0);
                  const teacherPending = teacherPayouts
                    .filter((p) => p.status === 'pending')
                    .reduce((sum, p) => sum + (p.amountINR || 2500), 0);

                  return (
                    <div
                      key={tutor.id}
                      className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#10101A] border border-slate-200 dark:border-white/10 shadow-xs space-y-4"
                    >
                      {/* Teacher Card Header */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-white/5 pb-4">
                        <div className="flex items-center gap-3.5 min-w-0">
                          {tutor.avatarUrl ? (
                            <img
                              src={tutor.avatarUrl}
                              alt={tutor.name}
                              className="w-12 h-12 rounded-2xl object-cover border border-amber-500/30 shrink-0"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 font-black flex items-center justify-center text-base border border-amber-500/30 shrink-0">
                              {tutor.name.charAt(0)}
                            </div>
                          )}
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <h4 className="text-base font-black text-slate-900 dark:text-white">
                                {tutor.name}
                              </h4>
                              <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-500/15 text-amber-500 border border-amber-500/30">
                                {tutor.subjects?.join(', ') || 'Academic Faculty'}
                              </span>
                            </div>
                            <p className="text-xs text-slate-500 dark:text-gray-400 mt-0.5">
                              {tutor.email} • {teacherCandidates.length} Total Candidate Referrals
                            </p>
                          </div>
                        </div>

                        {/* Teacher Financial Summary Pills */}
                        <div className="flex items-center gap-2.5 flex-wrap">
                          <div className="px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200/60 dark:border-white/5 text-right">
                            <span className="text-[10px] text-slate-400 block font-semibold uppercase">Earned</span>
                            <span className="text-sm font-black text-amber-500">₹{teacherTotalEarned.toLocaleString()}</span>
                          </div>
                          <div className="px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-right">
                            <span className="text-[10px] text-emerald-500 block font-semibold uppercase">Disbursed</span>
                            <span className="text-sm font-black text-emerald-500">₹{teacherDisbursed.toLocaleString()}</span>
                          </div>
                          <div className="px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-right">
                            <span className="text-[10px] text-amber-500 block font-semibold uppercase">Pending</span>
                            <span className="text-sm font-black text-amber-500">₹{teacherPending.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>

                      {/* Candidate Ledger for this Teacher */}
                      <div>
                        <p className="text-xs font-bold text-slate-700 dark:text-gray-300 mb-2">
                          Referred Candidates & Day Payout Records:
                        </p>
                        {teacherCandidates.length === 0 && teacherPayouts.length === 0 ? (
                          <p className="text-xs text-slate-400 italic py-2">
                            No candidate referrals on record for this teacher yet.
                          </p>
                        ) : (
                          <div className="space-y-2">
                            {teacherCandidates.map((c) => {
                              const meta = getStageMeta(c.stage);
                              const matchingPayout = teacherPayouts.find((p) => p.candidateId === c.id);
                              const isPaid = c.payoutStatus === 'paid' || matchingPayout?.status === 'paid';

                              return (
                                <div
                                  key={c.id}
                                  className="p-3 rounded-xl bg-slate-50 dark:bg-black/30 border border-slate-200/60 dark:border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                                >
                                  <div>
                                    <div className="flex items-center gap-2 flex-wrap">
                                      <span className="font-bold text-slate-900 dark:text-white">
                                        {c.candidateName}
                                      </span>
                                      <span className={`px-2 py-0.2 rounded-full text-[10px] font-bold border ${meta.color}`}>
                                        {meta.badgeText}
                                      </span>
                                      <span className="text-slate-400 text-[11px] font-mono">
                                        Ref: {c.dateReferred}
                                      </span>
                                    </div>
                                    <p className="text-[11px] text-slate-500 dark:text-gray-400 mt-0.5">
                                      {c.specialty} • {c.email}
                                    </p>
                                  </div>

                                  <div className="flex items-center gap-3 shrink-0">
                                    <div className="text-right">
                                      <span className="font-black text-amber-500 block">
                                        ₹2,500 INR
                                      </span>
                                      <span className="text-[10px] text-slate-400">Day Payout</span>
                                    </div>

                                    {isPaid ? (
                                      <span className="px-3 py-1 rounded-xl bg-emerald-500/20 text-emerald-500 border border-emerald-500/30 text-[11px] font-black flex items-center gap-1">
                                        <CheckCircle2 className="w-3.5 h-3.5" />
                                        <span>Paid</span>
                                      </span>
                                    ) : (
                                      <button
                                        onClick={() => {
                                          sound.playClick();
                                          disburseDayPayout(matchingPayout?.id || c.id);
                                        }}
                                        className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-black shadow-xs cursor-pointer flex items-center gap-1"
                                      >
                                        <Coins className="w-3.5 h-3.5" />
                                        <span>Disburse</span>
                                      </button>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Add Referral Candidate Modal */}
      {isAddReferralModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-lg bg-white dark:bg-[#0E0E18] border border-slate-200 dark:border-white/10 rounded-3xl p-6 shadow-2xl space-y-4 text-slate-900 dark:text-white">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-white/10">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900 dark:text-white">
                    Refer New Faculty Candidate
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-gray-400">
                    Candidate will enter <strong>1. Referred</strong> stage and credit day payout to selected teacher
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAddReferralModalOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {refModalError && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 text-xs font-semibold">
                {refModalError}
              </div>
            )}

            <form onSubmit={handleAddReferralSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-gray-300 mb-1">
                  Candidate Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={refCandidateName}
                  onChange={(e) => setRefCandidateName(e.target.value)}
                  placeholder="e.g. Dr. Sunita Rao"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-black/40 border border-slate-300 dark:border-white/10 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-gray-300 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={refCandidateEmail}
                    onChange={(e) => setRefCandidateEmail(e.target.value)}
                    placeholder="candidate@faculty.ryd.studio"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-black/40 border border-slate-300 dark:border-white/10 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-gray-300 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={refCandidatePhone}
                    onChange={(e) => setRefCandidatePhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-black/40 border border-slate-300 dark:border-white/10 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-gray-300 mb-1">
                  Subject Specialty / Department
                </label>
                <select
                  value={refCandidateSpecialty}
                  onChange={(e) => setRefCandidateSpecialty(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-black/40 border border-slate-300 dark:border-white/10 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:border-amber-400 cursor-pointer"
                >
                  <option value="Pure Mathematics & AP Calculus">Pure Mathematics & AP Calculus</option>
                  <option value="Quantum Physics & Mechanics">Quantum Physics & Mechanics</option>
                  <option value="Organic Chemistry & Biochemistry">Organic Chemistry & Biochemistry</option>
                  <option value="Computer Science & AI Algorithmic Lab">Computer Science & AI Algorithmic Lab</option>
                  <option value="Advanced Statistics & Data Analytics">Advanced Statistics & Data Analytics</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-gray-300 mb-1">
                  Attributed Referring Teacher (For ₹2,500 Day Payout)
                </label>
                <select
                  value={refReferringTeacherId}
                  onChange={(e) => setRefReferringTeacherId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-black/40 border border-slate-300 dark:border-white/10 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:border-amber-400 cursor-pointer"
                >
                  {tutors.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name} ({t.subjects?.join(', ') || 'Academic Faculty'})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-gray-300 mb-1">
                  Notes / Academic Credentials
                </label>
                <textarea
                  rows={2}
                  value={refNotes}
                  onChange={(e) => setRefNotes(e.target.value)}
                  placeholder="Notes on teaching experience, degrees, or recommendations..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-black/40 border border-slate-300 dark:border-white/10 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddReferralModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-300 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 text-xs font-bold transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-black shadow-lg shadow-amber-500/20 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Submit Candidate Referral</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
