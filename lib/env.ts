/**
 * Oloni Admin — Environment Variable Validation
 *
 * Validates all required env vars at startup using Zod.
 * Crashes immediately with a clear message if any required var is missing.
 *
 * Usage: import '@/lib/env' in app/layout.tsx or next.config.ts
 *        — or call validateEnv() explicitly in server code.
 */

import { z } from 'zod';

const envSchema = z.object({
  // ── Public (exposed to client bundle) ───────────────────────────────────
  NEXT_PUBLIC_API_URL: z
    .string()
    .url('NEXT_PUBLIC_API_URL must be a valid URL (e.g. http://localhost:3000/api)'),
  NEXT_PUBLIC_WS_URL: z
    .string()
    .url('NEXT_PUBLIC_WS_URL must be a valid URL (e.g. http://localhost:3000)'),

  // ── Server-only ──────────────────────────────────────────────────────────
  NEXTAUTH_SECRET: z
    .string()
    .min(
      32,
      'NEXTAUTH_SECRET must be at least 32 characters — generate with: openssl rand -base64 32',
    ),
  NEXTAUTH_URL: z.string().url('NEXTAUTH_URL must be a valid URL (e.g. http://localhost:3001)'),

  // ── Optional ─────────────────────────────────────────────────────────────
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
});

export type Env = z.infer<typeof envSchema>;

/**
 * Validates and returns parsed env vars.
 * Call at startup — throws a human-readable error on any missing/invalid var.
 */
export function validateEnv(): Env {
  const result = envSchema.safeParse({
    NEXT_PUBLIC_API_URL: process.env['NEXT_PUBLIC_API_URL'],
    NEXT_PUBLIC_WS_URL: process.env['NEXT_PUBLIC_WS_URL'],
    NEXTAUTH_SECRET: process.env['NEXTAUTH_SECRET'],
    NEXTAUTH_URL: process.env['NEXTAUTH_URL'],
    NODE_ENV: process.env['NODE_ENV'],
  });

  if (!result.success) {
    const errors = result.error.issues
      .map((e) => `  ✗ ${e.path.join('.')}: ${e.message}`)
      .join('\n');
    throw new Error(
      `\n\n❌  Oloni Admin — Missing or invalid environment variables:\n${errors}\n\n` +
        `  → Copy .env.example to .env.local and fill in the values.\n`,
    );
  }

  return result.data;
}

// Auto-validate on import in server context
// (Skipped in Edge Runtime where process.env may be unavailable)
let env: Env;
try {
  env = validateEnv();
} catch (err) {
  if (process.env['NODE_ENV'] !== 'test') {
    console.error((err as Error).message);
    process.exit(1);
  }
  env = {} as Env; // Allow tests to import without crashing
}

export { env };
