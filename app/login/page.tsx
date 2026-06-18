"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// 🔥 Firebase
import { db } from "@/app/lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

export default function LoginPage() {
    const [mode, setMode] = useState<"admin" | "inspector">("inspector");
    const [mobile, setMobile] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [mounted, setMounted] = useState(false);
    const router = useRouter();

    useEffect(() => setMounted(true), []);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // 🔐 ADMIN LOGIN (ENV KEY)
            if (mode === "admin") {
                if (password === process.env.NEXT_PUBLIC_ADMIN_KEY) {
                    localStorage.setItem("pdi_admin", "true");
                    window.location.href = "/admin/bookings";
                } else {
                    alert("Invalid Admin Key.");
                }
            }

            // 👷 INSPECTOR LOGIN (FIREBASE)
            else {
                const q = query(
                    collection(db, "inspectors"),
                    where("mobile", "==", mobile),
                    where("password", "==", password)
                );

                const snapshot = await getDocs(q);

                if (!snapshot.empty) {
                    const docSnap = snapshot.docs[0];
                    const data = docSnap.data();

                    const authData = {
                        id: docSnap.id,
                        name: data.name,
                        mobile: data.mobile
                    };

                    // ✅ Unified storage
                    localStorage.setItem("pdi_inspector", JSON.stringify(authData));

                    // ✅ Backward compatibility
                    localStorage.setItem("inspectorName", data.name);
                    localStorage.setItem("inspectorMobile", data.mobile);

                    window.location.href = "/inspector";
                } else {
                    alert("Invalid Inspector Credentials");
                }
            }
        } catch (error) {
            console.error(error);
            alert("Connection error.");
        } finally {
            setLoading(false);
        }
    };

    if (!mounted) return null;

    return (
        <main className="min-h-screen bg-[#f8fafc] px-6 font-sans pb-20 pt-32 flex flex-col items-center">

            <div className="max-w-md w-full animate-in fade-in slide-in-from-top-4 duration-700">

                {/* --- SEGMENTED TOGGLE --- */}
                <div className="relative z-10 flex bg-slate-200/50 p-1.5 rounded-[2rem] mb-8 backdrop-blur-md border border-white/50 shadow-inner">
                    <button
                        type="button"
                        onClick={() => setMode("inspector")}
                        className={`flex-1 py-4 rounded-[1.8rem] text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${mode === 'inspector'
                            ? 'bg-white text-slate-900 shadow-lg scale-[1.02]'
                            : 'text-slate-400 hover:text-slate-600'
                            }`}
                    >
                        Inspector Entry
                    </button>
                    <button
                        type="button"
                        onClick={() => setMode("admin")}
                        className={`flex-1 py-4 rounded-[1.8rem] text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${mode === 'admin'
                            ? 'bg-white text-slate-900 shadow-lg scale-[1.02]'
                            : 'text-slate-400 hover:text-slate-600'
                            }`}
                    >
                        Admin Portal
                    </button>
                </div>

                {/* --- MAIN CARD --- */}
                <form onSubmit={handleLogin} className="bg-white p-10 rounded-[3rem] shadow-[0_40px_80px_rgba(0,0,0,0.06)] border border-slate-100 relative overflow-hidden">

                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50/50 rounded-full -mr-16 -mt-16 blur-3xl"></div>

                    <div className="mb-10 text-center relative z-10">
                        <div className="inline-flex w-16 h-16 items-center justify-center rounded-[1.5rem] bg-slate-900 text-2xl mb-6 shadow-xl text-white">
                            {mode === "admin" ? "🔑" : "📋"}
                        </div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tighter">
                            {mode === "admin" ? "System" : "Field"} <span className="text-indigo-600 italic">Auth</span>
                        </h1>
                        <p className="text-[10px] font-black text-slate-300 mt-3 uppercase tracking-[0.3em]">
                            {mode === "admin" ? "Encrypted Master Key" : "Personnel Credentials Required"}
                        </p>
                    </div>

                    <div className="space-y-5 relative z-10">
                        {mode === "inspector" && (
                            <div className="space-y-2 animate-in fade-in slide-in-from-left-4 duration-500">
                                <label className="text-[10px] font-black uppercase text-slate-400 ml-5 tracking-widest">Registered Mobile</label>
                                <input
                                    type="tel"
                                    required
                                    placeholder="Enter Mobile Number"
                                    className="w-full p-6 rounded-[1.8rem] bg-slate-50 border-2 border-transparent focus:border-indigo-100 focus:bg-white outline-none transition-all font-bold text-slate-700 shadow-inner"
                                    onChange={(e) => setMobile(e.target.value)}
                                />
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase text-slate-400 ml-5 tracking-widest">
                                {mode === "admin" ? "Access Key" : "Private Password"}
                            </label>
                            <input
                                type="password"
                                required
                                placeholder="••••••••"
                                className="w-full p-6 rounded-[1.8rem] bg-slate-50 border-2 border-transparent focus:border-indigo-100 focus:bg-white outline-none transition-all font-bold text-slate-700 text-center tracking-[0.4em] shadow-inner"
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    <button
                        disabled={loading}
                        className="relative w-full bg-slate-900 text-white py-6 rounded-[2rem] font-black uppercase tracking-[0.2em] text-[10px] mt-10 shadow-2xl hover:bg-indigo-600 hover:-translate-y-1 active:translate-y-0 transition-all disabled:opacity-50 overflow-hidden"
                    >
                        <span className={loading ? "opacity-0" : "opacity-100"}>
                            {mode === "admin" ? "Open Dashboard" : "Sync & Start"}
                        </span>
                        {loading && (
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                            </div>
                        )}
                    </button>
                </form>

                <div className="mt-12 flex flex-col items-center gap-2">
                    <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.4em]">
                        PDI Digital Infrastructure
                    </p>
                    <div className="w-1 h-1 bg-indigo-200 rounded-full"></div>
                </div>
            </div>
        </main>
    );
}