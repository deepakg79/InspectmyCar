"use client";

import Link from "next/link";
import { useBooking } from "@/app/context/BookingContext";

export default function PageClient() {
    const { openBookingChooser } = useBooking();

    const mistakes = [
        {
            title: "Skipping Pre-Delivery Inspection",
            desc: "New cars can still have transit damage, repaint issues, battery problems, software faults, or missing accessories. Never accept delivery without a thorough inspection.",
            highlight: true,
        },
        {
            title: "Buying a Used Car Without Inspection",
            desc: "Many used cars hide accident repairs, flood damage, engine wear, or odometer tampering. Always get an independent inspection before payment.",
            highlight: true,
        },
        {
            title: "Trusting the Dealer Blindly",
            desc: "Dealerships and sellers may unintentionally miss defects or prioritize quick deliveries. Always verify the vehicle independently.",
        },
        {
            title: "Not Checking Manufacturing Date",
            desc: "Cars sitting in stock for several months may have battery degradation, tyre aging, and lower resale value.",
        },
        {
            title: "Ignoring Paint Quality",
            desc: "Transport damage and repainting can be difficult to detect without proper inspection tools like a paint thickness gauge.",
        },
        {
            title: "Not Checking Electronics",
            desc: "Test infotainment, reverse camera, sensors, headlights, warning lights, airbags, and all electrical features.",
        },
        {
            title: "Skipping Underbody Inspection",
            desc: "Leaks, rust, transport damage, bent suspension parts, or underbody scratches often go unnoticed.",
        },
        {
            title: "Accepting a Rushed Delivery",
            desc: "Take your time. Never let anyone pressure you into signing delivery papers before completing your inspection.",
        },
        {
            title: "Not Verifying VIN & Documents",
            desc: "Ensure the VIN, engine number, registration papers, insurance, and invoice all match correctly.",
        },
        {
            title: "Not Hiring a Professional Inspector",
            desc: "Professional inspectors use specialised tools, OBD scanners, and experience to detect issues most buyers miss.",
        },
    ];

    const faqs = [
        {
            q: "Why is Pre-Delivery Inspection (PDI) important?",
            a: "A Pre-Delivery Inspection ensures your new car is free from transport damage, repaint issues, missing accessories, electronic faults, or manufacturing defects before you accept delivery.",
        },
        {
            q: "What is a Used Car Inspection (PPI)?",
            a: "A Pre-Purchase Inspection (PPI) is a detailed inspection of a used car before purchase to identify hidden mechanical, electrical, structural, or accidental damage.",
        },
        {
            q: "Can I inspect a new car myself?",
            a: "Yes, but professional inspectors use paint thickness gauges, OBD scanners, and detailed checklists to detect issues that are difficult to identify during a basic visual inspection.",
        },
        {
            q: "Why should I inspect a used car before buying?",
            a: "A professional inspection can reveal hidden accident repairs, engine problems, suspension wear, flood damage, or odometer tampering.",
        },
        {
            q: "Do you inspect luxury cars?",
            a: "Yes. We inspect premium brands including BMW, Mercedes-Benz, Audi, Volvo, Jaguar, Land Rover, Toyota, Volkswagen, Skoda, Hyundai, Tata, Mahindra, Kia, Honda, MG, Nissan, Renault and many others.",
        },
        {
            q: "Do you perform OBD diagnostics?",
            a: "Yes. We perform OBD scans on compatible vehicles to detect hidden fault codes affecting the engine, transmission, ABS, airbags, and other electronic systems.",
        },
        {
            q: "Which areas in Pune do you cover?",
            a: "We provide inspections across Pune including Baner, Hinjewadi, Wakad, Kharadi, Hadapsar, Aundh, Kothrud, Pimpri-Chinchwad, Viman Nagar, Magarpatta and nearby locations.",
        },
        {
            q: "Will I receive an inspection report?",
            a: "Yes. Every inspection includes a detailed report with photographs, observations, identified defects, and recommendations before you buy or accept delivery.",
        },
    ];

    return (
        <main className="bg-main text-slate-900 min-h-screen">

            {/* HERO */}
            <section className="max-w-4xl mx-auto px-6 pt-32 pb-12 text-center">
                <h1 className="heading text-4xl md:text-6xl leading-tight mb-6">
                    Top 10 Mistakes to Avoid While Buying a New or Used Car in Pune
                </h1>

                <p className="subtext text-lg leading-relaxed max-w-3xl mx-auto">
                    Buying a new or used car in Pune is exciting—but many buyers make expensive mistakes that lead to hidden damages, unexpected repairs, and unnecessary expenses.
                </p>

                <p className="subtext text-lg mt-4">
                    Here are the <b>10 most common mistakes</b> and how you can avoid them.
                </p>
            </section>

            {/* MISTAKES */}
            <section className="max-w-4xl mx-auto px-6 pb-20 space-y-8">
                {mistakes.map((item, i) => (
                    <div
                        key={i}
                        className={`card-glass p-6 rounded-2xl border border-slate-100 shadow-sm ${item.highlight
                            ? "border-indigo-200 bg-indigo-50/40"
                            : ""
                            }`}
                    >
                        <h2 className="font-bold text-xl mb-2">
                            ❌ {i + 1}. {item.title}
                        </h2>

                        <p className="subtext leading-relaxed">
                            {item.desc}
                        </p>

                        {item.highlight && (
                            <button
                                onClick={openBookingChooser}
                                className="inline-block mt-3 text-indigo-600 font-bold underline"
                            >
                                👉 Book Professional Inspection →
                            </button>
                        )}
                    </div>
                ))}
            </section>

            {/* FAQ */}
            <section className="max-w-4xl mx-auto px-6 pb-20">
                <h2 className="heading text-3xl md:text-4xl mb-10 text-center">
                    Frequently Asked Questions
                </h2>

                <div className="space-y-6">
                    {faqs.map((faq, i) => (
                        <div
                            key={i}
                            className="card-glass p-6 border border-slate-100 rounded-xl"
                        >
                            <h3 className="font-bold text-lg mb-2">
                                {faq.q}
                            </h3>

                            <p className="subtext text-sm">
                                {faq.a}
                            </p>
                        </div>
                    ))}
                </div>
            </section>
            {/* INTERNAL LINKS */}
            <section className="max-w-4xl mx-auto px-6 pb-16 text-center">
                <div className="card-glass p-8 rounded-2xl border border-slate-100">
                    <h2 className="heading text-2xl mb-4">
                        Learn More Before Buying
                    </h2>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href="/car-pdi-pune"
                            className="text-indigo-600 font-bold underline"
                        >
                            New Car PDI →
                        </Link>

                        <Link
                            href="/used-cars/buying-guide"
                            className="text-indigo-600 font-bold underline"
                        >
                            Used Car Buying Guide →
                        </Link>

                        <Link
                            href="/car-delivery-checklist-pune"
                            className="text-indigo-600 font-bold underline"
                        >
                            Delivery Checklist →
                        </Link>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="px-6 pb-24">
                <div className="max-w-4xl mx-auto text-center card-glass p-14 rounded-3xl border border-indigo-100 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-600 to-pink-500" />

                    <h2 className="heading text-3xl md:text-4xl mb-6">
                        Buy With Confidence
                    </h2>

                    <p className="subtext mb-8 max-w-xl mx-auto leading-relaxed">
                        Whether you're buying a <b>brand-new car</b> or a
                        <b> used car</b>, a professional{" "}
                        <b>299+ point inspection</b> helps you avoid hidden
                        defects, expensive repairs, and costly mistakes.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">

                        <button
                            onClick={openBookingChooser}
                            className="btn-primary px-10 py-4 text-lg shadow-xl"
                        >
                            Book Inspection
                        </button>

                        <Link
                            href="/faqs"
                            className="card-glass px-10 py-4 font-bold text-lg border border-slate-200"
                        >
                            View FAQs
                        </Link>

                    </div>
                </div>
            </section>

        </main>
    );
}