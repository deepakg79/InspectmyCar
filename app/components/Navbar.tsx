"use client";

import { useState } from "react";
import Link from "next/link";
import { useBooking } from "../context/BookingContext";

export default function Navbar() {
    const [open, setOpen] = useState(false);
    const { openBooking } = useBooking();

    return (
        <nav className="fixed top-0 w-full z-[100] bg-white/80 backdrop-blur-md border-b border-white/50 shadow-sm">
            <div className="max-w-6xl mx-auto px-6 h-20 flex justify-between items-center">

                {/* LOGO */}
                <Link href="/" className="flex items-center gap-3 group">
                    <div className="bg-indigo-600 p-2 rounded-xl group-hover:rotate-6 transition-transform">
                        <img
                            src="/logo.png"
                            alt="InspectMyCar Logo"
                            className="h-8 w-8 object-contain"
                        />
                    </div>
                    <span className="font-black text-2xl tracking-tighter text-slate-900 uppercase">
                        Inspect<span className="text-indigo-600">MyCar</span>
                    </span>
                </Link>

                {/* DESKTOP NAV */}
                <div className="hidden md:flex items-center gap-8 text-sm font-bold text-slate-600">

                    {/* 🔥 Primary SEO Link */}
                    <Link href="/car-pdi-pune" className="hover:text-indigo-600 transition">
                        Car PDI Pune
                    </Link>

                    {/* 🔥 SEO Supporting Pages */}
                    <Link href="/pdi-checklist-for-new-car" className="hover:text-indigo-600 transition">
                        PDI Checklist
                    </Link>

                    <Link href="/top-10-mistakes-while-buying-car-in-pune" className="hover:text-indigo-600 transition">
                        Buying Guide
                    </Link>
                    {/* <Link href="/vindecoder" className="hover:text-indigo-600 transition">
                        Vin Decoder
                    </Link>*/}
                    {/* CTA */}
                    <button
                        onClick={() => openBooking()}
                        className="btn-primary px-6 py-2.5 text-xs shadow-md"
                    >
                        Book Now
                    </button>
                </div>

                {/* MOBILE MENU BUTTON */}
                <button
                    className="md:hidden text-2xl p-2 text-slate-900"
                    onClick={() => setOpen(!open)}
                >
                    {open ? "✕" : "☰"}
                </button>
            </div>

            {/* MOBILE MENU */}
            {open && (
                <div className="md:hidden px-6 pb-6 animate-in slide-in-from-top duration-300">
                    <div className="card-glass p-6 space-y-4 shadow-xl border-white/40 rounded-2xl">

                        <Link
                            href="/car-pdi-pune"
                            onClick={() => setOpen(false)}
                            className="block font-bold text-slate-700"
                        >
                            Car PDI Pune
                        </Link>

                        <Link
                            href="/pdi-checklist-for-new-car"
                            onClick={() => setOpen(false)}
                            className="block font-bold text-slate-700"
                        >
                            PDI Checklist
                        </Link>

                        <Link
                            href="/top-10-mistakes-while-buying-car-in-pune"
                            onClick={() => setOpen(false)}
                            className="block font-bold text-slate-700"
                        >
                            Buying Guide
                        </Link>
                        {/*   <Link
                            href="/vindecoder"
                            onClick={() => setOpen(false)}
                            className="block font-bold text-slate-700"
                        >
                            Vin Decoder
                        </Link>*/}
                        {/* CTA */}
                        <button
                            onClick={() => {
                                openBooking();
                                setOpen(false);
                            }}
                            className="w-full btn-primary px-4 py-3 text-center"
                        >
                            Book Inspection
                        </button>
                    </div>
                </div>
            )}
        </nav>
    );
}
