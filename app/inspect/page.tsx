"use client";
import { useState, useEffect, useMemo, useRef } from "react";
import checklist from "@/app/lib/checklist";
import { useRouter } from "next/navigation";

// 🔥 Firebase
import {
    collection,
    addDoc,
    updateDoc,
    doc,
    query,
    where,
    getDocs
} from "firebase/firestore";

import { db } from "@/app/lib/firebase";

type ChecklistItem =
    | string
    | {
        text: string;
        label?: string;
        notFor?: string[];
        type?: "TYRE";
    };

export default function InspectionForm() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const searchInputRef = useRef<HTMLInputElement>(null);
    const [toast, setToast] = useState<string | null>(null);
    const [inspectorComments, setInspectorComments] = useState<string[]>([""]);
    const [meta, setMeta] = useState({
        mobile: "",
        name: "",
        date: new Date().toLocaleDateString('en-GB'),
        inspector: "",
        vin: "",
        odometer: "",
        brand: "",
        model: "",
        year: "",
        month: "",
        vehicleType: "" // ✅ ADD
    });

    type ResultValue =
        | number
        | { week?: string; year?: string }
        | { value: number; comment?: string };

    const [results, setResults] = useState<Record<string, ResultValue>>({});

    // ✅ LOAD FROM DASHBOARD
    useEffect(() => {

        const loadData = () => {
            const jobStr = localStorage.getItem("active_pdi");

            if (!jobStr) {
                setTimeout(loadData, 300);
                return;
            }

            const job = JSON.parse(jobStr);

            setMeta(prev => ({
                ...prev,
                name: job.name || "",
                mobile: job.mobile || "",
                brand: job.brand || "",
                model: job.model || "",
                inspector: job.inspector || job.assignedTo || ""
            }));
        };

        loadData();

    }, []);

    const handleTouchStart = (e: React.TouchEvent) => {
        if (searchInputRef.current && !searchInputRef.current.contains(e.target as Node)) {
            searchInputRef.current.blur();
        }
    };

    // ✅ VIN DECODER (UNCHANGED)
    useEffect(() => {
        const vin = meta.vin.trim().toUpperCase();
        if (vin.length >= 11) {
            const yearChar = vin[9];
            const monthChar = vin[10];

            const YEAR_CODE: any = {
                T: 2026, S: 2025, R: 2024, P: 2023, N: 2022, M: 2021,
                L: 2020, K: 2019, J: 2018, H: 2017, G: 2016, F: 2015
            };

            const MONTH_CODE: any = {
                A: "January", "1": "January", B: "February", "2": "February",
                C: "March", "3": "March", D: "April", "4": "April",
                E: "May", "5": "May", F: "June", "6": "June",
                G: "July", "7": "July", H: "August", "8": "August",
                J: "September", "9": "September", K: "October", L: "November", M: "December"
            };

            setMeta(prev => ({
                ...prev,
                year: YEAR_CODE[yearChar] ? YEAR_CODE[yearChar].toString() : prev.year,
                month: MONTH_CODE[monthChar] || prev.month
            }));
        }
    }, [meta.vin]);

    const filteredChecklist = useMemo(() => {
        if (!searchQuery.trim()) return checklist;

        return checklist.map(section => ({
            ...section,
            items: section.items.filter(item =>
                (typeof item === 'object' ? item.text : item)
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase())
            )
        })).filter(s => s.items.length > 0);
    }, [searchQuery]);

    const handleStatusChange = (id: string, value: number) => {
        setResults(prev => ({
            ...prev,
            [id]: {
                ...(typeof prev[id] === "object" && "value" in prev[id] ? prev[id] : {}),
                value
            }
        }));
    };

    // ✅ HEALTH SCORE
    const calculateScore = (arr: number[]) => {
        const ok = arr.filter(v => v === 1).length;
        return Math.round((ok / arr.length) * 100);
    };
    const getBase64ImageFromUrl = async (url: string) => {
        const res = await fetch(url);
        const blob = await res.blob();

        return new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.readAsDataURL(blob);
        });
    };

    const weeks = Array.from({ length: 52 }, (_, i) =>
        String(i + 1).padStart(2, "0")
    );

    const currentYear = new Date().getFullYear();

    const years = Array.from({ length: 10 }, (_, i) =>
        String(currentYear - i)
    );

    // 🔥 FIREBASE SUBMIT (ONLY CHANGE)
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        if (!meta.vehicleType) {
            alert("Please select vehicle type");
            setLoading(false);
            return;
        }
        const idSequence = [
            ...Array.from({ length: 300 }, (_, i) => (i + 1).toString()),
            "A", "B", "C", "D", "E"
        ];

        const checklistResults: any = {};
        const tyreData: any = {};

        idSequence.forEach((id) => {
            const item = results[id];
            // 🔥 HANDLE TYRE DATA
            if (typeof item === "object" && item && "week" in item) {
                tyreData[id] = {
                    week: item.week || "",
                    year: item.year || ""
                };
            }
            // 🔥 find checklist item again to check NA
            let checklistItem: any;

            for (const section of checklist) {
                const found = section.items.find((it: any, idx: number) => {
                    const lbl =
                        typeof it === "object" && it.label
                            ? it.label
                            : String(section.startNo + idx);
                    return lbl === id;
                });
                if (found) {
                    checklistItem = found;
                    break;
                }
            }

            const isNA =
                typeof checklistItem === "object" &&
                checklistItem.notFor &&
                checklistItem.notFor.includes(meta.vehicleType);

            if (isNA) {
                checklistResults[id] = -1; // ✅ SAVE NA
                return;
            }

            if (typeof item === "number") {
                checklistResults[id] = item;
            } else if (typeof item === "object" && item && "value" in item) {
                checklistResults[id] = item.value ?? 1;
            } else {
                checklistResults[id] = 1;
            }
        });
        const numericValues = Object.values(checklistResults).filter(
            (v): v is number => typeof v === "number" && v !== -1
        );
        const healthScore = calculateScore(numericValues);
        const finalComments = inspectorComments
            .map(c => c.trim())
            .filter(Boolean);
        try {
            // ✅ SAVE REPORT
            await addDoc(collection(db, "reports"), {
                ...meta,
                checklistResults, // only numeric
                tyreData,         // 🔥 new field
                healthScore,
                inspectorComments: finalComments,
                createdAt: new Date(),
                status: "Completed",
                approved: false
            });

            // ✅ UPDATE BOOKING
            const q = query(
                collection(db, "bookings"),
                where("mobile", "==", meta.mobile)
            );

            const snap = await getDocs(q);

            snap.forEach(async (d) => {
                await updateDoc(doc(db, "bookings", d.id), {
                    status: "Completed" // 🔥 WAITING FOR ADMIN
                });
            });
            if ((window as any).Android?.onSubmitClicked) {
                (window as any).Android.onSubmitClicked();
            }
            setToast(`Inspection Completed ✅ | Score: ${healthScore}%`);

            setTimeout(() => {
                setToast(null);
                router.push("/inspector");
            }, 2000);

            localStorage.removeItem("active_pdi");
            router.push("/inspector");

        } catch (err) {
            console.error(err);
            alert("Submission failed.");
        } finally {
            setLoading(false);
        }
    };

    // ✅ UI 100% SAME
    return (
        <div className="min-h-screen bg-slate-50 pb-40 font-sans" onTouchStart={handleTouchStart}>
            <div className="bg-slate-900 p-8 text-white rounded-b-[3rem] shadow-lg sticky top-0 z-50">
                <div className="flex justify-between items-center mb-4">
                    <button
                        type="button"
                        onClick={() => router.push("/inspector")}
                        className="text-[10px] font-black text-indigo-400 uppercase tracking-widest"
                    >
                        ← Back
                    </button>
                    <h1 className="text-xl font-black italic">PDI INSPECTION</h1>
                    <span className="text-[10px] font-black text-indigo-400">{meta.date}</span>
                </div>

                <input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Search Engine, AC, Tyre..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full p-4 bg-white/10 border border-white/20 rounded-2xl text-sm"
                />
            </div>

            <form onSubmit={handleSubmit} className="max-w-lg mx-auto p-6 space-y-6">

                {/* CUSTOMER + VEHICLE (UNCHANGED) */}
                {!searchQuery && (
                    <div className="space-y-4">

                        <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border space-y-4">
                            <input required placeholder="Inspector Name" className="w-full p-4 bg-slate-50 rounded-2xl" value={meta.inspector} onChange={e => setMeta({ ...meta, inspector: e.target.value })} />

                            <div className="grid grid-cols-2 gap-3">
                                <input required placeholder="Customer Name" className="p-4 bg-slate-50 rounded-2xl" value={meta.name} onChange={e => setMeta({ ...meta, name: e.target.value })} />
                                <input required placeholder="Mobile" className="p-4 bg-slate-50 rounded-2xl" value={meta.mobile} onChange={e => setMeta({ ...meta, mobile: e.target.value })} />
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border space-y-4">
                            <div className="grid grid-cols-2 gap-3">
                                <input required placeholder="Brand" className="p-4 bg-slate-50 rounded-2xl" value={meta.brand} onChange={e => setMeta({ ...meta, brand: e.target.value })} />
                                <input required placeholder="Model" className="p-4 bg-slate-50 rounded-2xl" value={meta.model} onChange={e => setMeta({ ...meta, model: e.target.value })} />
                            </div>

                            <input required placeholder="VIN" className="w-full p-4 bg-slate-100 rounded-2xl" value={meta.vin} onChange={e => setMeta({ ...meta, vin: e.target.value.toUpperCase() })} />

                            <div className="grid grid-cols-3 gap-3">
                                <input
                                    required
                                    placeholder="Odo"
                                    className="p-4 bg-slate-50 rounded-2xl"
                                    value={meta.odometer}
                                    onChange={e => setMeta({ ...meta, odometer: e.target.value })}
                                />
                                <p className="text-[10px] text-slate-400 font-black ml-2">
                                    Auto-filled from VIN (editable)
                                </p>
                                <input
                                    placeholder="Year"
                                    className="p-4 bg-indigo-50 rounded-2xl text-center font-bold"
                                    value={meta.year}
                                    onChange={(e) => setMeta({ ...meta, year: e.target.value })}
                                />

                                <select
                                    className="p-4 bg-indigo-50 rounded-2xl text-center font-bold"
                                    value={meta.month}
                                    onChange={(e) => setMeta({ ...meta, month: e.target.value })}
                                >
                                    <option value="">Month</option>
                                    <option>January</option>
                                    <option>February</option>
                                    <option>March</option>
                                    <option>April</option>
                                    <option>May</option>
                                    <option>June</option>
                                    <option>July</option>
                                    <option>August</option>
                                    <option>September</option>
                                    <option>October</option>
                                    <option>November</option>
                                    <option>December</option>
                                </select>
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border space-y-4">

                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                                Vehicle Type
                            </p>

                            <div className="flex gap-2 flex-wrap">
                                {["Petrol", "Diesel", "CNG", "EV"].map(type => (
                                    <button
                                        key={type}
                                        type="button"
                                        onClick={() => setMeta({ ...meta, vehicleType: type })}
                                        className={`
                    flex-1 min-w-[80px]
                    px-4 py-3
                    rounded-2xl
                    text-xs font-black
                    border transition-all
                    ${meta.vehicleType === type
                                                ? "bg-indigo-600 text-white border-indigo-600 shadow-md"
                                                : "bg-slate-50 text-slate-500 border-slate-200"}
                `}
                                    >
                                        {type}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
                <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border space-y-4">

                    <div className="flex items-center justify-between">
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                            Inspector Comments
                        </p>

                        <button
                            type="button"
                            onClick={() =>
                                setInspectorComments(prev => [...prev, ""])
                            }
                            className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-[10px] font-black uppercase"
                        >
                            + Add Comment
                        </button>
                    </div>

                    {inspectorComments.map((comment, index) => (
                        <textarea
                            key={index}
                            rows={2}
                            placeholder={`Comment ${index + 1}`}
                            value={comment}
                            onChange={(e) => {
                                const updated = [...inspectorComments];
                                updated[index] = e.target.value;
                                setInspectorComments(updated);
                            }}
                            className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm resize-none"
                        />
                    ))}

                </div>
                {/* CHECKLIST */}
                {filteredChecklist.map((section, sIdx) => (
                    <div key={sIdx} className="space-y-3">

                        {/* SECTION TITLE */}
                        <h3 className="font-black text-slate-400 text-[10px] uppercase tracking-widest ml-4">
                            {section.section}
                        </h3>

                        {/* CARD */}
                        <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 divide-y divide-slate-50 overflow-hidden">

                            {(section.items as ChecklistItem[]).map((item, iIdx) => {

                                const label =
                                    typeof item === "object" && "label" in item && item.label
                                        ? item.label
                                        : String(section.startNo + iIdx);
                                const text =
                                    typeof item === "object" && "text" in item
                                        ? item.text
                                        : String(item);
                                const notApplicable =
                                    typeof item === "object" &&
                                    "notFor" in item &&
                                    !!meta.vehicleType &&
                                    item.notFor?.includes(meta.vehicleType);
                                let currentVal =
                                    typeof results[label] === "object" && "value" in results[label]
                                        ? results[label].value
                                        : typeof results[label] === "number"
                                            ? results[label]
                                            : 1;

                                // 🔥 AUTO NA
                                if (notApplicable) currentVal = -1;



                                return (
                                    <div key={label} className="p-5 flex items-center justify-between gap-4">

                                        {/* TEXT */}
                                        <div className="flex-1">
                                            <p className="text-[9px] text-slate-300 font-black">
                                                #{label}
                                            </p>
                                            <p className="text-xs font-bold text-slate-700">
                                                {text}
                                            </p>
                                        </div>
                                        {notApplicable && (
                                            <span className="text-[10px] font-black text-slate-400">
                                                NA
                                            </span>
                                        )}
                                        {/* TOGGLE */}
                                        {typeof item === "object" && "type" in item && item.type === "TYRE" ? (
                                            // 🔥 TYRE INPUT
                                            <div className="flex gap-2">

                                                {/* WEEK */}
                                                <select
                                                    className="w-20 p-2 bg-slate-100 rounded-xl text-xs text-center font-bold"
                                                    value={
                                                        typeof results[label] === "object" && results[label] && "week" in results[label]
                                                            ? results[label].week || ""
                                                            : ""
                                                    }
                                                    onChange={(e) =>
                                                        setResults(prev => ({
                                                            ...prev,
                                                            [label]: {
                                                                ...(typeof prev[label] === "object" ? prev[label] : {}),
                                                                week: e.target.value
                                                            }
                                                        }))
                                                    }
                                                >
                                                    <option value="">Week</option>
                                                    {weeks.map(w => (
                                                        <option key={w} value={w}>{w}</option>
                                                    ))}
                                                </select>

                                                {/* YEAR */}
                                                <select
                                                    className="w-24 p-2 bg-slate-100 rounded-xl text-xs text-center font-bold"
                                                    value={
                                                        typeof results[label] === "object" && results[label] && "year" in results[label]
                                                            ? results[label].year || ""
                                                            : ""
                                                    }
                                                    onChange={(e) =>
                                                        setResults(prev => ({
                                                            ...prev,
                                                            [label]: {
                                                                ...(typeof prev[label] === "object" ? prev[label] : {}),
                                                                year: e.target.value
                                                            }
                                                        }))
                                                    }
                                                >
                                                    <option value="">Year</option>
                                                    {years.map(y => (
                                                        <option key={y} value={y}>{y}</option>
                                                    ))}
                                                </select>

                                            </div>
                                        ) : (
                                            // 🔥 NORMAL OK / ISSUE
                                            <div className="flex flex-col gap-2">

                                                {/* TOGGLE */}
                                                <div className={`flex p-1 rounded-2xl scale-90 ${notApplicable ? "bg-slate-200 opacity-60" : "bg-slate-100"
                                                    }`}>
                                                    <button
                                                        type="button"
                                                        disabled={notApplicable}
                                                        onClick={() => !notApplicable && handleStatusChange(label, 1)}
                                                        className={`px-3 py-1 text-[10px] font-black rounded-xl ${currentVal === 1 ? "bg-green-500 text-white" : "text-slate-500"
                                                            }`}
                                                    >
                                                        OK
                                                    </button>

                                                    <button
                                                        type="button"
                                                        disabled={notApplicable}
                                                        onClick={() => !notApplicable && handleStatusChange(label, 0)}
                                                        className={`px-3 py-1 text-[10px] font-black rounded-xl ${currentVal === 0 ? "bg-red-500 text-white" : "text-slate-500"
                                                            }`}
                                                    >
                                                        ISSUE
                                                    </button>
                                                </div>

                                                {/* 🔥 COMMENT INPUT (ONLY WHEN ISSUE) */}
                                                {currentVal === 0 && (
                                                    <input
                                                        type="text"
                                                        placeholder="Add comment (optional)"
                                                        className="w-32 p-2 bg-red-50 border border-red-200 rounded-xl text-[10px]"
                                                        value={
                                                            typeof results[label] === "object" && "comment" in results[label]
                                                                ? results[label].comment || ""
                                                                : ""
                                                        }
                                                        onChange={(e) =>
                                                            setResults(prev => ({
                                                                ...prev,
                                                                [label]: {
                                                                    ...(typeof prev[label] === "object" ? prev[label] : {}),
                                                                    value: 0,
                                                                    comment: e.target.value
                                                                }
                                                            }))
                                                        }
                                                    />
                                                )}
                                            </div>
                                        )}


                                    </div>
                                );
                            })}

                        </div>
                    </div>
                ))}
                <button
                    type="submit"
                    disabled={loading}
                    className={`
        w-full
        bg-slate-900
        text-white
        py-6
        rounded-[2rem]
        font-black
        uppercase
        tracking-widest
        shadow-2xl
        sticky bottom-6
        transition-all
        ${loading ? "opacity-50 cursor-not-allowed" : "active:scale-95"}
    `}
                >
                    {loading ? "Submitting..." : "Complete Report"}
                </button>

            </form>
            {toast && (
                <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[999]">
                    <div className="
            bg-slate-900 text-white
            px-6 py-4
            rounded-2xl
            shadow-2xl
            text-xs font-black uppercase tracking-widest
            animate-[fadeIn_0.3s_ease]
        ">
                        {toast}
                    </div>
                </div>
            )}
        </div>
    );
}
