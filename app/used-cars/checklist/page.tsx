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
        <main className="bg-main min-h-screen text-slate-900">
            {/* HERO */}
            <section className="px-6 pt-32 pb-20">
                <div className="max-w-6xl mx-auto text-center">
                    <div className="text-indigo-600 font-black uppercase tracking-[0.35em] text-xs mb-4">
                        Used Car Buying Guide
                    </div>

                    <h1 className="heading text-5xl md:text-7xl mb-6 leading-tight">
                        Used Car Inspection
                        <span className="block text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-pink-500">
                            Checklist
                        </span>
                    </h1>

                    <p className="subtext text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
                        Buying a used car can save money—but only if the vehicle is
                        in good condition. This checklist helps you detect accident
                        repairs, engine issues, flood damage, and hidden faults
                        before you make the payment.
                    </p>

                    <p className="subtext text-lg max-w-3xl mx-auto leading-relaxed mt-5">
                        For a professional inspection, check our{" "}
                        <Link
                            href="/new-cars"
                            className="text-indigo-600 font-bold underline underline-offset-4 hover:text-pink-500 transition-colors"
                        >
                            car PDI service
                        </Link>
                        .
                    </p>
                </div>
            </section>

            {/* CHECKLIST */}
            <section className="px-6 pb-6">
                <div className="max-w-6xl mx-auto space-y-8">
                    {sections.map((section, i) => (
                        <div
                            key={i}
                            className="card-glass rounded-3xl border border-slate-100 p-8 md:p-10 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                        >
                            <div className="flex items-start gap-5">
                                <div className="shrink-0 w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-600 to-pink-500 text-white flex items-center justify-center font-black text-lg shadow-lg">
                                    {i + 1}
                                </div>

                                <div className="flex-1">
                                    <h2 className="heading text-2xl md:text-3xl mb-6">
                                        {section.title}
                                    </h2>

                                    <ul className="space-y-4">
                                        {section.items.map((item, index) => (
                                            <li
                                                key={index}
                                                className="flex items-start gap-3 subtext"
                                            >
                                                <span className="shrink-0 w-6 h-6 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center text-sm font-black mt-0.5">
                                                    ✓
                                                </span>

                                                <span className="leading-relaxed">
                                                    {item}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* SEO SECTION */}
            <section className="px-6 pt-16">
                <div className="max-w-4xl mx-auto">
                    <div className="card-glass rounded-3xl border border-slate-100 p-8 md:p-10 shadow-sm">
                        <div className="text-indigo-600 font-black uppercase tracking-[0.25em] text-xs mb-4">
                            Why It Matters
                        </div>

                        <h2 className="heading text-3xl md:text-4xl mb-6">
                            Why Used Car Inspection is{" "}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-pink-500">
                                Critical
                            </span>
                        </h2>

                        <div className="space-y-5">
                            <p className="subtext leading-relaxed">
                                Unlike new cars, used vehicles may have hidden
                                accident history, repaint work, engine wear, or even
                                flood damage that is not visible during a casual
                                inspection.
                            </p>

                            <p className="subtext leading-relaxed">
                                Sellers often clean and cosmetically restore
                                vehicles, making them appear newer than they
                                actually are. A professional inspection helps
                                uncover the real condition of the car.
                            </p>

                            <p className="subtext leading-relaxed">
                                Our experts perform a detailed 400 point inspection
                                including engine diagnostics, structural checks,
                                repaint detection, and full OBD scanning before
                                you buy.
                            </p>

                            <p className="subtext leading-relaxed">
                                If you want expert help, book a{" "}
                                <Link
                                    href="/used-cars/pdi-pune"
                                    className="text-pink-600 underline underline-offset-4 font-bold hover:text-indigo-600 transition-colors"
                                >
                                    used car PDI service
                                </Link>{" "}
                                before finalizing your purchase.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ */}
            <section className="px-6 pt-20">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-10">
                        <div className="text-indigo-600 font-black uppercase tracking-[0.25em] text-xs mb-3">
                            FAQ
                        </div>

                        <h2 className="heading text-3xl md:text-4xl">
                            Frequently Asked Questions
                        </h2>
                    </div>

                    <div className="space-y-5">
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
                            <div
                                key={i}
                                className="card-glass rounded-3xl border border-slate-100 p-6 md:p-7 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                            >
                                <h3 className="font-bold text-lg mb-2 text-slate-900">
                                    {item.q}
                                </h3>

                                <p className="subtext text-sm leading-relaxed">
                                    {item.a}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="px-6 pt-20 pb-20">
                <div className="max-w-5xl mx-auto">
                    <div className="card-glass rounded-[2rem] p-10 md:p-14 border border-indigo-100 relative overflow-hidden text-center shadow-sm">
                        {/* Gradient accent */}
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-600 via-violet-500 to-pink-500" />

                        {/* Decorative glow */}
                        <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full bg-pink-100/40 blur-3xl pointer-events-none" />
                        <div className="absolute -bottom-24 -left-24 w-64 h-64 rounded-full bg-indigo-100/40 blur-3xl pointer-events-none" />

                        <div className="relative z-10">
                            <div className="text-indigo-600 font-black uppercase tracking-[0.25em] text-xs mb-4">
                                Protect Your Purchase
                            </div>

                            <h2 className="heading text-3xl md:text-4xl mb-4">
                                Don’t Buy a{" "}
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-pink-500">
                                    Problem Car
                                </span>
                            </h2>

                            <p className="subtext mb-8 max-w-xl mx-auto leading-relaxed">
                                A used car may look perfect—but hidden issues can
                                cost you lakhs later. Get it inspected before you
                                pay.
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
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="card-glass px-10 py-4 font-bold text-lg flex items-center justify-center gap-2 border border-slate-200 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                                >
                                    <span>💬</span>
                                    WhatsApp Expert
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}