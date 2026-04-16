<p align="center">
  <img src="https://img.shields.io/badge/Next.js-15-000?logo=next.js&logoColor=white" alt="Next.js" />
  <img src="https://img.shields.io/badge/Express-4.x-000?logo=express&logoColor=white" alt="Express" />
  <img src="https://img.shields.io/badge/PostgreSQL-16-336791?logo=postgresql&logoColor=white" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/Prisma-6.x-2D3748?logo=prisma&logoColor=white" alt="Prisma" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-4.x-06B6D4?logo=tailwindcss&logoColor=white" alt="Tailwind" />
  <img src="https://img.shields.io/badge/OAuth_2.0-Google-4285F4?logo=google&logoColor=white" alt="Google OAuth" />
  <img src="https://img.shields.io/badge/License-MIT-F59E0B" alt="License" />
</p>

<h1 align="center">📅 Calendly Clone</h1>

<p align="center">
  <strong>A production-grade scheduling platform inspired by <a href="https://calendly.com">Calendly</a></strong><br/>
  Built with Next.js 15 · Express.js · Prisma · PostgreSQL · Google OAuth 2.0
</p>

<p align="center">
  <a href="#-quick-start">Quick Start</a> •
  <a href="#-features">Features</a> •
  <a href="#-advantages">Advantages</a> •
  <a href="#-use-cases">Use Cases</a> •
  <a href="#-api-reference">API Reference</a> •
  <a href="#-deployment">Deployment</a>
</p>

---

## 📸 Overview

A full-featured, responsive scheduling application that replicates Calendly's core experience — from shareable booking links and real-time slot availability to automated email reminders and an admin dashboard. The interface features a modern **glassmorphism** design system with smooth scroll-triggered animations, optimized for every screen size.

---

## 🚀 Quick Start

```bash
# 1 — Clone the repository
git clone https://github.com/your-username/Calendly_Clone.git
cd Calendly_Clone

# 2 — Start PostgreSQL (Docker) or configure your own in backend/.env
docker-compose up -d

# 3 — Backend
cd backend
npm install
cp .env.example .env          # configure environment variables (see below)
npx prisma db push && npx prisma generate
node prisma/seed.js           # seed sample data
npm run dev                   # → http://localhost:5000

# 4 — Frontend
cd ../frontend
npm install
npm run dev                   # → http://localhost:3000
```

<details>
<summary><strong>Environment Variables Reference</strong></summary>

Create `backend/.env`:

```env
# ── Database ────────────────────────────────────────────
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/calendly_clone"

# ── Server ──────────────────────────────────────────────
PORT=5000
FRONTEND_URL="http://localhost:3000"

# ── Authentication ──────────────────────────────────────
GOOGLE_CLIENT_ID="<your-google-client-id>"
GOOGLE_CLIENT_SECRET="<your-google-client-secret>"
JWT_SECRET="<strong-random-string>"

# ── Email (optional) ────────────────────────────────────
GMAIL_USER="you@gmail.com"
GMAIL_APP_PASSWORD="<app-password>"

# ── Media (optional) ────────────────────────────────────
CLOUDINARY_CLOUD_NAME="<cloud-name>"
CLOUDINARY_API_KEY="<api-key>"
CLOUDINARY_API_SECRET="<api-secret>"
```

</details>

---

## ✨ Features

### Scheduling Engine

| Feature | Details |
|---------|---------|
| **Event Types** | Create 15 / 30 / 45 / 60-min meetings with custom colors, slugs & location settings |
| **Availability** | Set per-day weekly schedules with timezone-aware time pickers |
| **Public Booking** | Shareable link → date picker → slot selection → one-click booking |
| **Conflict Prevention** | Prisma interactive transactions guarantee atomic overlap detection — zero double-bookings |
| **Meeting Hub** | Filterable upcoming / past view with one-click cancellation |

### Event Kinds

| Kind | Description |
|------|-------------|
| **One-on-One** | Classic 1 : 1 scheduling between host and invitee |
| **Group** | Multiple invitees per slot with configurable `maxInvitees` cap |
| **Round-Robin** | Bookings are auto-distributed across a pool of co-hosts |
| **Collective** | All co-hosts must be available; meeting is shared among hosts |

### Authentication & Security

