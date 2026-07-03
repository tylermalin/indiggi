import { sql, ensureSchema } from './_db.js';

const TIERS = ['member', 'insider', 'founding'];

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'method_not_allowed' });

  // Parse body (Vercel auto-parses JSON, but be defensive)
  let body = req.body;
  if (typeof body === 'string') { try { body = JSON.parse(body || '{}'); } catch { body = {}; } }
  body = body || {};

  // Honeypot — bots fill hidden fields
  if (body.website) return res.status(200).json({ ok: true });

  const email = (body.email || '').trim().toLowerCase().slice(0, 160) || null;
  const handle = (body.handle || '').trim().toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 20) || null;
  const tier = TIERS.includes(body.tier) ? body.tier : 'member';
  const referral = (body.referral || '').toString().slice(0, 120) || null;

  if (!email && !handle) return res.status(400).json({ error: 'email_or_handle_required' });
  if (email && !/.+@.+\..+/.test(email)) return res.status(400).json({ error: 'invalid_email' });

  const ip = (req.headers['x-forwarded-for'] || '').toString().split(',')[0] || null;
  const ua = (req.headers['user-agent'] || '').toString().slice(0, 300) || null;

  try {
    await ensureSchema();
    try {
      await sql`INSERT INTO registrations (email, handle, tier, referral, ip, user_agent)
                VALUES (${email}, ${handle}, ${tier}, ${referral}, ${ip}, ${ua})`;
    } catch (err) {
      // Duplicate email → update the existing row instead
      if (err && err.code === '23505' && email) {
        await sql`UPDATE registrations
                  SET handle = COALESCE(${handle}, handle), tier = ${tier}, referral = COALESCE(${referral}, referral)
                  WHERE lower(email) = ${email}`;
      } else {
        throw err;
      }
    }
    return res.status(200).json({ ok: true });
  } catch (err) {
    // Never block the user's UX (e.g. DB not provisioned yet). Log for us.
    console.error('register_error', err && err.message);
    return res.status(200).json({ ok: true, note: 'queued' });
  }
}
