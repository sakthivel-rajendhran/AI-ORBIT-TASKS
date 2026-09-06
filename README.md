# AI Orbit — Tasks & Challenges Platform

A modern, high-performance AI challenges, benchmarks, and global leaderboard web platform built with Next.js 16, React 19, Tailwind CSS, and SQLite.

![AI Orbit Banner](public/globe.svg)

---

## 🚀 Features

- **AI Tasks Catalog (`/tasks`)**:
  - Filter by Domain Category (`Generative AI`, `Machine Learning`, `Computer Vision`, `AI Agents`, `NLP`, `Robotics`, etc.).
  - Filter by Difficulty (`Beginner`, `Intermediate`, `Advanced`, `Expert`) and Status (`Available`, `In Progress`, `Completed`).
  - Real-time debounced search across titles, descriptions, and technology stacks.
  - Multi-attribute sorting (Popularity, Title, Difficulty, Time).
  - Server-backed pagination with responsive Grid and List views.
- **Task Detail & Workspace (`/tasks/[slug]` & `/tasks/[slug]/workspace`)**:
  - In-depth specifications: Overview, Technical Requirements, Constraints, Expected Outcomes, and Evaluation Rubrics.
  - Interactive **Task Workspace** with live status updates, assignment progress, and solution submission.
- **Global Leaderboard (`/leaderboard`)**:
  - Top 3 visual Podium highlighting the champion with ambient effects.
  - Period filters: *All-Time*, *This Month*, *This Week*.
  - Domain filtering and sorting by Score, Challenges Completed, and Success Rate.
  - Current user standing banner and responsive table/card layouts.
- **Theme & Motion System**:
  - Default atmospheric Dark Theme (`#050505`) with ambient floating glow.
  - Crisp Light Theme with smooth 280ms transitions.
  - GPU-accelerated card hover elevation, micro-interactions, and accessibility support (`prefers-reduced-motion`).
- **Responsive Design**:
  - Fully verified across all 12 responsive breakpoints (`320px` to `1920px`) with zero horizontal overflow.
  - Clean text-only navigation on desktop with dedicated mobile icon integration.

---

## 🛠️ Technology Stack

- **Framework**: [Next.js 16 (Turbopack)](https://nextjs.org/)
- **UI & Components**: [React 19](https://react.dev/), [Lucide React](https://lucide.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Database**: [SQLite (better-sqlite3)](https://github.com/WiseLibs/better-sqlite3) with WAL journal mode
- **Language**: TypeScript

---

## 🏁 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Seed Database
Initialize SQLite database with 26 challenges and global leaderboard seed data:
```bash
npm run seed
```

### 3. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) (or navigate directly to [http://localhost:3000/tasks](http://localhost:3000/tasks)).

### 4. Build for Production
```bash
npm run build
npm run start
```

---

## 📁 Project Structure

```
├── data/
│   └── tasks.db             # Local SQLite database
├── public/                  # Static assets
├── scripts/
│   └── seed.js              # Database seed script (26 challenges)
├── src/
│   ├── app/
│   │   ├── api/             # REST API routes (/api/tasks, /api/leaderboard)
│   │   ├── leaderboard/     # Leaderboard page & components
│   │   ├── tasks/           # Tasks catalog, detail & workspace routes
│   │   ├── globals.css      # Design system tokens & animations
│   │   └── layout.tsx       # App shell & theme provider
│   ├── components/
│   │   ├── leaderboard/     # Podium, controls, table & user standings
│   │   ├── tasks/           # Cards, filters, search, sort, pagination, modals
│   │   └── Navbar.tsx       # Responsive navigation bar
│   └── lib/
│       ├── db.ts            # SQLite client & schema definitions
│       ├── tasks-service.ts # Tasks business logic & queries
│       └── leaderboard-service.ts # Leaderboard ranking logic
└── README.md
```

---

## 📜 License

Private project repository. All rights reserved.
