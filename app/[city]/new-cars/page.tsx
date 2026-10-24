"use client";

import Image from "next/image";
import Link from "next/link";

import { useBooking } from "@/app/context/BookingContext";

import {

    CITY_PRICING,

    useCityPricing,

    formatPrice,

    type CityName,

} from "@/app/components/city_price";

export default function Home() {

    const { openNewCarBooking } = useBooking();

    /**

     * ========================================================

     * CENTRALIZED CITY + PRICING

     * ========================================================

     *

     * All city selection and pricing comes from city_price.tsx.

     *

     * Default:

     * Pune

     *

     * City is also persisted in localStorage.

     */

    const {

        selectedCity,

        cities,

        setCity,

        newCarFuelPrice,

        newCarEvPrice,

    } = useCityPricing();

    /**

     * ========================================================

     * PRICING

     * ========================================================

     */

    /**

     * Standard new-car PDI price.

     *

     * This is the "With Gauge" price.

     */

    const standardFuelPrice =

        newCarFuelPrice("withGauge");

    /**

     * EV standard PDI price.

     */

    const standardEvPrice =

        newCarEvPrice();

    /**

     * New-car pricing options.

     */

    const withoutGaugePrice =

        newCarFuelPrice("withoutGauge");

    const withObdPrice =

        newCarFuelPrice("withOBD");

    const isPune =

        selectedCity === "Pune";

    return (

        <main className="relative min-h-screen overflow-hidden bg-gradient-to-b from-slate-50 via-white to-[#EEF2FF]/40 text-slate-900">

            {/* =====================================================

                BACKGROUND

            \===================================================== */}

            <div className="absolute inset-0 -z-10 overflow-hidden">

                <div className="absolute -top-40 -left-32 h-[34rem] w-[34rem] rounded-full bg-[#818CF8]/20 blur-[120px] animate-pulse" />

                <div

                    className="absolute top-1/3 -right-32 h-[30rem] w-[30rem] rounded-full bg-[#818CF8]/20 blur-[120px] animate-pulse"

                    style={{

                        animationDelay: "1s",

                    }}

                />

                <div className="absolute bottom-0 left-1/2 h-[25rem] w-[25rem] -translate-x-1/2 rounded-full bg-[#C7D2FE]/30 blur-[120px]" />

                <div

                    className="absolute inset-0 opacity-[0.03]"

                    style={{

                        backgroundImage:

                            "linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg,#000 1px,transparent 1px)",

                        backgroundSize:

                            "60px 60px",

                    }}

                />

            </div>

            {/* =====================================================

                CITY SELECTOR

            \===================================================== */}

            <section className="relative max-w-7xl mx-auto px-6 pt-28">

                <div className="flex justify-end">

                    <div className="inline-flex items-center gap-3 rounded-2xl border border-slate-200 bg-white/90 px-4 py-3 shadow-lg backdrop-blur-md">

                        <span className="text-xs font-black uppercase tracking-wider text-slate-500">

                            📍 Select City

                        </span>

                        <select

                            value={selectedCity}

                            onChange={(e) =>

                                setCity(

                                    e.target.value as CityName

                                )

                            }

                            className="cursor-pointer bg-transparent text-sm font-black text-[#6366F1] focus:outline-none"

                        >

                            {cities.map(

                                (cityName) => (

                                    <option

                                        key={cityName}

                                        value={cityName}

                                    >

                                        {

                                            CITY_PRICING[

                                                cityName

                                            ].name

                                        }

                                    </option>

                                )

                            )}

                        </select>

                    </div>

                </div>

            </section>

            {/* =====================================================

                HERO

            \===================================================== */}

            <section className="relative max-w-7xl mx-auto px-6 pt-12 pb-20">

                <div className="grid items-start gap-8 lg:grid-cols-2 lg:gap-12 xl:gap-14">

                    {/* =================================================

                        LEFT

                    \================================================= */}

                    <div>

                        <div className="inline-flex items-center gap-3 rounded-full border border-[#E0E7FF] bg-white/70 backdrop-blur-xl px-5 py-2 shadow-lg">

                            <span className="relative flex h-3 w-3">

                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#818CF8] opacity-75" />

                                <span className="relative inline-flex h-3 w-3 rounded-full bg-[#6366F1]" />

                            </span>

                            <span className="text-xs font-black uppercase tracking-[0.25em] text-[#4F46E5]">

                                {selectedCity} • Live Booking Open

                            </span>

                        </div>

                        <h1 className="mt-7 text-5xl md:text-6xl xl:text-7xl font-black tracking-tight leading-[0.98]">

                            Your New Car

                            <br />

                            <span className="bg-gradient-to-r from-[#3730A3] via-[#4F46E5] to-[#818CF8] bg-clip-text text-transparent">

                                Deserves One

                            </span>

                            <br />

                            Final Inspection.

                        </h1>

                        <p className="mt-6 max-w-xl text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">

                            Independent 400 point

                            Pre-Delivery Inspection

                            that uncovers transport

                            damage, repaint jobs,

                            manufacturing defects and

                            hidden electronic issues

                            before you accept delivery

                            in{" "}

                            {selectedCity}.

                        </p>

                        {/* =================================================

                            PRICE SUMMARY

                        \================================================= */}

                        <div

                            className={`mt-6 grid grid-cols-1 ${isPune ? "sm:grid-cols-3" : "sm:grid-cols-2"} gap-3 w-full max-w-2xl`} 

                        >

                            {/* WITHOUT GAUGE — PUNE ONLY */}

                            {isPune && (

                                <div className="rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-lg backdrop-blur-xl">

                                    <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">

                                        Without Gauge

                                    </p>

                                    <p className="mt-2 text-2xl font-black text-slate-900">

                                        ₹

                                        {formatPrice(

                                            withoutGaugePrice

                                        )}

                                    </p>

                                    <p className="mt-1 text-xs text-slate-500">

                                        Basic PDI

                                    </p>

                                </div>

                            )}

                            {/* WITH GAUGE — ALL CITIES */}

                            {(

                                <div className="rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-lg backdrop-blur-xl">

                                    <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">

                                        With Gauge

                                    </p>

                                    <p className="mt-2 text-2xl font-black text-[#4F46E5]">

                                        ₹

                                        {formatPrice(

                                            standardFuelPrice

                                        )}

                                    </p>

                                    <p className="mt-1 text-xs text-[#6366F1]">

                                        Standard PDI

                                    </p>

                                </div>

                            )}

                            {/* WITH OBD — ALL CITIES */}

                            {isPune ? (

                                <div className="rounded-2xl border-2 border-[#C7D2FE] bg-[#EEF2FF]/80 p-4 shadow-lg">

                                    <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#6366F1]">

                                        With OBD Dignostics

                                    </p>

                                    <p className="mt-2 text-2xl font-black text-slate-900">

                                        ₹

                                        {formatPrice(

                                            withObdPrice

                                        )}

                                    </p>

                                    <p className="mt-1 text-xs text-slate-500">

Recommended PDI

                                    </p>

                                </div>

                            ) : (

                                <div className="rounded-2xl border-2 border-[#C7D2FE] bg-[#EEF2FF]/80 p-5 shadow-lg">

                                    <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#6366F1]">

                                        With OBD Dignostics

                                    </p>

                                    <p className="mt-2 text-3xl font-black text-[#4F46E5]">

                                        ₹

                                        {formatPrice(

                                            withObdPrice

                                        )}

                                    </p>

                                    <p className="mt-1 text-xs font-semibold text-[#6366F1]">

                                        Recommended PDI

                                    </p>

                                </div>

                            )}

                        </div>

                        {/* EV PRICE */}

                        <div className="mt-3 inline-flex items-center gap-3 rounded-2xl border border-[#C7D2FE] bg-[#EEF2FF]/80 px-5 py-3 shadow-sm">

                            <span className="text-lg">

                                ⚡

                            </span>

                            <div>

                                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#6366F1]">

                                    EV Inspection

                                </p>

                                <p className="text-lg font-black text-[#4F46E5]">

                                    ₹

                                    {formatPrice(

                                        standardEvPrice

                                    )}

                                </p>

                            </div>

                        </div>

                        <div className="mt-7 flex flex-col sm:flex-row flex-wrap gap-3">

                            <button

                                onClick={() =>

                                    openNewCarBooking()

                                }

                                className="group rounded-2xl bg-gradient-to-r from-[#3730A3] to-[#6366F1] px-8 py-5 font-bold text-white shadow-2xl shadow-[#6366F1]/30 transition-all duration-300 hover:-translate-y-1 hover:scale-[1.03]"

                            >

                                Book PDI in{" "}

                                {selectedCity}

                                <span className="ml-2 inline-block transition group-hover:translate-x-1">

                                    →

                                </span>

                            </button>

                            <a

                                href="tel:+919975934213"

                                className="rounded-2xl border border-slate-200 bg-white/80 backdrop-blur-xl px-8 py-5 font-bold text-slate-800 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-[#818CF8] hover:shadow-xl"

                            >

                                📞 Talk to an Expert

                            </a>

                        </div>

                    </div>

                    {/* =================================================

                        RIGHT

                    \================================================= */}



<div className="relative isolate mx-auto w-full max-w-[620px] lg:mt-[4.5rem]">
    <div className="relative aspect-[3/2] w-full overflow-hidden rounded-[2rem] bg-[#06152f] shadow-[0_30px_80px_rgba(0,0,0,0.15)] lg:rounded-[2.3rem]">
    <Image
        src="/new-cars-pdi.png"
        alt={`Professional new-car pre-delivery inspection in ${selectedCity}`}
        width={1536}
        height={1024}
        priority
        sizes="(max-width: 1024px) 100vw, 50vw"
        className="absolute inset-0 h-full w-full object-contain object-center"
    />
    </div>

    {/* QUICK STATS — placed below the hero image */}
    <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
            ["400", "Checks"],
            ["5000+", "Cars"],
            ["4.9★", "Rating"],
            ["100%", "Independent"],
        ].map(([v, l]) => (
            <div
                key={l}
                className="rounded-2xl border border-white/60 bg-white/80 p-4 shadow-lg backdrop-blur-xl transition hover:-translate-y-1 hover:shadow-xl sm:p-5"
            >
                <div className="text-xl font-black text-[#6366F1] sm:text-2xl">{v}</div>
                <div className="mt-1 text-[10px] uppercase tracking-[0.16em] text-slate-500 sm:text-xs sm:tracking-[0.2em]">{l}</div>
            </div>
        ))}
    </div>
