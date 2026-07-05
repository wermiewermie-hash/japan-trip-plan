"use client";

import { useState } from "react";

const CROSS_SVG = `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/svg%3E")`;

interface BudgetItem { name: string; note?: string; costYen: number; estimate?: boolean }
interface Category {
  id: string; icon: string; name: string;
  color: string; totalYen: number;
  items: BudgetItem[];
}

const RATE = 156; // ¥ per $1

const CATEGORIES: Category[] = [
  {
    id: "accommodation", icon: "🏨", name: "Accommodation", color: "#c9a84c",
    totalYen: 1259800,
    items: [
      { name: "Hotel Ryumeikan Tokyo — 5 nights × 2 rooms",  note: "¥35,000/room/night · breakfast included", costYen: 350000 },
      { name: "Ochiairo — 2 nights × 2 rooms",               note: "¥177,500/room/night · 3 meals included", costYen: 710000 },
      { name: "Sora Niwa Terrace — 3 nights × 2 rooms",      note: "¥24,833/room/night · breakfast included · prepaid Ikyu", costYen: 148998 },
      { name: "Iroha Grand Hotel — 1 night × 2 rooms",       note: "¥25,400/room/night · breakfast included", costYen: 50800 },
    ],
  },
  {
    id: "transport", icon: "🚄", name: "Transport", color: "#2d6a4f",
    totalYen: 110980,
    items: [
      { name: "Luggage forwarding Tokyo → Kyoto (Sep 7)",             note: "¥2,500 pp × 4",          costYen: 10000 },
      { name: "Odoriko Limited Express Tokyo → Shuzenji (Sep 7)",     note: "¥4,750 pp × 4",          costYen: 19000 },
      { name: "C10 Bus × 2 (Sep 7)",                                  note: "¥260 × 2 × 4",           costYen: 2080 },
      { name: "Izu → Mishima local train (Sep 9, Option B)",          note: "¥550 pp × 4 · if not taking private taxi", costYen: 2200, estimate: true },
      { name: "Mishima → Kyoto Shinkansen Kodama (Sep 9)",            note: "¥16,000 pp × 4",         costYen: 64000 },
      { name: "Cab Kyoto Station → Shijo Kawaramachi (Sep 9)",        note: "¥2,500 total",           costYen: 2500 },
      { name: "Aoniyoshi tourist train Kyoto → Nara (Sep 12)",        note: "¥1,200 pp × 4",          costYen: 4800 },
      { name: "Ekiben bento at Tokyo Station (Sep 7)",                 note: "¥1,600 pp × 4",          costYen: 6400 },
      { name: "Flights (round trip)",                                  note: "TBD",                    costYen: 0 },
      { name: "Nara → Tokyo (Sep 13)",                                 note: "TBD — route to be arranged", costYen: 0 },
      { name: "IC card top-ups (Suica/Pasmo)",                         note: "TBD",                    costYen: 0 },
      { name: "Airport transfers",                                      note: "TBD",                    costYen: 0 },
    ],
  },
  {
    id: "dining", icon: "🍽️", name: "Dining Out", color: "#457b9d",
    totalYen: 172400,
    items: [
      { name: "Tokyo dinner — Sep 5 (all 4 together)",   note: "~¥10,000 pp estimate", costYen: 40000, estimate: true },
      { name: "Tokyo dinner — Sep 6",                    note: "~¥10,000 pp estimate", costYen: 40000, estimate: true },
      { name: "Shuzenji lunch — Sep 7",                  note: "~¥1,500 pp estimate",  costYen: 6000,  estimate: true },
      { name: "Kyoto dinner — Sep 9",                    note: "~¥10,000 pp estimate", costYen: 40000, estimate: true },
      { name: "Kyoto lunch — Sep 10",                    note: "~¥1,600 pp estimate",  costYen: 6400,  estimate: true },
      { name: "Kyoto dinner — Sep 10",                   note: "~¥10,000 pp estimate", costYen: 40000, estimate: true },
      { name: "Tokyo dinners Sep 3, 4 (B&A only)",       note: "TBD",                  costYen: 0 },
      { name: "Sep 11 day trip meals",                   note: "TBD — depends on day trip choice", costYen: 0 },
      { name: "Nara dinner — Sep 12 (Bar Savant)",       note: "TBD",                  costYen: 0 },
      { name: "Tokyo dinner — Sep 13",                   note: "TBD",                  costYen: 0 },
    ],
  },
  {
    id: "sightseeing", icon: "🏯", name: "Sightseeing & Activities", color: "#e07a5f",
    totalYen: 0,
    items: [
      { name: "Sep 11 day trip: Kibune (if chosen)",    note: "~¥20,000 pp · ~¥80,000 total", costYen: 0 },
      { name: "Temple entrance fees",                   note: "TBD — ~¥500–800 pp each",      costYen: 0 },
      { name: "Sep 8 private taxi for Mt Fuji (optional)", note: "TBD — ~¥16,000 total",      costYen: 0 },
      { name: "Other activities",                        note: "TBD",                          costYen: 0 },
    ],
  },
  {
    id: "misc", icon: "🛍️", name: "Shopping & Misc", color: "#888",
    totalYen: 0,
    items: [
      { name: "Pocket WiFi or SIM cards",    note: "TBD", costYen: 0 },
      { name: "Shopping / souvenirs",        note: "TBD", costYen: 0 },
      { name: "Other",                       note: "TBD", costYen: 0 },
    ],
  },
];

