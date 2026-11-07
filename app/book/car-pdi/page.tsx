import type { Metadata } from "next";
import Script from "next/script";

import CarPDIClient from "./CarPDIClient";

/* -------------------------------------------------------------------------- */
/*                                  CITIES                                    */
/* -------------------------------------------------------------------------- */

const CITIES = {
    pune: {
        name: "Pune",
        region: "Maharashtra",
        latitude: "18.5204",
        longitude: "73.8567",
        areaServed: "Pune and PCMC",
    },

    mumbai: {
        name: "Mumbai",
        region: "Maharashtra",
        latitude: "19.0760",
        longitude: "72.8777",
        areaServed: "Mumbai",
    },

    nashik: {
        name: "Nashik",
        region: "Maharashtra",
        latitude: "20.0059",
        longitude: "73.7797",
        areaServed: "Nashik",
    },

    kolhapur: {
        name: "Kolhapur",
        region: "Maharashtra",
        latitude: "16.7050",
        longitude: "74.2433",
        areaServed: "Kolhapur",
    },

    nagpur: {
        name: "Nagpur",
        region: "Maharashtra",
        latitude: "21.1458",
        longitude: "79.0882",
        areaServed: "Nagpur",
    },

    "chhatrapati-sambhajinagar": {
        name: "Chhatrapati Sambhajinagar",
        region: "Maharashtra",
        latitude: "19.8762",
        longitude: "75.3433",
        areaServed: "Chhatrapati Sambhajinagar",
    },

    solapur: {
        name: "Solapur",
        region: "Maharashtra",
        latitude: "17.6599",
        longitude: "75.9064",
        areaServed: "Solapur",
    },

    sangli: {
        name: "Sangli",
        region: "Maharashtra",
        latitude: "16.8524",
        longitude: "74.5815",
        areaServed: "Sangli",
    },

    baramati: {
        name: "Baramati",
        region: "Maharashtra",
        latitude: "18.1517",
        longitude: "74.5777",
        areaServed: "Baramati",
    },

    satara: {
        name: "Satara",
        region: "Maharashtra",
        latitude: "17.6805",
        longitude: "74.0183",
        areaServed: "Satara",
    },
} as const;

type CitySlug = keyof typeof CITIES;

/* -------------------------------------------------------------------------- */
/*                              STATIC PARAMS                                 */
/* -------------------------------------------------------------------------- */

export function generateStaticParams() {
    return Object.keys(CITIES).map((city) => ({
        city,
    }));
}

export const dynamicParams = false;

/* -------------------------------------------------------------------------- */
/*                              CITY RESOLVER                                 */
/* -------------------------------------------------------------------------- */

function getCity(citySlug: string) {
    return CITIES[citySlug as CitySlug] ?? null;
}

/* -------------------------------------------------------------------------- */
/*                                METADATA                                   */
/* -------------------------------------------------------------------------- */

export async function generateMetadata({
    params,
}: {
    params: Promise<{ city: string }>;
}): Promise<Metadata> {
    const { city: citySlug } = await params;

    const city = getCity(citySlug);

    if (!city) {
        return {
            title: "Car PDI Inspection Maharashtra | InspectMyCar",
            description:
                "Professional car pre-delivery and pre-purchase inspection services across Maharashtra.",
        };
    }

    const cityName = city.name;

    const title =
        `Car PDI Inspection ${cityName} | New & Used Car Inspection | InspectMyCar`;

    const description =
        `Professional 400+ point car PDI inspection in ${cityName}, Maharashtra. ` +
        `Check paint, body, transit damage, electronics, OBD, tyres, interiors and more before taking delivery of your new car.`;

    const canonical =
        `https://inspectmycar.in/${citySlug}/car-pdi`;

    return {
        title,
        description,

        keywords: [
            `car pdi ${cityName.toLowerCase()}`,
            `car inspection ${cityName.toLowerCase()}`,
            `car inspection near me ${cityName.toLowerCase()}`,
            `pre delivery inspection ${cityName.toLowerCase()}`,
            `new car pdi ${cityName.toLowerCase()}`,
            `car delivery inspection ${cityName.toLowerCase()}`,
            `new car inspection ${cityName.toLowerCase()}`,
            `used car inspection ${cityName.toLowerCase()}`,
            `car inspection before delivery ${cityName.toLowerCase()}`,
            `car pdi Maharashtra`,
            "car PDI inspection Maharashtra",
            "pre delivery inspection Maharashtra",
            "new car inspection Maharashtra",
        ],

        alternates: {
            canonical,
        },

        openGraph: {
            title,
            description,
            url: canonical,
            siteName: "InspectMyCar",
            locale: "en_IN",
            type: "website",
            images: [
                {
                    url: "/og-image.jpg",
                    width: 1200,
                    height: 630,
                    alt: `Car PDI Inspection in ${cityName}`,
                },
            ],
        },

        twitter: {
            card: "summary_large_image",
            title,
            description,
            images: ["/og-image.jpg"],
        },

        robots: {
            index: true,
            follow: true,
        },
    };
}

