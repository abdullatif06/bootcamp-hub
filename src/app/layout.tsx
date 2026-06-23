import type { Metadata, Viewport } from "next";
import { Bebas_Neue, Inter } from "next/font/google";
import "./globals.css";
import { EVENT } from "@/lib/config";
import { NavBar } from "@/components/NavBar";
import { Footer } from "@/components/Footer";
import { SessionProvider } from "@/components/SessionProvider";

const bebasNeue = Bebas_Neue({
  subsets: ["latin"],
  variable: "--font-bebas",
  weight: "400",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  title: `${EVENT.name} — ${EVENT.tagline}`,
  description: `${EVENT.tagline} · ${EVENT.dateLabel} · ${EVENT.locationLabel}. Build your first startup with AI. ${EVENT.priceLabel}.`,
};

export const viewport: Viewport = {
  themeColor: "#0f172a",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${bebasNeue.variable} ${inter.variable}`}>
      <body className="bg-maximal min-h-screen flex flex-col">
        <SessionProvider>
          <NavBar />
          <main className="flex-1 w-full">{children}</main>
          <Footer />
        </SessionProvider>
      </body>
    </html>
  );
}
