# AI Tasks Module — Project Documentation

**Module:** AI Discovery Platform — Tasks
**Routes:** `/tasks`, `/tasks/[slug]`
**Type:** Full-Stack Feature (Database → API → Frontend)
**Target Tool:** Antigravity (AI coding agent)
**Design Language:** AI Orbit–inspired (dark, minimal, premium)

---

## 1. Purpose & Scope

The Tasks module lets users discover, filter, and start AI-related tasks and
challenges. It is a self-contained feature that must plug into an **existing**
codebase without disturbing unrelated modules (`/companies`, `/robots`,
`/leaderboard`, `/business`, `/learn`, `/news`).

This document is the single source of truth for:

- What gets built (pages, components, endpoints, schema)
- How each piece behaves (states, interactions, edge cases)
- The visual and motion language
- The exact prompt to hand to Antigravity to execute the build

---

## 2. Design Direction

| Aspect | Rule |
|---|---|
| Background | Near-black (`#0A0A0A`–`#0D0D0F` range) |
| Primary text | White / near-white, high contrast |
| Secondary text | Muted gray (`#9CA3AF`-ish) |
| Borders | Subtle, low-contrast (1px, ~8–12% opacity) |
| Accent color | One restrained accent, used sparingly (CTAs, active states) |
| Cards | Dark surface, subtle border, no heavy shadows |
| Radius | Small–medium, consistent across all cards/buttons |
| Motion | Fast, subtle, purposeful — never decorative |

**Explicitly avoid:** pixel-cloning AI Orbit, excessive gradients, glassmorphism,
neon glows, oversized rounded corners, generic SaaS-dashboard look.

---

## 3. Information Architecture

```
/tasks
 ├─ Header (title + subtitle)
 ├─ Stats bar (Total / Categories / Featured / Active)
 ├─ Search bar
 ├─ Filter bar (Category, Difficulty, Status, Technology)
 ├─ Sort control
 ├─ View toggle (Grid / List)
 ├─ Results (Grid or List of Task Cards)
 ├─ Pagination
 ├─ Empty / Loading / Error states
 └─ URL reflects: search, category, difficulty, status, technology, sort, page, view

/tasks/[slug]
 ├─ Breadcrumb (Tasks / Category / Task Title)
 ├─ Task Header (title, meta, Start Task CTA)
 ├─ Overview
 ├─ Requirements (ordered list)
 ├─ Constraints
 ├─ Expected Outcome
 ├─ Evaluation Criteria (ordered list)
 ├─ Skills
 ├─ Technologies
 ├─ Metadata panel (difficulty, time, category, status, created, participants, popularity)
 ├─ Related Tasks (3–6 cards)
 └─ Not-found state for invalid slugs
```

---

## 4. Component Inventory

| Component | Responsibility |
|---|---|
| `TaskStats` | Fetches & renders `/api/tasks/stats` counters |
| `TaskSearch` | Debounced search input, updates URL param `search` |
| `TaskFilters` | Category / Difficulty / Status / Technology controls |
| `TaskSort` | Sort dropdown, updates `sort` param |
| `TaskViewToggle` | Grid/List switch, persisted in URL `view` |
| `TaskCard` | Single task summary (grid & list variants) |
| `TaskGrid` / `TaskList` | Layout wrappers around `TaskCard` |
| `TaskPagination` | Prev/Next + page numbers, compact on mobile |
| `TaskHeader` | Detail page hero: title, meta, Start Task button |
| `TaskOverview` | Narrative description block |
| `TaskRequirements` | Numbered requirement list |
| `TaskConstraints` | Bullet list of constraints |
| `TaskExpectedOutcome` | Short outcome paragraph |
| `TaskEvaluation` | Numbered evaluation criteria |
| `TaskMetadata` | Key/value panel |
| `TaskSkills` / `TaskTechnologies` | Tag lists |
| `RelatedTasks` | Related task cards (by category/tech/skill/difficulty) |
| `StartTaskButton` | Handles POST call, loading/success/error states |
| `LoadingSkeleton` | Card, stat, and detail skeletons |
| `EmptyState` | "No tasks found" + Clear Filters |
| `ErrorState` | Friendly failure message, retry action |

**Rule:** reuse existing project components, tokens, and utilities wherever they
already exist — do not create parallel design systems.

---

## 5. Database Schema

