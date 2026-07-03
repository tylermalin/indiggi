import { put } from '@vercel/blob';
import { sql, ensureSchema, requireEditor } from '../_auth.js';

// Accepts JSON { filename, dataUrl } where dataUrl is a base64 data: URL.
// Stores in Vercel Blob (public) and records the URL. Good up to ~4MB per image.
export default async function handler(req, res) {
  const user = requireEditor(req, res);
  if (!user) return;
  if (req.method !== 'POST') return res.status(405).json({ error: 'method_not_allowed' });
  if (!process.env.BLOB_READ_WRITE_TOKEN) return res.status(503).json({ error: 'blob_not_configured' });

  let body = req.body;
  if (typeof body === 'string') { try { body = JSON.parse(body || '{}'); } catch { body = {}; } }
  body = body || {};

  const dataUrl = body.dataUrl || '';
  const m = /^data:([^;]+);base64,(.+)$/s.exec(dataUrl);
  if (!m) return res.status(400).json({ error: 'invalid_data_url' });
  const contentType = m[1];
  const buffer = Buffer.from(m[2], 'base64');
  if (buffer.length > 6 * 1024 * 1024) return res.status(413).json({ error: 'too_large' });

  const ext = (contentType.split('/')[1] || 'bin').replace(/[^a-z0-9]/gi, '');
  const safe = (body.filename || 'image').toString().toLowerCase().replace(/[^a-z0-9._-]/g, '-').slice(0, 40);
  const key = `uploads/${Date.now()}-${safe}.${ext}`;

  try {
    const blob = await put(key, buffer, { access: 'public', contentType });
    try { await ensureSchema(); await sql`INSERT INTO media (url, filename, uploaded_by) VALUES (${blob.url}, ${safe}, ${user.email})`; } catch {}
    return res.status(200).json({ ok: true, url: blob.url });
  } catch (err) {
    console.error('upload_error', err && err.message);
    return res.status(500).json({ error: 'upload_failed', message: err && err.message });
  }
}
