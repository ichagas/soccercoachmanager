# PocketBase Database Schema
## Soccer Coach Manager
### Version 1.0
### Date: 2025-11-23

---

## Overview

This document defines the complete PocketBase database schema for the Soccer Coach Manager application.

---

## Collections

### 1. users (extends PocketBase auth)

**Purpose**: User accounts and profiles

**Fields**:
| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| id | text | yes | auto | PocketBase auto-generated ID |
| email | email | yes | - | User's email address |
| password | password | yes | - | Hashed password |
| name | text | no | "" | User's full name |
| club_name | text | no | "" | Name of coach's club/organization |
| badge_level | text | no | "" | Coaching badge level (e.g., "UEFA B", "USSF D") |
| preferred_language | text | no | "en" | Preferred language (en, pt-BR, es) |
| avatar | file | no | null | Profile picture |
| created | datetime | yes | auto | Account creation timestamp |
| updated | datetime | yes | auto | Last update timestamp |

**Indexes**:
- `email` (unique)

**API Rules**:
```javascript
// List/Search: Users can only see their own record
@request.auth.id != "" && @request.auth.id = id

// View: Users can only view their own record
@request.auth.id != "" && @request.auth.id = id

// Create: Public (handled by auth)
@request.auth.id = ""

// Update: Users can only update their own record
@request.auth.id != "" && @request.auth.id = id

// Delete: Users can delete their own account
@request.auth.id != "" && @request.auth.id = id
```

---

### 2. teams

**Purpose**: Soccer teams managed by coaches

**Fields**:
| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| id | text | yes | auto | PocketBase auto-generated ID |
| user_id | relation | yes | - | Owner (users collection) |
| name | text | yes | - | Team name (e.g., "U12 Dragons") |
| season | text | no | "" | Season identifier (e.g., "2025 Spring") |
| age_group | text | no | "" | Age group (e.g., "U12", "U14") |
| created | datetime | yes | auto | Creation timestamp |
| updated | datetime | yes | auto | Last update timestamp |

**Relations**:
- `user_id` → `users.id` (single, cascade delete)

**Indexes**:
- `user_id`

**API Rules**:
```javascript
// List/Search: Users can only see their own teams
@request.auth.id != "" && user_id = @request.auth.id

// View: Users can only view their own teams
@request.auth.id != "" && user_id = @request.auth.id

// Create: Authenticated users can create teams
@request.auth.id != "" && @request.data.user_id = @request.auth.id

// Update: Users can only update their own teams
@request.auth.id != "" && user_id = @request.auth.id

// Delete: Users can delete their own teams
@request.auth.id != "" && user_id = @request.auth.id
```

---

### 3. players

**Purpose**: Players on teams

**Fields**:
| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| id | text | yes | auto | PocketBase auto-generated ID |
| team_id | relation | yes | - | Team (teams collection) |
| name | text | yes | - | Player's full name |
| number | number | no | null | Jersey number |
| position | text | no | "" | Primary position (e.g., "Midfielder") |
| strengths | json | no | [] | Array of strengths (max 3) |
| improvements | json | no | [] | Array of areas to improve (max 3) |
| monthly_rating | json | no | {} | Monthly ratings object: { "2025-01": 4, "2025-02": 5 } |
| notes | text | no | "" | Coach's notes about the player |
| created | datetime | yes | auto | Creation timestamp |
| updated | datetime | yes | auto | Last update timestamp |

**Relations**:
- `team_id` → `teams.id` (single, cascade delete)

**Indexes**:
- `team_id`

**API Rules**:
```javascript
// List/Search: Via team ownership
@request.auth.id != "" && team_id.user_id = @request.auth.id

// View: Via team ownership
@request.auth.id != "" && team_id.user_id = @request.auth.id

// Create: Via team ownership
@request.auth.id != "" && @request.data.team_id.user_id = @request.auth.id

// Update: Via team ownership
@request.auth.id != "" && team_id.user_id = @request.auth.id

// Delete: Via team ownership
@request.auth.id != "" && team_id.user_id = @request.auth.id
```

