# Frontend Theme System Documentation

## Overview

The StreetBaller frontend features a **production-grade, centralized design system** that manages all design tokens (colors, typography, spacing, shadows, etc.) from a single source of truth. This architecture ensures:

✅ **Global design consistency** - Change colors once, update everywhere  
✅ **Zero design drift** - All components use the same tokens  
✅ **Type-safe design** - Full TypeScript support for design tokens  
✅ **Easy maintenance** - One file (`tokens.ts`) controls all design  
✅ **Developer experience** - Intuitive API with multiple usage patterns  
✅ **Production-ready** - Optimized for performance, accessibility, and scalability  

## Architecture

```
Theme System Architecture
├── src/theme/
│   ├── tokens.ts          ← All design tokens (single source of truth)
│   ├── utils.ts           ← Helper functions & React hooks
│   └── index.ts           ← Central export file
├── src/styles/
│   └── globals.css        ← CSS variables + base styles
├── tailwind.config.ts     ← Tailwind config (uses tokens)
├── postcss.config.js      ← CSS processing
└── App.tsx                ← Demo component showing theme usage
```

## How It Works

### 1. Design Tokens Definition (`tokens.ts`)

All design constants are defined as TypeScript objects:

```typescript
export const colors = {
  primary: { main: '#1B5E20', dark: '#0D3817', ... },
  accent: { gold: '#FFB300', purple: '#9C27B0', ... },
  darkMode: { background: '#121212', ... },
  // ... more tokens
}

export const typography = {
  fontFamily: { display: 'Poppins', body: 'Inter', ... },
  fontSize: { xs: '0.75rem', sm: '0.875rem', ... },
  heading: { h1: { fontSize: '3.75rem', fontWeight: 700, ... }, ... },
  // ... more tokens
}

export const spacing = {
  xs: '0.25rem', sm: '0.5rem', md: '0.75rem', lg: '1rem', // ... more
}

// ... plus borderRadius, shadows, transitions, breakpoints, zIndex
```

### 2. CSS Variables (`globals.css`)

Tokens are converted to CSS variables for dynamic theming:

```css
:root {
  --color-primary: #1B5E20;
  --color-gold: #FFB300;
  --bg-primary: #121212;
  --text-primary: #FFFFFF;
  --spacing-lg: 1rem;
  --font-size-2xl: 1.5rem;
  /* ... more variables */
}
```

**Benefits:**
- Can be changed dynamically (e.g., theme switching at runtime)
- Accessible in vanilla CSS, CSS-in-JS, and Tailwind
- Works with browser DevTools CSS inspector

### 3. Tailwind Configuration (`tailwind.config.ts`)

Tailwind is configured to use the tokens:

```typescript
theme: {
  extend: {
    colors: colors,           // Primary colors
    fontSize: typography.fontSize,
    spacing: spacing,
    borderRadius: borderRadius,
    boxShadow: shadows,
    // ... more
  }
}
```

**Result:** Tailwind utility classes automatically get design token values
- `bg-primary-500` → `backgroundColor: #1B5E20`
- `text-2xl` → `fontSize: 1.5rem`
- `p-lg` → `padding: 1rem`
- `shadow-xl` → `boxShadow: ...`

### 4. React Hooks (`utils.ts`)

TypeScript-first utilities for working with tokens in React:

```typescript
const theme = useTheme();
const color = getColorByPath('primary.main');
const shadow = getShadow('lg');
const padding = getSpacing('xl');
```

## Usage Patterns

### Pattern 1: Tailwind Classes (Recommended) ⭐

```tsx
<div className="bg-primary-500 text-white p-lg rounded-lg shadow-md">
  <h1 className="heading-h3">Title</h1>
  <p className="body-regular">Body text</p>
</div>
```

**Advantages:**
- Most performant (pure CSS)
- Best IDE support
- Easiest to read
- Consistent with Tailwind ecosystem

### Pattern 2: CSS Variables

```tsx
<div style={{
  backgroundColor: 'var(--color-primary)',
  padding: 'var(--spacing-lg)',
  color: 'var(--text-primary)',
}}>
  Content
</div>
```

**Advantages:**
- Dynamic theming support
- Works with CSS-in-JS libraries
- Cleaner than inline colors

### Pattern 3: React Hooks

```tsx
import { useTheme, getShadow } from '@/theme';

export function MyComponent() {
  const theme = useTheme();
  return (
    <div style={{
      color: theme.colors.primary.main,
      boxShadow: getShadow('lg'),
    }}>
      Content
    </div>
  );
}
```

