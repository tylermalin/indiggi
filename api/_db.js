import { sql } from '@vercel/postgres';

// Creates all tables + indexes if they don't exist. Idempotent + cheap.
export async function ensureSchema() {
  await sql`CREATE TABLE IF NOT EXISTS registrations (
    id BIGSERIAL PRIMARY KEY,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    email TEXT, handle TEXT, tier TEXT NOT NULL DEFAULT 'member',
    referral TEXT, ip TEXT, user_agent TEXT
  )`;
  await sql`CREATE UNIQUE INDEX IF NOT EXISTS reg_email_uniq ON registrations (lower(email)) WHERE email IS NOT NULL`;
  await sql`CREATE INDEX IF NOT EXISTS reg_handle_idx ON registrations (handle)`;
  await sql`CREATE INDEX IF NOT EXISTS reg_created_idx ON registrations (created_at)`;

  await sql`CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    email TEXT NOT NULL,
    password_hash TEXT NOT NULL,
    salt TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'editor',
    last_login TIMESTAMPTZ
  )`;
  await sql`CREATE UNIQUE INDEX IF NOT EXISTS users_email_uniq ON users (lower(email))`;

  // editable site content: key -> value, with a type hint (text|html|image|bool)
  await sql`CREATE TABLE IF NOT EXISTS content (
    key TEXT PRIMARY KEY,
    value TEXT,
    type TEXT NOT NULL DEFAULT 'text',
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_by TEXT
  )`;

  await sql`CREATE TABLE IF NOT EXISTS blog_posts (
    id BIGSERIAL PRIMARY KEY,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    slug TEXT NOT NULL,
    title TEXT NOT NULL,
    category TEXT,
    excerpt TEXT,
    body TEXT,
    cover_url TEXT,
    status TEXT NOT NULL DEFAULT 'draft',
    published_at TIMESTAMPTZ,
    author TEXT
  )`;
  await sql`CREATE UNIQUE INDEX IF NOT EXISTS blog_slug_uniq ON blog_posts (slug)`;

  await sql`CREATE TABLE IF NOT EXISTS media (
    id BIGSERIAL PRIMARY KEY,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    url TEXT NOT NULL,
    filename TEXT,
    uploaded_by TEXT
  )`;
}

export { sql };
