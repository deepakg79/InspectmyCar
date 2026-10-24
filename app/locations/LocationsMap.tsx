"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { ComponentType } from "react";

import "leaflet/dist/leaflet.css";

type InspectionLocation = {
    city: string;
    slug: string;
    lat: number;
    lng: number;
    description: string;
};

type LeafletComponents = {
    MapContainer: ComponentType<any>;
    TileLayer: ComponentType<any>;
    Marker: ComponentType<any>;
    Popup: ComponentType<any>;
    Tooltip: ComponentType<any>;
};

type LeafletModule = typeof import("leaflet");

const LOCATIONS: InspectionLocation[] = [
    {
        city: "Pune",
        slug: "pune",
        lat: 18.5204,
        lng: 73.8567,
        description:
            "Vehicle inspection and new car PDI services across Pune.",
    },
    {
        city: "Mumbai",
        slug: "mumbai",
        lat: 19.076,
        lng: 72.8777,
        description:
            "Professional vehicle inspection services across Mumbai.",
    },
    {
        city: "Nashik",
        slug: "nashik",
        lat: 19.9975,
        lng: 73.7898,
        description:
            "Car inspection and PDI services across Nashik.",
    },
    {
        city: "Kolhapur",
        slug: "kolhapur",
        lat: 16.705,
        lng: 74.2433,
        description:
            "Vehicle inspection services across Kolhapur.",
    },
    {
        city: "Nagpur",
        slug: "nagpur",
        lat: 21.1458,
        lng: 79.0882,
        description:
            "Professional vehicle inspection services across Nagpur.",
    },
    {
        city: "Chhatrapati Sambhajinagar",
        slug: "chhatrapati-sambhajinagar",
        lat: 19.8762,
        lng: 75.3433,
        description:
            "Car inspection and PDI services across Chhatrapati Sambhajinagar.",
    },
    {
        city: "Solapur",
        slug: "solapur",
        lat: 17.6599,
        lng: 75.9064,
        description:
            "Vehicle inspection services across Solapur.",
    },
    {
        city: "Sangli",
        slug: "sangli",
        lat: 16.8524,
        lng: 74.5815,
        description:
            "Professional car inspection services across Sangli.",
    },
    {
        city: "Baramati",
        slug: "baramati",
        lat: 18.1853,
        lng: 74.609,
        description:
            "Vehicle inspection and PDI services across Baramati.",
    },
    {
        city: "Satara",
        slug: "satara",
        lat: 17.6805,
        lng: 74.0183,
        description:
            "Professional vehicle inspection services across Satara.",
    },
];

export default function LocationsMap() {
    const [leaflet, setLeaflet] =
        useState<LeafletComponents | null>(null);

    const [leafletCore, setLeafletCore] =
        useState<LeafletModule | null>(null);

    useEffect(() => {
        let active = true;

        const loadLeaflet = async () => {
            try {
                const [reactLeaflet, leafletModule] =
                    await Promise.all([
                        import("react-leaflet"),
                        import("leaflet"),
                    ]);

                if (!active) {
                    return;
                }

                setLeaflet({
                    MapContainer:
                        reactLeaflet.MapContainer,
                    TileLayer:
                        reactLeaflet.TileLayer,
                    Marker:
                        reactLeaflet.Marker,
                    Popup:
                        reactLeaflet.Popup,
                    Tooltip:
                        reactLeaflet.Tooltip,
                });

                setLeafletCore(leafletModule);
            } catch (error) {
                console.error(
                    "Unable to load Leaflet:",
                    error
                );
            }
        };

        loadLeaflet();

        return () => {
            active = false;
        };
    }, []);

    if (!leaflet || !leafletCore) {
        return (
            <div className="flex h-[600px] w-full items-center justify-center bg-slate-100">
                <div className="text-center">
                    <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-indigo-600" />

                    <p className="font-semibold text-slate-600">
                        Loading Maharashtra map...
                    </p>
                </div>
            </div>
        );
    }

    const {
        MapContainer,
        TileLayer,
        Marker,
        Popup,
        Tooltip,
    } = leaflet;

    const center = [
        19.21,
        74.77,
    ] as [number, number];

    return (
        <div className="relative h-[600px] w-full">
            <MapContainer
                center={center}
                zoom={7}
                scrollWheelZoom={false}
                className="h-full w-full"
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution="&copy; OpenStreetMap contributors"
                />

                {LOCATIONS.map((location) => {
                    const position = [
                        location.lat,
                        location.lng,
                    ] as [number, number];

                    const markerIcon =
                        leafletCore.divIcon({
                            className:
                                "inspectmycar-location-marker",
                            html: `
                                <div
                                    style="
                                        width: 32px;
                                        height: 32px;
                                        display: flex;
                                        align-items: center;
                                        justify-content: center;
                                    "
                                >
                                    <img
                                        src="/images/location-marker.png"
                                        alt=""
                                        width="22"
                                        height="22"
                                        style="
                                            width: 32px;
                                            height: 32px;
                                            object-fit: contain;
                                            display: block;
                                        "
                                    />
                                </div>
                            `,
                            iconSize: [52, 52],
                            iconAnchor: [26, 52],
                            popupAnchor: [0, -52],
                            tooltipAnchor: [0, -48],
                        });

                    return (
                        <Marker
                            key={location.slug}
                            position={position}
                            icon={markerIcon}
                        >
                            <Tooltip
                                direction="top"
                                offset={[0, -42]}
                                opacity={1}
                            >
                                <strong>
                                    {location.city}
                                </strong>
                            </Tooltip>

                            <Popup>
                                <div className="min-w-[220px]">
                                    <h3 className="text-lg font-bold text-slate-900">
                                        {location.city}
                                    </h3>

                                    <p className="mt-2 text-sm leading-5 text-slate-600">
                                        {
                                            location.description
                                        }
                                    </p>

                                    <div className="mt-3 rounded-lg bg-slate-50 p-2 text-xs text-slate-500">
                                        <div>
                                            <strong>
                                                Latitude:
                                            </strong>{" "}
                                            {
                                                location.lat
                                            }
                                        </div>

                                        <div>
                                            <strong>
                                                Longitude:
                                            </strong>{" "}
                                            {
                                                location.lng
                                            }
                                        </div>
                                    </div>

                                    <Link
                                        href={`/${location.slug}`}
                                        className="mt-4 inline-flex rounded-lg bg-slate-600 px-4 py-2 text-xs font-bold text-black"
                                    >
                                        View Inspection
                                    </Link>
                                </div>
                            </Popup>
                        </Marker>
                    );
                })}
            </MapContainer>

<div className="absolute bottom-5 left-5 z-[1000] rounded-xl border border-slate-200 bg-white/95 p-4 shadow-lg backdrop-blur">
    <div className="flex items-center gap-2">
        <img
            src="/images/location-marker.png"
            alt=""
            width="28"
            height="28"
            className="h-7 w-7 object-contain"
        />

        <span className="text-xs font-semibold text-slate-700">
            InspectMyCar Service Location
        </span>
    </div>

    <div className="mt-2 border-t border-slate-200 pt-2">
        <p className="text-xs font-bold text-indigo-600">
            Many more coming soon
        </p>
    </div>
</div>
        </div>
    );
}