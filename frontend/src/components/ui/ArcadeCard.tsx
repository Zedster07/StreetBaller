/**
 * Arcade Card Component - Modern Dark UI Card
 */

import { ReactNode } from 'react';

interface ArcadeCardProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  action?: ReactNode;
  className?: string;
  hoverable?: boolean;
  onClick?: () => void;
}

export function ArcadeCard({
  children,
  title,
  subtitle,
  action,
  className = '',
  hoverable = false,
  onClick,
}: ArcadeCardProps) {
  return (
    <div
      className={`
        bg-gradient-to-br from-white/[0.1] to-white/[0.02] 
        backdrop-blur-xl rounded-2xl border border-white/10 p-6
        shadow-[0_4px_30px_rgba(0,0,0,0.1)]
        transition-all duration-300
        ${hoverable ? 'cursor-pointer hover:from-white/[0.15] hover:to-white/[0.05] hover:border-white/20 hover:shadow-[0_0_20px_rgba(0,255,136,0.1)] hover:-translate-y-1' : ''}
        ${className}
      `}
      onClick={onClick}
    >
      {/* Header */}
      {(title || action) && (
        <div className="flex items-center justify-between mb-4">
          <div>
            {title && (
              <h3 className="text-lg font-bold text-white tracking-wide">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="text-sm text-gray-400 mt-0.5">{subtitle}</p>
            )}
          </div>
          {action && <div>{action}</div>}
        </div>
      )}

      {/* Content */}
      <div className="text-gray-200">{children}</div>
    </div>
  );
}
