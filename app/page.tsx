"use client";



import { useEffect } from "react";



import Link from "next/link";



import { useBooking } from "@/app/context/BookingContext";



import {



       CITY_PRICING,



       useCityPricing,



       formatPrice,



       type CityName,



} from "@/app/components/city_price";



export default function Home() {



       const { openBookingChooser } = useBooking();



       const {



           selectedCity,



           cities,



           setCity,



           newCarFuelPrice,



           newCarEvPrice,



           usedCarPrice,



       } = useCityPricing();



       // Keep the existing first-visit booking chooser behavior.



       useEffect(() => {



           const shown = sessionStorage.getItem("homeModalShown");



           if (!shown) {



               openBookingChooser();



               sessionStorage.setItem("homeModalShown", "true");



           }



       }, [openBookingChooser]);



       const selectedCityName =



           CITY_PRICING[selectedCity].name;



       const newCarStartingPrice =



           newCarFuelPrice("withoutGauge");



       const usedCarStartingPrice =



           usedCarPrice();



       const evPrice =



           newCarEvPrice();



       return (



           <main className="relative overflow-hidden bg-main text-[#3730A3] min-h-screen">



               <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">



                   <div className="absolute -top-40 -left-32 h-[30rem] w-[30rem] rounded-full bg-[#6366F1]/10 blur-3xl animate-pulse" />



                   <div className="absolute top-96 -right-40 h-[34rem] w-[34rem] rounded-full bg-[#A5B4FC]/20 blur-3xl animate-pulse [animation-delay:1200ms]" />



                   <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[26rem] w-[26rem] rounded-full bg-[#E0E7FF]/30 blur-3xl animate-pulse [animation-delay:2200ms]" />



               </div>



               <section className="relative pt-28 pb-24 px-6 z-10">



                   <div className="max-w-7xl mx-auto">



                       <div className="flex justify-end mb-8">



                           <div className="inline-flex items-center gap-3 bg-white/90 backdrop-blur-md border border-[#E0E7FF] shadow-lg px-4 py-2.5 rounded-2xl">



                               <span className="text-xs font-black uppercase tracking-wider text-[#6366F1]">



                                   📍 Select City:



                               </span>



                               <select



                                   value={selectedCity}



onChange={(e) => {



       const nextCity =



           e.target.value as CityName;



       setCity(nextCity);



       window.dispatchEvent(



           new CustomEvent("cityChanged", {



               detail: nextCity,



           })



       );



}}



                                   className="bg-transparent font-black text-[#6366F1] text-sm focus:outline-none cursor-pointer"



                               >



                                   {cities.map((cityName) => (



                                       <option



                                           key={cityName}



                                           value={cityName}



                                       >



                                           {CITY_PRICING[cityName].name}



                                       </option>



                                   ))}



                               </select>



                           </div>



                       </div>



                       <div className="grid lg:grid-cols-2 gap-16 items-center">



                           <div className="slide-up">



                               <div className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/70 backdrop-blur-xl px-5 py-3 shadow-xl text-xs font-black uppercase tracking-[0.2em] text-[#6366F1]">



                                   {CITY_PRICING[selectedCity].badge}



                               </div>



                               <h1 className="heading text-5xl md:text-7xl leading-[1.05] mt-8">



                                   Inspect Your Car Before Delivery in



                                   <span className="block bg-gradient-to-r from-[#3730A3] via-[#6366F1] to-[#818CF8] bg-clip-text text-transparent mt-2">



                                       {selectedCityName}



                                   </span>



                               </h1>



                               <p className="subtext text-lg max-w-xl mt-8 leading-relaxed">



                                   Independent{" "}



                                   <b>Pre-Delivery Inspection (PDI)</b> for



                                   brand-new cars and{" "}



                                   <b>Pre-Purchase Inspection (PPI)</b> for



                                   used cars in {selectedCityName}.



                                   <br />



                                   <br />



                                   Protect yourself from hidden accident



                                   repairs, repaint work, transport damage,



                                   electrical faults and costly surprises



                                   before making your purchase.



                               </p>



                               <div className="flex flex-wrap gap-4 mt-10">



<button



       onClick={openBookingChooser}



       className="rounded-2xl bg-gradient-to-r from-[#4F46E5] via-[#6366F1] to-[#818CF8] px-10 py-5 text-lg font-black text-white shadow-xl shadow-[#6366F1]/25 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-[#6366F1]/35 active:translate-y-0"



>



       Book Inspection in{" "}



       {selectedCityName}



</button>



                                   <a



                                       href="https\\://wa.me/919975934213"



                                       className="card-glass px-10 py-5 font-bold border border-[#E0E7FF] hover:shadow-xl hover:-translate-y-1 transition-all"



                                   >



                                       💬 WhatsApp



                                   </a>



                               </div>



                               <div className="flex flex-wrap gap-8 mt-12">



                                   {[



                                       ["5000+", "Cars Inspected"],



                                       ["400", "Checkpoints"],



                                       ["4.9★", "Rating"],



                                   ].map(([v, l]) => (



                                       <div key={l}>



                                           <p className="text-3xl font-black text-[#6366F1]">



                                               {v}



                                           </p>



                                           <p className="text-xs uppercase tracking-widest text-[#6366F1] font-bold">



                                               {l}



                                           </p>



                                       </div>



                                   ))}



                               </div>



                           </div>



                           <div



                                className="relative slide-up flex items-center justify-center min-w-0"



                                style={{ animationDelay: ".2s" }}



                            >



                                <div className="w-full max-w-[560px]">



                                    <div className="mx-auto flex w-full flex-col items-center">



                                        <div className="inspection-dial relative aspect-square w-full">



                                            <div className="dial-orbit dial-orbit-outer absolute inset-[4%] rounded-full border border-dashed border-[#6366F1]/40" />



                                           <div className="dial-orbit dial-orbit-inner absolute inset-[11%] rounded-full border border-dashed border-[#0D9488]/40" />



                                            <div className="dial-orbit dial-orbit-third absolute inset-[20%] rounded-full border border-[#6366F1]/20" />



                                            <svg viewBox="0 0 400 400" className="dial-third-ticks absolute inset-[20%] h-[60%] w-[60%]" aria-hidden="true">



                                                {Array.from({ length: 48 }, (_, i) => (



                                                    <line



                                                        key={i}



                                                        x1="200"



                                                        y1={i % 4 === 0 ? "8" : "14"}



                                                        x2="200"



                                                        y2={i % 4 === 0 ? "25" : "20"}



                                                        transform={`rotate(${i * 7.5} 200 200)`}



                                                        stroke={i % 4 === 0 ? "#6366F1" : "#64748B"}



                                                        strokeOpacity={i % 4 === 0 ? "0.8" : "0.35"}



                                                        strokeWidth={i % 4 === 0 ? "1.5" : "1"}



                                                    />



                                                ))}



                                            </svg>



                                            <div className="dial-hand absolute left-1/2 top-1/2 z-[2] h-[42%] w-[3px] rounded-full bg-gradient-to-t from-[#06B6D4] via-[#22D3EE] to-transparent" />



                                            <div className="absolute left-1/2 top-1/2 z-[3] h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[#22D3EE] bg-[#0B1228] shadow-[0_0_18px_#22D3EE]" />



                                            <div className="absolute left-1/2 top-[29%] z-[4] -translate-x-1/2 whitespace-nowrap text-[10px] font-black uppercase tracking-[0.3em] text-[#0891B2] sm:text-sm">



                                                ◉ Checkpoints



                                            </div>



                                            <div className="absolute left-1/2 top-1/2 z-[4] w-[65%] -translate-x-1/2 -translate-y-1/2 text-center">



                                                <div className="bg-gradient-to-b from-[#3730A3] via-[#4F46E5] to-[#94A3B8] bg-clip-text text-7xl font-black leading-none text-transparent sm:text-8xl md:text-9xl">



                                                    400



                                                </div>



                                                <p className="mt-3 text-xs font-bold text-slate-500 sm:text-base">



                                                    Every car. Every time.



                                                </p>



                                            </div>



                                            {[



                                                { label: "ENGINE", pos: "left-1/2 top-[2%] -translate-x-1/2", color: "text-[#4F46E5]" },



                                                { label: "SAFETY", pos: "left-[3%] top-[27%]", color: "text-[#0891B2]" },



                                                { label: "BODY", pos: "right-[2%] top-[29%]", color: "text-[#0D9488]" },



                                                { label: "WHEEL & TYRES", pos: "left-[1%] top-[72%]", color: "text-[#E11D48]" },



                                                { label: "OBD-2", pos: "right-[2%] top-[74%]", color: "text-[#CA8A04]" },



                                                { label: "ELECTRICAL", pos: "left-1/2 bottom-[2%] -translate-x-1/2", color: "text-[#7C3AED]" },



                                            ].map((item) => (



                                                <div



                                                    key={item.label}



                                                    className={`absolute ${item.pos} rounded-full border border-slate-300/80 bg-white/90 px-2 py-2 text-[8px] font-black tracking-[0.1em] shadow-lg backdrop-blur sm:px-4 sm:text-[10px] ${item.color}`}



                                                >



                                                    {item.label}



                                                </div>



                                            ))}



                                        </div>



                                    </div>



                                </div>



                                <style jsx>{`



                                    .inspection-dial {



                                        background:



                                            radial-gradient(circle at 25% 75%, rgba(79, 70, 229, 0.09), transparent 48%),



                                            linear-gradient(rgba(99, 102, 241, 0.035) 1px, transparent 1px),



                                            linear-gradient(90deg, rgba(99, 102, 241, 0.035) 1px, transparent 1px);



                                        background-size: auto, 44px 44px, 44px 44px;



                                        border-radius: 50%;



                                    }



                                    .dial-orbit {

                                        transform-origin: 50% 50%;

                                        will-change: transform;

                                    }

                                    .dial-orbit-outer {

                                        animation: dial-orbit-spin 28s linear infinite;

                                    }

                                    .dial-orbit-inner {

                                        animation: dial-orbit-spin-reverse 20s linear infinite;

                                    }

                                    .dial-orbit-third {

                                        animation: dial-orbit-spin 16s linear infinite;

                                    }

.dial-third-ticks {
                                        transform-box: fill-box;
                                        transform-origin: center;
                                        animation: dial-orbit-spin 16s linear infinite;
                                        will-change: transform;
                                    }

                                    .dial-hand {



                                        transform: translate(-50%, -100%) rotate(-48deg);



                                        transform-origin: 50% 100%;



                                        animation: inspection-sweep 8s linear infinite;



                                        box-shadow: 0 0 12px rgba(6, 182, 212, 0.8), 0 0 24px rgba(34, 211, 238, 0.45);



                                    }



                                    @keyframes inspection-sweep {

                                       from { transform: translate(-50%, -100%) rotate(-48deg); }

                                       to { transform: translate(-50%, -100%) rotate(312deg); }

                                   }

                                   @keyframes dial-orbit-spin {

                                       from { transform: rotate(0deg); }

                                       to { transform: rotate(360deg); }

                                   }

                                   @keyframes dial-orbit-spin-reverse {

                                       from { transform: rotate(360deg); }

                                       to { transform: rotate(0deg); }

                                   }

                                   @media (prefers-reduced-motion: reduce) {

                                       .dial-hand,

                                       .dial-orbit-outer,

                                       .dial-orbit-inner,

                                       .dial-orbit-third,

                                       .dial-third-ticks { animation: none; }

                                   }



                                `}</style>



                            </div>



                       </div>



                   </div>



               </section>



           <section className="relative px-6 pb-24 z-10">



                   <div className="max-w-7xl mx-auto">



                       <div className="text-center mb-14 slide-up">



                           <h2 className="heading text-4xl md:text-5xl mb-4">



                               Choose Your Inspection in{" "}



                               {selectedCityName}



                           </h2>



                           <p className="text-xs uppercase tracking-[0.35em] font-black text-[#6366F1]">



                               OUR SERVICES



                           </p>



                           <p className="subtext max-w-2xl mx-auto mt-5">



                               Whether you're taking delivery of a brand-new vehicle



                               or buying a pre-owned car in {selectedCityName}, our independent inspectors



                               help you make the right decision.



                           </p>



                       </div>



                       <div className="grid lg:grid-cols-2 gap-8">



                           <Link



                               href="/new-cars"



                               className="group relative overflow-hidden rounded-[2.5rem] card-glass border border-[#E0E7FF] p-10 hover:-translate-y-3 hover:shadow-2xl transition-all duration-500"



                           >



                               <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-500 bg-gradient-to-br from-[#E0E7FF]/50 via-white to-white" />



                               <div className="relative">



                                   <div className="flex justify-between items-start">



                                       <div>



                                           <div className="w-20 h-20 rounded-3xl bg-[#E0E7FF] flex items-center justify-center text-5xl mb-8 group-hover:rotate-6 transition">



                                               🚗



                                           </div>



                                           <span className="inline-block rounded-full bg-[#E0E7FF] text-[#4F46E5] px-4 py-2 text-xs font-black uppercase tracking-widest">



                                               New Car PDI



                                           </span>



                                       </div>



                                       <span className="rounded-full bg-[#E0E7FF] px-4 py-2 text-xs font-black uppercase tracking-widest text-[#4F46E5]">



                                           From ₹{formatPrice(newCarStartingPrice)}



                                       </span>



                                   </div>



                                   <h3 className="heading text-4xl mt-8 mb-4">



                                       Pre-Delivery Inspection



                                   </h3>



                                   <p className="subtext leading-relaxed mb-8">



                                       Before accepting delivery from the showroom in {selectedCityName},



                                       let our experts inspect your vehicle for



                                       transport damage, repaint work, electronic



                                       issues and manufacturing defects.



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



                                               <div className="w-7 h-7 rounded-full bg-[#E0E7FF] flex items-center justify-center text-[#6366F1] font-black text-sm">



                                                   ✓



                                               </div>



                                               <span className="font-semibold text-sm">



                                                   {item}



                                               </span>



                                           </div>



                                       ))}



                                   </div>



                                   <div className="mt-10 flex items-center justify-between">



                                       <span className="font-black text-[#6366F1] group-hover:translate-x-2 transition">



                                           Explore Service →



                                       </span>



                                       <div className="rounded-2xl bg-[#6366F1] text-white px-5 py-3 font-black shadow-lg">



                                           NEW CARS



                                       </div>



                                   </div>



                               </div>



                           </Link>



                           <Link



                               href="/used-cars"



                               className="group relative overflow-hidden rounded-[2.5rem] bg-[#3730A3] text-white p-10 hover:-translate-y-3 hover:shadow-2xl transition-all duration-500"



                           >



                               <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-500 bg-gradient-to-br from-[#4F46E5] via-[#3730A3] to-[#3730A3]" />



                               <div className="relative">



                                   <div className="flex justify-between items-start">



                                       <div>



                                           <div className="w-20 h-20 rounded-3xl bg-[#818CF8]/15 flex items-center justify-center text-5xl mb-8 group-hover:-rotate-6 transition">



                                               🚙



                                           </div>



                                           <span className="inline-block rounded-full bg-[#818CF8]/20 text-[#E0E7FF] px-4 py-2 text-xs font-black uppercase tracking-widest">



                                               Used Car PPI



                                           </span>



                                       </div>



                                       <span className="rounded-full bg-[#818CF8]/20 px-4 py-2 text-xs font-black uppercase tracking-widest text-[#A5B4FC]">



                                           From ₹{formatPrice(usedCarStartingPrice)}



                                       </span>



                                   </div>



     <h3 className="!text-white text-4xl mt-8 mb-4">



       Pre-Purchase Inspection



</h3>



                                   <p className="leading-relaxed text-[#E0E7FF] mb-8">



                                       Avoid buying a problematic vehicle in {selectedCityName}. We inspect



                                       accident history, engine condition, suspension,



                                       electronics and hidden defects before you pay.



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



                                               <div className="w-7 h-7 rounded-full bg-[#818CF8]/15 flex items-center justify-center text-[#A5B4FC] font-black text-sm">



                                                   ✓



                                               </div>



                                               <span className="font-semibold text-sm text-[#EEF2FF]">



                                                   {item}



                                               </span>



                                           </div>



                                       ))}



                                   </div>



                                   <div className="mt-10 flex items-center justify-between">



                                       <span className="font-black text-[#A5B4FC] group-hover:translate-x-2 transition">



                                           Explore Service →



                                       </span>



                                       <div className="rounded-2xl bg-white text-[#3730A3] px-5 py-3 font-black shadow-lg">



                                           USED CARS



                                       </div>



                                   </div>



                               </div>



                           </Link>



                       </div>



                   </div>



               </section>



               <section className="px-6 py-24 relative z-10">



                   <div className="max-w-7xl mx-auto">



                       <div className="text-center mb-16 slide-up">



                           <p className="text-xs font-black tracking-[0.35em] uppercase text-[#6366F1]">



                               WHY INSPECTMYCAR



                           </p>



                           <h2 className="heading text-4xl md:text-5xl mt-4">



                               The Smart Way To Buy A Car in{" "}



                               {selectedCityName}



                           </h2>



                           <p className="subtext max-w-2xl mx-auto mt-5">



                               We represent only one person during the inspection —



                               <b> you.</b> Every report is unbiased, transparent and



                               designed to help you make a confident purchase.



                           </p>



                       </div>



                       <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-8">



                           {[



                               {



                                   icon: "🛡️",



                                   title: "Independent Experts",



                                   desc: "We don't work for dealerships or sellers. Every inspection is completely unbiased.",



                               },



                               {



                                   icon: "🔍",



                                   title: "400 Checkpoints",



                                   desc: "From paint quality to engine diagnostics, we inspect every critical system.",



                               },



                               {



                                   icon: "📄",



                                   title: "Instant Report",



                                   desc: "Receive a detailed digital report with photographs and recommendations.",



                               },



                               {



                                   icon: "⚡",



                                   title: "Same Day Service",



                                   desc: `Fast scheduling and inspections across ${selectedCityName} & nearby areas.`,



                               },



                           ].map((item, i) => (



                               <div



                                   key={item.title}



                                   className="group card-glass rounded-[2rem] border border-[#E0E7FF] p-8 hover:-translate-y-3 hover:shadow-2xl transition-all duration-500"



                                   style={{



                                       animationDelay: `${i * 0.1}s`,



                                   }}



                               >



                                   <div className="w-16 h-16 rounded-3xl bg-[#E0E7FF] flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition">



                                       {item.icon}



                                   </div>



                                   <h3 className="font-black text-xl mb-4">



                                       {item.title}



                                   </h3>



                                   <p className="subtext leading-relaxed">



                                       {item.desc}



                                   </p>



                               </div>



                           ))}



                       </div>



                   </div>



               </section>



               <section className="px-6 pb-24 z-10 relative">



                   <div className="max-w-6xl mx-auto">



                       <div className="text-center mb-16">



                           <p className="text-xs uppercase tracking-[0.35em] font-black text-[#6366F1]">



                               SIMPLE PROCESS



                           </p>



                           <h2 className="heading text-4xl md:text-5xl mt-4">



                               How It Works



                           </h2>



                       </div>



                       <div className="space-y-10">



                           {[



                               {



                                   no: "01",



                                   title: "Choose Inspection",



                                   desc: "Select New Car PDI or Used Car Inspection based on your purchase.",



                               },



                               {



                                   no: "02",



                                   title: "Book Your Slot",



                                   desc: `Choose your preferred inspection date, time and dealership or seller location in ${selectedCityName}.`,



                               },



                               {



                                   no: "03",



                                   title: "Expert Inspection",



                                   desc: "Our certified inspector performs a comprehensive 400 point inspection.",



                               },



                               {



                                   no: "04",



                                   title: "Receive Report",



                                   desc: "Get a detailed digital report with findings, photos and expert recommendations.",



                               },



                           ].map((step, index) => (



                               <div



                                   key={step.no}



                                   className="flex gap-8 items-start group"



                               >



                                   <div className="relative">



                                       <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#4F46E5] to-[#818CF8] text-white flex items-center justify-center text-2xl font-black shadow-xl group-hover:scale-110 transition">



                                           {step.no}



                                       </div>



                                       {index !== 3 && (



                                           <div className="absolute top-20 left-1/2 -translate-x-1/2 w-1 h-20 bg-gradient-to-b from-[#818CF8] to-transparent" />



                                       )}



                                   </div>



                                   <div className="pt-3">



                                       <h3 className="text-2xl font-black mb-3">



                                           {step.title}



                                       </h3>



                                       <p className="subtext leading-relaxed max-w-xl">



                                           {step.desc}



                                       </p>



                                   </div>



                               </div>



                           ))}



                       </div>



                   </div>



               </section>



               <section className="px-6 py-24 bg-gradient-to-b from-transparent to-[#E0E7FF]/30 z-10 relative">



                   <div className="max-w-7xl mx-auto">



                       <div className="text-center mb-16">



                           <p className="text-xs uppercase tracking-[0.35em] font-black text-[#6366F1]">



                               CUSTOMER STORIES



                           </p>



                           <h2 className="heading text-4xl md:text-5xl mt-4">



                               Trusted By Car Buyers Across{" "}



                               {selectedCityName}



                           </h2>



                           <p className="subtext mt-5 max-w-2xl mx-auto">



                               Thousands of buyers have avoided expensive mistakes



                               with InspectMyCar.



                           </p>



                       </div>



                       <div className="grid lg:grid-cols-3 gap-8">



                           {[



                               {



                                   name: "Rahul P.",



                                   title: "New Car Buyer",



                                   review:



                                       "The inspection found transport scratches on my new SUV. The dealership polished and replaced two panels before delivery. Totally worth it.",



                               },



                               {



                                   name: "Neha S.",



                                   title: "Used Car Buyer",



                                   review:



                                       "Saved me from buying an accidental vehicle. The seller never disclosed previous repairs. Best ₹1999 I've spent.",



                               },



                               {



                                   name: "Amit K.",



                                   title: "Car Owner",



                                   review:



                                       "Professional inspector, detailed report and explained everything patiently. Booking process was very smooth.",



                               },



                           ].map((item) => (



                               <div



                                   key={item.name}



                                   className="card-glass rounded-[2rem] p-8 border border-[#E0E7FF] hover:-translate-y-2 hover:shadow-2xl transition-all duration-500"



                               >



                                   <div className="flex mb-5 text-[#818CF8] text-xl">



                                       ★★★★★



                                   </div>



                                   <p className="subtext leading-relaxed italic">



                                       "{item.review}"



                                   </p>



                                   <div className="mt-8">



                                       <p className="font-black text-lg">



                                           {item.name}



                                       </p>



                                       <p className="text-sm text-[#6366F1]">



                                           {item.title}



                                       </p>



                                   </div>



                               </div>



                           ))}



                       </div>



                   </div>



               </section>



               <section className="px-6 pb-24 z-10 relative">



                   <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-6">



                       {[



                           ["5000+", "Cars Inspected"],



                           ["400", "Inspection Points"],



                           ["4.9★", "Average Rating"],



                           ["100%", "Independent"],



                       ].map(([value, label]) => (



                           <div



                               key={label}



                               className="card-glass rounded-[2rem] p-10 text-center border border-[#E0E7FF] hover:-translate-y-2 hover:shadow-xl transition-all duration-500"



                           >



                               <div className="text-5xl font-black bg-gradient-to-r from-[#4F46E5] to-[#818CF8] bg-clip-text text-transparent">



                                   {value}



                               </div>



                               <p className="mt-3 uppercase tracking-widest text-xs font-black text-[#6366F1]">



                                   {label}



                               </p>



                           </div>



                       ))}



                   </div>



               </section>



