"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import Reveal from "@/app/components/Reveal";
import type { FoodSpot } from "@/app/components/FoodMap";

const FoodMap = dynamic(() => import("@/app/components/FoodMap"), {
  ssr: false,
  loading: () => (
    <div className="skeleton" style={{ height: 420, borderRadius: "var(--radius)", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <span style={{ color: "var(--text-light)", fontSize: "0.85rem", letterSpacing: "0.1em" }}>Loading map…</span>
    </div>
  ),
});

// Coordinates for each spot (resolved from its Google Maps link).
const COORDS: Record<string, [number, number]> = {
  "Ochiairo": [34.9325, 138.9357],
  "Tempura Taku": [35.7021761, 139.7410807],
  "Miyagawa Ton-emon": [34.9984709, 135.7708535],
  "Soiree": [35.0041715, 135.7703381],
  "Bar Oak": [35.6807676, 139.7657483],
  "Star Bar": [35.0072683, 135.7708725],
  "Bar Calvador": [35.0134258, 135.7670497],
  "Nokishita 711": [35.00236, 135.7699884],
  "Rum & Whiskey": [35.0070486, 135.7706013],
  "Bomb Bar": [35.0026186, 135.7694918],
  "Bar Savant": [34.6807475, 135.8284625],
  "Lamp Bar": [34.6824301, 135.8270947],
  "Okaru": [34.6829253, 135.8288395],
  "Yubanzai Komameya": [35.0048448, 135.7615948],
  "Hiraso": [34.680106, 135.830463],
  "Yamato-an": [34.6817896, 135.8212228],
  "Zempuuteinanaban": [34.9714901, 138.9308751],
  "Ponto-cho izakaya": [35.0070665, 135.7711639],
  "Iccho": [34.6831673, 135.8284898],
  "Torikizoku": [35.0036985, 135.770766],
  "Ippodo": [35.0144642, 135.7674161],
  "Fukujuen": [35.0035269, 135.7648322],
  "Hirobun": [35.1252812, 135.7638998],
  "Nakayoshi": [35.123623, 135.7637481],
  "Tokyo Station ekiben": [35.6812, 139.7671],
  "Amago Chaya": [34.9716226, 138.9304482],
  "H du Pont": [35.0078127, 135.7710433],
  "Kasuga Ninai-jyaya": [34.6823206, 135.8434241],
  "Akordu": [34.6878, 135.8368],
};

const CROSS_SVG = `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/svg%3E")`;

const cityColors: Record<string, string> = {
  Tokyo: "#2d6a4f",
  Izu:   "#52b788",
  Kyoto: "#c0392b",
  Nara:  "#c9a84c",
};

// City order for the "By Location" view.
const CITY_ORDER = ["Tokyo", "Izu", "Kyoto", "Nara"];

interface FoodPlace {
  name: string;
  city: string;
  note: string;
  url?: string;
  planned?: boolean;
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
    key: "kaiseki", emoji: "🍱", label: "Kaiseki", blurb: "Formal, traditional 12-course meal of local dishes made from seasonal ingredients. Often considered the summit of Japanese washoku.",
    places: [
      { name: "Ochiairo", city: "Izu", note: "Ryokan kaiseki dinners, Sep 7 & 8", url: "https://www.ochiairo.co.jp/en/cuisine/summer/", planned: true },
    ],
  },
  {
    key: "fusion", emoji: "✨", label: "Fancy fusion", blurb: "Inventive fine dining that blends Japanese ingredients with global technique — the kind of place you book well ahead.",
    places: [
      { name: "Akordu", city: "Nara", note: "Michelin-starred Spanish–Japanese · dinner option Sep 12 (check reservations ~7/15)", url: "https://tabelog.com/en/nara/A2901/A290101/29010346/" },
    ],
  },
  {
    key: "tempura", emoji: "🍤", label: "Tempura", blurb: "Very different from the tempura you get in the States. Heavy focus on seasonal ingredients and rare vegetables, battered and fried right before you eat them, and served in courses.",
    places: [
      { name: "Tempura Taku", city: "Tokyo", note: "Fancy dinner Sep 5 · Masumi reserved via Tabelog · ~¥24,000 pp", url: "https://maps.app.goo.gl/veagfv5gx51sfrm2A", planned: true },
    ],
  },
  {
    key: "tonkatsu", emoji: "🍖", label: "Tonkatsu", blurb: "So much better than the dry stuff you get in the States. Often made from heritage Japanese pork, and you can specify the cut you want. Try the fried oysters too.",
    places: [
      { name: "Miyagawa Ton-emon", city: "Kyoto", note: "Dinner Sep 10 · ~¥5,000 pp · check reservations Aug 9", url: "https://maps.app.goo.gl/vpsff3NT1UiDDwmC8", planned: true },
    ],
  },
  {
    key: "cafes", emoji: "☕", label: "Old-timey cafés", blurb: "Kissaten — old-fashioned, wood-panelled cafés from the Showa era, where coffee is brewed by hand and the menu keeps throwback items like cream sodas and fruit parfaits. Try the coffee jelly.",
    places: [
      { name: "Soiree", city: "Kyoto", note: "Afternoon coffee Sep 9 · known for its jelly-topped drinks", url: "https://maps.app.goo.gl/fG5cnchQ2mBSVJ1N7" },
    ],
  },
  {
    key: "roasters", emoji: "🫘", label: "Coffee roasters", blurb: "Not sure how good Japanese roasters are, honestly — but worth a visit!",
    places: [],
  },
  {
    key: "bars", emoji: "🍸", label: "Bars", blurb: "Classic bars are small and intimate, often with wood panelling and prohibition-era decor. Rowdier local bars are still small, but offer trashy drinks and fun karaoke.",
    places: [
      { name: "Bar Oak", city: "Tokyo", note: "Happy hour Sep 5 · inside the Tokyo Station Hotel", url: "https://maps.app.goo.gl/Bgx3qktHtuqciztRA", planned: true },
      { name: "Star Bar", city: "Kyoto", note: "Happy hour Sep 9", url: "https://maps.app.goo.gl/hgwtmwaVmAcpCtTV6" },
      { name: "Bar Calvador", city: "Kyoto", note: "Nightcap option Sep 10", url: "https://maps.app.goo.gl/Ste4Jtxgvf3CnM9A9" },
      { name: "Nokishita 711", city: "Kyoto", note: "Nightcap option Sep 10 · botanical gin bar", url: "https://maps.app.goo.gl/UJq62s4gezZNUuan7" },
      { name: "Rum & Whiskey", city: "Kyoto", note: "Nightcap option Sep 10", url: "https://maps.app.goo.gl/MVEGQGyam8FKX8Ft6" },
      { name: "Bomb Bar", city: "Kyoto", note: "Karaoke after dinner Sep 10", url: "https://maps.app.goo.gl/NDJm2CbpNkWrNDCZ8" },
      { name: "H du Pont", city: "Kyoto", note: "Wine bar · easy dinner option Sep 11", url: "https://maps.app.goo.gl/arZuEWxHt9rdn5PP6" },
      { name: "Bar Savant", city: "Nara", note: "Happy hour Sep 12 · 5 min from the hotel, fantastic", url: "https://maps.app.goo.gl/GNsJGXWKhrMaNHBf7" },
      { name: "Lamp Bar", city: "Nara", note: "Happy hour option Sep 12", url: "https://maps.app.goo.gl/WcvL1bAGoecvzamt5" },
    ],
  },
  {
    key: "okonomiyaki", emoji: "🥘", label: "Okonomiyaki", blurb: "A Kansai local's favourite — kind of like a Japanese pizza. A cabbage-and-batter pancake griddled at the table and finished with brown sauce, bonito flakes, and mayonnaise.",
    places: [
      { name: "Okaru", city: "Nara", note: "Casual dinner option Sep 12", url: "https://maps.app.goo.gl/5uKnrvu6WVdqYgNz5" },
    ],
  },
  {
    key: "yuba", emoji: "🍲", label: "Yuba", blurb: "The delicate skin lifted from simmering soy milk — a refined Kyoto specialty served fresh, rolled, or simmered.",
    places: [
      { name: "Yubanzai Komameya", city: "Kyoto", note: "Dinner option Sep 11", url: "https://maps.app.goo.gl/326KKFE58mf3PQBd9" },
    ],
  },
  {
    key: "tsukemono", emoji: "🥬", label: "Kyo Tsukemono", blurb: "Kyoto's celebrated pickles — vegetables cured in salt, rice bran, or sake lees, bright and sharp alongside almost every meal. Shibazuke (cucumber with shiso) and paper-thin senmai-zuke daikon are local favourites.",
    places: [],
  },
  {
    key: "tofu", emoji: "🧊", label: "Kyo Tofu", blurb: "Kyoto is known for its many varieties of tofu, not just the regular soybean kind. Try chewy sesame tofu, vegetal edamame tofu, and soft, custardy egg tofu.",
    places: [],
  },
  {
    key: "ayu", emoji: "🐟", label: "Ayu", blurb: "A river fish caught locally in summer. Often prepared as tempura in a 'sugata-age' style, where it looks like it's swimming on your plate. Best enjoyed beside the river in Kibune.",
    places: [
      { name: "Hirobun", city: "Kyoto", note: "Kibune riverside dining · day-trip option Sep 11", url: "https://tabelog.com/kyoto/A2601/A260502/26001599/" },
      { name: "Nakayoshi", city: "Kyoto", note: "Kibune riverside dining · day-trip option Sep 11", url: "https://tabelog.com/kyoto/A2601/A260502/26004182/" },
    ],
  },
  {
    key: "somen", emoji: "🍜", label: "Somen", blurb: "A Japanese summer staple — fine white wheat noodles served ice-cold with a light fish broth. Nara is the birthplace of somen.",
    places: [
      { name: "Hiraso", city: "Nara", note: "Lunch option Sep 12 · kaki-no-ha sushi & somen", url: "https://maps.app.goo.gl/QboQf3mbfZDfJ6za9" },
      { name: "Yamato-an", city: "Nara", note: "Lunch option Sep 12 · kaki-no-ha sushi & somen", url: "https://maps.app.goo.gl/Gp7ZjNLv7Qedrkhx8" },
    ],
  },
  {
    key: "soba", emoji: "🥢", label: "Soba", blurb: "Buckwheat noodles with a nutty depth, served chilled with dipping sauce or hot in broth.",
    places: [],
  },
  {
    key: "wasabi", emoji: "🌿", label: "Fresh wasabi", blurb: "Izu's Amagi highlands grow some of Japan's finest wasabi, grated fresh over rice or soba — a world away from the tube stuff.",
    places: [
      { name: "Zempuuteinanaban", city: "Izu", note: "Fresh soba & wasabi · lunch option Sep 7 at Shuzenji", url: "https://maps.app.goo.gl/PVgWWxNTnQPzLwt89" },
      { name: "Amago Chaya", city: "Izu", note: "Wasabi donburi & amago river fish · lunch option Sep 7 at Shuzenji", url: "https://maps.app.goo.gl/ynsmndHteXdPzbs76" },
    ],
  },
  {
    key: "izakaya", emoji: "🍶", label: "Izakaya", blurb: "Japanese for 'a place to stay and drink' — the evening third place for most middle-class people. The point is to linger and enjoy the company, not gorge and leave; some places stay open all night.",
    places: [
      { name: "Ponto-cho izakaya", city: "Kyoto", note: "Dinner & a stroll along the alley, Sep 9 · ~¥10,000 pp", url: "https://maps.app.goo.gl/Vfu7J2D69gPM15FP6" },
      { name: "Iccho", city: "Nara", note: "Local izakaya · casual dinner option Sep 12", url: "https://maps.app.goo.gl/vD5BXYFPxDweXWbMA" },
    ],
  },
  {
    key: "yakitori", emoji: "🍢", label: "Yakitori", blurb: "Beak-to-tail skewers, where almost every part of the chicken is eaten — skin, heart, cartilage and all. Enjoyed casually with friends after work over cheap drinks; unstuffy middle-class food, not a high-end delicacy.",
    places: [
      { name: "Torikizoku", city: "Kyoto", note: "Trashy after-work vibe · dinner option Sep 9", url: "https://maps.app.goo.gl/puHudWTqDS1mpUHX6" },
    ],
  },
  {
    key: "tea", emoji: "🍵", label: "Tea", blurb: "Uji, one town over from Kyoto, and Shizuoka (where Izu is) are traditional tea-growing centres. In the summer months, definitely try the cold-brewed sencha.",
    places: [
      { name: "Ippodo", city: "Kyoto", note: "Tea & a tasting room · shopping Sep 10", url: "https://maps.app.goo.gl/jghGvV36CKp1keGe7" },
      { name: "Fukujuen", city: "Kyoto", note: "Historic tea merchant · shopping Sep 10", url: "https://maps.app.goo.gl/Tg45VtGX1ZgUTviJA" },
      { name: "Kasuga Ninai-jyaya", city: "Nara", note: "Teahouse lunch inside Kasuga Taisha · Sep 12", url: "https://maps.app.goo.gl/xik7yYTUm7Buyfqz5" },
    ],
  },
  {
    key: "ekiben", emoji: "🍱", label: "Ekiben", blurb: "The station lunchbox — a regional bento bought on the platform and eaten on the train, every area with its own specialty.",
    places: [
      { name: "Tokyo Station ekiben", city: "Tokyo", note: "Grab before the Odoriko Sep 7 · and again Mishima → Kyoto Sep 9", url: "https://www.google.com/maps/search/?api=1&query=Ekiben%20Tokyo%20Station", planned: true },
    ],
  },
];

// Flattened view: every place annotated with its dish, for the location & A–Z sorts.
interface FlatPlace extends FoodPlace {
  dishKey: string;
  dishEmoji: string;
  dishLabel: string;
}
const ALL: FlatPlace[] = FOOD.flatMap(t =>
  t.places.map(p => ({ ...p, dishKey: t.key, dishEmoji: t.emoji, dishLabel: t.label }))
);

// Spots with known coordinates, for the map at the top of the page.
const SPOTS: FoodSpot[] = ALL
  .filter(p => COORDS[p.name])
  .map(p => ({ ...p, lat: COORDS[p.name][0], lng: COORDS[p.name][1] }));

function CityChip({ city }: { city: string }) {
  const cColor = cityColors[city] ?? "#888";
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 4,
      fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.08em",
      padding: "3px 8px", borderRadius: 8,
      background: cColor, color: "white",
    }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: "white" }} />
      {city.toUpperCase()}
    </span>
  );
}

