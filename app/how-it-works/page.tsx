
"use client";

import { useBooking } from "@/app/context/BookingContext";

export default function HowItWorks() {
    const { openBookingChooser } = useBooking();

    const steps = [
        {
            icon: "📅",
            title: "Book Your Inspection",
            desc: "Choose whether you're buying a new or used car, select your preferred date and time, and share the inspection location.",
        },
        {
            icon: "👨‍🔧",
            title: "Expert Inspector Assigned",
            desc: "A trained automotive inspector is assigned to your booking and coordinates directly with you before the inspection.",
        },
        {
            icon: "🔍",
            title: "299+ Point Inspection",
            desc: "We inspect the vehicle's paint, body panels, engine, electronics, suspension, tyres, interior, documentation, OBD diagnostics and much more.",
        },
        {
            icon: "📄",
            title: "Detailed Digital Report",
            desc: "Receive a comprehensive inspection report with photographs, findings and recommendations before you buy or accept delivery.",
        },
    ];

    return (
        <main className="bg-main min-h-screen">

            {/* HERO */}
            <section className="px-6 pt-32 pb-20">

                <div className="max-w-6xl mx-auto text-center">

                    <p className="text-indigo-600 font-black uppercase tracking-[0.35em] text-xs mb-4">
                        HOW IT WORKS
                    </p>

                    <h1 className="heading text-5xl md:text-7xl mb-6">
                        Simple.
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-pink-500">
                            {" "}Professional.
                        </span>
                        <br />
                        Reliable.
                    </h1>

                    <p className="subtext text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
                        Whether you're buying a <b>new car</b> or a <b>used car</b>,
                        our independent experts make sure you don't miss hidden
                        defects before making one of your biggest investments.
                    </p>

                </div>

            </section>

            {/* STEPS */}
            <section className="px-6 pb-24">

                <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-8">

                    {steps.map((step, index) => (

                        <div
                            key={index}
                            className="card-glass rounded-3xl border border-slate-100 p-8 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300"
                        >

                            <div className="flex items-start justify-between">

                                <div className="w-16 h-16 rounded-2xl bg-indigo-100 flex items-center justify-center text-3xl">
                                    {step.icon}
                                </div>

                                <span className="text-6xl font-black text-slate-100">
                                    0{index + 1}
                                </span>

                            </div>

                            <h2 className="heading text-2xl mt-8 mb-4">
                                {step.title}
                            </h2>

                            <p className="subtext leading-relaxed">
                                {step.desc}
                            </p>

                        </div>

                    ))}

                </div>

            </section>

            {/* FEATURES */}
            <section className="px-6 pb-24">

                <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-6">

                    <div className="card-glass rounded-3xl p-8 text-center border border-slate-100">
                        <div className="text-4xl mb-3">✅</div>
                        <h3 className="font-black text-lg">299+ Checks</h3>
                        <p className="subtext text-sm mt-2">
                            Complete inspection covering every major system.
                        </p>
                    </div>

                    <div className="card-glass rounded-3xl p-8 text-center border border-slate-100">
                        <div className="text-4xl mb-3">📸</div>
                        <h3 className="font-black text-lg">Photo Report</h3>
                        <p className="subtext text-sm mt-2">
                            Digital report with photos and expert observations.
                        </p>
                    </div>

                    <div className="card-glass rounded-3xl p-8 text-center border border-slate-100">
                        <div className="text-4xl mb-3">🚗</div>
                        <h3 className="font-black text-lg">At Dealership</h3>
                        <p className="subtext text-sm mt-2">
                            We inspect your vehicle directly at the location.
                        </p>
                    </div>

                    <div className="card-glass rounded-3xl p-8 text-center border border-slate-100">
                        <div className="text-4xl mb-3">🛡️</div>
                        <h3 className="font-black text-lg">Independent</h3>
                        <p className="subtext text-sm mt-2">
                            Honest, unbiased inspection with no dealership ties.
                        </p>
                    </div>

                </div>

            </section>

            {/* CTA */}
            <section className="px-6 pb-28">

                <div className="max-w-5xl mx-auto card-glass rounded-[2rem] p-14 border border-indigo-100 relative overflow-hidden text-center">

                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-600 to-pink-500" />

                    <h2 className="heading text-4xl mb-6">
                        Ready to Book Your Inspection?
                    </h2>

                    <p className="subtext max-w-2xl mx-auto mb-10 text-lg">
                        Choose whether you're buying a <b>new car</b> or a
                        <b> used car</b>. We'll connect you with the right
                        inspection flow and assign an expert inspector.
                    </p>

                    <button
                        onClick={openBookingChooser}
                        className="btn-primary px-12 py-5 text-lg shadow-xl"
                    >
                        Book Inspection
                    </button>

                </div>

            </section>

        </main>
    );
}

