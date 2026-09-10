import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  MessageSquare,
  Users,
  User,
  CheckCircle2,
  Clock,
  Plus,
  Search,
  Trash2,
} from 'lucide-react';
import { sound } from '../utils/sound';

export const UpdatesView: React.FC = () => {
  const { updates, deleteUpdate, clearAllUpdates, setComposeUpdateModalOpen } = useApp();
  const [filterType, setFilterType] = useState<'all' | 'broadcast' | 'direct'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredUpdates = updates.filter((u) => {
    const matchesType = filterType === 'all' || u.type === filterType;
    const matchesSearch =
      u.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.recipientName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
            <MessageSquare className="w-6 h-6 text-[#FACC15]" />
            <span>My Updates & Central Messaging Hub</span>
          </h1>
          <p className="text-xs text-gray-400">
            Audit sent updates, 1:1 parent communications, and studio group broadcasts
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {updates.length > 0 && (
            <button
              onClick={() => {
                if (window.confirm(`Clear all ${updates.length} update messages from your central messaging hub?`)) {
                  clearAllUpdates();
                }
              }}
              className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 text-xs font-bold transition-all cursor-pointer"
              title="Clear all updates to 0"
            >
              <Trash2 className="w-4 h-4" />
              <span>Clear All Updates ({updates.length})</span>
            </button>
          )}

          <button
            onClick={() => {
              sound.playClick();
              setComposeUpdateModalOpen(true);
            }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#FACC15] hover:bg-[#EAB308] text-black text-xs font-black shadow-gold-glow-sm transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ Compose New Update</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#101015] border border-white/[0.08] p-3 rounded-2xl">
        <div className="flex rounded-xl bg-[#0B0B0E] p-1 border border-white/5 text-xs font-bold">
          <button
            onClick={() => {
              sound.playClick();
              setFilterType('all');
            }}
            className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${
              filterType === 'all'
                ? 'bg-[#FACC15] text-black font-bold shadow-sm'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            All Updates ({updates.length})
          </button>
          <button
            onClick={() => {
              sound.playClick();
              setFilterType('broadcast');
            }}
            className={`px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-1 cursor-pointer ${
              filterType === 'broadcast'
                ? 'bg-[#FACC15] text-black font-bold shadow-sm'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Group Broadcasts</span>
          </button>
          <button
            onClick={() => {
              sound.playClick();
              setFilterType('direct');
            }}
            className={`px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-1 cursor-pointer ${
              filterType === 'direct'
                ? 'bg-[#FACC15] text-black font-bold shadow-sm'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>1:1 Direct</span>
          </button>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search messages, recipients..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#161622] border border-white/10 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#FACC15]"
          />
        </div>
      </div>

      {/* Updates History Feed */}
      <div className="space-y-3.5">
        {updates.length === 0 ? (
          <div className="text-center py-16 bg-[#101015] border border-white/[0.08] rounded-3xl p-8 space-y-4 shadow-card-dark top-sheen">
            <div className="w-14 h-14 rounded-2xl bg-[#FACC15]/10 border border-[#FACC15]/20 text-[#FACC15] flex items-center justify-center mx-auto">
              <MessageSquare className="w-7 h-7" />
            </div>
            <div className="space-y-1.5 max-w-md mx-auto">
              <h3 className="text-base font-bold text-white">No Studio Updates Logged (0 Updates)</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                All broadcast updates and 1:1 parent communications have been cleared. Click below to compose and dispatch a new announcement.
              </p>
            </div>
            <button
              onClick={() => {
                sound.playClick();
                setComposeUpdateModalOpen(true);
              }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl glossy-button-yellow text-xs font-black shadow-gold-glow-sm cursor-pointer"
            >
              <Plus className="w-4 h-4 text-black" />
              <span>+ Compose First Update</span>
            </button>
          </div>
        ) : filteredUpdates.length === 0 ? (
          <div className="text-center py-14 bg-[#101015] border border-white/[0.08] rounded-3xl p-6">
            <MessageSquare className="w-10 h-10 text-gray-600 mx-auto mb-2" />
            <p className="text-sm font-bold text-gray-300">No update messages found matching your search</p>
            <p className="text-xs text-gray-500 mt-1">
              Try clearing your search query or switching filters.
            </p>
          </div>
        ) : (
          filteredUpdates.map((msg) => (
            <div
              key={msg.id}
              className="p-5 rounded-3xl bg-[#101015] border border-white/[0.08] hover:border-white/20 transition-all space-y-3 shadow-card-dark"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span
                    className={`text-[9px] font-black uppercase px-2.5 py-0.5 rounded-full flex items-center gap-1 ${
                      msg.type === 'broadcast'
                        ? 'bg-[#FACC15] text-black shadow-sm'
                        : 'bg-white/10 text-white border border-white/10'
                    }`}
                  >
                    {msg.type === 'broadcast' ? <Users className="w-3 h-3" /> : <User className="w-3 h-3" />}
                    <span>{msg.type === 'broadcast' ? 'Group Broadcast' : '1:1 Direct'}</span>
                  </span>

                  {msg.batchName && (
                    <span className="text-[10px] font-semibold text-gray-400 bg-black/40 px-2.5 py-0.5 rounded-lg border border-white/5">
                      {msg.batchName}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <Clock className="w-3 h-3 text-[#FACC15]" />
                  <span>{msg.sentAt}</span>
                  <span className="text-gray-600">•</span>
                  <span className="text-emerald-400 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Delivered</span>
                  </span>
                  <span className="text-gray-600">•</span>
                  <button
                    onClick={() => {
                      if (window.confirm(`Delete update "${msg.subject}"?`)) {
                        deleteUpdate(msg.id);
                      }
                    }}
                    className="p-1 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
                    title="Delete update"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div>
                <h3 className="text-sm sm:text-base font-bold text-white">{msg.subject}</h3>
                <p className="text-xs text-gray-300 mt-1 leading-relaxed whitespace-pre-line">
                  {msg.message}
                </p>
              </div>

              <div className="pt-2.5 border-t border-white/5 flex flex-wrap items-center justify-between gap-2 text-[11px]">
                <span className="text-gray-400">
                  Recipient:{' '}
                  <strong className="text-white font-semibold">{msg.recipientName}</strong>
                </span>

                <div className="flex items-center gap-1 text-[10px] text-gray-400">
                  <span>Dispatched via:</span>
                  {msg.channels.map((ch) => (
                    <span
                      key={ch}
                      className="px-2 py-0.5 rounded bg-[#181824] text-gray-300 font-mono font-bold uppercase border border-white/10"
                    >
                      {ch}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
