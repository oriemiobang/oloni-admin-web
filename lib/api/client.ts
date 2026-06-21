/**
 * Oloni Admin — API Client
 *
 * Thin wrapper over native `fetch` with:
 *  - Authorization: Bearer <token> injected from cookie on every request
 *  - Typed response helper that throws ApiError on non-2xx
 *  - Next.js native fetch caching support (no-store by default for admin data)
 */

// ----- Error type -----

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly code: string,
    message: string,
    public readonly details?: unknown,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// ----- Request options -----

export interface ApiRequestOptions extends Omit<RequestInit, 'body'> {
  body?: unknown;
  /** Override Next.js fetch cache behaviour. Defaults to 'no-store' for all admin requests. */
  cache?: RequestCache;
  /** Next.js revalidation in seconds. Only meaningful for GET requests. */
  revalidate?: number;
}

// ----- Token retrieval -----

/**
 * Reads the admin JWT from a cookie named `oloni_admin_token`.
 * Works in both Server Components (via next/headers cookies()) and
 * Client Components (via document.cookie).
 */
async function getAuthToken(): Promise<string | null> {
  // Server Component context — avoid importing next/headers at module level
  // so client bundles aren't polluted.
  if (typeof window === 'undefined') {
    try {
      const { cookies } = await import('next/headers');
      const store = await cookies();
      return store.get('oloni_admin_token')?.value ?? null;
    } catch {
      // next/headers not available in middleware or edge — fall through
      return null;
    }
  }

  // Client Component context
  const match = document.cookie.match(/(?:^|;\s*)oloni_admin_token=([^;]+)/);
  return match?.[1] ?? null;
}

// ----- Core request helper -----

/**
 * Makes an authenticated API request against the Oloni backend.
 *
 * @param path - Path relative to NEXT_PUBLIC_API_URL (e.g. "/admin/drivers")
 * @param options - Fetch options + optional body (auto-JSON-serialised)
 * @returns Parsed JSON response typed as T
 * @throws ApiError on non-2xx responses
 */
export async function apiRequest<T>(path: string, options: ApiRequestOptions = {}): Promise<T> {
  const { body, cache = 'no-store', revalidate, ...rest } = options;

  const baseUrl = process.env['NEXT_PUBLIC_API_URL'];
  if (!baseUrl) {
    throw new Error('NEXT_PUBLIC_API_URL is not set');
  }

  const token = await getAuthToken();

  const headers = new Headers(rest.headers);
  headers.set('Content-Type', 'application/json');
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const fetchOptions: RequestInit = {
    ...rest,
    headers,
    cache,
    ...(body !== undefined && { body: JSON.stringify(body) }),
    // Next.js fetch extensions
    ...(revalidate !== undefined && {
      next: { revalidate },
    }),
  };

  const url = `${baseUrl}${path}`;
  const response = await fetch(url, fetchOptions);

  if (!response.ok) {
    let errorBody: { message?: string; code?: string; details?: unknown } = {};
    try {
      errorBody = (await response.json()) as typeof errorBody;
    } catch {
      // Body may not be JSON — use status text
    }

    throw new ApiError(
      response.status,
      errorBody.code ?? 'API_ERROR',
      errorBody.message ?? response.statusText,
      errorBody.details,
    );
  }

  // 204 No Content
  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

// ----- Convenience methods -----

export const api = {
  get: <T>(path: string, options?: Omit<ApiRequestOptions, 'method' | 'body'>) =>
    apiRequest<T>(path, { ...options, method: 'GET' }),

  post: <T>(path: string, body: unknown, options?: Omit<ApiRequestOptions, 'method'>) =>
    apiRequest<T>(path, { ...options, method: 'POST', body }),

  put: <T>(path: string, body: unknown, options?: Omit<ApiRequestOptions, 'method'>) =>
    apiRequest<T>(path, { ...options, method: 'PUT', body }),

  patch: <T>(path: string, body: unknown, options?: Omit<ApiRequestOptions, 'method'>) =>
    apiRequest<T>(path, { ...options, method: 'PATCH', body }),

  delete: <T>(path: string, options?: Omit<ApiRequestOptions, 'method' | 'body'>) =>
    apiRequest<T>(path, { ...options, method: 'DELETE' }),
};
