"use client";

import Link from "next/link";
import Script from "next/script";
import { useBooking } from "@/app/context/BookingContext";

export default function PageClient() {
    const { openBookingChooser } = useBooking();

    const sections = [
        {
            title: "Before Visiting the Dealership",
            items: [
                "Confirm the VIN number with the dealer.",
                "Ask for stockyard inspection access if possible.",
                "Avoid making the final payment before the inspection.",
                "Carry a copy of your booking receipt and quotation.",
            ],
        },
        {
            title: "Exterior Inspection",
            items: [
                "Inspect the vehicle in bright daylight.",
                "Do not inspect a wet or freshly washed car.",
                "Check for dents, scratches, repainting, or panel gaps.",
                "Inspect bumpers, mirrors, headlights, fog lamps and tail lamps.",
                "Verify tyre manufacturing dates and wheel condition.",
            ],
        },
        {
            title: "Interior Inspection",
            items: [
                "Check seats, upholstery and dashboard for damage.",
                "Verify all accessories promised by the dealer.",
                "Ensure the infotainment system functions correctly.",
                "Test power windows, mirrors and central locking.",
                "Check AC cooling and blower operation.",
            ],
        },
        {
            title: "Mechanical & Electrical",
            items: [
                "Start the engine and listen for abnormal noises.",
                "Check warning lights on the instrument cluster.",
                "Test horn, indicators and headlights.",
                "Verify reverse camera and parking sensors.",
                "Inspect the battery manufacturing date.",
            ],
        },
        {
            title: "Documents to Verify",
            items: [
                "Invoice matches VIN and Engine Number.",
                "Insurance policy details.",
                "Form 20 & Form 21.",
                "Temporary Registration documents.",
                "Warranty booklet and owner's manual.",
            ],
        },
        {
            title: "Common Mistakes to Avoid",
            danger: true,
            items: [
                "Skipping Pre-Delivery Inspection (PDI).",
                "Trusting dealership checks blindly.",
                "Ignoring paint mismatch or scratches.",
                "Accepting delivery in poor lighting.",
                "Not verifying manufacturing date.",
                "Skipping a professional inspection.",
            ],
        },
    ];

    const faqs = [
        {
            q: "Is Pre-Delivery Inspection (PDI) necessary?",
            a: "Yes. A PDI helps identify transport damage, repaint issues, missing accessories, electronic faults and manufacturing defects before you accept your new car.",
        },
        {
            q: "Can I inspect my new car before making the final payment?",
            a: "Yes. It is recommended to inspect the vehicle before making the final payment and signing delivery documents.",
        },
        {
            q: "Do Pune dealerships allow PDI?",
            a: "Most dealerships allow inspections if informed in advance. It's best to coordinate the inspection date with both the dealership and inspector.",
        },
        {
            q: "What is a Used Car Inspection (PPI)?",
            a: "A Pre-Purchase Inspection (PPI) is a detailed evaluation of a used vehicle before purchase to detect hidden mechanical, structural or accident-related issues.",
        },
        {
            q: "Why should I inspect a used car before buying?",
            a: "Professional inspections can identify accident repairs, engine issues, suspension wear, flood damage and odometer tampering before you buy.",
        },
        {
            q: "Do you perform OBD diagnostics?",
            a: "Yes. Compatible vehicles are scanned using professional OBD equipment to detect hidden engine, ABS, airbag and transmission faults.",
        },
        {
            q: "Do you inspect luxury cars?",
            a: "Yes. We inspect premium brands including BMW, Mercedes-Benz, Audi, Volvo, Jaguar, Land Rover, Lexus and other luxury vehicles.",
        },
        {
            q: "Will I receive an inspection report?",
            a: "Yes. Every inspection includes a detailed report with photographs, observations and recommendations.",
        },
    ];

    return (
        <main className="bg-main text-slate-900 min-h-screen">

            <Script
                id="faq-schema"
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
            <section className="px-6 pt-32 pb-16 max-w-5xl mx-auto text-center">

                <h1 className="heading text-4xl md:text-6xl mb-6 leading-tight">
                    Car Delivery Checklist in Pune
                    <span className="block text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-pink-500">
                        (2026 Guide)
                    </span>
                </h1>

                <p className="subtext text-lg max-w-3xl mx-auto leading-relaxed">
                    Whether you're buying a <b>new car</b> or a <b>used car</b>,
                    use this expert checklist before making the final decision.
                    It helps you identify hidden defects, repaint issues,
                    mechanical faults and costly surprises.
                </p>

            </section>

            {/* WHY IMPORTANT */}
            <section className="px-6 pb-16 max-w-5xl mx-auto">

                <h2 className="heading text-2xl mb-6">
                    Why Vehicle Inspection Matters
                </h2>

                <p className="subtext leading-relaxed">
                    New vehicles can suffer transport damage, storage issues or
                    factory defects, while used vehicles may hide accident
                    repairs, mechanical wear or electronic faults. A systematic
                    inspection protects your investment before you commit to the
                    purchase.
                </p>

            </section>

            {/* CHECKLIST */}
            <section className="px-6 pb-20 max-w-5xl mx-auto space-y-12">

                {sections.map((section, i) => (
                    <div
                        key={i}
                        className="card-glass p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition"
                    >
                        <h2 className="heading text-2xl mb-6">
                            {section.title}
                        </h2>

                        <ul className="space-y-3">

                            {section.items.map((item, idx) => (
                                <li
                                    key={idx}
                                    className="flex items-start gap-3 subtext"
                                >
                                    <span
                                        className={`mt-1 text-sm ${section.danger
                                            ? "text-red-500"
                                            : "text-green-600"
                                            }`}
                                    >
                                        {section.danger ? "❌" : "✔"}
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

            {/* FAQ */}
            <section className="px-6 pb-20 max-w-5xl mx-auto">

                <h2 className="heading text-3xl mb-8 text-center">
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
            {/* INTERNAL LINKS */}
            <section className="px-6 pb-16 max-w-5xl mx-auto text-center">

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
                            href="/top-10-mistakes-while-buying-car-in-pune"
                            className="text-indigo-600 font-bold underline"
                        >
                            Buying Mistakes →
                        </Link>

                    </div>

                </div>

            </section>

            {/* CTA */}
            <section className="px-6 pb-28">

                <div className="max-w-4xl mx-auto text-center card-glass p-14 rounded-3xl border border-indigo-100 relative overflow-hidden">

                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-600 to-pink-500" />

                    <h2 className="heading text-3xl md:text-4xl mb-6">
                        Buy With Confidence
                    </h2>

                    <p className="subtext mb-8 max-w-xl mx-auto leading-relaxed">
                        Whether you're taking delivery of a <b>new car</b> or
                        purchasing a <b>used car</b>, our independent experts
                        perform a comprehensive <b>299+ point inspection</b> to
                        help you avoid hidden defects and expensive surprises.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">

                        <button
                            onClick={openBookingChooser}
                            className="btn-primary px-10 py-4 text-lg shadow-xl"
                        >
                            Book Inspection
                        </button>

                        <a
                            href="https://wa.me/919975934213"
                            className="card-glass px-10 py-4 font-bold text-lg border border-slate-200"
                        >
                            💬 WhatsApp Expert
                        </a>

                    </div>

                </div>

            </section>

        </main>
    );
}