# oloni/oloni-admin — Issue Tracker

> **58 issues** across **9 milestones**
> Next.js 14 (App Router) · TypeScript · TailwindCSS · shadcn/ui · TanStack Query
> Consumes the existing `oloni-backend` NestJS API — no new backend endpoints required unless explicitly noted.

---

## Table of Contents

- [Milestone 1 — Foundation & Infrastructure](#milestone-1--foundation--infrastructure) *(9 issues)*
- [Milestone 2 — Auth & Access Control](#milestone-2--auth--access-control) *(5 issues)*
- [Milestone 3 — Dashboard & Driver Management](#milestone-3--dashboard--driver-management) *(7 issues)*
- [Milestone 4 — Bookings & Live Operations](#milestone-4--bookings--live-operations) *(8 issues)*
- [Milestone 5 — Airport Shuttle Management](#milestone-5--airport-shuttle-management) *(6 issues)*
- [Milestone 6 — Finance & Payments](#milestone-6--finance--payments) *(6 issues)*
- [Milestone 7 — Call Center & Operator Tools](#milestone-7--call-center--operator-tools) *(4 issues)*
- [Milestone 8 — Configuration, Audit & System Health](#milestone-8--configuration-audit--system-health) *(7 issues)*
- [Milestone 9 — Testing, Security & Production Deployment](#milestone-9--testing-security--production-deployment) *(6 issues)*

---

## Milestone 1 — Foundation & Infrastructure

### #1 · Initialise Next.js 14 project with App Router and strict TypeScript
`infra` `dx`

- Run `npx create-next-app@latest oloni-admin --typescript --app --tailwind --eslint`.
- Set `strict: true`, `noUncheckedIndexedAccess: true` in `tsconfig.json`.
- Folder structure: `app/`, `components/`, `lib/`, `hooks/`, `types/`, `config/`.
- `app/` route groups: `(auth)`, `(dashboard)` with nested `drivers/`, `bookings/`, `airport/`, `finance/`, `callcenter/`, `settings/`, `audit/`.
- Add `.nvmrc` pinned to Node 20 LTS. Add README with setup instructions and env vars table.

**Done when:** `npm run dev` starts without errors. Route groups match spec. Folder structure committed.

---

### #2 · Configure ESLint, Prettier, Husky pre-commit hooks
`dx`

- Install `eslint-config-next`, `@typescript-eslint`, `prettier`, `prettier-plugin-tailwindcss`.
- Prettier: `singleQuote`, `trailingComma: all`, `printWidth: 100`, Tailwind class sorting plugin enabled.
- Husky + lint-staged: pre-commit runs `eslint --fix` then `prettier --write` on staged files.
- Add `npm run lint` and `npm run format:check` scripts.

**Done when:** committing a file with lint errors is blocked. CI lint job passes on clean code.

---

### #3 · Install and configure shadcn/ui component library with Oloni theme tokens
`ui` `dx`

- Run `npx shadcn-ui@latest init`. Choose CSS variables, neutral base color.
- Install core components: `button`, `input`, `table`, `dialog`, `dropdown-menu`, `select`, `tabs`, `badge`, `toast`, `card`, `skeleton`, `sheet`, `command`, `calendar`, `popover`, `form`.
- Define Oloni brand tokens in `tailwind.config.ts`: teal primary, gold accent, dark navy text — extend shadcn's default CSS variable theme rather than overriding it.
- Create `components/ui/oloni-logo.tsx` using the brand SVG.

**Done when:** all listed shadcn components render with Oloni brand colors applied via CSS variables, not hardcoded hex.

---

### #4 · API client layer — typed fetch wrapper with auth header injection
`infra` `networking`

- Create `lib/api/client.ts`: thin wrapper over `fetch` using native Next.js fetch caching where appropriate.
- Inject `Authorization: Bearer <token>` from cookie-stored JWT on every request.
- Typed response helper: `apiRequest<T>(path, options): Promise<T>` that throws a typed `ApiError` on non-2xx.
- Base URL from `NEXT_PUBLIC_API_URL` env var. Separate `.env.local` and `.env.production`.
- Create `lib/api/endpoints.ts` with every backend route as a typed constant — mirrors the NestJS route map exactly (drivers, bookings, airport, finance, audit, jobs).

**Done when:** a sample authenticated GET request succeeds against the running NestJS backend in dev.

---

### #5 · TanStack Query setup with SSR-safe hydration and global query client
`infra` `dx`

- Install `@tanstack/react-query` + `@tanstack/react-query-devtools`.
- Create `app/providers.tsx` client component wrapping `QueryClientProvider`. Default `staleTime: 30s`, `retry: 1`.
- Configure React Query Devtools — visible in dev only.
- Create `lib/api/query-keys.ts` — centralised query key factory per resource (`drivers`, `bookings`, `airportTrips`, `finance`) to avoid key collisions and enable precise invalidation.

**Done when:** a test query hook fetches and caches data correctly; devtools panel shows query state in dev.

---

### #6 · WebSocket client — Socket.io connection for live dashboard updates
`infra` `realtime`

- Install `socket.io-client`. Create `lib/realtime/socket-client.ts` — singleton connection, authenticated with admin JWT.
- Connect on dashboard mount, disconnect on unmount/logout.
- Create `hooks/useSocketEvent.ts`: subscribes to a named event, auto-unsubscribes on cleanup, typed payload.
- Events to support from day one: `booking:status`, `driver:location`, `airport:seat_booked`, `airport:trip_confirmed`, `airport:dropoff_fare`.

**Done when:** a test page shows live `driver:location` updates streaming in from a connected driver app session.

---

### #7 · Global layout — sidebar navigation, topbar, responsive shell
`ui`

- Build `app/(dashboard)/layout.tsx`: persistent sidebar (Dashboard, Drivers, Bookings, Airport, Finance, Call Center, Audit Log, Settings), topbar with admin avatar, notifications bell, logout.
- Sidebar collapses to icon-only on tablet, drawer (`Sheet`) on mobile.
- Active route highlighting using `usePathname()`.
- Breadcrumb component reflecting current route depth.

**Done when:** layout renders correctly at desktop, tablet, and mobile breakpoints. Active nav item highlighted correctly.

---

### #8 · Environment variable validation with Zod — crash on missing required vars
`infra` `security`

- Create `lib/env.ts` using `zod` to validate all required env vars at build/start time: `NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_WS_URL`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`.
- Throw a clear, human-readable error if any required var is missing.
- Create `.env.example` with all keys documented. Never commit `.env.local`.

**Done when:** removing any required var crashes the dev server with a clear message at startup.

---

### #9 · GitHub Actions CI pipeline — lint, type-check, build
`infra` `dx`

- Create `.github/workflows/ci.yml`: triggers on push + PR to `main` and `develop`.
- Jobs: lint (`eslint`), type-check (`tsc --noEmit`), build (`next build`).
- Cache `node_modules` and `.next/cache` with `actions/cache` keyed on `package-lock.json` hash.
- Branch protection on `main`: CI must pass + 1 PR approval before merge.

**Done when:** all three CI jobs pass on a clean commit. A type error blocks the PR.

---

## Milestone 2 — Auth & Access Control

### #10 · NextAuth.js setup with credentials provider against backend OTP/password
`auth` `security`

- Install `next-auth`. Configure `Credentials` provider that calls the existing backend admin login (phone/password or phone/OTP — confirm which the backend exposes; default to email/password admin login since call-center and admin roles are desk-based, not field-based).
- Store JWT from backend response inside the NextAuth session/cookie (httpOnly, secure in prod).
- Session strategy: `jwt`. Custom `session` and `jwt` callbacks to carry `role` (`ADMIN` | `OPERATOR`) and backend access token.
- Configure session max age aligned with backend access token expiry; implement silent refresh via backend `/auth/token/refresh` in the `jwt` callback when near expiry.

**Done when:** admin logs in with valid credentials and receives a session cookie containing role and backend token.

---

### #11 · Login page UI with error states and rate-limit handling
`auth` `ui`

- Build `app/(auth)/login/page.tsx`: Oloni logo, email/phone + password fields, "Sign in" button.
- Loading state on submit. Inline error for invalid credentials.
- Handle backend 429 (rate limited) with a countdown message identical in tone to the driver app's OTP rate-limit UX.
- Redirect to `/dashboard` on success; preserve intended destination via NextAuth `callbackUrl`.

**Done when:** invalid credentials show inline error; valid credentials redirect to dashboard; rate limit shows countdown.

---

### #12 · Role-based route protection — middleware guarding admin and operator routes
`auth` `security`

- Create `middleware.ts` using `next-auth/middleware` (or manual `getToken()` check) to protect every route under `(dashboard)`.
- Two roles: `ADMIN` (full access) and `OPERATOR` (Call Center module only, per Issue #15's `OPERATOR` role in the backend).
- Unauthenticated → redirect to `/login`. Authenticated `OPERATOR` hitting a non-call-center route → redirect to `/callcenter` with a toast explaining restricted access.
- Create `lib/auth/permissions.ts`: a single source of truth mapping routes to allowed roles, consumed by both middleware and conditional UI rendering.

**Done when:** an `OPERATOR` session cannot reach `/drivers` or `/finance` even via direct URL; redirected cleanly.

---

### #13 · Admin user management — invite, deactivate, role assignment screen
`auth` `ui`

- `app/(dashboard)/settings/team/page.tsx`: table of all admin/operator accounts (name, role, status, last login).
- "Invite teammate" dialog: email/phone + role selector → calls backend admin-user-creation endpoint (flag as a small backend addition if not already exposed: `POST /admin/team`, `PUT /admin/team/:id/deactivate`).
- Deactivating an account immediately invalidates their session (handled via backend token revocation, mirrored by NextAuth `signOut` trigger on next request if token invalid).

**Done when:** a new operator can be invited, logs in, and is correctly restricted to Call Center routes only.

---

### #14 · Session timeout and idle logout for shared front-desk machines
`auth` `security`

- Implement a 30-minute idle timeout (configurable) using a client-side activity listener (`hooks/useIdleTimer.ts`).
- On idle timeout: show a 60-second warning dialog ("Are you still there?"), then auto-logout via NextAuth `signOut()`.
- This matters specifically for the Call Center module, which often runs on a shared desk computer in a small office.

**Done when:** an idle session triggers the warning dialog at 29 minutes and logs out automatically at 30 if not dismissed.

---

## Milestone 3 — Dashboard & Driver Management

### #15 · Main dashboard — live KPI cards (today's trips, revenue, active drivers, complaints)
`dashboard` `ui`

- `app/(dashboard)/page.tsx`: 4–6 KPI cards — today's trip count, today's GMV/revenue, drivers currently online, open complaints/disputes.
- Data from a single aggregated backend call where possible; fall back to parallel TanStack Query calls per card with independent loading/error states.
- Cards auto-refresh every 30s via `refetchInterval`; manual refresh button.
- Below cards: a simple trips-by-hour bar chart (today) using `recharts`.

**Done when:** all KPI cards show live data and refresh automatically without a full page reload.

---

### #16 · Driver list — paginated table with status, vehicle type, and search filters
`drivers` `ui`

- `app/(dashboard)/drivers/page.tsx`: server-driven table (TanStack Table) consuming `GET /admin/drivers`.
- Columns: photo, name, phone, vehicle type, plate, status badge (Pending/Approved/Suspended/Rejected), online indicator, joined date.
- Filters: status, vehicle type, search by name/phone (debounced input). URL-synced filters (`useSearchParams`) so filtered views are shareable/bookmarkable.
- Cursor or offset pagination matching backend's pagination contract; page size selector.

**Done when:** filtering and searching update the table and URL without a full reload; pagination works correctly at the data boundaries.

---

### #17 · Driver detail page — documents, vehicle info, trip history, approve/reject/suspend actions
`drivers` `ui`

- `app/(dashboard)/drivers/[id]/page.tsx`: profile header (photo, name, status badge), tabs: Overview, Documents, Vehicle, Trip History, Earnings.
- Documents tab: licence photo and selfie photo rendered full-size in a lightbox (`Dialog`), zoomable, with side-by-side comparison for identity verification.
- Action buttons (role-gated to `ADMIN`): Approve, Reject (requires reason via dialog textarea), Suspend (requires reason).
- Each action calls the matching backend endpoint (`PUT /admin/drivers/:id/approve|reject|suspend`) and optimistically updates the status badge, with rollback on error via TanStack Query mutation.

**Done when:** approving a pending driver updates their status instantly in the UI and is reflected on next driver-app login.

---

### #18 · Driver approval queue — dedicated triage view for pending applications
`drivers` `ui`

- `app/(dashboard)/drivers/pending/page.tsx`: card-based queue (not a dense table) — one driver application per card with photo thumbnails, name, vehicle type, submitted date.
- Quick-approve and quick-reject buttons directly on the card (reject still requires reason via inline popover) to speed up high-volume onboarding days.
- Sort by oldest-first by default ("FIFO queue") with a toggle for newest-first.
- Badge in the sidebar nav item showing live pending count (polled or via WebSocket if backend emits an event; otherwise 30s poll).

**Done when:** an admin can process 10 pending applications in under 3 minutes using only this screen.

---

### #19 · Driver live map — all online drivers plotted with vehicle-type icons
`drivers` `ui` `realtime`

- `app/(dashboard)/drivers/map/page.tsx`: full-screen Gebeta Maps view (matching the driver app's map provider for consistency — `react-map-gl` or `maplibre-gl` against the Gebeta tile endpoint).
- Plot all currently online drivers from a backend "online drivers" endpoint (or derived from Redis `GEORADIUS` exposed via a lightweight admin endpoint if not already available — flag as a small backend addition: `GET /admin/drivers/online`).
- Custom markers by vehicle type (boda boda, bajaj, car) and color by status (idle/on-trip).
- Live position updates via the `driver:location` WebSocket event (Issue #6); marker click opens a popover with driver name, current booking (if any), and a link to their detail page.

**Done when:** the map shows real-time driver movement matching what the driver app itself is streaming.

---

### #20 · Driver earnings and commission summary tab
`drivers` `finance`

- Within the driver detail page (Issue #17), an Earnings tab: total lifetime earnings, current week, current month, total commission owed to platform.
- Trip-level table beneath the summary: date, service type, fare, commission, driver net — sourced from `GET /drivers/:id/history` (admin-scoped variant) or reused customer-facing endpoint with an admin override flag.
- CSV export button for a single driver's earnings over a selected date range.

**Done when:** the earnings tab numbers reconcile exactly against the finance module's per-driver figures (Milestone 6).

---

### #21 · Complaints and disputes list with resolution workflow
`drivers` `ui`

- `app/(dashboard)/drivers/complaints/page.tsx` (or a cross-cutting `/complaints` route if complaints can be filed against customers too — confirm against backend's `complaint_type` enum which includes customer-relevant types).
- Table: complaint type, reporter, against, status (Open/In Review/Resolved/Dismissed), filed date.
- Detail dialog: full description, related booking link (jumps to booking detail), resolution textarea, status changer.
- This consumes the backend's `complaints` table/endpoints; if not yet exposed as admin routes, flag as a backend addition (`GET /admin/complaints`, `PUT /admin/complaints/:id/resolve`).

**Done when:** an admin can resolve a complaint, add a resolution note, and the status updates immediately in the list.

---

## Milestone 4 — Bookings & Live Operations

### #22 · Bookings list — all city rides and airport trips with filters
`bookings` `ui`

- `app/(dashboard)/bookings/page.tsx`: table consuming `GET /admin/bookings` (or equivalent) with filters: status, service type (city ride / airport), vehicle type, driver, date range.
- Status badges color-coded matching the booking state machine (Pending, Dispatching, Accepted, Driver Arrived, In Progress, Completed, Cancelled).
- Search by booking number (`OLN-YYYY-NNNNN`), customer phone, or driver name.
- Row click opens booking detail in a side `Sheet` for fast triage without losing list context.

**Done when:** an admin can locate any booking by its booking number in under 5 seconds.

---

### #23 · Booking detail view — full timeline, route map, and force-cancel action
`bookings` `ui` `realtime`

- `app/(dashboard)/bookings/[id]/page.tsx`: header with booking number, status, customer and driver cards (name, phone, vehicle).
- State transition timeline component: visually shows each timestamped status change (Pending → Dispatching → Accepted → ... → Completed), pulled from booking + audit data.
- Embedded map showing pickup/dropoff pins and, for completed trips, the full route polyline from the route-replay endpoint (`GET /admin/bookings/:id/route`).
- For active bookings: live driver position overlay via WebSocket.
- "Force Cancel" action (role-gated `ADMIN`) with mandatory reason — calls `PUT /admin/bookings/:id/cancel` equivalent; confirmation dialog warns this should be rare.

**Done when:** route replay renders the correct path for a completed trip; force-cancel updates status immediately and notifies both parties via the existing backend notification flow.

---

### #24 · Live operations board — Kanban-style view of in-progress bookings by status
`bookings` `ui` `realtime`

- `app/(dashboard)/bookings/live/page.tsx`: Kanban columns (Dispatching, Accepted, Driver Arrived, In Progress) showing active bookings as cards.
- Cards update in real time via WebSocket `booking:status` events — move between columns without a manual refresh, with a subtle animation.
- Each card shows elapsed time in current state; cards exceeding a configurable threshold (e.g. "Dispatching for over 3 minutes") are visually flagged for operator attention.
- Click a card to open the booking detail Sheet (Issue #23).

**Done when:** a booking created in the driver/customer app appears on this board within 2 seconds and moves columns live as its status changes.

---

### #25 · No-driver-available alert feed
`bookings` `ui` `realtime`

- A dedicated panel (could live on the main dashboard or the live ops board) listing bookings that were cancelled with `NO_DRIVERS_AVAILABLE`.
- Real-time feed via WebSocket or 15s poll; shows pickup location, time, and service type — helps ops identify coverage gaps (e.g. consistently no drivers near the airport at certain hours).
- Click-through to the booking detail.

**Done when:** a manually-triggered no-driver cancellation in a test environment appears in this feed within 15 seconds.

---

### #26 · Fare rules management — edit base fare, per-km rate, flat rate per vehicle/service type
`bookings` `config` `ui`

- `app/(dashboard)/bookings/fare-rules/page.tsx`: table of all fare rules (vehicle type × service type) consuming `GET /fare-rules`.
- Inline edit (or edit dialog) for `baseFare`, `perKmRate`, `minFare`, `flatRate`, `isActive` — calls `PUT /admin/fare-rules/:id`.
- All monetary inputs displayed and entered in ETB (whole/decimal birr) but converted to/from integer milliemes at the API boundary — never let an admin type or see raw milliemes.
- Change confirmation dialog showing before/after values, since this directly affects live pricing.

**Done when:** updating a fare rule takes effect on the very next fare estimate call from the customer app, with no deploy required.

---

### #27 · Service area management — view and edit coverage polygons on a map
`bookings` `config` `ui`

- `app/(dashboard)/bookings/service-areas/page.tsx`: map-based polygon editor (Gebeta/MapLibre with a drawing toolkit, e.g. `mapbox-gl-draw` adapted for MapLibre) for `service_areas`.
- List of existing areas (Gambella City, Airport Zone, etc.) with active/inactive toggle.
- Polygon edits save as GeoJSON sent to a backend endpoint that updates the PostGIS `GEOGRAPHY(POLYGON)` column (flag as backend addition if `PUT /admin/service-areas/:id` doesn't yet exist).

**Done when:** an edited polygon boundary correctly changes which bookings are classified as in/out of the airport service area.

---

### #28 · Dispatch failure and queue monitoring panel
`bookings` `ops` `realtime`

- `app/(dashboard)/bookings/dispatch-health/page.tsx`: surfaces BullMQ dispatch queue health — pulls from the backend's failed-jobs endpoint (`GET /admin/jobs/failed`).
- Table of failed dispatch jobs with retry button (`PUT /admin/jobs/:id/retry`).
- Link out to Bull Board (`/admin/queues`, basic-auth protected on the backend) for deep queue inspection — embed as an iframe or simple external link depending on auth compatibility.

**Done when:** a manually failed dispatch job is visible in this panel and can be retried successfully from the UI.

---

### #29 · Booking export — CSV download for a date range with full trip detail
`bookings` `ui`

- Export button on the bookings list (Issue #22) and on individual filtered views.
- Calls a backend CSV export endpoint scoped to current filters (mirrors the finance export pattern, Issue #38 in the backend tracker) or generates client-side from the currently loaded page if a true export endpoint doesn't exist for raw bookings (flag if needed: `GET /admin/bookings/export`).
- Shows a toast with download progress for large exports; respects the active filter/date-range state.

**Done when:** exporting 1,000+ bookings over a 30-day range produces a correctly formatted CSV without timing out or freezing the UI.

---

## Milestone 5 — Airport Shuttle Management

### #30 · Airport slots configuration — create, edit, activate/deactivate time windows
`airport` `config` `ui`

- `app/(dashboard)/airport/slots/page.tsx`: list of all slots (Morning/Midday/Afternoon etc.) with label, departure time, max seats, booking-open/close windows, active toggle.
- Create/edit dialog calling `PUT /admin/airport/slots`; toggle calls `PUT /admin/airport/slots/:id/toggle`.
- Deactivating a slot shows a confirmation explaining it immediately closes booking for that slot — matches backend behavior exactly.
- Validation: departure time format, `bookingOpenHoursBefore > bookingCloseHoursBefore`, max seats between 1–4 (matches shared-car capacity constraint).

**Done when:** editing a slot's departure time changes what the customer app shows on the very next slot-list fetch.

---

### #31 · Airport trips dashboard — today's trips by slot with live seat fill status
`airport` `ui` `realtime`

- `app/(dashboard)/airport/trips/page.tsx`: grouped by slot (Morning/Midday/Afternoon), each slot showing its forming/confirmed/in-progress/completed trips as cards.
- Each trip card: seats filled (e.g. "3/4"), assigned driver (or "Unassigned"), direction (TO_AIRPORT / FROM_AIRPORT), status.
- Real-time seat fill updates via `airport:seat_booked` WebSocket event — no manual refresh needed during a busy morning slot.
- Filter by date (defaults to today) and direction.

**Done when:** a new passenger booking a seat in the driver/customer app updates the corresponding trip card's fill count within 2 seconds.

---

### #32 · Airport trip detail — passenger list, driver accept/reject status, route
`airport` `ui`

- `app/(dashboard)/airport/trips/[id]/page.tsx`: full passenger manifest (name, phone, pickup/dropoff, seat count, accept status, fare).
- For outbound trips: shows each passenger's `driver_accept_status` with reject reason if applicable, and whether bajaj fallback was triggered.
- For inbound (return) trips: shows per-passenger dropoff fare and distance from airport once computed.
- Map view of the multi-stop pickup order (mirrors the driver app's own pickup map for operational consistency when troubleshooting a driver's report).

**Done when:** an ops admin can fully reconstruct what happened on any given trip — who was accepted/rejected and why, and what each passenger paid — from this single screen.

---

### #33 · Bajaj fallback monitoring — trips where shared seats were unavailable
`airport` `ui`

- A filtered view within the airport trips dashboard (or its own tab) surfacing bookings that fell back to solo bajaj pricing due to no shared seats or driver rejection.
- Helps identify systemic undersupply at specific slots/dates — informs decisions to add more cars to a slot or adjust `max_seats`.
- Shows the fallback fare charged vs. the standard shared fare, for revenue-impact visibility.

**Done when:** a week with three bajaj-fallback incidents at the Morning slot is clearly visible and filterable in this view.

---

### #34 · Airport driver assignment — manual override for unassigned trips
`airport` `ui`

- Within the trip detail (Issue #32), an "Assign Driver" action when a forming/confirmed trip has no driver yet (e.g. auto-dispatch didn't find anyone in time).
- Searchable driver picker (filtered to approved CAR-type drivers, online preferred but not required) — manual assignment flag mirrors backend's "admin can manually assign a driver" capability described in the platform plan.
- Confirmation dialog; on assignment, driver is notified exactly as if auto-dispatched.

**Done when:** an admin can rescue a trip with no auto-assigned driver and have a real driver notified within seconds.

---

### #35 · Airport revenue summary — per-slot and per-direction breakdown
`airport` `finance` `ui`

- `app/(dashboard)/airport/revenue/page.tsx`: date-range selector; summary cards for total airport GMV, commission, passenger count, average fare.
- Breakdown table by slot (Morning/Midday/Afternoon) and by direction (outbound shared vs. inbound dynamic vs. bajaj fallback).
- Chart: daily airport revenue trend over the selected range — useful for tracking the platform's flagship revenue stream specifically, distinct from city-ride revenue.

**Done when:** the total in this view reconciles exactly with the airport-tagged subset of the main finance revenue report (Milestone 6).

---

## Milestone 6 — Finance & Payments

### #36 · Revenue dashboard — GMV, commission, breakdown by service type and payment method
`finance` `ui`

- `app/(dashboard)/finance/page.tsx`: date-range picker (presets: today, this week, this month, custom); summary cards for total GMV, platform commission, driver earnings paid out.
- Breakdown charts: revenue by service type (city ride vs. airport), revenue by payment method (cash vs. Telebirr).
- All figures sourced from `GET /admin/finance/revenue?from=&to=`; cached client-side per the backend's own 5-minute Redis cache window — avoid hammering with redundant refetches inside that window.

**Done when:** numbers on this dashboard match a manual SQL spot-check against the backend database for a known date range.

---

### #37 · Revenue export — CSV download of trip-level financial detail
`finance` `ui`

- Export button on the revenue dashboard calling `GET /admin/finance/revenue/export` for the currently selected date range.
- Shows file size/row count estimate before download for large ranges; download triggers via a direct browser navigation to the signed export URL (or blob download if the backend streams JSON/CSV directly).

**Done when:** exporting a full month of trip-level data produces a correctly formatted, Excel-compatible CSV.

---

### #38 · Cash reconciliation view — weekly cash trips owed by each driver
`finance` `ui`

- `app/(dashboard)/finance/cash-reconciliation/page.tsx`: week selector (`YYYY-WN` format matching backend), table of drivers with cash trip count, total cash collected, commission owed for the week.
- Per-driver drill-down showing individual cash trips contributing to the total.
- "Mark as settled" action for a driver-week once commission has been collected in person/offline — flag as a backend addition if no such state exists yet (`PUT /admin/finance/cash-reconciliation/:driverId/settle`).

**Done when:** the weekly reconciliation total for a test driver matches the sum of their individual cash-trip commissions exactly.

---

### #39 · Driver wallet and payout overview
`finance` `ui`

- `app/(dashboard)/finance/wallets/page.tsx`: table of all drivers with current wallet balance, total earned, total trips — sourced from `driver_wallets`.
- Search/filter by driver name or phone; sort by balance descending to spot drivers due for payout attention.
- Read-only for MVP (matches the backend plan's note that digital payouts are a post-MVP feature) — UI clearly labels this as a monitoring view, not a payout-initiation tool, until the payout endpoint exists.

**Done when:** wallet balances shown here match what each driver sees in their own driver-app earnings screen.

---

### #40 · Telebirr payment monitoring — transaction list with status and webhook health
`finance` `ui`

- `app/(dashboard)/finance/telebirr/page.tsx`: table of Telebirr payments with `telebirr_ref`, booking link, amount, status (Pending/Completed/Failed), timestamp.
- Highlight payments stuck in `Pending` beyond a reasonable window (e.g. 5 minutes) — likely webhook delivery issues worth investigating.
- Manual "Re-check status" action calling the backend's Telebirr status-poll endpoint for a stuck payment.

**Done when:** a deliberately stalled test payment is visibly flagged and resolvable via the manual re-check action.

---

### #41 · Commission rate configuration
`finance` `config` `ui`

- A settings panel (likely under `app/(dashboard)/settings/finance/page.tsx`) to view/edit the platform commission rate (currently 5% per the backend's cash/Telebirr logic).
- Since commission is read from `fare_rules`/payment logic rather than a single global constant in the current backend design, confirm exact source of truth with the backend team before building edit capability — if it's not yet a clean single config value, this issue ships as **read-only display** first, with edit capability flagged as a backend prerequisite.

**Done when:** the current effective commission rate is accurately displayed; edit capability only shipped once backend exposes a clean config endpoint.

---

## Milestone 7 — Call Center & Operator Tools

### #42 · Call center booking creation — phone-based booking on behalf of a customer
`callcenter` `ui`

- `app/(dashboard)/callcenter/page.tsx`: streamlined single-page form for an operator to take a phone booking — caller phone number, pickup/dropoff (with the same place-search the customer app would use), vehicle type, service type.
- Fare estimate shown live as fields are filled, mirroring the customer app's estimate flow exactly.
- "Create Booking" triggers dispatch immediately, same as a customer-app booking, tagged internally as call-center-originated for reporting purposes.

**Done when:** an operator can complete a full phone booking in under 90 seconds for a familiar route.

---

### #43 · Caller lookup — search existing customer by phone number
`callcenter` `ui`

- Phone-number search field on the call center page (Issue #42) that looks up an existing customer profile and recent booking history before creating a new booking — helps operators recognize repeat callers and resolve "where is my driver" questions quickly.
- If no match: clearly indicate "New customer" and proceed with booking creation, which will create the customer record server-side as the backend already does for first-time bookers.

**Done when:** searching a known test phone number surfaces that customer's last 5 bookings instantly.

---

### #44 · Operator's today view — bookings created by the logged-in operator
`callcenter` `ui`

- `app/(dashboard)/callcenter/my-bookings/page.tsx`: list of bookings the current operator created today, with live status badges.
- Lets an operator follow up on calls without needing access to the full bookings module (which is `ADMIN`-only per the role split in Issue #12).

**Done when:** an operator only ever sees their own created bookings here, never another operator's or the full system list.

---

### #45 · Nearby available drivers panel for call center triage
`callcenter` `ui` `realtime`

- A compact panel on the call center page showing currently available drivers near the caller's pickup location (small embedded map or simple distance-sorted list) — helps an operator set accurate expectations with the caller ("a driver is about 4 minutes away") before confirming the booking.
- Sourced from the same online-drivers data used by the driver live map (Issue #19), scoped to a small radius around the entered pickup point.

**Done when:** the panel updates correctly as the operator changes the pickup location field, before the booking is even submitted.

---

## Milestone 8 — Configuration, Audit & System Health

### #46 · Vehicle types and service areas reference configuration
`config` `ui`

- `app/(dashboard)/settings/vehicles/page.tsx`: read/edit reference list of vehicle types (Boda Boda, Bajaj, Car, Cargo Bajaj, Truck) and their default capacity — mostly static enum-backed data, but exposed for visibility and the occasional capacity tweak.
- Cross-links to fare rules (Issue #26) and service areas (Issue #27) since these three configuration surfaces are tightly related.

**Done when:** vehicle type reference data is visible and editable where the backend supports it, with clear indication of any fields that are enum-fixed and not editable.

---

### #47 · Audit log viewer — every sensitive admin action, filterable and exportable
`audit` `ui` `security`

- `app/(dashboard)/audit/page.tsx`: table consuming `GET /admin/audit-log` — actor, action type, target, timestamp, with before/after diff viewer for configuration changes (fare rules, slot edits, etc.).
- Filters: actor (which admin/operator), action type, target type, date range.
- This view is read-only by design (matches the backend's append-only, non-deletable audit log) — no edit or delete UI should ever be built against this endpoint.

**Done when:** every state-changing action performed elsewhere in this admin app (driver approval, fare edit, slot toggle, force-cancel, complaint resolution) appears correctly in this log with an accurate before/after diff.

---

### #48 · System health panel — backend /health status, queue depths, WebSocket connection count
`ops` `ui` `realtime`

- `app/(dashboard)/settings/system-health/page.tsx`: polls the backend `GET /health` endpoint (Postgres, Redis, disk, memory checks) every 30s, shown as simple green/amber/red status indicators.
- Surfaces BullMQ queue depths and failed-job counts (links into Issue #28's dispatch health panel, generalized here to cover all queues, not just dispatch).
- Link to Bull Board for deep inspection (same pattern as Issue #28).

**Done when:** manually stopping the backend's Redis connection in a test environment causes this panel to show a red status within 30 seconds.

---

### #49 · Notification log — outbound SMS and push notification delivery status
`ops` `ui`

- `app/(dashboard)/settings/notifications/page.tsx`: table of recent outbound notifications (OTP SMS, FCM push for booking events, driver approval messages) with delivery status — helps diagnose "customer says they never got the code" support cases.
- Flag as dependent on a backend logging table if one doesn't yet exist for notification delivery attempts (`notification_log`); if unavailable, ship this issue scoped to whatever subset the backend's `PushNotificationService` and `SmsService` already expose, with the rest noted as a backend follow-up.

**Done when:** a test OTP send is traceable end-to-end from this screen, including success/failure status.

---

### #50 · Multi-language content management for SMS and push notification templates
`config` `ui` `i18n`

- `app/(dashboard)/settings/notification-templates/page.tsx`: edit the text templates used for OTP SMS, approval messages, and key push notifications in Amharic, English, and Anuak — mirrors the driver app's three-language commitment from the platform side.
- Live preview pane per language; placeholder/variable validation (e.g. ensuring `{code}` isn't accidentally removed from an OTP template).

**Done when:** editing the Amharic OTP template and triggering a test OTP send produces SMS text matching the edited template exactly.

---

### #51 · Global search — jump to any driver, booking, or trip by ID/phone/plate
`ui` `dx`

- A `Cmd+K` command palette (shadcn `Command` component) accessible from anywhere in the dashboard — search drivers by name/phone/plate, bookings by booking number, airport trips by ID.
- Debounced search hitting lightweight backend search endpoints (reuse existing list endpoints' `search` query param where available).

**Done when:** typing a known booking number into the command palette and pressing enter navigates directly to that booking's detail page.

---

### #52 · Admin notification bell — in-app alerts for high-priority events
`ui` `realtime`

- Topbar notification bell (Issue #7) wired to real backend/WebSocket events: new driver application, complaint filed, dispatch failure spike, payment webhook failure.
- Unread count badge; dropdown list of recent notifications; click navigates to the relevant detail page and marks as read.

**Done when:** submitting a test driver application causes a notification to appear in the bell dropdown within 5 seconds, without a page refresh.

---

## Milestone 9 — Testing, Security & Production Deployment

### #53 · Component and hook unit tests with Vitest and Testing Library
`testing`

- Install `vitest`, `@testing-library/react`, `@testing-library/jest-dom`, `msw` for API mocking.
- Unit tests for all custom hooks (`useIdleTimer`, `useSocketEvent`, query-key factory functions) and pure utility functions (fare formatting, milliemes↔birr conversion, date range helpers).
- Target 70%+ coverage on `lib/` and `hooks/`.

**Done when:** `npm run test` passes with the target coverage threshold enforced in CI.

---

### #54 · Critical-flow integration tests — driver approval, fare rule edit, force-cancel
`testing`

- Using `msw` to mock the backend API, write integration tests (render full page + simulate interaction) for: approving a pending driver, editing a fare rule, force-cancelling an active booking, resolving a complaint.
- Assert correct API calls fired with correct payloads and correct optimistic UI updates/rollbacks.

**Done when:** all four critical flows pass reliably in CI, including the rollback-on-error path for at least one mutation.

---

### #55 · End-to-end tests with Playwright — full admin login-to-action journeys
`testing`

- Install Playwright. Cover: login → approve a driver → verify status change; login as operator → create call-center booking → verify it appears in "my bookings"; login → edit airport slot → verify change reflected via API.
- Run against a seeded test environment matching the backend's own E2E seed data patterns described in the backend tracker.

**Done when:** all E2E scenarios pass against a fresh seeded test backend, runnable both locally and in CI.

---

### #56 · Security hardening — CSP headers, XSS protection, secure cookie config
`security`

- Configure `next.config.js` security headers: `Content-Security-Policy`, `X-Frame-Options: DENY`, `Strict-Transport-Security`, `X-Content-Type-Options: nosniff`.
- Audit all places rendering backend-sourced strings (driver names, complaint text, audit metadata) for proper escaping — Next.js/React escapes by default, but explicitly review any `dangerouslySetInnerHTML` usage (there should be none).
- NextAuth cookies: `httpOnly`, `secure` (prod), `sameSite: lax`.
- Run `npm audit` and a dependency vulnerability scan in CI; fail build on high/critical findings.

**Done when:** security headers verified present via browser devtools/`securityheaders.com` scan on a deployed preview; `npm audit` gate active in CI.

---

### #57 · Production build, environment config, and deployment pipeline
`release` `infra`

- Configure production deployment target (Vercel recommended for Next.js, or the same VPS as the backend via a Node.js process behind Nginx if keeping everything self-hosted per the backend plan's infra choices — confirm with the team before finalizing).
- Production env vars set: `NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_WS_URL` pointed at production backend, `NEXTAUTH_SECRET` (strong random value, distinct from any dev value), `NEXTAUTH_URL`.
- `.github/workflows/deploy.yml`: build + deploy on push to `main`, with a manual approval gate for production (matches the caution level of the backend's own deploy pipeline).
- Custom domain configured (e.g. `admin.oloni.app`) with SSL.

**Done when:** a merge to `main` triggers a build and, after approval, deploys successfully to the production domain with SSL active.

---

### #58 · Production monitoring — Sentry error tracking and uptime checks
`ops` `monitoring`

- Install `@sentry/nextjs`. Configure for both client and server-side error capture, environment-tagged (`dev`/`prod`).
- Add breadcrumbs for key admin actions (driver approval, force-cancel, fare rule edit) so a crash report carries useful context — same philosophy as the driver app's `AppBlocObserver` → Sentry pipeline.
- UptimeRobot (or equivalent) check on the production admin URL every 5 minutes; alert to the same channel used for backend uptime alerts.

**Done when:** a deliberately thrown test error in a dev-only debug route appears correctly in Sentry with full breadcrumb context.

---

*Total: 58 issues across 9 milestones*
*Build order: Milestones 1–3 establish the foundation and must be completed first. Milestones 4–7 can be parallelised across a small team once Milestone 3 (auth + base dashboard shell) is done, since Bookings, Airport, Finance, and Call Center are largely independent surfaces consuming already-built API layers. Milestones 8–9 run continuously alongside the others but should be finalized before production launch.*

> **Backend dependency note:** several issues above flag a small number of admin-facing endpoints that may not yet exist in `oloni-backend` (service area polygon edit, online-drivers list, complaints admin routes, cash-reconciliation settle action, notification delivery log). These are called out inline at the point of need rather than batched separately, so each frontend issue stays buildable in sequence — confirm endpoint availability with the backend tracker before starting the issue, and file a corresponding backend issue first if missing.
