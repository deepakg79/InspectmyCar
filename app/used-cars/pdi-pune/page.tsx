import { Metadata } from "next";
import CarPDIPuneClient from "./CarPDIPuneClient";

export const metadata: Metadata = {
    title: "Car PDI Inspection Pune | InspectMyCar - Pre Delivery Experts",
    description:
        "Professional 299+ point car pre-delivery inspection in Pune. Detect transit damage, repaint issues & OBD errors before delivery. Book today!",
    keywords: [
        "car pdi pune",
        "car inspection near me",
        "pre delivery inspection pune",
        "car inspection before delivery pune",
        "new car pdi pune",
        "car delivery inspection pune",
    ],
    openGraph: {
        title: "Car PDI Inspection Pune | InspectMyCar",
        description:
            "Professional 299+ point inspection in Pune. Detect hidden damage before delivery.",
        url: "https://inspectmycar.in/car-pdi-pune",
        siteName: "InspectMyCar",
        images: [
            {
                url: "/og-image.jpg",
                width: 1200,
                height: 630,
            },
        ],
        locale: "en_IN",
        type: "website",
    },
    alternates: {
        canonical: "https://inspectmycar.in/car-pdi-pune",
    },
    twitter: {
        card: "summary_large_image",
        title: "Car PDI Inspection Pune",
        description: "Book expert car inspection before delivery in Pune.",
        images: ["/og-image.jpg"],
    },
};

export default function Page() {
    return (
        <>
            <CarPDIPuneClient />

            {/* 🔥 FULL SEO SCHEMA */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify([
                        {
                            "@context": "https://schema.org",
                            "@type": "LocalBusiness",
                            name: "InspectMyCar",
                            image: "https://inspectmycar.in/logo.png",
                            url: "https://inspectmycar.in",
                            telephone: "+919975934213",
                            priceRange: "₹₹",
                            address: {
                                "@type": "PostalAddress",
                                addressLocality: "Pune",
                                addressRegion: "MH",
                                addressCountry: "IN",
                            },
                            geo: {
                                "@type": "GeoCoordinates",
                                latitude: "18.5204",
                                longitude: "73.8567",
                            },
                            areaServed: {
                                "@type": "Place",
                                name: "Pune & PCMC",
                            },
                            sameAs: [
                                "https://wa.me/919975934213"
                            ],
                            aggregateRating: {
                                "@type": "AggregateRating",
                                ratingValue: "4.9",
                                reviewCount: "1000",
                            },
                        },
                        {
                            "@context": "https://schema.org",
                            "@type": "Service",
                            serviceType: "Car Pre Delivery Inspection",
                            provider: {
                                "@type": "LocalBusiness",
                                name: "InspectMyCar",
                            },
                            areaServed: {
                                "@type": "City",
                                name: "Pune",
                            },
                            description:
                                "299+ point professional car inspection before delivery in Pune dealerships.",
                        },
                    ]),
                }}
            />
        </>
    );
}