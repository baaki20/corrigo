import { PrismaClient, EvidenceGrade, DossierStatus, SourceType } from "@prisma/client";

const prisma = new PrismaClient();

const body = {
  type: "doc",
  content: [
    { type: "paragraph", content: [{ type: "text", text: "This is a development fixture for the Corrigo evidence desk. Replace it with your first published investigation." }] },
    { type: "heading", attrs: { level: 2 }, content: [{ type: "text", text: "How Corrigo works" }] },
    { type: "paragraph", content: [{ type: "text", text: "Every dossier starts with a claim, follows the strongest available evidence, and makes the limits of that evidence visible." }] }
  ]
};

async function main() {
  const topic = await prisma.topic.upsert({
    where: { slug: "media-literacy" },
    update: {},
    create: { name: "Media literacy", slug: "media-literacy" }
  });

  await prisma.dossier.upsert({
    where: { slug: "how-corrigo-weighs-evidence" },
    update: {},
    create: {
      slug: "how-corrigo-weighs-evidence",
      title: "How Corrigo weighs evidence",
      summary: "A development fixture that explains the structure behind every Corrigo dossier.",
      claim: "A clear source list is enough to make a research claim trustworthy.",
      conclusion: "Sources matter, but the quality of a claim also depends on context, methods, and what the evidence cannot show.",
      grade: EvidenceGrade.CONTEXT_DEPENDENT,
      body,
      youtubeUrl: "https://www.youtube.com/",
      status: DossierStatus.DRAFT,
      topics: { create: { topicId: topic.id } },
      sources: {
        create: {
          title: "Corrigo research method (development note)",
          publisher: "Corrigo",
          type: SourceType.OTHER,
          url: "https://www.youtube.com/",
          note: "Replace this fixture source before publishing."
        }
      }
    }
  });
}

main().finally(() => prisma.$disconnect());
