import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Used Car Inspection | Pre-Purchase Inspection in Pune | InspectMyCar",
    description:
        "Buy a used car with confidence. InspectMyCar provides independent pre-purchase vehicle inspections in Pune covering engine, gearbox, accident damage, flood damage, paint thickness, OBD diagnostics and road tests.",

    keywords: [
        "Used Car Inspection Pune",
        "Pre Purchase Inspection Pune",
        "Second Hand Car Inspection",
        "Used Car Check Pune",
        "Car Inspection Before Buying",
        "Vehicle Inspection Pune",
        "OBD Scan",
        "Accident Detection",
        "Flood Damage Inspection",
    ],

    alternates: {
        canonical: "https://inspectmycar.in/used-cars",
    },

    openGraph: {
        title: "Used Car Inspection | InspectMyCar",
        description:
            "Independent Pre-Purchase Inspection for Used Cars in Pune.",
        url: "https://inspectmycar.in/used-cars",
        siteName: "InspectMyCar",
        images: [
            {
                url: "/og-image.jpg",
                width: 1200,
                height: 630,
                alt: "InspectMyCar Used Car Inspection",
            },
        ],
        locale: "en_IN",
        type: "website",
    },

    twitter: {
        card: "summary_large_image",
        title: "Used Car Inspection | InspectMyCar",
        description:
            "Pre-Purchase Inspection for Used Cars in Pune.",
        images: ["/og-image.jpg"],
    },

    robots: {
        index: true,
        follow: true,
    },
};

export default function UsedCarsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <section className="min-h-screen bg-main text-slate-900">
            {children}
        </section>
    );
}