# RYD STUDIO — Comprehensive User Manual & Operations Guide
> **Version 2.0 • Executive Studio Edition**  
> **Platform URL:** [https://ryd-studio.vercel.app](https://ryd-studio.vercel.app)  
> **Target Audience:** Studio Directors, Dance Instructors, Front-Desk Operations Staff, and Studio Coordinators

---

## 📋 Table of Contents
1. [Executive Overview & Platform Purpose](#1-executive-overview--platform-purpose)
2. [Quick-Start Walkthrough: First-Time Setup in 60 Seconds](#2-quick-start-walkthrough-first-time-setup-in-60-seconds)
3. [The Core 1:1 Check-In & Check-Out Lifecycle (Strict Studio Invariance)](#3-the-core-11-check-in--check-out-lifecycle-strict-studio-invariance)
4. [Main Action Dashboard: One-Tap Workflows](#4-main-action-dashboard-one-tap-workflows)
5. [Today's Studio Sessions & Schedule Management](#5-todays-studio-sessions--schedule-management)
6. [Cohort Batches & Student Roster Management](#6-cohort-batches--student-roster-management)
7. [Studio Leads & Walk-In Inquiries (Dynamic CRM Pipeline)](#7-studio-leads--walk-in-inquiries-dynamic-crm-pipeline)
8. [Central Broadcast Messaging Hub & Parent Dispatch](#8-central-broadcast-messaging-hub--parent-dispatch)
9. [Teacher Referral Program & 4-Stage Audition Pipeline](#9-teacher-referral-program--4-stage-audition-pipeline)
10. [Curriculum & Student Workbook Order Store](#10-curriculum--student-workbook-order-store)
11. [Cross-Device Live Cloud Sync & Device Views](#11-cross-device-live-cloud-sync--device-views)
12. [Theme Customization: CRM Light vs. Obsidian Dark](#12-theme-customization-crm-light-vs-obsidian-dark)
13. [Voice Dictation & Audio Effects System](#13-voice-dictation--audio-effects-system)
14. [Troubleshooting, FAQs & Error Recovery](#14-troubleshooting-faqs--error-recovery)

---

## 1. Executive Overview & Platform Purpose

**RYD STUDIO** is an executive-grade studio management and faculty operations console engineered for modern performing arts academies and dance studios. Built with high contrast, tactile responsiveness, and strict operational invariants, the platform centralizes:

- **Faculty Time & Attendance Tracking:** Strict 1:1 pairing ensures every session arrival matches exactly one departure, protecting payroll accuracy.
- **Roster & Student Progress Tracking:** Real-time cohort rosters, age-specific student cards, and attendance logging (Present, Absent, Late, Excused).
- **Lead & Walk-In Intake:** Direct, zero-friction conversion of studio walk-ins and phone/web inquiries into enrolled dancers.
- **Automated Family Communications:** Instant push, SMS, and WhatsApp broadcasts for transit delays, schedule shifts, and studio bulletins.
- **Real-Time Cloud Synchronization:** Sub-second state reconciliation across iPhones, Android tablets, laptops, and front-desk workstations.

```
┌────────────────────────────────────────────────────────────────────────┐
│                        RYD STUDIO ARCHITECTURE                         │
├────────────────────────────────┬───────────────────────────────────────┤
│    Faculty & Operations UI     │       Real-Time Cloud Sync Hub        │
│                                │                                       │
│  [ Step 1: Arrival Check-In ]  │   Vercel Edge Global Blob Storage     │
│              │                 │                  ▲                    │
│              ▼                 │                  │ (HTTP PUT / GET)   │
│  [ Active Class In Progress ]  │                  ▼                    │
│              │                 │   Local BroadcastChannel Bus (<10ms)  │
│              ▼                 │                  ▲                    │
│  [ Step 2: 1:1 Check-Out    ]  │                  ▼                    │
│     (Attendance + Payroll)     │   Multi-Device Reactive LocalState    │
└────────────────────────────────┴───────────────────────────────────────┘
```

---

## 2. Quick-Start Walkthrough: First-Time Setup in 60 Seconds

When you open **RYD STUDIO** for the first time on any device:

1. **Visit the Live URL:** Navigate to [https://ryd-studio.vercel.app](https://ryd-studio.vercel.app).
2. **Review Your Default Baseline:**
   - All enrolled student counters begin strictly at **0**.
   - All teacher candidate pipelines begin strictly at **0**.
   - Completed class hours begin strictly at **0.0 hrs** ($0.00 earned).
3. **Personalize Teacher Profile:**
   - In the top hero section, tap the pencil icon next to the teacher name (default: *Sarah Jenkins*).
   - Enter your name and click the green checkmark or press `Enter`. The updated name synchronizes instantly across all views.
4. **Choose Your Preferred Visual Mode:**
   - Click the **Sun / Moon** icon in the upper-right corner to toggle between the **Subtle CRM Light Theme** (clean slate and white cards) and **Executive Obsidian Dark Mode** (deep midnight obsidian with studio gold sheen).
5. **Select Your Device Viewport:**
   - On desktop, toggle between **Responsive Full-Width** and **Mobile Device Frame** (with simulated Dynamic Island notch) via the phone/monitor button in the top navigation bar.

---

## 3. The Core 1:1 Check-In & Check-Out Lifecycle (Strict Studio Invariance)

The studio operates on a **zero-tolerance 1-to-1 operational rule**:
$$\text{For every Check-In, there is one and only one Check-Out.}$$

### Why This Rule Exists:
In busy dance studios, instructors previously could accidentally check into two classes at once, forget to check out, or double-click the checkout button, creating phantom completed classes and corrupting payroll records. RYD STUDIO enforces mathematical 1:1 pairing directly at the state machine level.

```
                  ┌───────────────────────────────┐
                  │      SCHEDULED SESSION        │
                  │   Status: 'scheduled'         │
                  └──────────────┬────────────────┘
                                 │
                                 │ Teacher taps "Check In"
                                 ▼
                  ┌───────────────────────────────┐
                  │       ACTIVE CHECK-IN         │
                  │   Status: 'checked_in'        │
                  │   • checkInTime recorded      │
                  │   • Other classes LOCKED      │
                  └──────────────┬────────────────┘
                                 │
                                 │ Teacher marks student attendance
                                 │ and taps "Complete 1:1 Check-Out"
                                 ▼
                  ┌───────────────────────────────┐
                  │      1:1 COMPLETED PAIR       │
                  │   Status: 'completed'         │
                  │   • checkOutTime recorded     │
                  │   • Hours & Pay auto-credited │
                  │   • Cannot check out again    │
                  └───────────────────────────────┘
```

### The 4 Invariant Guarantees:
1. **No Check-Out Without Check-In:**
   - If a teacher taps "Check Out" before checking into a class, the platform displays an alert toast: *"Check-In Required First — For every check-in there has to be one check-out"* and opens the check-in modal.
2. **Single Active Class Invariance:**
   - A teacher can **never** check into two classes at the same time. If a class is active, all other scheduled classes show **`Check In Locked`**.
3. **One and Only One Check-Out:**
   - An active class can only be checked out once. Once submitted, its status permanently transitions to `completed` and the check-out button is replaced with an immutable **`1:1 Checked Out (16:00 → 17:30)`** badge.
4. **Debounced Double-Click Prevention:**
   - The check-out submission button is protected with an `isSubmitting` gate. Clicking once immediately disables the button and displays `Checking Out...`, preventing double-billing.

---

## 4. Main Action Dashboard: One-Tap Workflows

Located directly on the Home dashboard, the **Main Action Dashboard** provides 3 high-visibility cards and a live 1:1 metric verification bar:

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│ [1:1] Check-In & Check-Out Verification: For 1 check-in there is 1 check-out     │
│ Check-Ins: 1  •  Check-Outs: 0               [ 1 Active (1 Check-Out Pending) ]  │
└──────────────────────────────────────────────────────────────────────────────────┘

┌────────────────────────┐  ┌────────────────────────┐  ┌────────────────────────┐
│      CARD 1: IN        │  │     CARD 2: OUT        │  │     CARD 3: LATE       │
│  Step 1 • Arrival      │  │  Step 2 • Departure    │  │  Quick Transit Alert   │
│                        │  │                        │  │                        │
│  Check In to Studio    │  │  Complete Check Out    │  │  Running Late?         │
│  Review class timings, │  │  Tap to complete its   │  │  Select 5 or 10 mins   │
│  roster & venue map    │  │  1-and-only check-out  │  │  with voice recording  │
│                        │  │                        │  │                        │
│  [ Open Planner ↗ ]    │  │  [ Check Out Now ↗ ]   │  │  [ Notify Parents ↗ ]  │
└────────────────────────┘  └────────────────────────┘  └────────────────────────┘
```

### Card 1: Check In to Studio (Step 1)
- **State when Idle:** Displays *"Step 1 • Arrival"*. Tap to view today's scheduled classes, studio hall assignments, and enrolled student count.
- **State when Active:** Displays *"Checked In (Step 1 ✓)"*. Tap to view session details or directions to the venue.

### Card 2: Complete Check Out (Step 2)
- **State when Idle (No class active):** Displays *"Step 2 • Check-Out Locked"*. Tapping it explains that a class must be checked in first.
- **State when Active (Class in progress):** Displays *"Step 2 • 1 Check-Out Ready"*. Tapping it opens `CheckOutModal` with the student attendance sheet and hours computation.

### Card 3: Running Late? (Transit Delay Broadcast)
- **Purpose:** Immediate 1-tap parent notification if stuck in subway transfers or traffic.
- **Options:** Select **+5 mins** or **+10 mins**.
- **Voice Dictation:** Tap the microphone icon and speak your delay reason (e.g. *"Heavy rain near Midtown tunnel"*).
- **Automated Dispatch:** Clicking **`Dispatch Notice`** sends an automated SMS & push notification to all parents in that cohort and posts a banner alert on the dashboard.

---

## 5. Today's Studio Sessions & Schedule Management

The **Studio Sessions & Schedule** section displays all scheduled and completed classes for the day.

### Adding a New Session:
1. Tap the gold **`+ Add Schedule & Session`** button.
2. Select an existing Cohort Batch or choose **Custom / Masterclass**.
3. Choose the Session Date, Time Slot (e.g. `16:00 - 17:30`), Duration (e.g. `90 Minutes`), Studio Hall, and Class Index.
4. Check **"Send automated schedule announcement to batch parents"** to broadcast notification immediately.
5. Tap **`Confirm & Schedule Session`**. The session appears instantly on the calendar with a structured code (e.g. `2:1sch`).

### Rescheduling a Session:
1. On any session card, tap **`Reschedule`**.
2. Pick the proposed date, new time slot, and reason (e.g. *Faculty rehearsal, hall maintenance*).
3. Tap **`Dispatch Reschedule Notice`**. Google Calendar and iCal sync codes are regenerated and sent to parents.

### Cancelling a Session:
1. In the reschedule modal, choose the **Cancel Class** tab.
2. Select cancellation reason and click **`Confirm Cancellation`**. A structured makeup credit is issued to student accounts.

### Deleting Sessions:
- Tap the **Trash Can icon** on any individual session card to remove it.
- Tap **`Clear Sessions`** in the header to wipe all scheduled classes for today (with confirmation prompt).

---

## 6. Cohort Batches & Student Roster Management

Tap the **`Batches`** tab in the navigation bar to access cohort management:

### The 4 Signature Cohorts:
1. **Hip-Hop Juniors Crew** (Urban Street • Ages 7–11 • Studio Alpha - Hall 1)
2. **Contemporary Elite** (Lyrical Flow • Ages 12–16 • Studio Beta - Hall 3)
3. **Bollywood Beats Pro** (Cinematic Fusion • Adults 18+ • Studio Gamma - Arena)
4. **Street Jazz Starters** (Musicality Basics • Ages 5–8 • Studio Delta - Hall 4)

### 0-Baseline Student Roster:
All cohorts initialize with **0 enrolled dancers** as requested.

### Enrolling a New Dancer:
1. Select the cohort card and tap **`Enroll Student`** or **`+ Enroll First Dancer`**.
2. Complete the enrollment form:
   - **Dancer Full Name** (e.g. `Maya Lin`)
   - **Age** (e.g. `9`)
   - **Parent / Guardian Name** (e.g. `Elena Lin`)
   - **Parent Contact Phone Number** (e.g. `+1 (555) 234-8901`)
   - **Parent Email Address**
   - **Choreography Notes / Medical Disclosures**
3. Tap **`Complete Dancer Enrollment`**.
4. The roster counter increments (**0 ➔ 1**), a welcoming audio chime plays, and a confirmation toast appears.

### Marking Attendance During Check-Out:
When checking out of class, each enrolled student card has 4 one-tap attendance status buttons:
- **`[P] Present`** (Gold badge)
- **`[A] Absent`** (Red badge)
- **`[L] Late`** (Amber badge)
- **`[E] Excused`** (Slate badge)
- Shortcut: Tap **`✓ Mark All Present`** to batch-fill the entire class in 1 second.
- Enter individual progress notes per student (e.g. *"Mastered center-floor pirouette combination"*).

---

## 7. Studio Leads & Walk-In Inquiries (Dynamic CRM Pipeline)

Tap the **`Leads`** tab to access the studio intake CRM.

### Two Dedicated Channels:
1. **Walk-Ins:** Dancers or parents who physically walked into the studio reception.
2. **Enquiries:** Prospects who called, emailed, or submitted web inquiry forms.

### Dynamic 0-Baseline Intake:
Counters start at **0 Walk-Ins** and **0 Enquiries**. When you log a prospect:
1. Tap **`+ Log Studio Lead`**.
2. Select Lead Type: **Walk-In** or **Inquiry**.
3. Choose Target Dance Style (Hip-Hop, Contemporary, Bollywood, Street Jazz).
4. Enter Contact Name, Phone, Email, and Preferred Skill Level.
5. Tap **`Save & Notify Reception Desk`**.
6. The lead counter increments dynamically (**0 ➔ 1**).

### Pipeline Stage Progression:
Each lead card features a 1-tap stage progression button:
$$\text{New Lead} \longrightarrow \text{Contacted} \longrightarrow \text{Trial Scheduled} \longrightarrow \text{Enrolled} \checkmark$$
- When moved to **Enrolled**, the student is automatically ready for cohort allotment.
- Tap the **Trash Can icon** to delete invalid leads or test decrementing counters.

---

## 8. Central Broadcast Messaging Hub & Parent Dispatch

Tap the **`Updates`** tab to manage studio-wide family communications.

### Message Types:
- **Broadcast Announcements:** Dispatched to all parents across an entire cohort (or the entire studio).
- **Direct 1-on-1 Feedback:** Dispatched privately to a specific dancer's family.

### Composing a Broadcast:
1. Tap **`+ Compose Broadcast`**.
2. Select recipient cohort (or *All Studio Families*).
3. Choose communication channels: **App Push**, **SMS Message**, and **WhatsApp Notification**.
4. Enter Subject and Announcement message.
5. Tap **`Send Instant Broadcast`**. Parents receive the alert instantly.

### Clearing Updates:
- To reset or declutter announcements, tap **`Clear Updates`** in the top header.
- Confirm the prompt to safely clear out message history.

---

## 9. Teacher Referral Program & 4-Stage Audition Pipeline

Tap the **`Referral`** tab to manage the instructor hiring and referral pipeline.

### Dynamic 0-Baseline Pipeline:
- **Total Invites Sent:** Starts at `0`.
- **In Audition Pipeline:** Starts at `0`.
- **Successfully Joined Teachers:** Starts at `0`.
- **Total Bonus Earned:** Starts at `$0` ($150 per successfully joined instructor).

### The 4 Candidate Stages:
1. **Starting Referral:** Candidate added via referral code or link.
2. **Interview:** Audition video reviewed and interview scheduled.
3. **Selected:** Audition passed; offer letter and background check issued.
4. **Successfully Joined:** Teacher joins faculty, assigned batches, and **+$150 bonus** is credited to referring teacher.

### Referring an Instructor:
1. Tap **`+ Refer New Instructor`**.
2. Enter Candidate Name, Email, Phone, Primary Style, and Years of Teaching Experience.
3. Tap **`Register Candidate`**.
4. Advance the candidate through the 4 stages using the gold **`Advance Stage →`** button on their card.

### Sharing Your Referral Code:
- Copy your unique code: **`RYD-SARAH-2026`**.
- Tap **`Copy Referral Link`** to copy a direct web referral link to your clipboard.
- Tap **`Show QR Code`** to generate an on-screen QR code for candidate scanning.

---

## 10. Curriculum & Student Workbook Order Store

Tap the **`Workbooks`** tab to view and order official academy curriculum syllabi.

### Ordering Curriculum Guides:
1. Tap **`Order Workbook`**.
2. Select the Student and Cohort Batch.
3. Select the Syllabus Title (e.g. *Urban Movement & Rhythm Theory Level 2*, *Anatomy & Flow Alignment Handbook*).
4. Select quantity and delivery destination (Locker or Front Desk).
5. Tap **`Submit Order`**. Live tracking status updates from `dispatched` to `in_transit` to `delivered`.

---

## 11. Cross-Device Live Cloud Sync & Device Views

RYD STUDIO synchronizes seamlessly across all studio hardware:

### Live Sync Indicator (Top Header):
- **`● Live Cloud` (Pulsing Emerald):** Local data matches the global cloud.
- **`○ Syncing...` (Spinning Ring):** Transmission in progress.
- **`● Offline` (Red Badge):** Operating on local cached memory; will auto-sync upon reconnection.
- **Manual Trigger:** Tap the cloud indicator at any time to force an instant refresh.

### Device Viewport Modes:
- **Responsive Mode:** Expands across full desktop displays, wide tablets, and hall monitors.
- **Mobile Device Frame:** Simulates an iPhone 16 Pro Max viewport (430px wide) with Dynamic Island notch, ideal for testing instructor mobile interactions.

---

## 12. Theme Customization: CRM Light vs. Obsidian Dark

Tap the **Sun / Moon** icon in the upper right navigation bar to toggle themes:

| Feature | Subtle CRM Light Theme (Default) | Executive Obsidian Dark |
|---|---|---|
| **Background Canvas** | Subtle slate `#F8FAFC` with radial amber sheen | Deep obsidian `#0C0C12` with midnight gradient |
| **Card Surfaces** | Crisp pure white `#FFFFFF` with `#E2E8F0` border | Glossy dark pill cards with specular top sheen |
| **Typography** | Deep slate `#0F172A` (WCAG AAA compliant) | Crisp pure white `#FFFFFF` with slate accents |
| **Accent Colors** | Studio Amber `#D97706` & Gold `#F59E0B` | Glowing Gold `#FFD000` & `#FACC15` |
| **Best Used For** | Bright studio daytime lighting, front-desk reception | Low-light evening rehearsals, stage wings |

---

## 13. Voice Dictation & Audio Effects System

### Audio Feedback:
Every action in RYD STUDIO provides tactile audio feedback generated via the native browser **Web Audio API** (zero MP3 download latency):
- **Click:** Subtle high-precision mechanical click ($800\text{ Hz}$).
- **Check-In:** Ascending major triad ($440\text{ Hz} \rightarrow 554\text{ Hz} \rightarrow 659\text{ Hz}$).
- **Check-Out:** Rewarding resolution chord with gentle decay.
- **Notification:** Warm dual-tone broadcast alert.
- **Alert:** Low-frequency cautionary tone ($220\text{ Hz}$).
- **Mute / Unmute:** Tap the **Speaker** icon in the navigation bar to toggle sounds at any time.

### Voice Speech Recognition:
When reporting delays in `RunningLateModal`:
1. Tap the **Microphone** button.
2. Speak clearly into your device microphone (e.g. *"Subway signal hold at Broadway station"*).
3. The platform transcribes your voice directly into the delay reason field in real time.
4. Tap the microphone again to finish dictation.

---

## 14. Troubleshooting, FAQs & Error Recovery

### Q: Why does the Check-In button say "Check In Locked"?
**A:** You are already checked into another studio class. Because of the **1:1 Pairing Rule**, you must complete check-out of your active class before checking into a new one. Simply tap the active class or navbar pill to complete checkout.

### Q: Why can't I click "Check Out" from the Quick Action Bar?
**A:** You do not have an active checked-in class. For every check-in there is one check-out. Check into a scheduled class first, and the Check-Out card will unlock automatically.

### Q: What happens if the internet goes down during class?
**A:** RYD STUDIO works 100% offline. All check-ins, attendances, and notes are saved to your browser's encrypted `localStorage`. When connectivity restores, the platform synchronizes with the cloud automatically.

### Q: How do I completely reset today's schedule?
**A:** On the Home screen, click the red **`Clear Sessions`** button above today's timetable. Confirm the prompt to clear out all sessions. All completed hour counters will return to 0.

### Q: How can another instructor see my updates on their phone?
**A:** As long as both devices are connected to the internet, any change made on one device syncs to all other devices in under 1 second via the Vercel global edge network.

---
*End of User Manual • RYD STUDIO Operations Documentation*
