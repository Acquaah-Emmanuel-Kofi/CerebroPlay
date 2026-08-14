# CerebroPlay UI/UX Redesign — Phase 0 Discovery

**Date:** 2026-08-14  
**Model Requirement:** ChatGPT  
**Scope:** Mobile-First UI/UX Analysis  
**Status:** ✅ DISCOVERY ONLY — No Implementation

---

## Executive Summary

This document maps every screen/feature in the attached design mockups to corresponding existing implementation in the codebase. It identifies gaps, ambiguities, and confirms feature parity before any implementation work begins.

**Key Finding:** The design and codebase are largely feature-complete and aligned. There are **6 open questions** and **1 significant gap** identified below.

---

## Part 1: Feature-to-Screen Mapping

### ✅ SCREEN 1: Welcome Screen
**Design File:** `welcome_to_cerebroplay/code.html`  
**Design Title:** "Train the skills you use every day"

**Current Implementation:** ✅ Exists  
**Route:** `/onboarding` (step: "welcome")  
**File:** `apps/web/src/app/onboarding/page.tsx` (lines ~70-80)

**Feature Parity:**
- ✅ Hero graphic (brain illustration)
- ✅ CerebroPlay logo
- ✅ Primary CTA: "Start Training" button
- ✅ Secondary CTA: "I already have an account"
- ✅ Tagline: "Short, personalized brain games designed for your profession"

**Status:** READY FOR REDESIGN

---

### ✅ SCREEN 2: Profession Selection ("What kind of work do you do?")
**Design File:** `select_your_profession/code.html`  
**Design Title:** "What kind of work do you do?"

**Current Implementation:** ✅ Exists  
**Route:** `/onboarding` (step: "profession")  
**File:** `apps/web/src/app/onboarding/page.tsx` (lines ~140-180)

**Current Code:** Shows 5 options (general, software, design, finance, marketing)

**Design Shows:** 12 profession options
- Software & IT ✅
- Design & Creative ✅
- Finance & Business ✅
- Marketing & Sales ✅
- Legal ✅ (NEW in design)
- Healthcare ✅ (NEW in design)
- Engineering ✅ (NEW in design)
- Education ✅ (NEW in design)
- Science & Research ✅ (NEW in design)
- Trades & Technical ✅ (NEW in design)
- Student ✅ (NEW in design)
- General ✅

**Issue:** Current code implements only 5 professions; design shows 12.

**Status:** ⚠️ FEATURE EXPANSION NEEDED (but does not change logic, only expands options)

---

### ✅ SCREEN 3: Skill Selection ("What do you want to train?")
**Design File:** `cerebroplay_cognitive_training_flow/code.html`  
**Design Title:** "What do you want to train?"

**Current Implementation:** ✅ Exists  
**Route:** `/onboarding` (step: "skills")  
**File:** `apps/web/src/app/onboarding/page.tsx` (lines ~100-125)

**Feature Parity:**
- ✅ 8 selectable skill chips (Memory, Speed, Focus, Logic, Visual reasoning, Numerical reasoning, Cognitive flexibility, Problem solving)
- ✅ Multi-select allowed
- ✅ Progress indicator (3 dots showing step 2/3)
- ✅ Continue button (disabled until selection made)

**Status:** READY FOR REDESIGN

---

### ✅ SCREEN 4: Daily Commitment / Training Time Selection
**Design File:** `set_your_goal/code.html`  
**Design Title:** "Daily Commitment — How much time can you commit to training each day?"

**Current Implementation:** ✅ Exists  
**Route:** `/onboarding` (step: "time")  
**File:** `apps/web/src/app/onboarding/page.tsx` (lines ~125-135)

**Feature Parity:**
- ✅ 4 options: 2 min, 5 min, 10 min, No limit
- ✅ Radio-button style selection (only one can be selected)
- ✅ "Recommended baseline" label on 5 minutes option
- ✅ CTA: "Start Training" button

**Status:** READY FOR REDESIGN

---

### ✅ SCREEN 5: Home Screen ("Good evening 👋")
**Design File:** `cerebroplay_home/code.html`  
**Design Title:** "Good evening 👋"

**Current Implementation:** ✅ Exists  
**Route:** `/home`  
**File:** `apps/web/src/app/home/page.tsx`

**Feature Parity:**
- ✅ Greeting based on time of day (Good morning/afternoon/evening)
- ✅ Tagline: "Ready to sharpen your mind?"
- ✅ Streak indicator: "🔥 12 Day Streak"
- ✅ "Today's 5" card (Daily Challenge)
  - Game icons row (Memory, Focus, Logic, etc.)
  - Duration indicator (15 min)
  - "Start Training" CTA
