import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Top 10 Mistakes to Avoid While Buying a Used Car in Pune (2026 Guide)",
    description:
        "Buying a used car in Pune? Avoid these 10 costly mistakes buyers make. Learn how proper used car inspection can save you from hidden accident damage and fraud.",
    alternates: {
        canonical: "https://inspectmycar.in/used-cars/buying-guide",
    },
    openGraph: {
        title: "Top 10 Mistakes While Buying a Used Car in Pune",
        description:
            "Avoid costly mistakes when buying a used car in Pune. Learn what to check before purchase.",
        url: "https://inspectmycar.in/used-cars/buying-guide",
        siteName: "InspectMyCar",
        images: [
            {
                url: "/og-image.jpg",
                width: 1200,
                height: 630,
            },
        ],
        locale: "en_IN",
        type: "article",
    },
};

export default function Page() {
    const mistakes = [
        {
            title: "Skipping Used Car Inspection",
            desc: "Most used cars hide accident repairs, repainting, or mechanical wear that is not visible to the naked eye.",
            highlight: true,
        },
        {
            title: "Trusting seller without verification",
            desc: "Private sellers and dealers may hide issues. Always verify independently before payment.",
        },
        {
            title: "Not checking accident history",
            desc: "Many cars have repaired structural damage that affects safety and resale value.",
        },
        {
            title: "Ignoring repaint & body work",
            desc: "Repainted panels indicate past damage or accidents and reduce vehicle value.",
        },
        {
            title: "Not scanning ECU / OBD errors",
            desc: "Hidden electronic faults can only be detected using diagnostic tools.",
        },
        {
            title: "Skipping test drive",
            desc: "You must check engine noise, clutch condition, brakes, and suspension behavior.",
        },
        {
            title: "Ignoring tyre and suspension wear",
            desc: "Uneven tyre wear or weak suspension indicates poor maintenance or accident history.",
        },
        {
            title: "Not verifying documents properly",
            desc: "RC, insurance, loan clearance, and chassis number must match perfectly.",
        },
        {
            title: "Buying without service history",
            desc: "A missing service record often means poor maintenance or tampered odometer.",
        },
        {
            title: "Not hiring a professional inspector",
            desc: "Experts detect flood damage, chassis issues, and hidden repairs using tools and experience.",
        },
    ];

    const faqs = [
        {
            q: "Is inspection necessary for used cars?",
            a: "Yes. Used cars often have hidden accident repairs, engine issues, or flood damage that are not visible during normal viewing.",
        },
        {
            q: "Can I trust dealer-certified used cars?",
            a: "Not fully. Even certified cars can have cosmetic repairs or missed mechanical issues.",
        },
        {
            q: "What is checked in a used car inspection?",
            a: "Engine health, accident history, repaint detection, chassis condition, OBD scan, suspension, and documents.",
        },
    ];

    return (
        <main className="bg-main text-slate-900 min-h-screen">

            {/* HERO */}
            <section className="max-w-4xl mx-auto px-6 pt-32 pb-12 text-center">
                <h1 className="heading text-4xl md:text-6xl leading-tight mb-6">
                    Top 10 Mistakes While Buying a Used Car in Pune
                </h1>

                <p className="subtext text-lg leading-relaxed max-w-3xl mx-auto">
                    Buying a used car can save money — but only if you avoid hidden accidents, tampered meters, and mechanical surprises.
                </p>

                <p className="subtext text-lg mt-4">
                    Here are the <b>most common mistakes buyers make in Pune</b>.
                </p>
            </section>

            {/* LIST */}
            <section className="max-w-4xl mx-auto px-6 pb-20 space-y-8">
                {mistakes.map((item, i) => (
                    <div
                        key={i}
                        className={`card-glass p-6 rounded-2xl border shadow-sm transition ${item.highlight
                                ? "border-indigo-200 bg-indigo-50/40"
                                : "border-slate-100"
                            }`}
                    >
                        <h2 className="font-bold text-xl mb-2">
                            ❌ {i + 1}. {item.title}
                        </h2>

                        <p className="subtext leading-relaxed">{item.desc}</p>

                        {item.highlight && (
                            <Link
                                href="/used-cars/pdi-pune"
                                className="inline-block mt-3 text-indigo-600 font-bold underline"
                            >
                                👉 Get Used Car Inspection in Pune →
                            </Link>
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
                            <h3 className="font-bold text-lg mb-2">{faq.q}</h3>
                            <p className="subtext text-sm">{faq.a}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA */}
            <section className="px-6 pb-24">
                <div className="max-w-4xl mx-auto text-center card-glass p-14 rounded-3xl border border-indigo-100 relative overflow-hidden">

                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-600 to-pink-500" />

                    <h2 className="heading text-3xl md:text-4xl mb-6">
                        Don’t Buy a Used Car Blindly
                    </h2>

                    <p className="subtext mb-8 max-w-xl mx-auto leading-relaxed">
                        A professional used car inspection can uncover accident history, engine issues, and hidden repairs before you pay.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href="/used-cars/pdi-pune"
                            className="btn-primary px-10 py-4 text-lg shadow-xl"
                        >
                            Book Inspection
                        </Link>

                        <Link
                            href="/used-cars/checklist"
                            className="card-glass px-10 py-4 font-bold text-lg border border-slate-200"
                        >
                            View Checklist
                        </Link>
                    </div>
                </div>
            </section>
        </main>
    );
}