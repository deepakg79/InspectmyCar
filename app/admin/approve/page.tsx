////Install first : npm install pdf-lib

"use client";

import { useEffect, useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import checklist from "@/app/lib/checklist";
import { db } from "@/app/lib/firebase";
import { PDFDocument } from "pdf-lib";
import { buildPDF } from "@/app/lib/pdfGenerator";

import {
    collection,
    query,
    where,
    onSnapshot,
    updateDoc,
    doc
} from "firebase/firestore";

// --- HELPERS ---
function calculateRange(results: any, start: number, end: number) {
    let ok = 0;
    let total = 0;
    for (let i = start; i <= end; i++) {
        const val = results[i.toString()];
        if (val !== undefined) {
            total++;
            if (val === 1) ok++;
        }
    }
    return total === 0 ? 0 : Math.round((ok / total) * 100);
}


export default function ApprovePDIsPage() {
    const [reports, setReports] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [photoPDFs, setPhotoPDFs] = useState<{ [key: string]: File }>({});
    const [filter, setFilter] = useState<"pending" | "approved">("pending");
    const [editingReport, setEditingReport] = useState<any>(null);
    const [search, setSearch] = useState("");

    const openEditor = (report: any) => {
        const normalizedResults: any = {};

        checklist.forEach((section) => {
            section.items.forEach((item: any, index: number) => {

                const oldId =
                    typeof item === "object" && item.label
                        ? item.label
                        : (section.startNo + index).toString();

                const newId =
                    typeof item === "object" && item.label
                        ? `${section.section}-${item.label}`
                        : `${section.section}-${section.startNo + index}`;

                const val = report.results?.[oldId];

                normalizedResults[newId] = {
                    value: typeof val === "number" ? val : val?.value ?? 1,
                    comment: report.comments?.[oldId] || ""
                };
            });
        });

        setEditingReport({
            ...report,
            results: normalizedResults,
            inspectorComments: report.inspectorComments || [],
        });
    };
    // 🔥 FETCH REPORTS READY FOR APPROVAL
    useEffect(() => {
        const q = query(collection(db, "reports"));

        const unsub = onSnapshot(q, (snap) => {
            const data: any[] = [];

            snap.forEach((docSnap) => {
                const d = docSnap.data();

                data.push({
                    id: docSnap.id,
                    ...d,
                    results: d.checklistResults
                });
            });

            setReports(data);
            setLoading(false);
        });

        return () => unsub();
    }, []);

    // 🔥 WATERMARK
    const drawWatermark = (doc: jsPDF) => {
        doc.saveGraphicsState();
        doc.setTextColor(200, 200, 200);
        doc.setFontSize(50);
        (doc as any).setGState(new (doc as any).GState({ opacity: 0.08 }));
        doc.text("InspectMyCar", 105, 150, {
            align: "center",
            angle: 45
        });
        doc.restoreGraphicsState();
    };

    // 🔥 FULL PDF GENERATOR (same as customer)
    const generatePDF = async (report: any) => {
        const doc = new jsPDF();

        await buildPDF({
            doc,
            report,
            isCustomer: false,
        });

        const pdfBytes = doc.output("arraybuffer");

        const mergedPdf = await PDFDocument.create();

        // Report pages
        const reportPdf = await PDFDocument.load(pdfBytes);
        const reportPages = await mergedPdf.copyPages(
            reportPdf,
            reportPdf.getPageIndices()
        );
        reportPages.forEach(page => mergedPdf.addPage(page));

        // Disclaimer page
        const disclaimerBytes = await fetch("/disclaimer.pdf")
            .then(r => r.arrayBuffer());

        const disclaimerPdf = await PDFDocument.load(disclaimerBytes);

        const disclaimerPages = await mergedPdf.copyPages(
            disclaimerPdf,
            disclaimerPdf.getPageIndices()
        );

        disclaimerPages.forEach(page => mergedPdf.addPage(page));

        const finalBytes = await mergedPdf.save();

        const safeBuffer = new Uint8Array(finalBytes).buffer;

        const blob = new Blob([safeBuffer], {
            type: "application/pdf",
        });

        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = `Report_${report.name}.pdf`;
        a.click();

        URL.revokeObjectURL(url);
    };



    // Modify the signature to return the blob
    const generateMergedPDF = async (report: any, photoFile?: File, shouldDownload = true) => {
        const doc = new jsPDF();
        await generatePDFInternal(doc, report);
        const pdfBytes = doc.output("arraybuffer");

        const mergedPdf = await PDFDocument.create();
        const mainPdf = await PDFDocument.load(pdfBytes);
        const mainPages = await mergedPdf.copyPages(mainPdf, mainPdf.getPageIndices());
        mainPages.forEach((p) => mergedPdf.addPage(p));

        if (photoFile) {
            const photoBytes = await photoFile.arrayBuffer();
            const photoPdf = await PDFDocument.load(photoBytes);
            const photoPages = await mergedPdf.copyPages(photoPdf, photoPdf.getPageIndices());
            photoPages.forEach((p) => mergedPdf.addPage(p));
        }
        // Append disclaimer as the LAST page
        const disclaimerBytes = await fetch("/disclaimer.pdf").then(r => r.arrayBuffer());

        const disclaimerPdf = await PDFDocument.load(disclaimerBytes);

        const disclaimerPages = await mergedPdf.copyPages(
            disclaimerPdf,
            disclaimerPdf.getPageIndices()
        );

        disclaimerPages.forEach(page => mergedPdf.addPage(page));
        const finalPdfBytes = await mergedPdf.save();
        const safeBuffer = new Uint8Array(finalPdfBytes).buffer;
        const blob = new Blob([safeBuffer], { type: "application/pdf" });
        const fileName = `Report_${report.name}_${report.model}.pdf`;

        if (shouldDownload) {
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = fileName;
            a.click();
        }

        // Return these so the Share function can use them
        return { blob, fileName };
    };


    const generatePDFInternal = async (doc: jsPDF, report: any) => {
        await buildPDF({
            doc,
            report,
            isCustomer: false,
        });
    };

    const saveEdit = async () => {
        if (!editingReport) return;

        const checklistResults: any = {};
        const comments: any = {};

        checklist.forEach((section) => {
            section.items.forEach((item: any, index: number) => {

                const oldId =
                    typeof item === "object" && item.label
                        ? item.label
                        : (section.startNo + index).toString();

                const newId =
                    typeof item === "object" && item.label
                        ? `${section.section}-${item.label}`
                        : `${section.section}-${section.startNo + index}`;

                const val = editingReport.results?.[newId];

                if (!val) return;

                checklistResults[oldId] = val.value ?? 1;

                if (val.comment) {
                    comments[oldId] = val.comment;
                }
            });
        });

        await updateDoc(doc(db, "reports", editingReport.id), {
            checklistResults,
            comments,
            tyreData: editingReport.tyreData || {},
            vehicleType: editingReport.vehicleType || "",
            inspectorComments: (editingReport.inspectorComments || [])
                .map((c: string) => c.trim())
                .filter(Boolean),
        });

        setEditingReport(null);
    };

    // 🔥 APPROVE
    const handleApprove = async (id: string) => {
        await updateDoc(doc(db, "reports", id), {
            status: "Approved",
            approved: true
        });
    };

    const shareToWhatsApp = async (report: any, photoFile?: File) => {
        try {
            const { blob, fileName } = await generateMergedPDF(report, photoFile, false);
            const file = new File([blob], fileName, { type: "application/pdf" });

            if (navigator.canShare && navigator.canShare({ files: [file] })) {
                // The browser opens the share sheet here
                await navigator.share({
                    files: [file],
                    title: 'Vehicle Inspection Report',
                    text: `Here is the inspection report for ${report.model}`,
                });

                console.log("Report shared successfully!");
            } else {
                alert("Sharing is not supported on this browser. Try downloading instead.");
            }
        } catch (error: any) {
            // 🔥 Handle the "Cancel" or "Abort" error
            if (error.name === 'AbortError') {
                console.log("User closed the share menu (Share canceled).");
                // You don't usually need to alert the user here, 
                // as they know they clicked 'cancel'.
            } else {
                // Handle actual errors (e.g., file too large, network issues)
                console.error("Actual sharing error:", error);
                alert("An error occurred while trying to share the PDF.");
            }
        }
    };



    if (loading) return <p>Loading...</p>;

    return (
        <div className="space-y-6">
            <header className="mb-12">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">

                    <div>
                        <h1 className="text-6xl font-black tracking-tighter mb-2 text-slate-900">
                            PDI <span className="text-indigo-600 italic">Approvals</span>
                        </h1>

                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
                            Review • Edit • Approve Reports
                        </p>
                    </div>

                    <div className="bg-indigo-50 px-5 py-3 rounded-2xl text-indigo-600 text-xs font-black">
                        {reports.length} Reports
                    </div>

                </div>
            </header>
            <div className="pt-6 border-t border-slate-200">

                <div className="flex justify-between items-center mb-6">
                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value as any)}
                        className="px-4 py-2 rounded-lg border border-slate-300 text-sm font-bold"
                    >
                        <option value="pending">To Be Approved</option>
                        <option value="approved">Approved</option>
                    </select>
                </div>
                {reports
                    .filter((r) =>
                        filter === "pending"
                            ? r.status === "Completed"
                            : r.status === "Approved"
                    )
                    .map((r) => (
                        <div key={r.id} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-all">
                            <p className="text-[10px] font-black tracking-[0.25em] text-indigo-600">
                                ID: {r.id.substring(0, 8)}
                            </p>

                            <p className="font-bold text-lg text-slate-900">
                                {r.name}
                            </p>

                            <p className="text-slate-700 font-medium">
                                {r.brand} {r.model}
                            </p>
                            <p className="text-sm text-slate-500">
                                📅 {r.date} • {r.inspector}
                            </p>
                            <p className="text-sm text-gray-500">
                                {r.mobile}
                            </p>

                            <div className="flex flex-wrap gap-2 mt-4 pt-3 border-t border-slate-100">
                                <span className={`text-xs font-bold px-2 py-1 rounded-full ${r.status === "Approved"
                                    ? "bg-green-100 text-green-700"
                                    : "bg-amber-100 text-amber-700"
                                    }`}>
                                    {r.status}
                                </span>
                                <button
                                    onClick={() => openEditor(r)}
                                    className="bg-blue-600 text-white px-3 py-2 rounded-lg text-xs font-bold"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => generatePDF(r)}
                                    className="bg-black text-white px-3 py-2 rounded-lg text-xs font-bold"
                                >
                                    Preview
                                </button>

                                <label className="bg-slate-800 text-white px-3 py-2 rounded-lg text-xs font-bold cursor-pointer">
                                    Upload PDF
                                    <input
                                        type="file"
                                        accept="application/pdf"
                                        onChange={(e) => {
                                            if (e.target.files?.[0]) {
                                                setPhotoPDFs(prev => ({
                                                    ...prev,
                                                    [r.id]: e.target.files![0]
                                                }));
                                            }
                                        }}
                                        className="hidden"
                                    />
                                </label>

                                <button
                                    onClick={() => generateMergedPDF(r, photoPDFs[r.id])}
                                    className="bg-purple-700 text-white px-3 py-2 rounded-lg text-xs font-bold"
                                >
                                    Merge
                                </button>

                                <button
                                    onClick={() => shareToWhatsApp(r, photoPDFs[r.id])}
                                    className="bg-green-500 text-white px-3 py-2 rounded-lg text-xs font-bold"
                                >
                                    Share
                                </button>

                                {r.status !== "Approved" && (
                                    <button
                                        onClick={() => handleApprove(r.id)}
                                        className="bg-green-600 text-white px-3 py-2 rounded-lg text-xs font-bold"
                                    >
                                        Approve
                                    </button>
                                )}

                            </div>
                        </div>
                    ))}
            </div>
            {editingReport && (
                <div
                    className="fixed inset-0 bg-black/50 z-50 flex justify-center items-start pt-10"
                    onClick={() => setEditingReport(null)}
                >
                    <div
                        className="bg-white w-full max-w-4xl h-[90vh] rounded-2xl flex flex-col shadow-xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* 🔥 HEADER */}
                        <div className="sticky top-0 z-20 bg-white border-b px-6 py-4 flex justify-between items-center">
                            <h2 className="text-lg font-black text-slate-800">
                                Edit PDI - {editingReport.name}
                            </h2>

                            <button
                                onClick={() => setEditingReport(null)}
                                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-sm font-bold"
                            >
                                ✕
                            </button>
                        </div>

                        {/* 🔥 SCROLL AREA */}
                        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">

                            {/* VEHICLE TYPE */}
                            <div>
                                <label className="text-xs font-bold">Vehicle Type</label>
                                <select
                                    value={editingReport.vehicleType || ""}
                                    onChange={(e) =>
                                        setEditingReport((prev: any) => ({
                                            ...prev,
                                            vehicleType: e.target.value
                                        }))
                                    }
                                    className="border px-3 py-2 rounded-lg text-sm w-full"
                                >
                                    <option value="">Select</option>
                                    <option>Petrol</option>
                                    <option>Diesel</option>
                                    <option>CNG</option>
                                    <option>EV</option>
                                </select>
                            </div>
                            {/* INSPECTOR COMMENTS */}
                            <div className="space-y-3">

                                <div className="flex items-center justify-between">
                                    <label className="text-xs font-bold">
                                        Inspector Comments
                                    </label>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setEditingReport((prev: any) => ({
                                                ...prev,
                                                inspectorComments: [
                                                    ...(prev.inspectorComments || []),
                                                    ""
                                                ]
                                            }))
                                        }
                                        className="bg-indigo-600 text-white px-3 py-2 rounded-lg text-[10px] font-black"
                                    >
                                        + Add Comment
                                    </button>
                                </div>

                                {(editingReport.inspectorComments || []).map(
                                    (comment: string, index: number) => (
                                        <textarea
                                            key={index}
                                            rows={2}
                                            value={comment}
                                            placeholder={`Comment ${index + 1}`}
                                            onChange={(e) => {
                                                const updated = [...editingReport.inspectorComments];
                                                updated[index] = e.target.value;

                                                setEditingReport((prev: any) => ({
                                                    ...prev,
                                                    inspectorComments: updated
                                                }));
                                            }}
                                            className="w-full border rounded-xl bg-slate-50 p-3 text-sm resize-none"
                                        />
                                    )
                                )}

                            </div>
                            {/* SEARCH */}
                            <input
                                type="text"
                                placeholder="Search inspection item..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full px-3 py-2 border rounded-lg text-sm"
                            />

                            {/* CHECKLIST */}
                            <div className="space-y-6">
                                {checklist.map((section) => (
                                    <div key={section.section}>
                                        <p className="text-xs font-black text-slate-500 uppercase tracking-wider mb-2">
                                            {section.section}
                                        </p>

                                        <div className="space-y-2">
                                            {section.items.map((item: any, index: number) => {

                                                const id =
                                                    typeof item === "object" && item.label
                                                        ? `${section.section}-${item.label}`
                                                        : `${section.section}-${section.startNo + index}`;

                                                const text =
                                                    typeof item === "object" ? item.text : item;

                                                const isNA =
                                                    typeof item === "object" &&
                                                    item.notFor &&
                                                    editingReport.vehicleType &&
                                                    item.notFor.includes(editingReport.vehicleType);

                                                const data =
                                                    editingReport.results?.[id] || { value: 1, comment: "" };

                                                const value = isNA ? -1 : data.value;
                                                const comment = data.comment || "";

                                                // 🔥 TYRE
                                                if (typeof item === "object" && item.type === "TYRE") {
                                                    const originalId =
                                                        typeof item === "object" && item.label
                                                            ? item.label
                                                            : (section.startNo + index).toString();

                                                    const tyre = editingReport.tyreData?.[originalId] || {};

                                                    return (
                                                        <div
                                                            key={`${section.section}-${id}-${index}`}
                                                            className="flex justify-between items-center gap-4 p-3 rounded-xl border bg-slate-50"
                                                        >
                                                            <div className="max-w-[65%]">
                                                                <p className="text-[10px] font-black text-slate-400">
                                                                    #{id}
                                                                </p>
                                                                <p className="text-xs font-semibold text-slate-700 break-words">
                                                                    {text}
                                                                </p>
                                                            </div>

                                                            <div className="flex gap-2 shrink-0">
                                                                <input
                                                                    placeholder="Week"
                                                                    value={tyre.week || ""}
                                                                    onChange={(e) => {
                                                                        const val = e.target.value;

                                                                        setEditingReport((prev: any) => ({
                                                                            ...prev,
                                                                            tyreData: {
                                                                                ...prev.tyreData,
                                                                                [originalId]: {
                                                                                    ...prev.tyreData?.[originalId],
                                                                                    week: val,
                                                                                },
                                                                            },
                                                                        }));
                                                                    }}
                                                                    className="border px-2 py-1 text-xs w-16 rounded"
                                                                />

                                                                <input
                                                                    placeholder="Year"
                                                                    value={tyre.year || ""}
                                                                    onChange={(e) => {
                                                                        const val = e.target.value;

                                                                        setEditingReport((prev: any) => ({
                                                                            ...prev,
                                                                            tyreData: {
                                                                                ...prev.tyreData,
                                                                                [originalId]: {
                                                                                    ...prev.tyreData?.[originalId],
                                                                                    year: val,
                                                                                },
                                                                            },
                                                                        }));
                                                                    }}
                                                                    className="border px-2 py-1 text-xs w-20 rounded"
                                                                />
                                                            </div>
                                                        </div>
                                                    );
                                                }

                                                return (
                                                    <div
                                                        key={`${section.section}-${id}-${index}`}
                                                        className="flex justify-between items-start gap-4 p-3 rounded-xl border bg-slate-50"
                                                    >
                                                        {/* LEFT */}
                                                        <div className="max-w-[65%]">
                                                            <p className="text-[10px] font-black text-slate-400">
                                                                #{id}
                                                            </p>
                                                            <p className="text-xs font-semibold text-slate-700 break-words">
                                                                {text}
                                                            </p>
                                                        </div>

                                                        {/* RIGHT */}
                                                        <div className="flex flex-col items-end gap-2 w-[130px] shrink-0">

                                                            {isNA && (
                                                                <span className="text-[10px] font-black text-slate-400">
                                                                    NA
                                                                </span>
                                                            )}

                                                            {!isNA && (
                                                                <select
                                                                    value={value}
                                                                    onChange={(e) => {
                                                                        const val = Number(e.target.value);

                                                                        setEditingReport((prev: any) => ({
                                                                            ...prev,
                                                                            results: {
                                                                                ...prev.results,
                                                                                [id]: {
                                                                                    ...prev.results[id],
                                                                                    value: val,
                                                                                },
                                                                            },
                                                                        }));
                                                                    }}
                                                                    className="w-full border px-2 py-1 text-xs rounded-lg font-bold bg-white"
                                                                >
                                                                    <option value={1}>OK</option>
                                                                    <option value={0}>ISSUE</option>
                                                                </select>
                                                            )}

                                                            {!isNA && value === 0 && (
                                                                <input
                                                                    placeholder="Comment"
                                                                    value={comment}
                                                                    onChange={(e) => {
                                                                        const val = e.target.value;

                                                                        setEditingReport((prev: any) => ({
                                                                            ...prev,
                                                                            results: {
                                                                                ...prev.results,
                                                                                [id]: {
                                                                                    ...prev.results[id],
                                                                                    comment: val,
                                                                                },
                                                                            },
                                                                        }));
                                                                    }}
                                                                    className="w-full border border-red-200 bg-red-50 px-2 py-1 text-xs rounded-lg"
                                                                />
                                                            )}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* 🔥 FOOTER */}
                        <div className="sticky bottom-0 bg-white border-t px-6 py-3 flex justify-end gap-3">
                            <button
                                onClick={saveEdit}
                                className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-xl text-sm font-black"
                            >
                                Save Changes
                            </button>

                            <button
                                onClick={() => setEditingReport(null)}
                                className="bg-slate-200 hover:bg-slate-300 px-5 py-2 rounded-xl text-sm font-black"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div >

    );
}