```
Task
 ├─ id
 ├─ title
 ├─ slug              (unique)
 ├─ shortDescription
 ├─ description
 ├─ category
 ├─ difficulty         (Beginner | Intermediate | Advanced | Expert)
 ├─ status             (Open | Active | Completed | Archived)
 ├─ estimatedTime
 ├─ featured           (boolean)
 ├─ participants        (int)
 ├─ popularity          (enum/int)
 ├─ createdAt / updatedAt

TaskTechnology   (id, taskId, name)
TaskSkill        (id, taskId, name)
TaskRequirement  (id, taskId, content, order)
TaskEvaluation   (id, taskId, criterion, order)
```

- Use relational tables only where the existing DB supports it well; don't
  over-normalize for a working-trial-scale dataset.
- Seed **≥ 25** realistic tasks across all 9 categories with original names
  and descriptions (no Lorem ipsum, no "Task 1/2/3").

---

## 6. API Contract

| Method | Route | Purpose |
|---|---|---|
| GET | `/api/tasks` | List with search/filter/sort/pagination |
| GET | `/api/tasks/[slug]` | Single task + related tasks |
| GET | `/api/tasks/categories` | Distinct categories |
| GET | `/api/tasks/stats` | Aggregate counts |
| POST | `/api/tasks/[slug]/start` | Start-task action |

**`GET /api/tasks` query params:** `page`, `limit`, `search`, `category`,
`difficulty`, `status`, `technology`, `featured`, `sort`
(`featured | newest | oldest | popular | shortest | longest | difficulty`).

**List response shape:**
```json
{
  "success": true,
  "data": [ /* tasks */ ],
  "pagination": { "page": 1, "limit": 12, "total": 25, "totalPages": 3 }
}
```

**Rules:**
- All filtering, search, and sorting happen server-side — never ship the full
  dataset to the client.
- Validate every query param (type, allowed values, safe max `limit`).
- `404` with a clean structured error for unknown slugs.
- Never leak stack traces, SQL errors, or raw exceptions to the client.

---

## 7. States to Design For

| State | Behavior |
|---|---|
| Loading (list) | Skeleton task cards + skeleton stats |
| Loading (detail) | Skeleton detail layout |
| Empty | "No tasks match your current filters." + Clear Filters button |
| Error | Friendly copy, no technical detail, retry if applicable |
| Not Found | "Task not found" + Back to Tasks |
| Start Task — loading | Disabled button, spinner, prevents double submit |
| Start Task — success | Confirmation feedback |
| Start Task — failure | Inline error, retry allowed |

---

## 8. URL & State Management

Search, filters, sort, page, and view must all be reflected in the URL, e.g.:

```
/tasks?search=agent&category=AI%20Agents&difficulty=Intermediate&sort=newest&page=2&view=grid
```

- Refresh, back, and forward must all preserve the correct state.
- Combined filters must compose correctly on the backend.

---

## 9. Responsive Breakpoints

| Tier | Widths | Notes |
|---|---|---|
| Mobile | 320 / 360 / 375 / 390 / 430 | No horizontal scroll; filters collapse into a sheet/drawer, not a squeezed row |
| Tablet | 768 / 834 / 1024 | Cards reflow cleanly; no odd whitespace |
| Desktop | 1280 / 1440 / 1920 | Max content width so layout doesn't over-stretch |

Never patch layout bugs with `overflow-x: hidden`, `transform: scale`, or fixed
desktop widths — fix the underlying layout.

---

## 10. Animation Guidelines (kept simple & subtle)

| Moment | Suggested motion |
|---|---|
| Page/section entrance | Fade + slight upward slide (150–250ms) |
| Card hover | Small translateY(-2px to -4px) + border emphasis, ~150ms ease |
| Button hover/press | Opacity or background shift, ~100–150ms |
| Filter change | Cross-fade of result list, ~150ms |
| Skeleton loading | Gentle shimmer/pulse |
| Detail sections | Staggered fade-in on scroll into view (optional, subtle) |
| Start Task click | Button → spinner → success check, no more than 3 visual steps |
| Pagination change | Quick fade/slide of the result grid |

Respect `prefers-reduced-motion`. No parallax, no bounce, no exaggerated
easing — everything should feel calm and fast.

---

## 11. Accessibility & Performance Checklist

- Semantic HTML, labeled inputs, visible focus states, keyboard-navigable
  filters/pagination/search.
- Alt text on any imagery; ARIA only where semantics fall short.
- Server-side pagination and filtering (no full-dataset client dumps).
- No unnecessary new dependencies — use what the existing stack already offers.

---

## 12. Functional Test Matrix

