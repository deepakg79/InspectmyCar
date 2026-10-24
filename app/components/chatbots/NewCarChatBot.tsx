

// app/components/chatbots/NewCarChatBot.tsx

"use client";



import { useState, useEffect, useRef } from "react";

import { NewCarPlan } from "../../context/BookingContext";

// import carData from "@/app/data/carData.json";

import {

    getBookingsAndAvailability,

    checkSlotAvailability,

    createBooking

} from "@/app/lib/services/bookingService";

import {

    collection,

    query,

    where,

    getDocs,

} from "firebase/firestore";

import { db } from "@/app/lib/firebase";

import {

    CITY_PRICING,

    useCityPricing,

    type CityName,

} from "@/app/components/city_price";



// const CAR_DATA = carData.brands;



import { ALL_SLOTS } from "../../lib/slotConfig";



// ChatBot.tsx (or wherever the props are defined)

interface ChatBotProps {

    forceOpen: boolean;

    setForceOpen: (val: boolean) => void;

    initialPlan: NewCarPlan | null;

}







type FuelType = "petrol" | "diesel" | "cng" | "ev" | "hybrid";



export default function ChatBot({ forceOpen, setForceOpen, initialPlan }: ChatBotProps) {

    const [open, setOpen] = useState(false);

    const [fuelType, setFuelType] = useState<FuelType>("petrol");



    const {

        selectedCity,

        cityPricing,

        cities,

        setCity,

        newCarFuelPrice,

        newLuxuryPrice,

    } = useCityPricing();



    const [isConfirmed, setIsConfirmed] = useState(false);

    const [availability, setAvailability] = useState<

        Record<string, Record<string, number>>

    >({});

    const [inspectorCount, setInspectorCount] = useState(1);

    const [loading, setLoading] = useState(false);

    const [isFetchingLocation, setIsFetchingLocation] = useState(false);

    const [slotsConfig, setSlotsConfig] = useState<string[]>(ALL_SLOTS);

    const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

    const chatRef = useRef<HTMLDivElement>(null);

    const [blockedSlotsMap, setBlockedSlotsMap] = useState<Record<string, string[]>>({});

    const [fullDayBlockedMap, setFullDayBlockedMap] = useState<Record<string, boolean>>({});

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

        if (!open) return;



        void Promise.all([

            fetchBookings(),

            fetchBlockedSlots(),

        ]);

    }, [open, selectedCity]);



useEffect(() => {

    if (!initialPlan) return;



    const isPune = selectedCity === "Pune";



    setForm(prev => ({

        ...prev,

        basic:

            isPune && initialPlan === "Basic",

        // Standard-OBD is available in every city.
        obd:

            initialPlan === "Standard-OBD",

    }));

}, [initialPlan, selectedCity]);

