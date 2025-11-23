# UI/UX Design Document
## Soccer Coach Manager
### Version 1.0
### Date: 2025-11-23

---

## Table of Contents
1. Design Principles
2. Information Architecture
3. Design System
4. Screen Specifications
5. User Flows
6. Mobile-First Considerations
7. Accessibility & i18n

---

## 1. Design Principles

### Core Principles
1. **One-Handed Operation**: All primary actions accessible with thumb on mobile
2. **Speed First**: Minimal taps to complete any action
3. **Progressive Disclosure**: Show only what's needed, when needed
4. **Visual Hierarchy**: Clear distinction between primary and secondary actions
5. **Forgiving Design**: Easy undo, auto-save, no data loss
6. **Context-Aware**: Show relevant information based on user's current task

### Mobile-First Strategy
- Design for 375px width (iPhone SE) as baseline
- Large touch targets (minimum 44x44px)
- Bottom navigation for frequent actions
- Pull-to-refresh for data updates
- Offline-first with clear sync indicators

---

## 2. Information Architecture

### Site Structure

```
/ (Landing Page - Static HTML)
└── /app (React SPA)
    ├── /login
    ├── /register
    ├── /forgot-password
    ├── /dashboard (home after login)
    ├── /teams
    │   ├── /new
    │   ├── /:id
    │   │   ├── /edit
    │   │   ├── /analytics
    │   │   └── /players
    ├── /players
    │   ├── /new
    │   └── /:id
    │       ├── /edit
    │       └── /development
    ├── /games
    │   ├── /new
    │   ├── /:id/track (live tracking)
    │   ├── /:id/edit
    │   └── /:id/report
    └── /practice
        ├── /new
        ├── /:id
        └── /library
```

---

## 3. Design System

### Color Palette

#### Primary Colors
- **Primary Green**: `#22C55E` - Actions, success, focus areas
- **Primary Dark**: `#16A34A` - Hover states
- **Primary Light**: `#86EFAC` - Backgrounds, highlights

#### Secondary Colors
- **Danger Red**: `#EF4444` - Warnings, negative metrics
- **Warning Yellow**: `#F59E0B` - Alerts, medium priority
- **Info Blue**: `#3B82F6` - Information, links
- **Success Green**: `#10B981` - Confirmations

#### Neutrals
- **Gray 900**: `#111827` - Primary text
- **Gray 700**: `#374151` - Secondary text
- **Gray 500**: `#6B7280` - Disabled text
- **Gray 300**: `#D1D5DB` - Borders
- **Gray 100**: `#F3F4F6` - Backgrounds
- **White**: `#FFFFFF` - Cards, surfaces

### Typography

#### Font Family
- **Primary**: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif
- **Monospace**: SF Mono, Monaco, monospace (for stats)

#### Font Scale
- **h1**: 2rem (32px) / Bold / Line-height: 1.2
- **h2**: 1.5rem (24px) / Bold / Line-height: 1.3
- **h3**: 1.25rem (20px) / Semibold / Line-height: 1.4
- **body**: 1rem (16px) / Regular / Line-height: 1.5
- **small**: 0.875rem (14px) / Regular / Line-height: 1.5
- **caption**: 0.75rem (12px) / Regular / Line-height: 1.4

### Spacing System
- **xs**: 4px
- **sm**: 8px
- **md**: 16px
- **lg**: 24px
- **xl**: 32px
- **2xl**: 48px

### Component Library

#### Buttons
```
Primary Button:
- Height: 48px (mobile), 40px (desktop)
- Padding: 12px 24px
- Border-radius: 8px
- Font: 16px semibold
- Background: Primary Green
- Text: White
- Shadow: 0 1px 2px rgba(0,0,0,0.05)

Secondary Button:
- Same dimensions
- Background: White
- Border: 1px solid Gray 300
- Text: Gray 700

Danger Button:
- Same dimensions
- Background: Danger Red
- Text: White

Icon Button (Game Tracking):
- Size: 80px x 80px
- Border-radius: 16px
- Icon: 32px
- Background: Primary Green
- Active state: Scale 0.95, darker green
```

