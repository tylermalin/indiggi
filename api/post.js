import { getPostBySlug } from './blog.js';

const SITE = 'https://www.indiggi.com';
const FALLBACK_OG_IMAGE = SITE + '/assets/cover-culture-technology-og.png';

function esc(s) {
  return (s == null ? '' : String(s)).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function stripHtml(s) {
  return (s || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

function ogImageFor(coverUrl) {
  if (!coverUrl) return FALLBACK_OG_IMAGE;
  const abs = coverUrl.startsWith('http') ? coverUrl : SITE + (coverUrl.startsWith('/') ? coverUrl : '/' + coverUrl);
  return abs.endsWith('.svg') ? abs.replace(/\.svg$/, '-og.png') : abs;
}

const SHARE_ICONS = {
  x: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.9 2h3.4l-7.5 8.6L23.6 22h-6.9l-5.4-7-6.2 7H1.7l8-9.2L1 2h7l4.9 6.4L18.9 2Zm-1.2 18h1.9L7.4 4h-2l12.3 16Z"/></svg>',
  facebook: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M22 12a10 10 0 1 0-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.5h-1.3c-1.2 0-1.6.8-1.6 1.6V12h2.8l-.4 2.9h-2.4v7A10 10 0 0 0 22 12Z"/></svg>',
  linkedin: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M6.9 8.4H3.6V20H6.9V8.4ZM5.3 3.3a1.9 1.9 0 1 0 0 3.9 1.9 1.9 0 0 0 0-3.9ZM20.4 20h-3.3v-5.6c0-1.3 0-3-1.8-3s-2.1 1.4-2.1 2.9V20H9.9V8.4h3.2v1.6h.05c.44-.84 1.5-1.8 3.1-1.8 3.3 0 3.9 2.2 3.9 5V20Z"/></svg>',
  link: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.5 14.5 14.5 9.5"/><path d="M11 6.5 12.4 5A4 4 0 1 1 18 10.6l-1.5 1.4"/><path d="M13 17.5 11.6 19A4 4 0 1 1 6 13.4l1.5-1.4"/></svg>'
};

function renderShareBar(url, title) {
  const u = encodeURIComponent(url);
  const t = encodeURIComponent(title);
  return `<div class="share">
    <span class="share-lab">Share this post</span>
    <div class="share-btns">
      <a class="sbtn" href="https://twitter.com/intent/tweet?text=${t}&url=${u}" target="_blank" rel="noopener" aria-label="Share on X">${SHARE_ICONS.x}</a>
      <a class="sbtn" href="https://www.facebook.com/sharer/sharer.php?u=${u}" target="_blank" rel="noopener" aria-label="Share on Facebook">${SHARE_ICONS.facebook}</a>
      <a class="sbtn" href="https://www.linkedin.com/sharing/share-offsite/?url=${u}" target="_blank" rel="noopener" aria-label="Share on LinkedIn">${SHARE_ICONS.linkedin}</a>
      <button class="sbtn" type="button" onclick="shareCopy(this)" aria-label="Copy link">${SHARE_ICONS.link}</button>
      <button class="sbtn sbtn-native" type="button" onclick="shareNative()" aria-label="Share">Share</button>
    </div>
  </div>`;
}

const STYLE = `
:root{--pp:#7B3FE4;--pk:#E0457B;--navy:#2B2E9E;--grad:linear-gradient(135deg,#2B2E9E,#7B3FE4 52%,#E0457B);--ink:#141024;--body:#2b2540;--grey:#6b6683;--line:#e6e2f0;--soft:#f7f5fc;}
*{box-sizing:border-box;margin:0;padding:0;}
body{font-family:'Lora',Georgia,serif;color:var(--body);background:#fff;font-size:16px;line-height:1.6;-webkit-font-smoothing:antialiased;}
a{color:var(--pp);text-decoration:none;}
.mono{font-family:'Space Mono',ui-monospace,monospace;}
.wrap{max-width:720px;margin:0 auto;padding:0 24px;}
header{border-bottom:1px solid var(--line);position:sticky;top:0;background:rgba(255,255,255,.92);backdrop-filter:blur(12px);z-index:10;}
nav{display:flex;align-items:center;justify-content:space-between;height:66px;max-width:1080px;margin:0 auto;padding:0 24px;}
.logo{height:24px;}
.btn{font-family:'DM Sans',sans-serif;font-weight:700;font-size:14px;padding:11px 18px;border-radius:26px;background:var(--grad);color:#fff;border:none;cursor:pointer;}

article{padding:52px 0 90px;}
.tag{font-family:'Space Mono',monospace;font-size:12.5px;font-weight:700;letter-spacing:1.5px;color:var(--pk);text-transform:uppercase;display:inline-block;border:1px solid var(--line);border-radius:6px;padding:7px 13px;background:var(--soft);}
article h1{font-family:'Space Grotesk',sans-serif;font-weight:700;font-size:52px;line-height:1.04;letter-spacing:-1.5px;color:var(--ink);margin:22px 0 0;padding-bottom:24px;border-bottom:3px solid var(--ink);}
.byline{font-family:'Space Mono',monospace;font-size:12px;letter-spacing:1px;color:var(--grey);text-transform:uppercase;margin-top:16px;}
.cover{width:100%;border-radius:14px;margin:30px 0 6px;max-height:360px;object-fit:cover;}

.share{display:flex;align-items:center;gap:14px;flex-wrap:wrap;margin:28px 0 6px;padding:18px 0;border-top:1px solid var(--line);border-bottom:1px solid var(--line);}
.share-lab{font-family:'Space Mono',monospace;font-size:12px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:var(--grey);}
.share-btns{display:flex;align-items:center;gap:8px;}
.sbtn{display:inline-flex;align-items:center;justify-content:center;gap:6px;width:38px;height:38px;border-radius:50%;background:var(--soft);border:1px solid var(--line);color:var(--ink);cursor:pointer;font-family:'DM Sans',sans-serif;font-weight:700;font-size:13px;transition:.15s;}
.sbtn svg{width:17px;height:17px;}
.sbtn:hover{background:var(--grad);color:#fff;border-color:transparent;}
.sbtn-native{display:none;width:auto;padding:0 16px;border-radius:19px;}
.sbtn.copied{background:#0E9B86;color:#fff;border-color:transparent;}

.body{font-size:19px;line-height:1.78;color:var(--body);margin-top:30px;}
.body p{margin:20px 0;}
.body h2,.body .section-header{font-family:'Space Mono',monospace;font-size:14px;font-weight:700;letter-spacing:2.5px;text-transform:uppercase;color:var(--navy);margin:52px 0 4px;padding-top:26px;border-top:1px solid var(--line);}
.body .lead-paragraph{font-family:'Lora',serif;font-size:23px;line-height:1.5;color:var(--ink);font-weight:600;margin:28px 0;}
.body blockquote p{margin:0;font-style:inherit;}
.body .emphasis-box{background:var(--soft);border-left:3px solid var(--pk);border-radius:12px;padding:22px 26px;margin:34px 0;font-family:'Lora',serif;font-size:19px;line-height:1.6;color:var(--ink);}
.body .emphasis-box strong{display:block;font-family:'Space Mono',monospace;font-size:12px;letter-spacing:2px;text-transform:uppercase;color:var(--navy);margin-bottom:8px;font-weight:700;}
.body .bold-anchor{font-family:'Space Grotesk',sans-serif;font-weight:700;color:var(--pk);letter-spacing:-.2px;}
.body b,.body strong{font-family:'Space Grotesk',sans-serif;font-weight:700;color:var(--ink);letter-spacing:-.2px;}
.body ul{list-style:none;margin:22px 0;}
.body li{position:relative;padding-left:30px;margin:12px 0;}
.body li::before{content:"//";position:absolute;left:0;top:2px;font-family:'Space Mono',monospace;font-weight:700;font-size:14px;color:var(--pk);}
.body blockquote{font-family:'Lora',serif;font-style:italic;font-weight:500;font-size:25px;line-height:1.45;text-align:center;color:var(--ink);margin:44px 0;padding:8px 34px;position:relative;}
.body blockquote::before{content:"[";color:var(--pk);font-family:'Space Mono',monospace;font-style:normal;font-size:24px;margin-right:12px;vertical-align:-2px;}
.body blockquote::after{content:"]";color:var(--pk);font-family:'Space Mono',monospace;font-style:normal;font-size:24px;margin-left:12px;vertical-align:-2px;}
.body img{max-width:100%;border-radius:12px;margin:22px 0;}
.body hr{border:none;text-align:center;margin:40px 0;}
.body hr::before{content:"//  //  //";font-family:'Space Mono',monospace;color:var(--line);letter-spacing:6px;font-size:14px;}

.back{display:inline-block;margin-top:48px;font-family:'Space Mono',monospace;font-size:13px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:var(--pp);}
footer{border-top:1px solid var(--line);padding:30px 0;color:var(--grey);font-size:13px;text-align:center;font-family:'DM Sans',sans-serif;}
@media(max-width:600px){article h1{font-size:36px;}.body{font-size:17.5px;}}
`;

const SHARE_SCRIPT = `
function shareCopy(btn){
  var url=window.location.href;
  (navigator.clipboard&&navigator.clipboard.writeText?navigator.clipboard.writeText(url):Promise.reject()).catch(function(){
    var ta=document.createElement('textarea');ta.value=url;document.body.appendChild(ta);ta.select();document.execCommand('copy');document.body.removeChild(ta);
  }).then(function(){
    btn.classList.add('copied');setTimeout(function(){btn.classList.remove('copied');},1600);
  });
}
function shareNative(){
  if(navigator.share){navigator.share({title:document.title,url:window.location.href}).catch(function(){});}
}
if(navigator.share){document.addEventListener('DOMContentLoaded',function(){var b=document.querySelector('.sbtn-native');if(b)b.style.display='inline-flex';});}
`;

function page({ head, bodyHtml }) {
  return `<!DOCTYPE html><html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
${head}
<link rel="icon" href="/logo-mark.svg">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@700;800&family=Space+Grotesk:wght@500;600;700&family=Lora:ital,wght@0,400;0,600;1,400;1,600&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet">
<style>${STYLE}</style></head><body>
<header><nav><a href="/"><img class="logo" src="/logo.svg" alt="Indiggi"></a><a href="/#reserve" class="btn">Register Now</a></nav></header>
${bodyHtml}
<footer><div class="wrap">© 2026 Indiggi International Holdings · Culture is the new technology</div></footer>
<script>${SHARE_SCRIPT}</script>
</body></html>`;
}

export default async function handler(req, res) {
  const slug = (req.query && req.query.slug) || '';
  res.setHeader('Content-Type', 'text/html; charset=utf-8');

  const post = slug ? await getPostBySlug(slug) : null;

  if (!post) {
    res.setHeader('Cache-Control', 's-maxage=30, stale-while-revalidate=300');
    res.status(404).send(page({
      head: `<title>Indiggi — Not found</title><meta name="robots" content="noindex">`,
      bodyHtml: `<article><div class="wrap"><span class="tag">[ JOURNAL // 404 ]</span><h1>Not found</h1><a class="back" href="/blog">&larr; Back to the Journal</a></div></article>`
    }));
    return;
  }

  const url = `${SITE}/post?slug=${encodeURIComponent(post.slug)}`;
  const image = ogImageFor(post.cover_url);
  const description = stripHtml(post.excerpt || post.body || '').slice(0, 200);
  const title = post.title;
  const cat = (post.category || 'Story').toUpperCase();
  const date = post.published_at ? new Date(post.published_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : '';

  const head = `<title>Indiggi — ${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<link rel="canonical" href="${url}">
<meta property="og:type" content="article">
<meta property="og:site_name" content="Indiggi">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${image}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(title)}">
<meta name="twitter:description" content="${esc(description)}">
<meta name="twitter:image" content="${image}">`;

  const bodyHtml = `<article><div class="wrap">
<span class="tag">[ JOURNAL // ${esc(cat)} ]</span>
<h1>${esc(title)}</h1>
${date ? `<div class="byline">${esc(date)} — The Indiggi Team</div>` : ''}
${post.cover_url ? `<img class="cover" src="${esc(post.cover_url)}" alt="${esc(title)}">` : ''}
${renderShareBar(url, title)}
<div class="body">${post.body || `<p>${esc(post.excerpt || '')}</p>`}</div>
${renderShareBar(url, title)}
<a class="back" href="/blog">&larr; Back to the Journal</a>
</div></article>`;

  res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=600');
  res.status(200).send(page({ head, bodyHtml }));
}