**Frontend:** list loads from API, search, each filter type, combined filters,
sort, pagination, grid/list toggle, detail loads, invalid slug → not-found,
Start Task (loading/success/error), related tasks render, clear filters, URL
state survives refresh/back/forward.

**API:** every endpoint above with valid and invalid params, correct status
codes (`200/400/404/500`), correct response shape, validation behavior.

**Cross-cutting:** console clean of errors/warnings, no hydration mismatches,
TypeScript/lint clean, production build passes.

---

## 13. Non-Goals / Guardrails

- Do not touch unrelated routes/modules except shared components that
  genuinely require a safe update.
- Do not replace the framework, database, or styling system.
- Do not build a full auth system if one doesn't already exist — use a
  lightweight demo mechanism for "Start Task" instead.
- Do not fake data flow with `setTimeout` mocks or client-only filtering.

---

## 14. Antigravity Build Prompt

Paste the block below directly into Antigravity to execute the build.

```text
MASTER PROMPT — AI TASKS MODULE (FULL STACK)

You are a Senior Full Stack Engineer, UI/UX Engineer, Product Designer,
Database Engineer, and QA Engineer.

GOAL
Build ONE production-quality module — AI Tasks — for an existing AI
discovery platform, covering routes /tasks and /tasks/[slug], with a real
database → API → frontend → interaction flow.

STEP 1 — INSPECT FIRST
Before writing any code, inspect the existing project: package.json,
framework, routing, existing pages/components, styling system (Tailwind or
otherwise), database schema/config, API conventions, auth (if any), and
existing design tokens. Reuse everything that already exists — components,
tokens, DB infrastructure, API patterns, utilities. Do not introduce a
parallel system or unnecessary dependencies.

DESIGN DIRECTION
Visual language inspired by AI Orbit (https://aiorbit.club/) WITHOUT cloning
it: no copied code, layout, text, or assets. Dark/black UI, white primary
text, muted secondary text, subtle borders, restrained single accent color,
clean dense-but-readable cards, minimal and professional. Avoid gradients,
glassmorphism, oversized radii, decorative clutter, and generic SaaS-dashboard
styling. Keep the module visually consistent with the rest of the app (same
fonts, radii, shadows, buttons — no design drift).

SCOPE — BUILD ONLY THIS
Frontend routes: /tasks, /tasks/[slug]
Backend routes:
  GET  /api/tasks
  GET  /api/tasks/[slug]
  GET  /api/tasks/categories
  GET  /api/tasks/stats
  POST /api/tasks/[slug]/start
Do not modify or redesign unrelated modules (/companies, /robots,
/leaderboard, /business, /learn, /news) except for a shared component that
genuinely needs a safe, minimal update. Do not delete or break existing
functionality.

/tasks PAGE
- Header: "AI Tasks" + a short professional subtitle.
- Stats bar (Total Tasks, Categories, Featured, Active) sourced live from
  GET /api/tasks/stats — never hardcoded.
- Backend-driven search ("Search AI tasks...") across title, description,
  category, technologies, skills — debounced, no full client-side dataset.
- Filters: Category, Difficulty (Beginner/Intermediate/Advanced/Expert),
  Status (Open/Active/Completed/Archived), Technology — all combinable via
  query params and processed server-side. Categories sourced from
  GET /api/tasks/categories.
- Sort: Featured, Newest, Oldest, Most Popular, Shortest/Longest Time,
  Difficulty — sorted server-side.
- Grid and List view toggle, both backed by the same data.
- Task cards show title, short description, category, difficulty, status,
  estimated time, technologies, skills, featured badge, and a "View Task"
  action, with a subtle hover interaction.
- Real backend pagination (no full-dataset fetch).
- URL reflects search/filter/sort/page/view; refresh and browser back/forward
  must preserve state correctly.
- Skeleton loading states for cards and stats; a clear empty state ("No
  tasks match your current filters." + Clear Filters); friendly error states
  with no technical detail ever exposed to the user.

/tasks/[slug] PAGE
Breadcrumb (Tasks / Category / Title) → Task Header (title, short
description, category, difficulty, status, estimated time, featured flag,
technologies, "Start Task" CTA) → Overview (original written content, not
copied from any site) → Requirements (numbered, from DB) → Constraints (from
DB) → Expected Outcome → Evaluation Criteria (numbered, from DB) → Skills →
Technologies → Metadata panel (difficulty, estimated time, category, status,
created date, participants, popularity) → Related Tasks (3–6, matched by
category/technology/skill/difficulty, backend-generated) . Invalid slugs must
render a clean "Task not found" state with a Back to Tasks action and a real
HTTP 404 from the API.

START TASK
POST /api/tasks/[slug]/start with a real loading → success/failure UI cycle
and duplicate-submission protection. If the project already has auth,
integrate with it; if not, use a lightweight demo mechanism — do not build a
full auth system just for this. The point is a genuine frontend↔backend
round trip, not a simulated setTimeout.

DATABASE
Task model (id, title, slug, shortDescription, description, category,
difficulty, status, estimatedTime, featured, participants, popularity,
createdAt, updatedAt) plus related tables/fields for technologies, skills,
requirements, and evaluation criteria as fits the existing DB. Seed at least
25 realistic, original AI tasks spanning categories like Generative AI,
Machine Learning, Computer Vision, NLP, AI Agents, Robotics, Data Science, AI
Engineering, and Automation. No Lorem ipsum, no "Task 1/2/3" placeholders.

API RULES
List endpoint returns { success, data, pagination }. All query params
(page, limit, search, category, difficulty, status, technology, featured,
sort) must be validated server-side with sane bounds and rejected/defaulted
safely if invalid. Detail endpoint returns full task + related tasks, or a
structured 404. Never leak stack traces, raw DB errors, `undefined`, `null`,
or `NaN` to the client.

RESPONSIVENESS
Must work cleanly at 320/360/375/390/430 (mobile), 768/834/1024 (tablet), and
1280/1440/1920 (desktop) — no horizontal scroll, no clipped text/tags, no
overlapping buttons. On mobile, filters collapse into a filter button →
panel/sheet pattern rather than being squeezed into a row. Never patch layout
issues with `overflow-x: hidden`, `transform: scale`, or fixed desktop
widths — fix the actual layout.

ANIMATION (KEEP IT SIMPLE)
Add fast, subtle, purposeful motion only: page/section fade-in on load, small
card hover lift with border emphasis, quick button hover/press feedback,
smooth cross-fade when filters/sort/pagination change results, a gentle
skeleton shimmer while loading, and a short loading → success/error animation
on Start Task. Respect prefers-reduced-motion. No glow, bounce, parallax, or
heavy easing — everything should feel calm and quick (roughly 100–250ms).

ACCESSIBILITY & PERFORMANCE
Semantic HTML, labeled/keyboard-navigable search, filters, and pagination,
visible focus states, alt text, and ARIA only where needed. Server-side
filtering/search/pagination throughout; no unnecessary dependencies; reuse
existing utilities and components.

QUALITY GATES BEFORE YOU FINISH
Run the project's dev server, type check, lint, and production build. Fix
console errors/warnings, hydration issues, and TypeScript/lint errors
introduced by this module (clearly separate pre-existing unrelated issues,
don't silently claim they're fixed). Manually verify: search, every filter
individually and combined, sorting, pagination, grid/list toggle, task
detail, not-found handling, Start Task (loading/success/error), related
tasks, clear filters, and URL state across refresh/back/forward — at the
responsive breakpoints listed above.

DO NOT
- Clone AI Orbit's code, layout, or copy, or use its assets.
- Fake API calls with setTimeout or hardcode the full dataset into React.
- Filter/sort/paginate purely on the client.
- Touch unrelated modules, replace the stack, or remove existing features.
- Build a heavyweight auth system just for Start Task.

FINAL REPORT
After building, report: what was implemented (routes, endpoints, DB changes,
components), what was tested (API, DB, frontend, mobile/tablet/desktop,
build/type-check/lint), whether the production build actually passed, and
any genuine remaining limitations. Do not claim a feature is complete if it
isn't actually working end-to-end.

BUILD THE COMPLETE AI TASKS MODULE NOW — database → backend → API →
frontend → search → filter → sort → pagination → detail page → real user
interaction — production-quality, responsive, accessible, and maintainable.
```

---

## 15. Suggested Delivery Checklist (for you, after Antigravity runs)

- [ ] `/tasks` loads real data, not mocked
- [ ] All filters + search + sort verified via network tab (server-side)
- [ ] Pagination confirmed server-driven
- [ ] `/tasks/[slug]` renders full detail + related tasks
- [ ] Start Task performs a real POST with proper states
- [ ] Responsive check across all listed breakpoints
- [ ] Production build passes cleanly
- [ ] No console errors, no leaked internal errors
- [ ] Design consistent with rest of app (no drift)
