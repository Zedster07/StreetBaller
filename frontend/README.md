# StreetBaller Frontend

Professional React frontend for the StreetBaller street soccer gamification platform.

## 🎨 Centralized Theme System

This project features a **fully centralized design system** where all colors, fonts, spacing, and other design tokens are defined in one place (`src/theme/tokens.ts`). This means:

✅ **Change colors globally** by editing one file  
✅ **Type-safe design tokens** with TypeScript  
✅ **Single source of truth** for design consistency  
✅ **CSS variables + Tailwind** for flexible styling  
✅ **Easy to maintain** and scale  

### Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev
# Opens http://localhost:5173

# Build for production
npm run build

# Type checking
npm run type-check

# Linting
npm run lint
```

## 📁 Project Structure

```
frontend/
├── public/                  # Static assets
├── src/
│   ├── components/         # Reusable UI components
│   ├── pages/              # Full page screens
│   ├── hooks/              # Custom React hooks
│   ├── services/           # API client functions
│   ├── store/              # Zustand state management
│   ├── theme/              # ⭐ Design system
│   │   ├── tokens.ts       # All design tokens (colors, typography, spacing)
│   │   ├── utils.ts        # Theme utility functions & hooks
│   │   └── index.ts        # Central export
│   ├── styles/             # Global CSS
│   │   └── globals.css     # CSS variables, resets, base styles
│   ├── utils/              # Helper functions
│   ├── types/              # TypeScript interfaces
│   ├── config/             # App configuration
│   ├── App.tsx             # Root component (with theme demo)
│   └── main.tsx            # React entry point
├── index.html              # HTML entry point
├── vite.config.ts          # Vite configuration
├── tailwind.config.ts      # Tailwind configuration (uses tokens)
├── postcss.config.js       # PostCSS pipeline
├── tsconfig.json           # TypeScript configuration
└── package.json            # npm dependencies & scripts
```

## 🎨 Using the Theme System

### Option 1: Use Tailwind Classes (Recommended)

```tsx
<div className="bg-primary-500 text-dark-text-primary p-lg rounded-lg shadow-md">
  <h2 className="heading-h3">Hello</h2>
  <p className="body-regular">Welcome</p>
</div>
```

### Option 2: Use CSS Variables

```tsx
<div style={{
  backgroundColor: 'var(--color-primary)',
  padding: 'var(--spacing-lg)',
  borderRadius: 'var(--radius-lg)',
}}>
  Content
</div>
```

### Option 3: Use Theme Utilities in Components

```tsx
import { useTheme, getShadow, getSpacing } from '@/theme';

export function MyComponent() {
  const theme = useTheme();
  const primaryColor = theme.colors.primary.main;
  const shadow = getShadow('lg');
  
  return (
    <div style={{ color: primaryColor, boxShadow: shadow }}>
      Content
    </div>
  );
}
```

### Option 4: Use Tailwind Arbitrary Values

```tsx
<div className="text-[#1B5E20] shadow-[0_4px_6px_rgba(0,0,0,0.1)]">
  Content
