import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, BookOpen, Package, Send, Check } from 'lucide-react';
import { sound } from '../../utils/sound';

export const OrderWorkbookModal: React.FC = () => {
  const { orderWorkbookModalOpen, setOrderWorkbookModalOpen, batches, createWorkbookOrder } = useApp();

  const [selectedBatchId, setSelectedBatchId] = useState(batches[0]?.id || '');
  const [selectedStudentName, setSelectedStudentName] = useState(
    batches[0]?.students[0]?.name || ''
  );
  const [itemTitle, setItemTitle] = useState('Urban Movement & Rhythm Theory Guide');
  const [edition, setEdition] = useState('Edition 2026 (Level 2)');
  const [quantity, setQuantity] = useState(1);
  const [studioAddress, setStudioAddress] = useState('RYD Downtown Central - Locker 14');

  if (!orderWorkbookModalOpen) return null;

  const currentBatch = batches.find((b) => b.id === selectedBatchId) || batches[0];

  const handleBatchChange = (batchId: string) => {
    setSelectedBatchId(batchId);
    const b = batches.find((x) => x.id === batchId);
    if (b && b.students.length > 0) {
      setSelectedStudentName(b.students[0].name);
      setStudioAddress(`${b.locationName} - Desk`);
    }
  };

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    createWorkbookOrder({
      batchName: currentBatch?.name || 'Selected Batch',
      studentName: selectedStudentName,
      itemTitle,
      edition,
      quantity,
      studioAddress,
      estimatedDelivery: new Date(Date.now() + 3 * 86400000).toISOString().slice(0, 10),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-lg bg-[#121216] border border-white/15 rounded-3xl overflow-hidden shadow-2xl my-auto">
        <div className="bg-[#181820] px-5 py-4 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#FFE500] text-black flex items-center justify-center font-black">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-white tracking-tight">
                Order Student Workbooks & Syllabus
              </h2>
              <p className="text-[11px] text-gray-400 font-medium">
                Direct in-app fulfillment portal for faculty
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              sound.playClick();
              setOrderWorkbookModalOpen(false);
            }}
            className="p-1.5 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmitOrder} className="p-5 space-y-3.5 max-h-[75vh] overflow-y-auto">
          <div>
            <label className="text-xs font-bold text-gray-300 block mb-1">Target Batch</label>
            <select
              value={selectedBatchId}
              onChange={(e) => handleBatchChange(e.target.value)}
              className="w-full bg-[#181820] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#FFE500]"
            >
              {batches.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name} ({b.style})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-gray-300 block mb-1">Recipient Student</label>
            <select
              value={selectedStudentName}
              onChange={(e) => setSelectedStudentName(e.target.value)}
              className="w-full bg-[#181820] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#FFE500]"
            >
              {!currentBatch?.students || currentBatch.students.length === 0 ? (
                <option value="Cohort Inventory">Cohort Materials (0 Students Enrolled)</option>
              ) : (
                currentBatch.students.map((std) => (
                  <option key={std.id} value={std.name}>
                    {std.name} (Parent: {std.parentName})
                  </option>
                ))
              )}
              <option value="Entire Batch Roster">All Students in Batch</option>
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-gray-300 block mb-1">Workbook Curriculum</label>
              <select
                value={itemTitle}
                onChange={(e) => setItemTitle(e.target.value)}
                className="w-full bg-[#181820] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#FFE500]"
              >
                <option value="Urban Movement & Rhythm Theory Guide">Urban Movement & Rhythm Theory</option>
                <option value="Anatomy & Flow Alignment Handbook">Anatomy & Flow Alignment Handbook</option>
                <option value="Cinematic Expressions & Rhythm Syllabus">Cinematic Expressions & Syllabus</option>
                <option value="Musicality & Stage Presence Workbook">Musicality & Stage Presence</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-300 block mb-1">Edition / Level</label>
              <select
                value={edition}
                onChange={(e) => setEdition(e.target.value)}
                className="w-full bg-[#181820] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#FFE500]"
              >
                <option value="Edition 2026 (Level 1)">Edition 2026 (Level 1)</option>
                <option value="Edition 2026 (Level 2)">Edition 2026 (Level 2)</option>
                <option value="Elite Master Series Vol. 1">Elite Master Series Vol. 1</option>
                <option value="Pro Gold 2026">Pro Gold 2026</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-gray-300 block mb-1">Quantity</label>
              <input
                type="number"
                min="1"
                max="20"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value, 10) || 1)}
                className="w-full bg-[#181820] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#FFE500]"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-300 block mb-1">Delivery Destination</label>
              <input
                type="text"
                value={studioAddress}
                onChange={(e) => setStudioAddress(e.target.value)}
                className="w-full bg-[#181820] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#FFE500]"
              />
            </div>
          </div>

          <div className="p-3 bg-[#181820] rounded-xl border border-white/5 flex items-center justify-between text-xs">
            <span className="text-gray-400">Order Fulfilled by:</span>
            <span className="text-[#FFE500] font-bold">RYD Central Press & Logistics</span>
          </div>

          <div className="bg-[#181820] px-2 py-3 border-t border-white/10 flex items-center justify-between">
            <button
              type="button"
              onClick={() => {
                sound.playClick();
                setOrderWorkbookModalOpen(false);
              }}
              className="px-4 py-2 text-xs text-gray-400 hover:text-white cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-[#FFE500] hover:bg-[#E6CF00] text-black text-xs font-black shadow-yellow-glow-sm transition-all cursor-pointer"
            >
              Submit Workbook Order
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
