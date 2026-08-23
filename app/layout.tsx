import type { Metadata } from "next";
import "./globals.css";
import { SiteFooter, SiteHeader } from "@/components/site-header";

export const metadata: Metadata = { title: { default: "Corrigo — evidence desk", template: "%s · Corrigo" }, description: "Corrigo researches commonly misunderstood words, topics, and claims — and shows you what the evidence actually says." };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body><div className="site-shell"><SiteHeader />{children}<SiteFooter /></div></body></html>;
}
