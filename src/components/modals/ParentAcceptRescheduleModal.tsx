import React from 'react';
import { useApp } from '../../context/AppContext';
import { Session } from '../../types';
import {
  X,
  CalendarClock,
  CheckCircle2,
  AlertTriangle,
  MessageCircle,
  Smartphone,
  Calendar,
  Clock,
  User,
  ShieldCheck,
} from 'lucide-react';
import { sound } from '../../utils/sound';

interface ParentAcceptRescheduleModalProps {
  session: Session | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ParentAcceptRescheduleModal: React.FC<ParentAcceptRescheduleModalProps> = ({
  session,
  isOpen,
  onClose,
}) => {
  const { acceptReschedule, declineReschedule, teacher } = useApp();

  if (!isOpen || !session) return null;

  const handleAccept = () => {
    sound.playSuccess();
    acceptReschedule(session.id);
    onClose();
  };

  const handleDecline = () => {
    sound.playAlert();
    declineReschedule(session.id, 'Parent requested to keep original schedule.');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-lg bg-[#101017] border border-[#FFD000]/30 rounded-3xl overflow-hidden shadow-2xl my-auto top-sheen">
        {/* Header with Parent Portal simulation badge */}
        <div className="p-6 bg-gradient-to-r from-[#171722] to-[#121218] border-b border-white/10 flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#FFD000] text-black flex items-center justify-center font-black shadow-gold-glow-sm">
              <Smartphone className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#FFD000]/20 text-[#FFD000] border border-[#FFD000]/30">
                  Parent Portal Simulator
                </span>
                <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  SMS / WhatsApp Link
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-black text-white mt-1">
                Schedule Reschedule Confirmation
              </h2>
            </div>
          </div>

          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="p-2 rounded-xl text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body content */}
        <div className="p-6 space-y-5">
          {/* Notification simulated bubble */}
          <div className="p-4 rounded-2xl bg-[#14141E] border border-white/10 space-y-2">
            <div className="flex items-center gap-2 text-xs text-gray-300">
              <MessageCircle className="w-4 h-4 text-[#FFD000]" />
              <span className="font-bold">Official Message from RYD STUDIO:</span>
            </div>
            <p className="text-xs text-gray-300 leading-relaxed">
              "Dear Parents of <strong className="text-white">{session.batchName}</strong>, Tutor{' '}
              <strong className="text-[#FFD000]">{teacher.name}</strong> has proposed a schedule
              update for this week's tutoring session. Please review the proposed new time slot below and
              confirm to update your student's calendar."
            </p>
          </div>

          {/* Slot Comparison Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Original Slot */}
            <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-1.5 opacity-75">
              <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">
                Original Timetable
              </span>
              <div className="text-xs font-bold text-white flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-gray-400" />
                <span>{session.date}</span>
              </div>
              <div className="text-xs font-mono text-gray-300 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-gray-400" />
                <span>{session.timeSlot}</span>
              </div>
            </div>

            {/* Proposed New Slot */}
            <div className="p-4 rounded-2xl bg-[#FFD000]/10 border border-[#FFD000]/40 space-y-1.5 shadow-gold-glow-sm">
              <span className="text-[10px] uppercase font-bold text-[#FFD000] tracking-wider">
                Proposed New Slot
              </span>
              <div className="text-xs font-black text-white flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#FFD000]" />
                <span>{session.proposedDate || 'Next Scheduled Date'}</span>
              </div>
              <div className="text-xs font-mono font-bold text-[#FFD000] flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#FFD000]" />
                <span>{session.proposedTime || '17:00 - 18:30'}</span>
              </div>
            </div>
          </div>

          {/* Reason Card */}
          {session.rescheduleReason && (
            <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 text-xs space-y-1">
              <span className="text-[10px] uppercase font-bold text-gray-400">Teacher's Note:</span>
              <p className="text-xs text-gray-200 italic">"{session.rescheduleReason}"</p>
            </div>
          )}

          {/* Automated System Integration Notice */}
          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300">
            <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5 text-emerald-400" />
            <p className="text-[11px] leading-relaxed">
              Upon your acceptance, RYD STUDIO will automatically synchronize the studio schedule,
              update the batch timetable, clear pending requests, and refresh Google Calendar links.
            </p>
          </div>
        </div>

        {/* Footer Action Buttons */}
        <div className="p-6 bg-[#14141E] border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={handleDecline}
            className="px-4 py-2.5 rounded-xl text-xs font-bold text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 transition-all cursor-pointer"
          >
            Decline Request
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                sound.playClick();
                onClose();
              }}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-gray-400 hover:text-white transition-all cursor-pointer"
            >
              Review Later
            </button>
            <button
              onClick={handleAccept}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl glossy-button-yellow text-xs font-black shadow-gold-glow cursor-pointer transition-all"
            >
              <CheckCircle2 className="w-4 h-4 text-black" />
              <span>Accept & Confirm Schedule</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