</div>
```

## 🎨 Design Tokens Reference

### Colors

All colors are defined in `src/theme/tokens.ts` under `colors` object:

```typescript
colors = {
  primary: {        // Pitch Green (#1B5E20)
    main: '#1B5E20',
    dark: '#0D3817',
    light: '#2E7D32',
    // ... shade variants (50-900)
  },
  accent: {
    gold: '#FFB300',     // Victory Gold
    purple: '#9C27B0',   // Trust Purple
    orange: '#FF6F00',   // Energy Orange
    red: '#D32F2F',      // Caution Red
  },
  darkMode: {
    background: '#121212',
    surface1: '#1E1E1E',
    surface2: '#242424',
    textPrimary: '#FFFFFF',
    // ... more dark mode colors
  },
}
```

**Use in components:**
- Tailwind: `bg-primary-500`, `text-gold`, `border-purple`
- CSS: `background: var(--color-primary)`, `color: var(--text-primary)`
- React: `theme.colors.primary.main`, `theme.colors.accent.gold`

### Typography

Font families, sizes, weights, and predefined styles:

```typescript
typography = {
  fontFamily: {
    display: 'Poppins',  // For headings
    body: 'Inter',       // For body text
    mono: 'Monaco',      // For code
  },
  heading: {
    h1: { fontSize: '60px', fontWeight: 700, lineHeight: 1.2 },
    h2: { fontSize: '48px', fontWeight: 600, lineHeight: 1.2 },
    h3: { fontSize: '36px', fontWeight: 600, lineHeight: 1.2 },
    // ... more headings
  },
}
```

**Use in components:**
- Tailwind: `text-6xl`, `text-4xl`, `font-bold`
- CSS classes: `heading-h1`, `heading-h3`, `body-large`, `label-small`
- React: `theme.typography.fontSize`, `theme.typography.heading.h1`

### Spacing

Consistent spacing scale (4px, 8px, 12px, etc.):

```typescript
spacing = {
  xs: '0.25rem',   // 4px
  sm: '0.5rem',    // 8px
  md: '0.75rem',   // 12px
  lg: '1rem',      // 16px
  xl: '1.5rem',    // 24px
  '2xl': '2rem',   // 32px
  '3xl': '2.5rem', // 40px
  // ...
}
```

**Use in components:**
- Tailwind: `p-md`, `m-lg`, `gap-xl`, `space-y-sm`
- CSS: `padding: var(--spacing-lg)`
- React: `theme.spacing.lg`

### Border Radius

```typescript
borderRadius = {
  sm: '0.25rem',   // 4px - small components
  md: '0.5rem',    // 8px - buttons, inputs
  lg: '0.75rem',   // 12px - cards
  xl: '1rem',      // 16px - containers
  full: '9999px',  // Pill-shaped
}
```

### Shadows

```typescript
shadows = {
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), ...',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), ...',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), ...',
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
}
```

**Use in components:**
- Tailwind: `shadow-md`, `shadow-lg`, `shadow-xl`
- CSS: `box-shadow: var(--shadow-lg)`
- React: `getShadow('lg')`

### Transitions

```typescript
transitions = {
  fast: { duration: '0.15s', timing: 'cubic-bezier(0.4, 0, 0.2, 1)' },
  normal: { duration: '0.3s', timing: 'cubic-bezier(0.4, 0, 0.2, 1)' },
  slow: { duration: '0.5s', timing: 'cubic-bezier(0.4, 0, 0.2, 1)' },
}
```

**Use in components:**
- Tailwind: `transition-fast`, `transition-normal`, `transition-slow`
- CSS: `transition: all var(--transition-normal)`
- React: `getTransition('normal')`

## 🔧 Theme Utility Functions

Import from `@/theme`:

```typescript
import {
  useTheme,              // Hook to access all tokens
  getColorByPath,        // Get color by path: getColorByPath('primary.main')
  getSpacing,            // Get spacing: getSpacing('lg')
  getFontSize,           // Get font size: getFontSize('2xl')
  getShadow,             // Get shadow: getShadow('md')
  getTransition,         // Get transition: getTransition('normal')
  createGradient,        // Create gradient: createGradient('primary', 'gold')
  lightenColor,          // Lighten color: lightenColor('#1B5E20', 20)
  darkenColor,           // Darken color: darkenColor('#1B5E20', 20)
  pxToRem,               // Convert px to rem
  remToPx,               // Convert rem to px
} from '@/theme';
```

## 🌱 Making Global Design Changes

**To change the primary color:**
1. Open `src/theme/tokens.ts`
2. Update `colors.primary.main` (and related shades)
3. **All components using primary color automatically update!** ✨

**Example:**
```typescript
// Before
primary: {
  main: '#1B5E20',  // Pitch Green
  // ...
}

