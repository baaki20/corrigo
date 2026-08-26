import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="site-header">
      <Link className="brand" href="/">
        <span className="brand-mark">C</span>
        <span><strong>Corrigo</strong><small>evidence desk</small></span>
      </Link>
      <nav aria-label="Main navigation">
        <Link href="/library">Library</Link>
        <Link href="/about/methodology">Method</Link>
        <a href="https://www.youtube.com/@corrigo_gh" target="_blank" rel="noreferrer">YouTube ↗</a>
      </nav>
    </header>
  );
}

export function SiteFooter() {
  return <footer className="site-footer"><p>Corrigo researches the claim. You check the sources.</p><div className="footer-right"><nav className="social-links" aria-label="Corrigo social links"><span>Follow the desk</span><a href="https://www.youtube.com/@corrigo_gh" target="_blank" rel="noreferrer">YouTube ↗</a><a href="https://www.instagram.com/corrigo_gh/" target="_blank" rel="noreferrer">Instagram ↗</a><a href="https://www.tiktok.com/@corrigo_gh" target="_blank" rel="noreferrer">TikTok ↗</a></nav><span>© {new Date().getFullYear()} Corrigo</span></div></footer>;
}
