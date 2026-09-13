import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  MapPin,
  Navigation,
  Compass,
  Radio,
  Zap,
  Clock,
  Car,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Send,
  Building2,
  Users,
  GraduationCap,
  ExternalLink,
  LocateFixed,
  Sliders,
  X,
  Phone,
  Mail,
  ShieldCheck,
} from 'lucide-react';
import { sound } from '../../utils/sound';
import { PRESET_HALL_LOCATIONS } from '../../data/mockData';
import { DesignatedHallLocation } from '../../types';

export const TutorLocationMap: React.FC = () => {
  const {
    tutors,
    parents,
    designatedHall,
    updateDesignatedHall,
    simulateTutorMovement,
    pingTutor,
    pingParent,
    setComposeUpdateModalOpen,
  } = useApp();

  // Mode and filter state
  const [mapMode, setMapMode] = useState<'radar' | 'google_map' | 'campus'>('radar');
  const [entityFilter, setEntityFilter] = useState<'all' | 'tutors' | 'parents'>('all');
  const [selectedEntityId, setSelectedEntityId] = useState<string>(tutors[0]?.id || '');
  const [isDesignateModalOpen, setIsDesignateModalOpen] = useState<boolean>(false);

  // Form state for custom hall designation modal
  const [hallForm, setHallForm] = useState<{
    name: string;
    address: string;
    lat: number;
    lng: number;
    geofenceRadiusMeters: number;
    code: string;
    notes: string;
  }>({
    name: designatedHall.name,
    address: designatedHall.address,
    lat: designatedHall.lat,
    lng: designatedHall.lng,
    geofenceRadiusMeters: designatedHall.geofenceRadiusMeters,
    code: designatedHall.code || 'HALL-CUSTOM',
    notes: designatedHall.notes || '',
  });

  // Parents with live GPS location
  const parentsWithLocation = parents.filter((p) => p.location);

  // Combined tracking list
  type TrackedItem = {
    id: string;
    name: string;
    type: 'tutor' | 'parent';
    roleSubtitle: string;
    avatarUrl?: string;
    phone?: string;
    email?: string;
    location: NonNullable<typeof tutors[0]['location']>;
    childInfo?: string;
  };

  const allTrackedItems: TrackedItem[] = [
    ...tutors.map((t) => ({
      id: t.id,
      name: t.name,
      type: 'tutor' as const,
      roleSubtitle: `Faculty Tutor • ${t.subjects[0] || 'Academic'}`,
      avatarUrl: t.avatarUrl,
      phone: t.phone,
      email: t.email,
      location: t.location || {
        lat: designatedHall.lat,
        lng: designatedHall.lng,
        locationName: 'Designated Hall Pod Alpha',
        area: 'Main Wing',
        status: 'on_site' as const,
        etaMinutes: 0,
        distanceKm: 0.0,
        lastPingTime: 'Just now',
        batteryLevel: 90,
        speedKmH: 0,
        isWithinGeofence: true,
      },
    })),
    ...parentsWithLocation.map((p) => ({
      id: p.id,
      name: p.parentName,
      type: 'parent' as const,
      roleSubtitle: `Parent of ${p.children[0]?.studentName || 'Student'} (${p.children[0]?.grade || 'Cohort'})`,
      avatarUrl: p.avatarUrl,
      phone: p.phone,
      email: p.email,
      location: p.location!,
      childInfo: p.children.map((c) => c.studentName).join(', '),
    })),
  ];

  // Filtered items
  const filteredItems = allTrackedItems.filter((item) => {
    if (entityFilter === 'tutors') return item.type === 'tutor';
    if (entityFilter === 'parents') return item.type === 'parent';
    return true;
  });

  const selectedItem =
    allTrackedItems.find((i) => i.id === selectedEntityId) || allTrackedItems[0];

  // Quick stats
  const onSiteCount = allTrackedItems.filter((i) => i.location.status === 'on_site').length;
  const inTransitCount = allTrackedItems.filter((i) => i.location.status === 'in_transit').length;

  const handlePing = (item: TrackedItem) => {
    if (item.type === 'tutor') {
      pingTutor(item.id);
    } else {
      pingParent(item.id);
    }
  };

  const handleOpenDesignateModal = () => {
    sound.playClick();
    setHallForm({
      name: designatedHall.name,
      address: designatedHall.address,
      lat: designatedHall.lat,
      lng: designatedHall.lng,
      geofenceRadiusMeters: designatedHall.geofenceRadiusMeters,
      code: designatedHall.code || 'HALL-CUSTOM',
      notes: designatedHall.notes || '',
    });
    setIsDesignateModalOpen(true);
  };

  const handleSaveHallForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hallForm.name.trim() || !hallForm.address.trim()) return;

    updateDesignatedHall({
      name: hallForm.name.trim(),
      address: hallForm.address.trim(),
      lat: Number(hallForm.lat),
      lng: Number(hallForm.lng),
      geofenceRadiusMeters: Number(hallForm.geofenceRadiusMeters) || 200,
      code: hallForm.code.trim().toUpperCase(),
      notes: hallForm.notes.trim(),
    });
    setIsDesignateModalOpen(false);
  };

  const handleApplyPreset = (preset: DesignatedHallLocation) => {
    sound.playClick();
    setHallForm({
      name: preset.name,
      address: preset.address,
      lat: preset.lat,
      lng: preset.lng,
      geofenceRadiusMeters: preset.geofenceRadiusMeters,
      code: preset.code || 'HALL-PRESET',
      notes: preset.notes || '',
    });
  };

  const handleUseDeviceLocation = () => {
    if (navigator.geolocation) {
      sound.playClick();
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setHallForm((prev) => ({
            ...prev,
            lat: parseFloat(pos.coords.latitude.toFixed(4)),
            lng: parseFloat(pos.coords.longitude.toFixed(4)),
          }));
        },
        () => {
          sound.playAlert();
        }
      );
    }
  };

  // Google Maps external link
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${designatedHall.lat},${designatedHall.lng}`;
  const googleMapsEmbedSrc = `https://maps.google.com/maps?q=${designatedHall.lat},${designatedHall.lng}&hl=en&z=16&output=embed`;

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Banner: Designated Hall Control HUD */}
      <div className="bg-slate-900/95 dark:bg-[#10101C] p-4 sm:p-5 rounded-2xl border border-slate-800 dark:border-white/10 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-md bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                <span>Admin Live GPS Telemetry</span>
              </span>

              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                <span>Live Dual Radar: Tutors & Parents ({allTrackedItems.length})</span>
              </span>

              <span className="px-2 py-0.5 rounded-md bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[10px] font-mono font-bold">
                {designatedHall.code || 'HALL-ALPHA'}
              </span>
            </div>

            {/* Designated Hall Info */}
            <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-3">
              <h2 className="text-lg sm:text-2xl font-black text-white flex items-center gap-2">
                <Building2 className="w-5 h-5 text-amber-400 shrink-0" />
                <span>{designatedHall.name}</span>
              </h2>
              <span className="text-xs text-amber-300 font-mono bg-amber-950/60 px-2 py-0.5 rounded-md border border-amber-500/30">
                Geofence: {designatedHall.geofenceRadiusMeters}m radius
              </span>
            </div>

            <p className="text-xs text-slate-400 flex items-center gap-1.5 max-w-2xl">
              <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>{designatedHall.address}</span>
              <span className="text-slate-600 dark:text-slate-500 font-mono">
                ({designatedHall.lat.toFixed(4)}° N, {designatedHall.lng.toFixed(4)}° W)
              </span>
            </p>
          </div>

          {/* Action Buttons: Designate Hall & Open Google Maps */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={handleOpenDesignateModal}
              className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-black transition-all shadow-md shadow-amber-500/20 flex items-center gap-1.5 cursor-pointer"
              title="Designate or relocate the campus / exam hall location on Google Map"
            >
              <Building2 className="w-4 h-4" />
              <span>🏛️ Designate Hall Location</span>
            </button>

            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white border border-white/10 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
              title="Open designated hall coordinates directly in Google Maps"
            >
              <ExternalLink className="w-3.5 h-3.5 text-emerald-400" />
              <span>Open in Google Maps ↗</span>
            </a>

            <button
              onClick={simulateTutorMovement}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-white/10 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
              title="Simulate GPS movement for in-transit tutors and parents approaching the designated hall"
            >
              <RefreshCw className="w-3.5 h-3.5 text-amber-400" />
              <span>Simulate Movement</span>
            </button>
          </div>
        </div>

        {/* View Mode & Filter Controls Sub-bar */}
        <div className="mt-4 pt-3 border-t border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Map View Switcher */}
          <div className="flex items-center gap-1.5 bg-slate-950/80 p-1 rounded-xl border border-white/10">
            <button
              onClick={() => {
                sound.playClick();
                setMapMode('radar');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                mapMode === 'radar'
                  ? 'bg-amber-500 text-black shadow-xs font-black'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Radio className="w-3.5 h-3.5" />
              <span>GPS Radar</span>
            </button>

            <button
              onClick={() => {
                sound.playClick();
                setMapMode('google_map');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                mapMode === 'google_map'
                  ? 'bg-amber-500 text-black shadow-xs font-black'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <MapPin className="w-3.5 h-3.5 text-emerald-400" />
              <span>Google Map View</span>
            </button>

            <button
              onClick={() => {
                sound.playClick();
                setMapMode('campus');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                mapMode === 'campus'
                  ? 'bg-amber-500 text-black shadow-xs font-black'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Building2 className="w-3.5 h-3.5 text-blue-400" />
              <span>Campus Floorplan</span>
            </button>
          </div>

          {/* Telemetry Category Filter */}
          <div className="flex items-center gap-1 bg-slate-950/80 p-1 rounded-xl border border-white/10">
            <button
              onClick={() => {
                sound.playClick();
                setEntityFilter('all');
              }}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                entityFilter === 'all'
                  ? 'bg-white/20 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              All ({allTrackedItems.length})
            </button>

            <button
              onClick={() => {
                sound.playClick();
                setEntityFilter('tutors');
              }}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                entityFilter === 'tutors'
                  ? 'bg-amber-500/30 text-amber-300 border border-amber-500/50'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <GraduationCap className="w-3 h-3" />
              <span>Faculty Tutors ({tutors.length})</span>
            </button>

            <button
              onClick={() => {
                sound.playClick();
                setEntityFilter('parents');
              }}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                entityFilter === 'parents'
                  ? 'bg-purple-500/30 text-purple-300 border border-purple-500/50'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Users className="w-3 h-3" />
              <span>Parents & Guardians ({parentsWithLocation.length})</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Visual Map/Radar (8 cols) + Telemetry Roster & Detail (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Visual Display (Radar, Google Map, or Campus Layout) */}
        <div className="lg:col-span-7 xl:col-span-8 bg-slate-950 border border-slate-800 dark:border-white/10 rounded-3xl p-5 sm:p-6 relative overflow-hidden shadow-2xl flex flex-col justify-between min-h-[500px]">
          {/* Background grid lines */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f29370f_1px,transparent_1px),linear-gradient(to_bottom,#1f29370f_1px,transparent_1px)] bg-[size:28px_28px] pointer-events-none" />

          {/* Top Compass & Designated Hall Bar */}
          <div className="relative z-10 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400 border-b border-white/5 pb-3">
            <div className="flex items-center gap-2">
              <Compass className="w-4 h-4 text-amber-400 animate-spin-slow" />
              <span className="font-mono text-[11px] text-amber-300">
                DESIGNATED HALL: {designatedHall.lat.toFixed(4)}° N, {designatedHall.lng.toFixed(4)}° W
              </span>
            </div>
            <div className="flex items-center gap-2 font-mono text-[11px]">
              <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
                GEOFENCE: {designatedHall.geofenceRadiusMeters}M RADIUS
              </span>
            </div>
          </div>

          {/* VIEW MODE 1: GPS RADAR */}
          {mapMode === 'radar' && (
            <div className="relative my-auto py-8 flex items-center justify-center">
              {/* Concentric Radar Rings */}
              <div className="relative w-80 h-80 sm:w-[420px] sm:h-[420px] rounded-full border border-amber-500/20 flex items-center justify-center">
                {/* Outer Ring 1000m */}
                <div className="absolute inset-0 rounded-full border border-slate-800 border-dashed" />
                <span className="absolute top-1 text-[9px] font-mono text-slate-600 font-bold">
                  1000m Perimeter
                </span>

                {/* Middle Ring 500m */}
                <div className="w-56 h-56 sm:w-72 sm:h-72 rounded-full border border-slate-800 flex items-center justify-center relative">
                  <span className="absolute top-1 text-[9px] font-mono text-slate-600 font-bold">
                    500m Proximity
                  </span>

                  {/* Inner Geofence Ring */}
                  <div className="w-32 h-32 sm:w-44 sm:h-44 rounded-full border-2 border-emerald-500/40 bg-emerald-500/5 flex items-center justify-center relative shadow-[0_0_30px_rgba(16,185,129,0.12)]">
                    <span className="absolute -top-3.5 px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/30 text-[8px] font-black uppercase tracking-wider">
                      Hall Geofence ({designatedHall.geofenceRadiusMeters}m)
                    </span>

                    {/* Center Beacon: Designated Hall */}
                    <div className="relative flex flex-col items-center">
                      <div className="w-6 h-6 rounded-full bg-amber-400 ring-4 ring-amber-400/20 shadow-gold-glow flex items-center justify-center text-xs font-black text-black">
                        🏛️
                      </div>
                      <span className="absolute top-7 text-[9px] font-black text-amber-300 whitespace-nowrap bg-slate-950/90 px-2 py-0.5 rounded border border-amber-500/30">
                        {designatedHall.name}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Radar Crosshairs */}
                <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[1px] bg-slate-800/80 pointer-events-none" />
                <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-[1px] bg-slate-800/80 pointer-events-none" />

                {/* TUTORS PINS */}
                {(entityFilter === 'all' || entityFilter === 'tutors') && (
                  <>
                    {/* Tutor Pin 1: Shazz (On-Site in Pod Alpha) */}
                    <div
                      onClick={() => {
                        sound.playClick();
                        setSelectedEntityId('tutor-shazz');
                      }}
                      className={`absolute top-[46%] left-[44%] -translate-x-1/2 -translate-y-1/2 cursor-pointer group transition-all z-20 ${
                        selectedEntityId === 'tutor-shazz' ? 'scale-125 z-30' : 'hover:scale-110'
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
                        <p className="text-[10px] font-black text-white">Shazz (Tutor)</p>
                        <p className="text-[8px] font-bold text-emerald-400 uppercase">On-Site • Pod Alpha</p>
                      </div>
                    </div>

                    {/* Tutor Pin 2: Dr. Alex Mercer (In-Transit) */}
                    {tutors[1] && (
                      <div
                        onClick={() => {
                          sound.playClick();
                          setSelectedEntityId('tutor-alex');
                        }}
                        style={{
                          top: `${20 + (tutors[1].location?.distanceKm || 0.8) * 15}%`,
                          left: `${75 - (tutors[1].location?.distanceKm || 0.8) * 10}%`,
                        }}
                        className={`absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group transition-all duration-700 z-20 ${
                          selectedEntityId === 'tutor-alex' ? 'scale-125 z-30' : 'hover:scale-110'
                        }`}
                      >
                        {/* Route vector to Hall */}
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
                          <p className="text-[10px] font-black text-white">Dr. Alex (Tutor)</p>
                          <p className="text-[8px] font-bold text-amber-400 uppercase">
                            Transit • ETA {tutors[1].location?.etaMinutes || 6}m
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Tutor Pin 3: Priya Sundaram (Tech Lab) */}
                    {tutors[2] && (
                      <div
                        onClick={() => {
                          sound.playClick();
                          setSelectedEntityId('tutor-priya');
                        }}
                        className={`absolute top-[52%] left-[58%] -translate-x-1/2 -translate-y-1/2 cursor-pointer group transition-all z-20 ${
                          selectedEntityId === 'tutor-priya' ? 'scale-125 z-30' : 'hover:scale-110'
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
                          <p className="text-[10px] font-black text-white">Priya (Tutor)</p>
                          <p className="text-[8px] font-bold text-blue-400 uppercase">Lab Delta</p>
                        </div>
                      </div>
                    )}
                  </>
                )}

                {/* PARENTS PINS */}
                {(entityFilter === 'all' || entityFilter === 'parents') && (
                  <>
                    {/* Parent 1: Marcus Vance (On-Site at Entrance) */}
                    {parentsWithLocation.find((p) => p.id === 'parent-marcus') && (
                      <div
                        onClick={() => {
                          sound.playClick();
                          setSelectedEntityId('parent-marcus');
                        }}
                        className={`absolute top-[54%] left-[45%] -translate-x-1/2 -translate-y-1/2 cursor-pointer group transition-all z-20 ${
                          selectedEntityId === 'parent-marcus' ? 'scale-125 z-30' : 'hover:scale-110'
                        }`}
                      >
                        <div className="relative">
                          <div className="w-8 h-8 rounded-full border-2 border-purple-400 bg-slate-900 overflow-hidden shadow-lg shadow-purple-500/30">
                            <img
                              src={parentsWithLocation.find((p) => p.id === 'parent-marcus')?.avatarUrl}
                              alt="Marcus Vance"
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-purple-500 ring-2 ring-slate-950 animate-ping" />
                          <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-purple-500 ring-2 ring-slate-950" />
                        </div>
                        <div className="absolute top-9 left-1/2 -translate-x-1/2 bg-slate-900/95 border border-purple-500/40 px-2 py-0.5 rounded-md shadow-md text-center whitespace-nowrap pointer-events-none">
                          <p className="text-[10px] font-black text-purple-200">Marcus Vance</p>
                          <p className="text-[8px] font-bold text-purple-400 uppercase">
                            Parent (Aria) • Entrance
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Parent 2: Elena Lin (In-Transit ETA 4m) */}
                    {parentsWithLocation.find((p) => p.id === 'parent-elena') && (
                      <div
                        onClick={() => {
                          sound.playClick();
                          setSelectedEntityId('parent-elena');
                        }}
                        style={{
                          top: `${68 - (parentsWithLocation.find((p) => p.id === 'parent-elena')?.location?.distanceKm || 0.4) * 15}%`,
                          left: `${32 + (parentsWithLocation.find((p) => p.id === 'parent-elena')?.location?.distanceKm || 0.4) * 12}%`,
                        }}
                        className={`absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group transition-all duration-700 z-20 ${
                          selectedEntityId === 'parent-elena' ? 'scale-125 z-30' : 'hover:scale-110'
                        }`}
                      >
                        {/* Route Line to Hall */}
                        <svg className="absolute -top-10 -left-10 w-28 h-28 pointer-events-none -z-10 opacity-60">
                          <line
                            x1="50"
                            y1="50"
                            x2="10"
                            y2="10"
                            stroke="#C084FC"
                            strokeWidth="1.5"
                            strokeDasharray="4 3"
                          />
                        </svg>

                        <div className="relative">
                          <div className="w-8 h-8 rounded-full border-2 border-pink-400 bg-slate-900 overflow-hidden shadow-lg shadow-pink-500/30">
                            <img
                              src={parentsWithLocation.find((p) => p.id === 'parent-elena')?.avatarUrl}
                              alt="Elena Lin"
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-pink-400 ring-2 ring-slate-950 animate-ping" />
                          <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-pink-400 ring-2 ring-slate-950" />
                        </div>
                        <div className="absolute top-9 left-1/2 -translate-x-1/2 bg-slate-900/95 border border-pink-500/40 px-2 py-0.5 rounded-md shadow-md text-center whitespace-nowrap pointer-events-none">
                          <p className="text-[10px] font-black text-pink-200">Elena Lin</p>
                          <p className="text-[8px] font-bold text-pink-400 uppercase">
                            Parent (Maya) • ETA {parentsWithLocation.find((p) => p.id === 'parent-elena')?.location?.etaMinutes || 4}m
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Parent 3: David Chen (In-Transit ETA 8m) */}
                    {parentsWithLocation.find((p) => p.id === 'parent-david') && (
                      <div
                        onClick={() => {
                          sound.playClick();
                          setSelectedEntityId('parent-david');
                        }}
                        style={{
                          top: `${80 - (parentsWithLocation.find((p) => p.id === 'parent-david')?.location?.distanceKm || 0.9) * 8}%`,
                          left: `${68 - (parentsWithLocation.find((p) => p.id === 'parent-david')?.location?.distanceKm || 0.9) * 10}%`,
                        }}
                        className={`absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group transition-all duration-700 z-20 ${
                          selectedEntityId === 'parent-david' ? 'scale-125 z-30' : 'hover:scale-110'
                        }`}
                      >
                        <div className="relative">
                          <div className="w-8 h-8 rounded-full border-2 border-indigo-400 bg-slate-900 overflow-hidden shadow-lg shadow-indigo-500/30">
                            <img
                              src={parentsWithLocation.find((p) => p.id === 'parent-david')?.avatarUrl}
                              alt="David Chen"
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-indigo-400 ring-2 ring-slate-950 animate-ping" />
                          <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-indigo-400 ring-2 ring-slate-950" />
                        </div>
                        <div className="absolute top-9 left-1/2 -translate-x-1/2 bg-slate-900/95 border border-indigo-500/40 px-2 py-0.5 rounded-md shadow-md text-center whitespace-nowrap pointer-events-none">
                          <p className="text-[10px] font-black text-indigo-200">David Chen</p>
                          <p className="text-[8px] font-bold text-indigo-400 uppercase">
                            Parent (Leo) • ETA {parentsWithLocation.find((p) => p.id === 'parent-david')?.location?.etaMinutes || 8}m
                          </p>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          )}

          {/* VIEW MODE 2: GOOGLE MAP VIEW (Interactive Embedded Google Maps) */}
          {mapMode === 'google_map' && (
            <div className="relative my-4 flex-1 rounded-2xl overflow-hidden border border-white/10 min-h-[380px] bg-slate-900">
              <iframe
                title="Designated Hall Google Map"
                src={googleMapsEmbedSrc}
                className="w-full h-full min-h-[380px] border-0"
                loading="lazy"
                allowFullScreen
              />

              {/* Floating Google Map HUD Overlay */}
              <div className="absolute top-3 left-3 right-3 bg-slate-950/90 backdrop-blur-md p-3 rounded-xl border border-white/10 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center text-sm font-black">
                    🏛️
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-white">{designatedHall.name}</h4>
                    <p className="text-[10px] text-slate-300 truncate max-w-sm">
                      {designatedHall.address}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleOpenDesignateModal}
                    className="px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-black text-[11px] font-bold transition-all cursor-pointer"
                  >
                    Change Hall
                  </button>
                  <a
                    href={googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white text-[11px] font-bold transition-all flex items-center gap-1"
                  >
                    <span>Full Google Maps</span>
                    <ExternalLink className="w-3 h-3 text-emerald-400" />
                  </a>
                </div>
              </div>

              {/* Bottom Quick-Focus Chips on Google Map */}
              <div className="absolute bottom-3 left-3 right-3 flex items-center gap-2 overflow-x-auto pb-1">
                {filteredItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      sound.playClick();
                      setSelectedEntityId(item.id);
                    }}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold whitespace-nowrap backdrop-blur-md transition-all cursor-pointer flex items-center gap-1.5 ${
                      selectedEntityId === item.id
                        ? 'bg-amber-500 text-black shadow-md'
                        : 'bg-slate-950/80 text-white hover:bg-slate-900 border border-white/10'
                    }`}
                  >
                    <span
                      className={`w-2 h-2 rounded-full ${
                        item.location.status === 'on_site' ? 'bg-emerald-400' : 'bg-amber-400'
                      }`}
                    />
                    <span>{item.name}</span>
                    <span className="text-[9px] opacity-75">
                      ({item.location.status === 'on_site' ? 'Inside' : `${item.location.distanceKm}km`})
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* VIEW MODE 3: CAMPUS FLOORPLAN */}
          {mapMode === 'campus' && (
            <div className="relative my-4 flex-1 rounded-2xl overflow-hidden border border-white/10 min-h-[380px] bg-slate-900/60 p-4 space-y-3">
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-amber-400" />
                  <span className="text-xs font-bold text-white">
                    {designatedHall.name} Architectural Floorplan
                  </span>
                </div>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/20">
                  Active RFID & Geofence Sensor Network
                </span>
              </div>

              {/* Interactive Floorplan Rooms */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                {/* Pod Alpha */}
                <div
                  onClick={() => {
                    sound.playClick();
                    setSelectedEntityId('tutor-shazz');
                  }}
                  className={`p-3 rounded-xl border transition-all cursor-pointer ${
                    selectedEntityId === 'tutor-shazz'
                      ? 'bg-amber-500/15 border-amber-500'
                      : 'bg-slate-950/80 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-white">Pod Alpha</span>
                    <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 text-[9px] font-bold">
                      In Session
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 mb-2">Advanced Calculus & Linear Algebra</p>
                  <div className="flex items-center gap-2 bg-slate-900 p-1.5 rounded-lg">
                    <img
                      src={tutors[0]?.avatarUrl}
                      alt="Shazz"
                      className="w-5 h-5 rounded-full object-cover"
                    />
                    <span className="text-[10px] font-bold text-white">Shazz (Tutor)</span>
                  </div>
                </div>

                {/* Lab Delta */}
                <div
                  onClick={() => {
                    sound.playClick();
                    setSelectedEntityId('tutor-priya');
                  }}
                  className={`p-3 rounded-xl border transition-all cursor-pointer ${
                    selectedEntityId === 'tutor-priya'
                      ? 'bg-amber-500/15 border-amber-500'
                      : 'bg-slate-950/80 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-white">Lab Delta</span>
                    <span className="px-1.5 py-0.2 rounded bg-blue-500/20 text-blue-400 text-[9px] font-bold">
                      Prep Lab
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 mb-2">Robotics & Experimental Physics</p>
                  <div className="flex items-center gap-2 bg-slate-900 p-1.5 rounded-lg">
                    <img
                      src={tutors[2]?.avatarUrl}
                      alt="Priya"
                      className="w-5 h-5 rounded-full object-cover"
                    />
                    <span className="text-[10px] font-bold text-white">Priya (Tutor)</span>
                  </div>
                </div>

                {/* Reception & Parent Waiting Lounge */}
                <div
                  onClick={() => {
                    sound.playClick();
                    setSelectedEntityId('parent-marcus');
                  }}
                  className={`p-3 rounded-xl border transition-all cursor-pointer ${
                    selectedEntityId === 'parent-marcus'
                      ? 'bg-purple-500/15 border-purple-500'
                      : 'bg-slate-950/80 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-white">Parent Lounge & Entrance</span>
                    <span className="px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-400 text-[9px] font-bold">
                      Visitor Area
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 mb-2">Parent Reception & Check-in Desk</p>
                  <div className="flex items-center gap-2 bg-slate-900 p-1.5 rounded-lg">
                    <img
                      src={parentsWithLocation.find((p) => p.id === 'parent-marcus')?.avatarUrl}
                      alt="Marcus"
                      className="w-5 h-5 rounded-full object-cover"
                    />
                    <span className="text-[10px] font-bold text-purple-200">Marcus Vance (Parent)</span>
                  </div>
                </div>
              </div>

              {/* Approaching Vehicles Corridor */}
              <div className="bg-slate-950/80 p-3 rounded-xl border border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Car className="w-4 h-4 text-amber-400 animate-pulse" />
                  <span className="text-xs font-bold text-white">
                    Approaching Transit Gate (2 In-Transit: Dr. Alex Mercer, Elena Lin)
                  </span>
                </div>
                <span className="text-[10px] text-amber-300 font-mono">
                  Gate 3 Automated Barrier Standby
                </span>
              </div>
            </div>
          )}

          {/* Bottom Live Status Ticker */}
          <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-white/5 text-xs text-slate-400">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span className="text-white font-bold">On-Site ({onSiteCount})</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
                <span className="text-white font-bold">In-Transit ({inTransitCount})</span>
              </span>
            </div>
            <span className="text-[11px] font-mono text-slate-500">
              Synced with {designatedHall.name} ({designatedHall.code || 'HALL-A'})
            </span>
          </div>
        </div>

        {/* Right Column: Telemetry Roster & Selected Profile Card (4 cols) */}
        <div className="lg:col-span-5 xl:col-span-4 space-y-4">
          {/* Quick Selection List */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Live Tracked ({filteredItems.length})
              </label>
              <span className="text-[11px] text-slate-500">Click to inspect</span>
            </div>

            <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
              {filteredItems.map((item) => {
                const isSelected = item.id === selectedEntityId;
                const loc = item.location;
                const isTutor = item.type === 'tutor';

                return (
                  <div
                    key={item.id}
                    onClick={() => {
                      sound.playClick();
                      setSelectedEntityId(item.id);
                    }}
                    className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? isTutor
                          ? 'bg-amber-500/10 border-amber-500 ring-1 ring-amber-500/50 shadow-md'
                          : 'bg-purple-500/10 border-purple-500 ring-1 ring-purple-500/50 shadow-md'
                        : 'bg-slate-900/80 hover:bg-slate-900 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <img
                          src={item.avatarUrl}
                          alt={item.name}
                          className="w-10 h-10 rounded-xl object-cover border border-white/10"
                        />
                        <span
                          className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full ring-2 ring-slate-950 ${
                            loc.status === 'on_site'
                              ? 'bg-emerald-500'
                              : 'bg-amber-400 animate-pulse'
                          }`}
                        />
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h4 className="text-xs font-bold text-white leading-tight">
                            {item.name}
                          </h4>
                          <span
                            className={`px-1.5 py-0.2 rounded text-[8px] font-black uppercase ${
                              isTutor
                                ? 'bg-amber-500/20 text-amber-300'
                                : 'bg-purple-500/20 text-purple-300'
                            }`}
                          >
                            {isTutor ? 'Tutor' : 'Parent'}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-400 truncate max-w-[150px]">
                          {item.roleSubtitle}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[9px] font-black uppercase ${
                          loc.status === 'on_site'
                            ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                            : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                        }`}
                      >
                        {loc.status === 'on_site' ? 'On-Site' : `ETA ${loc.etaMinutes || 4}m`}
                      </span>
                      <p className="text-[10px] font-mono text-slate-400 mt-0.5">
                        {loc.distanceKm ? `${loc.distanceKm} km` : 'At Hall'}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Active Telemetry Detail Card */}
          {selectedItem && (
            <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2.5">
                  <img
                    src={selectedItem.avatarUrl}
                    alt={selectedItem.name}
                    className={`w-11 h-11 rounded-xl object-cover border-2 ${
                      selectedItem.type === 'tutor'
                        ? 'border-amber-400/60'
                        : 'border-purple-400/60'
                    }`}
                  />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h3 className="text-sm font-black text-white">{selectedItem.name}</h3>
                      <span
                        className={`px-1.5 py-0.2 rounded text-[9px] font-black uppercase ${
                          selectedItem.type === 'tutor'
                            ? 'bg-amber-500/20 text-amber-300'
                            : 'bg-purple-500/20 text-purple-300'
                        }`}
                      >
                        {selectedItem.type === 'tutor' ? 'Faculty Tutor' : 'Parent Account'}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-300 font-medium">
                      {selectedItem.roleSubtitle}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => handlePing(selectedItem)}
                  className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1"
                  title="Send ping to verify live GPS telemetry"
                >
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  <span>Ping GPS</span>
                </button>
              </div>

              {/* Telemetry Metrics 2x2 Grid */}
              <div className="grid grid-cols-2 gap-2.5">
                <div className="p-2.5 rounded-xl bg-slate-950 border border-white/5">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">
                    Current Zone
                  </span>
                  <span className="text-xs font-bold text-white truncate block mt-0.5">
                    {selectedItem.location.locationName}
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-950 border border-white/5">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">
                    Hall Geofence
                  </span>
                  <span
                    className={`text-xs font-bold block mt-0.5 ${
                      selectedItem.location.isWithinGeofence
                        ? 'text-emerald-400'
                        : 'text-amber-400'
                    }`}
                  >
                    {selectedItem.location.isWithinGeofence
                      ? '✓ Inside Perimeter'
                      : `En Route (${selectedItem.location.distanceKm} km)`}
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-950 border border-white/5">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">
                    Arrival ETA
                  </span>
                  <span className="text-xs font-bold text-white block mt-0.5">
                    {selectedItem.location.etaMinutes
                      ? `${selectedItem.location.etaMinutes} minutes`
                      : 'At Hall Venue'}
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-950 border border-white/5">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">
                    Device Battery & Signal
                  </span>
                  <span className="text-xs font-bold text-emerald-400 block mt-0.5">
                    {selectedItem.location.batteryLevel || 85}% • GPS ±3m
                  </span>
                </div>
              </div>

              {/* Coordinates block & Target Hall Bearing */}
              <div className="p-2.5 rounded-xl bg-slate-950/80 border border-white/5 font-mono text-[10px] text-slate-400 space-y-1">
                <div className="flex items-center justify-between">
                  <span>
                    LAT: {selectedItem.location.lat.toFixed(4)}° / LNG:{' '}
                    {selectedItem.location.lng.toFixed(4)}°
                  </span>
                  <span className="text-slate-500">Ping: {selectedItem.location.lastPingTime}</span>
                </div>
                <div className="text-[9px] text-amber-400/80">
                  Target Destination: {designatedHall.name} ({designatedHall.geofenceRadiusMeters}m geofence)
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${designatedHall.lat},${designatedHall.lng}&origin=${selectedItem.location.lat},${selectedItem.location.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Navigation className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Google Route</span>
                </a>

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

      {/* DESIGNATE HALL MODAL (Preset selection + Custom Google Maps coordinates) */}
      {isDesignateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 max-w-2xl w-full shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center text-lg">
                  🏛️
                </div>
                <div>
                  <h3 className="text-base font-black text-white">
                    Designate Campus / Hall Location in Google Map
                  </h3>
                  <p className="text-xs text-slate-400">
                    Set the target academic hall, auditorium, or exam center. Live radar & Google Maps center on this location.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsDesignateModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white flex items-center justify-center transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Presets Grid */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <span>Preset Academic Venues</span>
                <span className="text-[10px] text-slate-400 font-normal">(Click to apply)</span>
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {PRESET_HALL_LOCATIONS.map((preset) => {
                  const isCurrent = hallForm.name === preset.name;
                  return (
                    <div
                      key={preset.id}
                      onClick={() => handleApplyPreset(preset)}
                      className={`p-3 rounded-xl border transition-all cursor-pointer text-left ${
                        isCurrent
                          ? 'bg-amber-500/15 border-amber-500 ring-1 ring-amber-500/40'
                          : 'bg-slate-950/70 border-white/5 hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white leading-tight">
                          {preset.name}
                        </span>
                        <span className="text-[9px] font-mono text-amber-400">
                          {preset.code}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-400 truncate mt-1">
                        {preset.address}
                      </p>
                      <div className="flex items-center justify-between mt-2 pt-1 border-t border-white/5 text-[9px] font-mono text-slate-500">
                        <span>Radius: {preset.geofenceRadiusMeters}m</span>
                        <span className="text-emerald-400 font-bold">Select Preset →</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Custom Location Form */}
            <form onSubmit={handleSaveHallForm} className="space-y-4 pt-2 border-t border-white/10">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-white uppercase tracking-wider">
                  Venue Coordinates & Geofence Details
                </label>
                <button
                  type="button"
                  onClick={handleUseDeviceLocation}
                  className="text-[11px] text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <LocateFixed className="w-3.5 h-3.5" />
                  <span>Use My GPS</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-400 block mb-1">
                    Hall / Building Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={hallForm.name}
                    onChange={(e) => setHallForm({ ...hallForm, name: e.target.value })}
                    placeholder="e.g. RYD Central Academic Hall A"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-400 block mb-1">
                    Building / Hall Code
                  </label>
                  <input
                    type="text"
                    value={hallForm.code}
                    onChange={(e) => setHallForm({ ...hallForm, code: e.target.value.toUpperCase() })}
                    placeholder="e.g. HALL-ALPHA"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white font-mono focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-400 block mb-1">
                  Full Campus / Street Address *
                </label>
                <input
                  type="text"
                  required
                  value={hallForm.address}
                  onChange={(e) => setHallForm({ ...hallForm, address: e.target.value })}
                  placeholder="e.g. 124 Academic Way, Tech Corridor, NY 10001"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-400 block mb-1">
                    Latitude (Google Map) *
                  </label>
                  <input
                    type="number"
                    step="0.0001"
                    required
                    value={hallForm.lat}
                    onChange={(e) => setHallForm({ ...hallForm, lat: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white font-mono focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-400 block mb-1">
                    Longitude (Google Map) *
                  </label>
                  <input
                    type="number"
                    step="0.0001"
                    required
                    value={hallForm.lng}
                    onChange={(e) => setHallForm({ ...hallForm, lng: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white font-mono focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-400 block mb-1">
                    Geofence Radius (Meters)
                  </label>
                  <input
                    type="number"
                    min="50"
                    max="1000"
                    step="25"
                    value={hallForm.geofenceRadiusMeters}
                    onChange={(e) =>
                      setHallForm({
                        ...hallForm,
                        geofenceRadiusMeters: parseInt(e.target.value) || 200,
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white font-mono focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-400 block mb-1">
                  Access & Venue Instructions (Optional)
                </label>
                <input
                  type="text"
                  value={hallForm.notes}
                  onChange={(e) => setHallForm({ ...hallForm, notes: e.target.value })}
                  placeholder="e.g. Main academic lecture hall, admissions reception and faculty check-in station."
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsDesignateModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-bold transition-all cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-black transition-all shadow-md shadow-amber-500/20 flex items-center gap-1.5 cursor-pointer"
                >
                  <Building2 className="w-4 h-4" />
                  <span>Designate Hall Location</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
