# StreetBaller — Frontend Design & UI/UX Strategy

## 🎯 Design Principles

1. **Mobile-First** — Design for mobile players first, adapt up to web/tablet
2. **Speed-Focused** — Minimal clicks to key actions (join match, view stats, create team)
3. **Gamification Visible** — Stats, points, progress always visible and rewarding
4. **Trust-Transparent** — Show reputation/trust scores prominently
5. **Community-Driven** — Social elements and competitive rankings highlighted
6. **Accessible** — WCAG AA minimum; readable on bright sunlight and dim rooms

---

## 🎨 Visual Design System

### Color Palette

#### Primary Colors
- **Pitch Green** (#1B5E20) — Main brand color, represents football field
  - Darker shade (#0D3817) for text and emphasis
  - Lighter shade (#2E7D32) for secondary elements
- **White/Off-White** (#FFFFFF / #F5F5F5) — Backgrounds and contrast

#### Accent Colors
- **Victory Gold** (#FFB300) — For achievements, highlights, wins
- **Trust Purple** (#9C27B0) — For trust points, reputation metrics
- **Energy Orange** (#FF6F00) — For active states, urgency, challenges
- **Caution Red** (#D32F2F) — For disputes, warnings, penalties
- **Neutral Gray** (#424242) — For secondary text and disabled states

#### Dark Mode (Primary)
- **Background Base**: #121212
- **Surface 1**: #1E1E1E (cards, panels)
- **Surface 2**: #242424 (elevated elements)
- **Text Primary**: #FFFFFF
- **Text Secondary**: #B0B0B0

### Typography

#### Font Family
- **Display/Headings**: "Inter" or "Poppins" (bold, modern, sporty)
  - H1: 32px, 700 weight
  - H2: 24px, 600 weight
  - H3: 20px, 600 weight
  
- **Body**: "Inter" (clean, highly readable)
  - Body Regular: 16px, 400 weight
  - Body Small: 14px, 400 weight
  - Body Tiny: 12px, 400 weight
  - Subtitle: 14px, 500 weight

#### Line Heights
- Headings: 1.2
- Body: 1.5
- Small text: 1.4

### Visual Style
- **Border Radius**: 12px for cards/panels, 8px for buttons, 4px for small components
- **Shadows**: Subtle shadows for depth (not harsh)
  - Small: 0 2px 4px rgba(0,0,0,0.1)
  - Medium: 0 4px 8px rgba(0,0,0,0.15)
  - Large: 0 8px 16px rgba(0,0,0,0.2)
- **Spacing Scale**: 4px, 8px, 12px, 16px, 24px, 32px, 48px
- **Animations**: Smooth 0.3s transitions; feel snappy but not jarring

---

## 🏗 Key Screens & User Flows

### Tier 1: Essential Onboarding (Day 1)
1. **Authentication Screen**
   - Email login / Sign up
   - Social auth placeholder (Firebase)
   - Clean, minimal, focus on form

2. **Profile Setup Wizard** (3-4 steps)
   - Basic info: Name, Age, Role
   - Photo upload
   - Position & Foot preference
   - Bio/About

3. **Home/Dashboard**
   - Welcome card
   - Quick stats (Goals, Assists, Rating)
   - Upcoming matches
   - Teams list
   - Action buttons: Find Match, Create Team

### Tier 2: Core Gameplay (Week 1)
4. **Matches Flow**
   - Browse/Search available matches
   - Match detail card (teams, time, location, format)
   - Join button → Confirm presence
   - Match status: Upcoming, Live (pending), Completed
   
5. **Team Management**
   - Team profile (roster, stats, next match)
   - Invite players
   - Captain controls (manage roster, propose matches)
   - Team history/results

6. **Match Scoring Post-Match**
   - Goal scorer entry
   - Assist tracking
   - Final confirmation
   - Trust voting if disputed

7. **Player Profile (Self & Others)**
   - Stats summary
   - Match history graph
   - Achievements/Badges
   - Trust score visible
   - Stats breakdown (goals, assists, wins, rating)

8. **Leaderboards**
   - Player rankings (goals, assists, rating, trust)
   - Team rankings
   - Filter by time period (this month, season, all-time)
   - Player position in rankings

### Tier 3: Social & Engagement (Month 1)
9. **Notifications Hub**
   - Match invites
   - Team requests
   - Dispute alerts
   - Achievement unlocks

10. **Player Search/Discovery**
    - Search by name
    - Filter by position, rating, location
    - View player cards (stats, team, availability)

---

## 🎮 Core UI Components

### Navigation
- **Mobile**: Bottom tab bar (5 tabs)
  - Home
  - Matches
  - Teams
  - Leaderboards
  - Profile
  
- **Web**: Top header + sidebar (collapsible)
  - Same 5 main sections
  - Additional secondary nav

### Cards & Containers
- **Match Card**
  - Team logos | vs | Team logos
  - Time, location, format
  - Player count / Roster status
  - Status badge (Upcoming, Pending, Completed)
  - CTA button (Join, View, Score)

- **Player Card**
  - Avatar | Name | Position
  - Rating with stars
  - Recent stats (goals, assists)
  - Trust score badge
  - Action buttons (View Profile, Challenge, Message)

- **Team Card**
  - Team logo/colors
  - Team name | Captain name
  - Member count
  - Next match
  - Join/View button

- **Stat Block**
  - Large number (metric value)
  - Label below
  - Trend indicator (↑↓ or sparkline)
  - Optional comparison (vs previous period)

### Forms & Input
- **Input Fields**: Labeled, error states clear, character counts for text areas
- **Dropdowns**: Simple, searchable for long lists
- **Date/Time Pickers**: Inline, mobile-friendly
- **Photo Upload**: Drag-and-drop + camera preview
- **Validation**: Real-time feedback (green checkmark, red X)

### Buttons
- **Primary CTA**: Pitch Green background, white text, 48px height (mobile)
- **Secondary Action**: Outlined, smaller (40px)
- **Tertiary/Subtle**: Text-only, gray
- **Danger (Delete/Reject)**: Red background with caution color
- **Success (Confirm)**: Green with checkmark
- **States**: Default, Hover, Pressed, Disabled, Loading

### Modals & Overlays
- **Bottom Sheet** (Mobile): Slide up from bottom, dismissible
- **Center Modal** (Web): Centered with overlay, accessible
- **Toast Notifications**: Auto-dismiss, positioned top-right

### Stats Visualization
- **Simple Sparkline**: For trend over time
- **Progress Rings**: For completion/percentage (trust score)
- **Bar Charts**: For leaderboard rankings (horizontal bars)
- **Numbers + Context**: Large, bold numbers with subtle change indicators

---

## 📱 Mobile vs Web Layout Strategy

### Mobile (Primary)
- Single column, full width
- Bottom tab navigation (always visible)
- Full-screen modals/forms
- Large touch targets (48px minimum)
- Scrollable content

### Tablet/Web (Secondary)
- Two-column layout when space allows
- Sidebar navigation (collapsible)
- Modals/dialogs centered
- Card-based grids
- Desktop-friendly spacing

### Responsive Breakpoints
- Mobile: 320px - 599px
- Tablet: 600px - 1023px
- Desktop: 1024px+

---

## 🔄 Key User Journeys (Wireflow)

### Journey 1: New Player → First Match
```
Register → Complete Profile → Browse Matches 
→ Select Match → Join Team → View Match Details 
→ Match Day: Check In → View Live Score 
→ Post-Match: Confirm Results → View Updated Stats
```

### Journey 2: Team Captain → Schedule Match
```
Home → Teams → Select Team → Create Challenge 
→ Fill Match Details (opponent, date, location, format) 
→ Invite Players to Team → Monitor Confirmations 
→ Match Day: Manage Roster → Enter Final Score 
→ Collect Performance Data
```

### Journey 3: Dispute Resolution Flow
```
Match Result Entered → Captain A Approves ✓ 
→ Captain B Disputes ✗ → Dispute Card Created 
→ Show Dispute to Players → Vote Yes/No Form 
→ Tally Votes → Apply Outcome (Approve, Reject, Adjust) 
→ Adjust Trust Points → Final Confirmation
```

---

## 🎯 Key Screens Detailed

### Home Dashboard (After Login)
**Layout:**
```
┌─────────────────────────────────────┐
│ Welcome Header (small profile photo) │
├─────────────────────────────────────┤
│ Quick Stats Row                     │
│ [Goals] [Assists] [Rating] [Trust]  │
├─────────────────────────────────────┤
│ "Upcoming Matches" (or "No matches")│
│ [Match Card] [Match Card]  →        │
├─────────────────────────────────────┤
│ "Your Teams"                        │
│ [Team Card] [Team Card]  →          │
├─────────────────────────────────────┤
│ Call-to-Action Buttons (2 col grid) │
│ [Find Match] [Create Team]          │
│ [View Stats] [Invite Friends]       │
└─────────────────────────────────────┘
```

### Player Profile
```
┌─────────────────────────────────────┐
│ Header: Large Avatar + Name/Position│
│ Rating ⭐⭐⭐⭐⭐ | Trust: 850pts    │
├─────────────────────────────────────┤
│ Career Stats Section                │
│ [Goals] [Assists] [Wins] [Matches]  │
├─────────────────────────────────────┤
│ Match History / Results Timeline    │
│ [Result 1] [Result 2] [Result 3]   │
├─────────────────────────────────────┤
│ Achievements / Badges Grid          │
│ [Badge] [Badge] [Badge]             │
├─────────────────────────────────────┤
│ Teams (Past & Current)              │
│ [Team 1] [Team 2]                   │
└─────────────────────────────────────┘
```

### Match Detail
```
┌─────────────────────────────────────┐
│ [Team A Logo] vs [Team B Logo]      │
│ Format: 5v5 | Date: Fri 3 PM        │
│ Location: Riverside Pitch (0.5km)   │
├─────────────────────────────────────┤
│ Status: "Pending Confirmation"      │
│ Your Status: "You're In" ✓          │
├─────────────────────────────────────┤
│ Team A Roster (3/5)                 │
│ [Player] [Player] [Player] [+]      │
│ Team B Roster (2/5)                 │
│ [Player] [Player] [+]               │
├─────────────────────────────────────┤
│ Referee: [Referee Card or "Needed"]│
├─────────────────────────────────────┤
│ Buttons: [Edit Stats] [Leave] [More]│
└─────────────────────────────────────┘
```

---

## 🎭 Interaction & Animation Patterns

### Transitions
- **Page Navigation**: Slide in from right (0.3s)
- **Modal Appearance**: Fade + scale up (0.25s)
- **Button Press**: Ripple effect (0.2s)
- **List Item Add**: Slide in from left (0.15s)

### Feedback
- **Successful Action**: Brief green checkmark + toast (1.5s)
- **Error**: Red X + descriptive message (persists until dismissed)
- **Loading**: Spinner or skeleton screens (don't blank out interface)
- **Confirmation**: Explicit "Confirm" modal for destructive actions

### Gamification Micro-interactions
- **Stat Update**: Number increments visually (0.5s) + glow effect
- **Achievement Unlock**: Confetti animation + card fly-in
- **Trust Points Gained**: Purple badge with "+X pts" label
- **Ranking Change**: Arrow (↑↓) with color coding (green for up, orange for down)

---

## ♿ Accessibility Guidelines

- **Color Contrast**: All text meets WCAG AA (4.5:1 for normal text, 3:1 for large)
- **Focus States**: Clear focus ring on all interactive elements
- **Alt Text**: All images have descriptive alt text
- **Labels**: Form inputs always have associated labels
- **Keyboard Navigation**: All features accessible via keyboard
- **Screen Readers**: Semantic HTML, ARIA labels where needed
- **Motion**: Respect `prefers-reduced-motion` setting

---

## 🛠 Tech Stack Summary

- **Framework**: React 18+
- **Styling**: Tailwind CSS (utility-first)
- **Component Library**: Headless UI / Radix UI (accessible primitives)
- **State Management**: TanStack Query (server state) + Zustand (client state)
- **Form Handling**: React Hook Form
- **Icons**: React Icons or Heroicons
- **Charts/Graphs**: Recharts or Chart.js
- **Maps**: Google Maps React component

---

## 📊 Design Tokens (CSS Variables)

```css
/* Colors */
--color-primary: #1B5E20;
--color-primary-dark: #0D3817;
--color-primary-light: #2E7D32;
--color-accent-gold: #FFB300;
--color-accent-purple: #9C27B0;
--color-accent-orange: #FF6F00;
--color-error: #D32F2F;

/* Spacing */
--spacing-xs: 4px;
--spacing-sm: 8px;
--spacing-md: 12px;
--spacing-lg: 16px;
--spacing-xl: 24px;
--spacing-2xl: 32px;

/* Typography */
--text-h1: 32px / 700;
--text-h2: 24px / 600;
--text-body: 16px / 400;
--text-small: 14px / 400;

/* Radius */
--radius-sm: 4px;
--radius-md: 8px;
--radius-lg: 12px;

/* Shadows */
--shadow-sm: 0 2px 4px rgba(0,0,0,0.1);
--shadow-md: 0 4px 8px rgba(0,0,0,0.15);
--shadow-lg: 0 8px 16px rgba(0,0,0,0.2);

/* Transitions */
--transition-fast: 0.15s ease-in-out;
--transition-normal: 0.3s ease-in-out;
--transition-slow: 0.5s ease-in-out;
```

---

## 🎯 Implementation Priority

### Phase 1: Core Layout & Navigation
- Layout components (Header, Footer, TabBar)
- Navigation routing
- Color system & theme provider
- Typography system

### Phase 2: Essential Screens
- Auth screens (Login, Signup)
- Home dashboard
- Player profile
- Match listing & detail

### Phase 3: Interactivity
- Forms (join match, create team)
- Modals (create challenge, report result)
- Notifications
- Leaderboards

### Phase 4: Polish
- Animations & micro-interactions
- Image optimization
- Performance tuning
- Accessibility audit

---

## 📝 Design Review Checklist (Before Coding)

- [ ] Color palette approved
- [ ] Typography finalized
- [ ] 5-10 key screens designed in Figma/wireframes
- [ ] Component library sketched
- [ ] Mobile vs Web breakpoints confirmed
- [ ] Accessibility requirements clear
- [ ] Animation guide defined
- [ ] Design tokens documented

