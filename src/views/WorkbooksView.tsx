import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { WorkbookOrder } from '../types';
import {
  BookOpen,
  Package,
  Truck,
  CheckCircle,
  Clock,
  Plus,
} from 'lucide-react';
import { sound } from '../utils/sound';

export const WorkbooksView: React.FC = () => {
  const { workbookOrders, setOrderWorkbookModalOpen } = useApp();
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const filteredOrders = workbookOrders.filter(
    (order) => filterStatus === 'all' || order.status === filterStatus
  );

  const getStatusStep = (status: WorkbookOrder['status']) => {
    switch (status) {
      case 'ordered':
        return 1;
      case 'dispatched':
        return 2;
      case 'in_transit':
        return 3;
      case 'delivered':
        return 4;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
            <BookOpen className="w-6 h-6 text-[#FACC15]" />
            <span>Workbook & Material Distribution Portal</span>
          </h1>
          <p className="text-xs text-gray-400">
            Track student syllabus delivery pipelines and place direct curriculum orders
          </p>
        </div>

        <button
          onClick={() => {
            sound.playClick();
            setOrderWorkbookModalOpen(true);
          }}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#FACC15] hover:bg-[#EAB308] text-black text-xs font-black shadow-gold-glow-sm transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Order Workbooks / Gear</span>
        </button>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.map((order) => {
          const step = getStatusStep(order.status);

          return (
            <div
              key={order.id}
              className="p-6 rounded-3xl bg-[#101015] border border-white/[0.08] hover:border-white/20 transition-all space-y-4 shadow-card-dark"
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-black uppercase px-2.5 py-0.5 rounded-full bg-[#FACC15] text-black">
                      Qty: {order.quantity}
                    </span>
                    <h3 className="text-sm sm:text-base font-bold text-white">
                      {order.itemTitle}
                    </h3>
                  </div>
                  <p className="text-xs text-gray-300 mt-1">
                    Student: <strong className="text-white">{order.studentName}</strong> • {order.batchName} ({order.edition})
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-xs font-mono font-bold text-[#FACC15] bg-black/60 px-3 py-1 rounded-xl border border-[#FACC15]/30 inline-block">
                    {order.trackingNumber}
                  </span>
                  <p className="text-[10px] text-gray-400 mt-1">
                    Est. Arrival: <strong className="text-gray-200">{order.estimatedDelivery}</strong>
                  </p>
                </div>
              </div>

              {/* Progress Steps Indicator */}
              <div className="pt-2">
                <div className="grid grid-cols-4 gap-2 text-center">
                  {[
                    { label: 'Ordered', icon: Clock, stepNum: 1 },
                    { label: 'Dispatched', icon: Package, stepNum: 2 },
                    { label: 'In-Transit', icon: Truck, stepNum: 3 },
                    { label: 'Delivered', icon: CheckCircle, stepNum: 4 },
                  ].map((s) => {
                    const isPassed = step >= s.stepNum;
                    const isCurrent = step === s.stepNum;
                    const Icon = s.icon;

                    return (
                      <div key={s.label} className="flex flex-col items-center space-y-1">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                            isPassed
                              ? 'bg-[#FACC15] text-black shadow-gold-glow-sm'
                              : 'bg-[#181824] text-gray-500 border border-white/5'
                          } ${isCurrent ? 'ring-2 ring-white/50' : ''}`}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        <span
                          className={`text-[10px] font-semibold ${
                            isPassed ? 'text-white' : 'text-gray-500'
                          }`}
                        >
                          {s.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
                {/* Connecting Track */}
                <div className="h-1 bg-[#1A1A24] rounded-full mt-3 mx-8 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#FACC15] to-[#EAB308] transition-all duration-500 shadow-[0_0_8px_#FACC15]"
                    style={{ width: `${(step / 4) * 100}%` }}
                  />
                </div>
              </div>

              <div className="pt-2 border-t border-white/5 flex flex-wrap items-center justify-between gap-2 text-[11px] text-gray-400">
                <span>Destination: <strong className="text-gray-300">{order.studioAddress}</strong></span>
                <span className="text-[10px] text-[#FACC15] font-mono font-bold">Courier: RYD Express Direct</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
