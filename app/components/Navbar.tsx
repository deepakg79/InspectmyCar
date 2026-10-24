"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import ReadingProgress from "@/app/components/blog/ReadingProgress";
import { CITY_PRICING } from "@/app/components/city_price";

export default function Navbar() {
    const [openMenu, setOpenMenu] = useState(false);
    const [openNewCars, setOpenNewCars] = useState(false);
    const [openUsedCars, setOpenUsedCars] = useState(false);
    const [openCities, setOpenCities] = useState(false);

    const menuRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent | TouchEvent) {
            const target = event.target as Node;

            if (
                openMenu &&
                menuRef.current &&
                !menuRef.current.contains(target) &&
                buttonRef.current &&
                !buttonRef.current.contains(target)
            ) {
                setOpenMenu(false);
                setOpenNewCars(false);
                setOpenUsedCars(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("touchstart", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("touchstart", handleClickOutside);
        };
    }, [openMenu]);

    const closeAllMenus = () => {
        setOpenMenu(false);
        setOpenNewCars(false);
        setOpenUsedCars(false);
        setOpenCities(false);
    };

    const cities = Object.values(CITY_PRICING);

    return (
        <>
            {/* =========================================================
                NAVBAR
            ========================================================== */}
<nav className="fixed top-0 w-full z-[100] bg-white border-b border-slate-200 shadow-sm">
                <div className="max-w-6xl mx-auto px-6 h-20 flex justify-between items-center">

                    {/* =================================================
                        LOGO
                    ================================================== */}
                    <Link
                        href="/"
                        onClick={closeAllMenus}
                        className="flex items-center gap-3 font-black text-2xl"
                    >
                        <img
                            src="/logo.png"
                            className="h-16 w-16"
                            alt="InspectMyCar"
                        />

                        <span className="font-black text-2xl tracking-tighter text-slate-900">
                            Inspect
                            <span className="text-indigo-600">
                                MyCar
                            </span>
                        </span>
                    </Link>


                    {/* =================================================
                        DESKTOP NAVIGATION
                    ================================================== */}
                    <div className="hidden md:flex items-center gap-8 text-sm font-bold text-slate-700">

                        {/* =================================================
                            NEW CARS PDI DROPDOWN
                        ================================================== */}
                        <div
                            className="relative"
                            onMouseEnter={() => setOpenNewCars(true)}
                            onMouseLeave={() => setOpenNewCars(false)}
                        >
                            <button
                                type="button"
                                onClick={() => {
                                    setOpenNewCars((value) => !value);
                                    setOpenUsedCars(false);
                                }}
                                className="hover:text-indigo-600 transition whitespace-nowrap"
                            >
                                New Cars PDI
                                <span className="ml-1 text-xs">▾</span>
                            </button>

                            <div
                                className={`
                                    absolute left-0 top-full pt-3 w-64
                                    transition-all duration-200
                                    ${
                                        openNewCars
                                            ? "opacity-100 visible translate-y-0"
                                            : "opacity-0 invisible translate-y-2"
                                    }
                                `}
                            >
                                <div className="bg-white/95 backdrop-blur-xl border border-slate-200 shadow-xl rounded-2xl p-2">



                                    <Link
                                        href="/new-cars/checklist"
                                        onClick={closeAllMenus}
                                        className="block px-4 py-3 rounded-xl hover:bg-indigo-50 transition"
                                    >
                                        📋 PDI Checklist
                                    </Link>

                                    <Link
                                        href="/new-cars/buying-guide"
                                        onClick={closeAllMenus}
                                        className="block px-4 py-3 rounded-xl hover:bg-indigo-50 transition"
                                    >
                                        ⚠️ Buying Guide
                                    </Link>

                                </div>
                            </div>
                        </div>


                        {/* =================================================
                            USED CARS PDI DROPDOWN
                        ================================================== */}
                        <div
                            className="relative"
                            onMouseEnter={() => setOpenUsedCars(true)}
                            onMouseLeave={() => setOpenUsedCars(false)}
                        >
                            <button
                                type="button"
                                onClick={() => {
                                    setOpenUsedCars((value) => !value);
                                    setOpenNewCars(false);
                                }}
                                className="hover:text-pink-500 transition whitespace-nowrap"
                            >
                                Used Cars PPI
                                <span className="ml-1 text-xs">▾</span>
                            </button>

                            <div
                                className={`
                                    absolute right-0 top-full pt-3 w-64
                                    transition-all duration-200
                                    ${
                                        openUsedCars
                                            ? "opacity-100 visible translate-y-0"
                                            : "opacity-0 invisible translate-y-2"
                                    }
                                `}
                            >
                                <div className="bg-white/95 backdrop-blur-xl border border-slate-200 shadow-xl rounded-2xl p-2">


                                    <Link
                                        href="/used-cars/checklist"
                                        onClick={closeAllMenus}
                                        className="block px-4 py-3 rounded-xl hover:bg-pink-50 transition"
                                    >
                                          📋 PPI Checklist
                                    </Link>

                                    <Link
                                        href="/used-cars/buying-guide"
                                        onClick={closeAllMenus}
                                        className="block px-4 py-3 rounded-xl hover:bg-pink-50 transition"
                                    >
                                        ⚠️ Buying Guide
                                    </Link>

                                </div>
                            </div>
                        </div>


                        {/* =================================================
                            PRICING
                        ================================================== */}
                        <Link
                            href="/info/pricing"
                            onClick={closeAllMenus}
                            className="hover:text-indigo-600 transition whitespace-nowrap"
                        >
                            Pricing
                        </Link>


                        {/* =================================================
                            HOW IT WORKS
                        ================================================== */}
                        <Link
                            href="/how-it-works"
                            onClick={closeAllMenus}
                            className="hover:text-indigo-600 transition whitespace-nowrap"
                        >
                            How It Works
                        </Link>
<Link
    href="/sample-report"
    onClick={closeAllMenus}
    className="block py-4 font-bold text-slate-800 hover:text-indigo-600 transition"
>
Sample Report
</Link>

                        {/* =================================================
                            FAQS
                        ================================================== */}
                        <Link
                            href="/faqs"
                            onClick={closeAllMenus}
                            className="hover:text-indigo-600 transition whitespace-nowrap"
                        >
                            FAQs
                        </Link>


                        {/* =================================================
                            CITIES MODAL BUTTON
                        ================================================== */}
                        <button
                            type="button"
                            onClick={() => {
                                setOpenCities(true);
                                setOpenNewCars(false);
                                setOpenUsedCars(false);
                            }}
                            className="hover:text-indigo-600 transition whitespace-nowrap"
                        >
                            Cities
                        </button>

                    </div>


                    {/* =================================================
                        MOBILE MENU BUTTON
                    ================================================== */}
                    <button
                        ref={buttonRef}
                        type="button"
                        className="md:hidden text-2xl text-slate-900"
                        onClick={() => {
                            setOpenMenu((value) => !value);
                            setOpenNewCars(false);
                            setOpenUsedCars(false);
                        }}
                        aria-label="Toggle navigation menu"
                        aria-expanded={openMenu}
                    >
                        {openMenu ? "✕" : "☰"}
                    </button>

                </div>


                {/* =====================================================
                    MOBILE MENU
                ====================================================== */}
                {openMenu && (
                    <div
                        ref={menuRef}
                        className="md:hidden px-6 pb-6"
                    >
                        <div className="mt-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-xl">

                            {/* =========================================
                                NEW CARS
                            ========================================== */}
                            <div className="rounded-2xl border border-slate-200 overflow-hidden">

                                <button
                                    type="button"
                                    onClick={() => {
                                        setOpenNewCars((value) => !value);
                                        setOpenUsedCars(false);
                                    }}
                                    className="w-full flex items-center justify-between p-5 hover:bg-indigo-50 transition"
                                >
                                    <div className="text-left">
                                        <p className="font-black text-xl text-slate-900">
                                            🚗 New Cars
                                        </p>

                                        <p className="text-sm text-slate-500">
                                            Pre-Delivery Inspection
                                        </p>
                                    </div>

                                    <span className="text-xl">
                                        {openNewCars ? "−" : "+"}
                                    </span>
                                </button>


                                {openNewCars && (
                                    <div className="pb-4 px-5 space-y-2">



                                        <Link
                                            href="/new-cars/checklist"
                                            onClick={closeAllMenus}
                                            className="block rounded-xl px-4 py-3 hover:bg-indigo-50 transition"
                                        >
                                            📋 PDI Checklist
                                        </Link>

                                        <Link
                                            href="/new-cars/buying-guide"
                                            onClick={closeAllMenus}
                                            className="block rounded-xl px-4 py-3 hover:bg-indigo-50 transition"
                                        >
                                            ⚠️ Buying Guide
                                        </Link>

                                    </div>
                                )}

                            </div>


                            {/* =========================================
                                USED CARS
                            ========================================== */}
                            <div className="mt-3 rounded-2xl border border-slate-200 overflow-hidden">

                                <button
                                    type="button"
                                    onClick={() => {
                                        setOpenUsedCars((value) => !value);
                                        setOpenNewCars(false);
                                    }}
                                    className="w-full flex items-center justify-between p-5 hover:bg-pink-50 transition"
                                >
                                    <div className="text-left">
                                        <p className="font-black text-xl text-slate-900">
                                            🚙 Used Cars
                                        </p>

                                        <p className="text-sm text-slate-500">
                                            Pre-Purchase Inspection
                                        </p>
                                    </div>

                                    <span className="text-xl">
                                        {openUsedCars ? "−" : "+"}
                                    </span>
                                </button>


                                {openUsedCars && (
                                    <div className="pb-4 px-5 space-y-2">



                                        <Link
                                            href="/used-cars/checklist"
                                            onClick={closeAllMenus}
                                            className="block rounded-xl px-4 py-3 hover:bg-pink-50 transition"
                                        >
                                            📋 PPI Checklist
                                        </Link>

                                        <Link
                                            href="/used-cars/buying-guide"
                                            onClick={closeAllMenus}
                                            className="block rounded-xl px-4 py-3 hover:bg-pink-50 transition"
                                        >
                                            ⚠️ Buying Guide
                                        </Link>

                                    </div>
                                )}

                            </div>


                            {/* =========================================
                                DIRECT LINKS
                            ========================================== */}
                            <div className="my-5 border-t border-slate-200" />

                            <Link
                                href="/info/pricing"
                                onClick={closeAllMenus}
                                className="block py-4 font-bold text-slate-800 hover:text-indigo-600 transition"
                            >
                                💰 Pricing
                            </Link>

                            <Link
                                href="/how-it-works"
                                onClick={closeAllMenus}
                                className="block py-4 font-bold text-slate-800 hover:text-indigo-600 transition"
                            >
                                ⚙️ How It Works
                            </Link>

<Link
    href="/sample-report"
    onClick={closeAllMenus}
    className="block py-4 font-bold text-slate-800 hover:text-indigo-600 transition"
>
    📄 Sample Report
</Link>
                            <Link
                                href="/faqs"
                                onClick={closeAllMenus}
                                className="block py-4 font-bold text-slate-800 hover:text-indigo-600 transition"
                            >
                                ❓ FAQs
                            </Link>


                            {/* =========================================
                                CITIES
                            ========================================== */}
                            <button
                                type="button"
                                onClick={() => {
                                    setOpenCities(true);
                                    setOpenMenu(false);
                                    setOpenNewCars(false);
                                    setOpenUsedCars(false);
                                }}
                                className="w-full text-left py-4 font-bold text-slate-800 hover:text-indigo-600 transition"
                            >
                                📍 Cities
                            </button>

                        </div>
                    </div>
                )}

                <ReadingProgress />
            </nav>


            {/* =========================================================
                CITIES MODAL
            ========================================================== */}
            {openCities && (
                <div
                    className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm"
                    onMouseDown={(event) => {
                        if (event.target === event.currentTarget) {
                            setOpenCities(false);
                        }
                    }}
                >
                    <div
                        className="relative w-full max-w-3xl max-h-[85vh] overflow-hidden rounded-3xl bg-white shadow-2xl"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="cities-modal-title"
                    >

                        {/* =============================================
                            MODAL HEADER
                        ============================================== */}
                        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200">
                            <div>
                                <h2
                                    id="cities-modal-title"
                                    className="text-2xl font-black text-slate-900"
                                >
                                    Choose Your City
                                </h2>

                                <p className="text-sm text-slate-500 mt-1">
                                    Select a city to view local inspection services.
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={() => setOpenCities(false)}
                                className="h-10 w-10 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-xl text-slate-700 transition"
                                aria-label="Close cities"
                            >
                                ✕
                            </button>
                        </div>


                        {/* =============================================
                            CITY CARDS
                        ============================================== */}
                        <div className="p-6 overflow-y-auto max-h-[65vh]">
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">

                                {cities.map((city) => (
                                    <Link
                                        key={city.slug}
                                        href={`/${city.slug}`}
                                        onClick={() => setOpenCities(false)}
                                        className="group rounded-2xl border border-slate-200 bg-white p-5 hover:border-indigo-300 hover:bg-indigo-50/60 hover:shadow-lg transition-all duration-200"
                                    >
                                        <div className="flex items-center gap-3">

                                            <div className="h-11 w-11 shrink-0 rounded-xl bg-indigo-100 group-hover:bg-indigo-200 flex items-center justify-center text-xl transition">
                                                📍
                                            </div>

                                            <div>
                                                <h3 className="font-black text-slate-900 group-hover:text-indigo-700 transition">
                                                    {city.name}
                                                </h3>

                                                <p className="text-xs text-slate-500 mt-1">
                                                    Car Inspection Services
                                                </p>
                                            </div>

                                        </div>
                                    </Link>
                                ))}

                            </div>
                        </div>

                    </div>
                </div>
            )}
        </>
    );
}