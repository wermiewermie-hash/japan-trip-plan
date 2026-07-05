export type PlaceCategory = "hotel" | "sight" | "food" | "activity";

export interface Place {
  name: string;
  city: string;
  category: PlaceCategory;
  lat: number;
  lng: number;
  dates?: string;
  highlights?: string[];
  googleMapsUrl: string;
}

export const places: Place[] = [
  {
    name: "Hotel Ryumeikan Tokyo",
    city: "Tokyo",
    category: "hotel",
    lat: 35.6964,
    lng: 139.7657,
    dates: "Sep 3–6 · Sep 13",
    highlights: [
      "B&A arrive Sep 3 · all 4 together from Sep 5 evening",
      "4 nights + 1 return night",
      "Breakfast included",
    ],
    googleMapsUrl: "https://maps.app.goo.gl/RVxQdXsJhuZDqvmW6",
  },
  {
    name: "Ochiairo",
    city: "Izu",
    category: "hotel",
    lat: 34.9325,
    lng: 138.9357,
    dates: "Sep 7–8",
    highlights: [
      "Odoriko Limited Express from Tokyo · Shuzenji stop en route",
      "2 nights · full board · open-air onsen",
      "Option: private taxi for Mt Fuji views Sep 8",
    ],
    googleMapsUrl: "https://maps.app.goo.gl/AN46nreHojnS9arF9",
  },
  {
    name: "Sora Niwa Terrace",
    city: "Kyoto",
    category: "hotel",
    lat: 34.9361,
    lng: 135.7613,
    dates: "Sep 9–11",
    highlights: [
      "Arrive via Shinkansen from Mishima",
      "3 nights · Shijo-Kawaramachi area · rooftop bar",
      "Mountain day trip Sep 11 (Kibune / Hieizan / Arashiyama)",
    ],
    googleMapsUrl: "https://maps.app.goo.gl/q2HjXffXJq1N2T4R9",
  },
  {
    name: "Iroha Grand Hotel",
    city: "Nara",
    category: "hotel",
    lat: 34.6843,
    lng: 135.8330,
    dates: "Sep 12",
    highlights: [
      "Arrive on Aoniyoshi tourist train from Kyoto",
      "Deer park · Shin-Yakushiji · Todaiji",
      "Dinner at Bar Savant (5 min walk)",
    ],
    googleMapsUrl: "https://maps.app.goo.gl/wpqzmnkaRuGvm4Zn9",
  },
];

export const routeStops: [number, number][] = [
  [35.6964, 139.7657], // Tokyo
  [34.9325, 138.9357], // Izu
  [34.9361, 135.7613], // Kyoto
  [34.6843, 135.8330], // Nara
];
