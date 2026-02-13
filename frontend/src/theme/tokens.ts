/**
 * Design Tokens - Single Source of Truth for StreetBaller Frontend
 * 
 * This file contains all design constants:
 * - Colors (with light/dark variants)
 * - Typography (font families, sizes, weights)
 * - Spacing scale
 * - Border radius values
 * - Shadows
 * - Transitions/animations
 * 
 * To change the design globally, modify values here.
 * No need to change code in components!
 */

// ============================================================================
// COLOR TOKENS
// ============================================================================

export const colors = {
  // Primary Colors
  primary: {
    // Street Neon Green (Updated to match requested style)
    50: '#F0FFF7',
    100: '#D1FFEA',
    200: '#A3FFD6',
    300: '#75FFC2',
    400: '#47FFAE',
    500: '#1BFF94', // Neon Brand Green - Main Action
    600: '#00E676',
    700: '#00C853',
    800: '#00A844',
    900: '#005D2D',
    // Aliases
    main: '#00FF88', // Brighter Neon Green for high contrast
    dark: '#00C853',
    light: '#69FFC4',
  },

  // Neon Palette
  neon: {
    green: '#00FF88',
    cyan: '#00FFFF',
    purple: '#BF00FF',
    pink: '#FF00FF',
    gradient: 'linear-gradient(135deg, #00FF88 0%, #00FFFF 100%)',
  },

  // Accent Colors
  accent: {
    // Victory Gold - Achievements, wins, highlights
    gold: '#FFD700',
    goldLight: '#FFE57F',
    goldDark: '#FFB300',

    // Trust Purple - Reputation metrics, trust points
    purple: '#D500F9',
    purpleLight: '#E040FB',
    purpleDark: '#AA00FF',

    // Energy Orange - Active states, urgency, challenges
    orange: '#FF6D00',
    orangeLight: '#FF9E80',
    orangeDark: '#DD2C00',

    // Caution Red - Disputes, warnings, penalties
    red: '#FF1744',
    redLight: '#FF8A80',
    redDark: '#D50000',
  },

  // Neutral Colors
  neutral: {
    50: '#FAFAFA',
    100: '#F5F5F5',
    200: '#EEEEEE',
    300: '#E0E0E0',
    400: '#BDBDBD',
    500: '#9E9E9E',
    600: '#757575',
    700: '#616161',
    800: '#424242',
    900: '#212121',
  },

  // Dark Mode Colors (Primary Theme)
  darkMode: {
    background: '#0F1115', // Deep dark blue-black
    surface1: 'rgba(255, 255, 255, 0.05)', // Glassmorphism base
    surface2: 'rgba(255, 255, 255, 0.08)', // Elevated
    surface3: 'rgba(255, 255, 255, 0.12)', // Higher elevation
    textPrimary: '#FFFFFF',
    textSecondary: '#A0AEC0',
    textTertiary: '#718096',
    border: 'rgba(255, 255, 255, 0.08)',
  },

  // Light Mode Colors (Fallback)
  lightMode: {
    background: '#FFFFFF',
    surface1: '#F5F5F5',
    surface2: '#EEEEEE',
    surface3: '#E8E8E8',
    textPrimary: '#212121',
    textSecondary: '#757575',
    textTertiary: '#9E9E9E',
    border: '#E0E0E0',
  },

  // Semantic Colors (Context-dependent)
  semantic: {
    success: '#00FF88', // Use neon green for success
    warning: '#FFD700',
    error: '#FF1744',
    info: '#00FFFF',
  },
};

// ============================================================================
// TYPOGRAPHY TOKENS
// ============================================================================

export const typography = {
  // Font Families
  fontFamily: {
    display: "'Inter', 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    body: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif",
    mono: "'Monaco', 'Courier New', monospace",
  },

  // Font Sizes (in rem, relative to 16px base)
  fontSize: {
    xs: '0.75rem', // 12px
    sm: '0.875rem', // 14px
    base: '1rem', // 16px
    lg: '1.125rem', // 18px
    xl: '1.25rem', // 20px
    '2xl': '1.5rem', // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem', // 36px (H3)
    '5xl': '3rem', // 48px (H2)
    '6xl': '3.75rem', // 60px
    '7xl': '4.5rem', // 72px (H1)
  },

  // Font Weights
  fontWeight: {
    thin: 100,
    extralight: 200,
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
    black: 900,
  },

  // Line Heights
  lineHeight: {
    none: 1,
    tight: 1.25,
    snug: 1.375,
    normal: 1.5,
    relaxed: 1.625,
    loose: 2,
  },

  // Heading Styles (predefined combinations)
  heading: {
    h1: {
      fontSize: '3.75rem', // 60px
      fontWeight: 700,
      lineHeight: 1.2,
      letterSpacing: '-0.01em',
    },
    h2: {
      fontSize: '3rem', // 48px
      fontWeight: 600,
      lineHeight: 1.2,
      letterSpacing: '-0.005em',
    },
    h3: {
      fontSize: '2.25rem', // 36px
      fontWeight: 600,
      lineHeight: 1.2,
    },
    h4: {
      fontSize: '1.875rem', // 30px
      fontWeight: 600,
      lineHeight: 1.3,
    },
    h5: {
      fontSize: '1.5rem', // 24px
      fontWeight: 600,
      lineHeight: 1.3,
    },
    h6: {
      fontSize: '1.25rem', // 20px
      fontWeight: 600,
      lineHeight: 1.4,
    },
  },

  // Body Text Styles
  body: {
    large: {
      fontSize: '1.125rem', // 18px
      fontWeight: 400,
      lineHeight: 1.5,
    },
    regular: {
      fontSize: '1rem', // 16px
      fontWeight: 400,
      lineHeight: 1.5,
    },
    small: {
      fontSize: '0.875rem', // 14px
      fontWeight: 400,
      lineHeight: 1.4,
    },
    tiny: {
      fontSize: '0.75rem', // 12px
      fontWeight: 400,
      lineHeight: 1.4,
    },
  },

  // Label/Caption Styles
  label: {
    large: {
      fontSize: '1rem', // 16px
      fontWeight: 500,
      lineHeight: 1.4,
    },
    regular: {
      fontSize: '0.875rem', // 14px
      fontWeight: 500,
      lineHeight: 1.4,
    },
    small: {
      fontSize: '0.75rem', // 12px
      fontWeight: 600,
      lineHeight: 1.3,
      textTransform: 'uppercase',
      letterSpacing: '0.05em',
    },
  },
};

