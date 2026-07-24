import Link from "next/link";
import { notFound } from "next/navigation";
import { getCountries, getCategories, getCurrentYear } from "@/lib/db";
import { seededShuffle } from "@/lib/shuffle";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ShareButtons from "@/components/ShareButtons";
import posts from "@/data/blog-posts.json";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return posts.map((post) => ({ slug: post.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = posts.find((p) => p.id === slug);
  if (!post) return {};
  return {
    title: `${post.title} | BestPayingJobs.net`,
    description: post.summary,
    openGraph: {
      title: post.title,
      description: post.summary,
      type: "article",
    },
  };
}

export default async function BlogPost({ params }: Props) {
  const { slug } = await params;
  const post = posts.find((p) => p.id === slug);
  if (!post) notFound();

  const year = getCurrentYear();
  const countries = getCountries();
  const allCategories = getCategories();

  const siteUrl = "https://www.bestpayingjobs.net";

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.summary,
    author: {
      "@type": "Organization",
      name: "BestPayingJobs.net",
    },
    publisher: {
      "@type": "Organization",
      name: "BestPayingJobs.net",
      logo: {
        "@type": "ImageObject",
        url: `${siteUrl}/favicon-96x96.png`,
      },
    },
    datePublished: "2026-01-01",
    dateModified: "2026-07-01",
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${siteUrl}/blog/${slug}`,
    },
  };

  return (
    <div className="flex flex-col min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <Header />

      <section className="bg-white py-16 flex-1">
        <div className="mx-auto max-w-3xl px-6">
          <Link href="/blog" className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-emerald-600 transition-colors mb-8">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            Back to Blog
          </Link>
          <div className="flex items-center gap-3 mb-4">
            <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">{post.category}</span>
            <span className="text-xs text-gray-400">{post.readTime}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 leading-tight">{post.title}</h1>
          <p className="text-lg text-gray-500 mb-10 leading-relaxed">{post.summary}</p>
          <div className="prose prose-gray max-w-none">
            {post.sections.map((section, i) => (
              <div key={i} className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-3">{section.h}</h2>
                <p className="text-gray-600 leading-relaxed">{section.b}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 pt-8 border-t border-gray-200 space-y-6">
            <ShareButtons title={post.title} />
            <div className="border-t border-gray-100 pt-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Related Salary Data</h3>
              <div className="flex flex-wrap gap-2">
                <Link href="/global-ranking" className="text-xs bg-gray-100 hover:bg-emerald-100 hover:text-emerald-600 px-3 py-1.5 rounded-full transition-colors">Global Salary Ranking</Link>
                {allCategories.slice(0, 4).map((cat) => (
                  <Link key={cat.slug} href={`/jobs/${cat.slug}`} className="text-xs bg-gray-100 hover:bg-emerald-100 hover:text-emerald-600 px-3 py-1.5 rounded-full transition-colors">{cat.name} Salaries</Link>
                ))}
                {seededShuffle(countries, post.id).slice(0, 3).map((c) => (
                  <Link key={c.code} href={`/best-paying-jobs-in-${c.slug}`} className="text-xs bg-gray-100 hover:bg-emerald-100 hover:text-emerald-600 px-3 py-1.5 rounded-full transition-colors">Jobs in {c.name}</Link>
                ))}
                <Link href="/calculator" className="text-xs bg-gray-100 hover:bg-emerald-100 hover:text-emerald-600 px-3 py-1.5 rounded-full transition-colors">Salary Calculators</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
