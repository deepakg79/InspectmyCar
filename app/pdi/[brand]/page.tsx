import { Metadata } from "next";
import BrandPageClient from "./BrandPageClient";
import { BRAND_CHECKPOINTS } from "../../components/brandCheckpoints"; // Assuming you created this file

type Props = {
    params: Promise<{ brand: string }>;
};

const getCleanBrand = (slug: string) => {
    const brandOnly = slug.replace("-pune", "");
    return brandOnly.charAt(0).toUpperCase() + brandOnly.slice(1);
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { brand } = await params;
    const cleanBrand = getCleanBrand(brand);

    const url = `https://yourdomain.com/pdi/${brand}`;

    return {
        title: `Expert ${cleanBrand} PDI Services in Pune | InspectMyCar`,
        description: `Professional 299+ point Pre-Delivery Inspection for ${cleanBrand} cars in Pune. Don't take delivery without a certified expert check.`,

        // ✅ ADD THIS (safe, no impact on your logic)
        alternates: {
            canonical: url,
        },

        // ✅ ADD THIS (no runtime impact)
        openGraph: {
            title: `Expert ${cleanBrand} PDI Services in Pune`,
            description: `Book certified ${cleanBrand} car inspection in Pune.`,
            url,
            siteName: "InspectMyCar",
            images: [
                {
                    url: `/brands/${brand.replace("-pune", "")}.jpg`,
                    width: 1200,
                    height: 630,
                },
            ],
            locale: "en_IN",
            type: "website",
        },
    };
}

export default async function BrandPDIPage({ params }: Props) {
    const { brand: rawBrand } = await params;
    const displayBrand = getCleanBrand(rawBrand);
    const brandSlug = rawBrand.replace("-pune", "").toLowerCase();

    // Get brand-specific checks or fall back to general
    const checkpoints = BRAND_CHECKPOINTS[brandSlug] || BRAND_CHECKPOINTS.general;

    return (
        <main className="bg-main text-slate-900 min-h-screen selection:bg-indigo-100 selection:text-indigo-700">
            {/* HERO SECTION */}
            <section className="relative pt-40 pb-20 px-6 max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
                <div className="text-center lg:text-left slide-up">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full card-glass text-indigo-600 text-xs font-black uppercase tracking-widest mb-8 border-indigo-100">
                        📍 {displayBrand} Specialists in Pune
                    </div>

                    <h1 className="heading text-5xl md:text-7xl leading-[0.95] mb-8">
                        Buying a New <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-pink-500">
                            {displayBrand}?
                        </span>
                        <br />Inspect It First.
                    </h1>

                    <p className="subtext text-lg max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium mb-10">
                        Expert 200+ point PDI for all {displayBrand} models across Pune dealerships.
                        We identify transit damage, repainted panels, and electronic glitches.
                    </p>

                    <BrandPageClient brand={displayBrand} />
                </div>

                <div className="relative slide-up">
                    <div className="relative rounded-[3rem] overflow-hidden border-8 border-white shadow-2xl group">
                        <img
                            src={`/brands/${brandSlug}.jpg`}
                            alt={`${displayBrand} inspection in Pune`}
                            className="w-full h-[500px] object-cover transition duration-500 group-hover:scale-110"
                        />
                        <div className="absolute -bottom-6 -right-6 card-glass p-6 shadow-xl border-white">
                            <p className="text-indigo-600 font-black text-2xl">Certified</p>
                            <p className="text-[10px] font-bold uppercase tracking-widest subtext">{displayBrand} PDI Expert</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* DYNAMIC CHECKLIST SECTION */}
            <section className="max-w-6xl mx-auto px-6 py-24 border-t border-slate-100">
                <div className="text-center mb-16">
                    <h2 className="heading text-4xl mb-4">Our {displayBrand} Specializations</h2>
                    <p className="subtext">Specifically curated for {displayBrand}&apos;s common factory and transit issues.</p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    {checkpoints.map((item, index) => (
                        <div key={index} className="flex items-start gap-4 p-6 rounded-3xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                            <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center shrink-0">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <div>
                                <p className="font-bold text-slate-900 leading-tight">{item}</p>
                                <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-widest font-black">Critical Checkpoint</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </main>
    );
}