import { siteConfig } from "@/lib/site";
import { absoluteUrl } from "@/lib/utils";
import type { Subsidiary } from "@/lib/content/types";

/** Serialises structured data, escaping `<` so content can't break out of the script tag. */
export function JsonLd({ data }: { data: Record<string, unknown> | Record<string, unknown>[] }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}

const holdingId = absoluteUrl("/#organization");

export function subsidiaryOrganization(s: Subsidiary) {
  return {
    "@type": "Organization",
    "@id": absoluteUrl(`/subsidiaries/${s.slug}#organization`),
    name: s.name,
    alternateName: s.nameEn,
    url: absoluteUrl(`/subsidiaries/${s.slug}`),
    description: s.summary,
    slogan: s.tagline,
    knowsAbout: s.capabilities,
    parentOrganization: { "@id": holdingId },
  };
}

/** Schema.org Organization for the holding, listing the subsidiaries as sub-organizations. */
export function holdingOrganization(subsidiaries: Subsidiary[]) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": holdingId,
    name: siteConfig.name,
    alternateName: siteConfig.nameEn,
    url: siteConfig.url,
    logo: absoluteUrl("/icon.svg"),
    description: siteConfig.description,
    email: siteConfig.contact.email,
    telephone: siteConfig.contact.phone,
    address: { "@type": "PostalAddress", streetAddress: siteConfig.contact.address, addressCountry: "IR" },
    sameAs: siteConfig.social.map((s) => s.href),
    subOrganization: subsidiaries.map((s) => ({
      "@type": "Organization",
      "@id": absoluteUrl(`/subsidiaries/${s.slug}#organization`),
      name: s.name,
      url: absoluteUrl(`/subsidiaries/${s.slug}`),
    })),
  };
}

export function breadcrumbs(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}
