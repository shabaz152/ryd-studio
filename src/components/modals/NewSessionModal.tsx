import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  CalendarPlus,
  Clock,
  MapPin,
  Users,
  Calendar,
  Layers,
  Radio,
  CheckCircle2,
  BellRing,
} from 'lucide-react';
import { sound } from '../../utils/sound';

export const NewSessionModal: React.FC = () => {
  const {
    newSessionModalOpen,
    setNewSessionModalOpen,
    batches,
    createNewSession,
    addNewBatch,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'session' | 'batch'>('session');

  // Session Form State
  const [selectedBatchId, setSelectedBatchId] = useState(batches[0]?.id || 'custom');
  const [customBatchName, setCustomBatchName] = useState('');
  const [sessionType, setSessionType] = useState('Regular Studio Class');
  const [date, setDate] = useState('2026-09-10');
  const [timeSlot, setTimeSlot] = useState('16:00 - 17:30');
  const [durationMinutes, setDurationMinutes] = useState(90);
  const [studioRoom, setStudioRoom] = useState('Studio Alpha - Hall 1');
  const [locationName, setLocationName] = useState('RYD Downtown Central');
  const [notifyParents, setNotifyParents] = useState(true);

  // Batch Form State
  const [newBatchName, setNewBatchName] = useState('');
  const [newBatchCode, setNewBatchCode] = useState('');
  const [newBatchStyle, setNewBatchStyle] = useState('Street Jazz & Lyrical');
  const [newBatchLevel, setNewBatchLevel] = useState<'Beginner' | 'Intermediate' | 'Advanced' | 'Masterclass'>('Intermediate');
  const [newBatchDays, setNewBatchDays] = useState<string[]>(['Mon', 'Wed', 'Fri']);
  const [newBatchTime, setNewBatchTime] = useState('17:00 - 18:30');
  const [newBatchRoom, setNewBatchRoom] = useState('Studio Alpha - Hall 1');
  const [newBatchLocation, setNewBatchLocation] = useState('RYD Downtown Central');
  const [autoScheduleToday, setAutoScheduleToday] = useState(true);

  if (!newSessionModalOpen) return null;

  const timePresets = ['15:00 - 16:30', '16:00 - 17:30', '18:00 - 19:30', '19:45 - 21:15'];
  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const toggleDay = (day: string) => {
    sound.playClick();
    if (newBatchDays.includes(day)) {
      if (newBatchDays.length > 1) {
        setNewBatchDays(newBatchDays.filter((d) => d !== day));
      }
    } else {
      setNewBatchDays([...newBatchDays, day]);
    }
  };

  const handleSessionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createNewSession({
      batchId: selectedBatchId,
      customBatchName: selectedBatchId === 'custom' ? customBatchName : undefined,
      date,
      timeSlot,
      studioRoom,
      locationName,
      type: sessionType,
      durationMinutes,
      sendParentNotification: notifyParents,
    });
  };

  const handleBatchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBatchName.trim()) return;

    addNewBatch({
      name: newBatchName.trim(),
      code: newBatchCode.trim() || undefined,
      style: newBatchStyle,
      level: newBatchLevel,
      scheduleTime: newBatchTime,
      days: newBatchDays,
      studioRoom: newBatchRoom,
      locationName: newBatchLocation,
      autoScheduleToday,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-xl glossy-card border border-white/15 rounded-3xl overflow-hidden shadow-2xl my-auto top-sheen">
        {/* Header */}
        <div className="p-5 border-b border-white/[0.08] flex items-center justify-between bg-black/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl glossy-button-yellow flex items-center justify-center font-black">
              <CalendarPlus className="w-5 h-5 text-black" />
            </div>
            <div>
              <h2 className="text-base font-black text-white tracking-tight">
                Add Schedule & Sessions
              </h2>
              <p className="text-[11px] text-gray-400 font-medium">
                Schedule one-off sessions or setup new recurring cohort batches
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              sound.playClick();
              setNewSessionModalOpen(false);
            }}
            className="p-1.5 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="px-5 pt-4 pb-1 flex gap-2 border-b border-white/[0.06] bg-black/20">
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              setActiveTab('session');
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'session'
                ? 'glossy-button-yellow shadow-gold-glow-sm'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Single Class / Session</span>
          </button>
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              setActiveTab('batch');
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'batch'
                ? 'glossy-button-yellow shadow-gold-glow-sm'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>New Recurring Cohort Schedule</span>
          </button>
        </div>

        {/* Tab 1: Single Session Form */}
        {activeTab === 'session' && (
          <form onSubmit={handleSessionSubmit} className="p-5 space-y-4 max-h-[72vh] overflow-y-auto">
            {/* Batch Selection */}
            <div>
              <label className="text-xs font-bold text-gray-300 block mb-1.5">
                Target Batch or Cohort
              </label>
              <select
                value={selectedBatchId}
                onChange={(e) => {
                  setSelectedBatchId(e.target.value);
                  const b = batches.find((item) => item.id === e.target.value);
                  if (b) {
                    setStudioRoom(b.studioRoom);
                    setLocationName(b.locationName);
                  }
                }}
                className="w-full bg-[#101018] border border-white/10 rounded-2xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#FFD000]"
              >
                {batches.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name} ({b.style} • {b.level})
                  </option>
                ))}
                <option value="custom">+ Custom Session / Masterclass Workshop</option>
              </select>
            </div>

            {selectedBatchId === 'custom' && (
              <div className="space-y-3 p-3.5 rounded-2xl bg-[#0B0B12] border border-[#FFD000]/30 animate-scale-in">
                <span className="text-[10px] font-bold text-[#FFD000] uppercase tracking-wider block">
                  Custom Event Details
                </span>
                <div>
                  <label className="text-xs font-bold text-gray-300 block mb-1">
                    Event / Workshop Title
                  </label>
                  <input
                    type="text"
                    required
                    value={customBatchName}
                    onChange={(e) => setCustomBatchName(e.target.value)}
                    placeholder="e.g. Calculus Olympiad Workshop - Room 1"
                    className="w-full bg-[#151520] border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#FFD000]"
                  />
                </div>
              </div>
            )}

            {/* Session Type */}
            <div>
              <label className="text-xs font-bold text-gray-300 block mb-1.5">
                Session Purpose / Category
              </label>
              <select
                value={sessionType}
                onChange={(e) => setSessionType(e.target.value)}
                className="w-full bg-[#101018] border border-white/10 rounded-2xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#FFD000]"
              >
                <option value="Regular Tutoring Session">Regular Tutoring Session</option>
                <option value="Exam Prep Clinic">Exam Prep Clinic</option>
                <option value="Problem Solving Workshop">Problem Solving Workshop</option>
                <option value="STEM Masterclass">STEM Masterclass</option>
                <option value="Diagnostic & Skill Evaluation">Diagnostic & Skill Evaluation</option>
                <option value="Private 1:1 Tutoring">Private 1:1 Tutoring</option>
              </select>
            </div>

            {/* Date Selection */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-gray-300">Session Date</label>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setDate('2026-09-10')}
                    className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer ${
                      date === '2026-09-10' ? 'bg-[#FFD000] text-black' : 'text-gray-400 bg-white/5'
                    }`}
                  >
                    Today
                  </button>
                  <button
                    type="button"
                    onClick={() => setDate('2026-09-11')}
                    className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer ${
                      date === '2026-09-11' ? 'bg-[#FFD000] text-black' : 'text-gray-400 bg-white/5'
                    }`}
                  >
                    Tomorrow
                  </button>
                  <button
                    type="button"
                    onClick={() => setDate('2026-09-13')}
                    className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer ${
                      date === '2026-09-13' ? 'bg-[#FFD000] text-black' : 'text-gray-400 bg-white/5'
                    }`}
                  >
                    Saturday
                  </button>
                </div>
              </div>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-[#101018] border border-white/10 rounded-2xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#FFD000]"
              />
            </div>

            {/* Time Slot & Duration */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-300 block">Class Timing Slot</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {timePresets.map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => {
                      sound.playClick();
                      setTimeSlot(slot);
                    }}
                    className={`py-1.5 px-2 rounded-xl text-[11px] font-bold border transition-all cursor-pointer ${
                      timeSlot === slot
                        ? 'bg-[#FFD000]/15 border-[#FFD000] text-[#FFD000]'
                        : 'bg-[#101018] border-white/10 text-gray-400 hover:text-white'
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
              <input
                type="text"
                required
                value={timeSlot}
                onChange={(e) => setTimeSlot(e.target.value)}
                placeholder="or enter custom time e.g. 14:00 - 15:30"
                className="w-full bg-[#101018] border border-white/10 rounded-2xl px-3.5 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#FFD000]"
              />
            </div>

            {/* Duration */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <div>
                <label className="text-xs font-bold text-gray-300 block mb-1">Duration</label>
                <select
                  value={durationMinutes}
                  onChange={(e) => setDurationMinutes(Number(e.target.value))}
                  className="w-full bg-[#101018] border border-white/10 rounded-2xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#FFD000]"
                >
                  <option value={60}>60 Minutes (1.0 hr)</option>
                  <option value={90}>90 Minutes (1.5 hrs)</option>
                  <option value={120}>120 Minutes (2.0 hrs)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-300 block mb-1">Studio Hall</label>
                <input
                  type="text"
                  required
                  value={studioRoom}
                  onChange={(e) => setStudioRoom(e.target.value)}
                  className="w-full bg-[#101018] border border-white/10 rounded-2xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#FFD000]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-300 block mb-1">Location</label>
                <input
                  type="text"
                  required
                  value={locationName}
                  onChange={(e) => setLocationName(e.target.value)}
                  className="w-full bg-[#101018] border border-white/10 rounded-2xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#FFD000]"
                />
              </div>
            </div>

            {/* Parent Notification Toggle */}
            <div className="p-3.5 rounded-2xl bg-[#101018] border border-white/[0.08] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <BellRing className="w-4 h-4 text-[#FFD000]" />
                <div>
                  <p className="text-xs font-bold text-white">Broadcast to Parent Portals</p>
                  <p className="text-[10px] text-gray-400">
                    Dispatches in-app notification & calendar sync alert
                  </p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={notifyParents}
                onChange={(e) => setNotifyParents(e.target.checked)}
                className="w-4 h-4 accent-[#FFD000] cursor-pointer"
              />
            </div>

            {/* Calendar Code Preview Box */}
            <div className="p-3 rounded-2xl bg-black/40 border border-white/10 flex items-center justify-between text-xs">
              <span className="text-gray-400 font-mono">Structured Code Preview:</span>
              <span className="font-mono font-bold text-[#FFD000] bg-[#FFD000]/10 px-2.5 py-0.5 rounded-lg border border-[#FFD000]/30">
                2:5sch
              </span>
            </div>

            {/* Modal Actions */}
            <div className="pt-2 border-t border-white/[0.08] flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  setNewSessionModalOpen(false);
                }}
                className="px-4 py-2 text-xs text-gray-400 hover:text-white cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl glossy-button-yellow text-xs font-black shadow-gold-glow-sm transition-all cursor-pointer flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Add Session to Schedule</span>
              </button>
            </div>
          </form>
        )}

        {/* Tab 2: New Recurring Batch Schedule */}
        {activeTab === 'batch' && (
          <form onSubmit={handleBatchSubmit} className="p-5 space-y-4 max-h-[72vh] overflow-y-auto">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="text-xs font-bold text-gray-300 block mb-1">
                  Cohort / Batch Name
                </label>
                <input
                  type="text"
                  required
                  value={newBatchName}
                  onChange={(e) => setNewBatchName(e.target.value)}
                  placeholder="e.g. Afrobeat Vibes Crew"
                  className="w-full bg-[#101018] border border-white/10 rounded-2xl px-3.5 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#FFD000]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-300 block mb-1">
                  Cohort Code
                </label>
                <input
                  type="text"
                  value={newBatchCode}
                  onChange={(e) => setNewBatchCode(e.target.value)}
                  placeholder="RYD-BIO-01"
                  className="w-full bg-[#101018] border border-white/10 rounded-2xl px-3.5 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#FFD000] font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-gray-300 block mb-1">Academic Subject / Curriculum</label>
                <input
                  type="text"
                  required
                  value={newBatchStyle}
                  onChange={(e) => setNewBatchStyle(e.target.value)}
                  placeholder="e.g. AP Biology & Genetics"
                  className="w-full bg-[#101018] border border-white/10 rounded-2xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#FFD000]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-300 block mb-1">Skill Level</label>
                <select
                  value={newBatchLevel}
                  onChange={(e) =>
                    setNewBatchLevel(e.target.value as 'Beginner' | 'Intermediate' | 'Advanced' | 'Masterclass')
                  }
                  className="w-full bg-[#101018] border border-white/10 rounded-2xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#FFD000]"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                  <option value="Masterclass">Masterclass</option>
                </select>
              </div>
            </div>

            {/* Weekly Days Multi-Select */}
            <div>
              <label className="text-xs font-bold text-gray-300 block mb-1.5">
                Weekly Tutoring Days
              </label>
              <div className="flex flex-wrap gap-2">
                {weekDays.map((day) => {
                  const isSelected = newBatchDays.includes(day);
                  return (
                    <button
                      key={day}
                      type="button"
                      onClick={() => toggleDay(day)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#FFD000] text-black border-[#FFD000] font-black'
                          : 'bg-[#101018] text-gray-400 border-white/10 hover:text-white'
                      }`}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Standard Timings & Venue */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-bold text-gray-300 block mb-1">Class Time</label>
                <input
                  type="text"
                  required
                  value={newBatchTime}
                  onChange={(e) => setNewBatchTime(e.target.value)}
                  placeholder="17:00 - 18:30"
                  className="w-full bg-[#101018] border border-white/10 rounded-2xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#FFD000]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-300 block mb-1">Studio Room</label>
                <input
                  type="text"
                  required
                  value={newBatchRoom}
                  onChange={(e) => setNewBatchRoom(e.target.value)}
                  className="w-full bg-[#101018] border border-white/10 rounded-2xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#FFD000]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-300 block mb-1">Location</label>
                <input
                  type="text"
                  required
                  value={newBatchLocation}
                  onChange={(e) => setNewBatchLocation(e.target.value)}
                  className="w-full bg-[#101018] border border-white/10 rounded-2xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#FFD000]"
                />
              </div>
            </div>

            {/* Auto-Schedule Today Checkbox */}
            <div className="p-3.5 rounded-2xl bg-[#101018] border border-white/[0.08] flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-white">Auto-Schedule Initial Class for Today</p>
                <p className="text-[10px] text-gray-400">
                  Immediately populates into Today's Studio Sessions list
                </p>
              </div>
              <input
                type="checkbox"
                checked={autoScheduleToday}
                onChange={(e) => setAutoScheduleToday(e.target.checked)}
                className="w-4 h-4 accent-[#FFD000] cursor-pointer"
              />
            </div>

            {/* Modal Actions */}
            <div className="pt-2 border-t border-white/[0.08] flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  setNewSessionModalOpen(false);
                }}
                className="px-4 py-2 text-xs text-gray-400 hover:text-white cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl glossy-button-yellow text-xs font-black shadow-gold-glow-sm transition-all cursor-pointer flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Create Batch & Schedule</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
