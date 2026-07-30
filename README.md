# Career OS — AI Career Operating System (MVP)

A working MVP of the "AI Career Operating System" concept for engineering
students: goal setup, personalized daily missions, an XP/streak/level
system, and company readiness scoring. Everything runs client-side with
`localStorage` persistence — there's no backend yet, so it's ready to run
immediately with `npm run dev`.

## What's implemented

- **Onboarding (`/`)** — pick a dream company, career track, graduation
  year, and current semester. Saved to a Zustand store persisted in
  `localStorage`.
- **Daily missions (`/missions`)** — one mission per skill
  (DSA, Development, CS Subjects, Aptitude, English, Mock Interview),
  deterministically generated per day so refreshing doesn't reshuffle
  today's tasks. Completing a mission adds XP and nudges that skill's
  completion percentage.
- **Dashboard (`/dashboard`)** — XP bar + level (Explorer → Legend),
  daily streak, per-skill progress bars, and a readiness ring for the
  chosen company, computed from a per-company weighting of the six
  skills (see `lib/data.ts` → `COMPANIES[].weights`).
- **Theme** — dark/light toggle, glassmorphism cards, animated gradient
  background, floating-particle canvas.

## What's intentionally stubbed (per the original vision doc)

These are called out in the code as `// TODO` or simply not built —
they need real integrations (OpenAI/LangChain, GitHub/LeetCode APIs,
a real backend + DB) that go beyond a front-end MVP:

- AI mentor chat / 30-60-90 day plan generation
- Resume ATS review, voice/coding interview practice
- GitHub / LeetCode / LinkedIn sync
- Leaderboards (needs a shared backend, not just local state)
- Real accounts/auth — right now "login" is just the onboarding form

## Getting started

```bash
npm install
npm run dev
```

Then open http://localhost:3000. On first visit you'll land on the
onboarding screen; after saving your goal you're redirected to the
dashboard.

To build for production:

```bash
npm run build
npm start
```

> **Note on fonts:** the type system originally called for Space
> Grotesk / Manrope / JetBrains Mono via `next/font/google`, but that
> requires network access to Google Fonts at build time. This project
> ships with system-font fallback stacks (see `--font-display`,
> `--font-body`, `--font-mono` in `app/globals.css`) so it builds and
> runs fully offline. If you have network access and want the original
> webfonts, swap the CSS variables back to `next/font/google` imports
> in `app/layout.tsx`.

## Project structure

```
app/
  page.tsx            Onboarding / goal selection
  dashboard/page.tsx   Main dashboard (XP, streak, skills, readiness)
  missions/page.tsx    Today's daily missions
  layout.tsx           Root layout, global providers
  globals.css          Design tokens, glass/gradient utilities

components/
  GlassCard.tsx        Reusable glassmorphic card
  MissionCard.tsx      Single mission with complete/undo
  Navbar.tsx           Top nav + theme toggle
  ParticlesBackground.tsx  Ambient floating particles (canvas)
  ReadinessRing.tsx    SVG radial progress for company readiness
  SkillBar.tsx         Per-skill progress bar
  StreakBadge.tsx      Daily streak indicator
  ThemeToggle.tsx      Dark/light switch
  XPBar.tsx            XP + level progress bar

lib/
  data.ts              Companies, skill weights, mission pools, levels
  logic.ts             Pure functions: mission generation, XP → level,
                       readiness scoring, streak/date helpers
  store.ts             Zustand store (persisted to localStorage)
```

## Tech stack

Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS, Zustand
for state, Framer Motion for transitions. No backend in this MVP —
see the original vision doc for the intended FastAPI/PostgreSQL/Redis
+ OpenAI/LangChain backend for a production build.

## Extending toward the full vision

Natural next steps, in rough priority order:

1. Add a real backend (FastAPI + PostgreSQL) and move state off
   `localStorage` so streaks/XP survive across devices.
2. Wire an LLM (OpenAI via LangChain) behind an `/api/mentor` route to
   generate the "why is my score low" explanations and 30/60/90-day
   plans instead of the current static mission pools.
3. GitHub/LeetCode sync to feed real signal into the readiness score
   instead of only self-reported mission completion.
4. Auth (NextAuth) + a shared Postgres table for real leaderboards.
