import React, { useState } from 'react';
import { MapPin, Navigation, ExternalLink, Compass } from 'lucide-react';
import { sound } from '../../utils/sound';

interface StudioMapProps {
  locationName: string;
  address: string;
  studioRoom: string;
  navigationUrl?: string;
  interactive?: boolean;
}

export const StudioMap: React.FC<StudioMapProps> = ({
  locationName,
  address,
  studioRoom,
  navigationUrl = 'https://maps.google.com/?q=742+Broadway+Ave+Downtown',
}) => {
  const handleOpenNav = () => {
    sound.playClick();
    window.open(navigationUrl, '_blank');
  };

  return (
    <div className="relative rounded-3xl overflow-hidden border border-white/[0.08] bg-[#0A0A0E] shadow-inner">
      {/* High-Contrast Stylized Dark Vector Map Canvas */}
      <div className="relative w-full h-48 sm:h-56 bg-[#08080C] overflow-hidden flex items-center justify-center">
        {/* Abstract Grid and Road lines */}
        <svg
          className="absolute inset-0 w-full h-full opacity-40"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern id="studio-grid-luxury" width="32" height="32" patternUnits="userSpaceOnUse">
              <path d="M 32 0 L 0 0 0 32" fill="none" stroke="#1F1F2A" strokeWidth="0.8" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#studio-grid-luxury)" />
          
          {/* Stylized Transit & Road Arteries */}
          <path d="M -20 90 Q 160 50 320 130 T 640 100" fill="none" stroke="#FACC15" strokeWidth="2" opacity="0.35" />
          <path d="M 140 -10 L 160 240" fill="none" stroke="#FFFFFF" strokeWidth="1.2" opacity="0.15" />
          <path d="M 300 -10 L 310 240" fill="none" stroke="#FFFFFF" strokeWidth="1" opacity="0.12" />
          <circle cx="230" cy="110" r="50" fill="none" stroke="#FACC15" strokeWidth="0.5" strokeDasharray="3 3" opacity="0.3" />
        </svg>

        {/* Studio Location Radar Pin */}
        <div className="relative z-10 flex flex-col items-center">
          {/* Pulse Ripple Rings */}
          <div className="absolute -top-1 w-12 h-12 rounded-full bg-[#FACC15]/20 animate-ping pointer-events-none" />
          
          <div className="w-10 h-10 rounded-2xl bg-[#FACC15] text-black flex items-center justify-center shadow-gold-glow font-black border-2 border-black">
            <MapPin className="w-5 h-5 fill-black text-black" />
          </div>
          
          <div className="mt-1.5 bg-[#08080C]/90 backdrop-blur-md px-3 py-0.5 rounded-full border border-[#FACC15]/40 text-[10px] font-bold text-[#FACC15] tracking-wider uppercase shadow-md">
            {studioRoom}
          </div>
        </div>

        {/* GPS HUD */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-black/80 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 text-[11px] text-gray-300">
          <Compass className="w-3.5 h-3.5 text-[#FACC15] animate-spin" style={{ animationDuration: '14s' }} />
          <span>GPS Geofence Verified</span>
        </div>

        {/* Distance Pill */}
        <div className="absolute bottom-3 left-3 bg-black/85 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 text-[11px] text-white flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#FACC15]" />
          <span><strong>0.8 mi</strong> • ~4 mins arrival</span>
        </div>
      </div>

      {/* Map Address & Direct Navigation Bar */}
      <div className="p-3.5 bg-[#101017] border-t border-white/[0.06] flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-bold text-white truncate">{locationName}</p>
          <p className="text-[11px] text-gray-400 truncate">{address}</p>
        </div>
        <button
          onClick={handleOpenNav}
          className="shrink-0 flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#FACC15] hover:bg-[#EAB308] text-black text-xs font-bold shadow-gold-glow-sm transition-all cursor-pointer"
        >
          <Navigation className="w-3.5 h-3.5 fill-black" />
          <span>Open Maps</span>
          <ExternalLink className="w-3 h-3 ml-0.5 opacity-60" />
        </button>
      </div>
    </div>
  );
};
