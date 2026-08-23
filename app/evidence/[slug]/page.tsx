import Link from "next/link";
import { notFound } from "next/navigation";
import { DossierCard } from "@/components/dossier-card";
import { GradeBadge } from "@/components/grade-badge";
import { RichText } from "@/components/rich-text";
import { getDossier, getDossiers } from "@/lib/data";
import { displayDate, sourceTypeLabels } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function EvidencePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const dossier = await getDossier(slug);
  if (!dossier) notFound();
  const related = (await getDossiers({ topic: dossier.topics[0]?.slug })).filter((item) => item.slug !== dossier.slug).slice(0, 2);
  return <main className="post">
    <header className="post-head"><span className="kicker">Evidence file / {dossier.topics[0]?.name || "Research"}</span><h1>{dossier.title}</h1><GradeBadge grade={dossier.grade} large /><p className="post-summary">{dossier.summary}</p><div className="post-meta"><span>Reviewed {displayDate(dossier.reviewedAt)}</span><span>·</span><span>{dossier.sources.length} sources</span></div><a className="video-link" href={dossier.youtubeUrl} target="_blank" rel="noreferrer">Watch the original Corrigo video ↗</a></header>
    <section className="claim-box"><p>{dossier.claim}</p></section>
    <section className="evidence-layout"><div><h2>What the evidence says</h2><RichText body={dossier.body} /><div className="review-note"><strong>Corrigo’s conclusion:</strong> {dossier.conclusion}</div></div><aside className="source-rail"><h2>Sources / {dossier.sources.length}</h2>{dossier.sources.map((source, index) => <div className="source-card" key={source.id}><a href={source.url} target="_blank" rel="noreferrer">{index + 1}. {source.title} ↗</a><small>{source.publisher} · {sourceTypeLabels[source.type]}</small>{source.note && <p>{source.note}</p>}</div>)}</aside></section>
    {related.length > 0 && <section className="related"><div className="section-heading"><h2>Keep looking</h2><span className="kicker">Related files</span></div><div className="dossier-grid">{related.map((item, index) => <DossierCard dossier={item} index={index} key={item.id} />)}</div></section>}
    <Link className="back-link" href="/library">← Return to the library</Link>
  </main>;
}
