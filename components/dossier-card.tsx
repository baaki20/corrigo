import Link from "next/link";
import { displayDate, type DossierRecord } from "@/lib/types";
import { GradeBadge } from "./grade-badge";

export function DossierCard({ dossier, index = 0 }: { dossier: DossierRecord; index?: number }) {
  return (
    <Link className="dossier-card" href={`/evidence/${dossier.slug}`} style={{ "--delay": `${index * 70}ms` } as React.CSSProperties}>
      <div className="card-topline"><span>{dossier.topics[0]?.name || "Field note"}</span><span>{displayDate(dossier.publishedAt)}</span></div>
      <GradeBadge grade={dossier.grade} />
      <h3>{dossier.title}</h3>
      <p>{dossier.summary}</p>
      <span className="card-arrow">Read the evidence <b>↗</b></span>
    </Link>
  );
}