---

### 4. games

**Purpose**: Game statistics tracking

**Fields**:
| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| id | text | yes | auto | PocketBase auto-generated ID |
| team_id | relation | yes | - | Team (teams collection) |
| opponent | text | yes | - | Opponent team name |
| date | datetime | yes | - | Game date and time |
| chances_created | number | no | 0 | Number of scoring chances created |
| chances_conceded | number | no | 0 | Number of scoring chances conceded |
| recoveries | number | no | 0 | Attacking-half recoveries |
| bad_touches | number | no | 0 | Bad touch losses |
| notes | text | no | "" | Game notes |
| status | text | yes | "draft" | "draft" or "final" |
| created | datetime | yes | auto | Creation timestamp |
| updated | datetime | yes | auto | Last update timestamp |

**Relations**:
- `team_id` → `teams.id` (single, cascade delete)

**Indexes**:
- `team_id`
- `date`
- `status`

**API Rules**:
```javascript
// List/Search: Via team ownership
@request.auth.id != "" && team_id.user_id = @request.auth.id

// View: Via team ownership
@request.auth.id != "" && team_id.user_id = @request.auth.id

// Create: Via team ownership
@request.auth.id != "" && @request.data.team_id.user_id = @request.auth.id

// Update: Via team ownership
@request.auth.id != "" && team_id.user_id = @request.auth.id

// Delete: Via team ownership
@request.auth.id != "" && team_id.user_id = @request.auth.id
```

---

### 5. practice_plans

**Purpose**: Generated practice plans

**Fields**:
| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| id | text | yes | auto | PocketBase auto-generated ID |
| team_id | relation | yes | - | Team (teams collection) |
| focus | text | yes | - | Focus area: "defense", "attack", "control", "pressing" |
| drills | json | yes | - | Array of drill objects with details |
| week_of | date | no | null | Week this plan is for |
| created | datetime | yes | auto | Creation timestamp |
| updated | datetime | yes | auto | Last update timestamp |

**Relations**:
- `team_id` → `teams.id` (single, cascade delete)

**Indexes**:
- `team_id`
- `week_of`

**Drills JSON Structure**:
```json
[
  {
    "name": "1v1 Close Out",
    "type": "drill",
    "duration": 10,
    "cues": [
      "Close down quickly",
      "Stay on toes",
      "Force to weak side"
    ]
  },
  {
    "name": "Defensive Triangle",
    "type": "drill",
    "duration": 15,
    "cues": [
      "Cover shadow",
      "Communication",
      "Compact shape"
    ]
  },
  {
    "name": "4v4 No Turn",
    "type": "ssg",
    "duration": 15,
    "cues": [
      "Immediate pressure",
      "No turning in defensive half"
    ]
  }
]
```

**API Rules**:
```javascript
// List/Search: Via team ownership
@request.auth.id != "" && team_id.user_id = @request.auth.id

// View: Via team ownership
@request.auth.id != "" && team_id.user_id = @request.auth.id

// Create: Via team ownership
@request.auth.id != "" && @request.data.team_id.user_id = @request.auth.id

// Update: Via team ownership
@request.auth.id != "" && team_id.user_id = @request.auth.id

// Delete: Via team ownership
@request.auth.id != "" && team_id.user_id = @request.auth.id
```

---

## Migration Script

To create these collections in PocketBase, use the Admin UI or create a migration file:

### pb_migrations/1732395600_create_initial_schema.js

```javascript
/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  // Extend users collection
  const collection = $app.dao().findCollectionByNameOrId("users")

  collection.schema.addField(new SchemaField({
    name: "club_name",
    type: "text",
    required: false,
  }))

  collection.schema.addField(new SchemaField({
    name: "badge_level",
    type: "text",
    required: false,
  }))

  collection.schema.addField(new SchemaField({
    name: "preferred_language",
    type: "text",
    required: false,
    options: {
      default: "en"
    }
  }))

  return $app.dao().saveCollection(collection)
}, (db) => {
  // Revert users collection changes
  const collection = $app.dao().findCollectionByNameOrId("users")

  collection.schema.removeField("club_name")
  collection.schema.removeField("badge_level")
  collection.schema.removeField("preferred_language")

  return $app.dao().saveCollection(collection)
})
```