</div>


                </div>

            </section>

            {/* =====================================================

                TRUST STATS

            \===================================================== */}

            <section className="px-6 pb-24">

                <div className="max-w-7xl mx-auto">

                    <div className="rounded-[3rem] border border-white bg-white/80 backdrop-blur-xl p-10 shadow-2xl">

                        <div className="grid gap-8 md:grid-cols-4">

                            {[

                                {

                                    icon: "🛡️",

                                    value: "Independent Inspections",

                                    label: "No Dealership TieUps.",

                                },

                                {

                                    icon: "🏢",

                                    value: "At Dealership",

                                    label: "Inspection before delivery.",

                                },

                                {

                                    icon: "⚡",

                                    value: "Instant Report",

                                    label: "Digital report with findings.",

                                },

                                {

                                    icon: "🎯",

                                    value: "400 Checks",

                                    label: "Professional PDI checklist.",

                                },

                            ].map(

                                (item) => (

                                    <div

                                        key={item.label}

                                        className="group rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-[#818CF8] hover:shadow-2xl"

                                    >

                                        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#818CF8] via-[#4F46E5] to-[#6366F1] text-3xl shadow-lg transition-all duration-300 group-hover:scale-110">

                                            {item.icon}

                                        </div>

                                        <div className="text-4xl font-black text-slate-900">

                                            {item.value}

                                        </div>

                                        <p className="mt-2 text-xs font-bold uppercase tracking-[0.25em] text-slate-500">

                                            {item.label}

                                        </p>

                                    </div>

                                )

                            )}

                        </div>

                    </div>

                </div>

            </section>


            {/* =====================================================

                FINAL CTA

            \===================================================== */}

            <section className="px-6 pb-32">

                <div className="mx-auto max-w-7xl overflow-hidden rounded-[2rem] lg:rounded-[3rem] bg-gradient-to-br from-[#3730A3] via-[#4F46E5] to-[#818CF8] shadow-[0_40px_120px_rgba(99,102,241,0.35)]">

                    <div className="grid lg:grid-cols-2 items-center">

                        {/* =================================================

                            LEFT

                        \================================================= */}

                        <div className="p-12 lg:p-16 text-white">

                            <span className="inline-flex rounded-full bg-white/15 px-5 py-2 text-xs font-black uppercase tracking-[0.3em] backdrop-blur-xl">

                                Book Your Inspection in{" "}

                                {selectedCity}

                            </span>

                            <h2 className="mt-8 text-5xl lg:text-6xl font-black leading-tight">

                                Don't Accept

                                <br />

                                A Defective

                                <br />

                                New Car.

                            </h2>

                            <p className="mt-8 text-lg leading-8 text-white/85 max-w-xl">

                                For less than the cost of a single dealership accessory,

                                ensure your vehicle is free from hidden defects, repaint

                                work and manufacturing issues before delivery in{" "}

                                {selectedCity}.

                            </p>

                            <div className="mt-10 flex flex-col gap-3">

                                {[

                                    "400 Inspection Points",

                                    "Accident Detection",

                                    "Engine & Gearbox Check",

                                    "OBD Diagnostics",

                                    "Negotiation Report",

                                    "Independent Experts",

                                ].map(

                                    (item) => (

                                        <div

                                            key={item}

                                            className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/10 px-4 py-3 backdrop-blur-xl"

                                        >

                                            <span className="text-[#C7D2FE] text-lg">

                                                ✓

                                            </span>

                                            <span className="text-sm font-medium">

                                                {item}

                                            </span>

                                        </div>

                                    )

                                )}

                            </div>

                        </div>

                        {/* =================================================

                            RIGHT - DYNAMIC PRICING CARD

                        \================================================= */}

                        <div className="bg-white p-5 sm:p-8 lg:p-16">

                            <div className="w-full rounded-[2rem] border border-slate-200 bg-slate-50 p-5 sm:p-8 lg:p-10">

                                <p className="text-sm font-black uppercase tracking-[0.3em] text-[#6366F1]">

                                    Car PDI Pricing

                                </p>

                                <p className="mt-2 text-sm font-semibold text-slate-500">

                                    {selectedCity}

                                </p>

                                {/* MAIN PRICE */}

                                    <div className="mt-4">

                                        <div className="flex items-end gap-2">

                                            <span className="text-6xl font-black text-slate-900">

                                                ₹

                                                {formatPrice(

                                                    standardFuelPrice

                                                )}

                                            </span>

                                            <span className="pb-3 text-slate-500">

                                                with gauge

                                            </span>

                                        </div>

                                        <p className="mt-2 text-sm text-slate-500">

                                            Standard new-car PDI

                                        </p>

                                    </div>

                                {/* PRICE OPTIONS */}

                                <div className="mt-8 grid gap-3">

                                    {/* PUNE ONLY — WITHOUT GAUGE */}

                                    {isPune && (

                                        <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4">

                                            <div>

                                                <p className="font-bold text-slate-800">

                                                    Without Gauge

                                                </p>

                                                <p className="text-xs text-slate-500">

                                                    ₹200 less

                                                </p>

                                            </div>

                                            <span className="text-xl font-black text-slate-900">

                                                ₹

                                                {formatPrice(

                                                    withoutGaugePrice

                                                )}

                                            </span>

                                        </div>

                                    )}

                                    {/* WITH GAUGE — ALL CITIES */}

                                    {(

                                        <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4">

                                            <div>

                                                <p className="font-bold text-slate-800">

                                                    With Gauge

                                                </p>

                                                 <p className="text-xs text-slate-500">

                                                    Standard PDI

                                                </p>

                                            </div>

                                             <span className="text-xl font-black text-slate-900">

                                                ₹

                                                {formatPrice(

                                                    standardFuelPrice

                                                )}

                                            </span>

                                        </div>

                                    )}

                                    {/* WITH OBD — ALL CITIES */}

                                    {isPune ? (

                                        <div className="flex items-center justify-between rounded-2xl border-2 border-[#C7D2FE] bg-[#EEF2FF] p-4">

                                            <div>

                                                <p className="font-bold text-[#3730A3]">

                                                    With OBD

                                                </p>

                                                <p className="text-xs text-[#6366F1]">

                                                    Advanced Diagnostics

                                                </p>

                                                <p className="text-xs text-[#6366F1]">

                                                    Recommended PDI

                                                </p>

                                            </div>

                                            <span className="text-xl font-black text-[#4F46E5]">

                                                ₹

                                                {formatPrice(

                                                    withObdPrice

                                                )}

                                            </span>

                                        </div>

                                    ) : (

                                        <div className="flex items-center justify-between rounded-2xl border-2 border-[#C7D2FE] bg-[#EEF2FF] p-4">

                                            <div>

                                                <p className="font-bold text-[#3730A3]">

                                                    With OBD

                                                </p>

                                                <p className="text-xs text-[#6366F1]">

                                                    Advanced Diagnostics

                                                </p>

                                                <p className="text-xs text-[#6366F1]">

                                                    Recommended PDI

                                                </p>

                                            </div>

                                            <span className="text-xl font-black text-[#4F46E5]">

                                                ₹

                                                {formatPrice(

                                                    withObdPrice

                                                )}

                                            </span>

                                        </div>

                                    )}

                                    {/* EV — ALL CITIES */}

                                    <div className="flex items-center justify-between rounded-2xl border border-[#C7D2FE] bg-[#EEF2FF] p-4">

                                        <div>

                                            <p className="font-bold text-[#3730A3]">

                                                EV Inspection

                                            </p>

                                            <p className="text-xs text-[#6366F1]">

                                                Complete EV PDI

                                            </p>

                                        </div>

                                        <span className="text-xl font-black text-[#4F46E5]">

                                            ₹

                                            {formatPrice(

                                                standardEvPrice

                                            )}

                                        </span>

                                    </div>

                                </div>

                                {/* BENEFITS */}

                                <div className="mt-10 space-y-4">

                                    {[

                                        "Certified PDI Engineer",

                                        "Independent Inspection",

                                        "At Your Dealership",

                                        "Instant Digital Report",

                                    ].map(

                                        (item) => (

                                            <div

                                                key={item}

                                                className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4"

                                            >

                                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E0E7FF] text-[#6366F1] font-bold">

                                                    ✓

                                                </div>

                                                <span className="font-semibold text-slate-700">

                                                    {item}

                                                </span>

                                            </div>

                                        )

                                    )}

                                </div>

                                {/* ACTIONS */}

                                <div className="mt-10 flex flex-col gap-4">

                                    <button

                                        onClick={() =>

                                            openNewCarBooking(

                                                "Standard"

                                            )

                                        }

                                        className="rounded-2xl bg-gradient-to-r from-[#3730A3] to-[#6366F1] px-8 py-5 text-lg font-bold text-white shadow-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"

                                    >

                                        Book PDI in{" "}

                                        {selectedCity} →

                                    </button>

                                    <Link

                                        href="/info/pricing#new-car-pricing"

                                        className="rounded-2xl border border-slate-300 px-8 py-5 text-center font-bold text-slate-700 transition hover:bg-slate-100"

                                    >

                                        View Pricing

                                    </Link>

                                    <a

                                        href="tel:+919975934213"

                                        className="rounded-2xl border border-[#C7D2FE] bg-[#EEF2FF] px-8 py-5 text-center font-bold text-[#4F46E5] transition hover:bg-[#E0E7FF]"

                                    >

                                        📞 Talk to an Expert

                                    </a>

                                </div>

                            </div>

                        </div>

                    </div>

                </div>

            </section>

        </main>

    );

}
