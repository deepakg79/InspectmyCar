// app/new-cars/book/page.tsx

"use client";
import { useBooking } from "@/app/context/BookingContext";

export default function BookPage() {
    // 2. Grab the openBooking function
    const { openNewCarBooking } = useBooking();
    return (
        <main className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">

            {/* NAVBAR and CHATBOT are handled by Layout.tsx. 
               No need to import or render them here! 
            */}

            {/* BACKGROUND DECORATION */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-blue-100/40 rounded-full blur-3xl" />
                <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-slate-200/40 rounded-full blur-3xl" />
            </div>

            <header className="relative z-10 max-w-2xl mt-[-5vh]">
                <p className="text-blue-600 font-black uppercase tracking-[0.2em] text-[10px] mb-4 bg-blue-50 px-4 py-2 rounded-full inline-block">
                    Automotive Trust Factor
                </p>
                <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter mb-6 leading-[0.9]">
                    Book Your <span className="text-blue-600 italic">PDI</span> Today.
                </h1>
                <p className="text-lg text-slate-500 font-medium mb-10 leading-relaxed max-w-lg mx-auto">
                    Don't take delivery of a faulty car. Our experts will check your
                    vehicle across 299+ points before you sign the papers.
                </p>

                {/* THE ACTUAL CLICKABLE BUTTON */}
                <div className="flex flex-col items-center gap-6">
                    <button
                        onClick={() => openNewCarBooking()}// 3. Updated to use global function
                        className="group relative bg-slate-900 text-white px-10 py-5 rounded-2xl font-black text-xl shadow-2xl shadow-slate-300 hover:bg-blue-600 hover:-translate-y-1 transition-all active:scale-95"
                    >
                        <span className="relative z-10">Start Inspection Booking</span>
                        <div className="absolute inset-0 bg-blue-400 rounded-2xl blur-lg opacity-0 group-hover:opacity-30 transition-opacity" />
                    </button>

                    <div className="flex items-center gap-2 text-slate-400 animate-pulse">
                        <span className="text-xs font-bold uppercase tracking-widest">Instant Activation</span>
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                    </div>
                </div>
            </header>

            {/* TRUST MARKERS */}
            <footer className="mt-20 grid grid-cols-2 md:grid-cols-3 gap-8 opacity-40 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-500">
                <div className="flex flex-col items-center">
                    <span className="text-2xl mb-1">🛡️</span>
                    <span className="text-[10px] font-black uppercase tracking-tighter">Certified Experts</span>
                </div>
                <div className="flex flex-col items-center">
                    <span className="text-2xl mb-1">⏱️</span>
                    <span className="text-[10px] font-black uppercase tracking-tighter">Fast Reporting</span>
                </div>
                <div className="hidden md:flex flex-col items-center">
                    <span className="text-2xl mb-1">📍</span>
                    <span className="text-[10px] font-black uppercase tracking-tighter">Available in Pune</span>
                </div>
            </footer>
        </main>
    );
}