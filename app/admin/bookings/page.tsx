// app/admin/bookings/page.tsx

"use client";
import Link from "next/link";
import { useState, useEffect, useMemo } from "react";
import { db } from "@/app/lib/firebase"
import {
    collection,
    onSnapshot,
    updateDoc,
    doc,
    deleteDoc
} from "firebase/firestore"
import { getDocs } from "firebase/firestore"
const ALL_SLOTS = ["10:30 AM", "12:00 PM", "1:30 PM", "3:00 PM", "4:30 PM", "6:00 PM"];

interface Booking {
    id: string // 👈 ADD THIS
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
    name: string;
    mobile: string;
}

export default function AdminBookings() {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [executives, setExecutives] = useState<Inspector[]>([]); // Dynamic Staff List
    const [loading, setLoading] = useState(true);
    const [mounted, setMounted] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [editing, setEditing] = useState<Booking | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [processingId, setProcessingId] = useState<string | null>(null);
    const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [selectedExecs, setSelectedExecs] = useState<Record<string, string>>({});
    const [activeDate, setActiveDate] = useState<string | null>(null);
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
    const [statusFilter, setStatusFilter] = useState<string>("All");
    const [blockedSlots, setBlockedSlots] = useState<any[]>([]);
    useEffect(() => {
        setMounted(true);
    }, []);
    const normalizeDate = (date: string | Date) => {
        const d = new Date(date);
        return d.getFullYear() +
            "-" +
            String(d.getMonth() + 1).padStart(2, "0") +
            "-" +
            String(d.getDate()).padStart(2, "0");
    };
    useEffect(() => {
        setMounted(true)

        const unsubBookings = onSnapshot(collection(db, "bookings"), (snapshot) => {
            const data: any[] = []

            snapshot.forEach(doc => {
                data.push({
                    id: doc.id,
                    ...doc.data()
                })
            })

            setBookings(
                data.reverse().map(b => ({
                    ...b,
                    date: normalizeDate(b.date)
                }))
            );
            setLoading(false)
        })

        // ✅ ADD THIS
        const unsubBlocked = onSnapshot(collection(db, "blockedSlots"), (snapshot) => {
            const data: any[] = []
            snapshot.forEach(doc => data.push(doc.data()))
            setBlockedSlots(data)
        })

        fetchExecutives()

        return () => {
            unsubBookings()
            unsubBlocked() // ✅ cleanup
        }
    }, [])
    useEffect(() => {
        if (toast) {
            const timer = setTimeout(() => setToast(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [toast]);

    const fetchExecutives = async () => {
        try {
            const snapshot = await getDocs(collection(db, "inspectors"))

            const data: any[] = []

            snapshot.forEach(doc => {
                data.push(doc.data())
            })

            setExecutives(data)
        } catch (err) {
            console.error("Staff sync failed", err)
        }
    }
    const formatLocalDate = (date: Date) => {
        return (
            date.getFullYear() +
            "-" +
            String(date.getMonth() + 1).padStart(2, "0") +
            "-" +
            String(date.getDate()).padStart(2, "0")
        );
    };
    const stats = useMemo(() => {
        const completed = bookings.filter(b => b.status === "Completed");
        const active = bookings.filter(b => b.status === "Confirmed").length;
        const revenue = completed.reduce((sum, b) => sum + (Number(b.price) || 0), 0);
        const total = bookings.length;

        const brandCounts: Record<string, number> = {};
        const last7Days = [...Array(7)].map((_, i) => {
            const d = new Date();
            d.setDate(d.getDate() - i);
            return formatLocalDate(d);
        }).reverse();
        const trend = last7Days.map(date => ({
            date,
            count: bookings.filter(b => {
                if (!b.date) return false;

                const bookingDate = new Date(b.date);
                const formatted =
                    bookingDate.getFullYear() +
                    "-" +
                    String(bookingDate.getMonth() + 1).padStart(2, "0") +
                    "-" +
                    String(bookingDate.getDate()).padStart(2, "0");

                return formatted === date;
            }).length
        }));

        bookings.forEach(b => {
            const brand = b.brand?.toLowerCase() || 'other';
            brandCounts[brand] = (brandCounts[brand] || 0) + 1;
        });

        const sortedBrands = Object.entries(brandCounts)
            .sort((a, b) => b[1] - a[1]);

        const topBrands = sortedBrands.slice(0, 3);
        const topBrand = topBrands[0]?.[0] || "N/A";
        return { revenue, active, completedCount: completed.length, total, trend, topBrand, brandCounts, topBrands };
    }, [bookings]);

    const bookingCounts = useMemo(() => {
        const counts: Record<string, number> = {};
        bookings.forEach(b => {
            const d = normalizeDate(b.date);
            counts[d] = (counts[d] || 0) + 1;
        });
        return counts;
    }, [bookings]);

    const getAvailableSlots = (date: string, currentMobile?: string) => {
        const bookedSlots = bookings
            .filter(b => b.date === date && b.mobile !== currentMobile)
            .map(b => b.slot);

        return ALL_SLOTS.filter(slot => !bookedSlots.includes(slot));
    };

    const calendarDays = useMemo(() => {
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth();

        const firstDayOfMonth = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const daysInPrevMonth = new Date(year, month, 0).getDate();

        const days = [];

        // Previous month
        for (let i = firstDayOfMonth - 1; i >= 0; i--) {
            const day = daysInPrevMonth - i;
            const date = new Date(year, month - 1, day);

            days.push({
                day,
                dateStr: formatLocalDate(date), // ✅ FIXED
                count: bookingCounts[formatLocalDate(date)] || 0,
                isOtherMonth: true
            });
        }

        // Current month
        for (let d = 1; d <= daysInMonth; d++) {
            const date = new Date(year, month, d);

            days.push({
                day: d,
                dateStr: formatLocalDate(date), // ✅ FIXED
                count: bookingCounts[formatLocalDate(date)] || 0,
                isOtherMonth: false
            });
        }

        // Next month
        const remaining = 42 - days.length;

        for (let i = 1; i <= remaining; i++) {
            const date = new Date(year, month + 1, i);

            days.push({
                day: i,
                dateStr: formatLocalDate(date), // ✅ FIXED
                count: bookingCounts[formatLocalDate(date)] || 0,
                isOtherMonth: true
            });
        }

        return days;
    }, [currentMonth, bookingCounts]);

    const updateStatus = async (b: Booking, newStatus: string) => {
        setProcessingId(b.id)

        try {
            await updateDoc(doc(db, "bookings", b.id), {
                status: newStatus
            })

            setToast({ msg: `Status: ${newStatus}`, type: "success" })
        } catch (err) {
            setToast({ msg: "Update failed", type: "error" })
        } finally {
            setProcessingId(null)
        }
    }
    const updateExecutive = async (b: Booking, execName: string) => {
        setProcessingId(b.id)

        try {
            await updateDoc(doc(db, "bookings", b.id), {
                assignedTo: execName,
                status: "Assigned"
            })

            setToast({ msg: `Assigned to ${execName}`, type: "success" })
        } catch (err) {
            setToast({ msg: "Assignment failed", type: "error" })
        } finally {
            setProcessingId(null)
        }
    }
    const deleteBooking = async (b: Booking) => {
        if (!confirm("Permanently delete this PDI?")) return

        setProcessingId(b.id)

        try {
            await deleteDoc(doc(db, "bookings", b.id))
            setToast({ msg: "Deleted successfully", type: "success" })
        } catch (err) {
            setToast({ msg: "Delete failed", type: "error" })
        } finally {
            setProcessingId(null)
        }
    }

    const sendWhatsApp = (b: Booking, type: 'reminder' | 'invoice' | 'assignment') => {
        let msg = "";
        if (type === 'reminder') {
            msg = `*Hi ${b.name}*! Confirming your PDI for ${b.date} at ${b.slot}.`;
        } else if (type === 'invoice') {
            msg = `Hi ${b.name}, your PDI is complete! Total: ₹${b.price}.`;
        } else if (type === 'assignment') {
            if (!b.assignedTo) {
                setToast({ msg: "Please assign an executive first!", type: "error" });
                return;
            }
            msg = `Hi ${b.name}! Your PDI for ${b.brand} ${b.model} is assigned to ${b.assignedTo}. They will reach ${b.location} at ${b.slot}. Track here: https://www.inspectmycar.in/track/${b.mobile}`;
        }
        const cleanMobile = (b.mobile || "")
            .replace(/\s+/g, "")   // remove spaces
            .replace(/\D/g, "")    // remove +, -, etc
            .replace(/^0+/, "");   // remove leading 0

        const finalNumber = cleanMobile.startsWith("91")
            ? cleanMobile
            : `91${cleanMobile}`;

        const url = `https://wa.me/${finalNumber}?text=${encodeURIComponent(msg)}`;

        console.log("WA FINAL:", finalNumber); // debug

        window.open(url, "_blank");
        console.log("WA URL:", `https://wa.me/91${cleanMobile}?text=${encodeURIComponent(msg)}`);
    };

    const filteredBookings = useMemo(() => {
        let data = bookings.filter(b =>
            b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            b.mobile.includes(searchTerm) ||
            b.location?.toLowerCase().includes(searchTerm.toLowerCase())
        );

        // ✅ Status Filter
        if (statusFilter !== "All") {
            data = data.filter(b => {
                if (statusFilter === "Confirmed") {
                    return b.status === "Confirmed" || b.status === "Assigned";
                }
                return b.status === statusFilter;
            });
        }

        // ✅ Date Sort
        data.sort((a, b) => {
            const d1 = new Date(a.date).getTime();
            const d2 = new Date(b.date).getTime();

            return sortOrder === "asc" ? d1 - d2 : d2 - d1;
        });

        return data;
    }, [bookings, searchTerm, statusFilter, sortOrder]);
    const updateBooking = async (updated: Booking) => {
        setSubmitting(true)

        try {
            // 🚨 Slot conflict check
            const conflict = bookings.find(
                b =>
                    b.id !== updated.id &&
                    b.date === updated.date &&
                    b.slot === updated.slot
            )

            if (conflict) {
                setToast({ msg: "Slot already booked", type: "error" })
                setSubmitting(false)
                return
            }

            await updateDoc(doc(db, "bookings", updated.id), {
                name: updated.name,
                mobile: updated.mobile,
                location: updated.location,
                date: updated.date,
                slot: updated.slot
            })

            setToast({ msg: "Updated successfully", type: "success" })
            setEditing(null)

        } catch (err) {
            setToast({ msg: "Update failed", type: "error" })
        } finally {
            setSubmitting(false)
        }
    }
    if (!mounted) return null;
    const counts = stats.trend.map(d => d.count);
    const maxCount = Math.max(...counts);
    const normalizedMax = maxCount === 0 ? 1 : maxCount;

    return (
        <div className="min-h-screen bg-[#f8fafc] p-6 md:p-10 font-sans text-slate-900 selection:bg-indigo-100 selection:text-indigo-700">

            {loading && (
                <div className="fixed inset-0 bg-white/60 backdrop-blur-md z-[200] flex flex-col items-center justify-center">
                    <div className="w-14 h-14 border-[5px] border-indigo-100 border-t-indigo-600 rounded-full animate-spin mb-4 shadow-inner"></div>
                    <p className="text-indigo-600 font-black uppercase tracking-[0.3em] text-[10px] animate-pulse">Syncing Pune Hub</p>
                </div>
            )}

            {toast && (
                <div className="fixed top-10 right-10 px-8 py-4 rounded-2xl shadow-2xl text-white z-[500] font-bold animate-in slide-in-from-right-10 duration-300 bg-slate-900">
                    {toast.msg}
                </div>
            )}

            <div className={`max-w-7xl mx-auto pt-10 transition-all duration-700 ${loading ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>

                <header className="mb-12">
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-10 gap-6">
                        <div>
                            <h1 className="text-6xl font-black tracking-tighter mb-2 text-slate-900">Operations</h1>
                            <div className="flex items-center gap-4">
                                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 flex items-center gap-2">
                                    <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                                    Live Control Center
                                </p>
                                <span className="text-[10px] font-black uppercase tracking-[0.3em] bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full">
                                    Top Brand: {stats.topBrand}
                                </span>
                            </div>
                        </div>

                        <div className="flex gap-3 w-full lg:w-auto overflow-x-auto pb-2 lg:pb-0">
                            <div className="bg-indigo-600 p-6 rounded-[2.5rem] shadow-xl shadow-indigo-200 text-white min-w-[160px]">
                                <p className="text-[9px] font-black uppercase opacity-60 mb-1">Total Revenue</p>
                                <p className="text-3xl font-black italic">₹{stats.revenue.toLocaleString()}</p>
                            </div>
                            <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm min-w-[160px]">
                                <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Avg. Ticket</p>
                                <p className="text-2xl font-black text-slate-800">
                                    ₹{stats.completedCount > 0 ? Math.round(stats.revenue / stats.completedCount).toLocaleString() : 0}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* 🔥 CHART CARD */}
                        <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm">

                            <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-6">
                                Upcoming 7-Day Bookings
                            </h4>

                            <div className="flex items-end justify-between h-56">

                                {stats.trend.map((day, i) => (
                                    <div
                                        key={i}
                                        className="flex flex-col justify-end items-center h-full"
                                        style={{ width: "40px" }}
                                    >

                                        {/* BAR */}
                                        <div
                                            className="w-8 bg-gradient-to-t from-indigo-600 to-indigo-300 rounded-t-xl transition-all duration-500"
                                            style={{
                                                height:
                                                    day.count === 0
                                                        ? "8px"
                                                        : `${(day.count / normalizedMax) * 100}%`
                                            }}
                                        />

                                        {/* VALUE */}
                                        <span className="text-[10px] font-bold text-slate-600 mt-2">
                                            {day.count}
                                        </span>

                                        {/* DATE */}
                                        <span className="text-[9px] font-black text-slate-300 uppercase">
                                            {day.date.split("-")[2]}
                                        </span>

                                    </div>
                                ))}

                            </div>
                        </div>
                        <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm">

                            <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-6">
                                Booking Summary
                            </h4>

                            {/* STATS GRID */}
                            <div className="grid grid-cols-3 gap-4 mb-6 text-center">

                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase">Total</p>
                                    <p className="text-xl font-black text-slate-800">{stats.total}</p>
                                </div>

                                <div>
                                    <p className="text-[10px] font-black text-indigo-400 uppercase">Confirmed</p>
                                    <p className="text-xl font-black text-indigo-600">{stats.active}</p>
                                </div>

                                <div>
                                    <p className="text-[10px] font-black text-emerald-400 uppercase">Completed</p>
                                    <p className="text-xl font-black text-emerald-600">{stats.completedCount}</p>
                                </div>

                            </div>

                            {/* COMPLETION RATE */}
                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-[10px] font-black uppercase text-slate-400">
                                        Completion Rate
                                    </span>
                                    <span className="text-sm font-black text-emerald-600">
                                        {Math.round((stats.completedCount / (stats.total || 1)) * 100)}%
                                    </span>
                                </div>

                                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                                    <div
                                        className="bg-emerald-500 h-full transition-all duration-1000"
                                        style={{
                                            width: `${(stats.completedCount / (stats.total || 1)) * 100}%`
                                        }}
                                    ></div>
                                </div>
                            </div>

                        </div>

                        <div className="bg-slate-900 p-8 rounded-[3rem] shadow-2xl text-white">

                            <h4 className="text-[10px] font-black uppercase tracking-widest text-indigo-400 mb-4">
                                Pune Market Share
                            </h4>

                            <div className="space-y-3">
                                {stats.topBrands.map(([brand, count], i) => {
                                    const percent = Math.round((count / (stats.total || 1)) * 100);

                                    return (
                                        <div key={brand} className="flex justify-between items-center">

                                            <span className={`text-sm font-black ${i === 0 ? "text-white" : "text-slate-300"
                                                }`}>
                                                {brand.toUpperCase()}
                                            </span>

                                            <span className={`text-sm font-black ${i === 0 ? "text-indigo-400" : "text-slate-400"
                                                }`}>
                                                {percent}%
                                            </span>

                                        </div>
                                    );
                                })}
                            </div>

                        </div>
                    </div>
                </header>

                <section className="bg-white rounded-[3rem] p-8 mb-12 shadow-sm border border-slate-100">
                    <div className="flex justify-between items-center mb-10">
                        <h2 className="text-xl font-black italic">{currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}</h2>
                        <div className="flex gap-2">
                            <div className="flex gap-2">
                                <button
                                    onClick={() =>
                                        setCurrentMonth(prev => {
                                            const d = new Date(prev);
                                            d.setMonth(d.getMonth() - 1);
                                            return d;
                                        })
                                    }
                                    className="w-12 h-12 flex items-center justify-center bg-slate-50 rounded-2xl hover:bg-indigo-50 transition-all font-bold"
                                >
                                    ←
                                </button>

                                <button
                                    onClick={() =>
                                        setCurrentMonth(prev => {
                                            const d = new Date(prev);
                                            d.setMonth(d.getMonth() + 1);
                                            return d;
                                        })
                                    }
                                    className="w-12 h-12 flex items-center justify-center bg-slate-50 rounded-2xl hover:bg-indigo-50 transition-all font-bold"
                                >
                                    →
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-7 gap-3">
                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                            <div key={d} className="text-[10px] font-black text-slate-300 uppercase text-center">{d}</div>
                        ))}
                        {calendarDays.map((item, i) => {
                            const isToday = item?.dateStr === formatLocalDate(new Date());
                            const dayBookings = item
                                ? bookings.filter(b => normalizeDate(b.date) === item.dateStr)
                                : [];
                            const isBlockedFullDay = blockedSlots.some(
                                b => b.date === item.dateStr && b.type === "date"
                            );

                            const blockedSlotsForDay = blockedSlots.filter(
                                b => b.date === item.dateStr && b.type === "slot"
                            );
                            return (
                                <div
                                    key={i}
                                    className="relative group"
                                    onClick={() => {
                                        if (!item) return;

                                        if (item.isOtherMonth) {
                                            setCurrentMonth(new Date(item.dateStr));
                                        }

                                        setActiveDate(prev => prev === item.dateStr ? null : item.dateStr);
                                    }}
                                >
                                    <div
                                        className={`h-16 md:h-24 rounded-3xl flex flex-col items-center justify-center border-2 transition-all
  ${isBlockedFullDay ? "bg-red-300 border-red-500 text-white" : ""}
  ${!isBlockedFullDay && item?.count ? "bg-indigo-600 border-indigo-600 text-white shadow-lg" : ""}
  ${!isBlockedFullDay && !item?.count ? "bg-white border-slate-50" : ""}
  ${item?.isOtherMonth ? "opacity-40" : ""}
  ${isToday && !isBlockedFullDay ? "border-indigo-600 !text-indigo-600 !bg-indigo-50" : ""}
`}
                                    >
                                        {item && (
                                            <>
                                                <span className="text-xs font-black">{item.day}</span>
                                                {item.count > 0 && <span className="text-[9px] font-black bg-white/20 px-2 py-0.5 rounded-full mt-2">{item.count}</span>}
                                            </>
                                        )}
                                    </div>
                                    {/* ✅ BLOCKED INFO */}
                                    {isBlockedFullDay && (
                                        <span className="absolute top-2 right-2 text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-black">
                                            ADMIN BLOCKED
                                        </span>
                                    )}

                                    {blockedSlotsForDay.map((b, idx) => (
                                        <p key={idx} className="text-[10px] text-red-300">
                                            🚫 {b.slot} blocked
                                        </p>
                                    ))}
                                    {item && item.count > 0 && (
                                        <div
                                            className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-4 w-60 bg-slate-900 text-white rounded-3xl p-5 shadow-2xl transition-all z-50
    ${activeDate === item.dateStr ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}
    group-hover:opacity-100`}
                                        >                                            {dayBookings.map((b, idx) => (
                                            <div key={idx} className="border-l-2 border-indigo-500 pl-3 mb-2 last:mb-0">
                                                <p className="text-[11px] font-black">{b.slot} • {b.name}</p>
                                                <p className="text-[9px] text-slate-400">{b.location}</p>
                                            </div>
                                        ))}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </section>

                <div className="relative max-w-xl mb-10">
                    <input
                        type="text"
                        placeholder="Search leads..."
                        className="w-full bg-white p-6 pl-12 rounded-[2rem] shadow-sm outline-none focus:ring-4 focus:ring-indigo-100 transition-all font-bold"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex gap-4 mb-6 flex-wrap">

                    {/* STATUS FILTER */}
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="bg-white px-4 py-3 rounded-xl border font-bold"
                    >
                        <option value="All">All Status</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Completed">Completed</option>
                        <option value="Cancelled">Cancelled</option>
                    </select>

                    {/* DATE SORT */}
                    <select
                        value={sortOrder}
                        onChange={(e) => setSortOrder(e.target.value as "asc" | "desc")}
                        className="bg-white px-4 py-3 rounded-xl border font-bold"
                    >
                        <option value="desc">Newest First</option>
                        <option value="asc">Oldest First</option>
                    </select>

                </div>
                <div className="bg-white rounded-[3rem] shadow-xl overflow-hidden border border-slate-100 mb-24">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50 text-[10px] uppercase font-black text-slate-400 border-b">
                                <tr>
                                    <th className="p-8">Client</th>
                                    <th className="p-8 text-center">Status</th>
                                    <th className="p-8">Vehicle</th>
                                    <th className="p-8 text-center">Manage</th>
                                    <th className="p-8 text-center">Messaging</th>
                                    <th className="p-8">Fleet Assignment</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {filteredBookings.map((b, i) => {
                                    const id = b.id;
                                    const currentSelection = selectedExecs[id] ?? b.assignedTo ?? "";
                                    const isRowProcessing = processingId === b.id;
                                    return (
                                        <tr key={i} className={`hover:bg-indigo-50/30 transition-all ${isRowProcessing ? 'opacity-50 pointer-events-none' : ''}`}>
                                            <td className="p-8">
                                                <p className="text-sm font-black text-slate-900">
                                                    {b.name}
                                                </p>

                                                <p className="text-xs text-slate-400">
                                                    {b.mobile} . {b.status}
                                                </p>

                                                <p className="text-xs font-bold text-slate-500 mt-1">
                                                    {b.date} • {b.slot}
                                                </p>

                                                <p className="text-xs text-slate-400 italic">
                                                    📍 {b.location}
                                                </p>

                                                <p className="text-[10px] font-black text-indigo-400 mt-1">
                                                    ID: {b.id.slice(0, 8)}
                                                </p>
                                            </td>
                                            <td className="p-8 text-center">
                                                <div className="relative inline-block">
                                                    <select
                                                        disabled={isRowProcessing}
                                                        value={b.status}
                                                        onChange={(e) => updateStatus(b, e.target.value)}
                                                        className={`text-[10px] font-black uppercase px-4 py-2 rounded-xl border-2 outline-none cursor-pointer appearance-none pr-8
                                                            ${b.status === "Completed" ? "bg-emerald-50 border-emerald-200 text-emerald-700" :
                                                                b.status === "Cancelled" ? "bg-red-50 border-red-200 text-red-700" :
                                                                    "bg-indigo-50 border-indigo-200 text-indigo-700"}`}
                                                    >
                                                        <option value="Confirmed">Confirmed</option>
                                                        <option value="Completed">Completed</option>
                                                        <option value="Cancelled">Cancelled</option>
                                                    </select>
                                                </div>
                                            </td>
                                            <td className="p-8">
                                                <p className="text-[10px] font-black text-indigo-500 uppercase">{b.brand}</p>
                                                <p className="font-black text-slate-800">{b.model}</p>
                                                <p className="text-sm font-black text-emerald-600">₹{b.price}</p>
                                            </td>
                                            <td className="p-8">
                                                <div className="flex justify-center gap-2">
                                                    <button
                                                        onClick={() => { setEditing(b) }}
                                                        className="p-3 bg-slate-100 rounded-xl hover:bg-slate-900 hover:text-white transition-all">
                                                        🖊️
                                                    </button>
                                                    <button
                                                        onClick={() => deleteBooking(b)}
                                                        className="p-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all flex items-center justify-center">
                                                        {isRowProcessing ? <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div> : "🗑️"}
                                                    </button>
                                                </div>
                                            </td>
                                            <td className="p-8 text-center">
                                                <div className="flex justify-center gap-2">
                                                    <button onClick={() => sendWhatsApp(b, 'reminder')} className="p-3 bg-[#25D366]/10 text-[#25D366] rounded-xl hover:bg-[#25D366] hover:text-white transition-all">💬</button>
                                                    <button onClick={() => sendWhatsApp(b, 'invoice')} className="p-3 bg-slate-100 rounded-xl hover:bg-slate-900 hover:text-white transition-all">📄</button>
                                                </div>
                                            </td>
                                            <td className="p-8">
                                                <div className="flex flex-col gap-2 min-w-[160px]">


                                                    <select
                                                        disabled={isRowProcessing}
                                                        value={currentSelection}
                                                        onChange={(e) => {
                                                            const value = e.target.value;

                                                            // instant UI update
                                                            setSelectedExecs(prev => ({
                                                                ...prev,
                                                                [id]: value
                                                            }));

                                                            updateExecutive(b, value);
                                                        }}
                                                        className="text-[10px] font-black bg-slate-50 border-2 border-slate-100 p-3 rounded-xl outline-none focus:border-indigo-600 focus:bg-white transition-all"
                                                    >
                                                        <option value="">Unassigned</option>
                                                        {executives.map(exec => (
                                                            <option key={exec.mobile} value={exec.name}>{exec.name}</option>
                                                        ))}
                                                    </select>

                                                    {b.assignedTo && (
                                                        <button
                                                            onClick={() => sendWhatsApp(b, 'assignment')}
                                                            className="text-[9px] font-black uppercase text-indigo-600 bg-indigo-50 py-2 rounded-lg hover:bg-indigo-600 hover:text-white transition-all shadow-sm"
                                                        >
                                                            Notify Client 📡
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* EDIT MODAL */}
            {editing && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-[300] flex items-center justify-center p-6">
                    <div className="bg-white rounded-[3rem] p-10 w-full max-w-lg shadow-2xl animate-in zoom-in duration-200 relative overflow-hidden">
                        {submitting && (
                            <div className="absolute inset-0 bg-white/80 z-10 flex flex-col items-center justify-center">
                                <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-2"></div>
                                <p className="text-[10px] font-black uppercase text-indigo-600">Updating Database...</p>
                            </div>
                        )}

                        <h2 className="text-3xl font-black mb-6 tracking-tight">Modify PDI Slot</h2>
                        <div className="space-y-4">
                            <input className="w-full bg-slate-50 p-4 rounded-2xl font-bold outline-none border-2 border-transparent focus:border-indigo-500" placeholder="Name" value={editing.name} onChange={e => setEditing({ ...editing, name: e.target.value })} />
                            <input className="w-full bg-slate-50 p-4 rounded-2xl font-bold outline-none border-2 border-transparent focus:border-indigo-500" placeholder="Mobile" value={editing.mobile} onChange={e => setEditing({ ...editing, mobile: e.target.value })} />
                            <input className="w-full bg-slate-50 p-4 rounded-2xl font-bold outline-none border-2 border-transparent focus:border-indigo-500" placeholder="Location" value={editing.location} onChange={e => setEditing({ ...editing, location: e.target.value })} />
                            <div className="grid grid-cols-2 gap-4">
                                <input type="date" className="w-full bg-slate-50 p-4 rounded-2xl font-bold outline-none" value={editing.date} onChange={e => setEditing({ ...editing, date: e.target.value })} />
                                <select className="w-full bg-slate-50 p-4 rounded-2xl font-bold outline-none" value={editing.slot} onChange={e => setEditing({ ...editing, slot: e.target.value })}>
                                    {getAvailableSlots(editing.date, editing.mobile).map(s => (
                                        <option key={s} value={s}>{s}</option>
                                    ))}                                </select>
                            </div>
                        </div>
                        <div className="flex gap-4 mt-8">
                            <button disabled={submitting} onClick={() => setEditing(null)} className="flex-1 font-black text-slate-400 hover:text-slate-600 transition-colors">Discard</button>
                            <button
                                disabled={submitting}
                                onClick={() => updateBooking(editing)}
                                className="flex-[2] bg-indigo-600 text-white py-4 rounded-2xl font-black shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center justify-center">
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}