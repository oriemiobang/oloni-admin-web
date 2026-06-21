/**
 * Oloni Admin — Navigation Config
 * Single source of truth for sidebar nav items.
 */

export interface NavItem {
  label: string;
  href: string;
  /** Lucide icon name — resolved in SidebarNav component */
  icon: string;
  /** Badge showing a live count (e.g. pending approvals) */
  badgeKey?: string;
  /** Only visible to ADMIN role */
  adminOnly?: boolean;
}

export const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', href: '/dashboard', icon: 'LayoutDashboard' },
  {
    label: 'Drivers',
    href: '/drivers',
    icon: 'Car',
    badgeKey: 'pendingApprovals',
    adminOnly: true,
  },
  { label: 'Bookings', href: '/bookings', icon: 'BookOpen' },
  { label: 'Live Ops', href: '/bookings/live', icon: 'Radio' },
  { label: 'Airport', href: '/airport', icon: 'Plane', adminOnly: true },
  { label: 'Finance', href: '/finance', icon: 'Banknote', adminOnly: true },
  { label: 'Call Center', href: '/callcenter', icon: 'PhoneCall' },
  { label: 'Audit Log', href: '/audit', icon: 'ScrollText', adminOnly: true },
  { label: 'Settings', href: '/settings', icon: 'Settings', adminOnly: true },
];
