import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { GlassContainer } from './GlassContainer';

interface StatCardProps {
  label: string;
  value: string | number;
  sub: string;
  icon: React.ReactNode;
  delay?: number;
}

/**
 * Reusable Glassy KPI metric card with tabular numerals and dynamic accent styling.
 */
export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  sub,
  icon,
  delay = 0,
}) => {
  const { currentAccentHex, isDarkGlass } = useTheme();

  return (
    <GlassContainer
      delay={delay}
      hoverLift
      className="p-5 flex flex-col justify-between"
    >
      <div className="flex items-center justify-between gap-3 mb-3">
        <span className="text-xs font-semibold text-[var(--tf-muted)] tracking-wide">
          {label}
        </span>
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-colors"
          style={{
            backgroundColor: isDarkGlass
              ? 'rgba(255, 255, 255, 0.08)'
              : 'rgba(255, 255, 255, 0.72)',
            border: `1px solid ${currentAccentHex}45`,
            color: currentAccentHex,
          }}
        >
          {icon}
        </div>
      </div>

      <div>
        <div className="font-mono text-2xl sm:text-3xl font-bold text-[var(--tf-heading)] tabular-nums tracking-tight">
          {value}
        </div>
        <div className="text-xs text-[var(--tf-muted)] mt-1 font-medium">
          {sub}
        </div>
      </div>
    </GlassContainer>
  );
};
