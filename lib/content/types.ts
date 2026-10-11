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

/** A full-page screenshot of a site. Width/height are the file's pixel size (used to reserve layout space). */
export type Screenshot = { src: string; width: number; height: number };

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
  /** The subsidiary's own website, if it has one. */
  website?: string;
  /** Screenshot of the website, shown in the home page showcase and the subsidiary page. */
  screenshot: Screenshot;
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

export type SocialLink = { label: string; href: string };

/** Global settings editable from the admin panel. */
export type SiteSettings = {
  name: string;
  nameEn: string;
  shortName: string;
  description: string;
  foundedYear: number;
  email: string;
  phone: string;
  address: string;
  social: SocialLink[];
};

type Heading = { title: string; description: string };

/** Editable copy on the home page. */
export type HomeContent = {
  hero: { badge: string; title: string; description: string };
  intro: { title: string };
  showcase: Heading;
  projects: { title: string };
  services: Heading;
  news: { title: string };
  cta: Heading;
};

export type PageKey = "about" | "subsidiaries" | "services" | "projects" | "news" | "careers" | "contact";

/** Header copy (title + description) of each inner page. */
export type PagesContent = Record<PageKey, Heading>;

export type ContactMessage = {
  id: number;
  name: string;
  email: string;
  company: string;
  subsidiary: string;
  message: string;
  createdAt: string;
  read: boolean;
};

export type JobApplication = {
  id: number;
  jobId: string;
  jobTitle: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  resumeName: string;
  createdAt: string;
  read: boolean;
};
