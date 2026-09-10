import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { X, UserPlus, Phone, Mail, User, Footprints, MessageSquareText } from 'lucide-react';
import { sound } from '../../utils/sound';

export const LogLeadModal: React.FC = () => {
  const { leadModalOpen, setLeadModalOpen, leadModalDefaultType, addLead, batches, leads } = useApp();

  const [leadMode, setLeadMode] = useState<'walk_in' | 'enquiry'>('walk_in');
  const [studentName, setStudentName] = useState('');
  const [parentName, setParentName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [styleInterest, setStyleInterest] = useState(batches[0]?.name || 'Hip-Hop Juniors');
  const [ageGroup, setAgeGroup] = useState('10-12 Years');
  const [source, setSource] = useState<'Walk-In' | 'Phone Call' | 'Instagram' | 'Referral' | 'Website' | 'Front Desk Enquiry'>('Walk-In');
  const [trialDate, setTrialDate] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (leadModalOpen) {
      setLeadMode(leadModalDefaultType || 'walk_in');
      setSource(leadModalDefaultType === 'walk_in' ? 'Walk-In' : 'Phone Call');
    }
  }, [leadModalOpen, leadModalDefaultType]);

  if (!leadModalOpen) return null;

  const currentWalkIns = leads.filter((l) => l.source === 'Walk-In' || l.leadType === 'walk_in').length;
  const currentEnquiries = leads.filter((l) => l.source !== 'Walk-In' || l.leadType === 'enquiry').length;

  const handleModeSwitch = (mode: 'walk_in' | 'enquiry') => {
    sound.playClick();
    setLeadMode(mode);
    if (mode === 'walk_in') {
      setSource('Walk-In');
    } else {
      setSource('Phone Call');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName.trim() || !phone.trim()) return;

    addLead({
      studentName: studentName.trim(),
      parentName: parentName.trim() || 'Parent/Guardian',
      phone: phone.trim(),
      email: email.trim() || (leadMode === 'walk_in' ? 'walkin@ryd.studio' : 'enquiry@ryd.studio'),
      styleInterest,
      ageGroup,
      source,
      leadType: leadMode,
      status: trialDate ? 'trial_scheduled' : 'new',
      trialDate: trialDate || undefined,
      notes: notes.trim() || (leadMode === 'walk_in' ? 'Walk-in prospect logged at studio.' : 'Student inquiry logged.'),
    });

    setStudentName('');
    setParentName('');
    setPhone('');
    setEmail('');
    setTrialDate('');
    setNotes('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-lg bg-[#101017] border border-white/15 rounded-3xl overflow-hidden shadow-2xl my-auto top-sheen">
        <div className="bg-[#151520] px-6 py-4 border-b border-white/[0.08] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#FFD000] text-black flex items-center justify-center font-black shadow-gold-glow-sm">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">
                {leadMode === 'walk_in' ? 'Log Studio Walk-In Prospect' : 'Log New Student Enquiry'}
              </h2>
              <p className="text-[11px] text-gray-400">
                Live Counters: <span className="text-[#FFD000] font-bold">{currentWalkIns} Walk-Ins</span> • <span className="text-blue-400 font-bold">{currentEnquiries} Enquiries</span>
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              sound.playClick();
              setLeadModalOpen(false);
            }}
            className="p-1.5 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Lead Type Segmented Switcher */}
        <div className="px-6 pt-4">
          <div className="grid grid-cols-2 gap-1.5 p-1 bg-[#14141E] border border-white/10 rounded-2xl">
            <button
              type="button"
              onClick={() => handleModeSwitch('walk_in')}
              className={`flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                leadMode === 'walk_in'
                  ? 'bg-[#FFD000] text-black shadow-gold-glow-sm'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Footprints className="w-4 h-4" />
              <span>Walk-In Lead ({currentWalkIns})</span>
            </button>

            <button
              type="button"
              onClick={() => handleModeSwitch('enquiry')}
              className={`flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                leadMode === 'enquiry'
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <MessageSquareText className="w-4 h-4" />
              <span>Studio Enquiry ({currentEnquiries})</span>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-gray-300 block mb-1">Dancer Name *</label>
              <div className="relative">
                <User className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  placeholder="e.g. Liam Vance"
                  className="w-full bg-[#14141E] border border-white/10 rounded-2xl pl-9 pr-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#FFD000]"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-300 block mb-1">Parent / Contact Name</label>
              <input
                type="text"
                value={parentName}
                onChange={(e) => setParentName(e.target.value)}
                placeholder="e.g. Rachel Vance"
                className="w-full bg-[#14141E] border border-white/10 rounded-2xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#FFD000]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-gray-300 block mb-1">Phone Number *</label>
              <div className="relative">
                <Phone className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-3" />
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 (555) 000-0000"
                  className="w-full bg-[#14141E] border border-white/10 rounded-2xl pl-9 pr-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#FFD000]"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-300 block mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-3" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="contact@example.com"
                  className="w-full bg-[#14141E] border border-white/10 rounded-2xl pl-9 pr-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#FFD000]"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-bold text-gray-300 block mb-1">Dance Style Interest</label>
              <select
                value={styleInterest}
                onChange={(e) => setStyleInterest(e.target.value)}
                className="w-full bg-[#14141E] border border-white/10 rounded-2xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#FFD000]"
              >
                {batches.map((b) => (
                  <option key={b.id} value={b.name}>
                    {b.name}
                  </option>
                ))}
                <option value="Open Hip-Hop">Open Hip-Hop</option>
                <option value="Private Coaching">Private Coaching</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-300 block mb-1">Age Group</label>
              <select
                value={ageGroup}
                onChange={(e) => setAgeGroup(e.target.value)}
                className="w-full bg-[#14141E] border border-white/10 rounded-2xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#FFD000]"
              >
                <option value="6-9 Years">6-9 Years (Minis)</option>
                <option value="10-12 Years">10-12 Years (Juniors)</option>
                <option value="13-16 Years">13-16 Years (Teens)</option>
                <option value="17+ Years">17+ Years (Adult/Pro)</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-300 block mb-1">
                {leadMode === 'walk_in' ? 'Walk-In Entry Channel' : 'Enquiry Source Channel'}
              </label>
              <select
                value={source}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                onChange={(e) => setSource(e.target.value as any)}
                className="w-full bg-[#14141E] border border-white/10 rounded-2xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#FFD000]"
              >
                {leadMode === 'walk_in' ? (
                  <>
                    <option value="Walk-In">Walk-In (Studio Window / Lobby)</option>
                    <option value="Front Desk Enquiry">Front Desk In-Person Inquiry</option>
                  </>
                ) : (
                  <>
                    <option value="Phone Call">Phone Call Enquiry</option>
                    <option value="Instagram">Instagram / TikTok DM</option>
                    <option value="Website">Studio Website Form</option>
                    <option value="Referral">Friend / Parent Referral</option>
                  </>
                )}
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-gray-300 block mb-1">
              Book Trial Class Date (Optional)
            </label>
            <input
              type="datetime-local"
              value={trialDate}
              onChange={(e) => setTrialDate(e.target.value)}
              className="w-full bg-[#14141E] border border-white/10 rounded-2xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#FFD000]"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-gray-300 block mb-1">Observation Notes</label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Previous training background, musicality focus..."
              className="w-full bg-[#14141E] border border-white/10 rounded-2xl px-3.5 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#FFD000]"
            />
          </div>

          <div className="bg-[#151520] -mx-6 -mb-6 px-6 py-4 border-t border-white/[0.08] flex items-center justify-between">
            <button
              type="button"
              onClick={() => {
                sound.playClick();
                setLeadModalOpen(false);
              }}
              className="px-4 py-2 text-xs text-gray-400 hover:text-white cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`px-6 py-2.5 rounded-xl text-xs font-black shadow-gold-glow-sm transition-all cursor-pointer ${
                leadMode === 'walk_in'
                  ? 'glossy-button-yellow text-black'
                  : 'bg-blue-500 hover:bg-blue-600 text-white'
              }`}
            >
              {leadMode === 'walk_in'
                ? `Save Walk-In Lead (Count: ${currentWalkIns + 1})`
                : `Save Student Enquiry (Count: ${currentEnquiries + 1})`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