<section className="px-6 pb-32 z-10 relative">



       <div className="relative overflow-hidden rounded-[3rem] max-w-6xl mx-auto shadow-2xl shadow-[#818CF8]/15">



           {/* Softer blue gradient */}



          <div className="absolute inset-0 bg-gradient-to-r from-[#3730A3] via-[#6366F1] to-[#818CF8]" />



           {/* Soft blue glow effects */}



           <div className="absolute -top-32 -left-24 w-80 h-80 rounded-full bg-[#A5B4FC]/25 blur-3xl" />



           <div className="absolute -bottom-32 -right-24 w-96 h-96 rounded-full bg-[#E0E7FF]/25 blur-3xl" />



           <div className="relative px-6 sm:px-10 py-16 sm:py-20 text-center text-white">



               <p className="text-xs uppercase tracking-[0.35em] font-black text-white/90">



                   READY TO BUY IN{" "}



                   {selectedCityName.toUpperCase()}?



               </p>



               <h2 className="!text-white text-4xl md:text-6xl font-black mt-5 leading-tight">



                   Inspect Before



                   <br />



                   You Invest



               </h2>



               <p className="max-w-2xl mx-auto mt-8 text-white/90 text-lg leading-relaxed">



                   Whether it's a brand-new vehicle or a used car in {selectedCityName},



                   our certified inspectors help you make the right



                   buying decision with a comprehensive inspection



                   and digital report.



               </p>



               {/* Pricing cards */}



               <div className="mt-10 flex flex-wrap justify-center gap-4">



                   <div className="rounded-2xl bg-white/15 border border-white/30 backdrop-blur-xl px-6 py-4">



                       <p className="text-[10px] uppercase tracking-[0.2em] font-black text-white/90">



                           New Car PDI From



                       </p>



                       <p className="text-2xl font-black mt-1 text-white">



                           ₹{formatPrice(newCarStartingPrice)}



                       </p>



                   </div>



                   <div className="rounded-2xl bg-white/15 border border-white/30 backdrop-blur-xl px-6 py-4">



                       <p className="text-[10px] uppercase tracking-[0.2em] font-black text-white/90">



                           Used Car PPI From



                       </p>



                       <p className="text-2xl font-black mt-1 text-white">



                           ₹{formatPrice(usedCarStartingPrice)}



                       </p>



                   </div>



                   <div className="rounded-2xl bg-white/15 border border-white/30 backdrop-blur-xl px-6 py-4">



                       <p className="text-[10px] uppercase tracking-[0.2em] font-black text-white/90">



                           EV Inspection



                       </p>



                       <p className="text-2xl font-black mt-1 text-white">



                           ₹{formatPrice(evPrice)}



                       </p>



                   </div>



               </div>



               {/* Action buttons */}



               <div className="flex flex-wrap justify-center gap-5 mt-12">



                   <button



                       onClick={openBookingChooser}



                       className="rounded-2xl bg-white text-[#4F46E5] px-8 sm:px-10 py-5 font-black shadow-xl shadow-[#3730A3]/20 hover:bg-[#EEF2FF] hover:-translate-y-1 hover:shadow-2xl transition-all duration-300"



                   >



                       Book Inspection in{" "}



                       {selectedCityName}



                   </button>



                   <a



                       href="https\\://wa.me/919975934213"



                       className="rounded-2xl border border-white/50 bg-white/10 text-white backdrop-blur-xl px-8 sm:px-10 py-5 font-black hover:bg-white/20 hover:-translate-y-1 transition-all duration-300"



                   >



                       💬 WhatsApp Expert



                   </a>



               </div>



           </div>



       </div>



</section>



           </main>



       );



}
