

"use client";



import { useCallback, useEffect, useMemo, useState } from "react";

import { db } from "@/app/lib/firebase";

import { jsPDF } from "jspdf";

import {

  collection,

  getDocs,

  limit,

  orderBy,

  query,

} from "firebase/firestore";



type Booking = {

  id: string;

  name?: string;

  mobile?: string;

  brand?: string;

  model?: string;

  date?: string;

  slot?: string;

  price?: number;

  city?: string;

  location?: string;

  status?: string;

  assignedTo?: string;

};



type InspectionType = "New Car PDI" | "Used Car PPI";



type Customer = {

  name: string;

  mobile: string;

  brand: string;

  model: string;

  inspectionType: InspectionType;

  date: string;

  time: string;

  assignedTo: string;

  amount: string;

};



const emptyCustomer: Customer = {

  name: "",

  mobile: "",

  brand: "",

  model: "",

  inspectionType: "New Car PDI",

  date: "",

  time: "",

  assignedTo: "",

  amount: "",

};



function money(value: number) {

  // Use a plain INR prefix because jsPDF's built-in Helvetica font may not

  // contain the Indian Rupee glyph and can render it as a broken character.

  return `INR ${new Intl.NumberFormat("en-IN", {

    minimumFractionDigits: 2,

    maximumFractionDigits: 2,

  }).format(value)}`;

}



function formatInspectionDate(value: string) {

  if (!value) return "—";

  // Parse YYYY-MM-DD as local date to avoid timezone shifting the displayed day.

  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);

  const date = match

    ? new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]))

    : new Date(value);

  if (Number.isNaN(date.getTime())) return value;

  return `${String(date.getDate()).padStart(2, "0")} ${date.toLocaleDateString("en-GB", { month: "short" })} ${date.getFullYear()}`;

}



function normalizePhone(value: string) {

  let digits = value.replace(/\D/g, "");



  if (digits.length === 10) {

    digits = `91${digits}`;

  }



  return digits;

}



async function loadPublicImageDataUrl(path: string): Promise<string | null> {

  try {

    const response = await fetch(path);

    if (!response.ok) return null;

    const blob = await response.blob();

    return await new Promise((resolve) => {

      const reader = new FileReader();

      reader.onload = () => resolve(typeof reader.result === "string" ? reader.result : null);

      reader.onerror = () => resolve(null);

      reader.readAsDataURL(blob);

    });

  } catch {

    return null;

  }

}



