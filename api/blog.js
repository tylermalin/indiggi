import { sql, ensureSchema } from './_db.js';

// Public blog reader. ?slug=xyz for one post, otherwise a list of published posts.
export default async function handler(req, res) {
  try {
    await ensureSchema();
    const slug = req.query && req.query.slug;
    if (slug) {
      const r = await sql`SELECT slug, title, category, excerpt, body, cover_url, published_at
                          FROM blog_posts WHERE slug = ${String(slug)} AND status = 'published'`;
      if (r.rows.length === 0) return res.status(404).json({ error: 'not_found' });
      res.setHeader('Cache-Control', 's-maxage=30, stale-while-revalidate=300');
      return res.status(200).json({ ok: true, post: r.rows[0] });
    }
    const rows = (await sql`SELECT slug, title, category, excerpt, cover_url, published_at
                            FROM blog_posts WHERE status = 'published' ORDER BY published_at DESC NULLS LAST, created_at DESC`).rows;
    res.setHeader('Cache-Control', 's-maxage=30, stale-while-revalidate=300');
    return res.status(200).json({ ok: true, posts: rows });
  } catch (err) {
    return res.status(200).json({ ok: true, posts: [] });
  }
}
