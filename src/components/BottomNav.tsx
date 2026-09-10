import React from 'react';
import { useApp } from '../context/AppContext';
import {
  LayoutDashboard,
  Users,
  CalendarDays,
  MessageSquare,
  Compass,
} from 'lucide-react';
import { sound } from '../utils/sound';

interface NavItem {
  id: string;
  label: string;
  icon: React.ElementType;
  badge?: number;
}

export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab, updates } = useApp();

  const navItems: NavItem[] = [
    { id: 'home', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'batches', label: 'Batches', icon: Users },
    { id: 'reschedule', label: 'Sessions', icon: CalendarDays },
    { id: 'updates', label: 'Updates', icon: MessageSquare, badge: updates.length },
    { id: 'hub', label: 'Studio Hub', icon: Compass },
  ];

  const handleSelectTab = (id: string) => {
    sound.playClick();
    setActiveTab(id);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-[#08080A]/95 backdrop-blur-xl border-t border-white/[0.08] px-3 py-2">
      <div className="max-w-md mx-auto flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => handleSelectTab(item.id)}
              className={`relative flex flex-col items-center py-1 px-3 rounded-2xl transition-all cursor-pointer ${
                isActive
                  ? 'text-[#FACC15]'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              {/* Active Indicator Top Glow */}
              {isActive && (
                <div className="absolute -top-2 w-7 h-1 bg-[#FACC15] rounded-full shadow-[0_0_8px_#FACC15]" />
              )}

              <div className="relative">
                <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110' : ''}`} />
                {item.badge && item.badge > 0 && !isActive && (
                  <span className="absolute -top-1 -right-2 w-3.5 h-3.5 bg-[#FACC15] text-black font-black text-[8px] rounded-full flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </div>

              <span className={`text-[10px] mt-1 font-semibold tracking-wide ${isActive ? 'text-[#FACC15] font-bold' : 'text-gray-400'}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
