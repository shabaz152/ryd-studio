# RYD STUDIO — Technology Stack & Dependencies Documentation
> **Version 2.0 • Production Specifications**  
> **Platform URL:** [https://ryd-studio.vercel.app](https://ryd-studio.vercel.app)

---

## 📋 Table of Contents
1. [Executive Stack Summary](#1-executive-stack-summary)
2. [Frontend Core & Runtimes](#2-frontend-core--runtimes)
3. [Styling & Design System Architecture](#3-styling--design-system-architecture)
4. [Hardware & Browser Web APIs](#4-hardware--browser-web-apis)
5. [Cloud, Edge & Serverless Backend](#5-cloud-edge--serverless-backend)
6. [Development, Build & Bundling Toolchain](#6-development-build--bundling-toolchain)
7. [Dependency Manifest (`package.json`)](#7-dependency-manifest-packagejson)

---

## 1. Executive Stack Summary

| Layer | Technology | Version | Key Responsibility |
|---|---|---|---|
| **Core Framework** | React | `^19.0.0` | Reactive UI component tree and rendering |
| **Language** | TypeScript | `~5.8.2` | Compile-time type verification and contract safety |
| **Bundler / Tooling** | Vite | `^6.2.0` | Development server with instant HMR & production rollup |
| **Styling** | Tailwind CSS | `^3.4.17` | Utility styling and responsive breakpoint control |
| **Icons** | Lucide React | `^1.16.0` | High-clarity editorial SVG icon glyphs |
| **Serverless Backend**| Vercel Functions | Node.js 20 | Edge compute handler for global synchronization |
| **Cloud Storage** | Vercel Blob | `^0.27.3` | Globally distributed state blob store |
| **Inter-Tab Sync** | BroadcastChannel | HTML5 Native | Sub-10ms same-device multi-tab synchronization |
| **Audio Engine** | Web Audio API | Native | Synthesized zero-network latency sound effects |
| **Voice Engine** | Web Speech API | Native | Real-time speech-to-text transcription |

---

## 2. Frontend Core & Runtimes

### React 19.0
- **Hooks Utilized:** `useState`, `useEffect`, `useCallback`, `useMemo`, `useRef`, `createContext`, `useContext`.
- **Performance Characteristics:** Zero unnecessary re-renders via memoized callbacks and derived invariant computations.

### TypeScript 5.8
- **Strict Mode:** Enabled (`strict: true`, `noImplicitAny: true`, `strictNullChecks: true`).
- **Target:** `ES2022` with modern ESM module resolution.
- **Benefits:** Full compile-time verification across session models, attendance records, and cloud payload structures.

---

## 3. Styling & Design System Architecture

### Tailwind CSS 3.4
- **Custom Color Palettes:**
  - `crm-light`: Subtle slate canvas (`#F8FAFC`), crisp white surfaces (`#FFFFFF`), deep slate text (`#0F172A`).
  - `obsidian-dark`: Midnight obsidian (`#0C0C12`), dark cards (`#101017`), studio gold sheen (`#FFD000`).
- **Typography Scale:**
  - Headings: Inter / System Sans bold (`font-black`, `tracking-tight`).
  - Codes / Timestamps: Geist Mono / Courier monospace (`font-mono`).
- **Micro-Shadows & Sheens:**
  - `shadow-gold-glow`, `top-sheen`, `glossy-card`, `glossy-pill-dark`.

---

## 4. Hardware & Browser Web APIs

### Web Audio API Synthesizer (`src/utils/sound.ts`)
- **Zero-Asset Architecture:** Eliminates MP3 downloads, eliminating audio loading delays.
- **Oscillator Nodes:** Generates pure sine and triangle waveforms with exponential gain envelopes.

### Web Speech API Dictation (`src/utils/speech.ts`)
- **Hands-Free Transit Alerts:** Transcribes spoken delay reasons directly into text input fields.

### HTML5 `BroadcastChannel` API
- **Bus Identifier:** `'ryd_studio_cloud_sync_bus'`
- **Latency:** `<10ms` inter-tab message propagation on the same computer or mobile device.

---

## 5. Cloud, Edge & Serverless Backend

### Vercel Serverless Functions (`api/sync.js`)
- **Runtime:** Node.js 20 on AWS / Vercel Edge infrastructure (iad1).
- **Execution Time:** ~15–30ms per request.

### Vercel Blob Store (`@vercel/blob`)
- **Storage Item:** `ryd_studio_state.json`
- **Access Model:** Public read via global edge CDN; write authenticated via `BLOB_READ_WRITE_TOKEN`.

---

## 6. Development, Build & Bundling Toolchain

- **Vite 6:** Instant sub-50ms cold starts in local development.
- **PostCSS 8 & Autoprefixer 10:** Automatic CSS vendor prefixing.
- **Output Bundle:**
  - `dist/index.html`: `~1.38 kB`
  - `dist/assets/index-*.css`: `~63.9 kB` (`~11.1 kB` gzipped)
  - `dist/assets/index-*.js`: `~426 kB` (`~103 kB` gzipped)

---

## 7. Dependency Manifest (`package.json`)

```json
{
  "name": "ryd-studio",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "@vercel/blob": "^0.27.3",
    "lucide-react": "^1.16.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0"
  },
  "devDependencies": {
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "@vitejs/plugin-react": "^4.3.4",
    "autoprefixer": "^10.4.20",
    "postcss": "^8.5.1",
    "tailwindcss": "^3.4.17",
    "typescript": "~5.8.2",
    "vite": "^6.2.0"
  }
}
```

---
*End of Tech Stack Documentation • RYD STUDIO Specifications*
