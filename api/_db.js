import { sql } from '@vercel/postgres';

// Creates the registrations table + indexes if they don't exist.
// Idempotent and cheap — safe to call on every request.
export async function ensureSchema() {
  await sql`CREATE TABLE IF NOT EXISTS registrations (
    id BIGSERIAL PRIMARY KEY,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    email TEXT,
    handle TEXT,
    tier TEXT NOT NULL DEFAULT 'member',
    referral TEXT,
    ip TEXT,
    user_agent TEXT
  )`;
  await sql`CREATE UNIQUE INDEX IF NOT EXISTS reg_email_uniq ON registrations (lower(email)) WHERE email IS NOT NULL`;
  await sql`CREATE INDEX IF NOT EXISTS reg_handle_idx ON registrations (handle)`;
  await sql`CREATE INDEX IF NOT EXISTS reg_created_idx ON registrations (created_at)`;
}

export { sql };
