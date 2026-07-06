"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();

    const menuItems = [
        { name: "Live Bookings", path: "/admin/bookings", icon: "📅" },
        { name: "Approve PDIs", path: "/admin/approve", icon: "✅" }, // 🔥 NEW
        { name: "Manage Slots", path: "/admin/slots", icon: "⛔" }, // 👈 NEW
        { name: "Manage Inspectors", path: "/admin/inspectors", icon: "🛡️" }, // Added this
        { name: "Assign Executives", path: "/admin/assign", icon: "👥" },
        { name: "Live Dispatch", path: "/admin/dispatch", icon: "📡" },
        { name: "Market Analytics", path: "/admin/stats", icon: "📈" },
        { name: "Manage Car Models", path: "/admin/car-models", icon: "🚗" },
        { name: "Blogs", path: "/admin/blogs", icon: "📰" }

    ];

    return (
        <div className="min-h-screen bg-[#f8fafc] font-sans selection:bg-indigo-100">
            {/* FLOATING TRIGGER */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`fixed top-8 left-8 z-[600] w-16 h-16 rounded-[1.5rem] shadow-2xl flex items-center justify-center transition-all duration-500 hover:scale-110 active:scale-90 ${isOpen ? "bg-white text-slate-900" : "bg-slate-900 text-white"
                    }`}
            >
                {isOpen ? (
                    <span className="text-xl font-light">✕</span>
                ) : (
                    <div className="flex flex-col gap-1.5 items-end">
                        <span className="w-6 h-[3px] bg-white rounded-full"></span>
                        <span className="w-4 h-[3px] bg-white rounded-full"></span>
                    </div>
                )}
            </button>

            {/* SMOOTH OVERLAY */}
            <div
                className={`fixed inset-0 bg-slate-900/40 backdrop-blur-md z-[500] transition-opacity duration-700 ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
                    }`}
                onClick={() => setIsOpen(false)}
            />

            {/* MODERN SIDEBAR */}

            <aside className={`fixed top-0 left-0 h-full w-72 bg-white z-[550] shadow-[30px_0_80px_rgba(0,0,0,0.05)] transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] transform ${isOpen ? "translate-x-0" : "-translate-x-full"
                } p-4 flex flex-col`}>

                {/* Brand Identity */}
                <div className="mb-10 pt-6">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-8 h-8 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-black text-xs">P</div>
                        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-600">InspectMyCar</p>
                    </div>
                    <h2 className="text-2xl font-black tracking-tighter text-slate-900">Admin <span className="text-indigo-600 italic">Hub</span></h2>
                </div>

                {/* Navigation Links */}
                <nav className="space-y-3 flex-1">
                    {menuItems.map((item) => {
                        const isActive = pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                href={item.path}
                                onClick={() => setIsOpen(false)}
                                className={`flex items-center justify-between p-3 rounded-xl font-black text-xs tracking-tight transition-all duration-300 group ${isActive
                                    ? "bg-slate-900 text-white shadow-2xl shadow-slate-200 -translate-y-1"
                                    : "text-slate-400 hover:bg-slate-50 hover:text-slate-900"
                                    }`}
                            >
                                <div className="flex items-center gap-5">
                                    <span className={`text-xl transition-transform group-hover:scale-125 duration-500`}>{item.icon}</span>
                                    {item.name}
                                </div>
                                {isActive && <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse"></div>}
                            </Link>
                        );
                    })}
                </nav>

                {/* Footer Section */}
                <div className="pt-10 border-t border-slate-50">
                    <button
                        onClick={() => {
                            document.cookie = "admin_session=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
                            window.location.href = "/login";
                        }}
                        className="group w-full p-6 rounded-[2rem] bg-red-50 text-red-500 font-black text-xs uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all duration-500 flex items-center justify-center gap-3"
                    >
                        <span>Logout Session</span>
                        <span className="opacity-0 group-hover:opacity-100 transition-all">→</span>
                    </button>
                    <p className="text-center mt-6 text-[9px] font-black text-slate-300 uppercase tracking-widest">Version 2.0.4 • Pune</p>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className={`${isOpen ? "blur-sm scale-[0.98] origin-right" : ""}`}>
                <div className="pt-28 px-6 md:px-10 max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}