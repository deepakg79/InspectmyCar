"use client";
import { useEffect, useState, use } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import checklist from "@/app/lib/checklist";
import { buildPDF } from "@/app/lib/pdfGenerator";
//Map Components

// 🔥 Firebase
import { db } from "@/app/lib/firebase";
import {
    collection,
    query,
    where,
    onSnapshot
} from "firebase/firestore";

// --- TYPES ---
interface TrackingData {
    name: string;
    brand: string;
    model: string;
    location: string;
    slot: string;
    status: string;
    assignedTo?: string;
    date: string;
}

// --- HELPERS ---
function calculateRange(results: any, start: number, end: number) {
    let ok = 0;
    let total = 0;

    for (let i = start; i <= end; i++) {
        const val = results[i.toString()];

        // ✅ SKIP NA + undefined
        if (val === undefined || Number(val) === -1) continue;

        total++;
        if (Number(val) === 1) ok++;
    }

    return total === 0 ? 0 : Math.round((ok / total) * 100);
}


// --- UI COMPONENTS ---
function SummaryBadge({ label, score, icon }: any) {
    return (
        <div className="bg-slate-50 p-4 rounded-3xl border border-slate-100 flex flex-col items-center">
            <span className="text-xl mb-1">{icon}</span>
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">{label}</p>
            <p className="text-lg font-black text-slate-900">{score}%</p>
        </div>
    );
}

function DetailRow({ label, value }: any) {
    return (
        <div className="flex justify-between items-center border-b border-slate-50 pb-3 last:border-0">
            <span className="text-sm font-bold text-slate-500">{label}</span>
            <span className="text-sm font-black text-slate-900 italic text-right max-w-[60%]">{value}</span>
        </div>
    );
}

