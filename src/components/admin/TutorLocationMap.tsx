import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  MapPin,
  Navigation,
  Compass,
  Radio,
  Battery,
  Zap,
  Clock,
  Car,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Send,
  Shield,
  Layers,
} from 'lucide-react';
import { sound } from '../../utils/sound';

export const TutorLocationMap: React.FC = () => {
  const { tutors, simulateTutorMovement, pingTutor, setComposeUpdateModalOpen } = useApp();
  const [selectedTutorId, setSelectedTutorId] = useState<string>(tutors[0]?.id || '');
  const [mapMode, setMapMode] = useState<'radar' | 'satellite'>('radar');

  const selectedTutor = tutors.find((t) => t.id === selectedTutorId) || tutors[0];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/90 dark:bg-[#10101C] p-4 sm:p-5 rounded-2xl border border-slate-800 dark:border-white/10 shadow-lg">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
              <Radio className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              <span>Admin GPS Telemetry</span>
            </span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">
              ● Active Radar Tracking
            </span>
          </div>
          <h2 className="text-lg sm:text-xl font-black text-white mt-1 flex items-center gap-2">
            <span>Faculty Live Location & Transit Radar</span>
          </h2>
          <p className="text-xs text-slate-400">
            Real-time geofenced tracking of all tutors. Monitor campus arrivals, in-transit delays, and classroom check-in verification.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-white/10">
            <button
              onClick={() => {
                sound.playClick();
                setMapMode('radar');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                mapMode === 'radar'
                  ? 'bg-amber-500 text-black shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              GPS Radar
            </button>
            <button
              onClick={() => {
                sound.playClick();
                setMapMode('satellite');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                mapMode === 'satellite'
                  ? 'bg-amber-500 text-black shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Campus Map
            </button>
          </div>

          <button
            onClick={simulateTutorMovement}
            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black text-xs font-black transition-all shadow-md shadow-amber-500/20 flex items-center gap-1.5 cursor-pointer shrink-0"
            title="Simulate GPS movement: Dr. Alex Mercer advances toward campus, updating live ETA and geofence status"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Simulate Live Movement</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Radar Screen + Tutor Telemetry Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Radar / GPS Display View (8 cols) */}
        <div className="lg:col-span-7 xl:col-span-8 bg-slate-950 border border-slate-800 dark:border-white/10 rounded-3xl p-5 sm:p-6 relative overflow-hidden shadow-2xl flex flex-col justify-between min-h-[440px]">
          {/* Background grid lines */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f29370f_1px,transparent_1px),linear-gradient(to_bottom,#1f29370f_1px,transparent_1px)] bg-[size:28px_28px] pointer-events-none" />

          {/* Compass Rose & Telemetry Bar */}
          <div className="relative z-10 flex items-center justify-between text-xs text-slate-400 border-b border-white/5 pb-3">
            <div className="flex items-center gap-2">
              <Compass className="w-4 h-4 text-amber-400 animate-spin-slow" />
              <span className="font-mono text-[11px] text-amber-300">
                CAMPUS CENTER: 40.7128° N, 74.0060° W
              </span>
            </div>
            <div className="flex items-center gap-2 font-mono text-[11px]">
              <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                GEOFENCE: 200M RADIUS
              </span>
            </div>
          </div>

          {/* Radar Screen Visual */}
          <div className="relative my-auto py-8 flex items-center justify-center">
            {/* Concentric Radar Rings */}
            <div className="relative w-72 h-72 sm:w-96 sm:h-96 rounded-full border border-amber-500/20 flex items-center justify-center">
              {/* Outer Ring 1km */}
              <div className="absolute inset-0 rounded-full border border-slate-800 border-dashed" />
              <span className="absolute top-1 text-[9px] font-mono text-slate-600">1000m</span>

              {/* Middle Ring 500m */}
              <div className="w-48 h-48 sm:w-64 sm:h-64 rounded-full border border-slate-800 flex items-center justify-center relative">
                <span className="absolute top-1 text-[9px] font-mono text-slate-600">500m</span>

                {/* Inner Geofence Ring 200m */}
                <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-full border-2 border-emerald-500/40 bg-emerald-500/5 flex items-center justify-center relative shadow-[0_0_20px_rgba(16,185,129,0.1)]">
                  <span className="absolute -top-3 px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-400 border border-emerald-500/30 text-[8px] font-black uppercase tracking-wider">
                    Campus Geofence
                  </span>

                  {/* Center Dot: RYD Learning Center Campus */}
                  <div className="relative flex flex-col items-center">
                    <div className="w-4 h-4 rounded-full bg-amber-400 ring-4 ring-amber-400/20 shadow-gold-glow-sm flex items-center justify-center text-[8px] font-black text-black">
                      ★
                    </div>
                    <span className="absolute top-5 text-[9px] font-black text-amber-400 whitespace-nowrap bg-slate-950/80 px-1 rounded">
                      RYD Campus HQ
                    </span>
                  </div>
                </div>
              </div>

              {/* Radar Crosshairs */}
              <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[1px] bg-slate-800/80 pointer-events-none" />
              <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-[1px] bg-slate-800/80 pointer-events-none" />

              {/* Tutor Pin 1: Shazz (On-Site in Pod Alpha) */}
              <div
                onClick={() => {
                  sound.playClick();
                  setSelectedTutorId('tutor-shazz');
                }}
                className={`absolute top-[46%] left-[44%] -translate-x-1/2 -translate-y-1/2 cursor-pointer group transition-all z-20 ${
                  selectedTutorId === 'tutor-shazz' ? 'scale-125 z-30' : 'hover:scale-110'
                }`}
              >
                <div className="relative">
                  <div className="w-8 h-8 rounded-full border-2 border-emerald-400 bg-slate-900 overflow-hidden shadow-lg shadow-emerald-500/30">
                    <img
                      src={tutors[0]?.avatarUrl}
                      alt={tutors[0]?.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-slate-950 animate-ping" />
                  <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-slate-950" />
                </div>
                <div className="absolute top-9 left-1/2 -translate-x-1/2 bg-slate-900/95 border border-emerald-500/40 px-2 py-0.5 rounded-md shadow-md text-center whitespace-nowrap pointer-events-none">
                  <p className="text-[10px] font-black text-white">Shazz</p>
                  <p className="text-[8px] font-bold text-emerald-400 uppercase">On-Site (Pod Alpha)</p>
                </div>
              </div>

              {/* Tutor Pin 2: Dr. Alex Mercer (In-Transit) */}
              {tutors[1] && (
                <div
                  onClick={() => {
                    sound.playClick();
                    setSelectedTutorId('tutor-alex');
                  }}
                  style={{
                    top: `${20 + (tutors[1].location?.distanceKm || 0.8) * 15}%`,
                    left: `${75 - (tutors[1].location?.distanceKm || 0.8) * 10}%`,
                  }}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group transition-all duration-700 z-20 ${
                    selectedTutorId === 'tutor-alex' ? 'scale-125 z-30' : 'hover:scale-110'
                  }`}
                >
                  {/* Dashed Route Line to Campus */}
                  <svg className="absolute -top-12 -left-16 w-32 h-32 pointer-events-none -z-10 opacity-60">
                    <line
                      x1="64"
                      y1="64"
                      x2="0"
                      y2="0"
                      stroke="#F59E0B"
                      strokeWidth="1.5"
                      strokeDasharray="4 3"
                    />
                  </svg>

                  <div className="relative">
                    <div className="w-8 h-8 rounded-full border-2 border-amber-400 bg-slate-900 overflow-hidden shadow-lg shadow-amber-500/30">
                      <img
                        src={tutors[1].avatarUrl}
                        alt={tutors[1].name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-amber-400 ring-2 ring-slate-950 animate-ping" />
                    <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-amber-400 ring-2 ring-slate-950" />
                  </div>
                  <div className="absolute top-9 left-1/2 -translate-x-1/2 bg-slate-900/95 border border-amber-500/40 px-2 py-0.5 rounded-md shadow-md text-center whitespace-nowrap pointer-events-none">
                    <p className="text-[10px] font-black text-white">Dr. Alex</p>
                    <p className="text-[8px] font-bold text-amber-400 uppercase">
                      In-Transit • ETA {tutors[1].location?.etaMinutes || 6}m
                    </p>
                  </div>
                </div>
              )}

              {/* Tutor Pin 3: Priya Sundaram (Tech Lab) */}
              {tutors[2] && (
                <div
                  onClick={() => {
                    sound.playClick();
                    setSelectedTutorId('tutor-priya');
                  }}
                  className={`absolute top-[52%] left-[58%] -translate-x-1/2 -translate-y-1/2 cursor-pointer group transition-all z-20 ${
                    selectedTutorId === 'tutor-priya' ? 'scale-125 z-30' : 'hover:scale-110'
                  }`}
                >
                  <div className="relative">
                    <div className="w-8 h-8 rounded-full border-2 border-blue-400 bg-slate-900 overflow-hidden shadow-lg shadow-blue-500/30">
                      <img
                        src={tutors[2].avatarUrl}
                        alt={tutors[2].name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-blue-400 ring-2 ring-slate-950" />
                  </div>
                  <div className="absolute top-9 left-1/2 -translate-x-1/2 bg-slate-900/95 border border-blue-500/40 px-2 py-0.5 rounded-md shadow-md text-center whitespace-nowrap pointer-events-none">
                    <p className="text-[10px] font-black text-white">Priya</p>
                    <p className="text-[8px] font-bold text-blue-400 uppercase">Lab Delta</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Bottom Live Status Ticker */}
          <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-white/5 text-xs text-slate-400">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span>On-Site (2)</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
                <span>In-Transit (1)</span>
              </span>
            </div>
            <span className="text-[11px] font-mono text-slate-500">
              Auto-updating via Edge CDN Bus & GPS telemetry
            </span>
          </div>
        </div>

        {/* Selected Tutor Telemetry & Detailed Card (4 cols) */}
        <div className="lg:col-span-5 xl:col-span-4 space-y-4">
          {/* Quick Tutor Selection Pills */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Faculty Members ({tutors.length})
            </label>
            <div className="space-y-2">
              {tutors.map((tutor) => {
                const isSelected = tutor.id === selectedTutorId;
                const loc = tutor.location;

                return (
                  <div
                    key={tutor.id}
                    onClick={() => {
                      sound.playClick();
                      setSelectedTutorId(tutor.id);
                    }}
                    className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'bg-amber-500/10 border-amber-500 ring-1 ring-amber-500/50 shadow-md'
                        : 'bg-slate-900/80 hover:bg-slate-900 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <img
                          src={tutor.avatarUrl}
                          alt={tutor.name}
                          className="w-10 h-10 rounded-xl object-cover border border-white/10"
                        />
                        <span
                          className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full ring-2 ring-slate-950 ${
                            loc?.status === 'on_site'
                              ? 'bg-emerald-500'
                              : loc?.status === 'in_transit'
                              ? 'bg-amber-400 animate-pulse'
                              : 'bg-blue-500'
                          }`}
                        />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white leading-tight">
                          {tutor.name}
                        </h4>
                        <p className="text-[10px] text-slate-400 truncate max-w-[140px]">
                          {tutor.subjects[0]}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[9px] font-black uppercase ${
                          loc?.status === 'on_site'
                            ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                            : loc?.status === 'in_transit'
                            ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                            : 'bg-blue-500/15 text-blue-400 border border-blue-500/30'
                        }`}
                      >
                        {loc?.status === 'on_site'
                          ? 'On Campus'
                          : loc?.status === 'in_transit'
                          ? `ETA ${loc.etaMinutes || 6}m`
                          : 'In Session'}
                      </span>
                      <p className="text-[10px] font-mono text-slate-400 mt-0.5">
                        {loc?.distanceKm ? `${loc.distanceKm} km away` : '0.0 km (Inside)'}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Active Telemetry Detail Card */}
          {selectedTutor && selectedTutor.location && (
            <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2.5">
                  <img
                    src={selectedTutor.avatarUrl}
                    alt={selectedTutor.name}
                    className="w-10 h-10 rounded-xl object-cover border-2 border-amber-400/50"
                  />
                  <div>
                    <h3 className="text-sm font-black text-white">{selectedTutor.name}</h3>
                    <p className="text-[11px] text-amber-400 font-semibold">
                      {selectedTutor.subjects[0]}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => pingTutor(selectedTutor.id)}
                  className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1"
                  title="Send ping to check GPS coordinates"
                >
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  <span>Ping GPS</span>
                </button>
              </div>

              {/* Real-time Telemetry Metrics Grid */}
              <div className="grid grid-cols-2 gap-2.5">
                <div className="p-2.5 rounded-xl bg-slate-950 border border-white/5">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">
                    Current Zone
                  </span>
                  <span className="text-xs font-bold text-white truncate block mt-0.5">
                    {selectedTutor.location.locationName}
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-950 border border-white/5">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">
                    Geofence Radius
                  </span>
                  <span
                    className={`text-xs font-bold block mt-0.5 ${
                      selectedTutor.location.isWithinGeofence
                        ? 'text-emerald-400'
                        : 'text-amber-400'
                    }`}
                  >
                    {selectedTutor.location.isWithinGeofence
                      ? '✓ Inside (Verified)'
                      : `Approaching (${selectedTutor.location.distanceKm} km)`}
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-950 border border-white/5">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">
                    Arrival ETA
                  </span>
                  <span className="text-xs font-bold text-white block mt-0.5">
                    {selectedTutor.location.etaMinutes
                      ? `${selectedTutor.location.etaMinutes} minutes`
                      : 'On Site (Ready)'}
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-950 border border-white/5">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">
                    Device Battery & Signal
                  </span>
                  <span className="text-xs font-bold text-emerald-400 block mt-0.5">
                    {selectedTutor.location.batteryLevel || 85}% • GPS ±3m
                  </span>
                </div>
              </div>

              {/* Coordinates block */}
              <div className="p-2.5 rounded-xl bg-slate-950/80 border border-white/5 font-mono text-[10px] text-slate-400 flex items-center justify-between">
                <span>
                  LAT: {selectedTutor.location.lat.toFixed(4)}° / LNG:{' '}
                  {selectedTutor.location.lng.toFixed(4)}°
                </span>
                <span className="text-slate-500">
                  Ping: {selectedTutor.location.lastPingTime}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  onClick={() => pingTutor(selectedTutor.id)}
                  className="py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <MapPin className="w-3.5 h-3.5 text-amber-400" />
                  <span>Verify Location</span>
                </button>

                <button
                  onClick={() => setComposeUpdateModalOpen(true)}
                  className="py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-black text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Dispatch</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
