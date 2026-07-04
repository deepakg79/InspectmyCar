// app/components/BookingChooserModal.tsx

"use client";

import { useRouter } from "next/navigation";

interface BookingChooserModalProps {
    open: boolean;
    onClose: () => void;
}

export default function BookingChooserModal({
    open,
    onClose,
}: BookingChooserModalProps) {
    const router = useRouter();

    if (!open) return null;

    return (
        <div
            className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            onClick={onClose}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className="relative w-full max-w-xl rounded-[2rem] bg-white shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300"
            >
                {/* Close */}
                <button
                    onClick={onClose}
                    className="absolute top-5 right-5 h-10 w-10 rounded-full bg-slate-100 hover:bg-slate-200 transition text-xl font-bold text-slate-600"
                >
                    ✕
                </button>

                {/* Header */}
                <div className="p-8 pb-4 text-center">
                    <p className="text-xs font-black uppercase tracking-[0.3em] text-indigo-600">
                        BOOK INSPECTION
                    </p>

                    <h2 className="mt-2 text-4xl font-black text-slate-900 tracking-tight">
                        Which vehicle are you buying?
                    </h2>

                    <p className="mt-3 text-slate-500">
                        Select the inspection type to continue.
                    </p>
                </div>

                {/* Cards */}
                <div className="grid md:grid-cols-2 gap-5 p-8 pt-4">

                    {/* New Car */}
                    <button
                        onClick={() => {
                            onClose();
                            router.push("/new-cars/");
                        }}
                        className="group rounded-3xl border-2 border-slate-100 p-6 text-left hover:border-indigo-600 hover:bg-indigo-50 transition-all hover:scale-[1.02]"
                    >
                        <div className="text-5xl mb-4">🚗</div>

                        <h3 className="text-2xl font-black text-slate-900">
                            New Car
                        </h3>

                        <p className="mt-2 text-sm text-slate-500 leading-relaxed">
                            Pre-Delivery Inspection before taking
                            delivery from the showroom.
                        </p>

                        <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-indigo-600 px-4 py-2 text-white font-bold text-sm group-hover:bg-slate-900 transition">
                            Continue →
                        </div>
                    </button>

                    {/* Used Car */}
                    <button
                        onClick={() => {
                            onClose();
                            router.push("/used-cars");
                        }}
                        className="group rounded-3xl border-2 border-slate-100 p-6 text-left hover:border-emerald-600 hover:bg-emerald-50 transition-all hover:scale-[1.02]"
                    >
                        <div className="text-5xl mb-4">🚘</div>

                        <h3 className="text-2xl font-black text-slate-900">
                            Used Car
                        </h3>

                        <p className="mt-2 text-sm text-slate-500 leading-relaxed">
                            Pre-Purchase Inspection before buying a
                            used vehicle.
                        </p>

                        <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-emerald-600 px-4 py-2 text-white font-bold text-sm group-hover:bg-slate-900 transition">
                            Continue →
                        </div>
                    </button>

                </div>

                <div className="px-8 pb-8 text-center">
                    <p className="text-xs text-slate-400">
                        Independent • Professional • 299+ Checkpoints
                    </p>
                </div>
            </div>
        </div>
    );
}