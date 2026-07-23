"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import ReadingProgress from "@/app/components/blog/ReadingProgress";
export default function Navbar() {
    const [openMenu, setOpenMenu] = useState(false);

    const [openNewCars, setOpenNewCars] = useState(false);

    const [openUsedCars, setOpenUsedCars] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const mobileMenuRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        function handlePointerDown(event: PointerEvent) {
            const target = event.target as Node;

            // Close only the mobile menu
            if (
                mobileMenuRef.current &&
                !mobileMenuRef.current.contains(target)
            ) {
                setOpenMenu(false);
            }
        }
        document.addEventListener("pointerdown", handlePointerDown);

        return () => {
            document.removeEventListener("pointerdown", handlePointerDown);
        };
    }, []);


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
                <div
                    ref={dropdownRef}
                    className="hidden md:flex items-center gap-10 text-sm font-bold text-slate-700"
                >

                    {/* NEW CARS */}
                    <div
                        className="relative group"
                        onMouseEnter={() => setOpenNewCars(true)}
                        onMouseLeave={() => setOpenNewCars(false)}
                    >
                        <button
                            onClick={() => {
                                setOpenNewCars(!openNewCars);
                                setOpenUsedCars(false);
                            }}
                            className="hover:text-indigo-600 transition"
                        >
                            New Cars PDI ▾
                        </button>
                        <div
                            className={`
        absolute right-0 top-full pt-3 w-64 max-w-[90vw]
        transition-all duration-200
        ${openNewCars
                                    ? "opacity-100 visible translate-y-0"
                                    : "opacity-0 invisible translate-y-2"
                                }
    `}
                        >

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
                    <div
                        className="relative group"
                        onMouseEnter={() => setOpenUsedCars(true)}
                        onMouseLeave={() => setOpenUsedCars(false)}
                    >
                        <button
                            onClick={() => {
                                setOpenUsedCars(!openUsedCars);
                                setOpenNewCars(false);
                            }}
                            className="hover:text-pink-500 transition"
                        >
                            Used Cars PDI ▾
                        </button>

                        <div
                            className={`
       absolute right-0 top-full pt-3 w-64 md:w-64 max-w-[90vw]
        transition-all duration-200
        ${openUsedCars
                                    ? "opacity-100 visible translate-y-0"
                                    : "opacity-0 invisible translate-y-2"
                                }
    `}
                        >

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
            </div>

            {/* MOBILE MENU */}

            <div ref={mobileMenuRef} className="md:hidden relative">
                <button
                    className="text-2xl"
                    onClick={() => setOpenMenu(!openMenu)}
                >
                    {openMenu ? "✕" : "☰"}
                </button>

                {openMenu && (
                    <div className="absolute top-14 right-0 w-[calc(100vw-3rem)] max-w-sm">
                        {/* move your existing mobile menu content here */}
                    </div>
                )}
            </div>
            {openMenu && (
                <div className="md:hidden px-6 pb-6">

                    <div className="mt-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-xl">

                        <div className="rounded-2xl border border-slate-200">

                            <button
                                onClick={() => {
                                    setOpenNewCars(!openNewCars);
                                    setOpenUsedCars(false);
                                }}
                                className="w-full flex items-center justify-between p-5 hover:bg-indigo-50 transition"
                            >

                                <div>

                                    <p className="font-black text-xl text-slate-900">
                                        🚗 New Cars
                                    </p>

                                    <p className="text-sm text-slate-500">
                                        Pre-Delivery Inspection
                                    </p>

                                </div>

                                <span>

                                    {openNewCars ? "−" : "+"}

                                </span>

                            </button>

                            {openNewCars && (

                                <div className="pb-4 px-5 space-y-2">

                                    <Link
                                        href="/new-cars/pdi-pune"
                                        onClick={() => setOpenMenu(false)}
                                        className="block rounded-xl px-4 py-3 hover:bg-indigo-50"
                                    >
                                        🚗 PDI Pune
                                    </Link>

                                    <Link
                                        href="/new-cars/checklist"
                                        onClick={() => setOpenMenu(false)}
                                        className="block rounded-xl px-4 py-3 hover:bg-indigo-50"
                                    >
                                        📋 PDI Checklist
                                    </Link>

                                    <Link
                                        href="/new-cars/buying-guide"
                                        onClick={() => setOpenMenu(false)}
                                        className="block rounded-xl px-4 py-3 hover:bg-indigo-50"
                                    >
                                        ⚠️ Buying Guide
                                    </Link>

                                </div>

                            )}

                        </div>

                        <div className="mt-3 rounded-2xl border border-slate-200">

                            <button
                                onClick={() => {
                                    setOpenUsedCars(!openUsedCars);
                                    setOpenNewCars(false);
                                }}
                                className="w-full flex items-center justify-between p-5 hover:bg-pink-50 transition"
                            >

                                <div>

                                    <p className="font-black text-xl text-slate-900">
                                        🚙 Used Cars
                                    </p>

                                    <p className="text-sm text-slate-500">
                                        Pre-Purchase Inspection
                                    </p>

                                </div>

                                <span>

                                    {openUsedCars ? "−" : "+"}

                                </span>

                            </button>

                            {openUsedCars && (

                                <div className="pb-4 px-5 space-y-2">

                                    <Link
                                        href="/used-cars/pdi-pune"
                                        onClick={() => setOpenMenu(false)}
                                        className="block rounded-xl px-4 py-3 hover:bg-pink-50"
                                    >
                                        🚙 PDI Pune
                                    </Link>

                                    <Link
                                        href="/used-cars/checklist"
                                        onClick={() => setOpenMenu(false)}
                                        className="block rounded-xl px-4 py-3 hover:bg-pink-50"
                                    >
                                        📋 Checklist
                                    </Link>

                                    <Link
                                        href="/used-cars/buying-guide"
                                        onClick={() => setOpenMenu(false)}
                                        className="block rounded-xl px-4 py-3 hover:bg-pink-50"
                                    >
                                        ⚠️ Buying Guide
                                    </Link>

                                </div>

                            )}

                        </div>

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

