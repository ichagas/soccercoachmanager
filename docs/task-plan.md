# Task Plan: Soccer Coach Manager Implementation
## Version 1.0
## Date: 2025-11-23

---

## Table of Contents
1. Overview
2. Project Phases
3. Detailed Task Breakdown
4. Testing Strategy
5. Definition of Done
6. Timeline & Dependencies

---

## 1. Overview

### Project Scope
Implement a complete Soccer Coach Manager SaaS application using:
- **Frontend**: React.js with TypeScript, Tailwind CSS, i18next
- **Backend**: PocketBase (database, auth, API, static hosting)
- **Testing**: Vitest, React Testing Library
- **Build**: Vite

### Key Deliverables
1. Landing page (static HTML)
2. React SPA in `/app`
3. PocketBase database schema and migrations
4. Full test coverage for React app
5. International language support (5 languages)
6. Deployment scripts

### Definition of Done
- All tests passing (unit + integration)
- All features implemented per PRD
- i18n support for 5 languages
- Landing page deployed to `/`
- React app deployed to `/app`
- Documentation complete
- Code committed and pushed to branch

---

## 2. Project Phases

### Phase 1: Foundation & Setup (Sprint 1)
- PocketBase setup and schema
- React app structure
- Design system implementation
- i18n setup
- Landing page

### Phase 2: Core Features (Sprint 2)
- Authentication flows
- Team management
- Player management
- Basic CRUD operations

### Phase 3: Game Tracking (Sprint 3)
- Game tracking interface
- Live stat recording
- Analytics and insights
- Team dashboard

### Phase 4: Practice Plans (Sprint 4)
- Practice plan generator
- Drill library
- Plan management
- Focus recommendations

### Phase 5: Polish & Testing (Sprint 5)
- Complete test coverage
- Error handling
- Loading states
- Performance optimization
- Final integration testing

---

## 3. Detailed Task Breakdown

### PHASE 1: FOUNDATION & SETUP

#### 1.1 PocketBase Setup
- [ ] **1.1.1** Review existing PocketBase directory structure
  - Check `pb_hooks/`, `pb_migrations/`, `pb_public/`
  - Clean up any template files from previous project

- [ ] **1.1.2** Create PocketBase collections schema
  - `users` collection (extends PocketBase auth)
    - Add fields: `club_name`, `badge_level`, `subscription_tier`
  - `teams` collection
    - Fields: `user_id`, `name`, `season`, `age_group`, `created_at`
  - `players` collection
    - Fields: `team_id`, `name`, `number`, `position`, `strengths`, `improvements`, `monthly_rating`, `notes`
  - `games` collection
    - Fields: `team_id`, `opponent`, `date`, `chances_created`, `chances_conceded`, `recoveries`, `bad_touches`, `notes`, `status`
  - `practice_plans` collection
    - Fields: `team_id`, `focus`, `drills`, `created_at`, `week_of`

- [ ] **1.1.3** Create PocketBase migrations
  - Write migration file for initial schema
  - Test migration locally
  - Document schema in `docs/database-schema.md`

- [ ] **1.1.4** Configure PocketBase rules
  - User isolation rules (users can only access their own data)
  - Team access rules
  - Player access rules
  - Game access rules
  - Practice plan access rules
  - Document security rules

- [ ] **1.1.5** Create drill library JSON
  - Create `pb_public/data/drills.json`
  - Add drills for each focus area:
    - Defensive Shape (5 drills + 2 SSGs)
    - Ball Control (5 drills + 2 SSGs)
    - Attacking Movement (5 drills + 2 SSGs)
    - Pressing (5 drills + 2 SSGs)
  - Include coaching cues, duration, setup

- [ ] **1.1.6** Test PocketBase setup
  - Start PocketBase locally
  - Create test collections via admin UI
  - Verify API endpoints
  - Test authentication

#### 1.2 React App Structure

- [ ] **1.2.1** Clean up template files
  - Remove old project files from `src/`
  - Clean up `pb_hooks/` if contains old project code
  - Update `index.html` title and meta

