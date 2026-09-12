import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Volume2,
  VolumeX,
  Smartphone,
  Monitor,
  Bell,
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
  Sparkles,
  RotateCcw,
} from 'lucide-react';
import { sound } from '../utils/sound';

export const Navbar: React.FC = () => {
  const {
    teacher,
    setTeacherName,
    isCheckedIn,
    checkedInSession,
    setCheckOutModalOpen,
    openCheckOutForSession,
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
    isDemoMode,
    toggleDemoMode,
    activeRole,
    tutorOnlineStatus,
    unreadAdminActivityCount,
    unreadParentActivityCount,
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
    { id: 'home', label: 'Dashboard', shortLabel: 'Dashboard', icon: LayoutDashboard },
    { id: 'batches', label: 'Batches & Maps', shortLabel: 'Batches', icon: Users },
    { id: 'reschedule', label: 'Sessions & Sync', shortLabel: 'Sessions', icon: CalendarDays },
    { id: 'updates', label: 'Updates', shortLabel: 'Updates', icon: MessageSquare, badge: updates.length },
    { id: 'hub', label: 'Academic Hub', shortLabel: 'Hub', icon: Compass },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-[#07070B]/95 backdrop-blur-2xl border-b border-slate-200 dark:border-white/[0.09] text-slate-900 dark:text-white px-3 sm:px-6 py-2.5 transition-colors top-sheen shadow-xs dark:shadow-lg">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
        {/* Left: Brand Monogram & Desktop Navigation */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            onClick={replaySplash}
            title="Click to replay RYD STUDIO intro"
            className="flex items-center gap-2.5 group cursor-pointer text-left shrink-0"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-b from-slate-900 to-slate-800 dark:from-[#20202E] dark:to-[#101017] border border-amber-400/50 dark:border-[#FFD000]/40 flex items-center justify-center shadow-gold-glow-sm group-hover:border-amber-500 dark:group-hover:border-[#FFD000] transition-all">
              <span className="font-display font-black text-[#FFD000] text-base tracking-tight">R</span>
            </div>
            <div className="hidden sm:block">
              <div className="flex items-center gap-1 leading-none">
                <span className="font-display font-black tracking-tight text-slate-900 dark:text-white text-sm">RYD</span>
                <span className="font-display font-black tracking-tight text-amber-500 dark:text-[#FFD000]">STUDIO</span>
              </div>
              <p className="text-[9px] text-slate-500 dark:text-gray-400 font-bold tracking-widest uppercase mt-0.5">Faculty Platform</p>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          {viewMode !== 'mobile' && (
            <nav className="hidden lg:flex items-center gap-1 ml-1 xl:ml-3 pl-2 xl:pl-3 border-l border-slate-200 dark:border-white/10">
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
                    className={`flex items-center gap-1.5 px-2.5 xl:px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                      isActive
                        ? 'bg-amber-100 text-amber-900 border border-amber-300 dark:glossy-button-yellow dark:text-black font-black shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-gray-300 dark:hover:text-white dark:hover:bg-white/[0.06]'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5 shrink-0" />
                    <span className="hidden xl:inline">{tab.label}</span>
                    <span className="inline xl:hidden">{tab.shortLabel}</span>
                    {tab.badge && tab.badge > 0 && !isActive && (
                      <span className="w-4 h-4 rounded-full bg-amber-500 text-white dark:bg-[#FFD000] dark:text-black text-[9px] font-black flex items-center justify-center ml-0.5 shrink-0">
                        {tab.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          )}
        </div>

        {/* Center: Live Status Indicator (Sleek Rounded-XL Badge, Never a curved sphere/egg) */}
        {viewMode !== 'mobile' && (
          <div className="hidden 2xl:flex items-center shrink-0">
            {isCheckedIn ? (
              <button
                onClick={() => {
                  sound.playClick();
                  if (checkedInSession) {
                    openCheckOutForSession(checkedInSession);
                  } else {
                    setCheckOutModalOpen(true);
                  }
                }}
                className="flex items-center gap-2 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-800 dark:bg-emerald-500/15 dark:border-emerald-500/30 dark:text-emerald-400 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs whitespace-nowrap shrink-0"
                title="Active Session: Click to Check Out and log student attendance"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping shrink-0" />
                <span className="whitespace-nowrap">
                  In Session: {checkedInSession?.batchName || 'Active'}
                </span>
                <span className="text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded bg-emerald-600 text-white dark:bg-[#FFD000] dark:text-black">
                  Check Out
                </span>
              </button>
            ) : isRunningLate ? (
              <div className="flex items-center gap-2 bg-amber-50 border border-amber-300 text-amber-800 dark:bg-amber-500/15 dark:border-amber-500/40 dark:text-amber-300 px-3 py-1.5 rounded-xl text-xs font-bold shadow-xs whitespace-nowrap shrink-0">
                <Clock className="w-3.5 h-3.5 shrink-0 text-amber-600 dark:text-amber-400" />
                <span>Late +{runningLateMinutes}m (Parents Alerted)</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 bg-slate-100 border border-slate-200 text-slate-700 dark:bg-[#14141E] dark:border-white/10 dark:text-gray-300 px-3 py-1.5 rounded-xl text-xs font-semibold shadow-xs whitespace-nowrap shrink-0">
                <span className="w-2 h-2 rounded-full bg-amber-500 dark:bg-[#FFD000] shrink-0" />
                <span>Schedule Ready: 16:00 (Advanced Calculus)</span>
              </div>
            )}
          </div>
        )}

        {/* Right: Controls & Teacher Profile */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Sound Mute Toggle */}
          <button
            onClick={toggleSound}
            title={soundEnabled ? 'Mute Audio' : 'Enable Audio'}
            className={`p-2 rounded-xl border transition-all cursor-pointer shrink-0 ${
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
            className={`p-2 rounded-xl border transition-all cursor-pointer shrink-0 ${
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
            className={`p-2 rounded-xl border transition-all cursor-pointer shrink-0 ${
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

          {/* Demo Mode / Clean 0-Baseline Switcher */}
          <button
            onClick={toggleDemoMode}
            title={isDemoMode ? 'Active: Demo Data Loaded. Click to reset to clean 0-baseline account' : 'Active: Clean 0-Baseline. Click to load realistic sample demo data'}
            className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer shrink-0 ${
              isDemoMode
                ? 'bg-amber-100 dark:bg-[#FFD000]/15 border-amber-300 dark:border-[#FFD000]/40 text-amber-900 dark:text-[#FFD000]'
                : 'bg-white border-slate-200 dark:bg-[#151520] dark:border-white/10 text-slate-600 dark:text-gray-300 hover:text-amber-600 dark:hover:text-[#FFD000] shadow-xs'
            }`}
          >
            {isDemoMode ? (
              <>
                <RotateCcw className="w-3.5 h-3.5 text-amber-600 dark:text-[#FFD000] shrink-0" />
                <span className="text-[11px] whitespace-nowrap">0-Baseline</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 text-amber-500 dark:text-[#FFD000] shrink-0" />
                <span className="text-[11px] whitespace-nowrap">Demo</span>
              </>
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
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border transition-all cursor-pointer text-xs font-semibold shrink-0 ${
              syncStatus === 'syncing'
                ? 'bg-amber-50 border-amber-300 text-amber-800 dark:bg-amber-500/10 dark:border-amber-500/30 dark:text-amber-400'
                : syncStatus === 'synced'
                ? 'bg-emerald-50 border-emerald-300 text-emerald-800 dark:bg-emerald-500/10 dark:border-emerald-500/30 dark:text-emerald-400 shadow-xs'
                : 'bg-red-50 border-red-200 text-red-700 dark:bg-red-500/10 dark:border-red-500/30 dark:text-red-400'
            }`}
          >
            {syncStatus === 'syncing' ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-600 dark:text-amber-400 shrink-0" />
            ) : syncStatus === 'synced' ? (
              <div className="flex items-center gap-1.5 shrink-0">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                <Cloud className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
              </div>
            ) : (
              <CloudOff className="w-3.5 h-3.5 text-red-500 shrink-0" />
            )}
            <span className="hidden xl:inline text-[11px] font-bold whitespace-nowrap">
              {syncStatus === 'syncing' ? 'Syncing...' : syncStatus === 'synced' ? 'Live Cloud' : 'Offline'}
            </span>
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleThemeMode}
            title={themeMode === 'light' ? 'Switch to Dark Viewport' : 'Switch to CRM Light Viewport'}
            className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-amber-600 dark:bg-[#151520] dark:border-white/10 dark:text-gray-300 dark:hover:text-[#FFD000] transition-colors cursor-pointer shadow-xs shrink-0"
          >
            {themeMode === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          </button>

          {/* Audio Feedback Toggle */}
          <button
            onClick={toggleSound}
            title={soundEnabled ? 'Mute Audio Cues' : 'Enable Audio Cues'}
            className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-amber-600 dark:bg-[#151520] dark:border-white/10 dark:text-gray-300 dark:hover:text-[#FFD000] transition-colors cursor-pointer shadow-xs shrink-0"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-amber-500 dark:text-[#FFD000]" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
          </button>

          {/* Viewport Mode Switcher */}
          <button
            onClick={toggleViewMode}
            title={viewMode === 'responsive' ? 'Switch to Mobile Frame View' : 'Switch to Full Screen View'}
            className="hidden sm:flex p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-amber-600 dark:bg-[#151520] dark:border-white/10 dark:text-gray-300 dark:hover:text-[#FFD000] transition-colors cursor-pointer shadow-xs shrink-0"
          >
            {viewMode === 'responsive' ? <Smartphone className="w-4 h-4" /> : <Monitor className="w-4 h-4" />}
          </button>

          {/* Notifications Bell */}
          <button
            onClick={() => setActiveTab('updates')}
            title="View Updates & Messages"
            className="relative p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-amber-600 dark:bg-[#151520] dark:border-white/10 dark:text-gray-300 dark:hover:text-[#FFD000] transition-colors cursor-pointer shadow-xs shrink-0"
          >
            <Bell className="w-4 h-4" />
            {updates.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-500 text-white dark:bg-[#FFD000] dark:text-black text-[9px] font-black flex items-center justify-center shadow-sm">
                {updates.length}
              </span>
            )}
          </button>

          {/* Role-Aware Profile Pill: NEVER clipped, full width, clear text in light and dark mode */}
          <div className="flex items-center gap-2 pl-2 sm:pl-3 border-l border-slate-200 dark:border-white/10 shrink-0">
            {activeRole === 'admin' ? (
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-500 text-black font-black flex items-center justify-center text-xs shadow-xs shrink-0">
                  👑
                </div>
                <div className="text-left shrink-0">
                  <p className="text-xs font-bold text-slate-900 dark:text-white whitespace-nowrap leading-tight">
                    Owner (Admin)
                  </p>
                  <p className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold whitespace-nowrap">
                    Executive Access
                  </p>
                </div>
              </div>
            ) : activeRole === 'parent' ? (
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-500 text-white font-black flex items-center justify-center text-xs shadow-xs shrink-0">
                  👨‍👩‍👧
                </div>
                <div className="text-left shrink-0">
                  <p className="text-xs font-bold text-slate-900 dark:text-white whitespace-nowrap leading-tight">
                    Marcus Vance
                  </p>
                  <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold whitespace-nowrap">
                    Parent (Aria)
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <div className="relative shrink-0">
                  <img
                    src={teacher.avatarUrl}
                    alt={teacher.name}
                    className="w-8 h-8 rounded-xl object-cover border-2 border-amber-400 dark:border-[#FFD000]/60 shrink-0 shadow-xs"
                  />
                  <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500 border-2 border-white dark:border-[#050507]" />
                </div>

                <div className="text-left shrink-0">
                  {isEditingName ? (
                    <form onSubmit={handleNameSubmit} className="flex items-center gap-1">
                      <input
                        type="text"
                        value={tempName}
                        onChange={(e) => setTempName(e.target.value)}
                        className="bg-white dark:bg-[#181824] border border-amber-400 dark:border-[#FFD000] text-slate-900 dark:text-white text-xs px-2 py-0.5 rounded-lg focus:outline-none w-28"
                        autoFocus
                        onBlur={() => setIsEditingName(false)}
                      />
                      <button type="submit" className="bg-amber-500 text-white dark:bg-[#FFD000] dark:text-black text-[10px] font-bold px-2 py-0.5 rounded-lg cursor-pointer">
                        Save
                      </button>
                    </form>
                  ) : (
                    <div
                      onClick={() => {
                        setTempName(teacher.name);
                        setIsEditingName(true);
                      }}
                      className="cursor-pointer group select-none"
                      title="Click to edit teacher name"
                    >
                      <p className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-[#FFD000] transition-colors whitespace-nowrap leading-tight">
                        {teacher.name}
                      </p>
                      <div className="flex items-center gap-1 text-[10px] text-amber-600 dark:text-[#FFD000] font-semibold whitespace-nowrap">
                        <Star className={`w-3 h-3 ${teacher.rating > 0 ? 'fill-amber-500 text-amber-500 dark:fill-[#FFD000] dark:text-[#FFD000]' : 'text-slate-400 dark:text-gray-500'}`} />
                        <span>{teacher.rating > 0 ? `${teacher.rating.toFixed(2)} Rating` : '0.00 Faculty'}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Sub-Header Greeting Strip */}
      <div className="max-w-7xl mx-auto mt-2 pt-2 border-t border-slate-200/60 dark:border-white/[0.04] flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600 dark:text-gray-300">
        <div className="flex items-center gap-2 min-w-0">
          <Activity className="w-3.5 h-3.5 text-amber-500 dark:text-[#FFD000] shrink-0" />
          <span className="truncate">
            {activeRole === 'admin' ? (
              <span>👑 <strong className="text-amber-600 dark:text-amber-400 font-bold">Admin Command Center</strong> • Real-time triangular activity audit & center oversight active</span>
            ) : activeRole === 'parent' ? (
              <span>👨‍👩‍👧 <strong className="text-emerald-600 dark:text-emerald-400 font-bold">Parent & Student Hub</strong> • Monitoring Aria Vance (Grade 11 - Calculus & Physics)</span>
            ) : (
              <span>Welcome back, <strong className="text-amber-600 dark:text-[#FFD000] font-bold">{teacher.name}</strong> • Academic Tutoring & Faculty Hub</span>
            )}
          </span>
        </div>

        <div className="flex items-center gap-3 text-[11px] text-slate-500 dark:text-gray-400 shrink-0">
          <span className="hidden sm:inline">Today: <strong className="text-slate-700 dark:text-gray-200">{new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</strong></span>
          <span className="hidden sm:inline">•</span>
          <span>Faculty Shift: <strong className="text-emerald-600 dark:text-emerald-400">{tutorOnlineStatus.toUpperCase()}</strong></span>
          <span>•</span>
          <span>Triangular Link: <strong className="text-amber-600 dark:text-amber-400 font-semibold">Live Synced</strong></span>
        </div>
      </div>
    </header>
  );
};
