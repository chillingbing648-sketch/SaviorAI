import React from 'react';
import { DosageForm } from '../../data/medications';

interface MedicationVisualProps {
  form: DosageForm;
  name: string;
  accentColor?: string;
  className?: string;
}

export const MedicationVisual: React.FC<MedicationVisualProps> = ({
  form,
  name,
  accentColor = '#0d7a5f',
  className = 'w-full h-40'
}) => {
  switch (form) {
    case 'ointment':
      return (
        <div className={`relative flex items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-amber-500/10 via-emerald-500/5 to-teal-500/10 dark:from-amber-950/30 dark:to-teal-950/20 p-4 border border-amber-200/50 dark:border-amber-800/30 ${className}`}>
          {/* Subtle background glow */}
          <div className="absolute inset-0 bg-radial from-amber-400/15 via-transparent to-transparent pointer-events-none" />
          <svg viewBox="0 0 200 130" className="w-full h-full max-h-36 drop-shadow-md select-none" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="tubeBodyGrad" x1="20" y1="20" x2="160" y2="100" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="40%" stopColor="#e2ede8" />
                <stop offset="100%" stopColor="#b6d5c9" />
              </linearGradient>
              <linearGradient id="capGrad" x1="150" y1="30" x2="185" y2="70" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#0d7a5f" />
                <stop offset="100%" stopColor="#064032" />
              </linearGradient>
              <linearGradient id="balmDropGrad" x1="165" y1="75" x2="175" y2="95" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#fef08a" />
                <stop offset="100%" stopColor="#f59e0b" />
              </linearGradient>
              <filter id="shadowFilter" x="-10%" y="-10%" width="120%" height="130%">
                <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#081a14" floodOpacity="0.15" />
              </filter>
            </defs>

            {/* Tube Shadow */}
            <ellipse cx="100" cy="112" rx="75" ry="8" fill="#081a14" fillOpacity="0.12" />

            {/* Tube Body */}
            <path
              d="M 25 35 L 140 46 C 145 46 148 49 148 53 L 148 77 C 148 81 145 84 140 84 L 25 95 C 22 95 20 92 20 89 L 20 41 C 20 38 22 35 25 35 Z"
              fill="url(#tubeBodyGrad)"
              stroke="#6c837c"
              strokeWidth="2"
              filter="url(#shadowFilter)"
            />

            {/* Crimped Back of Tube */}
            <rect x="18" y="34" width="7" height="62" rx="2" fill="#8eada3" stroke="#4e665f" strokeWidth="1.5" />
            <line x1="21" y1="38" x2="21" y2="92" stroke="#ffffff" strokeWidth="1" strokeDasharray="3 2" />

            {/* Clinical Color Accent Strip on Tube */}
            <path d="M 40 40 L 60 41.5 L 60 88.5 L 40 90 Z" fill="#0d7a5f" />
            <rect x="70" y="52" width="55" height="4" rx="2" fill="#0d7a5f" fillOpacity="0.85" />
            <rect x="70" y="60" width="38" height="3" rx="1.5" fill="#6c837c" fillOpacity="0.7" />
            <rect x="70" y="67" width="46" height="3" rx="1.5" fill="#6c837c" fillOpacity="0.5" />

            {/* Medical Cross Signet on Tube */}
            <circle cx="50" cy="65" r="7" fill="#ffffff" />
            <path d="M 50 61 L 50 69 M 46 65 L 54 65" stroke="#0d7a5f" strokeWidth="2.2" strokeLinecap="round" />

            {/* Tube Neck & Screw Cap */}
            <rect x="148" y="55" width="8" height="20" rx="1" fill="#cbd5e1" stroke="#64748b" strokeWidth="1.5" />
            <path
              d="M 156 50 L 175 46 C 178 45 180 47 180 50 L 180 80 C 180 83 178 85 175 84 L 156 80 Z"
              fill="url(#capGrad)"
              stroke="#04261e"
              strokeWidth="2"
            />
            {/* Grip Ridges on Cap */}
            <line x1="162" y1="50" x2="162" y2="80" stroke="#00BE88" strokeWidth="1.2" strokeOpacity="0.7" />
            <line x1="168" y1="48" x2="168" y2="82" stroke="#00BE88" strokeWidth="1.2" strokeOpacity="0.7" />
            <line x1="174" y1="47" x2="174" y2="83" stroke="#00BE88" strokeWidth="1.2" strokeOpacity="0.7" />

            {/* Extruded Balm Droplet */}
            <path
              d="M 180 65 C 188 64 194 67 194 72 C 194 77 188 80 180 75 Z"
              fill="url(#balmDropGrad)"
              stroke="#d97706"
              strokeWidth="1.5"
            />
          </svg>
          <div className="absolute top-2.5 right-3 text-[10px] font-black uppercase tracking-wider text-amber-700 dark:text-amber-300 bg-amber-100/90 dark:bg-amber-950/80 px-2 py-0.5 rounded-md border border-amber-300/60 dark:border-amber-700/60 shadow-xs">
            Topical Ointment
          </div>
        </div>
      );

    case 'tablet':
      return (
        <div className={`relative flex items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-teal-500/10 via-sky-500/5 to-emerald-500/10 dark:from-teal-950/30 dark:to-sky-950/20 p-4 border border-teal-200/50 dark:border-teal-800/30 ${className}`}>
          <div className="absolute inset-0 bg-radial from-teal-400/15 via-transparent to-transparent pointer-events-none" />
          <svg viewBox="0 0 200 130" className="w-full h-full max-h-36 drop-shadow-md select-none" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="pillLeft" x1="45" y1="40" x2="100" y2="95" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#0d7a5f" />
                <stop offset="100%" stopColor="#084e3c" />
              </linearGradient>
              <linearGradient id="pillRight" x1="100" y1="40" x2="155" y2="95" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="100%" stopColor="#e2ede8" />
              </linearGradient>
              <linearGradient id="roundTabletGrad" x1="40" y1="70" x2="90" y2="120" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="100%" stopColor="#d1ded9" />
              </linearGradient>
            </defs>

            {/* Pill Shadow */}
            <ellipse cx="110" cy="108" rx="60" ry="9" fill="#081a14" fillOpacity="0.14" />
            <ellipse cx="55" cy="105" rx="25" ry="5" fill="#081a14" fillOpacity="0.1" />

            {/* Background Round Tablet */}
            <circle cx="55" cy="85" r="24" fill="url(#roundTabletGrad)" stroke="#8eada3" strokeWidth="2" />
            <line x1="37" y1="85" x2="73" y2="85" stroke="#6c837c" strokeWidth="1.5" strokeDasharray="3 2" />
            <circle cx="55" cy="85" r="23" stroke="#ffffff" strokeWidth="1" strokeOpacity="0.8" />

            {/* Main Clinical Capsule (Angled 25deg) */}
            <g transform="rotate(-18 105 65)">
              {/* Left Half (Active Deep Clinical Emerald) */}
              <path
                d="M 65 45 C 50 45 40 55 40 70 C 40 85 50 95 65 95 L 105 95 L 105 45 Z"
                fill="url(#pillLeft)"
                stroke="#04261e"
                strokeWidth="2.2"
              />
              {/* Highlight Glare on Left Half */}
              <path
                d="M 52 54 C 58 48 70 48 85 48"
                stroke="#ffffff"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeOpacity="0.5"
              />

              {/* Right Half (Clinical Crisp White) */}
              <path
                d="M 105 45 L 145 45 C 160 45 170 55 170 70 C 170 85 160 95 145 95 L 105 95 Z"
                fill="url(#pillRight)"
                stroke="#6c837c"
                strokeWidth="2.2"
              />
              {/* Embossed Medical Plus Cross on White Half */}
              <path
                d="M 137 63 L 137 77 M 130 70 L 144 70"
                stroke="#0d7a5f"
                strokeWidth="3"
                strokeLinecap="round"
              />

              {/* Center Interlocking Seam */}
              <line x1="105" y1="44" x2="105" y2="96" stroke="#04261e" strokeWidth="2.5" />
            </g>
          </svg>
          <div className="absolute top-2.5 right-3 text-[10px] font-black uppercase tracking-wider text-teal-700 dark:text-teal-300 bg-teal-100/90 dark:bg-teal-950/80 px-2 py-0.5 rounded-md border border-teal-300/60 dark:border-teal-700/60 shadow-xs">
            Oral Tablet / Capsule
          </div>
        </div>
      );

    case 'solution':
      return (
        <div className={`relative flex items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-rose-500/10 dark:from-amber-950/30 dark:to-orange-950/20 p-4 border border-amber-200/50 dark:border-amber-800/30 ${className}`}>
          <div className="absolute inset-0 bg-radial from-amber-400/15 via-transparent to-transparent pointer-events-none" />
          <svg viewBox="0 0 200 130" className="w-full h-full max-h-36 drop-shadow-md select-none" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="amberBottleGrad" x1="70" y1="40" x2="130" y2="110" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#b45309" />
                <stop offset="60%" stopColor="#78350f" />
                <stop offset="100%" stopColor="#451a03" />
              </linearGradient>
              <linearGradient id="liquidLevelGrad" x1="75" y1="65" x2="125" y2="105" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#b45309" stopOpacity="0.95" />
              </linearGradient>
              <linearGradient id="dropGrad" x1="150" y1="60" x2="160" y2="80" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#d97706" />
                <stop offset="100%" stopColor="#92400e" />
              </linearGradient>
            </defs>

            {/* Bottle Shadow */}
            <ellipse cx="100" cy="114" rx="42" ry="7" fill="#081a14" fillOpacity="0.15" />
            <ellipse cx="155" cy="110" rx="14" ry="4" fill="#081a14" fillOpacity="0.12" />

            {/* Dropper Rubber Bulb */}
            <path
              d="M 90 24 C 90 16 95 12 100 12 C 105 12 110 16 110 24 L 110 28 L 90 28 Z"
              fill="#1e293b"
              stroke="#0f172a"
              strokeWidth="1.5"
            />
            {/* Screw Ring Cap */}
            <rect x="86" y="28" width="28" height="10" rx="2" fill="#e2e8f0" stroke="#64748b" strokeWidth="1.5" />
            <line x1="92" y1="30" x2="92" y2="36" stroke="#94a3b8" strokeWidth="1" />
            <line x1="100" y1="30" x2="100" y2="36" stroke="#94a3b8" strokeWidth="1" />
            <line x1="108" y1="30" x2="108" y2="36" stroke="#94a3b8" strokeWidth="1" />

            {/* Bottle Shoulders & Main Body */}
            <path
              d="M 91 38 L 82 46 C 76 52 74 58 74 65 L 74 104 C 74 109 78 112 84 112 L 116 112 C 122 112 126 109 126 104 L 126 65 C 126 58 124 52 118 46 L 109 38 Z"
              fill="url(#amberBottleGrad)"
              stroke="#451a03"
              strokeWidth="2"
            />

            {/* Liquid Fill Level */}
            <path
              d="M 76 70 C 85 68 115 72 124 70 L 124 104 C 124 108 121 110 116 110 L 84 110 C 79 110 76 108 76 104 Z"
              fill="url(#liquidLevelGrad)"
            />

            {/* Clinical Medicine Label */}
            <rect x="80" y="72" width="40" height="30" rx="2" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1" />
            <rect x="84" y="76" width="32" height="4" rx="1" fill="#b45309" />
            <line x1="84" y1="84" x2="114" y2="84" stroke="#64748b" strokeWidth="1.5" />
            <line x1="84" y1="90" x2="108" y2="90" stroke="#94a3b8" strokeWidth="1.2" />
            <line x1="84" y1="96" x2="102" y2="96" stroke="#94a3b8" strokeWidth="1.2" />

            {/* Glass Dropper Pipette on the side with suspended liquid drop */}
            <g transform="translate(145, 30)">
              <rect x="8" y="2" width="6" height="40" rx="1.5" fill="#f8fafc" fillOpacity="0.85" stroke="#94a3b8" strokeWidth="1.2" />
              <path d="M 8 42 L 10 52 L 12 52 L 14 42 Z" fill="#f8fafc" stroke="#94a3b8" strokeWidth="1" />
              <rect x="9.5" y="16" width="3" height="32" fill="#b45309" fillOpacity="0.8" />
              {/* Suspended Precision Droplet */}
              <path
                d="M 11 56 C 11 56 6 63 6 67 C 6 70 8.5 73 11 73 C 13.5 73 16 70 16 67 C 16 63 11 56 11 56 Z"
                fill="url(#dropGrad)"
                stroke="#78350f"
                strokeWidth="1.2"
              />
            </g>
          </svg>
          <div className="absolute top-2.5 right-3 text-[10px] font-black uppercase tracking-wider text-amber-800 dark:text-amber-200 bg-amber-100/90 dark:bg-amber-950/80 px-2 py-0.5 rounded-md border border-amber-300/60 dark:border-amber-700/60 shadow-xs">
            Antiseptic Solution
          </div>
        </div>
      );

    case 'sachet':
      return (
        <div className={`relative flex items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-sky-500/10 via-blue-500/5 to-cyan-500/10 dark:from-sky-950/30 dark:to-cyan-950/20 p-4 border border-sky-200/50 dark:border-sky-800/30 ${className}`}>
          <div className="absolute inset-0 bg-radial from-sky-400/15 via-transparent to-transparent pointer-events-none" />
          <svg viewBox="0 0 200 130" className="w-full h-full max-h-36 drop-shadow-md select-none" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="sachetFoilGrad" x1="40" y1="20" x2="160" y2="110" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="45%" stopColor="#e0f2fe" />
                <stop offset="100%" stopColor="#bae6fd" />
              </linearGradient>
            </defs>

            {/* Sachet Shadow */}
            <ellipse cx="100" cy="115" rx="55" ry="8" fill="#081a14" fillOpacity="0.14" />

            {/* Foil Sachet Body */}
            <path
              d="M 52 24 L 148 24 C 151 24 153 26 153 29 L 148 107 C 148 110 146 112 143 112 L 57 112 C 54 112 52 110 52 107 L 47 29 C 47 26 49 24 52 24 Z"
              fill="url(#sachetFoilGrad)"
              stroke="#0284c7"
              strokeWidth="2"
            />

            {/* Crimped Sealed Top & Bottom Edges */}
            <rect x="47" y="24" width="106" height="8" fill="#7dd3fc" stroke="#0284c7" strokeWidth="1" />
            <line x1="50" y1="28" x2="150" y2="28" stroke="#0369a1" strokeWidth="1" strokeDasharray="3 2" />

            <rect x="52" y="104" width="96" height="8" fill="#7dd3fc" stroke="#0284c7" strokeWidth="1" />
            <line x1="55" y1="108" x2="145" y2="108" stroke="#0369a1" strokeWidth="1" strokeDasharray="3 2" />

            {/* Notch Tear Indicator */}
            <path d="M 47 38 L 53 41 L 47 44 Z" fill="#0284c7" />

            {/* Sachet Branding & Electrolyte Content */}
            <rect x="60" y="40" width="80" height="22" rx="3" fill="#0284c7" />
            <text x="100" y="55" textAnchor="middle" fill="#ffffff" fontSize="11" fontWeight="900" fontFamily="sans-serif">
              WHO • ORS
            </text>

            <rect x="62" y="68" width="76" height="3" rx="1.5" fill="#0369a1" fillOpacity="0.6" />
            <rect x="62" y="74" width="56" height="2.5" rx="1" fill="#64748b" fillOpacity="0.5" />
            <rect x="62" y="79" width="68" height="2.5" rx="1" fill="#64748b" fillOpacity="0.5" />

            {/* Ion Formula Badges */}
            <g transform="translate(62, 86)">
              <rect x="0" y="0" width="22" height="12" rx="2" fill="#dbeafe" stroke="#93c5fd" strokeWidth="0.8" />
              <text x="11" y="9" textAnchor="middle" fill="#1e40af" fontSize="7.5" fontWeight="800" fontFamily="sans-serif">Na⁺</text>
              <rect x="26" y="0" width="22" height="12" rx="2" fill="#dbeafe" stroke="#93c5fd" strokeWidth="0.8" />
              <text x="37" y="9" textAnchor="middle" fill="#1e40af" fontSize="7.5" fontWeight="800" fontFamily="sans-serif">K⁺</text>
              <rect x="52" y="0" width="24" height="12" rx="2" fill="#dbeafe" stroke="#93c5fd" strokeWidth="0.8" />
              <text x="64" y="9" textAnchor="middle" fill="#1e40af" fontSize="7.5" fontWeight="800" fontFamily="sans-serif">H₂O</text>
            </g>
          </svg>
          <div className="absolute top-2.5 right-3 text-[10px] font-black uppercase tracking-wider text-sky-800 dark:text-sky-200 bg-sky-100/90 dark:bg-sky-950/80 px-2 py-0.5 rounded-md border border-sky-300/60 dark:border-sky-700/60 shadow-xs">
            Electrolyte Sachet
          </div>
        </div>
      );

    case 'drops':
      return (
        <div className={`relative flex items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-cyan-500/10 via-sky-500/5 to-blue-500/10 dark:from-cyan-950/30 dark:to-blue-950/20 p-4 border border-cyan-200/50 dark:border-cyan-800/30 ${className}`}>
          <div className="absolute inset-0 bg-radial from-cyan-400/15 via-transparent to-transparent pointer-events-none" />
          <svg viewBox="0 0 200 130" className="w-full h-full max-h-36 drop-shadow-md select-none" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="eyeBottleGrad" x1="80" y1="40" x2="120" y2="105" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="60%" stopColor="#e0f2fe" />
                <stop offset="100%" stopColor="#bae6fd" />
              </linearGradient>
              <linearGradient id="eyeDropGrad" x1="100" y1="110" x2="100" y2="125" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#38bdf8" />
                <stop offset="100%" stopColor="#0284c7" />
              </linearGradient>
            </defs>

            {/* Dropper Bottle Shadow */}
            <ellipse cx="100" cy="112" rx="35" ry="6" fill="#081a14" fillOpacity="0.14" />

            {/* Eyedrop Cap with Tamper Ring */}
            <path d="M 94 20 L 106 20 L 108 42 L 92 42 Z" fill="#0284c7" stroke="#0369a1" strokeWidth="1.5" />
            <rect x="89" y="42" width="22" height="6" rx="1.5" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="1" />

            {/* Plastic Squeezable Flacon Body */}
            <path
              d="M 92 48 L 84 56 C 80 62 78 70 78 78 L 78 98 C 78 104 82 108 88 108 L 112 108 C 118 108 122 104 122 98 L 122 78 C 122 70 120 62 116 56 L 108 48 Z"
              fill="url(#eyeBottleGrad)"
              stroke="#0284c7"
              strokeWidth="2"
            />

            {/* Medical Ophthalmic Icon on Bottle */}
            <circle cx="100" cy="80" r="12" fill="#ffffff" stroke="#38bdf8" strokeWidth="1.5" />
            {/* Eye contour */}
            <path d="M 91 80 C 95 74 105 74 109 80 C 105 86 95 86 91 80 Z" stroke="#0284c7" strokeWidth="1.8" />
            <circle cx="100" cy="80" r="3" fill="#0284c7" />

            {/* Pure Tear Droplet falling */}
            <path
              d="M 148 70 C 148 70 142 80 142 86 C 142 91 145 94 148 94 C 151 94 154 91 154 86 C 154 80 148 70 148 70 Z"
              fill="url(#eyeDropGrad)"
              stroke="#0369a1"
              strokeWidth="1.2"
            />
            <path
              d="M 145 84 C 145 82 147 80 149 80"
              stroke="#ffffff"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeOpacity="0.7"
            />
          </svg>
          <div className="absolute top-2.5 right-3 text-[10px] font-black uppercase tracking-wider text-cyan-800 dark:text-cyan-200 bg-cyan-100/90 dark:bg-cyan-950/80 px-2 py-0.5 rounded-md border border-cyan-300/60 dark:border-cyan-700/60 shadow-xs">
            Sterile Eye Wash Drops
          </div>
        </div>
      );

    case 'injection':
    default:
      return (
        <div className={`relative flex items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-red-500/10 via-rose-500/5 to-purple-500/10 dark:from-red-950/30 dark:to-purple-950/20 p-4 border border-red-200/50 dark:border-red-800/30 ${className}`}>
          <div className="absolute inset-0 bg-radial from-red-400/15 via-transparent to-transparent pointer-events-none" />
          <svg viewBox="0 0 200 130" className="w-full h-full max-h-36 drop-shadow-md select-none" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="ampouleGrad" x1="40" y1="30" x2="80" y2="105" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="60%" stopColor="#fee2e2" />
                <stop offset="100%" stopColor="#fecaca" />
              </linearGradient>
              <linearGradient id="syringeGrad" x1="80" y1="40" x2="170" y2="85" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="100%" stopColor="#f1f5f9" />
              </linearGradient>
            </defs>

            {/* Shadow */}
            <ellipse cx="60" cy="112" rx="18" ry="5" fill="#081a14" fillOpacity="0.14" />
            <ellipse cx="135" cy="108" rx="45" ry="6" fill="#081a14" fillOpacity="0.12" />

            {/* Clinical Vaccine Ampoule */}
            <g transform="translate(40, 25)">
              {/* Ampoule Tip */}
              <path d="M 18 10 L 22 10 L 21 22 L 19 22 Z" fill="#fca5a5" stroke="#dc2626" strokeWidth="1" />
              {/* Constriction Neck with Cut Ring */}
              <rect x="17" y="22" width="6" height="4" fill="#ffffff" stroke="#dc2626" strokeWidth="1" />
              <line x1="17" y1="24" x2="23" y2="24" stroke="#dc2626" strokeWidth="1" />
              {/* Ampoule Body */}
              <path
                d="M 14 26 L 10 35 L 10 78 C 10 83 14 86 20 86 C 26 86 30 83 30 78 L 30 35 L 26 26 Z"
                fill="url(#ampouleGrad)"
                stroke="#dc2626"
                strokeWidth="1.8"
              />
              {/* Vaccine Biological Fill */}
              <path d="M 11 52 L 29 52 L 29 78 C 29 82 25 85 20 85 C 15 85 11 82 11 78 Z" fill="#dc2626" fillOpacity="0.65" />
              {/* Label */}
              <rect x="12" y="38" width="16" height="12" rx="1" fill="#ffffff" stroke="#f87171" strokeWidth="0.8" />
              <line x1="14" y1="42" x2="26" y2="42" stroke="#dc2626" strokeWidth="1" />
              <line x1="14" y1="46" x2="22" y2="46" stroke="#991b1b" strokeWidth="0.8" />
            </g>

            {/* Clinical Syringe Assembly */}
            <g transform="rotate(-15 130 65)">
              {/* Syringe Barrel */}
              <rect
                x="85"
                y="54"
                width="65"
                height="22"
                rx="2"
                fill="url(#syringeGrad)"
                stroke="#64748b"
                strokeWidth="1.8"
              />
              {/* Graduation Marks */}
              <line x1="95" y1="54" x2="95" y2="60" stroke="#475569" strokeWidth="1.5" />
              <line x1="105" y1="54" x2="105" y2="64" stroke="#475569" strokeWidth="1.5" />
              <line x1="115" y1="54" x2="115" y2="60" stroke="#475569" strokeWidth="1.5" />
              <line x1="125" y1="54" x2="125" y2="64" stroke="#475569" strokeWidth="1.5" />
              <line x1="135" y1="54" x2="135" y2="60" stroke="#475569" strokeWidth="1.5" />

              {/* Rubber Plunger Head */}
              <rect x="110" y="55" width="8" height="20" rx="1" fill="#1e293b" />
              {/* Plunger Shaft & Flange */}
              <rect x="118" y="62" width="40" height="6" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="1" />
              <rect x="156" y="52" width="4" height="26" rx="1" fill="#64748b" />

              {/* Luer Lock & Needle */}
              <rect x="79" y="60" width="6" height="10" fill="#94a3b8" stroke="#64748b" strokeWidth="1" />
              <line x1="79" y1="65" x2="52" y2="65" stroke="#94a3b8" strokeWidth="1.5" />
              {/* Beveled Needle Tip */}
              <path d="M 54 64 L 50 65 L 54 66 Z" fill="#64748b" />
            </g>
          </svg>
          <div className="absolute top-2.5 right-3 text-[10px] font-black uppercase tracking-wider text-red-800 dark:text-red-200 bg-red-100/90 dark:bg-red-950/80 px-2 py-0.5 rounded-md border border-red-300/60 dark:border-red-700/60 shadow-xs">
            Hospital Clinical Mandatory
          </div>
        </div>
      );
  }
};
