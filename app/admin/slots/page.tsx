"use client";

import { useEffect, useState } from "react";
import { db } from "@/app/lib/firebase";
import {
    collection,
    addDoc,
    deleteDoc,
    doc,
    onSnapshot,
} from "firebase/firestore";

import { ALL_SLOTS } from "../../lib/slotConfig";
import {
    CITY_PRICING,
    type CityName,
} from "@/app/components/city_price";

interface BlockedSlot {
    id: string;
    city: CityName;
    type: "date" | "slot";
    date: string;
    slot?: string;
}

const CITIES = Object.keys(
    CITY_PRICING
) as CityName[];

export default function SlotManagerPage() {
    const [blocked, setBlocked] =
        useState<BlockedSlot[]>([]);

    const [city, setCity] =
        useState<CityName>("Pune");

    const [date, setDate] =
        useState("");

    const [slot, setSlot] =
        useState("");

    /* ---------------------------------------------------------------------- */
    /*                         LOAD BLOCKED SLOTS                             */
    /* ---------------------------------------------------------------------- */

    useEffect(() => {
        const unsub = onSnapshot(
            collection(db, "blockedSlots"),
            (snap) => {
                const data: BlockedSlot[] = [];

                snap.forEach((snapshot) => {
                    const raw =
                        snapshot.data() as Omit<
                            BlockedSlot,
                            "id"
                        >;

                    data.push({
                        id: snapshot.id,
                        ...raw,

                        // Legacy blocks without city
                        // are treated as Pune.
                        city:
                            raw.city || "Pune",
                    });
                });

                setBlocked(data);
            }
        );

        return () => unsub();
    }, []);

    /* ---------------------------------------------------------------------- */
    /*                           BLOCK FULL DAY                               */
    /* ---------------------------------------------------------------------- */

    const blockDate = async () => {
        if (!city || !date) return;

        await addDoc(
            collection(db, "blockedSlots"),
            {
                city,
                type: "date",
                date,
            }
        );

        setDate("");
    };

    /* ---------------------------------------------------------------------- */
    /*                            BLOCK SLOT                                  */
    /* ---------------------------------------------------------------------- */

    const blockSlot = async () => {
        if (!city || !date || !slot) return;

        await addDoc(
            collection(db, "blockedSlots"),
            {
                city,
                type: "slot",
                date,
                slot,
            }
        );

        setSlot("");
        setDate("");
    };

    /* ---------------------------------------------------------------------- */
    /*                            REMOVE BLOCK                                */
    /* ---------------------------------------------------------------------- */

    const removeBlock = async (id: string) => {
        await deleteDoc(
            doc(db, "blockedSlots", id)
        );
    };

    /* ---------------------------------------------------------------------- */
    /*                           GROUP BY CITY + DATE                         */
    /* ---------------------------------------------------------------------- */

    const groupedBlocks: Record<
        string,
        BlockedSlot[]
    > = blocked.reduce(
        (acc, item) => {
            const key = `${item.city}__${item.date}`;

            if (!acc[key]) {
                acc[key] = [];
            }

            acc[key].push(item);

            return acc;
        },
        {} as Record<string, BlockedSlot[]>
    );

    /* ---------------------------------------------------------------------- */
    /*                               RENDER                                   */
    /* ---------------------------------------------------------------------- */

    return (
        <div className="space-y-10">

            {/* ---------------------------------------------------------------- */}
            {/* HEADER                                                           */}
            {/* ---------------------------------------------------------------- */}

            <header className="mb-12">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">

                    <div>
                        <h1 className="text-6xl font-black tracking-tighter mb-2 text-slate-900">
                            Slot{" "}
                            <span className="text-indigo-600 italic">
                                Manager
                            </span>
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

            {/* ---------------------------------------------------------------- */}
            {/* CREATE BLOCK CARD                                                */}
            {/* ---------------------------------------------------------------- */}

            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm mb-12 max-w-2xl">

                <h1 className="text-4xl font-black mb-10">
                    Block{" "}
                    <span className="text-indigo-600 italic">
                        Slots / Dates
                    </span>
                </h1>

                <div className="space-y-4">

                    {/* CITY */}

                    <select
                        value={city}
                        onChange={(e) =>
                            setCity(
                                e.target.value as CityName
                            )
                        }
                        className="w-full bg-slate-50 p-4 rounded-2xl font-bold outline-none border-2 border-transparent focus:border-indigo-500 transition-all"
                    >
                        {CITIES.map((cityName) => (
                            <option
                                key={cityName}
                                value={cityName}
                            >
                                {CITY_PRICING[cityName].name}
                            </option>
                        ))}
                    </select>

                    {/* DATE */}

                    <input
                        type="date"
                        value={date}
                        onChange={(e) =>
                            setDate(e.target.value)
                        }
                        className="w-full bg-slate-50 p-4 rounded-2xl font-bold outline-none border-2 border-transparent focus:border-red-500 transition-all"
                    />

                    {/* SLOT */}

                    <select
                        value={slot}
                        onChange={(e) =>
                            setSlot(e.target.value)
                        }
                        className="w-full bg-slate-50 p-4 rounded-2xl font-bold outline-none border-2 border-transparent focus:border-orange-500 transition-all"
                    >
                        <option value="">
                            Select Slot (optional)
                        </option>

                        {ALL_SLOTS.map((s) => (
                            <option
                                key={s}
                                value={s}
                            >
                                {s}
                            </option>
                        ))}
                    </select>

                    {/* ACTIONS */}

                    <div className="flex gap-3 pt-4 border-t border-slate-100">

                        <button
                            onClick={blockDate}
                            disabled={!city || !date}
                            className="flex-1 bg-red-600 text-white py-3 rounded-2xl font-black shadow-lg shadow-red-100 hover:bg-red-700 transition-all disabled:bg-slate-200 disabled:shadow-none"
                        >
                            Block Full Day
                        </button>

                        <button
                            onClick={blockSlot}
                            disabled={
                                !city ||
                                !date ||
                                !slot
                            }
                            className="flex-1 bg-orange-500 text-white py-3 rounded-2xl font-black shadow-lg shadow-orange-100 hover:bg-orange-600 transition-all disabled:bg-slate-200 disabled:shadow-none"
                        >
                            Block Slot
                        </button>

                    </div>

                </div>
            </div>

            {/* ---------------------------------------------------------------- */}
            {/* BLOCKED LIST                                                     */}
            {/* ---------------------------------------------------------------- */}

            <div className="bg-white rounded-[3rem] border border-indigo-700 shadow-sm overflow-hidden">

                <div className="p-8 border-b border-slate-100">

                    <h1 className="text-4xl font-black mb-2">
                        Blocked{" "}
                        <span className="text-indigo-600 italic">
                            Entries
                        </span>
                    </h1>

                </div>

                {blocked.length === 0 ? (
                    <div className="p-10 text-center text-slate-400 font-bold">
                        No blocked slots yet
                    </div>
                ) : (
                    <div className="divide-y divide-slate-100">

                        {Object.entries(groupedBlocks)
                            .sort(([a], [b]) =>
                                a.localeCompare(b)
                            )
                            .map(
                                ([
                                    key,
                                    items,
                                ]) => {

                                    const [
                                        blockCity,
                                        blockDate,
                                    ] =
                                        key.split(
                                            "__"
                                        );

                                    const hasFullDay =
                                        items.some(
                                            (item) =>
                                                item.type ===
                                                "date"
                                        );

                                    return (
                                        <div
                                            key={key}
                                            className="p-6 rounded-2xl border border-indigo-200 bg-white shadow-sm hover:shadow-md transition-all"
                                        >
                                            <div className="flex items-center justify-between gap-3">

                                                <div className="flex items-center gap-3 flex-wrap">

                                                    {/* CITY */}

                                                    <span className="text-xs font-black bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full">
                                                        {CITY_PRICING[
                                                            blockCity as CityName
                                                        ]?.name ||
                                                            blockCity}
                                                    </span>

                                                    {/* DATE */}

                                                    <p className="text-sm font-black text-slate-900">
                                                        {blockDate}
                                                    </p>

                                                    {/* FULL DAY */}

                                                    {hasFullDay ? (
                                                        <div className="flex items-center gap-2">

                                                            <span className="text-xs font-black bg-red-100 text-red-600 px-3 py-1 rounded-full">
                                                                FULL DAY
                                                            </span>

                                                            {items
                                                                .filter(
                                                                    (
                                                                        item
                                                                    ) =>
                                                                        item.type ===
                                                                        "date"
                                                                )
                                                                .map(
                                                                    (
                                                                        item
                                                                    ) => (
                                                                        <button
                                                                            key={
                                                                                item.id
                                                                            }
                                                                            onClick={() =>
                                                                                removeBlock(
                                                                                    item.id
                                                                                )
                                                                            }
                                                                            className="w-8 h-8 flex items-center justify-center rounded-full bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition-all font-black"
                                                                        >
                                                                            ✕
                                                                        </button>
                                                                    )
                                                                )}

                                                        </div>
                                                    ) : (
                                                        /* SLOT LIST */

                                                        <div className="flex flex-wrap gap-2">

                                                            {items
                                                                .filter(
                                                                    (
                                                                        item
                                                                    ) =>
                                                                        item.type ===
                                                                        "slot"
                                                                )
                                                                .sort(
                                                                    (
                                                                        a,
                                                                        b
                                                                    ) =>
                                                                        (
                                                                            a.slot ||
                                                                            ""
                                                                        ).localeCompare(
                                                                            b.slot ||
                                                                                ""
                                                                        )
                                                                )
                                                                .map(
                                                                    (
                                                                        item
                                                                    ) => (
                                                                        <div
                                                                            key={
                                                                                item.id
                                                                            }
                                                                            className="flex items-center gap-2 bg-indigo-50 px-3 py-1.5 rounded-xl border border-indigo-100"
                                                                        >
                                                                            <span className="text-xs font-black text-indigo-700">
                                                                                {
                                                                                    item.slot
                                                                                }
                                                                            </span>

                                                                            <button
                                                                                onClick={() =>
                                                                                    removeBlock(
                                                                                        item.id
                                                                                    )
                                                                                }
                                                                                className="w-5 h-5 flex items-center justify-center rounded-full bg-white text-red-500 hover:bg-red-500 hover:text-white transition-all text-[10px] font-black border border-slate-200"
                                                                            >
                                                                                ✕
                                                                            </button>
                                                                        </div>
                                                                    )
                                                                )}

                                                        </div>
                                                    )}

                                                </div>

                                            </div>
                                        </div>
                                    );
                                }
                            )}

                    </div>
                )}

            </div>

        </div>
    );
}