// After
primary: {
  main: '#FF6F00',  // Changed to Orange
  // ...
}
```

**To change typography:**
1. Open `src/theme/tokens.ts`
2. Update `typography.fontFamily`, `fontSize`, or `heading` values
3. All components automatically update!

**To add new design tokens:**
1. Add to `src/theme/tokens.ts`
2. Update `tailwind.config.ts` to include in Tailwind config
3. Use immediately in components!

## 🔗 Path Aliases

The project uses TypeScript path aliases for clean imports:

```typescript
// Instead of:
import theme from '../../../theme';

// Use:
import { useTheme } from '@/theme';
import MyComponent from '@/components/MyComponent';
import { myService } from '@/services/myService';
```

**Available aliases:**
- `@/*` → `src/*`
- `@components/*` → `src/components/*`
- `@pages/*` → `src/pages/*`
- `@hooks/*` → `src/hooks/*`
- `@services/*` → `src/services/*`
- `@store/*` → `src/store/*`
- `@utils/*` → `src/utils/*`
- `@theme/*` → `src/theme/*`
- `@types/*` → `src/types/*`
- `@styles/*` → `src/styles/*`
- `@config/*` → `src/config/*`

## 📦 Dependencies

**Core:**
- `react 18.2` - UI library
- `react-dom 18.2` - DOM renderer
- `react-router-dom 6.20` - Routing/SPA navigation

**State Management:**
- `@tanstack/react-query 5.25` - Server state (API caching, syncing)
- `zustand 4.4` - Client state (UI state, user preferences)

**Forms:**
- `react-hook-form 7.48` - Form validation and handling

**HTTP:**
- `axios 1.6` - HTTP client for API calls

**Styling:**
- `tailwindcss 3.3` - Utility-first CSS framework
- `postcss 8.4` - CSS processing
- `autoprefixer 10.4` - Browser prefixes

**UI Components:**
- `recharts 2.10` - Charts for stats/leaderboards
- `@heroicons/react` - Icon library (optional)
- `react-icons` - Additional icon library (optional)

**Development:**
- `vite 5.0` - Build tool and dev server
- `typescript 5.2` - Type safety
- `eslint` - Code quality

## 🚀 Performance Features

- **Code splitting** - Vite automatically splits vendors (React, Router, Query, Recharts)
- **CSS minification** - Tailwind purges unused classes in production
- **Image optimization** - Use modern formats (WebP) when possible
- **Lazy loading** - Implement React.lazy() for route-based code splitting

## 🔐 API Integration

The frontend connects to the backend at `http://localhost:3000/api` (configurable via `.env`).

**Set API URL:**
1. Copy `.env.example` to `.env`
2. Update `VITE_API_BASE_URL` to your backend server
3. Use Axios with TanStack Query for API calls

## 📱 Responsive Design

The theme includes responsive breakpoints:

```typescript
breakpoints = {
  xs: '320px',   // Mobile
  sm: '640px',   // Tablet
  md: '768px',
  lg: '1024px',  // Desktop
  xl: '1280px',  // Large desktop
  '2xl': '1536px',
}
```

Use Tailwind responsive prefixes:
```tsx
<div className="text-sm md:text-lg lg:text-xl">
  Responsive text sizing
</div>
```

## 🎯 Next Steps

1. ✅ Theme system complete - You're here!
2. Create layout components (Header, Footer, Sidebar, BottomNav)
3. Build core screens (Home, Matches, Profile, Leaderboards, Teams)
4. Implement authentication (Login, Signup, Profile)
5. Connect to backend API
6. Add gamification features (badges, achievements, rankings)
7. Implement real-time updates (WebSocket, polling, or Server-Sent Events)

## 📚 Resources

- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [React Router Docs](https://reactrouter.com/)
- [TanStack Query Docs](https://tanstack.com/query/latest)
- [Zustand Docs](https://zustand-demo.vercel.app/)
- [React Hook Form Docs](https://react-hook-form.com/)
- [Vite Docs](https://vitejs.dev/)

---

**Happy coding! 🚀**
