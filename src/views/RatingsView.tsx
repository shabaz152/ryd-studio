import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Star,
  MessageSquare,
  CheckCircle2,
  Send,
  ShieldCheck,
} from 'lucide-react';
import { sound } from '../utils/sound';

export const RatingsView: React.FC = () => {
  const { teacher, reviews, replyToReview } = useApp();
  const [replyingReviewId, setReplyingReviewId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');

  const handleReplySubmit = (reviewId: string) => {
    if (!replyText.trim()) return;
    replyToReview(reviewId, replyText.trim());
    setReplyingReviewId(null);
    setReplyText('');
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
          <Star className="w-6 h-6 text-[#FFD000] fill-[#FFD000]" />
          <span>Faculty Ratings & Parent Reviews</span>
        </h1>
        <p className="text-xs text-gray-400">
          Faculty performance reviews, parent testimonials, and skill category scoring
        </p>
      </div>

      {/* Main Scorecard Banner */}
      <div className="p-7 rounded-3xl glossy-card flex flex-wrap items-center justify-between gap-6 top-sheen shadow-card-dark">
        <div className="flex items-center gap-5">
          <div className="w-20 h-20 rounded-3xl glossy-button-yellow flex flex-col items-center justify-center font-black">
            <span className="text-3xl font-black leading-none text-black">
              {teacher.rating > 0 ? teacher.rating.toFixed(2) : '0.00'}
            </span>
            <span className="text-[10px] font-bold text-black/80 mt-1 uppercase tracking-wider">Score</span>
          </div>

          <div>
            <span className="text-xs font-bold text-[#FFD000] uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#FFD000]" />
              <span>Verified Faculty Rating</span>
            </span>
            <h2 className="text-lg font-black text-white">{teacher.name}</h2>
            <p className="text-xs text-gray-300 mt-0.5">
              {teacher.rating > 0
                ? 'Top 2% Lead Faculty Across All RYD Academic Hubs • 98% Parent Recommendation'
                : 'New Faculty Onboarding Period • 0 Client Evaluations Logged'}
            </p>
          </div>
        </div>

        {/* Categories Breakdown */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full lg:w-auto">
          <div className="glossy-pill-dark p-3.5 rounded-2xl text-center min-w-[95px]">
            <p className="text-[10px] text-gray-400 uppercase font-bold">Concept Clarity</p>
            <p className="text-lg font-black text-[#FFD000] mt-0.5">
              {teacher.rating > 0 ? '5.0 / 5.0' : '0.0 / 5.0'}
            </p>
          </div>
          <div className="glossy-pill-dark p-3.5 rounded-2xl text-center min-w-[95px]">
            <p className="text-[10px] text-gray-400 uppercase font-bold">Problem Solving</p>
            <p className="text-lg font-black text-white mt-0.5">
              {teacher.rating > 0 ? '4.9 / 5.0' : '0.0 / 5.0'}
            </p>
          </div>
          <div className="glossy-pill-dark p-3.5 rounded-2xl text-center min-w-[95px]">
            <p className="text-[10px] text-gray-400 uppercase font-bold">Punctuality</p>
            <p className="text-lg font-black text-white mt-0.5">
              {teacher.rating > 0 ? '4.95 / 5.0' : '0.0 / 5.0'}
            </p>
          </div>
          <div className="glossy-pill-dark p-3.5 rounded-2xl text-center min-w-[95px]">
            <p className="text-[10px] text-gray-400 uppercase font-bold">Engagement</p>
            <p className="text-lg font-black text-emerald-400 mt-0.5">
              {teacher.rating > 0 ? '5.0 / 5.0' : '0.0 / 5.0'}
            </p>
          </div>
        </div>
      </div>

      {/* Reviews Feed */}
      <div className="space-y-4">
        <h2 className="text-xs font-black text-gray-400 uppercase tracking-widest">
          Verified Reviews & Parent Comments ({reviews.length})
        </h2>

        {reviews.map((rev) => (
          <div
            key={rev.id}
            className="p-6 rounded-3xl glossy-card space-y-3.5 shadow-card-dark"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#181824] border border-[#FFD000]/40 flex items-center justify-center text-sm font-black text-[#FFD000]">
                  {rev.studentOrParentName[0]}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">{rev.studentOrParentName}</h3>
                  <p className="text-[11px] text-gray-400">
                    {rev.relationship} • {rev.batchName}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 text-[#FFD000]">
                  {Array.from({ length: rev.rating }).map((_, idx) => (
                    <Star key={idx} className="w-3.5 h-3.5 fill-[#FFD000] text-[#FFD000]" />
                  ))}
                </div>
                <span className="text-xs text-gray-500">• {rev.date}</span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed bg-[#101018]/80 p-4 rounded-2xl border border-white/5">
              "{rev.reviewText}"
            </p>

            {/* Teacher Reply Section */}
            {rev.teacherReply ? (
              <div className="p-4 rounded-2xl bg-black/50 border border-[#FFD000]/25 ml-4 space-y-1">
                <div className="flex items-center gap-2 text-xs font-bold text-[#FFD000]">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Faculty Reply from Coach {teacher.name}:</span>
                </div>
                <p className="text-xs text-gray-300 italic">{rev.teacherReply}</p>
              </div>
            ) : replyingReviewId === rev.id ? (
              <div className="space-y-2 pt-1 ml-4 animate-scale-in">
                <textarea
                  rows={2}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder={`Write your faculty response to ${rev.studentOrParentName}...`}
                  className="w-full bg-[#161622] border border-[#FFD000]/50 rounded-2xl p-3.5 text-xs text-white placeholder-gray-500 focus:outline-none"
                />
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setReplyingReviewId(null)}
                    className="px-3.5 py-1.5 text-xs text-gray-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleReplySubmit(rev.id)}
                    className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl glossy-button-yellow text-xs font-bold shadow-sm"
                  >
                    <Send className="w-3.5 h-3.5 fill-black" />
                    <span>Post Reply</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex justify-end pt-1">
                <button
                  onClick={() => {
                    sound.playClick();
                    setReplyingReviewId(rev.id);
                  }}
                  className="text-xs font-bold text-[#FFD000] hover:underline flex items-center gap-1.5 cursor-pointer"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Reply to Review</span>
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