**Advantages:**
- Full TypeScript type checking
- Programmatic theme access
- Good for complex logic

### Pattern 4: Tailwind Arbitrary Values

```tsx
<div className="bg-[#1B5E20] shadow-[0_10px_15px_rgba(0,0,0,0.1)]">
  Content
</div>
```

**Advantages:**
- Works for one-off values
- No need to update tokens
- But prefer tokens for consistency!

## Design Tokens Reference

### Colors

```typescript
colors = {
  // Primary Brand Color
  primary: {
    main: '#1B5E20',     // Pitch Green (main color)
    dark: '#0D3817',     // Darker variant
    light: '#2E7D32',    // Lighter variant
    50: '#F1F5F1', ... 900: '#051B06'  // Full range (50-900)
  },

  // Accent Colors
  accent: {
    gold: '#FFB300',      // Victory Gold (wins, achievements)
    purple: '#9C27B0',    // Trust Purple (reputation)
    orange: '#FF6F00',    // Energy Orange (urgency, challenges)
    red: '#D32F2F',       // Caution Red (disputes, warnings)
  },

  // Dark Mode (Default)
  darkMode: {
    background: '#121212',
    surface1: '#1E1E1E',  // Cards, panels
    surface2: '#242424',  // Elevated elements
    surface3: '#2A2A2A',  // Higher elevation
    textPrimary: '#FFFFFF',
    textSecondary: '#B0B0B0',
    textTertiary: '#808080',
    border: '#333333',
  },

  // Semantic Colors
  semantic: {
    success: '#4CAF50',
    warning: '#FF9800',
    error: '#F44336',
    info: '#2196F3',
  },
}
```

**Usage:**
- Tailwind: `bg-primary-500`, `text-gold`, `border-purple`
- CSS: `background: var(--color-primary)`, `color: var(--text-primary)`
- React: `theme.colors.primary.main`, `theme.colors.accent.gold`

### Typography

```typescript
typography = {
  // Font Families
  fontFamily: {
    display: 'Poppins',   // For headings
    body: 'Inter',        // For body text
    mono: 'Monaco',       // For code
  },

  // Font Sizes
  fontSize: {
    xs: '0.75rem',    // 12px
    sm: '0.875rem',   // 14px
    base: '1rem',     // 16px
    lg: '1.125rem',   // 18px
    xl: '1.25rem',    // 20px
    '2xl': '1.5rem',  // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem', // 36px
    '5xl': '3rem',    // 48px
    '6xl': '3.75rem', // 60px
    '7xl': '4.5rem',  // 72px
  },

  // Font Weights
  fontWeight: {
    thin: 100,
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    black: 900,
  },

  // Heading Styles (pre-defined combinations)
  heading: {
    h1: { fontSize: '3.75rem', fontWeight: 700, lineHeight: 1.2, letterSpacing: '-0.01em' },
    h2: { fontSize: '3rem', fontWeight: 600, lineHeight: 1.2, letterSpacing: '-0.005em' },
    h3: { fontSize: '2.25rem', fontWeight: 600, lineHeight: 1.2 },
    h4: { fontSize: '1.875rem', fontWeight: 600, lineHeight: 1.3 },
    h5: { fontSize: '1.5rem', fontWeight: 600, lineHeight: 1.3 },
    h6: { fontSize: '1.25rem', fontWeight: 600, lineHeight: 1.4 },
  },

  // Body Text Styles
  body: {
    large: { fontSize: '1.125rem', fontWeight: 400, lineHeight: 1.5 },
    regular: { fontSize: '1rem', fontWeight: 400, lineHeight: 1.5 },
    small: { fontSize: '0.875rem', fontWeight: 400, lineHeight: 1.4 },
    tiny: { fontSize: '0.75rem', fontWeight: 400, lineHeight: 1.4 },
  },

  // Label Styles
  label: {
    large: { fontSize: '1rem', fontWeight: 500, lineHeight: 1.4 },
    regular: { fontSize: '0.875rem', fontWeight: 500, lineHeight: 1.4 },
    small: { fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' },
  },
}
```

**Usage:**
- Tailwind: `text-6xl`, `text-4xl`, `font-bold`, `heading-h1`, `body-regular`
- CSS: `font-family: var(--font-body)`, `font-size: var(--font-size-2xl)`
- React: `theme.typography.heading.h1`, `theme.typography.fontSize.xl`

