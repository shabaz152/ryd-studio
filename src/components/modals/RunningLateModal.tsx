import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { speechRecognizer } from '../../utils/speech';
import {
  X,
  Clock,
  Mic,
  MicOff,
  Send,
  AlertTriangle,
  Radio,
} from 'lucide-react';
import { sound } from '../../utils/sound';

export const RunningLateModal: React.FC = () => {
  const {
    runningLateModalOpen,
    setRunningLateModalOpen,
    reportRunningLate,
    checkedInSession,
    sessions,
    teacher,
  } = useApp();

  const [selectedMinutes, setSelectedMinutes] = useState<number>(5);
  const [reason, setReason] = useState<string>('');
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [voiceWaveHeights, setVoiceWaveHeights] = useState<number[]>([12, 26, 38, 18, 30, 42, 22, 34]);

  const targetSession =
    checkedInSession || sessions.find((s) => s.status === 'scheduled') || sessions[0];

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isRecording) {
      interval = setInterval(() => {
        setVoiceWaveHeights(
          Array.from({ length: 12 }, () => Math.floor(Math.random() * 32) + 8)
        );
      }, 90);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  if (!runningLateModalOpen) return null;

  const handleToggleVoiceInput = () => {
    sound.playClick();
    if (isRecording) {
      speechRecognizer.stopListening();
      setIsRecording(false);
    } else {
      setIsRecording(true);
      speechRecognizer.startListening(
        (transcript) => {
          setReason(transcript);
        },
        () => {
          setIsRecording(false);
        },
        () => {
          setIsRecording(false);
        }
      );
    }
  };

  const handleQuickReason = (text: string) => {
    sound.playClick();
    setReason(text);
  };

  const handleSendNotice = () => {
    reportRunningLate(selectedMinutes, reason.trim() || 'Transit / traffic delay');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-lg bg-[#101017] border border-amber-500/30 rounded-3xl overflow-hidden shadow-2xl my-auto top-sheen">
        {/* Header */}
        <div className="bg-[#151520] px-6 py-4 border-b border-white/[0.08] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center font-black">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">
                Report Running Late
              </h2>
              <p className="text-[11px] text-gray-400">
                Dispatches instantaneous arrival ETA to parents & studio front desk
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              sound.playClick();
              if (isRecording) speechRecognizer.stopListening();
              setRunningLateModalOpen(false);
            }}
            className="p-1.5 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Quick-Select Buttons: 5 Minutes Late / 10 Minutes Late */}
          <div>
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2">
              Select Delay Estimate (Required)
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              {/* 5 Minutes Late */}
              <button
                onClick={() => {
                  sound.playClick();
                  setSelectedMinutes(5);
                }}
                className={`py-3.5 px-2 rounded-2xl border text-center transition-all cursor-pointer ${
                  selectedMinutes === 5
                    ? 'bg-[#FACC15] border-[#FACC15] text-black font-black shadow-gold-glow-sm'
                    : 'bg-[#14141E] border-white/[0.08] text-gray-300 hover:border-white/20'
                }`}
              >
                <div className="text-xl font-black tracking-tight">+5 Min</div>
                <div className={`text-[10px] font-bold ${selectedMinutes === 5 ? 'text-black' : 'text-gray-400'}`}>
                  5 Minutes Late
                </div>
              </button>

              {/* 10 Minutes Late */}
              <button
                onClick={() => {
                  sound.playClick();
                  setSelectedMinutes(10);
                }}
                className={`py-3.5 px-2 rounded-2xl border text-center transition-all cursor-pointer ${
                  selectedMinutes === 10
                    ? 'bg-[#FACC15] border-[#FACC15] text-black font-black shadow-gold-glow-sm'
                    : 'bg-[#14141E] border-white/[0.08] text-gray-300 hover:border-white/20'
                }`}
              >
                <div className="text-xl font-black tracking-tight">+10 Min</div>
                <div className={`text-[10px] font-bold ${selectedMinutes === 10 ? 'text-black' : 'text-gray-400'}`}>
                  10 Minutes Late
                </div>
              </button>

              {/* 15 Minutes Late */}
              <button
                onClick={() => {
                  sound.playClick();
                  setSelectedMinutes(15);
                }}
                className={`py-3.5 px-2 rounded-2xl border text-center transition-all cursor-pointer ${
                  selectedMinutes === 15
                    ? 'bg-[#FACC15] border-[#FACC15] text-black font-black shadow-gold-glow-sm'
                    : 'bg-[#14141E] border-white/[0.08] text-gray-300 hover:border-white/20'
                }`}
              >
                <div className="text-xl font-black tracking-tight">+15 Min</div>
                <div className={`text-[10px] font-bold ${selectedMinutes === 15 ? 'text-black' : 'text-gray-400'}`}>
                  Extended Delay
                </div>
              </button>
            </div>
          </div>

          {/* Reason Entry Field: Text Box + Voice Input */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-gray-300 flex items-center gap-1.5">
                <span>Reason for Delay (Text or Voice Input)</span>
              </label>

              {/* Interactive Voice Microphone Button */}
              <button
                onClick={handleToggleVoiceInput}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  isRecording
                    ? 'bg-red-500 text-white animate-pulse shadow-md'
                    : 'bg-[#FACC15]/10 border border-[#FACC15]/30 text-[#FACC15] hover:bg-[#FACC15]/20'
                }`}
              >
                {isRecording ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                <span>{isRecording ? 'Listening (Tap to Stop)' : 'Voice Input'}</span>
              </button>
            </div>

            {/* Audio Waveform Animation during Voice Input */}
            {isRecording && (
              <div className="p-3 rounded-2xl bg-red-950/20 border border-red-500/30 flex items-center justify-center gap-1.5 h-12">
                <Radio className="w-4 h-4 text-red-400 animate-ping mr-2" />
                {voiceWaveHeights.map((h, i) => (
                  <div
                    key={i}
                    className="w-1.5 bg-[#FACC15] rounded-full transition-all duration-100"
                    style={{ height: `${h}px` }}
                  />
                ))}
                <span className="text-[11px] font-mono text-red-300 ml-2">Recording Voice...</span>
              </div>
            )}

            {/* Text Entry Field */}
            <textarea
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g., Heavy traffic near downtown tunnel, brief studio faculty briefing..."
              className="w-full bg-[#14141E] border border-white/10 rounded-2xl px-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-amber-400"
            />

            {/* Quick Reason Chips */}
            <div className="flex flex-wrap gap-1.5 pt-0.5">
              {[
                'Highway traffic congestion',
                'Subway transfer signal hold',
                'Pre-class student inquiry wrap-up',
                'Inclement weather delay',
              ].map((preset) => (
                <button
                  key={preset}
                  onClick={() => handleQuickReason(preset)}
                  className="text-[10px] font-medium bg-[#14141E] hover:bg-[#1C1C28] text-gray-300 hover:text-white px-3 py-1 rounded-full border border-white/5 transition-all cursor-pointer"
                >
                  + {preset}
                </button>
              ))}
            </div>
          </div>

          {/* Automated Parent Notification Broadcast Preview */}
          <div className="p-4 rounded-2xl bg-black/40 border border-white/[0.08] space-y-2">
            <div className="flex items-center justify-between text-[11px] text-gray-400">
              <span className="flex items-center gap-1.5 font-bold text-white">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                <span>Automated Notification Dispatch</span>
              </span>
              <span className="text-[10px] text-amber-400 font-mono font-bold">Push & SMS</span>
            </div>
            <p className="text-xs text-gray-300 italic bg-[#0D0D12] p-3 rounded-xl border border-white/5 leading-relaxed">
              "Attention {targetSession?.batchName || 'Dancers'} Families: Coach {teacher.name} is running{' '}
              <strong className="text-[#FACC15]">+{selectedMinutes} mins late</strong> ({reason || 'Transit delay'}). Warm-up floor is open and supervised. Session will conclude at regular schedule."
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-[#151520] px-6 py-4 border-t border-white/[0.08] flex items-center justify-between">
          <button
            onClick={() => {
              sound.playClick();
              if (isRecording) speechRecognizer.stopListening();
              setRunningLateModalOpen(false);
            }}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-400 hover:text-white cursor-pointer"
          >
            Dismiss
          </button>
          <button
            onClick={handleSendNotice}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-black shadow-md transition-all cursor-pointer"
          >
            <Send className="w-3.5 h-3.5 fill-black" />
            <span>Dispatch +{selectedMinutes}m Notice</span>
          </button>
        </div>
      </div>
    </div>
  );
};
