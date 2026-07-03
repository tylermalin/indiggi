import crypto from 'crypto';
import { sql, ensureSchema } from './_db.js';

const SECRET = process.env.SESSION_SECRET || '';
const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || '').toLowerCase().split(',').map(s => s.trim()).filter(Boolean);
const EDITOR_EMAILS = (process.env.EDITOR_EMAILS || '').toLowerCase().split(',').map(s => s.trim()).filter(Boolean);
const DAY = 24 * 60 * 60 * 1000;

export function roleFor(email) {
  email = (email || '').toLowerCase().trim();
  if (ADMIN_EMAILS.includes(email)) return 'admin';
  if (EDITOR_EMAILS.includes(email)) return 'editor';
  return null;
}

export function hashPassword(pw, salt) {
  salt = salt || crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(pw, salt, 64).toString('hex');
  return { salt, hash };
}
export function verifyPassword(pw, salt, hash) {
  const h = crypto.scryptSync(pw, salt, 64).toString('hex');
  const a = Buffer.from(h, 'hex'), b = Buffer.from(hash, 'hex');
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

export function signToken(payload) {
  const body = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const sig = crypto.createHmac('sha256', SECRET).update(body).digest('base64url');
  return body + '.' + sig;
}
export function verifyToken(tok) {
  if (!tok || !SECRET) return null;
  const [body, sig] = tok.split('.');
  if (!body || !sig) return null;
  const expected = crypto.createHmac('sha256', SECRET).update(body).digest('base64url');
  const a = Buffer.from(sig), b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
  try {
    const p = JSON.parse(Buffer.from(body, 'base64url').toString());
    if (p.exp && Date.now() > p.exp) return null;
    return p;
  } catch { return null; }
}

export function parseCookies(req) {
  const h = req.headers.cookie || '';
  const out = {};
  h.split(';').forEach(c => {
    const i = c.indexOf('=');
    if (i > -1) out[c.slice(0, i).trim()] = decodeURIComponent(c.slice(i + 1).trim());
  });
  return out;
}
export function setSession(res, user) {
  const tok = signToken({ uid: user.id, email: user.email, role: user.role, exp: Date.now() + 30 * DAY });
  res.setHeader('Set-Cookie', `sid=${tok}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=${30 * 24 * 60 * 60}`);
}
export function clearSession(res) {
  res.setHeader('Set-Cookie', `sid=; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=0`);
}
export function getUser(req) {
  return verifyToken(parseCookies(req).sid);
}
// Guard: returns user if authorized (editor or admin), else writes 401 and returns null.
export function requireEditor(req, res) {
  const u = getUser(req);
  if (!u) { res.status(401).json({ error: 'unauthorized' }); return null; }
  return u;
}
export function requireAdmin(req, res) {
  const u = getUser(req);
  if (!u || u.role !== 'admin') { res.status(403).json({ error: 'forbidden' }); return null; }
  return u;
}

export { sql, ensureSchema };
