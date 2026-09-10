import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { LeadsView } from './LeadsView';
import { WorkbooksView } from './WorkbooksView';
import { FreeSlotsView } from './FreeSlotsView';
import { RatingsView } from './RatingsView';
import { ReferralView } from './ReferralView';
import {
  Compass,
  UserPlus,
  BookOpen,
  CalendarClock,
  Star,
  Share2,
} from 'lucide-react';
import { sound } from '../utils/sound';

export const HubView: React.FC = () => {
  const [activeSection, setActiveSection] = useState<'leads' | 'workbooks' | 'freeslots' | 'ratings' | 'referral'>('leads');

  const hubTabs = [
    { id: 'leads', label: 'Lead Logging', icon: UserPlus },
    { id: 'workbooks', label: 'Workbooks & Gear', icon: BookOpen },
    { id: 'freeslots', label: 'Free Slot Planner', icon: CalendarClock },
    { id: 'ratings', label: 'Faculty Ratings', icon: Star },
    { id: 'referral', label: 'Referral Program', icon: Share2 },
  ];

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Sub navigation bar */}
      <div className="flex overflow-x-auto gap-2 p-1.5 rounded-2xl bg-[#101017] border border-white/[0.08] no-scrollbar">
        {hubTabs.map((tab) => {
          const Icon = tab.icon;
          const isSelected = activeSection === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => {
                sound.playClick();
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                setActiveSection(tab.id as any);
              }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                isSelected
                  ? 'glossy-button-yellow shadow-gold-glow-sm scale-[1.01]'
                  : 'bg-[#151520] hover:bg-[#1C1C28] text-gray-300 border border-white/5'
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Render active section */}
      <div>
        {activeSection === 'leads' && <LeadsView />}
        {activeSection === 'workbooks' && <WorkbooksView />}
        {activeSection === 'freeslots' && <FreeSlotsView />}
        {activeSection === 'ratings' && <RatingsView />}
        {activeSection === 'referral' && <ReferralView />}
      </div>
    </div>
  );
};
