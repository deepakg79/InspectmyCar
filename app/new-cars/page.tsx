"use client";

import Link from "next/link";
import { useBooking } from "@/app/context/BookingContext";

export default function Home() {
  const { openNewCarBooking } = useBooking();

  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-b from-slate-50 via-white to-indigo-50/40 text-slate-900">

      {/* BACKGROUND */}
      <div className="absolute inset-0 -z-10 overflow-hidden">

        <div className="absolute -top-40 -left-32 h-[34rem] w-[34rem] rounded-full bg-indigo-400/20 blur-[120px] animate-pulse" />

        <div
          className="absolute top-1/3 -right-32 h-[30rem] w-[30rem] rounded-full bg-pink-400/20 blur-[120px] animate-pulse"
          style={{ animationDelay: "2s" }}
        />

        <div className="absolute bottom-0 left-1/2 h-[25rem] w-[25rem] -translate-x-1/2 rounded-full bg-cyan-300/20 blur-[120px]" />

        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg,#000 1px,transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      {/* HERO */}
      <section className="relative max-w-7xl mx-auto px-6 pt-36 pb-24">

        <div className="grid lg:grid-cols-2 gap-20 items-center">

          {/* LEFT */}
          <div>

            <div className="inline-flex items-center gap-3 rounded-full border border-indigo-100 bg-white/70 backdrop-blur-xl px-5 py-2 shadow-lg">

              <span className="relative flex h-3 w-3">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-500" />
              </span>

              <span className="text-xs font-black uppercase tracking-[0.25em] text-indigo-700">
                Pune • Live Booking Open
              </span>

            </div>

            <h1 className="mt-10 text-5xl md:text-7xl font-black tracking-tight leading-[0.92]">

              Your New Car
              <br />

              <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-pink-500 bg-clip-text text-transparent">
                Deserves One
              </span>

              <br />

              Final Inspection.

            </h1>

            <p className="mt-8 max-w-xl text-lg leading-8 text-slate-600">

              Independent 299+ point Pre-Delivery Inspection that
              uncovers transport damage, repaint jobs,
              manufacturing defects and hidden electronic issues
              before you accept delivery.

            </p>

            <div className="mt-10 flex flex-col sm:flex-row gap-5">

              <button
                onClick={() => openNewCarBooking()}
                className="group rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 px-8 py-5 font-bold text-white shadow-2xl shadow-indigo-300/40 transition-all duration-300 hover:-translate-y-1 hover:scale-[1.03]"
              >
                Book PDI
                <span className="ml-2 inline-block transition group-hover:translate-x-1">
                  →
                </span>
              </button>

              <a
                href="tel:+919975934213"
                className="rounded-2xl border border-slate-200 bg-white/80 backdrop-blur-xl px-8 py-5 font-bold text-slate-800 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-indigo-300 hover:shadow-xl"
              >
                📞 Talk to an Expert
              </a>

            </div>

            {/* QUICK STATS */}

            <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-3">

              {[
                ["299+", "Checks"],
                ["3500+", "Cars"],
                ["4.9★", "Rating"],
                ["100%", "Independent"],
              ].map(([v, l]) => (

                <div
                  key={l}
                  className="rounded-2xl border border-white/60 bg-white/70 p-5 backdrop-blur-xl shadow-lg transition hover:-translate-y-2 hover:shadow-2xl"
                >

                  <div className="text-2xl font-black text-indigo-600">
                    {v}
                  </div>

                  <div className="mt-1 text-xs uppercase tracking-[0.2em] text-slate-500">
                    {l}
                  </div>

                </div>

              ))}

            </div>

          </div>

          {/* RIGHT */}

          <div className="relative">

            <div className="absolute -inset-8 rounded-[3rem] bg-gradient-to-r from-indigo-500/20 to-pink-500/20 blur-3xl" />

            <div className="relative overflow-hidden rounded-[3rem] border border-white/70 bg-white p-4 shadow-[0_30px_80px_rgba(0,0,0,0.15)]">

              <img
                src="/hero-car.jpg"
                alt="Car Inspection"
                className="h-[650px] w-full rounded-[2.3rem] object-cover transition duration-700 hover:scale-105"
              />

              <div className="absolute bottom-10 left-10 right-10 rounded-[2rem] border border-white/50 bg-white/75 p-6 backdrop-blur-xl shadow-xl">

                <div className="flex items-center justify-between">

                  <div>

                    <p className="text-xs font-black uppercase tracking-[0.25em] text-indigo-600">
                      Next Available
                    </p>

                    <h3 className="mt-2 text-2xl font-black text-slate-900">
                      Monday • 4 Slots Left
                    </h3>

                    <p className="mt-2 text-sm text-slate-600">
                      Book today to secure your preferred dealership visit.
                    </p>

                  </div>

                  <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-indigo-600 to-pink-500 text-4xl text-white shadow-xl">
                    ⚡
                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>

      </section>
      {/* TRUST STATS */}
      <section className="px-6 pb-24">

        <div className="max-w-7xl mx-auto">

          <div className="rounded-[3rem] border border-white bg-white/80 backdrop-blur-xl p-10 shadow-2xl">

            <div className="grid gap-8 md:grid-cols-4">

              {[
                {
                  icon: "🛡️",
                  value: "Independent",
                  label: "No Dealership TieUps.",
                },
                {
                  icon: "🏢",
                  value: "At Dealership",
                  label: "Inspection before delivery.",
                },
                {
                  icon: "⚡",
                  value: "Instant Report",
                  label: "Digital report with findings.",
                },
                {
                  icon: "🎯",
                  value: "299+ Checks",
                  label: "Professional PDI checklist.",
                },
              ].map((item) => (

                <div
                  key={item.label}
                  className="group rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-pink-300 hover:shadow-2xl"
                >

                  <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-500 via-violet-600 to-indigo-600 text-3xl shadow-lg transition-all duration-300 group-hover:scale-110">
                    {item.icon}
                  </div>

                  <div className="text-4xl font-black text-slate-900">
                    {item.value}
                  </div>

                  <p className="mt-2 text-xs font-bold uppercase tracking-[0.25em] text-slate-500">
                    {item.label}
                  </p>

                </div>

              ))}

            </div>

          </div>

        </div>

      </section>

      {/* WHY CHOOSE */}
      <section className="px-6 pb-28">

        <div className="max-w-7xl mx-auto">

          <div className="text-center">

            <span className="rounded-full bg-indigo-100 px-5 py-2 text-xs font-black uppercase tracking-[0.3em] text-indigo-600">
              Why InspectMyCar
            </span>

            <h2 className="mt-8 text-5xl font-black tracking-tight text-slate-900">
              More Than Just a Checklist
            </h2>

            <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-slate-600">
              Every inspection combines professional expertise,
              specialized diagnostic equipment and a meticulous
              299+ point checklist to ensure your new car is
              delivered exactly as it should be.
            </p>

          </div>

          <div className="mt-20 grid gap-8 lg:grid-cols-3">

            {[
              {
                icon: "🎨",
                title: "Paint & Body Inspection",
                desc: "Detect repainting, scratches, dents, panel mismatch and transport damage using professional inspection methods.",
              },
              {
                icon: "💻",
                title: "OBD & Electronics",
                desc: "Advanced diagnostics for hidden ECU faults, warning lights, sensors, infotainment and electronic systems.",
              },
              {
                icon: "📑",
                title: "Documentation Review",
                desc: "Verify VIN, engine number, manufacturing date, warranty documents and delivery paperwork.",
              },
              {
                icon: "⚙️",
                title: "Mechanical Check",
                desc: "Inspect engine bay, suspension, battery, tyres, brakes and fluid levels before delivery.",
              },
              {
                icon: "📸",
                title: "Digital Report",
                desc: "Receive a detailed inspection report with photos and findings immediately after inspection.",
              },
              {
                icon: "🛡️",
                title: "Independent Experts",
                desc: "We work only for you—not the dealership—ensuring an unbiased and transparent inspection.",
              },
            ].map((card, index) => (

              <div
                key={card.title}
                className="group relative overflow-hidden rounded-[2.5rem] border border-white/70 bg-white/80 p-8 backdrop-blur-xl shadow-lg transition-all duration-500 hover:-translate-y-3 hover:shadow-2xl"
                style={{
                  animationDelay: `${index * 120}ms`,
                }}
              >

                <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-gradient-to-br from-indigo-500/10 to-pink-500/10 blur-3xl transition group-hover:scale-150" />

                <div className="relative">

                  <div className="mb-7 flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-indigo-600 to-pink-500 text-3xl text-white shadow-xl transition group-hover:rotate-6 group-hover:scale-110">
                    {card.icon}
                  </div>

                  <h3 className="text-2xl font-black text-slate-900">
                    {card.title}
                  </h3>

                  <p className="mt-5 leading-8 text-slate-600">
                    {card.desc}
                  </p>

                </div>

              </div>

            ))}

          </div>

        </div>

      </section>
      {/* WHY PDI MATTERS */}
      <section className="px-6 py-28 bg-slate-50">

        <div className="max-w-7xl mx-auto">

          {/* Heading */}

          <div className="text-center">

            <span className="inline-flex rounded-full bg-indigo-100 px-5 py-2 text-xs font-black uppercase tracking-[0.3em] text-indigo-600">
              Before Delivery
            </span>

            <h2 className="mt-8 text-5xl md:text-6xl font-black tracking-tight text-slate-900">
              Why You Should Never Skip PDI
            </h2>

            <p className="mt-6 max-w-3xl mx-auto text-xl leading-9 text-slate-600">
              Even a brand-new car can have transport damage, repaint work,
              electrical faults or missing accessories. A professional
              Pre-Delivery Inspection ensures these issues are identified before
              you take delivery.
            </p>

          </div>

          {/* Cards */}

          <div className="mt-20 grid gap-8 md:grid-cols-2 xl:grid-cols-3">

            {[
              {
                icon: "🚚",
                title: "Transport Damage",
                desc: "Vehicles travel hundreds of kilometres before reaching the dealership. Minor dents, scratches and cracked lights can occur during transit.",
              },
              {
                icon: "🎨",
                title: "Paint Defects",
                desc: "Panels may be repainted after yard damage. Paint thickness inspection helps identify hidden repairs before delivery.",
              },
              {
                icon: "⚡",
                title: "Electronic Issues",
                desc: "ECU faults, warning lights and sensor problems often remain unnoticed without professional diagnostics.",
              },
              {
                icon: "🔧",
                title: "Manufacturing Defects",
                desc: "Loose fittings, fluid leaks, poor panel alignment and missing accessories are easier to fix before registration.",
              },
              {
                icon: "📄",
                title: "Documentation Check",
                desc: "VIN, engine number, warranty booklet, invoice and registration details are verified before acceptance.",
              },
              {
                icon: "🛡️",
                title: "Peace of Mind",
                desc: "Receive an independent inspection report so you can confidently accept or reject delivery.",
              },
            ].map((item) => (

              <div
                key={item.title}
                className="group rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-indigo-300 hover:shadow-2xl"
              >

                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 text-3xl text-white shadow-lg transition group-hover:scale-110">
                  {item.icon}
                </div>

                <h3 className="mt-8 text-2xl font-black text-slate-900">
                  {item.title}
                </h3>

                <p className="mt-5 leading-8 text-slate-600">
                  {item.desc}
                </p>

              </div>

            ))}

          </div>

          {/* Timeline */}

          <div className="mt-32">

            <div className="text-center">

              <span className="inline-flex rounded-full bg-pink-100 px-5 py-2 text-xs font-black uppercase tracking-[0.3em] text-pink-600">
                Our Process
              </span>

              <h2 className="mt-8 text-5xl font-black text-slate-900">
                How Your Inspection Works
              </h2>

              <p className="mt-5 text-lg text-slate-600">
                Four simple steps from booking to delivery.
              </p>

            </div>

            <div className="relative mt-20">

              <div className="absolute left-8 top-0 hidden h-full w-px bg-slate-300 lg:block" />

              <div className="space-y-10">

                {[
                  {
                    step: "01",
                    title: "Book Your Slot",
                    desc: "Choose your preferred date, dealership and inspection slot online.",
                  },
                  {
                    step: "02",
                    title: "Inspector Assigned",
                    desc: "A certified PDI expert contacts you and coordinates with the dealership.",
                  },
                  {
                    step: "03",
                    title: "299+ Point Inspection",
                    desc: "Complete inspection covering paint, electronics, engine, tyres, body panels and documentation.",
                  },
                  {
                    step: "04",
                    title: "Receive Report",
                    desc: "A detailed report with findings is shared before you accept delivery.",
                  },
                ].map((item) => (

                  <div
                    key={item.step}
                    className="relative flex items-start gap-8"
                  >

                    <div className="z-10 flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 text-xl font-black text-white shadow-lg">
                      {item.step}
                    </div>

                    <div className="flex-1 rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">

                      <h3 className="text-2xl font-black text-slate-900">
                        {item.title}
                      </h3>

                      <p className="mt-4 leading-8 text-slate-600">
                        {item.desc}
                      </p>

                    </div>

                  </div>

                ))}

              </div>

            </div>

          </div>

        </div>

      </section>
      {/* TESTIMONIALS */}
      <section className="px-6 py-28">

        <div className="max-w-7xl mx-auto">

          <div className="text-center">

            <span className="inline-flex rounded-full bg-indigo-100 px-5 py-2 text-xs font-black uppercase tracking-[0.3em] text-indigo-600">
              Customer Stories
            </span>

            <h2 className="mt-8 text-5xl font-black tracking-tight text-slate-900">
              Thousands of Buyers
              <br />
              Trust InspectMyCar
            </h2>

            <p className="mt-6 max-w-3xl mx-auto text-xl leading-9 text-slate-600">
              Our independent inspections have helped customers identify
              repaint work, transport damage and hidden defects before
              accepting delivery.
            </p>

          </div>

          <div className="mt-20 grid gap-8 lg:grid-cols-3">

            {[
              {
                name: "Rahul Patil",
                car: "Hyundai Creta",
                text: "The inspector discovered that the front bumper had been repainted. The dealership replaced it before delivery. Best ₹1,499 I've spent.",
              },
              {
                name: "Neha Kulkarni",
                car: "Honda Elevate",
                text: "Professional inspection with a detailed digital report. It gave me complete confidence before taking delivery.",
              },
              {
                name: "Amit Shah",
                car: "Tata Nexon",
                text: "Hidden electronic fault detected during OBD diagnostics. The issue was fixed before registration.",
              },
            ].map((review) => (

              <div
                key={review.name}
                className="group rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
              >

                <div className="flex items-center gap-1 text-yellow-400 text-xl">
                  ★★★★★
                </div>

                <p className="mt-6 text-lg leading-8 text-slate-600 italic">
                  "{review.text}"
                </p>

                <div className="mt-8 flex items-center gap-4 border-t border-slate-100 pt-6">

                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-indigo-600 to-violet-600 text-lg font-black text-white">
                    {review.name.charAt(0)}
                  </div>

                  <div>

                    <h4 className="font-black text-slate-900">
                      {review.name}
                    </h4>

                    <p className="text-sm font-semibold text-indigo-600">
                      {review.car}
                    </p>

                  </div>

                </div>

              </div>

            ))}

          </div>

        </div>

      </section>

      {/* FAQ */}
      <section className="px-6 pb-28">

        <div className="max-w-6xl mx-auto rounded-[3rem] border border-slate-200 bg-white p-12 shadow-xl">

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">

            <div>

              <span className="inline-flex rounded-full bg-pink-100 px-5 py-2 text-xs font-black uppercase tracking-[0.3em] text-pink-600">
                Frequently Asked Questions
              </span>

              <h2 className="mt-6 text-5xl font-black text-slate-900">
                Everything You Need to Know
              </h2>

            </div>

            <Link
              href="/faqs"
              className="rounded-2xl bg-slate-900 px-8 py-4 font-bold text-white transition hover:bg-indigo-600"
            >
              View All FAQs →
            </Link>

          </div>

          <div className="mt-14 grid gap-6">

            {[
              {
                q: "Can I inspect my new car before registration?",
                a: "Yes. We recommend completing the inspection before registration and final delivery so any issues can be rectified by the dealership.",
              },
              {
                q: "How long does the inspection take?",
                a: "Most inspections are completed within 60–90 minutes depending on the vehicle and dealership.",
              },
              {
                q: "Will I receive a report?",
                a: "Yes. You'll receive a detailed digital report with photographs, observations and recommendations immediately after the inspection.",
              },
              {
                q: "Can dealerships refuse a PDI?",
                a: "Generally no. As the buyer, you are entitled to inspect the vehicle before accepting delivery.",
              },
            ].map((faq) => (

              <div
                key={faq.q}
                className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-8 transition-all duration-300 hover:border-indigo-300 hover:bg-white hover:shadow-lg"
              >

                <h3 className="text-2xl font-black text-slate-900">
                  {faq.q}
                </h3>

                <p className="mt-4 leading-8 text-slate-600">
                  {faq.a}
                </p>

              </div>

            ))}

          </div>

        </div>

      </section>
      {/* FINAL CTA */}
      <section className="px-6 pb-32">

        <div className="mx-auto max-w-7xl overflow-hidden rounded-[2rem] lg:rounded-[3rem] bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-600 shadow-[0_40px_120px_rgba(99,102,241,0.35)]">

          <div className="grid lg:grid-cols-2 items-center">

            {/* LEFT */}

            <div className="p-12 lg:p-16 text-white">

              <span className="inline-flex rounded-full bg-white/15 px-5 py-2 text-xs font-black uppercase tracking-[0.3em] backdrop-blur-xl">
                Book Your Inspection
              </span>

              <h2 className="mt-8 text-5xl lg:text-6xl font-black leading-tight">
                Don't Accept
                <br />
                A Defective
                <br />
                New Car.
              </h2>

              <p className="mt-8 text-lg leading-8 text-white/85 max-w-xl">
                For less than the cost of a single dealership accessory,
                ensure your vehicle is free from hidden defects, repaint
                work and manufacturing issues before delivery.
              </p>
              <div className="mt-10 flex flex-col gap-3">

                {[
                  "299+ Inspection Points",
                  "Accident Detection",
                  "Engine & Gearbox Check",
                  "OBD Diagnostics",
                  "Negotiation Report",
                  "Independent Experts",
                ].map((item) => (

                  <div
                    key={item}
                    className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/10 px-4 py-3 backdrop-blur-xl"
                  >
                    <span className="text-green-400 text-lg">✓</span>

                    <span className="text-sm font-medium">
                      {item}
                    </span>
                  </div>

                ))}

              </div>

            </div>

            {/* RIGHT */}

            <div className="bg-white p-5 sm:p-8 lg:p-16">

              <div className="w-full rounded-[2rem] border border-slate-200 bg-slate-50 p-5 sm:p-8 lg:p-10">

                <p className="text-sm font-black uppercase tracking-[0.3em] text-indigo-600">
                  Starting From
                </p>

                <div className="mt-4 flex items-end gap-2">

                  <span className="text-6xl font-black text-slate-900">
                    ₹1,499
                  </span>

                  <span className="pb-3 text-slate-500">
                    onwards
                  </span>

                </div>

                <div className="mt-10 space-y-4">

                  {[
                    "Certified PDI Engineer",
                    "Independent Inspection",
                    "At Your Dealership",
                    "Instant Digital Report",
                  ].map((item) => (

                    <div
                      key={item}
                      className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4"
                    >

                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 font-bold">
                        ✓
                      </div>

                      <span className="font-semibold text-slate-700">
                        {item}
                      </span>

                    </div>

                  ))}

                </div>

                <div className="mt-10 flex flex-col gap-4">

                  <button
                    onClick={() => openNewCarBooking("Standard")}
                    className="rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 px-8 py-5 text-lg font-bold text-white shadow-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
                  >
                    Book PDI Now →
                  </button>

                  <Link
                    href="/info/pricing#new-car-pricing"
                    className="rounded-2xl border border-slate-300 px-8 py-5 text-center font-bold text-slate-700 transition hover:bg-slate-100"
                  >
                    View Pricing
                  </Link>

                  <a
                    href="tel:+919975934213"
                    className="rounded-2xl border border-indigo-200 bg-indigo-50 px-8 py-5 text-center font-bold text-indigo-700 transition hover:bg-indigo-100"
                  >
                    📞 Talk to an Expert
                  </a>

                </div>

              </div>

            </div>

          </div>

        </div>

      </section>

    </main>
  );
}