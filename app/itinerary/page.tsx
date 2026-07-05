const days = [
  { date: "Wed Sep 3", city: "Tokyo", label: "Arrival", hotel: "Ryumeikan Ochanomizu", meals: "Breakfast", note: "Check in, explore Akihabara or rest" },
  { date: "Thu Sep 4", city: "Tokyo", label: "Day 1", hotel: "Ryumeikan Ochanomizu", meals: "Breakfast", note: "" },
  { date: "Fri Sep 5", city: "Tokyo", label: "Day 2", hotel: "Ryumeikan Ochanomizu", meals: "Breakfast", note: "" },
  { date: "Sat Sep 6", city: "Tokyo", label: "Day 3", hotel: "Ryumeikan Ochanomizu", meals: "Breakfast", note: "Travel to Izu in the afternoon" },
  { date: "Sun Sep 7", city: "Izu", label: "Day 4", hotel: "Ochiairo Murakami", meals: "3 meals", note: "Onsen ryokan" },
  { date: "Mon Sep 8", city: "Izu", label: "Day 5", hotel: "Ochiairo Murakami", meals: "3 meals", note: "Travel to Kyoto in the afternoon" },
  { date: "Tue Sep 9", city: "Kyoto", label: "Day 6", hotel: "Soraniwa Fushimi", meals: "Breakfast", note: "" },
  { date: "Wed Sep 10", city: "Kyoto", label: "Day 7", hotel: "Soraniwa Fushimi", meals: "Breakfast", note: "" },
  { date: "Thu Sep 11", city: "Kyoto", label: "Day 8", hotel: "Soraniwa Fushimi", meals: "Breakfast", note: "Day trip to Nara" },
  { date: "Fri Sep 12", city: "Nara", label: "Day 9", hotel: "168 Hotel Nara", meals: "Breakfast", note: "" },
  { date: "Sat Sep 13", city: "Tokyo", label: "Day 10", hotel: "Ryumeikan Ochanomizu", meals: "Breakfast", note: "Return to Tokyo" },
  { date: "Sun Sep 14", city: "", label: "Departure", hotel: "—", meals: "—", note: "" },
];

const cityColors: Record<string, string> = {
  Tokyo: "#2c4a7c",
  Izu: "#3a6b4a",
  Kyoto: "#8b2635",
  Nara: "#7a5c2e",
};

export default function Itinerary() {
  return (
    <div>
      <p className="text-sm tracking-widest uppercase mb-2" style={{ color: "var(--muted)" }}>September 2026</p>
      <h1 className="text-4xl mb-12" style={{ letterSpacing: "-0.02em" }}>Itinerary</h1>

      <div className="flex flex-col gap-px" style={{ background: "var(--border)" }}>
        {days.map((day) => (
          <div key={day.date} className="flex gap-6 px-6 py-5" style={{ background: "var(--paper)" }}>
            <div className="w-28 shrink-0">
              <div className="text-sm font-medium">{day.date.split(" ").slice(1).join(" ")}</div>
              <div className="text-xs mt-0.5" style={{ color: "var(--muted)" }}>{day.date.split(" ")[0]}</div>
            </div>
            <div className="w-20 shrink-0">
              {day.city && (
                <span
                  className="text-xs tracking-widest uppercase px-2 py-0.5"
                  style={{ background: cityColors[day.city] + "18", color: cityColors[day.city] }}
                >
                  {day.city}
                </span>
              )}
            </div>
            <div className="flex-1">
              <div className="text-sm font-medium mb-0.5">{day.label}</div>
              {day.hotel !== "—" && (
                <div className="text-sm" style={{ color: "var(--muted)" }}>{day.hotel}</div>
              )}
              {day.note && (
                <div className="text-xs mt-1" style={{ color: "var(--muted)" }}>{day.note}</div>
              )}
            </div>
            <div className="text-xs shrink-0 mt-0.5" style={{ color: "var(--muted)" }}>
              {day.meals !== "—" ? day.meals : ""}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
