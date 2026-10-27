"use client";



import { useBooking } from "@/app/context/BookingContext";

import {

    CITY_PRICING,

    useCityPricing,

    formatPrice,

    type CityName,

} from "@/app/components/city_price";

import Link from "next/link";
import Image from "next/image";



export default function UsedCarsPage() {

    const { openUsedCarBooking } = useBooking();



    /**

     * ========================================================

     * CENTRALIZED CITY + PRICING

     * ========================================================

     *

     * City is loaded from the shared city_price.tsx helper.

     *

     * - Defaults to Pune

     * - Reads selectedCity from localStorage

     * - Automatically reacts to city changes

     * - Used-car price comes from CITY_PRICING

     */

    const {

        selectedCity,

        cityPricing,

        cities,

        setCity,

    } = useCityPricing();



    return (

        <main className="relative min-h-screen overflow-hidden bg-gradient-to-b from-slate-50 via-white to-indigo-50/40 text-slate-900">



            {/* =================================================

                BACKGROUND

            \================================================= */}



            <div className="absolute inset-0 -z-10 overflow-hidden">



                <div className="absolute -top-40 -left-32 h-[34rem] w-[34rem] rounded-full bg-indigo-400/20 blur-[120px] animate-pulse" />



                <div

                    className="absolute top-1/3 -right-32 h-[30rem] w-[30rem] rounded-full bg-indigo-400/20 blur-[120px] animate-pulse"

                    style={{ animationDelay: "2s" }}

                />



                <div className="absolute bottom-0 left-1/2 h-[24rem] w-[24rem] -translate-x-1/2 rounded-full bg-indigo-300/20 blur-[120px]" />



                <div

                    className="absolute inset-0 opacity-[0.03]"

                    style={{

                        backgroundImage:

                            "linear-gradient(#000 1px, transparent 1px),linear-gradient(90deg,#000 1px,transparent 1px)",

                        backgroundSize: "60px 60px",

                    }}

                />



            </div>



            {/* =================================================

                CITY SELECTOR

            \================================================= */}



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

                            className="cursor-pointer bg-transparent text-sm font-black text-indigo-600 focus:outline-none"

                        >

                            {cities.map((cityName) => (

                                <option

                                    key={cityName}

                                    value={cityName}

                                >

                                    {CITY_PRICING[cityName].name}

                                </option>

                            ))}

                        </select>



                    </div>



                </div>



            </section>



            {/* =================================================

                HERO

            \================================================= */}



            <section className="relative max-w-7xl mx-auto px-6 pt-16 pb-24">



                <div className="grid items-start gap-10 lg:grid-cols-2 lg:gap-12">



                    {/* =================================================

                        LEFT

                    \================================================= */}



                    <div>



                        <div className="inline-flex items-center gap-3 rounded-full border border-indigo-100 bg-white/80 backdrop-blur-xl px-5 py-2 shadow-lg">



                            <span className="relative flex h-3 w-3">



                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-indigo-400 opacity-75" />



                                <span className="relative inline-flex h-3 w-3 rounded-full bg-indigo-500" />



                            </span>



                            <span className="text-xs font-black uppercase tracking-[0.25em] text-indigo-600">

                                {selectedCity} • Used Car Inspection

                            </span>



                        </div>



                        <h1 className="mt-6 text-5xl md:text-6xl xl:text-7xl font-black leading-[0.96] tracking-tight">



                            Don't Buy



                            <br />



                            <span className="bg-gradient-to-r from-indigo-800 via-indigo-600 to-indigo-500 bg-clip-text text-transparent">

                                Someone Else's

                            </span>



                            <br />



                            Problems.



                        </h1>



                        <p className="mt-6 max-w-xl text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">



                            Our independent Pre-Purchase Inspection uncovers

                            hidden accident repairs, flood damage, engine

                            issues, odometer tampering and expensive

                            mechanical faults before you pay in{" "}

                            {selectedCity}.



                        </p>



                        {/* PRICE SUMMARY */}



                        <div className="mt-8 inline-flex flex-wrap items-center gap-4 rounded-2xl border border-indigo-100 bg-white/90 px-5 py-4 shadow-lg">



                            <div>



                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">

                                    Used Car Inspection

                                </p>



                                <p className="mt-1 text-3xl font-black text-slate-900">

                                    ₹

                                    {formatPrice(

                                        cityPricing.usedCar

                                    )}

                                </p>



                            </div>



                            <div className="h-10 w-px bg-slate-200" />



                            <div>



                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">

                                    Location

                                </p>



                                <p className="mt-1 font-black text-indigo-600">

                                    {selectedCity}

                                </p>



                            </div>



                        </div>



                        <div className="mt-7 flex flex-col gap-4 sm:flex-row sm:flex-wrap">



                            <button

                                onClick={() =>

                                    openUsedCarBooking(

                                        "Standard"

                                    )

                                }

                                className="group rounded-2xl bg-gradient-to-r from-indigo-800 via-indigo-600 to-indigo-500 px-8 py-5 font-bold text-white shadow-2xl shadow-indigo-300/40 transition-all duration-300 hover:-translate-y-1 hover:scale-[1.03]"

                            >

                                Book Inspection in{" "}

                                {selectedCity}



                                <span className="ml-2 inline-block transition group-hover:translate-x-1">

                                    →

                                </span>



                            </button>



                            <a

                                href="tel:+919975934213"

                                className="rounded-2xl border border-slate-200 bg-white px-8 py-5 font-bold text-slate-800 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-indigo-300 hover:shadow-xl"

                            >

                                📞 Talk to Inspector

                            </a>



                        </div>





                    </div>



                    {/* =================================================

                        RIGHT

                    \================================================= */}




<div className="flex w-full flex-col gap-4 self-start">
    <div className="relative w-full overflow-hidden rounded-[2rem] bg-[#06152f] shadow-[0_30px_80px_rgba(0,0,0,0.15)] lg:rounded-[2.3rem]">
        <Image
            src="/used-car-ppi.png"
            alt={`Complete used-car pre-purchase inspection in ${selectedCity}`}
            width={1536}
            height={1024}
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="block h-auto w-full object-contain"
        />

        {/* Animated blue vertical scanning line */}
        <div
            aria-hidden="true"
            className="ppi-scan-vertical pointer-events-none absolute top-[38%] bottom-[20%] z-10 w-[3px]"
        >
            <div className="absolute inset-0 bg-cyan-300 shadow-[0_0_8px_3px_rgba(34,211,238,0.95)]" />
            <div className="absolute -inset-x-2 inset-y-0 bg-cyan-400/30 blur-md" />
        </div>

        <style jsx>{`
            .ppi-scan-vertical {
                left: 13%;
                animation: ppi-scan-v 2.2s ease-in-out infinite alternate;
            }

            @keyframes ppi-scan-v {
                from {
                    left: 16%;
                    opacity: 0.95;
                }
                to {
                    left: 82%;
                    opacity: 0.95;
                }
            }

            @media (prefers-reduced-motion: reduce) {
                .ppi-scan-vertical {
                    animation: none;
                    left: 50%;
                    opacity: 0.55;
                }
            }
        `}</style>
    </div>

    {/* QUICK STATS */}



                        <div className="mt-0 grid grid-cols-2 sm:grid-cols-4 gap-3">



                            {[

                                ["400", "Checks"],

                                ["5000+", "Inspected Cars"],

                                ["4.9★", "Rating"],

                                ["100%", "Independent"],

                            ].map(([value, label]) => (



                                <div

                                    key={label}

                                    className="min-w-0 rounded-2xl border border-white bg-white p-3 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl sm:p-4"

                                >



                                    <div className="text-2xl font-black text-indigo-600 sm:text-3xl">

                                        {value}

                                    </div>



                                    <div className="mt-1 text-[10px] uppercase tracking-[0.12em] text-slate-500 sm:text-xs sm:tracking-[0.18em]">

                                        {label}

                                    </div>



                                </div>



                            ))}



                        </div>


</div>

                </div>



            </section>



            {/* =================================================

                TRUST STATS

            \================================================= */}



            <section className="px-6 pb-24">



                <div className="max-w-7xl mx-auto">



                    <div className="rounded-[3rem] border border-white bg-white/80 backdrop-blur-xl p-10 shadow-2xl">



                        <div className="grid gap-8 md:grid-cols-4">



                            {[

                                {

                                    icon: "🛡️",

                                    value: "Independent",

                                    label: "We work only for buyers.",

                                },

                                {

                                    icon: "📍",

                                    value: "On-site",

                                    label: "No need to move the vehicle.",

                                },

                                {

                                    icon: "⚡",

                                    value: "Same Day",

                                    label: "Receive a detailed report.",

                                },

                                {

                                    icon: "👨‍🔧",

                                    value: "Experts",

                                    label: "Experienced PDI specialists.",

                                },

                            ].map((item) => (



                                <div

                                    key={item.label}

                                    className="group rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-indigo-300 hover:shadow-2xl"

                                >



                                    <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-800 via-indigo-600 to-indigo-500 text-3xl shadow-lg transition-all duration-300 group-hover:scale-110">

                                        {item.icon}

                                    </div>



                                    <div className="text-4xl font-black text-slate-900">

                                        {item.value}

                                    </div>



                                    <p className="mt-2 text-xs font-bold uppercase tracking-[0.25em] text-slate-500">

                                        {item.label}

                                    </p>



                                </div>



                            ))}



                        </div>



                    </div>



                </div>



            </section>


            {/* =================================================

                FINAL CTA

            \================================================= */}



            <section className="px-6 pb-32">



                <div className="mx-auto max-w-7xl overflow-hidden rounded-[2rem] lg:rounded-[3rem] bg-gradient-to-br from-indigo-800 via-indigo-600 to-indigo-800 shadow-[0_40px_120px_rgba(79,70,229,0.30)]">



                    <div className="grid lg:grid-cols-2 items-center">



                        {/* =================================================

                            LEFT

                        \================================================= */}



                        <div className="min-w-0 p-5 sm:p-8 lg:p-16 text-white">



                            <span className="inline-flex rounded-full bg-white/15 px-5 py-2 text-xs font-black uppercase tracking-[0.3em] backdrop-blur-xl">

                                Ready to Buy in {selectedCity}?

                            </span>



                            <h2 className="mt-8 text-5xl lg:text-6xl font-black leading-tight">



                                Spend ₹

                                {formatPrice(

                                    cityPricing.usedCar

                                )}



                                <br />



                                Today.



                                <br />



                                Save Lakhs Later.



                            </h2>



                            <p className="mt-8 max-w-xl text-lg leading-8 text-white/85">

                                Hidden accident repairs, engine issues,

                                odometer fraud and flood damage can cost you

                                thousands after purchase in {selectedCity}.

                                Inspect first, buy with confidence.

                            </p>



                            <div className="mt-10 flex flex-col gap-3">



                                {[

                                    "400 Inspection Points",

                                    "Accident Detection",

                                    "Engine & Gearbox Check",

                                    "OBD Diagnostics",

                                    "Negotiation Report",

                                    "Independent Experts",

                                ].map((item) => (



                                    <div

                                        key={item}

                                        className="flex items-center gap-3 text-white/90 font-semibold"

                                    >



                                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20 text-xs text-white">

                                            ✓

                                        </div>



                                        <span>

                                            {item}

                                        </span>



                                    </div>



                                ))}



                            </div>



                            <div className="mt-12 flex flex-wrap gap-5">



                                <button

                                    onClick={() =>

                                        openUsedCarBooking(

                                            "Standard"

                                        )

                                    }

                                    className="rounded-2xl bg-white px-10 py-5 font-black text-slate-900 shadow-2xl transition hover:bg-slate-100 hover:scale-105"

                                >

                                    Book Inspection in{" "}

                                    {selectedCity}

                                </button>



                                <a

                                    href="tel:+919975934213"

                                    className="rounded-2xl border border-white/30 bg-white/10 px-10 py-5 font-black text-white backdrop-blur-xl transition hover:bg-white/20"

                                >

                                    📞 Call Expert

                                </a>



                            </div>



                        </div>



                        {/* =================================================

                            RIGHT

                        \================================================= */}



                        <div className="relative p-6 lg:p-16 flex items-center justify-center">



                            <div className="relative w-full max-w-md rounded-[2.5rem] border border-white/20 bg-white/10 p-8 backdrop-blur-2xl shadow-2xl">



                                <div className="text-4xl">

                                    🚙

                                </div>



                                <h3 className="mt-6 text-3xl font-black text-white">

                                    Used Car Inspection in{" "}

                                    {selectedCity}

                                </h3>



                                <p className="mt-4 text-white/80 leading-relaxed">

                                    Get professional on-site inspection

                                    for any used car across{" "}

                                    {selectedCity} and surrounding areas.

                                </p>



                                <div className="mt-8 pt-6 border-t border-white/15 flex items-center justify-between">



                                    <span className="text-xs uppercase tracking-widest text-white/70 font-bold">

                                        Starts from

                                    </span>



                                    <span className="text-2xl font-black text-white">

                                        ₹

                                        {formatPrice(

                                            cityPricing.usedCar

                                        )}

                                    </span>



                                </div>



                            </div>



                        </div>



                    </div>



                </div>



            </section>




            
        </main>

    );

}