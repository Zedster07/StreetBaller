/**
 * Theme System - Central Export
 * 
 * This file aggregates all theme-related exports for easy access across the app
 */

export {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
  transitions,
  breakpoints,
  zIndex,
  componentTokens,
  default as tokens,
} from './tokens';

export {
  useTheme,
  getColorByPath,
  useCSSVariable,
  getComponentTokens,
  tailwindFromTokens,
  pxToRem,
  remToPx,
  getSpacing,
  getFontSize,
  createBreakpoint,
  getShadow,
  getTransition,
  getBorderRadius,
  getZIndex,
  createGradient,
  lightenColor,
  darkenColor,
} from './utils';

// Default export
import tokens from './tokens';
export default tokens;
