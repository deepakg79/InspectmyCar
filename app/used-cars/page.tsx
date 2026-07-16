"use client";

import Link from "next/link";
import { useBooking } from "@/app/context/BookingContext";

export default function UsedCarsPage() {
    const { openUsedCarBooking } = useBooking();

    return (
        <main className="relative min-h-screen overflow-hidden bg-gradient-to-b from-slate-50 via-white to-pink-50/40 text-slate-900">

            {/* BACKGROUND */}
            <div className="absolute inset-0 -z-10 overflow-hidden">

                <div className="absolute -top-40 -left-32 h-[34rem] w-[34rem] rounded-full bg-pink-400/20 blur-[120px] animate-pulse" />

                <div
                    className="absolute top-1/3 -right-32 h-[30rem] w-[30rem] rounded-full bg-indigo-400/20 blur-[120px] animate-pulse"
                    style={{ animationDelay: "2s" }}
                />

                <div className="absolute bottom-0 left-1/2 h-[24rem] w-[24rem] -translate-x-1/2 rounded-full bg-violet-300/20 blur-[120px]" />

                <div
                    className="absolute inset-0 opacity-[0.03]"
                    style={{
                        backgroundImage:
                            "linear-gradient(#000 1px, transparent 1px),linear-gradient(90deg,#000 1px,transparent 1px)",
                        backgroundSize: "60px 60px",
                    }}
                />

            </div>

            {/* HERO */}
            <section className="relative max-w-7xl mx-auto px-6 pt-36 pb-24">

                <div className="grid lg:grid-cols-2 gap-20 items-center">

                    {/* LEFT */}

                    <div>

                        <div className="inline-flex items-center gap-3 rounded-full border border-pink-100 bg-white/80 backdrop-blur-xl px-5 py-2 shadow-lg">

                            <span className="relative flex h-3 w-3">
                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-pink-400 opacity-75" />
                                <span className="relative inline-flex h-3 w-3 rounded-full bg-pink-500" />
                            </span>

                            <span className="text-xs font-black uppercase tracking-[0.25em] text-pink-600">
                                Pune • Used Car Inspection
                            </span>

                        </div>

                        <h1 className="mt-10 text-5xl md:text-7xl font-black leading-[0.92] tracking-tight">

                            Don't Buy

                            <br />

                            <span className="bg-gradient-to-r from-pink-500 via-violet-600 to-indigo-600 bg-clip-text text-transparent">
                                Someone Else's
                            </span>

                            <br />

                            Problems.

                        </h1>

                        <p className="mt-8 max-w-xl text-lg leading-8 text-slate-600">

                            Our independent Pre-Purchase Inspection uncovers
                            hidden accident repairs, flood damage, engine
                            issues, odometer tampering and expensive
                            mechanical faults before you pay.

                        </p>

                        <div className="mt-10 flex flex-col sm:flex-row gap-5">

                            <button
                                onClick={() => openUsedCarBooking("Standard")}
                                className="group rounded-2xl bg-gradient-to-r from-pink-500 via-violet-600 to-indigo-600 px-8 py-5 font-bold text-white shadow-2xl shadow-pink-300/40 transition-all duration-300 hover:-translate-y-1 hover:scale-[1.03]"
                            >
                                Book Inspection

                                <span className="ml-2 inline-block transition group-hover:translate-x-1">
                                    →
                                </span>

                            </button>

                            <a
                                href="tel:+919975934213"
                                className="rounded-2xl border border-slate-200 bg-white px-8 py-5 font-bold text-slate-800 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-pink-300 hover:shadow-xl"
                            >
                                📞 Talk to Inspector
                            </a>

                        </div>

                        {/* QUICK STATS */}

                        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-3">

                            {[
                                ["299+", "Checks"],
                                ["3500+", "Inspected Cars"],
                                ["4.9★", "Rating"],
                                ["100%", "Independent"],
                            ].map(([value, label]) => (

                                <div
                                    key={label}
                                    className="rounded-3xl border border-white bg-white p-5 shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
                                >

                                    <div className="text-3xl font-black text-pink-600">
                                        {value}
                                    </div>

                                    <div className="mt-1 text-xs uppercase tracking-[0.25em] text-slate-500">
                                        {label}
                                    </div>

                                </div>

                            ))}

                        </div>

                    </div>

                    {/* RIGHT */}

                    <div className="relative">

                        <div className="absolute -inset-8 rounded-[3rem] bg-gradient-to-r from-pink-500/20 to-indigo-500/20 blur-3xl" />

                        <div className="relative overflow-hidden rounded-[3rem] border border-white bg-white p-4 shadow-[0_30px_80px_rgba(0,0,0,0.15)]">

                            <img
                                src="/used-car1.jpg"
                                alt="Used Car Inspection"
                                className="h-[650px] w-full rounded-[2.3rem] object-cover transition duration-700 hover:scale-105"
                            />

                            <div className="absolute bottom-10 left-10 right-10 rounded-[2rem] border border-white bg-white/80 p-6 backdrop-blur-xl shadow-xl">

                                <div className="flex items-center justify-between">

                                    <div>

                                        <p className="text-xs font-black uppercase tracking-[0.25em] text-pink-600">
                                            Before You Buy
                                        </p>

                                        <h3 className="mt-2 text-2xl font-black text-slate-900">
                                            Complete Vehicle Health Report
                                        </h3>

                                        <p className="mt-2 text-sm text-slate-600">
                                            Know the true condition before making the payment.
                                        </p>

                                    </div>

                                    <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-pink-500 to-indigo-600 text-4xl text-white shadow-xl">
                                        🚙
                                    </div>

                                </div>

                            </div>

                        </div>

                    </div>

                </div>

            </section>
            {/* TRUST STATS */}
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
                                    className="group rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-pink-300 hover:shadow-2xl"
                                >

                                    <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-500 via-violet-600 to-indigo-600 text-3xl shadow-lg transition-all duration-300 group-hover:scale-110">
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

            {/* WHY CHOOSE */}
            <section className="px-6 pb-28">

                <div className="max-w-7xl mx-auto">

                    <div className="text-center">

                        <span className="inline-flex rounded-full bg-pink-100 px-5 py-2 text-xs font-black uppercase tracking-[0.3em] text-pink-600">
                            Why InspectMyCar
                        </span>

                        <h2 className="mt-8 text-5xl font-black tracking-tight text-slate-900">
                            Buy With Confidence,
                            <br />
                            Not Guesswork.
                        </h2>

                        <p className="mt-6 max-w-3xl mx-auto text-xl leading-9 text-slate-600">
                            Every used vehicle has a story. Our independent
                            inspection helps you uncover hidden repairs,
                            mechanical issues and expensive surprises before
                            making the payment.
                        </p>

                    </div>

                    <div className="mt-20 grid gap-8 lg:grid-cols-3">

                        {[
                            {
                                icon: "🚘",
                                title: "Accident Detection",
                                desc: "Identify repaired panels, structural damage, welding marks and repaint work before purchasing.",
                            },
                            {
                                icon: "⚙️",
                                title: "Engine & Gearbox",
                                desc: "Inspect engine performance, leaks, transmission health and mechanical condition.",
                            },
                            {
                                icon: "💻",
                                title: "OBD Diagnostics",
                                desc: "Professional computer diagnostics reveal hidden fault codes and electronic issues.",
                            },
                            {
                                icon: "🛞",
                                title: "Tyres & Suspension",
                                desc: "Check suspension, brakes, steering, tyres and wheel alignment for costly repairs.",
                            },
                            {
                                icon: "📋",
                                title: "Document Verification",
                                desc: "Verify VIN, engine number and inspect for signs of odometer tampering.",
                            },
                            {
                                icon: "📄",
                                title: "Detailed Report",
                                desc: "Receive a complete digital inspection report with photos and expert recommendations.",
                            },
                        ].map((card) => (

                            <div
                                key={card.title}
                                className="group rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-pink-300 hover:shadow-2xl"
                            >

                                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-500 via-violet-600 to-indigo-600 text-3xl text-white shadow-lg transition-all duration-300 group-hover:scale-110">
                                    {card.icon}
                                </div>

                                <h3 className="text-2xl font-black text-slate-900">
                                    {card.title}
                                </h3>

                                <p className="mt-5 leading-8 text-slate-600">
                                    {card.desc}
                                </p>

                            </div>

                        ))}

                    </div>

                </div>

            </section>
            {/* WHY USED CAR INSPECTION */}
            <section className="px-6 py-28 bg-slate-50">

                <div className="max-w-7xl mx-auto">

                    <div className="text-center">

                        <span className="inline-flex rounded-full bg-pink-100 px-5 py-2 text-xs font-black uppercase tracking-[0.3em] text-pink-600">
                            Before You Buy
                        </span>

                        <h2 className="mt-8 text-5xl md:text-6xl font-black tracking-tight text-slate-900">
                            One Inspection Can Save
                            <br />
                            Lakhs in Repairs
                        </h2>

                        <p className="mt-6 max-w-3xl mx-auto text-xl leading-9 text-slate-600">
                            A used car may look perfect on the outside while
                            hiding accident repairs, flood damage or major
                            mechanical issues underneath.
                        </p>

                    </div>

                    <div className="mt-20 grid gap-8 md:grid-cols-2 xl:grid-cols-3">

                        {[
                            {
                                icon: "🚗",
                                title: "Accident Repairs",
                                desc: "Detect replaced panels, welding, repaint work and structural repairs that affect safety and resale value.",
                            },
                            {
                                icon: "🌊",
                                title: "Flood Damage",
                                desc: "Identify corrosion, water intrusion and electrical damage that can cause future failures.",
                            },
                            {
                                icon: "⚙️",
                                title: "Engine Health",
                                desc: "Check leaks, unusual noises, smoke, cooling system and overall engine condition.",
                            },
                            {
                                icon: "🔋",
                                title: "Electronics",
                                desc: "Scan ECU modules, ABS, airbags and other systems for hidden fault codes.",
                            },
                            {
                                icon: "📉",
                                title: "Odometer Fraud",
                                desc: "Spot signs of tampered mileage through wear patterns and diagnostic verification.",
                            },
                            {
                                icon: "💰",
                                title: "Negotiation Power",
                                desc: "Use our inspection report to negotiate a fair purchase price with confidence.",
                            },
                        ].map((item) => (

                            <div
                                key={item.title}
                                className="group rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-pink-300 hover:shadow-2xl"
                            >

                                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-500 via-violet-600 to-indigo-600 text-3xl text-white shadow-lg transition group-hover:scale-110">
                                    {item.icon}
                                </div>

                                <h3 className="mt-8 text-2xl font-black text-slate-900">
                                    {item.title}
                                </h3>

                                <p className="mt-5 leading-8 text-slate-600">
                                    {item.desc}
                                </p>

                            </div>

                        ))}

                    </div>

                    {/* PROCESS */}

                    <div className="mt-32">

                        <div className="text-center">

                            <span className="inline-flex rounded-full bg-indigo-100 px-5 py-2 text-xs font-black uppercase tracking-[0.3em] text-indigo-600">
                                Inspection Process
                            </span>

                            <h2 className="mt-8 text-5xl font-black text-slate-900">
                                How It Works
                            </h2>

                            <p className="mt-5 text-lg text-slate-600">
                                Book in minutes. Buy with confidence.
                            </p>

                        </div>

                        <div className="relative mt-20">

                            <div className="absolute left-8 top-0 hidden h-full w-px bg-slate-300 lg:block" />

                            <div className="space-y-10">

                                {[
                                    {
                                        step: "01",
                                        title: "Book Your Inspection",
                                        desc: "Choose your preferred date, time and inspection location online.",
                                    },
                                    {
                                        step: "02",
                                        title: "Inspector Visits",
                                        desc: "Our expert reaches the seller or dealership with professional inspection equipment.",
                                    },
                                    {
                                        step: "03",
                                        title: "299+ Point Inspection",
                                        desc: "Engine, gearbox, suspension, brakes, electronics, body, paint, tyres and documentation are thoroughly checked.",
                                    },
                                    {
                                        step: "04",
                                        title: "Receive Digital Report",
                                        desc: "Review the complete vehicle condition and make an informed buying decision.",
                                    },
                                ].map((item) => (

                                    <div
                                        key={item.step}
                                        className="relative flex items-start gap-8"
                                    >

                                        <div className="z-10 flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-500 via-violet-600 to-indigo-600 text-xl font-black text-white shadow-lg">
                                            {item.step}
                                        </div>

                                        <div className="flex-1 rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">

                                            <h3 className="text-2xl font-black text-slate-900">
                                                {item.title}
                                            </h3>

                                            <p className="mt-4 leading-8 text-slate-600">
                                                {item.desc}
                                            </p>

                                        </div>

                                    </div>

                                ))}

                            </div>

                        </div>

                    </div>

                </div>

            </section>
            {/* TESTIMONIALS */}
            <section className="px-6 py-28">

                <div className="max-w-7xl mx-auto">

                    <div className="text-center">

                        <span className="inline-flex rounded-full bg-pink-100 px-5 py-2 text-xs font-black uppercase tracking-[0.3em] text-pink-600">
                            Customer Reviews
                        </span>

                        <h2 className="mt-8 text-5xl font-black tracking-tight text-slate-900">
                            Thousands of Buyers
                            <br />
                            Avoided Expensive Mistakes
                        </h2>

                        <p className="mt-6 max-w-3xl mx-auto text-xl leading-9 text-slate-600">
                            Our inspections have helped buyers uncover hidden
                            accident repairs, flood damage and mechanical issues
                            before making the payment.
                        </p>

                    </div>

                    <div className="mt-20 grid gap-8 lg:grid-cols-3">

                        {[
                            {
                                name: "Rahul P.",
                                car: "2019 Hyundai Creta",
                                text: "The report revealed accident repairs on two doors. I negotiated ₹95,000 off the asking price.",
                            },
                            {
                                name: "Sneha M.",
                                car: "Honda City",
                                text: "Engine oil leakage and suspension issues were identified. It saved me from buying a problematic car.",
                            },
                            {
                                name: "Amit S.",
                                car: "Volkswagen Polo",
                                text: "Excellent inspection with detailed photos and OBD diagnostics. Completely worth it.",
                            },
                        ].map((review) => (

                            <div
                                key={review.name}
                                className="group rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-pink-300 hover:shadow-2xl"
                            >

                                <div className="flex items-center gap-1 text-yellow-400 text-xl">
                                    ★★★★★
                                </div>

                                <p className="mt-6 text-lg italic leading-8 text-slate-600">
                                    "{review.text}"
                                </p>

                                <div className="mt-8 flex items-center gap-4 border-t border-slate-100 pt-6">

                                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-pink-500 via-violet-600 to-indigo-600 text-lg font-black text-white">
                                        {review.name.charAt(0)}
                                    </div>

                                    <div>

                                        <h4 className="font-black text-slate-900">
                                            {review.name}
                                        </h4>

                                        <p className="text-sm font-semibold text-pink-600">
                                            {review.car}
                                        </p>

                                    </div>

                                </div>

                            </div>

                        ))}

                    </div>

                </div>

            </section>

            {/* FAQ */}
            <section className="px-6 pb-28">

                <div className="max-w-6xl mx-auto rounded-[3rem] border border-slate-200 bg-white p-12 shadow-xl">

                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">

                        <div>

                            <span className="inline-flex rounded-full bg-indigo-100 px-5 py-2 text-xs font-black uppercase tracking-[0.3em] text-indigo-600">
                                Frequently Asked Questions
                            </span>

                            <h2 className="mt-6 text-5xl font-black text-slate-900">
                                Buying a Used Car?
                            </h2>

                        </div>

                        <Link
                            href="/faqs"
                            className="rounded-2xl bg-slate-900 px-8 py-4 font-bold text-white transition hover:bg-pink-600"
                        >
                            View All FAQs →
                        </Link>

                    </div>

                    <div className="mt-14 grid gap-6">

                        {[
                            {
                                q: "Can you inspect a car at the seller's location?",
                                a: "Yes. We inspect vehicles at dealerships, private sellers' locations, offices or residences across Pune.",
                            },
                            {
                                q: "How long does the inspection take?",
                                a: "A complete inspection usually takes between 60 and 90 minutes depending on the vehicle.",
                            },
                            {
                                q: "Will I receive a report immediately?",
                                a: "Yes. A detailed digital inspection report with photographs is shared after the inspection.",
                            },
                            {
                                q: "Can your report help negotiate the price?",
                                a: "Absolutely. Many buyers successfully negotiate using the defects identified in our inspection report.",
                            },
                        ].map((faq) => (

                            <div
                                key={faq.q}
                                className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-8 transition-all duration-300 hover:border-pink-300 hover:bg-white hover:shadow-lg"
                            >

                                <h3 className="text-2xl font-black text-slate-900">
                                    {faq.q}
                                </h3>

                                <p className="mt-4 leading-8 text-slate-600">
                                    {faq.a}
                                </p>

                            </div>

                        ))}

                    </div>

                </div>

            </section>
            {/* FINAL CTA */}
            <section className="px-6 pb-32">

                <div className="max-w-7xl mx-auto overflow-hidden rounded-[3rem] bg-gradient-to-br from-pink-500 via-violet-600 to-indigo-700 shadow-[0_40px_120px_rgba(219,39,119,0.35)]">

                    <div className="grid lg:grid-cols-2 items-center">

                        {/* LEFT */}

                        <div className="p-12 lg:p-16 text-white">

                            <span className="inline-flex rounded-full bg-white/15 px-5 py-2 text-xs font-black uppercase tracking-[0.3em] backdrop-blur-xl">
                                Ready to Buy?
                            </span>

                            <h2 className="mt-8 text-5xl lg:text-6xl font-black leading-tight">
                                Spend ₹1,999
                                <br />
                                Today.
                                <br />
                                Save Lakhs Later.
                            </h2>

                            <p className="mt-8 max-w-xl text-lg leading-8 text-white/85">
                                Hidden accident repairs, engine issues,
                                odometer fraud and flood damage can cost you
                                thousands after purchase. Inspect first,
                                buy with confidence.
                            </p>

                            <div className="mt-10 grid gap-4 sm:grid-cols-2">

                                {[
                                    "299+ Inspection Points",
                                    "Accident Detection",
                                    "Engine & Gearbox Check",
                                    "OBD Diagnostics",
                                    "Negotiation Report",
                                    "Independent Experts",
                                ].map((item) => (

                                    <div
                                        key={item}
                                        className="rounded-2xl border border-white/10 bg-white/10 px-5 py-4 backdrop-blur-xl"
                                    >
                                        <span className="font-semibold">
                                            ✓ {item}
                                        </span>
                                    </div>

                                ))}

                            </div>

                        </div>

                        {/* RIGHT */}

                        <div className="bg-white p-12 lg:p-16">

                            <div className="rounded-[2.5rem] border border-slate-200 bg-slate-50 p-10">

                                <p className="text-sm font-black uppercase tracking-[0.3em] text-pink-600">
                                    Inspection Starts From
                                </p>

                                <div className="mt-4 flex items-end gap-2">

                                    <span className="text-6xl font-black text-slate-900">
                                        ₹1,999
                                    </span>

                                    <span className="pb-3 text-slate-500">
                                        onwards
                                    </span>

                                </div>

                                <div className="mt-10 space-y-4">

                                    {[
                                        "Certified Inspection Engineer",
                                        "At Seller / Dealership",
                                        "Digital Inspection Report",
                                        "Price Negotiation Support",
                                    ].map((item) => (

                                        <div
                                            key={item}
                                            className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4"
                                        >

                                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 font-bold">
                                                ✓
                                            </div>

                                            <span className="font-semibold text-slate-700">
                                                {item}
                                            </span>

                                        </div>

                                    ))}

                                </div>

                                <div className="mt-10 flex flex-col gap-4">

                                    <button
                                        onClick={() => openUsedCarBooking("Standard")}
                                        className="rounded-2xl bg-gradient-to-r from-pink-500 via-violet-600 to-indigo-600 px-8 py-5 text-lg font-bold text-white shadow-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
                                    >
                                        Book Used Car Inspection →
                                    </button>

                                    <Link
                                        href="/info/pricing#used-car-pricing"
                                        className="rounded-2xl border border-slate-300 px-8 py-5 text-center font-bold text-slate-700 transition hover:bg-slate-100"
                                    >
                                        View Pricing
                                    </Link>

                                    <a
                                        href="tel:+919975934213"
                                        className="rounded-2xl border border-pink-200 bg-pink-50 px-8 py-5 text-center font-bold text-pink-700 transition hover:bg-pink-100"
                                    >
                                        📞 Talk to Inspector
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