import type { Metadata } from "next";
import { getNews, getPages } from "@/lib/content";
import { PageHeader } from "@/components/sections/PageHeader";
import { NewsCard } from "@/components/sections/NewsCard";
import { RevealGroup, RevealItem } from "@/components/motion/Reveal";

export async function generateMetadata(): Promise<Metadata> {
  const { news: page } = await getPages();
  return { title: "اخبار و دیدگاه‌ها", description: page.description, alternates: { canonical: "/news" } };
}

export default async function NewsPage() {
  const { news: page } = await getPages();
  const news = await getNews();

  return (
    <>
      <PageHeader
        eyebrow="اخبار و دیدگاه‌ها"
        title={page.title}
        description={page.description}
        path="/news"
      />
      <section className="container-page py-12">
        <RevealGroup className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {news.map((post) => (
            <RevealItem key={post.slug}>
              <NewsCard post={post} />
            </RevealItem>
          ))}
        </RevealGroup>
      </section>
    </>
  );
}
