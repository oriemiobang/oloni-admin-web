/**
 * Oloni Admin — Socket.io Singleton Client
 *
 * A single Socket.io connection shared across the entire admin app.
 * Authenticated with the admin JWT from the `oloni_admin_token` cookie.
 *
 * Usage:
 *   import { getSocket, disconnectSocket } from '@/lib/realtime/socket-client'
 *
 *   // On dashboard mount:
 *   const socket = getSocket()
 *
 *   // On logout / unmount:
 *   disconnectSocket()
 */

import { io, type Socket } from 'socket.io-client';

// ── Event payload types ────────────────────────────────────────────────────

export interface BookingStatusPayload {
  bookingId: string;
  status: 'PENDING' | 'DRIVER_ASSIGNED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'NO_DRIVER';
  driverId?: string;
  updatedAt: string;
}

export interface DriverLocationPayload {
  driverId: string;
  lat: number;
  lng: number;
  heading?: number;
  speed?: number; // km/h
  timestamp: string;
}

export interface AirportSeatBookedPayload {
  tripId: string;
  slotId: string;
  seatNumber: number;
  passengerName: string;
  bookedAt: string;
}

export interface AirportTripConfirmedPayload {
  tripId: string;
  slotId: string;
  driverId: string;
  vehicleId: string;
  confirmedAt: string;
}

export interface AirportDropoffFarePayload {
  tripId: string;
  passengerId: string;
  fareEtb: number; // in ETB (not milliemes)
  paidAt: string;
}

/** Union of all event → payload mappings for type-safe subscriptions */
export interface ServerToClientEvents {
  'booking:status': (payload: BookingStatusPayload) => void;
  'driver:location': (payload: DriverLocationPayload) => void;
  'airport:seat_booked': (payload: AirportSeatBookedPayload) => void;
  'airport:trip_confirmed': (payload: AirportTripConfirmedPayload) => void;
  'airport:dropoff_fare': (payload: AirportDropoffFarePayload) => void;
}

export type SocketEventName = keyof ServerToClientEvents;

// ── Singleton ──────────────────────────────────────────────────────────────

let socketInstance: Socket<ServerToClientEvents> | null = null;

/**
 * Returns the shared socket instance, creating it on first call.
 * The socket connects using the JWT from the `oloni_admin_token` cookie.
 */
export function getSocket(): Socket<ServerToClientEvents> {
  if (socketInstance?.connected) {
    return socketInstance;
  }

  const wsUrl = process.env['NEXT_PUBLIC_WS_URL'];
  if (!wsUrl) {
    throw new Error('NEXT_PUBLIC_WS_URL is not set');
  }

  // Read JWT from cookie (client-side only)
  const token =
    typeof document !== 'undefined'
      ? (document.cookie.match(/(?:^|;\s*)oloni_admin_token=([^;]+)/)?.[1] ?? '')
      : '';

  // Append /admin namespace to the URL
  const adminWsUrl = wsUrl.endsWith('/') ? `${wsUrl}admin` : `${wsUrl}/admin`;

  socketInstance = io(adminWsUrl, {
    path: '/socket.io',
    auth: { token },
    transports: ['websocket', 'polling'],
    reconnection: true,
    reconnectionAttempts: 10,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 10000,
    autoConnect: true,
  }) as Socket<ServerToClientEvents>;

  // Dev logging
  if (process.env.NODE_ENV === 'development') {
    socketInstance.on('connect', () => console.info('[socket] connected', socketInstance?.id));
    socketInstance.on('disconnect', (reason) => console.info('[socket] disconnected', reason));
    socketInstance.on('connect_error', (err) =>
      console.warn('[socket] connect_error', err.message),
    );
  }

  return socketInstance;
}

/**
 * Gracefully disconnects and clears the singleton.
 * Call on logout or app teardown.
 */
export function disconnectSocket(): void {
  if (socketInstance) {
    socketInstance.disconnect();
    socketInstance = null;
  }
}

/**
 * Re-authenticates the socket after a token refresh.
 * Disconnects the old connection and creates a fresh one.
 */
export function reconnectSocket(): Socket<ServerToClientEvents> {
  disconnectSocket();
  return getSocket();
}
