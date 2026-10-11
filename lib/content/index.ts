import "server-only";
import { holding, jobs, news, projects, services, subsidiaries } from "./data";

/*
 * Content access layer. Every page reads content through these async functions,
 * so switching to a headless CMS (e.g. Sanity's `client.fetch(groq)`) only
 * means re-implementing them here.
 */

export async function getHolding() {
  return holding;
}

export async function getSubsidiaries() {
  return subsidiaries;
}

export async function getSubsidiary(slug: string) {
  return subsidiaries.find((s) => s.slug === slug) ?? null;
}

export async function getServices() {
  return services;
}

export async function getProjects(subsidiary?: string) {
  return subsidiary ? projects.filter((p) => p.subsidiary === subsidiary) : projects;
}

export async function getNews(subsidiary?: string) {
  const sorted = [...news].sort((a, b) => b.date.localeCompare(a.date));
  return subsidiary ? sorted.filter((n) => n.subsidiary === subsidiary) : sorted;
}

export async function getNewsPost(slug: string) {
  return news.find((n) => n.slug === slug) ?? null;
}

export async function getJobs() {
  return jobs;
}

export type { HoldingProfile, Job, NewsPost, Project, Service, Subsidiary } from "./types";
