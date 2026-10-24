"use client";

import { useBooking } from "@/app/context/BookingContext";

import {
    useCityPricing,
    formatPrice,
    getNewCarPrice,
    getUsedCarPrice,
    getNewLuxuryPrice,
    getUsedLuxuryPrice,
    type NewCarPricingOption,
} from "@/app/components/city_price";

export default function Pricing() {
    const {
        openNewCarBooking,
        openUsedCarBooking,
    } = useBooking();

    const {
        selectedCity,
        cityPricing,
        cities,
        setCity,
    } = useCityPricing();

    /**
     * =========================================================
     * NEW CAR PLANS
     * =========================================================
     */

    const plans = [
        {
            name: "Basic Cars PDI",
            price: getNewCarPrice(
                selectedCity,
                "fuel",
                "withoutGauge"
            ),
            subtitle: "Hatchbacks, Sedans & Compact SUVs",
            features: [
                "Basic Inspection without OBD and Gauge Checks",
                "400 Point Checklist",
                "Visual Exterior Inspection",
                "Interior Basic Check",
                "Immediate Digital Report",
            ],
            planType: "Basic" as const,
        },

        {
            name: "Standard Cars w/o OBD",
            price: getNewCarPrice(
                selectedCity,
                "fuel",
                "withGauge"
            ),
            subtitle: "Hatchbacks, Sedans & Compact SUVs",
            features: [
                "400 Point Checklist",
                "Inspection with Gauge Checks without OBD",
                "Paint Thickness Depth Test",
                "Interior & Upholstery Check",
                "Immediate Digital Report",
            ],
            planType: "Standard" as const,
        },

        {
            name: "Standard Cars with OBD",
            price: getNewCarPrice(
                selectedCity,
                "fuel",
                "withOBD"
            ),
            subtitle: "Hatchbacks, Sedans & Compact SUVs",
            features: [
                "400 Point Checklist",
                "Paint Thickness Depth Test",
                "OBD Engine Diagnostics",
                "Interior & Upholstery Check",
                "Immediate Digital Report",
            ],
            planType: "Standard-OBD" as const,
        },

        {
            name: "Luxury Cars",
            price: getNewLuxuryPrice(),
            subtitle: "BMW, Audi, Merc, Volvo, etc.",
            features: [
                "Advanced 400 Point Checklist",
                "Paint Thickness Depth Test",
                "Suspension & Air-Ride Check",
                "Priority Digital Report",
            ],
            planType: "Luxury" as const,
        },
    ];

    /**
     * =========================================================
     * NEW CAR PLAN VISIBILITY
     * =========================================================
     *
     * Pune:
     *   Basic + Standard w/o OBD + Standard with OBD + Luxury
     *
     * Other cities:
     *   Standard w/o OBD + Standard with OBD + Luxury
     *
     * This keeps the OBD option available while also showing
     * the non-OBD Standard inspection in every city.
     */

    const visibleNewCarPlans =
        selectedCity === "Pune"
            ? plans
            : plans.filter(
                  (plan) =>
                      plan.planType === "Standard" ||
                      plan.planType === "Standard-OBD" ||
                      plan.planType === "Luxury"
              );

    /**
     * =========================================================
     * USED CAR PLANS
     * =========================================================
     */

    const usedCarPlans = [
        {
            name: "Standard Used Resell Cars Inspection",
            price: getUsedCarPrice(selectedCity),
            subtitle: "Hatchbacks, Sedans & SUVs",
            features: [
                "400 Point Inspection",
                "Paint Thickness Test",
                "OBD Diagnostics",
                "Road Test",
                "Digital Inspection Report",
            ],
            type: "Standard" as const,
        },

        {
            name: "Luxury Used Resell Cars Inspection",
            price: getUsedLuxuryPrice(),
            subtitle: "BMW, Audi, Mercedes, Volvo, etc.",
            features: [
                "400 Point Inspection",
                "Advanced OBD Scan",
                "Paint Thickness Test",
                "Road Test",
                "Priority Digital Report",
            ],
            type: "Luxury" as const,
        },
    ];

    return (
        <main className="bg-main min-h-screen">

            {/* HERO */}

            <section className="px-6 pt-32 pb-20">

                <div className="max-w-6xl mx-auto text-center">

                    <p className="text-indigo-600 font-black uppercase tracking-[0.35em] text-xs mb-4">
                        Transparent Costs
                    </p>
                    <h1 className="heading text-5xl md:text-7xl mb-6">

                        Choose Your{" "}

                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600">

                            PDI Tier

                        </span>

                    </h1>
  
                    <p className="subtext text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
                        <b>Professional,</b> <b>Unbiased</b> inspection with zero
                        dealership commissions. Choose the plan that
                        fits your vehicle category.
                    </p>

                </div>

            </section>


            {/* =================================================
                CITY SELECTOR
            ================================================= */}

            <div className="flex justify-center mb-16">

                <div className="inline-flex items-center gap-4 bg-white border border-slate-200 shadow-lg px-5 py-3 rounded-2xl">

                    <span className="text-xs font-black uppercase tracking-wider text-slate-500">
                        📍 Inspection City
                    </span>

                    <select
                        value={selectedCity}
                        onChange={(e) =>
                            setCity(
                                e.target.value as typeof selectedCity
                            )
                        }
                        className="bg-transparent font-black text-indigo-600 text-sm focus:outline-none cursor-pointer"
                    >
                        {cities.map((city) => (
                            <option
                                key={city}
                                value={city}
                            >
                                {city}
                            </option>
                        ))}
                    </select>

                </div>

            </div>


            {/* =================================================
                CURRENT CITY SUMMARY
            ================================================= */}

            <div className="mb-14 rounded-3xl bg-indigo-50 border border-indigo-100 px-6 py-5 text-center">

                <p className="text-xs uppercase tracking-[0.25em] font-black text-indigo-600">
                    Current Pricing
                </p>

                <p className="text-2xl font-black text-slate-900 mt-2">
                    Rates for {selectedCity}
                </p>

                <p className="text-sm text-slate-500 mt-2">
                    New Car PDI from ₹
                    {formatPrice(cityPricing.newCarFuel)}
                    {" · "}
                    Used Car from ₹
                    {formatPrice(cityPricing.usedCar)}
                    {" · "}
                    EV from ₹
                    {formatPrice(cityPricing.ev)}
                </p>

            </div>


            {/* =================================================
                NEW CARS
            ================================================= */}

            <div className="text-center mb-12">

                <h2 className="text-4xl font-black">
                    New Cars Inspection
                </h2>

                <p className="text-slate-500 mt-3">
                    Independent pre-delivery inspection before
                    you accept your new vehicle in {selectedCity}.
                </p>

            </div>


            <section id="new-car-pricing" />

            <div
                className={`grid grid-cols-1 ${
                    selectedCity === "Pune"
                        ? "sm:grid-cols-2 lg:grid-cols-4"
                        : "sm:grid-cols-2 lg:grid-cols-3"
                } gap-8 max-w-6xl mx-auto items-stretch`}
            >

                {visibleNewCarPlans.map((plan, i) => (

                    <div
                        key={i}
                        className={`relative rounded-[3rem] p-10 md:p-12 border overflow-hidden flex flex-col h-full
                        transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl
                        ${
                            plan.planType === "Luxury"
                                ? "bg-slate-900 border-slate-900 text-white shadow-2xl scale-105 z-10 pt-14"
                                : plan.planType === "Standard-OBD"
                                    ? "bg-indigo-50 border-indigo-200 text-slate-900 shadow-lg scale-105 z-10 pt-14"
                                    : "bg-white border-slate-100 text-slate-900 shadow-sm hover:border-indigo-200"
                        }`}
                    >

                        <div className="mb-8">

                            <div className="min-h-[48px] flex items-start">

                                <h3
                                    className={`text-sm font-black uppercase tracking-widest ${
                                        plan.planType === "Luxury"
                                            ? "text-indigo-400"
                                            : "text-indigo-600"
                                    }`}
                                >
                                    {plan.name}
                                </h3>

                            </div>


                            <div className="flex items-baseline gap-1">

                                <span className="text-4xl font-black italic">
                                    ₹
                                </span>

                                <span className="text-6xl font-black tracking-tighter">
                                    {formatPrice(plan.price)}
                                </span>

                            </div>


                            <p
                                className={`text-xs font-bold mt-2 opacity-70 ${
                                    plan.planType === "Luxury"
                                        ? "text-slate-300"
                                        : "text-slate-500"
                                }`}
                            >
                                {plan.subtitle}
                            </p>

                        </div>


                        <ul className="space-y-4 mb-10 flex-grow">

                            {plan.features.map((feature, idx) => (

                                <li
                                    key={idx}
                                    className="flex items-center gap-3 text-sm font-bold"
                                >

                                    <span
                                        className={
                                            plan.planType === "Luxury"
                                                ? "text-indigo-400"
                                                : "text-emerald-500"
                                        }
                                    >
                                        ✓
                                    </span>

                                    <span
                                        className={
                                            plan.planType === "Luxury"
                                                ? "text-slate-300"
                                                : "text-slate-600"
                                        }
                                    >
                                        {feature}
                                    </span>

                                </li>

                            ))}

                        </ul>


                        {plan.planType === "Standard-OBD" && (

                            <div className="absolute top-6 right-[-60px] w-[220px] rotate-45 bg-emerald-500 text-white text-[10px] font-black py-2 text-center uppercase tracking-widest shadow-md z-20">
                                MOST POPULAR
                            </div>

                        )}


                        {plan.planType === "Luxury" && (

                            <div className="absolute top-6 right-[-60px] w-[220px] rotate-45 bg-indigo-600 text-white text-[10px] font-black py-2 text-center uppercase tracking-widest shadow-md z-20">
                                PREMIUM
                            </div>

                        )}


                        <button
                            onClick={() =>
                                openNewCarBooking(
                                    plan.planType
                                )
                            }
                            className={`mt-auto w-full py-5 rounded-2xl font-black uppercase tracking-widest transition-all ${
                                plan.planType === "Luxury"
                                    ? "bg-indigo-600 text-white hover:bg-white hover:text-slate-900"
                                    : "bg-slate-900 text-white hover:bg-indigo-600"
                            }`}
                        >
                            Book Now
                        </button>

                    </div>

                ))}

            </div>


            {/* =================================================
                EV PRICING
            ================================================= */}

            <section className="mt-20">

                <div className="rounded-[3rem] bg-emerald-50 border border-emerald-100 p-10 text-center">

                    <p className="text-xs font-black uppercase tracking-[0.3em] text-emerald-600">
                        Electric Vehicles
                    </p>

                    <h2 className="text-3xl font-black text-slate-900 mt-3">
                        EV PDI Pricing
                    </h2>

                    <p className="text-slate-500 mt-3">
                        EV pricing for {selectedCity}.
                    </p>

                    <div className="mt-8 max-w-sm mx-auto">

                        <div className="bg-white rounded-2xl p-8 border-2 border-emerald-400 shadow-sm">

                            <p className="text-xs font-black uppercase tracking-wider text-emerald-600">
                                EV Inspection
                            </p>

                            <p className="text-5xl font-black mt-3 text-slate-900">
                                ₹{formatPrice(cityPricing.ev)}
                            </p>

                            <p className="text-sm font-medium text-slate-500 mt-3">
                                Complete EV Pre-Delivery Inspection
                            </p>

                        </div>

                    </div>

                </div>

            </section>


            {/* =================================================
                USED CARS
            ================================================= */}

            <section className="mt-24">

                <div className="text-center mb-12">

                    <h2 className="text-4xl font-black">
                        Used Resell Cars Inspection
                    </h2>

                    <p className="text-slate-500 mt-3">
                        Independent pre-purchase inspection before
                        you buy a used vehicle in {selectedCity}.
                    </p>

                </div>


                <section id="used-car-pricing" />


                <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">

                    {usedCarPlans.map((plan) => (

                        <div
                            key={plan.name}
                            className="rounded-[3rem] border bg-white p-10 shadow-sm flex flex-col"
                        >

                            <h3 className="text-2xl font-black">
                                {plan.name}
                            </h3>


                            <div className="my-6">

                                <span className="text-5xl font-black">
                                    ₹{formatPrice(plan.price)}
                                </span>

                            </div>


                            <p className="text-slate-500 mb-6">
                                {plan.subtitle}
                            </p>


                            <ul className="space-y-3 flex-grow">

                                {plan.features.map((feature) => (

                                    <li
                                        key={feature}
                                        className="flex gap-3"
                                    >

                                        <span className="text-emerald-500">
                                            ✓
                                        </span>

                                        {feature}

                                    </li>

                                ))}

                            </ul>


                            <button
                                onClick={() =>
                                    openUsedCarBooking(
                                        plan.type
                                    )
                                }
                                className="mt-8 w-full bg-slate-900 text-white rounded-2xl py-4 font-black hover:bg-indigo-600 transition"
                            >
                                Book Now
                            </button>

                        </div>

                    ))}

                </div>

            </section>


            {/* =================================================
                FOOTER NOTE
            ================================================= */}

            <p className="text-center mt-12 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                *Prices shown are for {selectedCity} and include
                applicable inspection travel within the service
                area.
            </p>

        </main>
    );
}