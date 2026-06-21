'use client';

import { useEffect, useRef } from 'react';
import {
  getSocket,
  type ServerToClientEvents,
  type SocketEventName,
} from '@/lib/realtime/socket-client';

type EventCallback<K extends SocketEventName> = ServerToClientEvents[K];

/**
 * Subscribes to a Socket.io event and auto-unsubscribes on cleanup.
 *
 * @param event - The event name (e.g. 'driver:location')
 * @param handler - Callback invoked with the typed payload on each event
 * @param enabled - Set to false to pause the subscription (default: true)
 *
 * @example
 * useSocketEvent('driver:location', (payload) => {
 *   setDriverPosition(payload.driverId, { lat: payload.lat, lng: payload.lng });
 * });
 */
export function useSocketEvent<K extends SocketEventName>(
  event: K,
  handler: EventCallback<K>,
  enabled = true,
): void {
  // Keep a stable ref to the handler to avoid re-subscribing on every render
  const handlerRef = useRef<EventCallback<K>>(handler);

  useEffect(() => {
    handlerRef.current = handler;
  }, [handler]);

  useEffect(() => {
    if (!enabled) return;

    const socket = getSocket();

    // Stable wrapper that delegates to the latest handler ref
    const stableHandler = ((...args: Parameters<EventCallback<K>>) => {
      (handlerRef.current as (...a: Parameters<EventCallback<K>>) => void)(...args);
    }) as EventCallback<K>;

    // Use type assertion to bypass Socket.io strict generic inference issues
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    socket.on(event as any, stableHandler as any);

    return () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      socket.off(event as any, stableHandler as any);
    };
  }, [event, enabled]);
}
