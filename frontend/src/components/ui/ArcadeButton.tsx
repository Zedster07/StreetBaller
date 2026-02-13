/**
 * Arcade Button Component - Neon styled button with glow effects
 */

import { ButtonHTMLAttributes, ReactNode } from 'react';
import { useTheme } from '@/theme';

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'success' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ArcadeButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: ReactNode;
  icon?: ReactNode;
  fullWidth?: boolean;
  glow?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'bg-gradient-to-r from-primary-500 to-primary-600 text-white border-2 border-primary-300 hover:from-primary-600 hover:to-primary-700',
  secondary:
    'bg-gradient-to-r from-dark-surface-2 to-dark-surface-3 text-dark-text-primary border-2 border-dark-text-tertiary hover:from-dark-surface-3 hover:to-dark-bg',
  danger:
    'bg-gradient-to-r from-red-600 to-red-700 text-white border-2 border-red-400 hover:from-red-700 hover:to-red-800',
  success:
    'bg-gradient-to-r from-green-600 to-green-700 text-white border-2 border-green-400 hover:from-green-700 hover:to-green-800',
  ghost:
    'bg-transparent text-primary-500 border-2 border-primary-500 hover:bg-primary-500 hover:bg-opacity-10',
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-3 py-1 text-sm rounded-md',
  md: 'px-5 py-2.5 text-base rounded-lg',
  lg: 'px-7 py-3 text-lg rounded-xl',
};

export function ArcadeButton({
  variant = 'primary',
  size = 'md',
  children,
  icon,
  fullWidth = false,
  glow = true,
  className = '',
  ...props
}: ArcadeButtonProps) {
  const theme = useTheme();

  const glowColor =
    variant === 'primary'
      ? theme.colors.primary.main
      : variant === 'danger'
        ? theme.colors.accent.red
        : variant === 'success'
          ? theme.colors.semantic.success
          : theme.colors.primary.main;

  return (
    <button
      className={`
        font-bold transition-all duration-300 transform hover:scale-105 active:scale-95
        flex items-center justify-center gap-2 uppercase tracking-wider
        ${variantStyles[variant]} ${sizeStyles[size]} ${fullWidth ? 'w-full' : ''} ${className}
      `}
      style={{
        boxShadow: glow
          ? `0 0 20px ${glowColor}80, 0 0 40px ${glowColor}40, inset 0 1px 0 rgba(255,255,255,0.2)`
          : '0 2px 8px rgba(0,0,0,0.3)',
        textShadow: `0 0 10px ${glowColor}40`,
      }}
      {...props}
    >
      {icon && <span className="text-xl">{icon}</span>}
      <span>{children}</span>
    </button>
  );
}
