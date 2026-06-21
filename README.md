# Oloni Admin Web

> Control room for the **Gambella Mobility & Delivery Platform** (Oloni). Built with **Next.js 16**, **TypeScript**, **Tailwind CSS v4**, and **shadcn/ui**.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript (strict mode) |
| Styling | Tailwind CSS v4 |
| Components | shadcn/ui |
| Data fetching | TanStack Query v5 |
| Real-time | Socket.io client |
| Maps | Gebeta Maps (MapLibre GL) |
| Auth | NextAuth.js |
| Monies | Always ETB (birr) in UI; milliemes at API boundary |

---

## Project Structure

```
oloni-admin-web/
├── app/
│   ├── (auth)/
│   │   └── login/               # Login page
│   └── (dashboard)/
│       ├── layout.tsx            # Sidebar + topbar shell
│       ├── page.tsx              # Main dashboard (KPIs + chart)
│       ├── drivers/              # Driver management
│       │   ├── [id]/             # Driver detail
│       │   ├── pending/          # Approval queue
│       │   ├── map/              # Live driver map
│       │   └── complaints/       # Complaints & disputes
│       ├── bookings/             # Bookings & live ops
│       │   ├── [id]/             # Booking detail & route replay
│       │   ├── live/             # Kanban live ops board
│       │   ├── no-drivers/       # No-driver alert feed
│       │   ├── fare-rules/       # Fare rule management
│       │   ├── service-areas/    # Service area polygon editor
│       │   └── dispatch-health/  # BullMQ dispatch health
│       ├── airport/              # Airport shuttle management
│       │   ├── slots/            # Slot configuration
│       │   ├── trips/[id]/       # Trip detail + passenger manifest
│       │   └── revenue/          # Airport revenue summary
│       ├── finance/              # Finance & payments
│       │   ├── page.tsx          # Revenue dashboard
│       │   ├── cash-reconciliation/
│       │   ├── wallets/
│       │   └── telebirr/
│       ├── callcenter/           # Call center & operator tools
│       │   └── my-bookings/
│       ├── settings/
│       │   ├── team/             # Team management
│       │   ├── vehicles/         # Vehicle type config
│       │   ├── system-health/    # System health panel
│       │   └── notifications/    # Notification log & templates
│       └── audit/                # Audit log viewer
├── components/
│   ├── ui/                       # shadcn/ui base components
│   └── layout/                   # Sidebar, topbar, etc.
├── hooks/                        # Custom React hooks
├── lib/
│   ├── api/                      # Fetch client, endpoints, query keys
│   ├── auth/                     # Permissions map
│   └── realtime/                 # Socket.io client
├── types/                        # Shared TypeScript types
└── config/                       # App-wide constants
```

---

## User Roles

| Role | Access |
|---|---|
| `ADMIN` | All modules |
| `OPERATOR` | Call Center module only |

---

## Getting Started

### Prerequisites

- Node.js 20 LTS (`nvm use`)
- npm 10+
- Running `oloni-backend` NestJS API

### Setup

```bash
# 1. Install dependencies
npm install

# 2. Create local env file
cp .env.example .env.local
# Edit .env.local and fill in real values

# 3. Start development server (runs on port 3001 to avoid conflicting with backend)
npm run dev
```

Open [http://localhost:3001](http://localhost:3001) in your browser.

### Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run format:check` | Check Prettier formatting |
| `npm run type-check` | Run TypeScript type checker |

---

## Environment Variables

See [`.env.example`](.env.example) for the full list of required variables.

| Variable | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | ✅ | oloni-backend base URL (e.g. `http://localhost:3000/api`) |
| `NEXT_PUBLIC_WS_URL` | ✅ | Socket.io endpoint (e.g. `http://localhost:3000`) |
| `NEXTAUTH_SECRET` | ✅ | Strong random secret for NextAuth session encryption |
| `NEXTAUTH_URL` | ✅ | Full URL of this app (e.g. `http://localhost:3001`) |

---

## Key Design Rules

1. **Status** is always a colored badge — never plain text
2. **Money** is always ETB with 2 decimal places — never raw milliemes
3. **Destructive actions** always require a reason + confirmation step
4. **Real-time data** updates live — a subtle pulse marks anything that just changed
5. **Sidebar**: always visible on desktop, drawer on tablet

---

## Milestones

| # | Milestone | Status |
|---|---|---|
| 1 | Foundation & Infrastructure | 🟡 In Progress |
| 2 | Auth & Access Control | ⬜ Pending |
| 3 | Dashboard & Driver Management | ⬜ Pending |
| 4 | Bookings & Live Operations | ⬜ Pending |
| 5 | Airport Shuttle Management | ⬜ Pending |
| 6 | Finance & Payments | ⬜ Pending |
| 7 | Call Center & Operator Tools | ⬜ Pending |
| 8 | Configuration, Audit & System Health | ⬜ Pending |
| 9 | Testing, Security & Production | ⬜ Pending |