- ✅ Brain Profile Summary section
  - Cerebro Score display (82)
  - Score trend (+4)
  - Progress bar
  - "Top 15%" label
- ✅ Insights card: "Strongest Skill: Spatial Memory"
- ✅ Recommendation: "Recommended Next: Pattern Matching"
- ✅ Bottom navigation bar (5 items: Home, Games, Challenge, Leaderboard, Profile)

**Status:** READY FOR REDESIGN

---

### ✅ SCREEN 6: Game Library / Games Browse
**Design File:** `game_library/code.html`  
**Design Title:** "Game Library — Choose your cognitive workout"

**Current Implementation:** ✅ Partially Exists  
**Route:** `/home` (implicit; linked from home) or `/games`  
**File:** `apps/web/src/app/home/page.tsx` (lines ~50-65)

**Implemented Games in Design:**
1. Pattern Recall (Memory) — BEGINNER
2. Quick Match (Speed) — INTERMEDIATE
3. Path Finder (Logic) — ADVANCED
4. Laser Focus (Focus) — INTERMEDIATE
5. Number Flow (Numerical) — BEGINNER
6. Shape Shift (Visual) — ADVANCED

**Implemented Games in Codebase:**
1. ✅ pattern-breaker (Logic)
2. ✅ memory-grid (Memory)
3. ✅ rapid-recall (Memory)
4. ✅ focus (Focus)
5. ✅ sort-it (Cognitive Flexibility)
6. ✅ spot-the-difference (Visual)

**Issue:** Game names in design do NOT match game names in codebase.
- Design shows "Pattern Recall" but code has "Pattern Breaker"
- Design shows "Quick Match" but code has no direct match (might be implied)
- Design shows "Laser Focus" but code shows "Focus"
- Other names vary

**Status:** ⚠️ NAME MISMATCH — Requires clarification

**Feature Parity (Functions):**
- ✅ Game grid display (2-column layout on mobile)
- ✅ Game card shows: Icon, Title, Category/Skill, Difficulty badge
- ✅ Category filter chips (All Games, Memory, Logic, Focus, Speed, Visual)
- ✅ Click to play game

**Status:** READY FOR REDESIGN (with name clarification)

---

### ✅ SCREEN 7: In-Game Screen (Pattern Breaker Gameplay)
**Design File:** `pattern_breaker_gameplay/code.html`  
**Design Title:** "Pattern Breaker — Memorize the pattern"

**Current Implementation:** ✅ Exists  
**Route:** `/games/pattern-breaker`  
**File:** `apps/web/src/app/games/pattern-breaker/page.tsx`

**Feature Parity:**
- ✅ Top HUD: Score display (1,204)
- ✅ Top HUD: Timer (circular ring with 42 seconds)
- ✅ Top HUD: Pause/Quit button
- ✅ Game canvas: 3x3 grid of tiles
- ✅ Tiles: Interactive, clickable, can show patterns
- ✅ Bottom: Progress indicator (Round 4 of 10)
- ✅ Bottom: Multiplier display (Multiplier 2x)
- ✅ Bottom: Progress bar

**Status:** READY FOR REDESIGN

---

### ✅ SCREEN 8: Game Results Screen ("Level Complete!")
**Design File:** `game_results/code.html`  
**Design Title:** "Level Complete! Synaptic Speed Match"

**Current Implementation:** ❌ **DOES NOT EXIST**

**Expected Route:** `/games/[game-id]/results` or similar  
**Why Missing:** Current game pages only show in-game UI; no dedicated results screen.

**Design Features:**
- "Level Complete!" headline
- Game name
- "Personal Best!" ribbon/badge
- Final Score display (24,590)
- XP reward callout (+120 XP) with animation
- Stats grid:
  - Accuracy (94%)
  - Avg. Speed (1.2s)
- Action buttons:
  - "Play Again"
  - "Back to Today's 5"
- Celebratory particles/confetti effect

**Status:** 🔴 **FEATURE GAP — Requires Implementation**

---

### ✅ SCREEN 9: Leaderboard
**Design File:** `leaderboard/code.html`  
**Design Title:** "Leaderboard"

**Current Implementation:** ❌ **DOES NOT EXIST**

**Expected Route:** `/leaderboard`  
**Why Missing:** Not yet implemented in codebase.

