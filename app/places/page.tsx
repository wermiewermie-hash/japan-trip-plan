"use client";

import { useState } from "react";

const CROSS_SVG = `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/svg%3E")`;

const cityColors: Record<string, string> = {
  Tokyo: "#2d6a4f",
  Izu:   "#52b788",
  Kyoto: "#c0392b",
  Nara:  "#c9a84c",
};

const typeColors: Record<string, string> = {
  Sight:    "#2c4a7c",
  Food:     "#c0392b",
  Bar:      "#7a3a6e",
  Activity: "#2d6a4f",
  Hotel:    "#7a5c2e",
};

// Order + emoji + heading label for the "By Category" view
const typeMeta: { key: string; emoji: string; label: string }[] = [
  { key: "Hotel",    emoji: "🏨", label: "Hotels" },
  { key: "Sight",    emoji: "⛩️", label: "Sights" },
  { key: "Food",     emoji: "🍜", label: "Food & Dining" },
  { key: "Bar",      emoji: "🍸", label: "Bars" },
  { key: "Activity", emoji: "🎯", label: "Activities & Day Trips" },
];

// Public assets are served under basePath in production (GitHub Pages subdirectory).
const BASE = process.env.NODE_ENV === "production" ? "/japan-trip-plan" : "";

interface PlaceItem {
  name: string;
  type: string;
  note: string;
  mapsUrl?: string;
  image?: string; // filename in /public/places
}

const places: { city: string; note?: string; items: PlaceItem[] }[] = [
  {
    city: "Tokyo",
    note: "Tokyo activities are TBD — sights will be added once plans are confirmed.",
    items: [
      { name: "Hotel Ryumeikan Tokyo", type: "Hotel", note: "Home base Sep 3–6 & Sep 13. Breakfast included.", mapsUrl: "https://maps.app.goo.gl/RVxQdXsJhuZDqvmW6", image: "ryumeikan-tokyo.jpg" },
    ],
  },
  {
    city: "Izu",
    items: [
      { name: "Ochiairo",       type: "Hotel", note: "Sep 7–8. Hillside ryokan, 3 meals included, open-air onsen.", mapsUrl: "https://maps.app.goo.gl/AN46nreHojnS9arF9", image: "ochiairo.jpg" },
      { name: "Shuzenji Onsen", type: "Sight", note: "Classic onsen town along the Katsura River — stop en route Sep 7 (11:30–1:30)", image: "shuzenji-onsen.jpg" },
    ],
  },
  {
    city: "Kyoto",
    items: [
      { name: "Sora Niwa Terrace",  type: "Hotel",    note: "Sep 9–11. Shijo-Kawaramachi area. Breakfast included.", mapsUrl: "https://maps.app.goo.gl/q2HjXffXJq1N2T4R9", image: "sora-niwa-terrace.jpg" },
      { name: "Ponto-cho",          type: "Sight",    note: "Sep 9 evening — narrow alley with bars and restaurants along the Kamo River", image: "pontocho.jpg" },
      { name: "Star Bar",           type: "Bar",      note: "Sep 9 — recommended bar near the hotel", image: "star-bar.jpg" },
      { name: "Fushimi Inari",      type: "Sight",    note: "Stretch goal Sep 10 or 12 (5 AM) — thousands of torii gates, best before crowds", image: "fushimi-inari.jpg" },
      { name: "Kiyomizu-dera",      type: "Sight",    note: "Stretch goal Sep 10 or 12 — opens 6 AM, Ninenzaka cobblestone lane nearby", image: "kiyomizu-dera.jpg" },
      { name: "Nijo Castle",        type: "Sight",    note: "Recommended Sep 10 — Edo period castle with famous nightingale floors", image: "nijo-castle.jpg" },
      { name: "Tofukuji",          type: "Sight",    note: "Recommended Sep 10 — beautiful Zen garden and wooden bridge", image: "tofukuji.jpg" },
      { name: "Sanjusangendo",      type: "Sight",    note: "Recommended Sep 10 — 1,001 statues, unique and unmissable", image: "sanjusangendo.jpg" },
      { name: "Kibune",             type: "Activity", note: "Day trip option Sep 11 — river dining (Hironbun or Nakayoshi) + Kurama Dera or Kifune Temple · ~¥20,000 pp", image: "kibune.jpg" },
    ],
  },
  {
    city: "Nara",
    items: [
      { name: "Iroha Grand Hotel",    type: "Hotel", note: "Sep 12. Breakfast included.", mapsUrl: "https://maps.app.goo.gl/wpqzmnkaRuGvm4Zn9", image: "iroha-grand.jpg" },
      { name: "Nara Deer Park",       type: "Sight", note: "Sep 12 afternoon & Sep 13 morning — free-roaming deer", image: "nara-deer-park.jpg" },
      { name: "Shin-Yakushiji",       type: "Sight", note: "Sep 12 — Masumi favorite, quiet temple with ancient clay guardian statues", image: "shin-yakushiji.jpg" },
      { name: "Shiga Naoya's House",  type: "Sight", note: "Sep 12 if time — historic residence of the novelist", image: "shiga-naoya-house.jpg" },
      { name: "Kasuga Taisha",        type: "Sight", note: "Sep 13 morning — thousands of stone and bronze lanterns", image: "kasuga-taisha.jpg" },
      { name: "Todaiji Temple",       type: "Sight", note: "Sep 13 morning — world's largest wooden building, giant bronze Buddha", image: "todaiji.jpg" },
      { name: "Bar Savant",           type: "Food",  note: "Sep 12 dinner — 5 min walk from hotel, highly recommended", image: "bar-savant.jpg" },
    ],
  },
];