| Layer | Implementation |
|-------|---------------|
| **Sign-in** | Google OAuth 2.0 via Passport.js → JWT access tokens |
| **Authorization** | `authMiddleware` + `adminMiddleware` route guards |
| **Input Safety** | Server-side validation & sanitization on every endpoint |
| **Data Isolation** | Users can only access their own resources; admin routes gated separately |
| **Transport** | CORS locked to configured origin; error details masked in production |
| **Queries** | Prisma parameterized queries — no raw SQL, no injection surface |

### Communication

| Channel | Behavior |
|---------|----------|
| **Booking Confirmation** | Instant email to invitee + host on successful booking |
| **Meeting Reminder** | Cron job fires 30 min before each meeting → reminder email |
| **Location Delivery** | Google Meet / Teams / Zoom / custom venue details included in every notification |

### User Experience

- **Glassmorphism UI** — `backdrop-filter` glass cards, soft borders, semi-transparent layers
- **Scroll Animations** — Intersection Observer-driven reveals on every landing-page section
- **Responsive Layout** — Mobile slide-in sidebar, adaptive grid, touch-optimized booking flow
- **Profile Management** — Edit name, upload avatar (Cloudinary), manage account
- **Timezone Intelligence** — All times persisted as UTC, rendered in the visitor's local zone

### Admin Dashboard

- Real-time platform statistics (users, events, bookings)
- Full user management (list, inspect, remove)
- Event-type oversight across all hosts

---

## 🏆 Advantages

<table>
  <tr>
    <td width="50%">

**🏗️ Production Architecture**
MVC + Service Layer + Repository pattern. Clean separation of concerns — controllers, services, and data access are fully decoupled. Swap databases, add integrations, or scale individual layers independently.

**⚡ Race-Condition Proof**
Prisma interactive transactions wrap overlap checks and inserts atomically. Two concurrent requests for the same slot will never both succeed.

**🔐 Enterprise Security Model**
OAuth 2.0 identity, JWT sessions, RBAC middleware, input sanitization, CORS, error masking — aligned with OWASP top-10 mitigations.

**📧 Automated Communication**
Booking confirmations fire instantly; a background cron scheduler handles 30-min pre-meeting reminders — no manual follow-ups needed.

  </td>
  <td width="50%">

**🎨 Premium Design System**
Glassmorphism cards, gradient accents, animated counters, scroll-reveal sections — a UI that feels like a shipped SaaS product, not a side project.

**📱 Device Agnostic**
Mobile-first CSS with slide-in navigation, responsive grids, and touch targets. Tested across phone, tablet, and desktop breakpoints.

**🔌 Extensible by Design**
Modular service layer means adding Stripe payments, calendar sync, or Slack notifications requires touching only one new service file — nothing else changes.

**🐳 One-Command Dev Setup**
`docker-compose up -d` → Postgres running. `npm run dev` → API + frontend live. From clone to running app in under two minutes.

  </td>
  </tr>
</table>

### Technical Highlights

- **Type-safe queries** — Prisma auto-generated client eliminates runtime SQL errors
- **Indexed lookups** — Composite indexes on `[eventTypeId, startTime, endTime]` keep slot queries fast at scale
- **Modular services** — Each domain (auth, booking, email, slots) is an isolated module with a single responsibility
- **Environment parity** — `.env`-driven config ensures identical behavior across dev → staging → production
- **Media pipeline** — Cloudinary handles avatar uploads, transformation, and CDN delivery

---

## 💡 Use Cases

### Individuals

| Persona | Scenario |
|---------|----------|
| **Freelancers & Consultants** | Share a personal link — clients self-schedule discovery calls, eliminating email ping-pong |
| **Tutors & Educators** | Students book office hours or lessons; reminders reduce no-shows |
| **Healthcare Providers** | Patients book appointments online with automated confirmation |
| **Content Creators** | Schedule podcast guests, collab calls, or mentoring sessions in one click |

### Teams & Businesses

| Persona | Scenario |
|---------|----------|
| **Sales** | Embed booking links in outbound emails and landing pages to shorten the pipeline |
| **Recruiting** | Round-robin events auto-distribute candidate interviews across the hiring panel |
| **Engineering** | Schedule pairing sessions, code reviews, and sprint ceremonies conflict-free |
| **Customer Success** | Offer scheduled callbacks — reduce hold times, improve CSAT |

### Organizations

