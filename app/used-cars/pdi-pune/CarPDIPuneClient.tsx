"use client";

import Link from "next/link";
import { useBooking } from "@/app/context/BookingContext";
export default function CarPDIUsedClient() {
    const { openUsedCarBooking } = useBooking();
    return (
        <main className="bg-main text-slate-900 min-h-screen selection:bg-pink-100 selection:text-pink-700">

            {/* HERO */}
            <section className="relative pt-40 pb-20 px-6 max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">

                <div className="text-center lg:text-left slide-up">

                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full card-glass text-pink-600 text-xs font-black uppercase tracking-widest mb-8 floating border-pink-100">
                        🚙 Used Car Inspection Experts in Pune
                    </div>

                    <h1 className="heading text-5xl md:text-7xl leading-[0.95] mb-8">
                        Don’t Buy a Used Car <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-indigo-600">
                            Without Inspection.
                        </span>
                    </h1>

                    <p className="subtext text-lg max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium mb-10">
                        Hidden accident repairs, engine issues, flood damage, and tampered odometers
                        are common in used cars. We help you avoid costly mistakes before you pay.
                        <br /><br />
                        Learn what to check with our{" "}
                        <Link href="/used-cars/buying-guide" className="text-pink-600 underline font-semibold">
                            used car buying guide
                        </Link>.
                    </p>

                    {/* ✅ FIXED BUTTON */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">

                        <button
                            onClick={() => openUsedCarBooking("Standard")}
                            className="btn-primary px-10 py-5 text-xl inline-flex items-center justify-center"
                        >
                            Book Inspection
                        </button>

                        <a
                            href="https://wa.me/919975934213"
                            className="card-glass px-10 py-5 font-bold text-lg hover:bg-white transition-all flex items-center justify-center gap-2"
                        >
                            💬 WhatsApp Expert
                        </a>

                    </div>

                </div>

                {/* HERO IMAGE */}
                <div className="relative slide-up" style={{ animationDelay: "0.2s" }}>

                    <div className="relative rounded-[3rem] overflow-hidden border-8 border-white shadow-2xl group">

                        <img
                            src="/used-car.jpg"
                            alt="Used car inspection Pune"
                            className="w-full h-[500px] object-cover transition duration-500 group-hover:scale-110"
                        />

                        <div className="absolute -bottom-6 -right-6 card-glass p-6 shadow-xl floating border-white">

                            <p className="text-pink-600 font-black text-2xl">✔ 299+</p>

                            <p className="text-[10px] font-bold uppercase tracking-widest subtext">
                                Checks for Used Cars
                            </p>

                        </div>

                    </div>

                </div>

            </section>

            {/* TRUST STATS */}
            <section className="py-16 px-6">

                <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-3 gap-6">

                    {[
                        { title: "1500+", desc: "Used Cars Inspected" },
                        { title: "Same Day", desc: "Report Delivery" },
                        { title: "4.9⭐", desc: "Customer Rating" },
                    ].map((item, i) => (
                        <div key={i} className="card-glass p-8 text-center card-hover slide-up">
                            <p className="text-3xl font-black text-pink-500">
                                {item.title}
                            </p>
                            <p className="subtext text-[10px] font-bold uppercase tracking-widest mt-2">
                                {item.desc}
                            </p>
                        </div>
                    ))}

                </div>

            </section>

            {/* PROBLEMS */}
            <section className="max-w-6xl mx-auto px-6 py-20">

                <h2 className="heading text-4xl text-center mb-16 slide-up">
                    Risks in Buying a Used Car
                </h2>

                <div className="grid md:grid-cols-3 gap-8">

                    {[
                        {
                            title: "Accident Repairs",
                            desc: "Cars may look fine but often have structural repairs hidden under repaint work.",
                        },
                        {
                            title: "Engine & Gearbox Wear",
                            desc: "Internal wear is not visible unless professionally tested with diagnostics.",
                        },
                        {
                            title: "Flood or Fire Damage",
                            desc: "Severely damaged vehicles are often cleaned and resold without disclosure.",
                        },
                    ].map((item, i) => (
                        <div key={i} className="card-glass p-8 card-hover slide-up">

                            <div className="w-12 h-12 bg-pink-50 rounded-xl flex items-center justify-center text-xl mb-6">
                                ⚠️
                            </div>

                            <h3 className="font-bold text-xl mb-3">{item.title}</h3>
                            <p className="subtext text-sm leading-relaxed">{item.desc}</p>

                        </div>
                    ))}

                </div>

            </section>

            {/* HOW INSPECTION WORKS */}
            <section className="max-w-6xl mx-auto px-6 py-20">

                <h2 className="heading text-4xl text-center mb-16">
                    What We Check
                </h2>

                <div className="grid md:grid-cols-3 gap-8">

                    {[
                        "Engine & Transmission Health",
                        "Accident & Repaint Detection",
                        "OBD Error Scan",
                        "Suspension & Steering",
                        "Tyres & Brake Condition",
                        "Flood Damage Signs",
                    ].map((item, i) => (
                        <div key={i} className="card-glass p-6 card-hover text-center">
                            <p className="font-bold">{item}</p>
                        </div>
                    ))}

                </div>

            </section>

            {/* FINAL CTA */}
            <section className="px-6 py-24 text-center">

                <div className="max-w-4xl mx-auto card-glass p-16">

                    <h2 className="heading text-4xl mb-6">
                        Avoid Expensive Mistakes
                    </h2>

                    <p className="subtext mb-10 max-w-lg mx-auto">
                        A used car may look perfect—but hidden issues can cost you lakhs later.
                        Get it checked before you buy.
                    </p>

                    <div className="flex flex-col sm:flex-row justify-center gap-4">

                        <button
                            onClick={() => window.dispatchEvent(new Event("open-booking-chat"))}
                            className="btn-primary px-10 py-5 text-xl inline-flex items-center justify-center"
                        >
                            Book Inspection
                        </button>

                        <a
                            href="tel:+919975934213"
                            className="card-glass px-12 py-4 font-bold"
                        >
                            📞 Call Expert
                        </a>

                    </div>

                </div>

            </section>

            {/* MOBILE CTA */}
            <div className="fixed bottom-0 left-0 right-0 md:hidden z-50 p-4 flex gap-3 bg-white/80 backdrop-blur-xl border-t border-white/50">

                <button
                    onClick={() => window.dispatchEvent(new Event("open-booking-chat"))}
                    className="btn-primary px-10 py-5 text-xl inline-flex items-center justify-center"
                >
                    Book Inspection
                </button>
            </div>

        </main>
    );
}