"use client";

import { useState } from "react";
import Reveal from "@/app/components/Reveal";

const CROSS_SVG = `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/svg%3E")`;

const cityColors: Record<string, string> = {
  Tokyo: "#2d6a4f",
  Izu:   "#52b788",
  Kyoto: "#c0392b",
  Nara:  "#c9a84c",
};

interface TimelineItem {
  time?: string;
  emoji: string;
  text: string;
  note?: string;
  todo?: boolean;
  links?: { label: string; url: string }[];
}

interface Day {
  day: number;
  city: string;
  label: string;
  title: string;
  location: string;
  items: TimelineItem[];
  highlight?: string;
}

function TodoTag() {
  return (
    <span style={{
      display: "inline-block", fontSize: "0.62rem", fontWeight: 700,
      letterSpacing: "0.08em", textTransform: "uppercase",
      background: "#fff3cd", color: "#92650a",
      border: "1px solid #f0c040", borderRadius: 4,
      padding: "1px 5px", marginLeft: 6, verticalAlign: "middle", flexShrink: 0,
    }}>
      to do
    </span>
  );
}

const DAYS: Day[] = [
  {
    day: 0, city: "Tokyo", label: "Thursday, Sep 3", title: "Tokyo Day 1 — Benjamin & Alex Arrive",
    location: "Tokyo",
    items: [
      { emoji: "✈️", text: "Flight details TBD", note: "airline, flight no., departure city & times", todo: true },
      { emoji: "🚕", text: "Airport transfer TBD", note: "Narita Express, Limousine Bus, or taxi?", todo: true },
      { emoji: "🏨", text: "Check in to Hotel Ryumeikan Tokyo" },
      { emoji: "🍽️", text: "Any plans for the evening after check-in?", todo: true },
    ],
  },
  {
    day: 1, city: "Tokyo", label: "Friday, Sep 4", title: "Tokyo Day 2",
    location: "Tokyo",
    items: [
      { emoji: "🎯", text: "Confirm or update activities", todo: true },
      { emoji: "🍽️", text: "Any specific restaurants for lunch or dinner?", todo: true },
      { emoji: "🎫", text: "Any bookings needed?", todo: true },
    ],
  },
  {
    day: 2, city: "Tokyo", label: "Saturday, Sep 5", title: "Tokyo Day 3 — Masumi & James Arrive",
    location: "Tokyo",
    items: [
      { time: "Afternoon", emoji: "🤝", text: "Masumi & James arrive — meet up at the hotel" },
      { time: "1:00–4:00", emoji: "🎭", text: "Noh play", note: "James to book tickets 8/4", todo: true },
      { time: "5:00 PM",   emoji: "🍸", text: "Happy hour at Bar Oak, Tokyo Station Hotel", note: "if time allows",
        links: [{ label: "Bar Oak", url: "https://maps.app.goo.gl/Bgx3qktHtuqciztRA" }] },
      { time: "6:30 PM",   emoji: "🍤", text: "Fancy dinner: Tempura Taku", note: "Masumi reserved via Tabelog · 25-min train ride from hotel · ~¥24,000 pp",
        links: [{ label: "Tempura Taku", url: "https://maps.app.goo.gl/veagfv5gx51sfrm2A" }] },
    ],
    highlight: "Masumi & James arrive in the afternoon — all four together tonight for a fancy tempura dinner",
  },
  {
    day: 3, city: "Tokyo", label: "Sunday, Sep 6", title: "Tokyo Day 4",
    location: "Tokyo",
    items: [
      { emoji: "🛏️", text: "Breakfast at hotel" },
      { emoji: "🎯", text: "Benjamin & Alex to pick daytime activities", todo: true },
      { emoji: "🚃", text: "Masumi & James might head to Yokohama to hang out with Mizuho", note: "TBD", todo: true },
      { emoji: "🍱", text: "Lunch: unplanned", note: "~¥1,400 pp" },
      { emoji: "🍶", text: "Dinner: izakaya around the hotel" },
    ],
  },
  {
    day: 4, city: "Izu", label: "Monday, Sep 7", title: "Tokyo → Izu · Day 1",
    location: "Tokyo → Shuzenji → Ochiairo",
    items: [
      { time: "7:00 AM",      emoji: "🛏️", text: "Breakfast at hotel" },
      { time: "8:15 AM",      emoji: "🧳", text: "Hotel check out — send luggage to Kyoto hotel", note: "~¥2,500 pp" },
      {                       emoji: "🍱", text: "Buy ekiben bento lunch at Tokyo Station before heading out", note: "~¥1,600 pp", todo: true,
        links: [{ label: "ekiben", url: "https://tokyocheapo.com/food-and-drink/ekiben-bento-guide/" }] },
      { time: "9:00 AM",      emoji: "🚄", text: "Buy Odoriko tickets — Odoriko Limited Express direct, Tokyo → Shuzenji", note: "Platform 9 · ¥4,750 pp · arr. 11:08 AM", todo: true,
        links: [{ label: "Odoriko Limited Express", url: "https://maps.app.goo.gl/fjEadpgFhmVKmf3TA" }] },
      {                       emoji: "🍡", text: "Try the ekiben on the train" },
      { time: "11:10–11:30",  emoji: "🚌", text: "Bus from station to Shuzenji main area", note: "C10 bus · ¥260",
        links: [{ label: "Bus", url: "https://maps.app.goo.gl/4xgqZ9B1j34smrxs9" }] },
      { time: "11:30–12:30",  emoji: "🏯", text: "Sightseeing at Shuzenji", note: "~¥1,500 for snacks",
        links: [{ label: "Shuzenji", url: "https://tokyocheapo.com/entertainment/shuzenji-day-trip/" }] },
      { time: "12:30–1:30",   emoji: "🍜", text: "Lunch: fresh soba & wasabi at Zempuuteinanaban, or wasabi donburi at Amago Chaya",
        links: [
          { label: "Zempuuteinanaban", url: "https://maps.app.goo.gl/PVgWWxNTnQPzLwt89" },
          { label: "Amago Chaya", url: "https://maps.app.goo.gl/ynsmndHteXdPzbs76" },
        ] },
      { time: "1:30–2:00",    emoji: "🚌", text: "Bus back to Shuzenji station", note: "C10 bus · ¥260" },
      { time: "2:00–3:00",    emoji: "🚕", text: "Hotel pickup at Shuzenji Station",
        links: [{ label: "Hotel pickup", url: "https://maps.app.goo.gl/wJ3rmEkh9sgqwLQY7" }] },
      { time: "3:00 PM",      emoji: "🏨", text: "Ochiairo check in",
        links: [{ label: "Ochiairo", url: "https://maps.app.goo.gl/e1mPphHUhP5SRf389" }] },
      { time: "5:30 PM",      emoji: "🍽️", text: "Fancy dinner: hotel kaiseki",
        links: [{ label: "Ochiairo kaiseki", url: "https://www.ochiairo.co.jp/en/cuisine/summer/" }] },
      { time: "8:00 PM~",     emoji: "♨️", text: "Spa time",
        links: [{ label: "Spa time", url: "https://www.ochiairo.co.jp/en/facility/" }] },
    ],
    highlight: "First onsen night — 3-meal ryokan experience begins",
  },
  {
    day: 5, city: "Izu", label: "Tuesday, Sep 8", title: "Izu · Day 2 — Full Ryokan Day",
    location: "Ochiairo, Izu",
    items: [
      { time: "9:00 AM",  emoji: "🛏️", text: "Hotel breakfast" },
      { time: "12:00 PM", emoji: "🍱", text: "Hotel lunch" },
      { time: "5:30 PM",  emoji: "🍽️", text: "Hotel dinner: kaiseki" },
      {                   emoji: "♨️", text: "Spa time in between" },
    ],
    highlight: "Full day at the ryokan — breakfast, lunch, and dinner all included",
  },
  {
    day: 6, city: "Kyoto", label: "Wednesday, Sep 9", title: "Izu → Kyoto · Day 1",
    location: "Izu → Mishima → Kyoto",
    items: [
      { time: "8:00 AM",     emoji: "🛏️", text: "Breakfast at hotel" },
      { time: "10:00 AM",    emoji: "🧳", text: "Check out from Ochiairo" },
      { time: "10–10:30",    emoji: "🚕", text: "Hotel car transfer, Ochiairo → Shuzenji" },
      { time: "10:30–11",    emoji: "🚃", text: "Shuzenji → Mishima on the Sunzu local line", note: "¥550 pp · Mt Fuji views along the way",
        links: [{ label: "Sunzu local line", url: "https://maps.app.goo.gl/ZCzPCLCrMNvCazGp7" }] },
      { time: "11:30–2:30",  emoji: "🚄", text: "Buy tickets — Mishima → Kyoto Shinkansen", note: "Kodama Platform 5 · ¥16,000 pp · arr. 2:30 PM", todo: true,
        links: [{ label: "Shinkansen", url: "https://maps.app.goo.gl/uSqiory76U2JnHVg9" }] },
      {                      emoji: "🍱", text: "Lunch: ekiben on the train" },
      { time: "2:30–3:00",   emoji: "🚕", text: "Cab from Kyoto Station → Shijo Kawaramachi", note: "~¥2,500 total" },
      { time: "3:00 PM",     emoji: "🏨", text: "Check in at Sora Niwa Terrace Hotel Kyoto",
        links: [{ label: "Sora Niwa Terrace Hotel Kyoto", url: "https://maps.app.goo.gl/wen337VzM1CW3ruH7" }] },
      { time: "5–6 PM",      emoji: "🍸", text: "Happy hour: hotel rooftop footbath & bar, Star Bar, or afternoon coffee at retro café Soiree",
        links: [
          { label: "Star Bar", url: "https://maps.app.goo.gl/hgwtmwaVmAcpCtTV6" },
          { label: "Soiree", url: "https://maps.app.goo.gl/fG5cnchQ2mBSVJ1N7" },
        ] },
      { time: "6–9 PM",      emoji: "🍶", text: "Dinner: Ponto-cho izakaya & a walk around the area (~¥10,000 pp), or a trashy after-work vibe at Torikizoku yakitori",
        links: [
          { label: "Ponto-cho", url: "https://maps.app.goo.gl/Vfu7J2D69gPM15FP6" },
          { label: "Torikizoku", url: "https://maps.app.goo.gl/puHudWTqDS1mpUHX6" },
        ] },
    ],
    highlight: "Arrive in Kyoto in the afternoon — explore the Shijo area and nightlife",
  },
  {
    day: 7, city: "Kyoto", label: "Thursday, Sep 10", title: "Kyoto · Day 2 — Classic Sightseeing",
    location: "Kyoto",
    items: [
      { time: "5:00 AM", emoji: "🏯", text: "Stretch goal: Fushimi Inari or Kiyomizu & Ninenzaka", note: "Kiyomizu opens 6 AM", todo: true,
        links: [
          { label: "Fushimi Inari", url: "https://maps.app.goo.gl/1KTxtrbbuPe37Qg5A" },
          { label: "Kiyomizu", url: "https://maps.app.goo.gl/tJMyNiFVhCviwsTk9" },
          { label: "Ninenzaka", url: "https://maps.app.goo.gl/GbRDdbKK1M6ry7XN9" },
        ] },
      { time: "8:00 AM", emoji: "🛏️", text: "Hotel breakfast" },
      {                  emoji: "🏯", text: "Daytime activities — popular temples early, lesser-known ones midday", note: "Masumi's picks: Nijo Castle (Edo-period), Tofukuji (bridge & zen gardens), Sanjusangendo (1,001 statues); craft shopping — fans, lacquerware at Zohiko, tea at Ippodo or Fukujuen", todo: true,
        links: [
          { label: "Nijo Castle", url: "https://maps.app.goo.gl/EXwoC4CCkkM4FuBR8" },
          { label: "Tofukuji", url: "https://maps.app.goo.gl/5Scobsc6Nz9moT9K6" },
          { label: "Sanjusangendo", url: "https://maps.app.goo.gl/UrMKdi6TM8KSW2RAA" },
          { label: "Zohiko", url: "https://maps.app.goo.gl/fdkzX4UFX3CTYVvc7" },
          { label: "Ippodo", url: "https://maps.app.goo.gl/jghGvV36CKp1keGe7" },
          { label: "Fukujuen", url: "https://maps.app.goo.gl/Tg45VtGX1ZgUTviJA" },
        ] },
      {                  emoji: "🍱", text: "Lunch: yuba, tofu, unagi, or a tsukemono spot around town while sightseeing", note: "~¥1,600 pp" },
      {                  emoji: "🍖", text: "Dinner: tonkatsu at Miyagawa Ton-emon", note: "~¥5,000 pp · check reservations Aug 9", todo: true,
        links: [{ label: "Miyagawa Ton-emon", url: "https://maps.app.goo.gl/vpsff3NT1UiDDwmC8" }] },
      {                  emoji: "🎤", text: "After dinner: karaoke at Bomb Bar, or drinks at Bar Calvador, Nokishita 711, or Rum & Whiskey",
        links: [
          { label: "Bomb Bar", url: "https://maps.app.goo.gl/NDJm2CbpNkWrNDCZ8" },
          { label: "Bar Calvador", url: "https://maps.app.goo.gl/Ste4Jtxgvf3CnM9A9" },
          { label: "Nokishita 711", url: "https://maps.app.goo.gl/UJq62s4gezZNUuan7" },
          { label: "Rum & Whiskey", url: "https://maps.app.goo.gl/MVEGQGyam8FKX8Ft6" },
        ] },
    ],
    highlight: "Classic sightseeing day",
  },
  {
    day: 8, city: "Kyoto", label: "Friday, Sep 11", title: "Kyoto · Day 3 — Mountain Day Trip",
    location: "Kyoto area",
    items: [
      { time: "7:00 AM", emoji: "🛏️", text: "Hotel breakfast" },
      {                  emoji: "💬", text: "Day trip Option 1: Kibune", note: "river dining (Hironbun or Nakayoshi) + a quaint temple in the woods (Kurama-dera or Kifune Shrine) · ~¥20,000 pp incl. fancy lunch", todo: true,
        links: [
          { label: "Hironbun", url: "https://tabelog.com/kyoto/A2601/A260502/26001599/" },
          { label: "Nakayoshi", url: "https://tabelog.com/kyoto/A2601/A260502/26004182/" },
          { label: "Kurama-dera", url: "https://maps.app.goo.gl/PUSavPhJiuY8buGq9" },
          { label: "Kifune Shrine", url: "https://maps.app.goo.gl/175zrsUKZNhqKrb36" },
        ] },
      {                  emoji: "💬", text: "Day trip Option 2: Hieizan", note: "ropeway & trolley to Enryaku-ji atop Mt Hiei, bus back through the mountains for rural views", todo: true,
        links: [
          { label: "Enryaku-ji", url: "https://maps.app.goo.gl/Nz5mCokEdkF5dukF6" },
          { label: "Ropeway & trolley route", url: "https://www.keihan.co.jp/travel/en/sightseeing/itineraries/mount-hiei-lake-biwa.html" },
        ] },
      {                  emoji: "💬", text: "Day trip Option 3: Hozugawa boat & Arashiyama", note: "tourist trolley to the top of the Hozu River, white-water boat down to Arashiyama", todo: true,
        links: [
          { label: "Hozugawa boat", url: "https://www.hozugawakudari.jp/" },
          { label: "trolley", url: "https://www.sagano-kanko.co.jp/" },
        ] },
      {                  emoji: "🧳", text: "Send luggage to Tokyo hotel during the day", note: "~¥2,500 pp" },
      {                  emoji: "🍽️", text: "Dinner: something easy — H du Pont, or yuba at Yubanzai Komameya",
        links: [
          { label: "H du Pont", url: "https://maps.app.goo.gl/arZuEWxHt9rdn5PP6" },
          { label: "Yubanzai Komameya", url: "https://maps.app.goo.gl/326KKFE58mf3PQBd9" },
        ] },
    ],
    highlight: "Get out of the city for breezier mountain areas — pick one day trip as a group!",
  },
  {
    day: 9, city: "Nara", label: "Saturday, Sep 12", title: "Kyoto → Nara · Day 1",
    location: "Kyoto → Nara",
    items: [
      { time: "5:00 AM",   emoji: "🏯", text: "Stretch goal: Fushimi Inari or Kiyomizu & Ninenzaka, whichever we haven't done", todo: true },
      { time: "9:00 AM",   emoji: "🛏️", text: "Hotel breakfast" },
      { time: "10:00 AM",  emoji: "🧳", text: "Hotel check out — train or cab to Kyoto Station" },
      {                    emoji: "💬", text: "Get Aoniyoshi tickets on 8/11 — Kyoto → Nara tourist train", note: "Option 1: 10:55–11:30 (Aoniyoshi 2, ~¥1,200 pp) · Option 2: 12:55–1:30", todo: true,
        links: [
          { label: "Aoniyoshi train", url: "https://www.kintetsu.co.jp/senden/aoniyoshi/" },
        ] },
      { time: "11:30–3:00", emoji: "🦌", text: "Drop bags at Iroha Grand, sightseeing around Nara — deer, Shin-Yakushiji (favorite), Shiga Naoya's house if time",
        links: [
          { label: "Iroha Grand", url: "https://maps.app.goo.gl/fRseKz5B5poJKFH17" },
          { label: "deer", url: "https://maps.app.goo.gl/JDggiboEmnx1NxdcA" },
          { label: "Shin-Yakushiji", url: "https://maps.app.goo.gl/w9cA8wvCUscL8LMv6" },
          { label: "Shiga Naoya's house", url: "https://maps.app.goo.gl/odDno68XDdXfG6odA" },
        ] },
      {                    emoji: "🍣", text: "Lunch: kaki-no-ha sushi or somen at Hiraso or Yamato-an, or a Japanese lunch inside Kasuga Taisha at Kasuga Ninai-jyaya",
        links: [
          { label: "Hiraso", url: "https://maps.app.goo.gl/QboQf3mbfZDfJ6za9" },
          { label: "Yamato-an", url: "https://maps.app.goo.gl/Gp7ZjNLv7Qedrkhx8" },
          { label: "Kasuga Ninai-jyaya", url: "https://maps.app.goo.gl/xik7yYTUm7Buyfqz5" },
        ] },
      { time: "3:00 PM",   emoji: "🏨", text: "Check in Iroha Grand Hotel",
        links: [{ label: "Iroha Grand", url: "https://maps.app.goo.gl/fRseKz5B5poJKFH17" }] },
      {                    emoji: "💬", text: "Discuss: a pricier historic hotel? Kazeno Naramachi (converted sake brewery) or Nara Hotel (historic Japanese/Victorian)", note: "both ~$300/nt", todo: true,
        links: [
          { label: "Kazeno Naramachi", url: "https://www.kazenoheritage.jp/en/hotels/naramachi/" },
          { label: "Nara Hotel", url: "https://www.narahotel.co.jp/eng/" },
        ] },
      { time: "5:00 PM",   emoji: "🍸", text: "Walk around Naramachi, happy hour at Bar Savant or Lamp Bar", note: "Bar Savant, 5 min walk, is fantastic",
        links: [
          { label: "Bar Savant", url: "https://maps.app.goo.gl/GNsJGXWKhrMaNHBf7" },
          { label: "Lamp Bar", url: "https://maps.app.goo.gl/WcvL1bAGoecvzamt5" },
        ] },
      {                    emoji: "🍽️", text: "Dinner: Spanish at Arkodu (check reservations ~7/15), casual okonomiyaki at Okaru, or a local izakaya like Iccho", todo: true,
        links: [
          { label: "Okaru", url: "https://maps.app.goo.gl/5uKnrvu6WVdqYgNz5" },
          { label: "Iccho", url: "https://maps.app.goo.gl/vD5BXYFPxDweXWbMA" },
        ] },
    ],
    highlight: "Book Aoniyoshi train tickets in advance — popular tourist route",
  },
  {
    day: 10, city: "Tokyo", label: "Sunday, Sep 13", title: "Nara → Tokyo",
    location: "Nara → Tokyo",
    items: [
      { time: "7:30 AM",    emoji: "🛏️", text: "Hotel breakfast" },
      { time: "7:30–10:30", emoji: "🦌", text: "Early morning Nara walk — deer park, Kasuga Taisha, Todaiji before the day-trippers arrive", note: "really nice walk",
        links: [
          { label: "deer", url: "https://maps.app.goo.gl/JDggiboEmnx1NxdcA" },
          { label: "Kasuga Taisha", url: "https://maps.app.goo.gl/AcKBJ5FX7EduyEhB9" },
          { label: "Todaiji", url: "https://maps.app.goo.gl/uithQkfmKgRR9dYo8" },
        ] },
      { time: "11:00 AM",   emoji: "🧳", text: "Check out Iroha Grand Hotel" },
      { time: "11:00 AM",   emoji: "🚄", text: "Nara → Tokyo — discuss route home, Masumi can help arrange tickets", todo: true },
    ],
    highlight: "Early morning is the best time in Nara — peaceful before the crowds",
  },
  {
    day: 11, city: "Tokyo", label: "Monday, Sep 14", title: "Departure",
    location: "Tokyo",
    items: [
      { emoji: "🧳", text: "Hotel check out" },
      { emoji: "✈️", text: "Flight details TBD", note: "airline, flight no., departure time", todo: true },
      { emoji: "🚕", text: "Transfer to airport TBD", note: "Narita or Haneda? How getting there?", todo: true },
    ],
  },
];

