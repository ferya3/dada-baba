import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { getNews, getNewsPost, getSettings, getSubsidiary } from "@/lib/content";
import { absoluteUrl, formatFaDate, toFaDigits } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Reveal } from "@/components/motion/Reveal";
import { SplitText } from "@/components/motion/SplitText";
import { JsonLd, breadcrumbs } from "@/components/seo/JsonLd";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const news = await getNews();
  return news.map((n) => ({ slug: n.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getNewsPost((await params).slug);
  if (!post) return {};
  const path = `/news/${post.slug}`;
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: path },
    openGraph: { type: "article", title: post.title, description: post.excerpt, url: path, publishedTime: post.date },
  };
}

export default async function NewsPostPage({ params }: Props) {
  const post = await getNewsPost((await params).slug);
  if (!post) notFound();
  const [subsidiary, settings] = await Promise.all([
    post.subsidiary ? getSubsidiary(post.subsidiary) : null,
    getSettings(),
  ]);
  const path = `/news/${post.slug}`;

  return (
    <article className="container-page max-w-3xl pt-40 pb-24">
      <Reveal y={12}>
        <Link href="/news" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowRight className="size-4" aria-hidden />
          اخبار و دیدگاه‌ها
        </Link>
      </Reveal>
      <div className="mt-8 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
        <Badge>{post.category}</Badge>
        <time dateTime={post.date}>{formatFaDate(post.date)}</time>
        <span>· {toFaDigits(post.readingMinutes)} دقیقه مطالعه</span>
        {subsidiary && (
          <Link href={`/subsidiaries/${subsidiary.slug}`} className="hover:underline" style={{ color: subsidiary.color }}>
            {subsidiary.name}
          </Link>
        )}
      </div>
      <SplitText as="h1" immediate text={post.title} className="mt-6 text-4xl leading-tight font-black text-balance sm:text-5xl" />
      <Reveal delay={0.2}>
        <p className="mt-6 text-xl leading-9 text-muted-foreground">{post.excerpt}</p>
      </Reveal>
      <div className="mt-12 flex flex-col gap-6 border-t border-border pt-12 text-lg leading-9">
        {post.body.map((p, i) => (
          <Reveal key={i}>
            <p>{p}</p>
          </Reveal>
        ))}
      </div>

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": post.category === "خبر" ? "NewsArticle" : "Article",
          headline: post.title,
          description: post.excerpt,
          datePublished: post.date,
          inLanguage: "fa-IR",
          mainEntityOfPage: absoluteUrl(path),
          author: { "@type": "Organization", name: subsidiary?.name ?? settings.name },
          publisher: { "@id": absoluteUrl("/#organization") },
        }}
      />
      <JsonLd
        data={breadcrumbs([
          { name: "خانه", path: "/" },
          { name: "اخبار و دیدگاه‌ها", path: "/news" },
          { name: post.title, path },
        ])}
      />
    </article>
  );
}
