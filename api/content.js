import { sql, ensureSchema } from './_db.js';

// Public: returns the map of edited content { key: value } for the live site to hydrate.
export default async function handler(req, res) {
  try {
    await ensureSchema();
    const rows = (await sql`SELECT key, value FROM content`).rows;
    const map = {};
    rows.forEach(r => { map[r.key] = r.value; });
    res.setHeader('Cache-Control', 's-maxage=30, stale-while-revalidate=300');
    return res.status(200).json({ ok: true, content: map });
  } catch (err) {
    // If DB isn't connected yet, just return empty so the site uses its default copy.
    return res.status(200).json({ ok: true, content: {} });
  }
}
