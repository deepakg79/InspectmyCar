import Link from "next/link";

export const metadata = {
    title: "Car Delivery Checklist Pune (2026) | Avoid Costly Mistakes",
    description:
        "Complete car delivery checklist in Pune before taking delivery. Avoid scratches, repaint issues & dealer tricks. Expert PDI guide by InspectMyCar.",
    keywords: [
        "car delivery checklist pune",
        "new car pdi checklist india",
        "car inspection before delivery pune",
        "pdi checklist new car",
    ],
};

export default function CarDeliveryChecklistPune() {
    return (
        <main className="bg-main text-slate-900 min-h-screen">

            {/* HERO */}
            <section className="px-6 pt-32 pb-16 max-w-5xl mx-auto text-center">
                <h1 className="heading text-4xl md:text-6xl mb-6 leading-tight">
                    Car Delivery Checklist in Pune
                    <span className="block text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-pink-500">
                        (2026 Guide)
                    </span>
                </h1>

                <p className="subtext text-lg max-w-3xl mx-auto leading-relaxed">
                    Taking delivery of your new car in Pune? Before signing the final papers,
                    use this expert checklist to avoid hidden damages, repaint issues,
                    and costly mistakes.
                    <br /><br />
                    For a professional inspection, check our{" "}
                    <Link href="/car-pdi-pune" className="text-indigo-600 font-semibold underline">
                        car PDI service in Pune
                    </Link>.
                </p>
            </section>

            {/* WHY IMPORTANT */}
            <section className="px-6 pb-16 max-w-5xl mx-auto">
                <h2 className="heading text-2xl mb-6">
                    Why Car Delivery Inspection is Important in Pune
                </h2>

                <p className="subtext leading-relaxed">
                    Many new cars in Pune dealerships arrive with minor transport damage,
                    repaint jobs, or storage-related issues. Without a proper inspection,
                    customers often discover problems only after delivery. A proper PDI
                    ensures you receive a flawless vehicle before signing final documents.
                </p>
            </section>

            {/* CHECKLIST */}
            <section className="px-6 pb-20 max-w-5xl mx-auto space-y-12">

                {[
                    {
                        title: "Before Visiting Dealership",
                        items: [
                            "Confirm VIN number with dealer",
                            "Ask for stockyard inspection access",
                            "Avoid full payment before PDI",
                        ],
                    },
                    {
                        title: "At the Dealership",
                        items: [
                            "Inspect car in proper daylight",
                            "Do not accept a washed or wet car",
                            "Check manufacturing date (fresh stock)",
                            "Verify all accessories installed",
                        ],
                    },
                    {
                        title: "Test Everything",
                        items: [
                            "Start engine (no abnormal noise)",
                            "Check horn, lights, indicators",
                            "Test AC & infotainment system",
                            "Inspect reverse camera & sensors",
                        ],
                    },
                    {
                        title: "Documents to Verify",
                        items: [
                            "Invoice copy matches VIN",
                            "Insurance policy details",
                            "Form 20 & Form 21",
                            "Temporary registration papers",
                        ],
                    },
                    {
                        title: "Common Mistakes to Avoid",
                        items: [
                            "Skipping PDI inspection",
                            "Trusting dealer blindly",
                            "Ignoring repaint or panel mismatch",
                            "Accepting minor damages",
                        ],
                        danger: true,
                    },
                ].map((section, i) => (
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
                <h2 className="heading text-2xl mb-6">
                    Frequently Asked Questions
                </h2>

                <div className="space-y-6">
                    <div>
                        <h3 className="font-bold">
                            Is PDI necessary before car delivery?
                        </h3>
                        <p className="subtext">
                            Yes, a pre-delivery inspection helps detect damages,
                            repaint issues, or manufacturing defects before you
                            accept the car.
                        </p>
                    </div>

                    <div>
                        <h3 className="font-bold">
                            Can I inspect my car before full payment?
                        </h3>
                        <p className="subtext">
                            Yes, you should always inspect the car before making
                            full payment to avoid risk.
                        </p>
                    </div>

                    <div>
                        <h3 className="font-bold">
                            Do dealers allow PDI in Pune?
                        </h3>
                        <p className="subtext">
                            Most dealerships allow inspection, especially if you
                            inform them in advance.
                        </p>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="px-6 pb-28">
                <div className="max-w-4xl mx-auto text-center card-glass p-14 rounded-3xl border border-indigo-100 relative overflow-hidden">

                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-600 to-pink-500" />

                    <h2 className="heading text-3xl md:text-4xl mb-6">
                        Don’t Risk Your New Car Delivery
                    </h2>

                    <p className="subtext mb-8 max-w-xl mx-auto leading-relaxed">
                        Our experts perform a <b>299+ point professional PDI</b>.
                        <br />
                        <span className="text-red-500 font-semibold">
                            1 in 5 new cars we inspect has hidden issues.
                        </span>
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href="/book"
                            className="btn-primary px-10 py-4 text-lg shadow-xl"
                        >
                            Book Inspection
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

            {/* FAQ SCHEMA */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "FAQPage",
                        mainEntity: [
                            {
                                "@type": "Question",
                                name: "Is PDI necessary before car delivery?",
                                acceptedAnswer: {
                                    "@type": "Answer",
                                    text: "Yes, a pre-delivery inspection helps detect damages before delivery.",
                                },
                            },
                            {
                                "@type": "Question",
                                name: "Can I inspect my car before full payment?",
                                acceptedAnswer: {
                                    "@type": "Answer",
                                    text: "Yes, you should always inspect before full payment.",
                                },
                            },
                            {
                                "@type": "Question",
                                name: "Do dealers allow PDI in Pune?",
                                acceptedAnswer: {
                                    "@type": "Answer",
                                    text: "Most dealerships allow inspection if informed in advance.",
                                },
                            },
                        ],
                    }),
                }}
            />

        </main>
    );
}