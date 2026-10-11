import "server-only";
import { listDocuments } from "@/lib/server/store";
import type { Subsidiary } from "@/lib/content/types";
import type { ResolvedOptions } from "./fields";

/** Current values for the dynamic option lists used by select fields. */
export async function loadOptions(): Promise<ResolvedOptions> {
  return {
    subsidiaries: listDocuments<Subsidiary>("subsidiaries").map((s) => ({ value: s.slug, label: s.name })),
  };
}
