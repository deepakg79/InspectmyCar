
import { NextRequest, NextResponse } from "next/server";
import { getAuth } from "firebase-admin/auth";
import { FieldValue } from "firebase-admin/firestore";
import { jsPDF } from "jspdf";
import { randomUUID } from "node:crypto";
import { adminDb } from "@/app/lib/firebaseAdmin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type CustomerInput = {
  name: string;
  mobile: string;
  brand: string;
  model: string;
  inspectionType: "New Car PDI" | "Used Car PPI";
  date: string;
  time: string;
  amount: number;
};

type InvoicePayload = {
  bookingId?: string | null;
  customer: CustomerInput;
};

function jsonError(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

async function authorizeAdmin(request: NextRequest) {
  const authorization = request.headers.get("authorization") || "";
  const token = authorization.match(/^Bearer\s+(.+)$/i)?.[1];

  if (!token) {
    throw new Error("AUTH_REQUIRED");
  }

  const decoded = await getAuth().verifyIdToken(token);

  // Configure ADMIN_UIDS as a comma-separated list of Firebase Auth UIDs.
  // Do not leave the admin endpoint open to every authenticated user.
  const allowedUids = (process.env.ADMIN_UIDS || "")
    .split(",")
    .map((uid) => uid.trim())
    .filter(Boolean);

  if (!allowedUids.length || !allowedUids.includes(decoded.uid)) {
    throw new Error("ADMIN_ACCESS_REQUIRED");
  }

  return decoded.uid;
}

function normalizeWhatsAppNumber(input: string) {
  let digits = input.replace(/\D/g, "");

  // Convert a plain 10-digit Indian number to international format.
  if (digits.length === 10) {
    digits = `91${digits}`;
  }

  if (!/^[1-9]\d{9,14}$/.test(digits)) {
    throw new Error(
      "Use a valid WhatsApp number with country code, e.g. +91 9876543210."
    );
  }

  return digits;
}

function validateCustomer(value: unknown): CustomerInput {
  if (!value || typeof value !== "object") {
    throw new Error("Customer details are required.");
  }

  const c = value as Record<string, unknown>;

  const name = typeof c.name === "string" ? c.name.trim() : "";
  const mobile = typeof c.mobile === "string" ? c.mobile.trim() : "";
  const brand = typeof c.brand === "string" ? c.brand.trim() : "";
  const model = typeof c.model === "string" ? c.model.trim() : "";
  const date = typeof c.date === "string" ? c.date.trim() : "";
  const time = typeof c.time === "string" ? c.time.trim() : "";
  const inspectionType = c.inspectionType;
  const amount = Number(c.amount);

  if (!name || !mobile || !brand || !model || !date || !time) {
    throw new Error("Complete all required customer and inspection fields.");
  }

  if (
    !["New Car PDI", "Used Car PPI"].includes(
      String(inspectionType)
    )
  ) {
    throw new Error("Choose New Car PDI or Used Car PPI.");
  }

  if (!Number.isFinite(amount) || amount < 0 || amount > 100000000) {
    throw new Error("Enter a valid invoice amount.");
  }

  // Validate date as YYYY-MM-DD and reject invalid calendar dates.
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    throw new Error("Inspection date must be in YYYY-MM-DD format.");
  }

  const parsedDate = new Date(`${date}T00:00:00.000Z`);
  if (
    Number.isNaN(parsedDate.getTime()) ||
    parsedDate.toISOString().slice(0, 10) !== date
  ) {
    throw new Error("Enter a valid inspection date.");
  }

  if (time.length > 50 || name.length > 200 || brand.length > 100 ||
      model.length > 100 || mobile.length > 30) {
    throw new Error("One or more customer fields are too long.");
  }

  return {
    name,
    mobile,
    brand,
    model,
    inspectionType: inspectionType as CustomerInput["inspectionType"],
    date,
    time,
    amount: Math.round(amount * 100) / 100,
  };
}