#### Input Fields
```
Text Input:
- Height: 48px
- Padding: 12px 16px
- Border: 1px solid Gray 300
- Border-radius: 8px
- Focus: Border Primary Green, Shadow
- Error: Border Danger Red

Select Dropdown:
- Same as text input
- Chevron icon right-aligned

Textarea:
- Min-height: 120px
- Resize: vertical
```

#### Cards
```
Standard Card:
- Background: White
- Border-radius: 12px
- Padding: 16px
- Shadow: 0 1px 3px rgba(0,0,0,0.1)
- Border: 1px solid Gray 200

Stat Card:
- Same as standard
- Centered content
- Large number (2rem)
- Label below (0.875rem)
```

---

## 4. Screen Specifications

### 4.1 Landing Page (Static HTML)

**Purpose**: Marketing, conversion, sign-up

**Layout**:
```
┌─────────────────────────────┐
│ [Logo]    Login | Sign Up   │ Header (sticky)
├─────────────────────────────┤
│                             │
│   Hero Section              │
│   • Headline                │
│   • Subheadline             │
│   • CTA: "Start Free"       │
│   • Screenshot/Demo         │
│                             │
├─────────────────────────────┤
│                             │
│   Problem Statement         │
│   • 3-column benefits       │
│                             │
├─────────────────────────────┤
│                             │
│   Features Grid             │
│   • Game Tracking           │
│   • Practice Plans          │
│   • Player Development      │
│   • Team Analytics          │
│                             │
├─────────────────────────────┤
│                             │
│   Pricing Table             │
│   • Free | Pro | Club       │
│                             │
├─────────────────────────────┤
│                             │
│   Footer                    │
│   • Links | Social | Legal  │
│                             │
└─────────────────────────────┘
```

**Key Elements**:
- Language selector (top-right)
- Clear value proposition
- Mobile-responsive grid
- Fast load time (<1s)
- Link to `/app` for application

---

### 4.2 Login Screen (`/app/login`)

**Layout**:
```
┌─────────────────────────────┐
│         [Logo]              │
│                             │
│   Welcome Back              │
│                             │
│   [Email Input]             │
│   [Password Input]          │
│   [Forgot Password?]        │
│                             │
│   [Login Button - Full]     │
│                             │
│   ───── or ─────            │
│                             │
│   [Continue with Google]    │ (Phase 2)
│                             │
│   Don't have account?       │
│   [Sign Up]                 │
│                             │
└─────────────────────────────┘
```

**Validation**:
- Email format check
- Password minimum length
- Inline error messages
- Loading state on submit

---

### 4.3 Dashboard (`/app/dashboard`)

**Purpose**: Home screen after login, overview of all teams

**Layout**:
```
┌─────────────────────────────┐
│ ☰ Coach Name       [+] 👤   │ Header
├─────────────────────────────┤
│                             │
│ My Teams (3)                │
│                             │
│ ┌─────────────────────────┐ │
│ │ U12 Dragons       →     │ │ Team Card
│ │ Last game: W 3-1        │ │
│ │ Next practice: Dec 2    │ │
│ │ Focus: Defensive Shape  │ │
│ └─────────────────────────┘ │
│                             │
│ ┌─────────────────────────┐ │
│ │ U14 Phoenix       →     │ │
│ │ Last game: L 1-2        │ │
│ │ Next practice: Dec 3    │ │
│ │ Focus: Ball Control     │ │
│ └─────────────────────────┘ │
│                             │
│ [+ Create New Team]         │
│                             │
├─────────────────────────────┤
│ Home | Teams | Profile      │ Bottom Nav
└─────────────────────────────┘
```

**Interactions**:
- Tap team card → Team detail
- Tap + → Create team
- Pull to refresh
- Empty state: "Create your first team"

---

### 4.4 Team Detail (`/app/teams/:id`)

