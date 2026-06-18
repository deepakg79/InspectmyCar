export default function HowItWorks() {
    const steps = [
        { title: "Book Online", desc: "Select your preferred date, time, and dealership location through our simple portal." },
        { title: "Inspector Assigned", desc: "A certified professional with 200+ point checklist is assigned to your PDI." },
        { title: "Physical Inspection", desc: "We meet you at the showroom and conduct a rigorous check of paint, engine, electronics, and interior." },
        { title: "Detailed Report", desc: "Receive a digital health report of the car immediately, helping you decide whether to proceed with registration." }
    ];

    return (
        <main className="max-w-4xl mx-auto px-6 py-24">
            <p className="text-indigo-600 font-black uppercase tracking-widest text-xs mb-4">Our Process</p>
            <h1 className="text-5xl font-black text-slate-900 mb-12 tracking-tighter">How It <span className="text-indigo-600 italic">Works</span></h1>

            <div className="space-y-12">
                {steps.map((step, i) => (
                    <div key={i} className="flex gap-8 items-start group">
                        <div className="text-4xl font-black text-slate-200 group-hover:text-indigo-500 transition-colors">0{i + 1}</div>
                        <div>
                            <h3 className="text-xl font-bold text-slate-900 mb-2">{step.title}</h3>
                            <p className="text-slate-500 leading-relaxed font-medium">{step.desc}</p>
                        </div>
                    </div>
                ))}
            </div>
        </main>
    );
}