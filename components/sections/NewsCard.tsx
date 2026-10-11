import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { NewsPost } from "@/lib/content/types";
import { Badge } from "@/components/ui/badge";
import { formatFaDate, toFaDigits } from "@/lib/utils";

export function NewsCard({ post }: { post: NewsPost }) {
  return (
    <article className="group relative flex h-full flex-col gap-4 rounded-xl border border-border bg-card/40 p-7 transition-colors duration-500 hover:border-white/20 hover:bg-card/80">
      <div className="flex items-center gap-3 text-xs text-muted-foreground">
        <Badge>{post.category}</Badge>
        <time dateTime={post.date}>{formatFaDate(post.date)}</time>
        <span>· {toFaDigits(post.readingMinutes)} دقیقه</span>
      </div>
      <h3 className="text-xl leading-snug font-bold">
        <Link href={`/news/${post.slug}`} className="after:absolute after:inset-0">
          {post.title}
        </Link>
      </h3>
      <p className="text-sm leading-7 text-muted-foreground">{post.excerpt}</p>
      <span className="mt-auto inline-flex items-center gap-2 text-sm font-medium text-primary">
        ادامه مطلب
        <ArrowLeft className="size-4 transition-transform duration-300 group-hover:-translate-x-1.5" aria-hidden />
      </span>
    </article>
  );
}