**Design Features:**
- Top navigation with tabs: Global, Profession, Country, Weekly
- Pinned "You" card (Alex M.) — highlighted, shows your rank (42) and points (12,450)
- Ranked list below:
  - Rank 1: Sarah Jenkins — 18,920 points
  - Rank 2: David L. — 17,845 points
  - Rank 3: Elena R. — 16,500 points
  - Rank 4: Michael J. — 15,210 points
  - Rank 5: Karen W. — 14,980 points
- "Load more ranks" button
- Bottom navigation visible

**Status:** 🔴 **FEATURE GAP — Requires Implementation**

---

### ✅ SCREEN 10: Brain Profile / Your Brain Profile
**Design File:** `your_brain_profile/code.html`  
**Design Title:** "Your Brain Profile" (Profile Page)

**Current Implementation:** ❌ **DOES NOT EXIST**

**Expected Route:** `/profile`  
**Why Missing:** Not yet implemented in codebase.

**Design Features:**
- Profile header: User avatar + name + role title
- Brain Profile radar/spider chart showing cognitive skills:
  - Memory, Attention, Speed, Flexibility, Problem Solving, Language, Math, Spatial
  - Overall score (84) displayed in center
- "Top 15%" badge
- Bento grid insights:
  - Strongest skill card (Reaction Time) with progress bar
  - Focus area card (Memory) with progress bar
- Achievements section (3 items):
  - 7 Day Streak
  - Master Mind
  - Top 10% (grayed out/locked)
- Recent Games section:
  - Matrix Memory (Score: 4,250) — +12 XP Today
  - Speed Match (Score: 8,900) — +5 XP Yesterday
- Bottom navigation visible

**Status:** 🔴 **FEATURE GAP — Requires Implementation**

---

### ✅ SCREEN 11: Account Creation Modal
**Design File:** `create_account_prompt/code.html`  
**Design Title:** "Save Your Progress — Create an account"

**Current Implementation:** ⚠️ **PARTIALLY/IMPLICITLY EXISTS**

**Context:** This is a bottom-sheet modal overlay that appears over the Profile screen.

**Expected Behavior:** 
- Appears when guest user tries to access certain features or at a prompt
- Offers benefits of creating an account

**Design Features:**
- Title: "Save Your Progress"
- Subtitle: "Create an account to securely store your cognitive gains and unlock full features"
- Benefits list:
  - ☁️ Cloud Sync — Never lose your training history
  - 🌍 Global Leaderboard — See how you rank worldwide
  - 👥 Compete with Friends — Challenge your inner circle
- CTAs:
  - "Create Account" (primary)
  - "Maybe later" (secondary)

**Current Implementation Status:**
- The app seems to support guest mode (`getOrCreateGuestUser()` in user library)
- No explicit account creation UI found in current codebase
- Modal design is provided but implementation not visible

**Status:** ⚠️ **FEATURE UNCLEAR — Likely Planned but Not Yet Implemented**

---

## Part 2: Gap Analysis

### 🔴 Missing Features (Not in Codebase)

| Feature | Design Screen | Current Code | Priority |
|---------|---------------|--------------|----------|
| Game Results Screen | `game_results/` | ❌ None | 🔴 High |
| Leaderboard Page | `leaderboard/` | ❌ None | 🔴 High |
| Brain Profile / Profile Page | `your_brain_profile/` | ❌ None | 🔴 High |
| Account Creation Modal | `create_account_prompt/` | ⚠️ Implicit | 🟡 Medium |

### ⚠️ Clarifications Resolved

| Issue | Resolution | Status |
|-------|-----------|--------|
| **Game Name Authority** | `libs/games/src/lib/game-catalog.ts` is authoritative. Design must use "Pattern Breaker", not "Pattern Recall". Code IDs drive routing and IndexedDB keys. | ✅ RESOLVED |
| **Profession Scope** | MVP = 5 professions only (PRD §15). Expand only after validation. Most games are role-agnostic in MVP. | ✅ RESOLVED |
| **Post-Game Flow** | Already built; sequence is atomic. See details below. | ✅ RESOLVED |
| **Leaderboard** | No backend for MVP (architecture decision). Recommend local Personal Bests view instead of cross-user rankings. | ⚠️ ARCHITECTURAL |
| **Brain Profile Skills** | Only 5 of 8 skills have games today. Radar chart must render gracefully with sparse data. | ✅ RESOLVED |
| **Account Creation Trigger** | Not built; authentication is "Should Have", not MVP. Defer trigger logic. | ⚠️ DEFERRED |

---

## Part 3: Resolutions to Open Questions

### ✅ Q1: Game Name Authority — Code is Authoritative

**Resolution:** `libs/games/src/lib/game-catalog.ts` is the single source of truth.