- [ ] **1.2.2** Create React app directory structure
  ```
  src/
  ├── components/
  │   ├── ui/              # Reusable UI components
  │   ├── layout/          # Layout components
  │   └── features/        # Feature-specific components
  ├── pages/               # Route pages
  ├── hooks/               # Custom React hooks
  ├── lib/                 # Utilities and helpers
  │   ├── pocketbase.ts    # PB client setup
  │   ├── utils.ts         # General utilities
  │   └── analytics.ts     # Analytics logic
  ├── types/               # TypeScript types
  ├── i18n/                # Translations
  │   ├── en.json
  │   ├── es.json
  │   ├── pt.json
  │   ├── de.json
  │   └── fr.json
  ├── __tests__/           # Tests
  │   ├── components/
  │   ├── pages/
  │   └── integration/
  ├── App.tsx
  ├── main.tsx
  └── index.css
  ```

- [ ] **1.2.3** Setup routing
  - Install and configure react-router-dom
  - Create route structure
  - Create route components (placeholders)
  - Setup protected routes
  - Test navigation

- [ ] **1.2.4** Create TypeScript types
  - `types/user.ts` - User model
  - `types/team.ts` - Team model
  - `types/player.ts` - Player model
  - `types/game.ts` - Game model
  - `types/practice.ts` - Practice plan model
  - `types/drill.ts` - Drill model

- [ ] **1.2.5** Setup PocketBase client
  - Create `lib/pocketbase.ts`
  - Configure client instance
  - Create auth helpers
  - Create API service functions
  - Add TypeScript types for PB responses

#### 1.3 Design System Implementation

- [ ] **1.3.1** Setup Tailwind CSS (already configured)
  - Verify tailwind.config.js
  - Add custom colors to theme
  - Add custom spacing
  - Add custom font sizes
  - Test Tailwind build

- [ ] **1.3.2** Create base UI components
  - `components/ui/Button.tsx` (Primary, Secondary, Danger, Icon)
  - `components/ui/Input.tsx`
  - `components/ui/Select.tsx`
  - `components/ui/Textarea.tsx`
  - `components/ui/Card.tsx`
  - `components/ui/Badge.tsx`
  - `components/ui/Modal.tsx`
  - `components/ui/Toast.tsx`
  - `components/ui/Spinner.tsx`
  - `components/ui/EmptyState.tsx`

- [ ] **1.3.3** Create layout components
  - `components/layout/Header.tsx`
  - `components/layout/BottomNav.tsx`
  - `components/layout/PageContainer.tsx`
  - `components/layout/AuthLayout.tsx`

- [ ] **1.3.4** Create component tests
  - Test each UI component
  - Test accessibility (ARIA labels)
  - Test keyboard navigation
  - Test responsive behavior

#### 1.4 i18n Setup

- [ ] **1.4.1** Configure i18next
  - Setup i18next in `main.tsx`
  - Configure language detection
  - Setup fallback language
  - Test language switching

- [ ] **1.4.2** Create translation files
  - `i18n/en.json` (English - master)
  - `i18n/es.json` (Spanish)
  - `i18n/pt.json` (Portuguese)
  - `i18n/de.json` (German)
  - `i18n/fr.json` (French)

- [ ] **1.4.3** Create translation keys structure
  - Navigation keys
  - Common UI keys
  - Form labels and errors
  - Team management keys
  - Player management keys
  - Game tracking keys
  - Practice plan keys
  - Validation messages

- [ ] **1.4.4** Create LanguageSelector component
  - Dropdown with flag icons
  - Persist selection to localStorage
  - Test language switching

- [ ] **1.4.5** Test i18n
  - Test all 5 languages
  - Test fallback behavior
  - Test pluralization
  - Test date/number formatting

#### 1.5 Landing Page

- [ ] **1.5.1** Update root `index.html`
  - Remove React app references
  - Create standalone HTML structure
  - Add meta tags for SEO
  - Add Open Graph tags
  - Add language selector

- [ ] **1.5.2** Create landing page sections
  - Hero section with CTA
  - Problem statement (3 columns)
  - Features grid (4 features)
  - Pricing table (Free, Pro, Club)
  - Footer with links

- [ ] **1.5.3** Style landing page
  - Add inline CSS or separate stylesheet
  - Ensure mobile-responsive
  - Match design system colors
  - Add animations/transitions

- [ ] **1.5.4** Test landing page
  - Test on mobile devices
  - Test all CTAs link to `/app`
  - Test language selector
  - Test performance (Lighthouse)
  - Validate HTML

- [ ] **1.5.5** Create separate HTML for React app
  - Create `src/index.html` for React app
  - Update Vite config to use src/index.html
  - Ensure build outputs to `pb_public/app/`

---

### PHASE 2: CORE FEATURES

#### 2.1 Authentication

