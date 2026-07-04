// app/car-pdi-pune/CarPDIPuneClient.tsx

"use client";
import Link from "next/link";
import { useBooking } from "@/app/context/BookingContext";

export default function CarPDIPuneClient() {
    const { openNewCarBooking } = useBooking();

    return (
        <main className="bg-main text-slate-900 min-h-screen selection:bg-indigo-100 selection:text-indigo-700">
            {/* NAVBAR and CHATBOT are removed! They now render automatically from layout.tsx */}

            {/* HERO SECTION */}
            <section className="relative pt-40 pb-20 px-6 max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
                <div className="text-center lg:text-left slide-up">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full card-glass text-indigo-600 text-xs font-black uppercase tracking-widest mb-8 floating border-indigo-100">
                        📍 Expert Car PDI in Pune
                    </div>

                    <h1 className="heading text-5xl md:text-7xl leading-[0.95] mb-8">
                        Don’t Risk Your <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-pink-500">
                            New Car Delivery.
                        </span>
                    </h1>

                    <p className="subtext text-lg max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium mb-10">
                        Serving all major dealerships in Pune & PCMC. Get a professional
                        299+ point inspection before you sign the final papers and take delivery.
                        <br /><br />
                        Not sure what to check? Read our{" "}
                        <Link href="/car-delivery-checklist-pune" className="text-indigo-600 underline font-semibold">
                            car delivery checklist in Pune
                        </Link>.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                        <button
                            onClick={() => openNewCarBooking()}
                            className="btn-primary px-10 py-5 text-xl shadow-2xl"
                        >
                            Book Inspection
                        </button>

                        <a
                            href="https://wa.me/919975934213"
                            className="card-glass px-10 py-5 font-bold text-lg hover:bg-white transition-all flex items-center justify-center gap-2 border-slate-100"
                        >
                            <span className="text-xl">💬</span>
                            WhatsApp Us
                        </a>
                    </div>
                </div>

                {/* HERO IMAGE */}
                <div className="relative slide-up" style={{ animationDelay: "0.2s" }}>
                    <div className="relative rounded-[3rem] overflow-hidden border-8 border-white shadow-2xl group">
                        <img
                            src="/hero-car.jpg"
                            alt="Car inspection in Pune"
                            className="w-full h-[500px] object-cover transition duration-500 group-hover:scale-110"
                        />

                        <div className="absolute -bottom-6 -right-6 card-glass p-6 shadow-xl floating border-white">
                            <p className="text-indigo-600 font-black text-2xl">✔ 299+</p>
                            <p className="text-[10px] font-bold uppercase tracking-widest subtext">
                                Checks Performed
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* TRUST STATS */}
            <section className="py-16 px-6">
                <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-3 gap-6">
                    {[
                        { title: "1000+", desc: "Pune Deliveries Inspected" },
                        { title: "Same Day", desc: "Inspection & Report" },
                        { title: "4.9⭐", desc: "Customer Rating" },
                    ].map((item, i) => (
                        <div
                            key={i}
                            className="card-glass p-8 text-center card-hover slide-up border-slate-100"
                            style={{ animationDelay: `${i * 0.1}s` }}
                        >
                            <p className="text-3xl font-black text-indigo-600">
                                {item.title}
                            </p>
                            <p className="subtext text-[10px] font-bold uppercase tracking-widest mt-2">
                                {item.desc}
                            </p>
                        </div>
                    ))}
                </div>
            </section>

            {/* PROBLEM SECTION */}
            <section className="max-w-6xl mx-auto px-6 py-20">
                <h2 className="heading text-4xl text-center mb-16 slide-up">
                    Why PDI is Critical
                </h2>

                <div className="grid md:grid-cols-3 gap-8">
                    {[
                        {
                            title: "Transit Damage",
                            desc:
                                "New cars often suffer scratches or minor dents during trailer transport to Pune stockyards.",
                        },
                        {
                            title: "Repainted Panels",
                            desc:
                                "Dealer yard damage is often hidden with high-quality repainting that only experts can detect.",
                        },
                        {
                            title: "Electronic Faults",
                            desc:
                                "Modern cars rely on sensors; we perform a full OBD-II scan to find hidden error codes.",
                        },
                    ].map((item, i) => (
                        <div
                            key={i}
                            className="card-glass p-8 card-hover slide-up border-slate-100"
                            style={{ animationDelay: `${i * 0.1}s` }}
                        >
                            <div className="w-12 h-12 bg-indigo-50/50 rounded-xl flex items-center justify-center text-xl mb-6">
                                🛡️
                            </div>

                            <h3 className="font-bold text-xl mb-3">{item.title}</h3>
                            <p className="subtext text-sm leading-relaxed">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* TESTIMONIALS */}
            <section className="max-w-6xl mx-auto px-6 py-20">
                <div className="text-center mb-16 slide-up">
                    <h2 className="heading text-4xl">What Pune Buyers Say</h2>
                    <p className="subtext mt-4">Real feedback from local car owners.</p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {[
                        {
                            name: "Sandeep Jagdale",
                            r: "The team was professional, detailed, and transparent throughout the process. The inspection report was comprehensive and gave me confidence in understanding my car’s condition. Overall, an excellent experience, and I highly recommend their service 👍",
                        },
                        {
                            name: "Siddhesh Khule",
                            r: "Got PDI done for my second-hand WagonR from RK PDI Service before delivery. Very professional and thorough inspection. Clear explanation of car condition and honest feedback.",
                        },
                        {
                            name: "Swapnil Gore",
                            r: "The PDI inspection was very thorough, and I appreciated the detailed report highlighting all the checks performed. The inspector was very professional, courteous, and punctual.They explained the inspection process and findings clearly.The inspection report was very detailed, with photographs and explanations of each check."
                        },
                    ].map((item, i) => (
                        <div
                            key={i}
                            className="card-glass p-8 card-hover slide-up border-slate-100"
                            style={{ animationDelay: `${i * 0.1}s` }}
                        >
                            <div className="flex gap-1 text-amber-400 mb-4 text-xs">
                                {[...Array(5)].map((_, i) => (
                                    <span key={i}>★</span>
                                ))}
                            </div>

                            <p className="italic text-slate-600 mb-6 text-sm">
                                “{item.r}”
                            </p>

                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center font-bold text-xs text-indigo-600 uppercase">
                                    {item.name[0]}
                                </div>
                                <p className="font-bold text-sm text-slate-900">
                                    {item.name}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <section className="max-w-4xl mx-auto px-6 py-20">
                <h2 className="heading text-3xl mb-6">
                    Car Pre Delivery Inspection in Pune – Why It Matters
                </h2>

                <div className="space-y-4 subtext text-sm leading-relaxed">
                    <p>
                        A car pre-delivery inspection (PDI) in Pune ensures that your new car
                        is free from transit damage, repaint issues, and hidden defects before
                        you take delivery from the dealership.
                    </p>

                    <p>
                        Many vehicles arrive at Pune stockyards with minor scratches, dents,
                        or electronic faults that are often unnoticed during rushed deliveries.
                        A professional inspection helps you identify these issues early and
                        avoid future disputes.
                    </p>

                    <p>
                        Our expert team performs a detailed 299+ point inspection including
                        paint quality checks, OBD diagnostics, electrical systems, and physical
                        condition verification.
                    </p>

                    <p>
                        You can also explore our complete{" "}
                        <Link href="/pdi-checklist-for-new-car" className="text-indigo-600 underline font-semibold">
                            PDI checklist for new cars
                        </Link>{" "}
                        to understand everything we inspect.
                    </p>
                </div>
            </section>

            {/* FINAL CTA */}
            <section className="px-6 py-24 text-center">
                <div className="max-w-4xl mx-auto card-glass p-16 border-indigo-100 slide-up relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-600 to-blue-600" />

                    <h2 className="heading text-4xl mb-6">
                        Take Delivery with Confidence
                    </h2>

                    <p className="subtext mb-10 max-w-lg mx-auto leading-relaxed">
                        Don't risk your 10-50 Lakh investment. Book a professional
                        InspectMyCar PDI today and drive home a perfect car.
                    </p>

                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <button
                            onClick={() => openNewCarBooking()}
                            className="btn-primary px-12 py-4 shadow-xl"
                        >
                            Book Now
                        </button>

                        <a
                            href="tel:+919975934213"
                            className="card-glass px-12 py-4 font-bold border-slate-200"
                        >
                            📞 Call Expert
                        </a>
                    </div>
                </div>
            </section>

            {/* MOBILE STICKY BAR */}
            <div className="fixed bottom-0 left-0 right-0 md:hidden z-50 p-4 flex gap-3 bg-white/80 backdrop-blur-xl border-t border-white/50">
                <button
                    onClick={() => openNewCarBooking()}
                    className="flex-1 btn-primary py-4 text-sm font-black uppercase tracking-widest shadow-xl"
                >
                    Book PDI
                </button>

                <a
                    href="https://wa.me/919975934213"
                    className="flex-1 bg-green-500 text-white flex items-center justify-center rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl gap-2"
                >
                    <span className="text-xl">💬</span>
                    WhatsApp
                </a>
            </div>
            <section className="max-w-4xl mx-auto px-6 pb-20">
                <h2 className="heading text-3xl mb-8 text-center">
                    Frequently Asked Questions
                </h2>

                <div className="space-y-6">
                    {[
                        {
                            q: "Is car PDI necessary in Pune?",
                            a: "Yes. Many cars face transport or stockyard damage before delivery. A PDI helps detect these issues early.",
                        },
                        {
                            q: "When should I do PDI?",
                            a: "Always before making full payment or registering the car.",
                        },
                        {
                            q: "How long does inspection take?",
                            a: "Typically 1–2 hours depending on vehicle and checks required.",
                        },
                    ].map((item, i) => (
                        <div key={i} className="card-glass p-6 border-slate-100">
                            <h3 className="font-bold text-lg mb-2">{item.q}</h3>
                            <p className="subtext text-sm">{item.a}</p>
                        </div>
                    ))}
                </div>
            </section>
        </main>
    );
}