import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { StudioMap } from '../common/StudioMap';
import {
  X,
  Clock,
  MapPin,
  Users,
  CheckCircle2,
  Calendar,
  AlertOctagon,
  CalendarRange,
  ArrowRight,
  ShieldAlert,
  CalendarCheck,
  LogOut,
} from 'lucide-react';
import { sound } from '../../utils/sound';

export const CheckInModal: React.FC = () => {
  const {
    checkInModalOpen,
    setCheckInModalOpen,
    sessions,
    batches,
    checkIn,
    isCheckedIn,
    setCheckOutModalOpen,
    openCheckOutForSession,
    openRescheduleForSession,
    cancelClass,
  } = useApp();

  const [selectedSessionId, setSelectedSessionId] = useState<string>(
    sessions.find((s) => s.status === 'scheduled')?.id || sessions[0]?.id || ''
  );
  const [activeSubTab, setActiveSubTab] = useState<'roster' | 'map' | 'manage'>('roster');
  const [cancelReason, setCancelReason] = useState('');
  const [confirmCancelOpen, setConfirmCancelOpen] = useState(false);

  if (!checkInModalOpen) return null;

  const currentSession = sessions.find((s) => s.id === selectedSessionId) || sessions[0];
  const currentBatch = batches.find((b) => b.id === currentSession?.batchId);

  const handleConfirmCheckIn = () => {
    if (!currentSession) return;
    checkIn(currentSession.id);
  };

  const handleCancelClick = () => {
    if (!currentSession || !cancelReason.trim()) return;
    cancelClass(currentSession.id, cancelReason);
    setConfirmCancelOpen(false);
    setCheckInModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-2xl bg-[#101017] border border-white/15 rounded-3xl overflow-hidden shadow-2xl my-auto top-sheen">
        {/* Modal Header */}
        <div className="bg-[#151520] px-6 py-4 border-b border-white/[0.08] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#FACC15] text-black flex items-center justify-center font-black shadow-gold-glow-sm">
              <CalendarCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">
                Studio Check In & Roster Planner
              </h2>
              <p className="text-[11px] text-gray-400">
                Confirm venue arrival, review class roster & access reschedule options
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              sound.playClick();
              setCheckInModalOpen(false);
            }}
            className="p-1.5 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Active Session Check Out Prompt */}
          {currentSession?.status === 'checked_in' && (
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2.5 text-emerald-400 font-semibold">
                <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400" />
                <span>
                  "{currentSession.batchName}" is currently active. Ready to finish class?
                </span>
              </div>
              <button
                onClick={() => {
                  sound.playClick();
                  setCheckInModalOpen(false);
                  openCheckOutForSession(currentSession);
                }}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl glossy-button-yellow text-xs font-black shrink-0 cursor-pointer shadow-sm"
              >
                <LogOut className="w-3.5 h-3.5 text-black" />
                <span>Check Out Now</span>
              </button>
            </div>
          )}

          {/* Batch Selector */}
          <div>
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2">
              Scheduled Studio Sessions
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {sessions
                .filter((s) => s.status === 'scheduled' || s.status === 'checked_in')
                .map((session) => (
                  <button
                    key={session.id}
                    onClick={() => {
                      sound.playClick();
                      setSelectedSessionId(session.id);
                    }}
                    className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                      selectedSessionId === session.id
                        ? 'bg-[#181826] border-[#FACC15] text-white shadow-gold-glow-sm'
                        : 'bg-[#12121A] border-white/[0.08] text-gray-300 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-bold truncate text-white">{session.batchName}</span>
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-lg bg-black/80 text-[#FACC15] border border-[#FACC15]/30">
                        {session.calendarCode || '2:3'}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-[11px] text-gray-400">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-[#FACC15]" />
                        {session.timeSlot}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-gray-400" />
                        {session.studioRoom}
                      </span>
                    </div>
                  </button>
                ))}
            </div>
          </div>

          {/* Current Batch Information Card */}
          {currentSession && currentBatch && (
            <div className="bg-[#13131D] border border-white/[0.08] rounded-3xl p-5 space-y-3.5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-[#FACC15] text-black text-[9px] font-black uppercase">
                      {currentBatch.level}
                    </span>
                    <h3 className="text-sm font-bold text-white">{currentBatch.name}</h3>
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {currentBatch.style} • Code: {currentBatch.code}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-mono font-bold text-[#FACC15] bg-black/60 px-3 py-1 rounded-xl border border-[#FACC15]/30">
                    Month {currentSession.monthIndex}, Class {currentSession.classIndex}
                  </span>
                </div>
              </div>

              {/* Sub-Tabs */}
              <div className="flex rounded-2xl bg-[#0C0C12] p-1 border border-white/5 text-xs font-bold">
                <button
                  onClick={() => {
                    sound.playClick();
                    setActiveSubTab('roster');
                  }}
                  className={`flex-1 py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    activeSubTab === 'roster'
                      ? 'bg-[#FACC15] text-black font-bold shadow-sm'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>Roster Planner ({currentBatch.students.length})</span>
                </button>
                <button
                  onClick={() => {
                    sound.playClick();
                    setActiveSubTab('map');
                  }}
                  className={`flex-1 py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    activeSubTab === 'map'
                      ? 'bg-[#FACC15] text-black font-bold shadow-sm'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Studio Venue Map</span>
                </button>
                <button
                  onClick={() => {
                    sound.playClick();
                    setActiveSubTab('manage');
                  }}
                  className={`flex-1 py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    activeSubTab === 'manage'
                      ? 'bg-[#FACC15] text-black font-bold shadow-sm'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <CalendarRange className="w-3.5 h-3.5" />
                  <span>Class Actions</span>
                </button>
              </div>

              {/* Tab 1: Integrated Roster Planner */}
              {activeSubTab === 'roster' && (
                <div className="space-y-2 pt-1">
                  <div className="flex items-center justify-between text-[11px] text-gray-400 px-1">
                    <span>Enrolled Dancers ({currentBatch.students.length})</span>
                    <span>Ready for Attendance at Check Out</span>
                  </div>
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                    {currentBatch.students.length === 0 ? (
                      <div className="p-4 rounded-2xl bg-[#161622] border border-white/5 text-center text-xs text-gray-400">
                        No students enrolled in this cohort yet (0 Dancers). You can enroll dancers from the Batches & Roster tab.
                      </div>
                    ) : (
                      currentBatch.students.map((student) => (
                        <div
                          key={student.id}
                          className="flex items-center justify-between p-2.5 rounded-2xl bg-[#161622] border border-white/5 hover:border-white/15 transition-all"
                        >
                          <div className="flex items-center gap-3">
                            <img
                              src={student.avatarUrl}
                              alt={student.name}
                              className="w-8 h-8 rounded-xl object-cover border border-[#FACC15]/40"
                            />
                            <div>
                              <p className="text-xs font-bold text-white">{student.name}</p>
                              <p className="text-[10px] text-gray-400">
                                Parent: {student.parentName} ({student.parentPhone})
                              </p>
                            </div>
                          </div>
                          <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                            Active Enrolled
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* Tab 2: Embedded Studio Map */}
              {activeSubTab === 'map' && (
                <div className="pt-1">
                  <StudioMap
                    locationName={currentBatch.locationName}
                    address={currentBatch.address}
                    studioRoom={currentBatch.studioRoom}
                    navigationUrl={currentBatch.navigationUrl}
                  />
                </div>
              )}

              {/* Tab 3: Class Management & Rescheduling */}
              {activeSubTab === 'manage' && (
                <div className="pt-1 space-y-3">
                  <div className="p-4 rounded-2xl bg-[#0F0F16] border border-white/[0.08] text-xs space-y-2.5">
                    <p className="font-bold text-white flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-[#FACC15]" />
                      <span>Class Management & Calendar Reassignment</span>
                    </p>
                    <p className="text-gray-400 text-xs leading-relaxed">
                      Need to reschedule or cancel? Automated notifications will trigger directly to all parent phones, and your Google Calendar will automatically sync with structured code standard <strong className="text-[#FACC15] font-mono">2:3res</strong>.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                      <button
                        onClick={() => {
                          sound.playClick();
                          setCheckInModalOpen(false);
                          openRescheduleForSession(currentSession);
                        }}
                        className="p-3 rounded-xl bg-[#FACC15]/10 hover:bg-[#FACC15]/20 border border-[#FACC15]/30 text-[#FACC15] font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
                      >
                        <CalendarRange className="w-4 h-4" />
                        <span>Request Reschedule</span>
                      </button>

                      <button
                        onClick={() => {
                          sound.playClick();
                          setConfirmCancelOpen(true);
                        }}
                        className="p-3 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
                      >
                        <AlertOctagon className="w-4 h-4" />
                        <span>Cancel Class</span>
                      </button>
                    </div>
                  </div>

                  {confirmCancelOpen && (
                    <div className="p-4 rounded-2xl bg-red-950/30 border border-red-500/40 space-y-3 animate-scale-in">
                      <div className="flex items-center gap-2 text-red-300 font-bold text-xs">
                        <ShieldAlert className="w-4 h-4 text-red-400" />
                        <span>Confirm Class Cancellation</span>
                      </div>
                      <input
                        type="text"
                        placeholder="Reason for cancellation (e.g. Studio repair, emergency)..."
                        value={cancelReason}
                        onChange={(e) => setCancelReason(e.target.value)}
                        className="w-full bg-black/60 border border-red-500/40 rounded-xl px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-red-400"
                      />
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setConfirmCancelOpen(false)}
                          className="px-3 py-1.5 text-xs text-gray-400 hover:text-white"
                        >
                          Dismiss
                        </button>
                        <button
                          onClick={handleCancelClick}
                          disabled={!cancelReason.trim()}
                          className="px-4 py-1.5 rounded-xl bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white text-xs font-bold transition-all cursor-pointer shadow-md"
                        >
                          Cancel Class & Notify Parents
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-[#151520] px-6 py-4 border-t border-white/[0.08] flex items-center justify-between">
          <div className="text-xs text-gray-400">
            Shift:{' '}
            <span className="text-white font-bold">
              {currentSession?.status === 'checked_in' ? 'Checked In' : 'Scheduled Today'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                sound.playClick();
                setCheckInModalOpen(false);
              }}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-400 hover:text-white cursor-pointer"
            >
              Close
            </button>
            {currentSession?.status === 'checked_in' ? (
              <button
                onClick={() => {
                  sound.playClick();
                  setCheckInModalOpen(false);
                  if (currentSession) {
                    openCheckOutForSession(currentSession);
                  } else {
                    setCheckOutModalOpen(true);
                  }
                }}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#FACC15] hover:bg-[#EAB308] text-black text-xs font-black shadow-gold-glow transition-all cursor-pointer"
              >
                <LogOut className="w-4 h-4 text-black" />
                <span>Proceed to Check Out & Attendance</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={handleConfirmCheckIn}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#FACC15] hover:bg-[#EAB308] text-black text-xs font-bold shadow-gold-glow-sm transition-all cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Confirm Check In</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
