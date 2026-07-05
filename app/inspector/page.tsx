"use client";
import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
// 🔥 Firebase
import { db } from "@/app/lib/firebase";
import {
    collection,
    onSnapshot,
    query,
    where,
    doc,
    updateDoc
} from "firebase/firestore";

interface Booking {
    id?: string;
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

export default function InspectorDashboard() {
    const router = useRouter();
    const [auth, setAuth] = useState<{ id: string; name: string; mobile: string } | null>(null);
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [quickMobile, setQuickMobile] = useState("");
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [activeView, setActiveView] = useState<"tasks" | "earnings" | "achievements">("tasks");
    const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
    const [currentMonth, setCurrentMonth] = useState(new Date());
    // 🔐 AUTH + REALTIME BOOKINGS
    useEffect(() => {
        const saved = localStorage.getItem("pdi_inspector");

        if (!saved) {
            router.push("/login");
            return;
        }

        const parsed = JSON.parse(saved);
        setAuth(parsed);

        const q = query(
            collection(db, "bookings"),
            where("assignedTo", "==", parsed.name)
        );

        const unsub = onSnapshot(q, (snapshot) => {
            const data: Booking[] = [];
            snapshot.forEach(doc => {
                data.push({ id: doc.id, ...doc.data() } as Booking);
            });
            setBookings(data);
        });

        return () => unsub();
    }, []);

    // 📍 LIVE LOCATION TRACKING (BACKGROUND)
    useEffect(() => {
        if (!auth?.id) return;

        if (!("geolocation" in navigator)) {
            console.warn("Geolocation is not supported by this browser.");
            return;
        }

        const options: PositionOptions = {
            enableHighAccuracy: true,
            timeout: 15000,
            maximumAge: 30000,
        };

        // Get initial location
        navigator.geolocation.getCurrentPosition(
            async (pos) => {
                try {
                    await updateDoc(doc(db, "inspectors", auth.id), {
                        lat: pos.coords.latitude,
                        lng: pos.coords.longitude,
                        lastUpdated: new Date(),
                    });

                    console.log("📍 Initial location acquired");
                } catch (err) {
                    console.error("Failed to save initial location:", err);
                }
            },
            (err) => {
                if (process.env.NODE_ENV === "production") {
                    console.error("Initial geolocation failed:", err.message);
                } else {
                    console.warn("⚠️ Local development: Location unavailable.");
                }
            },
            options
        );

        // Start continuous tracking
        const watchId = navigator.geolocation.watchPosition(
            async (pos) => {
                try {
                    await updateDoc(doc(db, "inspectors", auth.id), {
                        lat: pos.coords.latitude,
                        lng: pos.coords.longitude,
                        lastUpdated: new Date(),
                    });

                    console.log(
                        `📍 Updated: ${pos.coords.latitude.toFixed(6)}, ${pos.coords.longitude.toFixed(6)}`
                    );
                } catch (err) {
                    console.error("Location update failed:", err);
                }
            },
            (err) => {
                // Ignore local Position Unavailable errors
                if (
                    process.env.NODE_ENV !== "production" &&
                    err.code === err.POSITION_UNAVAILABLE
                ) {
                    console.warn(
                        "⚠️ Position unavailable on localhost (expected on some Macs)."
                    );
                    return;
                }

                switch (err.code) {
                    case err.PERMISSION_DENIED:
                        console.error("Location permission denied.");
                        break;

                    case err.POSITION_UNAVAILABLE:
                        console.error("Unable to determine current location.");
                        break;

                    case err.TIMEOUT:
                        console.error("Location request timed out.");
                        break;

                    default:
                        console.error("Unknown geolocation error:", err.message);
                }
            },
            options
        );

        return () => {
            navigator.geolocation.clearWatch(watchId);
        };
    }, [auth]);
    const formatDate = (date: Date) => {
        return (
            date.getFullYear() +
            "-" +
            String(date.getMonth() + 1).padStart(2, "0") +
            "-" +
            String(date.getDate()).padStart(2, "0")
        );
    };

    const bookingsByDate = useMemo(() => {
        const map: Record<string, Booking[]> = {};

        bookings.forEach(b => {
            const key = b.date;
            if (!map[key]) map[key] = [];
            map[key].push(b);
        });

        return map;
    }, [bookings]);

    const calendarDays = useMemo(() => {
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth();

        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const daysInPrevMonth = new Date(year, month, 0).getDate();

        const days: any[] = [];

        // prev month
        for (let i = firstDay - 1; i >= 0; i--) {
            const d = new Date(year, month - 1, daysInPrevMonth - i);
            days.push({
                day: daysInPrevMonth - i,
                dateStr: formatDate(d),
                isOther: true
            });
        }

        // current month
        for (let i = 1; i <= daysInMonth; i++) {
            const d = new Date(year, month, i);
            days.push({
                day: i,
                dateStr: formatDate(d),
                isOther: false
            });
        }

        // next month fill (42 grid)
        while (days.length < 42) {
            const nextIndex = days.length - (firstDay + daysInMonth) + 1;
            const d = new Date(year, month + 1, nextIndex);
            days.push({
                day: nextIndex,
                dateStr: formatDate(d),
                isOther: true
            });
        }

        return days;
    }, [currentMonth]);
    const handleLogout = () => {
        localStorage.clear();
        window.location.href = "/login";
    };

    const startInspection = (task: Booking) => {
        localStorage.setItem("active_pdi", JSON.stringify(task));
        router.push("/inspect");
    };

    const handleQuickStart = () => {
        const found = bookings.find(b => b.mobile === quickMobile);

        if (!found) {
            alert("No booking found for this mobile number.");
            return;
        }

        if (found.status === "Completed") {
            alert(`PDI for ${found.name} is already COMPLETED.`);
            return;
        }

        startInspection(found);
    };

    const myTasks = useMemo(() => {
        return [...bookings].sort((a, b) => {

            // 📅 Sort by date first
            const dateA = new Date(a.date).getTime();
            const dateB = new Date(b.date).getTime();

            if (dateA !== dateB) return dateA - dateB;

            // ⏰ If same date → sort by slot time
            const parseTime = (slot: string) => {
                const [time, modifier] = slot.split(" ");
                let [hours, minutes] = time.split(":").map(Number);

                if (modifier === "PM" && hours !== 12) hours += 12;
                if (modifier === "AM" && hours === 12) hours = 0;

                return hours * 60 + minutes;
            };

            return parseTime(a.slot) - parseTime(b.slot);
        });
    }, [bookings]);
    const pendingTasks = useMemo(() => myTasks.filter(t => t.status !== "Completed"), [myTasks]);
    const completedTasks = useMemo(() => myTasks.filter(t => t.status === "Completed"), [myTasks]);

    const todayStr = new Date().toISOString().split("T")[0];

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split("T")[0];

    const parseTime = (slot: string) => {
        const [time, modifier] = slot.split(" ");
        let [hours, minutes] = time.split(":").map(Number);

        if (modifier === "PM" && hours !== 12) hours += 12;
        if (modifier === "AM" && hours === 12) hours = 0;

        return hours * 60 + minutes;
    };

    const nowMinutes = (() => {
        const now = new Date();
        return now.getHours() * 60 + now.getMinutes();
    })();

    const categorized = useMemo(() => {
        return {
            immediate: pendingTasks.filter(t => {
                if (t.date !== todayStr) return false;

                const diff = parseTime(t.slot) - nowMinutes;
                return diff >= 0 && diff <= 90; // ONLY future within 1 hr
            }),

            today: pendingTasks.filter(t => {
                if (t.date !== todayStr) return false;

                const diff = parseTime(t.slot) - nowMinutes;
                return diff > 60; // ONLY future beyond 1 hr
            }),

            tomorrow: pendingTasks.filter(t => t.date === tomorrowStr),

            upcoming: pendingTasks.filter(t =>
                t.date !== todayStr && t.date !== tomorrowStr
            )
        };
    }, [pendingTasks]);
    if (!auth) return null;

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 font-sans">
            {/* FLOATING MENU BUTTON (ADMIN STYLE) */}
            <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className={`fixed top-8 left-8 z-[600] w-16 h-16 rounded-[1.5rem] shadow-2xl flex items-center justify-center transition-all duration-500 hover:scale-110 active:scale-90 ${isMenuOpen ? "bg-white text-slate-900" : "bg-slate-900 text-white"
                    }`}
            >
                {isMenuOpen ? (
                    <span className="text-xl font-light">✕</span>
                ) : (
                    <div className="flex flex-col gap-1.5 items-end">
                        <span className="w-6 h-[3px] bg-white rounded-full"></span>
                        <span className="w-4 h-[3px] bg-white rounded-full"></span>
                    </div>
                )}
            </button>
            {/* SIDEBAR */}
            <aside className={`fixed top-24 left-0 h-[calc(100%-6rem)] w-72 bg-white z-[550]
    shadow-[30px_0_80px_rgba(0,0,0,0.05)]
    transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)]
    transform ${isMenuOpen ? "translate-x-0" : "-translate-x-full"}
    p-5 flex flex-col`}>

                {/* 🔥 TOP EXTENSION (connects to button) */}
                <div className="absolute -top-24 left-0 w-full h-24 bg-white"></div>

                {/* BRAND + USER */}
                <div className="mb-10 pt-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-black">
                            {auth.name[0]}
                        </div>

                        <div>
                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-600">
                                Inspector
                            </p>
                            <h2 className="text-sm font-black text-slate-900">
                                {auth.name}
                            </h2>
                        </div>
                    </div>

                    <h2 className="text-2xl font-black tracking-tighter text-slate-900">
                        PDI <span className="text-indigo-600 italic">Panel</span>
                    </h2>
                </div>

                {/* MENU */}
                <nav className="space-y-3 flex-1">
                    {[
                        { id: "tasks", label: "My Assignments", icon: "📋" },
                        { id: "earnings", label: "My Earnings", icon: "💰" },
                        { id: "achievements", label: "Achievements", icon: "🏆" }
                    ].map(item => {
                        const isActive = activeView === item.id;

                        return (
                            <button
                                key={item.id}
                                onClick={() => {
                                    setActiveView(item.id as any);
                                    setIsMenuOpen(false);
                                }}
                                className={`w-full flex items-center justify-between p-3 rounded-xl font-black text-xs transition-all duration-300 group ${isActive
                                    ? "bg-slate-900 text-white shadow-xl -translate-y-1"
                                    : "text-slate-400 hover:bg-slate-50 hover:text-slate-900"
                                    }`}
                            >
                                <div className="flex items-center gap-5">
                                    <span className="text-xl group-hover:scale-125 transition">
                                        {item.icon}
                                    </span>
                                    {item.label}
                                </div>

                                {isActive && (
                                    <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse"></div>
                                )}
                            </button>
                        );
                    })}
                </nav>

                {/* FOOTER */}
                <div className="pt-10 border-t">
                    <button
                        onClick={handleLogout}
                        className="group w-full p-5 rounded-[2rem] bg-red-50 text-red-500 font-black text-xs uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all duration-500 flex items-center justify-center gap-3"
                    >
                        <span>Logout</span>
                        <span className="opacity-0 group-hover:opacity-100 transition-all">→</span>
                    </button>

                    <p className="text-center mt-6 text-[9px] font-black text-slate-300 uppercase tracking-widest">
                        Inspector App • v1.0
                    </p>
                </div>
            </aside>

            {/* OVERLAY */}
            <div
                className={`fixed inset-0 bg-slate-900/40 backdrop-blur-md z-[500] transition-opacity duration-700 ${isMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
                    }`}
                onClick={() => setIsMenuOpen(false)}
            />

            {/* HEADER */}
            <header className="fixed top-0 inset-x-0 h-20 bg-white/70 backdrop-blur-xl border-b z-[100]">

                {/* CENTERED TITLE */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pt-2">
                    <p className="text-[8px] font-black text-slate-300 uppercase tracking-[0.3em]">
                        Fleet Management
                    </p>
                    <h1 className="text-xs font-black uppercase">PDI Portal</h1>
                </div>

            </header>

            <main className={`max-w-md mx-auto p-6 pt-28 space-y-8 transition-all duration-700 ${isMenuOpen ? "blur-sm scale-[0.98]" : ""
                }`}>

                {/* ================= TASKS / CALENDAR ================= */}
                {activeView === "tasks" && (
                    <div className="space-y-6">
                        <header className="mb-12">
                            <h1 className="text-5xl font-black text-slate-900 tracking-tighter">
                                My <span className="text-indigo-600 italic">PDI Assignments</span>
                            </h1>
                        </header>

                        {/* CALENDAR GRID */}
                        <div className="bg-white rounded-[2.5rem] p-6 shadow-xl border">

                            {/* HEADER */}
                            <div className="flex justify-between items-center mb-6">
                                <button
                                    onClick={() =>
                                        setCurrentMonth(prev => {
                                            const d = new Date(prev);
                                            d.setMonth(d.getMonth() - 1);
                                            return d;
                                        })
                                    }
                                    className="w-10 h-10 bg-slate-100 rounded-xl font-black"
                                >
                                    ←
                                </button>

                                <h2 className="text-lg font-black">
                                    {currentMonth.toLocaleString("default", {
                                        month: "long",
                                        year: "numeric"
                                    })}
                                </h2>

                                <button
                                    onClick={() =>
                                        setCurrentMonth(prev => {
                                            const d = new Date(prev);
                                            d.setMonth(d.getMonth() + 1);
                                            return d;
                                        })
                                    }
                                    className="w-10 h-10 bg-slate-100 rounded-xl font-black"
                                >
                                    →
                                </button>
                            </div>

                            {/* WEEK DAYS */}
                            <div className="grid grid-cols-7 text-[10px] font-black text-slate-400 mb-3 text-center">
                                {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
                                    <div key={`${d}-${i}`}>{d}</div>
                                ))}
                            </div>

                            {/* DAYS */}
                            <div className="grid grid-cols-7 gap-2">
                                {calendarDays.map((d, i) => {
                                    const key = d.dateStr;
                                    const dayBookings = bookingsByDate[key] || [];
                                    const isSelected =
                                        selectedDate &&
                                        selectedDate.toISOString().split("T")[0] === key;

                                    return (
                                        <div
                                            key={i}
                                            onClick={() => setSelectedDate(new Date(key))}
                                            className={`h-14 rounded-2xl flex flex-col items-center justify-center text-xs font-black cursor-pointer transition-all
                                                ${d.isOther ? "opacity-30" : ""}
                                                ${isSelected ? "bg-indigo-600 text-white" : "bg-slate-50 hover:bg-indigo-50"}
                                            `}
                                        >
                                            <span>{d.day}</span>
                                            {dayBookings.length > 0 && (
                                                <span className="text-[9px] mt-1 text-red-500">
                                                    {dayBookings.length}
                                                </span>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* SELECTED DATE TASKS */}
                        {selectedDate && (
                            <div className="space-y-4">

                                {/* HEADER STRIP */}
                                <div className="bg-white rounded-2xl p-4 shadow border flex justify-between">
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase">
                                            Selected Date
                                        </p>
                                        <p className="font-black">{selectedDate.toDateString()}</p>
                                    </div>

                                    <div className="text-right">
                                        <p className="text-[10px] font-black text-slate-400 uppercase">
                                            Tasks
                                        </p>
                                        <p className="font-black text-indigo-600">
                                            {bookingsByDate[selectedDate.toISOString().split("T")[0]]?.length || 0}
                                        </p>
                                    </div>
                                </div>

                                {/* TASK CARDS */}
                                {activeView === "tasks" && (
                                    <div className="space-y-8">

                                        {/* QUICK START */}
                                        <div className="bg-white/60 backdrop-blur-xl border border-white/40 p-2 rounded-[2rem] shadow-xl flex">
                                            <input
                                                type="tel"
                                                placeholder="Customer Mobile"
                                                className="flex-1 bg-transparent px-6 font-bold text-sm outline-none"
                                                value={quickMobile}
                                                onChange={e => setQuickMobile(e.target.value)}
                                            />
                                            <button
                                                onClick={handleQuickStart}
                                                className="bg-indigo-600 text-white px-6 py-3 rounded-xl text-xs font-black"
                                            >
                                                Start
                                            </button>
                                        </div>

                                        {/* TASK LIST */}
                                        {/* TASK LIST */}
                                        <div className="space-y-8">

                                            {(() => {
                                                const selectedKey = selectedDate?.toISOString().split("T")[0];
                                                const selectedTasks = selectedKey ? bookingsByDate[selectedKey] || [] : [];

                                                // 👉 IF DATE SELECTED → SHOW ONLY THAT DATE TASKS
                                                if (selectedDate) {
                                                    if (selectedTasks.length === 0) {
                                                        return (
                                                            <div className="bg-indigo-50/60 backdrop-blur-xl border border-indigo-800/200 rounded-[2.5rem] p-13 text-center shadow-inner">
                                                                <p className="text-indigo-800 text-xl font-bold tracking-wider">
                                                                    No PDIs assigned for
                                                                </p>
                                                                <p className="text-1xl font-black">
                                                                    {selectedDate.toDateString()}
                                                                </p>
                                                            </div>
                                                        );
                                                    }

                                                    // sort selected tasks by time
                                                    const sorted = [...selectedTasks].sort((a, b) => parseTime(a.slot) - parseTime(b.slot));

                                                    return sorted.map((task, i) => {
                                                        let bgStyle = "";
                                                        const isCompleted = task.status === "Completed";

                                                        if (isCompleted) {
                                                            bgStyle = "bg-green-100 border-green-500";
                                                        } else {
                                                            const taskDate = task.date;
                                                            const selectedKey = selectedDate.toISOString().split("T")[0];

                                                            if (taskDate === todayStr) {
                                                                const diff = parseTime(task.slot) - nowMinutes;

                                                                if (diff >= 0 && diff <= 60) {
                                                                    bgStyle = "bg-red-200 border-red-700"; // 🔴 Immediate (≤60 min)
                                                                } else if (diff > 60) {
                                                                    bgStyle = "bg-orange-200 border-orange-500"; // 🟠 Upcoming today
                                                                } else {
                                                                    bgStyle = "bg-slate-100 border-slate-300"; // ⬅️ past time today
                                                                }

                                                            } else if (taskDate > todayStr) {
                                                                bgStyle = "bg-emerald-50 border-emerald-300"; // 🟢 Tomorrow + future
                                                            } else {
                                                                bgStyle = "bg-slate-100 border-slate-300"; // ⬅️ past dates
                                                            }
                                                        }

                                                        return (
                                                            <div
                                                                key={i}
                                                                className={`rounded-[2.5rem] p-6 border shadow-xl ${bgStyle}`}
                                                            >
                                                                <div className="flex justify-between items-start mb-4">
                                                                    <div>
                                                                        <p className="text-[9px] font-black text-slate-500 uppercase mb-1">
                                                                            {task.slot} • {task.date}
                                                                        </p>
                                                                        <h4 className="text-lg font-black text-slate-900">
                                                                            {task.name}
                                                                        </h4>
                                                                        <p className="text-[10px] font-bold text-slate-500 uppercase">
                                                                            {task.brand} {task.model}
                                                                        </p>
                                                                    </div>

                                                                    {/* ❌ HIDE BUTTON IF COMPLETED */}
                                                                    {!isCompleted && (
                                                                        <button
                                                                            onClick={() => startInspection(task)}
                                                                            className="w-12 h-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center text-lg font-black shadow-xl"
                                                                        >
                                                                            →
                                                                        </button>
                                                                    )}
                                                                </div>

                                                                <div className="pt-4 border-t flex items-center gap-3">
                                                                    <div className={`w-2 h-2 rounded-full ${isCompleted
                                                                        ? "bg-green-600"
                                                                        : bgStyle.includes("red")
                                                                            ? "bg-red-500"
                                                                            : bgStyle.includes("orange")
                                                                                ? "bg-orange-400"
                                                                                : bgStyle.includes("indigo")
                                                                                    ? "bg-indigo-500"
                                                                                    : "bg-slate-400"
                                                                        }`} />
                                                                    <p className="text-[9px] font-bold text-slate-500 truncate">
                                                                        {isCompleted ? "Completed" : task.location}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        );
                                                    });
                                                }

                                                // 👉 DEFAULT VIEW (NO DATE SELECTED)
                                                if (pendingTasks.length === 0) {
                                                    return (
                                                        <div className="bg-white/60 backdrop-blur-xl border border-white/40 rounded-[2.5rem] p-12 text-center">
                                                            <p className="text-slate-400 text-xs font-bold uppercase">
                                                                No Pending Tasks
                                                            </p>
                                                        </div>
                                                    );
                                                }

                                                return [
                                                    { label: "Immediate", data: categorized.immediate, color: "red" },
                                                    { label: "Today", data: categorized.today, color: "indigo" },
                                                    { label: "Tomorrow", data: categorized.tomorrow, color: "orange" },
                                                    { label: "Upcoming", data: categorized.upcoming, color: "slate" }
                                                ].map(section => (
                                                    section.data.length > 0 && (
                                                        <div key={section.label} className="space-y-3">

                                                            <div className="flex items-center gap-2 px-2">
                                                                <div className={`w-2 h-2 rounded-full animate-pulse
                            ${section.color === "red" ? "bg-red-500" :
                                                                        section.color === "indigo" ? "bg-indigo-500" :
                                                                            section.color === "orange" ? "bg-orange-400" :
                                                                                "bg-slate-400"}`}
                                                                />
                                                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                                                                    {section.label}
                                                                </p>
                                                            </div>

                                                            {section.data.map((task, i) => (
                                                                <div
                                                                    key={i}
                                                                    className={`rounded-[2.5rem] p-6 border shadow-xl
                                ${section.label === "Immediate"
                                                                            ? "bg-red-100 border-red-700"
                                                                            : section.label === "Today"
                                                                                ? "bg-red-50 border-orange-200"
                                                                                : section.label === "Tomorrow"
                                                                                    ? "bg-orange-50 border-orange-200"
                                                                                    : "bg-emerald-50 border-emerald-200"
                                                                        }`}
                                                                >
                                                                    <div className="flex justify-between items-start mb-4">
                                                                        <div>
                                                                            <p className="text-[9px] font-black text-slate-500 uppercase mb-1">
                                                                                {task.slot} • {task.date}
                                                                            </p>
                                                                            <h4 className="text-lg font-black text-slate-900">
                                                                                {task.name}
                                                                            </h4>
                                                                        </div>

                                                                        <button
                                                                            onClick={() => startInspection(task)}
                                                                            className="w-12 h-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center text-lg font-black shadow-xl"
                                                                        >
                                                                            →
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            ))}

                                                        </div>
                                                    )
                                                ));
                                            })()}

                                        </div>
                                    </div>
                                )
                                }
                            </div>
                        )
                        }
                    </div>
                )}

                {/* ================= EARNINGS ================= */}
                {activeView === "earnings" && (
                    <div className="space-y-6">
                        <header className="mb-12">
                            <h1 className="text-5xl font-black text-slate-900 tracking-tighter">
                                My <span className="text-emerald-600 italic">Earnings</span>
                            </h1>
                        </header>

                        <div className="bg-emerald-600 text-white p-10 rounded-[2.5rem] font-black text-3xl text-center">
                            ₹{completedTasks.length * 1000}
                        </div>
                    </div>
                )}

                {/* ================= ACHIEVEMENTS ================= */}
                {activeView === "achievements" && (
                    <div className="space-y-6">
                        <header className="mb-12">
                            <h1 className="text-5xl font-black text-slate-900 tracking-tighter">
                                My <span className="text-yellow-500 italic">Achievements</span>
                            </h1>
                        </header>

                        <div className="text-center font-black text-lg">
                            Completed Inspections: {completedTasks.length}
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}