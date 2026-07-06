"use client";

import Link from "next/link";

const BRANDS = [
    "Tata",
    "Mahindra",
    "Hyundai",
    "Kia",
    "Maruti",
    "Toyota",
    "Skoda",
    "Volkswagen",
];

const AREAS = [
    "Baner",
    "Hinjewadi",
    "Wakad",
    "Kharadi",
    "Hadapsar",
    "Kothrud",
    "Pimple Saudagar",
    "Viman Nagar",
    "Aundh",
    "Chinchwad",
];

export default function Footer() {
    return (
        <footer className="relative mt-24 bg-white/40 backdrop-blur-xl border-t border-white/60">

            {/* TOP GLOW LINE */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-[2px] bg-gradient-to-r from-transparent via-indigo-500/60 to-transparent" />

            <div className="max-w-6xl mx-auto px-6 pt-16 pb-10">

                {/* BRAND SEO LINKS */}
                <div className="mb-10 pb-6 border-b border-slate-100">
                    <h4 className="text-[11px] font-bold uppercase tracking-[0.25em] text-slate-400 mb-6 text-center md:text-left">
                        PDI Inspection by Brand in Pune
                    </h4>

                    <div className="flex flex-wrap justify-center md:justify-start gap-3">
                        {BRANDS.map((brand) => (
                            <Link
                                key={brand}
                                href={`/pdi/${brand.toLowerCase()}-pune`}
                                className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-[12px] font-semibold text-slate-600 hover:border-indigo-600 hover:text-indigo-600 hover:shadow-md transition-all"
                            >
                                {brand} PDI Pune
                            </Link>
                        ))}
                    </div>
                </div>

                {/* PRICING HIGHLIGHT */}
                <div className="text-center mb-14">
                    <p className="text-sm font-medium text-slate-600">
                        Prices start at{" "}
                        <span className="font-black text-indigo-600">₹1,299</span> for
                        standard cars and{" "}
                        <span className="font-black text-pink-500">₹2,499</span> for luxury
                        vehicles.
                    </p>
                </div>

                {/* GRID */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12">

                    {/* BRAND */}
                    <div>
                        <Link href="/" className="flex items-center gap-2 mb-6 group">
                            <div className="bg-indigo-600 p-2 rounded-xl group-hover:rotate-6 transition-transform">
                                <div className="w-5 h-5 border-2 border-white rounded-sm flex items-center justify-center text-white font-black text-xs">
                                    I
                                </div>
                            </div>
                            <span className="font-black text-xl tracking-tight text-slate-900 uppercase">
                                Inspect<span className="text-indigo-600">MyCar</span>
                            </span>
                        </Link>

                        <p className="text-slate-500 text-sm leading-relaxed">
                            Pune’s trusted independent car inspection service. We perform a
                            detailed <strong>299+ point PDI</strong> so you take delivery of a
                            perfect car.
                        </p>

                        {/* CONTACT */}
                        <div className="mt-6 space-y-2 text-sm">
                            <a href="tel:+919975934213" className="block font-semibold text-slate-700 hover:text-indigo-600">
                                📞 +91 99759 34213
                            </a>
                            <a href="https://wa.me/919975934213" className="block font-semibold text-green-600">
                                💬 WhatsApp Chat
                            </a>
                        </div>
                    </div>

                    {/* SERVICES */}
                    <div>
                        <h4 className="font-bold text-slate-900 mb-6 text-sm uppercase tracking-widest">
                            Services
                        </h4>

                        <ul className="space-y-3 text-sm text-slate-500">
                            <li>
                                <Link href="/car-pdi-pune" className="hover:text-indigo-600">
                                    Car PDI Pune
                                </Link>
                            </li>
                            <li>
                                <Link href="/how-it-works" className="hover:text-indigo-600">
                                    How It Works
                                </Link>
                            </li>
                            <li>
                                <Link href="/info/pricing" className="hover:text-indigo-600">
                                    Pricing
                                </Link>
                            </li>
                            <li>
                                <Link href="/cancellation" className="hover:text-indigo-600">
                                    Cancellation Policy
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* GUIDES */}
                    <div>
                        <h4 className="font-bold text-slate-900 mb-6 text-sm uppercase tracking-widest">
                            Guides
                        </h4>

                        <ul className="space-y-3 text-sm text-slate-500">
                            <li>
                                <Link href="/pdi-checklist-for-new-car" className="hover:text-indigo-600">
                                    PDI Checklist
                                </Link>
                            </li>
                            <li>
                                <Link href="/car-delivery-checklist-pune" className="hover:text-indigo-600">
                                    Delivery Checklist
                                </Link>
                            </li>
                            <li>
                                <Link href="/top-10-mistakes-while-buying-car-in-pune" className="hover:text-indigo-600">
                                    Buying Mistakes Guide
                                </Link>
                            </li>
                            <li>
                                <Link href="/faqs" className="hover:text-indigo-600">
                                    FAQs
                                </Link>
                            </li>
                            <li>
                                <Link href="/blogs" className="hover:text-indigo-600">
                                    Blogs
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* SERVICE AREAS */}
                    <div>
                        <h4 className="font-bold text-slate-900 mb-6 text-sm uppercase tracking-widest">
                            Service Areas in Pune
                        </h4>

                        <div className="flex flex-wrap gap-2">
                            {AREAS.map((area) => (
                                <span
                                    key={area}
                                    className="text-xs bg-white px-2 py-1 rounded-md border border-slate-200 text-slate-500"
                                >
                                    {area}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* BOTTOM */}
                <div className="mt-16 pt-8 border-t border-slate-100 flex flex-col items-center justify-center gap-4 text-center">

                    <div className="text-xs text-slate-400 font-medium space-y-1">
                        <p>
                            © {new Date().getFullYear()} InspectMyCar • Independent PDI Experts in Pune
                        </p>
                        <p>
                            Site developed &amp; maintained by{" "}
                            <a
                                href="https://3dvishwa.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-semibold text-indigo-600 hover:text-indigo-700 hover:underline transition"
                            >
                                3dVishwa Software Solutions
                            </a>
                        </p>
                    </div>

                    <div className="flex gap-6 text-xs text-slate-400 font-medium">
                        <Link href="/privacy" className="hover:text-slate-900">
                            Privacy
                        </Link>
                        <Link href="/terms" className="hover:text-slate-900">
                            Terms
                        </Link>
                    </div>

                </div>
            </div>
        </footer>
    );
}