function DishChip({ emoji, label }: { emoji: string; label: string }) {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 4,
      fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.06em",
      padding: "3px 8px", borderRadius: 8,
      background: "var(--cream-dark)", color: "var(--text-mid)",
      border: "1px solid var(--border)",
    }}>
      {emoji} {label}
    </span>
  );
}

function PlannedTag() {
  return (
    <span style={{
      position: "absolute", top: 14, right: 16, zIndex: 1,
      display: "inline-flex", alignItems: "center", gap: 3,
      fontSize: "0.58rem", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase",
      background: "#e6f4ea", color: "#1f7a3d",
      border: "1px solid #9dd6b0", borderRadius: 4,
      padding: "1px 6px", flexShrink: 0,
    }}>
      ✓ Planned
    </span>
  );
}

function FoodCard({ place, chip }: { place: FoodPlace; chip: React.ReactNode }) {
  const cColor = cityColors[place.city] ?? "#888";
  const href = place.url ?? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.name + " " + place.city + " Japan")}`;
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="card-hover" style={{
      position: "relative",
      display: "block", textDecoration: "none", color: "inherit", cursor: "pointer",
      background: "var(--white)", borderRadius: "var(--radius)",
      overflow: "hidden", borderBottom: `3px solid ${cColor}`,
      height: "100%",
    }}>
      {place.planned && <PlannedTag />}
      <div style={{ padding: "14px 16px" }}>
        <div style={{ marginBottom: 8 }}>{chip}</div>
        <div style={{ fontWeight: 700, fontSize: "0.9rem", color: "var(--green-deep)", marginBottom: 4, display: "flex", alignItems: "center", gap: 5, flexWrap: "wrap" }}>
          {place.name}
          <span style={{ fontSize: "0.72rem", color: "var(--green-mid)" }}>🔗</span>
        </div>
        <div style={{ fontSize: "0.78rem", color: "var(--text-mid)", lineHeight: 1.6 }}>{place.note}</div>
      </div>
    </a>
  );
}

const GRID: React.CSSProperties = { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px,1fr))", gap: 12 };

function SectionHeader({ title, count, dot }: { title: React.ReactNode; count?: number; dot?: string }) {
  return (
    <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 14 }}>
      {dot && <span style={{ width: 10, height: 10, borderRadius: "50%", background: dot, flexShrink: 0, alignSelf: "center" }} />}
      <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.2rem", color: "var(--green-deep)" }}>{title}</h2>
      {count != null && count > 0 && (
        <span style={{ fontSize: "0.7rem", fontWeight: 700, color: "var(--text-light)" }}>
          {count} {count === 1 ? "spot" : "spots"}
        </span>
      )}
      <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
    </div>
  );
}

type Sort = "dish" | "location" | "az";

export default function Food() {
  const [sort, setSort] = useState<Sort>("dish");

  return (
    <>
      <div className="animate-hero" style={{
        background: "linear-gradient(135deg, #7c1d15 0%, var(--red-japan) 100%)",
        padding: "48px 24px 40px", textAlign: "center", position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: CROSS_SVG }} />
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "2rem", color: "white", position: "relative", marginBottom: 8 }}>🍜 Food to Try</h1>
        <p style={{ color: "rgba(255,255,255,0.75)", fontSize: "0.9rem", letterSpacing: "0.12em", position: "relative" }}>
          Spots noted across the itinerary
        </p>
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 24px" }}>
        {/* Map */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.2rem", color: "var(--green-deep)" }}>🗺️ Where to eat &amp; drink</h2>
            <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
          </div>
          <FoodMap spots={SPOTS} />
        </div>

        {/* Sort control */}
        <div style={{ display: "flex", gap: 8, marginBottom: 24, alignItems: "center", flexWrap: "wrap" }}>
          <span style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--text-light)", letterSpacing: "0.08em", marginRight: 4 }}>SORT BY</span>
          {([["dish", "By Dish"], ["location", "By Location"], ["az", "A–Z"]] as const).map(([v, label]) => {
            const active = sort === v;
            return (
              <button key={v} onClick={() => setSort(v)} style={{
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

        {sort === "dish" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
            {FOOD.map(({ key, emoji, label, blurb, places }) => (
              <div key={key}>
                <SectionHeader title={<>{emoji} {label}</>} count={places.length} />
                <p style={{ fontSize: "0.78rem", color: "var(--text-light)", fontStyle: "italic", marginTop: -8, marginBottom: 14 }}>{blurb}</p>
                {places.length > 0 ? (
                  <div style={GRID}>
                    {places.map((place, i) => (
                      <Reveal key={place.city + place.name} delay={Math.min(i * 90, 500)} style={{ display: "flex" }}>
                        <div style={{ flex: 1 }}><FoodCard place={place} chip={<CityChip city={place.city} />} /></div>
                      </Reveal>
                    ))}
                  </div>
                ) : (
                  <div style={{
                    fontSize: "0.8rem", color: "var(--text-light)",
                    background: "var(--white)", border: "1px dashed var(--border)",
                    borderRadius: "var(--radius-sm)", padding: "12px 16px",
                  }}>
                    No spot picked yet — add one to the checklist and it&apos;ll show up here.
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {sort === "location" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
            {CITY_ORDER.map(city => {
              const group = ALL.filter(p => p.city === city).sort((a, b) => a.name.localeCompare(b.name));
              if (group.length === 0) return null;
              return (
                <div key={city}>
                  <SectionHeader title={city} count={group.length} dot={cityColors[city]} />
                  <div style={GRID}>
                    {group.map((place, i) => (
                      <Reveal key={place.city + place.name} delay={Math.min(i * 90, 500)} style={{ display: "flex" }}>
                        <div style={{ flex: 1 }}><FoodCard place={place} chip={<DishChip emoji={place.dishEmoji} label={place.dishLabel} />} /></div>
                      </Reveal>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {sort === "az" && (
          <div style={GRID}>
            {[...ALL].sort((a, b) => a.name.localeCompare(b.name)).map((place, i) => (
              <Reveal key={place.city + place.name} delay={Math.min(i * 45, 500)} style={{ display: "flex" }}>
                <div style={{ flex: 1 }}>
                  <FoodCard place={place} chip={
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                      <CityChip city={place.city} />
                      <DishChip emoji={place.dishEmoji} label={place.dishLabel} />
                    </div>
                  } />
                </div>
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
