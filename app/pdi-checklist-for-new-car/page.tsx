import Link from "next/link";

export default function PDIChecklistPage() {
    const sections = [
        {
            title: "Exterior Inspection",
            items: [
                "Check for scratches, dents, paint mismatch",
                "Inspect panel gaps and alignment",
                "Look for repainting signs (uneven finish)",
                "Check headlights & taillights for cracks",
                "Inspect windshield for chips",
            ],
        },
        {
            title: "Interior Check",
            items: [
                "Seat condition (no stains or tears)",
                "AC cooling performance",
                "Infotainment system working properly",
                "Buttons, switches & power windows",
                "Odometer reading (should be under 100 km)",
            ],
        },
        {
            title: "Engine & Mechanical",
            items: [
                "Engine bay cleanliness",
                "No oil leakage",
                "Battery condition",
                "Fluid levels (engine oil, coolant, brake fluid)",
            ],
        },
        {
            title: "Electronics & Diagnostics",
            items: [
                "No warning lights on dashboard",
                "Reverse camera & parking sensors",
                "OBD scan for hidden errors",
            ],
        },
        {
            title: "Documents",
            items: [
                "VIN matches invoice",
                "Insurance details verified",
                "Temporary registration papers",
                "Warranty booklet",
            ],
        },
    ];

    return (
        <main className="bg-main text-slate-900 min-h-screen px-6 py-24">

            {/* HEADER */}
            <div className="max-w-5xl mx-auto text-center mb-16">
                <h1 className="heading text-4xl md:text-6xl mb-6 leading-tight">
                    PDI Checklist for New Car (2026 Guide)
                </h1>

                <p className="subtext text-lg max-w-2xl mx-auto leading-relaxed">
                    A Pre-Delivery Inspection (PDI) ensures your new car is free from
                    hidden damage, repaint issues, or mechanical defects before delivery.
                    This checklist helps you inspect your vehicle like an expert and avoid costly mistakes.
                </p>

                <p className="subtext mt-4 text-sm max-w-xl mx-auto">
                    Buying a car in Pune? Also read our{" "}
                    <Link href="/car-delivery-checklist-pune" className="text-indigo-600 underline font-semibold">
                        car delivery checklist in Pune
                    </Link>{" "}
                    for dealership-specific tips.
                </p>
            </div>

            {/* CHECKLIST */}
            <div className="max-w-5xl mx-auto space-y-10">
                {sections.map((section, i) => (
                    <div
                        key={i}
                        className="card-glass p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all"
                    >
                        <h2 className="heading text-2xl mb-6 flex items-center gap-2">
                            <span className="text-indigo-600 font-black">
                                {i + 1}.
                            </span>
                            {section.title}
                        </h2>

                        <ul className="space-y-4">
                            {section.items.map((item, index) => (
                                <li key={index} className="flex items-start gap-3 subtext">
                                    <span className="text-green-600 text-lg mt-1">✔</span>
                                    <span className="leading-relaxed">{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>

            {/* SEO CONTENT (CRITICAL) */}
            <section className="max-w-4xl mx-auto mt-20 space-y-6">
                <h2 className="heading text-3xl">
                    Why PDI is Important for New Cars
                </h2>

                <p className="subtext text-sm leading-relaxed">
                    Many new cars arrive at dealerships with minor scratches, dents,
                    repaint work, or electronic faults caused during transportation or storage.
                    Without a proper pre-delivery inspection, these issues may go unnoticed
                    until after delivery.
                </p>

                <p className="subtext text-sm leading-relaxed">
                    A proper PDI checklist helps you verify the car’s exterior condition,
                    interior quality, engine health, electronics, and documentation before
                    making the final payment.
                </p>

                <p className="subtext text-sm leading-relaxed">
                    If you're not confident doing it yourself, you can book a{" "}
                    <Link href="/car-pdi-pune" className="text-indigo-600 underline font-semibold">
                        professional car PDI inspection in Pune
                    </Link>{" "}
                    for a complete 200+ point expert evaluation.
                </p>
            </section>

            {/* FAQ */}
            <section className="max-w-4xl mx-auto mt-20">
                <h2 className="heading text-3xl text-center mb-10">
                    Frequently Asked Questions
                </h2>

                <div className="space-y-6">
                    {[
                        {
                            q: "What is PDI in cars?",
                            a: "PDI (Pre-Delivery Inspection) is a detailed inspection of a new car before delivery to ensure it has no defects or damages.",
                        },
                        {
                            q: "Is PDI mandatory in India?",
                            a: "It is not mandatory, but highly recommended to avoid taking delivery of a defective vehicle.",
                        },
                        {
                            q: "Can I do PDI myself?",
                            a: "Yes, but professionals can detect repainting, hidden damages, and electronic faults more accurately.",
                        },
                    ].map((item, i) => (
                        <div key={i} className="card-glass p-6 border border-slate-100">
                            <h3 className="font-bold text-lg mb-2">{item.q}</h3>
                            <p className="subtext text-sm">{item.a}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA */}
            <div className="max-w-4xl mx-auto mt-20">
                <div className="card-glass p-12 text-center rounded-3xl border border-indigo-100 shadow-xl relative overflow-hidden">

                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-600 to-pink-500" />

                    <h2 className="heading text-3xl mb-4">
                        Want a Professional 200+ Point Inspection?
                    </h2>

                    <p className="subtext mb-8 max-w-xl mx-auto">
                        Skip the stress. Our experts inspect your car directly at
                        the dealership and give you a detailed report.
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
                            className="card-glass px-10 py-4 font-bold text-lg flex items-center justify-center gap-2 border"
                        >
                            💬 WhatsApp
                        </a>
                    </div>
                </div>
            </div>

        </main>
    );
}