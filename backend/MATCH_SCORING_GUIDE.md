# Match Scoring & Dispute System - API Guide

## Overview
StreetBaller's match scoring system supports:
- **Score Submission** by referees with match events (goals, assists, cards)
- **Score Confirmation** by team captains
- **Dispute Resolution** with democratic voting
- **Trust Point Adjustments** based on dispute outcomes

---

## Endpoints

### 1. Submit Match Score
**Endpoint**: `POST /api/matches/:id/score`  
**Auth**: Required (Bearer token)  
**Description**: Referee submits final match score with match events

**Request Body**:
```json
{
  "team1Score": 3,
  "team2Score": 2,
  "events": [
    {
      "scorerId": "user-uuid-1",
      "assisterId": "user-uuid-2",
      "minute": 15,
      "teamId": "team-uuid-1",
      "eventType": "goal"
    },
    {
      "scorerId": "user-uuid-3",
      "minute": 45,
      "teamId": "team-uuid-1",
      "eventType": "goal"
    }
  ]
}
```

**Response** (201):
```json
{
  "success": true,
  "message": "Score submitted successfully. Awaiting team captain approval.",
  "data": {
    "id": "match-uuid",
    "team1Score": 3,
    "team2Score": 2,
    "status": "pending-confirmation",
    "team1CaptainApproved": false,
    "team2CaptainApproved": false
  }
}
```

**Validation**:
- Scores must be non-negative integers
- Match must be in 'scheduled' or 'in-progress' status
- Events must include valid playerIds and teamIds
- Minutes must be between 0-120

---

### 2. Approve or Dispute Score
**Endpoint**: `POST /api/matches/:id/decision`  
**Auth**: Required (Bearer token)  
**Description**: Team captain approves or disputes match score

**Request Body** (Approve):
```json
{
  "approved": true
}
```

**Request Body** (Dispute):
```json
{
  "approved": false,
  "reason": "Team 2 scored only 1 goal, not 2"
}
```

**Response - Approve** (200):
```json
{
  "success": true,
  "message": "Score approved successfully.",
  "data": {
    "id": "match-uuid",
    "status": "completed",
    "team1CaptainApproved": true,
    "team2CaptainApproved": true,
    "bothCaptainsApprovedAt": "2026-02-12T04:15:00.000Z"
  }
}
```

**Response - Dispute** (200):
```json
{
  "success": true,
  "message": "Score disputed. Dispute case created for resolution.",
  "data": {
    "disputed": true,
    "dispute": {
      "id": "dispute-uuid",
      "matchId": "match-uuid",
      "disputingTeamId": "team-uuid-2",
      "defendingTeamId": "team-uuid-1",
      "status": "open",
      "reason": "Team 2 scored only 1 goal, not 2",
      "createdAt": "2026-02-12T04:15:00.000Z"
    }
  }
}
```

---

### 3. Get Dispute Details
**Endpoint**: `GET /api/disputes/:id`  
**Auth**: Not required  
**Description**: Get full dispute details with voting information

**Response** (200):
```json
{
  "success": true,
  "data": {
    "id": "dispute-uuid",
    "matchId": "match-uuid",
    "status": "open",
    "disputingTeamId": "team-uuid-2",
    "defendingTeamId": "team-uuid-1",
    "reason": "Team 2 scored only 1 goal, not 2",
    "createdAt": "2026-02-12T04:15:00.000Z",
    "match": {
      "id": "match-uuid",
      "team1Id": "team-uuid-1",
      "team2Id": "team-uuid-2",
      "team1Score": 3,
      "team2Score": 2,
      "status": "disputed"
    },
    "votes": [
      {
        "id": "vote-uuid-1",
        "votingPlayerId": "player-uuid-1",
        "voteFor": "team-uuid-2",
        "votingPlayer": {
          "profile": { "name": "John Doe" }
        }
      }
    ]
  }
}
```

---

### 4. Register Player Vote
**Endpoint**: `POST /api/disputes/:id/vote`  
**Auth**: Required (Bearer token)  
**Description**: Player votes on dispute resolution

**Request Body**:
```json
{
  "playerId": "player-uuid",
  "voteForTeamId": "team-uuid-2"
}
```

**Response** (201):
```json
{
  "success": true,
  "message": "Vote recorded successfully",
  "data": {
    "id": "vote-uuid",
    "disputeId": "dispute-uuid",
    "votingPlayerId": "player-uuid",
    "voteFor": "team-uuid-2",
    "createdAt": "2026-02-12T04:15:30.000Z"
  }
}
```

