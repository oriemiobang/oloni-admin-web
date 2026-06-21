/**
 * Oloni Admin — TanStack Query Key Factory
 *
 * Centralised query key definitions. All keys are typed tuples enabling
 * precise cache invalidation, e.g.:
 *   queryClient.invalidateQueries({ queryKey: queryKeys.drivers.all })
 *
 * Convention: keys grow from broad → specific.
 *   drivers.all          → invalidates every driver query
 *   drivers.list(params) → invalidates only a specific filtered list
 *   drivers.detail(id)   → invalidates only that driver's detail
 */

export const queryKeys = {
  // ── Dashboard ──────────────────────────────────────────────────────────
  dashboard: {
    all: ['dashboard'] as const,
    stats: () => ['dashboard', 'stats'] as const,
    tripsPerHour: () => ['dashboard', 'tripsPerHour'] as const,
    noDriverAlerts: () => ['dashboard', 'noDriverAlerts'] as const,
  },

  // ── Drivers ────────────────────────────────────────────────────────────
  drivers: {
    all: ['drivers'] as const,
    list: (params?: Record<string, unknown>) => ['drivers', 'list', params] as const,
    detail: (id: string) => ['drivers', 'detail', id] as const,
    history: (id: string) => ['drivers', 'history', id] as const,
    earnings: (id: string, params?: Record<string, unknown>) =>
      ['drivers', 'earnings', id, params] as const,
    pending: () => ['drivers', 'list', { status: 'PENDING' }] as const,
    online: () => ['drivers', 'online'] as const,
  },

  // ── Bookings ───────────────────────────────────────────────────────────
  bookings: {
    all: ['bookings'] as const,
    list: (params?: Record<string, unknown>) => ['bookings', 'list', params] as const,
    detail: (id: string) => ['bookings', 'detail', id] as const,
    route: (id: string) => ['bookings', 'route', id] as const,
    live: () => ['bookings', 'live'] as const,
    noDriverAlerts: () => ['bookings', 'noDriverAlerts'] as const,
  },

  // ── Fare rules ─────────────────────────────────────────────────────────
  fareRules: {
    all: ['fareRules'] as const,
    list: () => ['fareRules', 'list'] as const,
    detail: (id: string) => ['fareRules', 'detail', id] as const,
  },

  // ── Service areas ──────────────────────────────────────────────────────
  serviceAreas: {
    all: ['serviceAreas'] as const,
    list: () => ['serviceAreas', 'list'] as const,
    detail: (id: string) => ['serviceAreas', 'detail', id] as const,
  },

  // ── Complaints ─────────────────────────────────────────────────────────
  complaints: {
    all: ['complaints'] as const,
    list: (params?: Record<string, unknown>) => ['complaints', 'list', params] as const,
    detail: (id: string) => ['complaints', 'detail', id] as const,
  },

  // ── Airport ────────────────────────────────────────────────────────────
  airport: {
    all: ['airport'] as const,
    slots: {
      all: ['airport', 'slots'] as const,
      list: () => ['airport', 'slots', 'list'] as const,
      detail: (id: string) => ['airport', 'slots', 'detail', id] as const,
    },
    trips: {
      all: ['airport', 'trips'] as const,
      list: (params?: Record<string, unknown>) => ['airport', 'trips', 'list', params] as const,
      detail: (id: string) => ['airport', 'trips', 'detail', id] as const,
    },
    revenue: (params?: Record<string, unknown>) => ['airport', 'revenue', params] as const,
  },

  // ── Finance ────────────────────────────────────────────────────────────
  finance: {
    all: ['finance'] as const,
    revenue: (params?: Record<string, unknown>) => ['finance', 'revenue', params] as const,
    cashReconciliation: (week?: string) => ['finance', 'cashReconciliation', week] as const,
    wallets: (params?: Record<string, unknown>) => ['finance', 'wallets', params] as const,
    telebirr: (params?: Record<string, unknown>) => ['finance', 'telebirr', params] as const,
  },

  // ── Audit ──────────────────────────────────────────────────────────────
  audit: {
    all: ['audit'] as const,
    list: (params?: Record<string, unknown>) => ['audit', 'list', params] as const,
  },

  // ── Health ─────────────────────────────────────────────────────────────
  health: {
    status: () => ['health', 'status'] as const,
    jobs: () => ['health', 'jobs'] as const,
  },

  // ── Notifications ──────────────────────────────────────────────────────
  notifications: {
    log: (params?: Record<string, unknown>) => ['notifications', 'log', params] as const,
    templates: () => ['notifications', 'templates'] as const,
  },

  // ── Call center ────────────────────────────────────────────────────────
  callCenter: {
    customerLookup: (phone: string) => ['callCenter', 'customer', phone] as const,
    myBookings: () => ['callCenter', 'myBookings'] as const,
    nearbyDrivers: (lat: number, lng: number) => ['callCenter', 'nearbyDrivers', lat, lng] as const,
    fareEstimate: (params: Record<string, unknown>) =>
      ['callCenter', 'fareEstimate', params] as const,
  },

  // ── Team ───────────────────────────────────────────────────────────────
  team: {
    all: ['team'] as const,
    list: () => ['team', 'list'] as const,
  },

  // ── Vehicles ───────────────────────────────────────────────────────────
  vehicles: {
    all: ['vehicles'] as const,
    list: () => ['vehicles', 'list'] as const,
  },
} as const;
