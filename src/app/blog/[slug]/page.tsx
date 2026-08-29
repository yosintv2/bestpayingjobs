import Link from "next/link";
import { notFound } from "next/navigation";
import { getCountries, getCategories, getCurrentYear } from "@/lib/db";
import { seededShuffle } from "@/lib/shuffle";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ShareButtons from "@/components/ShareButtons";
import { posts, getPost, paragraphs, readingTime } from "@/lib/blog";
import { blogKeywords } from "@/lib/keywords";
import { getAuthor, authorSchema, reviewPolicy, lastReviewed } from "@/lib/authors";
import { AuthorByline, AuthorCard } from "@/components/AuthorByline";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return posts.map((post) => ({ slug: post.id }));
}

function slugifyHeading(h: string): string {
  return h
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  return {
    title: `${post.title} | BestPayingJobs.net`,
    description: post.summary,
    keywords: blogKeywords({
      title: post.title,
      category: post.category,
      year: getCurrentYear(),
      // Section headings are the article's own topic terms — better signals
      // than a generic list repeated across all 57 posts.
      terms: post.sections.slice(0, 4).map((s) => s.h.replace(/^\d+\.\s*/, "").toLowerCase()),
    }),
    alternates: {
      canonical: `https://www.bestpayingjobs.net/blog/${slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.summary,
      type: "article",
      images: [
        {
          url: "/og/default.webp",
          width: 1200,
          height: 750,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.summary,
      images: ["/og/default.webp"],
    },
  };
}

export default async function BlogPost({ params }: Props) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const year = getCurrentYear();
  const countries = getCountries();
  const allCategories = getCategories();

  const siteUrl = "https://www.bestpayingjobs.net";

  const postIndex = posts.findIndex((p) => p.id === slug);
  const pubDate = new Date(year, 0, 1 + postIndex);
  const datePublished = pubDate.toISOString().split("T")[0];
  // The articles were last rewritten and checked against source data on the
  // editorial review date, which is what dateModified should reflect.
  const dateModified = lastReviewed > datePublished ? lastReviewed : datePublished;

  const author = getAuthor();
  const readTime = readingTime(post);
  const related = posts.filter((p) => p.id !== post.id && p.category === post.category).slice(0, 3);

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
      { "@type": "ListItem", position: 2, name: "Blog", item: `${siteUrl}/blog` },
      { "@type": "ListItem", position: 3, name: post.title, item: `${siteUrl}/blog/${slug}` },
    ],
  };

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.summary,
    articleSection: post.category,
    author: authorSchema(author, siteUrl),
    publisher: {
      "@type": "Organization",
      name: "BestPayingJobs.net",
      logo: {
        "@type": "ImageObject",
        url: `${siteUrl}/favicon.svg`,
      },
    },
    datePublished,
    dateModified,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${siteUrl}/blog/${slug}`,
    },
  };

  const faqSchema = post.faq?.length
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: post.faq.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      }
    : null;

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      {faqSchema && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      )}
      <Header />

      {/* ── Article header ── */}
      <section className="relative isolate overflow-hidden bg-ink">
        <div className="absolute inset-0 text-chalk/60 bg-grid mask-fade pointer-events-none" />
        <div className="relative mx-auto max-w-3xl px-6 pt-8 pb-12">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-chalk/45 mb-7">
            <Link href="/" className="hover:text-chalk transition-colors">Home</Link>
            <span aria-hidden="true">/</span>
            <Link href="/blog/" className="hover:text-chalk transition-colors">Blog</Link>
          </nav>

          <div className="flex flex-wrap items-center gap-2.5 mb-5">
            <span className="px-2.5 py-1 rounded-full bg-jade/15 text-jade text-[11px] font-bold uppercase tracking-wider">
              {post.category}
            </span>
          </div>

          <h1 className="font-display text-3xl sm:text-4xl lg:text-[2.75rem] font-extrabold text-chalk leading-[1.12]">
            {post.title}
          </h1>
          <p className="mt-5 text-lg text-chalk/60 leading-relaxed">{post.summary}</p>

          <div className="mt-7 pt-6 border-t border-chalk/10">
            <AuthorByline
              author={author}
              published={datePublished}
              updated={dateModified}
              readTime={readTime}
              onDark
            />
          </div>

          <div className="mt-6">
            <ShareButtons title={post.title} onDark />
          </div>
        </div>
      </section>

      <main className="flex-1 mx-auto max-w-3xl px-6 py-12">
        {/* Lead paragraphs */}
        {post.intro?.length ? (
          <div className="mb-10">
            {post.intro.map((p, i) => (
              <p
                key={i}
                className={`leading-relaxed ${
                  i === 0
                    ? "text-[19px] text-gray-800 font-medium mb-4"
                    : "text-[17px] text-gray-600 mb-4"
                }`}
              >
                {p}
              </p>
            ))}
          </div>
        ) : null}

        {/* Key takeaways */}
        {post.takeaways?.length ? (
          <aside className="mb-10 card rim p-6 bg-emerald-50/40">
            <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-700 mb-4">
              Key takeaways
            </h2>
            <ul className="space-y-2.5">
              {post.takeaways.map((t, i) => (
                <li key={i} className="flex gap-3 text-[15px] text-gray-700 leading-relaxed">
                  <svg className="w-4 h-4 mt-1 text-emerald-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </aside>
        ) : null}

        {/* Table of contents — only worth showing on longer pieces */}
        {post.sections.length >= 5 && (
          <nav aria-label="Table of contents" className="mb-10 border-l-2 border-gray-200 pl-5">
            <h2 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">
              In this article
            </h2>
            <ol className="space-y-1.5">
              {post.sections.map((s) => (
                <li key={s.h}>
                  <a
                    href={`#${slugifyHeading(s.h)}`}
                    className="text-sm text-gray-600 hover:text-emerald-600 transition-colors"
                  >
                    {s.h}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        )}

        {/* Body */}
        <article>
          {post.sections.map((section) => (
            <section key={section.h} id={slugifyHeading(section.h)} className="mb-10 scroll-mt-24">
              <h2 className="font-display text-[1.4rem] font-bold text-gray-900 mb-4 leading-snug">
                {section.h}
              </h2>
              {paragraphs(section.b).map((p, j) => (
                <p key={j} className="text-[17px] text-gray-600 leading-[1.75] mb-4">
                  {p}
                </p>
              ))}
              {section.list?.length ? (
                <ul className="mt-4 mb-2 space-y-2.5">
                  {section.list.map((item, j) => (
                    <li key={j} className="relative pl-6 text-[16px] text-gray-600 leading-relaxed">
                      <span className="absolute left-0 top-[0.65em] w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      {item}
                    </li>
                  ))}
                </ul>
              ) : null}
            </section>
          ))}
        </article>

        {/* Conclusion */}
        {post.conclusion ? (
          <section className="mt-12 card p-6 sm:p-7 bg-gray-50">
            <h2 className="font-display text-lg font-bold text-gray-900 mb-3">The bottom line</h2>
            {paragraphs(post.conclusion).map((p, i) => (
              <p key={i} className="text-[16px] text-gray-600 leading-relaxed mb-3 last:mb-0">
                {p}
              </p>
            ))}
          </section>
        ) : null}

        {/* FAQ */}
        {post.faq?.length ? (
          <section className="mt-12">
            <h2 className="font-display text-2xl font-bold text-gray-900 mb-6">
              Frequently asked questions
            </h2>
            <div className="space-y-3">
              {post.faq.map((f) => (
                <details key={f.q} className="group card p-5 open:bg-emerald-50/30">
                  <summary className="flex items-center justify-between gap-4 cursor-pointer list-none text-[16px] font-semibold text-gray-900">
                    {f.q}
                    <svg
                      className="w-4 h-4 text-gray-400 shrink-0 group-open:rotate-180 transition-transform"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2.4}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </summary>
                  <p className="mt-3 text-[15px] text-gray-600 leading-relaxed">{f.a}</p>
                </details>
              ))}
            </div>
          </section>
        ) : null}

        {/* Footer of article */}
        <div className="mt-12 pt-8 border-t border-gray-200 space-y-8">
          <AuthorCard author={author} policy={reviewPolicy} />

          <ShareButtons title={post.title} />

          {related.length > 0 && (
            <div>
              <h2 className="text-sm font-bold text-gray-900 mb-4">More in {post.category}</h2>
              <div className="grid gap-3 sm:grid-cols-3">
                {related.map((r) => (
                  <Link key={r.id} href={`/blog/${r.id}/`} className="card card-lift group p-4">
                    <p className="text-[13px] font-semibold text-gray-900 leading-snug group-hover:text-emerald-700 transition-colors">
                      {r.title}
                    </p>
                    <p className="mt-1.5 text-[11px] text-gray-400">{readingTime(r)}</p>
                  </Link>
                ))}
              </div>
            </div>
          )}

          <div>
            <h2 className="text-sm font-bold text-gray-900 mb-3">Related salary data</h2>
            <div className="flex flex-wrap gap-2">
              <Link href="/global-ranking/" className="text-xs bg-gray-100 hover:bg-emerald-100 hover:text-emerald-700 px-3 py-1.5 rounded-full transition-colors">
                Global salary ranking
              </Link>
              {allCategories.slice(0, 4).map((cat) => (
                <Link key={cat.slug} href={`/jobs/${cat.slug}/`} className="text-xs bg-gray-100 hover:bg-emerald-100 hover:text-emerald-700 px-3 py-1.5 rounded-full transition-colors">
                  {cat.name} salaries
                </Link>
              ))}
              {seededShuffle(countries, post.id).slice(0, 3).map((c) => (
                <Link key={c.code} href={`/best-paying-jobs-in/${c.slug}/`} className="text-xs bg-gray-100 hover:bg-emerald-100 hover:text-emerald-700 px-3 py-1.5 rounded-full transition-colors">
                  Jobs in {c.name}
                </Link>
              ))}
              <Link href="/calculator/" className="text-xs bg-gray-100 hover:bg-emerald-100 hover:text-emerald-700 px-3 py-1.5 rounded-full transition-colors">
                Salary calculators
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