- [ ] **2.1.1** Create Login page (`/app/login`)
  - Email/password form
  - Form validation
  - Error handling
  - Loading states
  - "Forgot password" link
  - "Sign up" link

- [ ] **2.1.2** Create Register page (`/app/register`)
  - Registration form (email, password, name, club)
  - Form validation
  - Password strength indicator
  - Terms acceptance
  - Redirect to dashboard after registration

- [ ] **2.1.3** Create Forgot Password page
  - Email input
  - Send reset email
  - Success message
  - Error handling

- [ ] **2.1.4** Create auth context/hook
  - `hooks/useAuth.ts`
  - Login function
  - Logout function
  - Register function
  - Get current user
  - Auth state management

- [ ] **2.1.5** Implement protected routes
  - Check auth status
  - Redirect to login if not authenticated
  - Persist auth state
  - Handle token refresh

- [ ] **2.1.6** Test authentication
  - Test login flow
  - Test registration flow
  - Test logout
  - Test password reset
  - Test protected routes
  - Test token expiration

#### 2.2 Team Management

- [ ] **2.2.1** Create Dashboard page (`/app/dashboard`)
  - List all user's teams
  - Team card component
  - Empty state (no teams)
  - "Create team" button
  - Pull to refresh

- [ ] **2.2.2** Create Team List component
  - Display team cards
  - Show last game info
  - Show next practice
  - Show focus area
  - Click to view detail

- [ ] **2.2.3** Create Team Detail page (`/app/teams/:id`)
  - Team header with name
  - Quick stats (last 5 games)
  - Recommended focus card
  - Player list
  - Recent games list
  - Action buttons (edit, delete)

- [ ] **2.2.4** Create Team Form (Create/Edit)
  - Team name input
  - Season input
  - Age group select
  - Form validation
  - Save to PocketBase
  - Success/error handling

- [ ] **2.2.5** Implement team CRUD operations
  - Create team API call
  - Read team(s) API call
  - Update team API call
  - Delete team API call
  - Handle errors

- [ ] **2.2.6** Test team management
  - Test create team
  - Test edit team
  - Test delete team
  - Test team list
  - Test team detail
  - Test empty states
  - Test error handling

#### 2.3 Player Management

- [ ] **2.3.1** Create Player List component
  - Display players for a team
  - Player card/row
  - Show position, number, rating
  - Click to view detail
  - "Add player" button

- [ ] **2.3.2** Create Player Detail page (`/app/players/:id`)
  - Player header (name, number, position)
  - Strengths list
  - Areas to improve list
  - Monthly ratings chart
  - Coach notes
  - Edit button

- [ ] **2.3.3** Create Player Form (Create/Edit)
  - Name input
  - Number input
  - Position select
  - Strengths (max 3 tags)
  - Improvements (max 3 tags)
  - Monthly rating (1-5 stars)
  - Notes textarea
  - Form validation

- [ ] **2.3.4** Implement player CRUD operations
  - Create player API call
  - Read player(s) API call
  - Update player API call
  - Delete player API call
  - Handle errors

- [ ] **2.3.5** Create rating visualization
  - Bar chart for monthly ratings
  - Simple SVG or canvas chart
  - Mobile-friendly
  - Interactive tooltips

- [ ] **2.3.6** Test player management
  - Test create player
  - Test edit player
  - Test delete player
  - Test player list
  - Test player detail
  - Test rating input
  - Test chart rendering

---

### PHASE 3: GAME TRACKING

#### 3.1 Game Tracking Interface

- [ ] **3.1.1** Create Game Tracking page (`/app/games/:id/track`)
  - Opponent input
  - Date picker
  - Stat counters (4 metrics)
  - Large +/- buttons
  - Notes textarea
  - "Save draft" button
  - "Finish game" button

- [ ] **3.1.2** Create StatCounter component
  - Display metric name
  - Display current value
  - Large + button
  - Large - button
  - Haptic feedback (if supported)
  - Optimistic updates

- [ ] **3.1.3** Implement auto-save
  - Save to PocketBase on every tap
  - Handle offline mode
  - Queue updates when offline
  - Sync when back online
  - Show sync status

- [ ] **3.1.4** Implement game CRUD operations
  - Create game (draft)
  - Update game stats
  - Finish game (change status)
  - Read game(s)
  - Delete game

- [ ] **3.1.5** Create Game List component
  - Display recent games
  - Game card (opponent, date, score)
  - Click to view/edit
  - Filter by team

