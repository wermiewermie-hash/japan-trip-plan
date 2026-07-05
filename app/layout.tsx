import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Japan Trip 2026",
  description: "Tokyo · Izu · Kyoto · Nara — September 2026",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <header style={{ borderBottom: "1px solid var(--border)" }} className="py-6 px-8">
          <nav className="max-w-3xl mx-auto flex items-baseline justify-between">
            <Link href="/" className="text-lg tracking-widest uppercase no-underline" style={{ color: "var(--ink)" }}>
              Japan 2026
            </Link>
            <div className="flex gap-8 text-sm tracking-wider">
              <Link href="/itinerary" className="uppercase no-underline hover:opacity-60 transition-opacity" style={{ color: "var(--muted)" }}>Itinerary</Link>
              <Link href="/places" className="uppercase no-underline hover:opacity-60 transition-opacity" style={{ color: "var(--muted)" }}>Places</Link>
              <Link href="/budget" className="uppercase no-underline hover:opacity-60 transition-opacity" style={{ color: "var(--muted)" }}>Budget</Link>
            </div>
          </nav>
        </header>

        <main className="flex-1 max-w-3xl mx-auto w-full px-8 py-12">
          {children}
        </main>

        <footer className="py-6 px-8 text-center text-sm tracking-wider" style={{ borderTop: "1px solid var(--border)", color: "var(--muted)" }}>
          September 2026 &nbsp;·&nbsp; Tokyo · Izu · Kyoto · Nara
        </footer>
      </body>
    </html>
  );
}