function inr(value: number) {
  return `Rs. ${value.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function makeInvoicePdf(
  invoiceNumber: string,
  customer: CustomerInput,
  createdAt: Date
): ArrayBuffer {
  const pdf = new jsPDF({ unit: "mm", format: "a4" });
  const pageWidth = pdf.internal.pageSize.getWidth();
  const margin = 18;
  const contentWidth = pageWidth - margin * 2;

  pdf.setFillColor(49, 46, 129);
  pdf.rect(0, 0, pageWidth, 43, "F");

  pdf.setTextColor(255, 255, 255);
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(23);
  pdf.text("InspectMyCar", margin, 18);

  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(10);
  pdf.text("Car Inspection Services", margin, 26);
  pdf.text("CUSTOMER INVOICE", pageWidth - margin, 18, {
    align: "right",
  });

  pdf.setFontSize(9);
  pdf.text(`Invoice No: ${invoiceNumber}`, pageWidth - margin, 27, {
    align: "right",
  });
  pdf.text(
    `Issued: ${createdAt.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      timeZone: "Asia/Kolkata",
    })}`,
    pageWidth - margin,
    34,
    { align: "right" }
  );

  let y = 57;

  pdf.setTextColor(55, 65, 81);
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(11);
  pdf.text("BILL TO", margin, y);

  y += 8;
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(12);
  pdf.text(customer.name, margin, y);

  y += 6;
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(10);
  pdf.text(`WhatsApp: +${normalizeWhatsAppNumber(customer.mobile)}`, margin, y);

  y += 6;
  pdf.text(`Car: ${customer.brand} ${customer.model}`, margin, y);

  y += 6;
  pdf.text(
    `Inspection: ${customer.inspectionType}`,
    margin,
    y
  );

  y += 6;
  pdf.text(`Date & Time: ${customer.date} | ${customer.time}`, margin, y);

  y += 13;

  // Description and amount only: intentionally no quantity column.
  const colDescription = margin + 4;
  const colAmount = pageWidth - margin - 4;

  pdf.setFillColor(49, 46, 129);
  pdf.roundedRect(margin, y, contentWidth, 11, 2, 2, "F");

  pdf.setTextColor(255, 255, 255);
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(10);
  pdf.text("Description", colDescription, y + 7);
  pdf.text("Amount", colAmount, y + 7, { align: "right" });

  y += 11;
  pdf.setDrawColor(226, 232, 240);
  pdf.setFillColor(248, 250, 252);
  pdf.rect(margin, y, contentWidth, 27, "FD");

  pdf.setTextColor(31, 41, 55);
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(9);

  const description = [
    `Customer name: ${customer.name}`,
    `Brand & Model: ${customer.brand} ${customer.model}`,
    `Service: ${customer.inspectionType}`,
    `Date & Time: ${customer.date} | ${customer.time}`,
    "PDI pricing",
  ];

  let lineY = y + 6;
  for (const line of description) {
    pdf.text(line, colDescription, lineY);
    lineY += 4.5;
  }

  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(10);
  pdf.text(inr(customer.amount), colAmount, y + 7, {
    align: "right",
  });

  y += 42;
  pdf.setDrawColor(203, 213, 225);
  pdf.line(margin, y, pageWidth - margin, y);

  y += 10;
  pdf.setTextColor(55, 65, 81);
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(11);
  pdf.text("PDI pricing", colAmount - 45, y, { align: "right" });
  pdf.text(inr(customer.amount), colAmount, y, { align: "right" });

  y += 8;
  pdf.text("Amount", colAmount - 45, y, { align: "right" });
  pdf.text(inr(customer.amount), colAmount, y, { align: "right" });

  y += 11;
  pdf.setFillColor(238, 242, 255);
  pdf.roundedRect(margin, y - 6, contentWidth, 17, 2, 2, "F");

  pdf.setTextColor(49, 46, 129);
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(13);
  pdf.text("TOTAL", margin + 4, y + 4);
  pdf.text(inr(customer.amount), colAmount, y + 4, { align: "right" });

  const footerY = pdf.internal.pageSize.getHeight() - 24;
  pdf.setDrawColor(226, 232, 240);
  pdf.line(margin, footerY, pageWidth - margin, footerY);

  pdf.setTextColor(100, 116, 139);
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(9);
  pdf.text("Thank you for choosing InspectMyCar.", pageWidth / 2, footerY + 7, {
    align: "center",
  });

  pdf.setFontSize(8);
  pdf.text(
    "Please retain this invoice for your records.",
    pageWidth / 2,
    footerY + 13,
    { align: "center" }
  );

  return pdf.output("arraybuffer");
}

async function sendPdfOnWhatsApp(
  phone: string,
  invoiceNumber: string,
  pdfBytes: ArrayBuffer
) {
  const token = process.env.WHATSAPP_ACCESS_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const graphVersion = process.env.WHATSAPP_GRAPH_VERSION || "v22.0";

  if (!token || !phoneNumberId) {
    throw new Error(
      "WhatsApp is not configured. Set WHATSAPP_ACCESS_TOKEN and WHATSAPP_PHONE_NUMBER_ID."
    );
  }

  const baseUrl = `https://graph.facebook.com/${graphVersion}/${phoneNumberId}`;

  const form = new FormData();
  form.append("messaging_product", "whatsapp");
  form.append("type", "application/pdf");
  form.append(
    "file",
    new Blob([pdfBytes], { type: "application/pdf" }),
    `${invoiceNumber}.pdf`
  );

  const uploadResponse = await fetch(`${baseUrl}/media`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: form,
    cache: "no-store",
  });

  const uploadResult = await uploadResponse.json();

  if (!uploadResponse.ok || !uploadResult.id) {
    throw new Error(
      uploadResult.error?.message || "WhatsApp PDF upload failed."
    );
  }

  const messageResponse = await fetch(`${baseUrl}/messages`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    cache: "no-store",
    body: JSON.stringify({
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to: phone,
      type: "document",
      document: {
        id: uploadResult.id,
        filename: `${invoiceNumber}.pdf`,
        caption: `Your InspectMyCar invoice ${invoiceNumber}. Thank you for choosing our service.`,
      },
    }),
  });

  const messageResult = await messageResponse.json();

  if (!messageResponse.ok) {
    throw new Error(
      messageResult.error?.message || "WhatsApp message could not be sent."
    );
  }

  return {
    messageId: messageResult.messages?.[0]?.id || null,
    mediaId: uploadResult.id as string,
  };
}


