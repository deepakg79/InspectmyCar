"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
    getCities,
    getSelectedCity,
} from "@/app/components/city_price";

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

const SERVICE_AREAS: Record<string, string[]> = {
    Pune: [
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
    ],

    Kolhapur: [
        "Rajaram Puri",
        "Shahupuri",
        "Uchgaon",
        "Kadamwadi",
        "Shivaji Udyam Nagar",
    ],

    Mumbai: [
        "Andheri",
        "Borivali",
        "Kandivali",
        "Goregaon",
        "Malad",
        "Vashi",
        "Sanpada",
        "Prabhadevi",
        "Lower Parel",
        "Chembur",
        "Ghatkopar",
        "Thane",
        "Worli",
        "Dadar",
        "Kharghar",
        "Panvel",
        "Vasai",
        "Virar",
    ],

    ChhatrapatiSambhajinagar: [
        "CIDCO",
        "Jalana Road",
        "Beed Bypass Road",
        "Shendra",
        "Chikhalthana MIDC",
    ],

    Nashik: [
        "Ambad",
        "Trimbak Road",
        "Satpur MIDC",
        "Ambedkar Nagar",
        "Indira Nagar",
        "College Road",
        "CIDCO",
    ],

    Solapur: [
        "Vijapur Road",
        "Hotagi Road",
        "Sadar Bazar",
        "Navi Peth",
    ],

    Baramati: [
        "Baramati MIDC",
        "Phaltan",
        "Vidyanagari",
        "Kasaba",
    ],

    Satara: [
        "Vadhe Phata",
        "Bombay Restaurant",
        "Satara MIDC",
        "Godoli",
        "Powai Naka",
        "Rajwada",
    ],

    Sangli: [
        "Vishrambag",
        "Kupwad",
        "Miraj MIDC",
    ],

    Nagpur: [
        "Nagpur",
    ],
};

const getCityDisplayName = (city: string) => {
    if (city === "ChhatrapatiSambhajinagar") {
        return "Chhatrapati Sambhajinagar";
    }

    return city;
};

const CITY_SLUGS: Record<string, string> = {
    pune: "Pune",
    mumbai: "Mumbai",
    nashik: "Nashik",
    kolhapur: "Kolhapur",
    nagpur: "Nagpur",
    "chhatrapati-sambhajinagar":
        "ChhatrapatiSambhajinagar",
    solapur: "Solapur",
    sangli: "Sangli",
    baramati: "Baramati",
    satara: "Satara",
};

const getCitySlug = (city: string): string => {
    if (city === "ChhatrapatiSambhajinagar") {
        return "chhatrapati-sambhajinagar";
    }

    return city
        .trim()
        .toLowerCase()
        .replace(/\s+/g, "-");
};

const getCityFromPathname = (
    pathname: string
): string | null => {
    const parts = pathname
        .split("/")
        .filter(Boolean)
        .map((part) =>
            decodeURIComponent(part).toLowerCase()
        );

    /*
     * Brand PDI pages
     *
     * Examples:
     * /pdi/tata-pune
     * /pdi/mahindra-satara
     * /pdi/hyundai-mumbai
     */
    if (
        parts.length === 2 &&
        parts[0] === "pdi"
    ) {
        const brandCitySlug = parts[1];

        const matchedCitySlug =
            Object.keys(CITY_SLUGS).find(
                (citySlug) =>
                    brandCitySlug === citySlug ||
                    brandCitySlug.endsWith(
                        `-${citySlug}`
                    )
            );

        if (matchedCitySlug) {
            return CITY_SLUGS[matchedCitySlug];
        }
    }

    /*
     * City PDI pages
     *
     * Examples:
     * /pune/car-pdi
     * /satara/car-pdi
     * /mumbai/car-pdi
     */
    if (
        parts.length === 2 &&
        parts[1] === "car-pdi"
    ) {
        const city =
            CITY_SLUGS[parts[0]];

        if (city) {
            return city;
        }
    }

    /*
     * Direct city pages
     *
     * Examples:
     * /pune
     * /satara
     */
    if (parts.length === 1) {
        const city =
            CITY_SLUGS[parts[0]];

        if (city) {
            return city;
        }
    }

    return null;
};

