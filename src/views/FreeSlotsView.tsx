import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { FreeSlot } from '../types';
import {
  CalendarClock,
  Plus,
  CheckCircle2,
  XCircle,
  Clock,
} from 'lucide-react';
import { sound } from '../utils/sound';

export const FreeSlotsView: React.FC = () => {
  const { freeSlots, toggleFreeSlot, addFreeSlot } = useApp();

  const [selectedDay, setSelectedDay] = useState<string>('Monday');
  const [newPeriod, setNewPeriod] = useState<'Morning' | 'Afternoon' | 'Evening'>('Morning');
  const [newTimeRange, setNewTimeRange] = useState('11:00 - 13:00');
  const [preferredStyle, setPreferredStyle] = useState('Open Coaching');
  const [showAddForm, setShowAddForm] = useState(false);

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const daySlots = freeSlots.filter((s) => s.dayOfWeek === selectedDay);

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addFreeSlot({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      dayOfWeek: selectedDay as any,
      period: newPeriod,
      timeRange: newTimeRange,
      isAvailable: true,
      preferredStyle: preferredStyle || undefined,
    });
    setShowAddForm(false);
  };

  const totalAvailable = freeSlots.filter((s) => s.isAvailable).length;

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
            <CalendarClock className="w-6 h-6 text-[#FACC15]" />
            <span>Free Slot Management & Dynamic Availability</span>
          </h1>
          <p className="text-xs text-gray-400">
            Configure weekly available time windows for 1-on-1 tutoring, exam review clinics, and dynamic scheduling
          </p>
        </div>

        <button
          onClick={() => {
            sound.playClick();
            setShowAddForm(!showAddForm);
          }}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#FACC15] hover:bg-[#EAB308] text-black text-xs font-black shadow-gold-glow-sm transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>{showAddForm ? 'Close Slot Creator' : 'Add Custom Slot'}</span>
        </button>
      </div>

      {/* Add Slot Drawer */}
      {showAddForm && (
        <form
          onSubmit={handleAddSubmit}
          className="p-6 rounded-3xl bg-[#12121A] border border-[#FACC15]/40 space-y-4 shadow-2xl animate-scale-in"
        >
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <CalendarClock className="w-4 h-4 text-[#FACC15]" />
            <span>Define Availability Window for {selectedDay}</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-bold text-gray-300 block mb-1.5">Period</label>
              <select
                value={newPeriod}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                onChange={(e) => setNewPeriod(e.target.value as any)}
                className="w-full bg-[#161622] border border-white/10 rounded-2xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#FACC15]"
              >
                <option value="Morning">Morning (8:00 - 12:00)</option>
                <option value="Afternoon">Afternoon (12:00 - 17:00)</option>
                <option value="Evening">Evening (17:00 - 21:00)</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-300 block mb-1.5">Exact Time Range</label>
              <input
                type="text"
                required
                value={newTimeRange}
                onChange={(e) => setNewTimeRange(e.target.value)}
                placeholder="11:00 - 13:00"
                className="w-full bg-[#161622] border border-white/10 rounded-2xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#FACC15]"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-300 block mb-1.5">Preferred Subject / Activity</label>
              <input
                type="text"
                value={preferredStyle}
                onChange={(e) => setPreferredStyle(e.target.value)}
                placeholder="e.g. 1-on-1 Calculus Clinic / SAT Drills"
                className="w-full bg-[#161622] border border-white/10 rounded-2xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#FACC15]"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 text-xs text-gray-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-[#FACC15] text-black text-xs font-bold shadow-gold-glow-sm"
            >
              Add to Schedule
            </button>
          </div>
        </form>
      )}

      {/* Weekday Selector Matrix */}
      <div className="flex overflow-x-auto gap-2 p-1.5 rounded-2xl bg-[#101015] border border-white/[0.08] no-scrollbar">
        {daysOfWeek.map((day) => {
          const isSelected = selectedDay === day;
          const count = freeSlots.filter((s) => s.dayOfWeek === day && s.isAvailable).length;

          return (
            <button
              key={day}
              onClick={() => {
                sound.playClick();
                setSelectedDay(day);
              }}
              className={`flex-1 min-w-[95px] py-3 px-2.5 rounded-2xl text-center transition-all cursor-pointer ${
                isSelected
                  ? 'bg-[#FACC15] text-black font-black shadow-gold-glow-sm scale-[1.02]'
                  : 'bg-[#14141E] hover:bg-[#1A1A26] text-gray-300 border border-white/5'
              }`}
            >
              <p className={`text-xs font-bold ${isSelected ? 'text-black' : 'text-white'}`}>
                {day.slice(0, 3)}
              </p>
              <span
                className={`text-[10px] font-semibold mt-0.5 inline-block ${
                  isSelected ? 'text-black/80' : 'text-[#FACC15]'
                }`}
              >
                {count} Free Slots
              </span>
            </button>
          );
        })}
      </div>

      {/* Slots for Selected Day */}
      <div className="space-y-3.5">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-black text-gray-400 uppercase tracking-widest">
            {selectedDay} Time Windows ({daySlots.length} Slots)
          </h2>
          <span className="text-xs text-gray-400">
            Total active slots this week: <strong className="text-[#FACC15]">{totalAvailable}</strong>
          </span>
        </div>

        {daySlots.length === 0 ? (
          <div className="p-10 text-center bg-[#101015] border border-white/[0.08] rounded-3xl space-y-2">
            <Clock className="w-8 h-8 text-gray-600 mx-auto" />
            <p className="text-xs font-bold text-gray-300">No time slots configured for {selectedDay}</p>
            <button
              onClick={() => setShowAddForm(true)}
              className="text-xs text-[#FACC15] underline font-bold"
            >
              Click here to add an available slot
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {daySlots.map((slot) => (
              <div
                key={slot.id}
                onClick={() => toggleFreeSlot(slot.id)}
                className={`p-5 rounded-3xl border transition-all cursor-pointer flex items-center justify-between gap-3 shadow-card-dark ${
                  slot.isAvailable
                    ? 'bg-[#151522] border-[#FACC15]/40 shadow-gold-glow-sm'
                    : 'bg-[#101015] border-white/5 opacity-60'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${
                        slot.isAvailable
                          ? 'bg-[#FACC15] text-black'
                          : 'bg-white/10 text-gray-400'
                      }`}
                    >
                      {slot.period}
                    </span>
                    <span className="text-xs font-bold text-white font-mono">{slot.timeRange}</span>
                  </div>

                  <p className="text-xs text-gray-400">
                    {slot.preferredStyle || 'Open Availability'}
                  </p>
                </div>

                <div className="text-right shrink-0">
                  {slot.isAvailable ? (
                    <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-bold">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Available</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 text-gray-500 text-xs font-bold">
                      <XCircle className="w-4 h-4" />
                      <span>Busy</span>
                    </div>
                  )}
                  <span className="text-[10px] text-gray-500 block mt-1">Tap to toggle</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
