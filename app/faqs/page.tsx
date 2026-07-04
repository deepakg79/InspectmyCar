// app/faqs/page.tsx

"use client";

import Link from "next/link";
import Script from "next/script";
import { useState } from "react";
import { useBooking } from "@/app/context/BookingContext";
export default function FAQsPage() {
    const { openBookingChooser } = useBooking();
    const faqs = [
        {
            q: "What is a Pre-Delivery Inspection (PDI)?",
            a: "A PDI is a thorough check of your new car before delivery. It ensures there are no scratches, dents, mechanical issues, or missing features."
        },
        {
            q: "Why should I get a PDI in Pune?",
            a: "Even new cars can have transport damage, paint issues, or missing accessories. A professional PDI in Pune ensures your investment is safe before signing the final papers."
        },
        {
            q: "How long does a PDI take?",
            a: "A standard 300+ point inspection usually takes 1–2 hours, depending on the car and dealership access."
        },
        {
            q: "Can I do the PDI myself?",
            a: "You can check basics, but experts use tools to detect hidden issues like electronic faults, OBD errors, and repainting."
        },
        {
            q: "Do I need to book the PDI in advance?",
            a: "Yes. Dealerships require scheduling, and inspectors coordinate to ensure inspection before delivery."
        },
        {
            q: "How much does a PDI cost in Pune?",
            a: "Standard cars start at ₹1,499 and luxury cars at ₹2,499 with a full inspection report."
        },
        {
            q: "What do I get after the inspection?",
            a: "You receive a detailed checklist report with photos and identified issues before accepting delivery."
        },
        {
            q: "What is a Used Car Inspection (PPI)?",
            a: "A Pre-Purchase Inspection (PPI) is a comprehensive inspection of a used car before purchase. It helps identify hidden mechanical, electrical, structural, or accidental damage so you can make an informed buying decision."
        },
        {
            q: "Why should I inspect a used car before buying?",
            a: "Many used cars may have hidden accident repairs, odometer tampering, engine issues, suspension wear, or flood damage. A professional inspection can save you from costly repairs after purchase."
        },
        {
            q: "How many checkpoints are covered in a used car inspection?",
            a: "Our inspection includes over 300 checkpoints covering the engine, transmission, suspension, brakes, tyres, electrical systems, body panels, paint, chassis, interior, and a road test where applicable."
        },
        {
            q: "Do you provide an OBD diagnostic scan?",
            a: "Yes. We perform an OBD scan on compatible vehicles to detect hidden fault codes, engine warnings, ABS, airbag issues, and other electronic problems that may not be visible during a physical inspection."
        },
        {
            q: "Can you inspect cars at dealerships and individual sellers?",
            a: "Yes. We inspect used cars at authorised dealerships, multi-brand showrooms, and private seller locations across Pune, subject to seller approval."
        },
        {
            q: "Will I receive a detailed inspection report?",
            a: "Yes. After the inspection, you'll receive a detailed report with photographs, observations, defects found, and our recommendations to help you negotiate or avoid a problematic vehicle."
        },
        {
            q: "Can your report help negotiate the car price?",
            a: "Absolutely. Many buyers use our inspection findings to negotiate repairs or reduce the purchase price based on the vehicle's actual condition."
        },
        {
            q: "Do you inspect luxury and premium cars?",
            a: "Yes. We inspect luxury brands including BMW, Mercedes-Benz, Audi, Volvo, Jaguar, Land Rover, and other premium vehicles using specialised inspection procedures."
        },
        {
            q: "Which areas of Pune do you cover?",
            a: "We provide new car PDI and used car inspection services across Pune, including Baner, Hinjewadi, Wakad, Kharadi, Hadapsar, Kothrud, Aundh, Pimpri-Chinchwad, Magarpatta, and nearby areas."
        },
        {
            q: "Can I book an inspection on short notice?",
            a: "Yes. Subject to inspector availability, we can often arrange same-day or next-day inspections. Advance booking is recommended to secure your preferred slot."
        }
    ];

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faqs.map(faq => ({
            "@type": "Question",
            name: faq.q,
            acceptedAnswer: {
                "@type": "Answer",
                text: faq.a
            }
        }))
    };

    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const toggleFAQ = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <main className="bg-main text-slate-900 min-h-screen">

            <Script
                id="faq-schema"
                type="application/ld+json"
                strategy="afterInteractive"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            {/* HERO */}
            <section className="px-6 pt-32 pb-12 max-w-4xl mx-auto text-center">
                <h1 className="heading text-4xl md:text-6xl mb-6">
                    Car PDI FAQs in Pune
                </h1>
                <p className="subtext text-lg max-w-2xl mx-auto">
                    Answers to common questions about car delivery, inspection, and Pre-Delivery Inspection (PDI) in Pune.
                </p>
            </section>

            {/* FAQ LIST */}
            <section className="px-6 pb-20 max-w-4xl mx-auto space-y-4">
                {faqs.map((faq, index) => {
                    const isOpen = openIndex === index;

                    return (
                        <div
                            key={index}
                            className="card-glass p-6 rounded-2xl border border-slate-100 hover:shadow-md transition"
                        >
                            <button
                                onClick={() => toggleFAQ(index)}
                                aria-expanded={isOpen}
                                className="w-full text-left flex justify-between items-start gap-3 focus:outline-none"
                            >
                                <h2 className="font-bold text-lg flex-1">
                                    <span className="text-indigo-600">Q.</span> {faq.q}
                                </h2>

                                <span
                                    className="text-indigo-600 font-bold text-xl transition-transform duration-300"
                                    style={{
                                        transform: isOpen ? "rotate(45deg)" : "rotate(0deg)"
                                    }}
                                >
                                    +
                                </span>
                            </button>

                            {/* FIX: no scrollHeight usage */}
                            <div
                                className={`mt-3 subtext leading-relaxed overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
                                    }`}
                            >
                                <div className="pt-2">
                                    {faq.a}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </section>

            {/* INTERNAL LINKS */}
            <section className="px-6 pb-16 max-w-4xl mx-auto text-center">
                <div className="card-glass p-8 rounded-2xl border border-slate-100">
                    <h2 className="heading text-2xl mb-4">
                        Learn More Before Delivery
                    </h2>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/car-pdi-pune" className="text-indigo-600 font-bold underline">
                            Car PDI in Pune →
                        </Link>
                        <Link href="/car-delivery-checklist-pune" className="text-indigo-600 font-bold underline">
                            Delivery Checklist →
                        </Link>
                        <Link href="/top-10-mistakes-while-buying-car-in-pune" className="text-indigo-600 font-bold underline">
                            Common Mistakes →
                        </Link>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="px-6 pb-24">
                <div className="max-w-4xl mx-auto text-center card-glass p-14 rounded-3xl border border-indigo-100 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-600 to-pink-500" />

                    <h2 className="heading text-3xl md:text-4xl mb-6">
                        Still Have Questions?
                    </h2>

                    <p className="subtext mb-8 max-w-xl mx-auto">
                        Talk to our experts or book a professional inspection before your car delivery in Pune.
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