- [ ] **3.1.6** Test game tracking
  - Test stat increment/decrement
  - Test auto-save
  - Test offline mode
  - Test draft vs finished
  - Test game list
  - Test edit after finish

#### 3.2 Analytics & Insights

- [ ] **3.2.1** Create analytics logic (`lib/analytics.ts`)
  - Calculate rolling averages (last 5 games)
  - Compare to benchmark thresholds
  - Determine focus area
  - Generate recommendations

- [ ] **3.2.2** Define benchmark thresholds
  - Chances created (good: >3, poor: <2)
  - Chances conceded (good: <3, poor: >5)
  - Recoveries (good: >8, poor: <5)
  - Bad touches (good: <8, poor: >12)

- [ ] **3.2.3** Create Team Analytics component
  - Display rolling averages
  - Show comparison to benchmarks
  - Visual indicators (green/yellow/red)
  - Trend arrows
  - Focus recommendation

- [ ] **3.2.4** Update Team Detail with analytics
  - Add analytics card
  - Show recommended focus
  - Link to practice generator
  - Update after each game

- [ ] **3.2.5** Test analytics
  - Test calculation with mock data
  - Test edge cases (less than 5 games)
  - Test benchmark comparison
  - Test focus recommendation
  - Test UI rendering

---

### PHASE 4: PRACTICE PLANS

#### 4.1 Practice Plan Generator

- [ ] **4.1.1** Create Practice Generator page (`/app/practice/new`)
  - Team selector
  - Focus area radio group
  - "Generate" button
  - Generated plan display
  - "Regenerate" button
  - "Save plan" button

- [ ] **4.1.2** Create drill selection logic
  - Load drills from JSON
  - Filter by focus area
  - Randomly select 2 drills
  - Randomly select 1 SSG
  - Calculate total duration

- [ ] **4.1.3** Create DrillCard component
  - Display drill name
  - Show duration
  - List coaching cues
  - Expand/collapse detail
  - Edit button (Phase 2)

- [ ] **4.1.4** Create PracticePlan component
  - Display all drills
  - Show total duration
  - Print-friendly layout
  - Export to PDF (Pro tier)

- [ ] **4.1.5** Implement practice plan CRUD
  - Create practice plan
  - Read practice plan(s)
  - Update practice plan
  - Delete practice plan
  - Associate with team

- [ ] **4.1.6** Create Practice Plan List
  - Display saved plans
  - Filter by team
  - Sort by date
  - Click to view detail

- [ ] **4.1.7** Test practice plans
  - Test generation logic
  - Test randomization
  - Test drill display
  - Test save/load
  - Test plan list
  - Test with different focus areas

#### 4.2 Focus Recommendations

- [ ] **4.2.1** Link analytics to practice
  - Auto-populate focus based on team analytics
  - Show why focus is recommended
  - Allow manual override
  - Save recommendation with plan

- [ ] **4.2.2** Create recommendation UI
  - Display on team detail
  - Show reasoning
  - Quick action to generate practice
  - Dismissible if not needed

- [ ] **4.2.3** Test recommendations
  - Test with different game stats
  - Test recommendation logic
  - Test UI display
  - Test user override

---

### PHASE 5: POLISH & TESTING

#### 5.1 Complete Test Coverage

- [ ] **5.1.1** Unit tests for components
  - Test all UI components
  - Test form validation
  - Test user interactions
  - Test error states
  - Target: 80%+ coverage

- [ ] **5.1.2** Integration tests
  - Test auth flows
  - Test team management flows
  - Test player management flows
  - Test game tracking flows
  - Test practice plan flows

- [ ] **5.1.3** Test utilities and helpers
  - Test analytics calculations
  - Test date formatting
  - Test number formatting
  - Test validation functions

- [ ] **5.1.4** Test i18n
  - Test translations in all languages
  - Test missing key fallback
  - Test pluralization
  - Test date/number localization

- [ ] **5.1.5** Test PocketBase integration
  - Mock PocketBase API
  - Test error handling
  - Test offline behavior
  - Test auth token refresh

- [ ] **5.1.6** Run full test suite
  - Fix all failing tests
  - Achieve 80%+ coverage
  - Generate coverage report
  - Document test results

#### 5.2 Error Handling & UX Polish

- [ ] **5.2.1** Implement global error boundary
  - Catch React errors
  - Display user-friendly message
  - Log errors for debugging
  - Provide recovery options

