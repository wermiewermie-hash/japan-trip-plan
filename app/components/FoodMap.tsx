"use client";

import { useEffect, useMemo, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const cityColors: Record<string, string> = {
  Tokyo: "#2d6a4f",
  Izu:   "#52b788",
  Kyoto: "#c0392b",
  Nara:  "#c9a84c",
};

export interface FoodSpot {
  name: string;
  city: string;
  note: string;
  url?: string;
  dishEmoji: string;
  dishLabel: string;
  lat: number;
  lng: number;
  planned?: boolean;
}

function makeIcon(city: string, emoji: string) {
  const color = cityColors[city] ?? "#555";
  return L.divIcon({
    className: "",
    html: `<div style="
      background:${color};
      width:30px;height:30px;
      border-radius:50% 50% 50% 0;
      transform:rotate(-45deg);
      display:flex;align-items:center;justify-content:center;
      border:2.5px solid white;
      box-shadow:0 2px 8px rgba(0,0,0,0.35);
      transition:transform 0.15s;
    "
    onmouseover="this.style.transform='rotate(-45deg) scale(1.2)'"
    onmouseout="this.style.transform='rotate(-45deg) scale(1)'"
    ><span style="transform:rotate(45deg);font-size:15px;line-height:1;">${emoji}</span></div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 28],
    popupAnchor: [0, -26],
  });
}

function FitBounds({ spots }: { spots: FoodSpot[] }) {
  const map = useMap();
  useEffect(() => {
    if (spots.length === 0) return;
    const bounds = L.latLngBounds(spots.map((s) => [s.lat, s.lng]));
    map.fitBounds(bounds, { padding: [44, 44], maxZoom: 15, animate: true });
  }, [map, spots]);
  return null;
}

const CITIES = ["All", "Tokyo", "Izu", "Kyoto", "Nara"];

export default function FoodMap({ spots }: { spots: FoodSpot[] }) {
  const [city, setCity] = useState("All");
  const shown = useMemo(
    () => (city === "All" ? spots : spots.filter((s) => s.city === city)),
    [spots, city]
  );

  return (
    <div>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12, alignItems: "center" }}>
        {CITIES.map((c) => {
          const active = city === c;
          const color = cityColors[c] ?? "var(--green-deep)";
          return (
            <button key={c} onClick={() => setCity(c)} style={{
              padding: "5px 14px", borderRadius: 20,
              border: `2px solid ${active ? color : "var(--border)"}`,
              background: active ? color : "white",
              color: active ? "white" : "var(--text-mid)",
              fontSize: "0.78rem", fontWeight: 600, cursor: "pointer",
              fontFamily: "inherit", transition: "all 0.15s",
            }}>
              {c}
            </button>
          );
        })}
      </div>

      <MapContainer
        center={[35, 137]}
        zoom={6}
        style={{ height: 420, width: "100%", borderRadius: "var(--radius)", boxShadow: "var(--shadow)" }}
        scrollWheelZoom={false}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />

        {shown.map((s) => {
          const href = s.url ?? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(s.name + " " + s.city + " Japan")}`;
          return (
            <Marker key={s.city + s.name} position={[s.lat, s.lng]} icon={makeIcon(s.city, s.dishEmoji)}>
              <Popup>
                <div style={{ fontFamily: "'Noto Sans JP', sans-serif", minWidth: 210, maxWidth: 260 }}>
                  <div style={{ padding: "10px 14px 9px", background: cityColors[s.city], color: "white" }}>
                    <div style={{ fontSize: "0.68rem", opacity: 0.85, letterSpacing: "0.06em", textTransform: "uppercase" }}>
                      {s.dishEmoji} {s.dishLabel} · {s.city}
                    </div>
                    <div style={{ fontWeight: 700, fontSize: "0.98rem", marginTop: 2, display: "flex", alignItems: "center", gap: 6 }}>
                      {s.name}
                      {s.planned && (
                        <span style={{
                          fontSize: "0.58rem", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase",
                          background: "rgba(255,255,255,0.9)", color: "#1f7a3d",
                          borderRadius: 4, padding: "1px 5px",
                        }}>✓ Planned</span>
                      )}
                    </div>
                  </div>
                  <div style={{ padding: "9px 14px" }}>
                    <div style={{ fontSize: "0.8rem", color: "#444", lineHeight: 1.5 }}>{s.note}</div>
                    <div style={{ marginTop: 9, paddingTop: 7, borderTop: "1px dashed #e0d8cc" }}>
                      <a href={href} target="_blank" rel="noopener noreferrer" style={{
                        fontSize: "0.75rem", fontWeight: 700, textDecoration: "none",
                        color: cityColors[s.city], display: "inline-flex", alignItems: "center", gap: 4,
                      }}>
                        Open in Google Maps →
                      </a>
                    </div>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}

        <FitBounds spots={shown} />
      </MapContainer>
    </div>
  );
}
