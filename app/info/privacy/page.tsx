export default function PrivacyPolicy() {
    const lastUpdated = "May 20, 2024";

    return (
        <main className="max-w-4xl mx-auto px-6 py-24 font-sans">
            {/* Header Section */}
            <div className="mb-16 border-b border-slate-100 pb-12">
                <p className="text-indigo-600 font-black uppercase tracking-[0.3em] text-[10px] mb-4">Data Protection</p>
                <h1 className="text-5xl font-black text-slate-900 tracking-tighter mb-4">
                    Privacy <span className="text-indigo-600 italic">Policy</span>
                </h1>
                <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">
                    Last Updated: {lastUpdated}
                </p>
            </div>

            {/* Content Body */}
            <div className="space-y-12">
                <section>
                    <h2 className="text-xl font-black text-slate-900 mb-4 uppercase tracking-tight">1. Information We Collect</h2>
                    <p className="text-slate-600 leading-relaxed font-medium mb-4">
                        To provide our professional PDI services, we collect minimal but necessary information from you:
                    </p>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {["Name & Contact Details", "Vehicle Brand & Model", "Dealership Location", "PDI Appointment Time"].map((item, i) => (
                            <li key={i} className="flex items-center gap-3 bg-slate-50 p-4 rounded-2xl text-sm font-bold text-slate-700 border border-slate-100">
                                <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full" /> {item}
                            </li>
                        ))}
                    </ul>
                </section>

                <section className="bg-indigo-50/50 p-8 rounded-[2.5rem] border border-indigo-100">
                    <h2 className="text-xl font-black text-indigo-900 mb-4 uppercase tracking-tight">2. How We Use Your Data</h2>
                    <p className="text-indigo-900/70 leading-relaxed font-medium">
                        We use your data exclusively to coordinate your vehicle inspection.
                        <strong> We never sell your personal information to third-party insurance agents, car accessories shops, or marketing agencies.</strong>
                        Your trust is our primary asset.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-black text-slate-900 mb-4 uppercase tracking-tight">3. Data Sharing</h2>
                    <p className="text-slate-600 leading-relaxed font-medium">
                        Your information is only shared with:
                    </p>
                    <ul className="mt-4 space-y-3">
                        <li className="flex gap-4 items-start text-sm font-medium text-slate-600">
                            <span className="font-black text-indigo-600">01</span>
                            <span>The assigned PDI Inspector for on-site coordination.</span>
                        </li>
                        <li className="flex gap-4 items-start text-sm font-medium text-slate-600">
                            <span className="font-black text-indigo-600">02</span>
                            <span>Payment processors to handle secure transactions (Razorpay/UPI).</span>
                        </li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-xl font-black text-slate-900 mb-4 uppercase tracking-tight">4. Data Security</h2>
                    <p className="text-slate-600 leading-relaxed font-medium">
                        Your booking details are stored using secure cloud infrastructure. We implement 256-bit encryption for all data transmissions between your browser and our servers.
                    </p>
                </section>

                <section className="pt-12 border-t border-slate-100">
                    <h2 className="text-xl font-black text-slate-900 mb-4 uppercase tracking-tight">5. Your Rights</h2>
                    <p className="text-slate-600 leading-relaxed font-medium mb-6">
                        You have the right to request the deletion of your personal data from our systems at any time after your PDI is completed.
                    </p>
                    <div className="flex flex-col md:flex-row gap-6">
                        <div className="bg-white border border-slate-200 p-6 rounded-2xl flex-1">
                            <p className="text-[10px] font-black uppercase text-indigo-600 mb-2 tracking-widest">Privacy Officer</p>
                            <p className="text-sm font-bold text-slate-900">hello@inspectmycar.in</p>
                        </div>
                        <div className="bg-white border border-slate-200 p-6 rounded-2xl flex-1">
                            <p className="text-[10px] font-black uppercase text-indigo-600 mb-2 tracking-widest">WhatsApp Support</p>
                            <p className="text-sm font-bold text-slate-900">+91 99759 34213</p>
                        </div>
                    </div>
                </section>
            </div>
        </main>
    );
}