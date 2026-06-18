"use client";

import { useState, useEffect, useMemo } from "react";
import { db } from "@/app/lib/firebase";
import { collection, onSnapshot } from "firebase/firestore";
import dynamic from "next/dynamic";

// ✅ Dynamic imports (NO SSR)
const MapContainer = dynamic(
    () => import("react-leaflet").then(mod => mod.MapContainer),
    { ssr: false }
);

const TileLayer = dynamic(
    () => import("react-leaflet").then(mod => mod.TileLayer),
    { ssr: false }
);

const Marker = dynamic(
    () => import("react-leaflet").then(mod => mod.Marker),
    { ssr: false }
);

const Popup = dynamic(
    () => import("react-leaflet").then(mod => mod.Popup),
    { ssr: false }
);

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
    name: string;
    mobile: string;
    lat?: number;
    lng?: number;
    lastUpdated?: any;
}

export default function LiveDispatch() {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [inspector, setInspector] = useState<Inspector[]>([]);
    const [loading, setLoading] = useState(true);
    const [leaflet, setLeaflet] = useState<any>(null);
    const [mapReady, setMapReady] = useState(false);
    // 🔥 FIREBASE REALTIME
    useEffect(() => {
        const unsubBookings = onSnapshot(collection(db, "bookings"), (snapshot) => {
            const data: any[] = [];
            snapshot.forEach(doc => data.push({ id: doc.id, ...doc.data() }));
            setBookings(data);
            setLoading(false);
        });

        const unsubInspectors = onSnapshot(collection(db, "inspectors"), (snapshot) => {
            const data: any[] = [];
            snapshot.forEach(doc => data.push({ id: doc.id, ...doc.data() }));
            setInspector(data);
        });

        return () => {
            unsubBookings();
            unsubInspectors();
        };
    }, []);

    // ✅ Load Leaflet safely (client only)
    useEffect(() => {
        import("leaflet").then((L) => {
            delete (L.Icon.Default.prototype as any)._getIconUrl;

            L.Icon.Default.mergeOptions({
                iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
                iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
                shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
            });

            setLeaflet(L);
            setMapReady(true); // ✅ IMPORTANT
        });
    }, []);

    // 🟢 ONLINE LOGIC
    const isOnline = (lastUpdated: any) => {
        if (!lastUpdated) return false;

        const last = lastUpdated?.seconds
            ? lastUpdated.seconds * 1000
            : new Date(lastUpdated).getTime();

        return Date.now() - last < 5 * 60 * 1000;
    };

    const getLastSeen = (lastUpdated: any) => {
        if (!lastUpdated) return "";

        const last = lastUpdated?.seconds
            ? lastUpdated.seconds * 1000
            : new Date(lastUpdated).getTime();

        const mins = Math.floor((Date.now() - last) / 60000);
        return `${mins} min ago`;
    };

    // 🔥 Custom Marker Icon (SAFE)
    const createCustomIcon = (name: string, online: boolean) => {
        if (!leaflet) return undefined;

        return leaflet.divIcon({
            className: "",
            html: `
                <div style="display:flex;flex-direction:column;align-items:center;">
                    <div style="
                        background:${online ? "#10b981" : "#64748b"};
                        color:white;
                        padding:4px 8px;
                        border-radius:8px;
                        font-size:10px;
                        font-weight:700;
                        white-space:nowrap;
                    ">
                        ${name}
                    </div>
                    <div style="
                        width:10px;
                        height:10px;
                        background:${online ? "#10b981" : "#64748b"};
                        border-radius:50%;
                        margin-top:2px;
                    "></div>
                </div>
            `,
            iconSize: [0, 0],
        });
    };

    // 📲 WhatsApp
    const sendWhatsApp = (b: Booking) => {
        if (!b.assignedTo) return;

        const msg = `Hi ${b.name}! Your PDI for ${b.brand} ${b.model} is assigned to ${b.assignedTo}. They will reach ${b.location} at ${b.slot}.`;

        window.open(`https://wa.me/91${b.mobile}?text=${encodeURIComponent(msg)}`, "_blank");
    };


    const activeBookings = bookings.filter(
        b => b.assignedTo && b.status === "Confirmed"
    );

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

                {/* LEFT */}
                <div className="lg:col-span-2 space-y-6">

                    {/* MAP */}
                    {/* MAP */}
                    <div className="bg-white h-[450px] rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-sm">

                        {mapReady && leaflet && typeof window !== "undefined" ? (
                            <MapContainer
                                key="dispatch-map"
                                center={[18.5204, 73.8567]}
                                zoom={12}
                                className="h-full w-full"

                            >
                                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                                {inspector.map((exec, i) => {
                                    const lat = Number(exec.lat);
                                    const lng = Number(exec.lng);

                                    if (isNaN(lat) || isNaN(lng)) return null;

                                    // Optional: slight offset to avoid overlap
                                    const offset = i * 0.0002;

                                    return (
                                        <Marker
                                            key={exec.id}
                                            position={[lat + offset, lng + offset]}
                                            icon={createCustomIcon(exec.name, isOnline(exec.lastUpdated))}
                                        >
                                            <Popup>
                                                <strong>{exec.name}</strong>
                                                <br />
                                                {isOnline(exec.lastUpdated) ? "🟢 Online" : "⚫ Offline"}
                                            </Popup>
                                        </Marker>
                                    );
                                })}

                            </MapContainer>
                        ) : (
                            <div className="h-full flex items-center justify-center text-slate-400 text-sm">
                                Loading Map...
                            </div>
                        )}

                    </div>

                    {/* BOOKINGS */}
                    <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">

                        <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-6">
                            Active Dispatch ({activeBookings.length})
                        </h3>

                        {activeBookings.map(b => (
                            <div key={b.id} className="flex justify-between items-center p-4 rounded-xl hover:bg-indigo-50/40 transition-all">
                                <div>
                                    <p className="font-bold">{b.name}</p>
                                    <p className="text-xs text-slate-400">
                                        {b.assignedTo} • {b.location}
                                    </p>
                                    <p className="text-xs text-indigo-500">
                                        {b.date} • {b.slot}
                                    </p>
                                </div>

                                <button
                                    onClick={() => sendWhatsApp(b)}
                                    className="text-[10px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-600 px-4 py-2 rounded-xl hover:bg-emerald-600 hover:text-white transition-all"
                                >
                                    WhatsApp
                                </button>
                            </div>
                        ))}

                    </div>
                </div>

                {/* RIGHT */}
                <div className="space-y-6">

                    <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
                        <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-6">
                            Inspectors
                        </h3>

                        {inspector.map(exec => {
                            const online = isOnline(exec.lastUpdated);

                            return (
                                <div key={exec.id} className="py-3 border-b border-slate-100 last:border-none">
                                    <div className="flex justify-between">
                                        <p>{exec.name}</p>
                                        <span className={`text-[10px] font-black px-2 py-1 rounded-full ${online
                                            ? "bg-emerald-100 text-emerald-700"
                                            : "bg-slate-100 text-slate-500"
                                            }`}>
                                            {online ? "ONLINE" : "OFFLINE"}
                                        </span>
                                    </div>
                                    {online && exec.lastUpdated && (
                                        <p className="text-xs opacity-50">
                                            last seen {getLastSeen(exec.lastUpdated)}
                                        </p>
                                    )}
                                    {!online && exec.lastUpdated && (
                                        <p className="text-xs opacity-50">
                                            last seen {getLastSeen(exec.lastUpdated)}
                                        </p>
                                    )}
                                </div>
                            );
                        })}
                    </div>



                </div>
            </div>
        </div >
    );
}