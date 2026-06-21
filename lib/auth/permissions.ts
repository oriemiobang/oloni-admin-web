/**
 * Oloni Admin — Role-based Permission Map
 *
 * Single source of truth consumed by both:
 *  - middleware.ts (server-side route protection)
 *  - Client UI (conditional rendering of admin-only actions)
 *
 * Roles:
 *  ADMIN    → full access to every route
 *  OPERATOR → restricted to /callcenter only
 */

export type AdminRole = 'ADMIN' | 'OPERATOR';

/**
 * Routes accessible by OPERATOR role.
 * ADMIN always has access to everything — not listed here.
 */
export const OPERATOR_ALLOWED_ROUTES = ['/callcenter', '/callcenter/my-bookings'] as const;

export type OperatorRoute = (typeof OPERATOR_ALLOWED_ROUTES)[number];

/**
 * Returns true if the given role can access the given pathname.
 */
export function canAccess(role: AdminRole, pathname: string): boolean {
  if (role === 'ADMIN') return true;
  // OPERATOR: allow /callcenter and its sub-paths
  return OPERATOR_ALLOWED_ROUTES.some((allowed) => pathname.startsWith(allowed));
}

/**
 * Returns the redirect target for an OPERATOR who hits a forbidden route.
 */
export const OPERATOR_FALLBACK_ROUTE = '/callcenter' as const;

/**
 * Returns true if the action requires ADMIN role.
 * Used for conditional rendering of action buttons.
 */
export const ADMIN_ONLY_ACTIONS = [
  'driver:approve',
  'driver:reject',
  'driver:suspend',
  'booking:force-cancel',
  'fareRule:edit',
  'slot:toggle',
  'slot:edit',
  'serviceArea:edit',
  'team:invite',
  'team:deactivate',
] as const;

export type AdminOnlyAction = (typeof ADMIN_ONLY_ACTIONS)[number];

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function requiresAdmin(_action: AdminOnlyAction): true {
  return true;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function canPerform(role: AdminRole, _action: AdminOnlyAction): boolean {
  return role === 'ADMIN';
}
