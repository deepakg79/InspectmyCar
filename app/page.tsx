"use client";
import { useBooking } from "./context/BookingContext";

export default function Home() {
  const { openBooking } = useBooking();

  return (
    <main className="bg-main text-slate-900 min-h-screen selection:bg-indigo-100 selection:text-indigo-700 overflow-x-hidden">

      {/* HERO SECTION */}
      <section className="relative pt-40 pb-20 px-6 max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
        <div className="text-center lg:text-left slide-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full card-glass text-indigo-600 text-xs font-black uppercase tracking-widest mb-8 floating">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-600"></span>
            </span>
            Available in Pune
          </div>

          <h1 className="heading text-5xl md:text-7xl leading-[0.95] mb-8">
            Don't Take Delivery <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-pink-500">
              Without Inspection.
            </span>
          </h1>

          <p className="subtext text-lg max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium mb-10">
            Independent Car PDI specialists. We uncover hidden defects, repaint jobs, and mechanical flaws before you sign the papers.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <button
              onClick={() => openBooking()}
              className="btn-primary px-10 py-5 text-xl shadow-2xl"
            >
              Start Booking
            </button>
            <a
              href="tel:+919975934213"
              className="card-glass px-10 py-5 font-bold text-lg hover:bg-white transition-all flex items-center justify-center gap-2"
            >
              📞 Call Expert
            </a>
          </div>
        </div>

        <div className="relative slide-up" style={{ animationDelay: "0.2s" }}>
          <div className="relative rounded-[3rem] overflow-hidden border-8 border-white shadow-2xl group">
            <img src="/hero-car.jpg" alt="PDI Inspection" className="w-full h-[550px] object-cover img-hover" />
            <div className="absolute bottom-8 left-8 right-8 card-glass p-6 border-white/50 shadow-2xl">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-[10px] font-black uppercase text-indigo-600 tracking-tighter">Live Slot Status</p>
                  <p className="font-bold text-slate-800 text-lg">4 Slots available for Monday</p>
                </div>
                <div className="text-3xl animate-bounce">⚡</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST STRIP */}
      <section className="px-6 py-12 max-w-6xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { label: "Checkpoints", val: "200+", color: "text-indigo-600" },
            { label: "Inspections", val: "2,000+", color: "text-slate-900" },
            { label: "Rating", val: "4.9/5", color: "text-pink-500" },
            { label: "City", val: "Pune", color: "text-slate-900" },
          ].map((stat, i) => (
            <div key={i} className="card-glass p-8 text-center card-hover slide-up" style={{ animationDelay: `${i * 0.1}s` }}>
              <p className={`text-4xl font-black ${stat.color}`}>{stat.val}</p>
              <p className="text-[10px] font-bold uppercase tracking-widest subtext mt-2">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* PROBLEM SECTION */}
      <section className="px-6 py-24 bg-slate-900 text-white rounded-[4rem] mx-4 my-20 shadow-2xl overflow-hidden relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/20 blur-[100px] rounded-full" />
        <div className="max-w-5xl mx-auto text-center space-y-16 relative z-10">
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter">Why You Should Never Skip PDI</h2>
          <div className="grid md:grid-cols-3 gap-10">
            {[
              { t: "Transit Damage", d: "Dents or scratches during truck transport are common; dealers hide them with quick wax." },
              { t: "Repainted Panels", d: "Yard damage leads to repainted parts, which halves your resale value immediately." },
              { t: "Electronic Flaws", d: "Modern ECU errors can only be detected via an OBD scanner before delivery." }
            ].map((card, i) => (
              <div key={i} className="p-10 rounded-[2.5rem] bg-white/5 border border-white/10 text-left hover:bg-white/10 transition-all group">
                <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-pink-500 rounded-2xl mb-8 flex items-center justify-center font-black text-2xl group-hover:scale-110 transition-transform">
                  {i + 1}
                </div>
                <h3 className="text-2xl font-bold mb-4">{card.t}</h3>
                <p className="text-slate-400 leading-relaxed">{card.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING SECTION */}
      <section className="px-6 py-24 max-w-6xl mx-auto text-center">
        <h2 className="heading text-4xl sm:text-5xl lg:text-6xl mb-16">
          Transparent Pricing
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 items-stretch">

          {/* BASIC */}
          <div
            onClick={() => openBooking("Basic")}
            className="relative flex flex-col h-full min-w-0 p-10 rounded-[2.5rem] card-glass border-2 border-transparent hover:border-indigo-200 group cursor-pointer transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
          >
            <p className="font-black text-indigo-600 uppercase tracking-[0.2em] text-xs mb-6">
              Basic W/O Guage
            </p>

            {/* PRICE FIXED */}
            <div className="mb-6 flex items-end justify-center gap-1 w-full">
              <span className="text-xl font-black text-slate-900">₹</span>
              <span className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 leading-none">
                1,299
              </span>
            </div>

            <p className="subtext font-medium mb-10 text-lg leading-relaxed">
              Hatchbacks, Sedans & <br /> Compact SUVs
            </p>

            <button className="mt-auto w-full py-5 rounded-2xl bg-slate-100 text-slate-900 font-black text-lg group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-sm">
              Book Basic
            </button>
          </div>

          {/* STANDARD */}
          <div
            onClick={() => openBooking("Standard")}
            className="relative flex flex-col h-full min-w-0 p-10 rounded-[2.5rem] card-glass border-2 border-transparent hover:border-indigo-200 group cursor-pointer transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
          >
            <p className="font-black text-indigo-600 uppercase tracking-[0.2em] text-xs mb-6">
              Standard W/O OBD
            </p>

            <div className="mb-6 flex items-end justify-center gap-1 w-full">
              <span className="text-xl font-black text-slate-900">₹</span>
              <span className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 leading-none">
                1,499
              </span>
            </div>

            <p className="subtext font-medium mb-10 text-lg leading-relaxed">
              Includes Guage Checks <br /> Hatchbacks & Sedans
            </p>

            <button className="mt-auto w-full py-5 rounded-2xl bg-slate-100 text-slate-900 font-black text-lg group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-sm">
              Book Standard
            </button>
          </div>

          {/* STANDARD + OBD */}
          <div
            onClick={() => openBooking("Standard-OBD")}
            className="relative flex flex-col h-full min-w-0 pt-14 p-10 rounded-[2.5rem] card-glass border-2 border-indigo-200 group cursor-pointer transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
          >
            {/* Ribbon */}
            <div className="absolute top-0 left-0 w-full bg-indigo-600 text-white text-[10px] font-black py-2 text-center uppercase tracking-widest rounded-t-[2.5rem]">
              Most Popular
            </div>

            <p className="font-black text-indigo-600 uppercase tracking-[0.2em] text-xs mb-6">
              Standard With OBD
            </p>

            <div className="mb-6 flex items-end justify-center gap-1 w-full">
              <span className="text-xl font-black text-slate-900">₹</span>
              <span className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 leading-none">
                1,699
              </span>
            </div>

            <p className="subtext font-medium mb-10 text-lg leading-relaxed">
              Full Inspection + OBD <br /> Diagnostics Included
            </p>

            <button className="mt-auto w-full py-5 rounded-2xl bg-indigo-600 text-white font-black text-lg hover:bg-slate-900 transition-all shadow-lg">
              Book Standard + OBD
            </button>
          </div>

          {/* LUXURY */}
          <div
            onClick={() => openBooking("Luxury")}
            className="relative flex flex-col h-full min-w-0 p-10 rounded-[2.5rem] card-glass border-2 border-transparent hover:border-indigo-200 group cursor-pointer transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
          >
            <p className="font-black text-pink-500 uppercase tracking-[0.2em] text-xs mb-6">
              Luxury / SUV
            </p>

            <div className="mb-6 flex items-end justify-center gap-1 w-full">
              <span className="text-xl font-black text-slate-900">₹</span>
              <span className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 leading-none">
                2,499
              </span>
            </div>

            <p className="subtext font-medium mb-10 text-lg leading-relaxed">
              BMW, Audi, Mercedes <br /> Premium Vehicles
            </p>

            <button className="mt-auto w-full py-5 rounded-2xl bg-slate-100 text-slate-900 font-black text-lg group-hover:bg-pink-500 group-hover:text-white transition-all shadow-sm">
              Book Premium
            </button>
          </div>

        </div>
      </section>

    </main>
  );
}