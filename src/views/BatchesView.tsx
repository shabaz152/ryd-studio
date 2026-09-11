import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Batch, Student } from '../types';
import { StudioMap } from '../components/common/StudioMap';
import {
  Users,
  Clock,
  MapPin,
  ChevronRight,
  MessageSquare,
  BookOpen,
  Search,
  X,
  Plus,
  Trash2,
  Calendar,
} from 'lucide-react';
import { sound } from '../utils/sound';

export const BatchesView: React.FC = () => {
  const {
    batches,
    sessions,
    deleteBatch,
    deleteSession,
    enrollStudent,
    removeStudent,
    setComposeUpdateModalOpen,
    setOrderWorkbookModalOpen,
    setNewSessionModalOpen,
  } = useApp();
  const [selectedBatchId, setSelectedBatchId] = useState<string>(batches[0]?.id || '');
  const [filterQuery, setFilterQuery] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  // Enroll student modal state
  const [showEnrollModal, setShowEnrollModal] = useState(false);
  const [newStudentName, setNewStudentName] = useState('');
  const [newParentName, setNewParentName] = useState('');
  const [newParentPhone, setNewParentPhone] = useState('');
  const [newParentEmail, setNewParentEmail] = useState('');
  const [newStudentAge, setNewStudentAge] = useState<number | ''>(15);
  const [newStudentNotes, setNewStudentNotes] = useState('');

  const handleEnrollSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudentName.trim() || !activeBatch) return;

    enrollStudent(activeBatch.id, {
      name: newStudentName.trim(),
      parentName: newParentName.trim() || 'Parent / Guardian',
      parentPhone: newParentPhone.trim() || '+1 (555) 000-0000',
      parentEmail: newParentEmail.trim() || `${newStudentName.toLowerCase().replace(/\s+/g, '.')}@example.com`,
      age: Number(newStudentAge) || 16,
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
      notes: newStudentNotes.trim() || 'Registered cohort member',
    });

    setNewStudentName('');
    setNewParentName('');
    setNewParentPhone('');
    setNewParentEmail('');
    setNewStudentAge(15);
    setNewStudentNotes('');
    setShowEnrollModal(false);
  };

  const activeBatch = batches.find((b) => b.id === selectedBatchId) || batches[0];

  const filteredBatches = batches.filter(
    (b) =>
      b.name.toLowerCase().includes(filterQuery.toLowerCase()) ||
      b.style.toLowerCase().includes(filterQuery.toLowerCase()) ||
      b.locationName.toLowerCase().includes(filterQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
            <Users className="w-6 h-6 text-[#FACC15]" />
            <span>My Assigned Batches & Locations</span>
          </h1>
          <p className="text-xs text-gray-400">
            Assigned student cohorts, class timings, venue coordinates, and direct navigation links
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          {/* Search */}
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search cohort, venue or style..."
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              className="w-full bg-[#101017] border border-white/[0.08] rounded-2xl pl-10 pr-4 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#FFD000]"
            />
          </div>

          <button
            onClick={() => {
              sound.playClick();
              setNewSessionModalOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-2xl glossy-button-yellow text-xs font-black shadow-gold-glow-sm transition-all cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4 text-black" />
            <span>Add Batch / Schedule</span>
          </button>
        </div>
      </div>

      {/* Main Grid */}
      {batches.length === 0 ? (
        <div className="p-10 rounded-3xl bg-[#101017] border border-white/10 text-center space-y-4 shadow-card-dark top-sheen">
          <div className="w-16 h-16 rounded-3xl bg-[#FFD000]/10 border border-[#FFD000]/20 text-[#FFD000] flex items-center justify-center mx-auto">
            <Users className="w-8 h-8" />
          </div>
          <div className="max-w-md mx-auto space-y-1.5">
            <h3 className="text-base font-bold text-white">No Cohort Schedules Found</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              All student cohorts and recurring schedules have been removed. Click below to add a new schedule and cohort batch.
            </p>
          </div>
          <button
            onClick={() => setNewSessionModalOpen(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl glossy-button-yellow text-xs font-black shadow-gold-glow-sm cursor-pointer"
          >
            <Plus className="w-4 h-4 text-black" />
            <span>+ Add Batch / Schedule</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Left Column: Batches Cards */}
          <div className="lg:col-span-5 space-y-3">
            {filteredBatches.map((batch) => {
              const isSelected = batch.id === activeBatch?.id;

            return (
              <div
                key={batch.id}
                onClick={() => {
                  sound.playClick();
                  setSelectedBatchId(batch.id);
                }}
                className={`p-5 rounded-3xl border transition-all cursor-pointer shadow-card-dark ${
                  isSelected
                    ? 'bg-[#151522] border-[#FACC15] shadow-gold-glow-sm'
                    : 'bg-[#101015] border-white/[0.08] hover:border-white/20'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-2.5">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] font-black uppercase px-2.5 py-0.5 rounded-full bg-[#FACC15] text-black">
                        {batch.level}
                      </span>
                      <h3 className="text-sm font-bold text-white">{batch.name}</h3>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">{batch.style}</p>
                  </div>
                  <span className="text-[10px] font-bold text-[#FACC15] bg-black/60 px-2.5 py-1 rounded-xl border border-[#FACC15]/30 font-mono">
                    {batch.code}
                  </span>
                </div>

                <div className="space-y-1.5 text-xs text-gray-300">
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-[#FACC15]" />
                    <span className="font-semibold text-white">{batch.scheduleTime}</span>
                    <span className="text-gray-500">•</span>
                    <span className="text-gray-400">{batch.days.join(', ')}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-gray-400" />
                    <span className="truncate">{batch.locationName} ({batch.studioRoom})</span>
                  </div>
                </div>

                <div className="mt-3.5 pt-3 border-t border-white/5 flex items-center justify-between text-xs">
                  <span className="text-gray-400">
                    <strong className="text-white">{batch.students.length}</strong> enrolled students
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (window.confirm(`Delete cohort "${batch.name}" and all its scheduled sessions?`)) {
                          deleteBatch(batch.id);
                        }
                      }}
                      className="p-1.5 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
                      title="Delete Cohort Schedule"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-[#FACC15] font-bold flex items-center gap-0.5">
                      <span>Manage</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Detailed Batch Inspector, Studio Map & Roster */}
        {activeBatch && (
          <div className="lg:col-span-7 space-y-4">
            {/* Batch Venue & Embedded Map Card */}
            <div className="bg-[#101015] border border-white/[0.08] rounded-3xl p-6 space-y-4 shadow-card-dark">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-bold text-white">{activeBatch.name}</h2>
                  <p className="text-xs text-gray-400">
                    {activeBatch.locationName} • {activeBatch.studioRoom}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      if (window.confirm(`Are you sure you want to delete "${activeBatch.name}" cohort schedule and all its associated classes?`)) {
                        deleteBatch(activeBatch.id);
                      }
                    }}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-xs text-red-400 font-semibold cursor-pointer transition-all"
                    title="Delete Cohort & Schedule"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Delete Schedule</span>
                  </button>

                  <button
                    onClick={() => {
                      sound.playClick();
                      setComposeUpdateModalOpen(true);
                    }}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 dark:bg-[#181822] dark:hover:bg-[#20202E] dark:border-white/10 text-xs text-slate-800 dark:text-white font-semibold cursor-pointer transition-all shadow-xs"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-amber-600 dark:text-[#FACC15]" />
                    <span>Message Parents</span>
                  </button>

                  <button
                    onClick={() => {
                      sound.playClick();
                      setOrderWorkbookModalOpen(true);
                    }}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 dark:bg-[#181822] dark:hover:bg-[#20202E] dark:border-white/10 text-xs text-slate-800 dark:text-white font-semibold cursor-pointer transition-all shadow-xs"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-amber-600 dark:text-[#FACC15]" />
                    <span>Order Workbooks</span>
                  </button>
                </div>
              </div>

              {/* Embedded Studio Map for this location */}
              <StudioMap
                locationName={activeBatch.locationName}
                address={activeBatch.address}
                studioRoom={activeBatch.studioRoom}
                navigationUrl={activeBatch.navigationUrl}
              />
            </div>

            {/* Student Roster Section */}
            <div className="bg-[#101015] border border-white/[0.08] rounded-3xl p-6 space-y-3.5 shadow-card-dark">
              <div className="flex flex-wrap items-center justify-between gap-2.5">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Users className="w-4 h-4 text-[#FACC15]" />
                    <span>Enrolled Student Roster ({activeBatch.students.length})</span>
                  </h3>
                  <p className="text-[11px] text-gray-400">
                    Parent contact details, emergency phone, and academic study notes
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[#FACC15] bg-black/60 px-3 py-1 rounded-full border border-[#FACC15]/30">
                    {activeBatch.scheduleTime}
                  </span>
                  <button
                    onClick={() => {
                      sound.playClick();
                      setShowEnrollModal(true);
                    }}
                    className="flex items-center gap-1.5 px-3 py-1 rounded-xl glossy-button-yellow text-xs font-black shadow-gold-glow-sm cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5 text-black" />
                    <span>Enroll Student</span>
                  </button>
                </div>
              </div>

              {activeBatch.students.length === 0 ? (
                <div className="p-8 rounded-2xl bg-[#14141E] border border-white/5 text-center space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#FACC15]/10 border border-[#FACC15]/20 text-[#FACC15] flex items-center justify-center mx-auto">
                    <Users className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-white">No Students Enrolled Yet (0 Students)</h4>
                    <p className="text-xs text-gray-400 max-w-sm mx-auto">
                      There are currently 0 students registered in this cohort. Click below to register new students and begin tracking attendance.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      sound.playClick();
                      setShowEnrollModal(true);
                    }}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl glossy-button-yellow text-xs font-black shadow-gold-glow-sm cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5 text-black" />
                    <span>+ Enroll First Student</span>
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {activeBatch.students.map((student) => (
                    <div
                      key={student.id}
                      onClick={() => {
                        sound.playClick();
                        setSelectedStudent(student);
                      }}
                      className="p-3.5 rounded-2xl bg-[#14141E] border border-white/5 hover:border-[#FACC15]/40 transition-all cursor-pointer flex items-center justify-between gap-2.5 group"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={student.avatarUrl}
                          alt={student.name}
                          className="w-10 h-10 rounded-2xl object-cover border border-[#FACC15]/40 shrink-0"
                        />
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-white truncate">{student.name}</p>
                          <p className="text-[10px] text-gray-400 truncate">
                            Parent: {student.parentName}
                          </p>
                          <p className="text-[10px] text-[#FACC15] font-mono">
                            {student.parentPhone}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-[9px] font-bold uppercase px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          Enrolled
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (window.confirm(`Remove student "${student.name}" from this cohort roster?`)) {
                              removeStudent(activeBatch.id, student.id);
                            }
                          }}
                          className="p-1 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/10 opacity-60 group-hover:opacity-100 transition-all cursor-pointer"
                          title="Remove Student"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Scheduled Cohort Sessions & Class Timings */}
            <div className="bg-[#101015] border border-white/[0.08] rounded-3xl p-6 space-y-3.5 shadow-card-dark">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white">
                    Scheduled Cohort Classes ({sessions.filter((s) => s.batchId === activeBatch.id).length})
                  </h3>
                  <p className="text-[11px] text-gray-400">
                    Active sessions and timetable slots for this cohort
                  </p>
                </div>

                <button
                  onClick={() => {
                    sound.playClick();
                    setNewSessionModalOpen(true);
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl glossy-button-yellow text-xs font-black shadow-gold-glow-sm cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Class Session</span>
                </button>
              </div>

              {sessions.filter((s) => s.batchId === activeBatch.id).length === 0 ? (
                <p className="text-xs text-gray-500 italic py-2">
                  No active sessions scheduled for this cohort. Click "Add Class Session" above.
                </p>
              ) : (
                <div className="space-y-2">
                  {sessions
                    .filter((s) => s.batchId === activeBatch.id)
                    .map((sess) => (
                      <div
                        key={sess.id}
                        className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-2xl bg-[#14141E] border border-white/5 text-xs"
                      >
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-[#FFD000] font-bold bg-black/60 px-2 py-0.5 rounded-lg border border-[#FFD000]/20">
                            {sess.calendarCode || '2:3'}
                          </span>
                          <div>
                            <p className="font-bold text-white">{sess.date} • {sess.timeSlot}</p>
                            <p className="text-[10px] text-gray-400">{sess.studioRoom}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-white/10 text-gray-300">
                            {sess.status}
                          </span>
                          <button
                            onClick={() => deleteSession(sess.id)}
                            className="p-1.5 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
                            title="Delete Session"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      )}

      {/* Selected Student Details Drawer */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-sm bg-[#12121A] border border-white/15 rounded-3xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-400 uppercase">Student Profile</span>
              <button
                onClick={() => setSelectedStudent(null)}
                className="p-1 text-gray-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center gap-3.5">
              <img
                src={selectedStudent.avatarUrl}
                alt={selectedStudent.name}
                className="w-14 h-14 rounded-2xl object-cover border-2 border-[#FACC15]"
              />
              <div>
                <h3 className="text-base font-bold text-white">{selectedStudent.name}</h3>
                <p className="text-xs text-[#FACC15] font-semibold">Age {selectedStudent.age} • Active Student</p>
              </div>
            </div>

            <div className="space-y-2 text-xs bg-[#181824] p-4 rounded-2xl border border-white/5">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Parent / Contact:</span>
                <span className="text-white font-bold">{selectedStudent.parentName}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Phone:</span>
                <a
                  href={`tel:${selectedStudent.parentPhone}`}
                  className="text-[#FACC15] font-mono hover:underline font-bold"
                >
                  {selectedStudent.parentPhone}
                </a>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Email:</span>
                <span className="text-gray-300 font-mono text-[11px]">{selectedStudent.parentEmail}</span>
              </div>
            </div>

            {selectedStudent.notes && (
              <div className="p-3 bg-black/40 rounded-xl border border-white/5 text-xs">
                <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Teacher Notes</p>
                <p className="text-gray-300 text-[11px] leading-relaxed">{selectedStudent.notes}</p>
              </div>
            )}

            <div className="flex items-center gap-2 pt-1">
              <a
                href={`tel:${selectedStudent.parentPhone}`}
                className="flex-1 py-2.5 rounded-xl bg-[#FACC15] text-black font-bold text-xs text-center shadow-gold-glow-sm cursor-pointer"
              >
                Call Parent
              </a>
              <button
                onClick={() => {
                  sound.playClick();
                  setSelectedStudent(null);
                  setComposeUpdateModalOpen(true);
                }}
                className="flex-1 py-2.5 rounded-xl bg-[#1C1C28] hover:bg-[#222232] text-white font-bold text-xs text-center border border-white/10 cursor-pointer"
              >
                Send Message
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Enroll Student Modal */}
      {showEnrollModal && activeBatch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-fade-in">
          <div className="relative w-full max-w-lg bg-[#101017] border border-white/15 rounded-3xl overflow-hidden shadow-2xl my-auto top-sheen">
            {/* Header */}
            <div className="bg-[#151520] px-6 py-4 border-b border-white/[0.08] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#FACC15] text-black flex items-center justify-center font-black shadow-gold-glow-sm">
                  <Plus className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white tracking-tight">
                    Enroll Student in {activeBatch.name}
                  </h2>
                  <p className="text-[11px] text-gray-400">
                    Register student details to add them to this cohort roster
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  sound.playClick();
                  setShowEnrollModal(false);
                }}
                className="p-1.5 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleEnrollSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="text-xs font-bold text-gray-300 block mb-1">Student Name *</label>
                  <input
                    type="text"
                    required
                    value={newStudentName}
                    onChange={(e) => setNewStudentName(e.target.value)}
                    placeholder="e.g. Leo Chen"
                    className="w-full bg-[#161622] border border-white/10 rounded-2xl px-3.5 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#FACC15]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-300 block mb-1">Age</label>
                  <input
                    type="number"
                    min={4}
                    max={65}
                    value={newStudentAge}
                    onChange={(e) => setNewStudentAge(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full bg-[#161622] border border-white/10 rounded-2xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#FACC15]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-gray-300 block mb-1">Parent / Guardian Name *</label>
                  <input
                    type="text"
                    required
                    value={newParentName}
                    onChange={(e) => setNewParentName(e.target.value)}
                    placeholder="e.g. David Chen"
                    className="w-full bg-[#161622] border border-white/10 rounded-2xl px-3.5 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#FACC15]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-300 block mb-1">Parent Phone *</label>
                  <input
                    type="tel"
                    required
                    value={newParentPhone}
                    onChange={(e) => setNewParentPhone(e.target.value)}
                    placeholder="+1 (555) 234-5678"
                    className="w-full bg-[#161622] border border-white/10 rounded-2xl px-3.5 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#FACC15]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-300 block mb-1">Parent Email</label>
                <input
                  type="email"
                  value={newParentEmail}
                  onChange={(e) => setNewParentEmail(e.target.value)}
                  placeholder="parent@example.com"
                  className="w-full bg-[#161622] border border-white/10 rounded-2xl px-3.5 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#FACC15]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-300 block mb-1">Academic Strengths & Learning Notes</label>
                <textarea
                  rows={3}
                  value={newStudentNotes}
                  onChange={(e) => setNewStudentNotes(e.target.value)}
                  placeholder="e.g. Strong calculus foundations; focused on derivatives and problem-solving clarity."
                  className="w-full bg-[#161622] border border-white/10 rounded-2xl p-3 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#FACC15]"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowEnrollModal(false)}
                  className="px-4 py-2 text-xs text-gray-400 hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl glossy-button-yellow text-xs font-black shadow-gold-glow-sm cursor-pointer"
                >
                  Enroll Student
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
