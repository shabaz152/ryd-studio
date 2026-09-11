# RYD STUDIO — API & Cloud Sync Engine Documentation
> **Version 2.0 • Edge Cloud Synchronizer**  
> **Production Endpoint:** `https://ryd-studio.vercel.app/api/sync`  
> **Global Edge CDN Blob:** `https://4gbu7gvanz0l7r8s.public.blob.vercel-storage.com/ryd_studio_state.json`

---

## 📋 Table of Contents
1. [Architecture Overview](#1-architecture-overview)
2. [Base URLs & Environment Targets](#2-base-urls--environment-targets)
3. [CORS & Security Configuration](#3-cors--security-configuration)
4. [API Endpoints Reference](#4-api-endpoints-reference)
   - [GET /api/sync — Fetch Global Studio State](#get-apisync--fetch-global-studio-state)
   - [POST /api/sync — Publish Global Studio State](#post-apisync--publish-global-studio-state)
   - [OPTIONS /api/sync — Preflight Verification](#options-apisync--preflight-verification)
5. [Data Models & TypeScript Interfaces](#5-data-models--typescript-interfaces)
6. [Data Integrity & 1:1 Lifecycle Invariant Rules](#6-data-integrity--11-lifecycle-invariant-rules)
7. [Error Handling & HTTP Status Matrix](#7-error-handling--http-status-matrix)
8. [Client Integration Examples](#8-client-integration-examples)

---

## 1. Architecture Overview

RYD STUDIO uses a **hybrid dual-tier synchronization architecture** designed for high availability, sub-second latency across geographical regions, and zero-downtime offline resilience.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           CROSS-DEVICE CLOUD SYNC                           │
├───────────────────────────────┬─────────────────────────────────────────────┤
│         Browser Layer         │                 Cloud Layer                 │
│                               │                                             │
│    Device A (iPhone)          │          Vercel Serverless Function         │
│  ┌───────────────────────┐    │          ┌───────────────────────┐          │
│  │ Local State (React)   │────┼─────────▶│    POST /api/sync     │          │
│  └───────────────────────┘    │          └───────────┬───────────┘          │
│                               │                      │ put()                │
│    Device B (MacBook)         │                      ▼                      │
│  ┌───────────────────────┐    │          ┌───────────────────────┐          │
│  │ Local State (React)   │◀───┼──────────│ Vercel Blob Storage   │          │
│  └───────────────────────┘    │  GET/CDN │ (ryd_studio_state.json│          │
│                               │          └───────────────────────┘          │
│    Same-Device Tabs           │                                             │
│  ┌───────────────────────┐    │                                             │
│  │ BroadcastChannel Bus  │◀───┼── Sub-10ms inter-tab communication          │
│  └───────────────────────┘    │                                             │
└───────────────────────────────┴─────────────────────────────────────────────┘
```

### Key Technical Characteristics:
- **Zero Polling Overhead:** Client devices utilize smart push-on-change and refresh-on-focus hooks.
- **Direct Edge CDN Fallback:** If the serverless compute endpoint experiences high load or cold start, the client can fall back directly to the immutable public Blob CDN (`ryd_studio_state.json`).
- **Loopback Suppression:** The client uses an `isApplyingRemoteUpdateRef` guard to prevent endless feedback loops when receiving external broadcasts.

---

## 2. Base URLs & Environment Targets

| Environment | Base URL | Storage Target |
|---|---|---|
| **Production** | `https://ryd-studio.vercel.app` | Vercel Blob Global CDN |
| **Development** | `http://localhost:3000` | Local Edge Proxy / Memory Fallback |
| **Edge CDN Direct** | `https://4gbu7gvanz0l7r8s.public.blob.vercel-storage.com` | Immutable JSON Blob |

---

## 3. CORS & Security Configuration

All `/api/sync` endpoints automatically send the following permissive CORS headers to allow seamless cross-origin web embeds and mobile WebView operations:

```http
Access-Control-Allow-Credentials: true
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET,OPTIONS,PATCH,DELETE,POST,PUT
Access-Control-Allow-Headers: X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version
```

---

## 4. API Endpoints Reference

### `GET /api/sync` — Fetch Global Studio State
Retrieves the complete, current snapshot of the academy database.

#### Query Parameters:
| Parameter | Type | Required | Description |
|---|---|---|---|
| `t` | `number` | Optional | Cache-busting timestamp (e.g. `?t=1789060500000`). |

#### Response Headers:
```http
Content-Type: application/json
Cache-Control: no-store
```

#### Success Response (`200 OK`):
```json
{
  "exists": true,
  "timestamp": 1789060500286,
  "url": "https://4gbu7gvanz0l7r8s.public.blob.vercel-storage.com/ryd_studio_state.json",
  "data": {
    "teacher": {
      "name": "Sarah Jenkins",
      "role": "Head of Contemporary & Urban Styles",
      "avatarUrl": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80",
      "hourlyRate": 50,
      "totalHoursMonth": 0,
      "totalEarningsMonth": 0,
      "rating": 5.0,
      "classesCompletedThisWeek": 0
    },
    "batches": [ ... ],
    "sessions": [ ... ],
    "leads": [ ... ],
    "updates": [ ... ],
    "workbookOrders": [ ... ],
    "freeSlots": [ ... ],
    "reviews": [ ... ],
    "referralStats": { ... },
    "_syncTimestamp": 1789060500286
  }
}
```

---

### `POST /api/sync` — Publish Global Studio State
Atomically updates the studio database snapshot in cloud storage and broadcasts to all connected clients.

#### Request Headers:
```http
Content-Type: application/json
```

#### Request Payload:
```json
{
  "teacher": { ... },
  "batches": [ ... ],
  "sessions": [ ... ],
  "leads": [ ... ],
  "updates": [ ... ],
  "workbookOrders": [ ... ],
  "freeSlots": [ ... ],
  "reviews": [ ... ],
  "referralStats": { ... }
}
```

#### Success Response (`200 OK`):
```json
{
  "success": true,
  "timestamp": 1789060500286,
  "url": "https://4gbu7gvanz0l7r8s.public.blob.vercel-storage.com/ryd_studio_state.json"
}
```

---

### `OPTIONS /api/sync` — Preflight Verification
Responds to preflight browser security checks.

#### Success Response (`200 OK`):
Empty response body with `Access-Control-Allow-*` headers.

---

## 5. Data Models & TypeScript Interfaces

### Session Model (`src/types/index.ts`)
```typescript
export interface Session {
  id: string;                      // Unique ID (e.g. 'sess-1789060048407')
  batchId: string;                 // Associated cohort batch ID
  batchName: string;               // Display name of batch
  date: string;                    // YYYY-MM-DD
  timeSlot: string;                // e.g. '16:00 - 17:30'
  studioRoom: string;              // e.g. 'Studio Alpha - Hall 1'
  locationName: string;            // e.g. 'RYD Downtown Central'
  monthIndex: number;              // Month 1-12
  classIndex: number;              // Class sequence index
  status: 'scheduled' | 'checked_in' | 'completed' | 'cancelled';
  durationMinutes: number;         // Duration in minutes (e.g. 90)
  checkInTime?: string;            // Recorded time of arrival (HH:mm)
  checkOutTime?: string;           // Recorded time of departure (HH:mm)
  studentAttendance?: AttendanceRecord[];
  teacherHoursLogged?: number;     // Logged teaching credit (e.g. 1.5)
  teacherEarnings?: number;        // Logged earnings in USD
  calendarCode?: string;           // Structured code (e.g. '2:1pr')
  rescheduleReason?: string;
  parentNotified?: boolean;
}
```

### Teacher Profile Model
```typescript
export interface TeacherProfile {
  name: string;
  role: string;
  avatarUrl: string;
  hourlyRate: number;              // USD per hour (e.g. 50)
  totalHoursMonth: number;         // Dynamically reconciled from completed sessions
  totalEarningsMonth: number;      // Dynamically reconciled from completed sessions
  rating: number;                  // 0.0 to 5.0
  classesCompletedThisWeek: number;// Exact count of completed sessions
}
```

### Cohort Batch Model
```typescript
export interface Batch {
  id: string;
  name: string;
  code: string;
  style: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Masterclass';
  scheduleTime: string;
  days: string[];
  studioRoom: string;
  locationName: string;
  address: string;
  mapCoordinates: { lat: number; lng: number };
  navigationUrl: string;
  students: Student[];
}
```

### Student Model
```typescript
export interface Student {
  id: string;
  name: string;
  age: number;
  parentName: string;
  parentPhone: string;
  parentEmail?: string;
  avatarUrl: string;
  enrolledDate: string;
  notes?: string;
  lastAttendance?: 'present' | 'absent' | 'late' | 'excused';
}
```

---

## 6. Data Integrity & 1:1 Lifecycle Invariant Rules

To ensure reliable data integrity, the API client and backend enforce these mathematical rules:

1. **At Most One Active Session:**
   $$\sum_{s \in \text{Sessions}} [s.\text{status} = \text{'checked\_in'}] \le 1$$
2. **Reconciled Teacher Metrics:**
   $$\text{classesCompletedThisWeek} = \sum_{s \in \text{Sessions}} [s.\text{status} = \text{'completed'}]$$
   $$\text{totalHoursMonth} = \sum_{s \in \text{Sessions, completed}} \frac{s.\text{durationMinutes}}{60}$$
   $$\text{totalEarningsMonth} = \text{totalHoursMonth} \times \text{teacher.hourlyRate}$$
3. **No Checkout Timestamps on In-Progress Sessions:**
   $$s.\text{status} = \text{'checked\_in'} \implies s.\text{checkOutTime} = \text{undefined}$$

---

## 7. Error Handling & HTTP Status Matrix

| Status Code | Reason | Resolution |
|---|---|---|
| **`200 OK`** | State fetched or updated successfully | Process payload in client state. |
| **`400 Bad Request`** | Malformed JSON in request body | Validate payload matches `CloudSyncPayload`. |
| **`405 Method Not Allowed`** | Method other than GET, POST, or OPTIONS | Use GET to read or POST to write. |
| **`500 Internal Error`** | Vercel Blob access failure or network fault | Client will fall back to offline `localStorage`. |

---

## 8. Client Integration Examples

### Fetching State via `curl`:
```bash
curl -X GET "https://ryd-studio.vercel.app/api/sync?t=$(date +%s)" \
  -H "Accept: application/json"
```

### Publishing State via `fetch` (JavaScript):
```typescript
const response = await fetch('https://ryd-studio.vercel.app/api/sync', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    teacher: currentTeacher,
    batches: currentBatches,
    sessions: currentSessions,
    leads: currentLeads,
    updates: currentUpdates,
    workbookOrders: currentWorkbooks,
    freeSlots: currentFreeSlots,
    reviews: currentReviews,
    referralStats: currentReferrals,
  }),
});
const result = await response.json();
console.log('Sync result:', result.success, 'Timestamp:', result.timestamp);
```

---
*End of API Documentation • RYD STUDIO Cloud Engine*
