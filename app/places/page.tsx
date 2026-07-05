const places = [
  {
    city: "Tokyo",
    items: [
      { name: "Senso-ji Temple", type: "Sight", note: "Asakusa — Tokyo's oldest temple" },
      { name: "Meiji Shrine", type: "Sight", note: "Harajuku — forested Shinto shrine" },
      { name: "Tsukiji Outer Market", type: "Food", note: "Fresh sushi and street food for breakfast" },
      { name: "Shibuya Crossing", type: "Sight", note: "Best viewed from Starbucks or Mag's Park above" },
      { name: "Shinjuku Gyoen", type: "Sight", note: "Large national garden, great for an afternoon walk" },
      { name: "teamLab Borderless", type: "Activity", note: "Immersive digital art — book tickets in advance" },
    ],
  },
  {
    city: "Izu",
    items: [
      { name: "Ochiairo Murakami", type: "Hotel", note: "Hillside ryokan, open-air onsen baths" },
      { name: "Jogasaki Coast", type: "Sight", note: "Dramatic lava coastline with suspension bridge" },
      { name: "Shuzenji Onsen", type: "Sight", note: "Classic onsen town along the Katsura River" },
    ],
  },
  {
    city: "Kyoto",
    items: [
      { name: "Fushimi Inari", type: "Sight", note: "Thousands of torii gates — go early morning" },
      { name: "Arashiyama Bamboo Grove", type: "Sight", note: "Visit at dawn to avoid crowds" },
      { name: "Kinkaku-ji", type: "Sight", note: "The Golden Pavilion — iconic and busy" },
      { name: "Philosopher's Path", type: "Sight", note: "Canal walk lined with cherry trees" },
      { name: "Nishiki Market", type: "Food", note: "\"Kyoto's Kitchen\" — covered market with street food" },
      { name: "Gion District", type: "Sight", note: "Best area for an evening stroll" },
    ],
  },
  {
    city: "Nara",
    items: [
      { name: "Nara Park", type: "Sight", note: "Free-roaming deer — buy shika senbei to feed them" },
      { name: "Todai-ji Temple", type: "Sight", note: "World's largest wooden building, giant Buddha inside" },
      { name: "Kasuga Taisha", type: "Sight", note: "Lantern-lined forested shrine" },
    ],
  },
];

const typeColors: Record<string, string> = {
  Sight: "#2c4a7c",
  Food: "#8b2635",
  Activity: "#3a6b4a",
  Hotel: "#7a5c2e",
};

export default function Places() {
  return (
    <div>
      <p className="text-sm tracking-widest uppercase mb-2" style={{ color: "var(--muted)" }}>Four cities</p>
      <h1 className="text-4xl mb-12" style={{ letterSpacing: "-0.02em" }}>Places</h1>

      <div className="flex flex-col gap-12">
        {places.map(({ city, items }) => (
          <div key={city}>
            <h2 className="text-xs tracking-widest uppercase mb-4 pb-3" style={{ color: "var(--muted)", borderBottom: "1px solid var(--border)" }}>
              {city}
            </h2>
            <div className="flex flex-col gap-3">
              {items.map(({ name, type, note }) => (
                <div key={name} className="flex items-start gap-4">
                  <span
                    className="text-xs tracking-wider uppercase px-2 py-0.5 mt-0.5 shrink-0"
                    style={{ background: typeColors[type] + "18", color: typeColors[type], minWidth: "60px", textAlign: "center" }}
                  >
                    {type}
                  </span>
                  <div>
                    <div className="text-sm font-medium">{name}</div>
                    <div className="text-sm" style={{ color: "var(--muted)" }}>{note}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
