'use client';

import * as React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

/**
 * Create a stable QueryClient instance with Oloni-tuned defaults:
 *  - staleTime: 30s  → fresh data for 30 seconds, no unnecessary refetches
 *  - retry: 1        → one automatic retry on failure (not for 401/403/404)
 *  - gcTime: 5m      → keep unused cache entries for 5 minutes
 */
function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30 * 1000,
        gcTime: 5 * 60 * 1000,
        retry: (failureCount, error) => {
          // Never retry auth errors or not-found errors
          if (error instanceof Error && 'status' in error) {
            const status = (error as { status: number }).status;
            if (status === 401 || status === 403 || status === 404) return false;
          }
          return failureCount < 1;
        },
        refetchOnWindowFocus: true,
        refetchOnReconnect: true,
      },
      mutations: {
        retry: 0,
      },
    },
  });
}

// Singleton for client-side — avoids recreating on every render
let browserQueryClient: QueryClient | undefined;

function getQueryClient() {
  if (typeof window === 'undefined') {
    // Server: always create a new client (no singleton needed)
    return makeQueryClient();
  }
  // Browser: reuse the singleton
  if (!browserQueryClient) {
    browserQueryClient = makeQueryClient();
  }
  return browserQueryClient;
}

interface ProvidersProps {
  children: React.ReactNode;
}

/**
 * Root providers component — wraps the entire app.
 * Must be a Client Component so QueryClientProvider can use React context.
 * Place in app/layout.tsx beneath the <body> tag.
 */
export function Providers({ children }: ProvidersProps) {
  /**
   * NOTE: Avoid useState for the QueryClient in the App Router.
   * Using a module-level singleton (getQueryClient) prevents the client
   * from being recreated on every Providers render during hydration.
   */
  const queryClient = getQueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-left" />
    </QueryClientProvider>
  );
}
