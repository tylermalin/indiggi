import { sql, ensureSchema, roleFor, hashPassword, verifyPassword, setSession } from '../_auth.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'method_not_allowed' });
  if (!process.env.SESSION_SECRET) return res.status(503).json({ error: 'auth_not_configured' });

  let body = req.body;
  if (typeof body === 'string') { try { body = JSON.parse(body || '{}'); } catch { body = {}; } }
  body = body || {};
  const email = (body.email || '').trim().toLowerCase();
  const password = (body.password || '').toString();

  if (!email || !password) return res.status(400).json({ error: 'email_and_password_required' });
  if (password.length < 8) return res.status(400).json({ error: 'password_too_short' });

  const role = roleFor(email);
  if (!role) return res.status(403).json({ error: 'not_invited' });

  try {
    await ensureSchema();
    const found = await sql`SELECT id, email, password_hash, salt, role FROM users WHERE lower(email) = ${email}`;
    let user;
    if (found.rows.length === 0) {
      // First login = claim the account with this password.
      const { salt, hash } = hashPassword(password);
      const ins = await sql`INSERT INTO users (email, password_hash, salt, role, last_login)
                            VALUES (${email}, ${hash}, ${salt}, ${role}, now()) RETURNING id, email, role`;
      user = ins.rows[0];
    } else {
      const u = found.rows[0];
      if (!verifyPassword(password, u.salt, u.password_hash)) {
        return res.status(401).json({ error: 'wrong_password' });
      }
      await sql`UPDATE users SET last_login = now(), role = ${role} WHERE id = ${u.id}`;
      user = { id: u.id, email: u.email, role };
    }
    setSession(res, user);
    return res.status(200).json({ ok: true, user: { email: user.email, role: user.role } });
  } catch (err) {
    console.error('login_error', err && err.message);
    return res.status(500).json({ error: 'server_error' });
  }
}
