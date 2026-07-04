// app/components/chatbots/UsedCarChatBot.tsx
"use client";
import { useEffect, useRef, useState } from "react";
import { db } from "@/app/lib/firebase";
import {
    addDoc,
    collection,
    getDocs,
    query,
    serverTimestamp,
    where,
} from "firebase/firestore";
import { UsedCarPlan } from "@/app/context/BookingContext";
import { ALL_SLOTS } from "../../lib/slotConfig";
import {
    CAR_DATA,
    YEAR_OPTIONS,
    PDI_PRICES,
    Brand,
} from "@/app/components/used-carData";

interface UsedCarChatBotProps {
    forceOpen: boolean;
    setForceOpen: (val: boolean) => void;
    initialPlan: UsedCarPlan | null;
}
const CURRENT_YEAR = new Date().getFullYear();
const FUEL_TYPES = ["Petrol", "Diesel", "CNG", "EV", "Hybrid"];

export default function UsedCarChatBot({
    forceOpen,
    setForceOpen,
    initialPlan,
}: UsedCarChatBotProps) {

    const [open, setOpen] = useState(false);
    const chatRef = useRef<HTMLDivElement>(null);
    const hasFetched = useRef(false);
    const [loading, setLoading] = useState(false);
    const [bookings, setBookings] = useState<Record<string, string[]>>({});
    const [blockedSlotsMap, setBlockedSlotsMap] = useState<Record<string, string[]>>({});
    const [fullDayBlockedMap, setFullDayBlockedMap] = useState<Record<string, boolean>>({});
    const slotsConfig = ALL_SLOTS;
    const [formError, setFormError] = useState<string | null>(null);
    const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

    useState<UsedCarPlan>("Standard");
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
    /* BOOKINGS */
    const fetchBookings = async () => {
        const today = new Date().toISOString().split("T")[0];

        const q = query(
            collection(db, "bookings"),
            where("date", ">=", today)
        );

        const snapshot = await getDocs(q);

        const map: Record<string, string[]> = {};

        snapshot.forEach((doc) => {
            const data = doc.data();

            if (!data.date || !data.slot) return;

            if (!map[data.date]) map[data.date] = [];

            map[data.date].push(
                String(data.slot).trim().replace(/^0/, "")
            );
        });

        setBookings(map);
    };
    /* BLOCKED */
    const fetchBlockedSlots = async () => {
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

            if (data.type === "date")
                fullMap[data.date] = true;

            if (data.type === "slot") {
                if (!slotMap[data.date])
                    slotMap[data.date] = [];

                slotMap[data.date].push(
                    String(data.slot).trim().replace(/^0/, "")
                );
            }
        });

        setBlockedSlotsMap(slotMap);
        setFullDayBlockedMap(fullMap);
    };

    /* HELPERS */
    const isDayFullyBlocked = (date: string) => {
        if (fullDayBlockedMap[date]) return true;

        return (
            (bookings[date]?.length || 0) +
            (blockedSlotsMap[date]?.length || 0)
        ) >= ALL_SLOTS.length;
    };

    const getAvailableSlots = (date: string) => {
        const taken = [
            ...(bookings[date] || []),
            ...(blockedSlotsMap[date] || [])
        ];
        return ALL_SLOTS.filter(s => !taken.includes(s));
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

        return null;
    };

    /* FORM */
    const handleChange = (e: any) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleBrandChange = (brand: string) => {
        setForm(prev => ({ ...prev, carBrand: brand, carModel: "" }));
    };

    const handleSubmit = async () => {

        const error = validate();
        if (error) {
            setFormError(error);
            return;
        }

        setFormError(null);
        try {
            const existing = query(
                collection(db, "bookings"),
                where("date", "==", form.preferredDate),
                where("slot", "==", form.slot)
            );

            const snapshot = await getDocs(existing);

            if (!snapshot.empty) {
                throw new Error("Slot already booked");
            }

            await addDoc(collection(db, "bookings"), {
                type: "used-car-inspection",

                name: form.name,
                mobile: form.phone,

                date: form.preferredDate,
                slot: form.slot,

                location: form.location,
                fullAddress: form.inspectionLocation,

                brand: form.carBrand,
                model: form.carModel,
                year: Number(form.carYear),
                fuelType: form.fuelType,

                message: form.message,

                price: estimatedPrice,

                status: "Confirmed",
                assignedTo: "",

                createdAt: serverTimestamp(),
            });
            setToast({ msg: "Slot Reserved!", type: "success" });

            hasFetched.current = false;
            setOpen(false);
            setForceOpen(false);
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
            setFormError(err.message || "Failed to submit booking");
        }

        setLoading(false);
    };
    const getDayStyle = (dateStr: string) => {
        if (fullDayBlockedMap[dateStr]) {
            return "bg-red-500 text-white border-red-500 opacity-40 cursor-not-allowed";
        }

        const bookedCount = bookings[dateStr]?.length || 0;
        const blockedCount = blockedSlotsMap[dateStr]?.length || 0;
        const totalUsed = bookedCount + blockedCount;
        const totalPossible = slotsConfig.length;

        if (totalUsed >= totalPossible)
            return "bg-red-500 text-white border-red-500 opacity-40 cursor-not-allowed";

        if (totalUsed >= 3)
            return "bg-orange-400 text-white border-orange-400";

        if (totalUsed >= 1)
            return "bg-yellow-400 text-black border-yellow-400";

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
    const estimatedPrice =
        selectedModel
            ? PDI_PRICES[selectedModel.type]
            : PDI_PRICES.Standard;

    return (
        <div ref={chatRef}
            className="fixed bottom-6 right-6 md:bottom-10 md:right-10 z-[100] font-sans"
        >
            {toast && (
                <div className={`fixed bottom-28 right-6 md:right-10 px-6 py-4 rounded-2xl shadow-2xl text-white z-[110] font-bold animate-in slide-in-from-right-10 duration-300 ${toast.type === "success" ? "bg-slate-900" : "bg-red-500"}`}>
                    {toast.msg}
                </div>
            )}

            <button
                onClick={handleToggle}
                className={`flex flex-col items-center gap-1 transition-all duration-500 active:scale-90 ${open ? "" : "hover:scale-105"}`}
            >
                {/* ICON BUTTON */}
                <div
                    className={`w-16 h-16 rounded-[1.5rem] shadow-[0_20px_50px_rgba(79,70,229,0.3)] flex items-center justify-center border-4 border-white transition-all
        ${open ? "bg-slate-900 rotate-180" : "bg-indigo-600 hover:bg-indigo-700"}`}
                >
                    {open ? (
                        <span className="text-white text-2xl font-light">✕</span>
                    ) : (
                        <div className="relative">
                            <span className="absolute -top-3 -right-3 h-5 w-5 bg-pink-500 border-2 border-white rounded-full animate-bounce" />
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                        </div>
                    )}
                </div>

                {/* 🔥 TEXT BELOW */}
                {!open && (
                    <span className="text-[10px] font-black text-white bg-indigo-600 px-3 py-1 rounded-full shadow-lg tracking-wide animate-in fade-in duration-300">
                        Book Now
                    </span>
                )}
            </button>

            {open && (
                <div className="absolute bottom-20 right-0 bg-white/95 backdrop-blur-xl p-6 rounded-[2.5rem] shadow-[0_30px_100px_-20px_rgba(0,0,0,0.4)] w-[350px] md:w-[420px] border border-white/50 max-h-[85vh] overflow-y-auto no-scrollbar animate-in slide-in-from-bottom-12 zoom-in-95 duration-500">

                    {formError && (
                        <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-xl text-sm">
                            {formError}
                        </div>
                    )}
                    {/* Heading */}
                    <div className="flex justify-between items-start mb-8">
                        <div>
                            <h2 className="text-4xl font-black text-slate-900 tracking-tighter leading-none">Book PDI</h2>
                            <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mt-2 flex items-center gap-2">
                                <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse" />
                                Step 1: Personal Details
                            </p>
                        </div>
                    </div>
                    {/* PERSONAL */}
                    <div className="space-y-1 mb-2">
                        <div className="grid grid-cols-1 gap-2">

                            <div className="relative group">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors text-lg">👤</span>
                                <input placeholder="Full Name" className="w-full border-2 border-slate-50 pl-12 p-4 rounded-2xl bg-slate-50/50 outline-none focus:border-indigo-500 focus:bg-white font-bold transition-all text-sm" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                            </div>
                            <div className="relative group flex items-center">

                                {/* +91 prefix */}
                                <span className="absolute left-12 text-slate-500 font-black text-sm">
                                    +91
                                </span>

                                {/* icon */}
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

                                        // 🔥 remove everything except digits
                                        value = value.replace(/\D/g, "");

                                        // 🔥 limit to 10 digits
                                        if (value.length > 10) return;

                                        setForm({ ...form, phone: value });
                                    }}
                                />
                            </div>
                            <div className="relative group">
                                <span className="absolute left-4 top-4 text-slate-400 text-lg">🏢</span>
                                <textarea
                                    placeholder="Location"
                                    className="w-full border-2 border-slate-50 pl-12 p-4 rounded-2xl bg-slate-50/50 outline-none focus:border-indigo-500 focus:bg-white font-bold transition-all text-sm resize-none"
                                    rows={2}
                                    value={form.location}
                                    onChange={e => setForm({ ...form, location: e.target.value })}
                                />
                            </div>
                            <div className="relative group">
                                <span className="absolute left-4 top-4 text-slate-400 text-lg">🏢</span>
                                <textarea
                                    placeholder="Address"
                                    className="w-full border-2 border-slate-50 pl-12 p-4 rounded-2xl bg-slate-50/50 outline-none focus:border-indigo-500 focus:bg-white font-bold transition-all text-sm resize-none"
                                    rows={2}
                                    value={form.inspectionLocation}
                                    onChange={e => setForm({ ...form, inspectionLocation: e.target.value })}
                                />
                            </div>

                        </div>
                    </div>

                    {/* VEHICLE */}
                    {/* VEHICLE */}
                    <Section title="Vehicle Details">
                        <div className="grid grid-cols-2 gap-3">

                            <select
                                value={form.carBrand}
                                onChange={(e) => handleBrandChange(e.target.value)}
                                className="border-2 border-slate-50 p-4 rounded-2xl bg-slate-50/50 font-black text-xs outline-none focus:border-indigo-500 appearance-none cursor-pointer"
                            >
                                <option value="">Select Brand</option>
                                {CAR_DATA.map((b) => (
                                    <option key={b.brand} value={b.brand}>
                                        {b.brand}
                                    </option>
                                ))}
                            </select>

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
                                <option value="">Select Model</option>
                                {selectedBrand?.models.map((m) => (
                                    <option key={m.name} value={m.name}>
                                        {m.name}
                                    </option>
                                ))}
                            </select>

                            <select
                                name="carYear"
                                value={form.carYear}
                                onChange={handleChange}
                                className="border-2 border-slate-50 p-4 rounded-2xl bg-slate-50/50 font-black text-xs outline-none focus:border-indigo-500 appearance-none cursor-pointer"
                            >
                                <option value="">Select Year</option>
                                {YEAR_OPTIONS.map((year) => (
                                    <option key={year} value={year}>
                                        {year}
                                    </option>
                                ))}
                            </select>

                            <select
                                name="fuelType"
                                value={form.fuelType}
                                onChange={handleChange}
                                className="border-2 border-slate-50 p-4 rounded-2xl bg-slate-50/50 font-black text-xs outline-none focus:border-indigo-500 appearance-none cursor-pointer"
                            >
                                <option value="">Fuel Type</option>
                                {FUEL_TYPES.map((fuel) => (
                                    <option key={fuel} value={fuel}>
                                        {fuel}
                                    </option>
                                ))}
                            </select>

                        </div>
                    </Section>

                    {/* SCHEDULE */}
                    <Section title="Schedule">
                        {/* Date & Slot Selection */}
                        <div className="mb-8">
                            <div className="text-[10px] font-black uppercase text-slate-400 mb-4 tracking-[0.2em] px-1 flex justify-between items-center">
                                <div className="text-[10px] font-black text-indigo-500 uppercase tracking-widest flex items-center gap-2">
                                    <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse" />
                                    Step 3: Choose Date
                                </div>

                                {form.preferredDate && (
                                    <span className="text-indigo-600">
                                        Selected: {form.preferredDate.split("-").reverse().join("/")}
                                    </span>
                                )}
                            </div>
                            <div className="grid grid-cols-7 gap-1.5">
                                {Array.from({ length: 21 }, (_, i) => {
                                    const d = new Date(); d.setDate(d.getDate() + i);
                                    const dateStr = d.toISOString().split('T')[0];
                                    const isFull = isDayFullyBlocked(dateStr);
                                    return (
                                        <button
                                            key={i} disabled={isFull}
                                            onClick={() => {
                                                if (isDayFullyBlocked(dateStr)) return;

                                                setForm(prev => ({
                                                    ...prev,
                                                    preferredDate: dateStr,
                                                    slot: "",
                                                }));
                                            }}
                                            className={`h-11 rounded-xl text-xs font-black transition-all border-2 flex flex-col items-center justify-center
                                                    ${isDayFullyBlocked(dateStr) ? "opacity-40 cursor-not-allowed" : ""}
                          ${getDayStyle(dateStr)} 
                          ${form.preferredDate === dateStr ? "ring-4 ring-indigo-500/20 scale-105 border-slate-900 shadow-xl" : "hover:brightness-95"}`}
                                        >
                                            {d.getDate()}
                                            <span className="text-[8px] opacity-60">{d.toLocaleString('default', { month: 'short' })}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {form.preferredDate && (
                            <div
                                className={`mb-8 animate-in slide-in-from-top-4 duration-500 ${isDayFullyBlocked(form.preferredDate) ? "opacity-40 pointer-events-none" : ""
                                    }`}
                            >
                                <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mt-2 flex items-center gap-2">
                                    <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse" />
                                    Step 2: Select Preferred Time
                                </p>
                                <div className="grid grid-cols-3 gap-2">
                                    {slotsConfig.map(s => {
                                        const isTaken =
                                            bookings[form.preferredDate]?.includes(s) ||
                                            blockedSlotsMap[form.preferredDate]?.includes(s);
                                        return (
                                            <button
                                                key={s} disabled={isTaken}
                                                onClick={() => {
                                                    if (isDayFullyBlocked(form.preferredDate)) return; // 🔥 safety
                                                    setForm(prev => ({
                                                        ...prev,
                                                        slot: s,
                                                    }));
                                                }}
                                                className={`py-3 text-[10px] font-black rounded-xl border-2 transition-all ${isTaken ? "bg-slate-50 border-slate-50 text-slate-300 line-through" : form.slot === s ? "border-indigo-600 bg-indigo-600 text-white" : "bg-white border-slate-100 text-slate-600 hover:border-indigo-300"}`}
                                            >
                                                {s}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                    </Section>

                    {/* PRICE */}
                    <div className="rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 p-4 text-white">

                        <div className="text-xs opacity-80">
                            Estimated Inspection Fee
                        </div>

                        <div className="text-3xl font-bold">
                            ₹{estimatedPrice}
                        </div>

                    </div>

                    {/* NOTES */}
                    <textarea
                        name="message"
                        value={form.message}
                        onChange={handleChange}
                        placeholder="Notes"
                        className="w-full border p-2 rounded-xl"
                    />

                    {/* SUBMIT */}
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="w-full bg-indigo-600 text-white py-4 rounded-xl font-black"
                    >
                        {loading ? "Booking..." : "Confirm Booking"}
                    </button>

                </div>
            )
            }
        </div >
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