**Layout**:
```
┌─────────────────────────────┐
│ ← U12 Dragons        ⋮      │ Header
├─────────────────────────────┤
│                             │
│ ┌─────────────────────────┐ │
│ │ Quick Stats (Last 5)    │ │ Stats Card
│ │ Chances Created: 3.2    │ │
│ │ Chances Conceded: 4.8   │ │
│ │ Recoveries: 8.4         │ │
│ │ Bad Touches: 12.2       │ │
│ └─────────────────────────┘ │
│                             │
│ ┌─────────────────────────┐ │
│ │ 🎯 Recommended Focus    │ │ Focus Card
│ │ Defensive Shape         │ │
│ │ [Generate Practice]     │ │
│ └─────────────────────────┘ │
│                             │
│ Players (18)                │
│ ┌───────────────────────┐   │
│ │ #7 Sarah Martinez  →  │   │ Player Row
│ │ Midfielder • ⭐⭐⭐⭐    │   │
│ └───────────────────────┘   │
│ ┌───────────────────────┐   │
│ │ #10 Jake Wilson    →  │   │
│ │ Forward • ⭐⭐⭐⭐⭐      │   │
│ └───────────────────────┘   │
│                             │
│ [+ Add Player]              │
│                             │
│ Recent Games (5)            │
│ ┌───────────────────────┐   │
│ │ Dec 1 vs Lions  W 3-1 │   │ Game Row
│ └───────────────────────┘   │
│                             │
│ [+ Track New Game]          │
│                             │
├─────────────────────────────┤
│ Home | Teams | Profile      │
└─────────────────────────────┘
```

**Menu Options (⋮)**:
- Edit Team Info
- View Analytics
- Delete Team

---

### 4.5 Game Tracking (`/app/games/:id/track`)

**Purpose**: Live game stat tracking (most critical screen)

**Layout**:
```
┌─────────────────────────────┐
│ ← U12 Dragons vs Lions      │
│ [Save Draft] [Finish Game]  │
├─────────────────────────────┤
│                             │
│ Opponent: [Lions FC      ]  │
│ Date: [Dec 1, 2025      ]   │
│                             │
│ ┌─────────────────────────┐ │
│ │ Chances Created      12 │ │ Stat Counter
│ │     [  -  ]  [  +  ]    │ │
│ └─────────────────────────┘ │
│                             │
│ ┌─────────────────────────┐ │
│ │ Chances Conceded      8 │ │
│ │     [  -  ]  [  +  ]    │ │
│ └─────────────────────────┘ │
│                             │
│ ┌─────────────────────────┐ │
│ │ Attacking Recoveries 14 │ │
│ │     [  -  ]  [  +  ]    │ │
│ └─────────────────────────┘ │
│                             │
│ ┌─────────────────────────┐ │
│ │ Bad Touch Losses     16 │ │
│ │     [  -  ]  [  +  ]    │ │
│ └─────────────────────────┘ │
│                             │
│ Notes:                      │
│ ┌───────────────────────┐   │
│ │                       │   │
│ │                       │   │
│ └───────────────────────┘   │
│                             │
│ [Finish & Save Game]        │
│                             │
└─────────────────────────────┘
```

**Key Features**:
- Large + / - buttons (80px x 80px)
- Haptic feedback on tap
- Auto-save every tap
- Offline capability
- Undo last action (shake to undo)
- Timer in header (optional)

---

### 4.6 Practice Plan Generator (`/app/practice/new`)

**Layout**:
```
┌─────────────────────────────┐
│ ← Generate Practice Plan    │
├─────────────────────────────┤
│                             │
│ Team: [Select Team ▼]       │
│                             │
│ Focus Area:                 │
│ ┌─────────────────────────┐ │
│ │ ○ Defensive Shape       │ │ Radio Group
│ │ ● Ball Control          │ │
│ │ ○ Attacking Movement    │ │
│ │ ○ Pressing              │ │
│ └─────────────────────────┘ │
│                             │
│ [Generate Plan]             │
│                             │
│ ─────────────────────────── │
│                             │
│ Generated Plan:             │
│                             │
│ ┌─────────────────────────┐ │
│ │ Drill 1: 1v1 Close Out  │ │ Drill Card
│ │ Duration: 10 min        │ │
│ │ • Coaching cue 1        │ │
│ │ • Coaching cue 2        │ │
│ └─────────────────────────┘ │
│                             │
│ ┌─────────────────────────┐ │
│ │ Drill 2: Defensive Tri. │ │
│ │ Duration: 15 min        │ │
│ │ • Coaching cue 1        │ │
│ └─────────────────────────┘ │
│                             │
│ ┌─────────────────────────┐ │
│ │ SSG: 4v4 No Turn        │ │
│ │ Duration: 15 min        │ │
│ └─────────────────────────┘ │
│                             │
│ [Regenerate] [Save Plan]    │
│                             │
└─────────────────────────────┘
```