// ============================================================================
// SPACING TOKENS
// ============================================================================

export const spacing = {
  0: '0px',
  xs: '0.25rem', // 4px
  sm: '0.5rem', // 8px
  md: '0.75rem', // 12px
  lg: '1rem', // 16px
  xl: '1.5rem', // 24px
  '2xl': '2rem', // 32px
  '3xl': '2.5rem', // 40px
  '4xl': '3rem', // 48px
  '5xl': '3.5rem', // 56px
  '6xl': '4rem', // 64px
};

// ============================================================================
// BORDER RADIUS TOKENS
// ============================================================================

export const borderRadius = {
  none: '0px',
  sm: '0.25rem', // 4px - small components
  md: '0.5rem', // 8px - buttons, inputs
  lg: '0.75rem', // 12px - cards, panels
  xl: '1rem', // 16px - containers
  full: '9999px', // Pill-shaped buttons, avatars
};

// ============================================================================
// SHADOW TOKENS
// ============================================================================

export const shadows = {
  none: 'none',
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.05)',
};

// ============================================================================
// TRANSITION TOKENS
// ============================================================================

export const transitions = {
  fast: {
    duration: '0.15s',
    timing: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },
  normal: {
    duration: '0.3s',
    timing: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },
  slow: {
    duration: '0.5s',
    timing: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },
};

// ============================================================================
// BREAKPOINTS
// ============================================================================

export const breakpoints = {
  xs: '320px',
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
};

// ============================================================================
// Z-INDEX TOKENS
// ============================================================================

export const zIndex = {
  auto: 'auto',
  hide: -1,
  base: 0,
  dropdown: 1000,
  sticky: 1100,
  fixed: 1200,
  modal: 1300,
  popover: 1400,
  tooltip: 1500,
};

// ============================================================================
// COMPONENT-SPECIFIC TOKENS (for easy reference)
// ============================================================================

export const componentTokens = {
  // Button tokens
  button: {
    primary: {
      bg: colors.primary.main,
      bgHover: colors.primary.dark,
      bgActive: colors.primary[700],
      text: '#FFFFFF',
      border: 'transparent',
    },
    secondary: {
      bg: colors.darkMode.surface1,
      bgHover: colors.darkMode.surface2,
      text: colors.darkMode.textPrimary,
      border: colors.darkMode.border,
    },
    danger: {
      bg: colors.accent.red,
      bgHover: colors.accent.redDark,
      text: '#FFFFFF',
    },
    success: {
      bg: colors.semantic.success,
      bgHover: '#388E3C',
      text: '#FFFFFF',
    },
  },

  // Input tokens
  input: {
    bg: colors.darkMode.surface1,
    border: colors.darkMode.border,
    borderHover: colors.darkMode.surface2,
    borderFocus: colors.primary.main,
    text: colors.darkMode.textPrimary,
    placeholder: colors.darkMode.textTertiary,
  },

  // Card tokens
  card: {
    bg: colors.darkMode.surface1,
    border: colors.darkMode.border,
    shadow: shadows.md,
  },

  // Alert tokens
  alert: {
    success: {
      bg: 'rgba(76, 175, 80, 0.1)',
      text: '#66BB6A',
      border: '#66BB6A',
    },
    error: {
      bg: 'rgba(244, 67, 54, 0.1)',
      text: '#EF5350',
      border: '#EF5350',
    },
    warning: {
      bg: 'rgba(255, 152, 0, 0.1)',
      text: '#FFB74D',
      border: '#FFB74D',
    },
    info: {
      bg: 'rgba(33, 150, 243, 0.1)',
      text: '#64B5F6',
      border: '#64B5F6',
    },
  },

  // Badge tokens
  badge: {
    trust: {
      bg: colors.accent.purple,
      text: '#FFFFFF',
    },
    gold: {
      bg: colors.accent.gold,
      text: '#000000',
    },
    status: {
      confirmed: colors.semantic.success,
      pending: colors.accent.orange,
      disputed: colors.accent.red,
    },
  },
};

/**
 * Export everything as default for convenience
 */
export default {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
  transitions,
  breakpoints,
  zIndex,
  componentTokens,
};
