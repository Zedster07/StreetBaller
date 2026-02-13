import type { Config } from 'tailwindcss';
import { colors, spacing, typography, borderRadius, shadows, transitions } from './src/theme/tokens';

const config: Config = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Primary brand color
        primary: colors.primary,

        // Neon colors
        neon: {
          green: '#00FF88',
          cyan: '#00FFFF',
          purple: '#BF00FF',
          pink: '#FF00FF',
        },
        
        // Accent colors
        gold: {
          DEFAULT: colors.accent.gold,
          50: '#FFFEF5',
          500: colors.accent.gold,
          600: colors.accent.goldDark,
        },
        purple: {
          DEFAULT: colors.accent.purple,
          500: colors.accent.purple,
          600: colors.accent.purpleDark,
        },
        orange: {
          DEFAULT: colors.accent.orange,
          500: colors.accent.orange,
          600: colors.accent.orangeDark,
        },
        red: {
          DEFAULT: colors.accent.red,
          500: colors.accent.red,
          600: colors.accent.redDark,
        },

        // Neutral palette
        neutral: colors.neutral,

        // Dark mode base colors
        dark: {
          bg: colors.darkMode.background,
          surface: {
            1: colors.darkMode.surface1,
            2: colors.darkMode.surface2,
            3: colors.darkMode.surface3,
          },
          text: {
            primary: colors.darkMode.textPrimary,
            secondary: colors.darkMode.textSecondary,
            tertiary: colors.darkMode.textTertiary,
          },
          border: colors.darkMode.border,
        },

        // Semantic colors
        success: colors.semantic.success,
        warning: colors.semantic.warning,
        error: colors.semantic.error,
        info: colors.semantic.info,
      },

      fontFamily: {
        display: typography.fontFamily.display,
        body: typography.fontFamily.body,
        mono: typography.fontFamily.mono,
      },

      fontSize: typography.fontSize,

      fontWeight: typography.fontWeight,

      lineHeight: typography.lineHeight,

      spacing,

      borderRadius,

      boxShadow: shadows,

      transitionDuration: {
        fast: transitions.fast.duration,
        normal: transitions.normal.duration,
        slow: transitions.slow.duration,
      },

      transitionTimingFunction: {
        'ease-smooth': transitions.fast.timing,
      },

      backgroundColor: {
        // Dark mode defaults
        base: colors.darkMode.background,
        surface: colors.darkMode.surface1,
      },

      textColor: {
        base: colors.darkMode.textPrimary,
        secondary: colors.darkMode.textSecondary,
      },

      borderColor: {
        base: colors.darkMode.border,
      },

      screens: {
        xs: '320px',
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1536px',
      },
    },
  },
  plugins: [
    // Custom plugin for additional dark mode utilities
    function ({ addBase, addUtilities }) {
      addBase({
        ':root': {
          // Color CSS Variables
          '--color-primary': colors.primary.main,
          '--color-primary-dark': colors.primary.dark,
          '--color-gold': colors.accent.gold,
          '--color-purple': colors.accent.purple,
          '--color-orange': colors.accent.orange,
          '--color-red': colors.accent.red,

          // Dark mode colors
          '--bg-primary': colors.darkMode.background,
          '--bg-surface': colors.darkMode.surface1,
          '--text-primary': colors.darkMode.textPrimary,
          '--text-secondary': colors.darkMode.textSecondary,

          // Spacing
          '--spacing-xs': spacing.xs,
          '--spacing-sm': spacing.sm,
          '--spacing-md': spacing.md,
          '--spacing-lg': spacing.lg,
          '--spacing-xl': spacing.xl,

          // Transitions
          '--transition-fast': `${transitions.fast.duration} ${transitions.fast.timing}`,
          '--transition-normal': `${transitions.normal.duration} ${transitions.normal.timing}`,
          '--transition-slow': `${transitions.slow.duration} ${transitions.slow.timing}`,
        },
      });

      addUtilities({
        // Custom heading utilities based on design system
        '.heading-h1': {
          fontSize: typography.heading.h1.fontSize,
          fontWeight: typography.heading.h1.fontWeight,
          lineHeight: typography.heading.h1.lineHeight,
          letterSpacing: typography.heading.h1.letterSpacing,
        },
        '.heading-h2': {
          fontSize: typography.heading.h2.fontSize,
          fontWeight: typography.heading.h2.fontWeight,
          lineHeight: typography.heading.h2.lineHeight,
          letterSpacing: typography.heading.h2.letterSpacing,
        },
        '.heading-h3': {
          fontSize: typography.heading.h3.fontSize,
          fontWeight: typography.heading.h3.fontWeight,
          lineHeight: typography.heading.h3.lineHeight,
        },
        '.heading-h4': {
          fontSize: typography.heading.h4.fontSize,
          fontWeight: typography.heading.h4.fontWeight,
          lineHeight: typography.heading.h4.lineHeight,
        },
        '.heading-h5': {
          fontSize: typography.heading.h5.fontSize,
          fontWeight: typography.heading.h5.fontWeight,
          lineHeight: typography.heading.h5.lineHeight,
        },
        '.heading-h6': {
          fontSize: typography.heading.h6.fontSize,
          fontWeight: typography.heading.h6.fontWeight,
          lineHeight: typography.heading.h6.lineHeight,
        },

        // Body text utilities
        '.body-large': {
          fontSize: typography.body.large.fontSize,
          fontWeight: typography.body.large.fontWeight,
          lineHeight: typography.body.large.lineHeight,
        },
        '.body-regular': {
          fontSize: typography.body.regular.fontSize,
          fontWeight: typography.body.regular.fontWeight,
          lineHeight: typography.body.regular.lineHeight,
        },
        '.body-small': {
          fontSize: typography.body.small.fontSize,
          fontWeight: typography.body.small.fontWeight,
          lineHeight: typography.body.small.lineHeight,
        },
        '.body-tiny': {
          fontSize: typography.body.tiny.fontSize,
          fontWeight: typography.body.tiny.fontWeight,
          lineHeight: typography.body.tiny.lineHeight,
        },

        // Label utilities
        '.label-large': {
          fontSize: typography.label.large.fontSize,
          fontWeight: typography.label.large.fontWeight,
          lineHeight: typography.label.large.lineHeight,
        },
        '.label-regular': {
          fontSize: typography.label.regular.fontSize,
          fontWeight: typography.label.regular.fontWeight,
          lineHeight: typography.label.regular.lineHeight,
        },
        '.label-small': {
          fontSize: typography.label.small.fontSize,
          fontWeight: typography.label.small.fontWeight,
          lineHeight: typography.label.small.lineHeight,
          textTransform: typography.label.small.textTransform,
          letterSpacing: typography.label.small.letterSpacing,
        },

        // Custom shadow utilities
        '.shadow-sm-custom': {
          boxShadow: shadows.sm,
        },
        '.shadow-md-custom': {
          boxShadow: shadows.md,
        },
        '.shadow-lg-custom': {
          boxShadow: shadows.lg,
        },
        '.shadow-xl-custom': {
          boxShadow: shadows.xl,
        },

        // Smooth transitions
        '.transition-fast': {
          transition: `all ${transitions.fast.duration} ${transitions.fast.timing}`,
        },
        '.transition-normal': {
          transition: `all ${transitions.normal.duration} ${transitions.normal.timing}`,
        },
        '.transition-slow': {
          transition: `all ${transitions.slow.duration} ${transitions.slow.timing}`,
        },

        // Dark mode utility
        '.dark-base': {
          backgroundColor: colors.darkMode.background,
          color: colors.darkMode.textPrimary,
        },
        '.dark-surface': {
          backgroundColor: colors.darkMode.surface1,
        },
        '.dark-surface-elevated': {
          backgroundColor: colors.darkMode.surface2,
        },
      });
    },
  ],
};

export default config;
