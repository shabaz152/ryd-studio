# RYD STUDIO — Deployment & Git Checkout Operations Guide
> **Version 2.0 • DevOps & Production Guide**  
> **GitHub Repository:** [https://github.com/shabaz152/ryd-studio](https://github.com/shabaz152/ryd-studio)  
> **Live Production URL:** [https://ryd-studio.vercel.app](https://ryd-studio.vercel.app)

---

## 📋 Table of Contents
1. [Repository Information](#1-repository-information)
2. [Cloning & Git Checkout Workflows](#2-cloning--git-checkout-workflows)
3. [Local Development Environment Setup](#3-local-development-environment-setup)
4. [Environment Variables Configuration](#4-environment-variables-configuration)
5. [Local Build & Quality Verification](#5-local-build--quality-verification)
6. [Deploying to Vercel (CLI & Git Integration)](#6-deploying-to-vercel-cli--git-integration)
7. [Rollback & Branch Recovery Procedures](#7-rollback--branch-recovery-procedures)

---

## 1. Repository Information

- **Remote URL:** `https://github.com/shabaz152/ryd-studio.git`
- **Default Branch:** `main`
- **Hosting Platform:** Vercel Global Edge Network
- **Build Command:** `npm run build` (`tsc && vite build`)
- **Output Directory:** `dist`

---

## 2. Cloning & Git Checkout Workflows

### Clone the Repository:
```bash
# Clone via HTTPS
git clone https://github.com/shabaz152/ryd-studio.git

# Navigate into project directory
cd ryd-studio
```

### Checkout and Verify Branch:
```bash
# Verify current branch is main
git branch

# Pull latest commits
git pull origin main

# View recent commit history
git log -n 5 --oneline
```

---

## 3. Local Development Environment Setup

### Prerequisites:
- **Node.js:** v18.0.0 or v20.0.0+ (LTS recommended)
- **npm:** v9.0.0+

### Step-by-Step Setup:
```bash
# 1. Install dependencies
npm install

# 2. Launch local Vite development server
npm run dev
```

The application will start immediately at **`http://localhost:3000`** (or configured port). Hot Module Replacement (HMR) is active.

---

## 4. Environment Variables Configuration

Create a `.env.local` file in the root directory for cloud synchronization access:

```env
# Vercel Blob Storage Token (Required for cloud sync write operations)
BLOB_READ_WRITE_TOKEN="vercel_blob_rw_xxxxxxxxxxxxxxxxxxxx"
```

> **Note:** If `BLOB_READ_WRITE_TOKEN` is not provided locally, the application automatically operates in local offline mode using browser `localStorage` and `BroadcastChannel`.

---

## 5. Local Build & Quality Verification

Always verify TypeScript compilation and bundle packaging before pushing changes:

```bash
# Run full production build (Type checking + Vite rollup)
npm run build
```

Expected output:
```text
> ryd-studio@1.0.0 build
> tsc && vite build

vite v6.4.3 building for production...
✓ 1891 modules transformed.
rendering chunks...
dist/index.html                   1.38 kB │ gzip:   0.77 kB
dist/assets/index-DeiTxd2Q.css   63.92 kB │ gzip:  11.15 kB
dist/assets/index-eC_lyBwF.js   426.28 kB │ gzip: 103.06 kB
✓ built in 1.4s
```

To preview the production bundle locally:
```bash
npm run preview
```

---

## 6. Deploying to Vercel (CLI & Git Integration)

### Method A: Git Push (Automated CI/CD — Recommended)
Every push to `origin/main` automatically triggers an optimized production deployment on Vercel:

```bash
git add .
git commit -m "Your descriptive commit message"
git push origin main
```

### Method B: Vercel CLI (Manual Direct Promotion)
```bash
# 1. Preview Deployment (Generates staging preview URL)
npx vercel

# 2. Production Deployment (Promotes directly to https://ryd-studio.vercel.app)
npx vercel --prod
```

---

## 7. Rollback & Branch Recovery Procedures

If a regression is identified in production:

### Instant Vercel Rollback:
1. Open the [Vercel Dashboard](https://vercel.com/alpha-gpt/ryd-studio).
2. Go to **Deployments**.
3. Locate the previous healthy deployment ID (e.g. `dpl_3JdpcoQ36nP75BJK98FVYYjLR3KS`).
4. Click the three dots menu `(...)` and choose **Promote to Production**. Rollback completes in under 2 seconds.

### Git Revert:
```bash
# Create a revert commit
git revert HEAD

# Push revert to main
git push origin main
```

---
*End of Deployment Guide • RYD STUDIO Operations*
