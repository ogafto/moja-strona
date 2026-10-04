import type { Metadata, Viewport } from "next";
import type { CSSProperties } from "react";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import "./globals.css";
import { getContent } from "@/lib/cms";

const sans = Geist({ subsets: ["latin", "latin-ext"], variable: "--font-geist" });
const mono = Geist_Mono({ subsets: ["latin", "latin-ext"], variable: "--font-geist-mono" });
const serif = Instrument_Serif({
  subsets: ["latin", "latin-ext"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-instrument",
});

export async function generateMetadata(): Promise<Metadata> {
  const { seo, settings } = await getContent();
  const images = seo.og_image ? [{ url: seo.og_image, width: 1200, height: 630 }] : undefined;
  return {
    title: seo.title,
    description: seo.description,
    icons: { icon: "/favicon.svg" },
    openGraph: { title: seo.title, description: seo.description, siteName: settings.site_name, type: "website", locale: "pl_PL", images },
    twitter: { card: images ? "summary_large_image" : "summary", title: seo.title, description: seo.description, images },
  };
}

export const viewport: Viewport = { themeColor: "#08090B" };

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { settings } = await getContent();

  return (
    <html
      lang="pl"
      className={`${sans.variable} ${mono.variable} ${serif.variable}`}
      style={{ "--accent": settings.accent_color } as CSSProperties}
    >
      <body className="bg-bg font-sans text-fg antialiased">{children}</body>
    </html>
  );
}
