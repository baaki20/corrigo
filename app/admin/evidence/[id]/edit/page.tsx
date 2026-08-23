import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth";
import { getDossierById } from "@/lib/data";
import { saveDossier } from "@/app/actions";
import { DossierEditor } from "@/components/dossier-editor";

export const dynamic = "force-dynamic";

export default async function EditDossierPage({ params }: { params: Promise<{ id: string }> }) {
  if (!(await getAdminSession())) redirect("/admin/login");
  const dossier = await getDossierById((await params).id);
  if (!dossier) redirect("/admin");
  return <main className="admin-shell"><header className="admin-top"><div><span className="kicker">Editing evidence file</span><h1>{dossier.title}</h1></div></header><DossierEditor action={saveDossier} id={dossier.id} initial={dossier} /></main>;
}
