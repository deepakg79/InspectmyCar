// app/admin/assign/page.tsx

"use client";
import { useState, useEffect } from "react";
import { db } from "@/app/lib/firebase"
import {
    collection,
    onSnapshot,
    getDocs,
    updateDoc,
    doc
} from "firebase/firestore"
interface Booking {
    id: string
    name: string;
    mobile: string;
    date: string;
    slot: string;
    location: string;
    status: string;
    brand: string;
    model: string;
    price: number;
    assignedTo?: string;
}

interface Inspector {
    id: string
    name: string;
    mobile: string;
}
export default function AssignPDIs() {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [inspectors, setInspectors] = useState<Inspector[]>([]);
    const [loading, setLoading] = useState(true);
    const [processingId, setProcessingId] = useState<string | null>(null);
    const [selectedExecs, setSelectedExecs] = useState<Record<string, string>>({});
    const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

    useEffect(() => {
        const unsub = onSnapshot(collection(db, "bookings"), (snapshot) => {
            const data: any[] = []

            snapshot.forEach(doc => {
                data.push({
                    id: doc.id,
                    ...doc.data()
                })
            })

            setBookings(data)
            setLoading(false)
        })

        fetchExecutives()

        return () => unsub()
    }, [])

    // Auto-hide toast
    useEffect(() => {
        if (toast) {
            const timer = setTimeout(() => setToast(null), 4000);
            return () => clearTimeout(timer);
        }
    }, [toast]);


    const fetchExecutives = async () => {
        try {
            const snapshot = await getDocs(collection(db, "inspectors"))

            const data: any[] = []

            snapshot.forEach(doc => {
                data.push({
                    id: doc.id,
                    ...doc.data()
                })
            })

            setInspectors(data)
        } catch (err) {
            console.error("Failed to load inspectors", err)
        }
    }
    const handleAssign = async (booking: Booking) => {
        const id = booking.id
        const execName = selectedExecs[id] || booking.assignedTo

        if (!execName) {
            setToast({ msg: "Please select an executive", type: "error" })
            return
        }

        setProcessingId(id)

        try {
            await updateDoc(doc(db, "bookings", booking.id), {
                assignedTo: execName
            })

            setToast({ msg: `Assigned to ${execName}`, type: "success" })
        } catch (err) {
            setToast({ msg: "Assignment failed", type: "error" })
        } finally {
            setProcessingId(null)
        }
    }
    const handleSelectChange = (booking: Booking, value: string) => {
        setSelectedExecs(prev => ({
            ...prev,
            [booking.id]: value
        }))
    }
    const isToday = (dateStr: string) => {
        const today = new Date()
        const date = new Date(dateStr)

        return (
            today.getFullYear() === date.getFullYear() &&
            today.getMonth() === date.getMonth() &&
            today.getDate() === date.getDate()
        )
    }
    const isSoon = (dateStr: string, slot: string) => {
        try {
            const [time, modifier] = slot.split(" ")
            let [hours, minutes] = time.split(":").map(Number)

            if (modifier === "PM" && hours !== 12) hours += 12
            if (modifier === "AM" && hours === 12) hours = 0

            const bookingDate = new Date(dateStr)
            bookingDate.setHours(hours, minutes, 0, 0)

            const now = new Date()
            const diff = (bookingDate.getTime() - now.getTime()) / (1000 * 60)

            return diff > 0 && diff <= 120
        } catch {
            return false
        }
    }
    return (
        <div className="space-y-10">
            {/* TOAST SYSTEM */}
            {toast && (
                <div className={`fixed top-10 right-10 z-[1000] flex items-center gap-4 px-6 py-4 rounded-[2rem] shadow-2xl border animate-in slide-in-from-right-10 duration-300 ${toast.type === "success"
                    ? "bg-slate-900 border-indigo-500/30 text-white"
                    : "bg-red-600 border-red-400 text-white"
                    }`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${toast.type === "success" ? "bg-indigo-500" : "bg-red-400"
                        }`}>
                        {toast.type === "success" ? "✓" : "!"}
                    </div>
                    <p className="font-black text-sm tracking-tight">{toast.msg}</p>
                </div>
            )}

            <header className="mb-12">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">

                    <div>
                        <h1 className="text-6xl font-black tracking-tighter mb-2 text-slate-900">
                            Assign <span className="text-indigo-600 italic">Inspectors</span>
                        </h1>

                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
                            Allocate • Manage • Dispatch
                        </p>
                    </div>

                    <div className="bg-indigo-50 px-5 py-3 rounded-2xl text-indigo-600 text-xs font-black">
                        {bookings.filter(b => b.status === "Confirmed" && (!b.assignedTo || b.assignedTo === "")).length} Pending
                    </div>

                </div>
            </header>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-32 bg-white rounded-[3rem] border border-slate-100">
                    <div className="w-16 h-16 border-[6px] border-slate-50 border-t-indigo-600 rounded-full animate-spin mb-6"></div>
                    <p className="text-slate-400 font-black text-[10px] uppercase tracking-[0.3em]">Syncing Inspector Data</p>
                </div>
            ) : (
                <div className="grid gap-8">
                    {bookings
                        .filter(b => ["Confirmed", "Assigned"].includes(b.status || "Confirmed"))
                        .sort((a, b) => {
                            const aSoon = isSoon(a.date, a.slot)
                            const bSoon = isSoon(b.date, b.slot)

                            if (aSoon && !bSoon) return -1
                            if (!aSoon && bSoon) return 1

                            const aToday = isToday(a.date)
                            const bToday = isToday(b.date)

                            if (aToday && !bToday) return -1
                            if (!aToday && bToday) return 1

                            return new Date(a.date).getTime() - new Date(b.date).getTime()
                        })
                        .map((b) => {
                            const id = b.id
                            const isProcessing = processingId === id;
                            const currentSelection = selectedExecs[id] || b.assignedTo || "";

                            return (
                                <div key={b.id} className={`bg-white group p-10 rounded-[3.5rem] border border-slate-100 flex flex-col lg:flex-row justify-between items-center gap-10 transition-all duration-500 ${isProcessing ? 'opacity-50 scale-95' : 'hover:shadow-[0_40px_80px_-15px_rgba(0,0,0,0.05)] hover:border-indigo-100'}`}>

                                    {/* Info Block */}
                                    <div className="flex-1 w-full">
                                        <div className="flex flex-wrap items-center gap-3 mb-6">
                                            <span className="text-[9px] font-black uppercase bg-slate-900 text-white px-4 py-1.5 rounded-full tracking-widest">{b.brand}</span>
                                            {b.assignedTo ? (
                                                <span className="text-[9px] font-black uppercase bg-emerald-500 text-white px-4 py-1.5 rounded-full tracking-widest flex items-center gap-2">
                                                    <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span>
                                                    Live: {b.assignedTo}
                                                </span>
                                            ) : (
                                                <span className="text-[9px] font-black uppercase bg-indigo-50 text-indigo-600 px-4 py-1.5 rounded-full tracking-widest">Awaiting Inspector</span>
                                            )}
                                        </div>
                                        <h3 className="text-4xl font-black text-slate-900 tracking-tighter mb-4 group-hover:text-indigo-600 transition-colors">{b.name}</h3>

                                        <div className="flex flex-wrap items-center gap-y-2 gap-x-6">
                                            <div className="flex items-center gap-2 text-slate-400 font-bold text-[10px] uppercase">
                                                📍 {b.location}
                                            </div>
                                            <div className="flex items-center gap-2 text-slate-400 font-bold text-[10px] uppercase">
                                                📅 {new Date(b.date).toLocaleDateString("en-IN", {
                                                    day: "numeric",
                                                    month: "short"
                                                })}
                                                <span className="opacity-40">•</span>
                                                ⏰ {b.slot}
                                            </div>
                                            {isToday(b.date) && (
                                                <span className="text-[8px] bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded-full">
                                                    TODAY
                                                </span>
                                            )}

                                            {isSoon(b.date, b.slot) && (
                                                <span className="text-[8px] bg-red-100 text-red-600 px-2 py-0.5 rounded-full animate-pulse">
                                                    URGENT
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Action Block */}
                                    <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
                                        <div className="relative w-full sm:w-72">
                                            <select
                                                disabled={isProcessing}
                                                value={currentSelection}
                                                onChange={(e) => handleSelectChange(b, e.target.value)}
                                                className="w-full bg-slate-50 p-6 rounded-[2rem] font-black text-slate-800 border-2 border-transparent focus:border-indigo-600 focus:bg-white outline-none transition-all appearance-none cursor-pointer text-sm shadow-inner"
                                            >
                                                <option value="">Select Inspector...</option>
                                                {inspectors.map(exec => (
                                                    <option key={exec.mobile} value={exec.name}>{exec.name}</option>
                                                ))}
                                            </select>
                                            <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none opacity-20 text-xs">▼</div>
                                        </div>

                                        <button
                                            disabled={isProcessing || !currentSelection || (b.assignedTo === currentSelection)}
                                            onClick={() => handleAssign(b)}
                                            className={`w-full sm:w-auto h-20 px-12 rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-4 shadow-2xl
                                                ${(b.assignedTo === currentSelection)
                                                    ? "bg-slate-100 text-slate-300 shadow-none"
                                                    : "bg-indigo-600 text-white shadow-indigo-200 hover:bg-slate-900 hover:-translate-y-1 active:scale-95"}`}
                                        >
                                            {isProcessing ? (
                                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                            ) : (
                                                b.assignedTo ? "Update Inspector" : "Deploy"
                                            )}
                                        </button>
                                    </div>
                                </div>
                            );
                        })}

                    {bookings.filter(b => b.status === "Confirmed").length === 0 && (
                        <div className="text-center py-32 bg-white rounded-[4rem] border border-slate-100 animate-in fade-in zoom-in duration-1000">
                            <div className="text-5xl mb-6 grayscale opacity-20 italic">Empty</div>
                            <p className="font-black text-slate-900 text-xl tracking-tight uppercase">Queue Clean</p>
                            <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest mt-2">All field PDIs have been assigned.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}