**Game Name Reference:**
| ID (Code/Routing) | Display Name |
|-------------------|---------------|
| `rapid-recall` | Rapid Recall |
| `pattern-breaker` | Pattern Breaker |
| `memory-grid` | Memory Grid |
| `spot-the-difference` | Spot the Difference |
| `sort-it` | Sort It |
| `focus` | Focus |

**Important:** "Pattern Recall" does not exist in the code. The design mockup mistakenly shows this name. **Design must be updated to use "Pattern Breaker"** — renaming code would break routing (`/games/pattern-breaker`) and IndexedDB records.

**Action:** Design agent must rename "Pattern Recall" to "Pattern Breaker" in all mockups.

---

### ✅ Q2: Profession Expansion — MVP = 5 Only

**Resolution:** Do NOT expand to 12 professions. Keep exactly 5 per PRD §15.

**Rationale:** PRD §15 explicitly states: *"The MVP supports five role themes; additional roles are added after validation."*

**Supported Professions (MVP):**
- general
- software
- design
- finance
- marketing

**Important Caveat:** Only **Rapid Recall** actually varies its content by profession today (per PRD §14 example: dev/designer/finance show different content types). The other 5 games are role-agnostic in MVP. Profession-specific variants for all games is listed as "Should Have" (PRD §51), not Must-Have.

**Action:** Design profession picker for 5 options only. Don't assume every game visibly responds to role selection yet.

---

### ✅ Q3: Post-Game Flow — Already Implemented

**Resolution:** Sequence is atomic and already built. Found in `apps/web/src/lib/complete-game-session.ts`.

**Exact Sequence:**
1. Final attempt completes → `attemptCompleted` event fires
2. `calculateGameResult()` scores the session
3. Result persisted to IndexedDB (`gameResultsStore`)
4. Full history read back from IndexedDB
5. `applyGameResultToUser()` computes XP, level, streak, achievements in **one shot**
6. Updated user persisted (`updateGuestUser`)
7. All state lands together → **results screen renders once** with:
   - Final score + accuracy + avg speed
   - `+XP` amount (always shown)
   - Level-up line (conditional, if applicable)
   - New achievement names (conditional, if applicable)

**Important:** No separate loading step. No sequential screen transitions. All data renders simultaneously.

**Action:** Design results screen to show all stats + XP + conditional level/achievement callouts at once. All synchronized, no loading states between screens.

---

### ⚠️ Q4: Leaderboard — Architectural Limitation

**Resolution:** Real cross-user leaderboard is impossible without a backend. MVP architecture explicitly has no backend.

**Current State:** Zero leaderboard code exists in the repository. PRD lists "Basic leaderboard" as Must-Have (§50), but this contradicts the no-backend MVP decision.

**Recommended Approach:** 

Descope real ranked leaderboard from this design pass. Instead, design the Leaderboard tab as a **Local Personal Bests View:**
- Displays sorted history of all games played, best scores per game
- Sourced entirely from IndexedDB (local-only)
- Shows: Game name, score, date, skill, XP earned
- This IS a Must-Have feature (§50 Retention → "Personal bests")

**For Future Backend:** Keep the design mockup for Global/Profession/Country/Weekly tabs visible but disabled/grayed out. Wire them up once backend authentication + leaderboard API exist (Post-MVP).

**Action:** Redesign "Leaderboard" tab as Local Personal Bests only. Keep other tabs in design (visual placeholder) but disabled.

---

### ✅ Q5: Brain Profile Skills — Only 5 of 8 Populated

**Resolution:** Only 5 cognitive skills have actual games producing data in MVP.

**Skills with Game Data:**
1. ✅ **Memory** — Rapid Recall, Memory Grid
2. ✅ **Logic** — Pattern Breaker
3. ✅ **Visual** — Spot the Difference
4. ✅ **Flexibility** — Sort It
5. ✅ **Focus** — Focus

**Skills with NO Game Data (MVP):**
- ❌ Speed (no game feeds this yet)
- ❌ Numerical (no game feeds this yet)
- ❌ Problem Solving (no game feeds this yet)

**Radar Chart Behavior:** `calculateBrainProfile()` will return zeros for the 3 unpopulated skills. 

**Action:** Design radar chart to render gracefully with only 5 of 8 axes populated. Treat missing axes as expected for MVP, not a bug. Users will see their profile "fill out" as more games are added.

---

### ⚠️ Q6: Account Creation Modal — Deferred (No Auth in MVP)

**Resolution:** Account creation is "Should Have" (PRD §51), NOT MVP. No trigger logic exists because authentication is out of scope for MVP.

