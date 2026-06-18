"use client";
import { useState, useEffect, useMemo } from "react";

// 🔥 Firebase
import { db } from "@/app/lib/firebase";
import { collection, onSnapshot } from "firebase/firestore";

interface Booking {
    name: string;
    date: string;
    status: string;
    brand: string;
    price: number;
    assignedTo?: string; // ✅ ADD THIS
}

export default function MonthlyStats() {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedMonth, setSelectedMonth] = useState<string>("");
    // 🔥 FIREBASE REALTIME
    useEffect(() => {
        const unsub = onSnapshot(collection(db, "bookings"), (snapshot) => {
            const data: Booking[] = [];

            snapshot.forEach(doc => {
                const d = doc.data();

                data.push({
                    name: d.name,
                    date: d.date,
                    status: d.status,
                    brand: d.brand,
                    price: Number(d.price) || 0,
                    assignedTo: d.assignedTo || ""
                });
            });

            setBookings(data);
            setLoading(false);
        });

        return () => unsub();
    }, []);
    const availableMonths = useMemo(() => {
        const set = new Set<string>();

        bookings.forEach(b => {
            if (!b.date) return;

            const parts = b.date.split(/[/ -]/);
            if (parts.length !== 3) return;

            let m, y;

            if (parts[0].length === 4) {
                y = parts[0];
                m = parts[1];
            } else {
                m = parts[1];
                y = parts[2];
            }

            set.add(`${m}-${y}`);
        });

        return Array.from(set).sort().reverse();
    }, [bookings]);

    useEffect(() => {
        if (!availableMonths.length || selectedMonth) return;

        const now = new Date();
        const currentKey = `${String(now.getMonth() + 1).padStart(2, "0")}-${now.getFullYear()}`;

        if (availableMonths.includes(currentKey)) {
            setSelectedMonth(currentKey);
        } else {
            setSelectedMonth(availableMonths[0]); // fallback
        }
    }, [availableMonths]);

    const analytics = useMemo(() => {
        const monthsOrder = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

        const activeBookings = bookings.filter(b =>
            ["Completed", "Confirmed"].includes(b.status)
        );

        // 🔥 Monthly Revenue
        const monthlyRev: Record<string, number> = {};

        activeBookings.forEach(b => {
            const parts = b.date?.split(/[/ -]/);
            if (!parts || parts.length !== 3) return;

            const monthIdx = parseInt(parts[1]) - 1;
            const month = monthsOrder[monthIdx];

            if (!month) return;

            monthlyRev[month] = (monthlyRev[month] || 0) + b.price;
        });

        // 🔥 Brand Stats
        const brandStats: Record<string, { count: number; revenue: number }> = {};

        bookings.forEach(b => {
            const brand = b.brand?.toUpperCase() || "OTHER";
            if (!brandStats[brand]) brandStats[brand] = { count: 0, revenue: 0 };

            brandStats[brand].count++;
            brandStats[brand].revenue += b.price;
        });

        const sortedBrands = Object.entries(brandStats)
            .sort((a, b) => b[1].count - a[1].count)
            .slice(0, 5);

        // 🔥 Totals
        const totalRevenue = activeBookings.reduce((s, b) => s + b.price, 0);
        const totalBookings = bookings.length;

        // 🔥 Avg revenue
        const avgRevenue = totalRevenue / (totalBookings || 1);

        // 🔥 Month logic (prev, current, next)
        const now = new Date();
        const currentMonthIndex = now.getMonth();

        const getMonth = (i: number) =>
            monthsOrder[(i + 12) % 12];

        const displayMonths = [
            getMonth(currentMonthIndex - 1),
            getMonth(currentMonthIndex),
            getMonth(currentMonthIndex + 1)
        ];

        // 🔥 Growth %
        const prev = monthlyRev[displayMonths[0]] || 0;
        const curr = monthlyRev[displayMonths[1]] || 0;

        const growth = (curr - prev) / (prev || 1);

        // 🔥 Best / Worst
        const sortedMonths = Object.entries(monthlyRev).sort((a, b) => b[1] - a[1]);

        const bestMonth = sortedMonths[0]?.[0];

        const visibleMonths: [string, number][] = displayMonths.map(m => [
            m,
            monthlyRev[m] || 0
        ]);
        const sortedVisible = visibleMonths.sort((a, b) => b[1] - a[1]);


        const worstMonth = sortedVisible[sortedVisible.length - 1]?.[0];

        const statusStats = {
            confirmed: bookings.filter(b => b.status === "Confirmed").length,
            completed: bookings.filter(b => b.status === "Completed").length,
            approved: bookings.filter(b => b.status === "Approved").length
        };
        const weeklyRev: Record<string, number> = {
            W1: 0,
            W2: 0,
            W3: 0,
            W4: 0,
            W5: 0,
        };

        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();

        activeBookings.forEach(b => {
            if (!b.date) return;

            const parts = b.date.split(/[/ -]/);
            if (parts.length !== 3) return;

            let day, month, year;

            if (parts[0].length === 4) {
                // YYYY-MM-DD
                year = parseInt(parts[0]);
                month = parseInt(parts[1]) - 1;
                day = parseInt(parts[2]);
            } else {
                // DD-MM-YYYY
                day = parseInt(parts[0]);
                month = parseInt(parts[1]) - 1;
                year = parseInt(parts[2]);
            }

            if (month !== currentMonth || year !== currentYear) return;

            const week = Math.min(4, Math.floor((day - 1) / 7)); // 0–4

            const key = `W${week + 1}`;
            weeklyRev[key] += b.price;
        });

        const selectedBookings = bookings.filter(b => {
            if (!b.date || !selectedMonth) return false;

            const parts = b.date.split(/[/ -]/);

            let m, y;

            if (parts[0].length === 4) {
                y = parts[0];
                m = parts[1];
            } else {
                m = parts[1];
                y = parts[2];
            }

            return `${m}-${y}` === selectedMonth;
        });

        const monthInsights = {
            totalBookings: selectedBookings.length,

            totalRevenue: selectedBookings.reduce(
                (s, b) => s + (b.price || 0),
                0
            ),

            topBrand: (() => {
                const map: Record<string, number> = {};
                selectedBookings.forEach(b => {
                    const brand = b.brand || "Other";
                    map[brand] = (map[brand] || 0) + 1;
                });

                return Object.entries(map)
                    .sort((a, b) => b[1] - a[1])[0]?.[0] || "N/A";
            })(),

            topInspector: (() => {
                const map: Record<string, number> = {};
                selectedBookings.forEach(b => {
                    const ins = b.assignedTo || "Unassigned";
                    map[ins] = (map[ins] || 0) + 1;
                });

                return Object.entries(map)
                    .sort((a, b) => b[1] - a[1])[0]?.[0] || "N/A";
            })()
        };


        return {
            monthlyRev,
            displayMonths,
            sortedBrands,
            totalRevenue,
            totalBookings,
            avgRevenue,
            growth,
            bestMonth,
            worstMonth,
            statusStats,
            weeklyRev,
            monthInsights,

        };

    }, [bookings, selectedMonth]);

    const prevMonth = analytics.displayMonths[0];
    const currMonth = analytics.displayMonths[1];

    const growth =
        ((analytics.monthlyRev[currMonth] || 0) -
            (analytics.monthlyRev[prevMonth] || 0)) /
        (analytics.monthlyRev[prevMonth] || 1);

    const formatMonth = (val: string) => {
        const [m, y] = val.split("-");
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        return `${months[parseInt(m) - 1]} ${y}`;
    };
    if (loading) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#f8fafc]">
            <div className="w-12 h-12 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Syncing Hub Data...</p>
        </div>
    );

    return (
        <div className="space-y-10 overflow-x-hidden">

            <header className="mb-12">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">

                    <div>
                        <h1 className="text-3xl md:text-6xl font-black tracking-tighter mb-2 text-slate-900">
                            Market <span className="text-indigo-600 italic">Analytics</span>
                        </h1>

                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
                            Revenue • Performance • Trends
                        </p>
                    </div>

                    <div className="bg-indigo-50 px-5 py-3 rounded-2xl text-indigo-600 text-xs font-black">
                        {analytics.totalBookings} Records
                    </div>

                </div>
            </header>

            {/* KPI CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">

                <div className="bg-indigo-600 p-10 rounded-[3rem] shadow-2xl text-white transition-transform hover:scale-[1.02]">
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-2">
                        Total Gross Revenue
                    </p>
                    <p className="text-5xl font-black tracking-tighter">
                        ₹{analytics.totalRevenue.toLocaleString()}
                    </p>
                </div>

                <div className="bg-slate-900 p-10 rounded-[3rem] shadow-2xl text-white transition-transform hover:scale-[1.02]">
                    <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-2">
                        Inspections Logged
                    </p>
                    <p className="text-4xl font-black tracking-tighter uppercase italic truncate">
                        {analytics.totalBookings}
                    </p>
                </div>

                <div className="bg-slate-900 p-10 rounded-[3rem] shadow-2xl text-white transition-transform hover:scale-[1.02]">
                    <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-2">
                        Top Market Brand
                    </p>
                    <p className="text-4xl font-black tracking-tighter uppercase italic truncate">
                        {analytics.sortedBrands[0]?.[0] || "N/A"}
                    </p>
                </div>

                <div className="bg-slate-900 p-10 rounded-[3rem] shadow-2xl text-white transition-transform hover:scale-[1.02]">
                    <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-2">
                        Rise this month
                    </p>
                    <p className={`text-xs font-black mt-2 ${growth >= 0 ? "text-emerald-500" : "text-red-500"
                        }`}>
                        {growth >= 0 ? "+" : ""}{(growth * 100).toFixed(0)}%
                    </p>
                </div>
            </div>
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm lg:col-span-2">

                {/* HEADER */}
                <div className="flex justify-between items-center mb-6">

                    <h3 className="text-xl font-black">Monthly Insights</h3>

                    <select
                        value={selectedMonth}
                        onChange={(e) => setSelectedMonth(e.target.value)}
                        className="bg-slate-50 border border-slate-200 px-4 py-2 rounded-xl text-sm font-bold"
                    >
                        {availableMonths.map(m => (
                            <option key={m} value={m}>
                                {formatMonth(m)}
                            </option>
                        ))}
                    </select>

                </div>

                {/* CONTENT */}
                {analytics.monthInsights && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">

                        <div className="bg-indigo-50 p-5 rounded-2xl">
                            <p className="text-xs text-indigo-600 font-black">Bookings</p>
                            <p className="text-2xl font-black text-indigo-700">
                                {analytics.monthInsights.totalBookings}
                            </p>
                        </div>

                        <div className="bg-indigo-50 p-5 rounded-2xl">
                            <p className="text-xs text-indigo-600 font-black">Revenue</p>
                            <p className="text-2xl font-black text-indigo-700">
                                ₹{analytics.monthInsights.totalRevenue.toLocaleString()}
                            </p>
                        </div>

                        <div className="bg-indigo-50 p-5 rounded-2xl">
                            <p className="text-xs text-indigo-600 font-black">Top Inspector</p>
                            <p className="text-sm font-black text-indigo-700">
                                {analytics.monthInsights.topInspector}
                            </p>
                        </div>

                        <div className="bg-indigo-50 p-5 rounded-2xl">
                            <p className="text-xs text-indigo-600 font-black">Top Brand</p>
                            <p className="text-sm font-black text-indigo-700">
                                {analytics.monthInsights.topBrand}
                            </p>
                        </div>

                    </div>
                )}

            </div>

            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">

                <div className="flex items-center gap-3 w-full min-w-0">
                    <h3 className="text-xl font-black">Weekly Trend</h3>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                        Current Month
                    </p>
                </div>

                {(() => {
                    const values = Object.values(analytics.weeklyRev);
                    const max = Math.max(...values, 1);

                    return (
                        <div className="space-y-4">

                            {Object.entries(analytics.weeklyRev).map(([week, value]) => {
                                const width = (value / max) * 100;

                                return (
                                    <div key={week} className="flex items-center gap-4">

                                        {/* LABEL */}
                                        <span className="w-8 text-xs font-black text-slate-500">
                                            {week}
                                        </span>

                                        {/* BAR */}
                                        <div className="flex-1 min-w-0 h-3 bg-slate-100 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-indigo-600 rounded-full transition-all duration-700"
                                                style={{ width: `${width}%` }}
                                            />
                                        </div>

                                        {/* VALUE */}
                                        <span className="text-xs font-black text-slate-500 shrink-0 max-w-[80px] truncate text-right">
                                            ₹{value.toLocaleString()}
                                        </span>

                                    </div>
                                );
                            })}

                        </div>
                    );
                })()}

            </div>


            <div className="grid lg:grid-cols-2 gap-10">





                {/* REVENUE CHART */}
                <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col justify-between min-h-[500px] relative overflow-hidden">

                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-100/40 rounded-full -mr-16 -mt-16 blur-3xl"></div>
                    <div className="mb-10 space-y-4">

                        {/* TOP ROW */}
                        <div className="flex justify-between items-center">
                            <h3 className="text-xl font-black">Revenue</h3>

                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                                3 Months Trend
                            </p>
                        </div>

                        {/* SECOND ROW */}
                        <div className="flex justify-between text-[12px] text-slate-400">
                            <span>⚠ Lowest: {analytics.worstMonth}</span>
                            <span>🔥 Best: {analytics.bestMonth}</span>
                        </div>

                    </div>

                    <div className="flex items-end justify-around h-64 gap-6 px-4">

                        {analytics.displayMonths.map((month) => {
                            const rev = analytics.monthlyRev[month] || 0;

                            const values = Object.values(analytics.monthlyRev);
                            const max = values.length > 0 ? Math.max(...values) : 1;

                            // const height = max > 0 ? (rev / max) * 100 : 0;
                            const height = (rev / max) * 100;
                            return (
                                <div key={month} className="flex-1 flex flex-col items-center h-full justify-end">

                                    {rev > 0 && (
                                        <p className="text-xs font-black mb-2">
                                            ₹{rev.toLocaleString()}
                                        </p>
                                    )}

                                    <div
                                        style={{ height: `${height}%`, minHeight: rev > 0 ? "20px" : "6px" }}
                                        className={`w-full rounded-2xl transition-all duration-700 ${rev > 0
                                            ? "bg-indigo-600 shadow-xl shadow-indigo-200/40"
                                            : "bg-slate-100 border border-dashed"
                                            }`}
                                    />

                                    <p className="mt-4 text-xs font-black text-indigo-600 uppercase">
                                        {month}
                                    </p>

                                </div>

                            );

                        })}

                    </div>
                </div>

                {/* BRAND SHARE */}
                <div className="bg-slate-900 p-12 rounded-[4rem] shadow-2xl text-white flex flex-col">

                    <div className="mb-10">
                        <h3 className="text-2xl font-black text-indigo-400 italic">
                            Market Share
                        </h3>
                        <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">
                            Fleet Leaderboard
                        </p>
                    </div>

                    <div className="space-y-8">

                        {analytics.sortedBrands.map(([brand, stats], i) => {
                            const percentage = Math.round(
                                (stats.count / (analytics.totalBookings || 1)) * 100
                            );

                            return (
                                <div key={i}>

                                    <div className="flex justify-between mb-2">
                                        <p className="font-black uppercase italic">
                                            {brand}
                                        </p>
                                        <p className="text-[10px] text-indigo-400">
                                            {percentage}%
                                        </p>
                                    </div>

                                    <div className="w-full bg-slate-800 h-3 rounded-full">
                                        <div
                                            className="bg-indigo-500 h-full rounded-full"
                                            style={{ width: `${percentage}%` }}
                                        />
                                    </div>

                                    <div className="flex justify-between text-xs mt-1 text-slate-400">
                                        <span>{stats.count} PDIs</span>
                                        <span>₹{stats.revenue.toLocaleString()}</span>
                                    </div>

                                </div>
                            );
                        })}

                    </div>

                </div>



                {/* STATUS */}
                <div className="md:col-span-2 bg-indigo-600 p-10 rounded-[4rem] shadow-2xl text-white transition-transform hover:scale-[1.02]">
                    <h3 className="font-black mb-4">PDI Status</h3>

                    <div className="flex flex-col md:flex-row items-center gap-6 mt-6">

                        <div className="text-center">
                            <p className="text-xs opacity-70">Confirmed</p>
                            <p className="text-2xl font-black">{analytics.statusStats.confirmed}</p>
                        </div>

                        <div className="hidden md:block h-[2px] flex-1 bg-white/20 mx-4"></div>

                        <div className="text-center">
                            <p className="text-xs opacity-70">Completed</p>
                            <p className="text-2xl font-black">{analytics.statusStats.completed}</p>
                        </div>

                        <div className="hidden md:block h-[2px] flex-1 bg-white/20 mx-4"></div>

                        <div className="text-center">
                            <p className="text-xs opacity-70">Approved</p>
                            <p className="text-2xl font-black">{analytics.statusStats.approved}</p>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}