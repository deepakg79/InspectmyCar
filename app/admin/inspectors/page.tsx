"use client";
import { useState, useEffect, useMemo } from "react";
import { db } from "@/app/lib/firebase";
import {
    collection,
    addDoc,
    onSnapshot,
    deleteDoc,
    updateDoc,
    doc,
    getDocs
} from "firebase/firestore";

interface Inspector {
    id: string;
    name: string;
    mobile: string;
    password?: string;
    status?: string;
    role?: string;   // 🔥 ADD THIS
}

const Toast = ({ message, type, onClose }: { message: string, type: 'success' | 'error', onClose: () => void }) => (
    <div className={`fixed bottom-10 right-10 z-[1000] flex items-center gap-4 p-6 rounded-[2rem] shadow-2xl border animate-in slide-in-from-bottom-10 duration-500 ${type === 'success' ? 'bg-white border-green-100 text-slate-900' : 'bg-red-50 border-red-100 text-red-600'}`}>
        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-white ${type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}>
            {type === 'success' ? '✓' : '!'}
        </div>
        <div>
            <p className="text-[10px] font-black uppercase tracking-widest opacity-40">{type}</p>
            <p className="text-sm font-bold tracking-tight">{message}</p>
        </div>
        <button onClick={onClose} className="ml-4 opacity-20 hover:opacity-100">✕</button>
    </div>
);
interface Booking {
    id: string;
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
export default function ManageInspectors() {
    const [inspectors, setInspectors] = useState<Inspector[]>([]);
    const [loading, setLoading] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [toast, setToast] = useState<{ msg: string, type: 'success' | 'error' } | null>(null);
    const [formData, setFormData] = useState({ name: "", mobile: "", password: "" });
    const [resetTarget, setResetTarget] = useState<Inspector | null>(null);
    const [newPassword, setNewPassword] = useState("");
    const [processingId, setProcessingId] = useState<string | null>(null);
    const [bookings, setBookings] = useState<Booking[]>([]);
    const showNotice = (msg: string, type: 'success' | 'error' = 'success') => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 3000);
    };

    useEffect(() => {
        setMounted(true);

        // ✅ Safe bootstrap (runs once)
        const init = async () => {
            const snapshot = await getDocs(collection(db, "inspectors"));
            if (snapshot.empty) {
                await addDoc(collection(db, "inspectors"), {
                    name: "Admin Inspector",
                    mobile: "9999999999",
                    password: "123456",
                    status: "Active"
                });
            }
        };

        init();

        // 🔥 realtime listener
        const unsub = onSnapshot(collection(db, "inspectors"), (snapshot) => {
            const data: any[] = [];
            snapshot.forEach(doc => data.push({ id: doc.id, ...doc.data() }));
            setInspectors(data);
        });
        const unsubBookings = onSnapshot(collection(db, "bookings"), (snapshot) => {
            const data: any[] = [];
            snapshot.forEach(doc => data.push({ id: doc.id, ...doc.data() }));
            setBookings(data);
        });
        return () => {
            unsub();
            unsubBookings();
        };
    }, []);

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name || !formData.mobile || !formData.password) {
            return showNotice("Missing fields", "error");
        }

        if (formData.password.length < 6) {
            return showNotice("Password too short", "error");
        }

        const exists = inspectors.find(i => i.mobile === formData.mobile);
        if (exists) {
            return showNotice("Inspector already exists", "error");
        }

        setLoading(true);

        try {
            await addDoc(collection(db, "inspectors"), {
                name: formData.name,
                mobile: formData.mobile,
                password: formData.password,
                status: "Active",
                role: "inspector"
            });

            showNotice("Inspector onboarded successfully");
            setFormData({ name: "", mobile: "", password: "" });

        } catch {
            showNotice("Failed to add inspector", "error");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (inspector: Inspector) => {
        if (!confirm("Terminate this inspector access?")) return;

        setProcessingId(inspector.id);

        try {
            await deleteDoc(doc(db, "inspectors", inspector.id));
            showNotice("Access revoked");
        } catch {
            showNotice("Delete failed", "error");
        } finally {
            setProcessingId(null);
        }
    };

    const handleReset = async () => {
        if (!resetTarget || !newPassword) return;

        setLoading(true);

        try {
            await updateDoc(doc(db, "inspectors", resetTarget.id), {
                password: newPassword
            });

            showNotice("Password updated");
            setResetTarget(null);
        } catch {
            showNotice("Reset failed", "error");
        } finally {
            setLoading(false);
        }
    };

    // 📊 Leaderboard
    const leaderboard = useMemo(() => {
        return inspectors.map(exec => {
            const execBookings = bookings.filter(b => b.assignedTo === exec.name);

            return {
                name: exec.name,
                tasks: execBookings.length,
                revenue: execBookings
                    .filter(b => b.status === "Completed")
                    .reduce((sum, b) => sum + (Number(b.price) || 0), 0)
            };
        }).sort((a, b) => b.tasks - a.tasks);
    }, [bookings, inspectors]);

    const getStars = (index: number, total: number) => {
        if (total === 0) return 0;

        const percentile = index / total;

        if (percentile <= 0.1) return 5;   // top third
        if (percentile <= 0.3) return 4;
        if (percentile <= 0.5) return 3;
        if (percentile <= 0.7) return 2;
        return 1;                           // bottom
    };

    const sortedInspectors = [...inspectors].sort((a, b) => {
        const aStats = leaderboard.find(l => l.name === a.name) || { tasks: 0 };
        const bStats = leaderboard.find(l => l.name === b.name) || { tasks: 0 };

        return bStats.tasks - aStats.tasks; // ONLY sort by tasks
    });

    if (!mounted) return null;

    return (
        <div className="space-y-10">

            {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
            <header className="mb-12">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">

                    <div>
                        <h1 className="text-6xl font-black tracking-tighter mb-2 text-slate-900">
                            PDI <span className="text-indigo-600 italic">Inspectors</span>
                        </h1>

                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
                            Add • Manage • Control Access
                        </p>
                    </div>

                    <div className="bg-indigo-50 px-5 py-3 rounded-2xl text-indigo-600 text-xs font-black">
                        {inspectors.length} Active
                    </div>

                </div>
            </header>
            <div className="grid lg:grid-cols-3 gap-12 items-start">

                {/* FORM */}
                <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                    <h3 className="text-xl font-black mb-8">Add Inspector</h3>

                    <form onSubmit={handleAdd} className="space-y-4">
                        {["name", "mobile", "password"].map((f) => (
                            <input
                                key={f}
                                type={f === "password" ? "password" : "text"}
                                placeholder={`Enter ${f}`}
                                className="w-full p-4 bg-slate-50 rounded-xl text-sm font-bold"
                                value={(formData as any)[f]}
                                onChange={(e) =>
                                    setFormData({ ...formData, [f]: e.target.value })
                                }
                            />
                        ))}

                        <button
                            disabled={loading}
                            className="w-full bg-slate-900 text-white p-4 rounded-xl font-bold"
                        >
                            {loading ? "Processing..." : "Add Inspector"}
                        </button>
                    </form>
                </div>

                {/* LIST */}
                <div className="lg:col-span-2 space-y-4">

                    {sortedInspectors.map((ins, index) => {
                        const isProcessing = processingId === ins.id;
                        const stats = leaderboard.find(l => l.name === ins.name) || {
                            tasks: 0,
                            revenue: 0
                        };

                        return (
                            <div
                                key={ins.id}
                                className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:scale-[1.01] transition-all flex justify-between items-center"
                            >
                                <div>
                                    <div className="flex flex-col gap-2 w-full">

                                        {/* 🔥 ROW 1 — ID */}
                                        <p className="text-[10px] text-slate-400 font-mono">
                                            ID: {ins.id.slice(0, 8)}
                                        </p>

                                        {/* 🔥 ROW 2 — Name + Role + Stats */}
                                        <div className="flex items-center flex-wrap gap-2">

                                            <span className="font-bold text-3xl text-indigo-600 font-bold">
                                                {ins.name}
                                            </span>

                                            {/* PDI COUNT */}
                                            <span className="text-[10px] px-2 py-1 rounded-full bg-indigo-50 text-indigo-600 font-bold">
                                                {stats.tasks} PDI
                                            </span>
                                            <span className="text-[10px] font-black bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full">
                                                ₹{stats.revenue}
                                            </span>
                                            {/* ⭐ STARS */}
                                            <span className="text-yellow-400 text-sm">
                                                {"★".repeat(getStars(index, sortedInspectors.length))}
                                            </span>

                                        </div>

                                        {/* 🔥 ROW 3 — Mobile + Status */}
                                        <div className="flex items-center gap-3">
                                            {/* ROLE */}
                                            <span className={`text-[10px] px-2 py-1 rounded-full font-bold ${ins.role === "admin"
                                                ? "bg-purple-100 text-purple-700"
                                                : "bg-blue-100 text-blue-700"
                                                }`}>
                                                {ins.role || "inspector"}
                                            </span>
                                            <span className="text-xs text-slate-500">
                                                {ins.mobile}
                                            </span>

                                            <span className={`text-[10px] px-2 py-1 rounded-full font-bold ${ins.status === "Active"
                                                ? "bg-emerald-100 text-emerald-700"
                                                : "bg-slate-100 text-slate-400"
                                                }`}>
                                                {ins.status}
                                            </span>

                                        </div>

                                    </div>


                                </div>
                                <div className="flex gap-2">

                                    {/* Toggle */}
                                    <button
                                        onClick={async () => {
                                            await updateDoc(doc(db, "inspectors", ins.id), {
                                                status: ins.status === "Active" ? "Inactive" : "Active"
                                            });
                                        }}
                                        className="px-3 py-2 bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white transition-allrounded-lg text-xs"
                                    >
                                        Toggle
                                    </button>

                                    {/* Reset */}
                                    <button
                                        onClick={() => {
                                            setResetTarget(ins);
                                            setNewPassword("");
                                        }}
                                        className="px-3 py-2 bg-slate-100 text-slate-700 hover:bg-slate-900 hover:text-white transition-all rounded-lg text-xs"
                                    >
                                        Reset
                                    </button>

                                    {/* Delete */}
                                    <button
                                        onClick={() => handleDelete(ins)}
                                        disabled={isProcessing}
                                        className="px-3 py-2 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition-all rounded-lg text-xs"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* RESET MODAL */}
            {
                resetTarget && (
                    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                        <div className="bg-white p-8 rounded-2xl w-[90%] max-w-md">
                            <h3 className="font-bold mb-4">Reset Password</h3>

                            <input
                                type="password"
                                placeholder="New password"
                                className="w-full p-3 bg-slate-50 rounded-xl"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                            />

                            <div className="flex gap-3 mt-4">
                                <button onClick={() => setResetTarget(null)}>Cancel</button>
                                <button onClick={handleReset} className="bg-indigo-600 text-white px-4 py-2 rounded">
                                    Update
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }
        </div >



    );
}