const CITIES = ["All", "Tokyo", "Izu", "Kyoto", "Nara"];

export default function Itinerary() {
  const [filter, setFilter] = useState("All");
  const [openDays, setOpenDays] = useState<Set<number>>(new Set([0, 1, 2]));
  const [allOpen, setAllOpen] = useState(false);

  const filtered = filter === "All" ? DAYS : DAYS.filter(d => d.city === filter);

  function toggleDay(day: number) {
    setOpenDays(prev => {
      const next = new Set(prev);
      next.has(day) ? next.delete(day) : next.add(day);
      return next;
    });
  }

  function toggleAll() {
    if (allOpen) {
      setOpenDays(new Set());
      setAllOpen(false);
    } else {
      setOpenDays(new Set(DAYS.map(d => d.day)));
      setAllOpen(true);
    }
  }

  return (
    <>
      <div className="animate-hero" style={{
        background: "linear-gradient(135deg, var(--green-deep) 0%, var(--green-mid) 100%)",
        padding: "48px 24px 40px", textAlign: "center", position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: CROSS_SVG }} />
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "2rem", color: "white", position: "relative", marginBottom: 8 }}>
          📅 Itinerary
        </h1>
        <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.9rem", letterSpacing: "0.12em", position: "relative" }}>
          September 3 – 14, 2026 · 12 days
        </p>
      </div>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "32px 24px" }}>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 24, alignItems: "center" }}>
          {CITIES.map(city => (
            <button key={city} onClick={() => setFilter(city)} style={{
              padding: "6px 16px", borderRadius: 20,
              border: `2px solid ${filter === city ? (cityColors[city] ?? "var(--green-deep)") : "var(--border)"}`,
              background: filter === city ? (cityColors[city] ?? "var(--green-deep)") : "white",
              color: filter === city ? "white" : "var(--text-mid)",
              fontSize: "0.8rem", fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
              transition: "all 0.15s",
            }}>
              {city}
            </button>
          ))}
          <button onClick={toggleAll} style={{
            marginLeft: "auto", padding: "6px 16px", borderRadius: 20,
            border: "2px solid var(--green-light)", background: "white",
            color: "var(--green-mid)", fontSize: "0.8rem", fontWeight: 600,
            cursor: "pointer", fontFamily: "inherit", transition: "all 0.15s",
          }}>
            {allOpen ? "Collapse All ↑" : "Expand All ↕"}
          </button>
        </div>

        <div style={{ position: "relative", paddingLeft: 40 }}>
          <div style={{
            position: "absolute", left: 16, top: 0, bottom: 0, width: 2,
            background: "linear-gradient(to bottom, var(--green-light), var(--gold))",
          }} />

          {filtered.map((day, idx) => {
            const color = cityColors[day.city] ?? "#888";
            const isOpen = openDays.has(day.day);
            return (
              <Reveal key={day.day} delay={Math.min(idx * 100, 600)} style={{ position: "relative", marginBottom: 24 }}>
                <div style={{
                  position: "absolute", left: -32, top: 16,
                  width: 14, height: 14, borderRadius: "50%",
                  background: color, border: "2px solid white",
                  boxShadow: `0 0 0 2px ${color}`,
                }} />

                <div style={{ background: "var(--white)", borderRadius: "var(--radius)", boxShadow: "var(--shadow)", overflow: "hidden" }}>
                  {/* Day header */}
                  <div
                    onClick={() => toggleDay(day.day)}
                    style={{
                      background: color, padding: "14px 18px",
                      display: "flex", alignItems: "center", justifyContent: "space-between",
                      cursor: "pointer", userSelect: "none",
                    }}
                  >
                    <div>
                      <div style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.8)", letterSpacing: "0.08em" }}>{day.label}</div>
                      <div style={{ fontSize: "1rem", fontWeight: 700, color: "white", marginTop: 2 }}>{day.title}</div>
                      <div style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.7)", marginTop: 2 }}>📍 {day.location}</div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{
                        background: "rgba(255,255,255,0.2)", width: 30, height: 30,
                        borderRadius: "50%", display: "grid", placeItems: "center",
                        fontSize: "0.82rem", fontWeight: 700, color: "white", flexShrink: 0,
                      }}>
                        {day.day === 0 ? "✈" : day.day}
                      </div>
                      <div style={{
                        color: "rgba(255,255,255,0.7)", fontSize: "1.2rem", flexShrink: 0,
                        transform: isOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s",
                      }}>▼</div>
                    </div>
                  </div>

                  {/* Timeline */}
                  {isOpen && (
                    <div className="expand-in" style={{ padding: "6px 0 10px" }}>
                      {day.items.map((item, i) => (
                        <div key={i} style={{
                          display: "flex", alignItems: "flex-start", gap: 10,
                          padding: "7px 18px",
                          borderBottom: i < day.items.length - 1 ? "1px solid var(--border)" : "none",
                        }}>
                          {/* Time */}
                          <div style={{
                            width: 64, flexShrink: 0, textAlign: "right",
                            fontSize: "0.7rem", color: "var(--text-light)",
                            fontWeight: 500, paddingTop: 2, lineHeight: 1.4,
                          }}>
                            {item.time ?? ""}
                          </div>

                          {/* Emoji */}
                          <div style={{ fontSize: "1rem", flexShrink: 0, lineHeight: 1.4 }}>
                            {item.emoji}
                          </div>

                          {/* Text + note */}
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: "0.85rem", color: "var(--text)", lineHeight: 1.4, display: "flex", alignItems: "center", flexWrap: "wrap", gap: 4 }}>
                              <span>{item.text}</span>
                              {item.todo && <TodoTag />}
                            </div>
                            {item.note && (
                              <div style={{ fontSize: "0.73rem", color: "var(--text-light)", marginTop: 2, lineHeight: 1.4 }}>
                                {item.note}
                              </div>
                            )}
                            {item.links && (
                              <div style={{ display: "flex", flexWrap: "wrap", gap: "4px 12px", marginTop: 4 }}>
                                {item.links.map(l => (
                                  <a
                                    key={l.url}
                                    href={l.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{
                                      fontSize: "0.72rem", fontWeight: 600,
                                      color: "var(--green-mid)", textDecoration: "none",
                                      display: "inline-flex", alignItems: "center", gap: 3,
                                    }}
                                  >
                                    🔗 {l.label}
                                  </a>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}

                      {day.highlight && (
                        <div style={{
                          margin: "10px 18px 4px",
                          background: "#fff3cd", borderLeft: "4px solid #f0a500",
                          borderRadius: "0 var(--radius-sm) var(--radius-sm) 0",
                          padding: "9px 14px", fontSize: "0.82rem", color: "#7a5f10",
                        }}>
                          {day.highlight}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </>
  );
}
