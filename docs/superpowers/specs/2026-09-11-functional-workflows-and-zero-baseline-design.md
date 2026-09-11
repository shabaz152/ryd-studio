# Functional Workflows & Zero-Baseline Architecture Design

**Document ID**: `SPEC-2026-09-11-WORKFLOWS-0-BASELINE`  
**Date**: September 11, 2026  
**Status**: Draft for User Review  

---

## 1. Executive Summary

RYD STUDIO is transitioning from a high-fidelity interface to a **fully stateful operational platform**. This specification details the end-to-end implementation of:
1. **Reschedule Engine**: Teacher request ➔ Parent notification ➔ Parent acceptance ➔ Slot confirmation ➔ Batch schedule update ➔ Google Calendar sync.
2. **Check Out & Attendance Engine**: Check-out prompt ➔ Student attendance recording ➔ Batch student update ➔ Teacher attendance logging ➔ Automatic working hours and rewards calculation.
3. **0-Baseline Metrics Architecture**: Brand-new teacher accounts start strictly at 0 across all 7 operational metrics, with dynamic mathematical derivation and an optional Demo Mode toggle.

---

## 2. 0-Baseline Operational Metrics (Clean Initial State)

For a new account with no activity, all dashboard metrics start strictly at **0**, dynamically bound to live state:

| Metric | Clean Initial Value | Derivation Formula | Increment Trigger |
| :--- | :---: | :--- | :--- |
| **Today's Classes** | `0` | `sessions.filter(s => s.date === TODAY && (s.status === 'scheduled' \|\| s.status === 'checked_in')).length` | Adding/scheduling a class for today |
| **Students** | `0` | `batches.reduce((sum, b) => sum + b.students.length, 0)` | Enrolling a dancer into any cohort batch |
| **Pending Requests** | `0` | `sessions.filter(s => s.rescheduleState === 'pending_parent_approval').length` | Requesting a reschedule (+1) / Parent acceptance (-1) |
| **Completed Sessions** | `0` | `sessions.filter(s => s.status === 'completed').length` | Completing check-out on an active class |
| **Late Arrivals** | `0` | `sessions.filter(s => s.isLateArrival).length + (isRunningLate ? 1 : 0)` | Reporting running late or checking in after slot start |
| **Referrals** | `0` | `referralStats.candidates.length` | Referring an instructor candidate |
| **Rewards** | `₹0` | `sessions.filter(s => s.status === 'completed').reduce((sum, s) => sum + (s.teacherEarnings || 0), 0) + referralStats.bonusEarned` | Logging teaching hours (₹500/hr) or referral milestones |

### Demo Mode Switch
- Added in the navigation bar: `[Clean 0-State (Default) | Load Demo Data]`.
- Allows instant switching between an empty 0-baseline account and a populated sandbox for presentations without manual data entry.

---

## 3. Workflow 1: End-to-End Class Reschedule Engine

### Step-by-Step Sequence

```
[Teacher Action]
Teacher selects session -> Opens RescheduleModal
Inputs proposed new date, time, and reason
Clicks "Dispatch Reschedule Request"
          │
          ▼
[State Transition]
session.rescheduleState = 'pending_parent_approval'
session.status = 'rescheduled'
session.proposedDate = "2026-09-12"
session.proposedTime = "17:00 - 18:30"
Pending Requests: 0 ➔ 1
          │
          ▼
[Parent Notification & Preview]
System dispatches broadcast update to parents:
"Reschedule Request: Hip-Hop Juniors proposed for Sep 12, 17:00. Action required."
          │
          ▼
[Parent Review & Acceptance]
Parent can accept via:
  a) Reschedule View banner: [Accept Proposed Slot] / [Decline]
  b) Central Hub message action: [Review & Accept as Parent]
  c) Simulated Parent SMS/WhatsApp dialog
          │
          ▼
[Execution & Confirmation]
Parent clicks [Accept Proposed Slot]:
  1. session.date is overwritten with proposedDate
  2. session.timeSlot is overwritten with proposedTime
  3. session.status returns to 'scheduled'
  4. session.rescheduleState = 'confirmed'
  5. session.calendarCode updated with 'res' marker
  6. Matching batch in batches list updates its timetable
  7. Google Calendar URL & .ICS file generated for the new confirmed slot
  8. Pending Requests: 1 ➔ 0
  9. Toast & Confirmation broadcast emitted
```

