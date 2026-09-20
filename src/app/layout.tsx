import type { Metadata } from "next";
import { Inter, Playfair_Display, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import AppShell from "@/components/layout/AppShell";
import { Toaster } from "sonner";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-ibm-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "Bhorer Shahar: Case Files",
  description: "Every clue leaves a trace.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable} ${ibmPlexMono.variable}`}>
      <body className="antialiased bg-ink text-main min-h-screen">
        <AppShell>{children}</AppShell>
        <Toaster theme="dark" toastOptions={{ className: "bg-charcoal text-main border-brass" }} />
      </body>
    </html>
  );
}
