"use client";

import { useState } from "react";
import Link from "next/link";
import ReadingProgress from "@/app/components/blog/ReadingProgress";
export default function Navbar() {
    const [openMenu, setOpenMenu] = useState(false);

    return (
        <nav className="fixed top-0 w-full z-[100] bg-white/70 backdrop-blur-xl border-b border-white/40 shadow-sm">
            <div className="max-w-6xl mx-auto px-6 h-20 flex justify-between items-center">

                {/* LOGO */}
                <Link href="/" className="flex items-center gap-3 font-black text-2xl">
                    <img src="/logo.png" className="h-16 w-16" alt="logo" />
                    <span className="font-black text-2xl tracking-tighter text-slate-900">
                        Inspect<span className="text-indigo-600">MyCar</span>
                    </span>
                </Link>

                {/* DESKTOP NAV */}
                <div className="hidden md:flex items-center gap-10 text-sm font-bold text-slate-700">

                    {/* NEW CARS */}
                    <div className="relative group">
                        <button className="hover:text-indigo-600 transition">
                            New Cars PDI ▾
                        </button>

                        <div className="absolute left-0 top-10 w-64 opacity-0 invisible group-hover:opacity-100 group-hover:visible
                            translate-y-2 group-hover:translate-y-0 transition-all duration-200">

                            <div className="bg-white/90 backdrop-blur-xl border border-white/40 shadow-xl rounded-2xl p-2">

                                <Link
                                    href="/new-cars/pdi-pune"
                                    className="block px-4 py-3 rounded-xl hover:bg-indigo-50 transition"
                                >
                                    🚗 PDI Pune
                                </Link>

                                <Link
                                    href="/new-cars/checklist"
                                    className="block px-4 py-3 rounded-xl hover:bg-indigo-50 transition"
                                >
                                    📋 PDI Checklist
                                </Link>

                                <Link
                                    href="/new-cars/buying-guide"
                                    className="block px-4 py-3 rounded-xl hover:bg-indigo-50 transition"
                                >
                                    ⚠️ Buying Guide
                                </Link>

                            </div>
                        </div>
                    </div>

                    {/* USED CARS */}
                    <div className="relative group">
                        <button className="hover:text-pink-500 transition">
                            Used Cars PDI ▾
                        </button>

                        <div className="absolute left-0 top-10 w-64 opacity-0 invisible group-hover:opacity-100 group-hover:visible
                            translate-y-2 group-hover:translate-y-0 transition-all duration-200">

                            <div className="bg-white/90 backdrop-blur-xl border border-white/40 shadow-xl rounded-2xl p-2">

                                <Link
                                    href="/used-cars/pdi-pune"
                                    className="block px-4 py-3 rounded-xl hover:bg-pink-50 transition"
                                >
                                    🚙 PDI Pune
                                </Link>

                                <Link
                                    href="/used-cars/checklist"
                                    className="block px-4 py-3 rounded-xl hover:bg-pink-50 transition"
                                >
                                    📋 Checklist
                                </Link>

                                <Link
                                    href="/used-cars/buying-guide"
                                    className="block px-4 py-3 rounded-xl hover:bg-pink-50 transition"
                                >
                                    ⚠️ Buying Guide
                                </Link>

                            </div>
                        </div>
                    </div>


                </div>

                {/* MOBILE MENU BUTTON */}
                <button
                    className="md:hidden text-2xl"
                    onClick={() => setOpenMenu(!openMenu)}
                >
                    {openMenu ? "✕" : "☰"}
                </button>
            </div>

            {/* MOBILE MENU */}
            {openMenu && (
                <div className="md:hidden px-6 pb-6">

                    <div className="mt-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-xl">

                        <Link
                            href="/new-cars"
                            onClick={() => setOpenMenu(false)}
                            className="flex items-center justify-between rounded-2xl p-5 hover:bg-indigo-50 transition"
                        >
                            <div>
                                <p className="font-black text-xl text-slate-900">
                                    🚗 New Cars
                                </p>
                                <p className="text-sm text-slate-500">
                                    Pre-Delivery Inspection
                                </p>
                            </div>

                            <span>→</span>
                        </Link>

                        <Link
                            href="/used-cars"
                            onClick={() => setOpenMenu(false)}
                            className="mt-3 flex items-center justify-between rounded-2xl p-5 hover:bg-pink-50 transition"
                        >
                            <div>
                                <p className="font-black text-xl text-slate-900">
                                    🚙 Used Cars
                                </p>
                                <p className="text-sm text-slate-500">
                                    Pre-Purchase Inspection
                                </p>
                            </div>

                            <span>→</span>
                        </Link>

                        <div className="my-5 border-t" />

                        <Link
                            href="/faqs"
                            onClick={() => setOpenMenu(false)}
                            className="block py-3 font-semibold"
                        >
                            FAQs
                        </Link>

                        <Link
                            href="/info/how-it-works"
                            onClick={() => setOpenMenu(false)}
                            className="block py-3 font-semibold"
                        >
                            How It Works
                        </Link>

                        <Link
                            href="/info/pricing"
                            onClick={() => setOpenMenu(false)}
                            className="block py-3 font-semibold"
                        >
                            Pricing
                        </Link>

                    </div>

                </div>
            )}
            <ReadingProgress />
        </nav>
    );
}