export default function Footer() {
    const pathname = usePathname();

    const [selectedCity, setSelectedCity] =
        useState("Pune");

    const [urlCity, setUrlCity] =
        useState<string | null>(null);

    useEffect(() => {
        /*
         * First determine whether the current URL
         * contains a city.
         */
        const cityFromUrl =
            getCityFromPathname(pathname);

        setUrlCity(cityFromUrl);

        if (cityFromUrl) {
            setSelectedCity(cityFromUrl);
        } else {
            /*
             * If the URL doesn't contain a city,
             * use the city selected/saved by the user.
             */
            const savedCity =
                getSelectedCity();

            if (savedCity) {
                setSelectedCity(savedCity);
            }
        }

        /*
         * Listen for city changes made by the
         * homepage city selector.
         *
         * page.tsx dispatches:
         *
         * window.dispatchEvent(
         *     new CustomEvent("cityChanged", {
         *         detail: nextCity,
         *     })
         * );
         */
        const handleCityChanged = (
            event: Event
        ) => {
            const customEvent =
                event as CustomEvent<string>;

            const nextCity =
                customEvent.detail;

            if (!nextCity) {
                return;
            }

            /*
             * If the user manually changes the city,
             * immediately refresh the footer state.
             */
            setSelectedCity(nextCity);

            /*
             * Clear URL override so the newly selected
             * homepage city becomes the effective city.
             */
            setUrlCity(null);
        };

        window.addEventListener(
            "cityChanged",
            handleCityChanged
        );

        return () => {
            window.removeEventListener(
                "cityChanged",
                handleCityChanged
            );
        };
    }, [pathname]);

    /*
     * URL city has priority when visiting a city-specific
     * page such as:
     *
     * /pdi/mahindra-satara
     * /satara/car-pdi
     *
     * Otherwise use the selected city.
     */
    const effectiveCity =
        urlCity || selectedCity;

    const areas =
        SERVICE_AREAS[effectiveCity] || [];

    const cities = getCities();

    const selectedCityDisplay =
        getCityDisplayName(effectiveCity);

    const selectedCitySlug =
        getCitySlug(effectiveCity);

    return (
        <footer className="relative mt-24 border-t border-white/60 bg-white/40 backdrop-blur-xl">

            <div className="absolute left-1/2 top-0 h-[2px] w-full max-w-5xl -translate-x-1/2 bg-gradient-to-r from-transparent via-indigo-500/60 to-transparent" />

            <div className="mx-auto max-w-6xl px-6 pb-10 pt-16">

                {/* =====================================================
                    BRAND PDI LINKS
                ===================================================== */}

                <div className="mb-10 border-b border-slate-100 pb-6">

                    <h4 className="mb-6 text-center text-[11px] font-bold uppercase tracking-[0.25em] text-slate-400 md:text-left">
                        PDI Inspection by Brand in{" "}
                        {selectedCityDisplay.toLowerCase()}
                    </h4>

                    <div className="flex flex-wrap justify-center gap-3 md:justify-start">

                        {BRANDS.map((brand) => (
                            <Link
                                key={brand}
                                href={`/pdi/${brand
                                    .toLowerCase()
                                    .replace(/\s+/g, "-")}-${selectedCitySlug}`}
                                className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-[12px] font-semibold text-slate-600 transition-all hover:border-indigo-600 hover:text-indigo-600 hover:shadow-md"
                            >
                                {brand} PDI{" "}
                                {selectedCityDisplay.toLowerCase()}
                            </Link>
                        ))}

                    </div>

                </div>

                {/* =====================================================
                    PRICE SUMMARY
                ===================================================== */}

                <div className="mb-14 text-center">

                    <p className="text-sm font-medium text-slate-600">

                        Prices start at{" "}

                        <span className="font-black text-indigo-600">
                            ₹1,299
                        </span>

                        {" "}for standard cars and{" "}

                        <span className="font-black text-pink-500">
                            ₹2,499
                        </span>

                        {" "}for luxury vehicles.

                    </p>

                </div>

                {/* =====================================================
                    MAIN FOOTER GRID
                ===================================================== */}

                <div className="grid grid-cols-1 gap-12 md:grid-cols-4">

                    {/* BRAND */}

                    <div>

                        <Link
                            href="/"
                            className="group mb-6 flex items-center gap-2"
                        >

                            <div className="rounded-xl bg-indigo-600 p-2 transition-transform group-hover:rotate-6">

                                <div className="flex h-5 w-5 items-center justify-center rounded-sm border-2 border-white text-xs font-black text-white">
                                    I
                                </div>

                            </div>

                            <span className="text-xl font-black tracking-tight text-slate-900">

                                Inspect
                                <span className="text-indigo-600">
                                    MyCar
                                </span>

                            </span>

                        </Link>

                        <p className="text-sm leading-relaxed text-slate-500">

                            {selectedCityDisplay}&apos;s trusted
                            independent car inspection service.
                            We perform a detailed{" "}

                            <strong>
                                400 point PDI
                            </strong>

                            {" "}so you take delivery of a
                            perfect car.

                        </p>

                        <div className="mt-6 space-y-2 text-sm">

                            <a
                                href="tel:+919975934213"
                                className="block font-semibold text-slate-700 hover:text-indigo-600"
                            >
                                📞 +91 99759 34213
                            </a>

                            <a
                                href="https://wa.me/919975934213"
                                className="block font-semibold text-green-600"
                            >
                                💬 WhatsApp Chat
                            </a>

                        </div>

                    </div>

                    {/* SERVICES */}

                    <div>

                        <h4 className="mb-6 text-sm font-bold uppercase tracking-widest text-slate-900">
                            Services
                        </h4>

                        <ul className="space-y-3 text-sm text-slate-500">

                            <li>
                                <Link
                                    href="/locations"
                                    className="hover:text-indigo-600"
                                >
                                    Locations
                                </Link>
                            </li>

                            <li>
                                <Link
                                    href="/how-it-works"
                                    className="hover:text-indigo-600"
                                >
                                    How It Works
                                </Link>
                            </li>

                            <li>
                                <Link
                                    href="/info/pricing"
                                    className="hover:text-indigo-600"
                                >
                                    Pricing
                                </Link>
                            </li>

                            <li>
                                <Link
                                    href="/cancellation"
                                    className="hover:text-indigo-600"
                                >
                                    Cancellation Policy
                                </Link>
                            </li>

                        </ul>

                    </div>

                    {/* GUIDES */}

                    <div>

                        <h4 className="mb-6 text-sm font-bold uppercase tracking-widest text-slate-900">
                            Guides
                        </h4>

                        <ul className="space-y-3 text-sm text-slate-500">

                            <li>
                                <Link
                                    href="/pdi-checklist-for-new-car"
                                    className="hover:text-indigo-600"
                                >
                                    PDI Checklist
                                </Link>
                            </li>

                            <li>
                                <Link
                                    href="/car-delivery-checklist-pune"
                                    className="hover:text-indigo-600"
                                >
                                    Delivery Checklist
                                </Link>
                            </li>

                            <li>
                                <Link
                                    href="/top-10-mistakes-while-buying-car-in-pune"
                                    className="hover:text-indigo-600"
                                >
                                    Buying Mistakes Guide
                                </Link>
                            </li>

                            <li>
                                <Link
                                    href="/faqs"
                                    className="hover:text-indigo-600"
                                >
                                    FAQs
                                </Link>
                            </li>

                        </ul>

                    </div>

                    {/* SERVICE AREAS */}

                    <div>

                        <h4 className="mb-6 text-sm font-bold uppercase tracking-widest text-slate-900">
                            Service Areas in{" "}
                            {selectedCityDisplay}
                        </h4>

                        <div className="flex flex-wrap gap-2">

                            {areas.length > 0 ? (
                                areas.map((area) => (
                                    <span
                                        key={area}
                                        className="rounded-md border border-slate-200 bg-white px-2 py-1 text-xs text-slate-500"
                                    >
                                        {area}
                                    </span>
                                ))
                            ) : (
                                <span className="text-xs text-slate-400">
                                    Service areas coming soon
                                </span>
                            )}

                        </div>

                    </div>

                </div>

                {/* =====================================================
                    CITIES SERVED
                ===================================================== */}

                <div className="mt-14 border-t border-slate-100 pt-8">

                    <h4 className="mb-5 text-sm font-bold uppercase tracking-widest text-slate-900">
                        Cities Served
                    </h4>

                    <div className="flex flex-wrap gap-2">

                        {cities.map((city) => {

                            const cityAreas =
                                SERVICE_AREAS[city] || [];

                            const isSelected =
                                city === effectiveCity;

                            const citySlug =
                                getCitySlug(city);

                            return (
                                <Link
                                    key={city}
                                    href={`/${citySlug}/car-pdi`}
                                    className={`rounded-lg border px-3 py-2 text-xs transition-all ${
                                        isSelected
                                            ? "border-indigo-300 bg-indigo-50 text-indigo-600 shadow-sm"
                                            : "border-slate-200 bg-white text-slate-600 hover:border-indigo-300 hover:text-indigo-600 hover:shadow-sm"
                                    }`}
                                >

                                    <span className="font-semibold">
                                        {getCityDisplayName(
                                            city
                                        )}
                                    </span>

                                    <span className="ml-1.5 text-[10px] text-slate-400">
                                        ({cityAreas.length})
                                    </span>

                                </Link>
                            );
                        })}

                    </div>

                </div>

                {/* =====================================================
                    COPYRIGHT
                ===================================================== */}

                <div className="mt-12 flex flex-col gap-8 border-t border-black/10 pt-8 lg:flex-row lg:items-center lg:justify-between">

                    <div>

                        <p className="text-sm text-slate-400">

                            © {new Date().getFullYear()}{" "}

                            <span className="font-semibold text-black">
                                InspectMyCar
                            </span>

                            {" "}• Independent Car
                            Inspection Specialists,{" "}

                            {selectedCityDisplay}.

                        </p>

                        <p className="mt-2 text-sm text-slate-500">

                            Designed &amp; Developed by{" "}

                            <a
                                href="https://techworks.3dvishwa.com/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-semibold text-indigo-400 transition hover:text-pink-400"
                            >
                                3dVishwa Software Solutions
                            </a>

                        </p>

                    </div>

                    <div className="flex flex-wrap items-center gap-6 text-sm">

                        <Link
                            href="/privacy"
                            className="text-slate-400 transition hover:text-black"
                        >
                            Privacy
                        </Link>

                        <Link
                            href="/terms"
                            className="text-slate-400 transition hover:text-black"
                        >
                            Terms
                        </Link>

                        <Link
                            href="/faqs"
                            className="text-slate-400 transition hover:text-black"
                        >
                            FAQs
                        </Link>

                    </div>

                </div>

            </div>

            <div className="pointer-events-none absolute bottom-0 left-0 h-56 w-full bg-gradient-to-t from-indigo-600/10 via-pink-500/5 to-transparent" />

        </footer>
    );
}