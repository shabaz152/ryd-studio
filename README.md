# RYD STUDIO — Executive Dance Academy & Faculty Operations Platform
> **Live Production URL:** [https://ryd-studio.vercel.app](https://ryd-studio.vercel.app)  
> **Repository:** [https://github.com/shabaz152/ryd-studio](https://github.com/shabaz152/ryd-studio)  
> **Status:** Production Ready • 100% Tests Passing

---

## 🌟 Platform Highlights
- **1:1 Check-In / Check-Out Rule:** Mathematical invariance ensures for every session arrival there is one and only one departure. Single active session lock prevents overlapping check-ins and duplicate billing.
- **Dynamic 0-Baseline Data:** Student rosters, studio walk-in CRM leads, and teacher candidate referral pipelines initialize strictly at 0 and dynamically increment as real records are logged.
- **Subtle CRM Light & Obsidian Dark Themes:** Subtle glare-free slate CRM theme for bright studio reception, with an executive Obsidian dark mode for evening rehearsals.
- **Cross-Device Cloud Sync:** Real-time state synchronization across iPhones, Android tablets, and desktop workstations via Vercel Edge Serverless and Blob CDN storage.
- **Interactive Mobile Device Frame:** Built-in iPhone 16 Pro Max viewport preview with Dynamic Island notch clearance.
- **Zero-Network Audio & Speech Engines:** Native Web Audio API sound synthesizer and Web Speech API hands-free voice dictation for transit delay announcements.

---

## 📚 Complete Documentation Suite

All detailed architectural, operational, and testing specifications are documented in the [`docs/`](./docs) directory:

| Document | Purpose | Key Content |
|---|---|---|
| **[User Manual](./docs/USER_MANUAL.md)** | **End-to-End Application Guide (Most Important)** | Step-by-step walkthroughs, 1:1 check-in/out workflows, roster management, CRM leads, broadcasts, referrals, FAQs |
| **[API Documentation](./docs/API_DOCUMENTATION.md)** | Serverless & Cloud Sync Reference | `/api/sync` endpoints (GET, POST, OPTIONS), request/response schemas, TypeScript models, CORS policies |
| **[Architecture Documentation](./docs/ARCHITECTURE.md)** | Full System Blueprint | Frontend (React 19), Backend (Vercel Functions/Blob), state machines, invariant proofs, viewport container |
| **[Tech Stack Documentation](./docs/TECH_STACK.md)** | Dependency & Tooling Specifications | React 19, TypeScript 5.8, Tailwind CSS 3.4, Vite 6, Web Audio API, Web Speech API, Vercel Edge CDN |
| **[Deployment & Git Guide](./docs/DEPLOYMENT_AND_GIT.md)** | DevOps & Hosting Runbook | Git cloning, branch workflows, local development setup, environment variables, Vercel CLI deployment |
| **[Testing Report](./docs/TESTING_REPORT.md)** | Quality Assurance & Verification | 39 test cases across all 8 modules (100% passing), regression audits, quality gates |
| **[Concurrency Test Report](./docs/CONCURRENCY_TEST_REPORT.md)** | Multi-Client & Stress Simulations | Double-click debounce verification, multi-tab BroadcastChannel latency (<8ms), multi-device race handling |

---

## 🚀 Quick Start

### 1. Clone & Install
```bash
git clone https://github.com/shabaz152/ryd-studio.git
cd ryd-studio
npm install
```

### 2. Run Locally
```bash
npm run dev
```
Open `http://localhost:3000` in your browser.

### 3. Build & Test
```bash
npm run build
```

### 4. Deploy to Vercel
```bash
npx vercel --prod
```

---
*RYD STUDIO • Executive Performing Arts Management*
