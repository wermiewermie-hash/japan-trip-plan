"use client";

import Reveal from "@/app/components/Reveal";

const CROSS_SVG = `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/svg%3E")`;

const cityColors: Record<string, string> = {
  Tokyo: "#2d6a4f",
  Izu:   "#52b788",
  Kyoto: "#c0392b",
  Nara:  "#c9a84c",
};

interface FoodPlace {
  name: string;
  city: string;
  note: string;
  url?: string;
}

interface FoodType {
  key: string;
  emoji: string;
  label: string;
  blurb: string;
  places: FoodPlace[];
}

// Food types from the checklist, each populated with the spots noted in the itinerary.
const FOOD: FoodType[] = [
  {
    key: "kaiseki", emoji: "🍱", label: "Kaiseki", blurb: "Multi-course seasonal haute cuisine",
    places: [
      { name: "Ochiairo", city: "Izu", note: "Ryokan kaiseki dinners, Sep 7 & 8", url: "https://www.ochiairo.co.jp/en/cuisine/summer/" },
    ],
  },
  {
    key: "tempura", emoji: "🍤", label: "Tempura", blurb: "Battered and fried to order",
    places: [
      { name: "Tempura Taku", city: "Tokyo", note: "Fancy dinner Sep 5 · Masumi reserved via Tabelog · ~¥24,000 pp", url: "https://maps.app.goo.gl/veagfv5gx51sfrm2A" },
    ],
  },
  {
    key: "tonkatsu", emoji: "🍖", label: "Tonkatsu", blurb: "Panko-crusted pork cutlet",
    places: [
      { name: "Miyagawa Ton-emon", city: "Kyoto", note: "Dinner Sep 10 · ~¥5,000 pp · check reservations Aug 9", url: "https://maps.app.goo.gl/vpsff3NT1UiDDwmC8" },
    ],
  },
  {
    key: "cafes", emoji: "☕", label: "Old-timey cafés", blurb: "Retro kissaten",
    places: [
      { name: "Soiree", city: "Kyoto", note: "Afternoon coffee Sep 9 · known for its jelly-topped drinks", url: "https://maps.app.goo.gl/fG5cnchQ2mBSVJ1N7" },
    ],
  },
  {
    key: "roasters", emoji: "🫘", label: "Coffee roasters", blurb: "Specialty coffee",
    places: [],
  },
  {
    key: "bars", emoji: "🍸", label: "Classic bars", blurb: "Cocktails, whisky & good vibes",
    places: [
      { name: "Bar Oak", city: "Tokyo", note: "Happy hour Sep 5 · inside the Tokyo Station Hotel", url: "https://maps.app.goo.gl/Bgx3qktHtuqciztRA" },
      { name: "Star Bar", city: "Kyoto", note: "Happy hour Sep 9", url: "https://maps.app.goo.gl/hgwtmwaVmAcpCtTV6" },
      { name: "Bar Calvador", city: "Kyoto", note: "Nightcap option Sep 10", url: "https://maps.app.goo.gl/Ste4Jtxgvf3CnM9A9" },
      { name: "Nokishita 711", city: "Kyoto", note: "Nightcap option Sep 10 · botanical gin bar", url: "https://maps.app.goo.gl/UJq62s4gezZNUuan7" },
      { name: "Rum & Whiskey", city: "Kyoto", note: "Nightcap option Sep 10", url: "https://maps.app.goo.gl/MVEGQGyam8FKX8Ft6" },
      { name: "Bomb Bar", city: "Kyoto", note: "Karaoke after dinner Sep 10", url: "https://maps.app.goo.gl/NDJm2CbpNkWrNDCZ8" },
      { name: "Bar Savant", city: "Nara", note: "Happy hour Sep 12 · 5 min from the hotel, fantastic", url: "https://maps.app.goo.gl/GNsJGXWKhrMaNHBf7" },
      { name: "Lamp Bar", city: "Nara", note: "Happy hour option Sep 12", url: "https://maps.app.goo.gl/WcvL1bAGoecvzamt5" },
    ],
  },
  {
    key: "okonomiyaki", emoji: "🥘", label: "Okonomiyaki", blurb: "Savory griddled pancake",
    places: [
      { name: "Okaru", city: "Nara", note: "Casual dinner option Sep 12", url: "https://maps.app.goo.gl/5uKnrvu6WVdqYgNz5" },
    ],
  },
  {
    key: "yuba", emoji: "🍲", label: "Yuba", blurb: "Delicate tofu skin, a Kyoto specialty",
    places: [
      { name: "Yubanzai Komameya", city: "Kyoto", note: "Dinner option Sep 11", url: "https://maps.app.goo.gl/326KKFE58mf3PQBd9" },
    ],
  },
  {
    key: "tsukemono", emoji: "🥬", label: "Kyo Tsukemono", blurb: "Kyoto-style pickles",
    places: [],
  },
  {
    key: "tofu", emoji: "🧊", label: "Kyo Tofu", blurb: "Kyoto tofu & yudofu",
    places: [],
  },
  {
    key: "ayu", emoji: "🐟", label: "Ayu", blurb: "Sweetfish, grilled over the river",
    places: [
      { name: "Hironbun", city: "Kyoto", note: "Kibune riverside dining · day-trip option Sep 11", url: "https://tabelog.com/kyoto/A2601/A260502/26001599/" },
      { name: "Nakayoshi", city: "Kyoto", note: "Kibune riverside dining · day-trip option Sep 11", url: "https://tabelog.com/kyoto/A2601/A260502/26004182/" },
    ],
  },
  {
    key: "somen", emoji: "🍜", label: "Somen", blurb: "Chilled thin wheat noodles",
    places: [
      { name: "Hiraso", city: "Nara", note: "Lunch option Sep 12 · kaki-no-ha sushi & somen", url: "https://maps.app.goo.gl/QboQf3mbfZDfJ6za9" },
      { name: "Yamato-an", city: "Nara", note: "Lunch option Sep 12 · kaki-no-ha sushi & somen", url: "https://maps.app.goo.gl/Gp7ZjNLv7Qedrkhx8" },
    ],
  },
  {
    key: "soba", emoji: "🥢", label: "Soba", blurb: "Buckwheat noodles",
    places: [
      { name: "Zempuuteinanaban", city: "Izu", note: "Fresh soba & wasabi · lunch Sep 7 at Shuzenji", url: "https://maps.app.goo.gl/PVgWWxNTnQPzLwt89" },
    ],
  },
  {
    key: "izakaya", emoji: "🍶", label: "Izakaya", blurb: "Japanese pub — small plates & drinks",
    places: [
      { name: "Ponto-cho izakaya", city: "Kyoto", note: "Dinner & a stroll along the alley, Sep 9 · ~¥10,000 pp", url: "https://maps.app.goo.gl/Vfu7J2D69gPM15FP6" },
      { name: "Iccho", city: "Nara", note: "Local izakaya · casual dinner option Sep 12", url: "https://maps.app.goo.gl/vD5BXYFPxDweXWbMA" },
    ],
  },
  {
    key: "yakitori", emoji: "🍢", label: "Yakitori", blurb: "Charcoal-grilled chicken skewers",
    places: [
      { name: "Torikizoku", city: "Kyoto", note: "Trashy after-work vibe · dinner option Sep 9", url: "https://maps.app.goo.gl/puHudWTqDS1mpUHX6" },
    ],
  },
  {
    key: "tea", emoji: "🍵", label: "Tea", blurb: "Traditional Kyoto tea houses",
    places: [
      { name: "Ippodo", city: "Kyoto", note: "Tea & a tasting room · shopping Sep 10", url: "https://maps.app.goo.gl/jghGvV36CKp1keGe7" },
      { name: "Fukujuen", city: "Kyoto", note: "Historic tea merchant · shopping Sep 10", url: "https://maps.app.goo.gl/Tg45VtGX1ZgUTviJA" },
    ],
  },
  {
    key: "ekiben", emoji: "🍱", label: "Ekiben", blurb: "Station bento for the train",
    places: [
      { name: "Tokyo Station ekiben", city: "Tokyo", note: "Grab before the Odoriko Sep 7 · and again Mishima → Kyoto Sep 9", url: "https://www.google.com/maps/search/?api=1&query=Ekiben%20Tokyo%20Station" },
    ],
  },
];

