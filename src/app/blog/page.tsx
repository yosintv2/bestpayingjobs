import Link from "next/link";
import { getCountries, getCategories, getCurrentYear } from "@/lib/db";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import posts from "@/data/blog-posts.json";

const categories = [...new Set(posts.map((p) => p.category))];

export default function BlogIndex() {
  const year = getCurrentYear();
  const countries = getCountries();
  const allCategories = getCategories();

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <section className="bg-gradient-to-br from-emerald-50 via-white to-emerald-50 py-16">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Career Blog</h1>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            Career advice, salary insights, job search tips, and personal finance guides to help you earn more.
          </p>
        </div>
      </section>

      <section className="py-12 bg-white border-b border-gray-100">
        <div className="mx-auto max-w-5xl px-6">
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <a
                key={cat}
                href={`?category=${encodeURIComponent(cat)}`}
                className="px-4 py-1.5 rounded-full text-sm font-medium bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors"
              >
                {cat}
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-white flex-1">
        <div className="mx-auto max-w-5xl px-6">
          <div className="grid gap-8">
            {posts.map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.id}`}
                className="group block rounded-xl border border-gray-200 bg-white p-6 hover:border-emerald-200 hover:shadow-lg hover:shadow-emerald-100/50 transition-all duration-200"
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">{post.category}</span>
                  <span className="text-xs text-gray-400">{post.readTime}</span>
                </div>
                <h2 className="text-xl font-bold text-gray-900 group-hover:text-emerald-600 transition-colors mb-2">{post.title}</h2>
                <p className="text-sm text-gray-500 leading-relaxed">{post.summary}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
