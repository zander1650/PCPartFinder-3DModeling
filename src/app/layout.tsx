import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PCForge — Build it. See it run.",
  description:
    "Pick compatible PC parts, get budget-based recommended builds, and preview your finished PC running in 3D.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <header className="sticky top-0 z-40 border-b border-slate-800 bg-slate-950/80 backdrop-blur">
          <nav className="mx-auto flex h-14 w-full max-w-7xl items-center gap-6 px-6">
            <Link href="/" className="text-lg font-bold">
              PC<span className="text-sky-400">Forge</span>
            </Link>
            <Link href="/builder" className="text-sm text-slate-300 hover:text-white">
              Builder
            </Link>
            <Link href="/budget" className="text-sm text-slate-300 hover:text-white">
              Budget Builds
            </Link>
            <Link href="/parts" className="text-sm text-slate-300 hover:text-white">
              Parts
            </Link>
          </nav>
        </header>
        <div className="flex-1">{children}</div>
      </body>
    </html>
  );
}
