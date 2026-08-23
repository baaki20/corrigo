import { DossierCard } from "@/components/dossier-card";
import { SearchControls } from "@/components/search-controls";
import { getDossiers, getTopics } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function Library({ searchParams }: { searchParams: Promise<{ q?: string; topic?: string; grade?: string }> }) {
  const params = await searchParams;
  const [dossiers, topics] = await Promise.all([getDossiers({ query: params.q, topic: params.topic, grade: params.grade }), getTopics()]);
  return <main>
    <header className="library-header"><div><span className="kicker">The library</span><h1>Evidence,<br />filed.</h1></div><p>Every Corrigo video begins with a question. This is where the sources, caveats, and conclusions live.</p></header>
    <SearchControls query={params.q} topic={params.topic} grade={params.grade} topics={topics} />
    <div className="section-heading"><p>{dossiers.length} {dossiers.length === 1 ? "dossier" : "dossiers"} found</p><span className="kicker">Most recent first</span></div>
    {dossiers.length ? <div className="dossier-grid">{dossiers.map((dossier, index) => <DossierCard dossier={dossier} index={index} key={dossier.id} />)}</div> : <p className="empty-state">No file matches that search yet. Try a broader claim or browse all notes.</p>}
  </main>;
}
