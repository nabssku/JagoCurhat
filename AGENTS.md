# JagoCurhat Agent Rules

## Core Behavior

You are working on JagoCurhat.

JagoCurhat is:
- mobile-first
- minimal
- cute
- empathetic
- dark-themed
- PWA-ready
- built for emotional sharing

You must preserve:
- the existing design direction
- the emotional tone
- the mobile-first architecture
- the simplicity of the app

Do not overengineer.

---

# General Coding Behavior

Before coding:
1. Read all `.antigravity/*.md` files
2. Understand the current phase
3. Explain what files will be modified
4. Explain why changes are needed

After coding:
1. Summarize changes
2. Explain how to test
3. Mention limitations if any

Never silently rewrite architecture.

---

# Scope Rules

Only implement:
- the requested feature
- the current phase

Do not:
- implement future roadmap features
- redesign unrelated UI
- add unnecessary abstraction
- create unused utilities
- add speculative architecture

Avoid:
- “future-proofing” too early
- enterprise architecture patterns
- microservices mindset
- unnecessary optimization

Focus on MVP.

---

# UI Rules

The app must:
- feel native on mobile
- feel emotionally soft
- remain minimal
- prioritize readability
- avoid clutter

Never:
- add fake phone frames
- add fake iPhone notch
- add fake device bezel
- add unnecessary glassmorphism
- add heavy gradients everywhere
- add overcomplicated animations

Desktop layout:
- centered mobile container only

Mobile layout:
- full width native feel

---

# Design Consistency Rules

Always follow:
- `ui-guidelines.md`
- Stitch design direction
- existing spacing system
- existing radius system
- existing color system

Never randomly:
- change typography
- change spacing scale
- change navigation style
- change accent logic

---

# Animation Rules

Use Framer Motion only when necessary.

Animations should feel:
- soft
- subtle
- lightweight
- calming

Avoid:
- excessive bouncing
- particle effects
- confetti
- distracting motion
- long transitions

Animation duration:
- usually 0.2s–0.4s

---

# State Management Rules

Prefer:
- local component state

Use Context only for:
- theme
- mock auth
- feed state

Do not:
- introduce Redux
- introduce Zustand
- introduce global stores unnecessarily

Avoid unnecessary rerenders.

---

# Component Rules

Create reusable components only when:
- reused 2+ times
- logically shared
- improves readability

Do not split components too aggressively.

Avoid:
- deeply nested component trees
- unnecessary wrapper components

---

# Styling Rules

Use:
- Tailwind CSS
- CSS variables for themes
- utility-first styling

Avoid:
- inline styles unless dynamic
- hardcoded colors
- duplicated spacing values

Use design tokens consistently.

---

# Data Rules

During MVP UI phase:
- use dummy data only
- use typed mock objects
- keep mock data centralized

Do not:
- connect real database
- add backend
- create API routes
- add authentication logic

Unless explicitly requested.

---

# Dependency Rules

Before installing a package:
1. Check if existing stack already solves the problem
2. Prefer lightweight packages
3. Avoid duplicate functionality

Never install:
- large UI frameworks
- unnecessary animation packages
- heavy chart libraries
- unused dependencies

Preferred packages:
- framer-motion
- lucide-react
- sonner
- clsx
- tailwind-merge

---

# File Modification Rules

Do not:
- rewrite unrelated files
- reformat entire project unnecessarily
- rename files without reason
- move folders without reason

Preserve:
- folder structure
- naming conventions
- existing architecture

---

# Naming Rules

Use:
- clear names
- readable names
- consistent names

Avoid:
- vague utility names
- abbreviations that reduce readability

Good:
- CreatePostForm
- ThemeSelector
- NotificationItem

Bad:
- Utils2
- MainThing
- DataManagerX

---

# Performance Rules

Optimize for:
- mobile performance
- smooth scrolling
- low layout shift

Avoid:
- unnecessary client rendering
- large animations
- expensive blur effects
- huge shadows
- excessive DOM nesting

---

# Accessibility Rules

Ensure:
- accessible tap targets
- semantic HTML
- keyboard support where possible
- readable contrast
- aria-labels for icon buttons

Minimum tap target:
- 44px

---

# Error Handling Rules

Do not:
- silently fail
- hide errors completely

Use:
- soft UI feedback
- readable error states
- lightweight toast notifications

Use Sonner for toast notifications.

---

# Important Philosophy

JagoCurhat is not:
- a productivity dashboard
- a crypto app
- a gamified social media
- a corporate SaaS platform

It should feel like:
- a safe emotional diary
- a cozy anonymous social space
- a modern cute community app

Prioritize emotional comfort over feature complexity.

Simple is better.