/* -------------------------------------------------------------------------- */
/*                                  PAGE                                      */
/* -------------------------------------------------------------------------- */

export default async function CarPDIPage({
    params,
}: {
    params: Promise<{ city: string }>;
}) {
    const { city: citySlug } = await params;

    const city = getCity(citySlug);

    if (!city) {
        return null;
    }

    const canonical =
        `https://inspectmycar.in/${citySlug}/car-pdi`;

    const schema = [
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
                addressLocality: city.name,
                addressRegion: "MH",
                addressCountry: "IN",
            },

            geo: {
                "@type": "GeoCoordinates",
                latitude: city.latitude,
                longitude: city.longitude,
            },

            areaServed: {
                "@type": "City",
                name: city.areaServed,
            },

            sameAs: [
                "https://wa.me/919975934213",
            ],
        },

        {
            "@context": "https://schema.org",
            "@type": "Service",
            serviceType:
                "Car Pre-Delivery Inspection and Vehicle Inspection",

            name:
                `Car PDI Inspection in ${city.name}`,

            description:
                `Professional 400+ point vehicle inspection for new and used cars in ${city.name}, Maharashtra.`,

            provider: {
                "@type": "LocalBusiness",
                name: "InspectMyCar",
                url: "https://inspectmycar.in",
                telephone: "+919975934213",
            },

            areaServed: {
                "@type": "City",
                name: city.name,
            },

            url: canonical,
        },

        {
            "@context": "https://schema.org",
            "@type": "WebPage",
            name:
                `Car PDI Inspection in ${city.name}`,

            description:
                `Professional car pre-delivery inspection and vehicle inspection services in ${city.name}, Maharashtra.`,

            url: canonical,

            about: {
                "@type": "Service",
                name: "Car PDI Inspection",
            },

            inLanguage: "en-IN",
        },

        {
            "@context": "https://schema.org",
            "@type": "FAQPage",

            mainEntity: [
                {
                    "@type": "Question",
                    name:
                        `Do you inspect new and used cars in ${city.name}?`,

                    acceptedAnswer: {
                        "@type": "Answer",
                        text:
                            `Yes. InspectMyCar provides Pre-Delivery Inspection (PDI) for new cars and Pre-Purchase Inspection (PPI) for used cars in ${city.name}.`,
                    },
                },

                {
                    "@type": "Question",
                    name:
                        "How many checkpoints are covered in the inspection?",

                    acceptedAnswer: {
                        "@type": "Answer",
                        text:
                            "Our inspection covers 400+ inspection points including body, paint, engine, electronics, suspension, tyres, interiors, documentation and other important vehicle components.",
                    },
                },

                {
                    "@type": "Question",
                    name:
                        "Do you perform OBD diagnostics?",

                    acceptedAnswer: {
                        "@type": "Answer",
                        text:
                            "Yes. Compatible vehicles can be scanned using professional diagnostic equipment to identify relevant engine, ABS, transmission, airbag and electronic fault codes.",
                    },
                },

                {
                    "@type": "Question",
                    name:
                        `How long does a car inspection take in ${city.name}?`,

                    acceptedAnswer: {
                        "@type": "Answer",
                        text:
                            "Most inspections take approximately one to two hours depending on the vehicle and inspection type.",
                    },
                },
                {
                    "@type": "Question",
                    name:
                        "Will I receive a digital inspection report?",

                    acceptedAnswer: {
                        "@type": "Answer",
                        text:
                            "Yes. A detailed digital inspection report with photographs, findings and recommendations is provided after the inspection.",
                    },
                },
            ],
        },
    ];

    return (
        <>
            <CarPDIClient
                citySlug={citySlug}
                cityName={city.name}
            />

            <Script
                id={`car-pdi-schema-${citySlug}`}
                type="application/ld+json"
                strategy="afterInteractive"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(schema),
                }}
            />
        </>
    );
}