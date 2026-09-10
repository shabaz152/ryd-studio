import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ReferralProgressStage, ReferredCandidate } from '../types';
import {
  Share2,
  Copy,
  Activity,
  Users2,
  DollarSign,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  UserPlus,
  Phone,
  Mail,
  Edit2,
  Check,
  Clock,
  Download,
} from 'lucide-react';
import { sound } from '../utils/sound';

export const ReferralView: React.FC = () => {
  const {
    referralStats,
    shareReferralInvite,
    teacher,
    setTeacherName,
    updateCandidateStage,
    addCandidateReferral,
  } = useApp();

  // Name customization state
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(teacher.name);

  // New candidate form modal/drawer
  const [showAddCandidate, setShowAddCandidate] = useState(false);
  const [newCandName, setNewCandName] = useState('');
  const [newCandEmail, setNewCandEmail] = useState('');
  const [newCandPhone, setNewCandPhone] = useState('');
  const [newCandSpecialty, setNewCandSpecialty] = useState('Urban Choreography & Popping');
  const [newCandNotes, setNewCandNotes] = useState('');

  // Filter stage
  const [filterStage, setFilterStage] = useState<string>('all');

  const shareUrl = `https://ryd.studio/faculty/join?code=${referralStats.referralCode}&ref=${encodeURIComponent(
    teacher.name
  )}`;

  const handleWhatsAppShare = () => {
    sound.playClick();
    const text = encodeURIComponent(
      `Coach ${teacher.name} has invited you to join the RYD STUDIO Faculty. Apply with exclusive referral code ${referralStats.referralCode}: ${shareUrl}`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const handleNameSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (tempName.trim()) {
      setTeacherName(tempName.trim());
      setIsEditingName(false);
    }
  };

  const handleAddCandidateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCandName.trim()) return;

    addCandidateReferral({
      candidateName: newCandName.trim(),
      email: newCandEmail.trim() || 'candidate@dancefaculty.com',
      phone: newCandPhone.trim() || '+1 (555) 000-1234',
      specialty: newCandSpecialty,
      notes: newCandNotes.trim() || undefined,
    });

    setNewCandName('');
    setNewCandEmail('');
    setNewCandPhone('');
    setNewCandNotes('');
    setShowAddCandidate(false);
  };

  const stages: { key: ReferralProgressStage; label: string; stepNumber: number; description: string }[] = [
    {
      key: 'starting_referral',
      label: 'Starting Referral',
      stepNumber: 1,
      description: 'Candidate applied via coach referral code • Portfolio in review',
    },
    {
      key: 'interview',
      label: 'Interview',
      stepNumber: 2,
      description: 'Studio demo audition & faculty interview with Artistic Director',
    },
    {
      key: 'selected',
      label: 'Selected',
      stepNumber: 3,
      description: 'Audition passed • Selected for studio roster & contract offer',
    },
    {
      key: 'successfully_joined',
      label: 'Successfully Joined',
      stepNumber: 4,
      description: 'Onboarded & verified • $150 compensation bonus credited to payroll',
    },
  ];

  const getStageBadge = (stage: ReferralProgressStage) => {
    switch (stage) {
      case 'starting_referral':
        return (
          <span className="px-2.5 py-0.5 rounded-full bg-blue-500/15 text-blue-400 border border-blue-500/30 text-[10px] font-bold uppercase">
            1. Starting Referral
          </span>
        );
      case 'interview':
        return (
          <span className="px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30 text-[10px] font-bold uppercase">
            2. Interview
          </span>
        );
      case 'selected':
        return (
          <span className="px-2.5 py-0.5 rounded-full bg-purple-500/15 text-purple-400 border border-purple-500/30 text-[10px] font-bold uppercase">
            3. Selected
          </span>
        );
      case 'successfully_joined':
        return (
          <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold uppercase">
            4. Successfully Joined (+$150)
          </span>
        );
    }
  };

  const advanceCandidate = (candidate: ReferredCandidate) => {
    if (candidate.stage === 'starting_referral') {
      updateCandidateStage(candidate.id, 'interview');
    } else if (candidate.stage === 'interview') {
      updateCandidateStage(candidate.id, 'selected');
    } else if (candidate.stage === 'selected') {
      updateCandidateStage(candidate.id, 'successfully_joined');
    }
  };

  const candidatesList = referralStats.candidates || [];
  const filteredCandidates = candidatesList.filter(
    (c) => filterStage === 'all' || c.stage === filterStage
  );

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
            <Share2 className="w-6 h-6 text-[#FFD000]" />
            <span>Faculty Referral Program & Hiring Progress</span>
          </h1>
          <p className="text-xs text-gray-400">
            Invite fellow instructors, track audition stages from referral to onboarding, and earn $150 per hire
          </p>
        </div>

        <button
          onClick={() => {
            sound.playClick();
            setShowAddCandidate(!showAddCandidate);
          }}
          className="flex items-center gap-2 px-5 py-2.5 rounded-2xl glossy-button-yellow text-xs font-black shadow-gold-glow-sm transition-all cursor-pointer"
        >
          <UserPlus className="w-4 h-4 text-black" />
          <span>{showAddCandidate ? 'Close Form' : '+ Refer New Instructor'}</span>
        </button>
      </div>

      {/* Referral Link & Custom QR Code Section */}
      <div className="relative overflow-hidden rounded-3xl glossy-card p-6 sm:p-8 shadow-card-dark space-y-6 top-sheen">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-8 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full glossy-pill-yellow text-[#FFD000] text-xs font-bold uppercase tracking-wider">
                <Activity className="w-3.5 h-3.5" />
                <span>Earn $150 Per Successfully Joined Instructor</span>
              </div>

              {/* Editable Name Trigger */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400 font-medium">Referring As:</span>
                {isEditingName ? (
                  <form onSubmit={handleNameSave} className="inline-flex items-center gap-1.5">
                    <input
                      type="text"
                      value={tempName}
                      onChange={(e) => setTempName(e.target.value)}
                      autoFocus
                      className="bg-[#12121A] border border-[#FFD000] rounded-xl px-2.5 py-1 text-xs font-bold text-[#FFD000] focus:outline-none"
                    />
                    <button
                      type="submit"
                      className="p-1.5 rounded-lg glossy-button-yellow text-black cursor-pointer shadow-sm"
                      title="Save Name"
                    >
                      <Check className="w-3.5 h-3.5" />
                    </button>
                  </form>
                ) : (
                  <button
                    onClick={() => {
                      sound.playClick();
                      setTempName(teacher.name);
                      setIsEditingName(true);
                    }}
                    className="flex items-center gap-1.5 text-xs font-bold text-[#FFD000] bg-[#FFD000]/10 px-3 py-1 rounded-xl border border-[#FFD000]/30 hover:bg-[#FFD000]/20 transition-all cursor-pointer"
                    title="Click to customize referral name and link"
                  >
                    <span>{teacher.name}</span>
                    <Edit2 className="w-3 h-3 text-[#FFD000]" />
                  </button>
                )}
              </div>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight">
              Expand the RYD STUDIO roster. Share your personalized faculty link.
            </h2>

            <p className="text-xs sm:text-sm text-gray-300 max-w-xl leading-relaxed">
              When an instructor applies using your custom referral code or QR code, track their interview journey from initial application to their first 30 days. Both of you receive masterclass priority.
            </p>

            {/* Share Code Box */}
            <div className="p-4 rounded-2xl bg-[#08080C] border border-white/10 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider block">
                    Your Unique Referral Code (Auto-synced with Name)
                  </span>
                  <span className="text-xl sm:text-2xl font-black text-[#FFD000] font-mono tracking-widest">
                    {referralStats.referralCode}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={shareReferralInvite}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl glossy-button-yellow text-xs font-black shadow-gold-glow-sm transition-all cursor-pointer"
                  >
                    <Copy className="w-4 h-4" />
                    <span>Copy Link</span>
                  </button>
                  <button
                    onClick={handleWhatsAppShare}
                    className="p-2.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 border border-emerald-500/30 transition-all cursor-pointer"
                    title="Share via WhatsApp"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="pt-2 border-t border-white/5 flex items-center gap-2 text-xs text-gray-400 truncate">
                <span className="font-mono text-gray-500 shrink-0">Link:</span>
                <span className="truncate font-mono text-gray-300">{shareUrl}</span>
              </div>
            </div>
          </div>

          {/* Right: Studio QR Code with Teacher Name Branding */}
          <div className="lg:col-span-4 flex flex-col items-center justify-center p-6 rounded-3xl bg-[#08080C] border border-white/10 text-center relative">
            <div className="w-40 h-40 rounded-2xl bg-white p-3 shadow-gold-glow flex items-center justify-center relative">
              <svg viewBox="0 0 100 100" className="w-full h-full text-black">
                <rect width="100" height="100" fill="white" />
                <rect x="10" y="10" width="30" height="30" fill="black" />
                <rect x="15" y="15" width="20" height="20" fill="white" />
                <rect x="20" y="20" width="10" height="10" fill="black" />

                <rect x="60" y="10" width="30" height="30" fill="black" />
                <rect x="65" y="15" width="20" height="20" fill="white" />
                <rect x="70" y="20" width="10" height="10" fill="black" />

                <rect x="10" y="60" width="30" height="30" fill="black" />
                <rect x="15" y="65" width="20" height="20" fill="white" />
                <rect x="20" y="70" width="10" height="10" fill="black" />

                <rect x="50" y="50" width="10" height="10" fill="black" />
                <rect x="70" y="50" width="10" height="10" fill="black" />
                <rect x="50" y="70" width="20" height="10" fill="black" />
                <rect x="80" y="70" width="10" height="20" fill="black" />
              </svg>
            </div>

            <div className="mt-3 text-center space-y-0.5">
              <span className="text-xs font-bold text-white block">
                Coach {teacher.name}
              </span>
              <span className="text-[10px] text-[#FFD000] font-mono block">
                Code: {referralStats.referralCode}
              </span>
              <span className="text-[10px] text-gray-500 uppercase tracking-wider block pt-1">
                Scan In-Studio or at Reception Desk
              </span>
            </div>
          </div>
        </div>

        {/* Analytics Summary */}
        <div className="pt-4 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-4 rounded-2xl bg-[#08080C] border border-white/10">
            <span className="text-[10px] text-gray-400 font-bold uppercase">Total Invites Sent</span>
            <p className="text-2xl font-black text-white mt-0.5">{referralStats.invitesSent}</p>
          </div>
          <div className="p-4 rounded-2xl bg-[#08080C] border border-white/10">
            <span className="text-[10px] text-purple-400 font-bold uppercase">In Audition Pipeline</span>
            <p className="text-2xl font-black text-purple-400 mt-0.5">
              {candidatesList.filter((c) => c.stage !== 'successfully_joined').length}
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-[#08080C] border border-white/10">
            <span className="text-[10px] text-emerald-400 font-bold uppercase">Successfully Joined</span>
            <p className="text-2xl font-black text-emerald-400 mt-0.5">
              {referralStats.onboardedTeachers}
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-[#08080C] border border-white/10">
            <span className="text-[10px] text-[#FFD000] font-bold uppercase">Total Bonus Earned</span>
            <p className="text-2xl font-black text-[#FFD000] mt-0.5">${referralStats.bonusEarned}</p>
          </div>
        </div>
      </div>

      {/* Add New Candidate Form Drawer */}
      {showAddCandidate && (
        <form
          onSubmit={handleAddCandidateSubmit}
          className="p-6 rounded-3xl glossy-card border border-[#FFD000]/40 space-y-4 shadow-2xl animate-scale-in top-sheen"
        >
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-[#FFD000]" />
              <h3 className="text-sm font-bold text-white">Refer an Instructor Friend</h3>
            </div>
            <span className="text-[11px] text-gray-400">
              Candidate starts at <strong>Stage 1: Starting Referral</strong>
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-bold text-gray-300 block mb-1">Instructor Name</label>
              <input
                type="text"
                required
                value={newCandName}
                onChange={(e) => setNewCandName(e.target.value)}
                placeholder="e.g. Jordan Blake"
                className="w-full bg-[#101018] border border-white/10 rounded-2xl px-3.5 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#FFD000]"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-300 block mb-1">Email Address</label>
              <input
                type="email"
                required
                value={newCandEmail}
                onChange={(e) => setNewCandEmail(e.target.value)}
                placeholder="jordan@dancefaculty.com"
                className="w-full bg-[#101018] border border-white/10 rounded-2xl px-3.5 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#FFD000]"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-300 block mb-1">Phone Number</label>
              <input
                type="tel"
                value={newCandPhone}
                onChange={(e) => setNewCandPhone(e.target.value)}
                placeholder="+1 (555) 789-0123"
                className="w-full bg-[#101018] border border-white/10 rounded-2xl px-3.5 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#FFD000]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-gray-300 block mb-1">Dance Specialty / Style</label>
              <input
                type="text"
                required
                value={newCandSpecialty}
                onChange={(e) => setNewCandSpecialty(e.target.value)}
                placeholder="e.g. Hip-Hop Grooves, Contemporary Flow"
                className="w-full bg-[#101018] border border-white/10 rounded-2xl px-3.5 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#FFD000]"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-300 block mb-1">Audition Notes</label>
              <input
                type="text"
                value={newCandNotes}
                onChange={(e) => setNewCandNotes(e.target.value)}
                placeholder="Has 4 years teaching experience, portfolio link..."
                className="w-full bg-[#101018] border border-white/10 rounded-2xl px-3.5 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#FFD000]"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setShowAddCandidate(false)}
              className="px-4 py-2 text-xs text-gray-400 hover:text-white cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-xl glossy-button-yellow text-xs font-black shadow-gold-glow-sm cursor-pointer"
            >
              Submit Referral
            </button>
          </div>
        </form>
      )}

      {/* Teacher Hiring Progress Pipeline Section */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-black text-white tracking-tight flex items-center gap-2">
              <Users2 className="w-5 h-5 text-[#FFD000]" />
              <span>Teacher Referral Hiring Pipeline</span>
            </h2>
            <p className="text-xs text-gray-400">
              Track candidate progress: Starting Referral ➔ Interview ➔ Selected ➔ Successfully Joined
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap gap-1.5 text-xs">
            <button
              onClick={() => setFilterStage('all')}
              className={`px-3 py-1 rounded-xl font-bold transition-all cursor-pointer ${
                filterStage === 'all'
                  ? 'bg-white text-black'
                  : 'bg-white/5 text-gray-400 hover:text-white'
              }`}
            >
              All ({candidatesList.length})
            </button>
            <button
              onClick={() => setFilterStage('starting_referral')}
              className={`px-3 py-1 rounded-xl font-bold transition-all cursor-pointer ${
                filterStage === 'starting_referral'
                  ? 'bg-blue-500 text-white'
                  : 'bg-white/5 text-gray-400 hover:text-white'
              }`}
            >
              Starting Referral ({candidatesList.filter((c) => c.stage === 'starting_referral').length})
            </button>
            <button
              onClick={() => setFilterStage('interview')}
              className={`px-3 py-1 rounded-xl font-bold transition-all cursor-pointer ${
                filterStage === 'interview'
                  ? 'bg-amber-500 text-black font-black'
                  : 'bg-white/5 text-gray-400 hover:text-white'
              }`}
            >
              Interview ({candidatesList.filter((c) => c.stage === 'interview').length})
            </button>
            <button
              onClick={() => setFilterStage('selected')}
              className={`px-3 py-1 rounded-xl font-bold transition-all cursor-pointer ${
                filterStage === 'selected'
                  ? 'bg-purple-500 text-white'
                  : 'bg-white/5 text-gray-400 hover:text-white'
              }`}
            >
              Selected ({candidatesList.filter((c) => c.stage === 'selected').length})
            </button>
            <button
              onClick={() => setFilterStage('successfully_joined')}
              className={`px-3 py-1 rounded-xl font-bold transition-all cursor-pointer ${
                filterStage === 'successfully_joined'
                  ? 'bg-emerald-500 text-black font-black'
                  : 'bg-white/5 text-gray-400 hover:text-white'
              }`}
            >
              Joined ({candidatesList.filter((c) => c.stage === 'successfully_joined').length})
            </button>
          </div>
        </div>

        {/* Candidate Cards */}
        <div className="space-y-4">
          {filteredCandidates.length === 0 ? (
            <div className="p-8 text-center rounded-3xl glossy-card border border-white/5 space-y-2">
              <Users2 className="w-8 h-8 text-gray-500 mx-auto" />
              <p className="text-sm font-bold text-gray-300">No candidates found in this stage.</p>
              <p className="text-xs text-gray-500">
                Click "+ Refer New Instructor" above or share your referral link to onboard candidate teachers.
              </p>
            </div>
          ) : (
            filteredCandidates.map((cand) => {
              const currentStageIndex = stages.findIndex((s) => s.key === cand.stage);
              const isJoined = cand.stage === 'successfully_joined';

              return (
                <div
                  key={cand.id}
                  className="p-6 rounded-3xl glossy-card space-y-4 shadow-card-dark top-sheen"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2.5">
                        <h3 className="text-base font-extrabold text-white">{cand.candidateName}</h3>
                        {getStageBadge(cand.stage)}
                      </div>
                      <p className="text-xs text-[#FFD000] font-semibold mt-0.5">
                        {cand.specialty}
                      </p>
                      <div className="flex flex-wrap items-center gap-3 text-[11px] text-gray-400 pt-1">
                        <span className="flex items-center gap-1">
                          <Mail className="w-3 h-3 text-gray-500" />
                          <a href={`mailto:${cand.email}`} className="hover:text-white underline">
                            {cand.email}
                          </a>
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Phone className="w-3 h-3 text-gray-500" />
                          <a href={`tel:${cand.phone}`} className="hover:text-white underline">
                            {cand.phone}
                          </a>
                        </span>
                        <span>•</span>
                        <span>Referred: {cand.dateReferred}</span>
                      </div>
                    </div>

                    {/* Stage Advancer Button */}
                    {!isJoined ? (
                      <button
                        onClick={() => {
                          advanceCandidate(cand);
                        }}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl glossy-button-yellow text-xs font-black shadow-gold-glow-sm cursor-pointer"
                      >
                        <span>
                          Advance to{' '}
                          {currentStageIndex < stages.length - 1
                            ? stages[currentStageIndex + 1].label
                            : 'Next'}
                        </span>
                        <ArrowRight className="w-3.5 h-3.5 text-black" />
                      </button>
                    ) : (
                      <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>+$150 Bonus Credited</span>
                      </div>
                    )}
                  </div>

                  {/* 4-Stage Interactive Visual Stepper */}
                  <div className="pt-2">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {stages.map((stg, idx) => {
                        const isCompleted = idx < currentStageIndex;
                        const isCurrent = idx === currentStageIndex;

                        return (
                          <button
                            key={stg.key}
                            type="button"
                            onClick={() => {
                              sound.playClick();
                              updateCandidateStage(cand.id, stg.key);
                            }}
                            className={`p-3 rounded-2xl text-left border transition-all cursor-pointer ${
                              isCurrent
                                ? 'bg-[#FFD000]/10 border-[#FFD000] shadow-[0_0_15px_rgba(255,208,0,0.2)]'
                                : isCompleted
                                ? 'bg-emerald-500/10 border-emerald-500/30'
                                : 'bg-[#0A0A10] border-white/5 hover:border-white/20'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-1">
                              <span
                                className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black ${
                                  isCurrent
                                    ? 'bg-[#FFD000] text-black'
                                    : isCompleted
                                    ? 'bg-emerald-400 text-black'
                                    : 'bg-white/10 text-gray-400'
                                }`}
                              >
                                {isCompleted ? '✓' : stg.stepNumber}
                              </span>
                              <span
                                className={`text-[9px] font-mono uppercase ${
                                  isCurrent
                                    ? 'text-[#FFD000] font-bold'
                                    : isCompleted
                                    ? 'text-emerald-400'
                                    : 'text-gray-500'
                                }`}
                              >
                                {isCurrent ? 'Current' : isCompleted ? 'Done' : 'Pending'}
                              </span>
                            </div>

                            <p
                              className={`text-xs font-extrabold ${
                                isCurrent
                                  ? 'text-white'
                                  : isCompleted
                                  ? 'text-emerald-300'
                                  : 'text-gray-400'
                              }`}
                            >
                              {stg.label}
                            </p>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Candidate Stage Note */}
                  <div className="p-3 rounded-2xl bg-[#08080C] border border-white/5 flex items-center justify-between text-xs text-gray-400">
                    <span>
                      <strong>Status:</strong> {stages[currentStageIndex]?.description || cand.notes}
                    </span>
                    <span className="text-[11px] text-gray-500 hidden sm:inline">
                      Click any step above to set candidate status
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
