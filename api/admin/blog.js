import { sql, ensureSchema, requireEditor } from '../_auth.js';
import { seedBlogIfEmpty } from '../_blogseed.js';

function slugify(s) {
  return (s || '').toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 80);
}

export default async function handler(req, res) {
  const user = requireEditor(req, res);
  if (!user) return;

  try {
    await ensureSchema();

    if (req.method === 'GET') {
      await seedBlogIfEmpty();
      const rows = (await sql`SELECT id, slug, title, category, excerpt, cover_url, status, published_at, updated_at, author
                              FROM blog_posts ORDER BY updated_at DESC`).rows;
      return res.status(200).json({ ok: true, posts: rows });
    }

    let body = req.body;
    if (typeof body === 'string') { try { body = JSON.parse(body || '{}'); } catch { body = {}; } }
    body = body || {};

    if (req.method === 'DELETE') {
      const id = (req.query && req.query.id) || body.id;
      if (!id) return res.status(400).json({ error: 'id_required' });
      await sql`DELETE FROM blog_posts WHERE id = ${Number(id)}`;
      return res.status(200).json({ ok: true });
    }

    if (req.method === 'POST' || req.method === 'PUT') {
      const title = (body.title || '').toString().slice(0, 200);
      if (!title) return res.status(400).json({ error: 'title_required' });
      const slug = slugify(body.slug || title);
      const category = (body.category || '').toString().slice(0, 60) || null;
      const excerpt = (body.excerpt || '').toString().slice(0, 400) || null;
      const bodyHtml = (body.body || '').toString();
      const cover = (body.cover_url || '').toString().slice(0, 500) || null;
      const status = body.status === 'published' ? 'published' : 'draft';
      const publishedAt = status === 'published' ? new Date().toISOString() : null;

      if (body.id) {
        await sql`UPDATE blog_posts SET title=${title}, slug=${slug}, category=${category}, excerpt=${excerpt},
                  body=${bodyHtml}, cover_url=${cover}, status=${status},
                  published_at = CASE WHEN ${status}='published' AND published_at IS NULL THEN now() ELSE published_at END,
                  updated_at = now()
                  WHERE id = ${Number(body.id)}`;
        return res.status(200).json({ ok: true, id: Number(body.id) });
      } else {
        const r = await sql`INSERT INTO blog_posts (slug, title, category, excerpt, body, cover_url, status, published_at, author)
                            VALUES (${slug}, ${title}, ${category}, ${excerpt}, ${bodyHtml}, ${cover}, ${status}, ${publishedAt}, ${user.email})
                            RETURNING id`;
        return res.status(200).json({ ok: true, id: r.rows[0].id });
      }
    }

    return res.status(405).json({ error: 'method_not_allowed' });
  } catch (err) {
    if (err && err.code === '23505') return res.status(409).json({ error: 'slug_taken' });
    console.error('blog_error', err && err.message);
    return res.status(500).json({ error: 'server_error', message: err && err.message });
  }
}
