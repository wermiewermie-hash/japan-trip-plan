import Link from "next/link";

export default function Home() {
  return (
    <div className="py-16">
      <p className="text-sm tracking-widest uppercase mb-6" style={{ color: "var(--muted)" }}>
        September 3 – 14, 2026
      </p>
      <h1 className="text-5xl mb-4" style={{ letterSpacing: "-0.02em" }}>
        Japan
      </h1>
      <p className="text-xl mb-16" style={{ color: "var(--muted)" }}>
        Tokyo · Izu · Kyoto · Nara
      </p>

      <div className="grid grid-cols-3 gap-px mb-16" style={{ background: "var(--border)" }}>
        {[
          { label: "Nights", value: "11" },
          { label: "Cities", value: "4" },
          { label: "Travellers", value: "4" },
        ].map(({ label, value }) => (
          <div key={label} className="py-8 px-6 text-center" style={{ background: "var(--paper)" }}>
            <div className="text-3xl mb-1">{value}</div>
            <div className="text-sm tracking-widest uppercase" style={{ color: "var(--muted)" }}>{label}</div>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-px" style={{ background: "var(--border)" }}>
        {[
          { href: "/itinerary", title: "Itinerary", desc: "Day-by-day plan across all four cities" },
          { href: "/places", title: "Places", desc: "Hotels, sights, and restaurants" },
          { href: "/budget", title: "Budget", desc: "Estimated costs in yen and USD" },
        ].map(({ href, title, desc }) => (
          <Link
            key={href}
            href={href}
            className="flex items-center justify-between px-6 py-5 no-underline group"
            style={{ background: "var(--paper)", color: "var(--ink)" }}
          >
            <div>
              <div className="text-base tracking-wider uppercase mb-1">{title}</div>
              <div className="text-sm" style={{ color: "var(--muted)" }}>{desc}</div>
            </div>
            <span className="text-xl group-hover:translate-x-1 transition-transform" style={{ color: "var(--accent)" }}>→</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
