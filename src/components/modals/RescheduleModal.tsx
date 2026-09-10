import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { generateCalendarCode, createGoogleCalendarUrl, downloadIcsFile } from '../../utils/calendar';
import {
  X,
  CalendarDays,
  Clock,
  CalendarCheck,
  Download,
  ExternalLink,
  MessageCircle,
  BellRing,
  Info,
} from 'lucide-react';
import { sound } from '../../utils/sound';

export const RescheduleModal: React.FC = () => {
  const {
    rescheduleModalOpen,
    setRescheduleModalOpen,
    selectedSessionForReschedule,
    requestReschedule,
  } = useApp();

  const [proposedDate, setProposedDate] = useState('2026-09-15');
  const [proposedTime, setProposedTime] = useState('17:00 - 18:30');
  const [reason, setReason] = useState('Studio Hall Renovation & Audio Upgrade');

  if (!rescheduleModalOpen || !selectedSessionForReschedule) return null;

  const session = selectedSessionForReschedule;
  const structuredCode = generateCalendarCode(session.monthIndex, session.classIndex, 'rescheduled');

  const handleConfirmReschedule = () => {
    requestReschedule(session.id, proposedDate, proposedTime, reason);
  };

  const handleSyncGoogleCalendar = () => {
    sound.playClick();
    const url = createGoogleCalendarUrl({
      title: `${session.batchName} (Rescheduled)`,
      description: `Rescheduled makeup class. Reason: ${reason}.`,
      location: `${session.locationName}, ${session.studioRoom}`,
      dateStr: proposedDate,
      timeStr: proposedTime,
      calendarCode: structuredCode,
    });
    window.open(url, '_blank');
  };

  const handleDownloadIcs = () => {
    sound.playClick();
    downloadIcsFile({
      title: `${session.batchName} (Rescheduled)`,
      description: `Rescheduled makeup class. Reason: ${reason}.`,
      location: `${session.locationName}, ${session.studioRoom}`,
      dateStr: proposedDate,
      timeStr: proposedTime,
      calendarCode: structuredCode,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-lg bg-[#101017] border border-white/15 rounded-3xl overflow-hidden shadow-2xl my-auto top-sheen">
        {/* Header */}
        <div className="bg-[#151520] px-6 py-4 border-b border-white/[0.08] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#FACC15] text-black flex items-center justify-center font-black shadow-gold-glow-sm">
              <CalendarDays className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">
                Request Reschedule & Calendar Sync
              </h2>
              <p className="text-[11px] text-gray-400">
                Structured Code Standard: <strong className="text-[#FACC15] font-mono">{structuredCode}</strong>
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              sound.playClick();
              setRescheduleModalOpen(false);
            }}
            className="p-1.5 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Current Class Overview */}
          <div className="p-4 rounded-3xl bg-[#14141E] border border-white/[0.08] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white">{session.batchName}</span>
              <span className="text-xs font-mono font-bold bg-black text-[#FACC15] px-2.5 py-1 rounded-xl border border-[#FACC15]/30">
                Code: {structuredCode}
              </span>
            </div>
            <div className="flex items-center gap-3 text-xs text-gray-400">
              <span className="flex items-center gap-1">
                <CalendarDays className="w-3.5 h-3.5 text-[#FACC15]" />
                Scheduled: {session.date}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-gray-400" />
                {session.timeSlot}
              </span>
            </div>
          </div>

          {/* New Proposed Date & Time */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-gray-300 block mb-1.5">
                Proposed New Date
              </label>
              <input
                type="date"
                value={proposedDate}
                onChange={(e) => setProposedDate(e.target.value)}
                className="w-full bg-[#14141E] border border-white/10 rounded-2xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#FACC15]"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-300 block mb-1.5">
                Proposed Time Slot
              </label>
              <input
                type="text"
                value={proposedTime}
                onChange={(e) => setProposedTime(e.target.value)}
                placeholder="17:00 - 18:30"
                className="w-full bg-[#14141E] border border-white/10 rounded-2xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#FACC15]"
              />
            </div>
          </div>

          {/* Reason Field */}
          <div>
            <label className="text-xs font-bold text-gray-300 block mb-1.5">
              Reason for Reschedule Request
            </label>
            <textarea
              rows={2}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Provide context for parents and studio coordinator..."
              className="w-full bg-[#14141E] border border-white/10 rounded-2xl px-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#FACC15]"
            />
          </div>

          {/* Structured Code Standard Explanation */}
          <div className="p-3.5 rounded-2xl bg-[#FACC15]/10 border border-[#FACC15]/30 text-xs space-y-1.5">
            <div className="flex items-center gap-1.5 text-[#FACC15] font-bold">
              <Info className="w-4 h-4 shrink-0" />
              <span>Structured Code Rule: {structuredCode}</span>
            </div>
            <p className="text-gray-300 text-xs leading-relaxed">
              Standard format: <strong>{session.monthIndex}nd Month, {session.classIndex}rd Class, Rescheduled</strong>. Once confirmed by parents, this structured tag is automatically attached to parent portal records and external calendar feeds.
            </p>
          </div>

          {/* Calendar Sync Actions */}
          <div className="p-4 rounded-2xl bg-black/40 border border-white/[0.08] space-y-2.5">
            <p className="text-xs font-bold text-white flex items-center gap-2">
              <CalendarCheck className="w-3.5 h-3.5 text-[#FACC15]" />
              <span>Instant Calendar Sync Preview</span>
            </p>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                onClick={handleSyncGoogleCalendar}
                className="p-2.5 rounded-xl bg-[#14141E] hover:bg-[#1C1C28] border border-white/10 hover:border-[#FACC15]/40 text-xs text-white font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <ExternalLink className="w-3.5 h-3.5 text-[#FACC15]" />
                <span>Google Calendar</span>
              </button>
              <button
                onClick={handleDownloadIcs}
                className="p-2.5 rounded-xl bg-[#14141E] hover:bg-[#1C1C28] border border-white/10 hover:border-[#FACC15]/40 text-xs text-white font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-[#FACC15]" />
                <span>Export .ICS File</span>
              </button>
            </div>
          </div>

          {/* Parent Dispatch Notice */}
          <div className="flex items-center gap-2 text-xs text-gray-400 bg-[#12121A] p-3 rounded-2xl border border-white/5">
            <BellRing className="w-4 h-4 text-[#FACC15] shrink-0" />
            <span>Automated push/SMS will dispatch to all batch parents requesting 1-tap confirmation.</span>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-[#151520] px-6 py-4 border-t border-white/[0.08] flex items-center justify-between">
          <button
            onClick={() => {
              sound.playClick();
              setRescheduleModalOpen(false);
            }}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-400 hover:text-white cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirmReschedule}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#FACC15] hover:bg-[#EAB308] text-black text-xs font-bold shadow-gold-glow-sm transition-all cursor-pointer"
          >
            <MessageCircle className="w-4 h-4 fill-black" />
            <span>Submit & Notify Parents</span>
          </button>
        </div>
      </div>
    </div>
  );
};
