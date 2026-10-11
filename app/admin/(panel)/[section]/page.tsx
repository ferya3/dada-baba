import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowDown, ArrowUp, ExternalLink, Pencil, Plus } from "lucide-react";
import { getSection, type CollectionSection } from "@/lib/admin/sections";
import { loadOptions } from "@/lib/admin/options";
import { listDocuments, readSingleton } from "@/lib/server/store";
import { reorderDocument } from "@/app/admin/actions";
import { ContentForm } from "@/components/admin/ContentForm";
import { PageTitle } from "@/components/admin/PageTitle";
import { Button } from "@/components/ui/button";
import { toFaDigits, toFaNumber } from "@/lib/utils";

type Props = { params: Promise<{ section: string }> };

export async function generateMetadata({ params }: Props) {
  return { title: getSection((await params).section)?.title };
}

export default async function SectionPage({ params }: Props) {
  const section = getSection((await params).section);
  if (!section) notFound();

  if (section.kind === "singleton") {
    return (
      <>
        <PageTitle title={section.title} description={section.description} />
        <ContentForm
          target={{ kind: "singleton", key: section.key }}
          fields={section.fields}
          initial={readSingleton(section.key)}
          options={await loadOptions()}
        />
      </>
    );
  }

  return <CollectionList section={section} />;
}

type Doc = Record<string, unknown> & { slug?: string; id?: string };

function cell(value: unknown) {
  if (value === undefined || value === null || value === "") return "—";
  return typeof value === "number" ? toFaDigits(value) : String(value);
}

function CollectionList({ section }: { section: CollectionSection }) {
  const docs = listDocuments<Doc>(section.key);
  const idOf = (d: Doc) => String(section.idField === "slug" ? d.slug : d.id);

  return (
    <>
      <PageTitle
        title={section.title}
        description={section.description}
        actions={
          <Button asChild>
            <Link href={`/admin/${section.key}/new`}>
              <Plus /> {section.singular} جدید
            </Link>
          </Button>
        }
      />

      {docs.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border p-12 text-center text-muted-foreground">
          هنوز موردی ثبت نشده است.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full min-w-[36rem] text-sm">
            <thead className="bg-card/60 text-muted-foreground">
              <tr>
                <th className="w-12 px-4 py-3 text-start font-medium">#</th>
                <th className="px-4 py-3 text-start font-medium">عنوان</th>
                {section.columns.map((c) => (
                  <th key={c.field} className="px-4 py-3 text-start font-medium">
                    {c.label}
                  </th>
                ))}
                <th className="w-48 px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {docs.map((doc, i) => {
                const id = idOf(doc);
                return (
                  <tr key={id} className="border-t border-border transition-colors hover:bg-white/[0.02]">
                    <td className="px-4 py-3 text-muted-foreground tabular-nums">{toFaNumber(i + 1)}</td>
                    <td className="px-4 py-3">
                      <Link href={`/admin/${section.key}/${id}`} className="flex items-center gap-2 font-medium hover:text-primary">
                        {typeof doc.color === "string" && (
                          <span className="size-3 shrink-0 rounded-full" style={{ background: doc.color }} aria-hidden />
                        )}
                        {cell(doc[section.titleField])}
                      </Link>
                    </td>
                    {section.columns.map((c) => (
                      <td key={c.field} className="px-4 py-3 text-muted-foreground">
                        {cell(doc[c.field])}
                      </td>
                    ))}
                    <td className="px-4 py-2">
                      <div className="flex items-center justify-end gap-1">
                        {section.orderable && (
                          <>
                            <form action={reorderDocument.bind(null, section.key, id, "up")}>
                              <Button type="submit" variant="ghost" size="icon" className="size-9" disabled={i === 0} aria-label="انتقال به بالا">
                                <ArrowUp />
                              </Button>
                            </form>
                            <form action={reorderDocument.bind(null, section.key, id, "down")}>
                              <Button
                                type="submit"
                                variant="ghost"
                                size="icon"
                                className="size-9"
                                disabled={i === docs.length - 1}
                                aria-label="انتقال به پایین"
                              >
                                <ArrowDown />
                              </Button>
                            </form>
                          </>
                        )}
                        {section.publicPath && (
                          <Button asChild variant="ghost" size="icon" className="size-9" aria-label="مشاهده در سایت">
                            <a href={section.publicPath(id)} target="_blank" rel="noopener noreferrer">
                              <ExternalLink />
                            </a>
                          </Button>
                        )}
                        <Button asChild variant="ghost" size="icon" className="size-9" aria-label="ویرایش">
                          <Link href={`/admin/${section.key}/${id}`}>
                            <Pencil />
                          </Link>
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
