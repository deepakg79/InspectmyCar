
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
            {/* TIMELINE */}
            {/* TIMELINE */}
            <section className="px-6 pb-24">
                <div className="max-w-7xl mx-auto">

                    <div className="text-center mb-16">
                        <p className="text-indigo-600 font-black uppercase tracking-[0.35em] text-xs mb-3">
                            OUR PROCESS
                        </p>

                        <h2 className="heading text-4xl md:text-5xl">
                            A Fast & Transparent Inspection Journey
                        </h2>

                        <p className="subtext mt-4 max-w-3xl mx-auto">
                            From your booking request to the final inspection report, our
                            streamlined process ensures you receive timely, professional,
                            and unbiased vehicle insights.
                        </p>
                    </div>

                    <div className="relative">

                        {/* Desktop Connecting Line */}
                        <div className="hidden lg:block absolute top-1/2 left-[12%] right-[12%] h-1 -translate-y-1/2 rounded-full bg-gradient-to-r from-indigo-500 via-violet-500 to-pink-500" />

                        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">

                            {[
                                {
                                    value: "10",
                                    unit: "minutes",
                                    title: "Booking Confirmation",
                                    desc: "Your enquiry is reviewed promptly, and our team confirms your inspection request within 10 minutes.",
                                },
                                {
                                    value: "10",
                                    unit: "minutes",
                                    title: "Inspector Assigned",
                                    desc: "An experienced inspector is assigned and your inspection is scheduled at your preferred location.",
                                },
                                {
                                    value: "1",
                                    unit: "hour",
                                    title: "299+ Point Inspection",
                                    desc: "A comprehensive inspection covering mechanical, electrical, structural and cosmetic checkpoints.",
                                },
                                {
                                    value: "30",
                                    unit: "minutes",
                                    title: "Digital Report",
                                    desc: "Receive a detailed digital report with photographs, findings and expert recommendations.",
                                },
                            ].map((item, index) => (
                                <div
                                    key={index}
                                    className="relative flex justify-center"
                                >

                                    {/* Mobile Connector */}
                                    {index !== 3 && (
                                        <div className="lg:hidden absolute top-full mt-3 h-10 w-1 rounded-full bg-gradient-to-b from-indigo-500 to-pink-500" />
                                    )}

                                    <div className="relative flex h-72 w-72 flex-col items-center justify-center rounded-full border border-white/60 bg-white/70 backdrop-blur-xl shadow-xl transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">

                                        <div className="flex items-end justify-center gap-1">
                                            <span className="text-5xl font-black bg-gradient-to-r from-indigo-600 to-pink-500 bg-clip-text text-transparent">
                                                {item.value}
                                            </span>

                                            <span className="mb-1 text-lg font-semibold text-indigo-600">
                                                {item.unit}
                                            </span>
                                        </div>
                                        {/* Divider */}
                                        <div className="my-5 h-1 w-14 rounded-full bg-gradient-to-r from-indigo-500 to-pink-500" />

                                        {/* Title */}
                                        <h4 className="heading text-xl text-center px-6">
                                            {item.title}
                                        </h4>

                                        {/* Description */}
                                        <p className="subtext mt-4 px-8 text-center text-sm leading-relaxed">
                                            {item.desc}
                                        </p>

                                    </div>

                                </div>
                            ))}

                        </div>

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

