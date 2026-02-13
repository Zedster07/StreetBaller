/**
 * Theme Utility Functions & Hooks
 * 
 * Provides helper functions and React hooks for working with design tokens
 * in components across the application.
 */

import { useMemo } from 'react';
import tokens from './tokens';

/**
 * useTheme Hook - Access all design tokens in React components
 * 
 * Usage:
 * const theme = useTheme();
 * const primaryColor = theme.colors.primary.main;
 */
export const useTheme = () => {
  return useMemo(() => tokens, []);
};

/**
 * Helper function to get color by path (e.g., 'primary.main', 'accent.gold')
 */
export const getColorByPath = (path: string, defaultColor = '#1B5E20'): string => {
  const parts = path.split('.');
  let current: any = tokens.colors;

  for (const part of parts) {
    if (current[part] === undefined) {
      return defaultColor;
    }
    current = current[part];
  }

  return current;
};

/**
 * Respond to CSS variable changes dynamically
 * 
 * Usage:
 * const primaryColor = useCSSVariable('--color-primary');
 */
export const useCSSVariable = (variableName: string): string => {
  return useMemo(() => {
    if (typeof window === 'undefined') return '';
    const value = getComputedStyle(document.documentElement)
      .getPropertyValue(variableName)
      .trim();
    return value || '';
  }, [variableName]);
};

/**
 * Helper function to apply component-specific token sets
 * 
 * Usage:
 * const buttonStyles = getComponentTokens('button.primary');
 */
export const getComponentTokens = (componentPath: string): Record<string, any> => {
  const parts = componentPath.split('.');
  let current: any = tokens.componentTokens;

  for (const part of parts) {
    if (current[part] === undefined) {
      return {};
    }
    current = current[part];
  }

  return current;
};

/**
 * Create a string of Tailwind classes from a token object
 * 
 * This is useful for converting token values to Tailwind utility classes
 */
export const tailwindFromTokens = (tokenObject: Record<string, any>): string[] => {
  const classes: string[] = [];

  for (const [key, value] of Object.entries(tokenObject)) {
    if (typeof value === 'string') {
      // Try to match to known Tailwind patterns
      if (key === 'bg' || key === 'backgroundColor') {
        classes.push(`bg-[${value}]`);
      } else if (key === 'text' || key === 'textColor' || key === 'color') {
        classes.push(`text-[${value}]`);
      } else if (key === 'border' || key === 'borderColor') {
        classes.push(`border-[${value}]`);
      }
    }
  }

  return classes;
};

/**
 * Convert pixel values to rem (for consistency with design system)
 */
export const pxToRem = (px: number, base = 16): number => {
  return px / base;
};

/**
 * Convert rem values to pixel
 */
export const remToPx = (rem: number, base = 16): number => {
  return rem * base;
};

/**
 * Get spacing value by scale name
 * 
 * Usage:
 * const padding = getSpacing('lg'); // Returns '1rem'
 */
export const getSpacing = (scale: keyof typeof tokens.spacing): string => {
  return tokens.spacing[scale];
};

/**
 * Get font size by scale name with proper type checking
 * 
 * Usage:
 * const size = getFontSize('2xl'); // Returns '1.5rem'
 */
export const getFontSize = (scale: keyof typeof tokens.typography.fontSize): string => {
  return tokens.typography.fontSize[scale];
};

/**
 * Create responsive breakpoint media queries
 * 
 * Usage:
 * const mobileFirst = createBreakpoint('md');
 * // Returns: '@media (min-width: 768px)'
 */
export const createBreakpoint = (breakpoint: keyof typeof tokens.breakpoints): string => {
  return `@media (min-width: ${tokens.breakpoints[breakpoint]})`;
};

/**
 * Get shadow value by intensity
 * 
 * Usage:
 * const shadow = getShadow('lg');
 */
export const getShadow = (intensity: keyof typeof tokens.shadows): string => {
  return tokens.shadows[intensity];
};

/**
 * Get transition value as CSS string
 * 
 * Usage:
 * const transition = getTransition('normal');
 * // Returns: '0.3s cubic-bezier(0.4, 0, 0.2, 1)'
 */
export const getTransition = (speed: keyof typeof tokens.transitions): string => {
  const { duration, timing } = tokens.transitions[speed as keyof typeof tokens.transitions];
  return `${duration} ${timing}`;
};

/**
 * Get border radius by scale name
 * 
 * Usage:
 * const radius = getBorderRadius('lg');
 */
export const getBorderRadius = (scale: keyof typeof tokens.borderRadius): string => {
  return tokens.borderRadius[scale];
};

/**
 * Get z-index value by layer
 * 
 * Usage:
 * const zIndex = getZIndex('modal');
 */
export const getZIndex = (layer: keyof typeof tokens.zIndex): string | number => {
  return tokens.zIndex[layer];
};

/**
 * Create a linear gradient using theme colors
 * 
 * Usage:
 * const gradient = createGradient('primary', 'gold');
 * // Returns: 'linear-gradient(135deg, #1B5E20, #FFB300)'
 */
export const createGradient = (
  from: string,
  to: string,
  angle = 135
): string => {
  const fromColor = getColorByPath(from) || from;
  const toColor = getColorByPath(to) || to;
  return `linear-gradient(${angle}deg, ${fromColor}, ${toColor})`;
};

/**
 * Lighten a color by a percentage
 */
export const lightenColor = (color: string, percent: number): string => {
  // This is a simple implementation - for production, use a color library
  const num = parseInt(color.replace('#', ''), 16);
  const amt = Math.round(2.55 * percent);
  const R = Math.min(255, (num >> 16) + amt);
  const G = Math.min(255, (num >> 8) & 0x00FF);
  const B = Math.min(255, (num & 0x0000FF) + amt);
  return `#${(0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1)}`;
};

/**
 * Darken a color by a percentage
 */
export const darkenColor = (color: string, percent: number): string => {
  return lightenColor(color, -percent);
};

export default tokens;