// --- MAIN ---
export default function CustomerTracking({ params }: { params: Promise<{ mobile: string }> }) {
    const { mobile } = use(params);

    const [data, setData] = useState<TrackingData | null>(null);
    const [report, setReport] = useState<any>(null);
    const [inspector, setInspector] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    // 🔥 REALTIME
    useEffect(() => {
        const bookingQ = query(collection(db, "bookings"), where("mobile", "==", mobile));
        const reportQ = query(collection(db, "reports"), where("mobile", "==", mobile));

        const unsubBooking = onSnapshot(bookingQ, (snap) => {
            snap.forEach(doc => setData(doc.data() as TrackingData));
            setLoading(false);
        });

        const unsubReport = onSnapshot(reportQ, (snap) => {
            snap.forEach(doc => {
                const d = doc.data();
                setReport({
                    meta: d,
                    results: d.checklistResults,
                    score: d.healthScore
                });
            });
        });

        return () => {
            unsubBooking();
            unsubReport();
        };
    }, [mobile]);

    // 🔥 FETCH INSPECTOR
    useEffect(() => {
        if (!data?.assignedTo) return;

        const inspectorQ = query(
            collection(db, "inspectors"),
            where("name", "==", data.assignedTo)
        );

        const unsub = onSnapshot(inspectorQ, (snap) => {
            snap.forEach(doc => setInspector(doc.data()));
        });

        return () => unsub();
    }, [data?.assignedTo]);
    const drawWatermark = (doc: jsPDF) => {
        doc.saveGraphicsState();

        doc.setTextColor(200, 200, 200); // light grey
        doc.setFontSize(50);
        doc.setFont("helvetica", "bold");

        // transparency
        (doc as any).setGState(new (doc as any).GState({ opacity: 0.08 }));

        doc.text("InspectMyCar", 105, 150, {
            align: "center",
            angle: 45
        });

        doc.restoreGraphicsState();
    };


    const generatePDF = async () => {
        if (!report) return;

        const doc = new jsPDF();

        await buildPDF({
            doc,
            report,
            isCustomer: true,
        });

        doc.save(`Report_${report.meta.name}.pdf`);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!data) {
        return <div className="p-20 text-center font-black">NO BOOKING FOUND</div>;
    }
    const overall = report
        ? calculateRange(report.results, 1, 300)
        : 0;    // 🔥 STEP LOGIC
    let currentStep = 0;

    if (data.status === "Confirmed") currentStep = 0;
    else if (data.assignedTo && data.status == "Assigned") currentStep = 1;
    else if (data.status === "Live") currentStep = 2;
    else if (report?.meta?.status === "Approved") currentStep = 4;
    else if (data.status === "Completed") currentStep = 3;

    const isDone = data.status === "Completed";
    const getGreeting = () => {
        const h = new Date().getHours();
        if (h < 12) return "Good Morning";
        if (h < 18) return "Good Afternoon";
        return "Good Evening";
    };
    return (
        <div className="min-h-screen bg-[#F8FAFC] pb-20">

            {/* HEADER (MERGED) */}
            <div className="bg-gradient-to-br from-slate-900 via-indigo-600 to-indigo-500 text-white pt-16 pb-28 px-6 rounded-b-[3rem] text-center shadow-2xl relative">

                <p className="text-indigo-200 font-black uppercase tracking-[0.3em] text-[10px] mb-4">
                    InspectMyCar Pune
                </p>

                <h1 className="text-3xl font-black mb-6">
                    {isDone ? "Inspection Results" : "PDI Live Tracking"}
                </h1>

                {/* 👇 INNER GREETING CARD */}
                <div className="bg-white/10 backdrop-blur-xl rounded-[2rem] p-6 mx-2 border border-white/20">

                    <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-70 mb-2">
                        {getGreeting()}
                    </p>

                    <h2 className="text-2xl font-black mb-1">
                        {data.name}
                    </h2>

                    <p className="text-sm font-black italic">
                        Your {data.brand} {data.model} PDI is {data.status}
                    </p>

                    <p className="text-[10px] font-black mt-2 opacity-70">
                        Please find your PDI details below
                    </p>

                </div>
            </div>

            {/* CONTENT */}
            <div className="max-w-md mx-auto -mt-16 px-6 space-y-6 relative z-10">

                {/* DETAILS */}
                <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-xl">
                    <DetailRow label="Vehicle" value={`${data.brand} ${data.model}`} />
                    <DetailRow label="Location" value={data.location} />
                    <DetailRow label="Time Slot" value={`${data.slot} • ${data.date}`} />
                </div>
                {/* Cancellation Policy */}
                {(data.status === "Confirmed" || data.status === "Assigned") && (
                    <div className="mt-6 rounded-3xl border border-amber-200 bg-amber-50 p-6">
                        <div className="flex items-start gap-4">
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-amber-100 text-xl">
                                ⚠️
                            </div>

                            <div>
                                <h3 className="font-black text-amber-900">
                                    Cancellation & Rescheduling Policy
                                </h3>

                                <p className="mt-2 text-sm leading-relaxed text-amber-800">
                                    Bookings can be <b>cancelled or rescheduled free of charge up to 2 hours before</b> the scheduled inspection time.
                                    Requests made within <b>2 hours of the appointment</b> may not be accommodated, and a <b>₹399 cancellation charge</b> will apply.
                                </p>
                            </div>
                        </div>
                    </div>
                )}
                {/* REPORT */}
                {isDone && report && (
                    <div className="bg-white rounded-[2.5rem] p-8 shadow-xl border border-indigo-100">
                        <div className="flex justify-between mb-6">
                            <p className="text-[10px] font-black uppercase text-slate-400">
                                Overall Health
                            </p>
                            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-black">
                                <span>{overall}%</span>
                            </span>
                        </div>



                        <div className="grid grid-cols-2 gap-4">
                            <SummaryBadge
                                label="Engine Assembly"
                                score={calculateRange(report.results, 1, 80)}
                                icon="⚙️"
                            />

                            <SummaryBadge
                                label="Transmission Assembly"
                                score={calculateRange(report.results, 81, 105)}
                                icon="🔩"
                            />

                            <SummaryBadge
                                label="Exterior Body"
                                score={calculateRange(report.results, 106, 219)}
                                icon="🚗"
                            />

                            <SummaryBadge
                                label="Interior & Safety"
                                score={calculateRange(report.results, 220, 262)}
                                icon="💺"
                            />

                            <SummaryBadge
                                label=" Steering Brakes & Suspension"
                                score={calculateRange(report.results, 263, 274)}
                                icon="🧭"
                            />

                            <SummaryBadge
                                label="Wheels & Tyres"
                                score={calculateRange(report.results, 275, 300)}
                                icon="🛞"
                            />
                        </div>


                        {report?.meta?.status === "Completed" && (
                            <p className="text-yellow-600 font-bold text-sm">
                                Report under review. Available soon.
                            </p>
                        )}
                        {report?.meta?.status === "Approved" && (
                            <button
                                onClick={generatePDF}
                                className="w-full mt-8 bg-slate-900 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest"
                            >
                                Download Full Report PDF 📄
                            </button>
                        )}
                    </div>
                )}

                {/* STATUS TRACKER */}
                <div className="bg-white rounded-[2.5rem] p-8 shadow-xl border border-slate-100">

                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
                                Current Status
                            </p>
                            <p className="text-xl font-black italic text-slate-900">
                                {report?.meta?.status === "Approved"
                                    ? "PDI Completed"
                                    : data.status === "Completed"
                                        ? "Processing Report"
                                        : data.status}
                            </p>
                        </div>

                        <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center relative">

                            {isDone ? (
                                // ✅ CHECK ICON (pure CSS)
                                <div className="w-6 h-6 border-2 border-green-600 rounded-full flex items-center justify-center">
                                    <div className="w-2.5 h-1.5 border-l-2 border-b-2 border-green-600 rotate-[-45deg] mb-[2px]" />
                                </div>
                            ) : (
                                // 📡 LIVE PULSE DOT
                                <div className="relative flex items-center justify-center">
                                    <span className="absolute w-6 h-6 rounded-full bg-indigo-400 opacity-30 animate-ping"></span>
                                    <span className="w-3 h-3 bg-indigo-600 rounded-full"></span>
                                </div>
                            )}

                        </div>
                    </div>

                    <div className="flex justify-between relative mb-4 px-2">

                        <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-100 -translate-y-1/2"></div>

                        <div
                            className="absolute top-1/2 left-0 h-1 bg-indigo-600 -translate-y-1/2 transition-all duration-700"
                            style={{ width: `${(currentStep / 4) * 100}%` }}
                        ></div>

                        {[0, 1, 2, 3, 4].map((i) => (
                            <div
                                key={i}
                                className={`w-4 h-4 rounded-full border-4 border-white ${i <= currentStep ? "bg-indigo-600" : "bg-slate-200"
                                    }`}
                            />
                        ))}
                    </div>

                    <div className="flex justify-between text-[8px] font-black uppercase text-slate-400">
                        <span>Confirmed</span>
                        <span>Assigned</span>
                        <span>Live</span>
                        <span>Processing</span>
                        <span>Done</span>
                    </div>
                </div>

                {/* INSPECTOR */}
                {!isDone && (
                    <div className="bg-indigo-600 rounded-[2.5rem] p-8 text-white shadow-2xl">
                        <p className="text-[10px] font-black uppercase opacity-60 mb-6">
                            Expert Assigned
                        </p>

                        <h3 className="text-xl font-black">
                            {data.assignedTo || "Assigning..."}
                        </h3>

                        {inspector?.mobile && (
                            <a
                                href={`tel:+91${inspector.mobile}`}
                                className="block mt-6 bg-white text-indigo-600 py-4 rounded-2xl font-black text-center"
                            >
                                Contact PDI Inspector 📞
                            </a>
                        )}
                    </div>
                )}



            </div>
        </div>
    );
}