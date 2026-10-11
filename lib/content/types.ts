/**
 * Content model. These shapes mirror the documents a headless CMS
 * (Sanity / Strapi / Contentful) would expose, so the local data source in
 * `data.ts` can be swapped for CMS queries without touching any page.
 */

export type IconKey =
  | "building"
  | "zap"
  | "cpu"
  | "ship"
  | "chart"
  | "factory"
  | "network"
  | "leaf"
  | "shield"
  | "lightbulb"
  | "handshake"
  | "target"
  | "compass"
  | "layers";

/** Which procedural 3D form represents a subsidiary in its hero. */
export type SceneShape = "towers" | "crystal" | "grid" | "waves" | "rings";

export type Stat = { label: string; value: number; suffix?: string };

export type TimelineEntry = { year: number; title: string; description: string };

export type Subsidiary = {
  slug: string;
  name: string;
  nameEn: string;
  sector: string;
  tagline: string;
  summary: string;
  description: string[];
  icon: IconKey;
  /** Brand accent used for glows, 3D materials and highlights. */
  color: string;
  shape: SceneShape;
  founded: number;
  stats: Stat[];
  timeline: TimelineEntry[];
  capabilities: string[];
};

export type Service = {
  id: string;
  title: string;
  description: string;
  icon: IconKey;
  subsidiaries: string[];
};

export type Project = {
  slug: string;
  title: string;
  subsidiary: string;
  year: number;
  location: string;
  category: string;
  summary: string;
  highlight: string;
};

export type NewsPost = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  category: "خبر" | "دیدگاه" | "گزارش";
  subsidiary?: string;
  readingMinutes: number;
  body: string[];
};

export type Job = {
  id: string;
  title: string;
  subsidiary: string;
  department: string;
  location: string;
  type: "تمام‌وقت" | "پاره‌وقت" | "کارآموزی" | "قراردادی";
};

export type Leader = { name: string; role: string };

export type HoldingProfile = {
  mission: string;
  vision: string;
  story: string[];
  values: { title: string; description: string; icon: IconKey }[];
  stats: Stat[];
  timeline: TimelineEntry[];
  leadership: Leader[];
  benefits: { title: string; description: string; icon: IconKey }[];
};