### Spacing

Consistent 4px-based spacing scale:

```typescript
spacing = {
  0: '0px',
  xs: '0.25rem',   // 4px
  sm: '0.5rem',    // 8px
  md: '0.75rem',   // 12px
  lg: '1rem',      // 16px
  xl: '1.5rem',    // 24px
  '2xl': '2rem',   // 32px
  '3xl': '2.5rem', // 40px
  '4xl': '3rem',   // 48px
  '5xl': '3.5rem', // 56px
  '6xl': '4rem',   // 64px
}
```

**Usage:**
- Tailwind: `p-lg`, `m-xl`, `gap-sm`, `space-y-md`
- CSS: `padding: var(--spacing-lg)`, `margin: var(--spacing-xl)`
- React: `getSpacing('lg')` → `'1rem'`

### Border Radius

```typescript
borderRadius = {
  none: '0px',
  sm: '0.25rem',   // 4px - small components (inputs, badges)
  md: '0.5rem',    // 8px - buttons, controls
  lg: '0.75rem',   // 12px - cards, panels
  xl: '1rem',      // 16px - containers, dialogs
  full: '9999px',  // Pill-shaped buttons, avatars
}
```

**Usage:**
- Tailwind: `rounded-sm`, `rounded-lg`, `rounded-full`
- CSS: `border-radius: var(--radius-lg)`

### Shadows

Predefined shadow levels for depth:

```typescript
shadows = {
  none: 'none',
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.05)',
}
```

**Usage:**
- Tailwind: `shadow-md`, `shadow-lg`, `shadow-xl`
- CSS: `box-shadow: var(--shadow-lg)`
- React: `getShadow('lg')`

### Transitions

Smooth animation timings:

```typescript
transitions = {
  fast: { duration: '0.15s', timing: 'cubic-bezier(0.4, 0, 0.2, 1)' },
  normal: { duration: '0.3s', timing: 'cubic-bezier(0.4, 0, 0.2, 1)' },
  slow: { duration: '0.5s', timing: 'cubic-bezier(0.4, 0, 0.2, 1)' },
}
```

**Usage:**
- Tailwind: `transition-fast`, `transition-normal`, `transition-slow`
- CSS: `transition: all var(--transition-normal)`
- React: `getTransition('normal')`

## Making Global Design Changes

### Scenario 1: Change Primary Color

**File:** `src/theme/tokens.ts`

```typescript
// Before
colors = {
  primary: {
    main: '#1B5E20',    // Pitch Green
    // ...
  }
}

// After - Change to completely different color
colors = {
  primary: {
    main: '#0066FF',    // New blue
    dark: '#0052CC',
    light: '#3385FF',
    // ... update all shades
  }
}
```

**Result:** Every button, link, heading, and component using `bg-primary-500` or `--color-primary` instantly changes! ✨

### Scenario 2: Change Font Stack

**File:** `src/theme/tokens.ts`

```typescript
// Before
fontFamily = {
  display: 'Poppins',   // Poppins for headings
  body: 'Inter',        // Inter for body
}

// After
fontFamily = {
  display: 'Proxima Nova',  // New heading font
  body: 'Georgia',          // New body font
}
```

**Result:** All headings switch to Proxima Nova, all body text switches to Georgia. One change, entire app updated!

### Scenario 3: Change Spacing Scale

**File:** `src/theme/tokens.ts`

```typescript
// Before (4px-based)
spacing = {
  xs: '0.25rem',    // 4px
  sm: '0.5rem',     // 8px
  md: '0.75rem',    // 12px
  // ...
}

// After (8px-based for larger spacing)
spacing = {
  xs: '0.5rem',     // 8px
  sm: '1rem',       // 16px
  md: '1.5rem',     // 24px
  // ...
}
```

**Result:** All padding, margins, gaps instantly adjust to the new spacing scale!

### Scenario 4: Update Dark Mode Colors

**File:** `src/theme/tokens.ts`

```typescript
darkMode = {
  background: '#000000',    // Pure black instead of #121212
  surface1: '#1A1A1A',
  // ...
}
```

**Result:** Entire application background changes. One file edit, everything updates!

## Component-Specific Tokens

Pre-configured token sets for common component patterns:

