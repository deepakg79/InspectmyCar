"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { db } from "@/app/lib/firebase";
import { collection, onSnapshot } from "firebase/firestore";
import "leaflet/dist/leaflet.css";

interface Booking {
  id: string;
  name: string;
  mobile: string;
  date: string;
  slot: string;
  location: string;
  status: string;
  brand: string;
  model: string;
  price: number;
  assignedTo?: string;
}

interface Inspector {
  id: string;
  name?: string;
  mobile?: string;
  lat?: number | string;
  lng?: number | string;
  lastUpdated?: unknown;
}

function toTimestamp(value: unknown): number | null {
  if (!value) return null;

  if (
    typeof value === "object" &&
    value !== null &&
    "toMillis" in value &&
    typeof (value as { toMillis?: unknown }).toMillis === "function"
  ) {
    return (value as { toMillis: () => number }).toMillis();
  }

  if (
    typeof value === "object" &&
    value !== null &&
    "seconds" in value &&
    typeof (value as { seconds?: unknown }).seconds === "number"
  ) {
    return (value as { seconds: number }).seconds * 1000;
  }

  const parsed = new Date(value as string | number | Date).getTime();
  return Number.isFinite(parsed) ? parsed : null;
}

function escapeHtml(value: unknown): string {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export default function LiveDispatch() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [inspector, setInspector] = useState<Inspector[]>([]);
  const [loading, setLoading] = useState(true);

  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<any>(null);
  const markerLayerRef = useRef<any>(null);
  const leafletRef = useRef<any>(null);
  const [mapReady, setMapReady] = useState(false);
  const [mapError, setMapError] = useState("");

  // Firebase realtime listeners for bookings and inspectors.
  useEffect(() => {
    const unsubBookings = onSnapshot(
      collection(db, "bookings"),
      (snapshot) => {
        const data = snapshot.docs.map((document) => ({
          id: document.id,
          ...document.data(),
        })) as Booking[];
        setBookings(data);
        setLoading(false);
      },
      (error) => {
        console.error("Failed to load bookings:", error);
        setLoading(false);
      },
    );

    const unsubInspectors = onSnapshot(
      collection(db, "inspectors"),
      (snapshot) => {
        const data = snapshot.docs.map((document) => ({
          id: document.id,
          ...document.data(),
        })) as Inspector[];
        setInspector(data);
      },
      (error) => {
        console.error("Failed to load inspectors:", error);
      },
    );

    return () => {
      unsubBookings();
      unsubInspectors();
    };
  }, []);

  // Online if the last location update was within five minutes.
  const isOnline = (lastUpdated: unknown) => {
    const last = toTimestamp(lastUpdated);
    return last !== null && Date.now() - last >= 0 && Date.now() - last < 5 * 60 * 1000;
  };

  const getLastSeen = (lastUpdated: unknown) => {
    const last = toTimestamp(lastUpdated);
    if (last === null) return "Location update unavailable";

    const mins = Math.max(0, Math.floor((Date.now() - last) / 60000));
    if (mins < 1) return "Last seen just now";
    if (mins < 60) return `Last seen ${mins} min ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `Last seen ${hours} hr${hours === 1 ? "" : "s"} ago`;
    const days = Math.floor(hours / 24);
    return `Last seen ${days} day${days === 1 ? "" : "s"} ago`;
  };

  const locatedInspectors = useMemo(() => {
    return inspector.flatMap((person) => {
      if (person.lat === undefined || person.lng === undefined) return [];
      if (person.lat === "" || person.lng === "") return [];

      const lat = Number(person.lat);
      const lng = Number(person.lng);
      if (
        !Number.isFinite(lat) ||
        !Number.isFinite(lng) ||
        lat < -90 || lat > 90 ||
        lng < -180 || lng > 180 ||
        (lat === 0 && lng === 0)
      ) {
        return [];
      }

      return [{ person, lat, lng, online: isOnline(person.lastUpdated) }];
    });
    // Refresh the derived online status when Firestore inspector data changes.
  }, [inspector]);

  // Initialize Leaflet on the client only. Start the camera centered on Pune.
  useEffect(() => {
    let cancelled = false;

    async function initializeMap() {
      // The page originally returned a loading screen before the map container
      // existed. Wait until the bookings loading state is complete so the
      // Leaflet container is mounted before initializing the map.
      if (loading || !mapRef.current) return;

      try {
        const LModule = await import("leaflet");
        if (cancelled || !mapRef.current || leafletMapRef.current) return;

        const L = LModule.default ?? LModule;
        leafletRef.current = L;

        const map = L.map(mapRef.current, {
          zoomControl: true,
          scrollWheelZoom: true,
        }).setView([18.5204, 73.8567], 11);

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          maxZoom: 19,
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        }).addTo(map);

        leafletMapRef.current = map;
        markerLayerRef.current = L.layerGroup().addTo(map);
        setMapError("");
        setMapReady(true);
        window.setTimeout(() => map.invalidateSize(), 100);
      } catch (error) {
        console.error("Leaflet map initialization failed:", error);
        setMapError("The map could not be initialized. Check the browser console and Leaflet installation.");
      }
    }

    void initializeMap();

    return () => {
      cancelled = true;
      leafletMapRef.current?.remove();
      leafletMapRef.current = null;
      markerLayerRef.current = null;
      leafletRef.current = null;
    };
  }, [loading]);

  // Refresh map markers whenever Firestore coordinates or map initialization changes.
  useEffect(() => {
    const L = leafletRef.current;
    const layer = markerLayerRef.current;
    if (!mapReady || !L || !layer) return;

    layer.clearLayers();

    locatedInspectors.forEach(({ person, lat, lng, online }) => {
      const color = online ? "#16a34a" : "#64748b";
      const marker = L.circleMarker([lat, lng], {
        radius: 9,
        color: "#ffffff",
        weight: 3,
        fillColor: color,
        fillOpacity: 1,
      });

      const name = escapeHtml(person.name || "Inspector");
      const mobile = escapeHtml(person.mobile || "Not provided");
      const status = online ? "ONLINE" : "OFFLINE / STALE";

      marker.bindPopup(
        `<div style="min-width:170px;font-family:Arial,sans-serif">` +
          `<strong style="font-size:14px">${name}</strong><br/>` +
          `<span>${mobile}</span><br/>` +
          `<span style="display:inline-block;margin-top:5px;color:${color};font-weight:700">${status}</span><br/>` +
          `<small>Lat: ${lat.toFixed(6)}<br/>Lng: ${lng.toFixed(6)}</small>` +
        `</div>`,
      );
      marker.addTo(layer);
    });
  }, [locatedInspectors, mapReady]);

  // WhatsApp message for an assigned booking.
  const sendWhatsApp = (b: Booking) => {
    if (!b.assignedTo) return;
    const msg = `Hi ${b.name}! Your PDI for ${b.brand} ${b.model} is assigned to ${b.assignedTo}. They will reach ${b.location} at ${b.slot}.`;
    window.open(
      `https://wa.me/91${b.mobile}?text=${encodeURIComponent(msg)}`,
      "_blank",
      "noopener,noreferrer",
    );
  };

  const activeBookings = bookings.filter(
    (b) => b.assignedTo && b.status === "Confirmed",
  );
  const onlineCount = locatedInspectors.filter((person) => person.online).length;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading Dispatch...
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <header className="mb-12">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div>
            <h1 className="text-6xl font-black tracking-tighter mb-2 text-slate-900">
              Live <span className="text-indigo-600 italic">Dispatch</span>
            </h1>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
              Real-time • Tracking • Allocation
            </p>
          </div>
          <div className="bg-indigo-50 px-5 py-3 rounded-2xl text-indigo-600 text-xs font-black">
            {activeBookings.length} Active
          </div>
        </div>
      </header>

      <div className="grid lg:grid-cols-3 gap-10">
        {/* LEFT: Map and active bookings */}
        <div className="lg:col-span-2 space-y-6">
          <section className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
              <div>
                <h2 className="text-sm font-black uppercase tracking-widest text-slate-400">
                  Live Inspector Locations
                </h2>
                <p className="text-xs text-slate-500 mt-2">
                  Locations update automatically from Firebase. Map centered on Pune.
                </p>
              </div>
              <div className="flex flex-wrap gap-3 text-xs font-semibold">
                <span className="text-emerald-600">● Online ({onlineCount})</span>
                <span className="text-slate-500">● Offline / stale ({locatedInspectors.length - onlineCount})</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-slate-500 mb-4">
              <span>{locatedInspectors.length} inspectors with valid coordinates</span>
              <span>Green = online</span>
              <span>Grey = offline or stale</span>
            </div>

            {mapError && <p role="alert" className="text-sm text-red-600 mb-3">{mapError}</p>}
            {!mapReady && !mapError && <p className="text-sm text-slate-500 mb-3">Loading map…</p>}

            <div
              ref={mapRef}
              className="w-full rounded-2xl overflow-hidden border border-slate-200"
              style={{ height: 480, minHeight: 360, background: "#e5e7eb" }}
            />

            {locatedInspectors.length === 0 && (
              <p className="text-xs text-slate-500 mt-3">
                No inspector documents currently have valid lat and lng coordinates.
              </p>
            )}
          </section>

          {/* Active bookings */}
          <section className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-6">
              Active Dispatch ({activeBookings.length})
            </h3>

            {activeBookings.length === 0 && (
              <p className="text-sm text-slate-500">No active confirmed bookings assigned to an inspector.</p>
            )}

            {activeBookings.map((b) => (
              <div
                key={b.id}
                className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 p-4 rounded-xl hover:bg-indigo-50/40 transition-all"
              >
                <div>
                  <p className="font-bold">{b.name}</p>
                  <p className="text-xs text-slate-400">{b.assignedTo} • {b.location}</p>
                  <p className="text-xs text-indigo-500">{b.date} • {b.slot}</p>
                  <p className="text-xs text-slate-500 mt-1">{b.brand} {b.model}</p>
                </div>
                <button
                  onClick={() => sendWhatsApp(b)}
                  className="self-start sm:self-auto text-[10px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-600 px-4 py-2 rounded-xl hover:bg-emerald-600 hover:text-white transition-all"
                >
                  WhatsApp
                </button>
              </div>
            ))}
          </section>
        </div>

        {/* RIGHT: Inspector list */}
        <aside className="space-y-6">
          <section className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between gap-3 mb-6">
              <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Inspectors</h3>
              <span className="text-xs font-bold text-emerald-600">{onlineCount} online with coordinates</span>
            </div>

            {inspector.length === 0 && <p className="text-sm text-slate-500">No inspectors found.</p>}

            {inspector.map((exec) => {
              const online = isOnline(exec.lastUpdated);
              const hasCoordinates = locatedInspectors.some((item) => item.person.id === exec.id);

              return (
                <div key={exec.id} className="py-3 border-b border-slate-100 last:border-none">
                  <div className="flex justify-between items-start gap-3">
                    <div>
                      <p className="font-semibold text-slate-800">{exec.name || "Unnamed inspector"}</p>
                      <p className="text-xs text-slate-500 mt-1">{exec.mobile || "No mobile number"}</p>
                    </div>
                    <span
                      className={`shrink-0 text-[10px] font-black px-2 py-1 rounded-full ${
                        online ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {online ? "ONLINE" : "OFFLINE"}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-2">{getLastSeen(exec.lastUpdated)}</p>
                  {!hasCoordinates && <p className="text-xs text-amber-600 mt-1">No valid location coordinates</p>}
                  {hasCoordinates && (
                    <button
                      type="button"
                      onClick={() => {
                        const map = leafletMapRef.current;
                        const match = locatedInspectors.find((item) => item.person.id === exec.id);
                        if (map && match) map.setView([match.lat, match.lng], 15, { animate: true });
                      }}
                      className="text-xs font-bold text-indigo-600 mt-2 hover:text-indigo-800"
                    >
                      View on map →
                    </button>
                  )}
                </div>
              );
            })}
          </section>
        </aside>
      </div>
    </div>
  );
}