export default function InvoicingPage() {

  const [bookings, setBookings] = useState<Booking[]>([]);

  const [search, setSearch] = useState("");

  const [selectedBooking, setSelectedBooking] = useState<string | null>(null);

  const [customer, setCustomer] = useState<Customer>(emptyCustomer);



  const [loadingBookings, setLoadingBookings] = useState(true);

  const [generatedPdf, setGeneratedPdf] = useState<File | null>(null);



  const [notice, setNotice] = useState("");

  const [error, setError] = useState("");

  const [invoiceNumber, setInvoiceNumber] = useState("");

  const [whatsappUrl, setWhatsappUrl] = useState("");



  // Separate cancellation-invoice workflow; normal/manual invoicing remains unchanged.

  const [showCancellationInvoice, setShowCancellationInvoice] = useState(false);

  const [cancellationSearch, setCancellationSearch] = useState("");

  const [cancellationBooking, setCancellationBooking] = useState<Booking | null>(null);



  const loadBookings = useCallback(async () => {

    setLoadingBookings(true);

    setError("");



    try {

      const bookingsQuery = query(

        collection(db, "bookings"),

        orderBy("createdAt", "desc"),

        limit(500)

      );



      const snapshot = await getDocs(bookingsQuery);



      setBookings(

        snapshot.docs.map((document) => ({

          id: document.id,

          ...document.data(),

        })) as Booking[]

      );

    } catch (err) {

      console.error("Failed to load bookings:", err);

      setError(

        "Unable to load bookings. Check your Firestore permissions and browser console."

      );

    } finally {

      setLoadingBookings(false);

    }

  }, []);



  useEffect(() => {

    void loadBookings();

  }, [loadBookings]);



  const filteredBookings = useMemo(() => {

    const term = search.trim().toLowerCase();

    const phoneTerm = term.replace(/\D/g, "");



    if (!term || selectedBooking) {

      return [];

    }



    return bookings

      .filter((booking) => {

        const name = (booking.name || "").toLowerCase();

        const mobile = (booking.mobile || "").replace(/\D/g, "");



        return (

          name.includes(term) ||

          (phoneTerm.length > 0 && mobile.includes(phoneTerm))

        );

      })

      .slice(0, 12);

  }, [bookings, search, selectedBooking]);



  function updateCustomer<K extends keyof Customer>(

    key: K,

    value: Customer[K]

  ) {

    setCustomer((current) => ({

      ...current,

      [key]: value,

    }));

  }



  function resetMessages() {

    setError("");

    setNotice("");

    setInvoiceNumber("");

    setWhatsappUrl("");

    setGeneratedPdf(null);

  }



  function chooseBooking(booking: Booking) {

    setSelectedBooking(booking.id);



    setCustomer({

      name: booking.name || "",

      mobile: booking.mobile || "",

      brand: booking.brand || "",

      model: booking.model || "",

      inspectionType: "New Car PDI",

      date: booking.date || "",

      time: booking.slot || "",

      assignedTo: typeof booking.assignedTo === "string" ? booking.assignedTo : "",

      amount:

        booking.price !== undefined && booking.price !== null

          ? String(booking.price)

          : "",

    });



    setSearch(`${booking.name || ""} — ${booking.mobile || ""}`);

    resetMessages();

  }



  const filteredCancelledBookings = useMemo(() => {

    const term = cancellationSearch.trim().toLowerCase();

    const phoneTerm = term.replace(/\D/g, "");



    return bookings

      .filter((booking) => (booking.status || "").trim().toLowerCase() === "cancelled")

      .filter((booking) => {

        if (!term) return true;

        const name = (booking.name || "").toLowerCase();

        const mobile = (booking.mobile || "").replace(/\D/g, "");

        return name.includes(term) || (phoneTerm.length > 0 && mobile.includes(phoneTerm));

      })

      .slice(0, 20);

  }, [bookings, cancellationSearch]);



  function openCancellationInvoice() {
    // Clicking the button again closes the cancellation form and returns to normal bookings.
    if (showCancellationInvoice) {
      setShowCancellationInvoice(false);
      resetMessages();
      return;
    }

    setShowCancellationInvoice(true);
    setCancellationSearch("");
    setCancellationBooking(null);
    resetMessages();
  }



  function chooseCancelledBooking(booking: Booking) {

    if ((booking.status || "").trim().toLowerCase() !== "cancelled") {

      setError("Cancellation invoices can only be generated for bookings with Cancelled status.");

      return;

    }

    setCancellationBooking(booking);

    resetMessages();

  }



  async function generateCancellationInvoicePdf() {

    resetMessages();



    const booking = cancellationBooking;

    if (!booking || (booking.status || "").trim().toLowerCase() !== "cancelled") {

      setError('Select a booking whose status is exactly "Cancelled" before generating a cancellation invoice.');

      return;

    }



    const cancellationCharge = 399;

    const brandModel = `${booking.brand || ""} - ${booking.model || ""}`.trim();

    const carLabel = brandModel === "-" || !brandModel ? "Vehicle" : brandModel;

    const invoiceCustomerName = (booking.name || "").trim();

    const mobile = (booking.mobile || "").trim();

    if (!invoiceCustomerName || !mobile) {

      setError("The selected cancelled booking must have a customer name and mobile number.");

      return;

    }



    try {

      const doc = new jsPDF({ unit: "mm", format: "a4" });

      const pageWidth = doc.internal.pageSize.getWidth();

      const margin = 18;

      const right = pageWidth - margin;

      const invoiceId = `IMC-CAN-${new Date().toISOString().replace(/[-:TZ.]/g, "").slice(0, 14)}`;

      const issuedOn = new Date().toLocaleDateString("en-IN", {

        day: "2-digit", month: "short", year: "numeric",

      });

      const navy: [number, number, number] = [13, 67, 125];

      const blue: [number, number, number] = [20, 86, 151];

      const ink: [number, number, number] = [55, 65, 81];

      const muted: [number, number, number] = [107, 114, 128];

      const line: [number, number, number] = [190, 198, 207];



      doc.setFillColor(...navy);

      doc.rect(0, 0, pageWidth, 44, "F");

      doc.setFillColor(...blue);

      doc.rect(0, 38, pageWidth, 6, "F");

      doc.setTextColor(255, 255, 255);



      const logoData = await loadPublicImageDataUrl("/logo.png");

      const headerTextX = margin + 32;

      if (logoData) {

        try {

          const format = logoData.startsWith("data:image/png") ? "PNG" : "JPEG";

          doc.addImage(logoData, format, margin, 7, 27, 27);

        } catch (imageError) {

          console.warn("Could not add logo.png to cancellation invoice PDF:", imageError);

        }

      }



      doc.setFont("helvetica", "bold");

      doc.setFontSize(20);

      doc.text("InspectMyCar", headerTextX, 17);

      doc.setFontSize(12);

      doc.text("CANCELLATION INVOICE", headerTextX, 27);

      doc.setFont("helvetica", "normal");

      doc.setFontSize(8);

      doc.text("BOOKING CANCELLATION CHARGES", headerTextX, 34);

      doc.setFont("helvetica", "bold");

      doc.setFontSize(10);

      doc.text(`Invoice No. ${invoiceId}`, right, 20, { align: "right" });

      doc.setFont("helvetica", "normal");

      doc.setFontSize(9);

      doc.text(`Issue date: ${issuedOn}`, right, 29, { align: "right" });



      let y = 58;

      doc.setTextColor(...ink);

      doc.setFont("helvetica", "bold");

      doc.setFontSize(11);

      doc.text("Bill To:", margin, y);

      doc.text("From:", right, y, { align: "right" });

      doc.setFont("helvetica", "normal");

      doc.setFontSize(10);

      doc.setTextColor(...muted);

      doc.text(invoiceCustomerName, margin, y + 8);

      doc.text(`Mobile: ${mobile}`, margin, y + 14);

      doc.text(carLabel, margin, y + 20);

      doc.text("InspectMyCar", right, y + 8, { align: "right" });

      doc.text("Booking cancellation charges", right, y + 14, { align: "right" });



      y += 35;

      doc.setTextColor(...muted);

      doc.setFontSize(10);

      doc.text(`Invoice date: ${issuedOn}`, margin, y);

      const bookingDateTime = `${formatInspectionDate(booking.date || "")}${booking.slot ? `, ${booking.slot}` : ""}`;

      doc.text(`Booking date & time: ${bookingDateTime}`, right, y, { align: "right" });

      y += 13;



      const tableX = margin;

      const tableW = pageWidth - margin * 2;

      const headerH = 10;

      const rowH = 18;

      const col1 = tableW * 0.52;

      const col2 = tableW * 0.12;

      const col3 = tableW * 0.17;

      const col4 = tableW * 0.19;

      const x2 = tableX + col1;

      const x3 = x2 + col2;

      const x4 = x3 + col3;



      doc.setFillColor(...navy);

      doc.rect(tableX, y, tableW, headerH, "F");

      doc.setTextColor(255, 255, 255);

      doc.setFont("helvetica", "normal");

      doc.setFontSize(9);

      doc.text("Description", tableX + 3, y + 6.5);

      doc.text("Qty", x2 + col2 / 2, y + 6.5, { align: "center" });

      doc.text("Price", x3 + col3 - 3, y + 6.5, { align: "right" });

      doc.text("Total", x4 + col4 - 3, y + 6.5, { align: "right" });



      const rowY = y + headerH;

      doc.setFillColor(255, 255, 255);

      doc.rect(tableX, rowY, tableW, rowH, "F");

      doc.setDrawColor(...line);

      doc.setLineWidth(0.25);

      doc.rect(tableX, rowY, tableW, rowH);

      [x2, x3, x4].forEach((x) => doc.line(x, y, x, rowY + rowH));

      doc.setTextColor(...ink);

      doc.setFont("helvetica", "bold");

      doc.setFontSize(8.5);

      doc.text(doc.splitTextToSize(`Cancellation charges for PDI/PPI of ${carLabel}`, col1 - 6), tableX + 3, rowY + 7);

      doc.setFont("helvetica", "normal");

      doc.setFontSize(9);

      doc.text("1", x2 + col2 / 2, rowY + 11, { align: "center" });

      doc.text(money(cancellationCharge), x3 + col3 - 3, rowY + 11, { align: "right" });

      doc.text(money(cancellationCharge), x4 + col4 - 3, rowY + 11, { align: "right" });



      y = rowY + rowH + 24;

      const totalsW = 88;

      const totalsX = right - totalsW;

      doc.setFillColor(...navy);

      doc.rect(totalsX, y, totalsW, 10, "F");

      doc.setTextColor(255, 255, 255);

      doc.setFont("helvetica", "normal");

      doc.setFontSize(9);

      doc.text("Cancellation charge", totalsX + 4, y + 6.5);

      doc.text(money(cancellationCharge), right - 3, y + 6.5, { align: "right" });

      y += 17;

      doc.setTextColor(...ink);

      doc.setFont("helvetica", "bold");

      doc.setFontSize(12);

      doc.text("TOTAL DUE", totalsX, y);

      doc.setTextColor(...navy);

      doc.text(money(cancellationCharge), right, y, { align: "right" });



      y += 16;

      doc.setFont("helvetica", "normal");

      doc.setTextColor(...muted);

      doc.setFontSize(9);

      doc.text("Thank you for choosing InspectMyCar!", right, y, { align: "right" });

      const sealData = await loadPublicImageDataUrl("/inspectmycar-certified-seal.png");

      if (sealData) {

        try {

          doc.addImage(sealData, "PNG", right - 34, y + 3, 30, 30);

        } catch (imageError) {

          console.warn("Could not add cancellation invoice seal:", imageError);

        }

      }

      doc.setDrawColor(...line);

      doc.line(margin, 280, right, 280);

      doc.setFontSize(8);

      doc.text("InspectMyCar | Cancellation invoice | All amounts in INR", pageWidth / 2, 286, { align: "center" });



      const blob = doc.output("blob");

      const file = new File([blob], `${invoiceId}.pdf`, { type: "application/pdf" });

      setGeneratedPdf(file);

      setInvoiceNumber(invoiceId);

      setNotice("Cancellation invoice PDF generated and downloaded. You can now share this same PDF on WhatsApp.");

      setWhatsappUrl(`https\://wa.me/${normalizePhone(mobile)}?text=${encodeURIComponent(`Hello ${invoiceCustomerName}, please find your cancellation invoice (${invoiceId}) for ${carLabel}. Cancellation charges: INR 399.00.`)}`);

      doc.save(`${invoiceId}.pdf`);

    } catch (err) {

      console.error("Could not generate cancellation invoice PDF:", err);

      setError("Unable to generate the cancellation invoice PDF. Please try again.");

    }

  }



  function startManualInvoice() {

    setSelectedBooking(null);

    setCustomer(emptyCustomer);

    setSearch("");

    resetMessages();

  }



  function clearForm() {

    setSelectedBooking(null);

    setCustomer(emptyCustomer);

    setSearch("");

    resetMessages();

  }



  async function generateInvoicePdf() {

    resetMessages();



    if (!customer.name.trim()) {

      setError("Please enter the customer's name.");

      return;

    }

    if (!customer.mobile.trim()) {

      setError("Please enter the customer's WhatsApp mobile number.");

      return;

    }

    if (!customer.brand.trim()) {

      setError("Please enter the car brand.");

      return;

    }

    if (!customer.model.trim()) {

      setError("Please enter the car model.");

      return;

    }

    if (!customer.date || !customer.time.trim()) {

      setError("Please enter the inspection date and time.");

      return;

    }



    const total = Number(customer.amount);

    if (!Number.isFinite(total) || total < 0) {

      setError("Please enter a valid PDI price.");

      return;

    }



    try {

      const doc = new jsPDF({ unit: "mm", format: "a4" });

      const pageWidth = doc.internal.pageSize.getWidth();

      const margin = 18;

      const invoiceId = `IMC-${new Date().toISOString().replace(/[-:TZ.]/g, "").slice(0, 14)}`;

      const issuedOn = new Date().toLocaleDateString("en-IN", {

        day: "2-digit", month: "short", year: "numeric",

      });



      // Invoice layout: clean, tabular format inspired by the supplied sample.

      const navy: [number, number, number] = [13, 67, 125];

      const blue: [number, number, number] = [20, 86, 151];

      const ink: [number, number, number] = [55, 65, 81];

      const muted: [number, number, number] = [107, 114, 128];

      const line: [number, number, number] = [190, 198, 207];

      const right = pageWidth - margin;



      // Header band with company logo at the top-left.

      doc.setFillColor(...navy);

      doc.rect(0, 0, pageWidth, 44, "F");

      doc.setFillColor(...blue);

      doc.rect(0, 38, pageWidth, 6, "F");

      doc.setTextColor(255, 255, 255);



const logoData = await loadPublicImageDataUrl("/logo.png");

const headerTextX = margin + 32;



if (logoData) {

  try {

    const format = logoData.startsWith("data:image/png") ? "PNG" : "JPEG";

    doc.addImage(logoData, format, margin, 7, 27, 27);

  } catch (imageError) {

    console.warn("Could not add logo.png to invoice PDF:", imageError);

  }

}

      doc.setFont("helvetica", "bold");

      doc.setFontSize(20);

      doc.text("InspectMyCar", headerTextX, 17);

      doc.setFontSize(12);

      doc.text("INVOICE", headerTextX, 27);

      doc.setFont("helvetica", "normal");

      doc.setFontSize(8);

      doc.text("PRE-DELIVERY / PRE-PURCHASE INSPECTION", headerTextX, 34);

      doc.setFont("helvetica", "bold");

      doc.setFontSize(10);

      doc.text(`Invoice No. ${invoiceId}`, right, 20, { align: "right" });

      doc.setFont("helvetica", "normal");

      doc.setFontSize(9);

      doc.text(`Issue date: ${issuedOn}`, right, 29, { align: "right" });



      // Bill To / From columns

      let y = 58;

      const colGap = 12;

      const colWidth = (pageWidth - margin * 2 - colGap) / 2;

      doc.setTextColor(...ink);

      doc.setFont("helvetica", "bold");

      doc.setFontSize(11);

      doc.text("Bill To:", margin, y);

      doc.text("From:", right, y, { align: "right" });



      doc.setFont("helvetica", "normal");

      doc.setFontSize(10);

      doc.setTextColor(...muted);

      const customerLines = [

        customer.name.trim(),

        `Mobile: ${customer.mobile.trim()}`,

        `${customer.brand.trim()} ${customer.model.trim()}`.trim(),

      ];

      customerLines.forEach((lineText, index) => {

        doc.text(lineText, margin, y + 8 + index * 6);

      });

      doc.text("InspectMyCar", right, y + 8, { align: "right" });

      doc.text("Pre-Delivery & Pre-Purchase Inspection", right, y + 14, { align: "right" });

      doc.text("Professional PDI services", right, y + 20, { align: "right" });



      y += 35;

      doc.setTextColor(...muted);

      doc.setFontSize(10);

      doc.text(`Invoice date: ${issuedOn}`, margin, y);

      doc.text(`Inspection date: ${formatInspectionDate(customer.date)}`, right, y, { align: "right" });

      y += 13;



      // Description | Qty | Price | Total table

      const tableX = margin;

      const tableW = pageWidth - margin * 2;

      const headerH = 10;

      const rowH = 23;

      const col1 = tableW * 0.52;

      const col2 = tableW * 0.12;

      const col3 = tableW * 0.17;

      const col4 = tableW * 0.19;

      const x2 = tableX + col1;

      const x3 = x2 + col2;

      const x4 = x3 + col3;



      doc.setFillColor(...navy);

      doc.rect(tableX, y, tableW, headerH, "F");

      doc.setTextColor(255, 255, 255);

      doc.setFont("helvetica", "normal");

      doc.setFontSize(9);

      doc.text("Description", tableX + 3, y + 6.5);

      doc.text("Qty", x2 + col2 / 2, y + 6.5, { align: "center" });

      doc.text("Price", x3 + col3 - 3, y + 6.5, { align: "right" });

      doc.text("Total", x4 + col4 - 3, y + 6.5, { align: "right" });



      const rowY = y + headerH;

      doc.setFillColor(255, 255, 255);

      doc.rect(tableX, rowY, tableW, rowH, "F");

      doc.setDrawColor(...line);

      doc.setLineWidth(0.25);

      doc.rect(tableX, rowY, tableW, rowH);

      [x2, x3, x4].forEach((x) => doc.line(x, y, x, rowY + rowH));



      const carLabel = customer.inspectionType === "Used Car PPI" ? "Car PPI" : "Car PDI";

      const description = `${customer.brand.trim()} ${customer.model.trim()} - ${carLabel}`.trim();

      doc.setTextColor(...ink);

      doc.setFont("helvetica", "bold");

      doc.setFontSize(8.5);

      doc.text(doc.splitTextToSize(description, col1 - 6), tableX + 3, rowY + 5);

      doc.setFont("helvetica", "normal");

      doc.setFontSize(7.5);

      doc.setTextColor(...muted);

      const detailLines = [

        `Inspection date & time: ${formatInspectionDate(customer.date)}${String(customer.time ?? "").trim() ? `, ${String(customer.time ?? "").trim()}` : ""}`,

        `Inspected by: ${String(customer.assignedTo ?? "").trim() || "Not assigned"}`,

      ];

      detailLines.forEach((detail, index) => {

        doc.text(doc.splitTextToSize(detail, col1 - 6), tableX + 3, rowY + 9 + index * 3.5);

      });

      doc.setTextColor(...ink);

      doc.setFont("helvetica", "normal");

      doc.setFontSize(9);

      doc.text("1", x2 + col2 / 2, rowY + 12, { align: "center" });

      doc.text(money(total), x3 + col3 - 3, rowY + 12, { align: "right" });

      doc.text(money(total), x4 + col4 - 3, rowY + 12, { align: "right" });



      y = rowY + rowH + 7;

      doc.setTextColor(...muted);

      doc.setFont("helvetica", "normal");

      doc.setFontSize(9);

      doc.text(`Inspection type: ${customer.inspectionType}`, margin, y);



      // Subtotal bar and total due

      const totalsW = 88;

      const totalsX = right - totalsW;

      y += 17;

      doc.setFillColor(...navy);

      doc.rect(totalsX, y, totalsW, 10, "F");

      doc.setTextColor(255, 255, 255);

      doc.setFont("helvetica", "normal");

      doc.setFontSize(9);

      doc.text("Sub Total", totalsX + 4, y + 6.5);

      doc.text(money(total), right - 3, y + 6.5, { align: "right" });



      y += 17;

      doc.setTextColor(...ink);

      doc.setFont("helvetica", "bold");

      doc.setFontSize(12);

      doc.text("TOTAL DUE", totalsX, y);

      doc.setTextColor(...navy);

      doc.text(money(total), right, y, { align: "right" });



      // Thank-you footer and InspectMyCar seal from the public folder.

      y += 16;

      doc.setFont("helvetica", "normal");

      doc.setTextColor(...muted);

      doc.setFontSize(9);

      doc.text("Thank you for choosing InspectMyCar!", right, y, { align: "right" });



      const sealData = await loadPublicImageDataUrl("/inspectmycar-certified-seal.png");

      if (sealData) {

        try {

          doc.addImage(sealData, "PNG", right - 34, y + 3, 30, 30);

        } catch (imageError) {

          console.warn("Could not add inspectmycar-certified-seal.png to invoice PDF:", imageError);

        }

      }



      doc.setDrawColor(...line);

      doc.line(margin, 280, right, 280);

      doc.setFontSize(8);

      doc.text("InspectMyCar | Invoice copy | All amounts in INR", pageWidth / 2, 286, { align: "center" });



      const blob = doc.output("blob");

      const file = new File([blob], `${invoiceId}.pdf`, { type: "application/pdf" });

      setGeneratedPdf(file);

      setInvoiceNumber(invoiceId);

      setNotice("PDF generated and downloaded. You can now share this same PDF on WhatsApp.");

      setWhatsappUrl(`https\://wa.me/${normalizePhone(customer.mobile)}?text=${encodeURIComponent(`Hello ${customer.name.trim()}, please find your ${customer.inspectionType} invoice (${invoiceId}) from InspectMyCar. The PDF is downloaded on this device and can be attached here.`)}`);



      // Download the exact same PDF that will be shared from the WhatsApp button.

      doc.save(`${invoiceId}.pdf`);

    } catch (err) {

      console.error("Could not generate invoice PDF:", err);

      setError("Unable to generate the PDF. Please try again.");

    }

  }



  async function sharePdfOnWhatsApp() {

    if (!generatedPdf) {

      setError("Generate the invoice PDF first.");

      return;

    }



    const nav = navigator as Navigator & {

      canShare?: (data?: ShareData) => boolean;

      share?: (data?: ShareData) => Promise<void>;

    };



    try {

      if (nav.share && nav.canShare && nav.canShare({ files: [generatedPdf] })) {

        await nav.share({

          files: [generatedPdf],

          title: `Invoice ${invoiceNumber}`,

          text: `InspectMyCar invoice for ${showCancellationInvoice ? (cancellationBooking?.name || "customer") : customer.name}`,

        });

        return;

      }

    } catch (err) {

      if (err instanceof Error && err.name === "AbortError") return;

      console.warn("Native PDF sharing unavailable; opening WhatsApp with a message.", err);

    }



    if (whatsappUrl) {

      window.open(whatsappUrl, "_blank", "noopener,noreferrer");

      setNotice("WhatsApp opened. Attach the downloaded PDF before sending the message.");

    }

  }



  const amount = Number(customer.amount) || 0;



  return (

    <main className="min-h-screen bg-[#f6f8fc] px-4 py-8 text-[#10172b] sm:px-6 lg:px-8">

      <div className="mx-auto max-w-7xl">

        {/* Header */}

        <header className="mb-8 flex flex-col justify-between gap-6 rounded-[2rem] border border-white bg-white/90 px-6 py-7 shadow-[0_18px_55px_rgba(15,23,42,0.06)] sm:flex-row sm:items-center sm:px-9 sm:py-8">

          <div>

            <h1 className="mt-2 text-5xl font-black tracking-[-0.055em] text-[#10172b] sm:text-6xl">

              Customer <span className="italic text-violet-600">Invoices</span>

            </h1>



            <p className="mt-3 max-w-xl text-sm leading-6 text-slate-500">

              Create customer invoices and prepare them for WhatsApp.

            </p>

          </div>



          <div className="flex flex-wrap gap-2.5">

            <button

              type="button"

              onClick={loadBookings}

              disabled={loadingBookings}

              className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-[#172039] shadow-sm transition hover:border-violet-300 hover:bg-violet-50 disabled:opacity-60"

            >

              {loadingBookings ? "Loading..." : "Refresh bookings"}

            </button>



            <button

              type="button"

              onClick={startManualInvoice}

              className="rounded-2xl bg-[#4f35f5] px-5 py-3 text-sm font-extrabold text-white shadow-lg shadow-violet-600/25 transition hover:-translate-y-0.5 hover:bg-[#4026e8]"

            >

              + Manual invoice

            </button>



            <button

              type="button"

              onClick={openCancellationInvoice}

              className="rounded-xl bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-800 shadow-sm ring-1 ring-amber-200 transition hover:bg-amber-100"

            >

              + Cancellation Invoice

            </button>

          </div>

        </header>



        {showCancellationInvoice && (

          <section className="mb-7 rounded-[2rem] border border-amber-200 bg-white p-6 shadow-[0_12px_35px_rgba(15,23,42,0.05)] sm:p-8">

            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">

              <div>

                <h2 className="text-xl font-extrabold tracking-tight text-[#10172b]">Cancellation invoice</h2>

                <p className="mt-1 text-sm text-slate-500">

                  Only bookings with status <strong>Cancelled</strong> are listed. Fixed cancellation charge: <strong>INR 399.00</strong>.

                </p>

              </div>

              <button

                type="button"

                onClick={() => {

                  setShowCancellationInvoice(false);

                  setCancellationBooking(null);

                  setCancellationSearch("");

                  resetMessages();

                }}

                className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50"

              >

                Close

              </button>

            </div>



            <label htmlFor="cancelledBookingSearch" className="mb-2 mt-5 block text-sm font-medium">

              Search cancelled bookings by customer name or mobile

            </label>

            <input

              id="cancelledBookingSearch"

              type="search"

              autoComplete="off"

              value={cancellationSearch}

              onChange={(event) => {

                setCancellationSearch(event.target.value);

                setCancellationBooking(null);

                resetMessages();

              }}

              placeholder="Enter customer name or mobile number"

              className="w-full w-full rounded-2xl border border-slate-200 bg-slate-50/70 px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-violet-500 focus:ring-4 focus:ring-violet-100"

            />



            <div className="mt-2 max-h-64 overflow-y-auto rounded-xl border border-slate-200">

              {loadingBookings ? (

                <p className="p-4 text-sm text-slate-500">Loading bookings...</p>

              ) : filteredCancelledBookings.length ? (

                filteredCancelledBookings.map((booking) => (

                  <button

                    key={booking.id}

                    type="button"

                    onClick={() => chooseCancelledBooking(booking)}

                    className={`block w-full border-b border-slate-100 px-4 py-3 text-left last:border-0 hover:bg-amber-50 ${

                      cancellationBooking?.id === booking.id ? "bg-amber-50 ring-1 ring-inset ring-amber-300" : ""

                    }`}

                  >

                    <span className="block font-semibold">{booking.name || "Unnamed customer"}</span>

                    <span className="mt-1 block text-sm text-slate-500">{booking.mobile || "No mobile number"}</span>

                    <span className="mt-1 block text-sm text-slate-600">

                      {[booking.brand, booking.model].filter(Boolean).join(" ") || "Car details unavailable"}

                    </span>

                    <span className="mt-1 block text-xs text-slate-400">

                      {booking.date || "No date"} · {booking.slot || "No time"} · {booking.status}

                    </span>

                  </button>

                ))

              ) : (

                <p className="p-4 text-sm text-slate-500">No cancelled bookings found in the loaded bookings. Refresh bookings and try again.</p>

              )}

            </div>



            {cancellationBooking && (

              <div className="mt-4 flex flex-col justify-between gap-3 rounded-xl bg-amber-50 p-4 sm:flex-row sm:items-center">

                <div className="text-sm">

                  <p className="font-semibold">{cancellationBooking.name} — {[cancellationBooking.brand, cancellationBooking.model].filter(Boolean).join(" ")}</p>

                  <p className="mt-1 text-slate-600">

                    Booking: {formatInspectionDate(cancellationBooking.date || "")}{cancellationBooking.slot ? `, ${cancellationBooking.slot}` : ""} · Cancellation charge: INR 399.00

                  </p>

                </div>

                <button

                  type="button"

                  onClick={generateCancellationInvoicePdf}

                  className="shrink-0 rounded-xl bg-amber-600 px-5 py-3 font-semibold text-white transition hover:bg-amber-700"

                >

                  Generate Cancellation PDF

                </button>

              </div>

            )}

          </section>

        )}



        {/* Feedback */}

        {(error || notice) && (

          <div

            role={error ? "alert" : "status"}

            className={`mb-5 rounded-xl border p-4 text-sm ${

              error

                ? "border-red-200 bg-red-50 text-red-800"

                : "border-emerald-200 bg-emerald-50 text-emerald-800"

            }`}

          >

            <p className="font-medium">{error || notice}</p>



            {invoiceNumber && (

              <p className="mt-2 font-semibold">

                Invoice number: {invoiceNumber}

              </p>

            )}



            {whatsappUrl && (

              <div className="mt-3">

                <button

                  type="button"

                  onClick={sharePdfOnWhatsApp}

                  className="rounded-lg bg-emerald-600 px-4 py-2.5 font-semibold text-white transition hover:bg-emerald-700"

                >

                  Share PDF on WhatsApp

                </button>



                <p className="mt-2 text-xs">

                  On supported phones, the PDF is attached automatically. If WhatsApp opens without an attachment, attach the downloaded PDF before sending.

                </p>

              </div>

            )}

          </div>

        )}



        <div className="grid items-start gap-7 xl:grid-cols-[minmax(0,1fr)_390px]">

          {/* Form */}

          <section className="space-y-6">

            <div className="rounded-[1.75rem] border border-slate-100 bg-white p-6 shadow-sm sm:p-7">

              <div className="mb-5">

                <h2 className="text-xl font-extrabold tracking-tight text-[#10172b]">Customer details</h2>

                <p className="mt-1 text-sm text-slate-500">

                  Find an existing booking or enter a new customer's details.

                </p>

              </div>



              <label

                htmlFor="bookingSearch"

                className="mb-2 block text-sm font-medium"

              >

                Search bookings by name or mobile

              </label>



              <input

                id="bookingSearch"

                type="search"

                autoComplete="off"

                value={search}

                onChange={(event) => {

                  setSearch(event.target.value);

                  setSelectedBooking(null);

                  resetMessages();

                }}

                placeholder="Enter customer name or mobile number"

                className="w-full w-full rounded-2xl border border-slate-200 bg-slate-50/70 px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-violet-500 focus:ring-4 focus:ring-violet-100"

              />



              {search.trim() && !selectedBooking && (

                <div className="mt-2 max-h-64 overflow-y-auto rounded-xl border border-slate-200 bg-white">

                  {loadingBookings ? (

                    <p className="p-4 text-sm text-slate-500">

                      Loading bookings...

                    </p>

                  ) : filteredBookings.length > 0 ? (

                    filteredBookings.map((booking) => (

                      <button

                        key={booking.id}

                        type="button"

                        onClick={() => chooseBooking(booking)}

                        className="block w-full border-b border-slate-100 px-4 py-3 text-left transition last:border-0 hover:bg-violet-50"

                      >

                        <span className="block font-semibold">

                          {booking.name || "Unnamed customer"}

                        </span>



                        <span className="mt-1 block text-sm text-slate-500">

                          {booking.mobile || "No mobile number"}

                        </span>



                        <span className="mt-1 block text-sm text-slate-600">

                          {[booking.brand, booking.model]

                            .filter(Boolean)

                            .join(" ") || "Car details unavailable"}

                        </span>



                        <span className="mt-1 block text-xs text-slate-400">

                          {booking.date || "No date"} ·{" "}

                          {booking.slot || "No time"} ·{" "}

                          {booking.status || "No status"}

                        </span>

                      </button>

                    ))

                  ) : (

                    <div className="p-4 text-sm text-slate-500">

                      No matching booking found. Fill the form manually below

                      to create an invoice for an unregistered customer.

                    </div>

                  )}

                </div>

              )}



              {selectedBooking && (

                <div className="mt-3 flex flex-wrap items-center justify-between gap-2 rounded-lg bg-violet-50 px-3 py-2 text-sm text-violet-800">

                  <span>Booking selected: {selectedBooking}</span>



                  <button

                    type="button"

                    onClick={startManualInvoice}

                    className="font-semibold underline"

                  >

                    Clear selection

                  </button>

                </div>

              )}



              <div className="my-6 border-t border-slate-100" />



              <div className="grid gap-4 sm:grid-cols-2">

                <Field

                  label="Customer name"

                  value={customer.name}

                  onChange={(value) => updateCustomer("name", value)}

                  placeholder="Full name"

                  required

                />



                <Field

                  label="WhatsApp mobile number"

                  value={customer.mobile}

                  onChange={(value) => updateCustomer("mobile", value)}

                  placeholder="+91 9876543210"

                  type="tel"

                  required

                />



                <Field

                  label="Car brand"

                  value={customer.brand}

                  onChange={(value) => updateCustomer("brand", value)}

                  placeholder="e.g. Kia"

                  required

                />



                <Field

                  label="Car model"

                  value={customer.model}

                  onChange={(value) => updateCustomer("model", value)}

                  placeholder="e.g. Sonet"

                  required

                />



                <Field

                  label="Inspection date"

                  value={customer.date}

                  onChange={(value) => updateCustomer("date", value)}

                  type="date"

                  required

                />



                <Field

                  label="Inspection time"

                  value={customer.time}

                  onChange={(value) => updateCustomer("time", value)}

                  placeholder="e.g. 7:30 AM"

                  required

                />



                <div className="sm:col-span-2">

                  <label className="mb-2 block text-sm font-medium">

                    Inspection type

                  </label>



                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">

                    {(

                      ["New Car PDI", "Used Car PPI"] as InspectionType[]

                    ).map((type) => (

                      <button

                        key={type}

                        type="button"

                        onClick={() => updateCustomer("inspectionType", type)}

                        className={`rounded-2xl border px-4 py-3 text-sm font-bold transition ${

                          customer.inspectionType === type

                            ? "border-violet-600 bg-violet-100 text-violet-700 ring-2 ring-violet-100"

                            : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"

                        }`}

                      >

                        {type}

                      </button>

                    ))}

                  </div>

                </div>



                <div className="sm:col-span-2">

                  <Field

                    label="PDI pricing (INR)"

                    value={customer.amount}

                    onChange={(value) => updateCustomer("amount", value)}

                    placeholder="1499"

                    type="number"

                    required

                  />

                </div>

              </div>



              <p className="mt-4 text-xs leading-5 text-slate-400">

                Verify all details before generating the PDF. The PDF is created in your browser; no admin authentication is needed for this preview-stage workflow.

              </p>

            </div>



            {/* Actions */}

            <div className="flex flex-col gap-3 sm:flex-row">

              <button

                type="button"

                onClick={generateInvoicePdf}

                disabled={false}

                className="flex-1 rounded-2xl bg-violet-600 px-5 py-4 font-bold text-white shadow-lg shadow-violet-900/15 transition hover:bg-violet-700 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"

              >

                Generate PDF

              </button>



              <button

                type="button"

                onClick={clearForm}

                disabled={false}

                className="rounded-2xl border border-slate-200 bg-white px-5 py-4 font-bold text-slate-700 transition hover:bg-violet-50 disabled:opacity-60"

              >

                Clear form

              </button>

            </div>

          </section>



          {/* Invoice preview */}

          <aside className="h-fit rounded-[2rem] border border-slate-100 bg-white p-6 shadow-[0_16px_45px_rgba(15,23,42,0.07)] lg:sticky lg:top-6 lg:p-7">

            <div className="mb-5 flex items-center gap-3">

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#eef0ff] text-violet-700">

                <svg

                  viewBox="0 0 24 24"

                  fill="none"

                  stroke="currentColor"

                  strokeWidth="1.7"

                  className="h-6 w-6"

                  aria-hidden="true"

                >

                  <path d="M7 3h7l5 5v13H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z" />

                  <path d="M14 3v5h5M9 13h6M9 17h6" />

                </svg>

              </div>



              <div>

                <h2 className="text-lg font-extrabold tracking-tight text-[#10172b]">Invoice preview</h2>

                <p className="text-xs text-slate-500">Amounts in INR</p>

              </div>

            </div>



            <div className="rounded-2xl border border-violet-100 bg-[#eef0ff] p-4">

              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">

                Customer

              </p>



              <p className="mt-1 break-words font-semibold">

                {customer.name || "Customer name"}

              </p>



              <p className="mt-1 text-sm text-slate-500">

                {customer.mobile || "WhatsApp number"}

              </p>

            </div>



            <div className="mt-5 space-y-4 text-sm">

              <PreviewRow

                label="Brand & model"

                value={

                  `${customer.brand} ${customer.model}`.trim() || "—"

                }

              />



              <PreviewRow

                label="Inspection"

                value={customer.inspectionType}

              />



              <PreviewRow

                label="Date & time"

                value={`${customer.date || "—"} ${customer.time || ""}`.trim()}

              />



              <div className="border-t border-slate-200 pt-4">

                <PreviewRow label="PDI pricing" value={money(amount)} />

                <div className="mt-3">

                  <PreviewRow label="Amount" value={money(amount)} />

                </div>

              </div>



              <div className="flex items-center justify-between border-t-2 border-[#10172b] pt-4">

                <span className="font-bold">Total</span>

                <span className="text-xl font-bold">{money(amount)}</span>

              </div>

            </div>



            <div className="mt-5 rounded-xl border border-dashed border-slate-200 p-3 text-xs leading-5 text-slate-500">

              This preview shows the details included in your invoice PDF.

              No quantity column is included.

            </div>



            {invoiceNumber && (

              <div className="mt-4 rounded-xl bg-emerald-50 p-3 text-sm text-emerald-800">

                <p className="font-semibold">Invoice generated</p>

                <p className="mt-1 break-all">{invoiceNumber}</p>

              </div>

            )}

          </aside>

        </div>

      </div>





    </main>

  );

}



function Field({

  label,

  value,

  onChange,

  placeholder,

  type = "text",

  required = false,

}: {

  label: string;

  value: string;

  onChange: (value: string) => void;

  placeholder?: string;

  type?: string;

  required?: boolean;

}) {

  return (

    <div>

      <label className="mb-2 block text-sm font-medium">{label}</label>



      <input

        type={type}

        required={required}

        min={type === "number" ? "0" : undefined}

        step={type === "number" ? "0.01" : undefined}

        value={value}

        onChange={(event) => onChange(event.target.value)}

        placeholder={placeholder}

        className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 outline-none transition focus:border-violet-500 focus:ring-4 focus:ring-violet-100"

      />

    </div>

  );

}



function PreviewRow({

  label,

  value,

}: {

  label: string;

  value: string;

}) {

  return (

    <div className="flex items-start justify-between gap-3">

      <span className="text-slate-500">{label}</span>

      <span className="max-w-[60%] break-words text-right font-medium">

        {value}

      </span>

    </div>

  );

}
