"use client";

import Link from "next/link";

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <main className="recovery-shell"><section className="recovery-card"><span className="kicker">Corrigo / temporary interruption</span><h1>The desk needs a moment.</h1><p>The evidence desk could not load right now. This is usually a short connection or deployment interruption. Try again, or return to the library.</p><div className="admin-actions"><button className="admin-button" onClick={() => reset()}>Try again</button><Link href="/library" className="admin-button secondary">Open library</Link></div></section></main>;
}
