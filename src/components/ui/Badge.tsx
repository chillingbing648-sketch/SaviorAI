import React from 'react';
import { TriageLevel } from '../../types';

export interface BadgeProps {
  children?: React.ReactNode;
  variant?:
    | 'emergency'
    | 'urgent'
    | 'review'
    | 'first_aid'
    | 'neutral'
    | 'info'
    | 'success'
    | 'triage';
  triageLevel?: TriageLevel;
  size?: 'sm' | 'md';
  pulse?: boolean;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  triageLevel,
  size = 'md',
  pulse = false,
  className = ''
}) => {
  // If triageLevel is provided, map it to semantic variants
  let resolvedVariant = variant;
  let label = children;

  if (triageLevel) {
    switch (triageLevel) {
      case 'LEVEL_1_EMERGENCY':
        resolvedVariant = 'emergency';
        if (!label) label = 'Level 1 • Emergency';
        break;
      case 'LEVEL_2_URGENT':
        resolvedVariant = 'urgent';
        if (!label) label = 'Level 2 • Urgent';
        break;
      case 'LEVEL_3_MEDICAL_REVIEW':
        resolvedVariant = 'review';
        if (!label) label = 'Level 3 • Medical Review';
        break;
      case 'LEVEL_4_BASIC_FIRST_AID':
        resolvedVariant = 'first_aid';
        if (!label) label = 'Level 4 • Basic First Aid';
        break;
    }
  }

  const variantClasses = {
    emergency:
      'bg-red-50 text-red-700 border-red-300 font-bold dark:bg-red-950/60 dark:text-red-200 dark:border-red-700',
    urgent:
      'bg-amber-50 text-amber-800 border-amber-300 font-bold dark:bg-amber-950/60 dark:text-amber-200 dark:border-amber-700',
    review:
      'bg-yellow-50 text-yellow-800 border-yellow-300 font-bold dark:bg-yellow-950/60 dark:text-yellow-200 dark:border-yellow-700',
    first_aid:
      'bg-emerald-50 text-[#0d7a5f] border-emerald-300 font-bold dark:bg-[#0c2b21] dark:text-[#00BE88] dark:border-[#1d5242]',
    neutral:
      'bg-[#f0f4f2] text-[#223730] border-[#d1ded9] font-medium dark:bg-[#132d24] dark:text-[#d1e4dd] dark:border-[#22483b]',
    info:
      'bg-sky-50 text-sky-800 border-sky-300 font-semibold dark:bg-sky-950/60 dark:text-sky-200 dark:border-sky-700',
    success:
      'bg-emerald-50 text-[#0d7a5f] border-emerald-300 font-bold dark:bg-[#0c2b21] dark:text-[#00BE88] dark:border-[#1d5242]',
    triage:
      'bg-[#081a14] text-white border-transparent dark:bg-[#f5fbf8] dark:text-[#06130f] font-bold'
  };

  const sizeClasses = {
    sm: 'text-[10px] px-2 py-0.5 font-bold tracking-wider uppercase rounded-md',
    md: 'text-xs px-2.5 py-1 font-semibold rounded-lg'
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 border leading-none ${sizeClasses[size]} ${variantClasses[resolvedVariant]} ${className}`}
    >
      {pulse && (
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-current opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-current"></span>
        </span>
      )}
      <span>{label}</span>
    </span>
  );
};
