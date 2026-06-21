/**
 * Oloni Admin — API Endpoints
 *
 * Every backend route as a typed constant, mirroring the oloni-backend NestJS route map.
 * Import from here — never hardcode paths in components or hooks.
 *
 * Parameterised routes are functions that return the final path string.
 * Example: ENDPOINTS.drivers.detail('abc123') → '/admin/drivers/abc123'
 */

const ENDPOINTS = {
  // ── Auth ────────────────────────────────────────────────────────────────
  auth: {
    login: '/auth/admin/login',
    logout: '/auth/logout',
    refresh: '/auth/token/refresh',
    me: '/auth/me',
  },

  // ── Admin team ──────────────────────────────────────────────────────────
  team: {
    list: '/admin/team',
    invite: '/admin/team',
    deactivate: (id: string) => `/admin/team/${id}/deactivate` as const,
  },

  // ── Drivers ─────────────────────────────────────────────────────────────
  drivers: {
    list: '/admin/drivers',
    online: '/admin/drivers/online',
    detail: (id: string) => `/admin/drivers/${id}` as const,
    approve: (id: string) => `/admin/drivers/${id}/approve` as const,
    reject: (id: string) => `/admin/drivers/${id}/reject` as const,
    suspend: (id: string) => `/admin/drivers/${id}/suspend` as const,
    history: (id: string) => `/admin/drivers/${id}/history` as const,
    earnings: (id: string) => `/admin/drivers/${id}/earnings` as const,
  },

  // ── Bookings ─────────────────────────────────────────────────────────────
  bookings: {
    list: '/admin/bookings',
    export: '/admin/bookings/export',
    detail: (id: string) => `/admin/bookings/${id}` as const,
    cancel: (id: string) => `/admin/bookings/${id}/cancel` as const,
    route: (id: string) => `/admin/bookings/${id}/route` as const,
    live: '/admin/bookings/live',
  },

  // ── Fare rules ───────────────────────────────────────────────────────────
  fareRules: {
    list: '/fare-rules',
    detail: (id: string) => `/admin/fare-rules/${id}` as const,
    update: (id: string) => `/admin/fare-rules/${id}` as const,
  },

  // ── Service areas ────────────────────────────────────────────────────────
  serviceAreas: {
    list: '/admin/service-areas',
    detail: (id: string) => `/admin/service-areas/${id}` as const,
    update: (id: string) => `/admin/service-areas/${id}` as const,
  },

  // ── Complaints ───────────────────────────────────────────────────────────
  complaints: {
    list: '/admin/complaints',
    detail: (id: string) => `/admin/complaints/${id}` as const,
    resolve: (id: string) => `/admin/complaints/${id}/resolve` as const,
  },

  // ── Airport ──────────────────────────────────────────────────────────────
  airport: {
    slots: {
      list: '/admin/airport/slots',
      create: '/admin/airport/slots',
      update: (id: string) => `/admin/airport/slots/${id}` as const,
      toggle: (id: string) => `/admin/airport/slots/${id}/toggle` as const,
    },
    trips: {
      list: '/admin/airport/trips',
      detail: (id: string) => `/admin/airport/trips/${id}` as const,
      assignDriver: (id: string) => `/admin/airport/trips/${id}/assign-driver` as const,
    },
    revenue: '/admin/airport/revenue',
  },

  // ── Finance ──────────────────────────────────────────────────────────────
  finance: {
    revenue: '/admin/finance/revenue',
    revenueExport: '/admin/finance/revenue/export',
    cashReconciliation: '/admin/finance/cash-reconciliation',
    settleCash: (driverId: string) =>
      `/admin/finance/cash-reconciliation/${driverId}/settle` as const,
    wallets: '/admin/finance/wallets',
    telebirr: '/admin/finance/telebirr',
    telebirrRecheck: (paymentId: string) => `/admin/finance/telebirr/${paymentId}/recheck` as const,
  },

  // ── Dashboard ────────────────────────────────────────────────────────────
  dashboard: {
    stats: '/admin/dashboard/stats',
    tripsPerHour: '/admin/dashboard/trips-per-hour',
    noDriverAlerts: '/admin/dashboard/no-driver-alerts',
  },

  // ── Jobs / Dispatch health ────────────────────────────────────────────────
  jobs: {
    failed: '/admin/jobs/failed',
    retry: (id: string) => `/admin/jobs/${id}/retry` as const,
  },

  // ── Audit log ────────────────────────────────────────────────────────────
  audit: {
    list: '/admin/audit-log',
  },

  // ── System health ────────────────────────────────────────────────────────
  health: {
    status: '/health',
  },

  // ── Notifications ────────────────────────────────────────────────────────
  notifications: {
    log: '/admin/notifications/log',
    templates: '/admin/notifications/templates',
    updateTemplate: (id: string) => `/admin/notifications/templates/${id}` as const,
  },

  // ── Call center ──────────────────────────────────────────────────────────
  callCenter: {
    createBooking: '/admin/callcenter/bookings',
    lookupCustomer: (phone: string) =>
      `/admin/callcenter/customers?phone=${encodeURIComponent(phone)}` as const,
    myBookings: '/admin/callcenter/my-bookings',
    fareEstimate: '/admin/callcenter/fare-estimate',
    nearbyDrivers: '/admin/callcenter/nearby-drivers',
  },

  // ── Vehicles ─────────────────────────────────────────────────────────────
  vehicles: {
    list: '/admin/vehicles',
    update: (id: string) => `/admin/vehicles/${id}` as const,
  },
} as const;

export { ENDPOINTS };