**Interactions**:
- Auto-suggest focus based on recent games
- Regenerate creates new random selection
- Edit individual drills
- Export to PDF (Pro tier)

---

### 4.7 Player Development (`/app/players/:id/development`)

**Layout**:
```
┌─────────────────────────────┐
│ ← Sarah Martinez (#7)       │
├─────────────────────────────┤
│                             │
│ Position: Midfielder        │
│ Team: U12 Dragons           │
│                             │
│ ┌─────────────────────────┐ │
│ │ Strengths               │ │
│ │ • Passing               │ │
│ │ • Vision                │ │
│ │ • Work Rate             │ │
│ │ [Edit]                  │ │
│ └─────────────────────────┘ │
│                             │
│ ┌─────────────────────────┐ │
│ │ Areas to Improve        │ │
│ │ • First Touch           │ │
│ │ • Defensive Positioning │ │
│ │ [Edit]                  │ │
│ └─────────────────────────┘ │
│                             │
│ Monthly Ratings             │
│ ┌─────────────────────────┐ │
│ │     ▂▄▅▆█               │ │ Bar Chart
│ │   Oct Nov Dec Jan Feb   │ │
│ │    3  3  4  4  5        │ │
│ └─────────────────────────┘ │
│                             │
│ Coach Notes                 │
│ ┌───────────────────────┐   │
│ │ Great progress in...  │   │
│ │                       │   │
│ └───────────────────────┘   │
│                             │
│ [Export Report] (Pro)       │
│                             │
└─────────────────────────────┘
```

---

## 5. User Flows

### 5.1 First-Time User Onboarding

```
Landing Page
    ↓ Click "Start Free"
Sign Up Form
    ↓ Submit
Email Verification (optional Phase 2)
    ↓
Welcome Screen
    ↓ "Create Your First Team"
Team Creation Form
    ↓ Submit
Team Dashboard (empty state)
    ↓ Prompt: "Add Players"
Player Creation Form
    ↓ Add 3-5 players
Team Dashboard
    ↓ Prompt: "Track Your First Game"
Game Tracking Screen
    ↓ Complete
Team Analytics (populated)
```

### 5.2 Game Day Flow

```
Dashboard
    ↓ Select Team
Team Detail
    ↓ "Track New Game"
Game Tracking Screen
    ↓ Tap stats during game
    ↓ Auto-save every tap
    ↓ "Finish Game"
Game Summary
    ↓
Team Analytics (updated)
    ↓ View new focus suggestion
Practice Plan Generator
```

### 5.3 Practice Planning Flow

```
Team Detail
    ↓ View recommended focus
    ↓ "Generate Practice"
Practice Generator
    ↓ Select focus (auto-populated)
    ↓ "Generate"
Practice Plan Display
    ↓ Review drills
    ↓ "Save Plan"
Team Detail (updated with plan)
    ↓ Export PDF (Pro)
```

---

## 6. Mobile-First Considerations

### Touch Targets
- Minimum: 44x44px (Apple HIG)
- Recommended: 48x48px (Material Design)
- Critical actions (game tracking): 80x80px
- Spacing between targets: 8px minimum

### Gestures
- **Swipe left on list item**: Quick actions (delete, edit)
- **Pull to refresh**: Update data
- **Shake to undo**: In game tracking
- **Long press**: Context menu
- **Pinch to zoom**: Charts and graphs

