import { sql, ensureSchema, requireEditor } from './_auth.js';

export default async function handler(req, res) {
  const user = requireEditor(req, res);
  if (!user) return;

  try {
    await ensureSchema();
    const total = (await sql`SELECT count(*)::int AS c FROM registrations`).rows[0].c;
    const withEmail = (await sql`SELECT count(*)::int AS c FROM registrations WHERE email IS NOT NULL`).rows[0].c;
    const withHandle = (await sql`SELECT count(*)::int AS c FROM registrations WHERE handle IS NOT NULL`).rows[0].c;
    const byTier = (await sql`SELECT tier, count(*)::int AS c FROM registrations GROUP BY tier`).rows;
    const byDay = (await sql`SELECT to_char(date_trunc('day', created_at), 'YYYY-MM-DD') AS day, count(*)::int AS c
                             FROM registrations GROUP BY 1 ORDER BY 1`).rows;
    const recent = (await sql`SELECT id, created_at, email, handle, tier, referral
                              FROM registrations ORDER BY created_at DESC LIMIT 200`).rows;
    return res.status(200).json({ ok: true, total, withEmail, withHandle, byTier, byDay, recent });
  } catch (err) {
    console.error('stats_error', err && err.message);
    return res.status(500).json({ error: 'db_error', message: err && err.message });
  }
}
