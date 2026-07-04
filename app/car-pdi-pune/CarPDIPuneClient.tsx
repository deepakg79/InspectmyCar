"use client";

import Link from "next/link";
import { useBooking } from "@/app/context/BookingContext";

export default function CarPDIPuneClient() {
    const { openBookingChooser } = useBooking();

    return (
        <main className="bg-main text-slate-900 min-h-screen selection:bg-indigo-100 selection:text-indigo-700">

            {/* HERO */}
            <section className="relative pt-40 pb-20 px-6 max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">

                <div className="text-center lg:text-left slide-up">

                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full card-glass text-indigo-600 text-xs font-black uppercase tracking-widest mb-8 floating border-indigo-100">
                        🚗 Independent Vehicle Inspection in Pune
                    </div>

                    <h1 className="heading text-5xl md:text-7xl leading-[0.95] mb-8">
                        Buy Your
                        <br />

                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-pink-500">
                            Next Car
                        </span>

                        With Confidence.
                    </h1>

                    <p className="subtext text-lg max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium mb-10">
                        Whether you're taking delivery of a <b>new car</b> or
                        buying a <b>used car</b>, our independent experts
                        perform a detailed <b>299+ point inspection</b> to help
                        you avoid hidden defects, accident repairs, repaint
                        work and expensive surprises.

                        <br /><br />

                        New buyer? Read our{" "}
                        <Link
                            href="/car-delivery-checklist-pune"
                            className="text-indigo-600 underline font-semibold"
                        >
                            Car Delivery Checklist
                        </Link>{" "}
                        before visiting the dealership.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">

                        <button
                            onClick={openBookingChooser}
                            className="btn-primary px-10 py-5 text-lg shadow-xl"
                        >
                            Book Inspection
                        </button>

                        <a
                            href="https://wa.me/919975934213"
                            className="card-glass px-10 py-5 font-bold text-lg hover:bg-white transition-all flex items-center justify-center gap-2 border-slate-100"
                        >
                            💬 WhatsApp Us
                        </a>

                    </div>

                </div>

                {/* HERO IMAGE */}

                <div
                    className="relative slide-up"
                    style={{ animationDelay: "0.2s" }}
                >

                    <div className="relative rounded-[3rem] overflow-hidden border-8 border-white shadow-2xl group">

                        <img
                            src="/hero-car.jpg"
                            alt="Professional vehicle inspection in Pune"
                            className="w-full h-[500px] object-cover transition duration-500 group-hover:scale-110"
                        />

                        <div className="absolute -bottom-6 -right-6 card-glass p-6 shadow-xl floating border-white">

                            <p className="text-indigo-600 font-black text-2xl">
                                ✔ 299+
                            </p>

                            <p className="text-[10px] font-bold uppercase tracking-widest subtext">
                                Inspection Points
                            </p>

                        </div>

                    </div>

                </div>

            </section>

            {/* TRUST STATS */}

            <section className="py-16 px-6">

                <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">

                    {[
                        {
                            title: "1000+",
                            desc: "Vehicles Inspected",
                        },
                        {
                            title: "299+",
                            desc: "Inspection Points",
                        },
                        {
                            title: "Same Day",
                            desc: "Digital Report",
                        },
                        {
                            title: "4.9⭐",
                            desc: "Customer Rating",
                        },
                    ].map((item, i) => (

                        <div
                            key={i}
                            className="card-glass p-8 text-center card-hover slide-up border-slate-100"
                            style={{ animationDelay: `${i * 0.1}s` }}
                        >
                            <p className="text-3xl font-black text-indigo-600">
                                {item.title}
                            </p>

                            <p className="subtext text-[10px] font-bold uppercase tracking-widest mt-2">
                                {item.desc}
                            </p>

                        </div>

                    ))}

                </div>

            </section>

            {/* WHY INSPECTION MATTERS */}

            <section className="max-w-6xl mx-auto px-6 py-20">

                <h2 className="heading text-4xl text-center mb-16 slide-up">
                    Why Professional Vehicle Inspection Matters
                </h2>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">

                    {[
                        {
                            icon: "🚛",
                            title: "Transit Damage",
                            desc: "New vehicles can suffer scratches, dents or body damage while being transported to dealerships.",
                        },
                        {
                            icon: "🎨",
                            title: "Hidden Repainting",
                            desc: "Repaired panels and paint correction are difficult to identify without specialised inspection tools.",
                        },
                        {
                            icon: "💻",
                            title: "Electronic Faults",
                            desc: "Professional OBD diagnostics reveal hidden engine, ABS, airbag and electronic fault codes.",
                        },
                        {
                            icon: "🚘",
                            title: "Used Car Issues",
                            desc: "Hidden accident repairs, suspension wear, engine problems and odometer tampering can cost lakhs later.",
                        },
                    ].map((item, i) => (

                        <div
                            key={i}
                            className="card-glass p-8 card-hover slide-up border-slate-100"
                            style={{ animationDelay: `${i * 0.1}s` }}
                        >

                            <div className="w-14 h-14 rounded-2xl bg-indigo-100 flex items-center justify-center text-2xl mb-6">
                                {item.icon}
                            </div>

                            <h3 className="font-bold text-xl mb-3">
                                {item.title}
                            </h3>

                            <p className="subtext text-sm leading-relaxed">
                                {item.desc}
                            </p>

                        </div>

                    ))}

                </div>

            </section>

            {/* TESTIMONIALS */}

            <section className="max-w-6xl mx-auto px-6 py-20">

                <div className="text-center mb-16 slide-up">

                    <h2 className="heading text-4xl">
                        What Our Customers Say
                    </h2>

                    <p className="subtext mt-4">
                        Trusted by buyers across Pune for both new and used car
                        inspections.
                    </p>

                </div>

                <div className="grid md:grid-cols-3 gap-8">

                    {[
                        {
                            name: "Sandeep Jagdale",
                            r: "The inspection was extremely detailed and gave me complete confidence before taking delivery of my new car.",
                        },
                        {
                            name: "Siddhesh Khule",
                            r: "Excellent inspection for my used WagonR. Honest feedback helped me negotiate the price and avoid future repairs.",
                        },
                        {
                            name: "Swapnil Gore",
                            r: "Professional inspector, detailed report, photographs and clear explanations. Highly recommended before buying any vehicle.",
                        },
                    ].map((item, i) => (

                        <div
                            key={i}
                            className="card-glass p-8 card-hover slide-up border-slate-100"
                            style={{ animationDelay: `${i * 0.1}s` }}
                        >

                            <div className="flex gap-1 text-amber-400 mb-4 text-xs">
                                {[...Array(5)].map((_, j) => (
                                    <span key={j}>★</span>
                                ))}
                            </div>

                            <p className="italic text-slate-600 mb-6 text-sm">
                                "{item.r}"
                            </p>

                            <div className="flex items-center gap-3">

                                <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center font-bold text-xs text-indigo-600 uppercase">
                                    {item.name[0]}
                                </div>

                                <p className="font-bold text-sm">
                                    {item.name}
                                </p>

                            </div>

                        </div>

                    ))}

                </div>

            </section>
            {/* SEO CONTENT */}

            <section className="max-w-4xl mx-auto px-6 py-20">

                <h2 className="heading text-3xl mb-8">
                    Independent Vehicle Inspection in Pune
                </h2>

                <div className="space-y-6 subtext leading-relaxed">

                    <p>
                        Buying a <b>new car</b> or a <b>used car</b> is one of
                        the biggest financial decisions you'll make. A professional
                        inspection helps you identify defects before they become
                        expensive problems.
                    </p>

                    <p>
                        For <b>new cars</b>, our Pre-Delivery Inspection (PDI)
                        checks for transport damage, repaint work, missing
                        accessories, electronic faults and manufacturing defects
                        before you accept delivery.
                    </p>

                    <p>
                        For <b>used cars</b>, our Pre-Purchase Inspection (PPI)
                        evaluates accident history, engine condition,
                        suspension, brakes, tyres, electronics, underbody,
                        OBD diagnostics and overall vehicle health before you
                        make the purchase.
                    </p>

                    <p>
                        Every inspection follows a comprehensive{" "}
                        <b>299+ point checklist</b> and includes a detailed
                        digital report with photographs and recommendations.
                    </p>

                    <p>
                        Learn more about our{" "}
                        <Link
                            href="/pdi-checklist-for-new-car"
                            className="text-indigo-600 underline font-semibold"
                        >
                            New Car PDI Checklist
                        </Link>{" "}
                        or explore our{" "}
                        <Link
                            href="/used-cars/buying-guide"
                            className="text-indigo-600 underline font-semibold"
                        >
                            Used Car Buying Guide
                        </Link>.
                    </p>

                </div>

            </section>

            {/* FAQ */}

            <section className="max-w-4xl mx-auto px-6 pb-20">

                <h2 className="heading text-3xl mb-10 text-center">
                    Frequently Asked Questions
                </h2>

                <div className="space-y-6">

                    {[
                        {
                            q: "Do you inspect both new and used cars?",
                            a: "Yes. We provide Pre-Delivery Inspections (PDI) for new cars and Pre-Purchase Inspections (PPI) for used cars across Pune and PCMC.",
                        },
                        {
                            q: "How many checkpoints are covered?",
                            a: "Every inspection includes over 299+ inspection points covering the body, paint, engine, electronics, suspension, tyres, interiors, documentation and more.",
                        },
                        {
                            q: "Do you perform OBD diagnostics?",
                            a: "Yes. Compatible vehicles are scanned using professional diagnostic tools to detect hidden engine, ABS, transmission and airbag faults.",
                        },
                        {
                            q: "How long does an inspection take?",
                            a: "Most inspections take between one and two hours depending on the vehicle and inspection type.",
                        },
                        {
                            q: "Will I receive an inspection report?",
                            a: "Yes. A detailed digital report with photographs and expert recommendations is shared immediately after the inspection.",
                        },
                        {
                            q: "Which areas do you cover?",
                            a: "We provide inspection services across Pune, Pimpri-Chinchwad and nearby locations.",
                        },
                    ].map((item, i) => (

                        <div
                            key={i}
                            className="card-glass p-6 rounded-2xl border border-slate-100"
                        >

                            <h3 className="font-bold text-lg mb-2">
                                {item.q}
                            </h3>

                            <p className="subtext text-sm">
                                {item.a}
                            </p>

                        </div>

                    ))}

                </div>

            </section>

            {/* CTA */}

            <section className="px-6 pb-24">

                <div className="max-w-4xl mx-auto card-glass p-16 rounded-[2rem] border border-indigo-100 text-center relative overflow-hidden">

                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-600 to-pink-500" />

                    <h2 className="heading text-4xl mb-6">
                        Ready to Inspect Your Vehicle?
                    </h2>

                    <p className="subtext mb-10 max-w-2xl mx-auto leading-relaxed">
                        Whether you're buying a <b>brand-new car</b> or a
                        <b> used car</b>, our independent experts help you
                        make the right decision with a comprehensive
                        <b> 299+ point inspection</b>.
                    </p>

                    <div className="flex flex-col sm:flex-row justify-center gap-4">

                        <button
                            onClick={openBookingChooser}
                            className="btn-primary px-12 py-5 text-lg shadow-xl"
                        >
                            Book Inspection
                        </button>

                        <a
                            href="https://wa.me/919975934213"
                            className="card-glass px-12 py-5 font-bold border border-slate-200 flex items-center justify-center gap-2"
                        >
                            💬 WhatsApp Expert
                        </a>

                    </div>

                </div>

            </section>

            {/* MOBILE STICKY BAR */}

            <div className="fixed bottom-0 left-0 right-0 md:hidden z-50 p-4 flex gap-3 bg-white/80 backdrop-blur-xl border-t border-white/50">

                <button
                    onClick={openBookingChooser}
                    className="flex-1 btn-primary rounded-2xl text-sm font-black uppercase tracking-widest"
                >
                    Book
                </button>

                <a
                    href="https://wa.me/919975934213"
                    className="flex-1 bg-green-500 text-white flex items-center justify-center rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl gap-2"
                >
                    💬 WhatsApp
                </a>

            </div>

        </main>
    );
}