import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth";
import { saveDossier } from "@/app/actions";
import { DossierEditor } from "@/components/dossier-editor";

export default async function NewDossierPage() {
  if (!(await getAdminSession())) redirect("/admin/login");
  return <main className="admin-shell"><header className="admin-top"><div><span className="kicker">New evidence file</span><h1>Write the finding.</h1></div></header><DossierEditor action={saveDossier} /></main>;
}
