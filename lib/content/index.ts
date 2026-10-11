import "server-only";
import { cache } from "react";
import { listDocuments, readDocument, readSingleton } from "@/lib/server/store";
import type {
  HoldingProfile,
  HomeContent,
  Job,
  NewsPost,
  PagesContent,
  Project,
  Service,
  SiteSettings,
  Subsidiary,
} from "./types";

/*
 * Content access for the public site. Pages only read content through these
 * functions; the data lives in SQLite and is edited from the admin panel.
 * `cache` dedupes reads within one render.
 */

export const getSettings = cache(async () => readSingleton<SiteSettings>("settings"));
export const getHome = cache(async () => readSingleton<HomeContent>("home"));
export const getPages = cache(async () => readSingleton<PagesContent>("pages"));
export const getHolding = cache(async () => readSingleton<HoldingProfile>("about"));

export const getSubsidiaries = cache(async () => listDocuments<Subsidiary>("subsidiaries"));

export async function getSubsidiary(slug: string) {
  return readDocument<Subsidiary>("subsidiaries", slug);
}

export const getServices = cache(async () => listDocuments<Service>("services"));

export async function getProjects(subsidiary?: string) {
  const projects = listDocuments<Project>("projects");
  return subsidiary ? projects.filter((p) => p.subsidiary === subsidiary) : projects;
}

export async function getNews(subsidiary?: string) {
  const sorted = listDocuments<NewsPost>("news").sort((a, b) => b.date.localeCompare(a.date));
  return subsidiary ? sorted.filter((n) => n.subsidiary === subsidiary) : sorted;
}

export async function getNewsPost(slug: string) {
  return readDocument<NewsPost>("news", slug);
}

export const getJobs = cache(async () => listDocuments<Job>("jobs"));

export type * from "./types";