```typescript
componentTokens = {
  // Button tokens
  button: {
    primary: {
      bg: '#1B5E20',
      bgHover: '#0D3817',
      text: '#FFFFFF',
    },
    secondary: { ... },
    danger: { ... },
  },

  // Input tokens
  input: {
    bg: '#1E1E1E',
    border: '#333333',
    borderFocus: '#1B5E20',
    text: '#FFFFFF',
  },

  // Card tokens
  card: {
    bg: '#1E1E1E',
    border: '#333333',
    shadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  },

  // Alert tokens
  alert: {
    success: { bg: 'rgba(76, 175, 80, 0.1)', text: '#66BB6A' },
    error: { bg: 'rgba(244, 67, 54, 0.1)', text: '#EF5350' },
  },
}
```

**Usage in components:**
```typescript
const { bg, text } = componentTokens.button.primary;
```

## Utility Functions

Helper functions for working with tokens in components:

```typescript
// Get all theme tokens
const theme = useTheme();
const primaryColor = theme.colors.primary.main;

// Get color by path string
const color = getColorByPath('accent.gold');      // '#FFB300'
const color = getColorByPath('darkMode.surface1'); // '#1E1E1E'

// Get specific token values
const padding = getSpacing('lg');              // '1rem'
const fontSize = getFontSize('2xl');           // '1.5rem'
const shadow = getShadow('md');
const transition = getTransition('normal');    // '0.3s cubic-bezier(...)'

// Work with breakpoints
const mediaMd = createBreakpoint('md');        // '@media (min-width: 768px)'

// Color manipulation
const lightGreen = lightenColor('#1B5E20', 20); // Lighter green
const darkGreen = darkenColor('#1B5E20', 20);   // Darker green

// Create gradients
const gradient = createGradient('primary', 'gold'); // 'linear-gradient(135deg, #1B5E20, #FFB300)'

// Unit conversion
const remValue = pxToRem(32, 16);              // 2
const pxValue = remToPx(2, 16);                // 32
```

## CSS Variables Reference

Complete list of CSS variables available for styling:

```css
/* COLORS */
--color-primary, --color-primary-dark, --color-primary-light
--color-gold, --color-gold-light, --color-gold-dark
--color-purple, --color-purple-light, --color-purple-dark
--color-orange, --color-orange-light, --color-orange-dark
--color-red, --color-red-light, --color-red-dark
--color-success, --color-warning, --color-error, --color-info

/* DARK MODE */
--bg-primary, --bg-surface-1, --bg-surface-2, --bg-surface-3
--text-primary, --text-secondary, --text-tertiary
--border-color

/* TYPOGRAPHY */
--font-display, --font-body, --font-mono
--font-size-xs, --font-size-sm, --font-size-base, ... --font-size-6xl

/* SPACING */
--spacing-0, --spacing-xs, --spacing-sm, --spacing-md, --spacing-lg, ... --spacing-6xl

/* RADIUS */
--radius-none, --radius-sm, --radius-md, --radius-lg, --radius-xl, --radius-full

/* SHADOWS */
--shadow-sm, --shadow-md, --shadow-lg, --shadow-xl, --shadow-2xl

/* TRANSITIONS */
--transition-fast, --transition-normal, --transition-slow

/* Z-INDEX */
--z-auto, --z-base, --z-dropdown, --z-sticky, --z-fixed, --z-modal, --z-popover, --z-tooltip
```

## Files Summary

| File | Purpose | Key Exports |
|------|---------|-------------|
| `src/theme/tokens.ts` | ⭐ Design tokens definition | colors, typography, spacing, shadows, etc. |
| `src/theme/utils.ts` | Helper functions & hooks | useTheme, getColorByPath, getShadow, etc. |
| `src/theme/index.ts` | Central theme export | All tokens and utilities |
| `src/styles/globals.css` | Global styles & CSS vars | CSS variables, resets, base styles |
| `tailwind.config.ts` | Tailwind configuration | Uses tokens, defines utilities |
| `postcss.config.js` | CSS processing pipeline | Tailwind & Autoprefixer setup |
| `vite.config.ts` | Build configuration | Dev server, build optimization |
| `tsconfig.json` | TypeScript configuration | Strict mode, path aliases |
| `src/App.tsx` | Demo component | Shows theme in action |

## Next Steps

1. ✅ Theme system complete and documented
2. Create layout components (Header, Footer, Sidebar, BottomNav)
3. Build core screens (Home, Matches, Profile, Leaderboards, Teams)
4. Implement authentication
5. Connect to backend API
6. Add interactive features and gamification

---

**The theme system is production-ready and fully scalable. You can now build components with confidence, knowing that design changes can be made globally in seconds!** 🚀
