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
      'bg-red-100 text-red-800 border-red-200 dark:bg-red-950/60 dark:text-red-300 dark:border-red-800/80',
    urgent:
      'bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-950/60 dark:text-orange-300 dark:border-orange-800/80',
    review:
      'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800/80',
    first_aid:
      'bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800/80',
    neutral:
      'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800/80 dark:text-slate-300 dark:border-slate-700',
    info:
      'bg-sky-100 text-sky-800 border-sky-200 dark:bg-sky-950/60 dark:text-sky-300 dark:border-sky-800/80',
    success:
      'bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800/80',
    triage:
      'bg-slate-900 text-white border-transparent dark:bg-slate-100 dark:text-slate-900'
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