- [ ] **5.2.2** Add loading states
  - Skeleton screens for lists
  - Spinners for actions
  - Progress bars for uploads
  - Disable buttons during loading

- [ ] **5.2.3** Add success feedback
  - Toast notifications
  - Success messages
  - Confirmation dialogs
  - Undo actions where applicable

- [ ] **5.2.4** Improve error messages
  - User-friendly language
  - Actionable suggestions
  - Translated messages
  - Consistent formatting

- [ ] **5.2.5** Add offline support
  - Service worker for caching
  - Offline indicator
  - Queue actions when offline
  - Sync when back online

- [ ] **5.2.6** Accessibility improvements
  - Keyboard navigation
  - ARIA labels
  - Focus management
  - Screen reader testing

#### 5.3 Performance Optimization

- [ ] **5.3.1** Code splitting
  - Lazy load routes
  - Lazy load heavy components
  - Reduce bundle size
  - Test bundle size

- [ ] **5.3.2** Image optimization
  - Compress images
  - Lazy load images
  - Use appropriate formats
  - Add placeholders

- [ ] **5.3.3** Caching strategy
  - Cache PocketBase data
  - Cache drill library
  - Invalidate on updates
  - Test cache behavior

- [ ] **5.3.4** Performance testing
  - Run Lighthouse audit
  - Measure load time
  - Measure interaction time
  - Optimize as needed
  - Target: 90+ performance score

#### 5.4 Final Integration Testing

- [ ] **5.4.1** End-to-end user flows
  - Complete onboarding flow
  - Complete game day flow
  - Complete practice planning flow
  - Test across browsers
  - Test on mobile devices

- [ ] **5.4.2** Cross-browser testing
  - Chrome
  - Safari
  - Firefox
  - Edge
  - Mobile browsers

- [ ] **5.4.3** Responsive testing
  - Test on mobile (375px)
  - Test on tablet (768px)
  - Test on desktop (1440px)
  - Test landscape orientation
  - Fix layout issues

- [ ] **5.4.4** Security testing
  - Test auth bypass attempts
  - Test data isolation
  - Test CSRF protection
  - Test XSS vulnerabilities
  - Test SQL injection (PB handles this)

---

### PHASE 6: DEPLOYMENT & DOCUMENTATION

#### 6.1 Build & Deployment

- [ ] **6.1.1** Update build scripts
  - Review `scripts/build.sh`
  - Ensure React app builds to `pb_public/app/`
  - Ensure landing page copies to `pb_public/`
  - Test build locally

- [ ] **6.1.2** Test production build
  - Build React app
  - Copy to pb_public/app/
  - Copy landing page to pb_public/
  - Start PocketBase
  - Test full app in production mode

- [ ] **6.1.3** Create deployment documentation
  - Document deployment steps
  - Document environment variables
  - Document PocketBase setup
  - Create deployment checklist

- [ ] **6.1.4** PocketBase hooks testing (if needed)
  - Create CURL test scripts
  - Test hooks functionality
  - Document test procedures
  - Place scripts in `pb_hooks/tests/`

#### 6.2 Documentation

- [ ] **6.2.1** Update README.md
  - Project description
  - Features list
  - Installation instructions
  - Development setup
  - Build and deployment
  - Testing instructions

- [ ] **6.2.2** Create user documentation
  - Getting started guide
  - Feature tutorials
  - FAQ section
  - Troubleshooting guide

- [ ] **6.2.3** Create developer documentation
  - Architecture overview
  - Component documentation
  - API documentation
  - Testing guide
  - Contributing guide

- [ ] **6.2.4** Document database schema
  - Collections overview
  - Field descriptions
  - Relationships
  - Security rules

#### 6.3 Final Checks

- [ ] **6.3.1** Code quality
  - Run ESLint
  - Fix linting errors
  - Run TypeScript type check
  - Fix type errors

- [ ] **6.3.2** Final test run
  - Run full test suite
  - All tests passing
  - No console errors
  - No console warnings

- [ ] **6.3.3** Git commit and push
  - Review all changes
  - Write descriptive commit message
  - Commit to branch: `claude/plan-react-pocketbase-01GKR6UDzVJYvzkd2icoGhpd`
  - Push to remote

---

## 4. Testing Strategy

### Test Types

#### Unit Tests
- **Coverage Target**: 80%+
- **Tools**: Vitest, React Testing Library
- **Scope**:
  - Individual components
  - Utility functions
  - Custom hooks
  - Analytics logic

