import React from 'react';

export interface SectionHeaderProps {
  title: string;
  description?: string;
  badge?: React.ReactNode;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  description,
  badge,
  icon,
  action,
  className = ''
}) => {
  return (
    <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${className}`}>
      <div className="space-y-1">
        <div className="flex items-center gap-2.5">
          {icon && <span className="text-[#0d7a5f] dark:text-[#00BE88] shrink-0">{icon}</span>}
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#081a14] dark:text-[#f5fbf8]">
            {title}
          </h2>
          {badge && <span>{badge}</span>}
        </div>
        {description && (
          <p className="text-xs sm:text-sm text-[#4e665f] dark:text-[#8eada3] leading-relaxed">
            {description}
          </p>
        )}
      </div>

      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
};
