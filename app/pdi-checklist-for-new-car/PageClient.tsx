"use client";

import Link from "next/link";
import Script from "next/script";
import { useBooking } from "@/app/context/BookingContext";

export default function PageClient() {
    const { openBookingChooser } = useBooking();

    const sections = [
        {
            title: "Exterior Inspection",
            items: [
                "Check for scratches, dents and paint mismatch.",
                "Inspect panel gaps and body alignment.",
                "Look for repainting signs or uneven paint finish.",
                "Inspect headlights, tail lamps and fog lamps.",
                "Check windshield and windows for chips or cracks.",
                "Inspect tyres for cuts and verify manufacturing dates.",
                "Check alloy wheels/wheel covers for scratches.",
            ],
        },
        {
            title: "Interior Inspection",
            items: [
                "Check seats for stains, tears or loose stitching.",
                "Inspect dashboard and trim for scratches.",
                "Test AC cooling and blower operation.",
                "Verify infotainment system functionality.",
                "Test power windows and ORVM controls.",
                "Check central locking and spare key.",
                "Ensure odometer reading is under 100 km.",
            ],
        },
        {
            title: "Engine & Mechanical",
            items: [
                "Inspect engine bay cleanliness.",
                "Check for oil or coolant leaks.",
                "Verify engine oil, coolant and brake fluid levels.",
                "Inspect battery condition and manufacturing date.",
                "Listen for unusual engine noises.",
                "Check belts and visible hoses.",
            ],
        },
        {
            title: "Electronics & Diagnostics",
            items: [
                "Ensure no warning lights remain ON.",
                "Test reverse camera and parking sensors.",
                "Check all exterior and interior lights.",
                "Verify horn and steering controls.",
                "Perform OBD scan for hidden fault codes.",
            ],
        },
        {
            title: "Documents",
            items: [
                "VIN matches invoice.",
                "Engine number matches records.",
                "Insurance details verified.",
                "Temporary registration documents.",
                "Warranty booklet.",
                "Owner's manual.",
                "Service booklet.",
            ],
        },
        {
            title: "Road Test (If Allowed)",
            items: [
                "Check steering alignment.",
                "Verify braking performance.",
                "Listen for suspension noises.",
                "Check clutch and gear shifts.",
                "Ensure there are no abnormal vibrations.",
            ],
        },
    ];

    const faqs = [
        {
            q: "What is a Pre-Delivery Inspection (PDI)?",
            a: "A Pre-Delivery Inspection is a detailed inspection of a new vehicle before delivery to identify transport damage, manufacturing defects, repaint work, missing accessories and electronic issues.",
        },
        {
            q: "Is PDI mandatory in India?",
            a: "No. However, it is strongly recommended because once you accept delivery, cosmetic and transport-related issues become much harder to resolve.",
        },
        {
            q: "Can I perform PDI myself?",
            a: "Yes. This checklist covers the basics, but professional inspectors use paint thickness gauges, OBD scanners and specialised tools to identify hidden defects.",
        },
        {
            q: "How long does a professional PDI take?",
            a: "A comprehensive inspection usually takes between one and two hours depending on the vehicle and dealership access.",
        },
        {
            q: "Do you inspect luxury cars?",
            a: "Yes. We inspect BMW, Mercedes-Benz, Audi, Volvo, Jaguar, Land Rover, Lexus and other premium brands.",
        },
        {
            q: "Will I receive an inspection report?",
            a: "Yes. Every inspection includes a detailed report with photographs, observations and recommendations before you accept delivery.",
        },
    ];

    return (
        <main className="bg-main text-slate-900 min-h-screen">

            <Script
                id="pdi-checklist-schema"
                type="application/ld+json"
                strategy="afterInteractive"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "FAQPage",
                        mainEntity: faqs.map((faq) => ({
                            "@type": "Question",
                            name: faq.q,
                            acceptedAnswer: {
                                "@type": "Answer",
                                text: faq.a,
                            },
                        })),
                    }),
                }}
            />

            {/* HERO */}
            <section className="max-w-5xl mx-auto px-6 pt-32 pb-14 text-center">

                <h1 className="heading text-4xl md:text-6xl leading-tight mb-6">
                    PDI Checklist for New Car
                    <span className="block text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-pink-500">
                        (2026 Guide)
                    </span>
                </h1>

                <p className="subtext text-lg max-w-3xl mx-auto leading-relaxed">
                    This expert Pre-Delivery Inspection (PDI) checklist helps you
                    inspect your new car before delivery. It covers the exterior,
                    interior, electronics, engine, documentation and other
                    critical areas so you don't accept a car with hidden defects.
                </p>

                <p className="subtext mt-4 text-sm max-w-2xl mx-auto">
                    Buying a car in Pune? Also read our{" "}
                    <Link
                        href="/car-delivery-checklist-pune"
                        className="text-indigo-600 underline font-semibold"
                    >
                        Car Delivery Checklist
                    </Link>{" "}
                    before visiting the dealership.
                </p>

            </section>

            {/* CHECKLIST */}
            <section className="max-w-5xl mx-auto px-6 pb-20 space-y-10">

                {sections.map((section, i) => (
                    <div
                        key={i}
                        className="card-glass p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition"
                    >
                        <h2 className="heading text-2xl mb-6 flex items-center gap-2">
                            <span className="text-indigo-600 font-black">
                                {i + 1}.
                            </span>
                            {section.title}
                        </h2>

                        <ul className="space-y-4">
                            {section.items.map((item, index) => (
                                <li
                                    key={index}
                                    className="flex items-start gap-3 subtext"
                                >
                                    <span className="text-green-600 mt-1">
                                        ✔
                                    </span>

                                    <span className="leading-relaxed">
                                        {item}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}

            </section>

            {/* WHY PDI */}
            <section className="max-w-4xl mx-auto px-6 pb-20 space-y-6">

                <h2 className="heading text-3xl">
                    Why Pre-Delivery Inspection Matters
                </h2>

                <p className="subtext leading-relaxed">
                    Even brand-new vehicles can have transport damage, paint
                    defects, missing accessories, battery issues or software
                    faults. A proper PDI helps identify these problems before
                    you sign the delivery documents.
                </p>

                <p className="subtext leading-relaxed">
                    Spending an hour on inspection can save you from expensive
                    repairs, warranty disputes and unnecessary stress later.
                </p>

                <p className="subtext leading-relaxed">
                    If you're not confident inspecting the vehicle yourself,
                    consider booking a professional{" "}
                    <Link
                        href="/car-pdi-pune"
                        className="text-indigo-600 font-semibold underline"
                    >
                        Car PDI Inspection in Pune
                    </Link>.
                </p>

            </section>
            {/* RELATED GUIDES */}
            <section className="max-w-5xl mx-auto px-6 pb-16 text-center">

                <div className="card-glass p-8 rounded-2xl border border-slate-100">

                    <h2 className="heading text-2xl mb-4">
                        Related Guides
                    </h2>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">

                        <Link
                            href="/car-delivery-checklist-pune"
                            className="text-indigo-600 font-bold underline"
                        >
                            Car Delivery Checklist →
                        </Link>

                        <Link
                            href="/top-10-mistakes-while-buying-car-in-pune"
                            className="text-indigo-600 font-bold underline"
                        >
                            Top 10 Buying Mistakes →
                        </Link>

                        <Link
                            href="/faqs"
                            className="text-indigo-600 font-bold underline"
                        >
                            PDI FAQs →
                        </Link>

                    </div>

                </div>

            </section>

            {/* FAQ */}
            <section className="max-w-4xl mx-auto px-6 pb-20">

                <h2 className="heading text-3xl text-center mb-10">
                    Frequently Asked Questions
                </h2>

                <div className="space-y-6">

                    {faqs.map((faq, i) => (
                        <div
                            key={i}
                            className="card-glass p-6 rounded-2xl border border-slate-100"
                        >
                            <h3 className="font-bold text-lg mb-2">
                                {faq.q}
                            </h3>

                            <p className="subtext">
                                {faq.a}
                            </p>
                        </div>
                    ))}

                </div>

            </section>

            {/* CTA */}
            <section className="px-6 pb-28">

                <div className="max-w-4xl mx-auto text-center card-glass p-14 rounded-3xl border border-indigo-100 shadow-xl relative overflow-hidden">

                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-600 to-pink-500" />

                    <h2 className="heading text-3xl md:text-4xl mb-5">
                        Book a Professional PDI Before Delivery
                    </h2>

                    <p className="subtext mb-8 max-w-2xl mx-auto leading-relaxed">
                        Our independent experts perform a comprehensive
                        <b> 200+ point inspection </b>
                        at your dealership to identify hidden defects,
                        repaint issues, transport damage and electronic faults
                        before you take delivery.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">

                        <button
                            onClick={openBookingChooser}
                            className="btn-primary px-10 py-4 text-lg shadow-xl"
                        >
                            Book PDI Now
                        </button>

                        <a
                            href="https://wa.me/919975934213"
                            className="card-glass px-10 py-4 font-bold text-lg flex items-center justify-center gap-2 border border-slate-200"
                        >
                            💬 WhatsApp Expert
                        </a>

                    </div>

                </div>

            </section>

        </main>
    );
}