**Note**: It's easier to create collections via the PocketBase Admin UI for the initial setup. Migrations are better for production deployments.

---

## Setup Instructions

### 1. Start PocketBase

```bash
./pocketbase serve
```

### 2. Access Admin UI

Navigate to `http://localhost:8090/_/`

### 3. Create Collections

For each collection above:

1. Click "New collection"
2. Set collection name
3. Add fields as specified
4. Set API rules as specified
5. Save collection

### 4. Enable OAuth Providers

1. Go to Settings > Auth providers
2. Enable Google OAuth
3. Add OAuth credentials:
   - Client ID
   - Client Secret
   - Redirect URL: `http://localhost:8090/api/oauth2-redirect`

### 5. Test Collections

Use the PocketBase Admin UI to:
- Create test users
- Create test teams
- Verify relationships work
- Test API rules

---

## Data Validation

### Client-Side Validation

```typescript
// Example: Team validation
const teamSchema = z.object({
  name: z.string().min(1, "Team name is required").max(100),
  season: z.string().max(50).optional(),
  age_group: z.string().max(20).optional(),
})

// Example: Player validation
const playerSchema = z.object({
  name: z.string().min(1, "Player name is required").max(100),
  number: z.number().int().min(0).max(99).optional(),
  position: z.string().max(50).optional(),
  strengths: z.array(z.string()).max(3),
  improvements: z.array(z.string()).max(3),
})

// Example: Game validation
const gameSchema = z.object({
  opponent: z.string().min(1, "Opponent is required").max(100),
  date: z.date(),
  chances_created: z.number().int().min(0).max(999),
  chances_conceded: z.number().int().min(0).max(999),
  recoveries: z.number().int().min(0).max(999),
  bad_touches: z.number().int().min(0).max(999),
  status: z.enum(["draft", "final"]),
})
```

---

## Indexes for Performance

Recommended indexes for common queries:

```sql
-- teams collection
CREATE INDEX idx_teams_user_id ON teams(user_id);

-- players collection
CREATE INDEX idx_players_team_id ON players(team_id);

-- games collection
CREATE INDEX idx_games_team_id ON games(team_id);
CREATE INDEX idx_games_date ON games(date);
CREATE INDEX idx_games_status ON games(status);

-- practice_plans collection
CREATE INDEX idx_practice_team_id ON practice_plans(team_id);
CREATE INDEX idx_practice_week_of ON practice_plans(week_of);
```

**Note**: PocketBase automatically creates indexes for relation fields, but you can add additional indexes via the Admin UI if needed.

---

## Security Notes

1. **Row-Level Security**: All API rules enforce user ownership at the row level
2. **Cascade Deletes**: Deleting a team automatically deletes all players, games, and practice plans
3. **No Direct User Access**: Users cannot access other users' data
4. **Relation Protection**: Players/games/plans cannot be assigned to teams the user doesn't own

---

## Backup Strategy

### Automatic Backups

PocketBase automatically creates backups in `pb_data/backups/`

### Manual Backup

```bash
# Create a manual backup
./pocketbase backup

# Restore from backup
./pocketbase restore <backup_name>.zip
```

### Production Backup

For production, set up automated daily backups:

```bash
# Cron job (daily at 2 AM)
0 2 * * * cd /path/to/pocketbase && ./pocketbase backup
```

---

## Next Steps

1. Create collections via Admin UI
2. Set up OAuth providers
3. Test all API rules
4. Create test data
5. Implement TypeScript types matching this schema
6. Create service layer for API calls

---

**Status**: Ready for Implementation
**Last Updated**: 2025-11-23
