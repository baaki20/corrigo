import { prisma } from "./prisma";
import type { DossierRecord, EvidenceGrade, RichTextNode, SourceType } from "./types";

const demoBody: RichTextNode = {
  type: "doc",
  content: [
    { type: "paragraph", content: [{ type: "text", text: "This preview dossier shows how Corrigo separates a claim from the evidence used to test it." }] },
    { type: "heading", attrs: { level: 2 }, content: [{ type: "text", text: "How the evidence is weighed" }] },
    { type: "paragraph", content: [{ type: "text", text: "A source is not a magic stamp of truth. We look at what was measured, who measured it, how the finding was reported, and where the limits are." }] },
  ],
};

const demoDossiers: DossierRecord[] = [
  {
    id: "demo-1",
    slug: "how-corrigo-weighs-evidence",
    title: "How Corrigo weighs evidence",
    summary: "A field guide to separating a compelling claim from the evidence that can actually support it.",
    claim: "A clear source list is enough to make a research claim trustworthy.",
    conclusion: "Sources matter, but the quality of a claim also depends on context, methods, and what the evidence cannot show.",
    grade: "CONTEXT_DEPENDENT",
    body: demoBody,
    youtubeUrl: "https://www.youtube.com/@corrigo_gh",
    status: "PUBLISHED",
    publishedAt: new Date("2026-08-18"),
    reviewedAt: new Date("2026-08-20"),
    topics: [{ name: "Media literacy", slug: "media-literacy" }],
    sources: [
      { id: "source-1", title: "Corrigo research method", publisher: "Corrigo", type: "OTHER", url: "https://www.youtube.com/@corrigo_gh", note: "Development preview source." },
    ],
  },
  {
    id: "demo-2",
    slug: "why-context-changes-a-claim",
    title: "Why context changes a claim",
    summary: "The same sentence can be technically true and still leave a very wrong impression.",
    claim: "A statistic speaks for itself once it has been published.",
    conclusion: "Numbers need definitions, denominators, and a clear account of what was left out.",
    grade: "MISLEADING",
    body: demoBody,
    youtubeUrl: "https://www.youtube.com/@corrigo_gh",
    status: "PUBLISHED",
    publishedAt: new Date("2026-08-12"),
    reviewedAt: new Date("2026-08-19"),
    topics: [{ name: "Statistics", slug: "statistics" }],
    sources: [
      { id: "source-2", title: "Understanding data in context", publisher: "Corrigo", type: "REFERENCE", url: "https://www.youtube.com/@corrigo_gh", note: "Development preview source." },
    ],
  },
];

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
  await publishDueDossiers();
  if (!process.env.DATABASE_URL) {
    return demoDossiers.filter((d) => matches(d, options));
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

const matches = (d: DossierRecord, options: { query?: string; topic?: string; grade?: string }) => {
  const query = options.query?.toLowerCase();
  return (!query || [d.title, d.summary, d.claim].some((value) => value.toLowerCase().includes(query)))
    && (!options.topic || d.topics.some((topic) => topic.slug === options.topic))
    && (!options.grade || d.grade === options.grade);
};

export async function getDossier(slug: string, includeDrafts = false) {
  await publishDueDossiers();
  if (!process.env.DATABASE_URL) return demoDossiers.find((d) => d.slug === slug) ?? null;
  const row = await prisma.dossier.findFirst({ where: { slug, ...(includeDrafts ? {} : { status: "PUBLISHED" }) }, include });
  return row ? normalize(row) : null;
}

export async function getDossierById(id: string) {
  if (!process.env.DATABASE_URL) return demoDossiers.find((d) => d.id === id) ?? null;
  const row = await prisma.dossier.findUnique({ where: { id }, include });
  return row ? normalize(row) : null;
}

export async function getTopics() {
  if (!process.env.DATABASE_URL) return [...new Map(demoDossiers.flatMap((d) => d.topics).map((t) => [t.slug, t])).values()];
  return prisma.topic.findMany({ orderBy: { name: "asc" } });
}
