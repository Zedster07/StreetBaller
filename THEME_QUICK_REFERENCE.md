# Theme System Quick Reference

**TL;DR: Centralized design system where you change colors/fonts once and everything updates!**

## 🎨 Three Ways to Use Design Tokens

### 1. Tailwind Classes (Easiest & Most Common) ⭐

```tsx
<button className="bg-primary-500 hover:bg-primary-600 text-white px-lg py-md rounded-lg shadow-md">
  Click Me
</button>

<div className="bg-dark-surface text-dark-text-primary p-xl rounded-lg border border-dark-border">
  <h2 className="heading-h3 mb-md">Title</h2>
  <p className="body-regular text-dark-text-secondary">Subtitle</p>
</div>
```

**Available classes:**
- Colors: `bg-primary-*`, `text-gold`, `border-purple`, `bg-red-500`
- Typography: `heading-h1` to `heading-h6`, `body-large`, `body-regular`, `label-small`
- Spacing: `p-lg`, `m-xl`, `gap-sm`, `space-y-md`
- Shadows: `shadow-md`, `shadow-lg`, `shadow-xl`
- Radius: `rounded-sm`, `rounded-lg`, `rounded-full`
- Transitions: `transition-fast`, `transition-normal`, `transition-slow`

### 2. CSS Variables (For Dynamic Styling)

```tsx
<div style={{
  backgroundColor: 'var(--color-primary)',
  color: 'var(--text-primary)',
  padding: 'var(--spacing-lg)',
  borderRadius: 'var(--radius-lg)',
  boxShadow: 'var(--shadow-md)',
  transition: `all var(--transition-normal)`,
}}>
  Content
</div>
```

**90+ variables available** (see `src/styles/globals.css`)

### 3. React Hooks (For Complex Logic)

```tsx
import { useTheme, getShadow, getSpacing } from '@/theme';

export function MyComponent() {
  const theme = useTheme();
  const primaryColor = theme.colors.primary.main;
  const accentGold = theme.colors.accent.gold;
  const spacing = getSpacing('lg');        // '1rem'
  const shadow = getShadow('md');
  const fontSize = getFontSize('2xl');     // '1.5rem'
  
  return <div style={{ color: primaryColor, boxShadow: shadow }}>...</div>;
}
```

**Utilities available:**
- `useTheme()` - Access all tokens
- `getColorByPath(path)` - Get color by path: `'primary.main'`, `'accent.gold'`
- `getSpacing(scale)` - Get spacing value
- `getFontSize(scale)` - Get font size
- `getShadow(intensity)` - Get shadow
- `getTransition(speed)` - Get transition timing
- `createGradient(color1, color2)` - CSS gradient
- `lightenColor(color, percent)`, `darkenColor(color, percent)`

## 🔄 Changing Design Globally

### Change Primary Color

**File:** `src/theme/tokens.ts` (line ~42)

```typescript
// BEFORE
primary: {
  main: '#1B5E20',      // Pitch Green
  dark: '#0D3817',
  light: '#2E7D32',
  // ... shade variants 50, 100, 200, ... 900
}

// AFTER
primary: {
  main: '#FF6F00',      // Changed to orange
  dark: '#E65100',
  light: '#FF8F00',
  // ... update shades accordingly
}
```

**Result:** All `bg-primary-*, text-primary, --color-primary` instantly change!

### Change Typography

**File:** `src/theme/tokens.ts` (line ~140)

```typescript
// Change heading font
fontFamily: {
  display: 'Poppins',      // Change to 'Georgia', 'Playfair Display', etc.
  body: 'Inter',
}

// Change logo text color
heading: {
  h1: { ... color: '#FFB300' }  // or use colors.accent.gold
}
```

### Change Spacing Scale

**File:** `src/theme/tokens.ts` (line ~250)

```typescript
spacing = {
  xs: '0.25rem',    // 4px - Change these values
  sm: '0.5rem',     // 8px
  md: '0.75rem',    // 12px
  lg: '1rem',       // 16px
  xl: '1.5rem',     // 24px
  // ... all p-*, m-*, gap-* classes update automatically!
}
```

### Change Dark Mode Colors

**File:** `src/theme/tokens.ts` (line ~75)

```typescript
darkMode: {
  background: '#000000',    // Pure black instead of #121212
  surface1: '#1A1A1A',      // Darker cards
  textPrimary: '#F5F5F5',   // Off-white instead of pure white
  // ... change entire theme appearance in one place!
}
```

## 📍 File Locations

