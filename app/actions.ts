"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getDossierById } from "@/lib/data";
import { createAdminSession, clearAdminSession, requireAdmin } from "@/lib/auth";

export async function login(formData: FormData) {
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");
  if (email !== (process.env.CORRIGO_ADMIN_EMAIL || "you@example.com") || password !== (process.env.CORRIGO_ADMIN_PASSWORD || "corrigo")) {
    redirect("/admin/login?error=invalid");
  }
  await createAdminSession(email);
  redirect("/admin");
}

export async function logout() {
  await clearAdminSession();
  redirect("/admin/login");
}

export async function deleteDossier(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id"));
  if (process.env.DATABASE_URL) await prisma.dossier.delete({ where: { id } });
  revalidatePath("/admin");
  redirect("/admin");
}

export async function saveDossier(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") || "");
  const title = String(formData.get("title") || "").trim();
  const slug = String(formData.get("slug") || "").trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  const youtubeUrl = String(formData.get("youtubeUrl") || "").trim();
  const timing = String(formData.get("timing") || "DRAFT");
  const scheduledInput = String(formData.get("scheduledAt") || "").trim();
  const topic = String(formData.get("topic") || "Media literacy").trim();
  const body = JSON.parse(String(formData.get("body") || '{"type":"doc","content":[]}'));
  const sourceData = JSON.parse(String(formData.get("sources") || "[]"));
  if (!process.env.DATABASE_URL) redirect("/admin?message=database-needed");

  const existing = id ? await getDossierById(id) : null;
  const scheduledAt = timing === "SCHEDULED" && scheduledInput ? new Date(scheduledInput) : null;
  if (timing === "SCHEDULED" && (!scheduledAt || Number.isNaN(scheduledAt.getTime()) || scheduledAt <= new Date())) redirect("/admin?message=schedule-must-be-in-the-future");

  const topicSlug = topic.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  const topicRecord = await prisma.topic.upsert({ where: { slug: topicSlug }, update: { name: topic }, create: { slug: topicSlug, name: topic } });
  const values: any = {
    title,
    slug,
    summary: String(formData.get("summary") || "").trim(),
    claim: String(formData.get("claim") || "").trim(),
    conclusion: String(formData.get("conclusion") || "").trim(),
    grade: String(formData.get("grade") || "UNCLEAR") as any,
    youtubeUrl,
    body,
    status: timing === "PUBLISHED" ? "PUBLISHED" : timing === "SCHEDULED" ? "SCHEDULED" : "DRAFT",
    scheduledAt,
    publishedAt: timing === "PUBLISHED" ? existing?.publishedAt || new Date() : null,
  };
  const dossier = id ? await prisma.dossier.update({ where: { id }, data: values }) : await prisma.dossier.create({ data: values });
  await prisma.dossierTopic.deleteMany({ where: { dossierId: dossier.id } });
  await prisma.dossierTopic.create({ data: { dossierId: dossier.id, topicId: topicRecord.id } });
  await prisma.source.deleteMany({ where: { dossierId: dossier.id } });
  if (Array.isArray(sourceData)) await prisma.source.createMany({ data: sourceData.map((source: any, index: number) => ({ dossierId: dossier.id, title: source.title, publisher: source.publisher, type: source.type || "OTHER", url: source.url, note: source.note || null, sortOrder: index })) });
  revalidatePath("/"); revalidatePath("/library"); revalidatePath(`/evidence/${slug}`); revalidatePath("/admin");
  redirect("/admin?message=saved");
}

export async function publishDossier(formData: FormData) {
  await requireAdmin();
  if (process.env.DATABASE_URL) await prisma.dossier.update({ where: { id: String(formData.get("id")) }, data: { status: "PUBLISHED", publishedAt: new Date(), reviewedAt: new Date() } });
  revalidatePath("/"); revalidatePath("/library");
  redirect("/admin?message=published");
}
