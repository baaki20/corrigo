import { prisma } from "./prisma";
import type { DossierRecord, EvidenceGrade, RichTextNode, SourceType } from "./types";

const normalize = (d: any): DossierRecord => ({
  id: d.id,
  slug: d.slug,
  title: d.title,
  summary: d.summary,
  claim: d.claim,
  conclusion: d.conclusion,
  grade: d.grade as EvidenceGrade,
  body: d.body as RichTextNode,
  youtubeUrl: d.youtubeUrl,
  status: d.status,
  scheduledAt: d.scheduledAt,
  publishedAt: d.publishedAt,
  reviewedAt: d.reviewedAt,
  sources: (d.sources ?? []).sort((a: any, b: any) => a.sortOrder - b.sortOrder).map((s: any) => ({
    id: s.id, title: s.title, publisher: s.publisher, type: s.type as SourceType, url: s.url, publicationDate: s.publicationDate, note: s.note,
  })),
  topics: (d.topics ?? []).map((t: any) => ({ name: t.topic?.name ?? t.name, slug: t.topic?.slug ?? t.slug })),
});

const include = { sources: true, topics: { include: { topic: true } } } as const;

export async function publishDueDossiers() {
  if (!process.env.DATABASE_URL) return 0;
  const result = await prisma.dossier.updateMany({
    where: { status: "SCHEDULED", scheduledAt: { lte: new Date() } },
    data: { status: "PUBLISHED", publishedAt: new Date(), reviewedAt: new Date(), scheduledAt: null },
  });
  return result.count;
}

export async function getDossiers(options: { query?: string; topic?: string; grade?: string; includeDrafts?: boolean } = {}) {
  if (!process.env.DATABASE_URL) {
    return [];
  }

  const rows = await prisma.dossier.findMany({
    where: {
      ...(options.includeDrafts ? {} : { status: "PUBLISHED" }),
      ...(options.grade ? { grade: options.grade as any } : {}),
      ...(options.topic ? { topics: { some: { topic: { slug: options.topic } } } } : {}),
      ...(options.query ? { OR: [{ title: { contains: options.query, mode: "insensitive" } }, { claim: { contains: options.query, mode: "insensitive" } }, { summary: { contains: options.query, mode: "insensitive" } }] } : {}),
    },
    include,
    orderBy: [{ publishedAt: "desc" }, { updatedAt: "desc" }],
  });
  return rows.map(normalize);
}

export async function getDossier(slug: string, includeDrafts = false) {
  if (!process.env.DATABASE_URL) return null;
  const row = await prisma.dossier.findFirst({ where: { slug, ...(includeDrafts ? {} : { status: "PUBLISHED" }) }, include });
  return row ? normalize(row) : null;
}

export async function getDossierById(id: string) {
  if (!process.env.DATABASE_URL) return null;
  const row = await prisma.dossier.findUnique({ where: { id }, include });
  return row ? normalize(row) : null;
}

export async function getTopics() {
  if (!process.env.DATABASE_URL) return [];
  return prisma.topic.findMany({ orderBy: { name: "asc" } });
}
