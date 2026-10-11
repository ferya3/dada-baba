import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { emptyObject } from "@/lib/admin/fields";
import { getSection } from "@/lib/admin/sections";
import { loadOptions } from "@/lib/admin/options";
import { ContentForm } from "@/components/admin/ContentForm";
import { PageTitle } from "@/components/admin/PageTitle";
import { Button } from "@/components/ui/button";

type Props = { params: Promise<{ section: string }> };

export default async function NewDocumentPage({ params }: Props) {
  const section = getSection((await params).section);
  if (section?.kind !== "collection") notFound();

  const initial = emptyObject(section.fields);
  // Sensible defaults for new news posts.
  if (section.key === "news") Object.assign(initial, { date: new Date().toISOString().slice(0, 10), readingMinutes: 3, category: "خبر" });

  return (
    <>
      <PageTitle
        title={`${section.singular} جدید`}
        actions={
          <Button asChild variant="outline">
            <Link href={`/admin/${section.key}`}>
              <ArrowRight /> بازگشت به فهرست
            </Link>
          </Button>
        }
      />
      <ContentForm
        target={{ kind: "collection", key: section.key, id: null }}
        fields={section.fields}
        initial={initial}
        options={await loadOptions()}
      />
    </>
  );
}
