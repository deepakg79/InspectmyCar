"use client";

import Link from "next/link";
import Script from "next/script";
import { useState, useRef, useEffect } from "react";

export default function FAQsPage() {
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
            a: "A standard 200+ point inspection usually takes 1–2 hours, depending on the car and dealership access."
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
        }
    ];

    // JSON-LD structured data
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": faqs.map(faq => ({
            "@type": "Question",
            "name": faq.q,
            "acceptedAnswer": {
                "@type": "Answer",
                "text": faq.a
            }
        }))
    };

    const [openIndex, setOpenIndex] = useState<number | null>(null);
    const contentRefs = useRef<(HTMLDivElement | null)[]>([]);
    const toggleFAQ = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    useEffect(() => {
        // Update max-heights for smooth animation
        contentRefs.current.forEach((ref, i) => {
            if (ref) {
                if (openIndex === i) {
                    ref.style.maxHeight = ref.scrollHeight + "px";
                } else {
                    ref.style.maxHeight = "0px";
                }
            }
        });
    }, [openIndex]);

    return (
        <main className="bg-main text-slate-900 min-h-screen">

            {/* SEO JSON-LD */}
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
                {faqs.map((faq, index) => (
                    <div
                        key={index}
                        className="card-glass p-6 rounded-2xl border border-slate-100 hover:shadow-md transition"
                    >
                        <button
                            onClick={() => toggleFAQ(index)}
                            aria-expanded={openIndex === index}
                            className="w-full text-left flex justify-between items-start gap-3 focus:outline-none"
                        >
                            <h2 className="font-bold text-lg flex-1">
                                <span className="text-indigo-600">Q.</span> {faq.q}
                            </h2>
                            <span className="text-indigo-600 font-bold text-xl transition-transform duration-300"
                                style={{ transform: openIndex === index ? "rotate(45deg)" : "rotate(0deg)" }}>
                                +
                            </span>
                        </button>
                        <div
                            ref={el => { contentRefs.current[index] = el; }}
                            className="mt-3 subtext leading-relaxed overflow-hidden transition-all duration-500 ease-in-out"
                            style={{
                                maxHeight: openIndex === index ? `${contentRefs.current[index]?.scrollHeight}px` : "0px",
                                opacity: openIndex === index ? 1 : 0,
                                transform: openIndex === index ? "translateY(0)" : "translateY(-10px)"
                            }}
                        >
                            {faq.a}
                        </div>
                    </div>
                ))}
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
                        <Link
                            href="/book"
                            className="btn-primary px-10 py-4 text-lg shadow-xl"
                        >
                            Book PDI Now
                        </Link>
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