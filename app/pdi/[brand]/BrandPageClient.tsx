"use client";
import { useBooking } from "../../context/BookingContext";

export default function BrandPageClient({ brand }: { brand: string }) {
    // 1. Wrap in a try-catch or check if context exists to prevent white-screen crashes
    const booking = useBooking();

    if (!booking) {
        return null; // Prevent crash if Context provider is missing
    }

    const { openBooking } = booking;

    return (
        <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <button
                onClick={() => openBooking()}
                className="btn-primary px-10 py-5 text-xl shadow-2xl"
            >
                Book {brand} PDI
            </button>
            <a
                href={`https://wa.me/919975934213?text=Hi, I want to book a PDI for my new ${brand} in Pune.`}
                className="card-glass px-10 py-5 font-bold text-lg hover:bg-white transition-all flex items-center justify-center gap-2 border-slate-100"
            >
                <span className="text-xl">💬</span> WhatsApp
            </a>
        </div>
    );
}