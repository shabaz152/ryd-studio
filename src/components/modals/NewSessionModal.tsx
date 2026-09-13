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
  Sparkles,
  Music,
  BookOpen,
  Palette,
  Heart,
} from 'lucide-react';
import { sound } from '../../utils/sound';
import { DISCIPLINE_PRESETS } from '../../data/mockData';

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
  const [sessionCategory, setSessionCategory] = useState<string>('dance');
  const [customSessionName, setCustomSessionName] = useState<string>('');
  const [selectedBatchId, setSelectedBatchId] = useState<string>('custom');
  const [classFormat, setClassFormat] = useState('Regular Group Class');
  const [date, setDate] = useState('2026-09-13');
  const [timeSlot, setTimeSlot] = useState('17:00 - 18:30');
  const [durationMinutes, setDurationMinutes] = useState(90);
  const [studioRoom, setStudioRoom] = useState('Dance Studio Alpha (Mirror Hall)');
  const [locationName, setLocationName] = useState('RYD Performing Arts & Learning Hub');
  const [notifyParents, setNotifyParents] = useState(true);

  // Batch Form State
  const [batchCategory, setBatchCategory] = useState<string>('dance');
  const [newBatchName, setNewBatchName] = useState('');
  const [newBatchCode, setNewBatchCode] = useState('');
  const [newBatchStyle, setNewBatchStyle] = useState('Classical & Contemporary');
  const [newBatchLevel, setNewBatchLevel] = useState<'Beginner' | 'Intermediate' | 'Advanced' | 'Masterclass'>('Beginner');
  const [newBatchDays, setNewBatchDays] = useState<string[]>(['Mon', 'Wed', 'Fri']);
  const [newBatchTime, setNewBatchTime] = useState('17:00 - 18:30');
  const [newBatchRoom, setNewBatchRoom] = useState('Dance Studio Alpha (Mirror Hall)');
  const [newBatchLocation, setNewBatchLocation] = useState('RYD Performing Arts & Learning Hub');
  const [autoScheduleToday, setAutoScheduleToday] = useState(true);

  if (!newSessionModalOpen) return null;

  const timePresets = ['15:00 - 16:30', '16:00 - 17:30', '17:00 - 18:30', '18:30 - 19:45', '19:45 - 21:00'];
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

  const handleApplySuggestion = (name: string) => {
    sound.playClick();
    setCustomSessionName(name);
  };

  const handleCategoryChange = (catId: string) => {
    sound.playClick();
    setSessionCategory(catId);
    // Auto-update room suggestion based on category
    if (catId === 'dance') {
      setStudioRoom('Dance Studio Alpha (Mirror Hall)');
    } else if (catId === 'music') {
      setStudioRoom('Acoustic Sound Suite 2');
    } else if (catId === 'tuition') {
      setStudioRoom('Tutoring Classroom Pod 1');
    } else if (catId === 'art') {
      setStudioRoom('Creative Art Atelier Room 4');
    } else if (catId === 'fitness') {
      setStudioRoom('Yoga & Wellness Floor 2');
    }
  };

  const handleBatchCategoryChange = (catId: string) => {
    sound.playClick();
    setBatchCategory(catId);
    if (catId === 'dance') {
      setNewBatchStyle('Classical & Contemporary');
      setNewBatchRoom('Dance Studio Alpha (Mirror Hall)');
      setNewBatchName('Classical Dance Evening Group');
    } else if (catId === 'music') {
      setNewBatchStyle('Acoustic Guitar & Western Vocals');
      setNewBatchRoom('Acoustic Sound Suite 2');
      setNewBatchName('Beginner Guitar & Vocals Group');
    } else if (catId === 'tuition') {
      setNewBatchStyle('Pure Mathematics & Problem Solving');
      setNewBatchRoom('Tutoring Classroom Pod 1');
      setNewBatchName('Grade 10 Mathematics Revision');
    } else if (catId === 'art') {
      setNewBatchStyle('Painting & Digital Art');
      setNewBatchRoom('Creative Art Atelier Room 4');
      setNewBatchName('Weekend Painting & Sketching');
    } else if (catId === 'fitness') {
      setNewBatchStyle('Yoga & Flexibility');
      setNewBatchRoom('Yoga & Wellness Floor 2');
      setNewBatchName('Morning Hatha Yoga Batch');
    }
  };

  const handleSessionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalSessionName = customSessionName.trim() || (selectedBatchId !== 'custom' ? batches.find(b => b.id === selectedBatchId)?.name : 'Special Session');

    createNewSession({
      batchId: selectedBatchId,
      sessionName: finalSessionName,
      customBatchName: finalSessionName,
      disciplineCategory: sessionCategory,
      date,
      timeSlot,
      studioRoom,
      locationName,
      type: classFormat,
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
      disciplineCategory: batchCategory,
      style: newBatchStyle,
      level: newBatchLevel,
      scheduleTime: newBatchTime,
      days: newBatchDays,
      studioRoom: newBatchRoom,
      locationName: newBatchLocation,
      autoScheduleToday,
    });
  };

  const currentCategoryObj = DISCIPLINE_PRESETS.find((p) => p.id === sessionCategory) || DISCIPLINE_PRESETS[0];

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
                Add Class or Batch Schedule
              </h2>
              <p className="text-[11px] text-gray-400 font-medium">
                For dance, music, academic tuitions, arts, and all tutoring disciplines
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
            <span>Create New Batch Group</span>
          </button>
        </div>

        {/* Tab 1: Single Session Form */}
        {activeTab === 'session' && (
          <form onSubmit={handleSessionSubmit} className="p-5 space-y-4 max-h-[72vh] overflow-y-auto">
            {/* Step 1: Select Tutoring Discipline Category */}
            <div>
              <label className="text-xs font-bold text-gray-300 block mb-1.5">
                1. Select Tutoring Category
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
                {DISCIPLINE_PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => handleCategoryChange(preset.id)}
                    className={`p-2 rounded-xl text-center border transition-all cursor-pointer flex flex-col items-center gap-1 ${
                      sessionCategory === preset.id
                        ? 'bg-[#FFD000]/20 border-[#FFD000] text-white shadow-xs'
                        : 'bg-[#101018] border-white/10 text-gray-400 hover:text-white hover:border-white/20'
                    }`}
                  >
                    <span className="text-base">{preset.icon}</span>
                    <span className="text-[10px] font-bold leading-tight truncate w-full">
                      {preset.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: Custom Class / Session Name */}
            <div className="space-y-2 p-3.5 rounded-2xl bg-[#0B0B12] border border-[#FFD000]/30 animate-scale-in">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#FFD000]" />
                  <span>2. Custom Class / Session Name *</span>
                </label>
                <span className="text-[10px] text-gray-400">Custom Title</span>
              </div>

              <input
                type="text"
                required
                value={customSessionName}
                onChange={(e) => setCustomSessionName(e.target.value)}
                placeholder={`e.g. ${currentCategoryObj.suggestions[0] || 'Bollywood Dance Revision, Guitar Jam, Math Tuitions'}`}
                className="w-full bg-[#151520] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#FFD000]"
              />

              {/* Quick Suggestion Chips */}
              <div className="pt-1">
                <span className="text-[10px] text-gray-400 block mb-1">Quick Name Ideas (click to use):</span>
                <div className="flex flex-wrap gap-1.5">
                  {currentCategoryObj.suggestions.map((sug) => (
                    <button
                      key={sug}
                      type="button"
                      onClick={() => handleApplySuggestion(sug)}
                      className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-[#FFD000]/15 text-gray-300 hover:text-[#FFD000] border border-white/10 text-[10px] font-medium transition-all cursor-pointer"
                    >
                      + {sug}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Optional: Link to Existing Batch */}
            <div>
              <label className="text-xs font-bold text-gray-300 block mb-1">
                Assign to Batch Group (Optional)
              </label>
              <select
                value={selectedBatchId}
                onChange={(e) => {
                  setSelectedBatchId(e.target.value);
                  const b = batches.find((item) => item.id === e.target.value);
                  if (b) {
                    setStudioRoom(b.studioRoom);
                    setLocationName(b.locationName);
                    if (!customSessionName) {
                      setCustomSessionName(b.name);
                    }
                  }
                }}
                className="w-full bg-[#101018] border border-white/10 rounded-2xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#FFD000]"
              >
                <option value="custom">Standalone Session (No specific cohort)</option>
                {batches.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name} ({b.style} • {b.level})
                  </option>
                ))}
              </select>
            </div>

            {/* Class Format */}
            <div>
              <label className="text-xs font-bold text-gray-300 block mb-1">
                Class Format
              </label>
              <select
                value={classFormat}
                onChange={(e) => setClassFormat(e.target.value)}
                className="w-full bg-[#101018] border border-white/10 rounded-2xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#FFD000]"
              >
                <option value="Regular Group Class">Regular Group Class</option>
                <option value="1-on-1 Private Tutoring">1-on-1 Private Tutoring</option>
                <option value="Workshop & Masterclass">Workshop & Masterclass</option>
                <option value="Choreography / Practice Jam">Choreography / Practice Jam</option>
                <option value="Exam & Recital Prep">Exam & Recital Prep</option>
                <option value="Demo & Trial Class">Demo & Trial Class</option>
              </select>
            </div>

            {/* Date Selection */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-gray-300">Date of Class</label>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setDate('2026-09-13')}
                    className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer ${
                      date === '2026-09-13' ? 'bg-[#FFD000] text-black' : 'text-gray-400 bg-white/5'
                    }`}
                  >
                    Today
                  </button>
                  <button
                    type="button"
                    onClick={() => setDate('2026-09-14')}
                    className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer ${
                      date === '2026-09-14' ? 'bg-[#FFD000] text-black' : 'text-gray-400 bg-white/5'
                    }`}
                  >
                    Tomorrow
                  </button>
                  <button
                    type="button"
                    onClick={() => setDate('2026-09-19')}
                    className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer ${
                      date === '2026-09-19' ? 'bg-[#FFD000] text-black' : 'text-gray-400 bg-white/5'
                    }`}
                  >
                    Weekend
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

            {/* Timing Slot & Duration */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-300 block">Class Timing Slot</label>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5">
                {timePresets.map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => {
                      sound.playClick();
                      setTimeSlot(slot);
                    }}
                    className={`py-1.5 px-2 rounded-xl text-[10px] font-bold border transition-all cursor-pointer ${
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
                placeholder="or enter custom timing e.g. 17:30 - 18:45"
                className="w-full bg-[#101018] border border-white/10 rounded-2xl px-3.5 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#FFD000]"
              />
            </div>

            {/* Duration, Room & Location */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <div>
                <label className="text-xs font-bold text-gray-300 block mb-1">Duration</label>
                <select
                  value={durationMinutes}
                  onChange={(e) => setDurationMinutes(Number(e.target.value))}
                  className="w-full bg-[#101018] border border-white/10 rounded-2xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#FFD000]"
                >
                  <option value={45}>45 Minutes</option>
                  <option value={60}>60 Minutes (1.0 hr)</option>
                  <option value={90}>90 Minutes (1.5 hrs)</option>
                  <option value={120}>120 Minutes (2.0 hrs)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-300 block mb-1">Room / Studio</label>
                <input
                  type="text"
                  required
                  value={studioRoom}
                  onChange={(e) => setStudioRoom(e.target.value)}
                  className="w-full bg-[#101018] border border-white/10 rounded-2xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#FFD000]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-300 block mb-1">Center / Location</label>
                <input
                  type="text"
                  required
                  value={locationName}
                  onChange={(e) => setLocationName(e.target.value)}
                  className="w-full bg-[#101018] border border-white/10 rounded-2xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#FFD000]"
                />
              </div>
            </div>

            {/* Parent Notification */}
            <div className="p-3.5 rounded-2xl bg-[#101018] border border-white/[0.08] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <BellRing className="w-4 h-4 text-[#FFD000]" />
                <div>
                  <p className="text-xs font-bold text-white">Notify Students & Parents</p>
                  <p className="text-[10px] text-gray-400">
                    Sends an instant alert and calendar reminder to their portal & WhatsApp
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
                <span>Add Class to Schedule</span>
              </button>
            </div>
          </form>
        )}

        {/* Tab 2: New Recurring Batch Schedule */}
        {activeTab === 'batch' && (
          <form onSubmit={handleBatchSubmit} className="p-5 space-y-4 max-h-[72vh] overflow-y-auto">
            {/* Discipline Category */}
            <div>
              <label className="text-xs font-bold text-gray-300 block mb-1.5">
                Select Batch Discipline Category
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
                {DISCIPLINE_PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => handleBatchCategoryChange(preset.id)}
                    className={`p-2 rounded-xl text-center border transition-all cursor-pointer flex flex-col items-center gap-1 ${
                      batchCategory === preset.id
                        ? 'bg-[#FFD000]/20 border-[#FFD000] text-white shadow-xs'
                        : 'bg-[#101018] border-white/10 text-gray-400 hover:text-white hover:border-white/20'
                    }`}
                  >
                    <span className="text-base">{preset.icon}</span>
                    <span className="text-[10px] font-bold leading-tight truncate w-full">
                      {preset.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="text-xs font-bold text-gray-300 block mb-1">
                  Batch / Group Name *
                </label>
                <input
                  type="text"
                  required
                  value={newBatchName}
                  onChange={(e) => setNewBatchName(e.target.value)}
                  placeholder="e.g. Classical Bharatanatyam Evening Batch"
                  className="w-full bg-[#101018] border border-white/10 rounded-2xl px-3.5 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#FFD000]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-300 block mb-1">
                  Batch Code
                </label>
                <input
                  type="text"
                  value={newBatchCode}
                  onChange={(e) => setNewBatchCode(e.target.value)}
                  placeholder="RYD-DANCE-01"
                  className="w-full bg-[#101018] border border-white/10 rounded-2xl px-3.5 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#FFD000] font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-gray-300 block mb-1">
                  Style, Subject or Instrument
                </label>
                <input
                  type="text"
                  required
                  value={newBatchStyle}
                  onChange={(e) => setNewBatchStyle(e.target.value)}
                  placeholder="e.g. Bharatanatyam, Acoustic Guitar, Grade 10 Math"
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
                  <option value="Beginner">Beginner (Foundations)</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                  <option value="Masterclass">All Levels / Masterclass</option>
                </select>
              </div>
            </div>

            {/* Weekly Days Multi-Select */}
            <div>
              <label className="text-xs font-bold text-gray-300 block mb-1.5">
                Weekly Class Days
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
                <label className="text-xs font-bold text-gray-300 block mb-1">Room / Studio</label>
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
                <p className="text-xs font-bold text-white">Schedule First Class for Today</p>
                <p className="text-[10px] text-gray-400">
                  Adds today's session immediately to Today's Classes schedule
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
                <span>Create Batch Group</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
