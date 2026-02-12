# StreetBaller — Architecture

**Data Flow & System Design.**

## 🏗 High-Level Diagram
```
[Flutter App]      [React Web App]
      |                   |
      +---------+---------+
                |
        [Express REST API] <-> [PostgreSQL]
                |
                +---> [Firebase Auth] (token verification)
                |
                +---> [FCM] (push notifications)

[Client Side Services]
- Firebase Storage (team logos, profile photos)
- Google Maps SDK (pitch locations)
```

## 🔄 Data Flow
1. **Auth**: Both clients -> Firebase Auth -> JWT Token -> Express middleware verifies token
2. **Player Data**: Clients -> Express -> Postgres (users, player_profiles)
3. **Team Operations**: Clients -> Express -> Postgres (teams, team_members)
4. **Match Flow**: Create match -> Challenge accepted -> Ref assigned -> Match played -> Score submitted -> Trust System (Captains/Voting)
5. **Notifications**: Express -> FCM -> Apps (match invites, ref requests, score confirmations, voting triggers)

## 📂 Key Modules
_To be defined during architecture planning._

## Database Schema (Draft)
_To be designed — see BRAINSTORM.md for entity list._
