import type { Metadata } from "next";
import localFont from "next/font/local";
import { SiteHeader, SiteFooter } from "@/components/site-shell";
import "./globals.css";

const outfit = localFont({ src: "../public/fonts/outfit.woff2", variable: "--font-heading", display: "swap", weight: "300 700" });
const inter = localFont({ src: "../public/fonts/inter.woff2", variable: "--font-body", display: "swap", weight: "400 600" });

export const metadata: Metadata = {
  metadataBase: new URL("https://residents.prosperaproperties.co"),
  title: { default: "Prospera Rent — Your next move, considered.", template: "%s | Prospera Rent" },
  description: "Your local home-hunting team in London, Strathroy and St. Thomas. Plan your next move, explore Prospera homes and find what fits.",
  icons: { icon: "/logo.png", apple: "/logo.png" },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} ${inter.variable}`}
    >
      <body><a className="skip-link" href="#main">Skip to content</a><SiteHeader />{children}<SiteFooter /></body>
    </html>
  );
}