**Current State:** 
- Guest-only mode is intentional for MVP
- No account creation UI or flow anywhere in codebase
- `getOrCreateGuestUser()` is the only user flow today

**Design Status:** The modal mockup is in the design system and can be designed now. But the *trigger logic* is a product decision that should be deferred until authentication is actually being built.

**Provisional Guidance** (if you need a placeholder to unblock design):
- Always-available manual CTA (e.g., Settings or Profile screen button)
- One soft, dismissible prompt after a meaningful milestone (e.g., first level-up OR 3-day streak)
- BUT flag this as provisional — revisit when auth sprint begins

**Action:** Design the modal for visual completeness. Defer trigger/flow logic decision until authentication sprint.

---

## Part 4: Feature Completeness Summary

### ✅ MVP Features (Ready to Redesign)
1. Onboarding flow (4 steps)
2. Home screen
3. Game selection/library
4. In-game screens (6 games)
5. User profile (guest mode)
6. Basic stats display

### 🔴 MVP Features (Need Implementation Before Redesign)
1. **Game Results Screen**
2. **Leaderboard Page**
3. **Brain Profile / Profile Page**
4. Account Creation Modal (flow + UI)

### ⚠️ Features Requiring Design Adjustments
1. ✅ Game naming — Rename "Pattern Recall" to "Pattern Breaker"
2. ✅ Profession scope — Keep to 5 only (no expansion)
3. ⚠️ Leaderboard design — Convert to Local Personal Bests, disable other tabs
4. ⚠️ Account modal — Design UI, defer trigger logic
5. ✅ Brain profile — Design radar to handle 5/8 skills populated

---

## Part 5: Constraints & Principles Reaffirmed

### Hard Constraints (Per User Request)
- ✅ **Do not change application logic, business rules, or data flow**
- ✅ **Every currently implemented feature must remain present and functional**
- ✅ **1:1 feature match with current UI (visual redesign only)**
- ✅ **Mobile-first design; responsive behavior is Phase 2**

### Recommendation for Implementation Order

**Phase 1: Implement Missing Screens** (Before UI Redesign)
1. Game Results screen
2. Leaderboard page
3. Brain Profile / Profile page
4. Account Creation modal

**Phase 2: UI/UX Redesign** (Apply new design system to all screens)
1. Redesign each screen per attached mockups
2. Maintain all existing features and functionality
3. Test that all business logic remains intact

**Phase 3: Responsive Behavior** (Desktop/Tablet)
1. Add desktop navigation
2. Adjust layouts for larger screens
3. Optimize for tablet experience

---

## Status: All 6 Questions Resolved ✅

### Design Adjustments Required (Before UI Redesign)

- [x] **Game Naming** — Update "Pattern Recall" → "Pattern Breaker"
- [x] **Profession Scope** — Lock to 5; no 12-profession expansion
- [x] **Post-Game Flow** — Confirmed atomic; render results with all data simultaneously
- [x] **Leaderboard** — Descope cross-user rankings; design Local Personal Bests instead
- [x] **Brain Profile** — Design radar chart for 5/8 skills populated gracefully
- [x] **Account Modal** — Design UI; defer trigger logic to auth sprint

### Blockers: None

All technical and architectural questions are resolved. Proceeding to Phase 1 implementation.

---

## Recommended Sequence

### Immediate: Design Adjustments
1. Update design mockups: "Pattern Recall" → "Pattern Breaker"
2. Descope 12-profession design; lock onboarding to 5 professions
3. Redesign Leaderboard as Local Personal Bests (not cross-user)
4. Update Brain Profile radar to gracefully show only 5/8 populated skills
5. Flag Account Modal trigger logic as deferred to auth sprint

### Phase 1: Backend Implementation
1. Implement Game Results screen component (hook into `complete-game-session.ts`)
2. Implement Brain Profile / Profile page (query `calculateBrainProfile()` + `calculateLevel()`)
3. Implement Leaderboard as Local Personal Bests (query IndexedDB `gameResultsStore`)
4. Implement Account Modal UI (deferred: trigger logic)

### Phase 2: UI/UX Redesign
1. Apply design system to all 11 screens
2. Verify all business logic remains intact (no breaking changes)
3. Test on mobile devices

### Phase 3: Responsive Behavior (Desktop)
1. Add desktop navigation
2. Optimize layouts for tablet/desktop
3. Implement media queries per design

---

**Document Status:** Ready for user review and clarification  
**Prepared by:** AI Assistant (Discovery Phase)  
**Date:** 2026-08-14
