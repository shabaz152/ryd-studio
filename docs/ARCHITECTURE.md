# RYD STUDIO — Complete System Architecture Documentation
> **Frontend, Backend, and UI System Architecture**  
> **Document Version:** 2.0  
> **Design Style Reference:** Inspired by editorial diagramming principles (`cathrynlavery/diagram-design`)

---

## 📋 Table of Contents
1. [Architectural Principles & Design Philosophy](#1-architectural-principles--design-philosophy)
2. [High-Level System Topology](#2-high-level-system-topology)
3. [Frontend Architecture (React 19 + TypeScript + Vite)](#3-frontend-architecture-react-19--typescript--vite)
   - [Component Hierarchy & View Layer](#component-hierarchy--view-layer)
   - [Context State Machine & Derived Invariants](#context-state-machine--derived-invariants)
   - [Local Storage & BroadcastChannel Inter-Tab Bus](#local-storage--broadcastchannel-inter-tab-bus)
4. [Backend & Cloud Architecture (Vercel Serverless + Vercel Blob)](#4-backend--cloud-architecture-vercel-serverless--vercel-blob)
   - [Serverless Handler Lifecycle](#serverless-handler-lifecycle)
   - [Blob Storage & Edge CDN Delivery](#blob-storage--edge-cdn-delivery)
5. [UI/UX Architecture & Responsive Viewport Engine](#5-uiux-architecture--responsive-viewport-engine)
   - [Subtle CRM Light Theme vs. Obsidian Dark Engine](#subtle-crm-light-theme-vs-obsidian-dark-engine)
   - [Mobile Device Frame Container (Dynamic Island Emulation)](#mobile-device-frame-container-dynamic-island-emulation)
6. [Hardware & Media Subsystems (Web Audio & Web Speech API)](#6-hardware--media-subsystems-web-audio--web-speech-api)
7. [The 1:1 Lifecycle State Machine](#7-the-11-lifecycle-state-machine)

---

## 1. Architectural Principles & Design Philosophy

RYD STUDIO is built on five core engineering principles:

1. **Zero-Latency Tactile Responsiveness:**
   User actions (clicks, check-ins, tab switches, audio feedback) render with zero perceptible delay (<16ms 60fps target).
2. **Single Source of Truth with Mathematical Invariants:**
   Data cannot be stored in contradictory duplicate states. State like `isCheckedIn` is derived from `sessions`, preventing out-of-sync bugs.
3. **1-to-1 Operational Lifecycle Invariance:**
   For every check-in, exactly one check-out must exist. A session cannot be checked in if another is active, cannot be checked out multiple times, and payroll hours must strictly equal the sum of completed sessions.
4. **Offline Resilience & Hybrid Sync:**
   The client works 100% offline via local cache, syncing seamlessly to Vercel global edge storage upon reconnecting.
5. **Editorial Visual Clarity (WCAG AAA):**
   Clean typography, hairline borders, no muddy drop-shadows, and high-contrast color palettes ensuring readability under bright studio lights or dark backstage wings.

---

## 2. High-Level System Topology

```
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                                 RYD STUDIO GLOBAL TOPOLOGY                              │
├────────────────────────────────────────────────────────┬────────────────────────────────┤
│                     CLIENT TIER                        │           CLOUD TIER           │
│                                                        │                                │
│   ┌────────────────────────────────────────────────┐   │                                │
│   │                 React 19 View                  │   │                                │
│   │  Navbar • Dashboard • Schedule • Modals • CRM  │   │                                │
│   └───────────────────────┬────────────────────────┘   │                                │
│                           │                            │                                │
│                           ▼                            │                                │
│   ┌────────────────────────────────────────────────┐   │                                │
│   │              AppContext State Machine          │   │                                │
│   │  Derived: isCheckedIn, reconciledTeacher, etc. │   │                                │
│   └───────────┬──────────────────────┬─────────────┘   │                                │
│               │                      │                 │                                │
│     Inter-tab │ BroadcastChannel     │ HTTP Fetch      │                                │
│               ▼                      ▼                 │                                │
│   ┌──────────────────────┐   ┌─────────────────────┐   │   ┌────────────────────────┐   │
│   │ Same-Device Tabs Bus │   │   POST /api/sync    │───┼──▶│ Vercel Serverless Edge │   │
│   │ (<10ms sync)         │   │   GET /api/sync     │◀──┼───│ Node.js 20 Function    │   │
│   └──────────────────────┘   └─────────────────────┘   │   └───────────┬────────────┘   │
│               │                                        │               │ put() / list() │
│               ▼                                        │               ▼                │
│   ┌──────────────────────┐                             │   ┌────────────────────────┐   │
│   │ localStorage Cache   │                             │   │ Vercel Blob Storage    │   │
│   │ (Offline resilience) │                             │   │ (ryd_studio_state.json)│   │
│   └──────────────────────┘                             │   └────────────────────────┘   │
└────────────────────────────────────────────────────────┴────────────────────────────────┘
```

---

## 3. Frontend Architecture (React 19 + TypeScript + Vite)

### Component Hierarchy & View Layer
The frontend is modularized into cleanly separated layers:

```
App.tsx
├── SplashWelcome.tsx (Optional first-load animated screen)
├── Navbar.tsx (Monogram, tab navigator, live cloud sync indicator, theme toggle, sound toggle)
├── Viewport Frame (Responsive desktop full-width OR Mobile iPhone 16 Pro Max 430px container)
│   ├── HomeView.tsx
│   │   ├── TeacherHeroBanner (Editable instructor name, Month hours, Month earnings, Rating)
│   │   ├── QuickActionBar (1:1 Verification Bar, Check In Card, Check Out Card, Late Card)
│   │   ├── TodaysClassSchedule (List of session cards, directions, code badges)
│   │   └── QuickAdminHub (Shortcuts to leads, orders, and studio broadcasts)
│   ├── BatchesView.tsx (Cohort cards, student roster, EnrollStudentModal)
│   ├── LeadsView.tsx (Walk-in & inquiry intake, 4-stage pipeline progression)
│   ├── UpdatesView.tsx (Central messaging hub, broadcast compose modal, clear updates)
│   ├── ReferralView.tsx (4-stage candidate audition pipeline, QR code modal, bonus tally)
│   ├── WorkbooksView.tsx (Curriculum inventory, order placement, tracking timeline)
│   ├── FreeSlotsView.tsx (Open studio floor booking, rehearsal reservation)
│   └── RatingsView.tsx (Faculty reviews, category score breakdowns, teacher replies)
├── Modals Container (Rendered conditionally via Portal/Context)
│   ├── CheckInModal.tsx
│   ├── CheckOutModal.tsx (With isSubmitting debounce and attendance matrix)
│   ├── RunningLateModal.tsx (With Web Speech API voice dictation)
│   ├── NewSessionModal.tsx
│   ├── RescheduleModal.tsx
│   ├── EnrollStudentModal.tsx
│   └── LogLeadModal.tsx
└── BottomNav.tsx (Mobile preview bottom navigation bar)
```

### Context State Machine & Derived Invariants
In `src/context/AppContext.tsx`, state is split into **Raw Storage State** and **Derived Invariants**:

```typescript
// 1. Raw Storage State
const [sessions, setSessions] = useState<Session[]>(...);
const [teacher, setTeacher] = useState<TeacherProfile>(...);

// 2. Derived Invariant State (Mathematically guaranteed)
const checkedInSession = sessions.find((s) => s.status === 'checked_in') || null;
const isCheckedIn = !!checkedInSession;
const checkInTime = checkedInSession?.checkInTime || null;

const completedSessions = sessions.filter((s) => s.status === 'completed');
const actualCompletedCount = completedSessions.length;
const actualHours = completedSessions.reduce(
  (sum, s) => sum + (s.teacherHoursLogged || (s.durationMinutes || 90) / 60), 0
);
const actualEarnings = completedSessions.reduce(
  (sum, s) => sum + (s.teacherEarnings || ((s.durationMinutes || 90) / 60) * (teacher.hourlyRate || 50)), 0
);

const reconciledTeacher: TeacherProfile = {
  ...teacher,
  totalHoursMonth: +actualHours.toFixed(1),
  totalEarningsMonth: Math.round(actualEarnings),
  classesCompletedThisWeek: actualCompletedCount,
};
```

---

## 4. Backend & Cloud Architecture (Vercel Serverless + Vercel Blob)

### Serverless Handler Lifecycle (`api/sync.js`)
- **GET Request:**
  Calls `list({ prefix: 'ryd_studio_state.json' })` from `@vercel/blob`, retrieves the public blob URL, fetches JSON content, and responds with `{ exists: true, data, timestamp }`.
- **POST Request:**
  Validates request payload, adds server timestamp `_syncTimestamp: Date.now()`, and executes `put('ryd_studio_state.json', body, { access: 'public', allowOverwrite: true })`.
- **OPTIONS Request:**
  Responds immediately with CORS preflight headers (`status: 200`).

---

## 5. UI/UX Architecture & Responsive Viewport Engine

### Subtle CRM Light Theme vs. Obsidian Dark Engine
Theme state is injected directly at the root `<html>` and `<body>` elements:
- **CRM Light Mode:** `.crm-light` class on `document.documentElement` activates light slate canvas (`#F8FAFC`), pure white cards (`#FFFFFF`), and deep slate typography (`#0F172A`).
- **Obsidian Dark Mode:** `.dark` class activates midnight black canvas (`#0C0C12`) with high-gloss gold specular highlights.

### Mobile Device Frame Container (Dynamic Island Emulation)
When the user toggles **Mobile View Mode** (`viewMode === 'mobile'`):
- The viewport is constrained to `max-w-[430px]`, simulating a high-end smartphone screen.
- A physical **Dynamic Island notch** (`w-32 h-7 bg-black rounded-full`) is fixed at the top with `pointer-events-none`.
- Container top clearance (`pt-10`) prevents UI collisions with the notch.
- The bottom navigation bar is pinned to the base of the phone frame (`sticky bottom-0`).

---

## 6. Hardware & Media Subsystems (Web Audio & Web Speech API)

### Zero-Asset Web Audio API Synthesizer (`src/utils/sound.ts`)
Instead of loading slow MP3 files over the network, RYD STUDIO uses the browser's native `AudioContext`:
- Oscillators: `sine` and `triangle` waves.
- Envelopes: Exponential gain decay curves.
- Instantaneous triggering ($0\text{ms}$ latency) on all touch and click interactions.

### Real-Time Speech Recognition Engine (`src/utils/speech.ts`)
Uses the browser's native `webkitSpeechRecognition` or `SpeechRecognition`:
- Dictates teacher transit delay notes hands-free.
- Automatically handles speech start, continuous transcript streaming, and auto-stop callbacks.

---

## 7. The 1:1 Lifecycle State Machine

```
      [SCHEDULED] (Ready for arrival)
           │
           │ action: checkIn(sessionId)
           │ guard: !sessions.some(s => s.status === 'checked_in')
           ▼
     [CHECKED_IN] (Class in progress)
           │
           │ action: checkOut(sessionId, attendance, notes)
           │ guard: session.status === 'checked_in' && !isSubmitting
           ▼
      [COMPLETED] (1:1 Paired and Sealed)
```

---
*End of Architecture Documentation • RYD STUDIO Platform Engineering*
