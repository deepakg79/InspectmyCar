"use client";

import { useEffect, useState } from "react";
import { db } from "@/app/lib/firebase";
import {
    collection,
    addDoc,
    deleteDoc,
    doc,
    onSnapshot
} from "firebase/firestore";

const ALL_SLOTS = ["10:30 AM", "12:00 PM", "1:30 PM", "3:00 PM", "4:30 PM", "6:00 PM"];

interface BlockedSlot {
    id: string;
    type: "date" | "slot";
    date: string;
    slot?: string;
}

export default function SlotManagerPage() {
    const [blocked, setBlocked] = useState<BlockedSlot[]>([]);
    const [date, setDate] = useState("");
    const [slot, setSlot] = useState("");

    useEffect(() => {
        const unsub = onSnapshot(collection(db, "blockedSlots"), (snap) => {
            const data: BlockedSlot[] = [];

            snap.forEach((doc) => {
                data.push({
                    id: doc.id,
                    ...(doc.data() as Omit<BlockedSlot, "id">)
                });
            });

            setBlocked(data);
        });

        return () => unsub();
    }, []);

    const blockDate = async () => {
        if (!date) return;

        await addDoc(collection(db, "blockedSlots"), {
            type: "date",
            date
        });

        setDate("");
    };

    const blockSlot = async () => {
        if (!date || !slot) return;

        await addDoc(collection(db, "blockedSlots"), {
            type: "slot",
            date,
            slot
        });

        setSlot("");
    };

    const removeBlock = async (id: string) => {
        await deleteDoc(doc(db, "blockedSlots", id));
    };
    const groupedBlocks: Record<string, BlockedSlot[]> = blocked.reduce((acc, item) => {
        if (!acc[item.date]) acc[item.date] = [];
        acc[item.date].push(item);
        return acc;
    }, {} as Record<string, BlockedSlot[]>);
    return (
        <div className="space-y-10">

            {/* HEADER */}
            <header className="mb-12">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">

                    <div>
                        <h1 className="text-6xl font-black tracking-tighter mb-2 text-slate-900">
                            Slot <span className="text-indigo-600 italic">Manager</span>
                        </h1>

                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
                            Control Booking Availability
                        </p>
                    </div>

                    <div className="bg-indigo-50 px-5 py-3 rounded-2xl text-indigo-600 text-xs font-black">
                        {blocked.length} Blocks
                    </div>

                </div>
            </header>

            {/* CREATE BLOCK CARD */}
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm mb-12 max-w-2xl">

                <h1 className="text-4xl font-black mb-10">
                    Block <span className="text-indigo-600 italic">Slots / Dates</span>
                </h1>
                <div className="space-y-4">

                    <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="w-full bg-slate-50 p-4 rounded-2xl font-bold outline-none border-2 border-transparent focus:border-red-500 transition-all"
                    />

                    <select
                        value={slot}
                        onChange={(e) => setSlot(e.target.value)}
                        className="w-full bg-slate-50 p-4 rounded-2xl font-bold outline-none border-2 border-transparent focus:border-orange-500 transition-all"
                    >
                        <option value="">Select Slot (optional)</option>
                        {ALL_SLOTS.map((s) => (
                            <option key={s} value={s}>
                                {s}
                            </option>
                        ))}
                    </select>

                    <div className="flex gap-3 pt-4 border-t border-slate-100">

                        <button
                            onClick={blockDate}
                            className="flex-1 bg-red-600 text-white py-3 rounded-2xl font-black shadow-lg shadow-red-100 hover:bg-red-700 transition-all"
                        >
                            Block Full Day
                        </button>

                        <button
                            onClick={blockSlot}
                            className="flex-1 bg-orange-500 text-white py-3 rounded-2xl font-black shadow-lg shadow-orange-100 hover:bg-orange-600 transition-all"
                        >
                            Block Slot
                        </button>

                    </div>
                </div>
            </div>

            {/* BLOCKED LIST */}
            <div className="bg-white rounded-[3rem] border border-indigo-700 shadow-sm overflow-hidden">

                <div className="p-8 border-b border-slate-100">

                    <h1 className="text-4xl font-black mb-2">
                        Blocked <span className="text-indigo-600 italic">Entries</span>
                    </h1>
                </div>

                {blocked.length === 0 ? (
                    <div className="p-10 text-center text-slate-400 font-bold">
                        No blocked slots yet
                    </div>
                ) : (
                    <div className="divide-y divide-slate-100">

                        {Object.entries(groupedBlocks)
                            .sort(([a], [b]) => a.localeCompare(b))
                            .map(([date, items]: any) => {

                                const hasFullDay = items.some((i: any) => i.type === "date");

                                return (
                                    <div
                                        key={date}
                                        className="p-6 rounded-2xl border border-indigo-200 bg-white shadow-sm hover:shadow-md transition-all"
                                    >
                                        {/* SLOT LIST */}
                                        <div className="flex items-center justify-between gap-3">

                                            {/* LEFT SIDE: DATE + SLOTS */}
                                            <div className="flex items-center gap-3 flex-wrap">
                                                {/* DATE */}
                                                <p className="text-sm font-black text-slate-900">
                                                    {date}
                                                </p>

                                                {/* CONTENT */}
                                                {hasFullDay ? (
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-xs font-black bg-indigo-100 text-indigo-600 px-3 py-1 rounded-full">
                                                            FULL DAY
                                                        </span>

                                                        {items
                                                            .filter((i: any) => i.type === "date")
                                                            .map((b: any) => (
                                                                <button
                                                                    key={b.id}
                                                                    onClick={() => removeBlock(b.id)}
                                                                    className="w-8 h-8 flex items-center justify-center rounded-full bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition-all font-black"
                                                                >
                                                                    ✕
                                                                </button>
                                                            ))}
                                                    </div>
                                                ) : (
                                                    <div className="flex flex-wrap gap-2">
                                                        {items
                                                            .filter((i: any) => i.type === "slot")
                                                            .sort((a: any, b: any) => a.slot.localeCompare(b.slot))
                                                            .map((b: any) => (
                                                                <div
                                                                    key={b.id}
                                                                    className="flex items-center gap-2 bg-indigo-50 px-3 py-1.5 rounded-xl border border-indigo-100"
                                                                >
                                                                    <span className="text-xs font-black text-indigo-700">
                                                                        {b.slot}
                                                                    </span>

                                                                    <button
                                                                        onClick={() => removeBlock(b.id)}
                                                                        className="w-5 h-5 flex items-center justify-center rounded-full bg-white text-red-500 hover:bg-red-500 hover:text-white transition-all text-[10px] font-black border border-slate-200"
                                                                    >
                                                                        ✕
                                                                    </button>
                                                                </div>
                                                            ))}
                                                    </div>
                                                )}

                                            </div>
                                        </div>
                                    </div>
                                );
                            })}

                    </div>
                )}
            </div>

        </div >

    );
}