import type { Metadata } from "next";
import { EB_Garamond, DM_Mono } from "next/font/google";
import "./globals.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Lightbox from "@/components/Lightbox";
import SectionReveal from "@/components/SectionReveal";

const garamond = EB_Garamond({
  variable: "--font-garamond",
  subsets: ["latin"],
  weight: ["400", "500"],
  style: ["normal", "italic"],
});

const dmMono = DM_Mono({
  variable: "--font-dm-mono",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
});

export const metadata: Metadata = {
  title: "Homeless Runway — OOH Media Infrastructure, Hong Kong",
  description:
    "HOMELESS RUNWAY places partner logos on garments deployed across Hong Kong high-density zones. Structured outdoor advertising inventory. Series 001 open.",
  metadataBase: new URL("https://homelessrunway.com"),
  openGraph: {
    title: "Homeless Runway — OOH Media Infrastructure",
    description:
      "Series 001 — Hong Kong. 100 media assets. 800 placement slots. Partner allocation open.",
    images: ["/images/hero/hero-world.png"],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Homeless Runway — OOH Media Infrastructure",
    description:
      "Series 001 — Hong Kong. Partner allocation open. Q3 2026 production.",
    images: ["/images/hero/hero-world.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${garamond.variable} ${dmMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Nav />
        <SectionReveal />
        {children}
        <Lightbox />
        <Footer />
      </body>
    </html>
  );
}
