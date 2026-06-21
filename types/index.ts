/**
 * Oloni Admin — Shared TypeScript Types
 *
 * Canonical type definitions that mirror the NestJS DTO shape.
 * Keep in sync with the backend when contracts change.
 */

// ── Pagination ──────────────────────────────────────────────────────────────

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// ── Enums ───────────────────────────────────────────────────────────────────

export type DriverStatus = 'PENDING' | 'ACTIVE' | 'SUSPENDED' | 'REJECTED';
export type VehicleType = 'BODA_BODA' | 'BAJAJ' | 'CAR' | 'CARGO';
export type BookingStatus =
  | 'PENDING'
  | 'DRIVER_ASSIGNED'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'NO_DRIVER';
export type BookingType = 'CITY' | 'AIRPORT_PICKUP' | 'AIRPORT_DROPOFF' | 'CARGO';
export type PaymentMethod = 'CASH' | 'TELEBIRR' | 'WALLET';
export type AdminRole = 'ADMIN' | 'OPERATOR';

// ── Driver ──────────────────────────────────────────────────────────────────

export interface Driver {
  id: string;
  fullName: string;
  phone: string;
  vehicleType: VehicleType;
  plateNumber: string;
  status: DriverStatus;
  isOnline: boolean;
  totalTrips: number;
  rating: number | null;
  walletBalanceEtb: number;
  cashBalanceEtb: number;
  createdAt: string;
  approvedAt: string | null;
  licenseUrl: string | null;
  photoUrl: string | null;
}

export interface DriverLocation {
  driverId: string;
  lat: number;
  lng: number;
  heading?: number;
  updatedAt: string;
}

// ── Booking ──────────────────────────────────────────────────────────────────

export interface Booking {
  id: string;
  type: BookingType;
  status: BookingStatus;
  customerId: string;
  customerName: string;
  customerPhone: string;
  driverId: string | null;
  driverName: string | null;
  pickupAddress: string;
  pickupLat: number;
  pickupLng: number;
  destinationAddress: string | null;
  destinationLat: number | null;
  destinationLng: number | null;
  fareEstimateEtb: number;
  finalFareEtb: number | null;
  paymentMethod: PaymentMethod;
  isPaid: boolean;
  createdAt: string;
  completedAt: string | null;
  cancelledAt: string | null;
  cancellationReason: string | null;
}

// ── Airport ──────────────────────────────────────────────────────────────────

export interface AirportSlot {
  id: string;
  date: string; // ISO date YYYY-MM-DD
  departureTime: string; // HH:mm
  arrivalTime: string;
  maxSeats: number;
  bookedSeats: number;
  priceEtb: number;
  isActive: boolean;
  driverId: string | null;
  vehicleId: string | null;
}

export interface AirportTrip {
  id: string;
  slotId: string;
  slot: AirportSlot;
  driverId: string | null;
  vehicleId: string | null;
  passengers: AirportPassenger[];
  status: 'SCHEDULED' | 'CONFIRMED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  createdAt: string;
}

export interface AirportPassenger {
  id: string;
  fullName: string;
  phone: string;
  seatNumber: number;
  paidAt: string | null;
  fareEtb: number | null;
}

// ── Finance ──────────────────────────────────────────────────────────────────

export interface RevenueStats {
  totalEtb: number;
  platformFeeEtb: number;
  driverEarningsEtb: number;
  totalTrips: number;
  period: 'today' | 'week' | 'month';
}

export interface CashReconciliation {
  driverId: string;
  driverName: string;
  phone: string;
  pendingCashEtb: number;
  lastSettledAt: string | null;
}

export interface Wallet {
  driverId: string;
  driverName: string;
  balanceEtb: number;
  lastTransactionAt: string | null;
}

export interface TelebirrTransaction {
  id: string;
  bookingId: string;
  amount: number;
  status: 'PENDING' | 'SUCCESS' | 'FAILED';
  telebirrRef: string | null;
  createdAt: string;
}

// ── Audit ─────────────────────────────────────────────────────────────────────

export interface AuditLogEntry {
  id: string;
  adminId: string;
  adminName: string;
  action: string;
  targetType: string;
  targetId: string;
  reason: string | null;
  metadata: Record<string, unknown> | null;
  createdAt: string;
}

// ── Admin User ────────────────────────────────────────────────────────────────

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: AdminRole;
  isActive: boolean;
  createdAt: string;
}

// ── Dashboard ─────────────────────────────────────────────────────────────────

export interface DashboardStats {
  activeDrivers: number;
  onlineDrivers: number;
  pendingApprovals: number;
  todayBookings: number;
  todayRevenue: number;
  completedToday: number;
  cancelledToday: number;
  noDriverAlerts: number;
  activeAirportTrips: number;
}
