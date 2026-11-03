import React from 'react';
import { Loader2 } from 'lucide-react';
import { motion, HTMLMotionProps } from 'motion/react';

export interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  children?: React.ReactNode;
  variant?:
    | 'primary'
    | 'secondary'
    | 'emergency'
    | 'emergency-light'
    | 'emergency-outline'
    | 'outline'
    | 'ghost'
    | 'destructive'
    | 'subtle';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  className = '',
  disabled,
  ...props
}) => {
  const baseClasses =
    'inline-flex items-center justify-center font-semibold rounded-xl select-none focus-visible:outline-hidden disabled:opacity-50 disabled:pointer-events-none cursor-pointer';

  const sizeClasses = {
    sm: 'text-xs px-3 py-1.5 gap-1.5 rounded-lg',
    md: 'text-sm px-4 py-2.5 gap-2 rounded-xl',
    lg: 'text-base px-6 py-3.5 gap-2.5 rounded-2xl'
  };

  const variantClasses: Record<NonNullable<ButtonProps['variant']>, string> = {
    primary:
      'bg-[#0d7a5f] hover:bg-[#0a634d] active:bg-[#084e3c] text-white shadow-xs dark:bg-[#00BE88] dark:hover:bg-[#00A878] dark:active:bg-[#008F6B] dark:text-[#041611] font-bold shadow-sm',
    secondary:
      'bg-[#081a14] hover:bg-[#132d24] text-white dark:bg-[#f5fbf8] dark:hover:bg-white dark:text-[#06130f] font-semibold shadow-xs',
    emergency:
      'bg-[#DC2626] hover:bg-[#B91C1C] active:bg-[#991B1B] text-white shadow-sm shadow-red-900/20 font-bold dark:bg-[#FF4D4D] dark:hover:bg-[#E63C3C]',
    'emergency-light':
      'bg-white hover:bg-red-50 active:bg-red-100 !text-[#b91c1c] hover:!text-[#991b1b] dark:bg-white dark:!text-[#b91c1c] dark:hover:!text-[#991b1b] font-black shadow-md border border-red-200/80',
    'emergency-outline':
      'border-2 border-red-300 hover:border-red-500 bg-white hover:bg-red-50 !text-[#b91c1c] hover:!text-[#991b1b] dark:border-red-800 dark:bg-[#180a0c] dark:hover:bg-red-950/60 dark:!text-red-300 font-bold shadow-xs',
    outline:
      'border border-[#c8d7d1] hover:border-[#0d7a5f] bg-white hover:bg-[#f4f8f6] text-[#081a14] dark:border-[#1e463a] dark:bg-[#0c221b] dark:hover:bg-[#122e25] dark:hover:border-[#00BE88] dark:text-[#f5fbf8] shadow-xs',
    ghost:
      'text-[#223730] hover:text-[#081a14] hover:bg-[#eaf1ee] dark:text-[#c4dbd3] dark:hover:text-[#f5fbf8] dark:hover:bg-[#143229]',
    destructive:
      'bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 dark:bg-red-950/40 dark:hover:bg-red-950/70 dark:text-red-300 dark:border-red-900/60 font-semibold',
    subtle:
      'bg-[#ecf7f3] hover:bg-[#d8efe7] text-[#0d7a5f] dark:bg-[#0f2a21] dark:hover:bg-[#15382c] dark:text-[#00BE88] border border-[#b8e2d4] dark:border-[#1d4d3e] font-semibold'
  };

  return (
    <motion.button
      whileHover={disabled || isLoading ? undefined : { y: -1, transition: { duration: 0.12 } }}
      whileTap={disabled || isLoading ? undefined : { scale: 0.98 }}
      disabled={disabled || isLoading}
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin text-current shrink-0" />
      ) : (
        leftIcon && <span className="inline-flex shrink-0 text-current">{leftIcon}</span>
      )}
      {children && <span className="text-current">{children}</span>}
      {!isLoading && rightIcon && <span className="inline-flex shrink-0 text-current">{rightIcon}</span>}
    </motion.button>
  );
};
