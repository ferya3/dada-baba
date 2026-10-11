import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, ExternalLink } from "lucide-react";
import { getSection } from "@/lib/admin/sections";
import { loadOptions } from "@/lib/admin/options";
import { readDocument } from "@/lib/server/store";
import { removeDocument } from "@/app/admin/actions";
import { ContentForm } from "@/components/admin/ContentForm";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { PageTitle } from "@/components/admin/PageTitle";
import { Button } from "@/components/ui/button";

type Props = { params: Promise<{ section: string; id: string }> };

export default async function EditDocumentPage({ params }: Props) {
  const { section: key, id: rawId } = await params;
  const id = decodeURIComponent(rawId);
  const section = getSection(key);
  if (section?.kind !== "collection") notFound();
  const doc = readDocument<Record<string, unknown>>(section.key, id);
  if (!doc) notFound();

  const title = String(doc[section.titleField] ?? section.singular);

  return (
    <>
      <PageTitle
        title={title}
        description={`ویرایش ${section.singular}`}
        actions={
          <>
            <Button asChild variant="outline">
              <Link href={`/admin/${section.key}`}>
                <ArrowRight /> بازگشت به فهرست
              </Link>
            </Button>
            {section.publicPath && (
              <Button asChild variant="outline">
                <a href={section.publicPath(id)} target="_blank" rel="noopener noreferrer">
                  <ExternalLink /> مشاهده در سایت
                </a>
              </Button>
            )}
            <DeleteButton
              action={removeDocument.bind(null, section.key, id)}
              confirmText={`«${title}» برای همیشه حذف شود؟`}
            />
          </>
        }
      />
      <ContentForm
        key={id}
        target={{ kind: "collection", key: section.key, id }}
        fields={section.fields}
        initial={doc}
        options={await loadOptions()}
        locked={section.idField === "slug" ? ["slug"] : []}
      />
    </>
  );
}