| Persona | Scenario |
|---------|----------|
| **Universities** | Faculty publish office-hour slots; students book via a public link |
| **Government** | Citizens schedule appointments for permits, consultations, and services |
| **Clinics** | Multi-provider collective events ensure proper coverage across shifts |
| **Distributed Teams** | Timezone-aware scheduling removes the guesswork from cross-region standups |

### Developers

| Scenario | Value |
|----------|-------|
| **White-label SaaS** | Fork, rebrand, and embed scheduling into your own product |
| **Portfolio project** | Demonstrates OAuth, cron, transactions, REST design, and responsive UI |
| **API integration** | RESTful endpoints make it trivial to connect mobile apps, CRMs, or Zapier |
| **Hackathon starter** | Skip weeks of boilerplate — ship features on day one |

---

## 🏗️ Architecture

```
Calendly_Clone/
│
├─ backend/                        Express.js API · Port 5000
│  ├─ prisma/
│  │  ├─ schema.prisma             Data model & relations
│  │  ├─ migrations/               Version-controlled schema changes
│  │  └─ seed.js                   Sample data loader
│  └─ src/
│     ├─ config/                   Prisma client · Passport · Cloudinary
│     ├─ controllers/              7 controllers (admin, auth, availability,
│     │                            booking, eventType, profile, public)
│     ├─ middleware/               authMiddleware · adminMiddleware
│     │                            errorHandler · upload (multer)
│     ├─ routes/                   Route definitions per domain
│     ├─ services/                 Core business logic
│     │  ├─ authService.js
│     │  ├─ bookingService.js
│     │  ├─ slotService.js
│     │  ├─ emailService.js
│     │  ├─ reminderScheduler.js
│     │  ├─ eventTypeService.js
│     │  ├─ availabilityService.js
│     │  ├─ profileService.js
│     │  └─ adminService.js
│     ├─ utils/                    Custom errors · time helpers
│     └─ server.js                 Entry point
│
├─ frontend/                       Next.js 15 · Port 3000
│  └─ src/
│     ├─ app/
│     │  ├─ (landing)  page.js     Marketing landing page
│     │  ├─ login/                 Google OAuth sign-in
│     │  ├─ dashboard/             Authenticated home
│     │  ├─ event-types/           CRUD for meeting types
│     │  ├─ availability/          Weekly schedule editor
│     │  ├─ meetings/              Upcoming & past bookings
│     │  ├─ profile/               Account settings
│     │  ├─ admin/                 Admin dashboard
│     │  └─ event/[slug]           Public booking flow
│     ├─ components/               Shared UI (sidebar, cards, modals)
│     ├─ services/                 Axios API client
│     └─ utils/                    Date formatting · auth helpers
│
└─ docker-compose.yml              PostgreSQL 16 container
```

### Design Patterns

| Pattern | Where & Why |
|---------|-------------|
| **MVC** | Controllers → Services → Prisma. Each layer has a single job. |
| **Service Layer** | All business logic lives in `/services/` — controllers stay thin. |
| **Repository** | Prisma acts as the data-access abstraction over PostgreSQL / SQLite. |
| **Singleton** | One shared Prisma client instance across the process. |
| **Interactive Transaction** | Booking creation wraps read + write in an atomic transaction. |
| **Strategy** | Slot generation varies by event kind (1:1, group, round-robin, collective). |
| **Middleware Pipeline** | `Auth → Admin → Controller` — composable, testable route guards. |

---

## 🗄️ Data Model

```
┌──────────────┐       ┌──────────────────┐       ┌──────────────────┐
│    User      │       │    EventType     │       │ EventTypeCoHost  │
├──────────────┤       ├──────────────────┤       ├──────────────────┤
│ id       PK  │──┐    │ id       PK      │──┐    │ id       PK      │
│ name         │  │    │ name             │  │    │ eventTypeId  FK  │
│ email    UQ  │  ├───<│ userId   FK      │  ├───<│ userId       FK  │
│ googleId UQ  │  │    │ slug     UQ      │  │    └──────────────────┘
│ avatar       │  │    │ duration         │  │
└──────┬───────┘  │    │ color            │  │
       │          │    │ kind             │  │
       │          │    │ maxInvitees      │  │
       │          │    │ locationType     │  │
       │          │    │ locationValue    │  │
       │          │    └────────┬─────────┘  │
┌──────┴───────┐  │    ┌────────┴─────────┐  │
│ Availability │  │    │    Booking       │  │
├──────────────┤  │    ├──────────────────┤  │
│ id       PK  │  │    │ id       PK      │  │
│ userId   FK  │──┘    │ eventTypeId FK   │──┘
│ dayOfWeek    │       │ inviteeId   FK   │
│ startTime    │       │ assignedHostId   │
│ endTime      │       │ name             │
│ timezone     │       │ email            │
└──────────────┘       │ startTime        │
                       │ endTime          │
                       │ status           │
                       └──────────────────┘
```

