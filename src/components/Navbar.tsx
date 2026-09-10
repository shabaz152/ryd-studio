import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Volume2,
  VolumeX,
  Smartphone,
  Monitor,
  Bell,
  CheckCircle2,
  Clock,
  Activity,
  Star,
  LayoutDashboard,
  Users,
  CalendarDays,
  MessageSquare,
  Compass,
  Sun,
  Moon,
  Cloud,
  CloudOff,
  RefreshCw,
} from 'lucide-react';
import { sound } from '../utils/sound';

export const Navbar: React.FC = () => {
  const {
    teacher,
    setTeacherName,
    isCheckedIn,
    checkedInSession,
    isRunningLate,
    runningLateMinutes,
    soundEnabled,
    toggleSound,
    viewMode,
    toggleViewMode,
    themeMode,
    toggleThemeMode,
    replaySplash,
    updates,
    activeTab,
    setActiveTab,
    syncStatus,
    lastSyncedAt,
    triggerCloudSync,
  } = useApp();

  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(teacher.name);

  const handleNameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (tempName.trim()) {
      setTeacherName(tempName.trim());
    }
    setIsEditingName(false);
  };

  const navLinks = [
    { id: 'home', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'batches', label: 'Batches & Maps', icon: Users },
    { id: 'reschedule', label: 'Sessions & Sync', icon: CalendarDays },
    { id: 'updates', label: 'Updates', icon: MessageSquare, badge: updates.length },
    { id: 'hub', label: 'Studio Hub', icon: Compass },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#07070B]/90 backdrop-blur-2xl border-b border-white/[0.09] px-4 sm:px-6 py-2.5 transition-colors top-sheen shadow-lg">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Left: Brand Monogram & Desktop Navigation */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={replaySplash}
            title="Click to replay RYD STUDIO intro"
            className="flex items-center gap-2.5 group cursor-pointer text-left"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-b from-[#20202E] to-[#101017] border border-[#FFD000]/40 flex items-center justify-center shadow-gold-glow-sm group-hover:border-[#FFD000] transition-all">
              <span className="font-display font-black text-[#FFD000] text-base tracking-tight">R</span>
            </div>
            <div>
              <div className="flex items-center gap-1 leading-none">
                <span className="font-display font-black tracking-tight text-white text-sm">RYD</span>
                <span className="font-display font-black tracking-tight text-[#FFD000]">STUDIO</span>
              </div>
              <p className="text-[9px] text-gray-400 font-bold tracking-widest uppercase mt-0.5">Faculty Platform</p>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          {viewMode !== 'mobile' && (
            <nav className="hidden lg:flex items-center gap-1 ml-4 pl-4 border-l border-slate-200 dark:border-white/10">
              {navLinks.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;

                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      sound.playClick();
                      setActiveTab(tab.id);
                    }}
                    className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      isActive
                        ? 'bg-amber-100 text-amber-900 border border-amber-300 dark:glossy-button-yellow font-black shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-gray-300 dark:hover:text-white dark:hover:bg-white/[0.06]'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{tab.label}</span>
                    {tab.badge && tab.badge > 0 && !isActive && (
                      <span className="w-4 h-4 rounded-full bg-amber-500 text-white dark:bg-[#FFD000] dark:text-black text-[9px] font-black flex items-center justify-center ml-0.5">
                        {tab.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          )}
        </div>

        {/* Center: Live Status Indicator */}
        {viewMode !== 'mobile' && (
          <div className="hidden sm:flex items-center">
            {isCheckedIn ? (
              <div className="flex items-center gap-2 bg-amber-100 border border-amber-300 text-amber-900 dark:glossy-pill-yellow dark:text-[#FFD000] px-4 py-1 rounded-full text-xs font-bold">
                <span className="w-2 h-2 rounded-full bg-amber-500 dark:bg-[#FFD000] animate-ping shrink-0" />
                <span className="truncate max-w-[180px] md:max-w-[240px]">
                  In Session: {checkedInSession?.batchName || 'Active'}
                </span>
              </div>
            ) : isRunningLate ? (
              <div className="flex items-center gap-2 bg-amber-500/15 border border-amber-500/40 text-amber-700 dark:text-amber-300 px-3.5 py-1 rounded-full text-xs font-bold">
                <Clock className="w-3.5 h-3.5 shrink-0 text-amber-600 dark:text-amber-400" />
                <span>Late +{runningLateMinutes}m (Parents Notified)</span>
              </div>
            ) : (
              <div className="hidden xl:flex items-center gap-2 bg-white/90 border border-slate-200 text-slate-700 dark:bg-[#12121A]/80 dark:border-white/[0.08] dark:text-gray-300 px-3.5 py-1 rounded-full text-xs font-medium shadow-xs">
                <span className="w-2 h-2 rounded-full bg-amber-500 dark:bg-[#FFD000]" />
                <span>Schedule Ready: 16:00 (Hip-Hop Juniors)</span>
              </div>
            )}
          </div>
        )}

        {/* Right: Controls & Teacher Profile */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Sound Mute Toggle */}
          <button
            onClick={toggleSound}
            title={soundEnabled ? 'Mute Studio Audio' : 'Enable Studio Audio'}
            className={`p-2 rounded-xl border transition-all cursor-pointer ${
              soundEnabled
                ? 'bg-white border-amber-300 text-amber-600 hover:bg-amber-50 dark:bg-[#151520] dark:border-[#FFD000]/30 dark:text-[#FFD000] dark:hover:bg-[#FFD000]/10 shadow-xs'
                : 'bg-white border-slate-200 text-slate-400 hover:text-slate-700 dark:bg-[#151520] dark:border-white/10 dark:text-gray-500 dark:hover:text-white shadow-xs'
            }`}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* View Mode Toggle */}
          <button
            onClick={toggleViewMode}
            title={viewMode === 'mobile' ? 'Switch to Full Dashboard' : 'Preview as Mobile App Frame'}
            className={`p-2 rounded-xl border transition-all cursor-pointer ${
              viewMode === 'mobile'
                ? 'bg-amber-500 border-amber-600 text-white dark:glossy-button-yellow shadow-xs'
                : 'bg-white border-slate-200 text-slate-600 hover:text-amber-600 dark:bg-[#151520] dark:border-white/10 dark:text-gray-300 dark:hover:text-[#FFD000] shadow-xs'
            }`}
          >
            {viewMode === 'mobile' ? <Monitor className="w-4 h-4" /> : <Smartphone className="w-4 h-4" />}
          </button>

          {/* Theme Mode Toggle (Subtle CRM Light <-> Obsidian Dark) */}
          <button
            onClick={toggleThemeMode}
            title={themeMode === 'light' ? 'Switch to Dark Obsidian Theme' : 'Switch to Subtle CRM Light Theme'}
            className={`p-2 rounded-xl border transition-all cursor-pointer ${
              themeMode === 'light'
                ? 'bg-white border-amber-300 text-amber-700 hover:bg-amber-50 shadow-xs'
                : 'bg-[#151520] border-white/10 text-gray-300 hover:text-[#FFD000]'
            }`}
          >
            {themeMode === 'light' ? (
              <Sun className="w-4 h-4 text-amber-600" />
            ) : (
              <Moon className="w-4 h-4 text-[#FFD000]" />
            )}
          </button>

          {/* Real-Time Cross-Device Cloud Sync Button */}
          <button
            onClick={triggerCloudSync}
            title={
              syncStatus === 'syncing'
                ? 'Syncing changes to cloud...'
                : syncStatus === 'synced'
                ? `Live Cloud Synced (Last synced: ${lastSyncedAt ? lastSyncedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) : 'just now'}) • Click to sync now`
                : 'Offline mode • Click to retry sync'
            }
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border transition-all cursor-pointer text-xs font-semibold ${
              syncStatus === 'syncing'
                ? 'bg-amber-50 border-amber-300 text-amber-800 dark:bg-amber-500/10 dark:border-amber-500/30 dark:text-amber-400'
                : syncStatus === 'synced'
                ? 'bg-emerald-50 border-emerald-300 text-emerald-800 dark:bg-emerald-500/10 dark:border-emerald-500/30 dark:text-emerald-400 shadow-xs'
                : 'bg-red-50 border-red-200 text-red-700 dark:bg-red-500/10 dark:border-red-500/30 dark:text-red-400'
            }`}
          >
            {syncStatus === 'syncing' ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-600 dark:text-amber-400" />
            ) : syncStatus === 'synced' ? (
              <div className="flex items-center gap-1.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                <Cloud className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              </div>
            ) : (
              <CloudOff className="w-3.5 h-3.5 text-red-500" />
            )}
            <span className="hidden md:inline text-[11px] font-bold">
              {syncStatus === 'syncing' ? 'Syncing...' : syncStatus === 'synced' ? 'Live Cloud' : 'Offline'}
            </span>
          </button>

          {/* Notifications Bell */}
          <button
            onClick={() => setActiveTab('updates')}
            title="View Updates & Messages"
            className="relative p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-amber-600 dark:bg-[#151520] dark:border-white/10 dark:text-gray-300 dark:hover:text-[#FFD000] transition-colors cursor-pointer shadow-xs"
          >
            <Bell className="w-4 h-4" />
            {updates.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-500 text-white dark:bg-[#FFD000] dark:text-black text-[9px] font-black flex items-center justify-center shadow-sm">
                {updates.length}
              </span>
            )}
          </button>

          {/* Teacher Profile Pill */}
          <div className="flex items-center gap-2 pl-2 border-l border-white/10">
            <div className="relative">
              <img
                src={teacher.avatarUrl}
                alt={teacher.name}
                className="w-8 h-8 rounded-xl object-cover border border-[#FFD000]/50"
              />
              <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#FFD000] border border-[#050507]" />
            </div>

            <div className="hidden md:block text-left">
              {isEditingName ? (
                <form onSubmit={handleNameSubmit} className="flex items-center gap-1">
                  <input
                    type="text"
                    value={tempName}
                    onChange={(e) => setTempName(e.target.value)}
                    className="bg-[#181824] border border-[#FFD000] text-white text-[11px] px-2 py-0.5 rounded focus:outline-none"
                    autoFocus
                    onBlur={() => setIsEditingName(false)}
                  />
                  <button type="submit" className="bg-[#FFD000] text-black text-[9px] font-bold px-1.5 py-0.5 rounded">
                    Save
                  </button>
                </form>
              ) : (
                <div
                  onClick={() => setIsEditingName(true)}
                  className="cursor-pointer group flex items-center gap-1"
                  title="Click to edit name"
                >
                  <div>
                    <p className="text-xs font-bold text-white group-hover:text-[#FFD000] transition-colors truncate max-w-[100px]">
                      {teacher.name}
                    </p>
                    <div className="flex items-center gap-1 text-[10px] text-[#FFD000] font-semibold">
                      <Star className={`w-3 h-3 ${teacher.rating > 0 ? 'fill-[#FFD000] text-[#FFD000]' : 'text-gray-500'}`} />
                      <span>{teacher.rating > 0 ? `${teacher.rating.toFixed(2)} Lead` : '0.00 Lead'}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Sub-Header Greeting Strip */}
      <div className="max-w-7xl mx-auto mt-2 pt-2 border-t border-white/[0.04] flex items-center justify-between text-xs text-gray-300">
        <div className="flex items-center gap-2 truncate">
          <Activity className="w-3.5 h-3.5 text-[#FFD000] shrink-0" />
          <span className="truncate">
            Hey <strong className="text-[#FFD000] font-bold">{teacher.name}</strong>, congratulations and welcome to RYD STUDIO!
          </span>
        </div>

        <div className="hidden sm:flex items-center gap-4 text-[11px] text-gray-400">
          <span>Today: <strong>{new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</strong></span>
          <span>•</span>
          <span>Faculty Status: <strong className="text-emerald-400">Ready</strong></span>
        </div>
      </div>
    </header>
  );
};
