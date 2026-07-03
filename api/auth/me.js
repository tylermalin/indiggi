import { getUser } from '../_auth.js';

export default async function handler(req, res) {
  const u = getUser(req);
  if (!u) return res.status(401).json({ error: 'unauthorized' });
  return res.status(200).json({ ok: true, user: { email: u.email, role: u.role } });
}
