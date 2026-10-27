"use client";



import Link from "next/link";



import { useEffect } from "react";



import { useRouter } from "next/navigation";



import {

  useBooking,

  type NewCarPlan,

  type UsedCarPlan,

} from "@/app/context/BookingContext";



import {
  CITY_PRICING,
  useCityPricing,
  formatPrice,
  getNewCarPrice,
  type CityName,
} from "@/app/components/city_price";


type Props = {

  citySlug: string;

};



export default function CityLandingClient({

  citySlug,

}: Props) {

  const router = useRouter();



  const {

    openNewCarBooking,

    openUsedCarBooking,

  } = useBooking();



  const { setCity } = useCityPricing();



  /**

   * The URL is the source of truth for this landing page.

   *

   * localStorage must never decide which city's page is shown.

   */

  const normalizedCitySlug = decodeURIComponent(citySlug ?? "")

    .trim()

    .toLowerCase();



  const getCitySlug = (city: CityName): string => {

    const configuredName = String(

      CITY_PRICING[city].name ?? city

    );



    return configuredName

      .trim()

      .toLowerCase()

      .replace(/\s+/g, "-");

  };



  const cities = Object.keys(

    CITY_PRICING

  ) as CityName[];



  const cityName =

    cities.find(

      (city) =>

        getCitySlug(city) ===

        normalizedCitySlug

    ) ?? null;



  /**

   * Synchronize the resolved URL city with the existing

   * client-side booking/pricing context.

   */

  useEffect(() => {

    if (cityName) {

      setCity(cityName);

    }

  }, [cityName, setCity]);



  if (!cityName) {

    return (

      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6">

        <div className="text-center">

          <h1 className="text-3xl font-black text-slate-900">

            City Not Found

          </h1>



          <p className="mt-3 text-slate-500">

            The requested inspection city is not available.

          </p>



          <Link

            href="/pune"

            className="mt-6 inline-flex rounded-xl bg-indigo-600 px-6 py-3 font-bold text-white transition hover:bg-indigo-700"

          >

            Go to Pune

          </Link>

        </div>

      </main>

    );

  }



  const cityPricing =

    CITY_PRICING[cityName];



  const baseFuelPrice =

    Number(cityPricing.newCarFuel) || 0;



  const evBasePrice =

    Number(cityPricing.ev) || 0;



  const usedCarPrice =

    Number(cityPricing.usedCar) || 0;



  /**

   * ==========================================================

   * NEW CAR PRICING

   * ==========================================================

   *

   * Pune:

   *   Without Gauge = Base - ₹200

   *   With Gauge    = Base

   *   With OBD      = Base + ₹200

   *

   * Other cities:

   *   Only Advanced OBD is displayed.

   *   With OBD      = Base

   *

   * IMPORTANT:

   * Do not add/subtract ₹200 for non-Pune cities.

   */



  const withoutGaugePrice =
    getNewCarPrice(cityName, "fuel", "withoutGauge");

  const standardFuelPrice =
    getNewCarPrice(cityName, "fuel", "withGauge");

  const withObdPrice =
    getNewCarPrice(cityName, "fuel", "withOBD");


  const standardEvPrice =

    evBasePrice;



  const handleNewCarBooking = (

    plan: NewCarPlan = "Standard"

  ) => {

    setCity(cityName);



    openNewCarBooking(plan);



    router.push(

      `/${getCitySlug(cityName)}/new-cars`,

      { scroll: false }

    );

  };



  const handleUsedCarBooking = (

    plan: UsedCarPlan = "Standard"

  ) => {

    setCity(cityName);



    openUsedCarBooking(plan);



    router.push(

      `/${getCitySlug(cityName)}/used-cars`,

      { scroll: false }

    );

  };



  const handleCityChange = (

    selectedCity: string

  ) => {

    const nextCity =

      selectedCity as CityName;



    if (!CITY_PRICING[nextCity]) {

      return;

    }



    setCity(nextCity);



    router.push(

      `/${getCitySlug(nextCity)}`

    );

  };



  return (

    <main className="relative min-h-screen overflow-hidden bg-gradient-to-b from-slate-50 via-white to-indigo-50/40 text-slate-900">



      {/* ======================================================

          BACKGROUND

      ====================================================== */}



      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">



        <div className="absolute -left-32 -top-40 h-[34rem] w-[34rem] rounded-full bg-indigo-400/20 blur-[120px] animate-pulse" />



        <div

          className="absolute -right-32 top-1/3 h-[30rem] w-[30rem] rounded-full bg-pink-400/20 blur-[120px] animate-pulse"

          style={{

            animationDelay: "2s",

          }}

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



      {/* ======================================================

          CITY SELECTOR

      ====================================================== */}



      <section className="relative mx-auto max-w-7xl px-6 pt-28">



        <div className="flex justify-end">



          <div className="inline-flex items-center gap-3 rounded-2xl border border-slate-200 bg-white/90 px-4 py-3 shadow-lg backdrop-blur-md">



            <span className="text-xs font-black uppercase tracking-wider text-slate-500">

              📍 Select City

            </span>



            <select

              value={cityName}

              onChange={(e) =>

                handleCityChange(e.target.value)

              }

              className="cursor-pointer bg-transparent text-sm font-black text-indigo-600 focus:outline-none"

            >

              {cities.map((city) => (

                <option

                  key={city}

                  value={city}

                >

                  {CITY_PRICING[city].name}

                </option>

              ))}

            </select>



          </div>



        </div>



      </section>



      {/* ======================================================

          CHOOSE INSPECTION

      ====================================================== */}



      <section className="relative z-10 px-6 pb-24">



        <div className="mx-auto max-w-7xl">



          <div className="slide-up mb-14 text-center">



            <p className="text-xs font-black uppercase tracking-[0.35em] text-indigo-600">

              OUR SERVICES

            </p>



            <h2 className="heading mt-4 text-4xl md:text-5xl">

              Choose Your Inspection in{" "}

              {cityPricing.name}

            </h2>



            <p className="subtext mx-auto mt-5 max-w-2xl">

              Whether you're taking delivery of a

              brand-new vehicle or buying a pre-owned

              car in {cityPricing.name}, our independent

              inspectors help you make the right decision.

            </p>



          </div>



          <div className="grid gap-8 lg:grid-cols-2">



            {/* =================================================

                NEW CAR

            ================================================= */}



            <Link

              href={`/${getCitySlug(cityName)}?type=new`}

              onClick={(event) => {

                event.preventDefault();

                handleNewCarBooking("Standard");

              }}

              className="group card-glass relative overflow-hidden rounded-[2.5rem] border border-indigo-100 p-10 transition-all duration-500 hover:-translate-y-3 hover:shadow-2xl"

            >



              <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-white opacity-0 transition duration-500 group-hover:opacity-100" />



              <div className="relative">



                <div className="flex items-start justify-between">



                  <div>



                    <div className="mb-8 flex h-20 w-20 items-center justify-center rounded-3xl bg-indigo-100 text-5xl transition group-hover:rotate-6">

                      🚗

                    </div>



                    <span className="inline-block rounded-full bg-indigo-100 px-4 py-2 text-xs font-black uppercase tracking-widest text-indigo-700">

                      New Car PDI

                    </span>



                  </div>



                  {/* =================================================

                      NON-PUNE:

                      Hide "From Without Gauge"

                  ================================================= */}



                  {cityName === "Pune" && (

                    <span className="rounded-full bg-emerald-100 px-4 py-2 text-xs font-black uppercase tracking-widest text-emerald-700">

                      From ₹

                      {formatPrice(

                        withoutGaugePrice

                      )}

                    </span>

                  )}



                </div>



                <h3 className="heading mt-8 mb-4 text-4xl">

                  Pre-Delivery Inspection

                </h3>



                <p className="subtext mb-8 leading-relaxed">

                  Before accepting delivery from the

                  showroom in {cityPricing.name},

                  let our experts inspect your vehicle

                  for transport damage, repaint work,

                  electronic issues and manufacturing

                  defects.

                </p>



                <div className="grid grid-cols-2 gap-4">



                  {[

                    "400 Checkpoints",

                    "Paint Thickness Test",

                    "OBD Diagnostics",

                    "Electrical Scan",

                    "Battery Health",

                    "Digital Report",

                  ].map((item) => (

                    <div

                      key={item}

                      className="flex items-center gap-3"

                    >



                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-100 text-sm font-black text-indigo-600">

                        ✓

                      </div>



                      <span className="text-sm font-semibold">

                        {item}

                      </span>



                    </div>

                  ))}



                </div>



                <div className="mt-10 flex items-center justify-between">



                  <span className="font-black text-indigo-600 transition group-hover:translate-x-2">

                    Explore Service →

                  </span>



                  <div className="rounded-2xl bg-indigo-600 px-5 py-3 font-black text-white shadow-lg">

                    NEW CARS

                  </div>



                </div>



              </div>



            </Link>



            {/* =================================================
                USED CAR — INDIGO CARD
            ================================================= */}

            <Link
              href={`/${getCitySlug(cityName)}?type=used`}
              onClick={(event) => {
                event.preventDefault();
                handleUsedCarBooking("Standard");
              }}
              className="group relative overflow-hidden rounded-[2.5rem] border border-indigo-800/60 bg-gradient-to-br from-indigo-950 via-indigo-900 to-indigo-950 p-10 text-white shadow-xl transition-all duration-500 hover:-translate-y-3 hover:shadow-2xl hover:shadow-indigo-900/20"
            >
              {/* Indigo hover glow */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-indigo-700/40 via-violet-700/20 to-indigo-950 opacity-0 transition duration-500 group-hover:opacity-100" />

              <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-indigo-500/20 blur-3xl transition duration-500 group-hover:bg-violet-500/25" />

              <div className="relative">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="mb-8 flex h-20 w-20 items-center justify-center rounded-3xl border border-indigo-400/30 bg-indigo-500/20 text-5xl transition duration-300 group-hover:-rotate-6 group-hover:bg-indigo-500/30">
                      🚙
                    </div>

                    <span className="inline-block rounded-full border border-indigo-400/30 bg-indigo-500/20 px-4 py-2 text-xs font-black uppercase tracking-widest text-indigo-200">
                      Used Car PPI
                    </span>
                  </div>

                  <span className="rounded-full border border-indigo-400/30 bg-indigo-500/20 px-4 py-2 text-xs font-black uppercase tracking-widest text-indigo-200">
                    From ₹{formatPrice(usedCarPrice)}
                  </span>
                </div>

                <h3 className="!mt-8 !mb-4 !text-4xl !text-white">
                  Pre-Purchase Inspection
                </h3>

                <p className="mb-8 leading-relaxed text-indigo-100/85">
                  Avoid buying a problematic vehicle in{" "}
                  {cityPricing.name}. We inspect accident history,
                  engine condition, suspension, electronics and
                  hidden defects before you pay.
                </p>

                <div className="grid grid-cols-2 gap-4">
                  {[
                    "Engine Health",
                    "Accident Detection",
                    "Flood Damage",
                    "OBD Scan",
                    "Suspension Check",
                    "Road Test",
                  ].map((item) => (
                    <div
                      key={item}
                      className="flex items-center gap-3"
                    >
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-indigo-400/30 bg-indigo-500/20 text-sm font-black text-indigo-200">
                        ✓
                      </div>

                      <span className="text-sm font-semibold text-indigo-50">
                        {item}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mt-10 flex items-center justify-between gap-4">
                  <span className="font-black text-indigo-200 transition group-hover:translate-x-2">
                    Explore Service →
                  </span>

                  <div className="rounded-2xl border border-indigo-300/30 bg-indigo-500/25 px-5 py-3 font-black text-white shadow-lg transition group-hover:bg-indigo-500/40">
                    USED CARS
                  </div>
                </div>
              </div>
            </Link>



          </div>



        </div>



      </section>



      {/* ======================================================

          FINAL CTA

      ====================================================== */}



      <section className="px-6 pb-32">



        <div className="mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-gradient-to-br from-indigo-950 via-indigo-700 to-slate-950 shadow-[0_40px_120px_rgba(30,27,75,0.35)] lg:rounded-[3rem]">



          <div className="grid items-center lg:grid-cols-2">



            {/* LEFT */}



            <div className="p-12 text-white lg:p-16">



              <span className="inline-flex rounded-full bg-white/15 px-5 py-2 text-xs font-black uppercase tracking-[0.3em] backdrop-blur-xl">

                Book Your Inspection in{" "}

                {cityPricing.name}

              </span>



              <h2 className="mt-8 text-5xl font-black leading-tight lg:text-6xl">

                Don't Accept

                <br />

                A Defective

                <br />

                New Car.

              </h2>



              <p className="mt-8 max-w-xl text-lg leading-8 text-white/85">

                For less than the cost of a single

                dealership accessory, ensure your vehicle

                is free from hidden defects, repaint work

                and manufacturing issues before delivery

                in {cityPricing.name}.

              </p>



              <div className="mt-10 flex flex-col gap-3">



                {[

                  "400 Inspection Points",

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



                    <span className="text-lg text-green-400">

                      ✓

                    </span>



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

                  New Car PDI Pricing

                </p>



                <p className="mt-2 text-sm font-semibold text-slate-500">

                  {cityPricing.name}

                </p>





                {/* =================================================

                    MAIN PRICE



                    Pune:

                    With Gauge is the main/default price.



                    Other cities:

                    Advanced OBD is the main/default price.

                ================================================= */}



                {/* =================================================

                    PRICE OPTIONS

                ================================================= */}



                <div className="mt-8 grid gap-3">



                  {/* =================================================

                      WITHOUT GAUGE — PUNE ONLY

                  ================================================= */}



                  {cityName === "Pune" && (

                    <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4">



                      <div>



                        <p className="font-bold text-slate-800">

                          Without Gauge

                        </p>



                        <p className="text-xs text-slate-500">

                          ₹200 less

                        </p>



                      </div>



                      <span className="text-xl font-black text-slate-900">

                        ₹

                        {formatPrice(

                          withoutGaugePrice

                        )}

                      </span>



                    </div>

                  )}



                  {/* =================================================

                      WITH GAUGE — PUNE ONLY

                  ================================================= */}



                  {cityName === "Pune" && (

                    <div className="flex items-center justify-between rounded-2xl border border-indigo-200 bg-indigo-50 p-4">



                      <div>



                        <p className="font-bold text-indigo-800">

                          With Gauge

                        </p>



                        <p className="text-xs text-indigo-600">

                          Standard PDI

                        </p>



                      </div>



                      <span className="text-xl font-black text-indigo-700">

                        ₹

                        {formatPrice(

                          standardFuelPrice

                        )}

                      </span>



                    </div>

                  )}



                  {/* =================================================

                      OBD



                      Pune:

                      With OBD



                      Other cities:

                      With Advanced OBD

                  ================================================= */}



                  {cityName === "Pune" ? (

                    <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4">



                      <div>



                        <p className="font-bold text-slate-800">

                          With OBD

                        </p>



                        <p className="text-xs text-slate-500">

                          Advanced Diagnostics

                        </p>



                      </div>



                      <span className="text-xl font-black text-slate-900">

                        ₹

                        {formatPrice(

                          withObdPrice

                        )}

                      </span>



                    </div>

                   ) : (
                    <>
                      <div className="flex items-center justify-between rounded-2xl border border-indigo-200 bg-indigo-50 p-4">
                        <div>
                          <p className="font-bold text-indigo-800">Standard Cars w/o OBD</p>
                          <p className="text-xs text-indigo-600">Gauge Check • Standard PDI</p>
                        </div>
                        <span className="text-xl font-black text-indigo-700">₹{formatPrice(standardFuelPrice)}</span>
                      </div>
                      <div className="flex items-center justify-between rounded-2xl border-2 border-indigo-200 bg-indigo-50 p-4">
                        <div>
                          <p className="font-bold text-indigo-800">Standard Cars with OBD</p>
                          <p className="text-xs text-indigo-600">Advanced OBD Diagnostics</p>
                        </div>
                        <span className="text-xl font-black text-indigo-700">₹{formatPrice(withObdPrice)}</span>
                      </div>
                    </>
                  )}



                  {/* =================================================

                      EV

                  ================================================= */}



                  <div className="flex items-center justify-between rounded-2xl border border-emerald-200 bg-emerald-50 p-4">



                    <div>



                      <p className="font-bold text-emerald-800">

                        EV Cars

                      </p>



                      <p className="text-xs text-emerald-600">

                        EV PDI

                      </p>



                    </div>



                    <span className="text-xl font-black text-emerald-700">

                      ₹

                      {formatPrice(

                        standardEvPrice

                      )}

                    </span>



                  </div>



                </div>



<div className="mt-6 space-y-4">
  {/* Your existing New Car pricing options stay here */}
</div>

{/* =========================================================
    USED / OLD CAR PRICING — DISTINCT SECTION
========================================================= */}

<div className="mt-12 border-t-2 border-dashed border-slate-200 pt-10">

  <div className="mb-5 flex items-center gap-3">
    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-100">
      <span className="text-xl">🔍</span>
    </div>

    <div>
      <p className="text-xs font-black uppercase tracking-[0.2em] text-amber-700">
        Old / Used Car
      </p>

      <p className="text-sm font-black text-slate-900">
        Pre-Purchase Inspection
      </p>
    </div>
  </div>

  <div className="rounded-[1.5rem] border-2 border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 p-5 shadow-sm">
    <div className="flex items-center justify-between gap-5">

      <div>
        <p className="text-xs font-black uppercase tracking-wider text-amber-700">
          Used Car PPI
        </p>

        <p className="mt-1 text-xs font-medium leading-relaxed text-amber-800/70">
          Independent pre-purchase inspection in{" "}
          {cityPricing.name}
        </p>

      </div>

      <div className="text-right">
        <p className="text-[10px] font-black uppercase tracking-wider text-amber-600">
          Starting From
        </p>

        <p className="mt-1 text-3xl font-black text-amber-800">
          ₹{formatPrice(usedCarPrice)}
        </p>
      </div>

    </div>
  </div>

</div>

{/* =========================================================
    BENEFITS / NEXT SECTION
========================================================= */}

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



                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 font-bold text-emerald-600">

                        ✓

                      </div>



                      <span className="font-semibold text-slate-700">

                        {item}

                      </span>



                    </div>

                  ))}



                </div>



                {/* =================================================

                    ACTIONS

                ================================================= */}



                <div className="mt-10 flex flex-col gap-4">



                  <button
                    onClick={() => handleNewCarBooking("Standard")}
                    className="rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 px-8 py-5 text-lg font-bold text-white shadow-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
                  >
                    Book Standard w/o OBD in {cityPricing.name} →
                  </button>

                  <button
                    onClick={() => handleNewCarBooking("Standard-OBD")}
                    className="rounded-2xl border-2 border-indigo-200 bg-indigo-50 px-8 py-5 text-lg font-bold text-indigo-700 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:bg-indigo-100 hover:shadow-xl"
                  >
                    Book Standard with OBD →
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