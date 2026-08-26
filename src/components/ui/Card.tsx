import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'raised' | 'interactive' | 'alert' | 'highlight';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  padding = 'md',
  className = '',
  ...props
}) => {
  const paddingClasses = {
    none: 'p-0',
    sm: 'p-3.5 sm:p-4',
    md: 'p-5 sm:p-6',
    lg: 'p-6 sm:p-8'
  };

  const variantClasses = {
    default:
      'bg-white dark:bg-[#121915] border border-slate-200/90 dark:border-[#1e2c25] shadow-xs rounded-2xl',
    raised:
      'bg-white dark:bg-[#17211c] border border-slate-200/80 dark:border-[#22332a] shadow-sm rounded-2xl',
    interactive:
      'bg-white dark:bg-[#121915] border border-slate-200/90 dark:border-[#1e2c25] shadow-xs hover:shadow-md hover:border-[#0d7a5f]/40 dark:hover:border-emerald-500/40 rounded-2xl cursor-pointer transition-all duration-150',
    alert:
      'bg-red-50/70 dark:bg-red-950/30 border border-red-200 dark:border-red-900/60 rounded-2xl text-red-900 dark:text-red-200',
    highlight:
      'bg-[#ecf7f3] dark:bg-emerald-950/30 border border-[#b8e2d4] dark:border-emerald-900/60 rounded-2xl text-slate-900 dark:text-slate-100'
  };

  return (
    <div
      className={`${variantClasses[variant]} ${paddingClasses[padding]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
