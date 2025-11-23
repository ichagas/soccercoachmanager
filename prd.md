# PRD: Simple Soccer Coaching SaaS  
## Version 1.0  
## Tech Stack: PocketBase + ReactJS  
## Prepared for: Engineering & Design  
## Date: 2025-11-23

---

# 1. Product Overview
A web app that lets soccer coaches track minimal game statistics, manage team and player development, and automatically generate practice plans based on trends.

The app is fully served by:
- **PocketBase** → database, API, authentication, file storage
- **ReactJS** → SPA frontend served by PocketBase static hosting

---

# 2. Core MVP Features
Below are the functional requirements for the MVP launch.

---

# 2.1 User Accounts & Auth
- Users create an account with:
  - Email/password
  - OAuth (Google) – optional Phase 2
- Manage profile (name, club, badge level)
- Password reset
- Free vs. Pro permissions

PocketBase:
- `users` collection
- Auth rules blocking cross-user data

---

# 2.2 Team Management
### Requirements
- Create/delete/edit teams
- Assign season (optional)
- Add players to teams
- View team dashboard:
  - Last 5 games metrics
  - Suggested weekly training focus
  - Quick links to next practice plan

### Data Model (`teams`)
```

* id
* user_id
* name
* season
* age_group
* created_at

```

---

# 2.3 Player Management
### Requirements
- Add/edit players
- Assign player position(s)
- Add strengths (max 3)
- Add areas to improve (max 3)
- Monthly ratings (1–5)
- Notes

### Data Model (`players`)
```

* id
* team_id
* name
* number
* position
* strengths (array)
* improvements (array)
* monthly_rating (JSON)
* notes (text)

```

---

# 2.4 Game Stats Tracking (Live or After-Game)
### Minimal metrics (MVP)
- Chances Created  
- Chances Conceded  
- Attacking-Half Recoveries  
- Bad Touch Losses  

### Requirements
- “Start Game Tracking” mobile page
- 1-tap buttons for metrics
- Notes field
- Save as draft or final
- Edit after game

### Data Model (`games`)
```

* id
* team_id
* opponent
* date
* chances_created
* chances_conceded
* recoveries
* bad_touches
* notes

```

---

# 2.5 Team Analytics & Suggestions
### Requirements
- Compute rolling averages (last 5 matches)
- Compare to benchmark thresholds
- Auto-generate focus area:
  - E.g., “High chances conceded → Defensive Shape week”

### Logic Example
```

if chances_conceded > 4 avg:
focus = "Defensive Shape"
else if bad_touches > 10 avg:
focus = "Ball Control & First Touch"
...

```

---

# 2.6 Practice Plan Generator
### Requirements
- User selects:
  - Focus: Defense / Attack / Control / Pressing
- System auto-selects:
  - 2 drills from JSON library
  - 1 small-sided game
  - Coaching cues
  - Duration
- User can regenerate or customize
- Save to team’s weekly plan

### Data Model (`practice_plans`)
```

* id
* team_id
* focus
* drills (JSON)
* created_at

```

### Library Example (local JSON)
```

{
"focus": "defense",
"drills": [
{ "name": "1v1 Close Out", "duration": 10, "cues": [...] },
{ "name": "Defensive Triangle", "duration": 15, "cues": [...] }
],
"ssg": { "name": "4v4 No Turn", "duration": 15 }
}

```

---

# 2.7 Player Development Dashboard
### Requirements
- Per-player summary:
  - Strengths
  - Weak areas
  - Ratings over time (simple bar graph)
  - Notes
- Export PDF (Phase 2)

---

# 2.8 Reporting (MVP Simple Export)
- Export Game Report (PDF or text) from PocketBase
- Export Practice Plan to PDF  
(PDF generation can be Phase 2 if needed)

---

# 3. Non-Functional Requirements
### Performance
- Load game tracking screen in < 150ms
- Buttons must respond instantly
- Offline-first interactions ideal (PB caching)

### Security
- PocketBase rules ensuring row-level user isolation
- HTTPS enforced

### Usability
- Entire app must be operable with one hand on smartphone
- Large tap areas for in-game buttons

### Reliability
- Auto-save every stat tap
- Prevent data loss if connection drops

---

# 4. Technical Architecture

### Frontend (React)
- SPA
- Routes:
  - `/login`
  - `/teams`
  - `/teams/:id`
  - `/players/:id`
  - `/games/new`
  - `/practice/new`

### Backend (PocketBase)
- Collections:
  - users
  - teams
  - players
  - games
  - practice_plans

### Deployment
- Build React → upload `dist` to PocketBase `/pb_public`
- PocketBase self-hosted or VPS
- Use PocketBase Admin UI for CRUD management

---

# 5. Development Plan (MVP)
### Sprint 1 — Foundation
- PB setup, collections, auth
- React structure + routing
- Team & player CRUD

### Sprint 2 — Game Tracking Module
- Live tracking interface
- Save/edit game stats
- Team dashboard and rolling averages

### Sprint 3 — Practice Plan Generator
- JSON drill library
- Practice generation UI
- Save to DB + list view

### Sprint 4 — Player Dashboard + Polish
- Player development UI
- Notes & ratings
- Mobile layout improvements
- Freemium limits

---

# 6. Out of Scope (MVP)
- Video upload/tagging
- Advanced stats
- Tactical animations
- Multi-coach roles (Club Tier)
- Native mobile app
- AI drill generation

---

# 7. Acceptance Criteria
- A coach can create a team and players
- A coach can track a full game with 3–4 taps
- A coach sees clear “training focus” suggestions
- A practice plan can be generated and saved
- A team’s last 5 games impact the practice suggestions
- Free vs. Pro limits enforced

---

# 8. Appendices
- Sample UI sketches (future)
- Drill library v1 (JSON)
- Benchmark thresholds
```

---

If you want, I can now generate:

### ✔ UI Wireframes (ASCII or visual)

### ✔ Database schema diagram

### ✔ API endpoints list

### ✔ Sprint backlog (Jira style)

### ✔ Drill library JSON starter pack

Just tell me!
