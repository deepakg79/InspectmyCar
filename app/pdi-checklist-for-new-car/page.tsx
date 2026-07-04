import type { Metadata } from "next";
import PageClient from "./PageClient";

export const metadata: Metadata = {
    title: "PDI Checklist for New Car (2026 Guide) | InspectMyCar",
    description:
        "Complete Pre-Delivery Inspection (PDI) checklist for new cars. Learn what to inspect before taking delivery and avoid hidden defects, repaint issues, and costly mistakes.",
    keywords: [
        "PDI checklist",
        "new car PDI checklist",
        "pre delivery inspection checklist",
        "car delivery checklist",
        "car inspection before delivery",
        "PDI Pune",
        "new car inspection Pune",
    ],
    alternates: {
        canonical:
            "https://inspectmycar.in/pdi-checklist-for-new-car",
    },
    openGraph: {
        title:
            "PDI Checklist for New Car (2026 Guide)",
        description:
            "Complete expert checklist before taking delivery of your new car. Learn what to inspect and avoid costly mistakes.",
        url: "https://inspectmycar.in/pdi-checklist-for-new-car",
        siteName: "InspectMyCar",
        images: [
            {
                url: "/og-image.jpg",
                width: 1200,
                height: 630,
            },
        ],
        locale: "en_IN",
        type: "article",
    },
    twitter: {
        card: "summary_large_image",
        title: "PDI Checklist for New Car",
        description:
            "Complete expert checklist before taking delivery of your new car.",
        images: ["/og-image.jpg"],
    },
};

export default function Page() {
    return <PageClient />;
}