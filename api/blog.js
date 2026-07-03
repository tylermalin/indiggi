import { sql, ensureSchema } from './_db.js';
import { seedBlogIfEmpty, seedPosts } from './_blogseed.js';

// Public blog reader. ?slug=xyz for one post, otherwise a list of published posts.
export default async function handler(req, res) {
  const slug = req.query && req.query.slug;
  try {
    await ensureSchema();
    await seedBlogIfEmpty();
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
    // DB not connected yet → serve the seed posts read-only so /blog still works.
    const seeds = seedPosts();
    if (slug) {
      const p = seeds.find(x => x.slug === slug);
      if (!p) return res.status(404).json({ error: 'not_found' });
      return res.status(200).json({ ok: true, post: { slug: p.slug, title: p.title, category: p.category, excerpt: p.excerpt, body: p.body, cover_url: null, published_at: null } });
    }
    return res.status(200).json({ ok: true, posts: seeds.map(p => ({ slug: p.slug, title: p.title, category: p.category, excerpt: p.excerpt, cover_url: null, published_at: null })) });
  }
}
