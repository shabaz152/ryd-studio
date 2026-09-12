import React, { useState } from 'react';
import {
  Users,
  Activity,
  Calendar,
  Clock,
  CheckCircle2,
  AlertTriangle,
  FileCheck,
  Star,
  Sparkles,
  ChevronDown,
  Check,
  Send,
  MessageSquare,
  KeyRound,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { sound } from '../../utils/sound';

export const ParentPortal: React.FC = () => {
  const {
    parents,
    selectedParentStudentId,
    setSelectedParentStudentId,
    tutorOnlineStatus,
    teacher,
    runningLateMinutes,
    runningLateReason,
    sessions,
    batches,
    activityEvents,
    unreadParentActivityCount,
    markActivityReadByParent,
    acceptReschedule,
    showToast,
    setAccountSecurityModalOpen,
    currentUser,
  } = useApp();

  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [ratingVal, setRatingVal] = useState(5);
  const [reviewText, setReviewText] = useState('');

  // Current parent
  const currentParent = parents.find((p) =>
    p.children.some((c) => c.studentId === selectedParentStudentId)
  ) || parents[0];

  const currentChild = currentParent.children.find(
    (c) => c.studentId === selectedParentStudentId
  ) || currentParent.children[0];

  // Sessions for this student's batches
  const enrolledBatches = currentChild.enrolledBatches;
  const childSessions = sessions.filter((s) => enrolledBatches.includes(s.batchId));
  const pendingRescheduleSession = childSessions.find(
    (s) => s.rescheduleState === 'pending_parent_approval'
  );

  // Relevant parent alerts
  const parentEvents = activityEvents.filter(
    (e) => !e.targetBatchId || enrolledBatches.includes(e.targetBatchId)
  );

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    showToast({
      type: 'success',
      title: 'Review Submitted to Faculty Hub',
      description: `Thank you ${currentParent.parentName}! Your ${ratingVal}-star feedback for ${teacher.name} has been shared with the Center Director.`,
    });
    setReviewModalOpen(false);
    setReviewText('');
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Top Banner: Parent & Family Hub */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-950 via-slate-950 to-slate-900 border border-emerald-800/40 p-5 sm:p-6 text-white shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[11px] font-black uppercase tracking-wider flex items-center gap-1">
                <Users className="w-3.5 h-3.5" />
                <span>Parent & Learner Portal</span>
              </span>
              <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-[10px] font-bold">
                Direct Faculty Link
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white mt-2">
              Welcome, {currentParent.parentName}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              Monitoring academic progress, tutor attendance, live timetable, and direct tutor alerts for your family.
            </p>
          </div>

          {/* Child Profile Switcher */}
          <div className="flex items-center gap-2 bg-slate-900/90 p-2 rounded-xl border border-emerald-500/30 shadow-inner">
            <span className="text-xs text-slate-400 font-semibold pl-1">Student:</span>
            <div className="relative">
              <select
                value={selectedParentStudentId}
                onChange={(e) => setSelectedParentStudentId(e.target.value)}
                className="bg-emerald-900/40 text-emerald-200 border border-emerald-500/40 rounded-lg px-3 py-1.5 text-xs font-bold focus:outline-none cursor-pointer pr-7 appearance-none"
              >
                {parents.flatMap((p) =>
                  p.children.map((c) => (
                    <option key={c.studentId} value={c.studentId} className="bg-slate-900 text-white">
                      {c.studentName} ({c.grade})
                    </option>
                  ))
                )}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-emerald-400 absolute right-2 top-2.5 pointer-events-none" />
            </div>

            {/* Parent Credentials Security Button */}
            <button
              onClick={() => setAccountSecurityModalOpen(true)}
              className="px-2.5 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
              title="Update your personal login email and password"
            >
              <KeyRound className="w-3.5 h-3.5 text-emerald-400" />
              <span>My Credentials</span>
            </button>
          </div>
        </div>
      </div>

      {/* Parent Profile Card with Direct Change Password */}
      <div className="rounded-2xl p-4 sm:p-5 bg-white dark:bg-[#10101A] border border-slate-200 dark:border-white/10 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5 min-w-0">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-500 font-black flex items-center justify-center text-xl shadow-xs shrink-0">
            👨‍👩‍👧
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white truncate">
                {currentParent.parentName}
              </h3>
              <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 uppercase tracking-wider">
                Family Profile
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-gray-400 truncate mt-0.5">
              Email: <strong className="text-slate-800 dark:text-slate-200">{currentUser?.email || currentParent.email}</strong> • Student: {currentChild.studentName} ({currentChild.grade})
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            sound.playClick();
            setAccountSecurityModalOpen(true);
          }}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:brightness-110 text-white text-xs font-black shadow-md shadow-emerald-500/20 transition-all cursor-pointer flex items-center justify-center gap-2 shrink-0"
          title="Click to change your personal login email and password"
        >
          <KeyRound className="w-4 h-4" />
          <span>Change Password</span>
        </button>
      </div>

      {/* Real-Time Live Tutor Status Card (The core requirement!) */}
      <div className="rounded-2xl border p-5 sm:p-6 transition-all shadow-md bg-white dark:bg-[#10101A] border-slate-200 dark:border-white/10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="relative">
              <img
                src={teacher.avatarUrl}
                alt={teacher.name}
                className="w-14 h-14 rounded-2xl object-cover border-2 border-amber-400 shadow-sm shrink-0"
              />
              <span
                className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-white dark:border-[#10101A] ${
                  tutorOnlineStatus === 'online'
                    ? 'bg-emerald-500'
                    : tutorOnlineStatus === 'in_session'
                    ? 'bg-blue-500 animate-pulse'
                    : tutorOnlineStatus === 'running_late'
                    ? 'bg-amber-500 animate-ping'
                    : 'bg-slate-400'
                }`}
              />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-black text-slate-900 dark:text-white">
                  {teacher.name} (Assigned Faculty)
                </h2>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                    tutorOnlineStatus === 'online'
                      ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                      : tutorOnlineStatus === 'in_session'
                      ? 'bg-blue-500/20 text-blue-600 dark:text-blue-400 border border-blue-500/30'
                      : tutorOnlineStatus === 'running_late'
                      ? 'bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30 animate-pulse'
                      : 'bg-slate-500/20 text-slate-600 dark:text-slate-400 border border-slate-500/30'
                  }`}
                >
                  ● {tutorOnlineStatus === 'online' ? 'Tutor Online' : tutorOnlineStatus === 'in_session' ? 'In Session With Students' : tutorOnlineStatus === 'running_late' ? 'Running Late' : 'Offline'}
                </span>
              </div>

              {/* Status Explanation */}
              <p className="text-xs text-slate-600 dark:text-gray-300 mt-1">
                {tutorOnlineStatus === 'in_session' ? (
                  <span className="text-blue-600 dark:text-blue-400 font-semibold">
                    Class is currently in progress in Tutoring Pod Alpha. Student attendance recording active.
                  </span>
                ) : tutorOnlineStatus === 'running_late' ? (
                  <span className="text-amber-600 dark:text-amber-400 font-semibold">
                    Notice: Tutor reported {runningLateMinutes || 10} minutes transit delay ({runningLateReason || 'Transit delay'}). Class will conclude on schedule.
                  </span>
                ) : tutorOnlineStatus === 'online' ? (
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                    Tutor has logged in and is on-site preparing syllabus for today's scheduled classes.
                  </span>
                ) : (
                  <span>Tutor is currently offline. Sessions will activate upon scheduled arrival.</span>
                )}
              </p>

              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-2.5">
                <span>Today's Slot: <strong className="text-slate-900 dark:text-white">16:00 - 17:30 (Advanced Calculus)</strong></span>
                <span>•</span>
                <span>Room: <strong className="text-amber-600 dark:text-amber-400">Tutoring Pod Alpha - Room 1</strong></span>
              </div>
            </div>
          </div>

          {/* Rate / Review Tutor Button */}
          <div className="shrink-0 self-start sm:self-center">
            <button
              onClick={() => setReviewModalOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-black text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Star className="w-3.5 h-3.5 fill-black" />
              <span>Rate Tutor</span>
            </button>
          </div>
        </div>
      </div>

      {/* Pending Reschedule Alert (if any) */}
      {pendingRescheduleSession && (
        <div className="p-5 rounded-2xl bg-gradient-to-r from-purple-500/10 via-purple-500/5 to-transparent border-2 border-purple-500/40 shadow-lg">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-purple-500 text-white shrink-0">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-600 dark:text-purple-300 text-[10px] font-bold uppercase tracking-wider">
                  Action Required: Reschedule Proposed
                </span>
                <h3 className="text-sm font-black text-slate-900 dark:text-white mt-1">
                  Tutor requested slot change for {pendingRescheduleSession.batchName}
                </h3>
                <p className="text-xs text-slate-600 dark:text-gray-300 mt-0.5">
                  Proposed: <strong className="text-purple-600 dark:text-purple-400">{pendingRescheduleSession.proposedDate} at {pendingRescheduleSession.proposedTime}</strong> (Reason: {pendingRescheduleSession.rescheduleReason || 'Academic schedule conflict'})
                </p>
              </div>
            </div>

            <button
              onClick={() => acceptReschedule(pendingRescheduleSession.id)}
              className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-black transition-all shadow-md shadow-purple-500/20 flex items-center justify-center gap-2 cursor-pointer shrink-0"
            >
              <Check className="w-4 h-4" />
              <span>Accept Proposed Slot</span>
            </button>
          </div>
        </div>
      )}

      {/* Two Column Layout: Attendance & Progress vs Real-time Alert Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Child's Attendance & Progress History */}
        <div className="bg-white dark:bg-[#10101A] border border-slate-200 dark:border-white/10 rounded-2xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-emerald-500" />
              <h3 className="text-sm font-black text-slate-900 dark:text-white">
                {currentChild.studentName}'s Academic Attendance & Notes
              </h3>
            </div>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
              100% Attendance Rate
            </span>
          </div>

          <div className="space-y-2.5">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200/60 dark:border-white/5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 dark:text-white">Advanced Calculus & Vectors</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[10px] font-black uppercase">
                  Present
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-gray-300 mt-1">
                Tutor notes: "Excellent grasp of partial derivatives. Completed analytical problem set 4 ahead of time."
              </p>
              <p className="text-[10px] text-slate-400 mt-1.5 font-mono">Last Session • 16:00 - 17:30</p>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200/60 dark:border-white/5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 dark:text-white">Physics Mechanics & Dynamics</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[10px] font-black uppercase">
                  Present
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-gray-300 mt-1">
                Tutor notes: "Free body diagrams reviewed. Practice worksheet on rotational kinetic energy assigned for next class."
              </p>
              <p className="text-[10px] text-slate-400 mt-1.5 font-mono">Previous Session • 18:00 - 19:30</p>
            </div>
          </div>
        </div>

        {/* Right Column: Direct Live Alerts & Updates Feed */}
        <div className="bg-white dark:bg-[#10101A] border border-slate-200 dark:border-white/10 rounded-2xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-amber-500" />
              <h3 className="text-sm font-black text-slate-900 dark:text-white">
                Live Alerts Regarding Your Tutor
              </h3>
            </div>
            {unreadParentActivityCount > 0 && (
              <button
                onClick={markActivityReadByParent}
                className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
              >
                Mark read ({unreadParentActivityCount})
              </button>
            )}
          </div>

          <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
            {parentEvents.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-6">No recent alerts.</p>
            ) : (
              parentEvents.slice(0, 10).map((event) => (
                <div
                  key={event.id}
                  className="p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200/60 dark:border-white/5 flex items-start gap-2.5"
                >
                  <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-500 shrink-0 mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900 dark:text-white">{event.title}</span>
                      <span className="text-[10px] text-slate-400 font-mono">{event.timestamp}</span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-gray-300 mt-0.5">{event.description}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Rate Tutor Modal */}
      {reviewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md bg-white dark:bg-[#10101A] border border-slate-200 dark:border-white/10 rounded-2xl p-6 shadow-2xl">
            <h3 className="text-base font-black text-slate-900 dark:text-white">
              Rate {teacher.name}
            </h3>
            <p className="text-xs text-slate-500 dark:text-gray-400 mt-1">
              Your feedback helps maintain exceptional academic quality across the studio center.
            </p>

            <form onSubmit={handleReviewSubmit} className="mt-4 space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-gray-300">Rating (1 to 5 Stars)</label>
                <div className="flex items-center gap-2 mt-1.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setRatingVal(star)}
                      className="p-1 cursor-pointer focus:outline-none"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          star <= ratingVal
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-slate-300 dark:text-slate-700'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-gray-300">Feedback Comments</label>
                <textarea
                  rows={3}
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="Share feedback on concept clarity, punctuality, and problem-solving instruction..."
                  className="w-full mt-1.5 p-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setReviewModalOpen(false)}
                  className="px-3 py-1.5 text-xs text-slate-500 hover:text-slate-700 dark:hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-black text-xs font-bold rounded-xl shadow-xs cursor-pointer"
                >
                  Submit Feedback
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
