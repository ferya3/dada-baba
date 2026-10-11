import type { Metadata } from "next";
import { getNews } from "@/lib/content";
import { PageHeader } from "@/components/sections/PageHeader";
import { NewsCard } from "@/components/sections/NewsCard";
import { RevealGroup, RevealItem } from "@/components/motion/Reveal";

export const metadata: Metadata = {
  title: "اخبار و دیدگاه‌ها",
  description: "تازه‌ترین اخبار، گزارش‌ها و تحلیل‌های هلدینگ آوند و زیرمجموعه‌ها.",
  alternates: { canonical: "/news" },
};

export default async function NewsPage() {
  const news = await getNews();

  return (
    <>
      <PageHeader
        eyebrow="اخبار و دیدگاه‌ها"
        title="روایت ما از صنعت و آینده"
        description="اخبار گروه، گزارش‌های عملکرد و دیدگاه‌های تخصصی مدیران و کارشناسان ما."
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