function FoodCard({ place }: { place: FoodPlace }) {
  const cColor = cityColors[place.city] ?? "#888";
  const href = place.url ?? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.name + " " + place.city + " Japan")}`;
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="card-hover" style={{
      display: "block", textDecoration: "none", color: "inherit", cursor: "pointer",
      background: "var(--white)", borderRadius: "var(--radius)",
      overflow: "hidden", borderBottom: `3px solid ${cColor}`,
      height: "100%",
    }}>
      <div style={{ padding: "14px 16px" }}>
        <span style={{
          display: "inline-flex", alignItems: "center", gap: 4,
          fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.08em",
          padding: "3px 8px", borderRadius: 8, marginBottom: 8,
          background: cColor, color: "white",
        }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "white" }} />
          {place.city.toUpperCase()}
        </span>
        <div style={{ fontWeight: 700, fontSize: "0.9rem", color: "var(--green-deep)", marginBottom: 4, display: "flex", alignItems: "center", gap: 5 }}>
          {place.name}
          <span style={{ fontSize: "0.72rem", color: "var(--green-mid)" }}>🔗</span>
        </div>
        <div style={{ fontSize: "0.78rem", color: "var(--text-mid)", lineHeight: 1.6 }}>{place.note}</div>
      </div>
    </a>
  );
}

const GRID: React.CSSProperties = { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px,1fr))", gap: 12 };

export default function Food() {
  return (
    <>
      <div className="animate-hero" style={{
        background: "linear-gradient(135deg, var(--red-japan) 0%, #8f2820 100%)",
        padding: "48px 24px 40px", textAlign: "center", position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: CROSS_SVG }} />
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "2rem", color: "white", position: "relative", marginBottom: 8 }}>🍜 Food to Try</h1>
        <p style={{ color: "rgba(255,255,255,0.75)", fontSize: "0.9rem", letterSpacing: "0.12em", position: "relative" }}>
          Spots noted across the itinerary, by dish
        </p>
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 24px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
          {FOOD.map(({ key, emoji, label, blurb, places }) => (
            <div key={key}>
              <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 4 }}>
                <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.2rem", color: "var(--green-deep)" }}>{emoji} {label}</h2>
                {places.length > 0 && (
                  <span style={{ fontSize: "0.7rem", fontWeight: 700, color: "var(--text-light)" }}>
                    {places.length} {places.length === 1 ? "spot" : "spots"}
                  </span>
                )}
                <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
              </div>
              <p style={{ fontSize: "0.78rem", color: "var(--text-light)", fontStyle: "italic", marginBottom: 14 }}>{blurb}</p>

              {places.length > 0 ? (
                <div style={GRID}>
                  {places.map((place, i) => (
                    <Reveal key={place.city + place.name} delay={Math.min(i * 90, 500)} style={{ display: "flex" }}>
                      <div style={{ flex: 1 }}><FoodCard place={place} /></div>
                    </Reveal>
                  ))}
                </div>
              ) : (
                <div style={{
                  fontSize: "0.8rem", color: "var(--text-light)",
                  background: "var(--white)", border: "1px dashed var(--border)",
                  borderRadius: "var(--radius-sm)", padding: "12px 16px",
                }}>
                  No spot picked yet — add one to the checklist and it'll show up here.
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