function PlaceCard({ item, city, showCity }: { item: PlaceItem; city: string; showCity?: boolean }) {
  const href = item.mapsUrl ?? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(item.name + " " + city + " Japan")}`;
  const tColor = typeColors[item.type] ?? "#888";
  const cColor = cityColors[city] ?? "#888";

  // "B3" ≈ 70% alpha — colored pills sit translucently over the photo.
  const chips = (
    <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
      <span style={{
        fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.08em",
        padding: "3px 8px", borderRadius: 8,
        background: tColor + "B3", color: "white",
        backdropFilter: "blur(3px)", WebkitBackdropFilter: "blur(3px)",
      }}>{item.type.toUpperCase()}</span>
      {showCity && (
        <span style={{
          display: "inline-flex", alignItems: "center", gap: 4,
          fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.08em",
          padding: "3px 8px", borderRadius: 8,
          background: cColor + "B3", color: "white",
          backdropFilter: "blur(3px)", WebkitBackdropFilter: "blur(3px)",
        }}>
          <span style={{ width: 7, height: 7, borderRadius: "50%", background: "white" }} />
          {city.toUpperCase()}
        </span>
      )}
    </div>
  );

  return (
    <a href={href} target="_blank" rel="noopener noreferrer" style={{
      display: "block", textDecoration: "none", color: "inherit", cursor: "pointer",
      background: "var(--white)", borderRadius: "var(--radius)",
      boxShadow: "var(--shadow)", overflow: "hidden",
      borderBottom: `3px solid ${tColor}`,
    }}>
      {item.image ? (
        <div style={{ position: "relative" }}>
          <img
            src={`${BASE}/places/${item.image}`}
            alt={item.name}
            loading="lazy"
            style={{ width: "100%", height: 180, objectFit: "cover", display: "block" }}
          />
          <div style={{ position: "absolute", top: 8, left: 8 }}>{chips}</div>
        </div>
      ) : null}
      <div style={{ padding: "14px 16px" }}>
        {!item.image && <div style={{ marginBottom: 6 }}>{chips}</div>}
        <div style={{ fontWeight: 700, fontSize: "0.9rem", color: "var(--green-deep)", marginBottom: 4 }}>{item.name}</div>
        <div style={{ fontSize: "0.78rem", color: "var(--text-mid)", lineHeight: 1.6 }}>{item.note}</div>
      </div>
    </a>
  );
}

const GRID: React.CSSProperties = { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px,1fr))", gap: 12 };

export default function Places() {
  const [view, setView] = useState<"city" | "category">("city");

  const allItems = places.flatMap(p => p.items.map(item => ({ item, city: p.city })));

  return (
    <>
      <div style={{
        background: "linear-gradient(135deg, var(--green-deep) 0%, var(--green-mid) 100%)",
        padding: "48px 24px 40px", textAlign: "center", position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: CROSS_SVG }} />
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "2rem", color: "white", position: "relative", marginBottom: 8 }}>🎯 Activities</h1>
        <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.9rem", letterSpacing: "0.12em", position: "relative" }}>Hotels · Sights · Food · Activities</p>
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 24px" }}>
        {/* View toggle */}
        <div style={{ display: "flex", gap: 8, marginBottom: 24, alignItems: "center" }}>
          <span style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--text-light)", letterSpacing: "0.08em", marginRight: 4 }}>GROUP BY</span>
          {([["city", "By City"], ["category", "By Category"]] as const).map(([v, label]) => {
            const active = view === v;
            return (
              <button key={v} onClick={() => setView(v)} style={{
                padding: "6px 16px", borderRadius: 20,
                border: `2px solid ${active ? "var(--green-deep)" : "var(--border)"}`,
                background: active ? "var(--green-deep)" : "white",
                color: active ? "white" : "var(--text-mid)",
                fontSize: "0.8rem", fontWeight: 600, cursor: "pointer",
                fontFamily: "inherit", transition: "all 0.15s",
              }}>
                {label}
              </button>
            );
          })}
        </div>

        {view === "city" ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
            {places.map(({ city, note, items }) => (
              <div key={city}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: note ? 8 : 16 }}>
                  <div style={{ width: 10, height: 10, borderRadius: "50%", background: cityColors[city], flexShrink: 0 }} />
                  <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.2rem", color: "var(--green-deep)" }}>{city}</h2>
                  <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
                </div>

                {note && (
                  <p style={{ fontSize: "0.8rem", color: "var(--text-light)", fontStyle: "italic", marginBottom: 16 }}>{note}</p>
                )}

                <div style={GRID}>
                  {items.map(item => <PlaceCard key={item.name} item={item} city={city} />)}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
            {typeMeta.map(({ key, emoji, label }) => {
              const group = allItems.filter(({ item }) => item.type === key);
              if (group.length === 0) return null;
              const color = typeColors[key] ?? "#888";
              return (
                <div key={key}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                    <div style={{ width: 10, height: 10, borderRadius: "50%", background: color, flexShrink: 0 }} />
                    <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.2rem", color: "var(--green-deep)" }}>{emoji} {label}</h2>
                    <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
                  </div>

                  <div style={GRID}>
                    {group.map(({ item, city }) => <PlaceCard key={city + item.name} item={item} city={city} showCity />)}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
