/**
 * Arcade Badge Component - For displaying achievements, status, and labels
 */

import { ReactNode } from 'react';

interface ArcadeBadgeProps {
  children: ReactNode;
  variant?: 'gold' | 'silver' | 'bronze' | 'purple' | 'success' | 'warning' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  icon?: ReactNode;
  className?: string;
}

const variantStyles = {
  gold: {
    bg: 'bg-gradient-to-r from-yellow-600 to-yellow-700',
    text: 'text-yellow-100',
    glow: 'rgba(255, 179, 0, 0.6)',
    border: '#FFB300',
  },
  silver: {
    bg: 'bg-gradient-to-r from-gray-500 to-gray-600',
    text: 'text-gray-100',
    glow: 'rgba(156, 156, 156, 0.6)',
    border: '#9C9C9C',
  },
  bronze: {
    bg: 'bg-gradient-to-r from-orange-700 to-orange-800',
    text: 'text-orange-100',
    glow: 'rgba(255, 107, 0, 0.6)',
    border: '#FF6F00',
  },
  purple: {
    bg: 'bg-gradient-to-r from-purple-600 to-purple-700',
    text: 'text-purple-100',
    glow: 'rgba(156, 39, 176, 0.6)',
    border: '#9C27B0',
  },
  success: {
    bg: 'bg-gradient-to-r from-green-600 to-green-700',
    text: 'text-green-100',
    glow: 'rgba(76, 175, 80, 0.6)',
    border: '#4CAF50',
  },
  warning: {
    bg: 'bg-gradient-to-r from-orange-500 to-orange-600',
    text: 'text-orange-100',
    glow: 'rgba(255, 107, 0, 0.6)',
    border: '#FF6F00',
  },
  danger: {
    bg: 'bg-gradient-to-r from-red-600 to-red-700',
    text: 'text-red-100',
    glow: 'rgba(211, 47, 47, 0.6)',
    border: '#D32F2F',
  },
};

const sizeStyles = {
  sm: 'px-2 py-1 text-xs rounded',
  md: 'px-3 py-1.5 text-sm rounded-md',
  lg: 'px-4 py-2 text-base rounded-lg',
};

export function ArcadeBadge({
  children,
  variant = 'gold',
  size = 'md',
  icon,
  className = '',
}: ArcadeBadgeProps) {
  const style = variantStyles[variant];

  return (
    <span
      className={`
        inline-flex items-center gap-1.5 font-bold border-2
        ${style.bg} ${style.text} ${sizeStyles[size]} ${className}
        transition-all duration-300 hover:scale-110
      `}
      style={{
        borderColor: style.border,
        boxShadow: `0 0 12px ${style.glow}, inset 0 0 8px ${style.glow}40`,
      }}
    >
      {icon && <span className="text-lg">{icon}</span>}
      {children}
    </span>
  );
}
