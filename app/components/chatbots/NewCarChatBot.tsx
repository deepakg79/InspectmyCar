
// app/components/chatbots/NewCarChatBot.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { NewCarPlan } from "../../context/BookingContext";
// import carData from "@/app/data/carData.json";
import {
    getBookingsAndAvailability,
    createBooking
} from "@/app/lib/services/bookingService";
import {
    collection,
    query,
    where,
    getDocs,
} from "firebase/firestore";
import { db } from "@/app/lib/firebase";

// const CAR_DATA = carData.brands;

const PDI_PRICES = {
    Standard: 1499,
    Luxury: 2499,
};

const OBD_PRICES = {
    Standard: 200,
    Luxury: 799,
};
const ALL_SLOTS = ["10:30 AM", "12:00 PM", "1:30 PM", "3:00 PM", "4:30 PM", "6:00 PM"];

// ChatBot.tsx (or wherever the props are defined)
interface ChatBotProps {
    forceOpen: boolean;
    setForceOpen: (val: boolean) => void;
    initialPlan: NewCarPlan | null;
}



export default function ChatBot({ forceOpen, setForceOpen, initialPlan }: ChatBotProps) {
    const [open, setOpen] = useState(false);

    const [isConfirmed, setIsConfirmed] = useState(false);
    const [bookings, setBookings] = useState<Record<string, string[]>>({});
    const [loading, setLoading] = useState(false);
    const [isFetchingLocation, setIsFetchingLocation] = useState(false);
    const [slotsConfig, setSlotsConfig] = useState<string[]>(ALL_SLOTS);
    const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);
    const chatRef = useRef<HTMLDivElement>(null);
    const [blockedSlotsMap, setBlockedSlotsMap] = useState<Record<string, string[]>>({});
    const [fullDayBlockedMap, setFullDayBlockedMap] = useState<Record<string, boolean>>({});
    const hasFetched = useRef(false);
    type CarModel = {
        name: string;
        type: string;
    };

    type CarBrand = {
        brand: string;
        models: CarModel[];
    };

    const [carData, setCarData] = useState<CarBrand[]>([]);
    const [form, setForm] = useState({
        name: "",
        phone: "",
        brand: "",
        model: "",
        location: "",
        fullAddress: "",
        date: "",
        slot: "",
        price: 0,
        obd: false, // New: OBD option
        basic: false, // ✅ NEW: Basic option
    });

    useEffect(() => {
        if (forceOpen) setOpen(true);
    }, [forceOpen]);
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (!chatRef.current) return;

            if (!chatRef.current.contains(event.target as Node)) {
                setOpen(false);
                setIsConfirmed(false);
                if (setForceOpen) setForceOpen(false);
            }
        }

        if (open) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [open]);
    useEffect(() => {
        let isMounted = true;

        const fetchCarData = async () => {
            try {
                const res = await fetch("/api/car-models", {
                    next: {
                        revalidate: 86400
                    }
                });

                const data = await res.json();

                if (isMounted) {
                    setCarData(data.brands || []);
                }
            } catch (err) {
                console.error(err);
            }
        };

        fetchCarData();

        return () => {
            isMounted = false;
        };
    }, []);
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

    useEffect(() => {
        if (!initialPlan) return;

        setForm(prev => ({
            ...prev,
            basic: false,
            obd: false,
        }));

        switch (initialPlan) {
            case "Basic":
                handleBasicChange(true);
                break;

            case "Standard":
                handleBasicChange(false);
                handleOBDChange(false);
                break;

            case "Standard-OBD":
                handleBasicChange(false);
                handleOBDChange(true);
                break;

            case "Luxury":
                handleBasicChange(false);
                handleOBDChange(false);
                break;
        }
    }, [initialPlan]);

    const fetchBlockedSlots = async () => {
        const today = new Date().toISOString().split("T")[0];

        const q = query(
            collection(db, "blockedSlots"),
            where("date", ">=", today)
        );

        const snapshot = await getDocs(q);

        const slotMap: Record<string, string[]> = {};
        const fullMap: Record<string, boolean> = {};

        snapshot.forEach(doc => {
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
    const fetchBookings = async () => {
        try {
            const data = await getBookingsAndAvailability();

            let finalMap: Record<string, string[]> = {};

            if (data.bookings) {
                Object.keys(data.bookings).forEach(date => {
                    finalMap[date] = data.bookings[date].map((s: string) =>
                        s.toString().trim().replace(/^0/, '')
                    );
                });
            }

            setBookings(finalMap);

        } catch (err) {
            console.error("Sync failed", err);
        }
    };
    const isDayFullyBlocked = (dateStr: string) => {
        // ✅ 1. Admin full-day block (highest priority)
        if (fullDayBlockedMap[dateStr]) return true;

        const bookedCount = bookings[dateStr]?.length || 0;
        const blockedCount = blockedSlotsMap[dateStr]?.length || 0;
        const totalUsed = bookedCount + blockedCount;

        // ✅ 2. If all slots used → FULL
        return totalUsed >= slotsConfig.length;
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

    const handleLocationChange = async (val: string) => {
        setForm({ ...form, location: val });
        if (/^\d{6}$/.test(val)) {
            setIsFetchingLocation(true);
            try {
                const res = await fetch(`https://api.postalpincode.in/pincode/${val}`);
                const data = await res.json();
                if (data[0].Status === "Success") {
                    const postOffice = data[0].PostOffice[0];
                    const areaDetails = `${val} (${postOffice.Name})`;
                    setForm(prev => ({ ...prev, location: areaDetails }));
                }
            } catch (err) { console.error(err); } finally { setIsFetchingLocation(false); }
        }
    };

    const handleBrandChange = (brandName: string) => {
        setForm({ ...form, brand: brandName, model: "", price: 0 });
    };

    const handleModelChange = (modelName: string) => {
        const selectedBrand = carData.find(b => b.brand === form.brand);

        const selectedModel = selectedBrand?.models.find(
            (m: any) => m.name === modelName
        );

        if (selectedModel) {
            const basePrice =
                PDI_PRICES[selectedModel.type as keyof typeof PDI_PRICES] || 0;

            const obdPrice = form.obd
                ? OBD_PRICES[selectedModel.type as keyof typeof OBD_PRICES] || 0
                : 0;

            setForm({
                ...form,
                model: modelName,
                price: basePrice + obdPrice
            });
        }
    };

    const handleOBDChange = (checked: boolean) => {
        if (form.basic) return; // ❗ prevent if basic selected

        const selectedBrand = carData.find(b => b.brand === form.brand);
        const selectedModel =
            selectedBrand && Array.isArray(selectedBrand.models)
                ? selectedBrand.models.find(
                    (m: any) => m.name === form.model
                )
                : undefined;

        const basePrice = selectedModel
            ? PDI_PRICES[selectedModel.type as keyof typeof PDI_PRICES]
            : 0;

        const obdPrice = checked && selectedModel
            ? OBD_PRICES[selectedModel.type as keyof typeof OBD_PRICES]
            : 0;

        setForm({
            ...form,
            obd: checked,
            price: basePrice + obdPrice
        });
    };
    const handleBasicChange = (checked: boolean) => {
        const selectedBrand = carData.find(b => b.brand === form.brand);
        const selectedModel =
            selectedBrand && Array.isArray(selectedBrand.models)
                ? selectedBrand.models.find(
                    (m: any) => m.name === form.model
                )
                : undefined;

        if (!selectedModel) {
            setForm(prev => ({ ...prev, basic: checked, obd: false }));
            return;
        }

        let basePrice = PDI_PRICES[selectedModel.type as keyof typeof PDI_PRICES] || 0;

        if (checked) {
            basePrice -= 200; // 🔥 adjust discount as per your pricing
        }

        const obdPrice = (!checked && form.obd)
            ? OBD_PRICES[selectedModel.type as keyof typeof OBD_PRICES] || 0
            : 0;

        setForm({
            ...form,
            basic: checked,
            obd: checked ? false : form.obd, // ❗ disable OBD if Basic selected
            price: basePrice + obdPrice
        });
    };
    const handleSubmit = async () => {
        const isValidPhone = /^[6-9]\d{9}$/.test(form.phone);

        if (!form.name || !isValidPhone || !form.date || !form.slot || !form.location) {
            setToast({ msg: "Enter all fields with valid details first", type: "error" });
            return;
        }
        setLoading(true);

        try {
            await createBooking({
                name: form.name,
                mobile: form.phone,
                date: form.date,
                slot: form.slot,
                location: form.location,
                fullAddress: form.fullAddress,
                brand: form.brand,
                model: form.model,
                price: form.price
            });

            setToast({ msg: "Slot Reserved!", type: "success" });
            setIsConfirmed(true);
            hasFetched.current = false;
        } catch (error: any) {
            setToast({ msg: error.message || "Error", type: "error" });
        } finally {
            setLoading(false);
        }
    };

    const handleToggle = () => {
        setOpen(!open);
        if (open) {
            hasFetched.current = false;

            setOpen(false);
            setIsConfirmed(false);

            if (setForceOpen) setForceOpen(false);
        }
    };

    return (
        <div
            ref={chatRef}
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
                    {!isConfirmed ? (
                        <>
                            {/* Heading */}
                            <div className="flex justify-between items-start mb-8">
                                <div>
                                    <h2 className="text-4xl font-black text-slate-900 tracking-tighter leading-none">Book PDI</h2>
                                    <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mt-2 flex items-center gap-2">
                                        <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse" />
                                        Step 1: Vehicle Details
                                    </p>
                                </div>
                            </div>

                            {/* Form Inputs */}
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
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors text-lg">📍</span>
                                        <input placeholder="Location Pincode" className="w-full border-2 border-slate-50 pl-12 p-4 rounded-2xl bg-slate-50/50 outline-none focus:border-indigo-500 focus:bg-white font-bold transition-all text-sm pr-12" value={form.location} onChange={e => handleLocationChange(e.target.value)} />
                                        {isFetchingLocation && <div className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />}
                                    </div>
                                    <div className="relative group">
                                        <span className="absolute left-4 top-4 text-slate-400 text-lg">🏢</span>
                                        <textarea
                                            placeholder="Showroom / Full Address (Optional)"
                                            className="w-full border-2 border-slate-50 pl-12 p-4 rounded-2xl bg-slate-50/50 outline-none focus:border-indigo-500 focus:bg-white font-bold transition-all text-sm resize-none"
                                            rows={2}
                                            value={form.fullAddress}
                                            onChange={e => setForm({ ...form, fullAddress: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <select className="border-2 border-slate-50 p-4 rounded-2xl bg-slate-50/50 font-black text-xs outline-none focus:border-indigo-500 appearance-none cursor-pointer" value={form.brand} onChange={e => handleBrandChange(e.target.value)}>
                                        <option value="">Select Brand</option>
                                        {carData.map(b => <option key={b.brand} value={b.brand}>{b.brand}</option>)}
                                    </select>
                                    <select className="border-2 border-slate-50 p-4 rounded-2xl bg-slate-50/50 font-black text-xs outline-none focus:border-indigo-500 appearance-none cursor-pointer" value={form.model} disabled={!form.brand} onChange={e => handleModelChange(e.target.value)}>
                                        <option value="">Select Model</option>
                                        {carData
                                            .find(b => b.brand === form.brand)
                                            ?.models?.map((m: any) => (
                                                <option key={m.name} value={m.name}>
                                                    {m.name}
                                                </option>
                                            ))}
                                    </select>
                                </div>

                                <div className="mb-4 flex items-center justify-between">
                                    <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mt-2 flex items-center gap-2">
                                        <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse" />
                                        Step 2: Select Options
                                    </p>

                                    <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full animate-pulse">
                                        Recommended: OBD
                                    </span>
                                </div>

                                {/* BASIC OPTION */}
                                <div
                                    onClick={() => handleBasicChange(!form.basic)}
                                    className={`flex items-center justify-between p-4 rounded-2xl border-2 cursor-pointer transition-all
    ${form.basic
                                            ? "border-indigo-600 bg-indigo-50 shadow-md"
                                            : "border-slate-100 bg-slate-50 hover:border-indigo-200"}
  `}
                                >
                                    <div className="flex items-center gap-3">
                                        <input
                                            type="checkbox"
                                            checked={form.basic}
                                            onChange={(e) => handleBasicChange(e.target.checked)}
                                            className="w-5 h-5 accent-indigo-600 pointer-events-none"
                                        />
                                        <div>
                                            <p className="text-sm font-black text-slate-800">
                                                Basic PDI
                                            </p>
                                            <p className="text-xs text-slate-500 font-medium">
                                                No Gauge Check (₹200 less)
                                            </p>
                                        </div>
                                    </div>

                                    {form.basic && (
                                        <span className="text-[10px] font-black text-indigo-600 bg-white px-3 py-1 rounded-full">
                                            Selected
                                        </span>
                                    )}
                                </div>


                                {/* OBD OPTION */}
                                <div
                                    onClick={() => !form.basic && handleOBDChange(!form.obd)}
                                    className={`flex items-center justify-between p-4 rounded-2xl border-2 cursor-pointer transition-all
    ${form.basic
                                            ? "opacity-40 cursor-not-allowed"
                                            : form.obd
                                                ? "border-indigo-600 bg-indigo-50 shadow-md"
                                                : "border-slate-100 bg-slate-50 hover:border-indigo-200"}
  `}
                                >
                                    <div className="flex items-center gap-3">
                                        <input
                                            type="checkbox"
                                            checked={form.obd}
                                            disabled={form.basic}
                                            onChange={(e) => handleOBDChange(e.target.checked)}
                                            className="w-5 h-5 accent-indigo-600 pointer-events-none"
                                        />
                                        <div>
                                            <p className="text-sm font-black text-slate-800">
                                                Include OBD Check
                                            </p>
                                            <p className="text-xs text-slate-500 font-medium">
                                                Adds advanced diagnostics (+ extra fee)
                                            </p>
                                        </div>
                                    </div>

                                    {form.obd && !form.basic && (
                                        <span className="text-[10px] font-black text-indigo-600 bg-white px-3 py-1 rounded-full">
                                            Added
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Estimated Fee */}
                            {form.price > 0 && (
                                <div className="bg-slate-900 p-6 rounded-[2rem] text-white flex justify-between items-center mb-8 relative overflow-hidden group">
                                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <div className="relative z-10">
                                        <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Estimated Fee</p>
                                        <p className="text-xs font-bold text-indigo-400">Pay on-site</p>
                                    </div>
                                    <span className="text-3xl font-black relative z-10">₹{form.price}</span>
                                </div>
                            )}

                            {/* Date & Slot Selection */}
                            <div className="mb-8">
                                <div className="text-[10px] font-black uppercase text-slate-400 mb-4 tracking-[0.2em] px-1 flex justify-between items-center">
                                    <div className="text-[10px] font-black text-indigo-500 uppercase tracking-widest flex items-center gap-2">
                                        <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse" />
                                        Step 3: Choose Date
                                    </div>

                                    {form.date && (
                                        <span className="text-indigo-600">
                                            Selected: {form.date.split("-").reverse().join("/")}
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

                                                    setForm({ ...form, date: dateStr, slot: "" });
                                                }}
                                                className={`h-11 rounded-xl text-xs font-black transition-all border-2 flex flex-col items-center justify-center
                                                    ${isDayFullyBlocked(dateStr) ? "opacity-40 cursor-not-allowed" : ""}
                          ${getDayStyle(dateStr)} 
                          ${form.date === dateStr ? "ring-4 ring-indigo-500/20 scale-105 border-slate-900 shadow-xl" : "hover:brightness-95"}`}
                                            >
                                                {d.getDate()}
                                                <span className="text-[8px] opacity-60">{d.toLocaleString('default', { month: 'short' })}</span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {form.date && (
                                <div
                                    className={`mb-8 animate-in slide-in-from-top-4 duration-500 ${isDayFullyBlocked(form.date) ? "opacity-40 pointer-events-none" : ""
                                        }`}
                                >
                                    <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mt-2 flex items-center gap-2">
                                        <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse" />
                                        Step 2: Select Preferred Time
                                    </p>
                                    <div className="grid grid-cols-3 gap-2">
                                        {slotsConfig.map(s => {
                                            const isTaken =
                                                bookings[form.date]?.includes(s) ||
                                                blockedSlotsMap[form.date]?.includes(s);
                                            return (
                                                <button
                                                    key={s} disabled={isTaken}
                                                    onClick={() => {
                                                        if (isDayFullyBlocked(form.date)) return; // 🔥 safety
                                                        setForm({ ...form, slot: s });
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

                            <button
                                onClick={handleSubmit}
                                disabled={loading || !form.slot || isFetchingLocation}
                                className="w-full bg-indigo-600 text-white py-5 rounded-[1.5rem] font-black text-xl shadow-[0_15px_30px_rgba(79,70,229,0.3)] hover:bg-slate-900 hover:shadow-none transition-all active:scale-95 disabled:bg-slate-200 disabled:shadow-none"
                            >
                                {loading ? "Reserving..." : "Confirm Booking"}
                            </button>
                        </>
                    ) : (
                        <div className="py-12 text-center animate-in zoom-in duration-700">
                            <div className="w-24 h-24 bg-indigo-50 text-indigo-600 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-inner">
                                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                            </div>
                            <h2 className="text-4xl font-black text-slate-900 mb-4 tracking-tighter italic">Confirmed!</h2>
                            <p className="text-slate-500 font-medium mb-10 px-6 text-sm leading-relaxed">
                                Your inspection for the <span className="text-indigo-600 font-black">{form.model}</span> is scheduled. Our team will contact you shortly.
                            </p>
                            <div className="space-y-4">
                                <a
                                    href={`https://wa.me/919975934213?text=Booking Confirmed: ${form.brand} ${form.model} on ${form.date}`}
                                    target="_blank"
                                    className="flex items-center justify-center gap-3 w-full bg-[#25D366] text-white py-5 rounded-[1.5rem] font-black shadow-xl hover:scale-105 transition-all"
                                >
                                    WhatsApp Support
                                </a>
                                <button onClick={handleToggle} className="text-slate-400 font-black text-[10px] uppercase tracking-widest hover:text-indigo-600 transition-colors">
                                    Close Window
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
