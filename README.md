# 📅 Calendly Clone

A production-ready scheduling platform built with **Next.js**, **Express.js**, **PostgreSQL**, and **Prisma ORM**. Modeled after Calendly's clean, minimal design — featuring event type management, availability scheduling, public booking pages, and meeting management.

![Stack](https://img.shields.io/badge/Next.js-15-black?logo=next.js) ![Express](https://img.shields.io/badge/Express-4.x-green?logo=express) ![PostgreSQL](https://img.shields.io/badge/Postgre -16-blue?logo=postgresql) ![Prisma](https://img.shields.io/badge/Prisma-6.x-2D3748?logo=prisma) ![Tailwind](https://img.shields.io/badge/Tailwind-4.x-38BDF8?logo=tailwindcss)

---

## ✨ Features

- **Event Type Management** — Create, edit, delete configurable meeting types (15/30/45/60 min)
- **Availability Scheduling** — Set weekly hours with toggleable days and time pickers
- **Public Booking Pages** — Clean Calendly-style booking flow: select date → time → submit
- **Double-Booking Prevention** — Transactional overlap detection with PostgreSQL
- **Meeting Management** — View upcoming/past bookings, cancel meetings
- **Responsive Design** — Mobile-first, works on all screen sizes
- **Timezone Support** — All times stored in UTC, displayed in local timezone

---

## 🏗️ Architecture

```
Calendly_Clone/
├── backend/               # Express.js API (Port 5000)
│   ├── prisma/            # DB schema + seed
│   ├── src/
│   │   ├── config/        # Prisma client singleton
│   │   ├── controllers/   # HTTP request handlers
│   │   ├── middleware/     # Error handling
│   │   ├── routes/        # Express route definitions
│   │   ├── services/      # Business logic layer
│   │   ├── utils/         # Errors, time utilities
│   │   └── server.js      # Express entry point
│   └── package.json
├── frontend/              # Next.js 15 App (Port 3000)
│   ├── src/
│   │   ├── app/           # App Router pages
│   │   ├── components/    # Reusable UI components
│   │   ├── services/      # API client (Axios)
│   │   └── utils/         # Date formatting utilities
│   └── package.json
├── docker-compose.yml     # PostgreSQL container
└── README.md
```

### Design Patterns

| Pattern | Implementation |
|---------|---------------|
| **MVC** | Controllers handle HTTP, Services handle business logic, Prisma handles data |
| **Repository** | Prisma ORM acts as the data access layer |
| **Service Layer** | All business logic isolated in `/services/` |
| **Singleton** | Prisma client shared across the app |
| **Transaction** | Booking creation uses Prisma interactive transactions |

---

## 🗄️ Database Schema

```
┌──────────────┐     ┌──────────────────┐
│    Users     │     │   EventTypes     │
├──────────────┤     ├──────────────────┤
│ id           │────<│ userId           │
│ name         │     │ id, name, slug   │
│ email        │     │ duration, color  │
└──────┬───────┘     └────────┬─────────┘
       │                      │
       │                      │
┌──────┴───────┐     ┌────────┴─────────┐
│ Availability │     │    Bookings      │
├──────────────┤     ├──────────────────┤
│ userId       │     │ eventTypeId      │
│ dayOfWeek    │     │ name, email      │
│ startTime    │     │ startTime        │
│ endTime      │     │ endTime          │
│ timezone     │     │ status           │
└──────────────┘     └──────────────────┘
```

**Key Constraints:**
- `@@unique([userId, dayOfWeek])` on Availability — one entry per day
- `@@index([eventTypeId, startTime, endTime])` on Bookings — fast overlap queries
- `slug` unique on EventTypes — clean public URLs

---

## 🔧 Setup Guide

### Prerequisites

- **Node.js** 18+ and **npm**
- **PostgreSQL** 14+ (local, Docker, or cloud)

### Option A: Docker PostgreSQL (Recommended)

```bash
# Start PostgreSQL container
docker-compose up -d

# This creates a database at:
# postgresql://postgres:postgres@localhost:5432/calendly_clone
```

### Option B: Local/Cloud PostgreSQL

Update the connection string in `backend/.env`:

```env
DATABASE_URL="postgresql://username:password@host:5432/calendly_clone"
```

### Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Push schema to database (creates tables)
npx prisma db push

# Generate Prisma client
npx prisma generate

# Seed with sample data
node prisma/seed.js

# Start development server
npm run dev
```

The API will be running at `http://localhost:5000`.

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be running at `http://localhost:3000`.

---

## 📡 API Documentation

### Event Types

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/event-types` | List all event types |
| `POST` | `/api/event-types` | Create event type |
| `PUT` | `/api/event-types/:id` | Update event type |
| `DELETE` | `/api/event-types/:id` | Delete event type |

**POST /api/event-types**
```json
{
  "name": "30 Minute Meeting",
  "duration": 30,
  "slug": "30-min-meeting",
  "color": "#006BFF"
}
```

### Availability

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/availability` | Get weekly schedule |
| `POST` | `/api/availability` | Set weekly schedule (bulk upsert) |

**POST /api/availability**
```json
{
  "schedules": [
    { "dayOfWeek": 1, "startTime": "09:00", "endTime": "17:00", "timezone": "Asia/Kolkata" },
    { "dayOfWeek": 2, "startTime": "09:00", "endTime": "17:00", "timezone": "Asia/Kolkata" }
  ]
}
```

### Public Booking

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/event/:slug` | Get event type by slug |
| `GET` | `/api/event/:slug/slots?date=YYYY-MM-DD` | Get available time slots |
| `POST` | `/api/book` | Create a booking |

**POST /api/book**
```json
{
  "eventTypeId": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "startTime": "2026-04-15T09:00:00.000Z",
  "endTime": "2026-04-15T09:30:00.000Z"
}
```

### Meetings

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/bookings?type=upcoming` | List bookings |
| `PATCH` | `/api/bookings/:id/cancel` | Cancel a booking |

---

## ⚙️ Core Logic Explained

### Time Slot Generation

```
Input: date, event duration, availability, existing bookings

1. Get availability for the target day's dayOfWeek (e.g., Monday = 1)
2. If no availability for that day → return []
3. Generate candidate slots from startTime to endTime in `duration`-minute steps
   Example: 9:00-17:00, 30min → [9:00, 9:30, 10:00, ..., 16:30]
4. Fetch all scheduled bookings for that event type on that date
5. Filter out slots that overlap with existing bookings
6. Filter out slots in the past (if the date is today)
7. Return available slots as ISO timestamps
```

### Double-Booking Prevention

The system uses **Prisma interactive transactions** to atomically:
1. Check for overlapping bookings: `WHERE start < newEnd AND end > newStart`
2. Only create the booking if no overlap exists

This prevents race conditions where two requests could try to book the same slot simultaneously.

---

## 🧪 Sample Data

The seed script creates:
- **1 Admin User** (admin@calendly-clone.com)
- **3 Event Types**: 15 Min Meeting, 30 Min Meeting, 60 Min Meeting
- **Mon-Fri Availability**: 9:00 AM - 5:00 PM IST
- **4 Sample Bookings**: 2 upcoming, 1 past, 1 cancelled

---

## 📐 Assumptions

1. **Single admin user** — no authentication required (extensible to multi-user)
2. **Default timezone** — Asia/Kolkata (configurable in availability settings)
3. **One availability slot per day** — simplifies the weekly schedule editor
4. **Booking status** — `scheduled` or `cancelled` (soft delete pattern)
5. **No email notifications** — can be added with NodeMailer as bonus feature

---

## 🚀 Deployment Guide

### Backend (Railway / Render / Fly.io)

1. Push code to GitHub
2. Create a new service on your preferred platform
3. Set environment variables:
   - `DATABASE_URL` — your production PostgreSQL URL
   - `PORT` — the port to run on (usually auto-set)
   - `FRONTEND_URL` — your production frontend URL
4. Build command: `npx prisma generate && npx prisma db push`
5. Start command: `node src/server.js`

### Frontend (Vercel)

1. Connect your GitHub repo
2. Set root directory to `frontend/`
3. Set environment variable:
   - `NEXT_PUBLIC_API_URL` — your production API URL
4. Framework: Next.js (auto-detected)
5. Deploy!

---

## 📝 License

MIT