**Constraints & Indexes**

| Table | Constraint | Purpose |
|-------|-----------|---------|
| `Availability` | `@@unique([userId, dayOfWeek])` | One schedule entry per day per user |
| `Booking` | `@@index([eventTypeId, startTime, endTime])` | Fast overlap queries during slot generation |
| `Booking` | `@@index([inviteeId])` | Quick lookup of a user's bookings |
| `EventTypeCoHost` | `@@unique([eventTypeId, userId])` | Prevent duplicate co-host assignments |
| `EventType` | `slug UNIQUE` | Clean, collision-free public URLs |
| `User` | `email UNIQUE`, `googleId UNIQUE` | One account per identity |

---

## 📡 API Reference

> All protected endpoints require a valid JWT in the `Authorization: Bearer <token>` header.

### Authentication

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/api/auth/google` | — | Exchange Google credential for JWT |
| `GET` | `/api/auth/me` | ✅ | Return the authenticated user |

### Event Types

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/event-types` | ✅ | List the user's event types |
| `POST` | `/api/event-types` | ✅ | Create a new event type |
| `PUT` | `/api/event-types/:id` | ✅ | Update an event type |
| `DELETE` | `/api/event-types/:id` | ✅ | Delete an event type |

<details>
<summary>Example — Create Event Type</summary>

```json
POST /api/event-types
{
  "name": "30 Minute Meeting",
  "duration": 30,
  "slug": "30-min-meeting",
  "color": "#006BFF",
  "kind": "one-on-one",
  "locationType": "google-meet",
  "locationValue": ""
}
```
</details>

### Availability

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/availability` | ✅ | Get weekly schedule |
| `POST` | `/api/availability` | ✅ | Bulk upsert weekly schedule |

<details>
<summary>Example — Set Weekly Schedule</summary>

```json
POST /api/availability
{
  "schedules": [
    { "dayOfWeek": 1, "startTime": "09:00", "endTime": "17:00", "timezone": "Asia/Kolkata" },
    { "dayOfWeek": 2, "startTime": "09:00", "endTime": "17:00", "timezone": "Asia/Kolkata" }
  ]
}
```
</details>

### Public Booking

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/event/:slug` | — | Get event type details by slug |
| `GET` | `/api/event/:slug/slots?date=YYYY-MM-DD` | — | Get available time slots |
| `POST` | `/api/book` | ✅ | Create a booking |

<details>
<summary>Example — Book a Slot</summary>

```json
POST /api/book
{
  "eventTypeId": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "startTime": "2026-04-15T09:00:00.000Z",
  "endTime": "2026-04-15T09:30:00.000Z"
}
```
</details>

### Meetings

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/bookings?type=upcoming` | ✅ | List user's bookings |
| `PATCH` | `/api/bookings/:id/cancel` | ✅ | Cancel a booking |

### Profile

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/profile` | ✅ | Get profile |
| `PUT` | `/api/profile` | ✅ | Update name / avatar |

### Admin

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/admin/users` | 🔒 Admin | List all users |
| `GET` | `/api/admin/stats` | 🔒 Admin | Platform-wide statistics |
| `DELETE` | `/api/admin/users/:id` | 🔒 Admin | Remove a user |

---

## ⚙️ How It Works

### Slot Generation Algorithm

```
slotService.getAvailableSlots(slug, date)
│
├─ 1. Look up host's Availability for that day-of-week
│     → No entry? Return []
│
├─ 2. Generate candidate slots in `duration`-minute intervals
│     e.g. 09:00–17:00, 30 min → [09:00, 09:30, 10:00, … , 16:30]
│
├─ 3. Query existing Bookings for overlapping time ranges
│
├─ 4. Remove occupied slots
│
├─ 5. Remove past slots (when date === today)
│
└─ 6. Return ISO-formatted available slots
```

### Booking Transaction

```
POST /api/book
│
└─ prisma.$transaction(async (tx) => {
     1. SELECT conflicting bookings WHERE start < newEnd AND end > newStart
     2. If conflict → throw ConflictError
     3. INSERT new booking
     4. Fire emailService.sendBookingConfirmation()
   })
