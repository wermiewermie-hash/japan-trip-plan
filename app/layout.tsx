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
      <body>
        <nav style={{
          position: "sticky", top: 0, zIndex: 100,
          height: "var(--nav-height)", background: "var(--green-deep)",
          display: "flex", alignItems: "center", padding: "0 24px", gap: "8px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
        }}>
          <Link href="/" style={{ textDecoration: "none", marginRight: "auto" }}>
            <div style={{
              fontFamily: "'Playfair Display', serif", color: "var(--gold)",
              fontSize: "1.15rem", letterSpacing: "0.04em", whiteSpace: "nowrap",
            }}>
              Japan 2026
              <span style={{
                fontFamily: "'Noto Sans JP', sans-serif", fontSize: "0.75rem",
                color: "rgba(255,255,255,0.55)", fontWeight: 300,
                display: "block", letterSpacing: "0.1em",
              }}>TOKYO · IZU · KYOTO · NARA</span>
            </div>
          </Link>
          {[
            { href: "/itinerary", label: "📅 Itinerary" },
            { href: "/places",    label: "🎯 Activities" },
            { href: "/food",      label: "🍜 Food" },
            { href: "/budget",    label: "💴 Budget" },
          ].map(({ href, label }) => (
            <Link key={href} href={href} style={{
              color: "rgba(255,255,255,0.8)", textDecoration: "none",
              fontSize: "0.85rem", fontWeight: 500, padding: "8px 14px",
              borderRadius: "var(--radius-sm)", letterSpacing: "0.03em",
            }}>
              {label}
            </Link>
          ))}
        </nav>

        {children}
      </body>
    </html>
  );
}
