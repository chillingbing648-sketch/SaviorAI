import React from 'react';
import { motion, HTMLMotionProps } from 'motion/react';

export interface CardProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
  children?: React.ReactNode;
  variant?: 'default' | 'raised' | 'interactive' | 'alert' | 'highlight' | 'muted';
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
      'bg-white dark:bg-[#0d221b] border border-[#d1ded9] dark:border-[#1b4136] shadow-xs dark:shadow-sm rounded-2xl transition-colors duration-200',
    raised:
      'bg-white dark:bg-[#122c23] border border-[#c8d8d2] dark:border-[#225244] shadow-sm dark:shadow-md rounded-2xl transition-colors duration-200',
    interactive:
      'bg-white dark:bg-[#0d221b] border border-[#d1ded9] dark:border-[#1b4136] shadow-xs hover:shadow-md hover:border-[#0d7a5f] dark:hover:border-[#00BE88] rounded-2xl cursor-pointer transition-all duration-200',
    alert:
      'bg-red-50/90 dark:bg-red-950/40 border border-red-200 dark:border-red-900/70 rounded-2xl text-red-950 dark:text-red-100 transition-colors duration-200',
    highlight:
      'bg-[#ecf7f3] dark:bg-[#102a21] border border-[#b8e2d4] dark:border-[#1d4d3e] rounded-2xl text-[#081a14] dark:text-[#f5fbf8] transition-colors duration-200',
    muted:
      'bg-[#f4f7f5] dark:bg-[#091a14] border border-[#d8e3df] dark:border-[#16362c] rounded-2xl text-[#223730] dark:text-[#d1e4dd] transition-colors duration-200'
  };

  const motionProps = variant === 'interactive'
    ? {
        whileHover: { y: -2, transition: { duration: 0.15, ease: 'easeOut' as const } },
        whileTap: { scale: 0.99 }
      }
    : {};

  return (
    <motion.div
      className={`${variantClasses[variant]} ${paddingClasses[padding]} ${className}`}
      {...motionProps}
      {...props}
    >
      {children}
    </motion.div>
  );
};
