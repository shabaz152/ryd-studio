import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Send, MessageSquare, Radio, Users, User, CheckSquare, Square } from 'lucide-react';
import { sound } from '../../utils/sound';

export const ComposeUpdateModal: React.FC = () => {
  const { composeUpdateModalOpen, setComposeUpdateModalOpen, batches, sendUpdateMessage } = useApp();

  const [updateType, setUpdateType] = useState<'broadcast' | 'direct'>('broadcast');
  const [selectedBatchId, setSelectedBatchId] = useState(batches[0]?.id || '');
  const [directRecipient, setDirectRecipient] = useState(batches[0]?.students[0]?.name || '');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [appChannel, setAppChannel] = useState(true);
  const [smsChannel, setSmsChannel] = useState(true);
  const [whatsappChannel, setWhatsappChannel] = useState(false);

  if (!composeUpdateModalOpen) return null;

  const currentBatch = batches.find((b) => b.id === selectedBatchId) || batches[0];

  const handleTemplate = (tmplSubject: string, tmplBody: string) => {
    sound.playClick();
    setSubject(tmplSubject);
    setMessage(tmplBody);
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) return;

    const channels: ('app' | 'sms' | 'whatsapp')[] = [];
    if (appChannel) channels.push('app');
    if (smsChannel) channels.push('sms');
    if (whatsappChannel) channels.push('whatsapp');

    sendUpdateMessage({
      type: updateType,
      recipientName:
        updateType === 'broadcast'
          ? `All Parents & Students (${currentBatch?.name || 'All Batches'})`
          : `${directRecipient} (Parent/Student)`,
      batchName: currentBatch?.name,
      batchId: currentBatch?.id,
      subject: subject.trim(),
      message: message.trim(),
      channels: channels.length > 0 ? channels : ['app'],
    });

    setSubject('');
    setMessage('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-lg bg-[#121216] border border-white/15 rounded-3xl overflow-hidden shadow-2xl my-auto">
        <div className="bg-[#181820] px-5 py-4 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#FFE500] text-black flex items-center justify-center font-black">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">Compose Cohort Update</h2>
              <p className="text-[11px] text-gray-400">Dispatch announcements, syllabus milestones, and reminders</p>
            </div>
          </div>
          <button
            onClick={() => {
              sound.playClick();
              setComposeUpdateModalOpen(false);
            }}
            className="p-1 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSend} className="p-5 space-y-4 text-xs">
          {/* Update Type Selector */}
          <div className="flex rounded-xl bg-[#181820] p-1 border border-white/5">
            <button
              type="button"
              onClick={() => setUpdateType('broadcast')}
              className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                updateType === 'broadcast' ? 'bg-[#FFE500] text-black shadow-sm' : 'text-gray-400 hover:text-white'
              }`}
            >
              Cohort Broadcast (All Parents)
            </button>
            <button
              type="button"
              onClick={() => setUpdateType('direct')}
              className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                updateType === 'direct' ? 'bg-[#FFE500] text-black shadow-sm' : 'text-gray-400 hover:text-white'
              }`}
            >
              Direct Student/Parent DM
            </button>
          </div>

          {/* Batch Selector */}
          <div>
            <label className="text-xs font-bold text-gray-300 block mb-1">Target Academic Cohort</label>
            <select
              value={selectedBatchId}
              onChange={(e) => setSelectedBatchId(e.target.value)}
              className="w-full bg-[#181820] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#FFE500]"
            >
              {batches.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name} ({b.students.length} students)
                </option>
              ))}
            </select>
          </div>

          {updateType === 'direct' && (
            <div>
              <label className="text-xs font-bold text-gray-300 block mb-1">Select Student / Parent</label>
              <select
                value={directRecipient}
                onChange={(e) => setDirectRecipient(e.target.value)}
                className="w-full bg-[#181820] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#FFE500]"
              >
                {!currentBatch?.students || currentBatch.students.length === 0 ? (
                  <option value="Direct Parent Notice">No students currently enrolled in this cohort (0 Students)</option>
                ) : (
                  currentBatch.students.map((s) => (
                    <option key={s.id} value={`${s.name} (Parent: ${s.parentName})`}>
                      {s.name} (Parent: {s.parentName} • {s.parentPhone})
                    </option>
                  ))
                )}
              </select>
            </div>
          )}

          {/* Subject */}
          <div>
            <label className="text-xs font-bold text-gray-300 block mb-1">Subject Header *</label>
            <input
              type="text"
              required
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g. Advanced Calculus Midterm Review & Problem Set 4 Solutions"
              className="w-full bg-[#181820] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#FFE500]"
            />
          </div>

          {/* Message Body */}
          <div>
            <label className="text-xs font-bold text-gray-300 block mb-1">Update Message *</label>
            <textarea
              rows={3}
              required
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Write academic announcements, homework assignments, or personalized feedback..."
              className="w-full bg-[#181820] border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#FFE500]"
            />
          </div>

          {/* Dispatch Channels */}
          <div>
            <label className="text-xs font-bold text-gray-300 block mb-1.5">Dispatch Channels</label>
            <div className="flex flex-wrap gap-2 text-xs">
              <label className="flex items-center gap-1.5 p-2 rounded-xl bg-[#181820] border border-white/10 cursor-pointer">
                <input
                  type="checkbox"
                  checked={appChannel}
                  onChange={(e) => setAppChannel(e.target.checked)}
                  className="rounded text-[#FFE500] focus:ring-0"
                />
                <span>In-App Feed</span>
              </label>
              <label className="flex items-center gap-1.5 p-2 rounded-xl bg-[#181820] border border-white/10 cursor-pointer">
                <input
                  type="checkbox"
                  checked={smsChannel}
                  onChange={(e) => setSmsChannel(e.target.checked)}
                  className="rounded text-[#FFE500] focus:ring-0"
                />
                <span>SMS Alert</span>
              </label>
              <label className="flex items-center gap-1.5 p-2 rounded-xl bg-[#181820] border border-white/10 cursor-pointer">
                <input
                  type="checkbox"
                  checked={whatsappChannel}
                  onChange={(e) => setWhatsappChannel(e.target.checked)}
                  className="rounded text-[#FFE500] focus:ring-0"
                />
                <span>WhatsApp Group</span>
              </label>
            </div>
          </div>

          {/* Quick Studio Message Templates */}
          <div className="pt-1">
            <span className="text-[10px] text-gray-400 block mb-1 uppercase font-semibold">Quick Templates:</span>
            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() =>
                  handleTemplate(
                    'Workbook & Problem Sets Distribution',
                    'Please be advised that official RYD academic study workbooks and weekly problem sets will be handed out 10 minutes prior to this week’s scheduled tutoring session.'
                  )
                }
                className="text-[10px] bg-[#181820] hover:bg-[#202028] text-gray-300 px-2 py-1 rounded-lg border border-white/5"
              >
                + Study Guides
              </button>
              <button
                type="button"
                onClick={() =>
                  handleTemplate(
                    'Midterm Exam & Practice Assessment Review',
                    'Students preparing for upcoming academic assessments: please review Problem Sets 3 & 4 in addition to class notes before this week’s cohort session.'
                  )
                }
                className="text-[10px] bg-[#181820] hover:bg-[#202028] text-gray-300 px-2 py-1 rounded-lg border border-white/5"
              >
                + Exam Prep Review
              </button>
            </div>
          </div>

          <div className="bg-[#181820] px-2 py-3 border-t border-white/10 flex items-center justify-between">
            <button
              type="button"
              onClick={() => {
                sound.playClick();
                setComposeUpdateModalOpen(false);
              }}
              className="px-4 py-2 text-xs text-gray-400 hover:text-white cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-[#FFE500] hover:bg-[#E6CF00] text-black text-xs font-black shadow-yellow-glow-sm transition-all cursor-pointer"
            >
              <Send className="w-3.5 h-3.5 fill-black" />
              <span>Broadcast Update</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
