// app/info/cancellation-policy.tsx

"use client";

export default function CancellationPolicy() {
    return (
        <main className="bg-main min-h-screen">

            {/* =========================================================
                HERO
            ========================================================= */}

            <section className="px-6 pt-32 pb-20">

                <div className="max-w-5xl mx-auto text-center">

                    <p className="text-indigo-600 font-black uppercase tracking-[0.35em] text-xs mb-4">
                        CANCELLATION RULES
                    </p>

                    <h1 className="heading text-5xl md:text-7xl mb-6">
                        Cancellation{" "}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-pink-500">
                            Policy
                        </span>
                    </h1>

                    <p className="subtext text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
                        We understand that plans can change. Our cancellation
                        and rescheduling policy is designed to keep the process
                        simple, transparent and fair.
                    </p>

                </div>

            </section>

            {/* =========================================================
                POLICY CONTENT
            ========================================================= */}

            <section className="px-6 pb-28">

                <div className="max-w-5xl mx-auto">

                    {/* Section Heading */}

                    <div className="mb-10">

                        <p className="text-indigo-600 font-black uppercase tracking-[0.3em] text-xs mb-3">
                            CANCELLATION POLICY
                        </p>

                        <h2 className="heading text-3xl md:text-4xl">
                            Cancellation & Rescheduling
                        </h2>

                        <p className="subtext mt-4 max-w-3xl leading-7">
                            We understand that circumstances may change, and
                            we are committed to providing you with a hassle-free
                            cancellation experience. Here's our cancellation
                            policy:
                        </p>

                    </div>

                    {/* Policy Cards */}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        {/* FREE CANCELLATION */}

                        <article className="card-glass group rounded-3xl border border-slate-100 p-8 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">

                            <div className="flex items-start justify-between gap-5">

                                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-2xl transition-transform duration-300 group-hover:scale-110">
                                    ✓
                                </div>

                                <span className="text-6xl font-black text-slate-100">
                                    01
                                </span>

                            </div>

                            <div className="mt-7">

                                <div className="mb-3 inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-black uppercase tracking-wider text-emerald-700">
                                    No Charge
                                </div>

                                <h3 className="heading text-2xl">
                                    Free Cancellation & Rescheduling
                                </h3>

                                <p className="subtext mt-4 leading-7">
                                    You may cancel or reschedule your inspection
                                    <strong className="text-slate-900">
                                        {" "}free of charge up to 2 hours before{" "}
                                    </strong>
                                    your scheduled appointment.
                                </p>

                            </div>

                        </article>

                        {/* LATE CANCELLATION */}

                        <article className="card-glass group rounded-3xl border border-slate-100 p-8 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">

                            <div className="flex items-start justify-between gap-5">

                                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-amber-100 text-2xl transition-transform duration-300 group-hover:scale-110">
                                    !
                                </div>

                                <span className="text-6xl font-black text-slate-100">
                                    02
                                </span>

                            </div>

                            <div className="mt-7">

                                <div className="mb-3 inline-flex rounded-full bg-amber-50 px-3 py-1 text-xs font-black uppercase tracking-wider text-amber-700">
                                    Late Cancellation
                                </div>

                                <h3 className="heading text-2xl">
                                    Late Cancellation
                                </h3>

                                <p className="subtext mt-4 leading-7">
                                    Cancellations requested
                                    <strong className="text-slate-900">
                                        {" "}within 2 hours
                                    </strong>{" "}
                                    of the scheduled inspection time will incur
                                    a
                                    <strong className="text-slate-900">
                                        {" "}₹399 cancellation fee
                                    </strong>.
                                </p>

                            </div>

                        </article>

                    </div>

                    {/* =====================================================
                        QUICK SUMMARY
                    ===================================================== */}

                    <div className="card-glass relative mt-8 overflow-hidden rounded-3xl border border-indigo-100 p-8 md:p-10">

                        <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-indigo-600 to-pink-500" />

                        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">

                            <div>

                                <p className="text-indigo-600 font-black uppercase tracking-[0.2em] text-xs">
                                    QUICK SUMMARY
                                </p>

                                <h3 className="heading mt-2 text-2xl">
                                    Plan changed? No problem.
                                </h3>

                                <p className="subtext mt-2 max-w-2xl">
                                    Cancel or reschedule at least 2 hours before
                                    your appointment to avoid the cancellation
                                    fee.
                                </p>

                            </div>

                            <div className="shrink-0 rounded-2xl bg-indigo-50 px-6 py-5 text-center">

<div className="text-3xl font-black bg-gradient-to-r from-indigo-600 to-pink-500 bg-clip-text text-transparent">
   &lt; 2 Hours
</div>

<div className="mt-1 text-xs font-bold uppercase tracking-wider text-slate-500">
    Late Cancellation
</div>

                            </div>

                        </div>

                    </div>

                </div>

            </section>

        </main>
    );
}