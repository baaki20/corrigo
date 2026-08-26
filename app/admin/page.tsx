import Link from "next/link";
import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth";
import { getDossiers } from "@/lib/data";
import { displayDate, gradeLabels } from "@/lib/types";
import { logout, deleteDossier, publishDossier } from "@/app/actions";

export const dynamic = "force-dynamic";

export default async function AdminPage({ searchParams }: { searchParams: Promise<{ message?: string }> }) {
  if (!(await getAdminSession())) redirect("/admin/login");
  const dossiers = await getDossiers({ includeDrafts: true });
  const params = await searchParams;
  return <main className="admin-shell"><header className="admin-top"><div><span className="kicker">Corrigo / private desk</span><h1>Evidence files</h1></div><div className="admin-actions"><Link className="admin-button" href="/admin/evidence/new">+ New dossier</Link><form action={logout}><button className="admin-button secondary" type="submit">Sign out</button></form></div></header>{params.message && <p className="error">{params.message === "database-needed" ? "Connect DATABASE_URL to save dossiers." : `Dossier ${params.message}.`}</p>}<div className="admin-table">{dossiers.map((dossier) => <div className="admin-row" key={dossier.id}><div><Link href={`/admin/evidence/${dossier.id}/edit`}>{dossier.title}</Link><small>{dossier.slug}</small></div><small>{gradeLabels[dossier.grade]} · {dossier.status.toLowerCase()}</small><small>{displayDate(dossier.reviewedAt)}</small><div className="admin-actions"><Link className="admin-button secondary" href={`/admin/evidence/${dossier.id}/edit`}>Edit</Link><Link className="admin-button secondary" href={`/evidence/${dossier.slug}${dossier.status === "PUBLISHED" ? "" : "?preview=1"}`}>View</Link>{dossier.status !== "PUBLISHED" && !dossier.id.startsWith("demo-") && <form action={publishDossier}><input type="hidden" name="id" value={dossier.id} /><button className="admin-button" type="submit">Publish</button></form>}{dossier.id.startsWith("demo-") ? null : <form action={deleteDossier}><input type="hidden" name="id" value={dossier.id} /><button className="admin-button secondary" type="submit">Delete</button></form>}</div></div>)}</div></main>;
}
