"use client";
import { useBooking } from "@/app/context/BookingContext";
export default function Pricing() {
    // 1. Hook into the global context
    const {
        openNewCarBooking,
        openUsedCarBooking,
    } = useBooking();

    const plans = [
        {
            name: "Basic Cars PDI",
            price: "1,299",
            subtitle: "Hatchbacks, Sedans & Compact SUVs",
            features: [
                "Basic Inspection without OBD and Guage Checks",
                "299+ Point Checklist",
                "Visual Exterior Inspection",
                "Interior Basic Check",
                "Immediate Digital Report",
            ],
            planType: "Basic" as const, // make sure BookingContext supports this
        },
        {
            name: "Standard Cars w/o OBD",
            price: "1,499",
            subtitle: "Hatchbacks, Sedans & Compact SUVs",
            features: [
                "299+ Point Checklist",
                "Inspection with Guage Checks without OBD",
                "Paint Thickness Depth Test",
                "Interior & Upholstery Check",
                "Immediate Digital Report",
            ],
            planType: "Standard" as const, // Match BookingContext type
        },
        {
            name: "Standard Cars with OBD",
            price: "1,699",
            subtitle: "Hatchbacks, Sedans & Compact SUVs",
            features: [
                "299+ Point Checklist",
                "Paint Thickness Depth Test",
                "OBD Engine Diagnostics",
                "Interior & Upholstery Check",
                "Immediate Digital Report",
            ],
            planType: "Standard-OBD" as const, // New plan type added
        },
        {
            name: "Luxury Cars",
            price: "2,499",
            subtitle: "BMW, Audi, Merc, Volvo, etc.",
            features: [
                "Advanced 299+ Point Checklist",
                "Paint Thickness Depth Test",
                "Suspension & Air-Ride Check",
                "Priority Digital Report",
            ],
            planType: "Luxury" as const,
        }
    ];
    const usedCarPlans = [
        {
            name: "Standard Used Resell Cars Inspection",
            price: "1,999",
            subtitle: "Hatchbacks, Sedans & SUVs",
            features: [
                "299+ Point Inspection",
                "Paint Thickness Test",
                "OBD Diagnostics",
                "Road Test",
                "Digital Inspection Report",
            ],
            type: "Standard" as const,
        },
        {
            name: "Luxury Used Resell Cars Inspection",
            price: "3,299",
            subtitle: "BMW, Audi, Mercedes, Volvo, etc.",
            features: [
                "299+ Point Inspection",
                "Advanced OBD Scan",
                "Paint Thickness Test",
                "Road Test",
                "Priority Digital Report",
            ],
            type: "Luxury" as const,
        },
    ];
    return (
        <main className="max-w-6xl mx-auto px-6 py-24 relative">
            <div className="text-center mb-16">
                <p className="text-indigo-600 font-black uppercase tracking-[0.3em] text-[10px] mb-4">Transparent Costs</p>
                <h1 className="text-5xl font-black text-slate-900 mb-6 tracking-tighter">
                    Choose Your <span className="text-indigo-600 italic">PDI Tier</span>
                </h1>
                <p className="text-slate-500 font-medium max-w-xl mx-auto leading-relaxed">
                    Professional, unbiased inspection with zero dealership commissions.
                    Choose the plan that fits your new vehicle category.
                </p>
            </div>
            <div className="text-center mb-12">
                <h2 className="text-4xl font-black">
                    New Cars Inspection
                </h2>

                <p className="text-slate-500 mt-3">
                    Independent pre-purchase inspection before you buy.
                </p>
            </div>
            <section id="new-car-pricing"></section>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto items-stretch">
                {plans.map((plan, i) => (
                    <div
                        key={i}
                        className={`relative rounded-[3rem] p-10 md:p-12 border overflow-hidden flex flex-col h-full
transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl
${plan.planType === "Luxury"
                                ? "bg-slate-900 border-slate-900 text-white shadow-2xl scale-105 z-10 pt-14"
                                : plan.planType === "Standard-OBD"
                                    ? "bg-indigo-50 border-indigo-200 text-slate-900 shadow-lg scale-105 z-10 pt-14"
                                    : "bg-white border-slate-100 text-slate-900 shadow-sm hover:border-indigo-200"
                            }`}
                    >

                        <div className="mb-8">
                            <div className="min-h-[48px] flex items-start">
                                <h3 className={`text-sm font-black uppercase tracking-widest ${plan.planType === "Luxury" ? "text-indigo-400" : "text-indigo-600"}`}>
                                    {plan.name}
                                </h3>
                            </div>
                            <div className="flex items-baseline gap-1">
                                <span className="text-4xl font-black italic">₹</span>
                                <span className="text-6xl font-black tracking-tighter">{plan.price}</span>
                            </div>
                            <p className={`text-xs font-bold mt-2 opacity-70 ${plan.planType === "Luxury" ? "text-slate-300" : "text-slate-500"}`}>
                                {plan.subtitle}
                            </p>
                        </div>

                        <ul className="space-y-4 mb-10 flex-grow">
                            {plan.features.map((feature, idx) => (
                                <li key={idx} className="flex items-center gap-3 text-sm font-bold">
                                    <span className={plan.planType === "Luxury" ? "text-indigo-400" : "text-emerald-500"}>✓</span>
                                    <span className={plan.planType === "Luxury" ? "text-slate-300" : "text-slate-600"}>{feature}</span>
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
                            onClick={() => openNewCarBooking(plan.planType)}
                            className={`mt-auto w-full py-5 rounded-2xl font-black uppercase tracking-widest transition-all ${plan.planType === "Luxury"
                                ? "bg-indigo-600 text-white hover:bg-white hover:text-slate-900"
                                : "bg-slate-900 text-white hover:bg-indigo-600"
                                }`}
                        >
                            Book Now
                        </button>
                        {/* 2. TRIGGER GLOBAL BOOKING WITH TYPE */}
                    </div>
                ))}
            </div>

            <section className="mt-24">
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-black">
                        Used Resell Cars Inspection
                    </h2>

                    <p className="text-slate-500 mt-3">
                        Independent pre-purchase inspection before you buy.
                    </p>
                </div>
                <section id="used-car-pricing"></section>
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
                                    ₹{plan.price}
                                </span>
                            </div>

                            <p className="text-slate-500 mb-6">
                                {plan.subtitle}
                            </p>

                            <ul className="space-y-3 flex-grow">
                                {plan.features.map((feature) => (
                                    <li key={feature} className="flex gap-3">
                                        <span className="text-emerald-500">✓</span>
                                        {feature}
                                    </li>
                                ))}
                            </ul>

                            <button
                                onClick={() => openUsedCarBooking(plan.type)}
                                className="mt-8 w-full bg-slate-900 text-white rounded-2xl py-4 font-black hover:bg-indigo-600 transition"
                            >
                                Book Now
                            </button>
                        </div>
                    ))}
                </div>
            </section>
            <p className="text-center mt-12 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                *Prices are inclusive of travel within Pune & PCMC limits.
            </p>
        </main>
    );
}