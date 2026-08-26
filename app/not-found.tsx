import Link from "next/link";

export default function NotFound() {
  return <main className="recovery-shell"><div className="recovery-card"><span className="kicker">Corrigo / file not found</span><h1>This file is not here.</h1><p>It may not have been published yet, or the link may have changed.</p><Link href="/library">Return to the library</Link></div></main>;
}
