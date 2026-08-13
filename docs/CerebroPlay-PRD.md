# 🧠 CerebroPlay — Product Requirements Document

**Version:** 1.0
**Status:** MVP — Ready for Development
**Product Type:** Progressive Web App + Chrome Extension
**Architecture:** Nx Monorepo with Shared Libraries

> *Train the skills you use every day.*

---

## Table of Contents

1. [Product Vision](#1-product-vision)
2. [Product Goals](#2-product-goals)
3. [Target Users](#3-target-users)
4. [Core Product Concept](#4-core-product-concept)
5. [Product Platforms](#5-product-platforms)
6. [Chrome Extension](#6-chrome-extension)
7. [Future Chrome New-Tab Experience](#7-future-chrome-new-tab-experience)
8. [User Journey](#8-user-journey)
9. [Onboarding](#9-onboarding)
10. [Cognitive Skills](#10-cognitive-skills)
11. [Daily Training Time](#11-daily-training-time)
12. [Core Game Categories](#12-core-game-categories)
13. [MVP Games](#13-mvp-games)
14. [Profession Personalization](#14-profession-personalization)
15. [Initial Role Themes](#15-initial-role-themes)
16. [Game Engine](#16-game-engine)
17. [Game Definition](#17-game-definition)
18. [Game Types](#18-game-types)
19. [Scoring](#19-scoring)
20. [XP System](#20-xp-system)
21. [Levels](#21-levels)
22. [Brain Profile](#22-brain-profile)
23. [Adaptive Difficulty](#23-adaptive-difficulty)
24. [Daily Challenge](#24-daily-challenge)
25. [Streaks](#25-streaks)
26. [Achievements](#26-achievements)
27. [Leaderboards](#27-leaderboards)
28. [Weekly Brain Battle](#28-weekly-brain-battle)
29. [Future Social Features (Not MVP)](#29-future-social-features-not-mvp)
30. [Future Team Product](#30-future-team-product)
31. [Monorepo Architecture](#31-monorepo-architecture)
32. [Nx Applications](#32-nx-applications)
33. [Nx Libraries](#33-nx-libraries)
34. [Dependency Rules](#34-dependency-rules)
35. [Recommended Library Boundaries](#35-recommended-library-boundaries)
36. [Backend Architecture](#36-backend-architecture)
37. [Database](#37-database)
38. [PWA Requirements](#38-pwa-requirements)
39. [Chrome Extension Requirements](#39-chrome-extension-requirements)
40. [Shared Game Execution](#40-shared-game-execution)
41. [Offline Strategy](#41-offline-strategy)
42. [UI / UX Principles](#42-ui--ux-principles)
43. [Home Screen](#43-home-screen)
44. [Extension Popup](#44-extension-popup)
45. [Notifications (Future Feature)](#45-notifications-future-feature)
46. [Monetization](#46-monetization)
47. [B2B Monetization (Future)](#47-b2b-monetization-future)
48. [Analytics](#48-analytics)
49. [Success Metrics](#49-success-metrics)
50. [MVP Scope](#50-mvp-scope)
51. [Should Have 🟡](#51-should-have-)
52. [Post-MVP 🟢](#52-post-mvp-)
53. [Development Roadmap](#53-development-roadmap)
54. [MVP Definition of Done](#54-mvp-definition-of-done)
55. [Product Principles](#55-product-principles)
56. [Long-Term Product Architecture](#56-long-term-product-architecture)
57. [The MVP Philosophy](#57-the-mvp-philosophy)

---

## 1. Product Vision

CerebroPlay is a gamified cognitive-training platform built around short, addictive brain games that adapt to a user's profession, interests, and cognitive goals.

> **Train the skills you use every day.**

A developer, designer, marketer, accountant, engineer, student, or general user can play the same underlying game mechanics, but experience different scenarios and content relevant to their role.

CerebroPlay will initially launch as a PWA, with a Chrome Extension using the same shared Nx libraries and game engine.

---

## 2. Product Goals

### Primary Goals

- Build a highly replayable collection of short brain games.
- Personalize games according to a user's professional role.
- Allow users to train specific cognitive skills.
- Create a strong daily-return habit.
- Introduce XP, streaks, achievements, and leaderboards.
- Make the application installable as a PWA.
- Build the technical foundation for a Chrome Extension.
- Create an architecture that makes adding new games fast.

### Long-Term Goals

- Social challenges.
- 1v1 brain battles.
- Company and team competitions.
- Premium subscriptions.
- CerebroPlay for Teams.
- A large, data-driven game library.

---

## 3. Target Users

### Professional Users

- Software & IT
- Design & Creative
- Finance & Business
- Marketing & Sales
- Legal
- Healthcare
- Engineering
- Education
- Science & Research
- Trades & Technical

### Other Users

- Students
- General users
- People interested in puzzles and brain games
- People looking for short entertainment during work breaks

---

## 4. Core Product Concept

CerebroPlay consists of three layers: a Game Platform, a User Platform, and multiple client experiences that sit on top of them.

```text
                    CerebroPlay
                        │
             ┌──────────┴──────────┐
             │                     │
       Game Platform          User Platform
             │                     │
       ┌─────┴─────┐       ┌───────┴──────┐
       │           │       │              │
     Games       Engine   Profile       Progress
       │           │       │              │
       └───────────┴───────┴──────────────┘
                        │
                 Multiple Clients
                        │
              ┌─────────┴─────────┐
              │                   │
             PWA             Chrome Extension
```

The game engine, scoring, game definitions, progression, and business logic are shared. The PWA and extension are simply different client experiences built on top of that shared core.

---

## 5. Product Platforms

### 5.1 PWA

The PWA is the primary CerebroPlay experience. Users can:

- Play games.
- Complete daily challenges.
- View their profile.
- View their cognitive skill breakdown.
- Track progress.
- View achievements.
- View leaderboards.
- Browse games.
- Install CerebroPlay on mobile or desktop.

#### PWA Routes

```text
/
├── /onboarding
├── /home
├── /games
├── /games/[game]
├── /challenge
├── /profile
├── /leaderboard
└── /settings
```

---

## 6. Chrome Extension

The Chrome Extension is the quick-access CerebroPlay experience. The goal is not to reproduce the entire PWA inside the extension. Instead:

> **PWA = full experience.** **Extension = quick brain break.**

Users click the CerebroPlay icon and immediately get:

```text
┌───────────────────────────┐
│ 🧠 CerebroPlay             │
│                           │
│ 🔥 12 day streak          │
│                           │
│ TODAY'S CHALLENGE         │
│                           │
│ 🧩 Pattern Breaker        │
│                           │
│        [ PLAY ]           │
│                           │
│ Score: 8,421              │
└───────────────────────────┘
```

The extension synchronizes with the same account and backend as the PWA.

---

## 7. Future Chrome New-Tab Experience

This is **not part of the MVP**. Eventually the extension can optionally replace Chrome's new-tab page:

```text
Good afternoon 👋

        🧠 8,421
       Brain Score

Today's Challenge

      Pattern Breaker

       [ PLAY ]

🔥 12 day streak

#14 Software Engineers
```

This provides a powerful passive-retention mechanism for later stages of the product.

---

## 8. User Journey

```text
Open CerebroPlay
       ↓
Start / Continue as Guest
       ↓
"What kind of thinker are you?"
       ↓
Choose Profession
       ↓
Choose Skills
       ↓
Choose Daily Training Time
       ↓
Play First Game
       ↓
Receive Score
       ↓
Earn XP
       ↓
Build Brain Profile
       ↓
Complete Daily Challenge
       ↓
Start Streak
       ↓
Return Tomorrow
```

---

## 9. Onboarding

### Step 1 — Welcome

**Headline:** "Train the skills you use every day."
**CTA:** "Start Training"

### Step 2 — Profession

**Question:** "What kind of work do you do?"

- Software & IT
- Design & Creative
- Finance & Business
- Marketing & Sales
- Legal
- Healthcare
- Engineering
- Education
- Science & Research
- Trades & Technical
- Student
- General
- Other (free text)

---

## 10. Cognitive Skills

Users select the skills they want to train. Multiple selections are allowed.

- Memory
- Speed
- Focus
- Logic
- Visual reasoning
- Numerical reasoning
- Cognitive flexibility
- Problem solving

---

## 11. Daily Training Time

This determines the recommended length of the daily challenge.

- 2 minutes
- 5 minutes
- 10 minutes
- No limit

---

## 12. Core Game Categories

### Memory
- Rapid Recall
- Memory Grid
- Sequence Recall
- Visual Memory

### Logic
- Pattern Breaker
- Logic Chains
- Rule Detection
- Constraint Puzzles

### Focus
- Target Detection
- Selective Attention
- Distraction Challenge

### Speed
- Rapid Tap
- Reaction Challenge
- Quick Classification

### Visual
- Spot the Difference
- Shape Matching
- Visual Rotation
- Color Memory

### Numerical
- Rapid Calculation
- Number Patterns
- Number Sorting
- Estimation

### Cognitive Flexibility
- Rule Switch
- Sort It
- Reverse Rules
- Changing Patterns

### Problem Solving
- Debug Rush
- Sequence Builder
- Resource Allocation
- Constraint Challenge

---

## 13. MVP Games

The MVP launches with six polished games.

### 1. Rapid Recall
Tests memory. Information is displayed temporarily, then hidden, and the player is asked questions about it.

### 2. Memory Grid
A grid displays a set of highlighted positions. It is hidden, and the user must reproduce the pattern.

### 3. Pattern Breaker
Users identify the next item in a sequence (for example, 2 → 4 → 8 → 16 → ?). Difficulty increases progressively.

### 4. Focus
Objects appear rapidly. The player must identify the correct target while ignoring distractions.

### 5. Spot the Difference
Two visual states are presented, and the user must identify what changed.

### 6. Sort It
Users classify objects according to a rule. The rule changes mid-game, testing cognitive flexibility.

---

## 14. Profession Personalization

The most important product principle:

> **The game mechanic is universal. The context is personalized.**

Rapid Recall, for example, adapts its content by role while the underlying mechanic stays identical:

### Developer
Remember a short API response, then answer a question about it:

```text
POST /users
200
42 users
12.4ms
```

**Question:** "What was the response time?"

### Designer
Remember a color palette, then answer a question about it.

**Question:** "Which color was third?"

### Finance
Remember a set of transaction values, then answer a question about them.

**Question:** "Which transaction had the highest amount?"

The game engine remains the same in every case — only the content changes.

---

## 15. Initial Role Themes

The MVP supports five role themes; additional roles are added after validation.

1. General
2. Software & IT
3. Design & Creative
4. Finance & Business
5. Marketing & Sales

---

## 16. Game Engine

The game engine is the core technical abstraction. Every game follows the same lifecycle, while individual games define their own mechanics on top of it.

```text
Initialize
    ↓
Generate Content
    ↓
Present Challenge
    ↓
Capture Input
    ↓
Validate
    ↓
Calculate Score
    ↓
Award XP
    ↓
Update Skill
    ↓
Save Session
    ↓
Show Results
```

---

## 17. Game Definition

Games are data-driven. Conceptually, each game is described by a definition object:

```ts
interface GameDefinition {
  id: string;
  type: GameType;
  skill: CognitiveSkill;
  difficulty: Difficulty;
  duration: number;
  contentGenerator: string;
  scoringStrategy: string;
  roleThemes?: RoleTheme[];
}
```

```text
Game
├── ID
├── Type
├── Skill
├── Difficulty
├── Duration
├── Content Generator
├── Scoring Strategy
└── Role Variants
```

---

## 18. Game Types

The set of supported game types can expand as new mechanics are introduced:

```ts
type GameType =
  | "memory"
  | "pattern"
  | "reaction"
  | "classification"
  | "visual"
  | "logic"
  | "numerical"
  | "sequence"
  | "attention";
```

---

## 19. Scoring

Every game produces a normalized result so that different games can be compared meaningfully:

- Score
- Accuracy
- Speed
- Difficulty
- Skill
- Completion status

```text
Score:       8,420
Accuracy:    92%
Speed:       87%
Difficulty:  Hard
Skill:       Memory
```

---

## 20. XP System

Players receive XP for:

- Completing games.
- Accuracy.
- Speed.
- Daily challenge completion.
- Streaks.
- Achievements.
- Personal bests.

```text
+120 XP
+30 Daily Bonus
+50 Personal Best
```

---

## 21. Levels

Users progress through levels; names can be refined during product design.

```text
Level 1 — Curious
Level 2 — Explorer
Level 3 — Challenger
Level 4 — Strategist
Level 5 — Master
```

---

## 22. Brain Profile

Users have a visual skill profile summarizing their performance across all trained skills:

```text
YOUR BRAIN PROFILE

Memory          82
Speed           91
Focus           74
Logic           89
Visual          68
Numerical       81
Flexibility     76
Problem Solving 84
```

The profile highlights a strongest skill (⚡ Speed), a skill to improve (👁 Visual reasoning), and an overall score (82).

**These scores are explicitly presented as game metrics, not medical or scientific diagnoses.**

---

## 23. Adaptive Difficulty

CerebroPlay dynamically adjusts difficulty based on performance, aiming to keep users in an engaging challenge range.

```text
Easy       95%
Medium     91%
Hard       82%
Expert     54%
```

If the user consistently performs well, difficulty increases; if they struggle, difficulty is reduced.

---

## 24. Daily Challenge

The primary retention mechanic is **Today's 5** — five recommended games that typically take 2–10 minutes to complete.

```text
TODAY'S 5

🧠 Memory
⚡ Speed
🎯 Focus
🧩 Logic
👁 Visual

[ START TRAINING ]
```

Game selection considers profession, preferred skills, historical performance, weak skills, difficulty, previous games, and recent activity.

---

## 25. Streaks

Users receive a daily streak, for example 🔥 12 Day Streak. Streak rewards can include XP multipliers, achievements, cosmetic rewards, and new game modes. Streak mechanics should encourage return visits without becoming excessively punishing.

---

## 26. Achievements

- First Challenge
- 7-Day Streak
- Memory Master
- Speed Demon
- Focused
- Puzzle Solver
- Perfect Round
- 100 Games
- Top 10%

---

## 27. Leaderboards

| Leaderboard | Scope |
|---|---|
| Global | All users. |
| Profession | e.g. Software Engineers. |
| Country | e.g. Ghana. |
| Weekly | Scores reset and recalculate weekly. |

---

## 28. Weekly Brain Battle

Every week, users receive the same challenge set, creating a fair competitive environment:

```text
WEEKLY BRAIN BATTLE

1. Sarah       9,842
2. Michael     9,721
3. Kwame       9,610
4. Daniel      9,501
```

---

## 29. Future Social Features (Not MVP)

- Friends
- Friend challenges
- 1v1 games
- Shared results
- Private leaderboards
- Brain Battles

Potential 1v1 experience:

```text
Player A          Player B

   🧠                🧠

     Same Challenge

          VS

     Highest Score
          Wins
```

---

## 30. Future Team Product

CerebroPlay can eventually become a B2B product: CerebroPlay Teams, where companies create private arenas.

```text
ACME BRAIN ARENA

Engineering      92,840
Marketing        87,120
Finance          84,920
Design           81,400
```

Potential features:

- Company accounts
- Departments
- Private leaderboards
- Team competitions
- Weekly challenges
- Admin dashboard
- Company branding
- Employee participation analytics

---

## 31. Monorepo Architecture

CerebroPlay uses an Nx monorepo with separate applications and reusable libraries.

```text
CerebroPlay/
│
├── apps/
│   ├── web/
│   └── extension/
│
├── libs/
│   ├── game-engine/
│   ├── games/
│   ├── scoring/
│   ├── progression/
│   ├── user/
│   ├── game-data/
│   ├── shared-models/
│   ├── shared-utils/
│   └── shared-ui/
│
├── nx.json
├── package.json
└── tsconfig.base.json
```

---

## 32. Nx Applications

### apps/web

The primary CerebroPlay PWA. Responsibilities:

- Routing
- Pages
- Authentication UI
- PWA functionality
- Game screens
- Profile
- Leaderboards
- Settings

### apps/extension

Chrome Extension. Responsibilities:

- Extension popup
- Quick challenge
- Authentication/session
- Small-screen game UI
- Extension-specific storage
- Communication with CerebroPlay APIs

It consumes the same libraries as the PWA wherever practical.

---

## 33. Nx Libraries

### libs/game-engine
- Game lifecycle
- Game state
- Game execution
- Answer validation
- Timer management
- Game events

### libs/games
Contains the actual game implementations, each exposing a consistent interface to the game engine.

```text
libs/games/
├── rapid-recall/
├── memory-grid/
├── pattern-breaker/
├── focus/
├── spot-difference/
└── sort-it/
```

### libs/scoring
- Score calculation
- Accuracy
- Speed
- Difficulty modifiers
- Score normalization

### libs/progression
- XP
- Levels
- Streaks
- Achievements
- Personal bests

### libs/game-data
- Game definitions
- Questions
- Role variants
- Difficulty configurations
- Content templates

### libs/user
- User profile
- Role
- Skills
- Preferences
- User state

### libs/shared-models
Shared TypeScript types and interfaces: `User`, `Role`, `Skill`, `Game`, `GameSession`, `GameResult`, `Achievement`, `Leaderboard`, `DailyChallenge`.

### libs/shared-utils
Generic reusable utilities.

### libs/shared-ui
- Score display
- XP indicator
- Progress bar
- Timer
- Streak badge
- Game result card

Platform-specific components remain inside their respective applications.

---

## 34. Dependency Rules

Nx module boundaries should be enforced, following a strict dependency direction:

```text
apps
  ↓
feature/domain libs
  ↓
shared libs
```

For example:

```text
apps/web
    ↓
game-engine
    ↓
shared-models
```

But:

```text
game-engine
    ❌ should not depend on apps/web
```

This keeps the game system reusable by the extension.

---

## 35. Recommended Library Boundaries

```text
libs/shared-models
       ↑
       │
libs/shared-utils
       ↑
       │
libs/game-data
       ↑
       │
libs/scoring
       ↑
       │
libs/progression
       ↑
       │
libs/game-engine
       ↑
       │
    ┌──┴───┐
    │      │
 apps/web apps/extension
```

The exact dependency graph can evolve as implementation begins.

---

## 36. Backend Architecture

```text
PWA ──────────┐
              │
Extension ────┼──→ API
              │
              ↓
          PostgreSQL
```

The API handles authentication, users, games, game sessions, scores, XP, progression, daily challenges, and leaderboards.

---

## 37. Database

PostgreSQL is the recommended database. Initial conceptual schema:

```text
users
roles
skills
user_skills

games
game_variants
game_sessions
game_attempts

scores
user_skill_scores

daily_challenges
daily_challenge_games

streaks

achievements
user_achievements

leaderboards
leaderboard_entries
```

Future tables:

```text
teams
team_members
organizations
departments
competitions
subscriptions
```

---

## 38. PWA Requirements

- Responsive mobile UI
- Responsive desktop UI
- Web App Manifest
- Service worker
- Installability
- Cached game assets
- Fast startup
- Mobile-first interaction
- Offline-capable game sessions where practical
- Haptic feedback where supported
- Sound effects
- Mute controls

---

## 39. Chrome Extension Requirements

- Chrome Manifest V3
- Popup experience
- User authentication
- Daily challenge
- Quick-play games
- Score synchronization
- XP synchronization
- Streak synchronization
- Profile summary
- Leaderboard summary
- Link to full PWA

### Extension Principle

The extension should be fast. Opening it should take users from Click → Play in as few steps as possible.

---

## 40. Shared Game Execution

The extension and PWA use the same game definitions — a game does not need two independent implementations, only platform-specific presentation.

```text
libs/games/rapid-recall
            │
       ┌────┴─────┐
       │          │
     PWA       Extension
```

---

## 41. Offline Strategy

Games should eventually be playable without a network connection:

```text
Online
  ↓
Download game content
  ↓
Local cache
  ↓
Play offline
  ↓
Store result locally
  ↓
Network returns
  ↓
Sync result
```

Offline support can be limited during the initial MVP if implementation complexity becomes excessive.

---

## 42. UI / UX Principles

| Principle | Description |
|---|---|
| Fast | Users should start playing quickly. |
| Playful | It should feel like a game, not a productivity dashboard. |
| Short | Most games run 15–60 seconds. |
| Immediate feedback | Every action should feel responsive. |
| Progress everywhere | Users should constantly see XP, score, streak, level, and personal best. |
| Mobile-first | The primary game interaction should work beautifully on touch screens. |

---

## 43. Home Screen

```text
Good evening 👋

🔥 12 day streak

YOUR DAILY TRAINING

Today's 5

🧠 Memory
⚡ Speed
🎯 Focus
🧩 Logic
👁 Visual

[ START TRAINING ]

──────────────────

BRAIN PROFILE

Overall
82 ↑ 4 this week

Strongest
⚡ Speed

Train next
👁 Visual
```

---

## 44. Extension Popup

The popup is considerably simpler than the full home screen:

```text
┌─────────────────────────┐
│ 🧠 CerebroPlay           │
│                         │
│ 🔥 12 day streak        │
│                         │
│ Today's Game            │
│                         │
│ 🧩 Pattern Breaker      │
│                         │
│ [ PLAY ]                │
│                         │
│ 8,421 Brain Score       │
│                         │
│ Open CerebroPlay →       │
└─────────────────────────┘
```

---

## 45. Notifications (Future Feature)

- 🧠 Your daily challenge is ready.
- 🔥 Don't break your 12-day streak!
- 🏆 You moved into the top 10%.
- ⚡ New personal best!

**Notifications must be opt-in and controllable.**

---

## 46. Monetization

### Free
- Daily challenges
- Limited game library
- Basic profile
- Basic leaderboard
- Streaks

### Pro — potentially $3–7/month
- Unlimited games
- All role categories
- Advanced analytics
- Full game history
- Advanced challenges
- More personalization
- Additional game modes

Pricing should be validated with real users.

---

## 47. B2B Monetization (Future)

### CerebroPlay Teams

Companies pay for:

- Private arenas
- Employee competitions
- Department leaderboards
- Team challenges
- Admin dashboard
- Company branding
- Analytics

This should be treated as a future business line rather than an MVP requirement.

---

## 48. Analytics

| Category | Tracked Metrics |
|---|---|
| Acquisition | Landing page visits, signups, installations, referral source. |
| Activation | Onboarding completion, first game started, first game completed, first daily challenge completed. |
| Engagement | Games per session, sessions per user, session duration, daily challenge completion, streak length. |
| Retention | D1, D7, D30. |
| Game analytics | Starts, completions, average score, average time, failure rate, difficulty performance. |

---

## 49. Success Metrics

Initial product targets — validation targets, not guaranteed outcomes:

| Metric | Target |
|---|---|
| Activation | 70%+ of new users complete their first game. |
| D7 retention | 25%+ |
| Weekly engagement | 3+ sessions per user per week. |
| Games per session | 3–7 |
| Daily challenge completion | 40%+ of active users. |

---

## 50. MVP Scope

### 🔴 Must Have

**Platform**
- [ ] Nx monorepo
- [ ] apps/web
- [ ] Shared Nx libraries
- [ ] PWA
- [ ] Responsive design

**User**
- [ ] Guest mode
- [ ] Role selection
- [ ] Skill selection
- [ ] Training-time preference

**Game Engine**
- [ ] Game lifecycle
- [ ] Timer
- [ ] Answer validation
- [ ] Scoring
- [ ] Difficulty
- [ ] Results

**Games**
- [ ] Rapid Recall
- [ ] Memory Grid
- [ ] Pattern Breaker
- [ ] Focus
- [ ] Spot the Difference
- [ ] Sort It

**Progression**
- [ ] XP
- [ ] Levels
- [ ] Streaks
- [ ] Brain Profile
- [ ] Game history

**Retention**
- [ ] Daily challenge
- [ ] Personal bests
- [ ] Basic achievements

**Competition**
- [ ] Basic leaderboard

---

## 51. Should Have 🟡

- [ ] Authentication
- [ ] Profession-specific game variants
- [ ] Adaptive difficulty
- [ ] Sound effects
- [ ] Haptic feedback
- [ ] Offline game sessions
- [ ] PWA installation prompts
- [ ] Push notifications
- [ ] More game content
- [ ] Basic analytics

---

## 52. Post-MVP 🟢

- [ ] apps/extension
- [ ] Chrome Extension
- [ ] Extension quick-play
- [ ] Extension profile
- [ ] Extension leaderboard
- [ ] Chrome New Tab mode
- [ ] Friends
- [ ] Friend challenges
- [ ] 1v1 battles
- [ ] Teams
- [ ] Company arenas
- [ ] Admin dashboard
- [ ] Subscriptions
- [ ] CerebroPlay Teams
- [ ] Advanced analytics
- [ ] AI-assisted content generation

---

## 53. Development Roadmap

### Phase 1 — Nx Foundation
Set up the Nx workspace, apps/web, and the foundational shared libraries (shared-models, shared-utils, game-data, game-engine, scoring, progression, games, shared-ui).
**Deliverable:** A functioning monorepo with clean library boundaries.

### Phase 2 — Core Game Engine
Build game lifecycle, game state, timers, input, validation, scoring, and results.
**Deliverable:** One game can run entirely through the shared engine.

### Phase 3 — MVP Games
Build the six polished MVP games.
**Deliverable:** A user can play a complete collection of games.

### Phase 4 — User Experience
Build onboarding, home, profile, Brain Profile, and game history.
**Deliverable:** A complete single-player experience.

### Phase 5 — Retention
Build Today's 5, XP, levels, streaks, achievements, and personal bests.
**Deliverable:** Users have a reason to return every day.

### Phase 6 — Competition
Build the global leaderboard, profession leaderboard, and weekly challenge.
**Deliverable:** Users can compete.

### Phase 7 — Personalization
Build profession themes, skill preferences, adaptive difficulty, and personalized challenge selection.
**Deliverable:** CerebroPlay feels different depending on who is playing.

### Phase 8 — Chrome Extension
Create apps/extension, reusing game-engine, games, scoring, progression, shared-models, and shared-ui.
**Deliverable:** Users can launch CerebroPlay directly from Chrome.

### Phase 9 — Social
Build friends, challenges, 1v1, and shared scores.

### Phase 10 — B2B
Build organizations, teams, departments, private leaderboards, company competitions, and an admin dashboard.

---

## 54. MVP Definition of Done

The MVP is considered complete when a new user can:

1. Open CerebroPlay.
2. Start without creating an account.
3. Select a professional category.
4. Select cognitive skills.
5. Select a training duration.
6. Start their first game within 30 seconds.
7. Play six different game types.
8. Receive scores.
9. Earn XP.
10. Progress through levels.
11. Build a Brain Profile.
12. Complete a Today's 5 challenge.
13. Start a streak.
14. Earn achievements.
15. View their game history.
16. Compare their score on a leaderboard.
17. Install CerebroPlay as a PWA.

---

## 55. Product Principles

### Principle 1 — Game first
CerebroPlay must be fun before it is useful.

### Principle 2 — Short sessions
A user should be able to enjoy CerebroPlay in 60 seconds.

### Principle 3 — Relevant, not restrictive
Profession-specific content should personalize the experience without preventing users from playing any game.

### Principle 4 — One engine, many experiences
The PWA and Chrome Extension must share the same game engine and domain logic.

### Principle 5 — Data-driven games
Adding a new game variation should not require rewriting the application.

### Principle 6 — Progress creates retention
Every session should contribute to: Score → XP → Level → Skill → Streak → Achievement.

### Principle 7 — Competition is optional
Leaderboards should motivate competitive users without making casual users feel pressured.

---

## 56. Long-Term Product Architecture

The eventual CerebroPlay ecosystem:

```text
                         CerebroPlay
                              │
             ┌────────────────┼────────────────┐
             │                │                │
            PWA           Chrome Extension   New Tab
             │                │                │
             └────────────────┼────────────────┘
                              │
                       Shared Nx Libraries
                              │
                    ┌─────────┴─────────┐
                    │                   │
                Game Engine         User Engine
                    │                   │
          ┌─────────┼─────────┐        │
          │         │         │        │
       Memory     Logic     Speed    Progression
          │         │         │        │
          └─────────┼─────────┘        │
                    │                  │
                 Scoring ─────── XP / Levels
                    │                  │
                    └────────┬─────────┘
                             │
                          Backend
                             │
                         PostgreSQL
                             │
              ┌──────────────┴──────────────┐
              │                             │
          Individual                    Organizations
              │                             │
       Daily Training                 CerebroPlay Teams
```

---

## 57. The MVP Philosophy

> **Do not build 50 games. Build six exceptional games.**

The first product question isn't:

> "How many games can we make?"

It is:

> "Will someone play today and voluntarily come back tomorrow?"

If the answer is yes, expand the game library. Then add: Personalization → Competition → Chrome Extension → Social → Teams → Monetization.

**That gives CerebroPlay a very clean path from solo PWA side project → addictive consumer product → cross-platform game platform → potential B2B SaaS.**
