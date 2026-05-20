# JagoCurhat Development Rules & Guidelines

Welcome to the **JagoCurhat** codebase. This document serves as the absolute source of truth for the development guidelines, rules, coding standards, database conventions, and UI principles for building the platform.

---

## 1. Core Goal & Target Audience

### Core Goal
Build a mobile-first social platform called **JagoCurhat** ("Ruang aman untuk ceritamu").
The platform focuses on:
* **Emotional expression**
* **Anonymous sharing**
* **Safe interactions**
* **Cute minimal UI**
* **Low-pressure social experience**

The app must feel: **Safe, Soft, Modern, Minimal, and Empathetic.**

### Target Audience
* Teenagers & College students
* Introverts & Young adults
* People who enjoy anonymous sharing
* Users who like cute, dark-themed apps

---

## 2. Tech Stack

### Recommended Stack (Approved)
* **Framework**: Next.js App Router
* **Language**: TypeScript (strict mode, no `any`)
* **Styling**: Tailwind CSS (using modern design system)
* **Component Library**: shadcn/ui
* **Animation**: Framer Motion
* **Database**: Neon PostgreSQL
* **ORM**: Drizzle ORM
* **Authentication**: better-auth or Auth.js
* **Mobile Wrapper**: Capacitor JS (for Android/iOS export)

### Forbidden Tech (Do NOT Use)
* Express.js
* Laravel
* MongoDB
* Firebase
* Supabase
* Redux (unless absolutely necessary and approved)

---

## 3. Folder Structure

The project MUST follow the clean directory structure below:

```text
src/
├── app/          # Next.js Pages & Route Handlers
├── components/   # Global reusable UI components
├── features/     # Feature-based folders (e.g., feed, auth, profile)
├── lib/          # Utilities and third-party configs (e.g., better-auth, drizzle)
├── hooks/        # Reusable React hooks
├── db/           # Database schemas, connections, and migrations
├── actions/      # Next.js Server Actions
├── types/        # TypeScript type definitions
├── constants/    # Theme and application constants
└── styles/       # Global CSS & Tailwind styles
```

---

## 4. Coding Standards

### General Rules
* Use TypeScript strictly. Avoid the `any` type at all costs.
* Create small, focused, and reusable components.
* Maintain a clean separation between Server Components (default) and Client Components (using `"use client"`).
* Use async/await consistently.
* Keep folder structures clean and modular.

### UI & UX Rules
* **Mobile-first only**: No desktop-first layout. The app is built primarily for mobile screens.
* **PWA-friendly**: Responsive and layout designed to feel native on mobile devices.
* **Dark theme by default**: Beautiful contrast with colorful accents.
* **High rounded corners**: Use `rounded-2xl` (1rem) or `rounded-3xl` (1.5rem). Avoid sharp corners.
* **Smooth animations**: Subtle, lightweight micro-animations.
* **Avoid clutter**: Prioritize readability and calm spacing.
* **Language**: Indonesian UI text only.

---

## 5. Component Rules

Create and reuse these core components across the app:
1. `PostCard`: Displays individual confessions, mood badges, user info, and interaction counts.
2. `MoodBadge`: Displays mood emoji/icon, label, and soft colored background.
3. `BottomNavigation`: Mobile-first persistent bottom navigation bar.
4. `ThemeSelector`: Allows user to customize accent color, card styling, and mascot variations.
5. `AvatarCartoon`: Cute cartoon avatars.
6. `EmpathyGhost`: Mascot illustrations (purple ghost) used for empty states, loading states, and onboarding.
7. `CreatePostForm`: Layout with text area, mood selector, and anonymous toggle.
8. `CommentItem`: Clean comment list item designed for supportive interactions.
9. `EmptyState`: Friendly, cute empty states showing the Mascot and soft encouragement text.
10. `LoadingState`: Lightweight loading UI with subtle mascot animations.

---

## 6. Theme & Color Guidelines

