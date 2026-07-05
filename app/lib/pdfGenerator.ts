import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import checklist from "@/app/lib/checklist";
// import { PDF_DISCLAIMER } from "@/app/lib/pdfDisclaimer";

// ------------------ HELPERS ------------------
export const calculateRange = (results: any, start: number, end: number) => {
    let ok = 0;
    let total = 0;

    for (let i = start; i <= end; i++) {
        const val = results[i.toString()];

        if (val === undefined || Number(val) === -1) continue;// ✅ SKIP missing IDs

        total++;
        if (Number(val) === 1) ok++;
    }

    return total === 0 ? 0 : Math.round((ok / total) * 100);
};

export const drawWatermark = (doc: jsPDF) => {
    doc.saveGraphicsState();
    doc.setTextColor(200, 200, 200);
    doc.setFontSize(50);

    (doc as any).setGState(new (doc as any).GState({ opacity: 0.08 }));

    doc.text("InspectMyCar", 105, 150, {
        align: "center",
        angle: 45,
    });

    doc.restoreGraphicsState();
};

// ------------------ MAIN BUILDER ------------------
export const buildPDF = async ({
    doc,
    report,
    isCustomer = false,
}: {
    doc: jsPDF;
    report: any;
    isCustomer?: boolean;
}) => {
    const meta = isCustomer ? report.meta : report;
    const results = isCustomer ? report.results : report.results;
    const score = calculateRange(report.results, 1, 300);

    // ---------------- COVER ----------------
    const img = new Image();
    img.src = "/pdi-cover.jpg";

    await new Promise((res) => (img.onload = res));

    doc.addImage(img, "JPEG", 0, 0, 210, 297);
    drawWatermark(doc);

    // ------------------ PAGE 2 ------------------
    doc.addPage();
    drawWatermark(doc);
    // 🔥 HEADER
    doc.setFillColor(106, 0, 60);
    doc.rect(0, 0, 210, 35, "F");

    doc.setFillColor(194, 24, 91);
    doc.rect(0, 15, 210, 20, "F");

    // LOGO
    const logoRes = await fetch("/logo.png");
    const logoBlob = await logoRes.blob();

    const logoBase64 = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(logoBlob);
    });

    doc.addImage(logoBase64, "PNG", 14, 6, 22, 22);

    // TEXT
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16);
    doc.text("InspectMyCar", 42, 14);

    doc.setFontSize(10);
    doc.text("Premium Inspection Service", 42, 20);
    doc.text("Mobile: +91 9975934213", 42, 25);
    doc.text("Email: support@inspectmycar.in", 42, 30);

    doc.setTextColor(0);
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("Vehicle Inspection Report", 105, 45, { align: "center" });

    // ------------------ VEHICLE INFO ------------------
    autoTable(doc, {
        startY: 55,
        theme: "grid",
        styles: { fontSize: 10, cellPadding: 4 },
        columnStyles: {
            0: { fontStyle: "bold" },
            2: { fontStyle: "bold" }
        },
        body: [
            ["Customer Name", meta.name || "-", "Inspection Date", meta.date || "-"],
            ["Contact No", meta.mobile || "-", "Inspector", meta.inspector || meta.assignedTo || "-"],
            ["VIN", meta.vin || "-", "Odometer", meta.odometer || "-"],
            [
                "Vehicle Model",
                `${meta.brand || "-"} ${meta.model || "-"} ${meta.variant ? meta.variant : ""} ${meta.vehicleType ? `(${meta.vehicleType})` : ""}`,
                "Car Mfg",
                `${meta.month || ""} ${meta.year || ""}`.trim() || "-",
            ],

        ],
    });

    // ------------------ HEALTH CARDS ------------------
    const engine = calculateRange(results, 1, 80);
    const transmission = calculateRange(results, 81, 105);
    const body = calculateRange(results, 106, 219);
    const interior = calculateRange(results, 220, 262);
    const steering = calculateRange(results, 263, 274);
    const brakesSuspension = calculateRange(results, 275, 300);

    let startY = (doc as any).lastAutoTable.finalY + 10;

    // Title
    autoTable(doc, {
        startY: startY,
        head: [["Overall Vehicle Health"]],

        headStyles: {
            fillColor: [194, 24, 91],
            textColor: 255,
            fontStyle: "bold"
        },

        styles: {
            textColor: [220, 38, 38]
        },
    });

    // doc.text("Overall Vehicle Health", 15, startY);
    // 🔥 Smaller container
    const gridY = startY + 15;
    // 🔥 Smaller container (less width)
    const containerX = 27;
    const containerY = gridY - 2;
    const containerWidth = 140;
    const containerHeight = 70;

    doc.setFillColor(252, 231, 243);
    doc.roundedRect(containerX, containerY, containerWidth, containerHeight, 5, 5, "F");




    // 🔥 Smaller cards (reduced width)
    const cardWidth = 40;
    const cardHeight = 20;

    // 🔥 Smaller container (fits new cards properly)
    doc.setFillColor(194, 24, 91);
    doc.roundedRect(containerX, containerY, containerWidth, containerHeight, 6, 6, "F");

    // 🔥 Updated card renderer
    const drawCard = (x: number, y: number, score: number, label: string) => {
        doc.setFillColor(255, 255, 255);
        doc.roundedRect(x, y, cardWidth, cardHeight, 3, 3, "F");

        doc.setFontSize(9);
        doc.setTextColor(120, 0, 60);

        // ✅ Wrap text within card width
        const maxWidth = cardWidth - 4;
        const lines = doc.splitTextToSize(label.toUpperCase(), maxWidth);

        // Center vertically based on number of lines
        const textY = y + 6;

        doc.text(lines, x + cardWidth / 2, textY, {
            align: "center",
            maxWidth: maxWidth,
        });

        // score
        doc.setFontSize(11);
        doc.setTextColor(0);
        doc.text(`${score}%`, x + cardWidth / 2, y + cardHeight - 4, {
            align: "center",
        });
    };
    // spacing
    const gapX = 45;
    const gapY = 22;

    // center
    const centerX = containerX + containerWidth / 2;
    const centerY = containerY + containerHeight / 2;

    // ---- TOP ROW (2 cards)
    drawCard(centerX - gapX, gridY, engine, "Engine Assembly");
    drawCard(centerX + gapX - cardWidth, gridY, transmission, "Transmission Assembly");

    // ---- MIDDLE ROW (2 side cards)
    drawCard(centerX - gapX - 10, gridY + gapY, body, "Exterior Body");
    drawCard(centerX + gapX - cardWidth + 10, gridY + gapY, interior, "Interior & Safety");

    // ---- BOTTOM ROW (2 cards)
    drawCard(centerX - gapX, gridY + gapY * 2, steering, "Steering, Brakes & Suspension");
    drawCard(centerX + gapX - cardWidth, gridY + gapY * 2, brakesSuspension, "Wheels & Tyres");
    // 🔥 AFTER all drawCard() calls


    const badgeWidth = 28;
    const badgeHeight = 14;

    const badgeX = centerX - badgeWidth / 2;
    const badgeY = centerY - badgeHeight / 2;

    doc.setFillColor(194, 24, 91);
    doc.roundedRect(badgeX, badgeY, badgeWidth, badgeHeight, 5, 5, "F");

    doc.setFontSize(8);
    doc.setTextColor(255, 255, 255);
    doc.text("Overall Score", centerX, centerY - 2, { align: "center" });

    doc.setFontSize(12);
    doc.text(`${score}%`, centerX, centerY + 4, { align: "center" });

    // ------------------ ISSUES ------------------
    const issues: any[] = [];

    checklist.forEach((section) => {
        section.items.forEach((item: any, index: number) => {
            const id =
                typeof item === "object" && item.label
                    ? item.label
                    : String(section.startNo + index);

            const text = typeof item === "object"
                ? item.text
                : item;

            // 🔥 skip tyre items
            if (typeof item === "object" && item.type === "TYRE") return;

            const val = report.results[id] ?? 1; // default OK

            if (val === 0) {
                const comment =
                    report.meta?.comments?.[id] ||
                    report.meta?.comments?.[String(id)] ||
                    report.comments?.[id];

                issues.push([
                    comment
                        ? `${text} — ${comment}`
                        : text
                ]);
            }
        });
    });

    if (issues.length > 0) {
        // doc.setTextColor(0);
        // doc.setFontSize(14);
        // doc.text("PDI Issues Summary", 105, 182, { align: "center" });
        autoTable(doc, {
            startY: 200,
            head: [["PDI Issues Summary"]],
            body: issues,

            headStyles: {
                fillColor: [194, 24, 91],
                textColor: 255,
                fontStyle: "bold"
            },

            styles: {
                textColor: [220, 38, 38]
            },

            didDrawPage: () => {
                drawWatermark(doc);
            }
        });
    }
    const inspectorComments =
        report.inspectorComments ||
        report.meta?.inspectorComments ||
        [];
    if (inspectorComments.length > 0) {
        autoTable(doc, {
            startY:
                issues.length > 0
                    ? (doc as any).lastAutoTable.finalY + 10
                    : 200,

            head: [["Inspector Observations"]],

            body: inspectorComments.map((comment: string, index: number) => [
                `${index + 1}. ${comment}`,
            ]),

            headStyles: {
                fillColor: [194, 24, 91],
                textColor: 255,
                fontStyle: "bold",
            },

            styles: {
                fontSize: 10,
                cellPadding: 4,
                valign: "middle",
            },

            didDrawPage: () => {
                drawWatermark(doc);
            },
        });
    }
    drawWatermark(doc);
    // ---------------- CHECKLIST ----------------
    // ------------------ PAGE 3 (CHECKLIST) ------------------
    doc.addPage();
    drawWatermark(doc);

    const tableData: any[] = [];

    checklist.forEach((section) => {
        tableData.push([
            {
                content: section.section,
                colSpan: 3,
                styles: {
                    fillColor: [194, 24, 91], // same as header
                    textColor: [255, 255, 255]
                }
            }
        ]);

        section.items.forEach((item: any, index: number) => {
            const id =
                typeof item === "object" && item.label
                    ? item.label
                    : String(section.startNo + index);

            const text = typeof item === "object"
                ? item.text
                : item;

            // 🔥 skip tyre items OR handle separately
            if (typeof item === "object" && item.type === "TYRE") {
                const tyre = meta?.tyreData?.[id];
                tableData.push([
                    id,
                    text,
                    tyre
                        ? `${tyre.week || "-"} / ${tyre.year || "-"}`
                        : "-"
                ]);
            } else {
                const val = Number(report.results[id] ?? 1);
                tableData.push([
                    id,
                    text,
                    val === -1
                        ? "NA"
                        : val === 1
                            ? "OK"
                            : "ISSUE"]);
            }
        });
    });
    doc.setTextColor(0);
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("Detailed PDI Checklist", 105, 15, { align: "center" });

    doc.setFontSize(9);
    doc.setTextColor(120);
    doc.text(
        "Note: NA checkpoints are not applicable for this vehicle variant.",
        14, 20
    );

    autoTable(doc, {
        startY: 25,
        didParseCell: function (data: any) {
            if (data.section === "body" && data.column.index === 2) {
                const value = data.cell.raw;
                if (value === "NA" && data.row?.cells) {
                    Object.values(data.row.cells).forEach((cell: any) => {
                        cell.styles.textColor = [150, 150, 150];

                    });
                }
                if (value === "ISSUE") {
                    data.cell.styles.textColor = [220, 38, 38]; // 🔴 red
                    data.cell.styles.fontStyle = "bold";
                } else if (value === "OK") {
                    data.cell.styles.textColor = [0, 0, 0]; // ⚫ black
                } else if (value === "NA") {
                    data.cell.styles.textColor = [120, 120, 120]; // ⚪ grey
                    data.cell.styles.fontStyle = "italic";
                }
            }
        },
        head: [["ID", "Inspection Item", "Status"]],
        headStyles: {
            fillColor: [106, 0, 60],
            textColor: 255,
            fontStyle: "bold"
        },
        body: tableData,
        styles: { fontSize: 7 },

        didDrawPage: () => {
            drawWatermark(doc);
        }

    });
    // doc.addPage();
    // drawWatermark(doc);

    // doc.setFontSize(22);
    // doc.setFont("helvetica", "bold");

    // autoTable(doc, {
    //     startY: 15,
    //     head: [["DISCLAIMER"]],
    //     body: [[PDF_DISCLAIMER]],

    //     theme: "grid",

    //     headStyles: {
    //         fillColor: [194, 24, 91],
    //         textColor: 255,
    //         halign: "center",
    //         fontStyle: "bold",
    //         fontSize: 16,
    //     },

    //     styles: {
    //         fontSize: 9,
    //         cellPadding: 5,
    //         valign: "top",
    //         overflow: "linebreak",
    //     },

    //     columnStyles: {
    //         0: {
    //             cellWidth: 180,
    //             halign: "justify",
    //         },
    //     },

    //     didDrawPage: () => drawWatermark(doc),
    // });
};