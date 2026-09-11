import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Session } from '../types';
import { createGoogleCalendarUrl, downloadIcsFile } from '../utils/calendar';
import {
  CalendarDays,
  Plus,
  ExternalLink,
  Download,
  CheckCircle2,
  Info,
  Trash2,
  Clock,
  Smartphone,
} from 'lucide-react';
import { sound } from '../utils/sound';

export const RescheduleView: React.FC = () => {
  const {
    sessions,
    setNewSessionModalOpen,
    openRescheduleForSession,
    deleteSession,
    acceptReschedule,
    declineReschedule,
    openParentPreviewForSession,
  } = useApp();

  const [activeTabFilter, setActiveTabFilter] = useState<'proposals' | 'all'>('proposals');

  const rescheduleProposals = sessions.filter(
    (s) => s.status === 'rescheduled' || s.proposedDate || s.rescheduleReason
  );

  const handleSyncCalendar = (s: Session) => {
    sound.playClick();
    const url = createGoogleCalendarUrl({
      title: `${s.batchName} (${s.status.toUpperCase()})`,
      description: `Studio Session. Code: ${s.calendarCode || 'N/A'}. Reason: ${s.rescheduleReason || 'Scheduled class'}.`,
      location: `${s.locationName}, ${s.studioRoom}`,
      dateStr: s.proposedDate || s.date,
      timeStr: s.proposedTime || s.timeSlot,
      calendarCode: s.calendarCode,
    });
    window.open(url, '_blank');
  };

  const handleExportIcs = (s: Session) => {
    sound.playClick();
    downloadIcsFile({
      title: `${s.batchName} (${s.status.toUpperCase()})`,
      description: `Studio Session. Code: ${s.calendarCode || 'N/A'}. Reason: ${s.rescheduleReason || 'Scheduled class'}.`,
      location: `${s.locationName}, ${s.studioRoom}`,
      dateStr: s.proposedDate || s.date,
      timeStr: s.proposedTime || s.timeSlot,
      calendarCode: s.calendarCode,
    });
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
            <CalendarDays className="w-6 h-6 text-[#FACC15]" />
            <span>Reschedule Classes & Session Creation</span>
          </h1>
          <p className="text-xs text-gray-400">
            Create makeup sessions, monitor reschedule proposals, and sync with structured Google Calendar codes
          </p>
        </div>

        <button
          onClick={() => {
            sound.playClick();
            setNewSessionModalOpen(true);
          }}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#FACC15] hover:bg-[#EAB308] text-black text-xs font-black shadow-gold-glow-sm transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Session</span>
        </button>
      </div>

      {/* Structured Code Standard Banner */}
      <div className="p-5 rounded-3xl bg-[#12121A] border border-[#FACC15]/30 shadow-card-dark flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-2xl bg-[#FACC15] text-black flex items-center justify-center font-black shrink-0 shadow-gold-glow-sm">
            <Info className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Structured Calendar Code Standard
            </h3>
            <p className="text-xs text-gray-300 mt-1 leading-relaxed">
              Standard syntax: <strong className="text-[#FACC15] font-mono">2:3ab</strong> = 2nd Month, 3rd Class, Absent • <strong className="text-[#FACC15] font-mono">2:3res</strong> = Rescheduled • <strong className="text-[#FACC15] font-mono">2:3pr</strong> = Present
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono font-bold text-gray-300 bg-black/60 px-3.5 py-1.5 rounded-xl border border-white/10">
          <span>Auto Calendar Sync:</span>
          <span className="text-emerald-400 font-bold">Active</span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex rounded-2xl bg-[#101015] p-1 border border-white/[0.08] text-xs font-bold w-fit">
        <button
          onClick={() => setActiveTabFilter('proposals')}
          className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${
            activeTabFilter === 'proposals'
              ? 'bg-[#FACC15] text-black font-bold shadow-sm'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Reschedule Proposals & Changes ({rescheduleProposals.length})
        </button>
        <button
          onClick={() => setActiveTabFilter('all')}
          className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${
            activeTabFilter === 'all'
              ? 'bg-[#FACC15] text-black font-bold shadow-sm'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          All Roster Sessions ({sessions.length})
        </button>
      </div>

      {/* Sessions Grid */}
      {(activeTabFilter === 'proposals' ? rescheduleProposals : sessions).length === 0 ? (
        <div className="p-10 rounded-3xl bg-[#101017] border border-white/10 text-center space-y-4 shadow-card-dark top-sheen">
          <div className="w-14 h-14 rounded-2xl bg-[#FFD000]/10 border border-[#FFD000]/20 text-[#FFD000] flex items-center justify-center mx-auto">
            <CalendarDays className="w-7 h-7" />
          </div>
          <div className="max-w-md mx-auto space-y-1.5">
            <h3 className="text-base font-bold text-white">
              {activeTabFilter === 'proposals'
                ? 'No Active Reschedule Requests'
                : 'No Roster Sessions Scheduled'}
            </h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              {activeTabFilter === 'proposals'
                ? 'All class sessions are proceeding as planned. You can request a reschedule from any session card.'
                : 'All studio sessions have been cleared or completed. Click below to create a new session.'}
            </p>
          </div>
          <button
            onClick={() => {
              sound.playClick();
              setNewSessionModalOpen(true);
            }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl glossy-button-yellow text-xs font-black shadow-gold-glow-sm cursor-pointer"
          >
            <Plus className="w-4 h-4 text-black" />
            <span>+ Create New Session</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(activeTabFilter === 'proposals' ? rescheduleProposals : sessions).map((s) => (
            <div
              key={s.id}
              className="p-6 rounded-3xl bg-[#101015] border border-white/[0.08] hover:border-white/20 transition-all space-y-4 shadow-card-dark"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[9px] font-black uppercase px-2.5 py-0.5 rounded-full ${
                        s.status === 'rescheduled'
                          ? 'bg-[#FACC15] text-black'
                          : s.status === 'completed'
                          ? 'bg-emerald-500 text-black'
                          : s.status === 'cancelled'
                          ? 'bg-red-500 text-white'
                          : 'bg-white/10 text-white'
                      }`}
                    >
                      {s.status.toUpperCase()}
                    </span>
                    <h3 className="text-sm font-bold text-white">{s.batchName}</h3>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    {s.locationName} • {s.studioRoom}
                  </p>
                </div>

                <span className="text-xs font-mono font-bold text-[#FACC15] bg-black/60 px-2.5 py-1 rounded-xl border border-[#FACC15]/30 inline-block">
                  Code: {s.calendarCode || '2:3'}
                </span>
              </div>

              <div className="space-y-1.5 text-xs text-gray-300 bg-[#161622] p-3.5 rounded-2xl border border-white/5">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Original Time Slot:</span>
                  <span className="text-white font-bold">{s.date} ({s.timeSlot})</span>
                </div>
                {s.proposedDate && (
                  <div className="flex items-center justify-between text-[#FACC15]">
                    <span className="font-bold">Proposed New Slot:</span>
                    <span className="font-mono font-bold">
                      {s.proposedDate} ({s.proposedTime})
                    </span>
                  </div>
                )}
                {s.rescheduleReason && (
                  <div className="pt-1 text-[11px] text-gray-400 italic">
                    Reason: "{s.rescheduleReason}"
                  </div>
                )}
              </div>

              {/* Interactive Parent Approval Workflow Banner */}
              {s.rescheduleState === 'pending_parent_approval' && (
                <div className="p-4 rounded-2xl bg-[#FFD000]/10 border border-[#FFD000]/30 space-y-3 shadow-gold-glow-sm">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-[11px] font-bold text-[#FFD000] flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 animate-pulse" />
                      <span>Parent Action Required • Pending Slot Approval</span>
                    </span>
                    <button
                      onClick={() => openParentPreviewForSession(s)}
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-[#FFD000] hover:text-white bg-black/40 px-2.5 py-1 rounded-lg border border-[#FFD000]/20 transition-all cursor-pointer"
                    >
                      <Smartphone className="w-3 h-3" />
                      <span>Preview Parent SMS/Notice</span>
                    </button>
                  </div>
                  <p className="text-[11px] text-gray-300 leading-relaxed">
                    Automated notice dispatched to all parents. You can accept below on behalf of the parent cohort or test the parent simulation.
                  </p>
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={() => acceptReschedule(s.id)}
                      className="flex-1 py-2 px-3 rounded-xl glossy-button-yellow text-black text-xs font-black transition-all cursor-pointer shadow-sm text-center"
                    >
                      ✓ Accept Proposed Slot (Confirm Schedule)
                    </button>
                    <button
                      onClick={() => declineReschedule(s.id)}
                      className="py-2 px-3 rounded-xl bg-red-500/15 hover:bg-red-500/25 text-red-400 border border-red-500/25 text-xs font-bold transition-all cursor-pointer"
                    >
                      Decline
                    </button>
                  </div>
                </div>
              )}

              {s.rescheduleState === 'confirmed' && (
                <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-500/10 px-3.5 py-2 rounded-2xl border border-emerald-500/20">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                  <span>Reschedule Confirmed by Parent. Batch timetable and Google Calendar synchronized.</span>
                </div>
              )}

              {s.rescheduleState === 'declined' && (
                <div className="flex items-center gap-2 text-xs text-gray-400 bg-white/5 px-3.5 py-2 rounded-2xl border border-white/10">
                  <Info className="w-4 h-4 shrink-0 text-gray-400" />
                  <span>Reschedule request was declined. Retaining original timetable.</span>
                </div>
              )}

              <div className="pt-2 border-t border-white/5 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleSyncCalendar(s)}
                    className="px-3.5 py-2 rounded-xl bg-[#161622] hover:bg-[#1E1E2C] text-[#FACC15] text-xs font-bold border border-[#FACC15]/30 flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Google Calendar</span>
                  </button>
                  <button
                    onClick={() => handleExportIcs(s)}
                    className="px-3.5 py-2 rounded-xl bg-[#161622] hover:bg-[#1E1E2C] text-gray-300 text-xs font-bold border border-white/10 flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>.ICS File</span>
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  {s.status === 'scheduled' && (
                    <button
                      onClick={() => openRescheduleForSession(s)}
                      className="px-4 py-2 rounded-xl bg-[#FACC15] hover:bg-[#EAB308] text-black text-xs font-bold shadow-sm transition-all cursor-pointer"
                    >
                      Request Reschedule
                    </button>
                  )}
                  <button
                    onClick={() => {
                      if (window.confirm(`Delete session "${s.batchName}" (${s.date}, ${s.timeSlot})?`)) {
                        deleteSession(s.id);
                      }
                    }}
                    className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 transition-all cursor-pointer"
                    title="Delete Session"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