### Data Contract Updates (`types/index.ts`)
```typescript
export type RescheduleState = 'none' | 'pending_parent_approval' | 'confirmed' | 'declined';

export interface Session {
  // ... existing properties
  rescheduleState?: RescheduleState;
  proposedDate?: string;
  proposedTime?: string;
  rescheduleReason?: string;
  parentNotified?: boolean;
  parentAcceptedAt?: string;
  isLateArrival?: boolean;
}
```

---

## 4. Workflow 2: Check Out, Student Attendance & Payroll Engine

### Step-by-Step Sequence

```
[Teacher Action]
Teacher taps "Check Out" on active checked-in class
          │
          ▼
[Student Attendance Prompt]
CheckOutModal presents student roster for the batch:
  • Each student card: [Present] | [Absent] | [Late] | [Excused]
  • Quick action: [Mark All Present]
  • Student progress note input
  • Faculty journal / session summary input
          │
          ▼
[Attendance Submission & State Commit]
Teacher clicks "Submit Attendance & Complete Check-Out":
  1. Session Status: 'checked_in' ➔ 'completed'
  2. Session Check-Out Time recorded (e.g., "17:30")
  3. Session Working Hours computed: durationMinutes / 60 (e.g. 1.5 hrs)
  4. Session Rewards computed: hours * ₹500/hr (e.g. ₹750)
  5. Student Attendance stored in session.studentAttendance
  6. Batch Student Roster Updated:
     - For each student in the batch, lastAttendance is updated to their recorded status
  7. Teacher Attendance Logged:
     - If checked in late or running late flagged, isLateArrival = true
     - Late Arrivals counter increments dynamically
  8. Dashboard Metrics Update:
     - Completed Sessions: +1
     - Rewards: +₹750
     - 1:1 Check-In & Check-Out verification status: "100% Paired"
```

---

## 5. User Interface Updates

1. **Dashboard (`HomeView.tsx`)**:
   - Hero metric cards updated to the 7 required metrics:
     1. **Today's Classes**: `0`
     2. **Students**: `0`
     3. **Pending Requests**: `0`
     4. **Completed Sessions**: `0`
     5. **Late Arrivals**: `0`
     6. **Referrals**: `0`
     7. **Rewards**: `₹0` (INR currency symbol throughout)
2. **Reschedule View (`RescheduleView.tsx`)**:
   - Added interactive **"Parent Action Required"** cards on pending sessions with **[Accept Proposed Slot]** and **[Decline]** buttons.
   - Added **[Simulate Parent Notification]** modal showing an interactive mobile preview of the parent SMS/WhatsApp notice with a 1-tap accept button.
   - Confirmed sessions show updated schedule times and dynamic Google Calendar links.
3. **Check-Out Modal (`CheckOutModal.tsx`)**:
   - Displays student roster prompt with full 4-state attendance controls.
   - Real-time payroll computation preview in ₹ INR.
   - Automatic propagation to `batches` upon submission.
4. **Navigation Bar (`Navbar.tsx`)**:
   - Added `[Demo Data | Clean 0-Baseline]` quick toggle.

---

## 6. Verification Plan

1. **Clean Baseline Check**:
   - App loads with 0 across all 7 metrics.
2. **Reschedule Engine Test**:
   - Create session ➔ Request reschedule (Pending Requests becomes 1) ➔ Accept as parent (Pending Requests returns to 0, session date/time updates, batch schedule updates, Google Calendar reflects new time).
3. **Check Out & Attendance Test**:
   - Check in ➔ Check out ➔ Mark attendance for 2 students (1 Present, 1 Absent) ➔ Submit ➔ Verify Completed Sessions = 1, Rewards increases by session pay (₹), batch students retain attendance status.
4. **Late Arrival Test**:
   - Report running late ➔ Late Arrivals counter increments to 1.
5. **Cross-Device & Multi-Tab Verification**:
   - Changes sync across tabs and Vercel Blob store.
