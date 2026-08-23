import { notFound } from "next/navigation";
import { DossierCard } from "@/components/dossier-card";
import { getDossiers, getTopics } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function TopicPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const topics = await getTopics();
  const topic = topics.find((item) => item.slug === slug);
  if (!topic) notFound();
  const dossiers = await getDossiers({ topic: slug });
  return <main><header className="library-header"><div><span className="kicker">Topic file</span><h1>{topic.name}</h1></div><p>{dossiers.length} Corrigo {dossiers.length === 1 ? "dossier" : "dossiers"} in this area of the desk.</p></header><div className="dossier-grid">{dossiers.map((dossier, index) => <DossierCard dossier={dossier} index={index} key={dossier.id} />)}</div></main>;
}
