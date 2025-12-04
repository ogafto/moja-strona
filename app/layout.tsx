import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import ClientWrapper from "./ClientWrapper";
import ScrollToTop from "./components/ScrollToTop";
import TabFocusManager from "./components/TabFocusManager";
import ScrollToTopButton from "./components/ScrollToTopButton";

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-dm-sans",
});

export const metadata: Metadata = {
  title: "Freshly.pl",
  description: "Strona stworzona przez afto",
  icons: {
    icon: "/favicon.svg", // Podaj tutaj ścieżkę do Twojego pliku SVG
  },
  themeColor: "#009DFF",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${dmSans.variable} font-sans antialiased bg-[#0D0D0D] text-white`}>
        <TabFocusManager />
        <ScrollToTop />
        <ClientWrapper>
          {children}
        </ClientWrapper>
        <ScrollToTopButton />
      </body>
    </html>
  );
}
