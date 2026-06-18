"use client";

import { useState, useEffect } from "react";

type Model = {
    name: string;
    type: "Standard" | "Luxury";
};

type Brand = {
    brand: string;
    models: Model[];
};

export default function CarModelsPage() {
    const [data, setData] = useState<Brand[]>([]);
    const [selectedBrand, setSelectedBrand] = useState("");
    const [modelName, setModelName] = useState("");
    const [modelType, setModelType] =
        useState<"Standard" | "Luxury">("Standard");

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const [syncing, setSyncing] = useState(false);

    // 🔄 LOAD DATA
    const fetchData = async () => {
        try {
            setLoading(true);
            const res = await fetch("/api/car-models", {
                cache: "no-store",
            });

            const result = await res.json();
            setData(result.brands || []);
        } catch (err) {
            setError("Failed to load data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // ➕ ADD MODEL
    const addModel = async () => {
        setError("");

        if (!selectedBrand || !modelName.trim()) {
            setError("Select brand and enter model name");
            return;
        }

        try {
            setSyncing(true);

            const res = await fetch("/api/car-models", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    action: "add",
                    brand: selectedBrand,
                    modelName: modelName.trim(),
                    type: modelType,
                }),
            });

            const result = await res.json();

            if (!res.ok) {
                setError(result.error || "Failed to add model");
                return;
            }

            setData(result.brands);
            setModelName("");
        } catch (err) {
            setError("Something went wrong");
        } finally {
            setSyncing(false);
        }
    };

    // ❌ DELETE MODEL
    const deleteModel = async (
        brand: string,
        index: number,
        name: string
    ) => {
        const confirmed = window.confirm(
            `Delete "${name}" from ${brand}?`
        );

        if (!confirmed) return;

        try {
            setSyncing(true);

            const res = await fetch("/api/car-models", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    action: "delete",
                    brand,
                    index,
                }),
            });

            const result = await res.json();

            if (!res.ok) {
                setError(result.error || "Delete failed");
                return;
            }

            setData(result.brands);
        } catch (err) {
            setError("Delete failed");
        } finally {
            setSyncing(false);
        }
    };

    if (loading) {
        return (
            <div className="p-10 text-center font-bold">
                Loading...
            </div>
        );
    }

    return (
        <div className="p-8 relative">
            {/* SYNC INDICATOR */}
            {syncing && (
                <div className="absolute top-4 right-4 text-xs font-bold text-indigo-600 animate-pulse">
                    Syncing...
                </div>
            )}

            <h1 className="text-3xl font-black mb-6">
                Manage Car Models
            </h1>

            {/* ADD MODEL */}
            <div className="bg-white p-6 rounded-2xl shadow mb-10 space-y-4">
                <h2 className="font-bold text-lg">
                    Add New Model
                </h2>

                <div className="flex gap-4 flex-wrap items-center">

                    {/* BRAND */}
                    <select
                        className="border p-3 rounded-xl"
                        value={selectedBrand}
                        onChange={(e) =>
                            setSelectedBrand(e.target.value)
                        }
                    >
                        <option value="">
                            Select Brand
                        </option>
                        {data.map((b) => (
                            <option
                                key={b.brand}
                                value={b.brand}
                            >
                                {b.brand}
                            </option>
                        ))}
                    </select>

                    {/* MODEL */}
                    <input
                        type="text"
                        placeholder="Model Name"
                        className="border p-3 rounded-xl"
                        value={modelName}
                        onChange={(e) =>
                            setModelName(e.target.value)
                        }
                    />

                    {/* TYPE */}
                    <select
                        className="border p-3 rounded-xl"
                        value={modelType}
                        onChange={(e) =>
                            setModelType(
                                e.target.value as any
                            )
                        }
                    >
                        <option value="Standard">
                            Standard
                        </option>
                        <option value="Luxury">
                            Luxury
                        </option>
                    </select>

                    {/* BUTTON */}
                    <button
                        onClick={addModel}
                        disabled={syncing}
                        className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-indigo-700 disabled:opacity-50"
                    >
                        Add Model
                    </button>
                </div>

                {/* ERROR */}
                {error && (
                    <div className="text-red-500 text-sm font-bold">
                        {error}
                    </div>
                )}
            </div>

            {/* LIST */}
            <div className="space-y-6">
                {data.map((brand) => (
                    <div
                        key={brand.brand}
                        className="bg-white p-6 rounded-2xl shadow"
                    >
                        <h2 className="text-xl font-black mb-4">
                            {brand.brand}
                        </h2>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {brand.models.map(
                                (model, idx) => (
                                    <div
                                        key={`${model.name}-${idx}`}
                                        className={`p-3 rounded-xl border text-sm font-bold flex justify-between items-center ${model.type === "Luxury"
                                                ? "border-yellow-400 bg-yellow-50"
                                                : "border-slate-200"
                                            }`}
                                    >
                                        <div>
                                            <div>
                                                {model.name}
                                            </div>
                                            <div className="text-xs opacity-60">
                                                {model.type}
                                            </div>
                                        </div>

                                        <button
                                            onClick={() =>
                                                deleteModel(
                                                    brand.brand,
                                                    idx,
                                                    model.name
                                                )
                                            }
                                            disabled={syncing}
                                            className="text-red-500 text-xs font-bold hover:text-red-700 disabled:opacity-40"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                )
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