| Need | File | What To Edit |
|------|------|--------------|
| Change colors, fonts, spacing | `src/theme/tokens.ts` | Any `colors`, `typography`, `spacing` object |
| Add CSS variable | `src/styles/globals.css` | `:root { ... }` section |
| Add Tailwind utility class | `tailwind.config.ts` | `plugins[0]` function |
| Configure dev server | `vite.config.ts` | `server` section |
| Configure build | `tailwind.config.ts` + `vite.config.ts` | `build` sections |

## 🎯 Common Tailwind Classes

### Colors
```
bg-primary-500         (Pitch Green)
bg-gold                (Victory Gold)
text-purple            (Trust Purple)
border-orange          (Energy Orange)
bg-red-500             (Caution Red)
text-white             (Text on dark)
bg-dark-surface        (Card background)
text-dark-text-secondary
border-dark-border
```

### Typography
```
heading-h1             (60px, weight 700)
heading-h3             (36px, weight 600)
body-large             (18px)
body-regular           (16px, default)
body-small             (14px)
label-small            (12px, uppercase)
text-dark-text-primary (White text)
text-dark-text-secondary
```

### Spacing
```
p-lg                   (padding 16px all sides)
px-lg py-md            (padding X and Y)
m-xl                   (margin 24px)
gap-sm                 (8px gap between items)
space-y-md             (12px space between children)
mt-2xl                 (margin-top 32px)
```

### Sizing
```
w-full                 (100%)
h-64                   (from Tailwind)
rounded-lg             (12px border radius)
rounded-full           (pill-shaped)
```

### Shadows & Effects
```
shadow-sm              (subtle shadow)
shadow-md              (medium shadow)
shadow-lg              (large shadow)
shadow-xl              (extra large shadow)
```

### Transitions
```
transition-fast        (150ms)
transition-normal      (300ms, default)
transition-slow        (500ms)
hover:bg-primary-600   (hover color)
focus:border-primary-500
```

## 🚀 Quick Examples

### Button Component

```tsx
<button className="
  px-lg py-md rounded-lg
  bg-primary-500 hover:bg-primary-600
  text-white font-semibold
  shadow-md hover:shadow-lg
  transition-normal
  disabled:opacity-50 disabled:cursor-not-allowed
">
  Click Me
</button>
```

### Card Component

```tsx
<div className="
  bg-dark-surface rounded-lg
  border border-dark-border
  p-xl shadow-md
">
  <h3 className="heading-h4 mb-md text-dark-text-primary">Title</h3>
  <p className="body-regular text-dark-text-secondary">Description</p>
</div>
```

### Input Component

```tsx
<input
  type="text"
  placeholder="Enter text..."
  className="
    w-full px-lg py-md
    bg-dark-surface-2 border border-dark-border
    text-dark-text-primary placeholder-dark-text-tertiary
    rounded-md
    focus:border-primary-500 focus:outline-none
    transition-fast
  "
/>
```

### Badge Component

```tsx
<span className="
  inline-block
  px-md py-sm rounded-full
  bg-purple text-white
  text-xs font-semibold
  label-small
">
  5 Trust Points
</span>
```

### Alert Component

```tsx
<div className="
  p-lg rounded-lg border
  bg-green-500/10 border-green-500 text-green-400
">
  ✓ Operation successful!
</div>
```

## 📱 Responsive Design

```tsx
{/* Base: mobile, sm: small tablets, md: tablets, lg: desktop, xl: large desktop */}
<div className="
  text-sm md:text-base lg:text-lg    {/* Font size responsive */}
  p-sm md:p-md lg:p-lg               {/* Padding responsive */}
  grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3  {/* Columns responsive */}
">
  Responsive content
</div>
```

## 🔍 Debugging

### See All Available Colors

```typescript
import { colors } from '@/theme';
console.log(colors);  // See all color options
```

### Test CSS Variables

Open browser DevTools → Console:
```javascript
getComputedStyle(document.documentElement).getPropertyValue('--color-primary')
// Returns: " #1B5E20"
```

### See Tailwind Classes

Run `npm run dev` and use Tailwind's IntelliSense in VS Code (install Tailwind CSS IntelliSense extension)

## 📚 Complete Documentation

- **README.md** - Full frontend guide
- **FRONTEND_THEME_SYSTEM.md** - Detailed architecture
- **FRONTEND_IMPLEMENTATION_GUIDE.md** - Implementation details

## 💡 Pro Tips

1. **Prefer Tailwind classes** for 95% of styling — fastest, clearest code
2. **Use CSS variables** when you need dynamic theming or complex calculations
3. **Use React hooks** for programmatic access to tokens (advanced use cases)
4. **Keep custom colors to minimum** — use design tokens instead
5. **Test color changes** by editing `src/theme/tokens.ts` and watching hot reload
6. **Use arbitrary values** `className="bg-[#custom]"` for one-off values only

---

**Happy styling! 🎨** For questions, check the docs or look at `src/App.tsx` for working examples.
