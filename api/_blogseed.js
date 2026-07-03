import { sql } from './_db.js';

function linesToHtml(t) {
  return t.trim().split('\n').map(l => l.trim()).filter(Boolean)
    .map(l => '<p>' + l.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;') + '</p>').join('\n');
}

const RAW = [
  {
    slug: 'we-dont-look-alike-we-think-alike',
    title: "We Don't Look Alike. We Think Alike.",
    category: 'Culture',
    excerpt: "People aren't connected by appearance. They're connected by values — and shared values are what build the communities that become markets.",
    bodyText: `For decades we've divided people into categories.
Age.
Race.
Income.
Education.
Zip codes.
Marketing has been built around these labels.
Politics has been shaped by them.
Entire industries have depended on them.
Yet something has always felt incomplete.
People who look completely different often buy the same products.
Support the same causes.
Listen to the same music.
Build the same communities.
Dream the same dreams.
Why?
Because people aren't connected by appearance.
They're connected by values.
Shared values create shared behavior.
Shared behavior creates communities.
Communities create markets.
This is why two people living on opposite sides of the world can feel more connected to each other than to someone living next door.
They share a way of thinking.
They share purpose.
They share identity.
Technology has made these invisible communities easier to find, but it didn't create them.
Culture did.
The future won't be built by companies that know the most about demographics.
It will be built by companies that understand shared values.
That's the next frontier.
Not knowing who people are.
Understanding why they believe what they believe.
Understanding what inspires them.
Understanding what brings them together.
The strongest communities have never been built on similarity.
They've been built on shared conviction.
We don't look alike.
We don't act alike.
But we do think alike.
And that changes everything.
If we can understand how values shape communities, we can build better products, stronger organizations, healthier economies, and more meaningful relationships.
The future belongs to those who understand the invisible connections that unite people long before any algorithm can detect them.
That's the world Indiggi believes is possible.`
  },
  {
    slug: 'culture-is-technology',
    title: 'Culture Is Technology',
    category: 'Culture',
    excerpt: "Technology doesn't change the world. People do — and people move because of culture. Culture has always been humanity's original operating system.",
    bodyText: `For decades we've been taught that technology changes the world.
The internet changed the world.
The smartphone changed the world.
Artificial Intelligence is changing the world.
I don't believe that's entirely true.
Technology doesn't change the world.
People do.
And people move because of culture.
Culture tells us what matters.
What is valuable.
Who we trust.
What we buy.
What we reject.
What we dream about.
What we aspire to become.
Technology simply accelerates those decisions.
That is why I believe culture is technology.
Not because culture is software.
Because culture performs the same function.
Technology reduces uncertainty.
Technology creates repeatable outcomes.
Technology allows people to coordinate at scale.
Culture has always done exactly the same thing.
Before there were operating systems, there were cultures.
Before there were algorithms, there were shared beliefs.
Before there were networks, there were communities.
Culture has always been humanity's original operating system.
It is the invisible infrastructure that allows millions of people—who may never meet—to think together, move together, and build together.
Which leads me to something I've believed for years:
We don't look alike.
We don't act alike.
But we do think alike.
That sentence changes everything.
Markets are not built because people look the same.
Markets emerge because people share meaning.
A sneaker becomes more than rubber and leather because of culture.
Music becomes more than sound because of culture.
Money becomes more than paper because of culture.
Even Artificial Intelligence only becomes useful when it understands the culture of the people it serves.
The future will not belong to the companies with the biggest models.
It will belong to the companies that understand people the best.
For too long we've treated culture as decoration.
Something to market with.
Something to advertise around.
Something to borrow when it's popular.
But culture isn't window dressing.
It is infrastructure.
Every major technology company in history has been powered by a cultural movement.
Apple wasn't just building computers.
It challenged conformity.
Nike never sold shoes.
It sold identity.
Tesla didn't simply build electric cars.
It created a movement around the future.
The technology mattered.
But the culture made the technology inevitable.
For generations we've measured factories, buildings, patents, software, and financial assets.
Yet the greatest force behind all of them has remained largely invisible.
Culture.
By the time Wall Street recognizes it, culture has already moved.
By the time economists measure it, culture has already evolved.
By the time balance sheets reflect it, culture has already created billions of dollars in value.
The invisible marketplace always moves first.
That's why the future won't be built by people who simply build better technology.
It will be built by those who understand the invisible systems that shape human behavior before markets ever notice.
That's why Indiggi exists.
Not to build another app.
Not to build another platform.
But to help build the infrastructure for culture itself.
Because culture isn't the future of technology.
Culture has always been the technology.
We've simply forgotten how to see it.`
  },
  {
    slug: 'the-missing-ministry-of-culture',
    title: 'The Missing Ministry of Culture',
    category: 'Culture',
    excerpt: "America is one of the only major countries without a Minister of Culture. What if we treated culture as infrastructure, not decoration?",
    bodyHtml: `<p>More than fifteen years ago, I had a conversation I'll never forget.</p>
<p>I was working on a series of videos for a water initiative when Q looked at me and asked a simple question:</p>
<blockquote>"Young Blood… where do you see the world heading?"</blockquote>
<p>I shared something that had been on my mind for years: I believed we were misunderstanding culture. We treated it as entertainment. As marketing. As demographics. As something to observe rather than something to build.</p>
<p>He listened quietly. Then he said something that changed the direction of my thinking.</p>
<blockquote>"America is one of the only major countries in the world that doesn't have a Minister of Culture."</blockquote>
<h2>01 // The Systemic Blindspot</h2>
<p>That sentence stayed with me. I couldn't let it go.</p>
<p>How could one of the most culturally influential nations on Earth have no institution dedicated to understanding, developing, and protecting one of its greatest assets?</p>
<ul>
<li>We have departments for commerce.</li>
<li>We have departments for energy.</li>
<li>We have departments for transportation and agriculture.</li>
</ul>
<p>We invest billions building physical infrastructure. Yet one of the greatest drivers of innovation, influence, trust, creativity, and economic value has largely been left to chance.</p>
<p><b>Culture.</b></p>
<p>For generations, creators, entrepreneurs, artists, and communities have built movements without the systems needed to recognize their full value. Great ideas often struggle for one reason: <b>Capital.</b> Not because they lack vision, but because our systems struggle to recognize cultural value before it becomes financial value.</p>
<p>We've become remarkably good at measuring what already exists.</p>
<p>We're far less capable of measuring what is emerging.</p>
<blockquote>The Gap — that's where the future will be built.</blockquote>
<h2>02 // The Infrastructure of Creativity</h2>
<p>Imagine a world where culture isn't treated as an afterthought, but as infrastructure.</p>
<ul>
<li>Where shared values become <b>measurable.</b></li>
<li>Where creativity becomes <b>investable.</b></li>
<li>Where communities become <b>visible</b> long before markets discover them.</li>
</ul>
<p>That's the question I've been chasing since that conversation.</p>
<p>Indiggi isn't an answer to every problem. But it is an attempt to build something I spent years looking for and could never find.</p>
<p>If culture shapes economies, influences technology, creates movements, and determines where value flows, then perhaps it's time we stop treating it like decoration. Perhaps it's time we start building the infrastructure it has always deserved.</p>
<p>That's the conversation we're inviting the world into.</p>
<p>And we're just getting started.</p>`,
    bodyText: `More than fifteen years ago, I had a conversation I'll never forget.
I was working on a series of videos for a water initiative when Q looked at me and asked a simple question.
"Young Blood… where do you see the world heading?"
I shared something that had been on my mind for years.
I believed we were misunderstanding culture.
We treated it as entertainment.
As marketing.
As demographics.
As something to observe rather than something to build.
He listened quietly.
Then he said something that changed the direction of my thinking.
"America is one of the only major countries in the world that doesn't have a Minister of Culture."
That sentence stayed with me.
I couldn't let it go.
How could one of the most culturally influential nations on Earth have no institution dedicated to understanding, developing, and protecting one of its greatest assets?
We have departments for commerce.
Departments for energy.
Departments for transportation.
Departments for agriculture.
We invest billions building physical infrastructure.
Yet one of the greatest drivers of innovation, influence, trust, creativity, and economic value has largely been left to chance.
Culture.
For generations, creators, entrepreneurs, artists, and communities have built movements without the systems needed to recognize their full value.
Great ideas often struggle for one reason.
Capital.
Not because they lack vision.
Because our systems struggle to recognize cultural value before it becomes financial value.
We've become remarkably good at measuring what already exists.
We're far less capable of measuring what is emerging.
That's the gap.
And that's where the future will be built.
Imagine a world where culture isn't treated as an afterthought, but as infrastructure.
Where shared values become measurable.
Where creativity becomes investable.
Where communities become visible long before markets discover them.
That's the question I've been chasing since that conversation.
Indiggi isn't an answer to every problem.
But it is an attempt to build something I spent years looking for and could never find.
If culture shapes economies, influences technology, creates movements, and determines where value flows, then perhaps it's time we stop treating it like decoration.
Perhaps it's time we start building the infrastructure it has always deserved.
That's the conversation we're inviting the world into.
And we're just getting started.`
  }
];

const COVERS = {
  'we-dont-look-alike-we-think-alike': '/assets/cover-think-alike.svg',
  'culture-is-technology': '/assets/cover-culture-technology.svg',
  'the-missing-ministry-of-culture': '/assets/cover-ministry-culture.svg'
};

export function seedPosts() {
  return RAW.map(p => ({ slug: p.slug, title: p.title, category: p.category, excerpt: p.excerpt, body: p.bodyHtml || linesToHtml(p.bodyText), cover_url: COVERS[p.slug] || null }));
}

// Insert the seed posts (published) only if the blog is empty. Idempotent.
export async function seedBlogIfEmpty() {
  try {
    const c = (await sql`SELECT count(*)::int AS c FROM blog_posts`).rows[0].c;
    if (c > 0) return;
    for (const p of seedPosts()) {
      await sql`INSERT INTO blog_posts (slug, title, category, excerpt, body, cover_url, status, published_at, author)
                VALUES (${p.slug}, ${p.title}, ${p.category}, ${p.excerpt}, ${p.body}, ${p.cover_url}, 'published', now(), 'Indiggi')
                ON CONFLICT (slug) DO NOTHING`;
    }
  } catch { /* DB not ready — fallback handled by caller */ }
}