#### Integration Tests
- **Coverage Target**: All major flows
- **Tools**: Vitest, React Testing Library
- **Scope**:
  - Complete user flows
  - API integration
  - Multi-component interactions

#### Manual Testing
- **Scope**:
  - Cross-browser compatibility
  - Mobile device testing
  - Accessibility testing
  - Performance testing

### Test Scripts

```bash
npm run test              # Run tests in watch mode
npm run test:run          # Run tests once
npm run test:coverage     # Generate coverage report
npm run test:ui           # Visual test UI
```

### PocketBase Hook Testing

Since PocketBase hooks don't support the same test framework as React, create simple CURL scripts:

```bash
# Example: pb_hooks/tests/test_auth.sh
curl -X POST http://localhost:8090/api/collections/users/auth-with-password \
  -H "Content-Type: application/json" \
  -d '{"identity":"test@example.com","password":"test1234"}'
```

---

## 5. Definition of Done

### Feature Complete
- [ ] All PRD requirements implemented
- [ ] All UI/UX design specifications met
- [ ] All user flows working end-to-end

### Quality
- [ ] All tests passing
- [ ] Test coverage ≥80%
- [ ] No ESLint errors
- [ ] No TypeScript errors
- [ ] No console errors or warnings

### i18n
- [ ] All 5 languages implemented
- [ ] All UI text translated
- [ ] Language selector working
- [ ] Date/number formatting correct

### Performance
- [ ] Lighthouse score ≥90
- [ ] Page load time <1s
- [ ] Interaction time <100ms
- [ ] Bundle size optimized

### Deployment
- [ ] Landing page at `/`
- [ ] React app at `/app`
- [ ] All assets in `pb_public/`
- [ ] Build script working
- [ ] PocketBase configured

### Documentation
- [ ] README updated
- [ ] User guide created
- [ ] Developer docs created
- [ ] Database schema documented
- [ ] Deployment guide created

### Git
- [ ] All changes committed
- [ ] Descriptive commit messages
- [ ] Pushed to correct branch
- [ ] No merge conflicts

---

## 6. Implementation Order & Dependencies

### Priority 1 (Must have first)
1. PocketBase schema and migrations
2. React app structure and routing
3. UI component library
4. i18n setup
5. Authentication

### Priority 2 (Core features)
6. Team management
7. Player management
8. Dashboard

### Priority 3 (Key differentiators)
9. Game tracking
10. Analytics
11. Practice plan generator

### Priority 4 (Polish)
12. Landing page
13. Complete testing
14. Error handling
15. Performance optimization

### Priority 5 (Final)
16. Documentation
17. Deployment
18. Final review

---

## 7. Risk Mitigation

### Technical Risks

**Risk**: PocketBase learning curve
- **Mitigation**: Start with simple CRUD, reference documentation, test incrementally

**Risk**: Complex analytics logic
- **Mitigation**: Start with simple calculations, add tests, iterate

**Risk**: Offline sync complexity
- **Mitigation**: Use PocketBase realtime features, implement simple queue

### Scope Risks

**Risk**: Feature creep
- **Mitigation**: Stick to PRD, mark additional features as Phase 2

**Risk**: Over-engineering
- **Mitigation**: Build simplest solution first, refactor only if needed

### Timeline Risks

**Risk**: Underestimating task complexity
- **Mitigation**: Break tasks into smaller chunks, track progress daily

---

## 8. Questions for Clarification

Before starting implementation, please confirm:

1. **Language Priority**: Should all 5 languages be fully translated, or can we start with English and partial translations?

2. **PDF Export**: Is PDF generation required for MVP, or can this be Phase 2?

3. **OAuth**: Is Google OAuth required for MVP, or can this be Phase 2?

4. **Freemium Limits**: Should we implement subscription tier limits in MVP, or focus on feature completion first?

5. **Mobile Native**: Confirm this is web-only for MVP, no native apps?

6. **Hosting**: Is PocketBase already deployed somewhere, or do we need deployment instructions?

7. **Design Assets**: Do you have any specific logo, colors, or branding assets to use?

8. **Sample Data**: Should we create seed data for demos/testing?

---

## Next Steps

1. **Review this task plan**
2. **Answer clarification questions**
3. **Approve to proceed**
4. **Begin Phase 1 implementation**

---

**Status**: Awaiting Approval
**Last Updated**: 2025-11-23
**Estimated Effort**: 5-6 sprints (2 weeks each)
