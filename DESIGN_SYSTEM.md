# StreetBaller — Design System

**Single Source of Truth for UI/UX in this project.**

## 🎨 Color Palette (Finalized)

### Primary Colors
- **Pitch Green** (#1B5E20) — Main brand, football field vibes
  - Dark: #0D3817 (text, emphasis)
  - Light: #2E7D32 (secondary elements)
- **White/Off-White** (#FFFFFF / #F5F5F5) — Backgrounds

### Accent Colors
- **Victory Gold** (#FFB300) — Achievements, wins, highlights
- **Trust Purple** (#9C27B0) — Reputation metrics, trust points
- **Energy Orange** (#FF6F00) — Active states, urgency, challenges
- **Caution Red** (#D32F2F) — Disputes, warnings, penalties
- **Neutral Gray** (#424242) — Secondary text, disabled states

### Dark Mode (Primary Theme)
- **Background**: #121212
- **Surface 1**: #1E1E1E (cards)
- **Surface 2**: #242424 (elevated)
- **Text Primary**: #FFFFFF
- **Text Secondary**: #B0B0B0

## 🔤 Typography

### Font Stack
- **Display/Headings**: Inter, Poppins (modern, sporty)
  - H1: 32px, 700 weight, 1.2 line-height
  - H2: 24px, 600 weight, 1.2 line-height
  - H3: 20px, 600 weight, 1.2 line-height

- **Body**: Inter (clean, readable)
  - Regular: 16px, 400 weight, 1.5 line-height
  - Small: 14px, 400 weight, 1.4 line-height
  - Tiny: 12px, 400 weight, 1.4 line-height

## 🎯 Components

### Navigation
- **Mobile**: Bottom tab bar (Home, Matches, Teams, Leaderboards, Profile)
- **Web**: Top header + collapsible sidebar
- **Styling**: Pitch green active state, gray inactive

### Cards
- **Match Card**: Logos | vs | Time, location, format, status, CTA
- **Player Card**: Avatar | Name | Rating | Stats | Trust badge
- **Team Card**: Logo | Name | Members | Next match | CTA
- **Stat Block**: Large number | Label | Trend | Optional comparison

### Buttons
- **Primary**: Pitch green, white text, 48px height (mobile), 3:1 spacing
- **Secondary**: Outlined, 40px height
- **Tertiary**: Text-only, gray
- **Danger**: Red background
- **States**: Default, Hover, Pressed, Disabled, Loading

### Forms & Input
- **Text Input**: Labeled, real-time validation feedback
- **Dropdown**: Searchable for long lists
- **Date/Time**: Inline picker, mobile-friendly
- **Photo Upload**: Drag-and-drop + camera preview
- **Validation**: Green checkmark (success), red X (error)

### Modals
- **Mobile**: Bottom sheet, slide up
- **Web**: Center modal with overlay
- **Animations**: Fade + scale (0.25s)

## 🎨 Spacing & Layout
- **Scale**: 4px, 8px, 12px, 16px, 24px, 32px, 48px
- **Border Radius**: 12px (cards), 8px (buttons), 4px (small)
- **Shadows**: 
  - Small: 0 2px 4px rgba(0,0,0,0.1)
  - Medium: 0 4px 8px rgba(0,0,0,0.15)
  - Large: 0 8px 16px rgba(0,0,0,0.2)

## 🎬 Animations
- **Page transitions**: Slide in right (0.3s)
- **Button press**: Ripple (0.2s)
- **Modal open**: Fade + scale (0.25s)
- **List items**: Slide left (0.15s)
- **Stat updates**: Increment + glow (0.5s)
- **Achievement**: Confetti + fly-in card

### Interaction Feedback
- **Success**: Green checkmark + toast (1.5s)
- **Error**: Red X + persistent message
- **Loading**: Spinner or skeleton screen
- **Confirm**: Modal for destructive actions

## ♿ Accessibility
- **Contrast**: WCAG AA (4.5:1 normal, 3:1 large)
- **Focus**: Clear focus ring on all interactive elements
- **Labels**: All form inputs associated with labels
- **Keyboard**: All features accessible via keyboard
- **Screen Readers**: Semantic HTML, ARIA labels
- **Motion**: Respect `prefers-reduced-motion`

## 🎭 Design Inspiration
- FIFA Ultimate Team UI (stat cards, progression)
- PES Career screens (profile depth)
- Strava (activity tracking aesthetics)
- Sports betting apps (stat presentation)

## 📱 Responsive Strategy
- **Mobile First** (320px - 599px): Single column, bottom tabs
- **Tablet** (600px - 1023px): Two columns, sidebar
- **Desktop** (1024px+): Full layout with grids

## 🛠 Tech Stack
- **Framework**: React 18+
- **Styling**: Tailwind CSS
- **Components**: Headless UI / Radix UI
- **State**: TanStack Query + Zustand
- **Forms**: React Hook Form
- **Charts**: Recharts
- **Maps**: Google Maps React
- **Icons**: Heroicons / React Icons