### Mascot: "The Empathy Ghost"
* **Description**: A purple, round, friendly ghost with a soft expression.
* **Role**: Represents listening without judging. Appears in empty states, onboarding, and loaders.

### Base Colors
* **Background**: `#000000` (Pure Black)
* **Surface**: `#111111` (Deep Gray)
* **Border**: `#262626` (Muted Gray)
* **Primary**: `#A855F7` (Purple Accent)
* **Text Primary**: `#F5F5F5` (Off-white)
* **Text Secondary**: `#A3A3A3` (Muted Gray)

### Accent Themes
Users can customize:
* **Accent Colors**: Purple, Pink, Blue, Green, Orange
* **Card styles** (Doodle/Border styles)
* **Mascot style**

*Note: Theme changes must feel instant (live preview) and must not break readability.*

---

## 7. Data & Security Rules

* Use Drizzle ORM & PostgreSQL (Neon).
* **Never hardcode secrets** or API keys. Always use `.env.local` or environment variables.
* Do not store passwords manually; let the authentication library handle encryption.
* **Route Protection**: Ensure pages requiring auth check the user session on the server.
* **Privacy**: Users can only edit or delete their own posts. Anonymous posts must strictly hide the creator's username, email, and avatar, replacing them with a ghost avatar and "Anonim".
* Sanitize all user-generated content before rendering to prevent XSS.
* Add rate-limiting for posts and comments to prevent spam.

---

## 8. Feature Rules

### Anonymous Posts
* Hide username and profile picture.
* Display custom ghost avatar and the name "Teman Curhat" or "Anonim".

### Mood System
* Choosing a mood is **required** before posting.
* The mood badge is rendered in the post feed and slightly adapts the post's accent styling.
* Required Moods:
  * **Sedih**
  * **Senang**
  * **Capek**
  * **Overthinking**
  * **Butuh Teman**
  * **Bangga**
  * **Kecewa**
  * **Takut**
  * **Lega**

### Feed Rules
* Display posts chronologically.
* Keep distractions to a minimum.
* Support supportive interactions (Likes, Comments, Bookmarks). No toxic reaction systems.

---

## 9. Performance Rules

* Optimize layouts and assets for mobile network speeds.
* Lazy load heavy interactive components or mascot animations.
* Minimize page rerenders by separating stateful UI elements.
* Keep Framer Motion animations simple and lightweight (use CSS transforms).

---

## 10. Project Roadmap

### Phase 1 - UI Foundation
* Setup Next.js, Tailwind CSS, and shadcn/ui.
* Create core layout wrapper & mobile frame.
* Code reusable components (`PostCard`, `BottomNavigation`, etc.) with dummy data.
* Construct all MVP screens (Home Feed, Explore, Create Post, Notifications, Profile).

### Phase 2 - Theme System
* Build the accent color customization and card styling options.
* Integrate live previews and theme state management.

### Phase 3 - PWA Setup
* Configure manifest files and service worker.
* Create app icon sets.
* Implement custom "Add to Home Screen" install prompt.

### Phase 4 - Database Setup
* Provision Neon PostgreSQL database.
* Define schemas using Drizzle ORM.
* Generate and run migrations.

### Phase 5 - Authentication
* Implement registration and login flows.
* Set up credential authentication and OAuth providers (Google, Apple).

### Phase 6 - Core Curhat Features
* Connect database schemas to Create Post form, Feed page, Comments, Likes, and Bookmarks.
* Add anonymous mapping.

### Phase 7 - Notifications
* Implement database-driven user activity logs.
* Setup notifications grouping (likes, comments, follows).

### Phase 8 - Capacitor Mobile Export
* Initialize Capacitor.
* Configure native Android and iOS wrapper builds.
* Perform mobile runtime optimization.

### Phase 9 - Production Optimization & Hardening
* Improve accessibility (semantic HTML & contrast checks).
* Perform security auditing & input sanitation.
* Deploy production application.
