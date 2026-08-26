"use client";

import { useState } from "react";

export function CopyLink() {
  const [copied, setCopied] = useState(false);
  async function copy() {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }
  return <button type="button" className="copy-link" onClick={copy}>{copied ? "Link copied" : "Copy link"}</button>;
}