const knownTotalYen = CATEGORIES.reduce((s, c) => s + c.totalYen, 0);
const accommodationYen = CATEGORIES[0].totalYen;

function fmt(n: number) { return n.toLocaleString(); }
function usd(yen: number) { return Math.round(yen / RATE).toLocaleString(); }

function CategoryCard({ cat, totalYen }: { cat: Category; totalYen: number }) {
  const [open, setOpen] = useState(false);
  const pct = totalYen > 0 ? Math.round(cat.totalYen / totalYen * 100) : 0;

  return (
    <div style={{ background: "var(--white)", borderRadius: "var(--radius)", boxShadow: "var(--shadow)", marginBottom: 16, overflow: "hidden" }}>
      <div
        onClick={() => setOpen(o => !o)}
        style={{
          padding: "16px 20px", display: "flex", alignItems: "center",
          justifyContent: "space-between", cursor: "pointer",
          borderBottom: open ? "1px solid var(--border)" : "none",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            width: 40, height: 40, borderRadius: "var(--radius-sm)",
            background: cat.color + "20", display: "grid", placeItems: "center", fontSize: "1.1rem", flexShrink: 0,
          }}>{cat.icon}</div>
          <div>
            <div style={{ fontWeight: 700, fontSize: "1rem", color: "var(--green-deep)" }}>{cat.name}</div>
            <div style={{ fontSize: "0.75rem", color: "var(--text-light)" }}>{cat.items.length} items</div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--green-mid)" }}>
            {cat.totalYen > 0 ? `¥${fmt(cat.totalYen)}` : "TBD"}
          </div>
          <div style={{ fontSize: "1.1rem", transform: open ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>▼</div>
        </div>
      </div>

      {open && (
        <div style={{ padding: "16px 20px" }}>
          {cat.items.map((item, i) => (
            <div key={i} style={{
              display: "flex", justifyContent: "space-between", alignItems: "baseline",
              padding: "7px 0", fontSize: "0.85rem",
              borderBottom: i < cat.items.length - 1 ? "1px dashed var(--border)" : "none",
            }}>
              <span style={{ color: "var(--text)", flex: 1 }}>
                {item.name}
                {item.estimate && (
                  <span style={{
                    fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.06em",
                    background: "#e8f4fd", color: "#2563a0", border: "1px solid #b8d9f5",
                    borderRadius: 4, padding: "1px 5px", marginLeft: 6, verticalAlign: "middle",
                  }}>estimate</span>
                )}
              </span>
              {item.note && <span style={{ fontSize: "0.75rem", color: "var(--text-light)", margin: "0 12px" }}>{item.note}</span>}
              <span style={{ fontWeight: 600, color: item.costYen > 0 ? "var(--green-mid)" : "var(--text-light)", whiteSpace: "nowrap", marginLeft: 16 }}>
                {item.costYen > 0 ? `¥${fmt(item.costYen)}` : "TBD"}
              </span>
            </div>
          ))}
          {cat.totalYen > 0 && (
            <div style={{ textAlign: "right", marginTop: 10, paddingTop: 8, borderTop: "2px solid var(--border)" }}>
              <strong style={{ color: "var(--green-deep)" }}>Subtotal: ¥{fmt(cat.totalYen)}</strong>
              <span style={{ marginLeft: 12, fontSize: "0.8rem", color: "var(--text-light)" }}>(${usd(cat.totalYen)} USD · {pct}% of known total)</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function Budget() {
  return (
    <>
      <div style={{
        background: "linear-gradient(135deg, var(--green-deep) 0%, var(--green-mid) 100%)",
        padding: "48px 24px 40px", textAlign: "center", position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: CROSS_SVG }} />
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "2rem", color: "white", position: "relative", marginBottom: 8 }}>
          💴 Budget
        </h1>
        <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.9rem", letterSpacing: "0.12em", position: "relative" }}>
          11 nights · 2 rooms · 4 people
        </p>
      </div>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "32px 24px" }}>

        <div style={{
          background: "var(--gold-light)", borderLeft: "4px solid var(--gold)",
          borderRadius: "0 var(--radius-sm) var(--radius-sm) 0",
          padding: "12px 16px", fontSize: "0.82rem", color: "#6b4f10", marginBottom: 24,
        }}>
          💡 Accommodation confirmed. Transport and dining costs extracted from itinerary — dining figures are <strong>estimates</strong>. Flights, Nara→Tokyo, and sightseeing entrance fees still TBD.
          Exchange rate: ¥{RATE} = $1.
        </div>

        {/* Summary cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16, marginBottom: 28 }}>
          {[
            { label: "Known total (excl. flights & misc)", amount: `¥${fmt(knownTotalYen)}`, sub: `$${usd(knownTotalYen)} USD`, color: "var(--green-deep)" },
            { label: "Per couple (known)", amount: `¥${fmt(Math.round(knownTotalYen / 2))}`, sub: `$${usd(knownTotalYen / 2)} USD`, color: "var(--green-mid)" },
            { label: "Per person (known)", amount: `¥${fmt(Math.round(knownTotalYen / 4))}`, sub: `$${usd(knownTotalYen / 4)} USD`, color: "var(--gold)" },
          ].map(({ label, amount, sub, color }) => (
            <div key={label} style={{ background: "white", borderRadius: "var(--radius)", boxShadow: "var(--shadow)", padding: 20, textAlign: "center" }}>
              <div style={{ fontSize: "0.75rem", color: "var(--text-light)", letterSpacing: "0.08em", textTransform: "uppercase" }}>{label}</div>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.7rem", fontWeight: 700, margin: "6px 0 2px", color }}>{amount}</div>
              <div style={{ fontSize: "0.78rem", color: "var(--text-light)" }}>{sub}</div>
            </div>
          ))}
        </div>

        {/* Breakdown bars */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.2rem", color: "var(--green-deep)" }}>📊 Breakdown</h2>
          <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
        </div>

        <div style={{ background: "white", borderRadius: "var(--radius)", boxShadow: "var(--shadow)", padding: "20px 24px", marginBottom: 28 }}>
          {CATEGORIES.map(cat => {
            const pct = knownTotalYen > 0 ? Math.round(cat.totalYen / knownTotalYen * 100) : 0;
            return (
              <div key={cat.id} style={{ marginBottom: 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontSize: "0.85rem" }}>
                  <span style={{ fontWeight: 600, color: "var(--text)" }}>{cat.icon} {cat.name}</span>
                  <span style={{ color: "var(--text-light)" }}>
                    {cat.totalYen > 0 ? `¥${fmt(cat.totalYen)}` : "TBD"}
                    {cat.totalYen > 0 && <span style={{ marginLeft: 6 }}>({pct}%)</span>}
                  </span>
                </div>
                <div style={{ background: "var(--cream-dark)", borderRadius: 99, height: 12, overflow: "hidden" }}>
                  <div style={{ height: "100%", borderRadius: 99, width: `${pct}%`, background: cat.color, transition: "width 0.8s" }} />
                </div>
              </div>
            );
          })}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 20, justifyContent: "center" }}>
            {CATEGORIES.map(cat => (
              <div key={cat.id} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "0.78rem", color: "var(--text-mid)" }}>
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: cat.color, flexShrink: 0 }} />
                {cat.name}
              </div>
            ))}
          </div>
        </div>

        {/* Detail cards */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.2rem", color: "var(--green-deep)" }}>📋 Detail</h2>
          <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
        </div>

        {CATEGORIES.map(cat => <CategoryCard key={cat.id} cat={cat} totalYen={knownTotalYen} />)}

        {/* Grand total */}
        <div style={{
          background: "linear-gradient(135deg, var(--green-deep), var(--green-mid))",
          borderRadius: "var(--radius)", padding: "20px 24px", color: "white",
          display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 8,
          flexWrap: "wrap", gap: 8,
        }}>
          <div>
            <div style={{ fontSize: "1.1rem", fontWeight: 700 }}>Known total</div>
            <div style={{ fontSize: "0.78rem", opacity: 0.7 }}>Excl. flights, Nara→Tokyo, sightseeing & misc</div>
          </div>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "2rem", fontWeight: 700, color: "var(--gold)" }}>
            ¥{fmt(knownTotalYen)}
          </div>
        </div>

      </div>
    </>
  );
}
