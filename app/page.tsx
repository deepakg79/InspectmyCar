"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useBooking } from "@/app/context/BookingContext";

export default function Home() {
    const { openBookingChooser } = useBooking();

    useEffect(() => {
        const shown = sessionStorage.getItem("homeModalShown");

        if (!shown) {
            openBookingChooser();
            sessionStorage.setItem("homeModalShown", "true");
        }
    }, [openBookingChooser]);

    return (
        <main className="relative overflow-hidden bg-main text-slate-900 min-h-screen">

            {/* Animated Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">

                <div className="absolute -top-40 -left-32 h-[30rem] w-[30rem] rounded-full bg-indigo-300/20 blur-3xl animate-pulse" />

                <div className="absolute top-96 -right-40 h-[34rem] w-[34rem] rounded-full bg-pink-300/20 blur-3xl animate-pulse [animation-delay:1200ms]" />

                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[26rem] w-[26rem] rounded-full bg-violet-300/20 blur-3xl animate-pulse [animation-delay:2200ms]" />

            </div>

            {/* HERO */}

            <section className="relative pt-36 pb-24 px-6">

                <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">

                    {/* LEFT */}

                    <div className="slide-up">

                        <div className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/70 backdrop-blur-xl px-5 py-3 shadow-xl text-xs font-black uppercase tracking-[0.2em] text-indigo-600">
                            🚗 Independent Vehicle Inspection Experts in Pune
                        </div>

                        <h1 className="heading text-5xl md:text-7xl leading-[0.95] mt-8">

                            Buy Your Next

                            <br />

                            <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-pink-500 bg-clip-text text-transparent">
                                Car With Confidence
                            </span>

                        </h1>

                        <p className="subtext text-lg max-w-xl mt-8 leading-relaxed">

                            Independent{" "}
                            <b>Pre-Delivery Inspection (PDI)</b> for
                            brand-new cars and{" "}
                            <b>Pre-Purchase Inspection (PPI)</b> for
                            used cars.

                            <br /><br />

                            Protect yourself from hidden accident
                            repairs, repaint work, transport damage,
                            electrical faults and costly surprises
                            before making your purchase.

                        </p>

                        <div className="flex flex-wrap gap-4 mt-10">

                            <button
                                onClick={openBookingChooser}
                                className="btn-primary px-10 py-5 text-lg shadow-xl hover:-translate-y-1 transition-all"
                            >
                                Book Inspection
                            </button>

                            <a
                                href="https://wa.me/919975934213"
                                className="card-glass px-10 py-5 font-bold border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all"
                            >
                                💬 WhatsApp
                            </a>

                        </div>

                        {/* TRUST */}

                        <div className="flex flex-wrap gap-8 mt-12">

                            {[
                                ["3500+", "Cars Inspected"],
                                ["299+", "Checkpoints"],
                                ["4.9★", "Rating"],
                            ].map(([v, l]) => (

                                <div key={l}>

                                    <p className="text-3xl font-black text-indigo-600">
                                        {v}
                                    </p>

                                    <p className="text-xs uppercase tracking-widest text-slate-500 font-bold">
                                        {l}
                                    </p>

                                </div>

                            ))}

                        </div>

                    </div>

                    {/* RIGHT */}

                    <div
                        className="relative slide-up"
                        style={{ animationDelay: ".2s" }}
                    >

                        <div className="relative rounded-[3rem] overflow-hidden border-8 border-white shadow-2xl">

                            <img
                                src="/hero-car.jpg"
                                alt="Professional Car Inspection"
                                className="w-full h-[560px] object-cover hover:scale-105 transition duration-700"
                            />

                            <div className="absolute bottom-6 left-6 card-glass rounded-3xl p-6 shadow-xl">

                                <p className="text-3xl font-black text-indigo-600">
                                    ✔ 299+
                                </p>

                                <p className="text-xs uppercase tracking-widest font-bold text-slate-500">
                                    Inspection Points
                                </p>

                            </div>

                            <div className="absolute top-6 right-6 rounded-2xl bg-white/90 backdrop-blur-xl px-5 py-4 shadow-xl">

                                <p className="font-black text-emerald-600">
                                    Same Day
                                </p>

                                <p className="text-xs uppercase tracking-widest text-slate-500">
                                    Digital Report
                                </p>

                            </div>

                        </div>

                    </div>

                </div>

            </section>
            {/* CHOOSE INSPECTION */}

            <section className="relative px-6 pb-24">

                <div className="max-w-7xl mx-auto">

                    <div className="text-center mb-14 slide-up">

                        <p className="text-xs uppercase tracking-[0.35em] font-black text-indigo-600">
                            OUR SERVICES
                        </p>

                        <h2 className="heading text-4xl md:text-5xl mt-4">
                            Choose Your Inspection
                        </h2>

                        <p className="subtext max-w-2xl mx-auto mt-5">
                            Whether you're taking delivery of a brand-new vehicle
                            or buying a pre-owned car, our independent inspectors
                            help you make the right decision.
                        </p>

                    </div>

                    <div className="grid lg:grid-cols-2 gap-8">

                        {/* NEW CAR */}

                        <Link
                            href="/new-cars"
                            className="group relative overflow-hidden rounded-[2.5rem] card-glass border border-indigo-100 p-10 hover:-translate-y-3 hover:shadow-2xl transition-all duration-500"
                        >

                            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-500 bg-gradient-to-br from-indigo-50 via-white to-white" />

                            <div className="relative">

                                <div className="flex justify-between items-start">

                                    <div>

                                        <div className="w-20 h-20 rounded-3xl bg-indigo-100 flex items-center justify-center text-5xl mb-8 group-hover:rotate-6 transition">
                                            🚗
                                        </div>

                                        <span className="inline-block rounded-full bg-indigo-100 text-indigo-700 px-4 py-2 text-xs font-black uppercase tracking-widest">
                                            New Car
                                        </span>

                                    </div>

                                    <span className="rounded-full bg-emerald-100 px-4 py-2 text-xs font-black uppercase tracking-widest text-emerald-700">
                                        From ₹1499
                                    </span>

                                </div>

                                <h3 className="heading text-4xl mt-8 mb-4">
                                    Pre-Delivery Inspection
                                </h3>

                                <p className="subtext leading-relaxed mb-8">
                                    Before accepting delivery from the showroom,
                                    let our experts inspect your vehicle for
                                    transport damage, repaint work, electronic
                                    issues and manufacturing defects.
                                </p>

                                <div className="grid grid-cols-2 gap-4">

                                    {[
                                        "299+ Checkpoints",
                                        "Paint Thickness Test",
                                        "OBD Diagnostics",
                                        "Electrical Scan",
                                        "Battery Health",
                                        "Digital Report",
                                    ].map((item) => (

                                        <div
                                            key={item}
                                            className="flex items-center gap-3"
                                        >

                                            <div className="w-7 h-7 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-black text-sm">
                                                ✓
                                            </div>

                                            <span className="font-semibold text-sm">
                                                {item}
                                            </span>

                                        </div>

                                    ))}

                                </div>

                                <div className="mt-10 flex items-center justify-between">

                                    <span className="font-black text-indigo-600 group-hover:translate-x-2 transition">
                                        Explore Service →
                                    </span>

                                    <div className="rounded-2xl bg-indigo-600 text-white px-5 py-3 font-black shadow-lg">
                                        NEW CARS
                                    </div>

                                </div>

                            </div>

                        </Link>

                        {/* USED CAR */}

                        <Link
                            href="/used-cars"
                            className="group relative overflow-hidden rounded-[2.5rem] bg-slate-900 text-white p-10 hover:-translate-y-3 hover:shadow-2xl transition-all duration-500"
                        >

                            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-500 bg-gradient-to-br from-slate-800 via-slate-900 to-black" />

                            <div className="relative">

                                <div className="flex justify-between items-start">

                                    <div>

                                        <div className="w-20 h-20 rounded-3xl bg-white/10 flex items-center justify-center text-5xl mb-8 group-hover:-rotate-6 transition">
                                            🚙
                                        </div>

                                        <span className="inline-block rounded-full bg-orange-500/20 text-orange-300 px-4 py-2 text-xs font-black uppercase tracking-widest">
                                            Used Car
                                        </span>

                                    </div>

                                    <span className="rounded-full bg-emerald-500/20 px-4 py-2 text-xs font-black uppercase tracking-widest text-emerald-300">
                                        From ₹1999
                                    </span>

                                </div>

                                <h3 className="heading text-4xl mt-8 mb-4 text-white">
                                    Pre-Purchase Inspection
                                </h3>

                                <p className="leading-relaxed text-slate-300 mb-8">
                                    Avoid buying a problematic vehicle. We inspect
                                    accident history, engine condition, suspension,
                                    electronics and hidden defects before you pay.
                                </p>

                                <div className="grid grid-cols-2 gap-4">

                                    {[
                                        "Engine Health",
                                        "Accident Detection",
                                        "Flood Damage",
                                        "OBD Scan",
                                        "Suspension Check",
                                        "Road Test",
                                    ].map((item) => (

                                        <div
                                            key={item}
                                            className="flex items-center gap-3"
                                        >

                                            <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-indigo-300 font-black text-sm">
                                                ✓
                                            </div>

                                            <span className="font-semibold text-sm text-slate-200">
                                                {item}
                                            </span>

                                        </div>

                                    ))}

                                </div>

                                <div className="mt-10 flex items-center justify-between">

                                    <span className="font-black text-indigo-300 group-hover:translate-x-2 transition">
                                        Explore Service →
                                    </span>

                                    <div className="rounded-2xl bg-white text-slate-900 px-5 py-3 font-black shadow-lg">
                                        USED CARS
                                    </div>

                                </div>

                            </div>

                        </Link>

                    </div>

                </div>

            </section>
            {/* WHY CHOOSE */}

            <section className="px-6 py-24 relative">

                <div className="max-w-7xl mx-auto">

                    <div className="text-center mb-16 slide-up">

                        <p className="text-xs font-black tracking-[0.35em] uppercase text-indigo-600">
                            WHY INSPECTMYCAR
                        </p>

                        <h2 className="heading text-4xl md:text-5xl mt-4">
                            The Smart Way To Buy A Car
                        </h2>

                        <p className="subtext max-w-2xl mx-auto mt-5">
                            We represent only one person during the inspection —
                            <b> you.</b> Every report is unbiased, transparent and
                            designed to help you make a confident purchase.
                        </p>

                    </div>

                    <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-8">

                        {[
                            {
                                icon: "🛡️",
                                title: "Independent Experts",
                                desc: "We don't work for dealerships or sellers. Every inspection is completely unbiased.",
                            },
                            {
                                icon: "🔍",
                                title: "299+ Checkpoints",
                                desc: "From paint quality to engine diagnostics, we inspect every critical system.",
                            },
                            {
                                icon: "📄",
                                title: "Instant Report",
                                desc: "Receive a detailed digital report with photographs and recommendations.",
                            },
                            {
                                icon: "⚡",
                                title: "Same Day Service",
                                desc: "Fast scheduling and inspections across Pune & PCMC.",
                            },
                        ].map((item, i) => (

                            <div
                                key={item.title}
                                className="group card-glass rounded-[2rem] border border-slate-100 p-8 hover:-translate-y-3 hover:shadow-2xl transition-all duration-500"
                                style={{
                                    animationDelay: `${i * 0.1}s`,
                                }}
                            >

                                <div className="w-16 h-16 rounded-3xl bg-indigo-100 flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition">
                                    {item.icon}
                                </div>

                                <h3 className="font-black text-xl mb-4">
                                    {item.title}
                                </h3>

                                <p className="subtext leading-relaxed">
                                    {item.desc}
                                </p>

                            </div>

                        ))}

                    </div>

                </div>

            </section>

            {/* HOW IT WORKS */}

            <section className="px-6 pb-24">

                <div className="max-w-6xl mx-auto">

                    <div className="text-center mb-16">

                        <p className="text-xs uppercase tracking-[0.35em] font-black text-indigo-600">
                            SIMPLE PROCESS
                        </p>

                        <h2 className="heading text-4xl md:text-5xl mt-4">
                            How It Works
                        </h2>

                    </div>

                    <div className="space-y-10">

                        {[
                            {
                                no: "01",
                                title: "Choose Inspection",
                                desc: "Select New Car PDI or Used Car Inspection based on your purchase.",
                            },
                            {
                                no: "02",
                                title: "Book Your Slot",
                                desc: "Choose your preferred inspection date, time and dealership or seller location.",
                            },
                            {
                                no: "03",
                                title: "Expert Inspection",
                                desc: "Our certified inspector performs a comprehensive 299+ point inspection.",
                            },
                            {
                                no: "04",
                                title: "Receive Report",
                                desc: "Get a detailed digital report with findings, photos and expert recommendations.",
                            },
                        ].map((step, index) => (

                            <div
                                key={step.no}
                                className="flex gap-8 items-start group"
                            >

                                <div className="relative">

                                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-600 to-violet-600 text-white flex items-center justify-center text-2xl font-black shadow-xl group-hover:scale-110 transition">

                                        {step.no}

                                    </div>

                                    {index !== 3 && (

                                        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-1 h-20 bg-gradient-to-b from-indigo-300 to-transparent" />

                                    )}

                                </div>

                                <div className="pt-3">

                                    <h3 className="text-2xl font-black mb-3">

                                        {step.title}

                                    </h3>

                                    <p className="subtext leading-relaxed max-w-xl">

                                        {step.desc}

                                    </p>

                                </div>

                            </div>

                        ))}

                    </div>

                </div>

            </section>
            {/* TESTIMONIALS */}

            <section className="px-6 py-24 bg-gradient-to-b from-transparent to-slate-50">

                <div className="max-w-7xl mx-auto">

                    <div className="text-center mb-16">

                        <p className="text-xs uppercase tracking-[0.35em] font-black text-indigo-600">
                            CUSTOMER STORIES
                        </p>

                        <h2 className="heading text-4xl md:text-5xl mt-4">
                            Trusted By Car Buyers Across Pune
                        </h2>

                        <p className="subtext mt-5 max-w-2xl mx-auto">
                            Thousands of buyers have avoided expensive mistakes
                            with InspectMyCar.
                        </p>

                    </div>

                    <div className="grid lg:grid-cols-3 gap-8">

                        {[
                            {
                                name: "Rahul P.",
                                title: "New Car Buyer",
                                review:
                                    "The inspection found transport scratches on my new SUV. The dealership polished and replaced two panels before delivery. Totally worth it.",
                            },
                            {
                                name: "Neha S.",
                                title: "Used Car Buyer",
                                review:
                                    "Saved me from buying an accidental vehicle. The seller never disclosed previous repairs. Best ₹1999 I've spent.",
                            },
                            {
                                name: "Amit K.",
                                title: "Honda City Owner",
                                review:
                                    "Professional inspector, detailed report and explained everything patiently. Booking process was very smooth.",
                            },
                        ].map((item) => (

                            <div
                                key={item.name}
                                className="card-glass rounded-[2rem] p-8 border border-slate-100 hover:-translate-y-2 hover:shadow-2xl transition-all duration-500"
                            >

                                <div className="flex mb-5 text-amber-400 text-xl">
                                    ★★★★★
                                </div>

                                <p className="subtext leading-relaxed italic">

                                    "{item.review}"

                                </p>

                                <div className="mt-8">

                                    <p className="font-black text-lg">

                                        {item.name}

                                    </p>

                                    <p className="text-sm text-slate-500">

                                        {item.title}

                                    </p>

                                </div>

                            </div>

                        ))}

                    </div>

                </div>

            </section>

            {/* STATS */}

            <section className="px-6 pb-24">

                <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-6">

                    {[
                        ["3500+", "Cars Inspected"],
                        ["299+", "Inspection Points"],
                        ["4.9★", "Average Rating"],
                        ["100%", "Independent"],
                    ].map(([value, label]) => (

                        <div
                            key={label}
                            className="card-glass rounded-[2rem] p-10 text-center border border-slate-100 hover:-translate-y-2 hover:shadow-xl transition-all duration-500"
                        >

                            <div className="text-5xl font-black bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">

                                {value}

                            </div>

                            <p className="mt-3 uppercase tracking-widest text-xs font-black text-slate-500">

                                {label}

                            </p>

                        </div>

                    ))}

                </div>

            </section>

            {/* FINAL CTA */}

            <section className="px-6 pb-32">

                <div className="relative overflow-hidden rounded-[3rem] max-w-6xl mx-auto">

                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600" />

                    <div className="absolute -top-32 -left-24 w-80 h-80 rounded-full bg-white/10 blur-3xl" />

                    <div className="absolute -bottom-32 -right-24 w-96 h-96 rounded-full bg-pink-300/20 blur-3xl" />

                    <div className="relative px-10 py-20 text-center text-white">

                        <p className="text-xs uppercase tracking-[0.35em] font-black opacity-80">

                            READY TO BUY?

                        </p>

                        <h2 className="heading text-4xl md:text-6xl text-white mt-5">

                            Inspect Before
                            <br />
                            You Invest

                        </h2>

                        <p className="max-w-2xl mx-auto mt-8 text-white/80 text-lg leading-relaxed">

                            Whether it's a brand-new vehicle or a used car,
                            our certified inspectors help you make the right
                            buying decision with a comprehensive inspection
                            and digital report.

                        </p>

                        <div className="flex flex-wrap justify-center gap-5 mt-12">

                            <button
                                onClick={openBookingChooser}
                                className="rounded-2xl bg-white text-indigo-700 px-10 py-5 font-black shadow-2xl hover:scale-105 transition-all"
                            >
                                Book Inspection
                            </button>

                            <a
                                href="https://wa.me/919975934213"
                                className="rounded-2xl border border-white/30 bg-white/10 backdrop-blur-xl px-10 py-5 font-black hover:bg-white/20 transition-all"
                            >
                                💬 WhatsApp Expert
                            </a>

                        </div>

                    </div>

                </div>

            </section>

        </main>
    );
}