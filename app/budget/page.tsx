const hotels = [
  { dates: "Sep 3–6", city: "Tokyo", hotel: "Ryumeikan Ochanomizu", nights: 4, perRoomPerNight: 35000, perRoomPerNightUSD: 224, rooms: 2 },
  { dates: "Sep 7–8", city: "Izu", hotel: "Ochiairo Murakami", nights: 2, perRoomPerNight: 177500, perRoomPerNightUSD: 1138, rooms: 2 },
  { dates: "Sep 9–11", city: "Kyoto", hotel: "Soraniwa Fushimi", nights: 3, perRoomPerNight: 24833, perRoomPerNightUSD: 159, rooms: 2 },
  { dates: "Sep 12", city: "Nara", hotel: "168 Hotel Nara", nights: 1, perRoomPerNight: 25400, perRoomPerNightUSD: 163, rooms: 2 },
  { dates: "Sep 13", city: "Tokyo", hotel: "Ryumeikan Ochanomizu", nights: 1, perRoomPerNight: 35000, perRoomPerNightUSD: 224, rooms: 2, note: "Not yet booked" },
];

function fmt(n: number) {
  return n.toLocaleString();
}

export default function Budget() {
  const totalYen = hotels.reduce((s, h) => s + h.perRoomPerNight * h.nights * h.rooms, 0);
  const totalUSD = hotels.reduce((s, h) => s + h.perRoomPerNightUSD * h.nights * h.rooms, 0);
  const totalPerCouple = { yen: totalYen / 2, usd: totalUSD / 2 };

  return (
    <div>
      <p className="text-sm tracking-widest uppercase mb-2" style={{ color: "var(--muted)" }}>Estimated</p>
      <h1 className="text-4xl mb-12" style={{ letterSpacing: "-0.02em" }}>Budget</h1>

      <h2 className="text-xs tracking-widest uppercase mb-4" style={{ color: "var(--muted)" }}>Accommodation</h2>

      <div className="flex flex-col gap-px mb-2" style={{ background: "var(--border)" }}>
        <div className="flex gap-4 px-4 py-2 text-xs tracking-widest uppercase" style={{ color: "var(--muted)", background: "var(--paper)" }}>
          <div className="w-20 shrink-0">Dates</div>
          <div className="flex-1">Hotel</div>
          <div className="w-16 text-right shrink-0">¥/room</div>
          <div className="w-16 text-right shrink-0">Nights</div>
          <div className="w-20 text-right shrink-0">Total USD</div>
        </div>
        {hotels.map((h) => (
          <div key={h.dates + h.city} className="flex gap-4 px-4 py-4 text-sm" style={{ background: "var(--paper)" }}>
            <div className="w-20 shrink-0" style={{ color: "var(--muted)" }}>{h.dates}</div>
            <div className="flex-1">
              <div>{h.hotel}</div>
              <div className="text-xs mt-0.5" style={{ color: "var(--muted)" }}>{h.city}{h.note ? ` · ${h.note}` : ""}</div>
            </div>
            <div className="w-16 text-right shrink-0" style={{ color: "var(--muted)" }}>¥{fmt(h.perRoomPerNight)}</div>
            <div className="w-16 text-right shrink-0" style={{ color: "var(--muted)" }}>{h.nights}</div>
            <div className="w-20 text-right shrink-0">${fmt(h.perRoomPerNightUSD * h.nights * h.rooms)}</div>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-px mb-12" style={{ background: "var(--border)" }}>
        <div className="flex gap-4 px-4 py-4 text-sm font-medium" style={{ background: "var(--paper)" }}>
          <div className="flex-1">Total (2 rooms, 11 nights)</div>
          <div className="text-right">¥{fmt(totalYen)} &nbsp;·&nbsp; ${fmt(totalUSD)}</div>
        </div>
        <div className="flex gap-4 px-4 py-4 text-sm" style={{ background: "var(--paper)", color: "var(--muted)" }}>
          <div className="flex-1">Per couple</div>
          <div className="text-right">¥{fmt(totalPerCouple.yen)} &nbsp;·&nbsp; ${fmt(totalPerCouple.usd)}</div>
        </div>
      </div>

      <div className="text-xs p-4 mb-8" style={{ background: "var(--border)", color: "var(--muted)" }}>
        Exchange rate used: ¥156 = $1. Costs shown are accommodation only — flights, transport, food, and activities are not included. Sep 13 Tokyo night not yet booked; estimate used.
      </div>

      <h2 className="text-xs tracking-widest uppercase mb-4" style={{ color: "var(--muted)" }}>Meal inclusions</h2>
      <div className="flex flex-col gap-px" style={{ background: "var(--border)" }}>
        {[
          { city: "Tokyo (Ryumeikan)", inclusion: "Breakfast included" },
          { city: "Izu (Ochiairo)", inclusion: "3 meals per day — breakfast, lunch, dinner" },
          { city: "Kyoto (Soraniwa)", inclusion: "Breakfast included" },
          { city: "Nara (168 Hotel)", inclusion: "Breakfast included" },
        ].map(({ city, inclusion }) => (
          <div key={city} className="flex justify-between px-4 py-4 text-sm" style={{ background: "var(--paper)" }}>
            <div>{city}</div>
            <div style={{ color: "var(--muted)" }}>{inclusion}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