### Performance
- Lazy load images
- Virtual scrolling for long lists
- Optimistic UI updates
- Service worker for offline
- IndexedDB for local cache

### Responsive Breakpoints
- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

---

## 7. Accessibility & Internationalization

### Accessibility (WCAG 2.1 AA)

#### Color Contrast
- Text on background: 4.5:1 minimum
- Large text: 3:1 minimum
- Interactive elements: 3:1 minimum

#### Keyboard Navigation
- All actions accessible via keyboard
- Visible focus indicators
- Logical tab order
- Skip navigation links

#### Screen Readers
- Semantic HTML (header, nav, main, footer)
- ARIA labels for icons
- Alt text for images
- Live regions for dynamic content

#### Labels
- Clear, descriptive labels
- Error messages associated with inputs
- Form validation messages
- Loading states announced

### Internationalization (i18n)

#### Supported Languages (MVP)
- English (en)
- Spanish (es)
- Portuguese (pt)
- German (de)
- French (fr)

#### Implementation
- react-i18next for translations
- Language selector in header
- Persist language preference
- Date/time localization
- Number formatting (metrics)
- RTL support (Phase 2)

#### Translation Keys Structure
```
{
  "nav": {
    "home": "Home",
    "teams": "Teams",
    "profile": "Profile"
  },
  "team": {
    "create": "Create Team",
    "name": "Team Name",
    "ageGroup": "Age Group"
  },
  "game": {
    "chancesCreated": "Chances Created",
    "chancesAgainst": "Chances Conceded"
  }
}
```

---

## 8. Empty States & Error Handling

### Empty States

#### No Teams
```
┌─────────────────────────────┐
│     [Soccer Ball Icon]      │
│                             │
│   No Teams Yet              │
│   Create your first team    │
│   to get started            │
│                             │
│   [Create Team]             │
└─────────────────────────────┘
```

#### No Players
```
┌─────────────────────────────┐
│     [Players Icon]          │
│                             │
│   No Players                │
│   Add players to your team  │
│                             │
│   [Add Player]              │
└─────────────────────────────┘
```

#### No Games
```
┌─────────────────────────────┐
│     [Whistle Icon]          │
│                             │
│   No Games Tracked          │
│   Track your first game     │
│   to see analytics          │
│                             │
│   [Track Game]              │
└─────────────────────────────┘
```

### Error States

#### Network Error
```
┌─────────────────────────────┐
│     [Offline Icon]          │
│                             │
│   Connection Lost           │
│   Your changes are saved    │
│   locally and will sync     │
│                             │
│   [Retry]                   │
└─────────────────────────────┘
```

#### Form Validation
- Inline error messages below field
- Red border on invalid field
- Clear error message
- Focus on first error

---

## 9. Animations & Transitions

### Micro-interactions
- Button press: Scale 0.95 (100ms)
- Card tap: Background flash (200ms)
- Toggle: Slide animation (300ms)
- List add: Slide in from right (300ms)
- List remove: Slide out left (300ms)

### Page Transitions
- Route change: Fade (200ms)
- Modal open: Slide up (300ms)
- Modal close: Slide down (200ms)
- Tab change: Cross-fade (150ms)

### Loading States
- Button: Spinner replaces text
- List: Skeleton screens
- Page: Top progress bar
- Pull to refresh: Native spinner

---

## 10. Design Deliverables Checklist

- [x] Color palette defined
- [x] Typography scale defined
- [x] Spacing system defined
- [x] Component library specified
- [x] All screens specified
- [x] User flows documented
- [x] Mobile considerations outlined
- [x] Accessibility requirements defined
- [x] i18n strategy defined
- [x] Empty states designed
- [x] Error states designed
- [x] Animation guidelines defined

---

## Next Steps

1. Review this design document
2. Approve or request changes
3. Begin implementation following task plan
4. Create component library in React
5. Implement screens in priority order
6. Test with real coaches
7. Iterate based on feedback

---

**Document Status**: Draft for Review
**Last Updated**: 2025-11-23
**Author**: AI Development Team
