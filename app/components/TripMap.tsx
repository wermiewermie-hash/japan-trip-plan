"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { MapContainer, TileLayer, Marker, Popup, Polyline, CircleMarker, useMap } from "react-leaflet";
import L from "leaflet";
import { places, routeStops } from "@/app/data/places";
import "leaflet/dist/leaflet.css";

const cityColors: Record<string, string> = {
  Tokyo: "#2d6a4f",
  Izu:   "#52b788",
  Kyoto: "#c0392b",
  Nara:  "#c9a84c",
};

function makeIcon(city: string, num: number) {
  const color = cityColors[city] ?? "#555";
  return L.divIcon({
    className: "",
    html: `<div style="
      background:${color};color:white;
      width:28px;height:28px;border-radius:50%;
      display:flex;align-items:center;justify-content:center;
      font-size:11px;font-weight:700;
      border:2.5px solid white;
      box-shadow:0 2px 8px rgba(0,0,0,0.35);
      cursor:pointer;
      transition:transform 0.15s;
    "
    onmouseover="this.style.transform='scale(1.25)'"
    onmouseout="this.style.transform='scale(1)'"
    >${num}</div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    popupAnchor: [0, -16],
  });
}

function FitBounds() {
  const map = useMap();
  useEffect(() => {
    const bounds = L.latLngBounds(places.map((p) => [p.lat, p.lng]));
    map.fitBounds(bounds, { padding: [48, 48] });
  }, [map]);
  return null;
}

function MapController({ mapRef }: { mapRef: React.MutableRefObject<L.Map | null> }) {
  const map = useMap();
  useEffect(() => { mapRef.current = map; }, [map, mapRef]);
  return null;
}

function Legend({ onClickStop }: { onClickStop: (idx: number) => void }) {
  return (
    <div style={{
      display: "flex", flexWrap: "wrap", gap: 8, marginTop: 12,
      background: "white", borderRadius: "var(--radius)", boxShadow: "var(--shadow)",
      padding: "12px 16px", alignItems: "center",
    }}>
      <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text-light)", marginRight: 4 }}>STOPS</span>
      {places.map((p, i) => (
        <button
          key={p.name}
          onClick={() => onClickStop(i)}
          style={{
            display: "flex", alignItems: "center", gap: 6,
            fontSize: "0.75rem", color: "var(--text-mid)",
            cursor: "pointer", padding: "3px 10px", borderRadius: 12,
            border: "1px solid var(--border)", background: "var(--cream)",
            fontFamily: "inherit",
          }}
        >
          <span style={{ width: 10, height: 10, borderRadius: "50%", background: cityColors[p.city], flexShrink: 0, display: "inline-block" }} />
          {i + 1}. {p.city}
        </button>
      ))}
    </div>
  );
}

export default function TripMap() {
  const markerRefs = useRef<(L.Marker | null)[]>([]);
  const mapRef = useRef<L.Map | null>(null);

  function flyToStop(idx: number) {
    const place = places[idx];
    const marker = markerRefs.current[idx];
    if (!mapRef.current || !marker) return;
    mapRef.current.setView([place.lat, place.lng], 11, { animate: true });
    marker.openPopup();
  }

  return (
    <div>
      <MapContainer
        center={[35.3, 137.8]}
        zoom={7}
        style={{ height: 480, width: "100%", borderRadius: "var(--radius)", boxShadow: "var(--shadow)" }}
        scrollWheelZoom={false}
      >
        <MapController mapRef={mapRef} />

        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />

        <Polyline
          positions={routeStops}
          pathOptions={{ color: "#2d6a4f", weight: 3, opacity: 0.75, dashArray: "10 6" }}
        />

        <CircleMarker
          center={routeStops[0]}
          radius={18}
          pathOptions={{ color: "#2d6a4f", fillColor: "#2d6a4f", fillOpacity: 0.12, weight: 2, dashArray: "4 3" }}
        />

        {places.map((place, i) => (
          <Marker
            key={place.name}
            position={[place.lat, place.lng]}
            icon={makeIcon(place.city, i + 1)}
            ref={(el) => { markerRefs.current[i] = el; }}
          >
            <Popup>
              <div style={{ fontFamily: "'Noto Sans JP', sans-serif", minWidth: 230, maxWidth: 280 }}>
                {/* Header */}
                <div style={{
                  padding: "12px 16px 10px",
                  background: cityColors[place.city],
                  color: "white",
                }}>
                  <div style={{ fontSize: "0.7rem", opacity: 0.8, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                    Stop {i + 1}
                  </div>
                  <div style={{ fontWeight: 700, fontSize: "1rem", marginTop: 2 }}>{place.city}</div>
                  {place.dates && (
                    <div style={{ fontSize: "0.75rem", opacity: 0.85, marginTop: 2 }}>{place.dates}</div>
                  )}
                </div>

                {/* Highlights */}
                <div style={{ padding: "10px 16px" }}>
                  <div style={{ fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "#888", marginBottom: 6 }}>
                    {place.name}
                  </div>
                  {place.highlights && (
                    <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
                      {place.highlights.map((h, j) => (
                        <li key={j} style={{
                          fontSize: "0.8rem", color: "#444", lineHeight: 1.5,
                          padding: "3px 0 3px 12px", position: "relative",
                          borderBottom: j < (place.highlights?.length ?? 0) - 1 ? "1px dashed #eee" : "none",
                        }}>
                          <span style={{ position: "absolute", left: 0, color: cityColors[place.city], fontWeight: 700 }}>›</span>
                          {h}
                        </li>
                      ))}
                    </ul>
                  )}

                  {/* Link to itinerary */}
                  <div style={{ marginTop: 10, paddingTop: 8, borderTop: "1px dashed #e0d8cc" }}>
                    <Link
                      href="/itinerary"
                      style={{
                        fontSize: "0.75rem", fontWeight: 700, textDecoration: "none",
                        color: cityColors[place.city],
                        display: "flex", alignItems: "center", gap: 4,
                      }}
                    >
                      View full itinerary →
                    </Link>
                  </div>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}

        <FitBounds />
      </MapContainer>

      <Legend onClickStop={flyToStop} />
    </div>
  );
}