```

> The interactive transaction ensures **serializable** isolation — two concurrent requests for the same slot cannot both succeed.

### Reminder Scheduler

```
node-cron (every 60 s)
│
├─ Query bookings WHERE startTime BETWEEN now AND now + 30 min
│  AND status = "scheduled"
│  AND reminderSent = false
│
├─ For each match → emailService.sendMeetingReminder()
│
└─ Mark booking as reminded
```

---

## 🧪 Seed Data

Running `node prisma/seed.js` creates a ready-to-use demo environment:

| Resource | Details |
|----------|---------|
| **User** | `admin@calendly-clone.com` (admin role) |
| **Event Types** | 15-min, 30-min, 60-min meetings |
| **Availability** | Mon–Fri, 09:00–17:00 IST |
| **Bookings** | 2 upcoming · 1 past · 1 cancelled |

---

## 🔒 Security

| Vector | Mitigation |
|--------|-----------|
| **Identity** | Google OAuth 2.0 — no passwords stored |
| **Sessions** | Short-lived JWT tokens; no server-side session state |
| **Authorization** | Middleware chain: `authMiddleware` → `adminMiddleware` |
| **Injection** | Prisma parameterized queries — no raw SQL surface |
| **Input** | Server-side validation & sanitization on every endpoint |
| **CORS** | Origin-locked to `FRONTEND_URL` |
| **File Uploads** | Routed through Cloudinary with type validation |
| **Error Leaks** | Production mode returns generic error messages |

---

## 🛠️ Tech Stack

| Layer | Technologies |
|-------|-------------|
| **Frontend** | Next.js 15 · React 19 · Tailwind CSS 4 · Axios |
| **Backend** | Node.js · Express.js 4 · Passport.js |
| **Database** | PostgreSQL 16 (prod) · SQLite (dev) · Prisma 6 ORM |
| **Auth** | Google OAuth 2.0 · JSON Web Tokens |
| **Email** | Nodemailer · Gmail SMTP |
| **Media** | Cloudinary (avatar uploads & CDN) |
| **Scheduling** | node-cron |
| **DevOps** | Docker Compose · dotenv |

---

## 🚀 Deployment

### Backend → Railway / Render / Fly.io

| Step | Action |
|------|--------|
| 1 | Push to GitHub |
| 2 | Create a new web service |
| 3 | Set env vars: `DATABASE_URL`, `FRONTEND_URL`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `JWT_SECRET`, `GMAIL_USER`, `GMAIL_APP_PASSWORD` |
| 4 | **Build**: `npx prisma generate && npx prisma db push` |
| 5 | **Start**: `node src/server.js` |

### Frontend → Vercel

| Step | Action |
|------|--------|
| 1 | Connect GitHub repo |
| 2 | Root directory: `frontend/` |
| 3 | Env var: `NEXT_PUBLIC_API_URL` → production API URL |
| 4 | Framework: Next.js (auto-detected) → Deploy |

---

## 📐 Design Decisions

| Decision | Rationale |
|----------|-----------|
| **Google OAuth only** | Eliminates password storage, reduces attack surface, simplifies onboarding |
| **SQLite in development** | Zero-config local setup; Prisma makes switching to PostgreSQL a one-line change |
| **One availability slot per day** | Keeps the schedule editor simple while covering the 90% use case |
| **Soft-delete bookings** | `status: cancelled` preserves audit history vs. hard deletion |
| **UTC storage** | All timestamps stored in UTC — timezone conversion happens at the presentation layer |

---

## 🤝 Contributing

```bash
# 1. Fork & clone
git clone https://github.com/<you>/Calendly_Clone.git

# 2. Create a feature branch
git checkout -b feature/your-feature

# 3. Make changes, commit
git commit -m "feat: add your feature"

# 4. Push & open a PR
git push origin feature/your-feature
```

All contributions are welcome — features, bug fixes, documentation improvements, and test coverage.

---

<p align="center">
  <strong>Built with ❤️ by <a href="https://github.com/Palvash-Kumar">Palvash Kumar</a></strong>
</p>

<p align="center">
  <sub>Released under the <a href="LICENSE">MIT License</a></sub>
</p>
