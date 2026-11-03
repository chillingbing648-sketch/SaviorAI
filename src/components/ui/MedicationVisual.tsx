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
  className = 'w-full h-28 sm:h-32'
}) => {
  switch (form) {
    case 'ointment':
      return (
        <div className={`relative flex items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-amber-500/10 via-emerald-500/5 to-teal-500/10 dark:from-amber-950/25 dark:to-teal-950/20 p-2.5 border border-amber-200/50 dark:border-amber-800/30 ${className}`}>
          <div className="absolute inset-0 bg-radial from-amber-400/10 via-transparent to-transparent pointer-events-none" />
          <svg viewBox="0 0 180 90" className="w-full h-full max-h-24 drop-shadow-sm select-none" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="ointTubeGrad" x1="20" y1="25" x2="140" y2="70" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="35%" stopColor="#eaf3ef" />
                <stop offset="100%" stopColor="#c5ded5" />
              </linearGradient>
              <linearGradient id="ointCapGrad" x1="130" y1="30" x2="160" y2="60" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#0d7a5f" />
                <stop offset="100%" stopColor="#064032" />
              </linearGradient>
              <linearGradient id="ointDropGrad" x1="145" y1="52" x2="162" y2="72" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#fef08a" />
                <stop offset="60%" stopColor="#f59e0b" />
                <stop offset="100%" stopColor="#d97706" />
              </linearGradient>
            </defs>

            {/* Cast Shadow */}
            <ellipse cx="85" cy="78" rx="65" ry="6" fill="#081a14" fillOpacity="0.12" />

            {/* Tube Main Body (Slightly angled realistic cylinder) */}
            <path
              d="M 28 26 L 122 34 C 127 34 130 38 130 42 L 130 52 C 130 56 127 60 122 60 L 28 68 C 25 68 22 65 22 62 L 22 32 C 22 29 25 26 28 26 Z"
              fill="url(#ointTubeGrad)"
              stroke="#5a776e"
              strokeWidth="1.8"
            />

            {/* Crimped Base with Embossed Seal Marks */}
            <rect x="20" y="25" width="6" height="44" rx="1.5" fill="#8eada3" stroke="#4e665f" strokeWidth="1.2" />
            <line x1="23" y1="28" x2="23" y2="66" stroke="#ffffff" strokeWidth="0.8" strokeDasharray="2 1.5" />

            {/* Clinical Color Band & Label */}
            <path d="M 38 29.5 L 56 31 L 56 63 L 38 64.5 Z" fill="#0d7a5f" />
            <circle cx="47" cy="47" r="5" fill="#ffffff" />
            <path d="M 47 44 L 47 50 M 44 47 L 50 47" stroke="#0d7a5f" strokeWidth="1.8" strokeLinecap="round" />

            {/* Typography line simulation on tube */}
            <rect x="64" y="38" width="46" height="3" rx="1.5" fill="#0d7a5f" fillOpacity="0.85" />
            <rect x="64" y="44" width="32" height="2.5" rx="1" fill="#6c837c" fillOpacity="0.7" />
            <rect x="64" y="49" width="38" height="2.5" rx="1" fill="#6c837c" fillOpacity="0.5" />

            {/* Threaded Neck */}
            <rect x="130" y="41" width="6" height="12" rx="1" fill="#cbd5e1" stroke="#64748b" strokeWidth="1" />
            <line x1="132" y1="42" x2="132" y2="52" stroke="#94a3b8" strokeWidth="0.8" />
            <line x1="134" y1="42" x2="134" y2="52" stroke="#94a3b8" strokeWidth="0.8" />

            {/* Ribbed Clinical Cap */}
            <path
              d="M 136 37 L 152 35 C 154 35 156 36 156 38 L 156 56 C 156 58 154 59 152 59 L 136 57 Z"
              fill="url(#ointCapGrad)"
              stroke="#04261e"
              strokeWidth="1.5"
            />
            {/* Grip ridges on cap */}
            <line x1="141" y1="37" x2="141" y2="57" stroke="#00BE88" strokeWidth="1" strokeOpacity="0.6" />
            <line x1="146" y1="36" x2="146" y2="58" stroke="#00BE88" strokeWidth="1" strokeOpacity="0.6" />
            <line x1="151" y1="36" x2="151" y2="58" stroke="#00BE88" strokeWidth="1" strokeOpacity="0.6" />

            {/* Curled Translucent Balm Droplet emerging from nozzle */}
            <path
              d="M 156 47 C 164 45 168 48 168 52 C 168 56 163 58 156 54 Z"
              fill="url(#ointDropGrad)"
              stroke="#d97706"
              strokeWidth="1.2"
            />
            <ellipse cx="163" cy="50" rx="1.5" ry="1" fill="#ffffff" fillOpacity="0.8" />
          </svg>
          <div className="absolute top-2 right-2.5 text-[9px] font-black uppercase tracking-wider text-amber-700 dark:text-amber-300 bg-amber-100/90 dark:bg-amber-950/80 px-2 py-0.5 rounded-md border border-amber-300/60 dark:border-amber-700/60 shadow-2xs">
            Ointment / Gel
          </div>
        </div>
      );

    case 'tablet':
      return (
        <div className={`relative flex items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-teal-500/10 via-sky-500/5 to-emerald-500/10 dark:from-teal-950/25 dark:to-sky-950/20 p-2.5 border border-teal-200/50 dark:border-teal-800/30 ${className}`}>
          <div className="absolute inset-0 bg-radial from-teal-400/10 via-transparent to-transparent pointer-events-none" />
          <svg viewBox="0 0 180 90" className="w-full h-full max-h-24 drop-shadow-sm select-none" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="tabLeft" x1="40" y1="30" x2="85" y2="70" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#0d7a5f" />
                <stop offset="100%" stopColor="#084e3c" />
              </linearGradient>
              <linearGradient id="tabRight" x1="85" y1="30" x2="130" y2="70" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="100%" stopColor="#e2ede8" />
              </linearGradient>
              <linearGradient id="tabRound" x1="30" y1="45" x2="70" y2="85" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="100%" stopColor="#d1ded9" />
              </linearGradient>
            </defs>

            {/* Shadow */}
            <ellipse cx="95" cy="74" rx="55" ry="6" fill="#081a14" fillOpacity="0.12" />
            <ellipse cx="45" cy="72" rx="20" ry="4" fill="#081a14" fillOpacity="0.1" />

            {/* Round Tablet Behind */}
            <circle cx="45" cy="56" r="18" fill="url(#tabRound)" stroke="#8eada3" strokeWidth="1.5" />
            <line x1="31" y1="56" x2="59" y2="56" stroke="#6c837c" strokeWidth="1.2" strokeDasharray="2 1.5" />

            {/* Angled Bicolor Capsule Pill */}
            <g transform="rotate(-15 95 48)">
              {/* Left Half (Emerald) */}
              <path
                d="M 60 32 C 48 32 40 40 40 50 C 40 60 48 68 60 68 L 92 68 L 92 32 Z"
                fill="url(#tabLeft)"
                stroke="#04261e"
                strokeWidth="1.8"
              />
              <path d="M 50 38 C 55 35 65 35 75 35" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeOpacity="0.5" />

              {/* Right Half (White) */}
              <path
                d="M 92 32 L 124 32 C 136 32 144 40 144 50 C 144 60 136 68 124 68 L 92 68 Z"
                fill="url(#tabRight)"
                stroke="#6c837c"
                strokeWidth="1.8"
              />
              <path d="M 118 45 L 118 55 M 113 50 L 123 50" stroke="#0d7a5f" strokeWidth="2.2" strokeLinecap="round" />
              <line x1="92" y1="31" x2="92" y2="69" stroke="#04261e" strokeWidth="2" />
            </g>
          </svg>
          <div className="absolute top-2 right-2.5 text-[9px] font-black uppercase tracking-wider text-teal-700 dark:text-teal-300 bg-teal-100/90 dark:bg-teal-950/80 px-2 py-0.5 rounded-md border border-teal-300/60 dark:border-teal-700/60 shadow-2xs">
            Oral Tablet / Pill
          </div>
        </div>
      );

    case 'solution':
      return (
        <div className={`relative flex items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-rose-500/10 dark:from-amber-950/25 dark:to-orange-950/20 p-2.5 border border-amber-200/50 dark:border-amber-800/30 ${className}`}>
          <div className="absolute inset-0 bg-radial from-amber-400/10 via-transparent to-transparent pointer-events-none" />
          <svg viewBox="0 0 180 90" className="w-full h-full max-h-24 drop-shadow-sm select-none" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="solAmberGrad" x1="60" y1="30" x2="110" y2="80" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#b45309" />
                <stop offset="60%" stopColor="#78350f" />
                <stop offset="100%" stopColor="#451a03" />
              </linearGradient>
            </defs>

            {/* Shadow */}
            <ellipse cx="85" cy="78" rx="36" ry="5" fill="#081a14" fillOpacity="0.14" />
            <ellipse cx="135" cy="76" rx="12" ry="3.5" fill="#081a14" fillOpacity="0.1" />

            {/* Dropper Rubber Bulb */}
            <path d="M 77 18 C 77 12 81 9 85 9 C 89 9 93 12 93 18 L 93 21 L 77 21 Z" fill="#1e293b" stroke="#0f172a" strokeWidth="1.2" />
            <rect x="74" y="21" width="22" height="7" rx="1.5" fill="#e2e8f0" stroke="#64748b" strokeWidth="1" />

            {/* Bottle Body */}
            <path
              d="M 78 28 L 71 34 C 66 39 64 44 64 50 L 64 74 C 64 77 67 79 71 79 L 99 79 C 103 79 106 77 106 74 L 106 50 C 106 44 104 39 99 34 L 92 28 Z"
              fill="url(#solAmberGrad)"
              stroke="#451a03"
              strokeWidth="1.8"
            />
            {/* Label */}
            <rect x="68" y="50" width="34" height="23" rx="1.5" fill="#ffffff" stroke="#e2e8f0" strokeWidth="0.8" />
            <rect x="71" y="53" width="28" height="3" rx="1" fill="#b45309" />
            <line x1="71" y1="59" x2="97" y2="59" stroke="#64748b" strokeWidth="1.2" />
            <line x1="71" y1="64" x2="92" y2="64" stroke="#94a3b8" strokeWidth="1" />

            {/* Precision Dropper on side with drop */}
            <g transform="translate(125, 20)">
              <rect x="7" y="2" width="5" height="30" rx="1" fill="#f8fafc" stroke="#94a3b8" strokeWidth="1" />
              <path d="M 7 32 L 8.5 40 L 10.5 40 L 12 32 Z" fill="#f8fafc" stroke="#94a3b8" strokeWidth="0.8" />
              <rect x="8" y="12" width="3" height="24" fill="#b45309" fillOpacity="0.85" />
              {/* Droplet */}
              <path d="M 9.5 44 C 9.5 44 5.5 50 5.5 53 C 5.5 55 7.5 57 9.5 57 C 11.5 57 13.5 55 13.5 53 C 13.5 50 9.5 44 9.5 44 Z" fill="#d97706" stroke="#78350f" strokeWidth="1" />
            </g>
          </svg>
          <div className="absolute top-2 right-2.5 text-[9px] font-black uppercase tracking-wider text-amber-800 dark:text-amber-200 bg-amber-100/90 dark:bg-amber-950/80 px-2 py-0.5 rounded-md border border-amber-300/60 dark:border-amber-700/60 shadow-2xs">
            Antiseptic Rinse / Solution
          </div>
        </div>
      );

    case 'sachet':
      return (
        <div className={`relative flex items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-sky-500/10 via-blue-500/5 to-cyan-500/10 dark:from-sky-950/25 dark:to-cyan-950/20 p-2.5 border border-sky-200/50 dark:border-sky-800/30 ${className}`}>
          <div className="absolute inset-0 bg-radial from-sky-400/10 via-transparent to-transparent pointer-events-none" />
          <svg viewBox="0 0 180 90" className="w-full h-full max-h-24 drop-shadow-sm select-none" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="sachetGrad" x1="40" y1="15" x2="140" y2="75" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="50%" stopColor="#e0f2fe" />
                <stop offset="100%" stopColor="#bae6fd" />
              </linearGradient>
            </defs>
            <ellipse cx="90" cy="78" rx="46" ry="5.5" fill="#081a14" fillOpacity="0.12" />

            <path
              d="M 52 16 L 128 16 C 130 16 132 18 132 20 L 128 74 C 128 76 126 78 124 78 L 56 78 C 54 78 52 76 52 74 L 48 20 C 48 18 50 16 52 16 Z"
              fill="url(#sachetGrad)"
              stroke="#0284c7"
              strokeWidth="1.8"
            />
            {/* Sealed Crimps */}
            <rect x="48" y="16" width="84" height="6" fill="#7dd3fc" stroke="#0284c7" strokeWidth="0.8" />
            <rect x="52" y="72" width="76" height="6" fill="#7dd3fc" stroke="#0284c7" strokeWidth="0.8" />
            {/* Notch */}
            <path d="M 48 27 L 53 29.5 L 48 32 Z" fill="#0284c7" />

            <rect x="58" y="28" width="64" height="18" rx="2.5" fill="#0284c7" />
            <text x="90" y="41" textAnchor="middle" fill="#ffffff" fontSize="9.5" fontWeight="900" fontFamily="sans-serif">
              WHO • ORS
            </text>
            {/* Ions */}
            <g transform="translate(60, 52)">
              <rect x="0" y="0" width="18" height="10" rx="1.5" fill="#dbeafe" stroke="#93c5fd" strokeWidth="0.6" />
              <text x="9" y="8" textAnchor="middle" fill="#1e40af" fontSize="6.5" fontWeight="800">Na⁺</text>
              <rect x="21" y="0" width="18" height="10" rx="1.5" fill="#dbeafe" stroke="#93c5fd" strokeWidth="0.6" />
              <text x="30" y="8" textAnchor="middle" fill="#1e40af" fontSize="6.5" fontWeight="800">K⁺</text>
              <rect x="42" y="0" width="19" height="10" rx="1.5" fill="#dbeafe" stroke="#93c5fd" strokeWidth="0.6" />
              <text x="51.5" y="8" textAnchor="middle" fill="#1e40af" fontSize="6.5" fontWeight="800">H₂O</text>
            </g>
          </svg>
          <div className="absolute top-2 right-2.5 text-[9px] font-black uppercase tracking-wider text-sky-800 dark:text-sky-200 bg-sky-100/90 dark:bg-sky-950/80 px-2 py-0.5 rounded-md border border-sky-300/60 dark:border-sky-700/60 shadow-2xs">
            Hydration Sachet
          </div>
        </div>
      );

    case 'drops':
      return (
        <div className={`relative flex items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-cyan-500/10 via-sky-500/5 to-blue-500/10 dark:from-cyan-950/25 dark:to-blue-950/20 p-2.5 border border-cyan-200/50 dark:border-cyan-800/30 ${className}`}>
          <div className="absolute inset-0 bg-radial from-cyan-400/10 via-transparent to-transparent pointer-events-none" />
          <svg viewBox="0 0 180 90" className="w-full h-full max-h-24 drop-shadow-sm select-none" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="eyeGrad" x1="70" y1="30" x2="105" y2="75" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="60%" stopColor="#e0f2fe" />
                <stop offset="100%" stopColor="#bae6fd" />
              </linearGradient>
            </defs>
            <ellipse cx="88" cy="78" rx="28" ry="4.5" fill="#081a14" fillOpacity="0.12" />

            {/* Cap */}
            <path d="M 83 14 L 93 14 L 95 31 L 81 31 Z" fill="#0284c7" stroke="#0369a1" strokeWidth="1.2" />
            <rect x="79" y="31" width="18" height="5" rx="1" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="0.8" />

            {/* Flacon Body */}
            <path
              d="M 81 36 L 75 42 C 71 47 70 53 70 59 L 70 72 C 70 76 73 78 78 78 L 98 78 C 103 78 106 76 106 72 L 106 59 C 106 53 105 47 101 42 L 95 36 Z"
              fill="url(#eyeGrad)"
              stroke="#0284c7"
              strokeWidth="1.8"
            />
            <circle cx="88" cy="60" r="9" fill="#ffffff" stroke="#38bdf8" strokeWidth="1.2" />
            <path d="M 82 60 C 85 55 91 55 94 60 C 91 65 85 65 82 60 Z" stroke="#0284c7" strokeWidth="1.4" />
            <circle cx="88" cy="60" r="2.2" fill="#0284c7" />

            {/* Pure drop */}
            <path d="M 126 50 C 126 50 121 57 121 62 C 121 66 123 68 126 68 C 129 68 131 66 131 62 C 131 57 126 50 126 50 Z" fill="#0284c7" stroke="#0369a1" strokeWidth="1" />
          </svg>
          <div className="absolute top-2 right-2.5 text-[9px] font-black uppercase tracking-wider text-cyan-800 dark:text-cyan-200 bg-cyan-100/90 dark:bg-cyan-950/80 px-2 py-0.5 rounded-md border border-cyan-300/60 dark:border-cyan-700/60 shadow-2xs">
            Ophthalmic Drops
          </div>
        </div>
      );

    case 'injection':
    default:
      return (
        <div className={`relative flex items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-red-500/10 via-rose-500/5 to-purple-500/10 dark:from-red-950/25 dark:to-purple-950/20 p-2.5 border border-red-200/50 dark:border-red-800/30 ${className}`}>
          <div className="absolute inset-0 bg-radial from-red-400/10 via-transparent to-transparent pointer-events-none" />
          <svg viewBox="0 0 180 90" className="w-full h-full max-h-24 drop-shadow-sm select-none" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="ampGrad" x1="30" y1="20" x2="60" y2="70" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="60%" stopColor="#fee2e2" />
                <stop offset="100%" stopColor="#fca5a5" />
              </linearGradient>
            </defs>

            <ellipse cx="48" cy="78" rx="14" ry="4" fill="#081a14" fillOpacity="0.12" />
            <ellipse cx="115" cy="74" rx="38" ry="5" fill="#081a14" fillOpacity="0.1" />

            {/* Ampoule */}
            <g transform="translate(34, 18)">
              <path d="M 13 8 L 17 8 L 16 16 L 14 16 Z" fill="#fca5a5" stroke="#dc2626" strokeWidth="0.8" />
              <rect x="13" y="16" width="4" height="3" fill="#ffffff" stroke="#dc2626" strokeWidth="0.8" />
              <path d="M 11 19 L 8 26 L 8 58 C 8 61 11 63 15 63 C 19 63 22 61 22 58 L 22 26 L 19 19 Z" fill="url(#ampGrad)" stroke="#dc2626" strokeWidth="1.4" />
              <path d="M 9 38 L 21 38 L 21 58 C 21 60.5 18 62 15 62 C 12 62 9 60.5 9 58 Z" fill="#dc2626" fillOpacity="0.65" />
            </g>

            {/* Syringe */}
            <g transform="rotate(-12 110 48)">
              <rect x="75" y="42" width="50" height="16" rx="1.5" fill="#f8fafc" stroke="#64748b" strokeWidth="1.4" />
              <line x1="83" y1="42" x2="83" y2="46" stroke="#475569" strokeWidth="1" />
              <line x1="91" y1="42" x2="91" y2="49" stroke="#475569" strokeWidth="1" />
              <line x1="99" y1="42" x2="99" y2="46" stroke="#475569" strokeWidth="1" />
              <line x1="107" y1="42" x2="107" y2="49" stroke="#475569" strokeWidth="1" />
              <rect x="96" y="43" width="6" height="14" fill="#1e293b" />
              <rect x="102" y="48" width="30" height="4" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="0.8" />
              <rect x="132" y="40" width="3" height="20" rx="1" fill="#64748b" />
              <rect x="70" y="46.5" width="5" height="7" fill="#94a3b8" stroke="#64748b" strokeWidth="0.8" />
              <line x1="70" y1="50" x2="48" y2="50" stroke="#64748b" strokeWidth="1.2" />
            </g>
          </svg>
          <div className="absolute top-2 right-2.5 text-[9px] font-black uppercase tracking-wider text-red-800 dark:text-red-200 bg-red-100/90 dark:bg-red-950/80 px-2 py-0.5 rounded-md border border-red-300/60 dark:border-red-700/60 shadow-2xs">
            Clinical Injection / Vaccine
          </div>
        </div>
      );
  }
};
