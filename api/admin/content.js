import { sql, ensureSchema, requireEditor } from '../_auth.js';

export default async function handler(req, res) {
  const user = requireEditor(req, res);
  if (!user) return;

  try {
    await ensureSchema();

    if (req.method === 'GET') {
      const rows = (await sql`SELECT key, value, type, updated_at, updated_by FROM content ORDER BY key`).rows;
      return res.status(200).json({ ok: true, items: rows });
    }

    if (req.method === 'PUT' || req.method === 'POST') {
      let body = req.body;
      if (typeof body === 'string') { try { body = JSON.parse(body || '{}'); } catch { body = {}; } }
      body = body || {};
      // Accept a single {key,value,type} or a batch {items:[...]}
      const items = Array.isArray(body.items) ? body.items : [{ key: body.key, value: body.value, type: body.type }];
      for (const it of items) {
        if (!it || !it.key) continue;
        const key = String(it.key).slice(0, 120);
        const value = it.value == null ? null : String(it.value);
        const type = ['text', 'html', 'image', 'bool'].includes(it.type) ? it.type : 'text';
        await sql`INSERT INTO content (key, value, type, updated_at, updated_by)
                  VALUES (${key}, ${value}, ${type}, now(), ${user.email})
                  ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, type = EXCLUDED.type, updated_at = now(), updated_by = ${user.email}`;
      }
      return res.status(200).json({ ok: true });
    }

    return res.status(405).json({ error: 'method_not_allowed' });
  } catch (err) {
    console.error('content_error', err && err.message);
    return res.status(500).json({ error: 'server_error', message: err && err.message });
  }
}
