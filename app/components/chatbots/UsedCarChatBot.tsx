// app/components/chatbots/UsedCarChatBot.tsx
"use client";
import { useEffect, useRef, useState } from "react";
import {
    collection,
    getDocs,
    query,
    where,
} from "firebase/firestore";
import { db } from "@/app/lib/firebase";
import { UsedCarPlan } from "@/app/context/BookingContext";
import {
    getBookingsAndAvailability,
    createBooking,
} from "@/app/lib/services/bookingService";
import { ALL_SLOTS } from "../../lib/slotConfig";
import {
    CAR_DATA,
    YEAR_OPTIONS,
} from "@/app/components/used-carData";

import {
    CITY_PRICING,
    useCityPricing,
    formatPrice,
    type CityName,
} from "@/app/components/city_price";

interface UsedCarChatBotProps {
    forceOpen: boolean;
    setForceOpen: (val: boolean) => void;
    initialPlan: UsedCarPlan | null;
}
const FUEL_TYPES = ["Petrol", "Diesel", "CNG", "EV", "Hybrid"];

export default function UsedCarChatBot({
    forceOpen,
    setForceOpen,
    initialPlan,
}: UsedCarChatBotProps) {
    void initialPlan;

    const [open, setOpen] = useState(false);

    const {
        selectedCity,
        cityPricing,
        cities,
        setCity,
        usedCarPrice,
        usedLuxuryPrice,
    } = useCityPricing();
    const [isConfirmed, setIsConfirmed] = useState(false);
    const [confirmedBooking, setConfirmedBooking] = useState<{
    name: string;
    brand: string;
    model: string;
    date: string;
    slot: string;
} | null>(null);
    const chatRef = useRef<HTMLDivElement>(null);
    const hasFetched = useRef(false);
    const [loading, setLoading] = useState(false);
    const [availability, setAvailability] = useState<
        Record<string, Record<string, number>>
    >({});
    const [inspectorCount, setInspectorCount] = useState(1);
    const [blockedSlotsMap, setBlockedSlotsMap] = useState<Record<string, string[]>>({});
    const [fullDayBlockedMap, setFullDayBlockedMap] = useState<Record<string, boolean>>({});
    const slotsConfig = ALL_SLOTS;
    const [formError, setFormError] = useState<string | null>(null);
    const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

    const [form, setForm] = useState({
        name: "",
        phone: "",
        location: "",
        carBrand: "",
        carModel: "",
        carYear: "",
        fuelType: "",
        inspectionLocation: "",
        preferredDate: "",
        slot: "",
        message: "",
    });
    useEffect(() => {
        setOpen(forceOpen);
    }, [forceOpen]);
    /* OUTSIDE CLICK */
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (chatRef.current && !chatRef.current.contains(event.target as Node)) {
                setOpen(false);
                setForceOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    /* CAR DATA */

    useEffect(() => {
        if (toast) {
            const timer = setTimeout(() => setToast(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [toast]);

    useEffect(() => {
        if (!open || hasFetched.current) return;

        hasFetched.current = true;

        Promise.all([
            fetchBookings(),
            fetchBlockedSlots(),
        ]);
    }, [open]);
    /* ---------------------------------------------------------------------- */
    /* CITY-SPECIFIC AVAILABILITY                                             */
    /* ---------------------------------------------------------------------- */

    const fetchBookings = async (city: CityName = selectedCity) => {
        try {
            const data = await getBookingsAndAvailability(city);

            setAvailability(data.availability || {});
            setInspectorCount(data.inspectorCount || 1);

            return data;
        } catch (err) {
            console.error("Availability sync failed", err);

            return {
                availability: {},
                inspectorCount: 1,
            };
        }
    };

    /* ---------------------------------------------------------------------- */
    /* CITY-SPECIFIC ADMIN BLOCKS                                             */
    /* ---------------------------------------------------------------------- */

    const fetchBlockedSlots = async (
        city: CityName = selectedCity
    ) => {
        try {
            const today = new Date().toISOString().split("T")[0];

            const q = query(
                collection(db, "blockedSlots"),
                where("date", ">=", today)
            );

            const snapshot = await getDocs(q);

            const slotMap: Record<string, string[]> = {};
            const fullMap: Record<string, boolean> = {};

            snapshot.forEach((doc) => {
                const data = doc.data();

                // Legacy blocked entries without city are treated as Pune.
                const blockCity =
                    (data.city || "Pune") as CityName;

                if (blockCity !== city) return;

                if (data.type === "date" && data.date) {
                    fullMap[data.date] = true;
                }

                if (data.type === "slot" && data.date && data.slot) {
                    if (!slotMap[data.date]) {
                        slotMap[data.date] = [];
                    }

                    slotMap[data.date].push(
                        String(data.slot)
                            .trim()
                            .replace(/^0/, "")
                    );
                }
            });

            setBlockedSlotsMap(slotMap);
            setFullDayBlockedMap(fullMap);

            return {
                slotMap,
                fullMap,
            };
        } catch (err) {
            console.error("Blocked slot sync failed", err);

            return {
                slotMap: {} as Record<string, string[]>,
                fullMap: {} as Record<string, boolean>,
            };
        }
    };

    const refreshAvailability = async (
        city: CityName = selectedCity
    ) => {
        const [bookingResult, blockedResult] =
            await Promise.all([
                fetchBookings(city),
                fetchBlockedSlots(city),
            ]);

        return {
            bookingResult,
            blockedResult,
        };
    };

    useEffect(() => {
        if (!open) return;

        hasFetched.current = true;
        refreshAvailability(selectedCity);
    }, [open]);

    /*
     * Changing city changes both pricing and availability.
     * The previously selected date/slot is cleared because it belonged
     * to the previous city's availability.
     */
    useEffect(() => {
        setForm((prev) => ({
            ...prev,
            preferredDate: "",
            slot: "",
        }));

        if (open) {
            hasFetched.current = true;
            refreshAvailability(selectedCity);
        }
    }, [selectedCity]);

    /* ---------------------------------------------------------------------- */
    /* AVAILABILITY HELPERS                                                    */
    /* ---------------------------------------------------------------------- */

    const isSlotAdminBlocked = (
        date: string,
        slot: string
    ) => {
        return (
            fullDayBlockedMap[date] === true ||
            blockedSlotsMap[date]?.includes(slot) === true
        );
    };

    const getRemainingCapacity = (
        date: string,
        slot: string
    ) => {
        if (isSlotAdminBlocked(date, slot)) {
            return 0;
        }

        /*
         * bookingService returns remaining capacity only for slots
         * that currently have bookings.
         *
         * A slot missing from the map therefore has the full
         * inspector capacity available.
         */
        return Math.max(
            availability[date]?.[slot] ??
                inspectorCount,
            0
        );
    };

    const isDayFullyBlocked = (date: string) => {
        // Admin full-day block always wins.
        if (fullDayBlockedMap[date]) return true;

        return ALL_SLOTS.every(
            (slot) =>
                getRemainingCapacity(date, slot) <= 0
        );
    };


    /* VALIDATION */
    const validate = () => {
        const phoneRegex = /^[0-9]{10,15}$/;

        if (!form.name.trim()) return "Name is required";
        if (!form.phone.trim()) return "Phone is required";
        if (!phoneRegex.test(form.phone)) return "Enter valid phone number";
        if (!form.location.trim()) return "location is required";

        if (!form.carBrand) return "Select car brand";
        if (!form.carModel) return "Select car model";
        if (!form.carYear) return "Select car year";
        if (!form.fuelType) return "Select fuel type";

        if (!form.preferredDate) return "Select inspection date";
        if (!form.slot) return "Select slot";

        if (isDayFullyBlocked(form.preferredDate)) {
            return "Selected date is fully booked";
        }

        if (
            isSlotAdminBlocked(
                form.preferredDate,
                form.slot
            )
        ) {
            return "Selected slot is unavailable";
        }

        if (
            getRemainingCapacity(
                form.preferredDate,
                form.slot
            ) <= 0
        ) {
            return "Selected slot is full";
        }

        return null;
    };

    /* ---------------------------------------------------------------------- */
    /* FORM                                                                   */
    /* ---------------------------------------------------------------------- */

    const handleChange = (e: any) => {
        setForm((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleBrandChange = (brand: string) => {
        setForm((prev) => ({
            ...prev,
            carBrand: brand,
            carModel: "",
        }));
    };

    /* ---------------------------------------------------------------------- */
    /* SUBMIT                                                                 */
    /* ---------------------------------------------------------------------- */

    const handleSubmit = async () => {
        const error = validate();

        if (error) {
            setFormError(error);
            return;
        }

        setFormError(null);
        setLoading(true);

        try {
            /*
             * Refresh availability immediately before booking.
             * This catches:
             *
             * - another booking filling the slot
             * - admin blocking the slot
             * - admin blocking the whole day
             * - inspector capacity changes
             */
            const latest =
                await refreshAvailability(
                    selectedCity
                );

const latestAvailability: {
    availability: Record<string, Record<string, number>>;
    inspectorCount: number;
} = latest.bookingResult ?? {
    availability: {},
    inspectorCount: 1,
};

            const latestBlocked =
                latest.blockedResult;

            const latestRemaining =
                latestAvailability.availability?.[
                    form.preferredDate
                ]?.[form.slot] ??
                latestAvailability.inspectorCount;

            const adminSlotBlocked =
                latestBlocked.slotMap[
                    form.preferredDate
                ]?.includes(form.slot) === true;

            const adminDayBlocked =
                latestBlocked.fullMap[
                    form.preferredDate
                ] === true;

            if (
                adminSlotBlocked ||
                adminDayBlocked
            ) {
                throw new Error(
                    "This slot is no longer available."
                );
            }

            if (latestRemaining <= 0) {
                throw new Error(
                    "This slot has just been fully booked."
                );
            }

            await createBooking({
                type: "used-car-inspection",
                name: form.name,
                mobile: form.phone,
                date: form.preferredDate,
                slot: form.slot,
                location: form.location,
                fullAddress: form.inspectionLocation,
                city: selectedCity,
                brand: form.carBrand,
                model: form.carModel,
                year: Number(form.carYear),
                fuelType: form.fuelType,
                message: form.message,
                price: estimatedPrice,
            });

// Preserve booking details for the confirmation / WhatsApp message
setConfirmedBooking({
    name: form.name,
    brand: form.carBrand,
    model: form.carModel,
    date: form.preferredDate,
    slot: form.slot,
});

setToast({
    msg: "Slot Reserved!",
    type: "success",
});

setIsConfirmed(true);
hasFetched.current = false;

// Keep the chatbot open so the customer can see
// the confirmation and WhatsApp support button.
setOpen(true);
setForceOpen(true);

setForm({
    name: "",
    phone: "",
    location: "",
    carBrand: "",
    carModel: "",
    carYear: "",
    fuelType: "",
    inspectionLocation: "",
    preferredDate: "",
    slot: "",
    message: "",
});
        } catch (err: any) {
            setFormError(
                err.message ||
                    "Failed to submit booking"
            );
        } finally {
            setLoading(false);
        }
    };

    const getDayStyle = (dateStr: string) => {
        if (fullDayBlockedMap[dateStr]) {
            return "bg-red-500 text-white border-red-500 opacity-40 cursor-not-allowed";
        }

        const unavailableCount =
            ALL_SLOTS.filter(
                (slot) =>
                    getRemainingCapacity(
                        dateStr,
                        slot
                    ) <= 0
            ).length;

        const totalPossible =
            slotsConfig.length;

        if (
            unavailableCount >= totalPossible
        ) {
            return "bg-red-500 text-white border-red-500 opacity-40 cursor-not-allowed";
        }

        if (unavailableCount >= 3) {
            return "bg-orange-400 text-white border-orange-400";
        }

        if (unavailableCount >= 1) {
            return "bg-yellow-400 text-black border-yellow-400";
        }

        return "bg-emerald-500 text-white border-emerald-500";
    };

    const handleToggle = () => {
        if (open) {
            hasFetched.current = false;

            setOpen(false);
            setForceOpen(false);
        } else {
            setOpen(true);
            setForceOpen(true);
        }
    };
    const selectedBrand =
        CAR_DATA.find((b) => b.brand === form.carBrand);

    const selectedModel =
        selectedBrand?.models.find(
            (m) => m.name === form.carModel
        );

    /**
     * Centralized used-car pricing.
     *
     * Standard used-car PDI changes with city.
     * Luxury used-car PDI uses the centralized fixed luxury rate.
     *
     * Fuel type is collected for the booking, but it does not
     * change the used-car price because city_price.tsx currently
     * defines one used-car rate per city.
     */
    const estimatedPrice =
        selectedModel?.type === "Luxury"
            ? usedLuxuryPrice()
            : usedCarPrice();
return (
    <div
        ref={chatRef}
        className="fixed bottom-6 right-6 md:bottom-10 md:right-10 z-[100] font-sans"
    >
        {toast && (
            <div
                className={`fixed bottom-28 right-6 md:right-10 px-6 py-4 rounded-2xl shadow-2xl text-white z-[110] font-bold animate-in slide-in-from-right-10 duration-300 ${
                    toast.type === "success"
                        ? "bg-slate-900"
                        : "bg-red-500"
                }`}
            >
                {toast.msg}
            </div>
        )}

        {/* CHATBOT BUTTON */}
        <button
            onClick={handleToggle}
            className={`flex flex-col items-center gap-1 transition-all duration-500 active:scale-90 ${
                open ? "" : "hover:scale-105"
            }`}
        >
            {/* ICON BUTTON */}
            <div
                className={`w-16 h-16 rounded-[1.5rem] shadow-[0_20px_50px_rgba(79,70,229,0.3)] flex items-center justify-center border-4 border-white transition-all ${
                    open
                        ? "bg-slate-900 rotate-180"
                        : "bg-indigo-600 hover:bg-indigo-700"
                }`}
            >
                {open ? (
                    <span className="text-white text-2xl font-light">
                        ✕
                    </span>
                ) : (
                    <div className="relative">
                        <span className="absolute -top-3 -right-3 h-5 w-5 bg-pink-500 border-2 border-white rounded-full animate-bounce" />

                        <svg
                            className="w-8 h-8 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2.5"
                                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                            />
                        </svg>
                    </div>
                )}
            </div>

            {/* TEXT BELOW */}
            {!open && (
                <span className="text-[10px] font-black text-white bg-indigo-600 px-3 py-1 rounded-full shadow-lg tracking-wide animate-in fade-in duration-300">
                    Book Now
                </span>
            )}
        </button>

        {/* CHAT WINDOW */}
        {open && (
            <div className="absolute bottom-20 right-0 bg-white/95 backdrop-blur-xl p-6 rounded-[2.5rem] shadow-[0_30px_100px_-20px_rgba(0,0,0,0.4)] w-[350px] md:w-[420px] border border-white/50 max-h-[85vh] overflow-y-auto no-scrollbar animate-in slide-in-from-bottom-12 zoom-in-95 duration-500">

                {/* ====================================================== */}
                {/* SUCCESS / BOOKING CONFIRMATION */}
                {/* ====================================================== */}

                {isConfirmed && confirmedBooking ? (
                    <div className="py-10 text-center animate-in zoom-in duration-700">

                        {/* SUCCESS ICON */}
                        <div className="w-24 h-24 bg-indigo-50 text-indigo-600 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-inner">
                            <svg
                                className="w-12 h-12"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="3"
                                    d="M5 13l4 4L19 7"
                                />
                            </svg>
                        </div>

                        {/* TITLE */}
                        <h2 className="text-4xl font-black text-slate-900 mb-4 tracking-tighter italic">
                            Confirmed!
                        </h2>

                        {/* MESSAGE */}
                        <p className="text-slate-500 font-medium mb-8 px-4 text-sm leading-relaxed">
                            Your used car inspection has been successfully
                            scheduled.
                        </p>

                        {/* BOOKING SUMMARY */}
                        <div className="bg-slate-50 rounded-2xl p-5 mb-6 text-left border border-slate-100">
                            <div className="space-y-3">

                                <div className="flex justify-between gap-4">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                                        Vehicle
                                    </span>

                                    <span className="text-sm font-black text-slate-800 text-right">
                                        {confirmedBooking.brand}{" "}
                                        {confirmedBooking.model}
                                    </span>
                                </div>

                                <div className="flex justify-between gap-4">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                                        Date
                                    </span>

                                    <span className="text-sm font-black text-slate-800">
                                        {confirmedBooking.date
                                            ?.split("-")
                                            .reverse()
                                            .join("/")}
                                    </span>
                                </div>

                                <div className="flex justify-between gap-4">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                                        Time
                                    </span>

                                    <span className="text-sm font-black text-slate-800">
                                        {confirmedBooking.slot}
                                    </span>
                                </div>

                            </div>
                        </div>

                        {/* SUPPORT MESSAGE */}
                        <p className="text-xs text-slate-500 font-medium mb-5 leading-relaxed px-3">
                            Need more information about your inspection?
                            Contact our team directly on WhatsApp.
                        </p>

                        {/* WHATSAPP SUPPORT */}
                        <a
                            href={`https://wa.me/919975934213?text=${encodeURIComponent(
                                `Hello, my used car inspection booking is confirmed. Vehicle: ${confirmedBooking.brand} ${confirmedBooking.model}, Date: ${confirmedBooking.date}, Time: ${confirmedBooking.slot}. I would like more information about my inspection.`
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-3 w-full bg-[#25D366] text-white py-5 rounded-[1.5rem] font-black shadow-xl hover:scale-[1.03] transition-all active:scale-95"
                        >
                            {/* WHATSAPP ICON */}
                            <svg
                                className="w-6 h-6"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                                aria-hidden="true"
                            >
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.372-.025-.521-.075-.149-.669-1.611-.916-2.206-.242-.579-.487-.5-.669-.51-.173-.008-.372-.01-.57-.01-.198 0-.52.075-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.262.489 1.694.626.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />

                                <path d="M12.004 2C6.48 2 2 6.477 2 12c0 1.77.462 3.43 1.265 4.89L2 22l5.255-1.377A9.94 9.94 0 0 0 12.004 22C17.522 22 22 17.523 22 12S17.522 2 12.004 2zm0 18.1c-1.55 0-3.07-.417-4.408-1.207l-.316-.187-3.118.817.833-3.04-.205-.33A8.09 8.09 0 1 1 12.004 20.1z" />
                            </svg>

                            WhatsApp Support
                        </a>

                        {/* CLOSE */}
                        <button
                            onClick={() => {
                                setIsConfirmed(false);
                                setConfirmedBooking(null);
                                setOpen(false);
                                setForceOpen(false);
                            }}
                            className="mt-5 text-slate-400 font-black text-[10px] uppercase tracking-widest hover:text-indigo-600 transition-colors"
                        >
                            Close Window
                        </button>
                    </div>
                ) : (

                    /* ================================================== */
                    /* EXISTING BOOKING FORM */
                    /* ================================================== */

                    <>
                        {formError && (
                            <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-xl text-sm mb-4">
                                {formError}
                            </div>
                        )}

                        {/* CITY + VEHICLE */}
                        <div className="mb-6">
                            <div className="rounded-2xl border-2 border-indigo-100 bg-indigo-50/70 p-4">
                                <div className="flex items-center justify-between gap-3 mb-2">
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-indigo-500">
                                            Inspection City
                                        </p>

                                        <p className="text-xs font-bold text-slate-500 mt-1">
                                            PDI price varies by city. Select
                                            your city to see the estimated
                                            price.
                                        </p>
                                    </div>

                                    <span className="text-lg">📍</span>
                                </div>

                                <select
                                    value={selectedCity}
                                    onChange={(e) =>
                                        setCity(e.target.value as CityName)
                                    }
                                    className="w-full border-2 border-white p-4 rounded-2xl bg-white font-black text-sm text-slate-800 outline-none focus:border-indigo-500 shadow-sm cursor-pointer"
                                >
                                    {cities.map((cityName) => (
                                        <option
                                            key={cityName}
                                            value={cityName}
                                        >
                                            {CITY_PRICING[cityName].name}
                                        </option>
                                    ))}
                                </select>

                                <p className="mt-2 text-[10px] font-bold text-indigo-600">
                                    {cityPricing.badge}
                                </p>
                            </div>
                        </div>

                        {/* HEADING */}
                        <div className="flex justify-between items-start mb-8">
                            <div>
                                <h2 className="text-4xl font-black text-slate-900 tracking-tighter leading-none">
                                    Book PDI
                                </h2>

                                <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mt-2 flex items-center gap-2">
                                    <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse" />
                                    Step 1: Personal Details
                                </p>
                            </div>
                        </div>

                        {/* PERSONAL */}
                        <div className="space-y-1 mb-6">
                            <div className="grid grid-cols-1 gap-2">

                                {/* NAME */}
                                <div className="relative group">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors text-lg">
                                        👤
                                    </span>

                                    <input
                                        placeholder="Full Name"
                                        className="w-full border-2 border-slate-50 pl-12 p-4 rounded-2xl bg-slate-50/50 outline-none focus:border-indigo-500 focus:bg-white font-bold transition-all text-sm"
                                        value={form.name}
                                        onChange={(e) =>
                                            setForm({
                                                ...form,
                                                name: e.target.value,
                                            })
                                        }
                                    />
                                </div>

                                {/* PHONE */}
                                <div className="relative group flex items-center">

                                    {/* +91 PREFIX */}
                                    <span className="absolute left-12 text-slate-500 font-black text-sm">
                                        +91
                                    </span>

                                    {/* ICON */}
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg">
                                        📞
                                    </span>

                                    <input
                                        type="tel"
                                        placeholder="Enter 10 digit mobile"
                                        maxLength={10}
                                        className="w-full border-2 border-slate-50 pl-20 pr-4 p-4 rounded-2xl bg-slate-50/50 outline-none focus:border-indigo-500 focus:bg-white font-bold transition-all text-sm"
                                        value={form.phone}
                                        onChange={(e) => {
                                            let value = e.target.value;

                                            value = value.replace(/\D/g, "");

                                            if (value.length > 10) return;

                                            setForm({
                                                ...form,
                                                phone: value,
                                            });
                                        }}
                                    />
                                </div>

                                {/* LOCATION */}
                                <div className="relative group">
                                    <span className="absolute left-4 top-4 text-slate-400 text-lg">
                                        🏢
                                    </span>

                                    <textarea
                                        placeholder="Location"
                                        className="w-full border-2 border-slate-50 pl-12 p-4 rounded-2xl bg-slate-50/50 outline-none focus:border-indigo-500 focus:bg-white font-bold transition-all text-sm resize-none"
                                        rows={2}
                                        value={form.location}
                                        onChange={(e) =>
                                            setForm({
                                                ...form,
                                                location: e.target.value,
                                            })
                                        }
                                    />
                                </div>

                                {/* ADDRESS */}
                                <div className="relative group">
                                    <span className="absolute left-4 top-4 text-slate-400 text-lg">
                                        🏢
                                    </span>

                                    <textarea
                                        placeholder="Address"
                                        className="w-full border-2 border-slate-50 pl-12 p-4 rounded-2xl bg-slate-50/50 outline-none focus:border-indigo-500 focus:bg-white font-bold transition-all text-sm resize-none"
                                        rows={2}
                                        value={form.inspectionLocation}
                                        onChange={(e) =>
                                            setForm({
                                                ...form,
                                                inspectionLocation:
                                                    e.target.value,
                                            })
                                        }
                                    />
                                </div>
                            </div>
                        </div>

                        {/* VEHICLE */}
                        <Section title="Vehicle Details">
                            <div className="grid grid-cols-2 gap-3">

                                {/* BRAND */}
                                <select
                                    value={form.carBrand}
                                    onChange={(e) =>
                                        handleBrandChange(e.target.value)
                                    }
                                    className="border-2 border-slate-50 p-4 rounded-2xl bg-slate-50/50 font-black text-xs outline-none focus:border-indigo-500 appearance-none cursor-pointer"
                                >
                                    <option value="">
                                        Select Brand
                                    </option>

                                    {CAR_DATA.map((b) => (
                                        <option
                                            key={b.brand}
                                            value={b.brand}
                                        >
                                            {b.brand}
                                        </option>
                                    ))}
                                </select>

                                {/* MODEL */}
                                <select
                                    value={form.carModel}
                                    disabled={!form.carBrand}
                                    onChange={(e) =>
                                        setForm((prev) => ({
                                            ...prev,
                                            carModel: e.target.value,
                                        }))
                                    }
                                    className="border-2 border-slate-50 p-4 rounded-2xl bg-slate-50/50 font-black text-xs outline-none focus:border-indigo-500 appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <option value="">
                                        Select Model
                                    </option>

                                    {selectedBrand?.models.map((m) => (
                                        <option
                                            key={m.name}
                                            value={m.name}
                                        >
                                            {m.name}
                                        </option>
                                    ))}
                                </select>

                                {/* YEAR */}
                                <select
                                    name="carYear"
                                    value={form.carYear}
                                    onChange={handleChange}
                                    className="border-2 border-slate-50 p-4 rounded-2xl bg-slate-50/50 font-black text-xs outline-none focus:border-indigo-500 appearance-none cursor-pointer"
                                >
                                    <option value="">
                                        Select Year
                                    </option>

                                    {YEAR_OPTIONS.map((year) => (
                                        <option key={year} value={year}>
                                            {year}
                                        </option>
                                    ))}
                                </select>

                                {/* FUEL */}
                                <select
                                    name="fuelType"
                                    value={form.fuelType}
                                    onChange={handleChange}
                                    className="border-2 border-slate-50 p-4 rounded-2xl bg-slate-50/50 font-black text-xs outline-none focus:border-indigo-500 appearance-none cursor-pointer"
                                >
                                    <option value="">
                                        Fuel Type
                                    </option>

                                    {FUEL_TYPES.map((fuel) => (
                                        <option key={fuel} value={fuel}>
                                            {fuel}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </Section>

                        {/* PRICE */}
                        <div className="my-6 p-5 rounded-2xl bg-slate-50 border border-slate-100">
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                                        Estimated Inspection Fee
                                    </p>

                                    <p className="text-xs font-medium text-slate-500">
                                        {cityPricing.name}
                                        {selectedModel?.type === "Luxury"
                                            ? " • Luxury PDI"
                                            : " • Used Car PDI"}
                                    </p>
                                </div>

                                <div className="text-3xl font-black text-indigo-600">
                                    ₹{formatPrice(estimatedPrice)}
                                </div>
                            </div>

                            <p className="mt-3 text-[10px] text-slate-400">
                                * Estimate is calculated using the selected
                                city and vehicle type.
                            </p>
                        </div>

                        {/* SCHEDULE */}
                        <Section title="Schedule">

                            {/* DATE */}
                            <div className="mb-8">
                                <div className="text-[10px] font-black uppercase text-slate-400 mb-4 tracking-[0.2em] px-1 flex justify-between items-center">

                                    <div className="text-[10px] font-black text-indigo-500 uppercase tracking-widest flex items-center gap-2">
                                        <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse" />
                                        Step 3: Choose Date
                                    </div>

                                    {form.preferredDate && (
                                        <span className="text-indigo-600">
                                            Selected:{" "}
                                            {form.preferredDate
                                                .split("-")
                                                .reverse()
                                                .join("/")}
                                        </span>
                                    )}
                                </div>

                                <div className="grid grid-cols-7 gap-1.5">
                                    {Array.from(
                                        { length: 21 },
                                        (_, i) => {
                                            const d = new Date();
                                            d.setDate(
                                                d.getDate() + i
                                            );

                                            const dateStr = d
                                                .toISOString()
                                                .split("T")[0];

                                            const isFull =
                                                isDayFullyBlocked(dateStr);

                                            return (
                                                <button
                                                    key={i}
                                                    disabled={isFull}
                                                    onClick={() => {
                                                        if (
                                                            isDayFullyBlocked(
                                                                dateStr
                                                            )
                                                        )
                                                            return;

                                                        setForm((prev) => ({
                                                            ...prev,
                                                            preferredDate:
                                                                dateStr,
                                                            slot: "",
                                                        }));
                                                    }}
                                                    className={`h-11 rounded-xl text-xs font-black transition-all border-2 flex flex-col items-center justify-center
                                                        ${
                                                            isFull
                                                                ? "opacity-40 cursor-not-allowed"
                                                                : ""
                                                        }
                                                        ${getDayStyle(
                                                            dateStr
                                                        )}
                                                        ${
                                                            form.preferredDate ===
                                                            dateStr
                                                                ? "ring-4 ring-indigo-500/20 scale-105 border-slate-900 shadow-xl"
                                                                : "hover:brightness-95"
                                                        }`}
                                                >
                                                    {d.getDate()}

                                                    <span className="text-[8px] opacity-60">
                                                        {d.toLocaleString(
                                                            "default",
                                                            {
                                                                month: "short",
                                                            }
                                                        )}
                                                    </span>
                                                </button>
                                            );
                                        }
                                    )}
                                </div>
                            </div>

                            {/* TIME SLOTS */}
                            {form.preferredDate && (
                                <div
                                    className={`mb-8 animate-in slide-in-from-top-4 duration-500 ${
                                        isDayFullyBlocked(
                                            form.preferredDate
                                        )
                                            ? "opacity-40 pointer-events-none"
                                            : ""
                                    }`}
                                >
                                    <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mt-2 flex items-center gap-2">
                                        <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse" />
                                        Step 2: Select Preferred Time
                                    </p>

                                    <div className="grid grid-cols-3 gap-2">
                                        {slotsConfig.map((s) => {
                                            const remaining =
                                                getRemainingCapacity(
                                                    form.preferredDate,
                                                    s
                                                );

                                            const isTaken =
                                                remaining <= 0;

                                            const isAdminBlocked =
                                                isSlotAdminBlocked(
                                                    form.preferredDate,
                                                    s
                                                );

                                            return (
                                                <button
                                                    key={s}
                                                    disabled={isTaken}
                                                    onClick={() => {
                                                        if (
                                                            isDayFullyBlocked(
                                                                form.preferredDate
                                                            )
                                                        ) {
                                                            return;
                                                        }

                                                        if (
                                                            isSlotAdminBlocked(
                                                                form.preferredDate,
                                                                s
                                                            )
                                                        ) {
                                                            return;
                                                        }

                                                        if (
                                                            getRemainingCapacity(
                                                                form.preferredDate,
                                                                s
                                                            ) <= 0
                                                        ) {
                                                            return;
                                                        }

                                                        setForm((prev) => ({
                                                            ...prev,
                                                            slot: s,
                                                        }));
                                                    }}
                                                    className={`py-3 text-[10px] font-black rounded-xl border-2 transition-all ${
                                                        isTaken
                                                            ? "bg-slate-50 border-slate-50 text-slate-300 line-through"
                                                            : form.slot === s
                                                                ? "border-indigo-600 bg-indigo-600 text-white"
                                                                : "bg-white border-slate-100 text-slate-600 hover:border-indigo-300"
                                                    }`}
                                                >
                                                    <span>{s}</span>

                                                    {!isTaken &&
                                                        !isAdminBlocked &&
                                                        inspectorCount > 1 && (
                                                            <span className="block text-[8px] opacity-70 mt-0.5">
                                                                {remaining}{" "}
                                                                {remaining ===
                                                                1
                                                                    ? "slot"
                                                                    : "slots"}{" "}
                                                                left
                                                            </span>
                                                        )}

                                                    {isAdminBlocked && (
                                                        <span className="block text-[8px] mt-0.5">
                                                            Blocked
                                                        </span>
                                                    )}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </Section>

                        {/* NOTES */}
                        <textarea
                            name="message"
                            value={form.message}
                            onChange={handleChange}
                            placeholder="Notes"
                            className="w-full border-2 border-slate-50 p-4 rounded-2xl bg-slate-50/50 outline-none focus:border-indigo-500 focus:bg-white font-bold transition-all text-sm resize-none mb-6"
                            rows={3}
                        />

                        {/* SUBMIT */}
                        <button
                            onClick={handleSubmit}
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 text-white py-4 rounded-2xl font-black shadow-xl shadow-indigo-300/30 transition-all hover:scale-[1.02] disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {loading ? "Booking..." : "Confirm Booking"}
                        </button>
                    </>
                )}
            </div>
        )}
    </div>
);
}
/* HELPERS */
function Input(props: any) {
    return <input {...props} className="border p-2 rounded-xl w-full" />;
}

function Section({ title, children }: any) {
    return (
        <div className="space-y-2">
            <div className="text-xs font-black text-indigo-600 uppercase">{title}</div>
            {children}
        </div>
    );
}