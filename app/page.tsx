"use client";

import Link from "next/link";
import dynamic from "next/dynamic";

const TripMap = dynamic(() => import("@/app/components/TripMap"), {
  ssr: false,
  loading: () => (
    <div style={{ height: 480, background: "var(--cream-dark)", borderRadius: "var(--radius)", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <span style={{ color: "var(--text-light)", fontSize: "0.85rem", letterSpacing: "0.1em" }}>Loading map…</span>
    </div>
  ),
});

const DIAMOND_SVG = `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Cpath d='M40 0L0 40 40 80 80 40z'/%3E%3C/g%3E%3C/svg%3E")`;

export default function Home() {
  const departure = new Date("2026-09-03T00:00:00");
  const now = new Date();
  const daysUntil = Math.ceil((departure.getTime() - now.getTime()) / 86400000);

  return (
    <>
      {/* Hero */}
      <div style={{
        background: "linear-gradient(135deg, var(--green-deep) 0%, #1f4d36 60%, #2d7a56 100%)",
        padding: "56px 24px 48px", textAlign: "center", position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: DIAMOND_SVG }} />
        <p style={{ fontSize: "0.75rem", letterSpacing: "0.3em", color: "var(--gold)", textTransform: "uppercase", marginBottom: 12, position: "relative" }}>
          Benjamin, Alex, James &amp; Masumi
        </p>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "2.8rem", color: "white", position: "relative", marginBottom: 16 }}>
          Japan Trip 2026
        </h1>
        <div style={{
          display: "inline-block", position: "relative",
          background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)",
          color: "rgba(255,255,255,0.85)", padding: "6px 20px", borderRadius: 20, fontSize: "0.9rem", letterSpacing: "0.05em",
        }}>
          September 3 – 14
        </div>
        {daysUntil > 0 && (
          <div style={{ marginTop: 20, position: "relative", color: "rgba(255,255,255,0.7)", fontSize: "0.85rem" }}>
            <span style={{ color: "var(--gold)", fontWeight: 700, fontSize: "1.4rem" }}>{daysUntil}</span> days to go
          </div>
        )}
      </div>

      {/* Status bar */}
      <div style={{ background: "var(--green-mid)", padding: "10px 24px", display: "flex", alignItems: "center", justifyContent: "center", gap: 32, flexWrap: "wrap" }}>
        {[
          { icon: "🗓️", label: "11 nights" },
          { icon: "🏙️", label: "4 cities" },
          { icon: "👥", label: "4 travellers" },
          { icon: "📍", label: "613 miles traveled" },
        ].map(({ icon, label }) => (
          <div key={label} style={{ display: "flex", alignItems: "center", gap: 6, color: "rgba(255,255,255,0.9)", fontSize: "0.82rem" }}>
            {icon} <span>{label}</span>
          </div>
        ))}
      </div>

      {/* Main content */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 24px" }}>

        {/* Map section */}
        <div style={{ marginBottom: 40 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.3rem", color: "var(--green-deep)" }}>
              🗺️ Trip Route
            </h2>
            <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
          </div>
          <TripMap />
        </div>

        {/* Quick links */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.3rem", color: "var(--green-deep)" }}>
            📂 Pages
          </h2>
          <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16, marginBottom: 32 }}>
          {[
            { href: "/itinerary", icon: "📅", title: "Itinerary", desc: "Day-by-day plan across all four cities", accent: "var(--green-light)" },
            { href: "/places",    icon: "🎯", title: "Activities", desc: "Hotels, sights, and restaurants",      accent: "var(--gold)" },
            { href: "/budget",    icon: "💴", title: "Budget",    desc: "Estimated costs in yen and USD",        accent: "var(--red-japan)" },
          ].map(({ href, icon, title, desc, accent }) => (
            <Link key={href} href={href} style={{ textDecoration: "none" }}>
              <div style={{
                background: "var(--white)", borderRadius: "var(--radius)",
                boxShadow: "var(--shadow)", padding: "24px 16px", textAlign: "center",
                borderTop: `4px solid ${accent}`, transition: "all 0.2s",
              }}>
                <div style={{ fontSize: "2rem", marginBottom: 8 }}>{icon}</div>
                <div style={{ fontSize: "0.95rem", fontWeight: 700, color: "var(--green-deep)" }}>{title}</div>
                <div style={{ fontSize: "0.78rem", color: "var(--text-light)", marginTop: 4 }}>{desc}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
