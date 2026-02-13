/**
 * Modern Button Component - Clean, minimal with subtle depth
 * Replaces heavy neon/arcade buttons with refined modern style
 */

import { ButtonHTMLAttributes, ReactNode } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ModernButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: ReactNode;
  icon?: ReactNode;
  fullWidth?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'bg-gradient-to-r from-emerald-600 to-emerald-500 text-white hover:from-emerald-500 hover:to-emerald-400 active:from-emerald-700 active:to-emerald-600 shadow-lg shadow-emerald-500/25',
  secondary:
    'bg-white/[0.05] text-white/80 border border-white/[0.07] hover:bg-white/[0.08] hover:text-white hover:border-white/[0.12]',
  ghost:
    'bg-transparent text-white/60 hover:text-white hover:bg-white/[0.05]',
  danger:
    'bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20',
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-xs gap-1.5 rounded-lg',
  md: 'px-4 py-2.5 text-sm gap-2 rounded-xl',
  lg: 'px-6 py-3 text-sm gap-2.5 rounded-xl',
};

export function ModernButton({
  variant = 'primary',
  size = 'md',
  children,
  icon,
  fullWidth = false,
  className = '',
  ...props
}: ModernButtonProps) {
  return (
    <button
      className={`
        font-medium transition-all duration-200 ease-out
        flex items-center justify-center
        active:scale-[0.97]
        disabled:opacity-40 disabled:pointer-events-none
        ${variantStyles[variant]} 
        ${sizeStyles[size]} 
        ${fullWidth ? 'w-full' : ''} 
        ${className}
      `}
      {...props}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      <span>{children}</span>
    </button>
  );
}
