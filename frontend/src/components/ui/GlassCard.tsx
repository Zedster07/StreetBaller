/**
 * Glass Card Component - Dark Glassmorphism Card (2026 Trend)
 * 
 * Replaces ArcadeCard with a cleaner, more refined glass effect.
 * Subtle frosted glass with clean borders — no heavy neon glow.
 */

import { ReactNode } from 'react';

interface GlassCardProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  action?: ReactNode;
  className?: string;
  hoverable?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  onClick?: () => void;
}

const paddingMap = {
  none: 'p-0',
  sm: 'p-4',
  md: 'p-5',
  lg: 'p-6',
};

export function GlassCard({
  children,
  title,
  subtitle,
  action,
  className = '',
  hoverable = false,
  padding = 'lg',
  onClick,
}: GlassCardProps) {
  return (
    <div
      className={`
        bg-white/[0.035] backdrop-blur-xl 
        rounded-2xl border border-white/[0.05]
        transition-all duration-300 ease-out
        ${paddingMap[padding]}
        ${hoverable ? 'cursor-pointer hover:bg-white/[0.06] hover:border-white/[0.10] hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/25' : ''}
        ${className}
      `}
      onClick={onClick}
    >
      {/* Header */}
      {(title || action) && (
        <div className="flex items-center justify-between mb-4">
          <div className="space-y-0.5">
            {title && (
              <h3 className="text-[15px] font-semibold text-white/90 tracking-tight">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="text-[13px] text-white/40">{subtitle}</p>
            )}
          </div>
          {action && <div>{action}</div>}
        </div>
      )}

      {/* Content */}
      {children}
    </div>
  );
}
