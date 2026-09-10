import React from 'react';
import { useApp } from '../context/AppContext';
import { QuickActionBar } from '../components/QuickActionBar';
import {
  Activity,
  Calendar,
  Clock,
  MapPin,
  ChevronRight,
  UserPlus,
  BookOpen,
  CalendarClock,
  Star,
  Share2,
  Navigation,
  Radio,
  CheckCircle2,
  Plus,
  Edit2,
  Check,
  X,
  Trash2,
  Footprints,
  MessageSquareText,
  LogOut,
} from 'lucide-react';
import { sound } from '../utils/sound';

export const HomeView: React.FC = () => {
  const {
    teacher,
    setTeacherName,
    sessions,
    batches,
    updates,
    leads,
    checkedInSession,
    isCheckedIn,
    showToast,
    setActiveTab,
    setCheckInModalOpen,
    setCheckOutModalOpen,
    openCheckOutForSession,
    openRescheduleForSession,
    deleteSession,
    clearAllSessions,
    openLeadModalWithType,
    setOrderWorkbookModalOpen,
    setNewSessionModalOpen,
    referralStats,
  } = useApp();

  const [isEditingName, setIsEditingName] = React.useState(false);
  const [tempName, setTempName] = React.useState(teacher.name);

  const todaySessions = sessions.filter((s) => s.date === '2026-09-10' || s.status === 'scheduled');
  const walkInsCount = leads.filter((l) => l.source === 'Walk-In' || l.leadType === 'walk_in').length;
  const enquiriesCount = leads.filter((l) => l.source !== 'Walk-In' || l.leadType === 'enquiry').length;

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* 1. Welcoming Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl glossy-card home-hero-banner p-6 sm:p-8 shadow-card-dark top-sheen">
        {/* Soft radial gold illumination */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#FFD000]/[0.05] rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full glossy-pill-yellow text-[#FFD000] text-[11px] font-bold uppercase tracking-wider">
              <Activity className="w-3.5 h-3.5" />
              <span>RYD STUDIO • Faculty Operations Console</span>
            </div>

            <div className="flex items-center gap-2 text-xs text-gray-400">
              <span>Shift Status:</span>
              <span className="flex items-center gap-1.5 text-emerald-400 font-bold bg-emerald-500/10 px-3 py-0.5 rounded-full border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                Active Shift
              </span>
            </div>
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight leading-tight">
                Hey{' '}
                {isEditingName ? (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (tempName.trim()) {
                        setTeacherName(tempName.trim());
                        setIsEditingName(false);
                      }
                    }}
                    className="inline-flex items-center gap-1.5 align-middle"
                  >
                    <input
                      type="text"
                      value={tempName}
                      onChange={(e) => setTempName(e.target.value)}
                      autoFocus
                      className="bg-[#12121A] border-2 border-[#FFD000] rounded-xl px-3 py-0.5 text-xl sm:text-2xl font-black text-[#FFD000] focus:outline-none shadow-gold-glow-sm"
                    />
                    <button
                      type="submit"
                      className="p-1.5 rounded-lg glossy-button-yellow text-black cursor-pointer shadow-sm"
                      title="Save Name"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setTempName(teacher.name);
                        setIsEditingName(false);
                      }}
                      className="p-1.5 rounded-lg bg-white/10 text-gray-400 hover:text-white cursor-pointer"
                      title="Cancel"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </form>
                ) : (
                  <span
                    onClick={() => {
                      sound.playClick();
                      setTempName(teacher.name);
                      setIsEditingName(true);
                    }}
                    className="text-[#FFD000] underline decoration-[#FFD000]/40 hover:decoration-[#FFD000] cursor-pointer inline-flex items-center gap-1.5 group"
                    title="Click to customize your name & referral link"
                  >
                    <span>{teacher.name}</span>
                    <Edit2 className="w-4 h-4 opacity-50 group-hover:opacity-100 text-[#FFD000] transition-opacity" />
                  </span>
                )}
                , welcome to <span className="text-white">RYD STUDIO</span>
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-gray-300 max-w-2xl leading-relaxed mt-1.5">
              High-contrast studio console. Log daily student attendance, dispatch immediate late notices, schedule dynamic makeups, and sync with calendar codes.
            </p>
          </div>

          {/* 4 Executive Metric Cards - Starting at 0 */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div className="p-4 rounded-2xl glossy-pill-dark">
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block mb-1">
                Total Month Hours
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black text-white">{teacher.totalHoursMonth.toFixed(1)}</span>
                <span className="text-xs text-[#FFD000] font-bold">hrs</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl glossy-pill-dark">
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block mb-1">
                Month Earnings
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black text-[#FFD000]">
                  ${teacher.totalEarningsMonth.toLocaleString()}
                </span>
                <span className="text-[10px] text-gray-400">USD</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl glossy-pill-dark">
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block mb-1">
                Faculty Rating
              </span>
              <div className="flex items-baseline gap-1.5">
                <Star className={`w-4 h-4 ${teacher.rating > 0 ? 'fill-[#FFD000] text-[#FFD000]' : 'text-gray-500'}`} />
                <span className="text-2xl font-black text-white">{teacher.rating.toFixed(2)}</span>
                <span className="text-[10px] text-gray-400">/ 5.0</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl glossy-pill-dark">
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block mb-1">
                Punctuality Score
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black text-emerald-400">
                  {teacher.classesCompletedThisWeek > 0 ? '100%' : '0%'}
                </span>
                <span className="text-[10px] text-gray-400">On Time</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main Action Dashboard: Check In, Check Out, Running Late */}
      <div>
        <div className="flex items-center justify-between mb-2.5">
          <h2 className="text-xs font-black text-gray-400 uppercase tracking-widest">
            Main Action Dashboard
          </h2>
          <span className="text-[11px] text-[#FFD000] font-semibold">One-Tap Workflows</span>
        </div>
        <QuickActionBar />
      </div>

      {/* 3. Today's Class Schedule & Live Roster */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2.5">
          <h2 className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5 text-[#FFD000]" />
            <span>Today's Studio Sessions & Schedule</span>
          </h2>

          <div className="flex items-center gap-2">
            {todaySessions.length > 0 && (
              <button
                onClick={() => {
                  if (window.confirm("Are you sure you want to delete all scheduled sessions for today?")) {
                    clearAllSessions();
                  }
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 text-xs font-bold transition-all cursor-pointer"
                title="Delete all sessions today"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Clear Sessions</span>
              </button>
            )}

            <button
              onClick={() => {
                sound.playClick();
                setNewSessionModalOpen(true);
              }}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl glossy-button-yellow text-xs font-black shadow-gold-glow-sm transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Schedule & Session</span>
            </button>

            <button
              onClick={() => {
                sound.playClick();
                setActiveTab('batches');
              }}
              className="text-xs font-bold text-[#FFD000] hover:underline flex items-center gap-1 cursor-pointer pl-1"
            >
              <span>View All Batches</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {todaySessions.length === 0 ? (
          <div className="p-8 rounded-3xl bg-[#101017] border border-white/10 text-center space-y-3 shadow-card-dark top-sheen">
            <div className="w-12 h-12 rounded-2xl bg-[#FFD000]/10 border border-[#FFD000]/20 text-[#FFD000] flex items-center justify-center mx-auto">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">No Studio Sessions Scheduled Today</h4>
              <p className="text-xs text-gray-400 mt-1">
                All class sessions for today have been removed or completed.
              </p>
            </div>
            <button
              onClick={() => {
                sound.playClick();
                setNewSessionModalOpen(true);
              }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl glossy-button-yellow text-xs font-black shadow-gold-glow-sm cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Add Schedule & Session</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {todaySessions.map((session) => {
              const batch = batches.find((b) => b.id === session.batchId);
              const isSessionActive = checkedInSession?.id === session.id;

              return (
                <div
                  key={session.id}
                  className={`p-5 rounded-3xl transition-all ${
                    isSessionActive
                      ? 'glossy-card border-[#FFD000]/60 shadow-gold-glow-sm'
                      : 'glossy-card glossy-card-hover'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] font-black uppercase px-2.5 py-0.5 rounded-full bg-[#FFD000] text-black font-mono">
                          {batch?.level || 'Master'}
                        </span>
                        <h3 className="text-sm font-bold text-white">{session.batchName}</h3>
                      </div>
                      <p className="text-xs text-gray-400 mt-1">
                        {batch?.style} • {batch?.students.length || 0} Dancers Enrolled
                      </p>
                    </div>

                    <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-xl bg-black/70 text-[#FFD000] border border-[#FFD000]/30 shrink-0">
                      Code: {session.calendarCode || '2:3'}
                    </span>
                  </div>

                  <div className="space-y-1.5 py-1 text-xs text-gray-300">
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-[#FFD000] shrink-0" />
                      <span className="font-semibold text-white">{session.timeSlot}</span>
                      <span className="text-gray-500">•</span>
                      <span className="text-gray-400">{session.durationMinutes} Minutes</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                      <span className="text-gray-300 truncate">{session.locationName}</span>
                      <span className="text-gray-500">•</span>
                      <span className="text-[#FFD000] font-semibold">{session.studioRoom}</span>
                    </div>
                  </div>

                  {/* Card Actions */}
                  <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      {isSessionActive || session.status === 'checked_in' ? (
                        <button
                          onClick={() => {
                            openCheckOutForSession(session);
                          }}
                          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black glossy-button-yellow shadow-gold-glow-sm transition-all cursor-pointer animate-pulse"
                        >
                          <LogOut className="w-3.5 h-3.5 text-black" />
                          <span>Check Out Now</span>
                        </button>
                      ) : session.status === 'completed' ? (
                        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-xs font-bold">
                          <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                          <span>
                            1:1 Paired {session.checkInTime && session.checkOutTime ? `(${session.checkInTime} → ${session.checkOutTime})` : `(${session.checkOutTime || 'Completed'})`}
                          </span>
                        </div>
                      ) : isCheckedIn ? (
                        <button
                          onClick={() => {
                            sound.playClick();
                            showToast({
                              type: 'alert',
                              title: '1:1 Check-In / Check-Out Rule',
                              description: `You must check out of "${checkedInSession?.batchName || 'your active class'}" before checking into another class.`,
                            });
                            if (checkedInSession) {
                              openCheckOutForSession(checkedInSession);
                            } else {
                              setCheckOutModalOpen(true);
                            }
                          }}
                          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer bg-amber-500/10 border border-amber-500/25 text-amber-500 hover:bg-amber-500/20"
                          title="Check out active class first to maintain 1:1 check-in and check-out pairing"
                        >
                          <span>Check In Locked</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            sound.playClick();
                            setCheckInModalOpen(true);
                          }}
                          className="px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer glossy-pill-dark hover:border-[#FFD000]/40 text-white"
                        >
                          Check In
                        </button>
                      )}
                      <button
                        onClick={() => {
                          sound.playClick();
                          openRescheduleForSession(session);
                        }}
                        className="px-3 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 dark:bg-[#14141E]/60 dark:hover:bg-[#1A1A26] dark:text-gray-300 dark:hover:text-white text-xs font-semibold dark:border-white/5 transition-all cursor-pointer shadow-xs"
                      >
                        Reschedule
                      </button>
                      <button
                        onClick={() => deleteSession(session.id)}
                        className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 transition-all cursor-pointer"
                        title="Delete this session"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {batch?.navigationUrl && (
                      <button
                        onClick={() => window.open(batch.navigationUrl, '_blank')}
                        className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-[#FFD000] transition-colors cursor-pointer"
                      >
                        <Navigation className="w-3.5 h-3.5 text-[#FFD000]" />
                        <span>Directions</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 4. Studio Hub & Quick Operations Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-black text-gray-400 uppercase tracking-widest">
            Studio Faculty Modules
          </h2>
          <div className="flex items-center gap-1.5 text-[11px] font-mono">
            <span className="px-2.5 py-0.5 rounded-full bg-[#181824] border border-white/10 text-gray-300">
              CRM Live: <strong className="text-[#FFD000]">{walkInsCount}</strong> Walk-Ins • <strong className="text-blue-400">{enquiriesCount}</strong> Enquiries
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {/* Quick Walk-In */}
          <div
            onClick={() => openLeadModalWithType('walk_in')}
            className="p-4 rounded-3xl glossy-card glossy-card-hover text-left cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-2xl bg-[#FFD000]/10 text-[#FFD000] border border-[#FFD000]/20 flex items-center justify-center mb-3">
              <Footprints className="w-5 h-5" />
            </div>
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold text-white group-hover:text-[#FFD000] transition-colors">
                Log Walk-In
              </p>
              <span className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded-full ${walkInsCount > 0 ? 'bg-[#FFD000] text-black' : 'bg-white/10 text-gray-400'}`}>
                {walkInsCount}
              </span>
            </div>
            <p className="text-[10px] text-gray-400 mt-0.5">Lobby & front desk</p>
          </div>

          {/* Quick Enquiry */}
          <div
            onClick={() => openLeadModalWithType('enquiry')}
            className="p-4 rounded-3xl glossy-card glossy-card-hover text-left cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-2xl bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center justify-center mb-3">
              <MessageSquareText className="w-5 h-5" />
            </div>
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold text-white group-hover:text-blue-400 transition-colors">
                Log Enquiry
              </p>
              <span className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded-full ${enquiriesCount > 0 ? 'bg-blue-500 text-white' : 'bg-white/10 text-gray-400'}`}>
                {enquiriesCount}
              </span>
            </div>
            <p className="text-[10px] text-gray-400 mt-0.5">Phone, Web, Social</p>
          </div>

          {/* Order Workbooks */}
          <div
            onClick={() => {
              sound.playClick();
              setOrderWorkbookModalOpen(true);
            }}
            className="p-4 rounded-3xl glossy-card glossy-card-hover text-left cursor-pointer"
          >
            <div className="w-10 h-10 rounded-2xl bg-[#FFD000]/10 text-[#FFD000] border border-[#FFD000]/20 flex items-center justify-center mb-3">
              <BookOpen className="w-5 h-5" />
            </div>
            <p className="text-xs font-bold text-white group-hover:text-[#FFD000] transition-colors">
              Order Workbooks
            </p>
            <p className="text-[10px] text-gray-400 mt-0.5">Syllabus & uniforms</p>
          </div>

          {/* Free Slots */}
          <div
            onClick={() => {
              sound.playClick();
              setActiveTab('freeslots');
            }}
            className="p-4 rounded-3xl glossy-card glossy-card-hover text-left cursor-pointer"
          >
            <div className="w-10 h-10 rounded-2xl bg-[#FFD000]/10 text-[#FFD000] border border-[#FFD000]/20 flex items-center justify-center mb-3">
              <CalendarClock className="w-5 h-5" />
            </div>
            <p className="text-xs font-bold text-white group-hover:text-[#FFD000] transition-colors">
              Free Slot Planner
            </p>
            <p className="text-[10px] text-gray-400 mt-0.5">Manage availability</p>
          </div>

          {/* Teacher Reviews */}
          <div
            onClick={() => {
              sound.playClick();
              setActiveTab('ratings');
            }}
            className="p-4 rounded-3xl glossy-card glossy-card-hover text-left cursor-pointer"
          >
            <div className="w-10 h-10 rounded-2xl bg-[#FFD000]/10 text-[#FFD000] border border-[#FFD000]/20 flex items-center justify-center mb-3">
              <Star className="w-5 h-5 fill-[#FFD000]" />
            </div>
            <p className="text-xs font-bold text-white group-hover:text-[#FFD000] transition-colors">
              Ratings & Feedback
            </p>
            <p className="text-[10px] text-gray-400 mt-0.5">
              {teacher.rating > 0 ? `${teacher.rating.toFixed(2)} Rating score` : '0.00 Rating score'}
            </p>
          </div>

          {/* Referral Program */}
          <div
            onClick={() => {
              sound.playClick();
              setActiveTab('referral');
            }}
            className="p-4 rounded-3xl glossy-card glossy-card-hover text-left cursor-pointer"
          >
            <div className="w-10 h-10 rounded-2xl bg-[#FFD000]/10 text-[#FFD000] border border-[#FFD000]/20 flex items-center justify-center mb-3">
              <Share2 className="w-5 h-5" />
            </div>
            <p className="text-xs font-bold text-white group-hover:text-[#FFD000] transition-colors">
              Refer a Teacher
            </p>
            <p className="text-[10px] text-gray-400 mt-0.5">
              {referralStats.bonusEarned > 0 ? `$${referralStats.bonusEarned} Bonus earned` : '$0 Bonus earned'}
            </p>
          </div>
        </div>
      </div>

      {/* 5. Recent Broadcasts & Messages Preview */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
            <Radio className="w-3.5 h-3.5 text-[#FFD000]" />
            <span>Recent Studio Updates Feed</span>
          </h2>
          <button
            onClick={() => {
              sound.playClick();
              setActiveTab('updates');
            }}
            className="text-xs font-bold text-[#FFD000] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>All Updates</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-2.5">
          {updates.length === 0 ? (
            <div className="p-4 rounded-3xl bg-[#101018] border border-white/5 text-center text-xs text-gray-500">
              No recent studio updates. Use Central Messaging to broadcast announcements.
            </div>
          ) : (
            updates.slice(0, 2).map((msg) => (
              <div
                key={msg.id}
                className="p-4 rounded-3xl glossy-card flex items-start justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-black/70 text-[#FFD000] border border-[#FFD000]/30 font-mono">
                      {msg.type}
                    </span>
                    <p className="text-xs font-bold text-white">{msg.subject}</p>
                  </div>
                  <p className="text-xs text-gray-300 line-clamp-2 leading-relaxed">{msg.message}</p>
                  <div className="flex items-center gap-2 text-[10px] text-gray-500 pt-1">
                    <span>To: {msg.recipientName}</span>
                    <span>•</span>
                    <span>{msg.sentAt}</span>
                  </div>
                </div>

                <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20 shrink-0">
                  Delivered
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
