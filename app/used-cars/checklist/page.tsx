import Link from "next/link";

export default function UsedCarPDIChecklistPage() {
    const sections = [
        {
            title: "Exterior & Accident Detection",
            items: [
                "Check for dents, scratches, and repaint mismatch",
                "Inspect panel gaps (uneven gaps = accident repair)",
                "Look for overspray on rubber seals and edges",
                "Check headlights/taillights for cracks or fogging",
                "Inspect windshield for cracks or replacements",
            ],
        },
        {
            title: "Interior Condition",
            items: [
                "Seat wear, stains, and foam damage",
                "Dashboard cracks or aftermarket modifications",
                "AC cooling performance and unusual smells",
                "All switches, windows, and infotainment system",
                "Check for water ingress or damp smell (flood risk)",
            ],
        },
        {
            title: "Engine & Mechanical Health",
            items: [
                "Engine noise (cold start check)",
                "Oil leaks or sludge buildup",
                "Battery health and replacement signs",
                "Coolant, brake fluid, and engine oil condition",
                "Clutch and gearbox smoothness",
            ],
        },
        {
            title: "Electronics & Diagnostics",
            items: [
                "No warning lights on dashboard",
                "OBD scan for hidden error codes",
                "Reverse camera & parking sensors",
                "Power steering and ABS system check",
            ],
        },
        {
            title: "Documents & Legal Check",
            items: [
                "RC and VIN verification match",
                "Service history records",
                "Insurance claims history (accident check)",
                "Loan clearance / hypothecation status",
                "Odometer reading consistency",
            ],
        },
    ];

    return (
        <main className="bg-main text-slate-900 min-h-screen px-6 py-24">

            {/* HEADER */}
            <div className="max-w-5xl mx-auto text-center mb-16">

                <h1 className="heading text-4xl md:text-6xl mb-6 leading-tight">
                    Used Car Inspection Checklist (2026 Guide)
                </h1>

                <p className="subtext text-lg max-w-2xl mx-auto leading-relaxed">
                    Buying a used car can save money—but only if the vehicle is in good condition.
                    This checklist helps you detect accident repairs, engine issues, flood damage,
                    and hidden faults before you make the payment.
                </p>

                <p className="subtext mt-4 text-sm max-w-xl mx-auto">
                    Planning to buy in Pune? You can also book a{" "}
                    <Link href="/used-cars/pdi-pune" className="text-pink-600 underline font-semibold">
                        professional used car inspection in Pune
                    </Link>{" "}
                    for a detailed expert evaluation.
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
                            <span className="text-pink-500 font-black">
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

            {/* SEO SECTION */}
            <section className="max-w-4xl mx-auto mt-20 space-y-6">

                <h2 className="heading text-3xl">
                    Why Used Car Inspection is Critical
                </h2>

                <p className="subtext text-sm leading-relaxed">
                    Unlike new cars, used vehicles may have hidden accident history,
                    repaint work, engine wear, or even flood damage that is not visible
                    during a casual inspection.
                </p>

                <p className="subtext text-sm leading-relaxed">
                    Sellers often clean and cosmetically restore vehicles, making them
                    appear newer than they actually are. A professional inspection helps
                    uncover the real condition of the car.
                </p>

                <p className="subtext text-sm leading-relaxed">
                    Our experts perform a detailed 299+ point inspection including
                    engine diagnostics, structural checks, repaint detection, and full
                    OBD scanning before you buy.
                </p>

                <p className="subtext text-sm leading-relaxed">
                    If you want expert help, book a{" "}
                    <Link href="/used-cars/pdi-pune" className="text-pink-600 underline font-semibold">
                        used car PDI service in Pune
                    </Link>{" "}
                    before finalizing your purchase.
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
                            q: "Is PDI necessary for used cars?",
                            a: "Yes. Used cars often have hidden accident or mechanical issues that are not visible externally.",
                        },
                        {
                            q: "Can I trust dealer-certified used cars?",
                            a: "Not always. Even certified cars may have repaint or minor accident history.",
                        },
                        {
                            q: "How long does a used car inspection take?",
                            a: "Typically 1–2 hours depending on vehicle condition and inspection depth.",
                        },
                    ].map((item, i) => (
                        <div key={i} className="card-glass p-6 border border-slate-100">

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
            <div className="max-w-4xl mx-auto mt-20">

                <div className="card-glass p-12 text-center rounded-3xl border border-pink-100 shadow-xl relative overflow-hidden">

                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-pink-500 to-indigo-600" />

                    <h2 className="heading text-3xl mb-4">
                        Don’t Buy a Problem Car
                    </h2>

                    <p className="subtext mb-8 max-w-xl mx-auto">
                        A used car may look perfect—but hidden issues can cost you lakhs later.
                        Get it inspected before you pay.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">

                        <Link
                            href="/used-cars/pdi-pune"
                            className="btn-primary px-10 py-4 text-lg shadow-xl"
                        >
                            Book Used Car Inspection
                        </Link>

                        <a
                            href="https://wa.me/919975934213"
                            className="card-glass px-10 py-4 font-bold text-lg flex items-center justify-center gap-2 border"
                        >
                            💬 WhatsApp Expert
                        </a>

                    </div>

                </div>

            </div>

        </main>
    );
}