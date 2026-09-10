import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { AttendanceRecord, AttendanceStatus, Batch } from '../../types';
import {
  X,
  UserCheck,
  Clock,
  CheckCircle,
  ShieldCheck,
  FileText,
  Plus,
  LogOut,
} from 'lucide-react';
import { sound } from '../../utils/sound';

export const CheckOutModal: React.FC = () => {
  const {
    checkOutModalOpen,
    setCheckOutModalOpen,
    sessions,
    batches,
    checkedInSession,
    teacher,
    checkOut,
    selectedSessionForCheckOut,
    setNewSessionModalOpen,
  } = useApp();

  const [selectedSessionId, setSelectedSessionId] = useState<string>('');
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [sessionNotes, setSessionNotes] = useState('');

  // Synchronize selected session on modal open
  useEffect(() => {
    if (checkOutModalOpen) {
      if (selectedSessionForCheckOut) {
        setSelectedSessionId(selectedSessionForCheckOut.id);
      } else if (checkedInSession) {
        setSelectedSessionId(checkedInSession.id);
      } else {
        const found =
          sessions.find((s) => s.status === 'checked_in') ||
          sessions.find((s) => s.status === 'scheduled') ||
          sessions[0];
        if (found) setSelectedSessionId(found.id);
      }
    }
  }, [checkOutModalOpen, selectedSessionForCheckOut, checkedInSession, sessions]);

  const activeSession =
    sessions.find((s) => s.id === selectedSessionId) ||
    selectedSessionForCheckOut ||
    checkedInSession ||
    sessions.find((s) => s.status === 'checked_in') ||
    sessions.find((s) => s.status === 'scheduled') ||
    sessions[0];

  const matchingBatch = batches.find((b) => b.id === activeSession?.batchId);
  const currentBatch: Batch = matchingBatch || {
    id: activeSession?.batchId || 'custom-batch',
    name: activeSession?.batchName || 'Studio Masterclass',
    code: activeSession?.calendarCode || 'RYD-CLASS',
    style: 'Studio Class',
    level: 'Intermediate',
    scheduleTime: activeSession?.timeSlot || '16:00 - 17:30',
    days: ['Today'],
    studioRoom: activeSession?.studioRoom || 'Studio Alpha - Hall 1',
    locationName: activeSession?.locationName || 'RYD Downtown Central',
    address: '742 Broadway Ave, Floor 3, Downtown',
    mapCoordinates: { lat: 40.7128, lng: -74.0060 },
    navigationUrl: 'https://maps.google.com/?q=742+Broadway+Ave+Downtown',
    students: [],
  };

  useEffect(() => {
    if (currentBatch) {
      const records: AttendanceRecord[] = currentBatch.students.map((student) => ({
        studentId: student.id,
        studentName: student.name,
        status: student.lastAttendance || 'present',
        notes: '',
      }));
      setAttendance(records);
    }
  }, [currentBatch.id, activeSession?.id, checkOutModalOpen]);

  if (!checkOutModalOpen) return null;

  // Empty state: No sessions exist at all
  if (!activeSession || sessions.length === 0) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-fade-in">
        <div className="relative w-full max-w-lg bg-[#101017] border border-white/15 rounded-3xl overflow-hidden shadow-2xl my-auto top-sheen p-6 sm:p-8 text-center space-y-4">
          <div className="w-14 h-14 rounded-3xl bg-[#FACC15]/10 border border-[#FACC15]/20 text-[#FACC15] flex items-center justify-center mx-auto shadow-gold-glow-sm">
            <Clock className="w-7 h-7" />
          </div>
          <div className="space-y-1.5">
            <h3 className="text-base font-bold text-white">No Sessions Ready for Check Out</h3>
            <p className="text-xs text-gray-400 max-w-sm mx-auto leading-relaxed">
              There are currently 0 active or scheduled sessions in today's timetable. All sessions may be completed, or none have been scheduled yet.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => {
                sound.playClick();
                setCheckOutModalOpen(false);
              }}
              className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-gray-300 hover:text-white border border-white/10 cursor-pointer transition-all"
            >
              Close
            </button>
            <button
              onClick={() => {
                sound.playClick();
                setCheckOutModalOpen(false);
                setNewSessionModalOpen(true);
              }}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl glossy-button-yellow text-xs font-black shadow-gold-glow-sm cursor-pointer transition-all"
            >
              <Plus className="w-4 h-4 text-black" />
              <span>+ Add Schedule & Session</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  const durationHours = (activeSession.durationMinutes || 90) / 60;
  const estimatedPay = Math.round(durationHours * (teacher.hourlyRate || 50));

  const handleStatusChange = (studentId: string, status: AttendanceStatus) => {
    sound.playClick();
    setAttendance((prev) =>
      prev.map((rec) => (rec.studentId === studentId ? { ...rec, status } : rec))
    );
  };

  const handleStudentNoteChange = (studentId: string, note: string) => {
    setAttendance((prev) =>
      prev.map((rec) => (rec.studentId === studentId ? { ...rec, notes: note } : rec))
    );
  };

  const handleMarkAllPresent = () => {
    sound.playClick();
    setAttendance((prev) =>
      prev.map((rec) => ({ ...rec, status: 'present' }))
    );
  };

  const handleSubmitAttendance = () => {
    checkOut(activeSession.id, attendance, sessionNotes);
  };

  const presentCount = attendance.filter((a) => a.status === 'present').length;
  const absentCount = attendance.filter((a) => a.status === 'absent').length;
  const lateCount = attendance.filter((a) => a.status === 'late').length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-2xl bg-[#101017] border border-white/15 rounded-3xl overflow-hidden shadow-2xl my-auto top-sheen">
        {/* Header */}
        <div className="bg-[#151520] px-6 py-4 border-b border-white/[0.08] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#FACC15] text-black flex items-center justify-center font-black shadow-gold-glow-sm">
              <LogOut className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                <span>Check Out & Log Attendance</span>
                {activeSession.status === 'checked_in' && (
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-extrabold uppercase tracking-wide border border-emerald-500/30">
                    Currently Active
                  </span>
                )}
              </h2>
              <p className="text-[11px] text-gray-400">
                Submitting updates student records and credits teaching hours to faculty payroll
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              sound.playClick();
              setCheckOutModalOpen(false);
            }}
            className="p-1.5 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Session Selector (when more than 1 session exists) */}
          {sessions.length > 1 && (
            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1.5">
                Select Session to Check Out:
              </label>
              <div className="flex items-center gap-2 overflow-x-auto pb-1.5">
                {sessions.map((sess) => {
                  const isSelected = activeSession.id === sess.id;
                  const isCheckedIn = sess.status === 'checked_in';
                  const isDone = sess.status === 'completed';

                  return (
                    <button
                      key={sess.id}
                      onClick={() => {
                        sound.playClick();
                        setSelectedSessionId(sess.id);
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 border ${
                        isSelected
                          ? 'bg-[#FACC15] text-black border-[#FACC15] shadow-gold-glow-sm font-bold'
                          : 'bg-[#14141E] text-gray-300 border-white/10 hover:border-white/20'
                      }`}
                    >
                      <span>{sess.batchName}</span>
                      <span className="text-[10px] opacity-75 font-mono">({sess.timeSlot})</span>
                      {isCheckedIn && (
                        <span className="px-1.5 py-0.2 rounded bg-emerald-500/30 text-emerald-300 text-[9px] font-extrabold uppercase">
                          Active
                        </span>
                      )}
                      {isDone && (
                        <span className="text-emerald-400 font-bold">✓</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
          {/* Automatic Working Hours & Pay Preview Banner */}
          <div className="p-4 rounded-3xl bg-gradient-to-r from-[#171722] to-[#121218] border border-[#FACC15]/30 shadow-card-dark flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-[#FACC15] text-black flex items-center justify-center font-black shadow-gold-glow-sm">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  Session Hours Computation
                </p>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-black text-white">{durationHours} Hours</span>
                  <span className="text-xs font-bold text-[#FACC15]">
                    (+${estimatedPay} at ${teacher.hourlyRate}/hr)
                  </span>
                </div>
              </div>
            </div>

            <div className="text-right bg-black/50 px-3.5 py-2 rounded-2xl border border-white/10">
              <p className="text-[10px] text-gray-400 uppercase font-semibold">Active Cohort</p>
              <p className="text-xs font-bold text-white">{activeSession.batchName}</p>
              <p className="text-[10px] text-[#FACC15] font-mono">{activeSession.timeSlot}</p>
            </div>
          </div>

          {/* Quick Roster Stats & Quick-fill */}
          {currentBatch.students.length > 0 ? (
            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-2 text-xs">
                <span className="px-2.5 py-1 rounded-lg bg-emerald-500/15 text-emerald-400 font-bold border border-emerald-500/20">
                  {presentCount} Present
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-red-500/15 text-red-400 font-bold border border-red-500/20">
                  {absentCount} Absent
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-amber-500/15 text-amber-400 font-bold border border-amber-500/20">
                  {lateCount} Late
                </span>
              </div>

              <button
                onClick={handleMarkAllPresent}
                className="text-xs font-bold text-[#FACC15] hover:text-[#FEF08A] bg-[#FACC15]/10 hover:bg-[#FACC15]/20 px-3.5 py-1.5 rounded-xl border border-[#FACC15]/30 transition-all cursor-pointer"
              >
                ✓ Mark All Present
              </button>
            </div>
          ) : null}

          {/* Student Roster Attendance Rows */}
          <div className="space-y-2.5">
            {currentBatch.students.length === 0 ? (
              <div className="p-6 rounded-3xl bg-[#14141E] border border-white/10 text-center space-y-2">
                <p className="text-xs font-bold text-white">No Dancers Enrolled in this Cohort (0 Students)</p>
                <p className="text-[11px] text-gray-400 max-w-md mx-auto">
                  You can complete Check Out now. Completing check out logs your {durationHours} teaching hours and credits your faculty account with ${estimatedPay} automatically.
                </p>
              </div>
            ) : (
              currentBatch.students.map((student) => {
                const record = attendance.find((a) => a.studentId === student.id);
                const currentStatus = record?.status || 'present';

                return (
                  <div
                    key={student.id}
                    className="p-3.5 rounded-3xl bg-[#14141E] border border-white/[0.08] hover:border-white/20 transition-all space-y-2.5"
                  >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={student.avatarUrl}
                        alt={student.name}
                        className="w-10 h-10 rounded-2xl object-cover border border-[#FACC15]/40 shrink-0"
                      />
                      <div>
                        <p className="text-xs font-bold text-white">{student.name}</p>
                        <p className="text-[10px] text-gray-400">
                          Age {student.age} • Parent: {student.parentName}
                        </p>
                      </div>
                    </div>

                    {/* 4-State Quick Action Buttons */}
                    <div className="flex items-center gap-1.5">
                      {/* Present */}
                      <button
                        onClick={() => handleStatusChange(student.id, 'present')}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          currentStatus === 'present'
                            ? 'bg-[#FACC15] text-black shadow-gold-glow-sm font-black'
                            : 'bg-[#101017] text-gray-400 hover:text-white border border-white/10'
                        }`}
                      >
                        Present [P]
                      </button>

                      {/* Absent */}
                      <button
                        onClick={() => handleStatusChange(student.id, 'absent')}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          currentStatus === 'absent'
                            ? 'bg-red-500 text-white shadow-md font-black'
                            : 'bg-[#101017] text-gray-400 hover:text-white border border-white/10'
                        }`}
                      >
                        Absent [A]
                      </button>

                      {/* Late */}
                      <button
                        onClick={() => handleStatusChange(student.id, 'late')}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          currentStatus === 'late'
                            ? 'bg-amber-500 text-black shadow-md font-black'
                            : 'bg-[#101017] text-gray-400 hover:text-white border border-white/10'
                        }`}
                      >
                        Late [L]
                      </button>

                      {/* Excused */}
                      <button
                        onClick={() => handleStatusChange(student.id, 'excused')}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          currentStatus === 'excused'
                            ? 'bg-slate-600 text-white shadow-md font-black'
                            : 'bg-[#101017] text-gray-400 hover:text-white border border-white/10'
                        }`}
                      >
                        Excused [E]
                      </button>
                    </div>
                  </div>

                  {/* Progress Note Per Student */}
                  <input
                    type="text"
                    placeholder={`Progress comment for ${student.name.split(' ')[0]} (e.g. Mastered 8-count routine)...`}
                    value={record?.notes || ''}
                    onChange={(e) => handleStudentNoteChange(student.id, e.target.value)}
                    className="w-full bg-[#0C0C12] border border-white/5 rounded-xl px-3 py-1.5 text-xs text-gray-300 placeholder-gray-600 focus:outline-none focus:border-[#FACC15]/50"
                  />
                </div>
              );
            }))}
          </div>

          {/* Teacher Session Notes */}
          <div className="space-y-1.5 pt-1">
            <label className="text-xs font-bold text-gray-300 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-[#FACC15]" />
              <span>Faculty Session Summary & Journal (Optional)</span>
            </label>
            <textarea
              rows={2}
              value={sessionNotes}
              onChange={(e) => setSessionNotes(e.target.value)}
              placeholder="Choreography sections finalized, drills for next rehearsal, notes for studio director..."
              className="w-full bg-[#14141E] border border-white/10 rounded-2xl px-3.5 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#FACC15]"
            />
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-[#151520] px-6 py-4 border-t border-white/[0.08] flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs text-gray-300 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#FACC15]" />
            <span>
              Auto Credits <strong>+{durationHours} hrs (${estimatedPay})</strong> to {teacher.name}'s payroll.
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                sound.playClick();
                setCheckOutModalOpen(false);
              }}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-400 hover:text-white cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmitAttendance}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#FACC15] hover:bg-[#EAB308] text-black text-xs font-black shadow-gold-glow transition-all cursor-pointer"
            >
              <CheckCircle className="w-4 h-4 fill-black text-[#FACC15]" />
              <span>Complete Check Out & Log {durationHours} Hours</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