export async function POST(request: NextRequest) {
  let uid: string;

  try {
    uid = await authorizeAdmin(request);
  } catch (error) {
    const message = error instanceof Error ? error.message : "";

    if (message === "AUTH_REQUIRED") {
      return jsonError("Please sign in to your admin account.", 401);
    }

    if (message === "ADMIN_ACCESS_REQUIRED") {
      return jsonError("You are not authorized to create invoices.", 403);
    }

    return jsonError("Invalid or expired admin session.", 401);
  }

  let payload: InvoicePayload;

  try {
    payload = (await request.json()) as InvoicePayload;
  } catch {
    return jsonError("Invalid request.");
  }

  let customer: CustomerInput;
  let whatsappPhone: string;

  try {
    customer = validateCustomer(payload.customer);
    whatsappPhone = normalizeWhatsAppNumber(customer.mobile);
  } catch (error) {
    return jsonError(
      error instanceof Error ? error.message : "Invalid customer details."
    );
  }

  const bookingId =
    typeof payload.bookingId === "string" ? payload.bookingId.trim() : "";

  if (bookingId) {
    try {
      const booking = await adminDb
        .collection("bookings")
        .doc(bookingId)
        .get();

      if (!booking.exists) {
        return jsonError("The selected booking no longer exists.", 404);
      }

      const data = booking.data()!;

      if (
        String(data.name || "").trim() !== customer.name ||
        String(data.mobile || "").replace(/\D/g, "") !==
          customer.mobile.replace(/\D/g, "")
      ) {
        return jsonError(
          "Customer details do not match the selected booking."
        );
      }
    } catch (error) {
      console.error("Booking validation failed:", error);
      return jsonError("Unable to validate booking.", 500);
    }
  }

  const createdAt = new Date();
  const invoiceNumber = `IMC-${createdAt
    .toISOString()
    .slice(0, 10)
    .replace(/-/g, "")}-${randomUUID().slice(0, 8).toUpperCase()}`;

  try {
    const pdfBytes = makeInvoicePdf(invoiceNumber, customer, createdAt);

    // Save invoice metadata in Firestore.
    await adminDb.collection("invoices").doc(invoiceNumber).create({
      invoiceNumber,
      bookingId: bookingId || null,
      customer: {
        name: customer.name,
        mobile: customer.mobile,
        whatsappNumber: whatsappPhone,
        brand: customer.brand,
        model: customer.model,
        inspectionType: customer.inspectionType,
        date: customer.date,
        time: customer.time,
      },
      pricing: {
        pdiPricing: customer.amount,
        amount: customer.amount,
        total: customer.amount,
        currency: "INR",
      },
      status: "generated",
      whatsappStatus: "not_sent",
      createdAt: FieldValue.serverTimestamp(),
      createdBy: uid,
    });

    // Return the actual PDF instead of sending it through a Cloud API.
    return new NextResponse(pdfBytes, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${invoiceNumber}.pdf"`,
        "Cache-Control": "no-store",
        "X-Invoice-Number": invoiceNumber,
        "X-WhatsApp-Number": whatsappPhone,
      },
    });
  } catch (error) {
    console.error("Invoice generation failed:", error);
    return jsonError("Unable to generate or save the invoice.", 500);
  }
}
