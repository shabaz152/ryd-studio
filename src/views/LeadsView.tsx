import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Lead } from '../types';
import {
  UserPlus,
  Calendar,
  Search,
  Trash2,
  Footprints,
  MessageSquareText,
  RotateCcw,
} from 'lucide-react';
import { sound } from '../utils/sound';

export const LeadsView: React.FC = () => {
  const {
    leads,
    updateLeadStatus,
    openLeadModalWithType,
    deleteLead,
    clearAllLeads,
  } = useApp();

  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const walkInsCount = leads.filter(
    (l) => l.source === 'Walk-In' || l.leadType === 'walk_in'
  ).length;

  const enquiriesCount = leads.filter(
    (l) => l.source !== 'Walk-In' || l.leadType === 'enquiry'
  ).length;

  const filteredLeads = leads.filter((lead) => {
    let matchesTypeOrStatus = true;
    if (filterStatus === 'walk_in') {
      matchesTypeOrStatus = lead.source === 'Walk-In' || lead.leadType === 'walk_in';
    } else if (filterStatus === 'enquiry') {
      matchesTypeOrStatus = lead.source !== 'Walk-In' || lead.leadType === 'enquiry';
    } else if (filterStatus !== 'all') {
      matchesTypeOrStatus = lead.status === filterStatus;
    }

    const matchesSearch =
      lead.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.parentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.styleInterest.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTypeOrStatus && matchesSearch;
  });

  const getStatusBadge = (status: Lead['status']) => {
    switch (status) {
      case 'new':
        return (
          <span className="px-2.5 py-0.5 rounded-full bg-blue-500/15 text-blue-400 border border-blue-500/30 text-[10px] font-bold uppercase">
            New Lead
          </span>
        );
      case 'trial_scheduled':
        return (
          <span className="px-2.5 py-0.5 rounded-full bg-[#FACC15]/15 text-[#FACC15] border border-[#FACC15]/30 text-[10px] font-bold uppercase">
            Trial Booked
          </span>
        );
      case 'enrolled':
        return (
          <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold uppercase">
            Enrolled
          </span>
        );
      case 'follow_up':
        return (
          <span className="px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30 text-[10px] font-bold uppercase">
            Follow Up
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
            <UserPlus className="w-6 h-6 text-[#FACC15]" />
            <span>Student Enquiry & Walk-In Leads CRM</span>
          </h1>
          <p className="text-xs text-gray-400">
            Live capture for prospective students, walk-ins, and trials (Initializes at 0)
          </p>
        </div>

        <div className="flex items-center gap-2">
          {leads.length > 0 && (
            <button
              onClick={() => {
                if (window.confirm('Reset all CRM leads back to 0?')) {
                  clearAllLeads();
                }
              }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 text-xs font-bold transition-all cursor-pointer"
              title="Reset counters back to 0"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset to 0</span>
            </button>
          )}

          <button
            onClick={() => openLeadModalWithType('walk_in')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#FACC15] hover:bg-[#EAB308] text-black text-xs font-black shadow-gold-glow-sm transition-all cursor-pointer"
          >
            <Footprints className="w-4 h-4" />
            <span>+ Log Walk-In</span>
          </button>

          <button
            onClick={() => openLeadModalWithType('enquiry')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#181826] hover:bg-[#202030] text-blue-400 border border-blue-500/30 text-xs font-black transition-all cursor-pointer"
          >
            <MessageSquareText className="w-4 h-4" />
            <span>+ Log Enquiry</span>
          </button>
        </div>
      </div>

      {/* 4 Pipeline Summary Counters Starting at 0 */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Walk-In Card */}
        <div
          onClick={() => setFilterStatus('walk_in')}
          className={`p-4 rounded-3xl bg-[#101015] border transition-all cursor-pointer shadow-card-dark ${
            filterStatus === 'walk_in'
              ? 'border-[#FFD000] shadow-gold-glow-sm'
              : 'border-white/[0.08] hover:border-[#FFD000]/40'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-[#FFD000] uppercase tracking-wider">
              Walk-Ins
            </span>
            <Footprints className="w-3.5 h-3.5 text-[#FFD000]" />
          </div>
          <p className="text-3xl font-black text-white mt-1">{walkInsCount}</p>
          <span className="text-[10px] text-gray-400">Front desk & lobby</span>
        </div>

        {/* Enquiry Card */}
        <div
          onClick={() => setFilterStatus('enquiry')}
          className={`p-4 rounded-3xl bg-[#101015] border transition-all cursor-pointer shadow-card-dark ${
            filterStatus === 'enquiry'
              ? 'border-blue-500 shadow-md'
              : 'border-white/[0.08] hover:border-blue-500/40'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider">
              Enquiries
            </span>
            <MessageSquareText className="w-3.5 h-3.5 text-blue-400" />
          </div>
          <p className="text-3xl font-black text-white mt-1">{enquiriesCount}</p>
          <span className="text-[10px] text-gray-400">Calls, Web, Instagram</span>
        </div>

        {/* Trial Booked Card */}
        <div
          onClick={() => setFilterStatus('trial_scheduled')}
          className={`p-4 rounded-3xl bg-[#101015] border transition-all cursor-pointer shadow-card-dark ${
            filterStatus === 'trial_scheduled'
              ? 'border-amber-500 shadow-md'
              : 'border-white/[0.08] hover:border-amber-500/40'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">
              Trials Scheduled
            </span>
            <Calendar className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <p className="text-3xl font-black text-amber-400 mt-1">
            {leads.filter((l) => l.status === 'trial_scheduled').length}
          </p>
          <span className="text-[10px] text-gray-400">Studio trials pending</span>
        </div>

        {/* Enrolled Card */}
        <div
          onClick={() => setFilterStatus('enrolled')}
          className={`p-4 rounded-3xl bg-[#101015] border transition-all cursor-pointer shadow-card-dark ${
            filterStatus === 'enrolled'
              ? 'border-emerald-500 shadow-md'
              : 'border-white/[0.08] hover:border-emerald-500/40'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
              Enrolled Dancers
            </span>
            <UserPlus className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <p className="text-3xl font-black text-emerald-400 mt-1">
            {leads.filter((l) => l.status === 'enrolled').length}
          </p>
          <span className="text-[10px] text-gray-400">Converted students</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#101015] border border-white/[0.08] p-3 rounded-2xl">
        <div className="flex flex-wrap gap-1 text-xs font-bold">
          {[
            { id: 'all', label: `All (${leads.length})` },
            { id: 'walk_in', label: `Walk-Ins (${walkInsCount})` },
            { id: 'enquiry', label: `Enquiries (${enquiriesCount})` },
            { id: 'trial_scheduled', label: 'Trials Scheduled' },
            { id: 'enrolled', label: 'Enrolled' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                sound.playClick();
                setFilterStatus(tab.id);
              }}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                filterStatus === tab.id
                  ? 'bg-[#FACC15] text-black font-bold shadow-sm'
                  : 'text-gray-400 hover:text-white bg-[#161622]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3.5 top-2.5" />
          <input
            type="text"
            placeholder="Search leads, parents..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#161622] border border-white/10 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#FACC15]"
          />
        </div>
      </div>

      {/* Leads Content: Empty State or Cards */}
      {leads.length === 0 ? (
        <div className="p-10 rounded-3xl bg-[#101017] border border-white/10 text-center space-y-4 shadow-card-dark top-sheen">
          <div className="w-16 h-16 rounded-3xl bg-[#FFD000]/10 border border-[#FFD000]/20 text-[#FFD000] flex items-center justify-center mx-auto">
            <Footprints className="w-8 h-8" />
          </div>
          <div className="max-w-md mx-auto space-y-1.5">
            <h3 className="text-base font-bold text-white">
              CRM Initialized at 0: No Enquiries or Walk-Ins Logged Yet
            </h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              All student enquiry and walk-in counters start strictly at <strong className="text-white">0</strong>. When prospective dancers walk into the studio or contact you, log them below to dynamically start counting.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => openLeadModalWithType('walk_in')}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#FFD000] hover:bg-[#EAB308] text-black text-xs font-black shadow-gold-glow-sm transition-all cursor-pointer"
            >
              <Footprints className="w-4 h-4" />
              <span>Log First Walk-In (0 ➔ 1)</span>
            </button>
            <button
              onClick={() => openLeadModalWithType('enquiry')}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#161624] hover:bg-[#1E1E30] text-blue-400 border border-blue-500/30 text-xs font-bold transition-all cursor-pointer"
            >
              <MessageSquareText className="w-4 h-4" />
              <span>Log First Enquiry (0 ➔ 1)</span>
            </button>
          </div>
        </div>
      ) : filteredLeads.length === 0 ? (
        <div className="p-8 rounded-3xl bg-[#101015] border border-white/[0.08] text-center text-xs text-gray-400">
          No records match the active filter or search query.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredLeads.map((lead) => {
            const isWalkIn = lead.source === 'Walk-In' || lead.leadType === 'walk_in';

            return (
              <div
                key={lead.id}
                className="p-5 rounded-3xl bg-[#101015] border border-white/[0.08] hover:border-white/20 transition-all space-y-3.5 shadow-card-dark"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full font-mono ${
                          isWalkIn
                            ? 'bg-[#FFD000] text-black'
                            : 'bg-blue-500 text-white'
                        }`}
                      >
                        {isWalkIn ? 'WALK-IN' : 'ENQUIRY'}
                      </span>
                      <h3 className="text-sm font-bold text-white">{lead.studentName}</h3>
                      <span className="text-[10px] text-gray-400">({lead.ageGroup})</span>
                    </div>
                    <p className="text-xs text-[#FACC15] font-medium mt-1">
                      Cohort Interest: {lead.styleInterest}
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {getStatusBadge(lead.status)}
                    <button
                      onClick={() => deleteLead(lead.id)}
                      className="p-1.5 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
                      title="Delete Lead"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5 text-xs text-gray-300 bg-[#161622] p-3.5 rounded-2xl border border-white/5">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Parent / Contact:</span>
                    <span className="text-white font-bold">{lead.parentName}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Phone:</span>
                    <a
                      href={`tel:${lead.phone}`}
                      className="text-[#FACC15] font-mono hover:underline font-bold"
                    >
                      {lead.phone}
                    </a>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Channel Source:</span>
                    <span className="text-gray-300">{lead.source}</span>
                  </div>
                  {lead.trialDate && (
                    <div className="flex items-center justify-between text-[#FACC15]">
                      <span className="flex items-center gap-1 font-bold">
                        <Calendar className="w-3.5 h-3.5" />
                        Trial Date:
                      </span>
                      <span className="font-mono font-bold">{lead.trialDate}</span>
                    </div>
                  )}
                </div>

                {lead.notes && (
                  <p className="text-[11px] text-gray-400 italic bg-black/40 p-3 rounded-xl border border-white/5 leading-relaxed">
                    "{lead.notes}"
                  </p>
                )}

                <div className="pt-2 border-t border-white/5 flex flex-wrap items-center justify-between gap-2">
                  <span className="text-[10px] text-gray-500">Logged: {lead.createdAt}</span>

                  <div className="flex items-center gap-1.5">
                    {lead.status !== 'trial_scheduled' && (
                      <button
                        onClick={() => updateLeadStatus(lead.id, 'trial_scheduled')}
                        className="px-2.5 py-1 rounded-lg bg-[#FACC15]/10 hover:bg-[#FACC15]/20 text-[#FACC15] text-[10px] font-bold border border-[#FACC15]/30 cursor-pointer"
                      >
                        Set Trial
                      </button>
                    )}
                    {lead.status !== 'enrolled' && (
                      <button
                        onClick={() => updateLeadStatus(lead.id, 'enrolled')}
                        className="px-2.5 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-[10px] font-bold border border-emerald-500/30 cursor-pointer"
                      >
                        Enroll Dancer
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
