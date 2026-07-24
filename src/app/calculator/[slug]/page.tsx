import type { Metadata } from "next";
import { notFound } from "next/navigation";
import calculators from "@/data/calculators.json";
import { calculatorComponents } from "@/calculators/registry";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return calculators.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const calc = calculators.find((c) => c.slug === slug);
  if (!calc) return {};
  return {
    title: calc.ogTitle,
    description: calc.description,
    alternates: {
      canonical: `https://www.bestpayingjobs.net/calculator/${slug}`,
    },
    openGraph: {
      title: calc.ogTitle,
      description: calc.description,
    },
  };
}

export default async function CalculatorPage({ params }: Props) {
  const { slug } = await params;
  const calc = calculators.find((c) => c.slug === slug);
  if (!calc) notFound();
  const Component = calculatorComponents[slug];
  if (!Component) notFound();

  const imageSchema = {
    "@context": "https://schema.org",
    "@type": "ImageObject",
    contentUrl: `https://www.bestpayingjobs.net/og/calculators/${slug}.webp`,
    name: calc.title,
    description: calc.description,
    representativeOfPage: true,
    thumbnail: {
      "@type": "ImageObject",
      contentUrl: `https://www.bestpayingjobs.net/og/calculators/${slug}.webp`,
      width: 1200,
      height: 750,
    },
  };

  return (
    <div className="flex flex-col min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(imageSchema) }} />
      <Header />
      <main className="flex-1">
        <Component />
      </main>
      <Footer />
    </div>
  );
}
