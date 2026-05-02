# Caio Vinicius — Frontend Portfolio

> Single-page portfolio and GSAP animation playground built with Next.js 14, TypeScript, and Tailwind CSS.

![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=nextdotjs)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?style=flat-square&logo=typescript)
![GSAP](https://img.shields.io/badge/GSAP-3-88CE02?style=flat-square&logo=greensock)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38bdf8?style=flat-square&logo=tailwindcss)

**Status: Work in Progress** 
---

## Why this exists

Two goals in one project: a live portfolio , and a hands-on study of GSAP. Each section is mapped to a specific GSAP concept — so as the portfolio grows, so does the animation complexity.

---

## What's built

| Feature | Details |
|---|---|
| Hero section | `TextPlugin` typing effect + staggered entrance via `gsap.timeline()` |
| Navbar | Scroll-aware background, entrance animation with `gsap.from()` |
| Dark mode | CSS custom properties themed via Tailwind |
| Data layer | All content centralized in `src/lib/data.ts`, zero hardcoded strings |
| Type safety | Full TypeScript with strict mode throughout |

---

## Stack

- **Next.js 14** — App Router, server components
- **TypeScript 5** — strict mode
- **Tailwind CSS 3** — utility-first, CSS variables for theming
- **GSAP 3** + **@gsap/react** — `useGSAP` hook (official React integration, replaces `useEffect` for animations)

---

## Running locally

```bash
npm install
npm run dev  
```

---

## Project structure

```
src/
  app/              → layout, page, global styles
  components/
    sections/       → one component per page section
    ui/             → shared UI (Navbar, ...)
    animations/     → reusable GSAP hooks (planned)
  lib/
    data.ts         → all CV / portfolio content
  types/
    index.ts        → shared TypeScript interfaces
```
