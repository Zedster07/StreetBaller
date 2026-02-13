/**
 * Badge Component - Clean, subtle status badges
 * Replaces heavy arcade-glow badges with refined modern style
 */

import { ReactNode } from 'react';

interface BadgeProps {
  children: ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'gold' | 'purple';
  size?: 'sm' | 'md';
  dot?: boolean;
  className?: string;
}

const variantStyles = {
  default: 'bg-white/[0.08] text-white/60 border-white/[0.06]',
  success: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  warning: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  danger: 'bg-red-500/10 text-red-400 border-red-500/20',
  info: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  gold: 'bg-amber-500/10 text-amber-300 border-amber-500/15',
  purple: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
};

const dotColorMap = {
  default: 'bg-white/40',
  success: 'bg-emerald-400',
  warning: 'bg-amber-400',
  danger: 'bg-red-400',
  info: 'bg-blue-400',
  gold: 'bg-amber-300',
  purple: 'bg-purple-400',
};

const sizeStyles = {
  sm: 'px-2 py-0.5 text-[10px]',
  md: 'px-2.5 py-1 text-[11px]',
};

export function Badge({
  children,
  variant = 'default',
  size = 'md',
  dot = false,
  className = '',
}: BadgeProps) {
  return (
    <span
      className={`
        inline-flex items-center gap-1.5 font-medium border rounded-full
        tracking-wide uppercase
        ${variantStyles[variant]} ${sizeStyles[size]} ${className}
      `}
    >
      {dot && (
        <span className={`w-1.5 h-1.5 rounded-full ${dotColorMap[variant]}`} />
      )}
      {children}
    </span>
  );
}