**Validation**:
- Player must have participated in the match
- Player cannot vote twice on same dispute
- Must provide valid teamId from the match

---

### 5. Get All Open Disputes
**Endpoint**: `GET /api/disputes`  
**Auth**: Not required  
**Description**: List all active disputes awaiting resolution

**Response** (200):
```json
{
  "success": true,
  "data": [
    {
      "id": "dispute-uuid-1",
      "matchId": "match-uuid-1",
      "status": "open",
      "disputingTeamId": "team-uuid-2",
      "defendingTeamId": "team-uuid-1",
      "reason": "Incorrect score reported",
      "createdAt": "2026-02-12T04:10:00.000Z",
      "match": {
        "team1": { "name": "Team A" },
        "team2": { "name": "Team B" }
      }
    }
  ]
}
```

---

## Match Lifecycle

```
1. SCHEDULED
   └─ Referee submits score
        ↓
2. PENDING_CONFIRMATION
   ├─ Both captains approve → COMPLETED ✅
   └─ Captain disputes → DISPUTED
        ↓
3. DISPUTED
   └─ Community votes → Resolve to either:
      ├─ Back to PENDING_CONFIRMATION (disputing team wins)
      └─ COMPLETED (defending team confirmed)
```

---

## Dispute Resolution Logic

### Voting Mechanism
- All players who participated in the match vote
- Majority wins (50% + 1 of total participants)
- Both team captains count as voters

### Trust Point Adjustments
| Outcome | Winning Team | Losing Team |
|---------|-------------|------------|
| Honest (correct score) | +5 trust | -3 trust penalty |
| Dispute resolved in their favor | +5 trust | -3 trust penalty |

---

## Error Responses

### Validation Error (400)
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid score submission",
    "details": [
      {
        "code": "too_small",
        "message": "Number must be greater than or equal to 0",
        "path": ["team1Score"]
      }
    ]
  }
}
```

### Unauthorized (401)
```json
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "User not authenticated"
  }
}
```

### Business Logic Error (400/409)
```json
{
  "success": false,
  "error": {
    "code": "INVALID_STATE",
    "message": "Cannot submit scores for a completed match"
  }
}
```

---

## Example Workflow

### Step 1: Create Match
```bash
POST /api/matches
{
  "team1Id": "team-uuid-1",
  "team2Id": "team-uuid-2",
  "pitchId": "pitch-uuid",
  "matchDate": "2026-02-13T18:00:00Z",
  "format": "7v7"
}
→ 201 Created with match details
```

### Step 2: Submit Score
```bash
POST /api/matches/{matchId}/score
{
  "team1Score": 3,
  "team2Score": 2,
  "events": [...]
}
→ 200 Match moved to "pending-confirmation"
```

### Step 3: Team 1 Approves
```bash
POST /api/matches/{matchId}/decision
{
  "approved": true
}
→ 200 Team 1 marked as approved (waiting for Team 2)
```

### Step 4: Team 2 Disputes (conflict!)
```bash
POST /api/matches/{matchId}/decision
{
  "approved": false,
  "reason": "Team 1 scored only 2, not 3"
}
→ 200 Dispute created, match moved to "disputed"
```

### Step 5: Players Vote
```bash
POST /api/disputes/{disputeId}/vote
{
  "playerId": "player-1",
  "voteForTeamId": "team-uuid-2"
}
→ 201 Vote recorded

# Repeat for other players...
# Once majority votes, dispute auto-resolves
```

### Step 6: Dispute Resolved
- If Team 2's voters win → Match back to pending (Team 1 can re-approve)
- If Team 1's voters win → Match completed with original score confirmed

---

## Testing

### Test Creating & Disputing Match
```bash
# Create teams
POST /api/teams { "name": "Test Team A" }
POST /api/teams { "name": "Test Team B" }

# Create match
POST /api/matches { "team1Id": "...", "team2Id": "...", ... }

# Submit score
POST /api/matches/{id}/score { "team1Score": 2, "team2Score": 1 }

# Dispute
POST /api/matches/{id}/decision { "approved": false, "reason": "..." }

# Check dispute
GET /api/disputes
GET /api/disputes/{disputeId}

# Vote
POST /api/disputes/{disputeId}/vote { "playerId": "...", "voteForTeamId": "..." }
```