useEffect(() => {

    if (!form.model) return;



    const selectedModel = getSelectedModel();



    if (!selectedModel) return;



    setForm(prev => {

        const basic =

            selectedCity === "Pune"

                ? prev.basic

                : false;



        // For non-Pune cities, `obd` selects between the two
        // Standard plans: false = without OBD, true = with OBD.
        const obd = prev.obd;



        return {

            ...prev,

            basic,

            obd,

            price: calculatePdiPrice(

                selectedModel.type,

                basic,

                obd,

                fuelType

            ),

        };

    });

}, [

    initialPlan,

    selectedCity,

    fuelType,

    form.model,

    form.brand,

    carData,

]);



    const fetchBlockedSlots = async () => {

        try {

            const today = new Date().toISOString().split("T")[0];



            const q = query(

                collection(db, "blockedSlots"),

                where("date", ">=", today)

            );



            const snapshot = await getDocs(q);



            const slotMap: Record<string, string[]> = {};

            const fullMap: Record<string, boolean> = {};



            snapshot.forEach((snapshotDoc) => {

                const data = snapshotDoc.data();



                // Legacy blocks created before city support are treated as Pune.

                const blockCity =

                    (data.city as CityName | undefined) || "Pune";



                if (blockCity !== selectedCity) return;



                const date = data.date?.toString().trim();

                if (!date) return;



                if (data.type === "date") {

                    fullMap[date] = true;

                    return;

                }



                if (data.type === "slot") {

                    const normalizedSlot = String(data.slot ?? "")

                        .trim()

                        .replace(/^0/, "");



                    if (!normalizedSlot) return;



                    if (!slotMap[date]) slotMap[date] = [];

                    if (!slotMap[date].includes(normalizedSlot)) {

                        slotMap[date].push(normalizedSlot);

                    }

                }

            });



            setBlockedSlotsMap(slotMap);

            setFullDayBlockedMap(fullMap);

        } catch (error) {

            console.error("Failed to fetch blocked slots:", error);

            setBlockedSlotsMap({});

            setFullDayBlockedMap({});

        }

    };



    const fetchBookings = async () => {

        try {

            const data = await getBookingsAndAvailability(selectedCity);



            setAvailability(data.availability || {});

            setInspectorCount(data.inspectorCount || 1);

        } catch (error) {

            console.error("Availability sync failed:", error);

            setAvailability({});

            setInspectorCount(1);

        }

    };



    const isSlotBlocked = (dateStr: string, slot: string) => {

        if (fullDayBlockedMap[dateStr]) return true;

        return blockedSlotsMap[dateStr]?.includes(slot) ?? false;

    };



    const getRemainingCapacity = (dateStr: string, slot: string) => {

        return availability[dateStr]?.[slot] ?? inspectorCount;

    };



    const isSlotUnavailable = (dateStr: string, slot: string) => {

        if (isSlotBlocked(dateStr, slot)) return true;

        return getRemainingCapacity(dateStr, slot) <= 0;

    };



    const isDayFullyBlocked = (dateStr: string) => {

        if (fullDayBlockedMap[dateStr]) return true;



        return slotsConfig.every((slot) =>

            isSlotUnavailable(dateStr, slot)

        );

    };



    const getDayStyle = (dateStr: string) => {

        if (fullDayBlockedMap[dateStr]) {

            return "bg-red-500 text-white border-red-500 opacity-40 cursor-not-allowed";

        }



        const unavailableCount = slotsConfig.filter((slot) =>

            isSlotUnavailable(dateStr, slot)

        ).length;



        const totalPossible = slotsConfig.length;



        if (unavailableCount >= totalPossible) {

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



    const handleLocationChange = async (val: string) => {

        // Location accepts free text. Only an exact 6-digit pincode

        // triggers the optional Post Office lookup.

        setForm(prev => ({ ...prev, location: val }));



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



const calculatePdiPrice = (

    vehicleType: string,

    basic: boolean,

    obd: boolean,

    selectedFuelType: FuelType = fuelType

): number => {

    // EV has one fixed city-specific price.

    if (selectedFuelType === "ev") {

        return Number(cityPricing.ev) || 0;

    }



    // Luxury pricing

    if (vehicleType === "Luxury") {

        const basePrice =

            Number(newLuxuryPrice()) || 0;



        // Basic and OBD options are available

        // only in Pune.

        if (selectedCity === "Pune") {

            if (basic) {

                return Math.max(

                    0,

                    basePrice - 200

                );

            }



            if (obd) {

                return basePrice + 799;

            }

        }



        return basePrice;

    }



    // Pune pricing

    if (selectedCity === "Pune") {

        if (basic) {

            return (

                Number(

                    newCarFuelPrice(

                        "withoutGauge"

                    )

                ) || 0

            );

        }



        if (obd) {

            return (

                Number(

                    newCarFuelPrice(

                        "withOBD"

                    )

                ) || 0

            );

        }



        return (

            Number(

                newCarFuelPrice(

                    "withGauge"

                )

            ) || 0

        );

    }



    // All cities except Pune have two Standard options:
    // false = Standard Cars w/o OBD
    // true  = Standard Cars with OBD.
    return (

        Number(

            newCarFuelPrice(

                obd ? "withOBD" : "withGauge"

            )

        ) || 0

    );

};

    const getSelectedModel = (modelName: string = form.model) => {

        const selectedBrand = carData.find(

            b => b.brand === form.brand

        );



        return selectedBrand?.models.find(

            m => m.name === modelName

        );

    };



    const handleModelChange = (modelName: string) => {

        const selectedModel = getSelectedModel(modelName);



        if (selectedModel) {

            setForm(prev => ({

                ...prev,

                model: modelName,

                price: calculatePdiPrice(

                    selectedModel.type,

                    prev.basic,

                    prev.obd,

                    fuelType

                ),

            }));

        }

    };



const handleOBDChange = (checked: boolean) => {

    // Standard OBD / non-OBD selection is available in every city.
    // Basic remains a Pune-only option and is mutually exclusive.
    if (

        form.basic ||

        fuelType === "ev"

    ) {

        return;

    }



    const selectedModel =

        getSelectedModel();



    if (!selectedModel) {

        setForm(prev => ({

            ...prev,

            obd: checked,

        }));

        return;

    }



    setForm(prev => ({

        ...prev,

        obd: checked,

        price: calculatePdiPrice(

            selectedModel.type,

            prev.basic,

            checked,

            fuelType

        ),

    }));

};

const handleBasicChange = (

    checked: boolean

) => {

    if (

        selectedCity !== "Pune" ||

        fuelType === "ev"

    ) {

        return;

    }



    const selectedModel =

        getSelectedModel();



    if (!selectedModel) {

        setForm(prev => ({

            ...prev,

            basic: checked,

            obd: false,

        }));

        return;

    }



    setForm(prev => ({

        ...prev,

        basic: checked,

        obd: checked

            ? false

            : prev.obd,

        price: calculatePdiPrice(

            selectedModel.type,

            checked,

            checked

                ? false

                : prev.obd,

            fuelType

        ),

    }));

};



useEffect(() => {

    if (!form.model) return;



    const selectedModel = getSelectedModel();



    if (!selectedModel) return;



    setForm(prev => {

        // Basic remains Pune-only.
        const basic =

            selectedCity === "Pune"

                ? prev.basic

                : false;



        // In every city, `obd` determines the Standard plan:
        // false = without OBD, true = with OBD.
        const obd = prev.obd;



        return {

            ...prev,

            basic,

            obd,

            price: calculatePdiPrice(

                selectedModel.type,

                basic,

                obd,

                fuelType

            ),

        };

    });

}, [selectedCity, fuelType]);



    const handleSubmit = async () => {

        const isValidPhone = /^[6-9]\d{9}$/.test(form.phone);



        // Validate each field separately so a location/pincode problem

        // never produces a misleading brand/model error. Location is free text.

        if (!form.name.trim()) {

            setToast({ msg: "Please enter your name.", type: "error" });

            return;

        }



        if (!isValidPhone) {

            setToast({ msg: "Please enter a valid 10 digit mobile number.", type: "error" });

            return;

        }



        if (!form.location.trim()) {

            setToast({ msg: "Please enter your location or pincode.", type: "error" });

            return;

        }



        if (!form.brand) {

            setToast({ msg: "Please select your car brand.", type: "error" });

            return;

        }



        if (!form.model) {

            setToast({ msg: "Please select your car model.", type: "error" });

            return;

        }



        if (!form.date) {

            setToast({ msg: "Please select an inspection date.", type: "error" });

            return;

        }



        if (!form.slot) {

            setToast({ msg: "Please select an inspection time slot.", type: "error" });

            return;

        }



        setLoading(true);



        try {

            // Re-check admin blocks immediately before booking.

            await fetchBlockedSlots();



            if (isSlotBlocked(form.date, form.slot)) {

                setToast({

                    msg: "This slot is blocked by the admin. Please select another slot.",

                    type: "error",

                });

                return;

            }



            // Fresh city/date/slot capacity check. This catches a booking

            // created after the calendar was loaded. createBooking also

            // performs the final transaction-safe capacity check.

            const latestAvailability = await checkSlotAvailability({

                city: selectedCity,

                date: form.date,

                slot: form.slot,

            });



            if (!latestAvailability.available) {

                setToast({

                    msg: `This ${selectedCity} slot is already reserved or No inspector is available. Please select another slot.`,

                    type: "error",

                });

                await fetchBookings();

                return;

            }



await createBooking({

    name: form.name,

    mobile: form.phone,

    date: form.date,

    slot: form.slot,

    location: form.location,

    fullAddress: form.fullAddress,

    brand: form.brand,

    model: form.model,

    city: selectedCity,

    price: form.price

});



// Clear the form after successful booking.

setForm({

    name: "",

    phone: "",

    brand: "",

    model: "",

    location: "",

    fullAddress: "",

    date: "",

    slot: "",

    price: 0,

    obd: false,

    basic: false,

});



setFuelType("petrol");



setToast({

    msg: "Slot Reserved!",

    type: "success",

});



setIsConfirmed(true);

        } catch (error: any) {

            setToast({ msg: error.message || "Error", type: "error" });

        } finally {

            setLoading(false);

        }

    };



    const handleToggle = () => {

        setOpen(!open);

        if (open) {

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



                            {/* City Selection */}

                            <div className="mb-5 rounded-2xl border-2 border-indigo-100 bg-indigo-50/70 p-4">

                                <div className="flex items-center justify-between gap-3 mb-2">

                                    <div>

                                        <p className="text-[10px] font-black uppercase tracking-widest text-indigo-500">

                                            Select Inspection City

                                        </p>

                                        <p className="text-xs font-bold text-slate-500 mt-1">

                                           PDI price varies by city. Select your city to see the estimated price.

                                        </p>

                                    </div>

                                    <span className="text-lg">📍</span>

                                </div>



                                <select

                                    value={selectedCity}

                                    onChange={(e) => {

                                        const nextCity = e.target.value as CityName;

                                        setCity(nextCity);

                                        setForm(prev => ({

                                            ...prev,

                                            date: "",

                                            slot: "",

                                        }));

                                    }}

                                    className="w-full border-2 border-white p-4 rounded-2xl bg-white font-black text-sm text-slate-800 outline-none focus:border-indigo-500 shadow-sm cursor-pointer"

                                >

                                    {cities.map(city => (

                                        <option key={city} value={city}>

                                            {CITY_PRICING[city].name}

                                        </option>

                                    ))}

                                </select>

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

                            {/* Fuel Type / Variant Selection */}

                            <div className="mb-5 rounded-2xl border-2 border-slate-100 bg-white p-4 shadow-sm">

                                <div className="flex items-center justify-between gap-3 mb-2">

                                    <div>

                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">

                                            Fuel Type

                                        </p>

                                        <p className="text-xs font-bold text-slate-400 mt-1">

                                            Select your vehicle fuel type

                                        </p>

                                    </div>

                                    <span className="text-lg">⛽</span>

                                </div>



                                <select

                                    value={fuelType}

                                    onChange={(e) => {

                                        const value = e.target.value as FuelType;

                                        setFuelType(value);



                                        const selectedModel = getSelectedModel();



                                        if (selectedModel) {

                                            setForm(prev => ({

                                                ...prev,

                                                basic: value === "ev" ? false : prev.basic,

                                                obd: value === "ev" ? false : prev.obd,

                                                price: calculatePdiPrice(

                                                    selectedModel.type,

                                                    value === "ev" ? false : prev.basic,

                                                    value === "ev" ? false : prev.obd,

                                                    value

                                                ),

                                            }));

                                        }

                                    }}

                                    className="w-full border-2 border-slate-100 p-4 rounded-2xl bg-slate-50 font-black text-sm text-slate-800 outline-none focus:border-indigo-500 focus:bg-white transition-all cursor-pointer"

                                >

                                    <option value="petrol">Petrol</option>

                                    <option value="diesel">Diesel</option>

                                    <option value="cng">CNG</option>

                                    <option value="ev">EV</option>

                                    <option value="hybrid">Hybrid</option>

                                </select>



                                {fuelType === "ev" && (

                                    <p className="mt-2 text-[10px] font-bold text-emerald-600">

                                        EV pricing applied automatically for {cityPricing.name}.

                                    </p>

                                )}

                            </div>

                                <div className="mb-4 flex items-center justify-between">

                                    <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mt-2 flex items-center gap-2">

                                        <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse" />

                                        Step 2: Select Options

                                    </p>



                                    {fuelType === "ev" ? (

                                        <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">

                                            Fixed EV Pricing

                                        </span>

                                    ) : (

                                        <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full animate-pulse">

                                            Recommended: OBD

                                        </span>

                                    )}

                                </div>



{/* BASIC OPTION — PUNE ONLY */}

{selectedCity === "Pune" && (

    <div

        onClick={() => {

            if (fuelType !== "ev") {

                handleBasicChange(!form.basic);

            }

        }}

        className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all

            ${

                fuelType === "ev"

                    ? "opacity-40 cursor-not-allowed border-slate-100 bg-slate-50"

                    : form.basic

                        ? "border-indigo-600 bg-indigo-50 shadow-md cursor-pointer"

                        : "border-slate-100 bg-slate-50 hover:border-indigo-200 cursor-pointer"

            }

        `}

    >

        <div className="flex items-center gap-3">

            <input

                type="checkbox"

                checked={form.basic}

                disabled={fuelType === "ev"}

                onChange={(e) =>

                    handleBasicChange(

                        e.target.checked

                    )

                }

                className="w-5 h-5 accent-indigo-600 pointer-events-none"

            />

            <div>

                <p className="text-sm font-black text-slate-800">

                    Basic PDI

                </p>

                <p className="text-xs text-slate-500 font-medium">

                    {fuelType === "ev"

                        ? "Not applicable for EV"

                        : "No Gauge Check (₹200 less)"}

                </p>

            </div>

        </div>

        {form.basic && (

            <span className="text-[10px] font-black text-indigo-600 bg-white px-3 py-1 rounded-full">

                Selected

            </span>

        )}

    </div>

)}


{/* STANDARD WITHOUT OBD — AVAILABLE IN ALL CITIES */}

<div

    onClick={() => {

        if (fuelType !== "ev" && !form.basic) {

            handleOBDChange(false);

        }

    }}

    className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all

        ${

            fuelType === "ev" || form.basic

                ? "opacity-40 cursor-not-allowed border-slate-100 bg-slate-50"

                : !form.obd

                    ? "border-indigo-600 bg-indigo-50 shadow-md cursor-pointer"

                    : "border-slate-100 bg-slate-50 hover:border-indigo-200 cursor-pointer"

        }

    `}

>

    <div className="flex items-center gap-3">

        <input

            type="radio"

            name="new-car-standard-option"

            checked={!form.obd && !form.basic}

            disabled={fuelType === "ev" || form.basic}

            onChange={() => handleOBDChange(false)}

            className="w-5 h-5 accent-indigo-600 pointer-events-none"

        />

        <div>

            <p className="text-sm font-black text-slate-800">

                Standard Cars w/o OBD

            </p>

            <p className="text-xs text-slate-500 font-medium">

                Gauge Check + Paint Thickness Test

            </p>

        </div>

    </div>

    {!form.obd && !form.basic && fuelType !== "ev" && (

        <span className="text-[10px] font-black text-indigo-600 bg-white px-3 py-1 rounded-full">

            Selected

        </span>

    )}

</div>


{/* STANDARD WITH OBD — AVAILABLE IN ALL CITIES */}

<div

    onClick={() => {

        if (fuelType !== "ev" && !form.basic) {

            handleOBDChange(true);

        }

    }}

    className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all

        ${

            fuelType === "ev" || form.basic

                ? "opacity-40 cursor-not-allowed border-slate-100 bg-slate-50"

                : form.obd

                    ? "border-indigo-600 bg-indigo-50 shadow-md cursor-pointer"

                    : "border-slate-100 bg-slate-50 hover:border-indigo-200 cursor-pointer"

        }

    `}

>

    <div className="flex items-center gap-3">

        <input

            type="radio"

            name="new-car-standard-option"

            checked={form.obd && !form.basic}

            disabled={fuelType === "ev" || form.basic}

            onChange={() => handleOBDChange(true)}

            className="w-5 h-5 accent-indigo-600 pointer-events-none"

        />

        <div>

            <p className="text-sm font-black text-slate-800">

                Standard Cars with OBD

            </p>

            <p className="text-xs text-slate-500 font-medium">

                Gauge Check + Advanced OBD Diagnostics

            </p>

        </div>

    </div>

    {form.obd && !form.basic && fuelType !== "ev" && (

        <span className="text-[10px] font-black text-indigo-600 bg-white px-3 py-1 rounded-full">

            Selected

        </span>

    )}

</div>
                            </div>



                            {/* Estimated Fee */}

                            {form.price > 0 && (

                                <div className="mb-8">

                                    <div className="bg-slate-900 p-6 rounded-[2rem] text-white flex justify-between items-center relative overflow-hidden group">

                                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                                        <div className="relative z-10">

                                            <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Estimated Fee</p>

                                            <p className="text-xs font-bold text-indigo-400">Pay on-site</p>

                                        </div>

                                        <span className="text-3xl font-black relative z-10">₹{form.price}</span>

                                    </div>



                                    <p className="mt-2.5 text-[10px] text-slate-400 text-center">

                                        * Estimate is calculated using the selected city and vehicle type.

                                    </p>

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

                                    <div>

                                        <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mt-2 flex items-center gap-2">

                                            <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse" />

                                            Step 2: Select Preferred Time

                                        </p>

                                        <p className="text-[9px] font-bold text-slate-400 mt-1">

                                            {inspectorCount} inspector{inspectorCount === 1 ? "" : "s"} available in {cityPricing.name}

                                        </p>

                                    </div>

                                    <div className="grid grid-cols-3 gap-2">

                                        {slotsConfig.map(s => {

                                            const isBlocked = isSlotBlocked(form.date, s);

                                            const remaining = getRemainingCapacity(form.date, s);

                                            const isTaken = isBlocked || remaining <= 0;



                                            return (

                                                <button

                                                    key={s}

                                                    disabled={isTaken}

                                                    onClick={() => {

                                                        if (isDayFullyBlocked(form.date)) return;

                                                        if (isTaken) return;

                                                        setForm({ ...form, slot: s });

                                                    }}

                                                    className={`py-3 text-[10px] font-black rounded-xl border-2 transition-all ${isTaken ? "bg-slate-50 border-slate-50 text-slate-300 line-through" : form.slot === s ? "border-indigo-600 bg-indigo-600 text-white" : "bg-white border-slate-100 text-slate-600 hover:border-indigo-300"}`}

                                                >

                                                    {s}

                                                    {!isTaken && inspectorCount > 1 && (

                                                        <span className="block text-[8px] mt-0.5 opacity-70">

                                                            {remaining} {remaining === 1 ? "slot" : "slots"} left

                                                        </span>

                                                    )}

                                                </button>

                                            );

                                        })}

                                    </div>

                                </div>

                            )}



                            <button

                                onClick={handleSubmit}

                                disabled={

                                    loading ||

                                    !form.brand ||

                                    !form.model ||

                                    !form.slot ||

                                    isFetchingLocation

                                }

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
