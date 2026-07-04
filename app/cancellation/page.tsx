//app/info/cancellation-policy.tsx
"use client";
export default function CancellationPolicy() {
    return (
        <main className="max-w-4xl mx-auto px-6 py-24 font-sans">
            {/* Header Section */}
            <div className="mb-16 border-b border-slate-100 pb-12">
                <p className="text-indigo-600 font-black uppercase tracking-[0.3em] text-[10px] mb-4">Data Protection</p>
                <h1 className="text-5xl font-black text-slate-900 tracking-tighter mb-4">
                    Cancellation <span className="text-indigo-600 italic">Policy</span>
                </h1>
            </div>

            {/* Content Body */}
            <div className="space-y-12">
                <section>
                    <h2 className="text-xl font-black text-slate-900 mb-4 uppercase tracking-tight">1. Cancellation Policy</h2>
                    <p className="text-slate-600 leading-relaxed font-medium mb-4">
                        We understand that circumstances may change, and we are committed to providing you with a hassle-free cancellation experience. Here's our cancellation policy:
                    </p>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-5">

                        <li className="rounded-3xl border border-emerald-200 bg-emerald-50 p-6 shadow-sm">
                            <div className="flex items-start gap-4">
                                <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white font-bold">
                                    ✓
                                </div>

                                <div>
                                    <h3 className="font-black text-emerald-900">
                                        Free Cancellation & Rescheduling
                                    </h3>

                                    <p className="mt-2 text-sm leading-relaxed text-slate-700">
                                        You may cancel or reschedule your inspection
                                        <strong> free of charge up to 2 hours before </strong>
                                        your scheduled appointment.
                                    </p>
                                </div>
                            </div>
                        </li>

                        <li className="rounded-3xl border border-amber-200 bg-amber-50 p-6 shadow-sm">
                            <div className="flex items-start gap-4">
                                <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-500 text-white font-bold">
                                    !
                                </div>

                                <div>
                                    <h3 className="font-black text-amber-900">
                                        Late Cancellation
                                    </h3>

                                    <p className="mt-2 text-sm leading-relaxed text-slate-700">
                                        Cancellations requested
                                        <strong> within 2 hours</strong> of the scheduled
                                        inspection time will incur a
                                        <strong> ₹399 cancellation fee</strong>.
                                    </p>
                                </div>
                            </div>
                        </li>

                    </ul>
                </section>
            </div>
        </main>
    );
}