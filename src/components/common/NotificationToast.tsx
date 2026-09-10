import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';

export const NotificationToast: React.FC = () => {
  const { toasts, dismissToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-16 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        let borderClass = 'border-white/10';
        let bgClass = 'bg-[#181820]';
        let icon = <Info className="w-4 h-4 text-[#FFE500]" />;

        if (toast.type === 'success') {
          borderClass = 'border-[#FFE500]/50 shadow-yellow-glow-sm';
          bgClass = 'bg-[#14141A]';
          icon = <CheckCircle2 className="w-4 h-4 text-[#FFE500]" />;
        } else if (toast.type === 'alert') {
          borderClass = 'border-amber-500/50 shadow-md';
          bgClass = 'bg-[#1A1510]';
          icon = <AlertTriangle className="w-4 h-4 text-amber-400" />;
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto p-3.5 rounded-2xl border ${borderClass} ${bgClass} text-white shadow-2xl animate-fade-in flex items-start justify-between gap-3`}
          >
            <div className="flex items-start gap-2.5">
              <div className="mt-0.5 shrink-0">{icon}</div>
              <div>
                <p className="text-xs font-black tracking-tight text-white">{toast.title}</p>
                <p className="text-[11px] text-gray-300 leading-snug mt-0.5">{toast.description}</p>
              </div>
            </div>
            <button
              onClick={() => dismissToast(toast.id)}
              className="text-gray-400 hover:text-white shrink-0 p-1 rounded-lg hover:bg-white/10 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
