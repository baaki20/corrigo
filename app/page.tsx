import Link from "next/link";
import { DossierCard } from "@/components/dossier-card";
import { getDossiers } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function Home() {
  const dossiers = await getDossiers();
  return <main>
    <section className="hero">
      <div><span className="kicker">Corrigo / evidence desk</span><h1>Look closer.<br /><em>Think clearer.</em></h1><p className="hero-intro">Research for the words, topics, and claims we think we understand — until we look at the evidence.</p></div>
      <p className="hero-note"><strong>{dossiers.length.toString().padStart(2, "0")}</strong> evidence dossiers ready to inspect.<br />No hand-waving. No “trust me.”</p>
    </section>
    <section><div className="section-heading"><div><span className="kicker">The latest files</span><h2>Open the case notes</h2></div><Link href="/library">View all →</Link></div>{dossiers.length ? <div className="dossier-grid">{dossiers.slice(0, 3).map((dossier, index) => <DossierCard dossier={dossier} index={index} key={dossier.id} />)}</div> : <div className="empty-state home-empty">The public library is empty for now. New Corrigo investigations will appear here when they are published.</div>}</section>
    <section className="pullquote"><small>01 / The Corrigo promise</small><p>“Nothing here asks you to take our word for it. Check the sources yourself.”</p></section>
  </main>;
}
