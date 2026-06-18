import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Top 10 Mistakes to Avoid While Buying a Car in Pune (2026 Guide)",
    description:
        "Buying a new car in Pune? Avoid these 10 costly mistakes most buyers make. Learn why PDI inspection is critical before delivery.",
    alternates: {
        canonical: "https://inspectmycar.in/top-10-mistakes-while-buying-car-in-pune",
    },
    openGraph: {
        title: "Top 10 Mistakes While Buying a Car in Pune",
        description:
            "Avoid costly mistakes when buying a new car in Pune. Learn why PDI inspection is critical.",
        url: "https://inspectmycar.in/top-10-mistakes-while-buying-car-in-pune",
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
            title: "Skipping Pre-Delivery Inspection",
            desc: "New cars can still have transit damage, repaint issues, or battery problems.",
            highlight: true,
        },
        {
            title: "Trusting dealership blindly",
            desc: "Dealers may rush delivery or hide minor defects. Always verify independently.",
        },
        {
            title: "Not checking manufacturing date",
            desc: "Older stock (3–6 months) may have battery degradation and lower resale value.",
        },
        {
            title: "Ignoring paint quality",
            desc: "Repainted panels and scratches are common and hard to detect without tools.",
        },
        {
            title: "Not checking electronics",
            desc: "Test infotainment, sensors, cameras, and warning systems thoroughly.",
        },
        {
            title: "Skipping underbody inspection",
            desc: "Hidden rust, leaks, or transport damage can go unnoticed.",
        },
        {
            title: "Accepting rushed delivery",
            desc: "Dealer pressure is a red flag. Always take your time.",
        },
        {
            title: "Not verifying VIN & documents",
            desc: "Ensure VIN, engine number, and insurance match.",
        },
        {
            title: "Ignoring test drive before delivery",
            desc: "Check alignment, brakes, and unusual noise.",
        },
        {
            title: "Not hiring a professional inspector",
            desc: "Experts detect hidden issues using tools and experience.",
        },
    ];

    const faqs = [
        {
            q: "Why is Pre-Delivery Inspection (PDI) important?",
            a: "PDI ensures your new car is free from hidden damages, repaint issues, or mechanical defects before taking delivery.",
        },
        {
            q: "Can I do PDI myself?",
            a: "Yes, but professional inspectors can detect subtle issues like hidden scratches, sensor faults, or alignment problems more reliably.",
        },
        {
            q: "Is PDI mandatory in Pune?",
            a: "No, but skipping it may cost you in repairs or hidden defects. Most buyers find it highly recommended.",
        },
    ];

    return (
        <main className="bg-main text-slate-900 min-h-screen">

            {/* HERO */}
            <section className="max-w-4xl mx-auto px-6 pt-32 pb-12 text-center">
                <h1 className="heading text-4xl md:text-6xl leading-tight mb-6">
                    Top 10 Mistakes While Buying a Car in Pune
                </h1>

                <p className="subtext text-lg leading-relaxed max-w-3xl mx-auto">
                    Buying a new car in Pune is exciting — but many buyers make costly mistakes that can lead to hidden damages, extra expenses, or long-term issues.
                </p>

                <p className="subtext text-lg mt-4">
                    Here are the <b>top 10 mistakes you must avoid</b> before taking delivery.
                </p>
            </section>

            {/* LIST */}
            <section className="max-w-4xl mx-auto px-6 pb-20 space-y-8">
                {mistakes.map((item, i) => (
                    <div
                        key={i}
                        className={`card-glass p-6 rounded-2xl border border-slate-100 shadow-sm ${item.highlight ? "border-indigo-200 bg-indigo-50/40" : ""
                            }`}
                    >
                        <h2 className="font-bold text-xl mb-2">
                            ❌ {i + 1}. {item.title}
                        </h2>

                        <p className="subtext leading-relaxed">{item.desc}</p>

                        {item.highlight && (
                            <Link
                                href="/car-pdi-pune"
                                className="inline-block mt-3 text-indigo-600 font-bold underline"
                            >
                                👉 Get Car PDI in Pune →
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
                        <div key={i} className="card-glass p-6 border border-slate-100 rounded-xl">
                            <h3 className="font-bold text-lg mb-2">{faq.q}</h3>
                            <p className="subtext text-sm">{faq.a}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* STRONG CTA */}
            <section className="px-6 pb-24">
                <div className="max-w-4xl mx-auto text-center card-glass p-14 rounded-3xl border border-indigo-100 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-600 to-pink-500" />

                    <h2 className="heading text-3xl md:text-4xl mb-6">
                        Don’t Risk Your New Car Delivery
                    </h2>

                    <p className="subtext mb-8 max-w-xl mx-auto leading-relaxed">
                        A professional <b>200+ point PDI inspection</b> can save you from hidden damages, repaint issues, and costly repairs.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href="/book"
                            className="btn-primary px-10 py-4 text-lg shadow-xl"
                        >
                            Book Inspection
                        </Link>

                        <Link
                            href="/car-delivery-checklist-pune"
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