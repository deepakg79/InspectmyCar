import Link from "next/link";
import LocationsMapClient from "./LocationsMapClient";

export const metadata = {
    title: "Our Locations | InspectMyCar",
    description:
        "Find InspectMyCar vehicle inspection and new car PDI service locations across Maharashtra.",
};

const LOCATIONS = [
    {
        city: "Pune",
        slug: "pune",
    },
    {
        city: "Mumbai",
        slug: "mumbai",
    },
    {
        city: "Nashik",
        slug: "nashik",
    },
    {
        city: "Kolhapur",
        slug: "kolhapur",
    },
    {
        city: "Nagpur",
        slug: "nagpur",
    },
    {
        city: "Chhatrapati Sambhajinagar",
        slug: "chhatrapati-sambhajinagar",
    },
    {
        city: "Solapur",
        slug: "solapur",
    },
    {
        city: "Sangli",
        slug: "sangli",
    },
    {
        city: "Baramati",
        slug: "baramati",
    },
    {
        city: "Satara",
        slug: "satara",
    },
];

export default function LocationsPage() {
    return (
        <main className="bg-main min-h-screen">

            {/* =========================================================
                HERO
            ========================================================= */}

            <section className="px-6 pt-32 pb-20">

                <div className="max-w-6xl mx-auto text-center">

                    <p className="text-indigo-600 font-black uppercase tracking-[0.35em] text-xs mb-4">
                        MAHARASHTRA SERVICE LOCATIONS
                    </p>

                    <h1 className="heading text-5xl md:text-7xl mb-6">
                        InspectMyCar{" "}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-pink-500">
                            Locations
                        </span>
                    </h1>

                    <p className="subtext text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
                        Professional vehicle inspections and new car
                        pre-delivery inspections across major cities in
                        Maharashtra.
                    </p>

                    <div className="flex flex-wrap justify-center gap-3 mt-8">

                        <span className="card-glass rounded-full border border-indigo-100 px-5 py-2.5 text-sm font-bold text-slate-700">
                            📍 Maharashtra
                        </span>

                        <span className="card-glass rounded-full border border-indigo-100 px-5 py-2.5 text-sm font-bold text-slate-700">
                            🚗 Vehicle Inspection
                        </span>

                        <span className="card-glass rounded-full border border-indigo-100 px-5 py-2.5 text-sm font-bold text-slate-700">
                            🔍 New Car PDI
                        </span>

                    </div>

                </div>

            </section>

            {/* =========================================================
                MAP
            ========================================================= */}

            <section className="px-6 pb-24">

                <div className="max-w-7xl mx-auto">

                    <div className="text-center mb-12">

                        <p className="text-indigo-600 font-black uppercase tracking-[0.35em] text-xs mb-3">
                            SERVICE NETWORK
                        </p>

                        <h2 className="heading text-4xl md:text-5xl">
                            Find an Inspection Location
                        </h2>

                        <p className="subtext mt-4 max-w-3xl mx-auto">
                            Explore our service locations on the map. Select
                            any marker to view the city and inspection service
                            details.
                        </p>

                    </div>

                    <div className="card-glass overflow-hidden rounded-[2rem] border border-slate-100 p-2 shadow-xl">

                        <div className="overflow-hidden rounded-[1.5rem]">
                            <LocationsMapClient />
                        </div>

                    </div>

                </div>

            </section>

            {/* =========================================================
                SERVICE CITIES
            ========================================================= */}

            <section className="px-6 pb-24">

                <div className="max-w-7xl mx-auto">

                    <div className="text-center mb-14">

                        <p className="text-indigo-600 font-black uppercase tracking-[0.35em] text-xs mb-3">
                            MAHARASHTRA
                        </p>

                        <h2 className="heading text-4xl md:text-5xl">
                            Our Service Cities
                        </h2>

                        <p className="subtext mx-auto mt-4 max-w-2xl">
                            Choose your city to explore available vehicle
                            inspection and PDI services.
                        </p>

                    </div>

                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">

                        {LOCATIONS.map((location, index) => (
                            <Link
                                key={location.slug}
                                href={`/${location.slug}/car-pdi`}
                                className="card-glass group relative overflow-hidden rounded-3xl border border-slate-100 p-6 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
                            >

                                {/* Gradient accent */}

                                <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-indigo-600 to-pink-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                                <div className="flex items-start justify-between">

                                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-100 text-2xl transition-transform duration-300 group-hover:scale-110">
                                        📍
                                    </div>

                                    <span className="text-4xl font-black text-slate-100">
                                        {String(index + 1).padStart(2, "0")}
                                    </span>

                                </div>

                                <div className="mt-6">

                                    <h3 className="heading text-xl transition-colors duration-300 group-hover:text-indigo-600">
                                        {location.city}
                                    </h3>

                                    <p className="subtext mt-2 text-sm">
                                        Vehicle Inspection &amp; PDI
                                    </p>

                                </div>

                                <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">

                                    <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                                        Explore
                                    </span>

                                    <span className="text-lg text-indigo-500 transition-transform duration-300 group-hover:translate-x-1">
                                        →
                                    </span>

                                </div>

                            </Link>
                        ))}

                    </div>

                    {/* MORE LOCATIONS */}

                    <div className="flex justify-center mt-10">

                        <div className="card-glass inline-flex items-center gap-3 rounded-full border border-indigo-100 px-6 py-3 shadow-sm">

                            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-600 text-sm font-bold text-white">
                                +
                            </span>

                            <span className="text-sm font-bold text-indigo-700">
                                Many more locations coming soon
                            </span>

                        </div>

                    </div>

                </div>

            </section>

            {/* =========================================================
                WHY OUR LOCATIONS
            ========================================================= */}

            <section className="px-6 pb-24">

                <div className="max-w-7xl mx-auto">

                    <div className="text-center mb-12">

                        <p className="text-indigo-600 font-black uppercase tracking-[0.35em] text-xs mb-3">
                            INSPECTMYCAR
                        </p>

                        <h2 className="heading text-4xl md:text-5xl">
                            Professional Inspection Wherever You Need It
                        </h2>

                        <p className="subtext mx-auto mt-4 max-w-3xl">
                            Our inspectors can perform vehicle inspections at
                            convenient locations across our service network.
                        </p>

                    </div>

                    <div className="grid gap-6 md:grid-cols-3">

                        {[
                            {
                                icon: "🔍",
                                title: "Detailed Inspection",
                                text: "A structured inspection covering the major mechanical, electrical, exterior, interior, safety and tyre systems.",
                            },
                            {
                                icon: "📸",
                                title: "Photo Evidence",
                                text: "Important findings can be supported with photographs and measurements recorded during the inspection.",
                            },
                            {
                                icon: "📄",
                                title: "Digital Report",
                                text: "Receive a detailed digital report containing findings, observations, scores and recommendations.",
                            },
                        ].map((item) => (
                            <div
                                key={item.title}
                                className="card-glass rounded-3xl border border-slate-100 p-8 text-center shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
                            >

                                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-100 text-3xl">
                                    {item.icon}
                                </div>

                                <h3 className="heading mt-6 text-xl">
                                    {item.title}
                                </h3>

                                <p className="subtext mt-3 text-sm leading-6">
                                    {item.text}
                                </p>

                            </div>
                        ))}

                    </div>

                </div>

            </section>

            {/* =========================================================
                CTA
            ========================================================= */}

            <section className="px-6 pb-28">

                <div className="max-w-5xl mx-auto card-glass rounded-[2rem] p-10 md:p-14 border border-indigo-100 relative overflow-hidden text-center">

                    {/* Gradient top border */}

                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-600 to-pink-500" />

                    {/* Decorative glow */}

                    <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-indigo-100/40 blur-3xl" />

                    <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-pink-100/40 blur-3xl" />

                    <div className="relative">

                        <span className="text-indigo-600 font-black uppercase tracking-[0.35em] text-xs">
                            READY TO INSPECT?
                        </span>

                        <h2 className="heading text-4xl md:text-5xl mt-4 mb-6">
                            Buying a New or
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-pink-500">
                                {" "}Used Car?
                            </span>
                        </h2>

                        <p className="subtext mx-auto max-w-2xl mb-10 text-lg leading-relaxed">
                            Get a professional vehicle inspection before you
                            make your purchase decision.
                        </p>

                        <Link
                            href="/"
                            className="btn-primary inline-flex px-10 py-5 text-lg shadow-xl"
                        >
                            Book an Inspection
                        </Link>

                    </div>

                </div>

            </section>

        </main>
    );
}